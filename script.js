(function () {
  "use strict";

  /* =========================================================
     1) AMBIENT BACKGROUND PARTICLES (decorative, low-cost)
     ========================================================= */
  function initParticles() {
    var layer = document.getElementById("bgParticles");
    if (!layer) return;
    var symbols = ["♥", "♡", "❤"];
    var count = window.innerWidth < 640 ? 8 : 14;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "p";
      p.textContent = symbols[i % symbols.length];
      p.style.left = Math.random() * 100 + "%";
      p.style.fontSize = 10 + Math.random() * 14 + "px";
      p.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      p.style.animationDuration = 10 + Math.random() * 14 + "s";
      p.style.animationDelay = Math.random() * -20 + "s";
      layer.appendChild(p);
    }
  }

  /* =========================================================
     2) LOVE-MATCH ALGORITHM
     Classic name-letter cancellation method (the same family of
     algorithm real "love calculators" use): letters common to
     both names cancel each other out; whatever letters are left
     over are combined into a number and repeatedly reduced,
     pair by adjacent pair (mod 10), until two digits remain.
     Deterministic: the same two names always produce the same
     result, in either order.
     ========================================================= */
  function normalizeName(name) {
    return name
      .toLowerCase()
      .normalize("NFC")
      .replace(/[^\p{L}]/gu, "")
      .split("");
  }

  function calculateLovePercent(nameA, nameB) {
    var a = normalizeName(nameA);
    var b = normalizeName(nameB);

    // Cancel matching letters (one-for-one) between the two names.
    for (var i = 0; i < a.length; i++) {
      var idx = b.indexOf(a[i]);
      if (idx !== -1) {
        a.splice(i, 1);
        b.splice(idx, 1);
        i--;
      }
    }

    // Perfect letter-for-letter match on both sides -> top score.
    if (a.length === 0 && b.length === 0) {
      return 100;
    }

    var digits = String(a.length) + String(b.length);

    // Reduce to two digits: sum each adjacent pair, keep remainder mod 10.
    while (digits.length > 2) {
      var next = "";
      for (var j = 0; j < digits.length - 1; j++) {
        var sum = parseInt(digits[j], 10) + parseInt(digits[j + 1], 10);
        next += String(sum % 10);
      }
      digits = next;
    }

    var result = parseInt(digits, 10);
    if (isNaN(result)) result = 50;
    return Math.max(0, Math.min(99, result));
  }

  function getResultCopy(pct) {
    if (pct >= 90) {
      return {
        title: "Taleyin işi! 💘",
        desc: "Zəngi vurdunuz! Adların hərfləri demək olar ki, tam üst-üstə düşür — bu, karnavalın ən nadir nəticələrindən biridir."
      };
    }
    if (pct >= 75) {
      return {
        title: "Alov tuturlar 🔥",
        desc: "Aranızda güclü bir kimya var. Bir az cəsarət və bu, əsl hekayəyə çevrilə bilər."
      };
    }
    if (pct >= 50) {
      return {
        title: "Xoş bir rəqs 💃🕺",
        desc: "Balanslı uyğunluq — nə tam əks, nə də tam eyni. Maraqlı söhbətlərə hazır olun."
      };
    }
    if (pct >= 25) {
      return {
        title: "Cücərməkdə olan tumurcuq 🌱",
        desc: "Hələ erkəndir, amma hər böyük hekayə kiçik bir addımdan başlayır."
      };
    }
    return {
      title: "Fərqli dünyalar 🌌",
      desc: "Hərflər bu dəfə uyğun gəlmədi — amma unutmayın, bu, əyləncə üçündür, real sevgini rəqəm ölçmür."
    };
  }

  /* =========================================================
     3) HIGH-STRIKER TOWER
     ========================================================= */
  var LIGHT_COUNT = 10;
  var towerLightsEl = document.getElementById("towerLights");
  var towerPuckEl = document.getElementById("towerPuck");
  var towerEl = document.getElementById("tower");
  var towerCaptionEl = document.getElementById("towerCaption");

  function buildTowerLights() {
    if (!towerLightsEl) return;
    for (var i = 0; i < LIGHT_COUNT; i++) {
      var light = document.createElement("span");
      light.className = "light";
      towerLightsEl.appendChild(light);
    }
  }

  function colorClassForIndex(index) {
    // index counted from the bottom (0 = lowest light)
    var ratio = index / (LIGHT_COUNT - 1);
    if (ratio < 0.4) return "c-cold";
    if (ratio < 0.75) return "c-mid";
    return "c-hot";
  }

  function animateTower(pct) {
    if (!towerLightsEl || !towerPuckEl || !towerEl) return;

    var lights = towerLightsEl.querySelectorAll(".light");
    var litCount = Math.max(1, Math.round((pct / 100) * LIGHT_COUNT));

    // Reset
    lights.forEach(function (light) {
      light.classList.remove("lit", "c-cold", "c-mid", "c-hot");
    });
    towerEl.classList.remove("is-ringing");

    // Puck travels the rail; rail runs from bottom(6px) to just under bell.
    var railTravel = 250; // px, matches CSS rail height minus margins
    var targetBottom = 6 + (pct / 100) * railTravel;
    towerPuckEl.style.bottom = targetBottom + "px";

    // Light bulbs sequentially, bottom to top, timed with the puck's rise.
    lights.forEach(function (light, domIndex) {
      // DOM order is reversed via flex column-reverse in CSS, so index 0
      // in the DOM is visually the bottom-most light already.
      if (domIndex < litCount) {
        setTimeout(function () {
          light.classList.add("lit", colorClassForIndex(domIndex));
        }, domIndex * 70);
      }
    });

    if (towerCaptionEl) {
      towerCaptionEl.textContent = pct + "% gücündə!";
    }

    if (pct >= 85) {
      setTimeout(function () {
        towerEl.classList.add("is-ringing");
      }, litCount * 70 + 150);
    }
  }

  function resetTower() {
    if (!towerLightsEl || !towerPuckEl || !towerEl) return;
    towerLightsEl.querySelectorAll(".light").forEach(function (l) {
      l.classList.remove("lit", "c-cold", "c-mid", "c-hot");
    });
    towerPuckEl.style.bottom = "6px";
    towerEl.classList.remove("is-ringing");
    if (towerCaptionEl) towerCaptionEl.textContent = "Gücünü göstər";
  }

  /* =========================================================
     4) CONFETTI
     ========================================================= */
  function launchConfetti() {
    var layer = document.getElementById("confettiLayer");
    if (!layer) return;
    var symbols = ["❤", "💛", "✨", "💫", "♥"];
    var count = 22;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      piece.style.left = Math.random() * 100 + "%";
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.animationDuration = 1.8 + Math.random() * 1.2 + "s";
      piece.style.fontSize = 14 + Math.random() * 12 + "px";
      layer.appendChild(piece);
      (function (el) {
        setTimeout(function () {
          el.remove();
        }, 3200);
      })(piece);
    }
  }

  /* =========================================================
     5) FORM WIRING
     ========================================================= */
  var form = document.getElementById("loveForm");
  var nameAInput = document.getElementById("nameA");
  var nameBInput = document.getElementById("nameB");
  var errorMsgEl = document.getElementById("errorMsg");
  var hitBtn = document.getElementById("hitBtn");
  var resetBtn = document.getElementById("resetBtn");

  var ticketEl = document.getElementById("resultTicket");
  var ticketNamesEl = document.getElementById("ticketNames");
  var ticketPercentNumEl = document.getElementById("ticketPercentNum");
  var ticketTitleEl = document.getElementById("ticketTitle");
  var ticketDescEl = document.getElementById("ticketDesc");
  var copyBtn = document.getElementById("copyBtn");

  var lastResultText = "";

  function showError(message) {
    if (errorMsgEl) errorMsgEl.textContent = message;
  }

  function clearError() {
    showError("");
  }

  function animateCountUp(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * (target - start) + start);
      el.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  function handleSubmit(event) {
    event.preventDefault();

    var nameA = nameAInput.value.trim();
    var nameB = nameBInput.value.trim();

    if (!nameA || !nameB) {
      showError("Zəhmət olmasa hər iki adı daxil edin.");
      (nameA ? nameBInput : nameAInput).focus();
      return;
    }
    if (normalizeName(nameA).length === 0 || normalizeName(nameB).length === 0) {
      showError("Adlar ən azı bir hərf ehtiva etməlidir.");
      return;
    }

    clearError();

    hitBtn.classList.remove("is-hitting");
    // Force reflow so the shake animation can retrigger on repeat clicks.
    void hitBtn.offsetWidth;
    hitBtn.classList.add("is-hitting");

    var pct = calculateLovePercent(nameA, nameB);
    var copy = getResultCopy(pct);

    animateTower(pct);

    ticketNamesEl.textContent = nameA + "  ♥  " + nameB;
    ticketTitleEl.textContent = copy.title;
    ticketDescEl.textContent = copy.desc;
    animateCountUp(ticketPercentNumEl, pct, 900);

    lastResultText =
      nameA + " ile " + nameB + " arasinda sevgi gucu: " + pct + "% — " + copy.title +
      " (Sevgi Gucu Sinagi)";

    ticketEl.hidden = false;
    resetBtn.hidden = false;

    if (pct >= 85) {
      setTimeout(launchConfetti, 500);
    }

    // Bring the ticket into view on small screens.
    window.requestAnimationFrame(function () {
      ticketEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function handleReset() {
    form.reset();
    clearError();
    ticketEl.hidden = true;
    resetBtn.hidden = true;
    resetTower();
    nameAInput.focus();
  }

  function handleCopy() {
    if (!lastResultText) return;
    var restoreLabel = "NƏTİCƏNİ KOPYALA";

    function onSuccess() {
      copyBtn.textContent = "KOPYALANDI ✓";
      copyBtn.classList.add("is-copied");
      setTimeout(function () {
        copyBtn.textContent = restoreLabel;
        copyBtn.classList.remove("is-copied");
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastResultText).then(onSuccess).catch(function () {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }

    function fallbackCopy() {
      var textarea = document.createElement("textarea");
      textarea.value = lastResultText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        onSuccess();
      } catch (err) {
        /* silently ignore — clipboard is a nice-to-have */
      }
      document.body.removeChild(textarea);
    }
  }

  /* =========================================================
     6) INIT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    initParticles();
    buildTowerLights();

    if (form) form.addEventListener("submit", handleSubmit);
    if (resetBtn) resetBtn.addEventListener("click", handleReset);
    if (copyBtn) copyBtn.addEventListener("click", handleCopy);
    if (nameAInput) nameAInput.addEventListener("input", clearError);
    if (nameBInput) nameBInput.addEventListener("input", clearError);
  });
})();
