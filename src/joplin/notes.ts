import {ReadwiseItem} from "../interactWithReadwise";
import joplin from "../../api";
import {createOrGetPluginFolder} from "./folder";
import {getCreatedNotesMap, setCreatedNotesMap} from "./settings";

/**
 * Remove some special characters which makes problems while searching
 * @param title
 */
export function cleanTitle(title: string): string {
    return title.replace(/[^a-zA-Z ]/g, ' ')
}

async function getNoteId(id: number): Promise<string> {
    let store = await getCreatedNotesMap();
    return store.get(String(id))
}

/**
 * Create notes based on the passed readwiseItems
 * @param readwiseItems
 */
export async function createNotes(readwiseItems: ReadwiseItem[]) {
    const pluginFolderId = await createOrGetPluginFolder();
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

function createHighlightsBody(article: ReadwiseItem): string {
    let highlightBody = '';
    for (let highlight of article.highlights) {
        highlightBody = highlightBody + `${highlight.text}\n\n`
    }
    return highlightBody
}

function createNoteBody(article: ReadwiseItem) {

    const highlights = createHighlightsBody(article)


    return `# ${article.title}
    
 Author: ${article.author}
    
 Link: [Link](${article.source_url})
    
 ${highlights}
 `
}
