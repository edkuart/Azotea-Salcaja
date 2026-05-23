export const restaurantInfo = {
  name: "Azotea Salcaja",
  tagline: "Sabores para compartir sobre Salcaja",
  description:
    "Restaurante local con menu casual, eventos de comunidad y noches de ajedrez los lunes.",
  phone: "+502 0000 0000",
  whatsapp: "50200000000",
  address: "Salcaja, Quetzaltenango, Guatemala",
  mapsUrl: "https://maps.google.com/?q=Salcaja%2C%20Quetzaltenango",
  hours: [
    { day: "Lunes", time: "5:00 p.m. - 10:00 p.m." },
    { day: "Martes a viernes", time: "12:00 p.m. - 10:00 p.m." },
    { day: "Sabado", time: "12:00 p.m. - 11:00 p.m." },
    { day: "Domingo", time: "12:00 p.m. - 9:00 p.m." },
  ],
  heroImage:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80",
  terraceImage:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
};

export const menuCategories = [
  {
    name: "Entradas",
    description: "Platos para abrir mesa y compartir.",
    products: [
      {
        name: "Nachos de la casa",
        description: "Totopos, queso fundido, frijol, pico de gallo y salsa.",
        price: "Q45",
        featured: true,
        image:
          "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Papas azotea",
        description: "Papas crujientes con aderezo especial.",
        price: "Q35",
        featured: false,
        image:
          "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Fuertes",
    description: "Opciones completas para almuerzo o cena.",
    products: [
      {
        name: "Hamburguesa Salcaja",
        description: "Carne, queso, vegetales frescos y papas.",
        price: "Q58",
        featured: true,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Pizza artesanal",
        description: "Masa delgada, salsa de tomate y mezcla de quesos.",
        price: "Q72",
        featured: false,
        image:
          "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    name: "Bebidas",
    description: "Refrescos, cafe y bebidas para acompanar.",
    products: [
      {
        name: "Limonada natural",
        description: "Preparada al momento.",
        price: "Q18",
        featured: false,
        image:
          "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Cafe de la casa",
        description: "Cafe caliente servido fresco.",
        price: "Q16",
        featured: false,
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

export const featuredProducts = menuCategories
  .flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      category: category.name,
    })),
  )
  .filter((product) => product.featured);
