import { AuthService } from './../services/auth.service';
import { ProfileService } from './../profile.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [DatePipe]
})
export class Tab3Page implements OnInit {

  masa_id: string;
  tables: Array<any> = [];
  categories: Array<any> = [];
  categoryProducts: Array<any> = [];
  categoryProduct: any = {};
  BILL: Array<any> = [];
  currentProduct: any = undefined;

  KITCHEN: Array<any> = [];
  BAR: Array<any> = [];

  table: any = {};
  product: any = {
    tavolina_id: 0,
    artEmri: "",
    artCmimi: 0,
    color: "",
    e_zene: null,
    tempPrice: 0,
    kategoriaID: 0
  };
  total: number = 0;

  logDetails: any = {
    artID: null,
    sasia: null,
    cmimi: null,
    tipi: null,
    komenti: null,
    cmimiHyrje: null,
    tavolinaID: null,
    kamarieriID: JSON.parse(localStorage.getItem("user")).kamarieriID,
    banaku: null,
    nrFaktura: null,
    transferBanak: null,
    stavka: null,
    data: new Date(),
    ora: new Date(),
    fiskal: null,
    mak: null,
    Fakturno: null,
    Org: null
  };

  logari: any = {
    tipi: null,
    kamerieriID: JSON.parse(localStorage.getItem("user")).kamarieriID,
    data: new Date,
    ora: new Date(),
    PDA: null,
    bardh: null,
    tavolinaID: null,
    hapur: null,
    identiID: null,
    nrFaktura: null,
    faktura_mbyllur: null,
    banaku: null,
    menyra: null,
    dataFaktura: null,
    Numri_fatura: null,
    Fakturno: null,
    Org: null
  };


  docDefinition: any = {
    content: [
      { bold: true, text: 'Faktura:459493', margin: [0, 0, 0, 15] },
      { text: 'Masa : 1', margin: [0, 0, 0, 5] },
      { text: 'Kelner : Kamarieri-1', margin: [0, 0, 0, 10] },
      { text: 'Data: ORA', margin: [0, 0, 0, 10] },
      {
        layout: 'lightHorizontalLines', // optional
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: [60, 50, 50, 50],

          body: []
        }
      }
    ],
    styles: {
      header: {
        bold: true,
        fontSize: 20,
        alignment: 'right'
      },
      sub_header: {
        fontSize: 18,
        alignment: 'right'
      },
      url: {
        fontSize: 16,
        alignment: 'right'
      }
    },
    pageSize: 'A4',
    pageOrientation: 'portrait'
  };

  myDate = new Date();
  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private profileService: ProfileService,
    private activatedRouter: ActivatedRoute
  ) { }

  makePdf() {
    pdfmake.vfs = pdfFonts.pdfMake.vfs;

 
    let today = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');

    this.docDefinition.content[0].text = "Faktura - " + Math.random();
    this.docDefinition.content[1].text = "Masa - " + this.masa_id;
    this.docDefinition.content[2].text = "Kelner :  Kamarieri - " + JSON.parse(localStorage.getItem("user")).kamarieriID;
    this.docDefinition.content[3].text = "Data - " + today;
    this.docDefinition.content[4].table.body = new Array(['Naziv', 'Kolicina', 'Cena', 'Iznos']);

    for (let item of this.BILL) {
      this.docDefinition.content[4].table.body.push([item.artEmri, item.quantity, item.artCmimi, item.tempPrice]);
    }

    this.docDefinition.content[4].table.body.push([{ text: 'Vkupno:', bold: true }, { text: '(Den)', bold: true }, { text: '', bold: true }, { text: this.total, bold: true }]);

    console.log(this.docDefinition);
    pdfmake.createPdf(this.docDefinition).open();
  }


  ngOnInit() {
    this.masa_id = this.activatedRouter.snapshot.paramMap.get('masa_id');
    console.log(this.masa_id);
    this.getTableWithProducts();
    this.getTable();
    this.getCategories();

    this.authService.tab1Status.next(true);
    this.authService.tab2Status.next(true);
    this.authService.tab3Status.next(false);
  }

  ionViewDidLeave() {
    this.authService.tab3Status.next(true);
    console.log("TabX is exited")
  }


  getTable() {
    this.profileService.getTableById(this.masa_id).subscribe(result => {
      this.tables = result.reverse();
      this.calculateTotal();
    });
  }

  getTableWithProducts() {
    this.profileService.getTable(this.masa_id).subscribe(result => {
      this.table = result[0];
    });
  }

  addTables() {
    this.product.tavolina_id = this.masa_id;
    this.profileService.addProductToTable(this.product).subscribe(result => {
      this.tables.unshift(this.product);
      this.product = {
        tavolina_id: this.masa_id,
        artEmri: "",
        artCmimi: 0,
        color: "",
        e_zene: null
      };
      try {
        let myTables: Array<any> = [];
        let table: Array<any> = [];

        if (JSON.parse(localStorage.getItem("myTables")) !== -1) {
          table = JSON.parse(localStorage.getItem("myTables"));
          table.push({
            tavolina_id: this.product.tavolina_id,
            user_id: JSON.parse(localStorage.getItem("user")).kamarieriID
          });
          localStorage.setItem("myTables", JSON.stringify(table));
        } else {
          table.push({
            tavolina_id: this.product.tavolina_id,
            user_id: JSON.parse(localStorage.getItem("user")).kamarieriID
          });
          localStorage.setItem("myTables", JSON.stringify(table));
        }
        this.product.color = "#1c7ceb";
        this.product.e_zene = 1;
        this.profileService.updateTableStatus(this.product).subscribe(result => { });
      } catch (err) {
        throw err;
      }
      this.calculateTotal();
    });
  }

  getCategories() {
    this.profileService.getCategories().subscribe(result => {
      this.categories = result;

      this.KITCHEN = result.filter(e => { return e.Pershkrimi === "Artikull Kuzhine" });
      this.BAR = result.filter(e => { return e.Pershkrimi === "Artikull Banaku" });
    });
  }

  calculateTotal() {
    this.total = 0;
    for (let tableProducts of this.tables) {
      this.total += tableProducts.artCmimi;
    }
  }

  freeTable() {
    let tables = [];
    this.product.tavolina_id = this.masa_id;
    this.product.artEmri = undefined;
    this.product.artCmimi = undefined;
    this.tables = [];
    try {
      let table: Array<any> = [];
      if (JSON.parse(localStorage.getItem("myTables")) !== -1) {
        table = JSON.parse(localStorage.getItem("myTables"));
        let tableIndex = table.findIndex(e => { return e.tavolina_id === this.product.tavolina_id });
        console.log(tableIndex);
        table.splice(tableIndex, 1);
        localStorage.setItem("myTables", JSON.stringify(table));
      } else {
        table.push({
          tavolina_id: this.product.tavolina_id,
          user_id: JSON.parse(localStorage.getItem("user")).kamarieriID
        });
        localStorage.setItem("myTables", JSON.stringify(table));
      }

      this.product.color = "#2dd36f";
      this.product.e_zene = 0;
      this.profileService.updateTableStatus(this.product).subscribe(result => {
        this.router.navigateByUrl('/tabs/tab2');
      });
    } catch (err) {
      throw err;
    }
  }



  //13.08.2020
  getProducts(select?: string) {
    if (select !== '') {
      let table: Array<any> = [];

      if (JSON.parse(localStorage.getItem("myTables")) !== -1) {
        table = JSON.parse(localStorage.getItem("myTables"));
        table.push({
          tavolina_id: this.product.tavolina_id,
          user_id: JSON.parse(localStorage.getItem("user")).kamarieriID
        });
        localStorage.setItem("myTables", JSON.stringify(table));
      } else {
        table.push({
          tavolina_id: this.product.tavolina_id,
          user_id: JSON.parse(localStorage.getItem("user")).kamarieriID
        });
        localStorage.setItem("myTables", JSON.stringify(table));
      }
      this.product.tavolina_id = this.masa_id;
      this.product.color = "#1c7ceb";
      this.product.e_zene = 1;
      this.profileService.updateTableStatus(this.product).subscribe(tresult => { });
    } else { }

    this.categoryProducts = []; // Reset Array
    this.categoryProduct = {}; // Reset Object

    this.profileService.getProductsOfCategory(this.product.kategoriaID).subscribe(result => {
      this.categoryProducts = result;
      console.log(this.categoryProducts);
    });
  }

  addToBill(item: any) {
    let productFound = this.BILL.find(e => { return e.artID === item.artID });
    if (productFound) {
      this.product.kategoriaID = 0;
      productFound.quantity += 1;
      item.tempPrice = item.artCmimi;
      this.total += item.artCmimi;
    } else {
      this.product.kategoriaID = 0;
      item.quantity = 1;
      item.tempPrice = item.artCmimi;
      this.total += item.artCmimi;
      this.currentProduct = item;
      this.BILL.push(this.currentProduct);
    }
  }

  confirm() {
    this.total += this.currentProduct.artCmimi;
    this.BILL.push(this.currentProduct);
  }

  increaseQ(item: any) {
    item.quantity += 1;
    this.total += item.artCmimi;
    item.tempPrice += item.artCmimi;
  }


  decreaseQ(item: any) {
    if (item.quantity === 1) {
      // Do nothing.
    } else {
      item.quantity -= 1;
      this.total -= item.artCmimi;
    }
  }

  removeItem(index: number, item: any) {
    this.BILL.splice(index, 1);
    this.currentProduct.quantity = 1;
    if (this.BILL.length > 0) {
      if (this.total <= 0) {

      } else {
        this.total -= item.artCmimi;
      }
    } else {
      this.total = 0;
    }
  }

  print() {
    this.addToLogari();
  }

  addToLogari() {
    this.logari.tavolinaID = this.masa_id;
    this.profileService.addToLogari(this.logari).subscribe(result => {
      this.makePdf();
      this.currentProduct = undefined;
      this.categoryProducts = [];
      this.BILL = [];
      this.product.kategoriaID = 0;
      this.authService.tab2Status.next(true);
      this.router.navigateByUrl('/tabs/tab2');
      // this.freeTable();
    });

  }

  addToLogDetails() {
    for (let item of this.BILL) {
      this.logDetails.tavolinaID = this.masa_id;
      this.logDetails.cmimi = item.artCmimi;
      this.logDetails.artID = item.artID;
      this.profileService.addToLogariDetails(this.logDetails).subscribe(result => { });
    };
  }



}
