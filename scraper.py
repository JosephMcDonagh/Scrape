import requests
import re

URL = "https://www.bbcgoodfood.com/recipes/spiced-carrot-lentil-soup"
page = requests.get(URL)

def ingredients_big(page):
    ingredients_unformatted = re.search(r'(?<=data-feature="Recipe Instructions"><h2 class="mb-md section-heading-1">Ingredients<\/h2>)(.*)(?=class="recipe__method-steps mb-lg col-12 col-lg-6")', page)

    f = open("carot_and_lentil.txt", "w")
    f.write(str(ingredients_unformatted.group()))
    f.close


ingredients_big(page)
