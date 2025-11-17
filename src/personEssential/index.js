import React from 'react';
import EssentialPage from './person-essential';

/**
 * PersonEssential Component
 *
 * Person essentials dashboard with customizable widgets, tasks, and interactive features.
 */
const PersonEssential = () => {
    return (
        <div className="relative min-w-full min-h-screen bg-gray-50">
            <EssentialPage />
        </div>
    );
}

export default PersonEssential;