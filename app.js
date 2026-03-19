"use strict";
(() => {
  // src/app.ts
  (() => {
    const root = document.getElementById("appRoot");
    if (!root) return;
    const STORAGE_KEY = "sikka-sathi-state";
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"heads":0,"tails":0,"flips":[],"dice":1}');
    root.innerHTML = `
    <section class="section-stack">
      <article class="tool-card">
        <div class="toolbar">
          <div>
            <p class="eyebrow">Coin arena</p>
            <h3>Heads ya tails?</h3>
          </div>
          <div class="button-row">
            <button class="action-btn primary" id="flipBtn" type="button">Flip coin</button>
            <button class="ghost-btn" id="resetBtn" type="button">Reset</button>
          </div>
        </div>
        <div class="coin-stage">
          <div class="coin-face" id="coinFace">Heads</div>
          <div class="result-panel">
            <p class="mini-label">Latest call</p>
            <strong class="result-number" id="latestFlip">Heads</strong>
            <p class="muted" id="latestNote">One clean toss away from the next decision.</p>
          </div>
        </div>
      </article>

      <article class="tool-card">
        <div class="toolbar">
          <div>
            <p class="eyebrow">Bonus roller</p>
            <h3>Dice bhi saath me</h3>
          </div>
          <button class="action-btn" id="diceBtn" type="button">Roll dice</button>
        </div>
        <div class="stat-grid">
          <div class="stat-box">
            <p class="mini-label">Dice result</p>
            <strong id="diceValue">1</strong>
            <span class="muted">Quick tie-breaker</span>
          </div>
          <div class="stat-box">
            <p class="mini-label">Bias watch</p>
            <strong id="biasValue">Balanced</strong>
            <span class="muted">History ke hisab se</span>
          </div>
        </div>
      </article>
    </section>

    <aside class="section-stack">
      <article class="info-card">
        <p class="eyebrow">Score</p>
        <div class="score-row"><span>Heads</span><strong id="headsCount">0</strong></div>
        <div class="score-row"><span>Tails</span><strong id="tailsCount">0</strong></div>
        <div class="score-row"><span>Total flips</span><strong id="flipCount">0</strong></div>
      </article>
      <article class="info-card">
        <p class="eyebrow">Recent flips</p>
        <div class="history-grid" id="historyList"></div>
      </article>
    </aside>
  `;
    const coinFace = document.getElementById("coinFace");
    const latestFlip = document.getElementById("latestFlip");
    const latestNote = document.getElementById("latestNote");
    const headsCount = document.getElementById("headsCount");
    const tailsCount = document.getElementById("tailsCount");
    const flipCount = document.getElementById("flipCount");
    const historyList = document.getElementById("historyList");
    const diceValue = document.getElementById("diceValue");
    const biasValue = document.getElementById("biasValue");
    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    function renderHistory() {
      if (!historyList) return;
      historyList.innerHTML = state.flips.length ? state.flips.map((entry) => `<div class="history-card"><strong>${entry.side}</strong><span class="muted">${entry.time}</span></div>`).join("") : '<div class="history-card"><strong>Abhi koi toss nahi hua</strong><span class="muted">Pehla flip karke streak shuru karo.</span></div>';
    }
    function render() {
      headsCount.textContent = String(state.heads);
      tailsCount.textContent = String(state.tails);
      flipCount.textContent = String(state.flips.length);
      diceValue.textContent = String(state.dice);
      const delta = Math.abs(state.heads - state.tails);
      biasValue.textContent = delta <= 1 ? "Balanced" : state.heads > state.tails ? "Heads heavy" : "Tails heavy";
      renderHistory();
    }
    function flipCoin() {
      coinFace?.classList.add("spinning");
      window.setTimeout(() => {
        const side = Math.random() > 0.5 ? "Heads" : "Tails";
        if (side === "Heads") state.heads += 1;
        else state.tails += 1;
        const stamp = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(/* @__PURE__ */ new Date());
        state.flips.unshift({ side, time: stamp });
        state.flips = state.flips.slice(0, 8);
        if (coinFace) coinFace.textContent = side;
        latestFlip.textContent = side;
        latestNote.textContent = side === "Heads" ? "Aaj ka luck upar ja raha hai." : "Tails aya hai, ab agla call aur maz\u0947\u0926\u093E\u0930 hoga.";
        coinFace?.classList.remove("spinning");
        save();
        render();
      }, 680);
    }
    document.getElementById("flipBtn")?.addEventListener("click", flipCoin);
    document.getElementById("diceBtn")?.addEventListener("click", () => {
      state.dice = Math.floor(Math.random() * 6) + 1;
      save();
      render();
    });
    document.getElementById("resetBtn")?.addEventListener("click", () => {
      state.heads = 0;
      state.tails = 0;
      state.flips = [];
      state.dice = 1;
      if (coinFace) coinFace.textContent = "Heads";
      latestFlip.textContent = "Heads";
      latestNote.textContent = "Fresh board ready.";
      save();
      render();
    });
    render();
  })();
})();
