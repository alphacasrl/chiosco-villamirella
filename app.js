/* =====================================================================
   Chiosco Villamirella — logica dell'interfaccia
   ---------------------------------------------------------------------
   Scritto per il browser webOS del monitor LG (Chromium 108, GPU Mali-G31,
   1536x856 px logici, UN SOLO punto di tocco), ma le scelte valgono per
   qualunque schermo: i luoghi sulla mappa NON sono marcatori HTML —
   quelli sono elementi DOM riposizionati dalla CPU a ogni fotogramma,
   arrancano dietro alla camera e col terreno 3D restano a quota zero —
   bensi' LIVELLI NATIVI WebGL (cerchi + scritte dentro lo stile della
   mappa): seguono zoom, rotazione e rilievo per costruzione.

   Niente librerie oltre MapLibre. Niente optional chaining ne' await al
   primo livello: Chromium 108 li regge, ma il codice resta prudente.
   ===================================================================== */
(function () {
'use strict';

/* =====================================================================
   CONFIG — tutto cio' che si cambia senza toccare il resto del file
   ===================================================================== */
var CONFIG = {

  /* Basi cartografiche, entrambe senza chiave e in HTTPS (obbligatorio:
     la pagina e' https e il contenuto misto viene bloccato). */
  BASI: {
    sat: {
      etichetta: 'Satellite',
      /* ordine {z}/{y}/{x}: ArcGIS vuole riga prima di colonna */
      tiles: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Immagini &copy; Esri, Maxar, Earthstar Geographics',
      maxzoom: 19   /* oltre, Esri consegna riquadri grigi */
    },
    osm: {
      etichetta: 'Mappa',
      tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attrib: '&copy; OpenStreetMap contributors',
      maxzoom: 19
    }
  },
  BASE_INIZIALE: 'sat',

  /* Le scritte dei luoghi sulla mappa hanno bisogno di glifi (font in
     formato mappa). Sono OSPITATI IN LOCALE in assets/glifi: i server
     pubblici limitano le richieste (provato: HTTP 429), e un chiosco
     sempre acceso non puo' dipenderne. Coprono i caratteri latini che
     servono all'italiano. */
  GLIFI: location.origin + location.pathname.replace(/[^/]*$/, '') + 'assets/glifi/{fontstack}/{range}.pbf',
  FONT_MAPPA: ['Open Sans Semibold'],

  /* Rilievo 3D. TERRENO_MAXZOOM 12: piu' basso di quanto il servizio
     offra (15) DI PROPOSITO — servono 16 volte meno tile, quindi molte
     meno tile mancanti, che erano la causa dei buchi e delle pareti a
     strisce vicino alla camera. A questi zoom la differenza di
     dettaglio del rilievo non si percepisce. */
  TERRENO_3D: true,
  /* all'apertura la mappa e' PIATTA, vista dall'alto: il 3D si sceglie */
  AVVIO_3D: false,
  TERRENO_TILES: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  TERRENO_ATTRIB: 'Rilievo: AWS Terrain Tiles',
  TERRENO_MAXZOOM: 12,
  TERRENO_ESAGERAZIONE: 1.0,

  /* pixelRatio si fissa ALLA COSTRUZIONE e mai piu': cambiarlo a mappa
     viva rialloca il buffer WebGL e sul monitor fa cadere il contesto.
     1 = fluido (60 fps misurati), 1.25 = nitido (28 fps misurati). */
  PIXEL_RATIO: 1,
  RICHIESTE_PARALLELE: 6,

  /* colori dei pin per categoria (gli stessi delle etichette a sinistra) */
  COLORI: {
    muoversi: '#5b6ec9',
    spiagge: '#1a87c9', borghi: '#c96a2b', grotte: '#7057c9',
    natura: '#2f9e60', archeologia: '#b5892f', santuari: '#9550a8',
    ristoranti: '#d64550', negozi: '#5b7d8c', salute: '#c0392b', servizi: '#607d5b'
  },
  COLORE_SCELTO: '#dd350f',
  COLORE_CASA: '#dd350f',

  ZOOM_LUOGO: 14.5,
  PITCH_INCLINATO: 55,
  BORDO_PANORAMICA: 80,

  IDLE_MS: 120000,      /* dopo 2 minuti fermi si torna alla schermata iniziale */
  STANDBY_MS: 600000,   /* dopo 10 minuti parte il video di attesa */
  GRUPPO_INIZIALE: 'mare'
};

/* =====================================================================
   LINGUE — tutte le scritte dell'interfaccia nelle due lingue.
   I contenuti hanno il gemello inglese nei campi *_en di guida.js.
   ===================================================================== */
var TESTI = {
  it: {
    inizio: 'Inizio', tutteSezioni: '‹ Tutte le sezioni',
    tornaElenco: '‹ Torna all\'elenco', vediMappa: 'Vedi sulla mappa',
    panoramica: 'Torna alla panoramica',
    mappaIntera: 'Mappa', elencoIntero: 'Elenco',
    apriElenco: 'Apri', apriMappa: 'Apri',
    prenotabile: 'Prenotabile in reception',
    distanzaAria: 'Distanza in linea d\'aria', inAuto: 'In auto',
    dove: 'Dove', lidi: 'Lidi sulla spiaggia', luogo: 'Luogo', luoghi: 'Luoghi',
    guida: 'Guida del Residence Villamirella',
    titolo: 'Palinuro e il Cilento',
    invito: 'Tocca un riquadro per cominciare',
    beta: 'Versione Beta in corso di sviluppo. Aiutateci a migliorare dando un feedback alla Reception.',
    vuoto: 'Nessuna voce in questa sezione.',
    senzaTesto: 'Per questo luogo il sito non riporta una descrizione.',
    percorsoInd: 'Percorso indicativo',
    emergenza: 'Emergenze: 112', emergenza2: 'Numero unico europeo di emergenza',
    offline: 'Sei senza connessione: la mappa non si aggiorna, i testi restano leggibili.',
    online: 'Connessione tornata.',
    lenta: 'Connessione lenta: alcune parti della mappa potrebbero mancare.',
    itinerario: 'Itinerario', esperienza: 'Esperienza', guidaTipo: 'Guida',
    ristorante: 'Ristorante', negozio: 'Negozio', salute: 'Salute',
    lunghezza: 'Lunghezza del percorso', durata: 'Durata indicativa', difficolta: 'Difficolt\u00e0',
    orariInd: 'Orari indicativi: fa fede l\'orario pubblicato dalla linea.', vediOrario: 'Vedi l\'orario ufficiale',
    dislivello: 'Dislivello', quotaEtich: 'Quota', anello: 'Anello', traversata: 'Traversata', profilo: 'Profilo altimetrico',
    approfondisci: 'Per approfondire questo percorso inquadra il codice col telefono',
    meteoTitolo: 'Previsioni del tempo', meteoOra: 'Adesso', meteoVento: 'vento', meteoPioggia: 'prob. pioggia', meteoFonte: 'Dati meteo: Open-Meteo.com', meteoOre: 'Le prossime ore', meteoGiorni: 'I prossimi giorni', meteoOggi: 'oggi', meteoUmidita: 'umidità', meteoIndietro: '‹ Tutte le previsioni'
  },
  en: {
    inizio: 'Home', tutteSezioni: '‹ All sections',
    tornaElenco: '‹ Back to the list', vediMappa: 'Show on the map',
    panoramica: 'Back to overview',
    mappaIntera: 'Map', elencoIntero: 'List',
    apriElenco: 'Open', apriMappa: 'Open',
    prenotabile: 'Bookable at reception',
    distanzaAria: 'Straight-line distance', inAuto: 'By car',
    dove: 'Where', lidi: 'Beach clubs', luogo: 'Place', luoghi: 'Places',
    guida: 'Residence Villamirella guest guide',
    titolo: 'Palinuro and Cilento',
    invito: 'Tap a tile to start',
    beta: 'Beta version under development. Help us improve by leaving your feedback at Reception.',
    vuoto: 'Nothing in this section.',
    senzaTesto: 'The website has no description for this place.',
    percorsoInd: 'Approximate route',
    emergenza: 'Emergency: 112', emergenza2: 'Single European emergency number',
    offline: 'No connection: the map will not update, all texts remain readable.',
    online: 'Connection restored.',
    lenta: 'Slow connection: parts of the map may be missing.',
    itinerario: 'Itinerary', esperienza: 'Experience', guidaTipo: 'Guide',
    ristorante: 'Restaurant', negozio: 'Shop', salute: 'Health',
    lunghezza: 'Trail length', durata: 'Approximate duration', difficolta: 'Difficulty',
    orariInd: 'Times are indicative: the operator\'s published timetable prevails.', vediOrario: 'See the official timetable',
    dislivello: 'Elevation gain', quotaEtich: 'Altitude', anello: 'Loop', traversata: 'One-way', profilo: 'Elevation profile',
    approfondisci: 'To find out more about this route, scan the code with your phone',
    meteoTitolo: 'Weather forecast', meteoOra: 'Now', meteoVento: 'wind', meteoPioggia: 'rain prob.', meteoFonte: 'Weather data: Open-Meteo.com', meteoOre: 'Next hours', meteoGiorni: 'Coming days', meteoOggi: 'today', meteoUmidita: 'humidity', meteoIndietro: '‹ All forecasts'
  }
};
var lingua = 'it';

/* =====================================================================
   CONTATORE D'USO — tutto locale, niente rete: conta le aperture di
   sezioni, schede e pagine in localStorage. Si legge dal pannello
   segreto: TRE TOCCHI RAPIDI nell'angolo in basso a DESTRA.
   ===================================================================== */
var STATS_CHIAVE = 'vm-statistiche';
var STAT_SESSIONI_MAX = 250;   /* visite conservate per intero (le piu' recenti) */
var STAT_GIORNI_MAX = 400;     /* i riepiloghi giornalieri restano oltre un anno */
var STAT_PAUSA_MS = 90000;     /* fermo piu' a lungo: e' un'altra persona */
var STAT_DWELL_MAX = 180;      /* tetto ai secondi attribuiti a una schermata */
var STAT_PASSI_MAX = 14;       /* passi registrati per esteso in una visita */

function statOggi(ms) { return new Date(ms || Date.now()).toISOString().slice(0, 10); }
function statVuoto() {
  return { v: 2, da: statOggi(), totale: 0, sezioni: {}, voci: {}, giorni: {}, sessioni: [] };
}
function statLeggi() {
  var d = null;
  try { d = JSON.parse(localStorage.getItem(STATS_CHIAVE)); } catch (e) {}
  if (!d || !d.sezioni) return statVuoto();
  /* i dati raccolti con la prima versione restano: si aggiungono i campi nuovi */
  if (!d.giorni) d.giorni = {};
  if (!d.sessioni) d.sessioni = [];
  d.v = 2;
  return d;
}
function statScrivi(d) {
  try { localStorage.setItem(STATS_CHIAVE, JSON.stringify(d)); } catch (e) {
    /* memoria piena: si sacrificano le visite piu' vecchie, mai i riepiloghi */
    try {
      d.sessioni = d.sessioni.slice(-40);
      localStorage.setItem(STATS_CHIAVE, JSON.stringify(d));
    } catch (e2) { /* storage negato: si vive lo stesso */ }
  }
}
function statConta(tipo, nome) {
  var d = statLeggi();
  d.totale++;
  d[tipo][nome] = (d[tipo][nome] || 0) + 1;
  statScrivi(d);
}

/* ---------------------------------------------------------------------
   LA VISITA — comincia al primo tocco, finisce quando lo schermo torna in
   attesa o dopo una pausa lunga. La durata e' l'intervallo tra il primo e
   l'ULTIMO tocco: il tempo in cui nessuno tocca piu' non si conta, altrimenti
   basterebbe allontanarsi per gonfiare le medie.
   --------------------------------------------------------------------- */
var visita = null;
function statTocco() {
  var ora = Date.now();
  if (visita && ora - visita.ultimo > STAT_PAUSA_MS) statChiudiVisita();
  if (!visita) visita = { avvio: ora, ultimo: ora, dal: ora, dove: 'home',
                          passi: [], n: 1, lingua: lingua, servizio: false };
  else visita.ultimo = ora;
}
function statPasso(codice) {
  statTocco();
  var ora = Date.now();
  if (visita.passi.length < STAT_PASSI_MAX) {
    visita.passi.push([visita.dove, Math.min(STAT_DWELL_MAX, Math.round((ora - visita.dal) / 1000))]);
  }
  visita.n++;
  visita.dove = codice;
  visita.dal = ora;
  visita.ultimo = ora;
}
function statChiudiVisita() {
  var v = visita;
  visita = null;
  if (!v) return;
  /* il pannello di reception non e' una visita di un ospite */
  if (v.servizio) return;
  if (v.passi.length < STAT_PASSI_MAX) {
    v.passi.push([v.dove, Math.min(STAT_DWELL_MAX, Math.round((v.ultimo - v.dal) / 1000))]);
  }
  var durata = Math.round((v.ultimo - v.avvio) / 1000);
  /* sfioramenti di passaggio: non sono un uso del chiosco */
  if (v.n <= 1 && durata < 3) return;
  var d = statLeggi();
  var g = statOggi(v.avvio);
  var r = d.giorni[g] || { s: 0, sec: 0, passi: 0, oltre: 0, ore: {}, lin: {} };
  var oraDelGiorno = new Date(v.avvio).getHours();
  r.s++;
  r.sec += durata;
  r.passi += v.n;
  if (v.n > 1) r.oltre++;
  r.ore[oraDelGiorno] = (r.ore[oraDelGiorno] || 0) + 1;
  r.lin[v.lingua] = (r.lin[v.lingua] || 0) + 1;
  d.giorni[g] = r;
  d.sessioni.push({ t: v.avvio, d: durata, n: v.n, p: v.passi, l: v.lingua });
  if (d.sessioni.length > STAT_SESSIONI_MAX) d.sessioni = d.sessioni.slice(-STAT_SESSIONI_MAX);
  var chiavi = Object.keys(d.giorni).sort();
  while (chiavi.length > STAT_GIORNI_MAX) { delete d.giorni[chiavi.shift()]; }
  statScrivi(d);
}
/* se il browser viene chiuso o lo schermo spento, la visita in corso si salva */
window.addEventListener('pagehide', statChiudiVisita);
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') statChiudiVisita();
});

/* i codici interni diventano i nomi che si leggono sul chiosco */
function statEtichetta(c) {
  if (!c) return '?';
  if (c.indexOf('sez:') === 0) c = c.slice(4);
  if (c === 'home') return 'Schermata iniziale';
  if (c === 'meteo') return 'Previsioni del tempo';
  if (c.indexOf('scheda:') === 0) return c.slice(7);
  if (c.indexOf('doc:') === 0) return 'Orario ufficiale';
  var G = window.GUIDA || {};
  if (c.indexOf('pagina:') === 0) {
    var p = (G.PAGINE || {})[c.slice(7)];
    return p ? p.titolo : c.slice(7);
  }
  if (typeof GRUPPI !== 'undefined' && GRUPPI) {
    for (var i = 0; i < GRUPPI.length; i++) if (GRUPPI[i].id === c) return GRUPPI[i].nome;
  }
  return c;
}
function TXT(k) { return (TESTI[lingua] && TESTI[lingua][k]) || TESTI.it[k] || k; }
/* campo bilingue di guida.js: T(blocco.p, blocco.p_en) */
function T2(it, en) { return (lingua === 'en' && en) ? en : it; }

/* =====================================================================
   Utilita'
   ===================================================================== */
function $(s) { return document.querySelector(s); }
function el(tag, cls, txt) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined && txt !== null) e.textContent = String(txt);
  return e;
}
function vuota(n) { while (n.firstChild) n.removeChild(n.firstChild); }

/* Sul touch il "click" arriva 80-120 ms dopo il distacco del dito
   (misurato sul monitor). I comandi rispondono al pointerup, subito;
   e se il dito si e' spostato era uno scorrimento, non un tocco. */
function tocca(nodo, fn) {
  var giu = false, x0 = 0, y0 = 0;
  nodo.addEventListener('pointerdown', function (ev) { giu = true; x0 = ev.clientX; y0 = ev.clientY; });
  nodo.addEventListener('pointerup', function (ev) {
    if (!giu) return;
    giu = false;
    if (Math.abs(ev.clientX - x0) > 12 || Math.abs(ev.clientY - y0) > 12) return;
    ev.preventDefault();
    fn(ev);
  });
  nodo.addEventListener('pointercancel', function () { giu = false; });
  nodo.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(ev); }
  });
}

function distanzaAria(a, b) {
  if (!a || !b || a.lat === null || b.lat === null) return null;
  var R = 6371.0088, r = Math.PI / 180;
  var p1 = a.lat * r, p2 = b.lat * r;
  var dp = p2 - p1, dl = (b.lng - a.lng) * r;
  var h = Math.sin(dp / 2) * Math.sin(dp / 2) +
          Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* radice tipografica: innerWidth/64 -> 24px sul monitor del chiosco */
function scala() {
  var f = window.innerWidth / 64;
  if (f < 16) f = 16;
  if (f > 30) f = 30;
  document.documentElement.style.fontSize = f.toFixed(2) + 'px';
}
scala();
window.addEventListener('resize', scala);

/* =====================================================================
   Dati
   ===================================================================== */
var LUOGHI = window.LUOGHI || [];
var ESPERIENZE = window.ESPERIENZE || [];
var CATEGORIE = window.CATEGORIE || [];
var SEZIONI = window.SEZIONI || [];
var RESIDENCE = window.RESIDENCE || null;
var PERCORSI = window.PERCORSI || {};

function perId(id) {
  for (var i = 0; i < LUOGHI.length; i++) if (LUOGHI[i].id === id) return LUOGHI[i];
  return null;
}
var CAT_EN = { spiagge: 'Beaches & coves', borghi: 'Villages & towns', grotte: 'Caves & sea',
               natura: 'Nature & oases', archeologia: 'Archaeology & museums', santuari: 'Sanctuaries & churches' };
function nomeCategoria(id) {
  if (id === 'ristoranti') return TXT('ristorante');
  if (id === 'negozi') return TXT('negozio');
  if (id === 'salute') return TXT('salute');
  if (id === 'diving') return 'Diving';
  if (id === 'muoversi') return lingua === 'en' ? 'Transport' : 'Trasporti';
  if (id === 'servizi') return lingua === 'en' ? 'Service' : 'Servizio';
  for (var i = 0; i < CATEGORIE.length; i++) if (CATEGORIE[i].id === id) {
    return (lingua === 'en' && CAT_EN[id]) ? CAT_EN[id] : CATEGORIE[i].nome;
  }
  return id;
}
function nomeSezione(id, rip) {
  for (var i = 0; i < SEZIONI.length; i++) if (SEZIONI[i].id === id) return SEZIONI[i].nome;
  return rip;
}
function colore(cat) { return CONFIG.COLORI[cat] || '#235784'; }

function voceLuogo(l) { return { chiave: 'l:' + l.id, tipo: 'luogo', dato: l }; }
function voceEsp(e) { return { chiave: 'e:' + e.id, tipo: 'esperienza', dato: e }; }
function espDiTipo(t) {
  var r = [];
  for (var i = 0; i < ESPERIENZE.length; i++) if (ESPERIENZE[i].tipo === t) r.push(voceEsp(ESPERIENZE[i]));
  return r;
}
function luoghiDiCategoria(c) {
  var r = [];
  for (var i = 0; i < LUOGHI.length; i++) if (LUOGHI[i].categoria === c) r.push(voceLuogo(LUOGHI[i]));
  return r;
}
function inEvidenza() {
  var r = [], i;
  for (i = 0; i < ESPERIENZE.length; i++) if (ESPERIENZE[i].inEvidenza) r.push(voceEsp(ESPERIENZE[i]));
  for (i = 0; i < LUOGHI.length; i++) if (LUOGHI[i].inEvidenza) r.push(voceLuogo(LUOGHI[i]));
  return r;
}

function spiaggeEMare() {
  /* la gita in barca (prenotabile) apre la sezione, poi tutte le spiagge */
  var r = [], i;
  for (i = 0; i < ESPERIENZE.length; i++) if (ESPERIENZE[i].inEvidenza) r.push(voceEsp(ESPERIENZE[i]));
  var prima = luoghiDiCategoria('spiagge').sort(function (a, b) {
    return (b.dato.inEvidenza ? 1 : 0) - (a.dato.inEvidenza ? 1 : 0);
  });
  return r.concat(prima);
}
function tuttiILuoghi() {
  var r = [];
  for (var i = 0; i < LUOGHI.length; i++) if (LUOGHI[i].verified) r.push(voceLuogo(LUOGHI[i]));
  return r;
}
var GRUPPI = [
  { id: 'tutti',      nome: 'Mappa', nome_en: 'Map', cat: null, icona: 'mappa', voci: tuttiILuoghi },
  { id: 'mare',       nome: 'Spiagge e mare', nome_en: 'Beaches & sea', cat: 'spiagge', icona: 'mare', voci: spiaggeEMare },
  { id: 'itinerari',  nome: nomeSezione('itinerari', 'Itinerari'), nome_en: 'Itineraries', cat: null, icona: 'itinerari', voci: function () { return espDiTipo('itinerario'); } },
  { id: 'esperienze', nome: nomeSezione('esperienze', 'Esperienze'), nome_en: 'Experiences', cat: null, icona: 'esperienze', voci: function () { return espDiTipo('esperienza'); } }
];
(function () {
  for (var i = 0; i < CATEGORIE.length; i++) {
    (function (c) {
      if (c.id === 'spiagge') return;   /* fuse in "Spiagge e mare" */
      var IC = { borghi: 'borghi', grotte: 'grotte', natura: 'natura',
                 archeologia: 'archeologia', santuari: 'santuari' };
      var EN = { borghi: 'Villages & towns', grotte: 'Caves', natura: 'Nature & oases',
                 archeologia: 'Archaeology & museums', santuari: 'Sanctuaries' };
      GRUPPI.push({ id: 'cat:' + c.id, nome: c.nome, nome_en: EN[c.id] || c.nome,
                    cat: c.id, icona: IC[c.id] || 'borghi',
                    voci: function () { return luoghiDiCategoria(c.id); } });
    })(CATEGORIE[i]);
  }
  /* gruppi dalla guida: ristoranti e negozi georiferiti */
  var G = window.GUIDA || {};
  ['ristoranti', 'negozi', 'salute', 'muoversi', 'servizi'].forEach(function (pid) {
    var pag = (G.PAGINE || {})[pid];
    if (!pag || !pag.mappa) return;
    var pseudo = [];
    (pag.blocchi || []).forEach(function (b) {
      if (!b.card) return;
      pseudo.push({
        id: 'g-' + pid + '-' + pseudo.length,
        nome: b.card.nome, categoria: pid,
        lat: (b.card.lat !== undefined ? b.card.lat : null),
        lng: (b.card.lng !== undefined ? b.card.lng : null),
        verified: b.card.lat !== undefined,
        sommario: b.card.testo || '',
        sommario_en: b.card.testo_en || '',
        dove: b.card.dove || '',
        dove_en: b.card.dove_en || '',
        immagine: b.card.foto || '',
        orari: b.card.orari || null,
        icona: b.card.icona || '',
        pinIcona: b.card.pin || '',
        foglioOrari: b.card.foglioOrari || '',
        fermate: b.card.fermate || null,
        nome_en: b.card.nome_en || '',
        articoli: [], distanzaKm: '', tempoAuto: '', inEvidenza: false
      });
    });
    pseudo.forEach(function (l) { LUOGHI.push(l); });
    var ICP = { ristoranti: 'ristoranti', negozi: 'negozi', salute: 'salute', muoversi: 'muoversi', servizi: 'servizi' };
    GRUPPI.push({ id: 'g:' + pid, nome: pag.titolo, nome_en: pag.titolo_en || pag.titolo, cat: pid, icona: ICP[pid] || pid,
                  voci: function () { return pseudo.map(voceLuogo); } });
  });
})();

function luoghiDelGruppo(g) {
  var voci = g.voci(), visti = {}, out = [];
  function agg(l) { if (l && l.verified && !visti[l.id]) { visti[l.id] = 1; out.push(l); } }
  for (var i = 0; i < voci.length; i++) {
    if (voci[i].tipo === 'luogo') agg(voci[i].dato);
    else {
      var rif = voci[i].dato.luoghi || [];
      for (var j = 0; j < rif.length; j++) agg(perId(rif[j]));
    }
  }
  return out;
}

/* =====================================================================
   Stato
   ===================================================================== */
var stato = {
  gruppo: CONFIG.GRUPPO_INIZIALE,
  aperta: null,
  base: CONFIG.BASE_INIZIALE,
  terreno: CONFIG.AVVIO_3D,
  inclinata: false,
  mappaPronta: false
};
var mappa = null, erroriTile = 0, timerAvviso = null;

/* =====================================================================
   Colonna sinistra
   ===================================================================== */
function badgePren() {
  /* verde con la spunta: e' una possibilita' in piu', non un vincolo */
  var b = el('span', 'badge-pren');
  b.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">' +
    '<path d="M4 12.5l5 5L20 6.5" stroke="currentColor" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '<span>' + TXT('prenotabile') + '</span>';
  return b;
}

/* la navigazione fra sezioni vive nella schermata iniziale: qui resta
   solo la barra con il ritorno e il nome della sezione aperta */
function disegnaFiltri() {
  var g = gruppoCorrente();
  var n = $('#sez-nome');
  vuota(n);
  var c = el('span', 'sez-icona');
  c.innerHTML = icona(g.icona || 'borghi');
  if (g.cat) c.style.color = colore(g.cat);
  n.appendChild(c);
  n.appendChild(el('span', null, T2(g.nome, g.nome_en)));
}

function gruppoCorrente() {
  for (var i = 0; i < GRUPPI.length; i++) if (GRUPPI[i].id === stato.gruppo) return GRUPPI[i];
  return GRUPPI[0];
}

function sottotitolo(v) {
  if (v.tipo === 'luogo') return nomeCategoria(v.dato.categoria);
  if (v.dato.tipo === 'itinerario') return TXT('itinerario');
  if (v.dato.tipo === 'guida') return TXT('guidaTipo');
  return TXT('esperienza');
}

function disegnaElenco() {
  var n = $('#elenco');
  vuota(n);
  var g = gruppoCorrente();
  var voci = g.voci();
  if (g.id === 'g:muoversi') {
    n.appendChild(el('div', 'avviso-regole', TXT('orariInd')));
  }
  if (g.id === 'g:salute') {
    var em = el('div', 'emergenza');
    em.innerHTML = '<b>' + TXT('emergenza') + '</b><span>' + TXT('emergenza2') + '</span>';
    n.appendChild(em);
  }
  if (!voci.length) { n.appendChild(el('div', 'vuoto', TXT('vuoto'))); return; }
  for (var i = 0; i < voci.length; i++) {
    (function (v) {
      var d = v.dato;
      var c = el('div', 'scheda');
      c.setAttribute('data-chiave', v.chiave);
      if (d.immagine) {
        var img = el('img', 'foto');
        img.src = d.immagine; img.alt = ''; img.loading = 'lazy';
        c.appendChild(img);
      } else {
        /* segnaposto: icona della voce quando c'e', altrimenti l'iniziale */
        var sp = el('div', 'foto segnaposto');
        if (d.icona || v.tipo === 'luogo') {
          sp.innerHTML = icona(d.icona || iconaPin(d));
        } else {
          sp.textContent = d.nome.charAt(0);
        }
        if (v.tipo === 'luogo') sp.style.color = colore(d.categoria);
        c.appendChild(sp);
      }
      var corpo = el('div', 'corpo');
      var meta = el('div', 'meta');
      if (v.tipo === 'luogo') {
        var p = el('span', 'pallino');
        p.style.background = colore(d.categoria);
        meta.appendChild(p);
      }
      meta.appendChild(el('span', null, sottotitolo(v)));
      if (d.prenotabileInReception) meta.appendChild(badgePren());
      corpo.appendChild(meta);
      corpo.appendChild(el('h3', null, d.nome));
      if (d.sommario) corpo.appendChild(el('p', null, d.sommario));
      c.appendChild(corpo);
      tocca(c, function () { apriDettaglio(v); });
      n.appendChild(c);
    })(voci[i]);
  }
}

/* =====================================================================
   Dettaglio
   ===================================================================== */
function apriDettaglio(v) {
  var d = v.dato;
  statConta('voci', d.nome);
  statPasso('scheda:' + d.nome);
  stato.aperta = v;

  var foto = $('#det-foto');
  if (d.immagine) { foto.src = d.immagine; foto.parentNode.style.display = 'block'; }
  else { foto.removeAttribute('src'); foto.parentNode.style.display = 'none'; }

  $('#det-categoria').textContent = sottotitolo(v);
  $('#det-nome').textContent = d.nome;
  $('#det-sommario').textContent = T2(d.sommario, d.sommario_en) || '';
  $('#det-sommario').style.display = d.sommario ? 'block' : 'none';

  var pren = $('#det-prenotabile');
  vuota(pren);
  if (d.prenotabileInReception) pren.appendChild(badgePren());

  var righe = $('#det-righe');
  vuota(righe);
  function riga(k, val) {
    var r = el('div', 'riga');
    r.appendChild(el('b', null, k));
    r.appendChild(el('span', null, val));
    righe.appendChild(r);
  }
  var eArea = (v.tipo === 'luogo' && d.id === 'parco-nazionale');
  if (v.tipo === 'luogo' && !eArea) {
    if (d.distanzaKm !== '' && d.distanzaKm !== null && d.distanzaKm !== undefined) {
      riga('Distanza dal residence', d.distanzaKm + ' km');
    } else {
      var km = distanzaAria(RESIDENCE, d);
      if (km !== null) riga(TXT('distanzaAria'), km.toFixed(1) + ' km');
    }
    if (d.tempoAuto) riga(TXT('inAuto'), d.tempoAuto);
    if (d.dove) riga(TXT('dove'), T2(d.dove, d.dove_en));
    if (d.lidi) riga(TXT('lidi'), d.lidi);
  } else if (v.tipo === 'esperienza') {
    /* scheda in stile app da trekking: lunghezza dal tracciato reale,
       durata e difficolta' se compilate a mano in poi.js */
    var perc = PERCORSI[d.id];
    if (perc && perc.linee) {
      var kmTot = 0;
      for (var li = 0; li < perc.linee.length; li++) {
        var ln = perc.linee[li];
        for (var pi = 1; pi < ln.length; pi++) {
          kmTot += distanzaAria({ lat: ln[pi-1][1], lng: ln[pi-1][0] },
                                { lat: ln[pi][1],   lng: ln[pi][0] });
        }
      }
      if (kmTot > 0.3) riga(TXT('lunghezza'), kmTot.toFixed(1) + ' km' +
        (perc.indicativo ? ' \u2014 ' + TXT('percorsoInd').toLowerCase() : ''));
    }
    if (perc && perc.quote) {
      var qz = perc.quote;
      if (qz.salita !== undefined) {
        riga(TXT('dislivello'), '+' + qz.salita + ' m / −' + qz.discesa + ' m');
        riga(TXT('quotaEtich'), qz.min + ' – ' + qz.max + ' m');
      }
      if (qz.anello !== undefined) riga('Tipo', qz.anello ? TXT('anello') : TXT('traversata'));
    }
    if (d.durata) riga(TXT('durata'), d.durata);
    if (d.difficolta) riga(TXT('difficolta'), d.difficolta);
    var rif = d.luoghi || [], nomi = [];
    for (var i = 0; i < rif.length; i++) { var l = perId(rif[i]); if (l) nomi.push(l.nome); }
    if (nomi.length) riga(nomi.length > 1 ? TXT('luoghi') : TXT('luogo'), nomi.join(', '));
  }

  var arts = $('#det-articoli');
  vuota(arts);
  /* profilo altimetrico in stile app da trekking */
  var percQ = (v.tipo === 'esperienza' && PERCORSI[d.id] && PERCORSI[d.id].quote) ? PERCORSI[d.id].quote : null;
  if (percQ && percQ.profilo && percQ.profilo.length > 5) {
    arts.appendChild(el('h4', 'orari-titolo', TXT('profilo')));
    var pf = percQ.profilo, W = 600, H = 120, mn = percQ.min, mx = Math.max(percQ.max, mn + 1);
    var pts = pf.map(function (vq, i) {
      return (i * W / (pf.length - 1)).toFixed(1) + ',' + (H - 10 - (vq - mn) / (mx - mn) * (H - 25)).toFixed(1);
    }).join(' ');
    var box = el('div', 'profilo-box');
    box.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
      '<polygon points="0,' + (H - 10) + ' ' + pts + ' ' + W + ',' + (H - 10) + '" fill="#ddeaf6"/>' +
      '<polyline points="' + pts + '" fill="none" stroke="#235784" stroke-width="2.5"/>' +
      '</svg><div class="profilo-etich"><span>' + mn + ' m</span><span>' + mx + ' m</span></div>';
    arts.appendChild(box);
  }
  /* QR di approfondimento verso la pagina d'origine del percorso */
  if (v.tipo === 'esperienza' && PERCORSI[d.id] && PERCORSI[d.id].qr) {
    var fq = el('div', 'figura qr-percorso');
    var iq = el('img');
    iq.src = PERCORSI[d.id].qr; iq.alt = '';
    fq.appendChild(iq);
    fq.appendChild(el('p', null, TXT('approfondisci')));
    arts.appendChild(fq);
  }
  /* orari delle linee bus: dopo lo svuotamento, mai prima */
  if (d.orari || d.foglioOrari) {
    arts.appendChild(el('p', 'avviso-orari', TXT('orariInd')));
  }
  if (d.foglioOrari) {
    var bo = el('button', 'bt largo apri-orario', TXT('vediOrario'));
    bo.type = 'button';
    (function (src) {
      tocca(bo, function () { apriDocumento(src); });
    })(d.foglioOrari);
    arts.appendChild(bo);
  }
  if (d.orari) {
    for (var oi = 0; oi < d.orari.length; oi++) {
      var oz = d.orari[oi];
      arts.appendChild(el('h4', 'orari-titolo', T2(oz.t, oz.t_en)));
      for (var ri = 0; ri < oz.righe.length; ri++) {
        var rr = el('div', 'orari-riga');
        rr.appendChild(el('b', null, oz.righe[ri][0]));
        rr.appendChild(el('span', null, oz.righe[ri][1]));
        arts.appendChild(rr);
      }
    }
  }
  var lista = d.articoli || [];
  for (var k = 0; k < lista.length; k++) {
    var a = lista[k];
    if (!a.estratto || a.estratto === d.sommario) continue;
    var box = el('div', 'articolo');
    box.appendChild(el('h4', null, a.titolo));
    box.appendChild(el('p', null, a.estratto));
    arts.appendChild(box);
  }
  if (!d.sommario && !arts.childNodes.length) {
    arts.appendChild(el('p', 'avviso-vuoto', TXT('senzaTesto')));
  }
  /* se il tracciato e' una congiungente e non un rilievo GPS, va detto */
  var pct = PERCORSI[d.id];
  if (pct && pct.indicativo) {
    arts.appendChild(el('p', 'nota-percorso',
      'Il tracciato sulla mappa è indicativo: unisce i punti del percorso, non segue il rilievo GPS.'));
  }

  $('#dettaglio').classList.add('aperto');
  $('#dettaglio').setAttribute('aria-hidden', 'false');
  $('#dettaglio .scorri').scrollTop = 0;

  var fer = (v.tipo === 'luogo' && d.fermate) ? d.fermate : null;
  setSorgente('fermate', { type: 'FeatureCollection', features: (fer || []).map(function (f) {
    return { type: 'Feature', properties: { nome: f.nome },
             geometry: { type: 'Point', coordinates: [f.lng, f.lat] } };
  }) });
  evidenzia(v);
  disegnaPercorso(v);
  if (fer && fer.length) {
    var pts = fer.map(function (f) { return [f.lng, f.lat]; });
    if (d.verified) pts.push([d.lng, d.lat]);
    inquadra(pts);
    mostraPanoramica(true);
  } else {
    volaSu(v);
  }
}

function chiudiDettaglio() {
  setSorgente('fermate', { type: 'FeatureCollection', features: [] });
  stato.aperta = null;
  $('#dettaglio').classList.remove('aperto');
  $('#dettaglio').setAttribute('aria-hidden', 'true');
  evidenzia(null);
  disegnaPercorso(null);
}

/* =====================================================================
   MAPPA — luoghi come livelli nativi WebGL, non marcatori HTML
   ===================================================================== */
/* itinerario vince su esperienza che vince sulla categoria */
var RUOLO = null;
function ruoloDi(id) {
  if (!RUOLO) {
    RUOLO = {};
    for (var i = 0; i < ESPERIENZE.length; i++) {
      var e = ESPERIENZE[i];
      if (e.tipo === 'guida') continue;
      var r = e.tipo === 'itinerario' ? 'itinerari' : 'esperienze';
      (e.luoghi || []).forEach(function (x) {
        if (RUOLO[x] !== 'itinerari') RUOLO[x] = (RUOLO[x] === undefined || r === 'itinerari') ? r : RUOLO[x];
      });
    }
  }
  return RUOLO[id] || null;
}
function iconaPin(l) {
  return ruoloDi(l.id) || l.categoria;
}
function featureLuogo(l) {
  return { type: 'Feature',
    properties: { id: l.id, nome: l.nome, colore: colore(l.categoria),
                  icona: 'pin-' + (l.pinIcona || iconaPin(l)) },
    geometry: { type: 'Point', coordinates: [l.lng, l.lat] } };
}
/* le immagini dei pin: il set di icone, in bianco su tondo colorato */
function creaIconeMappa() {
  var TAV = {
    spiagge: ['mare', '#1a87c9'], borghi: ['borghi', '#c96a2b'], grotte: ['grotte', '#7057c9'],
    natura: ['natura', '#2f9e60'], archeologia: ['archeologia', '#b5892f'],
    santuari: ['santuari', '#9550a8'], ristoranti: ['ristoranti', '#d64550'],
    negozi: ['negozi', '#5b7d8c'], salute: ['salute', '#c0392b'],
    diving: ['esperienze', '#0e7fb5'],
    itinerari: ['itinerari', '#1f8074'], esperienze: ['esperenze' === 'x' ? '' : 'esperienze', '#d09a1e'],
    muoversi: ['treno', '#5b6ec9'],
    servizi: ['servizi', '#607d5b'],
    benzina: ['benzina', '#607d5b'], posta: ['posta', '#607d5b'],
    banca: ['banca', '#607d5b'], edicola: ['edicola', '#607d5b'], tabacchi: ['tabacchi', '#607d5b']
  };
  Object.keys(TAV).forEach(function (k) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 46 46">' +
      '<circle cx="23" cy="23" r="20.5" fill="' + TAV[k][1] + '" stroke="#ffffff" stroke-width="3"/>' +
      '<g transform="translate(11,11)" fill="none" stroke="#ffffff" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + (ICONE[TAV[k][0]] || '') + '</g></svg>';
    var im = new Image();
    im.onload = function () {
      try { if (!mappa.hasImage('pin-' + k)) mappa.addImage('pin-' + k, im); } catch (e) {}
    };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  /* il residence: targhetta bianca col logo Villamirella */
  var logo = new Image();
  logo.onload = function () {
    var c = document.createElement('canvas');
    var lw = 150, lh = 46;
    c.width = lw; c.height = lh;
    var g2 = c.getContext('2d');
    g2.fillStyle = '#ffffff';
    g2.fillRect(0, 0, lw, lh);
    g2.strokeStyle = '#dd350f'; g2.lineWidth = 4;
    g2.strokeRect(2, 2, lw - 4, lh - 4);
    var rap = Math.min((lw - 18) / logo.width, (lh - 12) / logo.height);
    var w2 = logo.width * rap, h2 = logo.height * rap;
    g2.drawImage(logo, (lw - w2) / 2, (lh - h2) / 2, w2, h2);
    try { if (!mappa.hasImage('casa-targa')) mappa.addImage('casa-targa', g2.getImageData(0, 0, lw, lh)); } catch (e) {}
  };
  logo.src = 'assets/logo-villamirella.svg';
}

function stileMappa() {
  var b = CONFIG.BASI[stato.base];
  var s = {
    version: 8,
    glyphs: CONFIG.GLIFI,
    sources: {
      /* sottofondo a zoom basso: poche tile, sempre in cache. Senza,
         una tile mancante lascia il nero del canvas. */
      basso: { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: 8 },
      base:  { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: b.maxzoom, attribution: b.attrib },
      poi:      { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
      scelto:   { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
      casa:     { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
      percorso: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
      fermate:  { type: 'geojson', data: { type: 'FeatureCollection', features: [] } }
    },
    layers: [
      { id: 'sfondo', type: 'background', paint: { 'background-color': '#0f2733' } },
      { id: 'basso',  type: 'raster', source: 'basso', paint: { 'raster-fade-duration': 0 } },
      { id: 'base',   type: 'raster', source: 'base' },

      /* percorso: bordo bianco sotto, colore sopra; tratteggio se indicativo */
      { id: 'percorso-bordo', type: 'line', source: 'percorso',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': .9 } },
      { id: 'percorso-linea', type: 'line', source: 'percorso',
        filter: ['!=', ['get', 'indicativo'], true],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': CONFIG.COLORE_SCELTO, 'line-width': 4 } },
      { id: 'percorso-tratteggio', type: 'line', source: 'percorso',
        filter: ['==', ['get', 'indicativo'], true],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': CONFIG.COLORE_SCELTO, 'line-width': 4, 'line-dasharray': [1.6, 1.6] } },

      /* luogo scelto: anello rosso sotto il cerchio */
      { id: 'scelto-anello', type: 'circle', source: 'scelto',
        paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 11, 14, 15],
                 'circle-color': CONFIG.COLORE_SCELTO, 'circle-opacity': .35,
                 'circle-stroke-color': CONFIG.COLORE_SCELTO, 'circle-stroke-width': 2.5 } },

      /* fermate della linea aperta: puntini con nome */
      { id: 'fermate-punti', type: 'circle', source: 'fermate',
        paint: { 'circle-radius': 5.5, 'circle-color': '#5b6ec9',
                 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 } },
      { id: 'fermate-nomi', type: 'symbol', source: 'fermate',
        layout: { 'text-field': ['get', 'nome'], 'text-font': CONFIG.FONT_MAPPA,
                  'text-size': 11.5, 'text-anchor': 'top', 'text-offset': [0, 0.7],
                  'text-optional': true },
        paint: { 'text-color': '#2c3775', 'text-halo-color': '#ffffff', 'text-halo-width': 1.5 } },

      /* i luoghi: icona della categoria su tondo colorato + nome */
      { id: 'poi-icone', type: 'symbol', source: 'poi',
        layout: {
          'icon-image': ['get', 'icona'],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.55, 14, 0.8],
          'icon-allow-overlap': true
        } },
      { id: 'poi-nomi', type: 'symbol', source: 'poi',
        layout: {
          'text-field': ['get', 'nome'],
          'text-font': CONFIG.FONT_MAPPA,
          'text-size': 13,
          'text-anchor': 'top',
          'text-offset': [0, 1.15],
          'text-max-width': 9,
          'text-optional': true
        },
        paint: { 'text-color': '#0c2233',
                 'text-halo-color': '#ffffff', 'text-halo-width': 1.6 } },

      /* il residence, sempre visibile: punto + targhetta col logo */
      { id: 'casa-cerchio', type: 'circle', source: 'casa',
        paint: { 'circle-radius': 7, 'circle-color': '#ffffff',
                 'circle-stroke-color': CONFIG.COLORE_CASA, 'circle-stroke-width': 3.5 } },
      { id: 'casa-nome', type: 'symbol', source: 'casa',
        layout: { 'icon-image': 'casa-targa',
                  'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.55, 14, 0.75],
                  'icon-anchor': 'bottom', 'icon-offset': [0, -14],
                  'icon-allow-overlap': true,
                  'text-field': 'Siamo qui', 'text-font': CONFIG.FONT_MAPPA,
                  'text-size': 12, 'text-anchor': 'top', 'text-offset': [0, 0.8],
                  'text-optional': true },
        paint: { 'text-color': CONFIG.COLORE_CASA,
                 'text-halo-color': '#ffffff', 'text-halo-width': 1.8 } }
    ]
  };
  /* il poligono del parco, se parco.js e' stato caricato */
  if (window.PARCO && window.PARCO.type) {
    s.sources.parco = { type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: window.PARCO } };
    s.layers.splice(3, 0,
      { id: 'parco-area', type: 'fill', source: 'parco', layout: { visibility: 'none' },
        paint: { 'fill-color': '#57b3a7', 'fill-opacity': 0.18 } },
      { id: 'parco-bordo', type: 'line', source: 'parco', layout: { visibility: 'none' },
        paint: { 'line-color': '#1f8074', 'line-width': 2 } });
  }
  if (CONFIG.TERRENO_3D) {
    s.sources.rilievo = { type: 'raster-dem', tiles: [CONFIG.TERRENO_TILES], tileSize: 256,
      encoding: 'terrarium', maxzoom: CONFIG.TERRENO_MAXZOOM, attribution: CONFIG.TERRENO_ATTRIB };
  }
  return s;
}

function avvia() {
  if (typeof maplibregl === 'undefined') {
    mostraAvviso('Mappa non disponibile: i contenuti restano consultabili.', 0);
    return;
  }
  try {
    if (typeof maplibregl.setMaxParallelImageRequests === 'function') {
      maplibregl.setMaxParallelImageRequests(CONFIG.RICHIESTE_PARALLELE);
    }
  } catch (e) {}

  try {
    mappa = new maplibregl.Map({
      container: 'mappa',
      style: stileMappa(),
      center: [15.30, 40.10],
      zoom: 9,
      pitch: 0,
      attributionControl: { compact: false },
      pixelRatio: CONFIG.PIXEL_RATIO,
      antialias: false,
      refreshExpiredTiles: false,
      maxPitch: 70,
      dragRotate: false,       /* la rotazione passa dalla bussola */
      touchPitch: false,       /* servirebbero due dita che non esistono */
      touchZoomRotate: true,   /* doppio tap per ingrandire */
      keyboard: false
    });
  } catch (e) {
    mostraAvviso('Mappa non avviabile su questo schermo.', 0);
    return;
  }

  try {
    mappa.addControl(new maplibregl.ScaleControl({ maxWidth: 130, unit: 'metric' }), 'bottom-left');
  } catch (e) {}

  mappa.on('load', function () {
    stato.mappaPronta = true;
    creaIconeMappa();
    mappa.resize();          /* se il layout non era assestato alla creazione */
    applicaTerreno();
    aggiornaCasa();
    aggiornaPoi();
    panoramica(true);
  });

  /* tocco su un luogo: si cerca in un riquadro largo un dito, non un punto */
  mappa.on('click', function (ev) {
    if (!stato.mappaPronta) return;
    var r = 16;
    var box = [[ev.point.x - r, ev.point.y - r], [ev.point.x + r, ev.point.y + r]];
    var trovati = [];
    try { trovati = mappa.queryRenderedFeatures(box, { layers: ['poi-icone', 'poi-nomi'] }); } catch (e) {}
    if (trovati.length) {
      var l = perId(trovati[0].properties.id);
      if (l) { apriDettaglio(voceLuogo(l)); return; }
    }
    try { trovati = mappa.queryRenderedFeatures(box, { layers: ['casa-cerchio', 'casa-nome'] }); } catch (e) {}
    if (trovati.length) vaiAlResidence();
  });

  mappa.on('rotate', aggiornaBussola);

  mappa.on('error', function () {
    erroriTile++;
    if (erroriTile === 8) mostraAvviso(TXT('lenta'), 6000);
  });
  mappa.on('moveend', function () { erroriTile = 0; });
}

function setSorgente(id, dati) {
  if (!mappa || !stato.mappaPronta) return;
  var s = mappa.getSource(id);
  if (s) { try { s.setData(dati); } catch (e) {} }
}

function aggiornaPoi() {
  var lista = luoghiDelGruppo(gruppoCorrente());
  var f = [], parcoDentro = false;
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === 'parco-nazionale') { parcoDentro = true; continue; }
    f.push(featureLuogo(lista[i]));
  }
  setSorgente('poi', { type: 'FeatureCollection', features: f });
  mostraParco(parcoDentro);
  if (stato.aperta) evidenzia(stato.aperta);
}

function aggiornaCasa() {
  if (!RESIDENCE || RESIDENCE.lat === null) return;
  setSorgente('casa', { type: 'FeatureCollection', features: [
    { type: 'Feature', properties: {},
      geometry: { type: 'Point', coordinates: [RESIDENCE.lng, RESIDENCE.lat] } }] });
}

function mostraParco(acceso) {
  if (!mappa || !stato.mappaPronta || !mappa.getLayer('parco-area')) return;
  var v = acceso ? 'visible' : 'none';
  try {
    mappa.setLayoutProperty('parco-area', 'visibility', v);
    mappa.setLayoutProperty('parco-bordo', 'visibility', v);
  } catch (e) {}
}

function evidenzia(v) {
  var schede = document.querySelectorAll('.scheda');
  for (var i = 0; i < schede.length; i++) schede[i].classList.remove('evidenziata');
  var punti = [];
  if (v) {
    var sc = document.querySelector('.scheda[data-chiave="' + v.chiave + '"]');
    if (sc) sc.classList.add('evidenziata');
    var ids = (v.tipo === 'luogo') ? [v.dato.id] : (v.dato.luoghi || []);
    for (var j = 0; j < ids.length; j++) {
      var l = perId(ids[j]);
      if (l && l.verified) punti.push(featureLuogo(l));
    }
  }
  setSorgente('scelto', { type: 'FeatureCollection', features: punti });
}

function disegnaPercorso(v) {
  var f = [];
  if (v) {
    var p = PERCORSI[v.dato.id];
    if (p && p.linee && p.linee.length) {
      for (var i = 0; i < p.linee.length; i++) {
        f.push({ type: 'Feature', properties: { indicativo: !!p.indicativo },
                 geometry: { type: 'LineString', coordinates: p.linee[i] } });
      }
    }
  }
  setSorgente('percorso', { type: 'FeatureCollection', features: f });
}

/* ------------------------- inquadrature --------------------------- */
function puntiDi(v) {
  var out = [];
  if (v.tipo === 'luogo') {
    if (v.dato.verified) out.push([v.dato.lng, v.dato.lat]);
  } else {
    var rif = v.dato.luoghi || [];
    for (var i = 0; i < rif.length; i++) {
      var l = perId(rif[i]);
      if (l && l.verified) out.push([l.lng, l.lat]);
    }
  }
  var p = PERCORSI[v.dato.id];
  if (p && p.linee) {
    for (var j = 0; j < p.linee.length; j++)
      for (var k = 0; k < p.linee[j].length; k++) out.push(p.linee[j][k]);
  }
  return out;
}

function volaSu(v) {
  if (!mappa || !stato.mappaPronta) return;
  if (v.tipo === 'luogo' && v.dato.id === 'parco-nazionale' && window.PARCO) {
    inquadraGeometria(window.PARCO);
    mostraPanoramica(true);
    return;
  }
  var p = puntiDi(v);
  if (!p.length) return;
  if (p.length === 1) {
    mappa.flyTo({ center: p[0], zoom: CONFIG.ZOOM_LUOGO,
      pitch: stato.inclinata ? CONFIG.PITCH_INCLINATO : 0,
      duration: 1600, essential: true });
  } else {
    inquadra(p);
  }
  mostraPanoramica(true);
}

function inquadra(punti) {
  if (!punti.length) return;
  var b = new maplibregl.LngLatBounds(punti[0], punti[0]);
  for (var i = 1; i < punti.length; i++) b.extend(punti[i]);
  mappa.fitBounds(b, { padding: CONFIG.BORDO_PANORAMICA, duration: 1400,
                       pitch: 0, bearing: 0, maxZoom: 15 });
}

function inquadraGeometria(g) {
  var punti = [];
  function anelli(a) { for (var i = 0; i < a.length; i++) punti.push(a[i]); }
  if (g.type === 'Polygon') for (var i = 0; i < g.coordinates.length; i++) anelli(g.coordinates[i]);
  else if (g.type === 'MultiPolygon')
    for (var j = 0; j < g.coordinates.length; j++)
      for (var k = 0; k < g.coordinates[j].length; k++) anelli(g.coordinates[j][k]);
  inquadra(punti);
}

function panoramica(prima) {
  if (!mappa || !stato.mappaPronta) return;
  var lista = luoghiDelGruppo(gruppoCorrente());
  var punti = [];
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id === 'parco-nazionale') continue;
    punti.push([lista[i].lng, lista[i].lat]);
  }
  if (RESIDENCE && RESIDENCE.lat !== null) punti.push([RESIDENCE.lng, RESIDENCE.lat]);
  if (punti.length) inquadra(punti);
  mostraPanoramica(false);
  if (!prima) evidenzia(stato.aperta);
}

function mostraPanoramica(s) { $('#panoramica').className = s ? 'mostra' : ''; }

function mostraAvviso(testo, ms) {
  var a = $('#avviso');
  a.textContent = testo;
  a.className = 'mostra';
  if (timerAvviso) clearTimeout(timerAvviso);
  if (ms) timerAvviso = setTimeout(function () { a.className = ''; }, ms);
}

/* ------------------- terreno, vista, base ------------------------- */
function applicaTerreno() {
  if (!mappa || !stato.mappaPronta) return;
  try {
    if (stato.terreno && CONFIG.TERRENO_3D && mappa.getSource('rilievo')) {
      mappa.setTerrain({ source: 'rilievo', exaggeration: CONFIG.TERRENO_ESAGERAZIONE });
      if (typeof mappa.setSky === 'function') {
        mappa.setSky({ 'sky-color': '#9ccbe8', 'horizon-color': '#e8f2f8',
          'fog-color': '#dfe9ef', 'fog-ground-blend': 0.9,
          'horizon-fog-blend': 0.85, 'sky-horizon-blend': 0.9 });
      }
    } else {
      mappa.setTerrain(null);
    }
  } catch (e) {}
  var b3 = $('#cmd-3d');
  /* dice DOVE SI VA: montagnette per passare al 3D, quadrato piatto per il 2D */
  b3.innerHTML = stato.terreno
    ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 7.5h11l-2.4 9h-13z"/><path d="M5.8 12h11.6M10.4 7.5l-1.7 9M14.9 7.5l-1.7 9"/></svg><span>2D</span>'
    : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18.5l5.5-9 3.6 6 3-4.5 5.9 7.5z"/><circle cx="16.6" cy="6.4" r="1.8"/></svg><span>3D</span>';
  b3.className = 'cmd grande' + (stato.terreno ? ' acceso' : '');
}

function applicaVista() {
  if (mappa && stato.mappaPronta) {
    mappa.easeTo({ pitch: stato.inclinata ? CONFIG.PITCH_INCLINATO : 0, duration: 700 });
  }
}

function etichettaBase() {
  /* il pulsante mostra la MINIATURA di dove si va, non una parola */
  var altra = stato.base === 'sat' ? 'osm' : 'sat';
  var n = $('#cmd-base');
  n.innerHTML = '<img src="assets/thumb-' + altra + '.jpg" alt="">' +
                '<span>' + (altra === 'osm' ? (lingua === 'it' ? 'Mappa' : 'Map') : (lingua === 'it' ? 'Satellite' : 'Satellite')) + '</span>';
}
function cambiaBase() {
  stato.base = (stato.base === 'sat') ? 'osm' : 'sat';
  var b = CONFIG.BASI[stato.base];
  etichettaBase();
  if (!mappa || !stato.mappaPronta) return;
  try {
    ['base', 'basso'].forEach(function (id) {
      if (mappa.getLayer(id)) mappa.removeLayer(id);
      if (mappa.getSource(id)) mappa.removeSource(id);
    });
    mappa.addSource('basso', { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: 8 });
    mappa.addSource('base',  { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: b.maxzoom, attribution: b.attrib });
    /* i raster tornano sotto tutto il resto */
    var sopra = mappa.getLayer('parco-area') ? 'parco-area' : 'percorso-bordo';
    mappa.addLayer({ id: 'basso', type: 'raster', source: 'basso', paint: { 'raster-fade-duration': 0 } }, sopra);
    mappa.addLayer({ id: 'base', type: 'raster', source: 'base' }, sopra);
  } catch (e) {
    mostraAvviso('Non riesco a cambiare mappa.', 4000);
  }
}

function vaiAlResidence() {
  if (!mappa || !RESIDENCE || RESIDENCE.lat === null) return;
  mappa.flyTo({ center: [RESIDENCE.lng, RESIDENCE.lat], zoom: 15,
    pitch: stato.inclinata ? CONFIG.PITCH_INCLINATO : 0, duration: 1500 });
  mostraPanoramica(true);
}

/* =====================================================================
   BUSSOLA — si trascina per ruotare, un tocco secco rimette il nord
   ===================================================================== */
function aggiornaBussola() {
  if (!mappa) return;
  var b = mappa.getBearing();
  $('#bussola-disco').style.transform = 'rotate(' + (-b) + 'deg)';
  $('#bussola').setAttribute('aria-valuenow', String(Math.round((b + 360) % 360)));
}
(function () {
  var n = $('#bussola');
  var attiva = false, mosso = false, a0 = 0, b0 = 0;
  function angolo(ev) {
    var r = n.getBoundingClientRect();
    return Math.atan2(ev.clientY - (r.top + r.height / 2),
                      ev.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  }
  n.addEventListener('pointerdown', function (ev) {
    if (!mappa) return;
    attiva = true; mosso = false;
    a0 = angolo(ev); b0 = mappa.getBearing();
    try { n.setPointerCapture(ev.pointerId); } catch (e) {}
  });
  n.addEventListener('pointermove', function (ev) {
    if (!attiva || !mappa) return;
    var da = angolo(ev) - a0;
    if (Math.abs(da) > 3) mosso = true;
    /* il dito trascina il disco: la mappa gira al contrario del disco */
    mappa.setBearing(b0 - da);
  });
  function fine(ev) {
    if (!attiva) return;
    attiva = false;
    try { n.releasePointerCapture(ev.pointerId); } catch (e) {}
    if (!mosso && mappa) mappa.easeTo({ bearing: 0, duration: 500 });   /* tocco = reset nord */
  }
  n.addEventListener('pointerup', fine);
  n.addEventListener('pointercancel', fine);
})();

/* =====================================================================
   Divisorio e apertura/chiusura delle due meta'
   ===================================================================== */
(function () {
  var div = $('#divisorio'), app = $('#app'), pan = $('#pannello');
  var trascina = false, ultimo = 0;

  div.addEventListener('pointerdown', function (ev) {
    if (ev.target.closest && ev.target.closest('.freccia')) return;
    trascina = true;
    try { div.setPointerCapture(ev.pointerId); } catch (e) {}
  });
  div.addEventListener('pointermove', function (ev) {
    if (!trascina) return;
    var perc = (ev.clientX / window.innerWidth) * 100;
    if (perc < 18) perc = 18;
    if (perc > 82) perc = 82;
    app.classList.remove('animato', 'solo-mappa', 'solo-elenco');
    pan.style.width = perc + '%';
    var ora = Date.now();
    if (mappa && ora - ultimo > 120) { ultimo = ora; mappa.resize(); }
  });
  function fine(ev) {
    if (!trascina) return;
    trascina = false;
    try { div.releasePointerCapture(ev.pointerId); } catch (e) {}
    if (mappa) mappa.resize();
  }
  div.addEventListener('pointerup', fine);
  div.addEventListener('pointercancel', fine);

  function assetta(classe) {
    pan.style.width = '';
    app.classList.add('animato');
    app.classList.remove('solo-mappa', 'solo-elenco');
    if (classe) app.classList.add(classe);
    var fatto = false;
    function poi() {
      if (fatto) return;
      fatto = true;
      app.classList.remove('animato');
      if (mappa) mappa.resize();
    }
    app.addEventListener('transitionend', poi, { once: true });
    setTimeout(poi, 420);
  }
  window.__assetta = assetta;   /* usata anche dal reset */

  /* i due tastini centrali fanno TUTTO: aprire, chiudere, tornare.
     Le etichette dicono sempre cosa succedera' al prossimo tocco. */
  function aggiornaFrecce() {
    /* ogni tasto mostra l'ICONA di cio' che otterrai toccandolo,
       una parola sola sotto, e la freccia nel verso del movimento */
    var sm = app.classList.contains('solo-mappa');
    var se = app.classList.contains('solo-elenco');
    var sx = $('#verso-sinistra'), dx = $('#verso-destra');
    sx.style.display = se ? 'none' : '';
    dx.style.display = sm ? 'none' : '';
    sx.classList.toggle('ritorno', sm);
    dx.classList.toggle('ritorno', se);
    function riempi(btn, freccia, ic, parola) {
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="' + freccia +
        '" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>' +
        '<span class="div-icona">' + icona(ic) + '</span>' +
        '<em>' + parola + '</em>';
    }
    if (sm) {
      riempi(sx, 'M10 6l6 6-6 6', 'elenco', TXT('apriElenco'));
      sx.setAttribute('aria-label', 'Riapri l\'elenco');
    } else {
      riempi(sx, 'M14 6l-6 6 6 6', 'mappa', TXT('mappaIntera'));
      sx.setAttribute('aria-label', 'Mappa a tutto schermo');
    }
    if (se) {
      riempi(dx, 'M14 6l-6 6 6 6', 'mappa', TXT('apriMappa'));
      dx.setAttribute('aria-label', 'Riapri la mappa');
    } else {
      riempi(dx, 'M10 6l6 6-6 6', 'elenco', TXT('elencoIntero'));
      dx.setAttribute('aria-label', 'Elenco a tutto schermo');
    }
  }
  window.__aggiornaFrecce = aggiornaFrecce;
  tocca($('#verso-sinistra'), function () {
    assetta(app.classList.contains('solo-mappa') ? null : 'solo-mappa');
    setTimeout(aggiornaFrecce, 30);
  });
  tocca($('#verso-destra'), function () {
    assetta(app.classList.contains('solo-elenco') ? null : 'solo-elenco');
    setTimeout(aggiornaFrecce, 30);
  });
  /* al primo giro il set di icone non e' ancora assegnato: si rinvia */
  setTimeout(aggiornaFrecce, 0);
})();

/* =====================================================================
   Comandi
   ===================================================================== */
tocca($('#cmd-base'), cambiaBase);
tocca($('#cmd-3d'), function () {
  stato.terreno = !stato.terreno;
  stato.inclinata = stato.terreno;   /* rilievo e inclinazione vanno insieme */
  applicaTerreno();
  applicaVista();
});
tocca($('#cmd-piu'),  function () { if (mappa) mappa.zoomIn({ duration: 400 }); });
tocca($('#cmd-meno'), function () { if (mappa) mappa.zoomOut({ duration: 400 }); });
tocca($('#cmd-casa'), vaiAlResidence);
tocca($('#cmd-pin'), function () {
  stato.pinVisibili = stato.pinVisibili === false ? true : false;
  var v = stato.pinVisibili ? 'visible' : 'none';
  ['poi-icone', 'poi-nomi', 'scelto-anello'].forEach(function (id) {
    try { if (mappa.getLayer(id)) mappa.setLayoutProperty(id, 'visibility', v); } catch (e) {}
  });
  this.className = 'cmd' + (stato.pinVisibili ? '' : ' acceso');
});
tocca($('#panoramica'), function () { chiudiDettaglio(); panoramica(); });
tocca($('#det-indietro'), function () { chiudiDettaglio(); });
tocca($('#det-mappa'), function () {
  if (stato.aperta) volaSu(stato.aperta);
  window.__assetta(null);
  if (window.__aggiornaFrecce) window.__aggiornaFrecce();
});

/* =====================================================================
   SCHERMATA INIZIALE e PAGINE INFORMATIVE (contenuti in guida.js)
   ===================================================================== */
var GUIDA = window.GUIDA || { MATTONELLE: [], PAGINE: {}, benvenuto: {} };

/* icone disegnate a mano: linee semplici, niente emoji (font incerti su webOS) */
var ICONE = {
  /* un solo tratto (1.8, punte tonde) per tutte: la coerenza e' il disegno */
  mare:       '<circle cx="16.2" cy="7" r="2.6"/><path d="M16.2 2.6v1.2M20.6 7h-1.2M19.3 3.9l-.85.85M19.3 10.1l-.85-.85M13.1 7h-1.2M13.1 3.9l.85.85"/><path d="M3 14.5c2-1.7 4-1.7 6 0s4 1.7 6 0 4-1.7 6 0"/><path d="M3 19c2-1.7 4-1.7 6 0s4 1.7 6 0 4-1.7 6 0"/>',
  borghi:     '<path d="M3.5 20.5v-8l4-3 4 3v8"/><path d="M11.5 20.5v-11l4.5-3.5 4.5 3.5v11"/><path d="M3 20.5h18"/><path d="M7 20.5v-3.4h1.6v3.4M15 20.5v-3.6h2v3.6"/><path d="M14.2 12h1.6M14.2 9h1.6"/>',
  grotte:     '<path d="M3.5 20.5c0-7.5 3.6-13 8.5-13s8.5 5.5 8.5 13"/><path d="M8.8 20.5c0-3.6 1.3-6 3.2-6s3.2 2.4 3.2 6"/><path d="M2.5 20.5h19"/>',
  natura:     '<path d="M12 21v-8.5"/><path d="M12 12.5C7.5 12.5 5 9.5 4.5 5c4.5.5 7.5 3 7.5 7.5z"/><path d="M12 10.5c0-3.5 2.5-6 7.5-6.5-.5 4.5-3 7-7.5 7z"/><path d="M8.5 21h7"/>',
  archeologia:'<path d="M4 8.5L12 4l8 4.5"/><path d="M5 8.5h14"/><path d="M6.5 8.5V17M10.2 8.5V17M13.8 8.5V17M17.5 8.5V17"/><path d="M5 17h14"/><path d="M3.5 20.5h17"/>',
  santuari:   '<path d="M12 3v3.6M10.3 4.8h3.4"/><path d="M12 6.6l-5 4.4v9.5h10V11z"/><path d="M12 20.5v-3.6a1.8 1.8 0 0 0 0-.01"/><path d="M10.2 20.5v-3.2a1.8 1.8 0 0 1 3.6 0v3.2"/><path d="M4.5 20.5h15"/>',
  itinerari:  '<path d="M6 20.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z"/><path d="M18 8a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 18 8z"/><path d="M8 18.3h6.5a3.4 3.4 0 0 0 0-6.8H9.5a3.4 3.4 0 0 1 0-6.8H16"/>',
  esperienze: '<path d="M12 3.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.5l5.4-.8z"/>',
  guide:      '<path d="M12 6.2C10 4.7 7.6 4.2 4 4.2v14.6c3.6 0 6 .5 8 2 2-1.5 4.4-2 8-2V4.2c-3.6 0-6 .5-8 2z"/><path d="M12 6.2v14.6"/><path d="M6.5 8.5c1.4.1 2.5.3 3.5.8M6.5 11.5c1.4.1 2.5.3 3.5.8M14 9.3c1-.5 2.1-.7 3.5-.8M14 12.3c1-.5 2.1-.7 3.5-.8"/>',
  checkin:    '<circle cx="8.2" cy="7.8" r="3.8"/><path d="M10.9 10.5L20.5 20"/><path d="M15.7 15.2l2.4-2.4M18.4 18l1.9-1.9"/>',
  wifi:       '<path d="M3 9.5C8 4.8 16 4.8 21 9.5"/><path d="M6.2 13c3.4-3.2 8.2-3.2 11.6 0"/><path d="M9.4 16.4c1.6-1.5 3.6-1.5 5.2 0"/><circle cx="12" cy="19.4" r="1.3" fill="currentColor" stroke="none"/>',
  regole:     '<rect x="5" y="3.5" width="14" height="17" rx="1.8"/><path d="M8.5 8.2h7M8.5 12h7M8.5 15.8h4.5"/>',
  ristoranti: '<path d="M7.2 3.5v7.2M4.8 3.5v4.3a2.4 2.4 0 0 0 4.8 0V3.5"/><path d="M7.2 10.7v9.8"/><path d="M16.4 3.6c-2 1.4-2.8 4.7-2.8 7.7h2.8v9.2"/>',
  negozi:     '<path d="M4.5 8l1.3-3.8h12.4L19.5 8"/><path d="M4.5 8h15v2.6a2.7 2.7 0 0 1-5.3.4 2.7 2.7 0 0 1-4.4 0 2.7 2.7 0 0 1-5.3-.4z"/><path d="M6.3 13.6v6.9h11.4v-6.9"/><path d="M10 20.5v-4.4h4v4.4"/>',
  muoversi:   '<rect x="5" y="3.8" width="14" height="12.4" rx="2.4"/><path d="M5 9.2h14"/><path d="M8 13.4h.01M16 13.4h.01"/><circle cx="8.6" cy="19.2" r="1.4"/><circle cx="15.4" cy="19.2" r="1.4"/>',
  faq:        '<circle cx="12" cy="12" r="8.8"/><path d="M9.5 9.4A2.6 2.6 0 0 1 14.6 10c0 1.8-2.6 2-2.6 3.6"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>',
  contatti:   '<path d="M6 3.5h4l1.4 4.5-2.2 1.6a12 12 0 0 0 5.2 5.2l1.6-2.2 4.5 1.4v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5z"/>',
  salute:     '<circle cx="12" cy="12" r="8.6"/><path d="M12 8v8M8 12h8"/>',
  mSole:      '<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/>',
  mSoleNuvole:'<circle cx="8.5" cy="8" r="3"/><path d="M8.5 2.8v1.6M3.3 8h1.6M4.8 4.3l1.1 1.1M12.2 4.3l-1.1 1.1"/><path d="M8 20.5h9.5a3.5 3.5 0 0 0 .6-6.95A5 5 0 0 0 8.6 13 3.8 3.8 0 0 0 8 20.5z"/>',
  mNuvola:    '<path d="M7 19.5h10.5a4 4 0 0 0 .7-7.94A5.5 5.5 0 0 0 7.5 11 4.3 4.3 0 0 0 7 19.5z"/>',
  mNebbia:    '<path d="M4 9.5h16M6 13h13M4.5 16.5h14M7.5 20h9"/>',
  mPioggerella:'<path d="M7 15h10.5a3.6 3.6 0 0 0 .6-7.15A5 5 0 0 0 7.6 7.6 3.8 3.8 0 0 0 7 15z"/><path d="M9 17.5l-.6 1.6M13 17.5l-.6 1.6M17 17.5l-.6 1.6"/>',
  mPioggia:   '<path d="M7 14h10.5a3.6 3.6 0 0 0 .6-7.15A5 5 0 0 0 7.6 6.6 3.8 3.8 0 0 0 7 14z"/><path d="M9.5 16.5L8.3 20M13.5 16.5L12.3 20M17.5 16.5L16.3 20"/>',
  mNeve:      '<path d="M7 14h10.5a3.6 3.6 0 0 0 .6-7.15A5 5 0 0 0 7.6 6.6 3.8 3.8 0 0 0 7 14z"/><path d="M9 17.2h.01M12.5 19h.01M16 17.2h.01M10.8 20.6h.01M14.3 16h.01" stroke-width="2.4"/>',
  mTemporale: '<path d="M7 13.5h10.5a3.6 3.6 0 0 0 .6-7.15A5 5 0 0 0 7.6 6.1 3.8 3.8 0 0 0 7 13.5z"/><path d="M12.8 14l-2.6 3.8h2.8L10.6 21"/>',
  riciclo:    '<path d="M12 4l2.8 4.8h-5.6z"/><path d="M6.5 9.5L4 14l3.4 5h3.2"/><path d="M17.5 9.5L20 14l-3.4 5h-3.2"/><path d="M8.5 19l-1.4-2.2M15.5 19l1.4-2.2M12 6.5V4.6"/>',
  luce:       '<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M8 11a4 4 0 1 1 8 0c0 2-1.4 2.8-1.8 4.3h-4.4C9.4 13.8 8 13 8 11z"/><path d="M12 2.5v1.6M5 5l1.2 1.2M19 5l-1.2 1.2"/>',
  frigo:      '<rect x="7" y="3" width="10" height="18" rx="1.4"/><path d="M7 10h10"/><path d="M9.5 6v2M9.5 13v3"/>',
  pulizia:    '<path d="M14 3l-2.5 8"/><path d="M8 11h8l1.5 9h-11z"/><path d="M9.5 14.5v3M12 14.5v3M14.5 14.5v3"/>',
  aria:       '<path d="M4 8h10a2.5 2.5 0 1 0-2.5-2.5"/><path d="M4 12h14a2.5 2.5 0 1 1-2.5 2.5"/><path d="M4 16h7a2.2 2.2 0 1 1-2.2 2.2"/>',
  piscina:    '<path d="M9 16V5.5a1.8 1.8 0 0 1 3.6 0M15 16V5.5"/><path d="M9 8.5h6M9 12.5h6"/><path d="M3 18.5c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/>',
  ospiti:     '<circle cx="9" cy="8" r="3"/><path d="M4 20v-1.5A4.5 4.5 0 0 1 8.5 14h1A4.5 4.5 0 0 1 14 18.5V20"/><circle cx="17" cy="9.2" r="2.4"/><path d="M15.8 13.5c2.8 0 4.7 1.7 4.7 4.3V20"/>',
  animali:    '<circle cx="7" cy="9" r="1.6"/><circle cx="11" cy="6.5" r="1.6"/><circle cx="15.5" cy="7.5" r="1.6"/><circle cx="18.4" cy="11" r="1.5"/><path d="M8.5 15.5c0-2 1.8-3.8 4-3.8s4 1.8 4 3.8c0 1.7-1.2 3-2.8 3-1 0-1.2-.4-2.2-.4s-1.2.4-2.2.4c-1.6 0-2.8-1.3-2.8-3z"/>',
  auto:       '<path d="M5 16.5V12l1.8-5h10.4L19 12v4.5"/><path d="M5 12h14"/><circle cx="7.8" cy="16" r="1.4"/><circle cx="16.2" cy="16" r="1.4"/><path d="M4.5 19h15"/>',
  treno:      '<rect x="6" y="3.5" width="12" height="13" rx="2.6"/><path d="M6 9.5h12"/><circle cx="9.3" cy="13.3" r="1.1"/><circle cx="14.7" cy="13.3" r="1.1"/><path d="M8.5 17l-2 3.5M15.5 17l2 3.5M7.5 20.5h9"/>',
  bici:       '<circle cx="6" cy="16.5" r="3.4"/><circle cx="18" cy="16.5" r="3.4"/><path d="M6 16.5L9.5 9h5.8"/><path d="M12 16.5L9.5 9"/><path d="M15.3 9l2.7 7.5"/><path d="M13.8 6.5h3"/>',
  taxi:       '<path d="M5 16.5V12l1.8-4.5h10.4L19 12v4.5"/><path d="M5 12h14"/><circle cx="7.8" cy="16" r="1.4"/><circle cx="16.2" cy="16" r="1.4"/><path d="M10 7.5V5.2h4v2.3"/>',
  uscita:     '<path d="M9 4.5H5.5v15H9"/><path d="M13 8l4 4-4 4"/><path d="M17 12H8.5"/>',
  servizi:    '<path d="M5 20.5V5.2A1.7 1.7 0 0 1 6.7 3.5h6.1a1.7 1.7 0 0 1 1.7 1.7v15.3"/><path d="M4 20.5h11.5"/><path d="M7.5 7h4.5M7.5 10.5h4.5"/><path d="M14.5 9.5h2.4a1.6 1.6 0 0 1 1.6 1.6v6.2a1.35 1.35 0 1 0 2.7 0V10l-2-2"/>',
  benzina:    '<path d="M5 20.5V5.2A1.7 1.7 0 0 1 6.7 3.5h6.1a1.7 1.7 0 0 1 1.7 1.7v15.3"/><path d="M4 20.5h11.5"/><path d="M7.5 7h4.5M7.5 10.5h4.5"/><path d="M14.5 9.5h2.4a1.6 1.6 0 0 1 1.6 1.6v6.2a1.35 1.35 0 1 0 2.7 0V10l-2-2"/>',
  posta:      '<rect x="3.5" y="5.5" width="17" height="13" rx="1.6"/><path d="M4.5 7l7.5 6 7.5-6"/>',
  banca:      '<path d="M4 9.5L12 4l8 5.5"/><path d="M5.5 9.5h13"/><path d="M7 9.5v7M12 9.5v7M17 9.5v7"/><path d="M5 16.5h14M4 19.5h16"/>',
  edicola:    '<path d="M4.5 7.5h11v12h-11z"/><path d="M15.5 9.5l4-1.5v10l-4 1.5"/><path d="M7 10.5h6M7 13.5h6M7 16.5h4"/>',
  tabacchi:   '<rect x="4" y="4" width="16" height="16" rx="1.6"/><path d="M8.5 8.5h7M12 8.5v7.5"/>',
  casa:       '<path d="M4 11.5L12 4.5l8 7"/><path d="M6.3 10v10h11.4V10"/><path d="M10 20v-5h4v5"/>',
  mappa:      '<path d="M9 4.5L4 6.3v13.2L9 17.7l6 1.8 5-1.8V4.5L15 6.3z"/><path d="M9 4.5v13.2M15 6.3v13.2"/>',
  elenco:     '<path d="M8.5 6h11M8.5 12h11M8.5 18h11"/><circle cx="4.6" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.6" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.6" cy="18" r="1.2" fill="currentColor" stroke="none"/>'
};
function icona(nome) {
  if (typeof ICONE === 'undefined' || !ICONE) return '';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
         (ICONE[nome] || ICONE.posti) + '</svg>';
}

function mostraHome(si) {
  $('#home').setAttribute('aria-hidden', si ? 'false' : 'true');
  if (si) mostraPagina(null);
}
function mostraPagina(id) {
  var n = $('#pagina');
  if (!id) { n.setAttribute('aria-hidden', 'true'); return; }
  var p = GUIDA.PAGINE[id];
  if (!p) return;
  n.__pid = id;
  statConta('sezioni', 'pagina:' + id);
  statPasso('pagina:' + id);
  $('#pagina-titolo').textContent = T2(p.titolo, p.titolo_en);
  var corpo = $('#pagina-corpo');
  vuota(corpo);
  for (var i = 0; i < p.blocchi.length; i++) {
    var b = p.blocchi[i];
    if (b.avviso) {
      var av = el('div', 'avviso-regole');
      av.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v8M12 17h.01"/><circle cx="12" cy="12" r="9.4"/></svg>';
      av.appendChild(el('span', null, T2(b.avviso, b.avviso_en)));
      corpo.appendChild(av);
    }
    else if (b.t) {
      var h3 = el('h3');
      if (b.icona) {
        var ic = el('span', 'titolo-icona');
        ic.innerHTML = icona(b.icona);
        h3.appendChild(ic);
      }
      h3.appendChild(el('span', null, T2(b.t, b.t_en)));
      corpo.appendChild(h3);
    }
    else if (b.p) corpo.appendChild(el('p', null, T2(b.p, b.p_en)));
    else if (b.kv) {
      var kvl = (lingua === 'en' && b.kv_en) ? b.kv_en : b.kv;
      for (var j = 0; j < kvl.length; j++) {
        var r = el('div', 'kv');
        if (kvl[j][2]) {
          var ki = el('span', 'kv-icona');
          ki.innerHTML = icona(kvl[j][2]);
          r.appendChild(ki);
        }
        r.appendChild(el('b', null, kvl[j][0]));
        r.appendChild(el('span', null, kvl[j][1]));
        corpo.appendChild(r);
      }
    } else if (b.img) {
      var fig = el('div', 'figura');
      var fim = el('img');
      fim.src = b.img; fim.alt = '';
      fig.appendChild(fim);
      if (b.didascalia) fig.appendChild(el('p', null, T2(b.didascalia, b.didascalia_en)));
      corpo.appendChild(fig);
    } else if (b.card) {
      var c = el('div', 'card');
      c.appendChild(el('b', null, b.card.nome));
      if (b.card.dove) c.appendChild(el('div', 'dove', b.card.dove));
      if (b.card.testo) c.appendChild(el('p', null, T2(b.card.testo, b.card.testo_en)));
      corpo.appendChild(c);
    }
  }
  corpo.scrollTop = 0;
  n.setAttribute('aria-hidden', 'false');
  mostraHome(false);
}
function apriSezione(idGruppo) {
  statConta('sezioni', idGruppo);
  statPasso('sez:' + idGruppo);
  stato.gruppo = idGruppo;
  chiudiDettaglio();
  disegnaFiltri();
  disegnaElenco();
  aggiornaPoi();
  panoramica();
  mostraHome(false);
  mostraPagina(null);
}
function disegnaHome() {
  var ben = GUIDA.benvenuto || {};
  $('#home-titolo').textContent = T2(ben.titolo, ben.titolo_en) || 'Benvenuti!';
  $('#home-sotto').textContent = T2(ben.sotto, ben.sotto_en) || '';
  $('#home-invito').textContent = TXT('invito');
  var hb = $('#home-beta'); if (hb) hb.textContent = TXT('beta');
  var griglia = $('#mattonelle');
  vuota(griglia);
  var m = GUIDA.MATTONELLE || [];
  var fascia = null;
  for (var i = 0; i < m.length; i++) {
    if (m[i].gruppo) {
      griglia.appendChild(el('div', 'gruppo-mattonelle', T2(m[i].gruppo, m[i].gruppo_en)));
      fascia = el('div', 'fascia');
      griglia.appendChild(fascia);
      continue;
    }
    (function (v) {
      var b = el('button', 'mattonella');
      b.type = 'button';
      var c = el('div', 'cerchio');
      c.innerHTML = icona(v.icona);
      if (v.colore) { c.style.color = v.colore; c.style.background = v.colore + '22'; }
      b.appendChild(c);
      b.appendChild(el('b', null, T2(v.nome, v.nome_en)));
      tocca(b, function () {
        if (v.pagina) mostraPagina(v.pagina);
        else if (v.sezione) {
          apriSezione(v.sezione);
          if (v.schermo === 'mappa' && window.__assetta) {
            window.__assetta('solo-mappa');
            if (window.__aggiornaFrecce) setTimeout(window.__aggiornaFrecce, 60);
          }
        }
      });
      /* niente doppioni di stile: il colore arriva dai gruppi */
      (fascia || griglia).appendChild(b);
    })(m[i]);
  }
}
disegnaHome();
tocca($('#pagina-home'), function () { mostraHome(true); });
tocca($('#sez-home'), function () { chiudiDettaglio(); mostraHome(true); });

/* ---- cambio lingua: ridisegna tutto cio' che e' a schermo ---- */
function bandiera(cod) {
  if (cod === 'en') {
    return '<svg viewBox="0 0 24 16" width="28" height="19" aria-hidden="true">' +
      '<rect width="24" height="16" fill="#1a3a7c"/>' +
      '<path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="3.2"/>' +
      '<path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" stroke-width="1.6"/>' +
      '<path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/>' +
      '<path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="2.8"/></svg>';
  }
  return '<svg viewBox="0 0 24 16" width="28" height="19" aria-hidden="true">' +
    '<rect width="8" height="16" fill="#008c45"/><rect x="8" width="8" height="16" fill="#fff"/>' +
    '<rect x="16" width="8" height="16" fill="#cd212a"/></svg>';
}
function scriviFissi() {
  $('#reset span').textContent = TXT('inizio');
  $('#sez-home').textContent = TXT('tutteSezioni');
  $('#pagina-home').textContent = TXT('tutteSezioni');
  $('#det-indietro').textContent = TXT('tornaElenco');
  $('#det-mappa').textContent = TXT('vediMappa');
  $('#panoramica').textContent = TXT('panoramica');
  $('#testata h1').textContent = TXT('titolo');
  $('#testata .scritte p').textContent = TXT('guida');
  var bit = $('#lingua-it'), ben = $('#lingua-en');
  if (bit) {
    bit.className = 'bandiera' + (lingua === 'it' ? ' attiva' : '');
    ben.className = 'bandiera' + (lingua === 'en' ? ' attiva' : '');
    bit.setAttribute('aria-pressed', lingua === 'it' ? 'true' : 'false');
    ben.setAttribute('aria-pressed', lingua === 'en' ? 'true' : 'false');
  }
}
function impostaLingua(nuova) {
  if (nuova === lingua) return;
  lingua = nuova;
  scriviFissi();
  disegnaHome();
  disegnaFiltri();
  disegnaElenco();
  if (window.__aggiornaFrecce) window.__aggiornaFrecce();
  if (stato.aperta) apriDettaglio(stato.aperta);
  meteoWidget();
  var pg = $('#pagina');
  if (pg.getAttribute('aria-hidden') === 'false' && pg.__pid) {
    if (pg.__pid === '__meteo__') meteoPagina();
    else mostraPagina(pg.__pid);
  }
}
(function () {
  var bit = $('#lingua-it'), ben = $('#lingua-en');
  if (bit) { bit.innerHTML = bandiera('it'); ben.innerHTML = bandiera('en'); }
  tocca(bit, function () { impostaLingua('it'); });
  tocca(ben, function () { impostaLingua('en'); });
  scriviFissi();
})();

/* ------------------------ RICOMINCIA ------------------------------ */
function ricomincia() {
  if (lingua !== 'it') { lingua = 'it'; scriviFissi(); disegnaHome(); }
  /* cambiaBase() commuta: chiamarla solo se non siamo gia' sulla base iniziale */
  if (stato.base !== CONFIG.BASE_INIZIALE) cambiaBase();
  stato.gruppo = CONFIG.GRUPPO_INIZIALE;
  stato.terreno = CONFIG.AVVIO_3D;
  stato.pinVisibili = true;
  ['poi-icone', 'poi-nomi', 'scelto-anello'].forEach(function (id) {
    try { if (mappa && mappa.getLayer(id)) mappa.setLayoutProperty(id, 'visibility', 'visible'); } catch (e) {}
  });
  var bp = $('#cmd-pin'); if (bp) bp.className = 'cmd';
  stato.inclinata = false;
  chiudiDettaglio();
  disegnaFiltri();
  disegnaElenco();
  $('#elenco').scrollTop = 0;
  window.__assetta(null);
  if (window.__aggiornaFrecce) window.__aggiornaFrecce();
  if (mappa && stato.mappaPronta) {
    applicaTerreno();
    applicaVista();
    aggiornaPoi();
    mappa.easeTo({ bearing: 0, duration: 400 });
    panoramica();
  }
  chiudiDocumento();
  mostraHome(true);   /* si riparte dalla schermata di benvenuto */
}
tocca($('#reset'), ricomincia);

/* 2 minuti fermi -> schermata iniziale; 10 minuti -> video di attesa */
(function () {
  var t = null, ts = null;
  var standby = $('#standby'), video = $('#standby-video');
  /* ---- slideshow dei contenuti: foto dei luoghi, dissolvenza incrociata ---- */
  var slide = { lista: [], indice: 0, timer: null, fronte: 'a' };
  function slideLista() {
    if (slide.lista.length) return slide.lista;
    var i;
    /* in vetrina solo il territorio: niente negozi, farmacie o guide */
    for (i = 0; i < LUOGHI.length; i++) {
      if (LUOGHI[i].immagine &&
          LUOGHI[i].categoria !== 'negozi' && LUOGHI[i].categoria !== 'salute' &&
          LUOGHI[i].categoria !== 'ristoranti' && LUOGHI[i].categoria !== 'diving') {
        slide.lista.push({ img: LUOGHI[i].immagine,
          testo: LUOGHI[i].nome, tipo: LUOGHI[i].categoria });
      }
    }
    for (i = 0; i < ESPERIENZE.length; i++) {
      if (ESPERIENZE[i].immagine && ESPERIENZE[i].tipo !== 'guida') {
        slide.lista.push({ img: ESPERIENZE[i].immagine,
          testo: ESPERIENZE[i].nome, tipo: null });
      }
    }
    /* mescolata una volta sola: ogni accensione un giro diverso */
    for (i = slide.lista.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = slide.lista[i]; slide.lista[i] = slide.lista[j]; slide.lista[j] = t;
    }
    return slide.lista;
  }
  function slideMostra() {
    var lista = slideLista();
    if (!lista.length) return;
    var v = lista[slide.indice % lista.length];
    slide.indice++;
    var davanti = $('#sb-' + slide.fronte);
    slide.fronte = slide.fronte === 'a' ? 'b' : 'a';
    var dietro = $('#sb-' + slide.fronte);
    /* si carica dietro, si dissolve quando la foto e' pronta */
    dietro.onload = function () {
      /* sgranate a tutto schermo: sotto i 600x380 si passa oltre */
      if (dietro.naturalWidth < 600 || dietro.naturalHeight < 380) {
        slide.scarti = (slide.scarti || 0) + 1;
        if (slide.scarti < 12) slideMostra();
        return;
      }
      slide.scarti = 0;
      dietro.classList.add('viva');
      davanti.classList.remove('viva');
      var did = $('#sb-didascalia');
      did.textContent = v.testo + (v.tipo ? ' \u00b7 ' + nomeCategoria(v.tipo) : '');
    };
    dietro.src = v.img;
  }
  function avviaSlide() {
    fermaSlide();
    slideMostra();
    slide.timer = setInterval(slideMostra, 7000);
  }
  function fermaSlide() {
    if (slide.timer) { clearInterval(slide.timer); slide.timer = null; }
  }
  var battito = null;
  function entraStandby() {
    statChiudiVisita();
    ricomincia();
    standby.setAttribute('aria-hidden', 'false');
    /* la CTA non deve MAI restare statica: i pannelli LG attenuano le aree
       immobili sovrapposte a video, e il compositor puo' retrocedere un
       layer fermo. Ogni battito i pixel cambiano e il layer si ricompone. */
    if (battito) clearInterval(battito);
    battito = setInterval(function () {
      var velo = $('#standby-velo');
      if (velo) velo.classList.toggle('alterna');
    }, 5000);
    /* sotto il video non deve comporre nient'altro: la GPU del monitor
       non regge video in loop e WebGL insieme (provato: si blocca) */
    document.body.classList.add('in-standby');
    avviaSlide();
  }
  function esciStandby() {
    if (battito) { clearInterval(battito); battito = null; }
    if (standby.getAttribute('aria-hidden') === 'false') {
      standby.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('in-standby');
      fermaSlide();
      if (mappa) { try { mappa.resize(); } catch (e) {} }
    }
  }
  window.__provaStandby = entraStandby;   /* per collaudo manuale dalla console */
  /* pannello statistiche: tre tocchi rapidi in basso a DESTRA */
  (function () {
    var n = $('#angolo-stat');
    if (!n) return;
    var tocchi = 0, primo = 0;
    n.addEventListener('pointerup', function () {
      var ora = Date.now();
      if (ora - primo > 1500) { tocchi = 0; primo = ora; }
      if (++tocchi >= 3) { tocchi = 0; setTimeout(mostraStatistiche, 50); }
    });
  })();
  /* tasto segreto: tre tocchi rapidi nell'angolo in basso a sinistra */
  (function () {
    var n = $('#angolo-segreto');
    if (!n) return;
    var tocchi = 0, primo = 0;
    n.addEventListener('pointerup', function () {
      var ora = Date.now();
      if (ora - primo > 1500) { tocchi = 0; primo = ora; }
      if (++tocchi >= 3) { tocchi = 0; setTimeout(entraStandby, 50); }
    });
  })();
  function azzera() {
    statTocco();
    esciStandby();
    if (t) clearTimeout(t);
    if (ts) clearTimeout(ts);
    t = setTimeout(ricomincia, CONFIG.IDLE_MS);
    ts = setTimeout(entraStandby, CONFIG.STANDBY_MS);
  }
  ['pointerdown', 'pointerup', 'wheel', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, azzera, { passive: true });
  });
  azzera();
})();

/* =====================================================================
   Lockdown della pagina (mai dentro il canvas della mappa)
   ===================================================================== */
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
document.addEventListener('dragstart', function (e) { e.preventDefault(); });
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('selectstart', function (e) {
  if (!e.target.closest || !e.target.closest('#mappa')) e.preventDefault();
});
(function () {
  var ultimo = 0;
  document.addEventListener('touchend', function (e) {
    var ora = Date.now();
    if (ora - ultimo < 350 && (!e.target.closest || !e.target.closest('#mappa'))) e.preventDefault();
    ultimo = ora;
  }, { passive: false });
})();

/* =====================================================================
   Rete e ridimensionamento
   ===================================================================== */
window.addEventListener('offline', function () {
  mostraAvviso(TXT('offline'), 0);
});
window.addEventListener('online', function () {
  mostraAvviso(TXT('online'), 3000);
  if (mappa) mappa.resize();
});

(function () {
  if (typeof ResizeObserver !== 'function') return;
  var att = null;
  var ro = new ResizeObserver(function () {
    if (att) clearTimeout(att);
    att = setTimeout(function () {
      scala();
      if (mappa) mappa.resize();
    }, 120);
  });
  ro.observe(document.documentElement);
  ro.observe($('#mappa-lato'));
})();

/* =====================================================================
   PANNELLO STATISTICHE (solo per la reception)
   ===================================================================== */
function statDurata(sec) {
  if (sec < 60) return sec + ' s';
  var m = Math.floor(sec / 60);
  if (m < 60) return m + ' min ' + (sec % 60) + ' s';
  return Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
}
function statLunedi(giorno) {
  var dt = new Date(giorno + 'T12:00:00');
  var g = (dt.getDay() + 6) % 7;            /* lunedi' = 0 */
  dt.setDate(dt.getDate() - g);
  return dt.toISOString().slice(0, 10);
}
function statGiornoBreve(iso) {
  var N = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  var dt = new Date(iso + 'T12:00:00');
  return N[dt.getDay()] + ' ' + iso.slice(8, 10) + '/' + iso.slice(5, 7);
}

function mostraStatistiche() {
  if (visita) visita.servizio = true;   /* questa non e' la visita di un ospite */
  var d = statLeggi();
  var n = $('#statistiche'), corpo = $('#statistiche-corpo');
  vuota(corpo);

  function titolo(t, sotto) {
    corpo.appendChild(el('h3', null, t));
    if (sotto) corpo.appendChild(el('p', 'stat-nota', sotto));
  }
  function classifica(dati, quante, formato) {
    var voci = Object.keys(dati).map(function (k) { return [k, dati[k]]; });
    voci.sort(function (a, b) { return b[1] - a[1]; });
    if (!voci.length) { corpo.appendChild(el('p', 'stat-vuoto', 'ancora niente')); return; }
    var max = voci[0][1];
    voci.slice(0, quante).forEach(function (v) {
      var r = el('div', 'stat-riga');
      var barra = el('div', 'stat-barra');
      barra.style.width = Math.max(4, Math.round(v[1] / max * 100)) + '%';
      r.appendChild(el('b', null, statEtichetta(v[0])));
      r.appendChild(barra);
      r.appendChild(el('span', null, formato ? formato(v[1]) : v[1]));
      corpo.appendChild(r);
    });
  }

  /* ---------------- quadro d'insieme ---------------- */
  var giorni = Object.keys(d.giorni).sort();
  var tot = { s: 0, sec: 0, passi: 0, oltre: 0 };
  giorni.forEach(function (g) {
    var r = d.giorni[g];
    tot.s += r.s; tot.sec += r.sec; tot.passi += r.passi; tot.oltre += r.oltre;
  });
  var oggi = statOggi();
  var settimana = statLunedi(oggi);
  var qGiorno = d.giorni[oggi] || { s: 0, sec: 0 };
  var qSett = { s: 0, sec: 0 };
  giorni.forEach(function (g) {
    if (statLunedi(g) === settimana) { qSett.s += d.giorni[g].s; qSett.sec += d.giorni[g].sec; }
  });

  corpo.appendChild(el('p', 'stat-riassunto',
    tot.s + ' visite dal ' + d.da + ' \u00b7 solo su questo schermo'));
  var q = el('div', 'stat-quadro');
  function cifra(valore, etich) {
    var b = el('div', 'stat-cifra');
    b.appendChild(el('b', null, valore));
    b.appendChild(el('span', null, etich));
    q.appendChild(b);
  }
  cifra(qGiorno.s, 'visite oggi');
  cifra(qSett.s, 'questa settimana');
  cifra(tot.s ? statDurata(Math.round(tot.sec / tot.s)) : '\u2014', 'durata media');
  cifra(tot.s ? Math.round(tot.oltre / tot.s * 100) + '%' : '—', 'oltre la home');
  cifra(tot.s ? (tot.passi / tot.s).toFixed(1) : '\u2014', 'schermate a visita');
  corpo.appendChild(q);
  if (tot.s && tot.oltre / tot.s < 0.5) {
    corpo.appendChild(el('p', 'stat-nota',
      'Meno di una visita su due va oltre la schermata iniziale: molti toccano e se ne vanno.'));
  }

  /* ---------------- giorno per giorno ---------------- */
  titolo('Ultimi 14 giorni', 'barra = visite; a destra il tempo d\u2019uso totale');
  var ultimi = giorni.slice(-14);
  if (!ultimi.length) corpo.appendChild(el('p', 'stat-vuoto', 'ancora niente'));
  var maxG = 1;
  ultimi.forEach(function (g) { if (d.giorni[g].s > maxG) maxG = d.giorni[g].s; });
  ultimi.forEach(function (g) {
    var r = el('div', 'stat-riga');
    var barra = el('div', 'stat-barra');
    barra.style.width = Math.max(4, Math.round(d.giorni[g].s / maxG * 100)) + '%';
    r.appendChild(el('b', null, statGiornoBreve(g)));
    r.appendChild(barra);
    r.appendChild(el('span', null, d.giorni[g].s + ' \u00b7 ' + statDurata(d.giorni[g].sec)));
    corpo.appendChild(r);
  });

  /* ---------------- settimane ---------------- */
  titolo('Settimane', 'dal lunedi\u2019; media = durata di una visita');
  var sett = {};
  giorni.forEach(function (g) {
    var k = statLunedi(g);
    var r = sett[k] || (sett[k] = { s: 0, sec: 0 });
    r.s += d.giorni[g].s; r.sec += d.giorni[g].sec;
  });
  var chiaviS = Object.keys(sett).sort().slice(-8);
  if (!chiaviS.length) corpo.appendChild(el('p', 'stat-vuoto', 'ancora niente'));
  var maxS = 1;
  chiaviS.forEach(function (k) { if (sett[k].s > maxS) maxS = sett[k].s; });
  chiaviS.forEach(function (k) {
    var r = el('div', 'stat-riga');
    var barra = el('div', 'stat-barra');
    barra.style.width = Math.max(4, Math.round(sett[k].s / maxS * 100)) + '%';
    r.appendChild(el('b', null, 'dal ' + k.slice(8, 10) + '/' + k.slice(5, 7)));
    r.appendChild(barra);
    r.appendChild(el('span', null, sett[k].s + ' \u00b7 media ' +
      (sett[k].s ? statDurata(Math.round(sett[k].sec / sett[k].s)) : '\u2014')));
    corpo.appendChild(r);
  });

  /* ---------------- ore della giornata ---------------- */
  titolo('A che ora lo usano', 'somma di tutti i giorni');
  var ore = {};
  giorni.forEach(function (g) {
    var o = d.giorni[g].ore || {};
    Object.keys(o).forEach(function (h) { ore[h] = (ore[h] || 0) + o[h]; });
  });
  var chiaviO = Object.keys(ore).sort(function (a, b) { return a - b; });
  if (!chiaviO.length) corpo.appendChild(el('p', 'stat-vuoto', 'ancora niente'));
  var maxO = 1;
  chiaviO.forEach(function (h) { if (ore[h] > maxO) maxO = ore[h]; });
  chiaviO.forEach(function (h) {
    var r = el('div', 'stat-riga');
    var barra = el('div', 'stat-barra');
    barra.style.width = Math.max(4, Math.round(ore[h] / maxO * 100)) + '%';
    r.appendChild(el('b', null, (h.length < 2 ? '0' + h : h) + ':00'));
    r.appendChild(barra);
    r.appendChild(el('span', null, ore[h]));
    corpo.appendChild(r);
  });

  /* ---------------- come si muovono ---------------- */
  var primi = {}, ultimiP = {}, dwell = {}, dwellN = {}, percorsi = {}, lingue = {};
  d.sessioni.forEach(function (v) {
    var p = v.p || [];
    lingue[v.l === 'en' ? 'inglese' : 'italiano'] = (lingue[v.l === 'en' ? 'inglese' : 'italiano'] || 0) + 1;
    if (p.length > 1) primi[p[1][0]] = (primi[p[1][0]] || 0) + 1;
    if (p.length) ultimiP[p[p.length - 1][0]] = (ultimiP[p[p.length - 1][0]] || 0) + 1;
    /* l'ULTIMA schermata di ogni visita e' esclusa dalle medie di permanenza:
       il tempo su una schermata si misura solo vedendo quando la si lascia, e
       dell'ultima non lo sappiamo (l'ospite se ne va senza toccare piu' nulla).
       Contarla come zero falserebbe verso il basso proprio le schede su cui la
       gente si ferma di piu'. Per "Dove si fermano" invece va benissimo. */
    p.slice(0, -1).forEach(function (passo) {
      dwell[passo[0]] = (dwell[passo[0]] || 0) + passo[1];
      dwellN[passo[0]] = (dwellN[passo[0]] || 0) + 1;
    });
    if (p.length > 1) {
      var catena = p.slice(1, 4).map(function (x) { return statEtichetta(x[0]); }).join(' \u2192 ');
      if (catena) percorsi[catena] = (percorsi[catena] || 0) + 1;
    }
  });

  titolo('Da dove partono', 'il primo riquadro toccato dopo la schermata iniziale');
  classifica(primi, 10);

  titolo('Dove si fermano', 'l\u2019ultima schermata prima di andarsene');
  classifica(ultimiP, 10);

  titolo('Percorsi ricorrenti', 'le prime tre schermate di ogni visita');
  var pc = Object.keys(percorsi).map(function (k) { return [k, percorsi[k]]; });
  pc.sort(function (a, b) { return b[1] - a[1]; });
  if (!pc.length) corpo.appendChild(el('p', 'stat-vuoto', 'ancora niente'));
  pc.slice(0, 8).forEach(function (v) {
    var r = el('div', 'stat-percorso');
    r.appendChild(el('b', null, v[0]));
    r.appendChild(el('span', null, v[1] + '\u00d7'));
    corpo.appendChild(r);
  });

  titolo('Schermate che trattengono di piu\u2019', 'tempo medio di permanenza, da 3 visite in su');
  var med = {};
  Object.keys(dwell).forEach(function (k) {
    if (dwellN[k] >= 3) med[k] = Math.round(dwell[k] / dwellN[k]);
  });
  classifica(med, 12, statDurata);

  titolo('Lingua scelta', null);
  classifica(lingue, 4);

  /* ---------------- conteggi storici ---------------- */
  titolo('Sezioni e pagine', 'aperture totali, comprese quelle registrate prima del registro');
  classifica(d.sezioni, 20);
  titolo('Schede aperte', null);
  classifica(d.voci, 20);

  n.setAttribute('aria-hidden', 'false');
}

/* esportazione: un foglio per Excel con una riga per visita */
function statEsporta() {
  var d = statLeggi();
  var righe = ['data;ora;durata_secondi;schermate;lingua;percorso'];
  d.sessioni.forEach(function (v) {
    var dt = new Date(v.t);
    righe.push([
      statOggi(v.t),
      ('0' + dt.getHours()).slice(-2) + ':' + ('0' + dt.getMinutes()).slice(-2),
      v.d, v.n, v.l,
      '"' + (v.p || []).map(function (x) { return statEtichetta(x[0]) + ' (' + x[1] + 's)'; }).join(' > ') + '"'
    ].join(';'));
  });
  righe.push('');
  righe.push('data;visite;secondi_totali;schermate;visite_oltre_la_home');
  Object.keys(d.giorni).sort().forEach(function (g) {
    var r = d.giorni[g];
    righe.push([g, r.s, r.sec, r.passi, r.oltre].join(';'));
  });
  var testo = righe.join('\r\n');
  try {
    var url = URL.createObjectURL(new Blob(['\ufeff' + testo], { type: 'text/csv' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = 'uso-chiosco-' + statOggi() + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  } catch (e) { /* niente scaricamento su questo browser: resta il testo grezzo */ }
  /* rete di sicurezza: se il monitor non sa scaricare, il testo resta selezionabile */
  var box = $('#statistiche-grezzo');
  if (box) { box.value = testo; box.hidden = false; box.select(); }
}
tocca($('#statistiche-chiudi'), function () {
  $('#statistiche').setAttribute('aria-hidden', 'true');
});
tocca($('#statistiche-azzera'), function () {
  try { localStorage.removeItem(STATS_CHIAVE); } catch (e) {}
  var box = $('#statistiche-grezzo');
  if (box) { box.hidden = true; box.value = ''; }
  mostraStatistiche();
});
tocca($('#statistiche-esporta'), statEsporta);

/* =====================================================================
   VISORE DOCUMENTI — l'orario ufficiale a schermo intero, X per chiudere
   ===================================================================== */
function apriDocumento(src) {
  $('#documento-img').src = src;
  $('#documento').setAttribute('aria-hidden', 'false');
  $('#documento-scorri').scrollTop = 0;
}
function chiudiDocumento() {
  $('#documento').setAttribute('aria-hidden', 'true');
  $('#documento-img').removeAttribute('src');
}
tocca($('#documento-chiudi'), chiudiDocumento);

/* =====================================================================
   METEO — Open-Meteo (nessuna chiave, attribuzione obbligatoria).
   Widget sobrio sulla home; il tocco apre la scheda con 7 giorni.
   Niente data e ora correnti a schermo, per scelta.
   ===================================================================== */
var METEO = { dati: null };
/* codici WMO -> icona e descrizione nelle due lingue */
function meteoVoce(codice) {
  var C = [
    [[0], 'mSole', 'Sereno', 'Clear'],
    [[1, 2], 'mSoleNuvole', 'Poco nuvoloso', 'Partly cloudy'],
    [[3], 'mNuvola', 'Coperto', 'Overcast'],
    [[45, 48], 'mNebbia', 'Nebbia', 'Fog'],
    [[51, 53, 55, 56, 57], 'mPioggerella', 'Pioggerella', 'Drizzle'],
    [[61, 63, 65, 66, 67, 80, 81, 82], 'mPioggia', 'Pioggia', 'Rain'],
    [[71, 73, 75, 77, 85, 86], 'mNeve', 'Neve', 'Snow'],
    [[95, 96, 99], 'mTemporale', 'Temporale', 'Thunderstorm']
  ];
  for (var i = 0; i < C.length; i++) {
    if (C[i][0].indexOf(codice) >= 0) return { icona: C[i][1], it: C[i][2], en: C[i][3] };
  }
  return { icona: 'mNuvola', it: '', en: '' };
}
function meteoWidget() {
  var w = $('#meteo-widget');
  if (!w || !METEO.dati || !METEO.dati.current) { if (w) w.hidden = true; return; }
  var cur = METEO.dati.current;
  var v = meteoVoce(cur.weather_code);
  w.hidden = false;
  w.innerHTML = '<span class="meteo-icona">' + icona(v.icona) + '</span>' +
    '<span class="meteo-gradi">' + Math.round(cur.temperature_2m) + '\u00b0</span>';
  w.setAttribute('aria-label', TXT('meteoTitolo'));
}
function meteoPagina() {
  var n = $('#pagina');
  n.__pid = '__meteo__';
  $('#pagina-titolo').textContent = TXT('meteoTitolo');
  var corpo = $('#pagina-corpo');
  vuota(corpo);
  if (!METEO.dati || !METEO.dati.daily) {
    corpo.appendChild(el('p', null, TXT('offline')));
  } else {
    var cur = METEO.dati.current, d = METEO.dati.daily;
    var vc = meteoVoce(cur.weather_code);
    var ora = el('div', 'meteo-adesso');
    ora.innerHTML = '<span class="grande-icona">' + icona(vc.icona) + '</span>' +
      '<div><b>' + Math.round(cur.temperature_2m) + '\u00b0C \u00b7 ' + T2(vc.it, vc.en) + '</b>' +
      '<span>' + TXT('meteoOra') + ' \u00b7 ' + TXT('meteoVento') + ' ' + Math.round(cur.wind_speed_10m) + ' km/h' +
      (cur.relative_humidity_2m !== undefined ? ' · ' + TXT('meteoUmidita') + ' ' + cur.relative_humidity_2m + '%' : '') + '</span></div>';
    corpo.appendChild(ora);
    /* le prossime 24 ore, dall'ora corrente in avanti */
    var hh = METEO.dati.hourly;
    if (hh && hh.time && hh.time.length) {
      corpo.appendChild(el('h3', null, TXT('meteoOre')));
      var da = 0;
      if (cur.time) {
        for (var q = 0; q < hh.time.length; q++) { if (hh.time[q] >= cur.time) { da = q; break; } }
      }
      corpo.appendChild(strisciaOre(da, 24));
    }
    corpo.appendChild(el('h3', null, TXT('meteoGiorni')));
    var oggi = cur.time ? cur.time.slice(0, 10) : '';
    for (var i = 0; i < d.time.length; i++) {
      var g = new Date(d.time[i] + 'T12:00:00');
      var nome = g.toLocaleDateString(lingua === 'it' ? 'it-IT' : 'en-GB', { weekday: 'long' });
      nome = nome.charAt(0).toUpperCase() + nome.slice(1);
      var dataB = g.toLocaleDateString(lingua === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long' });
      var vg = meteoVoce(d.weather_code[i]);
      var r = el('div', 'meteo-riga');
      var eOggi = d.time[i] === oggi;
      r.innerHTML = '<span class="kv-icona">' + icona(vg.icona) + '</span>' +
        '<b>' + nome + ' <span class="data-giorno">' + dataB + '</span>' + (eOggi ? ' <em class="oggi">' + TXT('meteoOggi') + '</em>' : '') + '</b>' +
        '<span class="descr">' + T2(vg.it, vg.en) + '</span>' +
        '<span class="gradi">' + Math.round(d.temperature_2m_min[i]) + '\u00b0 / ' +
        Math.round(d.temperature_2m_max[i]) + '\u00b0</span>' +
        '<span class="pioggia">' + (d.precipitation_probability_max[i] !== null
          ? TXT('meteoPioggia') + ' ' + d.precipitation_probability_max[i] + '%' : '') + '</span>';
      /* un tocco sul giorno apre il suo dettaglio ora per ora */
      (function (giorno, etichetta) {
        tocca(r, function () { meteoGiorno(giorno, etichetta); });
      })(d.time[i], nome + ' ' + dataB + (eOggi ? ' \u00b7 ' + TXT('meteoOggi') : ''));
      corpo.appendChild(r);
    }
    corpo.appendChild(el('p', 'meteo-fonte', TXT('meteoFonte')));
  }
  corpo.scrollTop = 0;
  n.setAttribute('aria-hidden', 'false');
  mostraHome(false);
}
/* una striscia di celle orarie da hh[da], per n ore */
function strisciaOre(da, n) {
  var hh = METEO.dati.hourly;
  var striscia = el('div', 'meteo-ore');
  var fine = Math.min(da + n, hh.time.length);
  for (var k = da; k < fine; k++) {
    var vo = meteoVoce(hh.weather_code[k]);
    var pp = hh.precipitation_probability ? hh.precipitation_probability[k] : null;
    var um = hh.relative_humidity_2m ? hh.relative_humidity_2m[k] : null;
    var cella = el('div', 'meteo-cella');
    cella.innerHTML = '<b>' + hh.time[k].slice(11, 16) + '</b>' +
      '<span class="cella-icona">' + icona(vo.icona) + '</span>' +
      '<span class="cella-gradi">' + Math.round(hh.temperature_2m[k]) + '°</span>' +
      '<span class="cella-pioggia">' + (pp !== null && pp > 15 ? pp + '%' : '') + '</span>' +
      '<span class="cella-umidita">' + (um !== null ? um + '%' : '') + '</span>';
    striscia.appendChild(cella);
  }
  return striscia;
}
/* il dettaglio orario del giorno scelto dall'elenco */
function meteoGiorno(giorno, etichetta) {
  var hh = METEO.dati.hourly;
  if (!hh || !hh.time) return;
  var corpo = $('#pagina-corpo');
  vuota(corpo);
  var indietro = el('button', 'bt chiaro', TXT('meteoIndietro'));
  indietro.type = 'button';
  tocca(indietro, meteoPagina);
  corpo.appendChild(indietro);
  corpo.appendChild(el('h3', null, etichetta));
  var da = -1;
  for (var q = 0; q < hh.time.length; q++) {
    if (hh.time[q].slice(0, 10) === giorno) { da = q; break; }
  }
  if (da >= 0) {
    var fine = Math.min(da + 24, hh.time.length);
    for (var k = da; k < fine; k++) {
      var vo = meteoVoce(hh.weather_code[k]);
      var pp = hh.precipitation_probability ? hh.precipitation_probability[k] : null;
      var um = hh.relative_humidity_2m ? hh.relative_humidity_2m[k] : null;
      var r = el('div', 'meteo-riga ora');
      r.innerHTML = '<b>' + hh.time[k].slice(11, 16) + '</b>' +
        '<span class="kv-icona">' + icona(vo.icona) + '</span>' +
        '<span class="descr">' + T2(vo.it, vo.en) + '</span>' +
        '<span class="gradi">' + Math.round(hh.temperature_2m[k]) + '°</span>' +
        '<span class="pioggia">' + (pp !== null && pp > 15 ? TXT('meteoPioggia') + ' ' + pp + '%' : '') + '</span>' +
        '<span class="umid">' + (um !== null ? TXT('meteoUmidita') + ' ' + um + '%' : '') + '</span>';
      corpo.appendChild(r);
    }
  }
  corpo.appendChild(el('p', 'meteo-fonte', TXT('meteoFonte')));
  corpo.scrollTop = 0;
}
function meteoAggiorna() {
  var lat = (RESIDENCE && RESIDENCE.lat) || 40.047, lng = (RESIDENCE && RESIDENCE.lng) || 15.297;
  var u = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng +
    '&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&hourly=temperature_2m,weather_code,precipitation_probability,relative_humidity_2m' +
    '&timezone=Europe%2FRome&forecast_days=7';
  fetch(u).then(function (r) { return r.json(); }).then(function (d) {
    METEO.dati = d;
    meteoWidget();
    if ($('#pagina').__pid === '__meteo__' &&
        $('#pagina').getAttribute('aria-hidden') === 'false') meteoPagina();
  })['catch'](function () { /* niente rete: il widget resta con l'ultimo dato */ });
}
tocca($('#meteo-widget'), meteoPagina);
(function () {
  var n = $('#mappa-scorcia');
  if (!n) return;
  n.innerHTML = '<span class="meteo-icona">' + icona('mappa') + '</span>';
  tocca(n, function () {
    apriSezione('tutti');
    if (window.__assetta) {
      window.__assetta('solo-mappa');
      if (window.__aggiornaFrecce) setTimeout(window.__aggiornaFrecce, 60);
    }
  });
})();
meteoAggiorna();
setInterval(meteoAggiorna, 30 * 60 * 1000);   /* ogni mezz'ora */

/* =====================================================================
   Partenza
   ===================================================================== */
etichettaBase();
applicaVista();
disegnaFiltri();
disegnaElenco();
avvia();
if (!navigator.onLine) {
  mostraAvviso(TXT('offline'), 0);
}

})();
