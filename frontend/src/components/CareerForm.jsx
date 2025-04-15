import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

function CareerForm({ onClose }) {

    const [goal, setGoal] = useState("");
    const [education, setEducation] = useState("");
    const [technicalSkills, setTechnicalSkills] = useState("");
    const [softSkills, setSoftSkills] = useState("");
    const [project, setProject] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('https://internauto-backend.onrender.com/api/career_suggestion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    goal: goal,
                    education: education,
                    technicalSkills: technicalSkills,
                    softSkills: softSkills,
                    project: project,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log("Suggestion from API:", data.suggestion);
                setSuggestion(data.suggestion);
            } else {
                toast.error(data.message || 'Failed to get career suggestion');
                setSuggestion('');
            }
        } catch (error) {
            console.error('Error fetching career suggestion:', error);
            toast.error('Failed to connect to the server. Please try again.');
            setSuggestion('');
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-4 sm:p-6 w-[95%] max-w-[600px] max-h-[85vh] relative shadow-2xl border border-white/20 animate-fadeIn overflow-hidden flex flex-col">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:scale-110 text-2xl transition-all duration-300 z-10"
            >
                ×
            </button>
            <div className="text-center mb-4 sm:mb-6">
                <div className="inline-block p-2 rounded-full bg-white/20 mb-2 sm:mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Career Guidance</h2>
                <p className="text-white/80 text-xs sm:text-sm mt-1">Let's plan your professional journey together</p>
            </div>

            {suggestion ? (
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-3 sm:p-4 rounded-lg bg-white/10 border border-white/30 text-white shadow-inner transition-all duration-300 overflow-y-auto flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 border-b border-white/30 pb-2 sticky top-0 bg-gradient-to-r from-yellow-500/90 to-red-500/90 rounded-t-lg -mx-3 sm:-mx-4 -mt-3 sm:-mt-4 px-3 sm:px-4 pt-3 sm:pt-4 shadow-md">Your Career Path</h3>
                        <div className="bg-white/5 p-3 rounded-lg mt-4 overflow-y-auto max-h-[45vh]">
                            <p className="whitespace-pre-line leading-relaxed text-sm sm:text-base">{suggestion}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSuggestion("")}
                        className="mt-4 bg-white text-red-500 hover:bg-white/90 text-sm sm:text-base py-2 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/25 w-full"
                    >
                        Back to Form
                    </button>
                </div>
            ) : (
                <form onSubmit={submitHandler} className='flex flex-col gap-2 sm:gap-3 overflow-y-auto pr-1 flex-1'>
                    <div className="space-y-1">
                        <label className='text-sm sm:text-base font-bold text-white block'>Career Goal</label>
                        <input
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            required
                            className='outline-none bg-white/10 border border-white/30 text-white text-sm sm:text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15'
                            type="text"
                            placeholder='What position would you like to achieve?'
                        />
                    </div>

                    <div className="space-y-1">
                        <label className='text-sm sm:text-base font-bold text-white block'>Education</label>
                        <input
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            required
                            className='outline-none bg-white/10 border border-white/30 text-white text-sm sm:text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15'
                            type="text"
                            placeholder='Your educational background'
                        />
                    </div>

                    <div className="space-y-1">
                        <label className='text-sm sm:text-base font-bold text-white block'>Technical Skills</label>
                        <input
                            value={technicalSkills}
                            onChange={(e) => setTechnicalSkills(e.target.value)}
                            required
                            className='outline-none bg-white/10 border border-white/30 text-white text-sm sm:text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15'
                            type="text"
                            placeholder='Programming languages, tools, etc.'
                        />
                    </div>

                    <div className="space-y-1">
                        <label className='text-sm sm:text-base font-bold text-white block'>Soft Skills</label>
                        <input
                            value={softSkills}
                            onChange={(e) => setSoftSkills(e.target.value)}
                            required
                            className='outline-none bg-white/10 border border-white/30 text-white text-sm sm:text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15'
                            type="text"
                            placeholder='Communication, teamwork, etc.'
                        />
                    </div>

                    <div className="space-y-1">
                        <label className='text-sm sm:text-base font-bold text-white block'>Projects</label>
                        <input
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            required
                            className='outline-none bg-white/10 border border-white/30 text-white text-sm sm:text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15'
                            type="text"
                            placeholder='Notable projects you have worked on'
                        />
                    </div>

                    <button
                        className='mt-3 sm:mt-4 bg-white text-red-500 hover:bg-white/90 text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/25 flex justify-center items-center gap-2'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                Get Career Suggestion
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CareerForm;