import type { Language } from "@/lib/language";

type TopicCopy = Record<Language, {
  title: string;
  detail: string;
  prompt: string;
}>;

export const topics = [
  {
    id: "farmer",
    tone: "harvest",
    copy: {
      en: { title: "Farmer schemes", detail: "Tractors, seeds & crop support", prompt: "I am a farmer. What schemes are available for tractors, seeds, or crop support?" },
      mr: { title: "शेतकरी योजना", detail: "ट्रॅक्टर, बियाणे आणि पीक सहाय्य", prompt: "मी शेतकरी आहे. ट्रॅक्टर, बियाणे किंवा पिकांसाठी कोणत्या योजना उपलब्ध आहेत?" },
      hi: { title: "किसान योजनाएँ", detail: "ट्रैक्टर, बीज और फसल सहायता", prompt: "मैं किसान हूँ। ट्रैक्टर, बीज या फसल सहायता के लिए कौन-सी योजनाएँ उपलब्ध हैं?" },
    } satisfies TopicCopy,
  },
  {
    id: "student",
    tone: "sky",
    copy: {
      en: { title: "Student schemes", detail: "Scholarships & education", prompt: "I am a student. What scholarships or education support can I check?" },
      mr: { title: "विद्यार्थी योजना", detail: "शिष्यवृत्ती आणि शिक्षण", prompt: "मी विद्यार्थी आहे. मी कोणत्या शिष्यवृत्ती किंवा शैक्षणिक सहाय्य योजना तपासू शकतो?" },
      hi: { title: "विद्यार्थी योजनाएँ", detail: "छात्रवृत्ति और शिक्षा", prompt: "मैं विद्यार्थी हूँ। मैं कौन-सी छात्रवृत्ति या शिक्षा सहायता योजनाएँ देख सकता हूँ?" },
    } satisfies TopicCopy,
  },
  {
    id: "elderly",
    tone: "rose",
    copy: {
      en: { title: "Elderly pensions", detail: "Pensions & senior support", prompt: "What pension schemes or support are available for an elderly person?" },
      mr: { title: "ज्येष्ठ नागरिक पेन्शन", detail: "पेन्शन आणि ज्येष्ठांसाठी सहाय्य", prompt: "ज्येष्ठ नागरिकांसाठी कोणत्या पेन्शन योजना किंवा सहाय्य उपलब्ध आहे?" },
      hi: { title: "वृद्धजन पेंशन", detail: "पेंशन और वरिष्ठ सहायता", prompt: "वृद्ध व्यक्ति के लिए कौन-सी पेंशन योजनाएँ या सहायता उपलब्ध हैं?" },
    } satisfies TopicCopy,
  },
  {
    id: "women",
    tone: "leaf",
    copy: {
      en: { title: "Women & SHG", detail: "Self-help groups & livelihood", prompt: "What schemes support women or self-help groups?" },
      mr: { title: "महिला आणि बचत गट", detail: "स्वयं-सहायता गट आणि उपजीविका", prompt: "महिला किंवा स्वयं-सहायता गटांसाठी कोणत्या योजना आहेत?" },
      hi: { title: "महिलाएँ और स्वयं सहायता समूह", detail: "स्वयं सहायता समूह और आजीविका", prompt: "महिलाओं या स्वयं सहायता समूहों के लिए कौन-सी योजनाएँ हैं?" },
    } satisfies TopicCopy,
  },
  {
    id: "health",
    tone: "mint",
    copy: {
      en: { title: "Health support", detail: "Care, cover & treatment", prompt: "What government health support or treatment schemes can I check?" },
      mr: { title: "आरोग्य सहाय्य", detail: "देखभाल, विमा आणि उपचार", prompt: "मी कोणत्या सरकारी आरोग्य सहाय्य किंवा उपचार योजना तपासू शकतो?" },
      hi: { title: "स्वास्थ्य सहायता", detail: "देखभाल, बीमा और उपचार", prompt: "मैं कौन-सी सरकारी स्वास्थ्य सहायता या उपचार योजनाएँ देख सकता हूँ?" },
    } satisfies TopicCopy,
  },
  {
    id: "housing",
    tone: "sun",
    copy: {
      en: { title: "Housing help", detail: "Homes & basic needs", prompt: "What government housing schemes might be available to me?" },
      mr: { title: "घरकुल सहाय्य", detail: "घर आणि मूलभूत गरजा", prompt: "माझ्यासाठी कोणत्या सरकारी घरकुल योजना उपलब्ध असू शकतात?" },
      hi: { title: "आवास सहायता", detail: "घर और बुनियादी ज़रूरतें", prompt: "मेरे लिए कौन-सी सरकारी आवास योजनाएँ उपलब्ध हो सकती हैं?" },
    } satisfies TopicCopy,
  },
] as const;