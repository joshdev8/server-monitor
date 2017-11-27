export class Computer {
    constructor(public model: string,
        public speed: string,
        public times: any[],
        public hostname: string,
        public platform: string,
        public architecture: string,
        public type: string,
        public release: string,
        public uptime: string,
        public loadavg: any[],
        public networkinterfaces: any
    ) { }
}