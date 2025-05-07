"use client";
import { EvaluationDashboard } from "@/components/end/evaluation-dashboard";
import { interviewStore } from "@/lib/utils/interviewStore";
import { useEffect, useState } from "react";
export default function Home() {
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState("");
  const conversation = interviewStore((state) => state.conversation);

  useEffect(() => {
    async function fetchEvaluation() {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch evaluation");
      }
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setEvaluation(data.data.object);
      } else {
        setError("Failed to fetch evaluation");
      }
    }
    fetchEvaluation()
      .then(() => {
        console.log("Evaluation fetched successfully");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch evaluation");
      });
    return () => {
      setEvaluation(null);
      setError("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-r from-rose-300 via-amber-300 to-amber-200">
      <div className="container mx-auto py-8 px-4">
        <EvaluationDashboard evaluation={evaluation} error={error} />
      </div>
    </main>
  );
}
