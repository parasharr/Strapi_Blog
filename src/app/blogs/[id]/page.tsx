import Image from "next/image";
import Link from "next/link";

// Define the type for the dynamic route params
interface Params {
    id: string; // Dynamic route segment is always a string
}

// Function to fetch blog data by ID
async function fetchBlog(id: number) {
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`, // Ensure your API token is valid
        },
    };

    try {
        const url = `http://127.0.0.1:1337/api/blogs?filters[id][$eq]=${id}&populate=*`;
        const res = await fetch(url, options);

        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const response = await res.json();
        return response.data[0]; // Return the first matching object
    } catch (error) {
        console.error("Failed to fetch blog:", error);
        return null;
    }
}

// Dynamic Page Component
const Page = async ({ params }: Awaited<{ params: Params }>) => {
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

    const { Title, Date: blogDate, Description, BlogImage } = blog;

    // Format the blog date
    const formattedDate = blogDate
        ? new Date(blogDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Date not available";

    // Prepare the blog image URL
    const imageUrl = BlogImage?.formats?.large?.url
        ? `http://127.0.0.1:1337${BlogImage.formats.large.url}`
        : "/placeholder-image.jpg";

    return (
        <div className="bg-[#090017] h-screen text-white">
            <div className="max-w-3xl mx-auto p-4">
                <Link href="/" className="text-xl mt-10">
                    {"< Back"}
                </Link>

                <div className="relative w-full h-96 overflow-hidden rounded-lg mt-5">
                    <Image
                        src={imageUrl}
                        layout="fill"
                        objectFit="cover"
                        alt={Title || "Blog Image"}
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
};

export default Page;
