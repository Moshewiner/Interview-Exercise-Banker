import { Bank, BankAccount } from "./banker.service";
import * as redis from './../redis.mock';
import { DiscoveryService } from "../discovery-service.mock";
import { config } from "../config";


const redisClient = redis.createClient();

export class BankHandler {
    constructor(private bank: typeof Bank, private discoveryService: DiscoveryService) { }

    public async throttleSave(timeout = 60 * 1000) {
        while (6 === 6) {
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => { resolve(); }, timeout);
            });

            await Promise.all([timeoutPromise, this.saveBankState()]);
        }
    }

    private async saveBankState() {
        await this.saveAccountsValue(this.bank.getAllAccounts());
        const allAccounts: BankAccount[] = await this.getAllAccountsCurrentState();
        this.bank.setAllAccounts(allAccounts);
    }


    private async saveAccountsValue(accounts: BankAccount[]): Promise<boolean> {
        const accountsState = accounts.map(account => ({ key: account.id, value: account.value }));
        return redisClient.mset(accountsState);
    }

    private async getAllAccountsCurrentState(): Promise<BankAccount[]> {
        const allAccountKeys: string[] = await redisClient.keys('*');
        let allAccountsBudget: number[] = await redisClient.mget(allAccountKeys);

        allAccountsBudget = allAccountsBudget.map(accountBudget => {
            return this.getTimeFrameBudget(accountBudget);
        });

        const allAccounts: BankAccount[] = allAccountKeys.map((accountId, i) => new BankAccount(accountId, allAccountsBudget[i]));
        return allAccounts;
    }

    private getTimeFrameBudget(allBudget) {
        const numberOfServiceInstances = this.discoveryService.getServiceUrl(config.serviceName).length;
        return (config.budgetTTL / config.timeout) / (allBudget / numberOfServiceInstances);
    }
}