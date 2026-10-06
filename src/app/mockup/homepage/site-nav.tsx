"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./homepage.module.css";

export type NavLink = {
  label: string;
  href: string;
  icon?: IconSvgElement;
  logo?: string;
  monogram?: string;
};
export type NavGroup = {
  label: string;
  columns: { heading?: string; links: NavLink[] }[];
};
export type NavItem = NavLink | NavGroup;

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

export function SiteNav({ items }: { items: NavItem[] }) {
  const id = useId();
  const navRef = useRef<HTMLElement>(null);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (openGroup === null && !menuOpen) return;

    function closeAll() {
      setOpenGroup(null);
      setMenuOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) closeAll();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const selector =
        openGroup === null ? "[data-menu-toggle]" : `[data-group="${openGroup}"]`;
      if (openGroup === null) setMenuOpen(false);
      setOpenGroup(null);
      navRef.current?.querySelector<HTMLButtonElement>(selector)?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openGroup, menuOpen]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={styles.nav}
      data-menu-open={menuOpen || undefined}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpenGroup(null);
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
            <li key={item.label}>
              <a href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            </li>
          ) : (
            <li key={item.label} className={styles.navItem}>
              <button
                type="button"
                className={styles.navLink}
                aria-expanded={openGroup === index}
                aria-controls={`${id}-${index}`}
                data-group={index}
                onClick={() => setOpenGroup(openGroup === index ? null : index)}
              >
                {item.label}
                <Chevron />
              </button>
              <div
                id={`${id}-${index}`}
                className={styles.navPanel}
                data-wide={item.columns.length > 1 || undefined}
                hidden={openGroup !== index}
              >
                {item.columns.map((column) => (
                  <div key={column.heading ?? "links"}>
                    {column.heading && (
                      <p className={styles.navHeading}>{column.heading}</p>
                    )}
                    <ul>
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href}>
                            {link.logo ? (
                              <Image
                                src={link.logo}
                                alt=""
                                width={24}
                                height={24}
                                className={styles.navLogo}
                              />
                            ) : link.monogram ? (
                              <span
                                className={styles.navMonogram}
                                aria-hidden="true"
                              >
                                {link.monogram}
                              </span>
                            ) : (
                              link.icon && (
                                <HugeiconsIcon
                                  icon={link.icon}
                                  size={20}
                                  strokeWidth={1.75}
                                  className={styles.navIcon}
                                  aria-hidden="true"
                                />
                              )
                            )}
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
