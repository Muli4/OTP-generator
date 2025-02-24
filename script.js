let OTP = "";
let expireInterval = null;

emailjs.init("fdBhukiJH5a0L2FUa"); // Replace with your Public Key

function generateOTPs(inputs, expire, userEmail) {
    OTP = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    console.log("Generated OTP:", OTP); // Debugging

    // Send OTP via EmailJS
    emailjs.send("service_07esa9d", "template_4gyb3os", {
        otp_code: OTP,
        to_email: userEmail
    })
    .then(function(response) {
        document.getElementById("emailMessage").innerText = "✅ OTP sent successfully to " + userEmail;
        document.getElementById("emailMessage").style.color = "green";
    }, function(error) {
        document.getElementById("emailMessage").innerText = "❌ Failed to send OTP. Try again.";
        document.getElementById("emailMessage").style.color = "red";
    });

    inputs[0].focus();
    expire.innerText = 30;
    expireInterval = setInterval(() => {
        expire.innerText--;
        if (expire.innerText == "0") {
            clearInterval(expireInterval);
        }
    }, 1000);
}

function clearOTPs(inputs) {
    inputs.forEach((input) => {
        input.value = "";
        input.setAttribute("disabled", true);
    });
    inputs[0].removeAttribute("disabled");
    inputs[0].focus();
    clearInterval(expireInterval);
}

document.addEventListener("DOMContentLoaded", function() {
        emailjs.init("fdBhukiJH5a0L2FUa"); // Public Key
        const inputs = document.querySelectorAll("input[type='number']"),
        verifyButton = document.getElementById("verifyOTP"),
        sendOTPButton = document.getElementById("sendOTP"),
        resendLink = document.getElementById("resendOTP"),
        expire = document.querySelector("#expire"),
        emailInput = document.getElementById("userEmail"),
        emailDisplay = document.getElementById("emailDisplay");

    let userEmail = "";

    sendOTPButton.addEventListener("click", () => {
        userEmail = emailInput.value.trim();
        if (!userEmail) {
            document.getElementById("emailMessage").innerText = "❌ Please enter a valid email.";
            document.getElementById("emailMessage").style.color = "red";
            return;
        }

        emailDisplay.innerText = userEmail; // Display entered email
        inputs.forEach(input => input.setAttribute("disabled", true)); // Disable OTP inputs
        OTP = generateOTPs(inputs, expire, userEmail);
    });

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
                });
            }

            if (!inputs[3].hasAttribute("disabled") && inputs[3].value !== "") {
                verifyButton.removeAttribute("disabled");
            } else {
                verifyButton.setAttribute("disabled", true);
            }
        });
    });

    verifyButton.addEventListener("click", () => {
        let verify = "";
        inputs.forEach((input) => {
            verify += input.value.trim();
        });

        OTP = OTP.replaceAll(" ", "");
        if (verify === OTP) {
            document.getElementById("responseMessage").innerText = "✅ Verification successful!";
            document.getElementById("responseMessage").style.color = "green";
            clearOTPs(inputs);
        } else {
            document.getElementById("responseMessage").innerText = "❌ Verification failed. Try again.";
            document.getElementById("responseMessage").style.color = "red";
        }
    });

    resendLink.addEventListener("click", () => {
        if (userEmail) {
            OTP = generateOTPs(inputs, expire, userEmail);
        }
    });
});
