"use client"

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginCard() {
  
  const [loginError, setLoginError] = useState<string | null>(null);


  // USED TO HANDLE THE LOGGING IN
  const handleLogin = async () => {

    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    const username = usernameInput?.value;
    const password = passwordInput?.value;

    if (!username || !password) {
      setLoginError('Please enter both username and password');
      return;
    }
    
    try {
      const response = await fetch(`/api/login/${username}/${password}`);
      
      if (response.ok) {
        // Login successful, redirect to the next page
        window.location.href = '/Lounge';
      
      } else {
        // Login failed, display error message
        const data = await response.json();
        setLoginError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginError('An error occurred while logging in.');
    }
  };



  // Render stuff
  return (
    <div className="flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Log in MAWLS with a username and password or register an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input id="username" placeholder="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="password"
                required
                type="password"
              />
            </div>
            
            {loginError && <p className="text-red-500">{loginError}</p>}

            <div className="pt-1">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-700 hover:text-white"
                type="button"
                onClick={handleLogin}>
                Login
              </Button>
            </div>

            <div className="pt-1">
              <Link href="/register">
                <Button className="w-full text-black bg-slate-200 hover:bg-slate-500 hover:text-white">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
