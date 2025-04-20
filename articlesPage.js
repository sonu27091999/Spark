// listing vars here so they're in the global scope
var cards, nCards, cover, openContent, openContentText, pageIsOpen = false,
  openContentImage, closeContent, windowWidth, windowHeight, currentCard, paragraphText;

// initiate the process
init();

function init() {
  resize();
  selectElements();
  attachListeners();
}

// select all the elements in the DOM that are going to be used
function selectElements() {
  cards = document.getElementsByClassName('card'),
    nCards = cards.length,
    cover = document.getElementById('cover'),
    openContent = document.getElementById('open-content'),
    openContentText = document.getElementById('open-content-text'),
    openContentImage = document.getElementById('open-content-image')
  closeContent = document.getElementById('close-content');
}

/* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
*/
function attachListeners() {
  for (var i = 0; i < nCards; i++) {
    attachListenerToCard(i);
  }
  closeContent.addEventListener('click', onCloseClick);
  window.addEventListener('resize', resize);
}

function attachListenerToCard(i) {
  cards[i].addEventListener('click', function (e) {
    var card = getCardElement(e.target);
    onCardClick(card, i);
  })
}

/* When a card is clicked */
function onCardClick(card, i) {
  // set the current card
  currentCard = card;
  // add the 'clicked' class to the card, so it animates out
  currentCard.className += ' clicked';
  // animate the card 'cover' after a 500ms delay
  setTimeout(function () { animateCoverUp(currentCard) }, 500);
  // animate out the other cards
  animateOtherCards(currentCard, true);
  // add the open class to the page content
  openContent.className += ' open';
}

/*
* This effect is created by taking a separate 'cover' div, placing
* it in the same position as the clicked card, and animating it to
* become the background of the opened 'page'.
* It looks like the card itself is animating in to the background,
* but doing it this way is more performant (because the cover div is
* absolutely positioned and has no children), and there's just less
* having to deal with z-index and other elements in the card
*/
function animateCoverUp(card, i) {
  // get the position of the clicked card
  var cardPosition = card.getBoundingClientRect();
  // get the style of the clicked card
  var cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition);
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // update the content of the opened page

  var paragraphClass = card.className.split(/\s+/).slice(1, 2)[0];
  if (paragraphClass === 'card1') {
    paragraphText = paragraphText1;
  }
  else if (paragraphClass === 'card2') {
    paragraphText = paragraphText2;
  }
  else if (paragraphClass === 'card3') {
    paragraphText = paragraphText3;
  }
  else if (paragraphClass === 'card4') {
    paragraphText = paragraphText4;
  }
  else if (paragraphClass === 'card5') {
    paragraphText = paragraphText5;
  }
  openContentText.innerHTML = '<h1>' + card.children[2].textContent + '</h1>' + paragraphText;

  openContentImage.src = card.children[1].src;
  setTimeout(function () {
    // update the scroll position to 0 (so it is at the top of the 'opened' page)
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);
}

function animateCoverBack(card) {
  var cardPosition = card.getBoundingClientRect();
  // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
  setCoverPosition(cardPosition);
  scaleCoverToFillWindow(cardPosition);
  // animate scale back to the card size and position
  cover.style.transform = 'scaleX(' + 1 + ') scaleY(' + 1 + ') translate3d(' + (0) + 'px, ' + (0) + 'px, 0px)';
  setTimeout(function () {
    // set content back to empty
    openContentText.innerHTML = '';
    openContentImage.src = '';
    // style the cover to 0x0 so it is hidden
    cover.style.width = '0px';
    cover.style.height = '0px';
    pageIsOpen = false;
    // remove the clicked class so the card animates back in
    currentCard.className = currentCard.className.replace(' clicked', '');
  }, 301);
}

function setCoverPosition(cardPosition) {
  // style the cover so it is in exactly the same position as the card
  cover.style.left = cardPosition.left + 'px';
  cover.style.top = cardPosition.top + 'px';
  cover.style.width = cardPosition.width + 'px';
  cover.style.height = cardPosition.height + 'px';
}

function setCoverColor(cardStyle) {
  // style the cover to be the same color as the card
  cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
  // calculate the scale and position for the card to fill the page,
  var scaleX = windowWidth / cardPosition.width;
  var scaleY = windowHeight / cardPosition.height;
  var offsetX = (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  var offsetY = (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // set the transform on the cover - it will animate because of the transition set on it in the CSS
  cover.style.transform = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ') translate3d(' + (offsetX) + 'px, ' + (offsetY) + 'px, 0px)';
}

/* When the close is clicked */
function onCloseClick() {
  // remove the open class so the page content animates out
  openContent.className = openContent.className.replace(' open', '');
  // animate the cover back to the original position card and size
  animateCoverBack(currentCard);
  // animate in other cards
  animateOtherCards(currentCard, false);
}

function animateOtherCards(card, out) {
  var delay = 100;
  for (var i = 0; i < nCards; i++) {
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
}

// animations on individual cards (by adding/removing card names)
function animateOutCard(card, delay) {
  setTimeout(function () {
    card.className += ' out';
  }, delay);
}

function animateInCard(card, delay) {
  setTimeout(function () {
    card.className = card.className.replace(' out', '');
  }, delay);
}

// this function searches up the DOM tree until it reaches the card element that has been clicked
function getCardElement(el) {
  if (el.className.indexOf('card ') > -1) return el;
  else return getCardElement(el.parentElement);
}

// resize function - records the window width and height
function resize() {
  if (pageIsOpen) {
    // update position of cover
    var cardPosition = currentCard.getBoundingClientRect();
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
  }
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

// images for 1st article
var img1_1 = `<img src="assets/card1_1.jpg">`;
var img1_2 = `<img src="assets/card1_2.jpg">`;
var img1_3 = `<img src="assets/card1_3.jpg">`;

// Content for 1st article
var paragraphText1 = '<p>A wonderful city with a blend of the ancient and contemporary, Lucknow. As the center of North Indian culture and the arts and the seat of the Nawabs in the 18th and 19th centuries, the capital city of Uttar Pradesh has always been a cosmopolitan metropolis. It is still a significant hub for administration, business, education, medicine, pharmaceuticals, technology, design, culture, tourism, music, and poetry.</p>'
                    +'<p>Undoubtedly, the most significant area of Lucknow is its Central Business District, which includes Hazratganj, Aminabad, and Chowk. And in the first edition of Lucknow Diaries, we take a stroll around Hazratganj, the heart of the city and its primary retail district. Hazratganj, or simply \'Ganj\', was given its name in 1842. When the British conquered Lucknow in 1857 following the First War of Independence, they built Hazratganj to look like London\'s Queen Street. A complete redesign of Hazratganj took place in 2010. This came about after the area had been in use for approximately 200 years. A unified color palette was used for the buildings, and stone walkways and balustrades inspired by Victorian era design were installed to complement the structures.</p>' 
                    +img1_1 
                    +'<p align="center" style="margin-top: 0px;">(A shop of Lucknow’s famous Chikan Fabric) </p>'
                    +'<p>Shopping in Hazratganj is a must if you are a fan of the Victorian era. Storefronts, malls, hotels, cafes, restaurants, theaters, and workplaces are all located here. The popular Lucknow Chikan fabric may be found in stores located in Hazratganj. The Sahara Ganj Mall includes more than 425,000 square feet of retail space, making it one of India\'s largest malls. In Hazratganj, you will find Naza Market, which is the largest market for IT products in the state.</p>' 
                    +img1_2 
                    +'<p align="center" style="margin-top: 0px;">(zoo)</p>'
                    +'<p>Hazratganj is home to a large number of the city\'s well-known tourist attractions. The state museum, containing artifacts from the Awadh kingdom and a large zoo are both set at the Nawab Wajid Ali Shah Zoological Garden. One of the numerous Imambaras in Lucknow, the Sahah najaf Imambara functioned as the final Nawab of Awadh\'s mausoleum and is a replica of Ali\'s tomb in Najaf, Iraq. The National Botanical Research Institute, a paradise for individuals who love flowers, plants, and floral crafts, is located around the monument. This institute\'s mission is to investigate, propagate, conserve, and safeguard different Indian native plant species. It promises to be an interesting and educational experience to visit.</p>' 
                    +img1_3 
                    +'<p align="center" style="margin-top: 0px;">(The famous “basket chaat” at Royal Cafe, Hazratganj)</p>'
                    +'<p>Hazratganj is home to a plethora of excellent dining options, including the Royal Cafe, Moti Mahal, Aryan, Shukla Chaat Bhandaar, Tunde ke Kabab, Rover\'s, Mark\'s Man, Barista, Cafe Coffee Day, Pizza Hut, McDonald\'s, Domino\'s Pizza, Baskin Robbins, Yo! China, Subway, etc. Those who haven\'t tried the Kababs at Tundey Kababi are missing out (heard so from hundreds of people). Moti Mahal and Royal Cafe are two of the most famous hotspots.</p>'
                    +'<p>Hazratganj is the core of Lucknow and continues to be a favorite place to visit for both locals and visitors, in addition to being one of the busiest areas in the city. Anyone visiting the area will enjoy far more amazing events owing to the aura and vibes of the location. It is one of the answers for why we always hear Lucknowites say, "Muskuraiye, aap Lucknow mei hai."</p>'
                    +'<p align="right"><br><br>-Rishi Mahajan</p>';

// Content for 2nd article
var paragraphText2 = '<p>Exploring and traveling to a new place is always an enthralling experience. Many of us pick up items to remember our journeys by. A trinket, a model or a fridge magnet? This souvenir, usually a piece of art which is locally made, can ignite amazing memories and can be showcased or gifted to friends and family alike.</p>'
                    +'<p>India, like many other countries, boasts of a rich cultural heritage and is backed by its many local artworks which tourists and travelers appreciate. But increasing urbanization, and loss of recognition has driven local artisans out of a source of income, and this was something that had to be taken care of in the eyes of Ranodeep Saha. </p>'
                    +'<p>As he watched the pieces of art running out of flow, and the artisans not getting the spotlight they deserved, he took it upon himself to bridge the gap between the market and the artisans. Through this vision, Rare Planet took form. Connecting major retailers, the likes of Crossword, to local workers, Rare Planet became the channel through which craftsmen could appeal to a greater audience, and it also serves as an e-commerce platform for them.</p>'
                    +'<p>With startups like these, the fading indian heritage and culture has been rekindled with a new joy of hope and glimmer. Indian culture, known far and wide for its vibrance and diversity, is now being supported by the new youth and arts which would have been lost to time are being revived and publicized.</p>'
                    +'<p>Ranging from terracotta and pottery to the modern copper bottles, Rare Planet has tried to unite both the youth and adults. Breathing a new life into these art forms, Rare Planet has not only increased sales, but attracted the likes of Tata into investing in their startup. No doubt seeking out the right opportunity and working hard brings about success and Rare Planet is a live example!</p>'
                    +'<p>People are now more aware of the different cultures and forms of art originating from the various parts of the country. Be it Warli art or Madhubani, concealed Indian art forms have now achieved a global platform and are being recognised and appreciated by different parts of the world. These startups are a perfect example of grabbing the perfect opportunity while improving the lives of many. </p>'
                    +'<p>The call of culture is opening up eyes, with people getting encouraged to acquire local artifacts. With no limits in sight, niche Indian art forms are uncovering themselves and are being adopted and with more people getting to know about these handicrafts, there’s always an increasing demand, much to the delight of local artisans and craftsmen! When are you planning to treat yourself to one of these cultural gems?</p>'
                    +'<p align="right"><br><br>-Gaurav Kabra</p>';

// images for 3rd article
var img3_1 = `<img src="assets/card3_1.jpg">`;
var img3_2 = `<img src="assets/card3_2.jpg">`;
var img3_3 = `<img src="assets/card3_3.jpg">`;
var img3_4 = `<img src="assets/card3_4.jpg">`;

// Content for 3rd article
var paragraphText3 = '<p align="center" style="margin-bottom: 0px;">ANCIENT TECHNOLOGY</p>'
                    +'<p align="center" style="margin-top: 0px; margin-bottom: 0px;"><i> “The great growling engine of change – technology.” </i></p>'
                    +'<p align="right" style="margin-top: 0px; margin-bottom: 0px;"> – Alvin Toffler</p>'
                    +'<p><br>Nothing comes overnight, the technology that we have today is the hard work and endurance of our engineers and scientists. The history of technology dates back to the Stone Age. The ancient technology will leave you awe-struck, the way our ancient and medieval people used their wit and conscience to develop tools that helped them with their survival and safety is amazing to read about.</p>'
                    +'<p>All this began from the stone Age. I’ll take you back to the past and make you realize what wonderful things were built by people using ancient science and their conscience.</p>'
                    +'<p>All this began from the days people used stones to light fire, going to forests to hunt animals for their survival. What we usually hear about is how they lived their lives, but they actually discovered a lot of things (Ps : without actually knowing any Newton’s laws of motion or the law of gravitation). It was what their conscience told them but they were such intellectual people that their thinking had the power to drive them to something really curious that could change the world.</p>'
                    +'<p>Now I’ll mention a few fascinating examples of ancient technology that will increase your curiosity about learning about these old articles and monuments. </p>'
                    +'<p style="font-size: 1.1em;"><b>Antikythera Mechanism:</b></p>'
                    + img3_1
                    +'<p>Do you remember your physics teacher teaching you the concept of gears and levers and you thinking of who made all this boring stuff : mechanical advantage(MA), efficiency, etc. etc.Now let me tell you something interesting. We got to discover about these gears much later in reality. However, the first analog computer, the Antikythera mechanism was developed in the 18th century, when we weren’t even aware of differential gearing.</p>'
                    +'<p>There exist many such examples where the ancient people had already made such amazing stuff without understanding the science behind it. It is the first known geared device, oldest known scientific instrument.The Antikythera mechanism has at least 30 gears!</p>'
                    +'<p>All known fragments of the Antikythera mechanism are kept at the National Archeological Museum of Athens.</p>'
                    +'<p style="font-size: 1.1em;"><b>The Compass:</b></p>'
                    +img3_2 
                    +'<p>Before everyone had a GPS, the only way to get around was with a compass and a map. After it was invented, compass was used for divination and geomancy for centuries. Western compass has 32 defined points on its rose-of-winds. Eastern has 24 and 48 points. Old Arab compasses also had 32 points. Modern compasses are marked in degrees rather than cardinal points.The mariner\'s practice of boxing the compass is the action of naming all 32 points of the compass in a clockwise direction from The North.</p>'
                    +'<p style="font-size: 1.1em;"><b>Jantar Mantar:</b></p>' 
                    +img3_3 
                    +'<p>Dating back thousands of years, it has some amazing instruments.<br>A combination of different instruments(yantra) were used for the calculation of time, distances, declination and much more.<br>Despite being so old, it still has working instruments. Today it takes so much efforts to make such long lasting instruments. A lot of money and time is invested, however Jantar Mantar, not being so expensive, is still in working conditions, even after experiencing some calamities. That’s the beauty of our past.</p>'
                    +'<p style="font-size: 1.1em;"><b>Lycurgus Cup:</b></p>' 
                    +img3_4 
                    +'<p>Understanding total internal reflection and other mechanisms of glass and stones producing color appears to be very tedious. Scientists still struggle to understand a lot of the technology during the reign of The Roman Empire. For instance, the mysterious Lycurgus Cup isn’t a common chalice. <br>Discovered in the 1950s, the 4th-century Lycurgus Cup is possibly the first example of nanotechnology.The cup consists of dichroic glass, allowing it to change color depending on the angle at which the light hits it. With gold and silver particles, the chalice changes from solid green to translucent red when light passes through it. All this sounds so fascinating and  makes us bow before these super – intellectual beings from the past.</p>'
                    +'<p align="right"><br><br>-Shraddha Gulathi</p>';

// Content for 4th article
var paragraphText4 = '<p>One of the most extravagant villains in Hindu mythology, who has ten heads, twenty arms, a flying chariot, and a city of gold, Ravan. Ram\'s wife Sita was abducted by him, and he was killed as a result. The annual autumn ceremony honoring Ram\'s victory calls for the burning of the effigy of Ravan, the demon-king from the Ramayan and lord of the Rakshasas. However, the story of how Ram atoned for the sin of killing Ravan is told on the mountains of Rishikesh or in the Rameshwaram temple. Why should God make amends for killing a villain?</p>'
                    +'<p>One comes to the realization that the Ramayan is not the simplistic and monotonous epic that some would have you believe it to be. As the son of Rishi Vaishrava and grandson of Pulastya (one of the ten mind born sons of Brahma), Ravan was a Brahmin. Brahmin Ravan was the custodian of Brahma-gyan (the knowledge of God). Ram had to atone for the sin of Brahminicide—Brahma-hatya-paap—by performing penance.</p>'
                    +'<p>Ram supposedly told his brother Lakshman, "Go to Ravan swiftly before he dies and request him to share his knowledge and wisdom," after unleashing the fatal arrow on the battlefield of Lanka. Following his brother\'s instructions, Lakshman approached the head of the dying Ravan. Lakshman had to go back to Ram, because Ravan remained silent. Ram then advised Lakshman that one should always stand at a person\'s feet rather than their head while attempting to learn something from them.</p>'
                    +'<p>Lakshman visited Ravan once more, this time standing close to his feet. Considering Lakshman was worthy of his knowledge, gave him the Three Keys to Success. Ravan\'s initial message to Lakshman was that morally righteous actions should be carried out right away while immoral actions can wait. He also instructed Lakshman not to underestimate his adversaries. He claimed that he lost the battle with the bears and monkeys because he made the error of thinking they were weaker or less capable than humans. He made a mistake by doing this, and it cost him his life. Ravan\'s third and final advice to Lakshman was to keep all your personal information to yourself. Ravan erred again in this situation since Vibhishan was aware of the cause of his demise. Ravan was aware that this was his life’s major blunder.</p>'
                    +'<p>This tale from the epic serves as a reminder that acquiring knowledge is harder than acquiring wealth. We leave our worldly possessions behind when we pass away, but we take our intellectual possessions along with us. Lakshmi can be passively left behind, but Saraswati cannot.</p>'
                    +'<p align="right"><br><br>-Rishi Mahajan</p>';

// images for 5th article
var img1 = `<img src="https://i.pinimg.com/originals/04/af/54/04af5464dad30ab94d8272b82705fa06.jpg">`;
var img2 = `<img src="https://i.pinimg.com/originals/ff/3e/53/ff3e53b43a5d02f8f589c1f19c7bac5b.jpg">`;
var img3 = `<img src="https://i.pinimg.com/originals/b3/fd/e6/b3fde6077c4f580cd6e07a437e660608.jpg">`;
var img4 = `<img src="https://images.firstpost.com/wp-content/uploads/2018/11/nizam-jewels-1280.jpg">`;
var img5 = `<img src="https://i.pinimg.com/originals/ef/3e/17/ef3e17ac7fe005dfd1edd3a61920c407.jpg">`;
var img6 = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Renaldis_muslin_woman.jpg/500px-Renaldis_muslin_woman.jpg">`;
var img7 = `<img src="https://i0.wp.com/www.socialnews.xyz/wp-content/uploads/2021/07/13/fda64512a21738c478f996d368b6ea8d.jpg?quality=80&zoom=1&ssl=1">`;
var img8 = `<img src="https://i.pinimg.com/originals/ff/3e/53/ff3e53b43a5d02f8f589c1f19c7bac5b.jpg" style="height: 400px; width: auto;">`;
var img9 = `<img src="https://i.pinimg.com/originals/04/af/54/04af5464dad30ab94d8272b82705fa06.jpg" style="height: 400px; width: auto;">`;
var img10 = `<img src="https://i.pinimg.com/originals/b3/fd/e6/b3fde6077c4f580cd6e07a437e660608.jpg" style="height: 400px; width: auto;">`;
var img11 = `<img src="https://image.wedmegood.com/resized-nw/600X/wp-content/uploads/2021/01/92233192_506438050028684_1072933215696211706_n.jpg" style="height: 400px; width: auto;">`;
var img12 = `<img src="https://images.firstpost.com/wp-content/uploads/2018/11/nizam-jewels-1280.jpg" style="height: 400px; width: auto;">`;
var img13 = `<img src="https://i.pinimg.com/originals/ef/3e/17/ef3e17ac7fe005dfd1edd3a61920c407.jpg" style="height: 400px; width: auto;">`;
var img14 = `<img src="https://i.pinimg.com/236x/bf/a7/bb/bfa7bb621db74e88c26b02c2fe3dbadd.jpg" style="height: 400px; width: auto;">`;
var img15 = `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Renaldis_muslin_woman.jpg/500px-Renaldis_muslin_woman.jpg" style="height: 400px; width: auto;">`;
var img16 = `<img src="https://i0.wp.com/www.socialnews.xyz/wp-content/uploads/2021/07/13/fda64512a21738c478f996d368b6ea8d.jpg?quality=80&zoom=1&ssl=1" style="height: 400px; width: auto;">`;

// Content for 5th article
var paragraphText5 = '<p>The great centuries of kings and queens bring to mind majestic castles and forts, exquisite arts and music, expensive meals, and, of course, fantastic clothes and fashion. The Mughals, Marathas, Scindia, and Rajputana each left their mark on India\'s history. Many royal families still dress and memorize centuries-old traditions. Their superb tailoring and textile skills created India\'s famed fashion tradition.</p>'
                    + img1 
                    + '<p>Mewar rules Udaipur. Rajasthani paintings show Udaipur Maharanas\' splendor. Royals use parasols called Kirnia. Maharanas of Udaipur wear western bandh galas. Former Maharanas wore a turban or pagri with a long sarpech-embellished tail, achkans with churidar pants, a sash over the body, and a belt or kamar bandh around the waist. In an extravagant costume, a sheathed sword symbolizes authority and patriotism. Their legacy range comprises French-designed diamonds. Gem-encrusted clothes adorn royal elephants and ponies.</p>'
                    + img2 
                    + '<p>Wadiyars governed Mysore 1399-1950. Anyone meeting the Wadiyar ruler at Durbaar wore the Durbaar attire. The clothes were supposed to reflect social standing and hierarchy. Black coats and white churidars were worn. Mysore Turbans had peta lace. Men wore royal-looking dhotis with gold zari embroidery. Embroidered silk sarees were worn. Wadiyar styles still affect men\'s attire, especially churidaar pants and long kurtas. Women across the country love embroidered silk sarees.</p><p>Scindia held Gwalior and is another notable Hindu Maratha family. Only Scindia\'s royal family can wear the nation\'s distinctive headpiece. In the 16th and 17th centuries, men wore Anga, a brocade and silk kurta that resembled a coat, with a sheathed sword and pagdi. This was the norm during festivities. Marathi women wore ornate jewellery and silk sarees. Shindeshahi Pagadi, the royal family\'s boat-shaped pagdi, is a symbol of their position.</p>' 
                    + img3 
                    + '<p>Nizam-ul-Mulk governed Hyderabad, India. Mughal rulers designated the first Nizam. Nizams loved art. Nizams were proud of their distinctive, expensive jewellery. Nizam\'s most recognisable style features exquisite pearl and diamond sets. Nizam wore a sherwani and sarpech. Nizam\'s designs influence bridal jewellery, especially diamonds and pearls.</p>' 
                    + img4 
                    + '<p>Mughal art and design influenced India. Mughal clothes had exquisite designs and needlework. Popular textiles included silk, velvet, brocade, and muslin. Men wore short and long robes, including sleeveless chogha. Men wore pagris on their heads, patkas around their waists, and pajama-like pants. Their turbans were adorned with diamonds, pearls, and rubies.</p>'
                    + img5 
                    + '<p>Women wore traditional Persia and Khurasan clothes under Purdah. Most noblewomen in Humayun and Babar\'s courts wore baggy pants. Deep V neckline, flowy upper body. Women wore gold-feather turbans. Women wore jewel-encrusted shoes with pointed, curled toes. Men and women wore jewels. Bejeweled turbans, earrings, pearl necklaces, armlets, bangles, bracelets, rings, thumb rings, pearl or metal anklets, and sun, moon, star, or flower head ornaments were among the eight full sets of jewellery ladies wore. Popular Mughal ear ornaments were Jhumkas, Kanphool, Bali, Mor-Bhanwar, and Pipal Patra. Clothes incorporated silk, wool, and cotton. Wool, pashmina, tush, and tus were additional lightweight materials worn at the time. The silk clothes were embroidered in silver and gold. These dainty shawls may fit through a ring.</p>'
                    + img6
                    + '<p>The fairytale account of the Spanish woman who became Indian queen. Her choice in Indian dress and accessories makes her a well-known queen. Pink lehenga with silver and gold embroidery was worn by Maharani of Kapurthala. Her diary contained such evidence. Her sarees and jewellery were luxurious. Pinks, maroons, and reds were common sari colors. Brocade embroidery and gold zari showed off her affluence. All they needed was a pallu to be Maharani-worthy. The Maharani wore elegant Victorian-style long silk dresses with off-the-shoulder patterns. Her emeralds, rubies, and diamonds were exquisite. Her jewellery, earrings, and bracelets emanated grandeur.</p><p>The Holkars derive from the Holkar dynasty, which controlled the Hindu Marathas. First as Maratha Rajas (Kings), then as Indore Maharajas (Princes). Their collection of diamonds and jewellery is world-famous. Maharaja Yashwant Rao, Richard Sivaji Rao Holkar, and his American wife, Sally, had renowned French jewelers restore the Maheshwari sarees. Holkar monarchs wore angas, turbans or pagdis, scabbards, and jewels. The Holkar queen wore jewel-encrusted Maheshwari sarees.</p>' 
                    + img7 
                    + '<p>India is a heterogeneous country, and its diversity is reflected in its traditional clothing and wearing styles, which vary widely from state to state. It has passed from one subculture to another since prehistoric times, and Harappa and Mohenjo-daro show that Indians have always had a good sense of dress. Fashion, like history, repeats itself. Designers sometimes recreate Indian culture to emphasize royal position.</p>'
                    + '<p><b>IMAGES:</b></p>'
                    + '<p>Maharana of Udaipur :- </p>' 
                    + img8
                    + '<p><br><br>Maharani of  Udaipur :-</p>'
                    + img9 
                    + '<p><br><br>Shinde of Gwalior :- </p>' 
                    + img10 
                    + img11 
                    + '<p><br><br>Nizam of Hyderabad:- </p>' 
                    + img12 
                    + '<p><br><br>Mughals Badshah:- </p>' 
                    + img13 
                    + '<p><br><br>Mughal Begam pic1:- </p>' 
                    + img14 
                    + '<p><br><br>Mughal Begam pic2:- </p>' 
                    + img15 
                    + '<p><br><br>Holakars:-  </p>' 
                    + img16 
                    + '<p align="right"><br><br>-Apoorva Kothari</p>';
