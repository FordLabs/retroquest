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

import {
  AfterViewInit,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class ReactWrapper<
  T extends React.FunctionComponent<P>,
  P = React.ComponentProps<T>
> implements OnChanges, OnDestroy, AfterViewInit
{
  containerRef: ElementRef;

  get reactComponent(): T {
    throw new Error("Method 'reactComponent()' must be implemented.");
  }

  get props(): P {
    throw new Error("Method 'props()' must be implemented.");
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    if (this.containerRef)
      ReactDOM.render(
        React.createElement(this.reactComponent, this.props),
        this.containerRef.nativeElement
      );
  }
}
