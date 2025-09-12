'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export function UserNav() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {userAvatar && (
               <Image
                 src={userAvatar.imageUrl}
                 alt={userAvatar.description}
                 data-ai-hint={userAvatar.imageHint}
                 width={36}
                 height={36}
                 className='rounded-full'
               />
            )}
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Guest Mode</p>
            <p className="text-xs leading-none text-muted-foreground">
              Sign up to save your tasks
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-2">
            <p className="text-sm">Theme</p>
            <ThemeToggle />
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
