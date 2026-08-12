/* =====================================================================
   Chiosco Villamirella — logica dell'interfaccia
   ---------------------------------------------------------------------
   Scritto per il browser webOS del monitor LG (Chromium 108, ARM Mali-G31,
   1536x856 px logici, UN SOLO punto di tocco). Le scelte non ovvie hanno
   il perche' scritto accanto: vengono tutte da misure fatte su quel
   monitor con diagnostica.html, non da supposizioni.

   Niente librerie oltre MapLibre. Niente await al primo livello, niente
   optional chaining: il codice deve restare leggibile e prevedibile.
   ===================================================================== */
(function () {
'use strict';

/* =====================================================================
   CONFIG — tutto cio' che si cambia senza toccare il resto del file
   ===================================================================== */
var CONFIG = {

  /* --- Basi cartografiche. Entrambe senza chiave, entrambe in HTTPS
     (obbligatorio: la pagina e' servita in https e il contenuto misto
     viene bloccato). Per passare a un fornitore a chiave basta cambiare
     l'indirizzo qui sotto e l'attribuzione. --- */
  BASI: {
    sat: {
      etichetta: 'Satellite',
      /* ATTENZIONE all'ordine {z}/{y}/{x}: ArcGIS vuole riga prima di colonna */
      tiles: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Immagini &copy; Esri, Maxar, Earthstar Geographics',
      /* misurato: oltre il 19 Esri restituisce un riquadro grigio
         "map data not yet available"; il dato vero finisce al 18 */
      maxzoom: 19
    },
    osm: {
      etichetta: 'Mappa',
      tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attrib: '&copy; OpenStreetMap contributors',
      maxzoom: 19
    }
  },
  BASE_INIZIALE: 'sat',

  /* --- Rilievo 3D. Su questo monitor costa parecchio: con il terreno
     acceso e la mappa in movimento si scende sotto i 30 fotogrammi.
     Metti false se il chiosco risulta lento. --- */
  TERRENO_3D: true,
  TERRENO_TILES: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
  TERRENO_ATTRIB: 'Rilievo: AWS Terrain Tiles',
  TERRENO_MAXZOOM: 15,
  TERRENO_ESAGERAZIONE: 1.0,

  /* --- Prestazioni ---
     PIXEL_RATIO si applica ALLA COSTRUZIONE della mappa e non si tocca
     mai piu': cambiarlo a runtime rialloca il buffer WebGL e su questo
     driver Mali fa cadere il contesto (provato: schermo nero).
     1     = piu' fluido (60 fps misurati)
     1.25  = piu' nitido (28 fps misurati) — e' il massimo utile, perche'
             il browser espone comunque una superficie di 1920x1080 */
  PIXEL_RATIO: 1,
  /* MapLibre lancia 16 richieste in parallelo: troppe per il Wi-Fi di un
     televisore, ed e' li' che nascono le tile mancanti */
  RICHIESTE_PARALLELE: 6,

  /* --- Inquadrature --- */
  ZOOM_LUOGO: 14.5,
  PITCH_LUOGO: 55,
  PITCH_PIATTO: 0,
  BORDO_PANORAMICA: 80,

  /* --- Chiosco --- */
  IDLE_MS: 90000,          /* dopo 90 s senza tocchi si torna alla home */
  GRUPPO_INIZIALE: 'mare'
};

/* =====================================================================
   Scorciatoie e utilita'
   ===================================================================== */
function $(s) { return document.querySelector(s); }
function el(tag, cls, txt) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined && txt !== null) e.textContent = String(txt);
  return e;
}
function vuoto(n) { while (n.firstChild) n.removeChild(n.firstChild); }

/* Sul touch il "click" arriva 80-120 ms dopo il distacco del dito
   (misurato: pointerup 19.264 -> click 19.343). Per i comandi del
   chiosco si usa pointerup, che e' immediato. */
function tocca(nodo, fn) {
  var partito = false, x0 = 0, y0 = 0;
  nodo.addEventListener('pointerdown', function (ev) {
    partito = true; x0 = ev.clientX; y0 = ev.clientY;
  });
  nodo.addEventListener('pointerup', function (ev) {
    if (!partito) return;
    partito = false;
    /* se il dito si e' spostato non era un tocco ma uno scorrimento
       dell'elenco: guai a scambiarlo per la scelta di una scheda */
    if (Math.abs(ev.clientX - x0) > 12 || Math.abs(ev.clientY - y0) > 12) return;
    ev.preventDefault();
    fn(ev);
  });
  nodo.addEventListener('pointercancel', function () { partito = false; });
  /* rete di sicurezza per tastiere e puntatori non touch */
  nodo.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(ev); }
  });
}

/* Distanza in linea d'aria, formula dell'emisenoverso. NON e' la distanza
   stradale: per questo l'etichetta lo dice esplicitamente. */
function distanzaAria(a, b) {
  if (!a || !b || a.lat === null || b.lat === null) return null;
  var R = 6371.0088, r = Math.PI / 180;
  var p1 = a.lat * r, p2 = b.lat * r;
  var dp = p2 - p1, dl = (b.lng - a.lng) * r;
  var h = Math.sin(dp / 2) * Math.sin(dp / 2) +
          Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* =====================================================================
   Scala tipografica: la radice si ricava dalla larghezza della finestra.
   Sul monitor del chiosco innerWidth vale 1536, quindi 1rem = 24px, che
   a un metro e mezzo di distanza e' comodamente leggibile (il pannello
   e' largo 697 mm, cioe' 0,45 mm per pixel logico).
   ===================================================================== */
function scala() {
  var f = window.innerWidth / 64;
  if (f < 16) f = 16;
  if (f > 30) f = 30;
  document.documentElement.style.fontSize = f.toFixed(2) + 'px';
}
scala();
window.addEventListener('resize', scala);
/* L'evento resize della finestra non basta: il riquadro della mappa puo'
   cambiare misura anche senza che la finestra cambi (font che arrivano,
   pannello che si apre). Un osservatore sul contenitore copre tutti i
   casi; e' smorzato perche' ridisegnare la mappa a ogni frame e' troppo
   per la GPU del monitor. */
(function () {
  if (typeof ResizeObserver !== 'function') return;
  var att = null;
  var ro = new ResizeObserver(function () {
    if (att) clearTimeout(att);
    att = setTimeout(function () {
      scala();
      if (typeof mappa !== 'undefined' && mappa) mappa.resize();
    }, 120);
  });
  ro.observe(document.documentElement);
  var lato = document.getElementById('mappa-lato');
  if (lato) ro.observe(lato);
})();

/* =====================================================================
   Dati: dai due elenchi di poi.js ricavo i gruppi della colonna sinistra
   ===================================================================== */
var LUOGHI = window.LUOGHI || [];
var ESPERIENZE = window.ESPERIENZE || [];
var CATEGORIE = window.CATEGORIE || [];
var SEZIONI = window.SEZIONI || [];
var RESIDENCE = window.RESIDENCE || null;

function perId(id) {
  for (var i = 0; i < LUOGHI.length; i++) if (LUOGHI[i].id === id) return LUOGHI[i];
  return null;
}
function nomeCategoria(id) {
  for (var i = 0; i < CATEGORIE.length; i++) if (CATEGORIE[i].id === id) return CATEGORIE[i].nome;
  return id;
}
function nomeSezione(id, fallback) {
  for (var i = 0; i < SEZIONI.length; i++) if (SEZIONI[i].id === id) return SEZIONI[i].nome;
  return fallback;
}

/* Un elemento dell'elenco: {chiave, tipo, dato} */
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

/* L'ordine dei gruppi e' quello dichiarato in window.SEZIONI, seguito
   dalle categorie dei luoghi. Cambiando poi.js cambia la barra. */
var GRUPPI = [
  { id: 'mare',       nome: nomeSezione('mare', 'In primo piano'), voci: inEvidenza },
  { id: 'itinerari',  nome: nomeSezione('itinerari', 'Itinerari'),  voci: function () { return espDiTipo('itinerario'); } },
  { id: 'esperienze', nome: nomeSezione('esperienze', 'Esperienze'), voci: function () { return espDiTipo('esperienza'); } },
  { id: 'guide',      nome: nomeSezione('guide', 'Guide'),          voci: function () { return espDiTipo('guida'); } }
];
(function () {
  for (var i = 0; i < CATEGORIE.length; i++) {
    (function (c) {
      GRUPPI.push({ id: 'cat:' + c.id, nome: c.nome, voci: function () { return luoghiDiCategoria(c.id); } });
    })(CATEGORIE[i]);
  }
})();

/* I luoghi da mostrare sulla mappa per un gruppo: quelli diretti piu'
   quelli a cui le esperienze del gruppo fanno riferimento. */
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
  aperta: null,          /* la voce aperta nel dettaglio */
  base: CONFIG.BASE_INIZIALE,
  terreno: CONFIG.TERRENO_3D,
  pin: {},               /* id luogo -> marcatore */
  mappaPronta: false
};

/* =====================================================================
   Colonna sinistra: filtri ed elenco
   ===================================================================== */
function disegnaFiltri() {
  var n = $('#filtri');
  vuoto(n);
  for (var i = 0; i < GRUPPI.length; i++) {
    (function (g) {
      var b = el('button', 'chip', g.nome);
      b.type = 'button';
      b.setAttribute('aria-pressed', g.id === stato.gruppo ? 'true' : 'false');
      tocca(b, function () {
        if (stato.gruppo === g.id) return;
        stato.gruppo = g.id;
        chiudiDettaglio();
        disegnaFiltri();
        disegnaElenco();
        aggiornaPin();
        panoramica();
      });
      n.appendChild(b);
    })(GRUPPI[i]);
  }
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
  vuoto(n);
  var g = gruppoCorrente();
  var voci = g.voci();
  n.appendChild(el('div', 'sezione-titolo', g.nome));
  if (!voci.length) {
    n.appendChild(el('div', 'vuoto', 'Nessuna voce in questa sezione.'));
    return;
  }
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
        c.appendChild(el('div', 'foto'));
      }
      var corpo = el('div', 'corpo');
      corpo.appendChild(el('div', 'meta', sottotitolo(v)));
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
  if (d.immagine) { foto.src = d.immagine; foto.style.display = 'block'; }
  else { foto.removeAttribute('src'); foto.style.display = 'none'; }

  $('#det-categoria').textContent = sottotitolo(v);
  $('#det-nome').textContent = d.nome;
  $('#det-sommario').textContent = d.sommario || '';
  $('#det-sommario').style.display = d.sommario ? 'block' : 'none';

  /* riga "prenotabile in reception": compare solo dove e' dichiarato */
  var pren = $('#det-prenotabile');
  vuoto(pren);
  if (d.prenotabileInReception) {
    pren.appendChild(el('div', 'prenotabile', 'Prenotabile in reception'));
  }

  /* righe: distanza, tempo, luoghi collegati */
  var righe = $('#det-righe');
  vuoto(righe);
  function riga(k, val) {
    var r = el('div', 'riga');
    r.appendChild(el('b', null, k));
    r.appendChild(el('span', null, val));
    righe.appendChild(r);
  }
  /* il Parco e' un'area: una "distanza dal centro" di un territorio di
     180.000 ettari sarebbe un numero senza significato */
  var eArea = (v.tipo === 'luogo' && v.dato.id === 'parco-nazionale');
  if (v.tipo === 'luogo' && !eArea) {
    if (d.distanzaKm !== '' && d.distanzaKm !== null && d.distanzaKm !== undefined) {
      riga('Distanza dal residence', d.distanzaKm + ' km');
    } else {
      var km = distanzaAria(RESIDENCE, d);
      /* dichiarato per quello che e': in linea d'aria, non su strada */
      if (km !== null) riga('Distanza in linea d’aria', km.toFixed(1) + ' km');
    }
    if (d.tempoAuto) riga('In auto', d.tempoAuto);
  } else {
    var rif = d.luoghi || [];
    var nomi = [];
    for (var i = 0; i < rif.length; i++) { var l = perId(rif[i]); if (l) nomi.push(l.nome); }
    if (nomi.length) riga(nomi.length > 1 ? 'Luoghi' : 'Luogo', nomi.join(', '));
  }

  /* articoli: mostrati QUI dentro. Nessun link porta fuori dalla pagina:
     sul browser webOS non c'e' un tasto indietro comodo per l'ospite. */
  var arts = $('#det-articoli');
  vuoto(arts);
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
    arts.appendChild(el('p', 'avviso-vuoto',
      'Per questo luogo il sito non riporta una descrizione.'));
  }

  $('#dettaglio').classList.add('aperto');
  $('#dettaglio').setAttribute('aria-hidden', 'false');
  $('#dettaglio .scorri').scrollTop = 0;

  evidenzia(v);
  volaSu(v);
}

function chiudiDettaglio() {
  stato.aperta = null;
  $('#dettaglio').classList.remove('aperto');
  $('#dettaglio').setAttribute('aria-hidden', 'true');
  evidenzia(null);
}

/* =====================================================================
   MAPPA
   ===================================================================== */
var mappa = null, marcatoreCasa = null, erroriTile = 0, timerAvviso = null;

function stileMappa() {
  var b = CONFIG.BASI[stato.base];
  var s = {
    version: 8,
    sources: {
      /* sottofondo a zoom basso della stessa base: poche tile, scaricate
         una volta e tenute in cache. Senza, quando la tile vicina alla
         camera manca si vede il nero del canvas (successo davvero). */
      basso: { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: 8 },
      base:  { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: b.maxzoom, attribution: b.attrib }
    },
    layers: [
      /* mai lasciare il canvas scoperto */
      { id: 'sfondo', type: 'background', paint: { 'background-color': '#0f2733' } },
      { id: 'basso',  type: 'raster', source: 'basso', paint: { 'raster-fade-duration': 0 } },
      { id: 'base',   type: 'raster', source: 'base' }
    ]
  };
  /* il poligono del parco esiste solo se parco.js e' stato caricato:
     senza guardia una sorgente geojson con geometria nulla fa fallire
     l'intero stile, cioe' niente mappa affatto */
  if (window.PARCO && window.PARCO.type) {
    s.sources.parco = { type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: window.PARCO } };
    s.layers.push({ id: 'parco-area', type: 'fill', source: 'parco',
      layout: { visibility: 'none' },
      paint: { 'fill-color': '#57b3a7', 'fill-opacity': 0.18 } });
    s.layers.push({ id: 'parco-bordo', type: 'line', source: 'parco',
      layout: { visibility: 'none' },
      paint: { 'line-color': '#1f8074', 'line-width': 2 } });
  }
  if (CONFIG.TERRENO_3D) {
    s.sources.rilievo = {
      type: 'raster-dem', tiles: [CONFIG.TERRENO_TILES], tileSize: 256,
      encoding: 'terrarium', maxzoom: CONFIG.TERRENO_MAXZOOM, attribution: CONFIG.TERRENO_ATTRIB
    };
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
      /* fissato qui e mai piu' toccato: vedi CONFIG.PIXEL_RATIO */
      pixelRatio: CONFIG.PIXEL_RATIO,
      antialias: false,
      refreshExpiredTiles: false,
      maxPitch: 70,
      dragRotate: false,        /* con un dito solo non si ruota comunque */
      touchPitch: false,        /* richiederebbe due dita: non esistono */
      touchZoomRotate: true,    /* resta il doppio tap per ingrandire */
      keyboard: false
    });
  } catch (e) {
    mostraAvviso('Mappa non avviabile su questo schermo.', 0);
    return;
  }

  mappa.on('load', function () {
    stato.mappaPronta = true;
    /* se la mappa e' stata costruita prima che il layout fosse assestato
       (font ancora in arrivo, pannello a larghezza zero) il canvas resta
       alla misura di ripiego 400x300 e non si riprende piu': provato. */
    mappa.resize();
    applicaTerreno();
    marcaResidence();
    aggiornaPin();
    panoramica(true);
  });

  /* una tile persa ogni tanto e' normale; un avviso a ogni tile sarebbe
     insopportabile, quindi si avvisa solo quando diventano tante */
  mappa.on('error', function () {
    erroriTile++;
    if (erroriTile === 8) {
      mostraAvviso('Connessione lenta: alcune parti della mappa potrebbero mancare.', 6000);
    }
  });
  mappa.on('moveend', function () { erroriTile = 0; });
}

function applicaTerreno() {
  if (!mappa) return;
  try {
    if (stato.terreno && CONFIG.TERRENO_3D && mappa.getSource('rilievo')) {
      mappa.setTerrain({ source: 'rilievo', exaggeration: CONFIG.TERRENO_ESAGERAZIONE });
      if (typeof mappa.setSky === 'function') {
        /* nebbia forte all'orizzonte: nasconde il bordo del terreno
           caricato, che altrimenti si vede come una parete a strisce */
        mappa.setSky({
          'sky-color': '#9ccbe8', 'horizon-color': '#e8f2f8', 'fog-color': '#dfe9ef',
          'fog-ground-blend': 0.9, 'horizon-fog-blend': 0.85, 'sky-horizon-blend': 0.9
        });
      }
    } else {
      mappa.setTerrain(null);
    }
  } catch (e) {}
  var b = $('#cmd-3d');
  if (b) b.className = 'cmd grande' + (stato.terreno ? ' acceso' : '');
}

function mostraParco(acceso) {
  if (!mappa || !mappa.getLayer('parco-area')) return;
  var v = acceso ? 'visible' : 'none';
  mappa.setLayoutProperty('parco-area', 'visibility', v);
  mappa.setLayoutProperty('parco-bordo', 'visibility', v);
}

/* --------------------------- i pin ---------------------------------
   Marcatori HTML e non simboli WebGL: servono bersagli grandi per il
   dito e etichette leggibili, e il filtro per gruppo tiene i pin
   visibili sotto la quindicina, quindi il costo e' irrilevante.        */
function creaPin(l) {
  var n = el('div', 'pin');
  n.appendChild(el('div', 'bollo'));
  n.appendChild(el('div', 'targa', l.nome));
  tocca(n, function () { apriDettaglio(voceLuogo(l)); });
  return n;
}

function aggiornaPin() {
  if (!mappa || !stato.mappaPronta) return;
  var k;
  for (k in stato.pin) if (stato.pin.hasOwnProperty(k)) stato.pin[k].remove();
  stato.pin = {};

  var lista = luoghiDelGruppo(gruppoCorrente());
  var parcoDentro = false;
  for (var i = 0; i < lista.length; i++) {
    var l = lista[i];
    if (l.id === 'parco-nazionale') { parcoDentro = true; continue; }  /* e' un'area, non un punto */
    var m = new maplibregl.Marker({ element: creaPin(l), anchor: 'top' })
              .setLngLat([l.lng, l.lat]).addTo(mappa);
    stato.pin[l.id] = m;
  }
  mostraParco(parcoDentro);
  if (stato.aperta) evidenzia(stato.aperta);
}

function marcaResidence() {
  if (!RESIDENCE || RESIDENCE.lat === null || !mappa) return;
  var n = el('div', 'pin casa');
  n.appendChild(el('div', 'bollo'));
  n.appendChild(el('div', 'targa', 'Siamo qui'));
  marcatoreCasa = new maplibregl.Marker({ element: n, anchor: 'top' })
    .setLngLat([RESIDENCE.lng, RESIDENCE.lat]).addTo(mappa);
}

function evidenzia(v) {
  var id;
  for (id in stato.pin) {
    if (stato.pin.hasOwnProperty(id)) stato.pin[id].getElement().classList.remove('attivo');
  }
  var schede = document.querySelectorAll('.scheda');
  for (var i = 0; i < schede.length; i++) schede[i].classList.remove('evidenziata');
  if (!v) return;

  var scheda = document.querySelector('.scheda[data-chiave="' + v.chiave + '"]');
  if (scheda) scheda.classList.add('evidenziata');

  var ids = [];
  if (v.tipo === 'luogo') ids = [v.dato.id];
  else ids = v.dato.luoghi || [];
  for (var j = 0; j < ids.length; j++) {
    if (stato.pin[ids[j]]) stato.pin[ids[j]].getElement().classList.add('attivo');
  }
}

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
  return out;
}

function volaSu(v) {
  if (!mappa || !stato.mappaPronta) return;
  /* il Parco e' un'area: invece di puntarlo, lo si inquadra tutto */
  if (v.tipo === 'luogo' && v.dato.id === 'parco-nazionale' && window.PARCO) {
    inquadraGeometria(window.PARCO);
    mostraPanoramica(true);
    return;
  }
  var p = puntiDi(v);
  if (!p.length) return;
  if (p.length === 1) {
    mappa.flyTo({
      center: p[0], zoom: CONFIG.ZOOM_LUOGO,
      pitch: stato.terreno ? CONFIG.PITCH_LUOGO : CONFIG.PITCH_PIATTO,
      duration: 1600, essential: true
    });
  } else {
    inquadra(p);
  }
  mostraPanoramica(true);
}

function inquadra(punti) {
  if (!punti.length) return;
  var b = new maplibregl.LngLatBounds(punti[0], punti[0]);
  for (var i = 1; i < punti.length; i++) b.extend(punti[i]);
  mappa.fitBounds(b, { padding: CONFIG.BORDO_PANORAMICA, duration: 1400, pitch: 0, bearing: 0, maxZoom: 15 });
}

function inquadraGeometria(g) {
  var punti = [];
  function anelli(a) { for (var i = 0; i < a.length; i++) punti.push(a[i]); }
  if (g.type === 'Polygon') { for (var i = 0; i < g.coordinates.length; i++) anelli(g.coordinates[i]); }
  else if (g.type === 'MultiPolygon') {
    for (var j = 0; j < g.coordinates.length; j++)
      for (var k = 0; k < g.coordinates[j].length; k++) anelli(g.coordinates[j][k]);
  }
  inquadra(punti);
}

function panoramica(primo) {
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
  if (!primo) evidenzia(stato.aperta);
}

function mostraPanoramica(s) {
  var b = $('#panoramica');
  if (b) b.className = s ? 'mostra' : '';
}

function mostraAvviso(testo, ms) {
  var a = $('#avviso');
  a.textContent = testo;
  a.className = 'mostra';
  if (timerAvviso) clearTimeout(timerAvviso);
  if (ms) timerAvviso = setTimeout(function () { a.className = ''; }, ms);
}

/* --------------------- cambio base cartografica --------------------- */
function cambiaBase() {
  stato.base = (stato.base === 'sat') ? 'osm' : 'sat';
  var b = CONFIG.BASI[stato.base];
  $('#cmd-base').textContent = CONFIG.BASI[stato.base === 'sat' ? 'osm' : 'sat'].etichetta;
  if (!mappa) return;
  try {
    ['base', 'basso'].forEach(function (id) {
      if (mappa.getLayer(id)) mappa.removeLayer(id);
      if (mappa.getSource(id)) mappa.removeSource(id);
    });
    mappa.addSource('basso', { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: 8 });
    mappa.addSource('base',  { type: 'raster', tiles: [b.tiles], tileSize: 256, maxzoom: b.maxzoom, attribution: b.attrib });
    /* i raster vanno rimessi SOTTO il parco, se il parco c'e' */
    var sopra = mappa.getLayer('parco-area') ? 'parco-area' : undefined;
    mappa.addLayer({ id: 'basso', type: 'raster', source: 'basso', paint: { 'raster-fade-duration': 0 } }, sopra);
    mappa.addLayer({ id: 'base',  type: 'raster', source: 'base' }, sopra);
  } catch (e) {
    mostraAvviso('Non riesco a cambiare mappa.', 4000);
  }
}

/* =====================================================================
   Divisorio trascinabile e apertura/chiusura delle due meta'
   ===================================================================== */
(function () {
  var div = $('#divisorio'), app = $('#app'), pan = $('#pannello');
  var trascina = false, ultimoResize = 0;

  div.addEventListener('pointerdown', function (ev) {
    if (ev.target.classList.contains('freccia')) return;
    trascina = true;
    div.setPointerCapture(ev.pointerId);
  });
  div.addEventListener('pointermove', function (ev) {
    if (!trascina) return;
    var perc = (ev.clientX / window.innerWidth) * 100;
    if (perc < 18) perc = 18;
    if (perc > 82) perc = 82;
    app.className = '';
    pan.style.width = perc + '%';
    /* ridimensionare la mappa a ogni frame e' troppo per questa GPU:
       si aggiorna al massimo ogni 120 ms, poi una volta al rilascio */
    var ora = Date.now();
    if (mappa && ora - ultimoResize > 120) { ultimoResize = ora; mappa.resize(); }
  });
  function fine(ev) {
    if (!trascina) return;
    trascina = false;
    try { div.releasePointerCapture(ev.pointerId); } catch (e) {}
    if (mappa) mappa.resize();
  }
  div.addEventListener('pointerup', fine);
  div.addEventListener('pointercancel', fine);

  /* le frecce: un tocco allarga la mappa, un altro la riporta a meta' */
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
    setTimeout(poi, 420);   /* rete di sicurezza se transitionend non arriva */
  }
  tocca($('#verso-sinistra'), function () {
    assetta(app.classList.contains('solo-mappa') ? null : 'solo-mappa');
  });
  tocca($('#verso-destra'), function () {
    assetta(app.classList.contains('solo-elenco') ? null : 'solo-elenco');
  });
})();

/* =====================================================================
   Comandi della mappa
   ===================================================================== */
tocca($('#cmd-base'), cambiaBase);
tocca($('#cmd-3d'), function () {
  stato.terreno = !stato.terreno;
  applicaTerreno();
  if (mappa) mappa.easeTo({ pitch: stato.terreno ? CONFIG.PITCH_LUOGO : 0, duration: 700 });
});
tocca($('#cmd-piu'),  function () { if (mappa) mappa.zoomIn({ duration: 400 }); });
tocca($('#cmd-meno'), function () { if (mappa) mappa.zoomOut({ duration: 400 }); });
tocca($('#cmd-nord'), function () { if (mappa) mappa.easeTo({ bearing: 0, duration: 500 }); });
tocca($('#cmd-casa'), function () {
  if (!mappa || !RESIDENCE || RESIDENCE.lat === null) return;
  mappa.flyTo({ center: [RESIDENCE.lng, RESIDENCE.lat], zoom: 15,
    pitch: stato.terreno ? CONFIG.PITCH_LUOGO : 0, duration: 1500 });
  mostraPanoramica(true);
});
tocca($('#panoramica'), function () { chiudiDettaglio(); panoramica(); });
tocca($('#det-indietro'), function () { chiudiDettaglio(); });
tocca($('#det-mappa'), function () {
  if (stato.aperta) { volaSu(stato.aperta); }
  $('#app').classList.remove('solo-elenco');
  if (mappa) mappa.resize();
});

/* =====================================================================
   Lockdown: la pagina non deve comportarsi da pagina web
   ATTENZIONE: nulla di tutto questo tocca il canvas della mappa, che
   deve continuare a ricevere le sue gesture.
   ===================================================================== */
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
document.addEventListener('dragstart', function (e) { e.preventDefault(); });
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('selectstart', function (e) {
  if (!e.target.closest || !e.target.closest('#mappa')) e.preventDefault();
});
/* doppio tocco ravvicinato fuori dalla mappa: annullato, sennero' la
   pagina zooma e il chiosco resta ingrandito senza modo di tornare */
(function () {
  var ultimo = 0;
  document.addEventListener('touchend', function (e) {
    var ora = Date.now();
    if (ora - ultimo < 350 && (!e.target.closest || !e.target.closest('#mappa'))) e.preventDefault();
    ultimo = ora;
  }, { passive: false });
})();

/* =====================================================================
   Ritorno alla home dopo inattivita'
   ===================================================================== */
(function () {
  var t = null;
  function azzera() {
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      stato.gruppo = CONFIG.GRUPPO_INIZIALE;
      stato.base = CONFIG.BASE_INIZIALE;
      stato.terreno = CONFIG.TERRENO_3D;
      chiudiDettaglio();
      disegnaFiltri();
      disegnaElenco();
      $('#app').classList.remove('solo-mappa', 'solo-elenco');
      $('#pannello').style.width = '';
      if (mappa) {
        mappa.resize();
        applicaTerreno();
        aggiornaPin();
        panoramica();
      }
    }, CONFIG.IDLE_MS);
  }
  ['pointerdown', 'pointerup', 'wheel', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, azzera, { passive: true });
  });
  azzera();
})();

/* =====================================================================
   Rete
   ===================================================================== */
window.addEventListener('offline', function () {
  mostraAvviso('Sei senza connessione: la mappa non si aggiorna, i testi restano leggibili.', 0);
});
window.addEventListener('online', function () {
  mostraAvviso('Connessione tornata.', 3000);
  if (mappa) mappa.resize();
});

/* =====================================================================
   Partenza
   ===================================================================== */
$('#cmd-base').textContent = CONFIG.BASI[CONFIG.BASE_INIZIALE === 'sat' ? 'osm' : 'sat'].etichetta;
disegnaFiltri();
disegnaElenco();
avvia();
if (!navigator.onLine) {
  mostraAvviso('Sei senza connessione: la mappa non si aggiorna, i testi restano leggibili.', 0);
}

})();
