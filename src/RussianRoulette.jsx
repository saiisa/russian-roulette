import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function Revolver({ isSpinning }) {
  const meshRef = useRef();

  useFrame(() => {
    if (isSpinning && meshRef.current) {
      meshRef.current.rotation.y += 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1, 1, 0.5, 32]} />
      <meshStandardMaterial color="gray" metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

export default function RussianRoulette() {
  const [chamber, setChamber] = useState(Array(9).fill(false));
  const [currentChamber, setCurrentChamber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [fired, setFired] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const spinChamber = () => {
    const newChamber = Array(9).fill(false);
    const bulletPosition = Math.floor(Math.random() * 9);
    newChamber[bulletPosition] = true;
    setChamber(newChamber);
    setCurrentChamber(0);
    setFired(false);
    setGameOver(false);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1500);
  };

  const pullTrigger = () => {
    if (chamber[currentChamber]) {
      setFired(true);
      setGameOver(true);
    } else {
      const next = (currentChamber + 1) % 9;
      setCurrentChamber(next);
      setFired(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">俄罗斯轮盘赌</h1>
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 shadow-2xl rounded-2xl p-6 text-center">
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-10">
            <div className="w-full lg:w-1/2 h-96 bg-black rounded-xl">
              <Canvas camera={{ position: [0, 2, 5], fov: 60 }} shadows>
                <ambientLight intensity={0.5} />
                <directionalLight
                  castShadow
                  position={[5, 5, 5]}
                  intensity={1}
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <Suspense fallback={null}>
                  <Revolver isSpinning={isSpinning} />
                </Suspense>
                <OrbitControls enablePan={false} enableZoom={false} />
              </Canvas>
            </div>
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="mb-2 text-xl">
                当前弹膛: {currentChamber + 1}
              </div>
              {gameOver && (
                <div className="text-red-500 font-bold text-xl mb-2">砰！你输了！</div>
              )}
              {fired && !gameOver && (
                <div className="text-green-500 font-bold text-xl mb-2">咔哒... 你活下来了</div>
              )}
              <div className="flex justify-center space-x-4">
                <Button onClick={spinChamber} className="bg-blue-600">旋转弹膛</Button>
                <Button onClick={pullTrigger} disabled={isSpinning || gameOver} className="bg-red-600">扣动扳机</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
