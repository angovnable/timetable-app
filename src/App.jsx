import { useState, useCallback, useEffect } from "react";

// ── SVG ICON LIBRARY (Bootstrap-quality) ──────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor", style = {} }) => {
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
    eye: <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></>,
    gear: <><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.474l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></>,
    calendarEvent: <><path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/></>,
    person: <><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></>,
    trash: <><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></>,
    layers: <><path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"/></>,
    grid: <><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></>,
    arrowRight: <><path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></>,
    toggleOn: <><path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></>,
    cpu: <><path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 16 16" style={style}>
      {icons[name] || null}
    </svg>
  );
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const uid = () => Math.random().toString(36).slice(2,9);

const CBC_PRESETS = {
  "Lower Primary (1–3)": [
    { name:"Mathematics", periods:5, color:"#C0392B", double:false },
    { name:"English", periods:5, color:"#2980B9", double:false },
    { name:"Kiswahili", periods:5, color:"#27AE60", double:false },
    { name:"Environmental Activities", periods:4, color:"#D35400", double:false },
    { name:"Creative Arts", periods:3, color:"#8E44AD", double:true },
    { name:"Religious Education", periods:2, color:"#6D4C41", double:false },
    { name:"Physical Education", periods:2, color:"#00838F", double:true },
  ],
  "Upper Primary (4–6)": [
    { name:"Mathematics", periods:5, color:"#C0392B", double:false },
    { name:"English", periods:5, color:"#2980B9", double:false },
    { name:"Kiswahili", periods:5, color:"#27AE60", double:false },
    { name:"Integrated Science", periods:4, color:"#D35400", double:true },
    { name:"Social Studies", periods:3, color:"#8E44AD", double:false },
    { name:"Creative Arts & Sports", periods:3, color:"#AD1457", double:true },
    { name:"Agriculture", periods:2, color:"#558B2F", double:true },
    { name:"Religious Education", periods:2, color:"#6D4C41", double:false },
    { name:"Life Skills", periods:2, color:"#00838F", double:false },
  ],
  "JSS (7–9)": [
    { name:"Mathematics", periods:5, color:"#C0392B", double:false },
    { name:"English", periods:5, color:"#2980B9", double:false },
    { name:"Kiswahili", periods:4, color:"#27AE60", double:false },
    { name:"Integrated Science", periods:5, color:"#D35400", double:true },
    { name:"Social Studies", periods:3, color:"#8E44AD", double:false },
    { name:"Pre-Technical Studies", periods:4, color:"#BF360C", double:true },
    { name:"Creative Arts & Sports", periods:3, color:"#AD1457", double:true },
    { name:"Agriculture & Nutrition", periods:3, color:"#558B2F", double:true },
    { name:"Religious Education", periods:2, color:"#6D4C41", double:false },
    { name:"Life Skills", periods:2, color:"#00838F", double:false },
    { name:"Business Studies", periods:2, color:"#455A64", double:false },
    { name:"Computer Science", periods:3, color:"#1A237E", double:true },
  ],
};

const DEFAULT_SLOTS = [
  { id:uid(), type:"lesson", label:"Lesson 1", start:"07:00", duration:40 },
  { id:uid(), type:"lesson", label:"Lesson 2", start:"07:40", duration:40 },
  { id:uid(), type:"lesson", label:"Lesson 3", start:"08:20", duration:40 },
  { id:uid(), type:"break",  label:"Tea Break", start:"09:00", duration:20 },
  { id:uid(), type:"lesson", label:"Lesson 4", start:"09:20", duration:40 },
  { id:uid(), type:"lesson", label:"Lesson 5", start:"10:00", duration:40 },
  { id:uid(), type:"lesson", label:"Lesson 6", start:"10:40", duration:40 },
  { id:uid(), type:"lunch",  label:"Lunch Break", start:"11:20", duration:40 },
  { id:uid(), type:"lesson", label:"Lesson 7", start:"12:00", duration:40 },
  { id:uid(), type:"lesson", label:"Lesson 8", start:"12:40", duration:40 },
];

// ── SOLVER ────────────────────────────────────────────────────────────────────
function generateTimetable(classes, teachers, subjects, timeStructure) {
  const lessonSlots = timeStructure.filter(s => s.type === "lesson");
  const timetable = {};
  classes.forEach(cls => {
    timetable[cls.id] = {};
    DAYS.forEach(day => { timetable[cls.id][day] = Array(lessonSlots.length).fill(null); });
  });
  const CORE = ["Mathematics","English","Kiswahili"];
  const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  const isTeacherBusy = (tid,day,slot) => !tid ? false : classes.some(c => timetable[c.id][day][slot]?.teacherId === tid);
  const isClassBusy = (cid,day,slot) => timetable[cid][day][slot] !== null;

  const assignments = [];
  classes.forEach(cls => {
    subjects.filter(s => s.classId === cls.id).forEach(subj => {
      const teacher = teachers.find(t => t.assignments?.some(a => a.subjectId === subj.id && a.classId === cls.id));
      const doubles = subj.double ? Math.floor(subj.periods / 2) : 0;
      const singles = subj.periods - doubles * 2;
      for(let i=0;i<doubles;i++) assignments.push({classId:cls.id,subjectId:subj.id,teacherId:teacher?.id,isDouble:true});
      for(let i=0;i<singles;i++) assignments.push({classId:cls.id,subjectId:subj.id,teacherId:teacher?.id,isDouble:false});
    });
  });

  shuffle(assignments).forEach(asgn => {
    const subj = subjects.find(s => s.id === asgn.subjectId);
    const isCore = CORE.some(c => subj?.name?.includes(c));
    let placed = false;
    for(const day of shuffle(DAYS)) {
      if(placed) break;
      const slots = asgn.isDouble
        ? Array.from({length:lessonSlots.length-1},(_,i)=>i)
        : isCore ? [0,1,2,3,4,5,6,7] : shuffle(Array.from({length:lessonSlots.length},(_,i)=>i));
      for(const slot of slots) {
        if(placed) break;
        if(asgn.isDouble) {
          if(slot+1>=lessonSlots.length) continue;
          if(isClassBusy(asgn.classId,day,slot)||isClassBusy(asgn.classId,day,slot+1)) continue;
          if(isTeacherBusy(asgn.teacherId,day,slot)||isTeacherBusy(asgn.teacherId,day,slot+1)) continue;
          timetable[asgn.classId][day][slot]={subjectId:asgn.subjectId,teacherId:asgn.teacherId,isDouble:true,doubleStart:true};
          timetable[asgn.classId][day][slot+1]={subjectId:asgn.subjectId,teacherId:asgn.teacherId,isDouble:true,doubleStart:false};
          placed=true;
        } else {
          if(isClassBusy(asgn.classId,day,slot)||isTeacherBusy(asgn.teacherId,day,slot)) continue;
          timetable[asgn.classId][day][slot]={subjectId:asgn.subjectId,teacherId:asgn.teacherId,isDouble:false};
          placed=true;
        }
      }
    }
  });
  return timetable;
}

// ── THEME ─────────────────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "#0E1117", surface: "#161B22", card: "#1C2333",
    border: "rgba(255,255,255,0.07)", borderHover: "rgba(255,255,255,0.15)",
    text: "#E6EDF3", textMuted: "#8B949E", textFaint: "#484F58",
    accent: "#2D9CDB", accentGlow: "#2D9CDB33",
    success: "#3FB950", successGlow: "#3FB95033",
    warning: "#D29922", danger: "#F85149",
    inputBg: "#0D1117", navBg: "rgba(14,17,23,0.92)",
    stepActive: "#2D9CDB", stepDone: "#3FB950",
    breakBg: "rgba(210,153,34,0.08)", breakText: "#D29922",
  },
  light: {
    bg: "#F6F8FA", surface: "#FFFFFF", card: "#F0F3F7",
    border: "rgba(0,0,0,0.08)", borderHover: "rgba(0,0,0,0.18)",
    text: "#1C2B3A", textMuted: "#586069", textFaint: "#B0BAC4",
    accent: "#0969DA", accentGlow: "#0969DA22",
    success: "#1A7F37", successGlow: "#1A7F3722",
    warning: "#9A6700", danger: "#CF222E",
    inputBg: "#FFFFFF", navBg: "rgba(246,248,250,0.95)",
    stepActive: "#0969DA", stepDone: "#1A7F37",
    breakBg: "rgba(154,103,0,0.07)", breakText: "#9A6700",
  }
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", size="md", disabled=false, style={}, t }) {
  const pad = size==="sm" ? "7px 14px" : size==="lg" ? "13px 28px" : "10px 20px";
  const fs = size==="sm" ? 12 : 14;
  const variants = {
    primary: { bg: t.accent, color: "#fff", border: "none", shadow: t.accentGlow },
    success: { bg: t.success, color: "#fff", border: "none", shadow: t.successGlow },
    secondary: { bg: t.card, color: t.text, border: `1px solid ${t.border}`, shadow: "none" },
    danger: { bg: "transparent", color: t.danger, border: `1px solid ${t.danger}44`, shadow: "none" },
    ghost: { bg: "transparent", color: t.textMuted, border: "none", shadow: "none" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: pad, borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      background: v.bg, color: v.color, border: v.border || "none",
      fontWeight: 600, fontSize: fs, fontFamily: "'DM Sans', sans-serif",
      boxShadow: `0 0 12px ${v.shadow}`, transition: "all 0.18s",
      opacity: disabled ? 0.45 : 1, display:"inline-flex", alignItems:"center", gap:6,
      whiteSpace: "nowrap", ...style
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, placeholder, type="text", t, style={} }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", color:t.textMuted, marginBottom:6, textTransform:"uppercase" }}>{label}</div>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:"9px 13px", borderRadius:8, background:t.inputBg,
          border:`1px solid ${t.border}`, color:t.text, fontSize:14, outline:"none",
          boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", transition:"border 0.15s", ...style }} />
    </div>
  );
}

function Card({ children, style={}, t }) {
  return <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, padding:18, ...style }}>{children}</div>;
}

function SectionTitle({ icon, title, subtitle, t }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <div style={{ color: t.accent }}><Icon name={icon} size={20} color={t.accent} /></div>
        <h2 style={{ margin:0, fontSize:22, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", letterSpacing:"-0.02em" }}>{title}</h2>
      </div>
      {subtitle && <p style={{ margin:"0 0 0 30px", fontSize:13, color:t.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{subtitle}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange, t }) {
  return (
    <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
      <div onClick={()=>onChange(!checked)} style={{
        width:36, height:20, borderRadius:10, background: checked ? t.success : t.border,
        position:"relative", transition:"background 0.2s", flexShrink:0, border:`1px solid ${checked ? t.success : t.border}`
      }}>
        <div style={{ position:"absolute", top:2, left: checked ? 17 : 2, width:14, height:14,
          borderRadius:7, background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
      {label && <span style={{ fontSize:12, color:t.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{label}</span>}
    </label>
  );
}

function Badge({ children, color, t }) {
  return <span style={{
    background: (color||t.accent)+"22", color: color||t.accent,
    border:`1px solid ${(color||t.accent)}44`, borderRadius:6,
    padding:"2px 9px", fontSize:11, fontWeight:700, letterSpacing:"0.04em", whiteSpace:"nowrap"
  }}>{children}</span>;
}

// ── STEP 1: SCHOOL ────────────────────────────────────────────────────────────
function StepSchool({ school, setSchool, slots, setSlots, t }) {
  const [showEdit, setShowEdit] = useState(false);
  const lessons = slots.filter(s=>s.type==="lesson").length;
  const typeColor = { lesson: t.success, break: t.warning, lunch: t.danger, assembly: t.accent, ppi: t.textMuted };

  return (
    <div>
      <SectionTitle icon="school" title="School Setup" subtitle="Configure your school's identity and daily timetable structure" t={t} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginBottom:20 }}>
        <Input label="School Name" value={school.name} onChange={v=>setSchool(p=>({...p,name:v}))} placeholder="e.g. Nairobi Academy" t={t} />
        <Input label="County" value={school.county} onChange={v=>setSchool(p=>({...p,county:v}))} placeholder="e.g. Nairobi County" t={t} />
        <Input label="Term / Year" value={school.term} onChange={v=>setSchool(p=>({...p,term:v}))} placeholder="e.g. Term 1 2026" t={t} />
        <Input label="Lesson Duration (min)" type="number" value={school.lessonDuration} onChange={v=>setSchool(p=>({...p,lessonDuration:Number(v)}))} t={t} />
      </div>
      <Card t={t} style={{ padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Icon name="calendarEvent" size={16} color={t.textMuted} />
            <span style={{ fontSize:13, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em" }}>Daily Structure</span>
            <Badge color={t.success} t={t}>{lessons} lessons/day</Badge>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn size="sm" variant="secondary" onClick={()=>setShowEdit(p=>!p)} t={t}>
              <Icon name="gear" size={13} color={t.textMuted} />
              {showEdit ? "Hide" : "Edit"}
            </Btn>
            <Btn size="sm" variant="secondary" onClick={()=>{
              const last=slots[slots.length-1];
              const [h,m]=last.start.split(":").map(Number);
              const t2=h*60+m+last.duration;
              const ns=`${String(Math.floor(t2/60)).padStart(2,"0")}:${String(t2%60).padStart(2,"0")}`;
              setSlots(p=>[...p,{id:uid(),type:"break",label:"Extra Break",start:ns,duration:20}]);
            }} t={t}>
              <Icon name="plus" size={13} color={t.textMuted} /> Break
            </Btn>
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {slots.map(s => (
            <div key={s.id} style={{
              padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600,
              background: (typeColor[s.type]||t.accent)+"18",
              border:`1px solid ${(typeColor[s.type]||t.accent)}33`,
              color: typeColor[s.type]||t.accent
            }}>{s.start} {s.label}</div>
          ))}
        </div>
        {showEdit && (
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:6 }}>
            {slots.map(sl => (
              <div key={sl.id} style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                <select value={sl.type} onChange={e=>setSlots(p=>p.map(x=>x.id===sl.id?{...x,type:e.target.value}:x))}
                  style={{ padding:"6px 8px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
                  {["lesson","break","lunch","assembly","ppi"].map(tp=><option key={tp}>{tp}</option>)}
                </select>
                <input value={sl.label} onChange={e=>setSlots(p=>p.map(x=>x.id===sl.id?{...x,label:e.target.value}:x))}
                  style={{ flex:1, minWidth:80, padding:"6px 10px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:12, fontFamily:"'DM Sans',sans-serif" }} />
                <input type="time" value={sl.start} onChange={e=>setSlots(p=>p.map(x=>x.id===sl.id?{...x,start:e.target.value}:x))}
                  style={{ padding:"6px 8px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:12 }} />
                <input type="number" value={sl.duration} onChange={e=>setSlots(p=>p.map(x=>x.id===sl.id?{...x,duration:Number(e.target.value)}:x))}
                  style={{ width:54, padding:"6px 8px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:12 }} />
                <button onClick={()=>setSlots(p=>p.filter(x=>x.id!==sl.id))}
                  style={{ background:"none", border:"none", color:t.danger, cursor:"pointer", padding:4 }}>
                  <Icon name="trash" size={14} color={t.danger} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── STEP 2: CLASSES ───────────────────────────────────────────────────────────
function StepClasses({ classes, setClasses, subjects, setSubjects, t }) {
  const [grade, setGrade] = useState("Grade 7");
  const [stream, setStream] = useState("A");
  const [preset, setPreset] = useState("JSS (7–9)");
  const [active, setActive] = useState(null);

  const activeSubjects = subjects.filter(s=>s.classId===active);
  const totalPeriods = activeSubjects.reduce((sum,s)=>sum+s.periods,0);
  const activeClass = classes.find(c=>c.id===active);

  return (
    <div>
      <SectionTitle icon="book" title="Classes & Subjects" subtitle="Define streams and load CBC-compliant subject allocations" t={t} />
      <div style={{ display:"grid", gridTemplateColumns:"clamp(220px,30%,280px) 1fr", gap:18 }}>
        {/* Left panel */}
        <div>
          <Card t={t} style={{ marginBottom:12, padding:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.textMuted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10 }}>Add Stream</div>
            <div style={{ display:"flex", gap:6, marginBottom:8 }}>
              <select value={grade} onChange={e=>setGrade(e.target.value)}
                style={{ flex:1, padding:"8px 9px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                {["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"].map(g=><option key={g}>{g}</option>)}
              </select>
              <select value={stream} onChange={e=>setStream(e.target.value)}
                style={{ width:52, padding:"8px 6px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                {["A","B","C","D","E","F"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <Btn variant="primary" style={{ width:"100%", justifyContent:"center" }} onClick={()=>{
              const id=uid();
              setClasses(p=>[...p,{id,grade,stream}]);
              setActive(id);
            }} t={t}><Icon name="plus" size={14} color="#fff" /> Add Class</Btn>
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {classes.map(cls => (
              <div key={cls.id} onClick={()=>setActive(cls.id)} style={{
                padding:"11px 13px", borderRadius:9, cursor:"pointer", transition:"all 0.15s",
                background: active===cls.id ? t.accent+"18" : t.surface,
                border:`1px solid ${active===cls.id ? t.accent : t.border}`,
                display:"flex", justifyContent:"space-between", alignItems:"center"
              }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:t.text, fontFamily:"'Playfair Display',serif" }}>{cls.grade} {cls.stream}</div>
                  <div style={{ fontSize:11, color:t.textMuted }}>{subjects.filter(s=>s.classId===cls.id).length} subjects</div>
                </div>
                <button onClick={e=>{e.stopPropagation();setClasses(p=>p.filter(c=>c.id!==cls.id));setSubjects(p=>p.filter(s=>s.classId!==cls.id));if(active===cls.id)setActive(null);}}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                  <Icon name="x" size={14} color={t.danger} />
                </button>
              </div>
            ))}
            {classes.length===0 && <div style={{ color:t.textFaint, fontSize:13, textAlign:"center", padding:"24px 0" }}>No classes yet</div>}
          </div>
        </div>

        {/* Right panel */}
        <div>
          {active ? (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:t.text }}>
                    {activeClass?.grade} {activeClass?.stream}
                  </div>
                  <div style={{ fontSize:12, marginTop:3 }}>
                    <span style={{ color: totalPeriods===41 ? t.success : totalPeriods>41 ? t.danger : t.warning, fontWeight:700 }}>
                      {totalPeriods}/41 periods {totalPeriods===41?"✓":totalPeriods>41?"— too many":"— incomplete"}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <select value={preset} onChange={e=>setPreset(e.target.value)}
                    style={{ padding:"8px 10px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
                    {Object.keys(CBC_PRESETS).map(k=><option key={k}>{k}</option>)}
                  </select>
                  <Btn size="sm" variant="primary" onClick={()=>{
                    setSubjects(p=>[...p.filter(s=>s.classId!==active), ...CBC_PRESETS[preset].map(s=>({id:uid(),classId:active,...s}))]);
                  }} t={t}><Icon name="layers" size={12} color="#fff" /> Load Preset</Btn>
                  <Btn size="sm" variant="secondary" onClick={()=>setSubjects(p=>[...p,{id:uid(),classId:active,name:"New Subject",periods:3,double:false,color:"#607D8B"}])} t={t}>
                    <Icon name="plus" size={12} color={t.textMuted} /> Subject
                  </Btn>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {activeSubjects.map(subj=>(
                  <Card key={subj.id} t={t} style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                      <input type="color" value={subj.color} onChange={e=>setSubjects(p=>p.map(s=>s.id===subj.id?{...s,color:e.target.value}:s))}
                        style={{ width:28, height:28, borderRadius:6, border:`1px solid ${subj.color}55`, cursor:"pointer", padding:1, background:"transparent" }} />
                      <input value={subj.name} onChange={e=>setSubjects(p=>p.map(s=>s.id===subj.id?{...s,name:e.target.value}:s))}
                        style={{ flex:1, minWidth:120, padding:"7px 11px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }} />
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ fontSize:11, color:t.textMuted }}>per week</span>
                        <input type="number" min={1} max={10} value={subj.periods}
                          onChange={e=>setSubjects(p=>p.map(s=>s.id===subj.id?{...s,periods:Number(e.target.value)}:s))}
                          style={{ width:46, padding:"6px 8px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, textAlign:"center" }} />
                      </div>
                      <Toggle label="2×" checked={subj.double} onChange={v=>setSubjects(p=>p.map(s=>s.id===subj.id?{...s,double:v}:s))} t={t} />
                      <button onClick={()=>setSubjects(p=>p.filter(s=>s.id!==subj.id))}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                        <Icon name="trash" size={13} color={t.danger} />
                      </button>
                    </div>
                  </Card>
                ))}
                {activeSubjects.length===0 && (
                  <div style={{ textAlign:"center", padding:"36px 0", color:t.textFaint, fontSize:13 }}>
                    Load a CBC preset or add subjects manually
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:t.textFaint, flexDirection:"column", gap:8 }}>
              <Icon name="arrowRight" size={28} color={t.textFaint} />
              <span style={{ fontSize:13 }}>Select a class to configure</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STEP 3: TEACHERS ──────────────────────────────────────────────────────────
function StepTeachers({ teachers, setTeachers, classes, subjects, t }) {
  const [active, setActive] = useState(null);
  const [newName, setNewName] = useState("");
  const teacher = teachers.find(tc=>tc.id===active);

  return (
    <div>
      <SectionTitle icon="people" title="Teachers" subtitle="Register staff and assign them to specific class-subject combinations" t={t} />
      <div style={{ display:"grid", gridTemplateColumns:"clamp(220px,30%,280px) 1fr", gap:18 }}>
        <div>
          <Card t={t} style={{ marginBottom:12, padding:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.textMuted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10 }}>Add Teacher</div>
            <input value={newName} onChange={e=>setNewName(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&newName.trim()){const id=uid();setTeachers(p=>[...p,{id,name:newName.trim(),tscNumber:"",maxPerDay:7,maxPerWeek:27,assignments:[]}]);setActive(id);setNewName(""); }}}
              placeholder="Full name (Enter to add)"
              style={{ width:"100%", padding:"9px 11px", borderRadius:7, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, fontFamily:"'DM Sans',sans-serif", marginBottom:8, boxSizing:"border-box" }} />
            <Btn variant="primary" style={{ width:"100%", justifyContent:"center" }} onClick={()=>{
              if(!newName.trim()) return;
              const id=uid();
              setTeachers(p=>[...p,{id,name:newName.trim(),tscNumber:"",maxPerDay:7,maxPerWeek:27,assignments:[]}]);
              setActive(id); setNewName("");
            }} t={t}><Icon name="plus" size={14} color="#fff" /> Add Teacher</Btn>
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {teachers.map(tc=>(
              <div key={tc.id} onClick={()=>setActive(tc.id)} style={{
                padding:"11px 13px", borderRadius:9, cursor:"pointer", transition:"all 0.15s",
                background: active===tc.id ? t.accent+"18" : t.surface,
                border:`1px solid ${active===tc.id ? t.accent : t.border}`,
                display:"flex", justifyContent:"space-between", alignItems:"center"
              }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:t.text, fontFamily:"'Playfair Display',serif" }}>{tc.name}</div>
                  <div style={{ fontSize:11, color:t.textMuted }}>{tc.assignments.length} assignments</div>
                </div>
                <button onClick={e=>{e.stopPropagation();setTeachers(p=>p.filter(x=>x.id!==tc.id));if(active===tc.id)setActive(null);}}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
                  <Icon name="x" size={14} color={t.danger} />
                </button>
              </div>
            ))}
            {teachers.length===0 && <div style={{ color:t.textFaint, fontSize:13, textAlign:"center", padding:"24px 0" }}>No teachers yet</div>}
          </div>
        </div>

        <div>
          {teacher ? (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                <Input label="Full Name" value={teacher.name} onChange={v=>setTeachers(p=>p.map(tc=>tc.id===active?{...tc,name:v}:tc))} t={t} />
                <Input label="TSC Number" value={teacher.tscNumber||""} onChange={v=>setTeachers(p=>p.map(tc=>tc.id===active?{...tc,tscNumber:v}:tc))} placeholder="Optional" t={t} />
                <Input label="Max Lessons / Day" type="number" value={teacher.maxPerDay} onChange={v=>setTeachers(p=>p.map(tc=>tc.id===active?{...tc,maxPerDay:Number(v)}:tc))} t={t} />
                <Input label="Max Lessons / Week" type="number" value={teacher.maxPerWeek} onChange={v=>setTeachers(p=>p.map(tc=>tc.id===active?{...tc,maxPerWeek:Number(v)}:tc))} t={t} />
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:t.textMuted, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10 }}>Subject Assignments</div>
              {classes.map(cls=>{
                const classSubjects = subjects.filter(s=>s.classId===cls.id);
                if(!classSubjects.length) return null;
                return (
                  <Card key={cls.id} t={t} style={{ marginBottom:10, padding:13 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:t.text, fontFamily:"'Playfair Display',serif", marginBottom:9 }}>{cls.grade} {cls.stream}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {classSubjects.map(subj=>{
                        const assigned = teacher.assignments.some(a=>a.subjectId===subj.id&&a.classId===cls.id);
                        return (
                          <div key={subj.id} onClick={()=>setTeachers(p=>p.map(tc=>{
                            if(tc.id!==active) return tc;
                            const ex = tc.assignments.some(a=>a.subjectId===subj.id&&a.classId===cls.id);
                            return {...tc, assignments: ex ? tc.assignments.filter(a=>!(a.subjectId===subj.id&&a.classId===cls.id)) : [...tc.assignments,{subjectId:subj.id,classId:cls.id}]};
                          }))} style={{
                            padding:"5px 13px", borderRadius:7, cursor:"pointer",
                            background: assigned ? subj.color+"28" : t.card,
                            border:`1px solid ${assigned ? subj.color : t.border}`,
                            color: assigned ? subj.color : t.textMuted,
                            fontSize:12, fontWeight:600, transition:"all 0.14s",
                            display:"flex", alignItems:"center", gap:5
                          }}>
                            {assigned && <Icon name="check" size={11} color={subj.color} />}
                            {subj.name}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
              {classes.length===0 && <div style={{ color:t.textFaint, fontSize:13 }}>Add classes first to assign subjects.</div>}
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:t.textFaint, flexDirection:"column", gap:8 }}>
              <Icon name="arrowRight" size={28} color={t.textFaint} />
              <span style={{ fontSize:13 }}>Select a teacher to configure</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TIMETABLE GRID ────────────────────────────────────────────────────────────
function ClassGrid({ timetable, classId, subjects, teachers, slots, t }) {
  const lessonSlots = slots.filter(s=>s.type==="lesson");
  return (
    <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:580 }}>
        <thead>
          <tr>
            <th style={{ padding:"10px 12px", fontSize:10, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"left", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>Slot</th>
            {DAYS.map(d=>(
              <th key={d} style={{ padding:"10px 8px", fontSize:10, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"center", borderBottom:`1px solid ${t.border}` }}>{d.slice(0,3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot,idx)=>{
            if(slot.type!=="lesson") return (
              <tr key={slot.id}>
                <td colSpan={6} style={{ padding:"5px 12px", textAlign:"center", fontSize:11, background:t.breakBg, color:t.breakText, fontWeight:600, borderBottom:`1px solid ${t.border}` }}>
                  {slot.start} — {slot.label} ({slot.duration}m)
                </td>
              </tr>
            );
            const li = slots.slice(0,idx+1).filter(s=>s.type==="lesson").length-1;
            return (
              <tr key={slot.id} style={{ borderBottom:`1px solid ${t.border}` }}>
                <td style={{ padding:"7px 12px", fontSize:11, color:t.textMuted, whiteSpace:"nowrap" }}>
                  <div style={{ fontWeight:700 }}>{slot.start}</div>
                  <div style={{ fontSize:10 }}>{slot.label}</div>
                </td>
                {DAYS.map(day=>{
                  const cell = timetable?.[classId]?.[day]?.[li];
                  const subj = cell ? subjects.find(s=>s.id===cell.subjectId) : null;
                  const tch = cell ? teachers.find(tc=>tc.id===cell.teacherId) : null;
                  return (
                    <td key={day} style={{ padding:3, textAlign:"center" }}>
                      {subj ? (
                        <div style={{ padding:"5px 6px", borderRadius:7, background:subj.color+"1E", border:`1px solid ${subj.color}33`, minHeight:40 }}>
                          <div style={{ fontSize:10, fontWeight:800, color:subj.color, lineHeight:1.2 }}>
                            {subj.name}{cell.isDouble&&cell.doubleStart?" ×2":""}
                          </div>
                          {tch && <div style={{ fontSize:9, color:t.textMuted, marginTop:2 }}>{tch.name.split(" ")[0]}</div>}
                        </div>
                      ) : (
                        <div style={{ minHeight:40, borderRadius:7, background:t.card, border:`1px dashed ${t.border}` }} />
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

function TeacherGrid({ timetable, teacher, classes, subjects, slots, t }) {
  return (
    <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", minWidth:580 }}>
        <thead>
          <tr>
            <th style={{ padding:"10px 12px", fontSize:10, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"left", borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>Slot</th>
            {DAYS.map(d=>(
              <th key={d} style={{ padding:"10px 8px", fontSize:10, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"center", borderBottom:`1px solid ${t.border}` }}>{d.slice(0,3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot,idx)=>{
            if(slot.type!=="lesson") return (
              <tr key={slot.id}><td colSpan={6} style={{ padding:"5px 12px", textAlign:"center", fontSize:11, background:t.breakBg, color:t.breakText, fontWeight:600, borderBottom:`1px solid ${t.border}` }}>
                {slot.start} — {slot.label}
              </td></tr>
            );
            const li = slots.slice(0,idx+1).filter(s=>s.type==="lesson").length-1;
            return (
              <tr key={slot.id} style={{ borderBottom:`1px solid ${t.border}` }}>
                <td style={{ padding:"7px 12px", fontSize:11, color:t.textMuted, whiteSpace:"nowrap" }}>
                  <div style={{ fontWeight:700 }}>{slot.start}</div>
                  <div style={{ fontSize:10 }}>{slot.label}</div>
                </td>
                {DAYS.map(day=>{
                  let found=null;
                  classes.forEach(cls=>{
                    const cell=timetable?.[cls.id]?.[day]?.[li];
                    if(cell?.teacherId===teacher.id) found={cell,cls};
                  });
                  const subj=found?subjects.find(s=>s.id===found.cell.subjectId):null;
                  return (
                    <td key={day} style={{ padding:3, textAlign:"center" }}>
                      {found&&subj?(
                        <div style={{ padding:"5px 6px", borderRadius:7, background:subj.color+"1E", border:`1px solid ${subj.color}33`, minHeight:40 }}>
                          <div style={{ fontSize:10, fontWeight:800, color:subj.color }}>{subj.name}</div>
                          <div style={{ fontSize:9, color:t.textMuted }}>{found.cls.grade} {found.cls.stream}</div>
                        </div>
                      ):(
                        <div style={{ minHeight:40, borderRadius:7, background:t.card, border:`1px dashed ${t.border}` }} />
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

// ── STEP 4: GENERATE ──────────────────────────────────────────────────────────
function StepGenerate({ school, classes, subjects, teachers, slots, timetable, setTimetable, t }) {
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState("class");
  const [selClass, setSelClass] = useState(null);
  const [selTeacher, setSelTeacher] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [vLabel, setVLabel] = useState(school.term + " Draft 1");

  const lessonSlots = slots.filter(s=>s.type==="lesson");

  const checkConflicts = tt => {
    const found=[];
    DAYS.forEach(day=>{
      lessonSlots.forEach((_,i)=>{
        const tm={};
        classes.forEach(cls=>{
          const cell=tt?.[cls.id]?.[day]?.[i];
          if(cell?.teacherId){
            if(tm[cell.teacherId]){
              const tc=teachers.find(x=>x.id===cell.teacherId);
              found.push(`${tc?.name||"Teacher"} — ${day} slot ${i+1}`);
            }
            tm[cell.teacherId]=true;
          }
        });
      });
    });
    return found;
  };

  const generate = () => {
    setGenerating(true);
    setTimeout(()=>{
      const tt=generateTimetable(classes,teachers,subjects,slots);
      setTimetable(tt);
      setConflicts(checkConflicts(tt));
      if(classes.length) setSelClass(classes[0].id);
      if(teachers.length) setSelTeacher(teachers[0].id);
      setGenerating(false);
    }, 700);
  };

  const compliance = classes.map(cls=>{
    const needed=subjects.filter(s=>s.classId===cls.id).reduce((a,s)=>a+s.periods,0);
    let placed=0;
    DAYS.forEach(day=>lessonSlots.forEach((_,i)=>{ if(timetable?.[cls.id]?.[day]?.[i]) placed++; }));
    return {cls,needed,placed,ok:placed>=needed};
  });

  const printClass = () => {
    if(!timetable||!selClass) return;
    const cls=classes.find(c=>c.id===selClass);
    const win=window.open("","_blank");
    let rows="";
    slots.forEach((slot,idx)=>{
      if(slot.type!=="lesson"){
        rows+=`<tr><td colspan="6" style="background:#fffde7;color:#f57c00;text-align:center;padding:6px;font-size:12px">${slot.start} — ${slot.label}</td></tr>`;
        return;
      }
      const li=slots.slice(0,idx+1).filter(s=>s.type==="lesson").length-1;
      let row=`<tr><td style="padding:8px 12px;font-size:12px;color:#555;border:1px solid #eee;white-space:nowrap"><b>${slot.start}</b><br>${slot.label}</td>`;
      DAYS.forEach(day=>{
        const cell=timetable?.[selClass]?.[day]?.[li];
        const subj=cell?subjects.find(s=>s.id===cell.subjectId):null;
        const tch=cell?teachers.find(tc=>tc.id===cell.teacherId):null;
        row+=subj
          ?`<td style="padding:7px;text-align:center;border:1px solid #eee;background:${subj.color}18"><div style="font-weight:800;font-size:11px;color:${subj.color}">${subj.name}${cell.isDouble&&cell.doubleStart?" ×2":""}</div>${tch?`<div style="font-size:10px;color:#888">${tch.name}</div>`:""}</td>`
          :`<td style="border:1px solid #eee"></td>`;
      });
      rows+=row+"</tr>";
    });
    win.document.write(`<html><head><title>${school.name} — ${cls?.grade} ${cls?.stream}</title>
      <style>body{font-family:Georgia,serif;padding:24px}table{width:100%;border-collapse:collapse}@media print{@page{size:A4 landscape}}</style>
      </head><body>
      <h2 style="text-align:center;margin:0">${school.name}</h2>
      <h3 style="text-align:center;font-weight:normal;color:#555">${cls?.grade} ${cls?.stream} — ${school.term} | ${school.county}</h3>
      <p style="text-align:center;font-size:11px;color:#999">Generated ${new Date().toLocaleString()}</p>
      <table><thead><tr><th style="padding:10px;border:1px solid #ddd;background:#f8f8f8">Slot</th>
        ${DAYS.map(d=>`<th style="padding:10px;border:1px solid #ddd;background:#f8f8f8">${d}</th>`).join("")}
      </tr></thead><tbody>${rows}</tbody></table>
      <script>window.onload=()=>{window.print();window.close()}</script>
      </body></html>`);
    win.document.close();
  };

  return (
    <div>
      <SectionTitle icon="cpu" title="Generate Timetable" subtitle="Run the conflict-free solver, review compliance, and export to PDF" t={t} />

      <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap", alignItems:"flex-start" }}>
        {/* Generate card */}
        <Card t={t} style={{ padding:18, minWidth:240 }}>
          <div style={{ fontSize:12, color:t.textMuted, marginBottom:12 }}>
            {classes.length} classes · {teachers.length} teachers · {subjects.length} subject records
          </div>
          <Btn variant="primary" size="lg" onClick={generate} disabled={generating||classes.length===0}
            style={{ width:"100%", justifyContent:"center", marginBottom:10 }} t={t}>
            <Icon name="cpu" size={16} color="#fff" />
            {generating ? "Generating…" : "Generate Timetable"}
          </Btn>
          {timetable && (
            <div style={{ display:"flex", gap:7 }}>
              <Btn size="sm" variant="secondary" onClick={printClass} t={t}>
                <Icon name="printer" size={13} color={t.textMuted} /> Print PDF
              </Btn>
              <Btn size="sm" variant="secondary" onClick={()=>setVersions(p=>[...p,{label:vLabel,ts:new Date().toLocaleString(),published:false}])} t={t}>
                <Icon name="save" size={13} color={t.textMuted} /> Save
              </Btn>
            </div>
          )}
        </Card>

        {/* Compliance */}
        {timetable && compliance.length>0 && (
          <Card t={t} style={{ padding:16, flex:1, minWidth:180 }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
              <Icon name="checkCircle" size={12} color={t.textMuted} style={{ marginRight:5 }} />
              Compliance
            </div>
            {compliance.map(({cls,needed,placed,ok})=>(
              <div key={cls.id} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span style={{ color:t.textMuted }}>{cls.grade} {cls.stream}</span>
                <span style={{ fontWeight:700, color:ok?t.success:t.warning }}>{placed}/{needed} {ok?"✓":"⚠"}</span>
              </div>
            ))}
          </Card>
        )}

        {/* Conflicts */}
        {timetable && conflicts.length===0 && (
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 18px", borderRadius:10, background:t.successGlow, border:`1px solid ${t.success}44`, color:t.success, fontWeight:700, fontSize:13 }}>
            <Icon name="checkCircle" size={16} color={t.success} /> Zero conflicts
          </div>
        )}
        {conflicts.length>0 && (
          <Card t={t} style={{ padding:14, borderColor:`${t.danger}44` }}>
            <div style={{ fontSize:10, fontWeight:700, color:t.danger, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
              <Icon name="warning" size={12} color={t.danger} /> Conflicts
            </div>
            {conflicts.map((c,i)=><div key={i} style={{ fontSize:12, color:t.danger, marginBottom:3 }}>{c}</div>)}
          </Card>
        )}
      </div>

      {/* Version history */}
      {versions.length>0 && (
        <Card t={t} style={{ marginBottom:18, padding:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:t.textMuted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
            <Icon name="layers" size={12} color={t.textMuted} /> Saved Versions
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {versions.map((v,i)=>(
              <div key={i} style={{ padding:"8px 14px", borderRadius:9, background:v.published?t.successGlow:t.card, border:`1px solid ${v.published?t.success:t.border}`, fontSize:12 }}>
                <div style={{ fontWeight:700, color:t.text }}>{v.label}</div>
                <div style={{ fontSize:10, color:t.textMuted }}>{v.ts}</div>
                {!v.published && (
                  <button onClick={()=>setVersions(p=>p.map((vv,ii)=>({...vv,published:ii===i})))}
                    style={{ background:"none", border:"none", color:t.success, cursor:"pointer", fontSize:11, fontWeight:700, padding:"2px 0" }}>
                    Publish
                  </button>
                )}
                {v.published && <Badge color={t.success} t={t}>Published</Badge>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {timetable && (
        <>
          {/* View selector */}
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
            <div style={{ display:"flex", background:t.card, borderRadius:9, border:`1px solid ${t.border}`, padding:3, gap:2 }}>
              {[["class","Class View","grid"],["teacher","Teacher View","person"]].map(([v,label,ic])=>(
                <button key={v} onClick={()=>setView(v)} style={{
                  padding:"7px 14px", borderRadius:7, border:"none", cursor:"pointer",
                  background: view===v ? t.accent : "transparent",
                  color: view===v ? "#fff" : t.textMuted,
                  fontWeight:600, fontSize:12, fontFamily:"'DM Sans',sans-serif",
                  display:"flex", alignItems:"center", gap:6, transition:"all 0.15s"
                }}>
                  <Icon name={ic} size={13} color={view===v?"#fff":t.textMuted} />{label}
                </button>
              ))}
            </div>
            <div style={{ flex:1 }} />
            {view==="class" && (
              <select value={selClass||""} onChange={e=>setSelClass(e.target.value)}
                style={{ padding:"8px 12px", borderRadius:8, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                {classes.map(c=><option key={c.id} value={c.id}>{c.grade} {c.stream}</option>)}
              </select>
            )}
            {view==="teacher" && (
              <select value={selTeacher||""} onChange={e=>setSelTeacher(e.target.value)}
                style={{ padding:"8px 12px", borderRadius:8, background:t.inputBg, border:`1px solid ${t.border}`, color:t.text, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                {teachers.map(tc=><option key={tc.id} value={tc.id}>{tc.name}</option>)}
              </select>
            )}
            {view==="class" && selClass && (
              <Btn size="sm" variant="secondary" onClick={printClass} t={t}>
                <Icon name="printer" size={13} color={t.textMuted} /> Print
              </Btn>
            )}
          </div>

          <Card t={t} style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"13px 18px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:t.text }}>
                {view==="class"
                  ? `${classes.find(c=>c.id===selClass)?.grade} ${classes.find(c=>c.id===selClass)?.stream} Timetable`
                  : `${teachers.find(tc=>tc.id===selTeacher)?.name} — Personal Timetable`}
              </div>
              <div style={{ fontSize:12, color:t.textMuted }}>{school.name} · {school.term}</div>
            </div>
            <div style={{ padding:14 }}>
              {view==="class" && selClass && (
                <ClassGrid timetable={timetable} classId={selClass} subjects={subjects} teachers={teachers} slots={slots} t={t} />
              )}
              {view==="teacher" && selTeacher && (
                <TeacherGrid timetable={timetable} teacher={teachers.find(tc=>tc.id===selTeacher)} classes={classes} subjects={subjects} slots={slots} t={t} />
              )}
            </div>
          </Card>
        </>
      )}

      {!timetable && (
        <div style={{ textAlign:"center", padding:"64px 0", color:t.textFaint }}>
          <Icon name="calendarEvent" size={40} color={t.textFaint} />
          <div style={{ fontSize:16, fontWeight:700, color:t.textMuted, marginTop:14, fontFamily:"'Playfair Display',serif" }}>Ready to generate</div>
          <div style={{ fontSize:13, marginTop:6 }}>Complete setup, then click Generate Timetable.</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const t = themes[dark ? "dark" : "light"];
  const [step, setStep] = useState(0);
  const [school, setSchool] = useState({ name:"", county:"", term:"Term 1 2026", lessonDuration:40 });
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const steps = [
    { label:"School", icon:"school" },
    { label:"Classes", icon:"book" },
    { label:"Teachers", icon:"people" },
    { label:"Generate", icon:"lightning" },
  ];
  const canProceed = [school.name.trim().length>0, classes.length>0, true, true];

  return (
    <div style={{ minHeight:"100vh", background:t.bg, color:t.text, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,select,button{font-family:inherit}
        input::placeholder{color:${t.textFaint}}
        input[type=color]{padding:1px;cursor:pointer}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:4px}
        @media(max-width:640px){
          .two-col{grid-template-columns:1fr !important}
          .hide-mobile{display:none !important}
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        background: t.navBg, borderBottom:`1px solid ${t.border}`,
        position:"sticky", top:0, zIndex:100, backdropFilter:"blur(14px)",
        WebkitBackdropFilter:"blur(14px)"
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", height:58 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
            <div style={{
              width:34, height:34, borderRadius:9,
              background:`linear-gradient(135deg,${t.accent},${t.success})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 0 18px ${t.accentGlow}`, flexShrink:0
            }}>
              <Icon name="calendarEvent" size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:16, color:t.text, lineHeight:1.1, letterSpacing:"-0.01em" }}>
                Timetable For All
              </div>
              <div style={{ fontSize:9, color:t.textFaint, letterSpacing:"0.1em", textTransform:"uppercase" }}>Kenyan CBC · School Scheduler</div>
            </div>
          </div>

          {/* School name on header (desktop) */}
          {school.name && (
            <div className="hide-mobile" style={{ fontSize:12, color:t.textMuted, marginRight:16 }}>
              <span style={{ color:t.text, fontWeight:600 }}>{school.name}</span> · {school.term}
            </div>
          )}

          {/* Dark mode toggle */}
          <button onClick={()=>setDark(p=>!p)} style={{
            background: t.card, border:`1px solid ${t.border}`, borderRadius:8,
            padding:"7px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:7,
            color:t.textMuted, fontSize:12, fontWeight:600, transition:"all 0.2s"
          }}>
            <Icon name={dark?"sun":"moon"} size={14} color={t.textMuted} />
            <span className="hide-mobile">{dark?"Light":"Dark"}</span>
          </button>
        </div>
      </header>

      {/* ── STEP NAV ── */}
      <nav style={{ background:t.surface, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", display:"flex", overflowX:"auto", gap:0 }}>
          {steps.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i)} style={{
              padding:"14px 18px", background:"none", border:"none", cursor:"pointer",
              borderBottom: step===i ? `2px solid ${t.stepActive}` : "2px solid transparent",
              color: step===i ? t.stepActive : i<step ? t.stepDone : t.textMuted,
              fontWeight: step===i ? 700 : 500, fontSize:13,
              display:"flex", alignItems:"center", gap:7,
              transition:"all 0.18s", whiteSpace:"nowrap", flexShrink:0
            }}>
              <Icon name={s.icon} size={14} color={step===i?t.stepActive:i<step?t.stepDone:t.textMuted} />
              {s.label}
              {i<step && <Icon name="check" size={12} color={t.stepDone} />}
            </button>
          ))}
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"30px 20px 60px" }}>
        {step===0 && <StepSchool school={school} setSchool={setSchool} slots={slots} setSlots={setSlots} t={t} />}
        {step===1 && <StepClasses classes={classes} setClasses={setClasses} subjects={subjects} setSubjects={setSubjects} t={t} />}
        {step===2 && <StepTeachers teachers={teachers} setTeachers={setTeachers} classes={classes} subjects={subjects} t={t} />}
        {step===3 && <StepGenerate school={school} classes={classes} subjects={subjects} teachers={teachers} slots={slots} timetable={timetable} setTimetable={setTimetable} t={t} />}

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:40, paddingTop:22, borderTop:`1px solid ${t.border}` }}>
          <Btn variant="secondary" onClick={()=>setStep(p=>Math.max(0,p-1))} disabled={step===0} t={t}>
            <Icon name="chevronLeft" size={14} color={t.textMuted} /> Back
          </Btn>
          <span style={{ fontSize:12, color:t.textFaint }}>Step {step+1} of {steps.length}</span>
          {step<steps.length-1 && (
            <Btn variant="primary" onClick={()=>setStep(p=>p+1)} disabled={!canProceed[step]} t={t}>
              Next: {steps[step+1].label} <Icon name="chevronRight" size={14} color="#fff" />
            </Btn>
          )}
          {step===steps.length-1 && <div />}
        </div>
      </main>

      {/* ── BOTTOM NAV (mobile) ── */}
      <div style={{
        display:"none", position:"fixed", bottom:0, left:0, right:0,
        background:t.navBg, borderTop:`1px solid ${t.border}`,
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", zIndex:200
      }} className="mobile-nav">
        <style>{`@media(max-width:640px){.mobile-nav{display:flex !important}}`}</style>
        {steps.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{
            flex:1, padding:"10px 4px", background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            color: step===i ? t.accent : t.textMuted, transition:"color 0.15s"
          }}>
            <Icon name={s.icon} size={18} color={step===i?t.accent:t.textMuted} />
            <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
