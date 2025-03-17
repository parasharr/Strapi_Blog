import Image from "next/image";
import Link from "next/link";
import React from "react";

// Define types for popular data
interface PopularItem {
    id: number;
    Title: string;
    Date: string;
    PopularImage?: {
        formats?: {
            thumbnail?: {
                url: string;
            };
        };
    };
}

interface PopularListProps {
    popular: {
        data: PopularItem[];
    };
}

const PopularList = async ({ popular }: PopularListProps) => {

    return (
        <div className="text-white">
            <div className="max-w-5xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popular.data.map((item) => {
                        const { id, Title, Date: headerDate, PopularImage } = item;

                        const formattedDate = new Date(headerDate).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        );

                        const imageUrl = PopularImage?.formats?.thumbnail?.url
                            ? `https://strapi-blog-backend-ndrb.onrender.com${PopularImage.formats.thumbnail.url}`
                            : "/placeholder-image.jpg";

                        return (
                            <div
                                key={id}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-md"
                            >
                                <div className="relative w-full h-48">
                                    <Image
                                        layout="fill"
                                        objectFit="cover"
                                        src={imageUrl}
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