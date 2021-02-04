import {useEffect, useState} from 'react';

import {SchemaNode} from '../types';

export function useNode(node: SchemaNode) {
  if (!node) {
    throw new Error('no Node provided in useNode hook');
  }

  const [state, changeState] = useState({
    errors: [] as string[],
    onChange,
    validate,
    removeListItem,
    addListItem,
    refreshListItems,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshListItems, [node.value]);

  function onChange(value: any) {
    changeState({
      ...state,
      errors: node.onChange(value),
    });
  }

  function validate() {
    changeState({
      ...state,
      errors: node.validate(),
    });
  }

  function refreshListItems() {
    if (!node.isList || !Array.isArray(node?.value)) return;
    node.value.forEach((child: SchemaNode, newIndex: number) => {
      child.path = [node.path, newIndex].join('.');
      child.deleteSelf = () => removeListItem(newIndex);
    });
    changeState({
      ...state,
      errors: node.validate(),
    });
  }

  function addListItem() {
    node.addListItem();
    refreshListItems();
  }

  function removeListItem(index: number) {
    node.removeListItem(index);
    refreshListItems();
  }

  return state;
}
