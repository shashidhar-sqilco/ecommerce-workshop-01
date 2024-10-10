import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="bg-blue-950 text-white flex items-center p-2 justify-between">
      <div>
        <Link to="/">
          <img src="./logo.png" alt="" className="h-16" />
        </Link>
      </div>
      <div className=" flex justify-around gap-8">
        {user ? (
          <>
            <Link to="/cart">Cart</Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
}
