import { CategoryOptions } from '../../../../../types/core/facets';

const MAX_CATEGORIES_TO_DISPLAY = 10;

export const getVisibleCategories = (
  categories: CategoryOptions,
  selected: string[],
) => {
  const selectedUnknownCategories = selected
    .filter((categoryName) => !categories.some((x) => x.label === categoryName))
    .map((categoryName) => ({
      label: categoryName,
      count: 0,
    }))
    .slice(0, MAX_CATEGORIES_TO_DISPLAY);

  const selectedCategories = categories
    .filter((category) => selected.includes(category.label))
    .map((category) => category.label)
    .slice(0, MAX_CATEGORIES_TO_DISPLAY - selectedUnknownCategories.length);

  const notSelectedCategories = categories
    .filter((category) => !selectedCategories.includes(category.label))
    .map((category) => category.label)
    .slice(
      0,
      MAX_CATEGORIES_TO_DISPLAY -
        selectedUnknownCategories.length -
        selectedCategories.length,
    );

  return [
    ...categories.filter(
      (category) =>
        selectedCategories.includes(category.label) ||
        notSelectedCategories.includes(category.label),
    ),
    ...selectedUnknownCategories,
  ];
};
