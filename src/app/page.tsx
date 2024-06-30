// pages/login.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { Button, CardBody, Card } from "@nextui-org/react";
import Image from "next/image";
import image from "../../public/logo.png";
import image2 from "../../public/back.png";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  const router = useRouter();
  useLayoutEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);
  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <Image
          src={image2}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <Card className="w-full max-w-md p-6 bg-white bg-opacity-90 rounded-lg shadow-md z-10">
        <CardBody className="flex flex-col items-center justify-center">
          <div className="mb-6">
            <Image
              src={image}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
          <h2 className="mb-6 text-center text-gray-800 text-2xl">
            Welcome to Our App
          </h2>
          <Button
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Sign in with Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
