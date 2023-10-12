"use client";

import { useCustomToast } from "@/hooks/useCustomHooks";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, startTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/Button";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast.success(`Subscribed successfully to m/${subredditName}}`);
    },
  });

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast.success(`Unsubscribed to m/${subredditName}}`);
    },
  });
  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnSubLoading}
      className="w-full mb-4 mt-1">
      Leave Community
    </Button>
  ) : (
    <Button
      onClick={() => subscribe()}
      isLoading={isSubLoading}
      className="w-full mb-4 mt-1">
      Join to Post
    </Button>
  );
};

export default SubscribeLeaveToggle;
