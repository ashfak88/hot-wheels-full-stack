import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 md:py-16 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">

          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Our Commitment</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>We guarantee everything we make.</li>
              <li>We take responsibility for our impact.</li>
              <li>We give our profits to the planet.</li>
            </ul>
          </div>

          <div className="hidden md:block md:col-span-1">
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Get In Touch</h3>
            <div className="space-y-4 text-sm text-gray-400">
              
              <div>
                <p className="font-semibold text-gray-300">Email</p>
                <Link to="mailto:hello@trevora.com" className="hover:text-indigo-400 transition">
                  hello@Hotwheels.com
                </Link>
              </div>

              <div>
                <p className="font-semibold text-gray-300">Phone</p>
                <p>+91 88933 90415</p>
              </div>

              <div>
                <p className="font-semibold text-gray-300">Address</p>
                <p>123 Outdoor Gear Plaza</p>
                <p>Bangalore, India 560001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 my-8 md:my-10" />

        <div className="text-center text-sm text-gray-500">
          &copy; 2025/26 Hot Wheels. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;