import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDViewer = ({ onClose }) => {
  const mountRef = useRef(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mountNode = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(
      60,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      5000
    );
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    mountNode.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    const fbxLoader = new FBXLoader();
    let model;
    setLoading(true);
    setProgress(0);

    fbxLoader.load(
      "/model2.FBX",
      (fbx) => {
        fbx.scale.set(0.5, 0.5, 0.5);
        scene.add(fbx);
        model = fbx;

        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const optimalDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        camera.position.set(0, 0, optimalDistance + 2);
        controls.minDistance = optimalDistance * 0.9;
        controls.maxDistance = optimalDistance * 1.5;

        setLoading(false);
      },
      (xhr) => {
        const percentLoaded = ((xhr.loaded / xhr.total) * 100).toFixed(2);
        setProgress(percentLoaded);
      },
      (error) => {
        console.error("Error loading FBX:", error);
        setLoading(false);
      }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;

    const handleResize = () => {
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    let lastInteractionTime = Date.now();
    const AUTO_ROTATE_DELAY = 10000;

    const stopAutoRotate = () => {
      setIsInteracting(true);
      lastInteractionTime = Date.now();
    };

    renderer.domElement.addEventListener("mousedown", stopAutoRotate);
    renderer.domElement.addEventListener("touchstart", stopAutoRotate);
    renderer.domElement.addEventListener("wheel", stopAutoRotate);

    const animate = () => {
      requestAnimationFrame(animate);

      const timeSinceLastInteraction = Date.now() - lastInteractionTime;

      if (!isInteracting && timeSinceLastInteraction > AUTO_ROTATE_DELAY) {
        if (model) {
          model.rotation.z += 0.005;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountNode.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", stopAutoRotate);
      renderer.domElement.removeEventListener("touchstart", stopAutoRotate);
      renderer.domElement.removeEventListener("wheel", stopAutoRotate);
    };
  }, [bgColor, isInteracting]);

  const toggleBackground = () => {
    const newColor = bgColor === "#000000" ? "#ffffff" : "#000000";
    setBgColor(newColor);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-lg p-4 flex justify-center items-center">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
          onClick={onClose}
        >
          Close
        </button>

        <button
          onClick={toggleBackground}
          className="absolute top-2 left-2 bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 transition"
        >
          {bgColor === "#000000" ? "White" : "Black"}
        </button>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80">
            <p className="text-xl font-semibold text-gray-700">
              Loading... {progress}%
            </p>
            <div className="w-40 h-2 bg-gray-300 mt-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div ref={mountRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ThreeDViewer;
