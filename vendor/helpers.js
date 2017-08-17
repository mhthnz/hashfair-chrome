function format_time(time) {
    return moment(parseInt(time)*1000).format("YYYY-MM-DD");
}

function tooltipper(label, xval, yval, flotItem) {
    yval = parseFloat(yval);
    return (yval.toFixed(8).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,"$1")) + " %s " + "on %x";
}