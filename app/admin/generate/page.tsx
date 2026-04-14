"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function AdminGeneratePage() {
  const [csvContent, setCsvContent] = useState("");
  const [preview, setPreview] = useState<any[]>([]);

  const handlePreview = () => {
    const lines = csvContent.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;
    
    // Simple parser for preview (does not handle complex quoted fields like the real parser)
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1, 11).map(line => {
      // Very simple split for preview purposes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(','); 
      const item: any = {};
      headers.forEach((h, i) => { 
        item[h] = values[i] ? values[i].replace(/^"|"$/g, '') : ''; 
      });
      return item;
    });
    setPreview(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 leading-none">AI Content Helper</h1>
        <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Paste your Etsy CSV content to preview how it will look on the site.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <label className="font-black uppercase text-xl underline decoration-4 underline-offset-4 decoration-[#FFE500]">Raw CSV Input</label>
          <div className="card-neo flex flex-col p-4 bg-white">
            <textarea
              className="min-h-[400px] font-mono text-sm p-4 focus:outline-none bg-gray-50 border-2 border-black border-dashed whitespace-pre overflow-auto"
              placeholder="title,slug,category,difficulty,price,rating,review_count,description,image_url,etsy_url,features..."
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
            />
            <div className="mt-4">
              <Button onClick={handlePreview} className="w-full h-16 text-2xl uppercase italic">
                Generate View
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <label className="font-black uppercase text-xl underline decoration-4 underline-offset-4 decoration-[#FFE500]">Parsed Results</label>
          <div className="card-neo bg-white overflow-hidden shadow-neo-lg">
            {preview.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FFE500] border-b-4 border-black">
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-black">Title</th>
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-black">Cat</th>
                      <th className="p-4 font-black uppercase text-sm">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b-2 border-black border-dashed last:border-0 hover:bg-[#FFE500]/10 transition-colors">
                        <td className="p-4 font-bold text-sm truncate max-w-[200px] border-r-2 border-black">{row.title}</td>
                        <td className="p-4 font-bold text-xs uppercase italic border-r-2 border-black">{row.category}</td>
                        <td className="p-4 font-black text-lg">${row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-24 text-center">
                <div className="text-6xl mb-4 font-black text-gray-200 uppercase">Empty</div>
                <p className="font-bold text-gray-400 italic">
                  Paste data and hit the yellow button to see results here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
