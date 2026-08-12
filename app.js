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
    spiagge: '#1a87c9', borghi: '#c96a2b', grotte: '#7057c9',
    natura: '#2f9e60', archeologia: '#b5892f', santuari: '#9550a8'
  },
  COLORE_SCELTO: '#dd350f',
  COLORE_CASA: '#dd350f',

  ZOOM_LUOGO: 14.5,
  PITCH_INCLINATO: 55,
  BORDO_PANORAMICA: 80,

  IDLE_MS: 120000,      /* dopo 2 minuti fermi si ricomincia da capo */
  GRUPPO_INIZIALE: 'mare'
};

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
function nomeCategoria(id) {
  for (var i = 0; i < CATEGORIE.length; i++) if (CATEGORIE[i].id === id) return CATEGORIE[i].nome;
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

var GRUPPI = [
  { id: 'mare',       nome: nomeSezione('mare', 'In primo piano'),   cat: null, voci: inEvidenza },
  { id: 'itinerari',  nome: nomeSezione('itinerari', 'Itinerari'),   cat: null, voci: function () { return espDiTipo('itinerario'); } },
  { id: 'esperienze', nome: nomeSezione('esperienze', 'Esperienze'), cat: null, voci: function () { return espDiTipo('esperienza'); } },
  { id: 'guide',      nome: nomeSezione('guide', 'Guide'),           cat: null, voci: function () { return espDiTipo('guida'); } }
];
(function () {
  for (var i = 0; i < CATEGORIE.length; i++) {
    (function (c) {
      GRUPPI.push({ id: 'cat:' + c.id, nome: c.nome, cat: c.id,
                    voci: function () { return luoghiDiCategoria(c.id); } });
    })(CATEGORIE[i]);
  }
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
  terreno: CONFIG.TERRENO_3D,
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
    '<span>Prenotabile in reception</span>';
  return b;
}

/* la navigazione fra sezioni vive nella schermata iniziale: qui resta
   solo la barra con il ritorno e il nome della sezione aperta */
function disegnaFiltri() {
  var g = gruppoCorrente();
  var n = $('#sez-nome');
  vuota(n);
  if (g.cat) {
    var p = el('span', 'pallino');
    p.style.background = colore(g.cat);
    n.appendChild(p);
  }
  n.appendChild(el('span', null, g.nome));
}

function gruppoCorrente() {
  for (var i = 0; i < GRUPPI.length; i++) if (GRUPPI[i].id === stato.gruppo) return GRUPPI[i];
  return GRUPPI[0];
}

function sottotitolo(v) {
  if (v.tipo === 'luogo') return nomeCategoria(v.dato.categoria);
  if (v.dato.tipo === 'itinerario') return 'Itinerario';
  if (v.dato.tipo === 'guida') return 'Guida';
  return 'Esperienza';
}

function disegnaElenco() {
  var n = $('#elenco');
  vuota(n);
  var g = gruppoCorrente();
  var voci = g.voci();
  if (!voci.length) { n.appendChild(el('div', 'vuoto', 'Nessuna voce in questa sezione.')); return; }
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
        /* segnaposto con l'iniziale: onesto e meno triste del vuoto */
        var sp = el('div', 'foto segnaposto', d.nome.charAt(0));
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
  stato.aperta = v;

  var foto = $('#det-foto');
  if (d.immagine) { foto.src = d.immagine; foto.parentNode.style.display = 'block'; }
  else { foto.removeAttribute('src'); foto.parentNode.style.display = 'none'; }

  $('#det-categoria').textContent = sottotitolo(v);
  $('#det-nome').textContent = d.nome;
  $('#det-sommario').textContent = d.sommario || '';
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
      if (km !== null) riga('Distanza in linea d’aria', km.toFixed(1) + ' km');
    }
    if (d.tempoAuto) riga('In auto', d.tempoAuto);
    if (d.lidi) riga('Lidi sulla spiaggia', d.lidi);
  } else if (v.tipo === 'esperienza') {
    var rif = d.luoghi || [], nomi = [];
    for (var i = 0; i < rif.length; i++) { var l = perId(rif[i]); if (l) nomi.push(l.nome); }
    if (nomi.length) riga(nomi.length > 1 ? 'Luoghi' : 'Luogo', nomi.join(', '));
  }

  var arts = $('#det-articoli');
  vuota(arts);
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
    arts.appendChild(el('p', 'avviso-vuoto', 'Per questo luogo il sito non riporta una descrizione.'));
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

  evidenzia(v);
  disegnaPercorso(v);
  volaSu(v);
}

function chiudiDettaglio() {
  stato.aperta = null;
  $('#dettaglio').classList.remove('aperto');
  $('#dettaglio').setAttribute('aria-hidden', 'true');
  evidenzia(null);
  disegnaPercorso(null);
}

/* =====================================================================
   MAPPA — luoghi come livelli nativi WebGL, non marcatori HTML
   ===================================================================== */
function featureLuogo(l) {
  return { type: 'Feature',
    properties: { id: l.id, nome: l.nome, colore: colore(l.categoria) },
    geometry: { type: 'Point', coordinates: [l.lng, l.lat] } };
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
      percorso: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } }
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

      /* i luoghi: cerchio colorato per categoria + nome */
      { id: 'poi-cerchi', type: 'circle', source: 'poi',
        paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 6.5, 14, 9],
                 'circle-color': ['get', 'colore'],
                 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 } },
      { id: 'poi-nomi', type: 'symbol', source: 'poi',
        layout: {
          'text-field': ['get', 'nome'],
          'text-font': CONFIG.FONT_MAPPA,
          'text-size': 13,
          'text-anchor': 'top',
          'text-offset': [0, 0.9],
          'text-max-width': 9,
          'text-optional': true
        },
        paint: { 'text-color': '#0c2233',
                 'text-halo-color': '#ffffff', 'text-halo-width': 1.6 } },

      /* il residence, sempre visibile */
      { id: 'casa-cerchio', type: 'circle', source: 'casa',
        paint: { 'circle-radius': 8, 'circle-color': '#ffffff',
                 'circle-stroke-color': CONFIG.COLORE_CASA, 'circle-stroke-width': 3.5 } },
      { id: 'casa-nome', type: 'symbol', source: 'casa',
        layout: { 'text-field': 'Siamo qui', 'text-font': CONFIG.FONT_MAPPA,
                  'text-size': 13, 'text-anchor': 'top', 'text-offset': [0, 0.9] },
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
    try { trovati = mappa.queryRenderedFeatures(box, { layers: ['poi-cerchi', 'poi-nomi'] }); } catch (e) {}
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
    if (erroriTile === 8) mostraAvviso('Connessione lenta: alcune parti della mappa potrebbero mancare.', 6000);
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
  $('#cmd-3d').className = 'cmd grande' + (stato.terreno ? ' acceso' : '');
}

function applicaVista() {
  /* il pulsante dice DOVE SI VA, non dove si e' */
  $('#cmd-vista').textContent = stato.inclinata ? "Vista dall'alto" : 'Vista inclinata';
  $('#cmd-vista').className = 'cmd grande' + (stato.inclinata ? ' acceso' : '');
  if (mappa && stato.mappaPronta) {
    mappa.easeTo({ pitch: stato.inclinata ? CONFIG.PITCH_INCLINATO : 0, duration: 700 });
  }
}

function cambiaBase() {
  stato.base = (stato.base === 'sat') ? 'osm' : 'sat';
  var b = CONFIG.BASI[stato.base];
  $('#cmd-base').textContent = CONFIG.BASI[stato.base === 'sat' ? 'osm' : 'sat'].etichetta;
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
  window.__assetta = assetta;   /* usata anche dal ripristino e dal reset */

  tocca($('#verso-sinistra'), function () { assetta('solo-mappa'); });
  tocca($('#verso-destra'), function () { assetta('solo-elenco'); });
  tocca($('#riapri-elenco'), function () { assetta(null); });
  tocca($('#riapri-mappa'), function () { assetta(null); });
})();

/* =====================================================================
   Comandi
   ===================================================================== */
tocca($('#cmd-base'), cambiaBase);
tocca($('#cmd-3d'), function () { stato.terreno = !stato.terreno; applicaTerreno(); });
tocca($('#cmd-vista'), function () { stato.inclinata = !stato.inclinata; applicaVista(); });
tocca($('#cmd-piu'),  function () { if (mappa) mappa.zoomIn({ duration: 400 }); });
tocca($('#cmd-meno'), function () { if (mappa) mappa.zoomOut({ duration: 400 }); });
tocca($('#cmd-casa'), vaiAlResidence);
tocca($('#panoramica'), function () { chiudiDettaglio(); panoramica(); });
tocca($('#det-indietro'), function () { chiudiDettaglio(); });
tocca($('#det-mappa'), function () {
  if (stato.aperta) volaSu(stato.aperta);
  window.__assetta(null);
});

/* =====================================================================
   SCHERMATA INIZIALE e PAGINE INFORMATIVE (contenuti in guida.js)
   ===================================================================== */
var GUIDA = window.GUIDA || { MATTONELLE: [], PAGINE: {}, benvenuto: {} };

/* icone disegnate a mano: linee semplici, niente emoji (font incerti su webOS) */
var ICONE = {
  posti:      '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>',
  spiagge:    '<path d="M3 18c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/><path d="M3 13.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/><circle cx="17.5" cy="6" r="2.6"/>',
  barca:      '<path d="M4 15h16l-2.5 4h-11z"/><path d="M12 4v11"/><path d="M12 5c4 1.5 6 4 6.5 8"/>',
  sentiero:   '<path d="M5 20c6 0 2-7 8-7s2-7 6-7"/><circle cx="19" cy="4.5" r="1.6"/><circle cx="5" cy="20" r="1.6"/>',
  ristorante: '<path d="M7 3v7M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3"/><path d="M7 10v11"/><path d="M16 3c-2 1.5-2.7 5-2.7 8H16v10"/>',
  negozio:    '<path d="M4 8l1.4-4h13.2L20 8"/><path d="M4 8h16v3a3 3 0 0 1-6 0 3 3 0 0 1-5 0 3 3 0 0 1-5 0z"/><path d="M6 13.5V20h12v-6.5"/>',
  bus:        '<rect x="5" y="3.5" width="14" height="13" rx="2.4"/><path d="M5 9h14"/><circle cx="8.6" cy="19" r="1.6"/><circle cx="15.4" cy="19" r="1.6"/>',
  chiave:     '<circle cx="8" cy="8" r="4.2"/><path d="M11 11l9 9"/><path d="M16.5 16.5l2.6-2.6M19 19l2-2"/>',
  regole:     '<rect x="5" y="3" width="14" height="18" rx="1.8"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  wifi:       '<path d="M3 9.5C8 4.8 16 4.8 21 9.5"/><path d="M6.2 13c3.4-3.2 8.2-3.2 11.6 0"/><path d="M9.4 16.4c1.6-1.5 3.6-1.5 5.2 0"/><circle cx="12" cy="19.4" r="1.4"/>',
  faq:        '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.4A2.6 2.6 0 0 1 14.6 10c0 1.8-2.6 2-2.6 3.6"/><circle cx="12" cy="17" r="1.1"/>',
  telefono:   '<path d="M6 3.5h4l1.4 4.5-2.2 1.6a12 12 0 0 0 5.2 5.2l1.6-2.2 4.5 1.4v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7 2 2 0 0 1 6 3.5z"/>',
  grotta:     '<path d="M3 20h18"/><path d="M4 20V12a8 8 0 0 1 16 0v8"/><path d="M9.5 20v-4a2.5 2.5 0 0 1 5 0v4"/>',
  natura:     '<path d="M12 21V9"/><path d="M12 9C7 9 4.5 5.5 4.5 3c4 0 7.5 1.5 7.5 6z"/><path d="M12 13c0-4.5 3.5-6 7.5-6 0 2.5-2.5 6-7.5 6z"/>',
  tempio:     '<path d="M4 8l8-4.5L20 8"/><path d="M5 8h14"/><path d="M6.5 8v8M10 8v8M14 8v8M17.5 8v8"/><path d="M4 18.5h16M3 21h18"/>',
  santuario:  '<path d="M12 3v4M10 5h4"/><path d="M7 21v-8.5L12 8l5 4.5V21"/><path d="M10.5 21v-4h3v4"/><path d="M4 21h16"/>',
  stella:     '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9z"/>',
  libro:      '<path d="M12 6c-2-1.6-4.5-2-8-2v14c3.5 0 6 .4 8 2 2-1.6 4.5-2 8-2V4c-3.5 0-6 .4-8 2z"/><path d="M12 6v14"/>'
};
function icona(nome) {
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
  $('#pagina-titolo').textContent = p.titolo;
  var corpo = $('#pagina-corpo');
  vuota(corpo);
  for (var i = 0; i < p.blocchi.length; i++) {
    var b = p.blocchi[i];
    if (b.t) corpo.appendChild(el('h3', null, b.t));
    else if (b.p) corpo.appendChild(el('p', null, b.p));
    else if (b.kv) {
      for (var j = 0; j < b.kv.length; j++) {
        var r = el('div', 'kv');
        r.appendChild(el('b', null, b.kv[j][0]));
        r.appendChild(el('span', null, b.kv[j][1]));
        corpo.appendChild(r);
      }
    } else if (b.card) {
      var c = el('div', 'card');
      c.appendChild(el('b', null, b.card.nome));
      if (b.card.dove) c.appendChild(el('div', 'dove', b.card.dove));
      if (b.card.testo) c.appendChild(el('p', null, b.card.testo));
      corpo.appendChild(c);
    }
  }
  corpo.scrollTop = 0;
  n.setAttribute('aria-hidden', 'false');
  mostraHome(false);
}
function apriSezione(idGruppo) {
  stato.gruppo = idGruppo;
  chiudiDettaglio();
  disegnaFiltri();
  disegnaElenco();
  aggiornaPoi();
  panoramica();
  mostraHome(false);
  mostraPagina(null);
}
(function () {
  var ben = GUIDA.benvenuto || {};
  $('#home-titolo').textContent = ben.titolo || 'Benvenuto!';
  $('#home-sotto').textContent = ben.sotto || '';
  var griglia = $('#mattonelle');
  var m = GUIDA.MATTONELLE || [];
  for (var i = 0; i < m.length; i++) {
    if (m[i].gruppo) { griglia.appendChild(el('div', 'gruppo-mattonelle', m[i].gruppo)); continue; }
    (function (v) {
      var b = el('button', 'mattonella');
      b.type = 'button';
      var c = el('div', 'cerchio');
      c.innerHTML = icona(v.icona);
      b.appendChild(c);
      b.appendChild(el('b', null, v.nome));
      tocca(b, function () {
        if (v.pagina) mostraPagina(v.pagina);
        else if (v.sezione) apriSezione(v.sezione);
      });
      griglia.appendChild(b);
    })(m[i]);
  }
  tocca($('#pagina-home'), function () { mostraHome(true); });
  tocca($('#sez-home'), function () { chiudiDettaglio(); mostraHome(true); });
  tocca($('#pagina-esplora'), function () { apriSezione(stato.gruppo); });
})();

/* ------------------------ RICOMINCIA ------------------------------ */
function ricomincia() {
  /* cambiaBase() commuta: chiamarla solo se non siamo gia' sulla base iniziale */
  if (stato.base !== CONFIG.BASE_INIZIALE) cambiaBase();
  stato.gruppo = CONFIG.GRUPPO_INIZIALE;
  stato.terreno = CONFIG.TERRENO_3D;
  stato.inclinata = false;
  chiudiDettaglio();
  disegnaFiltri();
  disegnaElenco();
  $('#elenco').scrollTop = 0;
  window.__assetta(null);
  if (mappa && stato.mappaPronta) {
    applicaTerreno();
    applicaVista();
    aggiornaPoi();
    mappa.easeTo({ bearing: 0, duration: 400 });
    panoramica();
  }
  mostraHome(true);   /* si riparte dalla schermata di benvenuto */
}
tocca($('#reset'), ricomincia);

/* dopo 2 minuti senza tocchi si riparte da capo, da soli */
(function () {
  var t = null;
  function azzera() {
    if (t) clearTimeout(t);
    t = setTimeout(ricomincia, CONFIG.IDLE_MS);
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
  mostraAvviso('Sei senza connessione: la mappa non si aggiorna, i testi restano leggibili.', 0);
});
window.addEventListener('online', function () {
  mostraAvviso('Connessione tornata.', 3000);
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
   Partenza
   ===================================================================== */
$('#cmd-base').textContent = CONFIG.BASI[CONFIG.BASE_INIZIALE === 'sat' ? 'osm' : 'sat'].etichetta;
applicaVista();
disegnaFiltri();
disegnaElenco();
avvia();
if (!navigator.onLine) {
  mostraAvviso('Sei senza connessione: la mappa non si aggiorna, i testi restano leggibili.', 0);
}

})();
