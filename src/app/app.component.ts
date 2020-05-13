import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages: any

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

    if( this.auth.leerToken()){
      this.appPages = [
        {
          title: 'Peticiones',
          url: 'peticiones',
          icon: 'paper-plane'
        },
        {
          title: 'Servicios realizados',
          url: 'servicios-realizados',
          icon: 'document-text'
        },
        {
          title: 'Enviar PQRS',
          url: 'pqrs',
          icon: 'chatbox'
        },
        {
          title: 'Datos personales',
          url: 'datos-personales',
          icon: 'person'
        },        
        {
          title: 'Cerrar cuenta',
          url: 'cerrar-cuenta',
          icon: 'trash'
        },   
        {
          title: 'Cerrar sesión',
          url: '',
          icon: 'warning'
        },                  
      ];
    }else{
      this.appPages = [
        {
          title: 'Registro',
          url: 'registro',
          icon: 'add-circle'
        },
        {
          title: 'Iniciar sesión',
          url: 'inicio-sesion',
          icon: 'people'
        }
      ]
    }
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  prueba( nombre: string ){
    if( nombre == 'Cerrar sesión'){
      this.auth.logout();
      setTimeout(() => location.reload(), 1000);
      this.router.navigateByUrl('/inicio-sesion');
    }
  }
}
