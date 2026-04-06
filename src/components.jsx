// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";

export const COLORS = {
  indigo: "#5B4FE8",
  indigoLight: "#7B72FF",
  indigoDark: "#3D33C4",
  gold: "#F0A500",
  goldLight: "#FFD166",
  goldDark: "#C47F00",
  teal: "#0D9E8A",
  tealLight: "#2ECDB8",
  amber: "#F59E0B",
};

export const themes = {
  dark: {
    bg: "#080B14",
    bgSecondary: "#0D1221",
    surface: "rgba(255,255,255,0.04)",
    surfaceHover: "rgba(255,255,255,0.07)",
    card: "rgba(255,255,255,0.06)",
    cardHover: "rgba(255,255,255,0.09)",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.18)",
    borderGlow: "rgba(91,79,232,0.4)",
    text: "#F0F4FF",
    textMuted: "#8892A4",
    textFaint: "#3D4557",
    accent: "#5B4FE8",
    accentLight: "#7B72FF",
    accentGlow: "rgba(91,79,232,0.25)",
    gold: "#F0A500",
    goldGlow: "rgba(240,165,0,0.2)",
    success: "#10D9A0",
    successGlow: "rgba(16,217,160,0.2)",
    warning: "#F59E0B",
    warningGlow: "rgba(245,158,11,0.2)",
    danger: "#FF5A7E",
    dangerGlow: "rgba(255,90,126,0.2)",
    inputBg: "rgba(255,255,255,0.05)",
    navBg: "rgba(8,11,20,0.85)",
    sidebarBg: "rgba(10,13,24,0.95)",
    stepActive: "#5B4FE8",
    stepDone: "#10D9A0",
    breakBg: "rgba(245,158,11,0.08)",
    breakText: "#F59E0B",
    glass: "rgba(255,255,255,0.04)",
    glassStrong: "rgba(255,255,255,0.08)",
    shadow: "0 8px 32px rgba(0,0,0,0.4)",
    shadowStrong: "0 20px 60px rgba(0,0,0,0.6)",
  },
  light: {
    bg: "#F5F3FF",
    bgSecondary: "#EDE9FE",
    surface: "rgba(255,255,255,0.8)",
    surfaceHover: "rgba(255,255,255,0.95)",
    card: "rgba(255,255,255,0.7)",
    cardHover: "rgba(255,255,255,0.9)",
    border: "rgba(91,79,232,0.12)",
    borderHover: "rgba(91,79,232,0.3)",
    borderGlow: "rgba(91,79,232,0.3)",
    text: "#1A1533",
    textMuted: "#5E5A8C",
    textFaint: "#B8B4D4",
    accent: "#5B4FE8",
    accentLight: "#7B72FF",
    accentGlow: "rgba(91,79,232,0.15)",
    gold: "#C47F00",
    goldGlow: "rgba(196,127,0,0.15)",
    success: "#059669",
    successGlow: "rgba(5,150,105,0.15)",
    warning: "#D97706",
    warningGlow: "rgba(217,119,6,0.15)",
    danger: "#DC2626",
    dangerGlow: "rgba(220,38,38,0.15)",
    inputBg: "rgba(255,255,255,0.9)",
    navBg: "rgba(245,243,255,0.9)",
    sidebarBg: "rgba(237,233,254,0.98)",
    stepActive: "#5B4FE8",
    stepDone: "#059669",
    breakBg: "rgba(217,119,6,0.08)",
    breakText: "#D97706",
    glass: "rgba(255,255,255,0.6)",
    glassStrong: "rgba(255,255,255,0.85)",
    shadow: "0 8px 32px rgba(91,79,232,0.1)",
    shadowStrong: "0 20px 60px rgba(91,79,232,0.15)",
  }
};

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
export const Icon = ({ name, size = 18, color = "currentColor", style = {} }) => {
  const icons = {
    school: <><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/></>,
    book: <><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.966c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/></>,
    people: <><path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></>,
    lightning: <><path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .491.592l-.83 4.48 2.587.47a.5.5 0 0 1 .162.907l-7 4a.5.5 0 0 1-.755-.496L5.33 5.5l-2.591-.47A.5.5 0 0 1 2.5 4h.518L5.52.36z"/></>,
    sun: <><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707z"/></>,
    moon: <><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></>,
    plus: <><path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></>,
    x: <><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></>,
    chevronRight: <><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></>,
    chevronLeft: <><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></>,
    check: <><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></>,
    checkCircle: <><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></>,
    warning: <><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></>,
    printer: <><path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></>,
    save: <><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></>,
    gear: <><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.474l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></>,
    calendarEvent: <><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></>,
    person: <><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></>,
    trash: <><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></>,
    layers: <><path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/></>,
    grid: <><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></>,
    arrowRight: <><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></>,
    cpu: <><path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></>,
    cloud: <><path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/></>,
    logout: <><path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></>,
    undo: <><path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></>,
    redo: <><path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></>,
    fileExcel: <><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/><path d="M4.5 12.5A.5.5 0 0 1 5 12h1.5v-2.5H5a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0v2.5H9V6a.5.5 0 0 1 1 0v2.5h1.5a.5.5 0 0 1 0 1H10V12h1.5a.5.5 0 0 1 0 1H10v1.5a.5.5 0 0 1-1 0V13H7.5v1.5a.5.5 0 0 1-1 0V13H5a.5.5 0 0 1-.5-.5z"/></>,
    filePdf: <><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/><path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029z"/></>,
    dashboard: <><path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/><path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"/></>,
    swap: <><path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/></>,
    calendar3: <><path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/><path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></>,
    barChart: <><path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/></>,
    google: <><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 16 16" style={style}>
      {icons[name] || null}
    </svg>
  );
};

// ── GLASS CARD ────────────────────────────────────────────────────────────────
export function GlassCard({ children, style = {}, t, hover = true, glow = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? t.cardHover : t.card,
        border: `1px solid ${hovered ? t.borderHover : t.border}`,
        borderRadius: 16,
        padding: 20,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: glow
          ? `0 0 0 1px ${t.borderGlow}, ${t.shadow}`
          : hovered ? t.shadowStrong : t.shadow,
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered && hover ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── PREMIUM BUTTON ────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", size = "md", disabled = false, style = {}, t }) {
  const [pressed, setPressed] = useState(false);
  const pad = size === "sm" ? "7px 14px" : size === "lg" ? "14px 32px" : "10px 22px";
  const fs = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const variants = {
    primary: {
      bg: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
      color: "#fff",
      border: "none",
      shadow: `0 4px 20px ${t.accentGlow}`,
    },
    gold: {
      bg: `linear-gradient(135deg, ${t.gold}, ${COLORS.goldLight})`,
      color: "#fff",
      border: "none",
      shadow: `0 4px 20px ${t.goldGlow}`,
    },
    success: {
      bg: `linear-gradient(135deg, ${t.success}, #34EEB0)`,
      color: "#fff",
      border: "none",
      shadow: `0 4px 20px ${t.successGlow}`,
    },
    secondary: {
      bg: t.card,
      color: t.text,
      border: `1px solid ${t.border}`,
      shadow: "none",
    },
    danger: {
      bg: "transparent",
      color: t.danger,
      border: `1px solid ${t.danger}44`,
      shadow: "none",
    },
    ghost: { bg: "transparent", color: t.textMuted, border: "none", shadow: "none" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        padding: pad,
        borderRadius: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        background: v.bg,
        color: v.color,
        border: v.border || "none",
        fontWeight: 600,
        fontSize: fs,
        fontFamily: "'Sora', sans-serif",
        boxShadow: v.shadow,
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        opacity: disabled ? 0.4 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        whiteSpace: "nowrap",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        letterSpacing: "0.01em",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = "text", t, style = {} }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: focused ? t.accent : t.textMuted, marginBottom: 7, textTransform: "uppercase", transition: "color 0.2s" }}>
          {label}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 10,
          background: t.inputBg,
          border: `1px solid ${focused ? t.accent : t.border}`,
          color: t.text,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "'Sora', sans-serif",
          transition: "border 0.2s, box-shadow 0.2s",
          boxShadow: focused ? `0 0 0 3px ${t.accentGlow}` : "none",
          ...style,
        }}
      />
    </div>
  );
}

// ── SECTION TITLE ─────────────────────────────────────────────────────────────
export function SectionTitle({ icon, title, subtitle, t }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${t.accent}33, ${t.accentLight}22)`,
          border: `1px solid ${t.accent}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={17} color={t.accent} />
        </div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: t.text, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}>{title}</h2>
      </div>
      {subtitle && <p style={{ margin: "0 0 0 48px", fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

// ── TOGGLE ────────────────────────────────────────────────────────────────────
export function Toggle({ label, checked, onChange, t }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 38, height: 22, borderRadius: 11,
        background: checked ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})` : t.border,
        position: "relative", transition: "background 0.25s", flexShrink: 0,
        boxShadow: checked ? `0 0 12px ${t.accentGlow}` : "none",
      }}>
        <div style={{
          position: "absolute", top: 3, left: checked ? 19 : 3, width: 16, height: 16,
          borderRadius: 8, background: "#fff", transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
      {label && <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Sora', sans-serif" }}>{label}</span>}
    </label>
  );
}

// ── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color, t }) {
  return (
    <span style={{
      background: (color || t.accent) + "22",
      color: color || t.accent,
      border: `1px solid ${(color || t.accent)}44`,
      borderRadius: 7,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
      fontFamily: "'Sora', sans-serif",
    }}>{children}</span>
  );
}

// ── TOAST SYSTEM ─────────────────────────────────────────────────────────────
export function ToastContainer({ toasts, removeToast, t }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} t={t} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove, t }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => { setVisible(false); setTimeout(onRemove, 300); }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, []);
  const colors = {
    success: { bg: t.success, glow: t.successGlow },
    error: { bg: t.danger, glow: t.dangerGlow },
    warning: { bg: t.warning, glow: t.warningGlow },
    info: { bg: t.accent, glow: t.accentGlow },
  };
  const c = colors[toast.type] || colors.info;
  return (
    <div style={{
      pointerEvents: "all",
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 18px",
      borderRadius: 14,
      background: t.surface,
      border: `1px solid ${c.bg}44`,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${c.bg}22`,
      minWidth: 280, maxWidth: 380,
      transform: visible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.9)",
      opacity: visible ? 1 : 0,
      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: c.bg, boxShadow: `0 0 8px ${c.glow}`, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        {toast.title && <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 2 }}>{toast.title}</div>}
        <div style={{ fontSize: 12, color: t.textMuted }}>{toast.message}</div>
      </div>
      <button onClick={() => { setVisible(false); setTimeout(onRemove, 300); }}
        style={{ background: "none", border: "none", cursor: "pointer", color: t.textFaint, padding: 2, display: "flex" }}>
        <Icon name="x" size={13} color={t.textFaint} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "info", title = "", duration = 3500) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type, title, duration }]);
  };
  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));
  return { toasts, addToast, removeToast };
}

// ── PROGRESS RING ─────────────────────────────────────────────────────────────
export function ProgressRing({ percent, size = 44, stroke = 4, color, t }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color || t.accent} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 4px ${color || t.accent})` }}
      />
    </svg>
  );
}

// ── SKELETON LOADER ───────────────────────────────────────────────────────────
export function Skeleton({ width = "100%", height = 20, borderRadius = 8, t }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: `linear-gradient(90deg, ${t.card} 25%, ${t.cardHover} 50%, ${t.card} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action, t }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `linear-gradient(135deg, ${t.accent}18, ${t.accentLight}10)`,
        border: `1px solid ${t.accent}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
      }}>
        <Icon name={icon} size={30} color={t.accent + "66"} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, color: t.textMuted, fontFamily: "'Playfair Display', serif" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: t.textFaint, maxWidth: 280, lineHeight: 1.6 }}>{subtitle}</div>}
      {action}
    </div>
  );
}

// ── AURORA BACKGROUND ─────────────────────────────────────────────────────────
export function AuroraBackground({ t }) {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: 800, height: 800, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.accent}18 0%, transparent 70%)`,
        top: "-200px", left: "-200px",
        animation: "aurora1 12s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.gold}12 0%, transparent 70%)`,
        bottom: "-100px", right: "-100px",
        animation: "aurora2 15s ease-in-out infinite alternate",
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.success}10 0%, transparent 70%)`,
        top: "40%", left: "40%",
        animation: "aurora3 18s ease-in-out infinite alternate",
      }} />
    </div>
  );
}
