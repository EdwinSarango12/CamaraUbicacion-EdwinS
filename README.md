# Aplicación de Fotos con Ubicación

Esta aplicación permite tomar fotos y guardar automáticamente la ubicación GPS donde fue tomada cada foto. Las fotos se muestran con un enlace directo a Google Maps para ver la ubicación.

## Características

- **Captura de fotos**: Toma fotos usando la cámara del dispositivo
- **Geolocalización**: Obtiene automáticamente las coordenadas GPS
- **Guardado en archivo**: Guarda la información en archivos de texto
- **Enlaces a Google Maps**: Acceso directo a la ubicación en Google Maps
- **Interfaz moderna**: Diseño limpio y fácil de usar

## Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Ionic CLI
- Capacitor CLI

## Uso

### Funcionalidades principales

1. **Tomar foto con ubicación**:
   - Toca el botón flotante de la cámara
   - La aplicación tomará la foto y obtendrá automáticamente tu ubicación GPS
   - La foto se guardará junto con las coordenadas

![inicio](https://github.com/user-attachments/assets/2c6c5bb4-3237-42ca-9020-b29d7398665a)

2. **Ver fotos guardadas**:
   - Las fotos aparecen en una lista con:
     - Miniatura de la foto
     - Fecha y hora de captura
     - Coordenadas GPS
     - Botón para abrir en Google Maps
    
![galeria](https://github.com/user-attachments/assets/f5098c74-1e15-4d6b-ade6-e57c72857b88)

3. **Acceder a Google Maps**:
   - Toca el botón "Ver en Google Maps" en cualquier foto
   - Se abrirá Google Maps mostrando la ubicación exacta

![mapa](https://github.com/user-attachments/assets/4275a6e4-c5ec-44f9-8275-2b6d9d38b1c9)

4. **Eliminar fotos**:
   - Toca el botón de eliminar (X) en cualquier foto
   - Confirma la eliminación en el diálogo

![elimina](https://github.com/user-attachments/assets/addab978-e25a-4c0a-af59-598f4c3a0b55)

### Archivos generados

La aplicación genera dos tipos de archivos:

1. **Archivos de texto individuales**: Un archivo `.txt` por cada foto con:
   - Fecha y hora de captura
   - Coordenadas GPS
   - Enlace a Google Maps
   - Ruta del archivo de imagen

2. **Archivo de datos**: Un archivo JSON con toda la información de las fotos para la aplicación

## Permisos necesarios

La aplicación requiere los siguientes permisos:

- **Cámara**: Para tomar fotos
- **Ubicación**: Para obtener coordenadas GPS
- **Almacenamiento**: Para guardar archivos

## Estructura del proyecto

```
src/
├── app/
│   ├── home/
│   │   ├── home.page.html    # Interfaz principal
│   │   ├── home.page.scss    # Estilos
│   │   └── home.page.ts      # Lógica de la página
│   └── services/
│       ├── location.ts       # Servicio de geolocalización
│       └── photo.service.ts  # Servicio de fotos y archivos
```

## Desarrollo

### Ejecutar en el navegador

```bash
ionic serve
```

### Construir para producción

```bash
ionic build
```

### Sincronizar con Capacitor

```bash
npx cap sync
```

## Tecnologías utilizadas

- **Ionic 8**: Framework de UI
- **Angular 20**: Framework de desarrollo
- **Capacitor 7**: Runtime nativo
- **TypeScript**: Lenguaje de programación
- **Ionicons**: Iconos

## Solución de problemas

### La cámara no funciona
- Verifica que se hayan concedido los permisos de cámara
- En Android, asegúrate de que la aplicación tenga permisos en Configuración

### La ubicación no se obtiene
- Verifica que se hayan concedido los permisos de ubicación
- Asegúrate de que el GPS esté activado
- Verifica que la aplicación tenga permisos de ubicación precisos

### Los archivos no se guardan
- Verifica que se hayan concedido los permisos de almacenamiento
- En Android, verifica que la aplicación tenga acceso al almacenamiento
