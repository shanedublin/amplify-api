let data = [];

let trMap = new Map();

function init() {
    $('#searchText').on('input', _.debounce(search, 200));


    $.getJSON("/api", function (json) {

        console.log(json[2]);
        handleJson(json[2]);
        data = json[2];
    });


    console.log();
}

function handleJson(json) {

    let table = $('#table-body');

    $.each(json, function (i, item) {
        // console.log(item)
        // console.log(i)
        let row = $("<tr>").attr("id", "mac_" + i);

        let host_name = $("<td>").html(item.host_name);

        let description = $("<td>").html(item.description);


        let ip = $("<td>")

        let link = createLink(item.ip);

        link.appendTo(ip);
        let button = createButton(item.ip);
        let copy = $("<td>");



        host_name.appendTo(row);
        description.appendTo(row);
        ip.appendTo(row);

        button.appendTo(copy);
        copy.appendTo(row);


        row.appendTo(table);

    });

}

function createLink(ip) {
    let url = $('<a>').attr('href', 'http://' + ip).attr('target', '_blank').attr('rel', 'noopener noreferrer').html(ip);
    return url;
}

function createButton(ip) {
    let button = $('<button>').attr('type', 'button').attr('class', 'btn btn-primary btn-sm').attr('onclick', 'copy("' + ip + '")');
    let icon = $('<span>').attr('class', 'material-icons').html('content_copy');
    icon.appendTo(button);
    return button;
}

function copy(str) {
    navigator.clipboard.writeText(str);
}

function search() {
    let text = $('#searchText').val();
    console.log(text);
    let filterMap = new Map();


    $.each(data, function (i, item) {
        if (item.host_name && item.host_name.toUpperCase().includes(text.toUpperCase())) {
            filterMap.set(i, item);
        }
    });

    console.log(filterMap)

    $.each(data, function (i, item) {
        let searchString = i;
        searchString = searchString.replaceAll(':', '\\:');
        let tr = $('#mac_' + searchString);
        if (filterMap.has(i)) {
            console.log(searchString);

            console.log(tr)
            //    console.log('has'+i)
            tr.show();
        } else {
            tr.hide();

        }
    });

}

init();