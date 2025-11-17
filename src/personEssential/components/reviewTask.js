import { useEffect, useState } from "react";
import ListView from "./listView"
import CalendarView from "./calendarView"
import MembershipStory from "./membershipStory"
import { Tab, Tabs } from "@heroui/react";

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
            {viewType === 'listView' || viewType === 'calendarView' ? (
                <div className="flex justify-end mt-3 me-2">
                    <Tabs aria-label="Tabs variants">
                        <Tab key="List" title="List" onClick={() => setViewType('listView')} />
                        <Tab key="Calendar" title="Calendar" onClick={() => setViewType('calendarView')} />
                    </Tabs>
                </div>
            ) : null}
            {viewType === 'listView' ? <ListView></ListView> : viewType === 'calendarView' ? <CalendarView setViewType={setViewType}></CalendarView> : <MembershipStory></MembershipStory>}
        </div>
    );
}

export default ReviewTask;