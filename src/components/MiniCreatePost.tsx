"use client";
import { ImageIcon, Link2Icon } from "lucide-react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <li className="overflow-x-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
            className="h-8 w-8"
          />
          <span className="absolute bottom-0 right-0 rounded-full bg-green-500 h-3 w-3 outline outline-2 outline-white" />
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathname + "/submit")}
          placeholder="Create a post"
        />
        <Button
          variant={"ghost"}
          onClick={() => router.push(pathname + "/submit")}>
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => router.push(pathname + "/submit")}>
          <Link2Icon className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
