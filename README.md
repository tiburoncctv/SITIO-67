# SITIO-67 // TERMINAL DE MONITOREO

Intro cinematográfica para un **one-shot virtual de horror SCP**. Es una interfaz ficticia de la Fundación SCP: los sistemas del Sitio-67 parecen funcionar hasta que se detecta una proliferación biológica súbita vinculada a SCP-610. El origen del fenómeno es **desconocido**; el relato **no afirma sabotaje**.

El sitio está hecho únicamente con HTML, CSS y JavaScript. No necesita instalar nada.

## Cómo funciona

La secuencia comienza al abrir `index.html`:

- **00:00–00:10**: doce chequeos de rutina, todos en verde.
- **00:10**: aparece **ACTIVIDAD EMERGENTE**.
- **00:11**: los lanzallamas automatizados pasan a amarillo.
- **00:13**: **DESPACHANDO SEGURIDAD IN-SITU**.
- **00:15–00:21**: fallos de contención, lanzallamas, cerraduras, energía, cámaras, seguridad y comunicaciones.
- **00:21**: **DESPACHANDO MTF MÁS CERCA**. No llega confirmación.
- **00:24**: fallos visuales, corte de transmisión y pantalla final.

Los tiempos son aproximados y se controlan desde `script.js`.

### Controles

- **REINICIAR** o tecla **R**: vuelve al comienzo.
- **PAUSAR / REANUDAR** o **espacio**: congela la secuencia.
- **AUDIO ON/OFF**: activa pitidos sintetizados. **Inicia apagado** para que el navegador no bloquee la reproducción automática; no hay archivos de audio ni música externa.

## Añadir una imagen de SCP-610

El panel de cámara muestra un marcador de posición hasta que agregues:

`assets/scp-610.jpg`

Crea la carpeta `assets` en GitHub, sube una imagen con ese nombre y la página la mostrará automáticamente. Puede ser una ilustración creada por ustedes, o una imagen que tengan derecho a usar. **Si empleas una imagen de la wiki SCP, conserva los créditos y la licencia de su fuente.** Para sustituir el nombre o la ruta, cambia el atributo `src` de `scpImage` en `index.html`.

## Publicar con GitHub Pages

1. Abre **Settings → Pages** en este repositorio.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Elige la rama **main** y la carpeta **/(root)**. Guarda.
4. Espera a que GitHub indique la URL y compártela con los jugadores.

**Privacidad:** el repositorio está creado como **privado**. Según el plan de GitHub, publicar Pages desde un repositorio privado puede requerir una suscripción compatible. No cambies la visibilidad sin decidirlo primero: hacer el repositorio público también hace público su contenido. Si no usas Pages, puedes abrir `index.html` localmente y compartir pantalla en Discord.

## Ajustes de dirección

- Toda la cronología está en el arreglo de eventos de `script.js`.
- Los mensajes se encuentran en `checks` y las llamadas a `addLog()`.
- Los colores y la apariencia están en `styles.css`.
- Si vas a proyectarla, prueba previamente el tamaño y pulsa **F11** en el navegador para pantalla completa.

## Créditos y licencia

Obra fan no oficial, sin afiliación con la Fundación SCP.

- **SCP-610 — «The Flesh that Hates»**, de NekoChris: https://scp-wiki.wikidot.com/scp-610
- **Billith's Proposal II**, de Billith, referencia de atmósfera e interfaz: https://scp-wiki.wikidot.com/billiths-proposal-ii
- Universo y colaboradores de la **SCP Wiki**: https://scp-wiki.wikidot.com/

El texto y la adaptación narrativa de este homenaje se ofrecen bajo **Creative Commons Atribución-CompartirIgual 3.0 (CC BY-SA 3.0)**, de acuerdo con la licencia de la SCP Wiki: https://creativecommons.org/licenses/by-sa/3.0/

La interfaz se programó específicamente para este proyecto: no se copiaron los archivos ni las imágenes del juego de referencia. No se incluye ninguna imagen de SCP-610 en el repositorio.
