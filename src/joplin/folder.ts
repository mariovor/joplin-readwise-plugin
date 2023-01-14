import joplin from "../../api";
import {clearLastUpdateTime, clearNotesMap} from "./settings";

const PLUGIN_FOLDER_NAME = 'Readwise';

async function getFolderIfExists() {
    let folders = await joplin.data.get(['folders']);
    return folders.items.filter((item) => {
        return item.title == PLUGIN_FOLDER_NAME
    });
}

async function createPluginFolder() {
    let newFolder = await joplin.data.post(['folders'], null, {title: PLUGIN_FOLDER_NAME});
    return newFolder.id;
}

async function resetInternalState() {
    console.log('Reset internal mapping')
    await clearNotesMap()
    console.log('Reset last update time')
    await clearLastUpdateTime()
}

/**
 * Get the if of the plugin folder. If it does not exist, create a folder.
 */
export async function createOrGetPluginFolder(): Promise<string> {
    let folderId: string = null;
    let foundFolder = await getFolderIfExists();

    if (foundFolder.length == 0) {
        console.log('Did not find plugin folder, creating...')
        folderId = await createPluginFolder();
        await resetInternalState();
    } else if (foundFolder.length == 1) {
        let folderId = foundFolder[0].id;
        console.log(`Found Plugin folder, the id is ${folderId}`)
    } else throw Error('Error getting plugin folder')

    return folderId
}
