//cfg object
function CFG(name, items, start, end) {
    this.name = name;
    this.items = items;
    this.start = start;
    this.end = end;
}

//Saves cfg
function save_cfg(cfg) {
    var json_str = JSON.stringify(cfg);
    alert(json_str);
    //send this string to the server???
    //server must save this as json
}

//get all tools from server
function get_tools() {
    //temp
    return ['tool#1', 'tool#2', 'tool#3', 'tool#4'];
}

//get all items for tool
function get_items(tool) {
    //send tool to server
    //return all items of tool
    //temp
    if (tool == 'N/A') {
        return [];
    }

    return ['item#1', 'item#2'];
}

//all tasks to do on load
function on_load() {
    for (var i = 1; i <= 4; i++) {
        update_tools('tool'.concat(i));
    }
}

//update select bar for tools
function update_tools(id) {
    tools = get_tools();
    select = document.getElementById(id);
    clear_select(select);

    var option = document.createElement('option');
    option.value = 'N/A';
    option.text = 'N/A';
    select.appendChild(option);

    for (var i = 0; i < tools.length; i++) {
        var option = document.createElement('option');
        option.value = tools[i];
        option.text = tools[i];
        select.appendChild(option);
    }

    update_items('item'.concat(id.slice(-1)))
}

//update select bar for items
function update_items(id) {
    tool = get_select('tool'.concat(id.slice(-1)));
    items = get_items(tool);
    select = document.getElementById(id);
    clear_select(select);

    for (var i = 0; i < items.length; i++) {
        var option = document.createElement('option');
        option.value = items[i];
        option.text = items[i];
        select.appendChild(option);
    }
}

//get current selected option
function get_select(id) {
    select = document.getElementById(id);
    return select.options[select.selectedIndex].value;
}

//clear select list options
function clear_select(select) {
    for (var i = select.options.length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
}

//get entered date
function get_date(id) {
    date = document.getElementById(id);
    return date.value;
}

function test() {
    start = get_date('start');
    end = get_date('end');
    s_date = new Date(start);
    e_date = new Date(end);

    if (start.length <= 0 && end.length <= 0) {
        alert('Please enter valid dates.');
        return;
    }

    if (s_date > e_date) {
        alert('Please ensure the end is after the start.');
        return;
    }

    var items = [];

    for (var i = 1; i <= 4; i++) {
        tool_str = get_select('tool'.concat(i));

        if (tool_str != 'N/A') {
            item_str = get_select('item'.concat(i));
            var item = {tool: tool_str, item: item_str};
            items.push(item);
        }
    }

    if (items.length == 0) {
        alert('Please select at least one tool and item.');
        return;
    }

    var cfg = new CFG('test', items, start, end);
    save_cfg(cfg);
}