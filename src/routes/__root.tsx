import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageProvider, languages, useLanguage, copy } from "@/lib/language";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Button asChild><Link to="/">Go home</Link></Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error instanceof Error ? error : new Error(String(error)), { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <Button variant="outline" asChild><Link to="/">Go home</Link></Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppFrame />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function AppFrame() {
  const { language, beacon, chooseLanguage } = useLanguage();
  const text = copy[language];
  const router = useRouter();
  const onChat = router.state.location.pathname === "/chat";

  return <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 sm:py-5">
          <Link to="/" className="flex min-w-0 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring" aria-label="Aadhikar.ai home">
            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-sm border-2 border-header-foreground bg-header-foreground font-display text-2xl font-black text-primary sm:size-12">आ</span>
            <span className="min-w-0 font-display text-2xl font-black leading-none sm:text-3xl">AADHIKAR<span className="text-brand-mark">.AI</span></span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <nav aria-label="Main navigation" className="hidden items-center gap-5 md:flex">
              <Link to="/" className="text-base font-semibold hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring">{text.home}</Link>
              <Link to="/chat" search={{ prompt: "" }} className="text-base font-semibold hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring">{text.talk}</Link>
            </nav>
            <Button variant="header" size="touch" onClick={chooseLanguage} aria-label={`${text.language}. Current: ${languages.find((item) => item.code === language)?.label}. Select ${languages.find((item) => item.code === beacon)?.label}`} className="min-w-29 px-2 sm:min-w-34 sm:px-4">
              <Languages aria-hidden="true" className="hidden sm:block" /> {languages.find((item) => item.code === beacon)?.label}
            </Button>
          </div>
        </div>
        <p className="border-t border-header-rule py-3 text-sm font-medium leading-snug text-header-subtle sm:text-base">We don't Build new Schemes. We build Doors to them!</p>
      </div>
    </header>
    {onChat && <div className="border-b-2 border-border bg-background md:hidden"><div className="mx-auto max-w-7xl px-4 py-2"><Button variant="ghost" size="touch" asChild className="-ml-3"><Link to="/"><ArrowLeft aria-hidden="true" />{text.chatBack}</Link></Button></div></div>}
    <main className="flex min-h-0 flex-1 flex-col"><Outlet /></main>
  </div>;
}
