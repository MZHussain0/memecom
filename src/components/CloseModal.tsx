"use client";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/Button";

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter();
  return (
    <Button
      variant={"subtle"}
      className="h-6 w-6 p-0 rounded-md text-zinc-900"
      aria-label="close modal"
      onClick={() => router.back()}>
      <XIcon className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
