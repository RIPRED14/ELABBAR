/* ============================================
   APP.JS — Module Principal
   ============================================ */

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Erreur globale:', message, source, lineno);
  if (typeof App !== 'undefined' && App.toast) {
    App.toast('Erreur système: ' + message, 'error');
  }
  return false;
};
window.addEventListener('unhandledrejection', function(event) {
  console.error('Promise rejetée:', event.reason);
  if (typeof App !== 'undefined' && App.toast) {
    App.toast('Erreur async: ' + (event.reason?.message || event.reason), 'error');
  }
});

const App = {
  currentPage: 'dashboard',
  data: {},

  // --- Default Data ---
  defaults: {
    personnel: [
      { id: 1, nom: 'BOUCHALA', prenom: 'Ilham', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 2, nom: 'BOUHRAM', prenom: 'MBARKA', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 3, nom: 'FINNA', prenom: 'Fatima', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 4, nom: 'JRARI', prenom: 'Malika', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 5, nom: 'KARDAD', prenom: 'Zohra', poste: 'Production', salaire: 4300, dept: 'Production' },
      { id: 6, nom: 'OUMAST', prenom: 'Fatima', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 7, nom: 'SIDIR', prenom: 'Zahra', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 8, nom: 'ALLIMOURI', prenom: 'BOUCHAIB', poste: 'Production', salaire: 4300, dept: 'Production' },
      { id: 9, nom: 'OUMAST', prenom: 'Khadija', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 10, nom: 'NACHAT', prenom: 'MOHAMMED', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 11, nom: 'DORQUI', prenom: 'MOHAMMED', poste: 'Superviseur', salaire: 6000, dept: 'Production' },
      { id: 12, nom: 'MEJID', prenom: '', poste: 'Production', salaire: 4000, dept: 'Production' },
      { id: 13, nom: 'MFERREK', prenom: 'ACHRAF', poste: 'Production', salaire: 4500, dept: 'Production' },
      { id: 14, nom: 'EL GHARRADI', prenom: 'RATIBA', poste: 'Production', salaire: 4000, dept: 'Production' },
    ],
    consommables: [
      // ── SACHETS (tailles réelles inventaire) ──
      { id: 1, nom: 'SACHET 23x38', unite: 'kg', stock: 160, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 24.00 },
      { id: 2, nom: 'SACHET 25x35', unite: 'kg', stock: 628.8, seuilCritique: 50, seuilAlerte: 100, prixUnitaire: 25.28 },
      { id: 3, nom: 'SACHET 40x40 (1.5KG)', unite: 'kg', stock: 354.9, seuilCritique: 50, seuilAlerte: 100, prixUnitaire: 24.00 },
      { id: 4, nom: 'SACHET 40x50 (2KG)', unite: 'kg', stock: 304, seuilCritique: 50, seuilAlerte: 100, prixUnitaire: 24.00 },
      { id: 5, nom: 'SACHET 77x80', unite: 'kg', stock: 159.9, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 25.20 },
      { id: 6, nom: 'SACHET 40x60', unite: 'kg', stock: 550, seuilCritique: 50, seuilAlerte: 100, prixUnitaire: 24.00 },
      { id: 7, nom: 'SACHET 12x30', unite: 'kg', stock: 150, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 27.60 },
      { id: 8, nom: 'SACHET 14x40', unite: 'kg', stock: 150, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 27.60 },
      { id: 9, nom: 'SACHET 14x50', unite: 'kg', stock: 150, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 27.60 },
      { id: 10, nom: 'SACHET 40x65', unite: 'kg', stock: 150, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 27.60 },
      { id: 11, nom: 'SACHET 6/45x120x80', unite: 'kg', stock: 157.2, seuilCritique: 30, seuilAlerte: 60, prixUnitaire: 25.12 },
      { id: 12, nom: 'SACHET 60*5(16)x80', unite: 'kg', stock: 208.1, seuilCritique: 30, seuilAlerte: 60, prixUnitaire: 25.20 },
      { id: 13, nom: 'SACHET 43x53', unite: 'kg', stock: 174.3, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 24.00 },
      { id: 14, nom: 'SACHET 58x85', unite: 'kg', stock: 164.6, seuilCritique: 20, seuilAlerte: 50, prixUnitaire: 24.00 },
      // ── CARTONS ──
      { id: 15, nom: 'CARTON 12KG', unite: 'pièce', stock: 11372, seuilCritique: 500, seuilAlerte: 1000, prixUnitaire: 11.64 },
      { id: 16, nom: 'CARTON 13KG', unite: 'pièce', stock: 0, seuilCritique: 200, seuilAlerte: 500, prixUnitaire: 12.50 },
      { id: 17, nom: 'CARTON 15KG', unite: 'pièce', stock: 0, seuilCritique: 200, seuilAlerte: 500, prixUnitaire: 14.00 },
      { id: 18, nom: 'CARTON 17KG', unite: 'pièce', stock: 0, seuilCritique: 100, seuilAlerte: 300, prixUnitaire: 15.00 },
      { id: 19, nom: 'CARTON 19KG', unite: 'pièce', stock: 0, seuilCritique: 100, seuilAlerte: 300, prixUnitaire: 16.50 },
      { id: 20, nom: 'CARTON 20KG', unite: 'pièce', stock: 0, seuilCritique: 100, seuilAlerte: 300, prixUnitaire: 18.00 },
      // ── ETIQUETTES ──
      { id: 21, nom: 'ETIQUETTE 50*75', unite: 'pièce', stock: 200, seuilCritique: 20, seuilAlerte: 40, prixUnitaire: 45.00 },
      { id: 22, nom: 'ETIQUETTE NOIR', unite: 'pièce', stock: 100, seuilCritique: 10, seuilAlerte: 20, prixUnitaire: 78.00 },
      // ── EMBALLAGE ──
      { id: 23, nom: 'FILM ETIRABLE', unite: 'rouleau', stock: 40, seuilCritique: 10, seuilAlerte: 20, prixUnitaire: 39.60 },
      { id: 24, nom: 'SCOTCH', unite: 'rouleau', stock: 200, seuilCritique: 30, seuilAlerte: 60, prixUnitaire: 10.80 },
      { id: 25, nom: 'PALETTE', unite: 'pièce', stock: 50, seuilCritique: 5, seuilAlerte: 10, prixUnitaire: 0 },
      // ── INTRANT ──
      { id: 26, nom: 'SEL', unite: 'kg', stock: 500, seuilCritique: 50, seuilAlerte: 100, prixUnitaire: 0.60 },
    ],
    especes: [
        {
            "nom": "ACEDIA",
            "calibres": [
                "ACEDIA",
                "ACEDIA G",
                "ACEDIA M",
                "ACEDIA P"
            ]
        },
        {
            "nom": "ACEDIA KG",
            "calibres": [
                "ACEDIA KG"
            ]
        },
        {
            "nom": "AF-MIX",
            "calibres": [
                "AF-MIX",
                "VARIOS",
                "LEMPRO",
                "RUFO",
                "EMPREUR",
                "AJI",
                "PELUDA"
            ]
        },
        {
            "nom": "ANCHOIS",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "ARANA",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "BAILLA",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "BALISTE",
            "calibres": [
                "SURIMI",
                "SURIMI 5KG"
            ]
        },
        {
            "nom": "BESUGO",
            "calibres": [
                "BESUGO",
                "BESUGO KG",
                "BOGUE"
            ]
        },
        {
            "nom": "BOGUE",
            "calibres": [
                "BOGUE"
            ]
        },
        {
            "nom": "BRECA",
            "calibres": [
                "BRICA"
            ]
        },
        {
            "nom": "BURRO",
            "calibres": [
                "BURRO S/C",
                "BURRO",
                "BURRO R",
                "BURRO RRR",
                "BURRO G",
                "FILET BURRO",
                "BURRO KG",
                "ABADECHE"
            ]
        },
        {
            "nom": "BURRO S/C",
            "calibres": [
                "PALOMA"
            ]
        },
        {
            "nom": "CABEZOTE",
            "calibres": [
                "CABEZOTE"
            ]
        },
        {
            "nom": "CABRETA",
            "calibres": [
                "CABRETA"
            ]
        },
        {
            "nom": "CALAMAR",
            "calibres": [
                "CALAMAR GG",
                "CALAMAR G",
                "CALAMAR M",
                "CALAMAR P",
                "CALAMAR 2P",
                "CALAMAR 3P",
                "CALAMAR MIX"
            ]
        },
        {
            "nom": "CATCHOCHO",
            "calibres": [
                "CATCHOCHO",
                "CATCHOCHO M",
                "CATCHOCHO P"
            ]
        },
        {
            "nom": "CHERNE",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "CHOCO",
            "calibres": [
                "CHOCO GG",
                "CHOCO G",
                "CHOCO M",
                "CHOCO P",
                "CHOCO 2P",
                "CHOCO 3P",
                "CHOCO MIX"
            ]
        },
        {
            "nom": "CHOPA",
            "calibres": [
                "CHOPA"
            ]
        },
        {
            "nom": "CONGRIO",
            "calibres": [
                "CONGRIO S/C",
                "CONGRIO"
            ]
        },
        {
            "nom": "CORVINA",
            "calibres": [
                "CORVINA S/C",
                "CORVINA M",
                "CORVINA G",
                "CORVINA R",
                "CORVINA P",
                "CORVINA F",
                "CORVINA RG",
                "CORVINA RM",
                "CORVINA RP",
                "CORVINA PCS",
                "CORVINA TRANCHE"
            ]
        },
        {
            "nom": "CRABE",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "CREVETTE",
            "calibres": [
                "1/2",
                "2/3",
                "3/4",
                "4/5",
                "5/6",
                "6/7",
                "7/8",
                "8/9",
                "9/10",
                "10/12",
                "12/14",
                "14/16",
                "16/20",
                "20/30",
                "30/40",
                "40/60",
                "60/80",
                "80/UP"
            ]
        },
        {
            "nom": "crevette G/5",
            "calibres": [
                "CREVETTE G/5"
            ]
        },
        {
            "nom": "CROQUETTE",
            "calibres": [
                "BAILLA"
            ]
        },
        {
            "nom": "DENTON",
            "calibres": [
                "DENTON GG",
                "DENTON G",
                "DENTON M",
                "DENTON P",
                "DENTON 2P",
                "DENTON 3P",
                "DENTON 4P",
                "DENTON MIX",
                "DENTON P IQF",
                "DENTON FILET"
            ]
        },
        {
            "nom": "DENTON KG",
            "calibres": [
                "DENTON KG"
            ]
        },
        {
            "nom": "DORADA",
            "calibres": [
                "DORADA GG",
                "DORADA G",
                "DORADA M",
                "DORADA P",
                "DORADA"
            ]
        },
        {
            "nom": "EU-MIX",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "EUR-MIX",
            "calibres": [
                "SOYA",
                "TRIPOT",
                "LEMA"
            ]
        },
        {
            "nom": "FOLA",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "FRITE",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "GABRITA",
            "calibres": [
                "CONGRIO S/C",
                "CONGRIO"
            ]
        },
        {
            "nom": "GALINA",
            "calibres": [
                "GALINA",
                "GALINITA"
            ]
        },
        {
            "nom": "GALLO",
            "calibres": [
                "GALLO",
                "GALLO M",
                "GALLO P",
                "GALLO G",
                "FILET GALLO"
            ]
        },
        {
            "nom": "GAMBAS",
            "calibres": [
                "1/2",
                "2/3",
                "3/4",
                "4/5",
                "5/6",
                "6/7",
                "7/8",
                "8/9",
                "9/10",
                "10/12",
                "12/14",
                "14/16",
                "16/20",
                "20/30",
                "30/40",
                "40/60",
                "60/80",
                "80/UP"
            ]
        },
        {
            "nom": "GAZON",
            "calibres": [
                "GAZON",
                "REQUIN"
            ]
        },
        {
            "nom": "HAMADAY",
            "calibres": [
                "HAMADAY"
            ]
        },
        {
            "nom": "HERRERA",
            "calibres": [
                "HERRERA"
            ]
        },
        {
            "nom": "JUREL",
            "calibres": [
                "JUREL",
                "JUREL G"
            ]
        },
        {
            "nom": "LAMELLE DE CALAMAR",
            "calibres": [
                "ST PIERRE",
                "ST PIERRE S/C",
                "ST PIERRE P",
                "ST PIERRE M",
                "ST PIERRE G",
                "ST PIERRE S/C P",
                "ST PIERRE S/C M",
                "ST PIERRE S/C G"
            ]
        },
        {
            "nom": "LANGOUSTE",
            "calibres": [
                "200/300",
                "300/500",
                "500/1000",
                "1000/2000",
                "2000/3000"
            ]
        },
        {
            "nom": "LENGUADO",
            "calibres": [
                "LENGUADO K",
                "LENGUADO G",
                "LENGUADO M",
                "LENGUADO 2PP",
                "LENGUADO P",
                "LENGUADO 3P",
                "LENGUADO 4P"
            ]
        },
        {
            "nom": "LIRIO",
            "calibres": [
                "LIRIO"
            ]
        },
        {
            "nom": "LONGUE",
            "calibres": [
                "LONGUE P",
                "LONGUE M",
                "LONGUE G",
                "LONGUE K"
            ]
        },
        {
            "nom": "MAQUEREAU",
            "calibres": [
                "PETIT",
                "MOYEN",
                "GROS",
                "MIXTE"
            ]
        },
        {
            "nom": "MERLAN",
            "calibres": [
                "MERLAN"
            ]
        },
        {
            "nom": "MERLUZA",
            "calibres": [
                "MERLUZA",
                "MERLUZA M",
                "MERLUZA P",
                "MERLUZA SC",
                "MERLUZA MIX",
                "MERLUZA GG",
                "MERLUZA G",
                "MERLUZA 00SC",
                "MERLUZA 0SC",
                "MERLUZA X",
                "MERLUZA CC GG",
                "MERLUZA MIX CC",
                "MERLUZA CC G",
                "MERLUZA CC",
                "MERLAN FILET"
            ]
        },
        {
            "nom": "MOSTEL",
            "calibres": [
                "SALMONETE",
                "SALMONETTE G",
                "SALMONETTE M"
            ]
        },
        {
            "nom": "MOULE",
            "calibres": [
                "CHERNE",
                "CHERNE G",
                "CHERNE SC",
                "CHERNE GGG"
            ]
        },
        {
            "nom": "PALOMA",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "PAMPANO",
            "calibres": [
                "PAMPANO"
            ]
        },
        {
            "nom": "PARGO",
            "calibres": [
                "PARGO G",
                "PARGO P",
                "PARGO",
                "PARGO M",
                "PARGO KG",
                "PETIT PAGEOT"
            ]
        },
        {
            "nom": "PASSAMAR",
            "calibres": [
                "CHOCO G",
                "CHOCO M",
                "CHOCO P",
                "CHOCO 2P",
                "CHOCO 3P",
                "CHOCO 4P",
                "CHOCO MIX",
                "CHOCO 2P (2° CLS)",
                "CHOCO MIX (2° CLS)",
                "CHOCO GM",
                "CHOCO MM",
                "CHOCO PM",
                "CHOCO 2PM",
                "CHOCO ROTO"
            ]
        },
        {
            "nom": "PELAGIQUES",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "PELUDA",
            "calibres": [
                "EUR-MIX"
            ]
        },
        {
            "nom": "PESCADILLA",
            "calibres": [
                "TAKO 1",
                "TAKO 2",
                "TAKO 3",
                "TAKO 4",
                "TAKO 5",
                "TAKO 6",
                "TAKO 7",
                "TAKO 8",
                "TAKO 9",
                "TAKO 1 (2° CLS)",
                "TAKO 2 (2° CLS)",
                "TAKO 3 (2° CLS)",
                "TAKO 4 (2° CLS)",
                "TAKO 5 (2° CLS)",
                "TAKO 6 (2° CLS)",
                "TAKO 7 (2° CLS)",
                "TAKO 8 (2° CLS)",
                "TAKO-GG",
                "TAKO-G"
            ]
        },
        {
            "nom": "PINTA ROJA",
            "calibres": [
                "PINTA ROJA"
            ]
        },
        {
            "nom": "POTON",
            "calibres": [
                "GG",
                "G",
                "M",
                "P",
                "2P",
                "3P",
                "4P",
                "MX",
                "TUBE",
                "TENTACULE",
                "COURONNE"
            ]
        },
        {
            "nom": "POULPE",
            "calibres": [
                "TAKO 1",
                "TAKO 2",
                "TAKO 3",
                "TAKO 4",
                "TAKO 5",
                "TAKO 6",
                "TAKO 7",
                "TAKO 8",
                "TAKO 9",
                "TAKO 1 (2° CLS)",
                "TAKO 2 (2° CLS)",
                "TAKO 3 (2° CLS)",
                "TAKO 4 (2° CLS)",
                "TAKO 5 (2° CLS)",
                "TAKO 6 (2° CLS)",
                "TAKO 7 (2° CLS)",
                "TAKO 8 (2° CLS)",
                "TAKO-GG",
                "TAKO-G"
            ]
        },
        {
            "nom": "PULUDA",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "RAPE",
            "calibres": [
                "RAPE",
                "LA LOTTE",
                "FOGO NIGRO"
            ]
        },
        {
            "nom": "RASCASIO",
            "calibres": [
                "RASCASIO",
                "FILET RASCASE"
            ]
        },
        {
            "nom": "RATA",
            "calibres": [
                "RATA S/C",
                "RATA R",
                "RATA P",
                "FILET RATA"
            ]
        },
        {
            "nom": "RAYA",
            "calibres": [
                "RAYA S/C",
                "RAYA R",
                "RAYA G SC",
                "RAYA P SC",
                "RAYA M SC"
            ]
        },
        {
            "nom": "REKODAY",
            "calibres": [
                "REKODAY"
            ]
        },
        {
            "nom": "RENKO",
            "calibres": [
                "RATA S/C",
                "RATA R",
                "RATA P",
                "FILET RATA"
            ]
        },
        {
            "nom": "RONCADOR",
            "calibres": [
                "RONCADOR"
            ]
        },
        {
            "nom": "RONCADOR KG",
            "calibres": [
                "ACEDIA KG"
            ]
        },
        {
            "nom": "ROQUERA",
            "calibres": [
                "ROQUERA",
                "ROQUERA G",
                "ROQUERA M",
                "ROQUERA MIX",
                "ROQUERA GG"
            ]
        },
        {
            "nom": "SABLE",
            "calibres": [
                "SABLE",
                "SABLE TRANCHE"
            ]
        },
        {
            "nom": "SALMONE",
            "calibres": [
                "SALMONE",
                "SALMON S/C"
            ]
        },
        {
            "nom": "SALMONETE",
            "calibres": [
                "SALMONETE",
                "SALMONETTE G",
                "SALMONETTE M",
                "SALMONETTE P",
                "SALMONETTE MIX"
            ]
        },
        {
            "nom": "SAMA PLUMA",
            "calibres": [
                "SAMA PLUMA G",
                "SAMA PLUMA M",
                "SAMA PLUMA GGG",
                "SAMA PLUMA GG"
            ]
        },
        {
            "nom": "SAMPIETRO",
            "calibres": [
                "SAMPIETRO S/C",
                "SAMPIETRO G",
                "SAMPIETRO M",
                "SAMPIETRO P",
                "SAMPIETRO R",
                "SAMPIER P/R",
                "SAMPIER",
                "SAMPIETRO G S/C",
                "SAMPIETRO M S/C",
                "SAMPIETRO P S/C",
                "FILLET SAMPIETRO",
                "SAMPIETRO MIX S/C"
            ]
        },
        {
            "nom": "SARDINE",
            "calibres": [
                "PETIT",
                "MOYEN",
                "GROS",
                "MIXTE"
            ]
        },
        {
            "nom": "SARGO",
            "calibres": [
                "SARGO G",
                "SARGO M",
                "SARGO P",
                "SARGO",
                "SARGO MIX",
                "SARGO PF",
                "SARGO MF",
                "SARGO GF"
            ]
        },
        {
            "nom": "SARGO KG",
            "calibres": [
                "RONCADOR KG"
            ]
        },
        {
            "nom": "SAUMON",
            "calibres": [
                "SAUMON PAVE",
                "SAUMON FUMÉ",
                "SAUMON MIETTES"
            ]
        },
        {
            "nom": "SEPIA",
            "calibres": [
                "MONGO 1",
                "MONGO 2",
                "MONGO 3",
                "MONGO 4",
                "MONGO 5",
                "MONGO 6",
                "MONGO 7",
                "MONGO 8",
                "MONGO MX",
                "MONGO 1 (2°CLS)",
                "MONGO 2 (2°CLS)",
                "MONGO 3 (2°CLS)",
                "MONGO 4 (2°CLS)",
                "MONGO 5 (2°CLS)",
                "MONGO 6 (2°CLS)",
                "MONGO 7 (2°CLS)",
                "MONGO 8 (2°CLS)",
                "MONGO 6M",
                "MONGO 7M"
            ]
        },
        {
            "nom": "SEPIOLA",
            "calibres": [
                "SEPIOLA",
                "SEPIOLA G",
                "SEPIOLA M",
                "SEPIOLA P",
                "SEPIOLA NETTOYER",
                "OEUF DE SEICHE"
            ]
        },
        {
            "nom": "SOLE",
            "calibres": [
                "SOLETTE",
                "SOLE LONG G",
                "SOLE TIGRE",
                "SOLE LONG M",
                "SOLE LONG P",
                "SOLE TIGRE MIXTE",
                "SOLE",
                "SOLE LONG MIXTE",
                "SOLE LONG 100/200",
                "SOLE LONG 200/300",
                "SOLE LONG 300/400",
                "SOLE LONG 400/500",
                "SOLE LONG +500",
                "SOLE TURBO",
                "SOLE N.c",
                "SOLETTE 12KG",
                "SOLETTE 20KG",
                "SOLETTE 15KG",
                "SOLE TIGRE 300/400"
            ]
        },
        {
            "nom": "SOYA",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "SPRING ROLL PASTRY",
            "calibres": [
                "1",
                "2",
                "3",
                "4"
            ]
        },
        {
            "nom": "ST PIERRE",
            "calibres": [
                "ST PIERRE",
                "ST PIERRE S/C",
                "ST PIERRE P",
                "ST PIERRE M",
                "ST PIERRE G",
                "ST PIERRE S/C P",
                "ST PIERRE S/C M",
                "ST PIERRE S/C G"
            ]
        },
        {
            "nom": "SURIMI",
            "calibres": [
                "LANGOUSTE 300/500",
                "LANGOUSTE",
                "CIGALA"
            ]
        },
        {
            "nom": "TAKO MIX",
            "calibres": [
                "SAUMON PAVE",
                "SAUMON FUMÉ",
                "SAUMON MIETTES"
            ]
        },
        {
            "nom": "THON",
            "calibres": [
                "FILET CRABE"
            ]
        },
        {
            "nom": "VARIOS",
            "calibres": [
                "VARIOUS/AF",
                "QUINOA SALAD",
                "GYOZA SEA FOOD",
                "GYOZA VEGETABLE",
                "GYOZA TOFU",
                "GYOZA QUINOA",
                "GYOZA MINI SPING",
                "HARKAO",
                "SIMOSA VEGETABLE",
                "SPING PRIMOVRS",
                "LA DINDE",
                "BONITE",
                "MERLAN",
                "MERLAN HGT"
            ]
        },
        {
            "nom": "VERRUGATO",
            "calibres": [
                "VERRUGATTO"
            ]
        }
    ],
    parametres: {
      salaireHoraireOcc: 17,
      heuresMensuelles: 208,
      tarifKwh: 1.01,
      redevancePuissance: 17087.58,
      redevanceEntretien: 391.20,
      redevanceLocation: 215.05,
      puissanceKVA: 400,
      coutCarburant: 300,
      coutPersonnelLogistique: 4000,
      salaireQualite: 9000,
      salaireAdmin: 25000,
      geminiApiKey: '',
    },
    production: [],
    mouvementsStock: [],
    energieMensuelle: {},
    stockage: [],
    sortiesStockage: [],
    qrCodes: [],
    factures: [],
    relevesTemp: [],
    clients: [
          {
                "nom": "FISH & FOOD TRAITE...",
                "type": "Client , Fournisseur poisson, Usine de traitement...",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "FISH AND FOOD PROC...",
                "type": "Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "LAMBDA FISH SUD",
                "type": "Client , Fournisseur poisson",
                "ville": "Dakhla",
                "bateaux": []
          },
          {
                "nom": "4A LOGISTIC",
                "type": "Frigo",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "A.O.C",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "ESSALAM 1",
                            "type": "Congelateur",
                            "agrement": "CO 8801"
                      },
                      {
                            "nom": "ESSALAM 2",
                            "type": "Congelateur",
                            "agrement": "CO 8502"
                      }
                ]
          },
          {
                "nom": "ADAM INDUSTRIES",
                "type": "Fournisseur divers achats",
                "ville": "Casablanca",
                "bateaux": []
          },
          {
                "nom": "AGADIR ICE",
                "type": "Frigo",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "AGORAPOLIS",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "AIT MELLOUL CHIMIE...",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "ALIA PECHE",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "LE VIZIR",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "EL KHALIFA",
                            "type": "Congelateur",
                            "agrement": "CO 1901"
                      }
                ]
          },
          {
                "nom": "ARCADE EQUIPEMENT",
                "type": "Fournisseur divers achats",
                "ville": "Casablanca",
                "bateaux": []
          },
          {
                "nom": "ARCHI FOOD",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "AMGHASS 1",
                            "type": "Congelateur",
                            "agrement": "CO 6306"
                      }
                ]
          },
          {
                "nom": "ASMAK KHALIL ADAM",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "KENZA 3",
                            "type": "Congelateur",
                            "agrement": "CO 2703"
                      }
                ]
          },
          {
                "nom": "ASMAK RAHAL",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "AGDAL 2",
                            "type": "Congelateur",
                            "agrement": "CO 1002"
                      },
                      {
                            "nom": "AL FARAZDAK",
                            "type": "Congelateur",
                            "agrement": "CO 3205"
                      },
                      {
                            "nom": "AL YACOUBI",
                            "type": "Congelateur",
                            "agrement": "CO 3212"
                      }
                ]
          },
          {
                "nom": "ATLANTIC FISH MORO...",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "AGDAL 1",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AGDAL 3",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL BAIROUMI",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL HAMADANI",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL KENDY",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL HARIRI",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL MESSAOUDI",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL KHAWARIZMY",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "ATLANTIC FISH SUD",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "IBNOU NOUASS",
                            "type": "Congelateur",
                            "agrement": "CO 3214"
                      },
                      {
                            "nom": "MASSIRA 6",
                            "type": "Congelateur",
                            "agrement": "CO 0501"
                      },
                      {
                            "nom": "MASSIRA 7",
                            "type": "Congelateur",
                            "agrement": "CO 0502"
                      },
                      {
                            "nom": "MASSIRA 8",
                            "type": "Congelateur",
                            "agrement": "CO 0503"
                      },
                      {
                            "nom": "AGDAL 4",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "ATLANTIC GAMBA SUD...",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Boujdour",
                "bateaux": [
                      {
                            "nom": "LA ROJA-1",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "AVENIR NEGOCE",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "BIOB SHRIMP",
                "type": "Armateur, Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "LILIA",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "MARANTARTINCO 2",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "CEPHALOPECHE",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "BRAHAM 2",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "ASSA ZAK",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "ALBERTO 2",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AFOUDRAR",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "DAR RAHA",
                "type": "Frigo",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "DARAA PRODUCT",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "DEEP BLEU",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "KENZ AL ATLAS",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AARK SOUSS",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "SAYAD",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "KENZ ERRIF",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "MOUSSALIM",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "HITA",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "KSAR AL BAHR",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "DIVERS/DEEP BLEU",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "AL MANAR 2",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "DHAF PESCA",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "MANSOUR EDDAHBI",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "YAKOUB AL MANSOUR",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "DIVERS",
                "type": "Armateur, Client , Fournisseur poisson, Consignat...",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "DIVERS",
                            "type": "Frais",
                            "agrement": ""
                      },
                      {
                            "nom": "IMPORT",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "ECO PELAGIQUE (HAM...",
                "type": "Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "ESSAIES ASMAK SUD",
                "type": "Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "FAST MOSK",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "FENNEC PECHE",
                "type": "Armateur, Fournisseur poisson, Fournisseur divers...",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "FILAKA PECHE",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "FILAKA 1",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "FILAKA 2",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "FILAKA 3",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "FILAKA 4",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "FREIRIE MAR",
                "type": "Armateur, Client",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "GEFS",
                "type": "Frigo",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "GPC PAPIER ET CAR...",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "GRAPHIC INO",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "GREAT SIDE CONSIGN...",
                "type": "Consignataire",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "GUADAZUL",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "AL BOUKHARI",
                            "type": "Congelateur",
                            "agrement": "CO 0402"
                      },
                      {
                            "nom": "AL GHAZALI",
                            "type": "Congelateur",
                            "agrement": "CO 0401"
                      },
                      {
                            "nom": "IBN SINA",
                            "type": "Congelateur",
                            "agrement": "CO 8602"
                      },
                      {
                            "nom": "IBN ROCHD",
                            "type": "Congelateur",
                            "agrement": "CO 8601"
                      },
                      {
                            "nom": "KENZA 2",
                            "type": "Congelateur",
                            "agrement": "CO 2702"
                      },
                      {
                            "nom": "SIP II",
                            "type": "Congelateur",
                            "agrement": "CO 5702"
                      }
                ]
          },
          {
                "nom": "HAI SHENG FISHERIE...",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "TALOUMA 1",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "TALOUMA 2",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "HAIFEN FROID",
                "type": "Frigo",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "HAIFEN-FISHERIES",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "NAMIA 1",
                            "type": "Congelateur",
                            "agrement": "CO 5301"
                      },
                      {
                            "nom": "NAMIA 10",
                            "type": "Congelateur",
                            "agrement": "CO 5001"
                      }
                ]
          },
          {
                "nom": "HAJ HAMID",
                "type": "Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "HAKIM ETTOUHAMY",
                "type": "Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "HANDLING SERVICES",
                "type": "Consignataire",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "HYGITECH 3D SARL",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "IDF",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "IBNOU AL KHATIB",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "IDOU PESCA",
                "type": "Fournisseur poisson, Usine de traitement, Frigo",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "IDOU PESCA",
                            "type": "Usine",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "IGUER NEGOCE",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "ISKA PESCA",
                "type": "Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "JEAN DUFLOT",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "KHALID FISHERIES",
                "type": "Armateur, Client , Fournisseur poisson",
                "ville": "Agadir",
                "bateaux": [
                      {
                            "nom": "ANZAR 1",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "TAMEGRA",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "IGOUDAR",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "TILILA",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "TODRA",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "ALICANTE",
                            "type": "Congelateur",
                            "agrement": ""
                      },
                      {
                            "nom": "KELTI",
                            "type": "Congelateur",
                            "agrement": ""
                      }
                ]
          },
          {
                "nom": "KITEA GEANT AGADIR...",
                "type": "Fournisseur divers achats",
                "ville": "Agadir",
                "bateaux": []
          },
          {
                "nom": "KMT CODING",
                "type": "Fournisseur divers achats",
                "ville": "Casablanca",
                "bateaux": []
          }
    ],
  },

  // --- Init ---
  init() {
    this.loadData();
    this.updateHeaderDate();
    this.navigate('dashboard');
    this.updateAlertsBadge();
    setInterval(() => this.updateHeaderDate(), 60000);
  },

  // --- Storage ---
  loadData() {
    const saved = localStorage.getItem('gestprod_data');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (err) {
        console.error('Données locales corrompues, réinitialisation.', err);
        this.data = JSON.parse(JSON.stringify(this.defaults));
        this.saveData();
      }
      // Ensure all keys exist (Deep check for parametres)
      for (const key in this.defaults) {
        if (!(key in this.data)) {
          this.data[key] = JSON.parse(JSON.stringify(this.defaults[key]));
        } else if (key === 'parametres') {
          // Deep sync for parametres to ensure new keys like geminiApiKey are added
          for (const pKey in this.defaults.parametres) {
            if (!(pKey in this.data.parametres)) {
              this.data.parametres[pKey] = this.defaults.parametres[pKey];
            }
          }
        }
      }
      // Force sync of new detailed especes (Version 4)
      if (!localStorage.getItem('gestprod_v8_ntsamak_especes_v4_force')) {
        this.data.especes = JSON.parse(JSON.stringify(this.defaults.especes));
        localStorage.setItem('gestprod_v8_ntsamak_especes_v4_force', 'true');
        this.saveData();
      }
      // Force sync of full scraped clients (Version 4)
      if (!localStorage.getItem('gestprod_v8_ntsamak_clients_v4_force')) {
        this.data.clients = JSON.parse(JSON.stringify(this.defaults.clients));
        localStorage.setItem('gestprod_v8_ntsamak_clients_v4_force', 'true');
        this.saveData();
      }
    } else {
      this.data = JSON.parse(JSON.stringify(this.defaults));
      this.saveData();
    }
  },

  saveData() {
    localStorage.setItem('gestprod_data', JSON.stringify(this.data));
    this.updateAlertsBadge();
  },

  resetData() {
    if (confirm('⚠️ Voulez-vous vraiment réinitialiser TOUTES les données ? Cette action est irréversible.')) {
      this.data = JSON.parse(JSON.stringify(this.defaults));
      this.saveData();
      this.navigate(this.currentPage);
      this.toast('Données réinitialisées', 'info');
    }
  },

  exportData() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestprod_backup_${this.formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Données exportées avec succès', 'success');
  },

  importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported || typeof imported !== 'object' || Array.isArray(imported)) {
          throw new Error('Format racine invalide');
        }
        const merged = JSON.parse(JSON.stringify(this.defaults));
        for (const key in imported) merged[key] = imported[key];
        ['stockage', 'production', 'consommables', 'personnel', 'factures', 'sortiesStockage', 'mouvementsStock', 'qrCodes'].forEach(key => {
          if (!Array.isArray(merged[key])) throw new Error(`Table ${key} invalide`);
        });
        this.data = merged;
        this.saveData();
        this.navigate(this.currentPage);
        this.toast('Données importées avec succès', 'success');
      } catch (err) {
        this.toast('Erreur: fichier invalide', 'error');
      }
    };
    reader.readAsText(file);
  },

  // --- Navigation ---
  navigate(page) {
    this.currentPage = page;
    // Auto-close mobile sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
    
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    const titles = {
      dashboard: 'Tableau de bord',
      stockage: 'Réception / Stockage',
      chambres: 'Plan des Chambres',
      saisie: 'Saisie Journalière',
      personnel: 'Gestion du Personnel',
      consommables: 'Gestion des Consommables',
      energie: 'Analyse Énergétique',
      rapports: 'Rapports',
      parametres: 'Paramètres',
      facturation: 'Facturation & Charges',
      qrcodes: 'Gestion des QR Codes',
      temperatures: 'Suivi des Températures',
    };
    document.getElementById('headerTitle').textContent = titles[page] || page;

    const content = document.getElementById('pageContent');
    content.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⏳</div><div>Chargement...</div></div>';

    // Small delay for smooth transition
    setTimeout(() => {
      switch (page) {
        case 'dashboard': Dashboard.render(); break;
        case 'stockage': Stockage.render(); break;
        case 'chambres': Chambres.render(); break;
        case 'saisie': Saisie.render(); break;
        case 'personnel': Personnel.render(); break;
        case 'consommables': Consommables.render(); break;
        case 'energie': Energie.render(); break;
        case 'facturation': Facturation.render(); break;
        case 'rapports': Rapports.render(); break;
        case 'parametres': Parametres.render(); break;
        case 'qrcodes': QRCodes.render(); break;
        case 'temperatures': Temperatures.render(); break;
      }
    }, 50);
  },

  // --- Alerts ---
  getAlerts() {
    const alerts = [];
    (this.data.consommables || []).forEach(c => {
      if (c.stock <= c.seuilCritique) {
        alerts.push({ type: 'critical', message: `${c.nom} : stock critique (${c.stock} ${c.unite})` });
      } else if (c.stock <= c.seuilAlerte) {
        alerts.push({ type: 'warning', message: `${c.nom} : stock bas (${c.stock} ${c.unite})` });
      }
    });
    return alerts;
  },

  updateAlertsBadge() {
    const alerts = this.getAlerts();
    const badge = document.getElementById('navBadgeConsommables');
    const dot = document.getElementById('alertDot');
    const criticals = alerts.filter(a => a.type === 'critical').length;
    const total = alerts.length;
    if (badge) {
      badge.style.display = total > 0 ? 'inline' : 'none';
      badge.textContent = total;
    }
    if (dot) dot.style.display = total > 0 ? 'block' : 'none';
  },

  // --- Toast ---
  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
  },

  // --- Helpers ---
  formatDate(d) {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().split('T')[0];
  },

  formatDateFR(d) {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatNumber(n, decimals = 2) {
    if (n === null || n === undefined || isNaN(n)) return '0';
    return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  },

  updateHeaderDate() {
    const el = document.getElementById('headerDate');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  },

  getMonthProduction(year, month) {
    return (this.data.production || []).filter(p => {
      const d = new Date(p.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  getCurrentMonthProduction() {
    const now = new Date();
    return this.getMonthProduction(now.getFullYear(), now.getMonth());
  },

  nextId(arr) {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(i => i.id || 0)) + 1;
  },

  // --- Modal helper ---
  showModal(title, bodyHtml, footerHtml) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  },

  closeModal() {
    const m = document.querySelector('.modal-overlay');
    if (m) m.remove();
  },

  // Chart.js destroy helper
  destroyCharts() {
    if (typeof Chart !== 'undefined' && Chart.instances) {
      Object.keys(Chart.instances).forEach(key => {
        try { Chart.instances[key].destroy(); } catch(e) {}
      });
    }
  },
};
