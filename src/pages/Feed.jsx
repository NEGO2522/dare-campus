import React, { useState } from "react";
import { Image, Trash2 } from "lucide-react";
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
      <div className="pt-24 max-w-2xl mx-auto px-4 pb-10">
        {/* Title */}
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

        {/* Posts List */}
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
    </div>
  );
}
