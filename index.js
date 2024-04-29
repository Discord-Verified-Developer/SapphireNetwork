console.log("[INFO] NodeJS: " + process.version);
const key = process.env.key;
const token = process.env.token; // lmao

// im done ;)
// ur welcome, anything else?
async function run() {
  global.discordjs = require("discord.js");
  global.bodyparser = require("body-parser");
  global.express = require("express");

  global.api = global.express();
  let client = new global.discordjs.Client({
    intents: [
      "GUILDS",
      "GUILD_VOICE_STATES",
      "GUILD_MESSAGES",
      "GUILD_MESSAGE_REACTIONS",
      "GUILD_MESSAGE_TYPING",
      "GUILD_MEMBERS",
      "GUILD_PRESENCES",
      "DIRECT_MESSAGES"
    ]
  });
client.login(token);

  let statuses = [
    '[S:D] Sapphire Development ━ Network Status: Operational',
    '[S:D] Sapphire Development ━ Defense Status: Operational',
    '[S:D] Sapphire Development ━ System Status: Operational'
]
let status = statuses[Math.floor(Math.random(12000) * statuses.length)]

setInterval(() => {
    client.user.setActivity(status, { type: 'WATCHING' })
}, 5000)

  // Globalizing the client
  global.client = client
  global.api.listen(process.env.PORT || 8080, function(port) {
    console.log("[API] Listening")
  })
  global.api.use(global.bodyparser.json())
  global.api.get("/", (req, res) => {
 res.send();
    //__dirname : It will resolve to your project folder.
  });
  global.api.post("/hooks/:guildId/:channelId", async function(req, res) {
    if (!req.body["key"]) {
      return res.json({
        success: false,
        reason: "There is no authentication key in the body"
      })
    }
    if (req.body["key"] !== key) {
      return res.json({
        success: false,
        reason: "Key not authorised"
      })
    }
    if (!req.params.channelId || !req.params.guildId) {
      return res.json({
        success: false,
        reason: "The channel ID or guild ID was not provided in the params"
      })
    }
    if (!global.client.guilds.cache.get(req.params.guildId)) {
      return res.json({
        success: false,
        reason: "I am not a member in the provided guild"
      })
    }
    if (!global.client.channels.cache.get(req.params.channelId)) {
      return res.json({
        success: false,
        reason: "I do not see the provided channel"
      })
    }

    const channel = global.client.channels.cache.get(req.params.channelId)
    await channel.send(req.body.data)

    res.json({
      success: true,
      reason: "Posted the embed"
    })
  })
}

module.exports = run()
