import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const platforms = {
  X: { label: "X / Twitter", limit: 280, media: 4 },
  Instagram: { label: "Instagram", limit: 2200, media: 10 },
  LinkedIn: { label: "LinkedIn", limit: 3000, media: 9 }
};

function App() {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(["X"]);
  const [files, setFiles] = useState([]);
  const [published, setPublished] = useState(false);

  const checks = useMemo(() => selected.map(key => {
    const p = platforms[key];
    const hashtags = (text.match(/#[A-Za-z0-9_]+/g) || []);
    return {
      key,
      ...p,
      tooLong: text.length > p.limit,
      hashtags: hashtags.length,
      hashtagWarning: key === "X" && hashtags.length > 5
    };
  }), [selected, text]);

  const toggle = (key) => setSelected(s => s.includes(key) ? s.filter(x => x !== key) : [...s, key]);

  const allValid = selected.length > 0 && checks.every(c => !c.tooLong && !c.hashtagWarning);

  return (
    <main className="page">
      <header className="hero">
        <span className="badge">Experiment 1.1.1</span>
        <h1>Multi-Platform Post Composer</h1>
        <p>Compose once, validate instantly, and prepare content for multiple social platforms.</p>
      </header>

      <section className="grid">
        <div className="card composer">
          <label className="label">Post content</label>
          <textarea value={text} onChange={e => { setText(e.target.value); setPublished(false); }}
            placeholder="Write something for your audience... Add #hashtags if needed." />
          <div className="counter">{text.length} characters</div>

          <label className="label">Publishing platforms</label>
          <div className="platforms">
            {Object.entries(platforms).map(([key, p]) => (
              <button key={key} className={selected.includes(key) ? "platform active" : "platform"} onClick={() => toggle(key)}>
                <strong>{key}</strong><span>{p.limit} chars</span>
              </button>
            ))}
          </div>

          <label className="label">Attach media</label>
          <input type="file" accept="image/*,video/*" multiple onChange={e => setFiles([...e.target.files].slice(0, 10))} />
          {files.length > 0 && <div className="file-list">{files.map(f => <span key={f.name}>📎 {f.name}</span>)}</div>}

          <button className="publish" disabled={!allValid} onClick={() => setPublished(true)}>
            {published ? "✓ Ready to publish" : "Validate & Prepare Post"}
          </button>
        </div>

        <div className="card">
          <h2>Live validation</h2>
          {selected.length === 0 && <div className="error">Select at least one platform.</div>}
          {checks.map(c => (
            <div className="check" key={c.key}>
              <div><strong>{c.label}</strong><span>{text.length}/{c.limit}</span></div>
              <div className={c.tooLong || c.hashtagWarning ? "status bad" : "status good"}>
                {c.tooLong ? `✕ ${text.length - c.limit} characters over limit` :
                 c.hashtagWarning ? "⚠ Too many hashtags for X" : "✓ Content is valid"}
              </div>
              <div className="bar"><i style={{width: `${Math.min(100, (text.length / c.limit) * 100)}%`}} /></div>
            </div>
          ))}
          <div className="rules">
            <h3>Rules demonstrated</h3>
            <ul><li>Platform-specific character limits</li><li>Hashtag validation</li><li>Media selection</li><li>Instant visual feedback</li><li>Responsive component layout</li></ul>
          </div>
        </div>
      </section>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
