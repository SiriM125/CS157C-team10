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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import React, { useState, useEffect, ChangeEvent } from "react";


interface Lounge {
  lounge_name: string;
  lounge_id: string;
  creator_id: string;
}

interface Props {
  selectLounge: (lounge: Lounge | null) => void;
  selectedLounge: Lounge | null;
  setSelectedLounge: React.Dispatch<React.SetStateAction<Lounge | null>>;
  lounges: Lounge[];
  setLounges: React.Dispatch<React.SetStateAction<Lounge[]>>;
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

function LoungeIcon({
  lounge,
  selectedLounge,
  setSelectedLounge,
  selectLounge,
}: {
  lounge: Lounge;
  selectedLounge: Lounge | null;
  setSelectedLounge: React.Dispatch<React.SetStateAction<Lounge | null>>;
  selectLounge: (lounge : Lounge | null) => Promise<void> | void;
}) {

  const { toast } = useToast();

  const abbreviatedName = lounge.lounge_name?.split(" ")
    .map((word: string) => word.charAt(0))
    .join("").toUpperCase()

  const toggleSelection = () => {
    if (!selectedLounge || selectedLounge.lounge_id !== lounge.lounge_id) {
      selectLounge(lounge);
      setSelectedLounge(lounge);
    } else {
      selectLounge(null);
      setSelectedLounge(null);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(lounge.lounge_id);
    toast({
      title: "Lounge id copied!",
      description: "Copied lounge id.",
    });
  };

  return (
    <div
      onClick={toggleSelection}
      className={`group
      ${selectedLounge?.lounge_id === lounge.lounge_id ? "lounge-selected" : "lounge-icon"}`}
    >
      {abbreviatedName}
      <span className="lounge-tooltip group-hover:scale-75 bg-blue-300">
          {lounge.lounge_name}
          <br></br> 
          ID :
          <span onClick={(e) => {
            e.stopPropagation(); 
            handleCopyToClipboard();
          }}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}>
          {lounge.lounge_id}
        </span>

      </span>
    </div>
  );
}



const Divider = () => <hr className="lounge-hr" />;

export default function Lounge({ 
  selectLounge, 
  selectedLounge, 
  setSelectedLounge,
  lounges,
  setLounges
}: Props) {
  const [createLounge, setCreateLounge] = useState(false);
  const [joinLounge, setJoinLounge] = useState(false);

  const [loungeId, setLoungeId] = useState("");
  const [loungeName, setLoungeName] = useState("");
  const [userid, setUserid] = useState("");
  // const [selectedLounge, setSelectedLounge] = useState<Lounge | null>(null);
  const [currentLounge, setCurrentLounge] = useState<Lounge | null>(null);
  const { toast } = useToast();

  
  const fetchLounges = (user: string) => {
    console.log("fetch: " + user)
    fetch(`/api/user_lounges/${user}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to get lounges");
        }
      })
      .then((data) => {
        setLounges(data.lounges);
        console.log(data.lounges);
      })
      .catch((error) => {
        console.error("Error fetching lounges:", error);
      });
  };

  const fetchUserId = () => {
    fetch("/api/user_id")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to get userid");
        }
      })
      .then((data) => {
        setUserid(data.user_id);
        fetchLounges(data.user_id);
      })
      .catch((error) => {
        console.error("Error fetching userid:", error);
      });
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const submitJoin = async () => {
    try {
      if (loungeId == null || loungeId == ""){
        throw new Error("Invalid input.")
      }
      const res = await fetch(`/api/enter_lounge/${userid}/${loungeId}`);
      setLoungeId("")
      if (res.ok) {
        toast({
          title: "Success!",
          description: "Lounge joined.",
        });
        fetchUserId();
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Error occured joining lounge.",
        });
      }
    } catch (err) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Error occured joining lounge.",
      });
    }
  };

  const submitCreate = async () => {
    try {
      if (loungeName == null || loungeName == "" || !loungeName.trim()){
        throw new Error("Invalid input.")
      }
      const res = await fetch(`/api/create_lounge/${loungeName}/${userid}`);
      setLoungeName("");
      if (res.ok) {
        toast({
          title: "Success!",
          description: "Lounge created.",
        });
        fetchUserId();
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Error occured creating lounge.",
        });
      }
    } catch (err) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Error occured creating lounge.",
      });
    }
  };

  const onChangeLoungeName = (e: ChangeEvent<HTMLInputElement>) => {
    setLoungeName(e.target.value);
  };

  const onChangeInvite = (e: ChangeEvent<HTMLInputElement>) => {
    setLoungeId(e.target.value);
  };

  const back = () => {
    setCreateLounge(false);
    setJoinLounge(false);
  };
  

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-zinc-300">
      <Toaster />
      <DMIcon />
      <Divider />
      {/* <div style={{ overflowY: "auto", overflowX: "hidden", maxHeight: "screen", scrollbarWidth: "none", msOverflowStyle: "none" }}> */}
      {lounges &&
        lounges.length > 0 &&
        lounges.map((lounge) => (
          
          <LoungeIcon
            key={lounge.lounge_id}
            lounge={lounge}
            selectedLounge={selectedLounge}
            setSelectedLounge={setSelectedLounge}
            selectLounge={selectLounge}
          />
        
        ))}
        {/* </div> */}
      <Dialog>
        <DialogTrigger>
          <Divider />
          <AddIcon />
        </DialogTrigger>
        <DialogContent>
          {createLounge ? (
            <>
              <DialogHeader className="text-zinc-800 items-center justify-center">
                <DialogTitle className="text-2xl">
                  Setup Your Lounge
                </DialogTitle>
                <DialogDescription className="text-center" text-align="center">
                  Give your new lounge a name. You can always change it later.
                </DialogDescription>
              </DialogHeader>
              {/* <form onSubmit={submitCreate}> */}
                <Label className="text-lg p-0">Server Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Server"
                  onChange={onChangeLoungeName}
                  value={loungeName}
                />
                <DialogFooter className="sm:justify-between">
                  <Button
                    onClick={back}
                    className="bg-zinc-100 text-zinc-600 hover:bg-slate-200"
                  >
                    Back
                  </Button>
                  <DialogClose asChild>
                  <Button
                    onClick={submitCreate}
                    type="submit"
                    className="bg-blue-500 text-zinc-100 hover:bg-blue-700 px-9"
                  >
                    Create
                  </Button>
                  </DialogClose>
                </DialogFooter>
              {/* </form> */}
            </>
          ) : joinLounge ? (
            <>
              <DialogHeader className="text-zinc-800 items-center justify-center">
                <DialogTitle className="text-2xl">Join a Server</DialogTitle>
                <DialogDescription className="text-center" text-align="center">
                  Enter an invite below to join an existing server.
                </DialogDescription>
              </DialogHeader>
              {/* <form onSubmit={submitJoin}> */}
                <Label className="text-lg">Invite</Label>
                <Input
                  id="invite"
                  type="text"
                  placeholder="Invite"
                  onChange={onChangeInvite}
                  value={loungeId}
                />
                <DialogFooter className="sm:pt-4 sm:justify-between">
                  <Button
                    onClick={back}
                    className="bg-zinc-100 text-zinc-600 hover:bg-slate-200"
                  >
                    Back
                  </Button>
                  <DialogClose asChild>
                  <Button
                    onClick={submitJoin}
                    type="submit"
                    className="bg-blue-500 text-zinc-100 hover:bg-blue-700 px-9"
                  >
                    Join
                  </Button>
                  </DialogClose>
                </DialogFooter>
              {/* </form> */}
            </>
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
