"use client";

import Image from "next/image";
import Link from "next/link";

// Define types for header data
interface HeaderData {
    id: number;
    Title: string;
    Metadesc: string;
    Date: string;
    HeaderImage?: {
        formats?: {
            large?: {
                url: string;
            };
        };
        alternativeText?: string;
    };
}

interface HeaderProps {
    header: {
        data: HeaderData[];
    };
}

const Header = ({ header }: HeaderProps) => {
    const baseUrl = "http://127.0.0.1:1337"; // Strapi base URL

    return (
        <div className="text-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6">Popular Posts</h1>
                {header?.data?.map((head) => {
                    const imageUrl = head?.HeaderImage?.formats?.large?.url
                        ? `${baseUrl}${head.HeaderImage.formats.large.url}`
                        : "/default-image.jpg"; // Fallback image

                    return (
                        <div className="flex flex-wrap md:flex-nowrap mb-6" key={head.id}>
                            <div className="w-full md:w-1/2">
                                <Image
                                    src={imageUrl}
                                    alt={head.HeaderImage?.alternativeText || "Post Preview"}
                                    width={500}
                                    height={300}
                                    className="w-full h-64 object-cover rounded-md"
                                />
                            </div>

                            <div className="w-full md:w-1/2 md:pl-6 mt-4 md:mt-0">
                                <div className="text-sm text-blue-500 uppercase mb-2">
                                    {new Date(head.Date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                                <h2 className="text-2xl font-semibold mb-3">{head.Title}</h2>
                                <p className="text-gray-400 mb-5">{head.Metadesc}</p>
                                <Link href={`/header/${head.id}`}>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
                                        Read More
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Header;