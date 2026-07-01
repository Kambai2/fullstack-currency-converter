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
    const [favorites, setFavorites] = useState([]);
    const [copySuccess, setCopySuccess] = useState("");
    const [budgetData, setBudgetData] = useState({
        base: "USD",
        target: "EUR",
        dailyAmount: "",
        days: "7",
    });
    const [budgetResult, setBudgetResult] = useState(null);
    const [budgetLoading, setBudgetLoading] = useState(false);
    const [budgetError, setBudgetError] = useState("");

    const presetAmounts = [10, 25, 50, 100, 250];

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

    const handlePresetAmount = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            amount: value,
        }));
    };

    const swapCurrencies = () => {
        setFormData((prevData) => ({
            ...prevData,
            from: prevData.to,
            to: prevData.from,
        }));
    };

    const handleSaveFavorite = () => {
        if (!formData.from || !formData.to) return;
        const key = `${formData.from}-${formData.to}`;
        setFavorites((prev) => {
            if (prev.some((item) => item.key === key)) return prev;
            return [{ key, from: formData.from, to: formData.to }, ...prev];
        });
    };

    const handleSelectFavorite = (favorite) => {
        setFormData((prevData) => ({
            ...prevData,
            from: favorite.from,
            to: favorite.to,
        }));
    };

    const handleCopyResult = async () => {
        if (!result) return;
        const text = `${formData.amount} ${formData.from} = ${formatCurrency(result.convertedAmount, result.target)} (${result.conversionRate.toFixed(4)} ${result.target} per ${result.base})`;
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess("Result copied to clipboard!");
            setTimeout(() => setCopySuccess(""), 2500);
        } catch {
            setCopySuccess("Unable to copy result.");
            setTimeout(() => setCopySuccess(""), 2500);
        }
    };

    const handleBudgetChange = (e) => {
        const { name, value } = e.target;
        setBudgetData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        setBudgetError("");
        setBudgetResult(null);

        if (!budgetData.base || !budgetData.target || !budgetData.dailyAmount || !budgetData.days) {
            setBudgetError("Please enter your daily budget and travel duration.");
            return;
        }

        setBudgetLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/convert`, {
                from: budgetData.base,
                to: budgetData.target,
                amount: budgetData.dailyAmount,
            });
            const convertedDaily = response.data.convertedAmount;
            setBudgetResult({
                dailyConverted: convertedDaily,
                totalConverted: convertedDaily * Number(budgetData.days),
                totalBase: Number(budgetData.dailyAmount) * Number(budgetData.days),
                target: response.data.target,
                base: response.data.base,
                rate: response.data.conversionRate,
            });
        } catch (err) {
            setBudgetError(getErrorMessage(err));
        } finally {
            setBudgetLoading(false);
        }
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
                    <div className="preset-row">
                        {presetAmounts.map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                className="preset-btn"
                                onClick={() => handlePresetAmount(amount)}
                            >
                                {amount}
                            </button>
                        ))}
                        <button
                            type="button"
                            className="swap-btn"
                            onClick={swapCurrencies}
                        >
                            Swap currencies
                        </button>
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
                <div className="action-row">
                    <button
                        type="button"
                        className="save-btn"
                        onClick={handleSaveFavorite}
                        disabled={!formData.from || !formData.to}
                    >
                        Save favorite
                    </button>
                    <button
                        type="button"
                        className="copy-btn"
                        onClick={handleCopyResult}
                        disabled={!result}
                    >
                        Copy result
                    </button>
                </div>
                {copySuccess && <p className="success-message">{copySuccess}</p>}
                {favorites.length > 0 && (
                    <div className="favorites">
                        <h3>Saved favorites</h3>
                        <div className="favorite-list">
                            {favorites.map((favorite) => (
                                <button
                                    key={favorite.key}
                                    type="button"
                                    className="favorite-chip"
                                    onClick={() => handleSelectFavorite(favorite)}
                                >
                                    {favorite.from} → {favorite.to}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {error && <p className="error">Error: {error}</p>}
            </section>
            <section className="budget-card">
                <h2>Travel Budget Planner</h2>
                <p>Convert your daily budget and see the total cost for your trip in the destination currency.</p>
                <form className="budget-form" onSubmit={handleBudgetSubmit}>
                    <div className="budget-row">
                        <select
                            name="base"
                            value={budgetData.base}
                            onChange={handleBudgetChange}
                            className="input"
                        >
                            {currencyOptions.map(({ code, label, emoji }) => (
                                <option key={code} value={code}>
                                    {emoji} {label} ({code})
                                </option>
                            ))}
                        </select>
                        <select
                            name="target"
                            value={budgetData.target}
                            onChange={handleBudgetChange}
                            className="input"
                        >
                            {currencyOptions.map(({ code, label, emoji }) => (
                                <option key={code} value={code}>
                                    {emoji} {label} ({code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="budget-row">
                        <input
                            name="dailyAmount"
                            value={budgetData.dailyAmount}
                            onChange={handleBudgetChange}
                            placeholder="Daily budget"
                            type="number"
                            className="input"
                        />
                        <input
                            name="days"
                            value={budgetData.days}
                            onChange={handleBudgetChange}
                            placeholder="Days"
                            type="number"
                            className="input"
                        />
                    </div>
                    <button type="submit" className="submit-btn" disabled={budgetLoading}>
                        {budgetLoading ? "Calculating..." : "Calculate travel budget"}
                    </button>
                </form>
                {budgetResult && (
                    <div className="budget-summary">
                        <p>Daily value: {formatCurrency(budgetResult.dailyConverted, budgetResult.target)} per {budgetResult.base} {budgetData.dailyAmount}</p>
                        <p>Total for {budgetData.days} days: {formatCurrency(budgetResult.totalConverted, budgetResult.target)}</p>
                        <p>Rate: 1 {budgetResult.base} = {formatCurrency(budgetResult.rate, budgetResult.target)}</p>
                    </div>
                )}
                {budgetError && <p className="error">{budgetError}</p>}
            </section>
            <section className="promo">
                <h2>Partner offers</h2>
                <p>Boost your conversion experience with MoneyTag savings and Adsterra monetization tools.</p>
                <div className="promo-links">
                    <a href="https://moneytag.com" target="_blank" rel="noreferrer" className="promo-btn">
                        Explore MoneyTag Offers
                    </a>
                    <a href="https://adsterra.com" target="_blank" rel="noreferrer" className="promo-btn secondary">
                        View Adsterra Tools
                    </a>
                </div>
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