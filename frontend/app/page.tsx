export default function Home() {
  // This part is used for the TypeScript functions
  // If you're not familiar with TS, you can add a JavaScript file instead

  return (
    <>
      <main>
        <div className="flex flex-col items-center justify-center bg-gray-800 text-white">
          {/* Navigation Bar */}
          <nav className="w-full bg-[#04204a] p-4 mb-5">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-5xl font-bold">CosmicClassroom</h1>
              <div className="text-2xl flex space-x-14 items-center my-auto">
                <a href="#" className="hover:text-yellow-500 my-auto">
                  Lesson planner
                </a>

                <a href="#" className="hover:text-yellow-500 my-auto">
                  Resources
                </a>

                <a href="#" className="hover:text-yellow-500 my-auto">
                  Log in
                </a>

                <a
                  href="#"
                  className="bg-yellow-500 text-gray-800 py-2 px-4 rounded hover:bg-yellow-400 transition duration-300 my-auto"
                >
                  Sign up
                </a>
              </div>
            </div>
          </nav>

          <main className="flex flex-col items-center mt-4">
            <h2 className="text-2xl text-center mb-4">
              CosmicClassroom helps you bring the wonders of space into your
              classroom with tailored lesson plans, interactive activities, and
              NASA-backed resources.
            </h2>
            <p className="text-2xl mb-6">
              Designed to inspire curiosity about exoplanets, our platform makes
              learning accessible, creative, and fun, even with limited
              technology.
            </p>
            <h3 className="text-xl mb-4">
              Let's explore the universe together!
            </h3>
            <button className="w-3/12 text-4xl bg-yellow-500 text-gray-800 py-2 px-4 rounded-full hover:bg-yellow-400 transition duration-300 font-bold">
              Start
            </button>
          </main>
        </div>
      </main>
    </>
  );
}
