import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react"

export default function Signup() {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [name, setName] = useState("")
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
      const res = await axios.post("http://localhost:8000/api/auth/register", {
        name,
        email,
        password,
      });
      if (res.data.success) {
        // 1. Store the token in localStorage
        localStorage.setItem("hydra_token", res.data.data.token);
        localStorage.setItem("hydra_user", JSON.stringify(res.data.data));
        // 2. Set default Axios header so future requests include token
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.token}`;
        // 3. Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    console.log(`OAuth register with ${provider}`)
    // Simulate login for UI demo
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen w-screen bg-[#09090b] text-[#e4e4e7] flex flex-col items-center justify-center p-4 font-sans select-none antialiased relative overflow-hidden">
      
      {/* Background visual effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-12 left-12 flex items-center gap-2">
        <ShieldCheck className="size-5 text-[#a1a1aa]" />
        <span className="text-[12px] font-semibold text-white tracking-widest uppercase">Hydra</span>
      </div>

      <div className="w-full max-w-[380px] flex flex-col gap-6 z-10">
        
        {/* Header */}
        <div className="flex flex-col text-center gap-1.5 mb-2">
          <h1 className="text-[20px] font-semibold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-[12px] text-[#52525b]">
            Start visual regression testing in 2 minutes.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOAuthLogin("Google")}
            className="w-full h-10 px-4 flex items-center justify-center gap-3 border border-[#1f1f23] bg-[#0d0d0f] hover:bg-[#141416] hover:border-[#3f3f46] text-[12px] font-medium text-[#e4e4e7] rounded-lg transition-all duration-150 cursor-pointer"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.694 0-8.503-3.809-8.503-8.503 0-4.694 3.809-8.503 8.503-8.503 2.15 0 4.1.79 5.61 2.21l3.22-3.22C18.15 1.06 15.35 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 12.24-4.89 12.24-12.24 0-.83-.07-1.63-.2-2.395H12.24z"/>
            </svg>
            Continue with Google
          </button>
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
                  <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 px-3 bg-[#080809] border border-[#1f1f23] focus:border-[#3f3f46] text-[12px] text-white placeholder-[#3f3f46] rounded-lg outline-none transition-colors"
                    required
                  />
                </div>

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
                  <label className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider">Password</label>
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
                    <>Sign Up <ArrowRight className="size-3.5" /></>
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
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline font-medium">
              Log in instead
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
