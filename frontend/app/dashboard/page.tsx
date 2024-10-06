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
  avatar: string | null;
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

const countryOptions: CountryOption[] = countryList().getData(); // Fetch country options here

export default function Dashboard() {
  const [editProfileInfo, setEditProfileInfo] = useState(false);
  const [addResourceMode, setAddResourceMode] = useState(false);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
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
        const { first_name, last_name, email, country, avatar } = response.data;

        setUserInfo({
          firstName: first_name,
          lastName: last_name,
          email: email,
          location: country || "Unknown",
          avatar: avatar || null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAvatarFile(files[0]);
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
        const response = await AxiosCosmicClassroom.post(
          "/articles/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

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
        console.error(
          "Error adding article:",
          error.response?.data || error.message
        );
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
        const formData = new FormData();
        if (avatarFile) {
          formData.append("avatar", avatarFile);
        }

        formData.append("email", userInfo.email);
        formData.append("first_name", userInfo.firstName);
        formData.append("last_name", userInfo.lastName);
        formData.append("country", userInfo.location || "");

        let response;
        response = await AxiosCosmicClassroom.patch("/user/me/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("User info updated:", response.data);
        await fetchUserInfo();
        setAvatarFile(null);
        setEditProfileInfo(false);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Error updating user info:",
          error.response?.data || error.message
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <main className="flex flex-col gap-4 container py-4">
      <section className="flex max-sm:flex-col max-sm:text-center items-center gap-2">
        <div className="flex rounded-full w-24 h-24 overflow-hidden">
          <img
            src={userInfo.avatar || userTest.src}
            alt="User avatar"
            className="cover"
          />
        </div>

        <div>
          <p className="font-semibold">{`${userInfo.firstName} ${userInfo.lastName}`}</p>
          <p>{userInfo.location}</p>
          <p>{userInfo.email}</p>
        </div>
      </section>

      <div className="flex gap-4 max-sm:flex-col">
        <section
          className={`flex flex-col gap-2 box-color-dashboard text-black p-2 rounded-2xl ${
            editProfileInfo || addResourceMode ? "w-1/4" : "w-full"
          } max-sm:w-full`}
        >
          <nav
            className={`flex ${
              editProfileInfo || addResourceMode
                ? "flex-col gap-2 self-start w-full"
                : "justify-between self-center"
            } max-sm:flex-col max-sm:self-start max-sm:w-full`}
          >
            <div
              className={`flex items-center gap-2 cursor-pointer ${
                editProfileInfo
                  ? "bg-[#f3b643]"
                  : "hover:bg-[#f3b643] duration-200 transition-all"
              } py-3 px-6 rounded-[20px]`}
              onClick={() => setEditProfileInfo(true)}
            >
              <span className="flex items-center justify-center w-12">
                <img
                  src={editProfile.src}
                  alt="Edit profile"
                  className="cover"
                />
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
              className={`flex items-center gap-2 cursor-pointer ${
                addResourceMode
                  ? "bg-[#f3b643]"
                  : "hover:bg-[#f3b643] duration-200 transition-all"
              } py-3 px-6 rounded-[20px]`}
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
                <span className="w-24">
                  <strong>First name</strong>
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Last name</strong>
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Email</strong>
                </span>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Location</strong>
                </span>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (country) => country.value === userInfo.location
                  )}
                  onChange={handleCountryChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <strong>Avatar</strong>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="file:bg-blue-500 file:text-white"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-[#f3b643] w-full rounded-2xl p-3 text-white"
            >
              Save changes
            </button>
          </section>
        )}

        {addResourceMode && (
          <section className="flex flex-col gap-4 box-color-dashboard text-black p-6 pt-4 rounded-2xl w-full">
            <h3 className="font-bold">Add resource</h3>
            <div className="flex flex-col gap-6 pr-24">
              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Name</strong>
                </span>
                <input
                  type="text"
                  name="name"
                  value={article.name}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Description</strong>
                </span>
                <textarea
                  name="description"
                  value={article.description}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-800 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Link</strong>
                </span>
                <input
                  type="text"
                  name="link"
                  value={article.link}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-gray-400 focus:border-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <span className="w-24">
                  <strong>Image</strong>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:bg-blue-500 file:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleAddResource}
              className="bg-[#f3b643] w-full rounded-2xl p-3 text-white"
            >
              Add resource
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
