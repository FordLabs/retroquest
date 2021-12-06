import { CountdownTimerComponent } from './countdown-timer.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';


describe('CountdownTimerComponent', () => {
  it('should set minutes and seconds to zero when undefined', async () => {
    await render(CountdownTimerComponent, { componentProperties: { minutes: undefined, seconds: undefined }, });
    fireEvent.click(screen.getByLabelText('start'));
    expect(screen.queryAllByDisplayValue('00')).toHaveLength(2);
  });

  it('should display time - 1 sec after 1 second', async () => {
    await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 0 }, });
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    fireEvent.click(screen.getByLabelText('start'));
    jest.advanceTimersByTime(1000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(screen.queryAllByDisplayValue('00')).toHaveLength(1);
    expect(screen.queryAllByDisplayValue('59')).toHaveLength(1);
  });

  it('should continue to display the same time when pause button is hit', async () => {
    await render(CountdownTimerComponent, { componentProperties: { minutes: 1, seconds: 0 }, });
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    fireEvent.click(screen.getByLabelText('start'));
    expect(setInterval).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(2000);
    fireEvent.click(screen.getByLabelText('pause'));
    jest.advanceTimersByTime(2000);
    expect(screen.queryAllByDisplayValue('00')).toHaveLength(1);
    expect(screen.queryAllByDisplayValue('58')).toHaveLength(1);
  });

  it('should set minutes and seconds as whatever values are entered', async () => {
    await render(CountdownTimerComponent, { componentProperties: { minutes: 0, seconds: 0}, });
    userEvent.type(screen.getByLabelText('minutes'), '03');
    userEvent.type(screen.getByLabelText('seconds'), '03');
    fireEvent.click(screen.getByLabelText('start'));
    expect(screen.queryAllByDisplayValue('03')).toHaveLength(2);
  });
});