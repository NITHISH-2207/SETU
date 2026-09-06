import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";
import tataLogo from "../assets/tata-logo.jpg";

const SOLVED_CARDS = [
  { id: "m1", title: "Education Signature Programme", problemKey: "card1_problem",
    contributionKey: "modal1_contribution", impactKey: "modal1_impact", universityKey: "modal1_university", amount: "₹3,00,000" },
  { id: "m2", title: "MANSI+ Maternal & Child Health", problemKey: "card2_problem",
    contributionKey: "modal2_contribution", impactKey: "modal2_impact", universityKey: "modal2_university", amount: "₹5,00,000" },
  { id: "m3", title: "SABAL — Disability Inclusion", problemKey: "card3_problem",
    contributionKey: "modal3_contribution", impactKey: "modal3_impact", universityKey: "modal3_university", amount: "₹4,00,000" }
];

const OPEN_PROBLEMS = [
  { id: "fluoride-filtration", tagKey: "row1_tag", titleKey: "row1_title", descKey: "row1_desc", needs: ["funding", "equipment"], required: 500000, raised: 320000 },
  { id: "anaemia-screening", tagKey: "row2_tag", titleKey: "row2_title", descKey: "row2_desc", needs: ["funding", "equipment"], required: 500000, raised: 155000 },
  { id: "offline-learning", tagKey: "row3_tag", titleKey: "row3_title", descKey: "row3_desc", needs: ["funding", "equipment"], required: 500000, raised: 60000 },
  { id: "soil-moisture", tagKey: "row4_tag", titleKey: "row4_title", descKey: "row4_desc", needs: ["funding", "manpower"], required: 500000, raised: 440000 }
];

export default function CSRProfile() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");
  const [openModalId, setOpenModalId] = useState(null);
  const [choiceRow, setChoiceRow] = useState(null); // the open-problem row currently choosing funding/equipment/manpower
  const navigate = useNavigate();
  const t = translations[lang];

  const handleChoice = (need) => {
    if (!choiceRow) return;
    if (need === "funding") {
      navigate(`/payment?id=${choiceRow.id}&title=${encodeURIComponent(t[choiceRow.titleKey])}&required=${choiceRow.required}&raised=${choiceRow.raised}&lang=${lang}`);
    } else {
      navigate(`/contribute?id=${choiceRow.id}&title=${encodeURIComponent(t[choiceRow.titleKey])}&type=${need}&lang=${lang}`);
    }
    setChoiceRow(null);
  };

  const needLabel = { funding: t.need_funding, equipment: t.need_equipment, manpower: t.need_manpower };
  const contributeLabel = { funding: t.contribute_option_funding, equipment: t.contribute_option_equipment, manpower: t.contribute_option_manpower };

  return (
    <div data-theme={theme} data-lang={lang} className="page">
      <nav>
        <div className="nav-inner">
          <div className="brand"><b>SETU</b><span>{t.nav_sub}</span></div>
          <div className="nav-right">
            <a href="#solved">{t.nav_solved}</a>
            <a href="#problems">{t.nav_problems}</a>
            <div className="lang-switch">
              {["en", "hi", "ta"].map((l) => (
                <button key={l} className={lang === l ? "active" : ""} onClick={() => setLang(l)}>
                  {l === "en" ? "EN" : l === "hi" ? "हिं" : "த"}
                </button>
              ))}
            </div>
            <button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <span className="knob">{theme === "dark" ? "☾" : "☀"}</span>
            </button>
          </div>
        </div>
      </nav>

      <header className="profile">
        <div className="wrap">
          <div className="profile-grid">
            <div className="logo-frame"><img src={tataLogo} alt="Tata Group" /></div>
            <div className="profile-info">
              <span className="profile-tag"><span className="dot"></span>{t.profile_tag}</span>
              <h1>Tata Group</h1>
              <p>{t.profile_about}</p>
              <div className="profile-stats">
                <div><b>145+</b><span>{t.stat1_label}</span></div>
                <div><b>10+</b><span>{t.stat2_label}</span></div>
                <div><b>3</b><span>{t.stat3_label}</span></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="solved" id="solved">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">{t.solved_kicker}</span>
            <h2>{t.solved_title}</h2>
            <p>{t.solved_sub}</p>
          </div>
          <div className="solved-grid">
            {SOLVED_CARDS.map((card) => (
              <div className="solved-card" key={card.id} onClick={() => setOpenModalId(card.id)}>
                <span className="year mono">FY 2025–26</span>
                <h3>{card.title}</h3>
                <p className="problem">{t[card.problemKey]}</p>
                <span className="view">{t.view_details}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="problems" id="problems">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">{t.problems_kicker}</span>
            <h2>{t.problems_title}</h2>
            <p>{t.problems_sub}</p>
          </div>
          <div className="problem-list">
            {OPEN_PROBLEMS.map((row) => (
              <div className="problem-row" key={row.id}>
                <div>
                  <span className="tag">{t[row.tagKey]}</span>
                  <h3>{t[row.titleKey]}</h3>
                  <p>{t[row.descKey]}</p>
                  <div className="needs-row">
                    <span className="needs-label">{t.needs_label}</span>
                    {row.needs.map((n) => <span className="needs-chip" key={n}>{needLabel[n]}</span>)}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setChoiceRow(row)}>{t.fund_button}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer><span>{t.footer_left}</span></footer>

      {/* Solved-programme modals */}
      {SOLVED_CARDS.map((card) => (
        openModalId === card.id && (
          <div className="modal-overlay active" key={card.id} onClick={(e) => e.target === e.currentTarget && setOpenModalId(null)}>
            <div className="modal-box">
              <button className="modal-close" onClick={() => setOpenModalId(null)}>✕</button>
              <h3>{card.title}</h3>
              <div className="modal-row"><div className="m-label">{t.modal_contribution_label}</div><div className="m-value">{t[card.contributionKey]}</div></div>
              <div className="modal-row"><div className="m-label">{t.modal_funded_label}</div><div className="m-value amt">{card.amount}</div></div>
              <div className="modal-row"><div className="m-label">{t.modal_impact_label}</div><div className="m-value">{t[card.impactKey]}</div></div>
              <div className="modal-row"><div className="m-label">{t.modal_university_label}</div><div className="m-value">{t[card.universityKey]}</div></div>
            </div>
          </div>
        )
      ))}

      {/* Funding/equipment/manpower choice modal */}
      {choiceRow && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setChoiceRow(null)}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => setChoiceRow(null)}>✕</button>
            <h3>{t.contribute_modal_title}</h3>
            <div className="choice-grid">
              {choiceRow.needs.map((n) => (
                <button className="choice-btn" key={n} onClick={() => handleChoice(n)}>{contributeLabel[n]}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
