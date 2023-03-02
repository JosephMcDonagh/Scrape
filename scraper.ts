const request = require("request");
const cheerio = require("cheerio");

const url: string =
  "https://www.bbcgoodfood.com/recipes/coconut-squash-dhansak";

interface Data {
  name: string;
  ingredients: string[];
  method: string[];
}

const scraper = async (url: string): Promise<Data> => {
  let ingredients: string[] = [];
  let method: string[] = [];
  let title = "";
  const $ = await cheerio.fromURL(url);
  $(".recipe__ingredients ul li.list-item").each((_i: any, data: any) => {
    const ingredient = $(data).text();
    ingredients.push(ingredient);
  });
  $(".recipe__method-steps ul .list-item p").each((_i: any, data: any) => {
    const methodItem = $(data).text();
    method.push(methodItem);
  });
  title = $("h1").first().text();
  const data: Data = {
    name: title,
    ingredients: ingredients,
    method: method,
  };
  return data;
};

console.log(scraper(url));
