import React, { useState } from 'react';

export default function RegisterPage() {
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    console.log('Sending OTP to:', phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0">
        <div className="w-[600px] h-[600px] bg-purple-700 rounded-full blur-3xl opacity-20 absolute top-[-100px] left-[-200px] animate-pulse" />
        <div className="w-[400px] h-[400px] bg-blue-600 rounded-full blur-3xl opacity-20 absolute bottom-[-100px] right-[-150px] animate-pulse" />
      </div>

      {/* Registration Card */}
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-2xl w-[400px] relative z-10 border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Voter Registration</h1>

        <div className="flex flex-col space-y-5">
          {/* PIN Field */}
          <div>
            <label className="block text-sm font-semibold mb-2">PIN Number</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Send OTP Button */}
          <button
            onClick={handleSendOTP}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>
  );
}
