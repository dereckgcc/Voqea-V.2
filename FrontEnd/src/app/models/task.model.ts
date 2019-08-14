export class Task{
    constructor(
        public _id: String,
        public title: String,
        public description: String,
        public maker: String,
        public score: Number,
        public state:{
            withoutStarting: Number,
            inAction: Number,
            finished: Number
        } 
    ){}
}