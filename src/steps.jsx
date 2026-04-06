import { useState, useRef } from "react";
import { Icon, GlassCard, Btn, SectionTitle, Input, Toggle, Badge, EmptyState } from "./components";

export const DAYS_BASE = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const uid = () => Math.random().toString(36).slice(2, 9);

export const CBC_PRESETS = {
  "Lower Primary (1–3)": [
    { name: "Mathematics", periods: 5, color: "#E05D5D", double: false },
    { name: "English", periods: 5, color: "#5B8FE8", double: false },
    { name: "Kiswahili", periods: 5, color: "#5BAE6E", double: false },
    { name: "Environmental Activities", periods: 4, color: "#E87D3E", double: false },
    { name: "Creative Arts", periods: 3, color: "#9B72E8", double: true },
    { name: "Religious Education", periods: 2, color: "#8B6B4A", double: false },
    { name: "Physical Education", periods: 2, color: "#3BBFBF", double: true },
  ],
  "Upper Primary (4–6)": [
    { name: "Mathematics", periods: 5, color: "#E05D5D", double: false },
    { name: "English", periods: 5, color: "#5B8FE8", double: false },
    { name: "Kiswahili", periods: 5, color: "#5BAE6E", double: false },
    { name: "Integrated Science", periods: 4, color: "#E87D3E", double: true },
    { name: "Social Studies", periods: 3, color: "#9B72E8", double: false },
    { name: "Creative Arts & Sports", periods: 3, color: "#D4548A", double: true },
    { name: "Agriculture", periods: 2, color: "#6B9E3E", double: true },
    { name: "Religious Education", periods: 2, color: "#8B6B4A", double: false },
    { name: "Life Skills", periods: 2, color: "#3BBFBF", double: false },
  ],
  "JSS (7–9)": [
    { name: "Mathematics", periods: 5, color: "#E05D5D", double: false },
    { name: "English", periods: 5, color: "#5B8FE8", double: false },
    { name: "Kiswahili", periods: 4, color: "#5BAE6E", double: false },
    { name: "Integrated Science", periods: 5, color: "#E87D3E", double: true },
    { name: "Social Studies", periods: 3, color: "#9B72E8", double: false },
    { name: "Pre-Technical Studies", periods: 4, color: "#C0522A", double: true },
    { name: "Creative Arts & Sports", periods: 3, color: "#D4548A", double: true },
    { name: "Agriculture & Nutrition", periods: 3, color: "#6B9E3E", double: true },
    { name: "Religious Education", periods: 2, color: "#8B6B4A", double: false },
    { name: "Life Skills", periods: 2, color: "#3BBFBF", double: false },
    { name: "Business Studies", periods: 2, color: "#5A7080", double: false },
    { name: "Computer Science", periods: 3, color: "#3A4FB0", double: true },
  ],
};

// ── TIMETABLE SOLVER ──────────────────────────────────────────────────────────
export function generateTimetable(classes, teachers, subjects, timeStructure, includeSaturday = false) {
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const lessonSlots = timeStructure.filter(s => s.type === "lesson");
  const timetable = {};
  classes.forEach(cls => {
    timetable[cls.id] = {};
    DAYS.forEach(day => { timetable[cls.id][day] = Array(lessonSlots.length).fill(null); });
  });
  const CORE = ["Mathematics", "English", "Kiswahili"];
  const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const isTeacherBusy = (tid, day, slot) => !tid ? false : classes.some(c => timetable[c.id][day]?.[slot]?.teacherId === tid);
  const isClassBusy = (cid, day, slot) => timetable[cid][day]?.[slot] !== null;

  const assignments = [];
  classes.forEach(cls => {
    subjects.filter(s => s.classId === cls.id).forEach(subj => {
      const teacher = teachers.find(t => t.assignments?.some(a => a.subjectId === subj.id && a.classId === cls.id));
      const doubles = subj.double ? Math.floor(subj.periods / 2) : 0;
      const singles = subj.periods - doubles * 2;
      for (let i = 0; i < doubles; i++) assignments.push({ classId: cls.id, subjectId: subj.id, teacherId: teacher?.id, isDouble: true });
      for (let i = 0; i < singles; i++) assignments.push({ classId: cls.id, subjectId: subj.id, teacherId: teacher?.id, isDouble: false });
    });
  });

  shuffle(assignments).forEach(asgn => {
    const subj = subjects.find(s => s.id === asgn.subjectId);
    const isCore = CORE.some(c => subj?.name?.includes(c));
    let placed = false;
    for (const day of shuffle(DAYS)) {
      if (placed) break;
      const slots = asgn.isDouble
        ? Array.from({ length: lessonSlots.length - 1 }, (_, i) => i)
        : isCore ? [0, 1, 2, 3, 4, 5, 6, 7] : shuffle(Array.from({ length: lessonSlots.length }, (_, i) => i));
      for (const slot of slots) {
        if (placed) break;
        if (asgn.isDouble) {
          if (slot + 1 >= lessonSlots.length) continue;
          if (isClassBusy(asgn.classId, day, slot) || isClassBusy(asgn.classId, day, slot + 1)) continue;
          if (isTeacherBusy(asgn.teacherId, day, slot) || isTeacherBusy(asgn.teacherId, day, slot + 1)) continue;
          timetable[asgn.classId][day][slot] = { subjectId: asgn.subjectId, teacherId: asgn.teacherId, isDouble: true, doubleStart: true };
          timetable[asgn.classId][day][slot + 1] = { subjectId: asgn.subjectId, teacherId: asgn.teacherId, isDouble: true, doubleStart: false };
          placed = true;
        } else {
          if (isClassBusy(asgn.classId, day, slot) || isTeacherBusy(asgn.teacherId, day, slot)) continue;
          timetable[asgn.classId][day][slot] = { subjectId: asgn.subjectId, teacherId: asgn.teacherId, isDouble: false };
          placed = true;
        }
      }
    }
  });
  return timetable;
}

// ── CONFLICT DETECTION ────────────────────────────────────────────────────────
export function detectConflicts(timetable, classes, teachers, subjects, slots, includeSaturday) {
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const lessonSlots = slots.filter(s => s.type === "lesson");
  const conflicts = [];

  DAYS.forEach(day => {
    lessonSlots.forEach((_, i) => {
      const teacherMap = {};
      classes.forEach(cls => {
        const cell = timetable?.[cls.id]?.[day]?.[i];
        if (cell?.teacherId) {
          if (teacherMap[cell.teacherId]) {
            const tc = teachers.find(x => x.id === cell.teacherId);
            conflicts.push({ type: "double-booked", msg: `${tc?.name || "Teacher"} is double-booked on ${day}, slot ${i + 1}`, severity: "error" });
          }
          teacherMap[cell.teacherId] = true;
        }
      });
    });
  });

  teachers.forEach(tc => {
    let weekTotal = 0;
    DAYS.forEach(day => {
      let dayTotal = 0;
      lessonSlots.forEach((_, i) => {
        classes.forEach(cls => {
          if (timetable?.[cls.id]?.[day]?.[i]?.teacherId === tc.id) { dayTotal++; weekTotal++; }
        });
      });
      if (dayTotal > tc.maxPerDay) {
        conflicts.push({ type: "overloaded-day", msg: `${tc.name} has ${dayTotal} lessons on ${day} (max: ${tc.maxPerDay})`, severity: "warning" });
      }
    });
    if (weekTotal > tc.maxPerWeek) {
      conflicts.push({ type: "overloaded-week", msg: `${tc.name} has ${weekTotal} lessons/week (max: ${tc.maxPerWeek})`, severity: "warning" });
    }
  });

  return conflicts;
}

// ── EXPORT TO EXCEL ───────────────────────────────────────────────────────────
function exportToExcel(timetable, classes, subjects, teachers, slots, school, includeSaturday) {
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const lessonSlots = slots.filter(s => s.type === "lesson");

  let csv = `${school.name} - Timetable - ${school.term}\n\n`;
  classes.forEach(cls => {
    csv += `${cls.grade} ${cls.stream}\n`;
    csv += `Time,${DAYS.join(",")}\n`;
    slots.forEach((slot, idx) => {
      if (slot.type !== "lesson") {
        csv += `${slot.label},,,,, \n`;
        return;
      }
      const li = slots.slice(0, idx + 1).filter(s => s.type === "lesson").length - 1;
      const row = DAYS.map(day => {
        const cell = timetable?.[cls.id]?.[day]?.[li];
        const subj = cell ? subjects.find(s => s.id === cell.subjectId) : null;
        const tch = cell ? teachers.find(t => t.id === cell.teacherId) : null;
        return subj ? `"${subj.name}${tch ? " (" + tch.name.split(" ")[0] + ")" : ""}"` : "";
      });
      csv += `${slot.start} ${slot.label},${row.join(",")}\n`;
    });
    csv += "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${school.name.replace(/\s+/g, "_")}_Timetable_${school.term.replace(/\s+/g, "_")}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ── EXPORT TO PDF ─────────────────────────────────────────────────────────────
function exportToPDF(timetable, selClass, classes, subjects, teachers, slots, school, includeSaturday) {
  if (!timetable || !selClass) return;
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const cls = classes.find(c => c.id === selClass);
  const win = window.open("", "_blank");
  let rows = "";
  slots.forEach((slot, idx) => {
    if (slot.type !== "lesson") {
      rows += `<tr><td colspan="${DAYS.length + 1}" style="background:#fff8e1;color:#f57c00;text-align:center;padding:6px;font-size:12px;font-style:italic">${slot.start} — ${slot.label}</td></tr>`;
      return;
    }
    const li = slots.slice(0, idx + 1).filter(s => s.type === "lesson").length - 1;
    let row = `<tr><td style="padding:8px 12px;font-size:11px;color:#666;border:1px solid #e8e8e8;white-space:nowrap;background:#fafafa"><b style="color:#333">${slot.start}</b><br><span style="color:#999">${slot.label}</span></td>`;
    DAYS.forEach(day => {
      const cell = timetable?.[selClass]?.[day]?.[li];
      const subj = cell ? subjects.find(s => s.id === cell.subjectId) : null;
      const tch = cell ? teachers.find(tc => tc.id === cell.teacherId) : null;
      row += subj
        ? `<td style="padding:6px;text-align:center;border:1px solid #e8e8e8;background:${subj.color}14"><div style="font-weight:800;font-size:10px;color:${subj.color}">${subj.name}${cell.isDouble && cell.doubleStart ? " ×2" : ""}</div>${tch ? `<div style="font-size:9px;color:#888;margin-top:2px">${tch.name}</div>` : ""}</td>`
        : `<td style="border:1px solid #e8e8e8;background:#fcfcfc"></td>`;
    });
    rows += row + "</tr>";
  });

  win.document.write(`<!DOCTYPE html><html><head><title>${school.name} — ${cls?.grade} ${cls?.stream}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Playfair+Display:wght@700&display=swap');
      body{font-family:'Sora',sans-serif;padding:28px;color:#1a1a2e;background:#fff}
      .header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #5B4FE8}
      h1{font-family:'Playfair Display',serif;font-size:22px;margin:0;color:#1a1a2e}
      h2{font-size:14px;font-weight:600;color:#666;margin:6px 0 4px}
      .meta{font-size:11px;color:#999}
      table{width:100%;border-collapse:collapse;margin-top:16px}
      th{padding:10px 8px;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#5B4FE8;background:#f0eeff;border:1px solid #e0ddf8;text-align:center}
      th:first-child{text-align:left}
      @media print{@page{size:A4 landscape;margin:1cm}body{padding:0}.no-print{display:none}}
    </style></head><body>
    <div class="header">
      <h1>${school.name}</h1>
      <h2>${cls?.grade} ${cls?.stream} — ${school.term}</h2>
      <div class="meta">${school.county} &nbsp;|&nbsp; Generated ${new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
    <table><thead><tr>
      <th style="width:90px">Time</th>
      ${DAYS.map(d => `<th>${d}</th>`).join("")}
    </tr></thead><tbody>${rows}</tbody></table>
    <script>window.onload=()=>{window.print()}</script>
    </body></html>`);
  win.document.close();
}

// ── TIMETABLE GRID WITH DRAG & DROP ──────────────────────────────────────────
function ClassGrid({ timetable, setTimetable, classId, subjects, teachers, slots, t, editable = false, includeSaturday }) {
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDrop = (day, slotIdx) => {
    if (!dragFrom || !editable || !setTimetable) return;
    if (dragFrom.day === day && dragFrom.slotIdx === slotIdx) { setDragFrom(null); setDragOver(null); return; }
    setTimetable(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const from = next[classId][dragFrom.day][dragFrom.slotIdx];
      const to = next[classId][day][slotIdx];
      next[classId][dragFrom.day][dragFrom.slotIdx] = to;
      next[classId][day][slotIdx] = from;
      return next;
    });
    setDragFrom(null); setDragOver(null);
  };

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
        <thead>
          <tr>
            <th style={{ padding: "10px 12px", fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left", borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>Slot</th>
            {DAYS.map(d => (
              <th key={d} style={{ padding: "10px 8px", fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "center", borderBottom: `1px solid ${t.border}` }}>{d.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, idx) => {
            if (slot.type !== "lesson") return (
              <tr key={slot.id}>
                <td colSpan={DAYS.length + 1} style={{ padding: "5px 12px", textAlign: "center", fontSize: 11, background: t.breakBg, color: t.breakText, fontWeight: 600, borderBottom: `1px solid ${t.border}` }}>
                  {slot.start} — {slot.label} ({slot.duration}m)
                </td>
              </tr>
            );
            const li = slots.slice(0, idx + 1).filter(s => s.type === "lesson").length - 1;
            return (
              <tr key={slot.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                <td style={{ padding: "7px 12px", fontSize: 11, color: t.textMuted, whiteSpace: "nowrap" }}>
                  <div style={{ fontWeight: 700 }}>{slot.start}</div>
                  <div style={{ fontSize: 10 }}>{slot.label}</div>
                </td>
                {DAYS.map(day => {
                  const cell = timetable?.[classId]?.[day]?.[li];
                  const subj = cell ? subjects.find(s => s.id === cell.subjectId) : null;
                  const tch = cell ? teachers.find(tc => tc.id === cell.teacherId) : null;
                  const isDragOver = dragOver?.day === day && dragOver?.slotIdx === li;
                  return (
                    <td key={day} style={{ padding: 3, textAlign: "center" }}
                      onDragOver={e => { e.preventDefault(); setDragOver({ day, slotIdx: li }); }}
                      onDrop={() => handleDrop(day, li)}
                      onDragLeave={() => setDragOver(null)}>
                      {subj ? (
                        <div
                          draggable={editable}
                          onDragStart={() => setDragFrom({ day, slotIdx: li })}
                          style={{
                            padding: "5px 6px", borderRadius: 8,
                            background: isDragOver ? subj.color + "44" : subj.color + "1E",
                            border: `1px solid ${isDragOver ? subj.color : subj.color + "33"}`,
                            minHeight: 44, cursor: editable ? "grab" : "default",
                            transition: "all 0.15s",
                            transform: isDragOver ? "scale(1.05)" : "scale(1)",
                          }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: subj.color, lineHeight: 1.2 }}>
                            {subj.name}{cell.isDouble && cell.doubleStart ? " ×2" : ""}
                          </div>
                          {tch && <div style={{ fontSize: 9, color: t.textMuted, marginTop: 2 }}>{tch.name.split(" ")[0]}</div>}
                        </div>
                      ) : (
                        <div style={{
                          minHeight: 44, borderRadius: 8,
                          background: isDragOver ? t.accentGlow : t.card,
                          border: `1px dashed ${isDragOver ? t.accent : t.border}`,
                          transition: "all 0.15s",
                        }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TeacherGrid({ timetable, teacher, classes, subjects, slots, t, includeSaturday }) {
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
        <thead>
          <tr>
            <th style={{ padding: "10px 12px", fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left", borderBottom: `1px solid ${t.border}` }}>Slot</th>
            {DAYS.map(d => <th key={d} style={{ padding: "10px 8px", fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "center", borderBottom: `1px solid ${t.border}` }}>{d.slice(0, 3)}</th>)}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, idx) => {
            if (slot.type !== "lesson") return (
              <tr key={slot.id}><td colSpan={DAYS.length + 1} style={{ padding: "5px 12px", textAlign: "center", fontSize: 11, background: t.breakBg, color: t.breakText, fontWeight: 600, borderBottom: `1px solid ${t.border}` }}>{slot.start} — {slot.label}</td></tr>
            );
            const li = slots.slice(0, idx + 1).filter(s => s.type === "lesson").length - 1;
            return (
              <tr key={slot.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                <td style={{ padding: "7px 12px", fontSize: 11, color: t.textMuted }}><div style={{ fontWeight: 700 }}>{slot.start}</div><div style={{ fontSize: 10 }}>{slot.label}</div></td>
                {DAYS.map(day => {
                  let found = null;
                  classes.forEach(cls => { const cell = timetable?.[cls.id]?.[day]?.[li]; if (cell?.teacherId === teacher.id) found = { cell, cls }; });
                  const subj = found ? subjects.find(s => s.id === found.cell.subjectId) : null;
                  return (
                    <td key={day} style={{ padding: 3, textAlign: "center" }}>
                      {found && subj ? (
                        <div style={{ padding: "5px 6px", borderRadius: 8, background: subj.color + "1E", border: `1px solid ${subj.color}33`, minHeight: 44 }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: subj.color }}>{subj.name}</div>
                          <div style={{ fontSize: 9, color: t.textMuted }}>{found.cls.grade} {found.cls.stream}</div>
                        </div>
                      ) : <div style={{ minHeight: 44, borderRadius: 8, background: t.card, border: `1px dashed ${t.border}` }} />}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Master view: all classes side by side for a single slot/day
function MasterView({ timetable, classes, subjects, teachers, slots, t, includeSaturday }) {
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const lessonSlots = slots.filter(s => s.type === "lesson");
  const [selDay, setSelDay] = useState(DAYS[0]);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {DAYS.map(d => (
          <button key={d} onClick={() => setSelDay(d)} style={{
            padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: selDay === d ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})` : t.card,
            color: selDay === d ? "#fff" : t.textMuted, fontWeight: 600, fontSize: 12,
            boxShadow: selDay === d ? `0 4px 12px ${t.accentGlow}` : "none",
          }}>{d.slice(0, 3)}</button>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: classes.length * 120 + 80 }}>
          <thead>
            <tr>
              <th style={{ padding: "8px 12px", fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left", borderBottom: `1px solid ${t.border}` }}>Slot</th>
              {classes.map(cls => (
                <th key={cls.id} style={{ padding: "8px 6px", fontSize: 10, fontWeight: 700, color: t.accent, textAlign: "center", borderBottom: `1px solid ${t.border}` }}>{cls.grade} {cls.stream}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, idx) => {
              if (slot.type !== "lesson") return (
                <tr key={slot.id}><td colSpan={classes.length + 1} style={{ padding: "4px 12px", textAlign: "center", fontSize: 10, background: t.breakBg, color: t.breakText, fontWeight: 600, borderBottom: `1px solid ${t.border}` }}>{slot.label}</td></tr>
              );
              const li = slots.slice(0, idx + 1).filter(s => s.type === "lesson").length - 1;
              return (
                <tr key={slot.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: "6px 12px", fontSize: 10, color: t.textMuted, whiteSpace: "nowrap" }}><b>{slot.start}</b></td>
                  {classes.map(cls => {
                    const cell = timetable?.[cls.id]?.[selDay]?.[li];
                    const subj = cell ? subjects.find(s => s.id === cell.subjectId) : null;
                    const tch = cell ? teachers.find(tc => tc.id === cell.teacherId) : null;
                    return (
                      <td key={cls.id} style={{ padding: 3, textAlign: "center" }}>
                        {subj ? (
                          <div style={{ padding: "4px 5px", borderRadius: 6, background: subj.color + "18", border: `1px solid ${subj.color}33`, minHeight: 36 }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: subj.color, lineHeight: 1.2 }}>{subj.name}</div>
                            {tch && <div style={{ fontSize: 8, color: t.textMuted }}>{tch.name.split(" ")[0]}</div>}
                          </div>
                        ) : <div style={{ minHeight: 36, borderRadius: 6, background: t.card, border: `1px dashed ${t.border}` }} />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export function Dashboard({ school, classes, teachers, subjects, timetable, onNavigate, t, addToast }) {
  const DAYS = school.includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;
  const stats = [
    { icon: "book", label: "Classes", value: classes.length, color: t.accent, step: 1 },
    { icon: "people", label: "Teachers", value: teachers.length, color: t.gold, step: 2 },
    { icon: "layers", label: "Subjects", value: subjects.length, color: t.success, step: 1 },
    { icon: "calendarEvent", label: "Timetable", value: timetable ? "Ready" : "Pending", color: timetable ? t.success : t.warning, step: 3 },
  ];

  const workloadData = teachers.map(tc => {
    let total = 0;
    if (timetable) {
      DAYS.forEach(day => {
        const slots = Object.values(timetable);
        slots.forEach(classTT => {
          const daySlots = classTT[day] || [];
          daySlots.forEach(cell => { if (cell?.teacherId === tc.id) total++; });
        });
      });
    }
    return { ...tc, total, pct: Math.min(100, Math.round((total / (tc.maxPerWeek || 27)) * 100)) };
  });

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: t.text, letterSpacing: "-0.03em", marginBottom: 6 }}>
          {school.name ? `Welcome back` : "Welcome to Timetable For All"}
        </h1>
        {school.name ? (
          <div style={{ fontSize: 15, color: t.textMuted }}><span style={{ color: t.accent, fontWeight: 700 }}>{school.name}</span> · {school.term}</div>
        ) : (
          <div style={{ fontSize: 14, color: t.textMuted }}>Start by setting up your school details.</div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <GlassCard key={i} t={t} style={{ padding: 20, cursor: "pointer" }} onClick={() => onNavigate(s.step)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + "22", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={17} color={s.color} />
              </div>
              <Icon name="arrowRight" size={13} color={t.textFaint} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: t.text, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Quick actions */}
        <GlassCard t={t} style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase", fontSize: 11, color: t.textMuted }}>Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "school", label: "Set up school", step: 0, done: !!school.name },
              { icon: "book", label: "Add classes", step: 1, done: classes.length > 0 },
              { icon: "people", label: "Add teachers", step: 2, done: teachers.length > 0 },
              { icon: "lightning", label: "Generate timetable", step: 3, done: !!timetable },
            ].map((item, i) => (
              <button key={i} onClick={() => onNavigate(item.step)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, border: `1px solid ${item.done ? t.success + "33" : t.border}`,
                background: item.done ? t.success + "0A" : t.card,
                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
              }}>
                <Icon name={item.done ? "checkCircle" : item.icon} size={15} color={item.done ? t.success : t.textMuted} />
                <span style={{ flex: 1, fontSize: 13, color: item.done ? t.success : t.text, fontWeight: item.done ? 600 : 400, textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.7 : 1 }}>{item.label}</span>
                {!item.done && <Icon name="chevronRight" size={12} color={t.textFaint} />}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Teacher Workload */}
        <GlassCard t={t} style={{ padding: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>Teacher Workload</div>
          {workloadData.length === 0 ? (
            <EmptyState icon="people" title="No teachers yet" subtitle="Add teachers to see workload" t={t} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {workloadData.slice(0, 5).map(tc => (
                <div key={tc.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{tc.name.split(" ")[0]}</span>
                    <span style={{ fontSize: 11, color: tc.pct > 90 ? t.danger : tc.pct > 70 ? t.warning : t.success, fontWeight: 700 }}>{tc.total}/{tc.maxPerWeek}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: t.card, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                      width: `${tc.pct}%`,
                      background: tc.pct > 90 ? t.danger : tc.pct > 70 ? t.warning : `linear-gradient(90deg, ${t.accent}, ${t.accentLight})`,
                      boxShadow: tc.pct > 90 ? `0 0 8px ${t.dangerGlow}` : `0 0 8px ${t.accentGlow}`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

// ── STEP 1: SCHOOL ────────────────────────────────────────────────────────────
export function StepSchool({ school, setSchool, slots, setSlots, t }) {
  const [showEdit, setShowEdit] = useState(false);
  const lessons = slots.filter(s => s.type === "lesson").length;
  const typeColor = { lesson: t.success, break: t.warning, lunch: t.danger, assembly: t.accent, ppi: t.textMuted };

  return (
    <div className="fade-in">
      <SectionTitle icon="school" title="School Setup" subtitle="Configure your school's identity and daily timetable structure" t={t} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 20 }}>
        <Input label="School Name" value={school.name} onChange={v => setSchool(p => ({ ...p, name: v }))} placeholder="e.g. Nairobi Academy" t={t} />
        <Input label="County" value={school.county} onChange={v => setSchool(p => ({ ...p, county: v }))} placeholder="e.g. Nairobi County" t={t} />
        <Input label="Term / Year" value={school.term} onChange={v => setSchool(p => ({ ...p, term: v }))} placeholder="e.g. Term 1 2026" t={t} />
        <Input label="Lesson Duration (min)" type="number" value={school.lessonDuration} onChange={v => setSchool(p => ({ ...p, lessonDuration: Number(v) }))} t={t} />
      </div>

      <GlassCard t={t} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Toggle label="Include Saturday" checked={!!school.includeSaturday} onChange={v => setSchool(p => ({ ...p, includeSaturday: v }))} t={t} />
          </div>
          <Badge color={t.success} t={t}>{lessons} lessons/day</Badge>
        </div>
      </GlassCard>

      <GlassCard t={t} style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="calendarEvent" size={16} color={t.textMuted} />
            <span style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Daily Structure</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn size="sm" variant="secondary" onClick={() => setShowEdit(p => !p)} t={t}>
              <Icon name="gear" size={13} color={t.textMuted} /> {showEdit ? "Hide" : "Edit"}
            </Btn>
            <Btn size="sm" variant="secondary" onClick={() => {
              const last = slots[slots.length - 1];
              const [h, m] = last.start.split(":").map(Number);
              const t2 = h * 60 + m + last.duration;
              const ns = `${String(Math.floor(t2 / 60)).padStart(2, "0")}:${String(t2 % 60).padStart(2, "0")}`;
              setSlots(p => [...p, { id: uid(), type: "break", label: "Extra Break", start: ns, duration: 20 }]);
            }} t={t}><Icon name="plus" size={13} color={t.textMuted} /> Break</Btn>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {slots.map(s => (
            <div key={s.id} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: (typeColor[s.type] || t.accent) + "18", border: `1px solid ${(typeColor[s.type] || t.accent)}33`, color: typeColor[s.type] || t.accent }}>
              {s.start} {s.label}
            </div>
          ))}
        </div>
        {showEdit && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {slots.map(sl => (
              <div key={sl.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select value={sl.type} onChange={e => setSlots(p => p.map(x => x.id === sl.id ? { ...x, type: e.target.value } : x))}
                  style={{ padding: "8px 10px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12 }}>
                  {["lesson", "break", "lunch", "assembly", "ppi"].map(tp => <option key={tp}>{tp}</option>)}
                </select>
                <input value={sl.label} onChange={e => setSlots(p => p.map(x => x.id === sl.id ? { ...x, label: e.target.value } : x))}
                  style={{ flex: 1, minWidth: 80, padding: "8px 10px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12 }} />
                <input type="time" value={sl.start} onChange={e => setSlots(p => p.map(x => x.id === sl.id ? { ...x, start: e.target.value } : x))}
                  style={{ padding: "8px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12 }} />
                <input type="number" value={sl.duration} onChange={e => setSlots(p => p.map(x => x.id === sl.id ? { ...x, duration: Number(e.target.value) } : x))}
                  style={{ width: 54, padding: "8px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12 }} />
                <button onClick={() => setSlots(p => p.filter(x => x.id !== sl.id))} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Icon name="trash" size={14} color={t.danger} />
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ── STEP 2: CLASSES ───────────────────────────────────────────────────────────
export function StepClasses({ classes, setClasses, subjects, setSubjects, t }) {
  const [grade, setGrade] = useState("Grade 7");
  const [stream, setStream] = useState("A");
  const [preset, setPreset] = useState("JSS (7–9)");
  const [active, setActive] = useState(null);
  const activeSubjects = subjects.filter(s => s.classId === active);
  const totalPeriods = activeSubjects.reduce((sum, s) => sum + s.periods, 0);
  const activeClass = classes.find(c => c.id === active);

  return (
    <div className="fade-in">
      <SectionTitle icon="book" title="Classes & Subjects" subtitle="Define streams and load CBC-compliant subject allocations" t={t} />
      <div style={{ display: "grid", gridTemplateColumns: "clamp(220px,28%,270px) 1fr", gap: 18 }}>
        <div>
          <GlassCard t={t} style={{ marginBottom: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Add Stream</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <select value={grade} onChange={e => setGrade(e.target.value)}
                style={{ flex: 1, padding: "9px 10px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13 }}>
                {["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"].map(g => <option key={g}>{g}</option>)}
              </select>
              <select value={stream} onChange={e => setStream(e.target.value)}
                style={{ width: 54, padding: "9px 6px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13 }}>
                {["A", "B", "C", "D", "E", "F"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Btn variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => {
              const id = uid(); setClasses(p => [...p, { id, grade, stream }]); setActive(id);
            }} t={t}><Icon name="plus" size={14} color="#fff" /> Add Class</Btn>
          </GlassCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {classes.length === 0 && <EmptyState icon="book" title="No classes yet" subtitle="Add your first class above" t={t} />}
            {classes.map(cls => (
              <div key={cls.id} onClick={() => setActive(cls.id)} style={{
                padding: "12px 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                background: active === cls.id ? t.accent + "18" : t.card,
                border: `1px solid ${active === cls.id ? t.accent : t.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: active === cls.id ? `inset 3px 0 0 ${t.accent}` : "none",
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: t.text, fontFamily: "'Playfair Display',serif" }}>{cls.grade} {cls.stream}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{subjects.filter(s => s.classId === cls.id).length} subjects</div>
                </div>
                <button onClick={e => { e.stopPropagation(); setClasses(p => p.filter(c => c.id !== cls.id)); setSubjects(p => p.filter(s => s.classId !== cls.id)); if (active === cls.id) setActive(null); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <Icon name="x" size={14} color={t.danger} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          {active ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 18, color: t.text }}>{activeClass?.grade} {activeClass?.stream}</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    <span style={{ color: totalPeriods === 41 ? t.success : totalPeriods > 41 ? t.danger : t.warning, fontWeight: 700 }}>
                      {totalPeriods}/41 periods {totalPeriods === 41 ? "✓" : totalPeriods > 41 ? "— too many" : "— incomplete"}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <select value={preset} onChange={e => setPreset(e.target.value)}
                    style={{ padding: "8px 10px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 12 }}>
                    {Object.keys(CBC_PRESETS).map(k => <option key={k}>{k}</option>)}
                  </select>
                  <Btn size="sm" variant="primary" onClick={() => setSubjects(p => [...p.filter(s => s.classId !== active), ...CBC_PRESETS[preset].map(s => ({ id: uid(), classId: active, ...s }))])} t={t}>
                    <Icon name="layers" size={12} color="#fff" /> Load Preset
                  </Btn>
                  <Btn size="sm" variant="secondary" onClick={() => setSubjects(p => [...p, { id: uid(), classId: active, name: "New Subject", periods: 3, double: false, color: "#607D8B" }])} t={t}>
                    <Icon name="plus" size={12} color={t.textMuted} /> Subject
                  </Btn>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeSubjects.map(subj => (
                  <GlassCard key={subj.id} t={t} style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <input type="color" value={subj.color} onChange={e => setSubjects(p => p.map(s => s.id === subj.id ? { ...s, color: e.target.value } : s))}
                        style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${subj.color}55`, cursor: "pointer", padding: 1, background: "transparent" }} />
                      <input value={subj.name} onChange={e => setSubjects(p => p.map(s => s.id === subj.id ? { ...s, name: e.target.value } : s))}
                        style={{ flex: 1, minWidth: 120, padding: "7px 11px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13, fontWeight: 600 }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ fontSize: 11, color: t.textMuted }}>per week</span>
                        <input type="number" min={1} max={10} value={subj.periods}
                          onChange={e => setSubjects(p => p.map(s => s.id === subj.id ? { ...s, periods: Number(e.target.value) } : s))}
                          style={{ width: 48, padding: "6px 8px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13, textAlign: "center" }} />
                      </div>
                      <Toggle label="2×" checked={subj.double} onChange={v => setSubjects(p => p.map(s => s.id === subj.id ? { ...s, double: v } : s))} t={t} />
                      <button onClick={() => setSubjects(p => p.filter(s => s.id !== subj.id))} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <Icon name="trash" size={13} color={t.danger} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
                {activeSubjects.length === 0 && <EmptyState icon="layers" title="No subjects yet" subtitle="Load a CBC preset or add subjects manually" t={t} />}
              </div>
            </>
          ) : (
            <EmptyState icon="arrowRight" title="Select a class" subtitle="Click a class on the left to configure its subjects" t={t} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── STEP 3: TEACHERS ──────────────────────────────────────────────────────────
export function StepTeachers({ teachers, setTeachers, classes, subjects, t }) {
  const [active, setActive] = useState(null);
  const [newName, setNewName] = useState("");
  const teacher = teachers.find(tc => tc.id === active);

  return (
    <div className="fade-in">
      <SectionTitle icon="people" title="Teachers" subtitle="Register staff and assign them to specific class-subject combinations" t={t} />
      <div style={{ display: "grid", gridTemplateColumns: "clamp(220px,28%,270px) 1fr", gap: 18 }}>
        <div>
          <GlassCard t={t} style={{ marginBottom: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Add Teacher</div>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && newName.trim()) { const id = uid(); setTeachers(p => [...p, { id, name: newName.trim(), tscNumber: "", maxPerDay: 7, maxPerWeek: 27, assignments: [] }]); setActive(id); setNewName(""); } }}
              placeholder="Full name (Enter to add)"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13, marginBottom: 10, boxSizing: "border-box" }} />
            <Btn variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => {
              if (!newName.trim()) return;
              const id = uid();
              setTeachers(p => [...p, { id, name: newName.trim(), tscNumber: "", maxPerDay: 7, maxPerWeek: 27, assignments: [] }]);
              setActive(id); setNewName("");
            }} t={t}><Icon name="plus" size={14} color="#fff" /> Add Teacher</Btn>
          </GlassCard>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {teachers.length === 0 && <EmptyState icon="people" title="No teachers yet" subtitle="Add your first teacher above" t={t} />}
            {teachers.map(tc => (
              <div key={tc.id} onClick={() => setActive(tc.id)} style={{
                padding: "12px 14px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                background: active === tc.id ? t.accent + "18" : t.card,
                border: `1px solid ${active === tc.id ? t.accent : t.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: active === tc.id ? `inset 3px 0 0 ${t.accent}` : "none",
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: t.text, fontFamily: "'Playfair Display',serif" }}>{tc.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{tc.assignments.length} assignments</div>
                </div>
                <button onClick={e => { e.stopPropagation(); setTeachers(p => p.filter(x => x.id !== tc.id)); if (active === tc.id) setActive(null); }}
                  style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Icon name="x" size={14} color={t.danger} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          {teacher ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <Input label="Full Name" value={teacher.name} onChange={v => setTeachers(p => p.map(tc => tc.id === active ? { ...tc, name: v } : tc))} t={t} />
                <Input label="TSC Number" value={teacher.tscNumber || ""} onChange={v => setTeachers(p => p.map(tc => tc.id === active ? { ...tc, tscNumber: v } : tc))} placeholder="Optional" t={t} />
                <Input label="Max Lessons / Day" type="number" value={teacher.maxPerDay} onChange={v => setTeachers(p => p.map(tc => tc.id === active ? { ...tc, maxPerDay: Number(v) } : tc))} t={t} />
                <Input label="Max Lessons / Week" type="number" value={teacher.maxPerWeek} onChange={v => setTeachers(p => p.map(tc => tc.id === active ? { ...tc, maxPerWeek: Number(v) } : tc))} t={t} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Subject Assignments</div>
              {classes.map(cls => {
                const classSubjects = subjects.filter(s => s.classId === cls.id);
                if (!classSubjects.length) return null;
                return (
                  <GlassCard key={cls.id} t={t} style={{ marginBottom: 10, padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: t.text, fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>{cls.grade} {cls.stream}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {classSubjects.map(subj => {
                        const assigned = teacher.assignments.some(a => a.subjectId === subj.id && a.classId === cls.id);
                        return (
                          <div key={subj.id} onClick={() => setTeachers(p => p.map(tc => {
                            if (tc.id !== active) return tc;
                            const ex = tc.assignments.some(a => a.subjectId === subj.id && a.classId === cls.id);
                            return { ...tc, assignments: ex ? tc.assignments.filter(a => !(a.subjectId === subj.id && a.classId === cls.id)) : [...tc.assignments, { subjectId: subj.id, classId: cls.id }] };
                          }))} style={{
                            padding: "5px 13px", borderRadius: 7, cursor: "pointer",
                            background: assigned ? subj.color + "28" : t.card,
                            border: `1px solid ${assigned ? subj.color : t.border}`,
                            color: assigned ? subj.color : t.textMuted,
                            fontSize: 12, fontWeight: 600, transition: "all 0.14s",
                            display: "flex", alignItems: "center", gap: 5,
                          }}>
                            {assigned && <Icon name="check" size={11} color={subj.color} />}
                            {subj.name}
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                );
              })}
              {classes.length === 0 && <div style={{ color: t.textFaint, fontSize: 13 }}>Add classes first.</div>}
            </>
          ) : (
            <EmptyState icon="people" title="Select a teacher" subtitle="Click a teacher on the left to configure assignments" t={t} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── STEP 4: GENERATE ──────────────────────────────────────────────────────────
export function StepGenerate({ school, classes, subjects, teachers, slots, timetable, setTimetable, t, addToast }) {
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState("class");
  const [selClass, setSelClass] = useState(null);
  const [selTeacher, setSelTeacher] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [dragMode, setDragMode] = useState(false);
  const includeSaturday = !!school.includeSaturday;
  const DAYS = includeSaturday ? [...DAYS_BASE, "Saturday"] : DAYS_BASE;

  const runGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const tt = generateTimetable(classes, teachers, subjects, slots, includeSaturday);
      setTimetable(tt);
      const found = detectConflicts(tt, classes, teachers, subjects, slots, includeSaturday);
      setConflicts(found);
      if (classes.length) setSelClass(classes[0].id);
      if (teachers.length) setSelTeacher(teachers[0].id);
      setGenerating(false);
      if (found.length === 0) { addToast("Timetable generated with zero conflicts!", "success", "✓ All Clear"); }
      else { addToast(`${found.length} conflict${found.length > 1 ? "s" : ""} detected. Review below.`, "warning", "Conflicts Found"); }
    }, 800);
  };

  const compliance = classes.map(cls => {
    const lessonSlots = slots.filter(s => s.type === "lesson");
    const needed = subjects.filter(s => s.classId === cls.id).reduce((a, s) => a + s.periods, 0);
    let placed = 0;
    DAYS.forEach(day => lessonSlots.forEach((_, i) => { if (timetable?.[cls.id]?.[day]?.[i]) placed++; }));
    return { cls, needed, placed, ok: placed >= needed };
  });

  return (
    <div className="fade-in">
      <SectionTitle icon="cpu" title="Generate Timetable" subtitle="Auto-solve, detect conflicts, export PDF or Excel, and drag-drop to adjust" t={t} />

      {/* Top controls */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
        <GlassCard t={t} style={{ padding: 20, minWidth: 260 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>
            {classes.length} classes · {teachers.length} teachers · {subjects.length} subjects
          </div>
          <Btn variant="primary" size="lg" onClick={runGenerate} disabled={generating || classes.length === 0}
            style={{ width: "100%", justifyContent: "center", marginBottom: 12 }} t={t}>
            <Icon name="cpu" size={16} color="#fff" />
            {generating ? "Generating…" : "Generate Timetable"}
          </Btn>
          {timetable && (
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <Btn size="sm" variant="secondary" onClick={() => exportToPDF(timetable, selClass, classes, subjects, teachers, slots, school, includeSaturday)} t={t}>
                <Icon name="filePdf" size={13} color={t.danger} /> PDF
              </Btn>
              <Btn size="sm" variant="secondary" onClick={() => { exportToExcel(timetable, classes, subjects, teachers, slots, school, includeSaturday); addToast("Excel/CSV downloaded.", "success"); }} t={t}>
                <Icon name="fileExcel" size={13} color={t.success} /> Excel
              </Btn>
              <Btn size="sm" variant={dragMode ? "primary" : "secondary"} onClick={() => setDragMode(p => !p)} t={t}>
                <Icon name="swap" size={13} color={dragMode ? "#fff" : t.textMuted} /> {dragMode ? "Editing" : "Drag Edit"}
              </Btn>
            </div>
          )}
        </GlassCard>

        {/* Compliance */}
        {timetable && compliance.length > 0 && (
          <GlassCard t={t} style={{ padding: 16, flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Compliance</div>
            {compliance.map(({ cls, needed, placed, ok }) => (
              <div key={cls.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: t.textMuted }}>{cls.grade} {cls.stream}</span>
                <span style={{ fontWeight: 700, color: ok ? t.success : t.warning }}>{placed}/{needed} {ok ? "✓" : "⚠"}</span>
              </div>
            ))}
          </GlassCard>
        )}

        {/* Conflicts */}
        {timetable && (
          <GlassCard t={t} style={{ padding: 16, minWidth: 200 }}>
            {conflicts.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.success }}>
                <Icon name="checkCircle" size={18} color={t.success} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Zero Conflicts</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>All teachers free</div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.danger, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                  <Icon name="warning" size={12} color={t.danger} style={{ marginRight: 4 }} />
                  {conflicts.length} Conflict{conflicts.length > 1 ? "s" : ""}
                </div>
                <div style={{ maxHeight: 160, overflowY: "auto" }}>
                  {conflicts.map((c, i) => (
                    <div key={i} style={{ fontSize: 11, color: c.severity === "error" ? t.danger : t.warning, marginBottom: 5, display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.severity === "error" ? t.danger : t.warning, flexShrink: 0, marginTop: 4 }} />
                      {c.msg}
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        )}
      </div>

      {/* Drag mode notice */}
      {dragMode && timetable && (
        <div style={{ padding: "10px 16px", borderRadius: 10, background: t.accentGlow, border: `1px solid ${t.accent}33`, marginBottom: 14, fontSize: 13, color: t.accent, display: "flex", gap: 8, alignItems: "center" }}>
          <Icon name="swap" size={14} color={t.accent} />
          Drag-and-drop mode active — drag any lesson to swap it with another slot.
        </div>
      )}

      {timetable && (
        <>
          {/* View switcher */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", background: t.card, borderRadius: 10, border: `1px solid ${t.border}`, padding: 3, gap: 2 }}>
              {[["class", "Class View", "grid"], ["teacher", "Teacher View", "person"], ["master", "Master View", "layers"]].map(([v, label, ic]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: view === v ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})` : "transparent",
                  color: view === v ? "#fff" : t.textMuted, fontWeight: 600, fontSize: 12,
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                  boxShadow: view === v ? `0 4px 12px ${t.accentGlow}` : "none",
                }}>
                  <Icon name={ic} size={13} color={view === v ? "#fff" : t.textMuted} />{label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            {view === "class" && (
              <select value={selClass || ""} onChange={e => setSelClass(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 9, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13 }}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.grade} {c.stream}</option>)}
              </select>
            )}
            {view === "teacher" && (
              <select value={selTeacher || ""} onChange={e => setSelTeacher(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 9, background: t.inputBg, border: `1px solid ${t.border}`, color: t.text, fontSize: 13 }}>
                {teachers.map(tc => <option key={tc.id} value={tc.id}>{tc.name}</option>)}
              </select>
            )}
            {view === "class" && selClass && (
              <Btn size="sm" variant="secondary" onClick={() => exportToPDF(timetable, selClass, classes, subjects, teachers, slots, school, includeSaturday)} t={t}>
                <Icon name="printer" size={13} color={t.textMuted} /> Print
              </Btn>
            )}
          </div>

          <GlassCard t={t} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: t.text }}>
                {view === "class" ? `${classes.find(c => c.id === selClass)?.grade} ${classes.find(c => c.id === selClass)?.stream} Timetable`
                  : view === "teacher" ? `${teachers.find(tc => tc.id === selTeacher)?.name} — Personal Timetable`
                    : "Master Timetable — All Classes"}
              </div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{school.name} · {school.term}</div>
            </div>
            <div style={{ padding: 16 }}>
              {view === "class" && selClass && <ClassGrid timetable={timetable} setTimetable={setTimetable} classId={selClass} subjects={subjects} teachers={teachers} slots={slots} t={t} editable={dragMode} includeSaturday={includeSaturday} />}
              {view === "teacher" && selTeacher && <TeacherGrid timetable={timetable} teacher={teachers.find(tc => tc.id === selTeacher)} classes={classes} subjects={subjects} slots={slots} t={t} includeSaturday={includeSaturday} />}
              {view === "master" && <MasterView timetable={timetable} classes={classes} subjects={subjects} teachers={teachers} slots={slots} t={t} includeSaturday={includeSaturday} />}
            </div>
          </GlassCard>
        </>
      )}

      {!timetable && (
        <EmptyState icon="calendarEvent" title="Ready to generate" subtitle="Complete your school, classes, and teachers setup, then click Generate Timetable above." t={t} />
      )}
    </div>
  );
}
