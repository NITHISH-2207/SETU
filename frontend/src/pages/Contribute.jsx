import { useState } from "react";

const translations = {
  en: {
    tag: "SUPPORT PLEDGE",
    org: "Organisation",
    email: "Contact email",
    equipment: "What equipment can you provide?",
    manpower: "What manpower / expertise can you offer?",
    submit: "Submit pledge →",
    note: "Pledges will be coordinated by the SETU team on the backend.",
    equipmentPh:
      "e.g. 40 water filtration units, testing kits...",
    manpowerPh:
      "e.g. 3 engineers for 4 weeks, agricultural extension officer...",
  },

  hi: {
    tag: "सहयोग प्रतिज्ञा",
    org: "संस्था",
    email: "संपर्क ईमेल",
    equipment: "आप कौन सा उपकरण उपलब्ध करा सकते हैं?",
    manpower: "आप कौन सी जनशक्ति / विशेषज्ञता दे सकते हैं?",
    submit: "प्रतिज्ञा भेजें →",
    note: "प्रतिज्ञाओं का समन्वय सेतु टीम द्वारा बैकएंड पर किया जाएगा।",
    equipmentPh:
      "जैसे 40 जल फ़िल्टरेशन यूनिट, टेस्टिंग किट...",
    manpowerPh:
      "जैसे 4 सप्ताह के लिए 3 इंजीनियर, कृषि विस्तार अधिकारी...",
  },

  ta: {
    tag: "ஆதரவு உறுதிமொழி",
    org: "நிறுவனம்",
    email: "தொடர்பு மின்னஞ்சல்",
    equipment: "நீங்கள் என்ன உபகரணங்களை வழங்க முடியும்?",
    manpower: "நீங்கள் என்ன மனிதவளம் / நிபுணத்துவத்தை வழங்க முடியும்?",
    submit: "உறுதிமொழியை சமர்ப்பிக்கவும் →",
    note: "உறுதிமொழிகள் சேது குழுவால் பின்தளத்தில் ஒருங்கிணைக்கப்படும்.",
    equipmentPh:
      "எ.கா. 40 நீர் வடிகட்டி அலகுகள், சோதனை கருவிகள்...",
    manpowerPh:
      "எ.கா. 4 வாரங்களுக்கு 3 பொறியாளர்கள், வேளாண் விரிவாக்க அதிகாரி...",
  },
};

export default function Contribute() {
  const params = new URLSearchParams(window.location.search);

  const lang = params.get("lang") || "en";
  const type = params.get("type") || "equipment";
  const title = params.get("title") || "Challenge";
  const id = params.get("id") || "—";

  const t = translations[lang];

  const [organisation, setOrganisation] = useState("Tata Group");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  const isManpower = type === "manpower";

  const handleSubmit = () => {
    if (!email || !details) {
      alert("Please fill all required fields.");
      return;
    }

    alert(
      `Support pledge submitted.\n\nChallenge: ${title}\nType: ${type}\nOrganisation: ${organisation}\nEmail: ${email}\nDetails: ${details}`
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee] p-6">
      <div className="w-full max-w-[460px] rounded-xl border border-[#d8d2c3] bg-white p-9">
        <span className="font-mono text-xs uppercase text-[#e2793f]">
          {t.tag}
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Offer Support
        </h2>

        <div className="mt-2 font-mono text-xs text-[#5c655f]">
          ID: {id}
        </div>

        <label className="mb-1 mt-5 block text-xs text-[#5c655f]">
          {t.org}
        </label>

        <input
          type="text"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          className="w-full rounded-md border border-[#d8d2c3] px-3.5 py-3 outline-none focus:border-[#0f6857]"
        />

        <label className="mb-1 mt-4 block text-xs text-[#5c655f]">
          {t.email}
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="csr@tata.com"
          className="w-full rounded-md border border-[#d8d2c3] px-3.5 py-3 outline-none focus:border-[#0f6857]"
        />

        <label className="mb-1 mt-4 block text-xs text-[#5c655f]">
          {isManpower ? t.manpower : t.equipment}
        </label>

        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            isManpower ? t.manpowerPh : t.equipmentPh
          }
          className="min-h-[110px] w-full resize-y rounded-md border border-[#d8d2c3] px-3.5 py-3 outline-none focus:border-[#0f6857]"
        />

        <button
          onClick={handleSubmit}
          className="mt-5 w-full rounded-md bg-[#0f6857] py-3.5 text-sm font-medium text-white hover:bg-[#0a3d33]"
        >
          {t.submit}
        </button>

        <p className="mt-3 text-center text-xs text-[#5c655f]">
          {t.note}
        </p>
      </div>
    </div>
  );
}