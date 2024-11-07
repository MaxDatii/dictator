let xp = 0;
let health = 100;
let influence = 50;
let currentWeapon = 0;
let fighting;
let mobsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const influenceText = document.querySelector("#influenceText");
const mobsterStats = document.querySelector("#mobsterStats");
const mobsterName = document.querySelector("#mobsterName");
const mobsterHealthText = document.querySelector("#mobsterHealth");
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];
const mobsters = [
  {
    name: "corruptionist",
    level: 2,
    health: 15
  },
  {
    name: "mobster",
    level: 8,
    health: 60
  },
  {
    name: "dictator",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to bunker", "Fight dictator"],
    "button functions": [goStore, gobunker, fightDictator],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 infl.)", "Buy weapon (30 infl.)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "bunker",
    "button text": ["Fight corruptionist", "Fight mobster", "Go to town square"],
    "button functions": [fightCorruptionist, fightMobster, goTown],
    text: "You enter the bunker. You see some mobsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a mobster."
  },
  {
    name: "kill mobster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The mobster screams "Arg!" as it dies. You gain experience points and influence.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dictator! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = gobunker;
button3.onclick = fightDictator;

function update(location) {
  mobsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function gobunker() {
  update(locations[2]);
}

function buyHealth() {
  if (influence >= 10) {
    influence -= 10;
    health += 10;
    influenceText.innerText = influence;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough influence to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (influence >= 30) {
      influence -= 30;
      currentWeapon++;
      influenceText.innerText = influence;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough influence to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 influence";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    influence += 15;
    influenceText.innerText = influence;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightCorruptionist() {
  fighting = 0;
  goFight();
}

function fightMobster() {
  fighting = 1;
  goFight();
}

function fightDictator() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  mobsterHealth = mobsters[fighting].health;
  mobsterStats.style.display = "block";
  mobsterName.innerText = mobsters[fighting].name;
  mobsterHealthText.innerText = mobsterHealth;
}

function attack() {
  text.innerText = "The " + mobsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMobsterAttackValue(mobsters[fighting].level);
  if (isMobsterHit()) {
    mobsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  mobsterHealthText.innerText = mobsterHealth;
  if (health <= 0) {
    lose();
  } else if (mobsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMobster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMobsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMobsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + mobsters[fighting].name;
}

function defeatMobster() {
  influence += Math.floor(mobsters[fighting].level * 6.7);
  xp += mobsters[fighting].level;
  influenceText.innerText = influence;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  influence = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  influenceText.innerText = influence;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 influence!";
    influence += 20;
    influenceText.innerText = influence;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}