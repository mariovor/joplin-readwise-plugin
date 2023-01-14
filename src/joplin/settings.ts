import joplin from 'api';
import {SettingItemType} from "../../api/types";

const PLUGIN_SETTINGS_SECTION_NAME = 'readwise';
const PLUGIN_SETTINGS_TOKEN_NAME = 'readwise-token'
const PLUGIN_SETTINGS_LAST_UPDATE_NAME = 'readwise-last-update'
const PLUGIN_SETTINGS_CREATED_NOTES_NAME = 'readwise-created-notes'

const DEFAULT_LAST_UPDATE_TIME = new Date(1970, 1, 1).toISOString();

/**
 * Register the settings of the Plugin.
 */
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
    settings[PLUGIN_SETTINGS_LAST_UPDATE_NAME] = {
        value: DEFAULT_LAST_UPDATE_TIME,
        type: SettingItemType.String,
        section: PLUGIN_SETTINGS_SECTION_NAME,
        public: true,
        label: 'Last Update Time (do not modify manually)',
    }
    settings[PLUGIN_SETTINGS_CREATED_NOTES_NAME] = {
        value: '{}',
        type: SettingItemType.String,
        section: PLUGIN_SETTINGS_SECTION_NAME,
        public: true,
        label: 'Created notes (do not modify manually)',
    }

    await joplin.settings.registerSettings(settings)
}

/**
 * The readwise token from the settings
 */
export async function getToken() {
    return await joplin.settings.value(PLUGIN_SETTINGS_TOKEN_NAME)
}

/**
 * Get a map of readwise item ids -> note id.
 * This map is used to find notes based on the id from readwise.
 */
export async function getCreatedNotesMap(): Promise<Map<string, string>> {
    const jsonString = await joplin.settings.value(PLUGIN_SETTINGS_CREATED_NOTES_NAME)
    const json = JSON.parse(jsonString)
    return new Map(Object.entries(json))


}

/**
 * Convert a map<string, string> to a JSON string.
 * @param map
 */
export function convertMapToJSONString(map: Map<string, string>) {
    let jsonObject = {}
    for (let [key, value] of map) {
        jsonObject[key] = value
    }
    const jsonString = JSON.stringify(jsonObject)
    return jsonString;
}

/**
 * Store a map of readwise item ids -> note id.
 * This map is used to find notes based on the id from readwise.
 * @param map map of readwise item ids -> note id
 */
export async function setCreatedNotesMap(map: Map<string, string>) {
    const jsonString = convertMapToJSONString(map);
    await joplin.settings.setValue(PLUGIN_SETTINGS_CREATED_NOTES_NAME, jsonString)
}

/**
 * Reset the notes map to an empty JSON string
 */
export async function clearNotesMap() {
    await joplin.settings.setValue(PLUGIN_SETTINGS_CREATED_NOTES_NAME, '{}')
}

/**
 * Reset the lastUpdateTime to the default value.
 */
export async function clearLastUpdateTime() {
    await joplin.settings.setValue(PLUGIN_SETTINGS_LAST_UPDATE_NAME, DEFAULT_LAST_UPDATE_TIME)
}

/**
 * Set the lastUpdateTime to now.
 */
export async function setLastUpdateTimeToNow(){
    await joplin.settings.setValue(PLUGIN_SETTINGS_LAST_UPDATE_NAME, new Date().toISOString())
}

/**
 * Get the lastUpdateTime.
 */
export async function getLastUpdateTime(): Promise<String> {
    return  await joplin.settings.value(PLUGIN_SETTINGS_LAST_UPDATE_NAME)
}

/**
 * Reset all internal state of the plugin to start with a clean slate.
 */
export async function resetInternalState() {
    console.log('Reset internal mapping')
    await clearNotesMap()
    console.log('Reset last update time')
    await clearLastUpdateTime()
}
