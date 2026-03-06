"use client";

import { useCallback, useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(["hero", "about", "skills", "projects", "experience", "contact"]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] h-16 flex items-center transition-all duration-200 ${
          scrolled
            ? "border-b border-border backdrop-blur-xl bg-bg/85"
            : "bg-bg border-b border-transparent"
        }`}
        role="banner"
      >
        <div className="w-full max-w-[var(--max-width)] mx-auto px-6 flex items-center justify-between h-full">
          <a
            href="#hero"
            className="text-[1.1rem] font-bold text-text hover:text-accent transition-colors duration-200 tracking-tight"
            aria-label="홈으로 이동"
            onClick={(e) => handleSmoothScroll(e, "#hero")}
          >
            박<span className="text-accent">.</span>성<span className="text-accent">.</span>욱
          </a>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-10" role="navigation" aria-label="주 내비게이션">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeId && `#${activeId}` === link.href
                      ? "text-text"
                      : "text-text-muted hover:text-text"
                  }`}
                  aria-current={activeId && `#${activeId}` === link.href ? "true" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <ThemeToggle />

            <button
              className="flex md:hidden flex-col justify-center gap-[5px] w-9 h-9 p-2 rounded-lg text-text-muted hover:text-text hover:bg-elevated transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              <span
                className={`block w-full h-[1.5px] bg-current rounded transition-transform duration-200 origin-center ${
                  menuOpen ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-current rounded transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-current rounded transition-transform duration-200 origin-center ${
                  menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
