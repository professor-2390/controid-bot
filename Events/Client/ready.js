const chalk = require("chalk");

module.exports = {
    name: "ready",
    once:true,
    async execute(client) {
        console.log(chalk.green(chalk.underline("🔴 Bot Online!")));
        await client.user.setPresence({ activities: [{ name: '/help', type:"LISTENING" }], status: 'dnd' });
    }
};