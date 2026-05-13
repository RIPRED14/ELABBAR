/* ============================================
   SAISIE — Formulaire de saisie journalière
   ============================================ */
const Saisie = {
  editingId: null,
  currentActivite: 'reconditionnement',
  phasesList: ['Triage-Lavage','Glasurage','Nettoyage','Cuisson','Emballage','RECEPTION','EVISCERATION ET ETETAGE','Mélançage','Trempage','Congélation','DECONGELATION'],

  emballagesList: [
    { code: 'Cs', designation: 'N (Caisse)' },
    { code: 'MST1', designation: 'MOUSTIK 1' },
    { code: 'Kg', designation: 'Kg (Vrac)' },
    { code: 'N-CREVETTE', designation: 'N-CREVETTE BRAISE' },
    { code: 'CR17KG', designation: 'CR 17KG' },
    { code: 'CR1.7', designation: 'C CREVETTE' },
    { code: 'CS0.33', designation: 'CS POTON' },
    { code: 'CR19KG', designation: 'CR 19KG' },
    { code: 'C20S2000', designation: 'C20S2000' },
    { code: 'C20S1000', designation: 'C20S1000' },
    { code: 'C20S1500', designation: 'C20S1500' },
    { code: 'C15S1000', designation: 'C15S1000' },
    { code: 'C15S2000', designation: 'C15S2000' },
    { code: 'C15S1500', designation: 'C15S1500' },
    { code: 'C13S1000', designation: 'C13S1000' },
    { code: 'C13S1500', designation: 'C13S1500' },
    { code: 'C12S2000', designation: 'C12S2000' },
    { code: 'C12S1000', designation: 'C12S1000' },
  ],

  cartonMap: {
    'C12': { article: 'CARTON 12KG', prix: 11.64 },
    'C13': { article: 'CARTON 13KG', prix: 12.50 },
    'C15': { article: 'CARTON 15KG', prix: 14.00 },
    'C17': { article: 'CARTON 17KG', prix: 15.00 },
    'C19': { article: 'CARTON 19KG', prix: 16.50 },
    'C20': { article: 'CARTON 20KG', prix: 18.00 },
  },

  sachetMap: {
    'S1000': { article: 'SACHET 1KG NEUTRE', prix: 24.46 / 76 },
    'S1500': { article: 'SACHET 1.5KG NEUTRE', prix: 25 / 68 },
    'S2000': { article: 'SACHET 2KG', prix: 25 / 60 },
    'S1000IMP': { article: 'SACHET 1KG IMPRIMÉ', prix: 27.76 / 140 },
  },

  intrantsMaster: [
    // ── SACHET (tailles réelles inventaire) ──
    { ref: 'S2338', article: 'SACHET 23x38', famille: 'SACHET', prix: 24.00 },
    { ref: 'S2535', article: 'SACHET 25x35', famille: 'SACHET', prix: 25.28 },
    { ref: 'S4040', article: 'SACHET 40x40 (1.5KG)', famille: 'SACHET', prix: 24.00 },
    { ref: 'S4050', article: 'SACHET 40x50 (2KG)', famille: 'SACHET', prix: 24.00 },
    { ref: 'S7780', article: 'SACHET 77x80', famille: 'SACHET', prix: 25.20 },
    { ref: 'S4060', article: 'SACHET 40x60', famille: 'SACHET', prix: 24.00 },
    { ref: 'S1230', article: 'SACHET 12x30', famille: 'SACHET', prix: 27.60 },
    { ref: 'S1440', article: 'SACHET 14x40', famille: 'SACHET', prix: 27.60 },
    { ref: 'S1450', article: 'SACHET 14x50', famille: 'SACHET', prix: 27.60 },
    { ref: 'S4065', article: 'SACHET 40x65', famille: 'SACHET', prix: 27.60 },
    { ref: 'S645120', article: 'SACHET 6/45x120x80', famille: 'SACHET', prix: 25.12 },
    { ref: 'S6016', article: 'SACHET 60*5(16)x80', famille: 'SACHET', prix: 25.20 },
    { ref: 'S4353', article: 'SACHET 43x53', famille: 'SACHET', prix: 24.00 },
    { ref: 'S5885', article: 'SACHET 58x85', famille: 'SACHET', prix: 24.00 },
    // ── SAC / PLASTIQUE ──
    { ref: '11201', article: 'SAC 30/40', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11202', article: 'SAC 25/35', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11203', article: 'SAC 30*40*70', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11204', article: 'SAC 40*40*55', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11205', article: 'FEUILLE 40*60*40', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11206', article: 'SAC 12*30', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11207', article: 'SAC 14*40', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11208', article: 'SAC 14*50', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11209', article: 'SAC 60 (s16)*80', famille: 'PLASTIQUE', prix: 0 },
    { ref: '11210', article: 'SAC 43*53', famille: 'PLASTIQUE', prix: 0 },
    // ── CARTON ──
    { ref: 'C12', article: 'CARTON 12KG', famille: 'CARTON', prix: 11.64 },
    { ref: 'C13', article: 'CARTON 13KG', famille: 'CARTON', prix: 12.50 },
    { ref: 'C15', article: 'CARTON 15KG', famille: 'CARTON', prix: 14.00 },
    { ref: 'C17', article: 'CARTON 17KG', famille: 'CARTON', prix: 15.00 },
    { ref: 'C19', article: 'CARTON 19KG', famille: 'CARTON', prix: 16.50 },
    { ref: 'C20', article: 'CARTON 20KG', famille: 'CARTON', prix: 18.00 },
    // ── ETIQUETTE ──
    { ref: 'ETQ50', article: 'ETIQUETTE 50*75', famille: 'ETIQUETTE', prix: 45.00 },
    { ref: 'ETQN', article: 'ETIQUETTE NOIR', famille: 'ETIQUETTE', prix: 78.00 },
    // ── EMBALLAGE ──
    { ref: 'FILM', article: 'FILM ETIRABLE', famille: 'EMBALLAGE', prix: 39.60 },
    { ref: 'SCOTCH', article: 'SCOTCH', famille: 'EMBALLAGE', prix: 10.80 },
    { ref: 'PALETTE', article: 'PALETTE', famille: 'EMBALLAGE', prix: 0 },
    // ── INTRANT ──
    { ref: 'SEL', article: 'SEL', famille: 'INTRANT', prix: 0.60 },
    // ── EQUIPEMENT ──
    { ref: '11211', article: 'PISTOLET ARROSEUR', famille: 'EQUIPEMENT', prix: 0 },
    { ref: '11212', article: 'MT TUYAU', famille: 'EQUIPEMENT', prix: 0 },
    { ref: '04001269', article: 'MACHINE SOUDEUSE MANUELLE', famille: 'EQUIPEMENT', prix: 0 },
    { ref: '04001274', article: 'PELLE A NEIGE DETECTABLE GM', famille: 'EQUIPEMENT', prix: 0 },
    // ── FOURNITURES ──
    { ref: '04001259', article: 'ARRACHE AGRAFES', famille: 'FOURNITURES', prix: 0 },
    { ref: '04001263', article: 'MARQUEUR NOIR', famille: 'FOURNITURES', prix: 0 },
    { ref: '04001264', article: 'MARQUEUR PERMANENTE NOIR', famille: 'FOURNITURES', prix: 0 },
    // ── SERVICE ──
    { ref: '04001275', article: 'PACK ANALYSE MICROBIOLOGIQUES', famille: 'SERVICE', prix: 0 },
    // ── DIVERS ──
    { ref: '00001', article: 'ELECTRICITE', famille: 'EAU-ELEC', prix: 0 },
    { ref: 'SC', article: 'AUTRES CHARGES', famille: 'DIVERS', prix: 0 },
  ],
  render() {
    let prod = App.getCurrentMonthProduction();
    prod = prod.filter(p => (p.activite||'reconditionnement') === this.currentActivite);
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div><h2 class="page-title">Saisie Journalière</h2><p class="page-subtitle">Enregistrez la production du jour</p></div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-outline" onclick="Saisie.printTable()" title="Imprimer">🖨️ Imprimer</button>
            <button class="btn btn-success" onclick="Saisie.scanAndCreate()" title="Scanner un QR pour créer une saisie">📷 Scanner</button>
            <button class="btn btn-primary" onclick="Saisie.showNewForm()">+ Nouvelle Saisie</button>
          </div>
        </div>
        <div class="tabs" style="margin-bottom:18px;">
          <div class="tab ${this.currentActivite==='reconditionnement'?'active':''}" onclick="Saisie.switchActivite('reconditionnement')">📦 Reconditionnement</div>
          <div class="tab ${this.currentActivite==='traitement'?'active':''}" onclick="Saisie.switchActivite('traitement')">🔧 Traitement</div>
          <div class="tab ${this.currentActivite==='divers'?'active':''}" onclick="Saisie.switchActivite('divers')">📋 Divers</div>
        </div>
        <div id="saisieFormContainer"></div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">📋 Historique du mois (${prod.length} entrées)</span>
            <div style="display:flex;gap:8px;">
              <select class="form-select" id="filterEspece" onchange="Saisie.renderTable()" style="width:160px;padding:6px 10px;font-size:0.82rem">
                <option value="">Toutes les espèces</option>
                ${App.data.especes.map(e => `<option value="${e.nom}">${e.nom}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="card-body"><div class="table-container" id="saisieTable">${this.buildTable(prod)}</div></div>
        </div>
      </div>
    `;
  },

  renderTable() {
    let prod = App.getCurrentMonthProduction();
    prod = prod.filter(p => (p.activite||'reconditionnement') === this.currentActivite);
    const filter = document.getElementById('filterEspece')?.value;
    if (filter) prod = prod.filter(p => p.espece === filter);
    document.getElementById('saisieTable').innerHTML = this.buildTable(prod);
  },

  buildTable(prod) {
    if (prod.length === 0) return `<div class="empty-state"><div class="empty-state-icon">📝</div><div class="empty-state-text">Aucune saisie</div></div>`;
    const sorted = [...prod].sort((a, b) => new Date(b.date) - new Date(a.date));
    return `<table>
      <thead><tr><th>Date</th><th>Activité</th><th>Espèce</th><th>Calibre</th><th class="td-right">Poids PI</th><th class="td-right">Poids PF</th><th class="td-right">Heures M.O.</th><th class="td-right">Total DH</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>${sorted.map(p => {
        const coutEmb = (p.coutCarton||0)+(p.coutSachet||0)+(p.coutEtiquetteNoir||0)+(p.coutEtiquette5075||0)+(p.coutScotch||0);
        const coutTotal = (p.coutMOJ||0)+coutEmb+(p.totalIntrants||0);
        const hasPF = (p.poidsBrutPF || 0) > 0;
        const isSent = !!p.sentToStorage;
        const canSend = hasPF && !isSent;
        const statusBadge = isSent
          ? '<span class="badge badge-success" style="font-size:0.7rem;">✅ Envoyé</span>'
          : (hasPF ? '<span class="badge badge-warning" style="font-size:0.7rem;">⏳ À envoyer</span>' : '<span class="badge" style="font-size:0.7rem;background:rgba(148,163,184,0.2);color:var(--text-muted);">🔄 En cours</span>');
        return `<tr>
          <td>${App.formatDateFR(p.date)}</td>
          <td><span class="badge badge-info">${p.activite}</span></td>
          <td><span class="badge badge-purple">${p.espece||'-'}</span></td>
          <td>${p.calibre||'-'}</td>
          <td class="td-right">${App.formatNumber(p.poidsBrutPI || p.poidsMP || 0, 1)}</td>
          <td class="td-right td-bold">${App.formatNumber(p.poidsBrutPF, 1)}</td>
          <td class="td-right">${App.formatNumber((p.heuresMOO || 0) + (p.heuresMOF || 0), 1)}</td>
          <td class="td-right td-bold">${App.formatNumber(coutTotal, 0)} DH</td>
          <td class="td-center">${statusBadge}</td>
          <td class="td-center" style="white-space:nowrap;">
            <button class="btn-icon" onclick="Saisie.editEntry(${p.id})" title="Modifier"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
            <button class="btn-icon" onclick="Saisie.printBon(${p.id})" title="Imprimer le Bon">🖨️</button>
            ${canSend ? `<button class="btn-icon" onclick="Saisie.showSendToStorageModal(${p.id})" title="Envoyer vers Stockage" style="background:rgba(16,185,129,0.15);color:var(--accent-green);border-color:var(--accent-green);">📦</button>` : ''}
            <button class="btn-icon danger" onclick="Saisie.deleteEntry(${p.id})" title="Supprimer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </td>
        </tr>`}).join('')}</tbody>
    </table>`;
  },

  showForm(entry = null) {
    this.editingId = entry ? entry.id : null;
    const p = App.data.parametres;
    const totalFixeH = App.data.personnel.filter(e => e.dept === 'Production').length;
    const salaireFixeTotal = App.data.personnel.filter(e => e.dept === 'Production').reduce((s, e) => s + e.salaire, 0);
    const salaireHF = p.heuresMensuelles > 0 ? salaireFixeTotal / totalFixeH / (p.heuresMensuelles / App.data.personnel.filter(e => e.dept === 'Production').length) : 22.1;

    const phasesPF = entry?.phasesPF || [
      { nom: 'Glasurage', seuil: 107, qteInit: 0, qteFinale: 0 }
    ];
    const conditionnement = entry?.conditionnement || 'C12S1000';
    const intrants = entry?.intrants || this.getDefaultIntrants(conditionnement);
    const initialPrixMP = entry?.prixMP !== undefined
      ? entry.prixMP
      : (entry?.poidsMP > 0 && entry?.valeurMP ? entry.valeurMP / entry.poidsMP : '');

    const container = document.getElementById('saisieFormContainer');
    container.innerHTML = `
      <div class="card slide-up" style="margin-bottom:22px; border:none; box-shadow:0 12px 32px rgba(0,0,0,0.15); overflow:hidden;">
        <div class="card-header" style="background:var(--gradient-orange); padding:1.5rem;">
          <span class="card-title" style="color:white; font-size:1.2rem; font-weight:700;">${entry ? '✏️ Modifier la saisie' : '📝 Nouvelle saisie journalière'} <span style="opacity:0.8;font-weight:400">— Reconditionnement</span></span>
          <button class="btn-icon" style="color:white; background:rgba(255,255,255,0.2); border:none;" onclick="Saisie.hideForm()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div class="card-body">
          <div class="form-section">
            <div class="form-section-title">🔹 Informations générales</div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-input" id="fDate" value="${entry ? App.formatDate(entry.date) : App.formatDate(new Date())}" onchange="Saisie.calc()">
              </div>
              <div class="form-group">
                <label class="form-label">Client</label>
                <input type="text" class="form-input" id="fClient" value="${entry?.client||''}" placeholder="Ex: ALIA PECHE" list="clientsListRec">
                <datalist id="clientsListRec">${[...new Set((App.data.stockage||[]).map(e=>e.client).filter(Boolean))].map(c=>`<option value="${c}">`).join('')}</datalist>
              </div>
              <div class="form-group">
                <label class="form-label">Espèce</label>
                <div style="display:flex;gap:6px;">
                  <select class="form-select" id="fEspece" onchange="Saisie.onEspeceChange('fEspece', 'fCalibre'); Saisie.autoFillProduitFini()" style="flex:1">
                    ${App.data.especes.map(e => `<option value="${e.nom}" ${entry && entry.espece===e.nom ? 'selected' : ''}>${e.nom}</option>`).join('')}
                  </select>
                  <button class="btn btn-primary btn-sm" onclick="Saisie.scanForForm('fEspece', 'fCalibre')" title="Scanner QR">📷</button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Calibre</label>
                <select class="form-select" id="fCalibre" onchange="Saisie.autoFillProduitFini()">
                  <!-- Filled dynamically -->
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">🔹 Matière première (Entrée)</div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Caisses PI</label><input type="number" class="form-input" id="fCaissesPI" value="${entry?entry.caissesPI||'':''}" onchange="Saisie.calc()"></div>
              <div class="form-group"><label class="form-label">Poids Net PI (kg)</label><input type="number" step="0.1" class="form-input" id="fPoidsPI" value="${entry?entry.poidsBrutPI||'':''}" onchange="Saisie.calc()"></div>
              <div class="form-group"><label class="form-label">Prix MP / kg (DH)</label><input type="number" step="0.01" class="form-input" id="fPrixMP" value="${initialPrixMP}" placeholder="Ex: 15.00" onchange="Saisie.calc()"></div>
              <div class="form-group">
                <label class="form-label">Reliquat (Nature & Poids kg)</label>
                <div style="display:flex;gap:6px;">
                  <input type="text" class="form-input" id="fReliquatNom" value="${entry ? entry.reliquatNom||entry.reliquat||'' : ''}" placeholder="Ex: ROTO" style="flex:1">
                  <input type="number" step="0.1" class="form-input" id="fReliquatPoids" value="${entry ? entry.reliquatPoids||'' : ''}" placeholder="kg" style="width:80px" onchange="Saisie.calc()">
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;"><span>🔹 Phase (Glaçage)</span></div>
            <table><thead><tr><th>Phase</th><th>Seuil %</th><th>Qté initiale</th><th>Qté finale</th><th>Rend. phase</th><th style="width:30px"></th></tr></thead>
            <tbody id="fPhasesPF">${phasesPF.map((ph,i)=>`<tr>
              <td><select class="form-select" style="width:160px;padding:5px;font-weight:700" data-ph="nom"><option value="${ph.nom}">${ph.nom}</option></select></td>
              <td><input type="number" step="0.1" class="form-input" style="width:70px;padding:5px" value="${ph.seuil}" data-ph="seuil" data-idx="${i}" onchange="Saisie.calc()"></td>
              <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="${ph.qteInit||''}" data-ph="qteInit" data-idx="${i}" onchange="Saisie.calc()"></td>
              <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="${ph.qteFinale||''}" data-ph="qteFinale" data-idx="${i}" onchange="Saisie.calc()"></td>
              <td class="td-right td-bold" id="fRendPhPF${i}">0%</td>
              <td></td>
            </tr>`).join('')}</tbody></table>
          </div>

          <div class="form-section">
            <div class="form-section-title">🔹 Produits finis</div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Produit fini</label><input type="text" class="form-input" id="fProduitFini" value="${entry?.produitFini||''}" placeholder="Ex: TUBE DE CALAMAR"></div>
              <div class="form-group"><label class="form-label">Poids Net PF (kg)</label><input type="number" step="0.01" class="form-input" id="fPoidsPF" value="${entry?.poidsBrutPF||''}" onchange="Saisie.calc()"></div>
              <div class="form-group"><label class="form-label">Nb Caisses PF</label><input type="number" class="form-input" id="fCaissesPF" value="${entry?.caissesPF||''}" onchange="Saisie.calc()"></div>
              <div class="form-group"><label class="form-label">Conditionnement</label><select class="form-select" id="fConditionnement" onchange="Saisie.onConditionnementChangeRec()">${Saisie.emballagesList.map(e=>`<option value="${e.code}" ${conditionnement===e.code?'selected':''}>${e.code} — ${e.designation}</option>`).join('')}</select></div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>🔹 Main-d'œuvre</span>
              <button class="btn btn-sm btn-outline" onclick="Saisie.addEquipeMO()">+ Ajouter Équipe</button>
            </div>
            
            <div style="margin-bottom:15px;">
              <div style="font-size:0.9rem;font-weight:600;margin-bottom:8px;color:var(--text-secondary);">Personnel Fixe (Allocation mensuelle)</div>
              <div class="form-grid">
                <div class="form-group"><label class="form-label">Heures M.O. Fixe</label><input type="number" step="0.5" class="form-input" id="fHeuresMOF" value="${entry?entry.heuresMOF||totalFixeH*8:totalFixeH*8}" onchange="Saisie.calc()"></div>
                <div class="form-group"><label class="form-label">Salaire H/F (DH)</label><input type="number" step="0.01" class="form-input" id="fSalaireHF" value="${entry?entry.salaireHF||22.1:22.1}" onchange="Saisie.calc()"></div>
                <div class="form-group"><label class="form-label">Coût Personnel Fixe</label><div class="form-computed" id="fCoutPF">0.00 DH</div></div>
              </div>
            </div>

            <div style="font-size:0.9rem;font-weight:600;margin-bottom:8px;color:var(--text-secondary);">Équipes Occasionnelles</div>
            <table><thead><tr><th>Profil</th><th>Nb personnes</th><th>Heures/pers.</th><th>Taux Hor. (DH)</th><th>Coût Total</th><th style="width:30px"></th></tr></thead>
            <tbody id="fEquipesMO">${(entry?.equipesMO || [{profil: 'Ouvrière', nb: 1, heures: 8, taux: p.salaireHoraireOcc}]).map((eq,i)=>`<tr>
              <td><input type="text" class="form-input" style="width:140px;padding:5px;font-weight:600" value="${eq.profil}" data-mo="profil"></td>
              <td><input type="number" class="form-input" style="width:70px;padding:5px" value="${eq.nb}" data-mo="nb" onchange="Saisie.calc()"></td>
              <td><input type="number" step="0.5" class="form-input" style="width:70px;padding:5px" value="${eq.heures}" data-mo="heures" onchange="Saisie.calc()"></td>
              <td><input type="number" step="0.5" class="form-input" style="width:80px;padding:5px" value="${eq.taux}" data-mo="taux" onchange="Saisie.calc()"></td>
              <td class="td-right td-bold" id="fCoutEq${i}">0.00</td>
              <td><button class="btn-icon danger" onclick="Saisie.removeEquipeMO(this)" style="width:24px;height:24px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
            </tr>`).join('')}
            <tr style="background:rgba(99,102,241,0.05)"><td colspan="4" class="td-bold">Total M.O. Occasionnelle</td><td class="td-right td-bold" id="fCoutMOO">0.00 DH</td><td></td></tr>
            </tbody></table>

            <div style="margin-top:12px;padding:14px;background:rgba(99,102,241,0.08);border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;color:var(--text-secondary);">COÛT M.O. TOTAL / JOUR</span>
              <span class="form-computed" id="fCoutMOJ" style="font-size:1.2rem;border:none;padding:0;">0.00 DH</span>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>🔹 Intrants</span>
              <div style="display:flex;gap:6px;align-items:center;">
                <select class="form-select" id="fIntrantSelect" style="width:220px;padding:6px;font-size:0.82rem">
                  <optgroup label="── SACHET ──">${Saisie.intrantsMaster.filter(i=>i.famille==='SACHET').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── PLASTIQUE / SAC ──">${Saisie.intrantsMaster.filter(i=>i.famille==='PLASTIQUE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── CARTON ──">${Saisie.intrantsMaster.filter(i=>i.famille==='CARTON').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── ETIQUETTE ──">${Saisie.intrantsMaster.filter(i=>i.famille==='ETIQUETTE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── EMBALLAGE ──">${Saisie.intrantsMaster.filter(i=>i.famille==='EMBALLAGE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── INTRANT ──">${Saisie.intrantsMaster.filter(i=>i.famille==='INTRANT').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── EQUIPEMENT ──">${Saisie.intrantsMaster.filter(i=>i.famille==='EQUIPEMENT').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── FOURNITURES ──">${Saisie.intrantsMaster.filter(i=>i.famille==='FOURNITURES').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── DIVERS ──">${Saisie.intrantsMaster.filter(i=>i.famille==='DIVERS'||i.famille==='EAU-ELEC'||i.famille==='SERVICE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                </select>
                <button class="btn btn-success btn-sm" onclick="Saisie.addIntrantFromListRec()">+ Ajouter</button>
              </div>
            </div>
            <table><thead><tr><th>Article</th><th>Quantité</th><th>Prix unit. (DH)</th><th>Valeur (DH)</th><th style="width:30px"></th></tr></thead>
            <tbody id="fIntrants">${intrants.map((it,i)=> Saisie.renderIntrantRowRec(it,i)).join('')}
            <tr style="background:rgba(99,102,241,0.1)"><td colspan="4" class="td-bold">Total intrants</td><td class="td-right td-bold" id="fTotalIntrants">0.00 DH</td></tr>
            </tbody></table>
          </div>

          <div class="summary-box" style="background:linear-gradient(145deg, var(--card-bg), rgba(245,158,11,0.05)); border:1px solid rgba(245,158,11,0.2); border-left:4px solid var(--accent-orange); border-radius:12px; padding:20px; margin-top:20px; box-shadow:0 8px 24px rgba(0,0,0,0.05);">
            <h3 style="margin-bottom:18px;font-size:1.15rem;color:var(--accent-orange);display:flex;align-items:center;gap:8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              Résumé des coûts de la journée
            </h3>
            <div class="summary-row"><span class="summary-label">Coût Main-d'œuvre</span><span class="summary-value" id="sumMO">0 DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût Emballage (Intrants)</span><span class="summary-value" id="sumEmb">0 DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût Total Journée</span><span class="summary-value summary-total" id="sumTotal">0 DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût Opérationnel / kg produit</span><span class="summary-value" id="sumParKg">0 DH/kg</span></div>
            <div class="summary-row"><span class="summary-label">Rendement de production</span><span class="summary-value" id="sumRendementRec" style="color:var(--accent-orange);font-weight:bold;">0%</span></div>
          </div>

          <div style="margin-top:30px; display:flex; gap:15px; justify-content:center; padding: 25px 0; border-top: 1px solid var(--border-color);">
            <button class="btn btn-outline" style="min-width: 150px; border-radius:30px;" onclick="Saisie.hideForm()">✕ Annuler</button>
            <button class="btn btn-primary" style="min-width: 250px; font-size: 1.1rem; border-radius:30px; background:var(--gradient-orange); border:none; box-shadow:0 8px 16px rgba(245,158,11,0.3);" onclick="Saisie.saveEntry()">
              💾 ${entry ? 'Mettre à jour la saisie' : 'Enregistrer la saisie'}
            </button>
          </div>
        </div>
      </div>
    `;
    this.onEspeceChange('fEspece', 'fCalibre', entry?.calibre);
    this.calc();
  },

  hideForm() { document.getElementById('saisieFormContainer').innerHTML = ''; this.editingId = null; },

  calc() {
    const v = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    
    let coutMOO = 0;
    document.querySelectorAll('#fEquipesMO tr:not(:last-child)').forEach((row, i) => {
      const nb = parseFloat(row.querySelector('[data-mo="nb"]')?.value) || 0;
      const heures = parseFloat(row.querySelector('[data-mo="heures"]')?.value) || 0;
      const taux = parseFloat(row.querySelector('[data-mo="taux"]')?.value) || 0;
      const val = nb * heures * taux;
      const valEl = document.getElementById('fCoutEq' + i);
      if (valEl) valEl.textContent = App.formatNumber(val);
      coutMOO += val;
    });

    const coutPF = v('fHeuresMOF') * v('fSalaireHF');
    const coutMOJ = coutMOO + coutPF;

    // Automation: Calculate Intrants from Nb Caisses PF
    const caissesPF = v('fCaissesPF');
    const condCode = document.getElementById('fConditionnement')?.value || '';
    const condMatch = condCode.match(/^C(\d+)S(\d+)$/);
    
    let nbCartons = caissesPF;
    let nbSachetsTotal = 0;
    let nbRouleaux = 0;
    let nbToners = 0;

    if (condMatch && caissesPF > 0) {
      const cartonKg = parseFloat(condMatch[1]);
      const sachetG = parseFloat(condMatch[2]);
      const sachetKg = sachetG / 1000;
      const sachetsParCarton = cartonKg / sachetKg;
      
      nbSachetsTotal = nbCartons * sachetsParCarton;
      const etiqParCarton = sachetsParCarton + 1;
      const totalEtiquettes = nbCartons * etiqParCarton;
      nbRouleaux = totalEtiquettes / 1000;
      nbToners = nbRouleaux / 4;
    }

    let totalEmb = 0;
    document.querySelectorAll('#fIntrants tr:not(:last-child)').forEach((row, i) => {
      const artInput = row.querySelector('[data-int="article"]');
      const qteInput = row.querySelector('[data-int="qte"]');
      const prixInput = row.querySelector('[data-int="prix"]');
      if (!artInput || !qteInput) return;
      
      const art = artInput.value.toUpperCase();
      if (condMatch && caissesPF > 0) {
        if (art.includes('CARTON')) {
          qteInput.value = nbCartons;
        } else if (art.includes('SACHET')) {
          qteInput.value = nbSachetsTotal;
        } else if (art.includes('50') && art.includes('75') || art.includes('ETIQUETTE') && !art.includes('NOIR')) {
          qteInput.value = nbRouleaux.toFixed(3);
          if (prixInput && !parseFloat(prixInput.value)) prixInput.value = 45;
        } else if (art.includes('NOIR') || art.includes('TONER')) {
          qteInput.value = nbToners.toFixed(3);
          if (prixInput && !parseFloat(prixInput.value)) prixInput.value = 78;
        }
      }

      const q = parseFloat(qteInput.value) || 0;
      const p = parseFloat(prixInput?.value) || 0;
      const val = q * p;
      const valEl = document.getElementById('intValRec' + i);
      if (valEl) valEl.textContent = App.formatNumber(val);
      totalEmb += val;
    });

    const totalJ = coutMOJ + totalEmb;
    let poidsPF = v('fPoidsPF');
    
    // Automation: Link Phase qteFinale to Poids Net PF
    const tbodyPF = document.getElementById('fPhasesPF');
    if (tbodyPF) {
      tbodyPF.querySelectorAll('tr').forEach((row, i) => {
        const qI = parseFloat(row.querySelector('[data-ph="qteInit"]')?.value)||0;
        const qF = parseFloat(row.querySelector('[data-ph="qteFinale"]')?.value)||0;
        const rend = qI > 0 ? (qF/qI*100) : 0;
        const rendEl = document.getElementById('fRendPhPF'+i);
        if(rendEl) rendEl.textContent = App.formatNumber(rend,2)+'%';
        
        // Auto-fill Poids Net PF from the phase finale (assuming one phase for Reconditionnement)
        if (qF > 0) {
          const fPoidsPFEl = document.getElementById('fPoidsPF');
          if (fPoidsPFEl && fPoidsPFEl.value !== qF.toString()) {
            fPoidsPFEl.value = qF;
            poidsPF = qF;
          }
        }
      });
    }

    const parKg = poidsPF > 0 ? totalJ / poidsPF : 0;

    const poidsPI = v('fPoidsPI');
    const poidsReliquat = v('fReliquatPoids');
    const poidsNetEngage = Math.max(0, poidsPI - poidsReliquat);
    const rendement = poidsNetEngage > 0 ? (poidsPF / poidsNetEngage * 100) : 0;

    const elMOO = document.getElementById('fCoutMOO'); if(elMOO) elMOO.textContent = App.formatNumber(coutMOO) + ' DH';
    const elPF = document.getElementById('fCoutPF'); if(elPF) elPF.textContent = App.formatNumber(coutPF) + ' DH';
    const elMOJ = document.getElementById('fCoutMOJ'); if(elMOJ) elMOJ.textContent = App.formatNumber(coutMOJ) + ' DH';
    const elSumMO = document.getElementById('sumMO'); if(elSumMO) elSumMO.textContent = App.formatNumber(coutMOJ, 0) + ' DH';
    
    const elSumEmb = document.getElementById('sumEmb'); if(elSumEmb) elSumEmb.textContent = App.formatNumber(totalEmb, 0) + ' DH';
    const elTotInt = document.getElementById('fTotalIntrants'); if(elTotInt) elTotInt.textContent = App.formatNumber(totalEmb) + ' DH';
    
    const elSumTotal = document.getElementById('sumTotal'); if(elSumTotal) elSumTotal.textContent = App.formatNumber(totalJ, 0) + ' DH';
    const elSumParKg = document.getElementById('sumParKg'); if(elSumParKg) elSumParKg.textContent = App.formatNumber(parKg) + ' DH/kg';
    const rendEl = document.getElementById('sumRendementRec'); if (rendEl) rendEl.textContent = App.formatNumber(rendement, 2) + '%';
  },

  autoFillProduitFini() {
    const espece = document.getElementById('fEspece')?.value || '';
    const calibre = document.getElementById('fCalibre')?.value || '';
    const pfInput = document.getElementById('fProduitFini');
    if (pfInput && espece) {
      if (!pfInput.value || pfInput.value.includes('Reconditionné')) {
        pfInput.value = (espece + ' ' + calibre + ' Reconditionné').trim().toUpperCase();
      }
    }
  },

  addEquipeMO() {
    const tbody = document.getElementById('fEquipesMO');
    if (!tbody) return;
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    const idx = rows.length;
    const totalRow = tbody.querySelector('tr:last-child');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="form-input" style="width:140px;padding:5px;font-weight:600" value="Ouvrière" data-mo="profil"></td>
      <td><input type="number" class="form-input" style="width:70px;padding:5px" value="1" data-mo="nb" onchange="Saisie.calc()"></td>
      <td><input type="number" step="0.5" class="form-input" style="width:70px;padding:5px" value="8" data-mo="heures" onchange="Saisie.calc()"></td>
      <td><input type="number" step="0.5" class="form-input" style="width:80px;padding:5px" value="${App.data.parametres.salaireHoraireOcc}" data-mo="taux" onchange="Saisie.calc()"></td>
      <td class="td-right td-bold" id="fCoutEq${idx}">0.00</td>
      <td><button class="btn-icon danger" onclick="Saisie.removeEquipeMO(this)" style="width:24px;height:24px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
    `;
    tbody.insertBefore(tr, totalRow);
    this.calc();
  },

  removeEquipeMO(btn) {
    const tr = btn.closest('tr');
    const tbody = tr.parentElement;
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    if (rows.length <= 1) { App.toast("Il faut au moins une ligne d'équipe", 'error'); return; }
    tr.remove();
    tbody.querySelectorAll('tr:not(:last-child)').forEach((row, i) => {
      const valEl = row.querySelector('td:nth-child(5)');
      if (valEl) valEl.id = 'fCoutEq' + i;
    });
    this.calc();
  },

  renderIntrantRowRec(it, i) {
    return `<tr>
      <td><input type="text" class="form-input" style="width:180px;padding:5px;font-weight:600" value="${it.article}" data-int="article" data-idx="${i}"></td>
      <td><input type="number" step="0.01" class="form-input" style="width:90px;padding:5px" value="${it.qte||''}" data-int="qte" data-idx="${i}" onchange="Saisie.calc()"></td>
      <td><input type="number" step="0.01" class="form-input" style="width:90px;padding:5px" value="${it.prix}" data-int="prix" data-idx="${i}" onchange="Saisie.calc()"></td>
      <td class="td-right td-bold" id="intValRec${i}">0.00</td>
      <td><button class="btn-icon danger" onclick="Saisie.removeIntrantRowRec(this)" style="width:24px;height:24px" title="Supprimer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
    </tr>`;
  },

  onConditionnementChangeRec() {
    const code = document.getElementById('fConditionnement')?.value || '';
    const newIntrants = this.getDefaultIntrants(code);
    const tbody = document.getElementById('fIntrants');
    const existingRows = tbody.querySelectorAll('tr:not(:last-child)');
    const extraIntrants = [];
    existingRows.forEach((row, i) => {
      if (i >= 4) {
        const a = row.querySelector('[data-int="article"]');
        const q = row.querySelector('[data-int="qte"]');
        const p = row.querySelector('[data-int="prix"]');
        if (a) extraIntrants.push({ article: a.value, qte: parseFloat(q?.value)||0, prix: parseFloat(p?.value)||0 });
      }
    });
    const allIntrants = [...newIntrants, ...extraIntrants];
    const totalRow = tbody.querySelector('tr:last-child');
    tbody.innerHTML = allIntrants.map((it, i) => this.renderIntrantRowRec(it, i)).join('') + totalRow.outerHTML;
    this.calc();
  },

  addIntrantFromListRec() {
    const sel = document.getElementById('fIntrantSelect');
    const ref = sel.value;
    const master = this.intrantsMaster.find(i => i.ref === ref);
    if (!master) return;
    const tbody = document.getElementById('fIntrants');
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    const idx = rows.length;
    const totalRow = tbody.querySelector('tr:last-child');
    const tr = document.createElement('tr');
    tr.innerHTML = this.renderIntrantRowRec({ article: master.article, qte: 0, prix: master.prix }, idx).replace(/^<tr>/, '').replace(/<\/tr>$/, '');
    tbody.insertBefore(tr, totalRow);
    this.calc();
    App.toast(`${master.article} ajouté`, 'success');
  },

  removeIntrantRowRec(btn) {
    const tr = btn.closest('tr');
    const tbody = tr.parentElement;
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    if (rows.length <= 1) { App.toast('Il faut au moins un intrant', 'error'); return; }
    tr.remove();
    tbody.querySelectorAll('tr:not(:last-child)').forEach((row, i) => {
      row.querySelectorAll('[data-int]').forEach(inp => inp.dataset.idx = i);
      const valEl = row.querySelector('td:nth-child(4)');
      if (valEl) valEl.id = 'intValRec' + i;
    });
    this.calc();
  },

  saveEntry() {
    const v = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const date = document.getElementById('fDate').value;
    const espece = document.getElementById('fEspece').value;
    if (!date || !espece) { App.toast('Veuillez remplir la date et l\'espèce', 'error'); return; }

    const coutPF = v('fHeuresMOF') * v('fSalaireHF');
    
    let coutMOO = 0;
    const equipesMO = [];
    document.querySelectorAll('#fEquipesMO tr:not(:last-child)').forEach(row => {
      const profil = row.querySelector('[data-mo="profil"]')?.value || 'Ouvrière';
      const nb = parseFloat(row.querySelector('[data-mo="nb"]')?.value) || 0;
      const heures = parseFloat(row.querySelector('[data-mo="heures"]')?.value) || 0;
      const taux = parseFloat(row.querySelector('[data-mo="taux"]')?.value) || 0;
      const coutEq = nb * heures * taux;
      equipesMO.push({ profil, nb, heures, taux, coutEq });
      coutMOO += coutEq;
    });

    const phasesPF = [];
    document.querySelectorAll('#fPhasesPF tr').forEach(row => {
      phasesPF.push({
        nom: row.querySelector('[data-ph="nom"]')?.value || '',
        seuil: parseFloat(row.querySelector('[data-ph="seuil"]')?.value) || 0,
        qteInit: parseFloat(row.querySelector('[data-ph="qteInit"]')?.value) || 0,
        qteFinale: parseFloat(row.querySelector('[data-ph="qteFinale"]')?.value) || 0
      });
    });

    const intrants = [];
    document.querySelectorAll('#fIntrants tr:not(:last-child)').forEach(row => {
      intrants.push({
        article: row.querySelector('[data-int="article"]')?.value || '',
        qte: parseFloat(row.querySelector('[data-int="qte"]')?.value) || 0,
        prix: parseFloat(row.querySelector('[data-int="prix"]')?.value) || 0
      });
    });

    const totalIntrants = intrants.reduce((s, it) => s + (it.qte||0) * (it.prix||0), 0);
    const prixMP = v('fPrixMP');
    const poidsMP = v('fPoidsPI');
    const valeurMP = prixMP > 0 && poidsMP > 0 ? prixMP * poidsMP : 0;
    const poidsPF = v('fPoidsPF');
    const rendement = poidsMP > 0 ? (poidsPF / poidsMP * 100) : 0;

    const entry = {
      id: this.editingId || App.nextId(App.data.production),
      activite: 'reconditionnement',
      date, espece,
      calibre: document.getElementById('fCalibre')?.value || '',
      client: document.getElementById('fClient')?.value || '',
      caissesPI: v('fCaissesPI'), poidsBrutPI: poidsMP,
      caissesPF: v('fCaissesPF'), poidsBrutPF: poidsPF,
      produitFini: document.getElementById('fProduitFini')?.value || '',
      conditionnement: document.getElementById('fConditionnement')?.value || '',
      reliquatNom: document.getElementById('fReliquatNom')?.value || '',
      reliquatPoids: v('fReliquatPoids'),
      equipesMO,
      coutMOO,
      heuresMOF: v('fHeuresMOF'), salaireHF: v('fSalaireHF'), coutPersonnelF: coutPF,
      coutMOJ: coutMOO + coutPF,
      phasesPF,
      intrants,
      totalIntrants,
      prixMP,
      valeurMP,
      poidsMP,
      rendement
    };
    const previous = this.editingId ? App.data.production.find(p => p.id === this.editingId) : null;
    const previousConsumption = previous ? this.getReconditionnementConsumption(previous) : {};
    const nextConsumption = this.getReconditionnementConsumption(entry);
    const missingOrLow = Object.entries(nextConsumption).find(([nom, qty]) => {
      if (qty <= 0) return false;
      const c = App.data.consommables.find(item => item.nom === nom);
      if (!c) return true;
      return (c.stock + (previousConsumption[nom] || 0)) < qty;
    });
    if (missingOrLow) {
      const [nom, qty] = missingOrLow;
      const c = App.data.consommables.find(item => item.nom === nom);
      const disponible = (c?.stock || 0) + (previousConsumption[nom] || 0);
      if (!confirm(`⚠️ Stock consommable insuffisant: ${nom} (${App.formatNumber(disponible, 2)} disponible / ${App.formatNumber(qty, 2)} requis).\n\nVoulez-vous forcer l'enregistrement ? Le stock passera en négatif.`)) {
        return;
      }
    }

    if (this.editingId) {
      const idx = App.data.production.findIndex(p => p.id === this.editingId);
      if (idx !== -1) App.data.production[idx] = entry;
      this.restoreConsumption(previousConsumption, `Correction saisie #${entry.id}`);
      this.consumeStock(nextConsumption, `Production #${entry.id}`);
    } else {
      App.data.production.push(entry);
      this.consumeStock(nextConsumption, `Production #${entry.id}`);
    }

    App.saveData();
    this.hideForm();
    this.render();
    App.toast(this.editingId ? 'Saisie mise à jour' : 'Saisie enregistrée', 'success');
  },

  deductStock(nom, qty) {
    const c = App.data.consommables.find(c => c.nom === nom);
    if (c && qty > 0) {
      c.stock = Math.max(0, c.stock - qty);
      App.data.mouvementsStock.push({ date: new Date().toISOString(), consommable: nom, type: 'sortie', quantite: qty, motif: 'Production' });
    }
  },

  getReconditionnementConsumption(entry) {
    if (!entry || (entry.activite || 'reconditionnement') !== 'reconditionnement') return {};
    const cons = {};
    if (entry.intrants) {
      entry.intrants.forEach(it => {
        if (it.article && it.qte > 0) {
          cons[it.article] = (cons[it.article] || 0) + it.qte;
        }
      });
    }
    return cons;
  },

  consumeStock(consumption, motif) {
    if (!App.data.mouvementsStock) App.data.mouvementsStock = [];
    Object.entries(consumption).forEach(([nom, qty]) => {
      let c = App.data.consommables.find(item => item.nom === nom);
      if (!c && qty > 0) {
        c = { id: App.nextId(App.data.consommables), nom: nom, unite: 'pièce', stock: 0, seuilCritique: 0, seuilAlerte: 0, prixUnitaire: 0 };
        App.data.consommables.push(c);
      }
      if (c && qty > 0) {
        c.stock = c.stock - qty;
        App.data.mouvementsStock.push({ date: new Date().toISOString(), consommable: nom, type: 'sortie', quantite: qty, motif });
      }
    });
  },

  restoreConsumption(consumption, motif) {
    if (!App.data.mouvementsStock) App.data.mouvementsStock = [];
    Object.entries(consumption).forEach(([nom, qty]) => {
      let c = App.data.consommables.find(item => item.nom === nom);
      if (!c && qty > 0) {
        c = { id: App.nextId(App.data.consommables), nom: nom, unite: 'pièce', stock: 0, seuilCritique: 0, seuilAlerte: 0, prixUnitaire: 0 };
        App.data.consommables.push(c);
      }
      if (c && qty > 0) {
        c.stock += qty;
        App.data.mouvementsStock.push({ date: new Date().toISOString(), consommable: nom, type: 'entree', quantite: qty, motif });
      }
    });
  },

  editEntry(id) {
    const entry = App.data.production.find(p => p.id === id);
    if (entry) {
      if (entry.activite === 'traitement' || entry.activite === 'divers') this.showTraitementForm(entry);
      else this.showForm(entry);
    }
  },

  deleteEntry(id) {
    if (!confirm('Supprimer cette saisie ?')) return;
    const entry = App.data.production.find(p => p.id === id);
    this.restoreConsumption(this.getReconditionnementConsumption(entry), `Annulation saisie #${id}`);
    App.data.production = App.data.production.filter(p => p.id !== id);
    App.saveData();
    this.render();
    App.toast('Saisie supprimée', 'info');
  },

  switchActivite(act) {
    this.currentActivite = act;
    this.render();
  },

  showNewForm() {
    if (this.currentActivite === 'reconditionnement') this.showForm();
    else this.showTraitementForm();
  },

  showTraitementForm(entry = null) {
    this.editingId = entry ? entry.id : null;
    const act = entry?.activite || this.currentActivite;
    const label = act === 'traitement' ? '🔧 Traitement' : '📋 Divers';
    const receptions = (App.data.stockage || []).map(s => `<option value="${s.id}" ${entry?.receptionId===s.id?'selected':''}>${s.reference} — ${s.client} (${App.formatDateFR(s.dateEntree)})</option>`).join('');
    const phases = entry?.phases || [
      { nom: 'Décongélation', seuil: 97, qteInit: 0, qteFinale: 0 },
      { nom: 'Nettoyage', seuil: 77, qteInit: 0, qteFinale: 0 }
    ];
    const phasesPF = entry?.phasesPF || [
      { nom: 'Trempage', seuil: 110, qteInit: 0, qteFinale: 0 },
      { nom: 'Congélation', seuil: 100, qteInit: 0, qteFinale: 0 },
      { nom: 'Glasurage', seuil: 107, qteInit: 0, qteFinale: 0 },
      { nom: 'Emballage', seuil: 100, qteInit: 0, qteFinale: 0 }
    ];
    const conditionnement = entry?.conditionnement || 'C12S1000';
    const intrants = entry?.intrants || this.getDefaultIntrants(conditionnement);
    const initialPrixMP = entry?.prixMP !== undefined
      ? entry.prixMP
      : (entry?.poidsMP > 0 && entry?.valeurMP ? entry.valeurMP / entry.poidsMP : '');

    const container = document.getElementById('saisieFormContainer');
    container.innerHTML = `
      <div class="card slide-up" style="margin-bottom:22px;">
        <div class="card-header" style="background:${act==='traitement'?'var(--gradient-blue)':'var(--gradient-green)'};border-radius:var(--radius-md) var(--radius-md) 0 0;">
          <span class="card-title" style="color:white">${entry?'✏️ Modifier':'📝 Nouvelle saisie'} — ${label}</span>
          <button class="btn-icon" style="border-color:rgba(255,255,255,0.3);color:white" onclick="Saisie.hideForm()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div class="card-body">
          <div class="form-section">
            <div class="form-section-title">🔹 Liaison réception & infos</div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Réception (stockage) *</label><select class="form-select" id="tReception" onchange="Saisie.onReceptionChange()">${receptions}</select></div>
              <div class="form-group"><label class="form-label">Date *</label><input type="date" class="form-input" id="tDate" value="${entry?App.formatDate(entry.date):App.formatDate(new Date())}"></div>
              <div class="form-group"><label class="form-label">Client</label><input type="text" class="form-input" id="tClient" value="${entry?.client||''}" oninput="Saisie.refreshQR()"></div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;"><span>🔹 Phases matière première</span><button class="btn btn-sm btn-outline" onclick="Saisie.addPhase('tPhasesMP')">+ Phase</button></div>
            <table><thead><tr><th>Phase</th><th>Seuil %</th><th>Qté initiale</th><th>Qté finale</th><th>Rend. phase</th><th>Rend. cumulé</th><th style="width:30px"></th></tr></thead>
            <tbody id="tPhasesMP">${phases.map((ph,i)=>`<tr>
              <td><select class="form-select" style="width:160px;padding:5px;font-weight:700" data-ph="nom">${Saisie.phasesList.map(p=>`<option value="${p}" ${ph.nom===p?'selected':''}>${p}</option>`).join('')}</select></td>
              <td><input type="number" step="0.1" class="form-input" style="width:70px;padding:5px" value="${ph.seuil}" data-ph="seuil" data-idx="${i}" onchange="Saisie.calcT()"></td>
              <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="${ph.qteInit||''}" data-ph="qteInit" data-idx="${i}" onchange="Saisie.calcT()"></td>
              <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="${ph.qteFinale||''}" data-ph="qteFinale" data-idx="${i}" onchange="Saisie.calcT()"></td>
              <td class="td-right td-bold" id="rendPhMP${i}">0%</td>
              <td class="td-right" id="rendCumMP${i}">0%</td>
              <td><button class="btn-icon danger" onclick="Saisie.removePhase(this)" style="width:24px;height:24px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
            </tr>`).join('')}</tbody></table>
          </div>

          <div class="form-section">
            <div class="form-section-title">🔹 Matière première</div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Espèce</label>
                <div style="display:flex;gap:6px;">
                  <select class="form-select" id="tEspece" onchange="Saisie.onEspeceChange('tEspece', 'tCalibre'); Saisie.refreshQR()" style="flex:1">
                    ${App.data.especes.map(e => `<option value="${e.nom}" ${entry && entry.espece===e.nom ? 'selected' : ''}>${e.nom}</option>`).join('')}
                  </select>
                  <button class="btn btn-primary btn-sm" onclick="Saisie.scanForForm('tEspece', 'tCalibre')" title="Scanner QR">📷</button>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Calibre</label>
                <select class="form-select" id="tCalibre" onchange="Saisie.refreshQR()">
                  <!-- Filled dynamically -->
                </select>
              </div>
              <div class="form-group"><label class="form-label">Poids net total MP (kg)</label><input type="number" step="0.01" class="form-input" id="tPoidsMP" value="${entry?.poidsMP||''}" onchange="Saisie.calcT()"></div>
              <div class="form-group"><label class="form-label">Prix moyen (DH/kg)</label><input type="number" step="0.01" class="form-input" id="tPrixMoyen" value="${initialPrixMP}" onchange="Saisie.calcT()" placeholder="Ex: 40"></div>
              <div class="form-group"><label class="form-label">Valeur MP (DH)</label><div class="form-computed" id="tValeurMP">0.00</div></div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;"><span>🔹 Phases produits finis</span><button class="btn btn-sm btn-outline" onclick="Saisie.addPhase('tPhasesPF')">+ Phase</button></div>
            <table><thead><tr><th>Phase</th><th>Seuil %</th><th>Qté initiale</th><th>Qté finale</th><th>Rend. phase</th><th>Rend. cumulé</th><th style="width:30px"></th></tr></thead>
            <tbody id="tPhasesPF">${phasesPF.map((ph,i)=>`<tr>
              <td><select class="form-select" style="width:160px;padding:5px;font-weight:700" data-ph="nom">${Saisie.phasesList.map(p=>`<option value="${p}" ${ph.nom===p?'selected':''}>${p}</option>`).join('')}</select></td>
              <td><input type="number" step="0.1" class="form-input" style="width:70px;padding:5px" value="${ph.seuil}" data-ph="seuil" data-idx="${i}" onchange="Saisie.calcT()"></td>
              <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="${ph.qteInit||''}" data-ph="qteInit" data-idx="${i}" onchange="Saisie.calcT()"></td>
              <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="${ph.qteFinale||''}" data-ph="qteFinale" data-idx="${i}" onchange="Saisie.calcT()"></td>
              <td class="td-right td-bold" id="rendPhPF${i}">0%</td>
              <td class="td-right" id="rendCumPF${i}">0%</td>
              <td><button class="btn-icon danger" onclick="Saisie.removePhase(this)" style="width:24px;height:24px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
            </tr>`).join('')}</tbody></table>
          </div>

          <div class="form-section">
            <div class="form-section-title">🔹 Produits finis</div>
            <div class="form-grid">
              <div class="form-group"><label class="form-label">Produit fini</label><input type="text" class="form-input" id="tProduitFini" value="${entry?.produitFini||''}" placeholder="Ex: TUBE DE CALAMAR"></div>
              <div class="form-group"><label class="form-label">Poids net PF (kg)</label><input type="number" step="0.01" class="form-input" id="tPoidsPF" value="${entry?.poidsBrutPF||''}" onchange="Saisie.calcT()"></div>
              <div class="form-group"><label class="form-label">Nb Caisses PF</label><input type="number" class="form-input" id="tCaissesPF" value="${entry?.caissesPF||''}"></div>
              <div class="form-group"><label class="form-label">Conditionnement</label><select class="form-select" id="tConditionnement" onchange="Saisie.onConditionnementChange()">${Saisie.emballagesList.map(e=>`<option value="${e.code}" ${conditionnement===e.code?'selected':''}>${e.code} — ${e.designation}</option>`).join('')}</select></div>
              <div class="form-group"><label class="form-label">Rendement global</label><div class="form-computed" id="tRendement">0.00%</div></div>
              <div class="form-group"><label class="form-label">Coût matière révisé</label><div class="form-computed" id="tCoutMatiere">0.00 DH</div></div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>🔹 Intrants</span>
              <div style="display:flex;gap:6px;align-items:center;">
                <select class="form-select" id="tIntrantSelect" style="width:220px;padding:6px;font-size:0.82rem">
                  <optgroup label="── SACHET ──">${Saisie.intrantsMaster.filter(i=>i.famille==='SACHET').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── PLASTIQUE / SAC ──">${Saisie.intrantsMaster.filter(i=>i.famille==='PLASTIQUE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── CARTON ──">${Saisie.intrantsMaster.filter(i=>i.famille==='CARTON').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── ETIQUETTE ──">${Saisie.intrantsMaster.filter(i=>i.famille==='ETIQUETTE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── EMBALLAGE ──">${Saisie.intrantsMaster.filter(i=>i.famille==='EMBALLAGE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── INTRANT ──">${Saisie.intrantsMaster.filter(i=>i.famille==='INTRANT').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── EQUIPEMENT ──">${Saisie.intrantsMaster.filter(i=>i.famille==='EQUIPEMENT').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── FOURNITURES ──">${Saisie.intrantsMaster.filter(i=>i.famille==='FOURNITURES').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                  <optgroup label="── DIVERS ──">${Saisie.intrantsMaster.filter(i=>i.famille==='DIVERS'||i.famille==='EAU-ELEC'||i.famille==='SERVICE').map(i=>`<option value="${i.ref}">${i.article}</option>`).join('')}</optgroup>
                </select>
                <button class="btn btn-success btn-sm" onclick="Saisie.addIntrantFromList()">+ Ajouter</button>
              </div>
            </div>
            <table><thead><tr><th>Article</th><th>Quantité</th><th>Prix unit. (DH)</th><th>Valeur (DH)</th><th style="width:30px"></th></tr></thead>
            <tbody id="tIntrants">${intrants.map((it,i)=> Saisie.renderIntrantRow(it,i)).join('')}
            <tr style="background:rgba(99,102,241,0.1)"><td colspan="4" class="td-bold">Total intrants</td><td class="td-right td-bold" id="tTotalIntrants">0.00 DH</td></tr>
            </tbody></table>
          </div>

          <div class="summary-box">
            <h3 style="margin-bottom:14px;">📊 Résumé</h3>
            <div class="summary-row"><span class="summary-label">Rendement produits</span><span class="summary-value" id="sumRendement">0%</span></div>
            <div class="summary-row"><span class="summary-label">Rendement phase finale</span><span class="summary-value" id="sumRendFinal">0%</span></div>
            <div class="summary-row"><span class="summary-label">Total intrants</span><span class="summary-value" id="sumIntrants">0 DH</span></div>
            <div class="summary-row"><span class="summary-label">Prix de revient global</span><span class="summary-value summary-total" id="sumPrixRevient">0 DH/kg</span></div>
          </div>

          <div class="form-section" style="margin-top:14px;">
            <div class="form-section-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>🏷️ QR Code du lot</span>
              <button class="btn btn-sm btn-outline" onclick="Saisie.refreshQR()" style="font-size:0.78rem;">🔄 Actualiser</button>
            </div>
            <div id="saisieQRArea" style="padding:12px;text-align:center;">
              <div style="color:var(--text-muted);font-size:0.85rem;">Sélectionnez Client & Espèce pour afficher le QR Code associé</div>
            </div>
          </div>

          <div style="margin-top:30px; display:flex; gap:15px; justify-content:center; padding: 25px 0; border-top: 1px solid var(--border-color);">
            <button class="btn btn-outline" style="min-width: 150px;" onclick="Saisie.hideForm()">Annuler</button>
            <button class="btn btn-primary" style="min-width: 250px; font-size: 1.1rem; box-shadow: var(--shadow-glow-purple);" onclick="Saisie.saveTraitement()">
              💾 ${entry?'Mettre à jour la saisie':'Enregistrer la saisie'}
            </button>
          </div>
        </div>
      </div>`;
    this.onEspeceChange('tEspece', 'tCalibre', entry?.calibre);
    this.calcT();
    this.refreshQR();
  },

  onReceptionChange() {
    const recId = parseInt(document.getElementById('tReception')?.value) || 0;
    if (!recId) return;
    const reception = (App.data.stockage || []).find(s => s.id === recId);
    if (!reception || !reception.lignes || reception.lignes.length === 0) return;
    
    const line = reception.lignes[0];
    
    const espSelect = document.getElementById('tEspece');
    if (espSelect) {
      espSelect.value = line.espece || '';
      this.onEspeceChange('tEspece', 'tCalibre', line.calibre);
    }
    
    const poidsMP = document.getElementById('tPoidsMP');
    if (poidsMP) poidsMP.value = line.pdsNetTotal || '';
    
    const client = document.getElementById('tClient');
    if (client) client.value = reception.client || '';
    this.refreshQR();
    
    // Fill first phase qteInit
    const firstPhaseRow = document.querySelector('#tPhasesMP tr');
    if (firstPhaseRow) {
      const qteInitInput = firstPhaseRow.querySelector('[data-ph="qteInit"]');
      if (qteInitInput) qteInitInput.value = line.pdsNetTotal || '';
    }
    
    this.calcT();
  },

  calcT() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    const poidsMP = v('tPoidsMP');
    const prixMP = v('tPrixMoyen');
    const valeurMP = poidsMP * prixMP;
    const poidsPF = v('tPoidsPF');
    const valeurEl = document.getElementById('tValeurMP');
    if (valeurEl) valeurEl.textContent = App.formatNumber(valeurMP, 2);

    // Phases MP — cascade: phase i>0 gets qteInit = previous phase qteFinale
    let prevQF_MP = poidsMP;
    const mpRows = document.querySelectorAll('#tPhasesMP tr');
    mpRows.forEach((row,i) => {
      const qiInput = row.querySelector('[data-ph="qteInit"]');
      // Phase 0: fill with poidsMP if empty; Phase i>0: always fill with previous qteFinale
      if (qiInput) {
        if (i === 0 && !qiInput.value && poidsMP > 0) {
          qiInput.value = poidsMP;
        } else if (i > 0) {
          qiInput.value = prevQF_MP || '';
        }
      }
      const qi = parseFloat(qiInput?.value)||0;
      const qf = parseFloat(row.querySelector('[data-ph="qteFinale"]')?.value)||0;
      prevQF_MP = qf || qi; // if no qteFinale yet, carry forward qteInit
      
      const rp = qi>0 ? (qf/qi*100) : 0;
      const rc = poidsMP>0 ? (qf/poidsMP*100) : 0;
      const elPh = document.getElementById('rendPhMP'+i);
      const elCum = document.getElementById('rendCumMP'+i);
      if(elPh) elPh.textContent = App.formatNumber(rp,2)+'%';
      if(elCum) elCum.textContent = App.formatNumber(rc,2)+'%';
    });

    // Phases PF — cascade: phase 0 gets last MP qteFinale, phase i>0 gets previous PF qteFinale
    let prevQF_PF = prevQF_MP;
    const pfCalcRows = document.querySelectorAll('#tPhasesPF tr');
    pfCalcRows.forEach((row,i) => {
      const qiInput = row.querySelector('[data-ph="qteInit"]');
      if (qiInput) {
        if (i === 0) {
          // First PF phase: always gets the last MP phase's qteFinale
          qiInput.value = prevQF_PF || '';
        } else {
          // Subsequent PF phases: gets previous PF phase's qteFinale
          qiInput.value = prevQF_PF || '';
        }
      }
      const qi = parseFloat(qiInput?.value)||0;
      const qf = parseFloat(row.querySelector('[data-ph="qteFinale"]')?.value)||0;
      prevQF_PF = qf || qi;
      
      const rp = qi>0 ? (qf/qi*100) : 0;
      const elPh = document.getElementById('rendPhPF'+i);
      if(elPh) elPh.textContent = App.formatNumber(rp,2)+'%';
    });

    // Update Poids PF automatically from last PF phase's qteFinale
    const lastPFRow = pfCalcRows.length > 0 ? pfCalcRows[pfCalcRows.length-1] : null;
    const lastPFqf = lastPFRow ? (parseFloat(lastPFRow.querySelector('[data-ph="qteFinale"]')?.value)||0) : 0;
    const currentPoidsPF = lastPFqf > 0 ? lastPFqf : poidsPF;
    const poidsPFInput = document.getElementById('tPoidsPF');
    if (poidsPFInput && lastPFqf > 0) {
      poidsPFInput.value = lastPFqf;
    }

    // Update rendCumPF
    pfCalcRows.forEach((row,i) => {
      const qf = parseFloat(row.querySelector('[data-ph="qteFinale"]')?.value)||0;
      const elCum = document.getElementById('rendCumPF'+i);
      if(elCum) elCum.textContent = currentPoidsPF>0 ? App.formatNumber(qf/currentPoidsPF*100,2)+'%' : '0%';
    });

    const rendement = poidsMP>0 ? (currentPoidsPF/poidsMP*100) : 0;
    document.getElementById('tRendement').textContent = App.formatNumber(rendement,2)+'%';
    const coutMatiere = currentPoidsPF>0 ? valeurMP/currentPoidsPF : 0;
    document.getElementById('tCoutMatiere').textContent = App.formatNumber(coutMatiere,2)+' DH';

    // ═══════════════════════════════════════════════════════
    // INTRANTS — Calcul automatique basé sur le conditionnement
    // Ex: C12S1000 → Carton 12kg, Sachet 1000g (1kg)
    //   nbCartons = PoidsPF / 12
    //   sachetsParCarton = 12 / 1 = 12
    //   étiquettes par carton = 12 sachets + 1 carton = 13
    //   totalEtiquettes = nbCartons × 13
    //   nbRouleaux = totalEtiquettes / 1000 (prix 45 DH/rouleau)
    //   nbToners = nbRouleaux / 4 (prix 78 DH/toner)
    // ═══════════════════════════════════════════════════════
    const condCode = document.getElementById('tConditionnement')?.value || '';
    const condMatch = condCode.match(/^C(\d+)S(\d+)$/);
    let nbCartons = 0;
    let nbSachetsTotal = 0;
    let totalEtiquettes = 0;
    let nbRouleaux = 0;
    let nbToners = 0;
    
    if (condMatch && currentPoidsPF > 0) {
      const cartonKg = parseFloat(condMatch[1]);   // ex: 12 (kg)
      const sachetG = parseFloat(condMatch[2]);      // ex: 1000 (g)
      const sachetKg = sachetG / 1000;               // ex: 1 (kg)
      const sachetsParCarton = cartonKg / sachetKg;   // ex: 12
      
      nbCartons = Math.ceil(currentPoidsPF / cartonKg);  // ex: 2700/12 = 225
      nbSachetsTotal = nbCartons * sachetsParCarton;      // ex: 225 * 12 = 2700
      
      // Étiquettes: chaque sachet + chaque carton = sachetsParCarton + 1 par carton
      const etiqParCarton = sachetsParCarton + 1;         // ex: 13
      totalEtiquettes = nbCartons * etiqParCarton;        // ex: 225 * 13 = 2925
      
      // Rouleaux d'étiquettes (1000 étiquettes/rouleau, 45 DH/rouleau)
      nbRouleaux = totalEtiquettes / 1000;                // ex: 2.925
      
      // Toner noir = 1/4 de la consommation des étiquettes (78 DH/toner)
      nbToners = nbRouleaux / 4;                          // ex: 0.731
      
      const caissesPFInput = document.getElementById('tCaissesPF');
      if (caissesPFInput) caissesPFInput.value = nbCartons;
    }

    let totalInt = 0;
    document.querySelectorAll('#tIntrants tr').forEach((row,i) => {
      const artInput = row.querySelector('[data-int="article"]');
      const qteInput = row.querySelector('[data-int="qte"]');
      const prixInput = row.querySelector('[data-int="prix"]');
      if (!artInput || !qteInput) return;
      
      const art = artInput.value.toUpperCase();
      
      // Auto-fill quantities based on article type
      if (condMatch && currentPoidsPF > 0) {
        if (art.includes('CARTON')) {
          qteInput.value = nbCartons;
        } else if (art.includes('SACHET')) {
          qteInput.value = nbSachetsTotal;
        } else if (art.includes('50') && art.includes('75') || art.includes('ETIQUETTE') && !art.includes('NOIR')) {
          // Étiquettes normales (rouleaux)
          qteInput.value = nbRouleaux.toFixed(3);
          if (prixInput && !parseFloat(prixInput.value)) prixInput.value = 45;
        } else if (art.includes('NOIR') || art.includes('TONER')) {
          // Étiquettes noir / toner
          qteInput.value = nbToners.toFixed(3);
          if (prixInput && !parseFloat(prixInput.value)) prixInput.value = 78;
        }
      }
      
      const q = parseFloat(qteInput?.value)||0;
      const p = parseFloat(prixInput?.value)||0;
      const val = q*p;
      totalInt += val;
      const el = document.getElementById('intVal'+i);
      if(el) el.textContent = App.formatNumber(val,2);
    });
    document.getElementById('tTotalIntrants').textContent = App.formatNumber(totalInt,2)+' DH';

    document.getElementById('sumRendement').textContent = App.formatNumber(rendement,2)+'%';
    document.getElementById('sumIntrants').textContent = App.formatNumber(totalInt,0)+' DH';
    
    // --- Calcul Impact Facturation ---
    const dateStr = document.getElementById('tDate')?.value || '';
    const monthStr = dateStr ? dateStr.substring(0, 7) : new Date().toISOString().substring(0, 7);
    const totalFacturesMois = (App.data.factures || []).filter(f => f.date.startsWith(monthStr)).reduce((s, f) => s + f.montant, 0);
    const totalKgMois = (App.data.production || []).filter(p => p.date.startsWith(monthStr) && p.id !== Saisie.editingId).reduce((s, p) => s + (p.poidsBrutPF || 0), 0) + currentPoidsPF;
    const coutFactureParKg = totalKgMois > 0 ? (totalFacturesMois / totalKgMois) : 0;
    // ---------------------------------

    const baseCout = currentPoidsPF>0 ? (valeurMP+totalInt)/currentPoidsPF : 0;
    const prixRevient = baseCout + coutFactureParKg;
    
    document.getElementById('sumPrixRevient').textContent = App.formatNumber(prixRevient,2)+' DH/kg';
    if (coutFactureParKg > 0) {
       document.getElementById('sumPrixRevient').innerHTML += `<div style="font-size:11px;color:#f59e0b;font-weight:normal;margin-top:4px;">Inclus charges factures : +${App.formatNumber(coutFactureParKg, 2)} DH/kg</div>`;
    }

    // Last PF phase rendement
    const pfRows = document.querySelectorAll('#tPhasesPF tr');
    if(pfRows.length>0){
      const last = pfRows[pfRows.length-1];
      const qi=parseFloat(last.querySelector('[data-ph="qteInit"]')?.value)||0;
      const qf=parseFloat(last.querySelector('[data-ph="qteFinale"]')?.value)||0;
      document.getElementById('sumRendFinal').textContent = qi>0?App.formatNumber(qf/qi*100,2)+'%':'0%';
    }
  },

  addPhase(tbodyId) {
    const tbody = document.getElementById(tbodyId);
    const idx = tbody.children.length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><select class="form-select" style="width:160px;padding:5px;font-weight:700" data-ph="nom">${Saisie.phasesList.map(p=>`<option value="${p}">${p}</option>`).join('')}</select></td>
      <td><input type="number" step="0.1" class="form-input" style="width:70px;padding:5px" value="100" data-ph="seuil" data-idx="${idx}" onchange="Saisie.calcT()"></td>
      <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="" data-ph="qteInit" data-idx="${idx}" onchange="Saisie.calcT()"></td>
      <td><input type="number" step="0.01" class="form-input" style="width:100px;padding:5px" value="" data-ph="qteFinale" data-idx="${idx}" onchange="Saisie.calcT()"></td>
      <td class="td-right td-bold" id="rendPh${tbodyId==='tPhasesMP'?'MP':'PF'}${idx}">0%</td>
      <td class="td-right" id="rendCum${tbodyId==='tPhasesMP'?'MP':'PF'}${idx}">0%</td>
      <td><button class="btn-icon danger" onclick="Saisie.removePhase(this)" style="width:24px;height:24px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>`;
    tbody.appendChild(tr);
  },

  removePhase(btn) {
    const tr = btn.closest('tr');
    const tbody = tr.parentElement;
    if (tbody.children.length <= 1) { App.toast('Il faut au moins une phase', 'error'); return; }
    tr.remove();
    this.calcT();
  },

  renderIntrantRow(it, i) {
    return `<tr>
      <td><input type="text" class="form-input" style="width:180px;padding:5px;font-weight:600" value="${it.article}" data-int="article" data-idx="${i}"></td>
      <td><input type="number" step="0.01" class="form-input" style="width:90px;padding:5px" value="${it.qte||''}" data-int="qte" data-idx="${i}" onchange="Saisie.calcT()"></td>
      <td><input type="number" step="0.01" class="form-input" style="width:90px;padding:5px" value="${it.prix}" data-int="prix" data-idx="${i}" onchange="Saisie.calcT()"></td>
      <td class="td-right td-bold" id="intVal${i}">0.00</td>
      <td><button class="btn-icon danger" onclick="Saisie.removeIntrantRow(this)" style="width:24px;height:24px" title="Supprimer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></td>
    </tr>`;
  },

  getDefaultIntrants(code) {
    const intrants = [];
    const match = code.match(/^C(\d+)S(\d+)$/);
    if (match) {
      const cartonKey = 'C' + match[1];
      const sachetKey = 'S' + match[2];
      const c = this.cartonMap[cartonKey];
      const s = this.sachetMap[sachetKey];
      if (c) intrants.push({ article: c.article, qte: 0, prix: c.prix });
      if (s) intrants.push({ article: s.article, qte: 0, prix: s.prix });
    }
    intrants.push({ article: 'ETIQUETTE 50*75', qte: 0, prix: 45.00 });
    intrants.push({ article: 'ETIQUETTE NOIR', qte: 0, prix: 78.00 });
    return intrants;
  },

  onConditionnementChange() {
    const code = document.getElementById('tConditionnement')?.value || '';
    const newIntrants = this.getDefaultIntrants(code);
    // Keep any extra intrants the user added (beyond the base 4)
    const tbody = document.getElementById('tIntrants');
    const existingRows = tbody.querySelectorAll('tr:not(:last-child)');
    const extraIntrants = [];
    existingRows.forEach((row, i) => {
      if (i >= 4) { // keep rows beyond the base 4
        const a = row.querySelector('[data-int="article"]');
        const q = row.querySelector('[data-int="qte"]');
        const p = row.querySelector('[data-int="prix"]');
        if (a) extraIntrants.push({ article: a.value, qte: parseFloat(q?.value)||0, prix: parseFloat(p?.value)||0 });
      }
    });
    const allIntrants = [...newIntrants, ...extraIntrants];
    // Rebuild tbody
    const totalRow = tbody.querySelector('tr:last-child');
    tbody.innerHTML = allIntrants.map((it, i) => this.renderIntrantRow(it, i)).join('') + totalRow.outerHTML;
    this.calcT();
  },

  addIntrantFromList() {
    const sel = document.getElementById('tIntrantSelect');
    const ref = sel.value;
    const master = this.intrantsMaster.find(i => i.ref === ref);
    if (!master) return;
    const tbody = document.getElementById('tIntrants');
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    const idx = rows.length;
    const totalRow = tbody.querySelector('tr:last-child');
    const tr = document.createElement('tr');
    tr.innerHTML = this.renderIntrantRow({ article: master.article, qte: 0, prix: master.prix }, idx).replace(/^<tr>/, '').replace(/<\/tr>$/, '');
    tbody.insertBefore(tr, totalRow);
    this.calcT();
    App.toast(`${master.article} ajouté`, 'success');
  },

  removeIntrantRow(btn) {
    const tr = btn.closest('tr');
    const tbody = tr.parentElement;
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    if (rows.length <= 1) { App.toast('Il faut au moins un intrant', 'error'); return; }
    tr.remove();
    // Re-index
    tbody.querySelectorAll('tr:not(:last-child)').forEach((row, i) => {
      row.querySelectorAll('[data-int]').forEach(inp => inp.dataset.idx = i);
      const valEl = row.querySelector('td:nth-child(4)');
      if (valEl) valEl.id = 'intVal' + i;
    });
    this.calcT();
  },

  saveTraitement() {
    const date = document.getElementById('tDate').value;
    const espece = document.getElementById('tEspece').value;
    if(!date){App.toast('Date requise','error');return;}

    const collectPhases = (tbody) => {
      const arr=[];
      document.querySelectorAll('#'+tbody+' tr').forEach(row=>{
        arr.push({
          nom: row.querySelector('[data-ph="nom"]')?.value||'',
          seuil: parseFloat(row.querySelector('[data-ph="seuil"]')?.value)||0,
          qteInit: parseFloat(row.querySelector('[data-ph="qteInit"]')?.value)||0,
          qteFinale: parseFloat(row.querySelector('[data-ph="qteFinale"]')?.value)||0
        });
      });
      return arr;
    };
    const collectIntrants = () => {
      const arr=[];
      document.querySelectorAll('#tIntrants tr:not(:last-child)').forEach(row=>{
        const a=row.querySelector('[data-int="article"]');
        if(!a)return;
        arr.push({
          article: a.value,
          qte: parseFloat(row.querySelector('[data-int="qte"]')?.value)||0,
          prix: parseFloat(row.querySelector('[data-int="prix"]')?.value)||0
        });
      });
      return arr;
    };

    const v=id=>parseFloat(document.getElementById(id)?.value)||0;
    const poidsMP=v('tPoidsMP'), prixMP=v('tPrixMoyen'), valeurMP=poidsMP*prixMP, poidsPF=v('tPoidsPF');
    const intrants=collectIntrants();
    const totalInt=intrants.reduce((s,it)=>s+it.qte*it.prix,0);

    const previous = this.editingId ? App.data.production.find(p => p.id === this.editingId) : null;
    const monthStr = date ? date.substring(0, 7) : new Date().toISOString().substring(0, 7);
    const totalFacturesMois = (App.data.factures || []).filter(f => f.date.startsWith(monthStr)).reduce((s, f) => s + f.montant, 0);
    const totalKgMois = (App.data.production || []).filter(p => p.date.startsWith(monthStr) && p.id !== this.editingId).reduce((s, p) => s + (p.poidsBrutPF || 0), 0) + poidsPF;
    const coutFactureParKg = totalKgMois > 0 ? totalFacturesMois / totalKgMois : 0;
    const prixRevientBase = poidsPF>0?(valeurMP+totalInt)/poidsPF:0;

    const entry = {
      id: this.editingId || App.nextId(App.data.production),
      sourceSortieId: previous?.sourceSortieId || null,
      sourceLineIdx: previous?.sourceLineIdx ?? null,
      activite: this.currentActivite,
      receptionId: parseInt(document.getElementById('tReception')?.value)||0,
      date, espece,
      calibre: document.getElementById('tCalibre')?.value || '',
      client: document.getElementById('tClient').value,
      produitFini: document.getElementById('tProduitFini').value,
      poidsMP, prixMP, valeurMP,
      poidsBrutPF: poidsPF, caissesPF: parseInt(document.getElementById('tCaissesPF')?.value)||0,
      conditionnement: document.getElementById('tConditionnement').value,
      phases: collectPhases('tPhasesMP'),
      phasesPF: collectPhases('tPhasesPF'),
      intrants,
      rendement: poidsMP>0?(poidsPF/poidsMP*100):0,
      totalIntrants: totalInt,
      coutFactureParKg,
      prixRevient: prixRevientBase + coutFactureParKg,
      // compat fields
      poidsBrutPI: poidsMP, caissesPI:0, heuresMOO:0, heuresMOF:0,
      coutMOO:0, coutPersonnelF:0, coutMOJ:0,
      coutCarton:0,coutSachet:0,coutEtiquetteNoir:0,coutEtiquette5075:0,coutScotch:0
    };

    if(this.editingId){
      const idx=App.data.production.findIndex(p=>p.id===this.editingId);
      if(idx!==-1) App.data.production[idx]=entry;
    } else {
      App.data.production.push(entry);
    }
    App.saveData();
    this.hideForm();
    this.render();
    App.toast(this.editingId?'Saisie mise à jour':'Saisie enregistrée','success');
  },

  printTable() {
    try {
      const tableContainer = document.querySelector('.card-body .table-container');
      if (!tableContainer) return;
      const tableHTML = tableContainer.innerHTML;
      
      let printDiv = document.getElementById('printBonContainer');
      if (!printDiv) {
        printDiv = document.createElement('div');
        printDiv.id = 'printBonContainer';
        printDiv.className = 'print-only';
        document.body.appendChild(printDiv);
      }
      
      printDiv.innerHTML = `
        <div style="font-family:Arial, sans-serif; color:#000; background:#fff; font-size:12px; width:100%; max-width:1050px; margin:0 auto; padding:20px;">
          <!-- HEADER -->
          <table style="width:100%; border-bottom:2px solid #000; margin-bottom:15px; padding-bottom:10px;">
            <tr>
              <td style="width:120px; vertical-align:middle;">
                <img src="logo.png?v=${Date.now()}" style="max-height:70px; max-width:120px;" onerror="this.style.display='none'">
              </td>
              <td style="vertical-align:middle; text-align:center;">
                <h1 style="margin:0; font-size:20px; font-weight:bold;">FISH AND FOOD SARL</h1>
                <p style="margin:2px 0; font-size:11px;">Zone industrielle ANZA</p>
              </td>
              <td style="width:120px; text-align:right; vertical-align:middle;">
                <div style="border:1px solid #000; padding:5px;">
                  <span style="font-weight:bold; font-size:12px;">Date d'édition :</span><br>
                  ${App.formatDateFR(new Date())}
                </div>
              </td>
            </tr>
          </table>
          
          <h2 style="text-align:center; font-size:16px; margin:10px 0 20px 0; text-transform:uppercase;">RAPPORT MENSUEL DE PRODUCTION</h2>
          
          <!-- TABLE -->
          <div style="margin-bottom:40px;">
            ${tableHTML}
          </div>
          
          <!-- SIGNATURES -->
          <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <tr>
              <td style="width:33%; text-align:center; padding-bottom:70px;">
                <span style="font-weight:bold; text-decoration:underline;">Chef d'Atelier / Production</span>
              </td>
              <td style="width:33%; text-align:center; padding-bottom:70px;">
                <span style="font-weight:bold; text-decoration:underline;">Contrôle de Gestion</span>
              </td>
              <td style="width:33%; text-align:center; padding-bottom:70px;">
                <span style="font-weight:bold; text-decoration:underline;">Direction Générale</span>
              </td>
            </tr>
          </table>
        </div>
      `;

      const tables = printDiv.querySelectorAll('table');
      tables.forEach(t => { t.style.width = '100%'; t.style.borderCollapse = 'collapse'; t.style.fontSize = '11px'; t.style.border = '1px solid #000'; });
      const ths = printDiv.querySelectorAll('th');
      ths.forEach(th => { th.style.border = '1px solid #000'; th.style.padding = '5px'; th.style.background = '#f2f2f2'; th.style.color = '#000'; });
      const tds = printDiv.querySelectorAll('td');
      tds.forEach(td => { td.style.border = '1px solid #000'; td.style.padding = '4px'; });
      
      // Hide actions column
      const headerCols = printDiv.querySelectorAll('th');
      let actionColIdx = -1;
      headerCols.forEach((th, i) => { if((th.textContent || '').includes('Actions')) actionColIdx = i; });
      if(actionColIdx > -1) {
        printDiv.querySelectorAll('tr').forEach(tr => {
          if(tr.children[actionColIdx]) tr.children[actionColIdx].style.display = 'none';
        });
      }

      document.body.classList.add('printing-bon');
      setTimeout(() => {
        try { window.print(); } catch(err) { App.toast('Print error: ' + err.message, 'error'); }
        document.body.classList.remove('printing-bon');
      }, 500);
    } catch(err) {
      App.toast('Erreur PrintTable: ' + err.message, 'error');
      console.error(err);
    }
  },

  printBon(id) {
    try {
      const p = App.data.production.find(x => x.id === id);
      if (!p) return;
      const isTraitement = (p.activite === 'traitement' || p.activite === 'divers');
      // Calculate intrants total dynamically
      const intrantsArr = (p.intrants || []);
      const totalIntrants = p.totalIntrants || intrantsArr.reduce((s, it) => s + (it.qte||0) * (it.prix||0), 0);
      const coutEmb = (p.coutCarton||0)+(p.coutSachet||0)+(p.coutEtiquetteNoir||0)+(p.coutEtiquette5075||0)+(p.coutScotch||0);
      const valeurMP = p.valeurMP || (p.prixMP > 0 && (p.poidsMP||p.poidsBrutPI||0) > 0 ? p.prixMP * (p.poidsMP||p.poidsBrutPI) : 0);
      const coutTotal = valeurMP + totalIntrants + (p.coutMOJ||0);
      const pr = p.poidsBrutPF > 0 ? coutTotal / p.poidsBrutPF : 0;
      const rendement = p.rendement || ((p.poidsMP||p.poidsBrutPI||0) > 0 ? (p.poidsBrutPF / (p.poidsMP||p.poidsBrutPI) * 100) : 0);

      // Build phases MP rows
      const phasesMP = (p.phases || []);
      let phasesMPhtml = '';
      if (isTraitement && phasesMP.length > 0) {
        phasesMPhtml = `
          <h3 style="font-size:13px; margin:15px 0 5px; border-bottom:1px solid #000; display:inline-block;">Phases Matière Première</h3>
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
            <thead><tr style="background:#e8e8e8;">
              <th style="border:1px solid #000; padding:4px; text-align:left;">Phase</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Seuil %</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Qté Init (kg)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Qté Finale (kg)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Rend. Phase</th>
            </tr></thead>
            <tbody>${phasesMP.map(ph => {
              const rp = ph.qteInit > 0 ? (ph.qteFinale / ph.qteInit * 100) : 0;
              return `<tr>
                <td style="border:1px solid #000; padding:4px; font-weight:600;">${ph.nom}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(ph.seuil,1)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(ph.qteInit,2)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">${App.formatNumber(ph.qteFinale,2)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">${App.formatNumber(rp,2)} %</td>
              </tr>`;
            }).join('')}</tbody>
          </table>`;
      }

      // Build phases PF rows
      const phasesPF = (p.phasesPF || []);
      let phasesPFhtml = '';
      if (isTraitement && phasesPF.length > 0) {
        phasesPFhtml = `
          <h3 style="font-size:13px; margin:15px 0 5px; border-bottom:1px solid #000; display:inline-block;">Phases Produits Finis</h3>
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
            <thead><tr style="background:#e8e8e8;">
              <th style="border:1px solid #000; padding:4px; text-align:left;">Phase</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Seuil %</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Qté Init (kg)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Qté Finale (kg)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Rend. Phase</th>
            </tr></thead>
            <tbody>${phasesPF.map(ph => {
              const rp = ph.qteInit > 0 ? (ph.qteFinale / ph.qteInit * 100) : 0;
              return `<tr>
                <td style="border:1px solid #000; padding:4px; font-weight:600;">${ph.nom}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(ph.seuil,1)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(ph.qteInit,2)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">${App.formatNumber(ph.qteFinale,2)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">${App.formatNumber(rp,2)} %</td>
              </tr>`;
            }).join('')}</tbody>
          </table>`;
      }

      // Build intrants rows
      const intrants = (p.intrants || []);
      let intrantsHtml = '';
      if (intrants.length > 0) {
        const totalInt = intrants.reduce((s, it) => s + (it.qte||0) * (it.prix||0), 0);
        intrantsHtml = `
          <h3 style="font-size:13px; margin:15px 0 5px; border-bottom:1px solid #000; display:inline-block;">Détail des Intrants</h3>
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
            <thead><tr style="background:#e8e8e8;">
              <th style="border:1px solid #000; padding:4px; text-align:left;">Article</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Quantité</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Prix Unit. (DH)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Valeur (DH)</th>
            </tr></thead>
            <tbody>${intrants.map(it => {
              const val = (it.qte||0) * (it.prix||0);

              return `<tr>
                <td style="border:1px solid #000; padding:4px; font-weight:600;">${it.article}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(it.qte||0,2)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(it.prix||0,2)}</td>
                <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">${App.formatNumber(val,2)}</td>
              </tr>`;
            }).join('')}
            <tr style="background:#f2f2f2;">
              <td colspan="3" style="border:1px solid #000; padding:5px; font-weight:bold; text-align:right;">TOTAL INTRANTS</td>
              <td style="border:1px solid #000; padding:5px; text-align:right; font-weight:bold;">${App.formatNumber(totalInt,2)} DH</td>
            </tr></tbody>
          </table>`;
      }

      // Build QR data
      const qrData = JSON.stringify({
        t: 'prod', id: p.id, d: (p.date||'').substring(0,10),
        esp: (p.espece||'').substring(0,12), cal: (p.calibre||'').substring(0,12),
        cli: (p.client||'Interne').substring(0,12),
        pf: p.poidsBrutPF, rnd: App.formatNumber(p.rendement,1),
        act: (p.activite||'').substring(0,8)
      });

      let printDiv = document.getElementById('printBonContainer');
      if (!printDiv) {
        printDiv = document.createElement('div');
        printDiv.id = 'printBonContainer';
        printDiv.className = 'print-only';
        document.body.appendChild(printDiv);
      }

      const _poidsPF = p.poidsBrutPF || 0;
      const _valeurMPkg = _poidsPF > 0 ? valeurMP / _poidsPF : 0;
      const _coutIntrantsKg = _poidsPF > 0 ? totalIntrants / _poidsPF : 0;
      const _coutMOkg = _poidsPF > 0 ? (p.coutMOJ || 0) / _poidsPF : 0;

      // Coût factures du mois : total factures du mois / total kg traités du mois
      const _dateMois = (p.date || '').substring(0, 7);
      const _facturesMois = (App.data.factures || []).filter(f => (f.date || '').substring(0, 7) === _dateMois);
      const _totalFacturesMois = _facturesMois.reduce((s, f) => s + (f.montant || 0), 0);
      const _saisiesMois = (App.data.production || []).filter(pr => (pr.date || '').substring(0, 7) === _dateMois);
      const _totalKgMois = _saisiesMois.reduce((s, pr) => s + (pr.poidsBrutPF || 0), 0);
      const _coutFactureKg = _totalKgMois > 0 ? _totalFacturesMois / _totalKgMois : 0;

      const _prixRevientKg = _valeurMPkg + _coutIntrantsKg + _coutMOkg + _coutFactureKg;

      const ficheTitle = isTraitement
        ? `FICHE D'ACTIVITÉ ${p.activite.toUpperCase()} N° TRT-${p.id}`
        : `FICHE DE PRODUCTION N° PRD-${p.id}`;

      printDiv.innerHTML = `
        <div style="font-family:Arial, sans-serif; color:#000; background:#fff; font-size:12px; width:100%; max-width:800px; margin:0 auto; padding:20px;">
          <!-- HEADER -->
          <table style="width:100%; border-bottom:2px solid #000; margin-bottom:10px; padding-bottom:8px;">
            <tr>
              <td style="width:100px; vertical-align:middle;">
                <img src="logo.png?v=${Date.now()}" style="max-height:60px; max-width:100px;" onerror="this.style.display='none'">
              </td>
              <td style="vertical-align:middle; text-align:center;">
                <h1 style="margin:0; font-size:18px; font-weight:bold;">FISH AND FOOD SARL</h1>
                <p style="margin:2px 0; font-size:10px;">Zone industrielle ANZA — Agadir</p>
              </td>
              <td style="width:100px; text-align:right; vertical-align:middle;">
                <div style="border:1px solid #999; padding:4px; font-size:10px; text-align:center;">
                  <div style="font-weight:bold;">Date édition</div>
                  ${App.formatDateFR(new Date())}
                </div>
              </td>
            </tr>
          </table>

          <h2 style="text-align:center; font-size:15px; margin:8px 0 15px; text-transform:uppercase; background:#222; color:#fff; padding:6px; letter-spacing:1px;">${ficheTitle}</h2>

          <!-- INFO -->
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
            <tr>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; width:18%; background:#f5f5f5;">Date</td>
              <td style="border:1px solid #000; padding:4px; width:32%;">${App.formatDateFR(p.date)}</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; width:18%; background:#f5f5f5;">Client</td>
              <td style="border:1px solid #000; padding:4px; width:32%;">${p.client||'Interne'}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Activité</td>
              <td style="border:1px solid #000; padding:4px; text-transform:uppercase;">${p.activite}</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Produit Fini</td>
              <td style="border:1px solid #000; padding:4px;">${p.produitFini||'-'}</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Espèce</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold;">${p.espece||'-'}</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Calibre</td>
              <td style="border:1px solid #000; padding:4px;">${p.calibre||'-'}</td>
            </tr>
          </table>

          ${phasesMPhtml}
          
          <!-- BILAN QUANTITATIF -->
          <h3 style="font-size:13px; margin:15px 0 5px; border-bottom:1px solid #000; display:inline-block;">Bilan Quantitatif</h3>
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
            <thead><tr style="background:#e8e8e8;">
              <th style="border:1px solid #000; padding:4px; text-align:left;">Matière Première (kg)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Poids Fini Net (kg)</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Nb Caisses</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Conditionnement</th>
              <th style="border:1px solid #000; padding:4px; text-align:right;">Rendement</th>
            </tr></thead>
            <tbody><tr>
              <td style="border:1px solid #000; padding:4px;">${App.formatNumber(p.poidsMP || p.poidsBrutPI || 0,2)}</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold;">${App.formatNumber(p.poidsBrutPF,2)}</td>
              <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(p.caissesPF,0)}</td>
              <td style="border:1px solid #000; padding:4px; text-align:right;">${p.conditionnement||'-'}</td>
              <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">${App.formatNumber(rendement || 0,2)} %</td>
            </tr></tbody>
          </table>

          ${phasesPFhtml}
          ${intrantsHtml}

          <!-- ANALYSE DES COÛTS -->
          <h3 style="font-size:13px; margin:15px 0 5px; border-bottom:1px solid #000; display:inline-block;">Analyse des Coûts</h3>
          <table style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:11px;">
            <tr>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; width:25%; background:#f5f5f5;">Valeur MP</td>
              <td style="border:1px solid #000; padding:4px; text-align:right; width:25%;">${App.formatNumber(_valeurMPkg,2)} DH/kg</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; width:25%; background:#f5f5f5;">Coût Intrants</td>
              <td style="border:1px solid #000; padding:4px; text-align:right; width:25%;">${App.formatNumber(_coutIntrantsKg,2)} DH/kg</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Coût M.O.</td>
              <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(_coutMOkg,2)} DH/kg</td>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Coût Emballage</td>
              <td style="border:1px solid #000; padding:4px; text-align:right;">${App.formatNumber(_coutIntrantsKg,2)} DH/kg</td>
            </tr>
            <tr>
              <td style="border:1px solid #000; padding:4px; font-weight:bold; background:#f5f5f5;">Charges / Factures</td>
              <td style="border:1px solid #000; padding:4px; text-align:right; color:#c00;">${App.formatNumber(_coutFactureKg,2)} DH/kg</td>
              <td style="border:1px solid #000; padding:4px; font-size:9px; color:#555;" colspan="2">Factures ${_dateMois} : ${App.formatNumber(_totalFacturesMois,2)} DH / ${App.formatNumber(_totalKgMois,0)} kg</td>
            </tr>
            <tr style="background:#222; color:#fff;">
              <td colspan="3" style="border:1px solid #000; padding:6px; font-weight:bold; text-align:right; font-size:12px;">PRIX DE REVIENT GLOBAL (DH/KG)</td>
              <td style="border:1px solid #000; padding:6px; text-align:right; font-weight:bold; font-size:14px;">${App.formatNumber(_prixRevientKg,2)}</td>
            </tr>
          </table>

          <!-- SIGNATURES -->
          <table style="width:100%; border-collapse:collapse; margin-top:15px;">
            <tr>
              <td style="width:33%; text-align:center; padding-bottom:50px;">
                <span style="font-weight:bold; text-decoration:underline; font-size:10px;">Chef d'Atelier / Production</span>
              </td>
              <td style="width:33%; text-align:center; padding-bottom:50px;">
                <span style="font-weight:bold; text-decoration:underline; font-size:10px;">Contrôle de Gestion</span>
              </td>
              <td style="width:33%; text-align:center; padding-bottom:50px;">
                <span style="font-weight:bold; text-decoration:underline; font-size:10px;">Direction Générale</span>
              </td>
            </tr>
          </table>

          <!-- GRAND QR CODE EN BAS -->
          <div style="border-top:2px solid #000; padding-top:15px; margin-top:10px; text-align:center;">
            <div style="font-weight:bold; font-size:12px; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">Traçabilité — Scanner pour vérifier</div>
            <div id="bonQrCodeBig" style="display:inline-block;"></div>
            <div style="margin-top:6px; font-size:9px; color:#666;">
              ${ficheTitle} | ${p.espece||''} ${p.calibre||''} | ${App.formatDateFR(p.date)} | ${p.client||'Interne'}
            </div>
          </div>
        </div>
      `;

      document.body.classList.add('printing-bon');

      setTimeout(() => {
        // Generate large QR at bottom
        if (typeof QRCode !== 'undefined') {
          document.getElementById("bonQrCodeBig").innerHTML = '';
          new QRCode(document.getElementById("bonQrCodeBig"), {
            text: qrData, width: 180, height: 180,
            correctLevel: QRCode.CorrectLevel.L
          });

          // Force canvas to img for reliable printing
          setTimeout(() => {
            const canvas = document.querySelector('#bonQrCodeBig canvas');
            const img = document.querySelector('#bonQrCodeBig img');
            if (canvas && img && (!img.src || img.src === '')) {
              img.src = canvas.toDataURL('image/png');
              img.style.display = 'block';
              canvas.style.display = 'none';
            }
          }, 50);
        }

        setTimeout(() => {
          try { window.print(); } catch(err) { App.toast('Print error: ' + err.message, 'error'); }
          document.body.classList.remove('printing-bon');
        }, 500);
      }, 50);
    } catch(err) {
      App.toast('Erreur PrintBon: ' + err.message, 'error');
      console.error(err);
    }
  },

  scanAndCreate() {
    if (typeof Stockage !== 'undefined' && Stockage.startScanner) {
      Stockage.startScanner((espece, calibre) => {
        App.toast(`Scanné: ${espece} (Cal: ${calibre})`, 'success');
        if (this.currentActivite === 'reconditionnement') {
          this.showForm();
          setTimeout(() => {
            const espSelect = document.getElementById('fEspece');
            if (espSelect) { espSelect.value = espece; this.onEspeceChange('fEspece', 'fCalibre', calibre); }
          }, 100);
        } else {
          this.showTraitementForm();
          setTimeout(() => {
            const espSelect = document.getElementById('tEspece');
            if (espSelect) { espSelect.value = espece; this.onEspeceChange('tEspece', 'tCalibre', calibre); }
          }, 100);
        }
      });
    } else {
      App.toast('Scanner non disponible', 'error');
    }
  },

  onEspeceChange(espId, calId, selectedCalibre = null) {
    const espNom = document.getElementById(espId)?.value;
    const esp = App.data.especes.find(e => e.nom === espNom);
    const calSelect = document.getElementById(calId);
    if (!calSelect) return;
    if (esp) {
      calSelect.innerHTML = esp.calibres.map(c => `<option value="${c}" ${selectedCalibre===c?'selected':''}>${c}</option>`).join('');
    } else {
      calSelect.innerHTML = '<option value="">-- Calibre --</option>';
    }
  },

  refreshQR() {
    const client = document.getElementById('tClient')?.value || '';
    const espece = document.getElementById('tEspece')?.value || '';
    const calibre = document.getElementById('tCalibre')?.value || '';
    const area = document.getElementById('saisieQRArea');
    if (!area) return;

    if (!client && !espece) {
      area.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;">Sélectionnez Client & Espèce pour afficher le QR Code associé</div>';
      return;
    }

    const qr = (typeof QRCodes !== 'undefined') ? QRCodes.getQRForLot(client, espece, calibre) : null;
    if (qr && qr.imageData) {
      area.innerHTML = `
        <div style="display:flex;align-items:center;gap:20px;justify-content:center;flex-wrap:wrap;">
          <img src="${qr.imageData}" width="120" style="border-radius:8px;border:2px solid var(--border-color);background:white;padding:4px;">
          <div style="text-align:left;font-size:0.82rem;">
            <div style="font-weight:800;margin-bottom:4px;">QR Code associé</div>
            <div style="color:var(--text-secondary);">Type: <strong>${qr.type}</strong></div>
            ${qr.value ? `<div style="color:var(--text-secondary);">Valeur: <strong>${qr.value}</strong></div>` : ''}
            ${qr.espece ? `<div style="color:var(--text-secondary);">Espèce: <span class="badge badge-info">${qr.espece}</span></div>` : ''}
            ${qr.calibre ? `<div style="color:var(--text-secondary);">Calibre: <strong>${qr.calibre}</strong></div>` : ''}
            <div style="color:var(--text-muted);font-size:0.75rem;margin-top:4px;">ID: ${qr.id} — ${App.formatDateFR(qr.createdAt)}</div>
          </div>
        </div>`;
    } else {
      area.innerHTML = `
        <div style="background:rgba(245,158,11,0.14);border:1px solid rgba(245,158,11,0.35);border-radius:8px;padding:12px;color:var(--accent-yellow);font-size:0.85rem;">
          ⚠️ Aucun QR Code trouvé pour <strong>${client || '-'}</strong> / <strong>${espece || '-'}</strong>
          <br><button class="btn btn-sm btn-outline" style="margin-top:8px;font-size:0.78rem;" onclick="App.navigate('qrcodes')">➕ Générer un QR Code</button>
        </div>`;
    }
  },

  scanForForm(espId, calId) {
    if (typeof Stockage !== 'undefined' && Stockage.startScanner) {
      Stockage.startScanner((espece, calibre) => {
        const espSelect = document.getElementById(espId);
        if (espSelect) {
          espSelect.value = espece;
          this.onEspeceChange(espId, calId, calibre);
          this.refreshQR();
          App.toast(`Scanné: ${espece} (Cal: ${calibre})`, 'success');
        }
      });
    } else {
      App.toast('Scanner non disponible', 'error');
    }
  },

  /* ============================================
     ENVOI VERS STOCKAGE — Post-Traitement
     ============================================ */
  showSendToStorageModal(id) {
    const p = App.data.production.find(x => x.id === id);
    if (!p) return;
    if (p.sentToStorage) { App.toast('Cette saisie a déjà été envoyée vers le stockage', 'warning'); return; }
    if (!(p.poidsBrutPF > 0)) { App.toast('Le traitement n\'est pas encore terminé (Poids PF = 0)', 'error'); return; }

    const activiteLabel = (p.activite === 'traitement') ? 'Traitement' : (p.activite === 'reconditionnement' ? 'Reconditionnement' : p.activite);

    App.showModal('📦 Envoyer vers Stockage', `
      <div style="padding:10px 0;">
        <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:18px;margin-bottom:20px;">
          <div style="font-weight:800;font-size:1.05rem;margin-bottom:12px;color:var(--accent-green);">
            📋 Résumé du lot à envoyer
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;font-size:0.88rem;">
            <div><span style="color:var(--text-muted);">Activité :</span> <strong>${activiteLabel}</strong></div>
            <div><span style="color:var(--text-muted);">Date :</span> <strong>${App.formatDateFR(p.date)}</strong></div>
            <div><span style="color:var(--text-muted);">Espèce :</span> <span class="badge badge-info">${p.espece||'-'}</span></div>
            <div><span style="color:var(--text-muted);">Calibre :</span> <strong>${p.calibre||'-'}</strong></div>
            <div><span style="color:var(--text-muted);">Client :</span> <strong>${p.client||'Interne'}</strong></div>
            <div><span style="color:var(--text-muted);">Produit fini :</span> <strong>${p.produitFini||'-'}</strong></div>
            <div><span style="color:var(--text-muted);">Poids PF :</span> <strong style="color:var(--accent-green);font-size:1.1rem;">${App.formatNumber(p.poidsBrutPF,2)} kg</strong></div>
            <div><span style="color:var(--text-muted);">Caisses PF :</span> <strong>${App.formatNumber(p.caissesPF||0,0)}</strong></div>
            <div><span style="color:var(--text-muted);">Conditionnement :</span> <strong>${p.conditionnement||'-'}</strong></div>
            <div><span style="color:var(--text-muted);">Rendement :</span> <strong>${App.formatNumber(p.rendement||0,2)}%</strong></div>
          </div>
        </div>

        <div class="form-section" style="margin-top:0;">
          <div class="form-section-title">❄️ Destination — Chambre de stockage</div>
          <div class="form-grid" style="grid-template-columns:1fr;">
            <div class="form-group">
              <label class="form-label">Chambre de froid *</label>
              <select class="form-select" id="sendToChambre" style="font-size:1rem;padding:12px;">
                <option value="chambre1">❄️ Chambre 1</option>
                <option value="chambre2">❄️ Chambre 2</option>
                <option value="entreposage">📦 Entreposage</option>
              </select>
            </div>
          </div>
        </div>

        <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:12px;margin-top:14px;font-size:0.82rem;color:var(--accent-yellow);">
          ⚠️ Cette action va créer un élément en attente dans <strong>Entrée de Stockage → Éléments en Attente</strong>.
          L'origine sera marquée comme <strong>${activiteLabel}</strong>.
          La fiche sera en <strong>lecture seule</strong>.
        </div>
      </div>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Annuler</button>
      <button class="btn btn-success" style="min-width:200px;font-size:1rem;" onclick="Saisie.confirmSendToStorage(${id})">📦 Confirmer l'envoi</button>
    `);
  },

  confirmSendToStorage(id) {
    const p = App.data.production.find(x => x.id === id);
    if (!p) return;
    if (p.sentToStorage) { App.toast('Déjà envoyé', 'warning'); App.closeModal(); return; }

    const chambre = document.getElementById('sendToChambre')?.value || 'chambre1';
    const activiteLabel = (p.activite === 'traitement') ? 'Traitement' : (p.activite === 'reconditionnement' ? 'Reconditionnement' : p.activite);

    if (!App.data.pendingStorageEntries) App.data.pendingStorageEntries = [];

    const pendingEntry = {
      id: App.nextId(App.data.pendingStorageEntries),
      productionId: p.id,
      activite: p.activite,
      origine: activiteLabel,
      dateEnvoi: new Date().toISOString().split('T')[0],
      dateProd: p.date,
      client: p.client || 'Interne',
      espece: p.espece || '',
      calibre: p.calibre || '',
      produitFini: p.produitFini || '',
      poidsPF: p.poidsBrutPF || 0,
      caissesPF: p.caissesPF || 0,
      conditionnement: p.conditionnement || '',
      chambreDestination: chambre,
      receptionId: p.receptionId || null,
      rendement: p.rendement || 0,
      prixRevient: p.prixRevient || 0,
      poidsMP: p.poidsMP || p.poidsBrutPI || 0,
      valeurMP: p.valeurMP || 0,
      totalIntrants: p.totalIntrants || 0,
      phases: p.phases || [],
      phasesPF: p.phasesPF || [],
      intrants: p.intrants || [],
      status: 'pending'
    };

    App.data.pendingStorageEntries.push(pendingEntry);

    // Mark the production entry
    p.sentToStorage = true;
    p.sentToStorageDate = new Date().toISOString();
    p.sentToChambre = chambre;

    App.saveData();
    App.closeModal();
    this.render();
    App.toast(`Lot envoyé vers ${activiteLabel === 'Traitement' ? 'Stockage' : 'Stockage'} (${chambre === 'chambre1' ? 'Chambre 1' : chambre === 'chambre2' ? 'Chambre 2' : 'Entreposage'}) — Élément en attente créé`, 'success');
  }
};
