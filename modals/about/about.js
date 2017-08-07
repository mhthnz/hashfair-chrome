$(document).ready(function () {

    $("<div>").load(chrome.extension.getURL('modals/about/about.html'), function () {
        $("body").append($(this).html());
    });

});
