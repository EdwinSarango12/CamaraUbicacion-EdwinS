import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonItem, IonLabel, IonList, IonIcon, IonFab, IonFabButton, IonAlert, IonSpinner, IonActionSheet } from '@ionic/angular/standalone';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { LocationService } from '../services/location';
import { PhotoService, PhotoWithLocation } from '../services/photo.service';
import { addIcons } from 'ionicons';
import { camera, location, trash, eye } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonImg, IonItem, IonLabel, IonList, IonIcon,
    IonFab, IonFabButton, IonAlert, IonSpinner, IonActionSheet,
    NgIf, NgFor, DecimalPipe
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);
  photos = signal<PhotoWithLocation[]>([]);
  isTakingPhoto = signal<boolean>(false);
  showDeleteAlert = signal<boolean>(false);
  photoToDelete: string | null = null;
  cameraPermissionsGranted = signal<boolean>(false);
  showActionSheet = signal<boolean>(false);
  
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.cancelDelete()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => this.deletePhoto()
    }
  ];

  actionSheetButtons = [
    {
      text: 'Tomar Foto',
      icon: 'camera',
      handler: () => {
        this.closeActionSheet();
        this.takePhoto();
      }
    },
    {
      text: 'Seleccionar de Galería',
      icon: 'images',
      handler: () => {
        this.closeActionSheet();
        this.selectFromGallery();
      }
    },
    {
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => this.closeActionSheet()
    }
  ];

  constructor(
    private loc: LocationService,
    private photoService: PhotoService
  ) {
    addIcons({ camera, location, trash, eye });
  }

  async ngOnInit() {
    await this.loc.ensurePermissions();
    await this.obtenerUbicacionActual();
    await this.iniciarSeguimiento();
    await this.checkPermissions();
    this.loadPhotos();
  }

  async obtenerUbicacionActual() {
    try {
      const pos = await this.loc.getCurrentPosition();
      this.latitude.set(pos.coords.latitude);
      this.longitude.set(pos.coords.longitude);
      this.errorMsg.set(null);
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al obtener la ubicación actual');
    }
  }

  async iniciarSeguimiento() {
    try {
      this.watchId = await this.loc.watchPosition((pos) => {
        this.latitude.set(pos.coords.latitude);
        this.longitude.set(pos.coords.longitude);
      }, (err) => {
        this.errorMsg.set(err?.message ?? 'Error en seguimiento de ubicación');
      });
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'No se pudo iniciar el seguimiento');
    }
  }

  async detenerSeguimiento() {
    if (this.watchId) {
      await this.loc.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  ngOnDestroy() {
    if (this.watchId) this.loc.clearWatch(this.watchId);
  }

  async checkPermissions() {
    const hasCameraPermissions = await this.photoService.checkCameraPermissions();
    this.cameraPermissionsGranted.set(hasCameraPermissions);
  }

  loadPhotos() {
    this.photos.set(this.photoService.getPhotos());
  }

  async takePhoto() {
    this.isTakingPhoto.set(true);
    try {
      const photoWithLocation = await this.photoService.takePhoto();
      if (photoWithLocation) {
        this.loadPhotos();
        this.errorMsg.set(null); // Limpiar mensajes de error previos
      }
    } catch (error: any) {
      console.error('Error al tomar foto:', error);
      
      // Manejar diferentes tipos de errores
      if (error?.message) {
        this.errorMsg.set(error.message);
      } else if (error?.toString().includes('User cancelled')) {
        // Usuario canceló la acción, no mostrar error
        this.errorMsg.set(null);
      } else {
        this.errorMsg.set('Error al tomar la foto. Verifica que tengas permisos de cámara y ubicación.');
      }
    } finally {
      this.isTakingPhoto.set(false);
    }
  }

  openGoogleMaps(url: string) {
    window.open(url, '_blank');
  }

  confirmDeletePhoto(photoId: string) {
    this.photoToDelete = photoId;
    this.showDeleteAlert.set(true);
  }

  async deletePhoto() {
    if (this.photoToDelete) {
      await this.photoService.deletePhoto(this.photoToDelete);
      this.loadPhotos();
      this.photoToDelete = null;
    }
    this.showDeleteAlert.set(false);
  }

  cancelDelete() {
    this.photoToDelete = null;
    this.showDeleteAlert.set(false);
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  async requestCameraPermissions() {
    const granted = await this.photoService.requestCameraPermissions();
    this.cameraPermissionsGranted.set(granted);
    if (!granted) {
      this.errorMsg.set('Permisos de cámara denegados. Por favor, habilita los permisos de cámara en la configuración de la aplicación.');
    } else {
      this.errorMsg.set(null);
    }
  }

  async selectFromGallery() {
    this.isTakingPhoto.set(true);
    try {
      const photoWithLocation = await this.photoService.takePhotoFromGallery();
      if (photoWithLocation) {
        this.loadPhotos();
        this.errorMsg.set(null);
      }
    } catch (error: any) {
      console.error('Error al seleccionar foto de galería:', error);
      
      // Manejar diferentes tipos de errores
      if (error?.message) {
        this.errorMsg.set(error.message);
      } else if (error?.toString().includes('User cancelled')) {
        // Usuario canceló la acción, no mostrar error
        this.errorMsg.set(null);
      } else {
        this.errorMsg.set('Error al seleccionar foto de la galería. Verifica que tengas permisos de ubicación.');
      }
    } finally {
      this.isTakingPhoto.set(false);
    }
  }

  showPhotoOptions() {
    this.showActionSheet.set(true);
  }

  closeActionSheet() {
    this.showActionSheet.set(false);
  }
}