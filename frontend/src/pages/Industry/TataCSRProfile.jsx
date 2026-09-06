import { useState } from "react";

const translations = {
  en: {
    navSub: "CSR PARTNER PROFILE",
    solved: "Solved",
    challenges: "Open Challenges",
    profileTag: "Industry / CSR Partner",
    about:
      "One of India's oldest and largest business conglomerates, active across steel, automotive, technology, and consumer sectors. Through Tata Trusts and group companies, Tata contributes funding, skilled manpower, and equipment to long-standing programmes in health, education, livelihoods, and community development across the country.",
    stat1: "YEARS OF CSR HISTORY",
    stat2: "ACTIVE PROGRAMME AREAS",
    stat3: "SETU CHALLENGES FUNDED",

    track: "TRACK RECORD",
    solvedTitle: "What Tata Group has already solved",
    solvedSub:
      "Click a programme to see the contribution, funding, and impact.",

    view: "View details →",

    open: "OPEN FOR FUNDING",
    challengeTitle: "Challenges matched to Tata's focus areas",
    challengeSub:
      "Validated problems routed to a university team, ready for support.",

    needs: "Needs:",
    funding: "Funding",
    equipment: "Equipment",
    manpower: "Manpower",
    fund: "Fund this →",

    helpTitle: "How would you like to help?",
    provideFunding: "Provide Funding",
    provideEquipment: "Provide Equipment",
    offerManpower: "Offer Manpower",

    contribution: "Contribution",
    funded: "Funded amount",
    impact: "Impact",
    solvedWith: "Solved with",

    footer: "SETU — CSR Partner Profile",
  },

  hi: {
    navSub: "सीएसआर पार्टनर प्रोफ़ाइल",
    solved: "समाधान",
    challenges: "खुली चुनौतियाँ",
    profileTag: "उद्योग / सीएसआर पार्टनर",
    about:
      "टाटा समूह भारत के सबसे पुराने और सबसे बड़े व्यावसायिक समूहों में से एक है, जो स्टील, ऑटोमोटिव, प्रौद्योगिकी और उपभोक्ता क्षेत्रों में सक्रिय है। टाटा ट्रस्ट्स और समूह की कंपनियों के माध्यम से, टाटा देश भर में स्वास्थ्य, शिक्षा, आजीविका और सामुदायिक विकास से जुड़े दीर्घकालिक कार्यक्रमों में धनराशि, कुशल जनशक्ति और उपकरण उपलब्ध कराता है।",
    stat1: "वर्षों का सीएसआर अनुभव",
    stat2: "सक्रिय कार्यक्रम क्षेत्र",
    stat3: "सेतु चुनौतियाँ वित्तपोषित",

    track: "ट्रैक रिकॉर्ड",
    solvedTitle: "टाटा समूह अब तक क्या हल कर चुका है",
    solvedSub:
      "योगदान, वित्तपोषण और प्रभाव देखने के लिए किसी कार्यक्रम पर क्लिक करें।",

    view: "विवरण देखें →",

    open: "वित्तपोषण हेतु खुला",
    challengeTitle: "टाटा के फोकस क्षेत्रों से मेल खाती चुनौतियाँ",
    challengeSub:
      "विश्वविद्यालय टीम को सौंपी गई सत्यापित समस्याएं, सहयोग के लिए तैयार।",

    needs: "आवश्यकता:",
    funding: "वित्तपोषण",
    equipment: "उपकरण",
    manpower: "जनशक्ति",
    fund: "सहयोग करें →",

    helpTitle: "आप किस तरह मदद करना चाहेंगे?",
    provideFunding: "वित्तपोषण प्रदान करें",
    provideEquipment: "उपकरण प्रदान करें",
    offerManpower: "जनशक्ति प्रदान करें",

    contribution: "योगदान",
    funded: "वित्तपोषित राशि",
    impact: "प्रभाव",
    solvedWith: "समाधान भागीदार",

    footer: "सेतु — सीएसआर पार्टनर प्रोफ़ाइल",
  },

  ta: {
    navSub: "சி.எஸ்.ஆர். பங்குதாரர் சுயவிவரம்",
    solved: "தீர்வுகள்",
    challenges: "திறந்த சவால்கள்",
    profileTag: "தொழில் / சி.எஸ்.ஆர். பங்குதாரர்",
    about:
      "டாடா குழுமம் இந்தியாவின் மிகப் பழமையான மற்றும் மிகப்பெரிய வணிக குழுமங்களில் ஒன்றாகும், இது எஃகு, வாகனத் தொழில், தொழில்நுட்பம் மற்றும் நுகர்வோர் துறைகளில் செயல்படுகிறது. டாடா ட்ரஸ்ட்ஸ் மற்றும் குழும நிறுவனங்கள் மூலம், டாடா நாடு முழுவதும் சுகாதாரம், கல்வி, வாழ்வாதாரம் மற்றும் சமூக மேம்பாட்டிற்கான நீண்டகால திட்டங்களுக்கு நிதி, திறமையான மனிதவளம் மற்றும் உபகரணங்களை வழங்குகிறது.",
    stat1: "ஆண்டுகள் சி.எஸ்.ஆர். அனுபவம்",
    stat2: "செயலில் உள்ள திட்டப் பகுதிகள்",
    stat3: "சேது சவால்களுக்கு நிதியளிக்கப்பட்டது",

    track: "சாதனைப் பதிவு",
    solvedTitle: "டாடா குழுமம் இதுவரை தீர்த்தவை",
    solvedSub:
      "பங்களிப்பு, நிதி மற்றும் தாக்கத்தைப் பார்க்க ஒரு திட்டத்தைக் கிளிக் செய்யவும்.",

    view: "விவரங்களைக் காண →",

    open: "நிதிக்காக திறந்துள்ளது",
    challengeTitle: "டாடாவின் கவனப் பகுதிகளுடன் பொருந்தும் சவால்கள்",
    challengeSub:
      "பல்கலைக்கழக குழுவிடம் ஒப்படைக்கப்பட்ட சரிபார்க்கப்பட்ட சிக்கல்கள், ஆதரவிற்குத் தயார்.",

    needs: "தேவை:",
    funding: "நிதி",
    equipment: "உபகரணங்கள்",
    manpower: "மனிதவளம்",
    fund: "ஆதரவு அளிக்க →",

    helpTitle: "நீங்கள் எவ்வாறு உதவ விரும்புகிறீர்கள்?",
    provideFunding: "நிதி வழங்கவும்",
    provideEquipment: "உபகரணங்கள் வழங்கவும்",
    offerManpower: "மனிதவளம் வழங்கவும்",

    contribution: "பங்களிப்பு",
    funded: "நிதியளிக்கப்பட்ட தொகை",
    impact: "தாக்கம்",
    solvedWith: "தீர்வு பங்குதாரர்",

    footer: "சேது — சி.எஸ்.ஆர். பங்குதாரர் சுயவிவரம்",
  },
};

const solvedPrograms = [
  {
    id: 1,
    title: "Education Signature Programme",
    problem:
      "Learning gaps, children out of school, unequal access to quality education.",
    contribution:
      "Funding + teacher/community support + learning resources",
    funded: "₹3,00,000",
    impact: "2,961 out-of-school children brought back into the system",
    university: "Central University of Jharkhand",
  },
  {
    id: 2,
    title: "MANSI+ Maternal & Child Health",
    problem:
      "High-risk pregnancies, maternal and child illness, malnutrition.",
    contribution:
      "Funding + manpower (trained community health workers) + outreach support",
    funded: "₹5,00,000",
    impact: "3.1 lakh+ reached, 94% high-risk case resolution rate",
    university: "RIMS Ranchi",
  },
  {
    id: 3,
    title: "SABAL — Disability Inclusion",
    problem:
      "Persons with disabilities facing barriers to livelihoods and inclusion.",
    contribution:
      "Funding + equipment (assistive devices) + livelihood linkages",
    funded: "₹4,00,000",
    impact: "20,000+ persons reached, 277 linked to livelihoods",
    university: "BIT Mesra",
  },
];

const challenges = [
  {
    id: "fluoride-filtration",
    tag: "WATER & SANITATION",
    title: "Fluoride contamination in household drinking wells",
    description:
      "Groundwater in three Palamu blocks exceeds safe fluoride limits. A university-designed filtration unit is ready for a 40-household pilot.",
    needs: ["funding", "equipment"],
    required: 500000,
    raised: 320000,
  },
  {
    id: "anaemia-screening",
    tag: "HEALTH & NUTRITION",
    title: "Undetected anaemia among children in Gumla blocks",
    description:
      "Anganwadi workers currently have no on-site testing. A portable diagnostic kit is prototyped and needs support for a 200-child field trial.",
    needs: ["funding", "equipment"],
    required: 500000,
    raised: 155000,
  },
  {
    id: "offline-learning",
    tag: "EDUCATION",
    title: "Signal-dead schools with no digital access",
    description:
      "Around 60 schools in Latehar have no reliable connectivity. An offline learning-tablet system is designed and needs support for a 10-school pilot.",
    needs: ["funding", "equipment"],
    required: 500000,
    raised: 60000,
  },
  {
    id: "soil-moisture",
    tag: "RURAL LIVELIHOODS",
    title: "Low and unstable income among tribal farming households",
    description:
      "Households in Godda lack access to irrigation technology and hands-on training. A soil-moisture sensor pilot is ready to scale to 25 farms.",
    needs: ["funding", "manpower"],
    required: 500000,
    raised: 440000,
  },
];

function goTo(url) {
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function TataCSRProfile() {
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const t = translations[lang];

  const chooseContribution = (type) => {
    const c = selectedChallenge;

    const query = new URLSearchParams({
      id: c.id,
      title: c.title,
      lang,
      type,
      required: c.required,
      raised: c.raised,
    });

    if (type === "funding") {
      goTo(`/payment?${query.toString()}`);
    } else {
      goTo(`/contribute?${query.toString()}`);
    }

    setSelectedChallenge(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-[#0e1613] text-[#eef2ef]"
          : "bg-[#f7f4ee] text-[#141d1a]"
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur ${
          dark
            ? "border-[#28362f] bg-[#0e1613]/95"
            : "border-[#d8d2c3] bg-[#f7f4ee]/95"
        }`}
      >
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-3">
            <span
              className={`font-bold text-xl ${
                dark ? "text-[#43b795]" : "text-[#0f6857]"
              }`}
            >
              SETU
            </span>

            <span
              className={`text-[10px] tracking-[0.1em] ${
                dark ? "text-[#93a49c]" : "text-[#5c655f]"
              }`}
            >
              {t.navSub}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#solved"
              className={`text-sm ${
                dark ? "text-[#93a49c]" : "text-[#5c655f]"
              }`}
            >
              {t.solved}
            </a>

            <a
              href="#problems"
              className={`text-sm ${
                dark ? "text-[#93a49c]" : "text-[#5c655f]"
              }`}
            >
              {t.challenges}
            </a>

            {/* LANGUAGE */}
            <div
              className={`flex overflow-hidden rounded-full border ${
                dark ? "border-[#28362f]" : "border-[#d8d2c3]"
              }`}
            >
              {[
                ["en", "EN"],
                ["hi", "हिं"],
                ["ta", "த"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLang(key)}
                  className={`px-3 py-1.5 text-xs ${
                    lang === key
                      ? "bg-[#0f6857] text-white"
                      : dark
                      ? "bg-[#141f1b] text-[#93a49c]"
                      : "bg-white text-[#5c655f]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* THEME */}
            <button
              onClick={() => setDark(!dark)}
              className={`relative h-[30px] w-[54px] rounded-full border p-1 ${
                dark
                  ? "border-[#28362f] bg-[#141f1b]"
                  : "border-[#d8d2c3] bg-white"
              }`}
            >
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#e2793f] text-xs text-white transition-transform ${
                  dark ? "translate-x-[22px]" : ""
                }`}
              >
                {dark ? "☾" : "☀"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* PROFILE */}
      <header
        className={`border-b ${
          dark ? "border-[#28362f]" : "border-[#d8d2c3]"
        }`}
      >
        <div className="mx-auto max-w-[1120px] px-6 py-14">
          <div className="grid items-center gap-9 md:grid-cols-[220px_1fr]">
            <div
              className={`aspect-video overflow-hidden rounded-xl border ${
                dark ? "border-[#28362f]" : "border-[#d8d2c3]"
              }`}
            >
              <img
                src="/tata.image.png"
                alt="Tata Group"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <div
                className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  dark
                    ? "border-[#28362f] text-[#93a49c]"
                    : "border-[#d8d2c3] text-[#5c655f]"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#e2793f]" />
                {t.profileTag}
              </div>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Tata Group
              </h1>

              <p
                className={`mt-4 max-w-3xl text-base leading-7 ${
                  dark ? "text-[#93a49c]" : "text-[#5c655f]"
                }`}
              >
                {t.about}
              </p>

              <div className="mt-5 flex flex-wrap gap-8">
                <Stat number="145+" label={t.stat1} dark={dark} />
                <Stat number="10+" label={t.stat2} dark={dark} />
                <Stat number="3" label={t.stat3} dark={dark} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOLVED */}
      <section id="solved" className="py-14">
        <div className="mx-auto max-w-[1120px] px-6">
          <SectionHeading
            kicker={t.track}
            title={t.solvedTitle}
            description={t.solvedSub}
            dark={dark}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {solvedPrograms.map((program) => (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className={`rounded-xl border p-6 text-left transition hover:-translate-y-1 ${
                  dark
                    ? "border-[#28362f] bg-[#141f1b] hover:border-[#43b795]"
                    : "border-[#d8d2c3] bg-white hover:border-[#0f6857]"
                }`}
              >
                <span
                  className={`font-mono text-xs ${
                    dark ? "text-[#93a49c]" : "text-[#5c655f]"
                  }`}
                >
                  FY 2025–26
                </span>

                <h3 className="mt-3 text-lg font-semibold">
                  {program.title}
                </h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    dark ? "text-[#93a49c]" : "text-[#5c655f]"
                  }`}
                >
                  {program.problem}
                </p>

                <span
                  className={`mt-4 block text-sm font-medium ${
                    dark ? "text-[#43b795]" : "text-[#0f6857]"
                  }`}
                >
                  {t.view}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGES */}
      <section id="problems" className="pb-20 pt-10">
        <div className="mx-auto max-w-[1120px] px-6">
          <SectionHeading
            kicker={t.open}
            title={t.challengeTitle}
            description={t.challengeSub}
            dark={dark}
          />

          <div
            className={`border-t ${
              dark ? "border-[#28362f]" : "border-[#d8d2c3]"
            }`}
          >
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`grid gap-6 border-b py-6 md:grid-cols-[1fr_170px] md:items-center ${
                  dark ? "border-[#28362f]" : "border-[#d8d2c3]"
                }`}
              >
                <div>
                  <span
                    className={`inline-block rounded border px-2 py-1 font-mono text-[10px] ${
                      dark
                        ? "border-[#28362f] text-[#93a49c]"
                        : "border-[#d8d2c3] text-[#5c655f]"
                    }`}
                  >
                    {challenge.tag}
                  </span>

                  <h3 className="mt-2 text-lg font-semibold">
                    {challenge.title}
                  </h3>

                  <p
                    className={`mt-2 max-w-3xl text-sm leading-6 ${
                      dark ? "text-[#93a49c]" : "text-[#5c655f]"
                    }`}
                  >
                    {challenge.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">
                      {t.needs}
                    </span>

                    {challenge.needs.map((need) => (
                      <span
                        key={need}
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          dark
                            ? "border-[#28362f] bg-[#141f1b] text-[#93a49c]"
                            : "border-[#d8d2c3] bg-[#f7f4ee] text-[#5c655f]"
                        }`}
                      >
                        {t[need]}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChallenge(challenge)}
                  className="rounded-md bg-[#0f6857] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0a3d33]"
                >
                  {t.fund}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`border-t py-6 text-center text-xs ${
          dark
            ? "border-[#28362f] text-[#93a49c]"
            : "border-[#d8d2c3] text-[#5c655f]"
        }`}
      >
        {t.footer}
      </footer>

      {/* SOLVED PROGRAM MODAL */}
      {selectedProgram && (
        <Modal dark={dark} onClose={() => setSelectedProgram(null)}>
          <h3 className="text-xl font-bold">{selectedProgram.title}</h3>

          <ModalRow label={t.contribution}>
            {selectedProgram.contribution}
          </ModalRow>

          <ModalRow label={t.funded} green>
            {selectedProgram.funded}
          </ModalRow>

          <ModalRow label={t.impact}>
            {selectedProgram.impact}
          </ModalRow>

          <ModalRow label={t.solvedWith}>
            {selectedProgram.university}
          </ModalRow>
        </Modal>
      )}

      {/* CONTRIBUTION TYPE MODAL */}
      {selectedChallenge && (
        <Modal dark={dark} onClose={() => setSelectedChallenge(null)}>
          <h3 className="text-xl font-bold">{t.helpTitle}</h3>

          <div className="mt-5 flex flex-col gap-3">
            {selectedChallenge.needs.map((need) => (
              <button
                key={need}
                onClick={() => chooseContribution(need)}
                className={`rounded-lg border p-4 text-left text-sm transition hover:border-[#0f6857] ${
                  dark
                    ? "border-[#28362f] bg-[#0e1613]"
                    : "border-[#d8d2c3] bg-[#f7f4ee]"
                }`}
              >
                {need === "funding" && t.provideFunding}
                {need === "equipment" && t.provideEquipment}
                {need === "manpower" && t.offerManpower}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Stat({ number, label, dark }) {
  return (
    <div>
      <b className={`block font-mono text-xl ${dark ? "text-[#43b795]" : "text-[#0f6857]"}`}>
        {number}
      </b>

      <span className={`text-xs ${dark ? "text-[#93a49c]" : "text-[#5c655f]"}`}>
        {label}
      </span>
    </div>
  );
}

function SectionHeading({ kicker, title, description, dark }) {
  return (
    <div className="mb-8">
      <span className="font-medium text-[#e2793f]">{kicker}</span>

      <h2 className="mt-1 text-2xl font-bold">{title}</h2>

      <p
        className={`mt-2 text-sm ${
          dark ? "text-[#93a49c]" : "text-[#5c655f]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function Modal({ children, dark, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative max-h-[88vh] w-full max-w-[440px] overflow-y-auto rounded-xl border p-7 ${
          dark
            ? "border-[#28362f] bg-[#141f1b] text-[#eef2ef]"
            : "border-[#d8d2c3] bg-white text-[#141d1a]"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

function ModalRow({ label, children, green = false }) {
  return (
    <div className="mt-4 border-t border-dashed border-gray-300 pt-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[#e2793f]">
        {label}
      </div>

      <div
        className={`mt-1 text-sm ${
          green ? "font-bold text-[#0f6857]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}