"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { BarChart3, BookOpen, Plus, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/library", label: "Biblioteca", icon: BookOpen },
  { href: "/offers/new", label: "Nova Oferta", icon: Plus },
  { href: "/patterns", label: "Padrões", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] border-r border-indigo-500/20 flex flex-col z-50"
    >
      {/* Logo Section */}
      <motion.div
        className="p-6 border-b border-indigo-500/10 backdrop-blur-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/" className="flex items-center gap-4 group">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Logo size="md" animated />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-white font-bold text-base bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              DR Intel
            </motion.p>
            <motion.p
              className="text-[#6b7280] text-xs group-hover:text-[#9ca3af] transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Swipe File
            </motion.p>
          </div>
        </Link>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, idx) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200 cursor-pointer group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                        : "text-[#9ca3af] hover:text-white hover:bg-indigo-500/10 border border-transparent"
                    }
                  `}
                >
                  <motion.div
                    animate={isActive ? { rotate: 360 } : {}}
                    transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-indigo-400"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <motion.div
        className="p-4 border-t border-indigo-500/10 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-500/20"
          whileHover={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
        >
          <p className="text-[#9ca3af] text-xs text-center leading-relaxed group-hover:text-indigo-300 transition-colors">
            <span className="font-semibold text-indigo-400">Powered by</span>
            <br />
            Claude AI ✨
          </p>
        </motion.div>

        {/* Version */}
        <p className="text-[#4b5563] text-xs text-center mt-3">v1.0.0</p>
      </motion.div>
    </motion.aside>
  );
}
