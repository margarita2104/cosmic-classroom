"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const LoadingPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
     
      router.push("cosmic-classroom/frontend/app/lesson-planner");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl mb-4">Please wait, creating a lesson plan...</h1>
      <div className="flex items-center">
        <img src={"cosmic-classroom/frontend/app/assets/images/path5610.png"} alt="Astronaut" className="h-20 mr-4" />
        <img src="/" alt="Rocket" className="h-20 mr-4" />
        <img src="/" alt="Planet" className="h-20" />
      </div>
    </div>
  );
};

export default LoadingPage;