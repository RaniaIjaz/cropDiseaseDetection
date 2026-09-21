"use client";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";

import { Eye, EyeOff } from "lucide-react";

export default function SignUp({ isOpen, onClose, toggleModal }) {
  const modalRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
 };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setFormSubmitted(true);

//   const { userName, email, password } = formData;
//   if (!userName || !email || !password) return;

//   try {
//     const res = await axios.post("http://localhost:8000/auth/register", {
//       userName,
//       email,
//       password,
//     });

//     const { access_token, id, userName: name, email: userEmail } = res.data;
//     dispatch(setUser({ id, userName: name, email: userEmail, token: access_token }));

//     console.log("User registered & logged in:", res.data);

//     onClose();
//     router.push("/");
//   } catch (error) {
//     console.error("Error during registration:", error);
//     alert(error.response?.data?.detail || "Registration failed");
//   }
// };


const handleSubmit = async (e) => {
  e.preventDefault();
  setFormSubmitted(true);

  const { userName, email, password } = formData;
  if (!userName || !email || !password) return;

  try {
    const res = await axios.post("http://localhost:8000/auth/register", {
      userName,
      email,
      password,
    });

    // Debug the response
    console.log("RAW RESPONSE:", res.data);

    // Extract data safely with fallbacks
    const responseData = res.data;
    
    // Handle different possible response structures
    const token = responseData.access_token || responseData.token || responseData.data?.access_token || "";
    const id = responseData.id || responseData.data?.id || responseData.userId || "";
    const responseUserName = responseData.userName || responseData.name || responseData.data?.userName || userName;
    const responseEmail = responseData.email || responseData.data?.email || email;

    console.log("Extracted data:", { token, id, responseUserName, responseEmail });

    dispatch(setUser({ 
      id, 
      userName: responseUserName, 
      email: responseEmail, 
      token 
    }));

    onClose();
    router.push("/");
  } catch (error) {
    console.error("Error during registration:", error);
    alert(error.response?.data?.detail || "Registration failed");
  }
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // return (
  //   <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
  //     <div
  //       ref={modalRef}
  //       className="bg-white rounded-[20px] p-8 w-full max-w-md shadow-lg"
  //     >
  //       <h2 className="text-2xl font-semibold text-center mb-6">
  //         Create Your Account
  //       </h2>

  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         {/* Name */}
  //         <div>
  //           <input
  //             type="text"
  //             name="userName"
  //             value={formData.userName}
  //             onChange={handleChange}
  //             placeholder="Full name"
  //             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           {!formData.userName && formSubmitted && (
  //             <p className="text-red-500 text-sm mt-1">
  //               Full Name is required.
  //             </p>
  //           )}
  //         </div>

  //         {/* Email */}
  //         <div>
  //           <input
  //             type="email"
  //             name="email"
  //             value={formData.email}
  //             onChange={handleChange}
  //             placeholder="Email"
  //             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           {!formData.email && formSubmitted && (
  //             <p className="text-red-500 text-sm mt-1">Email is required.</p>
  //           )}
  //         </div>

  //         {/* Password */}
  //         <div className="relative">
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             name="password"
  //             value={formData.password}
  //             onChange={handleChange}
  //             placeholder="Password"
  //             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  //           />
  //           <button
  //             type="button"
  //             onClick={() => setShowPassword(!showPassword)}
  //             className="absolute right-3 top-2.5 text-gray-600"
  //           >
  //             {showPassword ? <Eye /> : <EyeOff />}
  //           </button>
  //           {!formData.password && formSubmitted && (
  //             <p className="text-red-500 text-sm mt-1">
  //               Password is required.
  //             </p>
  //           )}
  //         </div>

  //         {/* Submit Button */}
  //         <button
  //           type="submit"
  //           className="w-full py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg font-medium transition duration-300"
  //         >
  //           Create Account
  //         </button>

  //         {/* Login link */}
  //         <div className="text-center text-sm text-gray-600 mt-4">
  //           Already have an account?{" "}
  //           <button
  //             type="button"
  //             onClick={() => toggleModal("login")}
  //             className="text-green-500 hover:underline"
  //           >
  //             Login
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );

    return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center ">
      <div
        ref={modalRef}
        className="bg-white rounded-[20px] overflow-hidden shadow-lg flex w-full max-w-4xl 2xl:w-full"
      >
        {/* <div className="w-[56%] py-8 pl-8 hidden md:block">
          <img
            src="/assets/auth.png" 
            alt="Signup Illustration"
            className="h-full w-full object-cover rounded-[20px]"
          />
        </div> */}

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
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
          
            <div>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Full name"
                 className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {!formData.userName && formSubmitted && (
                <p className="text-red-500 text-sm mt-1">
                  Full Name is required.
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-green-500 hover:bg-green-600 rounded-lg font-medium transition duration-300"
            >
              Create Account
            </button>

            {/* Login link */}
            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => toggleModal("login")}
                className="text-green-500 hover:underline"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
