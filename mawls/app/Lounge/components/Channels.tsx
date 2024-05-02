"use client";

import {
  ChevronDownIcon,
  PlusIcon,
  Component1Icon,
} from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";

interface ChannelGroupProps {
  channelGroup: string;
  channels: string[];
}

interface ChannelTabProps {
  channel: string;
}

const ChannelTab = ({ channel }: ChannelTabProps) => {
  return (
    <div className="flex flex-row items-center justify-evenly mt-1 mr-auto ml-2 transition duration-300 ease-in-out cursor-pointer">
      <Component1Icon height={24} width={24} className="text-zinc-400" />
      <h5 className="text-zinc-500 text-opacity-90 text-lg font-semibold cursor-default">
        {channel}
      </h5>
    </div>
  );
};

const ChannelGroup = ({ channelGroup, channels }: ChannelGroupProps) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="m-0 w-full px-2 pb-2 transition duration-300 ease-in-out">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex flex-row items-center justify-evenly mx-0 text-zinc-500 cursor-pointer"
      >
        <h5
          className={
            expanded ? "text-blue-500 text-opacity-90 text-lg font-bold" : "text-zinc"
          }
        >
          {channelGroup}
        </h5>
        {expanded && channels && channels.map((channel) => <ChannelTab channel={channel} />)}
      </div>
    </div>
  );
};

export default function Channels() {
  return (
    <div className="w-60 h-screen m-0 ml-16 bg-zinc-200 overflow-hidden">
      <div className="flex items-center justify-center h-14 m-0 p-0 shadow-md rounded-lg bg-zinc-200">
        <div className="text-lg tracking-wider font-bold text-blue-500 mr-auto ml-4 my-auto align-middle">
          My Lounge
        </div>
      </div>
      <ScrollArea>
        <div className="flex flex-col items-center justify-start p-1 m-0">
          <ChannelGroup
            channelGroup="text"
            channels={["general", "off-topic"]}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
