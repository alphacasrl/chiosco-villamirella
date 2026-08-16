# Marca Villamirella — regole condivise fra le applicazioni

Documento di riferimento per **tutte** le applicazioni del Residence Villamirella.
Va letto prima di toccare l'aspetto di una qualsiasi di esse, e va aggiornato qui
— non nelle singole app — quando una regola cambia.

Applicazioni che lo seguono, al 16 agosto 2026:

| App | Cartella | Schermo | Ruolo |
|---|---|---|---|
| **Chiosco** — guida del territorio | `chiosco_villamirella` | LG 32" **orizzontale**, reception | orientarsi: mappa, luoghi, itinerari, servizi |
| **Meal & Beverage** — honesty bar | `HONESTY BAR` | LG 32" **verticale** | ordinare: menu bar, gastronomia, cena |

---

## 1. Il principio: marca condivisa, interazione libera

Deciso dal titolare il 16/08/2026.

**Si condivide** ciò che dice *di chi è* l'applicazione: logo, colori di marca,
caratteri, tono delle parole, bilinguismo, trattamento del marchio.

**Resta libero** ciò che dipende da *cosa serve fare*: densità, forma dei
riquadri, dimensione dei tocchi, impaginazione. Il chiosco è uno strumento di
orientamento e deve stare tutto in una schermata senza scorrimento; il bar è un
menu, e su un menu l'aria e il calore lavorano a favore. Forzare i due usi nella
stessa forma peggiorerebbe entrambi.

La prova del nove: **un ospite che passa dall'una all'altra deve riconoscere la
stessa struttura, senza pensare che sia la stessa schermata.**

---

## 2. Colori di marca — obbligatori in entrambe

| Ruolo | Valore | Note |
|---|---|---|
| Blu Villamirella | `#235784` | il colore del marchio; titoli, azioni principali |
| Blu scuro | `#1a4263` | stati premuti, contrasti |
| Azzurro velo | `#ddeaf6` | fondi tenui, cerchi delle icone |
| Oro | `#e0a11b` | accento caldo (nato nell'honesty bar, adottato come colore di marca) |
| Rosso | `#dd350f` | solo per errori e chiusure, mai decorativo |
| Verde conferma | `#1e8a4c` | disponibilità, conferme, prenotabile |
| Testo | `#2c3c4a` | corpo |
| Titoli | `#040b11` | intestazioni |

**Colori delle categorie** (chiosco: pin sulla mappa; usabili anche altrove per
lo stesso significato): spiagge `#1a87c9`, borghi `#c96a2b`, grotte `#7057c9`,
natura `#2f9e60`, archeologia `#b5892f`, santuari `#9550a8`, ristoranti
`#d64550`, negozi `#5b7d8c`, salute `#c0392b`, farmacie `#2f9e60`, servizi
`#607d5b`, trasporti `#5b6ec9`.

**Coppie di colori per distinguere due cose** (es. andata e ritorno di una linea):
usare **blu `#1a87c9` e ambra `#d09a1e`**. Mai rosso e verde insieme: sono la
coppia peggiore per chi ha una disfunzione della visione dei colori, che riguarda
circa un uomo su dodici.

Il fondo può essere chiaro (chiosco) o scuro (bar): è una scelta di contesto, non
di marca. Ma i colori qui sopra non si sostituiscono con approssimazioni.

---

## 3. Caratteri

- **Titoli:** Mulish (700 e 900).
- **Testo corrente:** Open Sans (400 e 600).
- I file `.woff2` stanno in `chiosco_villamirella/assets/fonts/` e vanno
  **copiati** nell'altra app, non chiamati da una CDN: le applicazioni devono
  funzionare anche con la linea giù.
- ⚠️ **Difetto noto (16/08/2026):** i quattro file sono in realtà **due**.
  `mulish-700.woff2` e `mulish-900.woff2` sono identici byte per byte, e lo
  stesso vale per `opensans-400.woff2` e `opensans-600.woff2`. Le app dichiarano
  quattro pesi ma ne caricano due: il browser sintetizza il grassetto, che è
  meno bello del peso vero. Va procurato il file mancante di ciascuna coppia —
  finché non è fatto, non dare per scontato che il 900 e il 600 esistano.
- L'honesty bar usa oggi Manrope e Fraunces: vanno sostituiti con Mulish e Open
  Sans. Un corsivo serif per l'accento è ammesso solo se giustificato da un
  bisogno reale, e allora va aggiunto **qui** prima che nell'app.

---

## 4. Logo

- `assets/logo-villamirella.svg` (su fondo chiaro) e
  `assets/logo-villamirella-bianco.svg` (su fondo scuro).
- Non va ridisegnato, ricolorato né stirato. Il monogramma di ripiego con la
  «V» si usa **solo** finché il file vero non è disponibile.

---

## 5. Regole valide ovunque

**Bilinguismo.** Ogni testo visibile all'ospite esiste in italiano e in inglese.
La lingua di partenza è l'italiano, e il ritorno allo stato iniziale la
ripristina. Il selettore di lingua sta **sempre nella stessa posizione** in ogni
schermata dell'app.

**Tono.** Frasi brevi, seconda persona singolare, niente gergo. Si dice quello
che l'ospite deve fare, non quello che il sistema fa.

**Onestà dei dati.** Ciò che è stimato o approssimato si dichiara: sul chiosco i
percorsi ricostruiti sono tratteggiati, gli orari portano l'avviso «indicativi».
Non si presenta come certo ciò che non lo è.

**Tocco.** Ogni bersaglio toccabile è di almeno 44×44 px reali. Il monitor è a
**tocco singolo**: nessuna funzione può dipendere da due dita.

**Niente dipendenze esterne per funzionare.** Caratteri, icone e immagini sono
locali. Le librerie da CDN sono ammesse solo se l'assenza degrada l'esperienza
invece di romperla.

**Fondo dei contenuti.** Fotografie mai sotto i 600×380 px: sotto quella soglia
si sgranano a schermo intero.

---

## 6. Cosa resta libero, e perché

| Aspetto | Chiosco | Honesty bar | Perché diverso |
|---|---|---|---|
| Fondo | bianco | scuro caldo | orientarsi vuole leggibilità piatta; un menu vuole atmosfera |
| Angoli | squadrati (raggio 0) | arrotondati | scelta esplicita del titolare sul chiosco; sul menu l'arrotondato ammorbidisce |
| Densità | massima, nessuno scorrimento | ariosa, colonna stretta | il chiosco si guarda in piedi da lontano, il menu si sfoglia |
| Orientamento | orizzontale | verticale | hardware diverso |

Se una di queste voci cambia, si aggiorna **questa tabella** insieme al codice.

---

## 7. Come si usa in pratica

1. Copiare `marca.css` nella cartella dell'app e includerlo **prima** del foglio
   di stile dell'app.
2. Usare le variabili (`var(--vm-blu)`, `var(--vm-oro)`, …) invece di scrivere i
   colori a mano.
3. Le variabili proprie dell'app si definiscono **dopo**, e possono ridefinire
   fondi e forme — mai i colori di marca.

---

## 8. Registro delle decisioni

- **16/08/2026** — Adottato il principio «marca condivisa, interazione libera»
  (decisione del titolare). L'oro dell'honesty bar entra fra i colori di marca;
  Mulish e Open Sans diventano i caratteri di entrambe le app.
- **13/08/2026** — Sul chiosco i pulsanti sono squadrati, raggio 0 (ordine del
  titolare). Vale per il chiosco, non per il bar.
- **15/08/2026** — Per distinguere due percorsi si usano blu e ambra, non rosso e
  verde, per ragioni di accessibilità.
