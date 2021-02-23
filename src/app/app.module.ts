import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { MainComponent } from './main/main.component';
import { RiskManagerService } from './services/risk-manager.service';
import { GridService } from './services/grid.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubGridComponent } from './sub-grid/sub-grid.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    MainComponent,
    SubGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule
  ],
  providers: [RiskManagerService,GridService],
  bootstrap: [AppComponent]
})
export class AppModule { }
