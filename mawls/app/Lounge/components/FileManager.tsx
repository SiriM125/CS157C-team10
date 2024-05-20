"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, DownloadIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function FileManager() {
  return (
    <div className="flex flex-col h-full bg-zinc-200 rounded-xl p-4 justify-start ">
      <div>
        <Dialog>
          <DialogTrigger>
            <Button className="bg-blue-500 text-zinc-100 hover:bg-blue-700">
              <PlusIcon /> Add File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Label className="text-lg p-0">Select File</Label>
            <Input id="file" type="file" placeholder="Upload a file here" />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  className="bg-blue-500 text-zinc-100 hover:bg-blue-700 px-9"
                >
                  Upload
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="py-6 h-full">
        <h1 className="text-lg tracking-wider font-bold text-zinc-500">
          Lounge Files
        </h1>
        <div className="h-full">
          <ScrollArea className="flex-grow h-full w-full border border-zinc-400 rounded-xl">
            <>
              <div className="p-4 hover:bg-zinc-300 cursor-pointer flex items-center">
                <h1 className="text-zinc-500 flex items-center">
                  <DownloadIcon className="mr-2" />
                  homework.pdf
                </h1>
              </div>
              <Separator />
            </>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
