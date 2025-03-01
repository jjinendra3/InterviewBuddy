"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { generalStore } from "@/lib/generalStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The best way to predict the future is to create it. - Peter Drucker",
];
gsap.registerPlugin(useGSAP);
export default function LoadingPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const endMeeting = generalStore((state) => state.endInterview);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useGSAP(() => {
    const endTheMeeting = async () => {
      const response = await endMeeting();
      if (!response) {
        alert(
          "Error generating the evaluation report. Please try again later."
        );
      }
    };
    endTheMeeting();
  });

  return (
    <div className="min-h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-white text-6xl mb-8"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        ⚙️
      </motion.div>
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        key={currentQuote}
      >
        <p className="text-white text-lg italic">{`"${quotes[currentQuote]}"`}</p>
      </motion.div>
    </div>
  );
}
