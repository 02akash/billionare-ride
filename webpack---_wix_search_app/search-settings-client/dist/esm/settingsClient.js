import {
    merge
} from 'lodash';
import {
    defaultCategoryList
} from './categoryList';
const BASE_API_URL = '/_api/app-settings-service';
export const API_URL_SETTINGS_INSTANCES = `${BASE_API_URL}/v1/settings/instances`;
export const defaultAppSettings = {
    categoryList: defaultCategoryList,
    productImageResizeMode: "fit" /* ImageResizeMode.Fit */ ,
    isProductPriceVisible: true,
    isSeoHiddenIncluded: false,
};
export const createSettingsClient = ({
    httpClient,
}) => {
    const getDefault = () => defaultAppSettings;
    const get = async (state) => {
        try {
            const {
                data
            } = await httpClient.get(API_URL_SETTINGS_INSTANCES, {
                params: {
                    state,
                    host: 'VIEWER',
                },
            });
            return merge({}, getDefault(), data.settings);
        } catch (e) {
            return getDefault();
        }
    };
    const set = async (key, value) => {
        await httpClient.patch(API_URL_SETTINGS_INSTANCES, {
            settings: {
                [key]: value
            },
            host: 'VIEWER',
            states: ['SAVED'],
        });
    };
    return {
        getSaved: () => get('SAVED'),
        getPublished: () => get('PUBLISHED'),
        getDefault: async () => getDefault(),
        set,
    };
};
//# sourceMappingURL=settingsClient.js.map