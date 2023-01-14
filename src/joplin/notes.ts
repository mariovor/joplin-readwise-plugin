import {ReadwiseItem} from "../interactWithReadwise";
import joplin from "../../api";
import {resetPluginAndCreateFolderOrGetPluginFolder} from "./folder";
import {getCreatedNotesMap, setCreatedNotesMap} from "./settings";

/**
 * Get the note id for a given readwiseId.
 * @param readwise_id The id of a readwise item
 */
async function getNoteId(readwise_id: number): Promise<string> {
    let store = await getCreatedNotesMap();
    return store.get(String(readwise_id))
}

/**
 * Create notes based on the passed readwiseItems.
 * @param readwiseItems
 */
export async function createNotes(readwiseItems: ReadwiseItem[]) {
    const pluginFolderId = await resetPluginAndCreateFolderOrGetPluginFolder();
    for (let readwiseItem of readwiseItems) {
        const body = createNoteBody(readwiseItem)
        const noteId = await getNoteId(readwiseItem.user_book_id)
        if (noteId) {
            console.log(`Update note ${noteId}  with title "${readwiseItem.title}"`)
            await joplin.data.put(['notes', noteId], null, {body: body});
        } else {
            console.log(`Create note with title "${readwiseItem.title}"`)
            const newNote = await joplin.data.post(['notes'], null, {body: body, title: readwiseItem.title, parent_id: pluginFolderId});
            const store = await getCreatedNotesMap()
            await setCreatedNotesMap(store.set(String(readwiseItem.user_book_id), newNote.id))
        }
    }
}

/**
 * Create the body for a note with the content of the given readwise highlights.
 * @param readwiseItem One readwiseItem containing highlights
 */
function createHighlightsBody(readwiseItem: ReadwiseItem): string {
    let highlightBody = '';
    for (let highlight of readwiseItem.highlights) {
        highlightBody = highlightBody + `${highlight.text}\n\n`
    }
    return highlightBody
}

/**
 * Create the body of a Joplin note. Will contain metadata of the readwise item and the highlights.
 * @param readwiseItem
 */
function createNoteBody(readwiseItem: ReadwiseItem) {

    const highlights = createHighlightsBody(readwiseItem)


    return `# ${readwiseItem.title}
    
 Author: ${readwiseItem.author}
    
 Link: [Link](${readwiseItem.source_url})
    
 ${highlights}
 `
}
