import NovareLogo from "@/components/NovareLogo";
import GoogleSignInButton from "./GoogleSignInButton";

export default function LandingHeader() {
  return (
    <header className="relative z-20 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 md:px-14 h-16 md:h-[72px] flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <NovareLogo className="h-7 w-auto" />
          <span className="font-body font-semibold text-base md:text-lg tracking-tight text-foreground">
            Novare <span className="font-normal text-foreground/70">Talent</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          <a href="#how-it-works" className="text-sm text-foreground/55 hover:text-foreground transition-colors font-body">
            How it works
          </a>
          <a href="#examples" className="text-sm text-foreground/55 hover:text-foreground transition-colors font-body">
            Examples
          </a>
          <a href="#faq" className="text-sm text-foreground/55 hover:text-foreground transition-colors font-body">
            FAQ
          </a>
          <GoogleSignInButton label="Sign in" variant="ghost" />
        </nav>
      </div>
    </header>
  );
}
