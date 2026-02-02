"use client";

import { motion } from "motion/react";
import { useState } from "react";

const features = [
  {
    icon: "[DASHBOARD]",
    title: "Real-time dashboard",
    description:
      "Web UI with live WebSocket updates. Filter, search, and inspect requests in your browser.",
    color: "text-orange-400",
    borderColor: "border-orange-500/50",
  },
  {
    icon: "[ZERO-CONFIG]",
    title: "Zero-config",
    description:
      "$ npm install snapwyr && import. That's it. No config files needed.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/50",
  },
  {
    icon: "[FRAMEWORK]",
    title: "Framework support",
    description:
      "Express, Koa, Fastify, NestJS, Hono, Next.js. One line integration.",
    color: "text-yellow-400",
    borderColor: "border-yellow-500/50",
  },
  {
    icon: "[REDACT]",
    title: "Sensitive data redaction",
    description:
      "Automatically redact passwords, tokens, and API keys from logs. Keep secrets safe.",
    color: "text-red-400",
    borderColor: "border-red-500/50",
  },
  {
    icon: "[DIRECTION]",
    title: "Incoming & outgoing",
    description:
      "Log both server requests and outbound API calls. See the full picture.",
    color: "text-purple-400",
    borderColor: "border-purple-500/50",
  },
  {
    icon: "[CURL]",
    title: "cURL export",
    description:
      "Copy any request as a cURL command. Replay and debug with one click.",
    color: "text-blue-400",
    borderColor: "border-blue-500/50",
  },
];

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-3 sm:px-6 lg:px-8 border-t border-green-500/20 relative overflow-hidden font-mono">
      {/* Terminal grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16 lg:mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-green-400 font-mono tracking-wider"
          >
            $ features --list
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-400 max-w-3xl mx-auto font-mono px-2"
          >
            [INFO] Powerful features. Zero complexity.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative border ${feature.borderColor} sm:border-2 bg-black/50 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 hover:border-opacity-100 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]`}
            >
              {/* Terminal-style header */}
              <div className={`text-[10px] sm:text-xs mb-3 sm:mb-4 ${feature.color} font-bold font-mono tracking-wider`}>
                {feature.icon}
              </div>

              <h3 className={`text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 ${feature.color} font-mono`}>
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-xs sm:text-sm font-mono">
                {feature.description}
              </p>

              {/* Terminal cursor effect on hover */}
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-green-400"
                >
                  _
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
