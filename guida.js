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
    { id: "archeologia", nome: "Archeologia e musei", nome_en: "Archaeology & museums", icona: "archeologia", colore: "#b5892f", sezione: "cat:archeologia" },
    { id: "santuari",    nome: "Santuari e chiese", nome_en: "Sanctuaries & churches",          icona: "santuari",    colore: "#9550a8", sezione: "cat:santuari" },
    { gruppo: "Negozi e servizi", gruppo_en: "Shops & services", minore: true },
    { id: "ristoranti",  nome: "Ristoranti", nome_en: "Restaurants",        icona: "ristoranti",  colore: "#d64550", sezione: "g:ristoranti" },
    { id: "negozi",      nome: "Negozi", nome_en: "Shops",            icona: "negozi",      colore: "#5b7d8c", sezione: "g:negozi" },
    { id: "servizi",     nome: "Servizi utili", nome_en: "Useful services", icona: "servizi", colore: "#607d5b", sezione: "g:servizi" },
    { id: "salute",      nome: "Salute e farmacie", nome_en: "Health & pharmacies", icona: "salute",      colore: "#c0392b", sezione: "g:salute" },
    { id: "muoversi",    nome: "Come muoversi", nome_en: "Getting around",     icona: "muoversi",    sezione: "g:muoversi" },
    { gruppo: "Il tuo soggiorno", gruppo_en: "Your stay", minore: true },
    { id: "checkin",     nome: "Check-in / out", nome_en: "Check-in / out",    icona: "checkin",     pagina: "checkin" },
    { id: "wifi",        nome: "WiFi", nome_en: "WiFi",              icona: "wifi",        pagina: "wifi" },
    { id: "regole",      nome: "Regole della casa", nome_en: "House rules", icona: "regole",      pagina: "regole" },
    { id: "lavanderia",  nome: "Lavanderia", nome_en: "Laundry",        icona: "lavanderia",  pagina: "lavanderia" },
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
        { img: "assets/wifi-qr.png", didascalia: "Inquadra il codice con la fotocamera del telefono per collegarti subito.", didascalia_en: "Scan the code with your phone camera to connect instantly." }
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
          ["Pulizia", "in formula residence il riassetto quotidiano spetta a te; puoi richiedere pulizie integrative a pagamento", "pulizia"],
          ["Aria condizionata", "non tenere le finestre aperte quando è accesa; spegnila quando esci", "aria"]
        ], kv_en: [
          ["Recycling", "the waste collection point is inside the residence, at the far end of the car park", "riciclo"],
          ["Keys", "before going out, make sure they are not left in the lock on the inside", "checkin"],
          ["Lights", "switch off indoor and terrace lights during the day or when you go out", "luce"],
          ["Fridge", "close the door properly and keep the temperature set to 2", "frigo"],
          ["Cleaning", "with the residence formula, daily tidying is up to you; extra cleaning is available on request, for a fee", "pulizia"],
          ["Air conditioning", "do not keep windows open while it is on; switch it off when you leave", "aria"]
        ]},
        { t: "Nella struttura", t_en: "Around the residence", icona: "regole" },
        { kv: [
          ["Piscina", "aperta dalle 9:00 alle 20:00; sorveglia i bambini; non sono ammessi tuffi", "piscina"],
          ["Parcheggio", "parcheggia nel parcheggio interno occupando un solo posto auto", "auto"],
          ["Ospiti esterni", "ricevili nel giardino davanti alla reception, avvisando la direzione; non possono usare la piscina né accedere all'alloggio", "ospiti"],
          ["Animali", "benvenuti fino a 25 kg, uno per alloggio, previa autorizzazione e con supplemento; sempre al guinzaglio nelle aree comuni, niente zona piscina", "animali"],
          ["Non dare cibo agli animali", "è severamente vietato dare da mangiare agli animali — compreso Spritz, il golden retriever mascotte della struttura: può essere un rischio per la loro salute e attirare animali indesiderati", "animali"],
          ["Droni", "è vietato l'uso di droni (UAV) all'interno della struttura", "drone"]
        ], kv_en: [
          ["Swimming pool", "open from 9 am to 8 pm; keep an eye on children; diving is not allowed", "piscina"],
          ["Parking", "park in the internal car park using one space only", "auto"],
          ["Visitors", "welcome them in the garden in front of reception, informing the management; they may not use the pool or enter the apartment", "ospiti"],
          ["Pets", "welcome up to 25 kg, one per apartment, subject to authorisation and a supplement; always on a lead in common areas, no pool area", "animali"],
          ["Do not feed the animals", "feeding animals is strictly forbidden — including Spritz, our golden retriever mascot: it can harm their health and attract unwanted animals", "animali"],
          ["Drones", "flying drones (UAVs) is not allowed anywhere within the residence", "drone"]
        ]},
        { avviso: "Queste regole sono un promemoria indicativo: fa sempre fede il regolamento completo della struttura.",
          avviso_en: "These rules are an indicative reminder: the full house regulations always prevail." }
      ]
    },

    muoversi: {
      titolo: "Come muoversi",
      titolo_en: "Getting around",
      mappa: true,
      blocchi: [
        { t: "Stazioni ferroviarie", t_en: "Railway stations", icona: "treno" },
        { card: { nome: "Stazione FS Pisciotta-Palinuro", icona: "treno", lat: 40.091413, lng: 15.243738,
          dove: "La stazione di riferimento del residence", dove_en: "The residence's reference station",
          testo: "Da qui si raggiungono Napoli, Salerno e la costa. Collegata a Palinuro dalla linea bus Infante tutti i giorni in estate; su richiesta organizziamo un taxi.",
          testo_en: "Trains to Naples, Salerno and the coast. Linked to Palinuro by the Infante bus line every day in summer; we can arrange a taxi on request." } },
        { card: { nome: "Stazione FS Centola", icona: "treno", lat: 40.091144, lng: 15.345259,
          dove: "San Severino di Centola", dove_en: "San Severino di Centola",
          testo: "Collegata a Palinuro e Marina di Camerota dal bus Infante il sabato e la domenica in estate.",
          testo_en: "Linked to Palinuro and Marina di Camerota by the Infante bus on summer weekends." } },
        { card: { nome: "Stazione FS Vallo della Lucania-Castelnuovo", icona: "treno", lat: 40.229471, lng: 15.158137,
          dove: "Per Intercity e collegamenti principali", dove_en: "For Intercity and main connections",
          testo: "", testo_en: "" } },
        { card: { nome: "Stazione FS Sapri", icona: "treno", lat: 40.077700, lng: 15.628100,
          dove: "Piazza Vittorio Veneto, Sapri — Intercity e Frecce", dove_en: "Piazza Vittorio Veneto, Sapri — Intercity and high-speed trains",
          testo: "", testo_en: "" } },
        { t: "Linee autobus Infante — estate 2026", t_en: "Infante bus lines — summer 2026", icona: "muoversi" },
        { card: { nome: "Bus urbano di Palinuro", icona: "muoversi", foglioOrari: "assets/orari/urbano-palinuro.png",
          fermate: [
            { nome: "Piazza Virgilio", lat: 40.034602, lng: 15.287262 },
            { nome: "Porto di Palinuro", lat: 40.031163, lng: 15.277197 }
          ],
          dove: "Tutti i giorni dall'1 al 31 agosto 2026", dove_en: "Every day, 1–31 August 2026",
          testo: "Anello del paese: Rotatoria ex Club Med, Poste, Ficocella, Piazza Virgilio, Belvedere, Babylon, parcheggio porto, Porto e ritorno. Biglietti su infantebus.it (fino al 30% di sconto rispetto a bordo) — assistenza WhatsApp 388 3095051.",
          testo_en: "Village loop: Ex Club Med roundabout, Post office, Ficocella, Piazza Virgilio, Belvedere, Babylon, harbour car park, Port and back. Tickets on infantebus.it (up to 30% cheaper than on board) — WhatsApp assistance 388 3095051.",
          orari: [
            { t: "Verso il porto", t_en: "Towards the port", righe: [
              ["Rotatoria ex Club Med", "09:15  10:00  11:00  12:00  12:45  15:30  16:30  17:30  18:30"],
              ["Poste", "09:17  10:02  11:02  12:02  12:47  15:32  16:32  17:32  18:32"],
              ["Ficocella", "09:18  10:03  11:03  12:03  12:48  15:33  16:33  17:33  18:33"],
              ["Piazza Virgilio", "09:20  10:05  11:05  12:05  12:50  15:35  16:35  17:35  18:35"],
              ["Belvedere (Core a Core)", "09:25  10:10  11:10  12:10  12:55  15:40  16:40  17:40  18:40"],
              ["Babylon", "09:30  10:15  11:15  12:15  13:00  15:45  16:45  17:45  18:45"],
              ["Parcheggio porto", "09:33  10:18  11:18  12:18  13:03  15:48  16:48  17:48  18:48"],
              ["Porto di Palinuro", "09:35  10:20  11:20  12:20  13:05  15:50  16:50  17:50  18:50"]
            ]},
            { t: "Dal porto", t_en: "From the port", righe: [
              ["Porto di Palinuro", "09:45  10:30  11:30  12:30  13:15  16:00  17:00  18:00  19:00"],
              ["Parcheggio porto", "09:47  10:32  11:32  12:32  13:17  16:02  17:02  18:02  19:02"],
              ["Babylon", "09:49  10:34  11:34  12:34  13:19  16:04  17:04  18:04  19:04"],
              ["Belvedere (Core a Core)", "09:54  10:39  11:39  12:39  13:24  16:09  17:09  18:09  19:09"],
              ["Sopra Chiesa", "09:56  10:41  11:41  12:41  13:26  16:11  17:11  18:11  19:11"],
              ["San Paolo", "09:58  10:43  11:43  12:43  13:28  16:13  17:13  18:13  19:13"],
              ["Rotatoria ex Club Med", "10:00  10:45  11:45  12:45  13:30  16:15  17:15  18:15  19:15"]
            ]}
          ] } },
        { card: { nome: "Linea mare: Stazione FS Pisciotta - Lidi di Palinuro", icona: "muoversi", foglioOrari: "assets/orari/linea-mare.png",
          fermate: [
            { nome: "Stazione FS Pisciotta-Palinuro", lat: 40.091413, lng: 15.243738 },
            { nome: "Lidi delle Saline", lat: 40.062627, lng: 15.278547 }
          ],
          dove: "Sabato e domenica dal 27 giugno al 30 agosto 2026", dove_en: "Saturdays and Sundays, 27 June – 30 August 2026",
          testo: "Collega la stazione ai lidi di Palinuro passando per Caprioli. Biglietti su infantebus.it — WhatsApp 388 3095051.",
          testo_en: "Links the station to Palinuro's beach clubs via Caprioli. Tickets on infantebus.it — WhatsApp 388 3095051.",
          orari: [
            { t: "Verso i lidi", t_en: "Towards the beaches", righe: [
              ["Stazione FS Pisciotta-Palinuro", "08:50  10:00  11:00  12:10  16:00  17:20  17:50  18:20"],
              ["Caprioli - Lido Anireip", "08:55  10:05  11:05  12:15  16:05  17:25  17:55  18:25"],
              ["Lidi Bellavista/La Vela", "08:56  10:06  11:06  12:06  16:06  17:26  17:56  18:26"],
              ["Lidi La Torre/Le Conchiglie", "08:57  10:07  11:07  12:07  16:07  17:27  17:57  18:27"],
              ["Lidi Pepe Rosso/Baia Saracena", "08:58  10:08  11:08  12:08  16:08  17:28  17:58  18:28"],
              ["Lidi Le Saline/Le Dune", "08:59  10:09  11:09  12:09  16:09  17:29  17:59  18:29"],
              ["Lidi Urlamare/Trip on the Beach", "09:00  10:10  11:10  12:10  16:10  17:30  18:00  18:30"],
              ["Lidi Sunset/Baia degli Angeli", "09:01  10:11  11:11  12:11  16:11  17:31  18:01  18:31"],
              ["Lido Mijeo", "09:02  10:12  11:12  12:12  16:12  17:32  18:02  18:32"],
              ["Rotatoria ex Club Med", "09:05  10:15  11:15  12:25  16:15  17:35  18:05  18:35"]
            ]},
            { t: "Verso la stazione", t_en: "Towards the station", righe: [
              ["Rotatoria ex Club Med", "09:05  10:15  11:15  12:25  15:45  17:05  17:35  18:05"],
              ["Lido Mijeo", "09:08  10:18  11:18  12:28  15:48  17:08  17:38  18:08"],
              ["Lidi Sunset/Baia degli Angeli", "09:09  10:19  11:19  12:29  15:49  17:09  17:39  18:09"],
              ["Lidi Urlamare/Trip on the Beach", "09:10  10:20  11:20  12:30  15:50  17:10  17:40  18:10"],
              ["Lidi Le Saline/Le Dune", "09:11  10:21  11:21  12:31  15:51  17:11  17:41  18:11"],
              ["Lidi Pepe Rosso/Baia Saracena", "09:12  10:22  11:22  12:32  15:52  17:12  17:42  18:12"],
              ["Lidi La Torre/Le Conchiglie", "09:13  10:23  11:23  12:33  15:53  17:13  17:43  18:13"],
              ["Lidi Bellavista/La Vela", "09:14  10:24  11:24  12:34  15:54  17:14  17:44  18:14"],
              ["Caprioli - Lido Anireip", "09:15  10:25  11:25  12:35  15:55  17:15  17:45  18:15"],
              ["Stazione FS Pisciotta-Palinuro", "09:20  10:30  11:30  12:40  16:00  17:20  17:50  18:20"]
            ]}
          ] } },
        { card: { nome: "Linea da e per Stazione FS Pisciotta-Palinuro", icona: "muoversi", foglioOrari: "assets/orari/stazione-pisciotta.png",
          fermate: [
            { nome: "Marina di Camerota", lat: 40.000151, lng: 15.373751 },
            { nome: "Palinuro Saline", lat: 40.062627, lng: 15.278547 },
            { nome: "Stazione FS Pisciotta-Palinuro", lat: 40.091413, lng: 15.243738 }
          ],
          dove: "Tutti i giorni dall'8 giugno al 13 settembre 2026", dove_en: "Every day, 8 June – 13 September 2026",
          testo: "Marina di Camerota - Palinuro - Stazione FS. Fermate principali; il dettaglio completo su infantebus.it.",
          testo_en: "Marina di Camerota - Palinuro - Railway station. Main stops; full details on infantebus.it.",
          orari: [
            { t: "Verso la stazione", t_en: "Towards the station", righe: [
              ["M. di Camerota Lungomare", "06:20  07:15  08:40  10:00  11:15  12:20  13:50  15:20  16:40  17:05  18:00  18:30"],
              ["M. di Camerota (Cinema)", "06:25  07:20  08:45  10:05  11:20  12:25  13:55  15:25  16:45  17:10  18:05  18:35  20:55  22:05"],
              ["M. di Camerota Mingardo", "06:35  07:30  08:55  10:15  11:30  12:35  14:05  15:35  16:55  17:20  18:15  18:45  21:05  22:10"],
              ["Palinuro Trivento", "06:40  07:35  09:00  10:20  11:35  12:40  14:10  15:40  17:00  17:25  18:20  18:50  21:10  22:20"],
              ["Palinuro Rotatoria ex Club Med", "06:45  07:40  09:05  10:25  11:40  12:45  14:15  15:45  17:05  17:30  18:25  18:55  21:15  22:25"],
              ["Palinuro Saline", "06:50  07:45  09:10  10:30  11:45  12:50  14:20  15:50  17:10  17:35  18:30  19:00  21:20  22:30"],
              ["Caprioli (Bar 3R - La Grotta)", "06:55  07:50  09:15  10:35  11:50  12:55  14:25  15:55  17:15  17:40  18:35  19:05  21:25  22:35"],
              ["Stazione FS Pisciotta-Palinuro", "07:00  07:55  09:20  10:40  11:55  13:00  14:30  16:00  17:20  17:45  18:40  19:10  21:30  22:40"]
            ]},
            { t: "Dalla stazione", t_en: "From the station", righe: [
              ["Stazione FS Pisciotta-Palinuro", "08:00  08:50  10:00  11:00  12:10  13:25  14:40  16:00  17:20  17:50  19:30  20:20  21:30  23:15"],
              ["Caprioli (Bar 3R - La Grotta)", "08:05  08:55  10:05  11:05  12:15  13:30  14:45  16:05  17:25  17:55  19:35  20:25  21:35  23:20"],
              ["Palinuro Saline", "08:10  09:00  10:10  11:10  12:20  13:35  14:50  16:10  17:30  18:00  19:40  20:30  21:40  23:25"],
              ["Palinuro Rotatoria ex Club Med", "08:15  09:05  10:15  11:15  12:25  13:40  14:55  16:15  17:35  18:05  19:45  20:35  21:45  23:30"],
              ["Palinuro Trivento", "08:20  09:10  10:20  11:20  12:30  13:45  15:00  16:20  17:40  18:10  19:50  20:40  21:50  23:35"],
              ["M. di Camerota Mingardo", "08:25  09:15  10:25  11:25  12:35  13:50  15:05  16:25  17:45  18:15  20:00  20:50  22:00  23:45"],
              ["M. di Camerota (Cinema)", "08:35  09:25  10:35  11:35  12:45  14:00  15:15  16:35  17:55  18:25  20:05  20:55  22:05  23:50"],
              ["M. di Camerota Lungomare", "08:40  09:30  10:40  11:40  12:50  14:05  15:20  16:40  18:00  18:30"]
            ]}
          ] } },
        { card: { nome: "Linea da e per Stazione FS Centola", icona: "muoversi", foglioOrari: "assets/orari/stazione-centola.png",
          fermate: [
            { nome: "Marina di Camerota", lat: 40.000151, lng: 15.373751 },
            { nome: "Stazione FS Centola", lat: 40.091144, lng: 15.345259 }
          ],
          dove: "Solo sabato e domenica dal 13 giugno al 13 settembre 2026", dove_en: "Saturdays and Sundays only, 13 June – 13 September 2026",
          testo: "Marina di Camerota - Palinuro - Stazione FS Centola.",
          testo_en: "Marina di Camerota - Palinuro - Centola railway station.",
          orari: [
            { t: "Verso la stazione", t_en: "Towards the station", righe: [
              ["M. di Camerota Lungomare", "07:05  09:50  12:10  16:10"],
              ["M. di Camerota (Cinema)", "07:10  09:55  12:15  16:15"],
              ["M. di Camerota Mingardo", "07:20  10:05  12:25  16:25"],
              ["Palinuro Trivento", "07:25  10:10  12:30  16:30"],
              ["Palinuro Rotatoria ex Club Med", "07:30  10:15  12:35  16:35"],
              ["Stazione FS Centola", "07:45  10:30  12:50  16:50"]
            ]},
            { t: "Dalla stazione", t_en: "From the station", righe: [
              ["Stazione FS Centola", "08:10  11:00  15:00  17:30"],
              ["Palinuro Rotatoria ex Club Med", "08:25  11:15  15:15  17:45"],
              ["Palinuro Trivento", "08:30  11:20  15:20  17:50"],
              ["M. di Camerota Mingardo", "08:35  11:25  15:25  17:55"],
              ["M. di Camerota (Cinema)", "08:45  11:35  15:35  18:05"],
              ["M. di Camerota Lungomare", "08:50  11:40  15:40  18:10"]
            ]}
          ] } },
        { t: "Altri modi", t_en: "Other ways", icona: "auto" },
        { card: { nome: "In auto", icona: "auto", nome_en: "By car",
          dove: "Parcheggio gratuito al residence", dove_en: "Free parking at the residence",
          testo: "Il modo più comodo per esplorare il Cilento: spiagge, borghi e natura in libertà.",
          testo_en: "The most convenient way to explore Cilento: beaches, villages and nature at your own pace." } },
        { card: { nome: "Taxi e transfer", icona: "taxi", nome_en: "Taxi & transfers",
          dove: "Su richiesta in reception", dove_en: "On request at reception",
          testo: "Organizziamo taxi e transfer privati per stazioni, aeroporti e spostamenti locali: meglio prenotare in anticipo.",
          testo_en: "We arrange taxis and private transfers to stations, airports and local trips: better to book in advance." } },
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
        { card: { nome: "Ristorante Core a Core", fotoSospesa: "assets/img/rist-core-a-core.jpg", lat: 40.028099, lng: 15.287849, dove: "Zona Faro — 8 min di macchina",
          testo: "Cucina tradizionale prevalentemente a base di pesce, con materie prime selezionate e un'ampia carta dei vini." } },
        { card: { nome: "Pizzeria Veracemente", fotoSospesa: "assets/img/rist-veracemente.jpg", lat: 40.032906, lng: 15.287663, dove: "Via Santa Maria — 5 min di macchina",
          testo: "Il posto ideale per un'autentica pizza napoletana, con ingredienti di qualità e impasti leggeri, in un ambiente informale." } },
        { card: { nome: "Agriturismo Isca delle Donne", fotoSospesa: "assets/img/rist-isca-delle-donne.jpg", lat: 40.039185, lng: 15.297598, dove: "Via Isca delle Donne — 2 min di macchina",
          testo: "Immerso in un'atmosfera bucolica, serve piatti della tradizione cilentana con materie prime proprie." } },
        { t: "A Pisciotta (10–18 min)", t_en: "In Pisciotta (10–18 min)" },
        { card: { nome: "Ristorante 3 Gufi", fotoSospesa: "assets/img/rist-3-gufi.jpg", dove: "Via Roma — 15 min di macchina",
          testo: "Ottima cucina con piatti innovativi e prodotti di prima qualità." } },
        { card: { nome: "Malabar", fotoSospesa: "assets/img/rist-malabar.jpg", dove: "Traversa Passariello — 18 min di macchina",
          testo: "Ricette di pesce servite in sala o sulla terrazza vista mare, in un'atmosfera informale." } },
        { card: { nome: "Ristorante Angelina", fotoSospesa: "assets/img/rist-angelina.jpg", dove: "Piazza Michelangelo Pagano — 15 min di macchina",
          testo: "Nel cuore del centro storico, proposte semplici di buona materia prima, ben eseguite ed economiche." } },
        { t: "A Marina di Camerota (10–18 min)", t_en: "In Marina di Camerota (10–18 min)" },
        { card: { nome: "La Cantina del Marchese", fotoSospesa: "assets/img/rist-cantina-marchese.jpg", lat: 40.000694, lng: 15.373441, dove: "Via del Marchese — 10 min di macchina",
          testo: "Piatti e vini del Cilento serviti in una taverna con volte, pietra a vista e arredi di legno." } },
        { card: { nome: "Brera – L'orto del mare", fotoSospesa: "assets/img/rist-brera.jpg", lat: 39.999126, lng: 15.371847, dove: "Via S. Alfonso — 10 min di macchina",
          testo: "Locale curato dove gustare piatti di mare freschissimi e sapori mediterranei rivisitati con creatività." } },
        { card: { nome: "Kon Tiki 2.0", fotoSospesa: "assets/img/rist-kon-tiki.jpg", lat: 40.00164, lng: 15.375975, dove: "Via Variante Castello — 18 min di macchina",
          testo: "Ideale per una buona pizza in un ambiente vivace e informale, a pochi passi dal mare." } }
      ]
    },

    negozi: {
      titolo: "Supermercati e negozi",
      titolo_en: "Supermarkets & shops",
      mappa: true,
      blocchi: [
        { t: "Supermercati", t_en: "Supermarkets" },
        { card: { nome: "Decò", fotoSospesa: "assets/img/negozio-deco.jpg", lat: 40.046555, lng: 15.298006, dove: "Palinuro — 1 min a piedi", testo: "" } },
        { card: { nome: "Todis", fotoSospesa: "assets/img/negozio-todis.jpg", lat: 40.04238, lng: 15.300809, dove: "Palinuro — 1 min di macchina", testo: "" } },
        { card: { nome: "Eté", fotoSospesa: "assets/img/negozio-ete.jpg", lat: 40.039629, lng: 15.310564, dove: "Palinuro — 3 min di macchina", testo: "" } },
        { card: { nome: "Mensana alimentari", fotoSospesa: "assets/img/negozio-mensana.jpg", lat: 40.039177, lng: 15.288385, dove: "Palinuro — 3 min di macchina", testo: "" } },
        { t: "Sapori del territorio", t_en: "Local flavours" },
        { card: { nome: "La Calabrisella", fotoSospesa: "assets/img/negozio-calabrisella.jpg", lat: 40.033126, lng: 15.288192, dove: "Via Santa Maria — 5 min di macchina",
          testo: "Pescheria storica di Palinuro con ottimo pesce fresco e pescato locale." } },
        { card: { nome: "Punto Carni Romano", fotoSospesa: "assets/img/negozio-punto-carni.jpg", lat: 40.043156, lng: 15.300111, dove: "Palinuro — 4 min a piedi o 1 min di auto",
          testo: "Carni selezionate di alta qualità, preparazioni fresche e specialità locali, ideali per le grigliate." } },
        { card: { nome: "Cilenterie", fotoSospesa: "assets/img/negozio-cilenterie.jpg", lat: 40.033592, lng: 15.286972, dove: "Corso Carlo Pisacane — 5 min di macchina",
          testo: "Negozio di specialità del Cilento e articoli da regalo." } }
      ]
    },

    lavanderia: {
      titolo: "Lavanderia",
      titolo_en: "Laundry",
      blocchi: [
        { t: "Come si usa la lavatrice", t_en: "How to use the washing machine", icona: "lavanderia" },
        { p: "I passaggi sono nell'ordine in cui vanno fatti. Il pannello di controllo e\u2019 quello a muro; la lavatrice si accende solo dopo aver inserito le monete.",
          p_en: "The steps are in the order they must be followed. The control panel is the one on the wall; the washing machine only turns on after the coins have been inserted." },
        { kv: [
            ["1. Caricare la lavatrice", "sistema il bucato nel cestello e chiudi l\u2019oblo\u2019", "lavanderia"],
            ["2. Selezionare il servizio 2", "sul pannello di controllo a muro", "luce"],
            ["3. Inserire le monete", "RAPIDO 30: 2 gettoni da 2\u20ac \u00b7 INTENSIVO 60: 3 gettoni da 2\u20ac", "servizi"],
            ["Attenzione", "dopo pochi secondi la luce rossa sul servizio selezionato indica l\u2019inizio dell\u2019erogazione", "luce"],
            ["4. Premere il pulsante di accensione", "sulla lavatrice", "lavanderia"],
            ["5. Selezionare il ciclo desiderato", "con la manopola dei programmi", "lavanderia"],
            ["6. Aggiungere il detersivo", "nel cassetto della lavatrice", "pulizia"],
            ["7. Premere il pulsante di avvio", "il lavaggio comincia", "lavanderia"]
          ],
          kv_en: [
            ["1. Load the washing machine", "put the laundry in the drum and close the door", "lavanderia"],
            ["2. Select service 2", "on the control panel on the wall", "luce"],
            ["3. Insert coins according to the wished cycle", "QUICK 30: 2 coins of \u20ac2 \u00b7 INTENSIVE 60: 3 coins of \u20ac2", "servizi"],
            ["Note", "after a few seconds a red light on the selected service will turn on and service supply will start", "luce"],
            ["4. Push the turn-on button", "on the washing machine", "lavanderia"],
            ["5. Select the wished cycle", "with the programme knob", "lavanderia"],
            ["6. Add soap", "in the washing machine drawer", "pulizia"],
            ["7. Push the starting cycle button", "the wash begins", "lavanderia"]
          ] },
        { avviso: "Per qualsiasi dubbio, o se la lavatrice non parte, rivolgiti alla reception.",
          avviso_en: "If anything is unclear, or if the washing machine does not start, please ask at reception." }
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

    servizi: {
      titolo: "Servizi utili",
      titolo_en: "Useful services",
      mappa: true,
      blocchi: [
        { card: { nome: "IP — Palinuro", icona: "benzina", pin: "benzina", lat: 40.042715, lng: 15.29071, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~750 m in linea d'aria", testo_en: "~750 m as the crow flies" } },
        { card: { nome: "Tabacchi alla rotatoria di Palinuro (presso IP)", icona: "tabacchi", pin: "tabacchi", lat: 40.042715, lng: 15.29071, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~750 m in linea d'aria", testo_en: "~750 m as the crow flies" } },
        { card: { nome: "Edicola alla rotatoria di Palinuro", icona: "edicola", pin: "edicola", lat: 40.042715, lng: 15.29071, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~750 m in linea d'aria", testo_en: "~750 m as the crow flies" } },
        { card: { nome: "IP — Palinuro", icona: "benzina", pin: "benzina", lat: 40.044234, lng: 15.287993, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~850 m in linea d'aria", testo_en: "~850 m as the crow flies" } },
        { card: { nome: "Banca della Campania", icona: "banca", pin: "banca", lat: 40.038811, lng: 15.28923, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~1.1 km in linea d'aria", testo_en: "~1.1 km as the crow flies" } },
        { card: { nome: "Ufficio postale — Palinuro", icona: "posta", pin: "posta", lat: 40.038275, lng: 15.287669, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~1.3 km in linea d'aria", testo_en: "~1.3 km as the crow flies" } },
        { card: { nome: "IP — Palinuro", icona: "benzina", pin: "benzina", lat: 40.039248, lng: 15.31085, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~1.4 km in linea d'aria", testo_en: "~1.4 km as the crow flies" } },
        { card: { nome: "Tabacchi al benzinaio IP di Trivento", icona: "tabacchi", pin: "tabacchi", lat: 40.039262, lng: 15.311003, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~1.4 km in linea d'aria", testo_en: "~1.4 km as the crow flies" } },
        { card: { nome: "Bancomat — Palinuro", icona: "banca", pin: "banca", lat: 40.039275, lng: 15.311026, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~1.4 km in linea d'aria", testo_en: "~1.4 km as the crow flies" } },
        { card: { nome: "Esso — Palinuro", icona: "benzina", pin: "benzina", lat: 40.036723, lng: 15.286484, dove: "Palinuro", dove_en: "Palinuro", testo: "a ~1.5 km in linea d'aria", testo_en: "~1.5 km as the crow flies" } },
        { card: { nome: "Intesa Sanpaolo", icona: "banca", pin: "banca", lat: 40.033127, lng: 15.28691, dove: "Palinuro · Corso Carlo Pisacane 23", dove_en: "Palinuro · Corso Carlo Pisacane 23", testo: "a ~1.8 km in linea d'aria", testo_en: "~1.8 km as the crow flies" } },
        { card: { nome: "Ufficio postale — Centola", icona: "posta", pin: "posta", lat: 40.065239, lng: 15.312416, dove: "Centola", dove_en: "Centola", testo: "a ~2.4 km in linea d'aria", testo_en: "~2.4 km as the crow flies" } },
        { card: { nome: "Poste Italiane", icona: "posta", pin: "posta", lat: 40.089877, lng: 15.282128, dove: "Caprioli · SR447/b", dove_en: "Caprioli · SR447/b", testo: "a ~4.9 km in linea d'aria", testo_en: "~4.9 km as the crow flies" } },
        { card: { nome: "Benzinaio — San Severino", icona: "benzina", pin: "benzina", lat: 40.092156, lng: 15.324063, dove: "San Severino", dove_en: "San Severino", testo: "a ~5.5 km in linea d'aria", testo_en: "~5.5 km as the crow flies" } },
        { card: { nome: "Bancomat — Marina di Camerota", icona: "banca", pin: "banca", lat: 40.002431, lng: 15.361251, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~7.4 km in linea d'aria", testo_en: "~7.4 km as the crow flies" } },
        { card: { nome: "Q8 — San Severino", icona: "benzina", pin: "benzina", lat: 40.094303, lng: 15.358814, dove: "San Severino · Strada Provinciale 17bis Valle Mingardo", dove_en: "San Severino · Strada Provinciale 17bis Valle Mingardo", testo: "a ~7.4 km in linea d'aria", testo_en: "~7.4 km as the crow flies" } },
        { card: { nome: "Q8 — Marina di Camerota", icona: "benzina", pin: "benzina", lat: 40.002815, lng: 15.364698, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~7.5 km in linea d'aria", testo_en: "~7.5 km as the crow flies" } },
        { card: { nome: "Intesa Sanpaolo", icona: "banca", pin: "banca", lat: 40.00037, lng: 15.371071, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.1 km in linea d'aria", testo_en: "~8.1 km as the crow flies" } },
        { card: { nome: "Tabacchi — Marina di Camerota", icona: "tabacchi", pin: "tabacchi", lat: 40.000354, lng: 15.373036, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.3 km in linea d'aria", testo_en: "~8.3 km as the crow flies" } },
        { card: { nome: "Edicola — Marina di Camerota", icona: "edicola", pin: "edicola", lat: 39.998195, lng: 15.371056, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.3 km in linea d'aria", testo_en: "~8.3 km as the crow flies" } },
        { card: { nome: "Banca del Cilento e Luceania Sud", icona: "banca", pin: "banca", lat: 40.000096, lng: 15.373219, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.3 km in linea d'aria", testo_en: "~8.3 km as the crow flies" } },
        { card: { nome: "Tabacchi — Marina di Camerota", icona: "tabacchi", pin: "tabacchi", lat: 39.99799, lng: 15.371414, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.3 km in linea d'aria", testo_en: "~8.3 km as the crow flies" } },
        { card: { nome: "Carburanti Magliano — Marina di Camerota", icona: "benzina", pin: "benzina", lat: 40.000104, lng: 15.373979, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.3 km in linea d'aria", testo_en: "~8.3 km as the crow flies" } },
        { card: { nome: "Marina di Camerota", icona: "posta", pin: "posta", lat: 40.000843, lng: 15.374869, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.4 km in linea d'aria", testo_en: "~8.4 km as the crow flies" } },
        { card: { nome: "Intesa Sanpaolo", icona: "banca", pin: "banca", lat: 40.001331, lng: 15.376514, dove: "Marina di Camerota", dove_en: "Marina di Camerota", testo: "a ~8.4 km in linea d'aria", testo_en: "~8.4 km as the crow flies" } },
        { card: { nome: "Poste Italiane", icona: "posta", pin: "posta", lat: 40.102007, lng: 15.22819, dove: "Pisciotta · Via Cristoforo Colombo 2", dove_en: "Pisciotta · Via Cristoforo Colombo 2", testo: "a ~8.5 km in linea d'aria", testo_en: "~8.5 km as the crow flies" } },
        { card: { nome: "Bancomat — Pisciotta", icona: "banca", pin: "banca", lat: 40.1092, lng: 15.235012, dove: "Pisciotta", dove_en: "Pisciotta", testo: "a ~8.7 km in linea d'aria", testo_en: "~8.7 km as the crow flies" } },
        { card: { nome: "Poste Italiane", icona: "posta", pin: "posta", lat: 40.110556, lng: 15.233446, dove: "Pisciotta", dove_en: "Pisciotta", testo: "a ~8.9 km in linea d'aria", testo_en: "~8.9 km as the crow flies" } },
        { card: { nome: "Bancomat — Pisciotta", icona: "banca", pin: "banca", lat: 40.110543, lng: 15.233397, dove: "Pisciotta", dove_en: "Pisciotta", testo: "a ~8.9 km in linea d'aria", testo_en: "~8.9 km as the crow flies" } },
        { card: { nome: "Ufficio postale Poderia", icona: "posta", pin: "posta", lat: 40.094781, lng: 15.38559, dove: "Poderia", dove_en: "Poderia", testo: "a ~9.2 km in linea d'aria", testo_en: "~9.2 km as the crow flies" } },
        { p: "Elenco ordinato per distanza dal residence. Dati da OpenStreetMap: in caso di dubbio chiedi in reception.",
          p_en: "Sorted by distance from the residence. Data from OpenStreetMap: ask at reception if in doubt." }
      ]
    },

    salute: {
      titolo: "Salute ed emergenze",
      titolo_en: "Health & emergencies",
      mappa: true,
      blocchi: [
        { kv: [
          ["Numero unico di emergenza", "112"]
        ], kv_en: [
          ["Single European emergency number", "112"]
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
        { p: "In caso di dubbio su cosa fare, chiama il 112 oppure rivolgiti alla reception: siamo qui per aiutarti.", p_en: "If in doubt about what to do, call 112 or come to reception: we are here to help." }
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
