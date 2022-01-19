/*
 * Copyright (c) 2022 Ford Motor Company
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
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router as AngularRouter } from '@angular/router';

import CreatePage from './CreatePage';

const containerElementName = 'reactCreatePageWrapper';

@Component({
  selector: 'react-create-page-wrapper',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [
    '../../templates/auth/AuthTemplate.scss',
    '../../components/form/Form.scss',
    '../../components/input-text/InputText.scss',
    '../../components/contributors/Contributors.scss',
    '../../components/logo/Logo.scss',
    '../../components/button/Button.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReactCreatePageWrapper implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

  constructor(private angularRoute: ActivatedRoute, private angularRouter: AngularRouter) {}

  ngOnChanges(): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    ReactDOM.render(
      <React.StrictMode>
        <CreatePage
          routeTo={(path: string) => {
            this.angularRouter.navigateByUrl(path).then();
          }}
        />
      </React.StrictMode>,
      this.containerRef.nativeElement
    );
  }
}
