/**
 * ============================================================================
 * QUANTIS — Laboratoire Produits 3D Interactif (Three.js r128 PBR)
 * Modélisation 3D temps réel des 3 solutions officielles QUANTIS :
 *   1. Quantis-Stock (ERP Commercial, Caisse POS & Offline-First)
 *   2. Quantis-IA    (Jarvis / OpenJarvis · Agents Locaux & Quantis Voice)
 *   3. Quantis-Phone (Téléphonie IP PJSIP · WebRTC · Visio SFU Souveraine)
 * Palette officielle QUANTIS : Bleu Royal (#182078), Ivoire (#F6F7FB), Or (#D0A830)
 * ============================================================================
 */
(function (global) {
  "use strict";

  function initQuantisProductLab() {
    const canvas = document.getElementById("quantis-lab-canvas");
    if (!canvas || typeof THREE === "undefined") return null;

    const container = canvas.parentElement;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch (e) {
      return null;
    }

    const getSize = () => ({
      w: Math.max(300, container.clientWidth || 600),
      h: Math.max(360, container.clientHeight || 460)
    });

    const initSize = getSize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initSize.w, initSize.h);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, initSize.w / initSize.h, 0.1, 100);

    // Éclairage Studio 3 Points : Blanc perle + Bleu Royal + Or Satiné QUANTIS
    const ambientLight = new THREE.AmbientLight(0xeef2ff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.95);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x526bf0, 2.3, 26);
    fillLight.position.set(-6, 2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xe2b94f, 2.0, 24);
    rimLight.position.set(5, -2, -6);
    scene.add(rimLight);

    // Plateau architectural au sol (Bleu Royal & Or QUANTIS)
    const gridGroup = new THREE.Group();
    gridGroup.position.y = -2.05;
    const gridHelper = new THREE.GridHelper(12, 24, 0x627af5, 0x1a2678);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.28;
    gridGroup.add(gridHelper);

    const floorRingGeo = new THREE.RingGeometry(2.65, 2.71, 72);
    floorRingGeo.rotateX(-Math.PI / 2);
    const floorRingMat = new THREE.MeshBasicMaterial({
      color: 0xd0a830,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide
    });
    gridGroup.add(new THREE.Mesh(floorRingGeo, floorRingMat));
    scene.add(gridGroup);

    const stageRoot = new THREE.Group();
    scene.add(stageRoot);

    function createQEmblemTexture() {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#0b1242";
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();

      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 118);
      grad.addColorStop(0, "rgba(82, 107, 240, 0.45)");
      grad.addColorStop(1, "rgba(11, 18, 66, 0.95)");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "#f8f9fc";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(122, 126, 50, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(132, 140);
      ctx.lineTo(172, 180);
      ctx.stroke();

      ctx.strokeStyle = "#e2b94f";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(174, 102);
      ctx.lineTo(204, 72);
      ctx.stroke();

      ctx.fillStyle = "#e2b94f";
      ctx.beginPath();
      ctx.moveTo(212, 64);
      ctx.lineTo(185, 67);
      ctx.lineTo(208, 90);
      ctx.closePath();
      ctx.fill();

      return new THREE.CanvasTexture(c);
    }

    // ========================================================================
    // MODÈLE 1 : QUANTIS-STOCK (ERP Commercial & Offline-First Multi-Couches)
    // ========================================================================
    const stockGroup = new THREE.Group();
    const layersMeta = [
      { y: -1.12, label: "POSTGRESQL 18 · AUDIT & TVA 18%", color: 0x101858, accent: 0xd0a830 },
      { y: -0.37, label: "SPRING BOOT 4 · RBAC 5 RÔLES & JWT", color: 0x182078, accent: 0x7c95ff },
      { y: 0.38, label: "SQLITE DRIFT · SYNC OFFLINE-FIRST FCFA", color: 0x0b1240, accent: 0xe2b94f },
      { y: 1.13, label: "FLUTTER DESKTOP & ANDROID · QUANTIS VOICE", color: 0x2233a6, accent: 0xf6f7fb }
    ];

    const erpLayers = [];
    layersMeta.forEach((lm, idx) => {
      const w = 3.9 - idx * 0.22;
      const d = 2.55 - idx * 0.14;
      const slabGeo = new THREE.BoxGeometry(w, 0.22, d);
      const slabMat = new THREE.MeshStandardMaterial({
        color: lm.color,
        metalness: 0.52,
        roughness: 0.26,
        transparent: true,
        opacity: 0.92
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.y = lm.y;

      const edges = new THREE.EdgesGeometry(slabGeo);
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: lm.accent, transparent: true, opacity: 0.92 })
      );
      slab.add(edgeLine);

      const c = document.createElement("canvas");
      c.width = 560;
      c.height = 64;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(8, 14, 52, 0.96)";
      ctx.fillRect(0, 0, 560, 64);
      ctx.fillStyle = lm.accent === 0xd0a830 || lm.accent === 0xe2b94f ? "#e6c15a" : "#f8f9fc";
      ctx.font = "700 20px monospace";
      ctx.fillText(lm.label, 18, 40);

      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(w * 0.86, 0.17),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })
      );
      plate.position.set(0, 0, d / 2 + 0.008);
      slab.add(plate);

      stockGroup.add(slab);
      erpLayers.push({ mesh: slab, baseY: lm.y, idx });
    });

    // Colonnes de synchronisation bidirectionnelle SQLite Drift <-> PostgreSQL
    const erpPackets = [];
    const packetGeo = new THREE.SphereGeometry(0.08, 10, 10);
    for (let c = 0; c < 4; c++) {
      const ang = (c / 4) * Math.PI * 2 + Math.PI / 4;
      const px = Math.cos(ang) * 1.1;
      const pz = Math.sin(ang) * 0.68;
      const busPts = [new THREE.Vector3(px, -1.2, pz), new THREE.Vector3(px, 1.25, pz)];
      const busLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(busPts),
        new THREE.LineBasicMaterial({ color: 0x7c95ff, transparent: true, opacity: 0.48 })
      );
      stockGroup.add(busLine);

      for (let k = 0; k < 3; k++) {
        const p = new THREE.Mesh(
          packetGeo,
          new THREE.MeshBasicMaterial({ color: k % 2 === 0 ? 0xe2b94f : 0xf6f7fb })
        );
        p.position.set(px, -1.1 + k * 0.8, pz);
        stockGroup.add(p);
        erpPackets.push({ mesh: p, phase: k * 0.33 + c * 0.22, dir: c % 2 === 0 ? 1 : -1 });
      }
    }

    // ========================================================================
    // MODÈLE 2 : QUANTIS-IA (Jarvis / OpenJarvis · Local-First & Voix)
    // ========================================================================
    const iaGroup = new THREE.Group();
    const nodePositions = [];
    const nodeMeshes = [];
    const nodeCount = 48;
    const phiGolden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phiGolden * i;
      const radius = 1.68 + (i % 3) * 0.25;
      const pos = new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      );
      nodePositions.push(pos);

      const isGold = i % 5 === 0;
      const isPearl = i % 4 === 0 && !isGold;
      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(isGold ? 0.1 : 0.068, 12, 12),
        new THREE.MeshBasicMaterial({
          color: isGold ? 0xe2b94f : isPearl ? 0xf8f9fc : 0x627af5
        })
      );
      nMesh.position.copy(pos);
      iaGroup.add(nMesh);
      nodeMeshes.push({ mesh: nMesh, phase: i * 0.38 });
    }

    const edgeVerts = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.38) {
          edgeVerts.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    const synGeo = new THREE.BufferGeometry();
    synGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgeVerts, 3));
    const synLines = new THREE.LineSegments(
      synGeo,
      new THREE.LineBasicMaterial({
        color: 0x7c95ff,
        transparent: true,
        opacity: 0.46,
        blending: THREE.AdditiveBlending
      })
    );
    iaGroup.add(synLines);

    // Noyau neuronal central OpenJarvis + Quantis Voice
    const iaHeart = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7, 2),
      new THREE.MeshStandardMaterial({
        color: 0xf8f9fc,
        emissive: 0x2338a8,
        emissiveIntensity: 1.35,
        wireframe: true
      })
    );
    iaGroup.add(iaHeart);

    const iaOrbit1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.38, 0.028, 12, 96),
      new THREE.MeshBasicMaterial({ color: 0xd0a830, transparent: true, opacity: 0.8 })
    );
    iaOrbit1.rotation.x = Math.PI / 3;
    iaGroup.add(iaOrbit1);

    const iaOrbit2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.018, 12, 96),
      new THREE.MeshBasicMaterial({ color: 0xf6f7fb, transparent: true, opacity: 0.42 })
    );
    iaOrbit2.rotation.y = Math.PI / 4;
    iaGroup.add(iaOrbit2);

    // 8 Agents Autonomes en orbite sur iaOrbit1
    const agentSatellites = [];
    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    for (let a = 0; a < 8; a++) {
      const sat = new THREE.Mesh(
        satGeo,
        new THREE.MeshBasicMaterial({ color: a % 2 === 0 ? 0xe6c15a : 0xffffff })
      );
      iaGroup.add(sat);
      agentSatellites.push({ mesh: sat, angleOffset: (a / 8) * Math.PI * 2 });
    }

    // ========================================================================
    // MODÈLE 3 : QUANTIS-PHONE (VoIP Asterisk PJSIP · WebRTC · LiveKit SFU)
    // ========================================================================
    const phoneGroup = new THREE.Group();

    const phoneMetalMat = new THREE.MeshStandardMaterial({
      color: 0x141d60,
      metalness: 0.78,
      roughness: 0.24
    });
    const phoneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd9ae42,
      metalness: 0.88,
      roughness: 0.2
    });

    // Terminal principal Quantis-Phone incliné avec châssis or & bleu royal
    const handsetGroup = new THREE.Group();
    handsetGroup.position.set(-0.95, 0.08, 0.35);
    handsetGroup.rotation.set(-0.1, 0.22, -0.05);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.75, 3.35, 0.19), phoneMetalMat);
    handsetGroup.add(chassis);

    const rimEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.78, 3.38, 0.21)),
      new THREE.LineBasicMaterial({ color: 0xe6c15a, transparent: true, opacity: 0.9 })
    );
    handsetGroup.add(rimEdges);

    // Emblème dos du téléphone
    const backBadge = new THREE.Mesh(
      new THREE.CircleGeometry(0.32, 32),
      new THREE.MeshBasicMaterial({ map: createQEmblemTexture() })
    );
    backBadge.rotation.y = Math.PI;
    backBadge.position.set(0, 0.2, -0.1);
    handsetGroup.add(backBadge);

    // Écran dynamique Quantis-Phone (CanvasTexture animé Opus HD / SRTP)
    const phoneCanvas = document.createElement("canvas");
    phoneCanvas.width = 512;
    phoneCanvas.height = 920;
    const pctx = phoneCanvas.getContext("2d");
    const phoneTex = new THREE.CanvasTexture(phoneCanvas);

    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.56, 3.05),
      new THREE.MeshBasicMaterial({ map: phoneTex })
    );
    phoneScreen.position.set(0, 0, 0.1);
    handsetGroup.add(phoneScreen);
    phoneGroup.add(handsetGroup);

    // Nœud Serveur SIP Asterisk PJSIP / LiveKit SFU à droite
    const hubGroup = new THREE.Group();
    hubGroup.position.set(1.65, 0.1, -0.45);

    const hubCore = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 1.65, 1.25),
      new THREE.MeshStandardMaterial({
        color: 0x0e164c,
        metalness: 0.72,
        roughness: 0.26
      })
    );
    hubGroup.add(hubCore);

    const hubWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.32, 1.72, 1.32)),
      new THREE.LineBasicMaterial({ color: 0x7c95ff, transparent: true, opacity: 0.85 })
    );
    hubGroup.add(hubWire);

    const hubGoldRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.025, 12, 64),
      phoneGoldMat
    );
    hubGoldRing.rotation.x = Math.PI / 2.2;
    hubGroup.add(hubGoldRing);

    const hubPlateCanvas = document.createElement("canvas");
    hubPlateCanvas.width = 320;
    hubPlateCanvas.height = 128;
    const hctx = hubPlateCanvas.getContext("2d");
    hctx.fillStyle = "#09103f";
    hctx.fillRect(0, 0, 320, 128);
    hctx.strokeStyle = "#d0a830";
    hctx.lineWidth = 4;
    hctx.strokeRect(4, 4, 312, 120);
    hctx.fillStyle = "#f8f9fc";
    hctx.font = "700 22px monospace";
    hctx.fillText("ASTERISK PJSIP", 22, 48);
    hctx.fillStyle = "#e6c15a";
    hctx.font = "600 18px monospace";
    hctx.fillText("COTURN · LIVEKIT SFU", 22, 90);
    const hubLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.08, 0.42),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hubPlateCanvas) })
    );
    hubLabel.position.set(0, 0.32, 0.635);
    hubGroup.add(hubLabel);

    phoneGroup.add(hubGroup);

    // Arcs WebRTC / SRTP reliant le terminal et le nœud Asterisk PJSIP
    const signalCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.55, 0.45),
      new THREE.Vector3(0.42, 1.15, 0.15),
      new THREE.Vector3(0.95, 0.95, -0.15),
      new THREE.Vector3(1.52, 0.45, -0.35)
    ]);
    const signalLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(signalCurve.getPoints(48)),
      new THREE.LineBasicMaterial({ color: 0xe6c15a, transparent: true, opacity: 0.72 })
    );
    phoneGroup.add(signalLine);

    const mediaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, -0.35, 0.45),
      new THREE.Vector3(0.45, -0.95, 0.15),
      new THREE.Vector3(1.0, -0.75, -0.15),
      new THREE.Vector3(1.52, -0.25, -0.35)
    ]);
    const mediaLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(mediaCurve.getPoints(48)),
      new THREE.LineBasicMaterial({ color: 0x7c95ff, transparent: true, opacity: 0.65 })
    );
    phoneGroup.add(mediaLine);

    const rtpPulses = [];
    for (let i = 0; i < 6; i++) {
      const isMedia = i % 2 === 0;
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.068, 10, 10),
        new THREE.MeshBasicMaterial({ color: isMedia ? 0xf6f7fb : 0xe6c15a })
      );
      phoneGroup.add(pMesh);
      rtpPulses.push({
        mesh: pMesh,
        curve: isMedia ? mediaCurve : signalCurve,
        phase: i / 6,
        dir: i % 3 === 0 ? -1 : 1
      });
    }

    function drawPhoneScreen(phase, stress) {
      pctx.fillStyle = "#080f3c";
      pctx.fillRect(0, 0, 512, 920);

      // Fond dégradé Bleu Royal -> Or
      const g = pctx.createLinearGradient(0, 0, 512, 920);
      g.addColorStop(0, "#141f70");
      g.addColorStop(0.55, "#0b1245");
      g.addColorStop(1, "#060b2e");
      pctx.fillStyle = g;
      pctx.fillRect(0, 0, 512, 920);

      // En-tête statut chiffré
      pctx.fillStyle = "rgba(255,255,255,0.08)";
      pctx.fillRect(28, 36, 456, 72);
      pctx.fillStyle = "#e6c15a";
      pctx.font = "700 22px monospace";
      pctx.fillText(stress ? "SFU 50+ HD · BURST" : "TLS / WSS · SRTP SECURE", 48, 80);

      // Titre produit
      pctx.fillStyle = "#ffffff";
      pctx.font = "800 38px sans-serif";
      pctx.fillText("Quantis-Phone", 48, 185);
      pctx.fillStyle = "#9db0ff";
      pctx.font = "600 22px monospace";
      pctx.fillText("VoIP · WebRTC · Visio HD", 48, 226);

      // Avatar appel / conférence central
      pctx.strokeStyle = "#d0a830";
      pctx.lineWidth = 6;
      pctx.beginPath();
      pctx.arc(256, 390, 92, 0, Math.PI * 2);
      pctx.stroke();

      pctx.fillStyle = "#182078";
      pctx.beginPath();
      pctx.arc(256, 390, 82, 0, Math.PI * 2);
      pctx.fill();

      pctx.fillStyle = "#f8f9fc";
      pctx.font = "800 54px sans-serif";
      pctx.fillText("Q↗", 214, 410);

      // Spectre audio Opus 48 kHz animé
      const barCount = 18;
      for (let b = 0; b < barCount; b++) {
        const amp = Math.abs(Math.sin(phase * 3.5 + b * 0.55)) * (stress ? 120 : 84) + 18;
        const bx = 46 + b * 24;
        pctx.fillStyle = b % 3 === 0 ? "#e6c15a" : "#7c95ff";
        pctx.fillRect(bx, 635 - amp / 2, 14, amp);
      }

      // Infos codec & protocole
      pctx.fillStyle = "rgba(255,255,255,0.08)";
      pctx.fillRect(34, 735, 444, 132);
      pctx.fillStyle = "#f8f9fc";
      pctx.font = "700 22px monospace";
      pctx.fillText("CODEC : OPUS 48kHz / VP8", 56, 785);
      pctx.fillStyle = "#e6c15a";
      pctx.fillText(stress ? "JITTER: 2.1 ms · NAT TURN" : "ASTERISK PJSIP + COTURN", 56, 828);

      phoneTex.needsUpdate = true;
    }
    drawPhoneScreen(0, false);

    // ========================================================================
    // MONTAGE ET ORCHESTRATION DES 3 MODÈLES RÉELS
    // ========================================================================
    const models = {
      stock: stockGroup,
      ia: iaGroup,
      phone: phoneGroup
    };
    Object.values(models).forEach((m) => {
      m.visible = false;
      stageRoot.add(m);
    });
    models.stock.visible = true;

    let activeModelKey = "stock";
    let isStressTest = false;
    let targetRotY = -0.32;
    let targetRotX = 0.24;
    let currentRotY = -0.32;
    let currentRotX = 0.24;
    let baseCamZ = initSize.w < 600 ? 11.2 : 8.6;
    let targetCamZ = baseCamZ;
    camera.position.set(0, 1.25, baseCamZ);
    let isDragging = false;
    let lastPtr = { x: 0, y: 0 };

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastPtr.x = e.clientX;
      lastPtr.y = e.clientY;
    });
    window.addEventListener("mouseup", () => {
      isDragging = false;
    });
    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      targetRotY += (e.clientX - lastPtr.x) * 0.01;
      targetRotX = Math.max(-0.65, Math.min(0.85, targetRotX + (e.clientY - lastPtr.y) * 0.008));
      lastPtr.x = e.clientX;
      lastPtr.y = e.clientY;
    });

    canvas.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          lastPtr.x = e.touches[0].clientX;
          lastPtr.y = e.touches[0].clientY;
        }
      },
      { passive: true }
    );
    window.addEventListener("touchend", () => {
      isDragging = false;
    });
    canvas.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        targetRotY += (e.touches[0].clientX - lastPtr.x) * 0.01;
        targetRotX = Math.max(
          -0.65,
          Math.min(0.85, targetRotX + (e.touches[0].clientY - lastPtr.y) * 0.008)
        );
        lastPtr.x = e.touches[0].clientX;
        lastPtr.y = e.touches[0].clientY;
      },
      { passive: true }
    );

    const modelButtons = document.querySelectorAll("[data-lab-model]");
    const labTitle = document.getElementById("labModelTitle");
    const labSpec = document.getElementById("labModelSpec");
    const labMeta = {
      stock: {
        title: "Quantis-Stock — ERP Commercial & Multi-Dépôts Offline-First",
        spec: "Spring Boot 4 (Java 21) · PostgreSQL 18 · Flutter Desktop & Android · SQLite Drift · FCFA & TVA 18%"
      },
      ia: {
        title: "Quantis-IA — Moteur Jarvis / OpenJarvis & Quantis Voice",
        spec: "Exécution Local-First (Ollama + Python/Rust) · 8 Agents autonomes · Réveil vocal Double-Clap · Routage hybride"
      },
      phone: {
        title: "Quantis-Phone — Téléphonie IP VoIP, Messagerie & Visio Souveraine",
        spec: "Asterisk 20+ PJSIP · WebRTC SIP.js / Linphone · coturn STUN/TURN · LiveKit SFU · Codec Opus & SRTP/TLS"
      }
    };

    function activateLabModel(key) {
      if (!models[key]) return;
      activeModelKey = key;
      Object.keys(models).forEach((k) => {
        models[k].visible = k === key;
      });
      modelButtons.forEach((b) => {
        const isMatch = b.getAttribute("data-lab-model") === key;
        b.classList.toggle("active", isMatch);
        b.setAttribute("aria-pressed", String(isMatch));
      });
      if (labTitle && labMeta[key]) labTitle.textContent = labMeta[key].title;
      if (labSpec && labMeta[key]) labSpec.textContent = labMeta[key].spec;
      targetRotY = key === "phone" ? -0.22 : 0.28;
      targetRotX = key === "stock" ? 0.26 : 0.16;
    }

    modelButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        activateLabModel(btn.getAttribute("data-lab-model"));
      });
    });

    global.selectQuantisLabModel = function (key) {
      activateLabModel(key);
      const labSection = document.getElementById("lab");
      if (labSection) {
        labSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const btnStress = document.getElementById("labStressBtn");
    if (btnStress) {
      btnStress.addEventListener("click", () => {
        isStressTest = !isStressTest;
        btnStress.classList.toggle("active", isStressTest);
        btnStress.setAttribute("aria-pressed", String(isStressTest));
        const labelSpan = btnStress.querySelector("span");
        if (labelSpan) {
          labelSpan.textContent = isStressTest
            ? "Simulation Forte Charge Active"
            : "Simuler Montée en Charge";
        }
        drawPhoneScreen(0, isStressTest);
      });
    }

    const btnReset = document.getElementById("labResetBtn");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        targetRotY = -0.32;
        targetRotX = activeModelKey === "stock" ? 0.26 : 0.18;
        targetCamZ = baseCamZ;
      });
    }

    const btnZoomIn = document.getElementById("labZoomIn");
    const btnZoomOut = document.getElementById("labZoomOut");
    if (btnZoomIn) btnZoomIn.addEventListener("click", () => (targetCamZ = Math.max(5.5, targetCamZ - 1.0)));
    if (btnZoomOut) btnZoomOut.addEventListener("click", () => (targetCamZ = Math.min(14.0, targetCamZ + 1.0)));

    let isLabVisible = true;
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          isLabVisible = entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      obs.observe(container);
    }

    function handleResize() {
      const s = getSize();
      baseCamZ = s.w < 600 ? 11.2 : 8.6;
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      renderer.setSize(s.w, s.h);
    }
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let frameCount = 0;

    function animateLab() {
      requestAnimationFrame(animateLab);
      if (!isLabVisible) return;

      const t = clock.getElapsedTime();
      const speedMult = isStressTest ? 2.8 : 1.0;
      frameCount++;

      if (!isDragging) {
        targetRotY += 0.0036 * speedMult;
      }
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      stageRoot.rotation.y = currentRotY;
      stageRoot.rotation.x = currentRotX;
      stageRoot.position.y = Math.sin(t * 1.4) * 0.07;

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);

      if (activeModelKey === "stock") {
        erpLayers.forEach((l) => {
          l.mesh.position.y =
            l.baseY + Math.sin(t * 1.6 * speedMult + l.idx * 0.8) * (isStressTest ? 0.07 : 0.035);
        });
        erpPackets.forEach((p) => {
          const progress = (t * 0.48 * speedMult + p.phase) % 1;
          const yNorm = p.dir > 0 ? progress : 1 - progress;
          p.mesh.position.y = -1.15 + yNorm * 2.35;
        });
      } else if (activeModelKey === "ia") {
        iaHeart.rotation.y = -t * 0.85 * speedMult;
        iaHeart.rotation.x = t * 0.45 * speedMult;
        iaOrbit1.rotation.z = t * 0.65 * speedMult;
        iaOrbit2.rotation.x = -t * 0.42 * speedMult;
        nodeMeshes.forEach((n, idx) => {
          const s = 0.85 + 0.42 * Math.sin(t * 3.0 * speedMult + n.phase + idx * 0.05);
          n.mesh.scale.setScalar(s);
        });
        agentSatellites.forEach((sat) => {
          const a = t * 0.72 * speedMult + sat.angleOffset;
          const r = 2.38;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r * Math.cos(Math.PI / 3);
          const z = Math.sin(a) * r * Math.sin(Math.PI / 3);
          sat.mesh.position.set(x, y, z);
          sat.mesh.rotation.y = t * 2.0;
        });
      } else if (activeModelKey === "phone") {
        hubCore.rotation.y = Math.sin(t * 0.6 * speedMult) * 0.14;
        hubWire.rotation.y = hubCore.rotation.y;
        hubGoldRing.rotation.z = t * 0.8 * speedMult;
        rtpPulses.forEach((p) => {
          let prog = (t * 0.52 * speedMult + p.phase) % 1;
          if (p.dir < 0) prog = 1 - prog;
          const pt = p.curve.getPointAt(prog);
          p.mesh.position.copy(pt);
        });
        if (frameCount % 6 === 0) {
          drawPhoneScreen(t * speedMult, isStressTest);
        }
      }

      renderer.render(scene, camera);
    }

    animateLab();

    return { destroy: () => renderer.dispose() };
  }

  global.initQuantisProductLab = initQuantisProductLab;
})(window);
