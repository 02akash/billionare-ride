import type { IMenuItemSDKAction } from '@wix/editor-elements-corvid-utils';
import type { IMenuItemProps } from '../../../Menu.types';

export const createSDKAction = (
  item: IMenuItemProps['item'],
  selected: boolean,
  sdkAction?: IMenuItemSDKAction,
) =>
  sdkAction &&
  ((e: React.MouseEvent) => {
    sdkAction?.(e, {
      ...item,
      selected,
    });
  });

export const createEventListeners = (
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const showDropdownMenu = () => setIsHovered(true);
  const hideDropdownMenu = () => setIsHovered(false);

  return {
    onMouseEnter: showDropdownMenu,
    onMouseLeave: hideDropdownMenu,
  };
};
