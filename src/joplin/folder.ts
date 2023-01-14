import joplin from "../../api";
import {resetInternalState} from "./settings";

const PLUGIN_FOLDER_NAME = 'Readwise';

/**
 * Search for the folder which keeps als Readwise notes.
 * Returns in case of success a list with one element containing the id of the folder.
 * If the folder does not exist, an empty list is returned.
 */
async function getFolderIfExists() {
    let folders = await joplin.data.get(['folders']);
    return folders.items.filter((item) => {
        return item.title == PLUGIN_FOLDER_NAME
    });
}

/**
 * Create the folder which will contain all Readwise notes.
 */
async function createPluginFolder() {
    let newFolder = await joplin.data.post(['folders'], null, {title: PLUGIN_FOLDER_NAME});
    return newFolder.id;
}

/**
 * Get the if of the plugin folder. If it does not exist, create a folder.
 * On creation of a new folder, the internal state is reset as well
 */
export async function resetPluginAndCreateFolderOrGetPluginFolder(): Promise<string> {
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
