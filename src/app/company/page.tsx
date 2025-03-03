"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const companies = [
  { name: "Google", logo: "/logos/google-logo.svg" },
  { name: "Meta", logo: "/logos/meta-logo.svg" },
  { name: "Apple", logo: "/logos/apple-logo.svg" },
  { name: "Amazon", logo: "/logos/amazon-logo.svg" },
  { name: "Netflix", logo: "/logos/netflix-logo.svg" },
  { name: "Nvidia", logo: "/logos/nvidia-logo.svg" },
];

export default function ChooseCompany() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  return (
    <div className="h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Dream Company
      </motion.h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl">
        {companies.map((company, index) => (
          <motion.button
            key={company.name}
            className={`bg-white rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
              selectedCompany === company.name ? "ring-4 ring-primary" : ""
            }`}
            onClick={() => setSelectedCompany(company.name)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              width={80}
              height={80}
              className="mb-2"
            />
            <span className="text-foreground font-semibold">
              {company.name}
            </span>
          </motion.button>
        ))}
      </div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={!selectedCompany || selectedCompany !== "Google"}
          onClick={() => {
            router.push(`/company/${selectedCompany?.toLowerCase()}`);
          }}
        >
          Start Interview
        </Button>
      </motion.div>
      <motion.div
        className="absolute top-4 left-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
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
