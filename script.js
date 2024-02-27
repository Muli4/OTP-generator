let OTP = "";
let expireInterval = null; // Declare expireInterval variable

function generateOTPs(inputs, expire) {
    OTP =
        Math.floor(Math.random() * 10) +
        " " +
        Math.floor(Math.random() * 10) +
        " " +
        Math.floor(Math.random() * 10) +
        " " +
        Math.floor(Math.random() * 10);

    alert("Your OTP is: " + OTP);
    inputs[0].focus();
    expire.innerText = 30;
    expireInterval = setInterval(function() {
        expire.innerText--;
        if (expire.innerText == 0) {
            clearInterval(expireInterval);
        }
    }, 1000);

    return OTP
}

function clearOTPs(inputs) {
    inputs.forEach((input) => {
        input.value = "";
    });
    clearInterval(expireInterval);
}

document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll("input"),
        button = document.querySelector("button"),
        expire = document.querySelector("#expire");

    inputs.forEach((input, index) => {
        input.addEventListener("keyup", function(e) {
            const currentInput = input,
                nextInput = input.nextElementSibling,
                prevInput = input.previousElementSibling;

            if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
                nextInput.removeAttribute("disabled");
                nextInput.focus();
            }

            if (e.key == "Backspace") {
                inputs.forEach((input, index1) => {
                    if (index <= index1 && prevInput) {
                        input.setAttribute("disabled", true);
                        prevInput.focus();
                        prevInput.value = "";
                    }
                })
            }

            // Check if the last input is not disabled and has a value
            if (!inputs[3].hasAttribute("disabled") && inputs[3].value !== "") {
                button.classList.add("active");
            } else {
                button.classList.remove("active"); // Remove active class if not filled
            }
        });
    });

    button.addEventListener("click", () => {
        let verify = "";
        inputs.forEach((input) => {
            verify += input.value.trim(); // Trim whitespace from input
        });
        console.log("User Input:", verify); // Log the user input
        console.log("User Input Length:", verify.length); // Log the length of the user input
        console.log("User Input Type:", typeof verify); // Log the type of the user input
        console.log("Generated OTP:", OTP); // Log the generated OTP
        console.log("Generated OTP Length:", OTP.length); // Log the length of the generated OTP
        console.log("Generated OTP Type:", typeof OTP); // Log the type of the generated OTP

        OTP = OTP.replaceAll(" ", "")
        if (verify === OTP) {
            alert("Verification successful");
            clearOTPs(inputs); // Call clearOTPs with inputs parameter
        } else {
            alert("Verification failed");
        }


        console.log('Verify: '+ verify, 'OTP : ' + OTP); 
    });
    
    window.addEventListener("load", () => {
        let x = prompt("Please enter your mobile number");
        if (x) {
            document.getElementById("mobile").innerText = x;
            OTP = generateOTPs(inputs, expire);
        }
    });
});
