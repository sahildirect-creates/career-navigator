"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import NovareLogo from "./NovareLogo";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2.5">
          <NovareLogo className="h-7 w-auto" />
          <span className="font-body font-semibold text-lg tracking-tight text-foreground">
            Novare <span className="font-normal text-foreground/70">Talent</span>
          </span>
        </Link>

        {session?.user && (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm font-body text-foreground/60 hover:text-foreground transition-colors"
            >
              My Navigators
            </Link>
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full border border-white/10"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs font-body text-foreground/40 hover:text-foreground/80 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
