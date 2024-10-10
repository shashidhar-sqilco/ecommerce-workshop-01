import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);
    const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const success = await signup(fullname,email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid Email or Password");
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className=" min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="font-bold text-2xl text-gray-800 mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="Fullname"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Fullname
            </label>
            <input
              type="Fullname"
              id="Fullname"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full  bg-blue-950 text-gray-50 px-3 py-2 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-gray-focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
