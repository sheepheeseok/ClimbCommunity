export default function Sidebar() {
    return (
        <aside className="w-80 py-8">
            {/* Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">📅</div>
                        <div>
                            <h3 className="font-medium text-gray-900">Tech Meetup</h3>
                            <p className="text-sm text-gray-500">Tomorrow, 7:00 PM</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">☕</div>
                        <div>
                            <h3 className="font-medium text-gray-900">Coffee Chat</h3>
                            <p className="text-sm text-gray-500">Friday, 10:00 AM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggested Friends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Friends</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Emma Wilson</h3>
                            <p className="text-sm text-gray-500">3 mutual friends</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Follow
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-gray-900">Alex Rodriguez</h3>
                            <p className="text-sm text-gray-500">1 mutual friend</p>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Follow
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
