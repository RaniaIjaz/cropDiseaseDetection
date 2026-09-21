"use client";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import ForgotFlowModal from "./ForgotFlowModal";
import { setUser } from "../../redux/slices/userSlice";
import axios from "axios";


export default function Login({ isOpen, onClose, toggleModal }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setFormSubmitted(true);

  const { email, password } = formData;

  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    const loginRes = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    const { access_token } = loginRes.data;
    const userRes = await axios.get("http://localhost:8000/auth/me", {
      params: { token: access_token },
    });

    const userData = userRes.data;
    dispatch(setUser({ ...userData, token: access_token }));

    toast.success("Login successful");
    onClose();
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.response?.data?.detail || "Invalid email or password");
  }
};
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center ">
      <div
        ref={modalRef}
        className="bg-white rounded-[20px] overflow-hidden shadow-lg flex w-full max-w-4xl 2xl:w-full"
      >

      <div className="w-[56%] py-8 pl-8 hidden md:block">
  <div className="relative h-full w-full rounded-[20px] overflow-hidden">
    {/* Image */}
    <img
      src="/assets/auth.png"
      alt="Signup Illustration"
      className="h-full w-full object-cover"
    />

    {/* Blackish gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent rounded-[20px]" />
  </div>
</div>

    <div className="w-full md:w-[44%] p-10 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {!formData.email && formSubmitted && (
              <p className="text-red-500 text-sm mt-1">Email is required.</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
               className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
            {!formData.password && formSubmitted && (
              <p className="text-red-500 text-sm mt-1">
                Password is required.
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-green-500 text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg font-medium transition duration-300"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => toggleModal("signup")}
              className="text-green-500 hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
</div>

        {/* Forgot Flow Modal */}
        {showForgot && <ForgotFlowModal onClose={() => setShowForgot(false)} />}
      </div>
    </div>
  );
}
