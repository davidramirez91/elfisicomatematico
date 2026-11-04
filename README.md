# EL FÍSICO MATEMÁTICO — sitio web estático

Sitio desarrollado con **HTML, CSS y JavaScript**, preparado para **GitHub Pages**. Se mantiene el diseño original, los temas claro/oscuro, el motor de rutas con `#hash`, MathJax y la impresión A4 por formulario.

## Estructura actual

```text
el-fisico-matematico/
├── index.html
├── .nojekyll                         # Conserva el archivo original, si existe
├── README.md
├── rclone.html                       # Página técnica independiente
├── rclone-privacy.html               # Política de privacidad independiente
├── templates/
│   ├── inicio.html
│   ├── elfisicomatematico.html
│   ├── contactos.html
│   ├── formulario_identidades.html
│   ├── formulario_logaritmos.html
│   ├── formulario_derivadas.html     # Incluye límites
│   ├── formulario_integrales.html
│   ├── formulario_edos.html
│   ├── formulario_fourier_taylor.html
│   └── formulario_fisica.html
└── static/
    ├── css/
    │   ├── styles.css
    │   ├── formulario.css
    │   └── rclone.css
    ├── js/
    │   ├── app.js
    │   └── rclone.js
    └── img/                          # Conserva todas tus imágenes existentes
        ├── logo.png
        ├── logo_2.png
        ├── favicon.png
        ├── albert-einsteing.png
        ├── homero.png
        ├── whatsapp.gif
        ├── ubicacion.png
        ├── circulo-unitario.png
        ├── triangulos-notables.png
        └── sustitucion-trigonometrica.svg
```

**Importante al actualizar tu repositorio:** reemplaza los archivos incluidos en la entrega, coloca cada uno en su ruta indicada y **elimina el antiguo `templates/formularios.html`**. Si todavía conservas un `templates/formulario.html` de una versión anterior, también puedes retirarlo: ya no se utiliza.

La entrega **no incluye imágenes, plantillas ni otros recursos que no se modificaron**. Conservarlos en sus directorios actuales.

## Funcionamiento de los formularios

- `#formularios` presenta un catálogo visual con todos los temas. **No existe un archivo `formularios.html`**: el catálogo se construye a partir de la lista `FORMULA_TOPICS` de `static/js/app.js`.
- Al elegir un tema, el navegador carga exclusivamente su HTML desde `templates/` usando `fetch()`. Por ejemplo, `#formulario_integrales` carga `templates/formulario_integrales.html`.
- Los temas también aparecen en el desplegable del menú **FORMULARIOS**, y disponen de navegación anterior/siguiente.
- Cada formulario conserva su botón **Imprimir este formulario** para generar una vista independiente A4 con el logotipo, la marca de agua y la información de contacto.
- Se mantiene MathJax para representar LaTeX. Se requiere conexión a Internet para cargar la librería desde el CDN.

### Temas disponibles

| Ruta de la página | Archivo HTML | Contenido |
|---|---|---|
| `#formulario_identidades` | `formulario_identidades.html` | Identidades y trigonometría |
| `#formulario_logaritmos` | `formulario_logaritmos.html` | Potencias, radicales y logaritmos |
| `#formulario_derivadas` | `formulario_derivadas.html` | Límites y derivadas |
| `#formulario_integrales` | `formulario_integrales.html` | Integrales |
| `#formulario_edos` | `formulario_edos.html` | Ecuaciones diferenciales |
| `#formulario_fourier_taylor` | `formulario_fourier_taylor.html` | Series de Fourier y Taylor |
| `#formulario_fisica` | `formulario_fisica.html` | Física |

Las rutas antiguas `#formulario` y `#formulario_fourier` se redirigen a las nuevas vistas correspondientes. Los enlaces existentes a `#formularios` siguen funcionando.

## Cómo agregar un formulario nuevo

**Solo necesitas crear un archivo HTML y registrar una entrada en `static/js/app.js`.** No tienes que modificar el menú, el catálogo ni el CSS.

### Paso 1. Crear el archivo

Crea, por ejemplo, `templates/formulario_algebra.html`, con esta estructura mínima:

```html
<section class="page-section formula-page" data-formula-page="formulario_algebra">
  <nav class="formula-breadcrumb" aria-label="Ruta de navegación">
    <a href="#formularios">← Volver a todos los formularios</a>
  </nav>

  <article class="formula-panel is-active" id="formula-algebra"
           role="region" aria-labelledby="formula-algebra-title">
    <header class="formula-panel-header">
      <div>
        <h2 id="formula-algebra-title">Álgebra</h2>
        <p>Propiedades y fórmulas fundamentales.</p>
      </div>
      <button class="btn-print" type="button"
              data-print-section="formula-algebra">
        Imprimir este formulario
      </button>
    </header>

    <div class="formula-grid">
      <section class="formula-card">
        <h3>Productos notables</h3>
        $$ (a+b)^2 = a^2+2ab+b^2 $$
      </section>
    </div>
  </article>

  <nav class="formula-topic-navigation" data-topic-navigation
       aria-label="Otros formularios"></nav>
</section>
```

El `id` del `<article>` debe coincidir **exactamente** con `data-print-section` del botón. Para más fórmulas, añade tarjetas dentro de `.formula-grid`. Utiliza `class="formula-card wide"` cuando una tarjeta deba ocupar las dos columnas.

### Paso 2. Registrar el formulario

Abre `static/js/app.js`. Dentro del arreglo **`FORMULA_TOPICS`**, agrega un objeto como este, respetando las comas entre elementos:

```javascript
{
  route: "formulario_algebra",
  file: "./templates/formulario_algebra.html",
  label: "Álgebra",
  title: "Álgebra · Productos notables",
  description: "Identidades algebraicas y propiedades fundamentales.",
  icon: "x²",
  group: "Matemáticas",
},
```

El orden de los objetos determina el orden en el catálogo, el submenú y los enlaces anterior/siguiente. El enlace resultante será `#formulario_algebra`.

### Paso 3. Probar

Abre `http://localhost:5500/#formularios`, comprueba la nueva tarjeta, entra en el formulario y prueba el botón de imprimir.

## Cómo agregar o cambiar fórmulas

Edita exclusivamente el archivo de la asignatura correspondiente, dentro de `templates/`. LaTeX se escribe con `$$...$$`, `\[...\]` o `\(...\)`:

```html
<section class="formula-card">
  <h3>Teorema fundamental del cálculo</h3>
  $$ \int_a^b f(x)\,dx = F(b)-F(a) $$
</section>
```

**No debes copiar el SVG que genera MathJax**: conserva las expresiones LaTeX en el HTML.

## Pruebas locales

Las plantillas usan `fetch()`, por lo que **no abras `index.html` con `file://`**.

Puedes usar **Live Server** en Visual Studio Code o ejecutar, desde la raíz del proyecto:

```bash
python -m http.server 5500
```

Luego abre `http://localhost:5500/` o directamente `http://localhost:5500/#formularios`.

## Publicar en GitHub Pages

1. Sube `index.html`, `templates/`, `static/`, el `README.md` y el resto de archivos originales al repositorio.
2. Elimina `templates/formularios.html` del repositorio si sigue existiendo.
3. En **Settings → Pages**, elige **Deploy from a branch**, `main` y `/root` (si así está organizado tu repositorio).
4. Comprueba las rutas, MathJax, imágenes y la impresión desde la dirección publicada.

La navegación con `#hash` evita necesitar reglas de reescritura de URLs en GitHub Pages. Revisa que los metadatos, el dominio y las imágenes de `index.html` sigan apuntando al destino correcto.

## Páginas independientes de rclone

- `rclone.html` — Información sobre la integración OAuth personal con Google Drive.
- `rclone-privacy.html` — Política de privacidad de esa integración.
- Comparten la paleta, la tipografía, los logotipos y la preferencia de tema claro/oscuro del sitio. Sus estilos están en `static/css/rclone.css` y el botón de tema se gestiona con `static/js/rclone.js`.
- **No se enlazan desde el menú ni desde las secciones públicas**. Solo contienen enlaces entre ellas.
- Ambas incluyen `robots="noindex, nofollow, noarchive"`, que es una indicación para los buscadores, **no una barrera de acceso**.

**Advertencia importante:** cualquier archivo HTML publicado en un GitHub Pages público **se puede visitar si se conoce su URL directa**, aunque no haya enlaces y aunque tenga `noindex`. Si necesitas restringir realmente el acceso, tendrás que alojar estas páginas detrás de autenticación o fuera del sitio público. No incluyas tokens, claves, secretos OAuth ni credenciales en estos archivos.

## Documentación de referencia

- [GitHub Docs — Crear un sitio de GitHub Pages](https://docs.github.com/es/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [MDN — Uso de Fetch](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — Política del mismo origen](https://developer.mozilla.org/es/docs/Web/Security/Same-origin_policy)
