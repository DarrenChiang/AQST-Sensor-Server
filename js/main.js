var cfgs = []

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

    update_chambers('chamber'.concat(id.slice(-1)));
}

//update select bar for chambers
function update_chambers(id) {
    tool = get_select('tool'.concat(id.slice(-1)));
    chambers = get_chambers(tool);
    select = document.getElementById(id);
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
    tool = get_select('tool'.concat(id.slice(-1)));
    chamber = get_select('chamber'.concat(id.slice(-1)));
    items = get_items(tool, chamber);
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
    element = document.getElementById(id);
    return element.value;
}

function get_checkbox(id) {
    element = document.getElementById(id);
    return element.checked;
}

function duration_is_valid(start, end) {
    s_date = new Date(start);
    e_date = new Date(end);

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
            /*document.getElementById('error').innerHTML = xhttp.responseText;*/
        }
    }
    xhttp.open('GET', 'php/get_cfg.php', false);
    xhttp.send();
    cfgs = JSON.parse(xhttp.responseText);
    return cfgs;
}

function save_cfg() {
    do {
        name = window.prompt('Enter a name: ');

        if (name == "null") {
            return;
        } else if (name.length > 0) {
            for (var i = 0; i < cfgs.length; i++) {
                if (name == cfgs[i]['name']) {
                    alert('Name is already in use.');
                    name = "";
                    break;
                }
            }
        }      
    } while (name.length < 1);
    

    var settings = [];

    for (var i = 1; i <= 4; i++) {
        var select = {};
        tool = 'tool'.concat(i);
        select[tool] = get_select(tool);
        chamber = 'chamber'.concat(i);
        select[chamber] = get_select(chamber);
        item = 'item'.concat(i);
        select[item] = get_select(item);
        avg = 'avg'.concat(i);
        select[avg] = get_checkbox(avg);
        max = 'max'.concat(i);
        select[max] = get_checkbox(max);
        min = 'min'.concat(i);
        select[min] = get_checkbox(min);
        settings.push(select);
    }

    var json_str = JSON.stringify(settings);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('error').innerHTML = xhttp.responseText;
        }
    }
    xhttp.open('POST', 'php/add_cfg.php', false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('name='.concat(name).concat('&settings='.concat(json_str)));
    load_cfgs();
}