import React from "react";
import Link from "next/link";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";

function Footer() {
  return (
    <footer className="py-6 px-8 bg-background flex justify-center items-center">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; 2025 InterviewBuddy. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/jjinendra3"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/jjinendra3"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://linkedin.com/in/jjinendra3"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://mail.google.com/mail/?view=cm&fs=1&to=jjinendra3@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Mail</span>
            </Link>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">
              Developed by{" "}
              <Link
                href={"https://jinendrajain.xyz"}
                className="font-semibold text-blue-500"
              >
                Jinendra Jain
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;