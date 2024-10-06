"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import countryList from "react-select-country-list";
import userTest from "../assets/images/dashboard/astronaut.png";
import editProfile from "../assets/images/dashboard/edit-profile.png";
import planLesson from "../assets/images/dashboard/plan-lesson.png";
import addResource from "../assets/images/dashboard/add-resource.png";
import { AxiosCosmicClassroom } from "@/app/axios/Axios";
import Select from "react-select";
import { AxiosError } from "axios";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
}

interface Article {
  name: string;
  description: string;
  link: string;
  image: File | null;
}

interface CountryOption {
  label: string;
  value: string;
}

export default function Dashboard() {
  const [editProfileInfo, setEditProfileInfo] = useState(false);
  const [addResourceMode, setAddResourceMode] = useState(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
  });

  const [article, setArticle] = useState<Article>({
    name: "",
    description: "",
    link: "",
    image: null,
  });

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await AxiosCosmicClassroom.get("/user/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { first_name, last_name, email, country } = response.data;
        setUserInfo({
          firstName: first_name,
          lastName: last_name,
          email: email,
          location: country || "Unknown",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in article) {
      setArticle((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setUserInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setArticle((prevState) => ({
        ...prevState,
        image: files[0],
      }));
    }
  };

  const handleAddResource = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", article.name);
      formData.append("description", article.description);
      formData.append("link", article.link);
      if (article.image) {
        formData.append("image", article.image);
      }

      if (token) {
        const response = await AxiosCosmicClassroom.post("/articles/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Article added:", response.data);
        setArticle({
          name: "",
          description: "",
          link: "",
          image: null,
        });
        setAddResourceMode(false);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error("Error adding article:", error.response.data);
        } else {
          console.error("Axios error:", error.message);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    setUserInfo((prevState) => ({
      ...prevState,
      location: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const updatedUserInfo = {
          email: userInfo.email,
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          country: userInfo.location || "",
        };

        console.log("Updating user info with:", updatedUserInfo);
        const response = await AxiosCosmicClassroom.patch("/user/me/", updatedUserInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User info updated:", response.data);
        await fetchUserInfo();
        setEditProfileInfo(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to update user info:", error.message);
      } else if (isAxiosError(error)) {
        if (error.response) {
          console.error("Error updating user info:", error.response.data);
        } else {
          console.error("Axios error without response:", error.message);
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).response !== undefined;
  }

  const countryOptions = countryList().getData();

  return (
    <main className="flex flex-col gap-4 container py-4">
      <section className="flex max-sm:flex-col max-sm:text-center items-center gap-2">
        <div className="flex rounded-full w-24 h-24 overflow-hidden">
          <img src={userTest.src} alt="User test image" className="cover" />
        </div>

        <div>
          <p className="font-semibold">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
          <p>{userInfo.location}</p>
          <p>{userInfo.email}</p>
        </div>
      </section>

      <div className="flex gap-4 max-sm:flex-col">
        <section className={`flex flex-col gap-2 box-color-dashboard text-black p-2 rounded-2xl ${editProfileInfo || addResourceMode ? "w-1/4" : "w-full"} max-sm:w-full`}>
          <nav className={`flex ${editProfileInfo || addResourceMode ? "flex-col gap-2 self-start w-full" : "justify-between self-center"} max-sm:flex-col max-sm:self-start max-sm:w-full`}>
            <div
              className={`flex items-center gap-2 cursor-pointer ${editProfileInfo ? "bg-[#f3b643]" : "hover:bg-[#f3b643] duration-200 transition-all"} py-3 px-6 rounded-[20px]`}
              onClick={() => setEditProfileInfo(true)}
            >
              <span className="flex items-center justify-center w-12">
                <img src={editProfile.src} alt="edit profile logo" className="w-8" />
              </span>
              Edit profile
            </div>

            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-[#f3b643] duration-200 transition-all py-3 px-6 rounded-[20px]"
              onClick={() => router.push("/lesson-planner")}
            >
              <span className="w-12">
                <img src={planLesson.src} alt="plan a lesson logo" />
              </span>
              Plan a lesson
            </div>

            <div
              className={`flex items-center gap-2 cursor-pointer ${addResourceMode ? "bg-[#f3b643]" : "hover:bg-[#f3b643] duration-200 transition-all"} py-3 px-6 rounded-[20px]`}
              onClick={() => setAddResourceMode(true)}
            >
              <span className="w-12">
                <img src={addResource.src} alt="add a resource logo" />
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
                <input
                  type="text"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleInputChange}
                  className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500"
                  placeholder="Buzz"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Last name</strong></span>
                <input
                  type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleInputChange}
                  className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500"
                  placeholder="Lightyear"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Location</strong></span>
                <Select
                  name="location"
                  options={countryOptions}
                  value={{ label: userInfo.location, value: userInfo.location }}
                  onChange={handleCountryChange}
                />
              </div>
            </div>

            <div className="flex gap-2 self-end">
              <button
                className="bg-white rounded-2xl py-2 px-4 hover:bg-red-700 hover:scale-105 duration-200 transition-all"
                onClick={() => setEditProfileInfo(false)}
              >
                Cancel
              </button>
              <button
                className="bg-white rounded-2xl py-2 px-4 hover:bg-green-700 hover:scale-105 duration-200 transition-all"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </section>
        )}

        {addResourceMode && (
          <section className="flex flex-col gap-4 box-color-dashboard text-black p-6 pt-4 rounded-2xl w-full">
            <h3 className="font-bold">Add a Resource</h3>
            <div className="flex flex-wrap gap-6 pr-24">
              <div className="flex gap-2">
                <span className="w-24"><strong>Name</strong></span>
                <input
                  type="text"
                  name="name"
                  value={article.name}
                  onChange={handleInputChange}
                  className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500"
                  placeholder="Resource name"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Description</strong></span>
                <textarea
                  name="description"
                  value={article.description}
                  onChange={handleInputChange}
                  className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500"
                  placeholder="Brief description"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Link</strong></span>
                <input
                  type="text"
                  name="link"
                  value={article.link}
                  onChange={handleInputChange}
                  className="bg-transparent border-b-[1px] border-black px-4 placeholder:text-gray-500"
                  placeholder="https://resource-link.com"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24"><strong>Image</strong></span>
                <input type="file" name="image" onChange={handleFileChange} />
              </div>
            </div>

            <div className="flex gap-2 self-end">
              <button
                className="bg-white rounded-2xl py-2 px-4 hover:bg-red-700 hover:scale-105 duration-200 transition-all"
                onClick={() => setAddResourceMode(false)}
              >
                Cancel
              </button>
              <button
                className="bg-white rounded-2xl py-2 px-4 hover:bg-green-700 hover:scale-105 duration-200 transition-all"
                onClick={handleAddResource}
              >
                Add Resource
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
