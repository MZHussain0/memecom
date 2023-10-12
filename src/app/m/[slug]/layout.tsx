import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

async function layout({ children, params }: Props) {
  const { slug } = params;
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          userId: session.user.id,
          subredditId: subreddit?.id,
        },
      });

  const isSubcribed = !!subscription;

  if (!subreddit) {
    return notFound();
  }

  const memberCount = await db.subscription.count({
    where: {
      subredditId: subreddit?.id,
    },
  });
  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div className="">
        {/* Button to take us back */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md: gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/* Info Sidebar */}
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About m/{slug}</p>
            </div>

            <dl className="divide-y divide-gray-200 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">created</dt>
                <dt className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, "MMMM dd, yyyy")}
                  </time>
                </dt>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dt className="text-gray-700">
                  <div className="text-zinc-700">{memberCount}</div>
                </dt>
              </div>
              {subreddit.creatorId === session?.user?.id && (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-muted-foreground text-sm">
                    you created this community
                  </p>
                </div>
              )}
              {subreddit.creatorId !== session?.user?.id && (
                <SubscribeLeaveToggle
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                  isSubscribed={isSubcribed}
                />
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
