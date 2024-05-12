let apiRoute;  // API Route (e.g. "https://api.api-ninjas.com/v1/logo")
const actionUrl =
    document.getElementById('ninja-api-form')
        .getAttribute('action');  // Get the action URL of the form

/* Hides both fieldset of logo and facts when reset button is clicked */
document.querySelector('[type="reset"]').addEventListener('click', function (event) {
    document.querySelectorAll('#ninja-api-form  fieldset:not(:first-child)').forEach(fieldset => {
        fieldset.style.display = 'none';
    });
});

/* Add event listener when radio selection changed */
document.addEventListener('change', function (event) {
    let targetElement = event.target;  // Get the element which triggered the event

    if (event.target.matches('#logo')) {
        document.getElementById('logo-fields').style.display = 'block';
        document.getElementById('facts-fields').style.display = 'none';
    } else if (event.target.matches('#facts')) {
        document.getElementById('logo-fields').style.display = 'none';
        document.getElementById('facts-fields').style.display = 'block';
    } else {
        // This can happen when the reset button of the form is clicked
        return null;
    }

    // Update API Base Endpoint
    apiRoute = actionUrl + `/${targetElement.value}`;
});

/* Execute your API call when the Get Response button is clicked */
document.querySelector(".form-buttons button[type='button']").addEventListener('click', function (event) {
    // Check if user has "API_NINJA_KEY" on their local storage.
    if (localStorage.getItem('API_NINJA_KEY') === null) {
        // Prompt the User for their Ninja API Key
        const ninjaApiUserInput = prompt("Please Enter your Ninja API Key");

        // Check for the possibility of null value
        if (ninjaApiUserInput === null) {
            alert("API Key is null.")
            return undefined;
        }

        // Check if user entered spaces only
        if (ninjaApiUserInput.trim() === "") {
            alert("The API Key cannot be empty string or spaces.")
            return undefined;
        }

        // Set their Ninja API Key on their local storage
        localStorage.setItem('API_NINJA_KEY', ninjaApiUserInput)
    }

    let endpoint;
    try {
        endpoint = document.getElementById('ninja-api-form')
            .querySelector('input[name="endpoint"]:checked').value;
    } catch (error) {
        if (error instanceof TypeError) {
            alert("Please select an API before clicking the 'Get Response' button!");
            return null;
        }
    }

    let form = document.getElementById('ninja-api-form');  // Ninja API Form object
    let url;  // Full url for the GET request
    let params;  // URL parameter(s)

    if (endpoint === 'logo') {
        let inputName = form.querySelector('#input-logo-name').value;

        // Check if user input is blank or only spaces
        if (inputName.trim().length === 0) {
            alert("The Company Name or Ticker cannot be Blank or Spaces!");
            throw new Error("The Company Name or Ticker cannot be Blank or Spaces!");
        }

        // Construct the URL parameters
        params = "name=" + encodeURIComponent(inputName);
    } else if (endpoint === 'facts') {
        let inputLimit = parseInt(form.querySelector('#input-facts-limit').value);

        // Check if NaN
        if (isNaN(inputLimit)) {
            alert("The Number of Facts is NaN!");
            throw new Error("The Number of Facts is NaN!");
        }

        // Check if invalid range for number of facts
        if (inputLimit < 1 || inputLimit > 100) {
            alert("The Number of Facts to Generate must be between 1 and 30!");
            throw new Error("The Number of Facts to Generate must be between 1 and 30!");
        }

        // params = "limit=" + encodeURIComponent(inputLimit);
        // Warn: Ninja API updated the 'limit' parameter for Facts API (premium)
        // https://api-ninjas.com/api/facts
        params = "";
    } else {
        throw new Error("Something went wrong");
    }

    url = apiRoute + '?' + params;

    // Fetch Response (and handle any API Call errors)
    clearDisplay();  // Clear previous display result
    const requestConfig = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": localStorage.getItem('API_NINJA_KEY')
        }
    }

    displayResult(endpoint, url, requestConfig);
});

function displayResult(endpoint, url, requestConfig) {
    let displayArea = document.querySelector("#display-area");

    fetch(url, requestConfig).then(function (response) {
        if (!response.ok) {
            // If response is not OK (status code outside 200-299 range)
            return response.text().then(errorMsg => {
                throw new Error('Error ' + response.status + ': ' + JSON.parse(errorMsg)['error']);
            });
        }

        // Parse the JSON response and return for data processing
        return response.json();
    }).then(function (data) {
        let heading;  // <h3> inside the display area
        switch (endpoint) {
            case 'logo':  // Execute for Logo API
                // Get and Store the data properties
                let dataCompanyName;
                let dataCompanyTicker;
                let dataImageUrl;
                for (let obj of data) {
                    dataCompanyName = obj["name"];
                    dataCompanyTicker = obj["ticker"];
                    dataImageUrl = obj["image"];
                }

                // Create the heading for display area
                heading = document.createElement("h3");  // Create an <image> element
                heading.innerHTML = `Hope you like the logo!`;
                displayArea.prepend(heading);

                // Create an <image> element for the Logo
                let imageElement = document.createElement("img");
                displayArea.appendChild(imageElement);  // Append the image as a child of <div>

                // Modify the Image Element
                imageElement.src = dataImageUrl;
                imageElement.alt = `Logo for ${dataCompanyName}`;
                break;
            case 'facts':  // Execute for Facts API
                // Create a Table with 1 Column to List all the Facts
                let table = document.createElement("table");
                displayArea.appendChild(table);  // Append the table as a child of display <div>

                // Arrow Function to Append descendants <tr><td>...</td></tr> to <table>
                const addTableData = (fact_) => {
                    let tr = document.createElement("tr");
                    let td = document.createElement("td");
                    table.appendChild(tr);
                    tr.appendChild(td);  // Append <td> to <tr>
                    td.innerHTML = fact_;  // Put the fact string to the Inner HTML of the table data
                };

                // Get and Store the data properties
                let fact;
                for (let obj of data) {
                    fact = obj["fact"];
                    addTableData(fact);
                }

                // Create the heading for display area
                heading = document.createElement("h3");  // Create an <image> element
                heading.innerHTML = 'Hope you like the fact!';
                displayArea.prepend(heading);
                break;
            default:
                throw new Error("Something went wrong!");
        }
    }).catch(function (error) {
        let errorMessage = `${error.message}`;

        // Invalid API Key
        if (error.message.includes('Invalid API Key.')) {
            // Do not store invalid API Key and remove "API_NINJA_KEY" in local storage.
            clearApiKey();
        }

        // alert(errorMessage);
        document.querySelector("#display-area").innerHTML = errorMessage;
        console.error('There was an error with processing the data.', error);
    });
}

/* Clearing Contents of Display Area */
function clearDisplay() {
    document.getElementById('display-area').innerHTML = null;
}

function clearApiKey() {
    // Remove API Key from Local Storage
    localStorage.removeItem('API_NINJA_KEY');
}
