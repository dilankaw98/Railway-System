"use client";
import React, { use, useState } from "react";
import image3 from "../../../public/assets/1t.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

function login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Logging in with:", email, password);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        console.log("Authentication successful:", user);

        const userRef = doc(db, `user/${user.uid}`);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.data();

          localStorage.setItem("user", userData.email);
          console.log("User data saved to localStorage:", userData.email);
          localStorage.setItem("id", user.uid);
          console.log(user.uid);

          console.log("User data saved to localStorage:", userData);

          router.push("/home");
        } else {
          console.error("User data not found in database.");
          Swal.fire("Error", "User data not found in database", "error");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Swal.fire("Error", "Invalid email or password", "error");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="w-1/2 h-full">
        <Image
          className="object-cover w-full h-full"
          src={image3}
          alt="Login Image"
        />
      </div>

      <div className="w-1/2 flex items-center justify-center h-full shadow-lg bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-md w-full px-6 py-12 bg-white shadow-xl rounded-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl border border-blue-100 hover:border-blue-200">
          <h2 className="text-4xl font-bold text-blue-900 leading-9 tracking-tight text-center font-[Poppins] text-[40px]">
            Login
          </h2>
          <br />
          <h5 className="text-center text-blue-800 font-semibold text-[10px] leading-[15px] font-[Poppins]">
            Please enter your login details to sign in.
          </h5>

          <div className="mt-10">
            <div className="relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-blue-400 peer sm:text-sm sm:leading-6 font-[Poppins]"
                style={{ backgroundColor: "white" }}
                placeholder="Email Address"
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2 text-blue-400 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-400 peer-focus:text-blue-600 font-[Poppins]"
              >
                Email Address
              </label>
            </div>

            <div className="relative mt-6">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-blue-400 peer sm:text-sm sm:leading-6 font-[Poppins]"
                style={{ backgroundColor: "white" }}
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2 text-blue-400 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-400 peer-focus:text-blue-600 font-[Poppins]"
              >
                Password
              </label>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-[Poppins]"
                onClick={handleLogin}
              >
                Log In
              </button>
            </div>

            <p className="mt-10 text-sm font-semibold text-blue-600 font-[Poppins]">
              Don't you have an account?{" "}
              <a
                href="/signup/"
                className="font-semibold leading-6 text-blue-600 hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;
