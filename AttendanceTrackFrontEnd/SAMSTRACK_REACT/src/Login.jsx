import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [loginRequest, setLoginRequest] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLoginRequest((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8091/user/login-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginRequest),
      });
      const user = await response.json();

      if (user && user.username) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);

        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "faculty") {
          navigate("/faculty-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-6 
        transition duration-300 hover:shadow-2xl"
        onSubmit={submitHandler}
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={loginRequest.username}
            onChange={inputHandler}
            className="border rounded px-3 py-2 
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            transition duration-200"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={loginRequest.password}
            onChange={inputHandler}
            className="border rounded px-3 py-2 pr-10 
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            transition duration-200"
            required
          />

          {/* Eye Icon */}
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded font-semibold 
          hover:bg-blue-700 transition duration-300 
          cursor-pointer active:scale-95 
          disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
