"use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

export default function LoadingPage() {
  // const dispatch = useDispatch(); => had to comment out because it had conflicts with Vercel
  // const router = useRouter();

  /*
    useEffect(() => {
    const timer = setTimeout(() => {
     
      router.push("cosmic-classroom/frontend/app/lesson-planner");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);
  */

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-2xl mt-12">Please wait, creating a lesson plan...</h1>

      <div className="flex items-center">
        <img src="/" alt="Astronaut" className="h-20 mr-4" />
        <img src="/" alt="Rocket" className="h-20 mr-4" />
        <img src="/" alt="Planet" className="h-20" />
      </div>
    </div>
  );
};
