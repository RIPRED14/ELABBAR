/* ============================================
   FACTURATION — Saisie des factures et charges
   ============================================ */
const Facturation = {
  editingId: null,
  currentLignes: [],

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    const factures = App.data.factures || [];
    
    // Calcul des statistiques du mois courant
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const facturesDuMois = factures.filter(f => f.date.startsWith(currentMonth));
    const totalMois = facturesDuMois.reduce((s, f) => s + f.montant, 0);

    // Calcul de la quantité totale traitée/reconditionnée ce mois-ci
    const saisiesMois = (App.data.production || []).filter(p => p.date.startsWith(currentMonth));
    const totalKgMois = saisiesMois.reduce((s, p) => s + (p.poidsBrutPF || 0), 0);
    const coutFactureParKg = totalKgMois > 0 ? (totalMois / totalKgMois) : 0;

    content.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div>
            <h2 class="page-title">Facturation & Charges</h2>
            <p class="page-subtitle">Saisie des factures et répartition sur le prix de revient</p>
          </div>
          <button class="btn btn-primary" onclick="Facturation.showForm()">+ Nouvelle Facture</button>
        </div>

        <div class="kpi-grid" style="margin-bottom:20px;">
          <div class="kpi-card" style="border-left:4px solid var(--accent-purple);">
            <div class="kpi-title">Total Factures (Ce Mois)</div>
            <div class="kpi-value" style="color:var(--accent-purple)">${App.formatNumber(totalMois, 2)} DH</div>
          </div>
          <div class="kpi-card" style="border-left:4px solid #10b981;">
            <div class="kpi-title">Volume Production (Ce Mois)</div>
            <div class="kpi-value" style="color:#10b981">${App.formatNumber(totalKgMois, 0)} kg</div>
          </div>
          <div class="kpi-card" style="border-left:4px solid #f59e0b;">
            <div class="kpi-title">Impact sur Prix de Revient</div>
            <div class="kpi-value" style="color:#f59e0b">+ ${App.formatNumber(coutFactureParKg, 2)} DH/kg</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:5px;">Sera ajouté automatiquement au calcul final</div>
          </div>
        </div>

        <div id="facturationFormContainer"></div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">📋 Historique des Factures (${factures.length})</span>
          </div>
          <div class="card-body">
            <div class="table-container">
              ${factures.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">🧾</div><div class="empty-state-text">Aucune facture enregistrée</div></div>' : `
                <table>
                  <thead><tr>
                    <th>Date</th>
                    <th>N° Facture</th>
                    <th>Fournisseur</th>
                    <th>Nb Articles</th>
                    <th class="td-right">Montant (DH)</th>
                    <th>Actions</th>
                  </tr></thead>
                  <tbody>${[...factures].sort((a,b) => new Date(b.date) - new Date(a.date)).map(f => `<tr>
                    <td>${App.formatDateFR(f.date)}</td>
                    <td class="td-bold">${f.numero || '-'}</td>
                    <td>${f.fournisseur}</td>
                    <td>${f.lignes ? f.lignes.length : 0} article(s)</td>
                    <td class="td-right td-bold" style="color:var(--accent-purple)">${App.formatNumber(f.montant, 2)}</td>
                    <td class="td-center">
                      <button class="btn-icon" onclick="Facturation.editEntry(${f.id})" title="Modifier">✏️</button>
                      <button class="btn-icon danger" onclick="Facturation.deleteEntry(${f.id})" title="Supprimer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                    </td>
                  </tr>`).join('')}</tbody>
                </table>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  showForm(entry = null) {
    this.editingId = entry ? entry.id : null;
    this.currentLignes = entry && entry.lignes ? JSON.parse(JSON.stringify(entry.lignes)) : [];
    const container = document.getElementById('facturationFormContainer');

    container.innerHTML = `
      <div class="card slide-up" style="margin-bottom:22px;border:1px solid rgba(245, 158, 11, 0.3);">
        <div class="card-header" style="background:var(--gradient-purple);border-radius:var(--radius-md) var(--radius-md) 0 0;">
          <span class="card-title" style="color:white;">${entry ? '✏️ Modifier la Facture' : '📥 Nouvelle Facture / Charge'}</span>
          <button class="btn-icon" style="border-color:rgba(255,255,255,0.3);color:white" onclick="Facturation.hideForm()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:flex-end;margin-bottom:15px;gap:10px;">
            <input type="file" id="ocrInput" accept="image/*" capture="environment" style="display:none" onchange="Facturation.processOCR(event)">
            <button class="btn btn-primary" style="background:#0ea5e9;border-color:#0ea5e9;" onclick="document.getElementById('ocrInput').click()">💼 Scanner par IA</button>
            <button class="btn btn-primary" onclick="Facturation.startScanner()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:5px;"><path d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><rect x="7" y="7" width="10" height="10" rx="2"/></svg> Scanner QR</button>
          </div>
          
          <div id="ocrLoadingArea" style="display:none; text-align:center; padding:20px; background:rgba(15,23,42,0.45); border:1px dashed rgba(148,163,184,0.35); border-radius:8px; margin-bottom:15px;">
            <div style="color:var(--accent-cyan); font-weight:bold; margin-bottom:10px;">🤖 L'Intelligence Artificielle lit votre facture...</div>
            <div style="font-size:12px; color:var(--text-muted);">Veuillez patienter (cela peut prendre quelques secondes selon votre appareil).</div>
          </div>
          <div id="factureScannerArea" style="display:none;margin-bottom:20px;">
            <div id="facture-qr-reader" style="width:100%;max-width:500px;margin:0 auto;border:2px solid var(--accent-purple);border-radius:8px;"></div>
            <div style="text-align:center;margin-top:10px;">
               <button class="btn btn-outline" onclick="Facturation.stopScanner()">Annuler Scan</button>
            </div>
          </div>

          <div class="form-grid" style="grid-template-columns:repeat(2,1fr);">
            <div class="form-group"><label class="form-label">Date Facture *</label><input type="date" class="form-input" id="fDate" value="${entry ? App.formatDate(entry.date) : App.formatDate(new Date())}"></div>
            <div class="form-group"><label class="form-label">Montant Total TTC (DH) *</label><input type="number" step="0.01" class="form-input" id="fMontant" value="${entry ? entry.montant : ''}" style="font-weight:bold;color:var(--accent-purple);"></div>
            <div class="form-group"><label class="form-label">Fournisseur / Créancier *</label><input type="text" class="form-input" id="fFournisseur" value="${entry?.fournisseur||''}" placeholder="Ex: Radeema, Fournisseur X..."></div>
            <div class="form-group"><label class="form-label">N° Facture / ICE</label><input type="text" class="form-input" id="fNumero" value="${entry?.numero||''}" placeholder="N° de la facture ou ICE"></div>
          </div>

          <h3 style="margin:25px 0 10px 0;font-size:14px;color:var(--text-primary);border-bottom:2px solid rgba(148,163,184,0.18);padding-bottom:5px;">Détail des Articles</h3>
          
          <div style="background:rgba(15,23,42,0.45);padding:12px;border-radius:6px;margin-bottom:15px;display:flex;gap:10px;align-items:end;">
            <div class="form-group" style="flex:2;"><label class="form-label">Désignation / Article</label><input type="text" class="form-input" id="nlDesignation" placeholder="Nom de l'article..."></div>
            <div class="form-group" style="flex:1;"><label class="form-label">Qté</label><input type="number" step="0.01" class="form-input" id="nlQte" value="1"></div>
            <div class="form-group" style="flex:1;"><label class="form-label">Prix Unitaire</label><input type="number" step="0.01" class="form-input" id="nlPrix" placeholder="0.00"></div>
            <button class="btn btn-outline" style="height:38px;" onclick="Facturation.addLigne()">+ Ajouter</button>
          </div>

          <table style="width:100%;margin-bottom:15px;font-size:13px;">
            <thead style="background:rgba(15,23,42,0.65);">
              <tr><th>Désignation</th><th class="td-right">Qté</th><th class="td-right">P.U.</th><th class="td-right">Total</th><th style="width:40px"></th></tr>
            </thead>
            <tbody id="fLignesTable">
              <!-- Lignes injectées ici -->
            </tbody>
            <tfoot style="font-weight:bold;background:rgba(15,23,42,0.55);">
              <tr>
                <td colspan="3" class="td-right">TOTAL ARTICLES :</td>
                <td class="td-right" id="fLignesTotal" style="color:var(--accent-purple)">0.00</td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div style="display:flex;gap:10px;justify-content:space-between;margin-top:25px;border-top:1px solid rgba(148,163,184,0.18);padding-top:15px;">
            <div style="font-size:12px;color:var(--text-muted);font-style:italic;">Note : Si vous utilisez le scanner QR, seul le Total et le Fournisseur (si DGI) seront renseignés. Veuillez ajouter les articles manuellement si nécessaire.</div>
            <div style="display:flex;gap:10px;">
              <button class="btn btn-outline" onclick="Facturation.hideForm()">Annuler</button>
              <button class="btn btn-success" onclick="Facturation.saveEntry()">💾 ${entry ? 'Mettre à jour' : 'Enregistrer la Facture'}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    this.renderLignes();
  },

  addLigne() {
    const des = document.getElementById('nlDesignation').value.trim();
    const qte = parseFloat(document.getElementById('nlQte').value) || 0;
    const prix = parseFloat(document.getElementById('nlPrix').value) || 0;
    
    if (!des || qte <= 0) { App.toast('Désignation et quantité requises', 'error'); return; }
    
    this.currentLignes.push({ article: des, qte, prix, total: qte * prix });
    
    document.getElementById('nlDesignation').value = '';
    document.getElementById('nlQte').value = '1';
    document.getElementById('nlPrix').value = '';
    
    // Auto-update total amount if articles total is bigger than current amount
    this.renderLignes();
    const sum = this.currentLignes.reduce((s,l)=>s+l.total, 0);
    const mntInput = document.getElementById('fMontant');
    if (!mntInput.value || parseFloat(mntInput.value) < sum) {
      mntInput.value = sum.toFixed(2);
    }
  },

  removeLigne(idx) {
    this.currentLignes.splice(idx, 1);
    this.renderLignes();
  },

  renderLignes() {
    const tbody = document.getElementById('fLignesTable');
    if (!tbody) return;
    
    if (this.currentLignes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="td-center" style="color:var(--text-muted)">Aucun article ajouté</td></tr>';
      document.getElementById('fLignesTotal').textContent = '0.00';
      return;
    }
    
    tbody.innerHTML = this.currentLignes.map((l, i) => `
      <tr>
        <td contenteditable="true" onblur="this.textContent=this.textContent.trim();Facturation.updateLigne(${i}, 'article', this.textContent)" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'))" style="background:rgba(15,23,42,0.45);border-bottom:1px dashed rgba(148,163,184,0.25);padding:5px;cursor:text;">${l.article}</td>
        <td class="td-right" contenteditable="true" onblur="this.textContent=this.textContent.trim();Facturation.updateLigne(${i}, 'qte', this.textContent)" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'))" style="background:rgba(15,23,42,0.45);border-bottom:1px dashed rgba(148,163,184,0.25);padding:5px;cursor:text;">${l.qte}</td>
        <td class="td-right" contenteditable="true" onblur="this.textContent=this.textContent.trim();Facturation.updateLigne(${i}, 'prix', this.textContent)" onpaste="event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'))" style="background:rgba(15,23,42,0.45);border-bottom:1px dashed rgba(148,163,184,0.25);padding:5px;cursor:text;">${App.formatNumber(l.prix, 2)}</td>
        <td class="td-right td-bold" style="padding:5px;">${App.formatNumber(l.total, 2)}</td>
        <td class="td-center"><button class="btn-icon danger" onclick="Facturation.removeLigne(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
      </tr>
    `).join('');
    
    const sum = this.currentLignes.reduce((s,l)=>s+l.total, 0);
    document.getElementById('fLignesTotal').textContent = App.formatNumber(sum, 2);
  },

  updateLigne(idx, field, val) {
    if (!this.currentLignes[idx]) return;
    if (field === 'article') {
       this.currentLignes[idx].article = val.trim();
    } else {
       let num = parseFloat(val.replace(',', '.'));
       if (!isNaN(num) && num >= 0) {
         this.currentLignes[idx][field] = num;
         this.currentLignes[idx].total = this.currentLignes[idx].qte * this.currentLignes[idx].prix;
       }
    }
    this.renderLignes();
  },

  hideForm() {
    this.stopScanner();
    const container = document.getElementById('facturationFormContainer');
    if (container) container.innerHTML = '';
    this.editingId = null;
    this.currentLignes = [];
  },

  saveEntry() {
    const date = document.getElementById('fDate').value;
    const montant = parseFloat(document.getElementById('fMontant').value);
    const fournisseur = document.getElementById('fFournisseur').value.trim();
    const numero = document.getElementById('fNumero').value.trim();

    if (!date || !fournisseur || isNaN(montant) || montant <= 0) {
      App.toast('Veuillez remplir la date, le fournisseur et un montant valide.', 'error');
      return;
    }

    App.data.factures = App.data.factures || [];
    
    const entry = {
      id: this.editingId || App.nextId(App.data.factures),
      date,
      montant,
      fournisseur,
      numero,
      lignes: this.currentLignes
    };

    if (this.editingId) {
      const idx = App.data.factures.findIndex(e => e.id === this.editingId);
      if (idx !== -1) App.data.factures[idx] = entry;
    } else {
      App.data.factures.push(entry);
    }

    App.saveData();
    this.hideForm();
    this.render();
    App.toast(this.editingId ? 'Facture mise à jour' : 'Facture enregistrée avec succès', 'success');
  },

  editEntry(id) {
    const entry = (App.data.factures || []).find(e => e.id === id);
    if (entry) this.showForm(entry);
  },

  deleteEntry(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette facture ? Son montant sera retiré du calcul du Prix de Revient.')) return;
    App.data.factures = (App.data.factures || []).filter(e => e.id !== id);
    App.saveData();
    this.render();
    App.toast('Facture supprimée', 'info');
  },

  /* --- QR SCANNER LOGIC (JSON & DGI TLV) --- */
  html5QrcodeScanner: null,

  startScanner() {
    const area = document.getElementById('factureScannerArea');
    if (!area) return;
    area.style.display = 'block';
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear();
    }
    this.html5QrcodeScanner = new Html5QrcodeScanner("facture-qr-reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
    this.html5QrcodeScanner.render((decodedText) => this.onScanSuccess(decodedText), (err) => {});
  },

  stopScanner() {
    const area = document.getElementById('factureScannerArea');
    if (area) area.style.display = 'none';
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear().catch(e => console.error(e));
      this.html5QrcodeScanner = null;
    }
  },

  // Décodeur TLV (Tag-Length-Value) pour les factures marocaines (DGI)
  parseDGITLV(base64Str) {
    try {
      const bin = atob(base64Str);
      let i = 0;
      const data = {};
      while (i < bin.length) {
        const tag = bin.charCodeAt(i++);
        const len = bin.charCodeAt(i++);
        let valBytes = [];
        for (let j = 0; j < len; j++) valBytes.push(bin.charCodeAt(i++));
        // Utf8 decode
        const val = decodeURIComponent(escape(String.fromCharCode.apply(null, valBytes)));
        if (tag === 1) data.fournisseur = val;
        if (tag === 2) data.ice = val;
        if (tag === 3) data.date = val;
        if (tag === 4) data.montant = parseFloat(val);
        if (tag === 5) data.tva = parseFloat(val);
      }
      return data;
    } catch(e) {
      return null;
    }
  },

  onScanSuccess(decodedText) {
    this.stopScanner();
    App.toast('QR Code lu avec succès !', 'success');
    
    let montant = null;
    let fournisseur = null;
    let date = null;
    let numero = null;

    // 1. Tenter le décodeur DGI Maroc (Factures standards)
    // Les codes QR DGI sont souvent des chaînes Base64
    const dgiData = this.parseDGITLV(decodedText);
    if (dgiData && dgiData.montant) {
      montant = dgiData.montant;
      if (dgiData.fournisseur) fournisseur = dgiData.fournisseur;
      if (dgiData.ice) numero = dgiData.ice;
      App.toast('Facture Marocaine DGI reconnue !', 'success');
    } else {
      // 2. Tenter de parser si c'est du JSON (Format ERP spécifique)
      try {
        const data = JSON.parse(decodedText);
        montant = parseFloat(data.total || data.montant || data.amount);
        fournisseur = data.fournisseur || data.fourn || data.vendor;
        numero = data.facture || data.numero || data.invoice;
        
        // S'il y a des articles dans le JSON, on les ajoute !
        if (data.articles && Array.isArray(data.articles)) {
          data.articles.forEach(a => {
            const qte = parseFloat(a.qte || a.quantite || 1);
            const prix = parseFloat(a.prix || a.price || 0);
            this.currentLignes.push({
              article: a.nom || a.article || a.designation || 'Article Scanné',
              qte: qte,
              prix: prix,
              total: qte * prix
            });
          });
          this.renderLignes();
        }
      } catch (e) {
        // 3. Fallback: Extraction basique du montant si c'est du texte brut
        const numbers = decodedText.match(/[0-9]+(\.[0-9]{1,2})?/g);
        if (numbers && numbers.length > 0) {
          montant = Math.max(...numbers.map(Number));
        }
      }
    }

    // Application des données extraites au formulaire
    if (montant && montant > 0) {
      document.getElementById('fMontant').value = montant.toFixed(2);
    }
    if (fournisseur) {
      document.getElementById('fFournisseur').value = fournisseur;
    }
    if (numero) {
      document.getElementById('fNumero').value = numero;
    }
  },

  async processOCR(event) {
    const file = event.target.files[0];
    if (!file) return;

    const apiKey = App.data.parametres?.geminiApiKey;
    if (!apiKey) {
      App.toast("Veuillez configurer votre clé API Gemini dans les Paramètres.", "error");
      event.target.value = '';
      return;
    }

    // Show loading overlay
    document.getElementById('ocrLoadingArea').style.display = 'block';
    
    try {
      // Convert file to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });

      const prompt = `Extrait les informations de cette facture. 
Renvoie un objet JSON avec la structure exacte suivante, SANS aucun bloc de code markdown (\`\`\`json) autour, uniquement le JSON brut :
{
  "fournisseur": "Nom du fournisseur",
  "montant": 0.0,
  "articles": [
    { "article": "Nom", "qte": 1, "prix": 0.0, "total": 0.0 }
  ]
}
Assure-toi que les nombres utilisent un point pour les décimales. Si la quantité est absente, mets 1. Si les articles ne sont pas lisibles, renvoie un tableau vide pour "articles". Le montant doit être le Total TTC.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: file.type || "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`Erreur API ${response.status}: ${errorBody.error?.message || response.statusText}`);
      }

      const result = await response.json();
      if (!result.candidates || !result.candidates[0].content.parts[0].text) {
        throw new Error("L'IA n'a pas pu extraire de texte. Vérifiez la qualité de l'image.");
      }

      let textResponse = result.candidates[0].content.parts[0].text;
      const data = JSON.parse(textResponse);

      if (data.fournisseur) document.getElementById('fFournisseur').value = data.fournisseur;
      if (data.montant) document.getElementById('fMontant').value = data.montant.toFixed(2);
      
      if (data.articles && data.articles.length > 0) {
        this.currentLignes = [...this.currentLignes, ...data.articles];
        this.renderLignes();
        
        // Recalculate total if needed
        const sum = this.currentLignes.reduce((s,l)=>s+(l.total || l.qte*l.prix), 0);
        if (sum > (data.montant || 0)) document.getElementById('fMontant').value = sum.toFixed(2);
        
        App.toast(`Magie de l'IA : ${data.articles.length} articles trouvés avec précision !`, 'success');
      } else {
        App.toast('Lecture terminée. Remplissage partiel effectué.', 'info');
      }
      
    } catch (err) {
      console.error(err);
      App.toast(`Erreur : ${err.message}`, "error");
    } finally {
      document.getElementById('ocrLoadingArea').style.display = 'none';
      event.target.value = ''; 
    }
  }
};
