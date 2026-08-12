/* =====================================================================
   guida.js — LE PAGINE INFORMATIVE DEL CHIOSCO
   =====================================================================
   Il contenuto viene dalla guida ufficiale di Villamirella
   (palinuro.my.canva.site/villamirella). Per modificare un testo basta
   cambiarlo qui; ogni pagina e' un elenco di blocchi:

     { t: "..." }                       un sottotitolo
     { p: "..." }                       un paragrafo
     { kv: [["chiave","valore"], ...] } righe chiave-valore
     { card: { nome, dove, testo } }    una scheda (ristorante, negozio...)

   "icona" e' il nome di un'icona disegnata in app.js.
   "sezione" invece di "blocchi" apre una sezione dell'esploratore
   (elenco + mappa) invece di una pagina di testo.
   ===================================================================== */

window.GUIDA = {

  benvenuto: {
    titolo: "Benvenuto!",
    sotto: "Un'oasi di relax nel cuore del Cilento, dove natura, comfort e ospitalità si incontrano.",
    frase: "Siamo sempre al tuo fianco durante tutto il soggiorno: non esitare a contattarci per qualsiasi esigenza o consiglio."
  },

  /* le mattonelle della schermata iniziale: e' QUESTA la navigazione
     fra le sezioni (nell'esploratore non c'e' piu' un menu).
     "gruppo" crea un'intestazione sopra il blocco di mattonelle. */
  MATTONELLE: [
    { gruppo: "Esplora il territorio" },
    { id: "mare",        nome: "Spiagge e mare",    icona: "mare",        colore: "#1a87c9", sezione: "mare" },
    { id: "esperienze",  nome: "Esperienze",        icona: "esperienze",  colore: "#d09a1e", sezione: "esperienze" },
    { id: "itinerari",   nome: "Itinerari",         icona: "itinerari",   colore: "#1f8074", sezione: "itinerari" },
    { id: "borghi",      nome: "Borghi e paesi",    icona: "borghi",      colore: "#c96a2b", sezione: "cat:borghi" },
    { id: "natura",      nome: "Natura e oasi",     icona: "natura",      colore: "#2f9e60", sezione: "cat:natura" },
    { id: "archeologia", nome: "Archeologia",       icona: "archeologia", colore: "#b5892f", sezione: "cat:archeologia" },
    { id: "santuari",    nome: "Santuari",          icona: "santuari",    colore: "#9550a8", sezione: "cat:santuari" },
    { gruppo: "Il tuo soggiorno" },
    { id: "ristoranti",  nome: "Ristoranti",        icona: "ristoranti",  colore: "#d64550", sezione: "g:ristoranti" },
    { id: "negozi",      nome: "Negozi",            icona: "negozi",      colore: "#5b7d8c", sezione: "g:negozi" },
    { id: "salute",      nome: "Salute e farmacie", icona: "salute",      colore: "#c0392b", sezione: "g:salute" },
    { id: "checkin",     nome: "Check-in / out",    icona: "checkin",     pagina: "checkin" },
    { id: "wifi",        nome: "WiFi",              icona: "wifi",        pagina: "wifi" },
    { id: "regole",      nome: "Regole della casa", icona: "regole",      pagina: "regole" },
    { id: "muoversi",    nome: "Come muoversi",     icona: "muoversi",    pagina: "muoversi" },
    { id: "faq",         nome: "Domande frequenti", icona: "faq",         pagina: "faq" },
    { id: "contatti",    nome: "Contatti",          icona: "contatti",    pagina: "contatti" }
  ],

  PAGINE: {

    checkin: {
      titolo: "Check-in e check-out",
      blocchi: [
        { t: "Check-in: dalle 15:00 alle 20:00" },
        { p: "Se prevedi di arrivare prima o più tardi, contattaci: faremo il possibile per trovare insieme la soluzione più comoda per te. Al tuo arrivo ti accompagneremo personalmente e ti forniremo tutte le informazioni utili per goderti al meglio il soggiorno." },
        { t: "Check-out: entro le 10:00" },
        { p: "Ti chiediamo gentilmente di lasciare l'appartamento entro le ore 10:00, così da permetterci di prepararlo al meglio per i prossimi ospiti. Prima di partire, assicurati di aver raccolto tutti i tuoi effetti personali e di lasciare la sistemazione in ordine." }
      ]
    },

    wifi: {
      titolo: "Rete WiFi",
      blocchi: [
        { kv: [["Nome della rete", "primulapalinuri"], ["Password", "VMresidence"]] },
        { img: "assets/wifi-qr.png", didascalia: "Inquadra il codice con la fotocamera del telefono per collegarti subito." },
        { p: "La rete copre gli alloggi e le aree comuni del residence." }
      ]
    },

    regole: {
      titolo: "Regole della casa",
      blocchi: [
        { t: "In appartamento" },
        { kv: [
          ["Raccolta differenziata", "l'isola ecologica è all'interno del residence, in fondo al parcheggio"],
          ["Chiavi", "prima di uscire assicurati che non restino inserite nella serratura, all'interno"],
          ["Luci", "spegni le luci interne e della terrazza durante il giorno o quando esci"],
          ["Frigorifero", "chiudi bene la porta e tieni la temperatura impostata su 2"],
          ["Pulizia", "il riassetto quotidiano spetta a te; puoi richiedere pulizie integrative a pagamento"],
          ["Aria condizionata", "non tenere le finestre aperte quando è accesa; spegnila quando esci"]
        ]},
        { t: "Nella struttura" },
        { kv: [
          ["Piscina", "aperta dalle 9:00 alle 20:00; sorveglia i bambini; non sono ammessi tuffi"],
          ["Parcheggio", "parcheggia nel parcheggio interno occupando un solo posto auto"],
          ["Ospiti esterni", "ricevili nel giardino davanti alla reception, avvisando la direzione; non possono usare la piscina né accedere all'alloggio"],
          ["Animali", "benvenuti fino a 25 kg, uno per alloggio, previa autorizzazione e con supplemento; sempre al guinzaglio nelle aree comuni, niente zona piscina"]
        ]}
      ]
    },

    muoversi: {
      titolo: "Come muoversi",
      blocchi: [
        { t: "In auto" },
        { p: "Avere un'auto è il modo più comodo per esplorare il Cilento: ti permette di raggiungere liberamente spiagge, borghi e attrazioni naturalistiche. La struttura dispone di parcheggio gratuito." },
        { t: "In treno" },
        { p: "La stazione più vicina è Pisciotta–Palinuro, a breve distanza dalla struttura. Da qui si raggiungono Napoli, Salerno e le altre destinazioni della costa. Su richiesta organizziamo un servizio taxi da e per la stazione." },
        { t: "In autobus" },
        { p: "La fermata più comoda è Palinuro Piana (Todis), servita dagli autobus Infante. Chiedi in reception per orari e biglietti." },
        { t: "A piedi o in bicicletta" },
        { p: "Alcune spiagge, ristoranti e negozi si raggiungono comodamente a piedi o in bicicletta: un modo piacevole di scoprire il territorio." },
        { t: "Taxi e transfer" },
        { p: "Su richiesta organizziamo taxi e transfer privati per aeroporti, stazioni o spostamenti locali. Consigliamo di prenotare in anticipo." }
      ]
    },

    ristoranti: {
      titolo: "Ristoranti",
      mappa: true,
      blocchi: [
        { t: "A Palinuro" },
        { card: { nome: "Ristorante Core a Core", foto: "assets/img/rist-core-a-core.jpg", lat: 40.028099, lng: 15.287849, dove: "Zona Faro — 8 min di macchina",
          testo: "Cucina tradizionale prevalentemente a base di pesce, con materie prime selezionate e un'ampia carta dei vini." } },
        { card: { nome: "Pizzeria Veracemente", foto: "assets/img/rist-veracemente.jpg", lat: 40.032906, lng: 15.287663, dove: "Via Santa Maria — 5 min di macchina",
          testo: "Il posto ideale per un'autentica pizza napoletana, con ingredienti di qualità e impasti leggeri, in un ambiente informale." } },
        { card: { nome: "Agriturismo Isca delle Donne", foto: "assets/img/rist-isca-delle-donne.jpg", lat: 40.039185, lng: 15.297598, dove: "Via Isca delle Donne — 2 min di macchina",
          testo: "Immerso in un'atmosfera bucolica, serve piatti della tradizione cilentana con materie prime proprie." } },
        { t: "A Pisciotta (10–18 min)" },
        { card: { nome: "Ristorante 3 Gufi", foto: "assets/img/rist-3-gufi.jpg", dove: "Via Roma — 15 min di macchina",
          testo: "Ottima cucina con piatti innovativi e prodotti di prima qualità." } },
        { card: { nome: "Malabar", foto: "assets/img/rist-malabar.jpg", dove: "Traversa Passariello — 18 min di macchina",
          testo: "Ricette di pesce servite in sala o sulla terrazza vista mare, in un'atmosfera informale." } },
        { card: { nome: "Ristorante Angelina", foto: "assets/img/rist-angelina.jpg", dove: "Piazza Michelangelo Pagano — 15 min di macchina",
          testo: "Nel cuore del centro storico, proposte semplici di buona materia prima, ben eseguite ed economiche." } },
        { t: "A Marina di Camerota (10–18 min)" },
        { card: { nome: "La Cantina del Marchese", foto: "assets/img/rist-cantina-marchese.jpg", lat: 40.000694, lng: 15.373441, dove: "Via del Marchese — 10 min di macchina",
          testo: "Piatti e vini del Cilento serviti in una taverna con volte, pietra a vista e arredi di legno." } },
        { card: { nome: "Brera – L'orto del mare", foto: "assets/img/rist-brera.jpg", lat: 39.999126, lng: 15.371847, dove: "Via S. Alfonso — 10 min di macchina",
          testo: "Locale curato dove gustare piatti di mare freschissimi e sapori mediterranei rivisitati con creatività." } },
        { card: { nome: "Kon Tiki 2.0", foto: "assets/img/rist-kon-tiki.jpg", lat: 40.00164, lng: 15.375975, dove: "Via Variante Castello — 18 min di macchina",
          testo: "Ideale per una buona pizza in un ambiente vivace e informale, a pochi passi dal mare." } }
      ]
    },

    negozi: {
      titolo: "Supermercati e negozi",
      mappa: true,
      blocchi: [
        { t: "Supermercati" },
        { card: { nome: "Decò", foto: "assets/img/negozio-deco.jpg", lat: 40.046555, lng: 15.298006, dove: "Palinuro — 1 min a piedi", testo: "" } },
        { card: { nome: "Todis", foto: "assets/img/negozio-todis.jpg", lat: 40.04238, lng: 15.300809, dove: "Palinuro — 1 min di macchina", testo: "" } },
        { card: { nome: "Eté", foto: "assets/img/negozio-ete.jpg", lat: 40.039629, lng: 15.310564, dove: "Palinuro — 3 min di macchina", testo: "" } },
        { card: { nome: "Mensana alimentari", foto: "assets/img/negozio-mensana.jpg", lat: 40.039177, lng: 15.288385, dove: "Palinuro — 3 min di macchina", testo: "" } },
        { t: "Sapori del territorio" },
        { card: { nome: "La Calabrisella", foto: "assets/img/negozio-calabrisella.jpg", lat: 40.033126, lng: 15.288192, dove: "Via Santa Maria — 5 min di macchina",
          testo: "Pescheria storica di Palinuro con ottimo pesce fresco e pescato locale." } },
        { card: { nome: "Punto Carni Romano", foto: "assets/img/negozio-punto-carni.jpg", lat: 40.037587, lng: 15.288908, dove: "Via Acqua del Lauro — 2 min di macchina",
          testo: "Carni selezionate di alta qualità, preparazioni fresche e specialità locali, ideali per le grigliate." } },
        { card: { nome: "Cilenterie", foto: "assets/img/negozio-cilenterie.jpg", lat: 40.033592, lng: 15.286972, dove: "Corso Carlo Pisacane — 5 min di macchina",
          testo: "Negozio di specialità del Cilento e articoli da regalo." } }
      ]
    },

    faq: {
      titolo: "Domande frequenti",
      blocchi: [
        { t: "Quanto dista il mare?" },
        { p: "Siamo in una posizione strategica: solo 900 metri ci separano dal mare. In pochi minuti raggiungi sia le spiagge sabbiose delle Saline sia quelle ghiaiose dell'Arco Naturale e della Marinella." },
        { t: "Avete convenzioni con dei lidi?" },
        { p: "Sì: Villamirella ha convenzioni attive con alcuni lidi della zona, con condizioni vantaggiose per i nostri ospiti. Chiedi in reception." },
        { t: "Posso aggiungere la colazione?" },
        { p: "Sì: in formula residence puoi aggiungere la colazione a buffet, con sconto per i bambini, tra torte fatte in casa e proposte dolci e salate. Se hai prenotato una camera, la colazione è già inclusa." },
        { t: "C'è una lavanderia?" },
        { p: "Sì, una lavanderia a gettoni in uso comune." },
        { t: "Posso fare il barbecue?" },
        { p: "Nei giardini trovi una zona barbecue attrezzata con griglie, tavoli e sedie in legno. Ricordati di comunicarne l'uso alla direzione." },
        { t: "Come funzionano le pulizie?" },
        { p: "Le camere vengono pulite quotidianamente dallo staff. Negli appartamenti la pulizia spetta a te, ma puoi richiedere il servizio giornaliero o una pulizia integrativa." },
        { t: "Servizi extra" },
        { p: "Colazione a buffet, pulizia integrativa, tour in barca tra grotte e calette, lidi convenzionati: chiedi in reception per aggiungere valore alla tua vacanza." }
      ]
    },

    salute: {
      titolo: "Salute ed emergenze",
      mappa: true,
      blocchi: [
        { kv: [
          ["Emergenza sanitaria", "118"],
          ["Numero unico di emergenza", "112"]
        ]},
        { t: "Guardia medica" },
        { card: { nome: "Guardia Medica Turistica — Marina di Camerota", lat: 40.000415, lng: 15.374597,
          dove: "Località Porto, uffici all'ingresso della struttura portuale",
          testo: "Assistenza medica di base per cittadini e turisti, tutti i giorni dalle 8:00 alle 20:00. Telefono 0974 939684." } },
        { t: "Farmacie" },
        { card: { nome: "Farmacia Speranza", lat: 40.035865, lng: 15.286794,
          dove: "Corso Carlo Pisacane 64 — Palinuro centro",
          testo: "La farmacia di Palinuro. Telefono 0974 931315." } },
        { card: { nome: "Dispensario stagionale Farmacia Speranza", lat: 40.043285, lng: 15.300119,
          dove: "Via Acqua del Lauro, località Piana — vicino al Todis",
          testo: "Presidio estivo della Farmacia Speranza, a due passi dal residence." } },
        { card: { nome: "Farmacia San Pantaleone", lat: 40.064913, lng: 15.312591,
          dove: "Via T. Tasso 27 — Centola paese", testo: "" } },
        { card: { nome: "Farmacia Giuliani", lat: 39.998588, lng: 15.370933,
          dove: "Marina di Camerota", testo: "" } },
        { card: { nome: "Farmacia Dott.ssa Di Maio", lat: 40.083850, lng: 15.265726,
          dove: "SS447r — Pisciotta", testo: "" } },
        { p: "In caso di dubbio su cosa fare, chiama il 118 oppure rivolgiti alla reception: siamo qui per aiutarti." }
      ]
    },

    contatti: {
      titolo: "Contatti",
      blocchi: [
        { p: "Siamo sempre al tuo fianco. Per assistenza, suggerimenti o consigli per vivere al meglio il Cilento, contattaci in qualsiasi momento — o passa in reception." },
        { kv: [
          ["Telefono", "0974 938097"],
          ["Cellulare", "379 182 5227"],
          ["Mirella", "347 877 9894"],
          ["Carmelo", "347 877 9616"],
          ["Indirizzo", "Via Isca 2, 84051 Palinuro (SA)"]
        ]},
        { t: "Ti è piaciuto il soggiorno?" },
        { p: "Ti saremmo grati se condividessi la tua esperienza lasciando una recensione: chiedi in reception come fare. Grazie per averci scelto!" }
      ]
    }
  }
};
