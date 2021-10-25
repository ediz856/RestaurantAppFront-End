import { AuthService } from './../services/auth.service';

import { ProfileService } from './../profile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  isSearch: boolean = false;
  password: string = "";
  back: boolean = false;

  profiles: Array<any> = [];
  profile: any = undefined;

  constructor(
    private authService: AuthService,
    public translocoService: TranslocoService,
    private router: Router,
    private profileService: ProfileService
  ) {

  }

  ngOnInit(): void {
    this.authService.tab2Status.next(false);
    this.authService.tab2Status.next(true); // disabled buttons
    this.authService.tab3Status.next(true);
  }

  buttonPressed(number: string) {
    this.password += '' + number;
  }

  changeLanguage(event: any){
    console.log(event.detail.value);
    this.translocoService.setActiveLang(event.detail.value);
  }

  login() {
    this.profileService.getProfile().subscribe(result => {
      this.profiles = result;
      this.profile = this.profiles.find(e => {
        return e.Password === this.password;
      });
      try {
        localStorage.setItem("user", JSON.stringify(this.profile));
        if (this.profile !== undefined) {
          this.router.navigateByUrl('/tabs/tab2');
        }
      }
      catch (err) {
        console.log(err);
      }
    });
  }

}
