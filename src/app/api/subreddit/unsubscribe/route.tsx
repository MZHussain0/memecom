import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { subredditId } = subredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("You are not subscribed", {
        status: 400,
      });
    }

    // check if user is the creator of the subreddit
    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (subreddit) {
      return new Response("you can't unsubscribe your own community", {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          userId: session.user.id,
          subredditId,
        },
      },
    });

    return NextResponse.json(subredditId, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(`Invalid request payload : ${error.message}`, {
        status: 422,
      });
    }
    return new Response("Could not unsubscribe!", { status: 500 });
  }
}
