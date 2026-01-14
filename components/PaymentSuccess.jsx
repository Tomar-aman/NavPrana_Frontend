"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

const PaymentSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Redirect after 3.5s
    const timer = setTimeout(() => {}, 10000);

    // Stop confetti
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
      <main className="w-full">
        <div className="text-center max-w-md mx-auto">
          {/* 🎉 Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: [
                      "#22c55e",
                      "#eab308",
                      "#3b82f6",
                      "#ec4899",
                      "#f97316",
                    ][Math.floor(Math.random() * 5)],
                  }}
                  initial={{
                    top: -20,
                    opacity: 1,
                    scale: Math.random() * 0.5 + 0.5,
                    rotate: 0,
                  }}
                  animate={{
                    top: "100vh",
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1.5,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* ✅ Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="relative mx-auto w-32 h-32 mb-8"
          >
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <CheckCircle2 className="w-16 h-16 text-primary-foreground" />
            </div>

            {/* ✨ Sparkles */}
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>

            <motion.div
              className="absolute -bottom-1 -left-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>

          {/* 📝 Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for your order
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to order details...
            </p>
          </motion.div>

          {/* ⏳ Loading Dots */}
          <motion.div
            className="flex justify-center gap-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* 🧾 Transaction Info */}
          <motion.div
            className="mt-10 p-4 bg-muted/50 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-muted-foreground">
              Transaction ID:{" "}
              <span className="font-mono font-medium text-foreground">
                TXN{Date.now().toString().slice(-8)}
              </span>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
