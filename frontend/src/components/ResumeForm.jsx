import React, { useState, useRef } from 'react';
import { FaFilePdf, FaFileWord, FaDownload, FaCopy, FaArrowRight, FaArrowLeft, FaEye, FaPlus, FaTrash, FaFileAlt, FaAlignLeft, FaGithub, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// New component for education entries
const EducationEntrySection = ({ entries, setEntries, isRequired = false }) => {
    const addEntry = () => {
        setEntries([...entries, {
            degree: '',
            institution: '',
            from: '',
            to: ''
        }]);
    };

    const updateEntry = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index] = {
            ...newEntries[index],
            [field]: value
        };
        setEntries(newEntries);
    };

    const removeEntry = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
    };

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => (
                <div key={index} className="bg-white/5 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">Education #{index + 1}</h4>
                        <button 
                            type="button" 
                            onClick={() => removeEntry(index)}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                            disabled={isRequired && entries.length === 1 && index === 0}
                        >
                            <FaTrash />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <input
                                value={entry.degree}
                                onChange={(e) => updateEntry(index, 'degree', e.target.value)}
                                required={isRequired && index === 0}
                                className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                type="text"
                                placeholder="Degree (e.g., Bachelor of Science)"
                            />
                        </div>
                        <div>
                            <input
                                value={entry.institution}
                                onChange={(e) => updateEntry(index, 'institution', e.target.value)}
                                required={isRequired && index === 0}
                                className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                type="text"
                                placeholder="School/University"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <input
                                value={entry.from}
                                onChange={(e) => updateEntry(index, 'from', e.target.value)}
                                required={isRequired && index === 0}
                                className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                type="text"
                                placeholder="From (Year)"
                            />
                        </div>
                        <div>
                            <input
                                value={entry.to}
                                onChange={(e) => updateEntry(index, 'to', e.target.value)}
                                required={isRequired && index === 0}
                                className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                type="text"
                                placeholder="To (Year or Present)"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-all w-full justify-center"
            >
                <FaPlus /> Add Education
            </button>
        </div>
    );
};

// New component for project entries
const ProjectEntrySection = ({ entries, setEntries, isRequired = false }) => {
    const addEntry = () => {
        setEntries([...entries, {
            title: '',
            summary: '',
            liveLink: '',
            githubLink: ''
        }]);
    };

    const updateEntry = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index] = {
            ...newEntries[index],
            [field]: value
        };
        setEntries(newEntries);
    };

    const removeEntry = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
    };

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => (
                <div key={index} className="bg-white/5 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">Project #{index + 1}</h4>
                        <button 
                            type="button" 
                            onClick={() => removeEntry(index)}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                            disabled={isRequired && entries.length === 1 && index === 0}
                        >
                            <FaTrash />
                        </button>
                    </div>
                    
                    <div>
                        <input
                            value={entry.title}
                            onChange={(e) => updateEntry(index, 'title', e.target.value)}
                            required={isRequired && index === 0}
                            className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                            type="text"
                            placeholder="Project Title"
                        />
                    </div>
                    
                    <div>
                        <textarea
                            value={entry.summary}
                            onChange={(e) => updateEntry(index, 'summary', e.target.value)}
                            required={isRequired && index === 0}
                            rows={3}
                            className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15 resize-none"
                            placeholder="Project summary (use bullet points with - or •)"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaLink className="text-white/60" />
                            </div>
                            <input
                                value={entry.liveLink}
                                onChange={(e) => updateEntry(index, 'liveLink', e.target.value)}
                                className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 pl-10 pr-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                type="text"
                                placeholder="Live Demo URL (Optional)"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaGithub className="text-white/60" />
                            </div>
                            <input
                                value={entry.githubLink}
                                onChange={(e) => updateEntry(index, 'githubLink', e.target.value)}
                                className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 pl-10 pr-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                type="text"
                                placeholder="GitHub Repository (Optional)"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-all w-full justify-center"
            >
                <FaPlus /> Add Project
            </button>
        </div>
    );
};

// New helper component for multiple entries
const MultiEntrySection = ({ entries, setEntries, fieldName, placeholder, isRequired = false }) => {
    const addEntry = () => {
        setEntries([...entries, '']);
    };

    const updateEntry = (index, value) => {
        const newEntries = [...entries];
        newEntries[index] = value;
        setEntries(newEntries);
    };

    const removeEntry = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
    };

    return (
        <div className="space-y-2">
            {entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <textarea
                        value={entry}
                        onChange={(e) => updateEntry(index, e.target.value)}
                        required={isRequired && index === 0}
                        rows={2}
                        className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all flex-1 hover:bg-white/15 resize-none"
                        placeholder={placeholder}
                    />
                    <button 
                        type="button" 
                        onClick={() => removeEntry(index)}
                        className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                        disabled={isRequired && entries.length === 1 && index === 0} // Don't allow removing if it's required and it's the only entry
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addEntry}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-all w-full justify-center"
            >
                <FaPlus /> Add {fieldName}
            </button>
        </div>
    );
};

function ResumeForm({ onClose }) {
    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [address, setAddress] = useState("");
    const [professionalSummary, setProfessionalSummary] = useState("");
    const [educationEntries, setEducationEntries] = useState([{
        degree: '',
        institution: '',
        from: '',
        to: ''
    }]);
    const [experienceEntries, setExperienceEntries] = useState([]);
    const [skillsEntries, setSkillsEntries] = useState(['']);
    const [projectEntries, setProjectEntries] = useState([{
        title: '',
        summary: '',
        liveLink: '',
        githubLink: ''
    }]);
    const [certifications, setCertifications] = useState("");
    const [achievements, setAchievements] = useState("");
    
    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [resumeText, setResumeText] = useState("");
    const [resumeId, setResumeId] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [isPreview, setIsPreview] = useState(false);
    const [isFinalPreview, setIsFinalPreview] = useState(false);
    const [viewMode, setViewMode] = useState('text'); // 'text' or 'document'

    const documentRef = useRef(null);

    const totalSteps = 4;

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const togglePreview = () => {
        setIsPreview(!isPreview);
    };

    const showFinalPreview = () => {
        setIsFinalPreview(true);
    };

    const hideFinalPreview = () => {
        setIsFinalPreview(false);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'text' ? 'document' : 'text');
    };

    const formatResumeText = () => {
        // Format contact header
        let resumeText = `${name}\n`;
        resumeText += `${email} | ${phone}\n`;
        
        // Add LinkedIn, GitHub, and Address if provided
        const contactDetails = [];
        if (linkedin) contactDetails.push(linkedin);
        if (github) contactDetails.push(github);
        if (address) contactDetails.push(address);
        
        if (contactDetails.length > 0) {
            resumeText += `${contactDetails.join(' | ')}\n`;
        }
        
        // Add professional summary
        resumeText += "\nPROFESSIONAL SUMMARY\n";
        if (professionalSummary.trim()) {
            resumeText += professionalSummary + "\n";
        } else {
            // Use default generated summary if user didn't provide one
            resumeText += "A dedicated professional with expertise in " + 
                         skillsEntries.filter(s => s.trim()).slice(0, 3).join(", ") + 
                         ". Committed to delivering high-quality results and continuous improvement.\n";
        }
        
        // Add education
        resumeText += "\nEDUCATION\n";
        educationEntries
            .filter(entry => entry.degree.trim() && entry.institution.trim())
            .forEach(entry => {
                // Update format to place years with the degree
                resumeText += `• ${entry.degree} (${entry.from} - ${entry.to})\n`;
                resumeText += `  ${entry.institution}\n`;
                resumeText += "\n";
            });
        
        // Add skills - updated to categorize skills
        resumeText += "SKILLS\n";
        
        // Use the same categorization function as in renderPreview
        const { technicalSkills, softSkills } = categorizeSkills(skillsEntries.filter(entry => entry.trim()));
        
        // Add technical skills
        if (technicalSkills.length > 0) {
            resumeText += "Technical Skills:\n";
            technicalSkills.forEach(skill => {
                resumeText += `• ${skill.trim().startsWith('•') ? skill.trim().substring(1).trim() : skill.trim()}\n`;
            });
        }
        
        // Add soft skills
        if (softSkills.length > 0) {
            resumeText += "\nSoft Skills:\n";
            softSkills.forEach(skill => {
                resumeText += `• ${skill.trim().startsWith('•') ? skill.trim().substring(1).trim() : skill.trim()}\n`;
            });
        }
        
        resumeText += "\n";
        
        // Add experience if provided
        if (experienceEntries.some(entry => entry.trim())) {
            resumeText += "EXPERIENCE\n";
            experienceEntries
                .filter(entry => entry.trim())
                .forEach(entry => {
                    resumeText += `• ${entry.trim().startsWith('•') ? entry.trim().substring(1).trim() : entry.trim()}\n`;
                });
            resumeText += "\n";
        }
        
        // Add projects in structured format
        resumeText += "PROJECTS\n";
        projectEntries
            .filter(entry => entry.title.trim())
            .forEach(entry => {
                resumeText += `• ${entry.title.trim()}\n`;
                
                // Add summary bullets
                if (entry.summary.trim()) {
                    const summaryLines = entry.summary.split('\n')
                        .filter(line => line.trim())
                        .map(line => {
                            line = line.trim();
                            if (line.startsWith('-') || line.startsWith('•')) return line;
                            return `  - ${line}`;
                        });
                    
                    summaryLines.forEach(line => {
                        resumeText += `  ${line}\n`;
                    });
                }
                
                // Add links if provided
                if (entry.liveLink.trim() || entry.githubLink.trim()) {
                    resumeText += '  Links: ';
                    const links = [];
                    if (entry.liveLink.trim()) links.push(`Live Demo: ${entry.liveLink.trim()}`);
                    if (entry.githubLink.trim()) links.push(`GitHub: ${entry.githubLink.trim()}`);
                    resumeText += links.join(' | ') + '\n';
                }
                
                resumeText += "\n";
            });
        
        // Add certifications if provided
        if (certifications) {
            resumeText += "CERTIFICATIONS\n";
            certifications.split('\n')
                .filter(line => line.trim())
                .forEach(line => {
                    resumeText += `• ${line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}\n`;
                });
            resumeText += "\n";
        }
        
        // Add achievements if provided
        if (achievements) {
            resumeText += "ACHIEVEMENTS\n";
            achievements.split('\n')
                .filter(line => line.trim())
                .forEach(line => {
                    resumeText += `• ${line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}\n`;
                });
        }
        
        return resumeText;
    };

    // Helper function to categorize skills - extracted to be used by both formatResumeText and renderPreview
    const categorizeSkills = (skills) => {
        const technicalSkills = [];
        const softSkills = [];
        
        skills.forEach(skill => {
            if (!skill.trim()) return;
            
            // Common technical skill keywords
            const technicalKeywords = [
                'programming', 'language', 'framework', 'database', 'sql', 'nosql',
                'python', 'javascript', 'java', 'c#', 'c++', 'ruby', 'swift', 'kotlin',
                'react', 'angular', 'vue', 'node', 'express', 'django', 'spring', 'rails',
                'aws', 'azure', 'cloud', 'docker', 'kubernetes', 'devops', 'ci/cd',
                'git', 'github', 'gitlab', 'bitbucket', 'version control', 'frontend', 'backend',
                'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'responsive',
                'api', 'rest', 'graphql', 'grpc', 'microservices', 'architecture',
                'algorithm', 'data structure', 'design pattern', 'oop', 'functional',
                'testing', 'unit test', 'integration test', 'qa', 'agile', 'scrum', 'kanban',
                'linux', 'unix', 'windows', 'macos', 'operating system', 'bash', 'shell',
                'mobile', 'android', 'ios', 'cross-platform', 'flutter', 'react native',
                'machine learning', 'ml', 'ai', 'artificial intelligence', 'data science',
                'analytics', 'visualization', 'statistics', 'math', 'algorithm'
            ];
            
            // Common soft skill keywords
            const softKeywords = [
                'communication', 'teamwork', 'leadership', 'problem solving',
                'critical thinking', 'creativity', 'time management', 'organization',
                'adaptability', 'flexibility', 'interpersonal', 'collaboration',
                'decision making', 'conflict resolution', 'emotional intelligence',
                'empathy', 'negotiation', 'persuasion', 'presentation', 'public speaking',
                'writing', 'listening', 'feedback', 'mentoring', 'coaching',
                'customer service', 'attention to detail', 'multitasking', 'prioritization',
                'stress management', 'work ethic', 'integrity', 'professionalism',
                'initiative', 'motivation', 'dedication', 'cultural awareness',
                'diversity', 'inclusion', 'project management', 'planning', 'strategic thinking'
            ];
            
            const skillLower = skill.toLowerCase();
            
            // Check if the skill contains any technical or soft keywords
            const isTechnical = technicalKeywords.some(keyword => 
                skillLower.includes(keyword.toLowerCase())
            );
            
            const isSoft = softKeywords.some(keyword => 
                skillLower.includes(keyword.toLowerCase())
            );
            
            // Categorize the skill
            if (isTechnical || !isSoft) {
                technicalSkills.push(skill);
            } else {
                softSkills.push(skill);
            }
        });
        
        return { technicalSkills, softSkills };
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!isFinalPreview) {
            showFinalPreview();
            return;
        }
        
        setIsLoading(true);
        try {
            // Generate resume directly in the frontend
            const generatedResumeText = formatResumeText();
            
            // Generate a unique ID for this resume
            const uniqueId = Date.now().toString();
            setResumeId(uniqueId);
            
            // Set the generated text
            setResumeText(generatedResumeText);
            
            toast.success('Resume generated successfully!');
        } catch (error) {
            console.error('Error generating resume:', error);
            toast.error('Failed to generate resume. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(resumeText);
        toast.success('Resume copied to clipboard!');
    };

    const downloadPdf = async () => {
        try {
            const pdf = new jsPDF();
            
            // Set font sizes and styles
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(18);
            
            // Add header (name, contact info)
            const sections = parseResumeText(resumeText);
            if (sections.header) {
                pdf.text(sections.header.name, 105, 20, { align: 'center' });
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.text(sections.header.contact, 105, 30, { align: 'center' });
                if (sections.header.additionalContact) {
                    pdf.text(sections.header.additionalContact, 105, 35, { align: 'center' });
                }
            }
            
            // Set position for content
            let yPosition = 45;
            
            // Add content sections
            pdf.setFontSize(12);
            Object.entries(sections.content).forEach(([title, content]) => {
                // Add section title
                pdf.setFont('helvetica', 'bold');
                pdf.text(title, 20, yPosition);
                
                // Add line under section title
                pdf.setLineWidth(0.5);
                pdf.line(20, yPosition + 1, 190, yPosition + 1);
                
                yPosition += 10;
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                
                // Add content
                content.forEach(item => {
                    const lines = pdf.splitTextToSize(item, 170);
                    lines.forEach(line => {
                        pdf.text(line, 20, yPosition);
                        yPosition += 5;
                    });
                    yPosition += 2;
                });
                
                yPosition += 5;
            });
            
            // Save the PDF
            pdf.save(`resume_${name.replace(/\s+/g, '_')}.pdf`);
            toast.success('Resume downloaded as PDF!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    const downloadDocx = async () => {
        try {
            // Parse the resume text into sections
            const sections = parseResumeText(resumeText);
            const docChildren = [];

            // Header
            if (sections.header) {
                docChildren.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: sections.header.name, bold: true, size: 36 }),
                        ],
                        alignment: 'center',
                        spacing: { after: 100 },
                    })
                );
                docChildren.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: sections.header.contact, size: 20 })
                        ],
                        alignment: 'center',
                    })
                );
                if (sections.header.additionalContact) {
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: sections.header.additionalContact, size: 20 })
                            ],
                            alignment: 'center',
                        })
                    );
                }
                docChildren.push(new Paragraph({}));
            }

            // Content sections
            Object.entries(sections.content).forEach(([title, content]) => {
                docChildren.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: title, bold: true, size: 28, underline: {} })
                        ],
                        spacing: { after: 80 },
                    })
                );
                content.forEach(item => {
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({ text: item, size: 22 })
                            ],
                            bullet: { level: 0 },
                        })
                    );
                });
                docChildren.push(new Paragraph({}));
            });

            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: docChildren,
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            saveAs(blob, `resume_${name.replace(/\s+/g, '_')}.docx`);
            toast.success('Resume downloaded as DOCX!');
        } catch (error) {
            console.error('Error generating DOCX:', error);
            toast.error('Failed to generate DOCX. Please try again.');
        }
    };

    // Validation for current step
    const validateStep = () => {
        switch (currentStep) {
            case 1:
                return name.trim() && email.trim() && phone.trim();
            case 2:
                // Check that at least one education entry has the required fields
                return educationEntries.some(entry => 
                    entry.degree.trim() && entry.institution.trim() && entry.from.trim() && entry.to.trim()
                ) && skillsEntries.some(skill => skill.trim());
            case 3:
                // Make sure at least one project is filled out
                return projectEntries.some(entry => entry.title.trim() && entry.summary.trim());
            case 4:
                return true; // Additional info is optional
            default:
                return false;
        }
    };

    // New function to check if all required fields are filled across all steps
    const isFormComplete = () => {
        // Personal info (step 1)
        if (!name.trim() || !email.trim() || !phone.trim()) return false;
        
        // Education & Skills (step 2)
        const hasValidEducation = educationEntries.some(entry => 
            entry.degree.trim() && entry.institution.trim() && entry.from.trim() && entry.to.trim()
        );
        if (!hasValidEducation || !skillsEntries.some(skill => skill.trim())) return false;
        
        // At least one project (step 3) with title and summary
        if (!projectEntries.some(entry => entry.title.trim() && entry.summary.trim())) return false;
        
        return true;
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex justify-between mb-6 relative">
                <div className="absolute top-1/2 h-1 bg-white/30 w-full -translate-y-1/2 z-0"></div>
                {[1, 2, 3, 4].map(step => (
                    <div 
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                            ${currentStep >= step ? 'bg-white text-red-500' : 'bg-white/30 text-white'}`}
                    >
                        {step}
                    </div>
                ))}
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Full Name *</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                    type="text"
                                    placeholder="Enter your Full Name Here"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Email *</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                    type="email"
                                    placeholder="abc@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Phone *</label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                    type="tel"
                                    placeholder="1234567890"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Professional Summary</label>
                                <textarea
                                    value={professionalSummary}
                                    onChange={(e) => setProfessionalSummary(e.target.value)}
                                    rows={3}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15 resize-none"
                                    placeholder="A brief overview of your professional background, skills, and career goals."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">LinkedIn</label>
                                <input
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                    type="text"
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">GitHub</label>
                                <input
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                    type="text"
                                    placeholder="github.com/johndoe"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Address</label>
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15"
                                    type="text"
                                    placeholder="City, State"
                                />
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3 className="text-xl font-bold text-white mb-4">Education & Skills</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Education *</label>
                                <EducationEntrySection 
                                    entries={educationEntries} 
                                    setEntries={setEducationEntries}
                                    isRequired={true}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Skills *</label>
                                <MultiEntrySection 
                                    entries={skillsEntries} 
                                    setEntries={setSkillsEntries}
                                    fieldName="Skill"
                                    placeholder="Add individual skills or skill categories (e.g., Programming Languages: JavaScript, Python, Java)"
                                    isRequired={true}
                                />
                            </div>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h3 className="text-xl font-bold text-white mb-4">Experience & Projects</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">
                                    Work Experience <span className="text-white/60 text-sm font-normal">(Optional)</span>
                                </label>
                                {experienceEntries.length === 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setExperienceEntries([''])}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg transition-all w-full justify-center"
                                    >
                                        <FaPlus /> Add Work Experience
                                    </button>
                                ) : (
                                    <MultiEntrySection 
                                        entries={experienceEntries} 
                                        setEntries={setExperienceEntries}
                                        fieldName="Experience"
                                        placeholder="Job Title, Company Name, Dates, Description (e.g., Software Engineer, Company Name, Jan 2022 - Present, Developed web applications)"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Projects *</label>
                                <ProjectEntrySection 
                                    entries={projectEntries} 
                                    setEntries={setProjectEntries}
                                    isRequired={true}
                                />
                            </div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h3 className="text-xl font-bold text-white mb-4">Additional Information</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Certifications</label>
                                <textarea
                                    value={certifications}
                                    onChange={(e) => setCertifications(e.target.value)}
                                    rows={3}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15 resize-none"
                                    placeholder="AWS Certified Developer - Associate, 2023
Google Professional Cloud Developer, 2022"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-base font-bold text-white">Achievements</label>
                                <textarea
                                    value={achievements}
                                    onChange={(e) => setAchievements(e.target.value)}
                                    rows={3}
                                    className="outline-none bg-white/10 border border-white/30 text-white text-base py-2 px-3 rounded-lg placeholder:text-white/60 focus:bg-white/20 transition-all w-full hover:bg-white/15 resize-none"
                                    placeholder="- Increased site performance by 40%
- Won hackathon award for best UI/UX"
                                />
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const renderPreview = () => {
        // Helper functions for bullets and project summary formatting
        const formatWithBullets = (text) => {
            return text.split('\n').map(line => {
                if (line.trim().length === 0) return line;
                return `• ${line.trim()}`;
            });
        };

        const formatProjectSummary = (summary) => {
            return summary.split('\n').map(line => {
                if (line.trim().length === 0) return line;
                return `  - ${line.trim()}`;
            });
        };

        // Use the shared categorizeSkills function
        const { technicalSkills, softSkills } = categorizeSkills(skillsEntries);
        
        return (
            <div className="space-y-5 text-white">
                <h3 className="text-xl font-bold border-b border-white/30 pb-2">Resume Preview</h3>
                
                {/* Header Section */}
                <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                    <h4 className="text-2xl font-bold text-center tracking-wide">{name || "Your Name"}</h4>
                    <p className="text-center mt-2">{email || "email@example.com"} • {phone || "123-456-7890"}</p>
                    
                    <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-white/90">
                        {linkedin && <span className="flex items-center gap-1"><FaGithub className="text-xs" /> {linkedin}</span>}
                        {github && <span className="flex items-center gap-1"><FaGithub className="text-xs" /> {github}</span>}
                        {address && <span>{address}</span>}
                    </div>
                </div>
                
                {/* Professional Summary */}
                <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                    <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">PROFESSIONAL SUMMARY</h4>
                    {professionalSummary ? (
                        <p className="leading-relaxed">{professionalSummary}</p>
                    ) : (
                        <p className="italic text-white/70 leading-relaxed">A professional summary will be generated based on your skills and experience.</p>
                    )}
                </div>
                
                {/* Education Section */}
                {educationEntries.some(entry => entry.degree.trim() || entry.institution.trim()) && (
                    <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                        <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">EDUCATION</h4>
                        <div className="space-y-4">
                            {educationEntries
                                .filter(entry => entry.degree.trim() && entry.institution.trim())
                                .map((entry, index) => (
                                <div key={index} className="mb-2">
                                    <div className="flex justify-between">
                                        <div className="flex">
                                            <span className="text-white/90 mr-2">•</span>
                                            <p className="font-bold">{entry.degree}</p>
                                        </div>
                                        <p className="text-white/90">{entry.from} - {entry.to}</p>
                                    </div>
                                    <p className="ml-6">{entry.institution}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Skills Section - Updated to separate Technical and Soft Skills */}
                {skillsEntries.some(entry => entry.trim()) && (
                    <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                        <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">SKILLS</h4>
                        
                        {technicalSkills.length > 0 && (
                            <div className="mb-4">
                                <h5 className="text-base font-semibold text-white/90 mb-2 ml-1">Technical Skills</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                                    {technicalSkills.map((entry, index) => (
                                        <div key={index} className="flex">
                                            <span className="text-white/90 mr-2 min-w-[12px]">•</span>
                                            <span>{entry.trim().startsWith('•') ? entry.trim().substring(1).trim() : entry.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {softSkills.length > 0 && (
                            <div>
                                <h5 className="text-base font-semibold text-white/90 mb-2 ml-1">Soft Skills</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                                    {softSkills.map((entry, index) => (
                                        <div key={index} className="flex">
                                            <span className="text-white/90 mr-2 min-w-[12px]">•</span>
                                            <span>{entry.trim().startsWith('•') ? entry.trim().substring(1).trim() : entry.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Experience Section */}
                {experienceEntries.some(entry => entry.trim()) && (
                    <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                        <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">EXPERIENCE</h4>
                        <div className="space-y-2">
                            {experienceEntries.map((entry, index) => (
                                entry.trim() && (
                                    <div key={index} className="flex">
                                        <span className="text-white/90 mr-2 min-w-[12px]">•</span>
                                        <span className="flex-1">{entry.trim().startsWith('•') ? entry.trim().substring(1).trim() : entry.trim()}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Projects Section */}
                {projectEntries.some(entry => entry.title.trim()) && (
                    <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                        <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">PROJECTS</h4>
                        <div className="space-y-4">
                            {projectEntries
                                .filter(entry => entry.title.trim())
                                .map((entry, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="flex">
                                            <span className="text-white/90 mr-2 min-w-[12px]">•</span>
                                            <p className="font-bold">{entry.title}</p>
                                        </div>
                                        
                                        {/* Summary with bullet points */}
                                        {entry.summary.trim() && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {formatProjectSummary(entry.summary).map((line, idx) => (
                                                    <div key={idx} className="flex text-white/90">
                                                        <span className="mr-2 min-w-[12px]">{line.startsWith('-') ? '-' : '•'}</span>
                                                        <span className="flex-1">{line.startsWith('-') || line.startsWith('•') ? 
                                                            line.substring(1).trim() : line}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Links - Better organized */}
                                        {(entry.liveLink || entry.githubLink) && (
                                            <div className="ml-6 mt-1 text-sm text-white/80 flex flex-wrap gap-4">
                                                {entry.liveLink && (
                                                    <span className="flex items-center gap-1">
                                                        <FaLink className="text-xs" /> {entry.liveLink}
                                                    </span>
                                                )}
                                                {entry.githubLink && (
                                                    <span className="flex items-center gap-1">
                                                        <FaGithub className="text-xs" /> {entry.githubLink}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
                
                {/* Certifications Section */}
                {certifications && (
                    <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                        <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">CERTIFICATIONS</h4>
                        <div className="space-y-2">
                            {formatWithBullets(certifications).map((line, idx) => (
                                <div key={idx} className="flex">
                                    <span className="text-white/90 mr-2 min-w-[12px]">•</span>
                                    <span>{line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Achievements Section */}
                {achievements && (
                    <div className="bg-white/5 p-5 rounded-lg shadow-inner">
                        <h4 className="text-lg font-bold border-b border-white/30 pb-2 mb-3">ACHIEVEMENTS</h4>
                        <div className="space-y-2">
                            {formatWithBullets(achievements).map((line, idx) => (
                                <div key={idx} className="flex">
                                    <span className="text-white/90 mr-2 min-w-[12px]">•</span>
                                    <span className="flex-1">{line.trim().startsWith('•') ? line.trim().substring(1).trim() : line.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderStepButtons = () => {
        const isLastStep = currentStep === totalSteps;
        const isFirstStep = currentStep === 1;
        const formComplete = isFormComplete();

        // Handle final preview buttons
        if (isFinalPreview) {
            return (
                <div className="flex gap-3 justify-between mt-6">
                    <button
                        type="button"
                        onClick={hideFinalPreview}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <FaArrowLeft /> Back to Form
                    </button>
                    
                    <button
                        type="submit"
                        className="flex-1 bg-white text-red-500 hover:bg-white/90 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <FaDownload /> Confirm & Generate
                            </>
                        )}
                    </button>
                </div>
            );
        }

        return (
            <div className="flex gap-3 justify-between mt-6">
                {!isFirstStep && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <FaArrowLeft /> Previous
                    </button>
                )
                }
                
                {/* Only show Preview button if the form is complete */}
                {formComplete && (
                    <button
                        type="button"
                        onClick={togglePreview}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <FaEye /> {isPreview ? "Edit Form" : "Preview"}
                    </button>
                )}
                
                {!isLastStep ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-white text-red-500 hover:bg-white/90 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold"
                        disabled={!validateStep()}
                    >
                        Next <FaArrowRight />
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="flex-1 bg-white text-red-500 hover:bg-white/90 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold"
                    >
                        <FaEye /> Preview Resume
                    </button>
                )}
            </div>
        );
    };

    const DocumentView = ({ resumeText }) => {
        const sections = parseResumeText(resumeText);
        
        return (
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-inner h-full overflow-y-auto">
                {Object.entries(sections.content).map(([title, content], index) => (
                    <div key={index} className="mb-5">
                        <h2 className="text-lg font-bold text-gray-900 uppercase mb-2 pb-1 border-b border-gray-300">
                            {title}
                        </h2>
                        
                        <div className="pl-2">
                            {content.map((item, i) => (
                                <div key={i} className="mb-2">
                                    {item.trim().startsWith('•') ? (
                                        <p className="ml-4 text-gray-700">{item}</p>
                                    ) : item.trim().startsWith('GPA:') ? (
                                        <p className="ml-6 text-gray-700">{item}</p>
                                    ) : (
                                        <p className={item.trim().startsWith('  ') ? "ml-6 text-gray-700" : "text-gray-700"}>
                                            {item}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    const parseResumeText = (text) => {
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const result = {
            header: null,
            content: {}
        };
        
        // Extract contact information header (first 2-3 lines)
        if (lines.length > 0) {
            const name = lines[0];
            const contact = lines.length > 1 ? lines[1] : '';
            const additionalContact = lines.length > 2 && !lines[2].toUpperCase().includes('SUMMARY') ? lines[2] : '';
            
            result.header = { 
                name, 
                contact,
                additionalContact: additionalContact
            };
            
            // Remove header lines from the array
            const startIndex = additionalContact ? 3 : 2;
            lines.splice(0, startIndex);
        }
        
        let currentSection = '';
        
        for (const line of lines) {
            // Section headers are in ALL CAPS, but ignore years in parentheses
            if (line === line.toUpperCase() && line.length > 2 && 
                !line.includes('•') && !line.includes('|') && 
                !line.includes('(') && !line.includes(')')) {
                currentSection = line.trim();
                result.content[currentSection] = [];
            } else if (currentSection) {
                result.content[currentSection].push(line);
            }
        }
        
        return result;
    };

    return (
        <div className="bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-6 w-[800px] max-h-[90vh] max-w-[95vw] relative shadow-2xl border border-white/20 animate-fadeIn overflow-hidden flex flex-col">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:scale-110 text-2xl transition-all duration-300 z-10"
            >
                ×
            </button>
            <div className="text-center mb-4">
                <div className="inline-block p-2 rounded-full bg-white/20 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Resume Builder</h2>
                <p className="text-white/80 text-sm mt-1">Create a professional resume in minutes</p>
            </div>

            {resumeText ? (
                <div className="flex flex-col gap-4 overflow-hidden h-full">
                    {viewMode === 'text' ? (
                        <div className="bg-white/10 border border-white/30 text-white p-4 rounded-lg h-[60vh] overflow-y-auto whitespace-pre-line custom-scrollbar">
                            {resumeText}
                        </div>
                    ) : (
                        <div className="h-[60vh] rounded-lg overflow-hidden border border-white/30 shadow-inner">
                            <DocumentView resumeText={resumeText} />
                        </div>
                    )}
                    
                    <div className="flex justify-between gap-2">
                        <button
                            onClick={() => {
                                setResumeText('');
                                setCurrentStep(1);
                            }}
                            className="flex-1 bg-white/20 text-white hover:bg-white/30 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                            Back to Form
                        </button>
                        <div className="flex-1 flex gap-1">
                            <button
                                onClick={toggleViewMode}
                                className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-2 ${
                                    viewMode === 'text' 
                                        ? 'bg-white/10 text-white hover:bg-white/20' 
                                        : 'bg-white/30 text-white'
                                }`}
                                title="Text View"
                            >
                                <FaAlignLeft />
                            </button>
                            <button
                                onClick={toggleViewMode}
                                className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-2 ${
                                    viewMode === 'document' 
                                        ? 'bg-white/10 text-white hover:bg-white/20' 
                                        : 'bg-white/30 text-white'
                                }`}
                                title="Document View"
                            >
                                <FaFileAlt />
                            </button>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="flex-1 bg-white/20 text-white hover:bg-white/30 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FaCopy /> Copy Text
                        </button>
                        <button
                            onClick={downloadPdf}
                            className="flex-1 bg-white text-red-500 hover:bg-white/90 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FaFilePdf /> PDF
                        </button>
                        <button
                            onClick={downloadDocx}
                            className="flex-1 bg-white text-red-500 hover:bg-white/90 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                            <FaFileWord /> DOCX
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={submitHandler} className="overflow-y-auto pr-1 flex-1">
                    {!isFinalPreview && renderStepIndicator()}
                    
                    <div className="h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                        {isFinalPreview ? (
                            <div className="space-y-4">
                                <div className="bg-white/10 p-3 rounded-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">Final Resume Preview</h3>
                                    <p className="text-white/80 text-sm">
                                        Review your resume below. If everything looks good, click "Confirm & Generate" to create your resume.
                                    </p>
                                </div>
                                {renderPreview()}
                            </div>
                        ) : (
                            isPreview ? renderPreview() : renderStepContent()
                        )}
                    </div>
                    
                    {renderStepButtons()}
                </form>
            )}
        </div>
    );
}

export default ResumeForm;
