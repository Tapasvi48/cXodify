"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  User,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import {
  Activity,
  ChevronDown,
  Flashlight,
  Lock,
  Scale,
  Server,
  User as UserIcon,
} from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfileCard = ({ email, name }: { email: string; name: string }) => {
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{email}</p>
          </DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const LoginButton = () => {
  return (
    <NavbarItem>
      <Button
        as={Link}
        color="primary"
        href="#"
        variant="flat"
        onClick={() => {
          signIn("google", { callbackUrl: "/dashboard" });
        }}
      >
        Log In
      </Button>
    </NavbarItem>
  );
};

export default function App() {
  const { data: session, status } = useSession();
  console.log(status, session, "in navbar");
  const router = useRouter();
  // React.useEffect(() => {
  //   if (status === "authenticated" && session?.user?.id) {
  //     localStorage.setItem("userId", session.user.id);
  //   }
  // }, [session, status]);
  // if (status === "unauthenticated") {
  //   router.push("/");
  // }
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: (
      <Flashlight className="text-primary" fill="currentColor" size={30} />
    ),
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <UserIcon className="text-danger" fill="currentColor" size={30} />,
  };

  return (
    <Navbar className="w-screen flex justify-center  px-4" maxWidth="full">
      <NavbarBrand>
        <p className="font-bold text-inherit">CXODIFY</p>
      </NavbarBrand>
      <NavbarContent className="hidden lg:flex justify-center w-full gap-10">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent hover:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                Features
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="autoscaling"
              description="ACME scales apps to meet user demand, automagically, based on load."
              startContent={icons.scale}
            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
              key="usage_metrics"
              description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
              startContent={icons.activity}
            >
              Usage Metrics
            </DropdownItem>
            <DropdownItem
              key="production_ready"
              description="ACME runs on ACME, join us and others serving requests at web scale."
              startContent={icons.flash}
            >
              Production Ready
            </DropdownItem>
            <DropdownItem
              key="99_uptime"
              description="Applications stay on the grid with high availability and high uptime guarantees."
              startContent={icons.server}
            >
              +99% Uptime
            </DropdownItem>
            <DropdownItem
              key="supreme_support"
              description="Overcome any challenge with a supporting team ready to respond."
              startContent={icons.user}
            >
              +Supreme Support
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive className="gap-10">
          <Link href="#" aria-current="page">
            Problems
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Contest
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent
        justify="end"
        className="gap-7 flex items-center justify-center"
      >
        {status === "authenticated" ? (
          <ProfileCard
            email={session.user?.email || ""}
            name={session.user?.name || ""}
          />
        ) : (
          <LoginButton />
        )}
        <NavbarItem>
          <ModeToggle />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
