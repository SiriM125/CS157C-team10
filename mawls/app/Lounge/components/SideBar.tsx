"use client";
import Image from "next/image";
import {
  PlusIcon,
  ChevronRightIcon,
  RocketIcon,
  EnvelopeOpenIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";

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
  const [createLounge, setCreateLounge] = useState(false);
  const [joinLounge, setJoinLounge] = useState(false);

  const back = () => {
    setCreateLounge(false);
    setJoinLounge(false);
  };

  function Create() {
    return (
      <>
        <DialogHeader className="text-zinc-800 items-center justify-center">
          <DialogTitle className="text-2xl">Setup Your Lounge</DialogTitle>
          <DialogDescription className="text-center" text-align="center">
            Give your new lounge a name. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Label className="text-lg p-0">Server Name</Label>
        <Input id="name" type="text" placeholder="Server" />
        <DialogFooter className="sm:justify-between">
          <Button onClick={back} className="bg-zinc-100 text-zinc-600 hover:bg-slate-200">
            Back
          </Button>
          <Button type="submit" className="bg-blue-500 text-zinc-100 hover:bg-blue-700 px-9">Create</Button>
        </DialogFooter>
      </>
    );
  }

  function Join() {
    return (
      <>
        <DialogHeader className="text-zinc-800 items-center justify-center">
          <DialogTitle className="text-2xl">Join a Server</DialogTitle>
          <DialogDescription className="text-center" text-align="center">
            Enter an invite below to join an existing server.
          </DialogDescription>
        </DialogHeader>
        <Label className="text-lg">Invite</Label>
        <Input id="invite" type="text" placeholder="Invite" />
        <DialogFooter className="sm:justify-between">
          <Button onClick={back} className="bg-zinc-100 text-zinc-600 hover:bg-slate-200">Back</Button>
          <Button type="submit" className="bg-blue-500 text-zinc-100 hover:bg-blue-700 px-9">Join</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-zinc-300">
      <DMIcon />
      <Divider />
      <LoungeIcon name="My Lounge" />
      <Dialog>
        <DialogTrigger>
          <AddIcon />
        </DialogTrigger>
        <DialogContent>
          {createLounge ? (
            <Create />
          ) : joinLounge ? (
            <Join />
          ) : (
            <>
              <DialogHeader className="text-zinc-800 items-center justify-center">
                <DialogTitle className="text-2xl">
                  Create Your Lounge
                </DialogTitle>
                <DialogDescription className="text-center" text-align="center">
                  Your lounge is where you and your classmates collaborate. Make
                  yours and start working.
                </DialogDescription>
              </DialogHeader>
              <div
                onClick={() => setCreateLounge(true)}
                className="px-2 rounded-lg border hover:bg-zinc-100 flex items-center"
              >
                <div className="rounded-full bg-violet-400 p-2 mr-2">
                  <RocketIcon
                    height={22}
                    width={22}
                    className="text-yellow-300"
                  />
                </div>
                <div className="text-zinc-600 text-lg font-semibold px-1 py-3">
                  Create My Own
                </div>
                <ChevronRightIcon
                  height={25}
                  width={25}
                  className="ml-auto text-zinc-600"
                />
              </div>

              <div
                onClick={() => setJoinLounge(true)}
                className="px-2 rounded-lg border hover:bg-zinc-100 flex items-center"
              >
                <div className="rounded-full bg-pink-300 p-2 mr-2">
                  <EnvelopeOpenIcon
                    height={22}
                    width={22}
                    className="text-cyan-500"
                  />
                </div>
                <div className="text-zinc-600 text-lg font-semibold px-1 py-3">
                  Have an Invite?
                </div>
                <ChevronRightIcon
                  height={25}
                  width={25}
                  className="ml-auto text-zinc-600"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
