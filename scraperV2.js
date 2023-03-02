import fetch from "node-fetch";
import { load } from "cheerio";

const getData = async (url) => {
  const response = await fetch(url);
  const body = await response.text();
  return body;
};

const scrape = (body) => {
  let $ = load(body);

  let ingredientsWithQuantities = [];
  let ingredients = [];
  let method = [];
  let prep = "";
  let cook = "";
  let title = "";
  let veganBool = false;
  let glutenFreeBool = false;
  let vegetarianBool = false;
  let servings = "";
  $(".recipe-ingredients__list-item").each((_i, data) => {
    const ingredient = $(data).text();
    ingredientsWithQuantities.push(ingredient);
  });
  $(".recipe-ingredients__link").each((_i, data) => {
    const ingredient = $(data).text();
    ingredients.push(ingredient);
  });
  $(".recipe-method__list-item p").each((_i, data) => {
    const methodItem = $(data).text();
    method.push(methodItem);
  });
  title = $("h1").first().text();
  servings = $(".recipe-metadata__serving").first().text();
  prep = $(".recipe-metadata__prep-time").first().text();
  cook = $(".recipe-metadata__cook-time").first().text();

  const data = {
    name: title,
    ingredientsWithQuantities: ingredientsWithQuantities,
    ingredients: ingredients,
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

const urlLess = recipieURLs.slice(0, 10);

urlLess.forEach((url) => {
  getData(url)
    .then((result) => scrape(result))
    .then((res) => {
      console.log(res);
      //post or push requests in here
    });
});
