import React, { useState } from "react";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { createCustomer } from "./FirebaseAPI";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const auth = firebase.auth();
  const persistance = firebase.auth.Auth.Persistence.SESSION;
  console.log("Auth: ", auth.currentUser);
  const handleLogin = async () => {
    try {
      await auth.setPersistence(persistance);
      await auth.signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully");
      if (auth.currentUser) {
        console.log(auth.currentUser.uid);
      } else {
        console.log("No user is currently logged in");
      }
    } catch (error) {
      setError((error as any).message);
      console.error("Error logging in: ", error);
    }
  };

  const handleSignup = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      await auth.setPersistence(persistance);
      if (auth.currentUser) {
        createCustomer(email, auth.currentUser?.uid);
      } else {
        console.log("No user is currently logged in: Catostrophic Error");
      }
      console.log("User signed up successfully");
    } catch (error) {
      setError((error as any).message);
      console.error("Error signing up: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully");
    } catch (error) {
      setError((error as any).message);
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 max-w-sm mx-auto gap-4">
      <h2 className="font-semibold">{isLogin ? "Login" : "Sign Up"}</h2>
      <input
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={isLogin ? handleLogin : handleSignup}
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
      {error && <p>{error}</p>}
      <div className="flex flex-row gap-4 w-full">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer"
        >
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
        <button
          onClick={handleLogout}
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
