import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    tab1Status = new Subject<any>();
    tab2Status = new Subject<any>();
    tab3Status = new Subject<any>();
}