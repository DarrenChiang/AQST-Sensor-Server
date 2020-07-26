function cfg(name, items, start, end) {
    this.name = name;
    this.items = items;
    this.start = start;
    this.end = end;
}

function save_cfg(cfg) {
    var json_str = JSON.stringify(cfg)
    //send this string to the server???
    //server must save this as json
}