import Image from "next/image";
import { PlusIcon } from "@radix-ui/react-icons";

interface IconProps {
  name: string;
}

const DMIcon = () => {
  return (
    <div className="lounge-icon group">
      <Image
        src="/mawls_transparent.png"
        height={28}
        width={28}
        alt="DM"
        className="text-white"
      />
      <span className="lounge-tooltip group-hover:scale-100">
        Direct Messages
      </span>
    </div>
  );
};

const AddIcon = () => {
  return (
    <div className="lounge-icon group">
      <PlusIcon height={25} width={25} />
      <span className="lounge-tooltip group-hover:scale-100">Add a Lounge</span>
    </div>
  );
};

function LoungeIcon({ name }: IconProps) {
  const abbreviatedName = name
    .split(" ") // Split the name into words
    .map((word) => word.charAt(0)) // Extract the first character of each word
    .join(""); // Join the extracted characters together
  return (
    <div className="lounge-icon group">
      {abbreviatedName}
      <span className="lounge-tooltip group-hover:scale-100">{name}</span>
    </div>
  );
}

const Divider = () => <hr className="lounge-hr" />;

export default function Lounge() {
  return (
    <div className="fixed top-0 left-0 h-full w-16 flex flex-col bg-zinc-300">
      <DMIcon />
      <Divider />
      <LoungeIcon name="My Lounge" />
      <AddIcon />
    </div>
  );
}
