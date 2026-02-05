import React, { useState } from "react";
import Footer from "../components/Footer";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceID = "service_x8jnmou";
    const templateID = "template_34d344j";
    const publicKey = "oZknWyWlD-RWnRA20";

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then((res) => {
        console.log("Email sent:", res);
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setLoading(false);
        alert("✅ Your message has been sent successfully!");
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        setLoading(false);
        alert("Failed to send message. Please try again later.");
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write your message..."
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {submitted && (
                <p className="text-green-600 text-center mt-3">
                  ✅ Thank you! We’ll get back to you soon.
                </p>
              )}
            </form>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-orange-700">
                Get in Touch
              </h3>
              <p className="text-gray-700 mb-4">
                Have a question about our products or your order? We’d love to
                hear from you.
              </p>
              <ul className="space-y-3">
                <li>
                  <strong>Address:</strong> 123 Outdoor Gear Plaza, Bangalore
                </li>
                <li>
                  <strong>Phone:</strong> +91 88933 90415
                </li>
                <li>
                  <strong>Email:</strong> hotwheels@gmail.com
                </li>
                <li>
                  <strong>Hours:</strong> Mon - Sat (9:00 AM - 6:00 PM)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
