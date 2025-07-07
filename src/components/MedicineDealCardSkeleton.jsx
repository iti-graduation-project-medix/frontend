import React from 'react';

function MedicineDealCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full animate-pulse">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header with badge skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="flex flex-col gap-2 items-end">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </div>
        </div>

        {/* Deal info with icons skeleton */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16 mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12 mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Description skeleton */}
        <div className="mb-4 flex-1">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>

        {/* Pharmacy info skeleton */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="relative">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action button skeleton */}
      <div className="p-6 pt-0">
        <div className="w-full h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}

export default MedicineDealCardSkeleton; 