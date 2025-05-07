"use client";

import { useState } from "react";
import { ScoreDisplay } from "./score-display";
import { FeedbackSection } from "./feedback-section";
import { HighlightsSection } from "./highlights-section";
import { RecommendationsSection } from "./recommendations-section";
import { KeyMomentsSection } from "./key-moments-section";
import { ExportButton } from "./export-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InterviewEvaluation } from "@/lib/types/types";
import { Skeleton } from "@/components/ui/skeleton";

interface EvaluationDashboardProps {
  evaluation: InterviewEvaluation | null;
  isLoading?: boolean;
  error?: string;
}

export function EvaluationDashboard({
  evaluation,
  error,
}: EvaluationDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (error) {
    return <ErrorState message={error} />;
  }
  if (!evaluation) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-rose-900">
            Interview Evaluation
          </h1>
          <p className="text-amber-800 mt-1">
            Comprehensive performance assessment
          </p>
        </div>
        <ExportButton evaluation={evaluation} />
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-lg">
        <CardHeader className="pb-0">
          <CardTitle className="text-rose-800 text-xl">
            Performance Overview
          </CardTitle>
          <CardDescription className="text-amber-700">
            Overall interview performance scores and ratings
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScoreDisplay scores={evaluation.scores} />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 bg-amber-100/70">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900"
          >
            Feedback
          </TabsTrigger>
          <TabsTrigger
            value="highlights"
            className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900"
          >
            Highlights
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900"
          >
            Recommendations
          </TabsTrigger>
          <TabsTrigger
            value="keyMoments"
            className="data-[state=active]:bg-rose-200 data-[state=active]:text-rose-900"
          >
            Key Moments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <FeedbackSection feedback={evaluation.feedback} />
        </TabsContent>

        <TabsContent value="highlights" className="mt-0">
          <HighlightsSection highlights={evaluation.highlights} />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-0">
          <RecommendationsSection
            recommendations={evaluation.recommendations}
          />
        </TabsContent>

        <TabsContent value="keyMoments" className="mt-0">
          <KeyMomentsSection keyMoments={evaluation.keyMoments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-64 bg-rose-200" />
          <Skeleton className="h-5 w-48 mt-2 bg-amber-200" />
        </div>
        <Skeleton className="h-10 w-32 bg-rose-200" />
      </div>

      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader className="pb-0">
          <Skeleton className="h-7 w-48 bg-rose-200" />
          <Skeleton className="h-5 w-64 mt-2 bg-amber-200" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full bg-amber-200" />
                  <Skeleton className="h-5 w-20 mt-2 bg-rose-200" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full bg-amber-200" />
        <Skeleton className="h-64 w-full bg-white/70" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-rose-300 shadow-lg">
      <CardHeader>
        <CardTitle className="text-rose-800">
          Error Loading Evaluation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-rose-700 mb-4">{message}</p>
          <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md transition-colors">
            Retry Loading
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
