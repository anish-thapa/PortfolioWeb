let userScore = 0;
let computerScore = 0;

function playGame(userChoice) {
    // Stop any currently playing sound
    stopAllSounds();

    // Play vibration sound when user makes a choice
    playSound('vibration-sound');

    // Clear previous selections
    const images = document.querySelectorAll('.choice');
    images.forEach(img => img.classList.remove('selected'));

    // Add the selected class to the clicked choice
    const userImage = document.querySelector(`img[alt="${capitalizeFirstLetter(userChoice)}"]`);
    userImage.classList.add('selected');

    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    // Show the result in the modal
    showResult(userChoice, computerChoice);
}

function getResult(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "It's a draw!";
    } else if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        userScore++;
        return "You win!";
    } else {
        computerScore++;
        return "You lose!";
    }
}

function showResult(userChoice, computerChoice) {
    const resultText = getResult(userChoice, computerChoice);

    // Set user and computer choice images
    document.getElementById('user-choice-img').src = `${userChoice}.png`;
    document.getElementById('computer-choice-img').src = `${computerChoice}.png`;

    // Set result text
    document.getElementById('game-result-text').innerText = resultText;

    // Play appropriate sound based on result
    if (resultText === "You win!") {
        playSound('win-sound');
    } else if (resultText === "You lose!") {
        playSound('lose-sound');
    } else {
        playSound('draw-sound');
    }

    // Update score display
    document.getElementById('user-score').innerText = userScore;
    document.getElementById('computer-score').innerText = computerScore;

    // Hide the "Choose one" message when the result is displayed
    document.getElementById('choose-message').style.display = 'none';

    // Show the modal
    document.getElementById('result-modal').style.display = 'flex';
}

function replayGame() {
    // Show the "Choose one" message again
    document.getElementById('choose-message').style.display = 'block';
    // Hide the modal and reset the game
    document.getElementById('result-modal').style.display = 'none';
}

function exitGame() {
    // Optionally redirect to a different page or show a goodbye message
    alert("Thanks for playing!");
    // You can redirect to another page like this:
    // window.location.href = 'home.html'; // Uncomment and set your desired URL
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Reset sound to the start
    sound.play();
}

function stopAllSounds() {
    const sounds = ['vibration-sound', 'win-sound', 'lose-sound', 'draw-sound'];
    sounds.forEach(id => {
        const sound = document.getElementById(id);
        sound.pause();
        sound.currentTime = 0; // Reset sound to the start
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
