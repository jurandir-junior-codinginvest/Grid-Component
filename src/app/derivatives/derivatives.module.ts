import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DerivativesComponent } from './derivatives.component';
import { FormsModule } from '@angular/forms';
import { GridModule } from '../grid/grid.module';



@NgModule({
  entryComponents:[DerivativesComponent],
  declarations: [DerivativesComponent],
  imports: [
    CommonModule,
    FormsModule,
    GridModule
  ],
  exports:[
    DerivativesComponent,
    GridModule
  ]
})
export class DerivativesModule { }
