class Options {

    constructor(callback) {

        this.language = null;

        this.languageStrategy = Options.autodetect;

        this.revenueShaForecast = 3;

        this.revenueScryptForecast = 3;

        this.modules = [];

        this.load(callback);
    }

    static get autodetect()
    {
        return '_autodetect';
    }

    save(success = null)
    {
        var opt = this;
        console.log({
            language: opt.language,
            languageStrategy: opt.languageStrategy,
            modules: opt.modules,
            revenueShaForecast: opt.revenueShaForecast,
            revenueScryptForecast: opt.revenueScryptForecast
        });
        chrome.storage.sync.set({
            language: opt.language,
            languageStrategy: opt.languageStrategy,
            modules: opt.modules,
            revenueShaForecast: opt.revenueShaForecast,
            revenueScryptForecast: opt.revenueScryptForecast
        });
    }

    load(callback)
    {
        var opt = this;
        chrome.storage.sync.get([
            'language',
            'avgPeriod',
            'languageStrategy',
            'modules',
            'revenueShaForecast',
            'revenueScryptForecast'
        ], function(items) {
            opt.language = items.language ? items.language : 'eng';
            opt.languageStrategy = items.languageStrategy ? items.languageStrategy : Options.autodetect;
            opt.modules = items.modules ? items.modules : [];
            opt.revenueShaForecast = items.revenueShaForecast ? items.revenueShaForecast : 3;
            opt.revenueScryptForecast = items.revenueScryptForecast ? items.revenueScryptForecast : 3;
            callback(opt);
        });
    }

    getLanguages(callback) {
        this.getAvailableLanguages().then(callback);
    }

    getModules(callback) {
        this.getAvailableModules().then(callback);
    }

    getAvailableLanguages() {
        var pr = new Promise(resolve => {
            chrome.runtime.getPackageDirectoryEntry(function (root) {
                root.getDirectory("languages", {create: false}, function (localesdir) {
                    var reader = localesdir.createReader();
                    // Assumes that there are fewer than 100 locales; otherwise see DirectoryReader docs
                    reader.readEntries(function (results) {
                        resolve(results.map(function (de) {
                            return de.name;
                        }).sort());
                    });
                });
            })
        });
        return pr;
    }

    getAvailableModules() {
        var pr = new Promise(resolve => {
            chrome.runtime.getPackageDirectoryEntry(function (root) {
                root.getDirectory("modules", {create: false}, function (localesdir) {
                    var reader = localesdir.createReader();
                    // Assumes that there are fewer than 100 locales; otherwise see DirectoryReader docs
                    reader.readEntries(function (results) {
                        resolve(results.map(function (de) {
                            return de.name;
                        }).sort());
                    });
                });
            })
        });
        return pr;
    }
}
