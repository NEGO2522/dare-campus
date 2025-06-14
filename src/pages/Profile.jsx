import React, { useRef, useState } from "react";
import { Pencil, Home, PlusCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Kshitij Jain");
  const [username, setUsername] = useState("@kshitij");
  const [bio, setBio] = useState("Aspiring entrepreneur, passionate developer & AI enthusiast 🚀");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("✅ Profile link copied to clipboard!");
  };

  const handleEditToggle = () => {
    if (isEditing) {
      alert("✅ Changes saved!");
    }
    setIsEditing(!isEditing);
  };

  const renderProfileInfo = () => (
    isEditing ? (
      <div className="space-y-2 text-sm text-black">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-1 rounded-md focus:outline-none"
          placeholder="Your Name"
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-1 rounded-md focus:outline-none"
          placeholder="Username"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-3 py-1 rounded-md focus:outline-none"
          placeholder="Your bio"
        />
      </div>
    ) : (
      <>
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-gray-400">{username}</p>
        <p className="text-center text-gray-300 mt-1">{bio}</p>
      </>
    )
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 pb-24">
      <h1 className="hidden md:block text-3xl font-bold text-center text-indigo-400 mb-8">Your Profile 👤</h1>

      {/* Desktop View */}
      <div className="hidden md:flex max-w-5xl mx-auto gap-10">
        <div className="w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="relative w-fit mx-auto group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-indigo-500 bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-14 h-14">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zM4.5 20.25a8.25 8.25 0 0115 0" />
                </svg>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full group-hover:bg-indigo-600 transition"
              title="Change Profile Picture"
            >
              <Pencil size={16} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          </div>

          <div className="mt-4 text-center">{renderProfileInfo()}</div>

          <div className="mt-6 border-t border-gray-700 pt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Posts</span><span>12</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Followers</span><span>108</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Following</span><span>85</span></div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleEditToggle}
              className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
            <button
              onClick={handleShareProfile}
              className="w-full py-2 bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
            >
              Share Profile
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">Your Posts</h3>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="bg-gray-700 h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="relative w-fit mx-auto group">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-indigo-500 bg-gray-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zM4.5 20.25a8.25 8.25 0 0115 0" />
              </svg>
            </div>
          )}
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full group-hover:bg-indigo-600 transition"
            title="Change Profile Picture"
          >
            <Pencil size={14} />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
        </div>

        <div className="mt-4 text-center">{renderProfileInfo()}</div>

        <div className="mt-6 border-t border-gray-700 pt-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Posts</span><span>12</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Followers</span><span>108</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Following</span><span>85</span></div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleEditToggle}
            className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
          <button
            onClick={handleShareProfile}
            className="w-full py-2 bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
          >
            Share Profile
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">Your Posts</h3>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-700 h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3 flex justify-around items-center md:hidden border-t border-gray-700 z-50">
        <button onClick={() => navigate("/feed")} className="flex flex-col items-center text-gray-300 hover:text-white transition">
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button onClick={() => navigate("/create")} className="flex flex-col items-center text-gray-300 hover:text-white transition">
          <PlusCircle size={24} />
          <span className="text-xs mt-1">Create</span>
        </button>
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-indigo-400 transition">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
