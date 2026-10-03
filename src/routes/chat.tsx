import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { useLanguage, copy, languages } from "@/lib/language";

type ChatMessage = { id: number; role: "assistant" | "user"; text: string };
type SpeechResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };

export const Route = createFileRoute("/chat")({
  validateSearch: (search) => z.object({ prompt: z.string().max(500).catch("").default("") }).parse(search),
  head: () => ({ meta: [
    { title: "Ask Aadhikar.ai — Scheme guidance" },
    { name: "description", content: "Ask a question about government schemes and support. Start with a topic or speak in your own words." },
    { property: "og:title", content: "Ask Aadhikar.ai — Scheme guidance" },
    { property: "og:description", content: "A simple conversation about government schemes and where to start." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Chat,
});

function Chat() {
  const { prompt } = Route.useSearch();
  const { language } = useLanguage();
  const text = copy[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState(prompt);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speaking, setSpeaking] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => { setDraft(prompt); }, [prompt]);
  useEffect(() => {
    textareaRef.current?.focus();
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  function sendMessage(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMessages((previous) => [
      ...previous,
      { id: nextId.current++, role: "user", text: trimmed },
      { id: nextId.current++, role: "assistant", text: text.reply },
    ]);
    setDraft("");
    textareaRef.current?.focus();
  }

  function toggleMicrophone() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) { setVoiceError(text.unsupported); return; }
    setVoiceError("");
    const recognition = new Recognition();
    recognition.lang = languages.find((item) => item.code === language)?.speech ?? "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setDraft((current) => current ? `${current.trim()} ${transcript}` : transcript);
      textareaRef.current?.focus();
    };
    recognition.onerror = () => { setListening(false); setVoiceError(text.denied); };
    recognition.onend = () => { setListening(false); recognitionRef.current = null; };
    recognitionRef.current = recognition;
    try { recognition.start(); setListening(true); }
    catch { setListening(false); setVoiceError(text.denied); }
  }

  function playAudio(id: number, value: string) {
    if (!("speechSynthesis" in window)) { setVoiceError(text.unsupported); return; }
    window.speechSynthesis.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = languages.find((item) => item.code === language)?.speech ?? "en-IN";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    setSpeaking(id);
    window.speechSynthesis.speak(utterance);
  }

  return <div className="mx-auto flex h-[calc(100dvh-132px)] min-h-130 w-full max-w-7xl flex-col md:h-[calc(100dvh-134px)]">
    <div className="shrink-0 border-b-2 border-border px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
      <div className="flex items-start gap-4">
        <Button variant="quiet" size="touchIcon" asChild className="hidden shrink-0 md:inline-flex" aria-label={text.chatBack} title={text.chatBack}><Link to="/"><ArrowLeft /></Link></Button>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-extrabold uppercase text-primary">{text.guide}</p>
          <h1 className="font-display text-xl font-black leading-tight sm:text-2xl">{text.chatTitle}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">{text.chatSubtitle}</p>
        </div>
      </div>
    </div>

    <Conversation className="min-h-0 flex-1" aria-label="Conversation">
      <ConversationContent className="mx-auto w-full max-w-4xl gap-5 px-4 py-6 sm:px-8 sm:py-8">
        <Message from="assistant" className="max-w-[92%] sm:max-w-[82%]">
          <span className="text-xs font-extrabold uppercase text-primary">{text.guide}</span>
          <MessageContent className="rounded-sm border-2 border-primary bg-chat-assistant px-4 py-4 text-lg leading-relaxed text-foreground sm:px-5 sm:text-xl"><MessageResponse>{text.welcome}</MessageResponse></MessageContent>
          <Button type="button" variant="quiet" size="touch" className="w-fit" onClick={() => playAudio(0, text.welcome)} aria-label={speaking === 0 ? text.stopAudio : text.play} title={speaking === 0 ? text.stopAudio : text.play}>
            {speaking === 0 ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />} {speaking === 0 ? text.stopAudio : text.play}
          </Button>
        </Message>
        {messages.map((message) => <Message from={message.role} key={message.id} className="max-w-[92%] sm:max-w-[82%]">
          <span className={`text-xs font-extrabold uppercase ${message.role === "user" ? "text-right text-muted-foreground" : "text-primary"}`}>{message.role === "assistant" ? text.guide : language === "hi" ? "आप" : language === "mr" ? "तुम्ही" : "YOU"}</span>
          <MessageContent className={`rounded-sm border-2 px-4 py-4 text-lg leading-relaxed text-foreground sm:px-5 sm:text-xl ${message.role === "user" ? "border-cta-border bg-chat-user" : "border-primary bg-chat-assistant"}`}><MessageResponse>{message.text}</MessageResponse></MessageContent>
          {message.role === "assistant" && <Button type="button" variant="quiet" size="touch" className="w-fit" onClick={() => playAudio(message.id, message.text)} aria-label={speaking === message.id ? text.stopAudio : text.play} title={speaking === message.id ? text.stopAudio : text.play}>
            {speaking === message.id ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />} {speaking === message.id ? text.stopAudio : text.play}
          </Button>}
        </Message>)}
      </ConversationContent>
      <ConversationScrollButton aria-label="Scroll to latest message" className="size-12 border-2 border-primary" />
    </Conversation>

    <div className="shrink-0 border-t-2 border-border bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pt-4 lg:px-12">
      <div className="mx-auto max-w-4xl">
        {voiceError && <p role="alert" className="mb-2 border-l-4 border-destructive bg-muted px-3 py-2 text-sm font-bold text-foreground">{voiceError}</p>}
        {listening && <p role="status" className="mb-2 font-bold text-primary">{text.listen}</p>}
        <div className="grid grid-cols-[minmax(0,1fr)_64px] items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_72px]">
          <PromptInput onSubmit={({ text: submitted }) => sendMessage(submitted)} className="min-w-0 [&_[data-slot=input-group]]:flex-row [&_[data-slot=input-group]]:items-end [&_[data-slot=input-group]]:border-2 [&_[data-slot=input-group]]:border-primary [&_[data-slot=input-group]]:bg-card [&_[data-slot=input-group]]:focus-within:ring-4 [&_[data-slot=input-group]]:focus-within:ring-ring">
            <PromptInputTextarea ref={textareaRef} aria-label={text.placeholder} placeholder={text.placeholder} value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-16 px-4 text-base placeholder:text-muted-foreground sm:text-lg" />
            <PromptInputFooter className="w-fit shrink-0 px-2 pb-2"><PromptInputSubmit status="ready" disabled={!draft.trim()} aria-label={text.send} title={text.send} className="size-12 bg-cta text-cta-foreground hover:bg-cta-hover [&_svg]:size-5" /></PromptInputFooter>
          </PromptInput>
          <Button type="button" variant="hero" onClick={toggleMicrophone} aria-label={listening ? text.stop : text.microphone} title={listening ? text.stop : text.microphone} aria-pressed={listening} className="h-full min-h-18 w-full p-0 [&_svg]:size-7">{listening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}</Button>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs font-semibold leading-snug text-muted-foreground sm:text-sm"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{text.demo}</p>
      </div>
    </div>
  </div>;
}