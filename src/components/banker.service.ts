import * as redis from './../redis.mock';

const redisClient = redis.createClient();


export class BankAccount {
    constructor(private _value: number, public readonly id: string) { }

    public set value(amount: number) {
        if (amount > 0) {
            this._value = amount;
        }
    }

    public get value(): number {
        return this._value;
    }
}

class Banker {
    private isSomethingChanged = false;
    constructor(private accounts: BankAccount[] = []) {
    }

    public async throttleSave(timeout = 60*1000) {
        while (true) {
            if (this.isSomethingChanged) {
                const timeoutPromise = new Promise((resolve, reject) => {
                    setTimeout(() => { resolve(); }, timeout);
                });

                await Promise.all([timeoutPromise, this.saveAccountsValue(this.accounts)]);
                this.isSomethingChanged = false;
            }
        }
    }

    private async saveAccountsValue(accounts: BankAccount[]): Promise<boolean> {
        this.isSomethingChanged = true;
        const accountsState = accounts.map(account => ({ key: account.id, value: account.value }));
        return redisClient.mset(accountsState);
    }

    addAccount(bankAccount: BankAccount) {
        this.accounts.push(bankAccount);
    }

    removeAccount(accountId: string) {
        this.accounts = this.accounts.filter(account => account.id === accountId);
    }

    getAccount(accountId: string) {
        return this.accounts[accountId];
    }
}

export const Bank = new Banker();