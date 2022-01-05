import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { LoginPage } from '../../../../../react/pages/login/LoginPage';
import { BrowserRouter as Router } from 'react-router-dom';

const containerElementName = 'myReactComponentContainer';

// @ts-ignore
@Component({
  selector: 'my-react-component-wrapper',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [
    '../../../../../react/pages/login/LoginPage.scss',
    '../../../../../react/templates/auth/AuthTemplate.scss',
    '../../../../../react/components/form/Form.scss',
    '../../../../../react/components/input-text/InputText.scss',
    '../../../../../react/components/contributors/Contributors.scss',
    '../../../../../react/components/logo/Logo.scss',
    '../../../../../react/components/button/Button.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MyComponentWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
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
      <Router>
        <LoginPage />
      </Router>,
      this.containerRef.nativeElement
    );
  }
}
