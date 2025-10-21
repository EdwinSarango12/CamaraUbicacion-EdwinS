# Configuración de la Cámara - MiUbicacionAPP

## Cambios Realizados

### 1. Permisos de Android (AndroidManifest.xml)
Se agregaron los siguientes permisos necesarios para el funcionamiento de la cámara:

```xml
<!-- Permisos de cámara -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

<!-- Permisos de almacenamiento -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Permisos de ubicación -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" android:required="false" />
```

### 2. Mejoras en PhotoService
- **Verificación de permisos mejorada**: Ahora verifica permisos de cámara y ubicación antes de tomar fotos
- **Manejo de errores robusto**: Errores más descriptivos y mejor propagación de excepciones
- **Configuración optimizada de cámara**:
  - `saveToGallery: true` - Guarda automáticamente en la galería
  - `correctOrientation: true` - Corrige la orientación de las fotos
  - Timeout de 10 segundos para obtener ubicación
  - Alta precisión en la ubicación

### 3. Mejoras en HomePage
- **Manejo de errores mejorado**: Distingue entre errores reales y cancelaciones del usuario
- **Mensajes de error más claros**: Proporciona información específica sobre qué permisos faltan

### 4. FileProvider Configuration
Se actualizó `file_paths.xml` para incluir más rutas de acceso:
- external-path
- external-files-path
- cache-path
- files-path
- external-cache-path

## Cómo Usar la Aplicación

### Opción 1: Tomar Foto con la Cámara
1. Toca el botón flotante de la cámara (esquina inferior derecha)
2. Selecciona "Tomar Foto"
3. La aplicación solicitará permisos de cámara y ubicación (si no están otorgados)
4. Toma la foto
5. La foto se guardará automáticamente con la ubicación actual

### Opción 2: Seleccionar de la Galería
1. Toca el botón flotante de la cámara
2. Selecciona "Seleccionar de Galería"
3. La aplicación solicitará permisos de ubicación (si no están otorgados)
4. Selecciona una foto de tu galería
5. La foto se guardará con la ubicación actual

## Compilar y Ejecutar

### Para Android:

1. **Sincronizar el proyecto de Capacitor:**
   ```bash
   npx cap sync android
   ```

2. **Abrir en Android Studio:**
   ```bash
   npx cap open android
   ```

3. **O ejecutar directamente:**
   ```bash
   npx cap run android
   ```

### Para desarrollo web:

```bash
npm start
```

**Nota:** En el navegador web, la funcionalidad de cámara puede estar limitada. Se recomienda usar "Seleccionar de Galería" en navegadores.

## Solución de Problemas

### La cámara no se abre
1. Verifica que los permisos estén otorgados en la configuración del dispositivo
2. Asegúrate de que el dispositivo tenga una cámara funcional
3. Revisa los logs en Android Studio o Chrome DevTools

### No se obtiene la ubicación
1. Verifica que el GPS esté activado en el dispositivo
2. Asegúrate de que los permisos de ubicación estén otorgados
3. Intenta en un lugar con mejor señal GPS

### Las fotos no se guardan
1. Verifica los permisos de almacenamiento
2. Asegúrate de tener espacio suficiente en el dispositivo
3. Revisa los logs para ver errores específicos

## Dependencias Utilizadas

- `@capacitor/camera`: ^7.0.2
- `@capacitor/geolocation`: ^7.1.5
- `@capacitor/filesystem`: ^7.0.0
- `@capacitor/core`: 7.4.3

## Características Implementadas

✅ Tomar fotos con la cámara
✅ Seleccionar fotos de la galería
✅ Capturar ubicación GPS automáticamente
✅ Guardar fotos con metadatos de ubicación
✅ Generar enlaces a Google Maps
✅ Guardar información en archivos de texto
✅ Persistencia de datos
✅ Manejo robusto de permisos
✅ Manejo de errores mejorado
✅ Interfaz de usuario intuitiva

## Notas Adicionales

- Las fotos se guardan automáticamente en la galería del dispositivo
- La información de ubicación se guarda en archivos `.txt` en el directorio de documentos
- Los datos de las fotos se persisten en un archivo JSON en el almacenamiento de la aplicación
- La orientación de las fotos se corrige automáticamente
