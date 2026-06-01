// import StatCard from "../../../../components/reusable/StatCard";
import { userManagementService } from '../../service/userManagementService';
import { useEffect, useState } from 'react';
import { ArrowRight, Ban, CheckCircle, Loader2, Users, X } from 'lucide-react';
import Search from '../../../../components/ui/Search';
import { UseAdminStore } from '../../store/useAdminStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ROLES } from '../../../../constants/constants';

import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';
import StatCard from '@/components/reusable/StatsCard';

const UserManagement = () => {
  const setUsers = UseAdminStore((state) => state.setUsers);
  const users = UseAdminStore((state) => state.users);
  const fetchStats = UseAdminStore((state) => state.fetchStats);
  const userStats = UseAdminStore((state) => state.userStats);

  const updateUser = UseAdminStore((state) => state.updateUser);
  const removeUser = UseAdminStore((state) => state.removeUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);
  useEffect(() => {
    if (searchQuery !== debouncedSearch) {
      setSearchLoading(true);
    } else {
      setSearchLoading(false);
    }
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, roleFilter]);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const [data] = await Promise.all([
          userManagementService.getUsers({
            page: currentPage,
            search: debouncedSearch,
            status: statusFilter,
            role: roleFilter,
          }),
          fetchStats(),
        ]);
        setUsers(data.users);

        setTotalPages(data.totalPages);
      } catch (error) {
        console.error();
        toast.error('Failed to fetch:' + error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [currentPage, debouncedSearch, statusFilter, roleFilter]);

  const handleToggleBlock = async (id: string) => {
    try {
      const { userData } = await userManagementService.toggleBlock(id);
      updateUser(userData);
      await fetchStats();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("We couldn't update the user's status right now,try again");
      } else {
        toast.error('An unexpected error occurred:');
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { userData } = await userManagementService.deleteUser(id);
      removeUser(userData.id);
      await fetchStats();
    } catch (error) {
      toast.error(error?.toString() || 'Something went wrong');
    }
  };

  return (
    <>
      {/* main content  */}
      <div className="px-6 py-5 mt-0 bg-card">
        <div className="mb-1 ">
          <h1 className="text-2xl font-bold ">User Management</h1>
          <p className="text-gray-600">
            Manage users, view their details, and control account status.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-6  mt-10">
          <StatCard
            key={1}
            label={'Total Users'}
            value={userStats?.totalUsers ?? 0}
            cls={'text-blue'}
          />

          <StatCard
            key={2}
            label={'Active Users'}
            value={userStats?.activeUsers ?? 0}
            cls={'text-primary border-r-green-800 border-b-green-800'}
          />
          <StatCard
            key={3}
            label={'Blocked Users'}
            value={userStats?.blockedUsers ?? 0}
            cls={'border-r-red-900 border-b-red-900'}
          />
        </div>
        {/* Search and filters */}
        <div className="bg-card rounded-lg shadow-sm mt-3 p-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* SEARCH */}
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <Search
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                />
                {/* Add loading indicator for debounced search */}
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>

            {/* ROLE FILTER */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <Select
                  value={roleFilter}
                  onValueChange={(value) => setRoleFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-40 pl-4 pr-10 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-800">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value={ROLES.USER}>
                      {ROLES.USER[0].toUpperCase() + ROLES.USER.slice(1)}
                    </SelectItem>
                    <SelectItem value={ROLES.TRAINER}>
                      {ROLES.TRAINER[0].toUpperCase() + ROLES.TRAINER.slice(1)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* STATUS FILTER */}
            <div className="w-full md:w-auto">
              <div className="relative">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full md:w-40 pl-4 pr-10 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-800">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deleted">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {/* Users table */}
        {isLoading ? (
          <div className="absolute top-0 left-0 right-0 h-1 bg-green-600 animate-pulse z-10" />
        ) : (
          <div className=" pt-1 bg-secondary shadow-md overflow-hidden  ">
            <div className="overflow-x-auto ">
              <table className="min-w-full divide-y divide-gray-600  bg-secondary">
                <thead className="bg-green-950">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th className="px-6 py-2 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-950 divide-y divide-gray-500">
                  {users?.length > 0 ? (
                    users?.map((user) => (
                      <tr key={user.id} className="hover:bg-secondary">
                        {/* Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-gray-950 border border-green-600 flex items-center justify-center">
                              <span className="text-main text-sm font-medium">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className=" px-2 text-sm text-gray-400">
                              {user.name || '—'}
                            </div>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className=" px-2 text-sm text-gray-400">
                            {user.email || '—'}
                          </div>
                        </td>
                        {/* role */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {user.role || '—'}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isBlocked
                                ? 'bg-red-100 text-red-800'
                                : user.isActive
                                  ? 'bg-primary text-white-800'
                                  : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {user.isBlocked
                              ? 'Blocked'
                              : user.isActive
                                ? 'Active'
                                : 'Deleted'}
                          </span>
                        </td>

                        {/* Registered */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.isActive && (
                            <div className="flex justify-end space-x-2">
                              {/* block or unblock user */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="p-1 rounded-full hover:bg-gray-600 cursor-pointer">
                                    {user.isBlocked ? (
                                      <CheckCircle className="text-green-400 h-5 w-5" />
                                    ) : (
                                      <Ban className="text-red-400 h-5 w-5" />
                                    )}
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {user.isBlocked
                                        ? 'Unblock User?'
                                        : 'Block User?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {user.isBlocked
                                        ? `This will restore access for ${user.email}.`
                                        : `This will restrict access for ${user.email} immediately.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleToggleBlock(user.id)}
                                      className={
                                        user.isBlocked
                                          ? 'bg-green-600 hover:bg-green-700'
                                          : 'bg-red-600 hover:bg-red-700'
                                      }
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {/* delete user */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  {user.isActive && (
                                    <button className="p-1 rounded-full hover:bg-gray-600 cursor-pointer">
                                      <X className="h-5 w-5 text-red-400" />
                                    </button>
                                  )}
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      "Delete User?"
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {user.isActive &&
                                        `This user ${user.email} will delete .`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* pagination */}
            {users?.length > 0 && (
              <div className="flex justify-between items-center px-6 py-4 border-t bg-black">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 border border-gray-400 hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isActive = currentPage === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white border border-emerald-500'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 border border-gray-400 hover:bg-gray-800 text-gray-700'
                    }`}
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserManagement;
