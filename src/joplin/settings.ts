import joplin from 'api';
import {SettingItemType} from "../../api/types";

const PLUGIN_SETTINGS_SECTION_NAME = 'readwise';
const PLUGIN_SETTINGS_TOKEN_NAME = 'readwise-token'
const PLUGIN_SETTINGS_LAST_UPDATE_NAME = 'readwise-last-update'
const PLUGIN_SETTINGS_CREATED_NOTES_NAME = 'readwise-created-notes'

const DEFAULT_LAST_UPDATE_TIME = new Date(1970, 1, 1).toISOString();

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

export async function getToken() {
    return await joplin.settings.value(PLUGIN_SETTINGS_TOKEN_NAME)
}

export async function getCreatedNotesMap(): Promise<Map<string, string>> {
    const jsonString = await joplin.settings.value(PLUGIN_SETTINGS_CREATED_NOTES_NAME)
    console.log('Reading')
    console.log(jsonString)
    const json = JSON.parse(jsonString)
    return new Map(Object.entries(json))


}

export function convertMapToJSONString(map: Map<string, string>) {
    let jsonObject = {}
    for (let [key, value] of map) {
        jsonObject[key] = value
    }
    const jsonString = JSON.stringify(jsonObject)
    console.log('Saving...')
    console.log(jsonString)
    return jsonString;
}

export async function setCreatedNotesMap(map: Map<string, string>) {
    const jsonString = convertMapToJSONString(map);
    await joplin.settings.setValue(PLUGIN_SETTINGS_CREATED_NOTES_NAME, jsonString)
}

export async function clearNotesMap() {
    await joplin.settings.setValue(PLUGIN_SETTINGS_CREATED_NOTES_NAME, '{}')
}

export async function clearLastUpdateTime() {
    await joplin.settings.setValue(PLUGIN_SETTINGS_LAST_UPDATE_NAME, DEFAULT_LAST_UPDATE_TIME)
}

export async function setLastUpdateTimeToNow(){
    await joplin.settings.setValue(PLUGIN_SETTINGS_LAST_UPDATE_NAME, new Date().toISOString())
}

export async function getLastUpdateTime(): Promise<String> {
    return  await joplin.settings.value(PLUGIN_SETTINGS_LAST_UPDATE_NAME)
}
