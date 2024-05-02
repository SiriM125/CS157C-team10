"use client"
import Image from "next/image";
import { PlusIcon, ChevronRightIcon, RocketIcon, EnvelopeOpenIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <span className="lounge-tooltip group-hover:scale-100 unselectable">
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
    <div className="lounge-icon group unselectable">
      {abbreviatedName}
      <span className="lounge-tooltip group-hover:scale-100 unselectable">
        {name}
      </span>
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
      <Dialog>
        <DialogTrigger>
          <AddIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="text-zinc-800 items-center justify-center">
            <DialogTitle className="text-2xl">Create Your Lounge</DialogTitle>
            <DialogDescription className="text-center" text-align="center">
              Your lounge is where you and your classmates collaborate. Make
              yours and start working.
            </DialogDescription>
          </DialogHeader>
          <div className="px-2 rounded-lg border hover:bg-zinc-100 flex items-center">
            <div className="rounded-full bg-violet-400 p-2 mr-2">
              <RocketIcon height={22} width={22}  className="text-yellow-300" />
            </div>
            <div className="text-zinc-600 text-lg font-semibold px-1 py-3">
              Create My Own
            </div>
            <ChevronRightIcon height={25} width={25} className="ml-auto text-zinc-600"/>
          </div>
  
          <div className="px-2 rounded-lg border hover:bg-zinc-100 flex items-center">
            <div className="rounded-full bg-pink-300 p-2 mr-2">
              <EnvelopeOpenIcon height={22} width={22} className="text-cyan-500" />
            </div>
            <div className="text-zinc-600 text-lg font-semibold px-1 py-3">
              Have an Invite?
            </div>
            <ChevronRightIcon height={25} width={25} className="ml-auto text-zinc-600"/>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
