import { useCallback } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

import { TradeParameterPopover, useTradeParameterPopover } from '../Shared';
import { TTradeParametersProps } from '../trade-parameters';

const MultiplierContent: React.FC<{
    multiplier_range_list: { text: string; value: number }[];
    multiplier: number;
    onMultiplierSelect: (value: number) => void;
}> = ({ multiplier_range_list, multiplier, onMultiplierSelect }) => {
    const { closePopover } = useTradeParameterPopover();

    const handleMultiplierSelectAndClose = useCallback(
        (selected_multiplier: number) => {
            onMultiplierSelect(selected_multiplier);
            closePopover();
        },
        [onMultiplierSelect, closePopover]
    );

    return (
        <div className='multiplier-popover__content'>
            {multiplier_range_list.map(mult => {
                const mult_text = mult.text;
                const mult_value = Number(mult_text.slice(1));
                const isSelected = mult_value === multiplier;

                return (
                    <button
                        key={mult_value}
                        type='button'
                        className={clsx('multiplier-popover__option', {
                            'multiplier-popover__option--selected': isSelected,
                        })}
                        onClick={() => handleMultiplierSelectAndClose(mult_value)}
                    >
                        {mult_text}
                    </button>
                );
            })}
        </div>
    );
};

const MultiplierDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { multiplier, multiplier_range_list, is_market_closed, onChange } = useTraderStore();

    const handleMultiplierSelect = useCallback(
        (selected_multiplier: number) => {
            onChange({ target: { name: 'multiplier', value: selected_multiplier } });
        },
        [onChange]
    );

    return (
        <TradeParameterPopover
            popoverWidth={178}
            label={<Localize i18n_default_text='Multiplier' key={`multiplier${is_minimized ? '-minimized' : ''}`} />}
            value={`x${multiplier}`}
            is_minimized={is_minimized}
            disabled={is_market_closed}
            popover_classname='multiplier-popover'
        >
            <MultiplierContent
                multiplier_range_list={multiplier_range_list}
                multiplier={multiplier}
                onMultiplierSelect={handleMultiplierSelect}
            />
        </TradeParameterPopover>
    );
});

export default MultiplierDesktop;
