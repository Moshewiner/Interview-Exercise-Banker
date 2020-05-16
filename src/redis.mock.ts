import * as micromatch from 'micromatch';

class RedisClient {
    private data = {};
    public async keys(pattern: string): Promise<string[]> {
        const allKeys: string[] = Object.keys(this.data);
        return micromatch(allKeys, pattern);
    }
    public async mget(keys: string[]){
        return keys.map(key => this.data[key] || null);
    }
    public async set(key: string, value: any): Promise<boolean> {
        try {
            this.data[key] = value;
            return true;
        }
        catch {
            return false;
        }
    }
    public async get(key: string): Promise<any> {

        return this.data[key] || null;
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