import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, Building2, Phone, Mail, Package, X, CheckCircle, AlertCircle } from 'lucide-react';

const CombinedBidForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Bid details state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState(1);

  // State for error, bidId and OTP process
  const [error, setError] = useState('');
  const [bidId, setBidId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email,
          phone,
          price,
          company,
          quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Bid submission failed');
      }
      setBidId(data.bidId);
      setShowModal(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Bid submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bid/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Invalid OTP. Please try again.');
      }
      setOtpMessage('Bid verified successfully!');
      setTimeout(() => {
        setShowModal(false);
        navigate('/user');
      }, 2000);
    } catch (err) {
      setOtpMessage(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex-grow">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-black mb-2">Place Your Bid</h1>
          <p className="text-gray-600 mb-6">
            Fill in the details below to submit your bid for this product
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleBidSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Row 1: Email and Phone */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Bid Price and Company */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Bid Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter your bid amount"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Quantity spanning two columns */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Quantity
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bid'}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">Verify Your Bid</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
      
          <p className="text-gray-600 mb-6">
            Please check your {email} Email for the OTP code to verify your bid
          </p>
      
          {/* Responsive grid: one column on small screens, two on medium and above */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium break-all">{phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">${price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium">{quantity}</p>
            </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">Company</p>
            <p className="font-medium">{company}</p>
          </div>
          </div>
      
      
          {otpMessage && (
            <div
              className={`p-4 rounded-lg mb-6 flex items-center ${
                otpMessage.includes('success')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {otpMessage.includes('success') ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p>{otpMessage}</p>
            </div>
          )}
      
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Enter OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 text-center text-lg tracking-wider border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
                maxLength={6}
                required
              />
            </div>
      
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default CombinedBidForm;
