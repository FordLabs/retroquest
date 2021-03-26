/*
 *  Copyright (c) 2020 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { ContributorsComponent } from './contributors.component';
import { ContributorsService } from './contributors.service';
import { Contributor } from '../../../domain/contributor';
import { Subject } from 'rxjs';

describe('ContributorsComponent', () => {
  let component: ContributorsComponent;
  let mockContrbutorsServerice: ContributorsService;
  let mockContributorSubject: Subject<Contributor[]>;

  beforeEach(() => {
    mockContributorSubject = new Subject<Contributor[]>();
    // @ts-ignore
    mockContrbutorsServerice = {
      getContributors: jest.fn().mockReturnValue(mockContributorSubject),
    } as ContributorsService;
    component = new ContributorsComponent(mockContrbutorsServerice);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load the contributors', () => {
      const contributor: Contributor = {
        accountUrl: 'url',
        image: 'avatar',
      };

      const contributors = [];
      contributors.push(contributor);

      component.ngOnInit();
      mockContributorSubject.next(contributors);
      expect(component.contributors[0][0]).toBe(contributor);
    });

    it('should properly format contributors into multiple rows', () => {
      const contributor: Contributor = {
        accountUrl: 'url',
        image: 'avatar',
      };
      const contributors = [
        { accountUrl: 'url1', image: 'avatar1' },
        { accountUrl: 'url2', image: 'avatar2' },
        { accountUrl: 'url3', image: 'avatar3' },
        { accountUrl: 'url4', image: 'avatar4' },
        { accountUrl: 'url5', image: 'avatar5' },
        contributor,
      ];
      component.ngOnInit();
      mockContributorSubject.next(contributors);
      expect(component.contributors.length).toBe(2);
      expect(component.contributors[0].length).toBe(5);
      expect(component.contributors[1].length).toBe(1);
      expect(component.contributors[1][0]).toBe(contributor);
    });
  });
});
