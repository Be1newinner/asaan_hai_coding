"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import {
  step,
  normalWorldGeometry,
  output,
  texture,
  vec3,
  vec4,
  normalize,
  positionWorld,
  bumpMap,
  cameraPosition,
  color,
  uniform,
  mix,
  uv,
  max,
} from "three/tsl";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { WebGPURenderer } from "three/webgpu";
import { WebGLRenderer, PerspectiveCamera, Scene } from "three";

export default function EarthCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Flags and refs used across init/cleanup
    let mounted = true;
    let disposed = false;

    // Keep locals nullable to allow defensive checks in cleanup
    let renderer: THREE.WebGPURenderer | WebGLRenderer | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let scene: THREE.Scene | null = null;
    let controls: OrbitControls | null = null;
    let globe: THREE.Mesh | null = null;
    let clock: THREE.Clock | null = null;
    let cleanupGUI: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const init = async () => {
      if (!mounted || !containerRef.current) return;

      clock = new THREE.Clock();
      camera = new THREE.PerspectiveCamera(
        25,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        100
      );
      camera.position.set(4.5, 2, 3);

      scene = new THREE.Scene();

      // Sun light
      const sun = new THREE.DirectionalLight("#ffffff", 2);
      sun.position.set(0, 0, 3);
      scene.add(sun);

      // Uniforms and materials
      const atmosphereDayColor = uniform(color("#4db2ff"));
      const atmosphereTwilightColor = uniform(color("#bc490b"));
      const roughnessLow = uniform(0.25);
      const roughnessHigh = uniform(0.35);

      const textureLoader = new THREE.TextureLoader();
      const dayTexture = textureLoader.load(
        "/textures/planets/earth_day_4096.jpg"
      );
      dayTexture.colorSpace = THREE.SRGBColorSpace;
      dayTexture.anisotropy = 8;

      const nightTexture = textureLoader.load(
        "/textures/planets/earth_night_4096.jpg"
      );
      nightTexture.colorSpace = THREE.SRGBColorSpace;
      nightTexture.anisotropy = 8;

      const bumpRoughnessCloudsTexture = textureLoader.load(
        "/textures/planets/earth_bump_roughness_clouds_4096.jpg"
      );
      bumpRoughnessCloudsTexture.anisotropy = 8;

      // TSL setup
      const viewDirection = positionWorld.sub(cameraPosition).normalize();
      const fresnel = viewDirection
        .dot(normalWorldGeometry)
        .abs()
        .oneMinus()
        .toVar();
      const sunOrientation = normalWorldGeometry
        .dot(normalize(sun.position))
        .toVar();
      const atmosphereColor = mix(
        atmosphereTwilightColor,
        atmosphereDayColor,
        sunOrientation.smoothstep(-0.25, 0.75)
      );

      const globeMaterial = new THREE.MeshStandardNodeMaterial();
      const cloudsStrength = texture(
        bumpRoughnessCloudsTexture,
        uv()
      ).b.smoothstep(0.2, 1);
      globeMaterial.colorNode = mix(
        texture(dayTexture),
        vec3(1),
        cloudsStrength.mul(2)
      );

      const roughness = max(
        texture(bumpRoughnessCloudsTexture).g,
        step(0.01, cloudsStrength)
      );
      globeMaterial.roughnessNode = roughness.remap(
        0,
        1,
        roughnessLow,
        roughnessHigh
      );

      const night = texture(nightTexture);
      const dayStrength = sunOrientation.smoothstep(-0.25, 0.5);
      const atmosphereDayStrength = sunOrientation.smoothstep(-0.5, 1);
      const atmosphereMix = atmosphereDayStrength
        .mul(fresnel.pow(2))
        .clamp(0, 1);

      let finalOutput = mix(night.rgb, output.rgb, dayStrength);
      finalOutput = mix(finalOutput, atmosphereColor, atmosphereMix);
      globeMaterial.outputNode = vec4(finalOutput, output.a);

      const bumpElevation = max(
        texture(bumpRoughnessCloudsTexture).r,
        cloudsStrength
      );
      globeMaterial.normalNode = bumpMap(bumpElevation);

      const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
      globe = new THREE.Mesh(sphereGeometry, globeMaterial);
      scene.add(globe);

      const atmosphereMaterial = new THREE.MeshBasicNodeMaterial({
        side: THREE.BackSide,
        transparent: true,
      });
      let alpha = fresnel.remap(0.73, 1, 1, 0).pow(3).toFloat();
      alpha = alpha.mul(sunOrientation.smoothstep(-0.5, 1)).toFloat();
      atmosphereMaterial.fragmentNode = vec4(atmosphereColor, alpha);

      const atmosphere = new THREE.Mesh(sphereGeometry, atmosphereMaterial);
      atmosphere.scale.setScalar(1.04);
      scene.add(atmosphere);

      // GUI
      const gui = new GUI();
      gui
        .addColor(
          { color: atmosphereDayColor.value.getHex(THREE.SRGBColorSpace) },
          "color"
        )
        .onChange((value: number) => atmosphereDayColor.value.set(value))
        .name("atmosphereDayColor");
      gui
        .addColor(
          { color: atmosphereTwilightColor.value.getHex(THREE.SRGBColorSpace) },
          "color"
        )
        .onChange((value: number) => atmosphereTwilightColor.value.set(value))
        .name("atmosphereTwilightColor");
      gui.add(roughnessLow, "value", 0, 1, 0.001).name("roughnessLow");
      gui.add(roughnessHigh, "value", 0, 1, 0.001).name("roughnessHigh");
      cleanupGUI = () => gui.destroy();

      const hasWebGPU =
        typeof navigator !== "undefined" && (navigator as any).gpu;
      renderer = hasWebGPU
        ? new WebGPURenderer()
        : new WebGLRenderer({ antialias: true });

      if (!mounted) return;

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      containerRef.current.appendChild(renderer.domElement);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.minDistance = 0.1;
      controls.maxDistance = 50;

      // Animate
      const animate = () => {
        if (!renderer || !camera || !scene || disposed) return;
        const delta = clock!.getDelta();
        if (globe) globe.rotation.y += delta * 0.025;
        controls?.update();
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);

      // Resize
      resizeObserver = new ResizeObserver(() => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(containerRef.current);
    };

    void init();

    return () => {
      mounted = false;
      disposed = true;

      try {
        resizeObserver?.disconnect();
      } catch {}
      resizeObserver = null;

      try {
        cleanupGUI?.();
      } catch {}
      cleanupGUI = null;

      try {
        renderer?.setAnimationLoop?.(null);
      } catch {}

      try {
        controls?.dispose?.();
      } catch {}
      controls = null;

      const canvas = (renderer as any)?.domElement as
        | HTMLCanvasElement
        | undefined;
      if (canvas?.parentElement) {
        try {
          canvas.parentElement.removeChild(canvas);
        } catch {}
      }

      try {
        (renderer as any)?.dispose?.();
      } catch {}
      renderer = null;

      try {
        scene?.traverse((obj: any) => {
          obj.geometry?.dispose?.();
          if (Array.isArray(obj.material))
            obj.material.forEach((m: any) => m?.dispose?.());
          else obj.material?.dispose?.();
        });
      } catch {}
      scene = null;

      camera = null;
      globe = null;
      clock = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 500,
        position: "relative",
      }}
    />
  );
}
