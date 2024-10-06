"use client";

//import { useRouter } from "next/navigation";
//import { useEffect } from "react";
// import { useDispatch } from "react-redux";

import loadingImage from "@/app/assets/images/loading-page/loading-page.png"

export default function LoadingPage() {
  // const dispatch = useDispatch(); => had to comment out because it had conflicts with Vercel
    //const router = useRouter();

    /*useEffect(() => {
    const timer = setTimeout(() => {
     
      router.push("/lesson-planner");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);*/

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-2xl mt-12 text-center">Please wait, creating a lesson plan...</h1>

      <div className="flex items-center justify-center mt-8">
        <div className="planet-container">
          <div className="planet"></div>
          <div className="ring"></div>
        </div>
      </div>

      <div className="flex items-center">
        <img src={loadingImage.src} alt="loading page image" />
      </div>
    </div>
  );
};
