const chalk = require("chalk");
const mongoose = require("mongoose");

module.exports = {
    name: "ready",
    once:true,
    async execute(client) {
        await client.user.setPresence({ activities: [{ name: '/help', type:"LISTENING" }], status: 'dnd' });
        
        const Database = process.env.database;
        
        if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=> {
            console.log(chalk.green(chalk.underline("🟢 Successfully connected to database!")))
        }).catch((err)=>{
            console.log(chalk.red(err))
        })
        console.log(chalk.green(chalk.underline("🔴 Bot Online!")));
    }
};