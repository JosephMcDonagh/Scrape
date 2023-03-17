import fetch from "node-fetch";
import { Cheerio, load } from "cheerio";
import fs from "fs";

interface Data {
  name: string;
  ingredientsAndQuantities: string;
  ingredients: Ingredient[];
  description: string;
  method: string;
  prepTime: string;
  cookTime: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  servings: string;
  image: string;
}
interface Ingredient {
  name: string;
}

function addRecipe(recipe: string[]) {
  const response = fetch("http://localhost:8081/api/v1/recipes/all", {
    method: "POST",
    body: JSON.stringify(recipe),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const getData: (url: string) => Promise<string> = async (url) => {
  const response = await fetch(url);
  const body = await response.text();
  return body;
};

const scrape: (body: string) => Promise<Data> = async (body: string) => {
  let $ = load(body);

  let ingredientsAndQuantities: string = "";
  let ingredients: Ingredient[] = [];
  let describe: string = "";
  let method: string = "";
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
    ingredientsAndQuantities = ingredientsAndQuantities + "$" + $(this).text();
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
      method = method + "$" + methodItem;
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

  let ingredientsAsStrings: string[] = [];
  let ingredientsUniqueObj: Ingredient[] = [];
  for (let i = 0; i < ingredients.length; i++) {
    ingredientsAsStrings.push(JSON.stringify(ingredients[i]));
  }
  const ingredientsUniqueStrings = Array.from(new Set(ingredientsAsStrings));
  for (let i = 0; i < ingredientsUniqueStrings.length; i++) {
    ingredientsUniqueObj.push(JSON.parse(ingredientsUniqueStrings[i]));
  }

  await sleep(200);

  const data: Data = {
    name: title,
    ingredientsAndQuantities: ingredientsAndQuantities,
    ingredients: ingredientsUniqueObj,
    description: describe,
    method: method,
    prepTime: prep,
    cookTime: cook,
    vegetarian: vegetarianBool,
    vegan: veganBool,
    glutenFree: glutenFreeBool,
    servings: servings,
    image: imageURL,
  };
  return data;
};

let recipesURLs: string[];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

fs.readFile(
  "all_recipes.json",
  "utf-8",
  async (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
      throw err;
    }
    recipesURLs = JSON.parse(data);
    console.log(recipesURLs.length);
    // for (let i = 10000; i < 10200; i++) {
    //   let url: string = recipesURLs[i];
    //   console.log(i);
    //   getData(url)
    //     .then((result) => scrape(result))
    //     .then((res) => {
    //       if (res.image !== "") {
    //         fs.appendFile(
    //           "all_recipes.json",
    //           JSON.stringify(res) + ",",
    //           (err) => {
    //             if (err) {
    //               throw err;
    //             }
    //           }
    //         );
    //       }
    //       // addRecipe(res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  }
);

// getData("https://www.bbc.co.uk/food/recipes/almond_and_lemon_polenta_21317")
//   .then((result) => scrape(result))
//   .then((res) => console.log(res));

//
//
//
// fs.appendFile(
//   "first_10_recipes.json",
//   JSON.stringify(res) + ",",
//   (err) => {
//     if (err) {
//       throw err;
//     }
//   }
// );

//
//
// const siteMap: string = "https://www.bbc.co.uk/food/sitemap.xml";

// const response = await fetch(siteMap);
// const body = await response.text();

// let $ = load(body);

// let recipieURLs: string[] = [];
// ($("loc") as unknown as Cheerio<string>).each((_i: number, data: string) => {
//   const url: string = $(data).text();
//   if (url.includes("https://www.bbc.co.uk/food/recipes/")) {
//     recipieURLs.push(url);
//   }
// });
// fs.writeFile("recipeURL.json", JSON.stringify(recipieURLs), (err) => {
//   if (err) {
//     throw err;
//   }
// });

// 10200 recipes in recipie urls
