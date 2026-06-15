import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Users, Code, Stethoscope, Megaphone, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume: null
  });

  const openPositions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Nairobi, Kenya (Remote)",
      type: "Full-time",
      salary: "KES 150,000 - 250,000",
      experience: "5+ years",
      description: "We're looking for a Senior Full Stack Developer to lead our engineering team. You'll be responsible for building and maintaining our healthcare platform.",
      requirements: [
        "5+ years experience with React and Node.js/Python",
        "Experience with PostgreSQL and Redis",
        "Knowledge of cloud platforms (AWS/GCP)",
        "Experience with healthcare systems is a plus",
        "Strong problem-solving skills"
      ]
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 120,000 - 180,000",
      experience: "3+ years",
      description: "Join our product team to drive the vision and execution of our healthcare platform.",
      requirements: [
        "3+ years product management experience",
        "Experience with healthcare or B2B products",
        "Strong analytical and communication skills",
        "Ability to work with cross-functional teams"
      ]
    },
    {
      id: 3,
      title: "Customer Success Specialist",
      department: "Customer Support",
      location: "Nairobi, Kenya (Hybrid)",
      type: "Full-time",
      salary: "KES 60,000 - 90,000",
      experience: "2+ years",
      description: "Help our users get the most out of AfyaLink by providing exceptional support.",
      requirements: [
        "2+ years customer support experience",
        "Excellent communication skills",
        "Experience with healthcare or tech support",
        "Problem-solving mindset"
      ]
    },
    {
      id: 4,
      title: "Telemedicine Doctor",
      department: "Medical",
      location: "Remote (Kenya)",
      type: "Contract/Part-time",
      salary: "Market rate",
      experience: "3+ years",
      description: "Provide virtual consultations to patients across Kenya through our platform.",
      requirements: [
        "Valid medical license in Kenya",
        "3+ years clinical experience",
        "Experience with telemedicine platforms",
        "Good internet connection and equipment"
      ]
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Nairobi, Kenya",
      type: "Full-time",
      salary: "KES 80,000 - 120,000",
      experience: "3+ years",
      description: "Drive growth and brand awareness for AfyaLink through digital marketing campaigns.",
      requirements: [
        "3+ years digital marketing experience",
        "Experience with social media and content marketing",
        "Analytical and creative skills",
        "Healthcare marketing experience is a plus"
      ]
    },
    {
      id: 6,
      title: "Data Analyst",
      department: "Data",
      location: "Remote",
      type: "Full-time",
      salary: "KES 100,000 - 150,000",
      experience: "3+ years",
      description: "Analyze platform data to provide insights that drive business decisions.",
      requirements: [
        "3+ years data analysis experience",
        "Proficiency in SQL and Python",
        "Experience with data visualization tools",
        "Healthcare data experience is a plus"
      ]
    }
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplication(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resume: e.target.files[0]
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!applicationData.full_name || !applicationData.email || !applicationData.cover_letter) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.loading('Submitting application...');
    
    // Simulate API call
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Application submitted for ${selectedJob.title}! We'll review and get back to you.`);
      setShowApplication(false);
      setApplicationData({
        full_name: '',
        email: '',
        phone: '',
        cover_letter: '',
        resume: null
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Help us revolutionize healthcare in Africa. We're looking for passionate individuals to join our mission.
          </p>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Why Work With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're building the future of healthcare in Africa, and we need great people to help us get there.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={28} className="text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Growth</h3>
              <p className="text-sm text-gray-500">Rapidly growing company with career advancement opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Great Team</h3>
              <p className="text-sm text-gray-500">Work with talented, passionate people</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={28} className="text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Competitive Pay</h3>
              <p className="text-sm text-gray-500">Attractive salaries and benefits package</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase size={28} className="text-brand-600" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-2">Impact</h3>
              <p className="text-sm text-gray-500">Make a real difference in healthcare</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          
          {showApplication && selectedJob ? (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setShowApplication(false)}
                className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-2"
              >
                ← Back to positions
              </button>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Apply for {selectedJob.title}</h3>
                <p className="text-gray-500 mb-6">{selectedJob.department} • {selectedJob.location}</p>
                
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
                      value={applicationData.full_name}
                      onChange={handleApplicationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={applicationData.email}
                      onChange={handleApplicationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={applicationData.phone}
                      onChange={handleApplicationChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                    <textarea
                      name="cover_letter"
                      value={applicationData.cover_letter}
                      onChange={handleApplicationChange}
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV (PDF)</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX. Max size: 5MB</p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {openPositions.map((job) => (
                <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-full">{job.department}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign size={14} />
                      {job.salary}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                  
                  <button
                    onClick={() => handleApply(job)}
                    className="w-full bg-brand-600 text-white py-2 rounded-lg font-semibold hover:bg-brand-700 transition"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CareersPage;