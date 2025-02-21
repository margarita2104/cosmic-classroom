"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";
import { AxiosError } from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await AxiosCosmicClassroom.post("/auth/registration/", {
        email: email,
      });
      
      if (response.status === 200 || response.status === 201) {
        router.push("/profile-creation");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (axiosError.response?.status === 400) {
        setError("Invalid email address.");
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col items-center min-h-[80px]">
          <button 
            className={`btn-yellow w-fit ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <div className="h-6 mt-2"> {/* Fixed height error container */}
            {error && <div className="text-red-600 text-center">{error}</div>}
          </div>
        </div>
        <p className="max-sm:text-center">
          Already have an account?{" "}
          <span 
            className="font-bold cursor-pointer hover:border-b-[1px]" 
            onClick={() => router.push("/login")}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;