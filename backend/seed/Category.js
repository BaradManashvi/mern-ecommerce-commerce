const Category = require("../models/Category");

const categories = [
  { _id: "65a7e24602e12c44f599442c", name: "Womens Tops" },
  { _id: "65a7e24602e12c44f599442d", name: "Womens Dresses" },
  { _id: "65a7e24602e12c44f599442e", name: "Girls Dresses" },
  { _id: "65a7e24602e12c44f599442f", name: "Ladies Skincare" },
  { _id: "65a7e24602e12c44f5994430", name: "Womens Shoes" },
  { _id: "65a7e24602e12c44f5994431", name: "Girls Shoes" },
  { _id: "65a7e24602e12c44f5994432", name: "Womens Bags" },
  { _id: "65a7e24602e12c44f5994433", name: "Womens Jewellery" },
  { _id: "65a7e24602e12c44f5994434", name: "Ladies Watches" },
  { _id: "65a7e24602e12c44f5994435", name: "Girls Accessories" },
  { _id: "65a7e24602e12c44f5994436", name: "Womens Sunglasses" },
  { _id: "65a7e24602e12c44f5994437", name: "Ladies Handbags" },
  { _id: "65a7e24602e12c44f5994438", name: "Girls Tops" },
  { _id: "65a7e24602e12c44f5994439", name: "Womens Footwear" },
  { _id: "65a7e24602e12c44f599443a", name: "Girls Footwear" },
  { _id: "65a7e24602e12c44f599443b", name: "Ladies Outerwear" },
  { _id: "65a7e24602e12c44f599443c", name: "Womens Scarves" },
  { _id: "65a7e24602e12c44f599443d", name: "Girls T-Shirts" },
  { _id: "65a7e24602e12c44f599443e", name: "Ladies Lounge Wear" },
  { _id: "65a7e24602e12c44f599443f", name: "Womens Activewear" },
  // Popular extra categories
  { _id: "65a7e24602e12c44f5994440", name: "Womens Lingerie" },
  { _id: "65a7e24602e12c44f5994441", name: "Girls Leggings & Pants" },
  { _id: "65a7e24602e12c44f5994442", name: "Womens Jackets & Coats" },
  { _id: "65a7e24602e12c44f5994443", name: "Girls Hoodies & Sweatshirts" },
  { _id: "65a7e24602e12c44f5994444", name: "Womens Swimwear" },
  { _id: "65a7e24602e12c44f5994445", name: "Ladies Hand Gloves & Accessories" },
  { _id: "65a7e24602e12c44f5994446", name: "Womens Belts" },
  { _id: "65a7e24602e12c44f5994447", name: "Girls Hair Accessories" },
  { _id: "65a7e24602e12c44f5994448", name: "Womens Beauty Products" },
];

exports.seedCategory = async () => {
  try {
    await Category.insertMany(categories);
    console.log("Category seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
