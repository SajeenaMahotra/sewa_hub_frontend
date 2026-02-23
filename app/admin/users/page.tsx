import { handleGetAllUsers } from "@/lib/actions/admin/user-actions";
import UsersClient from "./_components/UserTable";
import { redirect } from "next/navigation";

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const page = params.page as string || '1';
  const size = params.size as string || '10';
  const search = params.search as string || '';

  const response = await handleGetAllUsers(page, size, search);

  if (!response.success) {
    // if the API reports an authorization problem, send user back to login
    const msg = response.message || 'Failed to load users';
    if (/unauthorized|jwt/i.test(msg)) {
      redirect('/login');
    }
    throw new Error(msg);
  }

  // Log the response to debug
  console.log('API Response:', {
    hasData: !!response.data,
    hasPagination: !!response.pagination,
    pagination: response.pagination
  });

  return (
    <UsersClient 
      users={response.data || []} 
      pagination={response.pagination}
      initialSearch={search}
    />
  );
}