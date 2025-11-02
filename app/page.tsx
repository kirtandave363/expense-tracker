import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const userId = await getUserFromToken();

  // If logged in, go to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // Show landing page if not logged in
  return <LandingPage />;
}
