"use client";
import {
  ChevronDownIcon,
  PlusIcon,
  Component1Icon,
  ChevronRightIcon,
  GearIcon
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState, ChangeEvent } from "react";

interface ChannelTabProps {
  channel: Channel;
  selectChannel: (channel: Channel | null) => Promise<void> | void;
  selectedChannel: Channel | null;
}

interface Channel {
  channel_id: string;
  channel_name: string;
}

interface ChevronProps {
  expanded: boolean;
}

interface UserProps {
  user: string;
}

interface Lounge {
  lounge_name: string;
  lounge_id: string;
  creator_id: string;
}

interface Props {
  selectedLounge: Lounge | null;
  setSelectedLounge: (lounge: Lounge | null) => void;
  selectChannel: (channel: Channel | null) => Promise<void> | void;
  selectedChannel: Channel | null;
  lounges: Lounge[];
  setLounges: React.Dispatch<React.SetStateAction<Lounge[]>>;
}

function UserInfo({ user }: UserProps) {
  const abbreviatedUser = user
    .split(" ") // Split the name into words
    .map((word) => word.charAt(0)) // Extract the first character of each word
    .join(""); // Join the extracted characters together
  return (
    <div className="flex">
      <div className="flex rounded-lg hover:bg-zinc-100 p-1">
        <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-8 w-8 unselectable">
          {abbreviatedUser}
        </div>

        <div className="text-md ml-1 tracking-wider text-zinc-500 my-auto align-middle unselectable">
          {user}
        </div>
      </div>
    </div>
  );
}

export default function Channels({
  selectedLounge, 
  setSelectedLounge, 
  selectChannel, 
  selectedChannel, 
  lounges,
  setLounges
}: Props) {
  
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);

  const [channelName, setChannelName] = useState("");
  const [createChannel, setCreateChannel] = useState(false);

  const [showChoiceDialog, setShowChoiceDialog] = useState(false);
  const [selectedChannelState, setSelectedChannelState] = useState<Channel | null>(null);

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [showLoungeDialog, setShowLoungeDialog] = useState(false);
  const [showLoungeRenameDialog, setShowLoungeRenameDialog] = useState(false);
  const [newLoungeName, setNewLoungeName] = useState("");

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);


  const [newChannelName, setNewChannelName] = useState("");

  const { toast } = useToast();

  const openDialog = (channel: Channel) => {
    setSelectedChannelState(channel);
    setShowChoiceDialog(true);
  };

  const closeDialog = () => {
    setShowChoiceDialog(false);
    setSelectedChannelState(null);
    setNewChannelName("");
  };

  const handleRename = () => {
    if (selectedChannelState) {
      setShowChoiceDialog(false);
      setShowRenameDialog(true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewChannelName(e.target.value);
  };

  const handleDelete = () => {
    if (selectedChannelState) {
      setShowChoiceDialog(false);
      setShowDeleteConfirmation(true);
    }
  };

  useEffect(() => {
    //Fetch username
    fetch("/api/get_username")
      .then((response) => response.json())
      .then((data) => setUsername(data.username))
      .catch((error) => console.error("Error fetching username:", error));

    fetch("/api/get_user_id")
    .then((response) => response.json())
      .then((data) => setUserId(data.user_id))
      .catch((error) => console.error("Error fetching user id:", error));

    if (selectedLounge) {
      //Fetch channels for the selected lounge
      fetch(`/api/lounge_channels/${selectedLounge.lounge_id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch channels");
          }
          return response.json();
        })
        .then((data) => {
          // Extract channel names from the data
          const channelList: Channel[] = data.channels;
          setChannels(channelList);
        })
        .catch((error) => console.error("Error fetching channels:", error));
    } else {
      // If no lounge is selected, set channels to empty
      setChannels([]);
    }
  }, [selectedLounge]);

  const back = () => {
    setCreateChannel(false);
    //setRenameChannel(false);
  };

  const submitCreate = async () => {
    try {
      if (channelName == null || channelName == "" || !channelName.trim()) {
        throw new Error("Invalid input.");
      }
      const res = await fetch(`/api/create_channel/${channelName}/${selectedLounge?.lounge_id}`, {
        method: "POST",
      });
      
      if (res.ok) {
        const data = await res.json();
        setChannels((prevChannels) => [
          ...prevChannels,
          { channel_id: data.channel_id, channel_name: channelName },
        ]);
        setChannelName("");
        toast({
          title: "Success!",
          description: "Channel created.",
        });
        setCreateChannel(false);
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Error occurred creating channel.",
        });
      }
    } catch (err) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Error occurred creating channel.",
      });
    }
  };

  const submitRename = async () => {
    try {
      if (!selectedChannelState || !newChannelName.trim()) {
        throw new Error("Invalid input.");
      }
  
      const res = await fetch(`/api/rename_channel/${newChannelName}/${selectedChannelState.channel_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (res.ok) {
        const updatedChannel = { ...selectedChannelState, channel_name: newChannelName };
        setChannels((prevChannels) =>
          prevChannels.map((channel) =>
            channel.channel_id === updatedChannel.channel_id ? updatedChannel : channel
          )
        );
        setNewChannelName("");
        toast({
          title: "Success!",
          description: "Channel renamed successfully.",
        });
        setCreateChannel(false);
        setShowRenameDialog(false);
        
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "Error occurred renaming channel.",
        });
      }
    } catch (err) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Error occurred renaming channel.",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      if (!selectedChannelState) return;

      const res = await fetch(
        `/api/delete_channel/${selectedChannelState.channel_id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Filter out the deleted channel from the channels list
        setChannels((prevChannels) =>
          prevChannels.filter(
            (channel) => channel.channel_id !== selectedChannelState.channel_id
          )
        );
        setSelectedChannelState(null)

        toast({
          title: "Success!",
          description: "Channel deleted successfully.",
        });
        setShowChoiceDialog(false);
        setShowDeleteConfirmation(false);
      } else {
        throw new Error("Failed to delete channel");
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast({
        title: "Error!",
        description: "Failed to delete channel.",
      });
    }
  };


  // Lounge gear icon stuff

  const handleGearIconClick = () => {
    setShowLoungeDialog(true);
  };

  const handleLoungeAction = (action: 'rename' | 'delete' | 'leave') => {
    setShowLoungeDialog(false);
    if (action === 'rename') {
      setShowLoungeRenameDialog(true);
    } else if (action === 'delete') {
      // Implement delete logic here
      console.log('Delete lounge');
    } else if (action === 'leave') {
      setShowExitConfirmation(true);
    }
  };  

  const handleLoungeRename = async () => {
    try {
      if (!selectedLounge || !newLoungeName.trim()) {
        throw new Error("Invalid input.");
      }

      const res = await fetch(`/api/rename_lounge/${newLoungeName}/${selectedLounge.lounge_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (res.ok) {
        const updatedLounge = { ...selectedLounge, lounge_name: newLoungeName };
        setSelectedLounge(updatedLounge);

        // Update lounges in Sidebar
        const updatedLounges = lounges.map((lounge) =>
          lounge.lounge_id === updatedLounge.lounge_id ? updatedLounge : lounge
        );
        setLounges(updatedLounges);



        toast({
          title: "Success!",
          description: "Lounge renamed successfully.",
        });
        setShowLoungeRenameDialog(false);
        
      } else {
        throw new Error("Failed to rename lounge");
      }
    } catch (err) {
      console.error("Error renaming lounge:", err);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Error occurred renaming lounge.",
      });
    }
  };

  const handleExitLounge = async () => {
    if (selectedLounge && userId) {
      try {
        const response = await fetch(`/api/leave_lounge/${userId}/${selectedLounge.lounge_id}`, {
          method: 'PUT',
        });

        if (response.ok) {
          const updatedLounges = lounges.filter(lounge => lounge.lounge_id !== selectedLounge.lounge_id);
          setLounges(updatedLounges)
          setSelectedLounge(null);
          setShowExitConfirmation(false);
          toast({ description: 'Exited lounge successfully.'});
          
        } else {
          toast({ description: 'Failed to exit lounge: problem with backend'});
        }

      } catch (error) {
        console.error('Error exiting lounge:', error);
        toast({ description: 'Failed to exit lounge.', variant: 'destructive' });
      }
    }
  };


  return (
    <div className="fixed w-60 h-screen left-0 m-0 ml-16 bg-zinc-200 overflow-hidden">
      <div className="flex items-center justify-center mr-2 h-14 m-0 p-0 bg-zinc-200 border-b border-zinc-300">
        <div className="text-lg tracking-wider font-bold text-blue-500 mr-auto ml-4 my-auto align-middle unselectable">
          {selectedLounge ? selectedLounge.lounge_name : "Select Lounge"}
        </div>
          {selectedLounge && (
            <GearIcon
              className="w-6 h-6 text-gray-400 cursor-pointer"
              onClick={handleGearIconClick}
            />
          )}
      </div>
      <div className="flex flex-col items-center justify-start p-1 m-0">
        {channels.map((channel) => (
          <ChannelTab
            key={channel.channel_id}
            channel={channel}
            selectChannel={selectChannel}
            selectedChannel={selectedChannel}
            onGearIconClick={() => openDialog(channel)}
          />
        ))}

      {/* Add Channel Button */}
        {selectedLounge && (
          <button
            onClick={() => setCreateChannel(true)}
            className="flex flex-row items-center justify-evenly mt-1 mr-auto ml-2 transition duration-300 ease-in-out bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none text-sm"
          >
            <PlusIcon className="text-white" />
            <span className="ml-1">Add Channel</span>
          </button>
        )}
      </div>
      
      {/* Popup for adding channels */}
      {createChannel && (
        <Dialog open={createChannel} onOpenChange={setCreateChannel}>
          <DialogContent>
            <DialogHeader className="text-zinc-800 items-center justify-center">
              <DialogTitle className="text-2xl">Setup Your Channel</DialogTitle>
              <DialogDescription className="text-center">
                Give your new channel a name. You can always change it later.
              </DialogDescription>
            </DialogHeader>
            <Label className="text-lg p-0">Channel Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Channel"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
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
          </DialogContent>
        </Dialog>
      )}

      {/* Popup dialog */}
      <Dialog open={showChoiceDialog} onOpenChange={setShowChoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Channel Options: {selectedChannelState?.channel_name}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button className="block w-full text-center px-2 py-1 text-blue-500 hover:bg-blue-500 hover:text-white" onClick={handleRename}>Rename</Button>
            <Button className="block w-full text-center px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader className="text-zinc-800 items-center justify-center">
            <DialogTitle className="text-2xl">Rename Your Channel</DialogTitle>
            <DialogDescription className="text-center">
              Give your channel a new name.
            </DialogDescription>
          </DialogHeader>
          <Label className="text-lg p-0">New Channel Name</Label>
          <Input
            id="newChannelName"
            type="text"
            placeholder="New Channel Name"
            onChange={handleChange}
            value={newChannelName}
          />
          <DialogFooter className="sm:justify-between">
            <Button
              onClick={() => {
                setShowRenameDialog(false);
                setSelectedChannelState(null);
                setNewChannelName("");
              }}
              className="bg-zinc-100 text-zinc-600 hover:bg-slate-200"
            >
              Cancel
            </Button>
            <DialogClose asChild>
              <Button
                onClick={submitRename}
                type="submit"
                className="bg-blue-500 text-zinc-100 hover:bg-blue-700 px-9"
              >
                Rename
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <DialogContent>
          <DialogHeader className="text-zinc-800 items-center justify-center">
            <DialogTitle className="text-2xl">
              Are you sure you want to delete this channel?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              className="bg-zinc-100 text-zinc-600 hover:bg-slate-200"
            >
              Cancel
            </Button>
            <DialogClose asChild>
              <Button
                onClick={confirmDelete}
                type="button"
                className="bg-red-500 text-zinc-100 hover:bg-red-700 px-9"
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Lounge Dialogs From Here*/}

      {/* Dialog for lounge actions */}
      <Dialog open={showLoungeDialog} onOpenChange={setShowLoungeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Lounge</DialogTitle>
            <DialogDescription>
              What would you like to do with this lounge?
            </DialogDescription>
          </DialogHeader>
          {selectedLounge?.creator_id === userId ? (
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleLoungeAction('rename')} className="mb-2">
                Rename Lounge
              </Button>
              <Button onClick={() => handleLoungeAction('delete')} variant="destructive">
                Delete Lounge
              </Button>
            </div>
          ) : (
            <Button onClick={() => handleLoungeAction('leave')} variant="destructive">
              Leave Lounge
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      
      {/* Rename Lounge Dialog */}
      {showLoungeRenameDialog && (
        <Dialog open={showLoungeRenameDialog} onOpenChange={() => setShowLoungeRenameDialog(false)}>
          <DialogContent>
          <DialogHeader className="text-zinc-800 items-center justify-center">
            <DialogTitle>Rename Lounge</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">
              Give your channel a new name.
          </DialogDescription>
            <Input
              id="newLoungeName"
              type="text"
              value={newLoungeName}
              placeholder="New Lounge Name"
              onChange={(e) => setNewLoungeName(e.target.value)}
            />
          <DialogFooter>
            <Button onClick={handleLoungeRename}>
              Rename
            </Button>
            <Button onClick={() => setShowLoungeRenameDialog(false)} variant="secondary">
              Cancel
            </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Exit Lounge Confirmation Dialog */}
      {showExitConfirmation && (
        <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Exit</DialogTitle>
              <DialogDescription>
                Are you sure you want to exit this lounge?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleExitLounge}>Yes</Button>
              <DialogClose asChild>
                <Button variant="secondary">No</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="fixed bottom-0 w-60 h-12 m-0 p-0 pt-1 px-1 bg-zinc-300 border-t border-zinc-400">
        <UserInfo user={username} />
      </div>
    </div>
  );
}

const ChannelTab = ({
  channel,
  selectChannel,
  selectedChannel,
  onGearIconClick,
}: ChannelTabProps & { onGearIconClick: () => void }) => {
  const toggleSelection = () => {
    if (!selectedChannel || selectedChannel.channel_id !== channel.channel_id) {
      selectChannel(channel);
    } else {
      selectChannel(null);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between w-full mt-1 mr-4 ml-4 transition duration-300 ease-in-out">
      <div
        className="flex flex-row items-center cursor-pointer"
        onClick={toggleSelection}
      >
        <Component1Icon scale={24} className="text-zinc-400" />
        <div
          className={`font-semibold tracking-wider ml-2 transition duration-300 ease-in-out unselectable ${
            selectedChannel && selectedChannel.channel_id === channel.channel_id
              ? "text-blue-500"
              : "text-zinc-500 hover:text-blue-500"
          }`}
        >
          {channel.channel_name}
        </div>
      </div>
      <div className="ml-auto">
        <GearIcon
          scale={24}
          className="text-zinc-400 cursor-pointer"
          onClick={onGearIconClick}
        />
      </div>
    </div>
  );
};


// "use client";

// import {
//   ChevronDownIcon,
//   PlusIcon,
//   Component1Icon,
//   ChevronRightIcon,
// } from "@radix-ui/react-icons";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import React, { useEffect, useState } from "react";

// interface ChannelGroupProps {
//   channelGroup: string;
//   channels: string[];
//   selectChannel: (channel : string | null) => Promise<void> | void;
//   selectedChannel: string | null;
// }

// interface ChannelTabProps {
//   channel: string;
//   selectChannel: (channel : string | null) => Promise<void> | void;
//   selectedChannel: string | null;
// }

// interface ChevronProps {
//   expanded: boolean;
// }

// interface UserProps{
//   user: string;
// }

// interface Lounge {
//   lounge_name: string;
//   lounge_id: string;
// }

// interface Props {
//   selectedLounge: Lounge | null;
//   selectChannel: (channel : string | null) => Promise<void> | void;
//   selectedChannel: string | null;
// }



// function UserInfo ({user}: UserProps) {
//   const abbreviatedUser = user
//     .split(" ") // Split the name into words
//     .map((word) => word.charAt(0)) // Extract the first character of each word
//     .join(""); // Join the extracted characters together
//   return (
//     <div className="flex">
//       <div className="flex rounded-lg hover:bg-zinc-100 p-1">
//       <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-8 w-8 unselectable">
//         {abbreviatedUser}
//       </div>

//       <div className="text-md ml-1 tracking-wider text-zinc-500 my-auto align-middle unselectable">
//         {user}
//       </div>
//       </div>
//     </div>
//   );
// }

// export default function Channels({selectedLounge, selectChannel, selectedChannel}: Props) {
//   const [username, setUsername] = useState("");


//   useEffect(() => {
//     //Fetch username
//     fetch("/api/get_username")
//       .then((response) => response.json())
//       .then((data) => setUsername(data.username))
//       .catch((error) => console.error("Error fetching username:", error));
//     if (!selectedLounge){
//       selectChannel(null)
//     }
//   }, []);

//   return (
//     <div className="fixed w-60 h-screen left-0 m-0 ml-16 bg-zinc-200 overflow-hidden">
//       <div className="flex items-center justify-center h-14 m-0 p-0 bg-zinc-200 border-b border-zinc-300">
//         <div className="text-lg tracking-wider font-bold text-blue-500 mr-auto ml-4 my-auto align-middle unselectable">
//           {selectedLounge ? selectedLounge.lounge_name : "Select Lounge"}
//         </div>
//       </div>
//       {selectedLounge && (
//         <div className="flex flex-col items-center justify-start p-1 m-0">
//         <ChannelGroup channelGroup="text" channels={["main", "off-topic"]} selectChannel={selectChannel} selectedChannel={selectedChannel}/>
//         <ChannelGroup channelGroup="help" channels={["lecture", "homework"]} selectChannel={selectChannel} selectedChannel={selectedChannel}/>
//       </div>
//       )}
      
//       <div className="fixed bottom-0 w-60 h-12 m-0 p-0 pt-1 px-1 bg-zinc-300 border-t border-zinc-400">
//         <UserInfo user={username}/>
//       </div>
//     </div>
//   );
// }

// const ChannelTab = ({ channel, selectChannel, selectedChannel }: ChannelTabProps) => {
//   const toggleSelection = () => {
//     if (!selectedChannel || selectedChannel !== channel) {
//       selectChannel(channel)
//     } else {
//       // change to null if you want to deselect to no channel
//       selectChannel(channel)
//     }
//   };

//   return (
//     <div onClick={toggleSelection} className="flex flex-row items-center justify-evenly mt-1 mr-auto ml-2 transition duration-300 ease-in-out">
//       <Component1Icon scale={24} className="text-zinc-400" />
//       <div className="text-zinc-500 font-semibold tracking-wider mr-auto transition duration-300 ease-in-out cursor-pointer hover:text-blue-400 unselectable">
//         {channel}
//       </div>
//     </div>
//   );
// };

// const ChannelGroup = ({ channelGroup, channels, selectChannel, selectedChannel }: ChannelGroupProps) => {
//   const [expanded, setExpanded] = useState(true);
//   return (
//     <div className="m-0 w-full px-2 pb-2 transition duration-300 ease-in-out">
//       <div
//         onClick={() => setExpanded(!expanded)}
//         className="flex flex-row items-center justify-evenly mx-0 text-zinc-500 cursor-pointer"
//       >
//         <ChevronIcon expanded={expanded} />
//         <h5
//           className={
//             expanded
//               ? "text-blue-500 text-opacity-90 text-lg font-bold unselectable"
//               : "text-zinc-500 text-opacity-90 text-lg font-semibold unselectable cursor-default"
//           }
//         >
//           {channelGroup}
//         </h5>
//         <PlusIcon scale={12} className="text-zinc-500 my-auto ml-auto" />
//       </div>
//       {expanded &&
//         channels &&
//         channels.map((channel) => <ChannelTab key={channel} channel={channel} selectChannel={selectChannel} selectedChannel={selectedChannel} />)}
//     </div>
//   );
// };

// const ChevronIcon = ({ expanded }: ChevronProps) => {
//   const chevClass = "text-zinc-500 my-auto mr-1";
//   return expanded ? (
//     <ChevronDownIcon scale={14} className={chevClass} />
//   ) : (
//     <ChevronRightIcon scale={14} className={chevClass} />
//   );
// };
