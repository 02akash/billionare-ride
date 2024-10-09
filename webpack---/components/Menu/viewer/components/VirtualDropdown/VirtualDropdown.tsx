import React from 'react';
import type { MenuItemProps } from '@wix/editor-elements-definitions';
import Submenu from '../../../../Submenu/viewer/Submenu';
import classes from './VirtualDropdown.scss';
import { DropdownWrapper } from '../DropdownWrapper/DropdownWrapper';
import { dropdownMenuSkinParams } from '../../../skinParams/dropdownMenuSkinParams';

type VirtualDropdownProps = {
  item: MenuItemProps;
};

const attachedDropdownMenuCssVariables = Object.fromEntries(
  Object.keys(dropdownMenuSkinParams).map(param => [`--${param}`, 'initial']),
);

export const VirtualDropdown = ({ item }: VirtualDropdownProps) => {
  return (
    <DropdownWrapper
      id={`${item.id}-dropdown`}
      className={classes.virtualDropdown}
    >
      <div style={attachedDropdownMenuCssVariables}>
        <Submenu id={`${item.id}-submenu`} />
      </div>
    </DropdownWrapper>
  );
};
