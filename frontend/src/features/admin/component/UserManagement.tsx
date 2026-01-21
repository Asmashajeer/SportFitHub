import StatCard from "../../../components/ui/StatCard";
import { adminService } from "../service/adminService";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Ban, CheckCircle, Users, X } from "lucide-react";
import { UseAdminStore } from "../store/useAdminStore";


import { LIMIT, ROLES } from "../../../constants/constants";

const UserManagement = () => {
  const setUsers = UseAdminStore((state) => state.setUsers);
  const users = UseAdminStore((state) => state.users);
  const fetchStats = UseAdminStore((state) => state.fetchStats);
  const userStats = UseAdminStore((state) => state.userStats);
  
  const updateUser = UseAdminStore((state) => state.updateUser);
  const removeUser = UseAdminStore((state) => state.removeUser);
  const [currentPage, setCurrentPage] = useState(1);

  

  useEffect(() => {
    const loadUsers = async () => {          
      const [data,stats] =await Promise.all([ adminService.getUsers(currentPage), fetchStats()]);
      setUsers(data);          
    };
     loadUsers();
  }, [currentPage]);

  const totalPages=useMemo(()=>{    
    const total=userStats?.totalUsers?? 0;
    return Math.ceil(total/LIMIT);
  },[userStats?.totalUsers])

 

  const handleToggleBlock = async (id: string) => {
    const data = await adminService.toggleBlock(id);
    console.log('updated Data',data);
    updateUser(data.data);    
    console.log('users:',users);
    await fetchStats();    
  };

  const handleDeleteUser = async (id: string) => {
    const data = await adminService.deleteUser(id);
    console.log(data);
    removeUser(data.id);
    console.log("user stats",userStats);
    await fetchStats();
  };

 

  return (
    <>
      {/* main content  */}
      <div>
        <div className="mb-2">
          <h1 className="text-2xl font-bold mb-1">User Management</h1>
          <p className="text-gray-600">
            Manage users, view their details, and control account status.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-6  mt-10">
          <StatCard
            key={1}
            title={"Total Users"}
            value={userStats?.totalUsers ?? 0}
            icon={Users}
            color={"text-primary"}
            borderColor={"border-r-blue-300 border-b-blue-300"}
          />

          <StatCard
            key={2}
            title={"Active Users"}
            value={userStats?.activeUsers ?? 0}
            icon={Users}
            color={"text-primary"}
            borderColor={"border-r-green-600 border-b-green-600"}
          />
          <StatCard
            key={3}
            title={"Blocked Users"}
            value={userStats?.blockedUsers ?? 0}
            icon={Users}
            color={"text-primary"}
            borderColor={"border-r-red-400 border-b-red-400"}
          />
        </div>
        {/* Search and filters */}
        <div className="bg-secondary rounded-lg shadow-sm p-4 my-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex-1"></div>
          </div>
        </div>
        {/* Users table */}

        <div className="bg-secondary rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto ">
            <table className="min-w-full divide-y divide-gray-600  bg-secondary">
              <thead className="bg-green-950">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Registered On
                  </th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-950 divide-y divide-gray-500">
                {users?.length > 0 ? (
                  users
                    ?.filter((user) => user.role !== ROLES.ADMIN)
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-secondary">
                        {/* User Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-gray-700 border border-green-600 flex items-center justify-center">
                              <span className="text-main text-sm font-medium">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm text-gray-500">
                                {user.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {user.email || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {user.role || "—"}
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isBlocked
                                ? "bg-red-100 text-red-800"
                                : user.isActive
                                ? "bg-primary text-white-800"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {user.isBlocked
                              ? "Blocked"
                              : user.isActive
                              ? "Active"
                              : "Deleted"}
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
                             
                              <button
                                className="p-1 rounded-full hover:bg-gray-600 cursor-pointer"
                                onClick={() => handleToggleBlock(user.id)}
                              >
                                {user.isBlocked ? (
                                  <CheckCircle className="  text-green-400 h-5 w-5" />
                                ) : (
                                  <Ban className=" text-red-400 h-5 w-5" />
                                )}
                              </button>
                              <button
                                className="p-1 rounded-full text-red-600 hover:bg-gray-600 cursor-pointer"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <X className="h-5 w-5" />
                              </button>
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
                    ? "bg-gray-700 text-gray-600 cursor-not-allowed"
                    : "bg-gray-700 border border-gray-400 hover:bg-gray-800 text-gray-300"
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
                        ? "bg-emerald-600 text-white border border-emerald-500"
                        : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
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
                    ? "bg-gray-700 text-gray-600 cursor-not-allowed"
                    : "bg-gray-700 border border-gray-400 hover:bg-gray-800 text-gray-700"
                }`}
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default UserManagement;
