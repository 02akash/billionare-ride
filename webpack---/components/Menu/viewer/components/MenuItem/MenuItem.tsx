import React, { useEffect, useRef, useState, useMemo } from 'react';
import classNames from 'clsx';
import Link from '@wix/thunderbolt-elements/components/Link';
import { formatClassNames } from '@wix/editor-elements-common-utils';
import type { IMenuItemProps } from '../../../Menu.types';
import { MenuItemContext } from '../../../../../common/menu/MenuItemContext';
import { createEventListeners, createSDKAction } from './utils';
import { showDropdown } from './showDropdown';
import classes from './style/MenuItem.scss';
import { testIds } from '../../constants';
import { isCurrentItem } from '../../../../../common/menu/getCurrentMenuItem';
import menuSemanticClassNames from '../../../Menu.semanticClassNames';
import shmSemanticClassNames from '../../../../StylableHorizontalMenu/StylableHorizontalMenu.semanticClassNames';
import DropdownIcon from '../../assets/dropdownIcon.svg';
import { VirtualDropdown } from '../VirtualDropdown';

const itemWrapperClassName = classNames(
  classes.itemWrapper,
  formatClassNames(shmSemanticClassNames.menuItemWrapper),
);

const itemLabelClassName = classNames(
  classes.label,
  formatClassNames(shmSemanticClassNames.menuItemLabel),
  formatClassNames(menuSemanticClassNames.itemLabel),
);

export const MenuItem = (props: IMenuItemProps) => {
  const {
    item,
    currentItem,
    onItemClick,
    onItemDblClick,
    onItemMouseIn,
    onItemMouseOut,
    previewState,
    translations,
  } = props;
  const { label, link, children, forceHovered = false } = item;
  const [isHovered, setIsHovered] = useState(forceHovered);
  const eventListeners = useMemo(() => createEventListeners(setIsHovered), []);
  const itemsCount = item.items?.length ?? 0;
  const chevronButtonRef = useRef<HTMLButtonElement>(null);

  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!isHovered || !itemRef.current) {
      return;
    }
    return showDropdown(itemRef.current);
  }, [isHovered]);

  useEffect(() => {
    setIsHovered(!!forceHovered);
  }, [forceHovered]);

  const isCurrentPage = isCurrentItem(item, currentItem);

  const handleEscKeyDown = () => {
    chevronButtonRef.current?.focus();

    setIsHovered(false);
  };

  const hasDropdownMenu = children || itemsCount > 0;

  return (
    <li
      className={itemWrapperClassName}
      ref={itemRef}
      {...eventListeners}
      data-testid={testIds.menuItem}
      data-item-depth="0" // For scrolling, to know how much items on depth=0
    >
      <div
        className={classNames(
          classes.labelContainer,
          isCurrentPage ? classes.selected : '',
          hasDropdownMenu &&
            formatClassNames(shmSemanticClassNames.subMenuTitle),
          formatClassNames(menuSemanticClassNames.item),
        )}
        data-preview={previewState}
        data-testid={testIds.itemLabel}
      >
        <Link
          {...link}
          className={itemLabelClassName}
          activateByKey="Enter"
          onClick={createSDKAction(item, isCurrentPage, onItemClick)}
          onMouseEnter={createSDKAction(item, isCurrentPage, onItemMouseIn)}
          onMouseLeave={createSDKAction(item, isCurrentPage, onItemMouseOut)}
          onDoubleClick={createSDKAction(item, isCurrentPage, onItemDblClick)}
          {...(isCurrentPage && { ariaCurrent: 'page' })}
        >
          {label}
        </Link>

        {item.children && (
          <button
            aria-label={translations.dropdownButtonAriaLabel}
            ref={chevronButtonRef}
            className={classes.dropdownToggleButton}
            onClick={() => setIsHovered(currentHovered => !currentHovered)}
            aria-expanded={isHovered}
            aria-haspopup={true}
          >
            <DropdownIcon
              className={formatClassNames(menuSemanticClassNames.itemIcon)}
            />
          </button>
        )}
      </div>

      {hasDropdownMenu && (
        <MenuItemContext.Provider
          value={{ onEscKeyDown: handleEscKeyDown, item }}
        >
          {children ?? <VirtualDropdown item={item} />}
        </MenuItemContext.Provider>
      )}
    </li>
  );
};
