import { useEffect, useState } from "react";
import auth from "../config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate("/home");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setError("");

    if (!user || !pass) {
      setError("Please enter both Email ID and Password.");
      return;
    }

    // if (pass.length < 6) {
    //   setError("Password must be at least 6 characters.");
    //   return;
    // }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, user, pass);
      navigate("/home");
    } catch (err) {
      setError("Invalid Email or Password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-[calc(100vh-4rem)] px-5 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-2xl shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="bg-blue-500 text-white p-5 md:w-2/5 flex flex-col justify-center items-center text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-3">Get access to your Orders, Wishlist, and Recommendations</p>
        </div>

        {/* Right Section */}
        <div className="p-6 bg-white md:w-3/5 w-full">
          <div>
            <label htmlFor="txtEmail" className="text-gray-600 block mb-1">
              Enter Email ID
            </label>
            <input
              type="email"
              id="txtEmail"
              className="border-b-2 border-blue-600 outline-none block w-full text-sm p-2"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />

            <label htmlFor="txtPass" className="text-gray-600 block mt-5 mb-1">
              Enter Password
            </label>
            <input
              type="password"
              id="txtPass"
              className="border-b-2 border-blue-600 outline-none block w-full text-sm p-2"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            {error && <p className="mt-5 text-red-500">{error}</p>}

            <p className="text-gray-600 mt-6 text-sm">
              By continuing, you agree to our{" "}
              <span className="text-blue-600">Terms of Use</span> and{" "}
              <span className="text-blue-600">Privacy Policy</span>
            </p>

            <button
              className={`${
                loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              } text-white font-medium w-full p-2 mt-5 rounded`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-blue-600 text-center mt-5">
            <Link to="/signup">New to Flipkart Clone? Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
