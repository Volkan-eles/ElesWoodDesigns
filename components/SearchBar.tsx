import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void; 
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="SEARCH FOR PLANS..."
        className="input-neo pl-12 h-14 font-bold placeholder:text-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
    </div>
  );
}
