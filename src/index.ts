import joplin from 'api';
import {getHighlights, verifyToken} from "./interactWithReadwise";
import {getToken, registerSettings} from "./joplin/settings";
import {createNotes} from "./joplin/notes";


joplin.plugins.register({

    onStart: async function () {
        await registerSettings();
        const token = await getToken()
        await verifyToken(token)
        if (token) {
            const highlights = getHighlights()
            await createNotes(highlights)
        } else {
            throw Error('No token set!')
        }
    },
});
