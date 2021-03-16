## DEVONlink - Integrate Obsidian with DEVONthink

Open or reveal the current note in DEVONthink.

Pair it with the companion AppleScript to integrate Obsidian and DEVONthink notes. Read more about the plugin and find the AppleScript here: https://axle.design/devonlink-integrate-obsidian-and-devonthink

![This video shows the user using the plugin and AppleScript to open notes back and forth from Obsidian and DEVONthink.](https://i.imgur.com/VRurr9L.gif)

### How to use

1. Make sure your notes are indexed in a DEVONthink database, and that the database is open in DEVONthink.
2. Select the ribbon button to reveal the currently-active note in DEVONthink. Or, use the Reveal Indexed Note or Open Indexed Note commands via the Command Palette. Or, assign hotkeys to those commands in Obsidian's hotkey preferences.

### How it works

The plugin uses the name of your active note to look for the first instance of a file with that name in any of your open databases. 

If you have the same file in multiple places (e.g., via replicants or duplicates), or if you have multiple files with the same name as your note, you may not get desirable results.

### Installing the plugin

Look it up in Obsidian's Community Plugins gallery and select "Install."

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault folder in the directory `VaultFolder/.obsidian/plugins/DEVONlink-obsidian/`.