import fetch from "node-fetch";
import { load } from "cheerio";

const url = "https://www.bbc.co.uk/food/sitemap.xml";

const response = await fetch(url);
const body = await response.text();

let $ = load(body);

let recipieURLs = [];
$("loc").each((_i, data) => {
  const ingredient = $(data).text();
  if (ingredient.includes("https://www.bbc.co.uk/food/recipes/")) {
    recipieURLs.push(ingredient);
  }
});
