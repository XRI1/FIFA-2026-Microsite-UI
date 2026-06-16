import { useEffect, useRef } from "react";

const FLOATING_ITEMS = [
  { x: -0.94, y: 0.5, scale: 0.26, speed: 0.75, phase: 0.2 },
  { x: 0.96, y: 0.46, scale: 0.22, speed: 0.92, phase: 1.8 },
  { x: -0.9, y: -0.48, scale: 0.2, speed: 1.08, phase: 3.1 },
  { x: 0.92, y: -0.56, scale: 0.28, speed: 0.68, phase: 4.2 },
] as const;

export function Floating3DElements() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    async function init() {
      const THREE = await import("three");
      if (disposed || !host) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      host.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.78));

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
      keyLight.position.set(3, 4, 6);
      scene.add(keyLight);

      const redRimLight = new THREE.DirectionalLight(0xff3158, 1.2);
      redRimLight.position.set(-4, -1, 4);
      scene.add(redRimLight);

      const ballGeometry = new THREE.SphereGeometry(1, 40, 40);
      const patchGeometryLarge = new THREE.CircleGeometry(0.31, 5);
      const patchGeometrySmall = new THREE.CircleGeometry(0.22, 5);
      const ringGeometry = new THREE.TorusGeometry(1.32, 0.016, 8, 80);
      const shardGeometry = new THREE.OctahedronGeometry(0.13, 0);

      const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8f4ea,
        roughness: 0.36,
        metalness: 0.07,
      });
      const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x151515,
        roughness: 0.52,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.34,
      });
      const shardMaterial = new THREE.MeshStandardMaterial({
        color: 0xc8002c,
        roughness: 0.2,
        metalness: 0.48,
        transparent: true,
        opacity: 0.72,
      });

      const panelPositions = [
        [0, 0, 1.03],
        [0.68, 0.5, 0.56],
        [-0.68, 0.5, 0.56],
        [0.42, -0.74, 0.54],
        [-0.42, -0.74, 0.54],
      ] as const;

      const objects = FLOATING_ITEMS.map((item, index) => {
        const group = new THREE.Group();
        group.userData.item = item;

        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        group.add(ball);

        panelPositions.forEach(([x, y, z], i) => {
          const patch = new THREE.Mesh(
            i === 0 ? patchGeometryLarge : patchGeometrySmall,
            panelMaterial,
          );
          patch.position.set(x, y, z);
          patch.lookAt(0, 0, 0);
          patch.rotateZ((i + index) * 0.42);
          ball.add(patch);
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.set(Math.PI / 2.35, 0.12 + index * 0.2, index * 0.6);
        ring.visible = index % 2 === 0;
        group.add(ring);

        scene.add(group);
        return { group, ball, ring, item };
      });

      const shards = Array.from({ length: 12 }).map((_, index) => {
        const shard = new THREE.Mesh(shardGeometry, shardMaterial);
        const column = index % 4;
        const row = Math.floor(index / 4);
        const side = column < 2 ? -1 : 1;
        shard.userData = {
          x: side * (0.72 + (column % 2) * 0.2),
          y: (row / 2 - 0.5) * 1.48,
          speed: 0.75 + (index % 5) * 0.11,
          phase: index * 0.73,
        };
        scene.add(shard);
        return shard;
      });

      let viewport = { width: 1, height: 1 };
      function resize() {
        const width = host.clientWidth;
        const height = host.clientHeight;
        viewport = { width, height };
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }

      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();

      let frame = 0;
      let animationFrame = 0;
      const animate = () => {
        frame += prefersReducedMotion ? 0.002 : 0.01;
        const aspect = viewport.width / Math.max(viewport.height, 1);
        const worldX = aspect > 1 ? 4.75 : 3.55;
        const worldY = aspect > 1 ? 3.15 : 4.55;

        objects.forEach(({ group, ball, ring, item }, index) => {
          const t = frame * item.speed + item.phase;
          const mobilePush = viewport.width < 640 ? 0.32 : 0;
          const driftX = Math.sin(t * 0.9) * 0.12;
          const driftY = Math.cos(t * 1.15) * 0.2;
          group.position.set(
            item.x * worldX + driftX + mobilePush,
            item.y * worldY + driftY,
            Math.sin(t * 0.7) * 0.8 - 0.2,
          );
          group.scale.setScalar(item.scale * (viewport.width < 640 ? 0.72 : 1));
          ball.rotation.y = t * 1.18 + index;
          ball.rotation.x = Math.sin(t) * 0.45;
          ring.rotation.z += prefersReducedMotion ? 0.001 : 0.006 + index * 0.0008;
        });

        shards.forEach((shard, index) => {
          const data = shard.userData;
          const t = frame * data.speed + data.phase;
          shard.position.set(
            data.x * worldX + Math.sin(t) * 0.14,
            data.y * worldY + Math.cos(t * 1.2) * 0.16,
            Math.sin(t * 0.8) * 0.6,
          );
          shard.scale.setScalar((viewport.width < 640 ? 0.75 : 1) * (0.55 + (index % 3) * 0.18));
          shard.rotation.set(t * 0.7, t * 1.1, t * 0.45);
        });

        animationFrame = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animationFrame);
        observer.disconnect();
        if (renderer.domElement.parentNode === host) {
          host.removeChild(renderer.domElement);
        }
        renderer.dispose();
        [
          ballGeometry,
          patchGeometryLarge,
          patchGeometrySmall,
          ringGeometry,
          shardGeometry,
        ].forEach((geometry) => geometry.dispose());
        [ballMaterial, panelMaterial, ringMaterial, shardMaterial].forEach(
          (material) => material.dispose(),
        );
      };
    }

    init();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="floating-3d-elements"
      aria-hidden="true"
    />
  );
}
