import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    // this.getCurrentLocation();
  }

  // getCurrentLocation () {
  //   this.http.getCurrentLocation().pipe(takeUntil(this.destroy)).subscribe(data => {
  //     console.log(data);
  //   }, err => {
  //     console.log(err);
  //   })
  // }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
