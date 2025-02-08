const dotenv = require("dotenv");
dotenv.config();
export const interviewRound = async (round: string) => {
  switch (round) {
    case "google-hr":
      return process.env.GOOGLE_HR;
    case "google-tech":
      return process.env.GOOGLE_TECH;
    case "amazon-hr":
      return process.env.AMAZON_HR;
    case "amazon-tech":
      return process.env.AMAZON_TECH;
    case "facebook-hr":
      return process.env.FACEBOOK_HR;
    case "facebook-tech":
      return process.env.FACEBOOK_TECH;
    case "microsoft-hr":
      return process.env.MICROSOFT_HR;
    case "microsoft-tech":
      return process.env.MICROSOFT_TECH;
    case "apple-hr":
      return process.env.APPLE_HR;
    case "apple-tech":
      return process.env.APPLE_TECH;
    case "netflix-hr":
      return process.env.NETFLIX_HR;
    case "netflix-tech":
      return process.env.NETFLIX_TECH;
    case "nvidia-hr":
      return process.env.NVIDIA_HR;
    case "nvidia-tech":
      return process.env.NVIDIA_TECH;
    default:
      return "No such round exists";
  }
  return "No such round exists";
};
