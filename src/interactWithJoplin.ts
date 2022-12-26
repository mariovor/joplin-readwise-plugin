import joplin from 'api';
import {HighlightExportResult} from "./interactWithReadwise";

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

/**
 * Get the if of the plugin folder. If it does not exist, create a folder.
 */
export async function createOrGetPluginFolder(): Promise<string> {
    let folderId: string = null;
    let foundFolder = await getFolderIfExists();

    if (foundFolder.length == 0) {
        console.log('Did not find plugin folder, creating...')
        folderId = await createPluginFolder();
    } else if (foundFolder.length == 1) {
        let folderId = foundFolder[0].id;
        console.log(`Found Plugin folder, tge id is ${folderId}`)
    } else throw Error('Error getting plugin folder')

    return folderId
}

/**
 * Create notes based on the passed highlights
 * @param highlights
 */
export async function createNotes(highlights: HighlightExportResult[]) {
    const pluginFolderId = await createOrGetPluginFolder();
    for (let highlight of highlights) {
        const body = createNoteBody(highlight)
        console.log(`Create note "${highlight.title}"`)
        await joplin.data.post(['notes'], null, {body: body, title: highlight.title, parent_id: pluginFolderId});
    }
}

function createNoteBody(highlight: HighlightExportResult) {
    return `# ${highlight.title}\n
    Author: ${highlight.author}
    `
}