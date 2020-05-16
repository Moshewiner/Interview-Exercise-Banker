import * as express from 'express';
import {router} from './components/banker.routes';
import {config} from './config';
import {Bank} from './components/banker.service';

const createApp = async () => {
    const app = express();
    app.use(router);
    
    app.listen(3000, () => {
        console.log("Server started..");
    });

    Bank.throttleSave(config.timeout);
}

createApp();
