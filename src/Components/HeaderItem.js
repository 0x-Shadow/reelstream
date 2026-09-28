import React from "react";

function HeaderItem({ name, Icon, active = false, onClick, badge = null, vertical = false }) {
  if (vertical) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "page" : undefined}
      className={`group relative flex flex-col items-center justify-center gap-1 px-0.5 py-2.5 text-[9px] font-bold uppercase leading-tight tracking-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400 ${
        active ? "text-sky-400" : "text-slate-500"
      }`}
    >
      <span className="relative">
        <Icon className="text-xl" />
        {badge ? (
          <span className="absolute -right-2.5 -top-1.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      <span className="text-center leading-tight">{name}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3.5 rounded px-1 py-2 text-xs font-bold uppercase tracking-wider transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
        active ? "text-white" : "text-slate-400 hover:text-white"
      }`}
    >
      <span className="relative">
        <Icon
          className={`text-base ${active ? "text-sky-400" : "text-slate-500 group-hover:text-sky-400"}`}
        />
        {badge ? (
          <span className="absolute -right-3 -top-1 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[9px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      {name ? <span>{name}</span> : null}
      <span
        className={`absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-sky-400 transition-transform duration-200 ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </button>
  );
}

export default HeaderItem;
