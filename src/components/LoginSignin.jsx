import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
const API = "https://institute-backend-0ncp.onrender.com";
function BlobBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-20%", left: "-15%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle,#dbeafe 0%,#ede9fe 40%,transparent 70%)",
        filter: "blur(60px)", opacity: 0.8,
        animation: "blobMove1 18s ease-in-out infinite alternate"
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle,#fce7f3 0%,#e0f2fe 50%,transparent 70%)",
        filter: "blur(70px)", opacity: 0.7,
        animation: "blobMove2 22s ease-in-out infinite alternate"
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle,#d1fae5 0%,#fef3c7 50%,transparent 70%)",
        filter: "blur(50px)", opacity: 0.5,
        animation: "blobMove3 15s ease-in-out infinite alternate"
      }} />
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function LoginSignin() {
  const [mode, setMode] = useState("signin");
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const [institutes, setInstitutes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loginType, setLoginType] = useState(); // student or parent

  const set = (key) => (e) => {
    const value = key === "remember" ? e.target.checked : e.target.value;

    setForm({ ...form, [key]: value });

    // clear message when typing
    setMessage("");
  };

  useEffect(() => {
fetch(`${API}/institute/allInstitute`)
    .then(res => res.json())
      .then(data => {
        setInstitutes(data.institutes); // correct key
      })
      .catch(err => console.log(err));
  }, []);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginType: "student",
  firstName: "",
  email: "",
  contactNo: "",
  dob: "",
  address: "",
  instituteName: "",
  password: "",
  confirm: "",
  remember: false,
  parentContactNo: "",
});

  const switchMode = m => { setMode(m); setStep(1); setSuccess(false); setAnimKey(k => k + 1); };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // STEP 1 → move to step 2
    if (mode === "signup" && step === 1) {
      setStep(2);
      setAnimKey(k => k + 1);
      return;
    }

    try {

 // ================= LOGIN =================
if (mode === "signin") {
  try {
    const res = await fetch(
      "https://institute-backend-0ncp.onrender.com/student/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(true);
      setMessage(data.message || "Login failed");
      return;
    }

    // ✅ store student only
    if (!data.student || !data.student.studentID) {
      setError(true);
      setMessage("Invalid student data from server");
      return;
    }

    localStorage.setItem("student", JSON.stringify(data.student));

    setError(false);
    setMessage("Login successful. Redirecting...");
    setTimeout(() => {
      navigate("/dashboard"); // use react-router navigate
    }, 1000);

  } catch (err) {
    console.error(err);
    setError(true);
    setMessage("Server error");
  }
}

      // ================= REGISTER =================
      if (mode === "signup" && step === 2) {

        const res = await fetch(
    "https://institute-backend-0ncp.onrender.com/student/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: form.firstName,
              email: form.email,
              contactNo: form.contactNo,
              dob: form.dob,
              address: form.address,
              instituteName: form.instituteName,
              password: form.password,
            }),
          }
        );

        const data = await res.json();
        if (res.ok) {

          setError(false);
          setMessage("Login successful. Redirecting...");
          setSuccess(true);

          localStorage.setItem("auth", "true");
          localStorage.setItem("student", JSON.stringify(data.student));

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);

        } else {

          setError(true);
          setMessage(data.message || "Student not found");

        }


      }

    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };
  const strength = p => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p) && /[0-9!@#$]/.test(p)) s++;
    return s;
  };
  const pw = strength(form.password);
  const pwMeta = [null, { label: "Weak", color: "#f87171" }, { label: "Good", color: "#fb923c" }, { label: "Strong", color: "#34d399" }];

  const css = `
 
 
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
 
    .auth-wrap {
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family:'Plus Jakarta Sans',sans-serif;
      background:#f8f7ff;
      padding:24px 16px;
      position:relative;
    }
 
    @keyframes blobMove1 { from{transform:translate(0,0) scale(1)} to{transform:translate(60px,40px) scale(1.15)} }
    @keyframes blobMove2 { from{transform:translate(0,0) scale(1)} to{transform:translate(-50px,30px) scale(1.1)} }
    @keyframes blobMove3 { from{transform:translate(0,0) scale(1)} to{transform:translate(30px,-40px) scale(1.2)} }
 
    .outer-card {
      position:relative; z-index:1;
      width:100%; max-width:980px;
      display:grid;
      grid-template-columns:1fr 1fr;
      border-radius:32px;
      overflow:hidden;
      box-shadow:0 40px 100px rgba(99,102,241,0.12),0 8px 32px rgba(0,0,0,0.06);
      animation:cardRise 0.65s cubic-bezier(.22,.68,0,1.15) both;
    }
    @keyframes cardRise { from{opacity:0;transform:translateY(48px) scale(0.97)} to{opacity:1;transform:none} }
 
    @media(max-width:700px) {
      .outer-card { grid-template-columns:1fr; max-width:440px; }
      .left-panel { display:none; }
    }
 
    /* LEFT PANEL */
    .left-panel {
      background:linear-gradient(145deg,#6366f1 0%,#8b5cf6 45%,#a78bfa 100%);
      padding:48px 40px;
      display:flex; flex-direction:column; justify-content:space-between;
      position:relative; overflow:hidden;
    }
    .left-panel::before {
      content:'';
      position:absolute; inset:0;
      background:url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='350' cy='50' r='200' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='50' cy='350' r='160' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='200' cy='200' r='80' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E");
      background-size:cover;
    }
    .left-dots {
      position:absolute; inset:0; pointer-events:none;
      background-image:radial-gradient(circle,rgba(255,255,255,0.12) 1px,transparent 1px);
      background-size:28px 28px;
    }
 
    .left-logo { position:relative; z-index:1; }
    .logo-badge {
      display:inline-flex; align-items:center; gap:10px;
      background:rgba(255,255,255,0.15);
      border:1px solid rgba(255,255,255,0.25);
      border-radius:50px;
      padding:8px 16px 8px 8px;
      backdrop-filter:blur(8px);
    }
    .logo-icon {
      width:36px; height:36px; border-radius:50%;
      background:rgba(255,255,255,0.2);
      display:flex; align-items:center; justify-content:center;
    }
    .logo-text { font-size:12px; font-weight:700; color:white; letter-spacing:1px; text-transform:uppercase; }
 
    .left-hero { position:relative; z-index:1; }
    .left-headline {
      
      font-size:38px; font-weight:700;
      color:white; line-height:1.15;
      margin-bottom:16px;
    }
    .left-headline em {  font-weight:500; opacity:0.85; }
    .left-desc { font-size:14px; color:rgba(255,255,255,0.75); line-height:1.7; max-width:280px; }
 
    .feat-list { position:relative; z-index:1; display:flex; flex-direction:column; gap:12px; }
    .feat-item {
      display:flex; align-items:center; gap:12px;
      background:rgba(255,255,255,0.1);
      border:1px solid rgba(255,255,255,0.15);
      border-radius:14px;
      padding:12px 16px;
      backdrop-filter:blur(4px);
      transition:background 0.2s;
    }
    .feat-item:hover { background:rgba(255,255,255,0.16); }
    .feat-icon {
      width:34px; height:34px; border-radius:10px;
      background:rgba(255,255,255,0.2);
      display:flex; align-items:center; justify-content:center;
      font-size:16px; flex-shrink:0;
    }
    .feat-label { font-size:13px; font-weight:500; color:white; }
    .feat-sub { font-size:11px; color:rgba(255,255,255,0.6); margin-top:1px; }
 
    .avatar-row { position:relative; z-index:1; display:flex; align-items:center; gap:12px; }
    .avatars { display:flex; }
    .av {
      width:32px; height:32px; border-radius:50%;
      border:2px solid rgba(255,255,255,0.6);
      display:flex; align-items:center; justify-content:center;
      font-size:10px; font-weight:700; color:white;
      margin-left:-8px; flex-shrink:0;
    }
    .av:first-child { margin-left:0; }
    .av-text { font-size:12px; color:rgba(255,255,255,0.8); }
    .av-text strong { color:white; }
 
    /* RIGHT PANEL */
    .right-panel {
      background:white;
      padding:44px 40px 36px;
      display:flex; flex-direction:column; justify-content:center;
    }
 
    .tab-row {
      display:flex;
      background:#f3f4f6;
      border-radius:14px;
      padding:4px;
      margin-bottom:28px;
    }
    .tab-btn {
      flex:1; height:38px; border:none; cursor:pointer;
      border-radius:11px; 
      font-size:13px; font-weight:600;
      transition:all 0.25s cubic-bezier(.34,1.56,.64,1);
      background:transparent; color:#9ca3af; letter-spacing:0.2px;
    }
    .tab-btn.active {
      background:white; color:#6366f1;
      box-shadow:0 2px 12px rgba(99,102,241,0.15),0 1px 3px rgba(0,0,0,0.08);
    }
 
    .greeting { margin-bottom:24px; }
    .greeting-title {
      font-size:26px; font-weight:700; color:#111827; line-height:1.2;
      margin-bottom:4px;
    }
    .greeting-sub { font-size:13px; color:#9ca3af; font-weight:400; }
 
    .form-group { margin-bottom:16px; }
    .form-label {
      display:flex; justify-content:space-between; align-items:center;
      font-size:11px; font-weight:700; letter-spacing:1.5px;
      text-transform:uppercase; color:#9ca3af; margin-bottom:7px;
      transition:color 0.2s;
    }
    .form-group.is-focused .form-label { color:#6366f1; }
    .form-label a { font-size:11px; font-weight:600; color:#6366f1; cursor:pointer; letter-spacing:0; text-transform:none; text-decoration:none; }
    .form-label a:hover { text-decoration:underline; }
 
    .input-wrap { position:relative; }
    .form-input {
      width:100%; height:48px;
      padding:0 46px 0 16px;
      border:1.5px solid #e5e7eb;
      border-radius:13px;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:14px; font-weight:400; color:#111827;
      background:#fafafa;
      outline:none; transition:all 0.2s ease;
      -webkit-appearance:none;
    }
    .form-input::placeholder { color:#d1d5db; }
    .form-input:focus {
      border-color:#6366f1;
      background:white;
      box-shadow:0 0 0 4px rgba(99,102,241,0.08);
    }
    select.form-input {
      appearance:none; cursor:pointer;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'%3E%3Cpath fill='%236366f1' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 14px center;
    }
    select.form-input option { color:#111827; background:white; }
 
    .eye-btn {
      position:absolute; right:14px; top:50%; transform:translateY(-50%);
      background:none; border:none; cursor:pointer;
      color:#d1d5db; padding:2px; transition:color 0.2s;
    }
    .eye-btn:hover { color:#6366f1; }
 
    .two-col { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    @media(max-width:480px) { .two-col { grid-template-columns:1fr; } }
 
    .pw-meter { display:flex; gap:4px; align-items:center; margin-top:8px; }
    .pw-seg { height:3px; flex:1; border-radius:2px; background:#f3f4f6; transition:all 0.35s ease; }
    .pw-lbl { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-left:8px; min-width:40px; transition:color 0.3s; }
 
    .btn-main {
      width:100%; height:50px;
      border:none; border-radius:14px; cursor:pointer;
      font-size:14px; font-weight:700; letter-spacing:0.3px;
      color:white;
      background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);
      position:relative; overflow:hidden;
      transition:all 0.25s ease;
      display:flex; align-items:center; justify-content:center; gap:8px;
    }
    .btn-main::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%);
      pointer-events:none;
    }
    .btn-main:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(99,102,241,0.38); }
    .btn-main:active { transform:translateY(0); box-shadow:0 4px 12px rgba(99,102,241,0.25); }
 
    .btn-back {
      flex:1; height:50px; border:1.5px solid #e5e7eb;
      border-radius:14px; cursor:pointer; background:white;
      font-size:14px; font-weight:600; color:#6b7280;
      transition:all 0.2s;
    }
    .btn-back:hover { border-color:#6366f1; color:#6366f1; background:#fafafa; }
 
    .btn-google {
      width:100%; height:48px;
      border:1.5px solid #e5e7eb; border-radius:13px;
      background:white; cursor:pointer;
      font-size:13px; font-weight:600; color:#374151;
      display:flex; align-items:center; justify-content:center; gap:10px;
      transition:all 0.2s;
    }
    .btn-google:hover { border-color:#d1d5db; background:#fafafa; box-shadow:0 4px 12px rgba(0,0,0,0.06); }
 
    .or-row {
      display:flex; align-items:center; gap:12px;
      margin:16px 0; font-size:11px; font-weight:600;
      letter-spacing:2px; text-transform:uppercase; color:#d1d5db;
    }
    .or-row::before,.or-row::after { content:''; flex:1; height:1px; background:#f3f4f6; }
 
    .switch-txt {
      text-align:center; margin-top:20px;
      font-size:13px; color:#9ca3af;
    }
    .switch-link {
      background:none; border:none; cursor:pointer;
      font-size:13px; font-weight:700; color:#6366f1;
      text-decoration:none; transition:opacity 0.2s;
    }
    .switch-link:hover { opacity:0.75; text-decoration:underline; }
 
    .remember-row {
      display:flex; align-items:center; justify-content:space-between;
      margin:2px 0 18px;
    }
    .check-wrap { display:flex; align-items:center; gap:8px; cursor:pointer; }
    .check-wrap input[type=checkbox] { width:15px; height:15px; accent-color:#6366f1; cursor:pointer; }
    .check-wrap span { font-size:13px; color:#6b7280; }
 
    .steps-row { display:flex; align-items:flex-start; gap:0; margin-bottom:26px; }
    .step-item { display:flex; flex-direction:column; align-items:center; flex:1; }
    .step-circle {
      width:32px; height:32px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:12px; font-weight:700;
      border:2px solid #e5e7eb; color:#d1d5db; background:white;
      transition:all 0.35s cubic-bezier(.34,1.56,.64,1);
    }
    .step-circle.active { border-color:#6366f1; color:#6366f1; background:#eef2ff; box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
    .step-circle.done { border-color:#6366f1; background:#6366f1; color:white; }
    .step-name { font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-top:6px; color:#d1d5db; }
    .step-name.active,.step-name.done { color:#6366f1; }
    .step-connector { flex:1; height:2px; background:#f3f4f6; margin-top:15px; position:relative; overflow:hidden; border-radius:2px; }
    .step-connector-fill { height:100%; background:linear-gradient(90deg,#6366f1,#8b5cf6); transition:width 0.5s ease; border-radius:2px; }
 
    .success-box {
      background:linear-gradient(135deg,#ecfdf5,#f0fdf4);
      border:1.5px solid #6ee7b7;
      border-radius:14px; padding:14px 16px;
      display:flex; align-items:center; gap:12px;
      margin-bottom:20px;
      animation:successPop 0.4s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes successPop { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
    .success-icon { width:32px; height:32px; border-radius:50%; background:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .success-msg { font-size:13px; font-weight:600; color:#065f46; }
 
    .form-slide { animation:slideForm 0.35s cubic-bezier(.22,.68,0,1.1) both; }
    @keyframes slideForm { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
 
    .mismatch-txt { font-size:11px; color:#ef4444; font-weight:500; margin-top:5px; }
 
    .terms-note {
      background:#faf5ff; border:1px solid #e9d5ff;
      border-radius:11px; padding:11px 14px;
      font-size:12px; color:#7c3aed; line-height:1.6;
      margin-bottom:16px;
    }
    .terms-note a { color:#6d28d9; font-weight:600; cursor:pointer; text-decoration:underline; }
 
    .btn-row { display:flex; gap:10px; }
 
    .input-icon {
      position:absolute; left:14px; top:50%; transform:translateY(-50%);
      color:#d1d5db; pointer-events:none; transition:color 0.2s;
    }
    .form-group.is-focused .input-icon { color:#6366f1; }
    .form-input.has-icon { padding-left:42px; }
  `;

  return (
    <>
      <style>{css}</style>
      <BlobBg />
      <div className="auth-wrap">
        <div className="outer-card">

          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div className="left-dots" />

            <div className="left-logo">
              <div className="logo-badge">
                <div className="logo-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <span className="logo-text">Apna Institute</span>
              </div>
            </div>

            <div className="left-hero">
              <div className="left-headline">
                Learn.<br />Grow.<br />
              </div>
              <p className="left-desc">
                Your all-in-one student portal — access grades, schedules, resources and connect .
              </p>
            </div>

            <div className="feat-list">
              {[
                { icon: "📚", label: "Course Materials", sub: "Assignments, notes & recordings" },
                { icon: "📊", label: "Grade Tracker", sub: "Live marks & GPA calculator" },
                { icon: "🗓️", label: "Smart Timetable", sub: "Classes, exams & deadlines" },
              ].map(f => (
                <div className="feat-item" key={f.label}>
                  <div className="feat-icon">{f.icon}</div>
                  <div>
                    <div className="feat-label">{f.label}</div>
                    <div className="feat-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="avatar-row">
              <div className="avatars">
                {[["#f472b6", "AS"], ["#818cf8", "MK"], ["#34d399", "PL"], ["#fb923c", "RV"], ["#60a5fa", "NJ"]].map(([c, l]) => (
                  <div className="av" key={l} style={{ background: c }}>{l}</div>
                ))}
              </div>
              <span className="av-text"><strong>12,400+</strong> students enrolled</span>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">

            <div className="tab-row">
              <button className={`tab-btn${mode === "signin" ? " active" : ""}`} onClick={() => switchMode("signin")}>Sign In</button>
              <button className={`tab-btn${mode === "signup" ? " active" : ""}`} onClick={() => switchMode("signup")}>Register</button>
            </div>

            {success && (
              <div className="success-box">
                <div className="success-icon"><CheckIcon /></div>
                <div className="success-msg">
                  {mode === "signin" ? "Welcome back! Redirecting to dashboard…" : "Account created! Check your email to verify."}
                </div>
              </div>
            )}


            <div className="greeting">
              <div className="greeting-title">
                {mode === "signin" ? "Welcome back 🖐️" : step === 1 ? "Join the campus 🎓" : "Secure your account 🔐"}
              </div>
              <div className="greeting-sub">
                {mode === "signin" ? "Sign in to your student portal" : step === 1 ? "Tell us a bit about yourself" : "Create a strong password"}
              </div>
            </div>

            {/* SIGN IN */}
            {mode === "signin" && (
<form key={`signin-${animKey}`} className="form-slide" onSubmit={handleSubmit}>
  {/* {message && (
    <div
      style={{
        background: error ? "#fee2e2" : "#ecfdf5",
        border: `1px solid ${error ? "#f87171" : "#34d399"}`,
        color: error ? "#b91c1c" : "#065f46",
        padding: "10px 14px",
        borderRadius: "10px",
        fontSize: "13px",
        marginBottom: "14px",
        fontWeight: "500"
      }}
    >
      {message}
    </div>
  )} */}

  {/* Login Type */}
  <div className="form-group">
    <label className="form-label">Login as</label>
    <select
      className="form-input"
      value={form.loginType}
      onChange={(e) => setForm({ ...form, loginType: e.target.value })}
    >
      <option value="student">Student</option>
      <option value="parent">Parent</option>
    </select>
  </div>

  {/* Conditional Fields */}
  {form.loginType === "student" ? (
    <>
      {/* Student Email */}
      <div className={`form-group${focused === "em" ? " is-focused" : ""}`}>
        <label className="form-label">Student Email</label>
        <div className="input-wrap">
          <span className="input-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          </span>
          <input
            className="form-input has-icon"
            type="email"
            placeholder="you@apexinstitute.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocused("em")}
            onBlur={() => setFocused("")}
            required
          />
        </div>
      </div>

      {/* Student Password */}
      <div className={`form-group${focused === "pw" ? " is-focused" : ""}`}>
        <Link
          to="/forgot-password"
          style={{ color: "#6366f1", fontWeight: "600", textDecoration: "none" }}
        >
          Forgot password?
        </Link>
        <div className="input-wrap">
          <span className="input-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          </span>
          <input
            className="form-input has-icon"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onFocus={() => setFocused("pw")}
            onBlur={() => setFocused("")}
            required
          />
          <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></button>
        </div>
      </div>
    </>
  ) : (
    <>
      {/* Parent Contact No */}
      <div className={`form-group${focused === "pc" ? " is-focused" : ""}`}>
        <label className="form-label">Parent Contact No.</label>
        <div className="input-wrap">
          <input
            className="form-input"
            type="tel"
            placeholder="Enter contact no"
            value={form.parentContactNo}
            onChange={(e) => setForm({ ...form, parentContactNo: e.target.value })}
            onFocus={() => setFocused("pc")}
            onBlur={() => setFocused("")}
            required
          />
        </div>
      </div>

      {/* Parent DOB */}
      <div className={`form-group${focused === "dob" ? " is-focused" : ""}`}>
        <label className="form-label">Date of Birth</label>
        <div className="input-wrap">
          <input
            className="form-input"
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            onFocus={() => setFocused("dob")}
            onBlur={() => setFocused("")}
            required
          />
        </div>
      </div>
    </>
  )}

  {/* Remember Me */}
  <div className="remember-row">
    <label className="check-wrap">
      <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
      <span>Remember me</span>
    </label>
  </div>

  {/* Submit */}
  <button type="submit" className="btn-main">
    Sign In <ArrowRight />
  </button>

  <div className="or-row">or</div>

  {/* Google Login */}
  <button type="button" className="btn-google">
    {/* Google SVG Icon */}
    Continue with Google
  </button>

  <p className="switch-txt">
    Don't have an account?{" "}
    <button type="button" className="switch-link" onClick={() => switchMode("signup")}>Register here</button>
  </p>
</form>
            )}

          {/* SIGN UP */}
{mode === "signup" && (
  <form key={`signup-${step}-${animKey}`} className="form-slide" onSubmit={handleSubmit}>
    {/* Steps */}
    <div className="steps-row">
      <div className="step-item">
        <div className={`step-circle${step === 1 ? " active" : step > 1 ? " done" : ""}`}>
          {step > 1 ? <CheckIcon /> : "1"}
        </div>
        <div className={`step-name${step >= 1 ? " active" : ""}`}>Profile</div>
      </div>
      <div className="step-connector" style={{ marginTop: 15 }}>
        <div className="step-connector-fill" style={{ width: step > 1 ? "100%" : "0%" }} />
      </div>
      <div className="step-item">
        <div className={`step-circle${step === 2 ? " active" : ""}`}>2</div>
        <div className={`step-name${step === 2 ? " active" : ""}`}>Security</div>
      </div>
    </div>

    {/* Step 1: Profile */}
    {step === 1 && (
      <>
        <div className="two-col">
          {/* Full Name */}
          <div className={`form-group${focused === "fn" ? " is-focused" : ""}`}>
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="xyz"
              value={form.firstName}
              onChange={set("firstName")}
              onFocus={() => setFocused("fn")}
              onBlur={() => setFocused("")}
              required
            />
          </div>

          {/* Contact Number */}
          <div className={`form-group${focused === "contact" ? " is-focused" : ""}`}>
            <label className="form-label">Contact Number</label>
            <input
              className="form-input"
              type="tel"
              placeholder="987XXXXXXX"
              value={form.contactNo}
              onChange={set("contactNo")}
              onFocus={() => setFocused("contact")}
              onBlur={() => setFocused("")}
              required
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className={`form-group${focused === "dob" ? " is-focused" : ""}`}>
          <label className="form-label">Date of Birth</label>
          <input
            className="form-input"
            type="date"
            value={form.dob}
            onChange={set("dob")}
            onFocus={() => setFocused("dob")}
            onBlur={() => setFocused("")}
            required
          />
        </div>

        {/* Address */}
        <div className={`form-group${focused === "address" ? " is-focused" : ""}`}>
          <label className="form-label">Address</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your address"
            value={form.address}
            onChange={set("address")}
            onFocus={() => setFocused("address")}
            onBlur={() => setFocused("")}
            required
          />
        </div>

        {/* Student Email */}
        <div className={`form-group${focused === "studentEmail" ? " is-focused" : ""}`}>
          <label className="form-label">Email</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              className="form-input has-icon"
              type="email"
              placeholder="you@gmail.com"
              value={form.email}
              onChange={set("email")}
              onFocus={() => setFocused("studentEmail")}
              onBlur={() => setFocused("")}
              required
            />
          </div>
        </div>

        {/* Parent Contact No */}
        <div className={`form-group${focused === "pc" ? " is-focused" : ""}`}>
          <label className="form-label">Parent Contact No.</label>
          <input
            className="form-input"
            type="tel"
            placeholder="Enter contact no"
            value={form.parentContactNo}
            onChange={set("parentContactNo")}
            onFocus={() => setFocused("pc")}
            onBlur={() => setFocused("")}
            required
          />
        </div>

        {/* Institute */}
        <div className={`form-group${focused === "inst" ? " is-focused" : ""}`}>
          <label className="form-label">Institute</label>
          <Select
            placeholder="Search Institute..."
            options={institutes.map((inst) => ({
              value: inst.name,
              label: `${inst.name} (${inst.city})`
            }))}
            value={
              institutes
                .map((inst) => ({
                  value: inst.name,
                  label: `${inst.name} (${inst.city})`
                }))
                .find((opt) => opt.value === form.instituteName)
            }
            onChange={(selected) =>
              setForm({ ...form, instituteName: selected.value })
            }
            onFocus={() => setFocused("inst")}
            onBlur={() => setFocused("")}
            isSearchable
          />
        </div>

        <button type="submit" className="btn-main">Continue <ArrowRight /></button>
      </>
    )}

    {/* Step 2: Security */}
    {step === 2 && (
      <>
        {/* Password */}
        <div className={`form-group${focused === "pw" ? " is-focused" : ""}`}>
          <label className="form-label">Create Password</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            </span>
            <input
              className="form-input has-icon"
              type={showPass ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={set("password")}
              onFocus={() => setFocused("pw")}
              onBlur={() => setFocused("")}
              required
              minLength={8}
            />
            <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}><EyeIcon open={showPass} /></button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className={`form-group${focused === "cf" ? " is-focused" : ""}`}>
          <label className="form-label">Confirm Password</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </span>
            <input
              className="form-input has-icon"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              onFocus={() => setFocused("cf")}
              onBlur={() => setFocused("")}
              required
            />
            <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}><EyeIcon open={showConfirm} /></button>
          </div>
          {form.confirm && form.confirm !== form.password && (
            <div className="mismatch-txt">Passwords do not match</div>
          )}
        </div>

        <div className="terms-note">
          By creating an account, you agree to Apex Institute's <a>Terms of Service</a> and <a>Privacy Policy</a>.
        </div>

        <div className="btn-row">
          <button type="button" className="btn-back" onClick={() => setStep(1)}>← Back</button>
          <button type="submit" className="btn-main" style={{ flex: 2 }}>Create Account <ArrowRight /></button>
        </div>
      </>
    )}

    <p className="switch-txt">
      Already have an account?{" "}
      <button type="button" className="switch-link" onClick={() => switchMode("signin")}>Sign in</button>
    </p>
  </form>
)}
          </div>
        </div>
      </div>
    </>
  );
}
