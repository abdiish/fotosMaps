import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  usuario: Usuario = {};

  constructor(private storage: Storage,
              private http: HttpClient,
              private navCtrl: NavController) {
                this.storage.create();
              }

  login(email: string, password: string) {

    const data = { email, password };

    return new Promise(resolve => {

      this.http.post(`${ URL }/user/login`, data).subscribe(resp => {
        console.log(resp);

        if (resp['ok']) {
          this.guardarToken(resp['token']);
          resolve(true);
        }else{
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });

    });


  }

  registro(usuario: Usuario) {

    return new Promise(resolve => {

      this.http.post(`${ URL }/user/create`, usuario).subscribe(resp => {
        console.log(resp);

        if (resp['ok']) {
          this.guardarToken(resp['token']);
          resolve(true);
        }else{
          this.token = null;
          this.storage.clear();
          resolve(false);
        }


      });

    });

  }

  async guardarToken(token: string) {

    this.token = token;
    await this.storage.set('token', token);

  }

  // Validar que haya token en storage
  async cargarToken() {

    this.token = await this.storage.get('token') || null;
  }

  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login'); // Sino hay token rerdireccionar al login
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.http.get(`${ URL }/user/`, {headers}).subscribe(resp => {
        if (resp['ok']) {
          this.usuario = resp['usuario'];
          resolve(true);
        } else {
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      });
    });
  }

}
