
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Your Spoonacular API Key
API_KEY = 'c7fdf8daa93d4c17aa2d4f645a23d59a'

# API route to search for recipes based on ingredients and cuisine
@app.route('/search_recipes', methods=['POST'])
def search_recipes():
    data = request.json
    ingredients = data.get('ingredients', [])
    cuisine = data.get('cuisine', '')

    if not ingredients:
        return jsonify({'error': 'No ingredients provided'}), 400

    # Format the ingredients into a comma-separated string for the API
    ingredient_string = ','.join(ingredients)

    # Build the Spoonacular API URL with optional cuisine
    api_url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredient_string}&apiKey={API_KEY}"
    
    # if cuisine:
    #     api_url += f"&cuisine={cuisine}"

    # Call Spoonacular API
    response = requests.get(api_url)
    print(f"Request URL: {api_url}")  # Debugging: print the API URL
    print(f"Response Status Code: {response.status_code}")  # Debugging: print the status code

    if response.status_code == 200:
        recipes = response.json()
        print(f"Spoonacular Response: {recipes}")  # Debugging: print the API response

        # Format and return the data to the frontend
        result = [
            {
                'name': recipe['title'],
                'image': recipe.get('image', ''),
                'usedIngredients': [ingredient['name'] for ingredient in recipe['usedIngredients']],
                'missedIngredients': [ingredient['name'] for ingredient in recipe['missedIngredients']]
            }
        for recipe in recipes]
        return jsonify(result), 200
    else:
        return jsonify({'error': 'Error fetching recipes from Spoonacular'}), 500

if __name__ == '__main__':
    app.run(debug=True)
