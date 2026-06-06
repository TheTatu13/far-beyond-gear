import { useEffect, useRef } from "react";

if (!document.querySelector('link[href*="DM+Mono"]')) {
  const link = document.createElement("link");
  link.rel  = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}

export default function BabylonFaceHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let engine;
    const cleanups = [];

    const loadScript = (src) =>
      new Promise((resolve) => {
        if (window.BABYLON) { resolve(); return; }
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) { existing.addEventListener("load", resolve); return; }
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
      });

    const init = async () => {
      await loadScript("https://cdn.babylonjs.com/babylon.js");
      const B = window.BABYLON;

      // ── Engine ─────────────────────────────────────────────────────────────
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      engine = new B.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
      });
      const scene = new B.Scene(engine);
      scene.clearColor = new B.Color4(0.027, 0.031, 0.047, 1);

      // ── Camera (fixed front view, no user orbit) ────────────────────────────
      const camera = new B.ArcRotateCamera(
        "cam", -Math.PI / 2, Math.PI / 2, 4.8, new B.Vector3(0, -0.1, 0), scene
      );
      camera.lowerRadiusLimit = 4.8;
      camera.upperRadiusLimit = 4.8;
      // attachControl intentionally omitted

      // ── Lights ─────────────────────────────────────────────────────────────
      const hemi = new B.HemisphericLight("hemi", new B.Vector3(0, 1, 0), scene);
      hemi.intensity   = 0.10;
      hemi.diffuse     = new B.Color3(0.5, 0.6, 1.0);
      hemi.groundColor = new B.Color3(0, 0, 0.08);

      const uplift = new B.PointLight("uplift", new B.Vector3(0, -2.4, 2.0), scene);
      uplift.diffuse   = new B.Color3(0.65, 1.0, 1.0);
      uplift.intensity = 0.8;

      const rimLight = new B.PointLight("rim", new B.Vector3(-2, 0.5, -1), scene);
      rimLight.diffuse   = new B.Color3(0.3, 0.4, 1.0);
      rimLight.intensity = 0.35;

      // ── Shared wireframe material ───────────────────────────────────────────
      const wireMat = new B.StandardMaterial("wire", scene);
      wireMat.wireframe      = true;
      wireMat.emissiveColor  = new B.Color3(0.784, 0.784, 1.0); // #c8c8ff

      // ── Head root — all meshes parented here for unified rotation ───────────
      const headRoot = new B.TransformNode("headRoot", scene);

      const wm = (mesh) => {
        mesh.material = wireMat;
        mesh.parent   = headRoot;
        return mesh;
      };

      // ══════════════════════════════════════════════════════════════════════
      //  CRANIUM — flattened sphere
      // ══════════════════════════════════════════════════════════════════════
      const cranium = B.MeshBuilder.CreateSphere("cranium", {
        diameterX:    1.8,
        diameterY:    2.2,
        diameterZ:    1.9,
        segments:     8,
      }, scene);
      cranium.position.y = 0.15;
      wm(cranium);

      // ══════════════════════════════════════════════════════════════════════
      //  CHEEKBONES — two flattened spheres
      // ══════════════════════════════════════════════════════════════════════
      const lCheek = B.MeshBuilder.CreateSphere("lCheek", {
        diameterX: 0.6,
        diameterY: 0.32,
        diameterZ: 0.28,
        segments:  5,
      }, scene);
      lCheek.position = new B.Vector3(-0.7, 0.1, 0.7);
      wm(lCheek);

      const rCheek = B.MeshBuilder.CreateSphere("rCheek", {
        diameterX: 0.6,
        diameterY: 0.32,
        diameterZ: 0.28,
        segments:  5,
      }, scene);
      rCheek.position = new B.Vector3(0.7, 0.1, 0.7);
      wm(rCheek);

      // ══════════════════════════════════════════════════════════════════════
      //  JAW — truncated hexagonal cylinder
      // ══════════════════════════════════════════════════════════════════════
      const jaw = B.MeshBuilder.CreateCylinder("jaw", {
        diameterTop:    1.1,
        diameterBottom: 0.60,
        height:         0.8,
        tessellation:   6,
      }, scene);
      jaw.position = new B.Vector3(0, -0.88, 0);
      wm(jaw);

      // ══════════════════════════════════════════════════════════════════════
      //  NOSE — tapered cone, rotated to face forward
      // ══════════════════════════════════════════════════════════════════════
      const nose = B.MeshBuilder.CreateCylinder("nose", {
        diameterTop:    0.05,
        diameterBottom: 0.18,
        height:         0.45,
        tessellation:   7,
      }, scene);
      // Rotate so the cylinder points toward viewer (+Z), tip pointing slightly down
      nose.rotation.x = -(Math.PI / 2) + 0.22;
      nose.position   = new B.Vector3(0, 0.06, 0.88);
      wm(nose);

      // ══════════════════════════════════════════════════════════════════════
      //  EYE SOCKETS — torus rings, rotated to face viewer
      // ══════════════════════════════════════════════════════════════════════
      const leftSocket = B.MeshBuilder.CreateTorus("leftSocket", {
        diameter:     0.28,
        thickness:    0.04,
        tessellation: 22,
      }, scene);
      // Default torus lies in XZ plane; rotate X by 90° so ring faces viewer
      leftSocket.rotation.x = Math.PI / 2;
      leftSocket.position   = new B.Vector3(-0.32, 0.28, 0.88);
      wm(leftSocket);

      const rightSocket = B.MeshBuilder.CreateTorus("rightSocket", {
        diameter:     0.28,
        thickness:    0.04,
        tessellation: 22,
      }, scene);
      rightSocket.rotation.x = Math.PI / 2;
      rightSocket.position   = new B.Vector3(0.32, 0.28, 0.88);
      wm(rightSocket);

      // ══════════════════════════════════════════════════════════════════════
      //  SUNGLASSES — LEFT lens (red, laser origin) + RIGHT lens (blue-white)
      // ══════════════════════════════════════════════════════════════════════
      const leftLens = B.MeshBuilder.CreateBox("leftLens", {
        width:  0.38,
        height: 0.14,
        depth:  0.02,
      }, scene);
      leftLens.position = new B.Vector3(-0.32, 0.28, 0.92);
      const leftLensMat = new B.StandardMaterial("leftLensMat", scene);
      leftLensMat.wireframe      = true;
      leftLensMat.emissiveColor  = new B.Color3(1.0, 0.1, 0.08);
      leftLensMat.alpha          = 0.88;
      leftLens.material  = leftLensMat;
      leftLens.parent    = headRoot;

      const rightLens = B.MeshBuilder.CreateBox("rightLens", {
        width:  0.38,
        height: 0.14,
        depth:  0.02,
      }, scene);
      rightLens.position = new B.Vector3(0.32, 0.28, 0.92);
      const rightLensMat = new B.StandardMaterial("rightLensMat", scene);
      rightLensMat.wireframe     = true;
      rightLensMat.emissiveColor = new B.Color3(0.05, 0.05, 0.05);
      rightLensMat.alpha         = 0.55;
      rightLens.material = rightLensMat;
      rightLens.parent   = headRoot;

      // Glasses bridge
      const bridge = B.MeshBuilder.CreateBox("bridge", { width: 0.12, height: 0.025, depth: 0.015 }, scene);
      bridge.position = new B.Vector3(0, 0.28, 0.925);
      wm(bridge);

      // Temple arms
      const templeL = B.MeshBuilder.CreateBox("templeL", { width: 0.52, height: 0.018, depth: 0.012 }, scene);
      templeL.position = new B.Vector3(-0.72, 0.28, 0.72);
      templeL.rotation.y = 0.30;
      wm(templeL);
      const templeR = B.MeshBuilder.CreateBox("templeR", { width: 0.52, height: 0.018, depth: 0.012 }, scene);
      templeR.position = new B.Vector3(0.72, 0.28, 0.72);
      templeR.rotation.y = -0.30;
      wm(templeR);

      // ══════════════════════════════════════════════════════════════════════
      //  MOUTH — flattened torus
      // ══════════════════════════════════════════════════════════════════════
      const mouth = B.MeshBuilder.CreateTorus("mouth", {
        diameter:     0.28,
        thickness:    0.032,
        tessellation: 24,
      }, scene);
      mouth.rotation.x = Math.PI / 2;
      mouth.scaling.z  = 0.30; // flatten: wide ellipse = closed lips
      mouth.position   = new B.Vector3(0, -0.23, 0.92);
      wm(mouth);

      // ══════════════════════════════════════════════════════════════════════
      //  HAIR — three swept-back wireframe blocks
      // ══════════════════════════════════════════════════════════════════════
      const hairMain = B.MeshBuilder.CreateBox("hairMain", { width: 1.6, height: 0.30, depth: 1.4 }, scene);
      hairMain.position = new B.Vector3(0, 1.0, -0.1);
      wm(hairMain);

      const hairSweep = B.MeshBuilder.CreateBox("hairSweep", { width: 1.4, height: 0.50, depth: 0.6 }, scene);
      hairSweep.position = new B.Vector3(0, 0.72, -0.82);
      hairSweep.rotation.x = 0.20;
      wm(hairSweep);

      const hairFront = B.MeshBuilder.CreateBox("hairFront", { width: 1.55, height: 0.18, depth: 0.55 }, scene);
      hairFront.position = new B.Vector3(0, 1.18, 0.28);
      hairFront.rotation.x = -0.08;
      wm(hairFront);

      // ══════════════════════════════════════════════════════════════════════
      //  NECK
      // ══════════════════════════════════════════════════════════════════════
      const neck = B.MeshBuilder.CreateCylinder("neck", {
        diameter:    0.55,
        height:      0.60,
        tessellation: 8,
      }, scene);
      neck.position = new B.Vector3(0, -1.58, 0);
      wm(neck);

      // Brow ridges
      const browL = B.MeshBuilder.CreateBox("browL", { width: 0.34, height: 0.055, depth: 0.065 }, scene);
      browL.position = new B.Vector3(-0.30, 0.48, 0.84);
      browL.rotation.z = -0.15;
      wm(browL);
      const browR = B.MeshBuilder.CreateBox("browR", { width: 0.34, height: 0.055, depth: 0.065 }, scene);
      browR.position = new B.Vector3(0.30, 0.48, 0.84);
      browR.rotation.z = 0.15;
      wm(browR);

      // ══════════════════════════════════════════════════════════════════════
      //  LASER BEAM — updatable line from left lens toward cursor
      // ══════════════════════════════════════════════════════════════════════
      let laser = B.MeshBuilder.CreateLines("laser", {
        points:    [B.Vector3.Zero(), new B.Vector3(0, 0, 1)],
        updatable: true,
      }, scene);
      laser.color = new B.Color3(1, 0, 0);
      laser.alpha = 0.92;

      // ── Glow layer ─────────────────────────────────────────────────────────
      const glow = new B.GlowLayer("glow", scene);
      glow.intensity = 1.5;
      glow.addIncludedOnlyMesh(laser);
      glow.addIncludedOnlyMesh(leftLens);

      // ══════════════════════════════════════════════════════════════════════
      //  EMBER PARTICLES
      // ══════════════════════════════════════════════════════════════════════
      const ps = new B.ParticleSystem("embers", 40, scene);
      ps.particleTexture = new B.Texture("https://assets.babylonjs.com/textures/flare.png", scene);
      ps.emitter       = new B.Vector3(0, -4.5, 0);
      ps.minEmitBox    = new B.Vector3(-4.5, 0, -1.5);
      ps.maxEmitBox    = new B.Vector3( 4.5, 0,  1.5);
      ps.color1        = new B.Color4(1.0,  0.38, 0.05, 0.9);
      ps.color2        = new B.Color4(0.85, 0.12, 0.00, 0.35);
      ps.colorDead     = new B.Color4(0.12, 0.03, 0.00, 0.0);
      ps.minSize       = 0.012;
      ps.maxSize       = 0.052;
      ps.minLifeTime   = 4;
      ps.maxLifeTime   = 9;
      ps.emitRate      = 5;
      ps.gravity       = new B.Vector3(0, 0.22, 0);
      ps.direction1    = new B.Vector3(-0.12, 1,  0.08);
      ps.direction2    = new B.Vector3( 0.12, 1, -0.08);
      ps.minEmitPower  = 0.06;
      ps.maxEmitPower  = 0.22;
      ps.updateSpeed   = 0.007;
      ps.start();

      // ══════════════════════════════════════════════════════════════════════
      //  CURSOR TRACKING
      // ══════════════════════════════════════════════════════════════════════
      let mouseX = canvas.offsetWidth  / 2;
      let mouseY = canvas.offsetHeight / 2;

      scene.onPointerObservable.add((info) => {
        if (info.type === B.PointerEventTypes.POINTERMOVE) {
          mouseX = info.event.clientX;
          mouseY = info.event.clientY;
        }
      });

      // ══════════════════════════════════════════════════════════════════════
      //  EXPRESSIONS  (click cycles through 4 states)
      // ══════════════════════════════════════════════════════════════════════
      // jaw.position.y, leftSocket/rightSocket scaling.z (squint), mouth.scaling.z, headRoot.rotation
      let exprIdx = 0;
      const EXPRS = [
        // 0 neutral
        { jawY: -0.88, socketSqZ: 1.00, mouthSqZ: 0.30, tiltZ:  0.000, tiltX:  0.000 },
        // 1 intense — jaw forward, squint, slight tilt
        { jawY: -0.84, socketSqZ: 0.48, mouthSqZ: 0.22, tiltZ:  0.053, tiltX:  0.035 },
        // 2 singing — jaw drops, mouth opens wide
        { jawY: -1.10, socketSqZ: 1.00, mouthSqZ: 1.05, tiltZ:  0.000, tiltX: -0.060 },
        // 3 cold — eyes nearly shut, perfectly still
        { jawY: -0.88, socketSqZ: 0.18, mouthSqZ: 0.20, tiltZ:  0.000, tiltX:  0.000 },
      ];

      const animProp = (target, prop, toVal, frames = 22) => {
        const keys  = prop.split(".");
        const from  = keys.reduce((o, k) => o[k], target);
        const anim  = new B.Animation(
          `${target.name}_${prop}_${Date.now()}`, prop, 60,
          B.Animation.ANIMATIONTYPE_FLOAT,
          B.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        const ease = new B.CubicEase();
        ease.setEasingMode(B.EasingFunction.EASINGMODE_EASEOUT);
        anim.setEasingFunction(ease);
        anim.setKeys([{ frame: 0, value: from }, { frame: frames, value: toVal }]);
        target.animations = [anim];
        scene.beginAnimation(target, 0, frames, false);
      };

      const handleClick = () => {
        exprIdx = (exprIdx + 1) % 4;
        const e = EXPRS[exprIdx];
        animProp(jaw,         "position.y",  e.jawY);
        animProp(leftSocket,  "scaling.z",   e.socketSqZ);
        animProp(rightSocket, "scaling.z",   e.socketSqZ);
        animProp(mouth,       "scaling.z",   e.mouthSqZ);
        animProp(headRoot,    "rotation.z",  e.tiltZ);
        animProp(headRoot,    "rotation.x",  e.tiltX);
      };
      canvas.addEventListener("click", handleClick);
      cleanups.push(() => canvas.removeEventListener("click", handleClick));

      // ══════════════════════════════════════════════════════════════════════
      //  RENDER LOOP
      // ══════════════════════════════════════════════════════════════════════
      engine.runRenderLoop(() => {
        const rect = canvas.getBoundingClientRect();
        const nx   = (mouseX - rect.left) / rect.width  - 0.5; // -0.5 … +0.5
        const ny   = (mouseY - rect.top ) / rect.height - 0.5;

        // Smooth rotation toward cursor
        headRoot.rotation.y += ( nx *  0.70 - headRoot.rotation.y) * 0.05;
        headRoot.rotation.x += ( ny *  0.38 - headRoot.rotation.x) * 0.05;

        // Laser: world position of left lens → projected cursor
        leftLens.computeWorldMatrix(true);
        const lensPos    = leftLens.getAbsolutePosition().clone();
        const cursorWorld = new B.Vector3(nx * 5.5, -ny * 4.2, 1.6);

        laser = B.MeshBuilder.CreateLines("laser", {
          points:   [lensPos, cursorWorld],
          instance: laser,
        }, scene);

        // Laser flicker
        const t      = Date.now() * 0.013;
        const flick  = 0.70 + 0.30 * Math.sin(t) * Math.cos(t * 0.71);
        laser.alpha              = flick;
        leftLensMat.emissiveColor = new B.Color3(flick, flick * 0.08, flick * 0.06);

        scene.render();
      });

      // ── Resize ─────────────────────────────────────────────────────────────
      const onResize = () => {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        engine.resize();
      };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));
    };

    init().catch(console.error);

    return () => {
      cleanups.forEach((fn) => fn());
      if (engine) engine.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width:    "100%",
        height:   "clamp(480px, 72vh, 780px)",
        background: "#07080c",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width:   "100%",
          height:  "100%",
          display: "block",
          outline: "none",
          cursor:  "crosshair",
        }}
      />

      <div
        style={{
          position:      "absolute",
          top:           "18px",
          right:         "22px",
          fontFamily:    "'DM Mono', monospace",
          fontSize:      "11px",
          color:         "rgba(200,200,255,0.25)",
          letterSpacing: "0.14em",
          userSelect:    "none",
          pointerEvents: "none",
        }}
      >
        CLICK TO CYCLE EXPRESSION
      </div>

      <div
        style={{
          position:      "absolute",
          bottom:        "clamp(20px, 4vh, 44px)",
          left:          0,
          right:         0,
          textAlign:     "center",
          fontFamily:    "'DM Mono', 'Courier New', monospace",
          letterSpacing: "0.20em",
          color:         "#c8c8ff",
          fontSize:      "clamp(13px, 2vw, 18px)",
          textTransform: "uppercase",
          userSelect:    "none",
          pointerEvents: "none",
          textShadow:    "0 0 24px rgba(150,150,255,0.35)",
        }}
      >
        BUILT FOR THOSE WHO PLAY LOUD
      </div>
    </div>
  );
}
