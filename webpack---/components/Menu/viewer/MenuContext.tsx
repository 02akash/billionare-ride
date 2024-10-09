import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import type { IMenuProps, MenuItemWithChildren } from '../Menu.types';

const EMPTY_ANCHOR_URL = '#';

export type MenuContextValue = Pick<
  IMenuProps,
  'partToPreviewStateMap' | 'currentUrl' | 'activeAnchor'
> & {
  items: Array<MenuItemWithChildren>;
};

export const MenuContext = createContext<MenuContextValue>({
  items: [],
  currentUrl: EMPTY_ANCHOR_URL,
});

export const useMenuContext = () => useContext(MenuContext);

export const MenuContextProvider: React.FC<
  PropsWithChildren<MenuContextValue>
> = ({ children, items, partToPreviewStateMap, currentUrl, activeAnchor }) => {
  const contextValue = useMemo<MenuContextValue>(
    () => ({
      items,
      partToPreviewStateMap,
      currentUrl,
      activeAnchor,
    }),
    [items, partToPreviewStateMap, currentUrl, activeAnchor],
  );

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
};
