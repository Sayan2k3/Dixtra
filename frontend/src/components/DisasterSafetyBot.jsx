import React, { useState } from "react";
import { getDisasterSafetyTips } from "../utils/geminiClient";

function DisasterSafetyBot() {
  const [disaster, setDisaster] = useState("");
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetTips = async () => {
    if (!disaster.trim()) return;
    setTips("");
    setLoading(true);

    try {
      const response = await getDisasterSafetyTips(disaster);
      setTips(response);
    } catch (err) {
      setTips("⚠️ Failed to fetch tips. Please check your API key or quota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", color: "#444" }}>
        🌪️ AI-Powered Safety Tips
      </h2>

      <input
        type="text"
        placeholder="e.g., earthquake, flood, fire..."
        value={disaster}
        onChange={(e) => setDisaster(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleGetTips}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#008080",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Fetching..." : "Get Safety Tips"}
      </button>

      <div
        style={{
          marginTop: "20px",
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          minHeight: "120px",
        }}
      >
        <strong>Tips:</strong>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {tips || "⚠️ No tips returned. Enter a disaster type and click above."}
        </pre>
      </div>
    </div>
  );
}

export default DisasterSafetyBot;
