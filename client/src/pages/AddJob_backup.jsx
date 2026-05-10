import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { FiPlus } from "react-icons/fi";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("0-1 years");
  const [salary, setSalary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { backendUrl, companyToken } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!title.trim()) {
        toast.error("Please enter a job title");
        setIsLoading(false);
        return;
      }

      const description = quillRef.current?.root?.innerHTML || "";
      const plainText = description.replace(/<[^>]*>/g, "").trim();
      
      if (!plainText) {
        toast.error("Please enter a job description");
        setIsLoading(false);
        return;
      }

      if (!salary || isNaN(salary) || Number(salary) <= 0) {
        toast.error("Please enter a valid salary");
        setIsLoading(false);
        return;
      }

      if (!companyToken) {
        toast.error("Company token not found. Please login again.");
        setIsLoading(false);
        return;
      }

      console.log("Posting job...");

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        { 
          title, 
          description, 
          location, 
          salary: Number(salary), 
          category, 
          level 
        },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message || "Job posted successfully!");
        setTitle("");
        setSalary("");
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Job posting error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      try {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["clean"],
            ],
          },
          placeholder: "Write detailed job description...",
        });
      } catch (error) {
        console.error("Quill init error:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Post a New <span className="text-blue-600">Job</span>
          </h1>

          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <div ref={editorRef} className="h-64"></div>
              </div>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {JobCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Job Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  {JobLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Job Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Experience
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <option value="0-1 years">0-1 years</option>
                  <option value="2-5 years">2-5 years</option>
                  <option value=">6 years">>6 years</option>
                </select>
              </div>

              {/* Job Salary */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Salary (LPA)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">LPA</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="e.g. 4.5"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full pl-8 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <FiPlus className="text-lg" />
                    <span className="text-lg">Post Job</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
