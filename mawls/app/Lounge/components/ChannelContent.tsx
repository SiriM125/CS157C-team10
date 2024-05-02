import NavbarContent from "./NavbarContent";
import { PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  content: string;
  timestamp: string;
  user: string;
}

function MessageBar() {
  return (
    <div className="flex flex-row items-center justify-between fixed w-full bottom-6 rounded-lg shadow-lg bg-zinc-300 px-4 h-12">
      <PlusIcon scale={18} className="bg-zinc-500 text-zinc-300 rounded-3xl" />
      <input
        type="text"
        placeholder="Message"
        className="w-full bg-transparent outline-none ml-0 mr-auto px-2 text-zinc-700 cursor-text"
      />
    </div>
  );
}

function Message({ content, timestamp, user }: Message) {
  const abbreviatedUser = user
    .split(" ") // Split the name into words
    .map((word) => word.charAt(0)) // Extract the first character of each word
    .join(""); // Join the extracted characters together
  return (
    <div className="w-full flex flex-row items-center py-4 px-8 m-0">
      <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-12 w-12 unselectable">
        {abbreviatedUser}
      </div>

      <div className="flex flex-col justify-start ml-4">
        <div className="text-sm text-left font-semibold text-gray-800 mr-2">
          {user}
          <small className="text-xs text-left font-semibold text-zinc-500 ml-2">
            {timestamp}
          </small>
        </div>
        <div className="text-md text-left text-zinc-800 whitespace-normal mr-auto">
          {content}
        </div>
      </div>
    </div>
  );
}

export default function ChannelContent() {
  return (
    <div className="fixed pl-[304px] m-0 h-screen w-full overflow-hidden">
      <NavbarContent />
      <div className="flex-grow items-center h-full w-full mt-0 ml-0 mx-auto px-3 pb-[130px] bg-zinc-100">
        <div className="flex flex-row h-full">
          <ScrollArea className="flex-grow w-full">
            <Message
              content="Hey there! How's it going?"
              timestamp="2024-05-02 10:15 AM"
              user="Alice"
            />
            <Message
              content="I'm feeling great today! What about you?"
              timestamp="2024-05-02 10:20 AM"
              user="Bob"
            />
            <Message
              content="Just finished my morning workout 💪"
              timestamp="2024-05-02 10:30 AM"
              user="Charlie"
            />
            <Message
              content="Anyone up for a coffee break?"
              timestamp="2024-05-02 11:00 AM"
              user="David"
            />
            <Message
              content="Wow, it's already noon? Time flies!"
              timestamp="2024-05-02 12:05 PM"
              user="Eva"
            />
            <Message
              content="I'm stuck on this coding problem. Any ideas?"
              timestamp="2024-05-02 01:30 PM"
              user="Frank"
            />
            <Message
              content="Just got a new job offer! Excited but nervous 😬"
              timestamp="2024-05-02 02:15 PM"
              user="Grace"
            />
            <Message
              content="Happy Friday, everyone! Any plans for the weekend?"
              timestamp="2024-05-02 03:00 PM"
              user="Henry"
            />
            <Message
              content="Can't believe it's almost summer already!"
              timestamp="2024-05-02 04:20 PM"
              user="Ivy"
            />
            <Message
              content="Time to wrap up for the day. See you tomorrow!"
              timestamp="2024-05-02 05:45 PM"
              user="Jack"
            />
          </ScrollArea>
        </div>
      </div>
      <div className="px-3">
        <MessageBar />
      </div>
    </div>
  );
}
