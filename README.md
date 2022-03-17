# Auctioneer

##Beskrivning
Ni ska producera ett Webb API med REST endpoints för de dataflöden en frontend för en auktionsapplikation behöver. Ni producerar med andra ord tjänstens backend.

Vad erbjuder en typisk auktionstjänst?
Vad ska ni producera?
E/R modell på datastrukturer
Enkla wireframes som illusterar en frontend som använder Web API:et
Beetendebeskrivningar i Gherkin (BDD Scenarior) som beskriver interaktionerna i era wireframes
API dokumentation (i en Readme-fil eller som en endpoint med information om API:et)
Ett Webb API med endpoints, som minst omfattar skallkraven nedan
#User Stories
##Skallkrav (prio 1)
(dessa måste levereras och göras först)

Som besökare vill jag kunna se sammanfattade auktionsobjekt som en lista.
Som besökare vill jag kunna se detaljer för varje auktionsobjekt.
Som besökare vill jag kunna söka på auktioner baserat på vad jag skriver i ett sökfält.
Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i listvyer
Som besökare vill jag kunna se nuvarande bud på auktionsobjekt i detaljsidor.
Som besökare vill jag kunna registrera ett nytt konto och bli användare.
Som användare vill jag kunna logga in.
Som användare vill jag kunna lägga (högre än nuvarande) bud på auktionsobjekt på dess detaljsida.
Som användare vill jag kunna skapa nya auktionsobjekt.
Som användare ska jag inte kunna lägga bud på mina egna auktionsobjekt.
Som användare vill jag att auktionsobjekt ska innehålla minst titel, beskrivning, starttid, sluttid och bild(er)
Som användare vill jag kunna sätta ett utgångspris på mina auktionsobjekt.
Som användare vill jag kunna sätta ett dolt reservationspris på mina auktionsobjekt. (om bud ej uppnått reservationspris när auktionen avslutas så säljs objektet inte).
##Ytterligare krav
(dessa ska ni arbeta med när ni är färdiga med skallkraven)

Prio 2
Som besökare vill jag kunna se auktioner inom kategorier.
Som besökare vill jag kunna söka på auktioner inom en kategori jag valt.
Som besökare vill jag kunna se auktioner baserat på status (pågående, avslutade, sålda, ej sålda).
Som användare vill jag kunna se en lista med mina egna auktionsobjekt.
Som användare vill jag kunna se en lista med auktionsobjekt jag har lagt bud på.
Prio 3
Som användare vill jag ha en publik profilsida där namn, publika kontaktuppgift(er) & bild visas för andra att läsa.
Som användare vill jag att min publika profilsida innehåller information om hur många auktioner jag köpt och sålt.
Som köpare vill jag kunna ge ett betyg efter köp av ett auktionsobjekt.
Som säljare vill jag kunna ge ett betyg efter försäljning av ett auktionsobjekt.
Som användare vill jag kunna se säljares betyg när jag tittar på ett auktionsobjekt.
Prio 4
Som användare vill jag kunna skicka meddelande till en säljare av ett auktionsobjekt.
Som säljare av ett auktionsobjekt vill jag kunna svara på meddelande från användare.
