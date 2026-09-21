// import React, { useState } from "react";
// import toast from "react-hot-toast";

// const ForgotPasswordModal = ({ onNext }) => {
//   const [email, setEmail] = useState("");

//   const validateEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email.trim()) {
//       toast.error("Please enter your email");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post("http://localhost:8000/auth/forget-password", {
//         email,
//       });
//       toast.success("OTP sent to your email!");
//       localStorage.setItem("resetEmail", email);
//       onNext("otp");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.detail || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className=" p-6 xl:p-[2vw] xl:px-[1vw] px-3 bg-white rounded-[25px] xl:rounded-[1vw]  max-w-md h-60 md:max-w-none  xl:h-[20vw] w-full">
//       <h2 className="text-center font-semibold text-lg xl:text-[1.4vw] xl:mb-[3vw] mb-10">
//         Forgot Password
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 xl:p-[1vw] border font-normal border-[#D6D6D6] py-2 xl:py-[0.6vw] text-[16px] xl:text-[1.1vw] rounded-[10px] xl:rounded-[1vw] mb-10 xl:mb-[3vw] focus:outline-none focus:ring-2 focus:ring-green-400"
//           value={email}
//           required
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <button
//           type="submit"
//           className="bg-[#2BDF88] hover:bg-green-600 text-white w-full py-3 xl:py-[1vw] text-[18px] font-medium xl:text-[1.3vw] mb-10 xl:mb-[3vw] rounded-[8px] xl:rounded-[0.8vw] transition duration-200"
//         >
//           Get OTP
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ForgotPasswordModal;




import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/auth/forget-password",
        email,
      );
      toast.success("OTP sent to your email!");
      localStorage.setItem("resetEmail", email);
      onNext("otp");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-[25px] max-w-md w-full">
      <h2 className="text-center font-semibold text-lg mb-6">Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-400"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-lg font-medium transition duration-200"
        >
          {loading ? "Sending..." : "Get OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordModal;
