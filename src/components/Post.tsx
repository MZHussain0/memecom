import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  subredditName: string;
  commentAmt: number;
}

const Post: FC<PostProps> = ({ post, subredditName, commentAmt }) => {
  const pref = useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex px-6 py-4 justify-between">
        {/* Post votes */}
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-sm text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`/m/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2">
                  m/${subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/m/${subredditName}/posts/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pref}>
            <EditorOutput content={post.content} />
            {pref.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <a
          href={`/m/${subredditName}/posts/${post.id}`}
          className="w-fit flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </a>{" "}
      </div>
    </div>
  );
};

export default Post;
