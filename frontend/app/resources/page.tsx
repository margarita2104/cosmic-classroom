"use client";

import { useEffect, useState } from "react";
import { AxiosCosmicClassroom } from "../axios/Axios";
import articleImage from "../assets/images/articlecover.jpg";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
