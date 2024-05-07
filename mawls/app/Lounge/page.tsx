"use client"

import SideBar from "@/app/Lounge/components/SideBar";
import Channels from "@/app/Lounge/components/Channels";
import ChannelContent from "@/app/Lounge/components/ChannelContent";
import { useState, useEffect } from 'react';


interface Lounge {
  lounge_name: string;
  lounge_id: string;
}


export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [selectedLounge, setSelectedLounge] = useState<Lounge | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const selectLounge = (lounge : Lounge | null) => {
    setSelectedLounge(lounge)
    if (!lounge || lounge === null){
      setSelectedChannel(null);
    }
    console.log(lounge)
  }

  const selectChannel = (channel: string | null) => {
    setSelectedChannel(channel);
    console.log(channel)
  } 

  useEffect(() => {
    // Fetch the username from the backend
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
        window.location.href = '/login' //Send them back to login page if the username cannot be obtained.
      });
  }, []);

  // useEffect(() => {
  //   // Fetch the username from the backend
  //   fetch('/api/get_username')
  //     .then(response => response.json())
  //     .then(data => {
  //       setUsername(data.username);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching username:', error);
  //       window.location.href = '/login' //Send them back to login page if the username cannot be obtained. 
  //     });
  // }, []);


  return (
    <main className="overscroll" style={{ overflow: 'hidden' }}>
      <div className="flex">
        <ChannelContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
        <Channels selectedLounge={selectedLounge} selectChannel={selectChannel} selectedChannel={selectedChannel}/>
        <SideBar selectLounge={selectLounge}/>
      </div>
    </main>
  );
}



// "use client";
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import NavbarAlt from "@/components/NavbarAlt";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const initialLounges = [
//     { id: 1, name: "CS157C Lounge", description: "Chat for CS157C Students" },
//     { id: 2, name: "Team 10 Lounge", description: "Chat for Team 10" },
//     { id: 3, name: "Lounge 3", description: "Chat for Lounge 3" },
//     { id: 4, name: "Lounge 4", description: "Chat for Lounge 4" },
//     { id: 5, name: "Lounge 5", description: "Chat for Lounge 5" },
//     { id: 6, name: "Lounge 6", description: "Chat for Lounge 6" },
//     { id: 7, name: "Lounge 7", description: "Chat for Lounge 7" }
//   ];
  
//   const Lounge = () => {
//     const [lounges, setLounges] = useState(initialLounges);
//     const [selectedLounge, setSelectedLounge] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [username, setUsername] = useState("");
  
//     useEffect(() => {
//       // Fetch the username from the backend
//       fetch('/api/get_username')
//         .then(response => response.json())
//         .then(data => {
//           setUsername(data.username);
//         })
//         .catch(error => {
//           console.error('Error fetching username:', error);
//           window.location.href = '/login' //Send them back to login page if the username cannot be obtained. 
//         });
//     }, []);

//     const handleSendMessage = (message) => {
//       setMessages(prevMessages => [message, ...prevMessages]);
//     };
  
//     const handleLoungeClick = (lounge) => {
//       setSelectedLounge(lounge);
//     };
  
//     return (
//         <main className="px-8 py-4">
//           <NavbarAlt />
//           <div className="text-center mb-8 w-full">
//             <div className="bg-[#60a5fa] py-2 px-4 rounded-md ">
//             <h1 className="text-3xl tracking-tight text-white sm:text-3xl py-4">
//               Welcome, {username}
//             </h1>
//             </div>
//           </div>
//           <div className="mb-8 w-1/3">
//             <input
//               type="text"
//               placeholder="Search lounges..."
//               className="w-full px-4 py-2 border rounded-md"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="flex w-full justify-center space-x-8 mb-8">
//             <div className="w-1/3">
//               <ScrollArea className="h-[400px] rounded-md border p-5">
//                 <div className="space-y-4">
//                   {lounges.map(lounge => (
//                     <div key={lounge.id} onClick={() => handleLoungeClick(lounge)} className="p-4 border rounded-md block hover:bg-gray-100 transition-colors cursor-pointer">
//                       <h2 className="text-xl font-semibold">{lounge.name}</h2>
//                     </div>
//                   ))}
//                 </div>
//               </ScrollArea>
//               <Dialog>
//                 <DialogTrigger>
//                 <div className="pt-5">
//                   <button type="submit" className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
//                     Add Lounge
//                   </button>
//                   </div>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Add New Lounge</DialogTitle>
//                   </DialogHeader>
//                   <div className="p-4 space-y-4">
//                     <div className="flex flex-col">
//                       <label htmlFor="lounge-name" className="font-semibold">Lounge Name</label>
//                       <input
//                         id="lounge-name"
//                         type="text"
//                         placeholder="Enter lounge name"
//                         className="w-full px-4 py-2 border rounded-md"
//                       />
//                     </div>
//                     <div className="flex flex-col">
//                       <label htmlFor="lounge-members" className="font-semibold">Lounge Members</label>
//                       <input
//                         id="lounge-members"
//                         type="text"
//                         placeholder="List members you want to add"
//                         className="w-full px-4 py-2 border rounded-md"
//                       />
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//             <div className="w-2/3">
//           <Tabs defaultValue="messages" className="w-full">
//             <TabsList>
//               <TabsTrigger value="messages">Messages</TabsTrigger>
//               <TabsTrigger value="files">File Storage</TabsTrigger>
//             </TabsList>
//             <TabsContent value="messages">
//             {selectedLounge && (
//                 <Card>
//                 <CardHeader>
//                 <CardTitle>{selectedLounge.name}</CardTitle>
//                 </CardHeader>
//                 </Card>
//                 )}
//               <ScrollArea className="border rounded-md p-4 h-60 overflow-y-auto mb-4">
//                 {messages.map((message, index) => (
//                   <div key={index} className="text-right">
//                     {message}
//                   </div>
//                 ))}
//               </ScrollArea>
//               {/* Message text box */}
//               <div>
//                 <input type="text" placeholder="Type your message..." className="w-full px-4 py-3 border rounded-md" 
//                 onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       handleSendMessage(e.target.value);
//                       e.target.value = '';
//                     }
//                 }}
//                 />
//               </div>
//             </TabsContent>
//             <TabsContent value="files">
//             {selectedLounge && (
//                 <Card>
//                 <CardHeader>
//                 <CardTitle>{selectedLounge.name}</CardTitle>
//                 </CardHeader>
//                 </Card>
//                 )}
//               <div className="border rounded-md p-4 h-60 overflow-y-auto mb-4">
//                 {/* file storage stuff */}
//               </div>
//             </TabsContent>
//           </Tabs>
//             </div>
//           </div>
//         </main>
//       );
//     }
    
//     export default Lounge;
