import { NgModule } from '@angular/core';
import { MMTablerComponent } from './mmtabler.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MMTablerComponent],
  imports: [CommonModule,FormsModule],
  exports: [MMTablerComponent]
})
export class MMTablerModule { }
