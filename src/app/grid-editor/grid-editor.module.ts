import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridEditorComponent } from './grid-editor.component';
import { GridEditorModalComponent } from './grid-editor-modal/grid-editor-modal.component';
import { GridService } from '../services/grid.service';
import { FormulaService } from '../services/formula.service';
import { PaginationService } from '../services/pagination.service';

@NgModule({
  declarations: [GridEditorComponent, GridEditorModalComponent],
  imports: [
    CommonModule,
  ],
  exports:[
    GridEditorComponent,
    GridEditorModalComponent
  ],
  providers: [GridService,FormulaService,PaginationService],
})
export class GridEditorModule { }
