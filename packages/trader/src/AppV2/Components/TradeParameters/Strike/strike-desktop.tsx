import { useCallback } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Localize } from '@deriv-com/translations';

import { TradeParameterPopover, useTradeParameterPopover } from 'AppV2/Components/TradeParameters/Shared';
import { useTraderStore } from 'Stores/useTraderStores';

import { TTradeParametersProps } from '../trade-parameters';

import './strike-desktop.scss';

const StrikeContent: React.FC<{
    barrier_choices: string[];
    barrier_1: string;
    onStrikeSelect: (value: string) => void;
}> = ({ barrier_choices, barrier_1, onStrikeSelect }) => {
    const { closePopover } = useTradeParameterPopover();

    const handleStrikeSelectAndClose = useCallback(
        (value: string) => {
            onStrikeSelect(value);
            closePopover();
        },
        [onStrikeSelect, closePopover]
    );

    return (
        <div className='strike-popover__content'>
            {barrier_choices.map((strike: string) => {
                const isSelected = barrier_1 === strike;

                return (
                    <button
                        key={strike}
                        type='button'
                        className={clsx('strike-popover__option', {
                            'strike-popover__option--selected': isSelected,
                        })}
                        onClick={() => handleStrikeSelectAndClose(strike)}
                    >
                        {strike}
                    </button>
                );
            })}
        </div>
    );
};

const StrikeDesktop = observer(({ is_minimized }: TTradeParametersProps) => {
    const { barrier_1, barrier_choices, is_market_closed, onChange } = useTraderStore();

    const handleStrikeSelect = useCallback(
        (value: string) => {
            onChange({ target: { name: 'barrier_1', value } });
        },
        [onChange]
    );

    return (
        <TradeParameterPopover
            popoverWidth={178}
            label={<Localize i18n_default_text='Strike price' key={`strike${is_minimized ? '-minimized' : ''}`} />}
            value={barrier_1}
            is_minimized={is_minimized}
            disabled={is_market_closed}
            popover_classname='strike-popover'
        >
            <StrikeContent
                barrier_choices={barrier_choices}
                barrier_1={barrier_1}
                onStrikeSelect={handleStrikeSelect}
            />
        </TradeParameterPopover>
    );
});

export default StrikeDesktop;
