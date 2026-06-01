# 🚀 CRM Inmobiliario de Inversiones - Living4malaga (Solución Híbrida)

¡Bienvenido al sistema unificado de captación de inversores y CRM personalizado para **Living4malaga**!

Esta solución híbrida te permite mantener tu página web actual de WordPress en la URL oficial:
`https://living4malaga.com/invertir/`

Pero **elimina por completo** Contact Form 7, plugins de webhooks complejos, correos electrónicos auto-responder adicionales y la plataforma Tally.so. En su lugar, incrustaremos un **Widget de Formulario de Lujo unificado en 2 Pasos** diseñado a medida con tus colores corporativos oficiales:
*   **Deep Navy**: `#002d3a` (Fondo del logo, textos destacados, botones principales)
*   **Luxury Gold**: `#d3a274` (Ajustes activos, bordes destacados, barra de progreso y checkmarks)

---

## 📂 Estructura del Proyecto

Tu proyecto ha sido configurado en tu directorio local `C:\Users\info\.gemini\antigravity\scratch\real-estate-crm-hybrid` con la siguiente estructura:

*   **`widget.html`**: El código HTML5 del formulario de captación interactivo de 2 pasos (multilingüe).
*   **`widget.css`**: Los estilos CSS corporativos del formulario (apariencia de alta gama, adaptada a la marca, con diseño móvil responsivo).
*   **`widget.js`**: La lógica del formulario. Controla el multilenguaje ES/EN en caliente, la transición animada del Paso 1 al Paso 2, y la comunicación asíncrona por API con el CRM.
*   **`crm.html`**: El portal privado de administración para gestionar tu base de leads.
*   **`crm-styles.css`**: Estilo del panel de control CRM (modo oscuro de lujo con HSL, KPIs visuales y mockup móvil para previsualizaciones).
*   **`crm.js`**: Lógica administrativa (estadísticas unificadas, tabla interactiva, drawer lateral de perfil e historial del cliente y anotaciones).
*   **`server.js`**: Servidor Express en Node.js de producción listo para recibir los envíos del formulario incrustado en WordPress en vivo.
*   **`database.json`**: Base de datos unificada de leads del CRM.

---

## ⚡ Cómo Probarlo de Inmediato (Modo Portable)

Puedes testear el flujo completo de captación **inmediatamente sin instalar software adicional ni activar servidores locales**:
1.  Abre el explorador de archivos de Windows y navega a `C:\Users\info\.gemini\antigravity\scratch\real-estate-crm-hybrid`.
2.  Haz **doble clic en `crm.html`** para abrir el panel de control del CRM en tu navegador.
3.  Ve a la pestaña **"Previsualizar Formulario"** en la barra lateral del CRM.
4.  A la izquierda verás un mockup móvil que renderiza el formulario embebido real. Rellena el **Paso 1** (en inglés o español) y pulsa *Siguiente Paso*.
5.  El formulario se transformará con una transición elegante y desbloqueará el **Paso 2** directamente en el móvil.
6.  ¡Al instante, si vas a la pestaña **"Base de Leads"**, verás que el lead ha sido captado en tiempo real!
7.  Completa el **Paso 2** (las preguntas detalladas de extras y rangos) y envíalo. Tu ficha en el CRM se actualizará de forma instantánea al estado *"Paso 2 Completado"*, fusionando ambas respuestas de forma perfecta bajo el mismo cliente sin duplicar registros.
8.  Haz clic en el ojo (Ver Ficha) para ver los datos, el historial de línea de tiempo y escribir notas que se guardarán de forma persistente.

---

## 🔗 Cómo Insertarlo en tu Web de WordPress Real

Para inyectar esta experiencia de lujo dentro de tu página `living4malaga.com/invertir/`:

1.  Abre el editor de tu página de WordPress (Gutenberg, Elementor o Divi).
2.  Inserta un bloque de **"HTML Personalizado"** o **"Custom HTML Code"** en la posición donde quieras que aparezca el formulario.
3.  Pega el contenido de los archivos en el bloque:
    *   Copia la estructura de **`widget.html`**.
    *   Rodea el contenido de **`widget.css`** con etiquetas `<style> ... </style>` e insértalo a continuación.
    *   Rodea el contenido de **`widget.js`** con etiquetas `<script> ... </script>` e insértalo al final.
4.  *(Alternativamente, puedes copiar los códigos directamente desde la pestaña **"Insertar en WordPress"** de tu panel de control CRM con los botones rápidos de copiar)*.
5.  Guarda la página en tu WordPress. ¡Y listo! Tu web mostrará el embudo a medida.

---

## 🌐 Cómo Alojar el Servidor en Producción (Gratis y en 5 Minutos)

Para que el formulario embebido en WordPress envíe los datos de producción reales a tu CRM, el backend debe estar alojado en internet:

1.  Sube esta carpeta a tu cuenta de **GitHub** (crear un repositorio es gratis).
2.  Regístrate de forma gratuita en **[Render.com](https://render.com/)**.
3.  Crea un nuevo servicio web haciendo clic en **"New" ➔ "Web Service"** y conecta tu repositorio de GitHub.
4.  Render detectará que es un proyecto de Node.js. Rellena esta configuración:
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  Haz clic en **"Deploy"**. Render compilará tu servidor en segundos y te dará una URL pública del tipo `https://living4malaga-crm.onrender.com`.
6.  **¡Último paso!**: Edita el archivo `widget.js` incrustado en tu WordPress y cambia el valor de la variable `CRM_API_URL` en la parte superior para apuntar a la URL pública que te dio Render. ¡Todo operará en vivo al instante!
