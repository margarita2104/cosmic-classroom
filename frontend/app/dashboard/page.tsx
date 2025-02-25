"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import countryList from "react-select-country-list";
import userTest from "../assets/images/dashboard/astronaut.png";
import editProfile from "../assets/images/dashboard/edit-profile.png";
import planLesson from "../assets/images/dashboard/plan-lesson.png";
import addResource from "../assets/images/dashboard/add-resource.png";
import starComet from "@/app/assets/images/lesson-planner/star-comet.png";
import spaceshipSmall from "@/app/assets/images/lesson-planner/spaceship-small.png";
import planetHoop from "@/app/assets/images/lesson-planner/planet-hoop.png";
import { AxiosCosmicClassroom } from "@/app/axios/Axios";
import Select from "react-select";
import { AxiosError } from "axios";
import ReactMarkdown from "react-markdown";
import {
  Printer,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Search,
  SortDesc,
  SortAsc,
} from "lucide-react";

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

interface Lesson {
  id: number;
  subject: string;
  grade_level: string;
  class_size: number;
  technology_access: string;
  class_length: number;
  learning_styles: string;
  user_prompt: string;
  created_at: string;
  created_lesson: string;
}

interface CountryOption {
  label: string;
  value: string;
}

const countryOptions: CountryOption[] = countryList().getData();

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("lessons"); // Default view
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
  const [articleError, setArticleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [error, setError] = useState<string | null>(null);

  // Function to validate URL format
  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const clearSelectedImage = () => {
    setArticle((prevState) => ({
      ...prevState,
      image: null,
    }));

    // Reset file input
    const fileInput = document.getElementById("article-image-input");
    if (fileInput) {
      (fileInput as HTMLInputElement).value = "";
    }
  };

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

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await AxiosCosmicClassroom.get("/lessons/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLessons(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchLessons(); // Load lessons by default
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
      // Check file size (limit to 5MB)
      if (files[0].size > 5 * 1024 * 1024) {
        setArticleError("File size must be less than 5MB");
        e.target.value = ""; // Reset the input
        return;
      }

      setArticle((prevState) => ({
        ...prevState,
        image: files[0],
      }));
      setArticleError(null);
    }
  };

  const handleAddResource = async () => {
    // Reset errors
    setArticleError(null);

    // Basic validation
    if (!article.name) {
      setArticleError("Resource name is required");
      return;
    }

    if (article.link && !validateUrl(article.link)) {
      setArticleError(
        "Please enter a valid URL starting with http:// or https://"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", article.name);
      formData.append("description", article.description || "");
      formData.append("link", article.link || "");
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

        // Show success message
        setSuccessMessage("Resource added successfully!");

        // Reset form
        setArticle({
          name: "",
          description: "",
          link: "",
          image: null,
        });

        // Optionally navigate away after successful submission
        setTimeout(() => {
          setActiveTab("lessons");
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error adding article:",
          error.response?.data || error.message
        );

        // Extract error message from response
        const errorDetail =
          error.response?.data?.detail ||
          error.response?.data?.image?.[0] ||
          error.response?.data?.link?.[0] ||
          "Failed to add resource. Please try again.";

        setArticleError(errorDetail);
      } else {
        console.error("An unexpected error occurred:", error);
        setArticleError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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

        const response = await AxiosCosmicClassroom.patch(
          "/user/me/",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("User info updated:", response.data);
        await fetchUserInfo();
        setAvatarFile(null);
        setError(null);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(
          "Error updating user info:",
          error.response?.data || error.message
        );
        setError("Failed to update profile. Please try again.");
      } else {
        console.error("An unexpected error occurred:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await AxiosCosmicClassroom.delete(`/lessons/${lessonId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the lessons list after deletion
        setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
      }
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  };

  const toggleExpand = (lessonId: number) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(lessonId);
    }
  };

  // Function to handle printing
  const handlePrint = (lesson: Lesson) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const topicLabel =
        lesson.subject === "exoplanets_types"
          ? "Exoplanet Types"
          : lesson.subject === "exoplanets_discovery"
          ? "Exoplanet Discovery"
          : "Exoplanet Habitability";

      const gradeLabel =
        lesson.grade_level === "elementary_school"
          ? "Elementary School"
          : lesson.grade_level === "middle_school"
          ? "Middle School"
          : "High School";

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Lesson Plan - ${topicLabel}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 20px;
              color: #333;
            }
            h1 {
              color: #0066cc;
              text-align: center;
              margin-bottom: 5px;
            }
            h2 {
              color: #0066cc;
              margin-top: 20px;
              margin-bottom: 10px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .header-info {
              text-align: center;
              margin-bottom: 20px;
              font-style: italic;
              color: #666;
            }
            ul, ol {
              margin-bottom: 15px;
            }
            li {
              margin-bottom: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 0.8em;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Lesson Plan: ${topicLabel}</h1>
          <div class="header-info">
            Grade Level: ${gradeLabel} | 
            Class Size: ${lesson.class_size || "Not specified"} students | 
            Duration: ${lesson.class_length || "Not specified"} minutes
          </div>
          <div>${lesson.created_lesson.replace(/\n/g, "<br>")}</div>
          <div class="footer">
            Generated by Cosmic Classroom | ${new Date(
              lesson.created_at
            ).toLocaleDateString()}
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Print</button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Function to save as text file
  const handleSaveAsText = (lesson: Lesson) => {
    const topicLabel =
      lesson.subject === "exoplanets_types"
        ? "Exoplanet Types"
        : lesson.subject === "exoplanets_discovery"
        ? "Exoplanet Discovery"
        : "Exoplanet Habitability";

    const gradeLabel =
      lesson.grade_level === "elementary_school"
        ? "Elementary School"
        : lesson.grade_level === "middle_school"
        ? "Middle School"
        : "High School";

    // Create header for the text file
    const header =
      `LESSON PLAN: ${topicLabel}\n` +
      `Grade Level: ${gradeLabel}\n` +
      `Class Size: ${lesson.class_size || "Not specified"} students\n` +
      `Duration: ${lesson.class_length || "Not specified"} minutes\n` +
      `Date Generated: ${new Date(lesson.created_at).toLocaleDateString()}\n\n`;

    const content = header + lesson.created_lesson;

    // Create blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lesson_plan_${lesson.subject}_${new Date(lesson.created_at)
      .toISOString()
      .slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter and sort lessons
  const filteredLessons = lessons
    .filter((lesson) => {
      const topicLabel =
        lesson.subject === "exoplanets_types"
          ? "Exoplanet Types"
          : lesson.subject === "exoplanets_discovery"
          ? "Exoplanet Discovery"
          : "Exoplanet Habitability";

      const gradeLabel =
        lesson.grade_level === "elementary_school"
          ? "Elementary School"
          : lesson.grade_level === "middle_school"
          ? "Middle School"
          : "High School";

      return (
        searchTerm === "" ||
        topicLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gradeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.created_lesson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    });

  const FilePreview = ({
    file,
    onClear,
  }: {
    file: File;
    onClear: () => void;
  }) => {
    if (!file) return null;

    const url = URL.createObjectURL(file);

    return (
      <div className="mt-2 relative">
        <img
          src={url}
          alt="Preview"
          className="w-full max-h-40 object-contain rounded"
          onLoad={() => URL.revokeObjectURL(url)}
        />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
          title="Remove image"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  };

  return (
    <main className="flex flex-col gap-8 px-8 pb-8 sm:container text-white/80 md:w-2/3 self-center relative min-h-screen">
      <h3 className="font-bold drop-shadow-lg text-xl text-center self-center mt-3 z-1 nasa-font">
        Teacher Dashboard
      </h3>

      {/* Star comet decoration */}
      <div
        className="w-[200px] absolute right-0 -translate-y-8 -z-10"
        style={{
          backgroundImage: `url(${starComet?.src || ""})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "200px",
        }}
        role="img"
        aria-label="Star Comet image"
      />

      {/* Navigation Tabs */}
      <div className="flex max-sm:flex-col gap-4 justify-center">
        <button
          className={`flex items-center gap-2 cursor-pointer px-6 py-3 rounded-2xl transition-all ${
            activeTab === "lessons"
              ? "bg-[#f3b643] text-black font-bold"
              : "hover:bg-[#f3b643]/30"
          }`}
          onClick={() => setActiveTab("lessons")}
        >
          <img src={planLesson.src} alt="lessons icon" className="w-5 h-5" />
          My Lessons
        </button>
        <button
          className={`flex items-center gap-2 cursor-pointer px-6 py-3 rounded-2xl transition-all ${
            activeTab === "profile"
              ? "bg-[#f3b643] text-black font-bold"
              : "hover:bg-[#f3b643]/30"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <img
            src={editProfile.src}
            alt="edit profile icon"
            className="w-5 h-5"
          />
          Edit Profile
        </button>
        <button
          className={`flex items-center gap-2 cursor-pointer px-6 py-3 rounded-2xl transition-all ${
            activeTab === "resources"
              ? "bg-[#f3b643] text-black font-bold"
              : "hover:bg-[#f3b643]/30"
          }`}
          onClick={() => setActiveTab("resources")}
        >
          <img
            src={addResource.src}
            alt="add resource icon"
            className="w-5 h-5"
          />
          Add Resource
        </button>
      </div>

      {/* Lessons View */}
      {activeTab === "lessons" && (
        <div className="w-full">
          <div className="box-color-lesson rounded-2xl text-black p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">My Lesson Plans</h2>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1 text-sm bg-white/80 px-2 py-1 rounded-lg transition-all"
                    onClick={() =>
                      setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                    }
                    title={
                      sortOrder === "newest"
                        ? "Sort by oldest first"
                        : "Sort by newest first"
                    }
                  >
                    {sortOrder === "newest" ? (
                      <SortDesc size={16} />
                    ) : (
                      <SortAsc size={16} />
                    )}
                    <span>{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
                  </button>
                </div>
                <div className="flex items-center bg-white/80 rounded-lg px-2">
                  <Search size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search lessons..."
                    className="bg-transparent border-none outline-none py-1 px-2 text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-[#f3b643] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm ? (
                  <>
                    <p className="mb-2">
                      No lessons found matching your search.
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-blue-500 underline"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-4">
                      You haven&apos;t created any lessons yet.
                    </p>
                    <button
                      onClick={() => router.push("/lesson-planner")}
                      className="btn-yellow px-4 py-2"
                    >
                      Create Your First Lesson
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLessons.map((lesson) => {
                  const topicLabel =
                    lesson.subject === "exoplanets_types"
                      ? "Exoplanet Types"
                      : lesson.subject === "exoplanets_discovery"
                      ? "Exoplanet Discovery"
                      : "Exoplanet Habitability";

                  const gradeLabel =
                    lesson.grade_level === "elementary_school"
                      ? "Elementary School"
                      : lesson.grade_level === "middle_school"
                      ? "Middle School"
                      : "High School";

                  return (
                    <div
                      key={lesson.id}
                      className="border border-gray-300 rounded-xl overflow-hidden bg-white/80"
                    >
                      <div
                        className={`flex flex-col md:flex-row md:justify-between md:items-center cursor-pointer p-4 transition-colors gap-2 ${
                          expandedLesson === lesson.id
                            ? "bg-[#f3b643]/20"
                            : "hover:bg-[#f3b643]/10"
                        }`}
                        onClick={() => toggleExpand(lesson.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {topicLabel}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mt-1">
                            <span className="px-2 py-0.5 text-black font-semibold rounded-full">
                              {gradeLabel}
                            </span>
                            <span>
                              {new Date(lesson.created_at).toLocaleDateString()}
                            </span>
                            <span>{lesson.class_size} students</span>
                            <span>{lesson.class_length} min</span>
                            <span>
                              {lesson.learning_styles === "visual"
                                ? "Visual"
                                : lesson.learning_styles === "auditory"
                                ? "Auditory"
                                : lesson.learning_styles === "kinesthetic"
                                ? "Kinesthetic"
                                : "Not specified"}
                            </span>
                            <span>
                              {lesson.technology_access === "unavailable"
                                ? "No technology"
                                : lesson.technology_access === "limited"
                                ? "Limited technology"
                                : "Full technology"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLesson(lesson.id);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete lesson"
                          >
                            <Trash2 size={16} />
                          </button>
                          {expandedLesson === lesson.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </div>

                      {expandedLesson === lesson.id && (
                        <div className="p-4 border-t border-gray-200">
                          <div className="flex justify-end gap-2 mb-4">
                            <button
                              onClick={() => handlePrint(lesson)}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                              title="Print lesson plan"
                            >
                              <Printer size={16} />
                              <span>Print</span>
                            </button>
                            <button
                              onClick={() => handlePrint(lesson)}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                              title="Save as PDF"
                            >
                              <Download size={16} />
                              <span>Save as PDF</span>
                            </button>
                            <button
                              onClick={() => handleSaveAsText(lesson)}
                              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-lg text-sm transition-colors"
                              title="Save as text file"
                            >
                              <Share2 size={16} />
                              <span>Save as Text</span>
                            </button>
                          </div>

                          <div className="prose max-w-none text-black">
                            <ReactMarkdown>
                              {lesson.created_lesson}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Edit View */}
      {activeTab === "profile" && (
        <div className="box-color-lesson rounded-2xl text-black p-6">
          <h2 className="text-2xl text-center font-bold mb-6">Edit Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-medium mb-1 block">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-white/80 p-2 rounded-lg border-none outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium mb-1 block">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-white/80 p-2 rounded-lg border-none outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium mb-1 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/80 p-2 rounded-lg border-none outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium mb-1 block">Location</label>
                  <Select
                    options={countryOptions}
                    value={countryOptions.find(
                      (country) => country.value === userInfo.location
                    )}
                    onChange={handleCountryChange}
                    className="w-full"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#f3b643]">
                  <img
                    src={userInfo.avatar || userTest.src}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <label className="font-medium mb-1 block">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="bg-white/80 p-2 rounded-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 bg-red-100 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <button onClick={handleSave} className="btn-yellow px-6 py-2">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Add Resource View */}
      {activeTab === "resources" && (
        <div className="box-color-lesson rounded-2xl text-black p-6">
          <h2 className="text-2xl text-center font-bold mb-6">Add Resource</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {articleError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{articleError}</span>
              </div>
            )}

            {successMessage && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}

            <div>
              <label className="font-medium mb-1 block">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={article.name}
                onChange={handleInputChange}
                className="w-full bg-white/80 p-2 rounded-lg border-none outline-none"
                required
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Description</label>
              <textarea
                name="description"
                value={article.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-white/80 p-2 rounded-lg border-none outline-none resize-none"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">
                Link (must start with http:// or https://)
              </label>
              <input
                type="text"
                name="link"
                value={article.link}
                onChange={handleInputChange}
                className="w-full bg-white/80 p-2 rounded-lg border-none outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="font-medium mb-1 block">Image (max 5MB)</label>
              <input
                id="article-image-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-white/80 p-2 rounded-lg w-full"
              />

              {article.image && (
                <FilePreview
                  file={article.image}
                  onClear={clearSelectedImage}
                />
              )}
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleAddResource}
                className={`btn-yellow px-6 py-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⟳</span>
                    Adding...
                  </>
                ) : (
                  "Add Resource"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative spaceship image */}
      <div
        className="absolute -translate-y-8 translate-x-12 bottom-0 left-0 w-36 h-36 -z-10"
        style={{
          backgroundImage: `url(${spaceshipSmall?.src || ""})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        role="img"
        aria-label="spaceship small image"
      />

      {/* Decorative planet image */}
      <div
        className="absolute -translate-y-4 -translate-x-8 right-0 bottom-0 w-[300px] h-[300px] -z-10"
        style={{
          backgroundImage: `url(${planetHoop?.src || ""})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        role="img"
        aria-label="planet hoop image"
      />
    </main>
  );
}
