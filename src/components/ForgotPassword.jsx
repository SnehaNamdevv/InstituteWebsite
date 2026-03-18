import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const TOTAL_SECONDS = 120;

// ── Step indicators ──────────────────────────────────────────────
const steps = ["Email", "Verify", "Reset"];

function StepDots({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {steps.map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 h-2 bg-indigo-600"
              : i < current
              ? "w-2 h-2 bg-indigo-300"
              : "w-2 h-2 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ── OTP input group ───────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const refs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      const next = [...value];
      next[i - 1] = "";
      onChange(next);
      refs[i - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    text.split("").forEach((ch, j) => (next[j] = ch));
    onChange(next);
    refs[Math.min(text.length, 5)].current?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center my-6">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all duration-200 font-mono
            ${
              value[i]
                ? "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm"
                : "border-gray-200 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
        />
      ))}
    </div>
  );
}

// ── Countdown timer ───────────────────────────────────────────────
function CountdownTimer({ remaining, total }) {
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const pct = (remaining / total) * 100;

  const timerColor =
    remaining <= 0
      ? "text-red-500"
      : remaining <= 60
      ? "text-amber-500"
      : "text-indigo-600";

  const barColor =
    remaining <= 0
      ? "bg-red-400"
      : remaining <= 60
      ? "bg-amber-400"
      : "bg-indigo-500";

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 tracking-wide uppercase font-medium">
          Code expires in
        </span>
        <span
          className={`font-mono text-lg font-bold tabular-nums transition-colors duration-300 ${timerColor}`}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Step 1 – Email ────────────────────────────────────────────────
function StepEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async () => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  try {
    const res = await fetch(
      "https://institute-backend-0ncp.onrender.com/student/forget-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setError("");
      onNext(email);
    } else {
      setError(data.message || "Email not registered");
    }
  } catch (err) {
    console.log(err);
    setError("Server error");
  }
};

  return (
    <div>
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h2 className="text-[22px] font-semibold text-gray-900 mb-1.5">Forgot password?</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Enter your email and we'll send a 6-digit verification code to reset your password.
      </p>

      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        Email address
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="you@example.com"
        className={`w-full h-11 px-3.5 rounded-xl border text-sm outline-none transition-all duration-200 mb-1
          ${error ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100" : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
      />
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      {!error && <div className="mb-4" />}

      <button
        onClick={handleSubmit}
        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-150 mb-3"
      >
        Send verification code
      </button>
      <button className="w-full h-10 border border-gray-200 text-gray-500 text-sm rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
              <Link
        to="/login"
        className="text-indigo-600 font-medium hover:underline"
      >
        Back to Login / Signup
      </Link>

      </button>
      <StepDots current={0} />
    </div>
  );
}

// ── Step 2 – Verify OTP ───────────────────────────────────────────
function StepVerify({ email, onNext, onBack }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    setRemaining(TOTAL_SECONDS);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

 const handleResend = async () => {
  await fetch(
    "https://institute-backend-0ncp.onrender.com/student/forget-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  setOtp(Array(6).fill(""));
  startTimer();
};
const handleVerify = async () => {
  const otpCode = otp.join("");

  if (otpCode.length < 6) return;

  try {
    const res = await fetch(
      "https://institute-backend-0ncp.onrender.com/student/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      onNext();
    } else {
      alert(data.message || "Invalid OTP");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>
      <h2 className="text-[22px] font-semibold text-gray-900 mb-1.5">Enter your code</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-2">
        A 6-digit code was sent to{" "}
        <span className="font-semibold text-gray-800">{email}</span>.
      </p>

      <OTPInput value={otp} onChange={setOtp} />

      <CountdownTimer remaining={remaining} total={TOTAL_SECONDS} />

      <div className="text-center text-sm text-gray-400 mb-5">
        Didn't receive it?{" "}
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`font-semibold underline underline-offset-2 transition-colors ${
            canResend ? "text-indigo-600 hover:text-indigo-800 cursor-pointer" : "text-gray-300 cursor-not-allowed"
          }`}
        >
          Resend code
        </button>
      </div>

      <button
        onClick={handleVerify}
        disabled={otp.join("").length < 6}
        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-150 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Verify code
      </button>
      <StepDots current={1} />
    </div>
  );
}

// ── Step 3 – New password ─────────────────────────────────────────
function StepReset({ email, onNext, onBack }) {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [errors, setErrors] = useState({});
const handleReset = async () => {
  if (!validate()) return;

  try {
    const res = await fetch(
      "https://institute-backend-0ncp.onrender.com/student/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pw1,   
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      onNext();
    } else {
      alert(data.message || "Password reset failed");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};
  const validate = () => {
    const e = {};
    if (pw1.length < 8) e.pw1 = "At least 8 characters required.";
    if (pw1 !== pw2) e.pw2 = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const strength = pw1.length === 0 ? 0 : pw1.length < 8 ? 1 : pw1.length < 12 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-400"][strength];
  const strengthText = ["", "text-red-500", "text-amber-500", "text-emerald-600"][strength];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back
      </button>

      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      </div>
      <h2 className="text-[22px] font-semibold text-gray-900 mb-1.5">New password</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Choose a strong password you haven't used before.
      </p>

      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        New password
      </label>
      <input
        type="password"
        value={pw1}
        onChange={(e) => { setPw1(e.target.value); setErrors({}); }}
        placeholder="At least 8 characters"
        className={`w-full h-11 px-3.5 rounded-xl border text-sm outline-none transition-all mb-1
          ${errors.pw1 ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100" : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
      />
      {pw1.length > 0 && (
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-1 flex-1">
            {[1,2,3].map(n => (
              <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= n ? strengthColor : "bg-gray-200"}`} />
            ))}
          </div>
          <span className={`text-xs font-medium ${strengthText}`}>{strengthLabel}</span>
        </div>
      )}
      {errors.pw1 && <p className="text-xs text-red-500 mb-1">{errors.pw1}</p>}
      <div className="mb-4" />

      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        Confirm password
      </label>
      <input
        type="password"
        value={pw2}
        onChange={(e) => { setPw2(e.target.value); setErrors({}); }}
        placeholder="Repeat your new password"
        className={`w-full h-11 px-3.5 rounded-xl border text-sm outline-none transition-all mb-1
          ${errors.pw2 ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100" : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"}`}
      />
      {errors.pw2 && <p className="text-xs text-red-500 mb-1">{errors.pw2}</p>}
      <div className="mb-5" />

      <button
  onClick={handleReset}
  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-150"
>
  Reset password
</button>
      <StepDots current={2} />
    </div>
  );
}

// ── Step 4 – Success ──────────────────────────────────────────────
function StepSuccess({ onRestart }) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5 animate-[popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
        <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h2 className="text-[22px] font-semibold text-gray-900 mb-2">Password reset!</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">
        Your password has been updated successfully. You can now sign in with your new credentials.
      </p>
      <button
        onClick={onRestart}
        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all"
      >
        Back to sign in
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      {/* Decorative bg blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        {/* Top accent bar */}
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-indigo-500 via-emerald-400 to-orange-400" />

        <div className="bg-white border border-gray-100 rounded-b-2xl shadow-sm px-7 py-8">
          {step === 0 && (
            <StepEmail onNext={(em) => { setEmail(em); setStep(1); }} />
          )}
          {step === 1 && (
            <StepVerify email={email} onNext={() => setStep(2)} onBack={() => setStep(0)} />
          )}
         {step === 2 && (
  <StepReset
    email={email}
    onNext={() => setStep(3)}
    onBack={() => setStep(1)}
  />
)}
          {step === 3 && (
            <StepSuccess onRestart={() => { setEmail(""); setStep(0); }} />
          )}
        </div>
      </div>

      {/* Keyframe for success pop */}
      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}