"use client";

import { useEffect, useState } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";
import { AxiosError } from "axios";
import articleImage from "../assets/images/articlecover.jpg";
import starComet from "@/app/assets/images/lesson-planner/star-comet.png";

interface Article {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string | null;
}

const Resources = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log("Fetching articles...");
      const articlesResponse = await AxiosCosmicClassroom.get("/articles/", {
        headers,
      });
      console.log("Articles API response:", articlesResponse);

      let articlesData;
      if (Array.isArray(articlesResponse.data)) {
        articlesData = articlesResponse.data;
      } else if (articlesResponse.data.results) {
        articlesData = articlesResponse.data.results;
      } else if (articlesResponse.data.data) {
        articlesData = articlesResponse.data.data;
      } else {
        articlesData = [];
      }

      console.log("Processed articles data:", articlesData);
      setArticles(articlesData);
    } catch (error) {
      console.error("Error fetching articles:", error);
      if (error instanceof AxiosError) {
        console.error("API error response:", error.response?.data);
        console.error("API error status:", error.response?.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    console.log("Current articles state:", articles);
  }, [articles]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    articleName: string
  ) => {
    console.log(`Image failed to load for article: ${articleName}`);
    e.currentTarget.src = articleImage.src;
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-8 px-8 pb-8 sm:container text-white md:w-3/4 self-center">
      <h3 className="font-bold drop-shadow-lg text-2xl text-center self-center mt-6 nasa-font">
        Space Resources
      </h3>

      <div className="text-center max-w-3xl mx-auto">
        <p className="opacity-80">
          Explore educational resources about astronomy, exoplanets, and space
          science. Find articles, research materials, and learning tools for
          your classroom.
        </p>
      </div>

      {/* Resources display */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="box-color-lesson rounded-2xl text-black p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 opacity-60"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h5 className="text-xl font-semibold mb-2">No Resources Available</h5>
          <p className="max-w-md mx-auto opacity-70">
            Check back later to discover educational resources shared by the
            Cosmic Classroom community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="box-color-lesson rounded-2xl overflow-hidden flex flex-col h-full transform hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    article.image
                      ? article.image.startsWith("http")
                        ? article.image
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${
                            article.image
                          }`
                      : articleImage.src
                  }
                  alt={article.name}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, article.name)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h2 className="absolute bottom-3 left-4 right-4 text-white font-bold text-xl drop-shadow-lg">
                  {article.name}
                </h2>
              </div>
              <div className="p-5 flex flex-col flex-grow text-black">
                <p className="text-sm opacity-80 mb-4 line-clamp-3 flex-grow">
                  {article.description}
                </p>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 mt-2 text-black font-bold"
                >
                  <span>Explore Resource</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load more button */}
      {articles.length > 0 && articles.length % 9 === 0 && (
        <div className="flex justify-center mt-4">
          <button className="text-[#f3b643] hover:text-[#e4a832] flex items-center gap-2 py-2 px-4 rounded-lg transition-colors">
            <span>Load More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}

      <div
        className="absolute -translate-y-4 -translate-x-8 right-0 bottom-0 w-[250px] h-[250px] -z-10"
        style={{
          backgroundImage: `url(${starComet?.src || ""})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        role="img"
        aria-label="Star comet"
      />
    </main>
  );
};

export default Resources;
