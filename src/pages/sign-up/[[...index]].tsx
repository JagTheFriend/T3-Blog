import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="center-auth">
      <SignUp />
    </div>
  );
}
