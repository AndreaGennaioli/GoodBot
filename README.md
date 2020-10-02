# GoodBot

GoodBot is a simple framework for building discord bots in JS.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install goodbot.

```bash
npm install goodbot
```

## Usage

### To initialize the bot:

```js
const { Client } = require("goodbot"); // importing goodbot
const path = require("path"); // importing path

const client = new Client({
  prefix: "!", // the bot's prefix
  ownerID: "465905397874688000", // your discord user id
  inviteLink: "https://discord.gg/botinvite", // the invite for your bot
  commandsFolder: path.join(__dirname, "commands"), // the commands folder, You need to make It
});

client.start("token"); // to start the bot with the token
```

### To create Commands:

```js
// to create commands You first need to make Categories
client.addCommandsCategory("name", "description"); // to create 1 category

// to create more than 1 categories at once
client.addCommandsCategories([
  ["moderation", "moderation commands"],
  ["music", "music commands"],
]);

// You need to create a folder inside the commandsFolder for each category
```

After that you need to make a file for the command inside one of the categories folders.
Then to make the command write this in the command's file:

```js
module.exports = {
  name: "ping", // command name
  description: "ping command description", // command description
  argsType: 'multiple', // not required
  // argsType set the 'args' parameter options,
  // 'single' => all the args in a single string
  // 'multiple' => all the args in a string array

  run: (client, message, args) => {
    message.channel.send("Pong!");
    // ...
  },
};
```

## More

### Default help command
To use the default help command:
```js
client.createDefaultHelp();
```

### Get a commandCategory
How to get a commandCategory:
```js
client.commandsCategories.get('moderation');
```

### Get a command
How to get a command:
```js
client.commandsCategories.get('moderation').get('ban');
```