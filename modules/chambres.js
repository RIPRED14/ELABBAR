/* ============================================
   CHAMBRES — Gestion des Chambres de Stockage
   ============================================ */
const Chambres = {
  getDefaultHistory() {
    return [];
  },

  render() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    if (!App.data.chambresHistory) {
      App.data.chambresHistory = this.getDefaultHistory();
      App.saveData();
    }

    const lastReading = App.data.chambresHistory[App.data.chambresHistory.length - 1] || {};
    const capacity = this.getCapacityStats();
    const inventory = this.getInventoryByChambre();
    const tonCh1 = capacity.chambre1 / 1000;
    const tonCh2 = capacity.chambre2 / 1000;
    const tonEnt = capacity.entreposage / 1000;
    const tonUnassigned = capacity.non_affecte / 1000;
    const invCh1 = inventory.chambre1;
    const invCh2 = inventory.chambre2;
    const invEnt = inventory.entreposage;
    const processing = this.getProcessingInventory();

    content.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div>
            <h2 class="page-title">Plan des Chambres</h2>
            <p class="page-subtitle">Suivi des capacités et de la température</p>
          </div>
          <div style="display:flex; gap:10px;">
            <input type="file" id="chambreTempOcrInput" accept="image/*" capture="environment" style="display:none" onchange="Temperatures.processOCR(event)">
            <button class="btn btn-primary" style="background:#0ea5e9; border-color:#0ea5e9;" onclick="document.getElementById('chambreTempOcrInput').click()">💼 Scanner par IA</button>
            <button class="btn btn-primary" onclick="Chambres.showLogTempModal()">🌡️ Relever Température</button>
          </div>
        </div>

        <!-- Alerte Température -->
        ${this.getTemperatureAlertsHtml(lastReading)}
        ${this.getUnassignedStockHtml(tonUnassigned)}

        <!-- Grille des Chambres -->
        <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:22px;margin-bottom:28px;">
          
          <!-- CHAMBRE 1 -->
          <div class="card" onclick="Chambres.showChambreDetail('chambre1')" style="position:relative;cursor:pointer;">
            <div class="card-header" style="background:var(--gradient-purple);color:white;border-radius:var(--radius-md) var(--radius-md) 0 0;">
              <span class="card-title">❄️ Chambre de Stockage 1</span>
            </div>
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);">Capacité</div>
                  <div style="font-size:1.4rem;font-weight:800;">${tonCh1} <span style="font-size:0.9rem;font-weight:500;color:var(--text-secondary);">/ 400 Tonnes</span></div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.85rem;color:var(--text-muted);">Température</div>
                  ${this.renderTempValue(lastReading.chambre1)}
                </div>
              </div>
              <div class="stock-bar">
                <div class="stock-bar-fill ok" style="width:${Math.min(100, (tonCh1 / 400 * 100))}%; background:var(--gradient-purple);"></div>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
                <span class="badge badge-info">${invCh1.lots.length} lots</span>
                <span class="badge badge-purple">${App.formatNumber(invCh1.caisses,0)} Cs</span>
                <span class="badge badge-ok">${App.formatNumber(invCh1.poids/1000,3)} T net</span>
              </div>
              <div style="margin-top:12px;color:var(--accent-cyan);font-size:0.82rem;font-weight:700;">Cliquer pour voir le contenu</div>
              <div style="height:150px;margin-top:20px;">
                <canvas id="chartCh1"></canvas>
              </div>
            </div>
          </div>

          <!-- CHAMBRE 2 -->
          <div class="card" onclick="Chambres.showChambreDetail('chambre2')" style="position:relative;cursor:pointer;">
            <div class="card-header" style="background:var(--gradient-blue);color:white;border-radius:var(--radius-md) var(--radius-md) 0 0;">
              <span class="card-title">❄️ Chambre de Stockage 2</span>
            </div>
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);">Capacité</div>
                  <div style="font-size:1.4rem;font-weight:800;">${tonCh2} <span style="font-size:0.9rem;font-weight:500;color:var(--text-secondary);">/ 400 Tonnes</span></div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.85rem;color:var(--text-muted);">Température</div>
                  ${this.renderTempValue(lastReading.chambre2)}
                </div>
              </div>
              <div class="stock-bar">
                <div class="stock-bar-fill ok" style="width:${Math.min(100, (tonCh2 / 400 * 100))}%; background:var(--gradient-blue);"></div>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
                <span class="badge badge-info">${invCh2.lots.length} lots</span>
                <span class="badge badge-purple">${App.formatNumber(invCh2.caisses,0)} Cs</span>
                <span class="badge badge-ok">${App.formatNumber(invCh2.poids/1000,3)} T net</span>
              </div>
              <div style="margin-top:12px;color:var(--accent-cyan);font-size:0.82rem;font-weight:700;">Cliquer pour voir le contenu</div>
              <div style="height:150px;margin-top:20px;">
                <canvas id="chartCh2"></canvas>
              </div>
            </div>
          </div>

          <!-- ENTREPOSAGE -->
          <div class="card" onclick="Chambres.showChambreDetail('entreposage')" style="position:relative;cursor:pointer;">
            <div class="card-header" style="background:var(--gradient-green);color:white;border-radius:var(--radius-md) var(--radius-md) 0 0;">
              <span class="card-title">📦 Entreposage</span>
            </div>
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);">Capacité</div>
                  <div style="font-size:1.4rem;font-weight:800;">${tonEnt} <span style="font-size:0.9rem;font-weight:500;color:var(--text-secondary);">/ 500 Tonnes</span></div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:0.85rem;color:var(--text-muted);">Température</div>
                  ${this.renderTempValue(lastReading.entreposage)}
                </div>
              </div>
              <div class="stock-bar">
                <div class="stock-bar-fill ok" style="width:${Math.min(100, (tonEnt / 500 * 100))}%; background:var(--gradient-green);"></div>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
                <span class="badge badge-info">${invEnt.lots.length} lots</span>
                <span class="badge badge-purple">${App.formatNumber(invEnt.caisses,0)} Cs</span>
                <span class="badge badge-ok">${App.formatNumber(invEnt.poids/1000,3)} T net</span>
              </div>
              <div style="margin-top:12px;color:var(--accent-cyan);font-size:0.82rem;font-weight:700;">Cliquer pour voir le contenu</div>
              <div style="height:150px;margin-top:20px;">
                <canvas id="chartEnt"></canvas>
              </div>
            </div>
          </div>

          <!-- SALLE DE TRAITEMENT -->
          <div class="card" onclick="Chambres.showProcessingDetail()" style="position:relative;cursor:pointer;">
            <div class="card-header" style="background:var(--gradient-red);color:white;border-radius:var(--radius-md) var(--radius-md) 0 0;">
              <span class="card-title">🔧 Salle de Traitement</span>
            </div>
            <div class="card-body">
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);">Lots en cours</div>
                  <div style="font-size:1.4rem;font-weight:800;">${processing.items.length}</div>
                </div>
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);">Caisses PI</div>
                  <div style="font-size:1.4rem;font-weight:800;">${App.formatNumber(processing.caisses,0)}</div>
                </div>
                <div>
                  <div style="font-size:0.85rem;color:var(--text-muted);">Poids MP/PI</div>
                  <div style="font-size:1.4rem;font-weight:800;">${App.formatNumber(processing.poids,2)} <span style="font-size:0.9rem;font-weight:500;color:var(--text-secondary);">kg</span></div>
                </div>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">
                <span class="badge badge-warning">Traitement: ${processing.traitement.count}</span>
                <span class="badge badge-info">Reconditionnement: ${processing.reconditionnement.count}</span>
              </div>
              <div style="background:rgba(15,23,42,0.35);border:1px solid var(--border-color);border-radius:8px;padding:12px;min-height:88px;">
                ${processing.items.length === 0 ? `
                  <div style="color:var(--text-muted);text-align:center;padding:16px 0;">Aucun lot en traitement ou reconditionnement</div>
                ` : processing.items.slice(0, 3).map(item => `
                  <div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid rgba(148,163,184,0.12);">
                    <div>
                      <strong>${item.espece}</strong> <span style="color:var(--text-muted);font-size:0.8rem;">${item.calibre}</span><br>
                      <span style="font-size:0.76rem;color:var(--text-muted);">${item.client} - ${item.label}</span>
                    </div>
                    <div style="text-align:right;font-weight:800;color:var(--accent-cyan);">${App.formatNumber(item.caisses,0)} Cs<br><span style="font-size:0.76rem;">${App.formatNumber(item.poids,2)} kg</span></div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:12px;color:var(--accent-cyan);font-size:0.82rem;font-weight:700;">Cliquer pour voir tous les lots en cours</div>
            </div>
          </div>

        </div>
      </div>
    `;

    this.renderCharts();
  },

  getTemperatureAlertsHtml(reading) {
    const alerts = [];
    if (typeof reading.chambre1 === 'number' && reading.chambre1 > -14) alerts.push(`Chambre 1 (${reading.chambre1}°C)`);
    if (typeof reading.chambre2 === 'number' && reading.chambre2 > -14) alerts.push(`Chambre 2 (${reading.chambre2}°C)`);
    if (typeof reading.entreposage === 'number' && reading.entreposage > -14) alerts.push(`Entreposage (${reading.entreposage}°C)`);

    if (alerts.length === 0) return '';

    return `
      <div class="alerts-banner" style="animation: pulse-bar 2s infinite; background:rgba(239,68,68,0.15); border-color:var(--accent-red);">
        <span class="alerts-banner-icon">⚠️</span>
        <div class="alerts-banner-text" style="color:var(--text-primary)">
          <strong>ALERTE TEMPÉRATURE :</strong> La température dépasse la norme (-14°C) dans : <strong>${alerts.join(', ')}</strong>
        </div>
      </div>
    `;
  },

  renderTempValue(value) {
    if (typeof value !== 'number') {
      return `<div style="font-size:1.8rem;font-weight:800;color:var(--text-muted);">-- °C</div>`;
    }
    return `
      <div style="font-size:1.8rem;font-weight:800;color:${value > -14 ? 'var(--accent-red)' : 'var(--accent-cyan)'};">
        ${value}°C
      </div>
    `;
  },

  getUnassignedStockHtml(tonUnassigned) {
    if (tonUnassigned <= 0) return '';
    return `
      <div class="alerts-banner warning">
        <span class="alerts-banner-icon">📦</span>
        <div class="alerts-banner-text">
          <strong>Stock non affecté :</strong> ${App.formatNumber(tonUnassigned, 2)} tonnes ne sont pas encore rattachées à une chambre.
        </div>
      </div>
    `;
  },

  getCapacityStats() {
    const stats = { chambre1: 0, chambre2: 0, entreposage: 0, non_affecte: 0 };
    (App.data.stockage || []).forEach(entry => {
      (entry.lignes || []).forEach((line, idx) => {
        const emplacement = line.chambre && stats[line.chambre] !== undefined ? line.chambre : 'non_affecte';
        const available = typeof Stockage !== 'undefined' && Stockage.getLineAvailable
          ? Stockage.getLineAvailable(entry, idx)
          : { poids: line.pdsNetTotal || 0 };
        stats[emplacement] += Math.max(0, available.poids || 0);
      });
    });
    return stats;
  },

  getInventoryByChambre() {
    const inventory = {
      chambre1: { lots: [], caisses: 0, poids: 0 },
      chambre2: { lots: [], caisses: 0, poids: 0 },
      entreposage: { lots: [], caisses: 0, poids: 0 },
      non_affecte: { lots: [], caisses: 0, poids: 0 }
    };

    (App.data.stockage || []).forEach(entry => {
      (entry.lignes || []).forEach((line, idx) => {
        const chambre = line.chambre && inventory[line.chambre] ? line.chambre : 'non_affecte';
        const available = typeof Stockage !== 'undefined' && Stockage.getLineAvailable
          ? Stockage.getLineAvailable(entry, idx)
          : { quantite: line.nbCaisses || 0, poids: line.pdsNetTotal || 0 };

        if ((available.quantite || 0) <= 0 && (available.poids || 0) <= 0) return;

        const lot = {
          recId: entry.id,
          lineIdx: idx,
          reference: entry.reference,
          date: entry.dateEntree,
          client: entry.client || '-',
          fournisseur: entry.fournisseur || '-',
          bateau: entry.bateau || line.bateau || '-',
          palette: line.palette || '-',
          espece: line.espece || '-',
          calibre: line.calibre || '-',
          emballage: line.emballage || 'Cs',
          caissesInitiales: line.nbCaisses || 0,
          poidsInitial: line.pdsNetTotal || 0,
          caisses: available.quantite || 0,
          poids: available.poids || 0,
          sortiesCaisses: available.usedQty || 0,
          sortiesPoids: available.usedWeight || 0
        };

        inventory[chambre].lots.push(lot);
        inventory[chambre].caisses += lot.caisses;
        inventory[chambre].poids += lot.poids;
      });
    });

    Object.values(inventory).forEach(group => {
      group.lots.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return inventory;
  },

  getChambreLabel(chambre) {
    const labels = {
      chambre1: 'Chambre de Stockage 1',
      chambre2: 'Chambre de Stockage 2',
      entreposage: 'Entreposage',
      non_affecte: 'Stock non affecté'
    };
    return labels[chambre] || chambre;
  },

  showChambreDetail(chambre) {
    const inventory = this.getInventoryByChambre();
    const group = inventory[chambre] || { lots: [], caisses: 0, poids: 0 };
    const label = this.getChambreLabel(chambre);

    const body = group.lots.length === 0 ? `
      <div class="empty-state" style="padding:34px;">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">Aucun stock disponible dans cette chambre</div>
      </div>
    ` : `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
        <div class="kpi-card blue" style="padding:14px;"><div class="kpi-label">Lots</div><div class="kpi-value" style="font-size:1.5rem;">${group.lots.length}</div></div>
        <div class="kpi-card purple" style="padding:14px;"><div class="kpi-label">Caisses disponibles</div><div class="kpi-value" style="font-size:1.5rem;">${App.formatNumber(group.caisses,0)}</div></div>
        <div class="kpi-card green" style="padding:14px;"><div class="kpi-label">Poids net disponible</div><div class="kpi-value" style="font-size:1.5rem;">${App.formatNumber(group.poids,2)}<span class="kpi-unit">kg</span></div></div>
      </div>
      <div class="table-container" style="max-height:55vh;overflow:auto;">
        <table class="table-hover">
          <thead>
            <tr>
              <th>Lot</th>
              <th>Palette</th>
              <th>Client</th>
              <th>Produit</th>
              <th class="td-right">Reçu</th>
              <th class="td-right">Sorti</th>
              <th class="td-right">Disponible</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${group.lots.map(lot => `
              <tr>
                <td><span class="badge badge-purple">${lot.reference}</span><br><span style="font-size:0.72rem;color:var(--text-muted);">${App.formatDateFR(lot.date)}</span></td>
                <td style="max-width:220px;font-size:0.72rem;color:var(--accent-cyan);font-weight:700;word-break:break-word;">${lot.palette}</td>
                <td>${lot.client}</td>
                <td><span class="badge badge-info">${lot.espece}</span><br><strong>${lot.calibre}</strong></td>
                <td class="td-right">${App.formatNumber(lot.caissesInitiales,0)} Cs<br><span style="font-size:0.72rem;color:var(--text-muted);">${App.formatNumber(lot.poidsInitial,2)} kg</span></td>
                <td class="td-right">${App.formatNumber(lot.sortiesCaisses,0)} Cs<br><span style="font-size:0.72rem;color:var(--text-muted);">${App.formatNumber(lot.sortiesPoids,2)} kg</span></td>
                <td class="td-right td-bold">${App.formatNumber(lot.caisses,0)} Cs<br><span style="font-size:0.72rem;color:var(--accent-green);">${App.formatNumber(lot.poids,2)} kg</span></td>
                <td><button class="btn btn-sm btn-primary" onclick="App.closeModal(); App.navigate('stockage'); Stockage.switchTab('mouvements'); setTimeout(() => Stockage.traceLot(${lot.recId}, ${lot.lineIdx}), 80);">Tracer</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    App.showModal(`📦 Contenu - ${label}`, body, `
      <button class="btn btn-outline" onclick="App.closeModal()">Fermer</button>
    `);
  },

  getProcessingInventory() {
    const items = (App.data.production || [])
      .filter(p => ['traitement', 'reconditionnement'].includes(p.activite || 'reconditionnement'))
      .map(p => {
        const activite = p.activite || 'reconditionnement';
        const sortie = (App.data.sortiesStockage || []).find(s => s.id === p.sourceSortieId);
        const poids = activite === 'traitement'
          ? (p.poidsMP || sortie?.poidsSorti || 0)
          : (p.poidsBrutPI || sortie?.poidsSorti || 0);
        const caisses = p.caissesPI || sortie?.quantite || 0;
        const poidsPF = p.poidsBrutPF || p.poidsPF || 0;
        const isDone = poidsPF > 0 && poidsPF >= Math.max(1, poids * 0.95);
        return {
          id: p.id,
          activite,
          label: activite === 'traitement' ? 'Traitement' : 'Reconditionnement',
          date: p.date,
          client: p.client || sortie?.client || '-',
          lotRef: sortie?.lotRef || p.receptionId || '-',
          sourceSortieId: p.sourceSortieId || null,
          espece: p.espece || '-',
          calibre: p.calibre || '-',
          caisses,
          poids,
          poidsPF,
          rendement: p.rendement || (poids > 0 && poidsPF > 0 ? poidsPF / poids * 100 : 0),
          isDone
        };
      })
      .filter(item => !item.isDone)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const totals = {
      items,
      caisses: items.reduce((s, item) => s + (item.caisses || 0), 0),
      poids: items.reduce((s, item) => s + (item.poids || 0), 0),
      traitement: {
        count: items.filter(item => item.activite === 'traitement').length,
        poids: items.filter(item => item.activite === 'traitement').reduce((s, item) => s + (item.poids || 0), 0)
      },
      reconditionnement: {
        count: items.filter(item => item.activite === 'reconditionnement').length,
        poids: items.filter(item => item.activite === 'reconditionnement').reduce((s, item) => s + (item.poids || 0), 0)
      }
    };
    return totals;
  },

  showProcessingDetail() {
    const processing = this.getProcessingInventory();
    const body = processing.items.length === 0 ? `
      <div class="empty-state" style="padding:34px;">
        <div class="empty-state-icon">🏭</div>
        <div class="empty-state-text">Aucun lot en traitement ou reconditionnement</div>
      </div>
    ` : `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
        <div class="kpi-card orange" style="padding:14px;"><div class="kpi-label">Lots en cours</div><div class="kpi-value" style="font-size:1.5rem;">${processing.items.length}</div></div>
        <div class="kpi-card purple" style="padding:14px;"><div class="kpi-label">Caisses PI</div><div class="kpi-value" style="font-size:1.5rem;">${App.formatNumber(processing.caisses,0)}</div></div>
        <div class="kpi-card green" style="padding:14px;"><div class="kpi-label">Poids MP/PI</div><div class="kpi-value" style="font-size:1.5rem;">${App.formatNumber(processing.poids,2)}<span class="kpi-unit">kg</span></div></div>
        <div class="kpi-card blue" style="padding:14px;"><div class="kpi-label">Activités</div><div class="kpi-value" style="font-size:1.1rem;">${processing.traitement.count} T / ${processing.reconditionnement.count} R</div></div>
      </div>
      <div class="table-container" style="max-height:55vh;overflow:auto;">
        <table class="table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Activité</th>
              <th>Lot source</th>
              <th>Client</th>
              <th>Produit</th>
              <th class="td-right">Caisses</th>
              <th class="td-right">Poids entrée</th>
              <th class="td-right">PF saisi</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${processing.items.map(item => `
              <tr>
                <td>${App.formatDateFR(item.date)}</td>
                <td><span class="badge ${item.activite === 'traitement' ? 'badge-warning' : 'badge-info'}">${item.label}</span></td>
                <td><span class="badge badge-purple">${item.lotRef}</span></td>
                <td>${item.client}</td>
                <td><strong>${item.espece}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${item.calibre}</span></td>
                <td class="td-right td-bold">${App.formatNumber(item.caisses,0)} Cs</td>
                <td class="td-right">${App.formatNumber(item.poids,2)} kg</td>
                <td class="td-right">${item.poidsPF ? App.formatNumber(item.poidsPF,2) + ' kg' : '-'}</td>
                <td><button class="btn btn-sm btn-primary" onclick="App.closeModal(); App.navigate('saisie'); Saisie.currentActivite='${item.activite}'; Saisie.render(); setTimeout(() => Saisie.editEntry(${item.id}), 80);">Ouvrir</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    App.showModal('🏭 Salle de Traitement - Lots en cours', body, `
      <button class="btn btn-outline" onclick="App.closeModal()">Fermer</button>
    `);
  },

  renderCharts() {
    App.destroyCharts();
    const history = App.data.chambresHistory || [];
    if (history.length === 0) return;
    const labels = history.map(h => App.formatDateFR(h.date));

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
        y: { 
          ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 1 }, 
          grid: { color: 'rgba(148,163,184,0.05)' },
          suggestedMin: -20,
          suggestedMax: -10
        }
      }
    };

    // Chart Ch1
    new Chart(document.getElementById('chartCh1'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Chambre 1 (°C)',
          data: history.map(h => h.chambre1),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3
        }]
      },
      options: options
    });

    // Chart Ch2
    new Chart(document.getElementById('chartCh2'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Chambre 2 (°C)',
          data: history.map(h => h.chambre2),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3
        }]
      },
      options: options
    });

    // Chart Ent
    new Chart(document.getElementById('chartEnt'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Entreposage (°C)',
          data: history.map(h => h.entreposage),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3
        }]
      },
      options: options
    });
  },

  showLogTempModal() {
    const history = App.data.chambresHistory || [];
    const last = history[history.length - 1] || {};
    
    App.showModal('🌡️ Relever Températures', `
      <div class="form-grid" style="grid-template-columns:1fr;">
        <div class="form-group">
          <label class="form-label">Date du relevé</label>
          <input type="date" class="form-input" id="logTempDate" value="${App.formatDate(new Date())}">
        </div>
        <div class="form-group">
          <label class="form-label">Température Chambre 1 (°C) *</label>
          <input type="number" step="0.1" class="form-input" id="logTempCh1" value="${typeof last.chambre1 === 'number' ? last.chambre1 : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Température Chambre 2 (°C) *</label>
          <input type="number" step="0.1" class="form-input" id="logTempCh2" value="${typeof last.chambre2 === 'number' ? last.chambre2 : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Température Entreposage (°C) *</label>
          <input type="number" step="0.1" class="form-input" id="logTempEnt" value="${typeof last.entreposage === 'number' ? last.entreposage : ''}">
        </div>
      </div>
    `, `
      <button class="btn btn-outline" onclick="App.closeModal()">Annuler</button>
      <button class="btn btn-primary" onclick="Chambres.saveTempReading()">💾 Enregistrer</button>
    `);
  },

  saveTempReading() {
    const date = document.getElementById('logTempDate').value;
    const ch1 = parseFloat(document.getElementById('logTempCh1').value);
    const ch2 = parseFloat(document.getElementById('logTempCh2').value);
    const ent = parseFloat(document.getElementById('logTempEnt').value);

    if (!date || isNaN(ch1) || isNaN(ch2) || isNaN(ent)) {
      App.toast('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (!App.data.chambresHistory) App.data.chambresHistory = [];

    // Check if date already exists, update or push
    const existingIdx = App.data.chambresHistory.findIndex(h => h.date === date);
    if (existingIdx >= 0) {
      App.data.chambresHistory[existingIdx] = { date, chambre1: ch1, chambre2: ch2, entreposage: ent };
    } else {
      App.data.chambresHistory.push({ date, chambre1: ch1, chambre2: ch2, entreposage: ent });
      // Keep last 30 readings
      if (App.data.chambresHistory.length > 30) {
        App.data.chambresHistory.shift();
      }
    }

    App.saveData();
    App.closeModal();
    this.render();
    App.toast('Températures enregistrées', 'success');
  }
};
