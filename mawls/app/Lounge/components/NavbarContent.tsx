'use client'
import {
  PersonIcon,
  ExitIcon,
  Component1Icon,
  GearIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface Lounge {
  lounge_name: string;
  lounge_id: string;
}

interface Channel {
  channel_id: string;
  channel_name: string;
}

interface Props {
  selectedLounge: Lounge | null;
  selectedChannel: Channel | null;
}

export default function NavbarContent({selectedLounge, selectedChannel}: Props) {
  //Fetch username
  const [username, setUsername] = useState("");

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/logout`);
      if (response.ok) {
        // Redirect to login page after successful logout
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetch('/api/get_username')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get username');
        }
      })
      .then(data => {
        setUsername(data.username);
      })
      .catch(error => {
        console.error('Error fetching username:', error);
      });
  }, []);

  return (
    <div className="flex flex-row items-center justify-evenly bg-zinc-100 w-full h-14 m-0 shadow-md border-b border-zinc-300">
      <Component1Icon
        height={20}
        width={20}
        className="tracking-wider font-semibold text-zinc-500 ml-2 my-auto"
      />
      <div className="text-xl text-zinc-500 tracking-wider font-semibold text-opacity-80 mr-auto ml-2 my-auto unselectable">
      {selectedLounge && selectedChannel ? selectedChannel.channel_name : "select channel"}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <PersonIcon
            height={24}
            width={24}
            className="bg-zinc-300 text-zinc-100 mr-3 ml-4 transition duration-300 ease-in-out hover:text-blue-500 cursor-pointer rounded-3xl"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-blue-500">
            {username}'s Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>
              <PersonIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>
              <GearIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href="/login" onClick={handleLogout}>
            <DropdownMenuItem
              className="text-red-500 focus:bg-red-500 focus:text-white"
            >
              Logout
              <DropdownMenuShortcut>
                <ExitIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
