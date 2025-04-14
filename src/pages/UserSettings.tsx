import { useState } from "react";
import firebase from "firebase/compat/app";
function UserSettings() {
    const [newPassword, setNewPassword] = useState("");
    const [changePasswordError, setChangePasswordError] = useState("");
    const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
    const auth = firebase.auth();
    const persistance = firebase.auth.Auth.Persistence.SESSION;
    const handleChangePassword = async () => {
        const user = firebase.auth().currentUser;
      
        if (user && newPassword.length >= 6) {
          try {
            await user.updatePassword(newPassword);
            setChangePasswordSuccess("Password updated successfully!");
            setChangePasswordError("");
            setNewPassword("");
          } catch (error) {
            setChangePasswordError((error as any).message);
            setChangePasswordSuccess("");
          }
        } else {
          setChangePasswordError("Password must be at least 6 characters long.");
          setChangePasswordSuccess("");
        }
      };
    
  
  return (
    

    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleChangePassword}
            className="bg-[#FF6F00] text-white px-4 py-2 rounded"
          >
            ✔ Update Password
          </button>
          {changePasswordError && (
            <p className="text-red-500">{changePasswordError}</p>
          )}
          {changePasswordSuccess && (
            <p className="text-green-500">{changePasswordSuccess}</p>
          )}
        </div>
  );
}
export default UserSettings;
