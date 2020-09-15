const NA = 'N/A'; //default value for no selection.
var cfgs = {}; //saved dictionary of cfgs on client side.
var sensors = {}; //saved dictionary of sensors (Tool > Chamber > Item) on client side.
var canvas = null; //defining global variable to carry canvas element.

/**
 * Get available tools.
 * 
 * @return array of available tools
 */
function get_tools() {
    //temporary dummy
    return ['tool#1', 'tool#2', 'tool#3', 'tool#4'];
}

/**
 * Get available chambers from specified tool.
 * Hierarchy: Tool > Chamber
 * Returns an empty list if any parameter is NA.
 * 
 * @param {tool} tool specification
 * @return array of available chambers
 */
function get_chambers(tool) {   
    if (tool == NA) {
        return [];
    }

    //temporary dummy
    return ['chamber1', 'chamber2', 'chamber3'];
}

/**
 * Get available sensors from specified tool and chamber.
 * Hierarchy: Tool > Chamber > Sensor
 * Returns an empty list if any parameter is NA.
 * 
 * @param {tool} tool specification
 * @param {chamber} chamber specification
 * @return array of available items
 */
function get_sensors(tool, chamber, sensor) {
    if (tool == NA || chamber == NA) {
        return [];
    }

    //temporary dummy
    return ['sensor#1', 'sensor#2'];
}

/**
 * Get available items from specified tool,chamber, and sensor.
 * Hierarchy: Tool > Chamber > Sensor > Item
 * Returns an empty list if any parameter is NA.
 * 
 * @param {tool} tool specification
 * @param {chamber} chamber specification
 * @param {sensor} sensor specification
 * @return array of available items
 */
function get_items(tool, chamber, sensor) {
    if (tool == NA || chamber == NA) {
        return [];
    }

    //temporary dummy
    return ['item#1', 'item#2'];
}

/**
 * Executes when page first loads.
 * Retrieves all cfgs from the server.
 * Updates all cfg select bars.
 */
function on_load() {
    load_canvas();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var load_info = JSON.parse(this.responseText);
            cfgs = load_info['cfgs'];
            current_cfg = NA;
            //sensors = load_info['sensors'];
            update_cfg_select();
            reset_current_cfg();
        }
    };
    xhttp.open('GET', 'php/on_load.php', true);
    xhttp.send();
}

function load_canvas() {
    canvas = document.getElementById('chart');
    var chart = new Chart(canvas, {
        type: 'scatter'
    });
}

/**
 * Updates all cfg selects and checkboxes to current cfg.
 */
function reset_current_cfg() {
    for (var i = 1; i <= 4; i++) {
        update_tool_select('tool'.concat(i));
        update_chamber_select('chamber'.concat(i));
        update_sensor_select('sensor'.concat(i));
        update_item_select('item'.concat(i));
        enable_cfg_checkboxes(i);
    }

    document.getElementById('cfgselect').value = NA;
    document.getElementById('delete').disabled = true;
}

/**
 * Executes when tool select is clicked.
 * Updates chamber and item select respectively.
 * Enables or disables respective checkboxes.
 * Sets cfg select to NA.
 * 
 * @param {id} id of element defined in html
 */
function tool_select_onchange(id) {
    update_chamber_select('chamber'.concat(id.slice(-1)));
    update_sensor_select('sensor'.concat(id.slice(-1)));
    update_item_select('item'.concat(id.slice(-1)));
    enable_cfg_checkboxes(id.slice(-1));
    document.getElementById('cfgselect').value = NA;
}

/**
 * Executes when chamber select is clicked.
 * Updates item select.
 * Enables or disables respective checkboxes.
 * Sets cfg select to NA.
 * 
 * @param {id} id of element defined in html
 */
function chamber_select_onchange(id) {
    update_item_select('item'.concat(id.slice(-1)));
    update_sensor_select('sensor'.concat(id.slice(-1)));
    enable_cfg_checkboxes(id.slice(-1));
    document.getElementById('cfgselect').value = NA;
}

/**
 * Executes when chamber select is clicked.
 * Updates item select.
 * Enables or disables respective checkboxes.
 * Sets cfg select to NA.
 * 
 * @param {id} id of element defined in html
 */
function sensor_select_onchange(id) {
    update_item_select('item'.concat(id.slice(-1)));
    enable_cfg_checkboxes(id.slice(-1));
    document.getElementById('cfgselect').value = NA;
}

/**
 * Executes when item select is clicked.
 * Enables or disables respective checkboxes.
 * Sets cfg select to NA.
 * 
 * @param {id} id of element defined in html
 */
function item_select_onchange(id) {
    enable_cfg_checkboxes(id.slice(-1));
    document.getElementById('cfgselect').value = NA;
}

/**
 * Uncheck the checkboxes of a row.
 * 
 * @param {row} the row of the checkboxes (corresponds with the select ids)
 */
function uncheck_cfg_checkboxes(row) {
    document.getElementById('avg'.concat(row)).checked = false;
    document.getElementById('max'.concat(row)).checked = false;
    document.getElementById('min'.concat(row)).checked = false;
}

/**
 * Enable the avg, max, and min checkboxes if the select values are valid.
 * Returns if the checkboxes are enabled or not.
 * 
 * @param {row} the row of the checkboxes (corresponds with the select ids)
 * @return whether checkboxes of row are enabled or not
 */
function enable_cfg_checkboxes(row) {
    var tool = document.getElementById('tool'.concat(row)).value == NA;
    var chamber = document.getElementById('chamber'.concat(row)).value == NA;
    var item = document.getElementById('item'.concat(row)).value == NA;
    var disable = tool || chamber || item; 
    document.getElementById('avg'.concat(row)).disabled = disable;
    document.getElementById('max'.concat(row)).disabled = disable;
    document.getElementById('min'.concat(row)).disabled = disable;

    if (disable) {
        uncheck_cfg_checkboxes(row);
    }

    return !disable;
}

/**
 * Updates the tool select element options.
 * 
 * @param {id} id of element defined in html
 * @param {value} optional default value to set for select
 */
function update_tool_select(id, value = null) {
    var tools = get_tools();
    var select = document.getElementById(id);
    clear_select(select, true);

    for (var i = 0; i < tools.length; i++) {
        var option = document.createElement('option');
        option.value = tools[i];
        option.text = tools[i];
        select.appendChild(option);
    }

    if (value != null && value in tools) {
        select.value = value;
    }
}

/**
 * Updates the chamber select element options.
 * 
 * @param {id} id of element defined in html
 * @param {value} optional default value to set for select
 */
function update_chamber_select(id, value = null) {
    var tool = get_select('tool'.concat(id.slice(-1)));
    var chambers = get_chambers(tool);
    var select = document.getElementById(id);
    clear_select(select, true);

    for (var i = 0; i < chambers.length; i++) {
        var option = document.createElement('option');
        option.value = chambers[i];
        option.text = chambers[i];
        select.appendChild(option);
    }

    if (value != null && value in chambers) {
        select.value = value;
    }
}

/**
 * Updates the sensor select element options.
 * 
 * @param {id} id of element defined in html
 * @param {value} optional default value to set for select
 */
function update_sensor_select(id, value = null) {
    var tool = get_select('tool'.concat(id.slice(-1)));
    var chamber = get_select('chamber'.concat(id.slice(-1)));
    var sensors = get_sensors(tool, chamber);
    var select = document.getElementById(id);
    clear_select(select, true);

    for (var i = 0; i < sensors.length; i++) {
        var option = document.createElement('option');
        option.value = sensors[i];
        option.text = sensors[i];
        select.appendChild(option);
    }


    if (value != null && value in items) {
        select.value = value;
    }
}

/**
 * Updates the item select element options.
 * 
 * @param {id} id of element defined in html
 * @param {value} optional default value to set for select
 */
function update_item_select(id, value = null) {
    var tool = get_select('tool'.concat(id.slice(-1)));
    var chamber = get_select('chamber'.concat(id.slice(-1)));
    var sensor = get_select('sensor'.concat(id.slice(-1)));
    var items = get_items(tool, chamber, sensor);
    var select = document.getElementById(id);
    clear_select(select, true);

    for (var i = 0; i < items.length; i++) {
        var option = document.createElement('option');
        option.value = items[i];
        option.text = items[i];
        select.appendChild(option);
    }


    if (value != null && value in items) {
        select.value = value;
    }
}

/**
 * Get current selected value of a selection.
 * If select has no options, return N/A.
 * Note: index and text of select option not currently used.
 * 
 * @param {id} id of element defined in html
 * @return return value of selection or N/A
 */
function get_select(id) {
    var select = document.getElementById(id);

    if (select.options.length > 0) {
        return select.value;
    }
    
    return NA;
}

/**
 * Clear all options of select element.
 *
 * @param {select} select element in html
 * @param {na} set na to true to leave N/A as an option
 */
function clear_select(select, na = false) {
    for (var i = select.options.length - 1; i >= 0; i--) {
        select.options[i] = null;
    }

    if (na) {
        var option = document.createElement('option');
        option.value = NA;
        option.text = NA;
        select.appendChild(option);
    }
}

/**
 * Get current selected date of a datetime entry
 * 
 * @param {id} id of element defined in html
 * return string value of datetime entry
 */
function get_date(id) {
    var element = document.getElementById(id);
    return element.value;
}

/**
 * Return whether a checkbox is checked.
 * 
 * @param {id} id of element defined in html
 * @return whether element is checked
 */
function get_checkbox(id) {
    var element = document.getElementById(id);
    return element.checked;
}

/**
 * Returns true if both datetimes are valid and chronological.
 * 
 * @param {start} the starting datetime of the duration
 * @param {end} the ending datetime of the duration
 * @return if start is before end
 */
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

/**
 * Updates the cfg select element options based off the
 * client-loaded cfg global variable.
 * Note: Use after requesting updated cfgs from server.
 */
function update_cfg_select() {
    var select = document.getElementById('cfgselect');
    clear_select(select, true)

    for (var name in cfgs) {
        var option = document.createElement('option');
        option.value = name;
        option.text = name;
        select.appendChild(option);
    }

    cfg_select_onchange();
}

/**
 * Executes when cfg select is clicked.
 * Sets all selects and checkboxes to match the cfg in the cfg select.
 * Does nothing if cfg select value is N/A.
 */
function cfg_select_onchange() {
    //check cfg validity first
    var name = get_select('cfgselect');  

    if (name == NA) {
        reset_current_cfg();
        return;
    }

    var setting = cfgs[name];

    for (var i = 1; i <= 4; i++) {
        var row = setting[i - 1];
        var tool = 'tool'.concat(i);
        document.getElementById(tool).value = row[tool];
        var chamber = 'chamber'.concat(i);
        update_chamber_select(chamber, row[chamber]);
        var sensor = 'sensor'.concat(i);
        update_sensor_select(sensor, row[sensor]);
        var item = 'item'.concat(i);
        update_item_select(item, row[item]);

        if (enable_cfg_checkboxes(i)) {
            var avg = 'avg'.concat(i);
            document.getElementById(avg).checked = row[avg];
            var max = 'max'.concat(i);
            document.getElementById(max).checked = row[max];
            var min = 'min'.concat(i);
            document.getElementById(min).checked = row[min];
        } else {
            uncheck_cfg_checkboxes(i);
        }     
    }

    document.getElementById('delete').disabled = false;
}

/**
 * Updates the current cfg selections to the server.
 * Uses AJAX to send the name and settings using the POST method.
 */
function save_cfg() {
    var name = '';

    do {
        name = window.prompt('Enter a name: ');

        if (name == 'null') {
            return;
        } else if (name.length > 0) {
            if (cfgs[name]) {
                alert('Name is already in use.');
                name = null;
            } else if (name == 'N/A') {
                alert('Name cannot be "N/A"');
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
        var sensor = 'sensor'.concat(i);
        select[sensor] = get_select(sensor);
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

function delete_cfg() {
    var cfg = get_select('cfgselect');

    if (!confirm('Are you sure you want to delete '.concat(cfg).concat('?'))) {
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            delete cfgs[cfg];
            update_cfg_select();
        }
    }
    xhttp.open('POST', 'php/delete_cfg.php', true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('cfg='.concat(cfg));
}

function set_today() {
    var start = document.getElementById('start');
    var end = document.getElementById('end');
    var prior = new Date();
    prior.setHours(0);
    prior.setMinutes(0);
    prior.setSeconds(0);
    start.value = datetime_str(prior);
    end.value = datetime_str(new Date());
}

function set_this_week() {
    var start = document.getElementById('start');
    var end = document.getElementById('end');
    var prior = new Date();
    var date = prior.getDay() ? prior.getDate() - prior.getDay() + 1 : prior.getDate() - 6;
    prior.setDate(date);
    prior.setHours(0);
    prior.setMinutes(0);
    prior.setSeconds(0);
    start.value = datetime_str(prior);
    end.value = datetime_str(new Date());
}

function set_this_month() {
    var start = document.getElementById('start');
    var end = document.getElementById('end');
    var prior = new Date();
    prior.setDate(1);
    prior.setHours(0);
    prior.setMinutes(0);
    prior.setSeconds(0);
    start.value = datetime_str(prior);
    end.value = datetime_str(new Date());
}

/**
 * Returns a string in the datetime entry format from a Date object.
 * 
 * @param {datetime} Javascript Date object
 * @return string in datetime entry format
 */
function datetime_str(datetime) {
    str = String(datetime.getFullYear());
    str += '-' + String('0' + datetime.getMonth()).slice(-2);
    str += '-' + String('0' + datetime.getDate()).slice(-2);
    str += 'T' + String('0' + datetime.getHours()).slice(-2);
    str += ':' + String('0' + datetime.getMinutes()).slice(-2);
    str += ':' + String('0' + datetime.getSeconds()).slice(-2);
    return str;
}