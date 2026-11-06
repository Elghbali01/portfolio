"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

const MenuCloseContext = createContext<(() => void) | null>(null);

interface NavbarDropdownProps {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
  disabled?: boolean;
}

interface MenuPosition {
  left: number;
  top: number;
  maxHeight: number;
  ready: boolean;
}

type FocusTarget = "first" | "last";

export function NavbarMenuItem({
  children,
  selectable = false,
  selected = false,
  href,
  lang,
  dir,
  onSelect,
  disabled = false,
}: {
  children: ReactNode;
  selectable?: boolean;
  selected?: boolean;
  href?: string;
  lang?: string;
  dir?: "ltr" | "rtl";
  onSelect?: () => void;
  disabled?: boolean;
}) {
  const closeMenu = useContext(MenuCloseContext);
  if (!closeMenu) throw new Error("NavbarMenuItem must be inside NavbarDropdown");

  const handleSelect = () => {
    if (disabled) return;
    closeMenu();
    onSelect?.();
  };
  const className = [
    "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
    selected
      ? "bg-accent/10 font-semibold text-accent"
      : "text-content-secondary hover:bg-content-primary/5 hover:text-content-primary",
    disabled ? "cursor-not-allowed opacity-50" : "",
  ].filter(Boolean).join(" ");
  const itemContent = (
    <>
      <span className="min-w-0 flex-1">{children}</span>
      {selected && <Check aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.5} />}
    </>
  );
  const itemProps = {
    role: selectable ? "menuitemradio" : "menuitem",
    "aria-checked": selectable ? selected : undefined,
    "aria-disabled": disabled ? true : undefined,
    tabIndex: -1,
    lang,
    dir,
    className,
    onClick: handleSelect,
  } as const;

  if (href) {
    return (
      <Link href={href} {...itemProps}>
        {itemContent}
      </Link>
    );
  }

  return (
    <button type="button" disabled={disabled} {...itemProps}>
      {itemContent}
    </button>
  );
}

export default function NavbarDropdown({
  label,
  icon: Icon,
  children,
  disabled = false,
}: NavbarDropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({
    left: 0,
    top: 0,
    maxHeight: 0,
    ready: false,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusTargetRef = useRef<FocusTarget>("first");
  const triggerId = useId();
  const menuId = useId();
  const reduceMotion = useReducedMotion() === true;

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    let frame = 0;
    const positionMenu = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const triggerRect = trigger.getBoundingClientRect();
      const menuWidth = menu.offsetWidth;
      const menuHeight = menu.offsetHeight;
      const viewportMargin = 8;
      const belowSpace = Math.max(96, window.innerHeight - triggerRect.bottom - viewportMargin * 2);
      const aboveSpace = Math.max(96, triggerRect.top - viewportMargin * 2);
      const opensAbove = menuHeight > belowSpace && aboveSpace > belowSpace;
      const availableHeight = Math.max(
        96,
        Math.min(menuHeight, opensAbove ? aboveSpace : belowSpace, window.innerHeight - viewportMargin * 2),
      );
      const top = opensAbove
        ? triggerRect.top - availableHeight - viewportMargin
        : triggerRect.bottom + viewportMargin;
      const direction = window.getComputedStyle(trigger).direction;
      const alignedLeft = direction === "rtl" ? triggerRect.left : triggerRect.right - menuWidth;
      const left = Math.min(
        Math.max(viewportMargin, alignedLeft),
        Math.max(viewportMargin, window.innerWidth - menuWidth - viewportMargin),
      );
      const boundedTop = Math.min(
        Math.max(viewportMargin, top),
        Math.max(viewportMargin, window.innerHeight - availableHeight - viewportMargin),
      );

      setPosition({ left, top: boundedTop, maxHeight: availableHeight, ready: true });
    };

    const focusMenuItem = () => {
      const items = menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"], [role="menuitemradio"]',
      );
      if (!items?.length) return;
      const target = focusTargetRef.current === "last" ? items[items.length - 1] : items[0];
      target.focus();
    };

    frame = window.requestAnimationFrame(() => {
      positionMenu();
      frame = window.requestAnimationFrame(focusMenuItem);
    });

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      closeMenu();
    };
    const reposition = () => positionMenu();

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [closeMenu, open]);

  const openMenu = (focusTarget: FocusTarget = "first") => {
    focusTargetRef.current = focusTarget;
    setPosition((current) => ({ ...current, ready: false }));
    setOpen(true);
  };

  const handleTriggerClick = () => {
    if (open) closeMenu();
    else openMenu();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
      return;
    }
    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"], [role="menuitemradio"]',
      ) ?? [],
    );
    if (!items.length) return;

    const activeIndex = items.indexOf(document.activeElement as HTMLElement);
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") nextIndex = (activeIndex + 1) % items.length;
    else if (event.key === "ArrowUp") nextIndex = (activeIndex - 1 + items.length) % items.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    items[nextIndex].focus();
  };

  const menu = open && typeof document !== "undefined"
    ? createPortal(
        <MenuCloseContext.Provider value={() => closeMenu(true)}>
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={handleMenuKeyDown}
            initial={reduceMotion ? false : { opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: position.ready ? 1 : 0, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: position.left,
              top: position.top,
              maxHeight: position.maxHeight || undefined,
              visibility: position.ready ? "visible" : "hidden",
              pointerEvents: position.ready ? "auto" : "none",
            }}
            className="z-[150] w-60 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl border border-outline-default bg-surface p-2 text-content-primary shadow-2xl shadow-black/20"
          >
            {children}
          </motion.div>
        </MenuCloseContext.Provider>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        title={label}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline-default bg-surface text-content-secondary transition-colors hover:border-accent hover:bg-surface-elevated hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 xl:h-10 xl:w-10"
      >
        <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      </button>
      {menu}
    </>
  );
}
