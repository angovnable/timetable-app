import { useState, useEffect, useCallback, useReducer } from "react";
import { supabase } from "./supabase";
import { themes, Icon, GlassCard, Btn, AuroraBackground, ToastContainer, useToast, ProgressRing, Skeleton, EmptyState } from "./components";
import { StepSchool, StepClasses, StepTeachers, StepGenerate, Dashboard } from "./steps";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const uid = () => Math.random().toString(36).slice(2, 9);

export const DEFAULT_SLOTS = [
  { id: uid(), type: "lesson", label: "Lesson 1", start: "07:00", duration: 40 },
  { id: uid(), type: "lesson", label: "Lesson 2", start: "07:40", duration: 40 },
  { id: uid(), type: "lesson", label: "Lesson 3", start: "08:20", duration: 40 },
  { id: uid(), type: "break", label: "Tea Break", start: "09:00", duration: 20 },
  { id: uid(), type: "lesson", label: "Lesson 4", start: "09:20", duration: 40 },
  { id: uid(), type: "lesson", label: "Lesson 5", start: "10:00", duration: 40 },
  { id: uid(), type: "lesson", label: "Lesson 6", start: "10:40", duration: 40 },
  { id: uid(), type: "lunch", label: "Lunch Break", start: "11:20", duration: 40 },
  { id: uid(), type: "lesson", label: "Lesson 7", start: "12:00", duration: 40 },
  { id: uid(), type: "lesson", label: "Lesson 8", start: "12:40", duration: 40 },
];

const INITIAL_STATE = {
  school: { name: "", county: "", term: "Term 1 2026", lessonDuration: 40, includeSaturday: false },
  slots: DEFAULT_SLOTS,
  classes: [],
  subjects: [],
  teachers: [],
  timetable: null,
};

// ── UNDO/REDO REDUCER ─────────────────────────────────────────────────────────
function historyReducer(state, action) {
  switch (action.type) {
    case "SET": {
      const newPresent = { ...state.present, ...action.payload };
      return {
        past: [...state.past.slice(-29), state.present],
        present: newPresent,
        future: [],
      };
    }
    case "UNDO": {
      if (!state.past.length) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (!state.future.length) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    }
    case "LOAD":
      return { past: [], present: action.payload, future: [] };
    default:
      return state;
  }
}

// ── HERO / LANDING PAGE ───────────────────────────────────────────────────────
function HeroPage({ onGetStarted, t }) {
  const features = [
    { icon: "cpu", title: "Auto-Generate", desc: "CBC-compliant timetables in seconds with zero conflicts" },
    { icon: "people", title: "Teacher Management", desc: "Track TSC numbers, workload limits and assignments" },
    { icon: "cloud", title: "Cloud Sync", desc: "Your data saved automatically across all devices" },
    { icon: "filePdf", title: "Export Ready", desc: "PDF and Excel exports for printing or sharing" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, position: "relative", overflow: "hidden" }}>
      <AuroraBackground t={t} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Nav */}
        <nav style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 20px ${t.accentGlow}`,
            }}>
              <Icon name="calendarEvent" size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: t.text }}>Timetable For All</span>
          </div>
          <Btn variant="secondary" onClick={onGetStarted} t={t} size="sm">Sign In</Btn>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
            borderRadius: 30, background: t.accentGlow, border: `1px solid ${t.accent}44`,
            fontSize: 12, fontWeight: 700, color: t.accent, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: t.accent, animation: "pulse 2s infinite" }} />
            Kenyan CBC School Scheduler
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 7vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: "0 0 24px",
            background: `linear-gradient(135deg, ${t.text} 0%, ${t.textMuted} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            School Timetables,<br />
            <span style={{
              background: `linear-gradient(135deg, ${t.accent}, ${t.gold})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Done Right.</span>
          </h1>
          <p style={{ fontSize: 18, color: t.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
            Generate conflict-free, CBC-compliant timetables for your entire school in minutes — not hours.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg" onClick={onGetStarted} t={t}>
              Get Started Free <Icon name="arrowRight" size={16} color="#fff" />
            </Btn>
            <Btn variant="secondary" size="lg" onClick={onGetStarted} t={t}>
              Sign In
            </Btn>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <GlassCard key={i} t={t} style={{ padding: 24 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, marginBottom: 14,
                background: `linear-gradient(135deg, ${t.accent}22, ${t.accentLight}11)`,
                border: `1px solid ${t.accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={f.icon} size={20} color={t.accent} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{f.title}</div>
              <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────────────────────
function AuthScreen({ t, addToast }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!schoolName.trim()) { addToast("Please enter your school name.", "error"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { school_name: schoolName } } });
        if (error) throw error;
        addToast("Account created! Welcome aboard.", "success", "Welcome 🎉");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        addToast("Signed in successfully.", "success");
      }
    } catch (e) {
      addToast(e.message || "Something went wrong.", "error", "Error");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) addToast(error.message, "error");
  };

  const inputStyle = (name) => ({
    width: "100%", padding: "12px 16px", borderRadius: 10,
    background: t.inputBg,
    border: `1px solid ${focused === name ? t.accent : t.border}`,
    color: t.text, fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "'Sora', sans-serif",
    boxShadow: focused === name ? `0 0 0 3px ${t.accentGlow}` : "none",
    transition: "all 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <AuroraBackground t={t} />
      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: "0 auto 16px",
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 40px ${t.accentGlow}`,
          }}>
            <Icon name="calendarEvent" size={28} color="#fff" />
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 26, color: t.text }}>Timetable For All</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6 }}>Kenyan CBC School Scheduler</div>
        </div>

        <GlassCard t={t} style={{ padding: 32 }} hover={false}>
          <div style={{ display: "flex", background: t.inputBg, borderRadius: 10, padding: 3, marginBottom: 24, gap: 3 }}>
            {[["login", "Sign In"], ["signup", "Create Account"]].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})` : "transparent",
                color: mode === m ? "#fff" : t.textMuted,
                fontWeight: 700, fontSize: 13, fontFamily: "'Sora', sans-serif", transition: "all 0.2s",
                boxShadow: mode === m ? `0 4px 16px ${t.accentGlow}` : "none",
              }}>{label}</button>
            ))}
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: t.textMuted, marginBottom: 7, textTransform: "uppercase" }}>School Name</div>
              <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Nairobi Academy"
                onFocus={() => setFocused("school")} onBlur={() => setFocused("")}
                style={inputStyle("school")} />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: t.textMuted, marginBottom: 7, textTransform: "uppercase" }}>Email Address</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.ac.ke"
              onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
              style={inputStyle("email")} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: t.textMuted, marginBottom: 7, textTransform: "uppercase" }}>Password</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              onFocus={() => setFocused("pass")} onBlur={() => setFocused("")}
              style={inputStyle("pass")} />
          </div>

          <Btn variant="primary" size="lg" onClick={handleSubmit} disabled={loading || !email || !password} t={t}
            style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </Btn>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: t.border }} />
            <span style={{ fontSize: 11, color: t.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" }}>or</span>
            <div style={{ flex: 1, height: 1, background: t.border }} />
          </div>

          <button onClick={handleGoogle} style={{
            width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.inputBg, color: t.text, fontSize: 14, fontWeight: 600,
            fontFamily: "'Sora', sans-serif", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s",
          }}>
            <Icon name="google" size={16} color={t.text} /> Continue with Google
          </button>
        </GlassCard>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: t.textFaint }}>
          Your data is encrypted and saved to your account only.
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const t = themes[dark ? "dark" : "light"];
  const [page, setPage] = useState("hero"); // "hero" | "auth" | "app"
  const [step, setStep] = useState(-1); // -1 = dashboard
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  // ── UNDO / REDO ──
  const [history, dispatch] = useReducer(historyReducer, { past: [], present: INITIAL_STATE, future: [] });
  const state = history.present;

  const setState = useCallback((payload) => dispatch({ type: "SET", payload }), []);
  const undo = () => dispatch({ type: "UNDO" });
  const redo = () => dispatch({ type: "REDO" });

  const setSchool = (v) => setState({ school: typeof v === "function" ? v(state.school) : v });
  const setSlots = (v) => setState({ slots: typeof v === "function" ? v(state.slots) : v });
  const setClasses = (v) => setState({ classes: typeof v === "function" ? v(state.classes) : v });
  const setSubjects = (v) => setState({ subjects: typeof v === "function" ? v(state.subjects) : v });
  const setTeachers = (v) => setState({ teachers: typeof v === "function" ? v(state.teachers) : v });
  const setTimetable = (v) => setState({ timetable: typeof v === "function" ? v(state.timetable) : v });

  // ── AUTH ──
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) setPage("app");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) setPage("app");
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── LOAD DATA ──
  useEffect(() => {
    if (!session) return;
    setDataLoading(true);
    const load = async () => {
      const { data, error } = await supabase
        .from("timetable_projects")
        .select("*")
        .eq("user_id", session.user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();
      if (!error && data) {
        setProjectId(data.id);
        dispatch({ type: "LOAD", payload: { ...INITIAL_STATE, ...data.data } });
      }
      setDataLoading(false);
    };
    load();
  }, [session]);

  // ── AUTO-SAVE ──
  const saveData = useCallback(async () => {
    if (!session) return;
    setSaveStatus("saving");
    const payload = state;
    let error;
    if (projectId) {
      ({ error } = await supabase
        .from("timetable_projects")
        .update({ data: payload, school_name: state.school.name || "Unnamed School", updated_at: new Date().toISOString() })
        .eq("id", projectId));
    } else {
      const { data, error: e } = await supabase
        .from("timetable_projects")
        .insert({ user_id: session.user.id, school_name: state.school.name || "Unnamed School", data: payload })
        .select().single();
      error = e;
      if (data) setProjectId(data.id);
    }
    if (error) {
      setSaveStatus("error");
      addToast("Failed to save. Check your connection.", "error", "Save Failed");
    } else {
      setSaveStatus("saved");
    }
    setTimeout(() => setSaveStatus(""), 3000);
  }, [session, projectId, state]);

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(saveData, 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null); setProjectId(null);
    dispatch({ type: "LOAD", payload: INITIAL_STATE });
    setPage("hero"); setStep(-1);
    addToast("Signed out successfully.", "info");
  };

  const steps = [
    { label: "School", icon: "school", key: 0 },
    { label: "Classes", icon: "book", key: 1 },
    { label: "Teachers", icon: "people", key: 2 },
    { label: "Generate", icon: "lightning", key: 3 },
  ];

  const completionPct = () => {
    let done = 0;
    if (state.school.name) done++;
    if (state.classes.length) done++;
    if (state.teachers.length) done++;
    if (state.timetable) done++;
    return Math.round((done / 4) * 100);
  };

  // ── KEYBOARD SHORTCUTS ──
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: themes.dark.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: themes.dark.textMuted, fontSize: 14, fontFamily: "'Sora', sans-serif" }}>Loading…</div>
    </div>
  );

  if (page === "hero") return (
    <>
      <GlobalStyles t={t} />
      <HeroPage t={t} onGetStarted={() => setPage("auth")} />
      <ToastContainer toasts={toasts} removeToast={removeToast} t={t} />
    </>
  );

  if (page === "auth" || !session) return (
    <>
      <GlobalStyles t={t} />
      <AuthScreen t={t} addToast={addToast} />
      <ToastContainer toasts={toasts} removeToast={removeToast} t={t} />
    </>
  );

  const canProceed = [state.school.name.trim().length > 0, state.classes.length > 0, true, true];

  return (
    <>
      <GlobalStyles t={t} />
      <div style={{ minHeight: "100vh", background: t.bg, color: t.text, display: "flex", fontFamily: "'Sora', sans-serif", position: "relative" }}>
        <AuroraBackground t={t} />

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: sidebarOpen ? 230 : 64,
          flexShrink: 0,
          background: t.sidebarBg,
          borderRight: `1px solid ${t.border}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          zIndex: 50,
        }}>
          {/* Logo */}
          <div style={{ padding: "20px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 16px ${t.accentGlow}`,
            }}>
              <Icon name="calendarEvent" size={15} color="#fff" />
            </div>
            {sidebarOpen && (
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 13, color: t.text, lineHeight: 1.1 }}>Timetable</div>
                <div style={{ fontSize: 9, color: t.textFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>For All</div>
              </div>
            )}
          </div>

          {/* Progress */}
          {sidebarOpen && (
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProgressRing percent={completionPct()} size={36} stroke={3} color={t.accent} t={t} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{completionPct()}% complete</div>
                  <div style={{ fontSize: 10, color: t.textFaint }}>Setup progress</div>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav style={{ padding: "10px 8px", flex: 1 }}>
            {/* Dashboard */}
            <SidebarItem icon="dashboard" label="Dashboard" active={step === -1} onClick={() => setStep(-1)} open={sidebarOpen} t={t} />
            <div style={{ height: 1, background: t.border, margin: "8px 0" }} />
            {steps.map((s) => (
              <SidebarItem
                key={s.key} icon={s.icon} label={s.label}
                active={step === s.key}
                done={s.key === 0 ? !!state.school.name : s.key === 1 ? state.classes.length > 0 : s.key === 2 ? state.teachers.length > 0 : !!state.timetable}
                onClick={() => setStep(s.key)}
                open={sidebarOpen} t={t}
                stepNum={s.key + 1}
              />
            ))}
          </nav>

          {/* Bottom actions */}
          <div style={{ padding: "10px 8px", borderTop: `1px solid ${t.border}` }}>
            {/* Undo/Redo */}
            {sidebarOpen && (
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <button onClick={undo} disabled={!history.past.length} title="Undo (Ctrl+Z)" style={{
                  flex: 1, padding: "7px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.card,
                  cursor: history.past.length ? "pointer" : "not-allowed", color: t.textMuted,
                  opacity: history.past.length ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 11,
                }}>
                  <Icon name="undo" size={12} color={t.textMuted} /> Undo
                </button>
                <button onClick={redo} disabled={!history.future.length} title="Redo (Ctrl+Y)" style={{
                  flex: 1, padding: "7px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.card,
                  cursor: history.future.length ? "pointer" : "not-allowed", color: t.textMuted,
                  opacity: history.future.length ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 11,
                }}>
                  Redo <Icon name="redo" size={12} color={t.textMuted} />
                </button>
              </div>
            )}
            <SidebarItem icon={dark ? "sun" : "moon"} label={dark ? "Light Mode" : "Dark Mode"} onClick={() => setDark(p => !p)} open={sidebarOpen} t={t} />
            <SidebarItem icon="logout" label="Sign Out" onClick={handleSignOut} open={sidebarOpen} t={t} danger />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
          {/* Top bar */}
          <header style={{
            padding: "0 24px", height: 58, display: "flex", alignItems: "center", gap: 12,
            borderBottom: `1px solid ${t.border}`,
            background: t.navBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            position: "sticky", top: 0, zIndex: 40,
          }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: t.textMuted, display: "flex" }}>
              <Icon name={sidebarOpen ? "chevronLeft" : "chevronRight"} size={16} color={t.textMuted} />
            </button>

            <div style={{ flex: 1 }}>
              {state.school.name && (
                <div style={{ fontSize: 13, color: t.textMuted }}>
                  <span style={{ fontWeight: 700, color: t.text }}>{state.school.name}</span>
                  <span style={{ margin: "0 8px", color: t.textFaint }}>·</span>
                  <span>{state.school.term}</span>
                </div>
              )}
            </div>

            {/* Save status */}
            {saveStatus && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: saveStatus === "saved" ? t.success : saveStatus === "error" ? t.danger : t.textMuted, transition: "all 0.3s" }}>
                <Icon name={saveStatus === "saving" ? "cloud" : saveStatus === "saved" ? "checkCircle" : "warning"} size={13} color="currentColor" />
                {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "All changes saved" : "Save failed"}
              </div>
            )}

            <div style={{ fontSize: 12, color: t.textFaint }}>{session.user.email}</div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, padding: "28px 28px 80px", overflowY: "auto" }}>
            {dataLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Skeleton height={60} borderRadius={12} t={t} />
                <Skeleton height={200} borderRadius={12} t={t} />
                <Skeleton height={120} borderRadius={12} t={t} />
              </div>
            ) : (
              <>
                {step === -1 && (
                  <Dashboard school={state.school} classes={state.classes} teachers={state.teachers} subjects={state.subjects} timetable={state.timetable} onNavigate={setStep} t={t} addToast={addToast} />
                )}
                {step === 0 && <StepSchool school={state.school} setSchool={setSchool} slots={state.slots} setSlots={setSlots} t={t} />}
                {step === 1 && <StepClasses classes={state.classes} setClasses={setClasses} subjects={state.subjects} setSubjects={setSubjects} t={t} />}
                {step === 2 && <StepTeachers teachers={state.teachers} setTeachers={setTeachers} classes={state.classes} subjects={state.subjects} t={t} />}
                {step === 3 && (
                  <StepGenerate
                    school={state.school} classes={state.classes} subjects={state.subjects}
                    teachers={state.teachers} slots={state.slots} timetable={state.timetable}
                    setTimetable={setTimetable} t={t} addToast={addToast}
                  />
                )}
              </>
            )}
          </main>

          {/* Bottom nav for mobile */}
          <div style={{ display: "none" }} className="mobile-bottom-nav">
            <style>{`@media(max-width:640px){.mobile-bottom-nav{display:flex !important;position:fixed;bottom:0;left:0;right:0;background:${t.navBg};border-top:1px solid ${t.border};backdrop-filter:blur(20px);z-index:200;}}`}</style>
            <button onClick={() => setStep(-1)} style={mobileNavBtn(step === -1, t)}>
              <Icon name="dashboard" size={18} color={step === -1 ? t.accent : t.textMuted} />
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Home</span>
            </button>
            {steps.map(s => (
              <button key={s.key} onClick={() => setStep(s.key)} style={mobileNavBtn(step === s.key, t)}>
                <Icon name={s.icon} size={18} color={step === s.key ? t.accent : t.textMuted} />
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} t={t} />
    </>
  );
}

function mobileNavBtn(active, t) {
  return {
    flex: 1, padding: "10px 4px", background: "none", border: "none", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    color: active ? t.accent : t.textMuted, transition: "color 0.15s",
  };
}

function SidebarItem({ icon, label, active, done, onClick, open, t, danger, stepNum }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={!open ? label : ""}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: open ? "10px 12px" : "10px", borderRadius: 10, border: "none", cursor: "pointer",
        background: active ? `${t.accent}18` : hovered ? t.surfaceHover : "transparent",
        color: active ? t.accent : danger ? t.danger : hovered ? t.text : t.textMuted,
        transition: "all 0.18s", marginBottom: 2, justifyContent: open ? "flex-start" : "center",
        boxShadow: active ? `inset 3px 0 0 ${t.accent}` : "none",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <Icon name={icon} size={16} color={active ? t.accent : danger ? t.danger : hovered ? t.text : t.textMuted} />
      {open && (
        <>
          <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 700 : 500, textAlign: "left" }}>{label}</span>
          {done && !active && <Icon name="checkCircle" size={13} color={t.success} />}
        </>
      )}
    </button>
  );
}

function GlobalStyles({ t }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Sora:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${t.bg}; }
      input, select, button, textarea { font-family: 'Sora', sans-serif; }
      input::placeholder { color: ${t.textFaint}; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
      @keyframes aurora1 { from { transform: translate(0,0) scale(1); } to { transform: translate(100px,80px) scale(1.2); } }
      @keyframes aurora2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-80px,-60px) scale(1.1); } }
      @keyframes aurora3 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,-80px) scale(0.9); } }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      .fade-in { animation: fadeInUp 0.4s ease forwards; }
    `}</style>
  );
}
