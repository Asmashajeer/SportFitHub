import { useEffect, useState } from "react";
import { ROLES, type UserRole } from "../../../constants/constants";
import type { User } from "../../auth/store/useAuthStore";
interface EditUserModalProps {
  user: Omit<User, "hasProfile"> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role as UserRole);
    }
  }, [user]);
  if (!isOpen || !user) return null;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-md p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Edit User Role</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email (Read Only)
            </label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full bg-gray-800 border border-gray-700 text-gray-500 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Role</label>
            <select
              name="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded-md"
            >
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
