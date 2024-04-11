import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  return (
    <nav className="text-black py-3 px-6 flex justify-between border-b border-gray-300">
      <div className="flex items-center">
        <Link href="/">
          <div className="flex justify-start">
            <Image
              src="/mawls_transparent.png"
              width={30}
              height={30}
              alt="mawls logo"
            />
            <div className="text-xl ml-2 mr-8 scale-125 text-blue-400">AWLS</div>
          </div>
        </Link>
        <ul className="flex space-x-4 items-end">
          <Link href="/">
            <div className="hover:text-gray-300">Features</div>
          </Link>
          <Link href="/">
            <div className="hover:text-gray-300">About Us</div>
          </Link>
        </ul>
      </div>
      <div className="lg:flex lg:flex-1 lg:justify-end">
          <a href="/login" className="text-sm font-semibold leading-7 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
    </nav>
  );
}

export default Navbar;
