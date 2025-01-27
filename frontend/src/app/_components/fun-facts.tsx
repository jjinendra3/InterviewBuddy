"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const funFacts = [
  "Did you know? The term 'bug' in computer science originated from an actual moth found in a computer relay in 1947!",
  "The first computer programmer was a woman named Ada Lovelace, who lived in the 1800s.",
  "The world's first website is still online! You can visit it at info.cern.ch.",
  "There are over 700 different programming languages in use today.",
  "The most expensive domain name ever sold was Cars.com for $872 million!",
];

export default function FunFacts() {
  const [currentFact, setCurrentFact] = useState(0);

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % funFacts.length);
  };

  return (
    <div className="bg-accent p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-accent-foreground">
        Fun Tech Fact!
      </h3>
      <div className="h-24">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentFact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-accent-foreground"
          >
            {funFacts[currentFact]}
          </motion.p>
        </AnimatePresence>
      </div>
      <Button onClick={nextFact} className="mt-4">
        Next Fact
      </Button>
    </div>
  );
}
