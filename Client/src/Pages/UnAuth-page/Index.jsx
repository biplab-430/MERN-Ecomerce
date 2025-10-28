import React from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white">
      <div className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg">
        <h1 className="text-4xl font-bold mb-4">🚫 Access Denied</h1>
        <p className="text-lg mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate("/shop/home")}
          className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-lg shadow-md hover:scale-105 transform transition"
        >
          Go to Shop Home
        </button>
      </div>
    </div>
  );
}

export default Index;
