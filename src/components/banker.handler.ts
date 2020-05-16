import { Bank, BankAccount } from "./banker.service";
import * as redis from './../redis.mock';

const redisClient = redis.createClient();

export class BankHandler {
    constructor(private bank: typeof Bank) { }

    public async throttleSave(timeout = 60 * 1000) {
        while (true) {
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
        const allAccountsBudget: number[] = await redisClient.mget(allAccountKeys);
        const allAccounts: BankAccount[] = allAccountKeys.map((accountId, i) => new BankAccount(accountId, allAccountsBudget[i]));
        return allAccounts;
    }
}