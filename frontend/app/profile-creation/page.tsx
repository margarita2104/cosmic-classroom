"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AxiosCosmicClassroom } from "../axios/Axios";
import LoginSubmitHandler from "../components/login/LoginSubmitHandler"; 

export default function ProfileCreation() {
  const router = useRouter();
  const dispatch = useDispatch();

  const validationMessages = {
    passwordTooShort:
      "This password is too short. It must contain at least 8 characters.",
    passwordTooCommon: "This password is too common.",
    passwordNumeric: "This password is entirely numeric.",
  };

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const errorSetter = (error: string) => {
    setError(error);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    if (password.length < 8) {
      setError(validationMessages.passwordTooShort);
      console.log("Password too short");
      return;
    }
    if (/^(\d+)$/.test(password)) {
      setError(validationMessages.passwordNumeric);
      console.log("Password is numeric");
      return;
    }
    if (password === "password123" || password === "12345678") {
      setError(validationMessages.passwordTooCommon);
      console.log("Password is too common");
      return;
    }
    errorSetter(""); 

    if (password === passwordRepeat) {
      console.log("Passwords match, proceeding with submission");
      try {
        const response = await AxiosCosmicClassroom.post(
          "/auth/registration/validation/",
          {
            email,
            username,
            code,
            password,
            password_repeat: passwordRepeat,
            first_name: firstname,
            last_name: lastname,
          }
        );

        console.log("Response received:", response);

        if (response.status === 201) {
          setSuccess("Registration successful! Logging in...");

          await LoginSubmitHandler(email, password, errorSetter, dispatch, router);

          router.push("/login");
        }
      } catch (error: any) {
        console.error("Error during submission:", error);
        errorSetter(error.response?.data?.message || "An error occurred");
      }
    } else {
      alert("Please make sure your passwords match");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center mt-24">
      <h1 className="mb-3 text-2xl font-nasalization">Verification</h1>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form className="flex flex-col gap-8" onSubmit={submitHandler}>
        <div className="flex flex-col gap-1">
          <label htmlFor="code">Verification code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
            placeholder="Enter the code from the email"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="firstname">First name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="lastname">Last name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="passwordRepeat">Password repeat</label>
            <input
              type="password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              className="md:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
              placeholder="Repeat your password"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-yellow w-min self-center">
          Submit
        </button>
      </form>
    </main>
  );
}
