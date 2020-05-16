import * as express from 'express';

import {router} from './components/banker.routes';

const app = express();

app.use(router);

app.listen(3000, () => {
    console.log("Server started..");
});
