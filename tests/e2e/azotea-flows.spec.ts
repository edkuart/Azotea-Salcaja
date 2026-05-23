import { expect, type Page, test } from "@playwright/test";

async function capture(page: Page, name: string) {
  await page.screenshot({
    fullPage: true,
    path: `test-results/screenshots/${test.info().project.name.replace(/\s+/g, "-").toLowerCase()}-${name}.png`,
  });
}

test.describe("public restaurant flows", () => {
  test("home, menu, events, contact and chess pages render", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Azotea Salcajá" })).toBeVisible();
    await capture(page, "home");

    await page
      .locator("header nav")
      .getByRole("link", { exact: true, name: "Menu" })
      .click();
    await expect(page).toHaveURL("/menu");
    await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
    await expect(page.getByText("Hamburguesa Salcajá")).toBeVisible();
    await capture(page, "menu");

    await page
      .locator("header nav")
      .getByRole("link", { exact: true, name: "Eventos" })
      .click();
    await expect(page).toHaveURL("/eventos");
    await expect(page.getByRole("heading", { name: "Eventos y comunidad" })).toBeVisible();
    await capture(page, "eventos");

    await page
      .locator("header nav")
      .getByRole("link", { exact: true, name: "Contacto" })
      .click();
    await expect(page).toHaveURL("/contacto");
    await expect(page.getByRole("heading", { name: "Visitanos en Salcajá" })).toBeVisible();
    await capture(page, "contacto");

    await page
      .locator("header nav")
      .getByRole("link", { exact: true, name: "Ajedrez" })
      .click();
    await expect(page).toHaveURL("/ajedrez");
    await expect(page.getByRole("heading", { name: "Ajedrez en Azotea" })).toBeVisible();
    await capture(page, "ajedrez");
  });
});

test.describe("official chess tournament flows", () => {
  test("official tournament listing and detail show standings, podium and rounds", async ({ page }) => {
    await page.goto("/ajedrez/torneos");
    await expect(page.getByRole("heading", { name: "Torneos de la comunidad" })).toBeVisible();
    await expect(page.getByText("Rapid nocturno de lunes")).toBeVisible();
    await capture(page, "torneos-oficiales");

    await page.getByRole("link", { name: "Ver torneo" }).first().click();
    await expect(page).toHaveURL("/ajedrez/torneos/rapid-nocturno-lunes");
    await expect(page.getByRole("heading", { name: "Rapid nocturno de lunes" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Posiciones destacadas" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Historial de rondas" })).toBeVisible();
    await capture(page, "torneo-oficial-detalle");
  });
});

test.describe("admin restaurant and chess flows", () => {
  test("admin pages render restaurant and chess management screens", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Resumen del restaurante" })).toBeVisible();
    await capture(page, "admin-resumen");

    await page
      .locator("aside nav")
      .getByRole("link", { exact: true, name: "Productos" })
      .click();
    await expect(page).toHaveURL("/admin/productos");
    await expect(page.getByRole("heading", { name: "Productos" })).toBeVisible();
    await capture(page, "admin-productos");

    await page.goto("/admin/ajedrez/torneos");
    await expect(page.getByRole("heading", { name: "Torneos oficiales" })).toBeVisible();
    await page.getByRole("link", { name: "Administrar" }).first().click();
    await expect(page).toHaveURL("/admin/ajedrez/torneos/azotea-rapid-nocturno-1");
    await expect(page.getByRole("heading", { name: "Rapid nocturno de lunes" })).toBeVisible();
    await capture(page, "admin-ajedrez-detalle");
  });
});

test.describe("private tournament flow", () => {
  test("creates a private tournament link and opens the casual admin", async ({ page }) => {
    await page.goto("/ajedrez/crear");
    await expect(page.locator("h1")).toHaveText("Crear torneo rapido");

    await page.getByLabel("Nombre").fill("Torneo QA");
    await page.getByLabel("Rondas").fill("5");
    await page.getByLabel("Jugadores, uno por linea").fill("Ana\nLuis\nSofia\nMarco\nElena");
    await capture(page, "privado-crear");

    await Promise.all([
      page.waitForURL(/\/ajedrez\/privado\/.+\/admin/),
      page.getByRole("link", { name: "Abrir administrador" }).click(),
    ]);
    await expect(page.url()).toContain("/ajedrez/privado/");
    await expect(page.url()).toContain("/admin");
    await expect(page.getByText("Administracion casual")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Torneo QA" })).toBeVisible();
    await capture(page, "privado-admin");

    await Promise.all([
      page.waitForURL((url) => {
        const path = url.pathname;
        return path.startsWith("/ajedrez/privado/") && !path.endsWith("/admin");
      }),
      page.getByRole("link", { name: "Vista compartida" }).click(),
    ]);
    await expect(page.url()).not.toContain("/admin");
    await expect(page.getByText("Torneo privado casual")).toBeVisible();
    await capture(page, "privado-vista");
  });
});
