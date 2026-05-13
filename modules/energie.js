/* ============================================
   ENERGIE — Analyse énergétique
   ============================================ */
const Energie = {
  render() {
    const p = App.data.parametres;
    const currentMonth = this.getCurrentMonthKey();
    const e = this.getMonthData();
    const content = document.getElementById('pageContent');

    content.innerHTML = `
      <div class="fade-in">
        <div class="kpi-grid">
          <div class="kpi-card cyan"><div class="kpi-icon cyan">⚡</div><div class="kpi-label">Conso. Froid (kWh/j)</div><div class="kpi-value">${App.formatNumber(this.calcTotalFroid(),0)}</div></div>
          <div class="kpi-card blue"><div class="kpi-icon blue">🏢</div><div class="kpi-label">Conso. RDC (kWh/j)</div><div class="kpi-value">${App.formatNumber(this.calcTotalRDC(),1)}</div></div>
          <div class="kpi-card yellow"><div class="kpi-icon yellow">💡</div><div class="kpi-label">Conso. Mensuelle (kWh)</div><div class="kpi-value">${App.formatNumber(e.consoMensuelle||0,0)}</div></div>
          <div class="kpi-card red"><div class="kpi-icon red">💰</div><div class="kpi-label">Facture TTC (DH)</div><div class="kpi-value">${App.formatNumber(this.calcFacture(),0)}</div></div>
        </div>

        <div class="charts-grid">
          <div class="card">
            <div class="card-header"><span class="card-title">❄️ Charges de refroidissement (kWh/jour)</span></div>
            <div class="card-body">${this.renderFroidTable()}</div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">🏢 Consommation RDC</span></div>
            <div class="card-body">${this.renderRDCTable()}</div>
          </div>
        </div>

        <div class="card" style="margin-top:18px;">
          <div class="card-header">
            <span class="card-title">📈 Suivi des Températures (Scan IA)</span>
            <div style="display:flex; gap:10px;">
              <input type="file" id="enerTempOcrInput" accept="image/*" capture="environment" style="display:none" onchange="Temperatures.processOCR(event)">
              <button class="btn btn-primary btn-sm" style="background:#0ea5e9;border-color:#0ea5e9;" onclick="document.getElementById('enerTempOcrInput').click()">📸 Scanner Relevé Temp.</button>
            </div>
          </div>
          <div class="card-body">
            <div id="enerTempOcrLoading" style="display:none; text-align:center; padding:15px; background:rgba(15,23,42,0.45); border:1px dashed var(--accent-cyan); border-radius:8px; margin-bottom:15px;">
              <div style="color:var(--accent-cyan); font-weight:bold;">🤖 Analyse en cours...</div>
            </div>
            <div style="height:250px;"><canvas id="tempChartEnergie"></canvas></div>
          </div>
        </div>

        <div class="card" style="margin-top:18px;">
          <div class="card-header">
            <span class="card-title">📝 Saisie mensuelle énergie</span>
            <button class="btn btn-primary btn-sm" onclick="Energie.saveEnergie()">💾 Enregistrer</button>
          </div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Mois concerné</label><input type="month" class="form-input" id="eMois" value="${e.mois || currentMonth}" onchange="Energie.loadMonthForm()"></div>
              <div class="form-group"><label class="form-label">Consommation relevée (kWh)</label><input type="number" class="form-input" id="eConsoMensuelle" value="${e.consoMensuelle||0}" onchange="Energie.updateKPI()"></div>
              <div class="form-group"><label class="form-label">Tarif kWh (DH)</label><input type="number" step="0.01" class="form-input" id="eTarifKwh" value="${p.tarifKwh||1.01}"></div>
              <div class="form-group"><label class="form-label">Redevance puissance (DH)</label><input type="number" class="form-input" id="eRedPuissance" value="${p.redevancePuissance||17087.58}"></div>
              <div class="form-group"><label class="form-label">Redevance entretien (DH)</label><input type="number" class="form-input" id="eRedEntretien" value="${p.redevanceEntretien||391.20}"></div>
              <div class="form-group"><label class="form-label">Redevance location (DH)</label><input type="number" class="form-input" id="eRedLocation" value="${p.redevanceLocation||215.05}"></div>
            </div>

            <div class="summary-box" style="margin-top:18px;">
              <h3 style="margin-bottom:12px;">📊 Facture Électrique</h3>
              <div class="summary-row"><span class="summary-label">Consommation</span><span class="summary-value" id="eFactConso">0 DH</span></div>
              <div class="summary-row"><span class="summary-label">Redevance puissance</span><span class="summary-value" id="eFactPuiss">0 DH</span></div>
              <div class="summary-row"><span class="summary-label">Redevance entretien</span><span class="summary-value" id="eFactEntr">0 DH</span></div>
              <div class="summary-row"><span class="summary-label">Redevance location</span><span class="summary-value" id="eFactLoc">0 DH</span></div>
              <div class="summary-row"><span class="summary-label">TOTAL TTC</span><span class="summary-value summary-total" id="eFactTotal">0 DH</span></div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.updateKPI();
    setTimeout(() => this.renderChart(), 100);
  },

  renderChart() {
    const ctx = document.getElementById('tempChartEnergie')?.getContext('2d');
    if (!ctx) return;
    const today = new Date().toISOString().split('T')[0];
    const data = (App.data.relevesTemp || []).filter(r => r.date === today);
    data.sort((a,b) => a.heure.localeCompare(b.heure));
    const chambers = [...new Set(data.map(r => r.chambre))];
    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
    const datasets = chambers.slice(0,4).map((c, i) => ({
      label: c,
      data: data.filter(r => r.chambre === c).map(r => ({ x: r.heure, y: r.temperature })),
      borderColor: colors[i],
      tension: 0.3,
      pointRadius: 4
    }));
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { suggestedMax: 0, suggestedMin: -25 } }
      }
    });
  },

  zones: [
    { nom: 'Stockage 01', tempInt: -18, tempExt: 15, transmission: 33.60, produit: 0, respiration: 0, personnel: 0.27, eclairage: 0.08, ventilateur: 420, infiltration: 25.50 },
    { nom: 'Stockage 02', tempInt: -18, tempExt: 15, transmission: 33.60, produit: 0, respiration: 0, personnel: 0.27, eclairage: 0.08, ventilateur: 420, infiltration: 25.50 },
    { nom: 'Entreposage', tempInt: -18, tempExt: 15, transmission: 32.95, produit: 0, respiration: 0, personnel: 0.27, eclairage: 0.08, ventilateur: 350, infiltration: 35.29 },
    { nom: 'Tunnel 01', tempInt: -35, tempExt: 15, transmission: 107.39, produit: 360, respiration: 3.11, personnel: 0, eclairage: 0.08, ventilateur: 720, infiltration: 0 },
  ],

  equipRDC: [
    { nom: 'Réglettes doubles', puissance: 36, quantite: 74, heures: 8 },
    { nom: 'Balance', puissance: 9, quantite: 4, heures: 8 },
    { nom: 'Clark électrique', puissance: 13983, quantite: 1, heures: 3 },
    { nom: 'Porte électrique', puissance: 750, quantite: 2, heures: 0.5 },
    { nom: 'Tue-mouche', puissance: 30, quantite: 9, heures: 8 },
  ],

  renderFroidTable() {
    const postes = ['Transmission', 'Changement produit', 'Respiration', 'Personnel', 'Éclairage', 'Ventilateur', 'Infiltration'];
    const keys = ['transmission', 'produit', 'respiration', 'personnel', 'eclairage', 'ventilateur', 'infiltration'];
    const totaux = this.zones.map(z => keys.reduce((s, k) => s + z[k], 0));

    return `<table>
      <thead><tr><th>Poste de charge</th>${this.zones.map(z=>`<th class="td-right">${z.nom}</th>`).join('')}<th class="td-right td-bold">Total</th></tr></thead>
      <tbody>
        ${postes.map((p, i) => `<tr>
          <td>${p}</td>
          ${this.zones.map(z => `<td class="td-right">${App.formatNumber(z[keys[i]], 2)}</td>`).join('')}
          <td class="td-right td-bold">${App.formatNumber(this.zones.reduce((s, z) => s + z[keys[i]], 0), 2)}</td>
        </tr>`).join('')}
        <tr style="background:rgba(99,102,241,0.1);">
          <td class="td-bold">Total journalier</td>
          ${totaux.map(t => `<td class="td-right td-bold">${App.formatNumber(t, 2)}</td>`).join('')}
          <td class="td-right td-bold" style="color:var(--accent-purple-light);font-size:1.05rem;">${App.formatNumber(totaux.reduce((s, t) => s + t, 0), 2)}</td>
        </tr>
      </tbody>
    </table>`;
  },

  renderRDCTable() {
    return `<table>
      <thead><tr><th>Équipement</th><th class="td-right">Puissance (W)</th><th class="td-right">Quantité</th><th class="td-right">Heures/j</th><th class="td-right">Conso/jour (kWh)</th></tr></thead>
      <tbody>
        ${this.equipRDC.map(e => {
          const conso = e.puissance * e.quantite * e.heures / 1000;
          return `<tr><td>${e.nom}</td><td class="td-right">${App.formatNumber(e.puissance, 0)}</td><td class="td-right">${e.quantite}</td><td class="td-right">${e.heures}</td><td class="td-right td-bold">${App.formatNumber(conso, 3)}</td></tr>`;
        }).join('')}
        <tr style="background:rgba(99,102,241,0.1);">
          <td colspan="4" class="td-bold">Total quotidien</td>
          <td class="td-right td-bold">${App.formatNumber(this.calcTotalRDC(), 3)} kWh</td>
        </tr>
        <tr><td colspan="4" class="td-bold">Total mensuel (×26j)</td>
          <td class="td-right td-bold" style="color:var(--accent-purple-light)">${App.formatNumber(this.calcTotalRDC()*26, 2)} kWh</td>
        </tr>
      </tbody>
    </table>`;
  },

  calcTotalFroid() {
    return this.zones.reduce((s, z) => s + z.transmission + z.produit + z.respiration + z.personnel + z.eclairage + z.ventilateur + z.infiltration, 0);
  },

  calcTotalRDC() {
    return this.equipRDC.reduce((s, e) => s + (e.puissance * e.quantite * e.heures / 1000), 0);
  },

  getCurrentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  },

  getMonthKey(year, month) {
    if (typeof year === 'number' && typeof month === 'number') {
      return `${year}-${String(month + 1).padStart(2, '0')}`;
    }
    return document.getElementById('eMois')?.value || this.getCurrentMonthKey();
  },

  getMonthData(year, month) {
    const key = this.getMonthKey(year, month);
    const e = App.data.energieMensuelle || {};
    // Prioritize the months sub-object for multi-month support
    if (e.months && e.months[key]) {
      return { mois: key, ...e.months[key] };
    }
    // Fallback: top-level fields only if they match the requested month
    if (e.mois === key) {
      return { mois: key, consoMensuelle: e.consoMensuelle || 0 };
    }
    return { mois: key, consoMensuelle: 0 };
  },

  calcFacture(year, month) {
    const e = this.getMonthData(year, month);
    const p = App.data.parametres;
    const conso = (e.consoMensuelle || 0) * (p.tarifKwh || 1.01);
    return conso + (p.redevancePuissance || 0) + (p.redevanceEntretien || 0) + (p.redevanceLocation || 0);
  },

  loadMonthForm() {
    const e = this.getMonthData();
    const input = document.getElementById('eConsoMensuelle');
    if (input) input.value = e.consoMensuelle || 0;
    this.updateKPI();
  },

  updateKPI() {
    const conso = parseFloat(document.getElementById('eConsoMensuelle')?.value) || 0;
    const tarif = parseFloat(document.getElementById('eTarifKwh')?.value) || 1.01;
    const rp = parseFloat(document.getElementById('eRedPuissance')?.value) || 0;
    const re = parseFloat(document.getElementById('eRedEntretien')?.value) || 0;
    const rl = parseFloat(document.getElementById('eRedLocation')?.value) || 0;
    const montantConso = conso * tarif;
    const total = montantConso + rp + re + rl;

    if (document.getElementById('eFactConso')) {
      document.getElementById('eFactConso').textContent = App.formatNumber(montantConso, 2) + ' DH';
      document.getElementById('eFactPuiss').textContent = App.formatNumber(rp, 2) + ' DH';
      document.getElementById('eFactEntr').textContent = App.formatNumber(re, 2) + ' DH';
      document.getElementById('eFactLoc').textContent = App.formatNumber(rl, 2) + ' DH';
      document.getElementById('eFactTotal').textContent = App.formatNumber(total, 2) + ' DH';
    }
  },

  saveEnergie() {
    const conso = parseFloat(document.getElementById('eConsoMensuelle').value) || 0;
    if (conso < 0) {
      App.toast('La consommation énergie doit être positive', 'error');
      return;
    }
    const apiKey = App.data.parametres?.geminiApiKey;
    if (!apiKey || apiKey.trim() === "") {
      App.toast("❌ Erreur : Clé API Gemini absente. Allez dans 'Paramètres' pour la saisir.", "error");
      event.target.value = '';
      return;
    }
    const mois = document.getElementById('eMois')?.value || this.getCurrentMonthKey();
    const current = App.data.energieMensuelle || {};
    App.data.energieMensuelle = {
      ...current,
      mois,
      consoMensuelle: conso,
      months: {
        ...(current.months || {}),
        [mois]: { mois, consoMensuelle: conso }
      }
    };
    App.data.parametres.tarifKwh = parseFloat(document.getElementById('eTarifKwh').value) || 1.01;
    App.data.parametres.redevancePuissance = parseFloat(document.getElementById('eRedPuissance').value) || 0;
    App.data.parametres.redevanceEntretien = parseFloat(document.getElementById('eRedEntretien').value) || 0;
    App.data.parametres.redevanceLocation = parseFloat(document.getElementById('eRedLocation').value) || 0;
    App.saveData();
    App.toast('Données énergie enregistrées', 'success');
  }
};
