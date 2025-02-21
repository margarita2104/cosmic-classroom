"use client";

import { useEffect, useState } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";
import { AxiosError } from "axios";
import articleImage from "../assets/images/articlecover.jpg";

interface Article {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string | null;
}

interface ArticleFormData {
  name: string;
  description: string;
  link: string;
  image?: string | null;
}

const Resources = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    name: "",
    description: "",
    link: "",
    image: null,
  });
  const [formError, setFormError] = useState<Partial<ArticleFormData> | null>(
    null
  );
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const articlesResponse = await AxiosCosmicClassroom.get<Article[]>(
        "/articles/"
      );
      setArticles(articlesResponse.data);
      setError(null);
    } catch (error) {
      setError("Error fetching articles");
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<ArticleFormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.link.trim()) {
      errors.link = "Link is required";
    } else if (!isValidUrl(formData.link)) {
      errors.link = "Please enter a valid URL";
    }
    // Validate image URL if provided
    if (formData.image && formData.image.trim() !== "") {
      if (!isValidUrl(formData.image)) {
        errors.image = "Please enter a valid URL";
      } else if (!isValidImageUrl(formData.image)) {
        errors.image = "Please use an image file (JPG, PNG, GIF, WebP, or SVG)";
      }
    }

    setFormError(Object.keys(errors).length > 0 ? errors : null);
    return Object.keys(errors).length === 0;
  };

  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const validImageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      return validImageExtensions.some((ext) =>
        urlObj.pathname.toLowerCase().endsWith(ext)
      );
    } catch {
      return false;
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare the data for submission
    const submissionData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      link: formData.link.trim(),
      // Only include image if it's not empty
      ...(formData.image && formData.image.trim() !== ""
        ? { image: formData.image.trim() }
        : { image: null }),
    };

    setIsLoading(true);
    try {
      const response = await AxiosCosmicClassroom.post(
        "/articles/",
        submissionData
      );
      console.log("Response:", response.data); // Log successful response
      setSubmitSuccess(true);
      setFormData({
        name: "",
        description: "",
        link: "",
        image: null,
      });
      await fetchArticles(); // Refresh the articles list
      setShowForm(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error response:", error.response?.data);
        setFormError({
          name:
            error.response?.data?.message ||
            "Error adding article. Please try again.",
        });
      } else {
        console.error("Unexpected error:", error);
        setFormError({
          name: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center mt-24">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1 className="mb-12 text-2xl font-nasalization">Resources</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-8 btn-yellow"
      >
        {showForm ? "Hide Form" : "Add New Article"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mb-12 p-6 bg-alto bg-opacity-80 rounded-3xl"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  formError?.name ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formError?.name && (
                <p className="mt-1 text-sm text-red-600">{formError.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`mt-1 block w-full rounded-md border ${
                  formError?.description ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formError?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formError.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="link"
                className="block text-sm font-medium text-gray-700"
              >
                Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  formError?.link ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formError?.link && (
                <p className="mt-1 text-sm text-red-600">{formError.link}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL (optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {submitSuccess && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
              Article added successfully!
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full btn-yellow"
          >
            {isLoading ? "Adding..." : "Add Article"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-alto bg-opacity-80 rounded-3xl overflow-hidden flex flex-col justify-between min-h-[470px] p-3"
          >
            <img
              src={article.image ? article.image : articleImage.src}
              alt={article.name}
              className="w-full h-40 object-cover rounded-t-3xl"
            />
            <div className="p-4 flex-grow text-black flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{article.name}</h2>
                <p className="mt-2 mb-4">{article.description}</p>
              </div>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-yellow mt-auto w-fit"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
