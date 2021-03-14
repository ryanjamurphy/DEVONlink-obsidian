import { addIcon, App, FileSystemAdapter, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import {runAppleScriptAsync} from 'run-applescript';

addIcon('DEVONthink', `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 75 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <g transform="matrix(1,0,0,1,-24,-28)">
        <g>
            <path d="M49.214,61.093L27.76,73.903C27.76,73.903 33.326,94.068 60.807,94.212C84.019,94.333 94.959,74.348 95.626,63.402C96.311,52.176 90.679,31.855 69.477,31.855C43.67,31.855 47.178,59.386 49.214,61.093Z" style="fill:none;stroke:currentColor;stroke-width:6px;"/>
            <path d="M65.37,59.193C56.43,57.776 60.045,46.29 67.466,46.434C72.172,46.525 77.034,49.196 77.319,57.169C77.529,63.05 73.829,69.654 63.674,69.882C53.519,70.11 49.214,61.093 49.214,61.093C49.214,61.093 55.701,71.918 47.914,78.584C38.756,86.423 27.922,73.893 27.922,73.893" style="fill:none;stroke:currentColor;stroke-width:6px;"/>
        </g>
    </g>
</svg>
`);

interface DEVONlinkSettings {
	ribbonButtonAction: string;
}

const DEFAULT_SETTINGS: DEVONlinkSettings = {
	ribbonButtonAction: 'open'
}

export default class DEVONlinkPlugin extends Plugin {
	settings: DEVONlinkSettings;

	async onload() {
		console.log('Loading the DEVONlink plugin, test 1.');

		await this.loadSettings();

		this.addRibbonIcon('DEVONthink', 'DEVONlink', () => {
			if (this.settings.ribbonButtonAction == "open") {
				this.openInDEVONthink(false);
			} else if (this.settings.ribbonButtonAction == "reveal") {
				this.revealInDEVONthink(false);
			}
		});

		this.addCommand({
			id: 'open-indexed-note-in-DEVONthink',
			name: 'Open indexed note in DEVONthink',
			checkCallback: this.openInDEVONthink.bind(this)
		});

		this.addCommand({
			id: 'reveal-indexed-note-in-DEVONthink',
			name: 'Reveal indexed note in DEVONthink',
			checkCallback: this.revealInDEVONthink.bind(this)
		});

		this.addSettingTab(new DEVONlinkSettingsTab(this.app, this));
	}

	onunload() {
		console.log('Unloading the DEVONlink plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getVaultPath(someVaultAdapter: FileSystemAdapter) {
		return someVaultAdapter.getBasePath();	
	}

	async openInDEVONthink(checking: boolean) : Promise<boolean> {
		let leaf = this.app.workspace.activeLeaf;
		if (leaf) {
			if (!checking) {
				let activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					let noteFilename = activeFile.name;
					let vaultAdapter = this.app.vault.adapter;
					if (vaultAdapter instanceof FileSystemAdapter) {
						// let vaultPath = vaultAdapter.getBasePath(); // No longer needed, but leaving it in in case I ever decide to return to try to figure out how to get the path right. It would be a more robust solution than relying on filenames.
						// let homeFolderPath = await runAppleScriptAsync('get POSIX path of the (path to home folder)'); // see above
						// attempting to get path to work: await runAppleScriptAsync('tell application id "DNtp" to open window for record (first item in (lookup records with path "~' + vaultPath + '/' + notePath + '") in database (get database with uuid "'+ this.settings.databaseUUID + '")) with force'); // see above
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
							end tell`);
						if (DEVONlinkSuccessNotice == "failure") {
							new Notice("Sorry, DEVONlink couldn't find a matching record in your DEVONthink databases. Make sure your notes are indexed, the index is up to date, and the DEVONthink database with the indexed notes is open.");
						}
					}
					return true;
					}
			}
		} else {
			new Notice("No active pane. Try again with a note open.");
		}
		return false;
	}

	async revealInDEVONthink(checking: boolean) : Promise<boolean> {
		let leaf = this.app.workspace.activeLeaf;
		if (leaf) {
			if (!checking) {
				let activeFile = this.app.workspace.getActiveFile();
				if (activeFile) {
					let noteFilename = activeFile.name;
					let vaultAdapter = this.app.vault.adapter;
					if (vaultAdapter instanceof FileSystemAdapter) {
						// let vaultPath = vaultAdapter.getBasePath(); // No longer needed, but leaving it in in case I ever decide to return to try to figure out how to get the path right. It would be a more robust solution than relying on filenames.
						// let homeFolderPath = await runAppleScriptAsync('get POSIX path of the (path to home folder)'); // see above
						// attempting to get path to work: await runAppleScriptAsync('tell application id "DNtp" to open window for record (first item in (lookup records with path "~' + vaultPath + '/' + notePath + '") in database (get database with uuid "'+ this.settings.databaseUUID + '")) with force'); // see above
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
							end tell`);
						if (DEVONlinkSuccessNotice == "failure") {
							new Notice("Sorry, DEVONlink couldn't find a matching record in your DEVONthink databases. Make sure your notes are indexed, the index is up to date, and the DEVONthink database with the indexed notes is open.");
						}
					}
					return true;
					}
			}
		} else {
			new Notice("No active pane. Try again with a note open.");
		}
		return false;
	}
}

class DEVONlinkSettingsTab extends PluginSettingTab {
	plugin: DEVONlinkPlugin;

	constructor(app: App, plugin: DEVONlinkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'DEVONlink Settings'});

		new Setting(containerEl)
			.setName('Ribbon button action')
			.setDesc('Should the ribbon button open the note in DEVONthink, or reveal it in the DEVONthink database?')
			.addDropdown(buttonMenu => buttonMenu
				.addOption("open", "Open the note in the database.")
				.addOption("reveal", "Reveal the note in the database.")
				.setValue(this.plugin.settings.ribbonButtonAction)
				.onChange(async (value) => {
					this.plugin.settings.ribbonButtonAction = value;
					await this.plugin.saveSettings();
				}));
	}
}
