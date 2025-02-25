"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Mail, Lock, Github } from "lucide-react";
import { toaster } from "@/components/toast";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { SuccessLottiePlayer } from "@/components/lottie/dotlottie";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
export default function Login() {
  const route = useRouter();
  if (auth.currentUser) route.push("/");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const login = useStore((state) => state.login);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
      setTimeout(() => {
        route.push("/company");
      }, 300);
      //eslint-disable-next-line
    } catch (error: any) {
      console.log(error);
      toaster(error.toString());
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

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGitHubLogin = () => {
    toaster("Please use Email/Password, this is still in development.");
  };
  if (loggedIn) {
    return (
      <div className="h-screen w-full bg-gradient-custom flex flex-col items-center justify-center p-4">
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
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </Button>
            <Button
              onClick={handleGitHubLogin}
              variant="outline"
              className="w-full"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
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
