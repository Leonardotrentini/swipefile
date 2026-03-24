"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative mb-12 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 p-12 backdrop-blur-xl"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <span className="text-sm font-medium text-indigo-400">
            Bem-vindo ao DR Intel
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
        >
          Disseque ofertas <br />
          <motion.span
            className="bg-gradient-to-r from-indigo-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            vencedoras
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-[#9ca3af] max-w-2xl mb-8"
        >
          Mineração inteligente, análise com Claude AI e identificação de padrões
          que convertem. Tudo em um lugar.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            Explorar ofertas
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-indigo-500/30 text-indigo-400 rounded-xl font-semibold hover:bg-indigo-500/10 transition-all"
          >
            Documentação
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
