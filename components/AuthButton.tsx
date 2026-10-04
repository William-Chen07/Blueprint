import { auth, signIn, signOut } from "@/auth";

export default async function AuthButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button type="submit" className="rounded-md border px-3 py-1 text-sm">
          Sign in with GitHub
        </button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="flex items-center gap-2 text-sm"
    >
      <span>{session.user.name}</span>
      <button type="submit" className="rounded-md border px-3 py-1">
        Sign out
      </button>
    </form>
  );
}