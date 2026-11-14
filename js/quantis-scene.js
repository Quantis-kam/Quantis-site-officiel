/**
 * ============================================================================
 * QUANTIS — Moteur 3D Unifié & Shaders GLSL (Three.js r128)
 * Un seul contexte WebGL haute performance orchestré par le défilement :
 *   Acte I   (#hero)       : Noyau Géodésique 3D + Flux Fibre + Vortex Galactique
 *   Acte II  (#manifeste)  : Morphing GPU vers le Monogramme Souverain Q↗
 *   Acte III (#domaines)   : Topologie Ondulante & Flux Multi-Domaine
 *   Acte IV  (#benchmarks) : Grille de Télémétrie & Ondes de Résilience
 *   Acte V   (#principes)  : Les 7 Piliers Architecturaux des Principes Quantis
 *   Acte VI  (#horizon)    : Tunnel Stellaire Horizon 2040+
 * ============================================================================
 */
(function (global) {
  "use strict";

  function initQuantisMasterScene() {
    const canvas = document.getElementById("quantis-webgl-stage");
    if (!canvas || typeof THREE === "undefined") return null;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09103f, 0.01);

    const camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      260
    );
    camera.position.set(0, 0, isMobile ? 54 : 42);

    // ------------------------------------------------------------------------
    // 1. SCULPTURE ARCHITECTURALE CENTRALE (HERO CORE + ANNEAUX + FLUX)
    // ------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1.1 Noyau Icosaédrique Interne (Palette Officielle Bleu Royal & Or Quantis)
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 3);
    const coreShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorInner: { value: new THREE.Color(0x182078) },
        uColorRim: { value: new THREE.Color(0x526bf0) },
        uColorGold: { value: new THREE.Color(0xd9ae42) },
        uOpacity: { value: 1.0 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying float vNoise;

        float wave(vec3 p, float t) {
          return sin(p.x * 1.4 + t * 1.2) * cos(p.y * 1.3 - t * 0.9) * sin(p.z * 1.5 + t * 0.8);
        }

        void main() {
          float disp = wave(position, uTime) * 0.16;
          vNoise = disp;
          vec3 newPos = position + normal * disp;
          vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPos = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorInner;
        uniform vec3 uColorRim;
        uniform vec3 uColorGold;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        varying float vNoise;

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPos);
          float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);
          vec3 base = mix(uColorInner * 0.45, uColorRim, fresnel);
          base += uColorGold * smoothstep(0.06, 0.16, vNoise) * 0.55;
          float alpha = (0.18 + fresnel * 0.72) * uOpacity;
          gl_FragColor = vec4(base, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreShaderMat);
    coreGroup.add(coreMesh);

    // 1.2 Treillis Géodésique Externe (Filaire Saphir & Or Quantis)
    const wireGeo = new THREE.IcosahedronGeometry(5.15, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7a92ff,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    const goldWireGeo = new THREE.IcosahedronGeometry(6.05, 1);
    const goldWireMat = new THREE.MeshBasicMaterial({
      color: 0xd9ae42,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const goldWireMesh = new THREE.Mesh(goldWireGeo, goldWireMat);
    coreGroup.add(goldWireMesh);

    // 1.3 Anneaux Gyroscopiques Précis + Micro-Satellites Instanciés
    const rings = [];
    const ringConfigs = [
      { radius: 7.8, tube: 0.032, color: 0x7c95ff, opacity: 0.48, rx: 1.15, ry: 0.35, rz: 0.1, speed: 0.28 },
      { radius: 9.4, tube: 0.03, color: 0xd9ae42, opacity: 0.56, rx: -0.75, ry: 0.9, rz: 0.4, speed: -0.22 },
      { radius: 11.2, tube: 0.022, color: 0xe8ecff, opacity: 0.34, rx: 0.4, ry: -1.1, rz: -0.25, speed: 0.16 }
    ];

    ringConfigs.forEach((cfg) => {
      const rGroup = new THREE.Group();
      rGroup.rotation.set(cfg.rx, cfg.ry, cfg.rz);
      const tGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 12, 140);
      const tMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const ringMesh = new THREE.Mesh(tGeo, tMat);
      rGroup.add(ringMesh);

      // Nœuds satellites sur l'orbite
      const satGeo = new THREE.OctahedronGeometry(0.18, 0);
      const satMat = new THREE.MeshBasicMaterial({
        color: cfg.color === 0xd9ae42 ? 0xe6c15a : 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      for (let s = 0; s < 3; s++) {
        const sat = new THREE.Mesh(satGeo, satMat);
        const angle = (s * Math.PI * 2) / 3;
        sat.position.set(Math.cos(angle) * cfg.radius, Math.sin(angle) * cfg.radius, 0);
        rGroup.add(sat);
      }
      coreGroup.add(rGroup);
      rings.push({ group: rGroup, ringMat: tMat, speed: cfg.speed, baseOpacity: cfg.opacity });
    });

    // 1.4 Flèche d'Ascendance Quantis (↗) en 3D Dorée Orbitant le Noyau
    const arrowGroup = new THREE.Group();
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0xe5b85c,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.6, 12);
    const shaftMesh = new THREE.Mesh(shaftGeo, arrowMat);
    shaftMesh.rotation.z = -Math.PI / 4;
    const headGeo = new THREE.ConeGeometry(0.45, 1.15, 4);
    const headMesh = new THREE.Mesh(headGeo, arrowMat);
    headMesh.rotation.z = -Math.PI / 4;
    headMesh.position.set(1.35, 1.35, 0);
    arrowGroup.add(shaftMesh, headMesh);
    arrowGroup.position.set(6.4, 5.2, 2.5);
    coreGroup.add(arrowGroup);

    // 1.5 Flux de Données & Signalisations le long de Courbes 3D
    const fiberPaths = [];
    const fiberMat = new THREE.LineBasicMaterial({
      color: 0x6b84fa,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pulseCount = 24;
    const pulseGeo = new THREE.SphereGeometry(0.11, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xe6c15a,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pulses = [];

    for (let f = 0; f < 6; f++) {
      const a0 = (f / 6) * Math.PI * 2;
      const pts = [];
      for (let k = 0; k <= 24; k++) {
        const t = k / 24;
        const rad = 4.6 + Math.sin(t * Math.PI) * 7.2;
        const ang = a0 + t * Math.PI * 1.15;
        pts.push(
          new THREE.Vector3(
            Math.cos(ang) * rad,
            (t - 0.5) * 14.0,
            Math.sin(ang) * rad
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
      const line = new THREE.Line(lineGeo, fiberMat);
      coreGroup.add(line);
      fiberPaths.push(curve);
    }

    for (let p = 0; p < pulseCount; p++) {
      const mesh = new THREE.Mesh(pulseGeo, pulseMat);
      coreGroup.add(mesh);
      pulses.push({
        mesh,
        curve: fiberPaths[p % fiberPaths.length],
        offset: Math.random(),
        speed: 0.14 + Math.random() * 0.14
      });
    }

    // ------------------------------------------------------------------------
    // 2. CHAMP DE PARTICULES GPU MORPHING (5 FORMES QUANTIS EN SHADER GLSL)
    // ------------------------------------------------------------------------
    const COUNT = isMobile ? 2000 : 3800;

    // 2.1 Générateur État 0 : Vortex Galactique + Halo Quantis
    function genHeroVortex(N) {
      const arr = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        if (i < N * 0.18) {
          // Nuage périphérique stellaire
          const r = 18 + Math.random() * 28;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
          arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.65;
          arr[i * 3 + 2] = r * Math.cos(ph) - 10;
        } else {
          // 3 bras spiraux équilibrés
          const arm = i % 3;
          const prog = Math.pow(Math.random(), 0.72);
          const r = 6.5 + prog * 18.0;
          const angle = prog * Math.PI * 2.5 + (arm * Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.35;
          const thickness = (Math.random() - 0.5) * (0.9 + prog * 1.6);
          arr[i * 3] = Math.cos(angle) * r;
          arr[i * 3 + 1] = Math.sin(angle) * r * 0.62 + thickness * 0.5;
          arr[i * 3 + 2] = Math.sin(angle * 2.0) * 1.8 + thickness;
        }
      }
      return arr;
    }

    // 2.2 Générateur État 1 : Monogramme Q + Flèche d'Ascendance (↗) Haute Lisibilité
    function genQuantisMonogram(N) {
      const arr = new Float32Array(N * 3);
      const ringN = Math.floor(N * 0.54);
      const tailN = Math.floor(N * 0.14);
      const arrowN = Math.floor(N * 0.24);
      const cx = -1.2;
      const cy = -0.2;
      const Rx = 8.2;
      const Ry = 9.0;

      for (let i = 0; i < N; i++) {
        if (i < ringN) {
          const th = (i / ringN) * Math.PI * 2;
          const w = (Math.random() - 0.5) * (0.48 + 0.36 * Math.pow(Math.cos(th), 2));
          arr[i * 3] = cx + (Rx + w) * Math.cos(th);
          arr[i * 3 + 1] = cy + (Ry + w) * Math.sin(th);
          arr[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
        } else if (i < ringN + tailN) {
          const t = (i - ringN) / tailN;
          const sp = (Math.random() - 0.5) * 0.48;
          arr[i * 3] = cx + 1.6 + t * 7.4 + sp;
          arr[i * 3 + 1] = cy - 4.2 - t * 6.0 + sp * 0.55;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
        } else if (i < ringN + tailN + arrowN) {
          const k = i - ringN - tailN;
          const ax = cx + 10.6;
          const ay = cy + 6.4;
          const c45 = Math.SQRT1_2;
          if (k < arrowN * 0.45) {
            const s = -3.6 + (k / (arrowN * 0.45)) * 4.2;
            const w = (Math.random() - 0.5) * 0.65;
            arr[i * 3] = ax + (s - w) * c45;
            arr[i * 3 + 1] = ay + (s + w) * c45;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
          } else {
            let r1 = Math.random();
            let r2 = Math.random();
            if (r1 + r2 > 1) {
              r1 = 1 - r1;
              r2 = 1 - r2;
            }
            const s = (1 - r1 - r2) * 3.8 + r1 * 0.2 + r2 * 0.2;
            const w = r1 * -2.1 + r2 * 2.1;
            arr[i * 3] = ax + (s - w) * c45;
            arr[i * 3 + 1] = ay + (s + w) * c45;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
          }
        } else {
          // Cercle orbital extérieur discret encadrant le Q↗
          const th = Math.random() * Math.PI * 2;
          const r = 13.8 + (Math.random() - 0.5) * 0.9;
          arr[i * 3] = cx + 1.4 + Math.cos(th) * r;
          arr[i * 3 + 1] = cy + 0.5 + Math.sin(th) * r * 0.94;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 2.2 - 1.2;
        }
      }
      return arr;
    }

    // 2.3 Générateur État 2 : Nappe Topologique Réseau & Télémétrie (Wave Matrix)
    function genWaveMatrix(N) {
      const arr = new Float32Array(N * 3);
      const cols = Math.ceil(Math.sqrt(N * 1.6));
      const rows = Math.ceil(N / cols);
      for (let i = 0; i < N; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const u = col / cols - 0.5;
        const v = row / rows - 0.5;
        const x = u * 44;
        const z = v * 28 - 4;
        const y =
          Math.sin(u * 10.0) * Math.cos(v * 8.0) * 3.6 +
          Math.sin((u + v) * 14.0) * 1.3 -
          2.0;
        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
      }
      return arr;
    }

    // 2.4 Générateur État 3 : Les 7 Piliers Architecturaux Ascendants + Pont Doré
    function genSevenPrinciples(N) {
      const arr = new Float32Array(N * 3);
      const pillars = 7;
      const bodyEnd = Math.floor(N * 0.68); // Bleu saphir/royal pour les 7 colonnes
      const goldEnd = Math.floor(N * 0.90); // Or satiné (aligné sur la plage dorée) pour sommets & arc de liaison
      const yBase = -6.8;

      const pillarX = (p) => (p - 3) * 4.4;
      const pillarZ = (p) => -Math.pow((p - 3) / 3, 2) * 3.6;
      const pillarH = (p) => 6.2 + p * 1.45;

      for (let i = 0; i < N; i++) {
        if (i < bodyEnd) {
          // 7 monolithes prismatiques verticaux disposés en amphithéâtre ascendant
          const p = i % pillars;
          const hNorm = Math.random();
          const h = pillarH(p);
          const halfW = 0.88 - hNorm * 0.14; // Léger fuseau architectural
          const face = Math.floor(Math.random() * 4);
          let lx = 0;
          let lz = 0;
          const tEdge = (Math.random() - 0.5) * 2.0 * halfW;
          if (face === 0) {
            lx = tEdge;
            lz = halfW;
          } else if (face === 1) {
            lx = tEdge;
            lz = -halfW;
          } else if (face === 2) {
            lx = halfW;
            lz = tEdge;
          } else {
            lx = -halfW;
            lz = tEdge;
          }
          arr[i * 3] = pillarX(p) + lx + (Math.random() - 0.5) * 0.12;
          arr[i * 3 + 1] = yBase + hNorm * h;
          arr[i * 3 + 2] = pillarZ(p) + lz + (Math.random() - 0.5) * 0.12;
        } else if (i < goldEnd) {
          const k = i - bodyEnd;
          const segLen = goldEnd - bodyEnd;
          if (k < segLen * 0.45) {
            // Couronnes dorées lumineuses au sommet de chacun des 7 piliers
            const p = k % pillars;
            const yTop = yBase + pillarH(p);
            const rx = (Math.random() - 0.5) * 2.1;
            const rz = (Math.random() - 0.5) * 2.1;
            arr[i * 3] = pillarX(p) + rx;
            arr[i * 3 + 1] = yTop + 0.25 + (Math.random() - 0.5) * 0.45;
            arr[i * 3 + 2] = pillarZ(p) + rz;
          } else {
            // Trajectoire ascendante dorée reliant continûment les 7 sommets
            const u = Math.random();
            const pFloat = u * (pillars - 1);
            const strand = (k % 2 === 0 ? 1 : -1) * 0.35;
            const xPos = (pFloat - 3) * 4.4;
            const zPos = -Math.pow((pFloat - 3) / 3, 2) * 3.6 + strand;
            const yTopInterp = yBase + (6.2 + pFloat * 1.45);
            const arcLift = Math.sin(u * Math.PI) * 1.1;
            arr[i * 3] = xPos + (Math.random() - 0.5) * 0.25;
            arr[i * 3 + 1] = yTopInterp + 1.05 + arcLift + (Math.random() - 0.5) * 0.3;
            arr[i * 3 + 2] = zPos + (Math.random() - 0.5) * 0.25;
          }
        } else {
          // Rails porteurs parallèles formant le socle architectural des 7 piliers
          const u = Math.random();
          const pFloat = u * (pillars - 1);
          const rail = ((i % 2) * 2 - 1) * 1.15;
          arr[i * 3] = (pFloat - 3) * 4.4 + (Math.random() - 0.5) * 0.2;
          arr[i * 3 + 1] = yBase - 0.25 + (Math.random() - 0.5) * 0.25;
          arr[i * 3 + 2] = -Math.pow((pFloat - 3) / 3, 2) * 3.6 + rail;
        }
      }
      return arr;
    }

    // 2.5 Générateur État 4 : Tunnel Stellaire Horizon 2040+
    function genHorizonTunnel(N) {
      const arr = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const th = Math.random() * Math.PI * 2;
        const r = 7.5 + Math.pow(Math.random(), 0.6) * 20.0;
        const z = (Math.random() - 0.5) * 48.0;
        arr[i * 3] = Math.cos(th) * r;
        arr[i * 3 + 1] = Math.sin(th) * r * 0.72;
        arr[i * 3 + 2] = z;
      }
      return arr;
    }

    const posHero = genHeroVortex(COUNT);
    const posQ = genQuantisMonogram(COUNT);
    const posWave = genWaveMatrix(COUNT);
    const posSeven = genSevenPrinciples(COUNT);
    const posHorizon = genHorizonTunnel(COUNT);

    // Attributs Couleur, Taille, Phase & Type
    const aColor = new Float32Array(COUNT * 3);
    const aSize = new Float32Array(COUNT);
    const aPhase = new Float32Array(COUNT);
    const aFlare = new Float32Array(COUNT);

    const paletteColors = [
      new THREE.Color(0xffffff), // Ivoire pur
      new THREE.Color(0xeef1ff), // Perle
      new THREE.Color(0x7c95ff), // Saphir clair QUANTIS
      new THREE.Color(0x4b66eb), // Bleu Royal lumineux
      new THREE.Color(0x2838a8), // Bleu QUANTIS profond
      new THREE.Color(0xe6c15a), // Or QUANTIS clair
      new THREE.Color(0xd0a830)  // Or QUANTIS logo
    ];

    // Assigner des couleurs dorées aux particules formant la flèche du Q
    const ringN = Math.floor(COUNT * 0.55);
    const tailN = Math.floor(COUNT * 0.13);
    const arrowN = Math.floor(COUNT * 0.22);

    for (let i = 0; i < COUNT; i++) {
      let col;
      if (i >= ringN + tailN && i < ringN + tailN + arrowN) {
        col = Math.random() > 0.25 ? paletteColors[5] : paletteColors[0];
      } else {
        const r = Math.random();
        if (r > 0.86) col = paletteColors[5];
        else if (r > 0.55) col = paletteColors[2];
        else if (r > 0.25) col = paletteColors[3];
        else col = paletteColors[0];
      }
      aColor[i * 3] = col.r;
      aColor[i * 3 + 1] = col.g;
      aColor[i * 3 + 2] = col.b;

      const isFlare = Math.random() > 0.89 ? 1.0 : 0.0;
      aFlare[i] = isFlare;
      aSize[i] = isFlare ? 30.0 + Math.random() * 14.0 : 7.0 + Math.random() * 9.5;
      aPhase[i] = Math.random() * Math.PI * 2;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(posHero, 3));
    pGeo.setAttribute("aTargetQ", new THREE.BufferAttribute(posQ, 3));
    pGeo.setAttribute("aTargetWave", new THREE.BufferAttribute(posWave, 3));
    pGeo.setAttribute("aTargetSeven", new THREE.BufferAttribute(posSeven, 3));
    pGeo.setAttribute("aTargetHorizon", new THREE.BufferAttribute(posHorizon, 3));
    pGeo.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
    pGeo.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
    pGeo.setAttribute("aFlare", new THREE.BufferAttribute(aFlare, 1));

    const particleShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uState: { value: 0.0 }
      },
      vertexShader: `
        attribute vec3 aTargetQ;
        attribute vec3 aTargetWave;
        attribute vec3 aTargetSeven;
        attribute vec3 aTargetHorizon;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aPhase;
        attribute float aFlare;

        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec2 uMouse;
        uniform float uState;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vFlare;

        void main() {
          // Interpolation fluide entre 5 états (uState in [0..4])
          vec3 p0 = position;
          vec3 p1 = aTargetQ;
          vec3 p2 = aTargetWave;
          vec3 p3 = aTargetSeven;
          vec3 p4 = aTargetHorizon;

          vec3 blended = p0;
          if (uState <= 1.0) {
            blended = mix(p0, p1, smoothstep(0.0, 1.0, uState));
          } else if (uState <= 2.0) {
            blended = mix(p1, p2, smoothstep(1.0, 2.0, uState));
          } else if (uState <= 3.0) {
            blended = mix(p2, p3, smoothstep(2.0, 3.0, uState));
          } else {
            blended = mix(p3, p4, smoothstep(3.0, 4.0, uState));
          }

          // Micro-respiration organique 3D
          float speed = 0.65;
          blended.x += sin(uTime * speed + aPhase) * 0.24;
          blended.y += cos(uTime * speed * 0.8 + aPhase * 1.3) * 0.24;
          blended.z += sin(uTime * 0.5 + aPhase * 0.7) * 0.28;

          // Répulsion / aimantation douce du curseur dans l'espace monde
          vec2 mouseWorld = uMouse * vec2(22.0, 13.0);
          vec2 diff = blended.xy - mouseWorld;
          float dist = length(diff);
          if (dist < 7.5 && dist > 0.001) {
            float force = (1.0 - dist / 7.5);
            blended.xy += normalize(diff) * force * 1.85;
            blended.z += force * 1.4;
          }

          vec4 mvPosition = modelViewMatrix * vec4(blended, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float depthAtten = 34.0 / max(1.0, -mvPosition.z);
          float twinkle = 0.78 + 0.22 * sin(uTime * 2.2 + aPhase * 3.1);
          gl_PointSize = clamp(aSize * uPixelRatio * depthAtten * twinkle * 0.92, 1.8, 64.0);

          vColor = aColor;
          vAlpha = clamp(twinkle * smoothstep(95.0, 18.0, -mvPosition.z), 0.18, 1.0);
          vFlare = aFlare;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vFlare;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float d = length(uv);
          if (d > 0.5) discard;

          // Disque brillant + halo gaussien renforcé
          float core = smoothstep(0.28, 0.0, d);
          float halo = exp(-d * 5.8) * 0.88;
          float intensity = core * 1.15 + halo;

          // Croix de diffraction stellaire pour les étoiles phares
          if (vFlare > 0.5) {
            float spikeX = exp(-abs(uv.y) * 24.0) * exp(-abs(uv.x) * 4.2);
            float spikeY = exp(-abs(uv.x) * 24.0) * exp(-abs(uv.y) * 4.2);
            intensity += (spikeX + spikeY) * 1.05;
          }

          gl_FragColor = vec4(vColor, intensity * vAlpha * 0.95);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(pGeo, particleShaderMat);
    scene.add(particleSystem);

    // ------------------------------------------------------------------------
    // 3. INTERACTION SOURIS, DRAG HERO & CHORÉGRAPHIE SCROLL
    // ------------------------------------------------------------------------
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let dragRotationX = 0;
    let dragRotationY = 0;
    let isDraggingHero = false;
    let prevPointer = { x: 0, y: 0 };

    window.addEventListener(
      "mousemove",
      (e) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
        if (isDraggingHero) {
          dragRotationY += (e.clientX - prevPointer.x) * 0.005;
          dragRotationX += (e.clientY - prevPointer.y) * 0.005;
          prevPointer.x = e.clientX;
          prevPointer.y = e.clientY;
        }
      },
      { passive: true }
    );

    const heroVisual = document.getElementById("hero-3d-trigger");
    if (heroVisual) {
      heroVisual.addEventListener("mousedown", (e) => {
        isDraggingHero = true;
        prevPointer.x = e.clientX;
        prevPointer.y = e.clientY;
      });
      window.addEventListener("mouseup", () => {
        isDraggingHero = false;
      });
      heroVisual.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 1) {
            isDraggingHero = true;
            prevPointer.x = e.touches[0].clientX;
            prevPointer.y = e.touches[0].clientY;
          }
        },
        { passive: true }
      );
      heroVisual.addEventListener(
        "touchmove",
        (e) => {
          if (!isDraggingHero || e.touches.length !== 1) return;
          dragRotationY += (e.touches[0].clientX - prevPointer.x) * 0.006;
          dragRotationX += (e.touches[0].clientY - prevPointer.y) * 0.004;
          prevPointer.x = e.touches[0].clientX;
          prevPointer.y = e.touches[0].clientY;
        },
        { passive: true }
      );
      window.addEventListener("touchend", () => {
        isDraggingHero = false;
      });
    }

    // Calcul continu de l'état de morphing selon les positions DOM ou sélection manuelle
    let targetState = 0.0;
    let currentState = 0.0;
    let scrollProgress = 0.0;
    let manualState = null;

    const sceneAnchorsConfig = [
      { id: "hero", state: 0.0 },
      { id: "manifeste", state: 1.0 },
      { id: "lab", state: 2.0 },
      { id: "horizon", state: 3.1 }
    ];

    function updateScrollTargets() {
      const sy = window.scrollY;
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.max(0, Math.min(1, sy / docH));
      if (manualState !== null) {
        targetState = manualState;
        return;
      }

      const focusY = sy + window.innerHeight * 0.45;
      const anchors = sceneAnchorsConfig
        .map((cfg) => {
          const el = document.getElementById(cfg.id);
          return el ? { y: el.offsetTop, h: el.offsetHeight, state: cfg.state, id: cfg.id } : null;
        })
        .filter(Boolean);

      if (anchors.length >= 2) {
        const last = anchors[anchors.length - 1];
        if (focusY <= anchors[0].y) {
          targetState = 0.0;
        } else if (focusY >= last.y) {
          const extra = Math.min(1, Math.max(0, (focusY - last.y) / Math.max(1, last.h)));
          targetState = Math.min(4.0, last.state + extra * 0.9);
        } else {
          for (let i = 0; i < anchors.length - 1; i++) {
            if (focusY >= anchors[i].y && focusY <= anchors[i + 1].y) {
              const span = Math.max(1, anchors[i + 1].y - anchors[i].y);
              const tNorm = (focusY - anchors[i].y) / span;
              targetState = anchors[i].state + tNorm * (anchors[i + 1].state - anchors[i].state);
              break;
            }
          }
        }
      } else {
        targetState = scrollProgress * 4.0;
      }
    }
    window.addEventListener("scroll", updateScrollTargets, { passive: true });
    updateScrollTargets();

    // Sélecteur interactif des animations 3D (pilules dans Hero / Scène)
    const sceneModeButtons = document.querySelectorAll("[data-scene-state]");
    function setSceneMode(val) {
      sceneModeButtons.forEach((b) => {
        const active = b.getAttribute("data-scene-state") === val;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      if (val === "auto" || val === null) {
        manualState = null;
        updateScrollTargets();
      } else {
        const num = parseFloat(val);
        if (!Number.isNaN(num)) {
          manualState = Math.max(0, Math.min(4, num));
          targetState = manualState;
        }
      }
    }
    sceneModeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setSceneMode(btn.getAttribute("data-scene-state"));
      });
    });

    // Redimensionnement réactif
    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mob = w < 768;
      camera.aspect = w / h;
      camera.position.z = mob ? 54 : 42;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mob ? 1.5 : 2));
      renderer.setSize(w, h);
      particleShaderMat.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      updateScrollTargets();
    }
    window.addEventListener("resize", onResize);

    // ------------------------------------------------------------------------
    // 4. BOUCLE DE RENDU PRINCIPAL (60 FPS OPTIMISÉE)
    // ------------------------------------------------------------------------
    const clock = new THREE.Clock();
    let rafId = null;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = prefersReducedMotion ? 0 : clock.getElapsedTime();

      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      currentState += (targetState - currentState) * 0.055;

      // Visibilité du Noyau Hero (s'efface élégamment dès qu'on passe vers Q↗ / états suivants)
      const heroFade = Math.max(0, Math.min(1, 1 - currentState * 1.25));
      const mob = window.innerWidth < 1080;

      // Position du noyau : cadré dans la fenêtre 3D supérieure droite au-dessus du dock Hero
      const targetCoreX = mob ? 0 : Math.min(10.0, camera.aspect * 5.2) - currentState * 14.0;
      const targetCoreY = mob ? -1.8 : 3.2 + Math.sin(t * 0.7) * 0.35;
      coreGroup.position.x += (targetCoreX - coreGroup.position.x) * 0.08;
      coreGroup.position.y += (targetCoreY - coreGroup.position.y) * 0.08;
      coreGroup.position.z = -currentState * 10.0;

      const scaleFactor = (mob ? 0.58 : 0.86) * (0.45 + 0.55 * heroFade);
      coreGroup.scale.setScalar(scaleFactor);
      coreGroup.visible = heroFade > 0.015;

      if (coreGroup.visible) {
        coreShaderMat.uniforms.uTime.value = t;
        coreShaderMat.uniforms.uOpacity.value = heroFade;
        wireMat.opacity = 0.24 * heroFade;
        goldWireMat.opacity = 0.22 * heroFade;
        arrowMat.opacity = 0.88 * heroFade;
        fiberMat.opacity = 0.24 * heroFade;
        pulseMat.opacity = 0.95 * heroFade;

        coreGroup.rotation.y = t * 0.16 + dragRotationY + mouse.x * 0.22;
        coreGroup.rotation.x = Math.sin(t * 0.12) * 0.12 + dragRotationX - mouse.y * 0.16;

        wireMesh.rotation.y = -t * 0.12;
        goldWireMesh.rotation.z = t * 0.09;
        arrowGroup.position.y = 5.0 + Math.sin(t * 1.4) * 0.35;

        rings.forEach((r) => {
          r.group.rotation.z += r.speed * 0.012;
          r.ringMat.opacity = r.baseOpacity * heroFade;
        });

        pulses.forEach((p) => {
          p.offset = (p.offset + p.speed * 0.008) % 1;
          const pt = p.curve.getPointAt(p.offset);
          p.mesh.position.copy(pt);
        });
      }

      // Mise à jour du champ de particules GPU + cadrage panoramique par acte
      particleShaderMat.uniforms.uTime.value = t;
      particleShaderMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
      particleShaderMat.uniforms.uState.value = currentState;

      const qFocus = Math.max(0, 1 - Math.abs(currentState - 1.0) * 1.15);
      const sevenFocus = Math.max(0, 1 - Math.abs(currentState - 3.0));
      const inHeroManualShowcase = !mob && manualState !== null && window.scrollY < 480;
      const targetSysX = mob
        ? 0
        : inHeroManualShowcase
          ? Math.min(9.5, camera.aspect * 5.0)
          : qFocus * Math.min(8.5, camera.aspect * 4.6) + (sevenFocus * 0.0);
      const targetSysY = mob ? 0 : inHeroManualShowcase ? 2.2 : 0;
      const targetSysScale = inHeroManualShowcase ? 0.78 : 1.0;

      particleSystem.position.x += (targetSysX - particleSystem.position.x) * 0.07;
      particleSystem.position.y += (targetSysY - particleSystem.position.y) * 0.07;
      particleSystem.scale.setScalar(
        particleSystem.scale.x + (targetSysScale - particleSystem.scale.x) * 0.07
      );

      particleSystem.rotation.y =
        mouse.x * 0.12 +
        Math.sin(t * (0.28 + qFocus * 0.22)) * (0.14 + qFocus * 0.14) +
        dragRotationY * 0.35;
      particleSystem.rotation.x = -mouse.y * 0.07 + dragRotationX * 0.25;

      camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.9 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    return {
      setSceneMode,
      destroy: () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", updateScrollTargets);
        renderer.dispose();
      }
    };
  }

  global.initQuantisMasterScene = initQuantisMasterScene;
})(window);
