/* ============================================
   RAPPORTS — Génération automatique
   ============================================ */
const Rapports = {
  render() {
    const content = document.getElementById('pageContent');
    const now = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ value: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) });
    }

    content.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;">
          <div><h2 class="page-title">Rapports Mensuels</h2><p class="page-subtitle">Génération automatique des rapports de performance</p></div>
          <div style="display:flex;gap:8px;align-items:center;">
            <select class="form-select" id="rapportMois" style="width:200px;">${months.map((m,i) => `<option value="${m.value}" ${i===0?'selected':''}>${m.label}</option>`).join('')}</select>
            <button class="btn btn-primary" onclick="Rapports.generate()">📊 Générer</button>
            <button class="btn btn-success" onclick="Rapports.exportPDF()">📄 Export PDF</button>
          </div>
        </div>
        <div id="rapportContent">
          <div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-text">Sélectionnez un mois et cliquez sur "Générer"</div></div>
        </div>
      </div>
    `;
  },

  getSelectedMonth() {
    const val = document.getElementById('rapportMois').value.split('-');
    return { year: parseInt(val[0]), month: parseInt(val[1]) };
  },

  generate() {
    const { year, month } = this.getSelectedMonth();
    const prod = App.getMonthProduction(year, month);
    const p = App.data.parametres;
    const monthName = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    if (prod.length === 0) {
      document.getElementById('rapportContent').innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">Aucune donnée pour ce mois</div></div>';
      return;
    }

    const totalPoidsPF = prod.reduce((s, p) => s + (p.poidsBrutPF || 0), 0);
    const totalCoutMOO = prod.reduce((s, p) => s + (p.coutMOO || 0), 0);
    const totalCoutMOF = prod.reduce((s, p) => s + (p.coutPersonnelF || 0), 0);
    const totalHeuresOcc = prod.reduce((s, p) => s + (p.heuresMOO || 0), 0);
    const totalHeuresF = prod.reduce((s, p) => s + (p.heuresMOF || 0), 0);
    const totalHeures = totalHeuresOcc + totalHeuresF;
    const totalCoutMO = totalCoutMOO + totalCoutMOF;
    const totalCarton = prod.reduce((s, p) => s + (p.coutCarton || 0), 0);
    const totalSachet = prod.reduce((s, p) => s + (p.coutSachet || 0), 0);
    const totalEtiqNoir = prod.reduce((s, p) => s + (p.coutEtiquetteNoir || 0), 0);
    const totalEtiq5075 = prod.reduce((s, p) => s + (p.coutEtiquette5075 || 0), 0);
    const totalScotch = prod.reduce((s, p) => s + (p.coutScotch || 0), 0);
    const totalEmballage = totalCarton + totalSachet + totalEtiqNoir + totalEtiq5075 + totalScotch;

    const salaireQualite = p.salaireQualite || 9000;
    const salaireAdmin = p.salaireAdmin || 25000;
    const salaireLogistique = p.coutPersonnelLogistique || 4000;
    const salaireProdFixe = App.data.personnel.filter(e => e.dept === 'Production').reduce((s, e) => s + e.salaire, 0);
    const totalMasseSalariale = totalCoutMOO + salaireProdFixe + salaireQualite + salaireLogistique + salaireAdmin;

    const productivite = totalHeures > 0 ? totalPoidsPF / totalHeures : 0;
    const coutMOParKg = totalPoidsPF > 0 ? totalCoutMO / totalPoidsPF : 0;
    const coutEmballageParKg = totalPoidsPF > 0 ? totalEmballage / totalPoidsPF : 0;

    const facture = Energie.calcFacture(year, month);
    const coutEnergieParKg = totalPoidsPF > 0 ? facture / totalPoidsPF : 0;
    const coutLogistique = (p.coutCarburant || 300) + 1101.34 + salaireLogistique;
    const coutLogParKg = totalPoidsPF > 0 ? coutLogistique / totalPoidsPF : 0;
    const coutDirectParKg = coutMOParKg + coutEmballageParKg + coutEnergieParKg + coutLogParKg;

    // Mid-month split
    const mid = new Date(year, month, 16);
    const p1 = prod.filter(e => new Date(e.date) < mid);
    const p2 = prod.filter(e => new Date(e.date) >= mid);
    const h1 = p1.reduce((s, e) => s + (e.heuresMOO || 0) + (e.heuresMOF || 0), 0);
    const h2 = p2.reduce((s, e) => s + (e.heuresMOO || 0) + (e.heuresMOF || 0), 0);
    const q1 = p1.reduce((s, e) => s + (e.poidsBrutPF || 0), 0);
    const q2 = p2.reduce((s, e) => s + (e.poidsBrutPF || 0), 0);
    const pr1 = h1 > 0 ? q1 / h1 : 0;
    const pr2 = h2 > 0 ? q2 / h2 : 0;

    // Nbr consommables
    const nCartons = prod.reduce((s, p) => s + (p.nbCartons || 0), 0);
    const nSachetsKg = prod.reduce((s, p) => s + (p.sachetsKg || 0), 0);
    const nEtiqNoir = prod.reduce((s, p) => s + (p.nbEtiqNoir || 0), 0);
    const nEtiq5075 = prod.reduce((s, p) => s + (p.nbEtiq5075 || 0), 0);
    const nScotch = prod.reduce((s, p) => s + (p.nbScotch || 0), 0);

    document.getElementById('rapportContent').innerHTML = `
      <div class="card slide-up" style="margin-bottom:18px;">
        <div class="card-header" style="background:var(--gradient-purple);border-radius:var(--radius-md) var(--radius-md) 0 0;">
          <span class="card-title" style="color:white;font-size:1.2rem;">📊 RAPPORT ${monthName.toUpperCase()} — ANALYSE DES PERFORMANCES</span>
        </div>
        <div class="card-body">

          <h3 style="margin:20px 0 14px;color:var(--accent-purple-light);">1. COÛTS DE PERSONNEL</h3>
          <table><thead><tr><th>Poste</th><th class="td-right">M.O. Occ. (DH)</th><th class="td-right">M.O. Fixe (DH)</th><th class="td-right">Total (DH)</th></tr></thead>
          <tbody>
            <tr><td>Production</td><td class="td-right">${App.formatNumber(totalCoutMOO,0)}</td><td class="td-right">${App.formatNumber(salaireProdFixe,0)}</td><td class="td-right td-bold">${App.formatNumber(totalCoutMOO+salaireProdFixe,0)}</td></tr>
            <tr><td>Qualité</td><td class="td-right">0</td><td class="td-right">${App.formatNumber(salaireQualite,0)}</td><td class="td-right td-bold">${App.formatNumber(salaireQualite,0)}</td></tr>
            <tr><td>Logistique</td><td class="td-right">0</td><td class="td-right">${App.formatNumber(salaireLogistique,0)}</td><td class="td-right td-bold">${App.formatNumber(salaireLogistique,0)}</td></tr>
            <tr><td>Administration</td><td class="td-right">0</td><td class="td-right">${App.formatNumber(salaireAdmin,0)}</td><td class="td-right td-bold">${App.formatNumber(salaireAdmin,0)}</td></tr>
            <tr style="background:rgba(99,102,241,0.1);"><td class="td-bold">TOTAL</td><td class="td-right td-bold">${App.formatNumber(totalCoutMOO,0)}</td><td class="td-right td-bold">${App.formatNumber(salaireProdFixe+salaireQualite+salaireLogistique+salaireAdmin,0)}</td><td class="td-right td-bold">${App.formatNumber(totalMasseSalariale,0)}</td></tr>
          </tbody></table>
          <p style="margin-top:10px;color:var(--text-secondary);">• Part M.O. variable : <strong>${App.formatNumber(totalMasseSalariale>0?totalCoutMOO/totalMasseSalariale*100:0,1)}%</strong> | Coût M.O./kg : <strong>${App.formatNumber(coutMOParKg,2)} DH</strong></p>

          <h3 style="margin:30px 0 14px;color:var(--accent-purple-light);">2. ANALYSE DE LA PRODUCTIVITÉ</h3>
          <table><thead><tr><th>Période</th><th class="td-right">Heures M.O.</th><th class="td-right">Qté traitée (kg)</th><th class="td-right">Productivité (kg/h)</th></tr></thead>
          <tbody>
            <tr><td>01-15</td><td class="td-right">${App.formatNumber(h1,1)}</td><td class="td-right">${App.formatNumber(q1,1)}</td><td class="td-right td-bold">${App.formatNumber(pr1,2)}</td></tr>
            <tr><td>16-31</td><td class="td-right">${App.formatNumber(h2,1)}</td><td class="td-right">${App.formatNumber(q2,1)}</td><td class="td-right td-bold">${App.formatNumber(pr2,2)}</td></tr>
            <tr style="background:rgba(99,102,241,0.1);"><td class="td-bold">Total</td><td class="td-right td-bold">${App.formatNumber(totalHeures,1)}</td><td class="td-right td-bold">${App.formatNumber(totalPoidsPF,1)}</td><td class="td-right td-bold">${App.formatNumber(productivite,2)}</td></tr>
          </tbody></table>
          <p style="margin-top:10px;color:var(--text-secondary);">• Évolution : <strong style="color:${pr2>=pr1?'var(--accent-green)':'var(--accent-red)'}">${pr1>0?App.formatNumber((pr2-pr1)/pr1*100,1):'N/A'}%</strong></p>

          <h3 style="margin:30px 0 14px;color:var(--accent-purple-light);">3. COÛTS D'EMBALLAGE</h3>
          <table><thead><tr><th>Produit</th><th class="td-right">Quantité</th><th class="td-right">P.U. (DH)</th><th class="td-right">Montant (DH)</th></tr></thead>
          <tbody>
            <tr><td>Carton</td><td class="td-right">${nCartons}</td><td class="td-right">11,64</td><td class="td-right">${App.formatNumber(totalCarton,0)}</td></tr>
            <tr><td>Sachets</td><td class="td-right">${App.formatNumber(nSachetsKg,0)} kg</td><td class="td-right">24,00</td><td class="td-right">${App.formatNumber(totalSachet,0)}</td></tr>
            <tr><td>Étiquette Noir</td><td class="td-right">${nEtiqNoir}</td><td class="td-right">78,00</td><td class="td-right">${App.formatNumber(totalEtiqNoir,0)}</td></tr>
            <tr><td>Étiquette 50×75</td><td class="td-right">${nEtiq5075}</td><td class="td-right">45,00</td><td class="td-right">${App.formatNumber(totalEtiq5075,0)}</td></tr>
            <tr><td>Scotch</td><td class="td-right">${nScotch}</td><td class="td-right">10,80</td><td class="td-right">${App.formatNumber(totalScotch,0)}</td></tr>
            <tr style="background:rgba(99,102,241,0.1);"><td colspan="3" class="td-bold">Total</td><td class="td-right td-bold">${App.formatNumber(totalEmballage,0)}</td></tr>
          </tbody></table>
          <p style="margin-top:10px;color:var(--text-secondary);">• Coût emballage/kg : <strong>${App.formatNumber(coutEmballageParKg,2)} DH</strong></p>

          <h3 style="margin:30px 0 14px;color:var(--accent-purple-light);">4. SYNTHÈSE GLOBALE</h3>
          <div class="summary-box">
            <div class="summary-row"><span class="summary-label">Production totale</span><span class="summary-value">${App.formatNumber(totalPoidsPF,0)} kg</span></div>
            <div class="summary-row"><span class="summary-label">Coût main-d'œuvre / kg</span><span class="summary-value">${App.formatNumber(coutMOParKg,2)} DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût emballage / kg</span><span class="summary-value">${App.formatNumber(coutEmballageParKg,2)} DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût énergie / kg</span><span class="summary-value">${App.formatNumber(coutEnergieParKg,2)} DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût logistique / kg</span><span class="summary-value">${App.formatNumber(coutLogParKg,2)} DH</span></div>
            <div class="summary-row"><span class="summary-label">Coût direct total / kg</span><span class="summary-value summary-total">${App.formatNumber(coutDirectParKg,2)} DH</span></div>
          </div>
        </div>
      </div>
    `;
  },

  exportPDF() {
    const { year, month } = this.getSelectedMonth();
    const prod = App.getMonthProduction(year, month);
    if (prod.length === 0) { App.toast('Aucune donnée pour ce mois', 'error'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const monthName = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const stripAccents = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    doc.setFontSize(18);
    doc.setTextColor(99, 102, 241);
    doc.text(stripAccents(`RAPPORT ${monthName.toUpperCase()}`), 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(stripAccents('Analyse des Performances — Station de Conditionnement'), 14, 28);

    // Calculate stats
    const totalPoidsPF = prod.reduce((s, p) => s + (p.poidsBrutPF || 0), 0);
    const totalCoutMOO = prod.reduce((s, p) => s + (p.coutMOO || 0), 0);
    const totalCoutMOF = prod.reduce((s, p) => s + (p.coutPersonnelF || 0), 0);
    const totalHeures = prod.reduce((s, p) => s + (p.heuresMOO || 0) + (p.heuresMOF || 0), 0);
    const totalEmballage = prod.reduce((s, p) => s + (p.coutCarton||0) + (p.coutSachet||0) + (p.coutEtiquetteNoir||0) + (p.coutEtiquette5075||0) + (p.coutScotch||0), 0);

    let y = 40;
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(stripAccents('Synthese Globale'), 14, y);
    y += 8;

    doc.autoTable({
      startY: y,
      head: [['Indicateur', 'Valeur']],
      body: [
        [stripAccents('Production totale'), `${totalPoidsPF.toFixed(0)} kg`],
        [stripAccents('Heures M.O. totales'), `${totalHeures.toFixed(1)} h`],
        [stripAccents('Productivite'), `${(totalHeures>0?totalPoidsPF/totalHeures:0).toFixed(2)} kg/h`],
        [stripAccents('Cout M.O. total'), `${(totalCoutMOO+totalCoutMOF).toFixed(0)} DH`],
        [stripAccents('Cout Emballage total'), `${totalEmballage.toFixed(0)} DH`],
        [stripAccents('Cout M.O./kg'), `${(totalPoidsPF>0?(totalCoutMOO+totalCoutMOF)/totalPoidsPF:0).toFixed(2)} DH`],
        [stripAccents('Cout Emballage/kg'), `${(totalPoidsPF>0?totalEmballage/totalPoidsPF:0).toFixed(2)} DH`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save(`rapport_${monthName.replace(' ', '_')}.pdf`);
    App.toast('PDF exporté avec succès', 'success');
  }
};
