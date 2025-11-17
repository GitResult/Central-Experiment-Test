import { useEffect, useState } from 'react';
type Props = {
    selections: Array<{ id: number; category: string; value: string; type: string; connector: string | null }>;
}

export default function ReportViewComponent({ selections }: Props) {
    const [previewCount, setPreviewCount] = useState<number | null>(null);

    useEffect(() => {
        if (selections.length > 0) {
            const baseCount = 7100;
            const filters = selections.filter(s => s.type === 'filter').length;
            const estimated = Math.floor(baseCount * Math.pow(0.4, filters));
            setPreviewCount(Math.max(50, estimated));
        } else {
            setPreviewCount(7100); // Default when no filters
        }
    }, [selections]);
    return (
        <div className='h-max w-full'>
            {/* target position */}

            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Matching Records</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Showing results based on your phrase criteria
                    </p>
                </div>

                <div className="w-full border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            {/* Fixed Header */}
                            <div className="bg-gray-50 border-b border-gray-200">
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-[120px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Member ID
                                            </th>
                                            <th className="w-[180px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="w-[220px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="w-[120px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="w-[140px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Join Date
                                            </th>
                                            <th className="w-[160px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>

                            {/* Scrollable Body */}
                            <div className="max-h-[300px] overflow-y-auto">
                                <table className="min-w-full">
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Array.from({ length: Math.min(10, previewCount || 10) }).map((_, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="w-[120px] px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    M{10001 + idx}
                                                </td>
                                                <td className="w-[180px] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Davis', 'James Wilson',
                                                        'Lisa Anderson', 'David Martinez', 'Mary Taylor', 'Robert Thomas', 'Jennifer Lee'][idx]}
                                                </td>
                                                <td className="w-[220px] px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {['john.smith@example.com', 'sarah.j@example.com', 'mchen@example.com', 'emma.d@example.com',
                                                        'james.w@example.com', 'lisa.a@example.com', 'david.m@example.com', 'mary.t@example.com',
                                                        'robert.t@example.com', 'jennifer.l@example.com'][idx]}
                                                </td>
                                                <td className="w-[120px] px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${idx % 3 === 0 ? 'bg-green-100 text-green-800' :
                                                        idx % 3 === 1 ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {idx % 3 === 0 ? 'Current' : idx % 3 === 1 ? 'Active' : 'Member'}
                                                    </span>
                                                </td>
                                                <td className="w-[140px] px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(2024, 0, 1 + idx * 10).toLocaleDateString()}
                                                </td>
                                                <td className="w-[160px] px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {['Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB', 'Ottawa, ON',
                                                        'Edmonton, AB', 'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB'][idx]}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing 1 to {Math.min(10, previewCount || 10)} of {previewCount?.toLocaleString() || '0'} results
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}