import React, { useCallback } from 'react';
import {
  ClassStateFixtureState,
  FixtureElementId,
  FixtureId,
  InputsFixtureState,
  PropsFixtureState,
} from 'react-cosmos-core';
import { PluginContext, createPlugin } from 'react-plugin';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  hasFsValues,
  updateElementExpansion,
} from '../../components/ValueInputTree/index.js';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { ControlPanelRowSlotProps } from '../../slots/ControlPanelRowSlot.js';
import { GetFixtureState } from '../RendererCore/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { BlankState } from './BlankState.js';
import { PropsPanel } from './PropsPanel/index.js';
import {
  PROPS_TREE_EXPANSION_STORAGE_KEY,
  SetPropsFixtureState,
} from './shared.js';
import { PropsPanelSpec } from './spec.js';

type PropsPanelContext = PluginContext<PropsPanelSpec>;

const { namedPlug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel',
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'props',
  ({ pluginContext, slotProps }) => {
    const { fixtureId, getFixtureState, setFixtureState } = slotProps;
    const { fixtureExpansion, onElementExpansionChange } = useFixtureExpansion(
      pluginContext,
      fixtureId
    );

    const fixtureState = getFixtureState<PropsFixtureState>('props');
    const onFixtureStateChange = useCallback<SetPropsFixtureState>(
      change => setFixtureState<PropsFixtureState>('props', change),
      [setFixtureState]
    );

    return (
      <PropsPanel
        fixtureState={fixtureState}
        fixtureExpansion={fixtureExpansion}
        onFixtureStateChange={onFixtureStateChange}
        onElementExpansionChange={onElementExpansionChange}
      />
    );
  }
);

// WARNING: This plug has to be aware of all input categories and only show up
// when none is available
namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'blankState',
  ({ slotProps }) => {
    const { getFixtureState } = slotProps;
    return shouldShowBlankState(getFixtureState) ? <BlankState /> : null;
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();

const DEFAULT_TREE_EXPANSION = {};

function useFixtureExpansion(context: PropsPanelContext, fixtureId: FixtureId) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');

  const propsExpansion =
    storage.getItem<FixtureExpansionGroup>(PROPS_TREE_EXPANSION_STORAGE_KEY) ||
    DEFAULT_TREE_EXPANSION;
  const fixtureExpansion = getFixtureExpansion(propsExpansion, fixtureId);

  const onElementExpansionChange = React.useCallback(
    (elementId: FixtureElementId, treeExpansion: TreeExpansion) => {
      storage.setItem(
        PROPS_TREE_EXPANSION_STORAGE_KEY,
        updateElementExpansion(
          propsExpansion,
          fixtureId,
          elementId,
          treeExpansion
        )
      );
    },
    [storage, propsExpansion, fixtureId]
  );

  return {
    fixtureExpansion,
    onElementExpansionChange,
  };
}

function shouldShowBlankState(getFixtureState: GetFixtureState) {
  const props = getFixtureState<PropsFixtureState>('props');
  const hasProps = props && props.some(hasFsValues);
  if (hasProps) return false;

  const classState = getFixtureState<ClassStateFixtureState>('classState');
  const hasClassState = classState && classState.some(hasFsValues);
  if (hasClassState) return false;

  const inputs = getFixtureState<InputsFixtureState>('inputs');
  const hasInputs = inputs && Object.keys(inputs).length > 0;
  if (hasInputs) return false;

  return true;
}
