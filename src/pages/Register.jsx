import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import api from '../lib/api';

function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false,
    acceptMarketing: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateEmail = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateEmail()) {
      setStep(2);
    } else if (step === 2 && validatePassword()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms of service');
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.register(
        formData.email,
        formData.password,
        formData.name
      );
      setAuth(response.data.user, response.data.tokens.accessToken);
      navigate('/browse', { replace: true });
    } catch (err) {
      setError(err.message || err.response?.data?.message || err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8c3b/web/IN-en-20231106-pops498-1702900-tidy-default.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 md:px-16 py-6 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-netflix-red font-bold text-3xl md:text-4xl tracking-wider">
            <span className="text-white">M</span>OOVIE
          </h1>
        </Link>
        <Link
          to="/login"
          className="text-white font-medium hover:underline"
        >
          Sign In
        </Link>
      </header>

      {/* Registration Form */}
      <div className="relative z-10 flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s <= step
                      ? 'bg-netflix-red text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {s < step ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 md:w-24 h-1 ${
                      s < step ? 'bg-netflix-red' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-black/75 rounded-md p-8 md:p-12">
            {/* Step 1: Email */}
            {step === 1 && (
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">
                  Step 1 of 3
                </p>
                <h2 className="text-white text-3xl font-bold mb-4">
                  Create your account
                </h2>
                <p className="text-gray-300 mb-6">
                  Enter your email to start watching unlimited movies and TV shows.
                </p>

                {error && (
                  <div className="bg-orange-500/20 border border-orange-500 text-orange-500 rounded-md p-4 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full bg-[#333] text-white rounded-md px-4 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                  />

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-4 rounded-md transition-colors text-xl"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">
                  Step 2 of 3
                </p>
                <h2 className="text-white text-3xl font-bold mb-4">
                  Create a password
                </h2>
                <p className="text-gray-300 mb-6">
                  Use a minimum of 6 characters with at least one letter and number.
                </p>

                {error && (
                  <div className="bg-orange-500/20 border border-orange-500 text-orange-500 rounded-md p-4 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full bg-[#333] text-white rounded-md px-4 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                    />
                  </div>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full bg-[#333] text-white rounded-md px-4 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                  />

                  {/* Password strength indicator */}
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            formData.password.length >= i * 3
                              ? formData.password.length >= 12
                                ? 'bg-green-500'
                                : formData.password.length >= 8
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {formData.password.length < 6
                        ? 'Too short'
                        : formData.password.length < 8
                        ? 'Weak'
                        : formData.password.length < 12
                        ? 'Good'
                        : 'Strong'}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 rounded-md transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-netflix-red hover:bg-red-700 text-white font-bold py-4 rounded-md transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Profile & Submit */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">
                  Step 3 of 3
                </p>
                <h2 className="text-white text-3xl font-bold mb-4">
                  Set up your profile
                </h2>
                <p className="text-gray-300 mb-6">
                  Tell us a bit about yourself.
                </p>

                {error && (
                  <div className="bg-orange-500/20 border border-orange-500 text-orange-500 rounded-md p-4 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-[#333] text-white rounded-md px-4 py-4 outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                  />

                  <div className="bg-[#333] rounded-md p-4 space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 accent-netflix-red"
                      />
                      <span className="text-gray-300 text-sm">
                        I agree to the{' '}
                        <a href="#" className="text-blue-500 hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-500 hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptMarketing"
                        checked={formData.acceptMarketing}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 accent-netflix-red"
                      />
                      <span className="text-gray-300 text-sm">
                        Yes, I want to receive special offers and updates from Moovie
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 rounded-md transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-netflix-red hover:bg-red-700 text-white font-bold py-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Already have account */}
            <div className="mt-8 text-center text-gray-400">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-white">
              <div className="w-12 h-12 mx-auto mb-3 bg-netflix-red/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Unlimited Streaming</h3>
              <p className="text-sm text-gray-400">Watch as much as you want, anytime</p>
            </div>
            <div className="text-white">
              <div className="w-12 h-12 mx-auto mb-3 bg-netflix-red/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Watch Everywhere</h3>
              <p className="text-sm text-gray-400">Stream on any device you own</p>
            </div>
            <div className="text-white">
              <div className="w-12 h-12 mx-auto mb-3 bg-netflix-red/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Cancel Anytime</h3>
              <p className="text-sm text-gray-400">No commitments, cancel online anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-16 py-8 bg-black/75 mt-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400 mb-6">
            Questions? Call{' '}
            <a href="tel:000-800-919-1694" className="hover:underline">
              000-800-919-1694
            </a>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <a href="#" className="hover:underline">FAQ</a>
            <a href="#" className="hover:underline">Help Centre</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;
