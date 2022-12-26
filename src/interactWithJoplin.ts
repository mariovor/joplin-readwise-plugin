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
        console.log(`Found Plugin folder, the id is ${folderId}`)
    } else throw Error('Error getting plugin folder')

    return folderId
}

async function getNote(title: string, parent_id: string): Promise<string> {
    let noteId = null
    const {_, items} = await joplin.data.get(['search'], {
        query: title,
        fields: 'id, parent_id'
    })
    if (items.length > 1) {
        throw Error(`Found more than one entry for title "${title}"`)
    } else if (items.length == 1) {
        const item = items[0];
        if (item.parentId != parent_id) {
            throw Error(`Found one note with title ${title}, but it is in wrong folder.`)
        }
        noteId = item.id
    }
    return noteId
}

/**
 * Create notes based on the passed highlights
 * @param highlights
 */
export async function createNotes(highlights: HighlightExportResult[]) {
    const pluginFolderId = await createOrGetPluginFolder();
    for (let highlight of highlights) {
        const body = createNoteBody(highlight)
        const noteId = await getNote(highlight.title, pluginFolderId)
        if (noteId) {
            console.log(`Update note ${noteId}  with title "${highlight.title}"`)
            await joplin.data.put(['notes', noteId], null, {body: body});
        } else {
            console.log(`Create note with title "${highlight.title}"`)
            await joplin.data.post(['notes'], null, {body: body, title: highlight.title, parent_id: pluginFolderId});
        }
    }
}

function createNoteBody(highlight: HighlightExportResult) {
    return `# ${highlight.title}\n
    Author: ${highlight.author}
    `
}