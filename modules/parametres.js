/* ============================================
   PARAMETRES — Configuration générale
   ============================================ */
const Parametres = {
  render() {
    const p = App.data.parametres;
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div><h2 class="page-title">Paramètres</h2><p class="page-subtitle">Configuration générale du système</p></div>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="card-header"><span class="card-title">💰 Main-d'œuvre</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Salaire horaire M.O. Occ. (DH)</label><input type="number" class="form-input" id="pSalaireOcc" value="${p.salaireHoraireOcc||17}"></div>
              <div class="form-group"><label class="form-label">Heures mensuelles (fixe)</label><input type="number" class="form-input" id="pHeuresMens" value="${p.heuresMensuelles||208}"></div>
              <div class="form-group"><label class="form-label">Salaire Qualité (DH/mois)</label><input type="number" class="form-input" id="pSalaireQualite" value="${p.salaireQualite||9000}"></div>
              <div class="form-group"><label class="form-label">Salaire Administration (DH/mois)</label><input type="number" class="form-input" id="pSalaireAdmin" value="${p.salaireAdmin||25000}"></div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="card-header"><span class="card-title">⚡ Énergie</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Tarif kWh (DH)</label><input type="number" step="0.01" class="form-input" id="pTarifKwh" value="${p.tarifKwh||1.01}"></div>
              <div class="form-group"><label class="form-label">Puissance souscrite (KVA)</label><input type="number" class="form-input" id="pPuissance" value="${p.puissanceKVA||400}"></div>
              <div class="form-group"><label class="form-label">Redevance puissance (DH)</label><input type="number" class="form-input" id="pRedPuiss" value="${p.redevancePuissance||17087.58}"></div>
              <div class="form-group"><label class="form-label">Redevance entretien (DH)</label><input type="number" class="form-input" id="pRedEntr" value="${p.redevanceEntretien||391.20}"></div>
              <div class="form-group"><label class="form-label">Redevance location (DH)</label><input type="number" class="form-input" id="pRedLoc" value="${p.redevanceLocation||215.05}"></div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="card-header"><span class="card-title">🚚 Logistique</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Coût carburant (DH/mois)</label><input type="number" class="form-input" id="pCarburant" value="${p.coutCarburant||300}"></div>
              <div class="form-group"><label class="form-label">Personnel logistique (DH/mois)</label><input type="number" class="form-input" id="pPersLog" value="${p.coutPersonnelLogistique||4000}"></div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="card-header"><span class="card-title">🤖 Intelligence Artificielle (OCR)</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group" style="grid-column: span 2;">
                <label class="form-label">Clé API Google Gemini (AI Studio)</label>
                <input type="password" class="form-input" id="pGeminiKey" value="${p.geminiApiKey||''}" placeholder="AIzaSy...">
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 5px;">
                  Sert à analyser intelligemment les factures via la section "Facturation". Obtenez une clé gratuite sur <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent-purple)">Google AI Studio</a>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="card-header"><span class="card-title">🐟 Espèces de poisson & Calibres</span></div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:16px;margin-bottom:14px;" id="especesList">
              ${App.data.especes.map(e => `
                <div class="card" style="padding:12px;background:var(--bg-tertiary);">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <strong style="font-size:1.1rem;color:var(--accent-purple-light);">${e.nom}</strong>
                    <button class="btn-icon danger" onclick="Parametres.removeEspece('${e.nom}')" style="width:24px;height:24px;" title="Supprimer l'espèce">✕</button>
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                    ${e.calibres.map(c => `
                      <span class="badge badge-purple" style="font-size:0.8rem;padding:4px 8px;">
                        ${c}
                        <span style="cursor:pointer;margin-left:6px;opacity:0.7" onclick="Parametres.generateQR('${e.nom}', '${c}')" title="Générer QR">QR</span>
                        <span style="cursor:pointer;margin-left:6px;opacity:0.7" onclick="Parametres.removeCalibre('${e.nom}', '${c}')" title="Supprimer calibre">✕</span>
                      </span>
                    `).join('')}
                  </div>
                  <div style="display:flex;gap:6px;">
                    <input type="text" class="form-input" id="newCalibre_${e.nom.replace(/\s+/g, '_')}" placeholder="Nouveau calibre..." style="padding:4px 8px;font-size:0.85rem;flex:1">
                    <button class="btn btn-success btn-sm" onclick="Parametres.addCalibre('${e.nom}')">Add</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="display:flex;gap:8px;margin-top:16px;">
              <input type="text" class="form-input" id="newEspece" placeholder="Nouvelle espèce..." style="flex:1">
              <button class="btn btn-primary btn-sm" onclick="Parametres.addEspece()">Ajouter Espèce</button>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:18px;">
          <div class="card-header"><span class="card-title">🚢 Clients / Fournisseurs & Bateaux</span></div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:16px;margin-bottom:14px;" id="clientsList">
              ${(App.data.clients||[]).map((c, ci) => `
                <div class="card" style="padding:12px;background:var(--bg-tertiary);">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <strong style="font-size:1rem;color:var(--accent-cyan);">${c.nom}</strong>
                    <button class="btn-icon danger" onclick="Parametres.removeClient(${ci})" style="width:24px;height:24px;" title="Supprimer">✕</button>
                  </div>
                  <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">${c.type} — ${c.ville}</div>
                  <div style="font-size:0.82rem;font-weight:600;margin-bottom:4px;color:var(--text-secondary);">🚢 Bateaux:</div>
                  <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
                    ${(c.bateaux||[]).length === 0 ? '<span style="font-size:0.78rem;color:var(--text-muted);font-style:italic;">Aucun bateau</span>' :
                      (c.bateaux||[]).map((b, bi) => `
                        <span class="badge badge-info" style="font-size:0.78rem;padding:3px 8px;">
                          ${b.nom} <span style="opacity:0.7;font-size:0.7rem;">${b.agrement||''}</span>
                          <span style="cursor:pointer;margin-left:4px;opacity:0.7" onclick="Parametres.removeBateau(${ci},${bi})">✕</span>
                        </span>
                      `).join('')}
                  </div>
                  <div style="display:flex;gap:5px;">
                    <input type="text" class="form-input" id="newBat_${ci}" placeholder="Nom bateau..." style="padding:3px 6px;font-size:0.82rem;flex:1">
                    <select class="form-select" id="newBatType_${ci}" style="padding:3px 6px;font-size:0.82rem;width:100px;">
                      <option value="Congelateur">Congelateur</option>
                      <option value="RSW">RSW</option>
                      <option value="Glaciere">Glacière</option>
                    </select>
                    <button class="btn btn-success btn-sm" onclick="Parametres.addBateau(${ci})" style="font-size:0.78rem;">+</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
              <input type="text" class="form-input" id="newClientNom" placeholder="Raison sociale..." style="flex:2;min-width:150px;">
              <select class="form-select" id="newClientType" style="flex:2;min-width:150px;">
                <option value="Armateur, Client, Fournisseur poisson">Armateur/Client/Fournisseur</option>
                <option value="Client, Fournisseur poisson">Client/Fournisseur</option>
                <option value="Fournisseur divers achats">Fournisseur divers</option>
                <option value="Frigo">Frigo</option>
              </select>
              <input type="text" class="form-input" id="newClientVille" placeholder="Ville..." style="flex:1;min-width:100px;">
              <button class="btn btn-primary btn-sm" onclick="Parametres.addClient()">+ Ajouter Client</button>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-success" onclick="Parametres.save()">💾 Enregistrer les paramètres</button>
          <button class="btn btn-outline" onclick="App.exportData()">📤 Exporter données (JSON)</button>
          <label class="btn btn-outline" style="cursor:pointer;">📥 Importer données<input type="file" accept=".json" style="display:none" onchange="App.importData(this.files[0])"></label>
          <button class="btn btn-danger" onclick="App.resetData()">🗑️ Réinitialiser</button>
        </div>
      </div>
    `;
  },

  save() {
    const v = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    App.data.parametres = {
      salaireHoraireOcc: v('pSalaireOcc'),
      heuresMensuelles: v('pHeuresMens'),
      salaireQualite: v('pSalaireQualite'),
      salaireAdmin: v('pSalaireAdmin'),
      tarifKwh: v('pTarifKwh'),
      puissanceKVA: v('pPuissance'),
      redevancePuissance: v('pRedPuiss'),
      redevanceEntretien: v('pRedEntr'),
      redevanceLocation: v('pRedLoc'),
      coutCarburant: v('pCarburant'),
      coutPersonnelLogistique: v('pPersLog'),
      geminiApiKey: document.getElementById('pGeminiKey')?.value || '',
    };
    App.saveData();
    App.toast('Paramètres enregistrés', 'success');
  },

  addEspece() {
    const input = document.getElementById('newEspece');
    const val = input.value.trim().toUpperCase();
    if (!val) return;
    if (App.data.especes.some(e => e.nom === val)) { App.toast('Cette espèce existe déjà', 'error'); return; }
    App.data.especes.push({ nom: val, calibres: ['1', '2', '3', '4'] });
    App.saveData();
    input.value = '';
    this.render();
    App.toast(`Espèce "${val}" ajoutée`, 'success');
  },

  removeEspece(nom) {
    const usedInStock = (App.data.stockage || []).some(e => (e.lignes || []).some(l => l.espece === nom));
    const usedInProduction = (App.data.production || []).some(p => p.espece === nom);
    const usedInQR = (App.data.qrCodes || []).some(q => q.value === nom || q.espece === nom);
    if (usedInStock || usedInProduction || usedInQR) {
      App.toast('Suppression bloquée: cette espèce est utilisée dans les données', 'error');
      return;
    }
    if (!confirm(`Supprimer l'espèce "${nom}" ?`)) return;
    App.data.especes = App.data.especes.filter(e => e.nom !== nom);
    App.saveData();
    this.render();
    App.toast(`Espèce "${nom}" supprimée`, 'info');
  },

  addCalibre(nomEspece) {
    const inputId = 'newCalibre_' + nomEspece.replace(/\s+/g, '_');
    const input = document.getElementById(inputId);
    const val = input.value.trim().toUpperCase();
    if (!val) return;
    const esp = App.data.especes.find(e => e.nom === nomEspece);
    if (esp) {
      if (esp.calibres.includes(val)) { App.toast('Ce calibre existe déjà', 'error'); return; }
      esp.calibres.push(val);
      App.saveData();
      this.render();
      App.toast(`Calibre "${val}" ajouté à ${nomEspece}`, 'success');
    }
  },

  removeCalibre(nomEspece, calibre) {
    const esp = App.data.especes.find(e => e.nom === nomEspece);
    if (esp) {
      const usedInStock = (App.data.stockage || []).some(e => (e.lignes || []).some(l => l.espece === nomEspece && l.calibre === calibre));
      const usedInProduction = (App.data.production || []).some(p => p.espece === nomEspece && p.calibre === calibre);
      const usedInQR = (App.data.qrCodes || []).some(q => q.espece === nomEspece && q.calibre === calibre);
      if (usedInStock || usedInProduction || usedInQR) {
        App.toast('Suppression bloquée: ce calibre est utilisé dans les données', 'error');
        return;
      }
      esp.calibres = esp.calibres.filter(c => c !== calibre);
      App.saveData();
      this.render();
      App.toast(`Calibre "${calibre}" supprimé de ${nomEspece}`, 'info');
    }
  },

  generateQR(espece, calibre) {
    const data = JSON.stringify({ type: 'espece_calibre', espece, calibre });
    const html = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
        <div id="qrcode" style="padding:16px;background:white;border-radius:8px;"></div>
        <div style="text-align:center;">
          <strong style="font-size:1.2rem;color:var(--text-primary);">${espece}</strong><br>
          <span class="badge badge-purple" style="font-size:1rem;margin-top:6px;">Calibre: ${calibre}</span>
        </div>
        <button class="btn btn-primary" onclick="Parametres.printQR()">🖨️ Imprimer</button>
      </div>
    `;
    App.showModal(`QR Code — ${espece} (Calibre ${calibre})`, html);
    setTimeout(() => {
      new QRCode(document.getElementById("qrcode"), {
        text: data,
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    }, 100);
  },

  printQR() {
    const printContents = document.querySelector('.modal-body').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression QR Code</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; margin: 0; }
            #qrcode { margin-bottom: 20px; }
            strong { font-size: 24px; }
            .badge { font-size: 18px; border: 1px solid #ccc; padding: 5px 10px; border-radius: 5px; margin-top: 10px; display: inline-block; }
            button { display: none; }
          </style>
        </head>
        <body>
          ${printContents}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  },

  // --- Clients / Bateaux CRUD ---
  addClient() {
    const nom = document.getElementById('newClientNom')?.value?.trim();
    const type = document.getElementById('newClientType')?.value || '';
    const ville = document.getElementById('newClientVille')?.value?.trim() || 'Agadir';
    if (!nom) { App.toast('Saisissez le nom du client', 'error'); return; }
    if (!App.data.clients) App.data.clients = [];
    if (App.data.clients.some(c => c.nom.toUpperCase() === nom.toUpperCase())) {
      App.toast('Ce client existe déjà', 'error'); return;
    }
    App.data.clients.push({ nom: nom.toUpperCase(), type, ville, bateaux: [] });
    App.data.clients.sort((a, b) => a.nom.localeCompare(b.nom));
    App.saveData();
    this.render();
    App.toast('Client ajouté', 'success');
  },

  removeClient(idx) {
    if (!confirm('Supprimer ce client ?')) return;
    App.data.clients.splice(idx, 1);
    App.saveData();
    this.render();
    App.toast('Client supprimé', 'info');
  },

  addBateau(clientIdx) {
    const nom = document.getElementById(`newBat_${clientIdx}`)?.value?.trim();
    const type = document.getElementById(`newBatType_${clientIdx}`)?.value || 'Congelateur';
    if (!nom) { App.toast('Saisissez le nom du bateau', 'error'); return; }
    const client = App.data.clients[clientIdx];
    if (!client.bateaux) client.bateaux = [];
    if (client.bateaux.some(b => b.nom.toUpperCase() === nom.toUpperCase())) {
      App.toast('Ce bateau existe déjà pour ce client', 'error'); return;
    }
    client.bateaux.push({ nom: nom.toUpperCase(), type, agrement: '' });
    App.saveData();
    this.render();
    App.toast(`Bateau "${nom}" ajouté à ${client.nom}`, 'success');
  },

  removeBateau(clientIdx, bateauIdx) {
    App.data.clients[clientIdx].bateaux.splice(bateauIdx, 1);
    App.saveData();
    this.render();
    App.toast('Bateau supprimé', 'info');
  }
};
