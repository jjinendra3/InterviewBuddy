"use client";
import React from "react";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toaster } from "./toast";
function LoginWithGoogle() {
  const loginWithGoogle = useStore((state) => state.loginWithGoogle);
  const route = useRouter();
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="mt-6 flex w-full gap-3">
        <Button
          onClick={async () => {
            try {
              const response = await loginWithGoogle();
              if (!response.success) throw new Error(response.message);
              route.push("/");
            } catch (error) {
              toaster(error as string);
            }
          }}
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
      </div>
    </div>
  );
}

export default LoginWithGoogle;
