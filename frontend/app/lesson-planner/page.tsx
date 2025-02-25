"use client";

import { useState, ChangeEvent, useRef } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";
import { useAppSelector } from "@/app/store/store";
import { useRouter } from "next/navigation";
import { Printer, Download, Share2 } from "lucide-react";

import starComet from "@/app/assets/images/lesson-planner/star-comet.png";
import spaceshipSmall from "@/app/assets/images/lesson-planner/spaceship-small.png";
import planetHoop from "@/app/assets/images/lesson-planner/planet-hoop.png";

import ReactMarkdown from "react-markdown";

// Define TypeScript interfaces
interface FormData {
  subject: string;
  grade_level: string;
  class_size: string;
  technology_access: string;
  class_length: string;
  learning_styles: string;
  user_prompt: string;
}

const LessonPlanner = () => {
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    grade_level: "",
    class_size: "",
    technology_access: "",
    class_length: "",
    learning_styles: "",
    user_prompt: "",
  });

  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lessonContentRef = useRef<HTMLElement | null>(null);

  const router = useRouter();
  const accessToken = useAppSelector((state) => state.user.accessToken);

  const handleInputChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear any error message when the user makes changes
    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.subject) {
      setError("Please select a topic for the lesson");
      return false;
    }
    if (!formData.grade_level) {
      setError("Please select a grade level");
      return false;
    }
    return true;
  };

  const handleCreateLessonPlan = async () => {
    // Check authentication before proceeding
    if (!accessToken) {
      setError("You must be logged in to create a lesson plan");
      router.push("/sign-in");
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Sending form data:", formData);

      // Post the form data to the API
      const response = await AxiosCosmicClassroom.post("/lessons/", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Response received:", response);

      if (!response || !response.data) {
        throw new Error("Failed to create lesson plan: Invalid response");
      }

      const data = response.data;

      if (!data.created_lesson) {
        throw new Error("No lesson content received from server");
      }

      setLesson(data.created_lesson);

      // Scroll to the lesson content
      setTimeout(() => {
        const lessonElement = document.getElementById("lesson-content");
        if (lessonElement) {
          lessonElement.scrollIntoView({ behavior: "smooth" });
          lessonContentRef.current = lessonElement;
        }
      }, 100);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create lesson plan. Please try again.";

      console.error("Error creating lesson plan:", error);

      // Handle authentication errors specifically
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 401
      ) {
        console.log("Authentication error, redirecting to login");
        setError("Your session has expired. Please sign in again.");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle printing
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const topicLabel = formData.subject === 'exoplanets_types' 
        ? 'Exoplanet Types' 
        : formData.subject === 'exoplanets_discovery'
          ? 'Exoplanet Discovery'
          : 'Exoplanet Habitability';
          
      const gradeLabel = formData.grade_level === 'elementary_school'
        ? 'Elementary School'
        : formData.grade_level === 'middle_school'
          ? 'Middle School'
          : 'High School';
          
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
            Class Size: ${formData.class_size || 'Not specified'} students | 
            Duration: ${formData.class_length || 'Not specified'} minutes
          </div>
          <div>${lesson.replace(/\n/g, '<br>')}</div>
          <div class="footer">
            Generated by Cosmic Classroom | ${new Date().toLocaleDateString()}
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

  // Function to save as PDF
  const handleSaveAsPDF = () => {
    // Trigger the print dialog which allows saving as PDF
    handlePrint();
  };

  // Function to save as text file
  const handleSaveAsText = () => {
    const topicLabel = formData.subject === 'exoplanets_types' 
      ? 'Exoplanet Types' 
      : formData.subject === 'exoplanets_discovery'
        ? 'Exoplanet Discovery'
        : 'Exoplanet Habitability';
        
    const gradeLabel = formData.grade_level === 'elementary_school'
      ? 'Elementary School'
      : formData.grade_level === 'middle_school'
        ? 'Middle School'
        : 'High School';
    
    // Create header for the text file  
    const header = `LESSON PLAN: ${topicLabel}\n` +
      `Grade Level: ${gradeLabel}\n` +
      `Class Size: ${formData.class_size || 'Not specified'} students\n` +
      `Duration: ${formData.class_length || 'Not specified'} minutes\n` +
      `Date Generated: ${new Date().toLocaleDateString()}\n\n`;
      
    const content = header + lesson;
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson_plan_${formData.subject}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // If no token, show login message
  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <h2 className="text-xl mb-4">Please log in to create lesson plans</h2>
        <button
          onClick={() => router.push("/sign-in")}
          className="btn-yellow px-4 py-2"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-8 px-8 pb-8 sm:container text-white md:w-2/3 self-center">
      <h3 className="font-bold drop-shadow-lg text-xl text-center self-center mt-3 z-1 nasa-font">
        Lesson planner
      </h3>

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

      <section className="flex flex-col">
        <p>
          To help us create the perfect lesson plan tailored to your classroom,
          please provide the following details:
        </p>
      </section>

      <div className="box-color-lesson rounded-2xl text-black p-4">
        <h4 className="text-2xl text-center font-bold mb-4">
          Lesson Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Size */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Number of students</label>
            <select
              name="class_size"
              value={formData.class_size}
              onChange={handleInputChange}
              className="bg-white/80 p-2 rounded-lg"
            >
              <option value="">Select class size</option>
              <option value="10">5 - 10 students</option>
              <option value="20">10 - 20 students</option>
              <option value="50">20 - 50 students</option>
            </select>
          </div>

          {/* Grade Level */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">
              Age group / Grade level *
            </label>
            <select
              name="grade_level"
              value={formData.grade_level}
              onChange={handleInputChange}
              className="bg-white/80 p-2 rounded-lg"
              required
            >
              <option value="">Select grade level</option>
              <option value="elementary_school">Elementary School</option>
              <option value="middle_school">Middle School</option>
              <option value="high_school">High School</option>
            </select>
          </div>

          {/* Technology Access */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Technology access</label>
            <select
              name="technology_access"
              value={formData.technology_access}
              onChange={handleInputChange}
              className="bg-white/80 p-2 rounded-lg"
            >
              <option value="">Select technology access</option>
              <option value="full">Full access</option>
              <option value="limited">Limited access</option>
              <option value="unavailable">
                No technology available (offline)
              </option>
            </select>
          </div>

          {/* Topic */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Topic for the lesson *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="bg-white/80 p-2 rounded-lg"
              required
            >
              <option value="">Select topic</option>
              <option value="exoplanets_types">Exoplanet Types</option>
              <option value="exoplanets_discovery">Exoplanet Discovery</option>
              <option value="exoplanets_habitability">
                Exoplanet Habitability
              </option>
            </select>
          </div>

          {/* Learning Style */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Preferred learning style</label>
            <select
              name="learning_styles"
              value={formData.learning_styles}
              onChange={handleInputChange}
              className="bg-white/80 p-2 rounded-lg"
            >
              <option value="">Select learning style</option>
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="kinesthetic">Kinesthetic</option>
            </select>
          </div>

          {/* Class Length */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Desired lesson length</label>
            <select
              name="class_length"
              value={formData.class_length}
              onChange={handleInputChange}
              className="bg-white/80 p-2 rounded-lg"
            >
              <option value="">Select lesson length</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mt-4">
          <label className="font-medium mb-1 block">
            Additional notes (optional)
          </label>
          <textarea
            name="user_prompt"
            value={formData.user_prompt}
            onChange={handleInputChange}
            placeholder="Any additional information or specific requirements..."
            className="flex bg-white/80 outline-none rounded-lg h-24 w-full placeholder:text-black/60 p-3 resize-none"
          />
        </div>

        {/* Required fields note */}
        <div className="mt-2 text-sm">* Required fields</div>

        {/* Display error message if any */}
        {error && (
          <div className="mt-2 text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
      </div>

      <button
        onClick={handleCreateLessonPlan}
        className={`flex justify-center self-center btn-yellow w-56 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading || !formData.subject || !formData.grade_level}
      >
        {loading ? "Generating..." : "Create lesson plan"}
      </button>

      {/* Display loading state */}
      {loading && (
        <div className="text-center">
          <p>Creating your lesson plan...</p>
          <p className="text-sm mt-1">This may take a minute or two</p>
        </div>
      )}

      {/* Display lesson data in boxes */}
      {lesson && (
        <div className="w-full">
          {/* Action buttons */}
          <div className="flex justify-end gap-2 mb-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-sm"
              title="Print lesson plan"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
            <button
              onClick={handleSaveAsPDF}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-lg text-sm"
              title="Save as PDF"
            >
              <Download size={16} />
              <span>Save as PDF</span>
            </button>
            <button
              onClick={handleSaveAsText}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-lg text-sm"
              title="Save as text file"
            >
              <Share2 size={16} />
              <span>Save as Text</span>
            </button>
          </div>
          
          <section
            id="lesson-content"
            ref={lessonContentRef}
            className="flex flex-col gap-4 box-color-dashboard text-black p-6 pt-4 rounded-2xl w-full"
          >
            <ReactMarkdown>{lesson}</ReactMarkdown>
          </section>
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
};

export default LessonPlanner;
