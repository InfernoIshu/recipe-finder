document.getElementById('searchButton').addEventListener('click', function() {
    const ingredientInput = document.getElementById('ingredientInput').value;
    // const cuisine = document.getElementById('cuisineDropdown').value;  // Get selected cuisine

    if (!ingredientInput) {
        alert('Please enter some ingredients!');
        return;
    }

    // Split the input into an array of ingredients
    const ingredients = ingredientInput.split(',').map(item => item.trim());

    // Debugging: Check the data sent to the backend
    console.log('Sending ingredients:', ingredients);
    // console.log('Selected cuisine:', cuisine);

    // Make an API call to the Python backend
    fetch('http://127.0.0.1:5000/search_recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ingredients: ingredients,
            // cuisine: cuisine  // Include selected cuisine
        })
    })
    .then(response => {
        // Debugging: Check the status of the response
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        // Debugging: Log the data returned from the backend
        console.log('Data received:', data);
        displayResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayResults(recipes) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    // Debugging: Check if recipes are being processed
    console.log('Recipes to display:', recipes);

    if (recipes.length === 0) {
        resultsContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        
        recipeElement.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" style="width: 100px; height: 100px;">
            <p><strong>Used Ingredients:</strong> ${recipe.usedIngredients.join(', ')}</p>
            <p><strong>Missed Ingredients:</strong> ${recipe.missedIngredients.join(', ')}</p>
        `;
        
        resultsContainer.appendChild(recipeElement);
    });
}
