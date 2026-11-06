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
import Link from "next/link";
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

function HamburgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6 18 18M18 6 6 18" />
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
      style={iconMask(link.icon)}
      aria-hidden="true"
    />
  );
}

function iconMask(url: string): CSSProperties {
  return {
    "--nav-icon": `url("${url.replaceAll('"', "")}")`,
  } as CSSProperties;
}

export function HeaderCta({
  link,
  onClick,
}: {
  link: NavLink;
  onClick?: () => void;
}) {
  const named =
    link.icon && link.icon in ICONS
      ? ICONS[link.icon as NavIconName]
      : undefined;

  return (
    <Link
      href={link.href}
      className={styles.headerCta}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener noreferrer" : undefined}
      onClick={onClick}
    >
      {named ? (
        <HugeiconsIcon
          icon={named}
          size={18}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      ) : link.icon ? (
        <span
          className={styles.headerCtaIcon}
          style={iconMask(link.icon)}
          aria-hidden="true"
        />
      ) : null}
      {link.label}
    </Link>
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

type DrawerPhase = "closed" | "open" | "closing";

const DRAWER_MS = 280;

/** Scrollbar width taken before the page is locked, so the header does not shift. */
let lockedScrollGap = 0;
let lockedScrollY = 0;

function lockScroll() {
  const root = document.documentElement;
  lockedScrollY = window.scrollY;
  lockedScrollGap = window.innerWidth - root.clientWidth;
  root.style.paddingRight = lockedScrollGap > 0 ? `${lockedScrollGap}px` : "";
  root.style.overflow = "hidden";
}

function unlockScroll() {
  const root = document.documentElement;
  const y = lockedScrollY;
  root.style.overflow = "";
  root.style.paddingRight = "";
  lockedScrollGap = 0;
  if (window.scrollY !== y) {
    window.scrollTo({ top: y, left: 0, behavior: "auto" });
  }
}

function DrawerLink({
  link,
  onNavigate,
}: {
  link: NavLink;
  onNavigate: () => void;
}) {
  return (
    <a
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener noreferrer" : undefined}
      onClick={onNavigate}
    >
      <LinkMark link={link} />
      {link.label}
    </a>
  );
}

export function SiteNav({ items, cta }: { items: NavItem[]; cta?: NavLink }) {
  const id = useId();
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fromRight = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  /** Escape returns focus to the menu button. That focus must not reopen it. */
  const returningFocus = useRef(false);
  const desktopHover = useDesktopHover();
  const [drawer, setDrawer] = useState<DrawerPhase>("closed");
  const [section, setSection] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("open");
  const [shiftX, setShiftX] = useState(0);
  const [panelInsetPx, setPanelInsetPx] = useState(0);

  const closeDrawer = useCallback(() => {
    setDrawer((current) => {
      if (current === "closed" || current === "closing") return current;
      if (reducedMotion()) return "closed";
      return "closing";
    });
  }, []);

  const openDrawer = useCallback(() => {
    setSection(null);
    setDrawer("open");
  }, []);

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
    if (open === null) return;

    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) hide();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || dialogRef.current?.open) return;
      hide();
      returningFocus.current = true;
      navRef.current
        ?.querySelector<HTMLButtonElement>(`[data-group="${open}"]`)
        ?.focus();
      returningFocus.current = false;
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [hide, open]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1101px)");
    const onChange = () => {
      if (media.matches) setDrawer("closed");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (drawer !== "closing") return;
    const timer = window.setTimeout(() => {
      setDrawer((current) => (current === "closing" ? "closed" : current));
    }, DRAWER_MS + 60);
    return () => window.clearTimeout(timer);
  }, [drawer]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (drawer === "closed") {
      if (dialog.open) {
        unlockScroll();
        dialog.close();
        if (toggleRef.current?.offsetParent) toggleRef.current.focus();
      }
      return;
    }

    if (!dialog.open) {
      lockScroll();
      dialog.showModal();
    }
  }, [drawer]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={styles.nav}
      onMouseEnter={() => {
        if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      }}
      onMouseLeave={scheduleHide}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hide();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className={styles.menuToggle}
        aria-expanded={drawer !== "closed"}
        aria-haspopup="dialog"
        aria-controls={`${id}-drawer`}
        aria-label={drawer === "closed" ? "Open menu" : "Close menu"}
        data-menu-toggle
        onClick={() => {
          if (drawer === "closed") openDrawer();
          else closeDrawer();
        }}
      >
        <HamburgerIcon />
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
                  if (desktopHover && !returningFocus.current) show(index);
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
      <dialog
        ref={dialogRef}
        id={`${id}-drawer`}
        className={styles.menuDrawer}
        data-phase={drawer}
        aria-labelledby={`${id}-drawer-title`}
        onCancel={(event) => {
          event.preventDefault();
          closeDrawer();
        }}
        onClose={() => setDrawer("closed")}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDrawer();
        }}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.propertyName !== "translate") return;
          setDrawer((current) => (current === "closing" ? "closed" : current));
        }}
      >
        <div className={styles.menuPanel}>
          <div className={styles.menuDrawerHead}>
            <p id={`${id}-drawer-title`} className={styles.menuDrawerTitle}>
              Menu
            </p>
            <button
              type="button"
              className={styles.menuClose}
              onClick={closeDrawer}
            >
              <CloseIcon />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <div className={styles.menuDrawerBody}>
            <ul className={styles.drawerList}>
              {items.map((item, index) =>
                "href" in item ? (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={styles.drawerTopLink}
                      target={item.newTab ? "_blank" : undefined}
                      rel={item.newTab ? "noopener noreferrer" : undefined}
                      onClick={closeDrawer}
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={styles.drawerTopLink}
                      aria-expanded={section === index}
                      aria-controls={`${id}-drawer-${index}`}
                      onClick={() =>
                        setSection(section === index ? null : index)
                      }
                    >
                      {item.label}
                      <Chevron />
                    </button>
                    <div
                      id={`${id}-drawer-${index}`}
                      className={styles.drawerSection}
                      data-open={section === index || undefined}
                    >
                      <div
                        className={styles.drawerSectionInner}
                        inert={section !== index}
                      >
                        <div className={styles.drawerColumns}>
                          {item.columns.map((column, columnIndex) => (
                            <div
                              key={`${column.heading ?? "links"}-${columnIndex}`}
                              className={styles.drawerLinks}
                            >
                              {column.heading ? (
                                <p className={styles.navHeading}>
                                  {column.heading}
                                </p>
                              ) : null}
                              <ul>
                                {column.links.map((link) => (
                                  <li key={`${link.href}:${link.label}`}>
                                    <DrawerLink
                                      link={link}
                                      onNavigate={closeDrawer}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
          {cta ? (
            <div className={styles.menuDrawerFoot}>
              <HeaderCta link={cta} onClick={closeDrawer} />
            </div>
          ) : null}
        </div>
      </dialog>
    </nav>
  );
}
