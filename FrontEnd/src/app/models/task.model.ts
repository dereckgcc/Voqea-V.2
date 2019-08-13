export class Task{
    constructor(
        public title: String,
        public description: String,
        public supervisor: String,
        public maker: String,
        public score: Number,
        public state:{
            withoutStarting: Number,
            inAction: Number,
            finished: Number
        } 
    ){}
}