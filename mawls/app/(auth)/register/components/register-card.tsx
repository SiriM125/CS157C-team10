"use client"

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterCard() {

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  // USED TO HANDLE THE LOGGING IN
  const handleRegister = async () => {

    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    const username = usernameInput?.value;
    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!username || !email || !password) {
      setRegisterError('Please enter username, email, and password');
      return;
    }
    
    try {
      const response = await fetch(`/api/register/${username}/${email}/${password}`);

      if (response.ok) {
        // Registeration successful, redirect to the login page
        setShowSuccessPopup(true);
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      
      } else {
        // Registeration failed, display error message
        const data = await response.json();
        setRegisterError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setRegisterError('An error occurred during registration.');
    }
  };


  // Render stuff
  return (
    <div className="flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Sign up for MAWLS with a username and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input id="username" placeholder="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="email" required type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="password" required type="password" />
            </div>
            
            {registerError && <p className="text-red-500">{registerError}</p>}
            
            <div className="pt-1">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-700 hover:text-white"
                type="button"
                onClick={handleRegister}>
                Register
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSuccessPopup && 
        <div id="myModal" className="modal">
          <div className="modal-content">
            <p>Registration successful. Redirecting you to the login page...</p>
          </div>
        </div>
      }

    </div>
  );
}
