import Image from "next/image";
import Link from "next/link";

// Define the type for the params object
interface Params {
    id: string; // Ensure 'id' is a string type
}

// Fetch blog data
async function fetchBlog(id: number) {
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`, // Ensure your API token is valid
        },
    };

    try {
        const url = `http://127.0.0.1:1337/api/blogs?filters[id][$eq]=${id}&populate=*`;
        console.log("Fetching from URL:", url);

        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const response = await res.json();
        return response.data[0]; // Return the first blog entry
    } catch (error) {
        console.error("Error fetching blog data:", error);
        return null;
    }
}

const Page = async ({ params }: { params: Params }) => {
    const { id } = params; // Extract the dynamic ID
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

    const { Title, Date: headerDate, Description, BlogImage } = blog;

    const formattedDate = headerDate
        ? new Date(headerDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Date not available";

    const imageURL = BlogImage?.formats?.large?.url
        ? `http://127.0.0.1:1337${BlogImage.formats.large.url}`
        : "/placeholder-image.jpg";

    return (
        <>
            <head>
                <title>{Title} | Blog</title>
                <meta name="description" content={Description || "Blog details"} />
            </head>

            <div className="bg-[#090017] h-screen text-white">
                <div className="max-w-3xl mx-auto p-4">
                    <Link href={"/"} className="text-xl mt-10">
                        {"< Back"}
                    </Link>

                    <div className="relative w-full h-96 overflow-hidden rounded-lg mt-5">
                        <Image
                            src={imageURL}
                            layout="fill"
                            objectFit="cover"
                            placeholder="blur"
                            blurDataURL="/placeholder-image.jpg"
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
        </>
    );
};

export default Page;
