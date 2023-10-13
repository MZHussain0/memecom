import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { postId, voteType } = PostVoteValidator.parse(body);
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const ExistingVote = await db.vote.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    if (ExistingVote) {
      if (ExistingVote.type === voteType) {
        await db.vote.delete({
          where: {
            postId_userId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("Vote removed", { status: 200 });
      }

      await db.vote.update({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // Recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;
        return acc;
      }, 0);

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const CachedPayload: CachedPost = {
          authorUsername: post.author.name ?? "",
          content: JSON.stringify(post.content),
          createdAt: post.createdAt,
          currentVote: voteType,
          id: post.id,
          title: post.title,
        };

        await redis.hset(`post:${post.id}`, CachedPayload);
      }
      return new Response("Vote added", { status: 200 });
    }

    await db.vote.create({
      data: {
        postId,
        type: voteType,
        userId: session.user.id,
      },
    });
    // Recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const CachedPayload: CachedPost = {
        authorUsername: post.author.name ?? "",
        content: JSON.stringify(post.content),
        createdAt: post.createdAt,
        currentVote: voteType,
        id: post.id,
        title: post.title,
      };

      await redis.hset(`post:${post.id}`, CachedPayload);
    }

    return new Response("Vote added", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(`Invalid request payload : ${error.message}`, {
        status: 422,
      });
    }
    return new Response("Could not register your vote, please try again", {
      status: 500,
    });
  }
}
