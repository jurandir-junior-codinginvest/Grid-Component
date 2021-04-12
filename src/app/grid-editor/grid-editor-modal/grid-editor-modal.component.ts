import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'grid-editor-modal',
  templateUrl: './grid-editor-modal.component.html',
  styleUrls: ['./grid-editor-modal.component.css']
})
export class GridEditorModalComponent implements OnInit {

  constructor(public modal:NgbActiveModal) { }

  ngOnInit(): void {
  }

}
