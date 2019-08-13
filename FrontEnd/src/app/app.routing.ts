import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

//COMPONENTS

import { RegistroComponent } from "./components/registro/registro.component";
import { LoginComponent } from "./components/login/login.component"
import { PerfilComponent } from './components/perfil/perfil.component';
import { HomeComponent } from './components/home/home.component'


const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'registro',component: RegistroComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'home', component: HomeComponent},
    {path: '**', component: LoginComponent},
    
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders =  RouterModule.forRoot(appRoutes)
