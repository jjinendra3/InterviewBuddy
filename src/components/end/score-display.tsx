"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

interface ScoreDisplayProps {
  scores: {
    communicationSkills: number;
    technicalKnowledge: number;
    problemSolvingAbility: number;
    behavioralCompetence: number;
    overallImpression: number;
  };
}

export function ScoreDisplay({ scores }: ScoreDisplayProps) {
  const scoreCategories = [
    { name: "Communication", score: scores.communicationSkills, icon: "💬" },
    { name: "Technical", score: scores.technicalKnowledge, icon: "💻" },
    {
      name: "Problem Solving",
      score: scores.problemSolvingAbility,
      icon: "🧩",
    },
    { name: "Behavioral", score: scores.behavioralCompetence, icon: "🤝" },
    { name: "Overall", score: scores.overallImpression, icon: "⭐" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {scoreCategories.map((category) => (
        <ScoreGauge
          key={category.name}
          name={category.name}
          score={category.score}
          icon={category.icon}
        />
      ))}
    </div>
  );
}

interface ScoreGaugeProps {
  name: string;
  score: number;
  icon: string;
}

function ScoreGauge({ name, score, icon }: ScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-500";
    if (score >= 6) return "text-amber-500";
    if (score >= 4) return "text-orange-500";
    return "text-rose-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Average";
    if (score >= 3) return "Needs Work";
    return "Poor";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-2">
        <div className="absolute inset-0 rounded-full bg-gray-100"></div>
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 10 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={
              score >= 8
                ? "#10b981"
                : score >= 6
                ? "#f59e0b"
                : score >= 4
                ? "#f97316"
                : "#f43f5e"
            }
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset="0"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl">{icon}</span>
          <span className={cn("font-bold text-lg", getScoreColor(score))}>
            {score}
          </span>
        </div>
      </div>
      <h3 className="font-medium text-amber-900">{name}</h3>
      <p className={cn("text-sm font-medium", getScoreColor(score))}>
        {getScoreText(score)}
      </p>
    </div>
  );
}
