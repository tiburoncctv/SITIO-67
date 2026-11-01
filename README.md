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
- **ACTIVAR AUDIO / AUDIO ON/OFF**: habilita pitidos y el MP3 que subiste. **Inicia apagado** por las restricciones de los navegadores.

## Imagen y bandas sonoras

La carpeta `assets/` contiene la imagen y los audios de la intro:

- `assets/scp-610.jpg`: imagen de la cámara de contención.
- `assets/SCP LOCKDOWM ALARM_Blackout(OLD)OUTDATED(CRINGE).mp3`: **alarma SCP Lockdown**, comienza en **00:10.18** junto con `ACTIVIDAD EMERGENTE` y se mantiene (en bucle si hiciera falta) hasta **00:24.20**.
- `assets/MTF Beta-7 Maz Hatters entry announcement.mp3`: **anuncio de Beta-7**, comienza exactamente cuando la pantalla se rompe, a **00:24.20**, y se reproduce hasta terminar por sí solo.

El archivo anterior `assets/containment-breach.mp3` se conserva como copia, pero **ya no se reproduce**.

La cinemática **empieza inmediatamente al cargar la página**. Para permitir audio, pulsa **ACTIVAR AUDIO** antes de la primera alerta; algunos navegadores no permiten sonido hasta recibir un clic. Si bloquean el anuncio de Beta-7, aparecerá el botón **REPRODUCIR ANUNCIO BETA-7** en la pantalla final.

Al pulsar **PAUSAR**, la alarma también se pausa; con **REANUDAR** continúa. **REINICIAR** detiene ambos audios y comienza otra vez.

El archivo `Assets` (con mayúscula, en la raíz) sigue siendo un archivo normal, no una carpeta; se conserva intacto.

Para cambiar las pistas en el futuro, modifica las rutas de `alarmTrack` y `betaTrack` al principio de `script.js`. Si los audios son de terceros, revisa los permisos correspondientes antes de publicar el sitio.

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

La interfaz se programó específicamente para este proyecto: no se copiaron los archivos ni las imágenes del juego de referencia. Se incluye la imagen y el audio aportados por quien dirige la partida; verifica los derechos de esos recursos si publicas la página.
