let expireInterval = null;
emailjs.init("fdBhukiJH5a0L2FUa"); // Replace with your Public Key

function generateOTPs(inputs, expire, userEmail) {
    let OTP = Math.floor(1000 + Math.random() * 9000).toString(); // Generate OTP
    console.log("Generated OTP:", OTP); // Debugging

    // Store OTP in localStorage for verification
    localStorage.setItem(userEmail, OTP);

    // Send OTP via EmailJS
    emailjs.send("service_07esa9d", "template_h2q7mxr", {
        otp_code: OTP,      
        to_email: userEmail 
    })
    .then(function(response) {
        console.log("Email sent successfully:", response);
        document.getElementById("emailMessage").innerText = "✅ OTP sent successfully to " + userEmail;
        document.getElementById("emailMessage").style.color = "green";

        // ✅ Enable OTP input fields after sending OTP
        inputs.forEach(input => {
            input.removeAttribute("disabled");
            input.value = "";
        });
        inputs[0].focus(); // Focus on the first input field

    }, function(error) {
        console.log("Email failed to send:", error);
        document.getElementById("emailMessage").innerText = "❌ Failed to send OTP. Try again.";
        document.getElementById("emailMessage").style.color = "red";
    });

    expire.innerText = 30;
    clearInterval(expireInterval);
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
        generateOTPs(inputs, expire, userEmail);

        // Enable OTP input fields after sending OTP
        inputs.forEach(input => {
            input.removeAttribute("disabled");
            input.value = ""; // Clear old values
        });
        inputs[0].focus(); // Focus on the first input field
    });

    // ✅ Allow only one digit per input and move to the next field
    inputs.forEach((input, index) => {
        input.addEventListener("input", function(e) {
            this.value = this.value.replace(/[^0-9]/g, "").slice(0, 1); // Allow only 1 digit

            if (this.value !== "" && index < inputs.length - 1) {
                inputs[index + 1].removeAttribute("disabled");
                inputs[index + 1].focus();
            }

            checkOTPCompletion();
        });

        input.addEventListener("keydown", function(e) {
            if (e.key === "Backspace" && index > 0 && this.value === "") {
                inputs[index - 1].focus(); // Move focus to the previous input on Backspace
            }
        });
    });

    function checkOTPCompletion() {
        let isComplete = true;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                isComplete = false;
            }
        });

        if (isComplete) {
            verifyButton.removeAttribute("disabled");
        } else {
            verifyButton.setAttribute("disabled", true);
        }
    }

    verifyButton.addEventListener("click", () => {
        let enteredOTP = "";
        inputs.forEach(input => {
            enteredOTP += input.value.trim();
        });

        const storedOTP = localStorage.getItem(userEmail);

        if (enteredOTP === storedOTP) {
            document.getElementById("responseMessage").innerText = "✅ Verification successful!";
            document.getElementById("responseMessage").style.color = "green";
            clearOTPs(inputs);
            localStorage.removeItem(userEmail);
        } else {
            document.getElementById("responseMessage").innerText = "❌ Verification failed. Try again.";
            document.getElementById("responseMessage").style.color = "red";
        }
    });

    resendLink.addEventListener("click", () => {
        if (userEmail) {
            generateOTPs(inputs, expire, userEmail);
        }
    });
});

