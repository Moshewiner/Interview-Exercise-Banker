class RedisClient {
    private data = {};

    public async set(name: string, value: any): Promise<boolean> {
        try {
            this.data[name] = value;
            return true;
        }
        catch {
            return false;
        }
    }
    public async get(name: string): Promise<any> {

        return this.data[name] || null;
    }

    public async mset(args: { key: string, value: any }[]): Promise<boolean> {
        try {
            const totalArgs = args.reduce((total, arg) => {
                total[arg.key] = arg.value;
                return total;
            }, {});
            this.data = { ...this.data, ...totalArgs };
            return true;
        } catch {
            return false;
        }
    }
}

export function createClient() {
    return new RedisClient();
}