"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import LoginSubmitHandler from "../components/login/LoginSubmitHandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    await LoginSubmitHandler(email, password, setError, dispatch, router);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1 className="mb-12 text-2xl font-nasalization">Log in</h1>
      <form
        className="flex flex-col justify-center items-center gap-8"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-white">
            Email
          </label>
          <input
            id="email"
            className="sm:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 text-white">
            Password
          </label>
          <input
            id="password"
            className="sm:w-96 py-3 px-4 bg-white/70 rounded-3xl text-black placeholder:text-gray-600 outline-none border-2 border-transparent hover:border-blue-900"
            type="password"
            required
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn-yellow w-fit" type="submit">
          Log in
        </button>
        {error && <div className="text-red-600 mt-5 text-center">{error}</div>}

        <p className="max-sm:text-center">Don&apos;t have an account? <span className="font-bold cursor-pointer hover:border-b-[1px]" onClick={() => router.push("/sign-up")}>Sign up</span></p>
      </form>
    </div>
  );
};

export default Login;


