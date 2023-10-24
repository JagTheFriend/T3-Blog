import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="center-auth">
      <SignIn />
    </div>
  );
}
