"use client";

import {
  ChevronDownIcon,
  PlusIcon,
  Component1Icon,
  ChevronRightIcon,
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

interface ChevronProps {
  expanded: boolean;
}

const ChannelTab = ({ channel }: ChannelTabProps) => {
  return (
    <div className="flex flex-row items-center justify-evenly mt-1 mr-auto ml-2 transition duration-300 ease-in-out">
      <Component1Icon scale={24} className="text-zinc-400" />
      <div className="text-zinc-500 font-semibold tracking-wider mr-auto transition duration-300 ease-in-out cursor-pointer hover:text-blue-400 unselectable">
        {channel}
      </div>
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
        <ChevronIcon expanded={expanded}/>
        <h5
          className={
            expanded ? "text-blue-500 text-opacity-90 text-lg font-bold unselectable" : "text-zinc-500 text-opacity-90 text-lg font-semibold unselectable cursor-default"
          }
        >
          {channelGroup}
        </h5>
        <PlusIcon scale={12} className="text-zinc-500 my-auto ml-auto"/>
        </div>
        {expanded && channels && channels.map((channel) => <ChannelTab channel={channel} />)}
    </div>
  );
};

export default function Channels() {
  return (
    <div className="w-60 h-screen m-0 ml-16 bg-zinc-200 overflow-hidden">
      <div className="flex items-center justify-center h-14 m-0 p-0 shadow-md bg-zinc-200 border-b border-zinc-300">
        <div className="text-lg tracking-wider font-bold text-blue-500 mr-auto ml-4 my-auto align-middle unselectable">
          My Lounge
        </div>
      </div>
        <div className="flex flex-col items-center justify-start p-1 m-0">
          <ChannelGroup
            channelGroup="text"
            channels={["main", "off-topic"]}
          />
          <ChannelGroup
            channelGroup="help"
            channels={["lecture", "homework"]}
          />
        </div>
    </div>
  );
}

const ChevronIcon = ({expanded}:ChevronProps) => {
  const chevClass = 'text-zinc-500 my-auto mr-1'
  return expanded ? (
    <ChevronDownIcon scale={14} className={chevClass}/>
  ) : (
    <ChevronRightIcon scale={14} className={chevClass}/>
  );
}
