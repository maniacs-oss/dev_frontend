import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Logger } from 'angular2-logger/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { IsUserRegisteredModel, RegisterUserModel } from '../models';

@Injectable()
export class RegisterUserService {

  private _isUserRegistered:IsUserRegisteredModel;

  constructor(private _http:Http, private _logger:Logger) {
    this._isUserRegistered = new IsUserRegisteredModel();
  }

  public async isUserRegisteredCheck(email:String, idToken:String):Promise<any> {
    var headers = new Headers({
      "Content-Type":"application/json",
      "idToken":idToken
    });
    var url = "http://localhost:8080/api/app/user/is/registered?email=" + email;

    return await this._http.get(url, {headers: headers})
      .map((res:Response) => (res.json()))
      .do((data:IsUserRegisteredModel) => {
        this._logger.info("is user registered? " + data.isRegistered);
        this._isUserRegistered.isRegistered = data.isRegistered;
      })
      .toPromise();
  }

  public async registerUser(email:String, provider:String, idToken:String):Promise<any> {
    var headers = new Headers({
      "Content-Type":"application/json",
      "idToken":idToken
    });
    var body = JSON.stringify({"email":email, "provider":provider});
    var url = "http://localhost:8080/api/user/register";

    return await this._http.post(url, body, {headers: headers})
      .map((res:Response) => (res.json()))
      .do((data:RegisterUserModel) => {
        this._logger.info("registered user? " + data.userRegistered);
        this._isUserRegistered.isRegistered = data.userRegistered;
      })
      .toPromise();
  }

  public isUserRegistered():boolean {
    return this._isUserRegistered.isRegistered;
  }


}