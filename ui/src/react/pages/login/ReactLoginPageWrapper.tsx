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
import { LoginPage } from './LoginPage';
import { BrowserRouter as Router } from 'react-router-dom';

const containerElementName = 'reactLoginPageWrapper';

@Component({
  selector: 'react-login-page-wrapper',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [
    './LoginPage.scss',
    '../../templates/auth/AuthTemplate.scss',
    '../../components/form/Form.scss',
    '../../components/input-text/InputText.scss',
    '../../components/contributors/Contributors.scss',
    '../../components/logo/Logo.scss',
    '../../components/button/Button.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReactLoginPageWrapper implements OnChanges, OnDestroy, AfterViewInit {
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
