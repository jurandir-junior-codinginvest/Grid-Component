import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RiskManagerService } from './services/risk-manager.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GridModule } from './grid/grid.module';
import { ConvertionService } from './services/convertion.service';
import { GridEditorModule } from './grid-editor/grid-editor.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    GridModule,
    GridEditorModule,
    NgbModule,
  ],
  exports:[
    GridEditorModule,
    GridModule,
  ],
  providers: [RiskManagerService,ConvertionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
