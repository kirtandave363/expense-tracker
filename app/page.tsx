import { redirect } from "next/navigation";
import { getUserFromToken } from "@/lib/auth";

export default async function HomePage() {
  const userId = await getUserFromToken();

  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
