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
const difficulty = document.getElementById("difficulty");
let currentDifficulty = 'normal';
const DIFFICULTY_SETTINGS = {
    easy: {
        hungerRate: 1,
        energyRate: 0.5,
        happinessRate: 0.5,
        cleanlinessRate: 0.25,
        healthDamage: 2
    },
    normal: {
        hungerRate: 2,
        energyRate: 1,
        happinessRate: 1,
        cleanlinessRate: 0.5,
        healthDamage: 3
    },
    hard: {
        hungerRate: 3,
        energyRate: 1.5,
        happinessRate: 1.5,
        cleanlinessRate: 1,
        healthDamage: 4
    }
};


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

// Game state variables
let currentPetName = '';
let currentPetType = '';
let currentMedicalCondition = null;

// --------------------------------------------- BANKING SYSTEM VARIABLES ------------------------------------------

let savingsBalance = 0;
let savingsInterestTotal = 0;
let stockPortfolio = []; // Array to hold pending stocks
let resolvedStocks = []; // Array to hold resolved stocks
let stockCounter = 0; // To generate unique IDs

// Stock definitions
const STOCK_TYPES = {
    blueChip: {
        name: 'Blue Chip',
        cost: 15,
        successRate: 0.75,
        profitOnSuccess: 15,
        lossOnFailure: 9,
        color: '#2196f3'
    },
    growth: {
        name: 'Growth Stock',
        cost: 30,
        successRate: 0.60,
        profitOnSuccess: 45,
        lossOnFailure: 18,
        color: '#ff9800'
    },
    penny: {
        name: 'Penny Stock',
        cost: 50,
        successRate: 0.50,
        profitOnSuccess: 100,
        lossOnFailure: 30,
        color: '#f44336'
    }
};

// --------------------------------------------- MEDICAL EVENTS SYSTEM ------------------------------------------

const medicalEvents = {
    common_cold: {
        name: '🦠 Common Cold',
        emoji: '🤧',
        description: 'Your pet has a runny nose and sneezing fits.',
        healthDamage: 1,
        treatmentCost: 10,
        rarity: 'common'
    },
    flu: {
        name: '🦠 Flu',
        emoji: '🤒',
        description: 'Your pet has a fever and is feeling very sick.',
        healthDamage: 3,
        treatmentCost: 15,
        rarity: 'uncommon'
    },
    broken_leg: {
        name: '🦵 Broken Leg',
        emoji: '🩹',
        description: 'Your pet has a fracture and can barely walk.',
        healthDamage: 4,
        treatmentCost: 25,
        rarity: 'rare'
    },
    food_poisoning: {
        name: '🤢 Food Poisoning',
        emoji: '🤮',
        description: 'Your pet ate something bad and feels nauseous.',
        healthDamage: 2,
        treatmentCost: 12,
        rarity: 'uncommon'
    },
    infection: {
        name: '🩸 Infection',
        emoji: '🔴',
        description: 'Your pet has developed a serious infection.',
        healthDamage: 5,
        treatmentCost: 30,
        rarity: 'rare'
    },
    allergic_reaction: {
        name: '🔴 Allergic Reaction',
        emoji: '😵',
        description: 'Your pet is having an allergic reaction.',
        healthDamage: 2,
        treatmentCost: 18,
        rarity: 'uncommon'
    },
    sprain: {
        name: '🦶 Sprain',
        emoji: '⚠️',
        description: 'Your pet has sprained their joints.',
        healthDamage: 2,
        treatmentCost: 14,
        rarity: 'common'
    },
    parasites: {
        name: '🪳 Parasites',
        emoji: '🦠',
        description: 'Your pet has internal parasites.',
        healthDamage: 3,
        treatmentCost: 20,
        rarity: 'uncommon'
    }
};

let petMedicalStatus = {
    condition: null,
    turnsRemaining: 0,
    healthDamagePerTurn: 0
};

function getRandomMedicalEvent() {
    const events = Object.keys(medicalEvents);
    
    // Define weights for each rarity level
    const rarityWeights = {
        'common': 5,      // 5x more likely
        'uncommon': 3,    // 3x more likely
        'rare': 1         // Least likely
    };
    
    // Create weighted pool
    let weightedPool = [];
    events.forEach(eventKey => {
        const event = medicalEvents[eventKey];
        const weight = rarityWeights[event.rarity] || 1;
        for (let i = 0; i < weight; i++) {
            weightedPool.push(eventKey);
        }
    });
    
    // Pick random from weighted pool
    const randomEvent = weightedPool[Math.floor(Math.random() * weightedPool.length)];
    return medicalEvents[randomEvent];
}

function infectPet() {
    if (petMedicalStatus.condition !== null) {
        return; // Pet already has a condition
    }
    
    // Random chance to get infected (adjustable percentage)
    const chanceOfInfection = 8; // 8% chance per cycle
    if (Math.random() * 100 > chanceOfInfection) {
        return;
    }
    
    const newCondition = getRandomMedicalEvent();
    petMedicalStatus.condition = newCondition;
    petMedicalStatus.turnsRemaining = newCondition.duration;
    petMedicalStatus.healthDamagePerTurn = newCondition.healthDamage;
    
    log(`⚠️ OH NO! Your pet has contracted ${newCondition.name.split(' ')[1]}!`);
    displayMedicalCondition();
    updateVetButtonText();
}

function displayMedicalCondition() {
    const medicalAlert = document.getElementById("medicalAlert");
    const medicalCondition = document.getElementById("medicalCondition");
    const medicalDescription = document.getElementById("medicalDescription");
    
    if (petMedicalStatus.condition !== null) {
        medicalCondition.textContent = petMedicalStatus.condition.name;
        medicalDescription.textContent = `${petMedicalStatus.condition.description} (Treatment: $${petMedicalStatus.condition.treatmentCost})`;
        
        // Remove all condition classes
        medicalAlert.classList.remove('infected', 'injured', 'poisoned', 'fractured', 'allergic');
        
        // Add appropriate class based on condition
        if (petMedicalStatus.condition.name.includes('Infection')) {
            medicalAlert.classList.add('infected');
        } else if (petMedicalStatus.condition.name.includes('Leg') || petMedicalStatus.condition.name.includes('Sprain')) {
            medicalAlert.classList.add('injured');
        } else if (petMedicalStatus.condition.name.includes('Poisoning')) {
            medicalAlert.classList.add('poisoned');
        } else if (petMedicalStatus.condition.name.includes('Fracture')) {
            medicalAlert.classList.add('fractured');
        } else if (petMedicalStatus.condition.name.includes('Allergic')) {
            medicalAlert.classList.add('allergic');
        }
        
        medicalAlert.classList.remove('hide');
    } else {
        medicalAlert.classList.add('hide');
    }
    
    // Update vet button text based on condition
    updateVetButtonText();
}

function updateVetButtonText() {
    if (petMedicalStatus.condition !== null) {
        const cost = petMedicalStatus.condition.treatmentCost;
        const diseaseName = petMedicalStatus.condition.name.split(' ').slice(1).join(' ');
        vetBtn.textContent = `Treat ${diseaseName} ($${cost})`;
        vetBtn.style.backgroundColor = '#d32f2f';
    } else {
        vetBtn.textContent = 'Vet Visit ($20)';
        vetBtn.style.backgroundColor = '';
    }
}

function treatMedicalCondition() {
    if (petMedicalStatus.condition === null) {
        log("Your pet is not sick. No need to visit the vet.");
        return false;
    }
    
    const treatmentCost = petMedicalStatus.condition.treatmentCost;
    
    if (money < treatmentCost) {
        log(`🏥 Not enough money! Vet visit costs $${treatmentCost} but you only have $${money}.`);
        return false;
    }
    
    money -= treatmentCost;
    expenses.healthcare += treatmentCost;
    
    log(`💉 Your pet was treated and is now healthy! Cost: $${treatmentCost}`);
    petMedicalStatus.condition = null;
    petMedicalStatus.turnsRemaining = 0;
    health = Math.min(100, health + 40); // Restore some health
    displayMedicalCondition();
    updateVetButtonText();
    updateStats();
    
    return true;
}

// --------------------------------------------- pet life stages ------------------------------------------

const petLifeStages = {
    baby: { min: 0, max: 4, label: 'Baby' },
    young: { min: 5, max: 9, label: 'Young' },
    adult: { min: 10, max: 100, label: 'Adult' }
};

function getPetLifeStage() {
    for (const [key, stage] of Object.entries(petLifeStages)) {
        if (age >= stage.min && age <= stage.max) {
            return stage;
        }
    }
    return petLifeStages.adult;
}

function getPetStageEmoji() {
    const currentStage = getPetLifeStage();
    const petTypeVal = petType && petType.value ? petType.value : 'Dog';
    
    const emoji = petStageEmojis[petTypeVal] && petStageEmojis[petTypeVal][currentStage.label];
    
    return emoji || '🐾';
}

function getPetImagePath() {
    const currentStage = getPetLifeStage();
    const petTypeVal = petType && petType.value ? petType.value : 'Dog';
    const emotion = getPetEmotion().emotion;
    
    // Format: dog_baby_happy.png
    const imagePath = `images/${petTypeVal.toLowerCase()}_${currentStage.label.toLowerCase()}_${emotion}.png`;
    return imagePath;
}

const petStageEmojis = {
    'Dog': {
        'Baby': 'images/dog_neutral.jpg',
        'Young': 'images/dog_neutral.jpg',
        'Adult': 'images/dog_neutral.jpg'
    },
    'Cat': {
        'Baby': 'images/cat_neutral.jpg',
        'Young': 'images/cat_neutral.jpg',
        'Adult': 'images/cat_neutral.jpg'
    },
    'Rabbit': {
        'Baby': '🐰',
        'Young': '🐇',
        'Adult': '🐰'
    },
    'Turtle': {
        'Baby': '🥚',
        'Young': '🐢',
        'Adult': '🐢'
    }
};

let lastLoggedStage = "Baby";

function checkLifeStageMilestone() {
    const currentStage = getPetLifeStage();
    // ← CAPITAL B: 'Baby' vs 'Baby' ✓
    if (currentStage.label !== lastLoggedStage) {
        lastLoggedStage = currentStage.label;
        log(`🎉 Your pet is now a ${currentStage.label}!`);
    }
}

// --------------------------------------------- BANKING SYSTEM FUNCTIONS ------------------------------------------

function buyStock(stockType) {
    const stock = STOCK_TYPES[stockType];
    
    if (money < stock.cost) {
        log(`💰 Not enough money! ${stock.name} costs $${stock.cost}, you have $${money}.`);
        return;
    }
    
    // Deduct cost
    money -= stock.cost;
    
    // Create stock object with 60-second timer
    const stockId = stockCounter++;
    const newStock = {
        id: stockId,
        type: stockType,
        name: stock.name,
        cost: stock.cost,
        timeRemaining: 60,
        successRate: stock.successRate,
        profitOnSuccess: stock.profitOnSuccess,
        lossOnFailure: stock.lossOnFailure,
        startTime: Date.now()
    };
    
    stockPortfolio.push(newStock);
    log(`📈 Bought ${stock.name} for $${stock.cost}. Resolves in 60 seconds...`);
    updateStats();
    updateStocksDisplay();
}

function updateStocksDisplay() {
    const pendingList = document.getElementById('pendingList');
    const resolvedList = document.getElementById('resolvedList');
    const portfolioValue = document.getElementById('portfolioValue');
    
    pendingList.innerHTML = '';
    resolvedList.innerHTML = '';
    
    // Display pending stocks
    stockPortfolio.forEach(stock => {
        const card = document.createElement('div');
        card.className = 'stockCard pending';
        const timeLeft = Math.max(0, stock.timeRemaining);
        card.innerHTML = `<strong>${stock.name}</strong><br>Cost: $${stock.cost}<br><span class="stockTimer">⏱ ${timeLeft}s</span>`;
        pendingList.appendChild(card);
    });
    
    // Display resolved stocks
    resolvedStocks.slice(-5).forEach(stock => {
        const card = document.createElement('div');
        card.className = `stockCard ${stock.result}`;
        const resultText = stock.result === 'success' ? `+$${stock.profit} ✓` : `-$${stock.loss} ✗`;
        card.innerHTML = `<strong>${stock.name}</strong><br>${resultText}`;
        resolvedList.appendChild(card);
    });
    
    // Calculate portfolio value
    const totalInvested = stockPortfolio.reduce((sum, s) => sum + s.cost, 0);
    portfolioValue.textContent = `Pending: $${totalInvested}`;
}

function resolveStocks() {
    const now = Date.now();
    const stillPending = [];
    
    stockPortfolio.forEach(stock => {
        const elapsed = Math.floor((now - stock.startTime) / 1000);
        stock.timeRemaining = Math.max(0, 60 - elapsed);
        
        if (elapsed >= 60) {
            // Resolve this stock
            const success = Math.random() < stock.successRate;
            
            if (success) {
                money += stock.profitOnSuccess;
                happiness = Math.min(100, happiness + 5);
                log(`✅ ${stock.name} succeeded! +$${stock.profitOnSuccess}`);
                resolvedStocks.push({
                    name: stock.name,
                    result: 'success',
                    profit: stock.profitOnSuccess,
                    loss: 0
                });
            } else {
                money -= stock.lossOnFailure;
                happiness = Math.max(0, happiness - 10);
                log(`❌ ${stock.name} failed! -$${stock.lossOnFailure}`);
                resolvedStocks.push({
                    name: stock.name,
                    result: 'failed',
                    profit: 0,
                    loss: stock.lossOnFailure
                });
            }
        } else {
            stillPending.push(stock);
        }
    });
    
    stockPortfolio = stillPending;
    if (resolvedStocks.length > 0) {
        updateStocksDisplay();
    }
}

function depositSavings() {
    const amount = prompt(`Enter amount to deposit (Current wallet: $${money}):`);
    
    if (amount === null) return;
    
    const depositAmount = parseFloat(amount);
    
    if (isNaN(depositAmount) || depositAmount <= 0) {
        log("Invalid deposit amount.");
        return;
    }
    
    if (depositAmount > money) {
        log(`Not enough money! You have $${money}.`);
        return;
    }
    
    money -= depositAmount;
    savingsBalance += depositAmount;
    log(`💾 Deposited $${depositAmount} to savings. New balance: $${savingsBalance.toFixed(2)}`);
    updateStats();
}

function withdrawSavings() {
    const amount = prompt(`Enter amount to withdraw (Current savings: $${savingsBalance.toFixed(2)}):`);
    
    if (amount === null) return;
    
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        log("Invalid withdrawal amount.");
        return;
    }
    
    if (withdrawAmount > savingsBalance) {
        log(`Not enough savings! You have $${savingsBalance.toFixed(2)}.`);
        return;
    }
    
    savingsBalance -= withdrawAmount;
    money += withdrawAmount;
    log(`🏦 Withdrew $${withdrawAmount} from savings. New balance: $${savingsBalance.toFixed(2)}`);
    updateStats();
}

function applySavingsInterest() {
    const interestEarned = savingsBalance * 0.005; // 0.5% per cycle
    savingsBalance += interestEarned;
    savingsInterestTotal += interestEarned;
}

function updateBankingDisplay() {
    // Update wallet tab
    const moneySaved = document.getElementById('moneySaved');
    const goal = document.getElementById('goal');
    if (moneySaved && goal) {
        moneySaved.textContent = `Wallet: $${money}`;
        let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
        goal.textContent = `Goal: $${savingsGoal.value} (${percent}%)`;
    }
    
    // Update header bar with all banking info
    const headerWallet = document.getElementById('headerWallet');
    const headerSavings = document.getElementById('headerSavings');
    const headerInterest = document.getElementById('headerInterest');
    const headerStocks = document.getElementById('headerStocks');
    
    if (headerWallet) headerWallet.textContent = `💰 Wallet: $${money}`;
    if (headerSavings) headerSavings.textContent = `🏦 Savings: $${savingsBalance.toFixed(2)}`;
    if (headerInterest) headerInterest.textContent = `📈 Interest: $${savingsInterestTotal.toFixed(2)}`;
    if (headerStocks) {
        const totalInvested = stockPortfolio.reduce((sum, s) => sum + s.cost, 0);
        headerStocks.textContent = `📊 Stocks: $${totalInvested} (${stockPortfolio.length} pending)`;
    }
    
    // Update savings tab wallet balance
    const walletBalanceSavings = document.getElementById('walletBalanceSavings');
    if (walletBalanceSavings) {
        walletBalanceSavings.textContent = `Wallet: $${money}`;
    }
    
    // Update savings tab
    const savingsBalanceEl = document.getElementById('savingsBalance');
    const savingsInterestEl = document.getElementById('savingsInterest');
    if (savingsBalanceEl && savingsInterestEl) {
        savingsBalanceEl.textContent = `Savings: $${savingsBalance.toFixed(2)}`;
        savingsInterestEl.textContent = `Interest earned: $${savingsInterestTotal.toFixed(2)}`;
    }
    
    // Update stocks tab wallet balance
    const walletBalanceStocks = document.getElementById('walletBalanceStocks');
    if (walletBalanceStocks) {
        walletBalanceStocks.textContent = `Wallet: $${money}`;
    }
    
    // Update stocks tab
    updateStocksDisplay();
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

// cooldown tracking
let choresCooldown = false;

// load DOM content first before running any onclick functions tot enure there's no issues

let decayInterval;

// ADDED: Help screen functionality
// Help screen elements
const help = document.getElementById("help");
const closeHelpBtn = document.getElementById("closeHelpBtn");
const helpFromPlayBtn = document.getElementById("helpFromPlayBtn");
const helpFromGameBtn = document.getElementById("helpFromGameBtn");

document.addEventListener("DOMContentLoaded", function(){
    setTimeout(delayBackgroundImage, 1000);
    setTimeout(delayPlayButton, 2000);
    // Decay interval will be started when a game begins
    // directs user to sign in section
    
    // ADDED: Help button handlers
    helpFromPlayBtn.onclick = function() {
        help.classList.remove('hide');
        help.classList.add('show');
    }

    helpFromGameBtn.onclick = function() {
        help.classList.remove('hide');
        help.classList.add('show');
    }

    closeHelpBtn.onclick = function() {
        help.classList.add('hide');
        help.classList.remove('show');
    }

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
                document.getElementById('bankingHeader').classList.remove('hide');

                // display loaded state

                userNameDisplay.textContent = "Hello, " + (userName.value || '').trim();
                
                updateStats();
                updatePetReaction();

                // Clear any existing interval and start fresh for this game session
                if (window.gameDecayInterval) {
                    clearInterval(window.gameDecayInterval);
                }
                window.gameDecayInterval = setInterval(applyPassiveDecay, 5000);
                console.log("Started decay interval for loaded game");
            } else {
                // directs user to sign in section 
                userName.value = '';
                petName.value = '';
                petType.value = '';
                savingsGoal.value = '';
                difficulty.value = '';


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
            showError(petType, petTypeError, "Enter")
            return;
        }
        
        userNameDisplay.textContent = "Hello, " + userName.value;
        petNameDisplay.textContent = petName.value;
        
        // Store pet info in game variables
        currentPetName = petName.value;
        currentPetType = petType.value;
        currentDifficulty = difficulty.value || 'normal';

        let percent = money / parseInt(savingsGoal.value) * 100;

        moneySaved.textContent = "Money saved: $" + money;
        goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";
        input.classList.remove('show');
        input.classList.add('hide');
        game.classList.remove('hide');
        game.classList.add('show');
        document.getElementById('bankingHeader').classList.remove('hide');

        hungerStats.textContent = "Hunger: " + hunger + "%";
        happinessStats.textContent = "Happiness: " + happiness + "%";
        energyStats.textContent = "Energy: " + energy + "%";
        cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
        healthStats.textContent = "Health: " + health + "%";
        ageStats.textContent = "Age: " + age + " days";

        updatePetReaction();
        saveGame();

        // Clear any existing interval and start fresh for this game session
        if (window.gameDecayInterval) {
            clearInterval(window.gameDecayInterval);
        }
        window.gameDecayInterval = setInterval(applyPassiveDecay, 5000);
        console.log("Started decay interval");
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
        happiness = Math.max(0, happiness - 5);
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
        // Check if pet has a medical condition and treat it
        if (petMedicalStatus.condition !== null) {
            treatMedicalCondition();
        } else {
            // Regular vet visit for general health
            if (money >= 20) {
                money -= 20;
                health = Math.min(100, health + 40);
                expenses.healthcare += 20;
                
                cleanliness = Math.min(100, cleanliness + 10);
                log("You visited the vet. - $20");
            } else {
                log("Not enough money for a vet visit");
            }
        }
        // updates stats immediately after
        updateStats();
    };

    // cooldown after earning $10 from doing chores
    choresBtn.onclick = function () {
        if (choresCooldown) {
            log("Chores are on cooldown. Try again soon!");
            return;
        }

        money += 10 ;
        happiness = Math.min(100, happiness + 3);
        log("You did your chores! +$10");


        choresCooldown = true;

        let timeLeft = 60;
        choresBtn.textContent = `Chores (${timeLeft}s)`;

        //countdown function which makes player wait until the next time they can earn money
        let timer = setInterval(() => {
            timeLeft--;
            choresBtn.textContent = `Chores (${timeLeft}s)`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                choresCooldown = false;
                choresBtn.textContent = "Chores (+$10)";
            }
        }, 1000);
        updateStats(); // updates stats immediately after
    };

    // ----- Banking Tab System -----
    const bankTabs = document.querySelectorAll('.bankTab');
    bankTabs.forEach(tab => {
        tab.onclick = function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            bankTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.bankTabContent').forEach(content => {
                content.classList.remove('active');
                content.classList.add('hide');
            });
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
            document.getElementById(tabName + 'Tab').classList.remove('hide');
        };
    });

    // ----- Stock Buttons -----
    const buyBlueChipBtn = document.getElementById('buyBlueChipBtn');
    const buyGrowthBtn = document.getElementById('buyGrowthBtn');
    const buyPennyBtn = document.getElementById('buyPennyBtn');

    if (buyBlueChipBtn) buyBlueChipBtn.onclick = () => buyStock('blueChip');
    if (buyGrowthBtn) buyGrowthBtn.onclick = () => buyStock('growth');
    if (buyPennyBtn) buyPennyBtn.onclick = () => buyStock('penny');

    // ----- Savings Buttons -----
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');

    if (depositBtn) depositBtn.onclick = depositSavings;
    if (withdrawBtn) withdrawBtn.onclick = withdrawSavings;

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

    const difficultyError = document.getElementById('difficultyError');

    clearError(difficulty, difficultyError);
    if (difficulty.value === '') {
        showError(difficulty, difficultyError, 'Please select a difficulty');
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
    const petNameDisplay = document.getElementById('petNameDisplay');
    const petStatusEl = document.getElementById('petStatus');

    if (!petReactionDiv) return;

    const reaction = getPetEmotion();
    const lifeStage = getPetLifeStage();

    // Show stage-specific image
    if (petEmojiEl && petEmojiEl.tagName === 'IMG') {
        petEmojiEl.src = getPetImagePath();
        petEmojiEl.alt = `${currentPetType} ${lifeStage.label}`;
    }
    emotionEmojiEl.textContent = reaction.emoji;
    
    // Display pet name and type
    if (petNameDisplay) {
        const nameToDisplay = petName.value || currentPetName;
        petNameDisplay.textContent = nameToDisplay;
    }
    if (petTypeDisplay) {
        const typeToDisplay = petType.value || currentPetType;
        const displayText = typeToDisplay + " (" + lifeStage.label + ")";
        petTypeDisplay.textContent = displayText;
    }
    petStatusEl.textContent = reaction.status;

    petReactionDiv.className = '';
    petReactionDiv.classList.add(reaction.emotion);
}


// --------------------------------- UPDATING STATS ---------------------------------

// checks if game is over (pet died or starved)
function checkGameOver() {
    if (health <= 0) {
        setTimeout(() => {
            alert(`💀 Oh no! ${currentPetName || 'Your pet'} has passed away...\n\nYour pet's health couldn't be saved. Better luck next time!`);
            resetGame(true); // Skip confirmation popup
        }, 100);
        return true;
    }
    
    if (hunger >= 100) {
        setTimeout(() => {
            alert(`💀 Oh no! ${currentPetName || 'Your pet'} has starved...\n\nYou didn't feed your pet in time. Better luck next time!`);
            resetGame(true); // Skip confirmation popup
        }, 100);
        return true;
    }
    
    return false;
}

// updates stats, amount of money, and percent of money saved
function updateStats() {
    hungerStats.textContent = "Hunger: " + hunger + "%";
    happinessStats.textContent = "Happiness: " + happiness + "%";
    energyStats.textContent = "Energy: " + energy + "%";
    cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
    healthStats.textContent = "Health: " + health + "%";
    ageStats.textContent = "Age: " + age + " days";
    
    updateBankingDisplay();
    updatePetReaction();
    displayMedicalCondition();
    
    // Ensure pet info is always saved
    if (petName.value) currentPetName = petName.value;
    if (petType.value) currentPetType = petType.value;
    
    // Check for game over conditions
    if (checkGameOver()) {
        return;
    }
    
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
    console.log("applyPassiveDecay called - Current age:", age);
    const diffSettings = DIFFICULTY_SETTINGS[currentDifficulty] || DIFFICULTY_SETTINGS.normal;

    hunger = Math.min(100, hunger + diffSettings.hungerRate);
    energy = Math.max(0, energy - diffSettings.energyRate);
    happiness = Math.max(0, happiness - diffSettings.happinessRate);
    cleanliness = Math.max(0, cleanliness - diffSettings.cleanlinessRate);

    age += 1;
    
    console.log("After decay - age:", age, "hunger:", hunger, "energy:", energy);

    if (hunger >= 85 || energy <= 15 || happiness <= 20 || cleanliness <= 20) {
        health = Math.max(0, health - diffSettings.healthDamage);
    }

    // Check for random medical events
    infectPet();
    
    // Apply health damage from existing medical conditions (disease persists until treated by vet)
    if (petMedicalStatus.condition !== null) {
        health = Math.max(0, health - petMedicalStatus.healthDamagePerTurn);
        // Disease does NOT auto-recover - only vet treatment can cure it
    }

    // Apply savings interest and resolve stocks
    applySavingsInterest();
    resolveStocks();

    updateStats();
}

// ------------------------------------- PERSISTENCE (LOCAL STORAGE) -----------------------

// loads game based on data locally saved from previous visits the user has made to the app
function loadGame() {
    try {
        const raw = localStorage.getItem('petGameState');
        if (!raw) {
            console.log("No saved game found in localStorage");
            return null;
        }
        const parsed = JSON.parse(raw);
        console.log("Loaded game state:", parsed);
        console.log("Loaded petName:", parsed.petName, "petType:", parsed.petType);
        return parsed;
    } catch (e) {
        console.warn('Could not load game state:', e);
        return null;
    }
}


// saves the stats/data of the user in a dictionary and compresses it into a string before the user leaves the page
function saveGame(){
    // Don't save if we're still on the initial screen (no pet info set yet)
    if (!currentPetName && !petName.value) {
        console.log("Skipping save - no pet name set yet");
        return;
    }

    const gameState = {
        userName: userName.value,
        petName: petName.value || currentPetName,
        petType: petType.value || currentPetType,
        savingsGoal: savingsGoal.value,
        difficulty: currentDifficulty,
        money: money,
        hunger: hunger,
        happiness: happiness,
        energy: energy,
        cleanliness: cleanliness,
        health: health,
        age: age,
        lastLoggedStage: lastLoggedStage,
        expenses: expenses,
        petMedicalStatus: petMedicalStatus,
        savingsBalance: savingsBalance,
        savingsInterestTotal: savingsInterestTotal,
        stockPortfolio: stockPortfolio,
        resolvedStocks: resolvedStocks,
        stockCounter: stockCounter
    }

    console.log("saveGame() - petName.value:", petName.value, "currentPetName:", currentPetName, "saving as:", gameState.petName);
    console.log("saveGame() - petType.value:", petType.value, "currentPetType:", currentPetType, "saving as:", gameState.petType);

    try {
        localStorage.setItem('petGameState', JSON.stringify(gameState));
        console.log("Game state saved successfully");
    } catch (e) {
        console.warn("Could not save game state: ", e)
    }
}

// deletes any saved data in case user wants a fresh start
function resetGame(skipConfirm = false) {
    if (!skipConfirm) {
        const sure = confirm("Are you sure you want to reset the game and delete saved progress?")
        if (!sure) return;
    }

    try { 
        localStorage.removeItem('petGameState');
        console.log('Game saved state cleared');
    } catch (_) {}

    money = 10;
    hunger = 0;
    happiness = 100;
    cleanliness = 100;
    health = 100;
    energy = 100;
    age = 0;
    lastLoggedStage = 'Baby';
    choresCooldown = false; // Reset cooldown
    
    // Reset medical status
    petMedicalStatus = {
        condition: null,
        turnsRemaining: 0,
        healthDamagePerTurn: 0
    };

    // Reset banking data
    savingsBalance = 0;
    savingsInterestTotal = 0;
    stockPortfolio = [];
    resolvedStocks = [];
    stockCounter = 0;

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
    difficulty.value = '';

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
        const petNameDisplay = document.getElementById("petNameDisplay");
        const petStatusEl = document.getElementById("petStatus");

        if (petEmojiEl && petEmojiEl.tagName === 'IMG') {
            petEmojiEl.src = '';
            petEmojiEl.alt = '';
        }
        if (emotionEmojiEl) emotionEmojiEl.textContent = '🙂';
        if (petTypeDisplay) petTypeDisplay.textContent = '';
        if (petNameDisplay) petNameDisplay.textContent = '';
        if (petStatusEl) petStatusEl.textContent = 'Your pet is okay.';
    }
    
    // Hide medical alert
    const medicalAlert = document.getElementById("medicalAlert");
    if (medicalAlert) {
        medicalAlert.classList.add('hide');
    }

    // Reset banking tabs to wallet view
    const bankTabs = document.querySelectorAll('.bankTab');
    const bankTabContents = document.querySelectorAll('.bankTabContent');
    bankTabs.forEach(tab => tab.classList.remove('active'));
    bankTabContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hide');
    });
    if (bankTabs[0]) bankTabs[0].classList.add('active');
    if (bankTabContents[0]) {
        bankTabContents[0].classList.add('active');
        bankTabContents[0].classList.remove('hide');
    }

    game.classList.remove('show');
    game.classList.add('hide');
    input.classList.add('hide');
    input.classList.add('hide');
    document.getElementById('bankingHeader').classList.add('hide');
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
    difficulty.value = s.difficulty || 'normal';
    
    // Store pet info in game variables
    currentPetName = s.petName || '';
    currentPetType = s.petType || '';

    money = typeof s.money === 'number' ? s.money : 10;
    hunger = typeof s.hunger === 'number' ? s.hunger : 0;
    happiness = typeof s.happiness === 'number' ? s.happiness : 100;
    energy = typeof s.energy === 'number' ? s.energy : 100;
    cleanliness = typeof s.cleanliness === 'number' ? s.cleanliness : 100;
    health = typeof s.health === 'number' ? s.health : 100;
    currentDifficulty = s.difficulty || 'normal';
    age = typeof s.age === 'number' ? s.age : 0;
    lastLoggedStage = typeof s.lastLoggedStage === "string" ? s.lastLoggedStage : "Baby";

    if (s.expenses) {
        expenses.food = s.expenses.food || 0;
        expenses.healthcare = s.expenses.healthcare || 0;
        expenses.hygiene = s.expenses.hygiene || 0;
        expenses.entertainment = s.expenses.entertainment || 0;
    }
    
    // Restore medical status
    if (s.petMedicalStatus) {
        petMedicalStatus = s.petMedicalStatus;
    }

    // Restore banking data
    savingsBalance = typeof s.savingsBalance === 'number' ? s.savingsBalance : 0;
    savingsInterestTotal = typeof s.savingsInterestTotal === 'number' ? s.savingsInterestTotal : 0;
    stockPortfolio = Array.isArray(s.stockPortfolio) ? s.stockPortfolio : [];
    resolvedStocks = Array.isArray(s.resolvedStocks) ? s.resolvedStocks : [];
    stockCounter = typeof s.stockCounter === 'number' ? s.stockCounter : 0;
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