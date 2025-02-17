import { NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { TextboxComponent } from './textbox/textbox.component';
import { PasswordComponent } from './password/password.component';
import { ButtonComponent } from './button/button.component';
import { SelectComponent } from './select/select.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { TableComponent } from './table/table.component';
import { CardComponent } from './card/card.component';
import { EmailComponent } from './email/email.component';
import { ErrortagComponent } from './errortag/errortag.component';
import { ToastComponent } from './toast/toast.component';
import { AccordionComponent } from './accordion/accordion.component';
import { DownloadComponent } from './download/download.component';
@NgModule({
  imports: [
    MaterialModule
  ],
  declarations: [
    TextboxComponent,
    PasswordComponent,
    ButtonComponent,
    SelectComponent,
    AutocompleteComponent,
    TableComponent,
    CardComponent,
    EmailComponent,
    ErrortagComponent,
    ToastComponent,
    AccordionComponent,
    DownloadComponent
  ],
  exports: [
    MaterialModule,
    TextboxComponent,
    PasswordComponent,
    ButtonComponent,
    SelectComponent,
    AutocompleteComponent,
    TableComponent,
    CardComponent,
    EmailComponent,
    ErrortagComponent,
    ToastComponent,
    AccordionComponent,
    DownloadComponent
  ],
})
export class FrameworkModule {}
