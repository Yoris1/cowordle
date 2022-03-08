import nedb = require('nedb');

export class StatsTracker {
	db:any; 
	cache: {[name: string]: number} = {};
	public room_creation(): void {
		this.increase_counter("rooms_created");
	}
	public wordle_start(): void {
		this.increase_counter("wordles_played");
	}
	public visit(): void {
		this.increase_counter("visit");
	}
	public get_count(name: string) {
		return this.cache[name];
	}
	public get_uptime() {
		return Date.now() - this.server_start_date.getTime();
	}

	private increase_counter(name: string): void {
		this.db.findOne({name: name}, (err, doc) => {
			if(!doc) {
				console.log(`First instance of ${name} recorded`);
				this.db.insert({name: name, count: 1});
				this.cache[name] = 1;
			} else {
				this.db.update({name: name}, {name: name, count: doc.count+1});
				this.cache[name] = doc.count+1;
			}
		});
	}
	private load_counters(name: string) {
		return new Promise((resolve, reject) => {
			this.db.findOne({name: name}, (err, doc) => {
				if(!doc) {
					this.cache[name] = 0;
				} else {
					this.cache[name] = doc.count+1;
				}
				resolve(null);
			});	
		})
	}
	private async build_cache() {
		await this.load_counters("rooms_created");
		await this.load_counters("visit");
		await this.load_counters("wordles_played");
		await this.load_counters("restarts");
	}
	private async load_stats() {
		await this.build_cache();
		console.log(`total server restarts: ${this.get_count("restarts")}`)
		console.log(`total wordles played: ${this.get_count("wordles_played")}`)
		console.log(`total visitors: ${this.get_count("visit")}`)
		console.log(`total rooms created: ${this.get_count("rooms_created")}`)
	}
	server_start_date: Date;
	constructor() {
		this.db = new nedb({filename: "./stats.db", autoload: true, timestampData: true});
		var date = new Date();
		this.server_start_date = date;
		var human_readable_date = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
		console.log(`Stats tracker created at ${date.getTime()} or ${human_readable_date}`);
		this.increase_counter("restarts");
		this.load_stats();
	}
}