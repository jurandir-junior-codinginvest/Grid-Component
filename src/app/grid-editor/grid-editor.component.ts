import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GridService } from '../services/grid.service';
import { GridEditorModalComponent } from './grid-editor-modal/grid-editor-modal.component';

@Component({
  selector: 'grid-editor',
  templateUrl: './grid-editor.component.html',
  styleUrls: ['./grid-editor.component.css']
})
export class GridEditorComponent {
  @Input()
  title!:string;

  public modal!:NgbModalRef;
  constructor(private gridService:GridService, private modalService:NgbModal) { }

  ngOnInit() {
  }

  open(){
    this.modal = this.modalService.open(GridEditorModalComponent)
    this.modal.result.then((result)=>{
      debugger
          },(reason)=>{
      debugger
          });
  }

}
