"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Upload, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { countryList } from "@/lib/constants";
import { toaster } from "@/components/toast";

export default function ResumeReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file less than 1MB in size.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !country) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("country", country);

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process the request");
      }

      const result = await response.json();
      setScore(result.rating);
      setFeedback(result.detailedReview);
    } catch (error) {
      console.error("Error submitting form:", error);
      toaster("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">
          Resume Review
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Resume (PDF, max 1MB)
            </label>
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country of Residence
            </label>
            <Select onValueChange={setCountry} disabled={isLoading} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countryList.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || !file || !country}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
        </form>

        {score !== null && (
          <motion.div
            className="mt-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-primary progress-ring__circle stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {score}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </motion.div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            &larr; Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
