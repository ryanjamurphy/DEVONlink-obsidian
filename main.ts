import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import {runAppleScriptAsync} from 'run-applescript';


// interface DEVONlinkSettings {
// 	databaseUUID: string;
// }

// const DEFAULT_SETTINGS: DEVONlinkSettings = {
// 	databaseUUID: 'inbox'
// }

export default class DEVONlinkPlugin extends Plugin {
	// settings: DEVONlinkSettings;

	async onload() {
		console.log('Loading the DEVONlink plugin.');

		// await this.loadSettings();

		this.addRibbonIcon('go-to-file', 'DEVONlink', () => {
			this.openDEVONthinkRecord();
		});

		this.addCommand({
			id: 'open-indexed-note-in-DEVONthink',
			name: 'Open indexed note in DEVONthink',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.openDEVONthinkRecord();
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({
			id: 'reveal-indexed-note-in-DEVONthink',
			name: 'Reveal indexed note in DEVONthink',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						this.revealDEVONthinkRecord();
					}
					return true;
				}
				return false;
			}
		});

		// this.addSettingTab(new DEVONlinkSettingsTab(this.app, this));
	}

	onunload() {
		console.log('Unloading the DEVONlink plugin');
	}

	// async loadSettings() {
	// 	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	// }

	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }

	async openDEVONthinkRecord() {
		let notePath = this.app.workspace.getActiveFile().path;
		let noteFilename = this.app.workspace.getActiveFile().name;
		let vaultPath = this.app.vault.adapter.basePath;
		let homeFolderPath = await runAppleScriptAsync('get POSIX path of the (path to home folder)');
		// attempting to get path to work: await runAppleScriptAsync('tell application id "DNtp" to open window for record (first item in (lookup records with path "~' + vaultPath + '/' + notePath + '") in database (get database with uuid "'+ this.settings.databaseUUID + '")) with force'); //need to provide a settings option for DEVONthink database ID
		let DEVONlinkSuccessNotice = await runAppleScriptAsync(
			`tell application id "DNtp"
				try
					set theDatabases to databases
					repeat with thisDatabase in theDatabases
						set theNoteRecord to (first item in (lookup records with file "${noteFilename}" in thisDatabase))
						set theParentRecord to the first parent of theNoteRecord
						set newDEVONthinkWindow to open window for record theNoteRecord with force
						activate
						return "success"
					end repeat
				on error
					return "failure"
				end try
				activate
			end tell`); //need to provide a settings option for DEVONthink database ID
		if (DEVONlinkSuccessNotice == "failure") {
			new Notice("Sorry, DEVONlink couldn't find a matching record in your DEVONthink databases. Make sure your notes are indexed, the index is up to date, and the DEVONthink database with the indexed notes is open.");
		}
	}

	async revealDEVONthinkRecord() {
		let notePath = this.app.workspace.getActiveFile().path;
		let noteFilename = this.app.workspace.getActiveFile().name;
		let vaultPath = this.app.vault.adapter.basePath;
		let homeFolderPath = await runAppleScriptAsync('get POSIX path of the (path to home folder)');
		// attempting to get path to work: await runAppleScriptAsync('tell application id "DNtp" to open window for record (first item in (lookup records with path "~' + vaultPath + '/' + notePath + '") in database (get database with uuid "'+ this.settings.databaseUUID + '")) with force'); //need to provide a settings option for DEVONthink database ID
		let DEVONlinkSuccessNotice = await runAppleScriptAsync(
			`tell application id "DNtp"
				try
					set theDatabases to databases
					repeat with thisDatabase in theDatabases
						set theNoteRecord to (first item in (lookup records with file "${noteFilename}" in thisDatabase))
						set theParentRecord to the first parent of theNoteRecord
						set newDEVONthinkWindow to open window for record theParentRecord with force
						set newDEVONthinkWindow's selection to theNoteRecord as list
						activate
						return "success"
					end repeat
				on error
					return "failure"
				end try
				activate
			end tell`); //need to provide a settings option for DEVONthink database ID
		if (DEVONlinkSuccessNotice == "failure") {
			new Notice("Sorry, DEVONlink couldn't find a matching record in your DEVONthink databases. Make sure your notes are indexed, the index is up to date, and the DEVONthink database with the indexed notes is open.");
		}
	}
}

// class DEVONlinkSettingsTab extends PluginSettingTab {
// 	plugin: DEVONlinkPlugin;

// 	constructor(app: App, plugin: DEVONlinkPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		let {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'DEVONlink Settings'});

// 		new Setting(containerEl)
// 			.setName('DEVONthink Database UUID')
// 			.setDesc('Please enter the UUID of the database with your indexed notes. To get the UUID, right click on the database and select copy item link, then remove the x-devonthink-item:// prefix.')
// 			.addText(text => text
// 				.setPlaceholder('some-string-of-characters')
// 				.setValue(this.plugin.settings.databaseUUID)
// 				.onChange(async (value) => {
// 					this.plugin.settings.databaseUUID = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
