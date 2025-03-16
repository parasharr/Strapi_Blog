import Image from "next/image";
import Link from "next/link";
import React from "react";

const PopularList = async ({popular}: any) => {

  if (!popular || popular.length === 0) {
    return (
      <div className="bg-black h-screen text-white flex justify-center items-center">
        <p>Unable to load popular data.</p>
      </div>
    );
  }

  return (
    <div className=" text-white">
      <div className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popular?.data?.map((popular : any) => {
            const { id, Title, Date: headerDate, PopularImage } = popular;

            const formattedDate = new Date(headerDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            return (
              <div
                key={id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-md"
              >
                <div className="relative w-full h-48">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={
                      PopularImage?.formats?.thumbnail?.url
                        ? `http://127.0.0.1:1337${PopularImage.formats?.thumbnail.url}`
                        : "/placeholder-image.jpg"
                    }
                    alt={Title || "Popular Image"}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{Title}</h2>
                  <p className="text-sm text-gray-400 mt-2">{formattedDate}</p>
                  <Link
                    href={`/popular/${id}`}
                    className="text-blue-400 underline mt-2 inline-block"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularList;