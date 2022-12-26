import joplin from 'api';
import {SettingItemType} from "../../api/types";

const PLUGIN_SETTINGS_SECTION_NAME = 'readwise';
const PLUGIN_SETTINGS_TOKEN_NAME = 'readwise-token'

export async function registerSettings() {
    await joplin.settings.registerSection(PLUGIN_SETTINGS_SECTION_NAME, {
        label: 'Readwise-Sync',
    });
    let settings = {}
    settings[PLUGIN_SETTINGS_TOKEN_NAME] = {
        value: '',
        type: SettingItemType.String,
        section: PLUGIN_SETTINGS_SECTION_NAME,
        public: true,
        label: 'Authentication Token',
    }

    await joplin.settings.registerSettings(settings)
}

export async function getToken() {
    return await joplin.settings.value(PLUGIN_SETTINGS_TOKEN_NAME)
}
