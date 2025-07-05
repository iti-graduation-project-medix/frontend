import React, { useState } from "react";

export default function ImageGallery({ images = [] }) {
  const [mainIndex, setMainIndex] = useState(0);
  if (!images.length)
    return (
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center rounded-xl">
        <span className="text-gray-400">No Images Available</span>
      </div>
    );
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main Image */}
      <div className="flex-1 min-w-0">
        <img
          src={images[mainIndex]}
          alt="Pharmacy Main"
          className="w-full aspect-video object-cover rounded-xl border shadow"
        />
      </div>
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 md:w-28 mt-2 md:mt-0">
        {images.map((img, idx) => (
          <button
            key={img + idx}
            onClick={() => setMainIndex(idx)}
            className={`focus:outline-none border-2 rounded-lg overflow-hidden transition-all duration-200 ${
              mainIndex === idx ? "border-primary" : "border-transparent"
            }`}
            style={{ width: "64px", height: "64px" }}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
