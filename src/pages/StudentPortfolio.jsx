import { useState } from "react";

const steps = ["Personal Info", "Education", "Interests", "Achievements", "Links"];

const INTEREST_CATEGORIES = [
  {
    label: "🎨 Arts & Creative",
    items: ["Drawing", "Painting", "Photography", "Music", "Dance", "Acting", "Writing", "Crafts"],
  },
  {
    label: "⚽ Sports & Fitness",
    items: ["Cricket", "Football", "Basketball", "Swimming", "Athletics", "Yoga", "Kabaddi", "Badminton"],
  },
  {
    label: "📚 Academic",
    items: ["Mathematics", "Science", "Literature", "History", "Geography", "Economics", "Philosophy", "Languages"],
  },
  {
    label: "💻 Technology",
    items: ["Coding", "Robotics", "AI/ML", "Web Design", "Gaming", "Electronics", "App Dev", "Cybersecurity"],
  },

];

const DEGREE_OPTIONS = [
  "Primary School (1–5)", "Middle School (6–8)", "High School (9–10)",
  "Senior Secondary (11–12)", "Diploma", "Bachelor's Degree", "Master's Degree",
  "Doctorate (PhD)", "Certificate Course", "Vocational Training", "Other",
];

const STREAM_OPTIONS = [
  "Science (PCM)", "Science (PCB)", "Commerce", "Arts / Humanities",
  "Computer Science", "Engineering", "Medical / Paramedical", "Law",
  "Management / Business", "Education / Teaching", "Fine Arts", "Music / Performing Arts",
  "Agriculture", "Vocational / ITI", "Other",
];

const YEAR_OPTIONS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12",
  "1st Year", "2nd Year", "3rd Year", "4th Year",
  "Postgraduate", "Research Scholar", "Alumni",
];

export default function StudentPortfolioForm({ dark = false }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [form, setForm] = useState({
    
    name: "", email: "", phone: "", city: "", dob: "", bio: "", avatar: null,addharNo: "",
 
    institution: "", degree: "", stream: "", year: "", grade: "",
    
    interests: [], customInterest: "",
    achievements: [{ title: "", category: "", desc: "", year: "" }],
    
    youtube: "", instagram: "", linkedin: "", website: "",
  });
 const handleAddharImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    update("addharImage", file); // store real file
  }
};
const handleSubmit = async () => {
  try {
    const formData = new FormData();

   
    Object.keys(form).forEach((key) => {
      if (
        key !== "avatar" &&
        key !== "addharImage" &&
        key !== "achievements" &&
        key !== "interests"
      ) {
        formData.append(key, form[key]?.trim?.() || form[key]);
      }
    });

   
    formData.append("interests", JSON.stringify(form.interests));

   
    const cleaned = form.achievements.filter(
      (a) => a.title || a.category || a.desc || a.year
    );
    formData.append("achievements", JSON.stringify(cleaned));

    
    if (form.avatar) {
      formData.append("profileImg", form.avatar);
    }

    if (form.addharImage) {
      formData.append("addharImage", form.addharImage);
    }

    // 🔍 Debug
    console.log("==== FORM DATA ====");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch(
      "https://institute-backend-0ncp.onrender.com/api/portfolio/create",
      {
        method: "POST",
        body: formData,
      }
    );

    const text = await res.text();
    

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert("Server error (not JSON)");
      return;
    }

    if (data.success) {
      setSubmitted(true);
    } else {
      alert(data.message || "Something went wrong");
    }

  } catch (err) {
    console.log("ERROR:", err);
    
  }
};
  const d = dark;
  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (item) =>
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter(x => x !== item)
        : [...prev.interests, item],
    }));

  const updateAch = (i, field, value) => {
    const a = [...form.achievements];
    a[i][field] = value;
    setForm(prev => ({ ...prev, achievements: a }));
  };

  const addAch = () => {
    if (form.achievements.length < 5)
      setForm(prev => ({ ...prev, achievements: [...prev.achievements, { title: "", category: "", desc: "", year: "" }] }));
  };

  const removeAch = (i) =>
    setForm(prev => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== i) }));

  const handleAvatar = (e) => {
  const file = e.target.files[0];
  if (file) {
    update("avatar", file); // store real file
  }
};

  const card    = d ? "bg-slate-800 text-white border border-slate-700"    : "bg-white text-gray-800 border border-gray-200";
  const inner   = d ? "bg-slate-900 border border-slate-700"               : "bg-gray-50 border border-gray-100";
  const muted   = d ? "text-slate-400"                                      : "text-gray-400";
  const divider = d ? "border-slate-700"                                    : "border-gray-100";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500
    ${d ? "bg-slate-900 border-slate-600 text-white placeholder-slate-500"
        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"}`;
  const labelCls = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${muted}`;

  if (submitted) {
    return (
      <div className={`rounded-xl shadow p-8 text-center ${card}`}>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-1">Portfolio Created! 🎉</h2>
        <p className={`text-sm mb-1 ${muted}`}>
          Welcome, <span className="text-indigo-500 font-semibold">{form.name || "Student"}</span>!
        </p>
        <p className={`text-xs mb-5 ${muted}`}>Your portfolio has been submitted successfully.</p>
        <button
          onClick={() => { setSubmitted(false); setStep(0); }}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          Create Another
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 w-full min-w-0">

      
        {/* ── Stepper ── */}
        <div className={`rounded-xl shadow px-4 py-3 ${card}`}>
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0
                      ${i < step    ? "bg-gradient-to-br from-indigo-500 to-cyan-500 text-white"
                       : i === step ? `border-2 border-indigo-500 text-indigo-500 ${d ? "bg-slate-900" : "bg-white"}`
                       :              `border ${d ? "border-slate-600 text-slate-500 bg-slate-900" : "border-gray-200 text-gray-400"}`}`}
                  >
                    {i < step
                      ? <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      : i + 1}
                  </button>
                  <span className={`text-xs font-medium hidden sm:block truncate max-w-[62px] text-center leading-tight
                    ${i === step ? "text-indigo-500" : i < step ? muted : (d ? "text-slate-600" : "text-gray-300")}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-1 transition-all duration-500
                    ${i < step ? "bg-gradient-to-r from-indigo-500 to-cyan-500" : (d ? "bg-slate-700" : "bg-gray-200")}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Body ── */}
        <div className={`rounded-xl shadow p-4 ${card}`}>

          {/* ── STEP 0: Personal Info ── */}
          {step === 0 && (
            <div className="space-y-2.5">
              <SectionTitle icon="👤" title="Personal Information" />
              <div className="flex items-center gap-3">
                <div className="relative group flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center
                    ${d ? "border-slate-600 bg-slate-900" : "border-gray-200 bg-gray-50"}`}>
                    {form.avatar
                      ? <img src={URL.createObjectURL(form.avatar)} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-xl">🧑‍🎓</span>}
                  </div>
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity">
                    <span className="text-xs text-white font-semibold">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                  </label>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Field label="Full Name" placeholder="XYZ" value={form.name} onChange={v => update("name", v)} inputCls={inputCls} labelCls={labelCls} />
                  <Field label="Email" placeholder="XYZ@email.com" value={form.email} onChange={v => update("email", v)} inputCls={inputCls} labelCls={labelCls} type="email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Phone" placeholder="+91 XXXX" value={form.phone} onChange={v => update("phone", v)} inputCls={inputCls} labelCls={labelCls} />
                <Field label="City" placeholder="Delhi" value={form.city} onChange={v => update("city", v)} inputCls={inputCls} labelCls={labelCls} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Addhar Card No" placeholder="123456ADHAR" value={form.addharNo} onChange={v=> update("addharNo", v)} inputCls={inputCls} labelCls={labelCls} />
                   <div className="flex items-center gap-3 mt-2">
  <div className="relative group flex-shrink-0">
    <div className={`w-20 h-14 rounded-lg overflow-hidden border-2 border-dashed flex items-center justify-center
      ${d ? "border-slate-600 bg-slate-900" : "border-gray-200 bg-gray-50"}`}>

      {form.addharImage
        ? <img src={URL.createObjectURL(form.addharImage)} alt="Aadhar" className="w-full h-full object-cover" />
        : <span className="text-xs text-center px-1">Upload Aadhar</span>}
    </div>

    <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
      <span className="text-xs text-white font-semibold">Upload</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAddharImage}
      />
    </label>
  </div>

  <p className="text-xs text-gray-400">Upload Aadhar Card Photo</p>
</div>
              </div>
             
              <div>
                <label className={labelCls}>About Me</label>
                <textarea rows={2} value={form.bio}
                  onChange={e => update("bio", e.target.value)}
                  placeholder="Your passions, goals, or what makes you unique..."
                  className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}

          {/* ── STEP 1: Education ── */}
          {step === 1 && (
            <div className="space-y-3">
              <SectionTitle icon="🏫" title="Education Details" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="sm:col-span-2">
                  <Field label="School / College / Institute Name"
                    placeholder="Dr. A.P.J kalam"
                    value={form.institution} onChange={v => update("institution", v)}
                    inputCls={inputCls} labelCls={labelCls} />
                </div>
                <div>
                  <label className={labelCls}>Level / Degree</label>
                  <select value={form.degree} onChange={e => update("degree", e.target.value)} className={inputCls}>
                    <option value="">Select level</option>
                    {DEGREE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Stream / Subject</label>
                  <select value={form.stream} onChange={e => update("stream", e.target.value)} className={inputCls}>
                    <option value="">Select stream</option>
                    {STREAM_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Class / Year</label>
                  <select value={form.year} onChange={e => update("year", e.target.value)} className={inputCls}>
                    <option value="">Select class / year</option>
                    {YEAR_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <Field label="Grade / Marks / CGPA (optional)"
                  placeholder="e.g. A+, 92%, 8.5 CGPA"
                  value={form.grade} onChange={v => update("grade", v)}
                  inputCls={inputCls} labelCls={labelCls} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Interests ── */}
          {step === 2 && (
            <div className="space-y-3">
              <SectionTitle icon="✨" title="Interests & Strengths" />
              <p className={`text-xs ${muted}`}>Pick anything that represents you — sports, arts, academics, tech, or more.</p>

              <div className="space-y-2">
                {INTEREST_CATEGORIES.map((cat, ci) => (
                  <div key={ci} className={`rounded-xl border overflow-hidden ${d ? "border-slate-700" : "border-gray-100"}`}>
                    {/* Category header */}
                    <button
                      onClick={() => setOpenCategory(openCategory === ci ? null : ci)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold transition-colors
                        ${d ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-700"}`}>
                      <span>{cat.label}</span>
                      <span className="flex items-center gap-2">
                        {form.interests.filter(x => cat.items.includes(x)).length > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                            ${d ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-100 text-indigo-600"}`}>
                            {form.interests.filter(x => cat.items.includes(x)).length}
                          </span>
                        )}
                        <svg className={`w-4 h-4 transition-transform ${openCategory === ci ? "rotate-180" : ""} ${muted}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {/* Items */}
                    {openCategory === ci && (
                      <div className="px-3 pb-3 pt-2 flex flex-wrap gap-1.5">
                        {cat.items.map(item => (
                          <button key={item} onClick={() => toggleInterest(item)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                              ${form.interests.includes(item)
                                ? "bg-indigo-600 border-indigo-500 text-white"
                                : d ? "bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom interest */}
              <div className="flex gap-2">
                <input value={form.customInterest} onChange={e => update("customInterest", e.target.value)}
                  placeholder="Add your own interest..."
                  onKeyDown={e => { if (e.key === "Enter" && form.customInterest.trim()) { toggleInterest(form.customInterest.trim()); update("customInterest", ""); } }}
                  className={`flex-1 ${inputCls}`} />
                <button onClick={() => { if (form.customInterest.trim()) { toggleInterest(form.customInterest.trim()); update("customInterest", ""); } }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                  + Add
                </button>
              </div>

              {/* Selected summary */}
              {form.interests.length > 0 && (
                <div className={`rounded-xl p-3 ${inner}`}>
                  <p className={`text-xs mb-2 uppercase tracking-wider ${muted}`}>Selected ({form.interests.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.interests.map(s => (
                      <span key={s} className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium border
                        ${d ? "bg-indigo-900/40 border-indigo-700 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-600"}`}>
                        {s}
                        <button onClick={() => toggleInterest(s)} className="hover:text-red-400 transition-colors ml-0.5">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Achievements ── */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <SectionTitle icon="🏆" title="Achievements & Activities" />
                {form.achievements.length < 5 && (
                  <button onClick={addAch}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors
                      ${d ? "text-cyan-400 border-cyan-700 bg-cyan-900/20 hover:bg-cyan-900/40"
                          : "text-cyan-600 border-cyan-200 bg-cyan-50 hover:bg-cyan-100"}`}>
                    + Add
                  </button>
                )}
              </div>
              <p className={`text-xs ${muted}`}>Awards, certificates, events, sports, competitions, volunteering — anything you're proud of!</p>
              <div className="space-y-3">
                {form.achievements.map((ach, i) => (
                  <div key={i} className={`rounded-xl p-3 space-y-2.5 ${inner}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${muted}`}>Achievement {i + 1}</span>
                      {form.achievements.length > 1 && (
                        <button onClick={() => removeAch(i)} className="text-xs text-red-400 hover:text-red-500">Remove</button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <Field label="Title / Name"
                        placeholder="e.g. State Chess Champion, Best Dancer"
                        value={ach.title} onChange={v => updateAch(i, "title", v)}
                        inputCls={inputCls} labelCls={labelCls} />
                      <div>
                        <label className={labelCls}>Category</label>
                        <select value={ach.category} onChange={e => updateAch(i, "category", e.target.value)} className={inputCls}>
                          <option value="">Select type</option>
                          {["Academic", "Sports", "Arts & Culture", "Science & Tech", "Leadership", "Social Service", "Competition", "Certificate", "Other"].map(o =>
                            <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Description (optional)</label>
                        <input value={ach.desc} onChange={e => updateAch(i, "desc", e.target.value)}
                          placeholder="Brief details about this achievement"
                          className={inputCls} />
                      </div>
                      <Field label="Year" placeholder="e.g. 2026"
                        value={ach.year} onChange={v => updateAch(i, "year", v)}
                        inputCls={inputCls} labelCls={labelCls} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: Links ── */}
          {step === 4 && (
            <div className="space-y-2.5">
              <SectionTitle icon="🔗" title="Online Presence" />
              <p className={`text-xs ${muted}`}>Everything is optional — only add what's relevant to you.</p>
              <div className="space-y-2">
             
                <SocialField icon="📸" label="Instagram"  value={form.instagram} onChange={v => update("instagram", v)} color="from-pink-700 to-fuchsia-500" inputCls={inputCls} labelCls={labelCls} />
                <SocialField icon="💼" label="LinkedIn"  value={form.linkedin} onChange={v => update("linkedin", v)} color="from-blue-700 to-blue-500" inputCls={inputCls} labelCls={labelCls} />
                <SocialField icon="🌐" label="Website / Portfolio" value={form.website} onChange={v => update("website", v)} color="from-indigo-700 to-indigo-500" inputCls={inputCls} labelCls={labelCls} />
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className={`flex items-center justify-between mt-4 pt-4 border-t ${divider}`}>
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed
                ${d ? "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}>
              ← Back
            </button>

            <div className="flex items-center gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300
                  ${i === step ? "w-5 h-1.5 bg-indigo-500"
                   : i < step  ? "w-1.5 h-1.5 bg-cyan-500"
                   :             `w-1.5 h-1.5 ${d ? "bg-slate-700" : "bg-gray-200"}`}`} />
              ))}
            </div>

            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow shadow-indigo-500/20">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white text-sm font-bold transition-all">
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Reusable sub-components ──
function Field({ label, placeholder, value, onChange, type = "text", inputCls, labelCls }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  );
}

function SocialField({ icon, label, placeholder, value, onChange, color, inputCls, labelCls }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-base flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <label className={labelCls}>{label}</label>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-lg">{icon}</span>
      <h3 className="text-base font-bold">{title}</h3>
    </div>
  );
}