import joplin from 'api';
import {createOrGetPluginFolder} from "./interactWithJoplin";


joplin.plugins.register({

    onStart: async function () {
        await createOrGetPluginFolder();
    },

});
