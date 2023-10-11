import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCustomToast = () => {
  const router = useRouter();
  const loginToast = () => {
    toast.error("Login is required to create a community", {
      action: {
        label: "Login",
        onClick: () => {
          router.push("/sign-in");
          toast.dismiss();
        },
      },
    });
  };

  return { loginToast };
};
