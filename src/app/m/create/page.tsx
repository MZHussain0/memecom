"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useCustomToast } from "@/hooks/useCustomHooks";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreatePage = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast.error("subreddit already exists!");
        }
        if (err.response?.status === 422) {
          toast.error(
            "Invalid subreddit name. Please choose a name between 3 to 20 charcters"
          );
        }
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      toast.error("Something went wrong");
    },

    onSuccess: (data) => {
      toast.success("Community created successfully");
      router.push(`/m/${data}`);
    },
  });
  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6 ">
        <div className="flex justify-between items-center">
          <h1 className=" text-xl font-semibold">Create a community</h1>
        </div>

        <hr className="bg-zinc-100 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community name including capitalization cannot be changed
          </p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              m/
            </p>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        <div className="flex  justify-end gap-4">
          <Button variant={"subtle"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            variant={"default"}
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}>
            Create community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
