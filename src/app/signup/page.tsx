"use client";
import React, { useState } from "react";
import image3 from "../../../public/assets/1t.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { app, auth, db } from "../../../firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

function Signup() {
  const router = useRouter();
  const [type, setType] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nic, setNic] = useState<string>("");
  const [nicError, setNicError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const checkPassword = (value: string) => {
    setCpassword(value);
    setType(password === value);
  };

  const validateNIC = (nic: string) => {
    const nicPattern = /^(?:\d{12}|\d{9}[Vv])$/;
    if (!nicPattern.test(nic)) {
      setNicError("Invalid NIC format. Use 12 digits or 9 digits with 'V'.");
      return false;
    } else {
      setNicError("");
      return true;
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validateName = (name: string) => {
    if (name.length < 2) {
      setNameError("Name must be at least 2 characters long");
      return false;
    } else if (!/^[a-zA-Z\s]*$/.test(name)) {
      setNameError("Name can only contain letters and spaces");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const handleSignup = async () => {
    Swal.fire({
      title: "Processing...",
      html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    if (!validateEmail(email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return;
    }

    if (!validateName(name)) {
      Swal.fire("Error", "Please enter a valid name", "error");
      return;
    }

    if (!validateNIC(nic)) {
      Swal.fire(
        "Error",
        "Invalid NIC format. Use 12 digits or 9 digits with 'V'.",
        "error"
      );
      return;
    }

    if (type) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("User signed up:", user);

        const values = {
          email: email,
          uname: name,
          nic: nic,
          uid: user?.uid,
          rfid: "1234",
        };

        const userRef = doc(db, `user/${user.uid}`);
        await setDoc(userRef, values);

        Swal.fire("Success", "User added successfully", "success");
        await localStorage.setItem("user", values.email);
        localStorage.setItem("id", user.uid);
        console.log(user.uid);
        router.push("/home");
      } catch (error) {
        Swal.fire("Error", "Email is already used or invalid", "error");
        console.error("Error signing up:", error);
      }
    } else {
      Swal.fire("Error", "Passwords do not match", "error");
    }
  };

  return (
    <>
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
            <h2 className="text-4xl font-bold text-blue-900 leading-9 tracking-tight text-center font-[Poppins] text-[40px] mb-2">
              Sign Up
            </h2>
            <h5 className="text-center text-blue-800 font-semibold text-[10px] leading-[15px] font-[Poppins] mb-8">
              Create your account in seconds
            </h5>

            <div className="space-y-6">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => validateName(name)}
                  className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-blue-400 peer sm:text-sm sm:leading-6 font-[Poppins]"
                  style={{ backgroundColor: "white" }}
                  placeholder="Name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 top-2 text-blue-600 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-400 peer-focus:text-blue-600 font-[Poppins]"
                >
                  Name
                </label>
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
              </div>

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail(email)}
                  className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-blue-400 peer sm:text-sm sm:leading-6 font-[Poppins]"
                  style={{ backgroundColor: "white" }}
                  placeholder="Email Address"
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 top-2 text-blue-600 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-400 peer-focus:text-blue-600 font-[Poppins]"
                >
                  Email Address
                </label>
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div className="relative mt-10">
                <input
                  type="text"
                  required
                  onChange={(e) => setNic(e.target.value)}
                  onBlur={() => validateNIC(nic)}
                  className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-blue-400 peer"
                  placeholder="NIC Number"
                />
                <label className="absolute left-3 top-2 text-blue-600 text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm">
                  NIC Number
                </label>
                {nicError && (
                  <p className="text-red-500 text-xs mt-1">{nicError}</p>
                )}
              </div>

              <div className="mt-10">
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-blue-400 peer sm:text-sm sm:leading-6 font-[Poppins]"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 top-2 text-blue-600 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-400 peer-focus:text-blue-600 font-[Poppins]"
                  >
                    Password
                  </label>
                </div>
              </div>

              <div className="mt-10">
                <div className="relative mt-2">
                  <input
                    id="cpassword"
                    name="cpassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={(e) => checkPassword(e.target.value)}
                    className="block w-full px-3 pt-5 pb-2 rounded-md border-0 text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-blue-400 peer sm:text-sm sm:leading-6 font-[Poppins]"
                    placeholder="Confirm Password"
                  />
                  <label
                    htmlFor="cpassword"
                    className="absolute left-3 top-2 text-blue-600 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-400 peer-focus:text-blue-600 font-[Poppins]"
                  >
                    Confirm Password
                  </label>
                </div>
                <div
                  id="form-text"
                  hidden={type}
                  className="text-red-500 font-[Poppins]"
                >
                  Passwords do not match.
                </div>
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 font-[Poppins] transition-colors duration-300"
                  onClick={handleSignup}
                >
                  Create an account
                </button>
              </div>

              <p className="mt-10 text-sm font-semibold text-blue-600 font-[Poppins]">
                Already a member?
                <a
                  href="/login"
                  className="font-semibold leading-6 text-blue-600 hover:text-blue-700 ml-1"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
