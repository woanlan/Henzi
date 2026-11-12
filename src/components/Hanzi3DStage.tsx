"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Volume2,
  RotateCw,
  Pause,
  Play,
  Sparkles,
  PenTool,
  Move3d,
} from "lucide-react";

export interface HanziCubeFace {
  char: string;
  pinyin: string;
  hanViet: string;
  meaning: string;
  exampleZh: string;
  exampleVi: string;
  level: string;
  targetRot: { x: number; y: number };
}

const CUBE_FACES: HanziCubeFace[] = [
  {
    char: "好",
    pinyin: "hǎo",
    hanViet: "HẢO",
    meaning: "Tốt đẹp, Thích, Khỏe",
    exampleZh: "你好，很高兴认识你！",
    exampleVi: "Xin chào, rất vui được làm quen với bạn!",
    level: "HSK 1",
    targetRot: { x: 0, y: -Math.PI / 2 },
  },
  {
    char: "爱",
    pinyin: "ài",
    hanViet: "ÁI",
    meaning: "Yêu thương, Đam mê",
    exampleZh: "我爱学习汉语。",
    exampleVi: "Tôi yêu thích việc học tiếng Hán.",
    level: "HSK 1",
    targetRot: { x: 0, y: Math.PI / 2 },
  },
  {
    char: "福",
    pinyin: "fú",
    hanViet: "PHÚC",
    meaning: "Phúc lộc, May mắn",
    exampleZh: "祝你幸福安康！",
    exampleVi: "Chúc bạn hạnh phúc và bình an!",
    level: "HSK 3",
    targetRot: { x: Math.PI / 2, y: 0 },
  },
  {
    char: "道",
    pinyin: "dào",
    hanViet: "ĐẠO",
    meaning: "Con đường, Đạo lý",
    exampleZh: "我知道这个道理。",
    exampleVi: "Tôi hiểu rõ đạo lý này.",
    level: "HSK 2",
    targetRot: { x: -Math.PI / 2, y: 0 },
  },
  {
    char: "学",
    pinyin: "xué",
    hanViet: "HỌC",
    meaning: "Học tập, Nghiên cứu",
    exampleZh: "好好学习，天天向上。",
    exampleVi: "Học tập tốt, ngày ngày tiến bộ.",
    level: "HSK 1",
    targetRot: { x: 0, y: 0 },
  },
  {
    char: "书",
    pinyin: "shū",
    hanViet: "THƯ",
    meaning: "Sách vở, Thư pháp",
    exampleZh: "每天看书三十分钟。",
    exampleVi: "Mỗi ngày đọc sách 30 phút.",
    level: "HSK 1",
    targetRot: { x: 0, y: Math.PI },
  },
];

const INITIAL_FACE_INDEX = 4;

function createHanziFaceTexture(face: HanziCubeFace): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 30, size / 2, size / 2, size * 0.72);
    grad.addColorStop(0, "#292018");
    grad.addColorStop(0.65, "#171412");
    grad.addColorStop(1, "#0C0A09");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, size - 40, size - 40);

    ctx.strokeStyle = "rgba(251, 191, 36, 0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, size - 72, size - 72);

    ctx.save();
    ctx.strokeStyle = "rgba(245, 158, 11, 0.16)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(size / 2, 42);
    ctx.lineTo(size / 2, size - 42);
    ctx.moveTo(42, size / 2);
    ctx.lineTo(size - 42, size / 2);
    ctx.moveTo(42, 42);
    ctx.lineTo(size - 42, size - 42);
    ctx.moveTo(size - 42, 42);
    ctx.lineTo(42, size - 42);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "rgba(245, 158, 11, 0.18)";
    ctx.fillRect(54, 52, 110, 38);
    ctx.fillStyle = "#FCD34D";
    ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(face.level, 68, 71);

    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(face.hanViet, size - 58, 71);

    ctx.fillStyle = "#FFFBEB";
    ctx.shadowColor = "rgba(245, 158, 11, 0.45)";
    ctx.shadowBlur = 24;
    ctx.font = 'bold 215px "Noto Serif SC", "Songti SC", "Microsoft YaHei", serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(face.char, size / 2, size / 2 - 6);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 40px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText(face.pinyin, size / 2, size - 78);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function shortestAngleDiff(target: number, current: number): number {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

function speakMandarin(text: string, customHandler?: (zh: string) => void) {
  if (customHandler) {
    customHandler(text);
    return;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }
}

interface Hanzi3DStageProps {
  ctaHref?: string;
  ctaLabel?: string;
  onSpeakText?: (zh: string) => void;
}

/**
 * Interactive Three.js 3D WebGL Hanzi Cube stage paired with a 3D flippable detail card.
 */
export default function Hanzi3DStage({
  ctaHref = "/writing",
  ctaLabel = "Tập Viết Nét",
  onSpeakText,
}: Hanzi3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectFaceRef = useRef<(index: number, shouldSpeak?: boolean) => void>(() => {});
  const autoSpinRef = useRef(true);
  const onSpeakRef = useRef(onSpeakText);

  const [activeIndex, setActiveIndex] = useState<number>(INITIAL_FACE_INDEX);
  const [autoSpin, setAutoSpin] = useState<boolean>(true);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [webglReady, setWebglReady] = useState<boolean>(true);

  const activeFace = CUBE_FACES[activeIndex];

  useEffect(() => {
    onSpeakRef.current = onSpeakText;
  }, [onSpeakText]);

  const speakChinese = (text: string) => {
    speakMandarin(text, onSpeakRef.current);
  };

  useEffect(() => {
    autoSpinRef.current = autoSpin;
  }, [autoSpin]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    THREE.ColorManagement.enabled = true;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      const rafId = requestAnimationFrame(() => setWebglReady(false));
      return () => cancelAnimationFrame(rafId);
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const initWidth = container.clientWidth || 360;
    const initHeight = container.clientHeight || 290;
    renderer.setSize(initWidth, initHeight);
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute(
      "aria-label",
      "Mô hình khối Hán tự 3D tương tác. Kéo để xoay 360 độ hoặc chạm vào mặt chữ để nghe phát âm."
    );
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initWidth / initHeight, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(0, 0.2, 4.35);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xfffbeb, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfde68a, 2.1);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const textures = CUBE_FACES.map((face) => createHanziFaceTexture(face));
    const faceMaterials = textures.map(
      (map) =>
        new THREE.MeshStandardMaterial({
          map,
          roughness: 0.34,
          metalness: 0.18,
        })
    );

    const cubeGeo = new THREE.BoxGeometry(1.72, 1.72, 1.72);
    const cubeMesh = new THREE.Mesh(cubeGeo, faceMaterials);
    cubeGroup.add(cubeMesh);

    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.65,
    });
    const edgesLine = new THREE.LineSegments(edgesGeo, edgesMat);
    edgesLine.scale.setScalar(1.005);
    cubeGroup.add(edgesLine);

    const ringGeo = new THREE.TorusGeometry(1.58, 0.018, 12, 72);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.85,
    });
    const ringOuter = new THREE.Mesh(ringGeo, ringMat);
    ringOuter.rotation.x = Math.PI * 0.36;
    ringOuter.rotation.y = Math.PI * 0.15;
    scene.add(ringOuter);

    const ringInnerGeo = new THREE.TorusGeometry(1.36, 0.012, 10, 64);
    const ringInnerMat = new THREE.MeshBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.45,
    });
    const ringInner = new THREE.Mesh(ringInnerGeo, ringInnerMat);
    ringInner.rotation.x = -Math.PI * 0.32;
    ringInner.rotation.z = Math.PI * 0.2;
    scene.add(ringInner);

    const PARTICLE_COUNT = 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 2.0 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      particlePos[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.032,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.75;

    let snapTarget: { x: number; y: number } | null = null;
    let isDragging = false;
    const pointerDownPos = { x: 0, y: 0 };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-99, -99);

    const updateMouseNDC = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      snapTarget = null;
      pointerDownPos.x = e.clientX;
      pointerDownPos.y = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateMouseNDC(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      mouse.set(-99, -99);
      renderer.domElement.style.cursor = "grab";
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist < 6) {
        updateMouseNDC(e.clientX, e.clientY);
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(cubeMesh, false);
        if (hits.length > 0 && hits[0].face && typeof hits[0].face.materialIndex === "number") {
          const faceIdx = hits[0].face.materialIndex;
          if (faceIdx >= 0 && faceIdx < CUBE_FACES.length) {
            selectFaceRef.current(faceIdx, true);
          }
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerup", handlePointerUp);

    selectFaceRef.current = (index: number, shouldSpeak = true) => {
      const targetFace = CUBE_FACES[index];
      if (!targetFace) return;
      setActiveIndex(index);
      setCardFlipped(false);
      setAutoSpin(false);
      autoSpinRef.current = false;
      snapTarget = { ...targetFace.targetRot };
      if (shouldSpeak) {
        speakMandarin(`${targetFace.char}，${targetFace.exampleZh}`, onSpeakRef.current);
      }
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let noMotion = mq.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      noMotion = e.matches;
    };
    mq.addEventListener("change", handleMotionChange);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    ro.observe(container);

    const timer = new THREE.Timer();
    timer.connect(document);

    const animate = (timestamp: number) => {
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.05);
      const elapsed = timer.getElapsed();

      if (snapTarget) {
        cubeGroup.rotation.x += shortestAngleDiff(snapTarget.x, cubeGroup.rotation.x) * 0.12;
        cubeGroup.rotation.y += shortestAngleDiff(snapTarget.y, cubeGroup.rotation.y) * 0.12;
        cubeGroup.rotation.z += shortestAngleDiff(0, cubeGroup.rotation.z) * 0.12;
        camera.position.lerp(defaultCamPos, 0.08);
        controls.target.set(0, 0, 0);

        const done =
          Math.abs(shortestAngleDiff(snapTarget.x, cubeGroup.rotation.x)) < 0.01 &&
          Math.abs(shortestAngleDiff(snapTarget.y, cubeGroup.rotation.y)) < 0.01 &&
          camera.position.distanceTo(defaultCamPos) < 0.04;
        if (done) {
          cubeGroup.rotation.set(snapTarget.x, snapTarget.y, 0);
          snapTarget = null;
        }
      } else if (!noMotion && autoSpinRef.current && !isDragging) {
        cubeGroup.rotation.y += dt * 0.42;
        cubeGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.16;
      }

      if (!noMotion) {
        cubeGroup.position.y = Math.sin(elapsed * 1.4) * 0.06;
        ringOuter.rotation.z += dt * 0.25;
        ringInner.rotation.y -= dt * 0.32;
        particles.rotation.y += dt * 0.06;
      }

      if (mouse.x >= -1 && mouse.x <= 1) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(cubeMesh, false);
        renderer.domElement.style.cursor = isDragging
          ? "grabbing"
          : hits.length > 0
          ? "pointer"
          : "grab";
      }

      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    const handleVisibility = () => {
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        renderer.setAnimationLoop(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      mq.removeEventListener("change", handleMotionChange);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerup", handlePointerUp);
      renderer.setAnimationLoop(null);
      controls.dispose();
      cubeGeo.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringInnerGeo.dispose();
      ringInnerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      textures.forEach((t) => t.dispose());
      faceMaterials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden text-left">
      <div className="relative bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 pt-4 px-4 pb-3 overflow-hidden">
        <div className="flex items-center justify-between text-[11px] font-bold z-10 relative">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-amber-300">
            <Move3d className="w-3.5 h-3.5" />
            <span>Kéo xoay 3D • Chạm chữ nghe âm</span>
          </span>

          <button
            type="button"
            onClick={() => setAutoSpin((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15 transition-colors cursor-pointer"
            title={autoSpin ? "Tạm dừng tự xoay" : "Tiếp tục tự xoay 3D"}
          >
            {autoSpin ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{autoSpin ? "Đang xoay" : "Tự xoay"}</span>
          </button>
        </div>

        {webglReady ? (
          <div ref={containerRef} className="w-full h-[250px] sm:h-[270px] relative z-0 touch-pan-y" />
        ) : (
          <div className="w-full h-[240px] flex flex-col items-center justify-center text-amber-200 space-y-2">
            <div className="font-hanzi text-7xl font-black text-amber-400">{activeFace.char}</div>
            <div className="font-mono text-sm font-bold">{activeFace.pinyin}</div>
          </div>
        )}

        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-white/10 relative z-10">
          {CUBE_FACES.map((face, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={face.char}
                type="button"
                onClick={() => selectFaceRef.current(idx, true)}
                className={`flex-1 py-1.5 rounded-xl font-hanzi text-base font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 scale-105"
                    : "bg-white/10 text-stone-200 hover:bg-white/20"
                }`}
                title={`Chọn chữ ${face.char} (${face.pinyin})`}
              >
                {face.char}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div
          onClick={() => setCardFlipped((prev) => !prev)}
          className="perspective-1000 cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCardFlipped((prev) => !prev);
            }
          }}
          aria-label="Lật thẻ chi tiết chữ Hán 3D"
        >
          <div
            className={`relative min-h-[118px] transition-transform duration-500 preserve-3d ${
              cardFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="backface-hidden rounded-2xl bg-stone-50 border border-stone-200/90 hover:border-amber-400 p-4 flex items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-hanzi text-4xl font-black flex items-center justify-center shadow-sm shrink-0">
                  {activeFace.char}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-800 text-base">
                      {activeFace.pinyin}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                      {activeFace.level}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {activeFace.meaning}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Âm Hán Việt: <b className="text-amber-700">{activeFace.hanViet}</b>
                  </div>
                </div>
              </div>
              <RotateCw className="w-4 h-4 text-stone-400 shrink-0" />
            </div>

            <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-2xl bg-amber-50/90 border border-amber-300 p-4 flex flex-col justify-center space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                <span>Ví dụ thực tế ({activeFace.char})</span>
                <RotateCw className="w-3.5 h-3.5" />
              </div>
              <p className="font-hanzi text-sm font-bold text-stone-900">
                {activeFace.exampleZh}
              </p>
              <p className="text-xs text-stone-600 italic">{activeFace.exampleVi}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => speakChinese(`${activeFace.char}，${activeFace.exampleZh}`)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Nghe Phát Âm</span>
          </button>

          <Link
            href={ctaHref}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <PenTool className="w-4 h-4 text-amber-400" />
            <span>{ctaLabel}</span>
          </Link>
        </div>

        <div className="p-2.5 bg-amber-50/70 rounded-xl text-[11px] text-amber-900 border border-amber-200/60 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Hệ thống tự động đồng bộ tiến độ ôn tập vào hàng đợi lặp lại ngắt quãng SM-2 của bạn.</span>
        </div>
      </div>
    </div>
  );
}
