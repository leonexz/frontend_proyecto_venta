import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { GroupSelection } from './group-selection/group-selection';
import { GroupA } from './group-a/group-a';
import { GroupB } from './group-b/group-b';
import { GroupC } from './group-c/group-c';
import { Admin } from './admin/admin';

// Definimos las rutas de la aplicación Angular
export const routes: Routes = [
  { path: '', component: Register },          // Página inicial /register
  { path: 'login', component: Login },        // Página de login
  { path: 'select-group', component: GroupSelection }, // Selección de grupo tras login
  { path: 'admin', component: Admin },        // Pantalla de admin
  { path: 'group-a', component: GroupA },     // Vista Grupo A
  { path: 'group-b', component: GroupB },     // Vista Grupo B
  { path: 'group-c', component: GroupC }      // Vista Grupo C
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configura el router con estas rutas
  exports: [RouterModule]                   // Exporta RouterModule para usar en app
})
export class AppRoutingModule { }