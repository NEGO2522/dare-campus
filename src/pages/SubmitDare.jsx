import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';

const SubmitDare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dare } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // Add other form fields as needed
  });
  
  // Only require image for submission, make other fields optional
  const isFormComplete = !!image && !isSubmitted;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    console.log('Starting camera...');
    try {
      // First stop any existing stream
      if (cameraStream) {
        stopCamera();
      }
      
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }
      
      console.log('Requesting camera access...');
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          // On mobile, use the current facing mode
          // On desktop, default to user-facing camera
          facingMode: isMobile ? { exact: facingMode } : 'user'
        },
        audio: false
      };
      
      console.log('Using constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera access granted, stream:', stream);
      
      if (!videoRef.current) {
        console.error('Video ref not available');
        return;
      }
      
      // Set the stream to the video element
      videoRef.current.srcObject = stream;
      
      // Set necessary attributes for mobile browsers
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('autoplay', 'true');
      videoRef.current.setAttribute('muted', 'true');
      
      // Wait for the video to be ready
      await new Promise((resolve, reject) => {
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, attempting to play...');
          videoRef.current.play()
            .then(() => {
              console.log('Video playback started');
              resolve();
            })
            .catch(e => {
              console.error('Error playing video:', e);
              reject(e);
            });
        };
        
        // Add error handler
        videoRef.current.onerror = (e) => {
          console.error('Video element error:', e);
          reject(new Error('Video element error'));
        };
      });
      
      console.log('Setting camera stream and showing camera UI');
      setCameraStream(stream);
      setShowCamera(true);
      
    } catch (error) {
      console.error('Error in startCamera:', error);
      alert(`Could not access camera: ${error.message}\n\nPlease ensure you've granted camera permissions and try again.`);
      if (cameraStream) {
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      setImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'submitting', 'success', 'error'
  const [submissionError, setSubmissionError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      alert('Please upload or take a photo of your progress');
      return;
    }

    if (isSubmitted) {
      alert('Dare has already been submitted!');
      return;
    }

    setSubmissionStatus('submitting');
    setSubmissionError('');
    
    try {
      // Here you would typically upload the image to your server
      console.log('Submitting image:', image);
      
      // Simulate API call with validation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate server-side validation
          const isValidImage = true; // Replace with actual validation
          
          if (isValidImage) {
            resolve();
          } else {
            reject(new Error('Invalid image. Please upload a clear photo.'));
          }
        }, 1500);
      });
      
      // If we get here, submission was successful
      setSubmissionStatus('success');
      setIsSubmitted(true);
      
      // Show success message
      alert('Dare submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting dare:', error);
      setSubmissionStatus('error');
      setSubmissionError(error.message || 'Failed to submit dare. Please try again.');
      alert(error.message || 'Failed to submit dare. Please try again.');
    }
  };

  const renderForm = () => (
    <div className="space-y-6 sm:space-y-8 w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 px-2">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 break-words">
            Submit Your Dare
          </span>
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-2 sm:px-4">
          Share your completed dare with the community and inspire others!
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleFormSubmit}
        className="w-full bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-gray-700/50 p-5 sm:p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center px-1">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">
              {dare?.text || 'Your Dare'}
            </h2>
            <p className="text-indigo-300 text-xs sm:text-sm">
              {dare?.difficulty ? `Difficulty: ${dare.difficulty}` : ''}
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-medium text-gray-200 mb-3 sm:mb-4 px-1">
                Upload or take a photo of your completed dare
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full h-full p-4 sm:p-5 md:p-6 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-600 hover:border-indigo-500/50 transition-colors duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">Choose from Gallery</span>
                    <span className="text-xs text-gray-400">JPG, PNG up to 10MB</span>
                  </button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full h-full p-4 sm:p-5 md:p-6 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-600 hover:border-indigo-500/50 transition-colors duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">Open Camera</span>
                    <span className="text-xs text-gray-400">Take a photo manually</span>
                  </button>
                </motion.div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Camera Preview Modal */}
                {showCamera && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
                  >
                    <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden">
                      <div className="w-full" style={{ height: '70vh', maxHeight: '600px', position: 'relative', overflow: 'hidden' }}>
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transform: 'scaleX(-1)',
                          WebkitTransform: 'scaleX(-1)',
                          backgroundColor: '#000'
                        }}
                      />
                      {!cameraStream && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
                          <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Starting camera...</p>
                          </div>
                        </div>
                      )}
                    </div>
                      
                      <div className="p-4 flex justify-center items-center gap-4 bg-gray-900">
                        <button
                          onClick={stopCamera}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm sm:text-base"
                          aria-label="Close camera"
                        >
                          Close
                        </button>
                        
                        {isMobile && (
                          <button
                            onClick={() => {
                              setFacingMode(prev => {
                                const newMode = prev === 'user' ? 'environment' : 'user';
                                // Restart camera with new facing mode
                                setTimeout(() => startCamera(), 100);
                                return newMode;
                              });
                            }}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
                            aria-label="Switch camera"
                          >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          </button>
                        )}
                        
                        <button
                          onClick={capturePhoto}
                          disabled={!cameraStream}
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                            cameraStream ? 'bg-white/90 hover:bg-white' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          aria-label="Take photo"
                        >
                          <div className={`w-14 h-14 rounded-full border-4 ${
                            cameraStream ? 'border-gray-800' : 'border-gray-500'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {image && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 sm:mt-6 bg-gray-900/30 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <div className="relative group">
                    <img 
                      src={image} 
                      alt="Your submission" 
                      className="w-full max-h-80 sm:max-h-96 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-gray-900/80 hover:bg-red-500/90 rounded-full text-white transition-colors duration-200"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="pt-3 sm:pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: image ? 1 : 0, y: 0 }}
            >
              {submissionStatus === 'success' ? (
                <div className="text-center py-3 px-6 rounded-full bg-green-100 text-green-800 font-medium">
                  ✓ Dare Submitted Successfully!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!isFormComplete || submissionStatus === 'submitting'}
                  className={`w-full py-3 px-6 rounded-full font-semibold text-white transition-colors duration-300 ${
                    isFormComplete && submissionStatus !== 'submitting'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submissionStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Dare'
                  )}
                </button>
              )}
              {submissionStatus === 'error' && (
                <div className="mt-2 text-center text-sm text-red-500">
                  {submissionError}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.form>
      
      <div className="text-center mt-8 text-sm text-gray-400">
        <p>Make sure your submission follows our community guidelines</p>
      </div>
    </div>
  );

  const handleNextDare = () => {
    if (isSubmitted) {
      window.location.href = '/dare';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden pt-16">
      <main className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-14">
        {renderForm()}
        
        {/* Next Dare Button - Only show after successful submission */}
        {submissionStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              onClick={handleNextDare}
              className="w-full sm:w-auto mx-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              Next Dare
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </motion.div>
        )}
        

      </main>
      
      {/* Footer */}
      <footer className="py-4 sm:py-6 px-4 text-center text-gray-400 text-xs sm:text-sm">
        <p className="leading-tight sm:leading-normal"> {new Date().getFullYear()} Dare of the Day. All dares are meant to be fun and safe.</p>
      </footer>
    </div>
  );
};

export default SubmitDare;