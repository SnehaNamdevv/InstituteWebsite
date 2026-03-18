import { useState } from "react";
import { Lock, KeyRound } from "lucide-react";

export default function Settings({ dark }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    const student = JSON.parse(localStorage.getItem("student"));

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setMessage("Updating password...");

      const res = await fetch(
        `https://institute-backend-0ncp.onrender.com/student/updateStudent/${student.studentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Update failed");
        return;
      }

      setMessage("Password updated successfully ✅");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowUpdateModal(false);
        setMessage("");
      }, 1500);
    } catch (error) {
      console.log(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div
  className={`rounded-xl p-6 shadow flex items-center justify-between
  ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
>
        <h2 className="text-xl font-semibold">⚙️ Security Settings</h2>
        <p className="text-sm opacity-70">Manage your account password</p>
      </div>

      {/* Settings Cards */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Update Password */}
        <div
          onClick={() => setShowUpdateModal(true)}
          className={`cursor-pointer p-6 rounded-xl shadow hover:shadow-lg transition
          ${dark ? "bg-slate-700 text-white" : "bg-white text-gray-800"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                dark ? "bg-indigo-600" : "bg-indigo-100"
              }`}
            >
              <Lock
                size={24}
                className={`${dark ? "text-white" : "text-indigo-600"}`}
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg">Update Password</h3>
              <p className="text-sm opacity-70">
                Change your current account password
              </p>
            </div>
          </div>
        </div>

        {/* Forgot Password */}
        <div
          onClick={() => setShowForgotModal(true)}
          className={`cursor-pointer p-6 rounded-xl shadow hover:shadow-lg transition
          ${dark ? "bg-slate-700 text-white" : "bg-white text-gray-800"}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                dark ? "bg-indigo-600" : "bg-indigo-100"
              }`}
            >
              <KeyRound
                size={24}
                className={`${dark ? "text-white" : "text-indigo-600"}`}
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg">Forgot Password</h3>
              <p className="text-sm opacity-70">
                Reset your password via email
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE PASSWORD MODAL */}
      {showUpdateModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-xl
            ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-5">Update Password</h3>

            {message && (
              <div
                className={`text-sm p-2 rounded mb-4 text-center
                ${dark ? "bg-slate-700" : "bg-gray-100"}`}
              >
                {message}
              </div>
            )}

            <div className="space-y-4">

              {/* Old Password */}
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg outline-none focus:ring-2
                ${
                  dark
                    ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                    : "bg-white border-gray-300 focus:ring-indigo-500 text-gray-800"
                }`}
              />

              {/* New Password */}
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg outline-none focus:ring-2
                ${
                  dark
                    ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                    : "bg-white border-gray-300 focus:ring-indigo-500 text-gray-800"
                }`}
              />

              {/* Confirm Password */}
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg outline-none focus:ring-2
                ${
                  dark
                    ? "bg-slate-900 border-slate-600 focus:ring-indigo-500 text-white"
                    : "bg-white border-gray-300 focus:ring-indigo-500 text-gray-800"
                }`}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">

              {/* Cancel */}
              <button
                onClick={() => setShowUpdateModal(false)}
                className={`px-4 py-2 rounded-lg
                ${
                  dark
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>

              {/* Save */}
              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}