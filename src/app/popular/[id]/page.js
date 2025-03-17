import Image from "next/image";
import Link from "next/link";

// Function to fetch popular data by ID
async function fetchPopular(id) {
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
    };
    
    try {
        const url = `http://127.0.0.1:1337/api/populars?filters[id][$eq]=${id}&populate=*`;
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const response = await res.json();
        return response.data[0];
    } catch (error) {
        console.error("Failed to fetch popular:", error);
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
                <p>Invalid popular ID provided.</p>
            </div>
        );
    }
    
    const popular = await fetchPopular(numericId);
    
    if (!popular) {
        return (
            <div className="bg-black h-screen text-white flex justify-center items-center">
                <p>Unable to load popular data. Please try again later.</p>
            </div>
        );
    }
    
    // Handle different possible Strapi response structures
    const popularData = popular.attributes || popular;
    const { Title, Date: popularDate, Metadesc, PopularImage } = popularData;
    
    const formattedDate = popularDate
        ? new Date(popularDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Date not available";
    
    // Handle image path based on response structure
    let imageUrl = "/placeholder-image.jpg";
    if (PopularImage?.data?.attributes?.formats?.large?.url) {
        imageUrl = `http://127.0.0.1:1337${PopularImage.data.attributes.formats.large.url}`;
    } else if (PopularImage?.formats?.large?.url) {
        imageUrl = `http://127.0.0.1:1337${PopularImage.formats.large.url}`;
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
                        alt={Title || "Popular Image"}
                        priority
                    />
                </div>
                <div className="mt-4">
                    <h1 className="text-3xl font-semibold">{Title}</h1>
                    <p className="text-gray-400 mt-2">{Metadesc}</p>
                    <div className="mt-4 flex items-center text-gray-400">
                        <span className="text-sm">Published on {formattedDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}