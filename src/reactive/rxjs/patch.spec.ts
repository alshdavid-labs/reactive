import * as rxjs from 'rxjs';
import { Observable } from '../observable';
import { Subject } from '../subject';
import { ReplaySubject } from '../replay-subject';
import { BehaviorSubject } from '../behavior-subject';
import { combineLatest } from '../combine-latest';

(Observable as any) = rxjs.Observable;
(Subject as any) = rxjs.Subject;
(ReplaySubject as any) = rxjs.ReplaySubject;
(BehaviorSubject as any) = rxjs.BehaviorSubject;
(combineLatest as any) = rxjs.combineLatest;

import '../observable.spec';
import '../subject.spec';
import '../replay-subject.spec';
import '../behavior-subject.spec';
import '../combine-latest.spec';
