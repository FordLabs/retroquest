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

import { ContributorsService } from './contributors.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { createMockHttpClient } from '../../utils/testutils';

describe('ContributorsService', () => {
  let service: ContributorsService;
  let mockHttpClient: HttpClient;
  let mockHttpClientGetSubject: Subject<any>;

  beforeEach(() => {
    mockHttpClientGetSubject = new Subject<any>();
    mockHttpClient = createMockHttpClient();
    service = new ContributorsService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getContributors', () => {
    it('should request the contributors from github', () => {
      service.getContributors().subscribe(() => {
        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/contributors');
      });
      mockHttpClientGetSubject.next([]);
    });
    it('should prepend data:image/png;base64 to all image data', () => {
      service.getContributors().subscribe((result) => {
        expect(
          result[0].image.startsWith('data:image/png;base64,')
        ).toBeTruthy();
      });
      mockHttpClientGetSubject.next([
        { accountUrl: 'accountUrl', image: 'imageData' },
      ]);
    });
  });
});
