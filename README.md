# Práctica Playwright CLI

Suite de tests end-to-end sobre [SauceDemo](https://www.saucedemo.com) escrita con [Playwright](https://playwright.dev/), TypeScript y el patrón Page Object Model bajo principios SOLID.

## Instalación

Requiere Node.js 18+ y Java (11+) — este último solo hace falta para generar el informe Allure, no para correr los tests.

```bash
npm install
npx playwright install chromium
```

## Ejecución

```bash
npm test              # ejecuta toda la suite en headless
npm run test:headed   # con navegador visible
npm run test:ui       # UI Mode interactivo de Playwright
```

Cada ejecución genera dos reportes en paralelo (configurados en `playwright.config.ts`):

- **Playwright HTML** en `playwright-report/` — `npx playwright show-report` para abrirlo.
- **Allure** — Playwright escribe los resultados en bruto en `allure-results/`; hay que generar el HTML a partir de ahí:

```bash
npm run report:allure         # genera allure-report/ y lo abre en el navegador
npm run report:allure:serve   # genera y sirve en un servidor temporal, sin dejar carpeta persistente
```

`allure-results/` y `allure-report/` están en `.gitignore` — son artefactos regenerables, no se versionan.

### Con Docker

La imagen base (`mcr.microsoft.com/playwright:v1.63.0-noble`) ya trae Chromium y todas sus dependencias de sistema instaladas — no hace falta `npx playwright install` dentro del contenedor. 

```bash
docker build -t practica-playwright-cli:local .
docker run --rm practica-playwright-cli:local
```

El tag `v1.63.0-noble` debe coincidir con la versión instalada de `@playwright/test` en `package.json`. Si se actualiza Playwright, hay que actualizar también este tag en el `Dockerfile`, o los navegadores de la imagen quedarán desincronizados con el test runner.

## CI (GitHub Actions)

`.github/workflows/tests.yml` construye la imagen del `Dockerfile` y corre la suite dentro en cada push/PR a `main`, o manualmente desde la pestaña **Actions → Tests → Run workflow** (`workflow_dispatch`). Publica dos artefactos descargables desde la página de la ejecución (sección "Artifacts"):

- **`playwright-report`** — el reporte HTML estándar de Playwright.
- **`allure-report`** — generado con `--single-file`: los datos van embebidos en un único `index.html` (vía `data:` URIs), así que se puede abrir haciendo doble clic tras descomprimir el zip, sin necesitar un servidor local. Sin ese flag, Allure genera una SPA que hace `fetch()` a archivos JSON externos — y eso falla si se abre como `file://` en vez de servirse por HTTP.

Ambos steps de publicación usan `if: always()`, así que el reporte se genera y sube incluso si algún test falla.

## Estructura del proyecto

```
pages/       Page Objects: encapsulan locators y acciones de cada pantalla
fixtures/    Inyección de dependencias — los tests piden page objects ya construidos
tests/       Specs organizados por dominio (login, inventory, cart, checkout, session)
```

Cada Page Object hereda de `BasePage` (abstracta) y expone únicamente métodos de dominio (`login()`, `addToCart()`, `checkout()`...), nunca locators sueltos en los tests. Los tests dependen de la fixture, no de instanciar clases a mano — así un test solo declara las páginas que realmente usa.

## Metodología: tests generados con la Playwright Agent CLI + Claude Code

Esta suite **no se escribió a mano desde cero ni se grabó con `playwright codegen`** (grabación por un humano interactuando con el navegador). Se construyó con [`@playwright/cli`](https://playwright.dev/agent-cli/introduction), la CLI de Playwright pensada para que un agente de IA controle el navegador por comandos de shell, combinada con [Claude Code](https://claude.com/claude-code) como agente.

El flujo de trabajo, para cada funcionalidad nueva:

1. **El agente abre una sesión de navegador** vía CLI (`playwright-cli open <url>`).
2. **El agente ejecuta el flujo real de usuario** con comandos atómicos (`click`, `fill`, `snapshot`, `find`...), leyendo en cada paso el snapshot de accesibilidad de la página para localizar los elementos por su `ref`, exactamente igual que interactuaría una persona.
3. **Cada test-id y mensaje de error usado en el código se verifica contra el sitio real antes de escribirse** — nunca se asume un selector o un texto por convención o memoria; se comprueba con `find`/`eval`/`generate-locator` en esa misma sesión.
4. **La grabación** (`recording-start` / `recording-stop`) convierte las acciones ejecutadas por el agente en código Playwright plano, el mismo tipo de salida que produciría `codegen`, pero generado por el agente en vez de por un humano.
5. **Refactor a Page Object Model**: ese código plano nunca llega tal cual a `tests/`. El agente lo reparte en Page Objects (uno por pantalla/responsabilidad, según SRP) y los conecta a través de la fixture de inyección de dependencias.

Este proceso detectó y corrigió, sin intervención manual, un caso real de *race condition*: tras un cambio de ruta client-side de React, `Locator.allTextContents()` podía leer el DOM antes de que la lista se renderizara. Se solucionó esperando a un elemento estable de la página en vez de asumir que el contenido ya estaba listo.

## Cobertura actual

| Área | Casos |
|---|---|
| Login | credenciales válidas, usuario inexistente, usuario bloqueado, campo obligatorio vacío |
| Inventory | contador del carrito al añadir/quitar productos, ordenar por precio |
| Cart | eliminar un producto |
| Checkout | compra completa, validación de campo requerido, cancelar en cada paso |
| Sesión | logout desde el menú lateral |
