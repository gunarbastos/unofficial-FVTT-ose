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
    },
    constants: {},
    api: null,
    utils: null,
    settings: {},
    lang: null,
};

export class UOSE {

    static actor = 'actor';
    static item = 'item';
    static #bitsAndBobsMatch = /^UOSE(?<name>.*?)(?<suffix>Vehicle|Animal)?(?<type>Actor|Item)?(?<object>Document|DataModel|Sheet)$/;
    static #bitsAndBobsReplace = "$<name>$<suffix>";


    static publicView() {
        return _uose;
    }

    static #register({collection, name, cls, collectionName, typeCollection = null} = {}){
        if(!_uose.utils || !collection || !name || !cls ) return;
        if (collection[name]) _uose.utils.log('#register', collectionName, `${name} already exists in collection ${collectionName}, replacing ${collection[name]} with ${cls}`);
        collection[name] = cls;

        if(!typeCollection) return;
        if(!typeCollection[name]) typeCollection[name] = {};
        const singularCollectionName = collectionName.endsWith('s') ? collectionName.slice(0, -1) : collectionName;
        if(typeCollection[name][singularCollectionName]) _uose.utils.log('#register', singularCollectionName, `${name} already have entry ${singularCollectionName}, replacing ${typeCollection[name][singularCollectionName]} with ${cls}`);
        typeCollection[name][singularCollectionName] = cls;
    }

    static registerDocument(type, cls) {
        if(!type || !cls) return;
        this.#register(
            {
                collection: _uose.classes.documents[`${type}s`],
                name: cls.prototype.constructor.name.replace(this.#bitsAndBobsMatch, this.#bitsAndBobsReplace),
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
                name: cls.prototype.constructor.name.replace(this.#bitsAndBobsMatch, this.#bitsAndBobsReplace),
                cls: cls,
                collectionName: 'dataModels',
                typeCollection: _uose.classes[`${type}s`]
            }
        );
    }

    static registerSheet(type, cls) {
        if(!type || !cls) return;
        this.#register(
            {
                collection: _uose.classes.sheets[`${type}s`],
                name: cls.prototype.constructor.name.replace(this.#bitsAndBobsMatch, this.#bitsAndBobsReplace),
                cls: cls,
                collectionName: 'sheets',
                typeCollection: _uose.classes[`${type}s`]
            }
        );
    }

    static registerApp(cls) {
        if(!cls) return;
        this.#register(
            {
                collection: _uose.classes.apps,
                name: cls.prototype.constructor.name.replace(/App$/, ''),
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
}