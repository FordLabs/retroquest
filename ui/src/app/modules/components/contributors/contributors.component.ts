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

import { Component, OnInit } from '@angular/core';
import { ContributorsService } from './contributors.service';
import { Contributor } from '../../domain/contributor';

@Component({
  selector: 'rq-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
})
export class ContributorsComponent implements OnInit {
  contributors: Contributor[][];

  ROW_SIZE = 5;

  constructor(private contributorService: ContributorsService) {}

  ngOnInit() {
    this.contributorService.getContributors().subscribe((result) => {
      const rows = Math.ceil(result.length / 5);
      this.contributors = new Array(rows);
      let currentRow;
      let contributorsPos = 0;
      for (
        currentRow = 0;
        currentRow < this.contributors.length;
        currentRow++
      ) {
        this.contributors[currentRow] = new Array(
          this.remaningSpace(result, currentRow)
        );
        let currentColumn;
        for (
          currentColumn = 0;
          currentColumn < this.contributors[currentRow].length;
          currentColumn++
        ) {
          this.contributors[currentRow][currentColumn] =
            result[contributorsPos];
          contributorsPos++;
        }
      }
    });
  }

  private rowCountFromContributorCount(contributors: Contributor[]) {
    return Math.ceil(contributors.length / this.ROW_SIZE);
  }

  private remaningSpace(
    contributors: Contributor[],
    currentRow: number
  ): number {
    const rows = this.rowCountFromContributorCount(contributors);
    const leftover: number = contributors.length % this.ROW_SIZE;
    if (currentRow === rows - 1) {
      return leftover;
    }
    return this.ROW_SIZE;
  }
}
