"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { login_user, logout_user } from "@/app/store/slices/UserSlice";
import { AxiosCosmicClassroom } from "@/app/axios/Axios";
import { useAppSelector } from "@/app/store/store";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");

  const accessToken = useAppSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout_user());
    localStorage.removeItem("userFirstName");
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(login_user(token));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (accessToken) {
        try {
          const response = await AxiosCosmicClassroom.get("/user/me/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(response.data); 
          setUserFirstName(response.data.username || "");
          localStorage.setItem("userFirstName", response.data.username || "");
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      } else {
        const storedFirstName = localStorage.getItem("userFirstName");
        setUserFirstName(storedFirstName || "");
      }
    };
    fetchUserDetails();
  }, [accessToken]);

  return (
    <header className="flex items-center justify-between text-white bg-blue-whale py-3 px-3 ">
      <div className="flex items-center gap-4 max-sm:justify-center max-sm:w-full">
        <h1 className="text-lg sm:text-3xl">
          <Link href={"/"}>CosmicClassroom</Link>
        </h1>
        <Menu
          onClick={() => setToggleMenu(true)}
          className="cursor-pointer sm:hidden"
        />
      </div>

      <nav className="flex items-center">
        <div className="flex items-center gap-6 border-r-[1px] mr-4 pr-4 max-md:hidden">
          <Link href="/lesson-planner" className="hover:border-b-[1px]">
            Lesson planner
          </Link>
          <Link href="/resources" className="hover:border-b-[1px]">
            Resources
          </Link>
        </div>

        <div className="flex items-center gap-4 relative">
          {accessToken ? (
            <>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold"
                onClick={() => setProfileDropdown((prev) => !prev)}
              >
                {userFirstName ? userFirstName.charAt(0).toUpperCase() : "?"}
              </div>
              {profileDropdown && (
                <div className="absolute -right-[12px] top-[42px] bg-blue-whale text-white shadow-lg rounded-lg p-2 mt-1">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:underline"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:border-b-[1px] max-sm:hidden"
              >
                Log in
              </Link>
              <Link
                className="text-black py-2 px-3 bg-casablanca rounded-full hover:bg-golden-bell max-sm:hidden"
                href="/sign-up"
              >
                Sign up
              </Link>
            </>
          )}
          <Menu
            onClick={() => setToggleMenu(true)}
            className="cursor-pointer max-sm:hidden md:hidden"
          />
        </div>
      </nav>

      {toggleMenu && (
        <section className="absolute bg-white/40 backdrop-blur-sm top-0 left-0 w-full h-full z-10">
          <div className="flex flex-col gap-8 absolute right-0 top-0 sm:w-2/3 h-full bg-gray-800/80 backdrop-blur-sm p-2">
            <X
              className="self-end cursor-pointer"
              onClick={() => setToggleMenu(false)}
            />

            <h2 className="self-center">Menu</h2>

            <nav className="flex flex-col gap-4 px-12">
              <Link href={"/"}>Home</Link>
              <Link href="/lesson-planner">Lesson planner</Link>
              <Link href="/resources">Resources</Link>

              <div className="flex flex-col items-center gap-4 mt-24 sm:hidden">
                <Link href="/login">Log in</Link>
                <Link
                  className="text-black py-2 px-3 bg-casablanca rounded-full hover:bg-golden-bell"
                  href="/sign-up"
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </div>
        </section>
      )}
    </header>
  );
};

export default Header;
