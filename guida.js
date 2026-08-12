/* =====================================================================
   guida.js — LE PAGINE INFORMATIVE DEL CHIOSCO
   =====================================================================
   Il contenuto viene dalla guida ufficiale di Villamirella
   (palinuro.my.canva.site/villamirella). Per modificare un testo basta
   cambiarlo qui; ogni pagina e' un elenco di blocchi:

     { t: "...", t_en: "...", icona: "auto" }   sottotitolo (icona a scelta)
     { p: "..." }                       un paragrafo
     { kv: [["chiave","valore"], ...] } righe chiave-valore
     { card: { nome, dove, testo } }    una scheda (ristorante, negozio...)

   "icona" e' il nome di un'icona disegnata in app.js.
   "sezione" invece di "blocchi" apre una sezione dell'esploratore
   (elenco + mappa) invece di una pagina di testo.
   ===================================================================== */

window.GUIDA = {

  benvenuto: {
    titolo: "Benvenuti!",       titolo_en: "Welcome!",
    sotto: "Un'oasi di relax nel cuore del Cilento, dove natura, comfort e ospitalità si incontrano.",
    sotto_en: "An oasis of relaxation in the heart of Cilento, where nature, comfort and hospitality come together."
  },

  /* le mattonelle della schermata iniziale: e' QUESTA la navigazione
     fra le sezioni (nell'esploratore non c'e' piu' un menu).
     "gruppo" crea un'intestazione sopra il blocco di mattonelle. */
  MATTONELLE: [
    { gruppo: "Esplora il territorio", gruppo_en: "Explore the area" },
    { id: "mare",        nome: "Spiagge e mare", nome_en: "Beaches & sea",    icona: "mare",        colore: "#1a87c9", sezione: "mare" },
    { id: "esperienze",  nome: "Esperienze", nome_en: "Experiences",        icona: "esperienze",  colore: "#d09a1e", sezione: "esperienze" },
    { id: "itinerari",   nome: "Itinerari", nome_en: "Itineraries",         icona: "itinerari",   colore: "#1f8074", sezione: "itinerari" },
    { id: "borghi",      nome: "Borghi e paesi", nome_en: "Villages & towns",    icona: "borghi",      colore: "#c96a2b", sezione: "cat:borghi" },
    { id: "natura",      nome: "Natura e oasi", nome_en: "Nature & oases",     icona: "natura",      colore: "#2f9e60", sezione: "cat:natura" },
    { id: "archeologia", nome: "Archeologia", nome_en: "Archaeology",       icona: "archeologia", colore: "#b5892f", sezione: "cat:archeologia" },
    { id: "santuari",    nome: "Santuari", nome_en: "Sanctuaries",          icona: "santuari",    colore: "#9550a8", sezione: "cat:santuari" },
    { gruppo: "Il tuo soggiorno", gruppo_en: "Your stay" },
    { id: "ristoranti",  nome: "Ristoranti", nome_en: "Restaurants",        icona: "ristoranti",  colore: "#d64550", sezione: "g:ristoranti" },
    { id: "negozi",      nome: "Negozi", nome_en: "Shops",            icona: "negozi",      colore: "#5b7d8c", sezione: "g:negozi" },
    { id: "salute",      nome: "Salute e farmacie", nome_en: "Health & pharmacies", icona: "salute",      colore: "#c0392b", sezione: "g:salute" },
    { id: "checkin",     nome: "Check-in / out", nome_en: "Check-in / out",    icona: "checkin",     pagina: "checkin" },
    { id: "wifi",        nome: "WiFi", nome_en: "WiFi",              icona: "wifi",        pagina: "wifi" },
    { id: "regole",      nome: "Regole della casa", nome_en: "House rules", icona: "regole",      pagina: "regole" },
    { id: "muoversi",    nome: "Come muoversi", nome_en: "Getting around",     icona: "muoversi",    pagina: "muoversi" },
    { id: "faq",         nome: "Domande frequenti", nome_en: "FAQ", icona: "faq",         pagina: "faq" },
    { id: "contatti",    nome: "Contatti", nome_en: "Contacts",          icona: "contatti",    pagina: "contatti" }
  ],

  PAGINE: {

    checkin: {
      titolo: "Check-in e check-out",
      titolo_en: "Check-in and check-out",
      blocchi: [
        { t: "Check-in: dalle 15:00 alle 20:00", t_en: "Check-in: from 3 pm to 8 pm", icona: "checkin" },
        { p: "Se prevedi di arrivare prima o più tardi, contattaci: faremo il possibile per trovare insieme la soluzione più comoda per te. Al tuo arrivo ti accompagneremo personalmente e ti forniremo tutte le informazioni utili per goderti al meglio il soggiorno.",
          p_en: "If you plan to arrive earlier or later, contact us: we will do our best to find the most convenient solution together. On arrival we will personally welcome you and give you all the information you need to enjoy your stay." },
        { t: "Check-out: entro le 10:00", t_en: "Check-out: by 10 am", icona: "uscita" },
        { p: "Ti chiediamo gentilmente di lasciare l'appartamento entro le ore 10:00, così da permetterci di prepararlo al meglio per i prossimi ospiti. Prima di partire, assicurati di aver raccolto tutti i tuoi effetti personali e di lasciare la sistemazione in ordine.",
          p_en: "We kindly ask you to leave the apartment by 10 am, so we can prepare it for the next guests. Before leaving, make sure you have collected all your belongings and left the accommodation tidy." }
      ]
    },

    wifi: {
      titolo: "Rete WiFi",
      titolo_en: "WiFi network",
      blocchi: [
        { kv: [["Nome della rete", "VMresidence"], ["Password", "primulapalinuri"]], kv_en: [["Network name", "VMresidence"], ["Password", "primulapalinuri"]] },
        { img: "assets/wifi-qr.png", didascalia: "Inquadra il codice con la fotocamera del telefono per collegarti subito.", didascalia_en: "Scan the code with your phone camera to connect instantly." },
        { p: "La rete copre gli alloggi e le aree comuni del residence.", p_en: "The network covers the apartments and the common areas of the residence." }
      ]
    },

    regole: {
      titolo: "Regole della casa",
      titolo_en: "House rules",
      blocchi: [
        { t: "In appartamento", t_en: "In the apartment", icona: "casa" },
        { kv: [
          ["Raccolta differenziata", "l'isola ecologica è all'interno del residence, in fondo al parcheggio", "riciclo"],
          ["Chiavi", "prima di uscire assicurati che non restino inserite nella serratura, all'interno", "checkin"],
          ["Luci", "spegni le luci interne e della terrazza durante il giorno o quando esci", "luce"],
          ["Frigorifero", "chiudi bene la porta e tieni la temperatura impostata su 2", "frigo"],
          ["Pulizia", "il riassetto quotidiano spetta a te; puoi richiedere pulizie integrative a pagamento", "pulizia"],
          ["Aria condizionata", "non tenere le finestre aperte quando è accesa; spegnila quando esci", "aria"]
        ], kv_en: [
          ["Recycling", "the waste collection point is inside the residence, at the far end of the car park", "riciclo"],
          ["Keys", "before going out, make sure they are not left in the lock on the inside", "checkin"],
          ["Lights", "switch off indoor and terrace lights during the day or when you go out", "luce"],
          ["Fridge", "close the door properly and keep the temperature set to 2", "frigo"],
          ["Cleaning", "daily tidying is up to you; extra cleaning is available on request, for a fee", "pulizia"],
          ["Air conditioning", "do not keep windows open while it is on; switch it off when you leave", "aria"]
        ]},
        { t: "Nella struttura", t_en: "Around the residence", icona: "regole" },
        { kv: [
          ["Piscina", "aperta dalle 9:00 alle 20:00; sorveglia i bambini; non sono ammessi tuffi", "piscina"],
          ["Parcheggio", "parcheggia nel parcheggio interno occupando un solo posto auto", "auto"],
          ["Ospiti esterni", "ricevili nel giardino davanti alla reception, avvisando la direzione; non possono usare la piscina né accedere all'alloggio", "ospiti"],
          ["Animali", "benvenuti fino a 25 kg, uno per alloggio, previa autorizzazione e con supplemento; sempre al guinzaglio nelle aree comuni, niente zona piscina", "animali"]
        ], kv_en: [
          ["Swimming pool", "open from 9 am to 8 pm; keep an eye on children; diving is not allowed", "piscina"],
          ["Parking", "park in the internal car park using one space only", "auto"],
          ["Visitors", "welcome them in the garden in front of reception, informing the management; they may not use the pool or enter the apartment", "ospiti"],
          ["Pets", "welcome up to 25 kg, one per apartment, subject to authorisation and a supplement; always on a lead in common areas, no pool area", "animali"]
        ]},
        { avviso: "Queste regole sono un promemoria indicativo: fa sempre fede il regolamento completo della struttura.",
          avviso_en: "These rules are an indicative reminder: the full house regulations always prevail." }
      ]
    },

    muoversi: {
      titolo: "Come muoversi",
      titolo_en: "Getting around",
      blocchi: [
        { t: "In auto", t_en: "By car", icona: "auto" },
        { p: "Avere un'auto è il modo più comodo per esplorare il Cilento: ti permette di raggiungere liberamente spiagge, borghi e attrazioni naturalistiche. La struttura dispone di parcheggio gratuito.",
          p_en: "A car is the most convenient way to explore Cilento: it lets you freely reach beaches, villages and natural attractions. The residence has free parking." },
        { t: "In treno", t_en: "By train", icona: "treno" },
        { p: "La stazione più vicina è Pisciotta–Palinuro, a breve distanza dalla struttura. Da qui si raggiungono Napoli, Salerno e le altre destinazioni della costa. Su richiesta organizziamo un servizio taxi da e per la stazione.",
          p_en: "The nearest station is Pisciotta–Palinuro, a short distance from the residence. From there you can reach Naples, Salerno and the other coastal destinations. On request we can arrange a taxi to and from the station." },
        { t: "In autobus", t_en: "By bus", icona: "muoversi" },
        { p: "La fermata più comoda è Palinuro Piana (Todis), servita dagli autobus Infante. Chiedi in reception per orari e biglietti.",
          p_en: "The most convenient stop is Palinuro Piana (Todis), served by Infante buses. Ask at reception for timetables and tickets." },
        { t: "A piedi o in bicicletta", t_en: "On foot or by bike", icona: "bici" },
        { p: "Alcune spiagge, ristoranti e negozi si raggiungono comodamente a piedi o in bicicletta: un modo piacevole di scoprire il territorio.",
          p_en: "Some beaches, restaurants and shops are within easy walking or cycling distance: a pleasant way to discover the area." },
        { t: "Taxi e transfer", t_en: "Taxi & transfers", icona: "taxi" },
        { p: "Su richiesta organizziamo taxi e transfer privati per aeroporti, stazioni o spostamenti locali. Consigliamo di prenotare in anticipo.",
          p_en: "On request we can arrange taxis and private transfers to airports, stations or local trips. We recommend booking in advance." }
      ]
    },

    ristoranti: {
      titolo: "Ristoranti",
      titolo_en: "Restaurants",
      mappa: true,
      blocchi: [
        { t: "A Palinuro", t_en: "In Palinuro" },
        { card: { nome: "Ristorante Core a Core", foto: "assets/img/rist-core-a-core.jpg", lat: 40.028099, lng: 15.287849, dove: "Zona Faro — 8 min di macchina",
          testo: "Cucina tradizionale prevalentemente a base di pesce, con materie prime selezionate e un'ampia carta dei vini." } },
        { card: { nome: "Pizzeria Veracemente", foto: "assets/img/rist-veracemente.jpg", lat: 40.032906, lng: 15.287663, dove: "Via Santa Maria — 5 min di macchina",
          testo: "Il posto ideale per un'autentica pizza napoletana, con ingredienti di qualità e impasti leggeri, in un ambiente informale." } },
        { card: { nome: "Agriturismo Isca delle Donne", foto: "assets/img/rist-isca-delle-donne.jpg", lat: 40.039185, lng: 15.297598, dove: "Via Isca delle Donne — 2 min di macchina",
          testo: "Immerso in un'atmosfera bucolica, serve piatti della tradizione cilentana con materie prime proprie." } },
        { t: "A Pisciotta (10–18 min)", t_en: "In Pisciotta (10–18 min)" },
        { card: { nome: "Ristorante 3 Gufi", foto: "assets/img/rist-3-gufi.jpg", dove: "Via Roma — 15 min di macchina",
          testo: "Ottima cucina con piatti innovativi e prodotti di prima qualità." } },
        { card: { nome: "Malabar", foto: "assets/img/rist-malabar.jpg", dove: "Traversa Passariello — 18 min di macchina",
          testo: "Ricette di pesce servite in sala o sulla terrazza vista mare, in un'atmosfera informale." } },
        { card: { nome: "Ristorante Angelina", foto: "assets/img/rist-angelina.jpg", dove: "Piazza Michelangelo Pagano — 15 min di macchina",
          testo: "Nel cuore del centro storico, proposte semplici di buona materia prima, ben eseguite ed economiche." } },
        { t: "A Marina di Camerota (10–18 min)", t_en: "In Marina di Camerota (10–18 min)" },
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
      titolo_en: "Supermarkets & shops",
      mappa: true,
      blocchi: [
        { t: "Supermercati", t_en: "Supermarkets" },
        { card: { nome: "Decò", foto: "assets/img/negozio-deco.jpg", lat: 40.046555, lng: 15.298006, dove: "Palinuro — 1 min a piedi", testo: "" } },
        { card: { nome: "Todis", foto: "assets/img/negozio-todis.jpg", lat: 40.04238, lng: 15.300809, dove: "Palinuro — 1 min di macchina", testo: "" } },
        { card: { nome: "Eté", foto: "assets/img/negozio-ete.jpg", lat: 40.039629, lng: 15.310564, dove: "Palinuro — 3 min di macchina", testo: "" } },
        { card: { nome: "Mensana alimentari", foto: "assets/img/negozio-mensana.jpg", lat: 40.039177, lng: 15.288385, dove: "Palinuro — 3 min di macchina", testo: "" } },
        { t: "Sapori del territorio", t_en: "Local flavours" },
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
      titolo_en: "Frequently asked questions",
      blocchi: [
        { t: "Quanto dista il mare?", t_en: "How far is the sea?", icona: "faq" },
        { p: "Siamo in una posizione strategica: solo 900 metri ci separano dal mare. In pochi minuti raggiungi sia le spiagge sabbiose delle Saline sia quelle ghiaiose dell'Arco Naturale e della Marinella.",
          p_en: "We are in a strategic position: only 900 metres from the sea. In a few minutes you can reach both the sandy Saline beaches and the pebbly ones at the Natural Arch and Marinella." },
        { t: "Avete convenzioni con dei lidi?", t_en: "Do you have agreements with beach clubs?", icona: "faq" },
        { p: "Sì: Villamirella ha convenzioni attive con alcuni lidi della zona, con condizioni vantaggiose per i nostri ospiti. Chiedi in reception.",
          p_en: "Yes: Villamirella has agreements with some local beach clubs, with special conditions for our guests. Ask at reception." },
        { t: "Posso aggiungere la colazione?", t_en: "Can I add breakfast?", icona: "faq" },
        { p: "Sì: in formula residence puoi aggiungere la colazione a buffet, con sconto per i bambini, tra torte fatte in casa e proposte dolci e salate. Se hai prenotato una camera, la colazione è già inclusa.",
          p_en: "Yes: with the residence formula you can add the buffet breakfast, with a discount for children, featuring homemade cakes and sweet and savoury options. If you booked a room, breakfast is already included." },
        { t: "C'è una lavanderia?", t_en: "Is there a laundry?", icona: "faq" },
        { p: "Sì, una lavanderia a gettoni in uso comune.",
          p_en: "Yes, a shared coin-operated laundry." },
        { t: "Posso fare il barbecue?", t_en: "Can I have a barbecue?", icona: "faq" },
        { p: "Nei giardini trovi una zona barbecue attrezzata con griglie, tavoli e sedie in legno. Ricordati di comunicarne l'uso alla direzione.",
          p_en: "In the gardens there is a barbecue area equipped with grills, wooden tables and chairs. Remember to inform the management before using it." },
        { t: "Come funzionano le pulizie?", t_en: "How does cleaning work?", icona: "faq" },
        { p: "Le camere vengono pulite quotidianamente dallo staff. Negli appartamenti la pulizia spetta a te, ma puoi richiedere il servizio giornaliero o una pulizia integrativa.",
          p_en: "Rooms are cleaned daily by our staff. In the apartments cleaning is up to you, but you can request daily service or extra cleaning." },
        { t: "Servizi extra", t_en: "Extra services", icona: "faq" },
        { p: "Colazione a buffet, pulizia integrativa, tour in barca tra grotte e calette, lidi convenzionati: chiedi in reception per aggiungere valore alla tua vacanza.",
          p_en: "Buffet breakfast, extra cleaning, boat tours among caves and coves, partner beach clubs: ask at reception to add value to your holiday." }
      ]
    },

    salute: {
      titolo: "Salute ed emergenze",
      titolo_en: "Health & emergencies",
      mappa: true,
      blocchi: [
        { kv: [
          ["Emergenza sanitaria", "118"],
          ["Numero unico di emergenza", "112"]
        ], kv_en: [
          ["Medical emergency", "118"],
          ["European emergency number", "112"]
        ]},
        { t: "Guardia medica", t_en: "Out-of-hours doctor", icona: "salute" },
        { card: { nome: "Guardia Medica Turistica — Marina di Camerota", lat: 40.000415, lng: 15.374597,
          dove: "Località Porto, uffici all'ingresso della struttura portuale",
          testo: "Assistenza medica di base per cittadini e turisti, tutti i giorni dalle 8:00 alle 20:00. Telefono 0974 939684.",
          testo_en: "Basic medical assistance for residents and tourists, every day from 8 am to 8 pm. Phone 0974 939684." } },
        { t: "Farmacie", t_en: "Pharmacies", icona: "salute" },
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
        { p: "In caso di dubbio su cosa fare, chiama il 118 oppure rivolgiti alla reception: siamo qui per aiutarti.", p_en: "If in doubt about what to do, call 118 or come to reception: we are here to help." }
      ]
    },

    contatti: {
      titolo: "Contatti",
      titolo_en: "Contacts",
      blocchi: [
        { p: "Siamo sempre al tuo fianco. Per assistenza, suggerimenti o consigli per vivere al meglio il Cilento, contattaci in qualsiasi momento — o passa in reception.", p_en: "We are always by your side. For assistance, suggestions or tips to make the most of Cilento, contact us at any time — or drop by reception." },
        { kv: [
          ["Telefono", "0974 938097"],
          ["Cellulare", "379 182 5227"],
          ["Mirella", "347 877 9894"],
          ["Carmelo", "347 877 9616"],
          ["Indirizzo", "Via Isca 2, 84051 Palinuro (SA)"]
        ]},
        { t: "Ti è piaciuto il soggiorno?", t_en: "Did you enjoy your stay?", icona: "esperienze" },
        { p: "Ti saremmo grati se condividessi la tua esperienza lasciando una recensione: chiedi in reception come fare. Grazie per averci scelto!", p_en: "We would be grateful if you shared your experience by leaving a review: ask at reception how. Thank you for choosing us!" }
      ]
    }
  }
};
