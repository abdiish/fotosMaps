import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;

  constructor(private storage: Storage,
              private http: HttpClient) { }

  login(email: string, password: string) {

    const data = { email, password };

    this.http.post(`${ URL }/user/login`, data).subscribe(resp => {
      console.log(resp);
    });

  }
}
