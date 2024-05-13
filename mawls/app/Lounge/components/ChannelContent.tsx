import React, { useRef, useEffect, useState, useLayoutEffect, ChangeEvent } from 'react';
import NavbarContent from "./NavbarContent";
import { PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface Message {
  content: string;
  message_timestamp: string;
  message_timestamp: string;
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
  const socket = useRef<Socket>();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedChannel || !selectedChannel.channel_id) return;

    socket.current = io("http://localhost:5001"); //Change if needed, make sure websocket.mjs & index.py are changed accordingly

    socket.current.on("message", (data: Message) => {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [selectedChannel]);
  
  const sendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (message.trim() !== '' && selectedChannel) {
      try {
        // Fetch user ID and username concurrently
        const [userIdResponse, usernameResponse] = await Promise.all([
          fetch("/api/user_id"),
          fetch("/api/username")
        ]);
        
        if (!userIdResponse.ok) {
          throw new Error("Failed to get userid");
        }      
          const userData = await userIdResponse.json();
          const usernameData = await usernameResponse.json();
          const username = usernameData.username;
          const senderId = userData.user_id;

          //emit message via websocket
          if (socket.current) {
            const newMessage: Message = {
              content: message,
              message_timestamp: new Date().toISOString().split('.')[0],
              user: username,
              sender_id: senderId
            };
            socket.current.emit("message", newMessage);
          }


        if (!usernameResponse.ok) {
          throw new Error("Failed to get username");
        }
        
        console.log("Fetched username:", username);


        // create message in database
        const response = await fetch(`/api/create_message/${selectedChannel.channel_id}/${senderId}/${encodeURIComponent(message)}`, {
          method: 'POST',
        });
        
        if (response.ok) {

          console.log('Message sent successfully');
          
          const now = new Date();
          const formattedTimestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          const newMessage: Message = {
            content: message,
            message_timestamp: formattedTimestamp,
            user: username, 
            sender_id: senderId 
          };

          setMessages(prevMessages => [...prevMessages, newMessage]);
          setMessage('');
          console.error('Message sent!');


        } else {
          setMessage('');
          console.error("Error sending message.");
        }
      } catch (error) {
        setMessage('');
        console.error('Error sending message:', error);
      }
    }
  }
};


  const onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  
  function Message({ content, message_timestamp: timestamp, user }: Message) {
    const abbreviatedUser = user ? user
    .split(' ')
    .map((word) => word.charAt(0))
    .join('') : '';
  console.log(timestamp);
    return (
      <div className="w-full flex flex-row items-center py-4 px-8 m-0 hover:bg-zinc-200">
        <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-12 w-12 unselectable">
          {abbreviatedUser}
        </div>

        <div className="flex flex-col justify-start ml-4">
          <div className="text-sm text-left font-semibold text-gray-800 mr-2">
            {user}
            <small className="text-xs text-left font-semibold text-zinc-500 ml-2">
              {timestamp}
            </small>
            <small className="text-xs text-left font-semibold text-zinc-500 ml-2">
              {timestamp}
            </small>
          </div>
          <div className="text-md text-left text-zinc-800 whitespace-normal mr-auto">{content}</div>
        </div>
      </div>
    );
  }

  const scrollableContainerRef = useRef(null);

  // Clear messages when selected lounge or channel changes
  useEffect(() => {
    console.log("Selected lounge/channel changed. Clearing messages.");
    console.log("Selected lounge/channel changed. Clearing messages.");
    setMessages([]);
  }, [selectedLounge, selectedChannel]);
  }, [selectedLounge, selectedChannel]);

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
            console.log("Message with timestamp:", message.message_timestamp); // Log timestamp of each message
            console.log("Message with timestamp:", message.message_timestamp); // Log timestamp of each message
            const username = await getUsername(message.sender_id);
            return { ...message, user: username || 'Unknown User' };
          }));
          
          // Sort messages by timestamp
          updatedMessages.sort((a, b) => {
            const timestampA = new Date(a.message_timestamp).getTime();
            const timestampB = new Date(b.message_timestamp).getTime();
            return timestampA - timestampB;
          });
          
          // Sort messages by timestamp
          updatedMessages.sort((a, b) => {
            const timestampA = new Date(a.message_timestamp).getTime();
            const timestampB = new Date(b.message_timestamp).getTime();
            return timestampA - timestampB;
          });
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
  //Scroll to bottom
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  

  return (
    <div className="fixed pl-[304px] m-0 h-screen w-full overflow-hidden">
      <NavbarContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
      <div className="flex-grow items-center h-full w-full mt-0 ml-0 mx-auto px-3 pb-[130px] bg-zinc-100">
        <div className="flex flex-row h-full">

          {/* Message display area here! */}
          <ScrollArea className="flex-grow w-full">
            {messages.map((message, index) => (
              <div ref={index === messages.length - 1 ? lastMessageRef : null} key={index}>
                <Message
                  content={message.content}
                  message_timestamp={message.message_timestamp}
                  user={message.user}
                  sender_id={message.sender_id}
                />
              </div>
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
            disabled={!selectedLounge || !selectedChannel}
            disabled={!selectedLounge || !selectedChannel}
            onChange={onChangeMessage}
            value={message}
            onKeyDown={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}

// import React, { useRef, useEffect, useState, useLayoutEffect, ChangeEvent } from 'react';
// import NavbarContent from "./NavbarContent";
// import { PlusIcon } from "@radix-ui/react-icons";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { toast } from '@/components/ui/use-toast';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000'); 

// interface Message {
//   content: string;
//   message_timestamp: string;
//   user: string;
//   sender_id: string;
// }

// interface Lounge {
//   lounge_name: string;
//   lounge_id: string;
// }

// interface Channel {
//   channel_id: string;
//   channel_name: string;
// }

// interface Props {
//   selectedLounge: Lounge | null;
//   selectedChannel: Channel | null;
// }

// export default function ChannelContent({ selectedLounge, selectedChannel }: Props) {
//   const [message, setMessage] = useState<string>('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [userId, setUserId] = useState("");

//   const sendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       try{
//       if (message !== '') {
//         const response = await fetch(`/api/create_message/${selectedChannel?.channel_id}/${userId}/${message}`, {
//           method: 'POST',
//         });
//         socket.emit('sendMessage', { content: message, channel_id: selectedChannel?.channel_id, user_id: userId });
//         if (response.ok) {
//           toast({
//             title: "Message created!.",
//           });   

//           const now = new Date();
//           const formattedTimestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
//           const newMessage: Message = {
//           content: message,
//           user: userId, 
//           message_timestamp: formattedTimestamp,
//           }
//           setMessage('');

//         } else {
//           toast({
//             title: "Uh oh! Something went wrong.",
//             description: "Error occured in creating message.",
//           });
//         }
//       }} catch (error) {
//         toast({
//           title: "Uh oh! Something went wrong.",
//           description: "Error occured in creating.",
//         });

        
//         console.log(message);
//         setMessage('');
//       }
//     }
//   };

//   const onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     setMessage(e.target.value);
//   };

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const response = await fetch("/api/user_id");
//         if (response.ok) {
//           const data = await response.json();
//           setUserId(data.user_id);
//         } else {
//           throw new Error('Failed to fetch user ID');
//         }
//       } catch (error) {
//         console.error('Error fetching user ID:', error);
//       }
//     };

//     fetchUserId();
//   }, []); 

//   useEffect(() => {
//     const handleNewMessage = (data: Message) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//     };

//     // Listen for new messages
//     socket.on('newMessage', handleNewMessage);

//     // Clean up the event listener when the component unmounts
//     return () => {
//       socket.off('newMessage', handleNewMessage);
//     };
//   }, []);

  
//   function Message({ content, timestamp, user, sender_id }: Message) {
//     const abbreviatedUser = user
//       .split(' ')
//       .map((word) => word.charAt(0))
//       .join('');

//     const isCurrentUserMessage = sender_id === userId;
//     return (
//       <div className="w-full flex flex-row items-center py-4 px-8 m-0 hover:bg-zinc-200">
//         <div className="relative flex items-center justify-center rounded-3xl bg-blue-500 text-white h-12 w-12 unselectable">
//           {abbreviatedUser}
//         </div>

//         <div className="flex flex-col justify-start ml-4">
//           <div className="text-sm text-left font-semibold text-gray-800 mr-2">
//             {user}
//             <small className="text-xs text-left font-semibold text-gray-800 ml-2">{timestamp}</small>
//           </div>
//           <div className="text-md text-left text-zinc-800 whitespace-normal mr-auto">{content}</div>
//         </div>
//       </div>
//     );
//   }

//   const scrollableContainerRef = useRef(null);

//   // Clear messages when selected lounge changes
//   useEffect(() => {
//     console.log("Selected lounge changed. Clearing messages.");
//     setMessages([]);
//   }, [selectedLounge]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedChannel || !selectedChannel.channel_id) return; // If they are undefined... do nothing.
  
//       try {
//         const response = await fetch(`/api/get_messages/${selectedChannel.channel_id}`);
//         if (response.ok) {
//           const data = await response.json();
//           console.log(data); // Log received data
          
//           // Fetch usernames for each sender_id, and adds it in.
//           const updatedMessages = await Promise.all(data.messages.map(async (message : Message) => {
//             console.log("Message with timestamp:", message.message_timestamp); // Log timestamp of each message
//             const username = await getUsername(message.sender_id);
//             return { ...message, user: username || 'Unknown User' };
//           }));
          
//           // Sort messages by timestamp
//           updatedMessages.sort((a, b) => {
//             const timestampA = new Date(a.message_timestamp).getTime();
//             const timestampB = new Date(b.message_timestamp).getTime();
//             return timestampA - timestampB;
//           });
//           setMessages(updatedMessages); // Set the received messages with usernames
//         } else {
//           throw new Error('Failed to fetch messages');
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };
  
//     fetchMessages();
    
//   }, [selectedChannel, selectedLounge]);  // Dependency array
  
//   async function getUsername(user_id: string): Promise<string | null> {
//     try {
//       const response = await fetch(`/api/get_msg_username/${user_id}`);
//       if (response.ok) {
//         const data = await response.json();
//         return data.username;
//       } else {
//         throw new Error('Failed to fetch username');
//       }
//     } catch (error) {
//       console.error('Error fetching username:', error);
//       return null;
//     }
//   }
  

//   return (
//     <div className="fixed pl-[304px] m-0 h-screen w-full overflow-hidden">
//       <NavbarContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
//       <div className="flex-grow items-center h-full w-full mt-0 ml-0 mx-auto px-3 pb-[130px] bg-zinc-100e">
//         <div className="flex flex-row h-full">

//           {/* Message display area here! */}
//           <ScrollArea className="flex-grow w-full">
//           {messages.map((message) => (
//             <Message
//               content={message.content}
//               timestamp={message.timestamp}
//               user = {message.user}
//               sender_id={message.sender_id}
//             />
//           ))}
//         </ScrollArea>

        
//         </div>
//       </div>


//       <div className="px-3">
//         <div className="flex flex-row items-center justify-between fixed w-full bottom-6 rounded-lg shadow-lg bg-zinc-300 px-4 h-12">
//           <PlusIcon scale={18} className="bg-zinc-500 text-zinc-300 rounded-3xl" />
//           <input
//             id="message"
//             type="text"
//             placeholder="Message"
//             autoComplete="off"
//             className="w-full bg-transparent outline-none ml-0 mr-auto px-2 text-zinc-700 cursor-text"
//             disabled={!selectedLounge}
//             onChange={onChangeMessage}
//             value={message}
//             onKeyDown={sendMessage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
