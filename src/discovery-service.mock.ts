export class DiscoveryService {
    constructor(private services: {name: string, urls: string[]}[]) {}

    public getServiceUrl(serviceName: string): string[] {
        return this.services[serviceName] && this.services[serviceName].urls;
    }
}