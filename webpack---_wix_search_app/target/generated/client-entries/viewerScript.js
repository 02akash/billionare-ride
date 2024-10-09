import {
    createControllersWithDescriptors,
    initAppForPageWrapper
} from '@wix/yoshi-flow-editor/runtime/esm/viewerScript/wrapper.js';



import wrapController0 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/platform';

import controller0 from '/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/components/SearchBox/controller.ts';
import * as _controllerExport0 from '/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/components/SearchBox/controller.ts';
var controllerExport0 = _controllerExport0;



import wrapController1 from '@wix/yoshi-flow-editor-runtime/internal/viewerScript/ooi';

import controller1 from '/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/components/SearchResults/controller.ts';
import * as _controllerExport1 from '/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/components/SearchResults/controller.ts';
var controllerExport1 = _controllerExport1;



var importedApp = {};




var velocycleMobx = null;





var blocksControllerService = null;



var createHttpClient = null;



import {
    initI18n as initI18n
} from '@wix/yoshi-flow-editor/runtime/esm/i18next/init';



const multilingualDisabled = false;



var createExperiments = null;
var createWidgetExperiments = null;



var sentryConfig = {
    DSN: 'https://adde9fb4aab24af38bd56ff653d523cc@sentry.wixpress.com/1436',
    id: 'adde9fb4aab24af38bd56ff653d523cc',
    projectName: 'search-app',
    teamName: 'search',
    errorMonitor: true,
};

var experimentsConfig = {
    "scopes": ["site-search"],
    "centralized": true
};

var translationsConfig = {
    "icuEnabled": true,
    "defaultTranslationsPath": "/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/assets/locales/messages_en.json",
    "availableLanguages": ["ar", "bg", "ca", "cs", "da", "de", "el", "en", "es", "fi", "fr", "he", "hi", "hr", "hu", "id", "it", "ja", "ko", "lt", "lv", "ms", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "th", "tl", "tr", "uk", "vi", "zh"]
};

var defaultTranslations = {
    "searchResults.searchBox.input.placeHolderText": "search term…",
    "searchResults.searchBox.header.text": "Search Results",
    "appManager.actions.customizeSearchResults.label": "Customize Search Results",
    "appManager.actions.customizeDesign.label": "Customize Design",
    "appManager.actions.addSearchBox.label": "Add New Search Box",
    "searchResults.settings.modal.title": "Search Results",
    "main.menuLabel": "Main",
    "main.mainText": "Manage what your visitors can search and customize the way results are displayed.",
    "main.footerText1": "Missing search results?",
    "display.menuLabel": "Display",
    "settings.main.customizeSettings": "Manage Settings",
    "settings.main.missingResultsDescription": "Results can take up to 10 minutes to appear.",
    "settings.allTab.title": "‘All’ Results Tab",
    "settings.allTab.enable": "Enable ‘All’ tab",
    "settings.allTab.description": "Display an additional tab with all search results on your site.",
    "settings.allTab.alwaysFirst": "‘All’ tab appears first by default.",
    "settings.searchResults.title": "Search Results",
    "settings.searchResults.label": "‘Results Found’ message includes:",
    "settings.searchResults.numResultsAndSearchTerm": "Number of results & search term",
    "settings.searchResults.numResults": "Number of results",
    "settings.searchResults.searchTerm": "Search term",
    "settings.tabs.showOnSearch": "Show on Search",
    "settings.tabs.reorder": "Reorder",
    "settings.showOnSearch.description": "Choose pages to show in search results and edit what’s displayed.",
    "settings.resultsHidden.title": "Results are hidden",
    "settings.resultsHidden.description1": "You’ve hidden all search pages so visitors won’t see any search results.",
    "settings.resultsHidden.description2": "All site pages are hidden from search. Edit ‘Show on Search’ so site visitors can search for items on your site.",
    "settings.resultsHidden.gotoLink": "Go to Show on Search",
    "settings.menuLabel": "Settings",
    "settings.resultsLayout.title": "Results Layout",
    "settings.sectionTitle": "Search Results",
    "settings.tab.resultsFound.label": "Results Found",
    "settings.tab.resultsEmpty.label": "No Results",
    "settings.itemsPerPage.label": "Number of results per page",
    "settings.resultsMessageFormat.label": "“Results Found” message will include:",
    "settings.resultsMessageFormat.atLeastOneTooltip": "At least one item should be checked",
    "settings.resultsMessageFormat.withNumber.label": "Number of results",
    "settings.resultsMessageFormat.withQuery.label": "Search term",
    "settings.searchBar.sectionTitle": "Search Bar",
    "settings.searchBar.showSearchBar.label": "Show search bar in Results Page",
    "settings.searchBar.placeholderInput.label": "Placeholder text",
    "settings.searchBar.placeholderInput.placeholder": "Add text here...",
    "settings.searchBar.placeholderInput.defaultValue": "Search...",
    "settings.resultsEmptyMessage.label": "“No Results” message will include:",
    "settings.resultsEmptyMessage.withNumber.label": "Number of results",
    "settings.resultsEmptyMessage.withQuery.label": "Search term",
    "settings.design.button.section.label": "Buttons",
    "settings.design.addToCart.title": "Add To Cart Button",
    "settings.design.textFontAndColor": "Text font & color",
    "settings.design.backgroundColor": "Fill color & opacity",
    "settings.design.viewAll.title": "View All Button",
    "settings.advanced.title": "Advanced Settings",
    "settings.seo.toggle": "Show hidden pages (SEO)",
    "settings.seo.description": "When enabled, site visitors can search for pages that are hidden from search engines in SEO settings.",
    "layout.menuLabel": "Layout",
    "layout.resultsMenuAlignment.label": "How is the results menu aligned?",
    "layout.paginationAlignment.label": "How is the pagination bar aligned?",
    "layout.resizeOptions": "Resize options",
    "layout.resizeOptions.crop": "Crop",
    "layout.resizeOptions.fit": "Fit",
    "layout.menuLayout": "Menu Layout",
    "layout.imageLayout": "Image Layout",
    "layout.paginationLayout": "Pagination Layout",
    "design.menuLabel": "Design",
    "design.backButton.label": "Back",
    "design.fontPicker.label": "Font Picker",
    "design.searchBar.section.label": "Search Bar",
    "design.searchBar.backgroundColor.label": "Background opacity & color",
    "design.searchBar.borderWidth.label": "Border width",
    "design.searchBar.borderOpacityAndColor.label": "Border opacity & color",
    "design.searchBar.textFontAndColor.label": "Text font & color",
    "design.searchBar.iconOpacityAndColor.label": "Icon opacity & color",
    "design.resultsMenu.section.label": "Results Menu",
    "design.resultsMenu.textFontAndColor.label": "Text font & color",
    "design.resultsMenu.selectedTextColor.label": "Selected border color",
    "design.resultsMenu.borderOpacityAndColor.label": "Border opacity & color",
    "design.resultsMenu.selectedBorderColor.label": "Selected border color",
    "design.searchResults.section.label": "Search Results",
    "design.searchResults.titleFontAndColor.label": "Title font & color",
    "design.searchResults.descriptionFontAndColor.label": "Description font & color",
    "design.searchResults.resultsMessageFontAndColor.label": "Results Message font & color",
    "design.pagination.section.label": "Pagination",
    "design.pagination.textFontAndColor.label": "Text font & color",
    "design.pagination.selectedTextColor.label": "Selected text color",
    "design.highlight.section.label": "Text Highlight",
    "design.highlight.highlightColor.label": "Highlight color",
    "design.highlight.background.label": "Highlight color",
    "design.highlight.font.label": "Font color & style",
    "design.highlight.font.bold": "Bold",
    "design.highlight.font.italic": "Italic",
    "design.highlight.font.underline": "Underline",
    "display.results.sectionTitle": "Customize Search Results",
    "display.contextMenu.customize": "Customize",
    "display.contextMenu.hide": "Hide",
    "display.contextMenu.show": "Show",
    "display.details.backButton": "Back",
    "display.details.tabLabelOverride.title": "Label ({documentType})",
    "display.details.toggle.label": "Change label text",
    "display.details.customLabel.placeholder": "Custom Label",
    "display.details.customLabel.emptyErrorMessage": "The label can’t be empty",
    "display.notification.description": "Customize what visitors can search for on your site.",
    "display.notification.allCategoriesHidden": "You’ve hidden all search categories so visitors won’t see any search results.",
    "settings.display.products.addToCart.title": "Add to Cart",
    "settings.display.products.addToCart.toggleLabel": "Show button",
    "settings.display.products.addToCart.buttonLabel": "Button text",
    "settings.display.products.addToCart.buttonText": "Add to Cart",
    "settings.display.products.addToCart.goToDesign": "To change the button's design, go to <lnk>Design > Buttons</lnk>",
    "settings.display.products.facets.title": "Filters",
    "settings.display.products.facets.toggleLabel": "Show product filters",
    "settings.display.products.facets.description": "Enable filters in your product search results page to help your users find what they're looking for.",
    "settings.display.products.details.title": "What's Displayed?",
    "settings.display.products.details.label": "What do you want to show?",
    "settings.display.products.details.price": "Product price",
    "settings.display.forums.facets.title": "Filters",
    "settings.display.forums.facets.toggleLabel": "Show forum filters",
    "settings.display.forums.facets.description": "Enable filters in your forum search results page to help site visitors find what they're looking for.",
    "resultsFoundMessage.withNumberAndQuery": "{number} {number, plural, one {item} other {items}} found for \"{query}\"",
    "resultsFoundMessage.withNumber": "{number} {number, plural, one {item} other {items}} found",
    "resultsFoundMessage.withQuery": "Results found for \"{query}\"",
    "resultsFoundMessage.demoQuery": "Search...",
    "resultsEmptyMessage.empty": "No results found",
    "resultsEmptyMessage.emptyTryNew": "No results found for \"{query}\". Try a new search.",
    "resultsEmptyMessage.withNumberAndQuery": "{number} {number, plural, one {item} other {items}} found for \"{query}\"",
    "resultsEmptyMessage.withNumber": "{number} {number, plural, one {item} other {items}} found",
    "resultsEmptyMessage.withQuery": "Results found for \"{query}\"",
    "facetsResultsFoundMessage.withNumberAndQuery": "{number} out of {totalCount} {totalCount, plural, one {item} other {items}} found for \"{query}\"",
    "facetsResultsFoundMessage.withNumber": "{number} out of {totalCount} {totalCount, plural, one {item} other {items}} found",
    "facetsResultsEmptyMessage.withNumberAndQuery": "0 out of {totalCount} {totalCount, plural, one {item} other {items}} found for \"{query}\"",
    "facetsResultsEmptyMessage.withNumber": "0 out of {totalCount} {totalCount, plural, one {item} other {items}} found",
    "noResultsFoundMessage.withQuery": "No results found for \"{query}\"",
    "searchResults.clearLabel": "Clear",
    "searchResults.demoContentNotificationText": "Go to your published site to see real search results.",
    "searchResults.allTabsHiddenNotification": "All search result pages are hidden. Go to Settings > Show on Search to show search results.",
    "searchResults.samples.label.viewAll": "View All",
    "searchResults.products.outOfStock": "Out of Stock",
    "searchResults.tabs.label.all": "All",
    "searchResults.tabs.label.all.withCount": "All ({number})",
    "searchResults.tabs.label.all.accessibilityLabel": "All: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.otherPages": "Other Pages",
    "searchResults.tabs.label.otherPages.withCount": "Other Pages ({number})",
    "searchResults.tabs.label.otherPages.accessibilityLabel": "Other Pages: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.products": "Products",
    "searchResults.tabs.label.products.withCount": "Products ({number})",
    "searchResults.tabs.label.products.accessibilityLabel": "Products: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.blogs": "Blog Posts",
    "searchResults.tabs.label.blogs.withCount": "Blog Posts ({number})",
    "searchResults.tabs.label.blogs.accessibilityLabel": "Blog Posts: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.forums": "Forum Posts",
    "searchResults.tabs.label.forums.withCount": "Forum Posts ({number})",
    "searchResults.tabs.label.forums.accessibilityLabel": "Forum Posts: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.forums.inCategory": "In {category}",
    "searchResults.tabs.label.forums.filter.category": "Category",
    "searchResults.tabs.label.forums.filter.type": "Type",
    "searchResults.tabs.label.forums.filter.allTypes": "All types",
    "searchResults.tabs.label.forums.filter.allCategories": "All categories",
    "searchResults.tabs.label.forums.filter.posts": "Posts",
    "searchResults.tabs.label.forums.filter.comments": "Comments",
    "searchResults.tabs.label.bookings": "Services",
    "searchResults.tabs.label.bookings.withCount": "Services ({number})",
    "searchResults.tabs.label.bookings.accessibilityLabel": "Services: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.events": "Events",
    "searchResults.tabs.label.events.withCount": "Events ({number})",
    "searchResults.tabs.label.events.accessibilityLabel": "Events: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.programs": "Programs",
    "searchResults.tabs.label.programs.withCount": "Programs ({number})",
    "searchResults.tabs.label.programs.accessibilityLabel": "Programs: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.label.proGallery": "Media",
    "searchResults.tabs.label.proGallery.withCount": "Media ({number})",
    "searchResults.tabs.label.proGallery.accessibilityLabel": "Media: {number} {number, plural, one {result} other {results}} found",
    "searchResults.tabs.menu.accessibilityLabel": "Search Results",
    "searchResults.sort.dropdown.label": "Sort By:",
    "searchResults.sort.options.default": "Best Match",
    "searchResults.list.events.eventTypeLabel.paid": "Tickets: {minPrice} - {maxPrice}",
    "searchResults.list.events.eventTypeLabel.paid.singlePrice": "Tickets: {minPrice}",
    "searchResults.list.forums.bestAnswer": "Best answer",
    "searchSuggestions.groupLinkText": "Show all",
    "searchSuggestions.searchAll": "Search All \"{query}\"",
    "mockedSearchResults.pages.1.title": "Greek Paradise",
    "mockedSearchResults.pages.1.description": "Welcome to Greek Paradise! We are a family-owned-and-operated restaurant that serves delicious Greek, Mediterranean and American dishes",
    "mockedSearchResults.pages.2.title": "Happy Children",
    "mockedSearchResults.pages.2.description": "Happy is a feeling of joy, pleasure, or good fortune — exactly how you'd feel if you learned that you won the lottery or got accepted into your number one choice of colleges. ... On its own, happy means an enjoyable or satisfied state of being.",
    "mockedSearchResults.pages.3.title": "Yellow Tea",
    "mockedSearchResults.pages.3.description": "Yellow tea is often placed in the same category with green tea due to its light oxidation. One of the primary aims of making yellow tea is to remove the characteristic grassy smell of green tea while preserving the associated health qualities of green tea.",
    "mockedSearchResults.pages.4.title": "Fruits Covered in Chocolate",
    "mockedSearchResults.pages.4.description": "Chocolate-covered fruits include blueberries, pomegranate, strawberries, oranges, dried apricots, and other candied fruits and citrus peels. dark chocolate, milk chocolate and white chocolate are used for decoration. Nuts, coconut, chocolate chips, sprinkles, and other toppings are sometimes added.",
    "mockedSearchResults.pages.5.title": "Natural Herbs",
    "mockedSearchResults.pages.5.description": "It’s easy to underestimate the power of plants to heal your body’s toughest ailments. Often, we go straight to over-the-counter medicines to treat our headaches, inflammation, and other syndromes. Many of us have been conditioned to depend on prescription drugs all of our lives. If you aren’t yet, it’s time to familiarize yourself with nature’s medicine: healing herbs.",
    "mockedSearchResults.products.1.title": "I'm a product",
    "mockedSearchResults.products.1.description": "I'm a product detail. I'm a great place to add more information about your product such as sizing, material, care and cleaning instructions. This is also a great space to write what makes this product special and how your customers can benefit from this item.",
    "mockedSearchResults.proGallery.1.title": "I'm an image title",
    "mockedSearchResults.proGallery.1.description": "Describe your image here.",
    "mockedSearchResults.blog.1.title": "Grow Your Blog Community",
    "mockedSearchResults.blog.1.description": "With Wix Blog, you’re not only sharing your voice with the world, you can also grow an active online community. That’s why the Wix blog comes with a built-in members area - so that readers can easily sign easily up to become members of your blog. What can members do? Members can follow each other, write and reply to comments and receive blog notifications. Each member gets their own personal profile page that they can customize. Tip: You can make any member of your blog a writer",
    "mockedSearchResults.blog.2.title": "Design a Stunning Blog",
    "mockedSearchResults.blog.2.description": "When it comes to design, the Wix blog has everything you need to create beautiful posts that will grab your reader's attention. Check out our essential design features. Choose from 8 stunning layouts Your Wix Blog comes with 8 beautiful layouts. From your blog's settings, choose the layout that’s right for you. For example, a tiled layout is popular for helping visitors discover more posts that interest them. Or, choose a classic single column layout that lets readers scroll",
    "mockedSearchResults.blog.3.title": "Now You Can Blog from Everywhere!",
    "mockedSearchResults.blog.3.description": "We’ve made it quick and convenient for you to manage your blog from anywhere. In this blog post we’ll share the ways you can post to your Wix Blog. Blogging from Your Wix Blog Dashboard On the dashboard, you have everything you need to manage your blog in one place. You can create new posts, set categories and more. To head to your Dashboard, open the Wix Editor and click on Blog > Posts. Blogging from Your Published Site Did you know that you can blog right from your publish",
    "mockedSearchResults.forum.1.title": "I'm a Forum Post",
    "mockedSearchResults.forum.1.description": "I'm a Forum Post description. Chocolate-covered fruits include blueberries, pomegranate, strawberries, oranges, dried apricots, and other candied fruits and citrus peels. dark chocolate, milk chocolate and white chocolate are used for decoration. Nuts, coconut, chocolate chips, sprinkles, and other toppings are sometimes added.",
    "mockedSearchResults.forum.2.title": "I'm a Forum Comment",
    "mockedSearchResults.forum.2.description": "I'm a Forum Comment description. It’s easy to underestimate the power of plants to heal your body’s toughest ailments. Often, we go straight to over-the-counter medicines to treat our headaches, inflammation, and other syndromes. Many of us have been conditioned to depend on prescription drugs all of our lives. If you aren’t yet, it’s time to familiarize yourself with nature’s medicine: healing herbs.",
    "mockedSearchResults.forum.3.title": "I'm a Forum Comment Reply",
    "mockedSearchResults.forum.3.description": "I'm a Forum Comment Reply description. Yellow tea is often placed in the same category with green tea due to its light oxidation. One of the primary aims of making yellow tea is to remove the characteristic grassy smell of green tea while preserving the associated health qualities of green tea.",
    "searchResults.sort.dropdownOptions.forum.lastActivityDate.desc": "Recent Activity",
    "searchResults.sort.dropdownOptions.forum.createdDate.desc": "Newest",
    "searchResults.sort.dropdownOptions.forum.totalComments.desc": "Most Comments",
    "searchResults.sort.dropdownOptions.forum.viewCount.desc": "Most Viewed",
    "searchResults.sort.dropdownOptions.forum.likeCount.desc": "Most Liked",
    "searchResults.sort.dropdownOptions.events1.startDate.desc": "Closest",
    "searchResults.sort.dropdownOptions.blog.publishDate.desc": "Newest",
    "searchResults.sort.dropdownOptions.products.price.desc": "Price (high to low)",
    "searchResults.sort.dropdownOptions.products.price.asc": "Price (low to high)",
    "searchResults.errorMessage.temporaryError": "This isn't working at the moment. Please contact Customer Care and give them this error code: {requestID}. It will help them identify the problem.",
    "searchResults.errorMessage.rateExceededError": "Looks like we're getting more traffic than we can handle. Please wait a few minutes and try again.",
    "searchResults.errorMessage.languageNotSupportedError": "Looks like there's a technical issue with the site's language that only the site administrator can fix. Please contact us.",
    "searchResults.errorMessage.noErrorCode": "Looks like there's a technical issue. Clear your cookies and try again. If it still doesn't work, please contact us.",
    "searchResults.errorMessage.invalidQueryError": "Your search term is too long. Add spaces or make it a bit shorter and try again.",
    "searchResults.errorMessage.anotherKnownError": "Looks like there's a technical issue. Clear your cookies and try again. If it still doesn't work, please contact us (Reason: {error_title}, error code: {error_code}).",
    "searchResults.facets.collectionTitle": "Category",
    "searchResults.facets.collections.showMore": "Show More ({hiddenCount})",
    "searchResults.facets.collections.showLess": "Show Less",
    "searchResults.facets.priceTitle": "Price",
    "searchResults.facets.mobile.title": "Filter by",
    "searchResults.facets.mobile.resetButton.label": "Reset",
    "searchResults.facets.mobile.okButton.label": "OK",
    "searchResults.facets.mobile.openFilterButton.label": "Filter",
    "searchResults.products.facets.noResultsFound.message": "No results found. Clear your filters and try a new search.",
    "searchResults.products.facets.noResultsFound.resetButton.label": "Clear Filters",
    "searchBox.suggestions.trending": "Trending {title}",
    "searchBox.gfpp.manageSearchResults": "Manage Search Results",
    "searchResults.pagination.previous": "Previous",
    "searchResults.pagination.next": "Next"
};

var fedopsConfig = null;

import {
    createVisitorBILogger as biLogger
} from '/home/builduser/work/bcf6b12146b6c823/packages/search-app/target/generated/bi/createBILogger.ts';

export const exports = importedApp.exports;

export const initAppForPage = initAppForPageWrapper({
    initAppForPage: importedApp.initAppForPage,
    sentryConfig: sentryConfig,
    experimentsConfig: experimentsConfig,
    inEditor: false,
    biLogger: biLogger,
    multilingualDisabled,
    projectName: "search-app",
    biConfig: null,
    appName: "Wix Site Search",
    appDefinitionId: "1484cb44-49cd-5b39-9681-75188ab429de",
    fedopsConfig: fedopsConfig,
    translationsConfig: translationsConfig,
    defaultTranslations: defaultTranslations,
    shouldUseEssentials: true,
    optionalDeps: {
        initI18n,
        createHttpClient,
        createExperiments,
    },
    localeDistPath: "assets/locales",
});

const _createControllers = createControllersWithDescriptors({
        initI18n,
        blocksControllerService,
        createHttpClient,
        createExperiments,
        velocycleMobx,
    }, [{
        method: controller0,
        wrap: wrapController0,
        exports: controllerExport0,
        widgetType: "PLATFORM_WIDGET",
        translationsConfig,
        multilingualDisabled,
        experimentsConfig: {
            "scopes": ["site-search"],
            "centralized": true
        },
        fedopsConfig: fedopsConfig,
        sentryConfig: sentryConfig,
        persistentAcrossPages: false,
        biLogger: biLogger,
        shouldUseEssentials: true,
        withErrorBoundary: false,
        biConfig: null,
        controllerFileName: "/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/components/SearchBox/controller.ts",
        appName: "Wix Site Search",
        appDefinitionId: "1484cb44-49cd-5b39-9681-75188ab429de",
        projectName: "search-app",
        componentName: "SearchBox",
        localeDistPath: "assets/locales",
        defaultTranslations: defaultTranslations,
        id: "SearchAppController"
    }, {
        method: controller1,
        wrap: wrapController1,
        exports: controllerExport1,
        widgetType: "WIDGET_OUT_OF_IFRAME",
        translationsConfig,
        multilingualDisabled,
        experimentsConfig: {
            "scopes": ["site-search"],
            "centralized": true
        },
        fedopsConfig: fedopsConfig,
        sentryConfig: sentryConfig,
        persistentAcrossPages: false,
        biLogger: biLogger,
        shouldUseEssentials: true,
        withErrorBoundary: false,
        biConfig: null,
        controllerFileName: "/home/builduser/work/bcf6b12146b6c823/packages/search-app/src/components/SearchResults/controller.ts",
        appName: "Wix Site Search",
        appDefinitionId: "1484cb44-49cd-5b39-9681-75188ab429de",
        projectName: "search-app",
        componentName: "SearchResults",
        localeDistPath: "assets/locales",
        defaultTranslations: defaultTranslations,
        id: "44c66af6-4d25-485a-ad9d-385f5460deef"
    }],
    true);

export const createControllers = _createControllers