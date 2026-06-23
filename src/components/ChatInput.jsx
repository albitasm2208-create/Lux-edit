import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form className="le-chat-input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message your stylist…"
        disabled={disabled}
        aria-label="Message your stylist"
      />
      <button type="submit" className="le-btn" style={{ padding: "14px 22px" }} disabled={disabled}>Send</button>
    </form>
  );
}
