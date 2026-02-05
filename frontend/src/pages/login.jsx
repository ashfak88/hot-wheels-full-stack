import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      toast.warning("Please enter both email and password");
      return;
    }

    try {
      const res = await api.post("/users/login", { email, password });
      const data = res.data;

      // ✅ Store logged-in user (Flattened for frontend compatibility)
      const userData = {
        ...data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      toast.success(`✅ Login successful! Welcome ${userData.name}`);

      setTimeout(() => {
        if (userData.role === "admin") navigate("/admin");
        else navigate("/");
        window.location.reload();
      }, 1200);

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Server error. Try again later.";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/Account")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
