console.log(`Loaded: ${import.meta.url}`);

// import {Utils} from "./scripts/common/utils.js";
// import {PackageHooks} from "./scripts/common/PackageHooks.js";
import {Utils, PackageHooks} from './scripts/common/index.js';

Utils.log('Starting...');
PackageHooks.registerHooks();