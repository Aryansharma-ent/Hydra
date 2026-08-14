declare const window: any;
import { useState,useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import axios from "axios"
import { ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react"
import { API_BASE_URL } from "../config/api";

export default function Login() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

 const [errorMessage, setErrorMessage] = useState("");
const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMessage("");
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    if (res.data.success) {
      // 1. Store the token in localStorage
      localStorage.setItem("hydra_token", res.data.data.token);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("hydra_user", JSON.stringify(res.data.data));
      // 2. Set default Axios header so future requests include token
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.token}`;
      // 3. Redirect to dashboard
      navigate("/dashboard");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    setErrorMessage(error.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  

  useEffect(() => {
    const token = localStorage.getItem("hydra_token") || localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            setLoading(true);
            const payload: any = jwtDecode(response.credential);
            const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
              googleId: payload.sub,
              email: payload.email,
              name: payload.name,
              avatarUrl: payload.picture,
            });

            if (res.data.success) {
              localStorage.setItem("hydra_token", res.data.data.token);
              localStorage.setItem("token", res.data.data.token);
              localStorage.setItem("hydra_user", JSON.stringify(res.data.data));
              axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.token}`;
              navigate("/dashboard");
            }
          } catch (err: any) {
            console.error("Google Auth failed", err);
            setErrorMessage("Google login failed");
          } finally {
            setLoading(false);
          }
        },
      });

      const googleBtnContainer = document.getElementById("googleSignInBtn");
      if (googleBtnContainer) {
        window.google.accounts.id.renderButton(googleBtnContainer, {
          theme: "outline",
          size: "large",
          width: 330,
          text: "continue_with",
        });
      }
    }
  }, []);

  const handleGoogleLogin = () => {
    if (window.google) {
      // Clear g_state cookie so prompt triggers even if previously closed
      document.cookie = "g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
      window.google.accounts.id.prompt();
    } else {
      alert("Google SDK loading... please refresh");
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#09090b] text-[#e4e4e7] flex flex-col items-center justify-center p-4 font-sans select-none antialiased relative overflow-hidden">
      
      {/* Background visual effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-12 left-12 flex items-center gap-2">
       <img src="/hydralogo.png" alt="" className="h-6 w-6 rounded-2xl"/>
        <span className="text-[12px] font-semibold text-white tracking-widest uppercase">Hydra</span>
      </div>

      <div className="w-full max-w-[380px] flex flex-col gap-6 z-10">
        
        {/* Header */}
        <div className="flex flex-col text-center gap-1.5 mb-2">
          <h1 className="text-[20px] font-semibold text-white tracking-tight">
            Sign in to Hydra
          </h1>
          <p className="text-[12px] text-[#52525b]">
            Visual regression checking, automated.
          </p>
        </div>

        {/* OAuth Google Buttons */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div id="googleSignInBtn" className="w-full flex justify-center min-h-[40px]"></div>
        </div>

        {/* Separator / Expand Email options */}
        <div className="flex flex-col items-center justify-center pt-2">
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="text-[11px] text-[#71717a] hover:text-[#a1a1aa] transition-colors cursor-pointer"
            >
              Continue with Email
            </button>
          ) : (
             
            <div className="w-full border-t border-[#1a1a1d] pt-5 mt-2 flex flex-col gap-4">
              {errorMessage && (
          <p className="text-red-400 text-[11px] font-medium text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg mb-1">
             {errorMessage}
           </p>
           )}
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 bg-[#080809] border border-[#1f1f23] focus:border-[#3f3f46] text-[12px] text-white placeholder-[#3f3f46] rounded-lg outline-none transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider">Password</label>
                    <a href="#forgot" className="text-[10px] text-[#71717a] hover:text-[#a1a1aa] transition-colors">Forgot?</a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-9 pl-3 pr-9 bg-[#080809] border border-[#1f1f23] focus:border-[#3f3f46] text-[12px] text-white placeholder-[#3f3f46] rounded-lg outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-9 mt-2 flex items-center justify-center gap-2 bg-white hover:bg-[#e4e4e7] disabled:opacity-40 text-black text-[12px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="size-3.5 animate-spin text-black" />
                  ) : (
                    <>Sign In <ArrowRight className="size-3.5" /></>
                  )}
                </button>
              </form>
              
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-[10px] text-[#52525b] hover:text-[#71717a] transition-colors text-center"
              >
                Hide email options
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-[#52525b] mt-4 flex flex-col gap-2">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-white hover:underline font-medium">
              Sign up for free
            </Link>
          </p>
          <p className="text-[10px] text-[#3f3f46] leading-relaxed pt-2 border-t border-[#1a1a1d]">
            By joining, you agree to our <span className="hover:underline cursor-pointer">Terms of Service</span> and <span className="hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

      </div>
    </div>
  )
}
