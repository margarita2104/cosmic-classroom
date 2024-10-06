import { ChevronDown } from "lucide-react"

import starComet from "@/app/assets/images/lesson-planner/star-comet.png"
import spaceshipSmall from "@/app/assets/images/lesson-planner/spaceship-small.png"
import planetHoop from "@/app/assets/images/lesson-planner/planet-hoop.png"

const LessonPlanner = () => {
  return (
    <main className="flex flex-col gap-16 p-8 container">
      <h3 className="font-bold drop-shadow-lg text-xl text-center self-center mt-12 z-1">Tell us more about your lesson</h3>

      <img src={starComet.src} alt="Star Comet image" className="w-[200px] absolute right-0 -translate-y-8 -z-10" />

      <section className="grid md:grid-cols-2 lg:gap-36 md:gap-12 gap-8 text-black">
        {/* Age group */}
        <article className="box-color-lesson rounded-2xl">
          <div className="flex justify-between bg-[#f3b643] rounded-full p-4 -translate-y-2">
            <legend className="font-bold">Age group</legend>
            <ChevronDown />
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="elementaryschool">Elementary School</label>
            <input type="checkbox" id="elementaryschool" name="age-group" className="w-6 h-6 cursor-pointer" />  
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="middleschool">Middle School</label>
            <input type="checkbox" id="middleschool" name="age-group" className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4">
            <label htmlFor="highschool">High School</label>
            <input type="checkbox" id="highschool" name="age-group" className="w-6 h-6 cursor-pointer" />
          </div>            
        </article>

        {/* Number of students */}
        <article className="box-color-lesson rounded-2xl">
          <div className="flex justify-between bg-[#f3b643] rounded-full p-4 -translate-y-2">
            <legend className="font-bold">Number of students</legend>
            <ChevronDown />
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="5-10">5-10 students</label>
            <input type="checkbox" id="5-10" name="number-students" className="w-6 h-6 cursor-pointer" />  
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="10-20">10-20 students</label>
            <input type="checkbox" id="10-20" name="number-students" className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4">
            <label htmlFor="20-50">20-50 students</label>
            <input type="checkbox" id="20-50" name="number-students" className="w-6 h-6 cursor-pointer" />
          </div>            
        </article>

        {/* Topics of interest */}
        <article className="box-color-lesson rounded-2xl">
          <div className="flex justify-between bg-[#f3b643] rounded-full p-4 -translate-y-2">
            <legend className="font-bold">Topics of interest</legend>
            <ChevronDown />
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="types-exoplanets">Types of expoplanets</label>
            <input type="checkbox" id="types-exoplanets" name="topics-interest" className="w-6 h-6 cursor-pointer" />  
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="methods-discovery">Methods of discovery</label>
            <input type="checkbox" id="methods-discovery" name="topics-interest" className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4">
            <label htmlFor="habitability">Habitability</label>
            <input type="checkbox" id="habitability" name="topics-interest" className="w-6 h-6 cursor-pointer" />
          </div>            
        </article>

        {/* Preferred learning styles */}
        <article className="box-color-lesson rounded-2xl">
          <div className="flex justify-between bg-[#f3b643] rounded-full p-4 -translate-y-2">
            <legend className="font-bold">Preferred learning styles</legend>
            <ChevronDown />
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="visual">Visual</label>
            <input type="checkbox" id="visual" name="pref-learning" className="w-6 h-6 cursor-pointer" />  
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="auditory">Auditory</label>
            <input type="checkbox" id="auditory" name="pref-learning" className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4">
            <label htmlFor="kinesthetic">Kinesthetic</label>
            <input type="checkbox" id="kinesthetic" name="pref-learning" className="w-6 h-6 cursor-pointer" />
          </div>            
        </article>

        {/* Lesson length */}
        <article className="box-color-lesson rounded-2xl">
          <div className="flex justify-between bg-[#f3b643] rounded-full p-4 -translate-y-2">
            <legend className="font-bold">Lesson length</legend>
            <ChevronDown />
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="30-min">30 minutes</label>
            <input type="checkbox" id="30-min" name="lesson-length" className="w-6 h-6 cursor-pointer" />  
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <label htmlFor="45-min">45 minutes</label>
            <input type="checkbox" id="45-min" name="lesson-length" className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4">
            <label htmlFor="90-min">90 minutes</label>
            <input type="checkbox" id="90-min" name="lesson-length" className="w-6 h-6 cursor-pointer" />
          </div>            
        </article>

        {/* Access level */}
        <article className="box-color-lesson rounded-2xl">
          <div className="flex justify-between bg-[#f3b643] rounded-full p-4 -translate-y-2">
            <legend className="font-bold">Access level</legend>
            <ChevronDown />
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <div>
              <label htmlFor="no-tech">No technology available</label>
              <p className="text-[8px] absolute -translate-y-[6px]">(offline)</p>
            </div>
            <input type="checkbox" id="no-tech" name="access-level" className="w-6 h-6 cursor-pointer" />  
          </div>

          <div className="flex items-center justify-between p-4 border-b-2 border-[#f3b643]">
            <div>
              <label htmlFor="limited-access">Limited access</label>
              <p className="text-[8px] absolute -translate-y-[6px]">(e.g. shared devices, internet in school only)</p>
            </div>
            <input type="checkbox" id="limited-access" name="access-level" className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <label htmlFor="full-access">Full access</label>
              <p className="text-[8px] absolute -translate-y-[6px]">(individual devices and internet)</p>
            </div>          
            <input type="checkbox" id="full-access" name="access-level" className="w-6 h-6 cursor-pointer" />
          </div>            
        </article>
      </section>

      <button className="flex justify-center self-center btn-yellow w-56 mb-36">Create lesson plan</button>

      <img src={spaceshipSmall.src} alt="spaceship small image" className="absolute translate-y-[400px] bottom-0 w-36 -z-10" />
      <img src={planetHoop.src} alt="planet hoop image" className="absolute translate-y-[470px] -translate-x-12 right-0 bottom-0 w-[300px] -z-10" />
    </main>
  );
};

export default LessonPlanner;