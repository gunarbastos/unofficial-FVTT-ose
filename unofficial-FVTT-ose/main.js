console.log(`Loaded: ${import.meta.url}`);

import './scripts/engine/index.js';
import {UOSEPackageHooks, UOSEUtils} from "./scripts/foundry/index.js";

import './scripts/foundry/replacements/index.js';
import './scripts/dataModels/index.js';
import './scripts/dataModels/effects/index.js';
import './scripts/dataModels/actors/index.js';
import './scripts/dataModels/items/index.js';
import './scripts/documents/actors/index.js';
import './scripts/documents/items/index.js';
import './scripts/sheets/actors/index.js';
import './scripts/sheets/items/index.js';
import './scripts/apps/index.js';

UOSEUtils.log('Starting...');
UOSEPackageHooks.registerHooks();