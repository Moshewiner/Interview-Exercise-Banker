export class BankAccount {
    constructor(public readonly id: string, private _value: number) { }

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
    constructor(private accounts: BankAccount[] = []) {
    }

    addAccount(bankAccount: BankAccount) {
        this.accounts.push(bankAccount);
    }

    removeAccount(accountId: string) {
        this.accounts = this.accounts.filter(account => account.id === accountId);
    }

    getAccount(accountId: string): BankAccount {
        if (this.accounts[accountId]) {
            return { ...this.accounts[accountId] };
        }
        return null;
    }

    getAllAccounts(): BankAccount[] {
        return [...this.accounts];
    }

    setAllAccounts(bankAccounts: BankAccount[]) {
        this.accounts = bankAccounts
    }
}

export const Bank = new Banker();
