"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./blog.module.css";
import { celebrate } from "./read-progress";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

const WAVE_WIDTH = 16;
const WAVE_MID = 8;
const WAVE_AMP = 5;
const WAVE_STEP = 14;

function squiggle(height: number) {
  const end = Math.max(height, 1);
  let path = `M ${WAVE_MID} 0`;
  let y = 0;
  let side = -1;
  let first = true;

  while (y < end - 0.25) {
    const remaining = end - y;
    const next = Math.min(end, y + WAVE_STEP);
    const controlY = (y + next) / 2;
    if (remaining < WAVE_STEP - 0.25) {
      const amp = WAVE_AMP * (remaining / WAVE_STEP);
      path += ` Q ${WAVE_MID + side * amp} ${controlY} ${WAVE_MID} ${end}`;
      break;
    }
    if (first) {
      path += ` Q ${WAVE_MID + side * WAVE_AMP} ${controlY} ${WAVE_MID} ${next}`;
      first = false;
    } else {
      path += ` T ${WAVE_MID} ${next}`;
    }
    y = next;
    side *= -1;
  }

  return path;
}

/** Path length where the squiggle's y meets `y`. The wave only travels down. */
function lengthAtY(path: SVGPathElement, y: number, total: number) {
  if (y <= 0) return 0;
  if (path.getPointAtLength(total).y <= y) return total;
  let low = 0;
  let high = total;
  for (let step = 0; step < 18; step += 1) {
    const mid = (low + high) / 2;
    if (path.getPointAtLength(mid).y < y) low = mid;
    else high = mid;
  }
  return high;
}

export function InThisPost({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const [done, setDone] = useState(false);
  const [progressNow, setProgressNow] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const meterRef = useRef<SVGSVGElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const celebrated = useRef(false);
  const stopBurst = useRef<(() => void) | null>(null);

  useEffect(() => {
    const ids = sections.map((section) => section.id);
    const article = document.querySelector("main article");
    let userScrolled = false;
    let placed = false;
    let stopKey = "";

    function meterSpan() {
      const meter = meterRef.current;
      const badge = badgeRef.current;
      const rail = railRef.current;
      if (!meter || !badge || !rail) return 0;
      const railBox = rail.getBoundingClientRect();
      const badgeBox = badge.getBoundingClientRect();
      const top = Number.parseFloat(getComputedStyle(meter).top) || 0;
      return Math.round(
        badgeBox.top + badgeBox.height / 2 - (railBox.top + top),
      );
    }

    function chapterY(index: number) {
      const list = listRef.current;
      const meter = meterRef.current;
      if (!list || !meter) return 0;
      const link = list.querySelectorAll("a")[index];
      if (!link) return 0;
      const linkBox = link.getBoundingClientRect();
      const meterBox = meter.getBoundingClientRect();
      return linkBox.top + linkBox.height / 2 - meterBox.top;
    }

    function paint(offset: number, spring: boolean) {
      const fill = fillRef.current;
      if (!fill) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!spring || reduce) {
        fill.style.transition = "none";
        fill.style.strokeDashoffset = `${offset}`;
        fill.getBoundingClientRect();
        fill.style.transition = "";
        return;
      }
      fill.style.strokeDashoffset = `${offset}`;
    }

    function update(geometryChanged = false) {
      const line = 96;
      let current: string | null = null;
      let index = 0;
      for (let item = 0; item < ids.length; item += 1) {
        const heading = document.getElementById(ids[item]);
        if (!heading) continue;
        if (heading.getBoundingClientRect().top <= line) {
          current = ids[item];
          index = item;
        }
      }
      setActiveId((previous) => (previous === current ? previous : current));

      const meter = meterRef.current;
      const fill = fillRef.current;
      const track = trackRef.current;
      if (!article || !meter || !fill || !track) return;

      const rect = article.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / rect.height);
      const height = meterSpan();
      let rebuilt = false;
      if (height > 1 && meter.dataset.h !== String(height)) {
        meter.style.height = `${height}px`;
        const path = squiggle(height);
        track.setAttribute("d", path);
        fill.setAttribute("d", path);
        meter.setAttribute("viewBox", `0 0 ${WAVE_WIDTH} ${height}`);
        const length = fill.getTotalLength();
        meter.dataset.h = String(height);
        meter.dataset.len = String(length);
        fill.style.strokeDasharray = `${length}`;
        rebuilt = true;
      }

      const length = Number(meter.dataset.len);
      const longEnough = rect.height > window.innerHeight + 80;
      const atEnd = userScrolled && longEnough && progress >= 0.995;
      if (length > 0) {
        const key = atEnd ? "end" : String(index);
        const moved = !placed || rebuilt || stopKey !== key;
        if (moved || geometryChanged) {
          const y = atEnd ? height : chapterY(index);
          const drawn = atEnd ? length : lengthAtY(fill, y, length);
          const spring =
            placed && !rebuilt && !geometryChanged && stopKey !== key;
          paint(length - drawn, spring);
          placed = true;
          stopKey = key;
          const percent = Math.round((drawn / length) * 100);
          setProgressNow((previous) =>
            previous === percent ? previous : percent,
          );
        }
      }

      if (progress <= 0.9 && celebrated.current) {
        celebrated.current = false;
        setDone(false);
      } else if (
        userScrolled &&
        longEnough &&
        progress >= 0.995 &&
        !celebrated.current
      ) {
        celebrated.current = true;
        setDone(true);
        stopBurst.current?.();
        const host = railRef.current;
        const badge = badgeRef.current;
        if (host && badge) {
          stopBurst.current = celebrate(host, badge, styles.confetti);
        }
      }
    }

    function onScroll() {
      userScrolled = true;
      update();
    }

    function onGeometry() {
      update(true);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onGeometry);
    const list = listRef.current;
    const rail = railRef.current;
    const observer = new ResizeObserver(onGeometry);
    if (rail) observer.observe(rail);
    if (list) {
      observer.observe(list);
      list.addEventListener("scroll", onGeometry, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onGeometry);
      observer.disconnect();
      list?.removeEventListener("scroll", onGeometry);
      stopBurst.current?.();
    };
  }, [sections]);

  useEffect(() => {
    const found = listRef.current;
    if (!found) return;
    const list = found;

    function revealCurrent() {
      const current = list.querySelector<HTMLElement>('[aria-current="true"]');
      if (!current) return;
      const listRect = list.getBoundingClientRect();
      const itemRect = current.getBoundingClientRect();
      if (itemRect.top < listRect.top - 1) {
        list.scrollTop -= listRect.top - itemRect.top;
      } else if (itemRect.bottom > listRect.bottom + 1) {
        list.scrollTop += itemRect.bottom - listRect.bottom;
      }
    }

    function updateFade() {
      const leftover = list.scrollHeight - list.scrollTop - list.clientHeight;
      setMoreBelow((previous) => {
        const next = leftover > 4;
        return previous === next ? previous : next;
      });
    }

    function onResize() {
      revealCurrent();
      updateFade();
    }

    revealCurrent();
    updateFade();
    list.addEventListener("scroll", updateFade, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      list.removeEventListener("scroll", updateFade);
      window.removeEventListener("resize", onResize);
    };
  }, [activeId, sections]);

  function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>) {
    const id = event.currentTarget.getAttribute("href")?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    history.pushState(null, "", `#${id}`);
    target.focus({ preventScroll: true });
  }

  const activeIndex = sections.findIndex((section) => section.id === activeId);

  return (
    <nav
      aria-labelledby="toc-title"
      className={moreBelow ? `${styles.toc} ${styles.tocHasMore}` : styles.toc}
      data-done={done ? "true" : undefined}
    >
      <div className={styles.tocHead}>
        <p id="toc-title" className={styles.railHeading}>
          In this post
        </p>
      </div>
      <div className={styles.tocBody}>
        <div ref={railRef} className={styles.tocRail}>
          <svg
            ref={meterRef}
            className={styles.tocMeter}
            role="progressbar"
            aria-label="Reading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressNow}
          >
            <path ref={trackRef} className={styles.tocMeterTrack} />
            <path ref={fillRef} className={styles.tocMeterFill} />
          </svg>
          <span ref={badgeRef} className={styles.tocBadge} aria-hidden="true" />
        </div>
        <div className={styles.tocList}>
          <ol ref={listRef}>
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={scrollToSection}
                  aria-current={section.id === activeId ? "true" : undefined}
                  data-arrived={
                    activeIndex >= 0 && index <= activeIndex
                      ? "true"
                      : undefined
                  }
                >
                  <span className={styles.tocLabel}>
                    <span>{section.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <p className={styles.tocFinishCopy}>
          <strong>
            You made it. <span aria-hidden="true">❤️</span>
          </strong>
        </p>
      </div>
      <p className={styles.srOnly} aria-live="polite">
        {done ? "You made it." : ""}
      </p>
    </nav>
  );
}
