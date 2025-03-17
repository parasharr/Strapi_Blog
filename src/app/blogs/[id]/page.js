import Image from "next/image";
import Link from "next/link";

// Function to fetch blog data by ID
async function fetchBlog(id) {
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
    };
    try {
        const url = `https://strapi-blog-backend-ndrb.onrender.com/api/blogs?filters[id][$eq]=${id}&populate=*`;
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const response = await res.json();
        return response.data[0];
    } catch (error) {
        console.error("Failed to fetch blog:", error);
        return null;
    }
}

// Dynamic Page Component
export default async function Page({ params }) {
    const { id } = params;
    const numericId = Number(id);
    
    if (!Number.isInteger(numericId)) {
        return (
            <div className="bg-black h-screen text-white flex justify-center items-center">
                <p>Invalid blog ID provided.</p>
            </div>
        );
    }
    
    const blog = await fetchBlog(numericId);
    
    if (!blog) {
        return (
            <div className="bg-black h-screen text-white flex justify-center items-center">
                <p>Unable to load blog data. Please try again later.</p>
            </div>
        );
    }
    
    // Handle different possible Strapi response structures
    const blogData = blog.attributes || blog;
    const { Title, Date: blogDate, Description, BlogImage } = blogData;
    
    const formattedDate = blogDate
        ? new Date(blogDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Date not available";
    
    // Handle image path based on response structure
    let imageUrl = "/placeholder-image.jpg";
    if (BlogImage?.data?.attributes?.formats?.large?.url) {
        imageUrl = `https://strapi-blog-backend-ndrb.onrender.com${BlogImage.data.attributes.formats.large.url}`;
    } else if (BlogImage?.formats?.large?.url) {
        imageUrl = `https://strapi-blog-backend-ndrb.onrender.com${BlogImage.formats.large.url}`;
    }
    
    return (
        <div className="bg-[#090017] min-h-screen text-white">
            <div className="max-w-3xl mx-auto p-4">
                <Link href="/" className="text-xl mt-10 inline-block">
                    {"< Back"}
                </Link>
                <div className="relative w-full h-96 overflow-hidden rounded-lg mt-5">
                    <Image
                        src={imageUrl}
                        fill
                        className="object-cover"
                        alt={Title || "Blog Image"}
                        priority
                    />
                </div>
                <div className="mt-4">
                    <h1 className="text-3xl font-semibold">{Title}</h1>
                    <p className="text-gray-400 mt-2">{Description}</p>
                    <div className="mt-4 flex items-center text-gray-400">
                        <span className="text-sm">Published on {formattedDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}