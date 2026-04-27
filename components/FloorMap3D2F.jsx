import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ROOMS = [
  // Bottom row — Left wing offices & services
  { id: "2f-2", name: "Dean's Office 1", number: "SBH-2F-DEAN1", category: "Office", x: 70, z: 450, w: 100, d: 80, amenities: ["Workstations", "Air Conditioning"] },
  { id: "2f-3", name: "Dean's Office 2", number: "SBH-2F-DEAN2", category: "Office", x: 166, z: 550, w: 100, d: 70, amenities: ["Workstations", "Air Conditioning"] },
  { id: "2f-4", name: "Conference Room", number: "SBH-2F-CONF", category: "Conference Room", capacity: 20, x: 278, z: 510, w: 100, d: 80, amenities: ["Projector", "Whiteboard", "Air Conditioning"] },
  { id: "2f-5", name: "Printing Room", number: "SBH-2F-PRINT", category: "Printing", x: 420, z: 470, w: 80, d: 70, amenities: ["Printers", "Photocopier"] },
  { id: "2f-6", name: "Pantry", number: "SBH-2F-PANTRY", category: "Pantry", x: 376, z: 510, w: 70, d: 60, amenities: ["Microwave", "Refrigerator", "Sink"] },
  { id: "2f-7", name: "Library", number: "SBH-2F-LIB", category: "Library", capacity: 60, x: 650, z: 460, w: 280, d: 120, amenities: ["Study Tables", "Bookshelves", "Air Conditioning", "Wi-Fi"] },
  { id: "2f-8", name: "Clinic", number: "SBH-2F-CLINIC", category: "Clinic", x: 1000, z: 440, w: 140, d: 90, amenities: ["Medical Supplies", "Beds", "First Aid"] },
  { id: "2f-9", name: "IT Room", number: "SBH-2F-IT", category: "Facilities", x: 1130, z: 420, w: 90, d: 80, amenities: ["Servers", "Networking Equipment"] },
  { id: "2f-10", name: "Guidance Office", number: "SBH-2F-GUIDANCE", category: "Office", x: 1200, z: 510, w: 110, d: 80, amenities: ["Workstations", "Air Conditioning"] },
  { id: "2f-11", name: "Dean's Office 3", number: "SBH-2F-DEAN3", category: "Office", x: 1330, z: 470, w: 100, d: 80, amenities: ["Workstations", "Air Conditioning"] },
  { id: "2f-12", name: "Faculty Room", number: "SBH-2F-FACULTY", category: "Faculty Room", capacity: 30, x: 1450, z: 430, w: 130, d: 100, amenities: ["Workstations", "Lockers", "Air Conditioning"] },
  // Top row — Restrooms, Computer Lab
  { id: "2f-1", name: "Elevator", number: "SBH-2F-ELEVATOR", category: "Facilities", x: 165, z: 200, w: 65, d: 65, amenities: [] },
  { id: "2f-14", name: "Male Comfort Room", number: "SBH-2F-MALE-CR", category: "Facilities", x: 1280, z: 200, w: 80, d: 70, amenities: ["Toilet and Sink"] },
  { id: "2f-15", name: "Female Comfort Room", number: "SBH-2F-FEMALE-CR", category: "Facilities", x: 1280, z: 280, w: 80, d: 60, amenities: ["Toilet and Sink"] },
  { id: "2f-13", name: "Computer Lab 5", number: "SBH-2F-CL5", category: "Education and Training", capacity: 40, x: 1480, z: 210, w: 160, d: 100, amenities: ["Computers", "Projector", "Air Conditioning", "Whiteboard"] },
];

const CATEGORY_COLORS = {
  "Education and Training": { base: 0x1e40af, top: 0x3b82f6, height: 28 },
  Office:            { base: 0x065f46, top: 0x10b981, height: 22 },
  "Conference Room":  { base: 0x7c2d12, top: 0xf97316, height: 22 },
  "Faculty Room":    { base: 0x155e75, top: 0x06b6d4, height: 22 },
  Facilities:        { base: 0x4c1d95, top: 0x8b5cf6, height: 16 },
  Library:           { base: 0x713f12, top: 0xeab308, height: 30 },
  Clinic:            { base: 0x881337, top: 0xf43f5e, height: 22 },
  Printing:          { base: 0x4a044e, top: 0xd946ef, height: 16 },
  Pantry:            { base: 0x92400e, top: 0xf59e0b, height: 16 },
};

const CORRIDOR_Z = 340;

const CORRIDOR_PATHS = [
  { points: [{x:165,z:200}, {x:165,z:CORRIDOR_Z}], label: "vert-elevator" },
  { points: [{x:70,z:CORRIDOR_Z}, {x:650,z:CORRIDOR_Z}, {x:1480,z:CORRIDOR_Z}], label: "main-hallway" },
  // Stubs down to bottom-row rooms
  { points: [{x:70,z:CORRIDOR_Z}, {x:70,z:450}], label: "stub-dean1" },
  { points: [{x:166,z:CORRIDOR_Z}, {x:166,z:550}], label: "stub-dean2" },
  { points: [{x:278,z:CORRIDOR_Z}, {x:278,z:510}], label: "stub-conf" },
  { points: [{x:420,z:CORRIDOR_Z}, {x:420,z:470}], label: "stub-print" },
  { points: [{x:376,z:CORRIDOR_Z}, {x:376,z:510}], label: "stub-pantry" },
  { points: [{x:650,z:CORRIDOR_Z}, {x:650,z:460}], label: "stub-library" },
  { points: [{x:1000,z:CORRIDOR_Z}, {x:1000,z:440}], label: "stub-clinic" },
  { points: [{x:1130,z:CORRIDOR_Z}, {x:1130,z:420}], label: "stub-it" },
  { points: [{x:1200,z:CORRIDOR_Z}, {x:1200,z:510}], label: "stub-guidance" },
  { points: [{x:1330,z:CORRIDOR_Z}, {x:1330,z:470}], label: "stub-dean3" },
  { points: [{x:1450,z:CORRIDOR_Z}, {x:1450,z:430}], label: "stub-faculty" },
  // Stubs up to top-row rooms
  { points: [{x:1280,z:CORRIDOR_Z}, {x:1280,z:200}], label: "stub-male" },
  { points: [{x:1280,z:CORRIDOR_Z}, {x:1280,z:280}], label: "stub-female" },
  { points: [{x:1480,z:CORRIDOR_Z}, {x:1480,z:210}], label: "stub-cl5" },
];

const DIRECT_ROUTES = {
  "2f-2":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:70,z:CORRIDOR_Z}, {x:70,z:450}],
  "2f-3":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:166,z:CORRIDOR_Z}, {x:166,z:550}],
  "2f-4":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:278,z:CORRIDOR_Z}, {x:278,z:510}],
  "2f-5":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:420,z:CORRIDOR_Z}, {x:420,z:470}],
  "2f-6":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:376,z:CORRIDOR_Z}, {x:376,z:510}],
  "2f-7":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:650,z:CORRIDOR_Z}, {x:650,z:460}],
  "2f-8":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1000,z:CORRIDOR_Z}, {x:1000,z:440}],
  "2f-9":  [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1130,z:CORRIDOR_Z}, {x:1130,z:420}],
  "2f-10": [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1200,z:CORRIDOR_Z}, {x:1200,z:510}],
  "2f-11": [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1330,z:CORRIDOR_Z}, {x:1330,z:470}],
  "2f-12": [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1450,z:CORRIDOR_Z}, {x:1450,z:430}],
  "2f-13": [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1480,z:CORRIDOR_Z}, {x:1480,z:210}],
  "2f-14": [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1280,z:CORRIDOR_Z}, {x:1280,z:200}],
  "2f-15": [{x:165,z:200}, {x:165,z:CORRIDOR_Z}, {x:1280,z:CORRIDOR_Z}, {x:1280,z:280}],
};

const CENTER_X = 750, CENTER_Z = 375;

function createRouteCurve(waypoints) {
  const points = waypoints.map(p => new THREE.Vector3(p.x - CENTER_X, 6, p.z - CENTER_Z));
  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
}

function createNavigationArrows(scene, curve) {
  const curveLength = curve.getLength();
  const count = Math.max(4, Math.min(12, Math.floor(curveLength / 35)));
  const arrows = [];
  const coneGeo = new THREE.ConeGeometry(5, 12, 6);
  coneGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < count; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff6600, emissive: 0xff6600, emissiveIntensity: 1.0, transparent: true, opacity: 0.9,
    });
    const mesh = new THREE.Mesh(coneGeo, mat);
    mesh.userData = { isNavArrow: true };
    scene.add(mesh);
    arrows.push(mesh);
  }
  return arrows;
}

function createActivePathHighlight(scene, curve) {
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 2.5, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 1.5, transparent: true, opacity: 0.4,
  });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  tube.userData = { isActiveHighlight: true };
  scene.add(tube);
  return tube;
}

function dimCorridorTubes(pathTubes) {
  pathTubes.forEach(tube => { tube.material.opacity = 0.15; tube.material.emissiveIntensity = 0.1; });
}

function resetPathHighlighting(pathTubes) {
  pathTubes.forEach(tube => {
    tube.material.opacity = 0.7; tube.material.emissiveIntensity = 0.8;
    tube.material.color.setHex(0x00d4ff); tube.material.emissive.setHex(0x00d4ff);
  });
}

function buildScene(canvas) {
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1e);
  scene.fog = new THREE.Fog(0x0a0f1e, 1000, 2500);

  const camera = new THREE.PerspectiveCamera(45, W / H, 1, 4000);
  camera.position.set(0, 500, 700);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0x1a2744, 1.5);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(300, 600, 300);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10; sun.shadow.camera.far = 2000;
  sun.shadow.camera.left = -900; sun.shadow.camera.right = 900;
  sun.shadow.camera.top = 700; sun.shadow.camera.bottom = -700;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x4466ff, 0.8);
  fill.position.set(-300, 200, -300);
  scene.add(fill);

  const floorGeo = new THREE.PlaneGeometry(1800, 800);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9, metalness: 0.1 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(1800, 36, 0x1e3a5f, 0x0f2040);
  grid.position.y = 0.5;
  scene.add(grid);

  const corridorGeo = new THREE.BoxGeometry(1600, 4, 600);
  const corridorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const corridor = new THREE.Mesh(corridorGeo, corridorMat);
  corridor.position.set(0, 2, 0);
  corridor.receiveShadow = true;
  scene.add(corridor);

  const roomMeshes = [];
  const roomData = [];

  ROOMS.forEach((room) => {
    const config = CATEGORY_COLORS[room.category] || CATEGORY_COLORS.Facilities;
    const h = config.height;

    const geo = new THREE.BoxGeometry(room.w, h, room.d);
    const mat = new THREE.MeshStandardMaterial({
      color: config.base, roughness: 0.4, metalness: 0.3,
      emissive: new THREE.Color(config.base), emissiveIntensity: 0.05,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const px = room.x - CENTER_X;
    const pz = room.z - CENTER_Z;
    mesh.position.set(px, h / 2, pz);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData = { id: room.id, originalColor: config.base, hoverColor: config.top, height: h, config };
    scene.add(mesh);
    roomMeshes.push(mesh);
    roomData.push({ mesh, room });

    const topGeo = new THREE.BoxGeometry(room.w, 2, room.d);
    const topMat = new THREE.MeshStandardMaterial({
      color: config.top, roughness: 0.2, metalness: 0.5,
      emissive: new THREE.Color(config.top), emissiveIntensity: 0.2,
    });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(px, h + 1, pz);
    scene.add(top);

    const light = new THREE.PointLight(config.top, 0.5, 120);
    light.position.set(px, h + 20, pz);
    scene.add(light);

    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({ color: config.top, transparent: true, opacity: 0.4 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    wireframe.position.copy(mesh.position);
    scene.add(wireframe);
  });

  const pathTubes = [];
  CORRIDOR_PATHS.forEach((corridor) => {
    const points = corridor.points.map(p => new THREE.Vector3(p.x - CENTER_X, 3, p.z - CENTER_Z));
    const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
    const tubeGeo = new THREE.TubeGeometry(curve, 30, 1.5, 6, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.8, transparent: true, opacity: 0.7,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.userData = { isNavPath: true, label: corridor.label };
    scene.add(tube);
    pathTubes.push(tube);
  });

  return { renderer, scene, camera, roomMeshes, roomData, floor, pathTubes };
}

const DEFAULT_RADIUS = 800;
const MIN_RADIUS = 300;
const MAX_RADIUS = 1500;
const DEFAULT_TILT = 0.55;
const MIN_TILT = 0.15;
const MAX_TILT = 1.50;
const ZOOM_SPEED = 0.08;
const TILT_SPEED = 0.004;
const KEYBOARD_ROTATE_SPEED = 0.04;
const KEYBOARD_ZOOM_STEP = 50;

export default function FloorMap3D2F() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [navTarget, setNavTarget] = useState(null);
  const [navTargetDrop, setNavTargetDrop] = useState("");
  const mouseRef = useRef({ x: 0, y: 0, isDragging: false, lastX: 0, lastY: 0 });
  const angleRef = useRef(0);
  const autoRotateRef = useRef(true);
  const radiusRef = useRef(DEFAULT_RADIUS);
  const tiltRef = useRef(DEFAULT_TILT);
  const touchRef = useRef({ lastDist: 0, lastAngle: 0, lastTiltY: 0, isPinching: false, isSingleDrag: false, startX: 0, startY: 0 });

  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { renderer, scene, camera, roomMeshes, roomData, pathTubes } = buildScene(canvas);
    stateRef.current = { renderer, scene, camera, roomMeshes, roomData, pathTubes, navArrows: null, navCurve: null, activeHighlight: null, selectedMesh: null };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh = null;
    let animId;
    let theta = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotateRef.current) { theta += 0.003; } else { theta = angleRef.current; }
      const r = radiusRef.current;
      const tilt = tiltRef.current;
      camera.position.x = Math.sin(theta) * Math.cos(tilt) * r;
      camera.position.z = Math.cos(theta) * Math.cos(tilt) * r;
      camera.position.y = Math.sin(tilt) * r;
      camera.lookAt(0, 0, 0);
      const t = Date.now() * 0.002;
      if (!stateRef.current.navCurve) { pathTubes.forEach(tube => { tube.material.emissiveIntensity = 0.5 + 0.4 * Math.sin(t); }); }
      if (stateRef.current.activeHighlight) { stateRef.current.activeHighlight.material.opacity = 0.3 + 0.2 * Math.sin(t * 1.5); }
      if (stateRef.current.navArrows && stateRef.current.navCurve) {
        const curve = stateRef.current.navCurve;
        const arrows = stateRef.current.navArrows;
        const count = arrows.length;
        const speed = 0.12;
        const now = Date.now() * 0.001;
        arrows.forEach((arrow, i) => {
          const phase = i / count;
          const tParam = ((now * speed) + phase) % 1.0;
          const pos = curve.getPointAt(tParam);
          const tangent = curve.getTangentAt(tParam);
          arrow.position.copy(pos);
          arrow.lookAt(pos.clone().add(tangent));
          const pulse = 0.7 + 0.3 * Math.sin(now * 4 + i * 0.5);
          arrow.material.opacity = pulse;
          arrow.material.emissiveIntensity = 0.6 + 0.4 * pulse;
          arrow.scale.setScalar(0.8 + 0.2 * Math.sin(now * 3 + i));
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (mouseRef.current.isDragging) {
        const dx = e.clientX - mouseRef.current.lastX;
        const dy = e.clientY - mouseRef.current.lastY;
        if (e.shiftKey || mouseRef.current.button === 2) {
          tiltRef.current = Math.max(MIN_TILT, Math.min(MAX_TILT, tiltRef.current + dy * TILT_SPEED));
        } else { angleRef.current -= dx * 0.005; }
        mouseRef.current.lastX = e.clientX; mouseRef.current.lastY = e.clientY;
        autoRotateRef.current = false; setAutoRotate(false);
      }
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(roomMeshes);
      if (hoveredMesh && hoveredMesh !== stateRef.current.selectedMesh) {
        hoveredMesh.material.emissiveIntensity = 0.05;
        hoveredMesh.material.color.setHex(hoveredMesh.userData.originalColor);
      }
      if (hits.length > 0) {
        hoveredMesh = hits[0].object;
        hoveredMesh.material.emissiveIntensity = 0.4;
        hoveredMesh.material.color.setHex(hoveredMesh.userData.hoverColor);
        canvas.style.cursor = "pointer";
        const rd = roomData.find(r => r.mesh === hoveredMesh);
        if (rd) setHoveredRoom(rd.room);
      } else {
        hoveredMesh = null;
        canvas.style.cursor = mouseRef.current.isDragging ? "grabbing" : "grab";
        setHoveredRoom(null);
      }
    };

    const onMouseDown = (e) => { mouseRef.current.isDragging = true; mouseRef.current.lastX = e.clientX; mouseRef.current.lastY = e.clientY; mouseRef.current.button = e.button; canvas.style.cursor = "grabbing"; };
    const onMouseUp = () => { mouseRef.current.isDragging = false; mouseRef.current.button = 0; canvas.style.cursor = "grab"; };
    const onWheel = (e) => { e.preventDefault(); const delta = e.deltaY > 0 ? 1 : -1; radiusRef.current = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, radiusRef.current + delta * radiusRef.current * ZOOM_SPEED)); };
    const onContextMenu = (e) => { e.preventDefault(); };

    const onKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); angleRef.current += KEYBOARD_ROTATE_SPEED; autoRotateRef.current = false; setAutoRotate(false); break;
        case "ArrowRight": e.preventDefault(); angleRef.current -= KEYBOARD_ROTATE_SPEED; autoRotateRef.current = false; setAutoRotate(false); break;
        case "ArrowUp": e.preventDefault(); tiltRef.current = Math.min(MAX_TILT, tiltRef.current + KEYBOARD_ROTATE_SPEED); break;
        case "ArrowDown": e.preventDefault(); tiltRef.current = Math.max(MIN_TILT, tiltRef.current - KEYBOARD_ROTATE_SPEED); break;
        case "+": case "=": e.preventDefault(); radiusRef.current = Math.max(MIN_RADIUS, radiusRef.current - KEYBOARD_ZOOM_STEP); break;
        case "-": case "_": e.preventDefault(); radiusRef.current = Math.min(MAX_RADIUS, radiusRef.current + KEYBOARD_ZOOM_STEP); break;
        case "r": case "R": e.preventDefault(); radiusRef.current = DEFAULT_RADIUS; tiltRef.current = DEFAULT_TILT; angleRef.current = 0; autoRotateRef.current = true; setAutoRotate(true); break;
        default: break;
      }
    };

    const getTouchDistance = (t1, t2) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    const onTouchStart = (e) => {
      if (e.touches.length === 2) { e.preventDefault(); touchRef.current.isPinching = true; touchRef.current.isSingleDrag = false; touchRef.current.lastDist = getTouchDistance(e.touches[0], e.touches[1]); touchRef.current.lastTiltY = (e.touches[0].clientY + e.touches[1].clientY) / 2; }
      else if (e.touches.length === 1) { touchRef.current.isSingleDrag = true; touchRef.current.isPinching = false; touchRef.current.startX = e.touches[0].clientX; touchRef.current.startY = e.touches[0].clientY; touchRef.current.lastAngle = e.touches[0].clientX; }
    };
    const onTouchMove = (e) => {
      if (touchRef.current.isPinching && e.touches.length === 2) {
        e.preventDefault(); const dist = getTouchDistance(e.touches[0], e.touches[1]); const delta = touchRef.current.lastDist - dist;
        radiusRef.current = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, radiusRef.current + delta * 2)); touchRef.current.lastDist = dist;
        const avgY = (e.touches[0].clientY + e.touches[1].clientY) / 2; const dy = avgY - touchRef.current.lastTiltY;
        tiltRef.current = Math.max(MIN_TILT, Math.min(MAX_TILT, tiltRef.current + dy * 0.003)); touchRef.current.lastTiltY = avgY;
      } else if (touchRef.current.isSingleDrag && e.touches.length === 1) {
        const dx = e.touches[0].clientX - touchRef.current.lastAngle; angleRef.current -= dx * 0.005; touchRef.current.lastAngle = e.touches[0].clientX;
        autoRotateRef.current = false; setAutoRotate(false);
      }
    };
    const onTouchEnd = (e) => { if (e.touches.length < 2) touchRef.current.isPinching = false; if (e.touches.length < 1) touchRef.current.isSingleDrag = false; };

    const onClick = (e) => {
      if (Math.abs(e.clientX - mouseRef.current.lastX) > 3) return;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(roomMeshes);
      if (hits.length > 0) {
        const rd = roomData.find(r => r.mesh === hits[0].object);
        if (rd) { setSelectedRoom(rd.room); if (rd.room.id !== "2f-1") { setNavTarget(rd.room.id); setNavTargetDrop(rd.room.id); } }
        stateRef.current.selectedMesh = hits[0].object;
      } else { setSelectedRoom(null); stateRef.current.selectedMesh = null; }
    };

    const onResize = () => { const w = canvas.clientWidth; const h = canvas.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };

    canvas.addEventListener("mousemove", onMouseMove); canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp); canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false }); canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false }); canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd); window.addEventListener("resize", onResize); window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouseMove); canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp); canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("wheel", onWheel); canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("touchstart", onTouchStart); canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd); window.removeEventListener("resize", onResize); window.removeEventListener("keydown", onKeyDown);
      if (stateRef.current?.navArrows) { stateRef.current.navArrows.forEach(a => { scene.remove(a); a.geometry.dispose(); a.material.dispose(); }); }
      if (stateRef.current?.activeHighlight) { scene.remove(stateRef.current.activeHighlight); stateRef.current.activeHighlight.geometry.dispose(); stateRef.current.activeHighlight.material.dispose(); }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!stateRef.current) return;
    const { scene, pathTubes } = stateRef.current;
    if (stateRef.current.navArrows) { stateRef.current.navArrows.forEach(a => { scene.remove(a); a.geometry.dispose(); a.material.dispose(); }); stateRef.current.navArrows = null; }
    if (stateRef.current.activeHighlight) { scene.remove(stateRef.current.activeHighlight); stateRef.current.activeHighlight.geometry.dispose(); stateRef.current.activeHighlight.material.dispose(); stateRef.current.activeHighlight = null; }
    stateRef.current.navCurve = null;
    if (!navTarget || navTarget === "2f-1") { resetPathHighlighting(pathTubes); return; }
    const waypoints = DIRECT_ROUTES[navTarget];
    if (!waypoints || waypoints.length < 2) return;
    const curve = createRouteCurve(waypoints);
    const arrows = createNavigationArrows(scene, curve);
    const highlight = createActivePathHighlight(scene, curve);
    stateRef.current.navCurve = curve; stateRef.current.navArrows = arrows; stateRef.current.activeHighlight = highlight;
    dimCorridorTubes(pathTubes);
  }, [navTarget]);

  const handleClearNav = () => { setNavTarget(null); setNavTargetDrop(""); };
  const handleZoomIn = () => { radiusRef.current = Math.max(MIN_RADIUS, radiusRef.current - KEYBOARD_ZOOM_STEP); };
  const handleZoomOut = () => { radiusRef.current = Math.min(MAX_RADIUS, radiusRef.current + KEYBOARD_ZOOM_STEP); };
  const handleResetView = () => { radiusRef.current = DEFAULT_RADIUS; tiltRef.current = DEFAULT_TILT; angleRef.current = 0; autoRotateRef.current = true; setAutoRotate(true); };

  const LEGEND = [
    { label: "Education & Training", color: "#3b82f6" },
    { label: "Office", color: "#10b981" },
    { label: "Conference Room", color: "#f97316" },
    { label: "Faculty Room", color: "#06b6d4" },
    { label: "Library", color: "#eab308" },
    { label: "Clinic", color: "#f43f5e" },
    { label: "Facilities", color: "#8b5cf6" },
    { label: "Printing / Pantry", color: "#d946ef" },
  ];

  const navRoomName = navTarget ? ROOMS.find(r => r.id === navTarget)?.name : null;

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0f1e", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "16px 24px", background: "linear-gradient(to bottom, rgba(10,15,30,0.95), transparent)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#3b82f6", textTransform: "uppercase", marginBottom: 4 }}>Saint Benedict Hall</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.5 }}>2nd Floor — 3D Map</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <select value={navTargetDrop} onChange={(e) => { setNavTargetDrop(e.target.value); setNavTarget(e.target.value || null); if (e.target.value) { const room = ROOMS.find(r => r.id === e.target.value); if (room) setSelectedRoom(room); } }} style={{ background: "rgba(10,15,30,0.9)", border: `1px solid ${navTarget ? "rgba(255,102,0,0.5)" : "rgba(59,130,246,0.3)"}`, color: "#f1f5f9", padding: "7px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer", outline: "none", minWidth: 180 }}>
            <option value="">Navigate to...</option>
            {ROOMS.filter(r => r.id !== "2f-1").map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
          </select>
          {navTarget && (<button onClick={handleClearNav} style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Clear</button>)}
          <button onClick={() => { setAutoRotate(v => !v); autoRotateRef.current = !autoRotateRef.current; }} style={{ background: autoRotate ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${autoRotate ? "#3b82f6" : "rgba(255,255,255,0.1)"}`, color: autoRotate ? "#3b82f6" : "#94a3b8", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>
            {autoRotate ? "Pause" : "Rotate"}
          </button>
        </div>
      </div>

      {navTarget && navRoomName && (
        <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 15, background: "rgba(255,102,0,0.15)", border: "1px solid rgba(255,102,0,0.4)", borderRadius: 10, padding: "8px 20px", display: "flex", alignItems: "center", gap: 10, backdropFilter: "blur(12px)" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6600", boxShadow: "0 0 8px #ff6600", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 13, color: "#ff9944", fontWeight: 600 }}>Navigating to {navRoomName}</span>
          <span style={{ fontSize: 11, color: "#ff660088" }}>from Elevator</span>
        </div>
      )}

      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }} />

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 10, background: "rgba(10,15,30,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 9, letterSpacing: 2, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>Legend</div>
        {LEGEND.map(l => (<div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} /><span style={{ fontSize: 11, color: "#cbd5e1" }}>{l.label}</span></div>))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 20, height: 3, background: "linear-gradient(to right, #00d4ff, transparent)", borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#00d4ff" }}>Nav Path</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "8px solid #ff6600", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#ff6600" }}>Active Route</span>
        </div>
      </div>

      {/* Camera Controls */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 10, background: "rgba(10,15,30,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <button onClick={handleZoomIn} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }} title="Zoom In (+)">+</button>
          <button onClick={handleZoomOut} style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }} title="Zoom Out (-)">−</button>
          <button onClick={handleResetView} style={{ height: 32, borderRadius: 6, padding: "0 10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 11, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }} title="Reset View (R)">↻ Reset</button>
        </div>
        <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6 }}>
          <div>Drag to rotate · Shift+Drag tilt</div>
          <div>Scroll to zoom · Arrows / +− / R</div>
          <div>Click room to navigate</div>
        </div>
      </div>

      {hoveredRoom && !selectedRoom && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "rgba(10,15,30,0.9)", backdropFilter: "blur(16px)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 10, padding: "10px 18px", pointerEvents: "none", zIndex: 20, color: "#f1f5f9", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
          {hoveredRoom.name}
          <span style={{ marginLeft: 8, fontSize: 11, color: "#64748b", fontWeight: 400 }}>{hoveredRoom.number}</span>
        </div>
      )}

      {selectedRoom && (
        <div style={{ position: "absolute", top: 80, right: 24, zIndex: 20, width: 280, background: "rgba(10,15,30,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 16, padding: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#3b82f6", textTransform: "uppercase", marginBottom: 4 }}>{selectedRoom.category}</div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>{selectedRoom.name}</h2>
            </div>
            <button onClick={() => setSelectedRoom(null)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#64748b", cursor: "pointer", borderRadius: 6, padding: "4px 8px", fontSize: 16 }}>x</button>
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 14, fontFamily: "monospace", letterSpacing: 0.5 }}>{selectedRoom.number}</div>
          {selectedRoom.capacity && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(59,130,246,0.08)", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#93c5fd" }}>Capacity: <strong>{selectedRoom.capacity}</strong> seats</span>
            </div>
          )}
          {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Amenities</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedRoom.amenities.map(a => (<span key={a} style={{ fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px" }}>{a}</span>))}
              </div>
            </div>
          )}
          {navTarget === selectedRoom.id && (
            <div style={{ marginTop: 14, padding: "8px 12px", borderRadius: 8, background: "rgba(255,102,0,0.1)", border: "1px solid rgba(255,102,0,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff6600", boxShadow: "0 0 6px #ff6600" }} />
              <span style={{ fontSize: 12, color: "#ff9944", fontWeight: 500 }}>Route active</span>
            </div>
          )}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            <span style={{ fontSize: 12, color: "#10b981" }}>Available</span>
          </div>
        </div>
      )}
    </div>
  );
}
