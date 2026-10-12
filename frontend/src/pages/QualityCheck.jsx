import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Camera, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function QualityCheck({ lang, user }) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setResult(null); // Reset previous results
    }
  };

  // Simulate AI processing for presentation purposes
  const handleAnalyze = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate a 2.5 second delay for the ML model processing
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulated response (Later, this will come from your FastAPI model)
      setResult({
        status: 'success',
        classification: 'Ripe',
        confidence: 96.8,
        grade: 'A',
        recommendation: 'Ready for premium market listing.'
      });
    }, 2500);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center">
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-emerald-600 flex items-center font-bold bg-slate-100 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
            <Camera className="w-6 h-6 mr-2 text-emerald-600" /> AI Quality Grading
          </h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 mt-10">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Produce Analysis</h2>
          <p className="text-slate-500">Upload a clear photo of your produce for instant MobileNetV2 quality grading.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          
          {/* Upload Area */}
          {!selectedImage ? (
            <label className="border-4 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-16 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors group">
              <UploadCloud className="w-16 h-16 text-slate-300 group-hover:text-emerald-500 mb-4 transition-colors" />
              <span className="text-lg font-bold text-slate-700 group-hover:text-emerald-700">Click to upload image</span>
              <span className="text-sm text-slate-400 mt-2">JPG, PNG up to 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-6 w-full max-w-md h-64 bg-slate-100">
                <img src={selectedImage} alt="Selected Produce" className="w-full h-full object-cover" />
                {!isAnalyzing && !result && (
                  <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md hover:bg-red-600">
                    Remove
                  </button>
                )}
              </div>

              {!result && (
                <button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing}
                  className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all text-lg flex justify-center items-center"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Analyzing using MobileNetV2...</>
                  ) : (
                    <><Camera className="w-5 h-5 mr-2" /> Run AI Analysis</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Results Area */}
          {result && (
            <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Analysis Complete</h3>
                  <p className="text-slate-500">Based on your uploaded image.</p>
                </div>
                <div className="bg-emerald-100 text-emerald-700 w-16 h-16 rounded-full flex items-center justify-center font-extrabold text-2xl border-4 border-white shadow-md">
                  {result.grade}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Classification</p>
                  <p className="text-lg font-bold text-slate-800">{result.classification}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">AI Confidence</p>
                  <p className="text-lg font-bold text-emerald-600">{result.confidence}%</p>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl flex items-start text-emerald-800 mb-6">
                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{result.recommendation}</p>
              </div>

              <button 
                onClick={() => { setSelectedImage(null); setResult(null); }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold transition-colors"
              >
                Scan Another Item
              </button>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
