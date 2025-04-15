import React from 'react';
import { FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'running':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <FaSpinner className="animate-spin mr-1" />
                    Running
                </span>
            );
        case 'completed':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FaCheck className="mr-1" />
                    Complete
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <FaExclamationTriangle className="mr-1" />
                    Failed
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Unknown
                </span>
            );
    }
};

export default StatusBadge;
