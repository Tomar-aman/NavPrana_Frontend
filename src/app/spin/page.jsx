"use client";

import { useEffect, useRef, useState } from "react";
import PrivateRoute from "../../../components/PrivateRoute";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Gift, Tag, RefreshCw, Trophy, Lock, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const WHEEL_SECTORS = [
  { id: "free_500ml", label: "Free Ghee 500ml", color: "#d97706", textColor: "#ffffff" }, // Amber
  { id: "try_again", label: "Better Luck", color: "#f3f4f6", textColor: "#4b5563" },     // Light Gray
  { id: "free_shipping", label: "Free Shipping", color: "#16a34a", textColor: "#ffffff" }, // Green
  { id: "discount_50", label: "₹50 OFF", color: "#2563eb", textColor: "#ffffff" },        // Blue
  { id: "discount_10", label: "10% OFF", color: "#7c3aed", textColor: "#ffffff" },        // Purple
  { id: "try_again", label: "Try Again", color: "#e5e7eb", textColor: "#4b5563" },        // Gray
  { id: "discount_100", label: "₹100 OFF", color: "#db2777", textColor: "#ffffff" },       // Pink
  { id: "try_again", label: "Better Luck", color: "#f3f4f6", textColor: "#4b5563" },      // Light Gray
];

export default function SpinPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  
  const [canSpin, setCanSpin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [prizeModal, setPrizeModal] = useState(null);
  
  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const animationFrameRef = useRef(null);

  // 1. Fetch Eligibility
  const checkEligibility = async () => {
    try {
      const API = (await import("@/services/api")).default;
      const res = await API.get("api/v1/coupon/spin-check/");
      setCanSpin(res.data.can_spin);
      setStatusMessage(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to check spin eligibility");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkEligibility();
  }, []);

  // 3. Draw the Canvas Wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const radius = size / 2;
    const arc = (2 * Math.PI) / WHEEL_SECTORS.length;

    const drawWheel = (angle) => {
      ctx.clearRect(0, 0, size, size);
      
      // Save canvas state
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle);

      WHEEL_SECTORS.forEach((sector, i) => {
        const sectorAngle = i * arc;
        
        // Draw Pie slice
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius - 10, sectorAngle, sectorAngle + arc);
        ctx.lineTo(0, 0);
        ctx.fill();
        
        // Slice border line
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Text inside sector
        ctx.save();
        ctx.fillStyle = sector.textColor;
        ctx.translate(0, 0);
        ctx.rotate(sectorAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.fillText(sector.label, radius - 30, 0);
        ctx.restore();
      });

      ctx.restore();

      // Outer golden border rim
      ctx.beginPath();
      ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
      ctx.strokeStyle = "#fbbf24"; // amber-400
      ctx.lineWidth = 10;
      ctx.stroke();

      // Center Pin Cap (Wheel hub)
      ctx.beginPath();
      ctx.arc(radius, radius, 18, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 10;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(radius, radius, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
    };

    drawWheel(currentAngleRef.current);
    
    // Save drawing callback to ref so we can rotate smoothly
    canvas.drawWheel = drawWheel;
  }, [loading]);

  // 4. Spin Action Trigger
  const handleSpin = async () => {
    if (spinning || !canSpin) return;
    setSpinning(true);

    try {
      const API = (await import("@/services/api")).default;
      const res = await API.post("api/v1/coupon/spin/");
      const { prize_id, prize_name, coupon_code } = res.data;

      // Find the index of the won sector (excluding "try_again" mismatches)
      const matchingSectorIndices = WHEEL_SECTORS.map((s, idx) => s.id === prize_id ? idx : -1).filter(idx => idx !== -1);
      // Pick a random matching segment index if multiple exist (like try_again)
      const targetIndex = matchingSectorIndices[Math.floor(Math.random() * matchingSectorIndices.length)];

      // Standardize degrees: 360 / 8 = 45 degrees per sector
      const sectorArcDegrees = 360 / WHEEL_SECTORS.length;
      
      // Calculate target angle to line up the sector with top pointer (which is at -90 degrees or 270 degrees in canvas terms)
      // Top pointer is 270 degrees. Landing sector should end up there.
      const targetSectorCenterDegrees = (targetIndex * sectorArcDegrees) + (sectorArcDegrees / 2);
      const alignedLandingDegrees = 270 - targetSectorCenterDegrees;
      
      // Spin at least 6 full circles + aligned offset
      const startRotationDegrees = (currentAngleRef.current * 180) / Math.PI;
      const targetRotationDegrees = startRotationDegrees + (360 * 6) + ((alignedLandingDegrees - (startRotationDegrees % 360) + 360) % 360);
      
      const startRotationRadians = currentAngleRef.current;
      const targetRotationRadians = (targetRotationDegrees * Math.PI) / 180;
      
      const duration = 4500; // 4.5 seconds
      const startTime = performance.now();

      const animateWheel = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Premium Ease Out Cubic function
        const easeOutFactor = 1 - Math.pow(1 - progress, 3);
        
        const currentAngle = startRotationRadians + (targetRotationRadians - startRotationRadians) * easeOutFactor;
        currentAngleRef.current = currentAngle;
        
        if (canvasRef.current && canvasRef.current.drawWheel) {
          canvasRef.current.drawWheel(currentAngle);
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateWheel);
        } else {
          // Finished spinning!
          setSpinning(false);
          setCanSpin(false);
          
          if (coupon_code) {
            setPrizeModal({ name: prize_name, code: coupon_code });
            toast.success(`🎉 You won: ${prize_name}!`);
          } else {
            toast.info("😢 Better luck next time!");
            setStatusMessage("No luck this time! Check back tomorrow.");
          }
          
          checkEligibility();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateWheel);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to spin the wheel");
      setSpinning(false);
    }
  };



  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50/50 pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl flex items-center justify-center gap-2">
              Lucky Spin Wheel 🎡
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Try your luck once a day to win a premium 500ml Bilona Ghee or other exclusive checkout coupons!
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-center bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            
            {/* Left: Instructions / Status Info */}
            <div className="md:col-span-2 space-y-5">
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Trophy size={16} />
                  Spin & Win Rewards
                </div>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <b>Jackpot:</b> Free Buffalo Bilona Ghee 500ml
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    10% Off Your Entire Cart Order
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ₹100 and ₹50 Instant Cash Off
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Waived delivery charges via Free Shipping
                  </li>
                </ul>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 space-y-3 bg-gray-50/50">
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Your Spin Status</div>
                {loading ? (
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
                ) : (
                  <div className="flex items-center gap-2">
                    {canSpin ? (
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                    ) : (
                      <Lock size={14} className="text-amber-500" />
                    )}
                    <span className={`text-sm font-semibold ${canSpin ? "text-green-600" : "text-amber-600"}`}>
                      {canSpin ? "Ready to Spin!" : "Locked / Already Spun"}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500">{statusMessage}</p>
              </div>

              {canSpin ? (
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="w-full bg-primary text-white py-3 rounded-2xl font-semibold shadow-md hover:bg-primary/95 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={16} className={spinning ? "animate-spin" : ""} />
                  {spinning ? "Spinning..." : "Spin the Wheel!"}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 py-3 rounded-2xl font-semibold border border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  Already Spun Today
                </button>
              )}
            </div>

            {/* Right: The Interactive Canvas Wheel */}
            <div className="md:col-span-3 flex flex-col items-center justify-center relative py-6">
              
              {/* Wheel Pointer arrow indicator at top */}
              <div className="absolute top-1 z-20 flex flex-col items-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-white shadow flex items-center justify-center text-xs">⭐</div>
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-yellow-500 -mt-1 drop-shadow" />
              </div>

              {/* Wheel Container circle */}
              <div className="relative rounded-full shadow-2xl p-2 border-8 border-gray-800 bg-gray-900">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={340}
                  className="rounded-full max-w-full aspect-square"
                />
              </div>
            </div>
          </div>

          {/* Winning modal popup */}
          {prizeModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-6 text-center transform scale-100 transition-all">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold animate-bounce">
                  🎉
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-gray-900">Congratulations!</h2>
                  <p className="text-sm text-gray-500">
                    You have successfully spun the wheel and won a premium prize:
                  </p>
                  <div className="text-lg font-bold text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 inline-block mt-1">
                    {prizeModal.name}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Your Coupon Code</div>
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2 font-mono font-bold text-gray-800 text-sm">
                    <span>{prizeModal.code}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(prizeModal.code);
                        toast.success("Coupon code copied!");
                      }}
                      className="p-1.5 hover:bg-gray-50 rounded-lg text-primary cursor-pointer border border-gray-100 shadow-sm"
                      title="Copy code"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    This coupon is unique to you and will expire in 7 days. Apply it on checkout.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPrizeModal(null);
                      router.push("/profile");
                    }}
                    className="flex-1 border border-gray-200 hover:bg-gray-50 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-gray-700"
                  >
                    View My Coupons
                  </button>
                  <button
                    onClick={() => {
                      setPrizeModal(null);
                      router.push("/products");
                    }}
                    className="flex-1 bg-primary text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-primary/95 transition cursor-pointer"
                  >
                    Shop Now & Redeem
                  </button>
                </div>
              </div>
            </div>
          )}



        </div>
      </main>
    </PrivateRoute>
  );
}
