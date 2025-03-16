import Image from "next/image";
import Link from "next/link";
import React from "react";

// Fetch the blog data
async function fetchPopular(id : number) {
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`, // Ensure your API token is valid
        },
    };

    try {
        // Use the new filters query parameter to fetch by id
        const url = `http://127.0.0.1:1337/api/populars?filters[id][$eq]=${id}&populate=*`;
        console.log("Fetching from URL:", url);

        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const response = await res.json();
        return response.data[0]; // Return the first matching object
    } catch (error) {
        console.error("Error fetching blog data:", error);
        return null;
    }
}


const Page = async ({ params }: any) => {
    const { id } = params; // Extract ID from dynamic route
    const pop = await fetchPopular(Number(id)); // Ensure ID is a number

    if (!pop) {
        return (
            <div className="bg-black h-screen text-white flex justify-center items-center">
                <p>Unable to load blog data.</p>
            </div>
        );
    }

    // Destructure the blog data
    const { Title, Date: headerDate, Metadesc, PopularImage } = pop;

    // Format the date properly
    const formattedDate = headerDate
        ? new Date(headerDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown Date";

    // Define image URL with a placeholder fallback
    const imageURL = PopularImage?.formats?.large?.url
        ? `http://127.0.0.1:1337${PopularImage.formats.large.url}`
        : "/placeholder-image.jpg";

    return (
        <>
            <h1>
                <title>{Title} | Blog</title>
                <meta name="description" content={Metadesc || "Blog details"} />
            </h1>

            <div className="bg-[#090017] h-screen text-white">
                <div className="max-w-3xl mx-auto p-4">
                    <Link href={"/"} className="text-xl mt-10">
                        {"< Back"}
                    </Link>

                    {/* Blog image */}
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

                    {/* Blog content */}
                    <div className="mt-4">
                        <h1 className="text-3xl font-semibold">{Title}</h1>
                        <p className="text-gray-400 mt-2">{Metadesc}</p>
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
