"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "⬛" },
  { href: "/library", label: "Biblioteca", icon: "📁" },
  { href: "/offers/new", label: "Nova Oferta", icon: "➕" },
  { href: "/patterns", label: "Padrões", icon: "🔁" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#12121a] border-r border-[#1e1e2e] flex flex-col z-50">
      <div className="p-6 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            DR
          </div>
          <div>
            <p className="text-white font-semibold text-sm">DR Intel</p>
            <p className="text-[#6b7280] text-xs">Swipe File</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-400 font-medium"
                  : "text-[#6b7280] hover:text-white hover:bg-[#1e1e2e]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1e1e2e]">
        <p className="text-[#6b7280] text-xs text-center">
          Powered by Claude AI
        </p>
      </div>
    </aside>
  );
}
