// Get DOM elements
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const btn = document.getElementById("btn");
let msg = document.getElementById("msg");

// Replace with your own API key from https://www.exchangerate-api.com/
const API_KEY = "YOUR_API_KEY_HERE";  


// ============================
// Populate the currency dropdowns
// ============================
for (let currency in countryList) {
    let option1 = document.createElement("option");
    option1.innerText = currency;     // Display text
    option1.value = currency;         // Actual value

    let option2 = option1.cloneNode(true); // Clone for the "to" select

    fromSelect.append(option1);
    toSelect.append(option2);
}

// Set default selections
fromSelect.value = "USD";
toSelect.value = "INR";

// ============================
// Function to update price using API
// ============================
async function update_price(cur1, cur2) {
    // 1. Get the entered amount
    let amountBox = document.querySelector(".amount input");
    let amount = amountBox.value;

    // 2. Validate the amount
    if (!amount || isNaN(amount)) {
        msg.innerText = "Please enter a valid amount.";
        return;
    }

    // 3. If both currencies are same, show 1:1
    if (cur1 === cur2) {
        msg.innerText = `1 ${cur1.toUpperCase()} = 1 ${cur2.toUpperCase()}`;
        return;
    }

    // 4. Build API URL
    let apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${cur1.toUpperCase()}`;

    try {
        // 5. Fetch data from API
        let response = await fetch(apiUrl);
        let data = await response.json();

        // 6. Check for success
        if (data.result !== "success") {
            throw new Error("API returned error: " + (data["error-type"] || "Unknown error"));
        }

        // 7. Get conversion rate
        let rate = data.conversion_rates[cur2.toUpperCase()];
        if (!rate) {
            throw new Error("Conversion rate for " + cur2 + " not found.");
        }

        // 8. Calculate and show the converted amount
        let total = (amount * rate).toFixed(2);
        msg.innerText = `${amount} ${cur1.toUpperCase()} = ${total} ${cur2.toUpperCase()}`;
        console.log(`1 ${cur1.toUpperCase()} = ${rate} ${cur2.toUpperCase()}`);
    } catch (error) {
        // 9. Handle any error
        console.error("Something went wrong:", error);
        msg.innerText = "Error fetching data: " + error.message;
    }
}

// ============================
// Update flag image when currency changes
// ============================

// Update "from" currency flag
fromSelect.addEventListener("change", () => {
    let img = document.getElementsByClassName("fromflag");
    img[0].src = `https://flagsapi.com/${countryList[fromSelect.value]}/flat/64.png`;
});

// Update "to" currency flag
toSelect.addEventListener("change", () => {
    let toImg = document.getElementsByClassName("toflag");
    toImg[0].src = `https://flagsapi.com/${countryList[toSelect.value]}/flat/64.png`;
});

// ============================
// Handle "Get Exchange Rate" button click
// ============================
btn.addEventListener("click", (evt) => {
    evt.preventDefault(); // Prevent page reload
    update_price(fromSelect.value, toSelect.value); // Call main function
});

// ============================
// Handle Dark Mode Toggle
// ============================
const toggleIcon = document.getElementById("themeToggle");
const icon = toggleIcon.querySelector("i");

toggleIcon.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Change icon between moon and sun
    if (document.body.classList.contains("dark")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
});

// ============================
// Handle currency switch (↔️ icon)
// ============================
const switchBtn = document.getElementById("switch");

switchBtn.addEventListener("click", () => {
    // Swap the selected values
    let temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    // Trigger change events to update flags
    fromSelect.dispatchEvent(new Event("change"));
    toSelect.dispatchEvent(new Event("change"));

    // Refresh conversion result
    update_price(fromSelect.value, toSelect.value);
});
