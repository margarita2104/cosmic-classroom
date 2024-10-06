"use client"

import { useState } from "react"

import userTest from "../assets/images/dashboard/astronaut.png"
import editProfile from "../assets/images/dashboard/edit-profile.png"
import planLesson from "../assets/images/dashboard/plan-lesson.png"
import addResource from "../assets/images/dashboard/add-resource.png"

export default function Dashboard() {
    const [editProfileInfo, setEditProfileInfo] = useState(false)
  
    return (
      <main className="flex flex-col gap-4 container py-4">
        {/* User informations */}
        <section className="flex max-sm:flex-col max-sm:text-center items-center gap-2">
          <div className="flex rounded-full w-24 h-24 overflow-hidden">
            <img src={userTest.src} alt="User test image" className="cover" />
          </div>

          <div>
            <p className="font-semibold">Buzz Aldrin</p>
            <p>Moon, The Moon</p>
            <p>buzz.aldrin@astronaut.moon</p>
          </div>
        </section>

        <div className="flex gap-4 max-sm:flex-col">
          {/* Navigation part in the Dashboard */}
          <section className={`flex flex-col gap-2 box-color-dashboard text-black p-2 rounded-2xl ${editProfileInfo === true ? "w-1/4" : "w-full"} max-sm:w-full`}>   
            <nav className={`flex ${editProfileInfo === true ? "flex-col gap-2 self-start w-full" : "justify-between self-center"} max-sm:flex-col max-sm:self-start max-sm:w-full`}>
              <div 
                className={`flex items-center gap-2 cursor-pointer ${editProfileInfo === true ? "bg-[#f3b643]" : "hover:bg-[#f3b643] duration-200 transition-all"} py-3 px-6 rounded-[20px]`}
                onClick={() => setEditProfileInfo(true)}
              >
                <span className="flex items-center justify-center w-12">
                  <img src={editProfile.src} alt="edit profile logo" className="w-8" />
                </span>
                Edit profile
              </div>

              <div className="flex items-center gap-2 cursor-pointer hover:bg-[#f3b643] duration-200 transition-all py-3 px-6 rounded-[20px]">
                <span className="w-12">
                  <img src={planLesson.src} alt="plan a lesson logo"/>
                </span>            
                Plan a lesson
              </div>

              <div className="flex items-center gap-2 cursor-pointer hover:bg-[#f3b643] duration-200 transition-all py-3 px-6 rounded-[20px]">
                <span className="w-12">
                  <img src={addResource.src} alt="add a resource logo"/>
                </span>               
                Add a resource
              </div>
            </nav>
          </section>

        {editProfileInfo && (
          <section className="flex flex-col gap-4 box-color-dashboard text-black p-6 pt-4 rounded-2xl w-full">
            <h3 className="font-bold">Edit profile</h3>

            <div className="flex flex-wrap gap-6 pr-24">
              <div className="flex gap-2">
                <span className="w-24"><strong>First name</strong></span> 
                <input type="text" className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500" placeholder="Buzz" />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Last name</strong></span>
                <input type="text" className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500" placeholder="Aldrin" />
              </div>
              
              <div className="flex gap-2">
                <span className="w-24"><strong>Email</strong></span>
                <input type="text" className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500" placeholder="buzz.aldrin@astronaut.moon" />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Location</strong></span>
                <input type="text" className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500" placeholder="The Moon" />
              </div>
            </div>

            <div className="flex gap-2 self-end">
              <button className="bg-white rounded-2xl py-2 px-4 hover:bg-red-700 hover:scale-105 duration-200 transition-all" onClick={() => setEditProfileInfo(false)}>Cancel</button>
              <button className="bg-white rounded-2xl py-2 px-4 hover:bg-green-700 hover:scale-105 duration-200 transition-all">Save</button>
            </div>
          </section>
        )}
        </div>
        
      
        {/* My lessons and favourite resources section */}
        <section className="flex gap-4 max-sm:flex-col">
          {/* My lessons part */}
          <article className="flex flex-col gap-2 box-color-dashboard text-black p-6 pt-4 rounded-2xl w-full">
            <h3 className="font-bold">My lessons</h3> 

            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li>Exploring the habitability of exoplanets</li>
              <li>Exploring the habitability of exoplanets</li>
              <li>Exploring the habitability of exoplanets</li>
              <li>Exploring the habitability of exoplanets</li>
              <li>Exploring the habitability of exoplanets</li>
            </ul>

            <strong>Show more</strong>
          </article>
          
          {/* Favourite resources part */}
          <article className="flex flex-col gap-2 box-color-dashboard text-black p-6 pt-4 rounded-2xl w-full">
            <h3 className="font-bold">Favourite resources</h3> 

            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li>What is an exoplanet</li>
              <li>What is an exoplanet</li>
              <li>What is an exoplanet</li>
              <li>What is an exoplanet</li>
              <li>What is an exoplanet</li>
            </ul>

            <strong>Show more</strong>
          </article>
        </section>
      </main>
    );
  }
  