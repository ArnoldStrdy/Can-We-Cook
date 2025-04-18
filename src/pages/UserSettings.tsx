import { useState } from "react";
import firebase from "firebase/compat/app";
import { uploadImage } from "./WrapperObjects";
import { getCustomerFromUID } from "./FirebaseAPI";
function UserSettings() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePasswordError, setChangePasswordError] = useState("");
    const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
    const auth = firebase.auth();
    const persistance = firebase.auth.Auth.Persistence.SESSION;
    const handleChangePassword = async () => {
        const user = firebase.auth().currentUser;
      
        if (user && newPassword.length >= 6 && newPassword === confirmPassword) {
          try {
            await user.updatePassword(newPassword);
            setChangePasswordSuccess("Password updated successfully!");
            setChangePasswordError("");
            setNewPassword("");
          } catch (error) {
            setChangePasswordError((error as any).message);
            setChangePasswordSuccess("");
          }
        } 
        else if (newPassword !== confirmPassword) {
          setChangePasswordError("Passwords do not match.");
          setChangePasswordSuccess("");
        }
        else if (newPassword.length < 6) {
          setChangePasswordError("Password must be at least 6 characters long.");
          setChangePasswordSuccess("");
        }
        else {
          setChangePasswordError("No user is currently signed in.");
          setChangePasswordSuccess("");
        }
      };
    
  
  return (
    

    <><div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border rounded" />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border rounded" />
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Account</h2>
      <p className="text-red-500">This action is irreversible. Please proceed with caution.</p>
      <button
        onClick={async () => {
          const user = firebase.auth().currentUser;
          if (user) {
            try {
              await user.delete();
              alert("Account deleted successfully.");
            } catch (error) {
              alert((error as any).message);
            }
          } else {
            alert("No user is currently signed in.");
          }
        }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        🗑️ Delete Account
      </button>
      <p className="text-red-500">This action is irreversible. Please proceed with caution.</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Profile Picture</h2>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const user = firebase.auth().currentUser;
          console.log(user);
          if (user && e.target.files) {
            const file = e.target.files[0];
            try {
              const url = await uploadImage(file);
              await user.updateProfile({ photoURL:url });
              getCustomerFromUID(user.uid).then((customer) => {
                if (customer) {
                  const customerRef = firebase.firestore().collection("customers").doc(customer.id);
                  console.log(customerRef);
                  customerRef.update({ ProfilePic: url });
                }
              });
              alert("Profile picture updated successfully!");
            } catch (error) {
              alert((error as any).message);
            }
          } else {
            alert("No user is currently signed in.");
          }
        }}
        className="w-full p-2 border rounded" />
    </div>
    </>
  );
}
export default UserSettings;
