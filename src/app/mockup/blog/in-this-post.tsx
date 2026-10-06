"use client";

import { useEffect, useState } from "react";
import styles from "./blog.module.css";

export function InThisPost({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = sections.map((section) => section.id);

    function update() {
      const line = 96;
      let current: string | null = null;
      for (const id of ids) {
        const heading = document.getElementById(id);
        if (!heading) continue;
        if (heading.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId((previous) => (previous === current ? previous : current));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

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

  return (
    <nav aria-labelledby="toc-title" className={styles.toc}>
      <p id="toc-title" className={styles.railHeading}>
        In this post
      </p>
      <ol>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={scrollToSection}
              aria-current={section.id === activeId ? "true" : undefined}
            >
              <span>{section.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
