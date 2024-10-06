"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";
import { AxiosResponse } from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState<AxiosResponse | null>(null);

  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await AxiosCosmicClassroom.post("/auth/registration/", {
        email: email,
      });
      setResponse(response);
    } catch (error) {
      console.error(error);
      setError("Email Failed");
    }
  };

  if (response) {
    router.push("/registration/validation");
  }
  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1 className="mb-12 text-2xl font-nasalization">Sign up</h1>
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

        <div>
          <button className="btn-yellow w-fit" type="submit">
            Register
          </button>
          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}
        </div>

        <p className="max-sm:text-center">Already have an account? <span className="font-bold cursor-pointer hover:border-b-[1px]" onClick={() => router.push("/login")}>Log in</span></p>
      </form>
    </div>
  );
};

export default SignUp;
