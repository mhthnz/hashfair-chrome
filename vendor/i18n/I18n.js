class I18n
{
    /**
     * Constructor of class.
     * @param {string} language Current language
     */
    constructor(language = 'eng')
    {
        this.language = language;
        this.defaultLanguage = 'eng';
        this.cache = {};
    }

    /**
     * Find in text translate placeholders and replace.
     *
     * {category:key}
     *
     * @param {string} text
     */
    processText(text) {
        var instance = this;
        return text.replace(/\{([A-z0-9_]+?):([A-z0-9_]+?)(?::({[^}]+}))?\}/g, function(match, category, key, placeholders) {
            if (placeholders !== undefined) {
                return instance.t(category, key, eval('(' + placeholders + ')'));
            }
            return instance.t(category, key);
        });
    }

    /**
     * Function for get current translate.
     *
     * Examples:
     *
     * var instance = new I18n('eng');
     *
     * // Usual
     * instance.t("chart", "revenue per 1 TH/s.");
     *
     * // With placeholders
     * instance.t("index", "You have {hashrate} MH.", {hashrate: 10});
     *
     * @param {string} category Category for key
     * @param {string} key Translate key
     * @param {{}} placeholders Array of placeholders
     * @returns {string}
     */
    t(category, key, placeholders = {})
    {
        let translate = this.getTranslate(category, key);
        Object.keys(placeholders).forEach(function(key,index) {
            translate = translate.replace('{' + key + '}', placeholders[key]);
        });
        return translate;
    }

    /**
     * Get translate by category and key.
     * @param {string} category
     * @param {string} key
     */
    getTranslate(category, key) {

        // Search in current language
        let language = this.getDictionary(this.language);

        if (language.hasOwnProperty(category) && language[category].hasOwnProperty(key)) {
            return language[category][key];
        }
        if (this.language === this.defaultLanguage) {
            console.log("Can't get translate in `" + this.language + "` language. Category: " + category + ", key:" + key);
            return key;
        }

        // Try search in default language
        let defaultLanguage = this.getDictionary(this.defaultLanguage);
        if (defaultLanguage.hasOwnProperty(category) && defaultLanguage[category].hasOwnProperty(key)) {
            return defaultLanguage[category][key];
        }
        console.log("Can't get translate in `" + this.language + "` language. Category: " + category + ", key:" + key);
        return key;
    }

    /**
     * Get dictionary object by name.
     * @param {string} language
     * @returns {{}}
     */
    getDictionary(language)
    {
        // Get dictionary from cache
        if (this.cache.hasOwnProperty(language)) {
            return this.cache[language];
        }

        // Get dictionary
        let result = '';
        let url = chrome.extension.getURL('languages/' + language + '.js');
        $.get({url: url, async: false}).done(function(data){
            result = data;
        });
        if (result == '') {
            return {};
        }

        // Save to cache
        let obj = eval('(' + result + ')');
        this.cache[language] = obj;
        return obj;
    }

}