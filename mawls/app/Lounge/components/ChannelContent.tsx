import React, { useRef, useEffect, useState, useLayoutEffect, ChangeEvent } from 'react';
import NavbarContent from "./NavbarContent";
import { PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import FileManager from "./FileManager";


interface Message {
  content: string;
  message_timestamp: string;
  user: string;
  sender_id: string;
  message_id: string;
}

interface Lounge {
  lounge_name: string;
  lounge_id: string;
}

interface Channel {
  channel_id: string | null;
  channel_name: string;
}

interface Props {
  selectedLounge: Lounge | null;
  selectedChannel: Channel | null;
}

export default function ChannelContent({ selectedLounge, selectedChannel }: Props) {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number, y: number } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);
  const [editPopupPosition, setEditPopupPosition] = useState<{ x: number, y: number } | null>(null);
  const [editMessageContent, setEditMessageContent] = useState<string>('');

  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false); // State for confirmation popup

  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const socket = useRef<Socket>();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

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
  
  const sendMessage = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<SVGElement>) => {
  if (!selectedChannel) return;
  if (e && 'key' in e && e.key !== 'Enter') return;
  if (message.trim() === '') return;
  
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
        const now = new Date();
        const formattedTimestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      if (!usernameResponse.ok) {
        throw new Error("Failed to get username");
      }
      
      console.log("Fetched username:", username);


      // create message in database
      const response = await fetch(`/api/create_message/${selectedChannel.channel_id}/${senderId}/${encodeURIComponent(message)}`, {
        method: 'POST',
      });
      
      if (response.ok) {

        const responseData = await response.json();
        const messageId = responseData.message_id;
        
        // Display the message in real-time
        if (socket.current) {
          const newMessage: Message = {
            content: message,
            message_timestamp: formattedTimestamp,
            user: username,
            sender_id: senderId,
            message_id: messageId
          };
          // socket.current.emit("message", newMessage);
          // setMessages(prevMessages => [...prevMessages, newMessage]);
          setInitialLoad(true);
        }

        setMessage('');
        console.log('Message sent!')

      } else {
        setMessage('');
        console.error("Error sending message.");
      }
    } catch (error) {
      setMessage('');
      console.error('Error sending message:', error);
    }
  }
  
};

  // Editing and deletions
  useEffect(() => {
    // Fetch the current user ID when the component mounts
    const fetchCurrentUserId = async () => {
      try {
        const response = await fetch("/api/user_id");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.user_id);
        } else {
          throw new Error("Failed to get user ID");
        }
      } catch (error) {
        console.error('Error fetching current user ID:', error);
      }
    };
    fetchCurrentUserId();
  }, []);

  const onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleEditClick = () => {
    if (selectedMessage) {
      setEditMessageContent(selectedMessage.content);
      setPopupVisible(false); //Hides the choice popup
      setEditPopupVisible(true); //Displayes the edit popup
    }
};

  const handleDeleteClick = () => {
    if (selectedMessage) {
      setPopupVisible(false); // Hide the delete popup
      setConfirmationVisible(true); // Show the confirmation popup
    }
  };

  const handleConfirmPopupOutsideClick = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setPopupVisible(false); // Close both popups if clicked outside
      setEditPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleConfirmPopupOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleConfirmPopupOutsideClick);
    };
  }, []);

  // Only the OWNER or SENDER of the message can see the popup. 
  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>, message: Message) => {
    if (message.sender_id === currentUserId) {
      setSelectedMessage(message);
      setPopupPosition({ x: e.clientX, y: e.clientY });
      setEditPopupPosition({ x: e.clientX, y: e.clientY });
      setPopupVisible(true);
    }
  };

  // The actual edit prompt 
  const handleEditPopupOutsideClick = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setEditPopupVisible(false); // Close popup if clicked outside
    }
  };
  
  useEffect(() => {
    document.addEventListener("mousedown", handleEditPopupOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleEditPopupOutsideClick);
    };
  }, []);
  
  const handleEditMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditMessageContent(e.target.value);
  };
  
  const handleEditMessageSubmit = async () => {
    if (selectedMessage && editMessageContent.trim() !== '') {
      try {
        const response = await fetch(`/api/edit_message/${selectedMessage.message_id}/${currentUserId}/${encodeURIComponent(editMessageContent)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const updatedMessage = responseData.updated_message;
  
          // Update the message in the state immediately
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.message_id === updatedMessage.message_id ? { ...updatedMessage } : msg
            )
          );
          
          setEditPopupVisible(false);
          console.log('Message updated!');
          toast({
            description: "Message edited successfully."
          });
        } else {
          toast({
            title: "Message editing error!",
            description: "Response from backend NOT ok",
          });
          console.error("Error updating message.");
        }
      } catch (error) {
        toast({
          title: "Message editing error!",
          description: "Response from frontend NOT ok",
        });
        console.error('Error updating message:', error);
      }
    }
  };  
  

  const handleConfirmDelete = async () => {
    if (selectedMessage) {
      try {
        const response = await fetch(`/api/delete_message/${selectedMessage.message_id}/${currentUserId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          setPopupVisible(false);  // Close the popup after deletion
          setConfirmationVisible(false)
          console.log('Message deleted!');
          toast({
            description: "Message deleted successfully."
          });
        } else {
          console.error("Error deleting message.");
          toast({
            title: "Message deletion error!",
            description: "Response from backend NOT ok",
          });
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        toast({
          title: "Message deletion error!",
          description: "Response from frontend NOT ok",
        });
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmationVisible(false); // Hide the confirmation popup
  };
  
  // Event handler for clicks outside the confirmation popup
  const handlePopupOutsideClick = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setConfirmationVisible(false); // Hide the confirmation popup
    }
  };

  // Add event listener for clicks outside the confirmation popup
  useEffect(() => {
    document.addEventListener("mousedown", handlePopupOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handlePopupOutsideClick);
    };
  }, []);


  function Message({ content, message_timestamp: timestamp, user , sender_id, message_id}: Message) {
    const abbreviatedUser = user ? user
    .split(' ')
    .map((word) => word.charAt(0))
    .join('') : '';

    return (
      <div className="w-full flex flex-row items-center py-4 px-8 m-0 hover:bg-zinc-200"
      onClick={(e) => handleMessageClick(e, { content, message_timestamp: timestamp, user, sender_id, message_id})}
      >
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
          <div className="text-md text-left text-zinc-800 whitespace-normal mr-auto">{content}</div>
        </div>
      </div>
    );
  }

  const scrollableContainerRef = useRef(null);

  // Clear messages when selected lounge or channel changes
  useEffect(() => {
    console.log("Selected lounge/channel changed. Clearing messages.");
    setMessages([]);
    setInitialLoad(true); // Reset initialLoad when channel changes
  }, [selectedLounge, selectedChannel]);

  // Processes messages to be displayed
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchMessages = async () => {
      if (!selectedChannel || !selectedLounge) return; // If they are undefined... do nothing.
  
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
          
          // Sort messages by timestamp
          updatedMessages.sort((a, b) => {
            const timestampA = new Date(a.message_timestamp).getTime();
            const timestampB = new Date(b.message_timestamp).getTime();
            return timestampA - timestampB;
          });
          
          setMessages(prevMessages => {
            // Check if there are new messages to determine if initial load is needed
            const hasNewMessages = prevMessages.length === 0 || prevMessages.length != updatedMessages.length;
            setInitialLoad(hasNewMessages);
            return updatedMessages; // Set the received messages with usernames
          });
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    const startFetchingMessages = () => {
      fetchMessages(); // Fetch messages immediately on component mount
      intervalId = setInterval(fetchMessages, 1500); // Fetch messages every 1.5 seconds
    };
  
    if (selectedChannel && selectedChannel.channel_id) {
      startFetchingMessages();
    }
  
    return () => {
      clearInterval(intervalId); // Clear interval when component unmounts or channel changes
    };
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
    if (initialLoad || messages.length === 1) {
      // Scroll to bottom only on initial load or when a new message is added
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, initialLoad]);
  

  return (
    <div className="fixed pl-[304px] m-0 h-screen w-full overflow-hidden">
      <div className="flex-grow items-center h-full w-full mt-0 ml-0 mx-auto px-0 pb-[130px] bg-zinc-100">
      <NavbarContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
      {selectedChannel?.channel_name == "File Manager" && selectedChannel.channel_id == null && (
        <div className='flex-grow h-full w-full p-4'>
          <FileManager />
        </div>
      )}
      
      {selectedChannel?.channel_name !== "File Manager" &&(
        <div className="flex flex-row h-full px-3">

          {/* Message display area here! */}
          {selectedChannel && (
            <ScrollArea className="flex-grow w-full">
              {messages.map((message, index) => (
                <div ref={index === messages.length - 1 ? lastMessageRef : null} key={index}>
                  <Message
                    content={message.content}
                    message_timestamp={message.message_timestamp}
                    user={message.user}
                    sender_id={message.sender_id}
                    message_id={message.message_id}
                  />
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      )}
      </div>


    <div className="px-3 fixed bottom-4 left-[304px] w-[calc(100%-304px)]">
      
      <div className="flex flex-row items-center justify-between w-full rounded-lg shadow-lg bg-zinc-300 px-4 h-12">
          <PlusIcon scale={18} className="bg-zinc-500 text-zinc-300 rounded-3xl cursor-pointer" onClick={sendMessage} />
          <input
            id="message"
            type="text"
            placeholder="Message"
            autoComplete="off"
            className="w-full bg-transparent outline-none ml-0 mr-auto px-2 text-zinc-700 cursor-text"
            disabled={!selectedLounge || !selectedChannel || selectedChannel.channel_id == null}
            onChange={onChangeMessage}
            value={message}
            onKeyDown={sendMessage}
          />
        </div>
      </div>

      {/* Popup for Edit/Delete options */}
      {popupVisible && popupPosition && selectedMessage && (
        <div
          ref={popupRef}
          className="absolute bg-white border border-gray-300 rounded shadow-md p-2"
          style={{ top: popupPosition.y, left: popupPosition.x }}
        >
          <button className="block w-full text-left px-2 py-1 text-blue-500 hover:bg-gray-200 focus:bg-blue-500 focus:text-white rounded-md" onClick={handleEditClick}>Edit</button>
          <button className="block w-full text-left px-2 py-1 text-red-500 hover:bg-gray-200 focus:bg-red-500 focus:text-white rounded-md" onClick={handleDeleteClick}>Delete</button>
        </div>
      )}
  
      {/* Edit Popup */}
      {editPopupVisible && editPopupPosition && selectedMessage && (
        <div
          ref={popupRef}
          className="absolute bg-white border border-gray-300 rounded shadow-md p-2"
          style={{ top: editPopupPosition.y, left: editPopupPosition.x }}
        >
          <input
            type="text"
            value={editMessageContent}
            onChange={(e) => setEditMessageContent(e.target.value)}
            className="border p-1 w-full"
          />
          <button
            className="block w-full text-center px-2 py-1 text-blue-500 hover:bg-gray-200 focus:bg-blue-500 focus:text-white rounded-md mt-2"
            onClick={handleEditMessageSubmit}
          >
            Submit
          </button>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmationVisible && (
        <div
          ref={popupRef}
          className="absolute text-center bg-white border border-gray-300 rounded shadow-md p-2"
          style={{ top: popupPosition?.y, left: popupPosition?.x }}
        >
          <p>Are you sure you want to delete this message?</p>
          <button className="block w-full text-center px-2 py-1 text-blue-500 hover:bg-gray-200 focus:bg-blue-500 focus:text-white rounded-md mt-2" onClick={handleConfirmDelete}>Yes</button>
          <button className="block w-full text-center px-2 py-1 text-red-500 hover:bg-gray-200 focus:bg-red-500 focus:text-white rounded-md mt-2" onClick={handleCancelDelete}>No</button>
        </div>
      )}

    </div>
    
  );
}

