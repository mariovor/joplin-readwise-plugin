import {HighlightExportResult} from "../interactWithReadwise";
import joplin from "../../api";
import {createOrGetPluginFolder} from "./folder";

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