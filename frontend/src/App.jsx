// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaRocket, FaSignInAlt, FaBrain, FaLaptopCode, FaArrowRight, FaUserCog, FaFileAlt } from 'react-icons/fa';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton, UserButton, useClerk } from '@clerk/clerk-react';
import Typewriter from 'typewriter-effect';
import toast from 'react-hot-toast';
import InternshalaForm from './components/InternshalaForm';
import CareerForm from './components/CareerForm';
import ResumeForm from './components/ResumeForm';
import TawkToChat from './components/TawkToChat';

function App() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { openUserProfile } = useClerk();

  const handleCardClick = (path) => {
    if (!isSignedIn) {
      toast.error('Please sign in to access this feature!');
      return;
    }
    navigate(path);
  };

  const handleManageAccount = () => {
    openUserProfile();
  };

  return (
    <>
      {/* Add TawkToChat component outside the main div to ensure it's always present */}
      <TawkToChat />
      
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4 py-12">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full px-4">
                {/* Left Section - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex-1 text-white mb-8 md:mb-0"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    <Typewriter
                      options={{
                        strings: ['Automate Your Future.', 'Shape Your Career.', 'Build Your Path.'],
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 100,
                        delay: 120,
                      }}
                    />
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-200">
                    Streamline your internship hunt and discover your perfect career path with InternAuto.
                    Let AI power your professional journey.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {!isSignedIn ? (
                      <>
                        <SignUpButton mode="modal">
                          <button className="btn-primary flex items-center gap-2 text-base">
                            <FaRocket /> Get Started
                          </button>
                        </SignUpButton>
                        <SignInButton mode="modal">
                          <button className="btn-secondary flex items-center gap-2 text-base">
                            <FaSignInAlt /> Sign In
                          </button>
                        </SignInButton>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-4 items-center">
                        <button
                          onClick={handleManageAccount}
                          className="btn-secondary flex items-center gap-2 text-base"
                        >
                          <FaUserCog /> Manage Account
                        </button>
                        <div className="ml-2">
                          <UserButton afterSignOutUrl="/" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Right Section - Features */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex-1 w-full"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Internshala Automation Card */}
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front bg-white/10 bg-opacity-10 p-4 sm:p-6 rounded-xl backdrop-blur-lg">
                          <FaLaptopCode className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: 'var(--color-accent)' }} />
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            Internshala Automation
                          </h3>
                          <p className="text-sm sm:text-base text-gray-200">
                            Automate your application process and apply to multiple internships with one click.
                          </p>
                        </div>
                        <div
                          className="flip-card-back p-4 sm:p-6 rounded-xl cursor-pointer"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                          onClick={() => handleCardClick('/automation')}
                        >
                          <div className="h-full flex flex-col items-center justify-center text-white">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Start Automating</h3>
                            <FaArrowRight className="text-2xl sm:text-3xl animate-bounce" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Career Guidance Card */}
                    <div className="flip-card">
                      <div className="flip-card-inner">
                        <div className="flip-card-front bg-white/10 bg-opacity-10 p-4 sm:p-6 rounded-xl backdrop-blur-lg">
                          <FaBrain className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: 'var(--color-accent)' }} />
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            Career Guidance
                          </h3>
                          <p className="text-sm sm:text-base text-gray-200">
                            Get personalized career suggestions based on your skills and interests.
                          </p>
                        </div>
                        <div
                          className="flip-card-back p-4 sm:p-6 rounded-xl cursor-pointer"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                          onClick={() => handleCardClick('/guidance')}
                        >
                          <div className="h-full flex flex-col items-center justify-center text-white">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Get Guidance</h3>
                            <FaArrowRight className="text-2xl sm:text-3xl animate-bounce" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resume Builder Card */}
                    <div className="flip-card sm:col-span-2 md:max-w-xs md:mx-auto">
                      <div className="flip-card-inner">
                        <div className="flip-card-front bg-white/10 bg-opacity-10 p-4 sm:p-6 rounded-xl backdrop-blur-lg">
                          <FaFileAlt className="text-3xl sm:text-4xl mb-3 sm:mb-4" style={{ color: 'var(--color-accent)' }} />
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                            Resume Builder
                          </h3>
                          <p className="text-sm sm:text-base text-gray-200">
                            Create a professional resume in minutes with our AI-powered builder.
                          </p>
                        </div>
                        <div
                          className="flip-card-back p-4 sm:p-6 rounded-xl cursor-pointer"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                          onClick={() => handleCardClick('/resume')}
                        >
                          <div className="h-full flex flex-col items-center justify-center text-white">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Build Resume</h3>
                            <FaArrowRight className="text-2xl sm:text-3xl animate-bounce" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            }
          />
          <Route
            path="/automation"
            element={<InternshalaForm onClose={() => navigate('/')} />}
          />
          <Route
            path="/guidance"
            element={<CareerForm onClose={() => navigate('/')} />}
          />
          <Route
            path="/resume"
            element={<ResumeForm onClose={() => navigate('/')} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;