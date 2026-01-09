import { useState } from 'react';
import { Link } from 'react-router-dom';

const GiftCards = () => {
  const [amount, setAmount] = useState('25');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  const giftAmounts = ['10', '25', '50', '100'];

  const handlePurchase = (e) => {
    e.preventDefault();
    // TODO: Implement gift card purchase functionality
    alert('Gift card purchase feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-netflix-red hover:text-red-600 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Give the Gift of Entertainment</h1>
          <p className="text-gray-400 text-lg">
            Share unlimited movies and TV shows with friends and family
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Gift Card Purchase Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Moovie Gift Card</h2>

            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Select Amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {giftAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(value)}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        amount === value
                          ? 'bg-netflix-red text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      ${value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Recipient Email <span className="text-netflix-red">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              {/* Sender Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Your Name <span className="text-netflix-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
              </div>

              {/* Personal Message */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={4}
                  maxLength={250}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{message.length}/250 characters</p>
              </div>

              {/* Purchase Button */}
              <button
                type="submit"
                className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors"
              >
                Continue to Payment - ${amount}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Gift cards are delivered via email instantly after purchase
              </p>
            </form>
          </div>

          {/* Gift Card Preview */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-netflix-red via-red-700 to-red-900 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">Moovie</h3>
                <p className="text-white/80 mb-8">Gift Card</p>

                <div className="mb-8">
                  <p className="text-5xl font-bold">${amount}</p>
                  <p className="text-white/60 text-sm mt-2">Value</p>
                </div>

                {senderName && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm text-white/60 mb-1">From:</p>
                    <p className="font-medium">{senderName}</p>
                    {message && (
                      <>
                        <p className="text-sm text-white/60 mt-3 mb-1">Message:</p>
                        <p className="text-sm italic">"{message}"</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-3">How Gift Cards Work</h3>
              <ol className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Choose an amount and enter recipient details</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Complete payment - gift card sent via email instantly</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Recipient redeems the code on their Moovie account</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-netflix-red rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Credit applied automatically - enjoy streaming!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Features & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-netflix-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-netflix-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Instant Delivery</h3>
            <p className="text-sm text-gray-400">
              Gift cards are delivered via email immediately after purchase
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">No Expiration</h3>
            <p className="text-sm text-gray-400">
              Gift card credits never expire - use them whenever you want
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-400">
              All transactions are encrypted and processed securely
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">How do I redeem a gift card?</h3>
              <p className="text-gray-400 text-sm">
                Go to your Account Settings, click "Redeem Gift Card", and enter the code from your email.
                The credit will be applied automatically to your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I use multiple gift cards?</h3>
              <p className="text-gray-400 text-sm">
                Yes! You can redeem multiple gift cards, and the credits will stack on your account balance.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What if the gift card doesn't cover my full subscription?</h3>
              <p className="text-gray-400 text-sm">
                If your gift card balance doesn't cover your full monthly bill, we'll charge the remaining
                amount to your payment method on file.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I get a refund on a gift card?</h3>
              <p className="text-gray-400 text-sm">
                Gift cards are non-refundable. Once purchased, they cannot be returned or exchanged for cash.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Do gift cards work internationally?</h3>
              <p className="text-gray-400 text-sm">
                Moovie gift cards can only be redeemed in the country where they were purchased.
                International redemption is not currently supported.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Have questions about gift cards?</p>
          <Link
            to="/legal/help"
            className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Visit Help Center
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
