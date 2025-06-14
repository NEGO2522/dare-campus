import React, { useState } from "react";
import { Image, Trash2, Home, Search, User, Plus } from "lucide-react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const navigate = useNavigate();

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
  const [showMobilePostInput, setShowMobilePostInput] = useState(false);

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
    setShowMobilePostInput(false);
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

        {/* Post Input Area - Web Only */}
        <div className="hidden md:block bg-gray-800 p-6 rounded-xl shadow-lg">
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

      {/* Mobile Post Input Modal */}
      {showMobilePostInput && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 md:hidden"
            onClick={() => setShowMobilePostInput(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 w-[90%] bg-gray-800 rounded-xl p-4 transform -translate-x-1/2 -translate-y-1/2 z-50 md:hidden shadow-2xl">
            {/* Close */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowMobilePostInput(false)}
                className="text-gray-400 hover:text-red-400 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <textarea
              className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none resize-none"
              rows="4"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex justify-between items-center mt-3">
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
        </>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex md:hidden z-50 shadow-inner">
        {[
          {
            label: "Home",
            icon: <Home className="h-6 w-6" />,
            onClick: () => navigate("/"),
          },
          {
            label: "Search",
            icon: <Search className="h-6 w-6" />,
          },
          {
            label: "Create",
            icon: <Plus className="h-6 w-6" />,
            onClick: () => setShowMobilePostInput(true),
          },
          {
            label: "Chat",
            icon: (
              <svg
                className="h-6 w-6"
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
          {
            label: "Me",
            icon: <User className="h-6 w-6" />,
            onClick: () => navigate("/profile"),
          },
        ].map(({ label, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex-1 flex flex-col items-center justify-center py-2 text-xs text-gray-300 hover:text-indigo-400 transition"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
