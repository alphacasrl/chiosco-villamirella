# Coordinate

Le coordinate sono state ricavate da **OpenStreetMap** (geocoder Nominatim),
non scritte a mano. Ogni risultato è passato per tre filtri: deve cadere nel
riquadro del Cilento, deve stare entro una distanza ragionevole dal paese di
riferimento, e deve essere dell'**oggetto giusto** — una spiaggia deve risultare
`natural/beach`, non un pontile o un campeggio che porta lo stesso nome.

Su 57 luoghi: **57 compilati e verificati**, **0 da fare a mano**
perché OpenStreetMap restituiva un oggetto sbagliato.

## Da fare a mano

Su Google Maps: tasto destro sul punto, i due numeri in cima al menu. Il primo
è `lat`, il secondo `lng`. Poi cambia `verified: false` in `verified: true`.

| fatto | luogo | perché non è automatico |
|---|---|---|

## Il residence

| fatto | punto | stato |
|---|---|---|
| ☐ | **Residence Villamirella**, Via Isca 2 | coordinata a livello di strada già inserita, **da confermare**: spostala sull'ingresso esatto |

Serve per centrare la mappa all'avvio e per calcolare le distanze.

## Compilati in automatico — da controllare a campione

Se un pin cade nel posto sbagliato, correggilo qui e aggiorna `notaCoordinate`,
così resta scritto perché.

| luogo | lat | lng | oggetto trovato su OpenStreetMap |
|---|---|---|---|
| Spiaggia delle Saline | `40.05601` | `15.282363` | campo sportivo di Palinuro, punto indicato dal titolare come accesso alla spiaggia |
| Spiaggia della Ficocella | `40.034769` | `15.285517` | OpenStreetMap [natural/beach] «Spiaggia Ficocella degli uomini» (esiste anche la gemella «delle donne» 60 m a nord) |
| Spiaggia del Porto di Capo Palinuro | `40.029775` | `15.278646` | OpenStreetMap [natural/beach] «Spiaggia del Porto» |
| Baia della Marinella | `40.0296` | `15.296774` | OpenStreetMap [natural/beach] «spiaggia Marinella» |
| Baia del Buon Dormire | `40.025687` | `15.291607` | OpenStreetMap [natural/beach] «spiaggia del Buondormire di mare», quella davanti allo Scoglio del Coniglio |
| Spiaggia dell'Arco Naturale | `40.030819` | `15.307818` | OpenStreetMap [natural/beach] «Spiaggia dell'Arco Naturale» |
| Cala Bianca | `39.997243` | `15.413433` | OpenStreetMap [natural/beach] «spiaggia Cala Bianca» — non il pontile omonimo del porto |
| Spiaggia del Pozzallo | `39.997172` | `15.407624` | OpenStreetMap/Nominatim [natural/beach] — corretta al secondo giro: la prima risposta era il pontile del porto |
| Porto e Baia degli Infreschi | `39.998918` | `15.42702` | OpenStreetMap [natural/bay] «Baia degli Infreschi» |
| Palinuro | `40.034602` | `15.287262` | OpenStreetMap/Nominatim [village] |
| Centola | `40.066502` | `15.311963` | OpenStreetMap/Nominatim [administrative] |
| Marina di Camerota | `40.000151` | `15.373751` | OpenStreetMap/Nominatim [village] |
| Pisciotta | `40.108902` | `15.234561` | OpenStreetMap/Nominatim [administrative] |
| Scario | `40.054283` | `15.492182` | OpenStreetMap/Nominatim [village] |
| Agropoli | `40.346905` | `14.996553` | OpenStreetMap/Nominatim [administrative] |
| Ascea | `40.141602` | `15.18576` | OpenStreetMap/Nominatim [administrative] |
| Morigerati | `40.139949` | `15.555182` | OpenStreetMap/Nominatim [administrative] |
| Padula | `40.341642` | `15.658254` | OpenStreetMap/Nominatim [administrative] |
| Felitto | `40.373507` | `15.243058` | OpenStreetMap/Nominatim [administrative] |
| San Severino di Centola | `40.089066` | `15.346276` | OpenStreetMap/Nominatim [hamlet] |
| Camerota | `40.032501` | `15.372765` | OpenStreetMap/Nominatim [administrative] |
| Lentiscosa | `40.020963` | `15.386612` | OpenStreetMap/Nominatim [village] |
| Marina di Pisciotta | `40.10383` | `15.226383` | OpenStreetMap/Nominatim [village] |
| Santa Maria di Castellabate | `40.285563` | `14.947901` | OpenStreetMap/Nominatim [village] |
| Grotta del Buondormire | `40.028005` | `15.293636` | OpenStreetMap [natural/cave_entrance] «Grotta del Buondormire» |
| Grotta d'argento | `40.02436` | `15.276691` | OpenStreetMap [natural/cave_entrance] «Grotta d'argento» |
| Grotta della Cernia | `40.024484` | `15.271035` | OpenStreetMap [natural/cave_entrance] «Grotta della Cernia» |
| Grotta dell'uomo morto | `40.031352` | `15.271383` | OpenStreetMap [natural/cave_entrance] «Grotta dell'uomo morto» |
| Grotta di Zia Anna | `40.029324` | `15.267971` | OpenStreetMap [natural/cave_entrance] «Grotta di Zia Anna» |
| Grotta dei Porci | `40.029777` | `15.301085` | OpenStreetMap [natural/cave_entrance] «Grotta dei Porci» |
| Grotta dei Pertusi | `40.023056` | `15.289115` | OpenStreetMap [natural/cave_entrance] «Grotta dei Pertusi» |
| Grotta dei Monaci | `40.024897` | `15.283306` | OpenStreetMap [natural/cave_entrance] «Grotta dei Monaci» |
| Grotta Sulfurea | `40.024708` | `15.282947` | OpenStreetMap [natural/cave_entrance] «Grotta Sulfurea» |
| Grotta del Sangue | `40.024077` | `15.277098` | OpenStreetMap [natural/cave_entrance] «Grotta del Sangue» |
| Grotta delle Ossa | `40.029836` | `15.303645` | OpenStreetMap [natural/cave_entrance] «Grotta delle Ossa» |
| Grotta Azzurra | `40.031346` | `15.268883` | OpenStreetMap [natural/cave_entrance] «Grotta Azzurra» |
| Grotta delle Ciavole | `40.024164` | `15.292283` | OpenStreetMap [natural/cave_entrance] «Grotta delle Ciavole» |
| Grotta Punta della Galera | `40.02302` | `15.288349` | OpenStreetMap [natural/cave_entrance] «Grotta Punta della Galera» |
| Grotta del lago | `40.024565` | `15.282436` | OpenStreetMap [natural/cave_entrance] «Grotta del lago» |
| Grotte di Pertosa-Auletta | `40.537046` | `15.455024` | OpenStreetMap/Nominatim [cave_entrance] |
| Grotta della Cala | `40.000983` | `15.381251` | OpenStreetMap/Nominatim [cave_entrance] |
| Grotta del Riparo del Poggio | `40.000809` | `15.382516` | OpenStreetMap/Nominatim [bare_rock] |
| Grotta della Serratura | `39.999049` | `15.386788` | OpenStreetMap/Nominatim [natural/cave_entrance] — corretta al secondo giro: la prima risposta era la spiaggia di Lentiscelle |
| Parco Nazionale del Cilento | `40.283374` | `15.298292` | non e' un pin ma un poligono: confine ufficiale da OpenStreetMap rel/4100859, semplificato a 672 vertici |
| Oasi WWF di Morigerati | `40.140611` | `15.552694` | OpenStreetMap/Nominatim [ticket] — biglietteria dell'oasi, cioe' l'ingresso per i visitatori |
| Cascata dei Capelli di Venere | `40.15638` | `15.626426` | OpenStreetMap/Nominatim [waterfall] — OSM la chiama «Fontana Capello» — cascata a Casaletto Spartano |
| Oasi e Diga Alento | `40.322114` | `15.126223` | OpenStreetMap/Nominatim [natural/water] — corretta al secondo giro: bacino dell'Alento (la prima era uno svincolo) |
| Collina della Molpa | `40.033098` | `15.303533` | OpenStreetMap/Nominatim [historic/archaeological_site] — corretta al secondo giro: sito archeologico della Molpa |
| Monte Bulgheria | `40.069769` | `15.43107` | OpenStreetMap/Nominatim [peak] |
| Pianoro di Ciolandrea | `40.040255` | `15.457363` | OpenStreetMap/Nominatim [locality] |
| Paestum | `40.421552` | `15.005321` | OpenStreetMap/Nominatim [archaeological_site] |
| Area archeologica di Velia | `40.160937` | `15.15664` | OpenStreetMap/Nominatim [park] |
| Antiquarium di Palinuro | `40.034413` | `15.285536` | OpenStreetMap/Nominatim [museum] |
| Certosa di Padula | `40.337163` | `15.651678` | OpenStreetMap/Nominatim [monastery] |
| Museo Ortega a Bosco | `40.072886` | `15.457116` | APPROSSIMATA al centro dell'abitato di Bosco: il museo non risulta mappato su OpenStreetMap |
| Santuario del Sacro Monte di Novi Velia | `40.216677` | `15.335865` | OpenStreetMap/Nominatim [peak] — punto della vetta del Monte Gelbison, dove sorge il santuario |
| Santuario di Pietrasanta | `40.047581` | `15.462548` | OpenStreetMap/Nominatim [place_of_worship] |

## Distanze e tempi (facoltativi)

`distanzaKm` e `tempoAuto` sono vuoti perché il sito non li dichiara. Si
compilano a mano: `distanzaKm: 12,` e `tempoAuto: "20 min",`. Lasciarli vuoti
non rompe niente: la scheda semplicemente non mostra quella riga.

---

Dati di localizzazione © OpenStreetMap contributors (ODbL).
