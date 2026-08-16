console.log(`Loaded: ${import.meta.url}`);

const _uose = {
    classes: {
        base: {},
        documents: {actors: {}, items: {}},
        dataModels: {actors: {}, items: {}},
        sheets: {actors: {}, items: {}},
        apps: {},
        actors: {},
        items: {},
        effects: {},
        replacements: {},
    },
    foundryConfig: CONFIG,
    constants: {}, //object with UOSE constants
    //api: null, //pointer to object with functions to do things in the system, INCLUDING ROLLS
    utils: null, //pointer to UOSEUtils class, that eventually will become an extension of TGLUtils class
    settings: null, //pointer to system settings object
    lang: null, //pointer to i18n uose language entry
    apps: {}, //object with name -> obj
};

export class UOSE {

    static actor = 'actor';
    static item = 'item';
    static #classNamePattern = /^UOSE(?<name>.*?)(?<suffix>Vehicle|Animal)?(?<type>Actor|Item)?(?<object>Document|DataModel|Sheet)|UOSE(?<name>.*?)(?<object>App)$/;
    static #domainNameGroups = "$<name>$<suffix>";

    static #pathsToLoad = [];


    static publicView() {
        for(const file of this.#pathsToLoad) foundry.applications.handlebars.getTemplate(file).catch(() => null);
        this.#pathsToLoad = [];
        return _uose;
    }

    static getDomainFromName(ClassName) {
        const groups = this.#classNamePattern.exec(ClassName)?.groups;

        if(!groups || groups.length === 0) return undefined;
        if(!groups.object) return 'UOSE';
        return `${groups.name.toLowerCase()}${groups.suffix ?? ''}`;
    }

    static #register({collection, name, cls, collectionName, typeCollection = null} = {}){
        if(!_uose.utils || !collection || !name || !cls ) return;
        if (collection[name]) _uose.utils.log('#register', collectionName, `${name} already exists in collection ${collectionName}, replacing ${collection[name]} with ${cls}`);
        collection[name] = cls;

        if(!typeCollection) return;
        if(!typeCollection[name]) typeCollection[name] = { type: name };
        const singularCollectionName = collectionName.endsWith('s') ? collectionName.slice(0, -1) : collectionName;
        if(typeCollection[name][singularCollectionName]) _uose.utils.log('#register', singularCollectionName, `${name} already have entry ${singularCollectionName}, replacing ${typeCollection[name][singularCollectionName]} with ${cls}`);
        typeCollection[name][singularCollectionName] = cls;
    }

    static registerDocument(type, cls) {
        if(!type || !cls) return;
        this.#register(
            {
                collection: _uose.classes.documents[`${type}s`],
                name: cls.prototype.constructor.name.replace(this.#classNamePattern, this.#domainNameGroups),
                cls: cls,
                collectionName: 'documents',
                typeCollection: _uose.classes[`${type}s`]
            }
        );
    }

    static registerDataModel(type, cls) {
        if(!type || !cls) return;
        this.#register(
            {
                collection: _uose.classes.dataModels[`${type}s`],
                name: cls.prototype.constructor.name.replace(this.#classNamePattern, this.#domainNameGroups),
                cls: cls,
                collectionName: 'dataModels',
                typeCollection: _uose.classes[`${type}s`]
            }
        );
    }

    static registerSheet(type, cls) {
        if(!type || !cls) return;
        const domain = cls.prototype.constructor.name.replace(this.#classNamePattern, this.#domainNameGroups);
        this.#pathsToLoad.push(`systems/unofficial-FVTT-ose/template/parts/sheets/${type}s/${domain.charAt(0).toLowerCase()}${domain.slice(1)}/main.hbs`)
        this.#register(
            {
                collection: _uose.classes.sheets[`${type}s`],
                name: domain,
                cls: cls,
                collectionName: 'sheets',
                typeCollection: _uose.classes[`${type}s`]
            }
        );
    }

    static registerApp(cls) {
        if(!cls) return;
        const domain = cls.prototype.constructor.name.replace(this.#classNamePattern, this.#domainNameGroups);
        this.#pathsToLoad.push(`systems/unofficial-FVTT-ose/template/parts/apps/${domain.charAt(0).toLowerCase()}${domain.slice(1)}/main.hbs`)
        this.#register(
            {
                collection: _uose.classes.apps,
                name: domain,
                cls: cls,
                collectionName: 'apps'
            }
        );
    }

    static registerBaseClass(cls) {
        if(!cls) return;
        this.#register({
            collection: _uose.classes.base,
            name: cls.prototype.constructor.name.replace(/^UOSE/, ''),
            cls: cls,
        })
    }

    static registerEffect(cls) {
        if(!cls || !cls.type) return;
        this.#register({
            collection: _uose.classes.effects,
            name: cls.type,
            cls: cls,
        })
    }

    static registerSettings(instance) {
        if(!instance) return;
        _uose.settings = instance;
    }

    static registerConstants(instance) {
        if(!instance) return;
        _uose.constants = instance;
    }

    static registerLanguage(instance) {
        if(!instance) return;
        _uose.lang = instance;
    }

    static registerReplacement(cls) {
        if(!cls) return;
        this.#register({
            collection: _uose.classes.replacements,
            name: cls.prototype.constructor.name.replace(/^UOSE/, ''),
            cls: cls,
        })
    }

}