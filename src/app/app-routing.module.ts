import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'peticiones',
    loadChildren: () => import('./pages/peticiones/peticiones.module').then( m => m.PeticionesPageModule)
  },
  {
    path: 'cerrar-cuenta',
    loadChildren: () => import('./pages/cerrar-cuenta/cerrar-cuenta.module').then( m => m.CerrarCuentaPageModule)
  },
  {
    path: 'datos-personales',
    loadChildren: () => import('./pages/datos-personales/datos-personales.module').then( m => m.DatosPersonalesPageModule)
  },
  {
    path: 'pqrs',
    loadChildren: () => import('./pages/pqrs/pqrs.module').then( m => m.PqrsPageModule)
  },
  {
    path: 'detalles-servicio/:id',
    loadChildren: () => import('./pages/detalles-servicio/detalles-servicio.module').then( m => m.DetallesServicioPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
