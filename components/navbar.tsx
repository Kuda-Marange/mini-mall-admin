"use client"

import * as React from "react"
import { Bell, Search } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from  "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ThemeToggle } from "./theme-toggle-button"
import { useSearch } from "@/lib/search-context"

interface NavbarProps {
  title?: string
  userName?: string
  userEmail?: string
  userImageUrl?: string
  notificationCount?: number
  onLogout?: () => void
}

export function Navbar({
  title,
  userName = "Kudakwashe Marange",
  userEmail,
  userImageUrl,
  notificationCount = 0,
  onLogout,
}: NavbarProps) {
  const { search, setSearch } = useSearch()
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-6">
      <SidebarTrigger />

      {title ? (
        <h1 className="shrink-0 text-lg font-semibold text-foreground">
          {title}
        </h1>
      ) : null}

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          ) : null}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userImageUrl} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                {userEmail ? (
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
