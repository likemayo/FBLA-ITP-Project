// play section variables 

let play = document.getElementById("play");
let playButton = document.getElementById("playButton");


// input section variables

const input = document.getElementById("input");
const userName = document.getElementById("userName");
const petName = document.getElementById("petName");
const petType = document.getElementById("petType");
const savingsGoal = document.getElementById("savingsGoal");
const submitInputs = document.getElementById("submitInputs");

// game section variables

let game = document.getElementById("game");

let hungerStats = document.getElementById("hungerStats");
let hunger = 0;

let happinessStats = document.getElementById("happinessStats");
let happiness = 100;

let energyStats = document.getElementById("energyStats");
let energy = 100;

let cleanlinessStats = document.getElementById("cleanlinessStats");
let cleanliness = 100;

let healthStats = document.getElementById("healthStats");
let health = 100;

let ageStats = document.getElementById("ageStats");
let age = 0;

const petEmojis = {
    'Dog': '🐕',
    'Cat': '🐈',
    'Rabbit': '🐰',
    'Turtle': '🐢',
    'Bird': '🐦'
};

let userNameDisplay = document.getElementById("userNameDisplay");
let petNameDisplay = document.getElementById("petNameDisplay");
let moneySaved = document.getElementById("moneySaved");
let goal = document.getElementById("goal");
let money = 10;


// action button variables

let feedBtn = document.getElementById("feedBtn");
let playBtn = document.getElementById("playBtn");
let restBtn = document.getElementById("restBtn");
let cleanBtn = document.getElementById("cleanBtn");
let vetBtn = document.getElementById("vetBtn");
let choresBtn = document.getElementById("choresBtn");

let logArea = document.getElementById("logArea");

// load DOM content first before running any onclick functions tot enure there's no issues

document.addEventListener("DOMContentLoaded", function(){

    // directs user to sign in section
    playButton.onclick = function(){

        const hasSavedGame = loadGame();

        if (hasSavedGame) {
            // ask user if they want to continue
            const continueGame = confirm("Found a saved game! Continue where you left off?");

            if (continueGame) {
                // skip input screen, go straight to game
                applyLoadedState(hasSavedGame);

                play.classList.add("hide");
                play.classList.remove('show');
                input.classList.add('hide');
                game.classList.add("show");

                // display loaded state

                userNameDisplay.textContent = "Hello, " + (userName.value || '').trim();
                petNameDisplay.textContent = (petName.value || '').trim();

                updateStats();
            } else {
                // directs user to sign in section 
                userName.value = '';
                petName.value = '';
                petType.value = '';
                savingsGoal.value = '';


                play.classList.add('hide');
                input.classList.remove('hide');
                input.classList.add('show');
            }
        } else {
            // if no saved game is found

            play.classList.add("hide");
            input.classList.remove('hide');
            input.classList.add('show');
        }
    }

    // submits username, pet name, etc.
    submitInputs.onclick = function() {

        if (!validateInputs()) {
            return;
        }
        
        userNameDisplay.textContent = "Hello, " + userName.value;
        petNameDisplay.textContent = petName.value;

        let percent = money / parseInt(savingsGoal.value) * 100;

        moneySaved.textContent = "Money saved: $" + money;
        goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";
        input.classList.remove('show');
        input.classList.add('hide');
        game.classList.remove('hide');
        game.classList.add('show');

        hungerStats.textContent = "Hunger: " + hunger + "%";
        happinessStats.textContent = "Happiness: " + happiness + "%";
        energyStats.textContent = "Energy: " + energy + "%";
        cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
        healthStats.textContent = "Health: " + health + "%";
        ageStats.textContent = "Age: " + age + " years";

        updatePetReaction();
        saveGame();

        const decayInterval = setInterval(applyPassiveDecay, 5000);

        window.gameDecayInterval = decayInterval;
        }

    // action buttons

    // feeds pet
    feedBtn.onclick = function() {
        // first checks if player has enough money
        if (money >= 5) {
            money -= 5;
            hunger = Math.max(0, hunger - 20);
            happiness += 5;
            log("You fed your pet. -$5");
        } else {
            log("Not enough money to feed your pet.");
        }

        // updates stats immediately after
        updateStats();
    };

    // plays with pet

    playBtn.onclick = function(){
        if (money >= 2) {
            money -= 2;
            happiness += 15;
            energy -= 10;
            log("You played with your pet. -$2");
        } else {
            log("Not enough money to play.");
        }

        // updates stats immediately after
        updateStats();
    }

    restBtn.onclick = function() {
        energy = Math.min(100, energy + 20);
        happiness -= 5;
        log("You pet took a rest.");

        // updates stats immediately after
        updateStats();
    }

    cleanBtn.onclick = function() {
        if (money >= 2) {
            money -= 2;

            health = Math.min(100, health + 3);

            cleanliness = Math.min(100, cleanliness + 5);

            log("You cleaned your pet. -$2");
        } else {
            log("Not enough money to clean your pet.");
        }

        // updates stats immediately after
        updateStats();
    };

    vetBtn.onclick = function() {
        if (money >= 20) {
            money -= 20;
            happiness = Math.min(100, health + 40);
            
            cleanliness = Math.min(100, cleanliness + 10);
            log("You visited the vet. - $20");
        } else {
            log("Not enough money for a vet visit");

        }
        // updates stats immediately after
        updateStats();
    };

    let choresCooldown = false;
    choresBtn.onclick = function() {

        if (choresCooldown){
            log("Chores are on cooldown. Try again soon!");
            return;
        }
        money += 10;
        happiness = Math.min(100, happiness + 3);
        log("You did your chores. +$10");

        updateStats();
        
        choresCooldown = true;

        let timeLeft = 60;
        choresBtn.textContent = `Chores (${timeLeft}s)`;

        let timer = setInterval(() => {
            timeLeft --;
            choresBtn.textContent = `Chores (${timeLeft}s)`;

            if (timeLeft <= 0){
                clearInterval(timer);
                choresCooldown = false;
                choresBtn.textContent = "Chores (+$10)";
            }
        }, 1000);

    };

    const resetBtn = document.getElementById("resetBtn");
    resetBtn.onclick = resetGame;

});

// shows error under input label in case of invalid inputs
function showError(inputElement, errorElement, message){
    inputElement.classList.add('error');
    errorElement.textContent = message;
    }

// clears error once input is valid
function clearError(inputElement, errorElement) {
    inputElement.classList.remove('error');
    errorElement.textContent = '';
}

function validateInputs() {

    const userNameError = document.getElementById('userNameError');
    const petNameError = document.getElementById('petNameError');
    const petTypeError = document.getElementById('petTypeError');
    const savingsGoalError = document.getElementById('savingsGoalError');
    const goalVal = parseFloat(savingsGoal.value);

    clearError(userName, userNameError);
    clearError(petName, petNameError);
    clearError(petType, petTypeError);
    clearError(savingsGoal, savingsGoalError);

    let isValid = true;

    // username validation
    const trimmedUserName = userName.value.trim();

    if (trimmedUserName === ''){
        showError(userName, userNameError, 'Name is required');
        isValid = false;
    } else if (trimmedUserName.length > 24) {
        showError(userName, userNameError, 'Name must be 24 characters or less');
        isValid = false;
    }

    // pet name validation

    const trimmedPetName = petName.value.trim()

    if (trimmedPetName === ''){
        showError(petName, petNameError, 'Pet name is required');
        isValid = false;
    } else if (trimmedPetName.length > 24) {
        showError(petName, petNameError, 'Pet name must be 24 characters or less');
        isValid = true;
    }

    // pet type validation

    if (petType.value === '') {
        showError(petType, petTypeError, 'Please select pet type');
        isValid = false;
    }
    // goal validation

    if (savingsGoal.value === '' || isNaN(goalVal)){
        showError(savingsGoal, savingsGoalError, "Savings goal must be a number");
        isValid = false;
    } else if (goalVal < 1){
        showError(savingsGoal, savingsGoalError, "Goal must be at least $1");
        isValid = false;
    } else if (goalVal > 500) {
        showError(savingsGoal, savingsGoalError, "Goal must be less than or equal to $500");
        isValid = false;
    }
    return isValid;

}

// pet reactions

// gets pet reaction based on stats
function getPetEmotion() {
    if (health <= 30) {
        return { emotion: 'sick', emoji: '🤒', status: 'Your pet is very sick!' };
    }
    if (hunger >= 80) {
        return { emotion: 'hungry', emoji: '😫', status: 'Your pet is starving!' };
    }
    if (energy <= 20) {
        return { emotion: 'tired', emoji: '😴', status: 'Your pet is exhausted.' };
    }
    if (happiness <= 40 || health <= 40) {
        return { emotion: 'sad', emoji: '😢', status: 'Your pet is sad.' };
    }
    if (energy >= 85 && happiness >= 75) {
        return { emotion: 'energetic', emoji: '🤩', status: 'Your pet is full of energy!' };
    }
    if (happiness >= 80 && energy >= 70 && hunger <= 30) {
        return { emotion: 'happy', emoji: '😊', status: 'Your pet is very happy!' };
    }
    return { emotion: 'neutral', emoji: '🙂', status: 'Your pet is okay.' };
}

function updatePetReaction() {
    const petEmojiEl = document.getElementById('petEmoji');
    const emotionEmojiEl = document.getElementById('emotionEmoji');
    const petStatusEl = document.getElementById('petStatus');
    
    const reaction = getPetEmotion();
    
    // Show pet type emoji (big)
    petEmojiEl.textContent = petEmojis[petType.value] || '🐾';
    // Show emotion emoji (smaller)
    emotionEmojiEl.textContent = reaction.emoji;
    // Show status
    petStatusEl.textContent = reaction.status;
    
    // Apply background color
    const petReactionDiv = document.getElementById('petReaction');
    petReactionDiv.className = '';
    petReactionDiv.classList.add(reaction.emotion);
}


// functions to update screen

// updates stats, amount of money, and percent of money saved
function updateStats() {
    hungerStats.textContent = "Hunger: " + hunger + "%";
    happinessStats.textContent = "Happiness: " + happiness + "%";
    energyStats.textContent = "Energy: " + energy + "%";
    cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
    healthStats.textContent = "Health: " + health + "%";
    ageStats.textContent = "Age: " + age + " years";
    
    
    let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
    moneySaved.textContent = "Money saved: $" + money;
    goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";
    updatePetReaction();
    saveGame();
}

// logs which action buttons were pressed
function log(message) {
    let entry = document.createElement("p");
    entry.textContent = message;
    logArea.appendChild(entry);
    logArea.scrollTop = logArea.scrollHeight;
}

// --------------------------------- persistence (local storage) ------------------

function loadGame() {
    try {
        const raw = localStorage.getItem('petGameState');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('Could not load game state:', e);
        return null;
    }
}

function saveGame(){

    const gameState = {
        userName: userName.value,
        petName: petName.value,
        petType: petType.value,
        savingsGoal: savingsGoal.value,
        money: money,
        hunger: hunger,
        happiness: happiness,
        energy: energy,
        cleanliness: cleanliness,
        health: health,
        age: age
    }

    try {
        localStorage.setItem('petGameState', JSON.stringify(gameState));
    } catch (e) {
        console.warn("Could not save game state: ", e)
    }
}

function resetGame() {
    const sure = confirm("Are you sure you want to reset the game and delete saved progress?")

    if (!sure) return;

    try { localStorage.removeItem('petGameState'); } catch (_) {}

    money = 10;
    hunger = 0;
    happiness = 100;
    cleanliness = 100;
    health = 100;
    energy = 100;
    age = 0;

    userName.value = '';
    petName.value = '';
    petType.value = '';
    savingsGoal.value = '';

    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    if (logArea) logArea.innerHTML = '';
    if (typeof choresBtn !== 'undefined' && choresBtn){
        choresBtn.textContent = 'Chores (+$10)';
    }

    const petReactionDiv = document.getElementById('petReaction')

    if (petReactionDiv) {
        petReactionDiv.className = '';
        const petEmojiEl = document.getElementById("petEmoji");
        const emotionEmojiEl = document.getElementById("emotionEmoji");
        const petTypeDisplay = document.getElementById("petTypeDisplay");
        const petStatusEl = document.getElementById("petStatus");

        if (petEmojiEl) petEmojiEl.textContent = '🐾';
        if (emotionEmojiEl) emotionEmojiEl.textContent = '🙂';
        if (petTypeDisplay) petTypeDisplay.textContent = '';
        if (petStatusEl) petStatusEl.textContent = 'Your pet is okay.';
    }

    game.classList.remove('show');
    game.classList.add('hide');
    input.classList.add('hide');
    input.classList.add('hide');
    play.classList.remove('hide');

    if (window.gameDecayInterval) {
        clearInterval(window.gameDecayInterval);
        window.gameDecayInterval = null;
    }
}

function applyLoadedState(s){
    userName.value = s.userName || '';
    petName.value = s.petName || '';
    petType.value = s.petType || '';
    savingsGoal.value = s.savingsGoal || '';

    money = typeof s.money === 'number' ? s.money : 10;
    hunger = typeof s.hunger === 'number' ? s.hunger : 0;
    happiness = typeof s.happiness === 'number' ? s.happiness : 100;
    energy = typeof s.energy === 'number' ? s.energy : 100;
    cleanliness = typeof s.cleanliness === 'number' ? s.cleanliness : 100;
    health = typeof s.health === 'number' ? s.health : 100;
    age = typeof s.age === 'number' ? s.age : 0;
}

function applyPassiveDecay() {

    hunger = Math.min(100, hunger + 2);

    energy = Math.max(0, energy - 1);

    happiness = Math.max(0, happiness - 1);

    cleanliness = Math.max(0, cleanliness - 0.5);

    if (hunger >= 85 || energy <= 15 || happiness <= 20 || cleanliness <= 20) {
        health = Math.max(0, health - 3);
    }

    updateStats();
}