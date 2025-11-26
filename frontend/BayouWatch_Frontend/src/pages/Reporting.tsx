import { useState } from "react";

export default function Reporting() {
    const [formData, setFormData] = useState({});


    return (
      <div className="p-6 font-sans max-w-xl mx-auto space-y-4">
       <h1 className="text-2xl font-bold">Submit Flood Report</h1>


       <div className="space-y-2">
          <label>Address</label>
          <input className="p-2 border rounded w-full" placeholder="Enter address" />


          <label>Location</label>
          <input className="p-2 border rounded w-full" placeholder="Enter general location (street name, landmark, etc.)" />
        </div>


        <div className="space-y-1">
          <label>Flood Severity</label>
          <select className="p-2 border rounded w-full">
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
           </select>
        </div>


        <div className="space-y-1">
          <label>Description</label>
          <textarea className="p-2 border rounded w-full" rows={4} placeholder="Describe the flooding situation..." />
        </div>


        <div
           className="p-6 border-2 border-dashed rounded w-full text-center bg-gray-50 cursor-pointer hover:bg-gray-100"
           onDragOver={(e) => e.preventDefault()}
           onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            console.log("Dropped file:", file);
        }}
        onClick={() => document.getElementById("photo-input")?.click()}
       >
        <p className="text-gray-600">Drag & drop a photo here, or click to select</p>
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
             const file = e.target.files?.[0];
             console.log("Selected file:", file);
        }}
      />
    </div>


    <button className="p-3 bg-blue-600 text-white rounded w-full font-semibold">Submit Report</button>

      
    <button className="p-2 border rounded w-full mt-4">Go to Home</button>
        {/*}
        Tailwind Sanity Test
        <div className="p-4 bg-slate-800 text-3xl text-red-500">
          Tailwind is working?
        </div>
        */}
  </div>
  
);
}