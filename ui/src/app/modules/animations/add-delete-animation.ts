/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {animate, group, style, transition, trigger} from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition('* => void', [
    style({ height: '*', overflow: 'visible', opacity: '1', transform: 'translateX(0)'}),
    group([
      animate('.4s ease', style({ height: '0', 'margin-bottom': '0' })),
      animate('.2s ease', style({ opacity: '0', transform: 'translateX(20px)' }))
    ])
  ]),
  transition('void => active', [
    style({ height: '0', opacity: '0', transform: 'translateX(20px)' }),
    group([
      animate('.2s ease', style({ height: '*' })),
      animate('.4s ease', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
  ])
]);
