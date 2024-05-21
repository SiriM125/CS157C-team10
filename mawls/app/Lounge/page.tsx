"use client"

import SideBar from "@/app/Lounge/components/SideBar";
import Channels from "@/app/Lounge/components/Channels";
import ChannelContent from "@/app/Lounge/components/ChannelContent";
import { useState, useEffect } from 'react';


interface Lounge {
  lounge_name: string;
  lounge_id: string;
  creator_id: string;
}

interface Channel {
  channel_id: string;
  channel_name: string;
}


export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedLounge, setSelectedLounge] = useState<Lounge | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [lounges, setLounges] = useState<Lounge[]>([]); // State to hold lounges

  const selectLounge = (lounge : Lounge | null) => {
    setSelectedLounge(lounge)
    setSelectedChannel(null);
    console.log(lounge)
  }

  const selectChannel = (channel: Channel | null) => {
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

    fetch('/api/get_user_id')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get username');
        }
      })
      .then(data => {
        setUserId(data.user_id);
      })

      .catch(error => {
        console.error('Error fetching username:', error);
        window.location.href = '/login' //Send them back to login page if the username cannot be obtained.
      });
  }, []);

  const fetchLounges = (user: string) => {
    //console.log("fetch: " + user)
    fetch(`/api/user_lounges/${user}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to get lounges");
        }
      })
      .then((data) => {
        setLounges(data.lounges);
        console.log(data.lounges);

        // Check if the selected lounge is in the fetched lounges
        if (selectedLounge && !data.lounges.some((lounge:Lounge) => lounge.lounge_id === selectedLounge.lounge_id)) {
          console.log("Selected lounge not found in fetched lounges");
          setSelectedLounge(null); // Set selected lounge to null if it's not in the fetched lounges
          setSelectedChannel(null); // Also clear selected channel
        } else if (selectedLounge) {
          console.log("Selected lounge found in fetched lounges");
          const updatedLounge = data.lounges.find((lounge:Lounge) => lounge.lounge_id === selectedLounge.lounge_id);
          console.log("Updated lounge found:", updatedLounge);
          if (updatedLounge && updatedLounge.lounge_name !== selectedLounge.lounge_name) {
            console.log("Lounge name has changed");
            setSelectedLounge(updatedLounge); // Set selected lounge to be the lounge with the same id
            console.log(selectedLounge.lounge_name)
            console.log(updatedLounge.lounge_name);
          } else { 
            console.log("Lounge name has not changed");
          }
        }


      })
      .catch((error) => {
        console.error("Error fetching lounges:", error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLounges(userId); // Assuming username is the user ID
    }, 10000); // Fetch lounges every 10 seconds
  
    return () => clearInterval(interval); // Cleanup function
  }, [userId]); // Run effect when username changes
  
  return (
    <main className="overscroll" style={{ overflow: 'hidden' }}>
      <div className="flex">
        <ChannelContent selectedLounge={selectedLounge} selectedChannel={selectedChannel}/>
        <Channels selectedLounge={selectedLounge} setSelectedLounge={setSelectedLounge} selectChannel={selectChannel} selectedChannel={selectedChannel} lounges={lounges} setLounges={setLounges}/>
        <SideBar selectLounge={selectLounge} selectedLounge={selectedLounge} setSelectedLounge={setSelectedLounge} lounges={lounges} setLounges={setLounges}/>
      </div>
    </main>
  );
}

