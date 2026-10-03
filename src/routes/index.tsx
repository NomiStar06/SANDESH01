import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Wheat, GraduationCap, Accessibility, UsersRound, HeartPulse, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, copy } from "@/lib/language";
import { topics } from "@/lib/topics";
import villageHelp from "@/assets/village-help.jpg";

const topicIcons = { farmer: Wheat, student: GraduationCap, elderly: Accessibility, women: UsersRound, health: HeartPulse, housing: House };

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Aadhikar.ai — Your rights, made simple" },
    { name: "description", content: "Find a starting point for government schemes and support. Ask questions about farming, scholarships, pensions, health, housing and more." },
    { property: "og:title", content: "Aadhikar.ai — Your rights, made simple" },
    { property: "og:description", content: "A simpler starting point for government schemes and support in India." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  const { language } = useLanguage();
  const text = copy[language];
  return <>
    <div className="border-b-2 border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)] lg:items-center lg:gap-14 lg:px-12 lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 border-l-4 border-cta pl-3 text-xs font-extrabold uppercase text-primary sm:text-sm">{text.eyebrow}</div>
          <h1 className="max-w-3xl font-display text-[2.45rem] font-black leading-[1.08] sm:text-5xl lg:text-6xl">{text.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{text.intro}</p>
          <Button asChild variant="hero" size="touch" className="mt-7 min-h-14 text-lg"><Link to="/chat" search={{ prompt: "" }}><MessageCircle aria-hidden="true" />{text.start}<ArrowRight aria-hidden="true" /></Link></Button>
        </div>
        <div className="hidden lg:block">
          <img src={villageHelp} alt="A woman speaks with a community helper about support available to her" width={1024} height={1024} className="aspect-[5/4] w-full rounded-sm border-4 border-primary object-cover" />
          <p className="mt-3 border-l-4 border-cta pl-3 text-sm font-bold text-primary">{text.note}</p>
        </div>
      </div>
    </div>
    <section className="bg-section py-9 sm:py-12" aria-labelledby="topics-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <div className="mb-7">
          <p className="mb-2 text-xs font-extrabold uppercase text-primary sm:text-sm">{text.explore}</p>
          <h2 id="topics-title" className="font-display text-2xl font-black leading-tight sm:text-3xl">{text.topics}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {topics.map((topic) => {
            const TopicIcon = topicIcons[topic.id];
            const topicText = topic.copy[language];
            return <Link key={topic.id} to="/chat" search={{ prompt: topicText.prompt }} className="group grid min-h-30 grid-cols-[64px_minmax(0,1fr)_24px] items-center gap-3 rounded-sm border-[3px] border-card-border bg-card p-4 text-card-foreground shadow-tactile transition-transform hover:-translate-y-0.5 hover:shadow-tactile-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-section sm:min-h-39 sm:grid-cols-[minmax(0,1fr)_24px] sm:content-between sm:p-5" aria-label={`${topicText.title}: ${topicText.detail}`}>
            <span aria-hidden="true" className={`grid size-15 place-items-center rounded-sm text-primary sm:col-span-2 sm:size-16 ${topic.tone === "harvest" ? "bg-topic-harvest" : topic.tone === "sky" ? "bg-topic-sky" : topic.tone === "rose" ? "bg-topic-rose" : topic.tone === "leaf" ? "bg-topic-leaf" : topic.tone === "mint" ? "bg-topic-mint" : "bg-topic-sun"}`}><TopicIcon className="size-8" strokeWidth={2.4} /></span>
            <span className="min-w-0"><span className="block font-display text-lg font-extrabold leading-tight sm:text-xl">{topicText.title}</span><span className="mt-1 block text-sm font-medium leading-snug text-muted-foreground sm:text-base">{topicText.detail}</span></span>
            <ArrowRight aria-hidden="true" className="size-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </Link>;})}
        </div>
      </div>
    </section>
    <section className="border-t-2 border-border bg-background py-10 sm:py-14" aria-labelledby="steps-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        <h2 id="steps-title" className="font-display text-2xl font-black sm:text-3xl">{text.how}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[text.step1, text.step2, text.step3].map((step, index) => <div key={step} className="flex items-center gap-4 border-t-4 border-primary pt-4"><span className="font-display text-3xl font-black text-cta">0{index + 1}</span><p className="text-lg font-bold leading-snug">{step}</p></div>)}
        </div>
      </div>
    </section>
    <footer className="bg-primary px-4 py-6 text-center text-sm font-semibold text-primary-foreground">AADHIKAR.AI <span className="mx-2 text-header-subtle">/</span> {text.footer}</footer>
  </>;
}