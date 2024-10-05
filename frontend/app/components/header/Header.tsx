import Logo from "../svg.image/Logo";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between text-white bg-blue-whale py-3 px-3 ">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="flex w-3/4 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/lesson-planner">Lesson planner</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login">Log in</Link>
          <Link
            className="text-black py-2 px-3 bg-casablanca rounded-full hover:bg-golden-bell"
            href="/sign-up"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
