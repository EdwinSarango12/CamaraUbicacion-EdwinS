import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Geolocation, Position } from '@capacitor/geolocation';

export interface PhotoWithLocation {
  id: string;
  photo: Photo;
  latitude: number;
  longitude: number;
  timestamp: string;
  googleMapsUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photos: PhotoWithLocation[] = [];
  private readonly STORAGE_KEY = 'photos_with_location';

  constructor() {
    this.loadPhotos();
  }

  async checkCameraPermissions(): Promise<boolean> {
    try {
      const permissions = await Camera.checkPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Error al verificar permisos de cámara:', error);
      return false;
    }
  }

  async requestCameraPermissions(): Promise<boolean> {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Error al solicitar permisos de cámara:', error);
      return false;
    }
  }

  async ensureCameraPermissions(): Promise<boolean> {
    const hasPermissions = await this.checkCameraPermissions();
    if (!hasPermissions) {
      return await this.requestCameraPermissions();
    }
    return true;
  }

  async takePhoto(): Promise<PhotoWithLocation | null> {
    try {
      // Verificar permisos de cámara primero
      const hasCameraPermissions = await this.ensureCameraPermissions();
      if (!hasCameraPermissions) {
        throw new Error('Permisos de cámara denegados. Por favor, habilita los permisos en la configuración de la aplicación.');
      }

      // Verificar permisos de ubicación
      const locationPermissions = await Geolocation.checkPermissions();
      if (locationPermissions.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          throw new Error('Permisos de ubicación denegados. Por favor, habilita los permisos en la configuración de la aplicación.');
        }
      }

      // Obtener ubicación actual
      const position = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      // Tomar foto con la cámara
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: true,
        correctOrientation: true
      });

      const photoWithLocation: PhotoWithLocation = {
        id: Date.now().toString(),
        photo: photo,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString(),
        googleMapsUrl: this.generateGoogleMapsUrl(position.coords.latitude, position.coords.longitude)
      };

      this.photos.unshift(photoWithLocation);
      
      await this.saveToTextFile(photoWithLocation);
      
      await this.savePhotosToStorage();

      return photoWithLocation;
    } catch (error: any) {
      console.error('Error al tomar foto:', error);
      throw error;
    }
  }

  private generateGoogleMapsUrl(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  private async saveToTextFile(photoWithLocation: PhotoWithLocation): Promise<void> {
    try {
      const fileName = `photo_${photoWithLocation.id}.txt`;
      const content = `Foto tomada el: ${new Date(photoWithLocation.timestamp).toLocaleString()}
Coordenadas: ${photoWithLocation.latitude}, ${photoWithLocation.longitude}
Enlace Google Maps: ${photoWithLocation.googleMapsUrl}
Ruta de la foto: ${photoWithLocation.photo.webPath || photoWithLocation.photo.path}

---`;

      await Filesystem.writeFile({
        path: fileName,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      console.log('Archivo guardado:', fileName);
    } catch (error) {
      console.error('Error al guardar archivo:', error);
    }
  }

  private async savePhotosToStorage(): Promise<void> {
    try {
      const data = JSON.stringify(this.photos);
      await Filesystem.writeFile({
        path: 'photos_data.json',
        data: data,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    } catch (error) {
      console.error('Error al guardar fotos en almacenamiento:', error);
    }
  }

  private async loadPhotos(): Promise<void> {
    try {
      const result = await Filesystem.readFile({
        path: 'photos_data.json',
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      
      this.photos = JSON.parse(result.data as string);
    } catch (error) {
      console.log('No se encontraron fotos guardadas o error al cargar:', error);
      this.photos = [];
    }
  }

  getPhotos(): PhotoWithLocation[] {
    return this.photos;
  }

  async deletePhoto(photoId: string): Promise<void> {
    this.photos = this.photos.filter(photo => photo.id !== photoId);
    await this.savePhotosToStorage();
  }

  async clearAllPhotos(): Promise<void> {
    this.photos = [];
    await this.savePhotosToStorage();
  }

  async takePhotoFromGallery(): Promise<PhotoWithLocation | null> {
    try {
      // Verificar permisos de ubicación
      const locationPermissions = await Geolocation.checkPermissions();
      if (locationPermissions.location !== 'granted') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== 'granted') {
          throw new Error('Permisos de ubicación denegados. Por favor, habilita los permisos en la configuración de la aplicación.');
        }
      }

      // Obtener ubicación actual
      const position = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
      
      // Seleccionar foto de la galería
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        correctOrientation: true
      });

      const photoWithLocation: PhotoWithLocation = {
        id: Date.now().toString(),
        photo: photo,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString(),
        googleMapsUrl: this.generateGoogleMapsUrl(position.coords.latitude, position.coords.longitude)
      };

      this.photos.unshift(photoWithLocation);
      
      await this.saveToTextFile(photoWithLocation);
      
      await this.savePhotosToStorage();

      return photoWithLocation;
    } catch (error: any) {
      console.error('Error al seleccionar foto de galería:', error);
      throw error;
    }
  }
}
