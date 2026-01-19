// play section variables 

let play = document.getElementById("play");
let playButton = document.getElementById("playButton");
let background = document.getElementById("backgroundImage");


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

// --------------------------------------------- pet life stages ------------------------------------------
const petEmojis = {
    'Dog': '🐕',
    'Cat': '🐈',
    'Rabbit': '🐰',
    'Turtle': '🐢',
    'Bird': '🐦'
};

const petLifeStages = {
    baby: { min: 0, max: 4, label: 'Baby' },
    young: { min: 5, max: 9, label: 'Young' },
    adult: { min: 10, max: 19, label: 'Adult' },
    senior: { min: 20, max: 100, label: 'Senior' }
};

function getPetLifeStage() {
    for (const [key, stage] of Object.entries(petLifeStages)) {
        if (age >= stage.min && age <= stage.max) {
            return stage;
        }
    }
    return petLifeStages.adult;
}

const petStageEmojis = {
    'Dog': {
        'Baby': '🐶',
        'Young': '🐕‍🦺',
        'Adult': '🐕',
        'Senior': '🐕'
    },
    'Cat': {
        'Baby': '🐱',
        'Young': '🐈',
        'Adult': '🐈‍⬛',
        'Senior': '🐈'
    },
    'Rabbit': {
        'Baby': '🐰',
        'Young': '🐇',
        'Adult': '🐰',
        'Senior': '🐇'
    },
    'Turtle': {
        'Baby': '🥚',
        'Young': '🐢',
        'Adult': '🐢',
        'Senior': '🐢'
    },
    'Bird': {
        'Baby': '🐣',
        'Young': '🐦',
        'Adult': '🦅',
        'Senior': '🐦'
    }
};

let lastLoggedStage = "Baby";

function getPetStageEmoji() {
    const currentStage = getPetLifeStage();
    const petType = petType.value;
    
    const emoji = petStageEmojis[petType] && petStageEmojis[petType][currentStage.label];
    
    return emoji || '🐾';
}

function checkLifeStageMilestone() {
    const currentStage = getPetLifeStage();
    // ← CAPITAL B: 'Baby' vs 'Baby' ✓
    if (currentStage.label !== lastLoggedStage) {
        lastLoggedStage = currentStage.label;
        log(`🎉 Your pet is now a ${currentStage.label}!`);
    }
}


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

// budget report section

let expenses = {
    food: 0,
    entertainment: 0,
    hygiene: 0,
    healthcare: 0

}

// load DOM content first before running any onclick functions tot enure there's no issues

document.addEventListener("DOMContentLoaded", function(){
    setTimeout(delayBackgroundImage, 3000);
    setTimeout(delayPlayButton, 6000);  
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

                const decayInterval = setInterval(applyPassiveDecay, 5000);
                window.gameDecayInterval = decayInterval;
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
            expenses.food += 5;
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
            expenses.entertainment += 2;
            log("You played with your pet. -$2");
        } else {
            log("Not enough money to play.");
        }

        // updates stats immediately after
        updateStats();
    }

    // allows pet to rest and raise energy
    restBtn.onclick = function() {
        energy = Math.min(100, energy + 20);
        happiness -= 5;
        log("You pet took a rest.");

        // updates stats immediately after
        updateStats();
    }

    // cleans pet

    cleanBtn.onclick = function() {
        if (money >= 2) {
            money -= 2;

            health = Math.min(100, health + 3);
            expenses.hygiene += 2;

            cleanliness = Math.min(100, cleanliness + 5);

            log("You cleaned your pet. -$2");
        } else {
            log("Not enough money to clean your pet.");
        }

        // updates stats immediately after
        updateStats();
    };

    // heals pet by 20%, but also costs lots of money
    vetBtn.onclick = function() {
        if (money >= 20) {
            money -= 20;
            happiness = Math.min(100, health + 40);
            expenses.healthcare += 20;
            
            cleanliness = Math.min(100, cleanliness + 10);
            log("You visited the vet. - $20");
        } else {
            log("Not enough money for a vet visit");

        }
        // updates stats immediately after
        updateStats();
    };

    // cooldown after earning $10 from doing chores
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

    const viewReportBtn = document.getElementById('viewReportBtn');
    const backToGameBtn = document.getElementById('backToGameBtn');
    const report = document.getElementById('report');

    if (viewReportBtn) {
        viewReportBtn.onclick = showReport;

    }

    if (backToGameBtn) {
        backToGameBtn.onclick = hideReport;
    }

});

// ----------------------------------------- DELAYING PLAY SCREEN ----------------------
function delayBackgroundImage(){
    background.style.display = "block";

    setTimeout(() => {
        background.style.opacity = "1";
    }, 150); // allows for the background image to fade into view
}
function delayPlayButton(){
    playButton.style.display = 'block';

    setTimeout(() => {
        playButton.style.opacity = "1";
    }, 150); // allows for play button to fade into view shortly after
}
// ----------------------------------------- ERROR FUNCTIONS ----------------------
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

// ------------------------------------- VALIDATE INPUTS -------------------------

// makes sure that the inputs are valid before allowing the user to proceed
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

// ------------------------------------- PET REACTIONS ----------------------------

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

// updates pet reaction (similar to update stats, called in update stats)
function updatePetReaction() {
    const petReactionDiv = document.getElementById('petReaction');
    const petEmojiEl = document.getElementById('petEmoji');
    const emotionEmojiEl = document.getElementById('emotionEmoji');
    const petTypeDisplay = document.getElementById('petTypeDisplay');
    const petStatusEl = document.getElementById('petStatus');

    if (!petReactionDiv) return;

    const reaction = getPetEmotion();
    const lifeStage = getPetLifeStage();

    // Show stage-specific emoji
    petEmojiEl.textContent = getPetStageEmoji();
    emotionEmojiEl.textContent = reaction.emoji;
    
    petTypeDisplay.textContent = `${petType.value} (${lifeStage.label})`;
    petStatusEl.textContent = reaction.status;

    petReactionDiv.className = '';
    petReactionDiv.classList.add(reaction.emotion);
}


// --------------------------------- UPDATING STATS ---------------------------------

// updates stats, amount of money, and percent of money saved
function updateStats() {
    hungerStats.textContent = "Hunger: " + hunger + "%";
    happinessStats.textContent = "Happiness: " + happiness + "%";
    energyStats.textContent = "Energy: " + energy + "%";
    cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
    healthStats.textContent = "Health: " + health + "%";
    ageStats.textContent = "Age: " + age + " days";
    
    
    let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
    moneySaved.textContent = "Money saved: $" + money;
    goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";
    updatePetReaction();
    saveGame();

    checkLifeStageMilestone();
}

// logs which action buttons were pressed and displays it for user
function log(message) {
    let entry = document.createElement("p");
    entry.textContent = message;
    logArea.appendChild(entry);
    logArea.scrollTop = logArea.scrollHeight;
}

// reduces/increases certain stats based on time elapse

function applyPassiveDecay() {
    hunger = Math.min(100, hunger + 2);
    energy = Math.max(0, energy - 1);
    happiness = Math.max(0, happiness - 1);
    cleanliness = Math.max(0, cleanliness - 0.5);

    if (hunger >= 85 || energy <= 15 || happiness <= 20 || cleanliness <= 20) {
        health = Math.max(0, health - 3);
    }
    age += 1;

    updateStats();
}

// ------------------------------------- PERSISTENCE (LOCAL STORAGE) -----------------------

// loads game based on data locally saved from previous visits the user has made to the app
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


// saves the stats/data of the user in a dictionary and compresses it into a string before the user leaves the page
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
        age: age,
        lastLoggedStage: lastLoggedStage,
        expenses: expenses
    }

    try {
        localStorage.setItem('petGameState', JSON.stringify(gameState));
    } catch (e) {
        console.warn("Could not save game state: ", e)
    }
}

// deletes any saved data in case user wants a fresh start
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
    lastLoggedStage = 'Baby';

    expenses = {
        food: 0,
        healthcare: 0,
        hygiene: 0,
        entertainment: 0
    }

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

// loads the data of the user (called if the user tries to proceed to sign in screen with another game saved)
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
    lastLoggedStage = typeof s.lastLoggedStage === "string" ? s.lastLoggedStage : "Baby";

    if (s.expenses) {
        expenses.food = s.expenses.food || 0;
        expenses.healthcare = s.expenses.healthcare || 0;
        expenses.hygiene = s.expenses.hygiene || 0;
        expenses.entertainment = s.expenses.entertainment || 0;
    }
}

// ---------------------------------- BUDGET REPORT FUNCTIONS -----------------------------------------

// creates a budget report for user based on game play
function updateBudgetReport() {
    const totalSpent = expenses.food + expenses.healthcare + expenses.hygiene + expenses.entertainment;
    const totalEarned = (money + totalSpent) - 10;
    
    document.getElementById('totalSpent').textContent = `Total Spent: $${totalSpent}`;
    document.getElementById('earnedAmount').textContent = totalEarned;
    
    updateCategoryDisplay('food', expenses.food, totalSpent);
    updateCategoryDisplay('healthcare', expenses.healthcare, totalSpent);
    updateCategoryDisplay('hygiene', expenses.hygiene, totalSpent);
    updateCategoryDisplay('entertainment', expenses.entertainment, totalSpent);
}
function updateCategoryDisplay(category, amount, total) {
    const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
    document.getElementById(`${category}Amount`).textContent = `$${amount}`;
    document.getElementById(`${category}Percent`).textContent = percent;
    document.getElementById(`${category}Bar`).style.width = `${percent}%`;
}

// shows report and hides game
function showReport() {
    updateBudgetReport();
    const report = document.getElementById("report");

    game.classList.remove("show");
    game.classList.add("hide");
    report.classList.add("show");
    report.classList.remove("hide");

}

// hides report and returns back to game
function hideReport() {
    const report = document.getElementById("report");

    game.classList.add("show");
    game.classList.remove("hide");
    report.classList.remove("show");
    report.classList.add("hide");
}