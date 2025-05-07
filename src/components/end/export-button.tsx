"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InterviewEvaluation } from "@/lib/types/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonProps {
  evaluation: InterviewEvaluation;
}

export function ExportButton({ evaluation }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(158, 42, 43); 
      doc.text("Interview Evaluation Report", 105, 15, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Performance Scores", 14, 30);

      autoTable(doc, {
        startY: 35,
        head: [["Category", "Score", "Rating"]],
        body: [
          [
            "Communication Skills",
            evaluation.scores.communicationSkills.toString(),
            getRating(evaluation.scores.communicationSkills),
          ],
          [
            "Technical Knowledge",
            evaluation.scores.technicalKnowledge.toString(),
            getRating(evaluation.scores.technicalKnowledge),
          ],
          [
            "Problem Solving",
            evaluation.scores.problemSolvingAbility.toString(),
            getRating(evaluation.scores.problemSolvingAbility),
          ],
          [
            "Behavioral Competence",
            evaluation.scores.behavioralCompetence.toString(),
            getRating(evaluation.scores.behavioralCompetence),
          ],
          [
            "Overall Impression",
            evaluation.scores.overallImpression.toString(),
            getRating(evaluation.scores.overallImpression),
          ],
        ],
        theme: "grid",
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [255, 251, 235] },
      });

      autoTable(doc, {
        startY: 35,
        head: [["Category", "Score", "Rating"]],
        body: [
          [
            "Communication Skills",
            evaluation.scores.communicationSkills.toString(),
            getRating(evaluation.scores.communicationSkills),
          ],
          [
            "Technical Knowledge",
            evaluation.scores.technicalKnowledge.toString(),
            getRating(evaluation.scores.technicalKnowledge),
          ],
          [
            "Problem Solving",
            evaluation.scores.problemSolvingAbility.toString(),
            getRating(evaluation.scores.problemSolvingAbility),
          ],
          [
            "Behavioral Competence",
            evaluation.scores.behavioralCompetence.toString(),
            getRating(evaluation.scores.behavioralCompetence),
          ],
          [
            "Overall Impression",
            evaluation.scores.overallImpression.toString(),
            getRating(evaluation.scores.overallImpression),
          ],
        ],
        theme: "grid",
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [255, 251, 235] },
      });
      let yPos = 120;
      doc.setFontSize(16);
      doc.text("Detailed Feedback", 14, yPos);
      yPos += 5;

      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(158, 42, 43);
      doc.text("Communication Skills:", 14, yPos);
      doc.setTextColor(0, 0, 0);
      const commLines = doc.splitTextToSize(
        evaluation.feedback.communicationFeedback,
        180
      );
      doc.text(commLines, 14, yPos + 5);
      yPos += 5 + commLines.length * 5;

      yPos += 5;
      doc.setTextColor(158, 42, 43);
      doc.text("Technical Knowledge:", 14, yPos);
      doc.setTextColor(0, 0, 0);
      const techLines = doc.splitTextToSize(
        evaluation.feedback.technicalFeedback,
        180
      );
      doc.text(techLines, 14, yPos + 5);
      yPos += 5 + techLines.length * 5;

      if (yPos > 250) {
        doc.addPage();
        yPos = 15;
      }

      yPos += 5;
      doc.setTextColor(158, 42, 43);
      doc.text("Problem Solving Ability:", 14, yPos);
      doc.setTextColor(0, 0, 0);
      const probLines = doc.splitTextToSize(
        evaluation.feedback.problemSolvingFeedback,
        180
      );
      doc.text(probLines, 14, yPos + 5);
      yPos += 5 + probLines.length * 5;

      yPos += 5;
      doc.setTextColor(158, 42, 43);
      doc.text("Behavioral Competence:", 14, yPos);
      doc.setTextColor(0, 0, 0);
      const behavLines = doc.splitTextToSize(
        evaluation.feedback.behavioralFeedback,
        180
      );
      doc.text(behavLines, 14, yPos + 5);
      yPos += 5 + behavLines.length * 5;

      if (yPos > 250) {
        doc.addPage();
        yPos = 15;
      }

      yPos += 5;
      doc.setTextColor(158, 42, 43);
      doc.text("Overall Impression:", 14, yPos);
      doc.setTextColor(0, 0, 0);
      const overallLines = doc.splitTextToSize(
        evaluation.feedback.overallFeedback,
        180
      );
      doc.text(overallLines, 14, yPos + 5);

      doc.addPage();
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Highlights", 14, 15);

      doc.setFontSize(12);
      doc.setTextColor(16, 185, 129); 
      doc.text("Top Strengths:", 14, 25);
      doc.setTextColor(0, 0, 0);

      let strengthYPos = 30;
      evaluation.highlights.topStrengths.forEach((strength) => {
        doc.text(`• ${strength}`, 20, strengthYPos);
        strengthYPos += 7;
      });

      doc.setTextColor(245, 158, 11); 
      doc.text("Areas for Improvement:", 14, strengthYPos + 5);
      doc.setTextColor(0, 0, 0);

      let improvementYPos = strengthYPos + 10;
      evaluation.highlights.improvementAreas.forEach((area) => {
        doc.text(`• ${area}`, 20, improvementYPos);
        improvementYPos += 7;
      });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Recommendations", 14, improvementYPos + 10);

      let recYPos = improvementYPos + 20;
      evaluation.recommendations.forEach((rec, index) => {
        const recLines = doc.splitTextToSize(`${index + 1}. ${rec}`, 180);
        doc.text(recLines, 14, recYPos);
        recYPos += recLines.length * 7;
      });

      doc.save("interview-evaluation-report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getRating = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Average";
    if (score >= 3) return "Needs Work";
    return "Poor";
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="bg-rose-600 hover:bg-rose-700 text-white"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </>
      )}
    </Button>
  );
}
