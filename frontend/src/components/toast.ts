import { toast } from "sonner";
export const toaster = (message: string) => {
  toast(message, {
    duration: 2000,
  });
};
