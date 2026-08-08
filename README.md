# Remix of Dark Gym Log 6

Crea una aplicación web progresiva (PWA) para el registro de entrenamientos de gimnasio, diseñada exclusivamente con una interfaz en MODO OSCURO (estilo premium con fondos negros/grises oscuros y acentos de color vibrante como verde neón o azul para botones y elementos activos). No debe existir opción de modo claro.

La aplicación debe cumplir estrictamente con los siguientes requisitos funcionales y técnicos:

1. COMPLETAMENTE ANÓNIMA (SIN AUTENTICACIÓN):

- No incluyas ninguna pantalla de inicio de sesión, registro de usuario, contraseñas ni inicio con Google.

- Al abrir la aplicación, el usuario debe entrar directamente a la pantalla principal o al tablero de registro de ejercicios de forma inmediata y sin fricciones.

2. ALMACENAMIENTO 100% LOCAL:

- Todo el almacenamiento de datos debe realizarse en el dispositivo del usuario utilizando LocalStorage (o IndexedDB).

- No utilices bases de datos en la nube (como Supabase o Firebase). La app debe ser completamente privada, offline y autónoma.

3. CLASIFICACIÓN Y LISTA DE EJERCICIOS (CON CARDIO):

- Incluye una lista predefinida de ejercicios comunes clasificados por su grupo muscular:

  * Pecho: Press de banca, Aperturas, Fondos.

  * Espalda: Dominadas, Remo con barra, Jalón al pecho.

  * Piernas: Sentadillas, Prensa, Peso muerto rumano.

  * Hombros: Press militar, Elevaciones laterales.

  * Brazos: Curl de bíceps, Extensión de tríceps.

  * Cardio: Caminadora.

- En la pantalla de registro, incluye un selector de "Grupo Muscular / Categoría" que filtre dinámicamente la lista de ejercicios disponibles.

- Permite que el usuario cree, nombre y guarde sus propios ejercicios personalizados asignándoles una categoría. Estos deben guardarse localmente y sumarse permanentemente a la lista filtrable.

4. REGISTRO INTELIGENTE CON FORMULARIO ADAPTABLE:

- Lógica de formulario dinámico: Si el usuario selecciona "Caminadora" (o cualquier ejercicio de la categoría Cardio), el formulario debe cambiar sus campos ocultando Peso/Series/Repeticiones y mostrando en su lugar los campos: Tiempo (minutos), Velocidad (km/h o mph) e Inclinación (%). Para las demás categorías de fuerza, mantén los campos tradicionales (Peso, Series, Repeticiones).

- Lógica de auto-completado: Al seleccionar cualquier ejercicio (fuerza o cardio), la app debe buscar de inmediato en el historial local el registro más reciente de ese ejercicio específico. Rellena automáticamente los campos correspondientes con esos datos anteriores y muestra un texto sutil debajo que diga: "Tu último entrenamiento fue: [Datos anteriores]". El usuario debe poder editar libremente estos campos antes de guardar el nuevo registro.

5. PESTAÑA DE PROGRESO Y GRÁFICOS INTERACTIVOS:

- Añade una sección de "Progreso" con gráficos interactivos utilizando Recharts (o una librería similar integrada en Lovable).

- Incluye un menú desplegable para seleccionar un ejercicio específico y mostrar un gráfico de líneas que refleje la evolución de tu rendimiento a lo largo del tiempo. Si se selecciona "Caminadora", el gráfico debe permitir alternar o mostrar la evolución del Tiempo y la Velocidad.

6. EXPORTACIÓN DE DATOS A TEXTO:

- Añade una opción para "Exportar Datos" que permita al usuario descargar su historial completo o filtrado en un archivo en formato CSV, asegurando que las columnas se adapten correctamente tanto para los registros de fuerza como para los de cardio.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://stealth-fit-tracker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4feabe21-9da5-4649-8121-842d1bd1b6c9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
