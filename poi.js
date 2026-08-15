/* =====================================================================
   poi.js — I LUOGHI E LE ESPERIENZE DEL CHIOSCO VILLAMIRELLA
   =====================================================================

   COME AGGIUNGERE UN LUOGO
   ------------------------
   Copia un blocco che comincia con "{" e finisce con "}," dentro
   window.LUOGHI, incollalo sotto, e cambia i valori. I campi sono:

     id          nome corto senza spazi ne' accenti, deve essere unico
                 (es. "spiaggia-saline"). Serve al programma, non si vede.
     nome        come appare sulla scheda e sulla mappa.
     categoria   una sola fra: spiagge, borghi, grotte, natura,
                 archeologia, santuari. Decide sotto quale filtro compare.
     lat, lng    LE COORDINATE. Vedi sotto come si prendono.
     verified    metti true SOLO dopo aver inserito le coordinate vere.
     sommario    una o due frasi. Testo preso dal sito, non inventato.
     immagine    percorso della foto, es. "assets/img/nome-file.jpg".
                 La foto va messa nella cartella assets/img.
     articoli    elenco degli approfondimenti collegati. Puo' essere vuoto: [].
     distanzaKm  numero di chilometri dal residence, es. 12. Vuoto = "".
     tempoAuto   tempo in auto, es. "20 min". Vuoto = "".
     durata      (solo itinerari/esperienze) es. "2 h 30", vuoto = riga nascosta
     difficolta  (solo itinerari/esperienze) es. "facile", "media", "impegnativa"
     inEvidenza  true per farlo comparire nella prima sezione della
                 colonna di sinistra (vedi window.SEZIONI qui sotto).

   COME SI PRENDONO LE COORDINATE
   ------------------------------
   1. Apri Google Maps e cerca il posto.
   2. Tasto destro (o dito tenuto premuto) esattamente sul punto.
   3. In cima al menu compaiono due numeri, es.  40.028661, 15.283904
   4. Il PRIMO numero e' lat, il SECONDO e' lng. Vanno scritti senza
      virgolette:      lat: 40.028661,   lng: 15.283904,
   5. Cambia verified da false a true.

   ATTENZIONE: finche' verified resta false il luogo NON compare sulla
   mappa. Non e' un errore, e' voluto: meglio nessun pin che un pin
   sbagliato. La scheda testuale invece si vede lo stesso.

   DA DOVE VENGONO LE COORDINATE GIA' PRESENTI
   -------------------------------------------
   Sono state ricavate da OpenStreetMap, non scritte a mano, e ognuna
   porta in "notaCoordinate" il tipo di oggetto trovato (per esempio
   natural/beach per una spiaggia). Le voci con lat: null sono quelle in
   cui OpenStreetMap dava un oggetto sbagliato: la nota dice cosa dava.
   Se sposti un pin, aggiorna anche la nota, cosi' resta scritto perche'.

   Le virgole contano: ogni riga finisce con una virgola tranne l'ultima
   di ogni blocco. Se la pagina resta bianca dopo una modifica, quasi
   sempre manca o avanza una virgola.

   Testi e foto vengono da villamirella.it. Nessuna frase e' stata scritta
   da altri: dove il sito non diceva nulla il campo e' rimasto vuoto.
   ===================================================================== */

/* Le categorie del filtro, nell'ordine in cui compaiono i pulsanti. */
window.CATEGORIE = [
  { id: "spiagge",     nome: "Spiagge e cale" },
  { id: "borghi",      nome: "Borghi e paesi" },
  { id: "grotte",      nome: "Grotte e mare" },
  { id: "natura",      nome: "Natura e oasi" },
  { id: "archeologia", nome: "Archeologia e musei" },
  { id: "santuari",    nome: "Santuari e chiese" },
];

/* L'ORDINE DELLE SEZIONI nella colonna di sinistra.
   Per spostarne una basta spostare la riga; per nasconderla, cancellarla.
   "mare" raccoglie le voci con inEvidenza: true. */
window.SEZIONI = [
  { id: "mare",       nome: "Il mare di Palinuro" },
  { id: "itinerari",  nome: "Itinerari" },
  { id: "esperienze", nome: "Esperienze" },
  { id: "guide",      nome: "Guide" }
];

/* Il residence: e' il punto da cui si calcolano le distanze.
   ANCHE QUESTE COORDINATE VANNO INSERITE A MANO. */
window.RESIDENCE = {
  nome: "Residence Villamirella",
  indirizzo: "Via Isca 2, 84051 Palinuro (SA)",
  lat: 40.046969,
  lng: 15.297435,
  verified: true,
  notaCoordinate: "segnaposto Google Maps del Residence, dal link sulla pagina FAQ di villamirella.it"
};

/* ===================== I LUOGHI SULLA MAPPA ===================== */
window.LUOGHI = [

  /* ---------- SPIAGGE E CALE ---------- */
  {
    id: "spiaggia-saline",
    nome: "Spiaggia delle Saline",
    categoria: "spiagge",
    lat: "40.05601",   lng: "15.282363",   verified: true,
    notaCoordinate: "pin della guida ufficiale Villamirella (link Guidami qui)",
    sommario: "Entra in un'oasi di bellezza e tranquillità a Spiaggia Le Saline a Palinuro.",
    immagine: "assets/img/spiaggia-saline.jpg",
    articoli: [
      {
        titolo: "Scopri le acque cristalline e la spiaggia di sabbia bianca delle Saline",
        url: "https://www.villamirella.it/cilento/spiaggia-di-sabbia-bianca-delle-saline",
        estratto: "Entra in un'oasi di bellezza e tranquillità a Spiaggia Le Saline a Palinuro."
      },
      {
        titolo: "Le spiagge di Palinuro: la nostra guida",
        url: "https://www.villamirella.it/cilento/le-spiagge-di-palinuro",
        estratto: "Le spiagge di Palinuro e Marina di Camerota si distinguono ogni anno per la loro eccellente qualità delle acque e per la pulizia delle loro coste nel cuore del Cilento ."
      }
    ],
    distanzaKm: "",   tempoAuto: "5 min",
    inEvidenza: true
  },
  {
    id: "spiaggia-ficocella",
    nome: "Spiaggia della Ficocella",
    categoria: "spiagge",
    lat: "40.034769",   lng: "15.285517",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «Spiaggia Ficocella degli uomini» (esiste anche la gemella «delle donne» 60 m a nord)",
    sommario: "La spiaggia della Ficocella è una delle più piccole spiaggia del Cilento. La spiaggia del Ficocella è anche l’unica spiaggia che si trova vicino al centro di Palinuro . La particolare conformazione di questa spiaggia di Palinuro la rende una delle più affascinanti spiagge della costiera cilentana.",
    immagine: "assets/img/spiaggia-ficocella.jpg",
    articoli: [
      {
        titolo: "Le spiagge di Palinuro: la nostra guida",
        url: "https://www.villamirella.it/cilento/le-spiagge-di-palinuro",
        estratto: "La spiaggia della Ficocella è una delle più piccole spiaggia del Cilento. La spiaggia del Ficocella è anche l’unica spiaggia che si trova vicino al centro di Palinuro . La particolare conformazione di questa spiaggia di Palinuro la rende una delle più affascinanti spiagge della costiera cilentana."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: true
  },
  {
    id: "spiaggia-porto",
    nome: "Spiaggia del Porto di Capo Palinuro",
    categoria: "spiagge",
    lat: "40.029775",   lng: "15.278646",   verified: true,
    notaCoordinate: "pin della guida ufficiale Villamirella (link Guidami qui)",
    sommario: "A Palinuro, la spiaggia del Porto è una delle spiagge del Cilento più apprezzate per la trasparenza del mare. Il porto di Palinuro è un porto di piccole dimensioni che ospita piccoli yacht o pescherecci spesso di proprietà dei pescatori di Palinuro.",
    immagine: "assets/img/spiaggia-porto.jpg",
    articoli: [
      {
        titolo: "Le spiagge di Palinuro: la nostra guida",
        url: "https://www.villamirella.it/cilento/le-spiagge-di-palinuro",
        estratto: "A Palinuro, la spiaggia del Porto è una delle spiagge del Cilento più apprezzate per la trasparenza del mare. Il porto di Palinuro è un porto di piccole dimensioni che ospita piccoli yacht o pescherecci spesso di proprietà dei pescatori di Palinuro."
      }
    ],
    distanzaKm: "",   tempoAuto: "5 min",
    lidi: "Lido da Alessandro",
    inEvidenza: true
  },
  {
    id: "baia-marinella",
    nome: "Baia della Marinella",
    categoria: "spiagge",
    lat: "40.0296",   lng: "15.296774",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «spiaggia Marinella»",
    sommario: "La spiaggia della Marinella si trova di fronte al famoso Scoglio del Coniglio di Palinuro . Tra le spiagge di Palinuro , la spiaggia delle Marinella è quella più immersa nella natura incontaminata e nella macchina mediterranea.",
    immagine: "assets/img/baia-marinella.jpg",
    articoli: [
      {
        titolo: "Le spiagge di Palinuro: la nostra guida",
        url: "https://www.villamirella.it/cilento/le-spiagge-di-palinuro",
        estratto: "La spiaggia della Marinella si trova di fronte al famoso Scoglio del Coniglio di Palinuro . Tra le spiagge di Palinuro , la spiaggia delle Marinella è quella più immersa nella natura incontaminata e nella macchina mediterranea."
      }
    ],
    distanzaKm: "",   tempoAuto: "5 min",
    prenotabileInReception: true,
    lidi: "Lido Marinella, Lido Orfeo",
    inEvidenza: true
  },
  {
    id: "buon-dormire",
    nome: "Baia del Buon Dormire",
    categoria: "spiagge",
    lat: "40.025687",   lng: "15.291607",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «spiaggia del Buondormire di mare», quella davanti allo Scoglio del Coniglio",
    sommario: "Protetta dalle rocce e raggiungibile solo in barca. Una delle spiagge più affascinanti e suggestive del Cilento. Questa baia, con la sua sabbia fine e dorata, è un vero gioiello naturale.",
    immagine: "assets/img/buon-dormire.jpg",
    articoli: [],
    distanzaKm: "",   tempoAuto: "solo in barca",
    inEvidenza: true
  },
  {
    id: "arco-naturale",
    nome: "Spiaggia dell'Arco Naturale",
    categoria: "spiagge",
    lat: "40.030819",   lng: "15.307818",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «Spiaggia dell'Arco Naturale»",
    sommario: "La spiaggia dell’Arco Naturale si trova a pochi passi dal fiume Mingardo che scorre a Palinuro. La spiaggia con il particolare arco naturale scavato nella roccia è uno dei simboli di Palinuro.",
    immagine: "assets/img/arco-naturale.jpg",
    articoli: [
      {
        titolo: "Le spiagge di Palinuro: la nostra guida",
        url: "https://www.villamirella.it/cilento/le-spiagge-di-palinuro",
        estratto: "La spiaggia dell’Arco Naturale si trova a pochi passi dal fiume Mingardo che scorre a Palinuro. La spiaggia con il particolare arco naturale scavato nella roccia è uno dei simboli di Palinuro."
      }
    ],
    distanzaKm: "",   tempoAuto: "5 min",
    lidi: "Lido Lo Scoglio",
    inEvidenza: true
  },
  {
    id: "cala-bianca",
    nome: "Cala Bianca",
    categoria: "spiagge",
    lat: "39.997243",   lng: "15.413433",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «spiaggia Cala Bianca» — non il pontile omonimo del porto",
    sommario: "Cala Bianca è una delle spiagge di Marina di Camerota che devi visitare se sei a Marina di Camerota. Nel 2013 Cala Bianca è stata eletta come la spiaggia più bella d’Italia , vincendo il sondaggio di Legambiente “la più bella sei tu”.",
    immagine: "assets/img/cala-bianca.jpg",
    articoli: [
      {
        titolo: "Le spiagge di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/spiagge-di-marina-di-camerota-nel-cilento-mare",
        estratto: "Cala Bianca è una delle spiagge di Marina di Camerota che devi visitare se sei a Marina di Camerota. Nel 2013 Cala Bianca è stata eletta come la spiaggia più bella d’Italia , vincendo il sondaggio di Legambiente “la più bella sei tu”."
      }
    ],
    distanzaKm: "",   tempoAuto: "25 min + 30 a piedi",
    inEvidenza: false
  },
  {
    id: "spiaggia-pozzallo",
    nome: "Spiaggia del Pozzallo",
    categoria: "spiagge",
    lat: "39.997172",   lng: "15.407624",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [natural/beach] — corretta al secondo giro: la prima risposta era il pontile del porto",
    sommario: "La spiaggia del Pozzallo è una vera e propria spiaggia da cartolina. Il Pozzallo è una tappa irrinunciabile nel corso di una vacanza nel Cilento. La spiaggia di Pozzallo è un misto di ciottoli bianchi e sabbia.",
    immagine: "assets/img/spiaggia-pozzallo.jpg",
    articoli: [
      {
        titolo: "Le spiagge di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/spiagge-di-marina-di-camerota-nel-cilento-mare",
        estratto: "La spiaggia del Pozzallo è una vera e propria spiaggia da cartolina. Il Pozzallo è una tappa irrinunciabile nel corso di una vacanza nel Cilento. La spiaggia di Pozzallo è un misto di ciottoli bianchi e sabbia."
      }
    ],
    distanzaKm: "",   tempoAuto: "25 min + 15 a piedi",
    inEvidenza: false
  },
  {
    id: "porto-infreschi",
    nome: "Porto e Baia degli Infreschi",
    categoria: "spiagge",
    lat: "39.998918",   lng: "15.42702",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/bay] «Baia degli Infreschi»",
    sommario: "Il Porto degli Infreschi, gioiello marino del Parco Nazionale del Cilento e Vallo di Diano , è un magnifico esempio di porto naturale. Le sue baie, le alte falesie rocciose e le grotte marine di quest’area protetta sono raggiungibili comodamente via mare con escursioni in barca.",
    immagine: "",
    articoli: [
      {
        titolo: "Le grotte di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/marina-di-camerota-cosa-vedere",
        estratto: "Il Porto degli Infreschi, gioiello marino del Parco Nazionale del Cilento e Vallo di Diano , è un magnifico esempio di porto naturale. Le sue baie, le alte falesie rocciose e le grotte marine di quest’area protetta sono raggiungibili comodamente via mare con escursioni in barca."
      },
      {
        titolo: "Una passeggiata indimenticabile: Sentiero del Mediterraneo a Baia degli Infreschi",
        url: "https://www.villamirella.it/cilento/sentiero-del-mediterraneo-a-baia-degli-infreschi-marina-di-camerota",
        estratto: "Il sentiero del Mediterraneo a Marina di Camerota è un percorso naturalistico situato nella parte meridionale del Parco Nazionale del Cilento, Vallo di Diano e Alburni, in Campania, Italia."
      }
    ],
    distanzaKm: "",   tempoAuto: "30 min + 10 a piedi",
    inEvidenza: false
  },

  {
    id: "cala-del-cefalo",
    nome: "Cala del Cefalo",
    categoria: "spiagge",
    lat: 40.022182,   lng: 15.324142,   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «Spiaggia Cala del Céfalo»",
    sommario: "La spiaggia della Cala del Cefalo tra Palinuro e Marina di Camerota rappresenta uno dei tratti costieri più belli e ricchi di storia del Mediterraneo. Si tratta di una spiaggia di sabbia e ciottoli lunga circa 5 km.",
    immagine: "assets/img/cala-del-cefalo.jpg",
    articoli: [],
    distanzaKm: "",   tempoAuto: "5 min",
    inEvidenza: false
  },
  {
    id: "la-calanca",
    nome: "Spiaggia della Calanca",
    categoria: "spiagge",
    lat: 40.000492,   lng: 15.366057,   verified: true,
    notaCoordinate: "OpenStreetMap [natural/beach] «Spiaggia della Calanca»",
    sommario: "Si trova praticamente all'inizio dell'abitato di Marina di Camerota. La spiaggia è sabbiosa e il suo fondale digrada molto lentamente e questo la rende ottima per i bambini.",
    immagine: "assets/img/la-calanca.jpg",
    articoli: [],
    distanzaKm: "",   tempoAuto: "16 min",
    inEvidenza: false
  },

  {
    id: "palinuro-sub",
    nome: "Palinuro Sub Diving Center",
    categoria: "diving",
    lat: 40.029227,   lng: 15.277123,   verified: true,
    notaCoordinate: "posizione indicata dal titolare (15/08/2026), al porto di Palinuro",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "continente-blu",
    nome: "Diving Continente Blu",
    categoria: "diving",
    lat: 39.999233,   lng: 15.375412,   verified: true,
    notaCoordinate: "Via delle Barche non e' mappata: posizione approssimata al porto di Marina di Camerota",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "parco-avventura-piano-croce",
    nome: "Parco Avventura Piano della Croce",
    categoria: "natura",
    lat: null,   lng: null,   verified: false,
    notaCoordinate: "DA INSERIRE A MANO: e' a Rofrano alle pendici del Monte Centaurino, ma ne' OpenStreetMap ne' il sito ufficiale espongono il punto esatto — meglio nessun pin che uno sbagliato",
    sommario: "Vieni a scoprire il Parco Avventura Piano della Croce, situato nel meraviglioso Cilento, in Campania.",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },

  {
    id: "chiesa-porto-palinuro",
    nome: "Chiesa di Sant'Antonio del Porto",
    categoria: "santuari",
    lat: 40.029422,   lng: 15.277076,   verified: true,
    notaCoordinate: "OpenStreetMap [place_of_worship], Via Porto, Palinuro",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "chiesa-pisciotta",
    nome: "Chiesa dei Santissimi Pietro e Paolo",
    categoria: "santuari",
    lat: 40.106997,   lng: 15.233714,   verified: true,
    notaCoordinate: "OpenStreetMap [place_of_worship], Piazza Pagano, Marina di Pisciotta",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "chiesa-camerota",
    nome: "Chiesa di Sant'Alfonso",
    categoria: "santuari",
    lat: 39.999978,   lng: 15.372552,   verified: true,
    notaCoordinate: "OpenStreetMap [place_of_worship], Piazza San Domenico, Marina di Camerota",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "chiesa-palinuro",
    nome: "Chiesa di Santa Maria di Loreto",
    categoria: "santuari",
    lat: 40.033706,   lng: 15.289036,   verified: true,
    notaCoordinate: "nome e posizione indicati dal titolare (15/08/2026); non risulta mappata su OpenStreetMap",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "chiesa-centola",
    nome: "Chiesa di San Nicola di Mira",
    categoria: "santuari",
    lat: 40.066502,   lng: 15.311963,   verified: true,
    notaCoordinate: "APPROSSIMATA al centro di Centola: non mappata su OpenStreetMap — sposta il pin sull'ingresso esatto",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },

  {
    id: "convento-san-francesco",
    nome: "Convento di San Francesco",
    categoria: "santuari",
    lat: null,   lng: null,   verified: false,
    notaCoordinate: "DA INSERIRE A MANO: a Centola, non mappato su OpenStreetMap",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "chiesa-foria",
    nome: "Chiesa di Santa Maria delle Grazie",
    categoria: "santuari",
    lat: null,   lng: null,   verified: false,
    notaCoordinate: "DA INSERIRE A MANO: a Foria di Centola (nome dalla Diocesi di Vallo della Lucania), non mappata su OpenStreetMap",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "chiesa-san-severino",
    nome: "Chiesa di San Severino Abate",
    categoria: "santuari",
    lat: 40.089159,   lng: 15.344070,   verified: true,
    notaCoordinate: "nome e posizione indicati dal titolare (15/08/2026), nel borgo di San Severino di Centola",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },

  {
    id: "molo-dei-francesi",
    nome: "Spiaggia del Molo dei Francesi (ex Club Med)",
    categoria: "spiagge",
    lat: 40.0455,   lng: 15.2815,   verified: true,
    notaCoordinate: "APPROSSIMATA alla costa all'altezza dell'ex Club Mediterranee: il molo non e' mappato su OpenStreetMap — sposta il pin sul punto esatto",
    sommario: "A soli 900 metri dal Residence Villamirella, la spiaggia del Molo dei Francesi e' un angolo di paradiso che ha vissuto la storia del Club Mediterranee sin dagli anni '50. Caratterizzata da sabbia dorata e rocce naturali, offre un'atmosfera unica, ideale per chi cerca sia il comfort che l'avventura.",
    immagine: "",
    articoli: [],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: true
  },

  /* ---------- BORGHI E PAESI ---------- */
  {
    id: "palinuro",
    nome: "Palinuro",
    categoria: "borghi",
    lat: "40.034602",   lng: "15.287262",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [village]",
    sommario: "Palinuro, situato nel cuore del Parco Nazionale del Cilento e Vallo di Diano, è una rinomata località balneare del Cilento meridionale, con una costa intatta che offre meravigliose spiagge con sabbia bianca e rocce, insenature, baie e grotte marine.",
    immagine: "assets/img/palinuro.jpg",
    articoli: [
      {
        titolo: "Palinuro",
        url: "https://www.villamirella.it/cilento-paesi/palinuro",
        estratto: "Palinuro, situato nel cuore del Parco Nazionale del Cilento e Vallo di Diano, è una rinomata località balneare del Cilento meridionale, con una costa intatta che offre meravigliose spiagge con sabbia bianca e rocce, insenature, baie e grotte marine."
      },
      {
        titolo: "Palinuro: cosa fare e cosa vedere",
        url: "https://www.villamirella.it/cilento/palinuro",
        estratto: "Palinuro, situato nel cuore del Parco Nazionale del Cilento e Vallo di Diano, è una rinomata località balneare del Cilento meridionale, con una costa intatta che offre meravigliose spiagge con sabbia bianca e rocce, insenature, baie e grotte marine."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "centola",
    nome: "Centola",
    categoria: "borghi",
    lat: "40.066502",   lng: "15.311963",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Centola è un comune della provincia di Salerno, situato nel cuore del Cilento, in Campania. La zona offre un paesaggio vario e incantevole, caratterizzato da una costa rocciosa e incontaminata, spiagge di sabbia finissima e un entroterra ricco di natura e cultura.",
    immagine: "assets/img/centola.webp",
    articoli: [
      {
        titolo: "Centola",
        url: "https://www.villamirella.it/cilento-paesi/centola",
        estratto: "Centola è un comune della provincia di Salerno, situato nel cuore del Cilento, in Campania. La zona offre un paesaggio vario e incantevole, caratterizzato da una costa rocciosa e incontaminata, spiagge di sabbia finissima e un entroterra ricco di natura e cultura."
      },
      {
        titolo: "Centola",
        url: "https://www.villamirella.it/cilento/centola-palinuro",
        estratto: "Centola è un comune della provincia di Salerno, situato nel cuore del Cilento, in Campania. La zona offre un paesaggio vario e incantevole, caratterizzato da una costa rocciosa e incontaminata, spiagge di sabbia finissima e un entroterra ricco di natura e cultura."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "marina-di-camerota",
    nome: "Marina di Camerota",
    categoria: "borghi",
    lat: "40.000151",   lng: "15.373751",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [village]",
    sommario: "Marina di Camerota si trova nella provincia di Salerno, nella regione meridionale del Parco Nazionale del Cilento e Vallo Di Diano.",
    immagine: "assets/img/marina-di-camerota.jpg",
    articoli: [
      {
        titolo: "Marina di Camerota",
        url: "https://www.villamirella.it/cilento-paesi/marina-camerota",
        estratto: "Marina di Camerota si trova nella provincia di Salerno, nella regione meridionale del Parco Nazionale del Cilento e Vallo Di Diano."
      },
      {
        titolo: "Le grotte di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/marina-di-camerota-cosa-vedere",
        estratto: "E’ facile capire perché Marina di Camerota ha attratto e continua ad attrarre migliaia di turisti: natura selvaggia, profumi mediterranei, coste frastagliate, calette dalle acque cristalline, isolotti, torri di avvistamento, grotte di terra e di mare, ricche del fascino misterioso che affonda le…"
      },
      {
        titolo: "Le spiagge di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/spiagge-di-marina-di-camerota-nel-cilento-mare",
        estratto: "Le spiagge di Marina di Camerota possono essere raggiunte quasi tutte in auto. Ma quali sono le più belle spiagge a Marina di Camerota? Scoprile con noi."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "pisciotta",
    nome: "Pisciotta",
    categoria: "borghi",
    lat: "40.108902",   lng: "15.234561",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Pisciotta domina dall'alto la costa che vada Capo Palinuro ad Ascea, arroccata su una collina per ragioni difensive. Gli abitanti potevano raggiungere la costa tramite un sentiero con scalinate ancora utilizzabili oggi.",
    immagine: "assets/img/pisciotta.webp",
    articoli: [
      {
        titolo: "Pisciotta",
        url: "https://www.villamirella.it/cilento-paesi/pisciotta",
        estratto: "Pisciotta domina dall'alto la costa che vada Capo Palinuro ad Ascea, arroccata su una collina per ragioni difensive. Gli abitanti potevano raggiungere la costa tramite un sentiero con scalinate ancora utilizzabili oggi."
      }
    ],
    distanzaKm: "",   tempoAuto: "10 min",
    inEvidenza: false
  },
  {
    id: "scario",
    nome: "Scario",
    categoria: "borghi",
    lat: "40.054283",   lng: "15.492182",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [village]",
    sommario: "Scopri Scario, uno dei gioielli del Cilento, un incantevole borgo marinaro situato nel comune di San Giovanni a Piro, affacciato sul Golfo di Policastro. Questo piccolo angolo di paradiso è la destinazione perfetta per gli amanti della natura, del mare cristallino e dell'ospitalità campana.",
    immagine: "assets/img/scario.webp",
    articoli: [
      {
        titolo: "Scario",
        url: "https://www.villamirella.it/cilento-paesi/scario",
        estratto: "Scopri Scario, uno dei gioielli del Cilento, un incantevole borgo marinaro situato nel comune di San Giovanni a Piro, affacciato sul Golfo di Policastro. Questo piccolo angolo di paradiso è la destinazione perfetta per gli amanti della natura, del mare cristallino e dell'ospitalità campana."
      },
      {
        titolo: "Scario: La Gemma Nascosta del Cilento, a un Passo da Palinuro",
        url: "https://www.villamirella.it/cilento/scario-gemma-cilento-palinuro",
        estratto: "Scario, un incantevole villaggio di pescatori nel cuore del Cilento, è spesso soprannominato la \"Portofino del Cilento\" grazie alla sua bellezza pittoresca, alle acque cristalline e al fascino senza tempo."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "agropoli",
    nome: "Agropoli",
    categoria: "borghi",
    lat: "40.346905",   lng: "14.996553",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Agropoli è una città costiera situata in Campania, in Italia, nota per la sua posizione privilegiata sul mar Tirreno e la sua storia antica.",
    immagine: "assets/img/agropoli.jpg",
    articoli: [
      {
        titolo: "Agropoli",
        url: "https://www.villamirella.it/cilento-paesi/agropoli",
        estratto: "Agropoli è una città costiera situata in Campania, in Italia, nota per la sua posizione privilegiata sul mar Tirreno e la sua storia antica."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "ascea",
    nome: "Ascea",
    categoria: "borghi",
    lat: "40.141602",   lng: "15.18576",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Ascea è un comune italiano della provincia di Salerno, situato nella regione della Campania. Si trova sulla costa del Mar Tirreno e fa parte del Parco nazionale del Cilento, Vallo di Diano e Alburni.",
    immagine: "assets/img/ascea.jpg",
    articoli: [
      {
        titolo: "Ascea",
        url: "https://www.villamirella.it/cilento-paesi/ascea",
        estratto: "Ascea è un comune italiano della provincia di Salerno, situato nella regione della Campania. Si trova sulla costa del Mar Tirreno e fa parte del Parco nazionale del Cilento, Vallo di Diano e Alburni."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "morigerati",
    nome: "Morigerati",
    categoria: "borghi",
    lat: "40.139949",   lng: "15.555182",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Morigerati è un comune italiano situato nella provincia di Salerno, in Campania. Il paese si trova nella regione del Cilento, un'area conosciuta per le sue bellezze naturali e la tradizione culturale.",
    immagine: "assets/img/morigerati.jpg",
    articoli: [
      {
        titolo: "Morigerati",
        url: "https://www.villamirella.it/cilento-paesi/morigerati",
        estratto: "Morigerati è un comune italiano situato nella provincia di Salerno, in Campania. Il paese si trova nella regione del Cilento, un'area conosciuta per le sue bellezze naturali e la tradizione culturale."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "padula",
    nome: "Padula",
    categoria: "borghi",
    lat: "40.341642",   lng: "15.658254",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Il toponimo del borgo, che deriva dalla parola latina \"paludem\" ,suggerisce che in passato si estendeva una palude nella pianura sottostante. Nonostante ciò, la fondazione della città di Cosilinum , l'antica Padula, risale al XII secolo aC. La città fu inseguito occupata dai Lucani e dai Romani.",
    immagine: "assets/img/padula.webp",
    articoli: [
      {
        titolo: "Padula",
        url: "https://www.villamirella.it/cilento-paesi/padula",
        estratto: "Il toponimo del borgo, che deriva dalla parola latina \"paludem\" ,suggerisce che in passato si estendeva una palude nella pianura sottostante. Nonostante ciò, la fondazione della città di Cosilinum , l'antica Padula, risale al XII secolo aC. La città fu inseguito occupata dai Lucani e dai Romani."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "felitto",
    nome: "Felitto",
    categoria: "borghi",
    lat: "40.373507",   lng: "15.243058",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Il paese di Felitto è un'oasi di pace e bellezza naturale, situata nel cuore del Parco nazionale del Cilento, Vallo di Diano e Alburni. Con circa 1.200 abitanti, Felitto è un luogo accogliente e pieno di tradizioni, dove puoi immergerti nella natura e nella cultura del Cilento.",
    immagine: "assets/img/felitto.jpg",
    articoli: [
      {
        titolo: "Felitto",
        url: "https://www.villamirella.it/cilento-paesi/felitto",
        estratto: "Il paese di Felitto è un'oasi di pace e bellezza naturale, situata nel cuore del Parco nazionale del Cilento, Vallo di Diano e Alburni. Con circa 1.200 abitanti, Felitto è un luogo accogliente e pieno di tradizioni, dove puoi immergerti nella natura e nella cultura del Cilento."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "san-severino",
    nome: "San Severino di Centola",
    categoria: "borghi",
    lat: "40.089066",   lng: "15.346276",   verified: true,
    notaCoordinate: "pin della guida ufficiale Villamirella (link Guidami qui)",
    sommario: "San Severino di Centola rappresenta una delle gemme nascoste della Campania. Situato lungo l'incantevole strada che porta a Palinuro, questo borgo abbandonato offre un'esperienza indimenticabile per gli amanti della natura e dell'arte.",
    immagine: "assets/img/san-severino.jpg",
    articoli: [
      {
        titolo: "Scopri San Severino di Centola, la Gemma Nascosta della Campania, sulla Strada per Palinuro",
        url: "https://www.villamirella.it/cilento/borgo-medievale-di-san-severino",
        estratto: "San Severino di Centola rappresenta una delle gemme nascoste della Campania. Situato lungo l'incantevole strada che porta a Palinuro, questo borgo abbandonato offre un'esperienza indimenticabile per gli amanti della natura e dell'arte."
      }
    ],
    distanzaKm: "",   tempoAuto: "10 min",
    inEvidenza: false
  },
  {
    id: "camerota",
    nome: "Camerota",
    categoria: "borghi",
    lat: "40.032501",   lng: "15.372765",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [administrative]",
    sommario: "Camerota è un piccolo comune della provincia di Salerno, in Campania. Si trova nel cuore del Parco Nazionale del Cilento, un'area nota per le sue bellezze naturali e la sua ricca storia.",
    immagine: "assets/img/camerota.jpg",
    articoli: [
      {
        titolo: "Il borgo medievale di Camerota",
        url: "https://www.villamirella.it/cilento/il-borgo-medievale-di-camerota",
        estratto: "Camerota è un piccolo comune della provincia di Salerno, in Campania. Si trova nel cuore del Parco Nazionale del Cilento, un'area nota per le sue bellezze naturali e la sua ricca storia."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "lentiscosa",
    nome: "Lentiscosa",
    categoria: "borghi",
    lat: "40.020963",   lng: "15.386612",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [village]",
    sommario: "Lentiscosa è un antico borgo medievale situato nel cuore del Parco Nazionale del Cilento, Vallo di Diano e Alburni, a pochi chilometri dal mare di Palinuro e da Marina di Camerota .",
    immagine: "assets/img/lentiscosa.jpg",
    articoli: [
      {
        titolo: "Lentiscosa, il borgo sulla Baia degli Infreschi",
        url: "https://www.villamirella.it/cilento/lentiscosa-cosa-vedere-marina-di-camerota",
        estratto: "Lentiscosa è un antico borgo medievale situato nel cuore del Parco Nazionale del Cilento, Vallo di Diano e Alburni, a pochi chilometri dal mare di Palinuro e da Marina di Camerota ."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "marina-di-pisciotta",
    nome: "Marina di Pisciotta",
    categoria: "borghi",
    lat: "40.10383",   lng: "15.226383",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [village]",
    sommario: "Marina di Pisciotta , nel cuore della Costa Cilentana in Campania , è una perla nascosta tra mare cristallino, tradizioni millenarie e paesaggi mozzafiato.",
    immagine: "assets/img/marina-di-pisciotta.webp",
    articoli: [
      {
        titolo: "Marina di Pisciotta: Il Borgo sul Mare del Cilento tra Storia, Natura e Tradizione",
        url: "https://www.villamirella.it/cilento/marina-di-pisciotta",
        estratto: "Marina di Pisciotta , nel cuore della Costa Cilentana in Campania , è una perla nascosta tra mare cristallino, tradizioni millenarie e paesaggi mozzafiato."
      }
    ],
    distanzaKm: "",   tempoAuto: "15 min",
    inEvidenza: false
  },
  {
    id: "santa-maria-castellabate",
    nome: "Santa Maria di Castellabate",
    categoria: "borghi",
    lat: "40.285563",   lng: "14.947901",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [village]",
    sommario: "Due sono le vie d’accesso a Punta Licosa. La prima è una strada privata che si imbocca da Ogliastro Marina. Si tratta di una strada asfaltata e ben tenuta ma riservata ai soli residenti. Da San Marco di Castellabate c’è però un sentiero che conduce a questa oasi di tranquillità.",
    immagine: "assets/img/santa-maria-castellabate.jpg",
    articoli: [
      {
        titolo: "Santa Maria di Castellabate: Punta Licosa",
        url: "https://www.villamirella.it/cilento/santa-maria-di-castellabate-agropoli",
        estratto: "Due sono le vie d’accesso a Punta Licosa. La prima è una strada privata che si imbocca da Ogliastro Marina. Si tratta di una strada asfaltata e ben tenuta ma riservata ai soli residenti. Da San Marco di Castellabate c’è però un sentiero che conduce a questa oasi di tranquillità."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },

  /* ---------- GROTTE E MARE ---------- */
  {
    id: "grotta-del-buondormire",
    nome: "Grotta del Buondormire",
    categoria: "grotte",
    lat: "40.028005",   lng: "15.293636",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta del Buondormire»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-d-argento",
    nome: "Grotta d'argento",
    categoria: "grotte",
    lat: "40.02436",   lng: "15.276691",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta d'argento»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-della-cernia",
    nome: "Grotta della Cernia",
    categoria: "grotte",
    lat: "40.024484",   lng: "15.271035",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta della Cernia»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-dell-uomo-morto",
    nome: "Grotta dell'uomo morto",
    categoria: "grotte",
    lat: "40.031352",   lng: "15.271383",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta dell'uomo morto»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-di-zia-anna",
    nome: "Grotta di Zia Anna",
    categoria: "grotte",
    lat: "40.029324",   lng: "15.267971",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta di Zia Anna»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-dei-porci",
    nome: "Grotta dei Porci",
    categoria: "grotte",
    lat: "40.029777",   lng: "15.301085",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta dei Porci»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-dei-pertusi",
    nome: "Grotta dei Pertusi",
    categoria: "grotte",
    lat: "40.023056",   lng: "15.289115",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta dei Pertusi»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-dei-monaci",
    nome: "Grotta dei Monaci",
    categoria: "grotte",
    lat: "40.024897",   lng: "15.283306",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta dei Monaci»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-sulfurea",
    nome: "Grotta Sulfurea",
    categoria: "grotte",
    lat: "40.024708",   lng: "15.282947",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta Sulfurea»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-del-sangue",
    nome: "Grotta del Sangue",
    categoria: "grotte",
    lat: "40.024077",   lng: "15.277098",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta del Sangue»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-delle-ossa",
    nome: "Grotta delle Ossa",
    categoria: "grotte",
    lat: "40.029836",   lng: "15.303645",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta delle Ossa»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-azzurra",
    nome: "Grotta Azzurra",
    categoria: "grotte",
    lat: "40.031346",   lng: "15.268883",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta Azzurra»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-delle-ciavole",
    nome: "Grotta delle Ciavole",
    categoria: "grotte",
    lat: "40.024164",   lng: "15.292283",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta delle Ciavole»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-punta-della-galera",
    nome: "Grotta Punta della Galera",
    categoria: "grotte",
    lat: "40.02302",   lng: "15.288349",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta Punta della Galera»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-del-lago",
    nome: "Grotta del lago",
    categoria: "grotte",
    lat: "40.024565",   lng: "15.282436",   verified: true,
    notaCoordinate: "OpenStreetMap [natural/cave_entrance] «Grotta del lago»",
    sommario: "",
    immagine: "",
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotte-pertosa",
    nome: "Grotte di Pertosa-Auletta",
    categoria: "natura",
    lat: "40.537046",   lng: "15.455024",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [cave_entrance]",
    sommario: "Se stai cercando un’esperienza indimenticabile durante la tua vacanza nel Cilento, le Grotte di Pertosa sono una tappa assolutamente imperdibile.",
    immagine: "assets/img/grotte-pertosa.jpg",
    articoli: [
      {
        titolo: "Le grotte di Pertosa: un Viaggio unico nel cuore del Cilento",
        url: "https://www.villamirella.it/cilento/le-grotte-di-pertosa-nel-cilento",
        estratto: "Se stai cercando un’esperienza indimenticabile durante la tua vacanza nel Cilento, le Grotte di Pertosa sono una tappa assolutamente imperdibile."
      }
    ],
    distanzaKm: "",   tempoAuto: "60 min",
    inEvidenza: false
  },
  {
    id: "grotta-della-cala",
    nome: "Grotta della Cala",
    categoria: "grotte",
    lat: "40.000983",   lng: "15.381251",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [cave_entrance]",
    sommario: "La prima ad aprirsi, a pochi metri dal mare, è la Grotta della Cala. Composta da un’ante grotta e da un retro grotta, collegati da una strozzatura. La forma di questa caverna ricorda una clessidra.",
    immagine: "",
    articoli: [
      {
        titolo: "Le grotte di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/marina-di-camerota-cosa-vedere",
        estratto: "La prima ad aprirsi, a pochi metri dal mare, è la Grotta della Cala. Composta da un’ante grotta e da un retro grotta, collegati da una strozzatura. La forma di questa caverna ricorda una clessidra."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "riparo-del-poggio",
    nome: "Grotta del Riparo del Poggio",
    categoria: "grotte",
    lat: "40.000809",   lng: "15.382516",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [bare_rock]",
    sommario: "Su uno sperone di natura calcarea, esse formavano in origine un’unica caverna. La cavità più piccola, corrispondente all’attuale Grotta, fungeva da drenaggio di una grotta enorme. L’uomo di Neanderthal trovava riparo al suo interno.",
    immagine: "",
    articoli: [
      {
        titolo: "Le grotte di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/marina-di-camerota-cosa-vedere",
        estratto: "Su uno sperone di natura calcarea, esse formavano in origine un’unica caverna. La cavità più piccola, corrispondente all’attuale Grotta, fungeva da drenaggio di una grotta enorme. L’uomo di Neanderthal trovava riparo al suo interno."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "grotta-serratura",
    nome: "Grotta della Serratura",
    categoria: "grotte",
    lat: "39.999049",   lng: "15.386788",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [natural/cave_entrance] — corretta al secondo giro: la prima risposta era la spiaggia di Lentiscelle",
    sommario: "quella della serratura di una porta. Abbastanza profonda, la grotta è stata abitata durante il Paleolitico superiore e il Neolitico.",
    immagine: "",
    articoli: [
      {
        titolo: "Le grotte di Marina di Camerota",
        url: "https://www.villamirella.it/cilento/marina-di-camerota-cosa-vedere",
        estratto: "quella della serratura di una porta. Abbastanza profonda, la grotta è stata abitata durante il Paleolitico superiore e il Neolitico."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },

  /* ---------- NATURA E OASI ---------- */
  {
    id: "parco-nazionale",
    nome: "Parco Nazionale del Cilento",
    categoria: "natura",
    lat: "40.283374",   lng: "15.298292",   verified: true,
    notaCoordinate: "non e' un pin ma un poligono: confine ufficiale da OpenStreetMap rel/4100859, semplificato a 672 vertici",
    sommario: "Il Parco Nazionale del Cilento è un luogo ideale per chi cerca una vacanza immersi nella natura, nella storia e nel relax. La zona è ricca di siti archeologici di grande importanza come Paestum e Velia, due antiche città della Magna Grecia, e le grotte preistoriche di Marina di Camerota.",
    immagine: "assets/img/parco-nazionale.jpg",
    articoli: [
      {
        titolo: "Il Parco Nazionale del Cilento",
        url: "https://www.villamirella.it/cilento/parco-nazionale-del-cilento",
        estratto: "Il Parco Nazionale del Cilento è un luogo ideale per chi cerca una vacanza immersi nella natura, nella storia e nel relax. La zona è ricca di siti archeologici di grande importanza come Paestum e Velia, due antiche città della Magna Grecia, e le grotte preistoriche di Marina di Camerota."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "oasi-morigerati",
    nome: "Oasi WWF di Morigerati",
    categoria: "natura",
    lat: "40.140611",   lng: "15.552694",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [ticket] — biglietteria dell'oasi, cioe' l'ingresso per i visitatori",
    sommario: "L’oasi WWF Grotte del Bussento a Morigerati è una splendida area protetta dal 1995 che si estende per circa 600 ettari all’interno del Parco Nazionale del Cilento e Vallo di Diano, principale geosito inserito all’interno della lista europea dei Geoparchi.",
    immagine: "assets/img/oasi-morigerati.jpg",
    articoli: [
      {
        titolo: "L'oasi WWF di Morigerati",
        url: "https://www.villamirella.it/cilento/l-oasi-wwf-di-morigerati",
        estratto: "L’oasi WWF Grotte del Bussento a Morigerati è una splendida area protetta dal 1995 che si estende per circa 600 ettari all’interno del Parco Nazionale del Cilento e Vallo di Diano, principale geosito inserito all’interno della lista europea dei Geoparchi."
      }
    ],
    distanzaKm: "",   tempoAuto: "50 min",
    inEvidenza: false
  },
  {
    id: "capelli-di-venere",
    nome: "Cascata dei Capelli di Venere",
    categoria: "natura",
    lat: "40.15638",   lng: "15.626426",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [waterfall] — OSM la chiama «Fontana Capello» — cascata a Casaletto Spartano",
    sommario: "Un'Oasi di pace, alla fine della Valle del Rio Casaletto, detta Oasi del Capello dove scorre la Cascata dei Capelli di Venere.",
    immagine: "assets/img/capelli-di-venere.jpg",
    articoli: [
      {
        titolo: "La cascata dei capelli di Venere",
        url: "https://www.villamirella.it/cilento/cosa-fare-nel-cilento-trekking-la-cascata-dei-capelli-di-venere",
        estratto: "Un'Oasi di pace, alla fine della Valle del Rio Casaletto, detta Oasi del Capello dove scorre la Cascata dei Capelli di Venere."
      }
    ],
    distanzaKm: "",   tempoAuto: "60 min",
    inEvidenza: false
  },
  {
    id: "oasi-alento",
    nome: "Oasi e Diga Alento",
    categoria: "natura",
    lat: "40.322114",   lng: "15.126223",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [natural/water] — corretta al secondo giro: bacino dell'Alento (la prima era uno svincolo)",
    sommario: "Se vuoi trascorrere una giornata all'insegna della natura e vuoi far divertire i tuoi bambini con tante attività, ti consigliamo di visitare l'oasi naturalistica del fiume Alento a pochi chilometri da Agropoli e Santa Maria di Castellabate.",
    immagine: "assets/img/oasi-alento.jpg",
    articoli: [
      {
        titolo: "Oasi Fiume Alento",
        url: "https://www.villamirella.it/cilento/oasi-alento-diga",
        estratto: "Se vuoi trascorrere una giornata all'insegna della natura e vuoi far divertire i tuoi bambini con tante attività, ti consigliamo di visitare l'oasi naturalistica del fiume Alento a pochi chilometri da Agropoli e Santa Maria di Castellabate."
      }
    ],
    distanzaKm: "",   tempoAuto: "50 min",
    inEvidenza: false
  },
  {
    id: "collina-molpa",
    nome: "Collina della Molpa",
    categoria: "natura",
    lat: "40.033098",   lng: "15.303533",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [historic/archaeological_site] — corretta al secondo giro: sito archeologico della Molpa",
    sommario: "Se sei in vacanza a Palinuro e ami la natura, non perdere l’occasione di fare trekking sulla Collina della Molpa , un vero gioiello naturalistico situato nel cuore del Parco Nazionale del Cilento .",
    immagine: "assets/img/collina-molpa.jpg",
    articoli: [
      {
        titolo: "Il sentiero della Molpa",
        url: "https://www.villamirella.it/cilento/percorso-trekking-vista-mozzafiato-molpa",
        estratto: "Se sei in vacanza a Palinuro e ami la natura, non perdere l’occasione di fare trekking sulla Collina della Molpa , un vero gioiello naturalistico situato nel cuore del Parco Nazionale del Cilento ."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "monte-bulgheria",
    nome: "Monte Bulgheria",
    categoria: "natura",
    lat: "40.069769",   lng: "15.43107",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [peak]",
    sommario: "Una delle più belle montagne del Cilento, in verità non altissimo, ma con i suoi 1225m e una stupefacente posizione geografica, il Monte Bulgheria è una mano distesa che permette all’appennino di toccare il mare.",
    immagine: "assets/img/monte-bulgheria.webp",
    articoli: [
      {
        titolo: "Cilento Trekking: il Monte Bulgheria",
        url: "https://www.villamirella.it/cilento/cilento-trekking-monte-bulgheria",
        estratto: "Una delle più belle montagne del Cilento, in verità non altissimo, ma con i suoi 1225m e una stupefacente posizione geografica, il Monte Bulgheria è una mano distesa che permette all’appennino di toccare il mare."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "pianoro-ciolandrea",
    nome: "Pianoro di Ciolandrea",
    categoria: "natura",
    lat: "40.040255",   lng: "15.457363",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [locality]",
    sommario: "Il Pianoro di Ciolandrea è stato trasformato dall'amministrazione comunale in un luogo di straordinaria bellezza, che attrae sia gli amanti della natura che i turisti in cerca di un'esperienza unica.",
    immagine: "assets/img/pianoro-ciolandrea.webp",
    articoli: [
      {
        titolo: "Pianoro di Ciolandrea e santuario di Pietrasanta",
        url: "https://www.villamirella.it/cilento/pianoro-ciolandrea-e-santuario-pietrasanta",
        estratto: "Il Pianoro di Ciolandrea è stato trasformato dall'amministrazione comunale in un luogo di straordinaria bellezza, che attrae sia gli amanti della natura che i turisti in cerca di un'esperienza unica."
      }
    ],
    distanzaKm: "",   tempoAuto: "40 min",
    inEvidenza: false
  },

  /* ---------- ARCHEOLOGIA E MUSEI ---------- */
  {
    id: "paestum",
    nome: "Paestum",
    categoria: "archeologia",
    lat: "40.421552",   lng: "15.005321",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [archaeological_site]",
    sommario: "Il Museo Archeologico Nazionale di Paestum offre una panoramica completa sulla storia della città, presentando sezioni dedicate all'età preistorica e protostorica, alla fondazione greca di Poseidonia e alla colonia romana di Paestum.",
    immagine: "assets/img/paestum.jpg",
    articoli: [
      {
        titolo: "Paestum e i Templi: l'antica città greca nel Sud Italia",
        url: "https://www.villamirella.it/cilento/paestum-e-i-templi-antica-citta-greca-nel-sud-italia",
        estratto: "Il Museo Archeologico Nazionale di Paestum offre una panoramica completa sulla storia della città, presentando sezioni dedicate all'età preistorica e protostorica, alla fondazione greca di Poseidonia e alla colonia romana di Paestum."
      }
    ],
    distanzaKm: "",   tempoAuto: "60 min",
    inEvidenza: false
  },
  {
    id: "velia",
    nome: "Area archeologica di Velia",
    categoria: "archeologia",
    lat: "40.160937",   lng: "15.15664",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [park]",
    sommario: "Questo territorio, situato nella parte meridionale della provincia di Salerno , è noto non solo per la sua natura incontaminata e le sue spiagge bandiera blu, ma anche per essere stato uno dei centri principali della Magna Grecia .",
    immagine: "assets/img/velia.jpg",
    articoli: [
      {
        titolo: "L'area archeologica di Velia",
        url: "https://www.villamirella.it/cilento/l-area-archeologica-di-velia",
        estratto: "Questo territorio, situato nella parte meridionale della provincia di Salerno , è noto non solo per la sua natura incontaminata e le sue spiagge bandiera blu, ma anche per essere stato uno dei centri principali della Magna Grecia ."
      }
    ],
    distanzaKm: "",   tempoAuto: "50 min",
    inEvidenza: false
  },
  {
    id: "sito-molpa",
    nome: "Sito archeologico della Molpa",
    categoria: "archeologia",
    lat: "40.032889",   lng: "15.303729",   verified: true,
    notaCoordinate: "OpenStreetMap [archaeological_site] — sul promontorio della Molpa, alla foce del Mingardo; accanto ci sono le rovine del castello (40.032473, 15.303738)",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "1,5 km",   tempoAuto: "5 min di macchina",
    inEvidenza: false
  },
  {
    id: "muvip-camerota",
    nome: "MUVIP — Museo Virtuale del Paleolitico",
    categoria: "archeologia",
    lat: "40.000879",   lng: "15.376191",   verified: true,
    notaCoordinate: "OpenStreetMap [museum] — al porto di Marina di Camerota, accanto all'ASL",
    sommario: "Museo dedicato alle grotte della costa di Camerota e alla presenza dell'uomo nel Paleolitico, con una sala immersiva. Si trova al porto di Marina di Camerota. Per orari e prenotazioni conviene telefonare.",
    immagine: "",
    articoli: [],
    distanzaKm: "8,3 km",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "antiquarium-roccagloriosa",
    nome: "Antiquarium di Roccagloriosa",
    categoria: "archeologia",
    lat: "40.108604",   lng: "15.430784",   verified: true,
    notaCoordinate: "OpenStreetMap [museum] — l'area archeologica lucana si trova poco piu' a monte (40.126527, 15.446651)",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "13,3 km",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "palazzo-vinciprova-pioppi",
    nome: "Palazzo Vinciprova a Pioppi — Museo Vivo del Mare e Dieta Mediterranea",
    categoria: "archeologia",
    lat: "40.174227",   lng: "15.089287",   verified: true,
    notaCoordinate: "OpenStreetMap [museum] — i due musei condividono lo stesso palazzo, quindi un solo punto sulla mappa",
    sommario: "Nel palazzo storico di Pioppi convivono due musei: il Museo Vivo del Mare, con tredici vasche che ospitano pesci e organismi del mare del Cilento, e il Museo Vivente della Dieta Mediterranea, dedicato allo stile di vita studiato da Ancel Keys, che a Pioppi visse per circa quarant'anni.",
    immagine: "",
    articoli: [],
    distanzaKm: "22,8 km",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "civitella-moio",
    nome: "Parco archeologico della Civitella",
    categoria: "archeologia",
    lat: "40.257851",   lng: "15.275872",   verified: true,
    notaCoordinate: "OpenStreetMap [archaeological_site] — Moio della Civitella",
    sommario: "",
    immagine: "",
    articoli: [],
    distanzaKm: "23,7 km",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "antiquarium",
    nome: "Antiquarium di Palinuro",
    categoria: "archeologia",
    lat: "40.034413",   lng: "15.285536",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [museum]",
    sommario: "L' Antiquarium a Palinuro è una delle cose da vedere. L'ingresso al museo è gratuito e si possono ammirare reperti archeologici che fanno capire e scoprire l'antica storia di Palinuro.",
    immagine: "assets/img/antiquarium.jpg",
    articoli: [
      {
        titolo: "Il museo dell'Anquarium a Palinuro",
        url: "https://www.villamirella.it/cilento/antiquarium-palinuro",
        estratto: "L' Antiquarium a Palinuro è una delle cose da vedere. L'ingresso al museo è gratuito e si possono ammirare reperti archeologici che fanno capire e scoprire l'antica storia di Palinuro."
      }
    ],
    distanzaKm: "",   tempoAuto: "15 min a piedi",
    inEvidenza: false
  },
  {
    id: "certosa-padula",
    nome: "Certosa di Padula",
    categoria: "archeologia",
    lat: "40.337163",   lng: "15.651678",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [monastery]",
    sommario: "La Certosa di Padula, conosciuta anche come Certosa di San Lorenzo, rappresenta il più grandioso monumento monastico del sud Italia e vanta il prestigioso riconoscimento di Patrimonio dell'Umanità dall'UNESCO.",
    immagine: "assets/img/certosa-padula.jpg",
    articoli: [
      {
        titolo: "La certosa di San Lorenzo",
        url: "https://www.villamirella.it/cilento/la-certosa-di-padula-nel-cilento",
        estratto: "La Certosa di Padula, conosciuta anche come Certosa di San Lorenzo, rappresenta il più grandioso monumento monastico del sud Italia e vanta il prestigioso riconoscimento di Patrimonio dell'Umanità dall'UNESCO."
      }
    ],
    distanzaKm: "",   tempoAuto: "60 min",
    inEvidenza: false
  },
  {
    id: "museo-ortega",
    nome: "Museo Ortega a Bosco",
    categoria: "archeologia",
    lat: "40.072886",   lng: "15.457116",   verified: true,
    notaCoordinate: "pin della guida ufficiale Villamirella (link Guidami qui) — VERIFICATO, prima era approssimato al paese di Bosco",
    sommario: "Il Cilento è sinonimo di casa. Ha dato infatti i natali ai tanti Cilentani Doc che si sono distinti nei più svariati ambiti. Ma per il suo essere accogliente, molti altri hanno scelto questa terra come dimora, anche se i propri natali erano lontani. E’ proprio ciò che ha fatto José Ortega con Bosco.",
    immagine: "assets/img/museo-ortega.jpg",
    articoli: [
      {
        titolo: "La casa Ortega a Bosco",
        url: "https://www.villamirella.it/cilento/la-casa-museo-di-ortega-a-bosco",
        estratto: "Il Cilento è sinonimo di casa. Ha dato infatti i natali ai tanti Cilentani Doc che si sono distinti nei più svariati ambiti. Ma per il suo essere accogliente, molti altri hanno scelto questa terra come dimora, anche se i propri natali erano lontani. E’ proprio ciò che ha fatto José Ortega con Bosco."
      }
    ],
    distanzaKm: "",   tempoAuto: "30 min",
    inEvidenza: false
  },

  /* ---------- SANTUARI ---------- */
  {
    id: "novi-velia",
    nome: "Santuario del Sacro Monte di Novi Velia",
    categoria: "santuari",
    lat: "40.216677",   lng: "15.335865",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [peak] — punto della vetta del Monte Gelbison, dove sorge il santuario",
    sommario: "Svettante sulla cima del monte Gelbison , a 1705 metri sul mare, il Santuario della Madonna del Sacro Monte di Novi Velia è il faro spirituale che irradia la sua luce esercitando una forte attrattiva sugli abitanti delle montagne e delle valli cilentane.",
    immagine: "assets/img/novi-velia.webp",
    articoli: [
      {
        titolo: "Il Monte Sacro di Novi Velia",
        url: "https://www.villamirella.it/cilento/il-santuario-del-sacro-monte-di-novi-velia",
        estratto: "Svettante sulla cima del monte Gelbison , a 1705 metri sul mare, il Santuario della Madonna del Sacro Monte di Novi Velia è il faro spirituale che irradia la sua luce esercitando una forte attrattiva sugli abitanti delle montagne e delle valli cilentane."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
  {
    id: "pietrasanta",
    nome: "Santuario di Pietrasanta",
    categoria: "santuari",
    lat: "40.047581",   lng: "15.462548",   verified: true,
    notaCoordinate: "OpenStreetMap/Nominatim [place_of_worship]",
    sommario: "Il Santuario della Madonna di Pietrasanta è un luogo di preghiera e di fede situato a pochi chilometri da San Giovanni a Piro, nel cuore del Parco Nazionale del Cilento, Vallo di Diano e Alburni. La costruzione del santuario risale al 1600 e la sua architettura è un esempio di barocco cilentano.",
    immagine: "assets/img/pietrasanta.jpg",
    articoli: [
      {
        titolo: "Pianoro di Ciolandrea e santuario di Pietrasanta",
        url: "https://www.villamirella.it/cilento/pianoro-ciolandrea-e-santuario-pietrasanta",
        estratto: "Il Santuario della Madonna di Pietrasanta è un luogo di preghiera e di fede situato a pochi chilometri da San Giovanni a Piro, nel cuore del Parco Nazionale del Cilento, Vallo di Diano e Alburni. La costruzione del santuario risale al 1600 e la sua architettura è un esempio di barocco cilentano."
      }
    ],
    distanzaKm: "",   tempoAuto: "",
    inEvidenza: false
  },
];

/* ============ ITINERARI, ESPERIENZE E GUIDE ============
   Non hanno coordinate proprie: si appoggiano ai luoghi elencati in
   "luoghi", e la mappa evidenzia quei pin quando si apre la scheda.
   prenotabileInReception: true fa comparire la riga "Prenotabile in
   reception" sulla scheda. Mettilo solo dove e' vero. */
window.ESPERIENZE = [

  /* ---------- ITINERARI ---------- */
  {
    id: "sentiero-primula",
    nome: "Sentiero della Primula",
    tipo: "itinerario",
    sommario: "Se ami il trekking e vuoi scoprire uno dei luoghi più belli del Cilento, il Sentiero della Primula è tra i più bei sentieri di Palinuro. Situato a Capo Palinuro, permette di esplorare l'intera zona, dalla foce del fiume Mingardo fino a Cala Ficocella e al centro del paese.",
    immagine: "",
    luoghi: ["spiaggia-ficocella"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: []
  },
  {
    id: "trekking-faro",
    nome: "Trekking del Faro di Capo Palinuro",
    tipo: "itinerario",
    sommario: "",
    immagine: "",
    luoghi: ["grotta-azzurra"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: []
  },
  {
    id: "sentiero-tragara",
    nome: "Sentiero della Tragara",
    tipo: "itinerario",
    sommario: "",
    immagine: "",
    luoghi: ["san-severino"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: []
  },
  {
    id: "percorso-capelli-venere",
    nome: "Anello dell'Oasi Capelli di Venere",
    tipo: "itinerario",
    sommario: "",
    immagine: "",
    luoghi: ["capelli-di-venere"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: []
  },

  {
    id: "sentiero-fortini",
    nome: "Sentiero dei Fortini",
    tipo: "itinerario",
    sommario: "Il percorso, che si snoda tra la vegetazione mediterranea e le scogliere a picco sul mare, è lungo circa 3 km e presenta una difficoltà media. Il sentiero dei fortini è stato realizzato su un tracciato che un tempo era utilizzato dalle truppe militari per proteggere la costa dai pirati saraceni.",
    immagine: "assets/img/sentiero-fortini.jpg",
    luoghi: ["grotta-azzurra"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Sentiero dei Fortini",
        url: "https://www.villamirella.it/cilento/sentiero-fortini-palinuro-trekking",
        estratto: "Il percorso, che si snoda tra la vegetazione mediterranea e le scogliere a picco sul mare, è lungo circa 3 km e presenta una difficoltà media. Il sentiero dei fortini è stato realizzato su un tracciato che un tempo era utilizzato dalle truppe militari per proteggere la costa dai pirati saraceni."
      }
    ]
  },
  {
    id: "sentiero-infreschi",
    nome: "Sentiero del Mediterraneo agli Infreschi",
    tipo: "itinerario",
    sommario: "Il sentiero del Mediterraneo a Marina di Camerota attraversa alcune delle più belle spiagge della Costa del Cilento. Puoi iniziare il percorso dalla spiaggia di Calanca , una piccola spiaggia di sabbia situata ai piedi del centro storico di Marina di Camerota.",
    immagine: "assets/img/sentiero-infreschi.jpg",
    luoghi: ["porto-infreschi", "marina-di-camerota"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Una passeggiata indimenticabile: Sentiero del Mediterraneo a Baia degli Infreschi",
        url: "https://www.villamirella.it/cilento/sentiero-del-mediterraneo-a-baia-degli-infreschi-marina-di-camerota",
        estratto: "Il sentiero del Mediterraneo a Marina di Camerota attraversa alcune delle più belle spiagge della Costa del Cilento. Puoi iniziare il percorso dalla spiaggia di Calanca , una piccola spiaggia di sabbia situata ai piedi del centro storico di Marina di Camerota."
      }
    ]
  },
  {
    id: "trekking-molpa",
    nome: "Trekking sulla collina della Molpa",
    tipo: "itinerario",
    sommario: "Se sei in vacanza a Palinuro e ami la natura, non perdere l’occasione di fare trekking sulla Collina della Molpa , un vero gioiello naturalistico situato nel cuore del Parco Nazionale del Cilento .",
    immagine: "assets/img/trekking-molpa.jpg",
    luoghi: ["collina-molpa"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Il sentiero della Molpa",
        url: "https://www.villamirella.it/cilento/percorso-trekking-vista-mozzafiato-molpa",
        estratto: "Se sei in vacanza a Palinuro e ami la natura, non perdere l’occasione di fare trekking sulla Collina della Molpa , un vero gioiello naturalistico situato nel cuore del Parco Nazionale del Cilento ."
      }
    ]
  },
  {
    id: "trekking-bulgheria",
    nome: "Trekking sul Monte Bulgheria",
    tipo: "itinerario",
    sommario: "Una delle più belle montagne del Cilento, in verità non altissimo, ma con i suoi 1225m e una stupefacente posizione geografica, il Monte Bulgheria è una mano distesa che permette all’appennino di toccare il mare.",
    immagine: "",
    luoghi: ["monte-bulgheria"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Cilento Trekking: il Monte Bulgheria",
        url: "https://www.villamirella.it/cilento/cilento-trekking-monte-bulgheria",
        estratto: "Una delle più belle montagne del Cilento, in verità non altissimo, ma con i suoi 1225m e una stupefacente posizione geografica, il Monte Bulgheria è una mano distesa che permette all’appennino di toccare il mare."
      }
    ]
  },
  {
    id: "cammino-san-nilo",
    nome: "Cammino di San Nilo",
    tipo: "itinerario",
    sommario: "Il Cammino di San Nilo offre un percorso di pellegrinaggio unico attraverso il Cilento Bizantino , una zona immersa nel Parco Nazionale del Cilento, Vallo di Diano e Alburni, dove si conservano preziose tracce della cultura greca antica e medievale.",
    immagine: "assets/img/cammino-san-nilo.webp",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Il Cammino di San Nilo: Un Viaggio nel Cuore del Cilento Bizantino",
        url: "https://www.villamirella.it/cilento/cammino-di-san-nilo-cilento-sentieri",
        estratto: "Il Cammino di San Nilo offre un percorso di pellegrinaggio unico attraverso il Cilento Bizantino , una zona immersa nel Parco Nazionale del Cilento, Vallo di Diano e Alburni, dove si conservano preziose tracce della cultura greca antica e medievale."
      }
    ]
  },
  {
    id: "via-silente",
    nome: "La Via Silente in bici",
    tipo: "itinerario",
    sommario: "La Via Silente prende il nome dal silenzio, re assoluto del Cilento. Così difficile da descrivere, nel silenzio paesaggi, colori, profumi e tempo si mescolano. Si rimane incantati nell'ascoltare il silenzio mentre il sole gioca a nascondino tra le nuvole cambiando la luce, in ogni momento.",
    immagine: "assets/img/via-silente.jpg",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Vacanze in bici: Via Silente",
        url: "https://www.villamirella.it/cilento/la-via-silente",
        estratto: "La Via Silente prende il nome dal silenzio, re assoluto del Cilento. Così difficile da descrivere, nel silenzio paesaggi, colori, profumi e tempo si mescolano. Si rimane incantati nell'ascoltare il silenzio mentre il sole gioca a nascondino tra le nuvole cambiando la luce, in ogni momento."
      }
    ]
  },

  /* ---------- ESPERIENZE ---------- */
  {
    id: "gita-grotte",
    nome: "Giro in barca alle Grotte di Capo Palinuro",
    tipo: "esperienza",
    sommario: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto.",
    immagine: "assets/img/gita-grotte.jpg",
    luoghi: ["grotta-azzurra", "grotta-del-sangue", "grotta-d-argento", "grotta-sulfurea", "grotta-delle-ossa", "grotta-dei-monaci", "grotta-della-cernia"],
    prenotabileInReception: true,
    inEvidenza: true,
    articoli: [
      {
        titolo: "Tour in barca: le grotte di Palinuro",
        url: "https://www.villamirella.it/cilento/gita-in-barca-alle-grotte-di-palinuro",
        estratto: "L'escursione in barca lungo il promontorio di Capo Palinuro è adatta a tutti, grandi e piccoli, e non presenta nessun particolare rischio. Durante la gita in barca ti lascerai incantare dal panorama unico di questi luoghi e conquistare dai racconti delle guide del posto."
      }
    ]
  },
  {
    id: "immersioni",
    nome: "Immersioni alle grotte di Palinuro",
    tipo: "esperienza",
    sommario: "Diverse sono i centri immersione del Cilento in cui è possibile praticare il diving. Per la bellezze delle coste, il mare cristallino e i fondali spettacolari solo Palinuro è il luogo ideale per le immersioni subacquee .",
    immagine: "assets/img/immersioni.jpg",
    luoghi: ["palinuro-sub", "continente-blu"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Immersioni a Palinuro",
        url: "https://www.villamirella.it/cilento/immersioni-alle-grotte-di-palinuro",
        estratto: "Diverse sono i centri immersione del Cilento in cui è possibile praticare il diving. Per la bellezze delle coste, il mare cristallino e i fondali spettacolari solo Palinuro è il luogo ideale per le immersioni subacquee ."
      }
    ]
  },
  {
    id: "lamparata",
    nome: "La lamparata a Marina di Camerota",
    tipo: "esperienza",
    sommario: "Il punto di partenza è fissato dal porto di Marina di Camerota, intorno alle 21, a pochi minuti di auto dagli appartamenti di Villamirella.",
    immagine: "assets/img/lamparata.jpg",
    luoghi: ["marina-di-camerota"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "La lamparata a Marina di Camerota",
        url: "https://www.villamirella.it/cilento/lamparata-marina-di-camerota",
        estratto: "Il punto di partenza è fissato dal porto di Marina di Camerota, intorno alle 21, a pochi minuti di auto dagli appartamenti di Villamirella."
      }
    ]
  },
  {
    id: "piano-croce",
    nome: "Parco avventura Piano della Croce",
    tipo: "esperienza",
    sommario: "Vieni a scoprire il Parco Avventura Piano della Croce, situato nel meraviglioso Cilento, in Campania.",
    immagine: "assets/img/piano-croce.jpg",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Il parco avventura della Piano della Croce",
        url: "https://www.villamirella.it/cilento/parco-avventura-piano-croce",
        estratto: "Vieni a scoprire il Parco Avventura Piano della Croce, situato nel meraviglioso Cilento, in Campania."
      }
    ]
  },
  {
    id: "cantine",
    nome: "Le cantine del Cilento",
    tipo: "esperienza",
    sommario: "Il Cilento, un'affascinante regione situata nel cuore della Campania, è rinomato non solo per le sue bellezze naturali e i siti archeologici di valore inestimabile, ma anche per la produzione di vini straordinari.",
    immagine: "assets/img/cantine.webp",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "I migliori vini del Cilento da assaggiare",
        url: "https://www.villamirella.it/cilento/i-migliori-vini-del-cilento-campania",
        estratto: "Il Cilento, un'affascinante regione situata nel cuore della Campania, è rinomato non solo per le sue bellezze naturali e i siti archeologici di valore inestimabile, ma anche per la produzione di vini straordinari."
      }
    ]
  },

  /* ---------- GUIDE ---------- */
  {
    id: "guida-cilento",
    nome: "Cosa vedere nel Cilento",
    tipo: "guida",
    sommario: "Il Parco Nazionale del Cilento e del Vallo di Diano, dichiarato patrimonio dell'UNESCO, copre una superficie di circa 180.000 ettari, rendendolo il secondo parco nazionale più esteso d'Italia.",
    immagine: "assets/img/guida-cilento.jpg",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Cilento: la guida alle attrazioni turistiche da non perdere",
        url: "https://www.villamirella.it/cilento/cilento-cosa-vedere-fare-in-vacanza",
        estratto: "Il Parco Nazionale del Cilento e del Vallo di Diano, dichiarato patrimonio dell'UNESCO, copre una superficie di circa 180.000 ettari, rendendolo il secondo parco nazionale più esteso d'Italia."
      }
    ]
  },
  {
    id: "guida-10-cose",
    nome: "Le 10 cose da fare nel Cilento",
    tipo: "guida",
    sommario: "Uno dei parchi nazionali più grandi d'Italia, riserva MAB dell'UNESCO. Al suo interno si trovano borghi medievali, corsi d'acqua cristallini, foreste di querce e faggeti. Una visita al centro del parco, passando per Teggiano o Sant'Angelo a Fasanella, è un viaggio nel cuore autentico della Campania.",
    immagine: "assets/img/guida-10-cose.jpg",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Le 10 cose da fare nel Cilento",
        url: "https://www.villamirella.it/cilento/le-10-cose-da-fare-nel-cilento",
        estratto: "Uno dei parchi nazionali più grandi d'Italia, riserva MAB dell'UNESCO. Al suo interno si trovano borghi medievali, corsi d'acqua cristallini, foreste di querce e faggeti. Una visita al centro del parco, passando per Teggiano o Sant'Angelo a Fasanella, è un viaggio nel cuore autentico della Campania."
      }
    ]
  },
  {
    id: "guida-palinuro",
    nome: "Cosa fare a Palinuro",
    tipo: "guida",
    sommario: "Le immersioni a Palinuro la fanno da padrone tra gli sport in mare : sono talmente tante e talmente belle le grotte marine , che non manca l’imbarazzo della scelta.",
    immagine: "assets/img/guida-palinuro.jpg",
    luoghi: ["palinuro"],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Sport, relax e divertimento a Palinuro",
        url: "https://www.villamirella.it/cilento/cosa-fare-a-palinuro",
        estratto: "Le immersioni a Palinuro la fanno da padrone tra gli sport in mare : sono talmente tante e talmente belle le grotte marine , che non manca l’imbarazzo della scelta."
      }
    ]
  },
  {
    id: "guida-bambini",
    nome: "Spiagge a misura di bambino",
    tipo: "guida",
    sommario: "Le neomamme tendono a porsi troppe domande prima di intraprendere un viaggio con un bambino. Che senso ha farlo viaggiare a quest'età se poi non si ricorderà nulla? La classica scusa che usano le mamme per coprire le proprie paure.",
    immagine: "",
    luoghi: [],
    prenotabileInReception: false,
    inEvidenza: false,
    articoli: [
      {
        titolo: "Vacanze in famiglia a Palinuro",
        url: "https://www.villamirella.it/cilento/dove-andare-in-vacanza-con-i-bambini-a-palinuro",
        estratto: "Le neomamme tendono a porsi troppe domande prima di intraprendere un viaggio con un bambino. Che senso ha farlo viaggiare a quest'età se poi non si ricorderà nulla? La classica scusa che usano le mamme per coprire le proprie paure."
      }
    ]
  },
];
