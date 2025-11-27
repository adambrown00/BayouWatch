import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch, FaCamera, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

// Geocoding function using Nominatim (OpenStreetMap)
async function addressToCoordinates(address: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Baton Rouge, LA`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    throw new Error('Address not found. Please try a different address or be more specific.');
  } catch (err) {
    throw new Error('Failed to find address. Please check your internet connection.');
  }
}

export default function Reporting() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    address: "",
    latitude: 0,
    longitude: 0,
    severity: "minor",
    description: "",
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [foundAddress, setFoundAddress] = useState<string | null>(null);

  // Check if coordinates came from map click
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      setFormData(prev => ({
        ...prev,
        latitude: latitude,
        longitude: longitude
      }));
      
      setFoundAddress(`📍 Location selected from map: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  }, [searchParams]);

  const handleAddressLookup = async () => {
    if (!formData.address.trim()) {
      setError('Please enter an address first');
      return;
    }
    
    setGeocoding(true);
    setError(null);
    
    try {
      const coords = await addressToCoordinates(formData.address);
      setFormData({
        ...formData,
        latitude: coords.latitude,
        longitude: coords.longitude
      });
      setFoundAddress(coords.displayName);
    } catch (err: any) {
      setError(err.message || 'Failed to find address');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('You must be logged in to submit a report. Please login first.');
      setSubmitting(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Basic validation
    if (!formData.latitude || !formData.longitude) {
      setError('Please click on the map or use "Find Location" to set coordinates.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/reports/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: formData.latitude,
          longitude: formData.longitude,
          severity: formData.severity,
          description: formData.description,
          photo_url: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit report');
      }

      // Success!
      setSuccess(true);
      
      // Clear form
      setFormData({
        address: "",
        latitude: 0,
        longitude: 0,
        severity: "minor",
        description: "",
      });
      setPhoto(null);
      setFoundAddress(null);

      // Redirect to history page after 2 seconds
      setTimeout(() => {
        navigate('/flood-history');
      }, 2000);

    } catch (err: any) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      console.log("Selected file:", file);
      setPhoto(file);
    }
  };

  return (
    <div className="p-6 font-sans max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Submit Flood Report</h1>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <FaExclamationCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center gap-2">
          <FaCheckCircle size={18} />
          <span>Report submitted successfully! Redirecting to history...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tip banner */}
        <div className="p-3 bg-blue-50 border border-blue-300 rounded flex items-center gap-2">
          <MdLocationOn className="text-blue-600" size={20}/>
          <p className="text-sm font-medium">Tip: Click on the map from the Home page to automatically set your location!</p>
        </div>

        {/* Show if coordinates were set */}
        {foundAddress && (
          <div className="p-3 bg-green-50 border border-green-300 rounded flex items-center gap-2">
            <FaCheckCircle className="text-green-600" size={18} />
            <span>{foundAddress}</span>
          </div>
        )}

        {/* Manual address option */}
        <div className="space-y-2">
          <label className="block font-medium">
            {formData.latitude === 0 ? 'Location *' : 'Or Change Location (Optional)'}
          </label>
          <p className="text-sm text-gray-600">
            Enter a street name, landmark, or area in Baton Rouge
          </p>
          <div className="flex gap-2">
            <input 
              className="p-2 border rounded w-full" 
              placeholder="e.g. Highland Road, LSU Campus, Downtown Baton Rouge"
              value={formData.address}
              onChange={(e) => {
                setFormData({...formData, address: e.target.value});
                if (foundAddress && foundAddress.includes('map')) {
                  setFoundAddress(null);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddressLookup}
              disabled={geocoding || !formData.address.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded whitespace-nowrap hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaSearch size={14} />
              {geocoding ? 'Finding...' : 'Find Location'}
            </button>
          </div>
        </div>

        {/* Show coordinates */}
        {formData.latitude !== 0 && formData.longitude !== 0 && (
          <div className="p-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-700 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-600" />
            Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </div>
        )}

        <div className="space-y-1">
          <label className="block font-medium">Flood Severity *</label>
          <select 
            className="p-2 border rounded w-full"
            value={formData.severity}
            onChange={(e) => setFormData({...formData, severity: e.target.value})}
          >
            <option value="minor">Minor - Water on roads, passable with caution</option>
            <option value="moderate">Moderate - Roads partially flooded, difficult to pass</option>
            <option value="severe">Severe - Roads impassable, dangerous conditions</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-medium">Description</label>
          <textarea 
            className="p-2 border rounded w-full" 
            rows={4} 
            placeholder="Describe the flooding situation (water depth, affected areas, road conditions, etc.)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Photo upload - Not functional yet */}
        <div
          className="p-6 border-2 border-dashed rounded w-full text-center bg-gray-50 cursor-pointer hover:bg-gray-100"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
          }}
          onClick={() => document.getElementById("photo-input")?.click()}
        >
          <FaCamera className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600">
            {photo ? `Selected: ${photo.name}` : "Drag & drop a photo here, or click to select (Optional)"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Photo upload coming soon</p>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>

        <button 
          type="submit"
          disabled={submitting || (formData.latitude === 0 || formData.longitude === 0)}
          className="p-3 bg-blue-600 text-white rounded w-full font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting Report...' : 'Submit Report'}
        </button>
      </form>

      <button 
        onClick={() => navigate('/')}
        className="p-2 border rounded w-full mt-4 hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        <FaArrowLeft size={14} />
        Back to Home
      </button>
    </div>
  );
}