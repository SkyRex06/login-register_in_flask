document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const passwordFields = document.querySelectorAll(".password-toggle");

    passwordFields.forEach(field => {
        const toggleButton = field.nextElementSibling;
        toggleButton.addEventListener("click", () => {
            if (field.type === "password") {
                field.type = "text";
                toggleButton.textContent = "🙈";
            } else {
                field.type = "password";
                toggleButton.textContent = "👁️";
            }
        });
    });

    const validateInput = (input, regex, errorMsg) => {
        input.addEventListener("input", () => {
            if (!regex.test(input.value)) {
                input.setCustomValidity(errorMsg);
            } else {
                input.setCustomValidity("");
            }
        });
    };

    if (signupForm) {
        const email = document.getElementById("signup-email");
        const password = document.getElementById("signup-password");
        
        validateInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email");
        validateInput(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "Password must be at least 8 characters long, contain a number and an uppercase letter.");
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            
            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("token", data.token);
                    alert("Login successful!");
                    window.location.href = "/dashboard";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert("Error logging in. Please try again later.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            
            try {
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                if (response.ok) {
                    alert("Signup successful! Please check your email for verification.");
                    window.location.href = "/login";
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert("Error signing up. Please try again later.");
            }
        });
    }
});
