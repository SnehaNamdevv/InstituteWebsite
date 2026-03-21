import { useState } from "react";
import {
    Send, MessageSquarePlus, ListChecks, CheckCircle2,
    Clock4, Loader, ChevronDown, Plus, HelpCircle
} from "lucide-react";

const initialQueries = [
    {
        id: "QRY-001",
        subject: "Fee payment receipt not updated",
        date: "2026-03-10",
        status: "Resolved",
        response: "Your fee receipt has been updated. Please check your student portal under Payments.",
    },
    {
        id: "QRY-002",
        subject: "Library card access denied",
        date: "2026-03-15",
        status: "In Progress",
        response: "Our library team is actively looking into your card access issue.",
    },
    {
        id: "QRY-003",
        subject: "Hostel room allotment query",
        date: "2026-03-18",
        status: "Pending",
        response: null,
    },
];

const STATUS_CONFIG = {
    Resolved: {
        dot: "bg-green-500",
        light: "bg-green-50 text-green-700 border border-green-200",
        dark: "bg-green-900/40 text-green-300 border border-green-700",
        bar: "bg-green-500",
    },
    "In Progress": {
        dot: "bg-yellow-400",
        light: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        dark: "bg-yellow-900/40 text-yellow-300 border border-yellow-700",
        bar: "bg-yellow-400",
    },
    Pending: {
        dot: "bg-slate-400",
        light: "bg-gray-100 text-gray-600 border border-gray-200",
        dark: "bg-slate-600/50 text-slate-300 border border-slate-500",
        bar: "bg-slate-400",
    },
};

export default function HelpSection({ dark }) {
    const [tab, setTab] = useState("compose");
    const [queries, setQueries] = useState(initialQueries);
    const [form, setForm] = useState({ to: "", subject: "", message: "" });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState("All");

    const validate = () => {
        const e = {};
        if (!form.to.trim() || !form.to.includes("@")) e.to = "Enter a valid email";
        if (!form.subject.trim()) e.subject = "Subject is required";
        if (form.message.trim().length < 20) e.message = "Minimum 20 characters";
        return e;
    };

    const handleSubmit = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setQueries([{
            id: `QRY-00${queries.length + 1}`,
            subject: form.subject,
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
            response: null,
        }, ...queries]);
        setForm({ to: "", subject: "", message: "" });
        setErrors({});
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setTab("status"); }, 1800);
    };

    const filtered = filter === "All" ? queries : queries.filter(q => q.status === filter);
    const counts = {
        pending: queries.filter(q => q.status === "Pending").length,
        inProgress: queries.filter(q => q.status === "In Progress").length,
        resolved: queries.filter(q => q.status === "Resolved").length,
    };

    const d = dark;

    const inputCls = (hasErr) =>
        `w-full p-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500 text-sm
        ${d
            ? "bg-slate-900 border-slate-600 text-white placeholder-slate-500"
            : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"}
        ${hasErr ? "border-red-500" : ""}`;

    return (
        <div className="space-y-4 w-full min-w-0">

            {/* ── Header ── */}
            <div className={`rounded-xl p-4 sm:p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 ${d ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                        <HelpCircle size={20} className="text-indigo-500 flex-shrink-0" />
                        Help & Support
                    </h2>
                    <p className="text-xs sm:text-sm opacity-50 mt-0.5">Submit queries · Track requests · Get answers</p>
                </div>
                <div className={`text-xs px-3 py-1.5 rounded-full font-medium w-fit ${d ? "bg-green-900/50 text-green-300" : "bg-green-50 text-green-700"}`}>
                    ● Support Online
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-2 sm:gap-3">
                {[
                    { key: "compose", icon: <MessageSquarePlus size={15} />, label: "New Query" },
                    { key: "status", icon: <ListChecks size={15} />, label: "My Queries", count: queries.length },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium shadow transition
                            ${tab === t.key
                                ? "bg-indigo-600 text-white"
                                : d ? "bg-slate-800 text-gray-400 hover:text-white" : "bg-white text-gray-500 hover:text-gray-800"}`}
                    >
                        {t.icon}
                        <span>{t.label}</span>
                        {t.count !== undefined && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                                ${tab === t.key ? "bg-white/20 text-white" : d ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ══ COMPOSE TAB ══ */}
            {tab === "compose" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

                    {/* Form — full width on mobile, 2/3 on lg */}
                    <div className={`lg:col-span-2 rounded-xl shadow p-4 sm:p-6 space-y-4 ${d ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
                        <div className="flex items-center gap-2">
                        
                            <h3 className="font-semibold text-sm sm:text-base">Compose Message</h3>
                        </div>

                        {submitted && (
                            <div className={`flex items-center gap-2 text-xs sm:text-sm p-3 rounded-lg ${d ? "bg-green-900/40 text-green-300" : "bg-green-50 text-green-700"}`}>
                                <CheckCircle2 size={15} className="flex-shrink-0" />
                                Query submitted! Redirecting to status...
                            </div>
                        )}

                        {/* To */}
                        <div>
                            <label className="text-xs opacity-50 uppercase tracking-wide mb-1 block">To</label>
                            <div className="relative">
                               
                                <input
                                    type="email"
                                    value={form.to}
                                    onChange={e => { setForm({ ...form, to: e.target.value }); setErrors({ ...errors, to: "" }); }}
                                    className={`${inputCls(errors.to)} pl-11`}
                                />
                            </div>
                            {errors.to && <p className="text-xs text-red-400 mt-1">{errors.to}</p>}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="text-xs opacity-50 uppercase tracking-wide mb-1 block">Subject</label>
                            <input
                                type="text"
                                placeholder="What is your query about?"
                                value={form.subject}
                                onChange={e => { setForm({ ...form, subject: e.target.value }); setErrors({ ...errors, subject: "" }); }}
                                className={inputCls(errors.subject)}
                            />
                            {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-xs opacity-50 uppercase tracking-wide mb-1 block">Message</label>
                            <textarea
                                rows={5}
                                placeholder="Describe your issue clearly. Include your enrollment number, relevant dates, or any error messages..."
                                value={form.message}
                                onChange={e => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                                className={`${inputCls(errors.message)} resize-none`}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-red-400">{errors.message || ""}</p>
                                <span className={`text-xs font-mono ${form.message.length >= 20 ? "text-green-500" : "opacity-30"}`}>
                                    {form.message.length} chars
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition w-full sm:w-auto justify-center"
                            >
                                <Send size={14} /> Send Query
                            </button>
                        </div>
                    </div>

                    {/* Sidebar — stacks below on mobile, 1/3 on lg */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

                        {/* Query Overview */}
                        <div className={`rounded-xl shadow p-4 sm:p-5 ${d ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
                            <div className="flex items-center gap-2 mb-4">
                                
                                <h3 className="font-semibold text-sm">Query Overview</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: "Pending", count: counts.pending, color: "bg-slate-400", textColor: d ? "text-slate-300" : "text-slate-500" },
                                    { label: "In Progress", count: counts.inProgress, color: "bg-yellow-400", textColor: d ? "text-yellow-300" : "text-yellow-600" },
                                    { label: "Resolved", count: counts.resolved, color: "bg-green-500", textColor: d ? "text-green-300" : "text-green-600" },
                                ].map(s => (
                                    <div key={s.label} className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color}`}></div>
                                        <span className="text-xs opacity-60 flex-1">{s.label}</span>
                                        <span className={`text-sm font-semibold ${s.textColor}`}>{s.count}</span>
                                    </div>
                                ))}
                                <div className={`pt-3 border-t flex items-center justify-between ${d ? "border-slate-700" : "border-gray-100"}`}>
                                    <span className="text-xs opacity-50">Total queries</span>
                                    <span className="text-sm font-bold">{queries.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className={`rounded-xl shadow p-4 sm:p-5 ${d ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
                            <div className="flex items-center gap-2 mb-4">
                                
                                <h3 className="font-semibold text-sm">Tips & Guidance</h3>
                            </div>
                            <ul className="space-y-2 text-xs sm:text-sm">
                                {[
                                    "Use your official student email when submitting queries.",
                                    "Check the FAQ section before sending repetitive queries.",
                                    "Keep your messages clear and concise for faster support.",
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-indigo-500 font-bold flex-shrink-0">•</span>
                                        <span className="opacity-70">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4">
                                <a href="#" className="text-indigo-500 text-xs hover:underline flex items-center gap-1">
                                    <HelpCircle size={13} /> More tips
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ STATUS TAB ══ */}
            {tab === "status" && (
                <div className={`rounded-xl shadow p-4 sm:p-6 ${d ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>

                    {/* Header + filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                            <h3 className="font-semibold text-sm sm:text-base">All Queries</h3>
                        </div>
                        {/* Filter pills — scrollable on very small screens */}
                        <div className={`flex gap-1 p-1 rounded-lg overflow-x-auto ${d ? "bg-slate-900" : "bg-gray-100"}`}>
                            {["All", "Pending", "In Progress", "Resolved"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition whitespace-nowrap flex-shrink-0
                                        ${filter === f
                                            ? "bg-indigo-600 text-white"
                                            : d ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop column headers — hidden on mobile */}
                    {filtered.length > 0 && (
                        <div className={`hidden sm:grid grid-cols-12 gap-2 px-4 pb-2 text-xs opacity-40 uppercase tracking-wide border-b mb-2 ${d ? "border-slate-700" : "border-gray-100"}`}>
                            <div className="col-span-1">ID</div>
                            <div className="col-span-6">Subject</div>
                            <div className="col-span-3">Date</div>
                            <div className="col-span-2">Status</div>
                        </div>
                    )}

                    {filtered.length === 0 ? (
                        <div className="text-center py-10 sm:py-12 opacity-40">
                            <ListChecks size={32} className="mx-auto mb-2" />
                            <p className="text-sm">No queries here.</p>
                            <button onClick={() => setTab("compose")} className="mt-2 text-xs text-indigo-400 hover:underline flex items-center gap-1 mx-auto">
                                <Plus size={12} /> Submit one now
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filtered.map(q => {
                                const sc = STATUS_CONFIG[q.status];
                                const isOpen = expanded === q.id;
                                return (
                                    <div key={q.id} className={`rounded-xl border overflow-hidden transition-all
                                        ${d
                                            ? isOpen ? "border-indigo-500/50 bg-slate-700" : "border-slate-600 bg-slate-700/50 hover:bg-slate-700"
                                            : isOpen ? "border-indigo-200 bg-indigo-50/30" : "border-gray-200 bg-gray-50 hover:bg-white"}`}>

                                        <button className="w-full text-left" onClick={() => setExpanded(isOpen ? null : q.id)}>

                                            {/* Desktop row */}
                                            <div className="hidden sm:grid grid-cols-12 gap-2 items-center px-4 py-3">
                                                <div className="col-span-1">
                                                    <span className="text-xs font-mono opacity-40">{q.id.replace("QRY-", "#")}</span>
                                                </div>
                                                <div className="col-span-6 text-sm font-medium truncate">{q.subject}</div>
                                                <div className="col-span-3 text-xs opacity-40 font-mono">{q.date}</div>
                                                <div className="col-span-2 flex items-center justify-between">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${d ? sc.dark : sc.light}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot} ${q.status === "In Progress" ? "animate-pulse" : ""}`}></span>
                                                        {q.status}
                                                    </span>
                                                    <ChevronDown size={13} className={`opacity-30 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                                                </div>
                                            </div>

                                            {/* Mobile row */}
                                            <div className="sm:hidden flex items-start justify-between gap-2 px-4 py-3">
                                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                    <span className="text-xs font-mono opacity-40">{q.id}</span>
                                                    <span className="text-sm font-medium leading-snug">{q.subject}</span>
                                                    <span className="text-xs opacity-40 font-mono">{q.date}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${d ? sc.dark : sc.light}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot} ${q.status === "In Progress" ? "animate-pulse" : ""}`}></span>
                                                        {q.status}
                                                    </span>
                                                    <ChevronDown size={13} className={`opacity-30 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                                </div>
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className={`flex border-t ${d ? "border-slate-600" : "border-gray-200"}`}>
                                                <div className={`w-1 flex-shrink-0 ${sc.bar}`}></div>
                                                <div className="flex-1 px-4 sm:px-5 py-4 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {q.status === "Resolved"
                                                            ? <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                                            : q.status === "In Progress"
                                                                ? <Loader size={14} className="text-yellow-400 animate-spin flex-shrink-0" />
                                                                : <Clock4 size={14} className="opacity-40 flex-shrink-0" />}
                                                        <span className="text-xs opacity-50 font-medium">Support Response</span>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed break-words ${!q.response ? "italic opacity-40" : ""}`}>
                                                        {q.response ?? "No response yet. Our team will get back to you soon."}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className={`mt-4 pt-4 border-t flex items-center justify-between ${d ? "border-slate-700" : "border-gray-100"}`}>
                        <span className="text-xs opacity-30">{filtered.length} of {queries.length} queries</span>
                        <button onClick={() => setTab("compose")} className="flex items-center gap-1 text-xs text-indigo-400 hover:underline">
                            <Plus size={12} /> New query
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}