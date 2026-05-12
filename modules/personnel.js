/* ============================================
   PERSONNEL — Gestion du personnel
   ============================================ */
const Personnel = {
  render() {
    const pers = App.data.personnel;
    const totalSalaire = pers.reduce((s, p) => s + p.salaire, 0);
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="fade-in">
        <div class="kpi-grid">
          <div class="kpi-card purple"><div class="kpi-icon purple">👥</div><div class="kpi-label">Effectif total</div><div class="kpi-value">${pers.length}</div></div>
          <div class="kpi-card green"><div class="kpi-icon green">💰</div><div class="kpi-label">Masse salariale fixe</div><div class="kpi-value">${App.formatNumber(totalSalaire,0)}<span class="kpi-unit">DH</span></div></div>
          <div class="kpi-card blue"><div class="kpi-icon blue">📊</div><div class="kpi-label">Salaire moyen</div><div class="kpi-value">${App.formatNumber(pers.length>0?totalSalaire/pers.length:0,0)}<span class="kpi-unit">DH</span></div></div>
          <div class="kpi-card yellow"><div class="kpi-icon yellow">⏱️</div><div class="kpi-label">Taux horaire M.O. Occ.</div><div class="kpi-value">${App.data.parametres.salaireHoraireOcc}<span class="kpi-unit">DH/h</span></div></div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">👥 Personnel Fixe</span>
            <button class="btn btn-primary btn-sm" onclick="Personnel.showAddModal()">+ Ajouter</button>
          </div>
          <div class="card-body"><div class="table-container" id="personnelTable">${this.buildTable()}</div></div>
          <div class="card-footer" style="display:flex;justify-content:flex-end;">
            <strong>Total : ${App.formatNumber(totalSalaire, 0)} DH/mois</strong>
          </div>
        </div>
      </div>
    `;
  },

  buildTable() {
    const pers = App.data.personnel;
    if (pers.length === 0) return '<div class="empty-state"><div class="empty-state-icon">👥</div><div>Aucun employé</div></div>';
    return `<table>
      <thead><tr><th>#</th><th>Nom</th><th>Prénom</th><th>Poste</th><th>Département</th><th>Salaire (DH)</th><th>Actions</th></tr></thead>
      <tbody>${pers.map((p, i) => `<tr>
        <td>${i + 1}</td><td class="td-bold">${p.nom}</td><td>${p.prenom}</td>
        <td><span class="badge badge-purple">${p.poste}</span></td>
        <td>${p.dept}</td><td class="td-right td-bold">${App.formatNumber(p.salaire, 0)}</td>
        <td class="td-center">
          <button class="btn-icon" onclick="Personnel.editModal(${p.id})" title="Modifier"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
          <button class="btn-icon danger" onclick="Personnel.deletePersonnel(${p.id})" title="Supprimer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
        </td>
      </tr>`).join('')}</tbody>
    </table>`;
  },

  showAddModal(entry = null) {
    const isEdit = !!entry;
    App.showModal(isEdit ? '✏️ Modifier employé' : '➕ Ajouter un employé', `
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" id="pNom" value="${entry?.nom||''}"></div>
        <div class="form-group"><label class="form-label">Prénom</label><input type="text" class="form-input" id="pPrenom" value="${entry?.prenom||''}"></div>
        <div class="form-group"><label class="form-label">Poste</label><input type="text" class="form-input" id="pPoste" value="${entry?.poste||'Production'}"></div>
        <div class="form-group"><label class="form-label">Département</label>
          <select class="form-select" id="pDept">
            <option value="Production" ${entry?.dept==='Production'?'selected':''}>Production</option>
            <option value="Qualité" ${entry?.dept==='Qualité'?'selected':''}>Qualité</option>
            <option value="Logistique" ${entry?.dept==='Logistique'?'selected':''}>Logistique</option>
            <option value="Administration" ${entry?.dept==='Administration'?'selected':''}>Administration</option>
            <option value="Maintenance" ${entry?.dept==='Maintenance'?'selected':''}>Maintenance</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Salaire net mensuel (DH)</label><input type="number" class="form-input" id="pSalaire" value="${entry?.salaire||4000}"></div>
      </div>
    `, `<button class="btn btn-outline" onclick="App.closeModal()">Annuler</button>
       <button class="btn btn-success" onclick="Personnel.savePersonnel(${entry?.id||0})">${isEdit?'Mettre à jour':'Ajouter'}</button>`);
  },

  editModal(id) {
    const entry = App.data.personnel.find(p => p.id === id);
    if (entry) this.showAddModal(entry);
  },

  savePersonnel(editId) {
    const nom = document.getElementById('pNom').value.trim();
    const prenom = document.getElementById('pPrenom').value.trim();
    if (!nom) { App.toast('Le nom est requis', 'error'); return; }
    const data = { nom, prenom, poste: document.getElementById('pPoste').value, dept: document.getElementById('pDept').value, salaire: parseFloat(document.getElementById('pSalaire').value) || 0 };
    if (editId) {
      const idx = App.data.personnel.findIndex(p => p.id === editId);
      if (idx !== -1) App.data.personnel[idx] = { ...App.data.personnel[idx], ...data };
    } else {
      data.id = App.nextId(App.data.personnel);
      App.data.personnel.push(data);
    }
    App.saveData();
    App.closeModal();
    this.render();
    App.toast(editId ? 'Employé modifié' : 'Employé ajouté', 'success');
  },

  deletePersonnel(id) {
    if (!confirm('Supprimer cet employé ?')) return;
    App.data.personnel = App.data.personnel.filter(p => p.id !== id);
    App.saveData();
    this.render();
    App.toast('Employé supprimé', 'info');
  }
};
