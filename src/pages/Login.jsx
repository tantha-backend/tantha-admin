import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);
      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        toast.error("Invalid login response.");
        return;
      }

      if (user.role !== "admin") {
        toast.error("Unauthorized. Admin access only.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful.");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="card w-full max-w-md">
        <h1 className="mb-2 text-4xl font-bold text-pink-500">TANTHA</h1>

        <h2 className="mt-6 text-2xl font-bold">Admin Login</h2>

        <p className="mb-8 mt-1 text-white/50">
          Login to manage Tantha Music dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="label">Email</label>

            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>

            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-500 px-6 py-3 font-semibold transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;