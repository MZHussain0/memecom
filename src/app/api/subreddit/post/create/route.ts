import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { postValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { subredditId, title, content } = postValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("subscribe to post", {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        subredditId,
        authorId: session.user.id,
      },
    });

    return new Response("post created", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(`Invalid request payload : ${error.message}`, {
        status: 422,
      });
    }
    return new Response(
      "Could not post to subreddit at this time. Please try again later",
      {
        status: 500,
      }
    );
  }
}
