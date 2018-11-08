/**
 * Class for work with the forms
 *
 * @param Object $form
 * @param Array $inputs
 * @return void
 */
var Form = function(form, inputs) {
    this.form = form;
    this.separator = '.';
    this.inputs = {};
    this.helperBlocks = {};
    this.fields = {};
    this.errors = {};
    this.isValid = false;
    this.rules = {
        "email": ["required", "email"],
        "password": ["required"],
    };

    this.setInputs(inputs);
};
/**
 * Looking for a pathKey along a given path, passing by itself and by the objects inside
 * if the key is inside an internal object, the path to the
 * must be separated by a dot
 *
 * @param String $pathKey
 * @return Boolean
 */
Form.prototype.isset = function (pathKey) {
    if (typeof pathKey !== "string") return false;

    var pathKeys = pathKey.split('.'),
        length = pathKeys.length,
        obj = this;

    if (length === 1) return pathKey in this;

    for (var i = 0; i < length; i++) {
        if (pathKeys[i] in obj) obj = obj[pathKeys[i]];
        else return false;
    }

    return true;
};
/**
 * Check by pathKey value is exists and is string
 *
 * @param String $pathKey
 * @return Boolean
 */
Form.prototype.strExists = function (pathKey) {
    return this.isset(pathKey) && typeof this.getByPathKey(pathKey) === "string";
};
/**
 * Add new empty obj by path, if not found exists object
 * return already exists object or create new
 *
 * @param String $path
 * @return Object
 */
Form.prototype.addPath = function(path) {
    if ( typeof path !== "string" ) return false;

    var obj = this.getByPathKey(path);
    if ( isObject(obj) ) return obj;

    var parts = path.split('.');

    obj = isObject(this[parts[0]]) ? this[parts[0]] : this[parts[0]] = {};

    for (var i = 1; i < parts.length; i++) {
        obj = isObject(obj[parts[i]]) ? obj[parts[i]] : obj[parts[i]] = {};
    }

    return obj;
};
/**
 * Set value by path
 * return false if function execute incorrect
 *
 * @param String $path
 * @param String $value
 * @return Boolean
 */
Form.prototype.saveByPath = function(path, value) {
    if ( typeof path !== "string" ) return false;

    this.addPath(path);

    if ( path.indexOf('.') === -1 ) {
        this[path] = value;
        return true;
    }

    var partPath = path.split('.'),
        key = partPath.pop();

    this.getByPathKey(partPath.join('.'))[key] = value;

    return this.isset(path);
};
/**
 * Break path and run callback for each part of path
 * return object with results callback function by parts path
 * else empty object
 * if callback return false - function stop
 *
 * @param String $path
 * @param Closure $callback
 * @return Object
 */
Form.prototype.runInParts = function(path, callback, separator = this.separator) {
    if ( typeof path !== "string" ) return {};

    var parts = path.split(separator),
        length = parts.length,
        result = {};

    for (var i = 0; i < length; i++) {
        result[parts[i]] = callback(parts[i], length);
        if ( result[parts[i]] === false ) break;
    }

    return result;
};
/**
 * Looking for a pathKey along a given path, passing by itself and by the objects inside
 * if the key is inside an internal object, the path to the pathKey must be separated by a dot
 *
 * @param String $pathKey
 * @return Object
 */
Form.prototype.getByPathKey = function (pathKey) {
    if ( !this.isset(pathKey) ) return false;

    var pathKeys = pathKey.split('.'),
        length = pathKeys.length,
        obj = this;

    if (length === 1) return this[pathKey];

    for (var i = 0; i < length; i++) {
        obj = obj[pathKeys[i]];
    }

    return obj;
};
/**
 * Find input in form by attribute `name`
 *
 * @param String $name
 * @return Object $input
 */
Form.prototype.getInputByName = function (name) {
    return this.form.find(`[name="${name}"]`);
};
/**
 * Create collection of inputs which find in the form by attribute `name`
 *
 * @param Array $name
 * @return Void
 */
Form.prototype.setInputs = function (names) {
    for (var i = 0; i < names.length; i++) {
        this.inputs[`${names[i]}`] = this.getInputByName(names[i]);
    }
};
/**
 * Return input from own collection of inputs
 *
 * @param String $name
 * @return Object $input
 */
Form.prototype.input = function (name) {
    return this.inputs[`${name}`];
};
/**
 * Create DOM-element with attributes
 * return false if function execute incorrect
 *
 * @param Object $attr
 * @return Object
 */
Form.prototype.createEl = function (tag, attr = {}) {
    if ( typeof tag !== "string" ) return false;
    if ( !isObject(attr) ) return false;

    if ( isEmpty(attr) ) attr = {};
    return $(`<${tag}/>`, attr);

    /*Without jQuery*/
    // var element = document.createElement(tag);

    // if ( isEmpty(attr) ) return element;
    //
    // var name = '',
    //     value = '';
    //
    // for (name in attr) {
    //     value = attr[name];
    //     element.setAttribute(name, value);
    // }
    //
    // return element;
};
/**
 * Create block for display info and written their in collection helperBlocks
 * return false if function execute incorrect
 *
 * @param mixed $pathKeyBlock
 * @param Object $settings
 * @return Boolean
 */
Form.prototype.createHelper = function (pathKeyBlock, settings = {}) {
    if ( !isObject(settings) ) return false;
    if ( !("tag" in settings) ) settings.tag = "div";

    if (typeof pathKeyBlock === 'string') {
        var tag = settings.tag;
        delete settings.tag;

        var block = this.createEl(tag, settings);
        this.saveByPath('helperBlocks.'+ pathKeyBlock, block);

    } else if ( Array.isArray(pathKeyBlock) ) {
        for (var i = 0; i < pathKeyBlock.length; i++) this.createHelper(pathKeyBlock[i], settings);
    }
};
/**
 * Search inside collection helperBlocks by pathKeyBlock
 * return helperBlock or false
 *
 * @param String $pathKeyBlock
 * @param Object $settings
 * @return Object
 */
Form.prototype.getHelper = function (pathKeyBlock) {
    if ( typeof pathKeyBlock !== "string" ) return false;

    return this.getByPathKey('helperBlocks.'+ pathKeyBlock);
};
/**
 * Add helperBlock in DOM
 * function looking for a pathKeyBlock inside a collection helperBlocks
 * pathKeyBlock may be string, then add one helperBlock
 * or array, then will add all listed helperBlocks
 * target is the landmark next to which the item will be added
 * target must be object or path to it in collections
 * return false if function execute incorrect
 *
 * @param mixed $pathKeyBlock
 * @param mixed $target
 * @param Sting $howAdd
 * @return Boolean
 */
Form.prototype.addHelper = function (pathKeyBlock, target, howAdd) {
    if ( typeof pathKeyBlock === "string" ) {
        var collectMethods = ["after", "before", "append", "prepend"],
            howAdd = isMatched(collectMethods, howAdd) ? howAdd : collectMethods[0],
            block = this.getHelper(pathKeyBlock);

        if ( !target ) return false;

        if ( typeof target === "string" ) {
            target = this.getByPathKey(target);
            if ( !target ) return false;

            target[howAdd](block);
            // target.parentNode.insertBefore(block, target);
            return true;

        } else if ( isObject(target) && target instanceof jQuery ) {
            target[howAdd](block);
            return true;

        } else return false;

    } else if ( Array.isArray(pathKeyBlock) ) {
        var bLength = pathKeyBlock.length;
        if ( Array.isArray(target) && target.length === bLength ) {
            for (var i = 0; i < bLength; i++) this.addHelper(pathKeyBlock[i], target[i], howAdd);

        } else if ( !Array.isArray(target) ) {
            for (var i = 0; i < bLength; i++) this.addHelper(pathKeyBlock[i], target, howAdd);

        } else return false;
    }

    return false;
};
/**
 * ifExists delete class
 * return false if function execute incorrect
 *
 * @param mixed pathKeyBlock
 * @param String $del
 * @return Boolean
 */
Form.prototype.delClass = function (pathKeyBlock, del) {
    if (typeof del !== "string") return false;
    var dels = del.split('.'),
        dLength = dels.length;

    if (typeof pathKeyBlock === 'string') {

        var block = this.getByPathKey(pathKeyBlock);
        if ( !block ) return false;

        for (var i = 0; i < dLength; i++) {
            if ( block.hasClass(dels[i]) ) block.removeClass(dels[i]);
        }

        return true;

    } else if (Array.isArray(pathKeyBlock)) {
        var bLength = pathKeyBlock.length,
            bool = false;

        for (var i = 0; i < bLength; i++) {
            bool = this.delClass(pathKeyBlock[i], del);
        }

        return bool;
    }

    return false;
};
/**
 * Set classes to Block
 * pathKeyBlock must contain the path of the keys
 * can transmit pathKeyBlock string or array
 * return false if function execute incorrect
 *
 * @param mixed $pathKeyBlock
 * @param Sting $set
 * @return Boolean
 */
Form.prototype.setClass = function (pathKeyBlock, set) {
    if ( typeof set !== "string") return false;

    var sets = set.split('.'),
        sLength = sets.length;

    if (typeof pathKeyBlock === 'string') {
        var block = this.getByPathKey(pathKeyBlock);
        if ( !block ) return false;

        for (var i = 0; i < sLength; i++) {
            if ( !block.hasClass(sets[i]) ) block.addClass(sets[i]);
        }

        return true;

    } else if (Array.isArray(pathKeyBlock)) {
        var bLength = pathKeyBlock.length,
            bool = false;

        for (var i = 0; i < bLength; i++) {
            bool = this.setClass(pathKeyBlock[i], set);
        }

        return bool;
    }

    return false;
};
/**
 * Changes the unnecessary class to the one you need
 * pathKeyBlock must contain the path of the keys
 * can transmit pathKeyBlock string or array
 * return false if function execute incorrect
 *
 * @param mixed $pathKeyBlock
 * @param Sting $oldClass
 * @param Sting $newClass
 * @return Boolean
 */
Form.prototype.replaceClass = function (pathKeyBlock, oldClass, newClass) {
    if ( typeof oldClass !== "string" || typeof newClass !== "string" ) return false;

    return this.delClass(pathKeyBlock, oldClass) && this.setClass(pathKeyBlock, newClass);
};
/**
 * Highlight element
 * default: settings {property: "border.text", type: "success"}
 *return false, if fails
 *
 * @param mixed $pathKeyBlock
 * @param Object $settings
 * @return Boolean
 */
Form.prototype.highlight = function (pathKeyBlock, settings = {}) {
    if ( !isObject(settings) ) return false;

    if ( typeof pathKeyBlock === "string") {
        var properties = 'border.text',
            types = 'success',
            set = [];

        if ( !isEmpty(settings) ) {
            this.temp = settings;

            properties = this.strExists('temp.property') ? this.temp['property'] : properties;
            types = this.strExists('temp.type') ? this.temp['type'] : types;

            delete this.temp;
        }

        if ( !this.clearHighlight(pathKeyBlock, properties) ) return false;

        properties = properties.split(this.separator);
        types = types.split(this.separator);
        var type = types[0];

        for (var i = 0; i < properties.length; i++) {
            if ( properties.length === types.length ) type = types[i];
            else if ( types.length !== 1 ) return false;

            set.push(properties[i] +"-"+ type);
        }

        return this.setClass(pathKeyBlock, set.join(this.separator));

    } else if ( Array.isArray(pathKeyBlock) ) {
        for (var i = 0; i < pathKeyBlock.length; i++) this.highlight(pathKeyBlock[i], settings);
    }

    return false;
};
/**
 * Removes highlighting from form element
 *
 * @param mixed $pathKeyBlock
 * @param String properties
 * @return Boolean
 */
Form.prototype.clearHighlight = function (pathKeyBlock, properties = 'border') {
    if ( typeof properties !== "string" ) return false;

    var collection = [
        'primary', 'secondary', 'success', 'danger', 'warning', 'info',
        'light', 'dark', 'muted', 'white'
    ];

    var newCollection = [];
    for (var i = 0; i < collection.length; i++) {
        this.runInParts(properties, function (property) {
            newCollection.push(property + "-" + collection[i]);
        });
    }

    return this.delClass(pathKeyBlock, newCollection.join(this.separator));
};
/**
 * Remove extra spaces and execute trim
 * if it isn't string, return value param
 *
 * @param string $str
 * @return string
 */
Form.prototype.removeExtraSpaces = function (str) {
    if ( typeof str !== "string" ) return str;

    str = str.trim();
    var extraSpaces = str.match(/\s{2,}/g);

    if ( extraSpaces === null ) return str;

    for (var i = 0; i < extraSpaces.length; i++) str = str.replace(extraSpaces[i], ' ');

    return str;
};
/**
 * Setting rules for validation
 *
 * @param Object $rules {name: [rule1, rule2, ...]}
 * @return void
 */
Form.prototype.setRules = function(rules) {
    this.rules = rules;
};
/**
 * Checked string on empty
 *
 * @param String $value
 * @return Boolean
 */
Form.prototype.isFilled = function(value) {
    if ( isObject(value) ) return value.checked;
    return !(value === "" || value === null || typeof value === "undefined");
};
/**
 * Checks string on email
 *
 * @param String $value
 * @return Boolean
 */
Form.prototype.isEmail = function(value) {
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        email = value.match(pattern);

    return email !== null;
};
/**
 * Checks string on min length
 *
 * @param Sting $value
 * @param Number $min
 * @return Boolean
 */
Form.prototype.isMatchLengthMin = function(value, min) {
    // if ( isNum(value) ) return +value >= +min;
    if ( typeof value === "string" ) return value.length >= +min;
};
/**
 * Checks string on max length
 *
 * @param string $value
 * @param Number $max
 * @return Boolean
 */
Form.prototype.isMatchLengthMax = function(value, max) {
    // if ( isNum(value) ) return +value <= +max;
    if ( typeof value === "string" ) return value.length <= +max;
};
/**
 * Checks string on filled with letters only
 *
 * @param string $value
 * @return Boolean
 */
Form.prototype.isAlpha = function(value) {
    if ( typeof value !== "string" ) return false;
    return value.search(/^[a-zа-я]+$/i) !== -1;
};
/**
 * Checked data of input given from the Form
 *
 * @param mixed $value
 * @param Array $rules
 * @return Array $error
 */
Form.prototype.checkInput = function(value, rules) {
    //    "test@mail.ru", {"required": true, "email": true, "length": {min: 2, max: 6} ]
    var error = [];

    if ( isObject(value) && !!rules.required ) {
        var checked = false;
        for (var i = 0; i < value.length; i++) {
            checked = value[i].checked ? true : checked;
        }
        if ( !checked ) error.push("Нужно выбрать "+ value[0].name);
        return error;
    }

    if ( !!rules.required && !this.isFilled(value) ) {
        error.push("Поле обязательно");

    } else if ( !!rules.email && !this.isEmail(value) ) {
        error.push("Поле содержит не корректный E-mail");

    } else if ( !!rules.length && !!rules.length.min && !this.isMatchLengthMin(value, rules.length.min) ) {
        error.push("Поле должно содержать не менее "+ rules.length.min +" символов");

    } else if ( !!rules.length && !!rules.length.max && !this.isMatchLengthMax(value, rules.length.max) ) {
        error.push("Поле должно содержать не более "+ rules.length.max +" символов");

    } else if ( !!rules.alpha && !this.isAlpha(value) ) {
        error.push("Поле должно содержать только буквы, без пробелов");

    } else if ( !!rules.confirmed && value !== this.input(rules.confirmed).val() ) {
        error.push("Поле должно совпадать с "+ rules.confirmed);
    }

    return error;
};
/**
 * Checked all data given from the Form
 *
 * @param Object $fields {name: value}
 * @return Boolean $isValid
 */
Form.prototype.validator = function(fields) {
    this.fields = fields;
    this.errors = {};
    this.isValid = true;
    var obj = this;

    $.each(this.fields, function(key, value) {
        if ( !(key in obj.rules) ) {
            return true; // continue
        }

        var rules = obj.rules[key],
            error = obj.checkInput(value, rules);

        if (error.length === 0) {
            return true; // continue
        }

        obj.errors[key] = error;
        obj.isValid = false;
    });

    return this.isValid;
};


// Helpers
function isMatched(arr, desired) {
    if ( typeof desired === "undefined" ) return false;

    for (var i = 0; i < arr.length; i++) {
        if (desired === arr[i]) return true;
    }

    return false;
}

function isEmpty(obj) {
    if ( typeof obj !== "object" || obj === null ) return "Error: incorrect type";
    if ( Array.isArray(obj) ) return !(obj.length > 0);
    return JSON.stringify(obj) == "{}";
}

function isObject(val) {
    if ( typeof val !== "object") return false;
    return !( val === null || Array.isArray(val) );
}

function isNum(value) {
    if ( typeof value === "string" ) return value.search(/^-?[0-9]+((,|\.)?[0-9]+)?$/) !== -1;
    return !isNaN(value);
}