/* ============================================
   QR CODES — Codes QR uniques & immuables
   ============================================ */
const QRCodes = {
  SERVICES: ['Congélation', 'Frais', 'Traitement'],
  currentTab: 'generate',

  getEspeces() {
    return (App.data.especes || [])
      .map(e => typeof e === 'string' ? e : e?.nom)
      .filter(Boolean)
      .map(e => e.trim())
      .filter(Boolean);
  },

  getCalibresForEspece(espece) {
    const item = (App.data.especes || []).find(e => (typeof e === 'string' ? e : e?.nom) === espece);
    if (item && Array.isArray(item.calibres)) return item.calibres;
    if (App.data.especeCalibres?.[espece]) return App.data.especeCalibres[espece];
    return App.data.calibres || [];
  },

  getClients() {
    const names = new Set();
    (App.data.stockage || []).forEach(e => {
      if (e.client) names.add(e.client);
      if (e.fournisseur) names.add(e.fournisseur);
      if (e.consignataire) names.add(e.consignataire);
    });
    (App.data.production || []).forEach(e => {
      if (e.client) names.add(e.client);
    });
    (App.data.factures || []).forEach(e => {
      if (e.client) names.add(e.client);
    });
    [
      'FISH & FOOD TRAITEMENT',
      'FISH AND FOOD PROCESS',
      'LAMBDA FISH SUD',
      'A.O.C',
      'ALIA PECHE',
      'ARCHI FOOD',
      'ASMAK KHALIL ADAM',
      'ATLANTIC FISH MOROCCO',
      'ATLANTIC FISH SUD',
      'DIVERS'
    ].forEach(name => names.add(name));
    return [...names].filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'));
  },

  render() {
    const qrList = App.data.qrCodes || [];
    const content = document.getElementById('pageContent');
    content.innerHTML = `
      <div class="fade-in qr-module" style="background:var(--bg-card);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:12px;">
        <div class="ntsamak-tabs" style="display:flex;gap:10px;margin-bottom:15px;border-bottom:2px solid var(--border-color);padding-bottom:5px;justify-content:center;">
          <button class="ntsamak-tab ${this.currentTab==='generate'?'active':''}" onclick="QRCodes.switchTab('generate')" style="padding:8px 16px;border:none;background:transparent;${this.currentTab==='generate'?'border-bottom:3px solid var(--primary-color);color:var(--primary-color);font-weight:700;':'color:var(--text-muted);font-weight:600;'}cursor:pointer;">Générer QR Code</button>
          <button class="ntsamak-tab ${this.currentTab==='list'?'active':''}" onclick="QRCodes.switchTab('list')" style="padding:8px 16px;border:none;background:transparent;${this.currentTab==='list'?'border-bottom:3px solid var(--primary-color);color:var(--primary-color);font-weight:700;':'color:var(--text-muted);font-weight:600;'}cursor:pointer;">Codes enregistrés (${qrList.length})</button>
        </div>
        <div id="qrContent">${this.buildTab()}</div>
      </div>`;
  },

  switchTab(t) { this.currentTab = t; document.getElementById('qrContent').innerHTML = this.buildTab(); },

  buildTab() { return this.currentTab === 'generate' ? this.buildGenerateTab() : this.buildListTab(); },

  // --- Unique key for dedup ---
  makeKey(type, value, espece, calibre) {
    if (type === 'service' && espece && calibre) return `${type}::${value.trim().toUpperCase()}|${espece.trim().toUpperCase()}|${calibre.trim().toUpperCase()}`;
    if (type === 'service' && espece) return `${type}::${value.trim().toUpperCase()}|${espece.trim().toUpperCase()}`;
    return `${type}::${value.trim().toUpperCase()}`;
  },

  exists(type, value, espece, calibre) {
    const key = this.makeKey(type, value, espece, calibre);
    return (App.data.qrCodes || []).some(q => q.uniqueKey === key);
  },

  // --- Generate Tab ---
  buildGenerateTab() {
    const especes = this.getEspeces();
    return `
      <div class="card" style="margin-bottom:18px;">
        <div class="card-header" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;">
          <span class="card-title" style="color:white;">🏷️ Générer un QR Code unique</span>
        </div>
        <div class="card-body">
          <div style="background:rgba(59,130,246,0.12);border:1px solid rgba(96,165,250,0.35);border-radius:8px;padding:10px 14px;margin-bottom:16px;color:var(--text-primary);font-size:0.84rem;">
            <strong>ℹ️ Règle :</strong> Chaque QR Code est <strong>unique et immuable</strong>. Un seul code par client, par espèce ou par service. Il ne peut être ni modifié ni dupliqué.
          </div>
          <div class="form-grid" style="grid-template-columns:1fr 1fr 1fr 1fr;">
            <div class="form-group">
              <label class="form-label">Type de QR Code *</label>
              <select class="form-select" id="qrType" onchange="QRCodes.onTypeChange()">
                <option value="">-- Choisir --</option>
                <option value="client">👤 Client</option>
                <option value="espece">🐟 Espèce</option>
                <option value="service">🏭 Service</option>
              </select>
            </div>
            <div class="form-group" id="qrValueGroup" style="display:none;">
              <label class="form-label" id="qrValueLabel">Valeur</label>
              <select class="form-select" id="qrValue"></select>
            </div>
            <div class="form-group" id="qrEspeceGroup" style="display:none;">
              <label class="form-label">🐟 Espèce *</label>
              <select class="form-select" id="qrServiceEspece">
                <option value="">-- Sélectionner --</option>
                ${especes.map(e => `<option value="${e}">${e}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" id="qrCalibreGroup" style="display:none;">
              <label class="form-label">📏 Calibre *</label>
              <select class="form-select" id="qrServiceCalibre">
                <option value="">-- Choisir espèce d'abord --</option>
              </select>
            </div>
          </div>
          <div id="qrDupWarning" style="display:none;margin-top:10px;"></div>
          <div style="margin-top:16px;">
            <button class="btn-ntsamak-green" onclick="QRCodes.generate()" id="qrGenBtn" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/></svg>
              Générer & Enregistrer
            </button>
          </div>
        </div>
      </div>
      <div id="qrPreviewArea"></div>`;
  },

  onTypeChange() {
    const type = document.getElementById('qrType').value;
    const vg = document.getElementById('qrValueGroup');
    const eg = document.getElementById('qrEspeceGroup');
    const cg = document.getElementById('qrCalibreGroup');
    const sel = document.getElementById('qrValue');
    const lbl = document.getElementById('qrValueLabel');
    const btn = document.getElementById('qrGenBtn');
    const warn = document.getElementById('qrDupWarning');
    warn.style.display = 'none';
    eg.style.display = 'none';
    cg.style.display = 'none';
    if (!type) { vg.style.display = 'none'; btn.disabled = true; return; }
    vg.style.display = '';
    let opts = '';
    if (type === 'client') {
      lbl.textContent = 'Client';
      opts = this.getClients().map(c => `<option value="${c}">${c}</option>`).join('');
    } else if (type === 'espece') {
      lbl.textContent = 'Espèce';
      opts = this.getEspeces().map(e => `<option value="${e}">${e}</option>`).join('');
    } else {
      lbl.textContent = 'Service';
      opts = this.SERVICES.map(s => `<option value="${s}">${s}</option>`).join('');
      eg.style.display = '';
      cg.style.display = '';
      document.getElementById('qrServiceEspece').onchange = () => this.onServiceEspeceChange();
      document.getElementById('qrServiceCalibre').onchange = () => this.checkDuplicate();
    }
    sel.innerHTML = '<option value="">-- Sélectionner --</option>' + opts;
    sel.onchange = () => this.checkDuplicate();
    btn.disabled = true;
  },

  onServiceEspeceChange() {
    const espece = document.getElementById('qrServiceEspece')?.value?.trim() || '';
    const calSel = document.getElementById('qrServiceCalibre');
    if (!calSel) return;
    const calibres = espece ? this.getCalibresForEspece(espece) : [];
    calSel.innerHTML = '<option value="">-- Calibre --</option>' + calibres.map(c => `<option value="${c}">${c}</option>`).join('');
    this.checkDuplicate();
  },

  checkDuplicate() {
    const type = document.getElementById('qrType').value;
    const value = document.getElementById('qrValue').value;
    const espece = type === 'service' ? (document.getElementById('qrServiceEspece')?.value || '') : '';
    const calibre = type === 'service' ? (document.getElementById('qrServiceCalibre')?.value || '') : '';
    const warn = document.getElementById('qrDupWarning');
    const btn = document.getElementById('qrGenBtn');
    if (!value || (type === 'service' && (!espece || !calibre))) { warn.style.display = 'none'; btn.disabled = true; return; }
    const label = type === 'service' ? `${value} / ${espece} / ${calibre}` : value;
    if (this.exists(type, value, espece, calibre)) {
      warn.style.display = '';
      warn.innerHTML = `<div style="background:rgba(239,68,68,0.16);border:1px solid rgba(248,113,113,0.45);border-radius:6px;padding:8px 12px;color:var(--text-primary);font-size:0.84rem;">⛔ Ce QR Code existe déjà pour <strong>${label}</strong>. Un seul code par combinaison est autorisé.</div>`;
      btn.disabled = true;
    } else {
      warn.style.display = '';
      warn.innerHTML = `<div style="background:rgba(16,185,129,0.14);border:1px solid rgba(52,211,153,0.45);border-radius:6px;padding:8px 12px;color:var(--text-primary);font-size:0.84rem;">✅ Disponible — Ce QR Code sera unique et permanent.</div>`;
      btn.disabled = false;
    }
  },

  async generate() {
    const type = document.getElementById('qrType').value;
    const value = document.getElementById('qrValue').value;
    const espece = type === 'service' ? (document.getElementById('qrServiceEspece')?.value || '') : '';
    const calibre = type === 'service' ? (document.getElementById('qrServiceCalibre')?.value || '') : '';
    if (!type || !value) { App.toast('Sélectionnez un type et une valeur', 'error'); return; }
    if (type === 'service' && !espece) { App.toast('Sélectionnez une espèce pour ce service', 'error'); return; }
    if (type === 'service' && !calibre) { App.toast('Sélectionnez un calibre', 'error'); return; }
    if (this.exists(type, value, espece, calibre)) { App.toast('Ce QR Code existe déjà !', 'error'); return; }

    const uniqueKey = this.makeKey(type, value, espece, calibre);
    const displayValue = type === 'service' ? `${value} — ${espece} — ${calibre}` : value;
    const qrData = {
      type, value: value.trim(), espece: espece.trim(), calibre: calibre.trim(), uniqueKey,
      entreprise: 'RCG-HAMZA',
      createdAt: new Date().toISOString()
    };
    // Strip accents for QR encoding (UTF-8 accented chars cause overflow)
    const stripAccents = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const qrString = stripAccents(uniqueKey);

    // Create preview area
    const area = document.getElementById('qrPreviewArea');
    area.innerHTML = `<div class="card"><div class="card-header"><span class="card-title">📱 QR Code généré</span></div>
      <div class="card-body" style="display:flex;gap:30px;align-items:flex-start;">
        <div style="text-align:center;" id="qrRenderDiv"></div>
        <div style="flex:1;">
          <div style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:8px;padding:16px;">
            <h4 style="margin:0 0 8px;">Informations</h4>
            <div style="font-size:0.85rem;display:grid;grid-template-columns:100px 1fr;gap:6px;">
              <span style="font-weight:600;color:var(--text-secondary);">Type:</span><span>${type === 'client' ? '👤 Client' : type === 'espece' ? '🐟 Espèce' : '🏭 Service'}</span>
              <span style="font-weight:600;color:var(--text-secondary);">Valeur:</span><span class="td-bold">${displayValue}</span>
              ${espece ? `<span style="font-weight:600;color:var(--text-secondary);">Espèce:</span><span class="badge badge-info">${espece}</span>` : ''}
              ${calibre ? `<span style="font-weight:600;color:var(--text-secondary);">Calibre:</span><span class="badge badge-warning" style="background:#f59e0b;color:#fff;">${calibre}</span>` : ''}
              <span style="font-weight:600;color:var(--text-secondary);">Clé unique:</span><span style="font-family:monospace;font-size:0.8rem;color:var(--accent-purple-light);">${uniqueKey}</span>
            </div>
            <div style="margin-top:10px;background:rgba(59,130,246,0.12);border:1px solid rgba(96,165,250,0.25);border-radius:4px;padding:6px 10px;font-size:0.78rem;color:var(--text-primary);">🔒 Ce code est <strong>permanent et immuable</strong></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:14px;">
            <button class="btn btn-outline" onclick="QRCodes.printQR()">🖨️ Imprimer</button>
            <button class="btn btn-outline" onclick="QRCodes.downloadQR()">⬇️ Télécharger</button>
          </div>
        </div>
      </div></div>`;

    try {
      new QRCode(document.getElementById('qrRenderDiv'), {
        text: qrString,
        width: 200,
        height: 200,
        colorDark: '#1e293b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L
      });
    } catch(e) { App.toast('Erreur QR: ' + e.message, 'error'); return; }

    // Wait a tick for the canvas/img to be rendered
    await new Promise(r => setTimeout(r, 300));

    // Save permanently — get the generated image
    const qrImg = document.querySelector('#qrRenderDiv img') || document.querySelector('#qrRenderDiv canvas');
    let imageData = '';
    if (qrImg) {
      if (qrImg.tagName === 'CANVAS') {
        imageData = qrImg.toDataURL('image/png');
      } else {
        imageData = qrImg.src; // already a data URL
      }
    }

    if (!App.data.qrCodes) App.data.qrCodes = [];
    App.data.qrCodes.push({
      id: App.nextId(App.data.qrCodes),
      ...qrData,
      imageData
    });
    App.saveData();
    this._lastQR = qrData;
    this._lastImageData = imageData;
    document.getElementById('qrGenBtn').disabled = true;
    this.checkDuplicate();
    App.toast(`QR Code "${displayValue}" enregistré (immuable)`, 'success');
  },

  printQR() {
    const d = this._lastQR || {};
    const imgSrc = this._lastImageData || '';
    if (!imgSrc) { App.toast('Aucun QR Code à imprimer', 'error'); return; }
    const w = window.open('','_blank');
    w.document.write(`<html><head><title>QR — ${d.value}${d.espece ? ' / '+d.espece : ''}${d.calibre ? ' / '+d.calibre : ''}</title>
    <style>body{font-family:Arial,sans-serif;text-align:center;padding:20px}.label{border:2px solid #333;padding:20px;display:inline-block;border-radius:8px;max-width:360px}h2{margin:0 0 4px;font-size:1rem}h3{margin:0 0 12px;color:#666;font-size:0.85rem}.info{text-align:left;font-size:0.82rem;margin-top:10px}.info div{padding:2px 0;border-bottom:1px dotted #ddd}.info span{font-weight:bold}</style></head>
    <body><div class="label"><h2>RCG-HAMZA</h2><h3>${d.type==='service'?'🏭':d.type==='client'?'👤':'🐟'} ${d.value}${d.espece?' — '+d.espece:''}${d.calibre?' — '+d.calibre:''}</h3><img src="${imgSrc}" width="160"><div class="info"><div><span>Type:</span> ${d.type}</div><div><span>Valeur:</span> ${d.value}</div>${d.espece?'<div><span>Espèce:</span> '+d.espece+'</div>':''}${d.calibre?'<div><span>Calibre:</span> '+d.calibre+'</div>':''}<div><span>Clé:</span> ${d.uniqueKey}</div></div></div><script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
  },

  downloadQR() {
    const d = this._lastQR || {};
    const imgSrc = this._lastImageData || '';
    if (!imgSrc) { App.toast('Aucun QR Code à télécharger', 'error'); return; }
    const a = document.createElement('a');
    a.download = `QR_${d.type}_${d.value}${d.calibre ? '_'+d.calibre : ''}.png`;
    a.href = imgSrc;
    a.click();
  },

  // --- List Tab ---
  buildListTab() {
    const qrList = App.data.qrCodes || [];
    if (qrList.length === 0) return '<div class="empty-state"><div class="empty-state-icon">🏷️</div><div class="empty-state-text">Aucun QR Code<br><small>Allez dans "Générer" pour créer vos codes</small></div></div>';

    const byType = { service: [], client: [], espece: [] };
    qrList.forEach(q => { if (byType[q.type]) byType[q.type].push(q); });

    let html = '<div style="display:flex;gap:10px;margin-bottom:14px;padding:8px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:6px;flex-wrap:wrap;">';
    html += '<button class="btn btn-sm btn-outline qr-filter-btn" data-f="all" onclick="QRCodes.filterCards(\'all\')" style="font-weight:700;border-color:var(--primary-color);color:var(--primary-color);">Tous ('+qrList.length+')</button>';
    html += '<button class="btn btn-sm btn-outline qr-filter-btn" data-f="service" onclick="QRCodes.filterCards(\'service\')">🏭 Services ('+byType.service.length+')</button>';
    html += '<button class="btn btn-sm btn-outline qr-filter-btn" data-f="client" onclick="QRCodes.filterCards(\'client\')">👤 Clients ('+byType.client.length+')</button>';
    html += '<button class="btn btn-sm btn-outline qr-filter-btn" data-f="espece" onclick="QRCodes.filterCards(\'espece\')">🐟 Espèces ('+byType.espece.length+')</button>';
    html += '</div>';

    html += '<div id="qrListCards" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;">';
    qrList.forEach(q => { html += this.renderCard(q); });
    html += '</div>';
    return html;
  },

  renderCard(q) {
    const colors = { service: '#f59e0b', client: '#3b82f6', espece: '#10b981' };
    const icons = { service: '🏭', client: '👤', espece: '🐟' };
    const col = colors[q.type] || '#6366f1';
    return `
      <div class="qr-card" data-type="${q.type}" style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;background:var(--bg-secondary);">
        <div style="background:${col};color:white;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:700;">${icons[q.type]||''} ${q.value}${q.espece ? ' — '+q.espece : ''}${q.calibre ? ' — '+q.calibre : ''}</span>
          <span style="background:rgba(255,255,255,0.25);padding:1px 8px;border-radius:10px;font-size:0.68rem;">${q.type.toUpperCase()}</span>
        </div>
        <div style="padding:12px;text-align:center;">
          ${q.imageData ? `<img src="${q.imageData}" width="120" style="border-radius:6px;">` : ''}
          <div style="margin-top:8px;font-size:0.78rem;color:var(--text-muted);">
            ${q.calibre ? `<div style="margin-bottom:4px;"><span class="badge badge-warning" style="background:#f59e0b;color:#fff;font-size:0.72rem;">📏 ${q.calibre}</span></div>` : ''}
            <div>🔒 Clé: <span style="font-family:monospace;color:#6366f1;">${q.uniqueKey}</span></div>
            <div style="margin-top:2px;">${App.formatDateFR(q.createdAt)}</div>
          </div>
        </div>
        <div style="padding:6px 12px;border-top:1px solid var(--border-color);display:flex;gap:6px;justify-content:flex-end;">
          <button class="btn-icon" onclick="QRCodes.useInSaisie(${q.id})" title="Utiliser dans Saisie"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></button>
          <button class="btn-icon danger" onclick="QRCodes.deleteQR(${q.id})" title="Supprimer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
        </div>
      </div>`;
  },

  filterCards(type) {
    document.querySelectorAll('.qr-filter-btn').forEach(b => {
      const active = b.dataset.f === type;
      b.style.fontWeight = active ? '700' : '400';
      b.style.borderColor = active ? 'var(--primary-color)' : '';
      b.style.color = active ? 'var(--primary-color)' : '';
    });
    document.querySelectorAll('.qr-card').forEach(c => {
      c.style.display = (type === 'all' || c.dataset.type === type) ? '' : 'none';
    });
  },

  deleteQR(id) {
    if (!confirm('⚠️ Supprimer ce QR Code ? Cette action est irréversible.')) return;
    App.data.qrCodes = (App.data.qrCodes||[]).filter(q => q.id !== id);
    App.saveData();
    this.render();
    App.toast('QR Code supprimé', 'info');
  },

  useInSaisie(id) {
    const qr = (App.data.qrCodes||[]).find(q => q.id === id);
    if (!qr) return;
    App.navigate('saisie');
    setTimeout(() => {
      Saisie.currentActivite = 'traitement';
      Saisie.render();
      setTimeout(() => {
        Saisie.showTraitementForm();
        setTimeout(() => {
          if (qr.type === 'client') {
            const s = document.getElementById('tClient');
            if (s) s.value = qr.value;
          } else if (qr.type === 'espece') {
            const s = document.getElementById('tEspece');
            if (s) { s.value = qr.value; Saisie.onEspeceChange('tEspece', 'tCalibre'); }
          } else if (qr.type === 'service') {
            const s = document.getElementById('tEspece');
            const c = document.getElementById('tCalibre');
            if (s && qr.espece) {
              s.value = qr.espece;
              Saisie.onEspeceChange('tEspece', 'tCalibre', qr.calibre);
            }
            if (c && qr.calibre) c.value = qr.calibre;
          }
          if (typeof Saisie.refreshQR === 'function') Saisie.refreshQR();
          App.toast(`QR "${qr.value}" appliqué à la saisie`, 'success');
        }, 200);
      }, 100);
    }, 100);
  },

  useInTraitement(id) {
    this.useInSaisie(id);
  },

  // --- API for other modules ---
  getQRForLot(client, espece, calibre = '') {
    const list = App.data.qrCodes || [];
    return list.find(q =>
      (q.type === 'service' && q.value === 'Traitement' && q.espece === espece && (!q.calibre || !calibre || q.calibre === calibre)) ||
      (q.type === 'client' && q.value === client) ||
      (q.type === 'espece' && q.value === espece)
    );
  },

  getQRByService(service) {
    return (App.data.qrCodes || []).find(q => q.type === 'service' && q.value === service);
  }
};
