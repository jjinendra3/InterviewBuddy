import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "AceFrame",
  description: "Simulate interviews with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className: "bg-white text-black",
          }}
        />
      </body>
    </html>
  );
}
