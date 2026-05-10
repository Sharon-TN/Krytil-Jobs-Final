import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiBookmark, FiShare2 } from "react-icons/fi";

const JobCard = ({ job, index }) => {
  const navigate = useNavigate();

  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      className="relative bg-purple-800 rounded-xl border border-purple-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Header with Company Info */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-14 h-14 rounded-lg bg-purple-700 border border-purple-600 p-2 flex items-center justify-center shadow-sm"
            >
              <img
                src={job.companyId?.image || 'https://via.placeholder.com/56'}
                alt={job.companyId?.name || 'Company'}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div>
              <h4 className="font-semibold text-lg text-white">{job.title}</h4>
              <p className="text-sm text-gray-400 mt-1">{job.companyId?.name || 'Company Name'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-purple-400 hover:text-blue-400 transition-colors">
              <FiBookmark size={18} />
            </button>
            <button className="text-purple-400 hover:text-blue-400 transition-colors">
              <FiShare2 size={18} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-300"
          >
            {job.location || 'Location'}
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300"
          >
            {job.level || 'Level'}
          </motion.span>
          {job.type && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300"
            >
              {job.type}
            </motion.span>
          )}
        </div>

        {/* Job Title and Description */}
        <p className="text-gray-500 text-sm mt-2 font-medium">{job.category || 'Category'}</p>
        
        {/* Description (with gradient fade) */}
        <div className="relative mt-3">
          <div
            className="text-gray-400 text-sm line-clamp-2 max-h-10"
            dangerouslySetInnerHTML={{ __html: (job.description || 'Job description').slice(0, 100) }}
          />
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="px-6 pb-6 pt-3 border-t border-purple-700 flex justify-between items-center">
        <div className="text-lg font-bold text-white">
          ₹{job.salary || '0'}{job.salaryType === 'Range' ? '- ' + job.salaryMax : ''}LPA
        </div>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Learn more
          <FiArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    companyId: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
    }).isRequired,
    location: PropTypes.string,
    level: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
    salary: PropTypes.string,
    salaryType: PropTypes.string,
    salaryMax: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default JobCard;
