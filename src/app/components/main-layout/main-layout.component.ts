import { Component, Input } from '@angular/core';
import { Cat } from '../../models/cat';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  @Input() cats$!: Observable<Cat[]> | null;
}
