import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../config";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passLengthError, setPassLengthError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUser = (e) => {
    const value = e.target.value;
    setUser(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address. Example: user@example.com");
    } else {
      setEmailError("");
    }
  };

  const handlePass = (e) => {
    const value = e.target.value;
    setPass(value);

    setPassLengthError(value.length < 6);

    const hasLetters = /[a-zA-Z]/.test(value);
    const hasNumbers = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length === 0) {
      setPasswordStrength("");
    } else if (value.length < 6 || (!hasLetters || !hasNumbers)) {
      setPasswordStrength("Weak");
    } else if (hasLetters && hasNumbers && !hasSpecial) {
      setPasswordStrength("Medium");
    } else if (hasLetters && hasNumbers && hasSpecial) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleConfirmPass = (e) => setConfirmPass(e.target.value);

  const handleSignup = async () => {
    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();
    const trimmedConfirmPass = confirmpass.trim();

    if (!trimmedUser || !trimmedPass || !trimmedConfirmPass) {
      alert("Enter all the details (Email ID, password, and confirm password).");
      return;
    }

    if (emailError) {
      alert("Please enter a valid email.");
      return;
    }

    if (trimmedPass.length < 6) {
      setPassLengthError(true);
      return;
    }

    if (trimmedPass !== trimmedConfirmPass) {
      setPasswordMismatch(true);
      return;
    }

    const firebaseErrorMessages = {
      "auth/email-already-in-use": "This email is already registered. Please log in instead.",
      "auth/invalid-email": "Please enter a valid email address (e.g., example@email.com).",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/network-request-failed": "Network error. Please check your internet connection.",
      // Add more as needed
    };

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, trimmedUser, trimmedPass);
      setPasswordMismatch(false);
      setPassLengthError(false);
      navigate("/login");
    } catch (error) {
      const message =
        firebaseErrorMessages[error.code] || "Something went wrong. Please try again later.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Strong":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-2xl shadow-lg">
        {/* Left Section */}
        <div className="bg-blue-500 text-white p-6 md:w-2/5 flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Looks like you're new here!</h1>
          <p className="mt-2">Sign up with your email to get started</p>
        </div>

        {/* Right Section */}
        <div className="p-6 bg-white md:w-3/5">
          {/* Email Field */}
          <p className="mb-4">
            <label htmlFor="txtEmail" className="text-gray-600">Enter Email ID</label>
            <input
              type="email"
              id="txtEmail"
              className="border-b border-blue-600 outline-none w-full text-sm p-2"
              value={user}
              onChange={handleUser}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </p>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="txtPass" className="text-gray-600">Enter Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="txtPass"
              className="border-b border-blue-600 outline-none w-full text-sm p-2 pr-10"
              value={pass}
              onChange={handlePass}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {passLengthError && (
              <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters.</p>
            )}

            {passwordStrength && (
              <p className={`text-sm mt-1 font-medium ${getStrengthColor()}`}>
                Strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 relative">
            <label htmlFor="txtConfirmPass" className="text-gray-600">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="txtConfirmPass"
              className="border-b border-blue-600 outline-none w-full text-sm p-2 pr-10"
              value={confirmpass}
              onChange={handleConfirmPass}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-9 text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Validation Message */}
          {passwordMismatch && (
            <p className="text-red-500 mb-4">Passwords do not match.</p>
          )}

          {/* Terms */}
          <p className="text-gray-600 text-sm mb-4">
            By continuing, you agree to our{" "}
            <span className="text-blue-600 cursor-pointer">Terms of Use</span> and{" "}
            <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Signup Button */}
          <button
            disabled={isLoading}
            className={`w-full bg-orange-400 text-white font-medium p-2 hover:bg-orange-500 transition-all duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={handleSignup}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>

          {/* Login Link */}
          <p className="text-blue-600 text-center p-3 mt-4 shadow-md hover:shadow-lg transition-all duration-200">
            <Link to="/login">Existing User? Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
