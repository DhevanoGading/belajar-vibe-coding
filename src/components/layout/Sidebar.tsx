"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  User,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeMenuItem } from "@/components/theme-menu-item";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
];

function NavContent({ pathname, user }: { pathname: string; user: { username: string } | null }) {
  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            render={<Link href={item.href} />}
            nativeButton={false}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-12 text-base",
              isActive && "bg-accent font-semibold"
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Button>
        );
      })}
      {user && (
        <Button
          render={<Link href={`/profile/${user.username}`} />}
          nativeButton={false}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-12 text-base",
            pathname === `/profile/${user.username}` && "bg-accent font-semibold"
          )}
        >
          <User className="size-5" />
          Profile
        </Button>
      )}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r bg-background p-4">
        <div className="mb-6 px-3">
          <h1 className="text-xl font-bold">ANSOS</h1>
          <p className="text-xs text-muted-foreground">Anonim Sosial</p>
        </div>

        <NavContent pathname={pathname} user={user} />

        <div className="mt-auto">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 px-3" aria-label="User menu" />}>
                <Avatar className="size-8">
                  <AvatarImage src={user.avatar ?? undefined} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-muted-foreground">@{user.username}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem render={<Link href={`/profile/${user.username}`} />} className="gap-2">
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <ThemeMenuItem />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-bold">ANSOS</h1>
          <p className="text-[10px] text-muted-foreground -mt-0.5">Anonim Sosial</p>
        </div>
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation menu" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <NavContent pathname={pathname} user={user} />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}