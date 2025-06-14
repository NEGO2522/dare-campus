import React, { useState } from "react";
import { Image, Trash2, Home, Search, User } from "lucide-react";
import Navbar from "../components/navbar";

export default function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Just completed my first coding project! 🚀",
      image: null,
    },
    {
      id: 2,
      content: "This platform is a great place to share thoughts 🙌",
      image: "https://source.unsplash.com/600x400/?coding,tech",
    },
    {
      id: 3,
      content: "Anyone here into AI/ML? Let's connect! 🤖",
      image: null,
    },
  ]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);

  const handlePost = () => {
    if (newPost.trim() === "" && !image) return;

    const post = {
      id: Date.now(),
      content: newPost,
      image,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setImage(null);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 max-w-2xl mx-auto px-4 pb-24">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">
          Speak Your Mind 🧠
        </h1>

        {/* Post Input Area */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <textarea
            className="w-full p-4 rounded-lg bg-gray-700 text-white focus:outline-none resize-none"
            rows="4"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />

          <div className="flex justify-between items-center mt-4">
            <label className="cursor-pointer flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
              <Image className="w-5 h-5" />
              <span className="text-sm">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              onClick={handlePost}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition duration-200"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-5 rounded-xl relative shadow-md"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded-lg mb-3 max-h-80 w-full object-contain"
                />
              )}
              <p className="text-sm text-gray-200">{post.content}</p>

              <button
                onClick={() => handleDelete(post.id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-500 transition duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around items-center px-4 py-3 md:hidden z-50 shadow-inner">
        {/* Nav Item Template */}
        {[
          { label: "Home", icon: <Home className="h-6 w-6 mb-1" /> },
          { label: "Search", icon: <Search className="h-6 w-6 mb-1" /> },
          {
            label: "Create",
            icon: <span className="text-3xl mb-1">+</span>,
            onClick: () => {
              document.querySelector("textarea")?.focus();
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
          },
          {
            label: "Chat",
            icon: (
              <svg
                className="h-6 w-6 mb-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-6.219-8.56 2 2 0 00.563 3.947A9 9 0 0121 12z"
                />
              </svg>
            ),
          },
          { label: "Me", icon: <User className="h-6 w-6 mb-1" /> },
        ].map(({ label, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex flex-col items-center text-xs text-gray-300 hover:text-indigo-400 transition cursor-pointer"
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
 