"use client";

import { Home, LayoutDashboard, LogOut, Search } from "lucide-react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { getNameInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import GlobalSearchModal from "./global-search-modal";

export function NavMenu({
  userName,
  userImage,
}: {
  userName?: string;
  userImage?: string;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const displayName = userName ?? "访客";
  const initials = getNameInitials(displayName) || "访";

  return (
    <NavigationMenu viewport={isMobile} className="mx-auto max-w-full">
      <div className="container flex w-full items-center justify-between py-3">
        <NavigationMenuList className="flex-wrap gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className="flex-row items-center gap-2 font-semibold"
            >
              <Home className="size-4" />
              博客
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/#latest">最新</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        <NavigationMenuList className="flex-wrap gap-1">
          <NavigationMenuItem>
            <div
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsOpen(true)}
              aria-label="搜索"
            >
              <Search className="size-4" />
            </div>

            <GlobalSearchModal isOpen={isOpen} setIsOpen={setIsOpen} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Avatar className="w-8 h-8 rounded-full overflow-hidden">
                {userImage ? (
                  <AvatarImage
                    src={userImage}
                    className="rounded-full"
                    alt={displayName}
                  />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-50 gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/dashboard"
                      className="flex-row items-center gap-2"
                    >
                      <LayoutDashboard />
                      仪表盘
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <div
                      className="flex-row items-center gap-2 cursor-pointer"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOut />
                      登出
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}
