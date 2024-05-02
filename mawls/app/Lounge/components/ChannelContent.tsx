import NavbarContent from "./NavbarContent";
import { PlusIcon } from "@radix-ui/react-icons";

function MessageBar() {
  return (
    <div className="flex flex-row items-center justify-between fixed w-full bottom-6 rounded-lg shadow-lg bg-zinc-300 px-4 h-12">
      <PlusIcon scale={18} className="bg-zinc-500 text-zinc-300 rounded-3xl"/>
      <input
        type="text"
        placeholder="Message"
        className="w-full bg-transparent outline-none ml-0 mr-auto px-2 text-zinc-700 cursor-text"
      />
    </div>
  );
}

export default function ChannelContent() {
  return (
    <div className=" flex-grow bg-zinc-100 m-0 ml-76 h-full overflow-hidden">
      <NavbarContent />
      <div className="flex flex-grow items-center h-screen w-full mt-0 ml-0 mx-auto px-3 pb-12">
        <MessageBar />
      </div>
    </div>
  );
}
