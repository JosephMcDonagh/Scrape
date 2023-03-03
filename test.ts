import fetch from "node-fetch";
import { load } from "cheerio";

const url: string =
  "https://www.bbc.co.uk/food/recipes/vegan_millionaires_27753";

const response = await fetch(url);
const body = await response.text();

let $ = load(body);

const title = $("h1").first().text();

console.log(title);
