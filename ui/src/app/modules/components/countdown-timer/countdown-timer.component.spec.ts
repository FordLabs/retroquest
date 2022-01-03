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

import { CountdownTimerComponent } from './countdown-timer.component';
//import { fireEvent, render, screen } from '@testing-library/angular';
//import userEvent from '@testing-library/user-event';


describe('CountdownTimerComponent', () => {
  let component: CountdownTimerComponent;

  beforeEach(() => {
    component = new CountdownTimerComponent();
  });

  it('should create with default of 5 minutes', () => {
    expect(component).toBeTruthy();
    expect(component.minutes).toBe(5);
  });

  describe('setTimer', () => {
    beforeEach(() => {
      component.setTimer(10);
    });

    it('should set minutes to value passed', () => {
      expect(component.minutes).toBe(10);
    });
  });

  describe('oneMinute', () => {
    beforeEach(() => {
      component.oneMinute();
      jest.spyOn(global, 'setInterval');
    });

     it('should set the timer to 1 minute', () => {
       expect(component.minutes).toBe(1);
     });

     it('should start the timer again', () => {
       expect(setInterval).toHaveBeenCalled();
     })
  });

  describe('clearTimer', () => {
    beforeEach(() => {
      component.clearTimer();
      jest.spyOn(global, 'clearInterval');
    });

    it('should set minutes and seconds to zero', () => {
      expect(component.minutes).toBe(0);
      expect(component.seconds).toBe(0);
    });

    it('should set \'started\' to false', () => {
      expect(component.started).toBeFalsy();
    });

    it('should set \'running\' to false', () => {
      expect(component.running).toBeFalsy();
    });

    it('should clear interval', () => {
      expect(clearInterval).toHaveBeenCalled();
    });
  });

  describe('pauseTimer', ()=> {
    beforeEach(() => {
      jest.spyOn(global, 'clearInterval');
      component.pauseTimer();
    });

    it('should clear the interval', () => {
      expect(clearInterval).toHaveBeenCalled();
    });

    it('should set running to false', () => {
      expect(component.running).toBeFalsy();
    });
  });

  describe('startTimer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(global, 'clearInterval');
      jest.spyOn(global, 'setInterval');
      component.startTimer();
    });

    it('should set \'running\' and \' start\' to true', () => {
      expect(component.running).toBeTruthy();
      expect(component.started).toBeTruthy();
    });

    it('should clear interval to prevent snow ball effect', () => {
      expect(clearInterval).toHaveBeenCalled();
    });

    it('should set interval to begin timer', () => {
      expect(setInterval).toHaveBeenCalled();
    });

    it('should decrement time every second', () => {
      jest.advanceTimersByTime(1000);
      expect(component.minutes).toBe(4);
      expect(component.seconds).toBe(59);
    })
  });




//   it('should set minutes and seconds to zero when undefined', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: undefined, seconds: undefined }, });
//     fireEvent.click(screen.getByLabelText('start'));
//     expect(screen.queryAllByDisplayValue('00')).toHaveLength(2);
//   });

//   it('should display time - 1 sec after 1 second', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 0 }, });
//     jest.useFakeTimers();
//     jest.spyOn(global, 'setInterval');
//     fireEvent.click(screen.getByLabelText('start'));
//     jest.advanceTimersByTime(1000);
//     expect(setInterval).toHaveBeenCalledTimes(1);
//     expect(screen.queryAllByDisplayValue('00')).toHaveLength(1);
//     expect(screen.queryAllByDisplayValue('59')).toHaveLength(1);
//   });

//   it('should continue to display the same time when pause button is hit', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 0 }, });
//     jest.useFakeTimers();
//     jest.spyOn(global, 'setInterval');
//     fireEvent.click(screen.getByLabelText('start'));
//     expect(setInterval).toHaveBeenCalledTimes(1);
//     jest.advanceTimersByTime(2000);
//     fireEvent.click(screen.getByLabelText('pause'));
//     jest.advanceTimersByTime(2000);
//     expect(screen.queryAllByDisplayValue('00')).toHaveLength(1);
//     expect(screen.queryAllByDisplayValue('58')).toHaveLength(1);
//   });

//   it('should set minutes and seconds as whatever values are entered', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: 0, seconds: 0}, });
//     userEvent.type(screen.getByLabelText('minutes'), '03');
//     userEvent.type(screen.getByLabelText('seconds'), '03');
//     fireEvent.click(screen.getByLabelText('start'));
//     expect(screen.queryAllByDisplayValue('03')).toHaveLength(2);
//   });

//   it('should set minutes and seconds to 0 when clear button is hit', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 1}, });
//     fireEvent.click(screen.getByLabelText('clear'));
//     expect(screen.queryAllByDisplayValue('00')).toHaveLength(2);
//   });

//   it('should set minutes and seconds to 0 when negative values are entered', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 0}, });
//     userEvent.type(screen.getByLabelText('minutes'), '-03');
//     userEvent.type(screen.getByLabelText('seconds'), '-03');
//     fireEvent.click(screen.getByLabelText('start'));
//     expect(screen.queryAllByDisplayValue('00')).toHaveLength(2);
//   });

//   it('should set minutes and seconds to 99 when values over 99 are entered', async () => {
//     await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 0}, });
//     userEvent.type(screen.getByLabelText('minutes'), '4567');
//     userEvent.type(screen.getByLabelText('seconds'), '4567');
//     fireEvent.click(screen.getByLabelText('start'));
//     expect(screen.queryAllByDisplayValue('99')).toHaveLength(2);
//   });
});