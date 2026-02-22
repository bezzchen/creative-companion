import { useState, useEffect } from "react";
import { useApp, AnimalType, COSMETIC_STORE } from "@/context/AppContext";
import bearImg from "@/assets/bear.png";
import catImg from "@/assets/cat.png";
import dogImg from "@/assets/dog.png";
import duckImg from "@/assets/duck.png";
import bearActiveImg from "@/assets/bearactive.png";
import catActiveImg from "@/assets/catactive.png";
import dogActiveImg from "@/assets/dogactive.png";
import chickenActiveImg from "@/assets/chickenactive.png";
import bearIconImg from "@/assets/bearicon.png";
import catIconImg from "@/assets/caticon.png";
import dogIconImg from "@/assets/dogicon.png";
import chickenIconImg from "@/assets/chickenicon.png";
import dogSquish1 from "@/assets/dogsquish1.png";
import dogSquish2 from "@/assets/dogsquish2.png";
import dogLong1 from "@/assets/doglong1.png";
import dogLong2 from "@/assets/doglong2.png";

const animalImages: Record<AnimalType, string> = {
  bear: bearImg,
  cat: catImg,
  dog: dogImg,
  chicken: duckImg,
};

const animalActiveImages: Record<AnimalType, string> = {
  bear: bearActiveImg,
  cat: catActiveImg,
  dog: dogActiveImg,
  chicken: chickenActiveImg,
};

export const animalIconImages: Record<AnimalType, string> = {
  bear: bearIconImg,
  cat: catIconImg,
  dog: dogIconImg,
  chicken: chickenIconImg,
};

// Idle animation frames: original -> squish1 -> squish2 -> squish1 -> original -> long1 -> long2 -> long1
const animalIdleFrames: Record<AnimalType, string[]> = {
  dog: [dogImg, dogSquish1, dogSquish2, dogSquish1, dogImg, dogLong1, dogLong2, dogLong1],
  bear: Array(8).fill(bearImg),
  cat: Array(8).fill(catImg),
  chicken: Array(8).fill(duckImg),
};

interface Props {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animal?: AnimalType;
  showHat?: boolean;
  active?: boolean;
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-40 h-40",
  lg: "w-64 h-64",
  xl: "w-72 h-72",
  "2xl": "w-[36rem] h-[36rem]",
};

const AnimalCharacter = ({ size = "lg", animal: animalProp, showHat = true, active = false }: Props) => {
  const { animal: ctxAnimal, equippedHat } = useApp();
  const animal = animalProp || ctxAnimal;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (active || !animal) {
      setFrameIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 8);
    }, 250);
    return () => clearInterval(interval);
  }, [active, animal]);

  if (!animal) return null;

  const img = active ? animalActiveImages[animal] : animalIdleFrames[animal][frameIndex];
  const hatItem = equippedHat ? COSMETIC_STORE.find((c) => c.id === equippedHat) : null;

  return (
    <div className={`relative ${sizeMap[size]} flex-shrink-0`}>
      {showHat && hatItem && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl z-10 drop-shadow-md">
          {hatItem.preview}
        </div>
      )}
      <img
        src={img}
        alt={animal}
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </div>
  );
};

export default AnimalCharacter;
