import React, { useRef, useEffect, useState, useLayoutEffect, ChangeEvent } from 'react';
import NavbarContent from "./NavbarContent";
import { PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  content: string;
  timestamp: string;
  user: string;
  sender_id: string;
}

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

export default function ChannelContent({ selectedLounge, selectedChannel }: Props) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (message !== '') {
        console.log(message);
        setMessage('');
      }
    }
  };

  const onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  
  function Message({ content, timestamp, user }: Message) {
    const abbreviatedUser = user
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
    return (
      <div className="w-full flex flex-row items-center py-4 px-8 m-0 hover:bg-zinc-200">
        <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-12 w-12 unselectable">
          {abbreviatedUser}
        </div>

        <div className="flex flex-col justify-start ml-4">
          <div className="text-sm text-left font-semibold text-gray-800 mr-2">
            {user}
            <small className="text-xs text-left font-semibold text-zinc-500 ml-2">{timestamp}</small>
          </div>
          <div className="text-md text-left text-zinc-800 whitespace-normal mr-auto">{content}</div>
        </div>
      </div>
    );
  }

  const scrollableContainerRef = useRef(null);

  // Clear messages when selected lounge changes
  useEffect(() => {
    console.log("Selected lounge changed. Clearing messages.");
    setMessages([]);
  }, [selectedLounge]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChannel || !selectedChannel.channel_id) return; // If they are undefined... do nothing.
  
      try {
        const response = await fetch(`/api/get_messages/${selectedChannel.channel_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log received data
          
          // Fetch usernames for each sender_id, and adds it in.
          const updatedMessages = await Promise.all(data.messages.map(async (message : Message) => {
            const username = await getUsername(message.sender_id);
            return { ...message, user: username || 'Unknown User' };
          }));
  
          setMessages(updatedMessages); // Set the received messages with usernames
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
    
  }, [selectedChannel, selectedLounge]); // Dependency array
  
  async function getUsername(user_id: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/get_msg_username/${user_id}`);
      if (response.ok) {
        const data = await response.json();
        return data.username;
      } else {
        throw new Error('Failed to fetch username');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  }
  

  return (
    <div className="fixed pl-[304px] m-0 h-screen w-full overflow-hidden">
      <NavbarContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
      <div className="flex-grow items-center h-full w-full mt-0 ml-0 mx-auto px-3 pb-[130px] bg-zinc-100">
        <div className="flex flex-row h-full">

          {/* Message display area here! */}
          <ScrollArea className="flex-grow w-full">
          {messages.map((message) => (
            <Message
              content={message.content}
              timestamp={message.timestamp}
              user = {message.user}
              sender_id={message.sender_id}
            />
          ))}
        </ScrollArea>

        
        </div>
      </div>


      <div className="px-3">
        <div className="flex flex-row items-center justify-between fixed w-full bottom-6 rounded-lg shadow-lg bg-zinc-300 px-4 h-12">
          <PlusIcon scale={18} className="bg-zinc-500 text-zinc-300 rounded-3xl" />
          <input
            id="message"
            type="text"
            placeholder="Message"
            autoComplete="off"
            className="w-full bg-transparent outline-none ml-0 mr-auto px-2 text-zinc-700 cursor-text"
            disabled={!selectedLounge}
            onChange={onChangeMessage}
            value={message}
            onKeyDown={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}

// "use client";
// import NavbarContent from "./NavbarContent";
// import { PlusIcon } from "@radix-ui/react-icons";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import React, { useRef, useEffect, useState, useLayoutEffect, ChangeEvent } from 'react';

// interface Message {
//   content: string;
//   timestamp: string;
//   user: string;
// }

// interface Lounge {
//   lounge_name: string;
//   lounge_id: string;
// }

// interface Props {
//   selectedLounge: Lounge | null;
//   selectedChannel: string | null;
// }


// export default function ChannelContent({selectedLounge, selectedChannel}: Props) {
//   const [message, setMessage] = useState<string>("")

//   const sendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (message !== ""){
//         console.log(message);
//         setMessage("");
//       }
//     }
//   };



//   const onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     setMessage(e.target.value)
//   };

//   function Message({ content, timestamp, user }: Message) {
//     const abbreviatedUser = user
//       .split(" ") // Split the name into words
//       .map((word) => word.charAt(0)) // Extract the first character of each word
//       .join(""); // Join the extracted characters together
//     return (
//       <div ref={scrollableContainerRef} className="w-full flex flex-row items-center py-4 px-8 m-0 hover:bg-zinc-200">
//         <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-12 w-12 unselectable">
//           {abbreviatedUser}
//         </div>
  
//         <div className="flex flex-col justify-start ml-4">
//           <div className="text-sm text-left font-semibold text-gray-800 mr-2">
//             {user}
//             <small className="text-xs text-left font-semibold text-zinc-500 ml-2">
//               {timestamp}
//             </small>
//           </div>
//           <div className="text-md text-left text-zinc-800 whitespace-normal mr-auto">
//             {content}
//           </div>
//         </div>
//       </div>
//     );
//   }
  

//   const scrollableContainerRef = useRef(null);

//   useEffect(() => {
//     const scrollableContainerRef = document.getElementById('scrollArea');;
//     if (scrollableContainerRef) {
//       scrollableContainerRef.scrollTop = scrollableContainerRef.scrollHeight;
//     }
//   }, []);

  
//   return (
//     <div className="fixed pl-[304px] m-0 h-screen w-full overflow-hidden">
//       <NavbarContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
//       <div className="flex-grow items-center h-full w-full mt-0 ml-0 mx-auto px-3 pb-[130px] bg-zinc-100">
//         <div className="flex flex-row h-full">
//         <ScrollArea className="flex-grow w-full">
//           {selectedLounge && selectedChannel && (
//           <div >
//             <Message
//               content="Hey there! How's it going?"
//               timestamp="2024-05-02 10:15 AM"
//               user="Alice"
//             />
//             <Message
//               content="I'm feeling great today! What about you?"
//               timestamp="2024-05-02 10:20 AM"
//               user="Bob"
//             />
//             <Message
//               content="Just finished my morning workout 💪"
//               timestamp="2024-05-02 10:30 AM"
//               user="Charlie"
//             />
//             <Message
//               content="Anyone up for a coffee break?"
//               timestamp="2024-05-02 11:00 AM"
//               user="David"
//             />
//             <Message
//               content="Wow, it's already noon? Time flies!"
//               timestamp="2024-05-02 12:05 PM"
//               user="Eva"
//             />
//             <Message
//               content="I'm stuck on this coding problem. Any ideas?"
//               timestamp="2024-05-02 01:30 PM"
//               user="Frank"
//             />
//             <Message
//               content="Just got a new job offer! Excited but nervous 😬"
//               timestamp="2024-05-02 02:15 PM"
//               user="Grace"
//             />
//             <Message
//               content="Happy Friday, everyone! Any plans for the weekend?"
//               timestamp="2024-05-02 03:00 PM"
//               user="Henry"
//             />
//             <Message
//               content="Can't believe it's almost summer already!"
//               timestamp="2024-05-02 04:20 PM"
//               user="Ivy"
//             />
//             <Message
//               content="Time to wrap up for the day. See you tomorrow!"
//               timestamp="2024-05-02 05:45 PM"
//               user="Jack"
//             />
//           </div>
//           )}
//           </ScrollArea>
//         </div>
//       </div>
//       <div className="px-3">
//       <div className="flex flex-row items-center justify-between fixed w-full bottom-6 rounded-lg shadow-lg bg-zinc-300 px-4 h-12">
//         <PlusIcon scale={18} className="bg-zinc-500 text-zinc-300 rounded-3xl" />
        
//         <input
//           id="message"
//           type="text"
//           placeholder="Message"
//           autoComplete="off"
//           className="w-full bg-transparent outline-none ml-0 mr-auto px-2 text-zinc-700 cursor-text"
//           disabled={!selectedLounge}
//           onChange={onChangeMessage}
//           value={message}
//           onKeyDown={sendMessage}
//         />
        
//       </div>
//       </div>
//     </div>
//   );
// }
