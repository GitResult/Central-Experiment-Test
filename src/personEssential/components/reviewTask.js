import { useEffect, useState } from "react";
import ListView from "./listView"
import MembershipStory from "./membershipStory"

const ReviewTask = () => {
    const [viewType, setViewType] = useState('listView');
    const [sampleData, setSampleData] = useState(null);

    useEffect(() => {
        const loadSampleData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/data/reviewTask.json`);
                if (!response.ok) {
                    throw new Error('Failed to load sample data');
                }
                const data = await response.json();
                setSampleData(data);
            } catch (error) {
                console.error('Error loading sample data:', error);
                setSampleData(null);
            }
        };

        loadSampleData();
    }, []);

    return sampleData && (
        <div className="w-[70%] m-auto min-h-screen bg-white text-gray-900">
            <div className="bg-white border-b border-gray-200 px-6 py-4 mt-5">
                <h1 className="text-2xl font-semibold text-gray-900">{sampleData.campaign.title}</h1>
                <p className="text-sm text-gray-500 mt-1">{sampleData.campaign.subtitle}</p>
            </div>
            {viewType === 'listView' ? (
                <div className="flex justify-end mt-3 me-2">
                    <div className="inline-flex rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => setViewType('listView')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                viewType === 'listView'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setViewType('membershipStory')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                viewType === 'membershipStory'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            Membership Story
                        </button>
                    </div>
                </div>
            ) : null}
            {viewType === 'listView' ? <ListView></ListView> : <MembershipStory></MembershipStory>}
        </div>
    );
}

export default ReviewTask;