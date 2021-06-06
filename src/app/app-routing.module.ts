import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DerivativesModule } from './derivatives/derivatives.module';
import { MainComponent } from './main/main.component';

const routes: Routes = [
 {path:'', component:MainComponent},
];

@NgModule({
  imports: [DerivativesModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
