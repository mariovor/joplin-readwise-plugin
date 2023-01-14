import joplin from 'api';
import {getReadwiseItem, verifyToken} from "./interactWithReadwise";
import {getToken, registerSettings} from "./joplin/settings";
import {createNotes} from "./joplin/notes";


joplin.plugins.register({

    onStart: async function () {
        await registerSettings();
        const token = await getToken()
        if (token) {
            await verifyToken(token)
            const readwiseItems = await getReadwiseItem(token)
            await createNotes(readwiseItems)
        } else {
            throw Error('No token set!')
        }
    },
});
