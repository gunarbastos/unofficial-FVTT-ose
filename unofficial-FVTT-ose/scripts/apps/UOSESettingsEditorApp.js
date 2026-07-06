import {UOSEBaseApp} from "./UOSEBaseApp.js";
import {UOSE} from "../foundry/index.js";
import {UOSESettingsEditorSettings} from "./UOSESettingsEditorSettings.js";

console.log(`Loaded: ${import.meta.url}`);

export class UOSESettingsEditorApp extends UOSEBaseApp {

    static settingsClass = UOSESettingsEditorSettings;

}

UOSE.registerApp(UOSESettingsEditorApp);