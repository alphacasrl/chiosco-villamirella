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

  /* le mattonelle della schermata iniziale, nell'ordine in cui compaiono */
  MATTONELLE: [
    { id: "posti",       nome: "Posti da visitare",    icona: "posti",      sezione: "cat:borghi" },
    { id: "spiagge",     nome: "Spiagge",              icona: "spiagge",    sezione: "cat:spiagge" },
    { id: "mare",        nome: "Il mare di Palinuro",  icona: "barca",      sezione: "mare" },
    { id: "itinerari",   nome: "Itinerari",            icona: "sentiero",   sezione: "itinerari" },
    { id: "ristoranti",  nome: "Ristoranti",           icona: "ristorante", pagina: "ristoranti" },
    { id: "negozi",      nome: "Supermercati e negozi", icona: "negozio",   pagina: "negozi" },
    { id: "muoversi",    nome: "Come muoversi",        icona: "bus",        pagina: "muoversi" },
    { id: "checkin",     nome: "Check-in e check-out", icona: "chiave",     pagina: "checkin" },
    { id: "regole",      nome: "Regole della casa",    icona: "regole",     pagina: "regole" },
    { id: "wifi",        nome: "WiFi",                 icona: "wifi",       pagina: "wifi" },
    { id: "faq",         nome: "Domande frequenti",    icona: "faq",        pagina: "faq" },
    { id: "contatti",    nome: "Contatti",             icona: "telefono",   pagina: "contatti" }
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
      blocchi: [
        { t: "A Palinuro" },
        { card: { nome: "Ristorante Core a Core", dove: "Zona Faro — 8 min di macchina",
          testo: "Cucina tradizionale prevalentemente a base di pesce, con materie prime selezionate e un'ampia carta dei vini." } },
        { card: { nome: "Pizzeria Veracemente", dove: "Via Santa Maria — 5 min di macchina",
          testo: "Il posto ideale per un'autentica pizza napoletana, con ingredienti di qualità e impasti leggeri, in un ambiente informale." } },
        { card: { nome: "Agriturismo Isca delle Donne", dove: "Via Isca delle Donne — 2 min di macchina",
          testo: "Immerso in un'atmosfera bucolica, serve piatti della tradizione cilentana con materie prime proprie." } },
        { t: "A Pisciotta (10–18 min)" },
        { card: { nome: "Ristorante 3 Gufi", dove: "Via Roma — 15 min di macchina",
          testo: "Ottima cucina con piatti innovativi e prodotti di prima qualità." } },
        { card: { nome: "Malabar", dove: "Traversa Passariello — 18 min di macchina",
          testo: "Ricette di pesce servite in sala o sulla terrazza vista mare, in un'atmosfera informale." } },
        { card: { nome: "Ristorante Angelina", dove: "Piazza Michelangelo Pagano — 15 min di macchina",
          testo: "Nel cuore del centro storico, proposte semplici di buona materia prima, ben eseguite ed economiche." } },
        { t: "A Marina di Camerota (10–18 min)" },
        { card: { nome: "La Cantina del Marchese", dove: "Via del Marchese — 10 min di macchina",
          testo: "Piatti e vini del Cilento serviti in una taverna con volte, pietra a vista e arredi di legno." } },
        { card: { nome: "Brera – L'orto del mare", dove: "Via S. Alfonso — 10 min di macchina",
          testo: "Locale curato dove gustare piatti di mare freschissimi e sapori mediterranei rivisitati con creatività." } },
        { card: { nome: "Kon Tiki 2.0", dove: "Via Variante Castello — 18 min di macchina",
          testo: "Ideale per una buona pizza in un ambiente vivace e informale, a pochi passi dal mare." } }
      ]
    },

    negozi: {
      titolo: "Supermercati e negozi",
      blocchi: [
        { t: "Supermercati" },
        { card: { nome: "Decò", dove: "Palinuro — 1 min a piedi", testo: "" } },
        { card: { nome: "Todis", dove: "Palinuro — 1 min di macchina", testo: "" } },
        { card: { nome: "Eté", dove: "Palinuro — 3 min di macchina", testo: "" } },
        { card: { nome: "Mensana alimentari", dove: "Palinuro — 3 min di macchina", testo: "" } },
        { t: "Sapori del territorio" },
        { card: { nome: "La Calabrisella", dove: "Via Santa Maria — 5 min di macchina",
          testo: "Pescheria storica di Palinuro con ottimo pesce fresco e pescato locale." } },
        { card: { nome: "Punto Carni Romano", dove: "Via Acqua del Lauro — 2 min di macchina",
          testo: "Carni selezionate di alta qualità, preparazioni fresche e specialità locali, ideali per le grigliate." } },
        { card: { nome: "Cilenterie", dove: "Corso Carlo Pisacane — 5 min di macchina",
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

    contatti: {
      titolo: "Contatti",
      blocchi: [
        { p: "Siamo sempre al tuo fianco. Per assistenza, suggerimenti o consigli per vivere al meglio il Cilento, contattaci in qualsiasi momento — o passa in reception." },
        { kv: [
          ["Telefono", "0974 938097"],
          ["Cellulare", "347 877 9894"],
          ["Cellulare", "379 182 5227"],
          ["Cellulare", "347 877 9616"],
          ["Indirizzo", "Via Isca 2, 84051 Palinuro (SA)"]
        ]},
        { t: "Ti è piaciuto il soggiorno?" },
        { p: "Ti saremmo grati se condividessi la tua esperienza lasciando una recensione: chiedi in reception come fare. Grazie per averci scelto!" }
      ]
    }
  }
};
