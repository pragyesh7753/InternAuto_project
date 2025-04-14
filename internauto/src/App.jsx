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
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left Section - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 text-white"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  <Typewriter
                    options={{
                      strings: ['Simplify Your Job Hunt.', 'Accelerate Your Career.', 'Land Your Dream Internship.'],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 100,
                      delay: 120,
                    }}
                  />
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-200">
                  Skip the tedious application process with InternAuto. Apply to multiple internships with a single click,
                  receive personalized career guidance, and create professional resumes effortlessly.
                </p>
                <div className="flex gap-4">
                  {!isSignedIn ? (
                    <>
                      <SignUpButton mode="modal">
                        <button className="btn-primary flex items-center gap-2">
                          <FaRocket /> Get Started
                        </button>
                      </SignUpButton>
                      <SignInButton mode="modal">
                        <button className="btn-secondary flex items-center gap-2">
                          <FaSignInAlt /> Sign In
                        </button>
                      </SignInButton>
                    </>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={handleManageAccount}
                        className="btn-secondary flex items-center gap-2"
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
                className="flex-1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Internshala Automation Card */}
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front bg-white/10 bg-opacity-10 p-6 rounded-xl backdrop-blur-lg">
                        <FaLaptopCode className="text-4xl mb-4" style={{ color: 'var(--color-accent)' }} />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Internshala Automation
                        </h3>
                        <p className="text-gray-200">
                          Automate your application process and apply to multiple internships with one click.
                        </p>
                      </div>
                      <div
                        className="flip-card-back p-6 rounded-xl cursor-pointer"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                        onClick={() => handleCardClick('/automation')}
                      >
                        <div className="h-full flex flex-col items-center justify-center text-white">
                          <h3 className="text-2xl font-bold mb-4">Start Automating</h3>
                          <FaArrowRight className="text-3xl animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career Guidance Card */}
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front bg-white/10 bg-opacity-10 p-6 rounded-xl backdrop-blur-lg">
                        <FaBrain className="text-4xl mb-4" style={{ color: 'var(--color-accent)' }} />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Career Guidance
                        </h3>
                        <p className="text-gray-200">
                          Get personalized career suggestions based on your skills and interests.
                        </p>
                      </div>
                      <div
                        className="flip-card-back p-6 rounded-xl cursor-pointer"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                        onClick={() => handleCardClick('/guidance')}
                      >
                        <div className="h-full flex flex-col items-center justify-center text-white">
                          <h3 className="text-2xl font-bold mb-4">Get Guidance</h3>
                          <FaArrowRight className="text-3xl animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Builder Card */}
                  <div className="flip-card md:col-span-2 md:w-1/2 md:mx-auto">
                    <div className="flip-card-inner">
                      <div className="flip-card-front bg-white/10 bg-opacity-10 p-6 rounded-xl backdrop-blur-lg">
                        <FaFileAlt className="text-4xl mb-4" style={{ color: 'var(--color-accent)' }} />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Resume Builder
                        </h3>
                        <p className="text-gray-200">
                          Create a professional resume with our easy-to-use builder and templates.
                        </p>
                      </div>
                      <div
                        className="flip-card-back p-6 rounded-xl cursor-pointer"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                        onClick={() => handleCardClick('/resume')}
                      >
                        <div className="h-full flex flex-col items-center justify-center text-white">
                          <h3 className="text-2xl font-bold mb-4">Build Resume</h3>
                          <FaArrowRight className="text-3xl animate-bounce" />
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
  );
}

export default App;