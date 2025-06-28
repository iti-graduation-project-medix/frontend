import React from "react";

export function DealGallery({ images }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden rounded-3xl shadow-xl border border-gray-100 p-8">
      {/* دوائر زخرفية */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mt-16 -mr-16 opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -mb-20 -ml-20 opacity-40 -z-10" />

      <h2 className="text-3xl font-extrabold mb-8 text-primary text-center">
        Medicine Images
      </h2>

      {images.length === 1 &&
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-72 object-cover"
          />
        </div>}

      {images.length === 2 &&
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, index) =>
            <div key={index} className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-72 object-cover"
              />
            </div>
          )}
        </div>}

      {images.length === 3 &&
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
          {/* الصورة الأساسية تأخذ العمود الأول وصفين */}
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* الصورة الثانية تأخذ العمود الثاني والصف الأول */}
          <div className="md:col-start-3 md:col-end-4 md:row-start-1 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-60 object-cover"
            />
          </div>

          {/* الصورة الثالثة تأخذ العمود الثاني والصف الثاني */}
          <div className="md:col-start-3 md:col-end-4 md:row-start-2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-60 object-cover"
            />
          </div>
        </div>}

      {images.length === 4 &&
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
          <div className="md:row-span-2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-60 object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-60 object-cover"
            />
          </div>
          <div className="md:col-span-2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[3].src}
              alt={images[3].alt}
              className="w-full h-60 object-cover"
            />
          </div>
        </div>}

      {images.length === 5 &&
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
          <div className="md:row-span-2 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-60 object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-60 object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[3].src}
              alt={images[3].alt}
              className="w-full h-60 object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src={images[4].src}
              alt={images[4].alt}
              className="w-full h-60 object-cover"
            />
          </div>
        </div>}
    </div>
  );
}
