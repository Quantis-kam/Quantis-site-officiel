/**
 * ============================================================================
 * QUANTIS — Orchestrateur Principal UI, Télémétrie & Interactions
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. PRELOADER
  // --------------------------------------------------------------------------
  const preloader = document.getElementById("preloader");
  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains("fade-out")) {
      preloader.classList.add("fade-out");
    }
  };
  window.addEventListener("load", () => setTimeout(hidePreloader, 350));
  setTimeout(hidePreloader, 1200);

  // --------------------------------------------------------------------------
  // 2. MOTEURS 3D THREE.JS (ARRIÈRE-PLAN GLSL + LAB PRODUITS)
  // --------------------------------------------------------------------------
  if (typeof window.initQuantisMasterScene === "function") {
    window.initQuantisMasterScene();
  }
  if (typeof window.initQuantisProductLab === "function") {
    window.initQuantisProductLab();
  }

  // --------------------------------------------------------------------------
  // 3. NAVBAR, SCROLL PROGRESS & SCROLLSPY
  // --------------------------------------------------------------------------
  const navbar = document.getElementById("navbar");
  const progressBar = document.getElementById("scrollProgressBar");
  const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));
  const trackedSections = navLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return { link, el: document.getElementById(id) };
    })
    .filter((item) => item.el);

  function onScrollUI() {
    const sy = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", sy > 32);

    if (progressBar) {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const ratio = Math.min(1, Math.max(0, sy / maxScroll));
      progressBar.style.transform = `scaleX(${ratio})`;
    }

    const triggerY = sy + window.innerHeight * 0.35;
    let activeLink = null;
    for (const item of trackedSections) {
      if (item.el.offsetTop <= triggerY) {
        activeLink = item.link;
      }
    }
    navLinks.forEach((l) => l.classList.toggle("active", l === activeLink));

    // Progression de la timeline Horizon 2040+
    const timelineEl = document.getElementById("horizonTimeline");
    const timelineFill = document.getElementById("timelineProgressFill");
    if (timelineEl && timelineFill) {
      const rect = timelineEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const pct = Math.max(
        0,
        Math.min(1, (vh * 0.65 - rect.top) / Math.max(1, rect.height))
      );
      timelineFill.style.transform = `scaleY(${pct})`;
    }
  }
  window.addEventListener("scroll", onScrollUI, { passive: true });
  onScrollUI();

  // --------------------------------------------------------------------------
  // 4. DRAWER MOBILE ACCESSIBLE
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileClose = document.getElementById("mobileClose");

  function setDrawerOpen(open) {
    if (!mobileDrawer || !mobileToggle) return;
    mobileDrawer.classList.toggle("open", open);
    mobileDrawer.setAttribute("aria-hidden", String(!open));
    mobileToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.contains("open");
      setDrawerOpen(!isOpen);
    });
    if (mobileClose) {
      mobileClose.addEventListener("click", () => setDrawerOpen(false));
    }
    mobileDrawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setDrawerOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        setDrawerOpen(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL & COMPTEURS ANIMÉS
  // --------------------------------------------------------------------------
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -36px 0px" }
    );
    revealEls.forEach((el) => revObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("revealed"));
  }

  // Spotlight radial tracking sur cartes premium
  document.querySelectorAll("[data-spotlight]").forEach((card) => {
    card.addEventListener(
      "mousemove",
      (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      },
      { passive: true }
    );
  });

  // --------------------------------------------------------------------------
  // 6. SHOWCASE DES 6 DOMAINES D'INGÉNIERIE
  // --------------------------------------------------------------------------
  const domainData = {
    mobile: {
      index: "01 / 06",
      category: "INGÉNIERIE MOBILE & POS",
      badge: "OFFLINE-FIRST · FLUTTER, KOTLIN & SWIFT",
      title: "Applications Mobiles Terrain & Terminaux POS",
      desc: "Propulse Quantis-Stock mobile et Quantis-Phone (Linphone SDK Android Kotlin & iOS Swift/CallKit). Fonctionnement garanti même lors des coupures réseau grâce au stockage SQLite Drift et à la synchronisation différentielle.",
      img: "img_service_mobile.jpg",
      specs: [
        { val: "100 %", label: "Opérationnel hors-ligne via SQLite Drift" },
        { val: "60 FPS", label: "Rendu natif Flutter, Kotlin & Swift" }
      ],
      deliverables: [
        "Vente au comptoir mobile & lecture code-barres",
        "Appels HD natifs & notifications PushKit / CallKit",
        "Synchronisation résiliente avec le serveur central"
      ],
      tags: ["Flutter", "Kotlin", "Swift", "SQLite Drift", "Linphone SDK"]
    },
    desktop: {
      index: "02 / 06",
      category: "ERP & LOGICIELS DESKTOP",
      badge: "QUANTIS-STOCK ENGINE · JAVA 21 & FLUTTER",
      title: "Progiciels de Gestion & Postes d'Opérations",
      desc: "Cœur de Quantis-Stock : gestion commerciale multi-dépôts, caisse POS tactile, inventaires avec calcul d'écarts, facturation séquentielle FCFA / TVA 18 % (IFU & RCCM) et suivi strict des créances.",
      img: "img_service_desktop.jpg",
      specs: [
        { val: "5 Rôles", label: "Contrôle d'accès RBAC & journal d'audit immuable" },
        { val: "Multi-OS", label: "Exécution fluide Linux, Windows, macOS & Web" }
      ],
      deliverables: [
        "Cycle complet Devis → Bon de livraison → Facture → Avoir",
        "Historique immuable de chaque mouvement de stock",
        "Exports comptables PDF, CSV & Excel certifiés"
      ],
      tags: ["Spring Boot 4", "Java 21", "PostgreSQL 18", "Flutter Desktop", "RBAC"]
    },
    web: {
      index: "03 / 06",
      category: "PLATEFORMES WEB & APIS",
      badge: "WEBRTC · REST API · ARCHITECTURE SOUVERAINE",
      title: "Portails Web, Client SIP.js & Microservices",
      desc: "Conception d'APIs robustes et d'interfaces web temps réel : provisioning dynamique des comptes, portails métiers haute disponibilité et client WebRTC SIP.js sans plugin directement dans le navigateur.",
      img: "img_service_web.jpg",
      specs: [
        { val: "TLS / WSS", label: "Chiffrement de transport web & signalisation SIP" },
        { val: "Docker", label: "Déploiement reproductible sur site ou cloud" }
      ],
      deliverables: [
        "APIs FastAPI & Spring Boot avec authentification JWT",
        "Terminaison Nginx HTTPS/WebSocket & optimisation SEO",
        "Supervision Redis Pub/Sub des événements temps réel"
      ],
      tags: ["SIP.js", "WebRTC", "Spring Boot", "FastAPI", "Nginx", "PostgreSQL"]
    },
    network: {
      index: "04 / 06",
      category: "TÉLÉPHONIE IP & RÉSEAUX D'ENTREPRISE",
      badge: "QUANTIS-PHONE · ASTERISK PJSIP & ZERO-TRUST",
      title: "Communications Unifiées VoIP & Cœurs Réseau",
      desc: "Propulse Quantis-Phone : standard téléphonique Asterisk 20+ (PJSIP), visioconférence multi-participants LiveKit SFU, traversée NAT symétrique coturn et segmentation VLAN sécurisée.",
      img: "img_service_network.jpg",
      specs: [
        { val: "Opus HD", label: "Audio adaptatif 48 kHz (6 à 510 kbps) + VP8/H.264" },
        { val: "SRTP / TLS", label: "Signalisation & flux médias chiffrés de bout en bout" }
      ],
      deliverables: [
        "Serveur Asterisk PJSIP (Registrar, Dialplan, CDR)",
        "Relais STUN/TURN/ICE coturn pour pare-feux stricts",
        "Audit réseau, VLAN isolés & continuité de service"
      ],
      tags: ["Quantis-Phone", "Asterisk PJSIP", "coturn", "LiveKit SFU", "SRTP/DTLS"]
    },
    cabling: {
      index: "05 / 06",
      category: "INFRASTRUCTURE PHYSIQUE & CÂBLAGE",
      badge: "CERTIFICATION · FIBRE OPTIQUE & RACKS",
      title: "Câblage Structuré & Baies de Brassage",
      desc: "Déploiement physique d'excellence pour supporter vos serveurs Quantis-Stock locaux, vos téléphones VoIP Quantis-Phone et vos postes IA : baies organisées, Cat6A blindé et fibre optique.",
      img: "img_service_cabling.jpg",
      specs: [
        { val: "100 %", label: "Liaisons testées et étiquetées selon normes TIA/EIA" },
        { val: "On-Prem", label: "Hébergement local fiable pour zéro coupure LAN" }
      ],
      deliverables: [
        "Refonte & assainissement de baies de brassage",
        "Liaisons cuivre Cat6A & fibre inter-bâtiments",
        "Schémas techniques complets & maintenance sur site"
      ],
      tags: ["Fibre Optique", "Cat6A Blindé", "Baies Brassage", "LAN Entreprise"]
    },
    ai: {
      index: "06 / 06",
      category: "INTELLIGENCE ARTIFICIELLE SOUVERAINE",
      badge: "QUANTIS-IA · OPENJARVIS & QUANTIS VOICE",
      title: "Agents Autonomes Local-First & Pilotage Vocal",
      desc: "Moteur Quantis-IA basé sur OpenJarvis : vos assistants et analyses tournent en priorité sur vos propres machines via Ollama et Python/Rust, avec réveil vocal par double-clap intégré directement à Quantis-Stock.",
      img: "img_service_ai.jpg",
      specs: [
        { val: "88,7 %", label: "Requêtes traitées localement sans dépendance cloud" },
        { val: "8 Agents", label: "Orchestration outils, recherche docs & Quantis Voice" }
      ],
      deliverables: [
        "Pilotage vocal Quantis Voice (CA du jour, stocks, dettes)",
        "Agents Deep Research, Morning Digest & Monitor continu",
        "Optimisation énergie, latence et coûts sur traces locales"
      ],
      tags: ["Quantis-IA", "OpenJarvis", "Ollama", "Quantis Voice", "Rust & Python"]
    }
  };

  const domainTabs = Array.from(document.querySelectorAll(".domain-tab"));
  const domSection = document.getElementById("domaines");
  const domCard = document.getElementById("domainShowcaseCard");
  const domInfoPane = document.getElementById("domainInfoPane");
  const domAutoProgress = document.getElementById("domainAutoProgress");
  const domAutoToggle = document.getElementById("domainAutoToggle");
  const domAutoLabel = document.getElementById("domainAutoLabel");
  const domIndex = document.getElementById("domainIndex");
  const domCat = document.getElementById("domainCat");
  const domBadge = document.getElementById("domainBadge");
  const domTitle = document.getElementById("domainTitle");
  const domDesc = document.getElementById("domainDesc");
  const domImg = document.getElementById("domainImg");
  const domSpecs = document.getElementById("domainSpecs");
  const domDeliverables = document.getElementById("domainDeliverables");
  const domTags = document.getElementById("domainTags");

  // Préchargement silencieux des visuels des 6 pôles pour un défilement instantané
  Object.values(domainData).forEach((item) => {
    if (item && item.img) {
      const preload = new Image();
      preload.src = item.img;
    }
  });

  let domainImgTimer = null;
  let domainPaneTimer = null;
  let activeDomainIndex = 0;

  function renderDomain(key, animateTransition = true) {
    const item = domainData[key];
    if (!item) return;

    const applyTextUpdates = () => {
      if (domIndex) domIndex.textContent = item.index;
      if (domCat) domCat.textContent = item.category;
      if (domBadge) domBadge.textContent = item.badge;
      if (domTitle) domTitle.textContent = item.title;
      if (domDesc) domDesc.textContent = item.desc;

      if (domSpecs) {
        domSpecs.innerHTML = item.specs
          .map(
            (s) =>
              `<div class="domain-spec-box"><div class="domain-spec-val">${s.val}</div><div class="domain-spec-label">${s.label}</div></div>`
          )
          .join("");
      }
      if (domDeliverables) {
        domDeliverables.innerHTML = item.deliverables
          .map(
            (d) =>
              `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${d}</span></li>`
          )
          .join("");
      }
      if (domTags) {
        domTags.innerHTML = item.tags
          .map((t) => `<span class="domain-tag-item">${t}</span>`)
          .join("");
      }
    };

    if (domainPaneTimer) clearTimeout(domainPaneTimer);
    if (domainImgTimer) clearTimeout(domainImgTimer);

    if (animateTransition && domInfoPane) {
      domInfoPane.classList.add("is-transitioning");
      domainPaneTimer = setTimeout(() => {
        applyTextUpdates();
        domInfoPane.classList.remove("is-transitioning");
      }, 140);
    } else {
      applyTextUpdates();
    }

    if (domImg) {
      if (!animateTransition) {
        domImg.src = item.img;
        domImg.alt = item.title;
        domImg.classList.remove("is-fading");
      } else {
        domImg.classList.add("is-fading");
        domainImgTimer = setTimeout(() => {
          domImg.src = item.img;
          domImg.alt = item.title;
          domImg.onload = () => domImg.classList.remove("is-fading");
          setTimeout(() => domImg.classList.remove("is-fading"), 120);
        }, 140);
      }
    }
  }

  const DOMAIN_CYCLE_MS = 4000;
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let domainAutoEnabled = !prefersReducedMotion;
  let domainVisible = false;
  let domainHoverPaused = false;
  let domainFocusPaused = false;
  let domainElapsedMs = 0;
  let domainLastFrameTs = null;

  function updateAutoToggleUI() {
    if (!domAutoToggle) return;
    domAutoToggle.classList.toggle("is-paused", !domainAutoEnabled);
    domAutoToggle.setAttribute("aria-pressed", String(domainAutoEnabled));
    if (domAutoLabel) {
      domAutoLabel.textContent = domainAutoEnabled ? "Auto · 4s" : "En pause";
    }
    if (!domainAutoEnabled && domAutoProgress) {
      domAutoProgress.style.transform = "scaleX(0)";
    }
  }

  function selectDomainByIndex(idx, animateTransition = true) {
    if (!domainTabs.length) return;
    const safeIdx = ((idx % domainTabs.length) + domainTabs.length) % domainTabs.length;
    activeDomainIndex = safeIdx;
    domainTabs.forEach((b, i) => {
      const isSelected = i === safeIdx;
      b.classList.toggle("active", isSelected);
      b.setAttribute("aria-selected", String(isSelected));
    });
    renderDomain(domainTabs[safeIdx].getAttribute("data-domain"), animateTransition);
    domainElapsedMs = 0;
    if (domAutoProgress) {
      domAutoProgress.style.transform = "scaleX(0)";
    }
  }

  domainTabs.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      selectDomainByIndex(idx, true);
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextIdx =
          e.key === "ArrowRight"
            ? (idx + 1) % domainTabs.length
            : (idx - 1 + domainTabs.length) % domainTabs.length;
        domainTabs[nextIdx].focus();
        selectDomainByIndex(nextIdx, true);
      }
    });
  });

  if (domAutoToggle) {
    domAutoToggle.addEventListener("click", () => {
      domainAutoEnabled = !domainAutoEnabled;
      domainElapsedMs = 0;
      domainLastFrameTs = null;
      updateAutoToggleUI();
    });
  }

  if (domSection) {
    const pauseTargets = [domCard, domSection.querySelector(".tabs-bar")].filter(Boolean);
    pauseTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        domainHoverPaused = true;
      });
      el.addEventListener("mouseleave", () => {
        domainHoverPaused = false;
      });
    });

    domSection.addEventListener("focusin", (e) => {
      if (e.target && e.target.classList && e.target.classList.contains("domain-tab")) {
        domainFocusPaused = true;
      }
    });
    domSection.addEventListener("focusout", () => {
      setTimeout(() => {
        const activeEl = document.activeElement;
        domainFocusPaused = Boolean(
          activeEl && domSection.contains(activeEl) && activeEl.classList.contains("domain-tab")
        );
      }, 0);
    });

    if ("IntersectionObserver" in window) {
      const domainVisObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            domainVisible = entry.isIntersecting;
            if (!domainVisible) {
              domainLastFrameTs = null;
            }
          });
        },
        { threshold: 0.2 }
      );
      domainVisObserver.observe(domSection);
    } else {
      domainVisible = true;
    }
  }

  function tickDomainAutoCycle(ts) {
    requestAnimationFrame(tickDomainAutoCycle);
    const shouldAdvance =
      domainAutoEnabled &&
      domainVisible &&
      !domainHoverPaused &&
      !domainFocusPaused &&
      !document.hidden &&
      domainTabs.length > 1;

    if (!shouldAdvance) {
      domainLastFrameTs = ts;
      return;
    }

    if (domainLastFrameTs === null) {
      domainLastFrameTs = ts;
      return;
    }

    const delta = Math.min(120, Math.max(0, ts - domainLastFrameTs));
    domainLastFrameTs = ts;
    domainElapsedMs += delta;

    const progress = Math.min(1, domainElapsedMs / DOMAIN_CYCLE_MS);
    if (domAutoProgress) {
      domAutoProgress.style.transform = `scaleX(${progress.toFixed(4)})`;
    }

    if (domainElapsedMs >= DOMAIN_CYCLE_MS) {
      selectDomainByIndex(activeDomainIndex + 1, true);
    }
  }

  selectDomainByIndex(0, false);
  updateAutoToggleUI();
  requestAnimationFrame(tickDomainAutoCycle);

  // --------------------------------------------------------------------------
  // 7. BENCHMARKS SVG HAUTE PRÉCISION (COURBES BÉZIER + TOOLTIP INTERACTIF)
  // --------------------------------------------------------------------------
  const benchmarkData = {
    resilience: {
      title: "Quantis-Stock — Continuité Caisse & Stock sans Internet",
      kpiHero: "100 %",
      kpiSub: "Fonctionnel hors-ligne via SQLite Drift avec rattrapage automatique",
      legendQuantis: "Quantis-Stock (Offline-First SQLite Drift)",
      legendTier1: "ERP Pur Cloud (Dépendant Internet)",
      yTicks: ["100%", "85%", "70%", "55%", "40%"],
      xTicks: ["0h", "6h", "24h", "48h", "72h"],
      yAxisLabel: "Opérationnalité Caisse (%)",
      xAxisLabel: "Durée Coupure WAN",
      pointsQuantis: [
        { x: 64, y: 38, val: "100%", label: "0h" },
        { x: 192, y: 39, val: "100%", label: "6h" },
        { x: 320, y: 40, val: "100%", label: "24h" },
        { x: 448, y: 42, val: "99.9%", label: "48h" },
        { x: 586, y: 44, val: "99.9%", label: "72h" }
      ],
      pointsTier1: [
        { x: 64, y: 56, val: "98%", label: "0h" },
        { x: 192, y: 118, val: "86%", label: "6h" },
        { x: 320, y: 185, val: "68%", label: "24h" },
        { x: 448, y: 235, val: "52%", label: "48h" },
        { x: 586, y: 266, val: "40%", label: "72h" }
      ],
      caption:
        "Architecture Quantis-Stock : chaque point de vente encaisse, imprime et décrémente son stock en local (SQLite Drift) puis synchronise vers Spring Boot 4 / PostgreSQL 18 dès le retour du réseau."
    },
    latency: {
      title: "Quantis-IA — Souveraineté d'Inférence Locale (OpenJarvis)",
      kpiHero: "88,7 %",
      kpiSub: "Requêtes résolues localement sans coût ni fuite API cloud",
      legendQuantis: "Quantis-IA (OpenJarvis Local-First + Ollama)",
      legendTier1: "Agents 100 % Cloud Externes",
      yTicks: ["100%", "80%", "60%", "40%", "20%"],
      xTicks: ["Chat", "Synthèse", "Voix ERP", "Audit Doc", "Multi-Agent"],
      yAxisLabel: "Exécution Locale Souveraine",
      xAxisLabel: "Complexité Tâche",
      pointsQuantis: [
        { x: 64, y: 38, val: "99%", label: "Chat" },
        { x: 192, y: 46, val: "95%", label: "Synthèse" },
        { x: 320, y: 54, val: "92%", label: "Voix ERP" },
        { x: 448, y: 66, val: "89%", label: "Audit Doc" },
        { x: 586, y: 80, val: "85%", label: "Multi-Agent" }
      ],
      pointsTier1: [
        { x: 64, y: 256, val: "0% local", label: "Chat" },
        { x: 192, y: 256, val: "0% local", label: "Synthèse" },
        { x: 320, y: 248, val: "4% local", label: "Voix ERP" },
        { x: 448, y: 246, val: "5% local", label: "Audit Doc" },
        { x: 586, y: 240, val: "8% local", label: "Multi-Agent" }
      ],
      caption:
        "Inspiré des travaux Intelligence Per Watt intégrés à OpenJarvis : Quantis-IA traite les requêtes courantes en local (Ollama + Rust) et n'invoque le cloud qu'en dernier recours."
    },
    automation: {
      title: "Quantis-Phone — Qualité Audio Opus & Traversée NAT (VoIP / WebRTC)",
      kpiHero: "99,8 %",
      kpiSub: "Établissement d'appel & média chiffré SRTP via Asterisk + coturn",
      legendQuantis: "Quantis-Phone (PJSIP + coturn ICE/TURN + LiveKit)",
      legendTier1: "VoIP P2P sans Relais TURN",
      yTicks: ["100%", "85%", "70%", "55%", "40%"],
      xTicks: ["LAN", "Wi-Fi Pub", "4G/5G", "NAT Sym.", "Pare-feu"],
      yAxisLabel: "Taux Connexion Audio/Vidéo",
      xAxisLabel: "Profil Réseau",
      pointsQuantis: [
        { x: 64, y: 38, val: "100%", label: "LAN" },
        { x: 192, y: 40, val: "99.9%", label: "Wi-Fi Pub" },
        { x: 320, y: 42, val: "99.8%", label: "4G/5G" },
        { x: 448, y: 45, val: "99.6%", label: "NAT Sym." },
        { x: 586, y: 49, val: "99.4%", label: "Pare-feu" }
      ],
      pointsTier1: [
        { x: 64, y: 48, val: "98%", label: "LAN" },
        { x: 192, y: 98, val: "88%", label: "Wi-Fi Pub" },
        { x: 320, y: 145, val: "76%", label: "4G/5G" },
        { x: 448, y: 224, val: "52%", label: "NAT Sym." },
        { x: 586, y: 262, val: "40%", label: "Pare-feu" }
      ],
      caption:
        "Pile Quantis-Phone : signalisation SIP/TLS & WSS via Asterisk 20+, relais coturn pour traverser les pare-feux stricts et codec Opus 48 kHz résistant à la gigue."
    },
    durability: {
      title: "Pérennité Architecturale & Maintenabilité (Principe 06)",
      kpiHero: "10–30 Ans",
      kpiSub: "Standard d'ingénierie QUANTIS sans dette technique jetable",
      legendQuantis: "Architecture Évolutive QUANTIS",
      legendTier1: "Logiciels Assemblés Sans Schéma",
      yTicks: ["100", "80", "60", "40", "20"],
      xTicks: ["An 1", "An 3", "An 5", "An 8", "An 10+"],
      yAxisLabel: "Score Maintenabilité",
      xAxisLabel: "Horizon d'Exploitation",
      pointsQuantis: [
        { x: 64, y: 36, val: "99/100", label: "An 1" },
        { x: 192, y: 40, val: "98/100", label: "An 3" },
        { x: 320, y: 44, val: "97/100", label: "An 5" },
        { x: 448, y: 47, val: "96/100", label: "An 8" },
        { x: 586, y: 50, val: "95/100", label: "An 10+" }
      ],
      pointsTier1: [
        { x: 64, y: 80, val: "86/100", label: "An 1" },
        { x: 192, y: 125, val: "72/100", label: "An 3" },
        { x: 320, y: 178, val: "56/100", label: "An 5" },
        { x: 448, y: 226, val: "41/100", label: "An 8" },
        { x: 586, y: 258, val: "28/100", label: "An 10+" }
      ],
      caption:
        "Principe 06 du Cahier Fondateur : découplage modulaire, bases relationnelles strictes et documentation claire pour traverser les décennies."
    }
  };

  // Convertit une liste de points en chemin Bézier lissé (Catmull-Rom)
  function buildSmoothPath(pts) {
    if (!pts || pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const benchmarkTabs = document.querySelectorAll(".benchmark-tab");
  const benchmarkTitle = document.getElementById("benchmarkTitle");
  const benchmarkCaption = document.getElementById("benchmarkCaption");
  const benchmarkKpiHero = document.getElementById("benchmarkKpiHero");
  const benchmarkKpiSub = document.getElementById("benchmarkKpiSub");
  const legendQuantisLabel = document.getElementById("legendQuantisLabel");
  const legendTier1Label = document.getElementById("legendTier1Label");
  const pathQuantis = document.getElementById("pathQuantis");
  const pathQuantisArea = document.getElementById("pathQuantisArea");
  const pathTier1 = document.getElementById("pathTier1");
  const pointsContainer = document.getElementById("benchmarkPoints");
  const axesContainer = document.getElementById("benchmarkAxesTicks");
  const yAxisTitle = document.getElementById("yAxisTitle");
  const xAxisTitle = document.getElementById("xAxisTitle");
  const benchTooltip = document.getElementById("benchTooltip");
  const benchHoverLine = document.getElementById("benchHoverLine");
  const benchSvg = document.getElementById("benchmarkSvg");

  let activeBenchData = benchmarkData.resilience;

  function renderBenchmark(key) {
    const data = benchmarkData[key];
    if (!data) return;
    activeBenchData = data;

    if (benchmarkTitle) benchmarkTitle.textContent = data.title;
    if (benchmarkCaption) benchmarkCaption.textContent = data.caption;
    if (benchmarkKpiHero) benchmarkKpiHero.textContent = data.kpiHero;
    if (benchmarkKpiSub) benchmarkKpiSub.textContent = data.kpiSub;
    if (legendQuantisLabel) legendQuantisLabel.textContent = data.legendQuantis;
    if (legendTier1Label) legendTier1Label.textContent = data.legendTier1;
    if (yAxisTitle) yAxisTitle.textContent = data.yAxisLabel;
    if (xAxisTitle) xAxisTitle.textContent = data.xAxisLabel;

    const dQ = buildSmoothPath(data.pointsQuantis);
    const dT = buildSmoothPath(data.pointsTier1);
    const firstQ = data.pointsQuantis[0];
    const lastQ = data.pointsQuantis[data.pointsQuantis.length - 1];
    const dArea = `${dQ} L ${lastQ.x} 274 L ${firstQ.x} 274 Z`;

    if (pathQuantis) {
      pathQuantis.setAttribute("d", dQ);
      const len = pathQuantis.getTotalLength ? pathQuantis.getTotalLength() : 700;
      pathQuantis.style.strokeDasharray = `${len}`;
      pathQuantis.style.strokeDashoffset = `${len}`;
      requestAnimationFrame(() => {
        pathQuantis.style.transition = "stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)";
        pathQuantis.style.strokeDashoffset = "0";
      });
    }
    if (pathQuantisArea) pathQuantisArea.setAttribute("d", dArea);
    if (pathTier1) pathTier1.setAttribute("d", dT);

    // Ticks X & Y
    if (axesContainer) {
      const yCoords = [38, 97, 156, 215, 274];
      const yHtml = data.yTicks
        .map(
          (lbl, i) =>
            `<text x="50" y="${yCoords[i] + 4}" text-anchor="end" fill="#59638d" font-size="10.5" font-family="'JetBrains Mono', monospace">${lbl}</text>`
        )
        .join("");
      const xHtml = data.pointsQuantis
        .map(
          (pt, i) =>
            `<text x="${pt.x}" y="294" text-anchor="middle" fill="#59638d" font-size="10.5" font-family="'JetBrains Mono', monospace">${data.xTicks[i]}</text>`
        )
        .join("");
      axesContainer.innerHTML = yHtml + xHtml;
    }

    if (pointsContainer) {
      pointsContainer.innerHTML = "";
      data.pointsQuantis.forEach((pt, idx) => {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        halo.setAttribute("cx", pt.x);
        halo.setAttribute("cy", pt.y);
        halo.setAttribute("r", 10);
        halo.setAttribute("fill", "rgba(24, 32, 120, 0.14)");

        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", pt.x);
        c.setAttribute("cy", pt.y);
        c.setAttribute("r", 4.8);
        c.setAttribute("fill", "#182078");
        c.setAttribute("stroke", "#ffffff");
        c.setAttribute("stroke-width", "2.2");
        c.dataset.idx = String(idx);

        g.appendChild(halo);
        g.appendChild(c);
        pointsContainer.appendChild(g);
      });

      data.pointsTier1.forEach((pt) => {
        const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        r.setAttribute("x", pt.x - 3.5);
        r.setAttribute("y", pt.y - 3.5);
        r.setAttribute("width", 7);
        r.setAttribute("height", 7);
        r.setAttribute("rx", 1.5);
        r.setAttribute("fill", "#d0a830");
        pointsContainer.appendChild(r);
      });
    }
  }

  // Tooltip interactif au survol du graphe SVG
  if (benchSvg && benchTooltip && benchHoverLine) {
    benchSvg.addEventListener("mousemove", (e) => {
      const rect = benchSvg.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 640;
      const pts = activeBenchData.pointsQuantis;
      let nearestIdx = 0;
      let minDist = Infinity;
      pts.forEach((pt, idx) => {
        const d = Math.abs(pt.x - relX);
        if (d < minDist) {
          minDist = d;
          nearestIdx = idx;
        }
      });

      const qPt = activeBenchData.pointsQuantis[nearestIdx];
      const tPt = activeBenchData.pointsTier1[nearestIdx];

      benchHoverLine.setAttribute("x1", qPt.x);
      benchHoverLine.setAttribute("x2", qPt.x);
      benchHoverLine.style.opacity = "1";

      benchTooltip.style.opacity = "1";
      benchTooltip.style.left = `${(qPt.x / 640) * 100}%`;
      const shiftX = qPt.x < 160 ? "-15%" : qPt.x > 480 ? "-85%" : "-50%";
      benchTooltip.style.transform = `translateX(${shiftX})`;
      benchTooltip.innerHTML = `
        <div class="bt-head">${qPt.label} · ${activeBenchData.xAxisLabel}</div>
        <div class="bt-row"><span class="bt-dot q"></span>QUANTIS : <strong>${qPt.val}</strong></div>
        <div class="bt-row"><span class="bt-dot t"></span>Standard : <strong>${tPt.val}</strong></div>
      `;
    });

    benchSvg.addEventListener("mouseleave", () => {
      benchHoverLine.style.opacity = "0";
      benchTooltip.style.opacity = "0";
    });
  }

  benchmarkTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      benchmarkTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBenchmark(btn.getAttribute("data-bench"));
    });
  });
  renderBenchmark("resilience");

  // --------------------------------------------------------------------------
  // 8. FORMULAIRE DE CONTACT INTELLIGENT (BRIEF + EMAIL / WHATSAPP)
  // --------------------------------------------------------------------------
  const topicChips = document.querySelectorAll(".topic-chip");
  const sujetInput = document.getElementById("sujet");
  topicChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      topicChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (sujetInput) {
        sujetInput.value = chip.getAttribute("data-topic") || chip.textContent.trim();
        sujetInput.focus();
      }
    });
  });

  const contactForm = document.getElementById("contactForm");
  const contactSuccessPanel = document.getElementById("contactSuccessPanel");
  const btnMailtoSend = document.getElementById("btnMailtoSend");
  const btnWhatsappSend = document.getElementById("btnWhatsappSend");
  const btnCopyBrief = document.getElementById("btnCopyBrief");
  const btnResetForm = document.getElementById("btnResetForm");

  if (contactForm && contactSuccessPanel) {
    let lastBriefText = "";

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nom = (document.getElementById("nom")?.value || "").trim();
      const email = (document.getElementById("email")?.value || "").trim();
      const sujet = (document.getElementById("sujet")?.value || "").trim();
      const message = (document.getElementById("message")?.value || "").trim();

      lastBriefText =
        `[BRIEF PROJET QUANTIS]\n` +
        `Nom : ${nom}\n` +
        `Email : ${email}\n` +
        `Pôle / Objet : ${sujet}\n\n` +
        `Détails :\n${message}`;

      if (btnMailtoSend) {
        const mailUrl = `mailto:contactquantisbf@gmail.com?subject=${encodeURIComponent(
          `[QUANTIS] ${sujet} — ${nom}`
        )}&body=${encodeURIComponent(lastBriefText)}`;
        btnMailtoSend.setAttribute("href", mailUrl);
      }

      if (btnWhatsappSend) {
        const waUrl = `https://wa.me/22665189261?text=${encodeURIComponent(
          lastBriefText
        )}`;
        btnWhatsappSend.setAttribute("href", waUrl);
      }

      contactForm.style.display = "none";
      contactSuccessPanel.hidden = false;
    });

    if (btnCopyBrief) {
      btnCopyBrief.addEventListener("click", async () => {
        if (!lastBriefText) return;
        try {
          await navigator.clipboard.writeText(lastBriefText);
          btnCopyBrief.textContent = "Brief copié dans le presse-papiers";
          setTimeout(() => {
            btnCopyBrief.textContent = "Copier le brief";
          }, 2500);
        } catch (err) {
          btnCopyBrief.textContent = "Utilisez Email ou WhatsApp ci-dessus";
        }
      });
    }

    if (btnResetForm) {
      btnResetForm.addEventListener("click", () => {
        contactForm.reset();
        topicChips.forEach((c) => c.classList.remove("active"));
        contactSuccessPanel.hidden = true;
        contactForm.style.display = "flex";
      });
    }
  }
});
