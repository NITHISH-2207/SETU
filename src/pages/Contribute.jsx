import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { translations } from "../utils/translations";

export default function Contribute() {
  const [params] = useSearchParams();
  const lang = params.get("lang") || "en";
  const t = translations[lang];

  const title = params.get("title") || "Challenge";
  const id = params.get("id") || "—";
  const type = params.get("type") || "equipment";

  const [org, setOrg] = useState("Tata Group");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");

  const detailLabel = type === "manpower" ? t.manpowerDetailLabel : t.equipmentDetailLabel;
  const detailPh = type === "manpower" ? t.manpowerPh : t.equipmentPh;

  const handleSubmit = () => {
    // TODO (backend): replace this alert with a real API call
    // e.g. POST /api/pledges { challengeId: id, type, org, email, details }
    alert(`Backend integration pending.\n\nChallenge: ${title}\nType: ${type}\nDetails: ${details || detailPh}`);
  };

  return (
    <div data-lang={lang} className="payment-page">
      <div className="card">
        <span className="tag">{t.pledgeTag}</span>
        <h2>{t.contributeTitlePrefix}{title}</h2>
        <div className="id-line">ID: {id}</div>

        <label>{t.orgLabel}</label>
        <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} />

        <label>{t.contactLabel}</label>
        <input type="email" placeholder="csr@tata.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>{detailLabel}</label>
        <textarea placeholder={detailPh} value={details} onChange={(e) => setDetails(e.target.value)} />

        <button className="btn" onClick={handleSubmit}>{t.submitButton}</button>
        <div className="note">{t.contributeBackendNote}</div>
      </div>
    </div>
  );
}
