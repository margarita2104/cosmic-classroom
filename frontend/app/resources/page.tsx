"use client";

import { useEffect, useState } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";

interface Article {
  id: number;
  name: string;
  description: string;
  link: string;
  image: string;
}

const Resources = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const articlesResponse = await AxiosCosmicClassroom.get<Article[]>(
          "/articles/"
        );
        setArticles(articlesResponse.data);
      } catch (error) {
        setError("Error fetching articles");
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <h1 className="mb-12 text-2xl font-nasalization">Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-alto bg-opacity-80 rounded-3xl overflow-hidden"
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold">{article.name}</h2>
              <p className="text-gray-700 mt-2">{article.description}</p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
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
