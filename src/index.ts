import joplin from 'api';
import {createNotes} from "./interactWithJoplin";
import {getHighlights} from "./interactWithReadwise";
import {getToken, registerSettings} from "./joplin/settings";


joplin.plugins.register({

    onStart: async function () {
        await registerSettings();
        const token = await getToken()
        if (token) {
            const highlights = getHighlights()
            await createNotes(highlights)
        } else {
            throw Error('No token set!')
        }
    },
});
