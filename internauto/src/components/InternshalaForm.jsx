import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AutomationStatus from './AutomationStatus';
import { InternshalaAPI } from '../api';
import { FaInfoCircle } from 'react-icons/fa';

export default function InternshalaForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [numberOfInternships, setNumberOfInternships] = useState("");
    const [isHeadless, setIsHeadless] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [showStatus, setShowStatus] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!email || !password || !numberOfInternships) {
            toast.error('Please fill all required fields');
            return;
        }
        
        try {
            setIsLoading(true);
            
            const data = await InternshalaAPI.startAutomation({
                email: email,
                password: password,
                headless: isHeadless,
                limit: parseInt(numberOfInternships, 10)
            });
            
            if (data.success) {
                setJobId(data.job_id);
                setShowStatus(true);
                toast.success('Automation started successfully');
            } else {
                toast.error(`Failed to start automation: ${data.message}`);
            }
        } catch (error) {
            console.error('Error starting automation:', error);
            toast.error('Failed to connect to the automation server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        navigate('/');
    };

    // If showing status, render the AutomationStatus component
    if (showStatus && jobId) {
        return <AutomationStatus jobId={jobId} onBack={() => setShowStatus(false)} />;
    }

    return (
        <div className='bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-8 w-[400px] max-w-[95vw] relative shadow-2xl border border-white/20'>
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors"
            >
                ×
            </button>
            <h2 className='text-2xl font-bold text-white mb-6 text-center'>Enter Your InternShala Credentials</h2>
            
            <div className='bg-white/10 p-3 rounded-lg mb-4 text-white/80 text-sm flex gap-2'>
                <FaInfoCircle className='text-white mt-1 flex-shrink-0' />
                <p>Your credentials are used only for automation. Please ensure you enter correct Internshala login details, as incorrect credentials will cause the automation to fail.</p>
            </div>
            
            <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='outline-none bg-white/10 border border-white/30 text-white text-lg py-3 px-4 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all'
                    type="email"
                    placeholder='Enter Your Email'
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='outline-none bg-white/10 border border-white/30 text-white text-lg py-3 px-4 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all'
                    type="password"
                    placeholder='Enter Your Password'
                />

                <input
                    value={numberOfInternships}
                    onChange={(e) => setNumberOfInternships(e.target.value)}
                    required
                    min="1"
                    max="15"
                    className='outline-none bg-white/10 border border-white/30 text-white text-lg py-3 px-4 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all'
                    type="number"
                    placeholder='Enter the Number Of Internships'
                />
                
                <div className="flex items-center gap-2 text-white">
                    <input
                        id="headlessMode"
                        type="checkbox"
                        checked={isHeadless}
                        onChange={(e) => setIsHeadless(e.target.checked)}
                        className="w-4 h-4"
                    />
                    <label htmlFor="headlessMode" className="cursor-pointer">
                        Run in headless mode (browser will be invisible)
                    </label>
                </div>
                
                <button 
                    className='mt-4 bg-white text-red-500 hover:bg-white/90 text-lg py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/25 flex justify-center items-center'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                    ) : (
                        "Start Automating"
                    )}
                </button>
            </form>
        </div>
    );
}