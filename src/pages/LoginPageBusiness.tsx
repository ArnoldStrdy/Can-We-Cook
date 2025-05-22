import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { createOwner } from "./FirebaseAPI";
import Logo from "../assets/logoNameIcon.png";
import { AuthErrorCodes } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { getOwnerFromUID } from "./FirebaseAPI";
import Footer from "@/components/Footer";
import { Triangle } from "react-loader-spinner";

const LoginPageBusiness: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Login");
  const auth = firebase.auth();
  const persistance = firebase.auth.Auth.Persistence.LOCAL;
  // console.log("Auth: ", auth.currentUser);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await auth.setPersistence(persistance);
      await auth.signInWithEmailAndPassword(email, password);
      // console.log("User logged in successfully");
      if (auth.currentUser) {
        // console.log(auth.currentUser.uid);
        const owner = await getOwnerFromUID(auth.currentUser.uid);
        if (owner) {
          setLoading(false);
          toast.success("User logged in successfully");
          // console.log("Owner found: ", owner);
          navigate("/business");
        } else {
          setLoading(false);
          // console.log("No owner found for this user");
          toast.error("No owner found for this user");
          firebase.auth().signOut();
        }
      } else {
        setLoading(false);
        // console.log("No user is currently logged in");
      }
    } catch (error: any) {
      setLoading(false);
      let errorMessage = "An unexpected error occurred. Please try again.";

      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          errorMessage = "Invalid email format.";
          break;
        case AuthErrorCodes.USER_DELETED:
          errorMessage = "No account found with this email.";
          break;
        case AuthErrorCodes.INVALID_PASSWORD:
          errorMessage = "Incorrect password. Please try again.";
          break;
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
          errorMessage =
            "Too many failed attempts. Please wait a while before trying again.";
          break;
        case AuthErrorCodes.USER_DISABLED:
          errorMessage = "This account has been disabled.";
          break;
        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
          errorMessage = "Network error. Check your internet connection.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      console.error("Error logging in: ", error);
      toast.error(errorMessage);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      await auth.createUserWithEmailAndPassword(email, password);
      await auth.setPersistence(persistance);

      if (auth.currentUser) {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random&color=fff&rounded=true`;

        await createOwner(name, auth.currentUser.uid, avatarUrl);
        navigate("/createBusiness");
        // console.log("User signed up successfully with avatar:", avatarUrl);
        document.cookie = "name=" + name;
        document.cookie = "uid=" + auth.currentUser.uid;
        setLoading(false);
        toast.success("User signed up successfully");
      } else {
        setLoading(false);
        // console.log("No user is currently logged in: Catastrophic Error");
      }
    } catch (error: any) {
      setLoading(false);
      let errorMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          errorMessage = "Invalid email format.";
          break;
        case AuthErrorCodes.EMAIL_EXISTS:
          errorMessage = "An account with this email already exists.";
          break;
        case AuthErrorCodes.WEAK_PASSWORD:
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case AuthErrorCodes.OPERATION_NOT_ALLOWED:
          errorMessage = "Email/password accounts are not enabled.";
          break;
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
          errorMessage =
            "Too many failed attempts. Please wait a while before trying again.";
          break;
        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
          errorMessage = "Network error. Check your internet connection.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
      console.error("Error signing up: ", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <>
      <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px] bg-[#A7ACD9]/20 min-h-screen">
        {loading && (
          <div className="fixed top-0 backdrop-blur left-0 w-full h-full flex items-center justify-center bg-gray-950/50 z-50">
            <div className="flex flex-col gap-4 items-center">
              <Triangle color="#FF6F00" height={100} width={100} />
            </div>
          </div>
        )}
        <div className="container mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative mx-auto max-w-[525px] overflow-hidden rounded-lg px-10 py-16 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]">
                <div className="mb-10 text-center md:mb-10">
                  <a className="mx-auto inline-block max-w-[160px]">
                    <img src={Logo} alt="logo" />
                    <span className="pr-0.5">Business Login Page</span>
                  </a>
                </div>
                <form>
                  {status === "Signup" && (
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Name"
                        name="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
                      />
                    </div>
                  )}
                  <div className="mb-6">
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
                    />
                  </div>
                  {status !== "Reset" && (
                    <div className="mb-6">
                      <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
                      />
                    </div>
                  )}
                  <div className="mb-10">
                    <button
                      onClick={() => {
                        if (status === "Login") {
                          handleLogin();
                        } else if (status === "Signup") {
                          handleSignup();
                        } else if (status === "Reset") {
                          handleResetPassword();
                          toast.success("Password reset email sent!");
                        }
                      }}
                      type="button"
                      className="w-full cursor-pointer rounded-md border border-primary bg-[#554971] px-5 py-3 text-base font-medium text-white transition hover:bg-opacity-90"
                    >
                      {status === "Login"
                        ? "Login"
                        : status === "Signup"
                        ? "Sign Up"
                        : "Send Reset Link"}
                    </button>
                  </div>
                </form>
                <p className="text-base text-body-color dark:text-dark-6 mb-2">
                  <span className="pr-0.5">Not a Business?</span>
                  <span
                    onClick={() => navigate("/login")}
                    className="text-[#FF6F00] hover:underline hover:cursor-pointer"
                  >
                    Login here
                  </span>
                </p>
                <p className="text-base text-body-color dark:text-dark-6 mb-2">
                  <span className="pr-0.5">Forgot your password?</span>
                  <span
                    onClick={() => {
                      setStatus("Reset");
                    }}
                    className="text-[#FF6F00] hover:underline hover:cursor-pointer"
                  >
                    Reset it
                  </span>
                </p>
                <p className="text-base text-body-color dark:text-dark-6 mb-2">
                  <span className="pr-0.5">
                    {status === "Login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </span>
                  <span
                    onClick={() => {
                      if (status === "Login") {
                        setStatus("Signup");
                      } else {
                        setStatus("Login");
                      }
                    }}
                    className="text-[#FF6F00] hover:underline hover:cursor-pointer"
                  >
                    {status === "Login" ? "Sign Up" : "Log In"}
                  </span>
                </p>

                <div>
                  <span className="absolute right-1 top-1">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="1.39737"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 1.39737 38.6026)"
                        fill="#554971"
                      />
                      <circle
                        cx="1.39737"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 1.39737 1.99122)"
                        fill="#554971"
                      />
                      <circle
                        cx="13.6943"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 13.6943 38.6026)"
                        fill="#554971"
                      />
                      <circle
                        cx="13.6943"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 13.6943 1.99122)"
                        fill="#554971"
                      />
                      <circle
                        cx="25.9911"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 25.9911 38.6026)"
                        fill="#554971"
                      />
                      <circle
                        cx="25.9911"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 25.9911 1.99122)"
                        fill="#554971"
                      />
                      <circle
                        cx="38.288"
                        cy="38.6026"
                        r="1.39737"
                        transform="rotate(-90 38.288 38.6026)"
                        fill="#554971"
                      />
                      <circle
                        cx="38.288"
                        cy="1.99122"
                        r="1.39737"
                        transform="rotate(-90 38.288 1.99122)"
                        fill="#554971"
                      />
                      <circle
                        cx="1.39737"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 1.39737 26.3057)"
                        fill="#554971"
                      />
                      <circle
                        cx="13.6943"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 13.6943 26.3057)"
                        fill="#554971"
                      />
                      <circle
                        cx="25.9911"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 25.9911 26.3057)"
                        fill="#554971"
                      />
                      <circle
                        cx="38.288"
                        cy="26.3057"
                        r="1.39737"
                        transform="rotate(-90 38.288 26.3057)"
                        fill="#554971"
                      />
                      <circle
                        cx="1.39737"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 1.39737 14.0086)"
                        fill="#554971"
                      />
                      <circle
                        cx="13.6943"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 13.6943 14.0086)"
                        fill="#554971"
                      />
                      <circle
                        cx="25.9911"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 25.9911 14.0086)"
                        fill="#554971"
                      />
                      <circle
                        cx="38.288"
                        cy="14.0086"
                        r="1.39737"
                        transform="rotate(-90 38.288 14.0086)"
                        fill="#554971"
                      />
                    </svg>
                  </span>
                  <span className="absolute bottom-1 left-1">
                    <svg
                      width="29"
                      height="40"
                      viewBox="0 0 29 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="2.288"
                        cy="25.9912"
                        r="1.39737"
                        transform="rotate(-90 2.288 25.9912)"
                        fill="#554971"
                      />
                      <circle
                        cx="14.5849"
                        cy="25.9911"
                        r="1.39737"
                        transform="rotate(-90 14.5849 25.9911)"
                        fill="#554971"
                      />
                      <circle
                        cx="26.7216"
                        cy="25.9911"
                        r="1.39737"
                        transform="rotate(-90 26.7216 25.9911)"
                        fill="#554971"
                      />
                      <circle
                        cx="2.288"
                        cy="13.6944"
                        r="1.39737"
                        transform="rotate(-90 2.288 13.6944)"
                        fill="#554971"
                      />
                      <circle
                        cx="14.5849"
                        cy="13.6943"
                        r="1.39737"
                        transform="rotate(-90 14.5849 13.6943)"
                        fill="#554971"
                      />
                      <circle
                        cx="26.7216"
                        cy="13.6943"
                        r="1.39737"
                        transform="rotate(-90 26.7216 13.6943)"
                        fill="#554971"
                      />
                      <circle
                        cx="2.288"
                        cy="38.0087"
                        r="1.39737"
                        transform="rotate(-90 2.288 38.0087)"
                        fill="#554971"
                      />
                      <circle
                        cx="2.288"
                        cy="1.39739"
                        r="1.39737"
                        transform="rotate(-90 2.288 1.39739)"
                        fill="#554971"
                      />
                      <circle
                        cx="14.5849"
                        cy="38.0089"
                        r="1.39737"
                        transform="rotate(-90 14.5849 38.0089)"
                        fill="#554971"
                      />
                      <circle
                        cx="26.7216"
                        cy="38.0089"
                        r="1.39737"
                        transform="rotate(-90 26.7216 38.0089)"
                        fill="#554971"
                      />
                      <circle
                        cx="14.5849"
                        cy="1.39761"
                        r="1.39737"
                        transform="rotate(-90 14.5849 1.39761)"
                        fill="#554971"
                      />
                      <circle
                        cx="26.7216"
                        cy="1.39761"
                        r="1.39737"
                        transform="rotate(-90 26.7216 1.39761)"
                        fill="#554971"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flex w-full justify-center items-center">
        <Footer />
      </div>
    </>
  );
};

export default LoginPageBusiness;
