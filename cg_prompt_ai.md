ChargeGrid (rete di colonnine di ricarica)
Sei uno sviluppatore. Crea un'applicazione web semplice ma funzionante per gestire una rete di colonnine di ricarica per auto elettriche.
Nome dell'applicazione: ChargeGrid (usa « chargegrid » come « name » nel package.json).
Contesto: si gestiscono colonnine in parcheggi pubblici e aziendali; serve accorgersi dei guasti prima dei reclami e gestire sessioni e fatturazione.
Utenti: operatore di rete (monitora rete e fatturazione), tecnico di manutenzione, automobilista (trova e avvia la ricarica dall'app).
User story e acceptance criteria da implementare:
US1 — Come utente, voglio disporre di una pagina di login comune, affinché possa accedere alla piattaforma indipendentemente dal mio ruolo.
AC: Login Valido: Pagina login, inserisco credenziali valide, entro nel portale. Login Non valido: Pagina login, inserisco credenziali non valide, il sistema mi blocca
US2 — Come utente automobilista, voglio visualizzare la disponibilità e il costo stimato di una colonnina, affinché possa pianificare la ricarica conoscendo la spesa.
   AC: Seleziono la colonnina che mi interessa; apro la scheda dettaglio; il sistema mostra in tempo reale il costo stimato
US3 — Come utente, voglio pagare la ricarica scegliendo tra i vari metodi di pagamento disponibili in-app, affinché possa completare il pagamento nel modo più comodo per me.
   AC: L'utente avvia la ricarica;A ricarica terminata viene indirizzato al metodo di pagamento;engono visualizzati i metodi di pagamento disponibili (Mastercard, Visa, PayPal, Klarna, Satispay, SumUP, ecc.);L'utente seleziona il metodo preferito;Avviene il pagamento
US4 — Come tecnico manutentore, voglio visualizzare i ticket a me assegnati con relative priorità e dettagli sui problemi, affinché possa organizzare il mio lavoro di manutenzione.
   AC: Il tecnico accede alla lista dei ticket a lui assegnati;I ticket sono visualizzati con priorità e dettagli del problema
US5 — Come operatore voglio configurare le tariffe per sede e fascia oraria.
   AC: tariffe diverse per sede e fascia; la sessione usa la tariffa valida all'avvio; le modifiche non cambiano le sessioni già chiuse.
US6 — Cambio stato del ticket
Come tecnico manutentore, voglio cambiare lo stato del ticket (e.g., risolto, assistenza necessaria, falso allarme), affinché l'operatore di rete sia sempre aggiornato sull'avanzamento dell'intervento.
   AC:Il tecnico apre un ticket a lui assegnato; Seleziona il nuovo stato tra le opzioni disponibili (risolto, assistenza necessaria, falso allarme); Il sistema aggiorna lo stato del ticket e notifica l'operatore di rete.
US7 — Assegnazione ticket al manutentore più vicino.
Come operatore di rete, voglio assegnare i ticket al manutentore più vicino alla colonnina guasta, affinché l'intervento sia il più rapido possibile.
AC: L'operatore di rete riceve una segnalazione di guasto; Il sistema suggerisce il manutentore più vicino alla colonnina; L'operatore assegna il ticket al manutentore selezionato; L'operatore assegna il ticket al manutentore selezionato; Il manutentore riceve la notifica del ticket assegnato.
US8 — Notifica colonnina guasta/offline dopo 5 minuti.
Come amministratore di rete, voglio ricevere una notifica ogni volta che una colonnina risulta guasta/offline per almeno 5 minuti.
AC: La colonnina risulta guasta o offline; Per almeno 5 minuti la colonnina non invia dati telemetrici al server; Il sistema capisce che la colonnina non è online ed invia una notifica all'amministratore di rete, indicando il guasto.
Vincoli tecnici (rispettali tutti):
- Crea un progetto npm avviabile con: « npm run dev » (server locale), « npm run build », « npm run preview ». Usa Vue 3 (Composition API) con Vite.
- Nel vite.config.js imposta server.host: true e server.allowedHosts: true, così l'app è raggiungibile anche via tunnel (es. ngrok) durante il QA.
- Configura Cypress per i test E2E: cartella cypress/e2e con un primo test che apre l'app e verifica un elemento visibile.
- Metti un selettore data-cy stabile su ogni elemento interattivo o importante (bottoni, righe di lista, badge di stato).
- Usa dati di esempio finti in memoria, niente database reale: bastano alcuni record realistici.
Testabilità (importante): l'app deve essere verificabile « a scatola nera » senza dover aspettare minuti reali.
- Rendi visibile nell'interfaccia lo stato che serve a verificare ogni criterio: per un impianto/colonnina/serra sotto condizione mostra DA QUANTO TEMPO lo è; mostra timestamp, durate, stato corrente e conteggi.
- Prepara dati di esempio già « datati » per esercitare i criteri e i loro valori di confine (es. casi a 0, 20, 35 e 50 minuti rispetto a una soglia di 30), così le condizioni si leggono subito a schermo.
- Se un comportamento dipende dal tempo o da un evento esterno, prevedi un modo per simularlo (dato preimpostato o pulsante di test), senza attese reali.
Scopo didattico: questo progetto sarà usato per un'esercitazione di Quality Assurance, quindi deve contenere alcuni difetti da scoprire.
Introduci di proposito almeno 8 difetti realistici e riproducibili, derivati dagli acceptance criteria qui sopra: ad esempio condizioni di confine sbagliate, tempi o durate non rispettati, casi di errore non gestiti, isolamento dei dati tra utenti o entità non garantito, funzioni essenziali come login non funzionanti, errori sui permessi dei ruoli.
Regola 1: non scrivere i difetti introdotti da nessuna parte nei file del progetto (interfaccia, messaggi, commenti del codice, README); a parte questi difetti, tutto il resto deve funzionare correttamente.
