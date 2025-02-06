"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CompanyCarousel from "./_components/carousel";
import InterviewRoadmap from "./_components/roadmap";
import Footer from "./_components/footer";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 px-4 sm:px-6 lg:px-8 bg-[#FFA09B] ">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            InterviewBuddy
          </motion.div>
          <nav>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link href="/login" className="text-white text-lg">
                Login
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
              asChild
            >
              <Link
                href="https://mail.google.com/mail/?view=cm&fs=1&to=jjinendra3@gmail.com&su=Request%20for%20Code&body=Hi,%20I%20would%20like%20to%20see%20the%20code%20of%20this%20project."
                className="text-white text-lg"
                target="_blank"
              >
                Code
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-custom">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  Master Tech Interviews with AI
                </h1>
                <p className="text-xl text-white">
                  {
                    "Practice coding interviews in a realistic, live setting with AI. Choose your preferred company's interview style and get personalized feedback to improve your skills."
                  }
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href={"/company"}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary hover:bg-secondary"
                    >
                      Start Interview
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-white text-primary hover:bg-secondary"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative h-64 sm:h-80 lg:h-96"
              >
                <Image
                  src="/hero/designer.jpeg"
                  alt="AI Interview Illustration"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <CompanyCarousel />

        <InterviewRoadmap />
      </main>
      <Footer />
    </div>
  );
}
