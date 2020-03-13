import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { OddJobsSharedModule } from 'app/shared/shared.module';
import { OddJobsCoreModule } from 'app/core/core.module';
import { OddJobsAppRoutingModule } from './app-routing.module';
import { OddJobsHomeModule } from './home/home.module';
import { OddJobsEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    OddJobsSharedModule,
    OddJobsCoreModule,
    OddJobsHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    OddJobsEntityModule,
    OddJobsAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent]
})
export class OddJobsAppModule {}
