"use client";

import { Suspense, useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, PersonIcon } from "@radix-ui/react-icons";
import NavButton from "@/components/ui/buttons/NavButton";
import MobileNavbar from "./MobileNavbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { usePara } from "@/providers/Para";

interface NavbarProps {
  links: { label: string; path: string }[];
}

export const Navbar = ({ links }: NavbarProps) => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, currentUser, loading } = useAuthStore();
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const { isConnected, openModal, signTransaction, wallet } = usePara();

  // const logoPath = isDarkMode
  //   ? "/logos/artisan-small-logo-white.svg"
  //   : "/logos/artisan-small-logo-black.svg";

  const logoPath = "/logos/artisan-small-logo-black.svg";


  return (
    <Suspense fallback={<div />}>
      {/* Desktop Navbar */}
      <header className="fixed inset-x-0 top-0 right-0 z-50 w-full hidden items-center justify-between px-8 py-4 backdrop-blur-lg duration-500 md:flex md:px-6 xl:px-10 ">
        <Link href="/" className="flex items-center">
          <Image
            src={logoPath}
            alt="Logo"
            width={32}
            height={32}
            className="cursor-pointer"
            priority
          />
        </Link>

        <div className="flex items-center space-x-6">
          <Button variant="ghost" asChild>
            <Link 
              className="about-link" 
              href="/about"
            >
              About Us
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link className="marketplace-link" href="/marketplace" prefetch={true}>
              Assets
              <ChevronRightIcon className="ml-2" />
            </Link>
          </Button>

          {isAuthenticated && !loading ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full border border-black">
                  <PersonIcon className="h-5 w-5" />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => 
                  openModal()
                } className="cursor-pointer">
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard" prefetch={true}>My Assets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
 
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={() => openModal()}
              className="button-hover"
              disabled={loading}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "black",
                color: "white",
                opacity: 1,
              }}
            >
              {loading ? 'Loggin in...' : 'Login'}
            </Button>
          )}
        {isAuthenticated && currentUser?.role === 'admin' && (
          <div className="admin-card">
            <div className="admin-links">
            <Button variant="admin" asChild>
              <Link href="/admin/assets/create" className="admin-link">
                Create New Asset
              </Link>
            </Button>
            </div>
          </div>
        )}
        </div>
      </header>

      {/* Mobile Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 backdrop-blur-lg md:hidden">
        <Link href="/">
          <Image
            src={logoPath}
            alt="Logo"
            width={25}
            height={25}
            className="cursor-pointer"
            priority
          />
        </Link>
        
        <div className="w-7 h-7 opacity-0">
          {/* Placeholder per mantenere lo spazio */}
        </div>
      </header>

      {/* Pulsante menu fuori dall'header per stare sopra a tutto */}
      <div className="fixed top-4 right-4 z-[300] md:hidden flex items-center justify-center">
        <NavButton
          onClick={() => setNavbarCollapsed((prev) => !prev)}
          navbarCollapsed={navbarCollapsed}
          className="text-primary"
        />
      </div>
      
      {navbarCollapsed && (
        <MobileNavbar
          links={links}
          LoginFeatureProps={{
            isOpen: navbarCollapsed,
            onClose: () => setNavbarCollapsed(false),
            onCompleted: () => setNavbarCollapsed(false),
          }}
        />
      )}
    </Suspense>
  );
};

export default Navbar;