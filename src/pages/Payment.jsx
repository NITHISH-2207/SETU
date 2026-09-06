import { useState } from "react";

const translations = {
  en: {
    tag: "FUNDING CHECKOUT",
    raised: "raised",
    of: "of ₹",
    amount: "Amount to contribute (₹)",
    org: "Organisation",
    method: "Payment method",
    pay: "Proceed to pay →",
    note: "Payment gateway integration will be connected to the backend.",
  },
  hi: {
    tag: "वित्तपोषण भुगतान",
    raised: "जुटाई गई",
    of: "में से ₹",
    amount: "योगदान राशि (₹)",
    org: "संस्था",
    method: "भुगतान का तरीका",
    pay: "भुगतान करें →",
    note: "भुगतान गेटवे को बैकएंड से जोड़ा जाएगा।",
  },
  ta: {
    tag: "நிதி செலுத்துதல்",
    raised: "திரட்டப்பட்டது",
    of: "இல் ₹",
    amount: "பங்களிப்பு தொகை (₹)",
    org: "நிறுவனம்",
    method: "கட்டண முறை",
    pay: "செலுத்த தொடரவும் →",
    note: "கட்டண நுழைவாயில் பின்தளத்துடன் இணைக்கப்படும்.",
  },
};

export default function Payment() {
  const params = new URLSearchParams(window.location.search);

  const lang = params.get("lang") || "en";
  const title = params.get("title") || "Challenge";
  const id = params.get("id") || "—";
  const required = Number(params.get("required") || 500000);
  const raised = Number(params.get("raised") || 0);

  const t = translations[lang];

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  const percentage = Math.min(
    100,
    Math.round((raised / required) * 100)
  );

  const handlePay = () => {
    if (!method) {
      alert("Please select a payment method.");
      return;
    }

    const finalAmount = amount || Math.max(required - raised, 0);

    alert(
      `Backend payment integration pending.\n\nChallenge: ${title}\nAmount: ₹${finalAmount}\nMethod: ${method}`
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee] p-6">
      <div className="w-full max-w-[460px] rounded-xl border border-[#d8d2c3] bg-white p-9">
        <span className="font-mono text-xs uppercase text-[#e2793f]">
          {t.tag}
        </span>

        <h2 className="mt-2 text-2xl font-bold">
          Fund: {title}
        </h2>

        <div className="mt-1 font-mono text-xs text-[#5c655f]">
          ID: {id}
        </div>

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-[#d8d2c3]">
            <div
              className="h-full bg-[#e2793f]"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between font-mono text-xs">
            <b className="text-[#0f6857]">
              ₹{raised.toLocaleString("en-IN")}{" "}
              <span className="font-normal text-[#5c655f]">
                {t.raised}
              </span>
            </b>

            <span className="text-[#5c655f]">
              {t.of}
              {required.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t border-dashed border-[#d8d2c3] pt-5">
          <label className="mb-1 block text-xs text-[#5c655f]">
            {t.amount}
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={Math.max(required - raised, 0)}
            className="mb-4 w-full rounded-md border border-[#d8d2c3] px-3.5 py-3 font-mono outline-none focus:border-[#0f6857]"
          />

          <label className="mb-1 block text-xs text-[#5c655f]">
            {t.org}
          </label>

          <input
            type="text"
            defaultValue="Tata Group"
            className="w-full rounded-md border border-[#d8d2c3] px-3.5 py-3 outline-none focus:border-[#0f6857]"
          />

          <label className="mb-2 mt-4 block text-xs text-[#5c655f]">
            {t.method}
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            {["Net Banking", "PhonePe", "Razorpay"].map((item) => (
              <button
                key={item}
                onClick={() => setMethod(item)}
                className={`rounded-lg border p-3 text-sm ${
                  method === item
                    ? "border-[#0f6857] bg-white text-[#0f6857]"
                    : "border-[#d8d2c3] bg-[#f7f4ee]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={handlePay}
            className="mt-5 w-full rounded-md bg-[#0f6857] py-3.5 text-sm font-medium text-white hover:bg-[#0a3d33]"
          >
            {t.pay}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-[#5c655f]">
          {t.note}
        </p>
      </div>
    </div>
  );
}