import React from 'react';
import { SelectControlFixtureState } from 'react-cosmos-core';
import {
  Label,
  ValueDataContainer,
  ValueInputContainer,
} from '../../components/ValueInputTree/ValueInput/shared.js';
import { Select } from '../../components/inputs/Select.js';
import { isGroupedOptions } from '../../shared/groupedOptions.js';
import { lightBlue } from '../../style/colors.js';

type Props = {
  name: string;
  control: SelectControlFixtureState;
  onChange: (name: string, select: SelectControlFixtureState) => unknown;
};

export function SelectValueInput({ name, control, onChange }: Props) {
  const { options, currentValue } = control;
  const id = `select-${name}`;
  return (
    <ValueInputContainer key={name}>
      <Label title={name} htmlFor={id}>
        {name}
      </Label>
      <ValueDataContainer>
        <Select
          id={id}
          options={createSelectOptions(options)}
          value={currentValue}
          color={lightBlue}
          height={24}
          padding={5}
          onChange={newValue =>
            onChange(name, {
              ...control,
              currentValue: newValue.value,
            })
          }
        />
      </ValueDataContainer>
    </ValueInputContainer>
  );
}

function createSelectOptions(options: SelectControlFixtureState['options']) {
  if (isGroupedOptions(options)) {
    return options.map(group => ({
      group: group.group,
      options: group.options.map(option => ({
        value: option,
        label: option,
      })),
    }));
  }

  return options.map(option => ({ value: option, label: option }));
}
