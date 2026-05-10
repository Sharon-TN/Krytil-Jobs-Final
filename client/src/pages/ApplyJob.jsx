import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  FiBriefcase,
  FiMapPin,
  FiUser,
  FiDollarSign,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
    fetchUserData,
  } = useContext(AppContext);

  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data?.success) {
        setJobData(data.job);
      } else {
        toast.error(data?.message || "Failed to fetch job details");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to fetch job"
      );
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const applyHandler = async () => {
    setIsApplying(true);
    try {
      if (!isLoaded) {
        toast.info("Loading your profile, please try again...");
        return;
      }

      if (!isSignedIn) {
        toast.error("Please login to apply for jobs");
        return;
      }

      if (!userData) {
        const fetchedUser = await fetchUserData();
        if (!fetchedUser && !userData) {
          toast.error("Could not load your profile. Please try again.");
          return;
        }
      }

      if (!userData?.resume) {
        navigate("/applications");
        toast.error("Please upload your resume before applying");
        return;
      }

      if (!jobData?._id) {
        toast.error("Invalid job data");
        return;
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        toast.success(data.message);
        await fetchUserApplications();
      } else {
        toast.error(data?.message || "Application failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Application failed"
      );
    } finally {
      setIsApplying(false);
    }
  };

  const checkedAlreadyApplied = () => {
    if (!jobData?._id || !Array.isArray(userApplications)) {
      setIsAlreadyApplied(false);
      return;
    }

    const hasApplied = userApplications.some(
      (item) => item?.jobId?._id === jobData._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    checkedAlreadyApplied();
  }, [jobData, userApplications]);

  if (isLoading) {
    return <Loading />;
  }

  if (!jobData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center"
      >
        <p className="text-xl text-gray-600">Job not found</p>
      </motion.div>
    );
  }

  const jobDetails = [
    { icon: <FiBriefcase size={18} />, text: jobData.companyId?.name || "N/A" },
    { icon: <FiMapPin size={18} />, text: jobData.location || "N/A" },
    { icon: <FiUser size={18} />, text: jobData.level || "N/A" },
    {
      icon: <span className="text-lg">₹</span>,
      text: jobData.salary ? `${jobData.salary} LPA` : "N/A",
    },
  ];

  return (
    <>
      <Navbar hideAuthButtons={true} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col py-10 pt-32 container px-4 2xl:px-20 mx-auto"
      >
        {/* Job Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 mb-8 border border-blue-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-200"
              >
                <img
                  className="h-20 w-20 object-contain"
                  src={jobData.companyId?.image || assets.default_company}
                  alt={jobData.companyId?.name || "Company logo"}
                />
              </motion.div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {jobData.title}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  {jobDetails.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-2 text-gray-600 bg-white/80 px-3 py-1.5 rounded-full text-sm"
                    >
                      {detail.icon}
                      <span>{detail.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center md:items-end gap-3 mx-auto md:mx-0"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={applyHandler}
                disabled={isAlreadyApplied || isApplying}
                className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  isAlreadyApplied
                    ? "bg-green-100 text-green-800 cursor-not-allowed"
                    : isApplying
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow hover:shadow-md"
                }`}
              >
                {isApplying ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Applying...
                  </>
                ) : isAlreadyApplied ? (
                  "Already Applied"
                ) : (
                  <>
                    Apply Now
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiClock size={14} />
                <span>
                  Posted {jobData.date ? moment(jobData.date).fromNow() : "N/A"}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Job Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Job Description
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html:
                  jobData.description || "<p>No description available</p>",
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={applyHandler}
                disabled={isAlreadyApplied || isApplying}
                className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  isAlreadyApplied
                    ? "bg-green-100 text-green-800 cursor-not-allowed"
                    : isApplying
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow hover:shadow-md"
                }`}
              >
                {isApplying ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Applying...
                  </>
                ) : isAlreadyApplied ? (
                  "Already Applied"
                ) : (
                  <>
                    Apply Now
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* More Jobs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                More jobs at {jobData.companyId?.name || "this company"}
              </h2>

              {jobs
                ?.filter(
                  (job) =>
                    job?._id !== jobData._id &&
                    job?.companyId?._id === jobData.companyId?._id
                )
                ?.filter((job) => {
                  const appliedJobsIds = new Set(
                    userApplications
                      ?.map((app) => app?.jobId?._id)
                      ?.filter(Boolean)
                  );
                  return !appliedJobsIds.has(job._id);
                })
                ?.slice(0, 4)
                ?.map((job, index) => (
                  <motion.div
                    key={job._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="mb-4 last:mb-0"
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}

              {jobs?.filter(
                (job) =>
                  job?._id !== jobData._id &&
                  job?.companyId?._id === jobData.companyId?._id
              ).length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 text-center py-4"
                >
                  No other jobs from this company
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default ApplyJob;
