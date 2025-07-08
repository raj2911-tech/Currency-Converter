const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const btn = document.getElementById("btn");
let msg = document.getElementById("msg");

const API_KEY = "YOUR_API_KEY_HERE";  

// Load All currency list into HTML page.
for (let currency in countryList) {
    let option1 = document.createElement("option");
    option1.innerText = currency;
    option1.value = currency;

    let option2 = option1.cloneNode(true);
    fromSelect.append(option1);
    toSelect.append(option2);
}

fromSelect.value = "USD";
toSelect.value = "INR";


// Make this function asynchronous
async function update_price(cur1, cur2) {
    // Step 1: Get the amount entered by user
    let amountBox = document.querySelector(".amount input");
    let amount = amountBox.value;

    // Step 2: Check if amount is valid
    if (!amount || isNaN(amount)) {
        msg.innerText = "Please enter a valid amount.";
        return;
    }

    // Step 3: If both currencies are the same
    if (cur1 === cur2) {
        msg.innerText = `1 ${cur1.toUpperCase()} = 1 ${cur2.toUpperCase()}`;
        return;
    }

    // Step 4: Build API URL
    let apiUrl = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${cur1.toUpperCase()}`;

    try {
        // Step 5: Fetch data using await
        let response = await fetch(apiUrl);
        let data = await response.json();

        // Step 6: Check if API call was successful
        if (data.result !== "success") {
            throw new Error("API returned error: " + (data["error-type"] || "Unknown error"));
        }

        // Step 7: Get the conversion rate
        let rate = data.conversion_rates[cur2.toUpperCase()];

        if (!rate) {
            throw new Error("Conversion rate for " + cur2 + " not found.");
        }

        // Step 8: Calculate and display result
        let total = (amount * rate).toFixed(2);
        msg.innerText = `${amount} ${cur1.toUpperCase()} = ${total} ${cur2.toUpperCase()}`;
        console.log(`1 ${cur1.toUpperCase()} = ${rate} ${cur2.toUpperCase()}`);
    } catch (error) {
        // Step 9: Catch and show any error
        console.error("Something went wrong:", error);
        msg.innerText = "Error fetching data: " + error.message;
    }
}


// Update flags (assuming countryList maps currency codes to country codes)
fromSelect.addEventListener("change", () => {
    let img = document.getElementsByClassName("fromflag");
    img[0].src = `https://flagsapi.com/${countryList[fromSelect.value]}/flat/64.png`;
});

toSelect.addEventListener("change", () => {
    let toImg = document.getElementsByClassName("toflag");
    toImg[0].src = `https://flagsapi.com/${countryList[toSelect.value]}/flat/64.png`;
});

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    update_price(fromSelect.value, toSelect.value);
});
