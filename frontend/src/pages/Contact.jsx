import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

const ContactPage = () => {
  const whatsappNumber = '919876543210'; // Use your WhatsApp number (without +)
  const whatsappMessage = encodeURIComponent(
    'Hello, I have a query regarding my order (e.g., return issue, payment issue, etc.). Please assist me.'
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          Have questions or need help? We’d love to hear from you.  
          Fill out the form or reach us through the details below.
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl p-8">
        {/* Left Section - Contact Info */}
        <div className="flex flex-col justify-center bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

          <div className="flex items-center mb-5">
            <PhoneIcon className="h-6 w-6 mr-4 text-white" />
            <p className="text-lg">+91 98765 43210</p>
          </div>

          <div className="flex items-center mb-5">
            <EnvelopeIcon className="h-6 w-6 mr-4 text-white" />
            <p className="text-lg">support@shopease.com</p>
          </div>

          <div className="flex items-center mb-5">
            <MapPinIcon className="h-6 w-6 mr-4 text-white" />
            <p className="text-lg">123 Market Street, Mumbai, India</p>
          </div>

          {/* WhatsApp Contact */}
          <div className="flex items-center mb-6">
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 mr-4 text-white" />
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold underline hover:text-gray-300 transition"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-gray-300 transition">Facebook</a>
            <a href="#" className="hover:text-gray-300 transition">Instagram</a>
            <a href="#" className="hover:text-gray-300 transition">Twitter</a>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>

          {/* WhatsApp Quick Button */}
          <div className="mt-6 text-center">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
            >
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl w-full mt-12 rounded-2xl overflow-hidden shadow-md">
        <iframe
          title="Our Location"
          className="w-full h-72"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.2360260464445!2d72.8776553752397!3d19.10040335231337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b75d8b9a4f6d%3A0x2b60c06b08c5bfa3!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1718453785869!5m2!1sen!2sin"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
