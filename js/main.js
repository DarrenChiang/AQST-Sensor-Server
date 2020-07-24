//loaded list of cfgs
var cfgs = {};

//get all tools from server
function get_tools() {
    //temp
    return ['tool#1', 'tool#2', 'tool#3', 'tool#4'];
}

function get_chambers(tool) {
    //temp
    if (tool == 'N/A') {
        return [];
    }

    return ['chamber1', 'chamber2', 'chamber3'];
}

//get all items for tool
function get_items(tool, chamber) {
    //send tool to server
    //return all items of tool
    //temp
    if (tool == 'N/A' || chamber == 'N/A') {
        return [];
    }

    return ['item#1', 'item#2'];
}

//all tasks to do on load
function on_load() {
    load_cfgs();

    for (var i = 1; i <= 4; i++) {
        update_tools('tool'.concat(i));
    }
}

//update select bar for tools
function update_tools(id) {
    var tools = get_tools();
    var select = document.getElementById(id);
    clear_select(select);

    var option = document.createElement('option');
    option.value = 'N/A';
    option.text = 'N/A';
    select.appendChild(option);

    for (var i = 0; i < tools.length; i++) {
        option = document.createElement('option');
        option.value = tools[i];
        option.text = tools[i];
        select.appendChild(option);
    }

    update_chambers('chamber'.concat(id.slice(-1)));
}

//update select bar for chambers
function update_chambers(id) {
    var tool = get_select('tool'.concat(id.slice(-1)));
    var chambers = get_chambers(tool);
    var select = document.getElementById(id);
    clear_select(select);

    for (var i = 0; i < chambers.length; i++) {
        var option = document.createElement('option');
        option.value = chambers[i];
        option.text = chambers[i];
        select.appendChild(option);
    }

    update_items('item'.concat(id.slice(-1)));
}

//update select bar for items
function update_items(id) {
    var tool = get_select('tool'.concat(id.slice(-1)));
    var chamber = get_select('chamber'.concat(id.slice(-1)));
    var items = get_items(tool, chamber);
    var select = document.getElementById(id);
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
    var select = document.getElementById(id);

    if (select.options.length > 0) {
        return select.options[select.selectedIndex].value;
    }
    
    return 'N/A';
}

//clear select list options
function clear_select(select) {
    for (var i = select.options.length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
}

//get date
function get_date(id) {
    var element = document.getElementById(id);
    return element.value;
}

function get_checkbox(id) {
    var element = document.getElementById(id);
    return element.checked;
}

function duration_is_valid(start, end) {
    var s_date = new Date(start);
    var e_date = new Date(end);

    if (start.length <= 0 && end.length <= 0) {
        alert('Please enter valid dates.');
        return false;
    }

    if (s_date > e_date) {
        alert('Please ensure the end is after the start.');
        return false;
    }

    return true;
}

function load_cfgs() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cfgs = JSON.parse(this.responseText);
            update_cfg_select();
        }
    };
    xhttp.open('GET', 'php/get_cfg.php', false);
    xhttp.send();
}

function update_cfg_select() {
    var select = document.getElementById('cfgselect');
    clear_select(select)

    for (var name in cfgs) {
        var option = document.createElement('option');
        option.value = name;
        option.text = name;
        select.appendChild(option);
    }
}

function set_current_cfg() {
    var name = get_select('cfgselect');
    var setting = cfgs[name];

    for (var i = 1; i <= 4; i++) {
        var tool = 'tool'.concat(i);
        var chamber = 'chamber'.concat(i);
        var item = 'item'.concat(i);
        var avg = 'avg'.concat(i);
        var max = 'max'.concat(i);
        var min = 'min'.concat(i);
    }
}

function save_cfg() {
    var name = "";

    do {
        name = window.prompt('Enter a name: ');

        if (name == 'null') {
            return;
        } else if (name.length > 0) {
            if (cfgs[name]) {
                alert('Name is already in use.');
                name = null;
            }
        }      
    } while (name == null || name.length < 1);  

    var settings = [];

    for (var i = 1; i <= 4; i++) {
        var select = {};
        var tool = 'tool'.concat(i);
        select[tool] = get_select(tool);
        var chamber = 'chamber'.concat(i);
        select[chamber] = get_select(chamber);
        var item = 'item'.concat(i);
        select[item] = get_select(item);
        var avg = 'avg'.concat(i);
        select[avg] = get_checkbox(avg);
        var max = 'max'.concat(i);
        select[max] = get_checkbox(max);
        var min = 'min'.concat(i);
        select[min] = get_checkbox(min);
        settings.push(select);
    }

    var json_str = JSON.stringify(settings);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cfgs[name] = settings;
            update_cfg_select();
        }
    };
    xhttp.open('POST', 'php/add_cfg.php', false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('name='.concat(name).concat('&settings='.concat(json_str)));
}

function print_cfgs() {
    var key = window.prompt('Enter cfg name: ');
    alert(JSON.stringify(cfgs[key]));
    document.getElementById('error').textContent = JSON.stringify(cfgs);
}