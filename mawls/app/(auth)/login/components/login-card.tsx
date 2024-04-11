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
            <Button
              className="w-full bg-blue-500 hover:bg-blue-700 hover:text-white"
              type="submit"
            >
              Login
            </Button>
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
