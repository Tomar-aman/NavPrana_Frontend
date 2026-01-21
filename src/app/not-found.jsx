"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  TreePine,
  Home,
  ArrowLeft,
  Sprout,
  Bird,
  Cloud,
  Flower2,
  Wind,
} from "lucide-react";
// import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.error("404 Error: Page not found");
    setIsLoaded(true);
  }, []);

  /* ------------------ ANIMATION DATA ------------------ */

  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.4,
    duration: 5 + Math.random() * 4,
    x: Math.random() * 100,
    size: 16 + Math.random() * 16,
  }));

  const clouds = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 2,
    duration: 15 + Math.random() * 10,
    y: 10 + Math.random() * 20,
  }));

  const birds = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 3,
    duration: 8 + Math.random() * 4,
    y: 15 + Math.random() * 25,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  /* ------------------ JSX ------------------ */

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-secondary/30 to-primary/5">
      {/* Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Clouds */}
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            className="absolute text-muted-foreground/20"
            style={{ top: `${cloud.y}%` }}
            initial={{ x: "-10%", opacity: 0 }}
            animate={{ x: ["110%", "-10%"], opacity: [0, 0.6, 0.6, 0] }}
            transition={{
              duration: cloud.duration,
              delay: cloud.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Cloud className="w-16 h-16 md:w-24 md:h-24" />
          </motion.div>
        ))}

        {/* Birds */}
        {birds.map((bird) => (
          <motion.div
            key={bird.id}
            className="absolute text-foreground/30"
            style={{ top: `${bird.y}%` }}
            initial={{ x: "-5%", opacity: 0 }}
            animate={{
              x: ["105%", "-5%"],
              y: [0, -20, 0, 20, 0],
              opacity: [0, 1, 1, 1, 0],
            }}
            transition={{
              duration: bird.duration,
              delay: bird.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Bird className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        ))}

        {/* Leaves */}
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute text-primary/40"
            initial={{ y: -50, x: `${leaf.x}%`, rotate: 0, opacity: 0 }}
            animate={{
              y: ["0vh", "100vh"],
              x: [`${leaf.x}%`, `${leaf.x + (Math.random() - 0.5) * 20}%`],
              rotate: [0, 360, 720],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Leaf style={{ width: leaf.size, height: leaf.size }} />
          </motion.div>
        ))}

        {/* Wind */}
        <motion.div
          className="absolute top-1/3 left-0 text-primary/10"
          animate={{ x: ["-100%", "200%"], opacity: [0, 0.5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Wind className="w-32 h-32" />
        </motion.div>

        {/* Trees */}
        <TreePine className="absolute bottom-0 left-0 w-40 h-40 text-primary/20" />
        <TreePine className="absolute bottom-0 right-0 w-48 h-48 text-primary/20" />

        {/* Grass */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/15 to-transparent" />
      </div>

      {/* Main Content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 404 */}
            <motion.h1
              variants={itemVariants}
              className="text-[100px] md:text-[180px] font-bold text-primary/20"
            >
              404
            </motion.h1>

            <motion.div animate={floatAnimation}>
              <Sprout className="w-16 h-16 md:w-24 md:h-24 text-primary" />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-semibold mt-4"
            >
              Lost in the Fields
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-muted-foreground max-w-md mt-2"
            >
              The page you are looking for doesn’t exist or has returned to
              nature 🌱
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              {/* Back to Home */}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3
      rounded-lg bg-primary text-primary-foreground
      hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl
      text-base font-medium"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>

              {/* Go Back */}
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-8 py-3
      rounded-lg border border-primary/30
      hover:bg-primary/5 transition-all
      text-base font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </motion.div>

            {/* Footer text */}
            <p className="absolute bottom-6 text-sm text-muted-foreground/60 flex items-center gap-2">
              <Leaf className="w-4 h-4 animate-spin-slow" />
              NavPrana Organics Ghee • Pure & Natural
              <Leaf className="w-4 h-4 animate-spin-slow" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
