"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "@/components/Navbar";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');


  useEffect(() => {
    Promise.all([
      fetch('/api/get_username').then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get username');
        }
      }),
      fetch('/api/user_id').then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to get user ID');
        }
      })
    ]).then(([usernameData, userData]) => {
      setUsername(usernameData.username);
      setUserId(userData.user_id);
    }).catch(error => {
      console.error('Error fetching user data:', error);
      window.location.href = '/login'; 
    });
  }, []);


  const handleUsernameUpdate = async () => {
    try {
      // Send PUT request to update username
      const response = await axios.put(`/api/change_username/${userId}/${newUsername}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating username');
      console.error('Error updating username:', error);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      // Send PUT request to update email
      const response = await axios.put(`/api/change_email/${userId}/${newEmail}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating email');
      console.error('Error updating email:', error);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      // Send PUT request to update password
      const response = await axios.put(`/api/change_password/${userId}/${newPassword}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating password');
      console.error('Error updating password:', error);
    }
  };

  const handleFinishUpdates = async () => {
    try {
      const response = await fetch(`/api/logout`);
      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`/api/delete_account/${userId}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error deleting account');
      console.error('Error deleting account:', error);
    }
  };


  return (
    <main>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold mb-4">{username}'s Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <p className="text-gray-600 text-xs">User ID: {userId}</p>
          </div>

          <div className="mb-4 flex items-center">
            <input type="text" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 mr-4 w-64" />
            <button onClick={handleUsernameUpdate} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm">Update</button>
          </div>

          <div className="mb-4 flex items-center">
            <input type="text" placeholder="New Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 mr-4 w-64" />
            <button onClick={handleEmailUpdate} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm">Update</button>
          </div>

          <div className="mb-4 flex items-center">
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 mr-4 w-64" />
            <button onClick={handlePasswordUpdate} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm">Update</button>
          </div>

          <button onClick={handleFinishUpdates} className="bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-2 text-sm mt-4">Finish Updates</button>

          {message && <p className="text-red-500 mt-4">{message}</p>}
        </CardContent>
      </Card>
      </div>
      </main>
  );
};

export default Profile;
