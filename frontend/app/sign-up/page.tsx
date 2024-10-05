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
      const response = await AxiosCosmicClassroom.post("/registration/", {
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
        className="flex flex-col justify-center items-center"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-white">
            Email
          </label>
          <input
            id="email"
            className="placeholder w-96 py-3 px-4 mb-6 bg-white rounded-3xl text-black outline-none border-2 border-transparent hover:border-royal-blue"
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
            <div className="text-red-600 mt-5 text-center">{error}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
