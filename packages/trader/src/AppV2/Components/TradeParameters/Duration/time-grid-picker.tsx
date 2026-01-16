import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { Localize } from '@deriv-com/translations';

interface TimeGridPickerProps {
    selectedTime: string;
    onTimeChange: (time: string) => void;
    startTimes?: moment.Moment[];
    endTimes?: moment.Moment[];
}

const TimeGridPicker: React.FC<TimeGridPickerProps> = ({ selectedTime, onTimeChange, startTimes, endTimes }) => {
    const [selectedHour, selectedMinute] = selectedTime.split(':');

    // Generate hours array (00-23)
    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')), []);

    // Generate minutes array with 5-minute intervals (00, 05, 10, ..., 55)
    const minutes = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')), []);

    // Check if a time is valid based on market hours
    const isTimeValid = useCallback(
        (hour: string, minute: string) => {
            if (!startTimes || !endTimes || startTimes.length === 0 || endTimes.length === 0) {
                return true;
            }

            const timeToCheck = moment().hour(parseInt(hour)).minute(parseInt(minute));

            for (let i = 0; i < startTimes.length; i++) {
                if (timeToCheck.isBetween(startTimes[i], endTimes[i], 'minute', '[]')) {
                    return true;
                }
            }
            return false;
        },
        [startTimes, endTimes]
    );

    const handleHourClick = useCallback(
        (hour: string) => {
            if (isTimeValid(hour, selectedMinute)) {
                onTimeChange(`${hour}:${selectedMinute}`);
            }
        },
        [selectedMinute, onTimeChange, isTimeValid]
    );

    const handleMinuteClick = useCallback(
        (minute: string) => {
            if (isTimeValid(selectedHour, minute)) {
                onTimeChange(`${selectedHour}:${minute}`);
            }
        },
        [selectedHour, onTimeChange, isTimeValid]
    );

    return (
        <div className='time-grid-picker'>
            <div className='time-grid-picker__section'>
                <div className='time-grid-picker__label'>
                    <Localize i18n_default_text='Hour' />
                </div>
                <div className='time-grid-picker__grid time-grid-picker__grid--hours'>
                    {hours.map(hour => {
                        const isValid = isTimeValid(hour, selectedMinute);
                        const isSelected = hour === selectedHour;
                        return (
                            <div
                                key={hour}
                                className={classNames('time-grid-picker__item', {
                                    'time-grid-picker__item--selected': isSelected,
                                    'time-grid-picker__item--disabled': !isValid,
                                })}
                                onClick={() => isValid && handleHourClick(hour)}
                            >
                                {hour}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='time-grid-picker__section'>
                <div className='time-grid-picker__label'>
                    <Localize i18n_default_text='Minute' />
                </div>
                <div className='time-grid-picker__grid time-grid-picker__grid--minutes'>
                    {minutes.map(minute => {
                        const isValid = isTimeValid(selectedHour, minute);
                        const isSelected = minute === selectedMinute;
                        return (
                            <div
                                key={minute}
                                className={classNames('time-grid-picker__item', {
                                    'time-grid-picker__item--selected': isSelected,
                                    'time-grid-picker__item--disabled': !isValid,
                                })}
                                onClick={() => isValid && handleMinuteClick(minute)}
                            >
                                {minute}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimeGridPicker;
