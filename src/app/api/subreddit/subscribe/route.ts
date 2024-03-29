﻿import { getAuthSession } from "@/lib/auth";
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

    if (subscriptionExists) {
      return new Response("You are already subscribed", {
        status: 400,
      });
    }

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subredditId,
      },
    });

    return NextResponse.json(subredditId, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(`Invalid request payload : ${error.message}`, {
        status: 422,
      });
    }
    return new Response("Could not create subreddit!", { status: 500 });
  }
}
