import fetch from "node-fetch";
import { Cheerio, load } from "cheerio";
import fs from "fs";

interface Data {
  name: string;
  ingredientsWithQuantities: string[];
  ingredients: Ingredient[];
  description: string;
  method: string[];
  prepTime: string;
  cookTime: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  servings: string;
  imgURL: string;
}
interface Ingredient {
  name: string;
}

const getData: (url: string) => Promise<string> = async (url) => {
  const response = await fetch(url);
  const body = await response.text();
  return body;
};

const scrape: (body: string) => Data = (body: string) => {
  let $ = load(body);

  let ingredientsWithQuantities: string[] = [];
  let ingredients: Ingredient[] = [];
  let describe: string = "";
  let method: string[] = [];
  let prep: string = "";
  let cook: string = "";
  let title: string = "";
  let veganBool: boolean = false;
  let glutenFreeBool: boolean = false;
  let vegetarianBool: boolean = false;
  let servings: string = "";
  let imageURL: string = "";

  (
    $(".recipe-ingredients__list-item") as unknown as Cheerio<string>
  ).each<string>(function (i: number, elem: string) {
    ingredientsWithQuantities[i] = $(this).text();
  });
  ($(".recipe-ingredients__link") as unknown as Cheerio<string>).each(
    (_i: number, data: string) => {
      const ingredient: string = $(data).text();
      ingredients.push({ name: ingredient });
    }
  );
  ($(".recipe-method__list-item p") as unknown as Cheerio<string>).each(
    (_i: number, data: string) => {
      const methodItem: string = $(data).text();
      method.push(methodItem);
    }
  );
  title = $("h1").first().text();
  servings = $(".recipe-metadata__serving").first().text();
  prep = $(".recipe-metadata__prep-time").first().text();
  cook = $(".recipe-metadata__cook-time").first().text();
  describe = $(".recipe-description__text").first().text();

  const vegetarian: string = $(
    ".recipe-metadata__dietary-vegetarian-text"
  ).text();

  if ($("div").hasClass("recipe-media")) {
    imageURL = $(".recipe-media div").find("img").attr("src") || "";
  }

  if (vegetarian.length > 0) {
    vegetarianBool = true;
  }

  if (title.toLowerCase().includes("vegan")) {
    veganBool = true;
  }

  if (title.toLowerCase().includes("gluten-free")) {
    glutenFreeBool = true;
  }

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
    imgURL: imageURL,
  };
  return data;
};

const siteMap: string = "https://www.bbc.co.uk/food/sitemap.xml";

const response = await fetch(siteMap);
const body = await response.text();

let $ = load(body);

let recipieURLs: string[] = [];
($("loc") as unknown as Cheerio<string>).each((_i: number, data: string) => {
  const url: string = $(data).text();
  if (url.includes("https://www.bbc.co.uk/food/recipes/")) {
    recipieURLs.push(url);
  }
});

// console.log(recipieURLs.length);
// 10270 recipes in recipie urls

//need to code in id?

for (let i = 0; i < 10270; i++) {
  let url: string = recipieURLs[i];
  getData(url)
    .then((result) => scrape(result))
    .then((res) => {
      // fs.appendFile("first_10_recipes.json", JSON.stringify(res), (err) => {
      //   if (err) {
      //     throw err;
      //   }
      //   console.log(res);
      // });
      // console.log(res.imgURL);
      //post or push requests in here
    });
}

//code below for testing individual recipies

// getData("https://www.bbc.co.uk/food/recipes/gluten-free_ham_and_95654")
//   .then((result) => scrape(result))
//   .then((res) => {
//     console.log(res);
//     //post or push requests in here
//   });
