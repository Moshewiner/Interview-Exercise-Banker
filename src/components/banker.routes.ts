import { router } from '../routes';
import { Bank } from './banker.service';

router.post('/withdraw', async (req, res, next) => {
    try {
        let { accountId, amount } = req.body || {};
        const account = await Bank.getAccount(accountId);
        account.value -= amount;
        res.status(200).send({ Success: true });
    }
    catch (e) {
        res.status(500).send(e);
    }
});

export { router };