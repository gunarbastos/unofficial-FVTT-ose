console.log(`Loaded: ${import.meta.url}`);

// import {Utils} from "./scripts/common/utils.js";
// import {PackageHooks} from "./scripts/common/PackageHooks.js";
import {PackageHooks, Utils} from './scripts/common/index.js';
//import './scripts/dataModels/index.js';
//import './scripts/dataModels/effects/index.js';
import './scripts/dataModels/actors/index.js';
import './scripts/dataModels/items/index.js';

Utils.log('Starting...');
PackageHooks.registerHooks();