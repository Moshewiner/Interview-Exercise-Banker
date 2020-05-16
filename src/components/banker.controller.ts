import { BankAccount } from './banker.service';
import {Bank} from './banker.service';


export async function tryWithdraw(accountId: string, amount: number, bidId: string): Promise<boolean> {
    const account: BankAccount = Bank.getAccount(accountId);

    return account.trySetValue(await account.getValue() - amount);
}