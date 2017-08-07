$(document).ready(function () {

    $('.ibox-title:first').append('<a class="btn btn-warning btn-xs m-l-sm pull-right" data-toggle="modal" data-target="#donateModal">Want More?</a>');
    $('.ibox-title:first').append('<a class="pull-right" data-toggle="modal" data-target="#helpModal"><i class="fa fa-question-circle fa-lg" style="color: #f5b35c"></i></a>');
    $('.ibox-title:first').append('<a class="pull-right" href="https://facebook.com/hashfair" target="_blank"><i class="fa fa-facebook-square fa-lg" style="color: #f5b35c; margin-right: 10px;"></i></a>');
    $('.ibox-title:first').append('<a class="pull-right" href="https://twitter.com/hashfairplugin" target="_blank"><i class="fa fa-twitter fa-lg" style="color: #f5b35c; margin-right: 10px;"></i></a>');
    $('.ibox-title:first').append('<a class="pull-right" href="https://github.com/mhthnz/hashfair-chrome" target="_blank" title = "Fork extension"><i class="fa fa-github fa-lg" style="color: #f5b35c; margin-right: 10px;"></i></a>');

    $("<div>").load(chrome.extension.getURL('modals/donate/donate.html'), function () {
        $("body").append($(this).html());
        $('#donate-qr').attr('src', chrome.extension.getURL('images/qr.png'));
        $.ajax('https://chain.api.btc.com/v3/address/1JbdaDN2SDq9WKaTmUr7Zq9XnBSS6P4SBH').done(function (data) {
            var amount = data.data.received / 100000000;
            $('#donateProgress').css('width', data.data.received < 1000000 ? '1%' : (data.data.received/1000000)+'%' );
            $('#donateCollected').prepend(amount);
        });
    });

});
