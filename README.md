# Chiosco touch — Residence Villamirella

Guida ai luoghi di Palinuro e del Cilento per il monitor touch della reception.
Pagina statica: nessuna installazione, nessun account, nessuna chiave.

**In linea:** https://alphacasrl.github.io/chiosco-villamirella/

---

## Cosa c'è dentro

| file | a cosa serve |
|---|---|
| `index.html` | la pagina |
| `poi.js` | **i contenuti**: luoghi, esperienze, coordinate. È il file da modificare |
| `parco.js` | il confine del Parco Nazionale (poligono) |
| `app.js` | il funzionamento |
| `style.css` | l'aspetto |
| `assets/img/` | le foto, tutte in locale |
| `assets/fonts/` | i caratteri del sito, in locale |
| `diagnostica.html` | pagina di prova dell'hardware, si apre solo se serve |
| `COORDINATE_DA_INSERIRE.md` | da dove viene ogni coordinata |

---

## Pubblicare

### GitHub Pages (è quello in uso)

Il repository è `alphacasrl/chiosco-villamirella`. Ogni modifica caricata sul
ramo `main` va in linea da sola dopo un minuto circa.

```bash
git add -A && git commit -m "aggiorno i contenuti" && git push
```

Per partire da zero su un altro account: crea un repository pubblico, carica
questi file, poi **Settings → Pages → Source: Deploy from a branch → main / (root)**.

### Netlify (alternativa senza git)

Vai su `app.netlify.com/drop` e trascina la cartella. Ottieni subito un
indirizzo. Per aggiornare, ritrascina la cartella.

---

## Impostarlo come pagina iniziale sul monitor LG (webOS)

1. Sul monitor apri il **browser**.
2. Digita l'indirizzo del chiosco e aprilo.
3. Menu del browser (⋮ in alto a destra) → **Impostazioni** → **All'avvio** →
   **Apri una pagina specifica** → incolla l'indirizzo.
4. Sempre nelle impostazioni del monitor, conviene disattivare lo
   **spegnimento automatico** e il salvaschermo, altrimenti il chiosco si
   spegne da solo.

Il browser webOS non ha una modalità chiosco: **la barra dell'indirizzo resta
visibile** e non si può togliere. Tutto il resto del blocco è dentro la pagina:
niente selezione del testo, niente menu contestuale, niente zoom della pagina
col doppio tocco, nessun collegamento che porti fuori. Dopo 90 secondi senza
tocchi la pagina torna da sola alla schermata iniziale.

---

## Aggiungere o modificare un luogo

Apri `poi.js` con un editor di testo. In cima c'è la spiegazione completa, in
italiano, di ogni campo. In breve: copia un blocco che va da `{` a `},`,
incollalo sotto e cambia i valori.

Per le coordinate: su Google Maps, tasto destro sul punto esatto → in cima al
menu compaiono due numeri, per esempio `40.028661, 15.283904`. Il primo è
`lat`, il secondo `lng`.

**Finché `verified` resta `false` il pin non compare sulla mappa.** Non è un
errore: meglio nessun pin che uno sbagliato. La scheda con foto e testo si vede
comunque.

Per cambiare l'ordine delle sezioni della colonna di sinistra, sposta le righe
di `window.SEZIONI`, sempre in cima a `poi.js`.

---

## Cambiare fornitore di mappe

In cima ad `app.js`, dentro `CONFIG.BASI`. Ci sono due voci: `sat` (satellite) e
`osm` (mappa stradale). Il pulsante in alto a destra della mappa passa dall'una
all'altra.

```js
sat: {
  etichetta: 'Satellite',
  tiles: 'https://…/{z}/{y}/{x}',
  attrib: 'Immagini © Esri, Maxar, Earthstar Geographics',
  maxzoom: 19
}
```

Tre cose da sapere prima di cambiarle:

- **L'indirizzo deve essere `https`.** La pagina è servita in https e il
  browser blocca il contenuto misto: un fornitore in `http` darebbe una mappa
  vuota senza spiegazioni.
- **Attenzione all'ordine dei segnaposto.** Esri vuole `{z}/{y}/{x}` (riga
  prima di colonna), quasi tutti gli altri vogliono `{z}/{x}/{y}`.
- **`maxzoom` non è decorativo.** Oltre il proprio massimo Esri restituisce un
  riquadro grigio con scritto "map data not yet available". Sopra Capo Palinuro
  il dato vero finisce intorno al livello 18.

L'attribuzione è obbligatoria: sia Esri sia OpenStreetMap la richiedono, ed è
già mostrata in basso a destra sulla mappa.

Nota su OpenStreetMap: la sua politica d'uso permette un chiosco come questo
(è normale navigazione interattiva), ma avverte che per usi commerciali
**l'accesso può essere sospeso in qualunque momento**. Se un giorno la mappa
stradale smettesse di funzionare, l'alternativa già provata è
`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`
(attribuzione: `© OpenStreetMap contributors, © CARTO`).

---

## Se il chiosco è lento

I numeri qui sotto sono misurati sul monitor vero, non stimati. La GPU è una
ARM Mali-G31 e il collo di bottiglia è il **numero di pixel da disegnare**, non
la quantità di pin: aggiungere luoghi non peggiora nulla.

Interventi in ordine di efficacia, tutti in `CONFIG` in cima ad `app.js`:

1. **`PIXEL_RATIO: 1`** — è già così. Con `1.25` la mappa è più nitida ma
   scende da 60 a 28 fotogrammi. Non impostarlo mai da codice a mappa già
   avviata: su questo driver fa cadere il contesto WebGL e lo schermo diventa
   nero.
2. **`TERRENO_3D: false`** — toglie il rilievo. La mappa resta satellitare e
   piatta. È il secondo guadagno più grande.
3. **`RICHIESTE_PARALLELE`** — abbassalo a 4. Meno richieste insieme significa
   meno tile perse sul Wi-Fi del televisore.
4. Le animazioni pesanti (sfocature, ombre larghe) sono già state evitate
   apposta: non ce ne sono da togliere.

Se invece **mancano pezzi di mappa** o compaiono pareti verticali a strisce sul
rilievo, è quasi sempre la connessione: sono tile che non arrivano. Sotto c'è
sempre una versione a bassa definizione della stessa mappa, così non si vedono
buchi neri.

---

## Provare l'hardware

`diagnostica.html` (stesso indirizzo, con `/diagnostica.html` in fondo) mostra
risoluzione, scheda grafica, fotogrammi al secondo, esito dei collegamenti ai
fornitori di mappe e un banco di prova del touch. Serve se si cambia monitor o
se il chiosco peggiora senza motivo apparente.

---

## Da sapere sui contenuti

Testi e foto vengono da villamirella.it. **Nessuna frase è stata scritta da
altri**: dove il sito non diceva nulla, il campo è rimasto vuoto. Un solo caso
oggi: la Baia del Buon Dormire, che sul sito compare solo in un titolo condiviso
con la Marinella e non ha una descrizione propria.

La distanza mostrata nelle schede è **in linea d'aria**, calcolata dal
residence, ed è etichettata come tale. Per la distanza stradale compila a mano
`distanzaKm` e `tempoAuto` in `poi.js`.

---

© Alphaca Srl — Palinuro (SA), Italy — info@alphaca.eu
Dati di localizzazione © OpenStreetMap contributors (ODbL).
