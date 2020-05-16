import * as express from 'express';
import {router} from './components/banker.routes';
import {config} from './config';
import { Bank, BankAccount } from './components/banker.service';
import { BankHandler } from './components/banker.handler';
import { DiscoveryService } from './discovery-service.mock';

const createApp = async () => {
    const app = express();
    app.use(router);
    
    app.listen(3000, () => {
        console.log("Server started..");
    });
}

const createBankHandler = () => {
    Bank.setAllAccounts([
        new BankAccount("Moshe", 6),
        new BankAccount("John", 6)
    ]);
    const bankHanler = new BankHandler(Bank, new DiscoveryService([{name: "Banker-Service", urls: ["uighjeuhg"]}]));
    bankHanler.throttleSave(config.timeout);
}

createBankHandler();
createApp();
