import { PersonIcon, FrameIcon, Component1Icon } from "@radix-ui/react-icons";

export default function NavbarContent() {
  return (
    <div className="flex flex-row items-center justify-evenly bg-zinc-100 bg-opacity-90 w-full h-14 m-0 shadow-md rounded-lg">
      <Component1Icon
        height={20}
        width={20}
        className="tracking-wider font-semibold text-zinc-500 ml-2 my-auto"
      />
      <div className="text-xl text-zinc-500 tracking-wider font-semibold text-opacity-80 mr-auto ml-2 my-auto">
        general
      </div>
      <PersonIcon
        height={24}
        width={24}
        className="bg-zinc-400 text-zinc-200 mr-3 ml-4 transition duration-300 ease-in-out hover:text-blue-500 cursor-pointer rounded-3xl"
      />
    </div>
  );
}
