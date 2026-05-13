/* ============================================
   TEMPERATURES — Suivi des courbes de froid
   ============================================ */
const Temperatures = {
  render() {
    const content = document.getElementById('pageContent');
    const data = App.data.relevesTemp || [];
    
    // Group by day for the chart
    const today = new Date().toISOString().split('T')[0];
    
    content.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div>
            <h2 class="page-title">Suivi des Températures</h2>
            <p class="page-subtitle">Courbes de froid et analyse thermique des chambres</p>
          </div>
          <div style="display:flex;gap:10px;">
            <input type="file" id="tempOcrInput" accept="image/*" capture="environment" style="display:none" onchange="Temperatures.processOCR(event)">
            <button class="btn btn-primary" style="background:#0ea5e9;border-color:#0ea5e9;" onclick="document.getElementById('tempOcrInput').click()">📸 Scanner Relevé (IA)</button>
            <button class="btn btn-success" onclick="Temperatures.showForm()">+ Saisie Manuelle</button>
          </div>
        </div>

        <div id="tempOcrLoading" style="display:none; text-align:center; padding:20px; background:rgba(15,23,42,0.45); border:1px dashed var(--accent-cyan); border-radius:8px; margin-bottom:20px;">
          <div style="color:var(--accent-cyan); font-weight:bold; margin-bottom:10px;">🤖 L'IA analyse votre feuille de relevés...</div>
          <div style="font-size:12px; color:var(--text-muted);">Extraction de la courbe heure par heure.</div>
        </div>

        <div class="card" style="margin-bottom:20px;">
          <div class="card-header">
            <span class="card-title">📈 Courbe de Température (Aujourd'hui)</span>
            <input type="date" id="chartDate" value="${today}" onchange="Temperatures.updateChart()" class="form-input" style="width:150px;padding:4px 8px;">
          </div>
          <div class="card-body" style="height:350px;">
            <canvas id="tempChart"></canvas>
          </div>
        </div>

        <div id="tempFormContainer"></div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">📋 Historique des relevés</span>
          </div>
          <div class="card-body">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Chambre</th>
                    <th class="td-right">Température (°C)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="tempHistoryBody">
                  ${this.renderHistory()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.updateChart();
  },

  showForm(entry = null) {
    const container = document.getElementById('tempFormContainer');
    const chambers = ['Stockage 01', 'Stockage 02', 'Entreposage', 'Tunnel 01', 'Quai'];
    
    container.innerHTML = `
      <div class="card slide-up" style="margin-bottom:20px; border:1px solid var(--accent-cyan);">
        <div class="card-header" style="background:var(--accent-cyan); color:white;">
          <span class="card-title">${entry ? 'Modifier relevé' : 'Nouvelle saisie de température'}</span>
          <button class="btn-icon" onclick="document.getElementById('tempFormContainer').innerHTML=''"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div class="card-body">
          <div class="form-grid" style="grid-template-columns: repeat(4, 1fr);">
            <div class="form-group"><label class="form-label">Date</label><input type="date" id="tDate" class="form-input" value="${entry?.date || App.formatDate(new Date())}"></div>
            <div class="form-group"><label class="form-label">Heure</label><input type="time" id="tHeure" class="form-input" value="${entry?.heure || '08:00'}"></div>
            <div class="form-group">
              <label class="form-label">Chambre</label>
              <select id="tChambre" class="form-select">
                ${chambers.map(c => `<option value="${c}" ${entry?.chambre === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Température (°C)</label><input type="number" step="0.1" id="tTemp" class="form-input" value="${entry?.temperature || ''}"></div>
          </div>
          <div style="text-align:right; margin-top:15px;">
            <button class="btn btn-success" onclick="Temperatures.saveEntry(${entry?.id || 'null'})">Enregistrer</button>
          </div>
        </div>
      </div>
    `;
  },

  saveEntry(id) {
    const date = document.getElementById('tDate').value;
    const heure = document.getElementById('tHeure').value;
    const chambre = document.getElementById('tChambre').value;
    const temperature = parseFloat(document.getElementById('tTemp').value);

    if (isNaN(temperature)) { App.toast('Saisissez une température valide', 'error'); return; }

    App.data.relevesTemp = App.data.relevesTemp || [];
    
    const entry = {
      id: id || Date.now(),
      date,
      heure,
      chambre,
      temperature
    };

    if (id) {
      const idx = App.data.relevesTemp.findIndex(r => r.id === id);
      if (idx !== -1) App.data.relevesTemp[idx] = entry;
    } else {
      App.data.relevesTemp.push(entry);
    }

    App.saveData();
    document.getElementById('tempFormContainer').innerHTML = '';
    this.render();
    App.toast('Température enregistrée', 'success');
  },

  deleteEntry(id) {
    if (!confirm('Supprimer ce relevé ?')) return;
    App.data.relevesTemp = (App.data.relevesTemp || []).filter(r => r.id !== id);
    App.saveData();
    this.render();
  },

  renderHistory() {
    const data = [...(App.data.relevesTemp || [])].sort((a,b) => (b.date + b.heure).localeCompare(a.date + a.heure));
    if (data.length === 0) return '<tr><td colspan="5" class="td-center">Aucun relevé</td></tr>';
    
    return data.slice(0, 50).map(r => `
      <tr>
        <td>${App.formatDateFR(r.date)}</td>
        <td>${r.heure}</td>
        <td>${r.chambre}</td>
        <td class="td-right td-bold" style="color:${r.temperature > -15 ? '#ef4444' : '#0ea5e9'}">${r.temperature} °C</td>
        <td class="td-center">
          <button class="btn-icon danger" onclick="Temperatures.deleteEntry(${r.id})">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  updateChart() {
    const ctx = document.getElementById('tempChart')?.getContext('2d');
    if (!ctx) return;
    
    const targetDate = document.getElementById('chartDate')?.value || new Date().toISOString().split('T')[0];
    const data = (App.data.relevesTemp || []).filter(r => r.date === targetDate);
    
    // Sort by time
    data.sort((a,b) => a.heure.localeCompare(b.heure));
    
    const chambers = [...new Set(data.map(r => r.chambre))];
    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];
    
    const datasets = chambers.map((c, i) => {
      const chamberData = data.filter(r => r.chambre === c);
      return {
        label: c,
        data: chamberData.map(r => ({ x: r.heure, y: r.temperature })),
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length] + '20',
        tension: 0.3,
        fill: false,
        pointRadius: 5
      };
    });

    if (this.chart) this.chart.destroy();
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Heure' } },
          y: { title: { display: true, text: 'Température (°C)' }, suggestedMax: 0, suggestedMin: -40 }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  },

  async processOCR(event) {
    const file = event.target.files[0];
    if (!file) return;

    const apiKey = App.data.parametres?.geminiApiKey;
    if (!apiKey) {
      App.toast("Veuillez configurer votre clé API Gemini dans les Paramètres.", "error");
      return;
    }

    const loading = document.getElementById('tempOcrLoading');
    loading.style.display = 'block';

    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });

      const prompt = `Extrait les relevés de température de ce document (courbe ou tableau). 
Renvoie un objet JSON avec la structure exacte suivante :
{
  "date": "YYYY-MM-DD",
  "releves": [
    { "heure": "HH:mm", "chambre": "Nom", "temperature": -18.5 }
  ]
}
Notes:
- Harmonise les noms de chambres : 'Stockage 01', 'Stockage 02', 'Entreposage', 'Tunnel 01'.
- Si l'heure n'est pas exacte, arrondis à la plus proche (ex: 08:00, 10:00).
- La date doit être celle indiquée sur le document.`;

      const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: file.type || "image/jpeg", data: base64Data } }
            ]
          }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) throw new Error(\`Erreur API \${response.status}\`);
      const result = await response.json();
      const data = JSON.parse(result.candidates[0].content.parts[0].text);

      if (data.releves && data.releves.length > 0) {
        data.releves.forEach(r => {
          App.data.relevesTemp.push({
            id: Date.now() + Math.random(),
            date: data.date || App.formatDate(new Date()),
            heure: r.heure,
            chambre: r.chambre,
            temperature: r.temperature
          });
        });
        App.saveData();
        this.render();
        App.toast(\`IA : \${data.releves.length} points de température extraits !\`, 'success');
      }
    } catch (err) {
      console.error(err);
      App.toast("Erreur d'analyse. Assurez-vous que le document est lisible.", "error");
    } finally {
      loading.style.display = 'none';
      event.target.value = '';
    }
  },

  async processThermographAI(event) {
    const file = event.target.files[0];
    if (!file) return;

    const apiKey = App.data.parametres?.geminiApiKey;
    if (!apiKey) {
      App.toast("Clé API Gemini manquante.", "error");
      return;
    }

    // Reuse the loading overlay if available or use a toast
    App.toast("Analyse du thermographe en cours...", "info");

    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });

      const prompt = `Analyse cette image de thermographe (courbe de température). 
Extrait les points de données de la courbe.
Renvoie un objet JSON avec la structure suivante :
{
  "date": "YYYY-MM-DD",
  "points": [
    { "heure": "HH:mm", "temperature": -18.5 }
  ],
  "chambre": "Nom de la chambre si visible (ex: Stockage 01)",
  "analyse_energie": "Bref commentaire sur la stabilité de la courbe"
}
Important :
- Extrait au moins un point toutes les 2 heures si possible.
- Assure-toi que les températures sont précises (décimales autorisées).
- Ne renvoie QUE le JSON brut, sans backticks markdown.`;

      const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: file.type || "image/jpeg", data: base64Data } }
            ]
          }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      if (!response.ok) throw new Error("Erreur API Gemini");
      const result = await response.json();
      let text = result.candidates[0].content.parts[0].text;
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(text);

      if (data.points && data.points.length > 0) {
        const chamberName = data.chambre || 'Stockage 01';
        data.points.forEach(p => {
          App.data.relevesTemp.push({
            id: Date.now() + Math.random(),
            date: data.date || App.formatDate(new Date()),
            heure: p.heure,
            chambre: chamberName,
            temperature: p.temperature
          });
        });
        App.saveData();
        
        // If we are on the chambers page, refresh it
        if (typeof Chambres !== 'undefined' && Chambres.render) Chambres.render();
        // If we are on temperatures page, refresh it
        if (this.render) this.render();

        App.toast(\`Thermographe analysé : \${data.points.length} points extraits pour \${chamberName}.\`, 'success');
        if (data.analyse_energie) {
          setTimeout(() => App.toast(\`Analyse : \${data.analyse_energie}\`, 'info'), 2000);
        }
      }
    } catch (err) {
      console.error(err);
      App.toast("Erreur lors de l'analyse du thermographe.", "error");
    } finally {
      event.target.value = '';
    }
  }
};
