"use client";

import { motion } from "framer-motion";
import { Code, Zap, BarChart } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Realistic Coding Challenges",
    description:
      "Face real-world coding problems tailored to your chosen company's interview style.",
  },
  {
    icon: Zap,
    title: "AI-Powered Feedback",
    description:
      "Receive instant, personalized feedback to help you improve your problem-solving skills.",
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description:
      "Monitor your improvement over time with detailed performance analytics.",
  },
];

export default function Features() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gradient"
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
