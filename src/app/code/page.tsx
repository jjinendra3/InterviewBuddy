"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github } from "lucide-react";

export default function CodeAccessPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Github className="w-24 h-24 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-6 text-gradient">
          Code Access Restricted
        </h1>
        <p className="text-lg text-foreground mb-6">
          To maintain the integrity of our platform and avoid duplicacy, the
          source code for InterviewBuddy is not made public. We appreciate your
          understanding in this matter.
        </p>
        <p className="text-lg text-foreground mb-8">
          If you would like to explore the internals of the code for educational
          or review purposes, please click the button below to request access.
        </p>
        <Link
          href="https://mail.google.com/mail/?view=cm&fs=1&to=jjinendra3@gmail.com&su=Request%20for%20Code&body=Hi,%20I%20would%20like%20to%20see%20the%20code%20of%20this%20project."
          target="_blank"
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Request Code Access
          </Button>
        </Link>
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
