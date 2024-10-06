"use client"

import { useState } from "react"

import Logo from "../svg.image/Logo";
import Link from "next/link";

import { X, Menu } from "lucide-react"

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false)

  return (
    <header className="flex items-center justify-between text-white bg-blue-whale py-3 px-3 ">
      <div className="flex items-center gap-4 max-sm:justify-center max-sm:w-full">
        <h1 className="text-lg sm:text-3xl"><Link href={"/"}>CosmicClassroom</Link></h1>
        <Menu onClick={() => setToggleMenu(true)} className="cursor-pointer sm:hidden" />
      </div>
      
      <nav className="flex items-center">
        <div className="flex items-center gap-6 border-r-[1px] mr-4 pr-4 max-md:hidden">
          <Link href="/lesson-planner" className="hover:border-b-[1px] duration-200 transition-all">Lesson planner</Link>
          <Link href="/resources" className="hover:border-b-[1px] duration-200 transition-all">Resources</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:border-b-[1px] duration-200 transition-all max-sm:hidden">Log in</Link>
          <Link
            className="text-black py-2 px-3 bg-casablanca rounded-full hover:bg-golden-bell max-sm:hidden"
            href="/sign-up"
          >
            Sign up
          </Link>
          <Menu onClick={() => setToggleMenu(true)} className="cursor-pointer max-sm:hidden md:hidden" />
        </div>
      </nav>

      {toggleMenu && (
        <section className="absolute bg-white/40 backdrop-blur-sm top-0 left-0 w-full h-full z-10">
          <div className="flex flex-col gap-8 absolute right-0 top-0 sm:w-2/3 h-full bg-gray-800/80 backdrop-blur-sm p-2">
            <X className="self-end cursor-pointer" onClick={() => setToggleMenu(false)} />

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
