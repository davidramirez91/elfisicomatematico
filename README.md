# EL FÍSICO MATEMÁTICO — sitio estático

Proyecto realizado únicamente con **HTML, CSS y JavaScript**, preparado para publicarse en **GitHub Pages**.

## Estructura

```text
el-fisico-matematico/
├── index.html
├── .nojekyll
├── README.md
├── templates/
│   ├── inicio.html
│   ├── elfisicomatematico.html
│   ├── formulario.html
│   └── contactos.html
└── static/
    ├── css/
    │   ├── styles.css
    │   └── formulario.css
    ├── js/
    │   └── app.js
    └── img/
        ├── logo.png
        ├── favicon.png
        ├── og-cover.png
        ├── albert-einsteing.png
        ├── homero.png
        ├── whatsapp.gif
        └── ubicacion.png
```

## Cómo probarlo localmente

Las plantillas se cargan con `fetch()`, por lo que no debe abrirse `index.html` directamente con `file://`.

### Opción 1: Visual Studio Code

1. Instala la extensión **Live Server**.
2. Abre la carpeta del proyecto.
3. Haz clic derecho en `index.html`.
4. Selecciona **Open with Live Server**.

### Opción 2: Python

Desde la carpeta del proyecto ejecuta:

```bash
python -m http.server 5500
```

Luego abre:

```text
http://localhost:5500
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube todo el contenido de esta carpeta a la rama `main`.
3. En GitHub entra en **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/root`.
6. Guarda los cambios.

La navegación usa direcciones con hash, por ejemplo `#inicio` y `#formulario`, por lo que no necesita configuración adicional de rutas.

## Ajustes obligatorios antes de publicar

### 1. Metadatos sociales

En `index.html`, reemplaza:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

por la dirección real de GitHub Pages. Debes cambiarla en:

- `canonical`
- `og:url`
- `og:image`
- `twitter:image`

La imagen social incluida mide **2130 × 1000 px**, conservando la proporción 213:100 solicitada.

### 2. Telegram

En `templates/contactos.html`, reemplaza:

```text
TU_USUARIO_TELEGRAM
```

por el usuario real de Telegram, sin `@`.

### 3. Facebook e Instagram

En `index.html`, cambia los enlaces genéricos de Facebook e Instagram por los perfiles oficiales.

### 4. Recursos gráficos

Se incluyeron recursos gráficos provisionales y funcionales con los nombres requeridos. Puedes reemplazarlos sin modificar el código, conservando exactamente estos nombres:

- `static/img/logo.png`
- `static/img/albert-einsteing.png`
- `static/img/homero.png`
- `static/img/whatsapp.gif`
- `static/img/ubicacion.png`

## Cómo agregar fórmulas

Abre `templates/formulario.html`, localiza el bloque correspondiente y agrega fórmulas entre delimitadores LaTeX:

```html
$$
  \int_a^b f(x)\,dx = F(b)-F(a)
$$
```

También puedes usar:

```html
\[
  e^{i\pi}+1=0
\]
```

Para añadir una tarjeta nueva:

```html
<section class="formula-card">
  <h3>Nombre del tema</h3>
  $$ fórmula $$
</section>
```

Usa `class="formula-card wide"` cuando la tarjeta deba ocupar las dos columnas.

## Impresión A4

Cada tema del formulario tiene su propio botón **Imprimir este formulario**. Al pulsarlo:

- se abre una pestaña nueva;
- se carga únicamente el tema seleccionado;
- se generan las ecuaciones con MathJax;
- aparece el logo en el encabezado;
- se añade una marca de agua transparente;
- se muestran dirección y contactos en el pie;
- se puede imprimir o elegir **Guardar como PDF**.

## Dependencia externa

El sitio usa MathJax desde CDN para representar LaTeX. Por ello, la primera carga de fórmulas requiere conexión a internet.
