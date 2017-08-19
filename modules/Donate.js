class Donate {

    /**
     * Constructor of module.
     * @param  Application app            Instance of Application class
     * @param  object|null dependency   If isset - object, else - null
     */
    constructor(app, dependency = null) {
        this.app = app;
        this.dependency = dependency;
    }

    /**
     * Run module.
     */
    run() {
        var translate = this.app.getI18n();
        $.ajax(chrome.extension.getURL('modals/donate.html')).done(function(modal){
            modal = translate.processText(modal);
            $('body').append(modal);
            $('.ibox-title:first').append(translate.processText('<a class="btn btn-warning btn-xs m-l-sm pull-right" data-toggle="modal" data-target="#donateModal">{UI:AboutMe}</a>'));
            $('.ibox-title:first').append('<a class="pull-right" href="https://github.com/mhthnz/hashfair-chrome" target="_blank" title = "Fork extension"><i class="fa fa-github fa-lg" style="color: #f5b35c; margin-right: 10px;"></i></a>');

        });
    }

}
