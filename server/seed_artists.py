import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from catalog.models import Artist, Brand, Product

# Brand ID map (from API data)
BRAND_IDS = {
    'marshall': 38,
    'dean': 40,
    'esp': 48,
    'gibson': 51,
    'jackson': 45,
    'ernie_ball': 41,
    'fender': 42,
    'bc_rich': 47,
    'mesa': 50,
    'peavey': 49,
    'orange': 39,
    'mxr': 43,
    'dunlop': 44,
}

# Product ID map (approximate matches from API data)
PRODUCT_IDS = {
    'jackson_soloist': 129,
    'jackson_dk2': 130,
    'esp_ec1000': 138,
    'esp_mh1000': 139,
    'gibson_les_paul': 147,
    'gibson_sg': 148,
    'fender_strat': 120,
    'fender_tele': 121,
    'dean_dime_ml': 114,
    'dean_razorback': 115,
    'dean_v79': 116,
    'bc_rich_mockingbird': 136,
    'bc_rich_warlock': 135,
    'marshall_dsl100': 109,
    'marshall_4x12': 110,
    'mesa_dual_rect': 144,
    'mesa_mark_v': 145,
    'peavey_6505': 141,
    'ernie_regular': 117,
    'ernie_super': 118,
    'mxr_distortion': 123,
    'dunlop_crybaby': 126,
    'dunlop_jazzIII': 128,
    'engl_fireball': 105,
}

ARTISTS = [
    {
        'name': 'Zakk Wylde',
        'slug': 'zakk-wylde',
        'role': 'Ozzy Osbourne / Black Label Society – Lead Guitar',
        'bio': """Zakk Wylde: The Berserker of Heavy Metal
"The Viking of Pentatonic"
Zakk Wylde este chitaristul care a redefinit ce înseamnă să cânți "heavy" în era modernă. Crescut în New Jersey, Zakk a ajuns la vârsta de 20 de ani chitaristul lui Ozzy Osbourne, înlocuind un loc imposibil de umplut – cel al lui Randy Rhoads. Nu doar că a reușit, dar a creat propriul său limbaj muzical, bazat pe pinch harmonics explosivi, vibrato extrem și un ton "wall of sound" inconfundabil.

The Sound & The Gear
Gibson Les Paul Custom "Bullseye": Chitara sa semnătură, pictată cu cercuri concentrice negre și albe, este una dintre cele mai recognoscibile imagini din rock. Zakk preferă Les Paul-uri cu doze EMG 81/85 pentru output-ul masiv.
Marshall JCM800 & JVM: Fidel familiei Marshall, Zakk a explorat mai multe generații de amplificatoare pentru a-și construi acel "wall of gain" caracteristic.
Dunlop Cry Baby Zakk Wylde Signature Wah: Pedala sa personalizată, cu un filtru adaptat pentru a accentua frecvențele medii specifice stilului său de "howling" wah.

Black Label Society
Fondator al trupei Black Label Society, Zakk a creat o comunitate (SDMF – Stronger than Death, Merciless Full Force) care reunește fanii fideli ai metal-ului pur. Albumele sale sunt o ode adusă Les Paul-ului, berii și fraternității de stage.""",
        'quote': '"If you\'re gonna play guitar, you\'d better learn how to feel the music, not just play the notes."',
        'brands': ['gibson', 'marshall', 'dunlop'],
        'products': ['gibson_les_paul', 'marshall_dsl100', 'dunlop_crybaby'],
    },
    {
        'name': 'James Hetfield',
        'slug': 'james-hetfield',
        'role': 'Metallica – Vocals / Rhythm Guitar',
        'bio': """James Hetfield: The Right Hand of God
"The Architect of the Perfect Riff"
James Hetfield nu este pur și simplu chitaristul de ritm al Metallica; el este unul dintre cei mai influenți riff-writers din istoria muzicii grele. Tehnica sa de "palm muting" și ritmul său incredibil de precis au creat standardul de aur pentru thrash metal. De la Kill 'Em All până la Hardwired...to Self-Destruct, Hetfield a demonstrat că ritmul poate fi la fel de devastator ca orice solo.

The Sound & The Gear
ESP Snakebyte: Chitara sa semnătură este o capodoperă de ergonomie și ton, cu pickup-uri EMG James Hetfield signature și un corp special proiectat pentru confortul extrem al cântecului de ritm agresiv.
Mesa Boogie Triple Rectifier: Amplificatorul care a dat naștere sunetului "black album". Combinat cu cabinetele Mesa 4x12, oferă acel "chug" masiv și definit care a influențat generații întregi de chitariști.
Dunlop Hetfield Black Fang Picks: Pana specială cu un unghi ascuțit care maximizează viteza și precizia atacului pe corzi groase în drop tunings.""",
        'quote': '"Anger is a gift. Be careful how you use it."',
        'brands': ['esp', 'mesa'],
        'products': ['esp_ec1000', 'mesa_dual_rect', 'mesa_mark_v'],
    },
    {
        'name': 'Kirk Hammett',
        'slug': 'kirk-hammett',
        'role': 'Metallica – Lead Guitar',
        'bio': """Kirk Hammett: The Wah-Wah Wizard
"The Soul of Metallica's Solos"
Kirk Hammett este chitaristul lead al Metallica din 1983 și unul dintre cei mai recunoscuți soliști din metal. Faimos pentru utilizarea intensivă a pedalei wah-wah, Kirk a creat solo-uri care sunt astăzi studiate în școli de muzică din întreaga lume. Inițiat în tehnica blues și shred de către Joe Satriani, Hammett a translatat această cunoaștere în limbajul thrash metalului, creând un stil unic.

The Sound & The Gear
ESP Kirk Hammett Signature "Ouija": Una dintre cele mai iconice chitare din lume, cu grafică tip tablă de scris spiritiste. Kirk folosește ESP exclusiv, preferând gâturile rapide și dozele EMG 81/60.
Dunlop Kirk Hammett Signature Wah (KH95): Pedala sa indispensabilă, construită cu un pot custom și un range de frecvențe adaptat pentru solourile sale expresive din Master of Puppets sau The Thing That Should Not Be.
Mesa Boogie Mark IIC+: Amplificatorul legendar folosit la înregistrarea albumului Master of Puppets, considerat cel mai bun amplificator de metal ever creat.""",
        'quote': '"I started playing guitar because I wanted to impress people, and it worked."',
        'brands': ['esp', 'mesa', 'dunlop'],
        'products': ['esp_mh1000', 'mesa_mark_v', 'dunlop_crybaby'],
    },
    {
        'name': 'Cliff Burton',
        'slug': 'cliff-burton',
        'role': 'Metallica – Bass (1982–1986)',
        'bio': """Cliff Burton: The Bass God
"The Man Who Made Bass a Lead Instrument"
Clifford Lee Burton este, fără îndoială, cel mai influent basist din istoria heavy metalului. Decesul său tragic în 1986 a lăsat un gol care nu a putut fi niciodată umplut, dar moștenirea sa este mai vie ca oricând. Cliff a tratat basul ca pe un instrument solo, utilizând tehnici de wah-wah și distorsie neauzite înainte în bass playing, inspirând generații întregi de basiști să depășească rolul tradițional.

The Sound & The Gear
Rickenbacker 4001 & Mesa: Burton era faimos pentru tonul său "grungy" și plin, obținut prin combinații neortodoxe de amplificatoare și pedale de efecte aplicate pe bas.
Big Muff Pi: Pedala de distorsie prin care Cliff transforma basul într-o voce lead, creând solo-uri masive ca "(Anesthesia) Pulling Teeth" – o capodoperă a basului nedilutat.
Marshall Stack: Stiva sa de amplificatoare Marshall era simbolul vizual al prezenței sale colosale pe scenă.""",
        'quote': '"Rage, rage against the dying of the light."',
        'brands': ['marshall'],
        'products': ['marshall_4x12', 'marshall_dsl100'],
    },
    {
        'name': 'Lemmy Kilmister',
        'slug': 'lemmy-kilmister',
        'role': 'Motörhead – Bass / Vocals',
        'bio': """Lemmy Kilmister: The Last Outlaw
"The Man Who Invented Rock & Roll Attitude"
Ian Fraser "Lemmy" Kilmister era mai mult decât un muzician; era o forță a naturii. Fondatorul și sufletul trupei Motörhead, Lemmy a creat un sunet la granița dintre heavy metal, punk și rock and roll care nu a mai fost reprodus. Timp de patru decenii, Motörhead a devastat scene din întreaga lume cu o intensitate inimaginabilă.

The Sound & The Gear
Rickenbacker Bass (Îndreptat spre amplificatoare de chitară): Secretul sunetului său de distorsie era că folosea amplificatoare de chitară Marshall pentru bas, nu amplificatoare de bas convenționale. Rezultatul era un ton greoi, distorsat, de o greutate care defini termenul "heavy".
Marshall Superbass Stack: Lemmy era faimos pentru "zidul de Marshall-uri" de pe scenă, un setup care producea volume ce puteau fi simțite fizic în tot corpul.
Aria Pro SB-1000: Una dintre chitarele sale bas favorite, cu un ton agresiv și o construcție solidă.""",
        'quote': '"Everything louder than everything else."',
        'brands': ['marshall'],
        'products': ['marshall_dsl100', 'marshall_4x12'],
    },
    {
        'name': 'Dave Mustaine',
        'slug': 'dave-mustaine',
        'role': 'Megadeth – Vocals / Lead Guitar',
        'bio': """Dave Mustaine: The Unholy Alliance
"The King of Thrash Riffs and Political Fire"
Dave Mustaine este co-fondatorul Megadeth și unul dintre cei mai prolific riff-writers din thrash metal. Forțat să iasă din Metallica în 1983, Mustaine a transformat furia și ambiția sa într-un combustibil care a propulsat Megadeth în vârful ierarhiei thrash mondiale. Albume ca Peace Sells...But Who's Buying? și Countdown to Extinction sunt capodopere de thrash metal progresiv.

The Sound & The Gear
Dean Dave Mustaine VMNT: Chitara semnătură în formă de "V" dublu, numită "Angel of Death", este extensia perfectă a personalității sale agresive și a tonului său tăios.
Marshall JCM800: Amplificatoare pe care Mustaine le-a modificat intensiv pentru a obține acel ton "razor sharp" de thrash, cu o claritate a notelor care permite ascultarea fiecărei note chiar și în cele mai rapide pasaje.
Jackson King V: Chitarele Jackson au fost compania sa la începuturile Megadeth, oferind gâturile ultra-rapide necesare pentru tehnicismul extrem al stilului suo de shredding.""",
        'quote': '"I\'m a product of my environment – all those things that make me who I am."',
        'brands': ['dean', 'marshall', 'jackson'],
        'products': ['dean_v79', 'marshall_dsl100', 'jackson_soloist'],
    },
    {
        'name': 'Randy Rhoads',
        'slug': 'randy-rhoads',
        'role': 'Ozzy Osbourne – Lead Guitar (1979–1982)',
        'bio': """Randy Rhoads: The Classical Metal Pioneer
"The Angel of Metal Guitar"
Randy Rhoads a trăit doar 25 de ani, dar în acel timp scurt a revoluționat complet ce înseamnă chitara lead în heavy metal. Combinând tehnicile clasice (studia zilnic la chitara acustică și lua lecții de chitară clasică chiar și în perioadele de turneu) cu agresivitatea metal-ului, Randy a creat un limbaj muzical fără precedent care influențează chitariști până în ziua de azi.

The Sound & The Gear
Jackson Randy Rhoads "Concorde": Chitara tip "V" asimetrică creată de Grover Jackson special pentru Randy este primul instrument care poartă logo-ul Jackson. Acest model a dat naștere liniei Jackson de chitare.
Marshall JMP/Half Stacks: Randy folosea amplificatoare Marshall modificate, obținând un ton cu un ton care era cald dar plin de prezență în medii, perfect pentru solourile sale neoclasice.
Les Paul Custom Polka Dot: Una dintre chitarele sale iconice era un Gibson Les Paul Custom alb cu puncte negre, care a creat un look vizual inconfundabil.""",
        'quote': '"I\'m not a virtuoso. I\'m just a guitar player who loves the instrument."',
        'brands': ['jackson', 'marshall'],
        'products': ['jackson_soloist', 'marshall_dsl100', 'marshall_4x12'],
    },
    {
        'name': 'Rex Brown',
        'slug': 'rex-brown',
        'role': 'Pantera / Kill Devil Hill – Bass',
        'bio': """Rex Brown: The Groove Foundation
"The Unsung Hero of Texas Groove Metal"
Rex Brown este basistul pe care îl auzi în fiecare riff iconic al Panterei fără să-ți dai seama cât de fundamental este rolul său. Groove-ul și tonul său masiv de bas sunt fundația care face riff-urile lui Dimebag să pună stăpânire pe orice audiție. Rex nu joacă "sub" chitară ci "cu" ea, creând un bloc de sunet unitar și devastator.

The Sound & The Gear
Spector USA Basses: Rex preferă instrumente cu un ton activ, plin de subgravi, care să poată susține frecvențele joase necesare pentru groove-ul specific Pantera.
Ampeg SVT: Amplificatorul clasic de bas, faimos pentru tonul său cald, dens și "old school", perfect pentru a ancora riff-urile agresive ale Panterei.
Ernie Ball Bass Strings: Rex este fan Ernie Ball pentru consistența și durabilitatea corzilor sale în condiții de turneu intens.""",
        'quote': '"The bass is the heartbeat. If the heartbeat is off, everything is off."',
        'brands': ['ernie_ball'],
        'products': ['ernie_regular'],
    },
    {
        'name': 'Vinnie Paul',
        'slug': 'vinnie-paul',
        'role': 'Pantera / Hellyeah – Drums',
        'bio': """Vinnie Paul: The Groove Machine
"The Man Behind the Texas Metal Groove"
Vinnie Paul Abbott (fratele lui Dimebag Darrell) este bateristul care a pus groov-ul în "Groove Metal". Tehnica sa de baterie combina puterea brută a thrash-ului cu un simț ritmic funky, creând un stil unic care a definit sunetul Pantera. Vinnie era cunoscut pentru tonul său de tobe extrem de puternic și pentru setul sau de dimensiuni considerabile care îi permitea să lovească cu o forță devastatoare.

The Sound & The Gear
Tama Drums: Vinnie a colaborat îndelung cu Tama, folosind kituri personalizate cu finisaje speciale și dimensiuni mai mari decât standardul pentru a produce acel volum și punch caracteristic.
Zildjian Cymbals: Parteneriat de lungă durată care i-a asigurat crash-urile și ride-ul cu tonul metalic și agresiv dorit.
Evans Drumheads: Preferința sa pentru capturi Evans i-a asigurat suprafețe de lovire durabile și un ton consistent pe scenă.""",
        'quote': '"Groove is everything. Everything else comes from the groove."',
        'brands': ['dunlop'],
        'products': ['dunlop_jazzIII'],
    },
    {
        'name': 'Phil Anselmo',
        'slug': 'phil-anselmo',
        'role': 'Pantera / Down / Superjoint – Vocals',
        'bio': """Philip Anselmo: The Voice of Metal Aggression
"The Most Powerful Metal Vocalist of the 90s"
Philip H. Anselmo este vocea definitorie a generației thrash și groove metal din anii '90. Cu un range vocal impresionant, capabil să treacă de la un growl distructiv la o melodie vulnerabilă, Anselmo a dat viață textelor intense ale Panterei. Prezența sa scenică este legendarizata – un performer total care trăiește fiecare notă.

The Sound & The Gear
Shure SM58 / Beta 58A: Micro-fonul standard de live care, în mâinile lui Phil, devine o armă sonoră. Nu echipamentul face diferența, ci artistul.
Peavey PA Systems: Pantera a folosit intensiv echipamente Peavey pentru sistemele lor de amplificare live, datorită robusteței și puterii lor.
Custom In-Ear Monitors: Anselmo a ales systeme profesionale de monitorizare pentru a-și proteja vocea în condițiile intense ale turneelor lungi.""",
        'quote': '"Strength beyond strength."',
        'brands': ['peavey'],
        'products': ['peavey_6505'],
    },
    {
        'name': 'Jeff Hanneman',
        'slug': 'jeff-hanneman',
        'role': 'Slayer – Rhythm/Lead Guitar',
        'bio': """Jeff Hanneman: The Dark Architect
"The Man Who Wrote the Apocalypse"
Jeff Hanneman a co-fondat Slayer și a scris unele dintre cele mai devastatoare și controversate piese din istoria metalului extrem, inclusiv "Raining Blood" și "Angel of Death". Stilul său de compoziție era brutal, dar structural ingenios, construind tensiune și agresivitate printr-o combinație de viteza tremolo picking și riff-uri disonante care sfidau orice convenție muzicală.

The Sound & The Gear
ESP Jeff Hanneman Signature: Chitarele sale personalizate ESP cu teme naziste (folosite strategic pentru puterea de șoc artistic) au creat un look controversat și inconfundabil. ESP i-a furnizat instrumente construite pentru agresivitate maximă.
Marshall JCM800: Amplificatorul definitiv al sunetului Slayer – high gain, tăios, fără compromisuri.
Kahler Tremolo: Spre deosebire de un Floyd Rose, sistemul Kahler folosit de Hanneman oferea un feeling diferit pentru dive-bomb-urile haotice specifice solourilor Slayer.""",
        'quote': '"I love extremely heavy, brutal music. And I love the blues. Those two are not that far apart."',
        'brands': ['esp', 'marshall'],
        'products': ['esp_ec1000', 'marshall_dsl100'],
    },
    {
        'name': 'Dave Lombardo',
        'slug': 'dave-lombardo',
        'role': 'Slayer / Misfits / Suicidal Tendencies – Drums',
        'bio': """Dave Lombardo: The Godfather of Double Bass
"The Human Drumming Machine"
Dave Lombardo este unul dintre cei mai influenți baterisți din istoria muzicii grele. Tehnica sa de double bass pedal – rapidă, precisă și devastatoare – a stabilit standardul pentru thrash metal drumming. Albumele Slayer din perioada sa de glorie (Reign in Blood, South of Heaven, Seasons in the Abyss) sunt lecții de arhitectură ritmică extremă.

The Sound & The Gear
Tama Drums: Parteneriat îndelungat care i-a furnizat kituri construite pentru agresivitate și volum.
Sabian Cymbals: Dave preferă crash-uri cu un declin rapid și ride-uri cu un ton metalic ascuțit care se aude clar peste riff-urile de chitară.
DW Double Bass Pedal: Pedalele sale de dublu bas sunt adaptate pentru viteza extremă și precizia cronometrică necesare în thrash metal.""",
        'quote': '"I\'m not just playing drums; I\'m building walls with them."',
        'brands': ['dunlop'],
        'products': ['dunlop_jazzIII'],
    },
    {
        'name': 'Tom Araya',
        'slug': 'tom-araya',
        'role': 'Slayer – Bass / Vocals',
        'bio': """Tom Araya: The Voice of Darkness
"The Most Terrifying Scream in Metal"
Tom Araya este fața și glasul Slayer – basistul care sfidează gravitația cântând și cântând simultan la instrumente grele fără să facă niciun compromis la calitatea vocalelor. Screams-urile sale – în special cel de la finalul introducerii din Reign in Blood – sunt printre cele mai recunoscute din toată muzica extremă.

The Sound & The Gear
ESP Tom Araya Signature Bass: Basul său semnătură ESP cu dimensiuni și spec-ificații adaptate stilului său agresiv de cântat.
Ampeg SVT Classic: Standardul de aur al basistilor de metal, oferind tonul dens, definit și puternic necesar să domine mixajul Slayer.
DR Bass Strings: Preferința lui Tom pentru corzi cu un ton bright și un atac definit, care să poată fi auzit clar chiar și sub riff-urile intense de chitară.""",
        'quote': '"I\'m the most wholesome Satanist you\'ll ever meet."',
        'brands': ['esp', 'dunlop'],
        'products': ['esp_mh1000', 'dunlop_crybaby'],
    },
    {
        'name': 'Andreas Kisser',
        'slug': 'andreas-kisser',
        'role': 'Sepultura – Lead Guitar',
        'bio': """Andreas Kisser: The Brazilian Metal Maestro
"The Technical Foundation of Sepultura"
Andreas Kisser este chitaristul lead al Sepultura, alăturate lui Max Cavalera și responsabil pentru unele dintre cele mai tehnice și creative solo-uri din thrash-ul sud-american. Kisser a adus un nivel de sofisticare melodică care a echilibrat perfect brutalitatea riff-urilor ritmice ale lui Max, creând un sunet Sepultura recunoscut global.

The Sound & The Gear
Ibanez RG & S Series: Kisser este fidel chitarelor Ibanez cu gâturi rapide și humbucker-uri de înaltă performanță, ideale pentru tehnicismul specific solourilor sale.
Marshall JCM800: Amplificatoare clasice care i-au furnizat tonul tăios și prezent necesar pentru a penetra mixajul dens al Sepulturei.
EMG Pickups 81/85: Combinația activă clasică care oferă consistency și output ridicat în condițiile de turneu intens.""",
        'quote': '"Music is the only thing that can make you feel everything at once."',
        'brands': ['marshall', 'esp'],
        'products': ['marshall_dsl100', 'esp_mh1000'],
    },
    {
        'name': 'Iggor Cavalera',
        'slug': 'iggor-cavalera',
        'role': 'Sepultura / Cavalera – Drums',
        'bio': """Iggor Cavalera: The Tribal Thunderer
"The Percussive Heart of Sepultura"
Iggor Cavalera (fratele lui Max) este bateristul care a pus Brazilia pe harta drumming-ului mondial. Stilul său combina agresivitatea thrash-ului american cu influențe tribale braziliene și percuție specifică lumii a treia, creând un sunet unic care a definit albumele clasice Sepultura – Beneath the Remains, Arise și Chaos A.D.

The Sound & The Gear
Pearl Drums: Parteneriat de lungă durată care i-a furnizat kituri adaptate pentru turnee intercontinentale intense.
Paiste Cymbals: Iggor preferă crash-uri cu un atac agresiv și o expansiune rapidă a sunetului.
Tribal Percussion: Pe lângă setul standard, Iggor incorpora tobe etnice și percuție tradițională braziliană pentru a crea texturi ritmice unice.""",
        'quote': '"You don\'t need to speak the same language to feel the same music."',
        'brands': ['dunlop'],
        'products': ['dunlop_jazzIII'],
    },
    {
        'name': 'Marty Friedman',
        'slug': 'marty-friedman',
        'role': 'Megadeth / Solo – Lead Guitar',
        'bio': """Marty Friedman: The Exotic Shred Master
"The Most Melodic Guitarist in Thrash Metal"
Marty Friedman este unul dintre cei mai insoliti și recunoscuți chitariști din thrash metal. Cu un tehnic impecabil de shredding, dar mai ales cu o sensibilitate melodică profundă influențată de muzica asiatică și hawaiiană (el a crescut în Hawaii), Marty a adus o dimensiune exotică și expresivă solourilor din Megadeth.

The Sound & The Gear
Jackson Guitars: Marty a colaborat îndelung cu Jackson, folosind modele personalizate cu specificații orientate spre viteză și confort la tastele superioare.
Carvin Amplifiers: Alegerea sa pentru tone curate cu headroom mare, pe care le combina cu pedale de distorsie pentru a-și personaliza tonul.
Dean Marty Friedman Signature: Ulterior, Dean i-a creat modele semnătură care capturează stilul său vizual distinctiv.""",
        'quote': '"Every note I play has a reason. Nothing is random."',
        'brands': ['jackson', 'dean'],
        'products': ['jackson_dk2', 'dean_v79'],
    },
    {
        'name': 'Eddie Van Halen',
        'slug': 'eddie-van-halen',
        'role': 'Van Halen – Lead Guitar',
        'bio': """Eddie Van Halen: The Guitar God
"The Man Who Reinvented What Was Possible on Guitar"
Edward Lodewijk Van Halen a schimbat cursul muzicii rock pentru totdeauna. Tehnica sa de "two-hand tapping" – popularizată prin solo-ul Eruption de pe primul album Van Halen (1978) – a redefinit ce este posibil pe chitară electrică. Înainte de Eddie, guitar hero-ii erau adorați; după el, au apărut sute de mii de chitariști care au vrut să reproducă imposibilul.

The Sound & The Gear
"Frankenstrat": Chitara sa legendară construită din piese diverse (corp Stratocaster, gât Dunlop, doze humbucker în bridge), vopsită manual, este simbolul inovației DIY în lumea chitarelor.
Marshall Super Lead (Modificat): Eddie și-a modificat amplificatoarele Marshall pentru a obține acel "brown sound" – un ton cald, saturate, cu un decay specific care este imposibil de reprodus fără aceeași configurație.
Peavey 5150 Signature: În anii '90, Eddie a colaborat cu Peavey pentru a crea amplificatorul 5150, mai târziu redenumit 6505, care a definit sunetul rock-ului hard al acelui deceniu.""",
        'quote': '"You gotta have fun. Regardless of what you\'re doing."',
        'brands': ['fender', 'peavey', 'marshall'],
        'products': ['fender_strat', 'peavey_6505', 'marshall_dsl100'],
    },
    {
        'name': 'Axl Rose',
        'slug': 'axl-rose',
        'role': "Guns N' Roses – Vocals",
        'bio': """Axl Rose: The Unpredictable Legend
"Rock's Most Controversial Frontman"
William Bruce Rose Jr., cunoscut ca Axl Rose, este una dintre cele mai mari voci din istoria rock-ului. Liderul Guns N' Roses a adus o intensitate și o imprevizibilitate scenică fără precedent, combinând un range vocal extrem (de la note stridente la grave profunde) cu o prezență de scenă electrizantă. Controversat, imprevizibil, dar incontestabil genial.

The Sound & The Gear
Shure SM58 Live: Micro standardul de live care a captat unele dintre cele mai spectaculoase performanțe din istoria rock-ului.
Piano & Synths: Axl este și un pianist talentat, folosind clape pentru piese ca November Rain și Hello, I see the horizon.
Marshall Stacks: Deși Axl nu cântă la chitară pe scenă, pereții de Marshall din spatele trupei sunt contextul vizual iconic al show-urilor GNR.""",
        'quote': '"Nothing lasts forever, even cold November rain."',
        'brands': ['marshall'],
        'products': ['marshall_4x12'],
    },
    {
        'name': 'Tony Iommi',
        'slug': 'tony-iommi',
        'role': 'Black Sabbath – Lead Guitar',
        'bio': """Tony Iommi: The Inventor of Heavy Metal
"The Man Who Created the Darkness"
Anthony Frank Iommi este, fără nicio îndoială, fondatorul heavy metalului. La vârsta de 17 ani, și-a pierdut vârfurile a două degete ale mâinii drepte într-un accident industrial. În loc să renunțe la muzică, și-a tunat degetele cu proteze de piele și a coborât acordajul chitarei pentru a reduce tensiunea corzilor. Rezultatul? Acordajele joase, întunecate, care au definit sunetul Black Sabbath și au inventat heavy metalul.

The Sound & The Gear
Gibson SG: Chitara sa semnătură – un SG Custom negru cu numere de serie distincte – este unul dintre cele mai iconice instrumente din istoria muzicii.
Laney Klipp Amplifiers: Tony a folosit amplificatoarele Laney în primii ani ai Sabbath, dând naștere unui ton extrem de greu și distorsat pe care nimeni nu îl mai auzise.
DiMarzio DP100 "Super Distortion": Doza care a furnizat acel output masiv necesar pentru riff-urile întunecate ale Sabbath.
Orange amps: O altă marcă asociata cu sunetul original Black Sabbath.""",
        'quote': '"I had to find my own sound because I couldn\'t play like everyone else."',
        'brands': ['gibson', 'orange'],
        'products': ['gibson_sg', 'gibson_les_paul'],
    },
    {
        'name': 'Joe Bonamassa',
        'slug': 'joe-bonamassa',
        'role': 'Blues Rock – Lead Guitar / Singer-Songwriter',
        'bio': """Joe Bonamassa: The Modern Blues King
"The Most Hardworking Guitarist Alive"
Joe Bonamassa este the definition of a "guitar geek". Cu o colecție de peste 400 de chitare vintage și cel mai prolific output discografic din contemporary blues, Joe a dus blues-ul rock tradițional în era modernă cu o îngrijire meticulos. Auto-didact de la o vârstă fragedă (a deschis un concert B.B. King la vârsta de 12 ani!), Bonamassa este astăzi cel mai bine vândut artist de blues din lume.

The Sound & The Gear
1959 Pre-CBS Fender Stratocaster: Joe are o colecție extraordinară de Strat-uri vintage fabricate în "Golden Age" Fender, pe care le folosește în funcție de piesa sau albumul de înregistrat.
Gibson Les Paul Standard (Various Vintage): La fel ca pentru Strat, Joe preferă Les Paul-uri din perioadele '58, '59, '60 pentru tonul lor unic "PAF" (Patent Applied For pickups).
Marshall Vintage Stack: Fidel sunetului clasic Marshall, Joe preferă amplificatoarele din perioadele 60-70 pentru headroom-ul și caracterul lor unic.
Dunlop Signature Wah: Colaborarea cu Dunlop a dus la crearea propriei sale pedale Cry Baby cu voicing personalizat.""",
        'quote': '"I\'ll stop collecting guitars when I die, and even then, have a plan B."',
        'brands': ['fender', 'gibson', 'marshall', 'dunlop'],
        'products': ['fender_strat', 'gibson_les_paul', 'marshall_dsl100', 'dunlop_crybaby'],
    },
]

def seed_artists():
    created = 0
    updated = 0
    
    for a_data in ARTISTS:
        artist, made = Artist.objects.get_or_create(slug=a_data['slug'])
        
        artist.name = a_data['name']
        artist.role = a_data['role']
        artist.bio = a_data['bio']
        artist.quote = a_data['quote']
        
        # Set image placeholders (no actual image files added)
        if not artist.image:
            artist.image = None
            
        artist.save()
        
        # Set brands M2M
        brand_objs = []
        for b_key in a_data.get('brands', []):
            bid = BRAND_IDS.get(b_key)
            if bid:
                try:
                    brand_objs.append(Brand.objects.get(id=bid))
                except Brand.DoesNotExist:
                    print(f"  Brand not found: {b_key} (id={bid})")
        artist.brands.set(brand_objs)
        
        # Set products M2M
        product_objs = []
        for p_key in a_data.get('products', []):
            pid = PRODUCT_IDS.get(p_key)
            if pid:
                try:
                    product_objs.append(Product.objects.get(id=pid))
                except Product.DoesNotExist:
                    print(f"  Product not found: {p_key} (id={pid})")
        artist.products.set(product_objs)
        
        if made:
            created += 1
            print(f"  [CREATED] {artist.name}")
        else:
            updated += 1
            print(f"  [UPDATED] {artist.name}")
    
    print(f"\n✅ Done! {created} created, {updated} updated.")

if __name__ == '__main__':
    seed_artists()
