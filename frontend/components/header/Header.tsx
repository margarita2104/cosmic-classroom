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
          <Link href="/">Lesson planner</Link>
          <Link href="/">Resources</Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/">Log in</Link>
          <Link
            className="text-black py-2 px-3 bg-casablanca rounded-full"
            href="/"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
