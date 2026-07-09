import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] py-20">
      <SignUp />
    </div>
  );
}
