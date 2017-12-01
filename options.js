$(document).ready(function () {
    new Options(function(options) {

        var translate = new I18n();

        if (options.languageStrategy !== Options.autodetect) {
            var translate = new I18n(options.languageStrategy);
        }

        // Language settings
        options.getLanguages(function (lng) {
            if (lng.length == 0) {
                return;
            }
            let languages = "";
            for (var i = 0; i < lng.length; i++) {
                let language = lng[i].replace(/([a-z]+)\.[a-z]+/, '$1');
                languages += '<option '+(language === options.languageStrategy ? 'selected="selected"' : '')+' value="'+language+'">{settings:'+language+'}</option>';
            }

            let checked = Options.autodetect === options.languageStrategy ? 'selected="selected"' : '';
            let code = `
            <div class="item language">
                <div class="header">{settings:languageSetting}</div>
                <select id="language">
                    <option ${checked} value="_autodetect">{settings:autodetectLanguage}</option>
                    ${languages}
                </select>
            </div>`;
            $("body").prepend(translate.processText(code));
            $(document).on("change", "select#language", function(e) {
                options.languageStrategy = $(this).val();
                if ($(this).val() !== Options.autodetect) {
                    options.language = $(this).val();
                    options.languageStrategy = $(this).val();
                }
            });
        });

        // Modules settings
        options.getModules(function (modules) {
            if (modules.length == 0) {
                return;
            }
            let modulesCode = "";
            for (var i = 0; i < modules.length; i++) {
                let module = modules[i].replace(/([a-z]+)\.[a-z]+/, '$1');
                if (module == 'Donate') {
                    continue;
                }
                modulesCode += '<label title="{modules:'+module+'}"><input type="checkbox" title="{modules:'+module+'}" name="' + module + '" '+((options.modules.length == 0 || options.modules.includes(module)) ? 'checked="checked"' : '')+'/>'+module+'</label><br/>';
            }
            let code = `
            <div class="item modules">
                <div class="header">{settings:modulesSetting}</div>
                <div style="text-align:left;">
                    ${modulesCode}
                </div>
            </div>
        `;
            $("body").prepend(translate.processText(code));
            $(document).on('change', 'input[type="checkbox"]', function(e){
                let module = $(this).attr('name');
                if ($(this).is(":checked")) {

                    // Add module to array
                    if (!options.modules.includes(module)) {
                        options.modules.push(module);
                    }
                } else {

                    // Remove module from array
                    if (options.modules.includes(module)) {
                        let index = options.modules.indexOf(module);
                        options.modules.splice(index, 1);
                    }
                }
            });

            // Add modules to array if not set
            if (options.modules.length == 0) {
                $('input[type="checkbox"]').trigger("change");
            }
        });

        // Average
        let code = `
        <div class="item average">
            <div class="header">{settings:revenueShaForecast}</div>
            <select id="revenue-sha-forecast">
                <option value="1">{settings:days:{days:1}}</option>
                <option value="2">{settings:days:{days:2}}</option>
                <option value="3">{settings:days:{days:3}}</option>
                <option value="4">{settings:days:{days:4}}</option>
                <option value="5">{settings:days:{days:5}}</option>
                <option value="6">{settings:days:{days:6}}</option>
                <option value="7">{settings:days:{days:7}}</option>
                <option value="8">{settings:days:{days:8}}</option>
                <option value="9">{settings:days:{days:9}}</option>
                <option value="10">{settings:days:{days:10}}</option>
                <option value="11">{settings:days:{days:11}}</option>
                <option value="12">{settings:days:{days:12}}</option>
                <option value="13">{settings:days:{days:13}}</option>
                <option value="14">{settings:days:{days:14}}</option>
            </select>
            <div class="header">{settings:revenueScryptForecast}</div>
            <select id="revenue-scrypt-forecast">
                <option value="1">{settings:days:{days:1}}</option>
                <option value="2">{settings:days:{days:2}}</option>
                <option value="3">{settings:days:{days:3}}</option>
                <option value="4">{settings:days:{days:4}}</option>
                <option value="5">{settings:days:{days:5}}</option>
                <option value="6">{settings:days:{days:6}}</option>
                <option value="7">{settings:days:{days:7}}</option>
                <option value="8">{settings:days:{days:8}}</option>
                <option value="9">{settings:days:{days:9}}</option>
                <option value="10">{settings:days:{days:10}}</option>
                <option value="11">{settings:days:{days:11}}</option>
                <option value="12">{settings:days:{days:12}}</option>
                <option value="13">{settings:days:{days:13}}</option>
                <option value="14">{settings:days:{days:14}}</option>
            </select>
        </div>
    `;
        $("body").prepend(translate.processText(code));
        $("#revenue-sha-forecast").val(options.revenueShaForecast);

        $("#revenue-scrypt-forecast").val(options.revenueScryptForecast.toString());
        $(document).on('change', "#revenue-sha-forecast", function(e) {
            options.revenueShaForecast = $(this).val();
        });
        $(document).on('change', "#revenue-scrypt-forecast", function(e) {
            options.revenueScryptForecast = $(this).val();
        });

        $("title").html(translate.t('settings', 'settings'));

        $("#save").html(translate.t('settings', 'save'));
        $(document).on('click', "#save", function(e) {
            options.save();
            $(translate.processText("<div style='color:green;'>{settings:settingsSaved}!</div>")).appendTo($(this).closest(".item")).fadeOut(1500);
        });

    });


});