import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import "tailwindcss/tailwind.css";

export default function Home() {
  return (
    <div className="">
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4 py-6 ">
        {/* feed */}

        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500 ">
                Your personal memecom homepage. Come here to check in with your
                favourite meme communities.
              </p>
            </div>
            <Link
              href={"/m/create"}
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}>
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
