document.addEventListener("DOMContentLoaded", () => {
    console.log("Vault security system initializing...");

    // DOM Elements
    const dial = document.getElementById("dial");
    const vaultDoor = document.getElementById("vault-door");
    const codeDigits = document.getElementById("code-digits");
    const statusMessage = document.getElementById("status-message");
    const resetBtn = document.getElementById("reset-btn");
    const enterBtn = document.getElementById("enter-btn");

    // Sound effects
    const sounds = {
        tick: new Howl({ src: ['https://assets.codepen.io/21542/click2.mp3'], volume: 0.2 }),
        select: new Howl({ src: ['https://assets.codepen.io/21542/click.mp3'], volume: 0.5 }),
        success: new Howl({ src: ['https://assets.codepen.io/21542/success.mp3'], volume: 0.5 }),
        error: new Howl({ src: ['https://assets.codepen.io/21542/error.mp3'], volume: 0.5 }),
        reset: new Howl({ src: ['https://assets.codepen.io/21542/switch.mp3'], volume: 0.5 }),
    };

    // State variables
    let currentRotation = 0;
    let codeEntered = [];
    let validCode = [];
    let isDialMoving = false;
    let lastDialMovement = Date.now();
    const dialMoveThreshold = 300; // ms
    
    // Dial number positions (12 positions, each 30 degrees)
    const dialPositions = [
        { degrees: 0, value: 0 },
        { degrees: 30, value: 10 },
        { degrees: 60, value: 20 },
        { degrees: 90, value: 30 },
        { degrees: 120, value: 40 },
        { degrees: 150, value: 50 },
        { degrees: 180, value: 60 },
        { degrees: 210, value: 70 },
        { degrees: 240, value: 80 },
        { degrees: 270, value: 90 },
        { degrees: 300, value: 100 },
        { degrees: 330, value: 110 }
    ];

    // Fetch the valid code from vault.json with a timeout
    const fetchValidCode = () => {
        statusMessage.innerHTML = '<div class="spinner-border spinner-border-sm me-2"></div> LOADING SECURITY CODE...';
        
        const fetchTimeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Fetch timeout')), 5000);
        });

        Promise.race([
            fetch('vault.json'),
            fetchTimeout
        ])
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            validCode = data.validCode;
            console.log("Security code loaded successfully");
            statusMessage.textContent = "ENTER SEQUENCE";
            updateCodeDisplay();
        })
        .catch(error => {
            console.error("Error loading security code:", error);
            statusMessage.innerHTML = 'ERROR: SECURITY CODE UNAVAILABLE';
            statusMessage.classList.add('text-danger');
        });
    };

    // Update the code display in the UI
    const updateCodeDisplay = () => {
        if (codeEntered.length === 0) {
            codeDigits.textContent = "[ - - - ]";
            return;
        }
        
        let display = "[";
        for (let i = 0; i < validCode.length; i++) {
            if (i < codeEntered.length) {
                display += ` ${codeEntered[i]} `;
            } else {
                display += " - ";
            }
        }
        display += "]";
        codeDigits.textContent = display;
    };

    // Get the current dial position value
    const getCurrentDialValue = () => {
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;
        const closestPosition = dialPositions.reduce((prev, curr) => {
            const prevDiff = Math.abs(((prev.degrees - normalizedRotation) + 360) % 360);
            const currDiff = Math.abs(((curr.degrees - normalizedRotation) + 360) % 360);
            return prevDiff < currDiff ? prev : curr;
        });
        return closestPosition.value;
    };

    // Handle dial rotation
    const rotateDial = (rotation) => {
        isDialMoving = true;
        lastDialMovement = Date.now();
        
        currentRotation = (currentRotation + rotation) % 360;
        dial.setAttribute("transform", `rotate(${currentRotation}, 250, 250)`);
        
        const currentValue = getCurrentDialValue();
        statusMessage.textContent = `POSITION: ${currentValue}`;
        sounds.tick.play();
    };

    // Handle dial selection
    const selectCurrentPosition = () => {
        if (isDialMoving) {
            return; // Prevent accidental selection while dial is moving
        }
        
        const selectedValue = getCurrentDialValue();
        codeEntered.push(selectedValue);
        
        sounds.select.play();
        statusMessage.textContent = `SELECTED: ${selectedValue}`;
        
        // Limit code length
        if (codeEntered.length > validCode.length) {
            codeEntered.shift();
        }
        
        updateCodeDisplay();
    };

    // Check if the entered code matches the valid code
    const checkCode = () => {
        if (codeEntered.length !== validCode.length) {
            displayError("INCOMPLETE CODE");
            return;
        }
        
        const isCorrect = JSON.stringify(codeEntered) === JSON.stringify(validCode);
        
        if (isCorrect) {
            grantAccess();
        } else {
            denyAccess();
        }
    };

    // Handle successful access
    const grantAccess = () => {
        sounds.success.play();
        statusMessage.textContent = "ACCESS GRANTED";
        statusMessage.classList.remove('text-danger');
        statusMessage.classList.add('text-success');
        vaultDoor.classList.add('success');
        
        setTimeout(() => {
            console.log("Redirecting to congratulations page");
            location.assign("congratulations.html");
        }, 2000);
    };

    // Handle failed access attempt
    const denyAccess = () => {
        sounds.error.play();
        statusMessage.textContent = "ACCESS DENIED";
        statusMessage.classList.add('text-danger');
        vaultDoor.classList.add('shake');
        
        setTimeout(() => {
            vaultDoor.classList.remove('shake');
            resetCode();
        }, 1000);
    };

    // Display an error message
    const displayError = (message) => {
        sounds.error.play();
        statusMessage.textContent = message;
        statusMessage.classList.add('text-danger');
        
        setTimeout(() => {
            statusMessage.textContent = "ENTER SEQUENCE";
            statusMessage.classList.remove('text-danger');
        }, 2000);
    };

    // Reset the entered code
    const resetCode = () => {
        sounds.reset.play();
        codeEntered = [];
        updateCodeDisplay();
        statusMessage.textContent = "CODE RESET";
        statusMessage.classList.remove('text-danger', 'text-success');
        
        setTimeout(() => {
            statusMessage.textContent = "ENTER SEQUENCE";
        }, 1000);
    };

    // Event Listeners
    if (dial) {
        // Wheel event for rotating the dial
        document.addEventListener("wheel", (event) => {
            if (event.target.closest("#vault-door")) {
                event.preventDefault();
                const rotation = event.deltaY < 0 ? 10 : -10;
                rotateDial(rotation);
            }
        });
        
        // Click event for selecting a position
        dial.addEventListener("click", selectCurrentPosition);
        
        // Detect when dial stops moving
        setInterval(() => {
            if (isDialMoving && Date.now() - lastDialMovement > dialMoveThreshold) {
                isDialMoving = false;
            }
        }, 100);
        
        // Reset button
        resetBtn.addEventListener("click", resetCode);
        
        // Enter button
        enterBtn.addEventListener("click", checkCode);
        
        // Keyboard controls
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                rotateDial(-10);
            } else if (event.key === "ArrowLeft") {
                rotateDial(10);
            } else if (event.key === "Enter") {
                selectCurrentPosition();
            } else if (event.key === "Escape") {
                resetCode();
            }
        });
        
        // Load the valid code
        fetchValidCode();
    } else {
        console.error("Critical error: Vault dial mechanism not found!");
    }
});