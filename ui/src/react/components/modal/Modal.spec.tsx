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

import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Modal, { ModalMethods } from './Modal';

const ref = React.createRef<ModalMethods>();

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uncontrolled', () => {
    beforeEach(() => {
      render(
        <Modal ref={ref}>
          <div>Modal Content</div>
        </Modal>
      );

      act(() => {
        ref.current.show();
      });
    });

    it('should show and hide by ref methods', () => {
      screen.getByText('Modal Content');

      act(() => {
        ref.current.hide();
      });

      expect(screen.queryByText('Modal Content')).toBeFalsy();
    });

    it('should hide only when backdrop is clicked', () => {
      userEvent.click(screen.getByText('Modal Content'));
      screen.getByText('Modal Content');

      userEvent.click(screen.getByTestId('modalBackdrop'));
      expect(screen.queryByText('Modal Content')).toBeFalsy();
    });

    it('should hide when escape key is pressed', () => {
      userEvent.type(document.body, '{escape}');

      expect(screen.queryByText('Modal Content')).toBeFalsy();
    });
  });

  describe('controlled', () => {
    const mockClose = jest.fn();

    it('should show and hide by prop', () => {
      const { rerender } = render(
        <Modal ref={ref} show={true} onHide={mockClose}>
          <div>Modal Content</div>
        </Modal>
      );

      screen.getByText('Modal Content');

      rerender(
        <Modal ref={ref} show={false}>
          <div>Modal Content</div>
        </Modal>
      );

      expect(screen.queryByText('Modal Content')).toBeFalsy();
    });

    it('should call onHide when backdrop is clicked', () => {
      render(
        <Modal ref={ref} show={true} onHide={mockClose}>
          <div>Modal Content</div>
        </Modal>
      );

      userEvent.click(screen.getByText('Modal Content'));
      expect(mockClose).not.toHaveBeenCalled();

      userEvent.click(screen.getByTestId('modalBackdrop'));
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('should call onHide when escape key is pressed', () => {
      render(
        <Modal ref={ref} show={true} onHide={mockClose}>
          <div>Modal Content</div>
        </Modal>
      );

      userEvent.type(document.body, '{escape}');

      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('can turn off closing on backdrop click', () => {
      render(
        <Modal ref={ref} show={true} onHide={mockClose} hideOnBackdropClick={false}>
          <div>Modal Content</div>
        </Modal>
      );

      userEvent.click(screen.getByTestId('modalBackdrop'));

      expect(mockClose).not.toHaveBeenCalled();
    });

    it('can turn off closing on escape key', () => {
      render(
        <Modal ref={ref} show={true} onHide={mockClose} hideOnEscape={false}>
          <div>Modal Content</div>
        </Modal>
      );

      userEvent.type(document.body, '{escape}');

      expect(mockClose).not.toHaveBeenCalled();
    });
  });
});
