import { KeyRound, ChevronRight, ShieldAlert, LogOut } from "lucide-react";

const SettingsTab = ({ onChangePassword, onLogout }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {/* Header */}
      <div>
        <p className="font-semibold">Account Settings</p>
        <p className="text-sm text-gray-500">Manage your account preferences</p>
      </div>

      {/* Change Password */}
      <div className="flex justify-between items-center border p-4 rounded-lg">
        {/* Left */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
            <KeyRound size={20} />
          </div>

          <div>
            <p className="font-medium">Change Password</p>
            <p className="text-sm text-gray-500">Update your password</p>
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={onChangePassword}
          className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          title="Update Password"
        >
          <span className="hidden sm:inline text-sm">Update</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Logout Section */}
      <div className="border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Content */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <ShieldAlert size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-red-600">
              Account Action
            </h3>
            <p className="text-sm text-gray-500">
              Securely sign out from your account on this device
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
