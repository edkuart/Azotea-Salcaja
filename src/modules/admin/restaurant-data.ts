import { publicEvents } from "@/modules/events/public-data";
import { menuCategories, restaurantInfo } from "@/modules/restaurant/public-data";

export const adminProducts = menuCategories.flatMap((category, categoryIndex) =>
  category.products.map((product, productIndex) => ({
    id: `${categoryIndex + 1}-${productIndex + 1}`,
    category: category.name,
    status: product.featured ? "Destacado" : "Activo",
    availability: "Disponible",
    ...product,
  })),
);

export const adminCategories = menuCategories.map((category, index) => ({
  id: `${index + 1}`,
  productCount: category.products.length,
  status: "Activa",
  sortOrder: index + 1,
  ...category,
}));

export const adminEvents = publicEvents.map((event, index) => ({
  id: `${index + 1}`,
  status: index === 0 ? "Publicado" : "Borrador",
  ...event,
}));

export const adminRestaurantProfile = {
  ...restaurantInfo,
  email: "contacto@azoteasalcaja.com",
  instagram: "@azoteasalcaja",
  facebook: "Azotea Salcajá",
};
