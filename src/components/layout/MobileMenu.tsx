"use client";

import { useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) onClose();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <nav
      className="fixed inset-0 z-[99] bg-bg pt-[var(--header-height)] px-6 border-t border-border flex flex-col gap-4"
      role="navigation"
      aria-label="모바일 내비게이션"
    >
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="text-lg font-medium text-text-muted py-2 border-b border-border hover:text-accent transition-colors duration-200"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
