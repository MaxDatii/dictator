let xp = 0;
let health = 100;
let influence = 50;
let currentWeapon = 0;
let fighting;
let villainHealth;
let inventory = ["arguments"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const influenceText = document.querySelector("#influenceText");
const villainStats = document.querySelector("#villainStats");
const villainName = document.querySelector("#villainName");
const villainHealthText = document.querySelector("#villainHealth");
const weapons = [
  { name: ' arguments', power: 5 },
  { name: ' facts', power: 30 },
  { name: ' hammer of truth', power: 50 },
  { name: ' sword of justice', power: 100 }
];
const villains = [
  {
    name: "corruptionist",
    level: 2,
    health: 15
  },
  {
    name: "propagandist",
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
    "button text": ["Fight corruptionist", "Fight propagandist", "Go to town square"],
    "button functions": [fightCorruptionist, fightPropagandist, goTown],
    text: "You enter the bunker. You see some villains."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a villain."
  },
  {
    name: "kill villain",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The villain screams "Arg!" as it dies. You gain experience points and influence.'
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
  villainStats.style.display = "none";
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
      text.innerText = "You now have " + newWeapon + ".";
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

function fightPropagandist() {
  fighting = 1;
  goFight();
}

function fightDictator() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  villainHealth = villains[fighting].health;
  villainStats.style.display = "block";
  villainName.innerText = villains[fighting].name;
  villainHealthText.innerText = villainHealth;
}

function attack() {
  text.innerText = "The " + villains[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getVillainAttackValue(villains[fighting].level);
  if (isVillainHit()) {
    villainHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  villainHealthText.innerText = villainHealth;
  if (health <= 0) {
    lose();
  } else if (villainHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatVillain();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getVillainAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isVillainHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + villains[fighting].name;
}

function defeatVillain() {
  influence += Math.floor(villains[fighting].level * 6.7);
  xp += villains[fighting].level;
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
  inventory = ["arguments"];
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