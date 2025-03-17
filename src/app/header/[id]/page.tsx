import Image from "next/image";
import Link from "next/link";
import React from "react";

async function fetchBlog() {
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  };

  try {
    const res = await fetch(
      `https://strapi-blog-backend-ndrb.onrender.com/api/headers?populate=*`,
      options
    );
    const response = await res.json();
    return response.data[0]; // Directly accessing the first object
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }
}

const page = async () => {
  const head = await fetchBlog();

  if (!head) {
    return (
      <div className="bg-[#090017] h-screen text-white flex justify-center items-center">
        <p>Unable to load blog data.</p>
      </div>
    );
  }

  // Rename `Date` to avoid conflicts with the built-in object
  const { Title, Date: headerDate, Metadesc, HeaderImage } = head;

  // Format the date properly
  const formattedDate = new Date(headerDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="bg-black h-screen text-white">
        <div className="max-w-3xl mx-auto p-4">
          <Link href={"/"} className="text-xl mt-10">
            {"< Back"}
          </Link>
          <div className="relative w-full h-96 overflow-hidden rounded-lg mt-5">
            <Image
              layout="fill"
              objectFit="cover"
              src={
                HeaderImage?.formats?.large?.url
                  ? `https://strapi-blog-backend-ndrb.onrender.com${HeaderImage.formats.large.url}`
                  : "/placeholder-image.jpg" // Add a default placeholder if image is missing
              }
              alt={Title || "Blog Image"}
            />
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-semibold">{Title}</h1>
            <p className="text-gray-600 mt-2">{Metadesc}</p>
            <div className="mt-4 flex items-center text-gray-400">
              <span className="text-sm">Published on {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
