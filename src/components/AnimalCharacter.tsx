import { useState, useEffect } from "react";
import { useApp, AnimalType } from "@/context/AppContext";
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
import bearLong1 from "@/assets/bearlong1.png";
import catLong1 from "@/assets/catlong1.png";
import dogLong1 from "@/assets/doglong1.png";
import duckLong1 from "@/assets/ducklong1.png";
import activetableImg from "@/assets/activetable.png";

// Composite images: animal + cosmetic
import bearhatImg from "@/assets/bearhat.png";
import bearbowImg from "@/assets/bearbow.png";
import bearglassesImg from "@/assets/bearglasses.png";
import cathatImg from "@/assets/cathat.png";
import catbowImg from "@/assets/catbow.png";
import catglassesImg from "@/assets/catglasses.png";
import doghatImg from "@/assets/doghat.png";
import dogbowImg from "@/assets/dogbow.png";
import dogglassesImg from "@/assets/dogglasses.png";
import duckhatImg from "@/assets/duckhat.png";
import duckbowImg from "@/assets/duckbow.png";
import duckglassesImg from "@/assets/duckglasses.png";

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

const animalIdleFrames: Record<AnimalType, string[]> = {
  bear: [bearImg, bearLong1],
  cat: [catImg, catLong1],
  dog: [dogImg, dogLong1],
  chicken: [duckImg, duckLong1],
};

const cosmeticAnimalMap: Record<string, Record<AnimalType, string>> = {
  "hat-hat": { bear: bearhatImg, cat: cathatImg, dog: doghatImg, chicken: duckhatImg },
  "hat-bow": { bear: bearbowImg, cat: catbowImg, dog: dogbowImg, chicken: duckbowImg },
  "hat-glasses": { bear: bearglassesImg, cat: catglassesImg, dog: dogglassesImg, chicken: duckglassesImg },
};

interface Props {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animal?: AnimalType;
  showHat?: boolean;
  active?: boolean;
  paused?: boolean;
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-40 h-40",
  lg: "w-64 h-64",
  xl: "w-72 h-72",
  "2xl": "w-[36rem] h-[36rem]",
};

const AnimalCharacter = ({ size = "lg", animal: animalProp, showHat = true, active = false, paused = false }: Props) => {
  const { animal: ctxAnimal, equippedHat } = useApp();
  const animal = animalProp || ctxAnimal;
  const [frameIndex, setFrameIndex] = useState(0);

  const idleFrames = animal ? animalIdleFrames[animal] : undefined;

  useEffect(() => {
    if (active || paused || !idleFrames) {
      setFrameIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 2);
    }, 750);
    return () => clearInterval(interval);
  }, [active, paused, idleFrames]);

  if (!animal) return null;

  let img: string;
  if (paused) {
    img = activetableImg;
  } else if (active) {
    img = animalActiveImages[animal];
  } else if (equippedHat && cosmeticAnimalMap[equippedHat]?.[animal]) {
    img = cosmeticAnimalMap[equippedHat][animal];
  } else {
    img = idleFrames ? idleFrames[frameIndex] : animalImages[animal];
  }

  return (
    <div className={`relative ${sizeMap[size]} flex-shrink-0`}>
      <img src={img} alt={animal} className={`w-full h-full object-contain drop-shadow-lg ${paused ? "translate-y-8" : ""}`} draggable={false} />
    </div>
  );
};

export default AnimalCharacter;
