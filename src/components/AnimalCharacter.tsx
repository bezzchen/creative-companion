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

// Idle animation frames
import bearSquish1 from "@/assets/bearsquish1.png";
import bearSquish2 from "@/assets/bearsquish2.png";
import bearLong1 from "@/assets/bearlong1.png";
import bearLong2 from "@/assets/bearlong2.png";
import catSquish1 from "@/assets/catsquish1.png";
import catSquish2 from "@/assets/catsquish2.png";
import catLong1 from "@/assets/catlong1.png";
import catLong2 from "@/assets/catlong2.png";
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

// 8-frame idle cycle: original, squish1, squish2, squish1, original, long1, long2, long1
const animalIdleFrames: Partial<Record<AnimalType, string[]>> = {
  bear: [bearImg, bearSquish1, bearSquish2, bearSquish1, bearImg, bearLong1, bearLong2, bearLong1],
  cat: [catImg, catSquish1, catSquish2, catSquish1, catImg, catLong1, catLong2, catLong1],
  dog: [dogImg, dogSquish1, dogSquish2, dogSquish1, dogImg, dogLong1, dogLong2, dogLong1],
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

  const idleFrames = animal ? animalIdleFrames[animal] : undefined;

  useEffect(() => {
    if (active || !idleFrames) {
      setFrameIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 8);
    }, 250);
    return () => clearInterval(interval);
  }, [active, idleFrames]);

  if (!animal) return null;

  const img = active
    ? animalActiveImages[animal]
    : idleFrames
      ? idleFrames[frameIndex]
      : animalImages[animal];

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
