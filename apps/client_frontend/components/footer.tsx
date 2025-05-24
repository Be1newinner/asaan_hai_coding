"use client";

import Link from "next/link";
import { m, useInView } from "framer-motion";
import { Github, Linkedin, Youtube, Heart, Mail, ArrowUp } from "lucide-react";
import { useRef } from "react";
import { contacts } from "@/constants/about";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socialLinks = [
    {
      href: contacts.youtube,
      icon: Youtube,
      color: "hover:text-red-500",
      label: "YouTube",
      hoverColor: "hover:shadow-red-500/50",
    },
    {
      href: contacts.github,
      icon: Github,
      color: "hover:text-white",
      label: "GitHub",
      hoverColor: "hover:shadow-white/50",
    },
    {
      href: contacts.linkedin,
      icon: Linkedin,
      color: "hover:text-blue-500",
      label: "LinkedIn",
      hoverColor: "hover:shadow-blue-500/50",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={ref}
      className="relative bg-gray-900/80 backdrop-blur-md border-t border-gray-800/50 overflow-hidden"
    >
      {/* Animated Wave Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.3)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
            </linearGradient>
          </defs>

          <m.path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="url(#waveGradient)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <m.path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="rgba(139, 92, 246, 0.4)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />

          <m.path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="rgba(139, 92, 246, 0.6)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <m.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center">
          {/* Newsletter Subscription Hint */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest tutorials and coding tips delivered to your inbox
            </p>
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Mail className="mr-2 h-4 w-4" />
              Subscribe to Newsletter
            </m.button>
          </m.div>

          {/* Social Links */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex space-x-6 mb-8"
          >
            {socialLinks.map((social, index) => (
              <m.div
                key={social.label}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{
                  delay: index * 0.1 + 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
              >
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${social.color} transition-all duration-300 block p-4 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 ${social.hoverColor} hover:shadow-lg group-hover:bg-gray-700/50`}
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </Link>

                {/* Tooltip */}
                <m.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  whileHover={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  {social.label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
                </m.div>
              </m.div>
            ))}
          </m.div>

          {/* Footer Text */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm mb-2 flex items-center justify-center">
              Made with{" "}
              <m.span
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="mx-2"
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </m.span>
              by Vijay
            </p>
            <p className="text-gray-500 text-xs mb-4">
              &copy; {new Date().getFullYear()} Asaan Hai Coding. All rights
              reserved.
            </p>

            {/* Additional Links */}
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                href="/sitemap"
                className="hover:text-purple-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </m.div>

          {/* Scroll to Top Button */}
          <m.button
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="mt-8 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </m.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
