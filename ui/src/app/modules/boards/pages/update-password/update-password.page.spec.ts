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

import { HttpResponse } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

import { AuthService } from '../../../auth/auth.service';
import { TeamService } from '../../../teams/services/team.service';
import { createMockRecaptchaComponent, createMockRouter } from '../../../utils/testutils';

import { UpdatePasswordComponent } from './update-password.page';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let mockTeamService;
  let mockActivatedRoute;
  let mockRouter;
  let mockRecaptchaComponent;

  beforeEach(() => {
    mockTeamService = {
      updatePassword: jest.fn().mockReturnValue(new Subject()),
    } as unknown as TeamService;
    mockActivatedRoute = { snapshot: { params: { teamId: -1 } } };
    mockRouter = createMockRouter();
    mockRecaptchaComponent = createMockRecaptchaComponent();

    jest.spyOn(AuthService, 'setToken');
    jest.spyOn(console, 'error');

    component = new UpdatePasswordComponent(mockTeamService, mockActivatedRoute, mockRouter);
    component.recaptchaComponent = mockRecaptchaComponent;
  });

  describe('updatePassword', () => {
    it('should call update password', () => {
      component.teamId = 'teamId';
      component.previousPassword = 'oldPassword';
      component.newPassword = 'newPassword';
      component.confirmPassword = 'newPassword';
      component.updatePassword();
      expect(mockTeamService.updatePassword).toHaveBeenCalledWith('teamId', 'oldPassword', 'newPassword');
    });

    it('should navigate back to team page', () => {
      component.teamId = 'teamId';
      component.previousPassword = 'oldPassword';
      component.newPassword = 'newPassword';
      component.confirmPassword = 'newPassword';

      const updatePasswordResponse: HttpResponse<string> = new HttpResponse({
        body: 'Password updated successfully',
      });

      mockTeamService.updatePassword = jest.fn().mockReturnValue(of(updatePasswordResponse));

      component.updatePassword();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('team/teamId');
    });

    it('should set the error message and log it when updatePassword has an error', () => {
      component.teamId = 'teamId';
      component.previousPassword = 'oldPassword';
      component.newPassword = 'newPassword';
      component.confirmPassword = 'newPassword';

      const httpErrorMessage = 'server error message';
      const error = { error: JSON.stringify({ message: httpErrorMessage }) };

      mockTeamService.updatePassword = jest.fn().mockReturnValue(throwError(error));

      component.updatePassword();

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A registration error occurred: ', httpErrorMessage);
    });

    describe('input validation', () => {
      it('should not update if the previous password field is null', () => {
        component.previousPassword = null;
        component.updatePassword();
        expect(component.errorMessage).toBe('Please enter your original password');
        expect(mockTeamService.updatePassword).not.toHaveBeenCalled();
      });

      it('should not update if the previous password field is empty', () => {
        component.previousPassword = '';
        component.updatePassword();
        expect(component.errorMessage).toBe('Please enter your original password');
        expect(mockTeamService.updatePassword).not.toHaveBeenCalled();
      });

      it('should not update if the new password field is null', () => {
        component.previousPassword = 'oldPassword';
        component.newPassword = null;
        component.confirmPassword = null;
        component.updatePassword();
        expect(component.errorMessage).toBe('Please enter a new password');
        expect(mockTeamService.updatePassword).not.toHaveBeenCalled();
      });

      it('should not update if the new password field is empty', () => {
        component.previousPassword = 'oldPassword';
        component.newPassword = '';
        component.confirmPassword = '';
        component.updatePassword();
        expect(component.errorMessage).toBe('Please enter a new password');
        expect(mockTeamService.updatePassword).not.toHaveBeenCalled();
      });

      it('should not update if the new password field is not equal to the confirm password field', () => {
        component.previousPassword = 'oldPassword';
        component.newPassword = 'newPassword';
        component.confirmPassword = 'aNewPassword';
        component.updatePassword();
        expect(component.errorMessage).toBe('Please enter matching new passwords');
        expect(mockTeamService.updatePassword).not.toHaveBeenCalled();
      });
    });
  });
});
