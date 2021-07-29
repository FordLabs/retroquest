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
import { render, screen } from '@testing-library/react';
import FloatingCharacterCountdown from './FloatingCharacterCountdown';

describe('FloatingCharacterCountdownComponent', () => {
  describe('visibility', () => {
    it('should be hidden when character count is 0', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={0}
          maxCharacterCount={100}
        />
      );
      expect(screen.getByText('100').className).not.toContain('visible');
    });

    it('should show the number of remaining characters', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={1}
          maxCharacterCount={100}
        />
      );
      expect(screen.getByText('99').className).toContain('visible');
    });
  });

  describe('characters are about to run out', () => {
    it('should warn if the remaining characters to input are less than threshold', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={2}
          maxCharacterCount={3}
          charsAreRunningOutThreshold={2}
        />
      );
      expect(screen.getByText('1').className).toContain('display-warning-text');
    });

    it('should not warn if the remaining characters to input are greater than or equal to the threshold', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={1}
          maxCharacterCount={3}
          charsAreRunningOutThreshold={2}
        />
      );
      expect(screen.getByText('2').className).not.toContain(
        'display-warning-text'
      );
    });

    it('should not warn if the remaining characters have run out', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={3}
          maxCharacterCount={3}
          charsAreRunningOutThreshold={2}
        />
      );
      expect(screen.getByText('0').className).not.toContain(
        'display-warning-text'
      );
    });
  });

  describe('characters have run out', () => {
    it('should error if the remaining characters are less than or equal to 0', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={3}
          maxCharacterCount={3}
          charsAreRunningOutThreshold={2}
        />
      );
      expect(screen.getByText('0').className).toContain('display-error-text');
    });

    it('should not error if the remaining characters are greater than 0', () => {
      render(
        <FloatingCharacterCountdown
          characterCount={2}
          maxCharacterCount={3}
          charsAreRunningOutThreshold={2}
        />
      );
      expect(screen.getByText('1').className).not.toContain(
        'display-error-text'
      );
    });
  });
});
