import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "mr" | "hi";

export const languages: { code: Language; label: string; speech: string }[] = [
  { code: "en", label: "English", speech: "en-IN" },
  { code: "mr", label: "मराठी", speech: "mr-IN" },
  { code: "hi", label: "हिन्दी", speech: "hi-IN" },
];

type LanguageContextValue = {
  language: Language;
  beacon: Language;
  chooseLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [beacon, setBeacon] = useState<Language>("en");
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selected) return;
    const timer = window.setInterval(() => {
      setBeacon((current) => languages[(languages.findIndex((item) => item.code === current) + 1) % languages.length]?.code ?? "en");
    }, 2500);
    return () => window.clearInterval(timer);
  }, [selected]);

  return (
    <LanguageContext.Provider value={{
      language,
      beacon,
      chooseLanguage: () => {
        if (selected) {
          const next = languages[(languages.findIndex((item) => item.code === language) + 1) % languages.length]?.code ?? "en";
          setLanguage(next);
          setBeacon(next);
        } else {
          setLanguage(beacon);
          setSelected(true);
        }
      },
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is missing");
  return context;
}

export const copy = {
  en: {
    home: "Home", talk: "Talk to us", language: "Change language", eyebrow: "YOUR RIGHTS. MADE SIMPLE.",
    title: "The right support starts with one question.", intro: "Find a government scheme that may be right for you and your family. Choose a topic below, or ask in your own words.",
    start: "Ask a question", explore: "WHAT WOULD YOU LIKE HELP WITH?", topics: "Choose a topic to get started", note: "No forms. No complicated words. Just a place to begin.",
    how: "A simpler way to find your way", step1: "Choose what matters to you", step2: "Tell us a little about yourself", step3: "Find out what to check next", footer: "Your rights are worth knowing.",
    chatTitle: "Let's find your way forward.", chatSubtitle: "Ask about schemes, support, and where to start.", chatBack: "All topics", guide: "AADHIKAR GUIDE", welcome: "Namaste! Tell me what kind of support you're looking for. You can type or use the microphone.",
    demo: "This is a preview. Scheme details and eligibility must be checked with official government sources.", placeholder: "Type your question here...", send: "Send message", microphone: "Speak your question", stop: "Stop listening", listen: "Listening… speak now", unsupported: "Voice input is not available in this browser. Please type your question instead.", denied: "Microphone access was not available. Please type your question instead.", play: "Play audio", stopAudio: "Stop audio", reply: "Thanks for your question. To help you find the right scheme, please tell me your state and a little more about your situation. I can then suggest what to check on the official government website or at your nearest service centre.",
  },
  mr: {
    home: "मुख्यपृष्ठ", talk: "आमच्याशी बोला", language: "भाषा बदला", eyebrow: "तुमचे हक्क. सोप्या भाषेत.",
    title: "योग्य मदतीची सुरुवात एका प्रश्नाने होते.", intro: "तुमच्यासाठी आणि तुमच्या कुटुंबासाठी उपयुक्त सरकारी योजना शोधा. खालील विषय निवडा किंवा तुमच्या शब्दांत विचारा.",
    start: "प्रश्न विचारा", explore: "तुम्हाला कशासाठी मदत हवी आहे?", topics: "सुरुवातीसाठी विषय निवडा", note: "फॉर्म नाहीत. कठीण शब्द नाहीत. फक्त सुरुवात करण्याची जागा.",
    how: "माहिती शोधण्याचा सोपा मार्ग", step1: "तुमचा विषय निवडा", step2: "तुमच्याबद्दल थोडे सांगा", step3: "पुढे काय तपासायचे ते जाणून घ्या", footer: "तुमचे हक्क जाणून घेणे महत्त्वाचे आहे.",
    chatTitle: "चला, पुढचा मार्ग शोधूया.", chatSubtitle: "योजना आणि मदतीबद्दल विचारा.", chatBack: "सर्व विषय", guide: "आधिकार मार्गदर्शक", welcome: "नमस्कार! तुम्हाला कोणत्या प्रकारची मदत हवी आहे ते सांगा. तुम्ही लिहू शकता किंवा माइक वापरू शकता.",
    demo: "हे प्रात्यक्षिक आहे. योजना आणि पात्रता अधिकृत सरकारी स्रोतांवर तपासा.", placeholder: "तुमचा प्रश्न येथे लिहा...", send: "संदेश पाठवा", microphone: "प्रश्न बोला", stop: "ऐकणे थांबवा", listen: "ऐकत आहे… आता बोला", unsupported: "या ब्राउझरमध्ये आवाज उपलब्ध नाही. कृपया प्रश्न लिहा.", denied: "माइक उपलब्ध नाही. कृपया प्रश्न लिहा.", play: "आवाज ऐका", stopAudio: "आवाज थांबवा", reply: "तुमच्या प्रश्नाबद्दल धन्यवाद. योग्य योजना शोधण्यासाठी तुमचे राज्य आणि परिस्थितीबद्दल थोडे सांगा. त्यानंतर अधिकृत सरकारी संकेतस्थळावर किंवा जवळच्या सेवा केंद्रात काय तपासायचे ते सांगता येईल.",
  },
  hi: {
    home: "मुख्य पृष्ठ", talk: "बात करें", language: "भाषा बदलें", eyebrow: "आपके अधिकार. सरल भाषा में.",
    title: "सही मदद एक सवाल से शुरू होती है।", intro: "अपने और अपने परिवार के लिए सरकारी योजनाओं के बारे में जानें। नीचे एक विषय चुनें या अपने शब्दों में पूछें।",
    start: "सवाल पूछें", explore: "आपको किस बारे में मदद चाहिए?", topics: "शुरू करने के लिए विषय चुनें", note: "न फ़ॉर्म। न मुश्किल शब्द। बस एक आसान शुरुआत।",
    how: "जानकारी पाने का आसान तरीका", step1: "अपना विषय चुनें", step2: "अपने बारे में थोड़ा बताएं", step3: "आगे क्या जांचना है जानें", footer: "अपने अधिकारों को जानना ज़रूरी है।",
    chatTitle: "चलिए, आगे का रास्ता खोजें।", chatSubtitle: "योजनाओं और मदद के बारे में पूछें।", chatBack: "सभी विषय", guide: "अधिकार मार्गदर्शक", welcome: "नमस्ते! बताइए आपको किस तरह की मदद चाहिए। आप लिख सकते हैं या माइक का उपयोग कर सकते हैं।",
    demo: "यह एक डेमो है। योजना और पात्रता की जानकारी आधिकारिक सरकारी स्रोतों से जांचें।", placeholder: "अपना सवाल यहाँ लिखें...", send: "संदेश भेजें", microphone: "अपना सवाल बोलें", stop: "सुनना बंद करें", listen: "सुन रहे हैं… अब बोलें", unsupported: "इस ब्राउज़र में आवाज़ की सुविधा नहीं है। कृपया सवाल लिखें।", denied: "माइक उपलब्ध नहीं है। कृपया सवाल लिखें।", play: "आवाज़ सुनें", stopAudio: "आवाज़ बंद करें", reply: "आपके सवाल के लिए धन्यवाद। सही योजना खोजने के लिए अपना राज्य और अपनी स्थिति के बारे में थोड़ा बताएं। फिर आधिकारिक सरकारी वेबसाइट या नज़दीकी सेवा केंद्र पर क्या जांचना है, यह बताया जा सकता है।",
  },
} as const;