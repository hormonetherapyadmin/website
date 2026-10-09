"use client";

import {
  BubbleChatQuestionIcon,
  ChartBarBigIcon,
  DropletIcon,
  HairDryerIcon,
  Idea01Icon,
  ManIcon,
  Medicine02Icon,
  Moon02Icon,
  ShieldCheckIcon,
  TestTube01Icon,
  UserQuestion01Icon,
  Wallet01Icon,
  WeightScaleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { NavIconName, NavItem, NavLink } from "@/lib/navigation";
import styles from "./mockup.module.css";

const ICONS: Record<NavIconName, IconSvgElement> = {
  Question: UserQuestion01Icon,
  Medicine: Medicine02Icon,
  Wallet: Wallet01Icon,
  "Test tube": TestTube01Icon,
  Person: ManIcon,
  Chat: BubbleChatQuestionIcon,
  Scale: WeightScaleIcon,
  Moon: Moon02Icon,
  Hair: HairDryerIcon,
  Drop: DropletIcon,
  Chart: ChartBarBigIcon,
  Idea: Idea01Icon,
  Shield: ShieldCheckIcon,
};

type Phase = "enter" | "open" | "slide" | "exit";

const PANEL_GUTTER = 16;

/**
 * `left` offset for a panel, relative to its menu item.
 * Narrow menus align to the item. The wide Providers menu is centered
 * on its item. Either one is pulled back inside the page when it would clip.
 */
function panelInset(panel: HTMLElement) {
  const boundary = panel.closest("[data-palette]")?.getBoundingClientRect();
  const limitRight = (boundary?.right ?? window.innerWidth) - PANEL_GUTTER;
  const limitLeft = (boundary?.left ?? 0) + PANEL_GUTTER;
  const item = panel.parentElement?.getBoundingClientRect();
  const itemLeft = item?.left ?? 0;
  const itemWidth = item?.width ?? 0;

  let left = 0;
  if (panel.hasAttribute("data-wide")) {
    left = (itemWidth - panel.offsetWidth) / 2;
  }

  const viewLeft = itemLeft + left;
  const viewRight = viewLeft + panel.offsetWidth;
  if (viewLeft < limitLeft) left += limitLeft - viewLeft;
  else if (viewRight > limitRight) left -= viewRight - limitRight;

  return left;
}

function destinationLeft(panel: HTMLElement, inset: number) {
  const itemLeft = panel.parentElement?.getBoundingClientRect().left ?? 0;
  return itemLeft + inset;
}

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LinkMark({ link }: { link: NavLink }) {
  if (link.logo) {
    return (
      <Image
        src={link.logo}
        alt=""
        width={24}
        height={24}
        className={styles.navLogo}
      />
    );
  }

  if (link.monogram) {
    return (
      <span className={styles.navMonogram} aria-hidden="true">
        {link.monogram}
      </span>
    );
  }

  if (!link.icon) return null;
  const named =
    link.icon in ICONS ? ICONS[link.icon as NavIconName] : undefined;
  if (named) {
    return (
      <HugeiconsIcon
        icon={named}
        size={20}
        strokeWidth={1.75}
        className={styles.navIcon}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={styles.navIconImage}
      style={
        {
          "--nav-icon": `url("${link.icon.replaceAll('"', "")}")`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

function MenuLink({ link }: { link: NavLink }) {
  return (
    <a
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener noreferrer" : undefined}
    >
      <LinkMark link={link} />
      {link.label}
    </a>
  );
}

function useDesktopHover() {
  const [desktopHover, setDesktopHover] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1101px) and (hover: hover) and (pointer: fine)",
    );
    const update = () => setDesktopHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return desktopHover;
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SiteNav({ items }: { items: NavItem[] }) {
  const id = useId();
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fromRight = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const desktopHover = useDesktopHover();
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("open");
  const [shiftX, setShiftX] = useState(0);
  const [panelInsetPx, setPanelInsetPx] = useState(0);

  const clearTimers = useCallback(() => {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    hideTimer.current = null;
    exitTimer.current = null;
  }, []);

  const hide = useCallback(() => {
    if (open === null) return;
    clearTimers();
    if (!desktopHover || reducedMotion()) {
      setOpen(null);
      setPhase("open");
      setShiftX(0);
      setPanelInsetPx(0);
      return;
    }
    if (phase === "exit") return;
    setPhase("exit");
    exitTimer.current = window.setTimeout(() => {
      setOpen(null);
      setPhase("open");
      setShiftX(0);
      setPanelInsetPx(0);
    }, 280);
  }, [clearTimers, desktopHover, open, phase]);

  const show = useCallback(
    (index: number) => {
      clearTimers();
      if (open === index) {
        setPhase("open");
        setShiftX(0);
        return;
      }

      const canSlide =
        desktopHover &&
        !reducedMotion() &&
        open !== null &&
        phase !== "enter" &&
        phase !== "exit" &&
        panelRef.current;

      if (canSlide && panelRef.current) {
        fromRight.current = panelRef.current.getBoundingClientRect().right;
        setShiftX(0);
        setPanelInsetPx(0);
        setPhase("slide");
        setOpen(index);
        return;
      }

      fromRight.current = null;
      setShiftX(0);
      setPanelInsetPx(0);
      setPhase(desktopHover && !reducedMotion() ? "enter" : "open");
      setOpen(index);
    },
    [clearTimers, desktopHover, open, phase],
  );

  const scheduleHide = useCallback(() => {
    if (!desktopHover) return;
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        navRef.current?.contains(active) &&
        active.closest("[data-nav-panel], [data-group]")
      ) {
        return;
      }
      hide();
    }, 160);
  }, [desktopHover, hide]);

  useEffect(() => {
    return () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
  }, []);

  useLayoutEffect(() => {
    if (open === null) return;

    if ((phase === "enter" || phase === "open") && panelRef.current) {
      setPanelInsetPx(panelInset(panelRef.current));
      if (phase !== "enter") return;
      const frame = requestAnimationFrame(() => setPhase("open"));
      return () => cancelAnimationFrame(frame);
    }

    if (phase === "slide" && panelRef.current && fromRight.current !== null) {
      const panel = panelRef.current;
      const inset = panelInset(panel);
      const destination = destinationLeft(panel, inset) + panel.offsetWidth;
      setPanelInsetPx(inset);
      setShiftX(fromRight.current - destination);
      const frame = requestAnimationFrame(() => {
        setShiftX(0);
        setPhase("open");
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open, phase]);

  useEffect(() => {
    if (open === null && !menuOpen) return;

    function closeAll() {
      hide();
      setMenuOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) closeAll();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const selector =
        open === null ? "[data-menu-toggle]" : `[data-group="${open}"]`;
      hide();
      setMenuOpen(false);
      navRef.current?.querySelector<HTMLButtonElement>(selector)?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hide, menuOpen, open]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={styles.nav}
      data-menu-open={menuOpen || undefined}
      onMouseEnter={() => {
        if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      }}
      onMouseLeave={scheduleHide}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          hide();
          setMenuOpen(false);
        }
      }}
    >
      <button
        type="button"
        className={styles.menuToggle}
        aria-expanded={menuOpen}
        aria-controls={`${id}-list`}
        data-menu-toggle
        onClick={() => setMenuOpen(!menuOpen)}
      >
        Menu
        <Chevron />
      </button>
      <ul id={`${id}-list`} className={styles.navList}>
        {items.map((item, index) =>
          "href" in item ? (
            <li
              key={item.label}
              onMouseEnter={() => {
                if (desktopHover) hide();
              }}
              onFocus={() => {
                if (desktopHover) hide();
              }}
            >
              <a
                href={item.href}
                className={styles.navLink}
                target={item.newTab ? "_blank" : undefined}
                rel={item.newTab ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </a>
            </li>
          ) : (
            <li
              key={item.label}
              className={styles.navItem}
              onMouseEnter={() => {
                if (desktopHover) show(index);
              }}
            >
              <button
                type="button"
                className={styles.navLink}
                aria-expanded={open === index}
                aria-haspopup="true"
                aria-controls={`${id}-${index}`}
                data-group={index}
                onFocus={() => {
                  if (desktopHover) show(index);
                }}
                onClick={() => {
                  if (desktopHover) return;
                  setPhase("open");
                  setOpen(open === index ? null : index);
                }}
              >
                {item.label}
                <Chevron />
              </button>
              {open === index ? (
                <div
                  ref={panelRef}
                  id={`${id}-${index}`}
                  className={styles.navPanel}
                  data-nav-panel
                  data-wide={item.columns.length > 1 || undefined}
                  data-phase={phase}
                  style={
                    {
                      "--shift-x": `${shiftX}px`,
                      left: panelInsetPx,
                    } as CSSProperties
                  }
                >
                  {item.columns.map((column, columnIndex) => (
                    <div key={`${column.heading ?? "links"}-${columnIndex}`}>
                      {column.heading ? (
                        <p className={styles.navHeading}>{column.heading}</p>
                      ) : null}
                      <ul>
                        {column.links.map((link) => (
                          <li key={`${link.href}:${link.label}`}>
                            <MenuLink link={link} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
