let expireInterval = null;
emailjs.init("fdBhukiJH5a0L2FUa"); // Replace with your Public Key

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("userEmail"),
          sendOTPButton = document.getElementById("sendOTP"),
          emailMessage = document.getElementById("emailMessage"),
          emailDisplay = document.getElementById("emailDisplay"),
          inputs = document.querySelectorAll("input[type='number']"),
          verifyButton = document.getElementById("verifyOTP"),
          resendLink = document.getElementById("resendOTP"),
          expire = document.querySelector("#expire");

    let userEmail = sessionStorage.getItem("userEmail");

    // If user is on OTP page and email not found, redirect to email input page
    if (emailDisplay && !userEmail) {
        window.location.href = "index.html";
        return;
    }

    // Display email on OTP page
    if (emailDisplay) {
        emailDisplay.innerText = userEmail;
        generateOTPs(); // Auto-send OTP when landing on verification page
    }

    // Function to validate email format
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // Function to send OTP
    function generateOTPs() {
        let storedOTP = sessionStorage.getItem("OTP");
    
        if (!storedOTP) { // Only generate if no OTP exists
            let OTP = Math.floor(1000 + Math.random() * 9000).toString();
            console.log("Generated OTP:", OTP);
    
            emailjs.send("service_07esa9d", "template_h2q7mxr", {
                otp_code: OTP,
                to_email: userEmail
            }).then(response => {
                console.log("Email sent successfully:", response);
            }).catch(error => {
                console.log("Email failed to send:", error);
            });
    
            sessionStorage.setItem("OTP", OTP);
        }
    
        expire.innerText = 30;
        clearInterval(expireInterval);
        expireInterval = setInterval(() => {
            expire.innerText--;
            if (expire.innerText == "0") {
                clearInterval(expireInterval);
            }
        }, 1000);
    
        resetOTPInputs(); // Enable first input
    }
    
    // Handle Email Submission (Page 1)
    if (sendOTPButton) {
        sendOTPButton.addEventListener("click", () => {
            let email = emailInput.value.trim();

            if (!validateEmail(email)) {
                emailMessage.innerText = "❌ Please enter a valid email.";
                emailMessage.style.color = "red";
                return;
            }

            // Store email in session storage & redirect to OTP page
            sessionStorage.setItem("userEmail", email);
            window.location.href = "verification.html";
        });
    }

    // Handle OTP input (Page 2)
    function resetOTPInputs() {
        inputs.forEach(input => {
            input.value = "";
            input.setAttribute("disabled", true);
        });

        inputs[0].removeAttribute("disabled");
        inputs[0].focus();
    }

    if (inputs.length > 0) {
        resetOTPInputs(); // Reset inputs on page load

        inputs.forEach((input, index) => {
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "").slice(0, 1); // Allow only 1 digit

                if (this.value !== "" && index < inputs.length - 1) {
                    inputs[index + 1].removeAttribute("disabled");
                    inputs[index + 1].focus();
                }

                checkOTPCompletion();
            });

            input.addEventListener("keydown", function (e) {
                if (e.key === "Backspace" && this.value === "" && index > 0) {
                    inputs[index - 1].focus();
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
        
            const storedOTP = sessionStorage.getItem("OTP");
        
            // Disable button & change text to "Verifying..."
            verifyButton.innerText = "Verifying...";
            verifyButton.setAttribute("disabled", true);
        
            setTimeout(() => {
                if (enteredOTP === storedOTP) {
                    document.getElementById("responseMessage").innerText = "✅ Verification successful!";
                    document.getElementById("responseMessage").style.color = "green";
                    sessionStorage.removeItem("OTP");
        
                    // Redirect to success page
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1000); // Redirect after 1 second
                } else {
                    document.getElementById("responseMessage").innerText = "❌ Verification failed. Try again.";
                    document.getElementById("responseMessage").style.color = "red";
        
                    // Reset OTP inputs
                    resetOTPInputs();
        
                    // Change button back to original state
                    verifyButton.innerText = "Verify OTP";
                    verifyButton.removeAttribute("disabled");
                }
            }, 5000); // 5-second delay
        });
        

        resendLink.addEventListener("click", () => {
            generateOTPs();
        });
    }
});
