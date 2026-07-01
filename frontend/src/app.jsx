import { useState } from "react";
import axios from "axios";
import "./CurrencyConverter.css";

function App() {
    const [formData, setFormData] = useState({
        from: "",
        to: "",
        amount: "",
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const currencyOptions = [
        { code: "USD", label: "United States", emoji: "🇺🇸" },
        { code: "EUR", label: "Eurozone", emoji: "🇪🇺" },
        { code: "GBP", label: "United Kingdom", emoji: "🇬🇧" },
        { code: "JPY", label: "Japan", emoji: "🇯🇵" },
        { code: "CAD", label: "Canada", emoji: "🇨🇦" },
        { code: "NGN", label: "Nigeria", emoji: "🇳🇬" },
        { code: "GHS", label: "Ghana", emoji: "🇬🇭" },
        { code: "XOF", label: "West Africa", emoji: "🇪🇹" },
        { code: "CHF", label: "Switzerland", emoji: "🇨🇭" },
        { code: "BRL", label: "Brazil", emoji: "🇧🇷" },
        { code: "MXN", label: "Mexico", emoji: "🇲🇽" },
        { code: "THB", label: "Thailand", emoji: "🇹🇭" },
        { code: "TRY", label: "Turkey", emoji: "🇹🇷" },
        { code: "INR", label: "India", emoji: "🇮🇳" },
        { code: "PKR", label: "Pakistan", emoji: "🇵🇰" },
        { code: "VND", label: "Vietnam", emoji: "🇻🇳" },
    ];

    const popularPairs = [
        { from: "USD", to: "EUR" },
        { from: "USD", to: "INR" },
        { from: "EUR", to: "GBP" },
        { from: "BRL", to: "USD" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuickPair = (from, to) => {
        setFormData((prevData) => ({
            ...prevData,
            from,
            to,
        }));
    };

    const formatCurrency = (value, currency) => {
        try {
            return new Intl.NumberFormat(navigator.language || 'en-US', {
                style: 'currency',
                currency,
                maximumFractionDigits: 2,
            }).format(value);
        } catch {
            return `${value} ${currency}`;
        }
    };

    const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://server-six-beta-phk8rnvxmd.vercel.app" : "http://localhost:5000");

    const getErrorMessage = (error) => {
        if (!error) return "Conversion failed. Please try again.";
        if (error.response?.data) return error.response.data;
        if (error.message) return error.message;
        return "Conversion failed. Please try again.";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!formData.from || !formData.to || !formData.amount) {
            setError("Please choose both currencies and enter an amount.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/convert`, formData);
            const data = response?.data;
            setResult(data);
            setHistory((prevHistory) => [
                {
                    from: formData.from,
                    to: formData.to,
                    amount: formData.amount,
                    convertedAmount: data?.convertedAmount,
                    conversionRate: data?.conversionRate,
                    timestamp: new Date().toLocaleTimeString(),
                },
                ...prevHistory,
            ].slice(0, 5));
            setError("");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div>
            <section className="hero">
                <h1>Global Currency Converter</h1>
                <p>Your go-to solution for real-time currency conversions worldwide.</p>
            </section>
            <section className="converter">
                <form onSubmit={handleSubmit}>
                    <div className="quick-pairs">
                        {popularPairs.map((pair) => (
                            <button
                                key={`${pair.from}-${pair.to}`}
                                type="button"
                                className="quick-pair-btn"
                                onClick={() => handleQuickPair(pair.from, pair.to)}
                            >
                                {pair.from} → {pair.to}
                            </button>
                        ))}
                    </div>
                    <select
                     name="from"
                     value={formData.from}
                     onChange={handleChange}
                     className="input"
                        >
                            <option value="">Select From Currency</option>
                            {currencyOptions.map(({ code, label, emoji }) => (
                                <option key={code} value={code}>
                                    {emoji} {label} ({code})
                                </option>
                            ))}
                     </select>
                    <select 
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="">Select To Currency</option>
                        {currencyOptions.map(({ code, label, emoji }) => (
                            <option key={code} value={code}>
                                {emoji} {label} ({code})
                            </option>
                        ))}
                    </select>
                    <input
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        type="number"
                        className="input"
                    />
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Converting..." : "Convert"}
                    </button>
                </form>
                {result && (
                    <div className="result">
                        <p>
                            Converted Amount: {formatCurrency(result.convertedAmount, result.target)}
                        </p>
                        <p>
                            Conversion Rate: 1 {result.base} = {formatCurrency(result.conversionRate, result.target)}
                        </p>
                    </div>
                )}
                {history.length > 0 && (
                    <div className="history">
                        <h3>Recent conversions</h3>
                        <ul>
                            {history.map((item, index) => (
                                <li key={`${item.from}-${item.to}-${index}`}>
                                    {item.timestamp}: {item.amount} {item.from} → {formatCurrency(item.convertedAmount, item.to)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {error && <p className="error">Error: {error}</p>}
            </section>
                <section className="additional-info">
                    <h2>Why Choose Global Currency Converter?</h2>
                    <p>Detailed explanation on advantages or instructions for use.</p>
                </section>
                <footer className="footer">
                    <p>© Kmiracles</p>
                </footer>
            </div>
    );
}
export default App;