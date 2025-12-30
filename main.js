// PLAY SETION VARIABLES
let play = document.getElementById("play");
let playButton = document.getElementById("playButton");

// GAME SECTION VARIABLES

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

// ACTION BUTTON VARIABLES
let feedBtn = document.getElementById("feedBtn");
let playBtn = document.getElementById("playBtn");
let restBtn = document.getElementById("restBtn");
let cleanBtn = document.getElementById("cleanBtn");
let vetBtn = document.getElementById("vetBtn");
let choresBtn = document.getElementById("choresBtn");

let logArea = document.getElementById("logArea");

// Load DOM content first before running any functions to ensure there's no errors

document.addEventListener("DOMContentLoaded", function(){
    const savedState = loadGame();
    if (savedState) {
    }

    playButton.onclick = function(){
        play.classList.add('hide');
        input.classList.remove('hide');
        input.classList.add('show');
    } // directs user to sign in section
    function showError(inputElement, errorElement, message){
        inputElement.classList.add('error');
        errorElement.textContent = message;
    } // shows error under input label in case of invalid inputs

    function clearError(inputElement, errorElement) {
        inputElement.classList.remove('error');
        errorElement.textContent = '';
    }

        function showError(inputElement, errorElement, message){
        inputElement.classList.add('error');
        errorElement.textContent = message;
    }

    function clearError(inputElement, errorElement) {
        inputElement.classList.remove('error');
        errorElement.textContent = '';
    }

    function validateInputs() {
        const input = document.getElementById("input");
        const userName = document.getElementById("userName");
        const petName = document.getElementById("petName");
        const petType = document.getElementById("petType");
        const savingsGoal = document.getElementById("savingsGoal")
        const submitInputs = document.getElementById("submitInputs");

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
        }

        // pet type validation

        if (petType.value === '') {
            showError(petType, petTypeError, 'Please select pet type');
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

    //PET REACTIONS
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

    submitInputs.onclick = function() {

        if (!validateInputs()) {
            return;
        }
        
        userNameDisplay.textContent = "Hello, " + userName.value;
        petNameDisplay.textContent = petName.value;

        percent = money / parseInt(savingsGoal.value) * 100;

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
    }

    // UPDATE SCREEN FUNCTIONS
    function updateStats() {
        hungerStats.textContent = "Hunger: " + hunger + "%";
        happinessStats.textContent = "Happiness: " + happiness + "%";
        energyStats.textContent = "Energy: " + energy + "%";
        cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
        healthStats.textContent = "Health: " + health + "%";
        ageStats.textContent = "Age: " + age + " years";
        
        
        let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
        moneySaved.textContent = "money saved: $" + money;
        goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";
        updatePetReaction();
        saveGame();
    } // updates stats, amount of money, and percent of money saved

    function log(message) {
        let entry = document.createElement("p");
        entry.textContent = message;
        logArea.appendChild(entry);
        logArea.scrollTop = logArea.scrollHeight;
    } // logs which action buttoms were pressed


    feedBtn.onclick = function() {
    if (money >= 5) {
        money -= 5;
        hunger = Math.max(0, hunger - 20);
        happiness += 5;
        log("You fed your pet. -$5");
    } else {
        log("Not enough money to feed your pet.");
    } // feeds pet -- first checks if player has enough money

    updateStats(); // updates stats immediately after
    };

    playBtn.onclick = function() {
        if (money >= 2) {
            money -= 2;
            happiness += 15;
            energy -= 10;
            log("You played with your pet. -$2");
        } else {
            log("Not enough money to play.");
        }

        updateStats(); // updates stats immediately after
    };

    restBtn.onclick = function() {
        energy = Math.min(100, energy + 20);
        happiness -= 5;
        log("Your pet took a rest.");
        updateStats(); // updates stats immediately after
    };

    cleanBtn.onclick = function() {
        if (money >= 2) {
            money -= 2;

            if (health < 97) {
                health += 3;
            }
            if (cleanliness < 95) {
                cleanliness += 5;
            }
            log("You cleaned your pet. -$2");
        } else {
            log("Not enough money to clean your pet.");
        }

        updateStats(); // updates stats immediately after
    };

    vetBtn.onclick = function() {
        if (money >= 20) {
            money -= 20;
            happiness = Math.min(100, health + 40);
            cleanliness += 10;
            log("You visited the vet. - $20");
        } else {
            log("Not enough money for a vet visit");

        }

        updateStats(); // updates stats immediately after
    };

    choresBtn.onclick = function() {
        money += 10 ;
        happiness += 3;
        log("You did your chores. +$10");

        updateStats(); // updates stats immediately after
    };

    let choresCooldown = false;

    chores.Btn.onclick = function () {
        if (choresCooldown) {
            log("Chores are on cooldown. Try again soon!");
            return;
        }

        money += 10 ;
        happiness += 3;
        log("You did your chores. +$10");

        updateStats(); // updates stats immediately after

        choresCooldown = true;
        choresBtn.disabled = true;

        let timeLeft = 60;
        choresBtn.textContent = `Chores (${timeLeft}s)`;

        //countdown function which makes player wait until the next time they can earn money
        let timer = setInterval(() => {
            timeLeft--;
            choresBtn.textContent = `Choes (${timeLeft}s)`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                choresCooldown = false;
                choresBtn.disabled = false;
                choresBtn.textContent = "Chores (+$10)";
            }
        }, 1000);
    };

    function saveGame(){

    }
    function applyLoadedState(s){
    }
});