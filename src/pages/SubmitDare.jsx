import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { motion } from 'framer-motion';

export default function SubmitDare() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        navigate('/login'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Open camera and stream to video
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not supported.");
    }
  };

  // Capture image from video stream
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], `captured-${Date.now()}.png`, { type: 'image/png' });
      setImage(file);
    }, 'image/png');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please sign in to submit a dare');
      navigate('/login');
      return;
    }
    
    if (!image) {
      alert('Please upload an image as proof');
      return;
    }
    
    setSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Create a unique path with user ID and timestamp
      const filePath = `proofs/${user.uid}/${Date.now()}-${image.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, filePath);
      
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, image);
      const proofUrl = await getDownloadURL(storageRef);

      alert("Proof submitted successfully!");
      
      // Reset form
      setTitle('');
      setDescription('');
      setImage(null);
      setImageURL('');
      
      // Redirect to a new dare after successful submission
      navigate('/dare');
      
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert(`Error: ${error.message || 'Failed to submit proof. Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      <div className="pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            <span className="block text-xl sm:text-2xl font-medium text-indigo-400 mb-2">
              Share Your
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Dare Completion
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Share your completed dare with the community and inspire others!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/50 p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Dare Title</label>
              <input
                type="text"
                placeholder="Enter dare title"
                className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                placeholder="Describe your dare experience..."
                rows="4"
                className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Proof of Completion</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openCamera}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300 hover:bg-indigo-600/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Open Camera</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={captureImage}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13a3 3 0 100-6 3 3 0 000 6z"></path>
                    </svg>
                    <span>Capture Image</span>
                  </motion.button>

                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <motion.label
                      htmlFor="file-upload"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600/50 transition-colors cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <span>Upload Image</span>
                    </motion.label>
                  </div>
                </div>

                <div className="flex items-center justify-center bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700 overflow-hidden">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="max-h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="p-6 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-400">Image preview will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              <video ref={videoRef} autoPlay className="hidden" />
              <canvas ref={canvasRef} width={320} height={240} className="hidden" />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-6 rounded-full font-semibold text-white transition-colors ${
                submitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Dare'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
