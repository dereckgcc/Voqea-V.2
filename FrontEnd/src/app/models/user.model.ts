export class User{
    constructor(
        public _id: String,
        public name: String,
        public lastname: String,
        public email: String,
        public password: String,
        public rol: String,
        public image: String,
        public job: String,
        public number: Number,
        public company: String,
        public area: String,
        public level: Number,
        public rewards: String
    ){}
}