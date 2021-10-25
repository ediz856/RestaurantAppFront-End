import { AuthService } from './../services/auth.service';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ProfileService } from './../profile.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnChanges, OnDestroy {
  @ViewChild('masaBTN') el: ElementRef;

  @Input('ngStyle')
  set ngStyle(value: { [klass: string]: any } | null) {
    console.log(value);
  }

  back: boolean = false;
  password: string = "";
  isSearch: boolean = false;
  currentColor: string = "black";
  profiles: Array<any> = [];
  tables: Array<any> = [];
  profile: any = undefined;
  localTables: Array<any> = JSON.parse(localStorage.getItem("myTables"));
  currentUserId: any = {};

  product: any = {
    tavolina_id: 0,
    artEmri: "",
    artCmimi: 0,
    color: "",
    e_zene: null,
    kategoriaID: 0
  };

  constructor(
    private authService: AuthService,
    public toastController: ToastController,
    private renderer: Renderer2,
    private router: Router,
    private profileService: ProfileService) {
    router.events.subscribe((val) => {
      this.getAllTables();

    });
  }

  ngOnInit(): void {
    if (this.auth()) {

      this.authService.tab3Status.next(true);
      this.authService.tab1Status.next(true);
      this.authService.tab2Status.next(false);
 

      this.getAllTables();
      this.profile = JSON.parse(localStorage.getItem("user"));
      this.localTables = JSON.parse(localStorage.getItem("myTables"));
      this.currentUserId = JSON.parse(localStorage.getItem("user")).kamarieriID;
    }
  }


  ionViewDidLeave() {
    this.authService.tab3Status.next(false);
    console.log("TabX is exited")
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

  getAllTables() {
    this.profileService.getAllTables().subscribe(result => {
      this.tables = result;

    });
  }

  async freeTable() {
    let self = this;
    return new Promise(function (resolve, reject) {
      let myTables = JSON.parse(localStorage.getItem("myTables")).filter(e => { return e.user_id === JSON.parse(localStorage.getItem("user")).kamarieriID });
      console.log("My table list : ", myTables);
      for (let table of myTables) {
        try {
          if (table.tavolina_id !== 0) {
            self.product.tavolina_id = table.tavolina_id;
            self.product.color = "#2dd36f";
            self.product.e_zene = 0;
            self.profileService.updateTableStatus(self.product).subscribe(result => { });
          }
        } catch (err) {
          throw err;
        }
      }
      resolve();
    }).then(result => {
      self.router.navigateByUrl('/tabs/tab2');
    }).catch(e => {
      console.log(e);
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.tables = [];
  }

  // findInTables(tableID) {
  //   if (this.localTables !== undefined) {
  //     return this.localTables.find(e => e === tableID);
  //   }
  // }

  getMyTables(table: any) {
    if (JSON.parse(localStorage.getItem("myTables")) !== null) {
      let obj = this.localTables.find(e => { return parseInt(e.tavolina_id) === parseInt(table.tavolinaID) });
      if (obj || obj !== undefined) {
        if (obj.user_id === this.currentUserId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async logout() {
    try {
      await this.freeTable();
      localStorage.removeItem("user");
      setTimeout(() => {
        this.authService.tab1Status.next(false);
        this.authService.tab2Status.next(true); // disabled buttons
        this.authService.tab3Status.next(true); // disabled buttons
      }, 100);
      this.router.navigateByUrl('/tabs/tab1');
    } catch (error) {
      console.log(error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.getAllTables();
  }


  goToTable(table: any, isMyTable?: boolean) {
    if (isMyTable) {
      this.router.navigateByUrl('/tabs/tab3/' + table.tavolinaID);
    } else {

    }

  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }
}
