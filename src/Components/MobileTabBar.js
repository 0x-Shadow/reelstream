import React from "react";
import HeaderItem from "./HeaderItem";
import { NAV } from "./Header";

const TABS = NAV.filter((item) =>
  ["/", "/search", "/originals", "/movies", "/watchlist"].includes(item.path)
);

function MobileTabBar({ path, onNavigate }) {
  const isActive = (target) =>
    target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`);

  return (
    <nav
      aria-label="Primary bottom"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0d14]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
    >
      <div className="grid grid-cols-5">
        {TABS.map((item) => (
          <HeaderItem
            key={item.name}
            name={item.short}
            Icon={item.icon}
            active={isActive(item.path)}
            onClick={() => onNavigate(item.path)}
            vertical
          />
        ))}
      </div>
    </nav>
  );
}

export default MobileTabBar;
