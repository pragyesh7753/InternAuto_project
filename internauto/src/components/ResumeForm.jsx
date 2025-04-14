import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import ResumePreview from './ResumePreview';

function ResumeForm({ onClose }) {
    const [step, setStep] = useState(1);
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            name: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            address: '',
        },
        education: [{
            institution: '',
            degree: '',
            field: '',
            startDate: '',
            endDate: '',
            gpa: '',
        }],
        experience: [{
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
        }],
        skills: {
            technical: '',
            soft: '',
            languages: '',
        },
        projects: [{
            title: '',
            description: '',
            technologies: '',
            link: '',
        }],
        summary: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [generatedResume, setGeneratedResume] = useState(null);

    const handleChange = (section, field, value, index = null) => {
        setResumeData(prevData => {
            if (index !== null) {
                const newArray = [...prevData[section]];
                newArray[index] = { ...newArray[index], [field]: value };
                return { ...prevData, [section]: newArray };
            } else if (section === 'personalInfo' || section === 'skills') {
                return {
                    ...prevData,
                    [section]: { ...prevData[section], [field]: value }
                };
            } else {
                return { ...prevData, [field]: value };
            }
        });
    };

    const addItem = (section) => {
        setResumeData(prevData => {
            const emptyItem = section === 'education' ? {
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
                gpa: '',
            } : section === 'experience' ? {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
            } : {
                title: '',
                description: '',
                technologies: '',
                link: '',
            };
            
            return { ...prevData, [section]: [...prevData[section], emptyItem] };
        });
    };

    const removeItem = (section, index) => {
        setResumeData(prevData => {
            const newArray = [...prevData[section]];
            newArray.splice(index, 1);
            return { ...prevData, [section]: newArray };
        });
    };

    const validateStep = () => {
        if (step === 1) {
            const { name, email } = resumeData.personalInfo;
            if (!name || !email) {
                toast.error('Please provide at least your name and email');
                return false;
            }
        } else if (step === 2) {
            if (resumeData.education.length === 0) {
                toast.error('Please add at least one educational qualification');
                return false;
            }
            
            // Check if at least the first education entry has required fields
            const firstEducation = resumeData.education[0];
            if (!firstEducation.institution || !firstEducation.degree) {
                toast.error('Please provide institution and degree for your education');
                return false;
            }
        } else if (step === 3) {
            if (!resumeData.skills.technical) {
                toast.error('Please provide at least some technical skills');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(prevStep => prevStep + 1);
        }
    };

    const prevStep = () => {
        setStep(prevStep => prevStep - 1);
    };

    const generateResume = async () => {
        setIsLoading(true);
        try {
            // Simulate API call for now
            setTimeout(() => {
                setGeneratedResume(resumeData);
                setIsLoading(false);
            }, 1500);
            
            // In a real implementation, you'd call the API:
            /*
            const response = await fetch('http://localhost:5000/api/generate_resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resumeData),
            });
            
            const data = await response.json();
            if (data.success) {
                setGeneratedResume(data.resume);
            } else {
                toast.error(data.message || 'Failed to generate resume');
            }
            */
        } catch (error) {
            console.error('Error generating resume:', error);
            toast.error('Failed to generate your resume. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (generatedResume) {
        return (
            <ResumePreview 
                resumeData={generatedResume}
                onBack={() => setGeneratedResume(null)}
            />
        );
    }

    const renderStepContent = () => {
        switch (step) {
            case 1: // Personal Information
                return (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white border-b border-white/30 pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-white text-sm font-medium block mb-1">Full Name*</label>
                                <input
                                    type="text"
                                    value={resumeData.personalInfo.name}
                                    onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium block mb-1">Email*</label>
                                <input
                                    type="email"
                                    value={resumeData.personalInfo.email}
                                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                    placeholder="johndoe@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium block mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={resumeData.personalInfo.phone}
                                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium block mb-1">LinkedIn</label>
                                <input
                                    type="text"
                                    value={resumeData.personalInfo.linkedin}
                                    onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium block mb-1">GitHub</label>
                                <input
                                    type="text"
                                    value={resumeData.personalInfo.github}
                                    onChange={(e) => handleChange('personalInfo', 'github', e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                    placeholder="github.com/johndoe"
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium block mb-1">Address</label>
                                <input
                                    type="text"
                                    value={resumeData.personalInfo.address}
                                    onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                    placeholder="City, State"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-white text-sm font-medium block mb-1">Professional Summary</label>
                            <textarea
                                value={resumeData.summary}
                                onChange={(e) => handleChange(null, 'summary', e.target.value)}
                                className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full min-h-[100px]"
                                placeholder="A brief summary of your professional background and career goals..."
                            />
                        </div>
                    </div>
                );

            case 2: // Education
                return (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/30 pb-2">
                            <h3 className="text-lg font-semibold text-white">Education</h3>
                            <button 
                                type="button" 
                                onClick={() => addItem('education')}
                                className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>

                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="p-3 bg-white/10 rounded-lg relative">
                                {resumeData.education.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeItem('education', index)}
                                        className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Institution*</label>
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => handleChange('education', 'institution', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="University Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Degree*</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleChange('education', 'degree', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Bachelor of Science"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Field of Study</label>
                                        <input
                                            type="text"
                                            value={edu.field}
                                            onChange={(e) => handleChange('education', 'field', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Computer Science"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">GPA</label>
                                        <input
                                            type="text"
                                            value={edu.gpa}
                                            onChange={(e) => handleChange('education', 'gpa', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="3.8/4.0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Start Date</label>
                                        <input
                                            type="text"
                                            value={edu.startDate}
                                            onChange={(e) => handleChange('education', 'startDate', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Aug 2018"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">End Date</label>
                                        <input
                                            type="text"
                                            value={edu.endDate}
                                            onChange={(e) => handleChange('education', 'endDate', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="May 2022 (or 'Present')"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 3: // Skills
                return (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white border-b border-white/30 pb-2">Skills</h3>
                        
                        <div>
                            <label className="text-white text-sm font-medium block mb-1">Technical Skills*</label>
                            <textarea
                                value={resumeData.skills.technical}
                                onChange={(e) => handleChange('skills', 'technical', e.target.value)}
                                className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full min-h-[80px]"
                                placeholder="JavaScript, React, Node.js, Python, Git, SQL..."
                                required
                            />
                            <p className="text-white/60 text-xs mt-1">Separate with commas</p>
                        </div>
                        
                        <div>
                            <label className="text-white text-sm font-medium block mb-1">Soft Skills</label>
                            <textarea
                                value={resumeData.skills.soft}
                                onChange={(e) => handleChange('skills', 'soft', e.target.value)}
                                className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full min-h-[80px]"
                                placeholder="Communication, Leadership, Problem Solving, Teamwork..."
                            />
                            <p className="text-white/60 text-xs mt-1">Separate with commas</p>
                        </div>
                        
                        <div>
                            <label className="text-white text-sm font-medium block mb-1">Languages</label>
                            <textarea
                                value={resumeData.skills.languages}
                                onChange={(e) => handleChange('skills', 'languages', e.target.value)}
                                className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                placeholder="English (Native), Spanish (Intermediate), French (Basic)..."
                            />
                        </div>
                    </div>
                );

            case 4: // Experience
                return (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/30 pb-2">
                            <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                            <button 
                                type="button" 
                                onClick={() => addItem('experience')}
                                className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>

                        {resumeData.experience.map((exp, index) => (
                            <div key={index} className="p-3 bg-white/10 rounded-lg relative">
                                <button 
                                    type="button"
                                    onClick={() => removeItem('experience', index)}
                                    className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors"
                                >
                                    <FaTrash size={14} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleChange('experience', 'company', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Position</label>
                                        <input
                                            type="text"
                                            value={exp.position}
                                            onChange={(e) => handleChange('experience', 'position', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Software Developer"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Start Date</label>
                                        <input
                                            type="text"
                                            value={exp.startDate}
                                            onChange={(e) => handleChange('experience', 'startDate', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Jun 2022"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">End Date</label>
                                        <input
                                            type="text"
                                            value={exp.endDate}
                                            onChange={(e) => handleChange('experience', 'endDate', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="Present"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-white text-sm font-medium block mb-1">Description</label>
                                        <textarea
                                            value={exp.description}
                                            onChange={(e) => handleChange('experience', 'description', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full min-h-[100px]"
                                            placeholder="• Developed and maintained web applications using React.js and Node.js
• Implemented RESTful APIs for data retrieval and storage
• Collaborated with cross-functional teams to deliver products on schedule"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 5: // Projects
                return (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/30 pb-2">
                            <h3 className="text-lg font-semibold text-white">Projects</h3>
                            <button 
                                type="button" 
                                onClick={() => addItem('projects')}
                                className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
                            >
                                <FaPlus size={14} />
                            </button>
                        </div>

                        {resumeData.projects.map((project, index) => (
                            <div key={index} className="p-3 bg-white/10 rounded-lg relative">
                                <button 
                                    type="button"
                                    onClick={() => removeItem('projects', index)}
                                    className="absolute top-2 right-2 text-red-300 hover:text-red-500 transition-colors"
                                >
                                    <FaTrash size={14} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Project Title</label>
                                        <input
                                            type="text"
                                            value={project.title}
                                            onChange={(e) => handleChange('projects', 'title', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="E-commerce Website"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Technologies Used</label>
                                        <input
                                            type="text"
                                            value={project.technologies}
                                            onChange={(e) => handleChange('projects', 'technologies', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="React, Node.js, MongoDB"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-white text-sm font-medium block mb-1">Description</label>
                                        <textarea
                                            value={project.description}
                                            onChange={(e) => handleChange('projects', 'description', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full min-h-[80px]"
                                            placeholder="A brief description of the project, your role, and key features..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white text-sm font-medium block mb-1">Project Link</label>
                                        <input
                                            type="text"
                                            value={project.link}
                                            onChange={(e) => handleChange('projects', 'link', e.target.value, index)}
                                            className="outline-none bg-white/10 border border-white/30 text-white text-sm py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full"
                                            placeholder="https://github.com/username/project"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Personal Information";
            case 2: return "Education";
            case 3: return "Skills";
            case 4: return "Work Experience";
            case 5: return "Projects";
            default: return "";
        }
    };

    return (
        <div className="bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-6 w-[800px] max-h-[80vh] max-w-[95vw] relative shadow-2xl border border-white/20 animate-fadeIn flex flex-col">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:scale-110 text-2xl transition-all duration-300 z-10"
            >
                ×
            </button>
            <div className="text-center mb-6">
                <div className="inline-block p-2 rounded-full bg-white/20 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Resume Builder</h2>
                <p className="text-white/80 text-sm mt-1">
                    Step {step} of 5: {getStepTitle()}
                </p>
            </div>

            <div className="flex justify-between mb-6">
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(stepNumber => (
                        <div 
                            key={stepNumber} 
                            className={`h-2 w-8 rounded-full ${
                                stepNumber === step ? 'bg-white' : 
                                stepNumber < step ? 'bg-white/70' : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar">
                {renderStepContent()}
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-white/30">
                {step > 1 ? (
                    <button 
                        type="button"
                        onClick={prevStep}
                        className="bg-white/20 text-white hover:bg-white/30 text-base py-2 px-6 rounded-lg font-semibold transition-all duration-300"
                    >
                        Previous
                    </button>
                ) : (
                    <div></div>
                )}

                {step < 5 ? (
                    <button 
                        type="button"
                        onClick={nextStep}
                        className="bg-white text-red-500 hover:bg-white/90 text-base py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/25"
                    >
                        Next
                    </button>
                ) : (
                    <button 
                        type="button"
                        onClick={generateResume}
                        className="bg-white text-red-500 hover:bg-white/90 text-base py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/25 flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>Generate Resume</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ResumeForm;
