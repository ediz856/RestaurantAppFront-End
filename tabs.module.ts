import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { TranslocoRootModule } from '../transloco/transloco-root.module';
import { TranslocoModule } from '@ngneat/transloco';

  

@NgModule({
  imports: [
    TranslocoRootModule,
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
