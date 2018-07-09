import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from './button/button.component';
import {StyleGuidePageComponent} from './style-guide-page/style-guide-page.component';
import {RouterModule} from '@angular/router';
import { RqPageComponent } from './rq-page/rq-page.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { TextFieldComponent } from './text-field/text-field.component';
import {FormsModule} from '@angular/forms';
import { CountSeperatorComponent } from './count-seperator/count-seperator.component';
import { ColumnHeaderComponent } from './column-header/column-header.component';
import {TaskComponent} from './task/task.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'styleguide', component: StyleGuidePageComponent},
    ])
  ],
  declarations: [
    ButtonComponent,
    StyleGuidePageComponent,
    RqPageComponent,
    ActionBarComponent,
    TextFieldComponent,
    CountSeperatorComponent,
    ColumnHeaderComponent,
    TaskComponent
  ],

  exports: [
    ButtonComponent,
    CountSeperatorComponent
  ]

})
export class ControlsModule { }
