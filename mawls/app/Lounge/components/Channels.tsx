"use client";
import {
  ChevronDownIcon,
  PlusIcon,
  Component1Icon,
  ChevronRightIcon,
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
}

interface Props {
  selectedLounge: Lounge | null;
  selectChannel: (channel: Channel | null) => Promise<void> | void;
  selectedChannel: Channel | null;
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

export default function Channels({selectedLounge, selectChannel, selectedChannel,}: Props) {
  
  const [username, setUsername] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);

  const [channelName, setChannelName] = useState("");
  const [createChannel, setCreateChannel] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    //Fetch username
    fetch("/api/get_username")
      .then((response) => response.json())
      .then((data) => setUsername(data.username))
      .catch((error) => console.error("Error fetching username:", error));

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


  const handleAddChannel = () => {
    // Implement your logic to add a new channel here
    console.log("Add channel functionality to be implemented.");
  };


  const onChangeChannelName = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const back = () => {
    setCreateChannel(false);
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

  return (
    <div className="fixed w-60 h-screen left-0 m-0 ml-16 bg-zinc-200 overflow-hidden">
      <div className="flex items-center justify-center h-14 m-0 p-0 bg-zinc-200 border-b border-zinc-300">
        <div className="text-lg tracking-wider font-bold text-blue-500 mr-auto ml-4 my-auto align-middle unselectable">
          {selectedLounge ? selectedLounge.lounge_name : "Select Lounge"}
        </div>
      </div>
      <div className="flex flex-col items-center justify-start p-1 m-0">
        {channels.map((channel) => (
          <ChannelTab
            key={channel.channel_id}
            channel={channel}
            selectChannel={selectChannel}
            selectedChannel={selectedChannel}
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
                onClick={() => setCreateChannel(false)}
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
}: ChannelTabProps) => {
  const toggleSelection = () => {
    if (!selectedChannel || selectedChannel.channel_id !== channel.channel_id) {
      selectChannel(channel);
    } else {
      // change to null if you want to deselect to no channel
      selectChannel(null);
    }
  };

  return (
    <div
      onClick={toggleSelection}
      className="flex flex-row items-center justify-evenly mt-1 mr-auto ml-2 transition duration-300 ease-in-out"
    >
      <Component1Icon scale={24} className="text-zinc-400" />
      <div className="text-zinc-500 font-semibold tracking-wider mr-auto transition duration-300 ease-in-out cursor-pointer hover:text-blue-400 unselectable">
        {channel.channel_name}
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
