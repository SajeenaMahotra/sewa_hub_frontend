import { getUserData } from "@/lib/cookie";

export default async function DashboardPage() {
  const user = await getUserData();

  return (
    <h1 className="text-2xl font-semibold">
      Welcome{user ? `, ${user.fullname}` : ""}
    </h1>
  );
}
