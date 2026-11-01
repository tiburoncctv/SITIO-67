(function () {
  "use strict";

  const el = (id) => document.getElementById(id);
  const logBox = el("eventLog");
  const station = el("station");
  const failure = el("failure");
  const banner = el("statusBanner");
  const clock = el("clock");
  const camera = el("camera");
  const image = el("scpImage");
  const imagePlaceholder = el("cameraPlaceholder");
  const progress = el("progressSegments");
  const systems = Array.from(document.querySelectorAll(".system"));
  const TOTAL = 24.2;
  const BREACH_AT = 10.18;
  const alarmTrack = new Audio("assets/SCP LOCKDOWM ALARM_Blackout(OLD)OUTDATED(CRINGE).mp3");
  alarmTrack.preload = "auto";
  alarmTrack.loop = true;
  alarmTrack.volume = .8;
  const betaTrack = new Audio("assets/MTF Beta-7 Maz Hatters entry announcement.mp3");
  betaTrack.preload = "auto";
  betaTrack.volume = .9;
  const checks = [
    ["INICIALIZANDO MATRIZ DE SEGURIDAD", "OK"],
    ["AUTENTICACIÓN DEL NODO 067", "OK"],
    ["SINCRONIZACIÓN DEL SERVIDOR CENTRAL", "OK"],
    ["DIAGNÓSTICO DE COMPARTIMIENTOS BIOLÓGICOS", "ESTABLE"],
    ["SENSORES DE MOVIMIENTO Y PRESIÓN", "NORMAL"],
    ["CONTROL DE TEMPERATURA SUBNIVEL -04", "NORMAL"],
    ["LANZALLAMAS AUTOMATIZADOS", "ACTIVOS"],
    ["CIERRES DE SEGURIDAD PERIMETRAL", "CERRADOS"],
    ["ENERGÍA PRINCIPAL Y RESPALDO", "ESTABLE"],
    ["CANAL DE RESPUESTA IN-SITU", "DISPONIBLE"],
    ["ENLACE CON FUERZAS MÓVILES MTF", "DISPONIBLE"],
    ["PROTOCOLOS DE CONTENCIÓN SCP-610", "ACTIVOS"]
  ];

  let elapsed = 0;
  let lastFrame = 0;
  let cursor = 0;
  let running = true;
  let ended = false;
  let crashing = false;
  let soundOn = false;
  let audio = null;
  let alarmStarted = false;
  let crashTimer = null;
  const states = Object.create(null);
  const blocks = [];

  for (let i = 0; i < 12; i += 1) {
    const block = document.createElement("i");
    progress.appendChild(block);
    blocks.push(block);
  }

  function timecode(seconds) {
    const time = Math.floor(seconds);
    return "02:" + String(10 + Math.floor(time / 60)).padStart(2, "0") + ":" + String(time % 60).padStart(2, "0");
  }

  function addLog(message, tone) {
    const item = document.createElement("div");
    item.className = "log-entry" + (tone ? " " + tone : "");

    const when = document.createElement("span");
    when.className = "log-time";
    when.textContent = "[" + timecode(elapsed) + "]";

    const prefix = document.createElement("span");
    prefix.className = "log-prefix";
    prefix.textContent = tone === "critical" ? "[!!!]" : tone === "error" ? "[ERR]" : tone === "warn" ? "[WRN]" : "[SYS]";

    const body = document.createElement("span");
    body.className = "log-message";
    body.textContent = message;

    item.append(when, prefix, body);
    logBox.appendChild(item);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function tone(frequency, duration, type) {
    if (!soundOn) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(alarmTrack.paused ? 0.055 : 0.018, audio.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + duration + 0.025);
    } catch (error) {
      soundOn = false;
      el("soundButton").textContent = "♪ AUDIO: NO DISPONIBLE";
    }
  }

  function startAlarmTrack() {
    if (!soundOn || alarmStarted) return;
    alarmStarted = true;
    alarmTrack.currentTime = 0;
    try {
      const playback = alarmTrack.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
          alarmStarted = false;
          soundOn = false;
          el("soundButton").textContent = "♪ CLIC PARA ACTIVAR AUDIO";
          el("soundButton").setAttribute("aria-pressed", "false");
        });
      }
    } catch (error) {
      alarmStarted = false;
      soundOn = false;
      el("soundButton").textContent = "♪ CLIC PARA ACTIVAR AUDIO";
      el("soundButton").setAttribute("aria-pressed", "false");
    }
  }

  function startBetaTrack() {
    if (!soundOn) return;
    betaTrack.currentTime = 0;
    try {
      const playback = betaTrack.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => {
          el("betaReplay").hidden = false;
        });
      }
    } catch (error) {
      el("betaReplay").hidden = false;
    }
  }

  function setAlarm(message, level, extra) {
    banner.className = "status-banner" + (level === "warn" ? " warning" : level === "error" ? " danger" : "");
    el("statusText").textContent = message;
    el("statusExtra").textContent = extra;
    el("priority").textContent = level === "error" ? "CRÍTICA" : level === "warn" ? "ELEVADA" : "RUTINA";
    el("priority").className = level === "error" ? "red" : level === "warn" ? "amber" : "green";
    progress.className = "segments" + (level === "warn" ? " alert" : level === "error" ? " danger" : "");
  }

  function setSystem(key, label, level) {
    states[key] = level;
    const row = systems.find((entry) => entry.dataset.key === key);
    if (!row) return;
    const value = row.querySelector("strong");
    value.textContent = label;
    value.className = level === "red" ? "red" : level === "amber" ? "amber" : "green";
    row.classList.remove("changed");
    void row.offsetWidth;
    row.classList.add("changed");
    const okay = Object.values(states).filter((state) => state === "green").length;
    el("systemCount").textContent = okay + " / 6 OPERATIVOS";
    el("systemCount").className = okay === 6 ? "green" : okay >= 4 ? "amber" : "red";
  }

  function degradeCamera(signal, warning) {
    el("cameraSignal").textContent = "SEÑAL " + signal + "%";
    el("camStatus").textContent = warning ? "CCTV-610 / INTERFERENCIA" : "CCTV-610 / EN VIVO";
    el("cameraWarning").textContent = warning ? "SEÑAL DEGRADADA // " + signal + "%" : "";
    camera.classList.toggle("degraded", warning);
  }

  const events = [];
  function schedule(at, callback) { events.push({ at, callback }); }

  schedule(0.12, () => {
    addLog("AEGIS-67 // INICIANDO DIAGNÓSTICO AUTOMÁTICO");
    addLog("CONTENCIÓN BIOLÓGICA: SIN EVENTOS REGISTRADOS");
    el("camStatus").textContent = "CCTV-610 / EN VIVO";
  });

  checks.forEach((check, index) => {
    schedule(0.8 + index * 0.76, () => {
      addLog(check[0] + " .......... " + check[1]);
      if (index === 5 || index === 11) tone(620, 0.05, "sine");
    });
  });

  schedule(9.72, () => { addLog("TODOS LOS SUBSISTEMAS RESPONDEN. SITIO-67 ESTABLE."); tone(820, .12); });
  schedule(10.18, () => {
    setAlarm("ACTIVIDAD EMERGENTE", "warn", "ORIGEN: SECTOR DE BIOCONTENCIÓN");
    startAlarmTrack();
    camera.classList.add("bioalert");
    addLog("ACTIVIDAD EMERGENTE // SENSOR BIOLÓGICO 610", "critical");
    addLog("CRECIMIENTO DE MASA ORGÁNICA FUERA DE PARÁMETROS", "warn");
    el("promptText").textContent = "evaluando firmas biológicas...";
    tone(530, .28, "sawtooth");
  });
  schedule(11.38, () => {
    setSystem("flame", "RESPUESTA RETARDADA", "amber");
    addLog("LANZALLAMAS AUTOMATIZADOS: EFICIENCIA POR DEBAJO DEL UMBRAL", "warn");
    tone(460, .12);
  });
  schedule(12.45, () => {
    addLog("PATRÓN DE PROLIFERACIÓN NO CATALOGADO // CICLO DESCONOCIDO", "warn");
    addLog("CAUSA INICIAL DE LA ACTIVIDAD: NO DETERMINADA", "warn");
  });
  schedule(13.52, () => {
    setSystem("security", "EN DESPLIEGUE", "amber");
    addLog("DESPACHANDO SEGURIDAD IN-SITU", "critical");
    addLog("ESCUADRA 03 DIRIGIDA A SUBNIVEL -04", "warn");
    el("promptText").textContent = "esperando acuse de recibo...";
    tone(390, .3, "square");
  });
  schedule(14.76, () => {
    setSystem("cells", "BRECHA CONFIRMADA", "red");
    setAlarm("BRECHA DE CONTENCIÓN BIOLÓGICA", "error", "CÓDIGO ESCARLATA");
    addLog("SCP-610 // PROPAGACIÓN ENTRE COMPARTIMIENTOS", "critical");
    tone(260, .35, "sawtooth");
  });
  schedule(16.02, () => {
    setSystem("flame", "SIN RESPUESTA", "red");
    addLog("LANZALLAMAS AUTOMATIZADOS: ERROR DE ACTIVACIÓN", "error");
    addLog("DENSIDAD BIOLÓGICA INCOMPATIBLE CON MEDICIÓN PREVIA", "error");
    tone(310, .3);
  });
  schedule(17.21, () => {
    setSystem("locks", "FALLO MECÁNICO", "red");
    addLog("CIERRES DE SEGURIDAD: INTEGRIDAD ESTRUCTURAL PERDIDA", "critical");
    tone(290, .23, "sawtooth");
  });
  schedule(18.36, () => {
    setSystem("power", "FLUCTUACIÓN", "amber");
    degradeCamera(41, true);
    addLog("TENSIÓN ELÉCTRICA INESTABLE // TRANSFIRIENDO RESPALDO", "error");
    tone(330, .4, "square");
  });
  schedule(19.37, () => {
    setSystem("security", "SIN CONTACTO", "red");
    addLog("ESCUADRA 03: TELEMETRÍA INTERRUMPIDA", "critical");
    el("promptText").textContent = "reintentando conexión con escuadra 03...";
    tone(230, .3);
  });
  schedule(20.24, () => {
    setSystem("comms", "INTERMITENTE", "amber");
    addLog("ENLACE EXTERNO INESTABLE // TRANSMITIENDO PRIORIDAD MÁXIMA", "error");
    degradeCamera(12, true);
    tone(220, .3, "sawtooth");
  });
  schedule(21.2, () => {
    addLog("DESPACHANDO MTF MÁS CERCA", "critical");
    setAlarm("PROTOCOLO DE EMERGENCIA GENERAL", "error", "TRANSMISIÓN NO CONFIRMADA");
    el("promptText").textContent = "envío MTF pendiente de confirmación";
    tone(180, .5, "square");
  });
  schedule(22.12, () => {
    setSystem("comms", "DESCONECTADO", "red");
    setSystem("power", "CRÍTICA", "red");
    addLog("ERROR: NO SE RECIBIÓ CONFIRMACIÓN DEL DESPACHO MTF", "error");
    addLog("RED INTERNA DEL SITIO: SINCRONIZACIÓN PERDIDA", "error");
    tone(145, .36, "sawtooth");
  });
  schedule(23.23, () => {
    addLog("FALLO IRRECUPERABLE DEL NODO AEGIS-67", "critical");
    addLog("CORTE DE TRANSMISIÓN INMINENTE", "critical");
    el("consoleLive").textContent = "ERROR / ERROR / ERROR";
    el("promptText").textContent = "ERROR FATAL";
    tone(98, .62, "square");
  });
  schedule(TOTAL, startCrash);
  events.sort((a, b) => a.at - b.at);

  function showImage() {
    if (!image.naturalWidth) return;
    image.hidden = false;
    imagePlaceholder.hidden = true;
  }
  image.addEventListener("load", showImage);
  image.addEventListener("error", () => {
    image.hidden = true;
    imagePlaceholder.hidden = false;
  });
  if (image.complete && image.naturalWidth) showImage();

  function startCrash() {
    if (crashing) return;
    crashing = true;
    running = false;
    alarmTrack.pause();
    alarmTrack.currentTime = 0;
    alarmStarted = false;
    startBetaTrack();
    document.body.classList.add("crashing");
    crashTimer = window.setTimeout(() => {
      document.body.classList.remove("crashing");
      failure.hidden = false;
      failure.classList.add("visible");
      station.setAttribute("aria-hidden", "true");
      ended = true;
      el("failureRestart").focus();
    }, 740);
  }

  function reset() {
    if (crashTimer !== null) clearTimeout(crashTimer);
    alarmTrack.pause();
    alarmTrack.currentTime = 0;
    betaTrack.pause();
    betaTrack.currentTime = 0;
    alarmStarted = false;
    el("betaReplay").hidden = true;
    camera.classList.remove("bioalert");
    crashTimer = null;
    elapsed = 0;
    cursor = 0;
    lastFrame = 0;
    running = true;
    ended = false;
    crashing = false;
    logBox.replaceChildren();
    failure.hidden = true;
    failure.classList.remove("visible");
    station.removeAttribute("aria-hidden");
    document.body.classList.remove("crashing");
    setAlarm("DIAGNÓSTICO AUTOMÁTICO EN CURSO", "normal", "ESTADO: NORMAL");
    for (const row of systems) {
      const value = row.querySelector("strong");
      value.textContent = "OPERATIVO";
      value.className = "green";
      row.classList.remove("changed");
      states[row.dataset.key] = "green";
    }
    el("systemCount").textContent = "6 / 6 OPERATIVOS";
    el("systemCount").className = "green";
    el("consoleLive").textContent = "MONITOREANDO...";
    el("promptText").textContent = "esperando respuesta del sistema";
    el("pauseButton").textContent = "Ⅱ PAUSAR";
    degradeCamera(100, false);
    el("camStatus").textContent = "CCTV-610 / EN ESPERA";
    updateDisplay();
  }

  function updateDisplay() {
    const currentTime = timecode(elapsed);
    clock.textContent = currentTime;
    el("camTimestamp").textContent = currentTime;
    const ratio = Math.min(1, elapsed / 10);
    const filled = Math.floor(ratio * blocks.length);
    blocks.forEach((block, index) => block.classList.toggle("filled", index < filled));
    el("percent").textContent = String(Math.round(ratio * 100)).padStart(2, "0") + "%";
  }

  function tick(now) {
    if (!lastFrame) lastFrame = now;
    const delta = Math.min((now - lastFrame) / 1000, .25);
    lastFrame = now;
    if (running && !ended) {
      elapsed = Math.min(TOTAL, elapsed + delta);
      while (cursor < events.length && events[cursor].at <= elapsed) {
        const action = events[cursor];
        cursor += 1;
        action.callback();
      }
      updateDisplay();
    }
    requestAnimationFrame(tick);
  }

  el("restartButton").addEventListener("click", reset);
  el("failureRestart").addEventListener("click", () => {
    reset();
    el("restartButton").focus();
  });
  el("pauseButton").addEventListener("click", () => {
    if (ended || crashing) return;
    running = !running;
    el("pauseButton").textContent = running ? "Ⅱ PAUSAR" : "▶ REANUDAR";
    if (!running) {
      alarmTrack.pause();
    } else if (soundOn && elapsed >= BREACH_AT) {
      if (alarmStarted) {
        alarmTrack.play().catch(() => {
          alarmStarted = false;
          el("soundButton").textContent = "♪ CLIC PARA ACTIVAR AUDIO";
        });
      } else {
        startAlarmTrack();
      }
    }
  });
  el("betaReplay").addEventListener("click", () => {
    soundOn = true;
    el("soundButton").textContent = "♪ AUDIO: ON";
    el("soundButton").setAttribute("aria-pressed", "true");
    const playback = betaTrack.play();
    if (playback && typeof playback.then === "function") {
      playback.then(() => { el("betaReplay").hidden = true; }).catch(() => {});
    } else {
      el("betaReplay").hidden = true;
    }
  });
  el("soundButton").addEventListener("click", () => {
    soundOn = !soundOn;
    el("soundButton").textContent = soundOn ? "♪ AUDIO: ON" : "♪ AUDIO: OFF";
    el("soundButton").setAttribute("aria-pressed", String(soundOn));
    if (soundOn) {
      tone(710, .09);
      if (running && elapsed >= BREACH_AT && elapsed < TOTAL) startAlarmTrack();
    } else {
      alarmTrack.pause();
      alarmTrack.currentTime = 0;
      betaTrack.pause();
      betaTrack.currentTime = 0;
      alarmStarted = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    const element = event.target;
    if (element && /^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(element.tagName)) return;
    if (event.key.toLowerCase() === "r") reset();
    if (event.code === "Space") {
      event.preventDefault();
      el("pauseButton").click();
    }
  });
  reset();
  requestAnimationFrame(tick);
})();