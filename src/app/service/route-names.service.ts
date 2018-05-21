import {Subject} from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class RouteNames{
  public name = new Subject<string>();
}