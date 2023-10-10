﻿import CloseModal from "@/components/CloseModal";
import SignIn from "@/components/SignIn";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white h-fit w-full py-20 px-2 rounded-lg ">
          <div className="absolute top-4 right-4 ">
            <CloseModal />
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;