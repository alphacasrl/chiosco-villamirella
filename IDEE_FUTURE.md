# Idee da realizzare più avanti

Appunti presi il **13 agosto 2026**, dopo averle ragionate insieme. Non sono
ancora state programmate: qui restano le decisioni già prese, così quando le
riprenderemo non si ricomincia da capo.

---

## 1. Libro degli ospiti — la dedica — **ACCANTONATA il 13/08/2026**

> **Perché è stata esclusa (decisione del titolare):** una superficie su cui
> disegnare è un invito a premere forte e a insistere, e i bambini lasciati soli
> davanti allo schermo lo tratterebbero come un giocattolo — con il rischio
> concreto di **danneggiare il pannello**. Il pericolo non sta nel software ma
> nel gesto stesso che la funzione incoraggia, quindi non è mitigabile con
> accorgimenti di programmazione.
>
> **Se un domani la si volesse riprendere**, la variante che toglie l'obiezione è
> la **dedica scritta con la tastiera a schermo, senza disegno**: si tocca, non
> si preme né si trascina, esattamente come tutto il resto del chiosco. Si perde
> lo scarabocchio a mano libera, si tiene il messaggio. Tutto quello che segue
> resta valido, tranne la parte sul tratto del dito.

Gli ospiti scrivono o disegnano col dito sullo schermo e lasciano il loro segno.

**Perché ha senso:** i messaggi approvati entrano nello **slideshow di attesa**,
mescolati alle foto. Così chi lascia la dedica sa che la vedranno davvero tutti
per giorni, e il libro non resta una pagina che nessuno apre. È questo aggancio
che rende la funzione viva.

**Regola non negoziabile:** niente diventa visibile finché non è stato
approvato. Uno schermo touch incustodito per una stagione intera raccoglie prima
o poi qualcosa di sconveniente. La moderazione non è un'opzione da aggiungere
dopo.

### Come si salva

- **Si registrano i tratti (le coordinate del dito), non le immagini.** Un
  disegno pesa 2–5 KB invece di 50–150 KB: trenta volte meno. Si ridisegna
  nitido a qualsiasi dimensione, si può stampare, e volendo si può far
  riapparire animato mentre si scrive da solo — bell'effetto sullo standby, a
  costo zero.
- **Mai file SVG o immagini caricati dall'esterno.** Chi scoprisse la chiave del
  modulo di invio potrebbe spedire alla casella un messaggio che sembra venire
  dal chiosco: se fosse un SVG conterrebbe codice eseguibile. Con le sole
  coordinate, il peggio che può arrivare è uno scarabocchio brutto.
- Sul chiosco si usa **IndexedDB**, non il `localStorage` del contatore d'uso.
  Serve anche come coda: se la linea è giù il messaggio resta lì e riparte da
  solo, così il "grazie, inviato" mostrato all'ospite è sempre vero.

### Il flusso di approvazione (scelto il 13/08/2026)

1. Il chiosco manda il messaggio a una **casella di posta dedicata**. La mail
   contiene due cose: l'**anteprima come immagine**, per decidere in due secondi
   dal telefono, e l'**allegato in coordinate già pronto**, da caricare senza
   rinominarlo né convertirlo.
2. Verifica manuale.
3. Il file si **carica nella cartella su GitHub**.
4. Un'**automazione di GitHub rigenera l'indice** — questo pezzo è
   indispensabile: un sito statico non sa elencare il contenuto di una cartella,
   quindi senza indice il chiosco non saprebbe mai che il file esiste. Aggiornare
   l'indice a mano è escluso: una virgola sbagliata nel JSON e il libro non
   carica più.
5. Pages ricostruisce, il chiosco **rilegge l'elenco quando entra in attesa**.
   Attenzione alla cache, che su quel monitor è aggressiva.

Il servizio di invio va scelto tra quelli la cui chiave **sa solo spedire verso
la casella** e nient'altro: la chiave sta dentro la pagina, che è pubblica.

### Dettagli d'uso

- Formato consigliato per partire: **firma breve** (nome, città, due parole, uno
  scarabocchio), non una tela libera. Si riempie di più e si modera in un colpo
  d'occhio.
- Invitare a lasciare **solo nome e città**, e scrivere chiaramente di non
  lasciare recapiti: altrimenti in vetrina finiscono cognomi, date di soggiorno e
  numeri di telefono di persone reali.
- Lo schermo è **single-touch**: se l'ospite appoggia il palmo, il monitor segue
  il palmo e non il dito. Area di disegno larga e in alto, con l'invito a
  scrivere col solo dito. Non c'è la pressione, quindi lo spessore del tratto si
  fa variare con la velocità: sembra molto più naturale.
- **Stampa di fine stagione**: un PDF impaginato con tutte le dediche approvate e
  le date. È il libro degli ospiti vero, di carta, che resta anche quando il
  monitor non ci sarà più.

### Da decidere prima di partire

- Approva **solo il titolare** o anche la reception? Nel secondo caso serve un
  account GitHub con accesso in scrittura al repository.
- Firma breve o spazio di disegno più ampio.

---

## 2. Photo booth — lo scatto ricordo

Fotografia con cornice Villamirella che l'ospite **si porta via**.

**Da verificare per primo, costa poco e può chiudere il discorso:** la webOS
lascia accedere alla fotocamera da una pagina web? Il browser di quel monitor è
molto limitato e l'accesso alla telecamera dal contenuto web spesso non c'è del
tutto, a prescindere da quale webcam sia collegata. Anche se ci fosse, va
verificato che non chieda il permesso a ogni sessione, cosa ingestibile su un
chiosco. Se lo schermo dice di no, il tema si chiude senza aver speso niente.

### La versione scelta: scatta, guarda, porta via, cancella

Scatto con cornice, l'ospite la guarda, e se gli piace **se la porta via** — un
codice da inquadrare col telefono e la foto è sua. Poi lo schermo la **cancella**.

Il motivo è che così non si conserva niente, e non conservare niente elimina in
un colpo solo la moderazione, l'archivio, le richieste di rimozione e quasi tutto
il carico normativo. In più quella foto con la cornice finisce sui social
dell'ospite, che per la struttura è promozione.

### Perché NON deve finire nel repository

Le fotografie di persone **non possono passare dal flusso delle dediche**. Il
repository è pubblico: le foto sarebbero accessibili a chiunque, indicizzabili, e
soprattutto **resterebbero nella cronologia di Git anche dopo la cancellazione**.
Se un ospite chiede la rimozione mesi dopo, il file si toglie dalla cartella ma
resta recuperabile nello storico.

C'è una simmetria da tenere a mente: per le **dediche** si vuole conservare il
più possibile, l'archivio è un valore; per le **foto** si vuole conservare il
meno possibile, ogni giorno in più è solo rischio. Requisiti opposti, quindi
architetture opposte.

### Se un domani si volesse comunque il muro delle foto esposte

Solo sul monitor, mai nel repository; scadenza automatica breve (finita la
settimana spariscono); reception che può togliere qualsiasi scatto in due tocchi.

### Punti delicati, da verificare con chi segue la privacy

Il consenso raccolto con un tocco ben presentato è praticabile. I nodi veri sono
altri: i **minori** (lo schermo non sa se chi tocca "accetto" è un genitore), le
**persone sullo sfondo** in un luogo di passaggio come la reception, e la
**cancellazione su richiesta**, che presuppone di sapere quale foto è di chi — e
quindi di raccogliere proprio il dato in più che non si vorrebbe. Una dedica
firmata "Marco, Bologna" non pone nessuno di questi problemi; una faccia sì.

---

## Stato al 13 agosto 2026

Il libro degli ospiti è **accantonato** per il rischio al pannello (vedi sopra).
Resta in piedi il **photo booth**, che non pone lo stesso problema: si tocca un
pulsante per scattare, non c'è nessuna superficie da grattare o su cui premere.

Il primo passo, quando lo si riprenderà, è la **verifica della fotocamera sulla
webOS**: finché non è accertata, tutto il resto è ipotesi.

L'osservazione che valeva per l'ordine dei lavori resta comunque utile in
generale: prima si guarda se gli ospiti si prestano davvero a queste cose — il
contatore d'uso già installato può dare un'idea di quanto il chiosco venga
toccato — e poi si prendono impegni che comportano obblighi, come tutto ciò che
riguarda le immagini delle persone.
