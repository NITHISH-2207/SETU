import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { translations } from "../utils/translations";

export default function Payment() {
  const [params] = useSearchParams();
  const lang = params.get("lang") || "en";
  const t = translations[lang];

  const title = params.get("title") || "Challenge";
  const id = params.get("id") || "—";
  const required = parseInt(params.get("required") || "500000", 10);
  const raised = parseInt(params.get("raised") || "0", 10);

  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [org, setOrg] = useState("Tata Group");
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardName, setCardName] = useState("");
  const [bank, setBank] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [transactionId, setTransactionId] = useState("");

  const pct = Math.min(100, Math.round((raised / required) * 100));
  const finalAmount = customAmount ? Number(customAmount) : Number(amount);
  const formattedAmount = finalAmount.toLocaleString("en-IN");
  const paymentMethods = [
    { id: "upi", icon: "⌁", title: "UPI", text: "Google Pay, PhonePe, Paytm and any UPI app" },
    { id: "card", icon: "▣", title: "Credit / Debit Card", text: "Visa, Mastercard and RuPay" },
    { id: "netbanking", icon: "⌂", title: "Net Banking", text: "SBI, HDFC, ICICI, Axis and more" },
  ];

  const paymentLabel = useMemo(
    () => paymentMethods.find((item) => item.id === method)?.title || "UPI",
    [method]
  );

  const validate = () => {
    if (!org.trim()) return "Enter your organisation name.";
    if (!Number.isFinite(finalAmount) || finalAmount < 1) return "Enter a contribution amount of at least ₹1.";
    if (method === "upi" && upiId && !/^[\w.-]+@[\w.-]+$/.test(upiId)) return "Enter a valid UPI ID, for example name@bank.";
    if (method === "card" && !cardName.trim()) return "Enter the name on the card.";
    if (method === "netbanking" && !bank) return "Select your bank to continue.";
    return "";
  };

  const handlePay = (event) => {
    event.preventDefault();
    const validationError = validate();
    setError(validationError);
    if (validationError) return;
    setStatus("loading");
    window.setTimeout(() => {
      setTransactionId(`SETU${Date.now().toString().slice(-10)}`);
      setStatus("success");
    }, 1100);
  };

  const downloadReceipt = () => {
    const receipt = `SETU CSR PAYMENT RECEIPT\n\nTransaction ID: ${transactionId}\nProject: ${title}\nOrganisation: ${org}\nAmount: ₹${formattedAmount}\nMethod: ${paymentLabel}\nStatus: Successful\n`;
    const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${transactionId}-receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-lang={lang} className="payment-page payment-demo-page">
      <div className="payment-shell">
        <div className="payment-card">
        <span className="tag">{t.checkoutTag}</span>
        <h1>{t.titlePrefix}{title}</h1>
        <div className="id-line">ID: {id}</div>

        <div className="progress-block">
          <div className="bar"><div className="fill" style={{ width: `${pct}%` }}></div></div>
          <div className="figures">
            <b>₹{raised.toLocaleString("en-IN")} {t.raisedWord}</b>
            <span>{t.ofWord}{required.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {status === "success" ? (
          <div className="payment-success" role="status">
            <div className="success-icon">✓</div>
            <span className="tag">PAYMENT SUCCESSFUL</span>
            <h2>Thank you for supporting this project</h2>
            <p>Your demo contribution of <strong>₹{formattedAmount}</strong> has been recorded.</p>
            <div className="transaction-box"><span>Transaction ID</span><strong>{transactionId}</strong></div>
            <button className="btn" type="button" onClick={downloadReceipt}>Download receipt</button>
          </div>
        ) : (
        <form className="amount-row" onSubmit={handlePay}>
          <div className="form-heading"><div><span className="tag">CONTRIBUTION</span><h2>Choose your amount</h2></div><strong className="amount-preview">₹{formattedAmount}</strong></div>
          <div className="amount-options">
            {[500, 1000, 2500, 5000, 10000].map((value) => <button key={value} type="button" className={amount === value && !customAmount ? "amount-option active" : "amount-option"} onClick={() => { setAmount(value); setCustomAmount(""); }}>{`₹${value.toLocaleString("en-IN")}`}</button>)}
            <button type="button" className={customAmount ? "amount-option active" : "amount-option"} onClick={() => setAmount(0)}>Custom</button>
          </div>
          <label htmlFor="customAmount">Custom amount (optional)</label>
          <input id="customAmount" type="number" min="1" placeholder="Enter amount" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }} />

          <label htmlFor="organisation">{t.orgLabel}</label>
          <input id="organisation" type="text" value={org} onChange={(e) => setOrg(e.target.value)} />

          <div className="payment-method-heading"><div><span className="tag">PAYMENT METHOD</span><h2>Choose how to pay</h2></div><span className="secure-note">▣ Secure demo</span></div>
          <div className="payment-method-list">
            {paymentMethods.map((item) => <button key={item.id} type="button" className={`payment-method-row ${method === item.id ? "selected" : ""}`} onClick={() => setMethod(item.id)}><span className="method-icon">{item.icon}</span><span className="method-copy"><strong>{item.title}</strong><small>{item.text}</small></span><span className="radio-mark">{method === item.id ? "✓" : ""}</span></button>)}
          </div>
          {method === "upi" && <div className="method-detail"><label htmlFor="upiId">UPI ID (optional)</label><input id="upiId" placeholder="yourname@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} /><small>Or scan the QR code shown by the payment gateway.</small></div>}
          {method === "card" && <div className="method-detail"><label htmlFor="cardName">Name on card</label><input id="cardName" placeholder="Name as shown on card" value={cardName} onChange={(e) => setCardName(e.target.value)} /><small>Card details are handled by the future payment gateway and are never stored here.</small></div>}
          {method === "netbanking" && <div className="method-detail"><label htmlFor="bank">Select bank</label><select id="bank" value={bank} onChange={(e) => setBank(e.target.value)}><option value="">Choose your bank</option><option>SBI</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Other bank</option></select></div>}

          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="btn" type="submit" disabled={status === "loading"}>{status === "loading" ? "Connecting securely..." : "Proceed to Pay →"}</button>
          <p className="gateway-note">Frontend demo only. Razorpay or Cashfree can be connected here later.</p>
        </form>
        )}
        <div className="note">{t.backendNote}</div>
      </div>
      <aside className="payment-summary">
        <span className="tag">PAYMENT SUMMARY</span>
        <h2>Support with confidence</h2>
        <p>Your contribution is directed toward the selected SETU challenge.</p>
        <div className="summary-line"><span>Project</span><strong>{title}</strong></div>
        <div className="summary-line"><span>Organisation</span><strong>{org || "Not provided"}</strong></div>
        <div className="summary-line total"><span>Total contribution</span><strong>₹{formattedAmount}</strong></div>
        <div className="summary-security">✓ Secure checkout demo<br />✓ No card details stored<br />✓ Receipt available after payment</div>
      </aside>
      </div>
    </div>
  );
}
