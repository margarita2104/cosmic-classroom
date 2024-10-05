import earthImage from "./assets/images/earth.png";
import rocketImage from "./assets/images/rocket.png";

export default function Home() {
  // This part is used for the TypeScript functions
  // If you're not familiar with TS, you can add a JavaScript file instead

  return (
    <>
      <main className="flex flex-col items-center justify-center text-xl mt-24 w-2/3 text-center">
        <p className="mb-4">
          <strong>CosmicClassroom </strong>
          helps you bring the wonders of space into your classroom with tailored
          lesson plans, interactive activities, and
          <strong> NASA-backed resources</strong> .
        </p>
        <p className="mb-6">
          Designed to inspire curiosity about exoplanets, our platform makes
          learning accessible, creative, and fun, even with limited technology.
        </p>
        <h3 className="mb-4">
          <strong>Let&#39;s explore the universe together!</strong>
        </h3>
        <button className="btn-yellow text-2xl">Start</button>
        <div>
          <div>
            {/* <img src={earthImage} alt="Earth" className="w-1/2" /> */}
          </div>
          <div>
            {/* <img src={rocketImage} alt="Rocket" className="w-1/2" /> */}
          </div>
        </div>
      </main>
    </>
  );
}
