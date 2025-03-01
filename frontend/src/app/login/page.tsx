"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { toaster } from "@/components/toast";
import { generalStore } from "@/lib/generalStore";
import { useRouter } from "next/navigation";
import { SuccessLottiePlayer } from "@/components/lottie/dotlottie";
import LoginWithGoogle from "@/components/loginWithGoogle";
export default function Login() {
  const route = useRouter();
  const candidate = generalStore((state) => state.candidate);
  useEffect(() => {
    if (candidate) {
      route.push("/company");
    }
  }, [candidate, route]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const login = generalStore((state) => state.login);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (!response.success) throw new Error(response.message);
      setLoggedIn(true);
      setTimeout(() => {
        route.push("/company");
      }, 300);
      //eslint-disable-next-line
    } catch (error: any) {
      toaster(error);
      return;
    }
  };

  const handleOtpRequest = () => {
    if (!email) {
      toaster(
        "OTP feature is still in development mode, please try admin@admin.com/admin"
      );
      return;
    }
    // setIsOtpRequested(true);
  };

  const handlePasswordRequest = () => {
    setIsOtpRequested(false);
  };

  if (loggedIn) {
    return (
      <div className="h-16 w-16 bg-gradient-custom flex flex-col items-center justify-center p-4">
        <SuccessLottiePlayer />
      </div>
    );
  }
  return (
    <div className="h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold pb-4 text-center text-gradient">
          Resume Your Journey.
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          {!isOtpRequested && (
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}
          {isOtpRequested ? (
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="text-sm font-medium text-gray-700"
              >
                One-Time Password
              </label>
              <Input id="otp" type="text" placeholder="Enter OTP" required />
              <Button
                type="button"
                variant="link"
                onClick={handlePasswordRequest}
                className="text-primary p-0"
              >
                Remembered password?
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="link"
              onClick={handleOtpRequest}
              className="text-primary p-0"
            >
              Forgot password? Login with OTP
            </Button>
          )}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isOtpRequested ? "Login with OTP" : "Login"}
          </Button>
        </form>
        <LoginWithGoogle />
        <p className="mt-8 text-center text-sm text-gray-600">
          {" Don't have an account?"}{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary/80"
          >
            Sign up
          </Link>
        </p>
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
