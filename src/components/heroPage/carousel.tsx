import Image from "next/image";
import { motion } from "framer-motion";

const companies = [
  { name: "Meta", logo: "/logos/meta-logo.svg" },
  { name: "Apple", logo: "/logos/apple-logo.svg" },
  { name: "Google", logo: "/logos/google-logo.svg" },
  { name: "Netflix", logo: "/logos/netflix-logo.svg" },
  { name: "Nvidia", logo: "/logos/nvidia-logo.svg" },
  { name: "Amazon", logo: "/logos/amazon-logo.svg" },
];

export default function CompanyCarousel() {
  return (
    <div className="w-full py-12 bg-background">
      <div className="mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
          We Support These Companies
        </h2>
        <div className="h-32 flex flex-row items-center justify-center gap-20">
          {companies.map((comp) => {
            return (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={comp.logo || "/placeholder.svg"}
                  alt={`${comp.name} logo`}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
