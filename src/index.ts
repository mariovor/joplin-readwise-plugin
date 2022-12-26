import joplin from 'api';
import {createNotes} from "./interactWithJoplin";
import {getHighlights} from "./interactWithReadwise";


joplin.plugins.register({

    onStart: async function () {
        const highlights = getHighlights()
        await createNotes(highlights)
    },

});
