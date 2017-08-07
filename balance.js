function create_placeholder(id, title) {
    var container = $('ul.stat-list:first')[0];
    var sample = $(container).find('li:last')[0];
    var sample_html = $(sample).html();
    $(sample).after('<li>'+ sample_html +'</li>');
    var target = $(container).find('li:last')[0];
    $(target).find('.p-xxs').css('background-color', '#f5b35c');
    $(target).find('h3').attr('id', id).text('---');
    $(target).find('small').text(title);
}

var btc_price = $('#btcprice').val();
var balance_el = $('h2.m-l-md.m-b-none:first');
var usd_balance = parseFloat($(balance_el).html()) * parseFloat(btc_price);
var text = $(balance_el).html() + ' <span class="badge badge-warning">$' + usd_balance.toFixed(2) + '</span>';
$(balance_el).html(text);
$('.ibox-title:first').find('h5').append(' <font color="black">|</font> <span id="price_disclaimer"></span>');
$('#price_disclaimer').css('color', '#f5b35c').css('font-weight', 'bold').text('1 BTC = $'+btc_price);

create_placeholder('last_amount', 'Last Summary Clear Payout (SHA-256 and Scrypt)');
create_placeholder('daily_average', 'Daily Average (14 days period) Clear Payout');

