import Blogs from "@/components/Blogs";
import Header from "@/components/Header";
import Popular from "@/components/Popular";

async function fetchHeader() {
  const options = {
    headers : {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    }
  }

  try {
    const res = await fetch("http://127.0.0.1:1337/api/headers?populate=*", options);
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error)
  }
}

async function fetchPopular() {
  const options = {
    headers : {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    }
  }

  try {
    const res = await fetch("http://127.0.0.1:1337/api/populars?populate=*", options);
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error)
  }
}

async function fetchBlogs() {
  const options = {
    headers : {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    }
  }

  try {
    const res = await fetch("http://127.0.0.1:1337/api/blogs?populate=*", options);
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error)
  }
}

export default async function Home() {
  const header = await fetchHeader();
  const popular = await fetchPopular();
  const blogs = await fetchBlogs();
  return (
    <div className="bg-[#090017] h-min-screen">
    <Header header={header} />
    <Popular popular={popular} />
    <Blogs blogs={blogs} />
    </div>
  );
}
