"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export const UserLottiePlayer = () => {
  return <DotLottieReact loop autoplay src="/lotties/userVoice.lottie" />;
};
export const AiLottiePlayer = () => {
  return <DotLottieReact loop autoplay src="/lotties/aiVoice.lottie" />;
};
export const SuccessLottiePlayer = () => {
  return <DotLottieReact loop autoplay src="/lotties.tick.lottie" />;
};
