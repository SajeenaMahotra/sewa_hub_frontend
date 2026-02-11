import { handleGetAllUsers } from "@/lib/actions/admin/user-actions";
import UsersClient from "./_components/UserTable";

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
    throw new Error(response.message || 'Failed to load users');
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