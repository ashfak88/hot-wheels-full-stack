import React from "react";
import { FaCarSide, FaShippingFast, FaTools, FaSmile } from "react-icons/fa";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
    <div className="bg-gray-50 min-h-screen pt-10 pb-16 font-sans">

     
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-orange-700 mb-4">
          About Hot Wheels Store
        </h1>
        <p className="text-gray-700 text-lg">
          We bring you the hottest, sleekest, and most collectible Hot Wheels cars
          with fast shipping, great prices, and trusted service.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 px-6">
        
        <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition">
          <FaCarSide className="text-orange-700 w-10 h-10 mb-4" />
          <h3 className="font-bold text-xl text-gray-800 mb-2">
            Wide Collection
          </h3>
          <p className="text-gray-600">
            From rare editions to premium collectibles, we offer a massive range
            of authentic Hot Wheels.
          </p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition">
          <FaShippingFast className="text-orange-700 w-10 h-10 mb-4" />
          <h3 className="font-bold text-xl text-gray-800 mb-2">
            Fast Delivery
          </h3>
          <p className="text-gray-600">
            We ship your products quickly so you can enjoy your collectibles
            without waiting too long.
          </p>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-xl transition">
          <FaTools className="text-orange-700 w-10 h-10 mb-4" />
          <h3 className="font-bold text-xl text-gray-800 mb-2">
            Premium Quality
          </h3>
          <p className="text-gray-600">
            All items are checked carefully to ensure that you receive only the
            best Hot Wheels cars.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 px-6 grid md:grid-cols-2 gap-10 items-center">

        <img
          src="https://i.ibb.co/7Q3yb0n/hotwheels.jpg"
          alt="Hot Wheels"
          className="rounded-2xl shadow-lg hover:scale-105 transition duration-300"
        />

        <div>
          <h2 className="text-3xl font-bold text-orange-700 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our goal is simple: deliver the best Hot Wheels shopping experience.
            Whether you're a collector, fan, or buying for someone special, we
            make sure every purchase is enjoyable, safe, and fast.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-20 text-center px-4">
        <FaSmile className="w-12 h-12 text-orange-700 mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-gray-800 mb-3">
          Customers Love Us!
        </h3>
        <p className="text-gray-600 text-lg">
          With hundreds of satisfied collectors, we are proud to serve Hot Wheels
          lovers all over the country.
        </p>
      </div>
        </div>
        <Footer />
        </>
  );
};

export default About;
