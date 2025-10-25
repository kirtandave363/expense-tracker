import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
