"use client";

export const DetailsLoading: React.FC = () => {
  return (
    <div className="w-3xl mx-auto my-24 p-8 bg-white rounded-lg shadow-md animate-pulse">
      {/* Title */}
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-6"></div>

      {/* Company / Role */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
      </div>

      {/* Location / Type / Office Time */}
      <div className="flex gap-4 mb-4">
        <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
      </div>

      {/* Salary / Deadline */}
      <div className="flex gap-4 mb-6">
        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>

      {/* Apply Button */}
      <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
    </div>
  );
};
