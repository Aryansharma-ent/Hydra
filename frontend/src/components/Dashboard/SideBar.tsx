import { Link, useLocation, useParams } from "react-router-dom";
import { LayoutGrid, Play, Key, BookOpen, Sparkles, Check, X, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Sidebar() {
  const location = useLocation();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract active user & project context
  const user = JSON.parse(localStorage.getItem("hydra_user") || "{}");
  const isProUser = user.tier === "PRO";

  const searchParams = new URLSearchParams(location.search);
  const projectId = params.projectId || searchParams.get("projectId");
  const runId = params.runId;

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleUpgradeToPro = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("hydra_token");

      // 1. Create Razorpay order on backend
      const orderRes = await axios.post(
        `${API_BASE_URL}/api/billing/create-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!orderRes.data.success) {
        throw new Error("Failed to create Razorpay payment order");
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2. Open Razorpay native modal
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Hydra AI",
        description: "Hydra Pro Monthly Subscription",
        image: "/hydralogo.png",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // 3. Verify payment signature on backend
            const verifyRes = await axios.post(
              `${API_BASE_URL}/api/billing/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              // Update local user state
              const updatedUser = { ...user, tier: "PRO" };
              localStorage.setItem("hydra_user", JSON.stringify(updatedUser));

              setIsModalOpen(false);
              alert(" Payment Successful! Account upgraded to Hydra Pro.");
              window.location.reload();
            }
          } catch (verifyErr: any) {
            console.error("Verification failed:", verifyErr);
            alert("Payment signature verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay order creation failed:", err);
      alert(err.response?.data?.message || "Failed to initiate Razorpay checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-[#1f1f23] bg-[#020202] flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col p-5 gap-7">
          {/* Logo Branding */}
          <div>
            <Link to="/dashboard" className="text-3xl tracking-wider text-white-400 font font-bold flex justify-center">
              <span className="rounded"></span>
              <div className="flex justify-center items-center gap-2 font-sans font-boldonse leading-[0.3rem] text-white">
                <img className="h-[40px]" src="/hydralogo.png" alt="" />
               <span className="text-xl"> Hydra </span>
              </div>
            </Link>
            <p className="text-[14px] text-[#a1a1aa] font-josefin mt-0.5 py-2 flex items-center justify-center">
              Visual Regression <span className="ml-1.5 px-1 py-0.2 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-900/30 text-[10px]">beta</span>
            </p>
          </div>

          {/* SaaS Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <Link
              to={projectId ? `/dashboard?projectId=${projectId}` : "/dashboard"}
              className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                isActive("/dashboard") && !location.pathname.includes("/runs")
                  ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <LayoutGrid className="size-4 shrink-0 text-indigo-400" />
              Dashboard
            </Link>

            {/* Render Visual Debugger tab only if inside a run inspection report */}
            {projectId && runId && (
              <Link
                to={`/runs/${runId}?projectId=${projectId}`}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                  isActive("/runs")
                    ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Play className="size-4 shrink-0 text-indigo-400" />
                Visual Debugger
              </Link>
            )}

            {/* Render Developer Settings */}
            <Link
              to={projectId ? `/projects/${projectId}/settings` : "/settings"}
              className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                isActive(`/projects`) || isActive('/settings')
                  ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Key className="size-4 shrink-0 text-indigo-400" />
              Developer Settings
            </Link>

            {/* Documentation */}
            <Link
              to="/docs"
              className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
                isActive("/docs")
                  ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <BookOpen className="size-4 shrink-0 text-indigo-400" />
              Documentation
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar Section */}
        <div className="p-4 border-t border-[#1f1f23]/60 flex flex-col gap-3">
          
          {/* Native Linear-Style Account Status Panel */}
          {isProUser ? (
            <div className="rounded-lg border border-[#1f1f23] bg-[#0d0d0f] p-3 flex flex-col gap-2 select-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-[#a1a1aa]" />
                  <span className="text-[12px] font-semibold text-white">Hydra Pro</span>
                </div>
              </div>
              <p className="text-[11px] text-[#71717a] leading-tight">
                Auto-Healing & Unlimited Scans
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[11px] font-medium text-[#a1a1aa] hover:text-white flex items-center gap-1 transition-colors mt-0.5 text-left cursor-pointer"
              >
                <span>Manage Plan</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-[#1f1f23] bg-[#0d0d0f] p-3 flex flex-col gap-2 select-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-3.5 text-[#71717a]" />
                  <span className="text-[12px] font-semibold text-white">Free Plan</span>
                </div>
              </div>
              <p className="text-[11px] text-[#71717a] leading-tight">
                Standard Visual Inspection
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[11px] font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors mt-0.5 text-left cursor-pointer"
              >
                <span>Upgrade to Pro</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/*  Razorpay Pro Plan Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#09090b] border border-[#1f1f23] rounded-2xl p-6 shadow-2xl flex flex-col gap-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#71717a] hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col gap-1 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl overflow-hidden border border-[#27272a] flex items-center justify-center mb-2 shadow-md">
                <img src="/hydralogo.png" className="w-full h-full object-cover" alt="Hydra Logo" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Supercharge your Visual Testing</h2>
              <p className="text-xs text-[#a1a1aa]">
                Upgrade to Hydra Pro to automate code healing and protect production builds.
              </p>
            </div>

            {/* Plan Comparison Matrix */}
            <div className="grid grid-cols-2 gap-4 my-2">
              {/* Free Plan Card */}
              <div className="border border-[#1f1f23] bg-[#0d0d0f] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Free Tier</span>
                  <div className="text-2xl font-bold text-white mt-1">₹0 <span className="text-xs font-normal text-[#71717a]">/ month</span></div>
                  <p className="text-[11px] text-[#71717a] mt-2 mb-4">Essential visual regression detection for individual projects.</p>

                  <ul className="flex flex-col gap-2.5 text-[11px] text-[#d4d4d8]">
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400 shrink-0" /> Standard Visual Comparison</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400 shrink-0" /> Side-by-side & Diff Overlays</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400 shrink-0" /> Basic CLI Integration</li>
                    <li className="flex items-center gap-2 text-[#52525b]"><X className="size-3.5 shrink-0" /> AI Auto-Healing Subagents</li>
                    <li className="flex items-center gap-2 text-[#52525b]"><X className="size-3.5 shrink-0" /> Automatic Candidate Branch PRs</li>
                  </ul>
                </div>

                {!isProUser && (
                  <div className="mt-6 pt-3 border-t border-[#1f1f23] text-center text-xs font-medium text-[#71717a]">
                    Current Active Plan
                  </div>
                )}
              </div>

              {/* Pro Plan Card */}
              <div className="relative border border-violet-500/40 bg-gradient-to-b from-violet-950/30 to-[#0d0d0f] rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-violet-500/5">
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended
                </div>

                <div>
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Hydra Pro</span>
                  <div className="text-2xl font-bold text-white mt-1">₹3,200 <span className="text-xs font-normal text-[#71717a]">/ month</span></div>
                  <p className="text-[11px] text-[#a1a1aa] mt-2 mb-4">Autonomous code healing and continuous integration workflows.</p>

                  <ul className="flex flex-col gap-2.5 text-[11px] text-[#e4e4e7]">
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-emerald-400 shrink-0" /> Everything in Free</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-violet-400 shrink-0" /><span className="font-semibold text-white">AI Auto-Healing Subagents</span></li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-violet-400 shrink-0" /><span className="font-semibold text-white">🌿 Candidate Branch Git Commits</span></li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-violet-400 shrink-0" /> Programmatic Localhost Tunneling</li>
                    <li className="flex items-center gap-2"><Check className="size-3.5 text-violet-400 shrink-0" /> Unlimited Visual Captures</li>
                  </ul>
                </div>

                {isProUser ? (
                  <div className="mt-6 py-2.5 px-4 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-2">
                    <Check className="size-4 text-emerald-400" />
                    <span>Current Active Plan</span>
                  </div>
                ) : (
                  <button
                    onClick={handleUpgradeToPro}
                    disabled={loading}
                    className="mt-6 w-full py-2.5 px-4 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-violet-600/30 disabled:opacity-50"
                  >
                    {loading ? (
                      <><Loader2 className="size-4 animate-spin" /> Opening Razorpay...</>
                    ) : (
                      <>Pay with UPI / Cards <Sparkles className="size-3.5" /></>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Footer Guarantee */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-[#71717a]">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              <span>Instant checkout via Razorpay (UPI, Cards, Netbanking). Cancel anytime.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}