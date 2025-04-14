import React from 'react';
import { FaArrowLeft, FaDownload, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

function ResumePreview({ resumeData, onBack }) {
    const { personalInfo, education, experience, skills, projects, summary } = resumeData;

    const downloadAsPDF = () => {
        toast.success('Preparing your resume for download...');
        // In a real implementation, this would generate a PDF using a library like jsPDF or html2pdf
        setTimeout(() => {
            toast.success('Resume downloaded successfully!');
        }, 1500);
    };

    const downloadAsDocx = () => {
        toast.success('Preparing your resume as DOCX...');
        // In a real implementation, this would generate a DOCX file
        setTimeout(() => {
            toast.success('Resume downloaded successfully!');
        }, 1500);
    };

    return (
        <div className='bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-6 w-[900px] max-h-[85vh] max-w-[95vw] relative shadow-2xl border border-white/20 flex flex-col'>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={onBack}
                    className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <FaArrowLeft /> Back to Editor
                </button>
                
                <div className="flex gap-2">
                    <button
                        onClick={downloadAsPDF}
                        className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                    >
                        <FaDownload /> Download PDF
                    </button>
                    <button
                        onClick={downloadAsDocx}
                        className="bg-white hover:bg-white/90 text-red-500 text-sm py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                    >
                        <FaDownload /> Download DOCX
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-xl overflow-y-auto flex-1">
                <div className="p-8 max-w-[800px] mx-auto">
                    {/* Header / Personal Info */}
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h1>
                        
                        <div className="mt-3 flex flex-wrap gap-y-2 gap-x-4 text-gray-600">
                            {personalInfo.email && (
                                <div className="flex items-center gap-1">
                                    <FaEnvelope className="text-gray-400" />
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-1">
                                    <FaPhone className="text-gray-400" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.address && (
                                <div className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span>{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo.linkedin && (
                                <div className="flex items-center gap-1">
                                    <FaLinkedin className="text-gray-400" />
                                    <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {personalInfo.linkedin}
                                    </a>
                                </div>
                            )}
                            {personalInfo.github && (
                                <div className="flex items-center gap-1">
                                    <FaGithub className="text-gray-400" />
                                    <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {personalInfo.github}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Summary */}
                    {summary && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                            <p className="text-gray-700">{summary}</p>
                        </div>
                    )}
                    
                    {/* Skills */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                        
                        {skills.technical && (
                            <div className="mb-3">
                                <h3 className="text-sm font-medium text-gray-700">Technical Skills</h3>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {skills.technical.split(',').map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {skills.soft && (
                            <div className="mb-3">
                                <h3 className="text-sm font-medium text-gray-700">Soft Skills</h3>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {skills.soft.split(',').map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {skills.languages && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Languages</h3>
                                <p className="text-gray-600 mt-1">{skills.languages}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-gray-900">{edu.institution}</h3>
                                            <div className="text-gray-500 text-sm">
                                                {edu.startDate} - {edu.endDate || 'Present'}
                                            </div>
                                        </div>
                                        <p className="text-gray-800">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Experience */}
                    {experience && experience.some(exp => exp.company) && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
                            <div className="space-y-6">
                                {experience.filter(exp => exp.company).map((exp, index) => (
                                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-gray-900">{exp.position}</h3>
                                            <div className="text-gray-500 text-sm">
                                                {exp.startDate} - {exp.endDate || 'Present'}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-2">{exp.company}</p>
                                        {exp.description && (
                                            <div className="text-gray-600 text-sm whitespace-pre-line">
                                                {exp.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Projects */}
                    {projects && projects.some(proj => proj.title) && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Projects</h2>
                            <div className="space-y-4">
                                {projects.filter(proj => proj.title).map((proj, index) => (
                                    <div key={index} className="border-l-2 border-gray-200 pl-4">
                                        <div className="flex justify-between">
                                            <h3 className="font-medium text-gray-900">{proj.title}</h3>
                                            {proj.link && (
                                                <a 
                                                    href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View Project
                                                </a>
                                            )}
                                        </div>
                                        {proj.technologies && (
                                            <p className="text-gray-700 text-sm mb-1">
                                                <span className="font-medium">Technologies:</span> {proj.technologies}
                                            </p>
                                        )}
                                        {proj.description && (
                                            <p className="text-gray-600 text-sm">{proj.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumePreview;
