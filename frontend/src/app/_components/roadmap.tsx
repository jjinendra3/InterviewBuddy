"use client";

import { motion } from "framer-motion";
import { Building2, UserCircle, Code, MessageCircle } from "lucide-react";

const steps = [
  { icon: Building2, title: "Select Company" },
  { icon: UserCircle, title: "Choose Role" },
  { icon: Code, title: "DSA Interview" },
  { icon: MessageCircle, title: "HR Interview" },
];

export default function InterviewRoadmap() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-custom">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Your Interview Journey
        </h2>
        <div className="relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center mb-8 last:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-12 bg-white"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
