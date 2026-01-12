import React, { useCallback } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { getGrowthRatePercentage } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';

import { TradeParameterPopover, useTradeParameterPopover } from 'AppV2/Components/TradeParameters/Shared';
import { useTraderStore } from 'Stores/useTraderStores';

import { TTradeParametersProps } from '../trade-parameters';

const GrowthRateContent: React.FC<{
    accumulator_range_list: number[];
    growth_rate: number;
    onRateSelect: (rate: number) => void;
}> = ({ accumulator_range_list, growth_rate, onRateSelect }) => {
    const { closePopover } = useTradeParameterPopover();

    const handleRateSelectAndClose = useCallback(
        (rate: number) => {
            onRateSelect(rate);
            closePopover();
        },
        [onRateSelect, closePopover]
    );

    return (
        <div className='growth-rate-popover__content'>
            {accumulator_range_list.map(rate => {
                const percentage = getGrowthRatePercentage(rate);
                const isSelected = rate === growth_rate;

                return (
                    <button
                        key={rate}
                        type='button'
                        className={clsx('growth-rate-popover__option', {
                            'growth-rate-popover__option--selected': isSelected,
                        })}
                        onClick={() => handleRateSelectAndClose(rate)}
                    >
                        {percentage}%
                    </button>
                );
            })}
        </div>
    );
};

const GrowthRateDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { accumulator_range_list, growth_rate, has_open_accu_contract, is_market_closed, onChange } =
        useTraderStore();

    const handleRateSelect = useCallback(
        (rate: number) => {
            onChange({ target: { name: 'growth_rate', value: rate } });
        },
        [onChange]
    );

    return (
        <TradeParameterPopover
            popoverWidth={178}
            label={<Localize i18n_default_text='Growth rate' key={`growth-rate${is_minimized ? '-minimized' : ''}`} />}
            value={`${getGrowthRatePercentage(growth_rate)}%`}
            is_minimized={is_minimized}
            disabled={has_open_accu_contract || is_market_closed}
            popover_classname='growth-rate-popover'
        >
            <GrowthRateContent
                accumulator_range_list={accumulator_range_list}
                growth_rate={growth_rate}
                onRateSelect={handleRateSelect}
            />
        </TradeParameterPopover>
    );
});

export default GrowthRateDesktop;
