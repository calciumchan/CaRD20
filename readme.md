# Ca20 card game utilities

a collection of software for making, distributing, and preserving card games.

---

this project is relatively early into production. currently only hosting a card printing utility written in static HTML5. but a few more pieces of software are planned in the future to aid in the democratization of physical card games. the goal is to provide easy to use, free to distribute utilities for indie game makers, as well as game preservationists.

the HTCG (homemade trading card game) community often rely on services like gamecrafter to produce their cards, and usually cards are made individually with tools like photoshop. the goal here is to create easier distribution methods and automation tools to help prototype and generate cards. a byproduct of this would be making TCG gamejams more viable for more people.

---

# the software:

## Printer

a static HTML5 utility that allows easier printing of regular ``2.5in x 3.5in`` game cards. most print and play games are released as PDF files, however this has a few disadvantages to HTML.

PDF files are static, if you just want a handful of cards, or you want to print your own deck list, you have to commit to printing a whole page of cards you might not want. releasing with an HTML file instead allows for the game creator to set predetermined sets of cards such as starter decks, or for a player to create their own deck list which can easily be exported as json data and shared for others to use.

HTML embeds easily into a webpage making it perfect for stores like [ITCH.io](https://itch.io). being able to release an embeded version of the printer on your itch store page is perfect for gamejams, or releasing demo decks for people to try before buying your game, all without having to download anything. the goal is to make releasing a TCG or any physical card based game easier, cheaper, and faster.

i also hope that this improves preservation efforts for physical games. TCGs especially die all the time. the goal is to make it easy for communities surrounding older and often forgotten games to organize in person play sessions easier.

## Studio (future, working title)

electron (maybe) based app that uses makes creating card templates easier to speed up prototyping and production of cards. a user would create a set of common data cards have, then fill in that data for each card. multiple templates can be set based on different card types, and all this data is fed through user defined javascript to generate each card. card layouts are created with HTML/CSS/JS, and a few prototyping layouts would be included with the software.

having cards programatically generated has the benefit of making sweeping changes to your game trivial in real time. in a gamejam setting especially, rapid prototyping is really important. HTML/CSS are flexible enough that practically any desired card layout is achiveable.

this approach also makes translation easier. simply hand your json data over to a translator, and let your CSS handle the formating automatically.

this also means that allowing your community to create custom cards is a lot easier. the custom card community is huge for games like MTG and binding of isaac four souls, and these communities go to great lengths to reconstruct card elements. allowing your community to have your layouts and templates can give a lot of longevity to your game the same way modding does to video games.

i already use a custom piece of software similar to this, however it uses nodejs and puppeteer to render cards. this is a lot to ask of a user on top of already asking them to learn HTML5, so its not really fit for public use the way an electron app would. making card games isnt easy, and an app that handles card generation and distribution could make all the difference to someone.

---

# LGSs

i briefly want to mention LGSs (local game stores). i want to give smaller businesses the chance to carve a nieche out for themselves again. large stores like walmart and amazon have really put a chokehold on the TCG market in the last few years. and companies like WOTC dont really seem that interested in supporting smaller stores.

i think that an LGS armed with a decent tank printer, some cardstock, a paper CNC, and an agreement with an indie card game publisher could really help small stores with really thin margins and creators with even thinner margins.

the cost of individual cards printed this way is extemely minimal (with my setup i calculate about $0.05cad/card). when compared to the cost of a traditional card games product, which creators and store owners have to buy and store upfront, the margins are way better. a physical card game that you can buy and print the exact amount needed for players without having to pay for shipping saves store owners and players money, and brings in way more for the creators of the game.

given the last few years of WOTC landfill dumps, id say that the TCG overhead is getting a bit much. the current model of TCG releases is outdated and hurts everyone involved.

---

# License

everything here is released under a public domain license. you can use, modify, and sell any of this software. the whole point is to empower indies after all. however i do have a few requests, you dont have to follow these but it would be nice.

- send me a link to your work that uses this software, [i want to see it!](https://calciumchan.com) (maybe drop me a free copy too if you wouldnt mind) 
- please give your community some way to archive your game. releasing your source files is preferable, even if its some time after release or game death. but even just releasing the high quality, printable cards is good enough. preservation of physical games is really important to me, and i want people to be able to play and learn from these games in the future.
- please dont release a game that has strict random card acquisition. if your players cant get the card they want without turning to a secondary market or carcking packs you havent made a game, youve made a commonly justified skinner box.
- try to keep your final assets free of "AI" art. "AI" usage is common in the HTCG community. its a quick fix for people who havent learned to draw yet, but illustrators and writers need to eat too!
- release on [ITCH.io](https://itch.io)!