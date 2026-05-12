/* ============================================
   CONSOMMABLES — Stock + Seuils + Alertes
   ============================================ */
const Consommables = {
  render() {
    const cons = App.data.consommables;
    const alerts = App.getAlerts();
    const content = document.getElementById('pageContent');

    let alertsHtml = '';
    if (alerts.length > 0) {
      const criticals = alerts.filter(a => a.type === 'critical');
      const warnings = alerts.filter(a => a.type === 'warning');
      if (criticals.length > 0) alertsHtml += `<div class="alerts-banner"><span class="alerts-banner-icon">🚨</span><div class="alerts-banner-text"><strong>STOCK CRITIQUE :</strong> ${criticals.map(a=>a.message).join(' | ')}</div></div>`;
      if (warnings.length > 0) alertsHtml += `<div class="alerts-banner warning"><span class="alerts-banner-icon">⚠️</span><div class="alerts-banner-text"><strong>Stock bas :</strong> ${warnings.map(a=>a.message).join(' | ')}</div></div>`;
    }

    content.innerHTML = `
      <div class="fade-in">
        ${alertsHtml}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div><h2 class="page-title">Gestion des Consommables</h2><p class="page-subtitle">Stock, seuils critiques et alertes</p></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-success btn-sm" onclick="Consommables.showReception()">📥 Réception stock</button>
            <button class="btn btn-primary btn-sm" onclick="Consommables.showAddModal()">+ Ajouter</button>
          </div>
        </div>

        <div class="card" style="margin-bottom:22px;">
          <div class="card-header"><span class="card-title">📦 État des stocks</span></div>
          <div class="card-body"><div class="table-container">${this.buildStockTable()}</div></div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">📋 Historique des mouvements</span></div>
          <div class="card-body"><div class="table-container">${this.buildMouvementsTable()}</div></div>
        </div>
      </div>
    `;
  },

  getStatus(c) {
    if (c.stock <= c.seuilCritique) return { label: 'CRITIQUE', cls: 'critical', pct: Math.min(100, (c.stock / c.seuilCritique) * 30) };
    if (c.stock <= c.seuilAlerte) return { label: 'ALERTE', cls: 'warning', pct: 30 + ((c.stock - c.seuilCritique) / (c.seuilAlerte - c.seuilCritique)) * 30 };
    return { label: 'OK', cls: 'ok', pct: Math.min(100, 60 + ((c.stock - c.seuilAlerte) / (c.seuilAlerte * 2)) * 40) };
  },

  buildStockTable() {
    const cons = App.data.consommables;
    return `<table>
      <thead><tr><th>Consommable</th><th>Unité</th><th>Stock</th><th>Seuil Alerte</th><th>Seuil Critique</th><th>Prix Unit.</th><th>Statut</th><th>Niveau</th><th>Actions</th></tr></thead>
      <tbody>${cons.map(c => {
        const st = this.getStatus(c);
        return `<tr>
          <td class="td-bold">${c.nom}</td>
          <td>${c.unite}</td>
          <td class="td-right td-bold">${App.formatNumber(c.stock, 0)}</td>
          <td class="td-right">${c.seuilAlerte}</td>
          <td class="td-right">${c.seuilCritique}</td>
          <td class="td-right">${App.formatNumber(c.prixUnitaire)} DH</td>
          <td><span class="badge badge-${st.cls}">${st.cls === 'critical' ? '🔴' : st.cls === 'warning' ? '🟡' : '🟢'} ${st.label}</span></td>
          <td style="min-width:120px"><div class="stock-bar"><div class="stock-bar-fill ${st.cls}" style="width:${st.pct}%"></div></div></td>
          <td class="td-center">
            <button class="btn-icon" onclick="Consommables.editModal(${c.id})" title="Modifier"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
            <button class="btn-icon danger" onclick="Consommables.deleteItem(${c.id})" title="Supprimer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
          </td>
        </tr>`}).join('')}</tbody>
    </table>`;
  },

  buildMouvementsTable() {
    const mvts = (App.data.mouvementsStock || []).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    if (mvts.length === 0) return '<div class="empty-state"><div class="empty-state-icon">📋</div><div>Aucun mouvement</div></div>';
    return `<table>
      <thead><tr><th>Date</th><th>Consommable</th><th>Type</th><th>Quantité</th><th>Motif</th></tr></thead>
      <tbody>${mvts.map(m => `<tr>
        <td>${App.formatDateFR(m.date)}</td>
        <td class="td-bold">${m.consommable}</td>
        <td><span class="badge ${m.type==='entree'?'badge-ok':'badge-warning'}">${m.type==='entree'?'📥 Entrée':'📤 Sortie'}</span></td>
        <td class="td-right td-bold">${m.type==='entree'?'+':'-'}${App.formatNumber(m.quantite, 0)}</td>
        <td>${m.motif||''}</td>
      </tr>`).join('')}</tbody>
    </table>`;
  },

  showAddModal(entry = null) {
    const isEdit = !!entry;
    App.showModal(isEdit ? '✏️ Modifier consommable' : '➕ Ajouter un consommable', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="cNom" value="${entry?.nom||''}"></div>
        <div class="form-group"><label class="form-label">Unité</label><input type="text" class="form-input" id="cUnite" value="${entry?.unite||'pièce'}"></div>
        <div class="form-group"><label class="form-label">Stock actuel</label><input type="number" class="form-input" id="cStock" value="${entry?.stock||0}"></div>
        <div class="form-group"><label class="form-label">Prix unitaire (DH)</label><input type="number" step="0.01" class="form-input" id="cPrix" value="${entry?.prixUnitaire||0}"></div>
        <div class="form-group"><label class="form-label">Seuil d'alerte 🟡</label><input type="number" class="form-input" id="cSeuilAlerte" value="${entry?.seuilAlerte||100}"></div>
        <div class="form-group"><label class="form-label">Seuil critique 🔴</label><input type="number" class="form-input" id="cSeuilCritique" value="${entry?.seuilCritique||50}"></div>
      </div>
    `, `<button class="btn btn-outline" onclick="App.closeModal()">Annuler</button>
       <button class="btn btn-success" onclick="Consommables.saveItem(${entry?.id||0})">${isEdit?'Mettre à jour':'Ajouter'}</button>`);
  },

  editModal(id) {
    const c = App.data.consommables.find(c => c.id === id);
    if (c) this.showAddModal(c);
  },

  saveItem(editId) {
    const nom = document.getElementById('cNom').value.trim();
    if (!nom) { App.toast('Le nom est requis', 'error'); return; }
    const data = {
      nom, unite: document.getElementById('cUnite').value,
      stock: parseFloat(document.getElementById('cStock').value) || 0,
      prixUnitaire: parseFloat(document.getElementById('cPrix').value) || 0,
      seuilAlerte: parseFloat(document.getElementById('cSeuilAlerte').value) || 0,
      seuilCritique: parseFloat(document.getElementById('cSeuilCritique').value) || 0,
    };
    if (data.stock < 0 || data.prixUnitaire < 0 || data.seuilAlerte < 0 || data.seuilCritique < 0) {
      App.toast('Les valeurs numériques doivent être positives', 'error');
      return;
    }
    if (data.seuilCritique > data.seuilAlerte && data.seuilAlerte > 0) {
      App.toast('Le seuil critique doit être inférieur ou égal au seuil alerte', 'error');
      return;
    }

    if (editId) {
      const idx = App.data.consommables.findIndex(c => c.id === editId);
      if (idx !== -1) {
        const oldStock = App.data.consommables[idx].stock || 0;
        App.data.consommables[idx] = { ...App.data.consommables[idx], ...data };
        const delta = data.stock - oldStock;
        if (delta !== 0) {
          if (!App.data.mouvementsStock) App.data.mouvementsStock = [];
          App.data.mouvementsStock.push({
            date: new Date().toISOString(),
            consommable: data.nom,
            type: delta > 0 ? 'entree' : 'sortie',
            quantite: Math.abs(delta),
            motif: 'Ajustement manuel'
          });
        }
      }
    } else {
      data.id = App.nextId(App.data.consommables);
      App.data.consommables.push(data);
    }
    App.saveData();
    App.closeModal();
    this.render();
    App.toast(editId ? 'Consommable modifié' : 'Consommable ajouté', 'success');
  },

  deleteItem(id) {
    const item = App.data.consommables.find(c => c.id === id);
    if (item && (App.data.mouvementsStock || []).some(m => m.consommable === item.nom)) {
      App.toast('Suppression bloquée: ce consommable possède un historique de mouvements', 'error');
      return;
    }
    if (!confirm('Supprimer ce consommable ?')) return;
    App.data.consommables = App.data.consommables.filter(c => c.id !== id);
    App.saveData();
    this.render();
    App.toast('Consommable supprimé', 'info');
  },

  showReception() {
    const opts = App.data.consommables.map(c => `<option value="${c.id}">${c.nom} (stock: ${c.stock} ${c.unite})</option>`).join('');
    App.showModal('📥 Réception de stock', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Consommable</label><select class="form-select" id="rConsommable">${opts}</select></div>
        <div class="form-group"><label class="form-label">Quantité reçue</label><input type="number" class="form-input" id="rQuantite" value="0"></div>
        <div class="form-group"><label class="form-label">Motif / Fournisseur</label><input type="text" class="form-input" id="rMotif" placeholder="Ex: Commande fournisseur X"></div>
      </div>
    `, `<button class="btn btn-outline" onclick="App.closeModal()">Annuler</button>
       <button class="btn btn-success" onclick="Consommables.saveReception()">📥 Enregistrer</button>`);
  },

  saveReception() {
    const id = parseInt(document.getElementById('rConsommable').value);
    const qty = parseFloat(document.getElementById('rQuantite').value) || 0;
    const motif = document.getElementById('rMotif').value;
    if (qty <= 0) { App.toast('Quantité invalide', 'error'); return; }
    const c = App.data.consommables.find(c => c.id === id);
    if (c) {
      c.stock += qty;
      App.data.mouvementsStock.push({ date: new Date().toISOString(), consommable: c.nom, type: 'entree', quantite: qty, motif });
      App.saveData();
      App.closeModal();
      this.render();
      App.toast(`+${qty} ${c.unite} de ${c.nom} ajoutés`, 'success');
    }
  }
};
