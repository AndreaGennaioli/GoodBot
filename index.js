/*
 * 	by Andrea Gennaioli
 */

/* 
	next things to do:
	1. default moderation commands
	2. 
*/

const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

class CommandCategory {
	commands = [];
	constructor(name, description, dir) {
		this.name = name;
		this.description = description;
		this.dir = dir;
	}

	get(commandName) {
		return this.commands.find(c => c.name == commandName);
	}
}

module.exports = {
	Client: class Client extends Discord.Client {
		helpCommand = false;
		commandsCategories = {
			cache: [],
			get: (categoryName) => {
				let category = new CommandCategory(
					this.commandsCategories.cache.find(c => c.name == categoryName).name,
					this.commandsCategories.cache.find(c => c.name == categoryName).description,
					this.commandsCategories.cache.find(c => c.name == categoryName).dir
				);
				category.commands = this.commandsCategories.cache.find(c => c.name == categoryName).commands;
				return category;
			}
		};


		constructor({
			prefix,
			ownerID,
			inviteLink,
			commandsFolder,
		}) {
			super();
			if (!prefix) return console.error('Error: missing param prefix');
			if (!ownerID) return console.error('Error: missing param ownerID');
			if (!inviteLink) return console.error('Error: missing param inviteLink');
			if (!commandsFolder) return console.error('Error: missing param commandsFolder');

			this.prefix = prefix;
			this.ownerID = ownerID;
			this.inviteLink = inviteLink;
			this.commandsFolder = commandsFolder;
		}

		addCommandsCategory(name, description) {
			this.commandsCategories.cache.push(new CommandCategory(name, description, path.join(this.commandsFolder, name)));

			let category = this.commandsCategories.cache.find(c => c.name == name);

			let commands = fs.readdirSync(category.dir).filter(file => file.endsWith('.js'));
			for (let command of commands) {
				command = require(category.dir + '/' + command);
				category.commands.push(command);
			}
		}

		addCommandsCategories(array) {
			for (let index = 0; index < array.length; index++) {
				const element = array[index];
				this.commandsCategories.cache.push(new CommandCategory(element[0], element[1], path.join(this.commandsFolder, element[0])));
				let category = this.commandsCategories.cache.find(c => c.name == element[0]);
				let commands = fs.readdirSync(category.dir).filter(file => file.endsWith('.js'));
				for (let command of commands) {
					command = require(category.dir + '/' + command);
					category.commands.push(command);
				}
			}
		}

		createDefaultHelp() {
			this.helpCommand = true;
		}

		start(token) {
			this.login(token);

			this.on('ready', () => {
				console.log('Logged In as ' + this.user.tag);
				console.log('Servers: ' + this.guilds.cache.size);
				console.log('Users: ' + this.users.cache.size);
			})

			this.on('message', (message) => {
				let args = message.content.substring(this.prefix.length).split(' ');
				if (this.helpCommand && args[0] == 'help') {
					if (!args[1]) {
						let embed = {
							embed: {
								author: {
									name: this.user.username + ' Help',
									icon_url: this.user.displayAvatarURL(),
								},
								thumbnail: {
									url: this.user.displayAvatarURL(),
								},
								footer: {
									text: 'bot made with Framework',
								},
								timestamp: new Date(),
								fields: [],
							}
						}

						if (this.commandsCategories.cache.length == 0) return message.channel.send('Your bot has no commandsCategories.\nPlease add them using `client.addCommandsCategory("name", "description");`');

						this.commandsCategories.cache.forEach(commandCategory => {
							embed.embed.fields.push({
								name: commandCategory.name,
								value: '`' + this.prefix + 'help ' + commandCategory.name + '`',
								inline: true
							})
						})

						embed.embed.fields.push({
							name: 'Links',
							value: '[Invite](' + this.inviteLink + ')',
							inline: true
						})

						message.channel.send(embed);
					} else {
						let bool = false;
						this.commandsCategories.cache.forEach(commandCategory => {
							if (commandCategory.name == args[1]) {
								bool = true;
								let embed = {
									embed: {
										author: {
											name: commandCategory.name + ' Category',
											icon_url: this.user.displayAvatarURL(),
										},
										thumbnail: {
											url: this.user.displayAvatarURL(),
										},
										footer: {
											text: 'bot made with Framework',
										},
										timestamp: new Date(),
										fields: [],
									}
								}

								commandCategory.commands.forEach(command => {
									embed.embed.fields.push({
										name: command.name,
										value: command.description,
										inline: true
									})
								})

								message.channel.send(embed);
							}
						})
						if (!bool) message.reply('Categoria Inesistente');
					}
				} else {
					this.commandsCategories.cache.forEach(commandCategory => {
						commandCategory.commands.forEach(command => {
							if (command.name == args[0]) {
								try {
									if (command.argsType == 'single') args = message.content.substring(this.prefix.length + command.name.length + 1)
									else if (command.argsType == 'multiple') args = message.content.substring(this.prefix.length + command.name.length + 1).split(' ');
									command.run(this, message, args);
								} catch (error) {
									command.run(this, message);
								}
							}
						})
					})
				}
			})
		}
	}
}