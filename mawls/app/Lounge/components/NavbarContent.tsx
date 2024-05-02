import { PersonIcon, FrameIcon, Component1Icon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavbarContent() {
  return (
    <div className="flex flex-row items-center justify-evenly bg-zinc-100 bg-opacity-90 w-full h-14 m-0 shadow-md border-b border-zinc-100">
      <Component1Icon
        height={20}
        width={20}
        className="tracking-wider font-semibold text-zinc-500 ml-2 my-auto"
      />
      <div className="text-xl text-zinc-500 tracking-wider font-semibold text-opacity-80 mr-auto ml-2 my-auto unselectable">
        main
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
          <DropdownMenuLabel className="text-blue-500">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
