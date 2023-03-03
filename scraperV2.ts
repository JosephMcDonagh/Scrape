import fetch from "node-fetch";
import { load } from "cheerio";

interface Data {
  name: string;
  ingredientsWithQuantities: string[];
  ingredients: string[];
  description: string;
  method: string[];
  prepTime: string;
  cookTime: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  servings: string;
}

const getData: (url: string) => Promise<string> = async (url) => {
  const response = await fetch(url);
  const body = await response.text();
  return body;
};

const scrape = (body) => {
  let $ = load(body);

  let ingredientsWithQuantities: string[] = [];
  let ingredients: string[] = [];
  let describe: string = "";
  let method: string[] = [];
  let prep: string = "";
  let cook: string = "";
  let title: string = "";
  let veganBool: boolean = false;
  let glutenFreeBool: boolean = false;
  let vegetarianBool: boolean = false;
  let servings: string = "";
  $(".recipe-ingredients__list-item").each((_i, data) => {
    const ingredient: string = $(data).text();
    ingredientsWithQuantities.push(ingredient);
  });
  $(".recipe-ingredients__link").each((_i, data) => {
    const ingredient: string = $(data).text();
    ingredients.push(ingredient);
  });
  $(".recipe-method__list-item p").each((_i, data) => {
    const methodItem: string = $(data).text();
    method.push(methodItem);
  });
  title = $("h1").first().text();
  servings = $(".recipe-metadata__serving").first().text();
  prep = $(".recipe-metadata__prep-time").first().text();
  cook = $(".recipe-metadata__cook-time").first().text();

  const data: Data = {
    name: title,
    ingredientsWithQuantities: ingredientsWithQuantities,
    ingredients: ingredients,
    description: describe,
    method: method,
    prepTime: prep,
    cookTime: cook,
    vegetarian: vegetarianBool,
    vegan: veganBool,
    glutenFree: glutenFreeBool,
    servings: servings,
  };
  return data;
};

const siteMap = "https://www.bbc.co.uk/food/sitemap.xml";

const response = await fetch(siteMap);
const body = await response.text();

let $ = load(body);

let recipieURLs = [];
$("loc").each((_i, data) => {
  const url = $(data).text();
  if (url.includes("https://www.bbc.co.uk/food/recipes/")) {
    recipieURLs.push(url);
  }
});

//10257 recipes in recipie urls

//need to code in vegetarian, vegan, glutenfree, descriptions, id?

for (let i = 0; i < 10257; i++) {
  let url = recipieURLs[i];
  getData(url)
    .then((result) => scrape(result))
    .then((res) => {
      console.log(res);
      //post or push requests in here
    });
}
