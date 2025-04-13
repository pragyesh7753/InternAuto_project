import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaExclamationTriangle, FaSpinner, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { InternshalaAPI } from '../api';

const AutomationStatus = ({ jobId, onBack }) => {
    const [status, setStatus] = useState('running');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Check status immediately then poll every 2 seconds
        checkStatus();
        const intervalId = setInterval(checkStatus, 2000);
        
        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [jobId]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const checkStatus = async () => {
        try {
            const data = await InternshalaAPI.checkStatus(jobId);
            
            if (data.success) {
                setStatus(data.status);
                
                // Add new messages to the list (avoid duplicates)
                if (data.messages && data.messages.length > 0) {
                    setMessages(prev => {
                        const existingMessageTexts = new Set(prev.map(m => m.message));
                        const newMessages = data.messages.filter(m => !existingMessageTexts.has(m.message));
                        
                        // Check for login failure messages
                        const loginFailureIndicators = [
                            "login failed",
                            "credentials",
                            "could not login",
                            "login unsuccessful"
                        ];
                        
                        const hasLoginFailure = newMessages.some(m => 
                            m.level === "ERROR" && 
                            loginFailureIndicators.some(indicator => 
                                m.message.toLowerCase().includes(indicator)
                            )
                        );
                        
                        if (hasLoginFailure && status !== 'failed') {
                            toast.error('Login failed. Please check your credentials and try again.');
                        }
                        
                        return [...prev, ...newMessages];
                    });
                }
                
                // If completed or failed, show appropriate toast
                if (data.status === 'completed' && status !== 'completed') {
                    toast.success('Automation completed successfully!');
                } else if (data.status === 'failed' && status !== 'failed') {
                    // Don't show generic error toast if we already showed a specific login error
                    const hasLoginError = messages.some(m => 
                        m.level === "ERROR" && m.message.toLowerCase().includes("login")
                    );
                    
                    if (!hasLoginError) {
                        toast.error('Automation process failed');
                    }
                }
            } else {
                setError('Failed to get status. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching status:', error);
            setError('Failed to connect to the server. Please try again later.');
            toast.error('Connection error');
        }
    };

    const getStatusIndicator = () => {
        switch (status) {
            case 'running':
                return <FaSpinner className="animate-spin text-yellow-300" />;
            case 'completed':
                return <FaCheck className="text-green-400" />;
            case 'failed':
                return <FaExclamationTriangle className="text-red-400" />;
            default:
                return <FaInfoCircle className="text-blue-400" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'running':
                return 'Running';
            case 'completed':
                return 'Completed';
            case 'failed':
                return 'Failed';
            default:
                return 'Unknown';
        }
    };

    const getMessageClassName = (level) => {
        switch (level) {
            case 'ERROR':
                return 'text-red-300';
            case 'WARNING':
                return 'text-yellow-300';
            case 'INFO':
                return 'text-white';
            default:
                return 'text-gray-300';
        }
    };

    return (
        <div className='bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-8 w-[600px] max-w-[95vw] relative shadow-2xl border border-white/20'>
            <button
                onClick={onBack}
                className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
            >
                <FaArrowLeft /> Back
            </button>
            
            <h2 className='text-2xl font-bold text-white mb-6 text-center'>Automation Status</h2>
            
            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-lg mb-4">
                <div className="text-2xl">
                    {getStatusIndicator()}
                </div>
                <div>
                    <div className="text-white font-semibold">Status: {getStatusText()}</div>
                    <div className="text-white/70 text-sm">Job ID: {jobId}</div>
                </div>
            </div>
            
            {error && (
                <div className="bg-red-500/30 border border-red-500 text-white p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            <div className="bg-black/40 rounded-lg p-4 h-[300px] overflow-auto mb-4">
                <h3 className="text-white/90 font-semibold mb-2">Progress Log:</h3>
                {messages.length === 0 ? (
                    <p className="text-white/50 italic">Waiting for messages...</p>
                ) : (
                    <div className="space-y-1 font-mono text-sm">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${getMessageClassName(msg.level)}`}>
                                <span className="text-gray-400">[{msg.timestamp}]</span> {msg.message}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            
            <button
                onClick={onBack}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
            >
                Return to Form
            </button>
        </div>
    );
};

export default AutomationStatus;
