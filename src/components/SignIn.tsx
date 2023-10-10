import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignIn = ({}) => {
  return (
    <div className="container mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center ">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back memecom
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up a Memecom account and agree to a
          User Agreement and Privacy Policy
        </p>

        {/* Sign in form */}
        <UserAuthForm />
        <p className="px-8 text-sm text-center text-zinc-700">
          New to Memecom?{" "}
          <Link
            href="/sign-up"
            className="hover:underline hover:text-zinc-800 text-zinc-900 underline-offset-4">
            {" "}
            Sign up!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
