import { useApp, AnimalType, COSMETIC_STORE } from "@/context/AppContext";
import bearImg from "@/assets/bear.png";
import catImg from "@/assets/cat.png";
import dogImg from "@/assets/dog.png";
import duckImg from "@/assets/duck.png";
import bearActiveImg from "@/assets/bearactive.png";

const animalImages: Record<AnimalType, string> = {
  bear: bearImg,
  cat: catImg,
  dog: dogImg,
  chicken: duckImg,
};

interface Props {
  size?: "sm" | "md" | "lg";
  animal?: AnimalType;
  showHat?: boolean;
  active?: boolean;
}

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-40 h-40",
  lg: "w-56 h-56",
};

const AnimalCharacter = ({ size = "lg", animal: animalProp, showHat = true, active = false }: Props) => {
  const { animal: ctxAnimal, equippedHat } = useApp();
  const animal = animalProp || ctxAnimal;
  if (!animal) return null;

  const img = active && animal === "bear" ? bearActiveImg : animalImages[animal];
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
