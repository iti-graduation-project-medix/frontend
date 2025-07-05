import React from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export default function DownloadButton({ saleFileUrl }) {
  if (!saleFileUrl) return null;
  return (
    <a
      href={saleFileUrl}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="inline-block"
    >
      <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
        <Download className="w-5 h-5" />
        Download Pharmacy File
      </Button>
    </a>
  );
}
