"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const companies = [
  { name: "Meta", logo: "/logos/meta-logo.svg" },
  { name: "Apple", logo: "/logos/apple-logo.svg" },
  { name: "Amazon", logo: "/logos/amazon-logo.svg" },
  { name: "Netflix", logo: "/logos/netflix-logo.svg" },
  { name: "Google", logo: "/logos/google-logo.svg" },
];

export default function CompanyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % companies.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
          We Support These Companies
        </h2>
        <div className="relative h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <Image
                src={companies[currentIndex].logo || "/placeholder.svg"}
                alt={`${companies[currentIndex].name} logo`}
                width={150}
                height={150}
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center mt-8">
          {companies.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
