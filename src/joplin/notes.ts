import {Article} from "../interactWithReadwise";
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

async function getNoteId(title: string, parent_id: string): Promise<string> {
    let store = await getCreatedNotesMap();
    return store.get(title)
}

/**
 * Create notes based on the passed highlights
 * @param highlights
 */
export async function createNotes(highlights: Article[]) {
    const pluginFolderId = await createOrGetPluginFolder();
    for (let highlight of highlights) {
        const body = createNoteBody(highlight)
        const noteId = await getNoteId(highlight.title, pluginFolderId)
        if (noteId) {
            console.log(`Update note ${noteId}  with title "${highlight.title}"`)
            await joplin.data.put(['notes', noteId], null, {body: body});
        } else {
            console.log(`Create note with title "${highlight.title}"`)
            await joplin.data.post(['notes'], null, {body: body, title: highlight.title, parent_id: pluginFolderId});
            const store = await getCreatedNotesMap()
            await setCreatedNotesMap(store.set(highlight.title, noteId))
        }
    }
}

function createHighlightsBody(article: Article): string {
    let highlightBody = '';
    for (let highlight of article.highlights) {
        highlightBody = highlightBody + `${highlight.text}\n\n`
    }
    return highlightBody
}

function createNoteBody(article: Article) {

    const highlights = createHighlightsBody(article)


    return `# ${article.title}
    
 Author: ${article.author}
    
 Link: [Link](${article.source_url})
    
 ${highlights}
 `
}