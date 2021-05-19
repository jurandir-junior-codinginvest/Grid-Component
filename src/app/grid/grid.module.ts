import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormulaService } from "../services/formula.service";
import { GridService } from "../services/grid.service";
import { PaginationService } from "../services/pagination.service";
import { GridComponent } from "./grid.component";

@NgModule({
    declarations: [
        GridComponent,
    ],
    imports: [
        HttpClientModule,
        CommonModule,
    ],
    exports: [
        GridComponent
    ],
    providers: [GridService,FormulaService,PaginationService],
})
export class GridModule { }