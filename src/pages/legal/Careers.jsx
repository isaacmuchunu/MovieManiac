import { useState } from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const departments = ['All Departments', 'Engineering', 'Product', 'Design', 'Marketing', 'Content', 'Operations', 'Finance'];
  const locations = ['All Locations', 'Los Angeles, CA', 'New York, NY', 'Austin, TX', 'Remote'];

  const jobs = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Build scalable streaming infrastructure and innovative features for millions of users worldwide.'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Create intuitive and delightful user experiences across web, mobile, and TV platforms.'
    },
    {
      title: 'Content Acquisition Manager',
      department: 'Content',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Source and negotiate content partnerships to expand our library of movies and TV shows.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Maintain and optimize our cloud infrastructure for 99.99% uptime and performance.'
    },
    {
      title: 'Data Scientist',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Develop recommendation algorithms and analyze user behavior to enhance personalization.'
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Austin, TX',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Lead growth campaigns and brand initiatives to expand our subscriber base.'
    }
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Competitive Salary',
      description: 'Industry-leading compensation packages with equity options'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Remote Flexibility',
      description: 'Work from anywhere with flexible hours and hybrid options'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Learning & Development',
      description: 'Continuous learning budget for courses, conferences, and books'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, gym membership, and mental health support'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Unlimited PTO',
      description: 'Take time off when you need it, plus paid parental leave'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Free Moovie Premium',
      description: 'Complimentary Premium subscription for you and your family'
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const deptMatch = selectedDepartment === 'all' || selectedDepartment === 'All Departments' || job.department === selectedDepartment;
    const locMatch = selectedLocation === 'all' || selectedLocation === 'All Locations' || job.location === selectedLocation;
    return deptMatch && locMatch;
  });

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Join Our Team</h1>
          <p className="text-gray-400 text-xl mb-8">
            Help us revolutionize the future of streaming entertainment
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-netflix-red rounded-full"></div>
              <span className="text-gray-400">500+ Employees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-netflix-red rounded-full"></div>
              <span className="text-gray-400">20+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-netflix-red rounded-full"></div>
              <span className="text-gray-400">50+ Open Positions</span>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
              <p className="text-gray-400 text-sm">
                We encourage bold ideas and embrace calculated risks to push boundaries
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse & Inclusive</h3>
              <p className="text-gray-400 text-sm">
                We celebrate differences and build a workplace where everyone belongs
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">User Obsessed</h3>
              <p className="text-gray-400 text-sm">
                Every decision we make is driven by creating value for our members
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="w-12 h-12 bg-netflix-red/20 rounded-lg flex items-center justify-center mb-4 text-netflix-red">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Listings */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Open Positions</h2>

          {/* Filters */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-400">No positions found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedDepartment('all');
                    setSelectedLocation('all');
                  }}
                  className="mt-4 text-netflix-red hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job, index) => (
                <div key={index} className="bg-gray-900 border border-gray-800 hover:border-netflix-red rounded-lg p-6 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="text-xs bg-netflix-red/20 text-netflix-red px-2 py-1 rounded">
                          {job.type}
                        </span>
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <button className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex-shrink-0">
                      Apply Now
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm">{job.description}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-netflix-red/20 to-transparent border border-netflix-red/50 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-gray-300 mb-6">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors font-medium">
              Submit General Application
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Careers;
