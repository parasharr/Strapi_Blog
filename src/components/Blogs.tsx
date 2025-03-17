import Image from "next/image";
import Link from "next/link";

// Define types for the blog data to pass the linting error
interface Blog {
    id: number;
    Title: string;
    Description: string;
    Date: string;
    Category: string;
    BlogImage?: {
        formats?: {
            thumbnail?: {
                url: string;
            };
        };
    };
}

interface BlogsProps {
    blogs: {
        data: Blog[];
    };
}

const Blogs = ({ blogs }: BlogsProps) => {
    const baseUrl = "https://strapi-blog-backend-ndrb.onrender.com"; // Strapi base URL

    return (
        <div className="text-white mt-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">More From Blog</h1>
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className="py-2 px-4 bg-[#0A0F2E] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Blog cards styled */}
                <div className="flex flex-wrap justify-between gap-6">
                    {blogs?.data?.map((blog) => {
                        const imageUrl = blog?.BlogImage?.formats?.thumbnail?.url
                            ? `${baseUrl}${blog.BlogImage.formats.thumbnail.url}`
                            : "/default-image.jpg";

                        return (
                            <Link
                                href={`/blogs/${blog.id}`}
                                className="bg-[#222033] rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 w-full md:w-[30%] cursor-pointer"
                                key={blog.id}
                            >
                                {/* Image */}
                                <div className="relative h-40 mb-4">
                                    <Image
                                        src={imageUrl}
                                        alt={blog.Title || "Blog Image"}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>

                                {/* Blog Details */}
                                <div>
                                    <span className="text-blue-500 text-xs uppercase font-medium">
                                        {blog.Category}
                                    </span>
                                    <div className="text-gray-400 text-sm mt-1">
                                        {new Date(blog.Date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <h2 className="text-lg font-bold text-white mt-2">
                                        {blog.Title}
                                    </h2>
                                    <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                                        {blog.Description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Centered Load More Button */}
                <div className="flex justify-center mt-12">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Blogs;