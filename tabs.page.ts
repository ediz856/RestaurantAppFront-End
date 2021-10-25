import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  tab1: boolean = false;
  tab2: boolean = false;
  tab3: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.tab1Status.subscribe(result => {
      this.tab1 = result;
    });

    this.authService.tab2Status.subscribe(result => {
      this.tab2 = result;
    });

    this.authService.tab3Status.subscribe(result => {
      this.tab3 = result;
    });

    if (this.auth()) {
      this.tab2 = false;
    } else {
      this.tab2 = true;
      this.tab3 = true;
    }
  }

  auth(): boolean {
    try {
      if (JSON.parse(localStorage.getItem("user"))) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  }

}
