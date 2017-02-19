/* Generated Sun Feb 19 15:04:17 CET 2017 */
/*
* Copyright ©2017. dhtmlchess.com. All Rights Reserved.
* This is a commercial software. See dhtmlchess.com for licensing options.
*
* You are free to use/try this software for 30 days without paying any fees.
*
* IN NO EVENT SHALL DHTML CHESS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL,
* OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND
* ITS DOCUMENTATION, EVEN IF DHTML CHESS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
* DHTML CHESS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
* THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
* THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED "AS IS".
* DHTML CHESS HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
*
*/
/* ../ludojs/src/../mootools/MooTools-Core-1.6.0.js */
/* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2016 [Valerio Proietti](http://mad4milk.net/).*/
/*!
 Web Build: http://mootools.net/core/builder/e7289bd0058c6790cb2b769822285f97
 */
/*
 ---

 name: Core

 description: The heart of MooTools.

 license: MIT-style license.

 copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).

 authors: The MooTools production team (http://mootools.net/developers/)

 inspiration:
 - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
 - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

 provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

 ...
 */
/*! MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).*/
(function(){

	this.MooTools = {
		version: '1.6.0',
		build: '529422872adfff401b901b8b6c7ca5114ee95e2b'
	};

// typeOf, instanceOf

	var typeOf = this.typeOf = function(item){
		if (item == null) return 'null';
		if (item.$family != null) return item.$family();

		if (item.nodeName){
			if (item.nodeType == 1) return 'element';
			if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
		} else if (typeof item.length == 'number'){
			if ('callee' in item) return 'arguments';
			if ('item' in item) return 'collection';
		}

		return typeof item;
	};

	var instanceOf = this.instanceOf = function(item, object){
		if (item == null) return false;
		var constructor = item.$constructor || item.constructor;
		while (constructor){
			if (constructor === object) return true;
			constructor = constructor.parent;
		}
		/*<ltIE8>*/
		if (!item.hasOwnProperty) return false;
		/*</ltIE8>*/
		return item instanceof object;
	};

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	/*<ltIE8>*/
	var enumerables = true;
	for (var i in {toString: 1}) enumerables = null;
	if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];
	function forEachObjectEnumberableKey(object, fn, bind){
		if (enumerables) for (var i = enumerables.length; i--;){
			var k = enumerables[i];
			// signature has key-value, so overloadSetter can directly pass the
			// method function, without swapping arguments.
			if (hasOwnProperty.call(object, k)) fn.call(bind, k, object[k]);
		}
	}
	/*</ltIE8>*/

// Function overloading

	var Function = this.Function;

	Function.prototype.overloadSetter = function(usePlural){
		var self = this;
		return function(a, b){
			if (a == null) return this;
			if (usePlural || typeof a != 'string'){
				for (var k in a) self.call(this, k, a[k]);
				/*<ltIE8>*/
				forEachObjectEnumberableKey(a, self, this);
				/*</ltIE8>*/
			} else {
				self.call(this, a, b);
			}
			return this;
		};
	};

	Function.prototype.overloadGetter = function(usePlural){
		var self = this;
		return function(a){
			var args, result;
			if (typeof a != 'string') args = a;
			else if (arguments.length > 1) args = arguments;
			else if (usePlural) args = [a];
			if (args){
				result = {};
				for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
			} else {
				result = self.call(this, a);
			}
			return result;
		};
	};

	Function.prototype.extend = function(key, value){
		this[key] = value;
	}.overloadSetter();

	Function.prototype.implement = function(key, value){
		this.prototype[key] = value;
	}.overloadSetter();

// From

	var slice = Array.prototype.slice;

	Array.convert = function(item){
		if (item == null) return [];
		return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
	};

	Function.convert = function(item){
		return (typeOf(item) == 'function') ? item : function(){
			return item;
		};
	};


	Number.convert = function(item){
		var number = parseFloat(item);
		return isFinite(number) ? number : null;
	};

	String.convert = function(item){
		return item + '';
	};



	Function.from = Function.convert;
	Number.from = Number.convert;
	String.from = String.convert;

// hide, protect

	Function.implement({

		hide: function(){
			this.$hidden = true;
			return this;
		},

		protect: function(){
			this.$protected = true;
			return this;
		}

	});

// Type

	var Type = this.Type = function(name, object){
		if (name){
			var lower = name.toLowerCase();
			var typeCheck = function(item){
				return (typeOf(item) == lower);
			};

			Type['is' + name] = typeCheck;
			if (object != null){
				object.prototype.$family = (function(){
					return lower;
				}).hide();

			}
		}

		if (object == null) return null;

		object.extend(this);
		object.$constructor = Type;
		object.prototype.$constructor = object;

		return object;
	};

	var toString = Object.prototype.toString;

	Type.isEnumerable = function(item){
		return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
	};

	var hooks = {};

	var hooksOf = function(object){
		var type = typeOf(object.prototype);
		return hooks[type] || (hooks[type] = []);
	};

	var implement = function(name, method){
		if (method && method.$hidden) return;

		var hooks = hooksOf(this);

		for (var i = 0; i < hooks.length; i++){
			var hook = hooks[i];
			if (typeOf(hook) == 'type') implement.call(hook, name, method);
			else hook.call(this, name, method);
		}

		var previous = this.prototype[name];
		if (previous == null || !previous.$protected) this.prototype[name] = method;

		if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
			return method.apply(item, slice.call(arguments, 1));
		});
	};

	var extend = function(name, method){
		if (method && method.$hidden) return;
		var previous = this[name];
		if (previous == null || !previous.$protected) this[name] = method;
	};

	Type.implement({

		implement: implement.overloadSetter(),

		extend: extend.overloadSetter(),

		alias: function(name, existing){
			implement.call(this, name, this.prototype[existing]);
		}.overloadSetter(),

		mirror: function(hook){
			hooksOf(this).push(hook);
			return this;
		}

	});

	new Type('Type', Type);

// Default Types

	var force = function(name, object, methods){
		var isType = (object != Object),
			prototype = object.prototype;

		if (isType) object = new Type(name, object);

		for (var i = 0, l = methods.length; i < l; i++){
			var key = methods[i],
				generic = object[key],
				proto = prototype[key];

			if (generic) generic.protect();
			if (isType && proto) object.implement(key, proto.protect());
		}

		if (isType){
			var methodsEnumerable = prototype.propertyIsEnumerable(methods[0]);
			object.forEachMethod = function(fn){
				if (!methodsEnumerable) for (var i = 0, l = methods.length; i < l; i++){
					fn.call(prototype, prototype[methods[i]], methods[i]);
				}
				for (var key in prototype) fn.call(prototype, prototype[key], key);
			};
		}

		return force;
	};

	force('String', String, [
		'charAt', 'charCodeAt', 'concat', 'contains', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
		'slice', 'split', 'substr', 'substring', 'trim', 'toLowerCase', 'toUpperCase'
	])('Array', Array, [
		'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
		'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight', 'contains'
	])('Number', Number, [
		'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
	])('Function', Function, [
		'apply', 'call', 'bind'
	])('RegExp', RegExp, [
		'exec', 'test'
	])('Object', Object, [
		'create', 'defineProperty', 'defineProperties', 'keys',
		'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
		'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
	])('Date', Date, ['now']);

	Object.extend = extend.overloadSetter();

	Date.extend('now', function(){
		return +(new Date);
	});

	new Type('Boolean', Boolean);

// fixes NaN returning as Number

	Number.prototype.$family = function(){
		return isFinite(this) ? 'number' : 'null';
	}.hide();

// Number.random

	Number.extend('random', function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	});

// forEach, each, keys


	Object.extend({

		keys: function(object){
			var keys = [];
			for (var k in object){
				if (hasOwnProperty.call(object, k)) keys.push(k);
			}
			/*<ltIE8>*/
			forEachObjectEnumberableKey(object, function(k){
				keys.push(k);
			});
			/*</ltIE8>*/
			return keys;
		},

		forEach: function(object, fn, bind){
			Object.keys(object).forEach(function(key){
				fn.call(bind, object[key], key, object);
			});
		}

	});

	Object.each = Object.forEach;


// Array & Object cloning, Object merging and appending

	var cloneOf = function(item){
		switch (typeOf(item)){
			case 'array': return item.clone();
			case 'object': return Object.clone(item);
			default: return item;
		}
	};

	Array.implement('clone', function(){
		var i = this.length, clone = new Array(i);
		while (i--) clone[i] = cloneOf(this[i]);
		return clone;
	});

	var mergeOne = function(source, key, current){
		switch (typeOf(current)){
			case 'object':
				if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
				else source[key] = Object.clone(current);
				break;
			case 'array': source[key] = current.clone(); break;
			default: source[key] = current;
		}
		return source;
	};

	Object.extend({

		merge: function(source, k, v){
			if (typeOf(k) == 'string') return mergeOne(source, k, v);
			for (var i = 1, l = arguments.length; i < l; i++){
				var object = arguments[i];
				for (var key in object) mergeOne(source, key, object[key]);
			}
			return source;
		},

		clone: function(object){
			var clone = {};
			for (var key in object) clone[key] = cloneOf(object[key]);
			return clone;
		},

		append: function(original){
			for (var i = 1, l = arguments.length; i < l; i++){
				var extended = arguments[i] || {};
				for (var key in extended) original[key] = extended[key];
			}
			return original;
		}

	});

// Object-less types

	jQuery.each(['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'], function(i, name){
		new Type(name);
	});
	/*
	['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
		new Type(name);
	});
	*/

// Unique ID

	var UID = Date.now();

	String.extend('uniqueID', function(){
		return (UID++).toString(36);
	});



})();

/*
 ---

 name: Array

 description: Contains Array Prototypes like each, contains, and erase.

 license: MIT-style license.

 requires: [Type]

 provides: Array

 ...
 */

Array.implement({

	/*<!ES5>*/
	every: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	filter: function(fn, bind){
		var results = [];
		for (var value, i = 0, l = this.length >>> 0; i < l; i++) if (i in this){
			value = this[i];
			if (fn.call(bind, value, i, this)) results.push(value);
		}
		return results;
	},

	indexOf: function(item, from){
		var length = this.length >>> 0;
		for (var i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var length = this.length >>> 0, results = Array(length);
		for (var i = 0; i < length; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length >>> 0; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},
	/*</!ES5>*/

	clean: function(){
		return this.filter(function(item){
			return item != null;
		});
	},

	invoke: function(methodName){
		var args = Array.slice(arguments, 1);
		return this.map(function(item){
			return item[methodName].apply(item, args);
		});
	},

	associate: function(keys){
		var obj = {}, length = Math.min(this.length, keys.length);
		for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
		return obj;
	},

	link: function(object){
		var result = {};
		for (var i = 0, l = this.length; i < l; i++){
			for (var key in object){
				if (object[key](this[i])){
					result[key] = this[i];
					delete object[key];
					break;
				}
			}
		}
		return result;
	},

	contains: function(item, from){
		return this.indexOf(item, from) != -1;
	},

	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	getLast: function(){
		return (this.length) ? this[this.length - 1] : null;
	},

	getRandom: function(){
		return (this.length) ? this[Number.random(0, this.length - 1)] : null;
	},

	include: function(item){
		if (!this.contains(item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--;){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var type = typeOf(this[i]);
			if (type == 'null') continue;
			array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
		}
		return array;
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = this.map(function(value){
			if (value.length == 1) value += value;
			return parseInt(value, 16);
		});
		return (array) ? rgb : 'rgb(' + rgb + ')';
	},

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return (array) ? hex : '#' + hex.join('');
	}

});



/*
 ---

 name: Function

 description: Contains Function Prototypes like create, bind, pass, and delay.

 license: MIT-style license.

 requires: Type

 provides: Function

 ...
 */

Function.extend({

	attempt: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch (e){}
		}
		return null;
	}

});

Function.implement({

	attempt: function(args, bind){
		try {
			return this.apply(bind, Array.convert(args));
		} catch (e){}

		return null;
	},

	/*<!ES5-bind>*/
	bind: function(that){
		var self = this,
			args = arguments.length > 1 ? Array.slice(arguments, 1) : null,
			F = function(){};

		var bound = function(){
			var context = that, length = arguments.length;
			if (this instanceof bound){
				F.prototype = self.prototype;
				context = new F;
			}
			var result = (!args && !length)
				? self.call(context)
				: self.apply(context, args && length ? args.concat(Array.slice(arguments)) : args || arguments);
			return context == that ? result : context;
		};
		return bound;
	},
	/*</!ES5-bind>*/

	pass: function(args, bind){
		var self = this;
		if (args != null) args = Array.convert(args);
		return function(){
			return self.apply(bind, args || arguments);
		};
	},

	delay: function(delay, bind, args){
		return setTimeout(this.pass((args == null ? [] : args), bind), delay);
	},

	periodical: function(periodical, bind, args){
		return setInterval(this.pass((args == null ? [] : args), bind), periodical);
	}

});



/*
 ---

 name: Number

 description: Contains Number Prototypes like limit, round, times, and ceil.

 license: MIT-style license.

 requires: Type

 provides: Number

 ...
 */

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, this);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	}

});

Number.alias('each', 'times');

(function(math){

	var methods = {};

	jQuery.each(math, function(i, name){
		if (!Number[name]) methods[name] = function(){
			return Math[name].apply(null, [this].concat(Array.convert(arguments)));
		};
	});

	/*
	math.each(function(name){
		if (!Number[name]) methods[name] = function(){
			return Math[name].apply(null, [this].concat(Array.convert(arguments)));
		};
	});*/

	Number.implement(methods);

})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);

/*
 ---

 name: String

 description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

 license: MIT-style license.

 requires: [Type, Array]

 provides: String

 ...
 */

String.implement({

	//<!ES6>
	contains: function(string, index){
		return (index ? String(this).slice(index) : String(this)).indexOf(string) > -1;
	},
	//</!ES6>

	test: function(regex, params){
		return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
	},

	trim: function(){
		return String(this).replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return String(this).replace(/\s+/g, ' ').trim();
	},

	camelCase: function(){
		return String(this).replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return String(this).replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	},

	capitalize: function(){
		return String(this).replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	},

	hexToRgb: function(array){
		var hex = String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	rgbToHex: function(array){
		var rgb = String(this).match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	},

	substitute: function(object, regexp){
		return String(this).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});



/*
 ---

 name: Browser

 description: The Browser Object. Contains Browser initialization, Window and Document, and the Browser Hash.

 license: MIT-style license.

 requires: [Array, Function, Number, String]

 provides: [Browser, Window, Document]

 ...
 */

(function(){

	var document = this.document;
	var window = document.window = this;

	var parse = function(ua, platform){
		ua = ua.toLowerCase();
		platform = (platform ? platform.toLowerCase() : '');

		// chrome is included in the edge UA, so need to check for edge first,
		// before checking if it's chrome.
		var UA = ua.match(/(edge)[\s\/:]([\w\d\.]+)/);
		if (!UA){
			UA = ua.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/) || [null, 'unknown', 0];
		}

		if (UA[1] == 'trident'){
			UA[1] = 'ie';
			if (UA[4]) UA[2] = UA[4];
		} else if (UA[1] == 'crios'){
			UA[1] = 'chrome';
		}

		platform = ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || ua.match(/mac|win|linux/) || ['other'])[0];
		if (platform == 'win') platform = 'windows';

		return {
			extend: Function.prototype.extend,
			name: (UA[1] == 'version') ? UA[3] : UA[1],
			version: parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),
			platform: platform
		};
	};

	var Browser = this.Browser = parse(navigator.userAgent, navigator.platform);

	if (Browser.name == 'ie' && document.documentMode){
		Browser.version = document.documentMode;
	}

	Browser.extend({
		Features: {
			xpath: !!(document.evaluate),
			air: !!(window.runtime),
			query: !!(document.querySelector),
			json: !!(window.JSON)
		},
		parseUA: parse
	});



// Request

	Browser.Request = (function(){

		var XMLHTTP = function(){
			return new XMLHttpRequest();
		};

		var MSXML2 = function(){
			return new ActiveXObject('MSXML2.XMLHTTP');
		};

		var MSXML = function(){
			return new ActiveXObject('Microsoft.XMLHTTP');
		};

		return Function.attempt(function(){
			XMLHTTP();
			return XMLHTTP;
		}, function(){
			MSXML2();
			return MSXML2;
		}, function(){
			MSXML();
			return MSXML;
		});

	})();

	Browser.Features.xhr = !!(Browser.Request);



// String scripts

	Browser.exec = function(text){
		if (!text) return text;
		if (window.execScript){
			window.execScript(text);
		} else {
			var script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.text = text;
			document.head.appendChild(script);
			document.head.removeChild(script);
		}
		return text;
	};

	String.implement('stripScripts', function(exec){
		var scripts = '';
		var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
			scripts += code + '\n';
			return '';
		});
		if (exec === true) Browser.exec(scripts);
		else if (typeOf(exec) == 'function') exec(scripts, text);
		return text;
	});

// Window, Document

	Browser.extend({
		Document: this.Document,
		Window: this.Window,
		Element: this.Element,
		Event: this.Event
	});

	this.Window = this.$constructor = new Type('Window', function(){});

	this.$family = Function.convert('window').hide();

	Window.mirror(function(name, method){
		window[name] = method;
	});

	this.Document = document.$constructor = new Type('Document', function(){});

	document.$family = Function.convert('document').hide();

	Document.mirror(function(name, method){
		document[name] = method;
	});

	document.html = document.documentElement;
	if (!document.head) document.head = document.getElementsByTagName('head')[0];

	if (document.execCommand) try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch (e){}

	/*<ltIE9>*/
	if (this.attachEvent && !this.addEventListener){
		var unloadEvent = function(){
			this.detachEvent('onunload', unloadEvent);
			document.head = document.html = document.window = null;
			window = this.Window = document = null;
		};
		this.attachEvent('onunload', unloadEvent);
	}

// IE fails on collections and <select>.options (refers to <select>)
	var arrayFrom = Array.convert;
	try {
		arrayFrom(document.html.childNodes);
	} catch (e){
		Array.convert = function(item){
			if (typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array'){
				var i = item.length, array = new Array(i);
				while (i--) array[i] = item[i];
				return array;
			}
			return arrayFrom(item);
		};

		var prototype = Array.prototype,
			slice = prototype.slice;
		['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice'].each(function(name){
			var method = prototype[name];
			Array[name] = function(item){
				return method.apply(Array.convert(item), slice.call(arguments, 1));
			};
		});
	}
	/*</ltIE9>*/



})();

/*
 ---

 name: Class

 description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

 license: MIT-style license.

 requires: [Array, String, Function, Number]

 provides: Class

 ...
 */

(function(){

	var Class = this.Class = new Type('Class', function(params){
		if (instanceOf(params, Function)) params = {initialize: params};

		var newClass = function(){
			reset(this);
			if (newClass.$prototyping) return this;
			this.$caller = null;
			this.$family = null;
			var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
			this.$caller = this.caller = null;
			return value;
		}.extend(this).implement(params);

		newClass.$constructor = Class;
		newClass.prototype.$constructor = newClass;
		newClass.prototype.parent = parent;

		return newClass;
	});

	var parent = function(){
		if (!this.$caller) throw new Error('The method "parent" cannot be called.');
		var name = this.$caller.$name,
			parent = this.$caller.$owner.parent,
			previous = (parent) ? parent.prototype[name] : null;
		if (!previous) throw new Error('The method "' + name + '" has no parent.');
		return previous.apply(this, arguments);
	};

	var reset = function(object){
		for (var key in object){
			var value = object[key];
			switch (typeOf(value)){
				case 'object':
					var F = function(){};
					F.prototype = value;
					object[key] = reset(new F);
					break;
				case 'array': object[key] = value.clone(); break;
			}
		}
		return object;
	};

	var wrap = function(self, key, method){
		if (method.$origin) method = method.$origin;
		var wrapper = function(){
			if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
			var caller = this.caller, current = this.$caller;
			this.caller = current; this.$caller = wrapper;
			var result = method.apply(this, arguments);
			this.$caller = current; this.caller = caller;
			return result;
		}.extend({$owner: self, $origin: method, $name: key});
		return wrapper;
	};

	var implement = function(key, value, retain){
		if (Class.Mutators.hasOwnProperty(key)){
			value = Class.Mutators[key].call(this, value);
			if (value == null) return this;
		}

		if (typeOf(value) == 'function'){
			if (value.$hidden) return this;
			this.prototype[key] = (retain) ? value : wrap(this, key, value);
		} else {
			Object.merge(this.prototype, key, value);
		}

		return this;
	};

	var getInstance = function(klass){
		klass.$prototyping = true;
		var proto = new klass;
		delete klass.$prototyping;
		return proto;
	};

	Class.implement('implement', implement.overloadSetter());

	Class.Mutators = {

		Extends: function(parent){
			this.parent = parent;
			this.prototype = getInstance(parent);
		},

		Implements: function(items){
			Array.convert(items).each(function(item){
				var instance = new item;
				for (var key in instance) implement.call(this, key, instance[key], true);
			}, this);
		}
	};

})();

/*
 ---

 name: Class.Extras

 description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

 license: MIT-style license.

 requires: Class

 provides: [Class.Extras, Chain, Events, Options]

 ...
 */

(function(){

	this.Chain = new Class({

		$chain: [],

		chain: function(){
			this.$chain.append(Array.flatten(arguments));
			return this;
		},

		callChain: function(){
			return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
		},

		clearChain: function(){
			this.$chain.empty();
			return this;
		}

	});

	var removeOn = function(string){
		return string.replace(/^on([A-Z])/, function(full, first){
			return first.toLowerCase();
		});
	};

	this.Events = new Class({

		$events: {},

		addEvent: function(type, fn, internal){
			type = removeOn(type);



			this.$events[type] = (this.$events[type] || []).include(fn);
			if (internal) fn.internal = true;
			return this;
		},

		addEvents: function(events){
			for (var type in events) this.addEvent(type, events[type]);
			return this;
		},

		fireEvent: function(type, args, delay){
			type = removeOn(type);
			var events = this.$events[type];
			if (!events) return this;
			args = Array.convert(args);

			jQuery.each(events, function(i, fn){
				if (delay) fn.delay(delay, this, args);
				else if(fn)fn.apply(this, args);
			}.bind(this));

			/*
			events.each(function(fn){
				if (delay) fn.delay(delay, this, args);
				else fn.apply(this, args);
			}, this);
			*/
			return this;
		},

		removeEvent: function(type, fn){
			type = removeOn(type);
			var events = this.$events[type];
			if (events && !fn.internal){
				var index = events.indexOf(fn);
				if (index != -1) delete events[index];
			}
			return this;
		},

		removeEvents: function(events){
			var type;
			if (typeOf(events) == 'object'){
				for (type in events) this.removeEvent(type, events[type]);
				return this;
			}
			if (events) events = removeOn(events);
			for (type in this.$events){
				if (events && events != type) continue;
				var fns = this.$events[type];
				for (var i = fns.length; i--;) if (i in fns){
					this.removeEvent(type, fns[i]);
				}
			}
			return this;
		}

	});

	this.Options = new Class({

		setOptions: function(){
			var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
			if (this.addEvent) for (var option in options){
				if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
				this.addEvent(option, options[option]);
				delete options[option];
			}
			return this;
		}

	});

})();
/* ../ludojs/src/../mootools/Mootools-More-1.6.0.js */
/* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2016 [Valerio Proietti](http://mad4milk.net/).*/
/*!
 Web Build: http://mootools.net/more/builder/447324cc9ea6344646513d80fe56da74
 */
/* 
 ---

 script: More.js

 name: More

 description: MooTools More

 license: MIT-style license

 authors:
 - Guillermo Rauch
 - Thomas Aylott
 - Scott Kyle
 - Arian Stolwijk
 - Tim Wienk
 - Christoph Pojer
 - Aaron Newton
 - Jacob Thornton

 requires:
 - Core/MooTools

 provides: [MooTools.More]

 ...
 */

MooTools.More = {
	version: '1.6.0',
	build: '45b71db70f879781a7e0b0d3fb3bb1307c2521eb'
};

/*
 ---

 script: Object.Extras.js

 name: Object.Extras

 description: Extra Object generics, like getFromPath which allows a path notation to child elements.

 license: MIT-style license

 authors:
 - Aaron Newton

 requires:
 - Core/Object
 - MooTools.More

 provides: [Object.Extras]

 ...
 */

(function(){

	var defined = function(value){
		return value != null;
	};

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	Object.extend({

		getFromPath: function(source, parts){
			if (typeof parts == 'string') parts = parts.split('.');
			for (var i = 0, l = parts.length; i < l; i++){
				if (hasOwnProperty.call(source, parts[i])) source = source[parts[i]];
				else return null;
			}
			return source;
		},

		cleanValues: function(object, method){
			method = method || defined;
			for (var key in object) if (!method(object[key])){
				delete object[key];
			}
			return object;
		},

		erase: function(object, key){
			if (hasOwnProperty.call(object, key)) delete object[key];
			return object;
		},

		run: function(object){
			var args = Array.slice(arguments, 1);
			for (var key in object) if (object[key].apply){
				object[key].apply(object, args);
			}
			return object;
		}

	});

})();

/*
 ---

 script: Locale.js

 name: Locale

 description: Provides methods for localization.

 license: MIT-style license

 authors:
 - Aaron Newton
 - Arian Stolwijk

 requires:
 - Core/Events
 - Object.Extras
 - MooTools.More

 provides: [Locale, Lang]

 ...
 */

(function(){

	var current = null,
		locales = {},
		inherits = {};

	var getSet = function(set){
		if (instanceOf(set, Locale.Set)) return set;
		else return locales[set];
	};

	var Locale = this.Locale = {

		define: function(locale, set, key, value){
			var name;
			if (instanceOf(locale, Locale.Set)){
				name = locale.name;
				if (name) locales[name] = locale;
			} else {
				name = locale;
				if (!locales[name]) locales[name] = new Locale.Set(name);
				locale = locales[name];
			}

			if (set) locale.define(set, key, value);



			if (!current) current = locale;

			return locale;
		},

		use: function(locale){
			locale = getSet(locale);

			if (locale){
				current = locale;

				this.fireEvent('change', locale);


			}

			return this;
		},

		getCurrent: function(){
			return current;
		},

		get: function(key, args){
			return (current) ? current.get(key, args) : '';
		},

		inherit: function(locale, inherits, set){
			locale = getSet(locale);

			if (locale) locale.inherit(inherits, set);
			return this;
		},

		list: function(){
			return Object.keys(locales);
		}

	};

	Object.append(Locale, new Events);

	Locale.Set = new Class({

		sets: {},

		inherits: {
			locales: [],
			sets: {}
		},

		initialize: function(name){
			this.name = name || '';
		},

		define: function(set, key, value){
			var defineData = this.sets[set];
			if (!defineData) defineData = {};

			if (key){
				if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
				else defineData[key] = value;
			}
			this.sets[set] = defineData;

			return this;
		},

		get: function(key, args, _base){
			var value = Object.getFromPath(this.sets, key);
			if (value != null){
				var type = typeOf(value);
				if (type == 'function') value = value.apply(null, Array.convert(args));
				else if (type == 'object') value = Object.clone(value);
				return value;
			}

			// get value of inherited locales
			var index = key.indexOf('.'),
				set = index < 0 ? key : key.substr(0, index),
				names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
			if (!_base) _base = [];

			for (var i = 0, l = names.length; i < l; i++){
				if (_base.contains(names[i])) continue;
				_base.include(names[i]);

				var locale = locales[names[i]];
				if (!locale) continue;

				value = locale.get(key, args, _base);
				if (value != null) return value;
			}

			return '';
		},

		inherit: function(names, set){
			names = Array.convert(names);

			if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

			var l = names.length;
			while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

			return this;
		}

	});



})();

/*
 ---

 name: Locale.en-US.Date

 description: Date messages for US English.

 license: MIT-style license

 authors:
 - Aaron Newton

 requires:
 - Locale

 provides: [Locale.en-US.Date]

 ...
 */

Locale.define('en-US', 'Date', {

	months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

	// Culture's date order: MM/DD/YYYY
	dateOrder: ['month', 'date', 'year'],
	shortDate: '%m/%d/%Y',
	shortTime: '%I:%M%p',
	AM: 'AM',
	PM: 'PM',
	firstDayOfWeek: 0,

	// Date.Extras
	ordinal: function(dayOfMonth){
		// 1st, 2nd, 3rd, etc.
		return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
	},

	lessThanMinuteAgo: 'less than a minute ago',
	minuteAgo: 'about a minute ago',
	minutesAgo: '{delta} minutes ago',
	hourAgo: 'about an hour ago',
	hoursAgo: 'about {delta} hours ago',
	dayAgo: '1 day ago',
	daysAgo: '{delta} days ago',
	weekAgo: '1 week ago',
	weeksAgo: '{delta} weeks ago',
	monthAgo: '1 month ago',
	monthsAgo: '{delta} months ago',
	yearAgo: '1 year ago',
	yearsAgo: '{delta} years ago',

	lessThanMinuteUntil: 'less than a minute from now',
	minuteUntil: 'about a minute from now',
	minutesUntil: '{delta} minutes from now',
	hourUntil: 'about an hour from now',
	hoursUntil: 'about {delta} hours from now',
	dayUntil: '1 day from now',
	daysUntil: '{delta} days from now',
	weekUntil: '1 week from now',
	weeksUntil: '{delta} weeks from now',
	monthUntil: '1 month from now',
	monthsUntil: '{delta} months from now',
	yearUntil: '1 year from now',
	yearsUntil: '{delta} years from now'

});

/*
 ---

 script: Date.js

 name: Date

 description: Extends the Date native object to include methods useful in managing dates.

 license: MIT-style license

 authors:
 - Aaron Newton
 - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
 - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
 - Scott Kyle - scott [at] appden.com; http://appden.com

 requires:
 - Core/Array
 - Core/String
 - Core/Number
 - MooTools.More
 - Locale
 - Locale.en-US.Date

 provides: [Date]

 ...
 */

(function(){

	var Date = this.Date;

	var DateMethods = Date.Methods = {
		ms: 'Milliseconds',
		year: 'FullYear',
		min: 'Minutes',
		mo: 'Month',
		sec: 'Seconds',
		hr: 'Hours'
	};

	jQuery.each([
		'Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
		'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
		'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'
	],
	function(i, method){
		Date.Methods[method.toLowerCase()] = method;
	});

	/*
	[
		'Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
		'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
		'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'
	].each(function(method){
		Date.Methods[method.toLowerCase()] = method;
	});
	*/

	var pad = function(n, digits, string){
		if (digits == 1) return n;
		return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
	};

	Date.implement({

		set: function(prop, value){
			prop = prop.toLowerCase();
			var method = DateMethods[prop] && 'set' + DateMethods[prop];
			if (method && this[method]) this[method](value);
			return this;
		}.overloadSetter(),

		get: function(prop){
			prop = prop.toLowerCase();
			var method = DateMethods[prop] && 'get' + DateMethods[prop];
			if (method && this[method]) return this[method]();
			return null;
		}.overloadGetter(),

		clone: function(){
			return new Date(this.get('time'));
		},

		increment: function(interval, times){
			interval = interval || 'day';
			times = times != null ? times : 1;

			switch (interval){
				case 'year':
					return this.increment('month', times * 12);
				case 'month':
					var d = this.get('date');
					this.set('date', 1).set('mo', this.get('mo') + times);
					return this.set('date', d.min(this.get('lastdayofmonth')));
				case 'week':
					return this.increment('day', times * 7);
				case 'day':
					return this.set('date', this.get('date') + times);
			}

			if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

			return this.set('time', this.get('time') + times * Date.units[interval]());
		},

		decrement: function(interval, times){
			return this.increment(interval, -1 * (times != null ? times : 1));
		},

		isLeapYear: function(){
			return Date.isLeapYear(this.get('year'));
		},

		clearTime: function(){
			return this.set({hr: 0, min: 0, sec: 0, ms: 0});
		},

		diff: function(date, resolution){
			if (typeOf(date) == 'string') date = Date.parse(date);

			return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
		},

		getLastDayOfMonth: function(){
			return Date.daysInMonth(this.get('mo'), this.get('year'));
		},

		getDayOfYear: function(){
			return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
				- Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
		},

		setDay: function(day, firstDayOfWeek){
			if (firstDayOfWeek == null){
				firstDayOfWeek = Date.getMsg('firstDayOfWeek');
				if (firstDayOfWeek === '') firstDayOfWeek = 1;
			}

			day = (7 + Date.parseDay(day, true) - firstDayOfWeek) % 7;
			var currentDay = (7 + this.get('day') - firstDayOfWeek) % 7;

			return this.increment('day', day - currentDay);
		},

		getWeek: function(firstDayOfWeek){
			if (firstDayOfWeek == null){
				firstDayOfWeek = Date.getMsg('firstDayOfWeek');
				if (firstDayOfWeek === '') firstDayOfWeek = 1;
			}

			var date = this,
				dayOfWeek = (7 + date.get('day') - firstDayOfWeek) % 7,
				dividend = 0,
				firstDayOfYear;

			if (firstDayOfWeek == 1){
				// ISO-8601, week belongs to year that has the most days of the week (i.e. has the thursday of the week)
				var month = date.get('month'),
					startOfWeek = date.get('date') - dayOfWeek;

				if (month == 11 && startOfWeek > 28) return 1; // Week 1 of next year

				if (month == 0 && startOfWeek < -2){
					// Use a date from last year to determine the week
					date = new Date(date).decrement('day', dayOfWeek);
					dayOfWeek = 0;
				}

				firstDayOfYear = new Date(date.get('year'), 0, 1).get('day') || 7;
				if (firstDayOfYear > 4) dividend = -7; // First week of the year is not week 1
			} else {
				// In other cultures the first week of the year is always week 1 and the last week always 53 or 54.
				// Days in the same week can have a different weeknumber if the week spreads across two years.
				firstDayOfYear = new Date(date.get('year'), 0, 1).get('day');
			}

			dividend += date.get('dayofyear');
			dividend += 6 - dayOfWeek; // Add days so we calculate the current date's week as a full week
			dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7; // Make up for first week of the year not being a full week

			return (dividend / 7);
		},

		getOrdinal: function(day){
			return Date.getMsg('ordinal', day || this.get('date'));
		},

		getTimezone: function(){
			return this.toString()
				.replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
				.replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
		},

		getGMTOffset: function(){
			var off = this.get('timezoneOffset');
			return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
		},

		setAMPM: function(ampm){
			ampm = ampm.toUpperCase();
			var hr = this.get('hr');
			if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
			else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
			return this;
		},

		getAMPM: function(){
			return (this.get('hr') < 12) ? 'AM' : 'PM';
		},

		parse: function(str){
			this.set('time', Date.parse(str));
			return this;
		},

		isValid: function(date){
			if (!date) date = this;
			return typeOf(date) == 'date' && !isNaN(date.valueOf());
		},

		format: function(format){
			if (!this.isValid()) return 'invalid date';

			if (!format) format = '%x %X';
			if (typeof format == 'string') format = formats[format.toLowerCase()] || format;
			if (typeof format == 'function') return format(this);

			var d = this;
			return format.replace(/%([a-z%])/gi,
				function($0, $1){
					switch ($1){
						case 'a': return Date.getMsg('days_abbr')[d.get('day')];
						case 'A': return Date.getMsg('days')[d.get('day')];
						case 'b': return Date.getMsg('months_abbr')[d.get('month')];
						case 'B': return Date.getMsg('months')[d.get('month')];
						case 'c': return d.format('%a %b %d %H:%M:%S %Y');
						case 'd': return pad(d.get('date'), 2);
						case 'e': return pad(d.get('date'), 2, ' ');
						case 'H': return pad(d.get('hr'), 2);
						case 'I': return pad((d.get('hr') % 12) || 12, 2);
						case 'j': return pad(d.get('dayofyear'), 3);
						case 'k': return pad(d.get('hr'), 2, ' ');
						case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
						case 'L': return pad(d.get('ms'), 3);
						case 'm': return pad((d.get('mo') + 1), 2);
						case 'M': return pad(d.get('min'), 2);
						case 'o': return d.get('ordinal');
						case 'p': return Date.getMsg(d.get('ampm'));
						case 's': return Math.round(d / 1000);
						case 'S': return pad(d.get('seconds'), 2);
						case 'T': return d.format('%H:%M:%S');
						case 'U': return pad(d.get('week'), 2);
						case 'w': return d.get('day');
						case 'x': return d.format(Date.getMsg('shortDate'));
						case 'X': return d.format(Date.getMsg('shortTime'));
						case 'y': return d.get('year').toString().substr(2);
						case 'Y': return d.get('year');
						case 'z': return d.get('GMTOffset');
						case 'Z': return d.get('Timezone');
					}
					return $1;
				}
			);
		},

		toISOString: function(){
			return this.format('iso8601');
		}

	}).alias({
		toJSON: 'toISOString',
		compare: 'diff',
		strftime: 'format'
	});

// The day and month abbreviations are standardized, so we cannot use simply %a and %b because they will get localized
	var rfcDayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		rfcMonthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var formats = {
		db: '%Y-%m-%d %H:%M:%S',
		compact: '%Y%m%dT%H%M%S',
		'short': '%d %b %H:%M',
		'long': '%B %d, %Y %H:%M',
		rfc822: function(date){
			return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %Z');
		},
		rfc2822: function(date){
			return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %z');
		},
		iso8601: function(date){
			return (
				date.getUTCFullYear() + '-' +
				pad(date.getUTCMonth() + 1, 2) + '-' +
				pad(date.getUTCDate(), 2) + 'T' +
				pad(date.getUTCHours(), 2) + ':' +
				pad(date.getUTCMinutes(), 2) + ':' +
				pad(date.getUTCSeconds(), 2) + '.' +
				pad(date.getUTCMilliseconds(), 3) + 'Z'
			);
		}
	};

	var parsePatterns = [],
		nativeParse = Date.parse;

	var parseWord = function(type, word, num){
		var ret = -1,
			translated = Date.getMsg(type + 's');
		switch (typeOf(word)){
			case 'object':
				ret = translated[word.get(type)];
				break;
			case 'number':
				ret = translated[word];
				if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
				break;
			case 'string':
				var match = translated.filter(function(name){
					return this.test(name);
				}, new RegExp('^' + word, 'i'));
				if (!match.length) throw new Error('Invalid ' + type + ' string');
				if (match.length > 1) throw new Error('Ambiguous ' + type);
				ret = match[0];
		}

		return (num) ? translated.indexOf(ret) : ret;
	};

	var startCentury = 1900,
		startYear = 70;

	Date.extend({

		getMsg: function(key, args){
			return Locale.get('Date.' + key, args);
		},

		units: {
			ms: Function.convert(1),
			second: Function.convert(1000),
			minute: Function.convert(60000),
			hour: Function.convert(3600000),
			day: Function.convert(86400000),
			week: Function.convert(608400000),
			month: function(month, year){
				var d = new Date;
				return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
			},
			year: function(year){
				year = year || new Date().get('year');
				return Date.isLeapYear(year) ? 31622400000 : 31536000000;
			}
		},

		daysInMonth: function(month, year){
			return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},

		isLeapYear: function(year){
			return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
		},

		parse: function(from){
			var t = typeOf(from);
			if (t == 'number') return new Date(from);
			if (t != 'string') return from;
			from = from.clean();
			if (!from.length) return null;

			var parsed;
			parsePatterns.some(function(pattern){
				var bits = pattern.re.exec(from);
				return (bits) ? (parsed = pattern.handler(bits)) : false;
			});

			if (!(parsed && parsed.isValid())){
				parsed = new Date(nativeParse(from));
				if (!(parsed && parsed.isValid())) parsed = new Date(from.toInt());
			}
			return parsed;
		},

		parseDay: function(day, num){
			return parseWord('day', day, num);
		},

		parseMonth: function(month, num){
			return parseWord('month', month, num);
		},

		parseUTC: function(value){
			var localDate = new Date(value);
			var utcSeconds = Date.UTC(
				localDate.get('year'),
				localDate.get('mo'),
				localDate.get('date'),
				localDate.get('hr'),
				localDate.get('min'),
				localDate.get('sec'),
				localDate.get('ms')
			);
			return new Date(utcSeconds);
		},

		orderIndex: function(unit){
			return Date.getMsg('dateOrder').indexOf(unit) + 1;
		},

		defineFormat: function(name, format){
			formats[name] = format;
			return this;
		},



		defineParser: function(i, pattern){
			parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
			return this;
		},

		defineParsers: function(){
			var a = Array.flatten(arguments);

			jQuery.each(a, Date.defineParser);


			// Array.flatten(arguments).each(Date.defineParser);
			return this;
		},

		define2DigitYearStart: function(year){
			startYear = year % 100;
			startCentury = year - startYear;
			return this;
		}

	}).extend({
		defineFormats: Date.defineFormat.overloadSetter()
	});

	var regexOf = function(type){
		return new RegExp('(?:' + Date.getMsg(type).map(function(name){
				return name.substr(0, 3);
			}).join('|') + ')[a-z]*');
	};

	var replacers = function(key){
		switch (key){
			case 'T':
				return '%H:%M:%S';
			case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
				return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
			case 'X':
				return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?';
		}
		return null;
	};

	var keys = {
		d: /[0-2]?[0-9]|3[01]/,
		H: /[01]?[0-9]|2[0-3]/,
		I: /0?[1-9]|1[0-2]/,
		M: /[0-5]?\d/,
		s: /\d+/,
		o: /[a-z]*/,
		p: /[ap]\.?m\.?/,
		y: /\d{2}|\d{4}/,
		Y: /\d{4}/,
		z: /Z|[+-]\d{2}(?::?\d{2})?/
	};

	keys.m = keys.I;
	keys.S = keys.M;

	var currentLanguage;

	var recompile = function(language){
		currentLanguage = language;

		keys.a = keys.A = regexOf('days');
		keys.b = keys.B = regexOf('months');

		jQuery.each(parsePatterns, function(i, pattern){
			if (pattern.format) parsePatterns[i] = build(pattern.format);
		});
		/*
		parsePatterns.each(function(pattern, i){
			if (pattern.format) parsePatterns[i] = build(pattern.format);
		});
		*/
	};

	var build = function(format){
		if (!currentLanguage) return {format: format};

		var parsed = [];
		var re = (format.source || format) // allow format to be regex
			.replace(/%([a-z])/gi,
				function($0, $1){
					return replacers($1) || $0;
				}
			).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
			.replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
			.replace(/%([a-z%])/gi,
				function($0, $1){
					var p = keys[$1];
					if (!p) return $1;
					parsed.push($1);
					return '(' + p.source + ')';
				}
			).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

		return {
			format: format,
			re: new RegExp('^' + re + '$', 'i'),
			handler: function(bits){
				bits = bits.slice(1).associate(parsed);
				var date = new Date().clearTime(),
					year = bits.y || bits.Y;

				if (year != null) handle.call(date, 'y', year); // need to start in the right year
				if ('d' in bits) handle.call(date, 'd', 1);
				if ('m' in bits || bits.b || bits.B) handle.call(date, 'm', 1);

				for (var key in bits) handle.call(date, key, bits[key]);
				return date;
			}
		};
	};

	var handle = function(key, value){
		if (!value) return this;

		switch (key){
			case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
			case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
			case 'd': return this.set('date', value);
			case 'H': case 'I': return this.set('hr', value);
			case 'm': return this.set('mo', value - 1);
			case 'M': return this.set('min', value);
			case 'p': return this.set('ampm', value.replace(/\./g, ''));
			case 'S': return this.set('sec', value);
			case 's': return this.set('ms', ('0.' + value) * 1000);
			case 'w': return this.set('day', value);
			case 'Y': return this.set('year', value);
			case 'y':
				value = +value;
				if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
				return this.set('year', value);
			case 'z':
				if (value == 'Z') value = '+00';
				var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
				offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
				return this.set('time', this - offset * 60000);
		}

		return this;
	};

	Date.defineParsers(
		'%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
		'%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
		'%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
		'%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
		'%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
		'%Y %b( %d%o( %X)?)?', // Same as above with year coming first
		'%o %b %d %X %z %Y', // "Thu Oct 22 08:11:23 +0000 2009"
		'%T', // %H:%M:%S
		'%H:%M( ?%p)?' // "11:05pm", "11:05 am" and "11:05"
	);

	Locale.addEvent('change', function(language){
		if (Locale.get('Date')) recompile(language);
	}).fireEvent('change', Locale.getCurrent());

})();

/*
 ---

 script: Date.Extras.js

 name: Date.Extras

 description: Extends the Date native object to include extra methods (on top of those in Date.js).

 license: MIT-style license

 authors:
 - Aaron Newton
 - Scott Kyle

 requires:
 - Date

 provides: [Date.Extras]

 ...
 */

Date.implement({

	timeDiffInWords: function(to){
		return Date.distanceOfTimeInWords(this, to || new Date);
	},

	timeDiff: function(to, separator){
		if (to == null) to = new Date;
		var delta = ((to - this) / 1000).floor().abs();

		var vals = [],
			durations = [60, 60, 24, 365, 0],
			names = ['s', 'm', 'h', 'd', 'y'],
			value, duration;

		for (var item = 0; item < durations.length; item++){
			if (item && !delta) break;
			value = delta;
			if ((duration = durations[item])){
				value = (delta % duration);
				delta = (delta / duration).floor();
			}
			vals.unshift(value + (names[item] || ''));
		}

		return vals.join(separator || ':');
	}

}).extend({

	distanceOfTimeInWords: function(from, to){
		return Date.getTimePhrase(((to - from) / 1000).toInt());
	},

	getTimePhrase: function(delta){
		var suffix = (delta < 0) ? 'Until' : 'Ago';
		if (delta < 0) delta *= -1;

		var units = {
			minute: 60,
			hour: 60,
			day: 24,
			week: 7,
			month: 52 / 12,
			year: 12,
			eon: Infinity
		};

		var msg = 'lessThanMinute';

		for (var unit in units){
			var interval = units[unit];
			if (delta < 1.5 * interval){
				if (delta > 0.75 * interval) msg = unit;
				break;
			}
			delta /= interval;
			msg = unit + 's';
		}

		delta = delta.round();
		return Date.getMsg(msg + suffix, delta).substitute({delta: delta});
	}

}).defineParsers(

	{
		// "today", "tomorrow", "yesterday"
		re: /^(?:tod|tom|yes)/i,
		handler: function(bits){
			var d = new Date().clearTime();
			switch (bits[0]){
				case 'tom': return d.increment();
				case 'yes': return d.decrement();
				default: return d;
			}
		}
	},

	{
		// "next Wednesday", "last Thursday"
		re: /^(next|last) ([a-z]+)$/i,
		handler: function(bits){
			var d = new Date().clearTime();
			var day = d.getDay();
			var newDay = Date.parseDay(bits[2], true);
			var addDays = newDay - day;
			if (newDay <= day) addDays += 7;
			if (bits[1] == 'last') addDays -= 7;
			return d.set('date', d.getDate() + addDays);
		}
	}

).alias('timeAgoInWords', 'timeDiffInWords');
/* ../ludojs/src/ludo.js */
/**
 * @namespace ludo
 */

window.ludo = {
    form:{ validator:{} },color:{}, dialog:{},remote:{},tree:{},model:{},tpl:{},video:{},storage:{},
    grid:{}, effect:{},paging:{},calendar:{},layout:{},progress:{},keyboard:{},chart:{},
    dataSource:{},controller:{},card:{},svg:{},socket:{},menu:{},view:{},audio:{}, ludoDB:{}, theme:{}
};

if (navigator.appName == 'Microsoft Internet Explorer'){
    try {
        document.execCommand("BackgroundImageCache", false, true);
    } catch (e) { }
}

ludo.SINGLETONS = {};

ludo.CmpMgrClass = new Class({
    Extends:Events,
    components:{},
    formElements:{},
    /**
     * Reference to current active component
     * @property object activeComponent
     * @private
     */
    activeComponent:undefined,
    /**
     * Reference to currently selected button
     * @property object activeButton
     * @private
     */
    activeButton:undefined,
    /** Array of available buttons for a component. Used for tab navigation
     * @property array availableButtons
     * @private
     */
    availableButtons:undefined,

    initialize:function () {
        jQuery(document.documentElement).on('keypress', this.autoSubmit.bind(this));
    },

    autoSubmit:function (e) {
        if (e.key == 'enter') {
            if (e.target.tagName.toLowerCase() !== 'textarea') {
                if (this.activeButton) {
                    this.activeButton.click();
                }
            }
        }
        if (e.key == 'tab') {
            var tag = e.target.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                this.selectNextButton();
            }
        }
    },
    registerComponent:function (component) {
        this.components[component.id] = component;
        if (component.buttonBar || component.buttons) {
            component.addEvent('activate', this.selectFirstButton.bind(this));
            component.addEvent('hide', this.clearButtons.bind(this));
        }
        if (component.singleton && component.type) {
            ludo.SINGLETONS[component.type] = component;
        }
    },

    selectFirstButton:function (cmp) {
        if (cmp.isHidden() || !cmp.getButtons) {
            return;
        }

        this.activeComponent = cmp;
        if (this.activeButton) {
            this.activeButton.deSelect();
        }
        this.activeButton = undefined;

        var buttons = this.availableButtons = cmp.getButtons();
        var i;
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].selected) {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }

        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.SubmitButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
        for (i = 0; i < buttons.length; i++) {
            if (!buttons[i].isHidden() && buttons[i].type == 'form.CancelButton') {
                this.activeButton = buttons[i];
                buttons[i].select();
                return;
            }
        }
    },

    selectNextButton:function () {
        if (this.activeButton) {
            this.activeButton.deSelect();
        }

        var index = this.availableButtons.indexOf(this.activeButton);
        index++;
        if (index >= this.availableButtons.length) {
            index = 0;
        }
        this.activeButton = this.availableButtons[index];
        this.activeButton.select();
    },

    clearButtons:function (cmp) {
        if (this.activeComponent && this.activeComponent.getId() == cmp.getId()) {
            this.activeComponent = undefined;
            this.activeButton = undefined;
            this.activeButton = undefined;
        }
    },

    deleteComponent:function (component) {
        this.clearButtons(component);
        delete this.components[component.getId()];
    },

    get:function (id) {
        return id['initialize'] !== undefined ? id : this.components[id];
    },

    zIndex:1,
    getNewZIndex:function () {
        this.zIndex++;
        return this.zIndex;
    },

    newComponent:function (cmpConfig, parentComponent) {
		console.log('old code');
        cmpConfig = cmpConfig || {};
        if (!this.isConfigObject(cmpConfig)) {
            if (parentComponent) {
                if (cmpConfig.getParent() && cmpConfig.getParent().removeChild) {
                    cmpConfig.getParent().removeChild(cmpConfig);
                }
                cmpConfig.setParentComponent(parentComponent);
            }
            return cmpConfig;
        } else {
            if (parentComponent) {
                cmpConfig.els = cmpConfig.els || {};
                if (!cmpConfig.renderTo && parentComponent.getEl())cmpConfig.renderTo = parentComponent.getEl();
                cmpConfig.parentComponent = parentComponent;
            }
            var ret;
            var cmpType = this.getViewType(cmpConfig, parentComponent);
            if (cmpType.countNameSpaces > 1) {
                var tokens = cmpConfig.type.split(/\./g);
                var ns = tokens.join('.');
                ret = eval('new window.ludo.' + ns + '(cmpConfig)');
                if (!ret.type)ret.type = ns;
                return ret;
            }
            else if (cmpType.nameSpace) {
                if (!window.ludo[cmpType.nameSpace][cmpType.componentType] && parentComponent) {
                    parentComponent.log('Class ludo.' + cmpType.nameSpace + '.' + cmpType.componentType + ' does not exists');
                }
                ret = new window.ludo[cmpType.nameSpace][cmpType.componentType](cmpConfig);
                if (!ret.type)ret.type = cmpType.nameSpace;
                return ret;
            } else {
                if (!window.ludo[cmpType.componentType] && parentComponent) {
                    parentComponent.log('Cannot create object of type ' + cmpType.componentType);
                }
                return new window.ludo[cmpType.componentType](cmpConfig);
            }
        }
    },

    getViewType:function (config, parentComponent) {
        var cmpType = '';
        var nameSpace = '';
        if (config.type) {
            cmpType = config.type;
        }
        else if (config.cType) {
            cmpType = config.cType;
        } else {
            cmpType = parentComponent.cType;
        }
        var countNS = 0;
        if (cmpType.indexOf('.') >= 0) {
            var tokens = cmpType.split(/\./g);
            nameSpace = tokens[0];
            cmpType = tokens[1];
            countNS = tokens.length - 1;
        }
        return {
            nameSpace:nameSpace,
            componentType:cmpType,
            countNameSpaces:countNS
        }
    },

    isConfigObject:function (obj) {
        return obj && obj.initialize ? false : true;
    }
});

ludo.CmpMgr = new ludo.CmpMgrClass();

ludo.getView_250_40 = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo.get = function (id) {
    return ludo.CmpMgr.get(id);
};

ludo.$ = function(id){
    return ludo.CmpMgr.get(id);
};

ludo._new = function (config) {
    if (config.type && ludo.SINGLETONS[config.type]) {
        return ludo.SINGLETONS[config.type];
    }
    return ludo.factory.create(config);
};


ludo.FormMgrClass = new Class({
    Extends:Events,
    formElements:{},
    elementArray:[],
    posArray:{},
    forms:{},

    add:function (item) {
        var name = item.getName();
        if (!this.formElements[name]) {
            this.formElements[name] = item;
            this.elementArray.push(item);
            this.posArray[item.getId()] = this.elementArray.length - 1;
        }

        item.addEvent('focus', this.setFocus.bind(this));
        item.addEvent('click', this.setFocus.bind(this));

    },

    getNext:function (formComponent) {
        if (this.posArray[formComponent.getId()]) {
            var index = this.posArray[formComponent.getId()];
            if (index < this.elementArray.length - 1) {
                return this.elementArray[index + 1];
            }
        }
        return null;
    },

    get:function (name) {
        return this.formElements[name] ? this.formElements[name] : null;
    },



    currentFocusedElement:undefined,

    setFocus:function (value, component) {
        if (component.isFormElement() && component !== this.currentFocusedElement) {
			if(this.currentFocusedElement && this.currentFocusedElement.hasFocus()){
				this.currentFocusedElement.blur();
			}
            this.currentFocusedElement = component;

            this.fireEvent('focus', component);
        }
    }

});
ludo.Form = new ludo.FormMgrClass();

Events.prototype.on = Events.prototype.addEvent;
Events.prototype.off = Events.prototype.removeEvent;/* ../ludojs/src/util.js */
ludo.util = {
	types:{},

	isIe:function(){
		return navigator.appName == 'Microsoft Internet Explorer';
	},

	isArray:function (obj) {
		return  ludo.util.type(obj) == 'array';
	},

	isObject:function (obj) {
		return ludo.util.type(obj) === 'object';
	},

	isString:function (obj) {
		return ludo.util.type(obj) === 'string';
	},

	isFunction:function (obj) {
		return ludo.util.type(obj) === 'function';
	},

	argsToArray:function(args){
		return Array.prototype.slice.call(args);
	},

	clamp:function(num, min,max){
		return Math.min(Math.max(num, min), max);

	},
	
	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			ludo.util.types[ ludo.util.types.toString.call(obj) ] || "object" :
			typeof obj;
	},

    isLudoJSConfig:function(obj){
        return obj.initialize===undefined && obj.type;
    },

	tabletOrMobile:undefined,

	isTabletOrMobile:function () {
		if (ludo.util.tabletOrMobile === undefined) {
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			ludo.util.tabletOrMobile = check;
		}
		return ludo.util.tabletOrMobile;
	},

	cancelEvent:function () {
		return false;
	},

	log:function (what) {
		if (window['console']) {
			console.log(what);
		}
	},

    warn:function(what){
        if(window['console']){
            console.warn(what);
        }
    },

	getNewZIndex:function (view) {
		var ret = ludo.CmpMgr.getNewZIndex();

		var p = view.getEl().parent();
		var v;
		if(!view.els){ // TODO refactor
			v = view.el;
			if(!v)return ret;
		}else{
			v = view.els.container;
		}
		if (p.length > 0 && p[0] == document.body && v.css('position')==='absolute') {
			ret += 10000;
		}
		if (view.alwaysInFront) {
			ret += 400000;
		}
		return ret;
	},


	dispose:function(view){
		console.log('remove');
		if (view.getParent()) {
			view.getParent().removeChild(view);
		}
        view.removeEvents();

		this.disposeDependencies(view.dependency);

        view.disposeAllChildren();

		jQuery.each(view.els, function(key){

			if(key != 'parent' && view.els[key] && view.els[key].prop  && view.els[key].prop("tagName")){
				view.els[key].off();
				view.els[key].remove();
			}

		}.bind(view));

		ludo.CmpMgr.deleteComponent(view);

		view.els = {};
	},

	disposeDependencies:function(deps){
		for(var key in deps){
			if(deps.hasOwnProperty(key)){
				if(deps[key].removeEvents)deps[key].removeEvents();
				if(deps[key].dispose){
					deps[key].dispose();
				}else if(deps[key].dependency && deps[key].dependency.length){
					ludo.util.disposeDependencies(deps[key].dependency);
				}
				deps[key] = undefined;
			}
		}

	},
	
    parseDate:function(date, format){
        if(ludo.util.isString(date)){
            var tokens = format.split(/[^a-z%]/gi);
            var dateTokens = date.split(/[\.\-\/]/g);
            var dateParts = {};
            for(var i=0;i<tokens.length;i++){
                dateParts[tokens[i]] = dateTokens[i];
            }
            dateParts['%m'] = dateParts['%m'] ? dateParts['%m'] -1 : 0;
            dateParts['%h'] = dateParts['%h'] || 0;
            dateParts['%i'] = dateParts['%i'] || 0;
            dateParts['%s'] = dateParts['%s'] || 0;
            return new Date(dateParts['%Y'], dateParts['%m'], dateParts['%d'], dateParts['%h'], dateParts['%i'], dateParts['%s']);
        }
        return ludo.util.isString(date) ? '' : date;
    },

    getDragStartEvent:function () {

        return ludo.util.isTabletOrMobile() ? 'touchstart' : 'mousedown';
    },

    getDragMoveEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchmove' : 'mousemove';
    },

    getDragEndEvent:function () {
        return ludo.util.isTabletOrMobile() ? 'touchend' : 'mouseup';
    },

    supportsSVG:function(){
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg')['createSVGRect'];
    },

	lengthOfObject:function(obj){
		if(obj.keys != undefined)return obj.keys().length;
		var l = 0;
		for(var key in obj){
			if(obj.hasOwnProperty(key))l++;
		}
		return l;
	},
	
	pageXY:function(e){

		var eventEl = e.touches && e.touches.length > 0 ? e.touches[0] :
			e.originalEvent != undefined && e.originalEvent.touches != undefined && e.originalEvent.touches.length > 0 ? e.originalEvent.touches[0]:
				e;
		return {
			x: eventEl.pageX, y: eventEl.pageY,
			clientX : eventEl.clientX, clientY: eventEl.clientY,
			pageX: eventEl.pageX, pageY: eventEl.pageY
		};
	}
};

var ludoUtilTypes = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
for(var i=0;i<ludoUtilTypes.length;i++){
	ludo.util.types[ "[object " + ludoUtilTypes[i] + "]" ] = ludoUtilTypes[i].toLowerCase();
}

ludo.isMobile = ludo.util.isTabletOrMobile();/* ../ludojs/src/effect.js */
ludo.Effect = new Class({
	Extends: Events,
	inProgress:false,

	initialize:function(){
		if(ludo.util.isIe()){
			jQuery(document.documentElement).on('selectstart', this.cancelSelection.bind(this));
		}
	},

	fireEvents:function(obj){
		this.fireEvent('start', obj);
		this.fireEvent('end', obj);
	},

	start:function(){
		this.fireEvent('start');
		this.inProgress = true;
		this.disableSelection();
	},

	end:function(){
		this.fireEvent('end');
		this.inProgress = false;
		this.enableSelection();
	},

	disableSelection:function(){
		jQuery(document.body).addClass("ludo-unselectable");
	},

	enableSelection:function(){
		jQuery(document.body).removeClass('ludo-unselectable');
	},

	cancelSelection:function(){
		return !(this.inProgress);
	}

});

ludo.EffectObject = new ludo.Effect();/* ../ludojs/src/language/default.js */
/**
 Words used by ludo JS. You can add your own translations by calling ludo.language.fill()
 @module language
 @type {Object}
 @example
 	ludo.language.fill({
 	    "Ludo JS phrase or word" : "My word",
 	    "other phrase" : "my phrase" 	
 	});
 */
ludo.language = {
	words:{},

    set:function(key, value){
        this.words[key] = value;
    },

    get:function(key){
        return this.words[key] ? this.words[key] : key;
    },

    fill:function(words){
        this.words = Object.merge(this.words, words);
    }
};/* ../ludojs/src/registry.js */
ludo.RegistryClass = new Class({
	storage : {},

	set:function(key, value){
		this.storage[key] = value;
	},

	get:function(key){
		return this.storage[key];
	}
});

ludo.registry = new ludo.RegistryClass();/* ../ludojs/src/storage/storage.js */
/**
 * Utility for saving data in Browsers local storage.
 * @namespace ludo.storage
 */
/**
 * Class for saving data to local storage(browser cache).
 *
 * ludo.getLocalStorage() returns a singleton for ludo.storage.LocalStorage
 *
 * @class ludo.storage.LocalStorage
 * @type {Type}
 * @example
 * ludo.getLocalStorage().save('name', 'John');
 * ludo.getLocalStorage().save('myobject', { "a": 1, "b" : 2 ));
 * ludo.getLocalStorage().get('myobject');
 *
 */
ludo.storage.LocalStorage = new Class({
    supported: false,
    initialize: function () {
        this.supported = typeof(Storage) !== "undefined";
    },

    /**
     * @function save
     * @param {String} key
     * @param {String|Number|Array|Object} value
     * @memberof ludo.storage.LocalStorage.prototype
     */
    save: function (key, value) {
        if (!this.supported)return;
        var type = 'simple';
        if (jQuery.isPlainObject(value) || jQuery.isArray(value)) {
            value = JSON.stringify(value);
            type = 'object';
        }
        localStorage[key] = value;
        localStorage[this.getTypeKey(key)] = type;
    },

    getNumeric:function(key, defaultValue){
        return this.get(key, defaultValue) / 1;
    },

    /**
     * Get value from local storage
     * @function get
     * @param {string} key
     * @param {string|object|array} defaultValue
     * @memberof ludo.storage.LocalStorage.prototype
     * @returns {*}
     */
    get: function (key, defaultValue) {
        if (!this.supported)return defaultValue;
        var type = this.getType(key);
        if (type === 'object') {
            var ret = JSON.parse(localStorage[key]);
            return ret ? ret : defaultValue;
        }

        var val = localStorage.getItem(key);
        return  val ? val : defaultValue;
    },

    getTypeKey: function (key) {
        return key + '___type';
    },

    getType: function (key) {
        key = this.getTypeKey(key);
        if (localStorage[key] !== undefined) {
            return localStorage[key];
        }
        return 'simple';
    },

    empty: function () {
        localStorage.clear();
    }
});

ludo.localStorage = undefined;
ludo.getLocalStorage = function () {
    if (!ludo.localStorage)ludo.localStorage = new ludo.storage.LocalStorage();
    return ludo.localStorage;
};

/* ../ludojs/src/object-factory.js */
/**
 * Internal class designed to create ludoJS class instances.
 *
 * Use ludo.factory to reference this class.
 *
 * @class ludo.ObjectFactory
 *
 */
ludo.ObjectFactory = new Class({
	namespaces:[],
	classReferences : {},

	/**
	 Creates an instance of a class by "type" attribute
	 @function create
	 @param {Object|ludo.Core} config
	 @return {ludo.Core} object
	 @memberof ludo.ObjectFactory.prototype
	 */
	create:function(config){
		if(this.isClass(config))return config;
		config.type = config.type || 'View';

		if(this.classReferences[config.type] !== undefined){
			return new this.classReferences[config.type](config);
		}
		var ludoJsObj = this.getInNamespace('ludo', config);
		if(ludoJsObj)return ludoJsObj;
		for(var i=0;i<this.namespaces.length;i++){
			var obj = this.getInNamespace(this.namespaces[i], config);
			if(obj)return obj;
		}
		try{
			var obj = this.createInstance(config.type, config);
			if(obj!=undefined)return obj;
		}catch(e){

		}
		ludo.util.log('Could not find class ' + config.type);
		return undefined;
	},

	createInstance:function(path, config){
		var tokens = path.split(/\./g);
		var name = tokens.pop();
		var parent = window;
		for(var i=0;i<tokens.length;i++){
			var n = tokens[i];
			if(parent[n] != undefined){
				parent = parent[n];
			}
		}

		if(parent[name] != undefined){
			return new parent[name](config);
		}
		return undefined;
	},

	registerClass:function(typeName, classReference){
		this.classReferences[typeName] = classReference;
	},


	/**
	 Creates alias name to a custom View or class for use in the type attributes.
	 @function createAlias
	 @memberof ludo.ObjectFactory.prototype
	 @param {String} typeName
	 @param {ludo.Core} classReference
	 @example
	 ludo.factory.ns('MyApp.view'); // creates window.MyApp.view if undefined

	 // Create new class
	 MyApp.view.MyView = new Class({
	 		Extends: ludo.View
	 });

	 // Create alias name "MyView" which refers to MyApp.view.MyView
	 ludo.factory.createAlias('MyView', MyApp.view.MyView);
	 ...
	 ...
	 new ludo.View({
	 		...
	 		children:[{
	 			type:'MyView' // Alias name used instead of full namespace and class name
			}]
		});
	 */
	createAlias : function(aliasName, classReference){
		this.classReferences[aliasName] = classReference;
	},

	createNamespace:function(ns){
		if(window[ns] === undefined)window[ns] = {};
		if(this.namespaces.indexOf(ns) === -1)this.namespaces.push(ns);
	},


	/**
	 Automatically creates a Javascript namespace if it doesn't exists.
	 This is a convenient method which you let you write
	 <code>
	 ludo.factory.ns('my.namespace');
	 </code>
	 instead of
	 <code>
	 if(window.my == undefined)window.my = {};
	 if(window.my.namespace == undefined)window.my.namespace = {};
	 </code>

	 @function ludo.factory.createNamespace
	 @memberof ludo.ObjectFactory.prototype
	 @param {String} ns
	 @example
	 ludo.factory.ns('parent.child.grandchild');
	 ...
	 ...
	 parent.child.grandchild.MyClass = new Class({
	 		Extends: ludo.View,
			type : 'MyApp.MyClass'
	 	});

	 var view = new ludo.View({
	 		children:[{
	 			type : 'parent.child.grandchild.MyClass'
			}]
	 	});
	 */
	ns:function(ns){
		var parent = window;
		var tokens = ns.split(/\./g);
		for(var i=0;i<tokens.length;i++){
			var n = tokens[i];
			if(parent[n] == undefined){
				parent[n] = {};
			}
			parent = parent[n];
		}
	},
	

	getInNamespace:function(ns, config){
		if(jQuery.type(config) == "string"){
			console.trace();
		}
		var type = config.type.split(/\./g);
		if(type[0] === ns)type.shift();
		var obj = window[ns];
		for(var i=0;i<type.length;i++){
			if(obj[type[i]] !== undefined){
				obj = obj[type[i]];
			}else{
				return undefined;
			}
		}
		return new obj(config);
	},

	isClass:function(obj){
		return obj && obj.initialize !== undefined;
	}
});
ludo.factory = new ludo.ObjectFactory();/* ../ludojs/src/config.js */
/**
 Class for config properties of a ludoJS application. You have access to an instance of this class
 via ludo.config.
 @class ludo._Config
 @private
 @example
    ludo.config.setUrl('../router.php'); // to set global url
 */
ludo._Config = new Class({
	storage:{},

	initialize:function () {
		this.setDefaultValues();
	},

    /**
     * Reset all config properties back to default values
     * @function reset
	 * @memberof ludo._Config.prototype
     */
	reset:function(){
		this.setDefaultValues();
	},

	setDefaultValues:function () {
		this.storage = {
			url:undefined,
			documentRoot:'/',
			socketUrl:'http://your-node-js-server-url:8080/',
			modRewrite:false,
			fileUploadUrl:undefined
		};
	},

    /**
     Set global url. This url will be used for requests to server if no url is explicit set by
     a component.
     @function config
     @param {String} url
	 @memberof ludo._Config.prototype
     @example
        ludo.config.setUrl('../controller.php');
     */
	setUrl:function (url) {
		this.storage.url = url;
	},
    /**
     * Return global url
     * @function getUrl
     * @return {String}
	 * @memberof ludo._Config.prototype
     * */
	getUrl:function () {
		return this.storage.url;
	},
    /**
     * Enable url in format <url>/resource/arg1/arg2/service
     * @function enableModRewriteUrls
	 * @memberof ludo._Config.prototype
     */
	enableModRewriteUrls:function () {
		this.storage.modRewrite = true;
	},
    /**
     * Disable url's for mod rewrite enabled web servers.
     * @function disableModRewriteUrls
	 * @memberof ludo._Config.prototype
     */
	disableModRewriteUrls:function () {
		this.storage.modRewrite = false;
	},
    /**
     * Returns true when url's for mod rewrite has been enabled
	 * @function hasModRewriteUrls
	 * @memberof ludo._Config.prototype
     * @return {Boolean}
     */
	hasModRewriteUrls:function () {
		return this.storage.modRewrite === true;
	},
    /**
     * Set default socket url(node.js).
     * @function setSocketUrl
	 * @memberof ludo._Config.prototype
     * @param url
     */
	setSocketUrl:function (url) {
		this.storage.socketUrl = url;
	},
    /**
     * Return default socket url
     * @function getSocketUrl
     * @return {String}
	 * @memberof ludo._Config.prototype
     */
	getSocketUrl:function () {
		return this.storage.socketUrl;
	},
    /**
     * Set document root path
     * @function setDocumentRoot
     * @param {String} root
	 * @memberof ludo._Config.prototype
     */
	setDocumentRoot:function (root) {
		this.storage.documentRoot = root === '.' ? '' : root;
	},
    /**
     * @function getDocumentRoot
     * @return {String}
	 * @memberof ludo._Config.prototype
     */
	getDocumentRoot:function () {
		return this.storage.documentRoot;
	},
    /**
     * Set default upload url for form.File components.
     * @function setFileUploadUrl
     * @param {String} url
	 * @memberof ludo._Config.prototype
     */
	setFileUploadUrl:function (url) {
		this.storage.fileUploadUrl = url;
	},
    /**
     * @function getFileUploadUrl
     * @return {String}
	 * @memberof ludo._Config.prototype
     */
	getFileUploadUrl:function(){
		return this.storage.fileUploadUrl;
	}
});

ludo.config = new ludo._Config();/* ../ludojs/src/assets.js */
// TODO refactor this into the ludoJS framework
var Asset = {
    javascript: function(source, properties){

        if (!properties) properties = {};

        var script = jQuery('<script src="' + source + '" type="javascript"></script>'),
            doc = properties.document || document,
            load = properties.onload || properties.onLoad;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load){
            if (typeof script.onreadystatechange != 'undefined'){
                script.on('readystatechange', function(){
                    if (['loaded', 'complete'].contains(this.readyState)) load.call(this);
                });
            } else {
                script.on('load', load);
            }
        }

        this.addProperties(script, properties);

        jQuery(doc.head).append(script);


        return script;
    },

    addProperties:function(to, properties){

        for(var key in properties){
            if(properties.hasOwnProperty(key)){
                to.attr(key, properties[key]);
            }
        }
    },

    css: function(source, properties){
        if (!properties) properties = {};

        var link = jQuery('<link rel="stylesheet" type="text/css" media="screen" href="' + source + '" />');

        var load = properties.onload || properties.onLoad,
            doc = properties.document || document;

        delete properties.onload;
        delete properties.onLoad;
        delete properties.document;

        if (load) link.on('load', load);

        this.addProperties(link, properties);

        jQuery(doc.head).append(link);


        return link;
    }
};
/* ../ludojs/src/core.js */
/**
 * Base class for components and views in ludoJS. This class extends
 * Mootools Events class.
 * @namepace ludo
 * @class ludo.Core
 * @param {Object} config
 * @param {String} config.name Name
 * @param {Boolean} config.stateful When set to true, properties set in statefulProperties can be saved to the browsers local storage.
 * @param {Array} config.statefulProperties Array of stateful properties.
 */
ludo.Core = new Class({
	Extends:Events,
	id:undefined,

	name:undefined,

	module:undefined,
	submodule:undefined,
	/*
	 Reference to a specific controller for the component.
	 The default way is to set useController to true and create a controller in
	 the same namespace as your component. Then that controller will be registered as controller
	 for the component.
	 The 'controller' property can be used to override this and assign a specific controller
	 @memberof ludo.Core.prototype

	 If you create your own controller by extending ludo.controller.Controller,
	 you can control several views by adding events in the addView(component) method.

	 attribute {Object} controller
	 example
	 	controller : 'idOfController'
	 example
	 	controller : { type : 'controller.MyController' }
	 A Controller can also be a singleton.

	 */
	controller:undefined,

	/*
	 * Find controller and register this component to controller
	 * attribute {Boolean} userController
	 * default false
	 * @memberof ludo.Core.prototype
	 */
	useController:false,


	stateful:false,


	statefulProperties:undefined,


	dependency:{},

    /*
    TODO figure out this
     Array of add-ons config objects
     Add-ons are special components which operates on a view. "parentComponent" is sent
     to the constructor of all add-ons and can be saved for later reference.

     @config plugins
     @type {Array}
	 @memberof ludo.Core.prototype
     @example
        new ludo.View({<br>
		   plugins : [ { type : 'plugins.Sound' }]
	  	 });

     Add event
     @example
        this.getParent().addEvent('someEvent', this.playSound.bind(this));
     Which will cause the plugin to play a sound when "someEvent" is fired by parent component.
     */
    plugins:undefined,

    
	initialize:function (config) {
		config = config || {};
		this.lifeCycle(config);
        this.applyplugins();
	},

	lifeCycle:function(config){
		this.__construct(config);
		this.ludoEvents();
	},

    applyplugins:function(){
        if (this.plugins) {
			jQuery.each(this.plugins, function(i, plugin){
				this.addPlugin(plugin, i);
			}.bind(this));
        }
    },

	addPlugin:function(plugin, i){
		i = i != undefined ? i : this.plugins.length;
		plugin.parentComponent = this;
		this.plugins[i] = this.createDependency('plugins' + i, plugin);
	},
	
	__construct:function(config){
        this.__params(config, ['url','name','controller','module','submodule','stateful','id','useController','plugins']);

		// TODO new code 2016 - custom functions
		if(config != undefined){
			for(var key in config){
				if(config.hasOwnProperty(key) && jQuery.type(config[key]) == "function" && this[key] == undefined){
					this[key] = config[key].bind(this);
				}
			}
		}

        if (this.stateful && this.statefulProperties && this.id) {
            config = this.appendPropertiesFromStore(config);
            this.addEvent('state', this.saveStatefulProperties.bind(this));
        }
		if (config.listeners !== undefined)this.addEvents(config.listeners);
		if (this.controller !== undefined)ludo.controllerManager.assignSpecificControllerFor(this.controller, this);
        if (this.module || this.useController)ludo.controllerManager.registerComponent(this);
		if(!this.id)this.id = 'ludo-' + String.uniqueID();
		ludo.CmpMgr.registerComponent(this);
	},

    __params:function(config, keys){
        for(var i=0;i<keys.length;i++){
            if(config[keys[i]] !== undefined)this[keys[i]] = config[keys[i]];
        }
    },

	ludoEvents:function(){},

	appendPropertiesFromStore:function (config) {
		var c = ludo.getLocalStorage().get(this.getKeyForLocalStore());
		if (c) {
			var keys = this.statefulProperties;
			for (var i = 0; i < keys.length; i++) {
				config[keys[i]] = c[keys[i]];
			}
		}
		return config;
	},

	saveStatefulProperties:function () {
		var obj = {};
		var keys = this.statefulProperties;
		for (var i = 0; i < keys.length; i++) {
			obj[keys[i]] = this[keys[i]];
		}
		ludo.getLocalStorage().save(this.getKeyForLocalStore(), obj);
	},

	getKeyForLocalStore:function () {
		return 'state_' + this.id;
	},

	/**
	 Return id of component
	 @function getId
	 @return String id
	 @memberof ludo.Core.prototype
	 */
	getId:function () {
		return this.id;
	},
	/**
	 Get name of component and form element
	 @function getName
	 @return String name
	 @memberof ludo.Core.prototype
	 */
	getName:function () {
		return this.name;
	},

    // TODO refactor this to use only this.url or global url.
	getUrl:function () {
		if (this.url) {
			return this.url;
		}
		if (this.component) {
			return this.component.getUrl();
		}
		if (this.applyTo) {
			return this.applyTo.getUrl();
		}
		if (this.parentComponent) {
			return this.parentComponent.getUrl();
		}
		return undefined;
	},

	getEventEl:function () {
        return Browser['ie'] ? jQuery(document.documentElement) : jQuery(window);
	},

	isConfigObject:function (obj) {
		return obj.initialize === undefined;
	},

	NS:undefined,

	/**
	 * Returns component type minus class name, example:
	 * type: calendar.View will return "calendar"
	 * @function getNamespace
	 * @return {String} namespace
	 * @memberof ludo.Core.prototype
	 */
	getNamespace:function () {
		if (this.NS == undefined) {
			if (this.type) {
				var tokens = this.type.split(/\./g);
				tokens.pop();
				this.NS = tokens.join('.');
			} else {
				this.NS = '';
			}
		}
		return this.NS;
	},

	hasController:function () {
		return this.controller ? true : false;
	},

	getController:function () {
		return this.controller;
	},

	setController:function (controller) {
		this.controller = controller;
		this.addControllerEvents();
	},

	/**
	 Add events to controller
	 @function addControllerEvents
	 @return void
	 @memberof ludo.Core.prototype
	 @example
	 this.controller.addEvent('eventname', this.methodName.bind(this));
	 */
	addControllerEvents:function () {

	},

	getModule:function () {
		return this.getInheritedProperty('module');
	},
	getSubModule:function () {
		return this.getInheritedProperty('submodule');
	},

	getInheritedProperty:function (key) {
        return this[key] !== undefined ? this[key] : this.parentComponent ? this.parentComponent.getInheritedProperty(key) : undefined;
	},

	/**
	 Save state for stateful components and views. States are stored in localStorage which
	 is supported by all major browsers(IE from version 8).
	 @function saveState
	 @memberof ludo.Core.prototype
	 @return void
	 @example
	 	myComponent.saveState();
	 OR
	 @example
	 	this.fireEvent('state');
	 which does the same.
	 */
	saveState:function () {
		this.fireEvent('state');
	},
	
	createDependency:function(key, config){
		this.dependency[key] = ludo.util.isLudoJSConfig(config) ? ludo._new(config) : config;
		return this.dependency[key];
	},

	hasDependency:function(key){
		return this.dependency[key] ? true : false;
	},

	getDependency:function(key, config){
		if(this.dependency[key])return this.dependency[key];
        return this.createDependency(key, config);
	},

	relayEvents:function(obj, events){
		for(var i=0;i<events.length;i++){
			obj.on(events[i], this.getRelayFn(events[i]).bind(this));
		}
	},

	getRelayFn:function(event){
		return function(){
			this.fireEvent.call(this, event, Array.prototype.slice.call(arguments));
		}.bind(this);
	}
});/* ../ludojs/src/svg/matrix.js */
ludo.svg.Matrix = new Class({

    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,

    _translateCommited: [0, 0],

    matrix: undefined,

    node: undefined,

    transformationObject: undefined,

    currentRotation:undefined,

    initialize: function (node) {
        this.node = node;
        this.currentRotation = [0,0,0];
    },

    getScale:function(){
        var m = this.getSVGMatrix();
        return [m.a, m.d];
    },

    setScale:function(x,y){
        this.matrix = this.getSVGMatrix();
        this.matrix.a = x;
        this.matrix.d = arguments.length == 1 ? x : y;
        this.update();

    },

    scale:function(x,y){
        this.matrix = this.getSVGMatrix.scale(x,this.arguments.length == 1 ? x : y);
        this.update();
    },

    getTranslate: function () {
        var m = this.getSVGMatrix();
        return [m.e, m.f];
    },

    setTranslate:function(x,y){
        this.matrix = this.getSVGMatrix();
        this.matrix.e = x;
        this.matrix.f = y;
        this.update();
    },

    translate: function (x, y) {
        this.matrix = this.getSVGMatrix().translate(x,y);
        this.update();
    },

    getRotation:function(){
        return this.currentRotation;
    },

    setRotation:function(degrees, x, y){
        if(this.currentRotation != undefined){
            var a = this.currentRotation;
            this.rotate(-a[0], a[1], a[2]);
        }
        this.rotate(degrees, x, y);
    },

    rotate: function (degrees, x, y) {

        if(degrees < 0)degrees+=360;
        degrees  = degrees % 360;

        this.getSVGMatrix();

        if (arguments.length > 1) {
            this.matrix = this.matrix.translate(x, y);
        }

        this.matrix = this.matrix.rotate(degrees, x, y);

        if (arguments.length > 1) {
            this.matrix = this.matrix.translate(-x, -y);
        }

        this.currentRotation[0] = degrees;
        this.currentRotation[1] = x;
        this.currentRotation[2] = y;
        this.update();
    },

    commitTranslate: function () {
        this._translateCommited[0] = this.e;
        this._translateCommited[1] = this.f;
    },

    getSVGMatrix: function () {
        if (this.matrix == undefined) {
            this.matrix = ludo.svg.SVGElement.createSVGMatrix();
        }
        return this.matrix;
    },

    update: function () {
        this.getTransformObject().setMatrix(this.matrix);
    },

    getTransformObject: function () {
        if (this.transformationObject == undefined) {
            if (this.node.el.transform.baseVal.numberOfItems == 0) {
                var owner;
                if (this.node.el.ownerSVGElement) {
                    owner = this.node.el.ownerSVGElement;
                } else {
                    owner = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
                }
                var t = owner.createSVGTransform();
                this.node.el.transform.baseVal.appendItem(t);
            }
            this.transformationObject = this.node.el.transform.baseVal.getItem(0);
        }

        return this.transformationObject;
    }
});

ludo.svg.setGlobalMatrix = function (canvas) {
    ludo.svg.SVGElement = canvas;
    ludo.svg.globalMatrix = canvas.createSVGMatrix();
};/* ../ludojs/src/svg/engine.js */
ludo.svg.Engine = new Class({
	/*
	 * Returns property value of a SVG DOM node
	 * @function get
	 * @param {HTMLElement} el
	 * @param {String} key
	 */
	get:function (el, key) {
		if (key.substring(0, 6) == "xlink:") {
			return el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
		} else {
			return el.getAttribute(key);
		}
	}
});
ludo.svgEngine = new ludo.svg.Engine();



/* ../ludojs/src/svg/util.js */
ludo.svg.Util = {

    pathStyles:function(className){

        var node = jQuery('<div>');
        node.addClass(className);
        node.css('display', 'none');
        ludo.Theme.getThemeEl().append(node);

        var ret = {
            'fill': ludo.svg.Util.toRGBColor(node.css('background-color')),
            'fill-opacity': node.css('opacity'),
            'stroke': ludo.svg.Util.toRGBColor(node.css('border-color')),
            'stroke-width': node.css('border-width').replace('px', '')
        };
        node.remove();
        return ret;
    },

    textStyles: function (className) {
        var node = jQuery('<div>');
        node.addClass(className);

        node.css('display', 'none');
        ludo.Theme.getThemeEl().append(node);

        var lh = node.css('line-height').replace(/[^0-9\.]/g, '');
        if (!lh) {
            lh = node.css('font-size');
        }


        var fontSize = parseInt(node.css('font-size'));
        fontSize++;


        var ret = {
            'font-size': fontSize + "px",
            'font-family': node.css('font-family'),
            'font-weight': node.css('font-weight'),
            'font-style': node.css('font-style'),
            'line-height': lh,
            'fill': ludo.svg.Util.toRGBColor(node.css('color')),
            'stroke': 'none',
            'stroke-opacity': 0
        };
        ret['line-height'] = ret['line-height'] || ret['font-size'];
        node.remove();
        return ret;
    },

    toRGBColor:function(val){
        if(val.indexOf('rgb') >= 0){
            if(this.colorUtil == undefined){
                this.colorUtil = new ludo.color.Color();
            }
            val = val.replace(/[^0-9,]/g,'');
            var colors = val.split(/,/g);
            if(colors.length == 4)return val;
            val = this.colorUtil.rgbCode(colors[0]/1, colors[1]/1, colors[2]/1);
            return val;
        }

        return val;
    }
};/* ../ludojs/src/svg/node.js */
/**
 * @namespace ludo.svg
 */

/**
 Class for creating SVG DOM Nodes
 @namespace ludo.canvas
 @class ludo.svg.Node

 @param {String} tag
 @param {Object} properties
 @optional
 @param {String} text
 @optional
 @example
 var v = new ludo.View({
    renderTo: document.body,
    layout:{
        width:'matchParent', height:'matchParent'
    }
 });
 var svg = v.svg();

 var circle = svg.$('circle', { cx: 100, cy: 100, r: 50 });
 circle.css('fill', '#ff0000');

 svg.append(circle);

 circle.animate({
    cx:300, cy: 200
 },{
    duration: 1000,
    complete:function(){
        console.log('completed');
    }
 });

 */
ludo.svg.Node = new Class({
    Extends: Events,
    el: undefined,
    tagName: undefined,
    id: undefined,

    dirty: undefined,

    _bbox: undefined,

    _attr: undefined,

    classNameCache: [],

    /*
     * Transformation cache
     * @property tCache
     * @type {Object}
     * @private
     */
    tCache: {},
    /*
     * Internal cache
     * @property {Object} tCacheStrings
     * @private
     */
    tCacheStrings: undefined,

    initialize: function (tagName, properties, text) {

        this._attr = {};

        properties = properties || {};
        properties.id = this.id = properties.id || 'ludo-svg-node-' + String.uniqueID();
        if (tagName !== undefined)this.tagName = tagName;
        this.createNode(this.tagName, properties);
        if (text !== undefined) {
            this.text(text);
        }

    },

    createNode: function (el, properties) {
        if (properties !== undefined) {
            if (typeof el == "string") {
                el = this.createNode(el);
            }
            var that = this;
            Object.each(properties, function (value, key) {
                if (value['getUrl'] !== undefined) {
                    value = value.getUrl();
                }
                if (key == 'css') {
                    this.css(value);
                }
                else if (key.substring(0, 6) == "xlink:") {
                    el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
                } else {
                    el.setAttribute(key, value);
                    that._attr[key] = value;
                }
            }.bind(this));
        } else {
            el = document.createElementNS("http://www.w3.org/2000/svg", el);
        }
        this.el = el;
        el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
        return el;
    },

    getEl: function () {
        return this.el;
    },

    addEvents: function (events) {
        for (var key in events) {
            if (events.hasOwnProperty(key)) {
                this.on(key, events[key]);
            }
        }
    },

    /**
     * Add DOM events to SVG node
     * @param {String} event
     * @param {Function} fn
     * @memberof ludo.svg.Node.prototype
     */
    on: function (event, fn) {
        switch (event.toLowerCase()) {
            case 'mouseenter':
                ludo.canvasEventManager.addMouseEnter(this, fn);
                break;
            case 'mouseleave':
                ludo.canvasEventManager.addMouseLeave(this, fn);
                break;
            default:

                this._addEvent(event, this.getDOMEventFn(event, fn), this.el);
                this.addEvent(event, fn);
        }
    },


    /**
     * Add event to DOM element
     * el is optional, default this.el
     * @function _addEvent
     * @param {String} ev
     * @param {Function} fn
     * @param {Object} el
     * @private
     * @memberof ludo.svg.Node.prototype
     */
    _addEvent: (function () {


        if (document.addEventListener) {
            return function (ev, fn, el) {
                if (el == undefined)el = this.el;
                el.addEventListener(ev, fn, false);
            }
        } else {
            return function (ev, fn, el) {
                if (el == undefined)el = this.el;
                el.attachEvent("on" + ev, fn);
            }
        }
    })(),


    off: function (event, listener) {
        if (this.el.removeEventListener)
            this.el.removeEventListener(event, listener, false);
        else
            this.el.detachEvent('on' + event, listener);
    },

    relativePosition: function (e) {
        var rect = this.el.getBoundingClientRect();

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    getDOMEventFn: function (eventName, fn) {
        return function (e) {
            e = e || window.event;

            var target = e.currentTarget || e.target || e.srcElement;

            while (target && target.nodeType == 3) target = target.parentNode;
            target = target['correspondingUseElement'] || target;

            var mouseX, mouseY;
            var touches = e.touches;
            if(!touches && e.originalEvent)touches = e.originalEvent.touches;
            var pX = e.pageX;
            var py = e.pageY;
            if (touches && touches.length > 0) {
                mouseX = touches[0].clientX;
                mouseY = touches[0].clientY;

                pX = touches[0].pageX;
                py = touches[0].pageY;
            } else {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }

            var svg = this.el.tagName == 'svg' ? this.el : this.el.ownerSVGElement;

            var off = svg ? svg.getBoundingClientRect() : {left: 0, top: 0};

            e = {
                target: target,
                pageX: (pX != null) ? pX : mouseX + document.scrollLeft,
                pageY: (py != null) ? py : mouseY + document.scrollTop,
                clientX: mouseX - off.left, // Relative position to SVG element
                clientY: mouseY - off.top,
                event: e
            };


            if (fn) {
                fn.call(this, e, this, fn);
            }
            return false;
        }.bind(this);
    },
    svgCoordinates: undefined,
    svgPos: function (target) {
        if (this.svgCoordinates == undefined) {
            while (target.tagName.toLowerCase() != 'g') {
                target = target.parentNode;
            }
            this.svgCoordinates = jQuery(target).position();

            console.log(this.svgCoordinates);

        }

        return this.svgCoordinates;
    },

    /**
     * append a new node
     * @function append
     * @param {canvas.View|canvas.Node} node node
     * @return {canvas.Node} parent
     * @memberof ludo.svg.Node.prototype
     */
    append: function (node) {
        this.el.appendChild(node.getEl());
        node.parentNode = this;
        return this;
    },

    parent: function () {
        return this.parentNode;
    },

    /**
     * Show SVG node, i.e. set display css property to ''
     * @function show
     * @memberof ludo.svg.Node.prototype
     */
    show: function () {
        this.css('display', '');
    },

    /**
     * Hides SVG node, i.e. set display css property to 'none'
     * @function hide
     * @memberof ludo.svg.Node.prototype
     */
    hide: function () {
        this.css('display', 'none');
    },

    /**
     * Returns true if SVG node is hidden
     * @returns {boolean}
     * @memberof ludo.svg.Node.prototype
     */
    isHidden: function () {
        return this.css('display') == 'none';
    },

    
    setAttributes:function(p){
        jQuery.each(p, function(key, val){

            this.set(key, val);
        }.bind(this));
    },
    
    setProperties: function (p) {
        this.setAttributes(p);
    },

    /**
     * Set or get attribute.
     * @param {String} key
     * @param {String|Number|ludo.svg.Node} value
     * @returns {*}
     * @memberof ludo.svg.Node.prototype
     * @example
     * var x = node.attr("x"); // Get attribute
     * node.attr("x", 100); // Sets attribute
     */
    attr: function (key, value) {
        if (arguments.length == 1)return this.get(key);
        this.set(key, value);
    },

    /**
     * Set SVG node attribute. If a ludo.svg.Node object is sent as value, the set function will
     * set an url attribute( url(#<id>).
     * @param {String} key
     * @param {String|Number|ludo.svg.Node} value
     * @memberof ludo.svg.Node.prototype
     */
    set: function (key, value) {
        this._attr[key] = value;
        this.dirty = true;

        if (key.substring(0, 6) == "xlink:") {
            if (value['id'] !== undefined)value = '#' + value.getId();
            this.el.setAttributeNS("http://www.w3.org/1999/xlink", key.substring(6), value);
        } else {
            if (value != undefined && value['id'] !== undefined)value = 'url(#' + value.getId() + ')';
            this.el.setAttribute(key, value);
            if(key == 'class' && value.length == 0){
                this.classNameCache = [];
            }
        }
    },

    _setPlain: function (key, value) {
        this._attr[key] = value;
        this.dirty = true;
        this.el.setAttribute(key, value);
    },

    /**
     * Remove SVG attribute
     * @param {String} key
     * @memberof ludo.svg.Node.prototype
     */
    removeAttr: function (key) {
        if (key.substring(0, 6) == "xlink:") {
            this.el.removeAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
        } else {
            this.el.removeAttribute(key);
        }
    },

    remove: function () {
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    },

    /**
     * Get SVG attribute
     * @param {String} key
     * @returns {*}
     * @memberof ludo.svg.Node.prototype
     */
    get: function (key) {
        if (key.substring(0, 6) == "xlink:") {
            return this.el.getAttributeNS("http://www.w3.org/1999/xlink", key.substring(6));
        } else {
            return this.el[key] != undefined && this.el[key].animVal != undefined ? this.el[key].animVal.value : this.el.getAttribute(key);
        }
    },

    /**
     * Returns x and y translation, i.e. translated x and y coordinates
     * @function getTranslate
     * @memberof ludo.svg.Node.prototype
     * @returns {Array}
     * @example
     * var translate = node.getTranslate(); // returns [x,y], example; [100,150]
     */

    getTranslate: function () {
        return this._getMatrix().getTranslate();
    },

    /**
     * Apply filter to node
     * @function applyFilter
     * @param {canvas.Filter} filter
     * @memberof ludo.svg.Node.prototype
     */
    applyFilter: function (filter) {
        this.set('filter', filter.getUrl());
    },
    /**
     * Apply mask to node
     * @function addMask
     * @param {canvas.Node} mask
     * @memberof ludo.svg.Node.prototype
     */
    applyMask: function (mask) {
        this.set('mask', mask.getUrl());
    },

    /**
     * Apply clip path to node. Passed argument should be a "clipPath" node
     * @function clip
     * @param {canvas.Node} clip
     * @memberof ludo.svg.Node.prototype
     * @example
     * var svg = view.svg();
     *
     * var clipPath = s.$('clipPath');
     * var clipCircle = s.$('circle', { cx:50,cy:50,r:50 });
     * clipPath.append(clipPath);
     * s.appendDef(clipPath); // Append clip path to &lt;defs> node of &lt;svg>
     *
     * var rect = s.$('rect', { x:50, y:150, width:100,height:100, fill: '#ff0000' });
     * rect.clip(clipPath);
     */
    clip: function (clip) {
        this.set('clip-path', clip.getUrl());
    },

    
    setPattern:function(pattern){
        this.set('fill', pattern.getUrl());
    },
    
    /**
     Create url reference
     @function url
     @param {String} key
     @memberof ludo.svg.Node.prototype
     @param {canvas.Node|String} to
     @example
     node.url('filter', filterObj); // sets node property filter="url(#&lt;filterObj->id>)"
     node.url('mask', 'MyMask'); // sets node property mask="url(#MyMask)"
     */
    url: function (key, to) {
        this.set(key, to['getUrl'] !== undefined ? to.getUrl() : 'url(#' + to + ')');
    },

    href: function (url) {
        this.set('xlink:href', url);
    },
    /**
     * Update text content of node
     * @function text
     * @param {String} text
     * @memberof ludo.svg.Node.prototype
     */
    text: function (text) {
        this.el.textContent = text;
    },
    /**
     Adds a new child DOM node
     @function add
     @param {String} tagName
     @param {Object} properties
     @param {String} text content
     @optional
     @return {ludo.svg.Node} added node
     @memberof ludo.svg.Node.prototype
     @example
     var filter = new ludo.svg.Filter();
     filter.add('feGaussianBlur', { 'stdDeviation' : 2, result:'blur'  });
     */
    add: function (tagName, properties, text) {
        var node = new ludo.svg.Node(tagName, properties, text);
        this.append(node);
        return node;
    },


    /**
     * Set or get CSS property
     * @param {String} key
     * @param {String|Number} value
     * @returns {ludo.svg.Node}
     * @memberof ludo.svg.Node.prototype
     * @example
     * var stroke = node.css('stroke'); // Get stroke css attribute
     * node.css('stroke', '#FFFFFF'); // set stroke css property
     */
    css: function (key, value) {
        if (arguments.length == 1 && jQuery.type(key) == 'string') {
            return this.el.style[String.camelCase(key)];
        }
        else if (arguments.length == 1) {
            var el = this.el;
            jQuery.each(key, function (attr, val) {
                el.style[String.camelCase(attr)] = val;
            });
        } else {
            this.el.style[String.camelCase(key)] = value;
        }
        return this;
    },

    /**
     * Add css class to SVG node
     * @function addClass
     * @param {String} className
     * @returns {ludo.svg.Node}
     * @memberof ludo.svg.Node.prototype
     */
    addClass: function (className) {
        if (!this.hasClass(className)) {
            this.classNameCache.push(className);
            this.updateNodeClassNameById();
        }
        var cls = this.el.getAttribute('class');
        if (cls) {
            cls = cls.split(/\s/g);
            if (cls.indexOf(className) >= 0)return;
            cls.push(className);
            this.set('class', cls.join(' '));
        } else {
            this.set('class', className);
        }
        return this;
    },
    // TODO this may be problematic if you set class names other ways than via these methods (jan, 2017)
    /**
     Returns true if svg node has given css class name
     @function hasClass
     @param {String} className
     @return {Boolean}
     @memberof ludo.svg.Node.prototype
     @example
     var node = new ludo.svg.Node('rect', { id:'myId2'});
     node.addClass('myClass');
     alert(node.hasClass('myClass'));
     */
    hasClass: function (className) {
        if (!this.classNameCache) {
            var cls = this.el.getAttribute('class');
            if (cls) {
                this.classNameCache = cls.split(/\s/g);
            } else {
                this.classNameCache = [];
            }
        }
        return this.classNameCache.indexOf(className) >= 0;
    },

    /**
     Remove css class name from css Node
     @function removeClass
     @param {String} className
     @memberof ludo.svg.Node.prototype
     @example
     var node = new ludo.svg.Node('rect', { id:'myId2'});
     node.addClass('myClass');
     node.addClass('secondClass');
     node.removeClass('myClass');
     */
    removeClass: function (className) {
        if (this.hasClass(className)) {
            var id = this._attr['id'];
            this.classNameCache.erase(className);
            this.updateNodeClassNameById();
        }
        return this;
    },

    removeAllClasses:function(){
        this.set('class', '');
        this.classNameCache = [];
    },


    updateNodeClassNameById: function () {
        this.set('class', this.classNameCache.join(' '));
    },

    getId: function () {
        return this.id;
    },

    getUrl: function () {
        return 'url(#' + this.id + ')';
    },

    /**
     * Returns nodes position relative to parent
     * @function position()
     * @returns {Object}
     * @memberof ludo.svg.Node.prototype
     * @example
     * var pos = node.position(); // returns {x: 100, y: 200 }
     *
     */
    position: function () {
        var bbox = this.getBBox();

        if (this.tagName == 'g') {
            if (this._matrix != undefined) {
                var translate = this._matrix.getTranslate();
                return {
                    left: translate[0],
                    top: translate[1]
                }
            } else {
                return {left: 0, top: 0};
            }

        }
        var off = [0, 0];
        if (this._matrix != undefined) {
            off = this._matrix.getTranslate();
        }
        return {
            left: bbox.x + off[0],
            top: bbox.y + off[1]
        }
    },

    /**
     * Returns nodes position relative to top SVG element
     * @memberof ludo.svg.Node.prototype
     * @returns {Object}
     * @example
     * var pos = node.offset(); // returns {x: 100, y: 200 }
     */
    offset: function () {
        var pos = this.position();

        var p = this.parentNode;
        while (p && p.tagName != 'svg') {
            var parentPos = p.position();
            pos.left += parentPos.left;
            pos.top += parentPos.top;
            p = p.parentNode;
        }

        return pos;


    },

    /**
     * Returns bounding box of el as an object with x,y, width and height.
     *
     * @function getBBox
     * @return {Object}
     * @memberof ludo.svg.Node.prototype
     */
    getBBox: function () {

        if (this.tagName == 'g' || this.tagName == 'text') {
            return this.el.getBBox();
        }
        if (this._bbox == undefined || this.dirty) {
            var attr = this._attr;

            switch (this.tagName) {
                case 'rect':
                    this._bbox = {
                        x: attr.x || 0,
                        y: attr.y || 0,
                        width: attr.width,
                        height: attr.height
                    };
                    break;
                case 'circle':
                    this._bbox = {
                        x: attr.cx - attr.r,
                        y: attr.cy - attr.r,
                        width: attr.r * 2,
                        height: attr.r * 2
                    };
                    break;
                case 'ellipse':
                    this._bbox = {
                        x: attr.cx - attr.rx,
                        y: attr.cy - attr.ry,
                        width: attr.rx * 2,
                        height: attr.ry * 2
                    };
                    break;
                case 'path':
                    this._setBBoxOfPath('d');
                    break;
                case 'polyline':
                case 'polygon':
                    this._setBBoxOfPath('points');
                    break;

                case 'image':
                    var rect = this.el.getBoundingClientRect();
                    this._bbox = {x: attr.x || 0, y: attr.y || 0, width: rect.width, height: rect.height};
                    break;

                default:
                    this._bbox = {x: 0, y: 0, width: 0, height: 0};


            }
        }

        return this._bbox;
    },

    _setBBoxOfPath: function (property) {
        var p = this._attr[property];
        p = p.replace(/,/g, ' ');
        p = p.replace(/([a-z])/g, '$1 ');
        p = p.replace(/\s+/g, ' ');

        if (property == 'd2') {

            if (this.el.getBoundingClientRect != undefined) {
                var r = this.el.getBoundingClientRect();
                var tr = this.getTranslate();
                var parent = this.el.parentNode.getBoundingClientRect();

                if (r != undefined) {
                    this._bbox = {
                        x: r.left - tr[0] - parent.left, y: r.top - tr[1] - parent.top,
                        width: r.width,
                        height: r.height
                    };
                    console.log(r, parent);
                    return;
                }
            }
        }


        p = p.replace(/\s+/g, ' ');
        p = p.trim();


        var points = p.split(/\s/g);
        var minX, minY, maxX, maxY;
        var currentChar = undefined;

        var i=0;
        while(i < points.length) {

            p = points[i];

            if (isNaN(p)) {
                p = p.toLowerCase();

                if (p == 'l' || p == 'm') {
                    currentChar = p;
                    i++;
                    yi = i + 2;

                }
            }

            if (!isNaN(points[i])) {
                var x = parseFloat(points[i]);
                if (minX == undefined || x < minX)minX = x;
                if (maxX == undefined || x > maxX)maxX = x;


                var y = parseFloat(points[i+1]);
                if (minY == undefined || y < minY)minY = y;
                if (maxY == undefined || y > maxY)maxY = y;

                i+=2;
            }else{
                i++;
            }
        }

        this._bbox = {
            x: minX, y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    },

    /**
     * Returns rectangular size of element, i.e. bounding box width - bounding box x and
     * bounding box width - bounding box y. Values are returned as { x : 100, y : 150 }
     * where x is width and y is height.
     * @function getSize
     * @return {Object} size x and y
     * @memberof ludo.svg.Node.prototype
     */
    getSize: function () {
        var b = this.getBBox();
        return {
            x: b.width - b.x,
            y: b.height - b.y
        };
    },

    /**
     * The nearest ancestor 'svg' element. Null if the given element is the outermost svg element.
     * @function svg
     * @return {ludo.svg.Node.el} svg
     * @memberof ludo.svg.Node.prototype
     */
    svg: function () {
        return this.el.ownerSVGElement;
    },
    /**
     * The element which established the current viewport. Often, the nearest ancestor ‘svg’ element. Null if the given element is the outermost svg element
     * @function getViewPort
     * @return {ludo.svg.Node.el} svg
     * @memberof ludo.svg.Node.prototype
     */
    getViewPort: function () {
        return this.el.viewPortElement;
    },

    /**
     * Returns rotation as a [degrees, x, y]
     * @function getRotate
     * @memberof ludo.svg.Node.prototype
     * @returns {Array}
     */

    getRotate: function () {
        return this._getMatrix().getRotation();
    },

    /**
     * Set scale
     * @function setScale
     * @param {Number} x
     * @param {Number} y (Optional y scale, assumes x if not set)
     * @memberof ludo.svg.Node.prototype
     */

    setScale: function (x, y) {
        this._getMatrix().setScale(x, y);
    },

    /**
     * Scale SVG node. The difference between scale and setScale is that scale adds to existing
     * scale values
     * @function scale
     * @param {Number} x
     * @param {Number} y
     * @memberof ludo.svg.Node.prototype
     */
    scale: function (x, y) {
        this._getMatrix().scale(x, y);
    },

    /**
     * Set rotation
     * @function setRotate
     * @param {Number} degrees Rotation in degrees
     * @param {Number} x Optional x coordinate to rotate about
     * @param {Number} y Optional x coordinate to rotate about
     * @memberof ludo.svg.Node.prototype
     * @example
     * node.rotate(100); // Rotation is 100
     * node.rotate(50); // Rotation is 50
     */
    setRotate: function (degrees, x, y) {
        this._getMatrix().setRotation(degrees, x, y);
    },

    /**
     * Rotate SVG node
     * @functino rotate
     * @param {Number} degrees Rotation in degrees
     * @param {Number} x Optional x coordinate to rotate about
     * @param {Number} y Optional x coordinate to rotate about
     * @memberof ludo.svg.Node.prototype
     * @example
     * node.rotate(100); // Rotation is 100
     * node.rotate(50); // Rotation is 150
     */
    rotate: function (degrees, x, y) {
        this._getMatrix().rotate(degrees, x, y);
    },

    /**
     * Set SVG translation(movement in x and y direction)
     * @function setTranslate
     * @param {Number} x
     * @param {Number} y
     * @memberof ludo.svg.Node.prototype
     * @example
     * node.setTranslate(500,100);
     * node.setTranslate(550,200); // Node is offset by 550x200 ( second translation overwrites first)
     */
    setTranslate: function (x, y) {
        this._getMatrix().setTranslate(x, y);
    },

    /**
     * Translate SVG node(movement in x and y direction)
     * @function translate
     * @param {Number} x
     * @param {Number} y
     * @memberof ludo.svg.Node.prototype
     * @example
     * node.setTranslate(500,100);
     * node.setTranslate(550,200); // Node is offset by 1050x300 (first translation + second)
     */
    translate: function (x, y) {
        this._getMatrix().translate(x, y);

    },

    _matrix: undefined,
    _getMatrix: function () {
        if (this._matrix == undefined) {
            this._matrix = new ludo.svg.Matrix(this);
        }
        return this._matrix;
    },

    empty: function () {
        this.el.textContent = '';
    },

    /**
     * Function to animate SVG properties such as radius, x,y, colors etc.
     *
     * When animating colors, set colors using the set function and not the css function since CSS fill and stroke has highest priority.
     *
     * For demos, see
     * <a href="../demo/svg/animation.php">animation.php</a>
     * <a href="../demo/svg/animation.php">queued-animation.php</a>
     * <a href="../demo/svg/animation.php">transformation.php</a>
     * <a href="../demo/svg/animation.php">clipping.php</a>
     * <a href="../demo/svg/animation.php">masking.php</a>
     * @function animate
     * @param {Object} properties Properties to animate, example: { x: 100, width: 100 }
     * @param {Object} options Animation options
     * @param {Object} options.duration - Animation duration in milliseconds, default: 400/1000seconds
     * @param {Function} options.easing Reference to ludo.svg.easing easing function, example: ludo.svg.easing.linear
     * @param {Function} options.complete Function to execute on complete
     * @param {Function} options.progress Function executed after each animation step. Argument: completed from 0 to 1
     * @param {Boolean} options.queue True to queue animations for this SVG element. Default: true
     * @param {Function} options.validate Option function called before each step of the animation. If this function returns false, the animation will stop.
     * Arguments: 1) unique id of animation 2) unique id of latest animation for this SVG element. Useful if new animation should stop old animation.
     * @memberof ludo.svg.Node.prototype
     * @example
     * // Animating using properties and options objects.
     * circle.animate({
     *      'cx': 100, cy: 100
     * },{
     *      easing: ludo.svg.easing.bounce,
     *      duration: 1000,
     *      complete:function(){
     *          console.log('Animation complete');
     *      },
     *      progress:function(t){ // float from 0 to 1
     *          console.log('Progress: ' + Math.round(t*100) + '%');
     *      }
     * });
     *
     * // or with duration, easing and complete function as parameters.
     * circle.animate({
     *      'cx': 100, cy: 100
     * }, 400, ludo.svg.easing.bounce, function(){ console.log('finished') });
     *
     *
     */
    animate: function (properties, options, easing, complete) {
        var opt = {};
        if (!jQuery.isPlainObject(options)) {
            opt.duration = options;
            opt.easing = easing;
            opt.complete = complete;
        } else opt = options;
        ludo.svgAnimation.animate(this, properties, opt);
        return this;
    },

    _animation: undefined,

    animation: function () {
        if (this._animation === undefined) {
            this._animation = new ludo.svg.Animation(this.getEl());
        }
        return this._animation;
    },

    /**
     * Bring nodes to front (z index)
     * @function toFront
     * @memberof ludo.svg.Node.prototype
     */
    toFront: function () {
        if (Browser['ie'])this._toFront.delay(20, this); else this._toFront();
    },

    _toFront: function () {
        this.el.parentNode.appendChild(this.el);
    },

    /**
     * Bring nodes to back (z index)
     * @function toFront
     * @memberof ludo.svg.Node.prototype
     */
    toBack: function () {
        if (Browser['ie']) this._toBack.delay(20, this); else this._toBack();
    },

    _toBack: function () {
        this.el.parentNode.insertBefore(this.el, this.el.parentNode.firstChild);
    }
});


/* ../ludojs/src/svg/view.js */
/**
 * Base class for Canvas elements. canvas.View can be handled as
 * {{#crossLink "canvas.Node"}}{{/crossLink}}, but it extends ludo.Core which
 * make it accessible using ludo.get('id'). The {{#crossLink "canvas.Node"}}{{/crossLink}} object
 * can be accessed using {{#crossLink "canvas.View/getNode"}}{{/crossLink}}. A canvas.View
 * object can be adopted to other elements or nodes using the  {{#crossLink "canvas.View/adopt"}}{{/crossLink}}
 * or  {{#crossLink "canvas.Node/adopt"}}{{/crossLink}} methods.
 * A canvas element contains methods for transformations and other
 * @namespace ludo.canvas
 * @class ludo.svg.View
 * @param {Object} config
 * @param {String} config.tag SVG tag name, example "path"
 * @param {Object} config.attr Attributes for the svg tag, example: attr: { "d" : "M 100 100 L 200 200 Z" }
 *
 * @augments ludo.Core
 */
ludo.svg.View = new Class({
    Extends: ludo.Core,

    /**
     * Reference to canvas.Node
     * @property {canvas.Node} node
     * @memberof ludo.svg.View.prototype
     */
    node: undefined,

    tag: undefined,

    engine: ludo.svg,

    p: undefined,

    attr: undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['tag', 'attr']);
        this.node = new ludo.svg.Node(this.tag, this.attr);
    },

    /**
     * Creates a new SVG node
     * @param {String} tag
     * @param {Object} properties
     * @returns {ludo.svg.Node}
     * @memberof ludo.svg.View.prototype
     * @example
     * var circle = svg.$('circle', { r: 50, cx:100,cy:150, fill: '#ff0000' });
     */
    $:function(tag, properties){
        return new ludo.svg.Node(tag, properties);
    },

    /**
     * Return canvas node for this element
     * @function getNode
     * @return {canvas.Node} node
     * @memberof ludo.svg.View.prototype
     */
    getNode: function () {
        return this.node;
    },

    getEl: function () {
        return this.node.el;
    },

    set: function (key, value) {
        this.node.set(key, value);
    },

    /**
     Returns value of an attribute
     @function get
     @memberof ludo.svg.View.prototype
     @param key
     @return {String} value
     @example
     var element = new ludo.svg.View('rect', {
	 		attr:{x1:100,y1:150,x2:200,y2:250}
	 	});
     alert(element.get('x1')); // outputs 100
     */
    get: function (key) {
        return this.node.get( key);
    },

    /**
     * Inserts text to the node if the node supports it
     * @param html
     * @memberof ludo.svg.View.prototype
     */
    html: function (html) {
        this.node.html(html);
    },

    /**
     * Rotate node by this many degrees
     * @function rotate
     * @param {Number} degrees
     * @memberof ludo.svg.View.prototype
     */
    rotate: function (degrees) {
        this.node.rotate(degrees);
    },

    /**
     * Bring view to front (z index)
     * @function toFront
     * @memberof ludo.svg.View.prototype
     */
    toFront: function () {
        this.node.toFront();
    },

    /**
     * Move view back (z-index)
     * @function toBack
     * @memberof ludo.svg.View.prototype
     */
    toBack: function () {
        this.node.toBack();
    },

    /**
     * Skew X by this many degrees
     * @function skewX
     * @param {Number} degrees
     * @memberof ludo.svg.View.prototype
     */
    skewX: function (degrees) {
        this.node.skewX(degrees);
    },

    /**
     * Skew Y by this many degrees
     * @function skewY
     * @param {Number} degrees
     * @memberof ludo.svg.View.prototype
     */
    skewY: function (degrees) {
        this.node.skewY(degrees);
    },

    /**
     * Hide SVG element
     * @function hide
     * @memberof ludo.svg.View.prototype
     */
    hide:function(){
        this.node.hide();
    },

    /**
     * Show SVG element
     * @function show
     * @memberof ludo.svg.View.prototype
     */
    show:function(){
        this.node.show();
    },

    /**
     * Scale SVG element
     * @param {Number} x x-Ratio
     * @param {Number} y y-Ratio
     * @memberof ludo.svg.View.prototype
     */
    scale: function (x, y) {
        this.node.scale(x, y);
    },

    /**
     * Apply CSS attribute to node
     * @param {String} key
     * @param {String|Number} value
     * @memberof ludo.svg.View.prototype
     */
    css: function (key, value) {
        this.node.css(key, value);
    },

    /**
     * Append child node
     * @function append
     * @param {ludo.svg.View|ludo.svg.Node} node
     * @return {canvas.View} parent
     * @memberof ludo.svg.View.prototype
     */
    append: function (node) {
        this.node.append(node);
        return this;
    },

    /**
     * Remove text and child nodes from element
     * @function empty
     * @return {canvas.View} this
     * @memberof ludo.svg.View.prototype
     */
    empty: function () {
        this.node.empty();
        return this;
    },

    // TODO refactor the method below
    /**
     * Appends a new child node and returns it.
     * @function add
     * @param {String} tagName
     * @param {Object} attributes
     * @param {String} text
     * @returns {ludo.svg.Node} created node
     * @memberof ludo.svg.View.prototype
     */

    add: function (tagName, attributes, text) {
        return this.node.add(tagName, attributes, text);
    }
});/* ../ludojs/src/svg/canvas.js */
/**
 Class used to create canvas(&lt;SVG>) object
 @namespace canvas
 @class ludo.svg.Canvas
 @param {Object} config
 @example
 	var canvas = new ludo.svg.Canvas({
 		renderTo:'idOfDiv'
 	});
 */
ludo.svg.Canvas = new Class({
	Extends:ludo.svg.View,
	tag:'svg',
	defaultProperties:{
		xmlns:'http://www.w3.org/2000/svg',
		version:'1.1'
	},
	renderTo:undefined,
	view:undefined,
	title:undefined,
	description:undefined,

	__construct:function (config) {
		config = config || {};
		config.attr = config.attr || {};
		config.attr = Object.merge(config.attr, this.defaultProperties);
		this.parent(config);

        this.__params(config, ['renderTo','title','description']);

		if(this.title)this.createTitle();
		if(this.description)this.createDescription();

		ludo.svg.setGlobalMatrix(this.node.el);

		if (this.renderTo !== undefined) {
			if(this.renderTo.$b !== undefined){
				this.view = this.renderTo;
				this.view.addEvent('resize', this.fitParent.bind(this));
				this.renderTo = this.view.$b();
			}else{
				this.renderTo = jQuery(this.renderTo);
			}
			this.renderTo.append(this.getEl());
			this.setInitialSize(config);
		}
	},

	setInitialSize:function (config) {
		config.width = config.width || this.width;
		config.height = config.height || this.height;
		if (config.width && config.height) {
			this.set('width', config.width);
			this.set('height', config.height);
			this.setViewBox(config.width, config.height);
			this.width = config.width;
			this.height = config.height;
		} else {
			this.fitParent();
			this.renderTo.on('resize', this.fitParent.bind(this));
		}
	},

	fitParent:function(){
		var size = { x: this.renderTo.width(), y: this.renderTo.height() };
		if(size.x === 0 || size.y === 0)return;

		this.set('width', size.x);
		this.set('height', size.y);
		this.setViewBox(size.x, size.y);

		this.node.css('width', size.x + 'px');
		this.node.css('height', size.y + 'px');
		this.width = size.x;
		this.height = size.y;
		this.fireEvent('resize', size);
	},

    /**
     * Returns height of canvas
     * @function getHeight
     * @return {Number} height
	 * @memberof ludo.svg.Canvas.prototype
     */
	getHeight:function(){
		return this.height;
	},

    /**
     * Returns width of canvas
     * @function getWidth
     * @return {Number} width
	 * @memberof ludo.svg.Canvas.prototype
     */
	getWidth:function(){
		return this.width;
	},

    /**
     * Returns center point of canvas as an object with x and y coordinates
     * @function getCenter
     * @return {Object}
	 * @memberof ludo.svg.Canvas.prototype
     */
    getCenter:function(){
        return {
            x : this.width / 2,
            y : this.height / 2
        };
    },

	/**
	 * Update view box size
	 * @function setViewBox
	 * @param {Number} width Viewbox width
	 * @param {Number} height Viewbox height
	 * @param {Number} x Optional left/x position
	 * @param {Number} y Optional top/y position
	 * @memberof ludo.svg.Canvas.prototype
	 */
	setViewBox:function (width, height, x, y) {
		this.set('viewBox', (x || 0) + ' ' + (y || 0) + ' ' + width + ' ' + height);
	},

	createTitle:function(){
		this.append(new ludo.svg.Node('title',{}, this.title ));
	},
	createDescription:function(){
		this.append(new ludo.svg.Node('desc', {}, this.description ));
	},


	/**
	 * Create a SVG Stylesheet
	 * @param {String} className
	 * @param {Object} styles
	 * @memberof ludo.svg.Canvas.prototype
	 * @example
	 * svg.addStyleSheet('box', { fill : '#669900', stroke: '#000' });
	 * // Use the class
	 * var rect = new ludo.svg.Rect({
     *   	x:0,y:0,width:500,height:500
     * });
	 * svg.append(rect);
	 * rect.addClass('box');
     */
	addStyleSheet:function(className, styles){
		var p = new ludo.svg.Paint(styles, { className : className });
		this.appendDef(p);
	},


	defsNode:undefined,

	/**
	 * Returns reference to &lt;defs> node
	 * @function getDefs
	 * @return {canvas.Node} defs node
	 * @memberof ludo.svg.Canvas.prototype
	 */
	getDefs:function(){
		if(this.defsNode === undefined){
			this.defsNode = new ludo.svg.Node('defs');
			this.append(this.defsNode);
		}
		return this.defsNode;
	},

	/**
	 * Adopt node into &lt;defs> tag of canvas
	 * @function appendDef
	 * @param {canvas.Node|canvas.View} node
	 * @return {canvas.Node} defs Node
	 * @memberof ludo.svg.Canvas.prototype
	 */
	appendDef:function(node){
		return this.getDefs().append(node);
	}
});/* ../ludojs/src/layout/text-box.js */
ludo.layout.TextBox = new Class({
    Extends: ludo.svg.Canvas,
    rotation: 270,
    text: undefined,
    className: undefined,
    classNameOver: undefined,
    width: 200, height: 200,
    size: {
        x: 0, y: 0
    },
    x: 0, y: 0,
    colorUtil:undefined,

    __construct: function (config) {
        this.text = config.text;
        this.rotation = config.rotation;
        this.className = config.className;
        this.classNameOver = config.classNameOver || config.className;
        this.renderTo = config.renderTo;
        if (config.x !== undefined)this.x = config.x;
        if (config.y !== undefined)this.y = config.y;

        if (document.createElementNS === undefined) {
            this.createIE8Box(config);
            return;
        }
        this.parent(config);

        this.createStyles();
        this.renderText();
        this.storeSize();
        this.rotate();
        this.resizeCanvas();




    },

    createIE8Box: function () {
        var span = document.createElement('span');
        jQuery(this.renderTo).append(jQuery(span));
        span.innerHTML = this.text;
        this.setIE8Transformation(span);
        return span;
    },

    setIE8Transformation: function (span) {
        var s = span.style;
        s.display = 'block';
        s.visibility = 'hidden';
        s.position = 'absolute';
        span.className = this.className;
        jQuery(document.body).append(span);

        s.fontSize = '12px';
        s.fontWeight = 'normal';
        s.filter = "progid:DXImageTransform.Microsoft.Matrix(" + this.getIE8Transformation() + ", sizingMethod='auto expand')";
        s.height = span.height() + 'px';
        this.size.x = span.width();
        this.size.y = span.height();
        if (this.rotation === 90) {
            s.right = '0px';
        }
        s.visibility = 'visible';
        document.id(this.renderTo).appendChild(span);

    },

    leave:function(){
        this.textNode.removeClass(this.classNameOver + 'svg');
        this.textNode.addClass(this.className + 'svg');
    },

    enter:function(){
        this.textNode.addClass(this.classNameOver + 'svg');
    },

    deg2radians: Math.PI * 2 / 360,

    getIE8Transformation: function () {
        var rad = this.rotation * this.deg2radians;
        var costheta = Math.cos(rad);
        var sintheta = Math.sin(rad);
        return ['M11=' + costheta, 'M12=' + (sintheta * -1), 'M21=' + sintheta, 'M22=' + costheta].join(',');
    },
    resizeCanvas: function () {
        var size = this.getSize();
        this.setViewBox(size.x, size.y);
        this.set('width', size.x);
        this.set('height', size.y);
    },

    createStyles: function () {
        this.styles = ludo.svg.Util.textStyles(this.className);
        this.stylesOver = ludo.svg.Util.textStyles(this.classNameOver);
        this.stylesOver['font-size'] = this.styles['font-size'];
        this.stylesOver['line-height'] = this.styles['line-height'];

        this.addStyleSheet(this.className + 'svg', this.styles);
        this.addStyleSheet(this.classNameOver + 'svg', this.stylesOver);

    },

    renderText: function () {
        var el = this.textNode = new ludo.svg.Node('text', {
            x: this.x,
            y: this.y + parseInt(this.styles['font-size']),
            "class": this.className + 'svg'
        });
        el.text(this.text);
        this.append(el);
    },

    storeSize: function () {
        var bbox = this.textNode.el.getBBox();
        this.size = {
            x: bbox.width + bbox.x,
            y: bbox.height + bbox.y
        };
    },
    rotate: function () {
        var x = this.size.x;
        var y = this.size.y;
        var yOffset = (this.size.y - parseInt(this.styles['line-height'])) / 2;
        var transformation = '';
        switch (this.rotation) {
            case 270:
                transformation = 'translate(' + (yOffset * -1) + ' ' + x + ') rotate(' + this.rotation + ')';
                break;
            case 180:
                transformation = 'rotate(' + this.rotation + ' ' + (x / 2) + ' ' + (y / 2) + ')';
                break;
            case 90:
                transformation = 'translate(' + (y - yOffset) + ' ' + 0 + ') rotate(' + this.rotation + ')';
                break;
            case 0:
                transformation = 'translate(0 ' + (yOffset * -1) + ')';

        }
        this.textNode.set('transform', transformation);
    }, 

    getSize: function () {
        switch (this.rotation) {
            case 270:
            case 90:
                return {x: this.size['y'], y: this.size['x']};
            default:
                return this.size;

        }
    }
});/* ../ludojs/src/layout/resizer.js */
ludo.layout.Resizer = new Class({
    Extends: ludo.Core,
    type:'layout.Resizer',
    layout: {},
    orientation: undefined,
    view: undefined,
    dd: undefined,
    pos: undefined,
    isActive: false,
    hidden: false,
    lm:undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['orientation', 'view', 'layout', 'pos', 'hidden','lm']);
        this.createDOM(config.renderTo);
        this.addViewEvents();
        this.createDragable();


        if(this.lm.type=='layout.Docking' && this.lm.collapsed){
            this.hidden = true;
        }
        if (this.hidden)this.hide();
        
        this.lm.on('collapse', this.hide.bind(this));
        this.lm.on('expand', this.show.bind(this));
    },

    createDOM: function (renderTo) {
        this.el = jQuery('<div>');
        this.el.on('mouseenter', this.enterResizer.bind(this));
        this.el.on('mouseleave', this.leaveResizer.bind(this));
        this.el.addClass("ludo-resize-handle");
        this.el.addClass('ludo-resize-handle-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));
        this.el.addClass('ludo-layout-resize-' + ((this.orientation === 'horizontal') ? 'col' : 'row'));

        this.el.css({
            cursor: (this.orientation == 'horizontal' ? 'ew-resize' : 'ns-resize'),
            zIndex: 100000
        });

        renderTo.append(this.el);

    },

    enterResizer: function () {
        if (!this.isActive) {
            this.el.css('z-index', parseInt(this.el.css('z-index')) + 1);
            this.el.addClass('ludo-resize-handle-active');
        }
    },

    leaveResizer: function () {
        if (!this.isActive) {
            this.el.css('z-index', parseInt(this.el.css('z-index')) - 1);
            this.el.removeClass('ludo-resize-handle-active');
        }
    },
    createDragable: function () {
        this.dd = new ludo.effect.Drag({
            directions: this.orientation == 'horizontal' ? 'X' : 'Y'
        });
        this.dd.addEvent('before', this.beforeDrag.bind(this));
        this.dd.addEvent('end', this.endDrag.bind(this));
        this.dd.add(this.el);
    },

    beforeDrag: function () {
        this.dd.setMinX(30);
        this.isActive = true;
        this.el.removeClass('ludo-resize-handle-active');
        this.el.addClass('ludo-resize-handle-active');
        this.fireEvent('before', [this, this.view]);
        this.fireEvent('startResize');
    },

    setMinWidth: function (x) {
        if (this.pos === 'left') {
            var el = this.view.getEl();
            this.dd.setMaxX(el.position().left + el.width() - x);
        } else {
            this.dd.setMinX(this.view.getEl().position().left + x);
        }
    },

    setMaxWidth: function (x) {
        var el = this.view.getEl();
        if (this.pos === 'right') {
            this.dd.setMaxX(el.position().left + x);
        } else {
            var pos = 0;
            if (this.layout.affectedSibling) {
                pos = this.layout.affectedSibling.getEl().position().left + 10;
            }
            this.dd.setMinX(Math.max(pos, el.position().left + el.width() - x));
        }
    },

    setMinHeight: function (y) {
        if (this.pos === 'above') {
            var el = this.view.getEl();
            this.dd.setMaxY(el.position().top + el.height() - y);
        } else {
            this.dd.setMinY(this.view.getEl().position().top + y);
        }

    },

    setMaxHeight: function (y) {
        var el = this.view.getEl();
        if (this.pos === 'below') {
            this.dd.setMaxY(el.position().top + y);
        } else {
            var pos = 10;
            if (this.layout.affectedSibling) {
                pos = this.layout.affectedSibling.getEl().position().top + 10;
            }
            this.dd.setMinY(Math.max(pos, el.position().top + el.height() - y));
        }
    },

    endDrag: function (dragged, dd) {
        this.el.removeClass('ludo-resize-handle-over');
        this.el.removeClass('ludo-resize-handle-active');
        var change = this.orientation === 'horizontal' ? dd.getDraggedX() : dd.getDraggedY();
        if (this.pos === 'left' || this.pos === 'above') {
            change *= -1;
        }
        this.fireEvent('resize', change);
        this.fireEvent('stopResize');
        this.isActive = false;
    },

    getEl: function () {
        return this.el;
    },

    addViewEvents: function () {
        this.view.addEvent('maximize', this.show.bind(this));
        this.view.addEvent('expand', this.show.bind(this));
        this.view.addEvent('minimize', this.hide.bind(this));
        this.view.addEvent('collapse', this.hide.bind(this));
        this.view.addEvent('hide', this.hide.bind(this));
        this.view.addEvent('show', this.show.bind(this));
    },

    show: function () {
        this.el.css('display', '');
        this.hidden = false;
    },

    hide: function () {
        this.hidden = true;
        this.el.css('display', 'none');
    },

    getWidth: function () {
        return this.hidden ? 0 : 5;
    },

    getHeight: function () {
        return this.hidden ? 0 : 5;
    },

    resize: function (config) {

        this.el.css({
            left: '', top: '', right: '', bottom: ''
        });
        
        if (config.width !== undefined && config.width > 0)this.el.css('width', config.width);
        if (config.height !== undefined && config.height > 0)this.el.css('height', (config.height - ludo.dom.getMBPH(this.el)));
        if (config.left !== undefined)this.el.css('left', config.left);
        if (config.top !== undefined)this.el.css('top', config.top);
        if (config.bottom !== undefined)this.el.css('bottom', config.bottom);
        if (config.right !== undefined)this.el.css('right', config.right);
    },

    getParent: function () {

    },
    setParentComponent: function () {

    },
    isVisible: function () {
        return !this.hidden;
    },
    isHidden: function () {
        return this.hidden;
    },

    hasChildren: function () {
        return false;
    },

    isFormElement: function () {
        return false;
    }
});/* ../ludojs/src/layout/base.js */
/**
 *  @namespace ludo.layout
 */
/**
 * Base class for ludoJS layouts
 *
 * For tutorial on layouts, see <a href="http://www.ludojs.com/learn/layout.html">ludojs.com/learn/layout.html</a>
 *
 * @namespace ludo.layout
 * @class ludo.layout.Base
 * @property {object} viewport
 * @property {Number} viewport.width - Inner width of View's body
 * @property {Number} viewport.height - Inner height of View's body
 * @fires ludo.layout.Base#rendered Fired after all children has been rendered and resized. Arguments: 1) the layout, 2) Parent view
 * @fires ludo.layout.Base#addChild Fired after adding new child to parent view. Arguments: 1) Layout, 2) parent view, 3) child
 * @fires ludo.layout.Base#addChildRuntime Fired after adding new child to parent during runtime, i.e. after first rendering with
 * code <code>view.addChild()</code>. Arguments: 1) Layout, 2) parent view, 3) child
 *
 */
ludo.layout.Base = new Class({
    Extends: Events,
    view: null,
    tabStrip: null,
    resizables: [],
    benchmarkTime: false,
    dependency: {},
    viewport: undefined,
    resized: false,

    hasWrapWidth: undefined,
    hasWrapHeight: undefined,

    initialize: function (view) {
        this.id = String.uniqueID();
        this.view = view;
        this.viewport = {
            top: parseInt(this.view.$b().css('padding-top')),
            left: parseInt(this.view.$b().css('padding-left')),
            width: 0, height: 0,
            bottom: 0, right: 0
        };


        if (view.$b())this.onCreate();

        this.hasWrapWidth = !view.layout.weight && view.layout.width == 'wrap';
        this.hasWrapHeight = !view.layout.weight && view.layout.height == 'wrap';


    },

    prepareForChildrenOnCreate: function () {

    },

    onCreate: function () {


        if (this.view.layout.collapseBar) {
            this.addCollapseBars();
        }
        if (this.view.layout.listeners != undefined) {
            this.addEvents(this.view.layout.listeners);
        }

        this.fireEvent('create', [this, this.view]);
    },
    /**f
     * Method executed when adding new child view to a layout
     * @function addChild
     * @param {ludo.View} child
     * @param {ludo.View} insertAt
     * @optional
     * @param {String} pos
     * @optional
     * @memberof ludo.layout.Base.prototype
     */
    addChild: function (child, insertAt, pos) {


        child = this.getValidChild(child);
        child = this.getNewComponent(child);
        var parentEl = this.getParentForNewChild(child);
        parentEl = jQuery(parentEl);
        if (insertAt) {
            var children = [];
            for (var i = 0; i < this.view.children.length; i++) {
                if (pos == 'after') {
                    children.push(this.view.children[i]);
                    parentEl.append(this.view.children[i].getEl());
                }
                if (this.view.children[i].getId() == insertAt.getId()) {
                    children.push(child);
                    parentEl.append(child.getEl());
                }
                if (pos == 'before') {
                    children.push(this.view.children[i]);
                    parentEl.append(this.view.children[i].getEl());
                }
            }
            this.view.children = children;
        } else {
            this.view.children.push(child);
            var el = child.getEl();
            parentEl.append(el);
        }

        this.onNewChild(child);


        this.addChildEvents(child);

        this.fireEvent('addChild', [this, this.view, child]);

        if (this.firstResized) {
            this.fireEvent('addChildRuntime', [this, this.view, child])
        }
        return child;
    },
    /**
     * Return parent DOM element for new child
     * @function getParentForNewChild
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    getParentForNewChild: function () {
        return jQuery(this.view.els.body);
    },

    layoutProperties: ['collapsed'],

    getValidChild: function (child) {
        return child;
    },

    /**
     * Implementation in sub classes
     * @function onNewChild
     * @private
     * @memberof ludo.layout.Base.prototype
     */
    onNewChild: function (child) {
        var keys = this.layoutProperties;
        for (var i = 0; i < keys.length; i++) {
            if (child.layout[keys[i]] === undefined && child[keys[i]] !== undefined) {
                child.layout[keys[i]] = child[keys[i]];
            }
        }
    },

    addChildEvents: function () {

    },
    firstResized: false,


    resizeChildren: function () {
        if (this.benchmarkTime) {
            var start = new Date().getTime();
        }
        if (this.view.isHidden()) {
            return;
        }
        if (this.idLastDynamic === undefined) {
            this.setIdOfLastChildWithDynamicWeight();
        }

        this.storeViewPortSize();

        if (!this.firstResized) {
            this.beforeFirstResize();

        }

        this.resize();


        if (!this.firstResized) {

            this.firstResized = true;

            if (this.hasWrapHeight) {
                this.view.layout.height = this.viewport.height = this.getWrappedHeight();
            }
            if (this.hasWrapWidth) {
                this.view.layout.width = this.viewport.width = this.getWrappedWidth();
            }

            if (this.hasWrapHeight || this.hasWrapWidth) {
                this.view.resize({
                    height: this.view.layout.height,
                    width: this.view.layout.width
                });
                this.storeViewPortSize();
                this.hasWrapWidth = false;
                this.hasWrapHeight = false;
            }

            this.fireEvent('rendered', [this, this.view]);
            this.afterRendered();
        }


        if (this.benchmarkTime) {
            ludo.util.log("Time for resize(" + this.view.layout.type + "): " + (new Date().getTime() - start));
        }


    },

    afterRendered: function () {

    },

    hasBeenRendered: function () {
        return this.firstResized;
    },

    beforeFirstResize: function () {

    },

    getWrappedHeight: function () {
        return this.view.getEl().outerHeight(true) - this.view.$b().height();
    },

    getWrappedWidth: function () {
        return 0;
    },


    storeViewPortSize: function () {
        this.viewport.absWidth = this.getAvailWidth();
        this.viewport.absHeight = this.getAvailHeight();
        this.viewport.width = this.getAvailWidth();
        this.viewport.height = this.getAvailHeight();
    },

    previousContentWidth: undefined,

    idLastDynamic: undefined,

    setIdOfLastChildWithDynamicWeight: function () {
        for (var i = this.view.children.length - 1; i >= 0; i--) {
            if (this.hasLayoutWeight(this.view.children[i])) {
                this.idLastDynamic = this.view.children[i].id;
                return;
            }
        }
        this.idLastDynamic = 'NA';
    },

    hasLayoutWeight: function (child) {
        return child.layout !== undefined && child.layout.weight !== undefined;
    },

    getNewComponent: function (config) {
        config.renderTo = this.view.$b();
        config.type = config.type || this.view.cType;
        config.parentComponent = this.view;
        return ludo.factory.create(config);
    },

    isLastSibling: function (child) {
        var children = this.view.initialItemsObject;
        if (children.length) {
            return children[children.length - 1].id == child.id;
        } else {
            return this.view.children[this.view.children.length - 1].id == child.id;
        }
    },

    prepareView: function () {

    },

    resize: function () {
        var config = {};
        config.width = this.view.$b().width();
        if (config.width < 0) {
            config.width = undefined;
        }
        for (var i = 0; i < this.view.children.length; i++) {
            this.view.children[i].resize(config);
        }
    },

    getAvailWidth: function () {
        return this.view.$b().width();
    },

    getAvailHeight: function () {
        return this.view.$b().height();
    },

    addCollapseBars: function () {
        var pos = this.view.layout.collapseBar;
        if (!ludo.util.isArray(pos))pos = [pos];
        for (var i = 0; i < pos.length; i++) {
            this.addChild(this.getCollapseBar(pos[i]));
        }
    },

    collapseBars: {},
    getCollapseBar: function (position) {
        position = position || 'left';
        if (this.collapseBars[position] === undefined) {
            var bar = this.collapseBars[position] = new ludo.layout.CollapseBar({
                position: position,
                parentComponent: this.view,
                parentLayout: this.view.layout,
                listeners: {
                    'show': this.toggleCollapseBar.bind(this),
                    'hide': this.toggleCollapseBar.bind(this)
                }
            });
            this.updateViewport(bar.getChangedViewport());
        }
        return this.collapseBars[position];
    },

    toggleCollapseBar: function (bar) {
        this.updateViewport(bar.getChangedViewport());
        this.resize();
    },
    /**
     * Update viewport properties, coordinates of DHTML Container for child views, i.e. body of parent view
     * @function updateViewport
     * @param {Object} c
     * @memberof ludo.layout.Base.prototype
     */
    updateViewport: function (c) {

        if (c)this.viewport[c.key] = c.value;
    },

    createRenderer: function () {
        if (this.renderer === undefined) {
            this.renderer = this.dependency['renderer'] = new ludo.layout.Renderer({
                view: this.view
            });
        }
        return this.renderer;
    },

    getRenderer: function () {
        return this.renderer ? this.renderer : this.createRenderer();
    },

    /**
     * Executed when a child is hidden. It set's the internal layout properties width and height to 0(zero)
     * @function hideChild
     * @param {ludo.View} child
     * @private
     * @memberof ludo.layout.Base.prototype
     */
    hideChild: function (child) {
        this.setTemporarySize(child, {
            width: 0, height: 0
        });
    },


    /**
     * Executed when a child is minimized. It set's temporary width or properties
     * @function minimize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    minimize: function (child, newSize) {
        this.setTemporarySize(child, newSize);
        this.resize();
    },

    /**
     * Store temporary size when a child is minimized or hidden
     * @function setTemporarySize
     * @param {ludo.View} child
     * @param {Object} newSize
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    setTemporarySize: function (child, newSize) {
        if (newSize.width !== undefined) {
            child.layout.cached_width = child.layout.width;
            child.layout.width = newSize.width;
        } else {
            child.layout.cached_height = child.layout.height;
            child.layout.height = newSize.height;
        }
    },
    /*
     * Clear temporary width or height values. This method is executed when a child
     * is shown or maximized
     * @function clearTemporaryValues
     * @param {ludo.View} child
     * @protected
     * @memberof ludo.layout.Base.prototype
     */
    clearTemporaryValues: function (child) {
        if (child) {
        }
        if (child.layout.cached_width !== undefined)child.layout.width = child.layout.cached_width;
        if (child.layout.cached_height !== undefined)child.layout.height = child.layout.cached_height;
        child.layout.cached_width = undefined;
        child.layout.cached_height = undefined;
        this.resize();
    },

    getWidthOf: function (child) {
        return child.layout.width;
    },



    heightSizeForWrap:function(forChild){
        var ret = {
            width: this.viewport.width, height:this.viewport.height
        };
        jQuery.each(this.view.children, function(i, child){
            if(child.id != forChild.id && child.layout != undefined && !isNaN(child.layout.height)){
                ret.height -= child.layout.height
            }
        });
        return ret;
    },

    getHeightOf: function (child) {
        var h = child.wrappedHeight != undefined ? child.wrappedHeight(this.heightSizeForWrap(child)) : undefined;
        if (h != undefined)return h;
        if (child.layout.height == 'wrap') {
            child.layout.height = child.getEl().outerHeight(true);
        }
        return isNaN(child.layout.height) ? child.getEl().outerHeight(true) : child.layout.height;
    }
});/* ../ludojs/src/layout/factory.js */
/**
 * Factory class for layout managers
 * @namespace ludo.layout
 * @class ludo.layout.Factory
 */
ludo.layout.Factory = new Class({

	getManager:function(view){
		var cls = this.getLayoutClass(view);
		if(ludo.layout[cls] == undefined){
			console.error("layout class " + cls + " is not valid")
		}
		return new ludo.layout[cls](view);
	},

    /**
     * Returns correct name of layout class
     * @function getLayoutClass
     * @param {ludo.View} view
     * @return {String} className
	 * @memberof ludo.layout.Factory.prototype
     * @private
     */
	getLayoutClass:function(view){
		if(!view.layout || !view.layout.type)return 'Base';


		switch(view.layout.type.toLowerCase()){
			case "docking":
				return "Docking";
			case "accordion":
				return "Accordion";
			case "table":
				return "Table";
            case 'navbar':
                return 'NavBar';
			case 'relative':
				return 'Relative';
			case 'fill':
				return 'Fill';
			case 'viewpager':
				return 'ViewPager';
			case 'card':
				return 'Card';
			case 'grid':
				return 'Grid';
            case 'menu':
                return ['Menu', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
			case 'tabs':
			case 'tab':
				return 'Tab';
			case 'column':
			case 'cols':
				return 'LinearHorizontal';
			case 'popup':
				return 'Popup';
			case 'canvas':
				return 'Canvas';
			case 'rows':
			case 'row':
				return 'LinearVertical';
			case 'linear':
				return ['Linear', (view.layout.orientation && view.layout.orientation.toLowerCase()=='horizontal') ? 'Horizontal' : 'Vertical'].join('');
			default:
				return 'Base';
		}
	},

    /**
     * Returns valid layout configuration for a view
     * @function getValidLayoutObject
     * @param {ludo.View} view
     * @param {Object} config
     * @return {Object}
     * @private
	 * @memberof ludo.layout.Factory.prototype
     */
	getValidLayoutObject:function(view, config){

		view.layout = this.toLayoutObject(view.layout);
		config.layout = this.toLayoutObject(config.layout);

		if(!this.hasLayoutProperties(view, config)){
			return {};
		}

		var ret = this.getMergedLayout(view.layout, config.layout);


		if (typeof ret === 'string') {
			ret = { type:ret }
		}

		ret = this.transferFromView(view, config, ret);

		if(ret.left === undefined && ret.x !== undefined)ret.left = ret.x;
		if(ret.top === undefined && ret.y !== undefined)ret.top = ret.y;

		if (ret.aspectRatio) {
			if (ret.width) {
				ret.height = Math.round(ret.width / ret.aspectRatio);
			} else if (ret.height) {
				ret.width = Math.round(ret.height * ret.aspectRatio);
			}
		}
		
        ret.type = ret.type || 'Base';
		return ret;
	},

	toLayoutObject:function(obj){
		if(!obj)return {};
		if(ludo.util.isString(obj))return { type : obj };
		return obj;
	},

	hasLayoutProperties:function(view, config){
		if(view.layout || config.layout)return true;
		var keys = ['left','top','height','width','weight','x','y'];
		for(var i=0;i<keys.length;i++){
			if(config[keys[i]] !== undefined || view[keys[i]] !== undefined)return true;
		}
		return false;
	},

	transferFromView:function(view, config, ret){
		var keys = ['left','top','width','height','weight','x','y'];
		for(var i=0;i<keys.length;i++){
			if(ret[keys[i]] === undefined && (config[keys[i]] !== undefined || view[keys[i]] !== undefined))ret[keys[i]] = config[keys[i]] || view[keys[i]];
            view[keys[i]] = undefined;
		}
		return ret;
	},

    /**
     * Returned merged layout object, i.e. layout defind on HTML page merged
     * with internal layout defined in class
     * @function getMergedLayout
     * @param {Object} layout
     * @param {Object} mergeWith
     * @return {Object}
     * @private
	 * @memberof ludo.layout.Factory.prototype
     */
	getMergedLayout:function(layout, mergeWith){
		for(var key in mergeWith){
			if(mergeWith.hasOwnProperty(key)){
				layout[key] = mergeWith[key];
			}
		}
		return layout;
	}
});

ludo.layoutFactory = new ludo.layout.Factory();/* ../ludojs/src/data-source/base.js */
/**
 * @namespace ludo.dataSource
 */

/**
 * Base class for data sources
 *
 * @class ludo.dataSource.Base
 * @augments ludo.Core, 'resource', 'service', 'arguments'
 * @param {String} url URL for the data source
 * @param {Object} postData Data to post with the request, example: postData: { getUsers: ' }
 * @param {Boolean} autoload Load data from server when the datasource is instantiated.
 * @param {Boolean} singleton True to make a data source singleton. This is something you do if you create
 * your own data sources and only want one instance of it. To make this work, your datasource needs to have a
 * type attribute. Example:
 * <code>
 *     myApp.dataSource.Countries = new Class({ type:'datasourceCountries'
 * </code>
 * @param {Function} dataHandler Custom function which receives data from server and returns data in appropriate format for the data source.
 * If this function returns false, it will trigger the fail event.
 *
 */
ludo.dataSource.Base = new Class({
	Extends:ludo.Core,
	singleton:false,
	url:undefined,
	postData:undefined,
	data:undefined,
	autoload:true,
	method:'post',

	inLoadMode:false,
	dataHandler:undefined,
	
	shim:undefined,
	
	__waiting:false,

	__construct:function (config) {
		this.parent(config);
		if(config.data != undefined)this.autoload = false;
		this.__params(config, ['method', 'url', 'autoload', 'shim','dataHandler']);

		
		this.on('init', this.setWaiting.bind(this));
		this.on('complete', this.setDone.bind(this));
		
		if(this.postData == undefined){
			this.postData = {};
		}
		if(config.postData != undefined){
			this.postData = Object.merge(this.postData, config.postData);
		}

		if(this.dataHandler == undefined){
			this.dataHandler = function(json){
				return jQuery.isArray(json) ? json : json.response != undefined ? json.response : json.data != undefined ? json.data : false;
			}
		}

		if(config.data != undefined){
			this.setData(config.data);
		}
		
	},
	
	setWaiting:function(){
		this.__waiting = true;
	},
	
	setDone:function(){
		this.__waiting = false;	
	},

	isWaitingData:function(){
		return this.__waiting;
	},

	setPostData:function(key, value){
		this.postData[key] = value;
	},

	ludoEvents:function () {
		if (this.autoload)this.load();
	},

	/**
	 * Send a new request
	 * @memberof ludo.dataSource.Base.prototype
	 * @function sendRequest
	 * @param {String} service
	 * @param {Array} arguments
	 * @optional
	 * @param {Object} data
	 * @optional
	 */
	sendRequest:function (data) {
		this.arguments = arguments;
		this.beforeLoad();

		this.fireEvent('init', this);


	},


	setData:function(data){

	},

	/**
	 * Has data loaded from server
	 * @function hasData
	 * @return {Boolean}
	 * @memberof ludo.dataSource.Base.prototype
	 */
	hasData:function () {
		return (this.data !== undefined);
	},
	/**
	 * Return data loaded from server
	 * @function getData
	 * @return {Object|Array}
	 * @memberof ludo.dataSource.Base.prototype
	 */
	getData:function () {
		return this.data;
	},


	setPostParam:function (param, value) {
		this.postData[param] = value;
	},

	/**
	 * Return data-source type(HTML or JSON)
	 * @function getSourceType
	 * @return string source type
	 * @memberof ludo.dataSource.Base.prototype
	 */
	getSourceType:function () {
		return 'JSON';
	},

	beforeLoad:function () {
		this.inLoadMode = true;
		this.fireEvent('beforeload');
	},

	load:function () {

	},

	/**
	 * Load content from a specific url
	 * @function loadUrl
	 * @param url
	 * @memberof ludo.dataSource.Base.prototype
	 */
	loadUrl:function (url) {
		this.url = url;
		this._request = undefined;
		this.load();
	},

	parseNewData:function () {
		this.inLoadMode = false;
	},

	isLoading:function () {
		return this.inLoadMode;
	},

	getPostData:function () {
		return this.postData;
	}
});/* ../ludojs/src/data-source/json.js */
/**
 * Class for remote data source.
 * @namespace ludo.dataSource
 * @class ludo.dataSource.JSON
 * @augments ludo.dataSource.Base
 */
ludo.dataSource.JSON = new Class({
    Extends:ludo.dataSource.Base,
    type:'dataSource.JSON',

    _loaded:false,




    /**
     * Reload data from server
     * Components using this data-source will be automatically updated
     * @function load
     * @return void
     * @memberof ludo.dataSource.JSON.prototype
     */
    load:function () {
        if(this._url()){
            this.parent();
            this.sendRequest(this.getPostData());

        }
    },

    _url:function(){
        return this.url || ludo.config.getUrl();
    },

    sendRequest:function(data){
        this.parent();
        jQuery.ajax({
            url: this._url(),
            method: 'post',
            cache: false,
            dataType: 'json',
            data: data,
            complete: function (response, status) {
                this._loaded = true;
                if(status == 'success'){
                    var json = response.responseJSON;
                    var data = this.dataHandler(json);
                    if(data === false){
                        this.fireEvent('fail', ['error', 'error', this]);
                    }else{
                        this.parseNewData(data, json);
                        this.fireEvent('success', [json, this]);

                    }
                }else{
                    this.fireEvent('fail', [response.responseText, status, this]);
                }
                
                this.fireEvent('complete');
                

            }.bind(this),
            fail: function (text, error) {
                console.log('error', error);
                this.fireEvent('fail', [text, error, this]);
                this.fireEvent('complete');
            }.bind(this)
        });
    },

    /**
     * Update data source with new data and trigger events "parseData",
     * @param {Array} data
     * @memberof ludo.dataSource.JSON.prototype
     */
    setData:function(data){
        this.parseNewData(data);
    },


    parseNewData:function (data) {

		this.parent();
		var firstLoad = !this.data;
		this.data = data;
        this.fireEvent('parsedata');
        this.fireEvent('load', [this.data, this]);

		if(firstLoad){
			this.fireEvent('firstLoad', [this.data, this]);
		}
    }
});

ludo.factory.registerClass('dataSource.JSON', ludo.dataSource.JSON);/* ../ludojs/src/layout/renderer.js */
/**
 * Renderer class for Views which does not have a parent view and are typically rendered to the &lt;body> tag.
 *
 * It uses the views layout options for it's rendering. The config options are much the same as for the relative layout.
 *
 * You can use a combination of the layout properties mentioned below.
 *
 * @class ludo.layout.Renderer
 * @config {object} layout
 * @config {number|string} layout.width Width of view in pixels, percent, "matchParent" or "wrap"
 * @config {number|string} layout.height Height of view in pixels, percent, "matchParent" or "wrap"
 * @config {number|string} rightOf Id of view or id of dom element to align right of.
 * It can be any view which could be referenced using ludo.$, or any value which can be referenced using jQuery's dollar function. if jQuery use
 * values like '#id'.
 * @config {number|string} rightOrLeftOf Id of view or dom node to align right of(if enough room). it will be placed to the left if not enough room.
 * @config {number|string} leftOrRightOf Id of view or dom node to align left of(if enough room). it will be placed to the right if not enough room.
 * @config {number|string} sameHeightAs Same height as view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} sameWidthAs Same width as view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignLeft Align left with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignRight Align right with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignTop Align top edge with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} alignBottom Align bottom edge with view or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} centerIn. Center in view  or dom node with this id. if jQuery, use "#" prefix
 * @config {number|string} left. left coordinate in pixels
 * @config {number|string} top. top coordinate in pixels
 * @config {number|string} offsetX. After positioning, offset left coordinate with these many pixels
 * @config {number|string} offsetY. After positioning, offset top coordinate with these many pixels
 *
 */
ludo.layout.Renderer = new Class({
    // TODO Support top and left resize of center aligned dialogs
    // TODO store inner height and width of views(body) for fast lookup
    view: undefined,
    options: ['width', 'height',
        'rightOf', 'leftOf', 'below', 'above',
        'sameHeightAs', 'sameWidthAs',
        'offsetWidth', 'offsetHeight',
        'rightOrLeftOf', 'leftOrRightOf',
        'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
        'centerIn',
        'left', 'top',
        'offsetX', 'offsetY', 'fitVerticalViewPort'],
    fn: undefined,
    viewport: {
        x: 0, y: 0, width: 0, height: 0
    },
    coordinates: {
        left: undefined,
        right: undefined,
        above: undefined,
        below: undefined,
        width: undefined,
        height: undefined
    },
    lastCoordinates: {},

    initialize: function (config) {
        this.view = config.view;
        this.fixReferences();
        this.setDefaultProperties();
        this.view.addEvent('show', this.resize.bind(this));
        ludo.dom.clearCache();
        this.addResizeEvent();

        if (this.view.getLayout != undefined) {
            this.view.getLayout().on('addChild', this.clearFn.bind(this));
        }
        this.view.on('addChild', this.clearFn.bind(this));

        this.view.on('remove', this.removeEvents.bind(this));
    },

    fixReferences: function () {
        var el;
        var hasReferences = false;

        for (var i = 0; i < this.options.length; i++) {
            var key = this.options[i];
            switch (key) {
                case 'offsetX':
                case 'offsetY':
                case 'width':
                case 'height':
                case 'left':
                case 'top':
                case 'fitVerticalViewPort':
                    break;
                default:
                    el = undefined;
                    if (this.view.layout[key] !== undefined) {
                        hasReferences = true;
                        var val = this.view.layout[key];

                        if (typeof val === 'string') {
                            var view;
                            if (val === 'parent') {
                                view = this.view.getParent();
                            } else {
                                view = ludo.get(val);
                            }
                            if (view) {
                                el = view.getEl();
                                view.addEvent('resize', this.clearFn.bind(this));
                            } else {
                                el = jQuery(val);
                            }
                        } else {
                            if (val.getEl !== undefined) {
                                el = val.getEl();
                                val.addEvent('resize', this.clearFn.bind(this));
                            } else {
                                el = jQuery(val);
                            }
                        }
                        if (el)this.view.layout[key] = el; else this.view.layout[key] = undefined;
                    }
            }
        }
        if (hasReferences)this.view.getEl().css('position', 'absolute');
    },

    setDefaultProperties: function () {
        // TODO is this necessary ?
        this.view.layout.width = this.view.layout.width || 'matchParent';
        this.view.layout.height = this.view.layout.height || 'matchParent';
    },

    resizeFn: undefined,

    addResizeEvent: function () {
        // todo no resize should be done for absolute positioned views with a width. refactor the next line
        if (this.view.isWindow)return;
        this.resizeFn = this.resize.bind(this);
        //var node = this.getParentNode();
        // node.resize(this.resizeFn);

        jQuery(window).on('resize', this.resizeFn);
    },

    getParentNode: function () {
        var node = this.view.getEl().parent();
        if (!node || !node.prop("tagName"))return;
        if (node.prop("tagName").toLowerCase() !== 'body') {
            node = jQuery(node);
        } else {
            node = jQuery(window);
        }
        return node;
    },

    removeEvents: function () {
        // this.getParentNode().off('resize', this.resizeFn);
        if(this.resizeFn) jQuery(window).off('resize', this.resizeFn);
    },

    buildResizeFn: function () {
        var parent = this.view.getEl().parent();
        if (!parent)this.fn = function () {
        };
        var fns = [];
        var fnNames = [];
        for (var i = 0; i < this.options.length; i++) {
            if (this.view.layout[this.options[i]] !== undefined) {
                fns.push(this.getFnFor(this.options[i], this.view.layout[this.options[i]]));
                fnNames.push(this.options[i]);
            }
        }
        this.fn = function () {
            for (i = 0; i < fns.length; i++) {
                fns[i].call(this, this.view, this);
            }
        }
    },

    getFnFor: function (option, value) {
        var c = this.coordinates;


        switch (option) {

            case 'height':
                if (value === 'matchParent') {

                    return function (view, renderer) {
                        c.height = renderer.viewport.height;
                    }
                }
                if (value === 'wrap') {
                    var s = ludo.dom.getWrappedSizeOfView(this.view);
                    // TODO test out layout in order to check that the line below is working.
                    this.view.layout.height = s.y;
                    return function () {
                        c.height = s.y;
                    }

                }
                if (value.indexOf !== undefined && value.indexOf('%') > 0) {
                    value = parseInt(value);
                    return function (view, renderer) {
                        c.height = (renderer.viewport.height * value / 100)
                    }
                }
                return function () {
                    c.height = this.view.layout[option];
                }.bind(this);
            case 'width':
                if (value === 'matchParent') {
                    return function (view, renderer) {
                        c.width = renderer.viewport.width;
                    }
                }
                if (value === 'wrap') {
                    var size = ludo.dom.getWrappedSizeOfView(this.view);
                    this.view.layout.width = size.x;
                    return function () {
                        c.width = size.x;
                    }

                }
                if (value.indexOf !== undefined && value.indexOf('%') > 0) {
                    value = parseInt(value);
                    return function (view, renderer) {
                        c.width = (renderer.viewport.width * value / 100)
                    }
                }
                return function () {
                    c.width = this.view.layout[option];
                }.bind(this);
            case 'rightOf':
                return function () {
                    c.left = value.offset().left + value.outerWidth();
                };
            case 'leftOf':
                return function () {
                    c.left = value.offset().left - c.width;
                };
            case 'leftOrRightOf':
                return function () {
                    var x = value.offset().left - c.width;
                    if (x - c.width < 0) {
                        x += (value.outerWidth() + c.width);
                    }
                    c.left = x;
                };
            case 'rightOrLeftOf' :
                return function (view, renderer) {
                    var val = value.offset().left + value.outerWidth();
                    if (val + c.width > renderer.viewport.width) {
                        val -= (value.outerWidth() + c.width);
                    }
                    c.left = val;
                };
            case 'above':
                return function (view, renderer) {
                    c.top = value.offset().top - c.height;
                };
            case 'below':
                return function () {
                    c.top = value.offset().top + value.height();
                };
            case 'alignLeft':
                return function () {
                    c.left = value.offset().left;
                };
            case 'alignTop':
                return function () {
                    c.top = value.offset().top;
                };
            case 'alignRight':
                return function () {
                    c.left = value.offset().left + value.outerWidth() - c.width;
                };
            case 'alignBottom':
                return function () {
                    c.top = value.offset().top + value.outerHeight() - c.height;
                };
            case 'offsetX' :
                return function () {
                    c.left = c.left ? c.left + value : value;
                };
            case 'offsetY':
                return function () {
                    c.top = c.top ? c.top + value : value;
                };
            case 'sameHeightAs':
                return function () {
                    c.height = value.height();
                };
            case 'offsetWidth' :
                return function () {
                    c.width = c.width + value;
                };
            case 'offsetHeight':
                return function () {
                    c.height = c.height + value;
                };
            case 'centerIn':
                return function () {
                    value = value.getEl != undefined ? value.getEl() : value;
                    var pos = value.offset();
                    c.top = (pos.top + (value.height() / 2)) - (c.height / 2);
                    c.left = (pos.left + value.outerWidth()/ 2)  - (c.width / 2);
                };
            case 'centerHorizontalIn':
                return function () {
                    c.left = (value.offset().left + value.outerWidth()) / 2 - (c.width / 2);
                };
            case 'centerVerticalIn':
                return function () {
                    c.top = (value.offset().top + (value.height() / 2)) - (c.height / 2);
                };
            case 'sameWidthAs':
                return function () {
                    c.width = value.outerWidth();
                };
            case 'x':
            case 'left':
                return function () {
                    c.left = this.view.layout[option];
                }.bind(this);
            case 'y':
            case 'top':
                return function () {
                    c.top = this.view.layout[option];
                }.bind(this);
            case 'fitVerticalViewPort':
                return function (view, renderer) {
                    if (c.height) {
                        var pos = c.top !== undefined ? c.top : view.getEl().offset().top;
                        if (pos + c.height > renderer.viewport.height - 2) {
                            c.top = renderer.viewport.height - c.height - 2;
                        }
                    }
                };
            default:
                return function () {
                };
        }
    },

    posKeys: ['left', 'right', 'top', 'bottom'],

    clearFn: function () {
        this.fn = undefined;
    },

    resize: function () {
        

        if (this.view.isHidden())return;
        if (this.fn === undefined)this.buildResizeFn();
        this.setViewport();

        this.fn.call(this);

        var c = this.coordinates;

        this.view.resize(c);


        if (c['bottom'])c['top'] = undefined;
        if (c['right'])c['left'] = undefined;

        for (var i = 0; i < this.posKeys.length; i++) {
            var k = this.posKeys[i];
            if (this.coordinates[k] !== undefined && this.coordinates[k] !== this.lastCoordinates[k])this.view.getEl().css(k, c[k]);
        }
        this.lastCoordinates = Object.clone(c);
    },

    resizeChildren: function () {
        if (this.view.children.length > 0)this.view.getLayout().resizeChildren();
    },

    setViewport: function () {
        if (!this.view.getEl || !this.view.getEl()) {
            console.trace();
            console.log(this.view);
            return;
        }
        var el = this.view.getEl().parent();
        if (!el)return;
        this.viewport.width = el.width();
        this.viewport.height = el.height();
    },

    getMinWidth: function () {
        return this.view.layout.minWidth || 5;
    },

    getMinHeight: function () {
        return this.view.layout.minHeight || 5;
    },

    getMaxHeight: function () {
        return this.view.layout.maxHeight || 5000;
    },

    getMaxWidth: function () {
        return this.view.layout.maxWidth || 5000;
    },

    setPosition: function (x, y) {
        if (x !== undefined && x >= 0) {
            this.coordinates.left = this.view.layout.left = x;
            this.view.getEl().css('left', x);
            this.lastCoordinates.left = x;
        }
        if (y !== undefined && y >= 0) {
            this.coordinates.top = this.view.layout.top = y;
            this.view.getEl().css('top', y);
            this.lastCoordinates.top = y;
        }
    },

    setSize: function (config) {

        if (config.left)this.coordinates.left = this.view.layout.left = config.left;
        if (config.top)this.coordinates.top = this.view.layout.top = config.top;
        if (config.width)this.view.layout.width = this.coordinates.width = config.width;
        if (config.height)this.view.layout.height = this.coordinates.height = config.height;
        this.resize();
    },

    position: function () {
        return {
            x: this.coordinates.left,
            y: this.coordinates.top
        };
    },

    getSize: function () {
        return {
            x: this.coordinates.width,
            y: this.coordinates.height
        }
    },

    setValue: function (key, value) {
        this.view.layout[key] = value;
    },

    getValue: function (key) {
        return this.view.layout[key];
    }
});/* ../ludojs/src/tpl/parser.js */
/**
 * JSON Content compiler. This parser works with a template string, like: "<p>{lastname}, {firstname}</p>" and a JSON
 * array, like: [{"firstname":"John", "lastname": "Anderson"},{"firstname":"Anna", "lastname": "Anderson"}] and returns
 * <p>{Anderson}, {John}</p><p>{Anderson}, {Anna}</p>.
 *
 * It walks through all the objects in the JSON array and uses the template string on each one of them.
 * 
 * @namespace tpl
 * @class ludo.tpl.Parser
 * @augments Core
 */
ludo.tpl.Parser = new Class({
    Extends:ludo.Core,
    type:'tpl.Parser',
    compiledTpl:undefined,

    /**
     * Get compiled string
	 * @function getCompiled
     * @param {Array} records
     * @param {String} tpl
     * @return {Array} string items
     * @memberof ludo.tpl.Parser.prototype
     */
    getCompiled:function (records, tpl) {
        if (!ludo.util.isArray(records)) {
            records = [records];
        }
        var ret = [];

        tpl = this.getCompiledTpl(tpl);

        for (var i = 0; i < records.length; i++) {
            var content = [];
            for(var j = 0; j< tpl.length;j++){
                var k = tpl[j]["key"];
                if(k) {
                    content.push(records[i][k] ? records[i][k] : "");
                }else{
                    content.push(tpl[j]);
                }
            }
            ret.push(content.join(""));
        }
        return ret;
    },

    getCompiledTpl:function(tpl){
        if(!this.compiledTpl){
            this.compiledTpl = [];
            var pos = tpl.indexOf('{');
            var end = 0;

            while(pos >=0 && end != -1){
                if(pos > end){
                    var start = end === 0 ? end : end+1;
                    var len = end === 0 ? pos-end : pos-end-1;
                    this.compiledTpl.push(tpl.substr(start,len));
                }

                end = tpl.indexOf('}', pos);

                if(end != -1){
                    this.compiledTpl.push({
                        key : tpl.substr(pos, end-pos).replace(/[{}"]/g,"")
                    });
                }
                pos = tpl.indexOf('{', end);
            }

            if(end != -1 && end < tpl.length){
                this.compiledTpl.push(tpl.substr(end+1));
            }

        }
        return this.compiledTpl;
    },

    asString:function(data, tpl){
        return this.getCompiled(data, tpl).join('');
    },

    getTplValue:function (key, value) {
        return value;
    }
});/* ../ludojs/src/dom.js */
/*
 * Class/Object with DOM utility methods.
 * @class ludo.dom
 *
 */
ludo.dom = {
	cache:{
		PW:{}, PH:{},
		BW:{}, BH:{},
		MW:{}, MH:{}
	},
	/*
	 * Return Margin width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getMW
	 * @param {Object} el
	 */
	getMW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.MW[el.id] === undefined) {
			ludo.dom.cache.MW[el.id] = ludo.dom.getNumericStyle(el, 'margin-left') + ludo.dom.getNumericStyle(el, 'margin-right')
		}
		return ludo.dom.cache.MW[el.id];
	},

	/*
	 * Return Border width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getBW
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getBW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.BW[el.id] === undefined) {
			ludo.dom.cache.BW[el.id] = ludo.dom.getNumericStyle(el, 'border-left-width') + ludo.dom.getNumericStyle(el, 'border-right-width');
		}
		return ludo.dom.cache.BW[el.id];
	},
	/*
	 * Return Padding Width (left and right) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getPW
	 * @param {Object} el
	 */
	getPW:function (el) {
		if (!el.id)el.id = 'el-' + String.uniqueID();
		if (ludo.dom.cache.PW[el.id] === undefined) {
			ludo.dom.cache.PW[el.id] = ludo.dom.getNumericStyle(el, 'padding-left') + ludo.dom.getNumericStyle(el, 'padding-right');
		}
		return ludo.dom.cache.PW[el.id];

	},
	/*
	 * Return Margin height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getMH
	 * @param {Object} el
	 */
	getMH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.MH[id] === undefined) {
			ludo.dom.cache.MH[id] = ludo.dom.getNumericStyle(el, 'margin-top') + ludo.dom.getNumericStyle(el, 'margin-bottom')
		}
		return ludo.dom.cache.MH[id];

	},
	/*
	 * Return Border height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getBH
	 * @param {Object} el
	 */
	getBH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.BH[id] === undefined) {
			ludo.dom.cache.BH[id] = ludo.dom.getNumericStyle(el, 'border-top-width') + ludo.dom.getNumericStyle(el, 'border-bottom-width');
		}
		return ludo.dom.cache.BH[id];
	},
	/*
	 * Return Padding height (top and bottom) of DOM element
	 * Once retrieved, it will be cached for later lookup. Cache
	 * can be cleared by calling clearCacheStyles
	 * @function getPH
	 * @param {Object} el DOMElement or id of DOMElement
	 */
	getPH:function (el) {
		this.addId(el);
		var id = el.attr("id");
		if (ludo.dom.cache.PH[id] === undefined) {
			ludo.dom.cache.PH[id] = ludo.dom.getNumericStyle(el, 'padding-top') + ludo.dom.getNumericStyle(el, 'padding-bottom');
		}
		return ludo.dom.cache.PH[id];
	},
	getMBPW:function (el) {
		return ludo.dom.getPW(el) + ludo.dom.getMW(el) + ludo.dom.getBW(el);
	},
	getMBPH:function (el) {
		return ludo.dom.getPH(el) + ludo.dom.getMH(el) + ludo.dom.getBH(el);
	},

	addId:function(el){
		if(!el.attr("id"))el.attr("id", String.uniqueID());
	},

	/*
	 * @function clearCacheStyles
	 * Clear cached padding,border and margins.
	 */
	clearCache:function () {
		ludo.dom.cache = {
			PW:{}, PH:{},
			BW:{}, BH:{},
			MW:{}, MH:{}
		};
	},

	/*
	 * Return numeric style value,
	 * @function getNumericStyle
	 * @private
	 * @param {Object} el
	 * @param {String} style
	 */
	getNumericStyle:function (el, style) {

		if (!el || !style || !el.css)return 0;
		var val = el.css(style);
		return val && val!='thin' && val!='auto' && val!='medium' ? parseInt(val) : 0;
	},

	isInFamilies:function (el, ids) {
		for (var i = 0; i < ids.length; i++) {
			if (ludo.dom.isInFamily(el, ids[i]))return true;
		}
		return false;
	},

	isInFamily:function (el, id) {
		el = jQuery(el);
		if (el.attr("id") === id)return true;
		return el.parent('#' + id);
	},

	addClass:function (el, className) {
		console.info("Use of deprecated ludo.dom.addClass");
		console.trace();
		if (el && !this.hasClass(el, className)) {
			if(el.attr != undefined){
				el.addClass(className);
			}else{
				el.className = el.className ? el.className + ' ' + className : className;
			}
		}
	},

	hasClass:function (el, className) {
		console.info("use of deprecated ludo.dom.hasClass");
		console.trace();
		if(el.attr != undefined)return el.hasClass(className);
		var search = el.attr != undefined ? el.attr("class") : el.className;
		return el && search ? search.split(/\s/g).indexOf(className) > -1 : false;
	},

	removeClass:function (el, className) {
		console.info("use of deprecated ludo.dom.removeClass");
		console.trace();
		el.removeClass(className);
	},

	getParent:function (el, selector) {
		el = el.parentNode;
		while (el && !ludo.dom.hasClass(el, selector))el = el.parentNode;
		return el;
	},

	scrollIntoView:function (domNode, view) {
		var c = view.getEl();
		var el = view.$b();
		var viewHeight = c.offsetHeight - ludo.dom.getPH(c) - ludo.dom.getBH(c) - ludo.dom.getMBPH(el);

		var pos = domNode.getPosition(el).y;

		var pxBeneathBottomEdge = (pos + 20) - (c.scrollTop + viewHeight);
		if (pxBeneathBottomEdge > 0) {
			el.scrollTop += pxBeneathBottomEdge;
		}

        var pxAboveTopEdge = c.scrollTop - pos;
		if (pxAboveTopEdge > 0) {
			el.scrollTop -= pxAboveTopEdge;
		}
	},

	size:function(el){
		return {
			x: el.width(), y: el.height()
		}
	},

	getWrappedSizeOfView:function (view) {
		view.getEl().css('height', 'auto');
		view.$b().css('height', 'auto');

		var el = view.getEl();
		var b = view.$b();
		b.css('position', 'absolute');
		
		var width = b.outerWidth();
		b.css('position', 'relative');
		var height = b.outerHeight();
		
		return {
			x:width + ludo.dom.getMBPW(el),
			y:height + ludo.dom.getMBPH(el) + (view.getHeightOfTitleBar ? view.getHeightOfTitleBar() : 0)
		}
	},

	/*
	 * Return measured width of a View
	 * @function getMeasuredWidth
	 * @param {ludo.View} view
	 * @return {Number}
	 */
	getMeasuredWidth:function (view) {
		var el = view.$b();
		var size = el.measure(function () {
			return this.getSize();
		});
		return size.x + ludo.dom.getMW(el);
	},

    create:function(node){
		console.info("use of deprecated ludo.dom.create");
		console.trace();
        var el = jQuery('<' + (node.tag || 'div') + '>');
        if(node.cls)el.addClass(node.cls);
        if(node.renderTo)jQuery(node.renderTo).append(el);
        if(node.css){
			el.css(node.css);
          }
        if(node.id)el.attr("id", node.id);
        if(node.html)el.html(node.html);
        return el;

    }
};/* ../ludojs/src/view/shim.js */
/**
 * Render a shim

 */
ludo.view.Shim = new Class({
    txt: 'Loading content...',
    el: undefined,
    shim: undefined,
    renderTo: undefined,

    initialize: function (config) {
        if (config.txt)this.txt = config.txt;
        this.renderTo = config.renderTo;
    },

    getEl: function () {
        if (this.el === undefined) {
            this.el = jQuery('<div class="ludo-shim-loading" style="display:none">' + this.getText(this.txt) + "</div>");
            this.getRenderTo().append(this.el);
        }
        return this.el;
    },

    getShim: function () {
        if (this.shim === undefined) {
            if (ludo.util.isString(this.renderTo))this.renderTo = ludo.get(this.renderTo).getEl();
            this.shim = jQuery('<div class="ludo-loader-shim" style="display:none"></div>');
            this.getRenderTo().append(this.shim);

        }
        return this.shim;
    },

    getRenderTo: function () {
        if (ludo.util.isString(this.renderTo)) {
            var view = ludo.get(this.renderTo);
            if (!view)return undefined;
            this.renderTo = ludo.get(this.renderTo).getEl();
        }
        return this.renderTo;
    },

    show: function (txt) {
        this.getEl().html(this.getText(( txt && !ludo.util.isObject(txt) ) ? txt : this.txt));
        this.css('');
        this.resizeShim();
    },

    resizeShim: function () {
        var span = jQuery(this.el).find('span');
        var width = (span.width() + 5);
        this.el.css('width', width + 'px');
        this.el.css('marginLeft', (Math.round(width / 2) * -1) + 'px');
    },

    getText: function (txt) {
        txt = ludo.util.isFunction(txt) ? txt.call() : txt ? txt : '';
        return '<span>' + txt + '</span>';
    },

    hide: function () {
        this.css('none');
    },
    css: function (d) {
        this.getShim().css('display', d);
        this.getEl().css('display', d === '' && this.txt ? '' : 'none');
    }
});/* ../ludojs/src/remote/shim.js */
ludo.remote.Shim = new Class({
    Extends:ludo.view.Shim,

    initialize:function (config) {
        this.parent(config);
        this.addShowHideEvents(config.remoteObj);
    },

    addShowHideEvents:function (obj) {
        if (obj) {
			obj.addEvents({
                'start':this.show.bind(this),
                'complete':this.hide.bind(this)
            });
        }
    }
});/* ../ludojs/src/view.js */
/**
 A basic ludoJS view. When rendered on a Web page, a View is made out of two &lt;div> elements, one parent and one child(called body).
 @example {@lang XML}
 <!--  A basic rendered ludoJS view -->
 <div class="ludo-view">
 <div class="ludo-body"></div>
 </div>
 @namespace ludo
 @class ludo.View
 @augments ludo.Core
 @param {Object} config
 @param {String} config.bodyCls Additional css classes to assign to the body &lt;div>, example: bodyCls: "classname1 classname2"
 @param {Array} config.children An array of config objects for the child views. Example: children:[{ html: "child 1", layout:{ height: 100 }}, { html: "Child 2", layout: { height:200 } }]. See <a href="../demo/view/children.php" onclick="var w = window.open(this.href);return false">Demo</a>
 @param {String} config.cls Additional css classes to assign to the views &lt;div>, example: cls: "classname1 classname2"
 @param {Object} config.elCss Specific css rules to apply to the View, @example: elCss:{ border: '1px solid #ddd' } for a gray border
 @param {Object} config.css Specific css rules to apply to the View's body &lt;div, @example: css:{ 'background-color': '#EEEEEE' } for a light gray background
 @param {Object} config.dataSource A config object for the data source.
 @param {Object} config.formConfig Default form properties for child form views. Example: formConfig:{labelWidth:100}. Then we don't have to specify labelWidth:100 for all the child form views.
 @param {Boolean} config.hidden When true, the View will be initially hidden. For performance reasons initially hidden Views will not be rendered until View.show() is called.
 @param {String} config.html Static HTML to show inside the View's body &lt;div>
 @param {String} config.id Id of view. When set, you can easily get access to the View by calling ludo.get("&lt;idOfView>").
 @param {Object} config.layout An object describing the layout for this view and basic layout rules for child views
 @param {String} config.name When set, you can access it by calling parentView.child["&lt;childName>"]
 @param {String} config.title Title of this view. If the view is a child in tab layout, the title will be displayed on the Tab
 @param {String} config.tpl A template for string when inserting JSON Content(the insertJSON method), example: "name:{firstname} {lastname}<br>"
 @param {Boolean} config.alwaysInFront True to make this view always appear in front of the other views.
 @param {Object} config.form Configuration for the form Manager. See <a href="ludo.form.Manager">ludo.form.Manager</a> for details.
 @param {String} config.loadMessage Message to show if a data source is used and data is being loaded from server.
 @fires ludo.View#rendered Fired when the view has been rendered and resized. Argument: ludo.View
 @fires ludo.View#toFront Fired when view has brought to front. Argument: ludo.View
 @fires ludo.View#hide Fired when view has been hidden using the hide method. Argument: ludo.View
 @fires ludo.View#show Fired when view is displayed using the show method. Argument. ludo.View
 @fires ludo.View#beforeshow Fired just before a view is displayed using the show method. Argument: ludo.View
 @fires ludo.View#resize Fired when a view has been resized.

 @example {@lang Javascript}
 // Example 1: View render to &lt;body> tag
 new ludo.View({
 		renderTo:document.body,
 		html : 'Hello'
	}

 // Example 2: Creating custom View
 myApp = {};
 myApp.View = new Class({
 		Extends: ludo.View,
 		type : 'myApp.View',
 		__rendered:function(){
 			this.html('My custom view');
		}
	}
 children:[{
		type : 'myApp.View'
	}]
 *
 */
ludo.View = new Class({
    Extends: ludo.Core,
    type: 'View',
    cType: 'View',
    cls: '',
    bodyCls: '',
    cssSignature: undefined,
    closable: true,
    minimizable: false,
    movable: false,
    resizable: false,
    alwaysInFront: false,
    statefulProperties: ['layout'],
    els: {},
    state: {},

    defaultDS: 'dataSource.JSON',
    tagBody: 'div',
    id: null,
    children: [],
    child: {},
    dataSource: undefined,
    parentComponent: null,
    objMovable: null,
    width: undefined,
    height: undefined,
    overflow: undefined,
    _html: '',

    hidden: false,

    css: undefined,
    elCss: undefined,
    formConfig: undefined,
    isRendered: false,
    unRenderedChildren: [],
    frame: false,
    form: undefined,
    layout: undefined,
    tpl: '',

    JSONParser: {type: 'tpl.Parser'},
    initialItemsObject: [],
    contextMenu: undefined,
    lifeCycleComplete: false,
    loadMessage:undefined,

    lifeCycle: function (config) {
        this._createDOM();
        if (!config.children) {
            config.children = this.children;
            this.children = [];
        }

        this.__construct(config);

        if (!config.children || !config.children.length) {
            config.children = this.__children();
        }

        if (this.hidden) {
            this.unRenderedChildren = config.children;
        } else {
            this.remainingLifeCycle(config);
        }
    },

    /**
     * Alternative to the "children" config array. By defining children in __children, you will have access to "this" referring to
     * the View instance. This is a method you override when creating your own Views.
     * @function __children
     * @memberof ludo.View.prototype
     * @return {Array|children}
     */
    __children: function () {
        return this.children;
    },

    remainingLifeCycle: function (config) {
        if (this.lifeCycleComplete)return;
        if (!config && this.unRenderedChildren) {
            config = {children: this.unRenderedChildren};
        }

        this.lifeCycleComplete = true;
        this._styleDOM();

        if (config.children && config.children.length > 0) {
            this.getLayout().prepareForChildrenOnCreate(config.children);
            for (var i = 0; i < config.children.length; i++) {
                config.children[i].id = config.children[i].id || config.children[i].name || 'ludo-' + String.uniqueID();
            }
            this.initialItemsObject = config.children;
            this.addChildren(config.children);
        }
        this.ludoDOM();
        this.ludoCSS();
        this.ludoEvents();

        this.increaseZIndex();

        if (this.layout && this.layout.type && (this.layout.type == 'tabs' || this.layout.type == 'docking')) {

            this.getLayout().prepareView();
        }

        this.addCoreEvents();
        this.__rendered();

        if (!this.parentComponent) {
            ludo.dom.clearCache();
            ludo.dom.clearCache.delay(50, this);
            var r = this.getLayout().getRenderer();
            r.resize();

        }

        // TODO remove 'render' and replace with 'rendered'

        this.fireEvent('render', this);

    },
    /**
     * Constructor for Views.
     * @function __construct
     * @param {Object} config
     * @memberof ludo.View.prototype
     */
    __construct: function (config) {
        this.parent(config);
        config.els = config.els || {};
        if (this.parentComponent)config.renderTo = undefined;
        var keys = ['contextMenu', 'renderTo', 'tpl', 'elCss', 'form', 'title', 'hidden',
            'dataSource', 'movable', 'resizable', 'closable', 'minimizable', 'alwaysInFront',
            'parentComponent', 'cls', 'bodyCls', 'objMovable', 'width', 'height', 'frame', 'formConfig',
            'overflow','loadMessage'];

        if (config.css != undefined) {
            if (this.css != undefined) {
                this.css = Object.merge(this.css, config.css);
            } else {
                this.css = config.css;
            }
        }
        if (config.html != undefined)this._html = config.html;
        this.__params(config, keys);

        if (this.renderTo)this.renderTo = jQuery(this.renderTo);

        this.layout = ludo.layoutFactory.getValidLayoutObject(this, config);

        this.insertDOMContainer();
    },

    insertDOMContainer: function () {
        if (this.hidden)this.$e.css('display', 'none');
        if (this.renderTo)this.renderTo.append(this.$e);
    },

    /**
     The second life cycle method
     This method is typically used when you want to create your own DOM elements.
     @memberof ludo.View.prototype
     @function ludoDOM
     @private
     @example
     ludoDOM : function() {<br>
			 this.parent(); // Always call parent ludoDOM
			 var myEl = jQuery('<div>');
			 myEl.html('My Content');
			 this.getEl().append(myEl);
		 }
     */
    ludoDOM: function () {
        if (this.contextMenu) {
            if (!ludo.util.isArray(this.contextMenu)) {
                this.contextMenu = [this.contextMenu];
            }
            for (var i = 0; i < this.contextMenu.length; i++) {
                this.contextMenu[i].applyTo = this;
                this.contextMenu[i].contextEl = this.isFormElement() ? this.getFormEl() : this.getEl();
                new ludo.menu.Context(this.contextMenu[i]);
            }
            this.contextMenu = undefined;
        }


    },

    ludoCSS: function () {

    },
    /**
     The third life cycle method
     This is the place where you add custom events
     @function ludoEvents
     @return void
     @private
     @example
     ludoEvents:function(){∂'
			 this.parent();
			 this.addEvent('load', this.myMethodOnLoad.bind(this));
		 }
     */
    ludoEvents: function () {
        if (this.dataSource) {
            this.getDataSource();
        }
    },

    /**
     * The final life cycle method. When this method is executed, the view (including child views)
     * are fully rendered.
     * @memberof ludo.View.prototype
     * @function __rendered
     */
    __rendered: function () {
        if (!this.layout.height && !this.layout.above && !this.layout.sameHeightAs && !this.layout.alignWith) {
            this.autoSetHeight();
        }
        if (!this.parentComponent) {
            this.getEl().addClass('ludo-view-top');
        }
        if (!this.parentComponent) {
            this.getLayout().createRenderer();
        }

        this.isRendered = true;
        if (this.form) {
            this.getForm();
        }
    },


    /**
     * Parse and insert JSON into the view
     * The JSON will be sent to the JSON parser(defined in JSONParser) and
     * This method will be called automatically when you're using a JSON data-source
     * @function JSON
     * @param {Object} json
     * @param {String} tpl - Optional String template
     * @return void
     * @memberof ludo.View.prototype
     */
    JSON: function (json, tpl) {
        tpl = tpl || this.tpl;
        if (tpl) {

            if(jQuery.isFunction(tpl)){
                this.$b().html(tpl.call(this, json));
            }else{
                this.$b().html(this.getTplParser().asString(json, tpl));
            }
        }
    },
    
    getTplParser: function () {
        if (!this.tplParser) {
            this.tplParser = this.createDependency('tplParser', this.JSONParser);
        }
        return this.tplParser;
    },

    autoSetHeight: function () {
        var size = this.$b().outerHeight(true);
        this.layout.height = size + ludo.dom.getMBPH(this.getEl());
    },

    /**
     * Set HTML
     * @function html
     * @param html
     * @type string
     * @memberof ludo.View.prototype
     * @example
     var view = new ludo.View({
	 	renderTo:document.body,
	 	layout:{ width:500,height:500 }
	 });
     view.html('<h1>Heading</h1><p>Paragraph</p>');
     */

    html: function (html) {
        this.$b().html(html);
    },

    setContent: function () {
        if (this._html) {
            if (this.children.length) {
                var el = jQuery('<div>' + this._html + '</div>');
                this.$b().append(el);
            } else {

                this.$b().html(this._html);
            }
        }
    },

    /**
     * Load content from the server. This method will send an Ajax request to the server
     * using the data source
     * @function load
     * @memberof ludo.View.prototype
     * @return void
     */
    load: function () {
        /*
         * This event is fired from the "load" method before a remote request is sent to the server.
         * @event beforeload
         * @param {String} url
         * @param {Object} this
         */
        this.fireEvent('beforeload', [this.getUrl(), this]);
        if (this.dataSource) {
            this.getDataSource().load();
        }
    },
    /**
     * Get reference to parent view
     * @function getParent
     * @return {Object} view | null
     * @memberof ludo.View.prototype
     */
    getParent: function () {
        return this.parentComponent ? this.parentComponent : null;
    },

    setParentComponent: function (parentComponent) {
        this.parentComponent = parentComponent;
    },

    _createDOM: function () {
        this.els.container = this.$e = jQuery('<div>');
        this.els.body = jQuery('<' + this.tagBody + '>');
        this.$e.append(this.els.body);
    },

    _styleDOM: function () {
        var b = this.els.body;
        var e = this.$e;
        e.addClass('ludo-view');
        b.addClass('ludo-body');

        e.attr("id", this.getId());

        b.css('height', '100%');

        if (this.overflow != undefined) {
            b.css('overflow-Y', this.overflow);
        }

        if (ludo.util.isTabletOrMobile()) {
            e.addClass('ludo-view-mobile');
        }

        if (this.cls) {
            e.addClass(this.cls);
        }
        if (this.bodyCls)b.addClass(this.bodyCls);
        if (this.type)e.addClass('ludo-' + (this.type.replace(/\./g, '-').toLowerCase()));
        if (this.css)b.css(this.css);
        if (this.elCss)e.css(this.elCss);

        if (this.frame) {
            e.addClass('ludo-container-frame');
            b.addClass('ludo-body-frame');
        }
        if (this.cssSignature !== undefined)e.addClass(this.cssSignature);

        this.setContent();
    },

    addCoreEvents: function () {
        if (!this.getParent() && this.type !== 'Application') {
            this.getEl().on('mousedown', this.increaseZIndex.bind(this));
        }
    },

    increaseZIndex: function (e) {
        if (e && e.target && e.target.tagName.toLowerCase() == 'a') {
            return;
        }

        this.fireEvent('activate', this);
        this.fireEvent('toFront', this);
        this.setNewZIndex();
    },

    setNewZIndex: function () {
        this.getEl().css('zIndex', ludo.util.getNewZIndex(this));
    },

    /**
     * Return reference to the Views DOM div element.
     * DOM "body" element
     * @function getEl
     * @return {HTMLElement} DOMElement
     * @memberof ludo.View.prototype
     */
    getEl: function () {
        return this.$e ? this.$e : null;
    },
    /**
     * Return reference to the "body" div HTML Element.
     * @memberof ludo.view.prototype
     * @function $b
     * @return {HTMLElement} DOMElement
     */
    $b: function () {
        return this.els.body;
    },

    getBody:function(){
        return this.els.body;
    },
    
    /**
     * Hides the view
     * @function hide
     * @memberof ludo.view.prototype
     */
    hide: function () {
        if (!this.hidden && this.getEl().css('display') !== 'none') {
            this.getEl().css('display', 'none');
            this.hidden = true;

            this.resizeParent();
            this.fireEvent('hide', this);
        }
    },
    
    /**
     * Is this component hidden?
     * @memberof ludo.View.prototype
     * @function isHidden
     * @return {Boolean}
     */
    isHidden: function () {
        return this.hidden;
    },

    /**
     * Return true if this component is visible
     * @function isVisible
     * @return {Boolean}
     * @memberof ludo.View.prototype
     *
     */
    isVisible: function () {
        return !this.hidden;
    },

    /**
     * Make the view visible
     * @memberof ludo.View.prototype
     * @function show
     * @param {Boolean} skipEvents
     * @return void
     */
    show: function (skipEvents) {
        if (this.$e.css('display') === 'none') {
            this.$e.css('display', '');
            this.hidden = false;
        }

        if (!this.lifeCycleComplete) {
            this.remainingLifeCycle();
        }

        if (!skipEvents)this.fireEvent('beforeshow', this);

        this.setNewZIndex();


        if (!this.parentComponent){
            this.getLayout().getRenderer().resize();
        }


        if (!skipEvents)this.fireEvent('show', this);
    },

    resizeParent: function () {
        var parent = this.getParent();
        if (parent) {
            if (parent.children.length > 0)parent.getLayout().resizeChildren();
        }
    },

    /**
     * Call show() method of a child component
     * key must be id or name of child
     * @function showChild
     * @param {String} key
     * @return {Boolean} success
     * @memberof ludo.View.prototype
     */
    showChild: function (key) {
        var child = this.getChild(key);
        if (child) {
            child.show();
            return true;
        }
        return false;
    },

    /**
     * Return Array of direct child views.
     * @memberof ludo.View.prototype
     * @function getChildren
     * @return Array of Child components
     */
    getChildren: function () {
        return this.children;
    },
    /**
     * Return Array of child views, recursive.
     * @memberof ludo.View.prototype
     * @function getAllChildren
     * @return Array of sub components
     */
    getAllChildren: function () {
        var ret = [];
        for (var i = 0; i < this.children.length; i++) {
            ret.push(this.children[i]);
            if (this.children[i].hasChildren()) {
                ret = ret.append(this.children[i].getChildren());
            }
        }
        return ret;
    },
    /**
     * Returns true if this component contain any children
     * @memberof ludo.View.prototype
     * @function hasChildren
     * @return {Boolean}
     */
    hasChildren: function () {
        return this.children.length > 0;
    },

    /**
     * Set new title
     * @memberof ludo.View.prototype
     * @function setTitle
     * @param {String} title
     */
    setTitle: function (title) {
        this.title = title;
        this.fireEvent('setTitle', [title, this]);
    },

    /**
     * Returns total width of component including padding, borders and margins
     * @memberof ludo.View.prototype
     * @function getWidth
     * @return {Number} width
     */
    getWidth: function () {
        return this.layout.pixelWidth ? this.layout.pixelWidth : this.layout.width ? this.layout.width : this.$b().width();
    },

    /**
     * Get current height of component
     * @memberof ludo.View.prototype
     * @function getHeight
     * @return {Number}
     */
    getHeight: function () {
        return this.layout.pixelHeight ? this.layout.pixelHeight : this.layout.height;
    },

    _fr:false,

    /**
     Resize View and it's children.
     @function resize
     @memberof ludo.View.prototype
     @param {Object} p Object with optional width and height properties. Example: { width: 200, height: 100 }
     @example
     view.resize(
        { width: 200, height:200 }
     );
     */
    resize: function (p) {

        if (this.isHidden()) {
            return;
        }

        var l = this.layout;
        p = p || {};

        if (p.width) {
            if (l.aspectRatio && l.preserveAspectRatio && p.width && !this.isMinimized()) {
                p.height = p.width / l.aspectRatio;
            }
            // TODO layout properties should not be set here.
            l.pixelWidth = p.width;
            if (!isNaN(l.width))l.width = p.width;
            var w = p.width - ludo.dom.getMBPW(this.$e);
            if (w > 0) {
                this.$e.css('width', w);
            }
        }

        if (p.height && !this.state.isMinimized) {
            // TODO refactor this part.
            if (!this.state.isMinimized) {
                l.pixelHeight = p.height;
                if (!isNaN(l.height))l.height = p.height;
            }
            var h = p.height - ludo.dom.getMBPH(this.$e);
            if (h > 0) {
                this.$e.css('height', h);
            }
        }

        if (p.left !== undefined || p.top !== undefined) {
            this.setPosition(p);
        }

        this.resizeDOM();

        if (p.height || p.width) {
            this.fireEvent('resize', p);
        }

        if(this._fr == false){
            this.fireEvent('rendered', this);
            this._fr = true;
        }

        if (this.children.length > 0)this.getLayout().resizeChildren();
    },

    isChildOf: function (view) {
        var p = this.parentComponent;
        while (p) {
            if (p.id === view.id)return true;
            p = p.parentComponent;
        }
        return false;
    },

    setPosition: function (pos) {
        if (pos.left !== undefined && pos.left >= 0) {
            this.$e.css('left', pos.left);
        }
        if (pos.top !== undefined && pos.top >= 0) {
            this.$e.css('top', pos.top);
        }
    },

    getLayout: function () {
        if (!this.hasDependency('layoutManager')) {
            this.createDependency('layoutManager', ludo.layoutFactory.getManager(this));
        }
        return this.getDependency('layoutManager');
    },

    resizeChildren: function () {
        if (this.children.length > 0)this.getLayout().resizeChildren();
    },

    isMinimized: function () {
        return false;
    },

    resizeDOM: function () {
        if (this.layout.pixelHeight > 0) {
            var height = this.layout.pixelHeight ? this.layout.pixelHeight - ludo.dom.getMBPH(this.$e) : this.$e.css('height').replace('px', '');
            height -= ludo.dom.getMBPH(this.els.body);
            if (height <= 0 || isNaN(height)) {
                return;
            }
            this.els.body.css('height', height);
        }
    },

    /**
     * Add child components
     * Only param is an array of child objects. A Child object can be a component or a JSON object describing the component.
     * @function addChildren
     * @memberof ludo.View.prototype
     * @param {Array} children
     * @return {Array} of new children
     */
    addChildren: function (children) {
        var ret = [];
        for (var i = 0, count = children.length; i < count; i++) {
            ret.push(this.addChild(children[i]));
        }
        return ret;
    },
    /**
     * Add a child View. The method will returned the created view.
     * @memberof ludo.View.prototype
     * @function addChild
     * @param {Object|View} child. A Child object can be a View or a JSON config object for a new View.
     * @param {String} insertAt
     * @optional
     * @param {String} pos
     * @optional
     * @return {View} child
     */
    addChild: function (child, insertAt, pos) {
        child = this.getLayout().addChild(child, insertAt, pos);
        if (child.name) {
            this.child[child.name] = child;
        }
        child.addEvent('remove', this.removeChild.bind(this));
        return child;
    },

    /**
     * Get child view by name or id
     * @memberof ludo.View.prototype
     * @function getChild
     * @param {String} childName id or name of child view
     *
     */
    getChild: function (childName) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == childName || this.children[i].name == childName) {
                return this.children[i];
            }
        }
        return undefined;
    },

    removeChild: function (child) {
        this.children.erase(child);
        child.parentComponent = null;

    },

    disposeAllChildren: function () {
        for (var i = this.children.length - 1; i >= 0; i--) {
            this.children[i].remove();
        }
    },

    /**
     * Hide and removes the view view
     * @memberof ludo.View.prototype
     * @function remove
     * @return void
     */
    remove: function () {
        this.fireEvent('remove', this);
        ludo.util.dispose(this);
    },


    dispose: function () {
        console.warn("Use of deprecated dispose");
        console.trace();
        this.fireEvent('remove', this);
        ludo.util.dispose(this);
    },
    /**
     * Returns title
     * @function getTitle
     * @memberOf ludo.View.prototype
     * @return string
     */
    getTitle: function () {
        return this.title;
    },

    dataSourceObj: undefined,

    /**
     * @funtion getDataSource
     * @memberOf ludo.View.prototype
     * Returns object of type ludo.dataSource.*
     * @returns {undefined|*}
     */
    getDataSource: function () {

        if (!this.dataSourceObj && this.dataSource) {
            var obj;
            if (ludo.util.isString(this.dataSource)) {
                obj = this.dataSourceObj = ludo.get(this.dataSource);
            } else {
                if (!this.dataSource.type) {
                    this.dataSource.type = this.defaultDS;
                }
                obj = this.dataSourceObj = this.createDependency('viewDataSource', this.dataSource);
            }

            if(this.loadMessage){
                obj.on('init', function(){
                    this.shim().show(this.loadMessage);
                }.bind(this));
                obj.on('complete', function(){
                    this.shim().hide();
                }.bind(this));
                if(obj.isWaitingData() ){
                    this.shim().show(this.loadMessage);
                }
            }

            var method = obj.getSourceType() === 'HTML' ? 'html' : 'JSON';

            if (obj.hasData()) {
                this[method](obj.getData());
            }
            obj.addEvent('load', this[method].bind(this));
        }
        return this.dataSourceObj;
    },
    _shim: undefined,
    shim: function () {
        if (this._shim === undefined) {
            this._shim = new ludo.view.Shim({
                txt: '',
                renderTo: this.getEl()
            });
        }
        return this._shim;
    },

    /**
     Returns {@link ludo.form.Manager"} for this view.
     @function getForm     *
     @return {ludo.form.Manager}
     @memberof ludo.View.prototype
     @example
     view.getForm().reset();

     to reset all form fields

     @example
     view.getForm().save();

     to submit the form

     @example
     view.getForm().read(1);

     to send a read request to the server for record with id 1.
     */
    getForm: function () {
        if (!this.hasDependency('formManager')) {
            this.createDependency('formManager',
                {
                    type: 'ludo.form.Manager',
                    view: this,
                    form: this.form
                });
        }
        return this.getDependency('formManager');
    },

    getParentForm: function () {
        var parent = this.getParent();
        return parent ? parent.hasDependency('formManager') ? parent.getDependency('formManager') : parent.getParentForm() : undefined;
    },

    isFormElement: function () {
        return false;
    },

    getHeightOfButtonBar: function () {
        return 0;
    },

    /**
     Creates(if not exists) SVG surface and returns it. The SVG element is appended to the body of
     the view.
     @function svg
     @memberof ludo.View.prototype
     @return {ludo.svg.Canvas} canvas
     @example
     var win = new ludo.Window({
		   id:'myWindow',
		   left:50, top:50,
		   width:410, height:490,
		   title:'Canvas',
		   css:{
			   'background-color':'#FFF'
		   }
	   });
     // Get reference to canvas
     var canvas = win.svg();
     // Using the svg dollar function to create SVG DOM nodes.
     var circle = canvas.$('circle', { cx:100,cy:100, r: 50, fill: "#000" });
     canvas.append(circle);
     */
    svg: function () {
        if (this.canvas === undefined) {
            this.canvas = this.createDependency('canvas', new ludo.svg.Canvas({
                renderTo: this
            }));
        }
        return this.canvas;
    },

    canvas: undefined,

    wrappedWidth: function () {
        return undefined;
    },
    wrappedHeight: function () {
        return undefined;
    }
});

ludo.factory.registerClass('View', ludo.View);/* ../ludojs/src/layout/relative.js */
/**
 Relative Layout. This layout will render children relative to each other based on the rules defined below.
 For a demo, see <a href="../demo/layout/relative.php" onclick="var w=window.open(this.href);return false">Relative layout demo</a>.
 @namespace ludo.layout
 @class ludo.layout.Relative
 @summary layout: {type: "relative" }
 @param {object} config
 @param {number|string} config.width Width in Pixels or "matchParent". 
 @param {number|string} config.height Height in pixels or "matchParent"
 @param {Boolean} config.alignParentTop Align at top edge of parent view
 @param {Boolean} config.alignParentBottom Align bottom of this view with the bottom of parent view
 @param {Boolean} config.alignParentLeft Align left in parent
 @param {Boolean} config.alignParentRight Right align inside parent
 @param {String} config.leftOf Align left of sibling with this id
 @param {String} config.rightOf Align right of sibling with this id
 @param {String} config.below Align below sibling with this id
 @param {String} config.above Align above sibling with this id
 @param {String} config.alignLeft Same left position as sibling with this id.
 @param {String} config.alignRight Same right position as sibling with this id
 @param {String} config.alignTop Same top position as sibling with this id
 @param {String} config.alignBottom Same bottom edge as sibling with this id
 @param {String} config.sameWidthAs Same width as sibling with this id
 @param {String} config.sameHeightAs Same height as sibling with this id
 @param {Boolean} config.centerInParent True to Center view inside parent
 @param {Boolean} config.centerHorizontal True to Center view horizontally inside parent
 @param {Boolean} config.centerVertical True to Center View vertically inside parent
 @param {Boolean} config.fillLeft True to use all remaining space left of view. (left pos will be 0)
 @param {Boolean} config.fillRight True to use all remaining space right of view.
 @param {Boolean} config.fillUp True to use all remaining space above view. (top pos will be 0)
 @param {Number} config.absLeft Absolute pixel value for left position
 @param {Number} config.absRight Absolute pixel value for right position
 @param {Number} config.absTop Absolute pixel value for top position
 @param {Number} config.absBottom Absolute pixel value for bottom position
 @param {Number} config.offsetX After positioning the view, offset left position with these number of pixels.
 @param {Number} config.offsetY After positioning the view, offset top position with these number of pixels.
 @param {Array} config.resize Make the view resizable in these directions(left|right|above|below).
 @example
 var view = new ludo.View({
 	layout:{
 		width:'matchParent',height:'matchParent',
 		type:'relative' // Render children in relative layout
 	},
 	children:[ // array of relative positioned children
 	{
 		// Center this view inside parent
		{ id:'child1', html: 'First View', layout:{ centerInParent:true,width:200,height:200}},
		// Render below "child1" and align it with "child1"
		{ id:'child2', html: 'Second View', layout:{ below:'child1', alignLeft:'child1', width:300,height:50 }
 	}]
 });
 */
ludo.layout.Relative = new Class({
	Extends:ludo.layout.Base,
	children:undefined,
	type:'layout.Relative',
    /*
     * Array of valid layout properties
     * @property {Array} layoutFnProperties
     * @private
     */
	layoutFnProperties:[
		'bottom','right','top','left',
		'width', 'height',
		'alignParentTop', 'alignParentBottom', 'alignParentLeft', 'alignParentRight',
		'leftOf', 'rightOf', 'below', 'above',
		'alignLeft', 'alignRight', 'alignTop', 'alignBottom',
		'sameWidthAs', 'sameHeightAs',
		'centerInParent', 'centerHorizontal', 'centerVertical',
		'fillLeft', 'fillRight', 'fillUp', 'fillDown',
		'absBottom','absWidth','absHeight','absLeft','absTop','absRight','offsetX','offsetY',
		'widthOffset','heightOffset'
	],

	newChildCoordinates:{},
	lastChildCoordinates:{},

	onCreate:function () {
		this.parent();
		this.view.$b().css('position', 'relative');

	},

	resize:function () {
		if (this.children === undefined) {
			this.prepareResize();
		}
		for (var i = 0; i < this.children.length; i++) {
            if(!this.children[i].layoutResizeFn){
                this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
            }
			this.children[i].layoutResizeFn.call(this.children[i], this);
		}
	},

    /*
     * No resize done yet, create resize functions
     * @function prepareResize
     * @private
     */
	prepareResize:function( ){
		this.fixLayoutReferences();
		this.arrangeChildren();
     	this.createResizeFunctions();
	},

	createResizeFunctions:function () {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].layoutResizeFn = this.getResizeFnFor(this.children[i]);
		}
	},


	fixLayoutReferences:function () {
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			var k = this.depKeys;
			for (var j = 0; j < k.length; j++) {
				if (c.layout[k[j]] !== undefined)c.layout[k[j]] = this.getReference(c.layout[k[j]]);
			}
		}
	},

	getResizeFnFor:function (child) {
		var fns = this.getLayoutFnsFor(child);
		return function (layoutManager) {
			for (var i = 0; i < fns.length; i++) {
				fns[i].call(child, layoutManager);
			}
		};
	},

	getLayoutFnsFor:function (child) {
		var ret = [];
		var p = this.layoutFnProperties;
		for (var i = 0; i < p.length; i++) {
			if (child.layout[p[i]] !== undefined && child.layout[p[i]] !== false) {
				var fn = this.getLayoutFn(p[i], child);
				if (fn)ret.push(fn);
			}
		}
		ret.push(this.getLastLayoutFn(child));
		return ret;
	},
    /*
     Return one resize function for a child

        getLayoutFn(left, view)
     may return
        function(){
            this.newChildCoordinates[view.id]['left'] = 20;
        }
     The resize functions are created before first resize is made. For second resize,
     the layout functions for each view will simply be called. This is done for optimal performance
     so that we don't need to calculate more than we have to(Only first time).
     */
	getLayoutFn:function (property, child) {
		var c = this.newChildCoordinates[child.id];
		var refC;

		switch (property) {
			case 'top':
			case 'left':
			case 'bottom':
			case 'right':
				return function () {
					c[property] = child.layout[property];
				}.bind(child);

            case 'offsetX':
                return function(){
                    c.left += child.layout[property];
                }.bind(child);
            case 'offsetY':
                return function(){
                    c.top += child.layout[property];
                }.bind(child);
			case 'width':
			case 'height':
				return this.getPropertyFn(child, property);
			case 'absLeft':
				return function () {
					c.left = 0;
				};
			case 'absRight':
				return function () {
					c.right = 0;
				};
			case 'absBottom':
				return function () {
					c.bottom = 0;
				};
			case 'absWidth':
				return function(lm){
					c.width = lm.viewport.absWidth;
				};
			case 'absHeight':
				return function(lm){
					c.height = lm.viewport.absHeight;
				};
			case 'alignParentLeft':
				return function (lm) {
					c.left = lm.viewport.left;
				};
			case 'alignParentRight':
				return function (lm) {
					c.right = lm.viewport.right;
				};
			case 'alignParentTop':
				return function (lm) {
					c.top = lm.viewport.top;
				};
			case 'alignParentBottom':
				return function (lm) {
					c.bottom = lm.viewport.bottom;
				};
			case 'leftOf':
				refC = this.lastChildCoordinates[child.layout.leftOf.id];
				return function () {
					c.right = refC.right + refC.width;
				};
			case 'rightOf':
				refC = this.lastChildCoordinates[child.layout.rightOf.id];
				return function () {
					c.left = refC.left + refC.width;
				};
			case 'below':
				refC = this.lastChildCoordinates[child.layout.below.id];
				return function () {
					c.top = refC.top + refC.height;
				};
			case 'above':
				refC = this.lastChildCoordinates[child.layout.above.id];
				return function () {
					c.bottom = refC.bottom + refC.height;

				};
			case 'sameHeightAs':
				refC = this.lastChildCoordinates[child.layout.sameHeightAs.id];
				return function () {
					c.height = refC.height;
				};
			case 'sameWidthAs':
				refC = this.lastChildCoordinates[child.layout.sameWidthAs.id];
				return function () {
					c.width = refC.width;
				};
			case 'centerInParent':
				return function (lm) {
					c.top = parseInt(lm.viewport.height / 2 - c.height / 2);
					c.left = parseInt(lm.viewport.width / 2 - c.width / 2);
				};
			case 'centerHorizontal':
				return function (lm) {
					c.left = parseInt(lm.viewport.width / 2 - c.width / 2);
				};
			case 'centerVertical':
				return function (lm) {
					c.top = parseInt(lm.viewport.height / 2 - c.height / 2);
				};
			case 'fillLeft':
				return function (lm) {
					if (c.right !== undefined) {
						c.width = lm.viewport.absWidth - c.right;
					}
				};
			case 'fillRight':
				return function (lm) {
					if (c.left === undefined)c.left = 0;
					c.width = lm.viewport.absWidth - c.left - lm.viewport.right;
				};
			case 'fillDown':
				return function (lm) {
					if (c.top === undefined)c.top = 0;
					c.height = lm.viewport.absHeight - c.top - lm.viewport.bottom;
				};
			case 'fillUp':
				return function (lm) {
					if (c.bottom !== undefined) {
						c.height = lm.viewport.absHeight - c.bottom - lm.viewport.top;
						
					}
				};
			case 'alignLeft':
				return this.getAlignmentFn(child, property, 'left');
			case 'alignRight':
				return this.getAlignmentFn(child, property, 'right');
			case 'alignTop':
				return this.getAlignmentFn(child, property, 'top');
			case 'alignBottom':
				return this.getAlignmentFn(child, property, 'bottom');
		}
		return undefined;
	},

	getAlignmentFn:function (child, alignment, property) {
		var c = this.newChildCoordinates[child.id];
		var refC = this.lastChildCoordinates[child.layout[alignment].id];
		return function () {
			c[property] = refC[property];
		};
	},

    /*
     * Returns layout function for the width and height layout properties
     */
	getPropertyFn:function (child, property) {
		var c = this.newChildCoordinates[child.id];

		if (isNaN(child.layout[property])) {
			switch (child.layout[property]) {
				case 'matchParent':
					return function (lm) {
						var off = child.layout[property + 'Offset'] || 0;
						c[property] = lm.viewport[property] + off;
					};
				case 'wrap':
					var ws = ludo.dom.getWrappedSizeOfView(child);
					var key = property === 'width' ? 'x' : 'y';
					return function(){
						c[property] = ws[key];
					};
				default:
					if (child.layout[property].indexOf !== undefined && child.layout[property].indexOf('%') >= 0) {
						var size = parseInt(child.layout[property].replace(/[^0-9]/g));
						return function (lm) {
							c[property] = parseInt(lm.viewport[property] * size / 100);
						}
					}
					return undefined;
			}
		} else {
			return function () {
				c[property] = child.layout[property];
			}.bind(child);
		}
	},

	posProperties:['left', 'right', 'bottom', 'top'],

    /*
     * Final resize function for each child. All the other dynamically created
     */
	getLastLayoutFn:function (child) {
		return function (lm) {
			var c = lm.newChildCoordinates[child.id];
			var lc = lm.lastChildCoordinates[child.id];
			var p = lm.posProperties;
            if(child.layout.above && child.layout.below){
                c.height = lm.viewport.height - c.bottom - c.top;
            }

			if(child.layout.leftOf && child.layout.rightOf){
				c.width = lm.viewport.width - c.right - c.left;
			}



			if(child.isHidden()){
				c.width = 0;
				c.height = 0;
			}
			child.resize({
				width:c.width !== lc.width ? c.width : undefined,
				height:c.height !== lc.height ? c.height : undefined
			});


			if(c.right !== undefined && c.width){
				c.left = lm.viewport.absWidth - c.right - c.width;
				c.right = undefined;
			}

			if(c.bottom !== undefined && c.height){
				c.top = lm.viewport.absHeight - c.bottom - c.height;
				c.bottom = undefined;
			}
			if(c.bottom !== undefined){
				var h = lm.viewport.absHeight - c.bottom - (c.top || 0);
				if(h!= lc.height){
					child.resize({ height: lm.viewport.absHeight - c.bottom - (c.top || 0) });
				}
				c.bottom = undefined;
			}

			for (var i = 0; i < p.length; i++) {
				var key = p[i];
				if (c[key] !== undefined){
					lm.positionChild(child, key, c[key]);
				}
				lc[key] = c[key];
			}
			lc.width = c.width;
			lc.height = c.height;
			lm.updateLastCoordinatesFor(child);
		}
	},
    /*
     * Update lastChildCoordinates properties for a child after resize is completed
     * @function updateLastCoordinatesFor
     * @param {ludo.View} child
     * @private
     */
	updateLastCoordinatesFor:function (child) {
		var lc = this.lastChildCoordinates[child.id];
		var el = child.getEl();
		var pos = el.position == undefined ? { left: el.offsetLeft, top: el.offsetTop } : el.position();
		if (lc.left === undefined) lc.left = pos.left > 0 ? pos.left : 0;
		if (lc.top === undefined) lc.top = pos.top > 0 ? pos.top : 0;
		if (lc.width === undefined) lc.width = el.width != undefined ? el.width() : el.offsetWidth;
		if (lc.height === undefined) lc.height = el.height != undefined ? el.height() : el.offsetHeight;
		if (lc.right === undefined) lc.right = this.viewport.width - lc.left - lc.width;
		if (lc.bottom === undefined) lc.bottom = this.viewport.height - lc.top - lc.height;
	},


	positionChild:function (child, property, value) {
		child.getEl().css(property, value); // style[property] = value + 'px';
		child[property] = value;
	},
    /*
     * Creates empty newChildCoordinates and lastChildCoordinates for a child view
     */
	assignDefaultCoordinates:function (child) {
		this.newChildCoordinates[child.id] = {};
		this.lastChildCoordinates[child.id] = {};
	},

    /*
     * Before first resize, the internal children array is arranged so that views dependent of
     * other views are resized after the view it's depending on. example: if view "a" has leftOf property
     * set to view "b", then view "b" should be resized and positioned first. This method rearranges
     * the internal children array according to this
     * @function arrangeChildren
     * @private
     */
	arrangeChildren:function () {
		this.children = [];
		for (var i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			this.children.push(c);
			this.assignDefaultCoordinates(c);
			if(c.isHidden()){
				this.setTemporarySize(c, { width:0, height:0 });
			}
		}

		this.createResizables();

		var child = this.getWronglyArrangedChild();
		var counter = 0;
		while (child && counter < 30) {
			var dep = this.getDependencies(child);
			if (dep.length > 0) {
				for (var j = 0; j < dep.length; j++) {
					if (this.isArrangedBefore(child, dep[j])) {
						var index = this.children.indexOf(child);
						this.children.splice(index, 1);
						this.children.push(child);
					}
				}
			}
			child = this.getWronglyArrangedChild();
			counter++;
		}

		if (counter === 30) {
			ludo.util.log('Possible circular layout references defined for children in Relative layout');
		}
	},


	resizeKeys:{
		'left':'leftOf',
		'right':'rightOf',
		'above':'above',
		'below':'below'
	},
	resizables : {},

    /*
     * Create resize handles for resizable children
     * @function createResizables
     * @private
     */
	createResizables:function () {
		for (var i = this.children.length - 1; i >= 0; i--) {
			var c = this.children[i];
			if (this.isChildResizable(c)) {
				this.resizables[c.id] = {};
				for (var j = 0; j < c.layout.resize.length; j++) {
					var r = c.layout.resize[j];
					var resizer = this.resizables[c.id][r] = this.getResizableFor(c, r);
					this.assignDefaultCoordinates(resizer);
					this.updateReference(this.resizeKeys[r], c, resizer);
                    var pos = r == 'left' || r === 'above' ? i: i+1;
                    this.children.splice(pos, 0, resizer);
				}
			}
		}
	},

	getResizable:function(child, direction){
		return this.resizables[child.id][direction];
	},

    /*
     * Return resizable handle for a child view
     * @function getResizableFor
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.layout.Resizer}
     * @private
     */
	getResizableFor:function (child, direction) {
        // TODO should be possible to render size of resizer to sum of views (see relative.php demo)
		var resizeProp = (direction === 'left' || direction === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			hidden:child.isHidden(),
			orientation:(direction === 'left' || direction === 'right') ? 'horizontal' : 'vertical',
			pos:direction,
			renderTo:this.view.$b(),
			sibling:this.getSiblingForResize(child,direction),
			layout:this.getResizerLayout(child, direction),
			lm:this,
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	},

    /*
     * Return sibling which may be affected when a child is resized
     * @function getSiblingForResize
     * @param {ludo.View} child
     * @param {String} direction
     * @return {ludo.View|undefined}
     * @private
     */
	getSiblingForResize:function(child, direction){
		switch(direction){
			case 'left':
				return child.layout.rightOf;
			case 'right':
				return child.layout.leftOf;
			case 'above':
				return child.layout.below;
			case 'below':
				return child.layout.above;
		}
		return undefined;
	},
    /*
     * Before resize function executed for a resize handle
     * @function beforeResize
     * @param {ludo.layout.Resizer} resize
     * @param {ludo.View} child
     * @private
     */
	beforeResize:function(resize, child){

		if(resize.orientation === 'horizontal'){
			var min = this.toPixels(child.layout.minWidth || 10);
			resize.setMinWidth(min);
			var max = child.layout.maxWidth || this.view.$b().width();
			max = this.toPixels(max, true);
			resize.setMaxWidth(max);
		}else{
			var minHeight = this.toPixels(child.layout.minHeight || 10);
			resize.setMinHeight(minHeight);
			resize.setMaxHeight(child.layout.maxHeight || this.view.$b().height());
		}
	},

	toPixels:function(value, isWidth){
		if(jQuery.type(value) == "string" && value.indexOf('%') >0){
			var val = parseInt(value);
			return val / 100 * (isWidth ? this.viewport.width : this.viewport.height);
		}
		return value;
	},

    /*
     * Return layout config for a resize handle
     * @function getResizerLayout
     * @param {ludo.View} child
     * @param {String} resize
     * @return {ludo.layout.RelativeSpec}
     * @private
     */
	getResizerLayout:function (child, resize) {
		var ret = {};
		switch (resize) {
			case 'left':
			case 'right':
				ret.sameHeightAs = child;
				ret.alignTop = child;
				ret.width = 5;
				break;
			default:
				ret.sameWidthAs = child;
				ret.alignLeft = child;
				ret.height = 5;
		}
		return ret;
	},

    /*
     * Update layout references when a resize handle has been created. example: When a resize handle
     * is added to the left of a child view. The leftOf view of this child is now the resize handle
     * and not another view
     * @function updateReferences
     * @param {String} property
     * @param {ludo.View} child
     * @param {ludo.layout.Resizer} resizer
     * @private
     */
	updateReference:function (property, child, resizer) {
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].layout[property] === child) {
				this.children[i].layout[property] = resizer;
				resizer.layout.affectedSibling = this.children[i];
			}
		}
		resizer.layout[property] = child;
	},
    /**
     * Returns true if a child is resizable
     * @function isChildResizable
     * @param {ludo.View} child
     * @return {Boolean}
     * @private
     */
	isChildResizable:function (child) {
		return child.layout && child.layout.resize && child.layout.resize.length > 0;
	},

    /*
     * Return a child which should be rearrange because it's layout depends on a next sibling
     * @function getWronglyArrangedChild
     * @return {ludo.View|undefined}
     * @private
     */
	getWronglyArrangedChild:function () {
		for (var i = 0; i < this.children.length; i++) {
			var c = this.children[i];
			var dep = this.getDependencies(c);
			if (dep.length > 0) {
				for (var j = 0; j < dep.length; j++) {
					if (this.isArrangedBefore(c, dep[j])) {
						return c;
					}
				}
			}
		}
		return undefined;
	},
    /*
     * Returns true if a child is previous sibling of another child
     * @function isArrangedBefore
     * @param {ludo.View} child
     * @param {ludo.View} of
     * @return {Boolean}
     * @private
     */
	isArrangedBefore:function (child, of) {
		return this.children.indexOf(child) < this.children.indexOf(of);
	},

    /*
     * All the layout options where value is a reference to another child
     * @property depKeys
     * @private
     */
	depKeys:['above', 'below', 'leftOf', 'rightOf', 'alignLeft', 'alignBottom', 'alignRight', 'alignTop', 'sameWidthAs', 'sameHeightAs'],

    /*
     * Return all the siblings a child is depending on for layout
     * @function getDependencies
     * @param {ludo.View} child
     * @return {Array}
     * @private
     */
	getDependencies:function (child) {
		var ret = [];
		for (var i = 0; i < this.depKeys.length; i++) {
			if (child.layout[this.depKeys[i]] !== undefined) {
				var ref = child.layout[this.depKeys[i]];
				if (ref !== undefined) {
					ret.push(ref);
				}
			}
		}
		return ret;
	},
    /*
     * Return direct reference to child
     * @function getReference
     * @param {String|ludo.View} child
     * @return {ludo.View}
     * @private
     */
	getReference:function (child) {
		if (child['getId'] !== undefined)return child;
		if (this.view.child[child] !== undefined)return this.view.child[child];
		return ludo.get(child);
	},

    /*
     * Clear internal children array. When this is done, resize function will be recreated. This happens
     * when a child is removed or when a new child is added
     * @function clearChildren
     * @private
     */
	clearChildren:function () {
		this.children = undefined;
	},
    /*
     * Return internal children array
     * @function getChildren
     * @return {Array}
     * @private
     */
	getChildren:function () {
		return this.children;
	},

    /*
     * Validate and set required layout properties of new children
     * @function onNewChild
     * @param {ludo.View} child
     * @private
     */
	onNewChild:function (child) {
		this.parent(child);
		if(child.getEl().css != undefined){
			child.getEl().css('position', 'absolute');
		}
        var l = child.layout;
		if (l.centerInParent !== undefined) {
			l.centerHorizontal = undefined;
			l.centerVertical = undefined;
		}
		if(l.fillRight === undefined){
			if (l.width === undefined)l.width = child.width ? child.width : undefined;
		}

		if (l.height === undefined)l.height = child.height ? child.height : undefined;

		if (l.leftOf)l.right = undefined;
		if (l.rightOf)l.left = undefined;
		if (l.below)l.top = undefined;
		if (l.above)l.bottom = undefined;
	},


	addChildEvents:function(child){
		child.addEvent('hide', this.hideChild.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
	}
});/* ../ludojs/src/layout/linear.js */
/**
 * Superclass for the linear vertical and linear horizontal layout.
 * 
 * Use the orientation attribute to choose between horizontal and vertical.
 * 
 * For dynamic sized child views, use the weight attribute instead of height/width.
 *
 * The reserved words **matchParent** and **wrap** can be used for height when rendered vertically, and
 * width when rendered horizontally. **matchParent** means same size as parent, while **wrap** will use
 * minimum width/height.
 * 
 * @class layout.layout.Linear
 * @example
 * layout:{
 * 		type:'linear',
 * 		orientation:'vertical',
 * 		height:'matchParent', width:'matchParent'	
 * },
 * children:[
 * 	{ html: 'First view', layout: { height: 30 }},
 * 	{ html: 'Second View', layout: { weight: 1 }}
 * ]
 */
ludo.layout.Linear = new Class({
	Extends:ludo.layout.Base,

    onCreate:function(){
        // TODO refactor this.
        this.view.$b().css('overflow', 'hidden');
        this.view.$b().css('position', 'relative');
        this.parent();
    },

	onNewChild:function (child) {
		this.parent(child);
		this.updateLayoutObject(child);
		child.addEvent('collapse', this.minimize.bind(this));
		child.addEvent('expand', this.clearTemporaryValues.bind(this));
		child.addEvent('minimize', this.minimize.bind(this));
		child.addEvent('maximize', this.clearTemporaryValues.bind(this));
		child.addEvent('show', this.clearTemporaryValues.bind(this));
	},

	updateLayoutObject:function (child) {
		child.layout = child.layout || {};
		child.layout.width = child.layout.width || child.width;
		child.layout.height = child.layout.height || child.height;
		child.layout.weight = child.layout.weight || child.weight;
		child.layout.resizable = child.layout.resizable || child.resizable;
		child.layout.minWidth = child.layout.minWidth || child.minWidth;
		child.layout.maxWidth = child.layout.maxWidth || child.maxWidth;
		child.layout.minHeight = child.layout.minHeight || child.minHeight;
		child.layout.maxHeight = child.layout.maxHeight || child.maxHeight;
	},

	isResizable:function (child) {
		return child.layout.resizable ? true : false;
	},

	beforeResize:function (resize, child) {
		if (resize.orientation === 'horizontal') {
			resize.setMinWidth(child.layout.minWidth || 10);
			resize.setMaxWidth(child.layout.maxWidth || this.view.$b().width());
		} else {
			resize.setMinHeight(child.layout.minHeight || 10);
			resize.setMaxHeight(child.layout.maxHeight || this.view.$b().height());
		}
	},

	getResizableFor:function (child, r) {


		var resizeProp = (r === 'left' || r === 'right') ? 'width' : 'height';
		return new ludo.layout.Resizer({
			name:'resizer-' + child.name,
			orientation:(r === 'left' || r === 'right') ? 'horizontal' : 'vertical',
			pos:r,
            hidden:child.isHidden(),
			renderTo:this.view.$b(),
			layout:{ width:5,height:5 },
			lm:child.getLayout(),
			view:child,
			listeners:{
				'resize':function (change) {
					child.layout[resizeProp] += change;
					this.resize();
				}.bind(this),
				'before':this.beforeResize.bind(this)
			}
		});
	}
});/* ../ludojs/src/layout/linear-vertical.js */
/**
 * This class arranges child views in a column layout (side by side).
 * @namespace ludo.layout
 * @class ludo.layout.LinearVertical
 * @param {Object} config
 * @param {Boolean} config.resizable - child property
 * @param {String} config.resizePos - child property - Optional position of resize handle - "above" to resize this and previous child,
 * or "below" to resize this and next sibling
 * @param {Number|String} config.height - child property - Numeric height or "wrap"
 * @param {Boolean} config.weight - Dynamic height
 *
 */
ludo.layout.LinearVertical = new Class({
	Extends:ludo.layout.Linear,
	onCreate:function(){
		this.parent();
	},
	resize:function () {
		var availHeight = this.viewport.height;
		var s = {
			width:this.viewport.width,
			height: availHeight
		};

		var totalHeightOfItems = 0;
		var totalWeight = 0;
		var height;
		var tm = this.viewport.top;
		for (var i = 0; i < this.view.children.length; i++) {
			if (!this.hasLayoutWeight(this.view.children[i])) {
                height = this.view.children[i].isHidden() ? 0 :  this.getHeightOf(this.view.children[i], s);
                totalHeightOfItems += height
			} else {
				if (!this.view.children[i].isHidden()) {
					totalWeight += this.view.children[i].layout.weight;
				}
			}
		}

		totalWeight = Math.max(1, totalWeight);

        var remainingHeight;
		var stretchHeight = remainingHeight = (availHeight - totalHeightOfItems);

		var width = this.view.$b().width();
		for (i = 0; i < this.view.children.length; i++) {
			var c = this.view.children[i];
			if(!c.isHidden()){

				var w = c.layout.width;
				var cW = w && !isNaN(w) ? w : width;

				var config = {
					width:c.type == 'layout.Resizer' ? width: cW
				};

				if(config.width < this.viewport.width && c.layout.anchor != undefined){
					var off = this.viewport.width;
					config.left = off * c.layout.anchor - (config.width * c.layout.anchor);
				}

				if(w && c.layout.align){
					switch(c.layout.align){
						case 'right':
							config.left = this.viewport.width - c.layout.width;
							break;
						case 'center':
							config.left = (this.viewport.width / 2) - (c.layout.width / 2);
							break;
					}
				}

				if (this.hasLayoutWeight(c)) {
					if (c.id == this.idLastDynamic) {
						config.height = remainingHeight;
					} else {
						config.height = Math.round(stretchHeight * c.layout.weight / totalWeight);
						remainingHeight -= config.height;
					}
				} else {
					config.height = this.getHeightOf(c, config);
				}

				if (config.height < 0) {
					config.height = undefined;
				}
				if(tm > 0){
					config.top = tm;
				}

				this.resizeChild(c, config);
				tm += c.getEl().outerHeight(true);
			}
		}
	},
	resizeChild:function (child, resize) {
		child.layout.height = resize.height;

		child.resize(resize);
		child.saveState();
	},

	getWrappedHeight:function(){
		var h = this.parent();
		for(var i=0;i<this.view.children.length;i++){
			h += this.view.children[0].getEl().outerHeight(true);
		}
		return h;
	},


	onNewChild:function (child) {
		this.parent(child);
		if (this.isResizable(child)) {
			var isLastSibling = this.isLastSibling(child);

			var rPos;
			if(child.layout && child.layout.resizePos){
				rPos = child.layout.resizePos;
			}else{
				rPos = isLastSibling ? 'above' : 'below';
			}
			var resizer = this.getResizableFor(child, rPos);
			this.addChild(resizer, child, rPos == 'above' ? 'before' : 'after');
		}

		child.getEl().css('position', 'absolute');
	}
});/* ../ludojs/src/layout/linear-horizontal.js */
/**
 * This class arranges child views in a row layout.
 * @namespace ludo.layout
 * @class ludo.layout.LinearHorizontal
 *
 */
ludo.layout.LinearHorizontal = new Class({
    Extends: ludo.layout.Linear,
    type: 'layout.Linear',
    resize: function () {
        var totalWidth = this.viewport.width;

        var height = this.hasDynamicHeight() ? 'auto' : this.viewport.height;
        if (height == 0) {
            return;
        }



        var totalWidthOfItems = 0;
        var totalWeight = 0;
        for (var i = 0; i < this.view.children.length; i++) {
            if (this.view.children[i].isVisible()) {
                if (!this.hasLayoutWeight(this.view.children[i])) {
                    var width = this.getWidthOf(this.view.children[i]);
                    if (width) {
                        totalWidthOfItems += width
                    }

                } else {
                    totalWeight += this.view.children[i].layout.weight;
                }
            }
        }
        totalWeight = Math.max(1, totalWeight);
        var remainingWidth;
        totalWidth = remainingWidth = totalWidth - totalWidthOfItems;


        var currentLeft = this.viewport.left;

        for (i = 0; i < this.view.children.length; i++) {
            var c = this.view.children[i];

            if (c.isVisible()) {
                var config = {'height': height, 'left': currentLeft};

                if (this.hasLayoutWeight(c)) {
                    if (c.id == this.idLastDynamic) {
                        config.width = remainingWidth;
                    } else {
                        config.width = Math.round(totalWidth * c.layout.weight / totalWeight);
                        remainingWidth -= config.width;
                    }
                } else {
                    config.width = this.getWidthOf(c);
                }
                
                this.resizeChild(c, config);
                currentLeft += config.width;
            }
        }

        for (i = 0; i < this.resizables.length; i++) {
            this.resizables[i].colResize();
        }
    },

    resizeChild: function (child, resize) {
        child.layout.width = resize.width;
        child.layout.left = resize.left;
        child.resize(resize);
        child.saveState();
    },

    onNewChild: function (child) {
        this.parent(child);
        child.getEl().css('position', 'absolute');

        if (this.isResizable(child)) {
            var isLastSibling = this.isLastSibling(child);
            var resizer = this.getResizableFor(child, isLastSibling ? 'left' : 'right');
            this.addChild(resizer, child, isLastSibling ? 'before' : 'after');
        }
    },

    hasDynamicHeight: function () {
        return this.view.layout.height && this.view.layout.height == 'dynamic';
    }
});/* ../ludojs/src/layout/fill.js */
/**
 * Layout for one single child spanning entire body of parent view
 * @class ludo.layout.Fill
 */
ludo.layout.Fill = new Class({
    Extends: ludo.layout.Relative,


    addChild: function (child, insertAt, pos) {
        if (child.layout == undefined)child.layout = {};
        child.layout.width = child.layout.height = 'matchParent';
        child.layout.alignParentTop = true;
        child.layout.alignParentLeft = true;

        return this.parent(child, insertAt, pos);
    }
});/* ../ludojs/src/layout/tabs.js */
/**
 * @class ludo.Layout.Tabs
 *
 */
ludo.layout.Tabs = new Class({
    Extends: ludo.View,
    type: 'layout.Tabs',
    tabPos: 'left',
    lm: undefined,
    tabs: {},
    svgTexts: {},

    currentPos: -1,
    activeTab: undefined,
    currentZIndex: 3,
    activeTabId: undefined,

    css:{
        overflow:'hidden'
    },

    tabParent: undefined,

    tabPositions: undefined,

    tabMenuEl: undefined,
    elLine: undefined,

    maxPos: undefined,

    maxSize: undefined,

    hiddenTabs: undefined,

    menu: undefined,

    tabTitles: undefined,
    alwaysInFront: true,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['tabPos']);
        this.lm = config.lm;
        this.hiddenTabs = [];
        this.tabTitles = {};
    },
    ludoEvents: function () {
        this.parent();
        this.lm.addEvent('addChild', this.registerChild.bind(this));
        this.lm.addEvent('addChildRuntime', this.resizeTabs.bind(this));
        this.lm.addEvent('showChild', this.activateTabFor.bind(this));
        this.lm.addEvent('hideChild', this.hideTabFor.bind(this));
        this.lm.addEvent('removeChild', this.removeTabFor.bind(this));
        this.addEvent('resize', this.resizeTabs.bind(this));
    },

    __rendered: function () {
        this.parent();
        this.resizeTabs();
        this.$b().css('overflow','hidden');
    },

    registerChild: function (layout, parent, child) {
        if (!this.lm.isTabs(child)) {
            this.createTabFor(child);
        }
    },

    resizeTabs: function () {


        this.showAllTabs();
        if (this.tabPositions == undefined) {
            this.tabPositions = {};
        }

        this.resizeTabsDom();

        if (this.tabPos === 'top' || this.tabPos === 'bottom')this.findHiddenTabs();
    },

    showAllTabs: function () {
        jQuery.each(this.tabs, function (key) {
            this.tabs[key].show();

        }.bind(this));
    },

    resizeTabsDom: function () {
        var pos = 0;
        var size;

        jQuery.each(this.tabs, function (key) {

            var node = this.tabs[key];
            if (this.tabPos === 'top' || this.tabPos === 'bottom') {
                size = node.outerWidth(true);
            } else {
                size = node.outerHeight(true);
            }
            this.tabPositions[key] = {
                pos: pos,
                size: size
            };
            node.css(this.getPosAttribute(), pos + 'px');

            pos += size;

            this.maxPos = pos;

        }.bind(this));
    },

    findHiddenTabs: function () {

        if (!this.tabParent)return;

        this.tabParent.css('left', 0);

        if (!this.haveTabsOutOfView()) {
            if (this.tabMenuEl)this.tabMenuEl.hide();
            return;
        }

        this.moveCurrentIntoView();

        this.hiddenTabs = [];

        var size = this.$b().width();
        var menu = this.getMenuIcon();


        size -= menu.outerWidth(true);

        var pos = Math.abs(this.tabParent.position().left);

        jQuery.each(this.tabPositions, function (id, position) {
            if (position.pos < pos || position.pos + position.size > pos + size) {
                this.hiddenTabs.push(id);

                if (position.pos >= pos) {
                    this.tabs[id].hide();
                }
            } else {
                this.tabs[id].show();
            }
        }.bind(this));

        menu.html(this.hiddenTabs.length);

        menu.css('visibility', this.hiddenTabs.length > 0 ? 'visible' : 'hidden');


        if (this.hiddenTabs.length > 0) {
            this.maxSize = size - menu.outerWidth(true);
            this.moveCurrentIntoView();
            this.getMenuIcon().show();
        }
        this.resizeTabsDom();
    },

    moveCurrentIntoView: function () {

        var size = this.$b().width();
        var menu = this.getMenuIcon();
        size -= menu.outerWidth(true);
        var pos = Math.abs(this.tabParent.position().left);

        var tabPosition = this.tabPositions[this.activeTabId];

        var offsetStart = tabPosition.pos - pos;
        var offsetEnd = (tabPosition.pos + tabPosition.size) - (pos + size);

        if (offsetStart < 0) {
            this.tabParent.css('left', offsetStart);
        } else if (offsetEnd > 0) {
            var newPos = pos - offsetEnd;
            this.tabParent.css('left', newPos);
        }
    },

    haveTabsOutOfView: function () {
        return this.maxPos > this.$b().width();
    },

    getMenuIcon: function () {
        if (this.tabMenuEl == undefined) {

            if (this.tabPos == 'left' || this.tabPos == 'right') {
                this.tabMenuEl = this.$b();
                return this.tabMenuEl;
            }
            this.tabMenuEl = jQuery('<div class="ludo-tab-expand-box ludo-tab-expand-box-' + this.tabPos + '"></div>');
            this.$b().append(this.tabMenuEl);

            var s = this.$b().outerHeight() - this.elLine.height();
            var k = this.tabPos == 'top' || this.tabPos == 'bottom' ? 'height' : 'width';
            this.tabMenuEl.css(k, s);

            if (this.tabPos == 'bottom') {
                this.tabMenuEl.css('top', this.elLine.outerHeight());
            }

            this.tabMenuEl.css('line-height', s + "px");

            this.tabMenuEl.on('click', this.toggleMenu.bind(this));
            this.tabMenuEl.css('visibility', 'hidden');

            this.tabMenuEl.mouseenter(this.enterMenuIcon.bind(this));
            this.tabMenuEl.mouseleave(this.leaveMenuIcon.bind(this));

        }
        return this.tabMenuEl;
    },

    enterMenuIcon: function (e) {
        jQuery(e.target).addClass('ludo-tab-expand-box-' + this.tabPos + '-over');
    },

    leaveMenuIcon: function (e) {
        jQuery(e.target).removeClass('ludo-tab-expand-box-' + this.tabPos + '-over');
    },

    getMenu: function () {
        if (this.menu == undefined) {
            var layout = {
                type: 'menu',
                orientation: 'vertical',
                alignLeft: this.tabMenuEl,
                height: 'wrap',
                width: 'wrap'
            };

            if (this.tabPos == 'top') {
                layout.below = this.tabMenuEl
            } else {
                layout.above = this.tabMenuEl;
            }
            this.menu = new ludo.menu.Menu({
                renderTo: document.body,
                hidden: true,
                alwaysInFront: true,
                layout: layout,
                listeners: {
                    'click': function (item) {
                        if (item.action && this.tabs[item.action] != undefined) {
                            ludo.$(item.action).show();
                            this.menu.hide();
                            this.resizeTabs();
                        }
                    }.bind(this)
                }

            });
            this.menu.getEl().mousedown(ludo.util.cancelEvent);
            ;
            ludo.EffectObject.on('start', this.hideMenu.bind(this));
            jQuery(document.documentElement).mousedown(this.domClick.bind(this));

        }
        return this.menu;
    },

    menuShown: false,

    domClick: function (e) {
        if (this.menu == undefined)return;
        if (e.target == this.tabMenuEl[0])return;
        this.hideMenu();
    },

    autoHide: function () {
        this.hideMenu();
    },

    hideMenu: function () {
        this.getMenu().hide();
    },


    toggleMenu: function () {
        var menu = this.getMenu();

        if (menu.isHidden()) {
            this.showMenu();
        } else {
            this.menu.hide();
        }
    },

    showMenu: function () {
        this.menuShown = true;
        var menu = this.getMenu();

        menu.show();

        menu.disposeAllChildren();
        jQuery.each(this.hiddenTabs, function (index, id) {
            menu.addChild({
                label: this.tabTitles[id],
                action: id
            });
        }.bind(this));

        this.menu.getLayout().resize();
    },

    createTabFor: function (child) {

        if (this.tabParent == undefined) {
            this.tabParent = jQuery('<div style="position:absolute" class="ludo-tab-layout-parent-for-tabs ludo-tab-layout-parent-for-tabs-' + this.tabPos + '"></div>');
            if (this.tabPos == 'top' || this.tabPos == 'bottom') {
                this.tabParent.css({
                    height: this.$b().height(),
                    width: 10000
                });
            } else {
                this.tabParent.css({
                    width: this.$b().width(),
                    height: 10000
                });
            }

            this.$b().append(this.tabParent);
        }
        var node;
        if (this.tabPos === 'top' || this.tabPos == 'bottom') {
            node = this.getPlainTabFor(child);
        } else {
            node = this.getSVGTabFor(child);
        }

        node.on('click', child.show.bind(child, false));
        this.tabParent.append(node);
        if (child.layout.closable) {
            this.addCloseButton(node, child);
        }
        node.css(this.getPosAttribute(), this.currentPos);
        node.addClass("ludo-tab-strip-tab");
        node.addClass('ludo-tab-strip-tab-' + this.tabPos);
        this.tabs[child.getId()] = node;

        if (!child.isHidden())this.activateTabFor(child);

    },

    addCloseButton: function (node, child) {
        var el = jQuery('<div>');
        el.addClass('ludo-tab-close ludo-tab-close-' + this.tabPos);
        el.mouseenter(this.enterCloseButton.bind(this));
        el.mouseleave(this.leaveCloseButton.bind(this));
        el.attr('id', 'tab-close-' + child.id);
        el.on('click', this.removeChild.bind(this));
        node.append(el);
        var p;
        switch (this.tabPos) {
            case 'top':
            case 'bottom':
                p = node.css('padding-right');
                node.css('paddingRight', (parseInt(p) + el.outerWidth()));
                break;
            case 'right':
                p = node.css('padding-right');
                node.css('paddingBottom', (parseInt(p) + el.outerHeight()));
                break;
            case 'left':
                p = node.css('padding-right');
                node.css('paddingTop', (parseInt(p) + el.outerHeight()));
                break;
        }
    },

    removeChild: function (e) {
        var id = e.target.id.replace('tab-close-', '');
        ludo.get(id).remove();
        return false;
    },

    removeTabFor: function (child) {
        this.tabs[child.getId()].remove();
        if (this.svgTexts[child.getId()]) {
            this.svgTexts[child.getId()].remove();
            delete this.svgTexts[child.getId()];
        }
        delete this.tabs[child.getId()];
        this.tabPositions[child.getId()] = undefined;

        this.resizeTabs();
    },

    enterCloseButton: function (e) {
        jQuery(e.target).addClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    leaveCloseButton: function (e) {
        jQuery(e.target).removeClass('ludo-tab-close-' + this.tabPos + '-over');
    },

    getPosAttribute: function () {
        if (!this.posAttribute) {
            switch (this.tabPos) {
                case 'top':
                case 'bottom':
                    this.posAttribute = 'left';
                    break;
                case 'left':
                case 'right':
                    this.posAttribute = 'top';
                    break;
            }
        }
        return this.posAttribute;
    },


    getPlainTabFor: function (child) {
        var el = jQuery('<div>');
        this.$b().append(el);
        el.className = 'ludo-tab-strip-tab ludo-tab-strip-tab-' + this.tabPos;
        el.html('<div class="ludo-tab-strip-tab-bg"></div><span style="z-index:2">' + this.getTitleFor(child) + '</span>');
        return el;
    },

    getSVGTabFor: function (child) {
        var el = jQuery('<div><div class="ludo-tab-strip-tab-bg"></div></div>');
        this.$b().append(el);

        var svgEl = jQuery('<div style="z-index:2;position:relative">');
        el.append(svgEl);
        var box = new ludo.layout.TextBox({
            renderTo: svgEl,
            width: 1000, height: 1000,
            className: 'ludo-tab-strip-tab-txt-svg',
            classNameOver: 'ludo-tab-strip-tab-txt-svg-active',
            text: this.getTitleFor(child),
            rotation: this.getRotation()
        });
        var size = box.getSize();
        svgEl.css({
            'width': size.x, height: size.y
        });

        this.svgTexts[child.getId()] = box;
        return el;
    },

    getRotation: function () {
        if (this.rotation === undefined) {
            switch (this.tabPos) {
                case 'left' :
                    this.rotation = 270;
                    break;
                case 'right' :
                    this.rotation = 90;
                    break;
                case 'bottom' :
                    this.rotation = 180;
                    break;
                default :
                    this.rotation = 0;
                    break;
            }
        }
        return this.rotation;
    },

    getTitleFor: function (child) {
        var title = (child.title || child.layout.title || child.getTitle());
        this.tabTitles[child.id] = title;
        return title;
    },

    hideTabFor: function () {
        if (this.activeTab != undefined) {
            this.activeTab.removeClass('ludo-tab-strip-tab-active');
            this.svgTextMethod(this.activeTabId, 'leave');

        }
    },

    svgTextMethod: function (childId, method) {
        var t = this.svgTexts[childId];
        if (t != undefined && t[method] != undefined) {
            t[method]();
        }
    },

    activateTabFor: function (child) {
        this.hideTabFor();

        if (this.tabs[child.id] !== undefined) {

            this.svgTextMethod(child.id, 'enter');

            this.tabs[child.id].addClass('ludo-tab-strip-tab-active');
            this.activeTab = this.tabs[child.id];
            this.activeTab.css('zIndex', this.currentZIndex);
            this.currentZIndex++;

            this.activeTabId = child.id;

            if (this.hiddenTabs.length > 0) {
                this.resizeTabs();
            }
        }

    },

    ludoDOM: function () {
        this.parent();
        this.getEl().addClass('ludo-tab-strip');
        this.getEl().addClass('ludo-tab-strip-' + this.tabPos);

        var el = jQuery('<div>');
        el.addClass('ludo-tab-strip-line');
        this.elLine = el;
        this.$b().append(el);

        this.getMenuIcon();
    },

    getTabFor: function (child) {
        return this.tabs[child.id]
    },

    getChangedViewport: function () {
        var value;
        if (this.tabPos === 'top' || this.tabPos === 'bottom') {
            value = this.getEl().outerHeight(true);
        } else {
            value = this.getEl().outerWidth(true);
        }
        return {
            key: this.tabPos, value: value
        };
    },
    getCount: function () {
        return Object.keys(this.tabs).length;
    },

    resize: function (size) {
        this.parent(size);
    }
});/* ../ludojs/src/layout/tab.js */
/**
 * Layout rendering child views in a tab layout. By default, the first child view will be displayed. You can override
 * this by setting **layout.visible** to true for a specific child.
 *
 * For a demo, see <a href="../demo/layout/tab.php" onclick="var w=window.open(this.href);return false">Tab layout demo</a>.
 * @class layout.Tab
 * @namespace ludo.layout
 * @summary layout: layout: {type: "tab" }
 * @class ludo.layout.Tab
 * @param {Object} config
 * @param {String} config.tabPos Position of tabs, **left**, **top**, **right** or **bottom**
 * @param {String} config.title **Option** for child views layout object. The title will be displayed on the tab.
 * @param {Boolean} config.visible **Option** for child views layotu object. True to initially display a different
 * tab than the first
 * @example
 *     var w = new ludo.Window({
        left: 50, top: 50,
        title: 'Tab layout',
        width: 500, height: 400,
        layout: {
            type: 'tab',
            tabs: 'top'
        },
        children:[
            {
                title:'first tab'
            },
            {
                title:'second tab',
                layout:{
                    visible:true
                }
            }
        ]
        });
 */
ludo.layout.Tab = new Class({
    Extends: ludo.layout.Relative,
    visibleChild: undefined,
    tabStrip: undefined,
    type:'layout.Tab',

    onCreate: function () {
        this.parent();
        this.view.getEl().addClass('ludo-layout-tab');
        this.addChild(this.getTabs());

        this.updateViewport(this.tabStrip.getChangedViewport());
    },

    afterCreate:function(){

    },

    addChild: function (child, insertAt, pos) {


        if (!this.isTabs(child) && (!child.layout || !child.layout.visible))child.hidden = true;
        return this.parent(child, insertAt, pos);

    },

    onNewChild: function (child) {

        if (!this.isTabs(child)) {
            var l = child.layout;

            if (!child.isHidden()) {
                this.setVisibleChild(child);
            }

            l.alignParentLeft = true;
            l.alignParentTop = true;
            l.fillRight = true;
            l.fillDown = true;

        }
        this.parent(child);
    },

    setTemporarySize: function () {

    },

    addChildEvents: function (child) {
        if (!this.isTabs(child)) {
            child.addEvent('show', this.showTab.bind(this));
            child.addEvent('remove', this.onChildDispose.bind(this));
        }
    },

    getTabPosition: function () {
        return this.view.layout.tabs || 'top';
    },

    canHaveNoActiveTabs:false,

    getTabs: function () {
        if (this.tabStrip === undefined) {
            this.tabStrip = new ludo.layout.Tabs({
                lm: this,
                parentComponent: this.view,
                tabPos: this.getTabPosition(),
                renderTo: this.view.$b(),
                layout: this.getTabsLayout(),
                canHaveNoActiveTabs:this.canHaveNoActiveTabs
            });
        }
        return this.tabStrip;
    },

    setVisibleChild: function (child) {
        if (this.visibleChild)this.visibleChild.hide();
        this.visibleChild = child;
        this.fireEvent('showChild', child);
    },

    showTab: function (child) {
        if (child !== this.visibleChild) {
            if(this.visibleChild){
                this.visibleChild.getEl().css('visibility', 'hidden');
            }
            child.getEl().css('visibility', 'visible');
            this.setVisibleChild(child);
            this.resize();
        }

    },

    resize: function () {

        if (this.visibleChild === undefined && this.autoShowFirst()) {
            if (this.view.children.length > 1)this.view.children[1].show();
        } else {

            if (this.children === undefined || (this.visibleChild && !this.visibleChild.layoutResizeFn)) {
                this.prepareResize();
            }

            this.tabStrip.layoutResizeFn.call(this.visibleChild, this);

            if (this.visibleChild) {

                if (!this.visibleChild.layoutResizeFn) {
                    this.prepareResize();
                }
                this.visibleChild.layoutResizeFn.call(this.visibleChild, this);
            }
        }
    },

    autoShowFirst: function () {
        return true;
    },

    getTabsLayout: function () {
        switch (this.getTabPosition()) {
            case 'top':
                return {
                    absTop: true,
                    absLeft: true,
                    absWidth: true
                };
            case 'left':
                return {
                    absTop: true,
                    absLeft: true,
                    absHeight: true
                };
            case 'right':
                return {
                    absTop: true,
                    absRight: true,
                    absHeight: true
                };
            case 'bottom':
                return {
                    absBottom: true,
                    absLeft: true,
                    absWidth: true
                };
        }
        return undefined;
    },

    isTabs: function (view) {
        return view.type === 'layout.Tabs';
    },

    onChildDispose: function (child) {
        if (this.visibleChild && this.visibleChild.id === child.id) {
            var i = this.view.children.indexOf(this.visibleChild);
            if (i > 1) {
                this.view.children[i - 1].show();
            } else {
                if (this.view.children.length > 2) {
                    this.view.children[i + 1].show();
                }
            }
        }

        this.fireEvent('removeChild', child);
    }
});/* ../ludojs/src/data-source/record.js */
/**
 * Class representing a record in a <a href="ludo.dataSource.JSONArray.html">Collection</a>
 * Instances of this class are created by the collections getRecord method.
 * When you update a record
 * @namespace ludo.dataSource
 * @class ludo.dataSource.Record
 */
ludo.dataSource.Record = new Class({
	Extends:Events,
	record:undefined,
	collection:undefined,

    /*
     * Array of events which should fire update event
     * @property {Array} eventKeys
     * @default undefined
     */
    eventKeys:undefined,

	initialize:function (record, collection) {
		this.record = record;
		this.collection = collection;
	},

	/**
	 * Update property of record
	 * @function set
	 * @param {String} key
	 * @param {String|Number|Object} value
	 * @return {dataSource.Record}
	 * @memberof ludo.dataSource.Record.prototype
	 */
	set:function (key, value) {
		this.fireEvent('beforeUpdate', this.record);
		this.record[key] = value;
		if(!this.eventKeys || this.eventKeys.indexOf(key) >= 0){
            this.fireEvent('update', this.record);
        }
		return this;
	},

	/**
	 Return value of key
	 @function get
	 @param {String} key
	 @return {String|Number|Object} value
	 @memberof ludo.dataSource.Record.prototype
	 */
	get:function (key) {
		return this.record[key];
	},
	/**
	 Update multiple properties
	 @function setProperties
	 @param {Object} properties
	 @return {dataSource.Record|undefined}
	 @memberof ludo.dataSource.Record.prototype
	 @example
	    var collection = new ludo.dataSource.JSONArray({
	 		idField:'id'
		});
	 collection.getRecord(100).setProperties({ country:'Norway', capital:'Oslo' });
	 will set country to "Norway" and capital to "Oslo" for record where "id" is equal to 100. If you're not sure
	 that the record exists, you should use code like this:
	 @example
	    var rec = collection.getRecord(100);
	    if(rec)rec.setProperties({ country:'Norway', capital:'Oslo' });
	 */
	setProperties:function (properties) {
		this.fireEvent('beforeUpdate', this.record);
		for (var key in properties) {
			if (properties.hasOwnProperty(key)) {
				this.record[key] = properties[key];
			}
		}
		this.fireEvent('update', [this.record,undefined, 'update']);
		return this;
	},

	addChild:function (record) {
		record = this.getPlainRecord(record);
		this.record.children = this.record.children || [];
		this.record.children.push(record);
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent)parent.removeChild(record);
		}
		this.fireEvent('addChild', [record, this.record, 'addChild']);
		return this;
	},

	getParent:function () {
		return this.collection.getRecord(this.record.parentUid);
	},

	getCollection:function(){
		return this.collection;
	},

	isRecordObject:function (rec) {
		return rec['initialize'] !== undefined && rec.record !== undefined;
	},

	getChildren:function () {
		return this.record.children;
	},

	removeChild:function (record) {
		record = this.getPlainRecord(record);
		var index = this.record.children.indexOf(record);
		if (index >= 0) {
			this.record.children.splice(index, 1);
			this.fireEvent('removeChild', [record, this.record, 'removeChild']);
		}
	},

	getPlainRecord:function (record) {
		return this.isRecordObject(record) ? record.record : record;
	},

    select:function(){
        this.fireEvent('select', this);
    },

	insertBefore:function (record, before) {
		if (this.inject(record, before)) {
			this.fireEvent('insertBefore', [record, before, 'insertBefore']);
		}
	},

	insertAfter:function (record, after) {
		if (this.inject(record, after, 1)) {
			this.fireEvent('insertAfter', [record, after, 'insertAfter']);
		}
	},

	inject:function (record, sibling, offset) {
		offset = offset || 0;
		record = this.getPlainRecord(record);
		sibling = this.getPlainRecord(sibling);
		if (record === sibling)return false;
		if (record.parentUid) {
			var parent = this.collection.getRecord(record.parentUid);
			if (parent){
				if(this.isMyChild(record)){
					this.record.children.splice(this.getChildIndex(record), 1);
				}else{
					parent.removeChild(record);
				}
			}
		}
		var index = this.record.children.indexOf(sibling);
		if (index !== -1) {
			this.record.children.splice(index + offset, 0, record);
			return true;
		}
		return false;
	},

	getChildIndex:function (record) {
		return this.record.children ? this.record.children.indexOf(this.getPlainRecord(record)) : -1;
	},

	isMyChild:function (record) {
		return this.record.children && this.record.children.indexOf(this.getPlainRecord(record)) !== -1;
	},

	getUID:function(){
		return this.record.uid;
	},

	getData:function(){
		return this.record;
	},

	dispose:function(){
		this.fireEvent('remove', this.record);
		delete this.record;
	}
});/* ../ludojs/src/data-source/search-parser.js */
/**
 * Internal class used to parse search into a function
 * @namespace ludo.dataSource
 * @class ludo.dataSource.SearchParser
 */
ludo.dataSource.SearchParser = new Class({

	searches:undefined,

	parsedSearch:{
		items:[]
	},
	branches:[],

	compiled:undefined,

	getSearchFn:function(searches){
		this.parse(searches);
		this.compiled = this.parsedSearch;
		this.compiled = this.compile(Object.clone(this.parsedSearch));
		return this.compiled;
	},

	clear:function(){
		this.parsedSearch = {
			items:[]
		};
		this.branches = [];
	},

	parse:function (searches) {
		this.clear();
		this.branches.push(this.parsedSearch);
		for (var i = 0; i < searches.length; i++) {
			if (this.isBranchStart(searches[i])) {
				var branch = {
					items:[]
				};
				this.appendToCurrentBranch(branch);
				this.branches.push(branch);
			}
			else if (this.isBranchEnd(searches[i])) {
				this.setOperatorIfEmpty();
				if (this.branches.length > 1)this.branches.pop();
			}
			else if (this.isOperator(searches[i])) {
				if (!this.hasOperator()) {
					this.setOperator(searches[i]);
				} else if (this.shouldCreateBranchOfPrevious(searches[i])) {
					this.createBranchOfPrevious();
					this.setOperator(searches[i]);
				} else if (this.shouldCreateNewBranch(searches[i])) {
					var newBranch = {
						operator:searches[i],
						items:[]
					};
					newBranch.items.push(this.branches[this.branches.length - 1].items.pop());
					this.appendToCurrentBranch(newBranch);
					this.branches.push(newBranch);
				}

			} else {
				this.appendToCurrentBranch(searches[i]);
			}
		}
		this.setOperatorIfEmpty();

	},

	compile:function(branch){
		var ib = this.getIndexOfInnerBranch(branch);
		var counter = 0;
		while(ib >=0 && counter < 100){
			branch.items[ib] = { fn : this.compile(branch.items[ib]) };
			counter++;
			ib = this.getIndexOfInnerBranch(branch);
		}
        return branch.operator === '&' ? this.getAndFn(branch) : this.getOrFn(branch);
	},

	getAndFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) === -1) {
						return false;
					}
				} else if (items[i].fn !== undefined) {
					if (!items[i].fn.call(this, record))return false;
				}
			}
			return true;
		}
	},

	getOrFn:function(branch){
		var items = branch.items;
		return function(record){
			for(var i=0;i<items.length;i++){
				if (items[i].txt !== undefined) {
					if (record.searchIndex.indexOf(items[i].txt) > -1) {
						return true;
					}
				} else if (items[i].fn !== undefined) {
					if (items[i].fn.call(this, record))return true;
				}
			}
			return false;
		}
	},

	getIndexOfInnerBranch:function(branch){
		for(var i=0;i<branch.items.length;i++){
			if(branch.items[i].operator !== undefined)return i;
		}
		return -1;
	},

	setOperatorIfEmpty:function () {
		var br = this.branches[this.branches.length - 1];
		br.operator = br.operator || '&';
	},

	isBranchStart:function (operator) {
		return operator === '(';
	},

	isBranchEnd:function (operator) {
		return operator === ')';
	},

	shouldCreateBranchOfPrevious:function (operator) {
		return operator === '|' && this.getCurrentOperator() === '&';
	},

	createBranchOfPrevious:function () {
		var br = this.branches[this.branches.length - 1];
		var newBranch = {
			operator:br.operator,
			items:br.items
		};
		br.operator = undefined;
		br.items = [newBranch];
	},

	shouldCreateNewBranch:function (operator) {
		return operator === '&' && this.isDifferentOperator(operator);
	},

	appendToCurrentBranch:function (search) {
		this.branches[this.branches.length - 1].items.push(search);
	},

	isOperator:function (token) {
		return token === '|' || token === '&';
	},

	hasOperator:function () {
		return this.branches[this.branches.length - 1].operator !== undefined;
	},

	isDifferentOperator:function (operator) {
		return operator !== this.getCurrentOperator();
	},

	getCurrentOperator:function () {
		return this.branches[this.branches.length - 1].operator;
	},

	setOperator:function (operator) {
		this.branches[this.branches.length - 1].operator = operator;
	}
});/* ../ludojs/src/data-source/json-array-search.js */
/**
 Class created dynamically by dataSource.JSONArray.
 It is used to search and filter data in a collection.
 @namespace ludo.dataSource
 @class ludo.dataSource.JSONArraySearch
 @param {object} config
 @param {object} config.delay  Delay in seconds between call to search and execution of search.
 A delay is useful when using text fields to search. Default : 0
 @param {Array} config.index Columns in datasource to index for search
 @fires ludo.dataSource.JSONArraySearch#initSearch Fired just before search starts
 @fires ludo.dataSource.JSONArraySearch#search Fired when search is finished
 @fires ludo.dataSource.JSONArraySearch#deleteSearch
 */
ludo.dataSource.JSONArraySearch = new Class({
	Extends:ludo.Core,
	dataSource:undefined,
	searchResult:undefined,
	searchIndexCreated:false,

	delay:0,
	searches:undefined,
	searchBranches:undefined,
	searchFn:undefined,
	currentBranch:undefined,

	index:undefined,

	searchParser:undefined,

	__construct:function (config) {
		this.parent(config);
        this.__params(config, ['dataSource','index','delay']);
		this.searchParser = new ludo.dataSource.SearchParser();
		this.clear();
	},

	ludoEvents:function () {
		this.parent();
		if(!this.dataSource.hasRemoteSearch()){
			this.dataSource.addEvent('beforeload', this.clearSearchIndex.bind(this));
			this.dataSource.addEvent('beforeload', this.deleteSearch.bind(this));
			this.dataSource.addEvent('update', this.clearSearchIndex.bind(this));
			this.dataSource.addEvent('delete', this.onDelete.bind(this));
		}
	},
	/**
	 * execute a text search
	 * @function Search
	 * @param {String} search
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 */
	search:function (search) {
		if (!search && this.searches.length == 0)return;
		this.clear();
		this.where(search);
		this.endBranch();

		var delay = this.getSearchDelay();
		if (delay === 0) {
			this.executeSearch(this.searches[0].txt);
		} else {
			this.executeSearch.delay(delay * 1000, this, this.searches[0].txt);
		}
	},

	executeSearch:function (searchTerm) {
		if (searchTerm == this.searches[0].txt) {
			this.execute();
		}
	},

	/**
	 Clear all search terms and search functions
	 @function clear
	 @chainable
	 @return {dataSource.JSONArraySearch} this
	 @memberof ludo.dataSource.JSONArraySearch.prototype
	 */
	clear:function () {
		this.searches = [];
		return this;
	},

	/**
	 * Delete search terms/functions and dispose search result. This method will fire a deleteSearch event which
	 * {{#crossLink "dataSource.JSONArray"}}{{/crossLink}} listens to. It will trigger an update of
	 * views using the {{#crossLink "dataSource.JSONArray"}}{{/crossLink}} object as dataSource.
	 * @function deleteSearch
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 */
	deleteSearch:function () {
		this.fireEvent('deleteSearch');
		this.searchResult = undefined;
		this.clear();
	},
	/**
	 Start building a new search
	 @function where
	 @param {String|Function} search
	 @return {dataSource.JSONArraySearch} this
	 @memberof ludo.dataSource.JSONArraySearch.prototype
	 @chainable
	 @example
		 var searcher = ludo.get('idOfDataSearch').getSearcher();
		 searcher.where('Portugal').or('Norway').execute();
	 will find all records where the search index matches 'Portugal' or 'Norway' (case insensitive).
	 By default, the entire record is indexed. Custom indexes can be created by defining
	 index using the "index" constructor attribute.
	 @example
	 	searcher.where(function(record){
	 		return parseInt(record.price) < 100
	 	});
	 is example of a function search. On {{#crossLink "dataSource.JSONArray/execute"}}{{/crossLink}} this
	 function will be called for each record. It should return true if match is found, false otherwise.
	 The function above will return true for all records where the value of record.price is less than 100.
	 */
	where:function (search) {
		this.clear();
		this.appendSearch(Array.from(arguments));
		return this;
	},

	/**
	 OR search
	 @function or
	 @param {String|Function} search
	 @return {dataSource.JSONArraySearch} this
	 @memberof ludo.dataSource.JSONArraySearch.prototype
	 @chainable
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').or(populationFn).execute();

	 Finds all records where 'Europe' is in the text or population is greater than 1
	 million.
	 */
	or:function (search) {
		this.appendOperator('|');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	appendSearch:function (args) {
		this.preCondition(args);
		var search = this.getActualArgument(args);
        var searchObject;
		if (typeof search === 'function') {
			searchObject = { fn:search };
		} else {
			searchObject = { txt:search.toLowerCase() };
		}
		this.searches.push(searchObject);
		this.postCondition(args);
	},

	/**
	 AND search
	 @function and
	 @param {String|Function} search
	 @return {dataSource.JSONArraySearch} this
	 @chainable
	 @memberof ludo.dataSource.JSONArraySearch.prototype
	 @example
		 var searcher = myDataSource.getSearcher();
		 var populationFn = function(record){
					return record.population > 1000000 ? true: false;
				}
		 searcher.where('Europe').and(populationFn).execute();
	 Finds all records where 'Europe' is in the text and population is greater than 1
	 million.
	 */
	and:function (search) {
		this.appendOperator('&');
		this.appendSearch(Array.from(arguments));
		return this;
	},

	preCondition:function (args) {
		if (args.length == 2 && args[0] === '(') {
			this.branch();
		}
	},

	postCondition:function (args) {
		if (args.length == 2 && args[1] === ')') {
			this.endBranch();
		}
	},

	getActualArgument:function (args) {
		if (args.length === 2) {
			if (args[0] == ')' || args[0] == '(') {
				return args[1];
			}
			return args[0];
		}
		return args[0];
	},


	/**
	 * Search for match in one of the items
	 * @function withIn
	 * @param {Array} searches
	 * @chainable
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 * @return {dataSource.JSONArraySearch} this
	 */
	withIn:function (searches) {
		for (var i = 0; i < searches.length; i++) {
			this.or(searches[i]);
		}
		return this;
	},

	/**
	 * Start grouping search items together
	 * @function branch
	 * @chainable
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 * @return {dataSource.JSONArraySearch} this
	 */
	branch:function () {
		this.appendOperator('(');
		return this;
	},
	/**
	 * Close group of search items.
	 * @function branch
	 * @chainable
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 * @return {endBranch.CollectionSearch} this
	 */
	endBranch:function () {
		this.appendOperator(')');
		return this;
	},

	appendOperator:function (operator) {
		if (operator != '(' && this.searches.length == 0)return;
		if (operator === '|' && this.searches.getLast() === '(')return;
		this.searches.push(operator);
	},
	/**
	 Execute a search based on current search terms
	 @function execute
	 @chainable
	 @return {dataSource.JSONArraySearch} this
	 @memberof ludo.dataSource.JSONArraySearch.prototype
	 @example
		 // Assumes that ludo.get('collection') returns a {{#crossLink "dataSource.JSONArray"}}{{/crossLink}} object
		 var searcher = ludo.get('collection').getSearcher();
		 searcher.clear();
		 searcher.where('Oslo').or('Moscow');
		 searcher.execute();
	 */
	execute:function () {
		if (!this.searchIndexCreated) {
			this.createSearchIndex();
		}
		if (!this.hasSearchTokens()) {
			this.deleteSearch();
		} else {
            this.fireEvent('initSearch');
			this.searchResult = [];
			this.compileSearch();
            this.performSearch();
		}

		this.fireEvent('search');
		return this;
	},

    performSearch:function(){
        var data = this.getDataFromSource();
        for (var i = 0; i < data.length; i++) {
            if (this.isMatchingSearch(data[i])) {
                this.searchResult.push(data[i]);
            }
        }
    },

	isMatchingSearch:function (record) {
		return this.searchFn.call(this, record);
	},

	compileSearch:function () {
		this.searchFn = this.searchParser.getSearchFn(this.searches);
	},

	/**
	 * Returns true if search terms or search functions exists.
	 * @function hasSearchTokens
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 * @return {Boolean}
	 */
	hasSearchTokens:function () {
		return this.hasContentInFirstSearch() || this.searches.length > 1;
	},

	hasContentInFirstSearch:function () {
		if (this.searches.length === 0)return false;
		var s = this.searches[0];
		return (ludo.util.isArray(s) || s.fn !== undefined || (s.txt !== undefined && s.txt.length > 0));
	},

	/**
	 * Returns true when<br>
	 *     - zero or more records are found in search result<br>
	 * Returns false when<br>
	 *  - search result is undefined because no search has been executed or search has been deleted.
	 * @function hasData
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 * @return {Boolean}
	 */
	hasData:function () {
		return this.searchResult !== undefined;
	},

	getData:function () {
		return this.searchResult;
	},

	getDataFromSource:function () {
		return this.dataSource.getLinearData();
	},

	getSearchDelay:function () {
		return this.delay || 0;
	},

	onDelete:function(record){
		if(this.searchResult && this.searchResult.length > 0){
			for(var i=0;i<this.searchResult.length-1;i++){
				var rec = this.searchResult[i];
				if(rec.uid == record.uid){
					this.clearSearchIndex();
					this.searchResult.splice(i, 1);
					console.log(this.searchResult.length);
				}
			}
		}

	},

	clearSearchIndex:function () {
		this.searchIndexCreated = false;
	},

	createSearchIndex:function () {
		this.indexBranch(this.getDataFromSource());
		this.searchIndexCreated = true;
	},

    indexBranch:function(data, parents){
		parents = parents || [];
        var keys = this.getSearchIndexKeys();

        var index;
        for (var i = 0; i < data.length; i++) {
            index = [];
            for (var j = 0; j < keys.length; j++) {
                if (data[i][keys[j]] !== undefined) {
                    index.push((data[i][keys[j]] + '').toLowerCase());
                }
            }
            data[i].searchIndex = index.join(' ');

			for(j=0;j<parents.length;j++){
				parents[j].searchIndex = [parents[j].searchIndex, data[i].searchIndex].join(' ');

			}
            if(data[i].children){
                this.indexBranch(data[i].children, parents.concat(data[i]));
            }
        }
    },

	getSearchIndexKeys:function () {
		if (this.index !== undefined) {
			return this.index;
		}
		var reservedKeys = ['children','searchIndex', 'uid'];

		var data = this.getDataFromSource();
		if (data.length > 0) {
			var record = Object.clone(data[0]);
			var ret = [];
			for (var key in record) {
				if (record.hasOwnProperty(key)) {
					if(reservedKeys.indexOf(key) === -1)ret.push(key);
				}
			}
			return ret;
		}
		return ['NA'];
	},

	/**
	 * Returns number of records in search result
	 * @function getCount
	 * @return {Number}
	 * @memberof ludo.dataSource.JSONArraySearch.prototype
	 */
	getCount:function () {
		return this.searchResult ? this.searchResult.length : 0;
	},

    // TODO fix this method
	searchToString:function () {
		return this.hasData() ? '' : '';
	}
});/* ../ludojs/src/data-source/json-array.js */
/**
 Data source collection
 @namespace ludo.dataSource.
 @class ludo.dataSource.JSONArray
 @augments dataSource.JSON
 @param {Object} config
 @param {Object} config.sortFn custom sort functions, which should return -1 if record a is smaller than
 record b and 1 if record b is larger than record a. Example:
 <code>
 sortFn:{
			'population':{
				'asc' : function(a,b){
					return parseInt(a.population) < parseInt(b.population) ? -1 : 1
				},
				'desc' : function(a,b){
					return parseInt(a.population) > parseInt(b.population) ? -1 : 1
				}
			}
	 	}
 </code>
 @param {String} config.primaryKey Primary key, example: primaryKey: "id"
 @param {Object} config.paging
 Example:
 <code>
 paging:{
		 	size:10, // Number of rows per page
		  	remotePaging:true, // Load only records per page from server, i.e. new request per page
		  	cache : true, // Store pages in cache, i.e no request if data for page is in cache,
		  	cacheTimeout:30 // Optional time in second before cache is considered out of date, i.e. new server request
		}
 </code>
 @param {Object} config.searchConfig
 Example:
 <code>
 searchConfig:{
	 		index:['city','country'],
	 		delay:.5
	 	}
 </code>
 which makes the record keys/columns "city" and "country" searchable. It waits .5 seconds
 before the search is executed. This is useful when searching large collections and you
 want to delay the search until the user has finished entering into a search box.
 @fires ludo.dataSource.JSONArray#sort Fires on sort. Arguments: {String} sortedBy key
 @fires ludo.dataSource.JSONArray#add Fires when a new record has been added to the collection. Arguments: {Object} record
 @fires ludo.dataSource.JSONArray#deselect Fires when a record has been deselected, arguments. {Object} deselected record
 @fires ludo.dataSource.JSONArray#select Fires when a record has selected, arguments. {Object} selected record
 @fires ludo.dataSource.JSONArray#delete Fires when a record has been deleted, arguments. {Object} deleted record
 @fires ludo.dataSource.JSONArray#page Fires on navigation to new page when paging is enabled. Arguments: {Number} page index
 @fires ludo.dataSource.JSONArray#previousPage Fires when paging is enabled and navigating to current page -1. No arguments
 @fires ludo.dataSource.JSONArray#nextPage Fires when paging is enabled and navigating to current page +1. No arguments
 @fires ludo.dataSource.JSONArray#firstPage Fired when navigating to first page.  No arguments
 @fires ludo.dataSource.JSONArray#lastPage Fired when navigating to last page.  No arguments
 @fires ludo.dataSource.JSONArray#notLastPage Fired when navigating to a page which is not last page.  No arguments
 @fires ludo.dataSource.JSONArray#notFirstPage Fired when navigating to a page which is not first page.  No arguments
 @fires ludo.dataSource.JSONArray#change Fires when data has been updated or page navigation occurs.
 @example
 dataSource:{
		url:'data-source/grid.php',
		id:'myDataSource',
		paging:{
			size:12,
			remotePaging:false,
			cache:false,
			cacheTimeout:1000
		},
		searchConfig:{
			index:['capital', 'country']
		},
		listeners:{
			select:function (record) {
				console.log(record);
			}
		}
	}
 */
ludo.dataSource.JSONArray = new Class({
    Extends: ludo.dataSource.JSON,
    sortFn: {},

    selectedRecords: [],

    primaryKey: 'id',


    paging: undefined,

    dataCache: {},

    sortedBy: {
        column: undefined,
        order: undefined
    },

    searchConfig: undefined,

    statefulProperties: ['sortedBy', 'paging'],

    index: undefined,

    searcherType: 'dataSource.JSONArraySearch',

    uidMap: {},


    selected: undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['searchConfig', 'sortFn', 'primaryKey', 'sortedBy', 'paging', 'selected']);

        if (this.primaryKey && !ludo.util.isArray(this.primaryKey))this.primaryKey = [this.primaryKey];
        if (this.paging) {
            this.paging.offset = this.paging.offset || 0;
            this.paging.initialOffset = this.paging.offset;
            if (this.paging.initialOffset !== undefined) {
                this.fireEvent('page', (this.paging.initialOffset / this.paging.size) + 1);
            }
            if (this.isCacheEnabled()) {
                this.addEvent('load', this.populateCache.bind(this));
            }
        }

        this.addEvent('parsedata', this.createIndex.bind(this));


        if (this.selected) {
            this.addEvent('firstLoad', this.setInitialSelected.bind(this));
        }

        if (this.data && !this.index)this.createIndex();
    },

    hasRemoteSearch: function () {
        return this.paging && this.paging.remotePaging;
    },

    setInitialSelected: function () {
        this.selectRecord(this.selected);
    },

    /**
     * Returns 1) If search is specified: number of records in search result, or 2) number of records in entire collection.
     * @function getCount
     * @return {Number} count
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getCount: function () {
        if (this.paging && this.paging.rows)return this.paging.rows;
        if (this.searcher && this.searcher.hasData())return this.searcher.getCount();
        return this.data ? this.data.length : 0;
    },

    isCacheEnabled: function () {
        return this.paging && this.paging['remotePaging'] && this.paging.cache;
    },

    /**
     * Resort data-source
     * @function sort
     * @return void
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    sort: function () {
        if (this.sortedBy.column && this.sortedBy.order) {
            this.sortBy(this.sortedBy.column, this.sortedBy.order);
        }
    },

    /**
     Set sorted by column
     @function by
     @param {String} column
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.by('country').ascending().sort();
     or
     @example
     collection.by('country').sort();
     */
    by: function (column) {
        this.sortedBy.column = column;
        this.sortedBy.order = this.getSortOrderFor(column);
        return this;
    },
    /**
     Set sort order to ascending
     @function ascending
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.by('country').ascending().sort();
     */
    ascending: function () {
        this.sortedBy.order = 'asc';
        return this;
    },
    /**
     Set sort order to descending
     @function descending
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.by('country').descending().sort();
     */
    descending: function () {
        this.sortedBy.order = 'desc';
        return this;
    },

    /**
     Sort by column and order

     The second argument(order) is optional
     @function sortBy
     @param {String} column
     @param {String} order
     @optional
     @return {dataSource.JSONArray} this
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     grid.getDataSource().sortBy('firstname', 'desc');
     which also can be written as
     @example
     grid.getDataSource().by('firstname').descending().sort();
     */
    sortBy: function (column, order) {
        order = order || this.getSortOrderFor(column);

        this.sortedBy = {
            column: column,
            order: order
        };

        if (this.paging) {
            this.paging.offset = this.paging.initialOffset || 0;
            this.fireEvent('page', Math.round(this.paging.offset / this.paging.size) + 1);
        }

        if (this.shouldSortOnServer()) {
            this.loadOrGetFromCache();
        } else {
            var data = this._getData();
            if (!data)return this;
            data.sort(this.getSortFnFor(column, order));
            this.fireEvent('change');
        }

        this.fireEvent('sort', this.sortedBy);
        if (this.paging)this.firePageEvents();
        this.fireEvent('state');

        return this;
    },

    /**
     * Return current sorted by column
     * @function getSortedBy
     * @return {String} column
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSortedBy: function () {
        return this.sortedBy.column;
    },
    /**
     * Return current sort order (asc|desc)
     * @function getSortOrder
     * @return {String} order
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSortOrder: function () {
        return this.sortedBy.order;
    },

    shouldSortOnServer: function () {
        return this.paging && this.paging.remotePaging;
    },

    /**
     * Set sort function for a column
     * @param {string} key
     * @param {object} sortFns
     * @example
     * setSortFn('score', {
     *  'asc' : function(recA, recB){
     *      return recA.score < recB.score ? -1 : 1;
     *  },
     *  'desc': function(recA, recB){
     *      return recA.score < recB.score ? 1 : -1;
     *  }
     *
     * });
     */
    setSortFn: function (column, sortFns) {

        this.sortFn[column] = sortFns;
    },

    getSortFnFor: function (column, order) {
        if (this.sortFn[column] !== undefined) {
            return this.sortFn[column][order];
        }
        if (order === 'asc') {
            return function (a, b) {
                return a[column] + '_' + a[this.primaryKey] < b[column] + '_' + b[this.primaryKey] ? -1 : 1
            };
        } else {
            return function (a, b) {
                return a[column] + '_' + a[this.primaryKey] < b[column] + '_' + b[this.primaryKey] ? 1 : -1
            };
        }
    },

    getSortOrderFor: function (column) {
        if (this.sortedBy.column === column) {
            return this.sortedBy.order === 'asc' ? 'desc' : 'asc';
        }
        return 'asc';
    },

    /**
     * Add a record to data-source
     * @function addRecord
     * @param record
     * @return {Object} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    addRecord: function (record) {
        this.data = this.data || [];
        this.data.push(record);

        if (!this.index)this.createIndex();

        this.fireEvent('add', record);

        return this.createRecord(record);
    },

    find: function (search) {
        return this.findRecord(search);
    },

    /**
     * Returns plain object for a record from search. To get a
     * {{#crossLink "dataSource.Record"}}{{/crossLink}} object
     * use {{#crossLink "dataSource.JSONArray/getRecord"}}{{/crossLink}}
     *
     * collection.find({ capital : 'Oslo' });
     *
     * @function findRecord
     * @param {Object} search
     * @return {Object|undefined} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    findRecord: function (search) {

        if (!this.data)return undefined;
        if (search['getUID'] !== undefined)search = search.getUID();

        if (search.uid)search = search.uid;
        var rec = this.getById(search);
        if (rec)return rec;

        var searchMethod = ludo.util.isObject(search) ? 'isRecordMatchingSearch' : 'hasMatchInPrimaryKey';

        for (var i = 0; i < this.data.length; i++) {
            if (this[searchMethod](this.data[i], search)) {
                return this.data[i];
            }
        }
        return undefined;
    },

    isRecordMatchingSearch: function (record, search) {
        for (var key in search) {
            if (search.hasOwnProperty(key)) {
                if (record[key] != search[key]) {
                    return false;
                }
            }
        }
        return true;
    },

    hasMatchInPrimaryKey: function (record, search) {
        if (this.primaryKey) {
            for (var j = 0; j < this.primaryKey.length; j++) {
                if (record[this.primaryKey[j]] === search)return true;
            }
        }
        return false;
    },

    /**
     * Find specific records, example:
     * var records = collection.findRecords({ country:'Norway'});
     * @function findRecords
     * @param {Object} search
     * @return {Array} records
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    findRecords: function (search) {
        var ret = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.isRecordMatchingSearch(this.data[i], search)) {
                ret.push(this.data[i]);
            }
        }
        return ret;
    },

    getLinearData: function () {
        return this.data;
    },

    /**
     * Select the first record matching search
     * @function selectRecord
     * @param {Object} search
     * @return {Object|undefined} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    selectRecord: function (search) {
        var rec = this.findRecord(search);
        if (rec) {
            this._setSelectedRecord(rec);
            return rec;
        }
        return undefined;
    },


    /**
     * Select all records matching search
     * @function selectRecords
     * @param {Object} search
     * @return {Array} records
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    selectRecords: function (search) {
        this.selectedRecords = this.findRecords(search);
        for (var i = 0; i < this.selectedRecords.length; i++) {
            this.fireSelect(this.selectedRecords[i]);
        }
        return this.selectedRecords;
    },

    /**
     * Select a specific record by index
     * @function selectRecordIndex
     * @param {number} index
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    selectRecordIndex: function (index) {
        var data = this._getData();
        if (data.length && index >= 0 && index < data.length) {
            var rec = data[index];
            this._setSelectedRecord(rec);
            return rec;
        }
        return undefined;
    },

    _getData: function () {
        if (this.hasSearchResult())return this.searcher.getData();
        return this.data;
    },

    getRecordByIndex: function (index) {
        if (this.data.length && index >= 0 && index < this.data.length) {
            return this.data[index];
        }
        return undefined;
    },

    /**
     * Select previous record. If no record is currently selected, first record will be selected
     * @function previous
     * @return {Object} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    previous: function () {
        var rec = this.getPreviousOf(this.getSelectedRecord());
        if (rec) {
            this._setSelectedRecord(rec);
        }
        return rec;
    },

    /**
     * Returns previous record of given record
     * @function getPreviousOf
     * @param {Object} record
     * @return {Object} previous record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getPreviousOf: function (record) {
        var data = this._getData();
        if (record) {
            var index = data.indexOf(record);
            return index > 0 ? data[index - 1] : undefined;
        } else {
            return data.length > 0 ? data[0] : undefined;
        }
    },

    /**
     * Select next record. If no record is currently selected, first record will be selected
     * @function next
     * @return {Object} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    next: function () {
        var rec = this.getNextOf(this.getSelectedRecord());
        if (rec) {
            this._setSelectedRecord(rec);
        }
        return rec;
    },
    /**
     * Returns next record of given record.
     * @function getNextOf
     * @param {Object} record
     * @return {Object} next record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getNextOf: function (record) {
        var data = this._getData();
        if (record) {
            var index = data.indexOf(record);
            return index < data.length - 1 ? data[index + 1] : undefined;
        } else {
            return data.length > 0 ? data[0] : undefined;
        }
    },

    _setSelectedRecord: function (rec) {
        if (this.selectedRecords.length) {

            this.fireEvent('deselect', this.selectedRecords[0]);
        }
        this.selectedRecords = [rec];
        this.fireSelect(Object.clone(rec));
    },

    /**
     * Return first selected record
     * @function getSelectedRecord
     * @return {Object|undefined} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSelectedRecord: function () {
        return this.selectedRecords.length > 0 ? this.selectedRecords[0] : undefined;
    },

    /**
     * Return selected records
     * @function getSelectedRecords
     * @return {Array} records
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSelectedRecords: function () {
        return this.selectedRecords;
    },

    /**
     Delete records matching search,
     @function deleteRecords
     @param {Object} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     grid.getDataSource().deleteRecords({ country: 'Norway' });
     will delete all records from collection where country is equal to "Norway". A delete event
     will be fired for each deleted record.
     */
    deleteRecords: function (search) {
        var records = this.findRecords(search);
        for (var i = 0; i < records.length; i++) {
            this.data.erase(records[i]);
            this.fireEvent('delete', records[i]);
        }

        this.onChange();
    },

    /**
     Delete ONE item from the data source.
     @function deleteRecord
     @param {Object|String} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     // delete first record where property country matches "Norway"
     grid.getDataSource().deleteRecord({ country: 'Norway' });

     // delete first record where record.uid = 'uid_ixrky8vq'
     grid.getDataSource().deleteRecord('uid_ixrky8vq');

     // delete the first record in the data source
     var rec = grid.getDataSource().getData()[0];
     grid.getDataSource().deleteRecord(rec);
     */
    remove: function (search) {
        var rec = this.findRecord(search);
        if (rec) {
            this.data.erase(rec);

            this.fireEvent('delete', rec);
            this.onChange();
        }
    },


    deleteRecord: function (search) {
        this.remove(search);
    },

    onChange: function () {
        this.fireEvent('count', this.searcher != undefined ? this.searcher.getCount() : this.getCount());
    },

    /**
     Select records from current selected record to record matching search,
     @function selectTo
     @param {Object} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     collection.selectRecord({ country: 'Norway' });
     collection.selectTo({country: 'Denmark'});
     var selectedRecords = collection.getSelectedRecords();
     */
    selectTo: function (search) {
        var selected = this.getSelectedRecord();
        if (!selected) {
            this.selectRecord(search);
            return;
        }
        var rec = this.findRecord(search);
        if (rec) {
            this.selectedRecords = [];
            var index = this.data.indexOf(rec);
            var indexSelected = this.data.indexOf(selected);
            var i;
            if (index > indexSelected) {
                for (i = indexSelected; i <= index; i++) {
                    this.selectedRecords.push(this.data[i]);
                    this.fireSelect(this.data[i]);
                }
            } else {
                for (i = indexSelected; i >= index; i--) {
                    this.selectedRecords.push(this.data[i]);
                    this.fireSelect(this.data[i]);
                }
            }
        }
    },

    /**
     * Update a record
     * @function updateRecord
     * @param {Object} search
     * @param {Object} updates
     * @return {dataSource.Record} record
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    updateRecord: function (search, updates) {
        var rec = this.getRecord(search);
        if (rec) {
            rec.setProperties(updates);
        }
        return rec;
    },

    getPostData: function () {
        if (!this.paging) {
            return this.parent();
        }
        var ret = this.postData || {};
        ret._paging = {
            size: this.paging.size,
            offset: this.paging.offset
        };
        ret._sort = this.sortedBy;
        return ret;
    },
    /**
     * When paging is enabled, go to previous page.
     * fire previousPage event
     * @function previousPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    previousPage: function () {
        if (!this.paging || this.isOnFirstPage())return;
        this.paging.offset -= this.paging.size;

        this.onPageChange('previousPage');
    },

    /**
     * When paging is enabled, go to next page
     * fire nextPage event
     * @function nextPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    nextPage: function () {
        if (!this.paging || this.isOnLastPage())return;
        this.paging.offset += this.paging.size;

        this.onPageChange('nextPage');
    },

    /**
     * Go to last page
     * @function lastPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    lastPage: function () {
        if (!this.paging || this.isOnLastPage())return;
        var count = this.getCount();
        var decr = count % this.paging.size;
        if (decr === 0) decr = this.paging.size;
        this.paging.offset = count - decr;
        this.onPageChange('lastPage');
    },

    /**
     * Go to first page
     * @function firstPage
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    firstPage: function () {
        if (!this.paging || this.isOnFirstPage())return;
        this.paging.offset = 0;

        this.onPageChange('firstPage');
    },

    isOnFirstPage: function () {
        if (!this.paging)return true;
        return this.paging.offset === undefined || this.paging.offset === 0;
    },

    isOnLastPage: function () {
        return this.paging.size + this.paging.offset >= this.getCount();
    },

    onPageChange: function (event) {
        if (this.paging['remotePaging']) {
            this.loadOrGetFromCache();
        }
        this.fireEvent('change');
        this.fireEvent(event);
        this.firePageEvents();
    },

    loadOrGetFromCache: function () {
        if (this.isDataInCache()) {
            this.data = this.dataCache[this.getCacheKey()].data;
            this.fireEvent('change');
        } else {
            this.load();
        }
    },

    populateCache: function () {
        if (this.isCacheEnabled()) {
            this.dataCache[this.getCacheKey()] = {
                data: this.data,
                time: new Date().getTime()
            }
        }
    },

    isDataInCache: function () {
        return this.dataCache[this.getCacheKey()] !== undefined && !this.isCacheOutOfDate();
    },

    clearCache: function () {
        this.dataCache = {};
    },

    isCacheOutOfDate: function () {
        if (!this.paging['cacheTimeout'])return false;

        var created = this.dataCache[this.getCacheKey()].time;
        return created + (this.paging['cacheTimeout'] * 1000) < (new Date().getTime());
    },

    getCacheKey: function () {
        var keys = [
            'key', this.paging.offset, this.sortedBy.column, this.sortedBy.order
        ];
        if (this.searcher !== undefined && this.searcher.hasData())keys.push(this.searcher.searchToString());
        return keys.join('|');
    },

    hasData: function () {
        return this.data != undefined && this.data.length > 0;
    },

    firePageEvents: function (skipState) {
        if (this.isOnLastPage()) {
            this.fireEvent('lastPage');
        } else {
            this.fireEvent('notLastPage');
        }

        if (this.isOnFirstPage()) {
            this.fireEvent('firstPage');

        } else {
            this.fireEvent('notFirstPage');
        }

        this.fireEvent('page', this.getPageNumber());
        if (skipState === undefined)this.fireEvent('state');
    },

    /**
     * Go to a specific page
     * @function toPage
     * @param {Number} pageNumber
     * @return {Boolean} success
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    toPage: function (pageNumber) {
        if (pageNumber > 0 && pageNumber <= this.getPageCount() && !this.isOnPage(pageNumber)) {
            this.paging.offset = (pageNumber - 1) * this.paging.size;

            this.onPageChange('toPage');
            return true;
        }
        return false;
    },

    /**
     * @function setPageSize
     * @param {Number} size
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    setPageSize: function (size) {
        if (this.paging) {
            this.dataCache = {};
            this.paging.size = parseInt(size);
            this.paging.offset = 0;

            this.onPageChange('toPage');
        }
    },

    /**
     * True if on given page
     * @function isOnPage
     * @param {Number} pageNumber
     * @return {Boolean}
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    isOnPage: function (pageNumber) {
        return pageNumber == this.getPageNumber();
    },

    /**
     * Return current page number
     * @function getPageNumber
     * @return {Number} page
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getPageNumber: function () {
        return this.paging ? Math.floor(this.paging.offset / this.paging.size) + 1 : 1;
    },

    /**
     * Return number of pages
     * @function getPageCount
     * @return {Number}
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getPageCount: function () {
        return this.paging ? Math.ceil(this.getCount() / this.paging.size) : 1;
    },

    /**
     * Return data in collection
     * @function getData
     * @memberof ludo.dataSource.JSONArray.prototype
     * @returns {Array}
     */
    getData: function () {
        if (this.hasSearchResult()) {
            if (this.paging && this.paging.size) {
                return this.getDataForPage(this.searcher.getData());
            }
            return this.searcher.getData();
        }
        if (!this.paging || this.paging.remotePaging) {
            return this.parent();
        }
        return this.getDataForPage(this.data);
    },


    getDataForPage: function (data) {
        if (!data || data.length == 0)return [];
        var offset = this.paging.initialOffset || this.paging.offset;
        if (offset > data.length) {
            this.toPage(this.getPageCount());
            offset = (this.getPageCount() - 1) * this.paging.size;
        }
        this.resetInitialOffset.delay(200, this);
        return data.slice(offset, Math.min(data.length, offset + this.paging.size));
    },

    resetInitialOffset: function () {
        this.paging.initialOffset = undefined;
    },

    parseNewData: function (data, json) {
        // TODO refactor this
        if (json != undefined) {
            if (this.paging && json.rows !== undefined)this.paging.rows = json.rows;
            if (this.paging && json.response && json.response.rows !== undefined)this.paging.rows = json.response.rows;
        }
        this.parent(data, json);

        this.fireEvent('count', this.getCount());
        if (this.shouldSortAfterLoad()) {
            this.sort();
        } else {
            this.fireEvent('change');
        }
        if (this.paging !== undefined) {
            this.firePageEvents(true);
        }
    },

    createIndex: function () {
        this.index = {};
        this.indexBranch(this.data);
    },

    indexBranch: function (branch, parent) {
        for (var i = 0; i < branch.length; i++) {
            this.indexRecord(branch[i], parent);
            if (branch[i].children && branch[i].children.length)this.indexBranch(branch[i].children, branch[i]);
        }
    },

    indexRecord: function (record, parent) {
        if (!this.index)this.createIndex();
        if (parent)record.parentUid = parent.uid;
        var pk = this.getPrimaryKeyIndexFor(record);
        if (pk)this.index[pk] = record;
        if (!record.uid)record.uid = ['uid_', String.uniqueID()].join('');
        this.index[record.uid] = record;
    },

    shouldSortAfterLoad: function () {
        if (this.paging && this.paging.remotePaging)return false;
        return this.sortedBy !== undefined && this.sortedBy.column && this.sortedBy.order;
    },

    /**
     Filter collection based on given search term. To filter on multiple search terms, you should
     get a reference to the {{#crossLink "dataSource.JSONArraySearch"}}{{/crossLink}} object and
     use the available {{#crossLink "dataSource.JSONArraySearch"}}{{/crossLink}} methods to add
     multiple search terms.
     @function Search
     @param {String} search
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     ludo.get('myCollection').search('New York');
     // or with the {{#crossLink "dataSource.JSONArraySearch/add"}}{{/crossLink}} method
     var searcher = ludo.get('myCollection').getSearcher();
     searcher.where('New York').execute();
     searcher.execute();
     */
    search: function (search) {
        this.getSearcher().search(search);
    },

    /**
     * Executes a remote search for records with the given data
     * @function remoteSearch
     * @param {String|Object} search
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    remoteSearch: function (search) {
        this.postData = this.postData || {};
        this.postData.search = search;
        this.toPage(1);
        this.load();
    },

    afterSearch: function () {
        var searcher = this.getSearcher();
        this.fireEvent('count', searcher.hasData() ? searcher.getCount() : this.getCount());
        if (this.paging !== undefined) {
            this.paging.offset = 0;
            this.firePageEvents(true);
            this.fireEvent('pageCount', this.getPageCount());
        }
        this.fireEvent('change');
    },

    searcher: undefined,
    /**
     * Returns a {{#crossLink "dataSource.JSONArraySearch"}}{{/crossLink}} object which
     * you can use to filter a collection.
     * @function getSearcher
     * @return {dataSource.JSONArraySearch}
     * @memberof ludo.dataSource.JSONArray.prototype
     */
    getSearcher: function () {
        if (this.searcher === undefined) {
            this.searchConfig = this.searchConfig || {};
            var config = Object.merge({
                type: this.searcherType,
                dataSource: this
            }, this.searchConfig);
            this.searcher = ludo._new(config);
            this.addSearcherEvents();
        }
        return this.searcher;
    },

    addSearcherEvents: function () {
        var s = this.searcher;
        s.on('search', this.afterSearch.bind(this));
        s.on('deleteSearch', this.afterSearch.bind(this));
    },

    hasSearchResult: function () {
        return this.searcher !== undefined && this.searcher.hasData();
    },
    /**
     Return record by id or undefined if not found. Records are indexed by id. This method
     gives you quick access to a record by it's id. The method returns a reference to the
     actual record. You can use Object.clone(record) to create a copy of it in case you
     want to update the record but not make those changes to the collection.
     @function getById
     @param {String|Number|Object} id
     @return {Object} record
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     var collection = new ludo.dataSource.JSONArray({
	 		url : 'get-countries.php',
	 		primaryKey:'country'
	 	});
     var record = collection.getById('Japan'); // Returns record for Japan if it exists.
     You can also define multiple keys as id
     @example
     var collection = new ludo.dataSource.JSONArray({
			url : 'get-countries.php',
			primaryKey:['id', 'country']
		 });
     var record = collection.getById({ id:1, country:'Japan' });
     This is especially useful when you have a {{#crossLink "dataSource.JSONTree"}}{{/crossLink}}
     where child nodes may have same numeric id as it's parent.
     @example
     { id:1, type:'country', title : 'Japan',
          children:[ { id:1, type:'city', title:'Tokyo }]
 By setting primaryKey to ['id', 'type'] will make it possible to distinguish between countries and cities.
 */
    getById: function (id) {
        if (this.index[id] !== undefined) {
            return this.index[id];
        }

        if (this.primaryKey.length === 1) {
            return this.index[id];
        } else {
            var key = [];
            for (var i = 0; i < this.primaryKey.length; i++) {
                key.push(id[this.primaryKey[i]]);
            }
            return this.index[key.join('')];
        }
    },

    recordObjects: {},

    /**
     Returns {{#crossLink "dataSource.Record"}}{{/crossLink}} object for a record.
     If you want to update a record, you should
     first get a reference to {{#crossLink "dataSource.Record"}}{{/crossLink}} and then call one
     of it's methods.
     @function getRecord
     @param {String|Object} search
     @return {dataSource.Record|undefined}
     @memberof ludo.dataSource.JSONArray.prototype
     @example
     var collection = new ludo.dataSource.JSONArray({
			url : 'get-countries.php',
			primaryKey:'country'
		 });
     collection.getRecord('Japan').set('capital', 'tokyo');
     */
    getRecord: function (search) {
        var rec = this.findRecord(search);
        if (rec) {
            return this.createRecord(rec);
        }
        return undefined;
    },

    createRecord: function (data) {
        var id = data.uid;
        if (!this.recordObjects[id]) {
            this.recordObjects[id] = this.recordInstance(data, this);
            this.addRecordEvents(this.recordObjects[id]);
        }
        return this.recordObjects[id];
    },

    recordInstance: function (data) {
        return new ludo.dataSource.Record(data, this);
    },

    addRecordEvents: function (record) {
        record.addEvent('update', this.onRecordUpdate.bind(this));
        record.addEvent('remove', this.onRecordDispose.bind(this));
        record.addEvent('select', this.selectRecord.bind(this));
    },

    fireSelect: function (record) {
        this.fireEvent('select', record);
    },

    onRecordUpdate: function (record) {
        this.indexRecord(record);
        this.fireEvent('update', record);
    },

    onRecordDispose: function (record) {
        var branch = this.getBranchFor(record);
        if (branch) {
            var index = branch.indexOf(record);
            if (index !== -1) {
                branch.splice(index, 1);
            }
            this.removeFromIndex(record);
            this.fireEvent('remove', record);
        }
    },

    getBranchFor: function (record) {
        if (record.parentUid) {
            var parent = this.findRecord(record.parentUid);
            return parent ? parent.children : undefined;
        } else {
            return this.data;
        }
    },

    removeFromIndex: function (record) {
        this.recordObjects[record.uid] = undefined;
        this.index[record.uid] = undefined;
        var pk = this.getPrimaryKeyIndexFor(record);
        if (pk)this.index[pk] = undefined;
    },

    getPrimaryKeyIndexFor: function (record) {
        if (this.primaryKey) {
            var key = [];
            for (var j = 0; j < this.primaryKey.length; j++) {
                key.push(record[this.primaryKey[j]]);
            }
            return key.join('');
        }
        return undefined;
    }
});

ludo.factory.registerClass('dataSource.JSONArray', ludo.dataSource.JSONArray);/* ../ludojs/src/effect/drop-point.js */
/**
 Specification of a drop point node sent to {{#crossLink "effect.DragDrop/addDropTarget"}}{{/crossLink}}.
 You may add your own properties in addition to the ones below.
 @namespace ludo.effect
 @class ludo.effect.DropPoint

 @param {Object} config
 @example
 var dd = new ludo.effect.DragDrop();
 var el = jQuery('<div>');
 dd.addDropTarget({
 		id:'myDropPoint',
 		el:el,
 		name:'John Doe'
	});
 var el = jQuery('<div>');
 dd.addDropTarget({
		id:'myDropPoint',
		el:el,
		name:'Jane Doe'
	});
 dd.addEvent('enterDropTarget', function(node, dd){
 		if(node.name === 'John Doe'){
 			dd.setInvalid(); // Triggers an invalidDropTarget event
 		}
 	});
 */
ludo.effect.DropPoint = new Class({
    /**
     id of node. This attribute is optional
     @property id
     @type {String}
     @default undefined
     @optional
     @memberof ludo.effect.DropPoint.prototype
     */
    id: undefined,

    /**
     * Reference to dragable DOM node
     * @property el
     * @default undefined
     * @type {String|HTMLDivElement}
     * @memberof ludo.effect.DropPoint.prototype
     */
    el: undefined,

    /**
     Capture regions(north,south, west east) when moving over drop points
     @config {Boolean|undefined} captureRegions
     @optional
     @default false
     @memberof ludo.effect.DropPoint.prototype
     @example
     captureRegions:true
     */
    captureRegions: undefined
});/* ../ludojs/src/effect/draggable-node.js */
/*
 Specification of a draggable node objects sent to {{#crossLink "effect.Drag/add"}}{{/crossLink}}. You will
 never create objects of this class.
 @namespace ludo.effect
 @class ludo.effect.DraggableNode
 @type {Object|String}
 */
ludo.effect.DraggableNode = new Class({
	/*
	 id of node. This attribute is optional
	 @property id
	 @type {String}
	 @default undefined
	 @optional
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = jQuery('<div>');
	 	dragDrop.add({
	 		id: 'myId',
			el : el
	 	});
	 	var ref = dragDrop.getById('myId');
	 Or you can use this code which does the same:
	 @example
	 	var dragDrop = new ludo.effect.Drag();
	 	var el = jQuery('<div>');
	 	el.id = 'myId';
	 	dragDrop.add(el);
	 	var ref = dragDrop.getById('myId');
	 Id's are only important if you need to access nodes later using {{#crossLink "effect.Drag/getById"}}{{/crossLink}}
	 */
	id: undefined,

	/*
	 * Reference to dragable DOM node
	 * @property el
	 * @default undefined
	 * @type {String|HTMLDivElement}
	 */
	el:undefined,
	/*
	 * Reference to handle for dragging. el will only be draggable by dragging the handle.
	 * @property handle
	 * @type {String|HTMLDivElement}
	 * @default undefined
	 * @optional
	 */
	handle:undefined,

	/*
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minX:undefined,
	/*
	 * Maximum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxX
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxX:undefined,
	/*
	 * Minimum x position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property minY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	minY:undefined,
	/*
	 * Maximum y position. This is an optional argument. If not set, you will use the params
	 * set when creating the ludo.effect.Drag component if any.
	 * @property maxY
	 * @type {Number}
	 * @default undefined
	 * @optional
	 */
	maxY:undefined,
	/*
	 Allow dragging in these directions. This is an optional argument. If not set, you will use the params
	 set when creating the ludo.effect.Drag component if any.
	 @property directions
	 @type {String}
	 @default 'XY'
	 @optional
	 @example
	 	directions:'XY'	//
	 	..
	 	directions:'X' // Only allow dragging along x-axis
	 	..
	 	directions:'Y' // Only allow dragging along y-axis
	 */
	directions:undefined
});/* ../ludojs/src/effect/effect.js */
/**
 * Base class for animations
 * @namespace ludo.effect
 * @class ludo.effect.Effect
 * @fires ludo.effect.Effect#animationComplete
 */
ludo.effect.Effect = new Class({
	Extends: ludo.Core,

	fadeOut:function(el, duration, callback){
		el.animate({
			opacity:0
		},{
			duration:duration * 1000,
			complete:callback
		});
	},

	slideIn:function(el, duration, callback, to){
		to = to || el.getPosition();
		var from = {
			x: to.left,
			y : - el.height()
		};
		this.slide(el,from, to, duration, callback);
	},

	slideOut:function(el, duration, callback, from){
		from = from || el.getPosition();
		var to = {
			x: from.left,
			y : - el.height()
		};
		this.slide(el, from, to, duration, callback);
	},

	slide:function(el, from, to, duration, callback){


		if(from.x != undefined && from.left == undefined){

			from.left = from.x;
		}
		if(to.x != undefined && to.left == undefined){
			to.left = to.x;
		}

		from.top = from.top ||from.y;
		to.top = to.top ||to.y;

		if(from.left == undefined)from.left = to.left;
		this.show(el);
		el.css(from);

		el.animate({
			left: to.left,
			top:to.top
		},{
			duration:duration * 1000,
			complete:callback
		});
	},

	fadeIn:function(el, duration, callback){

		el.css('opacity', 0);
		el.css('visibility', 'visible');

		el.animate({
			opacity:1
		},{
			duration:duration*1000,
			complete:callback
		});
	},

	show:function(el){
		if(el.css("visibility") ==='hidden')el.css('visibility', 'visible');
	}
});

/* ../ludojs/src/effect/drag.js */
/**
 * Class for dragging DOM elements.
 @namespace ludo.effect
 @class ludo.effect.Drag
 @augments ludo.effect.Effect

 @param {Object} config
 @param {Number} config.minX Optional minimum left coordinate
 @param {Number} config.maxX Optional maximum left coordinate
 @param {Number} config.minY Optional minimum top coordinate
 @param {Number} config.maxY Optional maximum top coordinate
 @param {Number} config.maxY Optional maximum top coordinate
 @param {String|HTMLElement} config.el This element is draggable.
 @param {String|HTMLElement} config.handle Optional dom element. Mouse down on this element will initiate the drag process. example: A title bar above a view. If not set, Mouse down on this.el will initiate dragging.
 @param {String} config.directions Accept dragging in these directions, default: "XY". For horizontal dragging only, use "X" and for vertical "Y".
 @param {Number} config.minPos Alternative to minX and minY when you only accepts dragging along the X or Y-axis.
 @param {Number} config.maxPos Alternative to maxX and maxY when you only accepts dragging along the X or Y-axis.
 @param {Number} config.delay Optional delay in seconds from mouse down to dragging starts. Default: 0
 @param {Boolean} config.useShim True to drag a "ghost" DOM element while dragging, default: false
 @param {String} config.shimCls Name of css class to add to the shim
 @param {Boolean} config.autoHideShim True to automatically hide shim on drag end, default: true
 @param {Number} config.mouseYOffset While dragging, always show dragged element this amount of pixels below mouse cursor.
 @param {Number} config.mouseXOffset While dragging, always show dragged element this amount of pixels right of mouse cursor.
 @param {String} config.unit Unit used while dragging, default: "px"


 @fires ludo.effect.Drag#before Event fired before drag starts. Params: 1) Dom element to be dragged, 2) ludo.effect.Drag, 3) {x,y}
 @fires ludo.effect.Drag#start Event when drag starts. Params: 1) Dom element to be dragged, 2) ludo.effect.Drag, 3) {x,y}
 @fires ludo.effect.Drag#drag' Event when drag ends. Params: 1) Dom element to be dragged, 2) ludo.effect.Drag, 3) {x,y}
 @fires ludo.effect.Drag#end' Event when drag ends. Params: 1) {x,y}, 2) dragged node 3) ludo.effect.Drag
 @fires ludo.effect.Drag#showShim' Event fired when shim DOM node is shown. Argument: 1) Shim DOM Node, 2) ludo.effect.Drag
 @fires ludo.effect.Drag#flyToShim' Event fired after flyBack animation is complete. Arguments: 1) ludo.effect.Drag, 2) Shim DOM node
 @fires ludo.effect.Drag#flyBack' Event fired when shim DOM node is shown. Argument: Arguments: 1) ludo.effect.Drag, 2) Shim DOM node


 @example
 <style type="text/css">
 .ludo-shim {
		 border: 15px solid #AAA;
		 background-color: #DEF;
		 margin: 5;
		 opacity: .5;
		 border-radius: 5px;
	}
 .draggable{
		width:150px;
		z-index:1000;
		height:150px;
		border-radius:5px;
		border:1px solid #555;
		background-color:#DEF
	}
 </style>
 <div id="draggable" class="draggable">
 I am draggable
 </div>
 <script type="text/javascript">
 var d = new ludo.effect.Drag({
		useShim:true,
		 listeners:{
			 endDrag:function(dragged, dragEffect){
				 dragEffect.getEl().setStyles({
					 left : dragEffect.getX(),
					 top: dragEffect.getY()
				 });
			 },
			 drag:function(pos, dragEffect){
				 dragEffect.setShimText(dragEffect.getX() + 'x' + dragEffect.getY());
			 }
		 }
	 });
 d.add('draggable'); // "draggable" is the id of the div
 </script>

 */
ludo.effect.Drag = new Class({
    Extends: ludo.effect.Effect,


    handle: undefined,

    el: undefined,


    minX: undefined,

    minY: undefined,


    maxX: undefined,

    maxY: undefined,


    minPos: undefined,

    maxPos: undefined,

    directions: 'XY',


    unit: 'px',

    dragProcess: {
        active: false
    },

    coordinatesToDrag: undefined,

    delay: 0,

    inDelayMode: false,

    els: {},


    useShim: false,


    autoHideShim: true,


    shimCls: undefined,

    mouseYOffset: undefined,


    mouseXOffset: undefined,

    fireEffectEvents: true,

    __construct: function (config) {
        this.parent(config);
        if (config.el !== undefined) {
            this.add({
                el: config.el,
                handle: config.handle
            });
        }

        this.__params(config, ['useShim', 'autoHideShim', 'directions', 'delay', 'minX', 'maxX', 'minY', 'maxY',
            'minPos', 'maxPos', 'unit', 'shimCls', 'mouseYOffset', 'mouseXOffset', 'fireEffectEvents']);
    },

    ludoEvents: function () {
        this.parent();
        this.getEventEl().on(ludo.util.getDragMoveEvent(), this.drag.bind(this));
        this.getEventEl().on(ludo.util.getDragEndEvent(), this.endDrag.bind(this));
        if (this.useShim) {
            this.addEvent('start', this.showShim.bind(this));
            if (this.autoHideShim) {
                this.addEvent('end', this.hideShim.bind(this));
            }
        }
    },

    /**
     Add draggable object
     @function add
     @param {effect.DraggableNode|String|HTMLDivElement} node
     @memberof ludo.effect.Effect.prototype
     @return {effect.DraggableNode}
     @example
     dragObject.add({
			el: 'myDiv',
			handle : 'myHandle'
		});
     handle is optional.

     @example
     dragObject.add('idOfMyDiv');

     You can also add custom properties:

     @example
     dragobject.add({
	 		id: "myReference',
			el: 'myDiv',
			column: 'city'
		});
     ...
     ...
     dragobject.addEvent('before', beforeDrag);
     ...
     ...
     function beforeDrag(dragged){
	 		console.log(dragged.el);
	 		console.log(dragged.column);
	 	}
     */
    add: function (node) {
        node = this.getValidNode(node);
        var el = jQuery(node.el);
        this.setPositioning(el);

        var handle = node.handle ? jQuery(node.handle) : el;

        handle.attr("id",  handle.id || 'ludo-' + String.uniqueID());
        handle.addClass("ludo-drag");

        handle.on(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
        handle.attr('forId', node.id);
        this.els[node.id] = Object.merge(node, {
            el: jQuery(el),
            handle: handle
        });
        return this.els[node.id];
    },

    /**
     * Remove node
     * @function remove
     * @param {String} id
     * @return {Boolean} success
     * @memberof ludo.effect.Effect.prototype
     */
    remove: function (id) {
        if (this.els[id] !== undefined) {
            var el = jQuery("#" + this.els[id].handle);
            el.off(ludo.util.getDragStartEvent(), this.startDrag.bind(this));
            this.els[id] = undefined;
            return true;
        }
        return false;
    },

    removeAll: function () {
        var keys = Object.keys(this.els);
        for (var i = 0; i < keys.length; i++) {
            this.remove(keys[i]);
        }
        this.els = {};
    },

    getValidNode: function (node) {
        if (!this.isElConfigObject(node)) {
            node = {
                el: jQuery(node)
            };
        }
        if (typeof node.el === 'string') {
            if (node.el.substr(0, 1) != "#")node.el = "#" + node.el;
            node.el = jQuery(node.el);
        }
        node.id = node.id || node.el.attr("id") || 'ludo-' + String.uniqueID();
        if (!node.el.attr("id"))node.el.attr("id", node.id);
        node.el.attr('forId', node.id);
        return node;
    },

    isElConfigObject: function (config) {
        return config.el !== undefined || config.handle !== undefined;
    },

    setPositioning: function (el) {
        if (!this.useShim) {
            el.css('position', 'absolute');
        } else {
            var pos = el.css('position');
            if (!pos || (pos != 'relative' && pos != 'absolute')) {
                el.css('position', 'relative');
            }
        }
    },

    getById: function (id) {
        return this.els[id];
    },

    getIdByEvent: function (e) {
        var el = jQuery(e.target);
        if (!el.hasClass('ludo-drag')) {
            el = el.closest('.ludo-drag');
        }
        return el.attr('forId');
    },


    getDragged: function () {
        return this.els[this.dragProcess.dragged];
    },

    /**
     * Returns reference to draggable DOM node
     * @function getEl
     * @return {HTMLElement} DOMNode
     * @memberof ludo.effect.Effect.prototype
     */
    getEl: function () {
        return this.els[this.dragProcess.dragged].el;
    },

    getShimOrEl: function () {
        return this.useShim ? this.getShim() : this.getEl();
    },

    getSizeOf: function (el) {
        return el.outerWidth !== undefined ? {x: el.outerWidth(), y: el.outerHeight()} : {x: 0, y: 0};
    },

    getPositionOf: function (el) {

        return jQuery(el).position();
    },

    setDragCoordinates: function () {
        this.coordinatesToDrag = {
            x: 'x', y: 'y'
        };
    },
    startDrag: function (e) {
        var id = this.getIdByEvent(e);

        var el = this.getById(id).el;

        var size = this.getSizeOf(el);
        var pos;
        if (this.useShim) {
            pos = el.position();
        } else {
            var parent = this.getPositionedParent(el);
            pos = parent ? el.getPosition(parent) : this.getPositionOf(el)
        }

        var x = pos.left;
        var y = pos.top;

        var p = ludo.util.pageXY(e);

        this.dragProcess = {
            active: true,
            dragged: id,
            currentX: x,
            currentY: y,
            elX: x,
            elY: y,
            width: size.x,
            height: size.y,
            mouseX: p.pageX,
            mouseY: p.pageY
        };

        var dp = this.dragProcess;

        dp.el = this.getShimOrEl();

        this.fireEvent('before', [this.els[id], this, {x: x, y: y}]);

        if (!this.isActive()) {
            return undefined;
        }

        dp.minX = this.getMinX();
        dp.maxX = this.getMaxX();
        dp.minY = this.getMinY();
        dp.maxY = this.getMaxY();
        dp.dragX = this.canDragAlongX();
        dp.dragY = this.canDragAlongY();

        if (this.delay) {
            this.setActiveAfterDelay();
        } else {

            this.fireEvent('start', [this.els[id], this, {x: x, y: y}]);

            if (this.fireEffectEvents)ludo.EffectObject.start();
        }

        if(!ludo.util.isTabletOrMobile()){
            return false;
        }


    },

    getPositionedParent: function (el) {

        var parent = el.parentNode;
        while (parent) {
            var pos = parent.getStyle('position');
            if (pos === 'relative' || pos === 'absolute')return parent;
            parent = parent.getParent();
        }
        return undefined;
    },

    /**
     Cancel drag. This method is designed to be called from an event handler
     attached to the "beforeDrag" event.
     @function cancelDrag
     @memberof ludo.effect.Effect.prototype
     @example
     // Here, dd is a {{#crossLink "effect.Drag"}}{{/crossLink}} object
     dd.on('before', function(draggable, dd, pos){
	 		if(pos.x > 1000 || pos.y > 500){
	 			dd.cancelDrag();
			}
	 	});
     In this example, dragging will be cancelled when the x position of the mouse
     is greater than 1000 or if the y position is greater than 500. Another more
     useful example is this:
     @example
     dd.on('before', function(draggable, dd){
		 	if(!this.isDraggable(draggable)){
		 		dd.cancelDrag()
		 	}
		});
     Here, we assume that we have an isDraggable method which returns true or false
     for whether the given node is draggable or not. "draggable" in this example
     is one of the {{#crossLink "effect.DraggableNode"}}{{/crossLink}} objects added
     using the {{#crossLink "effect.Drag/add"}}{{/crossLink}} method.
     */

    cancelDrag: function () {
        this.dragProcess.active = false;
        this.dragProcess.el = undefined;
        if (this.fireEffectEvents)ludo.EffectObject.end();
    },

    getShimFor: function (el) {
        return el;
    },

    setActiveAfterDelay: function () {
        this.inDelayMode = true;
        this.dragProcess.active = false;
        this.startIfMouseNotReleased.delay(this.delay * 1000, this);
    },

    startIfMouseNotReleased: function () {
        if (this.inDelayMode) {
            this.dragProcess.active = true;
            this.inDelayMode = false;
            this.fireEvent('start', [this.getDragged(), this, {x: this.getX(), y: this.getY()}]);
            ludo.EffectObject.start();
        }
    },

    drag: function (e) {
        if (this.dragProcess.active && this.dragProcess.el) {
            var pos = {
                x: undefined,
                y: undefined
            };
            if (this.dragProcess.dragX) {
                pos.x = this.getXDrag(e);

            }

            if (this.dragProcess.dragY) {
                pos.y = this.getYDrag(e);
            }


            this.move(pos);

            /*
             * Event fired while dragging. Sends position, example {x:100,y:50}
             * and reference to effect.Drag as arguments
             * @event drag
             * @param {Object} x and y
             * @param {effect.Drag} this
             */
            this.fireEvent('drag', [pos, this.els[this.dragProcess.dragged], this]);
            return false;

        }
        return undefined;
    },

    move: function (pos) {
        if (pos.x !== undefined) {
            this.dragProcess.currentX = pos.x;
            this.dragProcess.el.css('left', pos.x + this.unit);
        }
        if (pos.y !== undefined) {
            this.dragProcess.currentY = pos.y;
            this.dragProcess.el.css('top', pos.y + this.unit);
        }
    },

    /**
     * Return current x pos
     * @function getX
     * @return {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    getX: function () {
        return this.dragProcess.currentX;
    },
    /**
     * Return current y pos
     * @function getY
     * @return {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    getY: function () {
        return this.dragProcess.currentY;
    },

    getXDrag: function (e) {
        var posX;

        var p = ludo.util.pageXY(e);

        if (this.mouseXOffset) {
            posX = p.pageX + this.mouseXOffset;
        } else {
            posX = p.pageX - this.dragProcess.mouseX + this.dragProcess.elX;
        }

        if (posX < this.dragProcess.minX) {
            posX = this.dragProcess.minX;
        }
        if (posX > this.dragProcess.maxX) {
            posX = this.dragProcess.maxX;
        }
        return posX;
    },

    getYDrag: function (e) {
        var posY;
        var p = ludo.util.pageXY(e);

        if (this.mouseYOffset) {
            posY = p.pageY + this.mouseYOffset;
        } else {
            posY = p.pageY - this.dragProcess.mouseY + this.dragProcess.elY;
        }

        if (posY < this.dragProcess.minY) {
            posY = this.dragProcess.minY;
        }
        if (posY > this.dragProcess.maxY) {
            posY = this.dragProcess.maxY;
        }
        return posY;
    },

    endDrag: function () {
        if (this.dragProcess.active) {
            this.cancelDrag();

            this.fireEvent('end', [
                this.getDragged(),
                this,
                {
                    x: this.getX(),
                    y: this.getY()
                }
            ]);

        }
        if (this.inDelayMode)this.inDelayMode = false;

    },

    /**
     * Set new max X pos
     * @function setMaxX
     * @param {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    setMaxX: function (x) {
        this.maxX = x;
    },
    /**
     * Set new min X pos
     * @function setMinX
     * @param {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    setMinX: function (x) {
        this.minX = x;
    },
    /**
     * Set new min Y pos
     * @function setMinY
     * @param {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    setMinY: function (y) {
        this.minY = y;
    },
    /**
     * Set new max Y pos
     * @function setMaxY
     * @param {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    setMaxY: function (y) {
        this.maxY = y;
    },
    /**
     * Set new min pos
     * @function setMinPos
     * @param {Number} pos
     * @memberof ludo.effect.Effect.prototype
     */
    setMinPos: function (pos) {
        this.minPos = pos;
    },
    /**
     * Set new max pos
     * @function setMaxPos
     * @param {Number} pos
     * @memberof ludo.effect.Effect.prototype
     */
    setMaxPos: function (pos) {
        this.maxPos = pos;
    },

    getMaxX: function () {
        return this.getMaxPos('maxX');
    },

    getMaxY: function () {
        return this.getMaxPos('maxY');
    },

    getMaxPos: function (key) {
        var max = this.getConfigProperty(key);
        return max !== undefined ? max : this.maxPos !== undefined ? this.maxPos : 100000;
    },

    getMinX: function () {
        var minX = this.getConfigProperty('minX');
        return minX !== undefined ? minX : this.minPos;
    },

    getMinY: function () {
        var dragged = this.getDragged();
        return dragged && dragged.minY !== undefined ? dragged.minY : this.minY !== undefined ? this.minY : this.minPos;
    },
    /**
     * Return amount dragged in x direction
     * @function getDraggedX
     * @return {Number} x
     * @memberof ludo.effect.Effect.prototype
     */
    getDraggedX: function () {
        return this.getX() - this.dragProcess.elX;
    },
    /**
     * Return amount dragged in y direction
     * @function getDraggedY
     * @return {Number} y
     * @memberof ludo.effect.Effect.prototype
     */
    getDraggedY: function () {
        return this.getY() - this.dragProcess.elY;
    },

    canDragAlongX: function () {
        return this.getConfigProperty('directions').indexOf('X') >= 0;
    },
    canDragAlongY: function () {
        return this.getConfigProperty('directions').indexOf('Y') >= 0;
    },

    getConfigProperty: function (property) {
        var dragged = this.getDragged();
        return dragged && dragged[property] !== undefined ? dragged[property] : this[property];
    },

    /**
     * Returns width of dragged element
     * @function getHeight
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getWidth: function () {
        return this.dragProcess.width;
    },

    /**
     * Returns height of dragged element
     * @function getHeight
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getHeight: function () {
        return this.dragProcess.height;
    },
    /**
     * Returns current left position of dragged
     * @function getLeft
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getLeft: function () {
        return this.dragProcess.currentX;
    },

    /**
     * Returns current top/y position of dragged.
     * @function getTop
     * @return {Number}
     * @memberof ludo.effect.Effect.prototype
     */
    getTop: function () {
        return this.dragProcess.currentY;
    },

    /**
     * Returns reference to DOM element of shim
     * @function getShim
     * @return {HTMLDivElement} shim
     * @memberof ludo.effect.Effect.prototype
     */
    getShim: function () {
        if (this.shim === undefined) {
            this.shim = jQuery('<div>');
            this.shim.addClass('ludo-shim');
            this.shim.css({
                position: 'absolute',
                'z-index': 50000,
                display: 'none'
            });
            jQuery(document.body).append(this.shim);

            if (this.shimCls) {
                for (var i = 0; i < this.shimCls.length; i++) {
                    this.shim.addClass(this.shimCls[i]);
                }
            }

            this.fireEvent('createShim', this.shim);
        }
        return this.shim;
    },


    showShim: function () {
        this.getShim().css({
            display: '',
            left: this.getShimX(),
            top: this.getShimY(),
            width: this.getWidth() + this.getShimWidthDiff(),
            height: this.getHeight() + this.getShimHeightDiff()
        });

        this.fireEvent('showShim', [this.getShim(), this]);
    },

    getShimY: function () {
        if (this.mouseYOffset) {
            return this.dragProcess.mouseY + this.mouseYOffset;
        } else {
            return this.getTop() + ludo.dom.getMH(this.getEl()) - ludo.dom.getMW(this.shim);
        }
    },

    getShimX: function () {
        if (this.mouseXOffset) {
            return this.dragProcess.mouseX + this.mouseXOffset;
        } else {
            return this.getLeft() + ludo.dom.getMW(this.getEl()) - ludo.dom.getMW(this.shim);
        }
    },

    getShimWidthDiff: function () {
        return ludo.dom.getMW(this.getEl()) - ludo.dom.getMBPW(this.shim);
    },
    getShimHeightDiff: function () {
        return ludo.dom.getMH(this.getEl()) - ludo.dom.getMBPH(this.shim);
    },

    /**
     * Hide shim
     * @function hideShim
     * @memberof ludo.effect.Effect.prototype
     */
    hideShim: function () {
        this.getShim().css('display', 'none');
    },

    /**
     * Set text content of shim
     * @function setShimText
     * @param {String} text
     * @memberof ludo.effect.Effect.prototype
     */
    setShimText: function (text) {
        this.getShim().html(text);
    },
    

    isActive: function () {
        return this.dragProcess.active;
    }
});/* ../ludojs/src/effect/drag-drop.js */
/**
 * effect.Drag with support for drop events.
 * @namespace ludo.effect
 * @class ludo.effect.DragDrop
 * @augments effect.Drag
 * @param {Object} config
 * @param {Boolean} config.captureRegions. True to capture regions. When set, events like "north", "south", "west" and "east"
 * will be fired when dragging over drop points.
 * @fires ludo.effect.Dragdrop#enterDropTarget Fired when entering drop target DOM node. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#validDropTarget Fired when entering valid drop target DOM node. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#invalidDropTarget Fired when entering invalid drop target DOM node. This happens when you have an event handler on enterDropTarget and
 * call the setInvalid method. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#drop Fired on drop. Arguments: 1) DOM dragged 2) DOM drop target, 3) ludo.effect.DragDrop, 4) event.target
 * @fires ludo.effect.Dragdrop#north When captureRegions is set, this event is fired when entering north region of a drop point. Same arguments as otehr drop events.
 * @fires ludo.effect.Dragdrop#south When captureRegions is set, this event is fired when entering south region of a drop point. Same arguments as otehr drop events.
 * @fires ludo.effect.Dragdrop#west When captureRegions is set, this event is fired when entering west region of a drop point. Same arguments as otehr drop events.
 * @fires ludo.effect.Dragdrop#east When captureRegions is set, this event is fired when entering east region of a drop point. Same arguments as otehr drop events.
 */
ludo.effect.DragDrop = new Class({
	Extends:ludo.effect.Drag,
	useShim:false,
	currentDropPoint:undefined,
	onValidDropPoint:undefined,

	captureRegions:false,

	/*
	 * While dragging, always show dragged element this amount of pixels below mouse cursor.
	 * @config mouseYOffset
	 * @type {Number|undefined}
	 * @optional
	 * @default undefined
	 */
	mouseYOffset:undefined,

	__construct:function (config) {
		this.parent(config);
		if (config.captureRegions !== undefined)this.captureRegions = config.captureRegions;

	},

	ludoEvents:function () {
		this.parent();
		this.addEvent('start', this.setStartProperties.bind(this));
		this.addEvent('end', this.drop.bind(this));
	},

	getDropIdByEvent:function (e) {
		var el = jQuery(e.target);
		if (!el.hasClass('ludo-drop')) {
			el = el.getParent('.ludo-drop');
		}
		return el.attr('forId');
	},

	/**
	 * Remove node
	 * @function remove
	 * @param {String} id
	 * @return {Boolean} success
	 * @memberof ludo.effect.DragDrop.prototype
	 */
	remove:function (id) {
		if (this.els[id] !== undefined) {
			var el = jQuery(this.els[id].el);
			el.unbind('mouseenter', this.enterDropTarget.bind(this));
			el.unbind('mouseleave', this.leaveDropTarget.bind(this));
			return this.parent(id);
		}
		return false;
	},

	/**
	 * Create new drop point.
	 * @function addDropTarget
	 * @param {ludo.effect.DropPoint} node
	 * @return {ludo.effect.DropPoint} node
	 * @memberof ludo.effect.DragDrop.prototype
	 */
	addDropTarget:function (node) {
		node = this.getValidNode(node);
		node.el.addClass('ludo-drop');
		if(node.el.mouseenter != undefined){
			node.el.mouseenter(this.enterDropTarget.bind(this));
			node.el.mouseleave(this.leaveDropTarget.bind(this));

		}else{
			node.el.on('mouseenter', this.enterDropTarget.bind(this));
			node.el.on('mouseleave', this.leaveDropTarget.bind(this));
		}

		var captureRegions = node.captureRegions !== undefined ? node.captureRegions : this.captureRegions;
		if (captureRegions) {
			node.el.on('mousemove', this.captureRegion.bind(this));
		}

		node = this.els[node.id] = Object.merge(node, {
			el:node.el,
			captureRegions:captureRegions
		});

		return node;
	},

	enterDropTarget:function (e) {
		if (this.isActive()) {
			this.setCurrentDropPoint(e);
			this.onValidDropPoint = true;

			this.fireEvent('enterDropTarget', this.getDropEventArguments(e));

			if (this.onValidDropPoint) {
				if (this.shouldCaptureRegionsFor(this.currentDropPoint)) {
					this.setMidPoint();
				}

				this.fireEvent('validDropTarget', this.getDropEventArguments(e));
			} else {

				this.fireEvent('invalidDropTarget', this.getDropEventArguments(e));
			}
			return false;
		}
		return undefined;
	},

	setCurrentDropPoint:function (e) {
		this.currentDropPoint = this.getById(this.getDropIdByEvent(e));
	},

	leaveDropTarget:function (e) {
		if (this.isActive() && this.currentDropPoint) {
			this.fireEvent('leaveDropTarget', this.getDropEventArguments(e));
			this.onValidDropPoint = false;
			this.currentDropPoint = undefined;
		}
	},

	getDropEventArguments:function (e) {
		return [this.getDragged(), this.currentDropPoint, this, e.target];
	},

	/**
	 Set drop point invalid. This method is usually used in connection with a listener
	 for the enterDropTarget event
	 @function setInvalid
	 @memberof ludo.effect.DragDrop.prototype
	 @example
	 	dd.addEvent('enterDropTarget', function(node, dd){
			 if(node.name === 'John Doe'){
				 dd.setInvalid(); // Triggers an invalidDropTarget event
			 }
		 });
	 */
	setInvalid:function () {
		this.onValidDropPoint = false;
	},

	getCurrentDropPoint:function () {
		return this.currentDropPoint;
	},

	drop:function (e) {
		if (this.onValidDropPoint)this.fireEvent('drop', this.getDropEventArguments(e));
	},

	setStartProperties:function () {
		this.onValidDropPoint = false;
	},

	shouldCaptureRegionsFor:function (node) {
		return this.els[node.id].captureRegions === true;
	},

	getDropPointCoordinates:function () {
		if (this.currentDropPoint) {
			var el = this.currentDropPoint.el;
			var ret = el.position();
			ret.width = el.width();
			ret.height = el.height();
			return ret;
			return this.currentDropPoint.el.getCoordinates();
		}
		return undefined;
	},

	previousRegions:{
		h:undefined,
		v:undefined
	},

	captureRegion:function (e) {
		if (this.isActive() && this.onValidDropPoint && this.shouldCaptureRegionsFor(this.currentDropPoint)) {
			var midPoint = this.midPoint;
			if (e.pageY < midPoint.y && this.previousRegions.v !== 'n') {
				this.fireEvent('north', this.getDropEventArguments(e));
				this.previousRegions.v = 'n';
			} else if (e.pageY >= midPoint.y && this.previousRegions.v !== 's') {

				this.fireEvent('south', this.getDropEventArguments(e));
				this.previousRegions.v = 's';
			}
			if (e.pageX < midPoint.x && this.previousRegions.h !== 'w') {

				this.fireEvent('west', this.getDropEventArguments(e));
				this.previousRegions.h = 'w';
			} else if (e.pageX >= midPoint.x && this.previousRegions.h !== 'e') {

				this.fireEvent('east', this.getDropEventArguments(e));
				this.previousRegions.h = 'e';
			}

		}
	},

	midPoint:undefined,
	setMidPoint:function () {
		var coords = this.getDropPointCoordinates();
		this.midPoint = {
			x:coords.left + (coords.width / 2),
			y:coords.top + (coords.height / 2)
		};
		this.previousRegions = {
			h:undefined,
			v:undefined
		};
	}
});/* ../ludojs/src/grid/column-move.js */
/**
 * Class responsible for moving columns using drag and drop.
 * An instance of this class is automatically created by the grid. It is
 * rarely nescessary to create your own instances of this class
 */
ludo.grid.ColumnMove = new Class({
	Extends:ludo.effect.DragDrop,
	gridHeader:undefined,
	columnManager:undefined,

	shimCls:['ludo-grid-movable-shim'],
	insertionMarker:undefined,

	arrowHeight:undefined,

	__construct:function (config) {
		this.parent(config);
        this.__params(config, ['gridHeader','columnManager']);
	},

	ludoEvents:function(){
		this.parent();
		this.on('createShim', this.setZIndex.bind(this));
	},

	setZIndex:function(shim){
		jQuery(shim).css('zIndex', 50000);
	},

	getMarker:function () {
		if (this.insertionMarker === undefined) {
            this.insertionMarker = ludo.dom.create({
                cls : 'ludo-grid-movable-insertion-marker',
                css : { display: 'none' },
                renderTo : document.body
            });
            ludo.dom.create({ cls : 'ludo-grid-movable-insertion-marker-bottom', renderTo : this.insertionMarker});
		}
		return this.insertionMarker;
	},

	hideMarker:function(){
		this.getMarker().css('display', 'none');
	},

	showMarkerAt:function(cell, pos){
		var coordinates = cell.offset();
		coordinates.width= cell.outerWidth();
		coordinates.height = cell.outerHeight();

		this.getMarker().css({
			display:'',
			left: (coordinates.left + (pos=='after' ? coordinates.width : 0)),
			top: (coordinates.top - this.getArrowHeight()),
			height: coordinates.height

		});
	},

	setMarkerHeight:function(height){
		this.getMarker().css('height', (height + (this.getArrowHeight() * 2)));
	},

	getArrowHeight:function(){
		if(!this.arrowHeight){
			this.arrowHeight = this.getMarker().find('.ludo-grid-movable-insertion-marker-bottom').first().outerHeight();
		}
		return this.arrowHeight;
	}
});/* ../ludojs/src/scroller.js */
ludo.Scroller = new Class({
    Extends:Events,
    els:{
        applyTo:null,
        el:null,
        elInner:null,
        parent:null
    },

    active:0,
    wheelSize:5,
    type:'horizontal',
    currentSize:0,
    renderTo:undefined,

    initialize:function (config) {
        this.type = config.type || this.type;
        if (config.applyTo) {
            this.setApplyTo(config.applyTo);

        }
        this.renderTo = config.parent ? jQuery(config.parent) : null;
        if (config.mouseWheelSizeCls) {
            this.determineMouseWheelSize(config.mouseWheelSizeCls);
        }
        this.createElements();
        this.createEvents();
    },

    setApplyTo:function (applyTo) {
        if (!ludo.util.isArray(applyTo))applyTo = [applyTo];
        this.els.applyTo = applyTo;
    },

    determineMouseWheelSize:function (cls) {
        var el = jQuery('<div>');
        el.addClass(cls);
        el.css('visibility', 'hidden');
        jQuery(document.body).append(el);
        this.wheelSize = el.height();
        if (!this.wheelSize) {
            this.wheelSize = 25;
        }
        el.remove();
    },

    createElements:function () {
        this.els.el = jQuery('<div>');
        this.els.el.addClass('ludo-scroller');
        this.els.el.addClass('ludo-scroller-' + this.type);
        this.els.el.css({
            'position':'relative',
            'z-index':1000,
            'overflow':'hidden'
        });

		var overflow = 'auto';
        if (this.type == 'horizontal') {
            this.els.el.css({
                'overflow-x':overflow,
                'width':'100%',
                'height':Browser.ie ? '21px' : '17px'
            });
        } else {
            this.els.el.css({
                'overflow-y':overflow,
                'height':'100%',
                'width':Browser.ie ? '21px' : '17px',
                'right':'0px',
                'top':'0px',
                'position':'absolute'
            });
        }



        this.els.el.scroll(this.performScroll.bind(this));

        this.els.elInner = jQuery('<div>');
        this.els.elInner.css('position', 'relative');
        this.els.elInner.html('&nbsp;');

        this.els.el.append(this.els.elInner);
    },

    createEvents:function () {
        this.els.elInner.on('resize', this.toggle.bind(this));
        if (this.type == 'vertical') {
            for (var i = 0; i < this.els.applyTo.length; i++) {
                this.els.applyTo[i].on('mousewheel', this.eventScroll.bind(this));
            }
        }
        jQuery(window).on('resize', this.resize.bind(this));
    },

    resize:function () {
        if (this.type == 'horizontal') {
            this.els.el.css('width', this.renderTo.outerWidth());
        } else {
            var size = this.renderTo.outerHeight();
            if (size == 0) {
                return;
            }
            this.els.el.css('height', size);
        }
        this.toggle();
    },

    getEl:function () {
        return this.els.el;
    },

    setContentSize:function (size) {
        if (this.type == 'horizontal') {
            this.currentSize = size || this.getWidthOfScrollableElements();
            this.els.elInner.css('width', this.currentSize);
        } else {

            this.currentSize = size || this.getHeightOfScrollableElements();

            if (this.currentSize <= 0) {
                var el = this.els.applyTo.getChildren('.ludo-grid-data-column');
                if (el.length) {
                    this.currentSize = el[0].outerHeight();
                }
            }
            this.els.elInner.css('height', this.currentSize);
        }

        if (this.currentSize <= 0) {
            this.setContentSize.delay(1000, this);
        }

        this.resize();
        this.toggle();
    },

    getWidthOfScrollableElements:function () {
        return this.getTotalSize('outerWidth');
    },

    getHeightOfScrollableElements:function () {
        return this.getTotalSize('outerHeight');
    },

    getTotalSize:function (key) {
        var ret = 0;
        for (var i = 0; i < this.els.applyTo.length; i++) {
            ret += this.els.applyTo[i][key]();
        }
        return ret;
    },

    eventScroll:function (e) {
        var s = this.els.el.scrollTop();
        this.els.el.scrollTop(s - e.originalEvent.wheelDelta);
        return false;
    },

    performScroll:function () {

        if (this.type == 'horizontal') {
            this.scrollTo(this.els.el.scrollLeft());
        } else {
            this.scrollTo(this.els.el.scrollTop());
        }
    },

    scrollBy:function (val) {


        var key = this.type === 'horizontal' ? 'scrollLeft' : 'scrollTop';
        this.els.el[key] += val;
        this.scrollTo(this.els.el[key]);
    },

    scrollTo:function (val) {

        var css = this.type === 'horizontal' ? 'left' : 'top';
        for (var i = 0; i < this.els.applyTo.length; i++) {
            this.els.applyTo[i].css(css, (val * -1));
        }
        this.fireEvent('scroll', this);
    },

    getHeight:function () {

        return this.active ? this.els.el.height() : 0;
    },

    getWidth:function () {
        return this.active ? this.els.el.width() : 0;
    },

    toggle:function () {
        this.shouldShowScrollbar() ? this.show() : this.hide();
    },

    shouldShowScrollbar:function () {
        var css = this.type === 'horizontal' ? 'width' : 'height';
        var size = this.getParentEl()[css]();
        return this.currentSize > size && size > 0;
    },

    getParentEl:function () {
        return this.renderTo ? this.renderTo : this.els.el;
    },

    show:function () {
        this.active = true;
        this.els.el.css('display', '');
    },

    hide:function () {
        this.active = false;
        this.scrollTo(0);
        this.els.el.css('display', 'none');
    }
});/* ../ludojs/src/grid/grid-header.js */
/**
 Private class used by grid.Grid to render headers
 @private
 */
ludo.grid.GridHeader = new Class({
	Extends:ludo.Core,
	columnManager:undefined,
	grid:undefined,
	cells:{},
	cellHeight:undefined,
	spacing:{},
	headerMenu:false,

	__construct:function (config) {
		this.parent(config);
        this.__params(config, ['columnManager','headerMenu','grid']);

		this.measureCellHeight();
		this.createDOM();
	},

	ludoEvents:function () {
		this.parent();
        var c = this.columnManager;
		c.on('resize', this.renderColumns.bind(this));
		c.on('stretch', this.renderColumns.bind(this));
		c.on('movecolumn', this.renderColumns.bind(this));
		c.on('hidecolumn', this.renderColumns.bind(this));
		c.on('showcolumn', this.renderColumns.bind(this));
		this.grid.addEvent('render', this.renderColumns.bind(this));
		this.grid.getDataSource().addEvent('sort', this.updateSortArrow.bind(this));
	},

	createDOM:function () {
		this.el = jQuery('<div class="ludo-header">');
		this.el.insertBefore(this.grid.$b().first());
		var countRows = this.columnManager.getCountRows();
		this.el.css('height', this.cellHeight * countRows + ludo.dom.getMBPH(this.el));
		this.renderColumns();
	},

	renderColumns:function () {
		var countRows = this.columnManager.getCountRows();

		this.measureCellHeight();
		for (var i = 0; i < countRows; i++) {
			var columns = this.columnManager.getColumnsInRow(i);
			var left = 0;
			for (var j = 0; j < columns.length; j++) {
				var width = this.columnManager.getWidthOf(columns[j]);
				if (i == this.columnManager.getStartRowOf(columns[j])) {

					var cell = this.getCell(columns[j]);
					cell.css('display', '');
					cell.css('left', left);
					cell.css('top', i * this.cellHeight);
					var height = (this.columnManager.getRowSpanOf(columns[j]) * this.cellHeight) - this.spacing.height;
					var spacing = (j==columns.length-1) ? this.spacing.width - 1 : this.spacing.width;

					cell.css('width', width - spacing);
					cell.css('height', height);
					cell.css('line-height', height + 'px');

					this.resizeCellBackgrounds(columns[j]);

					cell.removeClass('last-header-cell');
					if (j == columns.length - 1) {
						cell.addClass('last-header-cell');
					}
				}
				left += width;
			}
		}
		this.hideHiddenColumns();
	},

	hideHiddenColumns:function () {
		var hiddenColumns = this.columnManager.getHiddenColumns();
		for (var i = 0; i < hiddenColumns.length; i++) {
			if (this.cellExists(hiddenColumns[i])) {
				this.cells[hiddenColumns[i]].css('display', 'none');
			}
		}
	},

	cellExists:function (col) {
		return this.cells[col] !== undefined;
	},

	measureCellHeight:function () {
		if(this.grid.isHidden())return;
		var el = jQuery('<div>');
		el.addClass('ludo-grid-header-cell');
		this.grid.$b().append(el);
		this.cellHeight = el.height() + ludo.dom.getMH(el);

		this.spacing = {
			width:el.outerWidth() - el.width(),
			height:el.outerHeight() - el.height()
		};
		el.remove();
	},

	menuButtons:{},

	getCell:function (col) {
		if (this.cells[col]) {
			return this.cells[col];
		}
		var el = this.cells[col] = jQuery('<div>');
		el.attr('col', col);
		el.addClass('ludo-grid-header-cell');
		el.addClass('ludo-header-' + this.columnManager.getHeaderAlignmentOf(col));

		var span = jQuery('<span class="ludo-cell-text">' + this.columnManager.getHeadingFor(col) + '</span>');
		el.append(span);

		this.createTopAndBottomBackgrounds(col);
		this.addDOMForDropTargets(el, col);

		if (this.columnManager.isSortable(col)) {
			el.on('click', this.sortByDOM.bind(this));
		}
		el.on('mouseover', this.mouseoverHeader.bind(this));
		el.on('mouseout', this.mouseoutHeader.bind(this));

		if (this.headerMenu) {
			this.menuButtons[col] = new ludo.menu.Button({
				renderTo:el,
				id:this.getMenuButtonId(col),
				menu:this.getMenu(col),
				listeners:{
					beforeShow:this.validateButtonDisplay.bind(this)
				}
			});
		}
		this.el.append(el);

		this.getMovable().add({
			el:el,
			column:col
		});
		return el;
	},

	validateButtonDisplay:function (button) {
		if (this.columnMove && this.columnMove.isActive()) {
			button.cancelShow();
		}
	},
	cellBg:{},

	createTopAndBottomBackgrounds:function (col) {
		var top = jQuery('<div>');
		top.addClass('ludo-grid-header-cell-top');
		this.cells[col].append(top);
		var bottom = jQuery('<div>');
		bottom.addClass('ludo-grid-header-cell-bottom');
		this.cells[col].append(bottom);
		this.cellBg[col] = {
			top:top,
			bottom:bottom
		};
	},

	resizeCellBackgrounds:function (col) {
		var totalHeight = (this.columnManager.getRowSpanOf(col) * this.cellHeight) -  this.spacing.height;
		var height = Math.round(totalHeight) / 2;
		this.cellBg[col].top.css('height', height);
		height = totalHeight - height;
		this.cellBg[col].bottom.css('height', height);
	},

	getMenu:function (col) {
		return {
			singleton:true,
			id:this.getMenuId(),
			type:'menu.Menu',
			direction:'vertical',
			children:this.getColumnMenu(col)
		};
	},

	getColumnMenu:function (forColumn) {
		var ret = [];
		var columnKeys = this.columnManager.getLeafKeys();
		for (var i = 0; i < columnKeys.length; i++) {
			ret.push({
				type:'form.Checkbox',
				disabled:!(this.columnManager.isRemovable(columnKeys[i])),
				checked:this.columnManager.isVisible(columnKeys[i]),
				label:this.columnManager.getHeadingFor(columnKeys[i]),
				action:columnKeys[i],
                height: 25, width: 150,
				listeners:{
					change:this.getColumnToggleFn(columnKeys[i], forColumn)
				}
			});
		}

        ret.push(
            {
                html: ludo.language.get('Sort ascending'),
                listeners:{
                    click:function(){
                        this.sort('ascending');
                    }.bind(this)
                }
            }
        );
        ret.push(
            {
                html: ludo.language.get('Sort descending'),
                listeners:{
                    click:function(){
                        this.sort('descending');
                    }.bind(this)
                }
            }
        );
		return ret;
	},

    sort:function(method){
        this.grid.getDataSource().by(this.currentColumn)[method]().sort();
        ludo.get(this.getMenuButtonId(this.currentColumn)).hideMenu();
    },

	getColumnToggleFn:function (column, forColumn) {
		return function (checked) {
			if (checked) {
				this.columnManager.showColumn(column);
			} else {
				this.columnManager.hideColumn(column);
			}
			ludo.get(this.getMenuButtonId(forColumn)).hideMenu();
		}.bind(this);
	},

	getMenuId:function () {
		return 'header-menu-' + this.getId();
	},

	getMenuButtonId:function (column) {
		return this.getMenuId() + '-' + column;
	},

    currentColumn:undefined,

	mouseoverHeader:function (e) {
		var col = this.getColByDOM(e.target);

		if (!this.grid.colResizeHandler.isActive() && !this.grid.isColumnDragActive() && this.columnManager.isSortable(col)) {

            this.currentColumn = col;
			this.cells[col].addClass('ludo-grid-header-cell-over');
		}
	},

	mouseoutHeader:function (e) {
		if (!this.grid.colResizeHandler.isActive()) {
			var col = this.getColByDOM(e.target);
			if (!col)return;
			this.cells[col].removeClass('ludo-grid-header-cell-over');
		}
	},

	getColByDOM:function (el) {
		el = jQuery(el);
		var ret = el.attr('col');
		if (!ret && ret != '0') {
			ret = el.parent().attr('col');
		}
		return ret;
	},

	getHeight:function () {
		if (this.cachedHeight === undefined) {
			this.cachedHeight = this.columnManager.getCountRows() * this.cellHeight;
			this.cachedHeight += ludo.dom.getMBPH(this.el);
		}
		return this.cachedHeight;
	},

	getEl:function () {
		return this.el;
	},

	sortByDOM:function (e) {
		var col = this.getColByDOM(e.target);
		this.grid.getDataSource().sortBy(col);
	},

	addDOMForDropTargets:function (parent, column) {
		var left = jQuery('<div>');
		left.css({
			position:'absolute',
			'z-index':15,
			left:'0px', top:'0px',
			width:'50%', height:'100%'
		});

		parent.append(left);
		var right = jQuery('<div>');
		right.css({
			position:'absolute',
			'z-index':15,
			right:'0px', top:'0px',
			width:'50%', height:'100%'
		});
		parent.append(right);

		this.getMovable().addDropTarget({
			el:left,
			column:column,
			position:'before'
		});
		this.getMovable().addDropTarget({
			el:right,
			column:column,
			position:'after'
		});
	},

	columnMove:undefined,
	getMovable:function () {
		if (this.columnMove === undefined) {
			this.columnMove = new ludo.grid.ColumnMove({
				useShim:true,
				delay:.5,
				mouseYOffset:15,
				mouseXOffset:15,
				listeners:{
					before:this.validateMove.bind(this),
					start:this.grid.hideResizeHandles.bind(this.grid),
					end:this.grid.showResizeHandles.bind(this.grid),
					enterDropTarget:this.validateDrop.bind(this),
					leaveDropTarget:this.leaveDropTarget.bind(this),
					showShim:this.setColumnTextOnMove.bind(this),
					drop:this.moveColumn.bind(this)
				}
			});
		}
		return this.columnMove;
	},

	setColumnTextOnMove:function (shim, dd) {
		var column = dd.getDragged().column;
		shim.html( this.columnManager.getHeadingFor(column));
		shim.css('line-height', shim.css('height'));
	},

	validateMove:function (dragged, dd) {
		if (!this.columnManager.isMovable(dragged.column)) {
			dd.cancelDrag();
		}
	},
	validateDrop:function (dragged, dropPoint) {
		var cm = this.columnManager;
		if (cm.canBeMovedTo(dragged.column, dropPoint.column, dropPoint.position)) {
			var m = this.getMovable();
			m.showMarkerAt(this.getCell(dropPoint.column), dropPoint.position);
			var height = (cm.getChildDepthOf(dropPoint.column) + cm.getRowSpanOf(dropPoint.column)) * this.cellHeight;
			m.setMarkerHeight(height);
		}
	},

	leaveDropTarget:function () {
		this.getMovable().hideMarker();
	},

	moveColumn:function (dragged, droppedAt) {
		if (droppedAt.position == 'before') {
			this.columnManager.insertColumnBefore(dragged.column, droppedAt.column);
		} else {
			this.columnManager.insertColumnAfter(dragged.column, droppedAt.column);
		}
		this.getMovable().hideMarker();
	},

	clearSortClassNameFromHeaders:function () {
		var keys = this.columnManager.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			if (this.cells[keys[i]] !== undefined) {
				var el = this.cells[keys[i]].find('span');
				el.removeClass('ludo-cell-text-sort-asc');
				el.removeClass('ludo-cell-text-sort-desc');
			}
		}
	},

	updateSortArrow:function (sortedBy) {
		this.clearSortClassNameFromHeaders();
		if (this.cells[sortedBy.column]) {
            this.cells[sortedBy.column].find('span').addClass('ludo-cell-text-sort-' + sortedBy.order);
		}
	}
});/* ../ludojs/src/col-resize.js */
ludo.ColResize = new Class({
    Extends:ludo.Core,
    component:undefined,
    resizeHandles:{},
    resizeProperties:{},
    minPos:0,
    maxPos:10000,

    __construct:function (config) {
        this.parent(config);
        this.component = config.component;
        this.createEvents();
    },

    createEvents:function () {
        this.getEventEl().on(ludo.util.getDragMoveEvent(), this.moveColResizeHandle.bind(this));
        this.getEventEl().on(ludo.util.getDragEndEvent(), this.stopColResize.bind(this));
    },

    setPos:function (index, pos) {
        this.resizeHandles[index].css('left', pos);
    },

    hideHandle:function (index) {
        this.resizeHandles[index].css('display', 'none');
    },
    showHandle:function (index) {
        this.resizeHandles[index].css('display', '');
    },

    hideAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.hideHandle(key);
            }
        }
    },
    showAllHandles:function () {
        for (var key in this.resizeHandles){
            if(this.resizeHandles.hasOwnProperty(key)){
                this.showHandle(key);
            }
        }
    },

    getHandle:function (key, isVisible) {

        var el = jQuery('<div>');
        el.addClass('ludo-column-resize-handle');
        el.css({
            'top':0,
            'position':'absolute',
            'height':'100%',
            'cursor':'col-resize',
            'z-index':15000,
            display:isVisible ? '' : 'none'
        });
        el.attr('col-reference', key);
        el.on(ludo.util.getDragStartEvent(), this.startColResize.bind(this));
        if (!ludo.util.isTabletOrMobile()) {
            el.on('mouseenter', this.mouseOverResizeHandle.bind(this));
            el.on('mouseleave', this.mouseOutResizeHandle.bind(this));
        }
        this.resizeHandles[key] = el;
        return el;
    },

    startColResize:function (e) {
        var columnName = jQuery(e.target).attr('col-reference');
        this.fireEvent('startresize', columnName);
        jQuery(e.target).addClass('ludo-resize-handle-active');
        var offset = this.getLeftOffsetOfColResizeHandle();

        var r = this.resizeProperties;
        r.min = this.getMinPos() - offset;
        r.max = this.getMaxPos() - offset;

        r.mouseX = this.resizeProperties.currentX = e.pageX;
        r.elX = parseInt(jQuery(e.target).css('left').replace('px', ''));
        r.currentX = this.resizeProperties.elX;

        r.active = true;
        r.el = jQuery(e.target);
        r.index = columnName;

        return false;
    },

    getLeftOffsetOfColResizeHandle:function () {
        if (!this.resizeHandles[0]) {
            return 3;
        }
        if (!this.handleOffset) {
            var offset = Math.ceil(this.resizeHandles[0].getSize().x / 2);
            if (offset > 0) {
                this.handleOffset = offset;
            } else {
                return 3;
            }
        }
        return this.handleOffset;
    },

    moveColResizeHandle:function (e) {

        if (this.resizeProperties.active) {
            var pos = this.resizeProperties.elX - this.resizeProperties.mouseX + e.pageX;
            pos = Math.max(pos, this.resizeProperties.min);
            pos = Math.min(pos, this.resizeProperties.max);

            this.resizeProperties.el.css('left', pos);

            this.resizeProperties.currentX = pos;
            return false;
        }
		return undefined;
    },

    stopColResize:function () {
        if (this.resizeProperties.active) {
            this.resizeProperties.active = false;
            this.resizeProperties.el.removeClass('ludo-resize-handle-active');
            var change = this.resizeProperties.currentX - this.resizeProperties.elX;
            this.fireEvent('resize', [this.resizeProperties.index, change]);
            return false;
        }
		return undefined;
    },

    getMinPos:function () {
        return this.minPos;
    },
    getMaxPos:function () {
        return this.maxPos;
    },

    setMinPos:function (pos) {
        this.minPos = pos;
    },

    setMaxPos:function (pos) {
        this.maxPos = pos;
    },

    mouseOverResizeHandle:function (e) {
        jQuery(e.target).addClass('ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle:function (e) {
        jQuery(e.target).removeClass('ludo-grid-resize-handle-over');
    },

    isActive:function(){
        return this.resizeProperties.active;
    }
});/* ../ludojs/src/grid/column-manager.js */
/**
 Column manager for grids. Grids will listen to events fired by this component. A column manager is usually created by
 sending a "columns" array to the constructor of a grid.Grid view.
 @namespace ludo.grid
 @class ludo.grid.ColumnManager
 @augments Core
 @param {Object} config
 @fires ludo.grid.ColumnManager#showcolumn Fired when a column is shown. Argument: {String} column name
 @fires ludo.grid.ColumnManager#hideColumn Fired when a column is hidden. Argument: {String} column name
 @fires ludo.grid.ColumnManager#moveColumn Fired when a column has been moved. Argument: 1) {String} column moved, 2) {String} new sibling column 3) {String} before or after new sibling
 @example
    columnManager:{
		columns:{
			'country':{
				heading:'Country',
				removable:false,
				sortable:true,
				movable:true,
				width:200,
				renderer:function (val) {
					return '<span style="color:blue">' + val + '</span>';
				}
			},
			'capital':{
				heading:'Capital',
				sortable:true,
				removable:true,
				movable:true,
				width:150
			},
			population:{
				heading:'Population',
				movable:true,
				removable:true
			}
		}
	}
 Is example of a ColumnManager config object sent to a grid. It defines three columns, "country", "capital" and "population". These names
 corresponds to keys in the data sets. How to configure columns is specified in {{#crossLink "grid.Column"}}{{/crossLink}}
 */
ludo.grid.ColumnManager = new Class({
	Extends:ludo.Core,
	type:'grid.ColumnManager',
	fill:true,
	columns:{},
	columnKeys:[],
	statefulProperties:['columns', 'columnKeys'],
	columnLookup:{},

	__construct:function (config) {
		this.parent(config);
        this.__params(config, ['fill','columns']);

		this.createColumnLookup();

		if (config.columnKeys !== undefined && this.hasValidColumnKeys(config.columnKeys)) {
			this.columnKeys = config.columnKeys;
		} else {
			this.columnKeys = this.getLeafKeysFromColumns();
		}
	},

	getLeafKeysFromColumns:function (parent) {
		var ret = [];
		parent = parent || this.columns;
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) {
				ret.push(key);
				if (parent[key].columns !== undefined) {
					var keys = this.getLeafKeysFromColumns(parent[key].columns);
					for (var i = 0; i < keys.length; i++) {
						ret.push(keys[i]);
					}
				}
			}
		}
		return ret;
	},

	createColumnLookup:function (parent, groupName) {
		parent = parent || this.columns;
		for (var key in parent) {
			if (parent.hasOwnProperty(key)) {
				this.columnLookup[key] = parent[key];
				this.columnLookup[key].group = groupName;
				if (parent[key].columns !== undefined) {
					this.createColumnLookup(parent[key].columns, key);
				}
			}
		}
	},

	hasValidColumnKeys:function (keys) {
		for (var i = 0; i < keys.length; i++) {
			if (this.columnLookup[keys[i]] === undefined)return false;
		}
		return true;
	},

	hasLastColumnDynamicWidth:function () {
		return this.fill;
	},

	getColumns:function () {
		return this.columns;
	},

	getColumn:function (key) {
		return this.columnLookup[key];
	},

	getLeafKeys:function () {
		var ret = [];
		for (var i = 0; i < this.columnKeys.length; i++) {
			if (this.columnLookup[this.columnKeys[i]].columns === undefined) {
				ret.push(this.columnKeys[i]);
			}
		}
		return ret;
	},

	/**
	 Returns object of visible columns, example:
	 @function getVisibleColumns
	 @memberof ludo.grid.ColumnManager.prototype
	 @return {Object} visible columns
     @example
        {
            country : {
                heading : 'Country'
            },
            population: {
                heading : 'Population'
            }
        }
	 */
	getVisibleColumns:function () {
		var ret = {};
		var keys = this.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!this.isHidden(key)) {
				ret[key] = this.columnLookup[key];
			}
		}
		return ret;
	},

	getHeadingFor:function (column) {
		return this.getColumnKey(column, 'heading') || '';
	},

	getMinWidthOf:function (column) {
		if (this.isGroup(column)) {
			var children = this.getIdOfChildren(column);
			var ret = 0;
			for (var i = 0; i < children.length; i++) {
				ret += this.getMinWidthOf(children[i]);
			}
			return ret;
		}
		return this.getColumnKey(column, 'minWidth') || 50;
	},

	getMaxWidthOf:function (column) {
		return this.getColumnKey(column, 'maxWidth') || 1000;
	},


	getWidthOf:function (column) {
		var stretchedWidth = this.getStrechedWithOf(column);
		if (stretchedWidth) return stretchedWidth;
		if (this.isGroup(column)) {
			var columns = this.getColumnsInGroup(column);
			var width = 0;
			Object.each(columns, function (value, column) {
				if(!this.isHidden(column))width += this.getWidthOf(column);
			}.bind(this));
			return width;
		} else {
			return this.getColumnKey(column, 'width') || 100;
		}
	},

	isGroup:function (column) {
		return this.columnLookup[column] !== undefined && this.columnLookup[column].columns !== undefined;
	},

	getColumnsInGroup:function (group) {
		return this.columnLookup[group].columns;
	},

	getStrechedWithOf:function (column) {
		return this.getColumnKey(column, 'stretchWidth');
	},

	isRemovable:function (column) {
		return this.getColumnKey(column, 'removable') ? true : false;
	},

	/**
	 * Returns true if column with given id is in a group.
	 * @function isInAGroup
	 * @param {String} column
	 * @return {Boolean} is in a group
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	isInAGroup:function (column) {
		return this.getColumnKey(column, 'group') !== undefined;
	},

	/**
	 * Returns id of parent group
	 * @function getGroupIdOf
	 * @param {String} column
	 * @return {String} group id
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	getGroupIdOf:function (column) {
		return this.getColumnKey(column, 'group');
	},

	/**
	 * Returns parent group object for a column
	 * @function getGroupFor
	 * @param {String} column
	 * @return {grid.Column|undefined} parent
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	getGroupFor:function (column) {
		var id = this.getGroupIdOf(column);
        return id ? this.columnLookup[id] : undefined;
	},

	getChildCount:function (groupId) {
		var group = this.getColumn(groupId);
		if (group.columns !== undefined) {
			return ludo.util.lengthOfObject(group.columns);
		}
		return 0;
	},

	getIdOfChildren:function (groupId) {
		var group = this.getColumn(groupId);
		if (group) {
			return Object.keys(group.columns);
		}
		return 0;
	},

	isInSameGroup:function (columnA, columnB) {
		return this.isInAGroup(columnA) && this.getGroupIdOf(columnA) == this.getGroupIdOf(columnB);
	},

	isSortable:function (column) {
		return this.getColumnKey(column, 'sortable') ? true : false;
	},

	isHidden:function (column) {
		var hidden = this.getColumnKey(column, 'hidden');
		if (hidden)return true;
		var parentGroup;
		if (parentGroup = this.getGroupIdOf(column)) {
			return this.isHidden(parentGroup);
		}
		return hidden;
	},
	isVisible:function (column) {
		return !this.isHidden(column);
	},
	/**
	 * Returns true if column with given id is resizable
	 * @function isResizable
	 * @param {String} column
	 * @return {Boolean}
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	isResizable:function (column) {
		var resizable = this.getColumnKey(column, 'resizable') !== false;
		if (resizable && this.hasLastColumnDynamicWidth() && this.isLastVisibleColumn(column)) {
			resizable = false;
		}
		return resizable;
	},
	isMovable:function (column) {
		var parent = this.getGroupIdOf(column);
		if (parent && this.getChildCount(parent) == 1) {
			return false;
		}
		return this.getColumnKey(column, 'movable') || false;
	},

	hasMovableColumns:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			if (this.isMovable(this.columnKeys[i]))return true;
		}
		return false;
	},

	getAlignmentOf:function (column) {
		return this.getColumnKey(column, 'align') || 'left';
	},

	getHeaderAlignmentOf:function(column){
		return this.getColumnKey(column, 'headerAlign') || 'left';
	},

	setLeft:function (column, left) {
		this.columnLookup[column].left = left;
	},
	getLeftPosOf:function (column) {
		return this.getColumnKey(column, 'left') || 0;
	},

	getRendererFor:function (column) {
		return this.getColumnKey(column, 'renderer');
	},

	setWidth:function (column, width) {
		this.columnLookup[column].width = width;
	},

	setStretchedWidth:function (width) {
		this.columnLookup[this.getLastVisible()].stretchWidth = width;
		this.fireEvent('stretch');
	},

	clearStretchedWidths:function () {
		for (var i = 0; i < this.columnKeys.length; i++) {
			this.columnLookup[this.columnKeys[i]].stretchWidth = undefined;
		}

	},

	increaseWithFor:function (column, increaseBy) {
		var width = this.getWidthOf(column);
		this.columnLookup[column].width = width + increaseBy;
		this.fireEvent('resize');
		this.fireEvent('state');
	},

	getColumnKey:function (column, key) {
		if (this.columnLookup[column] !== undefined) {
			return this.columnLookup[column][key];
		}
		return null;
	},

	getTotalWidth:function () {
		var cols = this.getVisibleColumns();
		var ret = 0;
		for (var col in cols) {
			if (cols.hasOwnProperty(col)) {
				ret += this.getWidthOf(col);
			}
		}
		return ret;
	},

	getMinPosOf:function (column) {
		return this.getTotalWidthOfPreviousOf(column) + this.getMinWidthOf(column);
	},

	getMaxPosOf:function (column) {
		return this.getTotalWidthOfPreviousOf(column) + this.getMaxWidthOf(column);
	},

	getTotalWidthOfPreviousOf:function (column) {
		var keys = this.getLeafKeys();
		var ret = 0;
		for (var i = 0; i < keys.length; i++) {
			if (keys[i] == column) {
				return ret;
			}
            if (!this.isHidden(keys[i])) {
                ret += this.getWidthOf(keys[i]);
            }
		}
		return 0;
	},

	/**
	 * Insert a column before given column
	 * @function insertColumnBefore
	 * @param {String} column id
	 * @param {String} before column id
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	insertColumnBefore:function (column, before) {
		this.moveColumn(column, before, 'before');
	},
	/**
	 * Insert a column after given column
	 * @function insertColumnAfter
	 * @param {String} column id
	 * @param {String} after column id
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	insertColumnAfter:function (column, after) {
		this.moveColumn(column, after, 'after');
	},

	moveColumn:function (column, insertAt, beforeOrAfter) {
		var indexAt = this.getInsertionPoint(insertAt, beforeOrAfter);
		var indexThis = this.columnKeys.indexOf(column);

		if (this.isInAGroup(column) && !this.isInSameGroup(column, insertAt)) {
			this.removeFromGroup(column);
		}
		var i,j;
		var indexes = [indexThis];
		if (this.isGroup(column)) {
			var children = this.getIdOfChildren(column);
			for (i = 0; i < children.length; i++) {
				indexes.push(this.columnKeys.indexOf(children[i]));
			}
		}

		if(this.isInAGroup(insertAt)){
			this.insertIntoSameGroupAs(column,insertAt);
		}

		var ret = [];
		for (i = 0; i < this.columnKeys.length; i++) {
			if (i == indexAt && beforeOrAfter == 'before') {
				for (j = 0; j < indexes.length; j++) {
					ret.push(this.columnKeys[indexes[j]]);
				}
			}
			if (indexes.indexOf(i) == -1) {
				ret.push(this.columnKeys[i]);
			}
			if (i == indexAt && beforeOrAfter == 'after') {
				for (j = 0; j < indexes.length; j++) {
					ret.push(this.columnKeys[indexes[j]]);
				}
			}
		}
		this.columnKeys = ret;

		this.fireEvent('movecolumn', [column, this.columnKeys[indexAt], beforeOrAfter]);
		this.fireEvent('state');
	},

	getInsertionPoint:function(insertAtColumn, pos){
		var ret = this.columnKeys.indexOf(insertAtColumn);
		if (pos === 'after' && this.isGroup(insertAtColumn)){
			var columns = Object.keys(this.getColumnsInGroup(insertAtColumn));
			for(var i=0;i<columns.length;i++){
				ret = Math.max(ret, this.columnKeys.indexOf(columns[i]));
			}
		}
		return ret;
	},

	/**
	 * @function insertIntoSameGroupAs
	 * @param {String} column
	 * @param {String} as
	 * memberof ludo.grid.ColumnManager.prototype
	 * @private
	 */
	insertIntoSameGroupAs:function(column, as){
		var group = this.columnLookup[as].group;
		this.columnLookup[column].group = group;
		this.columnLookup[group].columns[column] = this.columnLookup[column];
		this.clearCache();
	},

	isLastVisibleColumn:function (column) {
		var keys = this.getLeafKeys();
		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];
			if (!this.isHidden([key])) {
				return key === column;
			}
		}
		return false;
	},

	/**
	 * Remove column from a group
	 * @function removeFromGroup
	 * @param {String} column
	 * @return {Boolean} success
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	removeFromGroup:function (column) {
		var group = this.getGroupFor(column);
		if (group) {
			delete group.columns[column];
			this.getColumn(column).group = undefined;
			this.clearCache();
			return true;
		}
		return false;
	},

	hideColumn:function (column) {
		if (this.columnExists(column) && !this.isHidden(column)) {
			this.columnLookup[column].hidden = true;
			this.fireEvent('hidecolumn', column);
			this.fireEvent('state');
		}
	},

	columnExists:function (column) {
		return this.columnLookup[column] !== undefined;
	},

	hideAllColumns:function () {
		var keys = this.getLeafKeys();
		for (var i = 0; i < keys.length; i++) {
			this.columnLookup[keys[i]].hidden = true;
		}
	},

	showColumn:function (column) {
		if (this.columnExists(column) && this.isHidden([column])) {
			this.columnLookup[column].hidden = false;

			this.fireEvent('showcolumn', column);

			this.fireEvent('state');
		}
	},

	getIndexOfLastVisible:function () {
		var keys = this.getLeafKeys();
		for (var i = keys.length - 1; i >= 0; i--) {
			if (!this.isHidden(keys[i])) {
				return i;
			}
		}
		return null;
	},

	getLastVisible:function () {
		return this.getLeafKeys()[this.getIndexOfLastVisible()];
	},

	countHeaderRows:undefined,
	getCountRows:function () {
		if (this.countHeaderRows === undefined) {
			var ret = 0;
			var keys = this.getLeafKeys();
			for (var i = 0; i < keys.length; i++) {
				ret = Math.max(ret, this.getStartRowOf(keys[i]));
			}
			this.countHeaderRows = ret + 1;
		}
		return this.countHeaderRows;
	},

	countParentCache:{},
	getStartRowOf:function (column) {
		if (this.countParentCache[column] === undefined) {
			var ret = 0;
			if (this.columnLookup[column].group !== undefined) {
				var col = this.columnLookup[column].group;
				while (col) {
					ret++;
					col = this.columnLookup[col].group;
				}
			}
			this.countParentCache[column] = ret;
		}
		return this.countParentCache[column];
	},
	clearCache:function(){
		this.countParentCache = {};
		this.columnDepthCache = {};
	},

	/**
	 * Return array of column keys for a header row, 0 is first row
	 * @function getColumnsInRow
	 * @param {Number} rowNumber
	 * @return {Array} columns
	 * @memberof ludo.grid.ColumnManager.prototype
	 */
	getColumnsInRow:function (rowNumber) {
		var ret = [];
		for(var i=0;i<this.columnKeys.length;i++){
			if(!this.isHidden(this.columnKeys[i])){
                var col = this.columnKeys[i];
				var startRow = this.getStartRowOf(col);
				if(startRow <= rowNumber && !this.isGroup(col)){
					ret.push(col);
				}else{
					if(startRow == rowNumber){
						ret.push(col);
					}
				}
			}
		}
		return ret;

	},

	getRowSpanOf:function(column){
		var countRows = this.getCountRows();
        return countRows - this.getStartRowOf(column) - (this.isGroup(column) ? this.getChildDepthOf(column) : 0);
	},

	columnDepthCache:{},
	getChildDepthOf:function(column){
		if(this.columnDepthCache[column] === undefined){
			if(this.isGroup(column)){
				var ret = 0;
				var children = this.getIdOfChildren(column);
				for(var i=0;i<children.length;i++){
					ret = Math.max(ret, this.getChildDepthOf(children[i]));
				}
				ret++;
				this.columnDepthCache[column] = ret;
			}else{
				this.columnDepthCache[column] = 0;
			}
		}
		return this.columnDepthCache[column];
	},

	getHiddenColumns:function(){
		var ret = [];
		for(var i=0;i<this.columnKeys.length;i++){
			if(this.isHidden(this.columnKeys[i])){
				ret.push(this.columnKeys[i]);
			}
		}
		return ret;
	},

	canBeMovedTo:function(column, to){
		return column !== to;
	}
});/* ../ludojs/src/grid/row-manager.js */
/**
 * Row renderer config for a grid.
 * @class ludo.grid.RowManager
 * @param {Object} config
 * @param {Function} config.rowCls Function returning css class as string for a row. Argument to function: JSON for a row.
 * @example:
 * new ludo.grid.Grid({
 * 	rowManager: {
 * 		rowCls:function(row){ return "my-css-class" }
 * 	}
 *
 *
 */
ludo.grid.RowManager = new Class({
	Extends: ludo.Core,
	type : 'grid.RowManager',

	rowCls:undefined,

	__construct:function(config){
		this.parent(config);
		if(config.rowCls)this.rowCls = config.rowCls;
	}

});/* ../ludojs/src/grid/grid.js */
/**
 * @namespace ludo.grid
 */

/**
 @namespace ludo.grid
 @class ludo.grid.Grid
 @augments View

 @param {Object} config
 @param {Boolean} config.headerMenu Show menu on each column heading.
 @param {Boolean} config.highlightRecord True to highlight rows on click, default: true
 @param {Boolean} config.mouseOverEffect True to highlight rows on mouse over, default: true.
 @param {Object} config.columns Description of columns. See example below for details.
 @param {Object} config.emptyText Text to show on grid when there are no data, default: "No data"
 @fires ludo.grid.Grid#click Row clicked. Arguments: 1) The record, i.e. JSON Object, example: { "firstname": "Jane", "lastname": "Johnson" } and 2) name of clicked column, example: "lastname"
 @fires ludo.grid.Grid#dblclick Row double clicked. Arguments: 1) The record, i.e. JSON Object, example: { "firstname": "Jane", "lastname": "Johnson" } and 2) name of clicked column, example: "lastname"
 @example
 children:[
 ..
 {
      id:'myGrid',
      type:'grid.Grid',
      stateful:true,
      resizable:false,

      columns:{
          'country':{
              heading:'Country',
              removable:false,
              sortable:true,
              movable:true,
              width:200,
              renderer:function (val) {
                  return '<span style="color:blue">' + val + '</span>';
              }
          },
          'capital':{
              heading:'Capital',
              sortable:true,
              removable:true,
              movable:true,
              width:150
          },
          population:{
              heading:'Population',
              movable:true,
              removable:true
          }
      },
      dataSource:{
          url:'data-source/grid.php',
          id:'myDataSource',
          paging:{
              size:12,
              remotePaging:false,
              cache:false,
              cacheTimeout:1000
          },
          searchConfig:{
              index:['capital', 'country']
          },
          listeners:{
              select:function (record) {
                  console.log(record)
              },
               count:function(countRecords){
                   ludo.get('gridWindowSearchable').setTitle('Grid - capital and population - Stateful (' + countRecords + ' records)');
               }
          }
      }

  }
 ...
 ]
 Is example of code used to add a grid as child view of another view. You may also create the grid directly using:

 @example
 new ludo.grid.Grid({...})
 where {...} can be the same code as above. use the "renderTo" config property to specify where you want the grid to be rendered.

 */
ludo.grid.Grid = new Class({
    Extends: ludo.View,
    type: 'Grid',

    hasMenu: true,
    colMovable: null,
    menu: true,

    menuConfig: [],

    sb: {},

    highlightRecord: true,

    uniqueId: '',
    activeRecord: {},

    headerMenu: true,


    mouseOverEffect: true,

    columnManager: undefined,

    /*
     Column config
     @config {Object} columns
     @example
     columns:{
     'country':{
     heading:'Country',
     sortable:true,
     movable:true,
     renderer:function (val) {
     return '<span style="color:blue">' + val + '</span>';
     }
     },
     'capital':{
     heading:'Capital',
     sortable:true,
     movable:true
     },
     population:{
     heading:'Population',
     movable:true
     }
     }
     or nested:

     columns:{
     info:{
     heading:'Country and Capital',
     headerAlign:'center',
     columns:{
     'country':{
     heading:'Country',
     removable:false,
     sortable:true,
     movable:true,
     width:200,
     renderer:function (val) {
     return '<span style="color:blue">' + val + '</span>';
     }
     },
     'capital':{
     heading:'Capital',
     sortable:true,
     removable:true,
     movable:true,
     width:150
     }
     }
     },
     population:{
     heading:'Population',
     movable:true,
     removable:true
     }
     }

     */
    columns: undefined,
    rowManager: undefined,

    emptyText: 'No data',

    defaultDS: 'dataSource.JSONArray',

    __construct: function (config) {
        this.parent(config);

        this.__params(config, ['columns', 'fill', 'headerMenu', 'rowManager', 'mouseOverEffect', 'emptyText', 'highlightRecord','keys']);

        if (this.columns == undefined) {
            this.columns = this.__columns();
        }

        if(this.keys != undefined){
            var cols = {};
            jQuery.each(this.keys, function(i, key){
                 if(this.columns[key] != undefined){
                     console.log(key);
                     cols[key] = this.columns[key];
                 }
            }.bind(this));
            this.columns = cols;
        }

        if (!this.cm) {
            this.cm = {
                columns: this.columns,
                fill: this.fill
            };
        }
        if (this.cm) {
            if (!this.cm.type)this.cm.type = 'grid.ColumnManager';
            this.cm.stateful = this.stateful;
            this.cm.id = this.cm.id || this.id + '_cm';
            this.cm = this.createDependency('colManager', this.cm);
            this.cm.addEvents({
                'hidecolumn': this.refreshData.bind(this),
                'showcolumn': this.refreshData.bind(this),
                'movecolumn': this.onColumnMove.bind(this),
                'resize': this.resizeColumns.bind(this)
            });
        }

        if (this.rowManager) {
            if (!this.rowManager.type)this.rowManager.type = 'grid.RowManager';
            this.rowManager = this.createDependency('rowManager', this.rowManager);
        }
        if (this.stateful && this.dataSource !== undefined && ludo.util.isObject(this.dataSource)) {
            this.dataSource.id = this.dataSource.id || this.id + '_ds';
            this.dataSource.stateful = this.stateful;
        }

        this.uniqueId = String.uniqueID();

    },

    __columns: function () {
        return undefined;
    },

    ludoDOM: function () {
        this.parent();
        this.getEl().addClass('ludo-grid-Grid');

        var b = this.$b();
        var t = this.els.dataContainerTop = jQuery('<div>');

        t.addClass('ludo-grid-data-container');
        t.css({
            'overflow': ludo.util.isTabletOrMobile() ? 'auto' : 'hidden',
            'position': 'relative'
        });

        b.append(t);
        b.css('overflow', 'visible');

        this.els.dataContainer = jQuery('<div>');
        t.append(this.els.dataContainer);

        this.els.dataContainer.css('position', 'relative');
        this.gridHeader = this.createDependency('gridHeader', {
            type: 'grid.GridHeader',
            headerMenu: this.headerMenu,
            columnManager: this.cm,
            grid: this
        });
        this.createDataColumnElements();
        this.createScrollbars();
        this.createColResizeHandles();
    },

    ludoEvents: function () {
        this.parent();

        if (this.dataSource) {
            if (this.dataSourceObj && this.dataSourceObj.hasData()) {
                this.populateData();
            }
            this.getDataSource().addEvents({
                'change': this.populateData.bind(this),
                'select': this.setSelectedRecord.bind(this),
                'deselect': this.deselectDOMForRecord.bind(this),
                'update': this.showUpdatedRecord.bind(this),
                'delete': this.removeDOMForRecord.bind(this)
            });
            this.getDataSource().addEvent('select', this.selectDOMForRecord.bind(this));
        }
        this.$b().on('selectstart', ludo.util.cancelEvent);
        if (this.highlightRecord) {
            this.$b().on('click', this.cellClick.bind(this));
            this.$b().on('dblclick', this.cellDoubleClick.bind(this));
        }else{
            this.$b().css('cursor', 'default');
        }


        if (this.mouseOverEffect) {
            this.els.dataContainer.on('mouseleave', this.mouseLeavesGrid.bind(this));
        }
    },

    __rendered: function () {
        this.parent();
        this.ifStretchHideLastResizeHandles();

        if (this.highlightRecord) {
            this.els.dataContainer.css('cursor', 'pointer');
        }

        this.positionVerticalScrollbar.delay(100, this);

        if (this.getParent()) {
            this.getParent().$b().css({
                'padding': 0
            });
            ludo.dom.clearCache();
            this.getParent().resize.delay(100, this.getParent());
        }

        this.toggleEmptyText();
    },

    currentOverRecord: undefined,
    mouseoverDisabled: false,

    enterCell: function (el) {
        if (this.mouseoverDisabled)return;
        var record = this.getRecordByDOM(el);
        if (record) {
            if (this.currentOverRecord) {
                this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
            }
            this.currentOverRecord = record;
            this.selectDOMForRecord(record, 'ludo-grid-record-over');
        }
    },

    mouseLeavesGrid: function () {
        if (this.currentOverRecord) {
            this.deselectDOMForRecord(this.currentOverRecord, 'ludo-grid-record-over');
            this.currentOverRecord = undefined;
        }
    },

    cellClick: function (e) {
        var record = this.getRecordByDOM(e.target);
        if (record) {
            this.getDataSource().selectRecord(record);
            this.fireEvent('click', [record, this.getColumnByDom(e.target)]);
        }
    },

    getColumnByDom: function (el) {
        el = jQuery(el);
        if (!el.hasClass('ludo-grid-data-cell')) {
            el = el.closest('.ludo-grid-data-cell');
        }
        if (el) {
            return el.attr('col');
        }
        return undefined;
    },

    setSelectedRecord: function (record) {
        // TODO should use dataSource.Record object instead of plain object
        this.fireEvent('selectrecord', record);
        this.highlightActiveRecord();
    },

    highlightActiveRecord: function () {
        if (this.highlightRecord) {
            var selectedRecord = this.getDataSource().getSelectedRecord();
            if (selectedRecord && selectedRecord.uid) {
                this.selectDOMForRecord(selectedRecord, 'ludo-active-record');
            }
        }
    },

    selectDOMForRecord: function (record, cls) {
        cls = cls || 'ludo-active-record';
        var cells = this.getDOMCellsForRecord(record);
        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                cells[key].addClass(cls);
            }
        }
    },

    deselectDOMForRecord: function (record, cls) {
        cls = cls || 'ludo-active-record';
        var cells = this.getDOMCellsForRecord(record);
        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                cells[key].removeClass(cls);
            }
        }
    },


    showUpdatedRecord: function (record) {
        var cells = this.getDOMCellsForRecord(record);
        var content;
        var renderer;

        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                renderer = this.cm.getRendererFor(key);
                if (renderer) {
                    content = renderer(record[key], record);
                } else {
                    content = record[key];
                }
                cells[key].getElement('span').html(content);
            }
        }
    },

    removeDOMForRecord: function (record) {
        var cells = this.getDOMCellsForRecord(record);
        for (var key in cells) {
            if (cells.hasOwnProperty(key)) {
                cells[key].dispose();
            }
        }
    },

    getDOMCellsForRecord: function (record) {
        var ret = {};
        var div, divId;

        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var col = this.$b().find('#ludo-grid-column-' + keys[i] + '-' + this.uniqueId);
            divId = 'cell-' + keys[i] + '-' + record.uid + '-' + this.uniqueId;
            div = col.find('#' + divId);
            if (div) {
                ret[keys[i]] = div;
            }
        }
        return ret;
    },
    /**
     Select a record.
     @function selectRecord
     @param {Object} record
     @memberof ludo.grid.Grid.prototype
     @example
     grid.selectRecord({ id: 100 } );
     */
    selectRecord: function (record) {
        if (ludo.util.isString(record)) {
            record = {id: record};
        }
        this.getDataSource().selectRecord(record);
    },

    cellDoubleClick: function (e) {
        var record = this.getRecordByDOM(e.target);
        if (record) {
            this.getDataSource().selectRecord(record);

            this.fireEvent('dblclick', [record, this.getColumnByDom(e.target)]);
        }
    },

    getRecordByDOM: function (el) {
        el = jQuery(el);
        if (!el.hasClass('ludo-grid-data-cell')) {
            el = el.parent('.ludo-grid-data-cell');
        }
        if (el && el.hasClass('ludo-grid-data-cell')) {
            var uid = el.attr('uid');
            return this.getDataSource().findRecord({uid: uid});
        }
        return undefined;
    },

    isColumnDragActive: function () {
        return this.colMovable && this.colMovable.isActive();
    },

    hideResizeHandles: function () {
        this.colResizeHandler.hideAllHandles();
    },

    showResizeHandles: function () {
        this.colResizeHandler.showAllHandles();
        this.ifStretchHideLastResizeHandles();
    },

    resizeChildren: function () {
        this.parent();
        if (this.colResizeHandler && this.cm.hasLastColumnDynamicWidth()) {
            this.resizeColumns();
        }
    },

    onColumnMove: function (source, target, pos) {

        if (pos == 'before') {
            this.els.dataColumns[source].insertBefore(this.els.dataColumns[target]);
        } else {
            this.els.dataColumns[source].insertAfter(this.els.dataColumns[target]);
        }
        this.cssColumns();
        this.resizeColumns();

    },

    cssColumns: function () {
        var keys = Object.keys(this.els.dataColumns);
        for (var i = 0; i < keys.length; i++) {
            var c = this.els.dataColumns[keys[i]];
            c.removeClass('ludo-grid-data-last-column');
            c.removeClass('ludo-grid-data-last-column-left');
            c.removeClass('ludo-grid-data-column-left');
            c.removeClass('ludo-grid-data-last-column-center');
            c.removeClass('ludo-grid-data-column-center');
            c.removeClass('ludo-grid-data-last-column-right');
            c.removeClass('ludo-grid-data-column-right');
            ludo.dom.addClass(c, this.getColumnCssClass(keys[i]));
        }
    },

    refreshData: function () {
        if (!this.isRendered)return;
        this.createDataColumnElements();
        this.resizeColumns();
        this.populateData();
        this.showResizeHandles();
    },

    JSON: function () {

    },

    addRecord: function (record) {
        this.getDataSource().addRecord(record);
    },

    resizeDOM: function () {
        this.resizeColumns();
        var height = this.getHeight() - ludo.dom.getMBPH(this.$e) - ludo.dom.getMBPH(this.els.body);
        height -= this.sb.h.getHeight();
        if (height < 0) {
            return;
        }
        this.$b().css('height', height - this.gridHeader.getHeight());
        var contentHeight = this.$b().height();

        if (contentHeight == 0) {
            this.resizeDOM.delay(100, this);
            return;
        }
        this.els.dataContainerTop.css('height', contentHeight);

        this.sb.v.resize();
        this.sb.h.resize();
    },

    createScrollbars: function () {
        this.sb.h = this.createDependency('scrollHorizontal', new ludo.Scroller({
            type: 'horizontal',
            applyTo: this.$b(),
            parent: this.$b()
        }));
        this.sb.h.getEl().insertAfter(this.$b());

        this.sb.v = this.createDependency('scrollVertical', new ludo.Scroller({
            type: 'vertical',
            applyTo: this.els.dataContainer,
            parent: this.els.dataContainerTop,
            mouseWheelSizeCls: 'ludo-grid-data-cell'
        }));
        this.getEl().append(this.sb.v.getEl());
        this.positionVerticalScrollbar();
    },

    positionVerticalScrollbar: function () {
        var top = this.gridHeader.getHeight();
        if (top == 0) {
            this.positionVerticalScrollbar.delay(100, this);
            return;
        }
        this.sb.v.getEl().css('top', top);
    },

    sortBy: function (key) {
        this.getDataSource().sortBy(key);
    },

    createColResizeHandles: function () {
        this.colResizeHandler = new ludo.ColResize({
            component: this,
            listeners: {
                startresize: this.setResizePos.bind(this),
                resize: this.resizeColumn.bind(this)
            }
        });
        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var el = this.colResizeHandler.getHandle(keys[i], this.cm.isResizable(keys[i]));
            this.$b().append(el);
            el.addClass('ludo-grid-resize-handle');
        }
    },

    setResizePos: function (column) {
        this.colResizeHandler.setMinPos(this.cm.getMinPosOf(column));
        this.colResizeHandler.setMaxPos(this.cm.getMaxPosOf(column));
        this.mouseoverDisabled = true;
        this.mouseLeavesGrid();
    },

    mouseOverResizeHandle: function (e) {
        jQuery(e.target).addClass('ludo-grid-resize-handle-over');
    },
    mouseOutResizeHandle: function (e) {
        jQuery(e.target).removeClass('ludo-grid-resize-handle-over');
    },

    resizeColumns: function () {
        this.mouseoverDisabled = false;
        var leftPos = 0;

        this.stretchLastColumn();
        var columns = this.cm.getLeafKeys();

        for (var i = 0; i < columns.length; i++) {
            if (this.cm.isHidden(columns[i])) {
                this.colResizeHandler.hideHandle(columns[i]);
            } else {
                var width = this.cm.getWidthOf(columns[i]);
                var bw = ludo.dom.getBW(this.els.dataColumns[columns[i]]) - (i === columns.length - 1) ? 1 : 0;
                this.els.dataColumns[columns[i]].css('left', leftPos);
                this.els.dataColumns[columns[i]].css('width', (width - ludo.dom.getPW(this.els.dataColumns[columns[i]]) - bw));

                this.cm.setLeft(columns[i], leftPos);

                leftPos += width;

                this.colResizeHandler.setPos(columns[i], leftPos);
                if (this.cm.isResizable(columns[i])) {
                    this.colResizeHandler.showHandle(columns[i]);
                } else {
                    this.colResizeHandler.hideHandle(columns[i]);
                }
            }
        }

        var totalWidth = this.cm.getTotalWidth();
        this.els.dataContainerTop.css('width', Math.min(Math.floor(this.$b().width()), totalWidth));
        this.sb.h.setContentSize(totalWidth);

    },

    stretchLastColumn: function () {
        if (this.cm.hasLastColumnDynamicWidth()) {

            this.cm.clearStretchedWidths();

            var totalWidth = this.cm.getTotalWidth();
            var viewSize = this.$b().width();
            var restSize = viewSize - totalWidth;
            if (restSize <= 0) {
                return;
            }
            var width = this.cm.getWidthOf(this.cm.getLastVisible()) + restSize;
            this.cm.setStretchedWidth(width)
        }
    },

    toggleEmptyText: function () {

        if (this.emptyText) {
            this.emptyTextEl().css('display', (!this.currentData || this.currentData.length) > 0 ? 'none' : '');
        }
    },

    populateData: function () {

        this.fireEvent('state');
        this.currentOverRecord = undefined;
        this.currentData = this.getDataSource().getData();


        this.toggleEmptyText();

        var contentHtml = [];
        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var columnId = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
            if (this.cm.isHidden(keys[i])) {
                contentHtml.push('<div id="' + columnId + '" class="ludo-grid-data-column" style="display:none"></div>');
            } else {
                contentHtml.push('<div id="' + columnId + '" col="' + keys[i] + '" class="ludo-grid-data-column ludo-grid-data-column-' + i + ' ' + this.getColumnCssClass(keys[i]) + '">' + this.getHtmlTextForColumn(keys[i]) + '</div>');
            }
        }

        this.els.dataContainer.html(contentHtml.join(''));

        var columns = this.els.dataContainer.find('.ludo-grid-data-column');
        this.els.dataColumns = {};
        var count;
        for (i = 0, count = columns.length; i < count; i++) {

            this.els.dataColumns[jQuery(columns[i]).attr('col')] = jQuery(columns[i]);
        }

        this.fireEvent('renderdata', [this, this]);
        this.resizeColumns();
        this.resizeVerticalScrollbar();
        this.highlightActiveRecord();
    },


    emptyTextEl: function () {
        if (this.els.emptyText === undefined) {
            this.els.emptyText = jQuery('<div class="ludo-grid-empty-text">' + this.emptyText + '</div>');
            this.getEl().append(this.els.emptyText);

        }
        return this.els.emptyText;
    },

    getColumnCssClass: function (col) {
        var ret;
        if (this.cm.isLastVisibleColumn(col)) {
            ret = 'ludo-grid-data-last-column ludo-grid-data-last-column-';
        } else {
            ret = 'ludo-grid-data-column-';
        }
        ret += this.cm.getAlignmentOf(col);
        return ret;
    },

    resizeVerticalScrollbar: function () {
        var column = this.els.dataColumns[this.cm.getLastVisible()];
        if (!column) {
            return;
        }
        var height = column.outerHeight();

        if (height === 0) {
            this.resizeVerticalScrollbar.delay(300, this);
        } else {
            this.els.dataContainer.css('height', height);
            this.sb.v.setContentSize();
        }
    },

    createDataColumnElements: function () {
        this.els.dataColumns = {};
        var keys = this.cm.getLeafKeys();
        for (var i = 0; i < keys.length; i++) {
            var el = jQuery('<div>');
            this.els.dataContainer.append(el);
            el.addClass('ludo-grid-data-column');

            el.attr('col', keys[i]);
            el.addClass(this.getColumnCssClass(i));
            el.id = 'ludo-grid-column-' + keys[i] + '-' + this.uniqueId;
            this.els.dataColumns[keys[i]] = el;
        }
    },

    getHtmlTextForColumn: function (col) {
        var ret = [];
        var rowClasses = ['ludo-grid-data-odd-row', 'ludo-grid-data-even-row'];
        var content;
        var data = this.currentData;
        if (!data)return '';

        var renderer = this.cm.getRendererFor(col);

        var rowRenderer = this.rowManager ? this.rowManager.rowCls : undefined;
        var rowCls = '';
        for (var i = 0, count = data.length; i < count; i++) {
            content = data[i][col];
            if (renderer) {
                content = renderer(content, data[i]);
            }
            var id = ['cell-', col, '-', data[i].uid, '-', this.uniqueId].join('');
            var over = this.mouseOverEffect ? ' onmouseover="ludo.get(\'' + this.id + '\').enterCell(this)"' : '';
            if (rowRenderer) {
                rowCls = rowRenderer(data[i]);
                if (rowCls)rowCls = ' ' + rowCls;
            }
            ret.push('<div id="' + id + '" ' + over + ' col="' + col + '" class="ludo-grid-data-cell ' + (rowClasses[i % 2]) + rowCls + '" uid="' + data[i].uid + '"><span class="ludo-grid-data-cell-text">' + content + '</span></div>');
        }

        return ret.join('');
    },

    resizeColumn: function (col, resizedBy) {
        this.cm.increaseWithFor(col, resizedBy);
    },

    ifStretchHideLastResizeHandles: function () {
        if (this.cm.hasLastColumnDynamicWidth()) {
            this.colResizeHandler.hideHandle(this.cm.getLastVisible());
        }
    },

    scrollBy: function (x, y) {
        if (y) {
            this.sb.v.scrollBy(y);
        }
        if (x) {
            this.sb.h.scrollBy(x);
        }
    },

    getSelectedRecord: function () {
        return this.getDataSource().getSelectedRecord();
    },

    getColumnManager: function () {
        return this.cm;
    }
});/* ../ludojs/src/effect/resize.js */
/***
 * Make View or DOM elements resizable
 * This class is mostly used internally in LudoJS when views are resizable.
 * @class ludo.effect.Resize
 * @namespace ludo.effect
 * @param {Object} config
 * @param {boolean} useShim True to use dotted rectangle when resizing. The view or DOM element will be resized on mouse/ up/touch end.
 * @param {Number} minX minimum x coordinate.
 * @param {Number} minY minimum y coordinate.
 * @param {Number} maxX maximum x coordinate.
 * @param {Number} maxY maximum y coordinate.
 * @param {Number} minWidth Minimum width.
 * @param {Number} maxWidth Maximum width.
 * @param {Number} minHeight Minimum height.
 * @param {Number} maxHeight Maximum height.
 * @param {Boolean} preserveAspectRatio Preserve aspect ratio while resizing.
 * @fires ludo.effect.Resize#start Fired when resizing starts. Param: {String} region
 * @fires ludo.effect.Resize#resize Fired during resize. CSS coordinates(Object with left,top.width,height) are passed as argument with the event.
 * @fires ludo.effect.Resize#stop Fired when resize ends. CSS coordinates(Object with left,top.width,height) are passed as argument with the event
 */
ludo.effect.Resize = new Class({
    Extends:ludo.Core,

    useShim:true,
    component:undefined,
    els:{
        shim:undefined,
        applyTo:undefined,
        handle:{}
    },

    minX:undefined,

    maxX:undefined,

    minWidth:undefined,

    maxWidth:undefined,

    minY:undefined,

    maxY:undefined,

    minHeight:undefined,

    maxHeight:undefined,


    preserveAspectRatio:false,

    aspectRatio:undefined,

    resizeKeys:{
        'e':['width'],
        's':['height'],
        'w':['left', 'width'],
        'n':['top', 'height'],
        'nw':['top', 'left', 'height', 'width'],
        'ne':['top', 'width', 'height'],
        'se':['width', 'height'],
        'sw':['left', 'height', 'width']
    },

    aspectRatioKeys:undefined,

    dragProperties:{
        active:false
    },

    xRegions:[
        ['w', 'nw', 'sw'],
        ['e', 'ne', 'se']
    ],
    yRegions:[
        ['n', 'nw', 'ne'],
        ['s', 'sw', 'se']
    ],

    aspectRatioMinMaxSet:false,

    __construct:function (config) {
        this.__params(config, ['useShim','minX','maxX','minY','maxY','maxWidth','minWidth','minHeight','maxHeight','preserveAspectRatio']);
        if (config.component) {
            this.component = config.component;
            this.els.applyTo = this.component.getEl();
        } else {
            this.els.applyTo = config.applyTo;
        }
        if (config.listeners)this.addEvents(config.listeners);
        this.addDragEvents();
        this.setDisplayPropertyOfEl.delay(100, this);
    },

    setDisplayPropertyOfEl:function () {
        var display = this.getEl().css('display');
        if (display !== 'absolute' && display !== 'relative') {
			if(Browser['ie'] && Browser.version < 9)return;
            this.getEl().css('display', 'relative');
        }
    },

    addDragEvents:function () {
        jQuery(document.body).on(ludo.util.getDragEndEvent(), this.stopResize.bind(this));
        jQuery(document.body).on(ludo.util.getDragMoveEvent(), this.resize.bind(this));
    },

    /**
     * Add resize handle to a region. A region can be
     * nw,n,ne,e,se,s,sw or w.
	 *
	 * A new DOM element will be created for the resize handle and injected into
	 * the resized DOM element.
     *
     * Second parameter cssClass is optional.
     * @function addHandle
     * @param {String} region
     * @param {String} cssClass
     * @return void
     * @memberof ludo.effect.Resize.prototype
     */

    addHandle:function (region, cssClass) {
        var el = this.els.handle[region] = jQuery('<div>');
        el.addClass('ludo-view-resize-el');
        el.addClass(this.getCssFor(region));
        if (cssClass)el.addClass(cssClass);
        el.html('<span></span>');
        el.css('cursor', this.cursor(region) + '-resize');
        el.attr('region', region);
        el.on(ludo.util.getDragStartEvent(), this.startResize.bind(this));
        this.els.applyTo.append(el);
    },

    startResize:function (e) {

        var region = jQuery(e.target).attr('region');

        this.fireEvent('start', region);

		ludo.EffectObject.start();

        var p = ludo.util.pageXY(e);

        this.dragProperties = {
            a:1,
            active:true,
            region:region,
            start:{ x:p.pageX, y:p.pageY },
            current:{x:p.pageX, y:p.pageY },
            el: this.getShimCoordinates(),
            minWidth:this.minWidth,
            maxWidth:this.maxWidth,
            minHeight:this.minHeight,
            maxHeight:this.maxHeight,
            area:this.getScalingFactors(),
            preserveAspectRatio: this.preserveAspectRatio ? this.preserveAspectRatio : e.shift ? true : false
        };
        if (this.preserveAspectRatio || e.shift) {
            this.setMinAndMax();
        }
        this.dragProperties.minX = this.getDragMinX();
        this.dragProperties.maxX = this.getDragMaxX();
        this.dragProperties.minY = this.getDragMinY();
        this.dragProperties.maxY = this.getDragMaxY();

        this.setBodyCursor();
        if (this.useShim) {
            this.showShim();
        }
        return ludo.util.isTabletOrMobile() ? false : undefined;

    },


    setMinAndMax:function () {
        var ratio = this.getAspectRatio();
        var d = this.dragProperties;
        if (ratio === 0)return;
        var minWidth, maxWidth, minHeight, maxHeight;

        if (this.maxWidth !== undefined)maxHeight = this.maxWidth / ratio;
        if (this.minWidth !== undefined)minHeight = this.minWidth / ratio;
        if (this.maxHeight !== undefined)maxWidth = this.maxHeight * ratio;
        if (this.minHeight !== undefined)minWidth = this.minHeight * ratio;

        var coords = this.getEl().offset();
        var absMaxWidth = this.$bWidth() - coords.left;
        var absMaxHeight = this.$bHeight() - coords.top;

        d.minWidth = Math.max(minWidth || 0, this.minWidth || 0);
        d.maxWidth = Math.min(maxWidth || absMaxWidth, this.maxWidth || absMaxWidth);
        d.minHeight = Math.max(minHeight || 0, this.minHeight || 0);
        d.maxHeight = Math.min(maxHeight || absMaxHeight, this.maxHeight || absMaxHeight);

        if (d.maxWidth / ratio > d.maxHeight)d.maxWidth = d.maxHeight * ratio;
        if (d.maxHeight * ratio > d.maxWidth)d.maxHeight = d.maxWidth / ratio;
    },

    getDragMinX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.maxWidth;
        } else if (d.minWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.minWidth;
        }
        if (this.minX !== undefined) {
            if (ret == undefined)ret = this.minX; else ret = Math.max(ret, this.minX);
        }
        return ret;
    },

    getDragMaxX:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.minWidth !== undefined && this.xRegions[0].indexOf(r) >= 0) {
            ret = d.el.left + d.el.width - d.minWidth;
        } else if (d.maxWidth !== undefined && this.xRegions[1].indexOf(r) >= 0) {
            ret = d.el.left + d.maxWidth;
        }
        if (this.maxX !== undefined) {
            if (ret == undefined)ret = this.maxX; else ret = Math.min(ret, this.maxX);
        }
        return ret;
    },

    getDragMinY:function () {
        var ret, d = this.dragProperties, r = d.region;
        if (d.maxHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.maxHeight;
        } else if (d.minHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.minHeight;
        }
        if (this.minY !== undefined) {
            if (ret == undefined)ret = this.minY; else ret = Math.max(ret, this.minY);
        }
        return ret;
    },

    getDragMaxY:function () {

        var ret, d = this.dragProperties, r = d.region;
        if (d.minHeight !== undefined && this.yRegions[0].indexOf(r) >= 0) {
            ret = d.el.top + d.el.height - d.minHeight;
        } else if (d.maxHeight !== undefined && this.yRegions[1].indexOf(r) >= 0) {
            ret = d.el.top + d.maxHeight;
        }
        if (this.maxY !== undefined) {
            if (ret == undefined)ret = this.maxY; else ret = Math.min(ret, this.maxY);
        }
        return ret;
    },

    cursor:function(region){
        var r = region;
        if(r == 'n' || r == 's')r = 'ns';
        if(r == 'w' || r == 'e')r = 'we';
        if(r == 'se' ||r == 'nw')r = 'nwse';
        if(r == 'ne' ||r == 'sw')r = 'nesw';
        return r;
    },

    setBodyCursor:function () {

        jQuery(document.body).css('cursor', this.cursor(this.dragProperties.region) + '-resize');
    },

    revertBodyCursor:function () {
        jQuery(document.body).css('cursor', 'default');
    },

    resize:function (e) {
        if (this.dragProperties.active) {
            this.dragProperties.current = this.getCurrentCoordinates(e);
            var coordinates = this.getCoordinates();

            this.fireEvent('resize', coordinates);

            if (this.useShim) {
                this.els.shim.css(coordinates);
            } else {
                this.getEl().css(coordinates);
            }
        }
    },

    getCurrentCoordinates:function (e) {
        var p = ludo.util.pageXY(e);
        var ret = {x:p.pageX, y:p.pageY };
        var d = this.dragProperties;
        if(d.preserveAspectRatio && d.region.length === 2)return ret;
        if (d.minX !== undefined && ret.x < d.minX)ret.x = d.minX;
        if (d.maxX !== undefined && ret.x > d.maxX)ret.x = d.maxX;
        if (d.minY !== undefined && ret.y < d.minY)ret.y = d.minY;
        if (d.maxY !== undefined && ret.y > d.maxY)ret.y = d.maxY;
        return ret;
    },


    getCoordinates:function () {
        var d = this.dragProperties;
        var keys = this.resizeKeys[d.region];
        var ret = {};

        if (!d.preserveAspectRatio || d.region.length === 1) {
            for (var i = 0; i < keys.length; i++) {
                ret[keys[i]] = this.getCoordinate(keys[i]);
            }
        }

        if (d.preserveAspectRatio) {
            switch (d.region) {
                case 'e':
                case 'w':
                    ret.height = ret.width / this.aspectRatio;
                    break;
                case 'n':
                case 's':
                    ret.width = ret.height * this.aspectRatio;
                    break;
                default:
                    var scaleFactor = this.getScaleFactor();
                    ret.width = d.el.width * scaleFactor;
                    ret.height = d.el.height * scaleFactor;
                    if(d.region == 'ne' || d.region =='nw'){
                        ret.top = d.el.top + d.el.height - ret.height;
                    }
                    if(d.region == 'nw' || d.region == 'sw'){
                        ret.left = d.el.left + d.el.width - ret.width;
                    }
                    ret.width += this.getBWOfShim();
                    ret.height += this.getBHOfShim();
                    break;
            }
        }
        return ret;
    },

    getScaleFactor:function () {
        var d = this.dragProperties;
        var r = d.region;
        var factor;

        var offsetX = (d.current.x - d.start.x) * d.area.xFactor / d.area.sum;
        var offsetY = (d.current.y - d.start.y) * d.area.yFactor / d.area.sum;
        switch (r) {
            case 'se':
                factor = 1 + offsetX + offsetY;
                break;
            case 'ne':
                factor = 1 + offsetX + offsetY * -1;
                break;
            case 'nw':
                factor = 1 + offsetX * -1 + offsetY * -1;
                break;
            case 'sw':
                factor = 1 + offsetX * -1 + offsetY;
                break;


        }
        if (d.minWidth) {
            factor = Math.max(factor, d.minWidth / d.el.width);
        }
        if (d.minHeight) {
            factor = Math.max(factor, d.minHeight / d.el.height);
        }
        if (d.maxWidth) {
            factor = Math.min(factor, d.maxWidth / d.el.width);
        }
        if (d.maxHeight) {
            factor = Math.min(factor, d.maxHeight / d.el.height);
        }
        return factor;

    },

    getCoordinate:function (key) {
        var r = this.dragProperties.region;
        var d = this.dragProperties;
        switch (key) {
            case 'width':
                if (r == 'e' || r == 'ne' || r == 'se') {
                    return d.el.width - d.start.x + d.current.x + this.getBWOfShim();
                } else {
                    return d.el.width + d.start.x - d.current.x + this.getBWOfShim();
                }
                break;
            case 'height':
                if (r == 's' || r == 'sw' || r == 'se') {
                    return d.el.height - d.start.y + d.current.y + this.getBHOfShim();
                } else {
                    return d.el.height + d.start.y - d.current.y + this.getBHOfShim();
                }
            case 'top':
                if (r == 'n' || r == 'nw' || r == 'ne') {
                    return d.el.top - d.start.y + d.current.y;
                } else {
                    return d.el.top + d.start.y - d.current.y;
                }
            case 'left':
                if (r == 'w' || r == 'nw' || r == 'sw') {
                    return d.el.left - d.start.x + d.current.x;
                } else {
                    return d.el.left + d.start.x - d.current.x;
                }
        }
        return undefined;
    },

    getBWOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBW(this.getShim());
        }
        return 0;
    },

    getBHOfShim:function () {
        if (this.useShim) {
            return ludo.dom.getBH(this.getShim());
        }
        return 0;
    },

    stopResize:function () {
        if (this.dragProperties.active) {
            this.dragProperties.active = false;

            this.fireEvent('stop', this.getCoordinates());
			ludo.EffectObject.end();
            this.revertBodyCursor();
            if (this.useShim) {
                this.hideShim();
            }
        }
    },

    getCssFor:function (region) {
        return 'ludo-view-resize-region-' + region;
    },

    showShim:function () {
        var shim = this.getShim();
        var coords = this.getShimCoordinates();
        shim.css({
            display:'',
            left:coords.left,
            top:coords.top,
            width:coords.width,
            height:coords.height
        });
    },

    hideShim:function () {
        this.getShim().css('display', 'none');
    },

    getShimCoordinates:function () {
        var el = this.getEl();
        var coords = el.offset();
        coords.width = el.outerWidth();
        coords.height = el.outerHeight();

        if (this.useShim) {
            var shim = this.getShim();
            coords.width -= ludo.dom.getBW(shim);
            coords.height -= ludo.dom.getBH(shim);
        }
        return coords;
    },

    getShim:function () {
        if (!this.els.shim) {
            var el = this.els.shim = jQuery('<div>');
            el.addClass('ludo-shim-resize');
            el.css({
                position:'absolute',
                'z-index':50000
            });
            jQuery(document.body).append(el);
        }

        return this.els.shim;
    },
    getEl:function () {
        return this.els.applyTo;
    },

    hideAllHandles:function () {
        this.setHandleDisplay('none');
    },
    showAllHandles:function () {
        this.setHandleDisplay('');
    },

    setHandleDisplay:function (display) {
        for (var key in this.els.handle) {
            if (this.els.handle.hasOwnProperty(key)) {
                this.els.handle[key].css('display', display);
            }
        }
    },

    getAspectRatio:function () {
        if (this.aspectRatio === undefined) {
            this.aspectRatio = this.getEl().width() / this.getEl().height();
        }
        return this.aspectRatio;
    },

    $bWidth:function () {
        return jQuery(document.documentElement).width();
    },
    $bHeight:function () {
        return jQuery(document.documentElement).height();
    },

    getScalingFactors:function () {
        var size = { x: this.getEl().width(), y: this.getEl().height() };
        return {
            xFactor:size.x / size.y,
            yFactor:size.y / size.x,
            sum:size.x + size.y
        };
    }
});/* ../ludojs/src/view/button-bar.js */
/**
 * Class used to create button bars at bottom of components.
 */
ludo.view.ButtonBar = new Class({
    Extends:ludo.View,
    type : 'ButtonBar',
    layout:{
        type:'linear',
		orientation:'horizontal',
		width:'matchParent',
        height:'matchParent'
    },
    elCss:{
        height:'100%'
    },
    align:'right',
    cls:'ludo-view-button-container',
    overflow:'hidden',
    component:undefined,
	buttonBarCss:undefined,

    __construct:function (config) {

        this.__params(config, ['align','component','buttonBarCss']);
        config.children = this.getValidChildren(config.children);
        if (this.align == 'right' || config.align == 'center') {
            config.children = this.getItemsWithSpacer(config.children);
            if(config.align == 'center'){
                config.children.push(this.emptyChild());
            }
        }else{
            config.children[0].elCss = config.children[0].elCss || {};
            if(!config.children[0].elCss['margin-left']){
                config.children[0].elCss['margin-left'] = 2
            }
        }

        this.parent(config);
    },
    ludoDOM:function () {
        this.parent();
        this.$b().addClass('ludo-content-buttons');
    },

    __rendered:function () {
        this.parent();
		this.component.addEvent('resize', this.resizeRenderer.bind(this));

		if(this.buttonBarCss){
			this.getEl().parent().css(this.buttonBarCss);
		}
    },

	resizeRenderer:function(){
		this.getLayout().getRenderer().resize();
	},

    getValidChildren:function (children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].value && !children[i].type) {
                children[i].type = 'form.Button'
            }
        }
        return children;
    },

    getButtons:function () {
        var ret = [];
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].isButton && this.children[i].isButton()) {
                ret.push(this.children[i]);
            }
        }
        return ret;
    },

    getButton:function (key) {
        var c = this.children;
        for (var i = 0; i < c.length; i++) {
            if(c[i].id == key || c[i].name == key || (c[i].val && c[i].val().toLowerCase() == key.toLowerCase())){
                return c[i];
            }
        }
		return undefined;
    },

    getItemsWithSpacer:function (children) {
        children.splice(0, 0, this.emptyChild());

        return children;
    },

    emptyChild:function(){
        return {
            layout: { weight:1 },
            elCss:{ 'background-color':'transparent' },
            css:{ 'background-color':'transparent'}
        };
    },
    /**
     * Returns the component where the button bar is placed
	 * @function getView
     * @return {Object} ludo Component
     * @private
     */
    getView_250_40 : function(){
        return this.component;
    }
});/* ../ludojs/src/view/title-bar.js */
// TODO support all kinds of buttons - customizable
ludo.view.TitleBar = new Class({
    Extends:ludo.Core,
    view:undefined,
    els:{
        el:undefined,
        icon:undefined,
        title:undefined,
        buttons:{},
        buttonArray:[]
    },

    toggleStatus:{},

    __construct:function (config) {
        this.parent(config);

        this.__params(config, ['view', 'buttons']);

        if (!this.buttons)this.buttons = this.getDefaultButtons();

        this.view.on('setTitle', this.setTitle.bind(this));
        this.view.on('resize', this.resizeDOM.bind(this));
        this.createDOM();
        this.setSizeOfButtonContainer();
    },

    getDefaultButtons:function () {
        var ret = [];
        var v = this.view;
        if (v.minimizable)ret.push('minimize');
        if (v.closable)ret.push('close');
        return ret;
    },

    createDOM:function () {
        var el = this.els.el = jQuery('<div>');
        el.addClass(this.view.boldTitle ? 'ludo-framed-view-titlebar' : 'ludo-view-titlebar');
        var left = 0;
        if (this.view.icon) {
            this.createIconDOM();
            left += el.width();
        }
        this.createTitleDOM();
        el.append(this.getButtonContainer());
        this.resizeButtonContainer.delay(20, this);
        this.els.title.css('left', left);
        el.on('selectstart', ludo.util.cancelEvent);
    },

    createIconDOM:function () {
        this.els.icon = ludo.dom.create({
            renderTo:this.els.el,
            cls:'ludo-framed-view-titlebar-icon',
            css:{ 'backgroundImage':'url(' + this.view.icon + ')'}
        });
    },

    setTitle:function (title) {
        this.els.title.html(title);
    },

    createTitleDOM:function () {

        this.els.title = jQuery('<div class="ludo-framed-view-titlebar-title"></div>');
        this.els.el.append(this.els.title);

        this.setTitle(this.view.title);
    },

    cancelTextSelection:function () {
        return false;
    },

    getButtonContainer:function () {
        var el = this.els.controls = jQuery('<div class="ludo-title-bar-button-container"></div>');
        el.css('cursor', 'pointer');

        this.createEdge('left', el);
        this.createEdge('right', el);

        for (var i = 0; i < this.buttons.length; i++) {
            el.append(this.getButtonDOM(this.buttons[i]));
        }

        this.addBorderToButtons();
        return el;
    },

    createEdge:function (pos, parent) {
        var el = jQuery('<div class="ludo-title-bar-button-container-' + pos + '-edge"></div>');
        parent.append(el);

        el.attr("style", 'position:absolute;z-index:1;' + pos + ':0;top:0;width:55%;height:100%;background-repeat:no-repeat;background-position:top ' + pos);
        return el;

    },

    resizeButtonContainer:function () {
        this.els.controls.css('width', this.getWidthOfButtons());
    },

    button:function(name){
        return this.els.buttons[name];
    },

    getButtonDOM:function (buttonConfig) {
        buttonConfig = ludo.util.isString(buttonConfig) ? { type:buttonConfig } : buttonConfig;

        var b = this.els.buttons[buttonConfig.type] = jQuery('<div>');
        b.id = 'b-' + String.uniqueID();
        b.attr("class", 'ludo-title-bar-button ludo-title-bar-button-' + buttonConfig.type);

        b.on("click", this.getButtonClickFn(buttonConfig.type));
        if(buttonConfig.listener){
            b.on('click', buttonConfig.listener.bind(this));
        }
        b.mouseenter(this.enterButton.bind(this));
        b.mouseleave(this.leaveButton.bind(this));

        b.attr('title', buttonConfig.title ? buttonConfig.title : buttonConfig.type.capitalize());
        b.attr('buttonType', buttonConfig.type);

        if(buttonConfig.icon){
            b.css('background-image', 'url('+ buttonConfig.icon + ')');
        }

        this.els.buttonArray.push(b);
        return b;
    },


    getButtonClickFn:function (type) {
        var buttonConfig = ludo.view.getTitleBarButton(type);
        var toggle = buttonConfig && buttonConfig.toggle ? buttonConfig.toggle : undefined;

        return function (e) {
            this.leaveButton(e);
            var el = jQuery(e.target);
            var event = type;

            if (toggle) {
                if (this.toggleStatus[type]) {
                    event = this.toggleStatus[type];
                    ludo.dom.removeClass(e.target, 'ludo-title-bar-button-' + event);
                    event = this.getNextToggle(toggle, event);

                }
                el.removeClass('ludo-title-bar-button-' + event);
                this.toggleStatus[type] = event;
                el.addClass('ludo-title-bar-button-' + this.getNextToggle(toggle, event));
            }
            this.fireEvent(event);
        }.bind(this);
    },

    getNextToggle:function (toggle, current) {
        var ind = toggle.indexOf(current) + 1;
        return toggle[ind >= toggle.length ? 0 : ind];
    },

    addBorderToButtons:function () {
        var firstFound = false;
        for (var i = 0; i < this.els.buttonArray.length; i++) {
            this.els.buttonArray[i].removeClass('ludo-title-bar-button-with-border');
            if (firstFound)this.els.buttonArray[i].addClass('ludo-title-bar-button-with-border');
            firstFound = true;
        }
    },

    enterButton:function (e) {
        var el = jQuery(e.target);
        var type = el.attr('buttonType');
        el.addClass('ludo-title-bar-button-' + type + '-over');
    },

    leaveButton:function (e) {
        var el = jQuery(e.target);
        el.removeClass('ludo-title-bar-button-' + el.attr('buttonType') + '-over');
    },

    getWidthOfButtons:function () {
        var ret = 0;
        var els = this.els.buttonArray;
        for (var i = 0, count = els.length; i < count; i++) {
            var width = els[i].outerWidth();
            if (width) {
                ret += width;
            } else {
                ret += els[i].width();
            }
        }
        return ret ? ret : els.length * 10;
    },

    getEl:function () {
        return this.els.el;
    },

    setSizeOfButtonContainer:function () {
        if (this.els.controls) {
            var width = this.getWidthOfButtons();
            this.els.controls.css('width',  width + 'px');
            this.els.controls.css('display',  width > 0 ? '' : 'none');
        }
        if (this.icon) {
            this.els.title.css('left', jQuery(this.els.icon).css('width'));
        }
    },

    getWidthOfIconAndButtons:function () {
        var ret = this.view.icon ? this.els.icon.width() : 0;
        return ret + this.els.controls.width();
    },

    resizeDOM:function () {
        var width = (this.view.width - this.getWidthOfIconAndButtons());
        if (width > 0)this.els.title.css('width', width);
    },

    height:undefined,
    getHeight:function () {
        if (this.height === undefined) {
            this.height = this.els.el.outerHeight();
        }
        return this.height;
    }
});

ludo.view.registerTitleBarButton = function (name, config) {
    ludo.registry.set('titleBar-' + name, config);
};

ludo.view.getTitleBarButton = function (name) {
    return ludo.registry.get('titleBar-' + name);
};

ludo.view.registerTitleBarButton('minimize', {
    toggle:['minimize', 'maximize']
});/* ../ludojs/src/framed-view.js */
/**
 * Displays a View with a title bar and support for a bottom button bar .
 * @parent ludo.View
 * @class ludo.FramedView
 * @extends ludo.View
 * @param {Object} config
 * @param {String} config.title Title for the title bar
 * @param {String} config.icon Path to icon to be placed in top left corner of title bar, default:undefined
 * @param {Boolean} config.minimizable True to add minimize button to the title bar.
 * @param {Boolean} config.minimized True to render the view minimized.
 * @param {Object} config.buttonBar Optional button bar configuration. The button bar is div at the bottom of the view where child views(example buttons) are rendered in a linear horizontal layout.
 * Alignment of button can be set using config.buttonBar.align(left, center or right).<br> Example: <br><code>buttonBar: { align:'left', children:[ {type:'ludo.form.Button', value: 'OK' }]}. </code>.<br>Default alignment is "right"
 * @fires ludo.FramedView#minimize Fired on mimimize. Argument: ludo.FramedView
 * @fires ludo.FramedView#maximize Fired on maximize
 */
ludo.FramedView = new Class({
	Extends:ludo.View,
	type:'FramedView',
	layout:{
		minWidth:100,
		minHeight:100
	},

	minimized:false,
	title:'',
	movable:false,
	minimizable:false,
	resizable:false,
	closable:false,

	width:null,
	height:200,

	preserveAspectRatio:false,
	icon:undefined,

	/**
	 Config object for the title bar
	 @config titleBar
	 @type {Object}
	 @default undefined
	 @memberof ludo.FramedView.prototype
	 @example
	 	new ludo.Window({
	 		titleBar:{
				buttons: [{
					type : 'reload',
					title : 'Reload grid data'
				},'minimize','close'],
				listeners:{
					'reload' : function(){
						ludo.get('myDataSource').load();
					}
				}
			}
	 	});

	 You can create your own buttons by creating the following css classes:
	 @example
		 .ludo-title-bar-button-minimize {
			 background-image: url('../images/title-bar-btn-minimize.png');
		 }

		 .ludo-title-bar-button-minimize-over {
			 background-image: url('../images/title-bar-btn-minimize-over.png');
		 }

	 Replace "minimize" with the unique name of your button.

	 If you want to create a toggle button like minimize/maximize, you can do that with this code:

	 @example
		 ludo.view.registerTitleBarButton('minimize',{
			toggle:['minimize','maximize']
		 });
	 */
	titleBar:undefined,
	titleBarHidden:false,
	boldTitle:true,
	hasMenu:false,
	buttons:[],
	buttonBar:undefined,

	menuConfig:null,
	menuObj:null,

	state:{
		isMinimized:false
	},

	__construct:function (config) {
		this.parent(config);
        if (config.buttons) {
            config.buttonBar = {
                children:config.buttons
            }
        }

        this.__params(config,['buttonBar', 'hasMenu','menuConfig','icon','titleBarHidden','titleBar','buttons','boldTitle','minimized']);

	},

	/**
	 * Return config of title bar using a method instead of config object. Useful when you need to refer to "this"
	 * @function getTitleBarConfig
	 * @return {Object|undefined}
	 * @memberof ludo.FramedView.prototype
	 */
	getTitleBarConfig:function(){
		return undefined;
	},

	/**
	 * Return button bar config using a method instead of using buttonBar config object. Useful when you need to refer to
	 * "this"
	 * @function getButtonBarConfig
	 * @return {Object|undefined}
	 * @memberof ludo.FramedView.prototype
	 */
	getButtonBarConfig:function(){
		return undefined;
	},

	ludoDOM:function () {
		this.parent();

		this.$e.addClass('ludo-framed-view');

		if(this.hasTitleBar()){
			this.getTitleBar().getEl().insertBefore(this.$b());
		}
		this.$b().addClass('ludo-framed-view-body');

		if (!this.getParent() && this.isResizable()) {
			this.getResizer().addHandle('s');
		}
	},


	__rendered:function () {
        // TODO create button bar after view is rendered.


		if(!this.buttonBar)this.buttonBar = this.getButtonBarConfig();
		if (this.buttonBar && !this.buttonBar.children) {
			this.buttonBar = { children:this.buttonBar };
		}

        if (this.buttonBar) {
            this.getButtonBar()
        } else {
			this.$e.addClass('ludo-view-no-buttonbar')
        }
		this.parent();
		if (this.minimized) {
			this.minimize();
		}
	},

	resizer:undefined,
	getResizer:function () {
		if (this.resizer === undefined) {
			var r = this.getLayout().getRenderer();
			this.resizer = this.createDependency('resizer', new ludo.effect.Resize({
				component:this,
				preserveAspectRatio:this.layout.preserveAspectRatio,
				minWidth:r.getMinWidth(),
				minHeight:r.getMinHeight(),
				maxHeight:r.getMaxHeight(),
				maxWidth:r.getMaxWidth(),
				listeners:{
					stop:r.setSize.bind(r)
				}
			}));
			this.resizer.addEvent('stop', this.saveState.bind(this));
		}
		return this.resizer;
	},

	resizeDOM:function () {
		var height = this.getHeight();
		height -= (ludo.dom.getMBPH(this.$e) + ludo.dom.getMBPH(this.els.body) +  this.getHeightOfTitleAndButtonBar());

        if(height >= 0){
            this.els.body.css('height', height);
            if (this.buttonBarComponent) {
                this.buttonBarComponent.resize();
            }
        }
	},

	heightOfTitleAndButtonBar:undefined,
	getHeightOfTitleAndButtonBar:function () {
		if (this.isHidden())return 0;
		if (!this.heightOfTitleAndButtonBar) {
			this.heightOfTitleAndButtonBar = this.getHeightOfTitleBar() + this.getHeightOfButtonBar();
		}
		return this.heightOfTitleAndButtonBar;
	},

	getHeightOfButtonBar:function () {
		if (!this.buttonBar)return 0;
        return this.els.buttonBar.el.outerHeight();
	},

	getHeightOfTitleBar:function () {
		if (!this.hasTitleBar())return 0;
		return this.titleBarObj.getHeight();
	},

	hasTitleBar:function(){
		return !this.titleBarHidden;
	},

	titleBarButton:function(name){
		return this.getTitleBar().button(name);
	},

	getTitleBar:function(){
		if (this.titleBarObj === undefined) {

			if(!this.titleBar)this.titleBar = this.getTitleBarConfig() || {};
			this.titleBar.view = this;
			this.titleBar.type = 'view.TitleBar';
			this.titleBarObj = this.createDependency('titleBar', this.titleBar);

			this.titleBarObj.addEvents({
				close:this.close.bind(this),
				minimize:this.minimize.bind(this),
				maximize:this.maximize.bind(this),
				collapse:this.hide.bind(this)
			});

			if (this.movable && !this.getParent()) {
				this.drag = this.createDependency('drag', new ludo.effect.Drag({
					handle:this.titleBarObj.getEl(),
					el:this.getEl(),
					listeners:{
						start:this.increaseZIndex.bind(this),
						end:this.stopMove.bind(this)
					}
				}));
				this.titleBarObj.getEl().css('cursor', 'move');
			}
		}
		return this.titleBarObj;
	},

	getHeight:function () {
        return this.isMinimized() ? this.getHeightOfTitleBar() : this.parent();
	},

	close:function () {
		this.hide();
		this.fireEvent('close', this);
	},

	isMinimized:function () {
		return this.state.isMinimized;
	},

	/**
	 * Maximize component
	 * @function maximize
	 * @return void
	 * @memberof ludo.FramedView.prototype
	 */
	maximize:function () {
        this.state.isMinimized = false;
        if (!this.hidden) {
            this.resize({
                height:this.layout.height
            });
            this.els.body.css('visibility', 'visible');
            this.showResizeHandles();
            this.fireEvent('maximize', this);
        }
	},

	showResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().showAllHandles();
		}
	},

	hideResizeHandles:function () {
		if (this.isResizable()) {
			this.getResizer().hideAllHandles();
		}
	},

	/**
	 * Minimize component
	 * @function minimize
	 * @return void
	 * @memberof ludo.FramedView.prototype
	 */
	minimize:function () {
        this.state.isMinimized = true;
		if (!this.hidden) {
            var height = this.layout.height;
            var newHeight = this.getHeightOfTitleBar();
            this.$e.css('height', this.getHeightOfTitleBar());
            this.els.body.css('visibility', 'hidden');
            this.hideResizeHandles();

            this.layout.height = height;

            this.fireEvent('minimize', [this, { height: newHeight }]);
        }
	},

	getHtml:function () {
		return this.els.body.html();
	},

	getButtonBar:function () {
		if (!this.els.buttonBar) {
			this.els.buttonBar = this.els.buttonBar || {};

			var el = this.els.buttonBar.el = jQuery('<div class="ludo-view-buttonbar"></div>');
			this.$e.append(el);

			this.getEl().addClass('ludo-view-with-buttonbar');
			this.buttonBar.renderTo = el;
			this.buttonBar.component = this;
			this.buttonBarComponent = this.createDependency('buttonBar', new ludo.view.ButtonBar(this.buttonBar));
		}
		return this.els.buttonBar.el;
	},

	getButton:function (key) {
		return this.getButtonByKey(key);
	},
	/**
	 * Hide a button on the button bar
	 * @function hideButton
	 * @param id of button
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	hideButton:function (id) {
        return this.buttonEffect(id, 'hide');
	},
	/**
	 * Show a button on the button bar
	 * @function showButton
	 * @param id of button
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	showButton:function (id) {
        return this.buttonEffect(id, 'show');
	},

	getButtons:function () {
        return this.buttonBarComponent ? this.buttonBarComponent.getButtons() : [];
	},
	/**
	 * Disable a button on the button bar
	 * @function disableButton
	 * @param id
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	disableButton:function (id) {
        return this.buttonEffect(id, 'disable');
	},
	/**
	 * Enable a button on the button bar
	 * @function enableButton
	 * @param id
	 * @return {Boolean} success
	 * @memberof ludo.FramedView.prototype
	 */
	enableButton:function (id) {
        return this.buttonEffect(id, 'enable');
	},

    buttonEffect:function(id,effect){
        var button = this.getButtonByKey(id);
        if (button) {
            button[effect]();
            return true;
        }
        return false;
    },

	getButtonByKey:function (key) {
		if (this.buttonBarComponent) {
			return this.buttonBarComponent.getButton(key);
		}
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].getId() === key || this.buttons[i].val() == key || this.buttons[i].getName() == key) {
				return this.buttons[i];
			}
		}
		return null;
	},
	/**
	 * Is component resizable
	 * @function isResizable
	 * @return {Boolean}
	 * @memberof ludo.FramedView.prototype
	 */
	isResizable:function () {
		return this.resizable;
	},
	stopMove:function (el, drag) {
		this.getLayout().getRenderer().setPosition(drag.getX(), drag.getY());

		this.fireEvent('stopmove', this);
	}
});/* ../ludojs/src/window.js */
/**
 * Displays a movable View with Title Bar.
 * @parent ludo.FramedView
 * @class ludo.Window
 * @param {Object} config
 * @param {Boolean} config.resizable true to make the window resizable, default = true
 * @param {Boolean} config.movable true to make the window movable, default = true
 * @param {Boolean} config.hideBodyOnMove true to display a dotted rectangle when moving the window. The window will be positioned on mouse up.
 * @param {Boolean} config.resizeLeft true make the window resizable from left edge, default = true
 * @param {Boolean} config.resizeTop true make the window resizable from top edge, default = true.
 * @param {Boolean} config.resizeRight true make the window resizable from right edge, default = true.
 * @param {Boolean} config.resizeBottom true make the window resizable from bottom edge, default = true.
 * @param {Boolean} config.preserveAspectRatio Preserve aspect ratio(width/height) when resizing.
 * @param {Boolean} config.closable True to make the window closable. This will add a close button to the title bar.
 * @param {Boolean} config.minimizable True to make the window minimizable. This will add a minimize button to the title bar.
 * @param {Number} config.layout.minWidth Optional minimum width of window in pixels.
 * @param {Number} config.layout.minHeight Optional minimum height of window in pixels.
 * @param {Number} config.layout.maxWidth Optional maximum width of window in pixels.
 * @param {Number} config.layout.maxHeight Optional maximum height of window in pixels.
 * @summary new ludo.Window({ ... });
 *
 * @example
 * new ludo.Window({
 *	   layout:{
 *	        type:'linear', orientation:'horizontal',
 *          width:500,height:500,
 *	        left:100,top:100
 *
 *	   },
 *	   children:[
 *	   {
 *		   	layout:{
 *		   		weight:1
 *			},
 *		   html : 'Panel 1'
 *	   },{
 *		   	layout:{
 *		   		weight:1
 *			},
 *		   	html: 'Panel 2'
 *	   }]
 *	});
 */
ludo.Window = new Class({
    Extends: ludo.FramedView,
    type: 'Window',
    cssSignature: 'ludo-window',
    movable: true,
    resizable: true,
    closable: true,
    top: undefined,
    left: undefined,
    width: 300,
    height: 200,
    resizeTop: true,
    resizeLeft: true,
    hideBodyOnMove: false,
    preserveAspectRatio: false,
    statefulProperties: ['layout'],

    __construct: function (config) {
        config = config || {};
        config.renderTo = document.body;
        var keys = ['resizeTop', 'resizeLeft', 'hideBodyOnMove', 'preserveAspectRatio'];
        this.__params(config, keys);

        this.parent(config);
    },

    ludoEvents: function () {
        this.parent();
        if (this.hideBodyOnMove) {
            this.addEvent('startmove', this.hideBody.bind(this));
            this.addEvent('stopmove', this.showBody.bind(this));
        }
        this.addEvent('stopmove', this.saveState.bind(this));
    },

    hideBody: function () {
        this.$b().css('display', 'none');
        if (this.els.buttonBar)this.els.buttonBar.el.css('display', 'none');
    },

    showBody: function () {
        this.$b().css('display', '');
        if (this.els.buttonBar)this.els.buttonBar.el.css('display', '');
    },

    __rendered: function () {
        this.parent();
        this.getEl().addClass('ludo-window');
        this.focusFirstFormField();
        this.fireEvent('activate', this);
    },

    ludoDOM: function () {
        this.parent();
        if (this.isResizable()) {
            var r = this.getResizer();
            if (this.resizeTop) {
                if (this.resizeLeft) {
                    r.addHandle('nw');
                }
                r.addHandle('n');
                r.addHandle('ne');
            }

            if (this.resizeLeft) {
                r.addHandle('w');
                r.addHandle('sw');
            }
            r.addHandle('e');
            r.addHandle('se');
        }
    },

    show: function () {
        this.parent();
        this.focusFirstFormField();
    },

    focusFirstFormField: function () {
        var els = this.$b().children('input');
        for (var i = 0, count = els.length; i < count; i++) {
            if (els[i].type && els[i].type.toLowerCase() === 'text') {
                els[i].focus();
                return;
            }
        }
        var el = this.$b().find('textarea');
        if (el) {
            el.focus();
        }
    },

    isUsingShimForResize: function () {
        return true;
    },
    /**
     * Show window at x and y position
     * @function showAt
     * @param {Number} x
     * @param {Number} y
     * @return void
     * @memberof ludo.Window.prototype
     */
    showAt: function (x, y) {
        this.setXY(x, y);
        this.show();
    },

    setXY: function (x, y) {
        this.layout.left = x;
        this.layout.top = y;
        var r = this.getLayout().getRenderer();
        r.clearFn();
        r.resize();
    },

    center: function () {
        var b = jQuery(document.body);
        var bodySize = {x: b.width(), y: b.height()};
        var x = Math.round((bodySize.x / 2) - (this.getWidth() / 2));
        var y = Math.round((bodySize.y / 2) - (this.getHeight() / 2));
        this.setXY(x, Math.max(0, y));
    },

    /**
     * Show window centered on screen
     * @function showCentered
     * @memberof ludo.Window.prototype
     * @return void
     */
    showCentered: function () {
        this.center();
        this.show();
    },

    isWindow: function () {
        return true;
    }
});/* ../ludojs/src/dialog/dialog.js */
/**
 * @namespace ludo.dialog
 */
/**
 * Basic dialog class and base class for all other dialogs. This class extends
 * <a href="ludo.Window.html">ludo.Window</a>.
 * @class ludo.dialog.Dialog
 * @param {object} config
 * @param {Boolean} config.modal True to make the window modal, default: true
 * @param {Boolean} config.autoRemove True to destroy the dialog on close. Will remove the dialog from the DOM. Default: true
 * @param {String} config.buttonConfig Camel case string config for buttons. example: YesNoCancel for three buttons labeled "Yes", "No" and "Cancel"
 * @param {Boolean} config.autoHideOnBtnClick. True to automatically hide the dialog on click on one of the buttons.
 * @fires ludo.dialog.Dialog#buttonName buttonName will be the lowercase value of the button without spaces. Example: Button "Yes" will fire a "yes" event.
 * @augments ludo.Window
 * @example
 new ludo.dialog.Dialog({
              html : 'Do you want to save your work?',
               buttonConfig : 'YesNoCancel'
               listeners : {
                   'yes' : function(){ this.saveWork() },
                   'no' : function() { this.discardWork() }
               }
          });

 */
ludo.dialog.Dialog = new Class({
	Extends:ludo.Window,
	type:'dialog.Dialog',
	modal:true,
	autoRemove:true,
	autoHideOnBtnClick:true,
	buttonConfig:undefined,
	movable:true,
	closable:false,
	minimizable:false,

	__construct:function (config) {
		// TODO use buttons instead of buttonConfig and check for string
		config.buttonConfig = config.buttonConfig || this.buttonConfig;
		if (config.buttonConfig) {
			var buttons = config.buttonConfig.replace(/([A-Z])/g, ' $1');
			buttons = buttons.trim();
			buttons = buttons.split(/\s/g);
			config.buttons = [];
			for (var i = 0; i < buttons.length; i++) {
				config.buttons.push({
					value:buttons[i]
				});
			}
		}
		this.parent(config);
	
        this.__params(config, ['modal','autoRemove','autoHideOnBtnClick']);
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-dialog');
	},

    getShim:function(){
        if(this.els.shim === undefined){
            var el = this.els.shim = jQuery('<div>');
			jQuery(document.body).append(el);
			el.addClass('ludo-dialog-shim');
            el.css('display', 'none');
        }
        return this.els.shim;
    },

	ludoEvents:function () {
		this.parent();
		if (this.isModal()) {
			this.getEventEl().on('resize', this.resizeShim.bind(this));
		}
	},

	__rendered:function () {
		this.parent();
		if (!this.isHidden()) {
			this.showShim();
		}
		var buttons = this.getButtons();

		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEvent('click', this.buttonClick.bind(this));
		}
	},

	isModal:function () {
		return this.modal;
	},
	show:function () {

        this.showShim();
		this.parent();

	},

	hide:function () {
		this.parent();
		this.hideShim();
		if (this.autoRemove) {
			this.remove.delay(1000, this);
		}
	},

	showShim:function () {
        if(!this.layout){
			this.center();
		}
		if (this.isModal()) {
			this.getShim().css({
				display:'',
				'z-index' : this.getEl().css('z-index') -1
			});
			this.resizeShim();
		}
	},

	resizeShim:function () {
		var b = jQuery(document.body);
		var size = { x: b.width(), y: b.height() };
        this.getShim().css('width',  size.x);
        this.getShim().css('height',  size.y + 'px');
	},

	hideShim:function () {
		if (this.isModal()) {
            this.getShim().css('display', 'none');
		}
	},

	buttonClick:function (value, button) {

		this.fireEvent(button._get().replace(/\s/g, '').toLowerCase(), this);
		if (this.autoHideOnBtnClick) {
			this.hide();
		}
	}
});/* ../ludojs/src/dialog/confirm.js */
/**
  Standard confirm dialog with default "OK" and "Cancel" buttons
  @namespace dialog
  @class ludo.dialog.Confirm
  @augments ludo.dialog.Dialog
  @param {Object} config
  @example
 	new ludo.dialog.Confirm({
 		html : 'Do you want to quit',
 		buttons:[
 			{
 				value:'Yes,'type':'form.Button',width:60
 			},
 			{
 				value:'No,'type':'form.Button',width:60
 			}
 		],
 		listeners:{
 			'yes':this.quit.bind(this)
 		}
 	});
  will create a confirm dialog with two buttons, "Yes" and "No". When click on "Yes", the dialog will be
 closed and disposed and the quit method of the object creating the dialog will be called. On click on "No"
 the dialog will be closed and disposed(it's default behavior on button click) and the nothing else will happen.
 */
ludo.dialog.Confirm = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Confirm',

    __construct : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
					defaultSubmit:true,
                    type : 'form.Button'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.parent(config);
    }
});

/* ../ludojs/src/dialog/alert.js */
/**
 Alert dialog. This component has by default one button "OK" and will fire an
 "ok" event when this button is clicked
 @namespace ludo.dialog
 @class ludo.dialog.Alert
 @augments ludo.dialog.Dialog
 @param {Object} config
 @example
	 new ludo.dialog.Alert(
	 	{ html: 'Well done! You solved this puzzle. Click OK to load next' }
	 	listeners : {
		   'ok' : this.loadNextPuzzle.bind(this)
		  }
	 });
 will display a dialog in default size with a listener attached to the "OK" button. When clicked
 it will call the loadNextPuzzle method of the object creating the alert dialog.
 */
ludo.dialog.Alert = new Class({
	Extends:ludo.dialog.Dialog,
	type:'dialog.Alert',
	buttonConfig:undefined,
	width:300,
	height:150,

	resizable:false,

	__construct:function (config) {
		if (config.substr) {
			config = {
				html:config
			}
		}
		if (!config.buttons) {
			config.buttons = [
				{
					value:'OK',
					width:60
				}
			]
		}
		this.parent(config);
	}
});

/* ../ludojs/src/form/validator/fns.js */
ludo.form.validator.required = function(value, required){
    return !required || value.length > 0;
};

ludo.form.validator.minLength = function(value, minLength){
    return value.length === 0 || value.length >= minLength;
};

ludo.form.validator.maxLength = function(value, maxLength){
    return value.length === 0 || value.length <= maxLength;
};

ludo.form.validator.regex = function(value, regex){
    return value.length === 0 || regex.test(value);
};

ludo.form.validator.minValue = function(value, minValue){
    return value.length === 0 || parseInt(value) >= minValue;
};
ludo.form.validator.maxValue = function(value, maxValue){
    return value.length === 0 || parseInt(value) <= maxValue;
};
ludo.form.validator.twin = function(value, twin){
    var cmp = ludo.get(twin);
    return !cmp || (cmp && value === cmp.value);
};/* ../ludojs/src/form/element.js */
/**
 * Super class for form Views.
 * This class inherits from <a href="ludo.View.html">ludo.View</a>.
 * @module form
 * @class ludo.form.Element
 * @param {Object} config Configuration when creating the View. These properties and properties from superclass is available
 * @param {String} config.name Name of element. A call to parentView.getForm().values() will return &lt;name> : &lt;value>.
 * @param {Boolean} config.required True to apply validation for required. Default:false
 * @param {Object} config.formCss Optional css styling of the form element. Example: { type:'form.Text', formCss:{ "text-align": right }} to right align text of a text input.
 * @param {Function} config.validator A Validator function to be executed when value is changed. This function should return true when valid, false when invalid. Current value will be passed to this function.
 * @param {Function} config.linkWith Creates a link with form element with this id. When two form views are linked, they will always have the same value. When one value is changed, the linked form view is automatically updated.
 * @param {String} config.name Name of form element
 * @param {String|Number} config.value - Initial value for form element.
 * Example: A link between a form.Seekbar and a form.Number.
 * Example: { type:'form.Text', placeHolder='Enter Valid Value', validator:function(value){ return value == 'Valid Value' } }
 * @fires ludo.form.Element#enable - Fired on enable, argument: ludo.form.Element
 * @fires ludo.form.Element#disable - Fired on disable, argument: ludo.form.Element
 * @fires ludo.form.Element#key_down - Fired on key down. Arguments: key, value, ludo.form.Element
 * @fires ludo.form.Element#key_up - Fired on key up. Arguments: key, value, ludo.form.Element
 * @fires ludo.form.Element#key_press - Fired on key up. Arguments: key, value, ludo.form.Element
 * @fires ludo.form.Element#focus - Fired on focus received. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#blur - Fired on blur. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#change - Fired on changed value by GUI. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#valueChange - Fired on changed value by GUI or the val function. Arguments: value, ludo.form.Element
 * @fires ludo.form.Element#dirty - Fired on new value which is different from initial. Arguments. value, ludo.form.Element
 * @fires ludo.form.Element#clean - Fired on new value which is the same as initial. Arguments. value, ludo.form.Element
 * @fires ludo.form.Element#value - Fired when a new valid value is set. Arguments. value, ludo.form.Element
 * @fires ludo.form.Element#invalid - Fired when a new value is set which is invalid. Arguments. value, ludo.form.Element
 * @namespace ludo.form
 */
ludo.form.Element = new Class({
    Extends:ludo.View,

    value:undefined,
    onLoadMessage:'',

    name:undefined,


    formCss:undefined,
    stretchField:true,
    required:false,
    dirtyFlag:false,
    initialValue:undefined,
    constructorValue:undefined,
    /*
     * Is form element ready for setValue. For combo boxes and select boxes it may
     * not be ready until available values has been loaded remotely
     * @property isReady
     * @type {Boolean}
     * @private
     */
    isReady:true,
    overflow:'hidden',

    /*
     * Will not validate unless value is the same as value of the form element with this id
     * Example of use: Password and Repeat password. It's sufficient to specify "twin" for one of
     * the views.
     * @property twin
     * @type String
     * @default undefined
     */
    twin:undefined,
    linkWith:undefined,
    statefulProperties:['value'],
    validator:undefined,
    validatorFn:undefined,

    validators:[],
    submittable:true,

    __construct:function (config) {
        

        this.parent(config);
        var defaultConfig = this.getInheritedFormConfig();

        // TODO change disabled to enabled


        var keys = ['label', 'suffix', 'formCss', 'validator', 'stretchField', 'required', 'twin', 'disabled','submittable',
            'value', 'data'];
        this.__params(config, keys);

        this.elementId = ('el-' + this.name).trim();
        this.formCss = defaultConfig.formCss || this.formCss;
        if (defaultConfig.height && config.height === undefined)this.layout.height = defaultConfig.height;

        if (this.validator) {
            this.createValidator();
        }
        if (config.linkWith !== undefined) {
            this.setLinkWith(config.linkWith);
        }

        if (this.dataSource && !this.dataSource.data) {
            this.isReady = false;
        }
        this.initialValue = this.constructorValue = this.value;
        if (!this.name)this.name = 'ludo-form-el-' + String.uniqueID();


        ludo.Form.add(this);
        if(this.required)this.applyValidatorFns(['required']);
        this.applyValidatorFns(['twin']);
    },

    ludoDOM:function(){
        this.parent();
        this.addInput();
    },

    applyValidatorFns:function (keys) {
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (this[key] !== undefined) {
                this.validators.push({
                    fn:ludo.form.validator[key],
                    key:key
                });
            }
        }
    },

    createValidator:function () {
        var fn;
        if (ludo.util.isFunction(this.validator)) {
            fn = this.validator;
        } else {
            this.validator.applyTo = this;
            this.validator = ludo._new(this.validator);
            fn = this.validator.isValid.bind(this.validator);
        }
        this.validators.push({
            fn : fn,key:''
        });
    },

    ludoEvents:function () {
        this.parent();

        if (this.dataSource) {
            this.getDataSource().addEvent('load', this.setReady.bind(this));
        }

        var formEl = this.getFormEl();

        if (formEl) {
            formEl.on('keydown', this.keyDown.bind(this));
            formEl.on('keypress', this.keyPress.bind(this));
            formEl.on('keyup', this.keyUp.bind(this));
            formEl.on('focus', this.focus.bind(this));
            formEl.on('change', this.change.bind(this));
            formEl.on('blur', this.blur.bind(this));
        }
    },

    __rendered:function () {
        this.parent();

        if (this.disabled)this.disable();

		if(this.els.formEl){
			this.els.formEl.attr('name', this.getName());
			if(this.value !== undefined)this.els.formEl.val(this.value)
		}
        if (this.linkWith) {
            this.createBackLink();
        }
		var parentFormManager = this.getParentForm();
	    if (parentFormManager) {
			parentFormManager.registerFormElement(this);
		}
		this.validate();
    },

    /**
     * Enable or disable form element
     * @param {Boolean} enabled
     * @memberof ludo.form.Element.prototype
     */
    setEnabled:function(enabled){
        if(enabled)this.enable(); else this.disable();
    },

    /**
     * Disable form element
     * @function disable
     * @return void
     * @memberof ludo.form.Element.prototype
     */
    disable:function () {
        this.getFormEl().attr('disabled', '1');
        this.fireEvent('disable', this);
    },
    /**
     * Enable form element
     * @function enable
     * @return void
     * @memberof ludo.form.Element.prototype
     */
    enable:function () {
        this.getFormEl().removeAttr('disabled');
        this.fireEvent('enable', this);
    },

    getInheritedFormConfig:function () {
        var cmp = this.getParent();
        if (cmp) {
            return cmp.formConfig || {};
        }
        return {};
    },

    ludoCSS:function () {
        this.parent();
        this.getEl().addClass('ludo-form-element');
        if (this.els.formEl) {
            this.els.formEl.id = this.elementId;

            if (this.formCss) {
                this.els.formEl.css(this.formCss);
            }
        }
    },

    getFormElId:function () {
        return this.elementId;
    },

    getWidth:function () {
        var ret = this.parent();
        return ret ? ret : 20;
    },

    keyUp:function (e) {
        this.fireEvent('key_up', [ e.key, this.value, this ]);
    },

    keyDown:function (e) {

        this.fireEvent('key_down', [ e.key, this.value, this ]);
    },

    keyPress:function (e) {
        this.fireEvent('key_press', [ e.key, this.value, this ]);
    },

    focus:function () {
        this._focus = true;
        this.clearInvalid();
        this.fireEvent('focus', [ this.value, this ]);
    },
    change:function () {
        if (this.els.formEl) {
            this._set(this.els.formEl.val());

        }
        if (this.wasValid)this.fireEvent('change', [ this._get(), this ]);
    },

    blur:function () {
        this._focus = false;
        this.validate();
        if (this.getFormEl())this.value = this.getValueOfFormEl();
        this.toggleDirtyFlag();

        this.fireEvent('blur', [ this.value, this ]);
    },

    getValueOfFormEl:function(){
        return this.getFormEl().val();
    },

    toggleDirtyFlag:function(){
        if (this.value !== this.initialValue) {
            this.setDirty();
            this.fireEvent('dirty', [this.value, this]);
        } else {
            this.setClean();
            this.fireEvent('clean', [this.value, this]);
        }
    },

    hasFocus:function () {
        return this._focus;
    },
    JSON:function (data) {
        this.populate(data);
    },
    populate:function () {

    },
    getLabel:function () {
        return this.label;
    },

    getValue:function () {
        console.warn("Use of deprecated getValue");
        console.trace();
        return this.els.formEl ? this.els.formEl.val() : this.value;
    },

    /**
     * Set or get value. If val argument is set, you will set a value, if not current value
     * will be returned.
     * @param {String|Number|Array|Object|Boolean} val
     * @returns {*}
     * @memberof ludo.form.Element.prototype
     */

    val:function(val){
        if(arguments.length == 0){
            return this._get();
        }
        this._set(val);
    },

    _get:function(){
        return this.els.formEl ? this.els.formEl.val() : this.value;
    },

    _set:function(value){

        if (value == this.value) {
            return value;
        }

        this.setFormElValue(value);
        this.value = value;



        this.validate();

        if (this.wasValid) {
            this.fireEvent('valueChange', [this._get(), this]);
            if (this.stateful)this.fireEvent('state');
            if (this.linkWith)this.updateLinked();
        }

        this.fireEvent('value', value);

        return value;
    },

    /*
     * Set new value
     * @function setValue
     * @param value
     * @return void
     */
    setValue:function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        return this._set(value);
    },

    setFormElValue:function(value){
        if (this.els.formEl && this.els.formEl.val() !== value) {
            this.els.formEl.val(value);
            if(this.inlineLabel)this.els.formEl.removeClass('ludo-form-el-inline-label');
        }
    },

    /**
     * Get reference to input element
     * @function getFormEl
     * @return DOMElement
     * @memberof ludo.form.Element.prototype
     */
    getFormEl:function () {
        return this.els.formEl;
    },
    /**
     * Returns true when value of form element is valid, i.e. larger than minValue, matching regex etc.
     * @function isValid
     * @return {Boolean} valid
     * @memberof ludo.form.Element.prototype
     */
    isValid:function () {
        if(this.validators.length === 0)return true;

        var val = this.getFormEl() ? this.getValueOfFormEl().trim() : this.value;
        for (var i = 0; i < this.validators.length; i++) {
            if (!this.validators[i].fn.apply(this, [val, this[this.validators[i].key], this])){
                return false;
            }
        }
        return true;
    },

    clearInvalid:function () {
        this.getEl().removeClass('ludo-form-el-invalid');
    },

    wasValid:true,

    validate:function () {
        this.clearInvalid();
        if (this.isValid()) {
            this.wasValid = true;

            this.fireEvent('valid', [this.value, this]);
            return true;
        } else {
            this.wasValid = false;

            this.fireEvent('invalid', [this.value, this]);
            return false;
        }
    },

    isFormElement:function () {
        return true;
    },

    /**
     * Alias to reset
     * @memberof ludo.form.Element.prototype
     */
    rollback:function(){
        this.reset();
    },
    /**
     * Reset / Roll back to last committed value. It could be the value stored by last commit method call
     * or if the original value/default value of this field.
     * @function reset
     * @memberof ludo.form.Element.prototype
     * @return void
     */
    reset:function () {
        this._set(this.initialValue);
    },

    /**
     * Reset value back to the original value sent(constructor value)
     * @function clear
     * @memberof ludo.form.Element.prototype
     */
    clear:function () {
        this._set(this.constructorValue);
    },

    /**
     * Update initial value to current value. These actions will always trigger a commit<br>
     * - Form or Model submission
     * - Fetching new record for a ludo.model.Model
     * @function commit
     * @memberOf ludo.form.Element.prototype
     */
    commit:function () {
        if(!this.isReady){
            this.commit.delay(100, this);
            return;
        }
        this.initialValue = this.value;
    },
    /**
     * Returns true if current value is different from original value
     * @function isDirty
     * @return {Boolean} isDirty
     * @memberof ludo.form.Element.prototype
     */
    isDirty:function () {
        return this.dirtyFlag;
    },

    setDirty:function () {
        this.dirtyFlag = true;
        this.getEl().addClass('ludo-form-el-dirty');
    },

    setClean:function () {
        this.dirtyFlag = false;
        var el = this.getEl();
        if(el)el.removeClass('ludo-form-el-dirty');
    },

    setReady:function () {
        this.isReady = true;
        var val = this.value;
        this.value = undefined;
        if(val)this._set(val);
    },

    updateLinked:function () {
        var cmp = this.getLinkWith();
        if (cmp && cmp.value !== this.value) {
            cmp._set(this.value);
        }
    },

    setLinkWith:function (linkWith) {
        this.linkWith = linkWith;
        this.addEvent('valueChange', this.updateLinked.bind(this));
    },

    createBackLink:function (attempts) {
        attempts = attempts || 0;
        var cmp = this.getLinkWith();
        if (cmp && !cmp.linkWith) {
            if (this.value === undefined){
				this.initialValue = this.constructorValue = cmp.value;
				this._set(cmp.value);
			}
            cmp.setLinkWith(this);
        } else {
            if (attempts < 100) {
                this.createBackLink.delay(50, this, attempts + 1);
            }
        }
    },

    addInput: function () {
        if (!this.inputTag) {
            return;
        }

        this.els.inputCell = jQuery('<div class="input-cell"></div>');
        this.$b().append(this.els.inputCell);
        this.els.formEl = jQuery('<' + this.inputTag + '>');

        if (this.inputType) {
            this.els.formEl.attr('type', this.inputType);
        }
        if (this.maxLength) {
            this.els.formEl.attr('maxlength', this.maxLength);
        }
        if (this.readonly) {
            this.els.formEl.attr('readonly', true);
        }
        this.getInputCell().append(this.els.formEl);
        this.els.formEl.css('width', '100%');
        this.els.formEl.attr("id", this.getFormElId());
    },

    getLinkWith:function(){
        var cmp = ludo.get(this.linkWith);
        return cmp ? cmp : this.parentComponent ? this.parentComponent.child[this.linkWith] : undefined;
    },

    getInputCell:function(){
        return this.els.inputCell;
    }
});/* ../ludojs/src/form/label-element.js */
/**
 * Class which render two child views, one label and one form field. This is a convenient class for rendering
 * a form field with a label to the left.
 *
 * This class renders the views in a linear horizontal layout.
 *
 * @class ludo.form.LabelElement
 * @param {Object} config
 * @param {Object} config.label Configuration for ludo.form.Label
 * @param {Object} config.field Configuration for a form field
 * @example:
*  var labelElement = new ludo.form.LabelElement({
    label:{
        label:'myLabel',
        type:'form.Label',
        layout:{
            width:70
        }
    },
    field:{
        type:'form.Number',
        name:'myField',
        minValue:0,
        maxValue:255
    },
    renderTo:document.body,
    layout:{
        width:200,
        height:50
    }
});
 */
ludo.form.LabelElement = new Class({
    Extends: ludo.View,

    label:undefined,
    field:undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['label', 'field']);

        if(!this.label.type)this.label.type='form.Label';
        this.label.labelFor = this.field.name;

        this.layout = this.layout || {};
        this.layout.type = 'linear';
        this.layout.orientation = 'horizontal';
    },

    __children:function(){
        return [
            this.label,
            this.field
        ]
    },

    __rendered: function () {
        this.parent();
    }

});/* ../ludojs/src/form/text.js */
/**
 * Text Input View
 * This class inherits from <a href="ludo.form.Element.html">ludo.form.Element</a>.
 * @module form
 * @namespace ludo.form
 * @class ludo.form.Text
 * @description Form input text
 *  @param {Object} config Configuration when creating the View. These properties and properties from superclass is available
 * @param {String} config.name Name of element. A call to parentView.getForm().values() will return &lt;name> : &lt;value>.
 * @param {String} config.placeholder Placeholder attribute for the input. Displayed when value is empty. (Default:undefined)
 * @param {Number} config.minLength Defines required min length of value(count characters). (Default:undefined)
 * @param {Number} config.maxLength Defines required max length of value(count characters)
 * @param {Boolean} config.ucFirst True to automatically Uppercase first letter. (Default: false)
 * @param {RegExp} config.regex Regular expression used for validation, example: regex: /$[0-9]{3}^/ to require 3 digits. (Default:undefined)
 * @param {Boolean} config.readonly True to make this form field read only. (Default: false)
 * @param {Boolean} config.selectOnFocus Automatically make the text selected on focus. Default: false
 * @param {Boolean} config.validateKeyStrokes True to run validation after every key stroke(Default: false)
 * @param {Boolean} config.autoComplete False to disable browsers auto complete(default : true)
 * @param {Function} config.validator Optional validator function for the value.
 * @fires ludo.form.Text#key Fired when a key is pressed. Argument: {String} key pressed.
 * @augments ludo.form.Element
 *
 */
ludo.form.Text = new Class({
    Extends: ludo.form.Element,
    type: 'form.Text',
    labelWidth: 100,
    defaultValue: '',
    placeholder:'',

    maxLength: undefined,

    minLength: undefined,
    ucFirst: false,
    ucWords: false,

    inputType: 'text',
    inputTag: 'input',
    regex: undefined,
    validateKeyStrokes: false,
    formFieldWidth: undefined,
    readonly: false,
    selectOnFocus: false,
    autoComplete:true,

    __construct: function (config) {
        this.parent(config);
        
        var keys = ['placeholder', 'selectOnFocus', 'regex', 'minLength', 'maxLength', 'defaultValue', 'autoComplete', 'validateKeyStrokes', 'ucFirst', 'ucWords', 'readonly'];
        this.__params(config, keys);
        if (this.regex && ludo.util.isString(this.regex)) {
            var tokens = this.regex.split(/\//g);
            var flags = tokens.length > 1 ? tokens.pop() : '';
            this.regex = new RegExp(tokens.join('/'), flags);
        }
        this.applyValidatorFns(['minLength', 'maxLength', 'regex']);

        if(this.layout.height == undefined){
            this.layout.height = 'wrap';
        }

    },

    ludoDOM:function(){
        this.parent();
        if(this.placeholder){
            this.getFormEl().attr('placeholder', this.placeholder);
        }

        if(!this.autoComplete){
            this.getFormEl().attr('x-autocompletetype', String.uniqueID());
            this.getFormEl().attr('autocomplete', 'false');
        }
    },

    ludoEvents: function () {
        this.parent();
        var el = this.getFormEl();
        if (this.ucFirst || this.ucWords) {
            this.addEvent('blur', this.upperCaseWords.bind(this));
        }
        this.addEvent('blur', this.validate.bind(this));
        if (this.validateKeyStrokes) {
            el.on('keydown', this.validateKey.bind(this));
        }
        el.parent().addClass('ludo-form-text-element');
        el.on('keyup', this.sendKeyEvent.bind(this));

        if (this.selectOnFocus) {
            el.on('focus', this.selectText.bind(this));
        }
    },

    sendKeyEvent: function () {
        this.fireEvent('key', this.els.formEl.val());
    },

    validateKey: function (e) {
        if (!e.control && !e.alt && this.regex && e.key && e.key.length == 1) {
            if (!this.regex.test(e.key)) {
                return false;
            }
        }
        return undefined;
    },

    getFieldWidth: function () {
        return this.formFieldWidth;
    },
    /**
     * Focus form element
     * @function focus
     * @return void
     * @memberof ludo.form.Text.prototype
     */
    focus: function () {
        this.parent();
        if (!this.getFormEl().is(":focus")) {
            this.getFormEl().focus();
        }
    },

    validate: function () {
        var valid = this.parent();
        if (!valid && !this._focus) {
            this.getEl().addClass('ludo-form-el-invalid');
        }
        return valid;
    },
    keyUp: function (e) {
        this.parent(e);
        if (this.validateKeyStrokes) {
            this.validate();
        }
    },

    upperCaseWords: function () {
        if (this.ucFirst || this.ucWords) {
            var val = this.getValueOfFormEl();
            if (val.length == 0) {
                return;
            }
            if (this.ucWords && val.length > 1) {
                var tokens = val.split(/\s/g);
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].length == 1) {
                        tokens[i] = tokens[i].toUpperCase();
                    } else {
                        tokens[i] = tokens[i].substr(0, 1).toUpperCase() + tokens[i].substr(1);
                    }
                }
                this.getFormEl().val(tokens.join(' '));
            }
            else {
                val = val.substr(0, 1).toUpperCase() + val.substr(1);
                this.getFormEl().val(val);
            }
        }
    },

    hasSelection: function () {
        var start = this.getSelectionStart();
        var end = this.getSelectionEnd();
        return end > start;
    },

    select:function(){
        this.getFormEl().select();
    },

    selectText: function () {
        this.select();
    },

    getSelectionStart: function () {
        if (this.els.formEl.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', this.els.formEl.val().length);
            if (r.text == '') return this.els.formEl.val().length;
            return this.els.formEl.val().lastIndexOf(r.text);
        } else return this.els.formEl.selectionStart;
    },

    getSelectionEnd: function () {
        if (this.els.formEl.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveStart('character', -this.els.formEl.val().length);
            return r.text.length;
        } else return this.els.formEl.selectionEnd;
    }
});
/* ../ludojs/src/dialog/prompt.js */
/**
 * Dialog with one text field. Default buttons are "OK" and "Cancel"
 * @namespace ludo.dialog
 * @class ludo.dialog.Prompt
 * @augments ludo.dialog.Dialog
 * @param {Object} config
 */
ludo.dialog.Prompt = new Class({
    Extends: ludo.dialog.Dialog,
    type : 'dialog.Prompt',
    input : undefined,
    inputConfig : {},
    label:'',
    value:'',
    __construct : function(config){
        if(!config.buttons && !config.buttonConfig && !config.buttonBar){
            config.buttons = [
                {
                    value : 'OK',
                    width : 60,
					defaultSubmit:true,
                    type:'form.Button'
                },
                {
                    value : 'Cancel',
                    width : 60
                }
            ]
        }
        this.__params(config, ['label','value','inputConfig']);
        this.parent(config);
    },

    __rendered : function(){
        this.parent();
        var inputConfig = Object.merge(this.inputConfig, {
            type : 'form.Text',
            label : this.label,
            value : this.value
        });

        this.input = this.addChild(inputConfig);
        this.input.focus();
    },

    /**
     * Return value of input field
     * @function val
     * @return String value
     * @memberof ludo.dialog.Prompt
     */
    val: function(){
        return this.input.val();
    },

    getValue : function(){
        return this.input.val()
    },

    buttonClick : function(value, button){
        this.fireEvent(button.value.toLowerCase(), [this.val(), this]);
        if (this.autoHideOnBtnClick) {
            this.hide();
        }
    }

});/* ../ludojs/src/controller/manager.js */
/**
 * This class connects view modules and controllers
 * @namespace ludo.controller
 * @class ludo.controller.Manager
 */
ludo.controller.Manager = new Class({
    Extends: ludo.Core,
    controllers : [],
    components : [],

    registerController:function(controller){
        this.controllers.push(controller);
        for(var i=0;i<this.components.length;i++){
            var c = this.components[i];
            if(controller.shouldBeControllerFor(c)){
                this.assignControllerTo(controller,c);
            }
        }
    },

    registerComponent:function(component){
        if(!component.hasController()){
            this.components.push(component);
            var controller = this.getControllerFor(component);
            if(controller){
                this.assignControllerTo(controller,component);
            }
        }
    },

    getControllerFor:function(component){
        for(var i=0;i<this.controllers.length;i++){
            if(this.controllers[i].shouldBeControllerFor(component)){
                return this.controllers[i];
            }
        }
		return undefined;
    },

    assignSpecificControllerFor:function(controller, component){
        if (typeof controller === "string") {
            controller = ludo.get(controller);
            if(controller){
                this.assignControllerTo(controller,component);
            }
            return;
        }
        controller = component.createDependency('controller-' + String.uniqueID(), controller);
        this.assignControllerTo(controller,component);
    },

    assignControllerTo:function(controller, component){
        component.setController(controller);
        controller.addBroadcastFor(component);
        controller.addView(component);
    }
});

ludo.controllerManager = new ludo.controller.Manager();/* ../ludojs/src/controller/controller.js */
/**
 * Base class for controllers
 *
 * A controller is by default controller for all components in the same namespace where
 * the useController attribute is set to true. (namespace is
 * determined by component's "type" attribute)
 *
 * You can use the "applyTo" attribute to override this default  applyTo is
 * an array referring to the "module" and "submodule" property of components.
 *
 * example:
 * @example
 *  applyTo:["login", "register"]
 *
 * will set the controller as controller for all components in modules "login" and "register"
 *
 * When creating a new controller, you should extend this class and
 * implement an addView method which takes component as only argument
 * Example:
 *
 * @example
 *  addView:function(view){
 *      view.addEvent('someEvent', this.methodName.bind(this));
 *  }
 *
 * This methods add events to the component.
 *
 * To let the component listen to controller events, implement the addController method
 * for the component(it's defined in ludo.Core)
 *
 * @namespace controller
 * @class ludo.controller.Controller
 * @augments Core
 */

ludo.controller.Controller = new Class({
	Extends:ludo.Core,
	type:'controller.Controller',
	/*
	 * Apply controller to components in these modules.
	 * By default a controller will be set as controller for all component
	 * within the same namespace (name space is determined by parsing "type" attribute),
	 * Example:
	 *
	 * You have created a Image Crop module within ludo.app.crop. You have these components there
	 *
	 * ludo.crop.GUI ( View component with type set to "crop.GUI")
	 * ludo.crop.Coordinates (View component with type set to "crop.Coordinates")
	 * ludo.crop.Controller (Controller with type set to "crop.Controller")
	 *
	 * The controller will in this example be set as controller for all components within
	 * the "ludo.crop" namespace.
	 *
	 * (if useController for the component is set to true)
	 * This property is used to override the default
	 * @property applyTo
	 * @type Array
	 * @default undefined
	 */
	applyTo:undefined,
	id:undefined,
	components:[],
	controller:undefined,
	useController:false,

	/*
	 List of events which will be automatically broadcasted,i.e. re-fired by the controller

	 @property broadcast
	 @type Object
	 @example
	 	broadcast:{
			'ns.Component' : ['eventOne',{'viewEventName':'controllerEventName}],
			'ns.ComponentTwo' : ['send','receive']
		}
	 In this example, the controller will listen to "eventOne" and "viewEventName"  of view of "type"
	 ns.Component and re-fire them so that other views can listen to them. The "viewEventName" will
	 be re-fired as a "controllerEventName".
	 */
	broadcast:undefined,

	__construct:function (config) {
		config = config || {};
        config.controller = undefined;
        config.useController = false;

		this.parent(config);
		if (config.broadcast)this.broadcast = config.broadcast;
		ludo.controllerManager.registerController(this);
		if (this['addView'] == undefined) {
			alert('You need to implement an addView method for the controller (' + this.type + ')');
		}
	},

	addBroadcastFor:function (component) {
		if (this.broadcast && this.broadcast[component.type] !== undefined) {
			var ev = this.broadcast[component.type];
			for (var i = 0; i < ev.length; i++) {
				var eventNames = this.getBroadcastEventNames(ev[i]);
				component.addEvent(eventNames.component, this.getBroadcastFn(eventNames.controller).bind(this));
			}
		}
	},

	getBroadcastFn:function (eventName) {
		return function () {
			this.fireEvent(eventName, arguments);
		}
	},

	getBroadcastEventNames:function (event) {
		if (typeof event == 'object') {
			for (var key in event) {
				if (event.hasOwnProperty(key)) {
					return { component:key, controller:event[key] };
				}
			}
		}
		return { component:event, controller:event };
	},

	shouldBeControllerFor:function (component) {
		if(component === this)return false;
		if (!this.applyTo) {
			return this.isInSameNamespaceAs(component);
		}
		var key = this.getModuleKeyFor(component);

		if (this.isAppliedDirectlyToModule(key)) {
			return true;
		}
		return this.isAppliedIndirectlyToModule(key);
	},

	getModuleKeyFor:function (component) {
		return component.module + (component.submodule ? '.' + component.submodule : '');
	},

	isAppliedDirectlyToModule:function (moduleKey) {
		return (this.applyTo.indexOf(moduleKey) === 0);
	},

	isAppliedIndirectlyToModule:function (moduleKey) {
		for (var i = 0; i < this.applyTo.length; i++) {
			if (moduleKey.indexOf(this.applyTo[i]) === 0) {
				return true;
			}
		}
		return false;
	},

	isInSameNamespaceAs:function (component) {
		return this.getNamespace() == component.getNamespace();
	}
});

ludo.getController = function (controller) {
	if (controller.substr) {
		controller = ludo.get(controller);
	}
	return controller;
};/* ../ludojs/src/svg/event-manager.js */
ludo.svg.EventManager = new Class({
	nodes:{},
	currentNodeId:undefined,
    currentNodeFn:undefined,

	currentNode:undefined,

	addMouseEnter:function (node, fn) {
		node.on('mouseover', this.getMouseOverFn(fn));

	},

	addMouseLeave:function(node, fn){
		node.on('mouseout', this.getMouseOutFn(fn));

	},

	getMouseOverFn:function (fn) {
		return function (e, node) {
			if(!e.event.relatedTarget || !this.contains(node.getEl(), e.event.relatedTarget) ){
				fn.call(node, e, node);
			}

		}.bind(this)
	},

	contains:function(parent, child){
		if(parent.childNodes && parent.childNodes.length > 0){
			return this._contains(parent.childNodes, child);
		}
		return false;
	},

	_contains:function(children, child){
		for(var i=0,len = children.length;i<len;i++){
			var c = children[i];
			if(c == child)return true;
			if(c.childNodes && c.childNodes.length > 0){
				var found = this._contains(c.childNodes,child );
				if(found )return true;
			}
		}
		return false;
	},

	getMouseOutFn:function (fn) {
		return function (e, node) {
			if(!e.event.relatedTarget || !this.contains(node.getEl(), e.event.relatedTarget) ){
				fn.call(node, e, node);
			}
		}.bind(this)
	}
});
ludo.canvasEventManager = new ludo.svg.EventManager();/* ../ludojs/src/svg/paint.js */
/**
 Class for styling of SVG DOM nodes
 @namespace ludo.canvas
 @class ludo.svg.Paint
 @param {Object} config
 @example
 	var canvas = new ludo.svg.Canvas({
		renderTo:'myDiv'
 	});

 	var paint = new ludo.svg.Paint({
		'stroke-width' : 5,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { className : 'MyClass' );
 	canvas.appendDef(paint); // Appended to &lt;defs> node

 	// create node and set "class" to paint
 	// alternative methods:
 	// paint.applyTo(node); and
 	// node.addClass(paint.getClassName());
	var node = new ludo.svg.Node('rect', { id:'myId2', 'class' : paint});

 	canvas.append(node);

 	// Paint object for all &lt;rect> and &lt;circle> tags:

	var gradient = new ludo.svg.Gradient({
        id:'myGradient'
    });
    canvas.append(gradient);
    gradient.addStop('0%', '#0FF');
    gradient.addStop('100%', '#FFF', 0);
    // New paint object applied to all &lt;rect> and &lt;circle> tags.
 	var paint = new ludo.svg.Paint({
		'stroke-width' : 5,
		'fill' : gradient,
		'stroke-opacity' : .5,
		'stroke-color' : '#DEF'
	}, { selectors : 'rect, circle' );
 */

ludo.svg.Paint = new Class({
	Extends:ludo.svg.Node,
	tagName:'style',
	css:{},
	nodes:[],
	className:undefined,
	tag:undefined,
	cssPrefix : undefined,

	mappings:{
		'color':['stroke-color'],
		'background-color':['fill-color'],
		'opacity':['fill-opacity', 'stroke-opacity']
	},

	initialize:function (css, config) {
		config = config || {};
		this.className = config.className || 'css-' + String.uniqueID();
		this.cssPrefix = config.selectors ? config.selectors : '.' + this.className;
		if(config.selectors)delete config.selectors;
		if(config.className)delete config.className;
		this.parent(this.tagName, config);
		if (css !== undefined)this.setStyles(css);
	},

	setStyles:function (styles) {
		Object.each(styles, function (value, key) {
			this.setStyleProperty(key, value);
		}, this);
		this.updateCssContent();
	},

	/**
	 Update a css style
	 @function setStyle
	 @param {String} style
	 @param {String|Number}value
	 @memberof ludo.svg.Paint.prototype
	 @example
	 	var paint = new ludo.svg.Paint({
	 		css:{
	 			'stroke-opacity' : 0.5
	 		}
	 	});
	 	canvas.append(paint);
	 	paint.setStyle('stroke-opacity', .2);
	 */
	setStyle:function (style, value) {
		this.setStyleProperty(style, value);
		this.updateCssContent();
	},

	updateCssContent:function () {
		var css = JSON.stringify(this.css);
		css  = css.replace(/"/g,"");
		css  = css.replace(/,/g,";");
		this.text(this.cssPrefix + css);
	},

	setStyleProperty:function (style, value) {
		value = this.getRealValue(value);
		if (this.mappings[style]) {
			this.setMapped(style, value);
		} else {
			this.css[style] = value;
		}
	},

	setMapped:function (style, value) {
		for (var i = 0; i < this.mappings[style].length; i++) {
			var m = this.mappings[style][i];
			this.css[m] = value;
		}
	},

	/**
	 * Return value of a css style
	 * @function getStyle
	 * @param {String} style
	 * @return {String|Number} value
	 * @memberof ludo.svg.Paint.prototype
	 */
	getStyle:function (style) {
		if (this.mappings[style])style = this.mappings[style][0];
		return this.css[style];
	},

	getRealValue:function (value) {
		return value && value.id !== undefined ? 'url(#' + value.id + ')' : value;
	},

	/**
	 * Apply css to a SVG node. This is done by adding CSS class to the node
	 * @function applyTo
	 * @param {canvas.Node} node
	 * @memberof ludo.svg.Paint.prototype
	 */
	applyTo:function (node) {
		ludo.svg.addClass(node.el ? node.el : node, this.className);
	},

	/**
	 * Returns class name of Paint object
	 * @function getClassName
	 * @return {String} className
	 * @memberof ludo.svg.Paint.prototype
	 */
	getClassName:function () {
		return this.className;
	},

	getUrl:function(){
		return this.className;
	}
});
/* ../ludojs/src/svg/named-node.js */
/**
 * Super class for canvas.Circle, canvas.Rect +++
 * @namespace ludo.canvas
 * @class ludo.svg.NamedNode
 */
ludo.svg.NamedNode = new Class({
	Extends: ludo.svg.Node,

	initialize:function (attributes, text) {
        attributes = attributes || {};
		if(attributes.listeners){
			this.addEvents(attributes.listeners);
			delete attributes.listeners;
		}
		this.parent(this.tagName, attributes, text);
	}
});/* ../ludojs/src/svg/path.js */
/**
 * Returns a path SVG element which can be adopted to a canvas.
 * @namespace ludo.canvas
 * @class ludo.svg.Path
 */
ludo.svg.Path = new Class({
    Extends:ludo.svg.NamedNode,
    tagName:'path',
    pointString:undefined,
    pointArray:undefined,
    size:undefined,
    position:undefined,

    initialize:function (points, properties) {
        properties = properties || {};
        if (points) {
            points = this.getValidPointString(points);
            properties.d = points;
        }
        this.parent(properties);
        this.pointString = points;
    },

    getValidPointString:function (points) {
        return points.replace(/([A-Z])/g, '$1 ').trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
    },

    setPath:function (path) {
        this.pointString = this.getValidPointString(path);
        this.pointArray = undefined;
        this.set('d', this.pointString);
    },

    getPoint:function (index) {
        if (this.pointArray === undefined)this.buildPointArray();
        index *= 3;
        return {
            x:this.pointArray[index + 1],
            y:this.pointArray[index + 2]
        };
    },

    setPoint:function (index, x, y) {
        if (this.pointArray === undefined)this.buildPointArray();
        index *= 3;
        if (index < this.pointArray.length - 3) {
            this.pointArray[index + 1] = x;
            this.pointArray[index + 2] = y;
            this.pointString = this.pointArray.join(' ');
            this.set('d', this.pointString);
            this.size = undefined;
            this.position = undefined;
        }
    },

    buildPointArray:function () {
        var points = this.pointString.replace(/,/g, ' ').replace(/\s+/g, ' ');
        this.pointArray = points.split(/([A-Z\s])/g).erase(" ").erase("");
    },

    getSize:function () {
        if (this.size === undefined) {
            var minMax = this.getMinAndMax();
            this.size = {
                x:Math.abs(minMax.maxX - minMax.minX),
                y:Math.abs(minMax.maxY - minMax.minY)
            };
        }
        return this.size;
    },

    getPosition:function () {
        if (this.position === undefined) {
            var minMax = this.getMinAndMax();
            this.position = {
                x:minMax.minX,
                y:minMax.minY
            };
        }
        return this.position;
    },

    getMinAndMax:function () {
        if (this.pointArray === undefined)this.buildPointArray();
        var p = this.pointArray;
        var x = [];
        var y = [];
        for (var i = 0; i < p.length - 2; i += 3) {
            x.push(p[i + 1]);
            y.push(p[i + 2]);
        }
        return {
            minX:Math.min.apply(this, x), minY:Math.min.apply(this, y),
            maxX:Math.max.apply(this, x), maxY:Math.max.apply(this, y)
        };
    }
});/* ../ludojs/src/remote/inject.js */
/*
 * Class for injecting data to specific resource/service requests
 */
ludo.remote.Inject = new Class({

	data:{},

	/*
	 Add data to be posted with the next request.
	 @function add
	 @param resourceService
	 @param data
	 @example
	 	ludo.remoteInject.add('Person/save', {
	 		'customParam' : 'customValue'
	 	});
	 */
	add:function(resourceService, data){
		var tokens = resourceService.split(/\//g);
		var resource = tokens[0];
		var service = tokens[1];
		if(this.data[resource] === undefined){
			this.data[resource] = {};
		}
		this.data[resource][service] = data;
	},

	get:function(resource, service){
		if(this.data[resource] && this.data[resource][service]){
			var ret = this.data[resource][service];
			delete this.data[resource][service];
			return ret;
		}
		return undefined;
	}

});

ludo.remoteInject = new ludo.remote.Inject();
/* ../ludojs/src/remote/base.js */
/*
 * Base class for ludo.remote.HTML and ludo.remote.JSON
 * @namespace ludo.remote
 * @class ludo.remote.Base
 */
ludo.remote.Base = new Class({
	Extends:Events,
	remoteData:undefined,
	method:'post',
	
	initialize:function (config) {
		config = config || {};
		if (config.listeners !== undefined) {
			this.addEvents(config.listeners);
		}
		this.method = config.method || this.method;
		if (config.resource !== undefined) this.resource = config.resource;
		if (config.url !== undefined) this.url = config.url;

		if (config.shim) {
			new ludo.remote.Shim({
				renderTo:config.shim.renderTo,
				remoteObj:this,
				txt:config.shim.txt
			});
		}
	},

	send:function (service, resourceArguments, serviceArguments, additionalData) {

		this.remoteData = undefined;

		if (resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];
		ludo.remoteBroadcaster.clear(this, service);

		this.fireEvent('start');

		this.sendToServer(service, resourceArguments, serviceArguments, additionalData);
	},

	onComplete:function () {
		this.fireEvent('complete', this);
	},
	/*
	 * Return url for the request
	 * @function getUrl
	 * @param {String} service
	 * @param {Array} args
	 * @return {String}
	 * @memberof ludo.remote.Base.prototype
	 * @protected
	 */
	getUrl:function (service, args) {
		var ret = this.url !== undefined ? this.url : ludo.config.getUrl();
		if (ludo.config.hasModRewriteUrls()) {
			ret = ludo.config.getDocumentRoot() + this.getServicePath(service, args);
		} else {
			ret = this.url !== undefined ? ludo.util.isFunction(this.url) ? this.url.call() : this.url : ludo.config.getUrl();
		}
		return ret;
	},
	/*
	 * @function getServicePath
	 * @param {String} service
	 * @param {Array} args
	 * @return {String}
	 * @memberof ludo.remote.Base.prototype
	 * @protected
	 */
	getServicePath:function (service, args) {
		var parts = [this.resource];
		if (args && args.length)parts.push(args.join('/'));
		if (service)parts.push(service);
		return parts.join('/');
	},
	/*
	 * @function getDataForRequest
	 * @param {String} service
	 * @param {Array} args
	 * @param {Object} data
	 * @optional
	 * @param {Object} additionalData
	 * @optional
	 * @return {Object}
	 * @memberof ludo.remote.Base.prototype
	 * @protected
	 */
	getDataForRequest:function (service, args, data, additionalData) {
		var ret = {
			data:data
		};
		if (additionalData) {
			if (ludo.util.isObject(additionalData)) {
				ret = Object.merge(additionalData, ret);
			}
		}
		if (!ludo.config.hasModRewriteUrls() && this.resource) {
			ret.request = this.getServicePath(service, args);
		}

		var injected = ludo.remoteInject.get(this.resource, service);
		if(injected){
			ret.data = ret.data ? Object.merge(ret.data, injected) : injected;
		}

		return ret;
	},
	/*
	 * Return "code" property of last received server response.
	 * @function getResponseCode
	 * @return {String|undefined}
	 * @memberof ludo.remote.Base.prototype
	 */
	getResponseCode:function () {
		return this.remoteData && this.remoteData.code ? this.remoteData.code : 0;
	},
	/*
	 * Return response message
	 * @function getResponseMessage
	 * @return {String|undefined}
	 * @memberof ludo.remote.Base.prototype
	 */
	getResponseMessage:function () {
		return this.remoteData && this.remoteData.message ? this.remoteData.message : undefined;
	},

	/*
	 * Return name of resource
	 * @function getResource
	 * @return {String}
	 * @memberof ludo.remote.Base.prototype
	 */
	getResource:function(){
		return this.resource;
	},

	sendBroadCast:function(service){
		ludo.remoteBroadcaster.broadcast(this, service);
	}
});/* ../ludojs/src/remote/json.js */
/**
 * LudoJS class for remote JSON queries. Remote queries in ludoJS uses a REST-like API where you have
 * resources, arguments, service and data. An example of resource is Person and City. Example of
 * services are "load", "save". Arguments are arguments used when instantiating the resource on the
 * server, example: Person with id 1. The "data" property is used for data which should be sent to
 * the service on the server. Example: For Person with id equals 1, save these data.
 * @namespace ludo.remote
 * @class ludo.remote.JSON
 * @param {Object} config
 * @param {String} config.url
 */

/**
 * TODO 2016
 * Refactor data source. Create a method which has to be implemented. 
 */
ludo.remote.JSON = new Class({
    Extends:ludo.remote.Base,

    /*
     * Name of resource to request, example: "Person"
     * @config {String} resource
     */
    resource:undefined,

    url:undefined,

    initialize:function (config) {
		this.parent(config);
    },

    /**
     Send request to the server
     @function send
     @memberof ludo.remote.JSON.prototype
     @param {String} service
     @param {Array} resourceArguments
     @optional
     @param {Object} serviceArguments
     @optional
     @example
        ludo.config.setUrl('/controller.php');
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     Will trigger the following data to be sent to controller.php:

     @example
		 {
			 request:"Person/1/load"
		 }
     If you have the mod_rewrite module enabled and activated on your web server, you may use code like this:
     @example
	 	ludo.config.enableModRewriteUrls();
        ludo.config.setDocumentRoot('/');
        var req = new ludo.remote.JSON({
            resource : 'Person'
        });
        req.send('load', 1);

     which will send a request to the following url:
     @example:
        http://<your web server url>/Person/1/load
     The query will not contain any POST data.

     Here's another example for saving data(mod rewrite deactivated)
     @example
	     ludo.config.setUrl('/controller.php');
         var req = new ludo.remote.JSON({
            resource : 'Person'
        });
         req.send('save', 1, {
            "firstname": "John",
            "lastname": "Johnson"
         });

     which will send the following POST data to "controller.php":

     @example
        {
            "request": "Person/1/save",
            "data": {
                "firstname": "John",
                "lastname": McCarthy"
            }
        }
     When mod_rewrite is enabled, the request will be sent to the url /Person/1/save and POST data will contain

        {
            "data": {
                "firstname": "John",
                "lastname": "McCarthy"
            }
        }
     i.e. without any "request" data in the post variable since it's already defined in the url.
     @param {Object} additionalData
     @optional
     */
    sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {

		if(resourceArguments && !ludo.util.isArray(resourceArguments))resourceArguments = [resourceArguments];
        // TODO escape slashes in resourceArguments and implement replacement in LudoDBRequestHandler
        // TODO the events here should be fired for the components sending the request.

		this.fireEvent('start', this);
        this.sendBroadCast(service);


        var payload = this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData);
        if(!service && !resourceArguments){
            payload = payload.data;
        }

        jQuery.ajax({
            url:this.getUrl(service, resourceArguments),
            method:this.method,
            cache:false,
            dataType:'json',
            data:payload,
            success:function (json) {
                this.remoteData = json;
                if (jQuery.type(json) != "array" || json.success || json.success === undefined) {
                    this.fireEvent('success', this);
                } else {
                    this.fireEvent('failure', this);
                }
                this.sendBroadCast(service);
				this.onComplete();
            }.bind(this),
            fail:function (text, error) {
                this.remoteData = { "code": 500, "message": error };
                this.fireEvent('servererror', this);
                this.sendBroadCast(service);
                this.onComplete();
            }.bind(this)
        });
    },
    /**
     * Return JSON response data from last request.
     * @function getResponseData
     * @return {Object|undefined}
     * @memberof ludo.remote.JSON.prototype
     */
    getResponseData:function () {
        if(this.remoteData && jQuery.type(this.remoteData) == "array") return this.remoteData;
		if(!this.remoteData.response && !this.remoteData.data){
            return undefined;
        }
        return this.remoteData.data ? this.remoteData.data : this.remoteData.response.data ? this.remoteData.response.data : this.remoteData.response;
    },

    /**
     * Return entire server response of last request.
     * @function getResponse
     * @return {Object|undefined}
     * @memberof ludo.remote.JSON.prototype
     */
    getResponse:function () {
        return this.remoteData;
    },
    /**
     * Set name of resource
     * @function setResource
     * @param {String} resource
     * @memberof ludo.remote.JSON.prototype
     */
    setResource:function(resource){
        this.resource = resource;
    }
});
/* ../ludojs/src/remote/html.js */
/**
 Class for remote HTML requests.
 @namespace remote
 @class ludo.remote.HTML

 */
ludo.remote.HTML = new Class({
	Extends:ludo.remote.Base,
	HTML:undefined,

	sendToServer:function (service, resourceArguments, serviceArguments, additionalData) {
		jQuery.ajax({
			dataType: "html",
			method: this.method,
			url:this.getUrl(service, resourceArguments),
			async:true,
			cache:false,
			data:this.getDataForRequest(service, resourceArguments, serviceArguments, additionalData),
			success:function(html){
				this.remoteData = html;
				this.fireEvent('success', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this),

			error:function(xhr, text, error){
				this.remoteData = { "code":500, "message":error };
				this.fireEvent('servererror', this);
				this.sendBroadCast(service);
				this.onComplete();
			}.bind(this)

		});
	},
	/**
	 * Return JSON response data from last request.
	 * @function getResponseData
	 * @return {Object|undefined}
	 * @memberof ludo.remote.HTML.prototype
	 */
	getResponseData:function () {
		return this.remoteData;
	},

	/**
	 * Return entire server response of last request.
	 * @function getResponse
	 * @return {Object|undefined}
	 * @memberof ludo.remote.HTML.prototype
	 */
	getResponse:function () {
		return this.remoteData;
	}
});/* ../ludojs/src/remote/broadcaster.js */
/**
 Singleton class responsible for broadcasting messages from remote requests.
 Instance of this class is available in ludo.remoteBroadcaster.

 The broadcaster can fire four events:
 start, success, failure and serverError. The example below show you how
 to add listeners to these events.

 @class ludo.remote.Broadcaster
ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
    // Do something
});
 */
ludo.remote.Broadcaster = new Class({
    Extends:Events,

    defaultMessages:{},
    /**
     * @function broadcast
     * @param {ludo.remote.JSON} request
     * @param {String} service
     * @private
     */
    broadcast:function (request, service) {
        var code = request.getResponseCode();

		var type, eventNameWithService;
        switch (code) {
			case 0:
				type = 'start';
				break;
            case 200:
				type = 'success';
                break;
            default:
				type = 'failure';
                break;
        }

		var eventName = this.getEventName(type, request.getResource());

		if(eventName){
			eventNameWithService = this.getEventName(type, request.getResource(), service);
		}else{
            eventName = this.getEventName('serverError', request.getResource());
            eventNameWithService = this.getEventName('serverError', request.getResource(), service);
        }

        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service,
            "type": type
        };
        if (!eventObj.message)eventObj.message = this.getDefaultMessage(eventNameWithService || eventName);
        this.fireEvent(eventName, eventObj);
        if (service) {
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getDefaultMessage:function (key) {
        return this.defaultMessages[key] ? this.defaultMessages[key] : '';
    },

    clear:function (request, service) {
        var eventObj = {
            "message":request.getResponseMessage(),
            "code":request.getResponseCode(),
            "resource":request.getResource(),
            "service":service
        };
        var eventName = this.getEventName('clear', eventObj.resource);
        var eventNameWithService = this.getEventName('clear', eventObj.resource, service);

        this.fireEvent(eventName, eventObj);
        if (service) {
            this.fireEvent(eventNameWithService, eventObj);
        }
    },

    getEventName:function (eventType, resource, service) {
        resource = resource || '';
        service = service || '';
        return [resource, service, eventType.capitalize(), 'Message'].join('');
    },

    /**
     Listen to events from remote requests. EventType is either
     success, failure or serverError. resource is a name of resource
     specified in the request.
     @function addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {Function} fn
     @memberof ludo.remote.Broadcaster.prototype
     @example
        ludo.remoteBroadcaster.addEvent('failure', 'Person', function(response){
            this.$b().html( response.message');
        }.bind(this));
     The event payload is an object in this format:
     @example
         {
             "code": 200,
             "message": "A message",
             "resource": "Which resource",
             "service": "Which service"
         }
     */
    addResourceEvent:function (eventType, resource, fn) {
        this.addEvent(this.getEventName(eventType, resource), fn);
    },
    /**
     Listen to remote events from a specific service only.
     @function addResourceEvent
     @param {String} eventType
     @param {String} resource
     @param {Array} services
     @param {Function} fn
     @memberof ludo.remote.Broadcaster.prototype
     @example
        ludo.remoteBroadcaster.addEvent('failure', 'Person', ['save'], function(response){
            this.$b().html( response.message');
        }.bind(this));
     The event payload is an object in this format:
     @example
         {
             "code": 200,
             "message": "A message",
             "resource": "Which resource",
             "service": "Which service"
         }
     */
    addServiceEvent:function (eventType, resource, services, fn) {
        if (!services.length) {
            this.addEvent(this.getEventName(eventType, resource, undefined), fn);
        } else {
            for (var i = 0; i < services.length; i++) {
                this.addEvent(this.getEventName(eventType, resource, services[i]), fn);
            }
        }
    },

    /**
     Specify default response messages for resource service
     @function setDefaultMessage
     @param {String} message
     @param {String} eventType
     @param {String} resource
     @param {String} service
     @memberof ludo.remote.Broadcaster.prototype
     @example
        ludo.remoteBroadcaster.setDefaultMessage('You have registered successfully', 'success', 'User', 'register');
     */
    setDefaultMessage:function (message, eventType, resource, service) {
        this.defaultMessages[this.getEventName(eventType, resource, service)] = message;
    },

	eventObjToBuild :{},
    /**
     Chained method for adding broadcaster events.
     @function withResourceService
     @param {String} resourceAndService
     @return {remote.Broadcaster}
     @memberof ludo.remote.Broadcaster.prototype
     @example
     ludo.remoteBroadcaster.withResourceService('Person/save').on('success', function(){
	 		alert('Save success');
	 	});
     */
    withResourceService:function(resourceAndService){
        var tokens = resourceAndService.split(/\//g);
        this.withResource(tokens[0]);
        if(tokens.length == 2)this.withService(tokens[1]);
        return this;
    },

	/**
	 Chained method for adding broadcaster events.
	 @function withResource
	 @param {String} resource
	 @return {remote.Broadcaster}
     @memberof ludo.remote.Broadcaster.prototype
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('save').on('success', function(){
	 		alert('Save success');
	 	});
	 */
	withResource:function(resource){
		this.eventObjToBuild = {
			resource : resource
		};
		return this;
	},
	/**
	 Chained method for adding broadcaster events.
	 @function withService
	 @param {String} service
	 @return {remote.Broadcaster}
     @memberof ludo.remote.Broadcaster.prototype
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('read').
            withService('save').on('success', function(){
	 		alert('Save success');
	 	});
	 */
	withService:function(service){
		if(this.eventObjToBuild.service === undefined){
			this.eventObjToBuild.service = [];
		}
		this.eventObjToBuild.service.push(service);
		return this;
	},
	/**
	 Chained method for adding broadcaster events.
	 @function on
	 @param {String|Array} events
	 @param {Function} fn
	 @return {remote.Broadcaster}
     @memberof ludo.remote.Broadcaster.prototype
	 @example
	 	ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
	 		alert('Save success');
	 	}).on('start', function(){ alert('About to save') });
     Example with array:

        ludo.remoteBroadcaster.withResource('Person').withService('read').on('success', function(){
	 		alert('Save success');
	 	}).on(['start','success'], function(){ alert('Remote event') });
	 */
	on:function(events, fn){
        if(!ludo.util.isArray(events))events = [events];
        for(var i=0;i<events.length;i++){
		    this.addServiceEvent(events[i], this.eventObjToBuild.resource, this.eventObjToBuild.service, fn);
        }
		return this;
	}
});

ludo.remoteBroadcaster = new ludo.remote.Broadcaster();
/* ../ludojs/src/remote/message.js */
/*
 Class displaying all messages from remote requests

 Extends: ludo.View
 
 @namespace remote
 @class ludo.remote.Message
 @param {Object} config
 @example
 	children:[{
        type:'remote.Message',
        listenTo:["Person", "City.save"]
    }...

 will listen to all services of the "Person" resource and the "save" service of "City".

 */
ludo.remote.Message = new Class({
    // TODO support auto hide
    Extends:ludo.View,
    cls:'ludo-remote-message',

    /*
     Listen to these resources and events
     @config {Array|String} listenTo
     @example
        listenTo:"Person" // listen to all Person events
        listenTo:["Person.save","Person.read", "City"] // listen to "save" and "read" service of "Person" and all services of the "City" resource
     */
    listenTo:[],

    messageTypes:['success', 'failure', 'error'],

    __construct:function (config) {
        this.parent(config);
        this.__params(config, ['listenTo']);
        if (!ludo.util.isArray(this.listenTo))this.listenTo = [this.listenTo];
		this.validateListenTo();

    },

	validateListenTo:function(){
		for(var i=0;i<this.listenTo.length;i++){
			this.listenTo[i] = this.listenTo[i].replace(/\//g,'.');
		}
	},

    ludoEvents:function () {
        this.parent();
        var resources = this.getResources();
        for (var resourceName in resources) {
            if (resources.hasOwnProperty(resourceName)) {
                this.addResourceEvent(resourceName, resources[resourceName]);
            }
        }
    },

    getResources:function () {
        var ret = {};
        var resource, service;
        for (var i = 0; i < this.listenTo.length; i++) {
            if (this.listenTo[i].indexOf('.') >= 0) {
                var tokens = this.listenTo[i].split(/\./g);
                if (tokens.length === 2) {
                    service = tokens.pop();
                    resource = tokens[0];
                    service = service != '*' ? service : undefined;
                }
            } else {
                resource = this.listenTo[i];
                service = undefined;
            }

            if (ret[resource] == undefined) {
                ret[resource] = [];
            }
            if (service && ret[resource].indexOf(service) === -1) {
                ret[resource].push(service);
            }
        }
        return ret;
    },

    addResourceEvent:function (resource, service) {
        ludo.remoteBroadcaster.addServiceEvent("clear", resource, service, this.hideMessage.bind(this));
        for (var i = 0; i < this.messageTypes.length; i++) {
            ludo.remoteBroadcaster.addServiceEvent(this.messageTypes[i], resource, service, this.showMessage.bind(this));
        }
    },

    showMessage:function (response) {
        this.show();
        if (response.code && response.code !== 200) {
            this.getEl().addClass('ludo-remote-error-message');
        } else {
            this.getEl().removeClass('ludo-remote-error-message');
        }
        this.html(response.message);

        /*
         * Event fired when message is shown.
         * @event showMessage
         * @param {remote.Message} this
         */
        this.fireEvent('showMessage', this);
    },

    hideMessage:function () {
        this.html('');
    }
});/* ../ludojs/src/remote/error-message.js */
/**
 * Show error messages from remote requests
 * @namespace ludo.remote
 * @class ludo.remote.ErrorMessage
 * @augments ludo.remote.Message
 */
ludo.remote.ErrorMessage = new Class({
    Extends:ludo.remote.Message,
    messageTypes:['failure','serverError']
});/* ../ludojs/src/svg/group.js */
/**
 * SVG Group DOM node which can be positioned as a child view
 * in the relative layout.
 * @namespace canvas
 * @class ludo.svg.Group
 */
ludo.svg.Group = new Class({
    Extends: ludo.svg.View,
    type: 'svg.Group',
    tag: 'g',
    layout: {},

    /**
     * Width of SVG group
     * @property {Number} width
     * @memberof ludo.svg.Group.prototype
     */
    width: undefined,


    children: undefined,

    parentGroup: undefined,

    /**
     * Height of SVG group
     * @property {Number} height
     * @memberof ludo.svg.Group.prototype
     */
    height: undefined,

    child: undefined,

    /**
     * Object with left, top, width and height coordinates of group
     * This object is updated on calls to position() and resize()
     * @property {Object} bbox
     * @memberof ludo.svg.Group.prototype
     */
    bbox:undefined,

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['layout', 'renderTo', 'parentComponent', 'parentGroup', '__rendered']);

        this.layout = this.layout || {};
        this.layout.type = 'Canvas';

        config.children = config.children || this.__children();
        this.children = [];

        this.child = {};

        if (this.renderTo) {
            this.renderTo.append(this);
        }

        this.bbox = {
            left:0,top:0,width:0,height:0
        };

        jQuery.each(config.children, function (i, child) {
            child.layout = child.layout || {};
            child.parentGroup = this;
            this.children[i] = child = this.getLayout().addChild(child);
            child.renderTo = this;
            this.child[child.id || child.name] = child;
        }.bind(this));

        if (config.css) {
            this.node.css(this.css);
        }
    },

    __children: function () {
        return this.children || [];
    },

    __rendered: function () {


    },

    resize: function (coordinates) {
        if (coordinates.width) {
            this.width = this.bbox.width = Math.max(0, coordinates.width);
            this.set('width', coordinates.width + 'px');
        }
        if (coordinates.height) {
            this.height =this.bbox.height =  Math.max(0, coordinates.height);
            this.set('height', coordinates.height + 'px');
        }

        if (this.children.length > 0)this.getLayout().resizeChildren();

        this.fireEvent('resize', coordinates);
    },

    getSize: function () {
        return {
            x: this.width || this.renderTo.width(),
            y: this.height || this.renderTo.height()
        }
    },

    getCenter: function () {
        var s = this.getSize();
        return {
            x: s.x / 2, y: s.y / 2
        }
    },

    isHidden: function () {
        return false;
    },

    /**
     * Returns or set position of a SVG group. On no arguments, position will be returned, otherwise,
     * it will be set.
     * @param {Number} x
     * @param {Number} y
     * @returns {{left: *, top: *}}
     * @memberof ludo.svg.Group.prototype
     */
    position: function (x, y) {
        if (arguments.length > 0) {
            this.bbox.left = x;this.bbox.top = y;
            this.node.setTranslate(x, y);
        } else {
            var t = this.node.getTranslate();
            return {left: t[0], top: t[1]};
        }

    },


    getLayout: function () {
        if (!this.hasDependency('layoutManager')) {
            this.createDependency('layoutManager', ludo.layoutFactory.getManager(this));
        }
        return this.getDependency('layoutManager');
    },

    $b: function () {
        return this.node;
    },

    append: function (el) {
        return this.node.append(el);
    }
});/* ../ludojs/src/notification.js */
/**
 Class for providing short messages and feedback in a popup.
 Notifications automatically disappear after a timeout. Positioning
 of notification can be configured using the layout object.

 Custom CSS styling can be done by adding styles to the .ludo-notification class.
 
 @class ludo.Notification
 @parent ludo.View
 @param {Object} config
 @param {String} config.html Message to display
 @param {Number} config.duration Seconds before notification is automatically hidden. Default is 3
 @param {String} config.effect Default effect used for displaying and hiding the notification. Default: fade
 @param {String} config.showEffect Effect used when Notification is displayed(fade or slide)
 @param {String} config.hideEffect Effect used when Notification is hidden(fade or slide)
 @param {Number} config.effectDuration Duration of show/hide effect in seconds. Default: 1
 @param {Boolean} config.autoRemove True to automatically destroy the view(remove from DOM) hiding it, default:true 
 @summary new ludo.Notification({ ... });
 @example

 new ludo.Notification({
	html : 'Your e-mail has been sent', // message
	duration:4 // Hidden after 4 seconds
});

 new ludo.Notification({
 	html: 'Hello there!',
 	layout:{ // Position right of other view
 		rightOf:'idOfOtherView',
 		alignTop:'idOfOtherView'
 	},
 	autoRemove:true // Automatically remove from DOM when hidden
 });
 */
ludo.Notification = new Class({
	Extends:ludo.View,
	alwaysInFront:true,

	duration:3,
	showEffect:undefined,
	hideEffect:undefined,
	effect:'fade',
	effectDuration:0.4,
	autoRemove:true,

	__construct:function (config) {
		config.renderTo = config.renderTo || document.body;
		
        this.__params(config, ['autoRemove','showEffect','hideEffect','effect','effectDuration','duration']);
		this.showEffect = this.showEffect || this.effect;
		this.hideEffect = this.hideEffect || this.effect;
		if (!config.layout && !this.layout) {
			config.layout = {
				centerIn:config.renderTo
			};
		}
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		if(this.autoRemove){
			this.addEvent('hide', this.remove.bind(this));
		}
	},

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-notification');
	},

	__rendered:function () {
		if (!this.layout.width || !this.layout.height) {
			var size = ludo.dom.getWrappedSizeOfView(this);
			if (!this.layout.width)this.layout.width = size.x;
			if (!this.layout.height)this.layout.height = size.y;
		}
		this.parent();
		this.show();
	},

	hide:function () {
		if (this.hideEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getEndEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.onHideComplete.bind(this),
				this.getLayout().getRenderer().position()
			);
		} else {
			this.parent();
		}
	},

	show:function (html) {
		if(arguments.length == 1){
			this.html(html);
		}
		this.parent();

		if (this.showEffect) {
			var effect = new ludo.effect.Effect();
			effect[this.getStartEffectFn()](
				this.getEl(),
				this.effectDuration,
				this.autoHide.bind(this),
				this.getLayout().getRenderer().position()
			);
		}

	},

	getStartEffectFn:function () {
		switch (this.showEffect) {
			case 'fade':
				return 'fadeIn';
			case 'slide':
				return 'slideIn';
			default:
				return this.showEffect;
		}
	},

	getEndEffectFn:function () {
		switch (this.hideEffect) {
			case 'fade':
				return 'fadeOut';
			case 'slide':
				return 'slideOut';
			default:
				return this.hideEffect;
		}
	},

	autoHide:function () {
		this.hide.delay(this.duration * 1000, this);
	},

	onHideComplete:function () {
		this.getEl().css('display', 'none');
		this.fireEvent('hide', this);
	}
});/* ../ludojs/src/form/button.js */
/**
 * TODO specify which form the button belongs to. used for disableOnInvalid
 * Button component
 * The button class extends ludo.form.Element
 * @namespace ludo.form
 * @class ludo.form.Button
 * @param {Object} config
 * @param {Boolean} config.submittable Default: false. When false, the JSON from parentView.getForm().values() will not not include the button.
 * @param {Boolean} config.disabled Default: false. True to initially disable the button
 * @param {Boolean} config.selected True to set the button initial selected.
 * @param {Boolean} config.toggle When true, the button will remain in it's pressed until a new press on button occurs.
 * @param {String|Object} config.toggleGroup Used for toggling between buttons. Example: { type:'form.Button', toggle:true, toggleGroup:'myGroup',value:'1' }, 
 * { type:'form.Button', toggle:true, toggleGroup:'myGroup',value:'2' }. Here, two buttons are assigned to the same toggleGroup 'myGroup'. When one button is pressed,
 * the other button will be unpressed.
 * @param {Boolean} config.disableOnInvalid True to automatically disable button when parent form is invalid.
 * @param {String} config.size Size of button's','m','l' (small, medium or large)
 * @param {String} config.formRef Id of parent view. disableOnInvalid will be triggred when the form of this view is invalid.
 * @param {String} config.listeners Event listeners. Example:
 * <code>
 *     listeners: {
 *      'click': function() { }
 *      }
 * </code>
 * @param {String} config.icon Path to icon image placed left to button text.
 * @param {String} config.iconPressed Path to icon image displayed when button is pressed.
 * @fires ludo.form.Button#click Fired on click. Arguments: 1) valud, 2) ludo.form.Button
 */
ludo.form.Button = new Class({
    Extends:ludo.form.Element,
    type:'form.Button',
    defaultSubmit:false,
    inputType:'submit',
    cssSignature:'ludo-form-button',
    name:'',
    /*
     * Text of button
     * @attribute {String} value
     */
    value:'',
    els:{
        el:null,
        txt:null
    },
    component:null,

    menu:undefined,
    submittable:false,


    toggle:false,

    /*
     Assign button to a toggleGroup
     @memberof ludo.form.Button.prototype
     @attribute {Object} toggleGroup
     @default undefined
	 @example
		 var buttonLeft = new ludo.form.Button({
		 	value : 'left',
		 	toggle:true,
		 	toggleGroup:'alignment'
		 });

		 var buttonCenter = new ludo.form.Button({
		 	value : 'center',
		 	toggle:true,
		 	toggleGroup:'alignment'
		 });

	 which creates a singleton ludo.form.ToggleGroup instance and
	 assign each button to it.

	 When using a toggle group, only one button can be turned on. The toggle
	 group will automatically turn off the other button.

	 You can create your own ludo.form.ToggleGroup by extending
	 ludo.form.ToggleGroup and set the toggleGroup property to an
	 object:
	 @example
		 var buttonLeft = new ludo.form.Button({
		 	value: 'left',
		 	toggle:true,
		 	toggleGroup:{
		 		type : 'ludo.myapp.form.MyToggleGroup'
		 	}
		 });
     */

    toggleGroup:undefined,

    /*
     * Disable button when form of parent component is invalid
     * @memberof ludo.form.Button.prototype
     * @attribute {Boolean} disableOnInvalid
     * @default false
     */
    disableOnInvalid:false,

    /*
     * True to initially disable button
     * @attribute {Boolean} disabled
     * @default false
     */
    disabled:false,

    selected:false,

    overflow:'hidden',

    /*
     * Path to button icon
     * @attribute {String} icon
     * @memberof ludo.form.Button.prototype
     * @default undefined
     */
    icon:undefined,
    iconPressed:undefined,

    active:false,

	/*
	 * Size,i.e height of button. Possible values 's', 'm' and 'l' (small,medium, large)
     * @memberof ludo.form.Button.prototype
	 * @config {String} size
	 * @default 'm'
	 */
	size : 'm',

	iconWidths:{
		's' : 15,
		'm' : 25,
        'l' : 34,
		'xl' : 44
	},

	heights:{
		's' : 15,
		'm' : 25,
        'l' : 35,
		'xl' : 45
	},

    __construct:function (config) {
		this.parent(config);

        var val = config.value || this.value;
        var len = val ? val.length : 5;
        this.layout.width = this.layout.width || Math.max(len * 10, 80);


        this.__params(config, ['size','menu','icon','toggle','disableOnInvalid','defaultSubmit','disabled','selected','formView','iconPressed']);

        if (config.toggleGroup !== undefined) {
            if (ludo.util.type(config.toggleGroup) === 'string') {
                config.toggleGroup = {
                    type:'form.ToggleGroup',
                    id:'toggleGroup-' + config.toggleGroup
                };
            }
            config.toggleGroup.singleton = true;
            this.toggleGroup = ludo._new(config.toggleGroup);
            this.toggleGroup.addButton(this);
        }
    },


    ludoDOM:function () {
        this.parent();

        this.getEl().css('display', this.isHidden() ? 'none' : 'block');

		this.getEl().addClass('ludo-form-button-' + this.size);

        this.addLeftEdge();
        this.addRightEdge();

        this.addLabel();

        if (this.icon) {
            this.addIcon();
        }

        var b = this.$b();

        b.css('padding-left', 0);
        this.getEl().on('selectstart', ludo.util.cancelEvent);
    },

    ludoEvents:function () {
        this.parent();
        var el = this.$b();

        el.on('click', this.click.bind(this));
        el.mouseenter(this.mouseOver.bind(this));
        el.mouseleave(this.mouseOut.bind(this));
        el.on('mousedown', this.mouseDown.bind(this));

		// TODO need to bound in order to remove event later. Make this easier and more intuitive
		this.mouseUpBound = this.mouseUp.bind(this);
        jQuery(document.body).on('mouseup', this.mouseUpBound);
        if (this.defaultSubmit) {
			this.keyPressBound = this.keyPress.bind(this);
            jQuery(window).on('keypress', this.keyPressBound);
        }
    },

    __rendered:function () {
        this.parent();
        if (this.disabled) {
            this.disable();
        }
        if (this.toggle && this.active) {
            this.$b().addClass('ludo-form-button-pressed');
        }

        this.component = this.getParentComponent();
        if(this.component && this.disableOnInvalid){
            var m;
            if(this.formView != undefined){
                m = ludo.get(this.formView);
            }else{
                 m = this.component.getForm();
            }
            m.addEvent('valid', this.enable.bind(this));
            m.addEvent('invalid', this.disable.bind(this));
            if(!m.isValid())this.disable();
        }
    },

	remove:function(){
		this.parent();
		jQuery(document.body).off('mouseup', this.mouseUpBound);
		if (this.defaultSubmit) jQuery(window).off('keypress', this.keyPressBound);
	},

    addLabel:function () {
        var txt = this.els.txt = jQuery('<div>');
        txt.addClass('ludo-form-button-value');
        txt.css({
            'width':'100%',
			'height' : this.heights[this.size] - 2,
            'position':'absolute',
            'left':this.icon ? this.iconWidths[this.size] + 'px' : '0px',
            'text-align':this.icon ? 'left' : 'center',
            'z-index':7
        });
        txt.html(this.value);
        this.$b().append(txt);
    },

    addIcon:function () {
        var el = this.els.icon = jQuery('<div>');
        el.css({
            position:'absolute',
            width:this.iconWidths[this.size],
            'z-index':8,
            left:0,
            top:0,
            height:'100%',
            'background-image':'url(' + this.icon + ')',
            'background-repeat':'no-repeat',
            'background-position':'center center'
        });
        el.insertBefore(this.els.txt);

    },

    setIcon:function(src){
        if(!this.els.icon){
            this.addIcon();
        }
        this.icon = src;
        this.els.icon.css('background-image', 'url(' + src + ')');
    },

    addLeftEdge:function () {
        var bg = this.els.buttonLeftludo = jQuery('<div>');
        bg.addClass('ludo-form-button-bg-left');
        bg.addClass('ludo-form-button-' + this.size +'-bg-left');
        bg.css({
            position:'absolute',
            'left':0,
            'z-index':5
        });
        this.$b().append(bg);
    },

    addRightEdge:function () {
        var bg = jQuery('<div>');
        bg.addClass('ludo-form-button-bg-right');
        bg.addClass('ludo-form-button-' + this.size + '-bg-right');
        bg.css({
            position:'absolute',
            'right':0,
            'z-index':6
        });
        this.$b().append(bg);
    },

    disable:function () {
        this.disabled = true;
        if (this.els.body) {
            this.els.body.addClass('ludo-form-button-disabled');
            this.els.body.removeClass('ludo-form-button-over');
            this.els.body.removeClass('ludo-form-button-down');
        }
    },

    enable:function () {
        this.disabled = false;
        if (this.els.body) {
            this.els.body.removeClass('ludo-form-button-disabled');
        }
    },

    isDisabled:function () {
        return this.disabled;
    },

    setValue:function (value) {
        console.warn("Use of deprecated setValue");
        console.trace();
        this.value = value;
        this.els.txt.html( value);
    },

    val:function (value) {
        if(arguments.length != 0){
            this.value = value;
            this.els.txt.html( value);
        }else{
            return this.value;
        }
    },
    getValue:function () {
        console.warn("Use of deprecated button.getValue");
        console.trace();
        return this.value;
    },

    mouseOver:function () {

        if (!this.isDisabled()) {
            this.$b().addClass('ludo-form-button-over');
            this.fireEvent('mouseover', this);
        }
    },
    mouseOut:function () {
        if (!this.isDisabled()) {
            this.$b().removeClass('ludo-form-button-over');
            this.fireEvent('mouseout', this);
        }

    },
	isDown:false,
    mouseDown:function () {
        if (!this.isDisabled()) {
			this.isDown = true;
            this.$b().addClass('ludo-form-button-down');
            this.fireEvent('mousedown', this);

            if(this.els.icon && this.iconPressed){
                this.els.icon.css('background-image', 'url(' + this.iconPressed + ')');

            }
        }
    },
    mouseUp:function () {
        if (this.isDown && !this.isDisabled()) {

            this.$b().removeClass('ludo-form-button-down');
            this.fireEvent('mouseup', this);
        }

        if(this.els.icon && this.icon){
            this.els.icon.css('background-image', 'url(' + this.icon + ')');

        }

    },

    clickAfterDelay:function () {
        this.click.delay(10, this);
    },
    /**
     * Trigger click on button
     * @function click
     * @return {undefined|Boolean}
     * @memberof ludo.form.Button.prototype
     */
    click:function () {
        this.focus();
        if (!this.isDisabled()) {
            this.getEl().focus();

            this.fireEvent('click', [this._get(), this]);

            if (this.toggle) {
                if (!this.active) {
                    this.turnOn();
                } else {
                    this.turnOff();
                }
            }
			return false;
        }
    },
    getName:function () {
        return this.name;
    },
    defaultBeforeClickEvent:function () {
        return true;
    },

    isButton:function () {
        return true
    },
    borderSize:undefined,

    resizeDOM:function () {
        // TODO refactor - buttons too tall in relative layout
        if(this.borderSize == undefined)
            this.borderSize = ludo.dom.getBH(this.$b());

        this.$b().css('height', this.heights[this.size]  - this.borderSize);
    },

    validate:function () {
        /* Don't do anything for buttons */
    },

    getParentComponent:function () {
        var parent = this.getParent();
        if (parent && parent.type.indexOf('ButtonBar') >= 0) {
            return parent.getView_250_40();
        }
        return parent;
    },

    select:function () {
        this.$b().addClass('ludo-form-button-selected');
    },

    deSelect:function () {
        this.$b().removeClass('ludo-form-button-selected');
    },

    turnOn:function () {
        this.active = true;
        /*
         * Turn toggle button on
         * @event on
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('on', [this._get(), this]);
        this.$b().addClass('ludo-form-button-pressed');
    },

    turnOff:function () {
        this.active = false;
        /*
         * Turn toggle button off
         * @event off
         * @param {String} value, i.e. label of button
         * @param Component this
         */
        this.fireEvent('off', [this._get(), this]);
        this.$b().removeClass('ludo-form-button-pressed');
    },

    /**
     * Return instance of ludo.form.ToggleGroup
     * @function getToggleGroup
     * @return {Object} ludo.form.ToggleGroup
     * @memberof ludo.form.Button.prototype
     */
    getToggleGroup:function () {
        return this.toggleGroup;
    },

    isActive:function () {
        return this.active;
    }
});/* ../ludojs/src/paging/button.js */
/**
 * Base class, paging buttons for datasource.Collection
 * Assign a paging element to a data source by sending "id" or config object of
 * the source using the dataSource constructor property
 * @namespace ludo.paging
 * @class ludo.paging.Button
 * @augments ludo.form.Button
 */
ludo.paging.Button = new Class({
    Extends: ludo.form.Button,
    type : 'grid.paging.Next',
    width:25,
    buttonCls : '',
	tpl:undefined,
	onLoadMessage:undefined,

    ludoDOM:function(){
        this.parent();
        this.$b().addClass(this.buttonCls);
    },

    ludoEvents:function(){
        this.parent();
        this.dataSourceEvents();
    },

    dataSourceEvents:function(){
        var ds = ludo.get(this.dataSource);
        if(ds){
            this.addDataSourceEvents();
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

    addDataSourceEvents:function(){},

	JSON:function(){}
});/* ../ludojs/src/paging/next.js */
/**
 Button used to navigate to next page in a dataSource.JSONArray
 @namespace paging
 @class ludo.paging.Next
 @augments paging.Button
 
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Next',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.Next = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Next',
	buttonCls:'ludo-paging-next',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	/**
	 * Calls nextPage() method of data source
	 * @function nextPage
	 * @memberof ludo.paging.Next.prototype
	 */
	nextPage:function () {
		this.getDataSource().nextPage();
	}
});/* ../ludojs/src/paging/previous.js */
/**
 Button used to navigate to previous page in a dataSource.JSONArray
 @namespace ludo.paging
 @class ludo.paging.Last
 @augments ludo.paging.Button
 
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Previous',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.Previous = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Previous',
	buttonCls:'ludo-paging-previous',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	nextPage:function () {
		this.getDataSource().previousPage();
	}

});/* ../ludojs/src/paging/last.js */
/**
 Button used to navigate to last page in a dataSource.JSONArray
 @namespace ludo.paging
 @class ludo.paging.Last
 @augments ludo.paging.Button
 
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.Last',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.Last = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.Last',
	buttonCls:'ludo-paging-last',

	addDataSourceEvents:function () {
		this.addEvent('click', this.nextPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('lastPage', this.disable.bind(this));
		ds.addEvent('notLastPage', this.enable.bind(this));
	},

	nextPage:function () {
		this.getDataSource().lastPage();
	}
});/* ../ludojs/src/paging/first.js */
/**
 Button used to navigate to first page in a dataSource.JSONArray
 @namespace ludo.paging
 @class ludo.paging.First
 @augments ludo.paging.Button
 
 @param {Object} config
 @example
 	children:[
 		...
		 {
			 type:'paging.First',
			 dataSource:'myDataSource'
		 }
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.First = new Class({
	Extends:ludo.paging.Button,
	type:'grid.paging.First',
	buttonCls:'ludo-paging-first',

	addDataSourceEvents:function () {
		this.addEvent('click', this.firstPage.bind(this));
		var ds = this.getDataSource();
		ds.addEvent('firstPage', this.disable.bind(this));
		ds.addEvent('notFirstPage', this.enable.bind(this));

		if (ds.isOnFirstPage()) {
			this.disable();
		}
	},

	firstPage:function () {
		this.getDataSource().firstPage();
	}

});/* ../ludojs/src/form/number.js */
/**
 * A <a href="ludo.form.Text.html">ludo.form.Text</a> field accepting only numeric characters.
 * @namespace ludo.form
 * @class ludo.form.Number
 * @augments ludo.form.Text
 * @param {Object} config
 * @param {Number} config.minValue Optional minimum value
 * @param {Number} config.maxValue Optional maximum value
 * @param {Boolean} config.disableWheel Disable chaning values using mouse wheel.
 * @param {Boolean} config.reverseWheel Reverse wheel. Up = smaller value.
 * @param {Number} config.shiftIncrement Mouse wheel increment when shift key is pressed. Default = 10.
 */
ludo.form.Number = new Class({
    Extends:ludo.form.Text,
    type:'form.Number',
    regex:/^[0-9]+$/,
    validateKeyStrokes:true,
    formCss:{
        'text-align':'right'
    },

    stretchField:false,
    disableWheel:false,
    reverseWheel:false,
    shiftIncrement:10,

    __construct:function (config) {
        this.parent(config);
        this.__params(config, ['disableWheel','shiftIncrement','reverseWheel','minValue','maxValue']);

        if (this.minValue !== undefined)this.minValue = parseInt(this.minValue);
        if (this.maxValue !== undefined)this.maxValue = parseInt(this.maxValue);

        this.applyValidatorFns(['minValue','maxValue']);
    },

    ludoEvents:function () {
        this.parent();
        if (!this.disableWheel) {
            this.getFormEl().on('mousewheel', this._mouseWheel.bind(this));
        }
        this.getFormEl().on('keydown', this.keyIncrement.bind(this));
    },

    keyIncrement:function(e){
        if(e.key === 'up' || e.key === 'down'){
            if(e.key === 'up')this.incrementBy(1, e.shift);
            if(e.key === 'down')this.incrementBy(-1, e.shift);
            return false;
        }
        return undefined;
    },

    blur:function(){
        var value = this.getFormEl().val();
        if(!this.isValid(value)){
            if (this.minValue!==undefined && parseInt(value) < this.minValue) {
                value = this.minValue;
            }
            if (this.maxValue!==undefined && parseInt(value) > this.maxValue) {
                value = this.maxValue;
            }
            this._set(value);
        }
        this.parent();
    },

    /**
     * Update min value
     * @param {Number} minValue
     * @memberof ludo.form.Number.prototype
     */

    setMinVal:function(minValue){
        this.minValue = minValue;
    },
    /**
     * Update max value
     * @param {Number} maxValue
     * @memberof ludo.form.Number.prototype
     */
    setMaxValue:function(maxValue){
        this.maxValue = maxValue;
    },

    _mouseWheel:function (e) {
        var delta = (e.originalEvent.wheelDelta || e.originalEvent.detail) / 120;
        if(delta == 0)return;
        this.incrementBy(delta >0 ? 1 : -1, e.shift);	// Math.ceil because of a mystery error in either firefox or mootools
        return false;
    },

    incrementBy:function (value, shift) {
        if(!this.value){
            if(this.minValue){
                this._set(this.minValue);
                return;
            }
            this._set(0);
        }

        if(this.reverseWheel)value = value * -1;
        value = parseInt(this.value) + (shift ? value * this.shiftIncrement : value);
        if(this.maxValue && value > this.maxValue)value = this.maxValue;
        if(this.minValue !== undefined && value < this.minValue)value = this.minValue;
        if(this.isValid(value)){
            this._set(value);
			this.fireEvent('change', [ value, this ]);
        }
    },

    _get:function(){
        return parseFloat(this.parent());
    }
});/* ../ludojs/src/paging/page-input.js */
/**
 * Text input for navigating to a specific page in a datasource.Collection
 * @namespace ludo.paging
 * @class ludo.paging.PageInput
 * @augments form.Number
 */
ludo.paging.PageInput = new Class({
    Extends: ludo.form.Number,
    type : 'grid.paging.PageInput',
    width: 35,
    fieldWidth:30,
    minValue : 1,
    reverseWheel:true,

    ludoEvents:function(){
        this.parent();
        this.dataSourceEvents();
    },

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if(ds){
                ds.addEvent('page', this.setPageNumber.bind(this));
                ds.addEvent('load', this.updateMaxValue.bind(this));
                this.setPageNumber(ds.getPageNumber());
                this.addEvent('change', this.updateDataSourcePageNumber.bind(this));
                this.updateMaxValue();
            }

        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },
    setPageNumber:function(number){
        this.value = number;
        this.els.formEl.val(number);
    },

    updateDataSourcePageNumber:function(){
        this.getDataSource().toPage(this.val());
    },

    updateMaxValue:function(){
        this.maxValue = this.getDataSource().getPageCount();
    },

    JSON:function(){

	}
});/* ../ludojs/src/paging/current-page.js */
/**
 Displays current page number shown in a collection
 @class ludo.paging.TotalPages
 @param {Object} config
 @param {String} tpl Template string. default: {page}
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.CurrentPage = new Class({
	Extends:ludo.View,
	type:'grid.paging.CurrentPage',
	width:25,
	onLoadMessage:'',

	tpl:'{page}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-text');
		this.getEl().addClass('ludo-paging-current-page');
	},

	ludoEvents:function () {
		this.parent();
        this.dataSourceEvents();
	},

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if (ds) {
                ds.addEvent('page', this.setPageNumber.bind(this));
                this.setPageNumber(ds.getPageNumber());
            }
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

	resize:function(config){
		this.parent(config);
		this.$b().css('line-height', (this.$b().height() * 0.8) + 'px');
	},

	setPageNumber:function () {
		this.html(this.tpl.replace('{page}', this.getDataSource().getPageNumber()));
	},

	JSON:function () {

	}
});/* ../ludojs/src/paging/total-pages.js */
/**
 Displays number of pages in a data source
 @class ludo.paging.TotalPages
 @param {Object} config
 @param {String}config.tpl Template string. default: '/{pages}'.
 @example
 children:[
 ...
 {
			  type:'paging.TotalPages',
			  dataSource:'myDataSource'
		  }
 ...
 }
 where 'myDataSource' is the id of a dataSource.JSONArray object used by a view.
 */
ludo.paging.TotalPages = new Class({
	Extends:ludo.View,
	type:'grid.paging.TotalPages',
	width:25,
	onLoadMessage:'',

	tpl:'/{pages}',

	ludoDOM:function () {
		this.parent();
		this.getEl().addClass('ludo-paging-text');
		this.getEl().addClass('ludo-paging-total-pages');
	},

	ludoEvents:function () {
		this.parent();
        this.dataSourceEvents();
	},


	resize:function(config){
		this.parent(config);
		this.$b().css('line-height', (this.$b().height() * 0.8) + 'px');
	},

    dataSourceEvents:function(){
        if(ludo.get(this.dataSource)){
            var ds = this.getDataSource();
            if (ds) {
                ds.addEvent('load', this.setPageNumber.bind(this));
                ds.addEvent('pageCount', this.setPageNumber.bind(this));
                this.setPageNumber(ds.getPageNumber());
            }
        }else{
            this.dataSourceEvents.delay(100, this);
        }
    },

	setPageNumber:function () {
		this.html(this.tpl.replace('{pages}', this.getDataSource().getPageCount()));
	},

	JSON:function () {

	}
});/* ../ludojs/src/paging/nav-bar.js */
/**
 A view containing buttons and views for navigating in a dataSource.JSONArray.
 default children: ['paging.First','paging.Previous','paging.PageInput','paging.TotalPages','paging.Next','paging.Last']
 You can customize which views to show by using the children constructor property.
 @namespace ludo.paging
 @class ludo.paging.NavBar
 @augments View
 
 @param {Object} config
 @example
 	children:[
 		{
			type:'grid.Grid',
			columnManager:{
				...
			},
			dataSource:{
				url:'data-source/grid.php',
				id:'myDataSource'
			}

 		},
 		...
 		...
		{
			type:'paging.NavBar',
			dataSource:'myDataSource'
		}
 		...
 	}
 where 'myDataSource' is the id of a dataSource.JSONArray object used by the Grid above.
 */
ludo.paging.NavBar = new Class({
	Extends:ludo.View,
	type:'paging.NavBar',
	layout:'cols',
	height:25,

	children:[
		{
			type:'paging.First'
		},
		{
			type:'paging.Previous'
		},
		{
			type:'paging.PageInput'
		},
		{
			type:'paging.TotalPages'
		},
		{
			type:'paging.Next'
		},
		{
			type:'paging.Last'
		}
	],

	__construct:function (config) {
		this.parent(config);

		if (config.dataSource) {
			for (var i = 0; i < config.children.length; i++) {
				config.children[i].dataSource = config.dataSource;
			}
			this.dataSource = undefined;
		}
	},

	JSON:function(){

	}
});/* ../ludojs/src/form/select.js */
/**
 Select box (&lt;select>)
 @namespace ludo.form
 @class ludo.form.Select
 @param {Object} config
 @param {String} config.valueKey Name of key used for value, example: "value"
 @param {String} config.textKey Name of key used for displayed text, example: "text"
 @param {Object} config.emptyItem. Object shown when no value selected, example: { "text": "Please select", value: "" }
 @param {Array} config.options. Array of values, example: [{value:1, text: "First item"},{value:2, text:"Second item" }]
 @example
 {
     type:'form.Select',
     name:'country',
     valueKey:'id',
     textKey:'title',
     emptyItem:{
         id:'',title:'Where do you live?'
     },
     dataSource:{
         resource:'Country',
         service:'read'
     }
 }
 to populate the select box from the Country service on the server. The "id" column will be used as value for the options
 and title for the displayed text.

 @example
 {
     type:'form.Select',
     emptyItem:{
         value:'',text:'Please select an option'
     },
     options:[
         { value:'1',text : 'Option a' },
         { value:'2',text : 'Option b' },
         { value:'3',text : 'Option c' }
     ]
 }
 */
ludo.form.Select = new Class({
    Extends: ludo.form.Element,
    type: 'form.Select',
    emptyItem: undefined,
    valueKey: 'value',
    textKey: 'text',
    inputTag: 'select',
    inputType: '',
    dataSource: {},

    options: undefined,

    defaultDS: 'dataSource.JSONArray',

    __construct: function (config) {
        this.parent(config);
        this.__params(config, ['emptyItem', 'options', 'valueKey', 'textKey']);
        if (!this.emptyItem && this.inlineLabel) {
            this.emptyItem = {};
            this.emptyItem[this.textKey] = this.inlineLabel;
            this.inlineLabel = undefined;
        }
    },

    ludoEvents: function () {
        this.parent();
        if (this.dataSource) {
            if (this.options && this.dataSourceObj) {
                for (var i = 0; i < this.options.length; i++) {
                    this.dataSourceObj.addRecord(this.options[i]);
                }
            }
            this.populate();
            var ds = this.getDataSource();
            ds.addEvent('select', this.selectRecord.bind(this));
            ds.addEvent('update', this.populate.bind(this));
            ds.addEvent('delete', this.populate.bind(this));
            ds.addEvent('sort', this.populate.bind(this));
        }
    },

    selectRecord: function (record) {
        if (!jQuery.isPlainObject(record)) {
            this.__set(record);
        } else {
            this._set(record[this.valueKey]);

        }
        this.toggleDirtyFlag();
    },

    populate: function () {
        var data = this.dataSourceObj.getData() || [];

        this.getFormEl().find('option').remove();
        if (this.emptyItem) {
            this.addOption(this.emptyItem[this.valueKey], this.emptyItem[this.textKey]);
        }

        var isObj = data.length > 0 && jQuery.isPlainObject(data[0]);
        jQuery.each(data, function (i, item) {
            if (isObj) {
                this.addOption(item[this.valueKey], item[this.textKey]);
            } else {
                this.addOption(item, item);
            }
        }.bind(this));

        if (this.value) {
            this._set(this.value);
            this.setFormElValue(this.value);
        }
    },

    /**
     * Add new option element
     * @function addOption
     * @param {String} value
     * @param {String} text
     * @memberof ludo.form.Select.prototype
     */
    addOption: function (value, text) {
        var option = jQuery('<option value="' + value + '">' + text + '</option>');
        this.getFormEl().append(option);
    },

    resizeDOM: function () {
        this.parent();
    }
});/* ../ludojs/src/paging/page-size.js */
/**
 * Select box for setting page size of a Collection
 * @namespace ludo.paging
 * @class ludo.paging.PageSize
 */
ludo.paging.PageSize = new Class({
	Extends: ludo.form.Select,

	options:[
		{ value : 10, text : '10' },
		{ value : 25, text : '25' },
		{ value : 50, text : '50' },
		{ value : 100, text : '100' }
	],

	label : 'Page size',
	applyTo:undefined,

	__construct:function(config){
		this.applyTo = ludo.get(config.dataSource || this.applyTo);
		config.dataSource = undefined;
		this.parent(config);
	},

	ludoEvents:function(){
		this.parent();
		this.addEvent('change', this.setPageSize.bind(this));
	},

	setPageSize:function(){
		if(this.applyTo){
			this.applyTo.setPageSize(this.val());
		}
	}

});/* ../ludojs/src/theme/themes.js */
ludo.theme.Themes = new Class({
    currentTheme:undefined,

    themes: {
        twilight: {
            c100 : '#ffffff',
            c200 : '#eeeeee',
            c300 : '#aeb0b0',
            c400 : '#8b8c8c',
            c500 : '#535353',
            c600: '#424242',
            c700: '#383838',
            c800:'#282828',
            c900:'#282828',


            border: '#424242',
            background: '#535353',
            background2: '#535353',
            text : '#aeb0b0'
        },
        blue : {
            c100:'#ffffff',
            c200: '#d1e7ff',
            c300: '#c6e1ff',
            c400: '#a6cbf5',
            c500:'#354150',
            c600:'#000000',


            border: '#a6cbf5',
            background: '#535353',
            background2: '#535353',
            text : '#000000'

        },
        "light-gray": {
            c100 : '#FFFFFF',
            c200 : '#f5f5f5',
            c300 : '#e2e2e2',
            c400 : '#d7d7d7',
            c500 : '#c6c6c6',
            c600 : '#AAAAAA',
            c700 : '#777777',
            c800 : '#555555',
            c900 : '#000000',


            border: '#d7d7d7',
            background: '#FFFFFF',
            background2: '#e2e2e2',
            text : '#555555'
        }
    },

    addTheme:function(name, colors){
        this.themes[name] = colors;
    },

    setTheme:function(theme){

        if(this.themes[theme] == undefined){
            console.warn("Undefined theme " + theme);

        }

        var current = this.getCurrentTheme();

        if(current == theme)return;

        if(current){
            jQuery(document.body).removeClass("ludo-" + this.currentTheme);
        }

        this.currentTheme = theme;

        jQuery(document.body).addClass("ludo-" + theme);
    },

    getThemeEl:function(){
        var theme = this.getCurrentTheme();
        if(theme != undefined){
            return jQuery('.ludo-' + theme);
        }
        return jQuery(document.body);
    },

    getCurrentTheme:function(){
        if(this.currentTheme == undefined){
            var b = jQuery(document.documentElement);
            jQuery.each(this.themes, function(theme){
                if(!this.currentTheme){
                    var cls = '.ludo-' + theme;
                    var els = b.find(cls);
                    if(els.length > 0){
                        this.currentTheme = theme;
                    }
                }
            }.bind(this));
        }

        return this.currentTheme;
    },

    color:function(colorName){
        var theme = this.getCurrentTheme();


        if(!theme)return undefined;
        if(this.themes[theme] != undefined){
            return this.themes[theme][colorName];
        }

        return undefined;
    },
    
    clear:function(){
        this.currentTheme = undefined;
    }

});

/**
 * Instance of ludo.theme.Themes.
 * Used to update theme on demand
 * @type {Class|Type}
 */
ludo.Theme = new ludo.theme.Themes();


/**
 * Function which returns theme color
 * @function ludo.$C
 * @param {String} color Name of color
 */
ludo.$C = ludo.Theme.color.bind(ludo.Theme);
/* ../ludojs/src/form/label.js */
/**
 * Label for a ludo.form View
 *
 * A label will be assigned the css class ludo-form-el-invalid when the associated form element has an invalid value(not validated).
 * By default, this will render it with a red text.
 * @class ludo.form.Label
 * @param {Object} config
 * @param {String} label Text label
 * @param {String|ludo.form.Element} Reference to a ludo.form View which this label should be associated with.
 *
 */
ludo.form.Label = new Class({
    Extends: ludo.View,
    labelFor:undefined,
    label:undefined,
    type:'form.Label',

    __construct:function(config){
        this.parent(config);
        this.__params(config, ['label','labelFor']);
    },

    ludoDOM:function(){
        this.parent();
        
        this.els.label = jQuery('<label class="input-label" for="el-' + this.labelFor + '">' + this.label + '</label>');
        this.$b().append(this.els.label);
    },

    ludoEvents:function(){
        this.parent();
        this.addInvalidEvents.delay(40, this);
    },

    addInvalidEvents:function(){
        if(!this.labelFor)return;
        var view = ludo.get(this.labelFor);

        if(view){
            view.addEvent('valid', this.onValid.bind(this));
            view.addEvent('invalid', this.onInvalid.bind(this));
            view.addEvent('enable', this.onEnable.bind(this));
            view.addEvent('disable', this.onDisable.bind(this));
            if(!view.isValid())
                this.onInvalid();
        }
    },

    resizeDOM:function(){
        this.parent();
        this.els.label.css('line-height', this.$b().height() + 'px');
    },

    onEnable:function(){
        this.$b().removeClass('ludo-form-label-disabled');
    },

    onDisable:function(){
        this.$b().addClass('ludo-form-label-disabled');
    },

    onValid:function(){
        this.$b().removeClass('ludo-form-el-invalid');
    },

    onInvalid:function(){
        this.$b().removeClass('ludo-form-el-invalid');
        this.$b().addClass('ludo-form-el-invalid');
    }
});/* ../dhtml-chess/src/chess.js */
ludo.factory.createNamespace('chess');
var _w = (function(){ return this || (0,eval)('this'); }());

_w.chess = {
    language: {},
    plugins: {},
    pgn: {},
    wordpress:{},
    computer:{},
    view: {
        seek: {},
        board: {},
        highlight: {},
        notation: {},
        gamelist: {},
        folder: {},
        user: {},
        metadata: {},
        buttonbar: {},
        dialog: {},
        message: {},
        button: {},
        eco: {},
        pgn: {},
        tree: {},
        position: {},
        installer: {},
        command: {},
        menuItems: {},
        score: {}
    },
    parser: {},
    controller: {},
    model: {},
    remote: {},
    dataSource: {}
};

chess.UserRoles = {
    EDIT_GAMES: 1,
    GAME_IMPORT: 2,
    EDIT_FOLDERS: 4,
    MY_HISTORY: 8
};

chess.Views = {
    buttonbar: {
        game: 'buttonbar.game',
        bar: 'buttonbar.bar'
    },
    board: {
        board: 'board'
    },
    lists: {
        game: 'gameList'
    }
};

ludo.config.setDocumentRoot('../');
_w.chess.COOKIE_NAME = 'chess_cookie';

_w.chess.isWordPress = false;

_w.chess.events = {
    game: {
        loadGame:'loadGame',
        setPosition: 'setPosition',
        invalidMove: 'invalidMove',
        newMove: 'newMove',
        newMoves: 'newMoves',
        noMoves: 'noMoves',
        deleteMove: 'deleteMove',
        newaction: 'newaction',
        deleteAction: 'deleteAction',
        newVariation: 'newVariation',
        deleteVariation: 'deleteVariation',
        startOfGame: 'startOfGame',
        notStartOfGame: 'notStartOfGame',
        endOfBranch: 'endOfBranch',
        notEndOfBranch: 'notEndOfBranch',
        endOfGame: 'endOfGame',
        notEndOfGame: 'notEndOfGame',
        updatecomment: 'updatecomment',
        updateMetadata: 'updateMetadata',
        newGame: 'newGame',
        clearCurrentMove: 'clearCurrentMove',
        nextmove: 'nextmove',
        verifyPromotion: 'verifyPromotion',
        overwriteOrVariation: 'overwriteOrVariation',
        updateMove: 'updateMove',
        colortomove: 'colortomove',
        correctGuess: 'correctGuess',
        wrongGuess: 'wrongGuess',
        startAutoplay: 'startAutoplay',
        stopAutoplay: 'stopAutoplay',
        gameSaved: 'gameSaved',
        beforeLoad: 'beforeLoad',
        afterLoad: 'afterLoad',
        fen: 'fen'
    },

    view: {
        buttonbar: {
            game: {
                play: 'play',
                start: 'tostart',
                end: 'toend',
                previous: 'previous',
                next: 'next',
                pause: 'pause',
                flip: 'flip'
            }
        }
    }
};

ludo.config.setUrl('../router.php');
ludo.config.setFileUploadUrl('../router.php');
ludo.config.setDocumentRoot('../');
ludo.config.disableModRewriteUrls();/* ../dhtml-chess/src/view/chess.js */
/**
 * A special top in hierarchy chess view with support for theme attribute.
 * The properties described in the theme will be applied to child views
 * (example board, notations etc).
 * @class chess.view.Chess
 * @param {Object} config
 * @param {Object} config.theme
 * @example
 * new chess.view.Chess({
 *      renderTo:jQuery(document.body),
 *      layout:{
 *          height:'matchParent',width:'matchParent'
 *      },
 *      theme:{
                'chess.view.board.Board': {
                    background: {
                        borderRadius: '1%',
                        horizontal: ludo.config.getDocumentRoot() + 'images/board-bg/wood-strip-horizontal.png',
                        vertical: ludo.config.getDocumentRoot() + 'images/board-bg/wood-strip-vertical.png'
                    },
                    bgWhite:ludo.config.getDocumentRoot() + 'images/board/lighter-wood.png',
                    bgBlack:ludo.config.getDocumentRoot() + 'images/board/darker-wood.png',
                    plugins: [
                        {
                            type: 'chess.view.highlight.Arrow'
                        },
                        {
                            type: 'chess.view.highlight.ArrowTactic'
                        },
                        {
                            type: 'chess.view.highlight.SquareTacticHint'
                        }
                    ]
                },
                'chess.view.dialog.PuzzleSolved ':{
                    title: 'Nice one.',
                    html: 'You solved this chess puzzle. Click OK to load next.'
                }


            },
        children:[
            { type:'chess.view.board.Board'
            ...
            }
        ]
 */
chess.view.Chess = new Class({
    Extends: ludo.View,

    layout:{
        width:'matchParent', height:'matchParent'
    },
    __construct:function(config){

        if(config.theme == undefined && chess.THEME != undefined){
            config.theme = chess.THEME;
        }

        if(chess.THEME_OVERRIDES != undefined){
            config.theme = Object.merge(config.theme, chess.THEME_OVERRIDES);
        }

        if(config.theme != undefined){
            this.theme = config.theme;

            this.parseTheme();
            if(this.theme.css){
                this.updateCss();
            }
            config.children = this.parseChildren(config);

        }

        this.parent(config);
    },

    parseTheme:function(){
          jQuery.each(this.theme, function(k, entry){

              if(jQuery.isPlainObject(entry)){
                  this.parseThemeEntry(entry);
              }

          }.bind(this));
    },

    parseThemeEntry:function(entry){
        var r = ludo.config.getDocumentRoot();
        jQuery.each(entry, function(key, val){
            if(jQuery.type(val) == 'string'){
                entry[key] = val.replace('[DOCROOT]', r);
            }else if(jQuery.isPlainObject(val)){
                this.parseThemeEntry(val);
            }
        }.bind(this))
    },

    __rendered:function(){
        this.parent();
        if(this.theme && this.theme.name){
            jQuery(document.documentElement).addClass(this.cssClass());
        }
    },

    cssClass:function(){
        return 'chess-theme-' + this.theme.name;
    },

    updateCss:function(){
        new chess.util.DynamicStyles('.' + this.cssClass(), this.theme.css);
    },


    parseChildren:function(config){
        var children =  config.children || this.__children();

        this.parseBranch(children);
        
        return children;
    },
    
    parseBranch:function(children){
        jQuery.each(children, function(i, child){
            if(child.type && this.theme[child.type] != undefined){
                child = Object.merge(child, this.theme[child.type]);
            }
            if(child.children != undefined) {
                this.parseBranch(child.children);
            }

        }.bind(this));
    }
});/* ../dhtml-chess/src/util/dynamic-styles.js */
/**
 * Created by alfmagne1 on 21/01/2017.
 */
chess.util = chess.util || {};
chess.util.DynamicStyles = new Class({

    parentSelector:undefined,

    initialize:function(parentSelector, styles){

        this.parentSelector = parentSelector;
        jQuery.each(styles, function(selector, rules){

            this.insertRule(selector, rules);

        }.bind(this));

    },

    insertRule: function (selector, rules, contxt) {
        var context = contxt || document, stylesheet;
        if(selector.indexOf(',') > 0){
            selector = selector.split(/,/g);
        }
        if(!jQuery.isArray(selector)){
            selector = [selector];
        }

        jQuery.each(selector, function(i, sel){
            if(sel.indexOf('body.') == -1){
                selector[i] = this.parentSelector + ' ' + sel.trim();
            }
        }.bind(this));

        rules = this.rulesAsString(rules);
        if (typeof context.styleSheets == 'object') {
            if (context.styleSheets.length) {
                stylesheet = context.styleSheets[context.styleSheets.length - 1];
            }
            if (context.styleSheets.length) {
                if (context.createStyleSheet) {
                    stylesheet = context.createStyleSheet();
                }
                else {
                    context.getElementsByTagName('head')[0].appendChild(context.createElement('style'));
                    stylesheet = context.styleSheets[context.styleSheets.length - 1];
                }
            }
            if (stylesheet.addRule) {
                for (var i = 0; i < selector.length; ++i) {
                    stylesheet.addRule(selector[i], rules);
                }
            }
            else {
                stylesheet.insertRule(selector.join(',') + '{' + rules + '}', stylesheet.cssRules.length);
            }
        }
    },

    rulesAsString:function(rules){


        if(jQuery.isPlainObject(rules)){
            var ret = "";
            jQuery.each(rules, function(key, val){
                if(ret.length> 0){
                    ret += ';'
                }
                ret += key + ':';
                ret += val;

            });

            return ret;
        }

        return rules;

    }

});/* ../dhtml-chess/src/language/default.js */
/**
 * Default language specification
 * @type {Object}
 */
chess.language = {
    pieces:{
        'p':'',
        'b':'B',
        'r':'R',
        'n':'N',
        'q':'Q',
        'k':'K'
    },
    'clear':'Clear',
    'Good move':'Good move',
    'Poor move':'Poor move',
    'Very good move':'Very good move',
    'Very poor move':'Very poor move',
    'Questionable move':'Questionable move',
    'Speculative move':'Speculative move',
    'Position Setup':'Position Setup',
    'Castling':'Castling',
    'Side to move':'Side to move',
    'Add comment before':'Add comment before',
    'Add comment after':'Add comment after',

    'OK':'OK',
    'Cancel':'Cancel',
    'Sign in':'Sign in',
    'Sign out':'Sign out',
    'E-mail':'Email address',
    'Username':'Username',
    'Full name':'Full name',
    'Password':'Password',
    'Repeat password':'Repeat password',
    'rememberMe':'Remember me',
    'register':'Register',
    'invalidUserNameOrPassword':'Invalid username or password',
    'InvalidUsername':'This username is taken',
    'invalidEmail':'Invalid email address',
    'My profile':'My profile',
    'country':'Country',
    'Changes saved successfully':'Changes saved successfully',
    'Signed in as':'Signed in as',

    'Import games(PGN)':'Import games(PGN)',
    'saveGame':'Save game',
    'Game':'Game',

    'tacticPuzzleSolvedTitle':'Well done - Puzzle complete',
    'tacticPuzzleSolvedMessage':'Good job! You have solved this puzzle. Click OK to load next game',


    'commandWelcome':'Type in your commands. For help, type "help" + enter.',
    'command_help':'Displays help screen',
    'command_move':'Type "move + notation" or notation only(e.g. "e4") to add moves',
    'command_cls':'Clear screen',
    'command_load':'Load a specific game with this id from the database',
    'command_flip':'Flip board',
    'command_grade':'Grade current move',
    'command_forward':'Go to next move',
    'command_back':'Go to previous move',
    'command_fen':'Loads a fen position, example "fen 6k1/8/6p1/8/8/1P6/2b5/5K2 w - - 0 1"',

    "invalid game":"Invalid game",
    "invalid position":"Invalid game",
    "invalid move":"Invalid move",
    "Moving":"Moving",
    "Move updated to":"Move updated to",
    "Time":"Time",
    "From elo":"From elo",
    "To elo":"To elo",
    "Rated":"Rated",
    "Pgn File" : "Pgn File"
};

chess.getPhrase = function (phrase) {
    return chess.language[phrase] !== undefined ? chess.language[phrase] : phrase;
};/* ../dhtml-chess/src/view/notation/panel.js */
/**
 Chess notation panel

 CSS Classes used by the notation panel:

 div.dhtml-chess-notation-panel - for the entire panel
 span.notation-chess-move - css for a move, example: e4
 span.notation-chess-move-highlighted - css for highlighted(current) move
 span.notation-result - css for the result at the end (1-0, 1/2-1/2, 0-1)
 div.notation-branch - css for a line of moves(main line or variation)
 div.notation-branch-depth-0 - css for a lines of moves- main line has 0 at the end. A variation has 1, sub variation 2 and so on
 span.dhtml-chess-move-group - css for a pair of moves(example: 1. e4 e5)
 span.dhtml-chess-move-number - css for the move number in front of a move, example: 1.
 span.notation-comment - css for a comment

 Some css rules have default rules, so you may want to add !important; after your css settings,
 example:
 span-notation-chess-move-highlighted{
    color:#FFF; !important;
    background-color:#fff; important;
    border-radius:5px;
 }

 @namespace chess.view.notation
 @class Panel
 @extends View
 @constructor
 @param {Object} config
 @param {String} config.figurine For use of figurines(images). The chess pieces are located inside the images folder. The first characters in the file name describe their
 types, example: 'svg_alpha_bw'. It is recommended to use the files starting with 'svg' for this since these are small vector based image files.
 @param {Number} config.figurineHeight - Optional height of figurines in pixels, default: 18
 @param {Boolean} config.interactive - Boolean to allow game navigation by clicking on the moves(default: true). For tactics puzzles, the value should be false.
 @param {String} config.notations - 'short' or 'long'. Short format is 'e4'. Long format is 'e2-e4'. When using figurines, short format will always be used.
 @param {String} config.showContextMenu - True to support context menu for editing moves(grade, add comments etc). default: false
 @param {Boolean} config.showResult - Show result after last move, example: 1-0. Default: true
 @example
 children:[
 ...
 {
     type:'chess.view.notation.Panel',
     notations:'long',
     showContextMenu:true
 }
 ...
 */
chess.view.notation.Panel = new Class({
    Extends: ludo.View,
    type: 'chess.view.notation.Panel',
    module: 'chess',
    submodule: 'notation',
    css: {
        'overflow-y': 'auto'
    },
    highlightedMove: undefined,
    moveMap: {},
    moveMapNotation: {},
    notationKey: 'm',
    figurineHeight: 18,

    notations: 'short',
    contextMenuMove: undefined,
    currentMoveIndex: 0,
    moveIdPrefix: '',
    tactics: false,
    comments: true,
    currentModelMoveId: undefined,
    interactive: true,
    figurines: false,

    /**
     * Show context menu for grading of moves, comments etc
     * @config showContextMenu
     * @type {Boolean}
     * @default false
     */
    showContextMenu: false,

    showResult: false,

    setController: function (controller) {
        this.parent(controller);
        var c = this.controller = controller;
        c.on('startOfGame', this.goToStartOfBranch.bind(this));
        c.on('newGame', this.showMoves.bind(this));
        c.on('newMoves', this.showMoves.bind(this));
        c.on('deleteMove', this.showMoves.bind(this));
        c.on('setPosition', this.setCurrentMove.bind(this));
        c.on('nextmove', this.setCurrentMove.bind(this));
        c.on('correctGuess', this.setCurrentMove.bind(this));
        c.on('updateMove', this.updateMove.bind(this));
        c.on('newMove', this.appendMove.bind(this));
        c.on('beforeLoad', this.beforeLoad.bind(this));
        c.on('afterLoad', this.afterLoad.bind(this));
        // this.controller.addEvent('newVariation', this.createNewVariation.bind(this));
    },


    beforeLoad: function () {
        this.shim().show(chess.getPhrase('Loading game'));
    },

    afterLoad: function () {
        this.shim().hide();
    },

    __construct: function (config) {
        this.parent(config);
        if (!this.tactics) {
            this.showResult = true;
        }
        this.__params(config, ['showEval', 'notations', 'showContextMenu', 'comments', 'interactive', 'figurines', 'figurineHeight', 'showResult']);


        if (this.showContextMenu)this.contextMenu = this.getContextMenuConfig();

        this.notationKey = this.notations === 'long' ? 'lm' : 'm';
        this.moveIdPrefix = 'move-' + String.uniqueID() + '-';
    },

    showPlayedOnly: function () {
        this.tactics = true;
    },

    getContextMenuConfig: function () {
        return {
            listeners: {
                click: function (el) {
                    switch (el.action) {
                        case 'grade':
                            this.fireEvent('gradeMove', [this.getContextMenuMove(), el.icon]);
                            break;
                        case 'commentBefore':
                            this.fireEvent('commentBefore', [this.getContextMenuMove(), el.icon]);
                            break;
                        case 'commentAfter':
                            this.fireEvent('commentAfter', [this.getContextMenuMove(), el.icon]);
                            break;
                        case 'deleteMove':
                            this.fireEvent('deleteMove', this.getContextMenuMove());
                            break;
                    }
                }.bind(this),
                selectorclick: function (el) {
                    this.setContextMenuMove(el);
                }.bind(this)
            },
            selector: '.notation-chess-move',
            children: [
                {label: chess.getPhrase('Add comment before'), action: 'commentBefore'},
                {label: chess.getPhrase('Add comment after'), action: 'commentAfter'},
                {
                    label: 'Grade', children: [
                    {icon: '', label: chess.getPhrase('Clear'), action: 'grade'},
                    {icon: '!', label: chess.getPhrase('Good move'), action: 'grade'},
                    {icon: '?', label: chess.getPhrase('Poor move'), action: 'grade'},
                    {icon: '!!', label: chess.getPhrase('Very good move'), action: 'grade'},
                    {icon: '??', label: chess.getPhrase('Very poor move'), action: 'grade'},
                    {icon: '?!', label: chess.getPhrase('Questionable move'), action: 'grade'},
                    {icon: '!?', label: chess.getPhrase('Speculative move'), action: 'grade'}
                ]
                },
                {label: chess.getPhrase('Delete Move'), action: 'deleteMove'}
            ]
        };
    },
    ludoEvents: function () {
        if (this.interactive) {
            this.$b().on('click', this.clickOnMove.bind(this));
        }
    },

    ludoDOM: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-notation-panel');
    },

    setContextMenuMove: function (el) {
        this.contextMenuMove = {uid: jQuery(el).attr('moveId')}
    },

    getContextMenuMove: function () {
        return this.contextMenuMove;
    },

    clickOnMove: function (e) {
        var el = e.target;
        if (el.tagName.toLowerCase() == 'img')el = el.parentNode;
        if (jQuery(el).hasClass('notation-chess-move')) {
            this.fireEvent('setCurrentMove', {uid: jQuery(el).attr('moveId')});
            this.highlightMove(el);
        }
    },
    goToStartOfBranch: function () {
        this.clearHighlightedMove();
        this.$b().scrollTop(0);
    },

    setCurrentMove: function (model) {

        var move = model.getCurrentMove();
        if (move) {
            this.highlightMove(jQuery("#" + this.moveMapNotation[move.uid]));
        } else {
            this.clearHighlightedMove();
        }
    },
    highlightMove: function (move) {
        this.clearHighlightedMove();
        if (move == undefined)return;
        jQuery(move).addClass('notation-chess-move-highlighted');
        this.highlightedMove = jQuery(move).attr("id");
        this.scrollMoveIntoView(move);
    },

    clearHighlightedMove: function () {
        var el;
        if (el = jQuery("#" + this.highlightedMove)) {
            el.removeClass('notation-chess-move-highlighted');
        }
    },

    scrollMoveIntoView: function (move) {

        if (!move)return;
        if (move.position == undefined)move = jQuery(move);
        if (!move || !move.length)return;


        var moveTop = move.position().top + this.$b().scrollTop();
        var oh = move.outerHeight();

        this._scrollIntoView(moveTop, oh);
    },

    _scrollIntoView:function(moveTop, oh){

        var b = this.$b();
        var scrollTop = b.scrollTop();
        var bottomOfScroll = scrollTop + b.height();

        if ((moveTop + oh) > bottomOfScroll) {
            b.scrollTop(moveTop);
        } else if (moveTop < scrollTop) {
            b.scrollTop(Math.max(0, moveTop - 5));
        }
    },


    showMoves: function (model) {
        var move = model.getCurrentMove();
        if (move != undefined) {
            this.currentModelMoveId = move.uid;
        }
        this.$b().html('');

        var moves = this.getMovesInBranch(model.getMoves(), model.getStartPly(), 0, 0, 0);

        if (this.showResult) {
            moves.push(this.getResultDOM(model));
        }
        this.$b().html(moves.join(''));
    },

    getResultDOM: function (model) {
        var res = model.getResult();
        var r = [];
        r.push('<span class="notation-result">');
        r.push(res == -1 ? '0-1' : res == 1 ? '1-0' : res == 0.5 ? '1/2-1/2' : '*');
        r.push('</span>');
        return r.join('');

    },

    getMovesInBranch: function (branch, moveCounter, depth, branchIndex, countBranches) {
        var moves = [];

        if (this.tactics && !this.currentModelMoveId)return moves;

        if (this.tactics)depth = 0;

        moves.push('<span class="notation-branch-depth-' + depth + '">');
        if (depth) {
            switch (depth) {
                case 1:
                    if (branchIndex === 0) {
                        moves.push('[');
                    }
                    break;
                default:
                    moves.push('(');
            }
        }
        moves.push('<span class="notation-branch">');

        var s;
        var e = '</span>';
        var gs = false;

        for (var i = 0; i < branch.length; i++) {

            var pr = i > 0 ? branch[i-1] : undefined;

            s = i == 0 ? '<span class="dhtml-chess-move-group chess-move-group-first">' : '<span class="dhtml-chess-move-group">';
            var notation = branch[i][this.notationKey];
            if (i == 0 && moveCounter % 2 != 0 && notation) {
                if (gs) {
                    moves.push(e);
                }
                moves.push('<span class="dhtml-chess-move-number">..' + Math.ceil(moveCounter / 2) + '</span>');
                moves.push(s);
                gs = true;
            }
            if ((moveCounter % 2 === 0 || (pr && pr.comment && pr.comment.length > 0))&& notation) {
                if (gs) {
                    moves.push(e);
                }
                var moveNumber = Math.floor(moveCounter / 2) + 1;
                moves.push(s);
                gs = true;
                var prefix = (moveCounter % 2) == 1 ? ".." : "";
                moves.push('<span class="dhtml-chess-move-number">' + moveNumber + '.' + prefix + '</span>');
            }
            if (notation) {
                moveCounter++;
            }
            this.currentMoveIndex++;
            moves.push('<span class="dhtml-chess-move-container-' + branch[i].uid + '">');

            moves.push(this.getDomTextForAMove(branch[i]));
            moves.push('</span>');

            if (this.tactics && branch[i].uid === this.currentModelMoveId) {
                i = branch.length;
            } else {
                if (!this.tactics || this.isCurrentMoveInVariation(branch[i])) {

                    if (gs && this.hasVars(branch[i])) {
                        gs = false;
                        moves.push(e);
                    }
                    this.addVariations(branch[i], moves, moveCounter, depth);
                }
            }
        }
        if (gs) {
            moves.push('</span>');
        }
        moves.push('</span>');
        if (depth) {
            switch (depth) {
                case 1:
                    if (branchIndex == countBranches - 1) {
                        moves.push(']');
                    }
                    break;
                default:
                    moves.push(')');
            }
        }
        moves.push('</span>');
        return moves;
    },

    hasVars: function (move) {
        return move.variations && move.variations.length > 0;
    },

    addVariations: function (move, moves, moveCounter, depth) {
        if (move.variations && move.variations.length > 0) {
            for (var j = 0; j < move.variations.length; j++) {
                if (move.variations[j].length > 0) {
                    moves.push(this.getMovesInBranch(move.variations[j], moveCounter - 1, depth + 1, j, move.variations.length).join(' '));
                }
            }
        }
    },

    isCurrentMoveInVariation: function (move) {
        if (this.hasVars(move)) {
            for (var j = 0; j < move.variations.length; j++) {
                if (move.variations[j].length > 0) {
                    var m = move.variations[j];
                    if (m.uid == this.currentModelMoveId)return true;
                    if (m.variations)return this.isCurrentMoveInVariation(m);
                }
            }
        }
        return false;
    },

    showEval:false,

    getDomTextForAMove: function (move) {
        var ret = [];


        ret.push('<span id="' + move.uid + '" class="notation-chess-move-c ' + move.uid + '" moveId="' + move.uid + '">');


        if (move[this.notationKey]) {
            ret.push('<span id="move-' + move.uid + '" class="notation-chess-move chess-move-' + move.uid + '" moveId="' + move.uid + '">');
            if (this.figurines && move['m'].indexOf('O') == -1 && move.p.type != 'p') {
                var p = move.p;
                var c = p.color.substr(0, 1);
                var t = p.type == 'n' ? 'n' : p.type.substr(0, 1);
                var src = ludo.config.getDocumentRoot() + '/images/' + this.figurines + '45' + c + t + '.svg';
                ret.push('<img width="' + this.figurineHeight + '" height="' + this.figurineHeight + '" style="vertical-align:text-bottom;height:' + this.figurineHeight + 'px" src="' + src + '">' + (move['m'].substr(p.type == 'p' ? 0 : 1)));
            } else {
                ret.push(move[this.notationKey]);
            }
            ret.push('</span>');
        }
        if(this.showEval && move.eval){
            ret.push('<span class="notation-chess-move-eval notation-chess-move-eval-');
            if(move.eval < 0){
                ret.push('negative');
            }else{
                ret.push('positive');
            }
            ret.push('">' + move.eval + '</span>');
        }

        if (this.comments && move.comment) {
            ret.push('<span class="notation-comment">' + move.comment + '</span>')
        }
        ret.push('</span>');

        this.moveMap[move.uid] = move.uid;
        this.moveMapNotation[move.uid] = 'move-' + move.uid;

        return ret.join('');
    },


    updateMove: function (model, move) {
        var domEl = this.$e.find('.dhtml-chess-move-container-' + move.uid);
        if (domEl.length) {
            domEl.html(this.getDomTextForAMove(move));
        } else {
            this.showMoves(model);
        }
        this.setCurrentMove(model);
    },

    appendMove: function (model, move) {

        var previousMove = model.getPreviousMoveInBranch(move);
        if (previousMove) {
            var branch = this.getDomBranch(previousMove);
            var id = this.moveIdPrefix + this.currentMoveIndex;
            this.currentMoveIndex++;

            var moveString = '';
            var moveCounter = model.getBranch(move).length - 1 || 0;
            if (moveCounter % 2 === 0 && moveCounter > 0) {
                var moveNumber = (moveCounter / 2) + 1;
                moveString = moveNumber + '. ';
            }
            moveString += this.getDomTextForAMove(move, id);
            branch.html(branch.html() + moveString);

        } else {
            this.showMoves(model);
        }
        this.setCurrentMove(model);
    },

    getDomBranch: function (move) {
        var domEl = jQuery("#" + this.moveMap[move.uid]);
        return domEl.closest('.notation-branch');
    },

    getFirstBranch: function () {
        return this.$b().getElement('.notation-branch');
    }
});/* ../dhtml-chess/src/view/notation/tactic-panel.js */
chess.view.notation.TacticPanel = new Class({
    Extends: chess.view.notation.Panel,
    tactics : true,
    setController:function(controller){
        controller.addEvent('nextmove', this.showMoves.bind(this));
        controller.addEvent('newGame', this.clearCurrentMove.bind(this));
        this.parent(controller);
    },
    clearCurrentMove:function(){
        this.currentModelMoveId = undefined;
    },
    clickOnMove:function(e){

    }
});/* ../dhtml-chess/src/view/notation/table.js */
chess.view.notation.Table = new Class({
    Extends: chess.view.notation.Panel,
    type: 'chess.view.notation.Table',

    showContextMenu:false,

    
    ludoDOM:function(){
        this.parent();
        this.$e.addClass('dhtml-chess-notation-table');
    },
    
    showEval:false,
    
    getMovesInBranch: function (branch, startPly, depth, branchIndex, countBranches) {
        this.comments = false;
        var ret = [];
        ret.push('<ol>');

        jQuery.each(branch, function(i, move){
            var ply = i + startPly;
            if(i == 0 && ply % 2 == 1){
                ret.push('<li><dt>' + ( Math.ceil(ply / 2)) + '</dt><dd>&nbsp;</dd>');
            }
            if((ply % 2) == 0){
                if(i> 0){
                    ret.push('</li>');
                }
                ret.push('<li>');

                ret.push('<dt>' + (1 + Math.ceil(ply / 2)) + '</dt>');
            }

            move.eval = ((Math.random() * 4) - (Math.random() * 4));
            ret.push('<dd>' + this.getDomTextForAMove(move) + "</dd>");

        }.bind(this));
        ret.push('</li>');
        ret.push('</ol>');
        return ret;
    },

    appendMove:function(){
        this.showMoves(this.controller.currentModel);
        this.setCurrentMove(this.controller.currentModel);
    },

    scrollMoveIntoView: function(move){
        if(!move)return;
        if (move.position == undefined)move = jQuery(move);
        var moveTop = move.offset().top - this.$b().offset().top + this.$b().scrollTop();
        var oh = move.outerHeight();
        this._scrollIntoView(moveTop, oh);
    },
    
    addVariations:function(){
        // silent is golden
    },

    getResultDOM:function(model){
        return '<p class="game-result">' + this.parent(model) + '</p>';
    }
});/* ../dhtml-chess/src/view/notation/last-move.js */
chess.view.notation.LastMove = new Class({
    Extends: ludo.View,
    module:'chess',
    type: 'chess.view.notation.LastMove',
    lastIndex: 1,
    figurines: 'svg_bw',
    boxWidth: undefined,
    curPos: undefined,
    figurineHeight:20,

    __construct:function(config){
        this.parent(config);
        this.__params(config, ['figurineHeight', 'figurines']);
    },
    setController: function (controller) {
        this.parent(controller);
        controller.on('fen', this.update.bind(this));
        controller.on('newmove', this.update.bind(this));
    },

    update: function (model) {


        var fen = model.getCurrentPosition();

        var tokens = fen.split(/\s/g);
        var fm = tokens[tokens.length - 1];
        var m = fm * 2;
        var c = tokens[tokens.length - 5];
        if (c == 'b') {
            m++;

        } else {
            fm--;
        }

        if (m != this.lastIndex) {

            var cm = model.getCurrentMove();

            var pos = -1;
            var dom = this.getDOMForMove(cm, fm, c);
            var el;

            if (m > this.lastIndex) {
                pos = -2;
                this.els.right.html(dom);
                el = this.els.right;
            } else {
                pos = 0;
                this.els.left.html(dom);
                el = this.els.left;
            }

            this.animate(pos, el);
            this.lastIndex = m;
        }
    },

    animate: function (pos, el) {
        this.els.mc.animate({
            left: pos * this.boxWidth
        }, {
            duration: 100,
            complete: function () {
                this.els.center.html(el.html());
                this.els.mc.css('left', -this.boxWidth);
                this.curPos = pos;

            }.bind(this)
        });
    },

    getDOMForMove: function (move, num, color) {

        if (!move)return '';

        var ret = '';
        ret += '<span class="dhtml-chess-notation-last-move-num">' + num + '</span>. ';
        if (color == 'w')ret += ' ..';

        if (this.figurines && move['m'].indexOf('O') == -1 && move.p.type != 'p') {
            var p = move.p;
            var c = p.color.substr(0, 1);
            var t = p.type == 'n' ? 'n' : p.type.substr(0, 1);
            var src = ludo.config.getDocumentRoot() + '/images/' + this.figurines + '45' + c + t + '.svg';
            ret += '<img width="' + this.figurineHeight + '" height="' + this.figurineHeight + '" style="vertical-align:text-bottom;height:' + this.figurineHeight + 'px" src="' + src + '">';
            ret += (move['m'].substr(p.type == 'p' ? 0 : 1));
        } else {
            ret += move['m'];
        }
        return ret;
    },

    resize: function (size) {
        this.parent(size);
        var w = this.$b().width();
        
        var h= this.$b().height();
        this.els.mc.css({
            'line-height': (h) + 'px',
            'font-size': (h * 0.4) + 'px',
            left: -w
        });
        this.els.left.css({
            width: w
        });
        this.els.center.css({
            width: w
        });
        this.els.right.css({
            width: w
        });
        this.boxWidth = w;
    },

    __rendered: function () {
        this.parent();

        this.$b().addClass('dhtml-chess-notation-last-move');
        this.els.mc = jQuery('<div></div>');
        this.els.mc.css({
            position: 'absolute',
            height: '100%',
            width: '300%'
        });
        this.$b().append(this.els.mc);

        this.els.left = jQuery('<div></div>');
        this.els.left.css({
            height: '100%', 'float': 'left'
        });
        this.els.mc.append(this.els.left);
        this.els.center = jQuery('<div></div>');
        this.els.center.css({
            height: '100%', 'float': 'left'
        });
        this.els.mc.append(this.els.center);
        this.els.right = jQuery('<div></div>');
        this.els.right.css({
            height: '100%', 'float': 'left'
        });
        this.els.mc.append(this.els.right);
    }
});/* ../dhtml-chess/src/view/board/gui.js */
/**
 * Javascript Class for Chess Board and Pieces on the board
 * JSON config type: chess.view.board.Board
 * @module View
 * @submodule Board
 * @namespace chess.view.board
 * @class GUI
 * @extends View
 */
chess.view.board.GUI = new Class({
    Extends: ludo.View,
    type: 'chess.view.board.GUI',
    module: 'chess',
    submodule: 'board',
    labels: true,
    labelPos: 'outside', // outside or inside - inside = in the corner of the left and bottom squares.
    flipped: false,
    boardLayout: undefined,
    vAlign: 'middle',
    boardCls: undefined,
    boardCss: undefined,
    lowerCaseLabels: false,
    background: undefined,

    bg: undefined,

    padding: undefined,

    internal: {
        squareSize: 30,
        piezeSize: 30,
        squareSizes: [15, 30, 45, 60, 75, 90, 105],
        timestampLastResize: 0
    },

    labelOddStyles: undefined,
    labelEvenStyles: undefined,
    labelStyles: undefined,

    squareStyles_white:undefined,
    squareStyles_black:undefined,

    __construct: function (config) {

        this.parent(config);
        this.padding = '3.5%';

        this.__params(config, [
            'background',
            'labels', 'boardCls', 'boardCss', 'boardLayout', 'lowerCaseLabels', 'chessSet', 'vAlign',
            'labelPos', 'labelStyles', 'labelOddStyles', 'labelEvenStyles', 'padding',
            'bgWhite', 'bgBlack','squareStyles_white', 'squareStyles_black']);


        if (!jQuery.isPlainObject(this.padding)) {
            this.padding = {
                l: this.padding, t: this.padding, r: this.padding, b: this.padding
            }
        }
    },

    updateBackgroundPattern: function (horizontal, vertical) {
        if (this.bg) {
            this.bg.setPattern(horizontal, vertical)
        }
    },

    /**
     * Update css styling of labels
     * @function setLabelStyles
     * @param {object} stylesFiles
     * @param {object} stylesRanks
     * @memberof ludo.chess.view.board.Gui.prototype
     */
    setLabelStyles: function (stylesFiles, stylesRanks) {
        this.$b().find('.dhtml-chess-board-label-file').css(stylesFiles);
        this.$b().find('.dhtml-chess-board-label-rank').css(stylesRanks || stylesFiles);
    },

    hideLabels: function () {

    },

    setPaddings: function (l, t, r, b) {
        if (arguments.length == 1) {
            t = r = b = l;
        }

        this.padding = {
            l: l, t: t, r: r, b: b
        };

        this.resizeBoard();

    },

    ludoDOM: function () {
        this.parent();

        this.els.labels = {};

        this.$b().css({
            'padding': 0,
            'margin': 0,
            'border': 0
        });

        if (this.background) {
            this.bg = new chess.view.board.Background(
                Object.merge({
                    view: this
                }, this.background)
            )
        }

        this.createBoardContainer();
        if (this.hasLabelsOutside()) {
            this.addLabelsForRanks();
        }

        this.createContainerForBoardAndFileLabels();
        this.createBoard();
        this.createSquares();
        this.createPieceContainer();

        if (this.hasLabelsInside()) {
            this.addLabelsForRanks();
        }


        if (this.hasLabels()) {
            this.addLabelsForFiles();
        }


        if (this.boardLayout) {
            this.els.boardContainer.addClass('dhtml-chess-board-container-' + this.boardLayout);
        }
    },
    ludoEvents: function () {
        this.parent();
        jQuery(document.documentElement).on('keypress', this.receiveKeyboardInput.bind(this));
    },

    receiveKeyboardInput: function (e) {
        if (e.control && e.key === 'f') {
            this.flip();
        }
    },

    __rendered: function () {
        this.parent();

        if(this.bgWhite){
            this.setSquareBg('white', this.bgWhite);
        }
        if(this.bgBlack){
            this.setSquareBg('black', this.bgBlack);
        }
        this.resizeSquares();
        this.resizeBoard.delay(50, this);
        this.updateLabels();
    },

    hasLabelsOutside: function () {
        return this.labels && this.labelPos == 'outside';
    },
    hasLabelsInside: function () {
        return this.labels && this.labelPos == 'inside';
    },
    hasLabels: function () {
        return this.labels;
    },

    createBoardContainer: function () {
        var el = this.els.boardContainer = jQuery('<div>');
        el.addClass('dhtml-chess-board-container');
        if (this.boardCss) {
            el.css(this.boardCss);
        }
        if (this.boardCls) {
            el.addClass(this.boardCls);
        }
        this.$b().append(el);
    },

    createContainerForBoardAndFileLabels: function () {
        var el = this.els.boardContainerInner = jQuery('<div>');
        el.css('float', 'left');
        this.els.boardContainer.append(el);
    },

    createBoard: function () {
        this.els.board = jQuery('<div class="dhtml-chess-board"></div>');
        this.els.board.css({
            position: 'relative',
            margin: 0,
            padding: 0,
            width: this.internal.squareSize * 8,
            height: this.internal.squareSize * 8
        });
        this.els.boardContainerInner.append(this.els.board);
    },

    createSquares: function () {
        var files = 'abcdefgh';
        this.els.squares = [];

        for (var i = 0; i < 64; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            var el = this.els.squares[i] = jQuery('<div class="dhtml-chess-square" style="position:relative"></div>');
            this.els.board.append(el);
            var backgroundPos = Math.round(Math.random() * 100) * -1;
            el.css('backgroundPosition', backgroundPos + 'px ' + backgroundPos + 'px');
        }
        this.updateSquares();
    },

    getSquares: function () {
        return this.els.squares;
    },

    createPieceContainer: function () {
        this.els.pieceContainer = jQuery('<div>');
        this.els.pieceContainer.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
        });
        this.els.board.append(this.els.pieceContainer);
    },

    squareBg_white: undefined,
    squareBg_black: undefined,

    setSquareBg: function (color, background) {
        if (color != 'white' && color != 'black')return;
        this['squareBg_' + color] = background;
        this.updateSquares();
    },

    updateSquares: function () {
        var types = ['white', 'black'];
        var index = 0;
        for (var i = 0; i < 64; i++) {
            index++;
            if (i % 8 == 0) {
                index++;
            }

            var t = types[index % 2];
            this.els.squares[i].css('float', 'left');
            this.els.squares[i].addClass('dhtml-chess-square-' + t);


            if (this['squareStyles_' + t] != undefined) {
                this.els.squares[i].css(this['squareStyles_' + t]);

            }
            if (this['squareBg_' + t] != undefined) {
                this.els.squares[i].css('background-image', 'url(' + this['squareBg_' + t] + ')');

            }
        }
    },

    flipSquares: function () {
        var squares = [];
        for (var i = this.els.squares.length - 1; i >= 0; i--) {
            this.els.board.append(this.els.squares[i]);
            squares.push(this.els.squares[i]);
        }
        this.els.squares = squares;
    },

    addLabelsForFiles: function () {
        var el = this.els.labels.files = jQuery('<div class="dhtml-chess-board-label-files-container ludo-noselect"></div>');
        el.css({
            position: 'absolute', 'z-index': 100, 'bottom': 0
        });
        if (this.labelPos == 'inside') {
            el.css('bottom', 0);
            el.addClass('dhtml-chess-board-label-inside');
        }
        this.els.files = [];
        for (var i = 0; i < 8; i++) {
            var odd = i % 2 == 0;
            var file = this.els.files[i] = jQuery('<div class="dhtml-chess-board-label dhtml-chess-board-label-file"></div>');

            if (this.labelStyles) {
                file.css(this.labelStyles);
            }
            if (odd && this.labelOddStyles) {
                file.css(this.labelOddStyles)
            }
            if (!odd && this.labelEvenStyles) {
                file.css(this.labelEvenStyles)

            }

            file.addClass('dhtml-chess-board-label-' + (odd ? 'odd' : 'even'));
            file.css({
                'width': (100 / 8) + '%',
                'float': 'left',
                'overflow': 'hidden'
            });
            el.append(file);
        }


        var parent = this.labelPos == 'outside' ? this.els.boardContainer : this.els.board;

        parent.append(el);
    },

    addLabelsForRanks: function () {
        var el = this.els.labels.ranks = jQuery('<div class="dhtml-chess-board-label-ranks-container  ludo-noselect"></div>');
        if (this.labelPos == 'inside') {
            el.addClass('dhtml-chess-board-label-inside');
        }
        el.css({
            position: 'absolute',
            'float': 'left',
            left: '0px', top: '0px',
            height: '100%', 'z-index': 100
        });

        if (this.labelpos == 'outside') {
            el.css('text-align', 'center');
        }
        this.els.ranks = [];
        for (var i = 0; i < 8; i++) {
            var odd = (i + 1) % 2 == 0;
            var rank = this.els.ranks[i] = jQuery('<div class="dhtml-chess-board-label dhtml-chess-board-label-rank"></div>');
            if (this.labelStyles) {
                rank.css(this.labelStyles);
            }
            if (odd && this.labelOddStyles) {
                rank.css(this.labelOddStyles)
            }
            if (!odd && this.labelEvenStyles) {
                rank.css(this.labelEvenStyles)

            }
            rank.addClass('dhtml-chess-board-label-' + ((i + 1) % 2 == 0 ? 'odd' : 'even'));
            rank.css({
                'height': (100 / 8) + '%',
                'overflow': 'hidden'
            });
            if (this.labelPos == 'outside') {
                rank.css('line-height', this.internal.squareSize);

            }

            el.append(rank);
        }


        var parent = this.labelPos == 'outside' ? this.els.boardContainer : this.els.board;

        parent.append(el);
    },

    updateLabels: function () {
        if (!this.hasLabels()) {
            return;
        }
        var ranks, files;
        if (!this.isFlipped()) {
            files = 'ABCDEFGH';
            ranks = '87654321';
        } else {
            files = 'HGFEDCBA';
            ranks = '12345678';

        }
        if (this.lowerCaseLabels) {
            files = files.toLowerCase();
        }
        for (var i = 0; i < 8; i++) {
            this.els.ranks[i].html('<span>' + ranks.substr(i, 1) + '</span>');
            this.els.files[i].html('<span>' + files.substr(i, 1) + '</span>');

        }
    },

    resizeDOM: function () {
        this.parent();
        this.internal.timestampLastResize = this.getTimeStamp();
        this.resizeBoard();
    },

    autoResizeBoard: function () {
        this.resizeBoard();
    },
    lastBoardSize: {x: 0, y: 0},

    boardCoordinates: function () {
        var b = this.els.boardContainer;
        var bodyOff = this.$b().offset();
        var off = b.offset();

        var ret = {
            left: off.left - bodyOff.left,
            top: off.top - bodyOff.top
        };
        ret.width = this.els.boardContainer.outerWidth();
        ret.height = this.els.boardContainer.outerHeight();
        return ret;
    },

    resizeBoard: function () {

        ludo.dom.clearCache();

        var bc = this.els.boardContainer;
        var pl = this.getP('l');
        var pt = this.getP('t');
        var pr = this.getP('r');
        var pb = this.getP('b');



        bc.css({
            'padding-left': pl,
            'padding-top': pt,
            'padding-right': pr,
            'padding-bottom': pb
        });

        var boardSize = Math.min(
            this.$b().width() - (this.els.boardContainer.outerWidth() - this.els.boardContainer.width()),
            this.$b().height() - (this.els.boardContainer.outerHeight() - this.els.boardContainer.height())
        );

        if (boardSize < 10 || (boardSize == this.lastBoardSize.x && boardSize == this.lastBoardSize.y)) {
            return;
        }

        this.lastBoardSize = boardSize;

        boardSize = Math.max(this.internal.squareSizes[0] * 8, Math.floor(boardSize / 8) * 8);
        if (isNaN(boardSize) || boardSize < 0) {
            return;
        }

        var mt = 0;

        if (this.vAlign == 'middle') {
            mt = Math.max(0, (this.$b().height() - this.$b().width()) / 2);
        } else if (this.vAlign == 'bottom') {
            mt = Math.max(0, (this.$b().height() - this.$b().width()));
        }

        this.els.boardContainer.css({
            top: mt,
            width: boardSize + 'px',
            height: boardSize + 'px'
        });

        this.internal.pieceSize = this.getNewPieceSize();

        var w = this.els.boardContainer.width() - (this.els.board.outerWidth() - this.els.board.width());
        this.internal.squareSize = w / 8;

        this.els.board.css({
            position: 'absolute',
            left: pl,
            top: pt,
            width: w,
            height: this.els.boardContainer.height() - (this.els.board.outerHeight() - this.els.board.height())
        });

        this.resizeLabels();
        this.resizePieces();

        this.fireEvent('boardResized', this.boardCoordinates());
    },

    resizeLabels: function () {
        if (!this.hasLabels()) {
            return;
        }

        this.els.labels.ranks.css('height', this.els.board.css('height'));
        this.els.labels.files.css('width', this.els.board.css('width'));

        var r = this.els.labels.ranks;
        var f = this.els.labels.files;

        if (this.labelPos == 'outside') {
            r.css('top', this.els.boardContainer.css('padding-top'));

            f.css('line-height', this.getP('b') + 'px');


            r.css('width', this.getP('l'));
            f.css('height', this.getP('b'));

            var fs = Math.ceil(f.height() * (this.labelPos == 'outside' ? 0.65 : 0.5 ));

            r.css('font-size', fs + 'px');
            f.css('font-size', fs + 'px');
        }else{
            var fs2 = Math.round(this.getSquareSize() * 0.2);
            r.css('font-size', fs2 + 'px');
            f.css('font-size', fs2 + 'px');
        }

        var h = this.els.ranks[0].height();
        for (var i = 0; i < 8; i++) {
            if (this.labelPos == 'outside') {
                this.els.ranks[i].css('line-height', h + 'px');
            } else {
                this.els.ranks[i].css({
                    position: 'absolute',
                    width: 'auto', height: 'auto',
                    top: this.internal.squareSize * i
                });
                this.els.files[i].css({
                    position: 'absolute',
                    width: 'auto',
                    left: (this.internal.squareSize * (i + 1)) - this.els.files[i].outerWidth(),
                    bottom: 0,
                    height: 'auto'
                })
            }
        }
    },

    getP: function (pos) {
        var p = this.padding[pos];
        if (isNaN(p)) {
            p = parseInt(p);
            return Math.min(this.$b().width(),  this.$b().height()) * p / 100;
        }
        return p;
    },

    resizeSquares: function () {
        for (var i = 0; i < 64; i++) {
            this.els.squares[i].css({
                width: '12.5%',
                height: '12.5%'
            });
        }
    },

    getNewPieceSize: function () {
        return this.internal.squareSize - this.internal.squareSize % 15;
    },

    getNewSizeOfBoardContainer: function () {
        var b = this.els.boardContainer;
        var c = this.$b();

        var widthOffset = b.outerWidth() - b.width();
        var heightOffset = b.outerHeight() - b.height();

        var size = {x: c.width(), y: c.height()};
        size = {
            x: size.x - widthOffset,
            y: size.y - heightOffset
        };
        return size;
    },

    flip: function () {
        this.flipped = !this.flipped;
        this.updateLabels();
        this.flipSquares();
        this.fireEvent('flip', this);

    },
    isFlipped: function () {
        return this.flipped;
    },

    labelHeight: undefined,
    getLabelHeight: function () {
        if (!this.labels || this.labelPos == 'inside') {
            return 0;
        }
        if (this.labelHeight === undefined) {
            this.labelHeight = this.els.labels.files.outerHeight();
        }
        return this.labelHeight;
    },

    labelWidth: undefined,
    getLabelWidth: function () {
        if (!this.labels || this.labelPos == 'inside') {
            return 0;
        }
        if (this.labelWidth === undefined) {
            this.labelWidth = this.els.labels.ranks.outerWidth();
        }
        return this.labelWidth;
    },

    getBoard: function () {
        return this.els.pieceContainer;
    },

    getPieceSize: function () {
        return this.internal.pieceSize;
    },

    getSquareSize: function () {
        return this.internal.squareSize;
    },

    getTimeStamp: function () {
        return new Date().getTime();
    },

    getHeightOfContainer: function () {
        return this.$b().height();

    },

    getSquareByCoordinates: function (x, y) {
        var offset = this.internal.squareSize / 2;
        x += offset;
        y += offset;

        x = Math.max(0, x);
        y = Math.max(0, y);

        var max = this.internal.squareSize * 8;
        x = Math.min(max, x);
        y = Math.min(max, y);

        x = Math.floor(x / this.internal.squareSize);
        y = Math.floor(8 - (y / this.internal.squareSize));
        if (this.isFlipped()) {
            x = 7 - x;
            y = 7 - y;
        }
        return x + y * 16;
    },

    wrappedHeight: function (size) {
        return Math.min(size.width, size.height);
    },

    wrappedWidth:function(size){
        return Math.max(size.width, size.height);
    }
});/* ../dhtml-chess/src/view/board/board.js */
/**
 * Javascript Class for Chess Board and Pieces on the board
 * JSON config type: chess.view.board.Board
 * @submodule Board
 * @namespace chess.view.board
 * @class Board
 * @augments chess.view.board.GUI
 * @param {Object} config
 * @param {Object} config.paddings - Percentage(of board size) or numeric values, example: { l: '3%', t:'1%', 'b' : '3%', r: '1%' } where
 * l is left, t is top, r is right and b is bottom, default: 3% for all sides. If you have labels, the labels will be resized
 * according to padding.
 * @param {String} pieceLayout name of pieces to use. Default: svg_alpha_bw.  Possible values:
 * svg_alpha_bw, svg_alpha_egg, svg_egg, svg, svg_egg, svg-chess7, svg_chessole, merida, meridapale, traveler, svg_bluegrey, smart,
 * motif, leipzig. The ones with prefix "svg_" uses svg vector graphics which are small in size and without any quality loss. The other
 * layouts are pixel based bitmaps.
 * @param {Number} animationDuration Animation duration in secons, default: 0.35
 *
 */
chess.view.board.Board = new Class({
    Extends: chess.view.board.GUI,
    type: 'chess.view.board.Board',
    pieces: [],
    pieceMap: {},


    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    /**
     * Duration of piece animations in seconds.
     * @config float animationDuration
     * @default 0.35
     */
    animationDuration: .20,
    /**
     * Layout of pieces, examples: "alphapale", "alpha", "merida", "kingdom"
     * @config string pieceLayout
     * @default alphapale
     */
    pieceLayout: 'svg_bw',
    /**
     * Layout of board. The name correspondes to the suffix of the CSS class
     * dhtml-chess-board-container-wood. (In this example wood). If you want to create your own
     * board layout. You can specify a custom value for boardLayout, create your own graphic and
     * implement your own CSS rules. Take a look at css/board/board.css for more info
     * @config string boardLayout
     * @default wood
     */
    boardLayout: undefined,
    positionParser: undefined,
    currentValidMoves: undefined,
    ddEnabled: false,
    plugins: [],

    currentAnimation: {
        index: 0,
        moves: [],
        duration: .5,
        isBusy: false
    },
    __construct: function (config) {
        this.parent(config);
        this.pieces = [];
        this.__params(config, ['fen', 'pieceLayout', 'animationDuration', 'plugins']);

        if (this.plugins && Browser.ie && Browser.version < 9) {
            for (var i = 0; i < this.plugins.length; i++) {
                if (this.plugins[i].type === 'chess.view.highlight.Arrow') {
                    this.plugins[i].type = 'chess.view.highlight.Square';
                }
            }
        }


        this.positionParser = new chess.parser.FenParser0x88();
    },

    __rendered: function () {
        this.createPieces();
        this.showFen(this.fen);
        this.parent();
    },

    createPieces: function () {
        var flipped = this.isFlipped();

        for (var i = 0; i < 32; i++) {
            var config = {
                square: 0,
                color: 'white',
                pieceType: 'p',
                pieceLayout: this.pieceLayout,
                squareSize: 30,
                flipped: flipped,
                aniDuration: this.animationDuration,
                board: this
            };
            var piece = new chess.view.board.Piece(config);
            piece.addEvent('animationComplete', this.pieceMoveFinished.bind(this));
            piece.addEvent('move', this.makeMove.bind(this));
            piece.addEvent('initdrag', this.startPieceDrag.bind(this));
            this.pieces.push(piece);
            this.getBoard().append(piece.getEl());
        }
        this.resizePieces();
        this.addPieceDragEvents();
    },

    setPieceLayout: function (layout) {
        jQuery.each(this.pieces, function (i, piece) {
            piece.setPieceLayout(layout);
        });
    },

    addPieceDragEvents: function () {
        // var on = this.getEventEl().addEvent;
        this.getEventEl().on(ludo.util.getDragMoveEvent(), this.dragPiece.bind(this));
        this.getEventEl().on(ludo.util.getDragEndEvent(), this.stopDragPiece.bind(this));
    },

    draggedPiece: undefined,
    startPieceDrag: function (piece) {
        this.draggedPiece = piece;
    },

    dragPiece: function (e) {
        if (this.draggedPiece) {
            this.draggedPiece.dragPiece(e);
        }
    },

    stopDragPiece: function (e) {

        if (this.draggedPiece) {
            this.draggedPiece.stopDragPiece(e);
            this.draggedPiece = undefined;
        }
    },

    /**
     * All DHTML Chess 3 views are using the setController method. It is used to
     * control behaviour of the view. So if you want to create your own Chess View component, you
     * should take a look at setController. Example method:<br><br>
     *     setController : function(controller){<br>
     *         this.parent(controller); // always call supperclass
     *         controller.addEvent('newGame', this.doSomethingOnNewGame.bind(this));
     *     }
     * Here, the method doSomethingOnNewGame will be executed every time the controller loads a new game
     * @method setController
     * @param {Object} controller
     */
    setController: function (controller) {
        this.parent(controller);
        controller.addEvent('newGame', this.showStartBoard.bind(this));
        controller.addEvent('newMove', this.clearHighlightedSquares.bind(this));
        controller.addEvent('newMove', this.playChainOfMoves.bind(this));
        controller.addEvent('setPosition', this.showMove.bind(this));
        controller.addEvent('nextmove', this.playChainOfMoves.bind(this));
        controller.addEvent('startOfGame', this.clearHighlightedSquares.bind(this));
        controller.addEvent('newGame', this.clearHighlightedSquares.bind(this));
        controller.addEvent('flip', this.flip.bind(this));
        this.controller.addEvent('beforeLoad', this.beforeLoad.bind(this));
        this.controller.addEvent('afterLoad', this.afterLoad.bind(this));
    },


    beforeLoad: function () {
        this.shim().show(chess.getPhrase('Loading game'));
    },

    afterLoad: function () {
        this.shim().hide();
    },

    clearHighlightedSquares: function () {
        this.fireEvent('clearHighlight', this);
    },
    /**
     * Enable drag and drop feature of the board. It expects a game model as first argument.
     * When connected to a controller event, the controller always sends current game model as
     * first argument when it fire events.
     * @method enableDragAndDrop
     * @param model
     * @return void
     */
    enableDragAndDrop: function (model) {
        if (this.currentAnimation.isBusy) {
            this.enableDragAndDrop.delay(200, this, model);
            return;
        }
        this.ddEnabled = true;
        var pos = model.getCurrentPosition();

        this.positionParser.setFen(pos);
        // 6k1/5ppp/8/8/8/8/5PPP/3R2K1 w KQkq - 0 0
        this.currentValidMoves = this.positionParser.getValidMovesAndResult().moves;
        this.resetPieceDragAndDrop();
        for (var square in this.currentValidMoves) {
            if (this.currentValidMoves.hasOwnProperty(square)) {
                this.pieceMap[square].enableDragAndDrop();
            }
        }
    },
    /**
     * Disable drag and drop feature of the board
     * @method disableDragAndDrop
     * @return void
     */
    disableDragAndDrop: function () {
        this.ddEnabled = false;
        this.resetPieceDragAndDrop();
    },
    resetPieceDragAndDrop: function () {
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].disableDragAndDrop();
        }
    },
    /**
     Animate/Play the "movements" involved in a move, example: O-O involves two moves,
     moving the king and moving the rook. By default, this method will be executed when the
     controller fires newMove or nextmove event.
     @method playChainOfMoves
     @param {game.model.Game} model
     @param {Object} move
     @example
     { m: 'O-O', moves : [{ from: 'e1', to: 'g1' },{ from:'h1', to: 'f1'}] }
     */
    playChainOfMoves: function (model, move) {
        if (this.animationDuration == 0) {
            this.showMove(model, move);
            return;
        }

        this.fireEvent('animationStart');
        if (this.currentAnimation.isBusy) {
            this.playChainOfMoves.delay(200, this, [model, move]);
            return;
        }
        var moves = move.moves;

        this.currentAnimation.duration = this.getDurationPerMovedPiece(move);
        this.currentAnimation.index = 0;
        this.currentAnimation.moves = moves;
        this.currentAnimation.isBusy = true;
        this.animateAMove();
    },

    animateAMove: function () {
        var move = this.currentAnimation.moves[this.currentAnimation.index];

        if (move.capture) {

            var sq = Board0x88Config.mapping[move.capture];
            if (sq != move.to) {
                this.pieceMap[sq].hide();
                this.pieceMap[sq] = null;
            }
            this.pieceMoveFinished(move);
        }
        else if (move.promoteTo) {
            this.getPieceOnSquare(move.square).promote(move.promoteTo);
            this.currentAnimation.isBusy = false;
        } else if (move.from) {
            var piece = this.getPieceOnSquare(move.from);
            if (piece)piece.playMove(move.to, this.currentAnimation.duration);
        }
    },

    pieceMoveFinished: function (move) {
        this.currentAnimation.index++;
        if (this.pieceMap[move.to]) {
            this.pieceMap[move.to].hide();
        }
        this.pieceMap[move.to] = this.pieceMap[move.from];
        this.pieceMap[move.from] = null;

        if (this.currentAnimation.index < this.currentAnimation.moves.length) {
            this.animateAMove();
        } else {
            this.fireEvent('highlight', this.currentAnimation.moves[0]);
            this.fireEvent('animationComplete');

            this.currentAnimation.isBusy = false;
        }
    },

    getDurationPerMovedPiece: function (move) {
        var count = 0;
        for (var i = 0; i < move.moves.length; i++) {
            if (move.moves[i].from) {
                count++;
            }
        }
        return (this.animationDuration / count) * 1000;
    },

    showMove: function (model, move, pos) {
        if (this.currentAnimation.isBusy) {
            pos = model.getCurrentPosition();
            this.showMove.delay(200, this, [model, move, pos]);
            return;
        }
        pos = pos || model.getCurrentPosition();
        this.showFen(pos);

        if (move = model.getCurrentMove()) {
            this.highlightMove(move);
        }
    },
    highlightMove: function (move) {
        if (!move) {
            return;
        }
        if (move.from && move.to) {
            this.fireEvent('highlight', move);
        }
    },
    /**
     * Show start position of game
     * @method showStartBoard
     * @param {game.model.Game} model
     * @return void
     */
    showStartBoard: function (model) {
        if (!model.getCurrentPosition()) {
            console.error('no position');
            console.trace();
        }
        this.showFen(model.getCurrentPosition());
    },
    /**
     * Show a specific FEN position on the board
     * @method showFen
     * @param {String} fen
     * @return undefined
     */
    showFen: function (fen) {

        this.positionParser.setFen(fen);
        var pieces = this.positionParser.getPieces();
        this.pieceMap = {};
        for (var i = 0, count = pieces.length; i < count; i++) {
            var color = (pieces[i].t & 0x8) ? 'black' : 'white';
            var type = Board0x88Config.typeMapping[pieces[i].t];

            var p = this.pieces[i];
            p.square = pieces[i].s;
            p.color = color;
            p.pieceType = type;
            p.position();
            p.updateBackgroundImage();
            p.show();

            this.pieceMap[pieces[i].s] = p;
        }

        for (var j = i; j < this.pieces.length; j++) {
            this.pieces[j].hide();
        }
    },
    /**
     * Return number of visible pieces on the board
     * @method getCountPiecesOnBoard
     * @return int
     */
    getCountPiecesOnBoard: function () {
        var ret = 32;
        for (var i = this.pieces.length - 1; i >= 0; i--) {
            if (!this.pieces[i].isVisible()) {
                ret--;
            }
        }
        return ret;
    },

    hidePiece: function (piece) {
        if (piece) {
            delete this.pieceMap[piece.square];
            piece.hide();
        }
    },

    /**
     * This method resets the board to the standard position at start of games
     * @method resetBoard
     * @return void
     */
    resetBoard: function () {
        this.showFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        /**
         * Event fired when board is reset to standard start position,
         * i.e. fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
         * @event resetboard
         * @param Component this
         */
        this.fireEvent('resetboard', this);
    },
    /**
     * Remove all pieces from the board
     * @method clearBoard
     * @return void
     */
    clearBoard: function () {
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].hide();
            this.pieceMap = {};
        }
        /**
         * Event fired when all pieces are being removed from the board via the clearBoard() method
         * @event clearboard
         * @param Component this
         */
        this.fireEvent('clearboard', this);
    },

    makeMove: function (move) {
        /**
         * Event fired when a piece is moved from one square to another
         * @event move
         * @param Object move, example: { from: "e2", to: "e4" }
         */
        this.fireEvent('move', move);
    },
    getValidMovesForPiece: function (piece) {
        return this.currentValidMoves[piece.square] || [];
    },

    /**
     Returns JSON object for a piece on a specific square or null if no piece is on the square
     @method getPieceOnSquare
     @param {String} square
     @example
     alert(board.getPieceOnSquare('e4');
     */
    getPieceOnSquare: function (square) {
        return this.pieceMap[Board0x88Config.mapping[square]];
    },

    currentPieceSize: undefined,

    resizePieces: function () {
        var squareSize = this.getSquareSize();
        for (var i = 0; i < this.pieces.length; i++) {
            this.pieces[i].resize(squareSize)
        }
    },
    /**
     * Flip board
     * @method flip
     * @return void
     */
    flip: function () {
        this.parent();
        for (var i = 0, count = this.pieces.length; i < count; i++) {
            this.pieces[i].flip();
        }
    },
    /**
     * Show whites pieces at the bottom. If white is allready on the bottom, this method will do nothing.
     * @method flipToWhite
     */
    flipToWhite: function () {
        if (this.flipped) {
            this.flip();
        }
    },
    /**
     * Show blacks pieces at the bottom. If black is allready on the bottom, this method will do nothing.
     * @method flipToBlack
     */
    flipToBlack: function () {
        if (!this.flipped) {
            this.flip();
        }
    },

    showSolution: function (move) {
        this.fireEvent('showSolution', move);
    },

    showHint: function (move) {
        this.fireEvent('showHint', move);
    }
});/* ../dhtml-chess/src/view/board/piece.js */
/**
 * Class representing the view of chess pieces in DHTML Chess.
 * Instances of this class are created dynamically by chess.view.Board
 * @module View
 * @submodule Board
 * @namespace chess.view.board
 * @class Piece
 * @extends Core
 */
ludo_CHESS_PIECE_GLOBAL_Z_INDEX = 200;
chess.view.board.Piece = new Class({
    Extends: ludo.Core,
    type: 'chess.view.board.Piece',
    /**
     Color of piece, "white" or "black"
     @config {String} color
     @default "white"
     */
    color: 'white',
    pieceLayout: 'alpha',
    size: null,
    squareSize: null,
    validSizes: [30, 45, 60, 75, 90, 105],
    /**
     * 0x88 board position of piece
     * @config {Number} square
     */
    square: undefined,
    el: null,
    flipped: false,
    toSquare: null,
    Fx: null,
    board: undefined,
    ddEnabled: false,
    aniDuration: .25,
    /**
     Type of piece
     @config {String} pieceType
     @example
     pieceType:'n'
     */
    pieceType: 'p',
    dd: {
        active: false,
        el: {x: 0, y: 0},
        mouse: {x: 0, y: 0}
    },
    internal: {
        files: {
            a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7
        }
    },

    validTargetSquares: [],

    svg: false,
    extension: 'pgn',

    __construct: function (config) {
        this.parent(config);
        this.square = config.square;
        this.squareSize = config.squareSize;
        this.setPieceLayout(config.pieceLayout);
        this.numSquare = config.numSquare;
        this.flipped = config.flipped;
        this.pieceType = config.pieceType;
        this.color = config.color;
        this.board = config.board;
        this.aniDuration = config.aniDuration != undefined ? config.aniDuration : this.aniDuration;


        this.createDOM();
        this.resize(this.squareSize);
        this.position();
    },


    setPieceLayout:function(layout){
        this.pieceLayout = layout;
        this.svg = this.pieceLayout.indexOf('svg') == 0;
        this.extension = this.svg ? 'svg' : 'png';
        this.bgUpdated = false;
        if(this.el != undefined){
            this.updateBackgroundImage();
        }
    },

    /**
     * Create DOM elements for the chess piece
     * @method createDOM
     * @private
     */
    createDOM: function () {
        this.el = jQuery('<div>');
        this.el.css({
            'position': 'absolute',
            padding: 0,
            margin: 0,
            borders: 0,
            width: '12.5%',
            height: '12.5%',
            'z-index': 100,
            overflow: 'hidden'
        });

        this.el.mouseenter(this.mouseEnterPiece.bind(this));
        this.el.mouseleave(this.mouseLeavePiece.bind(this));

        this.el.on(ludo.util.getDragStartEvent(), this.initDragPiece.bind(this));

        this.el.addClass('dhtml-chess-piece');
        this.position();

    },
    /**
     * Method executed when mouse enters a chess piece
     * @method mouseEnterPiece
     * @private
     */
    mouseEnterPiece: function () {
        this.fireEvent('mouseenter', this)
    },
    /**
     * Method executed when mouse leaves a chess piece
     * @method mouseLeavePiece
     * @private
     */
    mouseLeavePiece: function () {
        this.fireEvent('mouseleave', this)
    },

    /**
     * Disable drag and drop for the chess piece. This will set the internal ddEnabled property to
     * false and reset cursor to arrow.
     * @method disableDragAndDrop
     */
    disableDragAndDrop: function () {
        this.ddEnabled = false;
        this.el.css('cursor', 'default');
    },
    /**
     * Enable drag and drop for the chess piece. This will set the internal ddEnabled property to true
     * and update the cursor to a pointer/hand.
     * @method enableDragAndDrop
     */
    enableDragAndDrop: function () {
        this.ddEnabled = true;
        this.el.css('cursor', 'pointer');
    },
    /**
     * Returns true if chess piece is currently on board.
     * @method isVisible
     * @return {Boolean}
     */
    isVisible: function () {
        return this.el.css('display') != 'none';
    },
    /**
     * Hide the chess piece
     * @method hide
     */
    hide: function () {
        this.el.css('display', 'none');
    },
    /**
     * Show the chess piece
     * @method show
     */
    show: function () {
        this.el.css('display', '');
    },
    /**
     * Start dragging a chess piece
     * @method initDragPiece
     * @param {Event} e
     * @return {Boolean|undefined}
     * @private
     */
    initDragPiece: function (e) {

        if (this.ddEnabled) {
            this.increaseZIndex();
            this.validTargetSquares = this.board.getValidMovesForPiece(this);
            this.fireEvent('initdrag', this);
            var pos = this.el.position();
            this.el.css('left', pos.left + 'px');
            this.el.css('top', pos.top + 'px');

            var p = ludo.util.pageXY(e);

            this.dd = {
                active: true,
                mouse: {x: p.pageX, y: p.pageY},
                el: {x: pos.left, y: pos.top}
            };


            return false;
        }
        return undefined;
    },

    pageXY:function(e){

    },

    /**
     * Method executed when dragging has started and mouse moves
     * @method dragPiece
     * @param {Event} e
     * @return {Boolean|undefined}
     * @private
     */
    dragPiece: function (e) {

        if (this.dd.active === true) {

            var p = ludo.util.pageXY(e);
            this.el.css(
                {
                    left: (p.pageX + this.dd.el.x - this.dd.mouse.x) + 'px',
                    top: (p.pageY + this.dd.el.y - this.dd.mouse.y) + 'px'
                }
            );

            return false;
        }
        return undefined;
    },
    /**
     * Stop dragging the chess piece.
     * @method stopDragPiece
     * @param {Event} e
     * @private
     */
    stopDragPiece: function (e) {

        if (this.dd.active) {
            var coords;
            if (ludo.isMobile) {
                coords = {
                    x: e.target.offsetLeft,
                    y: e.target.offsetTop
                }
            } else {
                coords = {
                    x: e.pageX + this.dd.el.x - this.dd.mouse.x,
                    y: e.pageY + this.dd.el.y - this.dd.mouse.y
                }
            }

            var square = this.getSquareByCoordinates(
                coords.x,
                coords.y
            );

            if (this.validTargetSquares.indexOf(square) >= 0) {
                this.position(square);
                this.fireEvent('move', {
                    from: Board0x88Config.numberToSquareMapping[this.square],
                    to: Board0x88Config.numberToSquareMapping[square]
                });
            } else {
                this.position();
            }
            this.dd.active = false;
        }
    },
    /**
     * Return 0x88 square by screen coordinates
     * @method getSquareByCoordinates
     * @param {Number} x
     * @param {Number} y
     * @return {Number}
     * @private
     */
    getSquareByCoordinates: function (x, y) {
        x += this.squareSize / 2;
        y += this.squareSize / 2;

        x = Math.max(0, x);
        y = Math.max(0, y);

        x = Math.min(this.squareSize * 8, x);
        y = Math.min(this.squareSize * 8, y);

        x = Math.floor(x / this.squareSize);
        y = Math.floor(8 - (y / this.squareSize));
        if (this.isFlipped()) {
            x = 7 - x;
            y = 7 - y;
        }
        return x + y * 16;
    },
    /**
     * Return square of piece
     * @method getSquare
     * @return {String} square
     */
    getSquare: function () {
        return this.square;
    },

    /**
     Promote piece to this type
     @method promote
     @param {String} toType
     @example
     piece.promote('q');
     */
    promote: function (toType) {
        this.pieceType = toType;
        this.updateBackgroundImage();
    },
    bgUpdated: false,
    /**
     * Update background image of piece when piece type is set or changed and when size of square is changed.
     * @method updateBackgroundImage
     * @private
     */
    updateBackgroundImage: function () {

        var s = this.svg ? 45 : this.size;

        if (this.svg && this.getColorCode() + this.getTypeCode() == this.bgUpdated) {

        } else {
            this.el.css('background-image', 'url(' + ludo.config.getDocumentRoot() + '/images/' + this.pieceLayout + s + this.getColorCode() + this.getTypeCode() + '.' + this.extension + ')');
        }

        if (this.svg && !this.bgUpdated) {
            this.el.css('background-size', '100% 100%');
            this.el.css('-moz-background-size', 'cover');
            this.el.css('-o-background-size', 'cover');
            this.el.css('-webkit-background-size', 'cover');
        }
        this.bgUpdated = this.getColorCode() + this.getTypeCode();

    },

    /**
     * Resize piece
     * @method resize
     * @param {Number} squareSize
     */
    resize: function (squareSize) {
        this.squareSize = squareSize;
        if (squareSize < this.validSizes[0]) {
            squareSize = this.validSizes[0];
        }
        if (squareSize > this.validSizes[this.validSizes.length - 1]) {
            squareSize = this.validSizes[this.validSizes.length - 1];
        }

        var tmpSquareSize = squareSize * 1.1;
        var pieceSize = tmpSquareSize - tmpSquareSize % 15;

        if (pieceSize != this.size) {
            this.size = pieceSize;
            this.updateBackgroundImage();
        }
    },

    /**
     * Position piece on board by 0x88 board square coordinate
     * @method position
     * @param {Number} square
     * @optional
     */
    position: function (square) {
        var pos = this.getPos(square);

        this.el.css({
            'left': pos.x,
            'top': pos.y
        });

    },

    /**
     * Move piece on board to square
     * @method playMove
     * @param {String} toSquare
     */
    playMove: function (toSquare) {
        toSquare = Board0x88Config.mapping[toSquare];

        if (this.isAlreadyOnSquare(toSquare)) {
            this.toSquare = toSquare;
            this.animationComplete();
        } else {
            var posTo = this.getPosOfSquare(toSquare);
            this.increaseZIndex();
            this.el.animate({
                top: posTo.y + '%',
                left: posTo.x + '%'
            }, this.aniDuration * 1000, this.animationComplete.bind(this));
            this.toSquare = toSquare;
        }
    },

    /**
     * Returns true if piece is already on a given 0x88 square number
     * @method isAlreadyOnSquare
     * @param {Number} square
     * @return {Boolean}
     * @private
     */
    isAlreadyOnSquare: function (square) {
        var pos = this.getPos(square);
        return pos.x == this.el[0].style.left && pos.y === this.el[0].style.top;
    },
    /**
     * Move piece to front
     * @method increaseZindex
     * @private
     */
    increaseZIndex: function () {
        ludo_CHESS_PIECE_GLOBAL_Z_INDEX++;
        this.el.css('zIndex', ludo_CHESS_PIECE_GLOBAL_Z_INDEX);
    },
    /**
     * Method executed when move animation is complete
     * @method animationComplete
     * @private
     */
    animationComplete: function () {
        this.fireEvent('animationComplete', {
            from: this.square,
            to: this.toSquare
        });
        this.square = this.toSquare;
    },
    /**
     Return x and y coordinate by 0x88 square number
     @method getPos
     @param {Number} square
     @return {Object}
     @example
     var pos = piece.getPos();
     // may return
     {
         "x":"12.5%",
         "y":"25%"
     }
     */
    getPos: function (square) {
        var pos = this.getPosOfSquare(square !== undefined ? square : this.square);
        return {
            'x': pos.x + '%',
            'y': pos.y + '%'
        };
    },
    /**
     * Return x and y position of square by 0x88 coordinate(without the % suffix)
     * @method getPosOfSquare
     * @param {Number} square
     * @return {Object}
     */
    getPosOfSquare: function (square) {
        var file = (square & 15);
        var rank = 7 - ((square & 240) / 16);

        if (this.flipped) {
            file = 7 - file;
            rank = 7 - rank;
        }
        return {
            x: (file * 12.5),
            y: (rank * 12.5)
        }
    },
    /**
     * Return HTML element of piece
     * @method getEl
     * @return {HTMLElement}
     */
    getEl: function () {
        return this.el;
    },
    /**
     * Return color code of piece, "w" or "b"
     * @method getColorCode
     * @return {String}
     * @private
     */
    getColorCode: function () {
        return this.color == 'white' ? 'w' : 'b';
    },
    /**
     * Return lowercase piece type, i.e. "k","q","r","b","n" or "p"
     * @method getTypeCode
     * @return {String}
     * @private
     */
    getTypeCode: function () {
        switch (this.pieceType) {
            case 'p':
            case 'r':
            case 'b':
            case 'q':
            case 'k':
                return this.pieceType.substr(0, 1).toLowerCase();
            case 'n':
                return 'n';
            default:
                return undefined;
        }
    },
    /**
     * Executed when board is flipped. It will call the position method.
     * @method flip
     */
    flip: function () {
        this.flipped = !this.flipped;
        this.position();
    },
    /**
     * Returns true if piece is already flipped
     * @method isFlipped
     * @return {Boolean}
     */
    isFlipped: function () {
        return this.flipped;
    }
});/* ../dhtml-chess/src/view/board/background.js */
/**
 * Created by alfmagne1 on 17/01/2017.
 */
chess.view.board.Background = new Class({

    type: 'chess.view.board.Background',
    view: undefined,

    paths: {
        t: undefined, l: undefined, r: undefined, b: undefined
    },

    els: undefined,

    verticalSize: undefined,
    horizontalSize: undefined,
    patternSize:undefined,

    size: undefined,

    borderRadius: 0,

    paint: undefined,

    square: true,

    pattern:undefined,

    initialize: function (config) {
        this.view = config.view;
        this.svg = this.view.svg();


        this.svg.css('position', 'absolute');
        this.svg.css('left', '0');
        this.svg.css('top', '0');
        if (config.square != undefined)this.square = config.square;
        if (config.borderRadius != undefined)this.borderRadius = config.borderRadius;

        this.view.on('boardResized', this.resize.bind(this));

        this.horizontal = config.horizontal;
        this.vertical = config.vertical;
        this.pattern = config.pattern;

        if (!this.horizontal && !this.pattern) {
            this.horizontal = ludo.config.getDocumentRoot() + 'images/transparent-dot.png';
            this.vertical = this.horizontal;
        }

        this.els = {};

        this.paint = config.paint;

        this.render();
    },

    render: function () {
        this.createClipPath();
        this.createPattern();


        this.createPath('t');
        this.createPath('l');
        this.createPath('b');
        this.createPath('r');

        if (!this.horizontal) {
            if(!this.pattern)this.paths.t.css('display', 'none');
            this.paths.l.css('display', 'none');
            this.paths.r.css('display', 'none');
            this.paths.b.css('display', 'none');
        }


        if (this.paint && !this.paint.fill) {
            this.els.paintRect.toFront();
        }

        this.applyPattern();
    },

    createClipPath: function () {
        this.els.clipPath = this.svg.$('clipPath');
        this.els.clip = this.svg.$('rect');

        this.els.clipPath.append(this.els.clip);
        this.svg.appendDef(this.els.clipPath);

        this.setBorderRadius(this.borderRadius);
    },

    createPath: function (key) {
        this.paths[key] = this.svg.$('path');
        this.paths[key].clip(this.els.clipPath);
        this.svg.append(this.paths[key]);

    },

    setPattern: function (horizontal, vertical) {
        this.setPatternItem(horizontal, this.els.horizontal);
        this.setPatternItem(vertical, this.els.vertical);
    },

    setPatternItem: function (path, image) {
        image.removeAttr('width');
        image.removeAttr('height');
        image.set('xlink:href', path);
    },

    /**
     * Set border radius in pixels or percent
     * @param radius
     */
    setBorderRadius: function (radius) {
        this.borderRadius = radius;
        if (isNaN(radius)) {
            radius = parseFloat(radius);
            radius = Math.min(this.svg.width, this.svg.height) * (radius / 100);
        }

        this.onNewBorderRadius(this.els.clip, radius);
        if (this.els.paintRect) {
            this.onNewBorderRadius(this.els.paintRect, radius);
        }

    },

    onNewBorderRadius: function (el, radius) {

        el.set('rx', radius);
        el.set('ry', radius);

    },

    getPattern: function (image, sizeKey, imageKey) {
        var s = this.svg;
        var p = s.$('pattern');
        p.set('width', 1);
        p.set('height', 1);
        p.set('x', 0);
        p.set('y', 0);
        var img = this.els[imageKey] = s.$('image');
        this.loadImage(img, sizeKey, image);

        p.append(img);
        s.appendDef(p);
        return p;
    },

    loadImage: function (img, sizeKey, href) {
        var that = this;
        img.set('opacity', 0);

        img.removeAttr('width');
        img.removeAttr('height');

        img.on('load', function () {
            var bbox = this.getBBox();
            that[sizeKey] = {
                x: bbox.width, y: bbox.height
            };

            img.set('width', bbox.width);
            img.set('height', bbox.height);
            img.set('opacity', 1);

            that.updatePatternSize();

        }.bind(img));

        img.set('xlink:href', href);
        return img;
    },

    createPattern: function () {


        if (this.paint != undefined) {

            this.els.paintRect = this.svg.$('rect');
            this.els.paintRect.css(this.paint);
            this.svg.append(this.els.paintRect);
            if (!this.paint.fill) {
                this.els.paintRect.css('fill-opacity', 0);
            }
            this.els.paintRect.toFront();


        }

        if(this.pattern){
            this.els.pattern = this.getPattern(this.pattern, 'patternSize', 'pattern');
        }else if (this.horizontal) {
            this.els.horizontalPattern = this.getPattern(this.horizontal, 'horizontalSize', 'horizontal');
            this.els.verticalPattern = this.getPattern(this.vertical, 'verticalSize', 'vertical');

        }


    },

    updatePatternSize: function () {
        if (this.size == undefined)this.size = { x:1, y:1 };


        var min = 5;

        if(this.pattern && this.patternSize != undefined){

            this.els.pattern.set('width', Math.min(min, this.patternSize.x / this.size.x));
            this.els.pattern.set('height', Math.min(min, this.patternSize.y / this.size.y));
        }

        if (this.horizontal && this.horizontalSize != undefined) {

            this.els.horizontalPattern.set('width', Math.min(min, this.horizontalSize.x / this.size.x));
            this.els.horizontalPattern.set('height', Math.min(min, this.horizontalSize.y / this.size.y));
        }

        if (this.vertical && this.verticalSize != undefined) {
            this.els.verticalPattern.set('width', Math.min(min, this.verticalSize.x / this.size.x));
            this.els.verticalPattern.set('height', Math.min(min, this.verticalSize.y / this.size.y));
        }
    },

    applyPattern: function () {

        if(Browser.name == 'ie'){
            if(this.els.pattern){
                this.paths.t.set('fill', '#111');
            }
            if (this.els.horizontal) {
                this.paths.t.set('fill', '#111');
                this.paths.b.set('fill', '#111');
            }

            if (this.els.vertical) {
                this.paths.l.set('fill', '#111');
                this.paths.r.set('fill', '#111');
            }
        }
        if(this.els.pattern){
            this.paths.t.setPattern(this.els.pattern);
        }
        if (this.els.horizontal) {
            this.paths.t.setPattern(this.els.horizontalPattern);
            this.paths.b.setPattern(this.els.horizontalPattern);
        }

        if (this.els.vertical) {
            this.paths.l.setPattern(this.els.verticalPattern);
            this.paths.r.setPattern(this.els.verticalPattern);
        }
    },

    updateRect: function (rect, left, top, width, height, rx, ry) {

        rect.set('x', left);
        rect.set('y', top);
        rect.set('width', width);
        rect.set('height', height);


    },

    resize: function (size) {

        var sw = 0;
        if (this.paint != undefined && this.paint['stroke-width']) {
            sw = parseFloat(this.paint['stroke-width']);
        }


        if (this.square) {
            var min = Math.min(size.width, size.height);
            this.size = {x : min, y: min };
        } else {

            this.size = {x: size.width, y: size.height};
        }

        if (this.els.paintRect) {
            this.updateRect(this.els.paintRect, size.left + sw / 2, size.top + sw / 2, this.size.x - sw, this.size.y - sw, this.borderRadius, this.borderRadius);
        }

        this.updateRect(this.els.clip, size.left, size.top, this.size.x, this.size.y,
            this.borderRadius, this.borderRadius);


        var cx = size.width / 2 + size.left;
        var cy = size.height / 2 + size.top;
        var radius = this.size.x / 2;
        var radiusY = this.size.y / 2;

        radius -= sw;

        if(this.pattern ){

            this.paths.t.set('d', [
                'M', cx-radius, cy-radiusY,
                'L', cx - radius, cy + radiusY,
                cx + radius, cy + radiusY, cx+radius, cy-radiusY, 'Z'
            ].join(' '));


        }else{
            this.paths.t.set('d', [
                'M', cx, cy, 'L', cx - radius, cy - radiusY, cx + radius, cy - radiusY, 'Z'
            ].join(' '));
            this.paths.b.set('d', [
                'M', cx, cy, 'L', cx - radius, cy + radiusY, cx + radius, cy + radiusY, 'Z'
            ].join(' '));

            this.paths.l.set('d', [
                'M', cx, cy, cx - radius, cy - radiusY, cx - radius, cy + radiusY, 'Z'
            ].join(' '));

            this.paths.r.set('d', [
                'M', cx, cy, 'L', cx + radius, cy - radiusY, cx + radius, cy + radiusY, 'Z'
            ].join(' '));
        }




        this.setBorderRadius(this.borderRadius);

        this.updatePatternSize();

    }

});/* ../dhtml-chess/src/view/highlight/base.js */
chess.view.highlight.Base = new Class({
    Extends: ludo.Core,
    board:undefined,

	__construct:function (config) {
        this.parent(config);
        this.parentComponent = config.parentComponent;

        this.parentComponent.on('resize', this.onParentResize.bind(this));
    },

    getParent:function(){
        return this.parentComponent;
    },

    onParentResize:function(){

    }
});/* ../dhtml-chess/src/view/highlight/square-base.js */
chess.view.highlight.SquareBase = new Class({
    Extends: chess.view.highlight.Base,
    els: {},
    visibleSquares: [],

    __construct: function (config) {
        this.parent(config);
        this.createDOM();
    },

    createDOM: function () {
        var files = 'abcdefgh';
        var squares = this.getParent().getSquares();
        this.els.square = {};
        for (var i = 0; i < squares.length; i++) {
            var square = files.substr((i % 8), 1) + Math.ceil(8 - (i / 8));
            this.createHighlightElement(square, squares[i]);
        }
        this.getParent().addEvent('resize', this.resizeSquares.bind(this));
    },

    createHighlightElement: function (square, renderTo) {
        var el = renderTo.find('.dhtml-chess-square-highlight').first();
        if (!el.length) {
            el = jQuery('<div>');
            el.attr('id', 'ludo-square-highlight-' + String.uniqueID());
            el.addClass('dhtml-chess-square-highlight');
        }
        el.css('display', 'none');
        this.els.square[square] = el.attr('id');
        renderTo.append(el);
    },

    highlight: function (move) {
        this.clear();
        var squares = [move.from, move.to];
        for (var i = 0; i < squares.length; i++) {
            this.highlightSquare(squares[i]);
        }
    },

    highlightSquare: function (square) {
        var el = jQuery("#" + this.els.square[square]);
        this.visibleSquares.push(el);
        el.css('display', '');
        this.resizeSquare(el);
    },

    resizeSquares: function () {
        for (var i = 0; i < this.visibleSquares.length; i++) {
            this.resizeSquare(this.visibleSquares[i]);
        }
    },

    resizeSquare: function (el) {
        var size = el.parent().outerWidth();
        var width = size - ludo.dom.getMBPW(el);
        var height = size - ludo.dom.getMBPH(el);
        el.css({
            width: width, height: height
        });
    },

    clear: function () {
        for (var i = 0; i < this.visibleSquares.length; i++) {
            this.visibleSquares[i].css('display', 'none');
        }
        this.visibleSquares = [];
    }
});/* ../dhtml-chess/src/view/highlight/square.js */
/**
 Add on for chess board. used to indicate current moves by highlighting squares.
 @submodule Board
 @namespace chess.view.highlight
 @class Square
 @constructor
 @param {Object} config
 @example
 	children:[
 	{
		 type:'chess.view.board.Board',
		 labels:true,
		 weight:1,
		 plugins:[
			 {
				 type:'chess.view.highlight.Square'
			 }
		 ]
	 }
 ]
 */
chess.view.highlight.Square = new Class({
	Extends:chess.view.highlight.SquareBase,
	__construct:function (config) {
		this.parent(config);
		this.parentComponent.addEvent('highlight', this.highlight.bind(this));
		this.parentComponent.addEvent('clearHighlight', this.clear.bind(this));
	}
});/* ../dhtml-chess/src/view/highlight/arrow-svg.js */
chess.view.board.ArrowSVG = new Class({
	Extends:ludo.svg.Canvas,

	squareSize:60,
	/*
	 * Width of arrow head
	 */
	arrowWidth:24,
	/*
	 * Height of arrow head
	 */
	arrowHeight:35,
	/*
	 * Width of arrow line
	 */
	lineWidth:10,
	/*
	 * Offset at arrow end(+ value = smaller arrow, measured from center of square)
	 */
	offsetEnd:15,
	/*
	 * Offset at start of arrow (positive value = smaller arrow - measured from center of square)
	 */
	offsetStart:0,
	/*
	 * Size of rounded edge
	 */
	roundEdgeSize:8,
	/*
	 * 0 = 90 degrees from line to left and right tip of arrow, positive value = less than 90 degrees
	 */
	arrowOffset:0,
	
	arrowPaint:undefined,

	__construct:function (config) {
		this.parent(config);
		if (config.arrowPaint !== undefined){
			this.arrowPaint = config.arrowPaint;
			this.appendDef(this.arrowPaint);
		}
		this.createArrow();
	},

	createArrow:function () {
		var pathConfig = {};
		if(this.arrowPaint)pathConfig['class'] = this.arrowPaint;
		this.pathEl = new ludo.svg.Node('path', pathConfig);
		this.append(this.pathEl);
		this.set('width', '100%');
		this.set('height', '100%');
	},

	getCoordinates:function (coordinates) {
		var ret = {
			width:coordinates.squares.width * this.squareSize,
			height:coordinates.squares.height * this.squareSize,
			start:{
				x:coordinates.arrow.start.x * this.squareSize,
				y:coordinates.arrow.start.y * this.squareSize
			},
			end:{
				x:coordinates.arrow.end.x * this.squareSize,
				y:coordinates.arrow.end.y * this.squareSize
			},
			squares:coordinates.squares
		};

		ret.oposite = (ret.start.y - ret.end.y);
		ret.adjacent = (ret.end.x - ret.start.x);
		ret.hyp = Math.sqrt(ret.oposite * ret.oposite + ret.adjacent * ret.adjacent);
		ret.cos = this.getCos(ret);
		ret.sin = this.getSin(ret);


		if (ret.cos < 0 && ret.sin >= 0) {
			ret.angle = Math.acos(ret.cos);
		} else {
			if (ret.cos < 0) {
				ret.angle = Math.acos(ret.cos) * -1
			} else {
				ret.angle = Math.asin(ret.sin);
			}
		}

		if (this.offsetEnd != 0) {
			ret.end.x -= this.offsetEnd * Math.cos(ret.angle);
			ret.end.y += this.offsetEnd * Math.sin(ret.angle);
		}
		if (this.offsetStart != 0) {
			ret.start.x += this.offsetStart * Math.cos(ret.angle);
			ret.start.y -= this.offsetStart * Math.sin(ret.angle);
		}


		return ret;
	},

	newPath:function (coordinates) {
		coordinates = this.getCoordinates(coordinates);
		this.setViewBox(coordinates.width, coordinates.height);
		this.pathEl.set('d', this.getPath(coordinates));
	},

	getPath:function (coordinates) {

		var points = this.getPoints(coordinates);
		var path = '';
		for (var i = 0; i < points.length; i++) {
			path += points[i].tag ? points[i].tag + ' ' : '';
			path += Math.round(points[i].x) + ',' + Math.round(points[i].y) + ' ';
		}
		return path;
	},

	getPoints:function (c) {
		var ret = [];
		ret.push({x:c.end.x, y:c.end.y, tag:'M'});
		var cos2 = Math.cos(c.angle + Math.PI / 2);
		var sin2 = Math.sin(c.angle + Math.PI / 2);

		ret.push(
			{
				tag:'L',
				x:c.end.x - this.arrowHeight * c.cos + (this.arrowWidth / 2 * cos2),
				y:c.end.y + this.arrowHeight * c.sin - (this.arrowWidth / 2 * sin2)
			});


		ret.push(
			{
				x:c.end.x - (this.arrowHeight - this.arrowOffset) * c.cos + (this.lineWidth / 2 * cos2),
				y:c.end.y + (this.arrowHeight - this.arrowOffset) * c.sin - (this.lineWidth / 2 * sin2)
			});


		ret.push(
			{
				x:c.start.x + (this.lineWidth / 2 * cos2),
				y:c.start.y - (this.lineWidth / 2 * sin2)
			});

		var nextTag = 'L';
		if (this.roundEdgeSize > 0) {
			ret.push({
				tag:'C',
				x:c.start.x - (this.roundEdgeSize * c.cos) + (this.lineWidth / 2 * cos2),
				y:c.start.y + (this.roundEdgeSize * c.sin) - (this.lineWidth / 2 * sin2)
			});
			ret.push({
				x:c.start.x - (this.roundEdgeSize * c.cos) - (this.lineWidth / 2 * cos2),
				y:c.start.y + (this.roundEdgeSize * c.sin) + (this.lineWidth / 2 * sin2)
			});
			ret.push(
				{
					x:c.start.x - (this.lineWidth / 2 * cos2),
					y:c.start.y + (this.lineWidth / 2 * sin2)
				});
			nextTag = 'M';
		}

		ret.push(
			{
				tag:nextTag,
				x:c.start.x - (this.lineWidth / 2 * cos2),
				y:c.start.y + (this.lineWidth / 2 * sin2)
			});


		ret.push(
			{
				tag:'L',
				x:c.end.x - (this.arrowHeight - this.arrowOffset) * c.cos - (this.lineWidth / 2 * cos2),
				y:c.end.y + (this.arrowHeight - this.arrowOffset) * c.sin + (this.lineWidth / 2 * sin2)
			});

		ret.push(
			{
				x:c.end.x - this.arrowHeight * c.cos - (this.arrowWidth / 2 * cos2),
				y:c.end.y + this.arrowHeight * c.sin + (this.arrowWidth / 2 * sin2)
			});
		ret.push({x:c.end.x, y:c.end.y});

		return ret;
	},

	toDegrees:function (radians) {
		return radians * 180 / Math.PI;
	},

	toRadians:function (degrees) {
		return degrees / 180 * Math.PI;
	},

	getLineSize:function (c) {
		var w = c.width - this.squareSize;
		var h = c.height - this.squareSize;
		return Math.sqrt(w * w + h * h);
	},

	getAngles:function (c) {
		return {
			line:c.angle,
			arrow1:c.angle + Math.PI / 2,
			arrow2:c.angle - Math.PI / 2
		};
	},

	getSin:function (c) {
		return (c.start.y - c.end.y) / c.hyp;
	},

	getCos:function (c) {
		return (c.end.x - c.start.x) / c.hyp;
	}
});/* ../dhtml-chess/src/view/highlight/arrow-base.js */
chess.view.highlight.ArrowBase = new Class({
	Extends:chess.view.highlight.Base,
	module:'chess',
	submodule:'arrowHiglight',
	canvas:undefined,
	files:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
	arrowPaint:undefined,

	currentMove:undefined,

	arrowStyles:{
		'stroke-linejoin':'round',
		stroke:'#a7311e',
		fill:'#a7311e',
		'stroke-opacity':.8,
		'fill-opacity':.5
	},
	__construct:function (config) {
		this.parent(config);
		if (config.styles !== undefined) {
			this.arrowStyles = Object.merge(this.arrowStyles, config.styles);
		}

		this.arrowPaint = new ludo.svg.Paint(Object.clone(this.arrowStyles));
		this.createDOM();

		this.getParent().addEvent('flip', this.flip.bind(this));

        this.el.on(ludo.util.getDragStartEvent(), this.initDragPiece.bind(this));
	},

	initDragPiece:function (e) {

		if (this.getParent().ddEnabled) {
			var pos = this.getParent().getBoard().offset();

			var p = ludo.util.pageXY(e);
			var c = {
				x:p.pageX - pos.left,
				y:p.pageY - pos.top
			};

			var ss = this.getParent().getSquareSize();

            c.x -= (c.x % ss);
            c.y -= (c.y % ss);

			var square = Board0x88Config.numberToSquareMapping[this.getParent().getSquareByCoordinates(c.x, c.y)];
			var piece = this.getParent().getPieceOnSquare(square);

			if (piece) {
				piece.initDragPiece(e);
			}
		}
	},

	createDOM:function () {
		var el = this.el = jQuery('<div style="position:absolute;display:none"></div>');
		this.getParent().getBoard().append(el);
		this.arrow = new chess.view.board.ArrowSVG({
			renderTo:this.el,
			arrowPaint:this.arrowPaint
		});
	},

	flip:function () {
		if (this.currentMove) {
			this.showMove(this.currentMove);
		}
	},

	showMove:function (move) {

		this.currentMove = move;
		this.resizeArrow();

	},

	onParentResize:function(){
		if(this.currentMove){
			this.resizeArrow();
		}
	},
	
	resizeArrow:function(){
		var coordinates = this.getCoordinates(this.currentMove);
		this.show();
		this.increaseZIndex();
		this.el.css({
			left:coordinates.x + '%',
			top:coordinates.y + '%',
			width:coordinates.width + '%',
			height:coordinates.height + '%'
		});
		this.arrow.fitParent();
		this.arrow.newPath(coordinates);
	},
	
	increaseZIndex:function () {
		ludo_CHESS_PIECE_GLOBAL_Z_INDEX++;
		this.el.css('zIndex', ludo_CHESS_PIECE_GLOBAL_Z_INDEX);
	},

	getEl:function () {
		return this.el;
	},

	hide:function () {
		this.currentMove = undefined;
		this.el.css('display', 'none');
	},
	show:function () {
		this.el.css('display', '');
	},

	getCoordinates:function (move) {
		var m = Board0x88Config.mapping;
		var fromRank = (m[move.from] & 240) / 16;
		var toRank = (m[move.to] & 240) / 16;

		var fromFile = (m[move.from] & 15);
		var toFile = (m[move.to] & 15);

		if (this.getParent().isFlipped()) {
			fromRank = 7 - fromRank;
			toRank = 7 - toRank;
			fromFile = 7 - fromFile;
			toFile = 7 - toFile;
		}

		var squares = {
			width:Math.abs(fromFile - toFile) + 1,
			height:Math.abs(fromRank - toRank) + 1
		};

		return {
			x:Math.min(fromFile, toFile) * 12.5,
			y:87.5 - (Math.max(fromRank, toRank) * 12.5),
			height:12.5 + Math.abs(fromRank - toRank) * 12.5,
			width:12.5 + Math.abs(fromFile - toFile) * 12.5,
			arrow:{
				start:{
					x:fromFile < toFile ? .5 : squares.width - .5,
					y:fromRank > toRank ? .5 : squares.height - .5
				}, end:{
					x:fromFile > toFile ? .5 : squares.width - .5,
					y:fromRank < toRank ? .5 : squares.height - .5
				}
			},
			squares:{
				width:Math.abs(fromFile - toFile) + 1,
				height:Math.abs(fromRank - toRank) + 1
			}
		};
	}
});

/* ../dhtml-chess/src/view/highlight/arrow.js */
/**
 Highlight a moves with an arrow. An object of this class is automatically created by
 chess.view.board.Board when added using "plugins".
 @submodule Board
 @namespace chess.view.highlight
 @class Arrow
 @extends chess.view.highlight.ArrowBase
 @constructor
 @param {Object} config
 @example
 	children:[
 	{
		 type:'chess.view.board.Board',
		 labels:true,
		 weight:1,
		 plugins:[
			 {
				 type:'chess.view.highlight.Arrow',
				 properties:{
					 'stroke-width' : 0
				 }
			 }
		 ]
	 }
 ]

 */
chess.view.highlight.Arrow = new Class({
	Extends:chess.view.highlight.ArrowBase,

	__construct:function (config) {
		this.parent(config);
        var p = this.getParent();
		p.addEvent('highlight', this.showMove.bind(this));
		p.addEvent('clearHighlight', this.hide.bind(this));
	}
});/* ../dhtml-chess/src/view/highlight/arrow-tactic.js */
chess.view.highlight.ArrowTactic = new Class({
    Extends:chess.view.highlight.ArrowBase,
    /**
     * Delay before automatically hiding arrow
     * @config {Number} delay
     * @default 1
     */
    delay:1,

	__construct:function (config) {
        this.parent(config);
        if(config.delay !== undefined)this.delay = config.delay;
        this.parentComponent.addEvent('showSolution', this.showSolution.bind(this));
    },

    showSolution:function(move){
        this.showMove(move);
        this.hide.delay(this.delay * 1000, this);
    }
});/* ../dhtml-chess/src/view/highlight/square-tactic-hint.js */
chess.view.highlight.SquareTacticHint = new Class({
    Extends:chess.view.highlight.SquareBase,
    delay : 1,

	__construct:function (config) {
        this.parent(config);
        if(config.delay !== undefined)this.delay = config.delay;
        this.parentComponent.addEvent('showHint', this.showHint.bind(this));
    },

    showHint:function(move){
        this.highlightSquare(move.from);
        this.clear.delay(this.delay * 1000, this);
    }
});/* ../dhtml-chess/src/view/buttonbar/bar.js */
chess.view.buttonbar.Bar = new Class({

    Extends: ludo.View,
    type:'chess.view.buttonbar.Bar',
    module: 'chess',
    submodule: 'buttonbar.bar',

    buttons: ['start', 'previous', 'play', 'next', 'end', 'flip'],

    styles: undefined,

    orientation: undefined,

    borderRadius: '8%',
    // Percent spacing of button size
    spacing: 10,

    background: undefined,


    activeButton: undefined,
    buttonDown: undefined,

    disabledButtons: undefined,

    isAtEndOfBranch: false,

    defaultStyles: undefined,

    overlay:undefined,

    anchor:undefined,

    __construct: function (config) {
        this.parent(config);
        this.anchor = [0.5, 0];
        this.__params(config, ['buttonSize', 'background', 'buttons', 'styles',
            'spacing', 'anchor', 'imageStyles', 'imageStylesDown', 'imageStylesDisabled', 'imageStylesOver', 'borderRadius']);

        this.disabledButtons = [];
        this.defaultStyles = {
            button: {
                'stroke': '#888',
                'fill': '#aeb0b0',
                'stroke-width': 1
            },
            image: {fill: '#444'},


            buttonOver: {
                'stroke': '#777',
                'fill': '#aeb0b0',
                'stroke-width': 1
            },
            imageOver: {fill: '#222'},

            buttonDown: {
                'stroke': '#555',
                'fill': '#999',
                'stroke-width': 1
            },
            imageDown: {fill: '#222'},


            buttonDisabled: {
                'stroke': '#888',
                'fill': '#aeb0b0',
                'stroke-width': 1
            },
            imageDisabled: {
                fill: '#444',
                'fill-opacity': 0.4,
                'stroke-opacity': 0.2
            },


            buttonPlay: {
                'stroke': '#C8E6C9',
                'fill': '#388E3C',
                'stroke-width': 1
            },


            imagePlay: {fill: '#C8E6C9'},

            overlay : {
                'fill-opacity' : 0.1,
                'fill': '#000'
            }
        };

        this.styles = this.styles || {};



        this.styles.button = Object.merge(this.defaultStyles.button, this.styles.button || {});
        this.styles.buttonOver = Object.merge(this.defaultStyles.buttonOver, this.styles.buttonOver || {});
        this.styles.buttonDown = Object.merge(this.defaultStyles.buttonDown, this.styles.buttonDown || {});
        this.styles.buttonDisabled = Object.merge(this.defaultStyles.buttonDisabled, this.styles.buttonDisabled || {});

        this.styles.buttonPlay = Object.merge(this.defaultStyles.buttonPlay, this.styles.buttonPlay || {});


        this.styles.image = Object.merge(this.defaultStyles.image, this.styles.image || {});
        this.styles.imageOver = Object.merge(this.defaultStyles.imageOver, this.styles.imageOver || {});
        this.styles.imageDown = Object.merge(this.defaultStyles.imageDown, this.styles.imageDown || {});
        this.styles.imageDisabled = Object.merge(this.defaultStyles.imageDisabled, this.styles.imageDisabled || {});
        this.styles.imagePlay = Object.merge(this.defaultStyles.imagePlay, this.styles.imagePlay || {});
        this.styles.overlay = Object.merge(this.defaultStyles.overlay, this.styles.overlay || {});



        jQuery(document.documentElement).on('mouseup', this.onMouseUp.bind(this));
    },

    __rendered: function () {
        this.parent();

        this.$b().css('overflow','hidden');
        this.createStylesheets();

        if (this.background) {
            this.bg = new chess.view.board.Background(
                Object.merge({
                    view: this,
                    square: false
                }, this.background)
            )
        }

        this.els.buttons = {};
        this.els.buttonRects = {};
        this.els.buttonPaths = {};
        this.els.overlays = {};
        this.els.clipRects = {};

        jQuery.each(this.buttons, function (i, btn) {
            if (btn != 'pause') {
                this.createButton(btn);
                if (btn != 'flip')this.disableButton(btn);
            }
        }.bind(this));


    },

    createStylesheets: function () {
        var s = this.svg();
        jQuery.each(this.styles, function (name, styles) {
            s.addStyleSheet('dc-' + name, styles);
        }.bind(this));
    },

    createButton: function (name) {
        var s = this.svg();

        var cp = s.$('clipPath');
        var cr = s.$('rect');
        cp.append(cr);
        s.appendDef(cp);
        this.els.clipRects[name] = cr;

        var g = s.$('g');
        g.attr('data-name', name);

        g.attr('aria-label', name);
        g.css('cursor', 'pointer');
        g.set('x', 0);
        g.set('y', 0);
        s.append(g);
        this.els.buttons[name] = g;
        var rect = s.$('rect');
        rect.addClass('dc-button');
        this.els.buttonRects[name] = rect;
        g.append(rect);

        var o = s.$('path');
        o.css(this.styles.overlay);
        o.clip(cp);
        this.els.overlays[name] = o;
        g.append(o);

        var p = s.$('path');
        p.set('line-join', 'round');
        p.set('line-cap', 'round');
        p.set('fill-rule', 'even-odd');
        this.els.buttonPaths[name] = p;
        p.addClass('dc-image');
        g.append(p);



        g.on('mouseenter', this.fn('enterButton', name));
        g.on('mouseleave', this.fn('leaveButton', name));
        g.on('mousedown', this.fn('downButton', name));
        g.on('click', this.fn('clickButton', name));

    },


    fn: function (fnName, btnName) {
        var that = this;
        return function () {
            that[fnName].call(that, btnName);
        }
    },

    enterButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, 'Over');
        }
    },

    leaveButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, '');
        }
    },

    downButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, 'Down');
            this.buttonDown = btnName;

        }

    },

    isDisabled: function (btn) {
        return this.disabledButtons.indexOf(btn) >= 0;
    },

    onMouseUp: function () {
        if (this.buttonDown) {
            var n = this.buttonDown;
            this.els.buttonRects[n].removeClass('dc-buttonDown');
            this.els.buttonPaths[n].removeClass('dc-imageDown');
            this.buttonDown = undefined;
        }
    },


    clickButton: function (btnName) {
        if (!this.isDisabled(btnName)) {
            this.cssButton(btnName, '');
            if (btnName == 'play' && this.autoPlayMode)btnName = 'pause';
            this.fireEvent(btnName);
        }
        return false;
    },

    cssButton: function (name, className) {

        if(this.buttons.indexOf(name) == -1)return;

        if (name == 'play' && this.autoPlayMode)className = 'Play';

        if (this.isDisabled(name)) {
            className = 'Disabled';

        }


        var r = this.els.buttonRects[name];
        var p = this.els.buttonPaths[name];

        r.removeAllClasses();
        p.removeAllClasses();

        r.addClass('dc-button' + className);
        p.addClass('dc-image' + className);


    },

    resize: function (size) {
        this.parent(size);
        this.resizeBar();

        this.fireEvent('boardResized', {
            left: 0, top: 0, width: this.svg().width, height: this.svg().height
        });

    },

    btnSize: undefined,

    resizeBar: function () {
        var s = this.svg();
        this.orientation = s.width > s.height ? 'horizontal' : 'vertical';
        this.size = Math.min(s.width, s.height);

        if (this.orientation == 'horizontal') {
            this.resizeHorizontal();
        } else {
            this.resizeVertical();
        }

        var r = this.getButtonRadius();

        jQuery.each(this.els.buttonRects, function (name, rect) {
            rect.css({
                rx: r, ry: r
            });
        });
    },

    overlayPath:function(c){


        var cy = c.y + (c.height * 0.55);
        var b = c.y + c.height;
        var r = c.x + c.width;
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y

        var ry = c.height * 0.05;
        return ['M',
            c.x, cy,
            'a',  c.width, c.height, 90, 0, 1, c.width/2, -ry,
            'a',  c.width, c.height, 90, 0, 1, c.width/2, ry,
            'L', r, b, c.x, b,
            'Z'
        ].join(' ');
    },

    getButtonRadius: function () {
        if (isNaN(this.borderRadius)) {

            var r = parseFloat(this.borderRadius);
            r = Math.min(50, r);

            return this.btnSize * r / 100;

        }
        return Math.min(this.btnSize / 2, this.borderRadius);

    },

    resizeHorizontal: function () {
        var s = this.svg();
        this.btnSize = this.buttonSize(s.height);
        var width = this.totalSize();
        var left = (s.width - width) * this.anchor[0];
        var top = (s.height - this.btnSize) * this.anchor[1];
        var change = this.btnSize + this.getSpacing();
        var props = {
            x: 0, y: 0, width: this.btnSize, height: this.btnSize

        };

        var overlayPath = this.overlayPath(props);
        jQuery.each(this.els.buttons, function (name, g) {
            g.setTranslate(left, top);
            this.els.buttonRects[name].setAttributes(props);
            this.els.clipRects[name].setAttributes(props);
            this.els.overlays[name].set('d', overlayPath);
            this.els.buttonPaths[name].set('d', this.getPath(name).join(' '));
            left += change;

        }.bind(this));
    },

    toPath: function (points) {

        var innerWidth = this.btnSize * 0.65;
        var innerHeight = this.btnSize * 0.55;
        var innerX = (this.btnSize - innerWidth) / 2;
        var innerY = (this.btnSize - innerHeight) / 2;

        var x = function (x) {
            return innerX + (innerWidth * x / 10)
        };
        var y = function (y) {
            return innerY + (innerHeight * y / 10);
        };
        var ind = 0;
        jQuery.each(points, function (i, p) {
            if (!isNaN(p)) {
                points[i] = ind % 2 == 0 ? x(p) : y(p);
                ind++;
            } else {
                ind = 0;
            }
        });

        return points;
    },


    getPath: function (btnName) {


        switch (btnName) {
            case 'start':
                return this.toPath(['M',
                    0, 0,
                    'L', 0, 10,
                    2, 10,
                    2, 0, 'Z',
                    'M', 2.5, 5,
                    'L', 6, 1.5,
                    6, 3.5,
                    10, 3.5,
                    10, 6.5,
                    6, 6.5,
                    6, 8.5,
                    2.5, 5,
                    'Z'
                ]);

            case 'pause':
                return this.toPath([
                    'M', 2, 1,
                    'L', 2, 9,
                    4, 9,
                    4, 1, 'Z',
                    'M', 6, 1,
                    'L', 6, 9,
                    8, 9,
                    8, 1, 'Z'
                ]);

            case 'previous':
                return this.toPath(['M', 0, 5,
                    'L', 4, 1,
                    4, 3,
                    9, 3,
                    9, 7,
                    4, 7,
                    4, 9,
                    'Z'
                ]);
            case 'play':
                return this.toPath(['M',
                    3, 1, 'L', 8, 5, 3, 9, 'Z'
                ]);
            case 'next':
                return this.toPath(['M', 1, 3, 'L', 5, 3, 5, 1, 9, 5, 5, 9, 5, 7, 1, 7, 'Z']);

            case 'end':
                return this.toPath(['M', 0, 3.5,
                    'L', 4, 3.5, 4, 1.5,
                    7, 5,
                    4, 8.5,
                    4, 6.5, 0, 6.5, 'Z',

                    'M', 7.8, 0.5, 'L',
                    9.8, 0.5,
                    9.9, 9.5,
                    7.9, 9.5]);

            case 'flip':
                return this.toPath([
                    'M', 2.75, 0,
                    'L',
                    0.5, 3.5, 2, 3.5,
                    2, 9.5,
                    3.5, 9.5,
                    3.5, 3.5,
                    5, 3.5, 'Z',
                    'M',
                    6, 0, 'L',
                    6, 6,
                    4.5, 6,
                    6.75, 9.5,
                    9, 6,
                    7.5, 6,
                    7.5, 0, 'Z'

                ]);

            default:
                return this.toPath(['M', 0, 0, 'L', 10, 0, 10, 10, 0, 10, 'Z'])

        }
    },

    resizeVertical: function () {

    },

    totalSize: function () {
        return (this.btnSize * this.buttons.length) + (this.getSpacing() * (this.buttons.length - 1));
    },

    getSpacing: function () {
        return this.btnSize * this.spacing / 100;
    },


    setController: function (controller) {
        this.parent(controller);

        this.controller.addEvent('startOfGame', this.startOfGame.bind(this));
        this.controller.addEvent('notStartOfGame', this.notStartOfBranch.bind(this));
        this.controller.addEvent('endOfBranch', this.endOfBranch.bind(this));
        this.controller.addEvent('notEndOfBranch', this.notEndOfBranch.bind(this));
        this.controller.addEvent('startAutoplay', this.startAutoPlay.bind(this));
        this.controller.addEvent('stopAutoplay', this.stopAutoPlay.bind(this));
        this.controller.addEvent('newGame', this.newGame.bind(this));
    },


    startOfGame: function () {
        this.disableButton('start');
        this.disableButton('previous');

    },

    notStartOfBranch: function () {
        this.enableButton('start');
        this.enableButton('previous');
        this.enableButton('play');
    },
    endOfBranch: function () {
        this.disableButton('end');
        this.disableButton('next');
        this.disableButton('play');
        this.isAtEndOfBranch = true;
        this.autoPlayMode = false;
    },

    notEndOfBranch: function (model) {
        this.isAtEndOfBranch = false;
        this.enableButton('end');
        this.enableButton('next');
        if (!model.isInAutoPlayMode()) {
            this.stopAutoPlay();
            this.enableButton('play');
        }

    },

    autoPlayMode: false,
    startAutoPlay: function () {
        this.els.buttonPaths['play'].set('d', this.getPath('pause').join(' '));

        this.enableButton('play');
        this.cssButton('play', 'Play');
        this.autoPlayMode = true;

    },

    stopAutoPlay: function () {
        if(!this.hasButton('play'))return;
        this.els.buttonPaths['play'].set('d', this.getPath('play').join(' '));
        if (!this.autoPlayMode)return;
        this.autoPlayMode = false;
        this.cssButton('play', '');

        if (this.isAtEndOfBranch) {
            this.disableButton('play');
        }

    },

    hasButton:function(name){
        return this.buttons.indexOf(name) != -1;
    },

    newGame: function () {

    },

    disableButton: function (name) {
        if(!this.hasButton(name))return;
        if (!this.isDisabled(name)) {
            this.disabledButtons.push(name);
            this.cssButton(name, 'Disabled');
            this.els.overlays[name].hide();
        }
    },

    enableButton: function (name) {
        if(!this.hasButton(name))return;
        if (this.isDisabled(name)) {
            var ind = this.disabledButtons.indexOf(name);
            this.disabledButtons.splice(ind, 1);
            this.cssButton(name, '');
            this.els.overlays[name].show();
        }
    },

    buttonSize: function (availSize) {
        return availSize;
    }


});/* ../dhtml-chess/src/view/gamelist/grid.js */
/**
 List of games view. List of games is displayed in a grid.
 @namespace chess.view.gamelist
 @module View
 @submodule Grid
 @class Grid
 @extends grid.Grid
 @constructor
 @param {Object} config
 @example
 children:[
 ... ,
 {
     titleBar:false,
     type:'chess.view.gamelist.Grid',
     weight:1,
     frame:true,
     fillview:true,
     cols:['white', 'black', 'result']
 }
 ...
 ]
 */
chess.view.gamelist.Grid = new Class({
    Extends: ludo.grid.Grid,
    type: 'chess.view.gamelist.Grid',
    module: 'chess',
    submodule: 'gameList',
    titleBar: false,
    dataSource: {
        'type': 'chess.dataSource.GameList',
        shim: {
            txt: 'Loading games. Please wait'
        }
    },
    resizable: false,
    statusBar: false,
    fillview: true,
    headerMenu:false,

    /**
     Columns to show in grid. Columns corresponds to metadata of games, example
     white,black,result, event, eco
     @config cols
     @type Array
     @optional
     @example
     cols:['white','black']
     */
    cols: undefined,


    columns: {
        white: {
            heading: chess.getPhrase('White'),
            key: 'white',
            width: 120,
            sortable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        black: {
            heading: chess.getPhrase('Black'),
            key: 'black',
            width: 120,
            sortable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        round: {
            heading: chess.getPhrase('Round'),
            key: 'round',
            width: 70,
            sortable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        result: {
            heading: chess.getPhrase('Result'),
            key: 'result',
            width: 70,
            sortable: true,
            removable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        event: {
            heading: chess.getPhrase('Event'),
            key: 'event',
            weight: 1,
            sortable: true,
            removable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        },
        last_moves: {
            heading: chess.getPhrase('Last moves'),
            key: 'last_moves',
            weight: 1,
            sortable: true,
            removable: true,
            renderer:function(val){
                return val != undefined ? val : '';
            }
        }

    },
    /**
     * initial database id. Show the games from this database when the grid is first displayed.
     * @config databaseId
     * @type {Number}
     * @default undefined
     */
    databaseId: undefined,

    setController: function (controller) {
        this.parent(controller);
        var ds = this.getDataSource();
        controller.on('selectDatabase', this.selectDatabase.bind(this));
        controller.on('nextGame', ds.next.bind(ds));
        controller.on('previousGame', ds.previous.bind(ds));
        controller.on('selectPgn', this.selectPgn.bind(this));
        controller.on('gameSaved', this.onGameSave.bind(this));
    },


    onGameSave: function (game) {
        if (game.databaseId)this.selectDatabase({id: game.databaseId});
    },
    /**
     Select a new database
     @method selectDatabase
     @param {Object} record
     */
    selectDatabase: function (record) {
        this.loadGames(record.id);
    },

    selectPgn: function (pgn) {

        var r = this.getDataSource().postData.resource;

        this.getDataSource().postData.arguments = pgn;

        this.getDataSource().sendRequest({
            resource: r,
            service: 'listOfGames',
            arguments: pgn
        });
    },

    __construct: function (config) {
        this.parent(config);
        this.databaseId = config.databaseId || this.databaseId;
        var cols = config.cols || this.cols;
        if (cols) {
            this.getColumnManager().hideAllColumns();
            for (var i = 0; i < cols.length; i++) {
                this.getColumnManager().showColumn(cols[i]);
            }
        }
    },
    ludoEvents: function () {
        this.parent();
        this.getDataSource().addEvent('select', this.selectGame.bind(this))
    },
    __rendered: function () {
        this.parent();
        if (this.databaseId) {
            this.loadGames(this.databaseId);
        }
    },

    loadGames: function (databaseId) {
        this.databaseId = databaseId;
        this.getDataSource().sendRequest('games', databaseId);
    },

    selectGame: function (record) {

        /**
         * Event fired on click on game in grid.
         * @event selectGame
         * @param {Object} game
         */
        if (record.gameIndex !== undefined) {
            this.fireEvent('selectGame', [record, this.getDataSource().getCurrentPgn()]);
        } else {
            this.fireEvent('selectGame', record);
        }
    }
});/* ../dhtml-chess/src/view/metadata/game.js */
/**
 * This class shows metadata(example: white,black etc) of current game. It listens to the "newGame" event of the controller
 * @namespace chess.view.metadata
 * @class Game
 * @extends View
 */
chess.view.metadata.Game = new Class({
    Extends : ludo.View,
    type : 'chess.view.metadata.Game',
    module:'chess',
    submodule : 'metadata.Game',

	/**
	 How metadata are displayed is configured using "tpl".
	 @config tpl
	 @type String
	 @example
	 	'{white} vs {black}, {result}'
	 */
    tpl : '',
    overflow:'hidden',

    __construct : function(config){
        this.parent(config);
        this.tpl = config.tpl || this.tpl;
    },

    setController : function(controller){
        this.controller = controller;
        this.controller.addEvent('newGame', this.updateMetadata.bind(this));
    },

    __rendered : function(){
        this.parent();
    },

    updateMetadata : function(model){
        var metadata = model.getMetadata();
        if(jQuery.isFunction(this.tpl)){
            this.$b().html(this.tpl.call(this, metadata));
            return;
        }
        var keys = this.getTplKeys();
        var html = this.tpl;
        var replacement;
        for(var i=0;i<keys.length;i++){
            if(metadata[keys[i]]){
                replacement = metadata[keys[i]];
            }else{
                replacement = '';
            }
            html = html.replace('{' + keys[i] + '}', replacement);
        }
        this.$b().html( html);
    },

    getTplKeys : function(){

        var tokens = this.tpl.match(/{([a-z]+?)\}/g);
        for(var i=0;i<tokens.length;i++){
            tokens[i] = tokens[i].replace(/[{}]/g,'')
        }
        return tokens;
    }
});/* ../dhtml-chess/src/view/metadata/move.js */
/**
 * Class used to show info about current move. This view is updated when one of the following events is fired by the controller, i.e.
 * controllers active game model.
 * setPosition, nextmove, newMove, newGame
 * @namespace chess.view.metadata
 * @class Move
 * @extends View
 */
chess.view.metadata.Move = new Class({
    Extends : ludo.View,
    type : 'chess.view.metadata.Move',
    module:'chess',
    submodule : 'metadata.Move',
	/**
	 tpl is used to configure how to display info about current move. You use curly braces to indicate
	 where to insert move information. You can use the keys available in chess.model.Move
	 @config tpl
	 @default ''
	 @example
	 	tpl:'Current move: {from}-{to}'
	 	...
	 	tpl:'{lm} // long notation
	 	...
	 	tpl:'{m} // short notation
	 */
    tpl : '',

    __construct : function(config){
        this.parent(config);
        this.tpl = config.tpl || this.tpl;
    },

    setController : function(controller){
        this.controller = controller;
        this.controller.addEvent('setPosition', this.updateMetadata.bind(this));
        this.controller.addEvent('nextmove', this.updateMetadata.bind(this));
        this.controller.addEvent('newMove', this.updateMetadata.bind(this));
        this.controller.addEvent('newGame', this.updateMetadata.bind(this));
    },

    __rendered : function(){
        this.parent();
    },

    updateMetadata : function(model){
        var metadata = model.getCurrentMove() || '';

        var keys = this.getTplKeys();
        var html = this.tpl;
        var replacement;
        for(var i=0;i<keys.length;i++){
            if(metadata[keys[i]]){
                replacement = metadata[keys[i]];
            }else{
                replacement = '';
            }
            html = html.replace('{' + keys[i] + '}', replacement);
        }
        this.$b().html( html);
    },

    getTplKeys : function(){
        var tokens = this.tpl.match(/{([a-z]+?)\}/g);
        for(var i=0;i<tokens.length;i++){
            tokens[i] = tokens[i].replace(/[{}]/g,'')
        }
        return tokens;
    }
});/* ../dhtml-chess/src/view/metadata/fen-field.js */
/**
 * This is a text/input-field showing position of current move. It will be updated when one of the following events is fired by
 * the controller: newGame, setPosition, newMove, nextMove.
 * @namespace chess.view.metadata
 * @class FenField
 * @extends form.Text
 */
chess.view.metadata.FenField = new Class({
    Extends : ludo.form.Text,
    type : 'chess.view.metadata.FenField',
    module:'chess',
    submodule : 'metadata.FenField',
    stretchField : true,
    label : chess.getPhrase('FEN'),
    formCss : { 'font-size' : '10px'},
    labelWidth : 30,
    selectOnFocus : true,
    setController : function(controller){
        this.parent(controller);
        this.controller.addEvent('newGame', this.showFen.bind(this));
        this.controller.addEvent('setPosition', this.showFen.bind(this));
        this.controller.addEvent('newMove', this.showFen.bind(this));
        this.controller.addEvent('nextmove', this.showFen.bind(this));
    },

    __rendered:function(){
        this.parent();
        this.getFormEl().on('click', this.selectEl.bind(this));
    },
    selectEl:function(){
        this.getFormEl().select();
    },

    showFen : function(model){
        var fen = model.getCurrentPosition();
        this._set(fen);
    }

});/* ../dhtml-chess/src/view/message/tactics-message.js */
/**
 * Tactic message showing wrong move or incorrect move. This view listens to controller events
 * wrongGuess, correctGuess and newGame. On newGame it will display which color to move.
 * @namespace chess.view.message
 * @class TacticMessage
 * @extends View
 */
chess.view.message.TacticsMessage = new Class({
    Extends:ludo.View,
    type:'chess.view.message.TacticsMessage',
    module:'chess',
    submodule:'TacticsMessage',

    // Auto hide messages after milliseconds, pass false or undefined to disable this
    autoHideAfterMs:3000,

    __construct:function(config){
        this.parent(config);
        this.__params(config, ['autoHideAfterMs']);
    },

    ludoDOM:function () {
        this.parent();
        this.$e.addClass('dhtml-chess-tactics-message');
    },
    setController:function (controller) {
        this.parent(controller);
        this.controller.addEvent('wrongGuess', this.showWrongGuess.bind(this));
        this.controller.addEvent('correctGuess', this.showCorrectGuess.bind(this));
        this.controller.addEvent('newGame', this.newGame.bind(this));
    },

    newGame:function (model) {
        var colorToMove = model.getColorToMove();
        this.showMessage(chess.getPhrase(colorToMove) + ' ' + chess.getPhrase('to move'));

    },

    showWrongGuess:function () {
        this.showMessage(chess.getPhrase('Wrong move - please try again'), this.autoHideAfterMs);

    },

    showCorrectGuess:function () {
        this.showMessage(chess.getPhrase('Good move'), this.autoHideAfterMs);

    },

    showMessage:function (message, delayBeforeHide) {
        this.$b().html( message);
        if(delayBeforeHide){
            this.autoHideMessage.delay(delayBeforeHide, this);
        }
    },

    autoHideMessage:function () {
        this.$b().html('');
    }
});/* ../dhtml-chess/src/view/dialog/dialog.js */
chess.view.dialog.Dialog = new Class({
    Extends: ludo.dialog.Dialog,

    showDialog:function(){
        if (this.controller.views.board) {
            this.layout.centerIn = this.controller.views.board.getEl();
            this.getLayout().getRenderer().clearFn();
            this.getLayout().getRenderer().resize();

        }

        this.show();

        if (!this.controller.views.board){
            this.center();
        }
    }
});/* ../dhtml-chess/src/view/dialog/overwrite-move.js */
/**
 * Displays an overwrite move dialog. This dialog listens to
 * overwriteOrVariation of the controller.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class OverwriteMove
 * @extends ludo.dialog.Dialog
 */
chess.view.dialog.OverwriteMove = new Class({
	Extends:chess.view.dialog.Dialog,
	type:'chess.view.dialog.OverwriteMove',
	module:'chess',
	submodule:'dialogOverwriteMove',
	width:330,
	height:150,
	move:undefined,
	hidden:true,

	closable:false,
	minimizable:false,
	fullScreen:false,
	resizable:false,
	modal:true,
	autoRemove:false,

	__construct:function (config) {

		config = config || {};
		config.buttons = [
			{
				value:chess.getPhrase('Overwrite'),
				listeners:{
					'click':function () {
						/**
						 * Overwrite current move in model with a new move
						 * @event overwriteMove
						 * @param {chess.model.Move} oldMove
						 * @param {chess.model.Move} newMove
						 */
						this.fireEvent('overwriteMove', [ this.move.oldMove, this.move.newMove]);
						this.hide();
					}.bind(this)}
			},
			{
				value:chess.getPhrase('Variation'),
				listeners:{
					'click':function () {
						/**
						 * Create a new variation
						 * @event newVariation
						 * @param {chess.model.Move} oldMove
						 * @param {chess.model.Move} newMove
						 */
						this.fireEvent('newVariation', [ this.move.oldMove, this.move.newMove]);
						this.hide();
					}.bind(this)}
			},
			{
				value:chess.getPhrase('Cancel'),
				listeners:{
					'click':function () {
						/**
						 * Cancel new move, i.e. no overwrite and no new variations.
						 * @event cancelOverwrite
						 */
						this.fireEvent('cancelOverwrite');
						this.hide(this)
					}.bind(this)
				}
			}
		];

		this.parent(config);
	},
	show:function () {
		this.parent();
	},

	setController:function (controller) {
		this.parent(controller);
		this.controller.addEvent('overwriteOrVariation', this.showDialog.bind(this))
	},

	__rendered:function () {
		this.parent();
	},

	showDialog:function (model, moves) {

		this.parent();
		this.move = moves;
		this.setTitle('Overwrite move ' + moves.oldMove.lm);
		this.html('Do you want to overwrite move <b>' + moves.oldMove.lm + '</b> with <b>' + moves.newMove.lm + '</b> ?');

	}
});/* ../dhtml-chess/src/view/dialog/puzzle-solved.js */
chess.view.dialog.PuzzleSolved = new Class({
    type:'chess.view.dialog.PuzzleSolved',
    Extends: ludo.dialog.Alert,
    layout:{
        width:250,height:150
    },

    __construct:function(config){
        config.title = config.title || chess.getPhrase('Well done - Puzzle complete');
        config.html = config.html || chess.getPhrase('Good job! You have solved this puzzle. Click OK to load next game');
        this.parent(config);
    }
    
});/* ../dhtml-chess/src/view/dialog/promote.js */
/**
 * Promotion dialog which will be displayed when controller fires the verifyPromotion event. Which piece to promote to
 * is chosen by clicking on images illustrating queen, rook, knight and bishop.
 * @submodule Dialog
 * @namespace chess.view.dialog
 * @class Promote
 * @extends dialog.Dialog
 */
chess.view.dialog.Promote = new Class({
    Extends: chess.view.dialog.Dialog,
    module: 'chess',
    submodule: 'dialogPromote',
    layout: {
        type: 'grid',
        columns: 2,
        rows: 2,
        width: 300,
        height: 330
    },
    hidden: true,
    title: 'Promote to',
    pieces: [],
    move: undefined,
    autoRemove: false,

    children: [
        {
            type: 'chess.view.dialog.PromotePiece',
            piece: 'q',
            layout: {x: 0, y: 0}
        },
        {
            type: 'chess.view.dialog.PromotePiece',
            piece: 'r',
            layout: {x: 1, y: 0}
        },
        {
            type: 'chess.view.dialog.PromotePiece',
            piece: 'b',
            layout: {x: 0, y: 1}
        },
        {
            type: 'chess.view.dialog.PromotePiece',
            piece: 'n',
            layout: {x: 1, y: 1}
        }
    ],

    __construct:function(config){

        this.parent(config);
    },

    setController: function (controller) {
        this.parent(controller);

        this.controller.on('verifyPromotion', this.showDialog.bind(this));


    },

    __rendered: function () {
        this.parent();
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].addEvent('click', this.clickOnPiece.bind(this));
        }
    },

    setColor: function (color) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].setColor(color);
        }

    },

    clickOnPiece: function (piece) {
        this.move.promoteTo = piece;
        /**
         * Event fired after promoted piece type has been selected. the promoteTo property of the move is updated
         * @event promote
         * @param {chess.model.Move} updatedMove
         */
        this.fireEvent('promote', this.move);
        this.hide();
    },

    showDialog: function (model, move) {
        this.parent();
        this.move = move;
        this.setColor(model.getColorToMove());

    }
});

chess.view.dialog.PromotePiece = new Class({
    Extends: ludo.View,
    type: 'chess.view.dialog.PromotePiece',
    piece: undefined,
    framed: true,
    __construct: function (config) {
        this.parent(config);
        this.piece = config.piece
    },

    __rendered: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-promote-piece');
        this.$e.on('click', this.clickOnPiece.bind(this));

    },

    setColor: function (color) {
        this.$e.removeClass('dhtml-chess-promote-white-' + this.piece);
        this.$e.removeClass('dhtml-chess-promote-black-' + this.piece);
        this.$e.addClass('dhtml-chess-promote-' + color + '-' + this.piece);
    },

    clickOnPiece: function () {
        this.fireEvent('click', this.piece);
    }
});/* ../dhtml-chess/src/view/dialog/comment.js */
/**
 * Move comment dialog. This dialog is by default created by a chess game controller. It listens to controller events
 * "commentAfter" and "commentBefore". When these events are fired
 * @namespace chess.view.dialog
 * @class Comment
 * @extends dialog.Dialog
 */
chess.view.dialog.Comment = new Class({
    Extends:chess.view.dialog.Dialog,
    module:'chess',
    submodule:'dialogComment',
    layout:'rows',
    width:300,
    height:330,
    hidden:true,
    title:chess.getPhrase('Add comment'),
    move:undefined,
    autoRemove:false,
    buttonConfig:'OkCancel',
    commentPos:undefined,
    css:{
        'padding':0
    },
    children:[
        {
            type:'form.Textarea',
            name:'comment',
            weight:1,
            css:{
                'padding':0
            }
        }
    ],
    setController:function (controller) {
        this.parent(controller);
        this.controller.addEvent('commentAfter', this.commentAfter.bind(this));
        this.controller.addEvent('commentBefore', this.commentBefore.bind(this));
    },

    ludoEvents:function () {
        this.parent();
        this.addEvent('ok', this.sendComment.bind(this));
    },
    __rendered:function () {
        this.parent();
    },

    sendComment:function () {
        var ev = this.commentPos == 'before' ? 'commentBefore' : 'commentAfter';
        var comment = this.child['comment'].getValue().trim();
        this.fireEvent(ev, [comment, this.move]);
    },
	/**
	 * Show comments before a move. Automatically executed when commentAfter event is fired by controller
	 * @method commentBefore
	 * @param {chess.model.Game} model
	 * @param {Object} move
	 */
    commentBefore:function (model, move) {
        this.commentPos = 'before';
        this.showDialog(model, move);
    },

	/**
	 * Show comments after a move. Automatically executed when commentAfter event is fired by controller
	 * @method commentAfter
	 * @param {chess.model.Game} model
	 * @param {Object} move
	 */
    commentAfter:function (model, move) {
        this.commentPos = 'after';
        this.showDialog(model, move);
    },

    showDialog:function (model, move) {
        this.parent();
        this.move = model.getMove(move);
        var comment = this.commentPos == 'before' ? model.getCommentBefore(this.move) : model.getCommentAfter(this.move);
        this.child['comment'].setValue(comment);
        this.setTitle(this.getDialogTitle());
    },

    getDialogTitle:function(){
        return chess.getPhrase( this.commentPos == 'before' ? 'addCommentBefore' : 'addCommentAfter') + ' (' + this.move.lm + ')';
    }
});/* ../dhtml-chess/src/view/button/tactic-hint.js */
/**
 * Special button used to show tactic hint in tactic puzzle mode
 * @namespace chess.view.button
 * @class TacticHint
 * @extends form.Button
 */
chess.view.button.TacticHint = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.TacticHint',
    module:'chess',
    submodule : 'buttonTacticHint',
    value : chess.getPhrase('Hint'),
    width : 80,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.showHint.bind(this));
    },

    showHint : function() {
        this.fireEvent('showHint')
    }
});/* ../dhtml-chess/src/view/button/tactic-solution.js */
/**
 * Special button used to show the solution, i.e. next move in a puzzle
 * @namespace chess.view.button
 * @class TacticSolution
 * @extends form.Button
 */
chess.view.button.TacticSolution = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.TacticSolution',
    module:'chess',
    submodule : 'buttonTacticSolution',
    value : chess.getPhrase('Solution'),
    width : 80,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.showSolution.bind(this));
    },

    showSolution : function() {
        this.fireEvent('showSolution')
    }
});/* ../dhtml-chess/src/view/button/next-game.js */
/**
 * Special button used to navigate to next game in a database
 * @namespace chess.view.button
 * @class NextGame
 * @extends form.Button
 */
chess.view.button.NextGame = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.NextGame',
    module:'chess',
    submodule : 'buttonNextGame',
    value : '>',
    width : 30,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.nextGame.bind(this));
    },

    nextGame : function() {
        this.fireEvent('nextGame');
    }
});/* ../dhtml-chess/src/view/button/previous-game.js */
/**
 * Special button used to navigate to previous button in a database
 * @namespace chess.view.button
 * @class PreviousGame
 * @extends form.Button
 */
chess.view.button.PreviousGame = new Class({
    Extends : ludo.form.Button,
    type : 'chess.view.button.NextGame',
    module:'chess',
    submodule : 'buttonPreviousGame',
    value : '<',
    width : 30,

    ludoEvents : function(){
        this.parent();
        this.addEvent('click', this.previousGame.bind(this));
    },

    previousGame : function() {
        this.fireEvent('previousGame');
    }
});/* ../dhtml-chess/src/view/pgn/grid.js */
if(chess.view.pgn === undefined)chess.view.pgn = {};
/**
 List of games view. List of games is displayed in a grid.
 @namespace chess.view.gamelist
 @module View
 @submodule Grid
 @class Grid
 @extends grid.Grid
 @constructor
 @param {Object} config
 @example
 children:[
 ... ,
 {
     titleBar:false,
     type:'chess.view.gamelist.Grid',
     weight:1,
     frame:true,
     fillview:true,
     cols:['white', 'black', 'result']
 }
 ...
 ]
 */
chess.view.pgn.Grid = new Class({
    Extends:ludo.grid.Grid,
    type:'chess.view.gamelist.Grid',
    module:'chess',
    submodule:'list-of-pgn-files',
    titleBar:false,
    dataSource:{
        'type':'chess.dataSource.PgnList'
    },
    resizable:false,
    statusBar:false,
    fillview:true,


	columns:{
		file:{
			heading:chess.getPhrase('Pgn files'),
			key:'file',
			width:120,
			sortable:true
		}
    },
    /**
     * initial database id. Show the games from this database when the grid is first displayed.
     * @config databaseId
     * @type {Number}
     * @default undefined
     */
    databaseId:undefined,

    setController:function (controller) {
        this.parent(controller);
    },

    __construct:function (config) {
        this.parent(config);
        this.databaseId = config.databaseId || this.databaseId;
        if (config.cols) {
            this.getColumnManager().hideAllColumns();
            for (var i = 0; i < config.cols.length; i++) {
                this.getColumnManager().showColumn(config.cols[i]);
            }
        }
    },
    ludoEvents:function () {
        this.parent();
        this.getDataSource().addEvent('select', this.selectPgnFile.bind(this))
    },

    loadGames:function (databaseId) {
        this.databaseId = databaseId;
        this.getDataSource().sendRequest('games', databaseId);
    },

    selectPgnFile:function (record) {
        /**
         * Event fired on click on game in grid.
         * @event selectPgn
         * @param {Object} game
         */

        this.fireEvent('selectPgn', record.file);
    }
});/* ../dhtml-chess/src/parser0x88/config.js */
Board0x88Config = {
    squares:[
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'
    ],

    fenSquares:[
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
    ],

    fenSquaresNumeric:[
        112, 113, 114, 115, 116, 117, 118, 119,
        96, 97, 98, 99, 100, 101, 102, 103,
        80, 81, 82, 83, 84, 85, 86, 87,
        64, 65, 66, 67, 68, 69, 70, 71,
        48, 49, 50, 51, 52, 53, 54, 55,
        32, 33, 34, 35, 36, 37, 38, 39,
        16, 17, 18, 19, 20, 21, 22, 23,
        0, 1, 2, 3, 4, 5, 6, 7
    ],

    fenNotations:{
        white:{
            'p':'P',
            'n':'N',
            'b':'B',
            'r':'R',
            'q':'Q',
            'k':'K'
        },
        black:{
            'p':'p',
            'n':'n',
            'b':'b',
            'r':'r',
            'q':'q',
            'k':'k'
        }
    },

    fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',

    fenPieces:{
        'p':'blackPawns', 'b':'blackBishops', 'n':'blackKnights', 'r':'blackRooks', 'q':'blackQueens', 'k':'blackKing',
        'P':'whitePawns', 'B':'whiteBishops', 'N':'whiteKnights', 'R':'whiteRooks', 'Q':'whiteQueens', 'K':'whiteKing'
    },

    colorAbbreviations:{ 'w':'white', 'b':'black' },
    oppositeColors:{ 'white':'black', 'black':'white'},
    mapping:{
        'a1':0, 'b1':1, 'c1':2, 'd1':3, 'e1':4, 'f1':5, 'g1':6, 'h1':7,
        'a2':16, 'b2':17, 'c2':18, 'd2':19, 'e2':20, 'f2':21, 'g2':22, 'h2':23,
        'a3':32, 'b3':33, 'c3':34, 'd3':35, 'e3':36, 'f3':37, 'g3':38, 'h3':39,
        'a4':48, 'b4':49, 'c4':50, 'd4':51, 'e4':52, 'f4':53, 'g4':54, 'h4':55,
        'a5':64, 'b5':65, 'c5':66, 'd5':67, 'e5':68, 'f5':69, 'g5':70, 'h5':71,
        'a6':80, 'b6':81, 'c6':82, 'd6':83, 'e6':84, 'f6':85, 'g6':86, 'h6':87,
        'a7':96, 'b7':97, 'c7':98, 'd7':99, 'e7':100, 'f7':101, 'g7':102, 'h7':103,
        'a8':112, 'b8':113, 'c8':114, 'd8':115, 'e8':116, 'f8':117, 'g8':118, 'h8':119
    },

    numberToSquareMapping:{
        '0':'a1', '1':'b1', '2':'c1', '3':'d1', '4':'e1', '5':'f1', '6':'g1', '7':'h1',
        '16':'a2', '17':'b2', '18':'c2', '19':'d2', '20':'e2', '21':'f2', '22':'g2', '23':'h2',
        '32':'a3', '33':'b3', '34':'c3', '35':'d3', '36':'e3', '37':'f3', '38':'g3', '39':'h3',
        '48':'a4', '49':'b4', '50':'c4', '51':'d4', '52':'e4', '53':'f4', '54':'g4', '55':'h4',
        '64':'a5', '65':'b5', '66':'c5', '67':'d5', '68':'e5', '69':'f5', '70':'g5', '71':'h5',
        '80':'a6', '81':'b6', '82':'c6', '83':'d6', '84':'e6', '85':'f6', '86':'g6', '87':'h6',
        '96':'a7', '97':'b7', '98':'c7', '99':'d7', '100':'e7', '101':'f7', '102':'g7', '103':'h7',
        '112':'a8', '113':'b8', '114':'c8', '115':'d8', '116':'e8', '117':'f8', '118':'g8', '119':'h8'
    },

    numericMapping:{
        '0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7,
        '8':16, '9':17, '10':18, '11':19, '12':20, '13':21, '14':22, '15':23,
        '16':32, '17':33, '18':34, '19':35, '20':36, '21':37, '22':38, '23':39,
        '24':48, '25':49, '26':50, '27':51, '28':52, '29':53, '30':54, '31':55,
        '32':64, '33':65, '34':66, '35':67, '36':68, '37':69, '38':70, '39':71,
        '40':80, '41':81, '42':82, '43':83, '44':84, '45':85, '46':86, '47':87,
        '48':96, '49':97, '50':98, '51':99, '52':100, '53':101, '54':102, '55':103,
        '56':112, '57':113, '58':114, '59':115, '60':116, '61':117, '62':118, '63':119
    },
    pieces:{
        'P':0x01,
        'N':0x02,
        'K':0x03,
        'B':0x05,
        'R':0x06,
        'Q':0x07,
        'p':0x09,
        'n':0x0A,
        'k':0x0B,
        'b':0x0D,
        'r':0x0E,
        'q':0x0F
    },
    pieceMapping:{
        0x01:'P',
        0x02:'N',
        0x03:'K',
        0x05:'B',
        0x06:'R',
        0x07:'Q',
        0x09:'p',
        0x0A:'n',
        0x0B:'k',
        0x0D:'b',
        0x0E:'r',
        0x0F:'q'
    },

    pieceValues:{
        0x01:1,
        0x02:3,
        0x03:100,
        0x05:3,
        0x06:5,
        0x07:9,
        0x09:1,
        0x0A:3,
        0x0B:100,
        0x0D:3,
        0x0E:5,
        0x0F:9
    },

    pieceAbbr:{
        'Q':'q',
        'R':'r',
        'N':'n',
        'B':'b'
    },
    typeMapping:{
        0x01:'p',
        0x02:'n',
        0x03:'k',
        0x05:'b',
        0x06:'r',
        0x07:'q',
        0x09:'p',
        0x0A:'n',
        0x0B:'k',
        0x0D:'b',
        0x0E:'r',
        0x0F:'q'
    },

    notationMapping:{
        0x01:'',
        0x02:'N',
        0x03:'K',
        0x05:'B',
        0x06:'R',
        0x07:'Q',
        0x09:'',
        0x0A:'N',
        0x0B:'K',
        0x0D:'B',
        0x0E:'R',
        0x0F:'Q'
    },
    numberToColorMapping:{
        0x01:'white',
        0x02:'white',
        0x03:'white',
        0x05:'white',
        0x06:'white',
        0x07:'white',
        0x09:'black',
        0x0A:'black',
        0x0B:'black',
        0x0D:'black',
        0x0E:'black',
        0x0F:'black'
    },

    typeToNumberMapping:{
        'p':0x01,
        'n':0x02,
        'N':0x02,
        'k':0x03,
        'b':0x05,
        'B':0x05,
        'r':0x06,
        'R':0x06,
        'q':0x07,
        'Q':0x07
    },

    colorMapping:{
        'p':'black', 'n':'black', 'b':'black', 'r':'black', 'q':'black', 'k':'black',
        'P':'white', 'N':'white', 'B':'white', 'R':'white', 'Q':'white', 'K':'white'
    },

    castle:{
        '-':0,
        'K':8,
        'Q':4,
        'k':2,
        'q':1
    },

    castleMapping:{
        0:'-',
        1:'q',
        2:'k',
        3:'kq',
        4:'Q',
        5:'Qq',
        6:'Qk',
        7:'Qkq',
        8:'K',
        9:'Kq',
        10:'Kk',
        11:'Kkq',
        12:'KQ',
        13:'KQq',
        14:'KQk',
        15:'KQkq'
    },
    
    castleToNumberMapping:{
        '-':0,
        'q':1,
        'k':2,
        'kq':3,
        'Q':4,
        'Qq':5,
        'Qk':6,
        'Qkq':7,
        'K':8,
        'Kq':9,
        'Kk':10,
        'Kkq':11,
        'KQ':12,
        'KQq':13,
        'KQk':14,
        'KQkq':15       
        
    },

    numbers:{
        '0':1, '1':1, '2':1, '3':1, '4':1, '5':1, '6':1, '7':1, '8':1, '9':0
    },
    movePatterns:{
        0X01:[16, 32, 15, 17],
        0X09:[-16, -32, -15, -17],
        0x05:[-15, -17, 15, 17],
        0x0D:[-15, -17, 15, 17],
        0x06:[-1, 1, -16, 16],
        0x0E:[-1, 1, -16, 16],
        0x07:[-15, -17, 15, 17, -1, 1, -16, 16],
        0x0F:[-15, -17, 15, 17, -1, 1, -16, 16],
        0X02:[-33, -31, -18, -14, 14, 18, 31, 33],
        0x0A:[-33, -31, -18, -14, 14, 18, 31, 33],
        0X03:[-17, -16, -15, -1, 1, 15, 16, 17],
        0X0B:[-17, -16, -15, -1, 1, 15, 16, 17]
    },

    distances:{'241':1, '242':2, '243':3, '244':4, '245':5, '246':6, '247':7, '272':1,
        '273':1, '274':2, '275':3, '276':4, '277':5, '278':6, '279':7, '304':2, '305':2,
        '306':2, '307':3, '308':4, '309':5, '310':6, '311':7, '336':3, '337':3, '338':3,
        '339':3, '340':4, '341':5, '342':6, '343':7, '368':4, '369':4, '370':4, '371':4,
        '372':4, '373':5, '374':6, '375':7, '400':5, '401':5, '402':5, '403':5, '404':5,
        '405':5, '406':6, '407':7, '432':6, '433':6, '434':6, '435':6, '436':6, '437':6,
        '438':6, '439':7, '464':7, '465':7, '466':7, '467':7, '468':7, '469':7, '470':7,
        '471':7, '239':1, '271':1, '303':2, '335':3, '367':4, '399':5, '431':6, '463':7,
        '238':2, '270':2, '302':2, '334':3, '366':4, '398':5, '430':6, '462':7, '237':3,
        '269':3, '301':3, '333':3, '365':4, '397':5, '429':6, '461':7, '236':4, '268':4,
        '300':4, '332':4, '364':4, '396':5, '428':6, '460':7, '235':5, '267':5, '299':5,
        '331':5, '363':5, '395':5, '427':6, '459':7, '234':6, '266':6, '298':6, '330':6,
        '362':6, '394':6, '426':6, '458':7, '233':7, '265':7, '297':7, '329':7, '361':7,
        '393':7, '425':7, '457':7, '208':1, '209':1, '210':2, '211':3, '212':4, '213':5,
        '214':6, '215':7, '207':1, '206':2, '205':3, '204':4, '203':5, '202':6, '201':7,
        '176':2, '177':2, '178':2, '179':3, '180':4, '181':5, '182':6, '183':7, '175':2,
        '174':2, '173':3, '172':4, '171':5, '170':6, '169':7, '144':3, '145':3, '146':3,
        '147':3, '148':4, '149':5, '150':6, '151':7, '143':3, '142':3, '141':3, '140':4,
        '139':5, '138':6, '137':7, '112':4, '113':4, '114':4, '115':4, '116':4, '117':5,
        '118':6, '119':7, '111':4, '110':4, '109':4, '108':4, '107':5, '106':6, '105':7,
        '80':5, '81':5, '82':5, '83':5, '84':5, '85':5, '86':6, '87':7, '79':5, '78':5,
        '77':5, '76':5, '75':5, '74':6, '73':7, '48':6, '49':6, '50':6, '51':6, '52':6,
        '53':6, '54':6, '55':7, '47':6, '46':6, '45':6, '44':6, '43':6, '42':6, '41':7,
        '16':7, '17':7, '18':7, '19':7, '20':7, '21':7, '22':7, '23':7, '15':7, '14':7,
        '13':7, '12':7, '11':7, '10':7, '9':7
    },

    fileMapping:['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    rankMapping:{ 0:1, 16:2, 32:3, 48:4, 64:5, 80:6, 96:7, 112:8},
    files:{ 'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7}
};/* ../dhtml-chess/src/parser0x88/fen-parser-0x88.js */
/**
 Chess position parser
 @module Parser
 @namespace chess.parser
 @class FenParser0x88
 @constructor
 @param {String} fen
 @example
 	var parser = new chess.parser.FenParser0x88('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
 	console.log(parser.getValidMovesAndResult('white'));

 */
chess.parser.FenParser0x88 = new Class({

    madeMoves:[],

	initialize:function (fen) {
		if (fen) {
			this.setFen(fen);
		}
	},

	/**
	 * Set a new position
	 * @method setFen
	 * @param {String} fen
	 */
	setFen:function (fen) {
		this.cache = {
            fenParts: {},
			'board':[],
			'white':[],
			'black':[],
			'whiteSliding':[],
			'blackSliding':[],
			'k':{ 'white':undefined, 'black':'undefined'}
		};
		this.fen = fen;
		this.updateFenArray(fen);
		this.parseFen();
        this.madeMoves = [];
	},

	updateFenArray:function () {
		var fenParts = this.fen.split(' ');

		this.cache.fenParts = {
			'pieces':fenParts[0],
			'color':fenParts[1],
			'castleCode':Board0x88Config.castleToNumberMapping[fenParts[2]],
			'enPassant':fenParts[3],
			'halfMoves':fenParts[4],
			'fullMoves':fenParts[5]
		};
	},

	/**
	 * Parses current fen and stores board information internally
	 * @method parseFen
	 */
	parseFen:function () {
		var pos = 0;

		var squares = Board0x88Config.fenSquares;
		var index, type, piece;
		for (var i = 0, len = this.cache.fenParts['pieces'].length; i < len; i++) {
			var token = this.cache.fenParts['pieces'].substr(i, 1);

			if (Board0x88Config.fenPieces[token]) {
				index = Board0x88Config.mapping[squares[pos]];
				type = Board0x88Config.pieces[token];
				piece = {
					t:type,
					s:index
				};
				// Board array
				this.cache['board'][index] = type;

				// White and black array
				this.cache[Board0x88Config.colorMapping[token]].push(piece);

				// King array
				if (Board0x88Config.typeMapping[type] == 'k') {
					this.cache['k' + ((piece.t & 0x8) > 0 ? 'black' : 'white')] = piece;
				}
				pos++;
			} else if (i < len - 1 && Board0x88Config.numbers[token]) {
				var token2 = this.cache.fenParts['pieces'].substr(i + 1, 1);
				if (!isNaN(token2)) {
					token = [token, token2].join('');
				}
				pos += parseInt(token);
			}
		}

	},

	/**
	 * Return all pieces on board
	 * @method getPieces
	 * @return {Array} pieces
	 */
	getPieces:function () {
		return this.cache['white'].append(this.cache['black']);
	},

	/**
	 Return king of a color
	 @method getKing
	 @param color
	 @return {Object} king
	 @example
		var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
		console.log(parser.getKing('white'));
	 returns an object containing the properties s for square and t for type.
	 both are numeric according to the 0x88 board.
	 */
	getKing:function (color) {
		return this.cache['k' + color];
	},

	/**
	 Returns pieces of a color
	 @method getPiecesOfAColor
	 @param color
	 @return {Array}
	 @example
	 	var parser = new chess.parser.FenParser0x88('5k2/8/8/3pP3/8/8/8/7K w - d6 0 1');
	 	var pieces = parser.getPiecesOfAColor('white');
	 	console.log(pieces);
	 each piece is represented by an object like this:
	 @example
	 	{
	 		s : 112,
	 		t : 14
	 	}
	 where s is square and type is type. s is numeric according to the 0x88 chess board where
	 a1 is 0, a2 is 16, b2 is 17, a3 is 32, i.e. a 128x64 square board.

	 t is a numeric representation(4 bits).
	 @example
		 P : 0001
		 N : 0010
		 K : 0011
		 B : 0101
		 R : 0110
		 Q : 0111
		 p : 1001
		 n : 1010
		 k : 1011
		 b : 1101
		 r : 1100
		 q : 1100

	 As you can see, black pieces all have the first bit set to 1, and all the sliding pieces
	 (bishop, rook and queen) has the second bit set to 1. This makes it easy to to determine color
	 and sliding pieces using the bitwise & operator.
	 */
	getPiecesOfAColor:function (color) {
		return this.cache[color]
	},

	/**
	 @method getEnPassantSquare
	 @return {String|null}
	 @example
	 	var fen = '5k2/8/8/3pP3/8/8/8/7K w - d6 0 1';
	 	var parser = new chess.parser.FenParser0x88(fen);
	 	alert(parser.getEnPassantSquare()); // alerts 'd6'
	 */
	getEnPassantSquare:function () {
		var enPassant = this.cache.fenParts['enPassant'];
		if (enPassant != '-') {
			return enPassant;
		}
		return undefined;
	},
	setEnPassantSquare:function (square) {
		this.cache.fenParts['enPassant'] = square;
	},

	getSlidingPieces:function (color) {
		return this.cache[color + 'Sliding'];
	},

	getHalfMoves:function () {
		return this.cache.fenParts['halfMoves'];
	},

	getFullMoves:function () {
		return this.cache.fenParts['fullMoves'];
	},

	canCastleKingSide:function (color) {
		var code = color === 'white' ? Board0x88Config.castle['K'] : Board0x88Config.castle['k'];
		return this.cache.fenParts.castleCode & code;
	},

	canCastleQueenSide:function (color) {
		var code = color === 'white' ? Board0x88Config.castle['Q'] : Board0x88Config.castle['q'];
		return this.cache.fenParts.castleCode & code;
	},

	getColor:function () {
		return Board0x88Config.colorAbbreviations[this.cache.fenParts['color']];
	},

	getColorCode:function () {
		return this.cache.fenParts['color'];
	},

	/**
	 Return information about piece on square in human readable format
	 @method getPieceOnSquare
	 @param {Number} square
	 @return {Object}
	 @example
	 	var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	 	var parser = new chess.parser.FenParser0x88(fen);
	 	console.log(parser.getPieceOnSquare(Board0x88Config.mapping['e2']));
	 will return an object like this:
	 @example
	 	{
	 		"square": "e2",
	 		"type": 'p',
	 		"color": "white",
	 		"sliding": 0
	 	}
	 */
	getPieceOnSquare:function (square) {
		var piece = this.cache['board'][square];
		if (piece) {
			return {
				square:Board0x88Config.numberToSquareMapping[square],
				type:Board0x88Config.typeMapping[piece],
				color:(piece & 0x8) > 0 ? 'black' : 'white',
				sliding:(piece & 0x4) > 0
			}
		}
		return undefined;
	},

	getPieceTypeOnSquare:function (square) {
		return this.cache['board'][square];
	},
	/**
	 * Returns true if two squares are on the same rank. Squares are in the 0x88 format, i.e.
	 * a1=0,a2=16. You can use Board0x88Config.mapping to get a more readable code.
	 @method isOnSameRank
	 @param {Number} square1
	 @param {Number} square2
	 @return {Boolean}
	 @example
	 	var parser = new chess.parser.FenParser0x88();
	 	console.log(parser.isOnSameSquare(0,16)); // a1 and a2 -> false
	 	console.log(parser.isOnSameSquare(0,1)); // a1 and b1 -> true
	 */
	isOnSameRank:function (square1, square2) {
		return (square1 & 240) === (square2 & 240);
	},

	/**
	 * Returns rank 0-7 where 0 is first rank and 7 is last rank
	 * @function rank
	 * @param {Number|String} square
	 * @returns {number}
     */
	rank:function(square){
		if(square.substr != undefined){
			square = Board0x88Config.mapping[square];
		}
		return (square & 240) / 16;
	},

	/**
	 * Returns true if two squares are on the same file. Squares are in the 0x88 format, i.e.
	 * a1=0,a2=16. You can use Board0x88Config.mapping to get a more readable code.
	 @method isOnSameFile
	 @param {Number} square1
	 @param {Number} square2
	 @return {Boolean}
	 @example
	 	var parser = new chess.parser.FenParser0x88();
	 	console.log(parser.isOnSameFile(0,16)); // a1 and a2 -> true
	 	console.log(parser.isOnSameFile(0,1)); // a1 and b1 -> false
	 */
	isOnSameFile:function (square1, square2) {
		return (square1 & 15) === (square2 & 15);
	},

	secondParser:undefined,

	isCheckmate:function(fen, move){
		if(this.secondParser == undefined){
			this.secondParser = new chess.parser.FenParser0x88();
		}

		this.secondParser.setFen(fen);
		this.secondParser.move(move);

		var notation = this.secondParser.notation;

		return notation.indexOf('#')>0 ? notation:undefined;

	},

	getAllMovesReadable:function(){
		var obj = this.getValidMovesAndResult();
		var moves = obj.moves;
		var ret = [];
		var promoteTo = ['R','N', 'B', 'Q'];
		jQuery.each(moves, function(from, toSquares){
			var fs = Board0x88Config.numberToSquareMapping[from];
			jQuery.each(toSquares, function(i, toSquare){
				var addPromotion = false;
				var rank = this.rank(toSquare);
				if(rank == 0 || rank == 7){
					var p = this.getPieceOnSquare(from);
					if(p.type == 'p')addPromotion = true;
				}
				var ts = Board0x88Config.numberToSquareMapping[toSquare];
				if(addPromotion){
					jQuery.each(promoteTo, function(i, promote){
						ret.push({
							from: fs,
							to: ts,
							promoteTo:promote
						})
					});
				}else{
					ret.push({
						from: fs,
						to: ts
					})
				}

			}.bind(this))

		}.bind(this));
		
		return ret;
	},
	
	getAllCheckmateMoves:function(){
		var fen = this.getFen();
		var moves = this.getAllMovesReadable();
		var ret = [];
		jQuery.each(moves, function(i, m){
			var notation = this.getNotationForAMove(m);

			if(this.isCheckmate(fen, m)){
				ret.push(notation + '#');
			}
		}.bind(this));
		return ret;

		/*

		var obj = this.getValidMovesAndResult();
		var moves = obj.moves;
		var fen = this.getFen();
		var promoteTo = ['R','N', 'B', 'Q'];


		var ret = [];
		jQuery.each(moves, function(from, toSquares){
			var fs = Board0x88Config.numberToSquareMapping[from];

			jQuery.each(toSquares, function(i, toSquare){

				var addPromotion = false;
				var rank = this.rank(toSquare);
				if(rank == 0 || rank == 7){
					var p = this.getPieceOnSquare(from);
					if(p.type == 'p')addPromotion = true;
				}

				var m = {
					from:fs, to: Board0x88Config.numberToSquareMapping[toSquare]
				};
				var notation = this.getNotationForAMove(m);
				if(this.isCheckmate(fen, m)){
					ret.push(notation + '#');
				}
			}.bind(this))

		}.bind(this));
		return ret;
		*/

	},

	/**
	 Returns valid moves and results for the position according to the 0x88 chess programming
	 algorithm where position on the board is numeric (A1=0,H1=7,A2=16,H2=23,A3=32,A4=48).
	 First rank is numbered 0-7. Second rank starts at first rank + 16, i.e. A2 = 16. Third
	 rank starts at second rank + 16, i.e. A3 = 32 and so on.
	 @method getValidMovesAndResult
	 @param color
	 @return {Object}
	 @example
	 	 var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	 	 var parser = new chess.parser.FenParser0x88(fen)
	 	 console.log(parser.getValidMovesAndResult());
	 returns an object containing information about number of checks(0,1 or 2 for double check),
	 valid moves and result(0 for undecided, .5 for stalemate, -1 for black win and 1 for white win).
	 moves are returend in the following format:
	 	numeric square : [array of valid squares to move]
	 example for knight on b1:
	 @example
	 	1 : [32,34]
	 since it's located on b1(numeric value 1) and can move to either a3 or c3(32 and 34).
	 */
	getValidMovesAndResult:function (color) {
		color = color || this.getColor();
		var ret = {}, directions;
		var enPassantSquare = this.getEnPassantSquare();
		if (enPassantSquare) {
			enPassantSquare = Board0x88Config.mapping[enPassantSquare];
		}

		var kingSideCastle = this.canCastleKingSide(color);
		var queenSideCastle = this.canCastleQueenSide(color);
		var oppositeColor = color === 'white' ? 'black' : 'white';

		var WHITE = color === 'white';

		var protectiveMoves = this.getCaptureAndProtectiveMoves(oppositeColor);
		var checks = this.getCountChecks(color, protectiveMoves);
		var pinned = [], pieces, validSquares;
		if (checks === 2) {
			pieces = [this.getKing(color)];
		} else {
			pieces = this.cache[color];
			pinned = this.getPinned(color);
			if (checks === 1) {
				validSquares = this.getValidSquaresOnCheck(color);
			}
		}
		var totalCountMoves = 0, a, square;
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			var paths = [];

			switch (piece.t) {
				// pawns
				case 0x01:
					if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
						if (!this.cache['board'][piece.s + 16]) {
							paths.push(piece.s + 16);
							if (piece.s < 32) {
								if (!this.cache['board'][piece.s + 32]) {
									paths.push(piece.s + 32);
								}
							}
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 15)) {
						if (enPassantSquare == piece.s + 15 || (this.cache['board'][piece.s + 15]) && (this.cache['board'][piece.s + 15] & 0x8) > 0) {
							paths.push(piece.s + 15);
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
						if (enPassantSquare == piece.s + 17 || (this.cache['board'][piece.s + 17]) && (this.cache['board'][piece.s + 17] & 0x8) > 0) {
							paths.push(piece.s + 17);
						}
					}
					break;
				case 0x09:
					if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
						if (!this.cache['board'][piece.s - 16]) {
							paths.push(piece.s - 16);
							if (piece.s > 87) {
								if (!this.cache['board'][piece.s - 32]) {
									paths.push(piece.s - 32);
								}
							}
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 15)) {
						if (enPassantSquare == piece.s - 15 || (this.cache['board'][piece.s - 15]) && (this.cache['board'][piece.s - 15] & 0x8) === 0) {
							paths.push(piece.s - 15);
						}
					}
					if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
						if (enPassantSquare == piece.s - 17 || (this.cache['board'][piece.s - 17]) && (this.cache['board'][piece.s - 17] & 0x8) === 0) {
							paths.push(piece.s - 17);
						}
					}

					break;
				// Sliding pieces
				case 0x05:
				case 0x07:
				case 0x06:
				case 0x0D:
				case 0x0E:
				case 0x0F:
					directions = Board0x88Config.movePatterns[piece.t];
					if (pinned[piece.s]) {
						if (directions.indexOf(pinned[piece.s].direction) >= 0) {
							directions = [pinned[piece.s].direction, pinned[piece.s].direction * -1];
						} else {
							directions = [];
						}
					}
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						while ((square & 0x88) === 0) {
							if (this.cache['board'][square]) {
								if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || (!WHITE && (this.cache['board'][square] & 0x8) === 0)) {
									paths.push(square);
								}
								break;
							}
							paths.push(square);
							square += directions[a];
						}
					}
					break;
				// Knight
				case 0x02:
				case 0x0A:
					if (pinned[piece.s]) {
						break;
					}
					directions = Board0x88Config.movePatterns[piece.t];

					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							if (this.cache['board'][square]) {
								if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
									paths.push(square);
								}
							} else {
								paths.push(square);
							}
						}
					}
					break;
				// White king
				// Black king
				case 0X03:
                case 0X0B:
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							if (protectiveMoves.indexOf(square) == -1) {
								if (this.cache['board'][square]) {
									if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
										paths.push(square);
									}
								} else {
									paths.push(square);
								}
							}
						}
					}
					if (kingSideCastle && !this.cache['board'][piece.s + 1] && !this.cache['board'][piece.s + 2] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s + 2) == -1) {
						paths.push(piece.s + 2);
					}
					if (queenSideCastle && !this.cache['board'][piece.s - 1] && !this.cache['board'][piece.s - 2] && !this.cache['board'][piece.s - 3] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s - 1) == -1 && protectiveMoves.indexOf(piece.s - 2) == -1) {
						paths.push(piece.s - 2);
					}
					break;
			}
			if (validSquares && piece.t != 0x03 && piece.t != 0x0B) {
				paths = this.excludeInvalidSquares(paths, validSquares);
			}
			ret[piece.s] = paths;
			totalCountMoves += paths.length;
		}
		var result = 0;
		if (checks && !totalCountMoves) {
			result = color === 'black' ? 1 : -1;
		}
		else if (!checks && !totalCountMoves) {
			result = .5;
		}
		return { moves:ret, result:result, check:checks };
	},

    getMovesAndResultLinear:function(color){
        color = color || this.getColor();
        var directions;
        var enPassantSquare = this.getEnPassantSquare();
        if (enPassantSquare) {
            enPassantSquare = Board0x88Config.mapping[enPassantSquare];
        }

        var kingSideCastle = this.canCastleKingSide(color);
        var queenSideCastle = this.canCastleQueenSide(color);
        var oppositeColor = color === 'white' ? 'black' : 'white';

        var WHITE = color === 'white';

        var protectiveMoves = this.getCaptureAndProtectiveMoves(oppositeColor);
        var checks = this.getCountChecks(color, protectiveMoves);
        var pinned = [], pieces, validSquares;
        if (checks === 2) {
            pieces = [this.getKing(color)];
        } else {
            pieces = this.cache[color];
            pinned = this.getPinned(color);
            if (checks === 1) {
                validSquares = this.getValidSquaresOnCheck(color);
            }
        }
        var a, square;
        var paths = [];

        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];

            switch (piece.t) {
                // pawns
                case 0x01:
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
                        if (!this.cache['board'][piece.s + 16]) {
                            paths.push([piece.s, piece.s + 16]);
                            if (piece.s < 32) {
                                if (!this.cache['board'][piece.s + 32]) {
                                    paths.push([piece.s, piece.s + 32]);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 15)) {
                        if (enPassantSquare == piece.s + 15 || (this.cache['board'][piece.s + 15]) && (this.cache['board'][piece.s + 15] & 0x8) > 0) {
                            paths.push([piece.s, piece.s + 15]);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s + 17)) {
                        if (enPassantSquare == piece.s + 17 || (this.cache['board'][piece.s + 17]) && (this.cache['board'][piece.s + 17] & 0x8) > 0) {
                            paths.push([piece.s, piece.s + 17]);
                    }
                    }
                    break;
                case 0x09:
                    if (!pinned[piece.s] || (pinned[piece.s] && this.isOnSameFile(piece.s, pinned[piece.s].by) )) {
                        if (!this.cache['board'][piece.s - 16]) {
                            paths.push([piece.s, piece.s - 16]);
                            if (piece.s > 87) {
                                if (!this.cache['board'][piece.s - 32]) {
                                    paths.push([piece.s, piece.s - 32]);
                                }
                            }
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 15)) {
                        if (enPassantSquare == piece.s - 15 || (this.cache['board'][piece.s - 15]) && (this.cache['board'][piece.s - 15] & 0x8) === 0) {
                            paths.push([piece.s, piece.s - 15]);
                        }
                    }
                    if (!pinned[piece.s] || (pinned[piece.s] && pinned[piece.s].by === piece.s - 17)) {
                        if (enPassantSquare == piece.s - 17 || (this.cache['board'][piece.s - 17]) && (this.cache['board'][piece.s - 17] & 0x8) === 0) {
                            paths.push([piece.s, piece.s - 17]);
                        }
                    }

                    break;
                // Sliding pieces
                case 0x05:
                case 0x07:
                case 0x06:
                case 0x0D:
                case 0x0E:
                case 0x0F:
                    directions = Board0x88Config.movePatterns[piece.t];
                    if (pinned[piece.s]) {
                        if (directions.indexOf(pinned[piece.s].direction) >= 0) {
                            directions = [pinned[piece.s].direction, pinned[piece.s].direction * -1];
                        } else {
                            directions = [];
                        }
                    }
                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        while ((square & 0x88) === 0) {
                            if (this.cache['board'][square]) {
                                if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || (!WHITE && (this.cache['board'][square] & 0x8) === 0)) {
                                    paths.push([piece.s, square]);
                                }
                                break;
                            }
                            paths.push([piece.s, square]);
                            square += directions[a];
                        }
                    }
                    break;
                // Knight
                case 0x02:
                case 0x0A:
                    if (pinned[piece.s]) {
                        break;
                    }
                    directions = Board0x88Config.movePatterns[piece.t];

                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        if ((square & 0x88) === 0) {
                            if (this.cache['board'][square]) {
                                if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
                                    paths.push([piece.s, square]);
                                }
                            } else {
                                paths.push([piece.s, square]);
                            }
                        }
                    }
                    break;
                // White king
                // Black king
                case 0X03:
                case 0X0B:
                    directions = Board0x88Config.movePatterns[piece.t];
                    for (a = 0; a < directions.length; a++) {
                        square = piece.s + directions[a];
                        if ((square & 0x88) === 0) {
                            if (protectiveMoves.indexOf(square) == -1) {
                                if (this.cache['board'][square]) {
                                    if ((WHITE && (this.cache['board'][square] & 0x8) > 0) || ( !WHITE && (this.cache['board'][square] & 0x8) === 0)) {
                                        if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, square]);
                                    }
                                } else {
                                    if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, square]);
                                }
                            }
                        }
                    }
                    if (kingSideCastle && !this.cache['board'][piece.s + 1] && !this.cache['board'][piece.s + 2] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s + 2) == -1) {
                        if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, piece.s + 2]);
                    }
                    if (queenSideCastle && !this.cache['board'][piece.s - 1] && !this.cache['board'][piece.s - 2] && !this.cache['board'][piece.s - 3] && protectiveMoves.indexOf(piece.s) == -1 && protectiveMoves.indexOf(piece.s - 1) == -1 && protectiveMoves.indexOf(piece.s - 2) == -1) {
                        if(!validSquares || validSquares.indexOf(square) >=0)paths.push([piece.s, piece.s - 2]);
                    }
                    break;
            }
        }
        var result = 0;
        if (checks && !paths.length > 0) {
            result = color === 'black' ? 1 : -1;
        }
        else if (!checks && paths.length === 0) {
            result = .5;
        }
        return { moves:paths, result:result, check:checks };

    },

	excludeInvalidSquares:function (squares, validSquares) {
		var ret = [];
		for (var i = 0; i < squares.length; i++) {
			if (validSquares.indexOf(squares[i]) >= 0) {
				ret.push(squares[i]);
			}
		}
		return ret;
	},

	/* This method returns a comma separated string of moves since it's faster to work with than arrays*/
	getCaptureAndProtectiveMoves:function (color) {
		var ret = [], directions, square, a;

		var pieces = this.cache[color];
		var oppositeKingSquare = this.getKing(color === 'white' ? 'black' : 'white').s;

		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			switch (piece.t) {
				// pawns
				case 0x01:
					if (((piece.s + 15) & 0x88) === 0) ret.push(piece.s + 15);
					if (((piece.s + 17) & 0x88) === 0) ret.push(piece.s + 17);
					break;
				case 0x09:
					if (((piece.s - 15) & 0x88) === 0) ret.push(piece.s - 15);
					if (((piece.s - 17) & 0x88) === 0) ret.push(piece.s - 17);
					break;
				// Sliding pieces
				case 0x05:
				case 0x07:
				case 0x06:
				case 0x0D:
				case 0x0E:
				case 0x0F:
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						while ((square & 0x88) === 0) {
							if (this.cache['board'][square] && square !== oppositeKingSquare) {
								ret.push(square);
								break;
							}
							ret.push(square);
							square += directions[a];
						}
					}
					break;
				// knight
				case 0x02:
				case 0x0A:
					// White knight
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							ret.push(square);
						}
					}
					break;
				// king
				case 0X03:
				case 0X0B:
					directions = Board0x88Config.movePatterns[piece.t];
					for (a = 0; a < directions.length; a++) {
						square = piece.s + directions[a];
						if ((square & 0x88) === 0) {
							ret.push(square);
						}
					}
					break;
			}

		}
        return ret;
	},

	/**
	 Returns array of sliding pieces attacking king
	 @method getSlidingPiecesAttackingKing
	 @param {String} color
	 @return {Array}
	 @example
	 	fen = '6k1/Q5n1/4p3/8/8/8/B7/5KR1 b - - 0 1';
		parser = new chess.parser.FenParser0x88(fen);
	 	pieces = parser.getSlidingPiecesAttackingKing('white');
	 	console.log(pieces);
	 will return
	 @example
	 	[ { "s" : 16, "p": 17 }, { "s": 6, "p": 16 }]
	 where "s" is the 0x88 board position of the piece and "p" is the sliding path to the king
	 of opposite color. A bishop on a1 and a king on h8 will return { "s": "0", "p": 17 }
	 This method returns pieces even when the sliding piece is not checking king.
	 */
	getSlidingPiecesAttackingKing:function (color) {
		var ret = [];
		var king = this.cache['k' + (color === 'white' ? 'black' : 'white')];
		var pieces = this.cache[color];
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			if ((piece.t & 0x4) > 0) {
				var numericDistance = king.s - piece.s;
				var boardDistance = (king.s - piece.s) / this.getDistance(king.s, piece.s);

				switch (piece.t) {
					// Bishop
					case 0x05:
					case 0x0D:
						if (numericDistance % 15 === 0 || numericDistance % 17 === 0) {
							ret.push({ s:piece.s, direction:boardDistance});
						}
						break;
					// Rook
					case 0x06:
					case 0x0E:
						if (numericDistance % 16 === 0) {
							ret.push({ s:piece.s, direction:boardDistance});
						}
						// Rook on same rank as king
						else if (this.isOnSameRank(piece.s, king.s)) {
							ret.push({ s:piece.s, direction:numericDistance > 0 ? 1 : -1})
						}
						break;
					// Queen
					case 0x07:
					case 0x0F:
						if (numericDistance % 15 === 0 || numericDistance % 17 === 0 || numericDistance % 16 === 0) {
							ret.push({ s:piece.s, direction:boardDistance});
						}
						else if (this.isOnSameRank(piece.s, king.s)) {
							ret.push({ s:piece.s, direction:numericDistance > 0 ? 1 : -1})
						}
						break;
				}
			}
		}
		return ret;
	},

	/**
	 Return array of the squares where pieces are pinned, i.e. cannot move.
	 Squares are in the 0x88 format. You can use Board0x88Config.numberToSquareMapping
	 to translate to readable format, example: Board0x88Config.numberToSquareMapping[16] will give you 'a2'
	 @method getPinned
	 @param {String} color
	 @return {Object}
	 @example
	 	var fen = '6k1/Q5n1/4p3/8/8/1B6/B7/5KR1 b - - 0 1';
		var parser = new chess.parser.FenParser0x88(fen);
	 	var pinned = parser.getPinned('black');
	 	console.log(pinned);
	 will output
	 @example
 		{
	 		84: { "by": 33, "direction": 17 }, // pawn on e6(84) is pinned by bishop on b3(33).
	 		102 : { "by": "6", "direction": 16 } // knight on g7 is pinned by rook on g1
	 	}
	 direction is the path to king which can be
	 @example
	 	15   16   17
	 	-1         1
	 	17  -16  -15
	 i.e. 1 to the right, -1 to the left, 17 for higher rank and file etc.
	 */
	getPinned:function (color) {
		var ret = {};
		var pieces = this.getSlidingPiecesAttackingKing((color === 'white' ? 'black' : 'white'));
		var WHITE = color === 'white';
		var king = this.cache['k' + color];
		var i = 0;
		while (i < pieces.length) {
			var piece = pieces[i];
			var square = piece.s + piece.direction;
			var countPieces = 0;

			var pinning = '';
			while (square !== king.s && countPieces < 2) {
				if (this.cache['board'][square]) {
					countPieces++;
					if ((!WHITE && (this.cache['board'][square] & 0x8) > 0) || (WHITE && (this.cache['board'][square] & 0x8) === 0)) {
						pinning = square;
					} else {
						break;
					}
				}
				square += piece.direction;
			}
			if (countPieces === 1) {
				ret[pinning] = { 'by':piece.s, 'direction':piece.direction };
			}
			i++;
		}
		if (ret.length === 0) {
			return null;
		}
		return ret;
	},

	getValidSquaresOnCheck:function (color) {
		var ret = [], checks;
		var king = this.cache['k' + color];
		var pieces = this.cache[color === 'white' ? 'black' : 'white'];


		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];

			switch (piece.t) {
				case 0x01:
					if (king.s === piece.s + 15 || king.s === piece.s + 17) {
						return [piece.s];
					}
					break;
				case 0x09:
					if (king.s === piece.s - 15 || king.s === piece.s - 17) {
						return [piece.s];
					}
					break;
				// knight
				case 0x02:
				case 0x0A:
					if (this.getDistance(piece.s, king.s) === 2) {
						var directions = Board0x88Config.movePatterns[piece.t];
						for (var a = 0; a < directions.length; a++) {
							var square = piece.s + directions[a];
							if (square === king.s) {
								return [piece.s];
							}
						}
					}
					break;
				// Bishop
				case 0x05:
				case 0x0D:
					checks = this.getBishopCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					break;
				// Rook
				case 0x06:
				case 0x0E:
					checks = this.getRookCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					break;
				case 0x07:
				case 0x0F:
					checks = this.getRookCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					checks = this.getBishopCheckPath(piece, king);
					if (checks) {
						return checks;
					}
					break;
			}
		}
		return ret;
	},

	getBishopCheckPath:function (piece, king) {
		if ((king.s - piece.s) % 15 === 0 || (king.s - piece.s) % 17 === 0) {
			var direction = (king.s - piece.s) / this.getDistance(piece.s, king.s);
			var square = piece.s + direction;
			var pieceFound = false;
			var squares = [piece.s];
			while (square !== king.s && !pieceFound) {
				squares.push(square);
				if (this.cache['board'][square]) {
					pieceFound = true;
				}
				square += direction;
			}
			if (!pieceFound) {
				return squares;
			}
		}
		return null;
	},

	getRookCheckPath:function (piece, king) {
		var direction = null;
		if (this.isOnSameFile(piece.s, king.s)) {
			direction = (king.s - piece.s) / this.getDistance(piece.s, king.s);
		} else if (this.isOnSameRank(piece.s, king.s)) {
			direction = king.s > piece.s ? 1 : -1;
		}
		if (direction) {
			var square = piece.s + direction;
			var pieceFound = false;
			var squares = [piece.s];
			while (square !== king.s && !pieceFound) {
				squares.push(square);
				if (this.cache['board'][square]) {
					pieceFound = true;
				}
				square += direction;
			}
			if (!pieceFound) {
				return squares;
			}
		}
		return undefined;
	},


	getCountChecks:function (kingColor, moves) {
		var king = this.cache['k' + kingColor];
        var index = moves.indexOf(king.s);
		if (index >= 0) {
			if (moves.indexOf(king.s, index+1 ) >= 0) {
				return 2;
			}
			return 1;
		}
		return 0;
	},

	/**
	 * Returns distance between two sqaures
	 * @method getDistance
	 * @param {Number} sq1
	 * @param {Number} sq2
	 * @return {Number} distance
	 */
	getDistance:function (sq1, sq2) {
		return Board0x88Config.distances[sq2 - sq1 + (sq2 | 7) - (sq1 | 7) + 240];
	},


	getPiecesInvolvedInMove:function (move) {
		var ret = [
			{ from:move.from, to:move.to }
		];
		var square;
		move = {
			from:Board0x88Config.mapping[move.from],
			to:Board0x88Config.mapping[move.to],
			promoteTo:move.promoteTo
		};

		var color = (this.cache['board'][move.from] & 0x8) ? 'black' : 'white';

		if (this.isEnPassantMove(move.from, move.to)) {
			if (color == 'black') {
				square = move.to + 16;

			} else {
				square = move.to - 16;
			}
			ret.push({ capture:Board0x88Config.numberToSquareMapping[square]})
		}

		if (this.isCastleMove(move)) {
			if ((move.from & 15) < (move.to & 15)) {
				ret.push({
					from:'h' + (color == 'white' ? 1 : 8),
					to:'f' + (color == 'white' ? 1 : 8)
				});
			} else {
				ret.push({
					from:'a' + (color == 'white' ? 1 : 8),
					to:'d' + (color == 'white' ? 1 : 8)
				});
			}
		}

		if (move.promoteTo) {
			ret.push({
				promoteTo:move.promoteTo, square:Board0x88Config.numberToSquareMapping[move.to]
			});
		}
		return ret;
	},

	/**
	 Returns true if a move is an "en passant" move. Move is given in this format:
	 @method isEnPassantMove
	 @param {Number} from
	 @param {Number} to
	 @return {Boolean}
	 @example
	 	var move = {
	 		from: Board0x88Config.mapping['e5'],
	 		to: Board0x88Config.mapping['e6']
	 	}
	 console.log(parser.isEnPassantMove(move);

	 Move is an object and requires properties "from" and "to" which is a numeric square(according to a 0x88 board).
	 */
	isEnPassantMove:function (from, to) {
		if ((this.cache['board'][from] === 0x01 || this.cache['board'][from] == 0x09)) {
			if (
				!this.cache['board'][to] &&
					((from - to) % 17 === 0 || (from - to) % 15 === 0)) {
				return true;
			}
		}
		return false;
	},

	/**
	 Returns true if a move is a castle move. This method does not validate if the king is allowed
	 to move to the designated square.
	 @method isCastleMove
	 @param {Object} move
	 @return {Boolean}
	 */
	isCastleMove:function (move) {
		if ((this.cache['board'][move.from] === 0x03 || this.cache['board'][move.from] == 0x0B)) {
			if (this.getDistance(move.from, move.to) === 2) {
				return true;
			}
		}
		return false;
	},

	/**
	 Make a move by notation
	 @method makeMoveByNotation
	 @param {String} notation
	 @return undefined
	 @example
	 	var parser = new chess.parser.FenParser0x88('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	 	parser.makeMoveByNotation('e4');
	 	console.log(parser.getFen());
	 */
	makeMoveByNotation:function (notation) {
		this.makeMoveByObject(this.getFromAndToByNotation(notation));
	},

	/**
	 Make a move by an object
	 @method makeMove
	 @param {Object} move
	 @example
	 	var parser = new chess.parser.FenParser0x88('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	 	parser.makeMove({from:'e2',to:'e4'});
	 	console.log(parser.getFen());
	 */
	makeMoveByObject:function (move) {
        this.makeMove(
            Board0x88Config.mapping[move.from],
            Board0x88Config.mapping[move.to],
            move.promoteTo ? Board0x88Config.typeToNumberMapping[move.promoteTo] : undefined
        );
		this.fen = undefined;
	},



	/**
	 Returns true when last position in the game has occured 2 or more times, i.e. 3 fold
	 repetition.(if 2, it will be 3 fold after the next move, a "claimed" draw).
	 @method hasThreeFoldRepetition
	 @param {Array} fens
	 @return {Boolean}
	 This method is called from the game model where the fen of the last moves is sent.
	 */
	hasThreeFoldRepetition:function (fens) {
		if (!fens || fens.length === 0)return false;
		var shortenedFens = {};
		for (var i = 0; i < fens.length; i++) {
			var fen = this.getTruncatedFenWithColorAndCastle(fens[i]);
			if (shortenedFens[fen] === undefined) {
				shortenedFens[fen] = 0;
			}
			shortenedFens[fen]++;
		}
		var lastFen = this.getTruncatedFenWithColorAndCastle(fens[fens.length - 1]);
		return shortenedFens[lastFen] >= 2;
	},

	getTruncatedFenWithColorAndCastle:function (fen) {
		return fen.split(/\s/g).slice(0, 3).join(' ');
	},

	getPromoteByNotation:function (notation) {
		if (notation.indexOf('=') > 0) {
			var piece = notation.replace(/^.*?=([QRBN]).*$/, '$1');
			return Board0x88Config.pieceAbbr[piece];
		}
		if (notation.match(/[a-h][18][NBRQ]/)) {
			notation = notation.replace(/[^a-h18NBRQ]/g, '');
			return Board0x88Config.pieceAbbr[notation.substr(notation.length - 1, 1)];
		}
		return '';
	},

	getFromAndToByNotation:function (notation) {
		var ret = { promoteTo:this.getPromoteByNotation(notation)};
		var color = this.getColor();
		var offset = 0;
		if (color === 'black') {
			offset = 112;
		}
		var validMoves = this.getValidMovesAndResult().moves;

		var foundPieces = [], offsets, sq, i;
		if (notation === 'OO')notation = 'O-O';
		if (notation === 'OOO')notation = 'O-O-O';
		if (notation.length === 2) {
			var square = Board0x88Config.mapping[notation];
			ret.to = Board0x88Config.mapping[notation];
			var direction = color === 'white' ? -16 : 16;
			if (this.cache['board'][square + direction]) {
				foundPieces.push(square + direction);
			} else {
				foundPieces.push(square + (direction * 2));
			}

		} else {
			var fromRank = this.getFromRankByNotation(notation);
			var fromFile = this.getFromFileByNotation(notation);

			notation = notation.replace(/=[QRBN]/, '');
			notation = notation.replace(/[\+#!\?]/g, '');
			notation = notation.replace(/^(.*?)[QRBN]$/g, '$1');
			var pieceType = this.getPieceTypeByNotation(notation, color);
			var capture = notation.indexOf('x') > 0;
			ret.to = this.getToSquareByNotation(notation);

			switch (pieceType) {
				case 0x01:
				case 0x09:
					if (color === 'black') {
						offsets = capture ? [15, 17]  : [16];
						if (ret.to > 48) {
							offsets.push(32);
						}
					} else {
						offsets = capture ? [-15, -17] : [-16];
						if (ret.to < 64) {
							offsets.push(-32);
						}
					}
					for (i = 0; i < offsets.length; i++) {
						sq = ret.to + offsets[i];
						if (this.cache['board'][sq] && this.cache['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
							foundPieces.push(sq);
						}
					}


					break;
				case 0x03:
				case 0x0B:

					if (notation === 'O-O') {
						foundPieces.push(offset + 4);
						ret.to = offset + 6;
					} else if (notation === 'O-O-O') {
						foundPieces.push(offset + 4);
						ret.to = offset + 2;
					} else {
						foundPieces.push(this.getKing(color).s);
					}
					break;
				case 0x02:
				case 0x0A:
					var pattern = Board0x88Config.movePatterns[pieceType];
					for (i = 0; i < pattern.length; i++) {
						sq = ret.to + pattern[i];
						if ((sq & 0x88) === 0) {
							if (this.cache['board'][sq] && this.cache['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
								foundPieces.push(sq);
								if (fromRank === null && fromFile === null) {
									break;
								}
							}
						}
					}

					break;
				// Sliding pieces
				default:
					var patterns = Board0x88Config.movePatterns[pieceType];

					for (i = 0; i < patterns.length; i++) {
						sq = ret.to + patterns[i];
						while ((sq & 0x88) === 0) {
							if (this.cache['board'][sq] && this.cache['board'][sq] === pieceType && validMoves[sq].indexOf(ret.to) >= 0) {
								foundPieces.push(sq);
								if (fromRank === null && fromFile === null) {
									break;
								}
							}
							sq += patterns[i];
						}
					}
					break;
			}
		}

		if (foundPieces.length === 1) {
			ret.from = foundPieces[0];
		} else {

			if (fromRank >= 0 && fromRank !== null) {
				for (i = 0; i < foundPieces.length; i++) {
					if (this.isOnSameRank(foundPieces[i], fromRank)) {
						ret.from = foundPieces[i];
						break;
					}
				}
			}
			else if (fromFile >= 0 && fromFile !== null) {
				for (i = 0; i < foundPieces.length; i++) {
					if (this.isOnSameFile(foundPieces[i], fromFile)) {
						ret.from = foundPieces[i];
						break;
					}
				}
			}
		}
		ret.from = Board0x88Config.numberToSquareMapping[ret.from];
		ret.to = Board0x88Config.numberToSquareMapping[ret.to];

		return ret;
	},
	/**
	 Get from rank by notation, 0 is first rank, 16 is second rank, 32 is third rank etc.
	 @method getFromRankByNotation
	 @param {String} notation
	 @return {Number}
	 */
	getFromRankByNotation:function (notation) {
		notation = notation.replace(/^.+([0-9]).+[0-9].*$/g, '$1');
		if (notation.length > 1) {
			return null;
		}
		return (notation - 1) * 16;
	},

	/**
	 * Get from rank by notation. 0 is first file(a), 1 is second file(b), 2 is third file etc.
	 * @method getFromFileByNotation
	 * @param {String} notation
	 * @return {Number}
	 */
	getFromFileByNotation:function (notation) {
		notation = notation.replace(/^.*([a-h]).*[a-h].*$/g, '$1');
		if (notation.length > 1) {
			return null;
		}
		return Board0x88Config.files[notation];
	},
	/**
	 * Return numeric destination square by notation.
	 * @method getToSquareByNotation
	 * @param {String} notation
	 * @return {Number} square
	 */
	getToSquareByNotation:function (notation) {
		return Board0x88Config.mapping[notation.replace(/.*([a-h][1-8]).*/g, '$1')];
	},

	getPieceTypeByNotation:function (notation, color) {
		notation = notation.replace(/=[NBRQ]/, '');
		if (notation === 'O-O-O' || notation === 'O-O') {
			notation = 'K';
		} else {
			notation = notation.replace(/.*?([NRBQK]).*/g, '$1');
			if (!notation || notation.length > 1) {
				notation = 'P';
			}
		}

		notation = Board0x88Config.pieces[notation];
		if (color === 'black') {
			notation += 8;
		}

		return notation;
	},
	
	move:function (move) {
		if (ludo.util.isString(move)) {
			move = this.getFromAndToByNotation(move);
		}
		if (!move.promoteTo && move.m && move.m.indexOf('=') >= 0) {
			move.promoteTo = this.getPromoteByNotation(move.m);
		}

		this.fen = undefined;
		this.piecesInvolved = this.getPiecesInvolvedInMove(move);
		this.notation = this.getNotationForAMove(move);
		this.longNotation = this.getLongNotationForAMove(move, this.notation);

        this.makeMove(
            Board0x88Config.mapping[move.from],
            Board0x88Config.mapping[move.to],
            move.promoteTo ? Board0x88Config.typeToNumberMapping[move.promoteTo] : undefined
        );

		var config = this.getValidMovesAndResult();

		if (config.result === 1 || config.result === -1) {
			this.notation += '#';
			this.longNotation += '#';
		} else {
			if (config.check) {
				this.notation += '+';
				this.longNotation += '+';
			}
		}
	},

	setNewColor:function () {
		this.cache.fenParts['color'] = (this.cache.fenParts['color'] == 'w') ? 'b' : 'w';

	},

	getCastle:function () {
		return Board0x88Config.castleMapping[this.cache.fenParts['castleCode']];
	},

    historyCurrentMove:[],

    getCopyOfColoredPieces:function(color){
        var ret = [];
        for(var i=0;i<this.cache[color].length;i++){
            ret.push({ s : this.cache[color][i].s, t: this.cache[color][i].t });
        }
        return ret;
        /*
        var ret = this.cache[color].concat(0);
        ret.pop();
        return ret;*/
    },


    /**
     * Used on comp eval. Valid from and to is assumed
     * @param {Number} from
     * @param {Number} to
     * @param {String} promoteTo
     */
    makeMove:function(from, to, promoteTo){
        this.historyCurrentMove = [
            { key : "white", value : this.getCopyOfColoredPieces('white')},
            { key : "black", value : this.getCopyOfColoredPieces('black')},
            { key : "castle", value:  this.cache.fenParts['castleCode'] },
            { key : "halfMoves", value: this.getHalfMoves() },
            { key : "fullMoves", value: this.getFullMoves() },
            { key : "color", value: this.cache.fenParts['color'] },
            { key : "enPassant", value : this.cache.fenParts['enPassant'] }
        ];

        if (!this.cache['board'][to] && (this.cache['board'][from] !== 0x01 && this.cache['board'][from]!== 0x09)) {
            this.incrementHalfMoves();
        }else{
            this.resetHalfMoves();
        }

        var enPassant = '-';

        switch(this.cache['board'][from]){
            case 0x03:
            case 0x0B:
                var rook,offset;
                this.disableCastle(from);

                this.cache['k' + Board0x88Config.numberToColorMapping[this.cache['board'][from]]].s = to;
                if(this.getDistance(from,to) > 1){
                    if (this.cache['board'][from] === 0x03) {
                        rook = 0x06;
                        offset = 0;
                    } else {
                        rook = 0x0E;
                        offset = 112;
                    }
                    if (from < to) {
                        this.updatePiece(7 + offset, 5 + offset);
                        this.movePiece(7 + offset, 5 + offset);
                    } else {
                        this.updatePiece(0 + offset, 3 + offset);
                        this.movePiece(0 + offset, 3 + offset);
                    }
        }
                break;
            case 0x01:
            case 0x09:
                if (this.isEnPassantMove(from, to)) {
                    if (Board0x88Config.numberToColorMapping[this.cache['board'][from]] == 'black') {
                        this.deletePiece(to+16);
                        this.cache['board'][to + 16] = undefined;
                    } else {
                        this.deletePiece(to-16);
                        this.cache['board'][to - 16] = undefined;
                    }
                }

                if(this.getDistance(from,to) > 1 && (this.cache['board'][to-1] || this.cache['board'][to+1])){
                    enPassant = to > from ? from + 16 : from - 16;
                    enPassant = Board0x88Config.numberToSquareMapping[enPassant];
                }

                if(promoteTo){
                    if(this.cache['board'][from] > 0x08){
                        promoteTo += 8;
                    }
                    this.updatePieceType(from, promoteTo);
                }
                break;
            case 0x06:
                if(from === 0)this.disableCastleCode(Board0x88Config.castle['Q']);
                if(from === 7)this.disableCastleCode(Board0x88Config.castle['K']);
                break;
            case 0x0E:
                if(from === Board0x88Config.mapping['a8'])this.disableCastleCode(Board0x88Config.castle['q']);
                if(from === Board0x88Config.mapping['h8'])this.disableCastleCode(Board0x88Config.castle['k']);
                break;
        }

        this.setEnPassantSquare(enPassant);

        this.updatePiece(from, to);

        if(this.cache['board'][to]){
            this.deletePiece(to);
            this.historyCurrentMove.push({
                key : 'addToBoard', square : to, type : this.cache['board'][to]
            })
        }
        this.movePiece(from, to);
        if(promoteTo)this.cache['board'][to] = promoteTo;

        if(this.cache.fenParts['color'] === 'b')this.incrementFullMoves();
        this.setNewColor();
        this.madeMoves.push(this.historyCurrentMove);
    },

    movePiece:function(from, to){
        this.historyCurrentMove.push({
            key : 'addToBoard', square : from, type: this.cache['board'][from]
        });
        this.historyCurrentMove.push({
            key : 'removeFromBoard', square : to
        });
        this.cache['board'][to] = this.cache['board'][from];
        delete this.cache['board'][from];
    },

    unmakeMove:function(){
        var changes = this.madeMoves.pop();

        for(var i=changes.length-1;i>=0;i--){
            var item = changes[i];
            switch(item.key){
                case 'white':
                    this.cache['white'] = item.value;
                    break;
                case 'black':
                    this.cache['black'] = item.value;
                    break;
                case 'color':
                    this.cache.fenParts['color'] = item.value;
                    break;
                case 'castle':
                    this.cache.fenParts['castleCode'] = item.value;
                    break;
                case 'halfMoves':
                    this.cache.fenParts['halfMoves'] = item.value;
                    break;
                case 'fullMoves':
                    this.cache.fenParts['fullMoves'] = item.value;
                    break;
                case 'enPassant':
                    this.cache.fenParts['enPassant'] = item.value;
                    break;
                case 'addToBoard':
                    this.cache['board'][item.square] = item.type;
                    break;
                case 'removeFromBoard':
                    this.cache['board'][item.square] = undefined;
                    break;

            }
        }
    },

	isValid:function(move){
		var moves = this.getValidMovesAndResult().moves;
		return moves[Board0x88Config.mapping[move.from]] != undefined &&
			moves[Board0x88Config.mapping[move.from]].indexOf(Board0x88Config.mapping[move.to]) >= 0;
	},

    updatePiece:function(from, to){
        var color = Board0x88Config.numberToColorMapping[this.cache['board'][from]];
        for(var i=0;i<this.cache[color].length;i++){
            if(this.cache[color][i].s === from){
                this.cache[color][i] = { s: to, t: this.cache[color][i].t };
                return;
            }
        }
    },

    updatePieceType:function(square, type){
        var color = Board0x88Config.numberToColorMapping[this.cache['board'][square]];
        for(var i=0;i<this.cache[color].length;i++){
            if(this.cache[color][i].s === square){
                this.cache[color][i] = { s: this.cache[color][i].s, t : type };
                return;
            }
        }
    },

    deletePiece:function(square){
        var color = Board0x88Config.numberToColorMapping[this.cache['board'][square]];
        for(var i=0;i<this.cache[color].length;i++){
            if(this.cache[color][i].s === square){
                this.cache[color].splice(i,1);
                return;
            }
        }
    },

    disableCastle:function(from){
        var codes = this.cache['board'][from] < 9 ? [4,8] : [1,2];
        this.disableCastleCode(codes[0]);
        this.disableCastleCode(codes[1]);
    },

    disableCastleCode:function(code){
        if((this.cache.fenParts['castleCode'] & code) > 0) this.cache.fenParts['castleCode'] -= code;
    },

	incrementFullMoves:function () {
		this.cache.fenParts['fullMoves']++;
	},
	incrementHalfMoves:function () {
		this.cache.fenParts['halfMoves']++;
	},
	resetHalfMoves:function () {
		this.cache.fenParts['halfMoves'] = 0;
	},

	getPiecesInvolvedInLastMove:function () {
		return this.piecesInvolved;
	},

	getNotation:function () {
		return this.notation;
	},
	getLongNotation:function () {
		return this.longNotation;
	},
	/**
	 * Return current fen position
	 * @method getFen
	 * @return {String} fen
	 */
	getFen:function () {
		if (!this.fen) {
			this.fen = this.getNewFen();
		}
		return this.fen;
	},

	/**
	 * Return long notation for a move
	 * @method getLongNotationForAMove
	 * @param {Object} move
	 * @param {String} shortNotation
	 * @return {String} long notation
	 */
	getLongNotationForAMove:function (move, shortNotation) {
		if(!shortNotation){
			console.trace();
			console.log(this.getFen(), move);
		}
		if (shortNotation.indexOf('O-') >= 0) {
			return shortNotation;
		}
		var fromSquare = move.from;
		var toSquare = move.to;


		var type = this.cache['board'][Board0x88Config.mapping[move.from]];
		type = Board0x88Config.typeMapping[type];
		var separator = shortNotation.indexOf('x') >= 0 ? 'x' : '-';

		var ret = chess.language.pieces[type] + fromSquare + separator + toSquare;

		if (move.promoteTo) {
			ret += '=' + chess.language.pieces[move.promoteTo];
		}
		return ret;
	},

	/**
	 Return short notation for a move
	 @method getNotationForAMove
	 @param {Object} move
	 @return {String}
	 @example
	 	alert(parser.getNotationForAMove({from:'g1',to:'f3'});
	 */
	getNotationForAMove:function (move) {
		move = {
			from:Board0x88Config.mapping[move.from],
			to:Board0x88Config.mapping[move.to],
			promoteTo:move.promoteTo
		};

		var type = this.cache['board'][move.from];

		var ret = chess.language.pieces[Board0x88Config.typeMapping[this.cache['board'][move.from]]];

		switch (type) {
			case 0x01:
			case 0x09:
				if (this.isEnPassantMove(move.from, move.to) || this.cache['board'][move.to]) {
					ret += Board0x88Config.fileMapping[move.from & 15] + 'x';
				}
				ret += Board0x88Config.fileMapping[move.to & 15] + '' + Board0x88Config.rankMapping[move.to & 240];
				if (move.promoteTo) {
					var pr = chess.language.pieces[move.promoteTo] != undefined ? chess.language.pieces[move.promoteTo] : move.promoteTo;
					ret += '=' + pr;
				}
				break;
			case 0x02:
			case 0x05:
			case 0x06:
			case 0x07:
			case 0x0A:
			case 0x0D:
			case 0x0E:
			case 0x0F:
				var config = this.getValidMovesAndResult();
				for (var square in config.moves) {
					if (square != move.from && this.cache['board'][square] === type) {
						if (config.moves[square].indexOf(move.to) >= 0) {
							if ((square & 15) != (move.from & 15)) {
								ret += Board0x88Config.fileMapping[move.from & 15];
							}
							else if ((square & 240) != (move.from & 240)) {
								ret += Board0x88Config.rankMapping[move.from & 240];
							}
						}
					}
				}
				if (this.cache['board'][move.to]) {
					ret += 'x';
				}
				ret += Board0x88Config.fileMapping[move.to & 15] + '' + Board0x88Config.rankMapping[move.to & 240];
				break;
			case 0x03:
			case 0x0B:
				if (this.isCastleMove(move)) {
					if (move.to > move.from) {
						ret = 'O-O';
					} else {
						ret = 'O-O-O';
					}
				} else {
					if (this.cache['board'][move.to]) {
						ret += 'x';
					}
					ret += Board0x88Config.fileMapping[move.to & 15] + '' + Board0x88Config.rankMapping[move.to & 240];
				}
				break;
		}
		return ret;
	},

	/**
	 * Returns new fen based on current board position
	 * @method getNewFen
	 * @return {String}
	 */
	getNewFen:function () {
		var board = this.cache['board'];
		var fen = '';
		var emptyCounter = 0;

		for (var rank = 7; rank >= 0; rank--) {
			for (var file = 0; file < 8; file++) {
				var index = (rank * 8) + file;
				if (board[Board0x88Config.numericMapping[index]]) {
					if (emptyCounter) {
						fen += emptyCounter;
					}
					fen += Board0x88Config.pieceMapping[board[Board0x88Config.numericMapping[index]]];
					emptyCounter = 0;
				} else {
					emptyCounter++;
				}
			}
			if (rank) {
				if (emptyCounter) {
					fen += emptyCounter;
				}
				fen += '/';
				emptyCounter = 0;
			}
		}

		if (emptyCounter) {
			fen += emptyCounter;
		}

		return [fen, this.getColorCode(), this.getCastle(), this.cache.fenParts['enPassant'], this.getHalfMoves(), this.getFullMoves()].join(' ');
	},

    /**
     * Return relative mobility of white compared to white. 0.5 is equal mobility
     * @method getMobility
     * @return {Number}
     */
    getMobility:function(){
        var mw = this.getCountValidMoves('white');
        var mb = this.getCountValidMoves('black');
        return mw / (mw + mb);
    },

    getCountValidMoves:function(color){
        var c = 0;
        var moves = this.getValidMovesAndResult(color).moves;
        for(var key in moves){
            if(moves.hasOwnProperty(key)){
                c+= moves[key].length;
            }
        }
        return c;
    },

    evaluate:function(){
        var res = this.getValidMovesAndResult();
        var score = this.getMaterialScore();
        score += this.getMobility() * 2;
        return score;
    },

    /**
     * Return squares of hanging pieces
     * @method getHangingPieces
     * @param {String} color
     * @return {Array}
    */
    getHangingPieces:function(color){
        var ret = [];
        var m = this.getValidMovesAndResult(color);
        var c = this.getCaptureAndProtectiveMoves(color);
        var king = this.getKing(color);
        for(var key in m.moves){
            if(m.moves.hasOwnProperty(key)){
                if(key != king.s && c.indexOf(parseInt(key)) === -1)ret.push(key);
            }
        }
        return ret;
    },
    /**
     * Return squares of hanging pieces translated from numeric format to board notations, eg. 0 to a1, 1 to b1
     * @method getHangingSquaresTranslated
     * @param {String} color
     * @return {Array}
     */
    getHangingSquaresTranslated:function(color){
        var hanging = this.getHangingPieces(color);
        for(var i=0;i<hanging.length;i++){
            hanging[i] = Board0x88Config.numberToSquareMapping[hanging[i]];
        }
        return hanging;
    },

    getMaterialScore:function(){
        return this.getValueOfPieces('white') - this.getValueOfPieces('black');
    },

    getValueOfPieces:function(color){
        var ret = 0;
        var pieces = this.getPiecesOfAColor(color);
        for(var i=0;i<pieces.length;i++){
            ret += Board0x88Config.pieceValues[pieces[i].t];
        }
        return ret;
    }
});/* ../dhtml-chess/src/parser0x88/move-0x88.js */
/**
 Class for move validation. This class is used by chess.model.Game
 @namespace chess.parser
 @class Move0x88
 @uses chess.parser.FenParser0x88
 @constructor
 @example
 	var validator = new chess.parser.Move0x88();
 	var valid = validator.isValid(
 		{ from : 'h7', to : 'h6' },
 		'r1bq1rk1/ppppbppp/2n2n2/4p3/2B1P3/2N2N1P/PPPP1PP1/R1BQ1RK1 b - 2 6'
 	);
 	if(valid){ alert('Move is valid') } else { alert('Move is invalid') };
 */
chess.parser.Move0x88 = new Class({

    newFen:'',
    originalFen:'',
    removedSquares:[],
	parser:undefined,
    initialize:function () {
        this.parser = new chess.parser.FenParser0x88();
    },

    moveConfig:{
        added:{},
        removed:{}
    },

    /**
     * Returns true if last moves in passed fen's is threefold repetition.
     * @method hasThreeFoldRepetition
     * @param {Array} fens
     * @return {Boolean}
     */
	hasThreeFoldRepetition:function(fens){
		return this.parser.hasThreeFoldRepetition(fens);
	},

	/**
	 * @method getMoveByNotation
	 * @param {String} notation
	 * @param {String} pos
	 * @return {chess.model.Move}
	 */
	getMoveByNotation:function(notation, pos){
		this.parser.setFen(pos);
		return this.parser.getFromAndToByNotation(notation);
	},

	/**
	 * Returns true if a move is valid
	 * @method isValid
	 * @param {Object} move
	 * @param fen
	 * @return {Boolean}
	 */
    isValid:function (move, fen) {
        if (move.fen) {
            return true;
        }
        this.parser.setFen(fen);
        var obj = this.parser.getValidMovesAndResult();

        if (obj.result !== 0) {
            return false;
        }

        var moves = obj.moves[this.getNumSquare(move.from)];

        return moves && moves.indexOf(this.getNumSquare(move.to)) >= 0;

    },

    /**
     * Lookup mapping table and return numeric value of square according the the 0x88 chess board
     * @method getNumSquare
     * @param {String} square
     * @return {Number}
     */
    getNumSquare:function (square) {
        return Board0x88Config.mapping[square];
    },

    /**
     * Return valid Move object
     * @method getMoveConfig
     * @param {Object} move
     * @param {String} fen
     * @return {chess.model.Move}
     * TODO perhaps rename this method
     */
    getMoveConfig:function (move, fen) {
        if(move.m !== undefined && move.m && move.m === '--'){
            var newFen = this.getFenWithColorSwitched(fen);
            this.parser.setFen(newFen);
            return {
                notation : move.m,
                moves : [],
                fen : newFen
            }
        }
        this.parser.setFen(fen);

        var p = this.parser.getPieceOnSquare(Board0x88Config.mapping[move.from]);

        this.parser.move(move);
        
        var n = move.m;
        var grade = "";
        if(/[\!\?]/.test(n)){
            grade = n.replace(/.+?([\?\!]{1,2})/, '$1');
        }

        return {
            fen:move.fen ? move.fen : this.parser.getFen(),
            m: this.parser.getNotation() + grade,
            lm: this.parser.getLongNotation() + grade,
            moves:this.parser.getPiecesInvolvedInLastMove(),
            p: p,
            from:move.from,
            promoteTo : move.promoteTo,
            comment : move.comment,
            clk : move.clk,
            eval : move.eval,
            to:move.to,
            variations:move.variations || []
        };
    },

    /**
     * Return fen with color switched
     * @method getFenWithColorSwitched
     * @param {String} fen
     * @return {String}
     */
    getFenWithColorSwitched : function(fen){
        if(fen.indexOf(' w ')>=0){
            fen = fen.replace(' w ', ' b ');
        }else{
            fen = fen.replace(' b ', ' w ');
        }
        return fen;
    },

	/**
	 * Returns true if a move is promotion move
	 * @method isPromotionMove
	 * @param {Object} move
	 * @param {String} fen
	 * @return {Boolean} valid
	 */
    isPromotionMove:function (move, fen) {
        this.parser.setFen(fen);
        var squareFrom = this.getNumSquare(move.from);
        var squareTo = this.getNumSquare(move.to);

        var color = this.parser.getColor();

        if (color === 'white' && (squareFrom & 240) / 16 == 6 && (squareTo & 240) / 16 == 7) {
            return this.isPawnOnSquare(squareFrom);
        }

        if (color === 'black' && (squareFrom & 240) / 16 == 1 && (squareTo & 240) / 16 == 0) {
            return this.isPawnOnSquare(squareFrom);
        }

        return false;
    },
    /**
     * Returns true if a pawn is on given square
     * @method isPawnOnSquare
     * @param {String} square
     * @return {Boolean}
     */
    isPawnOnSquare : function(square) {
        var piece = this.parser.getPieceOnSquare(square);
        return piece.type === 'p';
    },

    getMobility:function(fen){
        this.parser.setFen(fen);
        return this.parser.getMobility();
    }
});/* ../dhtml-chess/src/parser0x88/position-validator.js */
/**
 * Class used by position setup dialog to validate positions on the board.
 * When the position is valid the "OK" button will be enabled, otherwise it will be disabled.
 * @namespace chess.parser
 * @class PositionValidator
 * @extends chess.parser.FenParser0x88
 */
chess.parser.PositionValidator = new Class({
   Extends : chess.parser.FenParser0x88,

	/**
	 * Returns true if a position is valid.
	 * @method isValid
	 * @param {String} fenPosition
	 * @return {Boolean} valid
	 */
    isValid : function(fenPosition){
		try{
	        this.setFen(fenPosition);
		}catch(e){
			return false;
		}
        if(!this.hasBothKings()){
            return false;
        }
        var oppositeConfig = this.getValidMovesAndResult(this.getOppositeColor());
		return oppositeConfig.check ? false : true;
    },

    getValidMovesAndResult : function(color) {
        if(!this.getKing('white') || !this.getKing('black')){
            return { moves: [], result : 0, check : 0 }
        }
        return this.parent(color);
    },

    hasBothKings : function(){
		return this.getKing('white') && this.getKing('black');
    },

    getOppositeColor : function(){
        return this.getColor() === 'white' ? 'black' : 'white';
    }

});/* ../dhtml-chess/src/controller/controller.js */
/**
  Game controller base class. This class acts as the glue between
  game models and views. When something happens in current game, it sends a message/event to the
  controller. The controller delegates this message to the views and all views interested
  @module Controller
  @namespace chess.controller
  @class Controller
  @constructor
  @param {Object} config
 */
chess.controller.Controller = new Class({
    Extends:ludo.controller.Controller,
    models:[],
    applyTo:undefined,
    currentModel:null,
    modelCacheSize:15,

    views:{},
    disabledEvents:{},
    pgn : undefined,
    debug:false,

    _module:undefined,

    isBusy:false,

    __construct:function (config) {
        this.applyTo = config.applyTo || ['chess', 'user.menuItemNewGame', 'user.saveGame', 'user.menuItemSaveGame'];
        this.parent(config);
        this.__params(config, ['debug', 'pgn', 'theme']);

        if(config.applyTo != undefined){
            this._module = config.applyTo[0];
        }
        this.theme = this.theme || chess.THEME || {};

        this.createDefaultViews();
        this.createDefaultModel();
    },

    createDefaultViews:function () {
        if(chess.view.dialog != undefined){
            this.createView('chess.view.dialog.OverwriteMove');
            this.createView('chess.view.dialog.Promote');
            this.createView('chess.view.dialog.Comment');
        }
    },

    createView:function(type){
        var c = this.theme[type] || {};
        c.type = type;
        if(this._module != undefined)c.module = this._module;
        return ludo.factory.create(c);
    },


    createDefaultModel:function () {
        var model = this.getNewModel();
        this.models[0] = model;
        this.currentModel = model;
        model.newGame();
        model.setClean();
    },

    addView:function (view) {

        // TODO find a better way to relay events from views.
        if (this.views[view.submodule] !== undefined) {
            if(this.debug)ludo.util.log('submodule ' + view.submodule + ' already registered in controller');
            //return false;
        }
        this.views[view.submodule] = view;
        switch (view.submodule) {
            case window.chess.Views.buttonbar.bar:
                view.addEvent('play', this.playMoves.bind(this));
                view.addEvent('start', this.toStart.bind(this));
                view.addEvent('end', this.toEnd.bind(this));
                view.addEvent('previous', this.previousMove.bind(this));
                view.addEvent('next', this.nextMove.bind(this));
                view.addEvent('pause', this.pauseGame.bind(this));
                view.addEvent('flip', this.flipBoard.bind(this));
                break;
            case window.chess.Views.buttonbar.game:
                view.addEvent('play', this.playMoves.bind(this));
                view.addEvent('tostart', this.toStart.bind(this));
                view.addEvent('toend', this.toEnd.bind(this));
                view.addEvent('previous', this.previousMove.bind(this));
                view.addEvent('next', this.nextMove.bind(this));
                view.addEvent('pause', this.pauseGame.bind(this));
                view.addEvent('flip', this.flipBoard.bind(this));
                break;
            case 'list-of-pgn-files':
                view.addEvent('selectPgn', this.selectPgn.bind(this));
                break;
            case 'gameList':
                view.addEvent('selectGame', this.selectGame.bind(this));
                break;
            case 'menuItemSaveGame':
            case 'saveGame':
                view.addEvent('saveGame', function () {
                    this.currentModel.save();
                }.bind(this));
                break;
            case 'dialogNewGame':
                view.addEvent('newGame', function (metadata) {
                    this.currentModel = this.getNewModel({
                        metadata:metadata
                    });
                    this.currentModel.activate();
                }.bind(this));
                break;
            case 'menuItemNewGame':
                view.addEvent('newGame', function () {
					/**
					 * New game dialog event
					 * @event newGameDialog
					 */
                    this.fireEvent('newGameDialog');
                }.bind(this));
                break;
            case 'commandLine':
				view.addEvent('move', this.addMove.bind(this));
				view.addEvent('setPosition', this.setPosition.bind(this));
				view.addEvent('load', this.selectGame.bind(this));
				view.addEvent('flip', this.flipBoard.bind(this));
				view.addEvent('grade', this.gradeCurrentMove.bind(this));
				break;
            case 'board':
                view.addEvent('move', this.addMove.bind(this));
                view.addEvent('animationStart', this.setBusy.bind(this));
                view.addEvent('animationComplete', this.nextAutoPlayMove.bind(this));
                break;
            case 'notation':
                view.addEvent('setCurrentMove', this.setCurrentMove.bind(this));
                view.addEvent('gradeMove', this.gradeMove.bind(this));
                view.addEvent('commentBefore', this.dialogCommentBefore.bind(this));
                view.addEvent('commentAfter', this.dialogCommentAfter.bind(this));
                view.addEvent('deleteMove', this.deleteMoves.bind(this));
                break;
            case 'dialogOverwriteMove':
                view.addEvent('overwriteMove', this.overwriteMove.bind(this));
                view.addEvent('newVariation', this.newVariation.bind(this));
                view.addEvent('cancelOverwrite', this.cancelOverwrite.bind(this));
                break;
            case 'dialogPromote':
                view.addEvent('promote', this.addMove.bind(this));
                break;
            case 'buttonTacticHint':
                view.addEvent('showHint', this.showHint.bind(this));
                break;
            case 'buttonTacticSolution':
                view.addEvent('showSolution', this.showSolution.bind(this));
                break;
            case 'buttonNextGame':
                view.addEvent('nextGame', this.loadNextGame.bind(this));
                break;
            case 'buttonPreviousGame':
                view.addEvent('previousGame', this.loadPreviousGame.bind(this));
                break;
            case 'eco.VariationTree':
                view.addEvent('selectMove', this.addMove.bind(this));
                break;
            case 'positionSetup':
                view.addEvent('setPosition', this.setPosition.bind(this));
                break;
            case 'dialogComment':
                view.addEvent('commentBefore', this.addCommentBefore.bind(this));
                view.addEvent('commentAfter', this.addCommentAfter.bind(this));
                break;
        }
        
        return true;
    },

    deleteMoves:function(move){
        this.currentModel.deleteMove(move);
    },

	/**
	 * Load next game in selected database. This method will only work if you have
	 * a grid with list of games. The only thing this method does is to fire the "nextGame"
	 * event which the list of games grid listens to. The grid will go to next game and fire it's
	 * selectGame event
	 * @method loadNextGame
	 * @return undefined
	 */
    loadNextGame:function () {
		/**
		 * next game event
		 * @event nextGame
		 */
        this.fireEvent('nextGame');
    },

	/**
	 * Load previous game from selected database. For info, see loadNextGame
	 * @method loadPreviousGame
	 * @return undefined
	 */
    loadPreviousGame:function () {
        this.fireEvent('previousGame');
    },

    showHint:function () {
        var nextMove = this.currentModel.getNextMove();
        if (nextMove) {
            this.views.board.showHint(nextMove);
        }
    },

    showSolution:function () {
        var nextMove = this.currentModel.getNextMove();
        if (nextMove) {
            this.views.board.showSolution(nextMove);
        }
    },

    setPosition:function (fen) {
        this.currentModel.setPosition(fen);
    },

    overwriteMove:function (oldMove, newMove) {
        this.currentModel.overwriteMove(oldMove, newMove);
    },

    newVariation:function (oldMove, newMove) {
        this.currentModel.setCurrentMove(oldMove);
        this.currentModel.newVariation(newMove);
    },

    cancelOverwrite:function () {
        this.currentModel.resetPosition();
    },

    setCurrentMove:function (move) {
        this.currentModel.goToMove(move);
    },
	/**
	 * Flip board. The only thing this method does is to fire the flipBoard event.
	 * @method flipBoard
	 * @return undefined
	 */
    flipBoard:function () {
		/**
		 * flip event. A board is example of a view listening to this event. When it's fired, the board
		 * will be flipped
		 * @event flip
		 */
        this.fireEvent('flip');
    },

	/**
	 * Add a move to current model
	 * @method addMove
	 * @param {Object} move
	 * @return undefined
	 */
    addMove:function (move) {
        this.currentModel.appendMove(move);
    },
    gradeMove:function (move, grade) {
        this.currentModel.gradeMove(move, grade);
    },

	gradeCurrentMove:function(grade){
		var move = this.currentModel.getCurrentMove();
		if(move){
			this.currentModel.gradeMove(move, grade);
		}
	},

    dialogCommentBefore:function (move) {
		/**
		 * Event fired when the Comment before a move dialog should be shown.
		 * @event commentBefore
		 * @param {chess.model.Game} currentModel
		 * @param {Object} move
 		 */
        this.fireEvent('commentBefore', [this.currentModel, move]);
    },

    dialogCommentAfter:function (move) {
		/**
		 * Event fired when the Comment after a move dialog should be shown.
		 * @event commentAfter
		 * @param {chess.model.Game} currentModel
		 * @param {Object} move
 		 */
        this.fireEvent('commentAfter', [this.currentModel, move]);
    },
    addCommentBefore:function (comment, move) {
        this.currentModel.setCommentBefore(comment, move);
    },
    addCommentAfter:function (comment, move) {
        this.currentModel.setCommentAfter(comment, move);
    },
	/**
	 * Go to start of current game
	 * @method toStart
	 * @return undefined
	 */
    toStart:function () {
        this.pauseGame();
        if(!this.isBusy)this.currentModel.toStart();
    },
	/**
	 * Go to end of current game
	 * @method toEnd
	 * @return undefined
	 */
    toEnd:function () {
        this.pauseGame();
        if(!this.isBusy)this.currentModel.toEnd();
    },
	/**
	 * Go to previous move
	 * @method previousMove
	 * @return undefined
	 */
    previousMove:function () {
        this.pauseGame();
        if(!this.isBusy)this.currentModel.previousMove();
    },
	/**
	 * Go to next move
	 * @method nextMove
	 * @return undefined
	 */
    nextMove:function () {
        this.pauseGame();
        if(!this.isBusy)this.currentModel.nextMove();
    },
	/**
	 * Start auto play of moves in current game from current position
	 * @method playMoves
	 * @return undefined
	 */
    playMoves:function () {
        if(!this.isBusy)this.currentModel.startAutoPlay();
    },
	/**
	 * Pause auto play of moves
	 * @method pauseGame
	 * @return undefined
	 */
    pauseGame:function () {
        this.currentModel.stopAutoPlay();
    },

    getAnimationDuration:function(){
        return this.views.board.animationDuration;  
    },

    setBusy:function(){
        this.isBusy = true;
    },

    nextAutoPlayMove:function () {
        this.fireModelEvent('animationComplete', this.currentModel, undefined);
        this.currentModel.nextAutoPlayMove();
        this.isBusy = false;
    },

    selectGame:function (game, pgn) {


        var model;
        if (model = this.getModelFromCache(game)) {
            this.currentModel = model;
            this.currentModel.activate();
        } else {
            this.currentModel = this.getNewModel(game, pgn);
        }
    },

    selectPgn:function(pgn){
        this.fireEvent('selectPgn', pgn);
    },

    getModelFromCache:function (game) {
        for (var i = 0; i < this.models.length; i++) {
            if(this.models[i].isModelFor(game)){
                return this.models[i];
            }
        }
        return null;
    },

    getNewModel:function (game, pgn) {
        game = game || {};
		if(pgn)game.pgn = pgn;
        var model = new chess.model.Game(game);

        this.addEventsToModel(model);
        this.models.push(model);

        if (this.models.length > this.modelCacheSize) {
            this.models[0].removeEvents();
            delete this.models[0];

            for (var i = 0; i < this.models.length - 1; i++) {
                this.models[i] = this.models[i + 1];
            }
            this.models.length = this.models.length - 1;
        }
        return model;
    },

    addEventsToModel:function (model) {
        for (var eventName in window.chess.events.game) {
            if(window.chess.events.game.hasOwnProperty(eventName)){
                if (this.disabledEvents[eventName] === undefined) {
                    model.addEvent(window.chess.events.game[eventName], this.fireModelEvent.bind(this));
                }
            }
        }
    },

    fireModelEvent:function (event, model, param) {
        if (model.getId() == this.currentModel.getId()) {
            if(this.debug)ludo.util.log(event);
            this.fireEvent(event, [model, param]);
            this.modelEventFired(event, model, param);
        }
    },

    modelEventFired:function(){

    },

    /**
     * Return active game
     * @method getCurrentModel
     * @return object chess.model.Game
     */
    getCurrentModel:function () {
        return this.currentModel;
    },

    /**
     * Load random game from current database
     * @method loadRandomGame
     * @return void
     */
    loadRandomGame:function () {
        this.currentModel.loadRandomGameFromFile(this.pgn);
    },

    loadWordPressGameById:function(pgn, id){
        this.pgn = pgn;
        this.currentModel.loadWordPressGameById(pgn, id);
    },    
    
    loadWordPressGameByIndex:function(pgn, index){
        this.pgn = pgn;
        this.currentModel.loadWordPressGameById(pgn, index);
    },
    
    loadNextWordPressGame:function(pgn){
        if(arguments.length > 0)this.pgn = pgn;
        this.currentModel.loadNextStaticGame(pgn);
    },
    
    loadGameFromFile:function(index){

        if(this.pgn){
            this.currentModel.loadStaticGame(this.pgn, index);
        }
    },

    loadNextGameFromFile:function(){
        if(this.pgn){
            this.currentModel.loadNextStaticGame(this.pgn);
        }
    }
});/* ../dhtml-chess/src/controller/engine-play-controller.js */
chess.controller.EnginePlayController = new Class({
    Extends:chess.controller.Controller,
    disabledEvents:{
        overwriteOrVariation:1
    },
    dialog : {

    },
    modelEventFired:function (event, model) {
        if (event === 'newMove' || event == 'newGame') {
            var result = model.getResult();
            var colorToMove = model.getColorToMove();
            if(this.shouldAutoPlayNextMove(colorToMove, result)){
                model.getEngineMove();
            }
            if (colorToMove === 'white') {
                this.views.board.enableDragAndDrop(model);
            }
        }
    },

    shouldAutoPlayNextMove : function(colorToMove){
        return colorToMove == 'black'
    }
});/* ../dhtml-chess/src/controller/tactic-controller.js */
/**
 Chess game controller for tactic puzzles, i.e. boards where you make a move
 in a a game and the next move is auto played.
 @namespace chess.controller
 @class TacticController
 @extends chess.controller.Controller
 @constructor
 @param {Object} config
 @example
	 var controller = new chess.controller.TacticController({
		 databaseId:4,
		 alwaysPlayStartingColor:true
	 });
	 controller.loadRandomGame();
 */
chess.controller.TacticController = new Class({
	Extends:chess.controller.Controller,
    /**
     * Delay before playing opponents piece in milliseconds
     * @config autoMoveDelay
     * @type {Number}
     * @default 200
     */
    autoMoveDelay : 200,
	disabledEvents:{
		overwriteOrVariation:1
	},
	dialog:{

	},
	/**
	 * True to always play starting color in game. Otherwise, you will play black
	 * if black is the winning color and white if white is the winning color. If
	 * no winner is registered in the game(result or by calculating final position),
	 * you will play white
	 * @config alwaysPlayStartingColor
	 * @type {Boolean}
	 * @default false
	 */
	alwaysPlayStartingColor:false,
	startingColor:undefined,

	__construct:function (config) {
		this.parent(config);
		this.dialog.puzzleComplete = this.getDialogPuzzleComplete();
		if (config.alwaysPlayStartingColor !== undefined) {
			this.alwaysPlayStartingColor = config.alwaysPlayStartingColor;
		}
        if(config.autoMoveDelay != undefined)this.autoMoveDelay = config.autoMoveDelay;
	},

	getDialogPuzzleComplete:function () {

		var c = {
			autoRemove:false,
			layout:{
				centerIn:this.views.board
			},
			hidden:true,
			listeners:{
				'ok':function () {
					if(this.gameEndHandler != undefined){
						this.gameEndHandler.apply(this, [this]);
					}else{
						this.loadRandomGame();
					}
				}.bind(this)
			}
		};
		
		if(this.theme['chess.view.dialog.PuzzleSolved'] != undefined){
			c = Object.merge(c, this.theme['chess.view.dialog.PuzzleSolved']);
			
		}
		return new chess.view.dialog.PuzzleSolved(c);
	},
	
	addViewFeatures:function () {

	},

	addMove:function (move) {
		this.currentModel.tryNextMove(move);
	},
	modelEventFired:function (event, model) {
		var colorToMove, result;
		if (event === 'newGame') {
			if (this.alwaysPlayStartingColor) {
				colorToMove = this.startingColor = model.getColorToMove();
				if (colorToMove === 'black') {
					this.views.board.flipToBlack();
				} else {
					this.views.board.flipToWhite();
				}
			} else {
				result = model.getResult();
				if (result === -1) {
					this.views.board.flipToBlack();
				} else {
					this.views.board.flipToWhite();
				}
			}

		}
		if (event === 'setPosition' || event === 'nextmove') {
			colorToMove = model.getColorToMove();
			if (this.alwaysPlayStartingColor) {
				if (colorToMove == this.startingColor) {
					this.views.board.enableDragAndDrop(model);
				} else {
					model.nextMove.delay(this.autoMoveDelay, model);
				}

			} else {
				result = model.getResult();
				if (this.shouldAutoPlayNextMove(colorToMove, result)) {
					model.nextMove.delay(this.autoMoveDelay, model);
				}
				if ((result >= 0 && colorToMove === 'white') || (result === -1 && colorToMove == 'black')) {
					this.views.board.enableDragAndDrop(model);
				}
			}
		}
		if (event === 'wrongGuess') {
			model.resetPosition.delay(200, model);
		}
	},

	shouldAutoPlayNextMove:function (colorToMove, result) {
		if (result >= 0 && colorToMove === 'black') {
			return true;
		}
		return (result == -1 && colorToMove == 'white');
	}
});/* ../dhtml-chess/src/controller/tactic-controller-gui.js */
chess.controller.TacticControllerGui = new Class({
    Extends: chess.controller.TacticController,

    /**
     * Function for manual handling of how next game should be loaded.
     * @config gameEndHandler
     * @type {Function}
     * @example
     *      new chess.controller.TacticControllerGui({
     *      pgn:this.pgn,
     *      alwaysPlayStartingColor:true,
     *      autoMoveDelay:400,
     *      gameEndHandler:function(controller){
     *          controller.loadNextGameFromFile();
     *      }
     *  });
     */
    gameEndHandler:undefined,

    __construct:function(config){
        this.parent(config);
        if(config.gameEndHandler != undefined)this.gameEndHandler = config.gameEndHandler;
    },



    modelEventFired:function(event, model){
        this.parent(event, model);

        if (event === 'endOfGame' || event === 'endOfBranch') {
            this.dialog.puzzleComplete.show.delay(300, this.dialog.puzzleComplete);
        }
    }

});/* ../dhtml-chess/src/controller/analysis-controller.js */
/**
 Special controller for analysis boards. It extends chess.controller.Controller but calls the
 enableDragAndDrop method of the board when the events "setPosition", "nextmove" and "newMove" is
 fired by current game model.
 @namespace chess.controller
 @class AnalysisController
 @extends chess.controller.Controller
 @constructor
 @param {Object} config
 @example
 	new chess.controller.AnalysisController();
 */
chess.controller.AnalysisController = new Class({
	Extends:chess.controller.Controller,
	useEngine:false,

	__construct:function(config){
		this.parent(config);
		this.__params(config, ['useEngine']);
	},

	modelEventFired:function (event, model, param) {

		if (event === 'setPosition' || event === 'nextmove' || event == 'newMove') {
			this.views.board.enableDragAndDrop(model);
		}
	}

});/* ../dhtml-chess/src/controller/analysis-engine-controller.js */
chess.controller.AnalysisEngineController = new Class({
    Extends: chess.controller.AnalysisController,

    dialog: {},

    engine: undefined,

    analyzing: true,

    backgroundEngineValid: true,

    allMoves: [],

    chessModel: undefined,

    thinkingTime: 40,

    garboChess:'../garbochess-engine/garbochess.js',

    fen:undefined,

    stopped:true,

    debug:false,
    
    startFen:undefined,

    examine:true,


    __construct: function (config) {
        if(config.garboChess != undefined)this.garboChess = config.garboChess;
        this.__params(config, ['stopped','examine']);
        this.garboChess = config.garboChess;
        if (config.thinkingTime != undefined) {
            this.thinkingTime = config.thinkingTime;
        }

        this.parent(config);
    },

    modelEventFired: function (event, model, param) {




        this.parent(event,model, param);

        this.chessModel = model;

        if (event === 'setPosition' || event === 'nextmove' || event == 'newMove') {
            if(this.examine)this.views.board.enableDragAndDrop(model);
        }

        if (event === 'fen') {

            this.fen = param;


            if (model.getResult() != 0) {
                this.fireEvent("gameover", model.getResult());
                return;
            }


            if(!this.stopped)this.updateEngine();
        }


        if (event == 'newGame') {
            this.ensureAnalysisStopped();

            this.startFen = this.currentModel.model.startFen;
            ResetGame();

            if (this.initializeBackgroundEngine()) {
                this.engine.postMessage("go");

            }
        }
    },

    updateEngine:function(){
        if (this.initializeBackgroundEngine()) {
            this.engine.postMessage("position " + this.getFen());
            this.searchAndRedraw.delay(20, this);

        }
    },

    stopEngine:function(){
        this.stopped = true;
        this.ensureAnalysisStopped();

        //console.log('stop engine');

    },

    startEngine:function(){
     
        this.stopped = false;
        this.updateEngine();

       // console.log('start engine');


    },

    files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],

    getXY: function (square) {
        var move = square
        move = move.replace(/[^a-z0-9]/g, '');
        var file = this.files.indexOf(move.substr(move.length - 2, 1));
        var rank = move.substr(move.length - 1, 1) - 1;
        return {
            x: file,
            y: 7 - rank
        }
    },

    shouldAutoPlayNextMove: function (colorToMove) {
        return colorToMove == 'black'
    },

    ensureAnalysisStopped: function () {
        if (this.analyzing && this.engine != undefined) {
            this.engine.terminate();
            this.engine = undefined;
        }
    },

    initializeBackgroundEngine: function () {

        if (!this.backgroundEngineValid) {
            return false;
        }

        if (this.engine == null) {

            this.backgroundEngineValid = true;
            try {
                var that = this;
                this.engine = new Worker(this.garboChess);
                this.engine.onmessage = function (e) {
                    if (e.data.match("^pv") == "pv") {
                        that.updatePVDisplay(e.data.substr(3, e.data.length - 3));
                    } else if (e.data.match("^message") == "message") {
                        that.ensureAnalysisStopped();
                        that.updatePVDisplay(e.data.substr(8, e.data.length - 8));
                    } else {
                        that.playMove(GetMoveFromString(e.data), null);
                    }
                };
                this.engine.error = function (e) {
                    console.log("Error from background worker:" + e.message);
                };

                this.engine.postMessage("position " + this.getFen());
            } catch (error) {
                this.backgroundEngineValid = false;
                console.log(error);
            }
        }

        return this.backgroundEngineValid;
    },

    getFen: function () {

        return this.fen ? this.fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    },

    color:function(){
        return this.models[0].getColorToMove();  
    },

    updatePVDisplay: function (move) {
        this.fireEvent("engineupdate", [move, this.color()] );
    },

    playMove: function (move, pv) {

        console.log(move);
        var fromX = this.files[(move & 0xF) - 4];
        var fromY = 8 - (((move >> 4) & 0xF) - 2);
        var toX = this.files[((move >> 8) & 0xF) - 4];
        var toY = 8 - (((move >> 12) & 0xF) - 2);

        this.currentModel.appendMove({
            from: fromX + fromY, to: toX + toY
        });

        MakeMove(move);

        this.updateFromMove(move);
    },

    updateFromMove: function (move) {

    },

    finishMove: function (bestmove, value, timeTaken, ply) {
        if (bestMove != null) {
            this.playMove(move, BuildPVMessage(bestMove, value, timeTaken, ply));
        }
    },

    searchAndRedraw: function () {
        if (this.analyzing) {
            this.ensureAnalysisStopped();
            this.initializeBackgroundEngine();

            this.engine.postMessage("position " + this.getFen());
            this.engine.postMessage("analyze");
            return;
        }

        if (this.initializeBackgroundEngine()) {
            this.engine.postMessage("search " + this.thinkingTime);
        } else {
            Search(this.finishMove, 99, null);
        }
    },

    newGame: function () {
        this.currentModel.newGame();
    },

    setThinkingTime:function(thinkingTime){
        this.thinkingTime = thinkingTime;
    }
});/* ../dhtml-chess/src/model/game.js */
/**
 * Chess game model
 * @module Model
 * @namespace chess.model
 * @class Game
 * @uses {chess.parser.Move0x88}
 * @uses {chess.remote.GameReader}
 *
 */
chess.model.Game = new Class({
    Extends: Events,
    /**
     * @attribute {chess.parser.FenParser0x88} moveParser
     */
    moveParser: undefined,
    model: {},
    currentMove: null,
    currentBranch: [],
    moveCache: {},
    defaultFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    gameReader: null,
    dirty: false,

    moveBranchMap: {},
    moveParentMap: {},
    movePreviousMap: {},

    gameIndex: -1,
    countGames: -1,

    INCLUDE_COMMENT_MOVES: true,

    startFen: undefined,

    state: {
        autoplay: false
    },

    /**
     * id of initial game to load from server.
     * @config id
     * @type {Number}
     * @default undefined
     * @optional
     */
    id: undefined,

    initialize: function (config) {
        config = config || {};
        this.moveParser = new chess.parser.Move0x88();
        this.gameReader = new chess.remote.GameReader();
        this.gameReader.addEvent('beforeLoad', this.beforeLoad.bind(this));
        this.gameReader.addEvent('load', this.afterLoad.bind(this));
        this.gameReader.addEvent('load', this.populate.bind(this));
        this.gameReader.addEvent('newMove', this.appendRemoteMove.bind(this));
        this.gameReader.addEvent('saved', this.gameSaved.bind(this));
        this.setDefaultModel();


        if (config.id || config.pgn) {
            if (window.chess.isWordPress && config.pgn) {
                this.loadGame.delay(20, this, [config.id, config.pgn]);
            }
            else if (config.pgn) {
                this.loadStaticGame.delay(20, this, [config.pgn, config.gameIndex]);
            } else {
                this.loadGame.delay(20, this, config.id);
            }
        } else {
            this.setDirty();
        }
        if (config.metadata !== undefined) {
            this.setMetadata(config.metadata);
        }

        if (config.databaseId !== undefined)this.databaseId = config.databaseId;
    },


    beforeLoad: function () {
        this.fire('beforeLoad');
    },

    afterLoad: function () {
        this.fire('afterLoad');
    },

    /**
     * Returns game id
     * @method getId
     * @return {String}
     */
    getId: function () {
        return this.model.id;
    },

    /**
     * Load a game from server
     * @method loadGame
     * @param {Number} gameId
     */
    loadGame: function (gameId, pgn) {
        this.gameReader.loadGame(gameId, pgn);
    },

    loadWordPressGameById: function (pgn, id) {
        this.gameReader.loadGame(id, pgn);
    },

    loadWordPressGameByIndex: function (pgn, index) {
        this.gameIndex = index;
        this.gameReader.loadStaticGame(pgn, index);
    },

    loadNextWordPressGame: function (pgn) {
        if (this.gameIndex == -1)this.gameIndex = 0; else this.gameIndex++;
        this.gameReader.loadStaticGame(pgn, this.gameIndex);
    },

    loadStaticGame: function (pgn, index) {

        this.gameReader.loadStaticGame(pgn, index);
    },

    loadNextStaticGame: function (pgn) {
        if (this.gameIndex == -1)this.gameIndex = 0; else this.gameIndex++;
        this.gameReader.loadStaticGame(pgn, this.gameIndex);
    },

    getGameIndex: function () {
        return this.gameIndex;
    },

    setGameIndex: function (index) {
        this.gameIndex = index;
    },

    /**
     * Load a random game from selected database
     * @method loadRandomGame
     * @param {Number} databaseId
     */
    loadRandomGame: function (databaseId) {
        this.gameReader.loadRandomGame(databaseId);
    },

    loadRandomGameFromFile: function (pgnFile) {
        this.gameReader.loadRandomGameFromFile(pgnFile);
    },

    getEngineMove: function () {
        var pos = this.getLastPositionInGame();
        this.gameReader.getEngineMove(pos);
    },

    appendRemoteMove: function (move) {
        this.toEnd();
        this.appendMove(move);
    },

    /**
     * Returns true if this model is model for given game object
     * @method isModelFor
     * @param {Object} game
     */
    isModelFor: function (game) {
        if (game.gameIndex)return game.gameIndex === this.model.gameIndex;
        if (game.id)return game.id === this.model.id;
        return false;
    },

    /**
     * Empty model and reset to standard position
     * @method newGame
     */
    newGame: function () {
        this.setPosition(this.defaultFen);
    },
    /**
     * Activate model. This will fire newGame and setPosition events
     * @method activate
     */
    activate: function () {
        /**
         * new game event. Fired when a new model is created or an old model is activated
         * @event newGame
         * @param {String} eventName
         * @param {chess.model.Game} model
         */
        this.fire('newGame');
        /**
         * Fired when current chess position is changed, example by moving to a different move
         * @event setPosition
         * @param {String} eventName
         * @param {chess.model.Game} model
         */
        this.fire('setPosition');
    },

    /**
     * Create new game from given fen position
     * @method setPosition
     * @param {String} fen
     */
    setPosition: function (fen) {
        this.setDefaultModel();
        this.model.metadata.fen = fen;
        /**
         * Fired when there are no moves in the game
         * @event noMoves
         * @param {String} eventName
         * @param {chess.model.Game} model
         */
        this.fire('noMoves');
        this.fire('newGame');
        this.fire('setPosition');
    },

    /**
     * Populate game model by JSON game object. This method will create a new game.
     * @method populate
     * @param {Object} gameData
     * @private
     */
    populate: function (gameData) {

        // this.fire('loadGame', gameData);
        this.setDefaultModel();
        gameData = this.getValidGameData(gameData);


        this.model.id = gameData.id || gameData.metadata.id || this.model.id;
        this.model.gameIndex = gameData.gameIndex || undefined;
        this.model.metadata.fen = gameData.fen || gameData.metadata.fen;
        this.startFen = this.model.metadata.fen;

        this.model.result = this.getResult();
        this.model.moves = gameData.moves || [];
        this.model.metadata = gameData.metadata || {};
        this.databaseId = gameData.databaseId;
        this.currentBranch = this.model.moves;
        this.currentMove = undefined;
        this.registerMoves(this.model.moves, this.model.metadata.fen);
        if (gameData.games != undefined) {
            this.countGames = gameData.games['c'];
            this.gameIndex = gameData.games['i'];
        }
        this.fire('loadGame', gameData);
        this.fire('newGame');
        this.toStart();
    },

    reservedMetadata: ["clk", "event", "site", "date", "round", "white", "black", "result",
        "annotator", "termination", "fen", "plycount", "database_id", "id", "pgn", "pgn_id", "draft_id", "eval"],
    // TODO refactor this to match server
    /**
     * Move metadata into metadata object
     * @method getValidMetadata
     *
     */
    getValidGameData: function (gameData) {
        if (gameData.metadata && jQuery.isArray(gameData.metadata)) {
            gameData.metadata = {};
        }
        gameData.metadata = gameData.metadata || {};
        for (var i = 0; i < this.reservedMetadata.length; i++) {
            var key = this.reservedMetadata[i];
            if (gameData[key] !== undefined) {
                gameData.metadata[key] = gameData[key];
                delete gameData[key];
            }
        }

        return gameData;
    },

    /**
     * Return game data
     * @method getModel
     * @return {Object}
     * @private
     */
    getModel: function () {
        return this.model;
    },

    /**
     * Parse and index moves received from the server, i.e. the populate method
     * @method registerMoves
     * @param {Object} moves
     * @param {String} pos
     * @param {chess.model.Move} parent
     * @optional
     * @private
     */
    registerMoves: function (moves, pos, parent) {
        var move;
        moves = moves || [];
        for (var i = 0; i < moves.length; i++) {
            move = moves[i];
            if (this.isChessMove(move)) {
                move = this.getValidMove(move, pos);
                
                if (move.variations && move.variations.length > 0) {
                    for (var j = 0; j < move.variations.length; j++) {
                        this.registerMoves(move.variations[j], pos, move);
                    }
                }
                pos = move.fen;
            }
            move.uid = 'move-' + String.uniqueID();
            this.moveCache[move.uid] = move;
            move.index = i;
            if (parent) {
                this.registerParentMap(move, parent);
            }
            this.registerBranchMap(move, moves);
            if (i > 0) {
                this.registerPreviousMap(move, moves[i - 1]);
            }
            moves[i] = move;
        }
    },

    /**
     * Store internal reference to previous move
     * @method registerPreviousMap
     * @param {chess.model.Move} move
     * @param {chess.model.Move} previous
     * @private
     */
    registerPreviousMap: function (move, previous) {
        this.movePreviousMap[move.uid] = previous;
    },
    /**
     * Store internal reference to parent move
     * @method registerParentMap
     * @param {chess.model.Move} move
     * @param {chess.model.Move} parent
     * @private
     */
    registerParentMap: function (move, parent) {
        this.moveParentMap[move.uid] = parent;
    },

    /**
     * Store internal link between move and a branch of moves(Main line or variation)
     * @method registerBranchMap
     * @param {chess.model.Move} move
     * @param {Object} branch
     * @private
     */
    registerBranchMap: function (move, branch) {
        this.moveBranchMap[move.uid] = branch;
    },

    /**
     * Return branch/line of current move, i.e. main line or variation
     * @method getBranch
     * @param {chess.model.Move} move
     * @return {Array}
     * @private
     */
    getBranch: function (move) {
        return this.moveBranchMap[move.uid];
    },

    /**
     * Reset model data to default, blank game
     * @method setDefaultModel
     */
    setDefaultModel: function () {
        this.moveCache = {};
        this.model = {
            "id": 'temp-id-' + String.uniqueID(),
            "metadata": {
                fen: this.defaultFen,
                result: '*'
            },
            "moves": []
        };
        this.currentBranch = this.model.moves;
        this.currentMove = undefined;

    },

    fen: function () {
        return this.getCurrentPosition();
    },

    /**
     Update game information
     @method setMetadata
     @param {Object} metadata
     @example
     model.setMetadata({white:'John','black:'Jane'});
     */
    setMetadata: function (metadata) {
        jQuery.each(metadata, function (key, val) {
            this.setMetadataValue(key, val);
        }.bind(this));
    },
    /**
     Update particular info about the game
     @method setMetadataValue
     @param {String} key
     @param {String} value
     @example
     model.setMetadataValue('white','John');
     */
    setMetadataValue: function (key, value) {
        this.model.metadata[key] = value;
        /**
         * Fired when metadata is updated
         * @event updateMetadata
         * @param {String} eventName
         * @param {chess.model.Game} model
         * @param {Object} metadata, example {key:'white','value':'John'}
         */
        this.fire('updateMetadata', {key: key, value: value});

    },

    /**
     Return all game metadata info
     @method getMetadata
     @return {Object}
     @example
     var m = model.getMetadata();
     returns an object like
     @example
     { "white": "Magnus Carlsen", "black": "Levon Aronian", "Result" : "1-0" }
     */
    getMetadata: function () {
        return this.model.metadata;
    },
    /**
     Return a specific metadata key
     @method getMetadataValue
     @param {String} key
     @return {String} value
     @example
     var whitePlayer = model.getMetadataValue('white');
     */
    getMetadataValue: function (key) {
        return this.model.metadata[key];
    },

    /**
     * Return array of moves in game
     * @method getMoves
     * @return {Array}
     */
    getMoves: function () {
        return this.model.moves || [];
    },

    /**
     * Return start position of game
     * @method getStartPosition
     * @return {String} position
     */
    getStartPosition: function () {
        return this.model.metadata.fen;
    },

    /**
     * Try to guess next move in a game
     @method tryNextMove
     @param {Object} move
     @return {Boolean} correctMove
     @example
     var correctMove = model.tryNextMove({
	 		from:'e7',
	 		to:'e8',
	 		promoteTo:'q'
	 	});
     */
    tryNextMove: function (move) {
        var pos = this.getCurrentPosition();
        if (!move.promoteTo && this.moveParser.isPromotionMove(move, pos)) {
            this.fire('verifyPromotion', move);
            return true;
        }
        var nextMoves = this.getAllNextMoves(this.currentMove);


        for (var i = 0; i < nextMoves.length; i++) {
            if (this.isCorrectGuess(move, nextMoves[i])) {
                if (nextMoves[i].promoteTo) {
                    move.promoteTo = nextMoves[i].promoteTo;
                }

                this.goToMove(nextMoves[i]);
                this.fire('correctGuess', nextMoves[i]);
                return true;
            }
        }
        this.fire('wrongGuess');
        return false;
    },

    /**
     * Returns true if passed guess matches next move
     * @method isCorrectGuess
     * @param {Object} guess
     * @param {Object} nextMove
     * @return {Boolean}
     * @private
     */
    isCorrectGuess: function (guess, nextMove) {
        if (nextMove.from == guess.from && nextMove.to == guess.to) {
            return !(guess.promoteTo && !this.isMovePromotedTo(nextMove, guess.promoteTo));
        }
        return false;
    },

    isMovePromotedTo: function (move, promotedTo) {
        var moves = move.moves;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].promoteTo && moves[i].promoteTo == promotedTo) {
                return true;
            }
        }
        return false;
    },
    /**
     * Return result of game, either from metadata("result") or by trying to calculate final
     * position. Return value will be 1 for white win, -1 for black win. 0.5 for draw and 0 for
     * undecided.
     * @method getResult
     * @return {Number}
     */
    getResult: function () {
        if (this.model.result !== undefined && this.model.result !== 0) {
            return this.model.result;
        }
        var result = this.getMetadataValue('result');
        if (result == '1-0') {
            this.model.result = 1;
            return 1;
        }
        if (result == '0-1') {
            this.model.result = -1;
            return -1;
        }
        if (result == '1/2-1/2') {
            this.model.result = 0.5;
            return 0.5;
        }
        var lastMove = this.getLastMoveInGame();
        if (lastMove && lastMove.fen) {
            var parser = new chess.parser.FenParser0x88();
            parser.setFen(lastMove.fen);
            var moveObj = parser.getValidMovesAndResult();
            this.model.result = moveObj.result;
            return moveObj.result;
        }
        return 0;
    },

    /**
     * Returns true if user can claim draw in current position
     * @method canClaimDraw
     * @return {Boolean} can claim draw
     */
    canClaimDraw: function () {
        return this.moveParser.hasThreeFoldRepetition(this.getAllFens());
    },

    /**
     * Returns array of all FEN's in main line(Not variations)
     * @method getAllFens
     * @return {Array}
     */
    getAllFens: function () {
        var moves = this.getMoves();
        var ret = [];
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].fen !== undefined)ret.push(moves[i].fen);
        }
        return ret;
    },

    /**
     * Return last move in game
     * @method getLastMoveInGame
     * @return {chess.model.Move|undefined} move
     */
    getLastMoveInGame: function () {
        if (this.model.moves.length > 0) {
            return this.model.moves[this.model.moves.length - 1];
        }
        return undefined;
    },

    /**
     * Return last position in game
     * @method getLastPositionInGame
     * @return {String} fen
     */
    getLastPositionInGame: function () {
        if (this.model.moves.length > 0) {

            return this.model.moves[this.model.moves.length - 1].fen;
        }
        return this.model.metadata.fen;
    },

    /**
     * Returns array of remaining moves
     * @method getAllNextMoves
     * @param {chess.model.Move} nextOf
     * @return {Array}
     */
    getAllNextMoves: function (nextOf) {
        nextOf = nextOf || this.currentMove;
        var nextMove;

        if (this.model.moves.length == 0)return [];

        if (!nextOf) {
            nextMove = this.model.moves[0];
        } else {
            nextMove = this.getNextMove(nextOf);
        }
        var ret = [];

        if (nextMove) {
            ret.push(nextMove);
        }

        if (nextMove.variations.length > 0) {
            for (var i = 0; i < nextMove.variations.length; i++) {
                var move = nextMove.variations[i][0];
                ret.push(move);
            }
        }
        return ret;
    },

    countMoves: function () {
        return this.model.moves.length;
    },

    /**
     * Append line of moves
     * @param {string} lineString
     * @returns {object} last inserted move or undefined on error
     * @example
     * model.appendLine('e2e4 d7d5 g1f3');
     */
    appendLine: function (lineString, forceVariation) {
        lineString = lineString.trim();
        if (lineString.length == 0)return undefined;
        var moves = lineString.split(/\s/g);
        var p = new chess.parser.FenParser0x88(this.getCurrentPosition());
        var valid = true;
        jQuery.each(moves, function (i, m) {
            moves[i] = this.stringToMove(m);
            moves[i] = this.getValidMove(moves[i], p.getFen());
            if (moves[i]) {
                p.move(moves[i]);
            } else {
                valid = false;
                return undefined;
            }
        }.bind(this));

        if (!valid) {
            return undefined;
        }

        var previousMove = Object.clone(this.getPreviousMove(this.currentMove));
        var nextMove = this.getNextMove();
        var inVariation = false;
        var branch = this.currentBranch;

        if (this.currentMove && forceVariation) {

            branch = this.newVariationBranch(this.currentMove);
            var copy = Object.clone(this.currentMove);
            copy.uid = undefined;
            this.registerMove(copy, undefined, branch);
            this.registerPreviousMap(copy, previousMove);
            previousMove = copy;
            inVariation = true;
        }


        jQuery.each(moves, function (i, m) {

            if (nextMove && !inVariation) {
                if (nextMove.from == m.from && nextMove.to == m.to && !forceVariation) {
                    nextMove = this.getNextMove(nextMove);
                } else {
                    branch = this.newVariationBranch(nextMove);
                    inVariation = true;
                    this.registerMove(m, undefined, branch);
                }

            } else {
                this.registerMove(m, undefined, branch);
            }
            if (inVariation) {
                this.registerVariationMove(m, nextMove, previousMove);
            }
            previousMove = m;

        }.bind(this));

        this.setDirty();
        this.fire('newMoves');

        return previousMove;
    },

    stringToMove: function (m) {
        return {
            from: m.substr(0, 2),
            to: m.substr(2, 2),
            promoteTo: (m.length == 5) ? m.substr(4, 1) : undefined
        };
    },

    move: function (move) {
        return this.appendMove(move);
    },
    /**
     Append move to the model
     @method appendMove
     @param {chess.model.Move|String} move
     @return {Boolean} success
     @example
     var model = new chess.model.Game();
     model.appendMove({ 'from': 'e2', 'to' : 'e4' }); // Using objects
     model.appendMove('e7'); // Using notation
     alert(model.getCurrentPosition());
     */
    appendMove: function (move) {


        var pos = this.getCurrentPosition();
        if (ludo.util.isString(move)) {
            move = this.moveParser.getMoveByNotation(move, pos);
        }


        if (!move.promoteTo && this.moveParser.isPromotionMove(move, pos)) {
            /**
             * verify promotion event. This event is fired when you try to append a promotion move
             * where the promoteTo info is missing
             * @event verifyPromotion
             * @param {String} eventName
             * @param {chess.model.Game} model
             * @param {chess.model.Move} appendedMove
             */
            this.fire('verifyPromotion', move);
            return false;
        }

        var nextMove = this.getNextMove(this.currentMove);
        if (nextMove) {
            if (move.from !== nextMove.from || move.to != nextMove.to) {
                var duplicateVariationMove;
                if (duplicateVariationMove = this.getDuplicateVariationMove(move)) {
                    this.goToMove(duplicateVariationMove);
                    return false;
                }
                if (move = this.getValidMove(move, pos)) {
                    /**
                     Fired when appending a move in the middle of a game. This method sends a message to the controller
                     saying that it needs to know if appended move should be added as variation or if it should overwrite
                     current next move
                     @event overwriteOrVariation
                     @param {String} eventName
                     @param {chess.model.Game} model
                     @param {Object} newMove, nextMove
                     */
                    this.fire('overwriteOrVariation', {newMove: move, oldMove: nextMove});
                    return false;
                }
            } else {
                this.nextMove();
                return false;
            }
        }

        if (move = this.getValidMove(move, pos)) {
            this.registerMove(move);
            this.setCurrentMove(move);
            /**
             Fired when a new move is appended to the game.
             @event newMove
             @param {String} eventName
             @param {chess.model.Game} model
             @param {chess.model.Move} appendedMove
             */
            this.fire('newMove', move);
            /**
             Fired when current move is last move in branch, either last move in game or last move inside a variation.
             @event endOfBranch
             @param {String} eventName
             @param {chess.model.Game} model
             */
            this.fire('endOfBranch');
            if (this.isAtEndOfGame()) {
                /**
                 Fired when current move is last move in game.
                 @event endOfBranch
                 @param {String} eventName
                 @param {chess.model.Game} model
                 */
                this.fire('endOfGame');
            }
            return true;
        } else {
            /**
             Fired when you try to append an invalid move to the game
             @event endOfBranch
             @param {String} eventName
             @param {chess.model.Game} model
             @param {chess.model.Move} move
             */
            this.fire('invalidMove', move);

            return false;
        }
    },

    /**
     * Overwrite a move with a different move. oldMove has to be a
     * move in the game. When found, this move and all following move will be deleted
     * and the new move will be appended.
     * @method overwriteMove
     * @param {chess.model.Move} oldMove
     * @param {chess.model.Move} newMove
     */
    overwriteMove: function (oldMove, newMove) {
        var move = this.findMove(oldMove);
        if (move) {
            this.deleteMove(oldMove);
            this.appendMove(newMove);
        }
    },

    /**
     * Returns valid chess.model.Move object for a move
     * @method getValidMove
     * @param {Object|chess.model.Move} move
     * @param {String} pos
     * @return {chess.model.Move}
     * @private
     */
    getValidMove: function (move, pos) {
        if (this.moveParser.isValid(move, pos)) {
            return this.moveParser.getMoveConfig(move, pos);
        } else {
            if (window.console != undefined) {
                console.log("Parse error on move", move, pos);
                console.log(move);
                console.trace();
            }
        }
        return null;
    },

    registerVariationMove: function (move, parent, previous) {
        this.registerParentMap(move, parent);
        if (previous) {
            this.registerPreviousMap(move, previous);
        }
    },

    /**
     * Add a new move as a variation. If current move is already first move in variation it will go to this move
     * and not create a new variation. This method will
     * fire the events "newVariation", "newMove" and "endOfBranch" on success.
     * "invalidMove" will be fired on invalid move.
     * @method newVariation
     * @param {chess.model.Move} move
     * @return undefined
     */
    newVariation: function (move) {
        if (this.isDuplicateVariationMove(move)) {
            this.goToMove(this.getNextMove(this.currentMove));
            return undefined;
        }
        var previousPosition = this.getPreviousPosition();
        if (previousPosition) {
            if (move = this.getValidMove(move, previousPosition)) {
                this.currentBranch = this.newVariationBranch();
                var prMove = this.getPreviousMove(this.currentMove);
                this.registerMove(move);
                this.setCurrentMove(move);

                this.registerVariationMove(move, this.currentMove, prMove);

                /**
                 Fired after creating a new variation
                 @event newVariation
                 @param {String} eventName
                 @param {chess.model.Game} model
                 @param {chess.model.Move} parentMove
                 */
                this.fire('newVariation', this.getParentMove(move));

                this.fire('newMove', move);
                this.fire('endOfBranch');


            } else {
                this.fire('invalidMove', move);
            }
        }
    },

    /**
     * Returns true when trying to create variation and passed move is next move in line
     * @method isDuplicateVariationMove
     * @param {chess.model.Move} move
     * @return {Boolean}
     */
    isDuplicateVariationMove: function (move) {
        return this.getDuplicateVariationMove(move) ? true : false;
    },

    /**
     * Returns true if current move already has a variation starting with given move
     * @method getDuplicateVariationMove
     * @param {chess.model.Move} move
     * @return {chess.model.Move|undefined}
     */
    getDuplicateVariationMove: function (move) {
        var nextMove;
        if (nextMove = this.getNextMove(this.currentMove)) {
            var variations = nextMove.variations;
            for (var i = 0; i < variations.length; i++) {
                var variationMove = variations[i][0];
                if (variationMove.from === move.from && variationMove.to === move.to) {
                    return variationMove;
                }
            }
        }
        return undefined;
    },

    /**
     * Create new variation branch
     * @method newVariationBranch
     * @private
     */
    newVariationBranch: function (parent) {
        parent = parent || this.currentMove;
        parent.variations = parent.variations || [];
        var variation = [];
        parent.variations.push(variation);
        return parent.variations[parent.variations.length - 1];
    },

    /**
     * Returns fen of current move or start of game fen
     * @method getCurrentPosition
     * @return {String}
     */
    getCurrentPosition: function () {
        if (this.currentMove && this.currentMove.fen) {
            return this.currentMove.fen;
        }
        return this.model.metadata.fen;
    },

    /**
     * Returns fen of previous move or start of game fen
     * @method getPreviousPosition
     * @return {String}
     */
    getPreviousPosition: function () {
        if (this.currentMove) {
            var previous = this.getPreviousMove(this.currentMove);
            if (previous) {
                return previous.fen;
            } else {
                return this.model.metadata.fen;
            }
        }
        return this.model.metadata.fen;
    },

    /**
     * Delete a move. This method will fire the deleteMove and endOfBranch events. If deleted move is in
     * main line, the endOfGame event will also be fired. The event "noMoves" will be fired if the deleted move
     * is the first move in the game. "deleteVariation" will be fired if the deleted move is the first move
     * in a variation.
     * @method deleteMove
     * @param {chess.model.Move} moveToDelete
     */
    deleteMove: function (moveToDelete) {
        var move = this.findMove(moveToDelete);
        if (move) {
            var previousMove = this.getPreviousMove(move);
            var isLastInVariation = this.isLastMoveInVariation(move);
            this.clearMovesInBranch(this.getBranch(move), move.index);
            if (moveToDelete.action) {
                /**
                 Special event not yet implemented. Supporting for adding info to games such as video links, automatic start and stop
                 of auto play for lecture purpose will be added as actions later.
                 @event deleteAction
                 @param {String} eventName
                 @param {chess.model.Game} model
                 @param {chess.model.Move} move
                 */
                this.fire('deleteAction', move);
            } else {
                /**
                 Fired when a move is deleted. It will only be fired for one move and not the following moves which of course
                 also will be deleted.
                 @event deleteMove
                 @param {String} eventName
                 @param {chess.model.Game} model
                 @param {chess.model.Move} deleted move
                 */
                this.fire('deleteMove', move);
                this.fire('endOfBranch');
                if (this.isAtEndOfGame()) {
                    this.fire('endOfGame');
                } else {
                    /**
                     Fired when going to a move which is not last move in game
                     @event notEndOfGame
                     @param {String} eventName
                     @param {chess.model.Game} model
                     */
                    this.fire('notEndOfGame');
                }
                if (!this.hasMovesInBranch(this.getBranch(move))) {
                    this.fire('noMoves');
                }
                if (previousMove) {
                    this.setCurrentMove(previousMove);
                } else {
                    this.clearCurrentMove();
                }
                if (isLastInVariation) {
                    this.fire('deleteVariation', move);
                }
            }
        }
    },

    /**
     * true if given move is last move in current variation, i.e. the variation active on the board
     * @method isLastMoveInVariation
     * @param {chess.model.Move} move
     * @return {Boolean}
     */
    isLastMoveInVariation: function (move) {
        var parent = this.getParentMove(move);
        if (parent !== undefined) {
            var branch = this.getBranch(move);
            if (branch.length === 0)return true;
            if (move === branch[0])return true;
        }
        return false;
    },

    /**
     * true if move displayed on board, i.e. current model move is last move in game.
     * @method isAtEndOfGame
     * @return {Boolean}
     */
    isAtEndOfGame: function () {
        if (this.model.moves.length === 0) {
            return true;
        }
        return this.currentMove && this.currentMove.uid == this.model.moves[this.model.moves.length - 1].uid;
    },

    /**
     * Returns true if there are moves left in branch
     * @method hasMovesInBranch
     * @param {Array} branch
     * @return {Boolean}
     * @private
     */
    hasMovesInBranch: function (branch) {
        if (branch.length === 0) {
            return false;
        }
        for (var i = 0; i < branch.length; i++) {
            if (branch[i].m) {
                return true;
            }
        }
        return false;
    },

    /**
     * Delete moves from branch, i.e. main line or variation
     * @method clearMovesInBranch
     * @param {Array} branch
     * @param {Number} fromIndex
     * @private
     */
    clearMovesInBranch: function (branch, fromIndex) {
        for (var i = fromIndex; i < branch.length; i++) {
            delete this.moveCache[branch[i].uid];
        }
        branch.length = fromIndex;
    },

    /**
     * @method findMove
     * @param {chess.model.Move} moveToFind
     * @return {chess.model.Move}
     */
    findMove: function (moveToFind) {
        return moveToFind != undefined && this.moveCache[moveToFind.uid] ? this.moveCache[moveToFind.uid] : null;
    },

    /**
     * Delete current move reference. This method is called when creating a new game and when first
     * move in the game is deleted
     * @method clearCurrentMove
     * @private
     */
    clearCurrentMove: function () {
        this.currentMove = undefined;
        this.currentBranch = this.model.moves;
        this.fire('clearCurrentMove');
    },

    to: function (move) {
        if (this.setCurrentMove(move)) {
            this.fire('setPosition', move);
        }
    },
    /**
     * Go to a specific move.
     * @method goToMove
     * @param {chess.model.Move} move
     */
    goToMove: function (move) {
        return this.to(move);
    },

    /**
     * Back up x number of moves
     * @method back
     * @param {Number} numberOfMoves
     * @return {Boolean}
     */
    back: function (numberOfMoves) {
        if (!this.currentMove)return undefined;
        numberOfMoves = numberOfMoves || 1;
        var branch = this.currentBranch;
        var index = branch.indexOf(this.currentMove);
        var currentMove;
        var move = {};
        var parent;
        while (index >= 0 && numberOfMoves > 0) {
            index--;
            if (index < 0 && numberOfMoves > 0) {
                parent = this.getParentMove(move);
                if (parent) {
                    move = parent;
                    branch = this.getBranch(move);
                    index = branch.indexOf(move);
                    index--;
                }
            }
            if (index >= 0) {
                move = branch[index];
                if (this.isChessMove(move)) {
                    currentMove = move;
                    numberOfMoves--;
                }
            }

        }
        if (this.isChessMove(currentMove)) {
            return this.setCurrentMove(currentMove);
        }
        return false;
    },

    getMove: function (move) {
        return this.findMove(move);
    },

    /**
     * Call goToMove for current move and trigger the events. This method is called when
     * overwrite of move is cancelled from game editor and when you're guessing the wrong move
     * in a tactic puzzle
     * @method resetPosition
     */
    resetPosition: function () {
        if (this.currentMove) {
            this.goToMove(this.currentMove);
        } else {
            this.toStart();
        }
    },
    /**
     * @method setCurrentMove
     * @param {chess.model.Move} newCurrentMove
     * @return {Boolean} success
     * @private
     */
    setCurrentMove: function (newCurrentMove) {
        var move = this.findMove(newCurrentMove);
        if (move) {
            this.currentMove = move;
            this.currentBranch = this.getBranch(move);
            this.fire('notStartOfGame');
            if (this.getNextMove(move)) {
                this.fire('notEndOfBranch');
                this.fire('notEndOfGame');
            } else {
                this.fire('endOfBranch');
                if (this.isAtEndOfGame()) {
                    this.fire('endOfGame');
                }
            }

            return true;
        }
        return false;
    },
    /**
     * Return color to move, "white" or "black"
     * @method turn
     * @return {String}
     */
    turn: function () {
        var fens = this.getCurrentPosition().split(' ');
        var colors = {'w': 'white', 'b': 'black'};
        return colors[fens[1]];

    },


    getColorToMove: function () {
        return this.turn();
    },

    getStartPly: function () {
        return this._ply(this.model.metadata.fen)
    },

    getCurrentPly: function () {
        return this._ply(this.getCurrentPosition());
    },

    _ply: function (fen) {
        var fens = fen.split(/\s/g);
        var l = fens.pop();
        var m = (l - 1) * 2;
        if (fens[1] == 'b')m++;
        return m;
    },

    /**
     * Returns current move, i.e. last played move
     * @method getCurrentMove
     * @return {chess.model.Move}
     */
    getCurrentMove: function () {
        return this.currentMove;
    },

    /**
     * Return branch, i.e. main line or variation of current move
     * @method getCurrentBranch
     * @return {Array}
     */
    getCurrentBranch: function () {
        return this.getCurrentBranch();
    },

    /**
     * Go to previous move
     * @method previousMove
     */
    previousMove: function () {
        var move = this.getPreviousMove(this.currentMove);
        if (move) {
            this.setCurrentMove(move);
            this.fire('setPosition', move);
        } else {
            this.toStart();
        }
    },

    /**
     * Go to next move
     * @method nextMove
     */
    nextMove: function () {
        var move;
        if (this.hasCurrentMove()) {
            move = this.getNextMove(this.currentMove);
        } else {
            move = this.getFirstMoveInGame();
        }
        if (move) {
            this.setCurrentMove(move);
            this.fire('nextmove', move);
        }
    },

    /**
     * Go to start of game
     * @method toStart
     */
    toStart: function () {
        this.fire('startOfGame');
        this.clearCurrentMove();
        this.fire('setPosition');
        if (this.model.moves.length > 0) {
            this.fire('notEndOfBranch');
            this.fire('notEndOfGame');
        } else {
            this.fire('endOfBranch');
            this.fire('endOfGame');
        }
    },

    /**
     * Go to last move in game
     * @method toEnd
     */
    toEnd: function () {
        if (this.model.moves.length > 0) {
            this.currentMove = this.model.moves[this.model.moves.length - 1];
            this.fire('setPosition');
            this.fire('endOfBranch');
            this.fire('notStartOfGame');
            this.fire('endOfGame');
        }
    },
    /**
     * Go to last move in current branch, i.e. main line or variation
     * @method toEndOfCurrentBranch
     */
    toEndOfCurrentBranch: function () {
        if (this.currentBranch.length > 0) {
            this.currentMove = this.currentBranch[this.currentBranch.length - 1];
            this.fire('setPosition');
            this.fire('endOfBranch');
            this.fire('notStartOfGame');
            if (this.isAtEndOfGame()) {
                this.fire('endOfGame');
            }
        }
    },

    /**
     * Returns rue if current move is set
     * @method hasCurrentMove
     * @return {Boolean}
     */
    hasCurrentMove: function () {
        return this.currentMove ? true : false;
    },

    /**
     * Return first move in game
     * @method getFirstMoveInGame
     * @return {chess.model.Move}
     */
    getFirstMoveInGame: function () {
        for (var i = 0; i < this.model.moves.length; i++) {
            var move = this.model.moves[i];
            if (this.isChessMove(move)) {
                return move;
            }
        }
        return null;
    },

    /**
     * Return parent move of given move, i.e. parent move of a move in a variation.
     * @method getParentMove
     * @param {chess.model.Move|Object} move
     * @return {chess.model.Move|undefined}
     */
    getParentMove: function (move) {
        move = this.findMove(move);
        if (move) {
            return this.moveParentMap[move.uid];
        }
        return undefined;
    },

    /**
     * Returns previous move in same branch/line or undefined
     * @method getPreviousMoveInBranch
     * @param {chess.model.Move} move
     * @return {chess.model.Move|undefined}
     * @private
     */
    getPreviousMoveInBranch: function (move) {
        if (move.index > 0) {
            var index = move.index - 1;
            var branch = this.getBranch(move);
            var previousMove = branch[index];

            while (!this.isChessMove(previousMove) && index > 0) {
                index--;
                previousMove = branch[index];
            }
            if (this.isChessMove(previousMove)) {
                return previousMove;
            }

        }
        return null;
    },

    /**
     * Returns previous move in same branch or parent branch
     * @method getPreviousMove
     * @param {chess.model.Move} move
     * @param {Boolean} includeComments
     * @optional
     * @return {chess.model.Move|undefined}
     */
    getPreviousMove: function (move, includeComments) {
        includeComments = includeComments || false;
        move = this.findMove(move);
        if (move) {
            var pr = this.movePreviousMap[move.uid];
            if (pr) {
                if (includeComments && pr.comment) {
                    return pr;
                }
                if (!pr.from) {
                    return this.getPreviousMove(pr);
                }
                return pr;
            }
            if (move.index > 0) {
                var branch = this.getBranch(move);
                var previousMove = branch[move.index - 1];
                pr = this.movePreviousMap[move.uid];
                if (includeComments && pr && pr.comment) {
                    return pr;
                }
                if (!previousMove.from && !includeComments) {
                    return this.getPreviousMove(previousMove);
                }
                return branch[move.index - 1];
            }
            var parent = this.getParentMove(move);
            if (parent) {
                return this.getPreviousMove(parent);
            }
        }
        return undefined;
    },

    nextOf: function (nextOf) {
        nextOf = nextOf || this.currentMove;
        if (!nextOf) {
            if (!this.currentMove && this.model.moves.length > 0) {
                nextOf = this.model.moves[0];
                if (!this.isChessMove(nextOf)) {
                    return this.getNextMove(nextOf);
                }
                return this.model.moves[0];
            }
            return undefined;
        }
        nextOf = this.findMove(nextOf);
        if (nextOf) {
            var branch = this.getBranch(nextOf);
            if (nextOf.index < branch.length - 1) {
                return branch[nextOf.index + 1];
            }
        }
        return undefined;
    },

    /**
     * Get next move of
     * @method getNextMove
     * @param {chess.model.Move} nextOf
     * @return {chess.model.Move|undefined} next move
     */
    getNextMove: function (nextOf) {
        return this.nextOf(nextOf);
    },

    /**
     * Add action as a move. Actions are not fully implemented. When implemented, it will add supports for
     * interactive chess games, example: start and stop autoplay. Display comments, videos or audio etc.
     * @method addAction
     * @param {chess.model.Move} action
     */
    addAction: function (action) {
        action = Object.clone(action);
        if (this.currentMove) {
            var index = this.currentMove.index + 1;
            this.registerMove(action, index);
        } else {
            this.registerMove(action);
        }
        this.fire('newaction');
    },

    /**
     Grade a move
     @method gradeMove
     @param move
     @param grade
     @example
     model.gradeMove(model.getCurrentMove(), '!');
     ...
     ...
     model.gradeMove(model.getCurrentMove(), '??');
     */
    gradeMove: function (move, grade) {

        move = this.findMove(move);
        if (move) {
            move.m = move.m.replace(/[!\?]/g, '');
            move.lm = move.lm.replace(/[!\?]/g, '');
            grade = grade.replace(/[^!\?]/g, '');
            if (grade || grade == '') {
                move.m = move.m + grade;
                move.lm = move.lm + grade;
                this.fire('updateMove', move);
            }


        }
    },

    /**
     * Internally index a move
     * @method registerMove
     * @param {chess.model.Move} move
     * @param {Number} atIndex
     * @optional
     * @private
     */
    registerMove: function (move, atIndex, inBranch) {
        inBranch = inBranch || this.currentBranch;
        move.uid = 'move-' + String.uniqueID();
        this.moveCache[move.uid] = move;
        this.registerBranchMap(move, inBranch);

        if (atIndex) {
            move.index = atIndex;
            this.insertSpacerInBranch(inBranch, atIndex, move);
            // this.createSpaceForAction();
        } else {
            move.index = inBranch.length;
            inBranch.push(move);
        }

    },

    /**
     * Insert space for new move in a branch at index
     * @method insertSpacerInBranch
     * @param {Array} branch
     * @param {Number} atIndex
     */
    insertSpacerInBranch: function (branch, atIndex, item) {

        atIndex = atIndex || 0;
        branch.splice(atIndex, 0, item);
        for (var i = 0; i < branch.length; i++) {
            branch[i].index = i;
        }
    },


    /**
     * Return comment before move, i.e. get comment of previous move
     * @method getCommentBefore
     * @param {chess.model.Move} move
     * @return {String} comment
     */
    getCommentBefore: function (move) {
        move = this.findMove(move);
        if (move) {
            var previousMove;
            if (previousMove = this.getPreviousMove(move, this.INCLUDE_COMMENT_MOVES)) {
                return previousMove.comment ? previousMove.comment : '';
            }
        }
        return '';
    },
    /**
     * Get comment of current move
     * @method getCommentAfter
     * @param {chess.model.Move} move
     * @return {String} comment
     */
    getCommentAfter: function (move) {
        move = this.findMove(move);
        if (move) {
            return move.comment ? move.comment : '';
        }
        return '';
    },

    setGameComment: function (comment) {
        if (this.model.moves.length > 0) {
            var move = this.model.moves[0];
            if (move.m == undefined) {
                this.setCommentAfter(comment, move);
            } else {
                this.setCommentBefore(comment, move);
            }
        } else {
            var m = {
                comment: comment,
                index: 0,
                uid: 'move-' + String.uniqueID()
            };

            this.registerMove(m);
            this.fire('updateMove', this.model.moves[0]);
        }
    },

    /**
     * Set comment before a move, i.e. set comment of previous move, or in case of first move in game, set "commment" attribute of
     * game metadata.
     * @method setCommentBefore
     * @param {String} comment
     * @param {chess.model.Move} move
     */
    setCommentBefore: function (comment, move) {
        move = this.findMove(move);
        if (move) {
            var previousMove = this.getPreviousMove(move, this.INCLUDE_COMMENT_MOVES);
            if (previousMove) {
                this.setComment(previousMove, comment);
            } else {
                move = this.findMove(move);
                var branch = this.getBranch(move);
                this.insertSpacerInBranch(branch, 0, {
                    comment: comment,
                    index: 0,
                    uid: 'move-' + String.uniqueID()
                });
                this.moveCache[move.uid] = move;
                this.registerPreviousMap(move, branch[0]);
                this.fire('updateMove', branch[0]);
            }
        }
    },
    /**
     * Set comment after a move
     * @method setCommentAfter
     * @param {String} comment
     * @param {chess.model.Move} move
     */
    setCommentAfter: function (comment, move) {
        move = this.findMove(move);
        if (move) {
            this.setComment(move, comment);
        }
    },

    setEval: function (eval, move) {
        move = move || this.currentMove;
        move = this.findMove(move);
        if (move) {
            move.eval = eval;
            this.fire('updateMove', move);
        }
    },

    /**
     * Set comment property of a move
     * @method setComment
     * @param {chess.model.Move} move
     * @param {String} comment
     */
    setComment: function (move, comment) {
        move.comment = comment;
        this.fire('updateMove', move);
    },

    /**
     * Returns true if passed move is a valid chess move
     * @method isChessMove
     * @param {Object} move
     * @return {Boolean}
     * @private
     */
    isChessMove: function (move) {
        return ((move.from && move.to) || (move.m && move.m == '--')) ? true : false
    },

    /**
     * @method fire
     * @param {String} eventName
     * @param {Object|chess.model.Move} param
     * @optional
     * @private
     */
    fire: function (eventName, param) {
        if (eventName === 'updateMove' || eventName == 'newMove' || eventName == 'updateMetadata') {
            this.setDirty();
        }
        var event = chess.events.game[eventName] || eventName;
        this.fireEvent(event, [event, this, param]);


        if (event == 'newGame' || event == 'newMove' || event == 'setPosition' || event == 'newMove' || event == 'nextmove') {
            this.fireEvent('fen', ['fen', this, this.getCurrentPosition()]);
        }
    },

    /**
     * Start auto play of moves
     * @method startAutoPlay
     */
    startAutoPlay: function () {
        this.state.autoplay = true;
        this.fire('startAutoplay');
        this.nextAutoPlayMove();
    },
    /**
     * Stop auto play of moves
     * @method startAutoPlay
     */
    stopAutoPlay: function () {
        if (this.state.autoplay) {
            this.state.autoplay = false;
            this.fire('stopAutoplay');
        }
    },

    /**
     * Auto play next move
     * @method nextAutoPlayMove
     * @private
     */
    nextAutoPlayMove: function () {
        if (this.state.autoplay) {
            var nextMove = this.getNextMove(this.currentMove);
            if (nextMove) {
                this.nextMove.delay(1000, this);
            } else {
                this.stopAutoPlay();
            }
        }
    },

    /**
     * Returns true if in auto play mode
     * @method isInAutoPlayMode
     * @return {Boolean}
     */
    isInAutoPlayMode: function () {
        return this.state.autoplay;
    },

    /**
     * Return database id of game
     * @method getDatabaseId
     * @return {Number}
     */
    getDatabaseId: function () {
        return this.databaseId;
    },

    /**
     * Set dirty flag to true, i.e. game has been changed but not saved.
     * @method setDirty
     * @private
     */
    setDirty: function () {
        this.dirty = true;
        /**
         * Event fired when model is changed but not saved
         * @event dirty
         * @param {chess.model.Game} this
         */
        this.fireEvent('dirty', this);
    },
    /**
     * Set dirty flag to false, i.e. game has been changed and saved
     * @method setClean
     * @private
     */
    setClean: function () {
        this.dirty = false;
        /**
         * Event fired when model is clean, i.e. right after being saved to the server.
         * @event dirty
         * @param {chess.model.Game} this
         */
        this.fireEvent('clean', this);
    },

    /**
     * Return dirty flag. dirty flag is set to true when game has been changed, but not saved.
     * @method isDirty
     * @return {Boolean}
     */
    isDirty: function () {
        return this.dirty;
    },

    /**
     * Save model to server
     * @method save
     */
    save: function () {
        this.gameReader.save(this.modelForServer());
        this.setClean();
    },

    modelForServer: function () {
        return this.toValidServerModel(this.toValidServerModel(this.model));
    },

    /**
     * Convert to valid server model, i.e. reserved metadata moved from metadata object
     * @method toValidServerModel
     * @param {Object} gameData
     * @return {Object}
     * @private
     */
    toValidServerModel: function (gameData) {
        gameData = Object.clone(gameData);
        gameData.metadata = gameData.metadata || {};
        for (var i = 0; i < this.reservedMetadata.length; i++) {
            var key = this.reservedMetadata[i];
            if (gameData.metadata[key] !== undefined) {
                gameData[key] = gameData.metadata[key];
                delete gameData.metadata[key];
            }
        }
        if (!gameData.result)gameData.result = '*';
        return gameData;
    },

    /**
     * Receive game update from server
     * @method gameSaved
     * @param {Object} data
     * @private
     */
    gameSaved: function (data) {
        new ludo.Notification({
            html: chess.getPhrase('Game saved successfully'),
            duration: 1,
            effectDuration: .5
        });
        if (data.id) {
            this.model.id = data.id;
        }
        this.fire('gameSaved', this.model);
    },

    getMobility: function () {
        return this.moveParser.getMobility(this.getCurrentPosition());
    }
});

/* ../dhtml-chess/src/remote/reader.js */
chess.remote.Reader = new Class({
    Extends:Events,
	onLoadEvent:undefined,

    query : function(config) {

        this.onLoadEvent = config.eventOnLoad || 'load';

		jQuery.ajax({
			url: ludo.config.getUrl(),
			method: 'post',
			cache: false,
			dataType: 'json',
			data: config,
			success: function (json) {
				this.fireEvent(this.onLoadEvent, json.response != undefined ? json.response : json);
			}.bind(this),
			fail: function (text, error) {
				this.fireEvent('fail', [text, error, this]);
			}.bind(this)
		});


		// this.remoteHandler(config.resource).send(config.service, config.arguments, config.data);


    },
	_remoteHandler:undefined,

	remoteHandler:function(resource){
		if(this._remoteHandler === undefined){
			this._remoteHandler = new ludo.remote.JSON({
				resource : resource,
				listeners:{
					"success": function(request){
						this.fireEvent(this.onLoadEvent, request.getResponseData());
					}.bind(this)
				}
			});
		}
        this._remoteHandler.setResource(resource);
		return this._remoteHandler;
	},

	getOnLoadEvent:function(){
		return this.onLoadEvent;
	}
});/* ../dhtml-chess/src/remote/game-reader.js */
/**
 * Class used to load games from server. An object of this class is automatically created by
 * chess.model:Game.
 * @namespace chess.remote
 * @class GameReader
 * @extends remote.Reader
 */
chess.remote.GameReader = new Class({
    Extends:chess.remote.Reader,

    loadGame : function(id, pgn){
		this.fireEvent('beforeLoad');
        var query = {
            "eventOnLoad": "load"
        };

        if(window.chess.isWordPress){
            query.action = 'game_by_id';
            query.pgn = pgn;
            query.id = id;
        }else{
            query.resource = 'Game';
            query.service = 'read';
            query.arguments = id;
        }
		this.query(query);
    },

	loadStaticGame:function(pgn, index){

		this.fireEvent('beforeLoad');
        var query = {
            "eventOnLoad": "load"
        };


        if(window.chess.isWordPress){
            query.action = "game_by_index";
            query.pgn = pgn;
            query.index = index;
        }else{
            query.resource = "ChessFs";
            query.service = "getGame";
            query.arguments = pgn;
            query.data = index;

        }
		this.query(query);
	},

    save:function(game){
        if(this.hasDummyId(game))delete game.id;

        var query = {
            "resource": "Game",
            "service": "save",
            "eventOnLoad": "saved",
            "arguments": game.id,
            "data": game
        };

        if(window.chess.isWordPress){
            query.action = 'save_game';
            query.id = game.id;
            query.game = game;
        }else{
            query.resource = 'Game';
            query.service = 'save';
            query.arguments = game.id;
            query.data = game;
        }

        this.query(query);

    },

    hasDummyId:function(game){
        return /[a-z]/g.test(game.id || '');
    },

    loadRandomGame : function(databaseId) {
		this.fireEvent('beforeLoad');
        this.query({
            "resource": "Database",
            "arguments": databaseId,
            "service": 'randomGame'
        });
    },

    loadRandomGameFromFile:function(file){
        this.fireEvent('beforeload');

        if(window.chess.isWordPress){
            this.query({
                'action' : 'random_game',
                'pgn' : file
            });
        }else{
            this.query({
                'resource' : 'ChessFS',
                'arguments' : file,
                'service' : 'getRandomGame'
            });
        }

    },

    getEngineMove : function(fen){
        this.query({
            "resource": "ChessEngine",
            "arguments": fen,
            "service": 'getMove',
            "eventOnLoad": "newMove"
        });
    }
});/* ../dhtml-chess/src/datasource/game-list.js */
/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.dataSource.GameList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.GameList',
    autoload:false,
    singleton: true,
	resource:'Database',
    postData:{
        resource:'Database'
    },
    __construct:function(config){
        this.url = ludo.config.getUrl();
        this.parent(config);

    }
});/* ../dhtml-chess/src/datasource/pgn-games.js */
/**
 * Data source for list of games in a static pgn file. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.dataSource.PgnGames = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnGames',
    autoload:true,
    singleton: true,
    resource:'ChessFS',
    service:"listOfGames",
    "primaryKey":"index",
    postData:{
        "resource": "ChessFS",
        "service": "listOfGames",
        "arguments":undefined
    },
    getCurrentPgn:function(){
        return this.postData.arguments;
    },

    __construct:function(config){
        this.url = ludo.config.getUrl();
        if(config.pgn != undefined)this.postData.arguments= config.pgn;
        this.parent(config);
    },

    /**
     * Load games from this pgn file
     @method loadFile
     @param file
     @example
        dataSource:{
            id:'gameList',
            "type":'chess.dataSource.PgnGames',
            // "Morphy" is the name of a pgn file inside the "pgn" folder.
            //  You can put games inside that folder and change the argument below.
            "arguments":"Morphy",
            "listeners":{
                "beforeload":function () {
                    ludo.get("searchField").reset();
                },
                "select": function(){
                    ludo.get('gamesApp').getLayout().toggle();
                }
            },
            shim:{
                txt : 'Loading games'
            },
            paging:{
                size:25,
                pageQuery:false,
                cache:false,
                cacheTimeout:1000
            }
        }
     To change pgn file call

     @example
        ludo.get('gameList').loadFile('Lasker');

     i.e. name of pgn file without the file extension.
     */
    loadFile:function(file){
        this.postData.arguments = file;
        this.sendRequest(this.service, file);
    },

    getPgnFileName:function(){
        return this.postData.arguments;
    }
});/* ../dhtml-chess/src/datasource/pgn-list.js */
/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.dataSource.PgnList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnList',
    autoload:true,
    singleton: true,
    postData:{
        resource:'ChessFSPgn',
        service:'read'
    }
    
});/* ../dhtml-chess/src/pgn/parser.js */
/**
 Model to PGN parser. Takes a
 {{#crossLink "chess.model.Game"}}{{/crossLink}} as only argument
 and returns a PGN string for the game.
 @namespace chess.pgn
 @class Parser
 @constructor
 @param {chess.model.Game} model
 @example
 var game = new chess.model.Game();
 game.setMetadataValue('white','Magnus Carlsen');
 game.setMetadataValue('black','Levon Aronian');
 game.appendMove('e4');
 game.appendMove('e5');

 var parser = new chess.pgn.Parser(game);
 console.log(parser.getPgn());
 */
chess.pgn.Parser = new Class({
    /**
     * @property {chess.model.Game} model
     * @private
     */
    model: undefined,


    initialize: function (model) {
        this.model = model;
    },

    /**
     * Return pgn in string format
     * @method getPgn
     * @return {String}
     */
    getPgn: function (model) {
        if (model != undefined)this.model = model;
        return [this.getMetadata(), this.getMoves()].join("\n\n");
    },

    /**
     * @method getMetadata
     * @return {String}
     * @private
     */
    getMetadata: function () {
        var ret = [];
        var metadata = this.model.getMetadata();
        jQuery.each(metadata, function(key, val){
            if(key != 'id' && key != 'pgn' && key != 'draft_id' && key != 'index'){
                ret.push('[' + this.ucFirst(key) + ' "' +val + '"]');
            }
        }.bind(this));
        return ret.join('\n');
    },

    ucFirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * @method getMoves
     * @return {String}
     * @private
     */
    getMoves: function () {
        return this.getFirstComment() + this.getMovesInBranch(this.model.getMoves(), 0);
    },

    /**
     * Return comment before first move
     * @method getFirstComment
     * @return {String}
     * @private
     */
    getFirstComment: function () {
        var m = this.model.getMetadata();
        if (m['comment'] !== undefined && m['comment'].length > 0) {
            return '{' + m['comment'] + '} ';
        }
        return '';
    },

    /**
     * Return main line of moves or a variation
     * @method getMovesInBranch
     * @param {Array} moves
     * @param {Number} moveIndex
     * @return {String}
     * @private
     */
    getMovesInBranch: function (moves, moveIndex) {
        moveIndex = moveIndex || 0;
        var ret = [];
        var insertNumber = true;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i]['m'] !== undefined) {
                if (moveIndex % 2 === 0 || insertNumber) {
                    var isWhite = moveIndex % 2 === 0;
                    ret.push([Math.floor(moveIndex / 2) + 1, (isWhite ? '.' : '..')].join(''));
                }
                ret.push(moves[i]['m']);
                moveIndex++;

                insertNumber = false;
            }
            if (moves[i]['comment'] !== undefined) {
                ret.push("{" + moves[i]['comment'] + "}");
            }

            if (moves[i]['variations'] !== undefined && moves[i]['variations'].length > 0) {
                var variations = moves[i]['variations'];
                for (var j = 0; j < variations.length; j++) {
                    ret.push("(" + this.getMovesInBranch(variations[j], moveIndex - 1) + ")");

                }
                insertNumber = true;
            }
        }
        return ret.join(' ');
    }
});
/* ../dhtml-chess/src/wordpress/game-list-grid.js */
chess.wordpress.GameListGrid = new Class({
    Extends: chess.view.gamelist.Grid,
    headerMenu: false,
    submodule: 'wordpress.gamelist',
    dataSource: {
        'type': 'ludo.dataSource.JSONArray',
        autoload: false,
        postData: {
            action: 'list_of_games'
        }
    },
    emptyText:chess.getPhrase('No games'),
    loadMessage: chess.getPhrase('Loading games...'),
    cols: ['white','black', 'round', 'result', 'last_moves'],

    __rendered: function () {
        this.parent();
        this.loadGames();
        this.on('show', this.loadGames.bind(this));

    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('publish', function () {
            if(this.controller.pgn){

                this.getDataSource().load();
            }
        }.bind(this));
    },

    loadGames: function () {
        if(this.controller){
            if (this.controller.pgn && this.controller.pgn != this.getDataSource().postData.pgn) {
                this.load();
            }
        }else if(this.getDataSource().postData.pgn){
            this.load();
        }

    },

    load: function () {
        if (this.controller.pgn) {
            this.getParent().setTitle(chess.getPhrase('PGN:') + ' ' + this.controller.pgn.pgn_name);

            this.getDataSource().postData.pgn = this.controller.pgn.id;
            this.getDataSource().load();

        }
    },

    selectGame: function (record) {
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});/* ../dhtml-chess/src/wordpress/pgn-list.js */
chess.wordpress.PgnList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.dataSource.PgnList',
    autoload:true,
    postData:{
        action:'list_pgns'
    }
});/* ../dhtml-chess/src/wordpress/game-list.js */
/**
 * Data source for list of games. An object of this class is automatically created
 * by chess.view.gamelist.Grid
 * @module DataSource
 * @namespace chess.dataSource
 * @class GameList
 * @extends dataSource.JSONArray
 */
chess.wordpress.GameList = new Class({
    Extends: ludo.dataSource.JSONArray,
    type : 'chess.wordpress.GameList',
    autoload:false,
    singleton: true,
    resource:'Database',
    postData:{
        action:'list_of_games'
    },


    __construct:function(config){
        this.url = ludo.config.getUrl();
        this.parent(config);


        this.sortFn = this.sortFn || {};

        this.sortFn.round = {
            'asc' : function(a,b){
                return this.compareRound(a,b, 1);

            }.bind(this),
            'desc' : function(a,b){
                return this.compareRound(a,b, 0);
            }.bind(this)

        }


    },

    compareRound:function(a,b,ascending){
        var v1 = this.sortVal(a);
        var v2 = this.sortVal(b);
        var ret = v1 < v2 ? 1 : -1;
        if(!ascending)ret *=-1;
        return ret;

    },

    sortVal:function(game){
        var round = game.round;
        if(!round)return 1;

        var t = round.split(/\./g);
        if(t.length == 1){
            return parseInt(t[0]);
        }

        return parseInt(t[0]*1000) + parseInt(t[1]);
    },

    loadPgn:function(pgn){
        this.postData.pgn = pgn;
        this.sendRequest(this.service, pgn);
    }
});/* ../dhtml-chess/src/computer/computer-play.js */
chess.computer.Elo = new Class({

    K: 30,
    PROVISIONAL: 8,

    db: undefined,

    MIN_ELO: 800,
    clearAll: function () {
        this.db.empty();
    },


    initialize: function () {
        this.db = ludo.getLocalStorage();
    },

    hasPlayedBefore: function () {
        return this.db.get('played', '0') == '1';
    },

    getGameType: function (gameTime, inc) {
        var t = gameTime + (inc * 30);
        if (t < 60 * 3)return "bullet";
        if (t <= 60 * 8) return "blitz";
        return "classical";
    },

    getEloByTime: function (time, inc) {
        return this.getElo(this.getGameType(time, inc));
    },

    getElo: function (gameType) {
        return Math.max(this.MIN_ELO, this.db.getNumeric('elo' + gameType, 1200));
    },

    /**
     *
     * @param {int} result result as -1 for loss 0 for draw and 1 for win
     * @param againstElo
     * @param gameType
     * @param myColor
     */
    saveResult: function (result, againstElo, gameType, myColor) {

        this.db.save('played', '1');
        var c = this.incrementGames(gameType);
        var newElo;
        if (c <= this.PROVISIONAL) {
            var prov = this.db.get('provisional' + gameType, []);
            var e = result == -1 ? againstElo - 400 : result == 0 ? againstElo : againstElo + 400;
            e = Math.max(this.MIN_ELO, e);
            prov.push(e);

            this.db.save('provisional' + gameType, prov);
            var sum = 0;
            jQuery.each(prov, function (i, val) {
                sum += val;
            });
            newElo = Math.max(this.MIN_ELO, sum / prov.length);
        } else {
            var elo = this.getElo(gameType);
            if (myColor == 'black') {
                againstElo *= 1.05;
            } else {
                againstElo -= (againstElo * 0.05);
            }
            var adjustment = this.getRatingAdjustment(elo, againstElo, result);
            newElo = elo + adjustment;
        }

        return this.db.save('elo' + gameType, newElo);
    },

    getRatingAdjustment: function (eloW, eloB, result) {

        result += 1;
        result /= 2;

        var expected = this.getExpectedScore(eloW, eloB);

        return this.K * (result - expected);

    },

    getExpectedScore: function (ratingA, ratingB) {
        var qa = Math.pow(10, ratingA / 400);
        var qb = Math.pow(10, ratingB / 400);
        return qa / (qa + qb);
    },

    incrementGames: function (gameType) {
        var c = this.countGames(gameType) + 1;
        this.db.save('games' + gameType, c);
        return c;
    },

    countGames: function (gameType) {
        return this.db.getNumeric('games' + gameType, 0);
    }
});

chess.computer.Clock = new Class({

    Extends: Events,

    time: undefined,

    increment: undefined,

    turn: 'white',

    savedTime: undefined,

    started: false,

    initialize: function () {
        this.tick();
    },

    tick: function () {
        if (this.started) {
            this.validateTime();
            this.onChange();
        }
        this.tick.delay(100, this);

    },

    stop: function () {
        this.time[this.turn] = this.getTime(this.turn);
        this.started = false;
        this.savedTime = new Date().getTime();
        this.onChange();
    },

    validateTime: function () {
        var t = this.getTime(this.turn);
        if (t == 0) {
            this.time[this.turn] = this.getTime(this.turn);
            this.onChange();
            this.fireEvent('end', this.turn);
            this.started = false;
        }
    },

    wTime: function () {
        return this.getTime('white');
    },

    bTime: function () {
        return this.getTime('black');
    },

    inc: function () {
        return this.increment;
    },

    setTime: function (time, increment) {
        increment = increment || 0;

        this.time = {};

        this.time.white = time * 1000;
        this.time.black = time * 1000;
        this.increment = increment * 1000;

        this.onChange();
    },

    start: function (time, increment) {
        if (arguments.length == 2) {
            this.setTime(time, increment);
        }
        this.turn = 'white';
        this.savedTime = new Date().getTime();
        this.started = true;

        this.onChange();
    },

    tap: function () {
        this.time[this.turn] = this.getTime(this.turn) + this.increment;
        this.turn = this.turn == 'white' ? 'black' : 'white';
        this.savedTime = new Date().getTime();
        this.onChange();
    },

    getTime: function (color) {
        var t = this.time[color];
        if (this.turn == color && this.started) {
            t -= new Date().getTime() - this.savedTime;
        }
        return Math.max(0, t);
    },

    onChange: function () {
        this.fireEvent('change', [this.turn, this.timeAsObject('white'), this.timeAsObject('black')]);
    },

    timeAsObject: function (color) {
        var t = this.getTime(color);

        var decimals = t < 10000 ? parseInt((t / 100) % 10) : undefined
            , seconds = parseInt((t / 1000) % 60)
            , minutes = parseInt((t / (1000 * 60)) % 60)
            , hours = parseInt((t / (1000 * 60 * 60)) % 24);
        var ret = {
            h: hours,
            m: this.pad(minutes, 2),
            s: this.pad(seconds, 2),
            d: decimals,
            totalSeconds: t / 1000
        };

        ret.string = (ret.h > 0 ? ret.h + ':' : '') + ret.m + ':' + ret.s + (ret.totalSeconds < 10 ? ':' + ret.d : '');

        return ret;

    },

    pad: function (num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

});


chess.computer.ClockView = new Class({
    Extends: ludo.View,
    color: undefined,
    module: 'chess',
    submodule: 'computer.clockview',
    elo: undefined,
    pos: undefined,

    lastColor: undefined,

    __construct: function (config) {
        this.parent(config);
        this.color = config.color;
        this.pos = config.pos;
    },

    setColor: function (color) {
        this.color = color;
        this.$b().removeClass('clock-turn');
        this.lastColor = undefined;
    },

    __rendered: function () {
        this.parent();
        this.$e.addClass('dhtml-chess-clock');
        this.showTime();
    },


    setController: function (controller) {
        this.parent(controller);
        controller.clock.on('change', this.update.bind(this));
        this.elo = controller.elo;
    },

    update: function (color, timeWhite, timeBlack) {
        var val = this.color == 'white' ? timeWhite : timeBlack;
        if (color != this.lastColor) {
            this.$b().removeClass('clock-turn');
            if (color == this.color) {
                this.$b().addClass('clock-turn');
            }
        }

        this.$b().html(val.string);
        this.lastColor = color;
    },

    resize: function (size) {
        this.parent(size);

        this.getBody().css({
            'line-height': size.height + 'px',
            'font-size': (size.height * 0.6) + 'px'
        })
    },

    showTime: function (time) {
        if (time == undefined) {
            this.getBody().html('00:00');
        } else {

        }

    }
});

chess.computer.GameDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    submodule: 'chess.computer.gamedialog',
    autoRemove: false,
    layout: {
        width: 300,
        height: 300,
        type: 'table', simple: true,
        columns: [{
            weight: 1
        }, {width: 50}, {
            weight: 1
        }, {width: 50}]
    },
    css: {
        padding: 10
    },
    buttonConfig: 'Ok',

    title: chess.getPhrase('New Game'),
    elo: undefined,
    color: undefined,

    __construct: function (config) {
        this.parent(config);
        this.elo = new chess.computer.Elo();
    },
    __rendered: function () {
        this.parent();
        this.$b().addClass('dhtml-chess-comp-dialog');
        this.on('ok', this.onNewGame.bind(this));
        this.selectColor('white');

        this.child['color-white'].$b().on('click', function () {
            this.selectColor('white');
        }.bind(this));
        this.child['color-black'].$b().on('click', function () {
            this.selectColor('black');
        }.bind(this));
    },

    selectColor: function (color) {
        this.color = color;
        var cls = 'dhtml-chess-comp-dialog-selected-color';
        this.child['color-black'].$b().removeClass(cls);
        this.child['color-white'].$b().removeClass(cls);
        this.child['color-' + color].$b().addClass(cls);
    },

    __children: function () {
        return [
            {
                type: 'form.Label',
                label: chess.getPhrase('Your color:'),
                layout: {
                    colspan: 4
                }
            },
            {
                name: 'color-white',
                layout: {
                    colspan: 2,
                    height: 50
                },
                elCss: {
                    'margin': 2
                },
                css: {
                    'border-radius': '5px',
                    'background-color': '#CCC',
                    'color': '#444',
                    'cursor': 'pointer',
                    'line-height': '45px',
                    'border': '2px solid transparent',
                    'text-align': 'center'
                },
                html: chess.getPhrase('White')
            }, {
                name: 'color-black',
                layout: {
                    colspan: 2,
                    height: 50
                },
                elCss: {
                    'margin': '2px'
                },
                css: {
                    'border-radius': '5px',
                    'cursor': 'pointer',
                    'background-color': '#777',
                    'color': '#fff',
                    'line-height': '45px',
                    'border': '3px solid transparent',
                    'text-align': 'center'
                },
                html: chess.getPhrase('Black')
            },
            {
                type: 'form.Label', label: chess.getPhrase('Opponent rating:'), labelFor: 'name',
                layout: {
                    colspan: 2
                }
            },
            {
                type: 'form.Number', name: 'stockfishElo', placeholder: chess.getPhrase('ex: 1400')
            },
            {
                layout: {colspan: 1}
            },
            {
                layout: {colspan: 4, height: 20}
            },
            {
                type: 'form.Label', label: chess.getPhrase('Time'), css: {'font-size': '1.3em'},
                layout: {
                    colspan: 2
                }

            },
            {
                type: 'form.Label', label: chess.getPhrase('Increment'),
                layout: {
                    colspan: 2
                }
            },
            {
                type: 'form.Select', name: 'game-time',
                value: 5,
                dataSource: {
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 30, 45, 60, 90, 120]
                },
                listeners: {
                    'change': this.onTimeChange.bind(this)
                }
            },
            {
                html: chess.getPhrase('min'),
                css: {
                    padding: 5
                }
            },
            {
                type: 'form.Select', name: 'game-inc',
                value: 3,
                dataSource: {
                    data: [0, 1, 2, 3, 5, 10, 12, 15, 30]
                },
                listeners: {
                    'change': this.onTimeChange.bind(this)
                }
            },
            {
                html: chess.getPhrase('sec'),
                css: {
                    padding: 5
                }
            },
            {
                elCss: {
                    'margin-top': 10
                },
                css: {
                    'text-align': 'center'
                },
                name: 'your-elo',
                layout: {colspan: 4},
                html: 'Your ratings'

            }

        ]
    },

    onTimeChange: function () {
        var min = this.child['game-time'].val() / 1;
        var inc = this.child['game-inc'].val() / 1;

        var gameType = this.elo.getGameType(min * 60, inc);
        var elo = Math.round(this.elo.getElo(gameType));
        this.child['your-elo'].html('Your rating: ' + elo + ' (' + gameType + ')');


        this.child['stockfishElo'].val(elo);
    },

    setController: function (controller) {
        this.parent(controller);
        this.controller.on('newgamedialog', this.show.bind(this));
    },

    show: function () {
        this.parent();
        this.onTimeChange();
    },

    onNewGame: function () {
        this.fireEvent('newGame', {
            time: this.child['game-time'].val() / 1,
            inc: this.child['game-inc'].val() / 1,
            elo: this.child['stockfishElo'].val() / 1,
            color: this.color
        });
    }

});

chess.computer.DialogTimeButton = new Class({
    Extends: ludo.View,

    __construct: function (config) {
        this.parent(config);
        this.time = config.time;
    }
});

chess.computer.ComputerStatusDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    modal: true,
    submodule: 'chess.computer.computerstatusdialog',
    title: 'Loading Stockfish JS',
    updateFn: undefined,
    layout: {
        type: 'relative',
        width: 300, height: 100
    },
    __children: function () {
        return [
            {
                name: 'status',
                layout: {
                    width: 'matchParent',
                    centerVertical: true
                },
                css: {
                    'text-align': 'center'
                }
            }
        ]
    },

    setController: function (controller) {
        this.parent(controller);
        this.updateFn = function (status, done) {
            this.child['status'].html(status);
            if (done) {
                this.hide.delay(100, this);
            }
        }.bind(this);
        controller.on('enginestatus', this.updateFn);
    },

    remove: function () {
        if (this.updateFn) {
            this.controller.off('enginestatus', this.updateFn);
            this.updateFn = undefined;
        }
        this.parent();
    }
});


chess.computer.GameOverDialog = new Class({
    Extends: ludo.dialog.Dialog,
    module: 'chess',
    submodule: 'chess.computer.gameoverdialog',
    autoRemove: false,
    hidden: true,
    layout: {
        width: 300, height: 200,
        type: 'linear', orientation: 'vertical'
    },

    buttonBar: {
        children: [
            {
                name: 'rematch',
                value: chess.getPhrase('Rematch')
            },
            {
                value: chess.getPhrase('Exit')
            }
        ]
    },

    __children: function () {
        return [
            {
                name: 'title',
                css: {
                    'margin-top': 15,
                    'text-align': 'center',
                    'font-weight': 'bold',
                    'font-size': '1.5em',
                    'line-height': '25px'
                },
                layout: {
                    height: 50
                }
            },
            {
                css: {
                    'text-align': 'center'
                },
                name: 'rating'
            }
        ]
    },

    __rendered: function () {
        this.parent();
        this.getButton('rematch').on('click', this.onNewGameClick.bind(this));
    },

    onNewGameClick: function () {
        this.fireEvent('newgame');

    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('gameover', this.onGameOver.bind(this));
    },

    onGameOver: function (myResult, oldElo, newElo) {
        this.show();

        var title = myResult == 1 ? chess.getPhrase('You Won')
            : myResult == 0.5 ? chess.getPhrase('Game Drawn')
            : chess.getPhrase('You lost');

        this.setTitle(title);

        this.child['title'].$b().removeClass('title-win');
        this.child['title'].$b().removeClass('title-draw');
        this.child['title'].$b().removeClass('title-loss');


        this.child['title'].html(title);
        var ratingChange = newElo - oldElo;
        if (myResult == 0.5) {
            this.child['title'].$b().addClass('title-draw');
        }
        else if (myResult == 1) {
            this.child['title'].$b().addClass('title-win');
        } else {
            this.child['title'].$b().addClass('title-loss');

        }
        if (ratingChange > 1) {
            ratingChange = '<span class="rating-change-win">+' + ratingChange + '</span>';
        } else if (ratingChange == 0) {
            ratingChange = '<span class="rating-change-draw">' + ratingChange + '</span>';
        }
        else {
            ratingChange = '<span class="rating-change-loss">' + ratingChange + '</span>';
        }
        this.child['rating'].html(chess.getPhrase('New rating') + ': <span class="new-rating">' + newElo + '</span> (' + ratingChange + ')');


    }

});/* ../dhtml-chess/src/wordpress/pgn-standings.js */
chess.wordpress.PgnStandings = new Class({
    submodule: 'wordpress.pgnstandings',
    Extends: ludo.grid.Grid,
    currentPgn: undefined,
    dataSource: {
        type: 'dataSource.JSONArray',
        autoload: false,
        postData: {
            action: 'get_standings'
        }
    },
    headerMenu:false,
    sofiaRules:false,
    pgnId:undefined,
    highlightRecord:false,

    __columns:function(){
        return {
            'player': {
                heading: 'Player',
                sortable: true,
                width:200,
                key: 'player'
            },
            'w': {
                heading: 'Wins',
                sortable: true,
                width:65
            },
            'd': {
                heading: 'Draws',
                sortable: true,
                width:65
            },
            'l': {
                heading: 'Losses',
                sortable: true,
                width:65
            },
            'score': {
                heading: 'Score',
                sortable:true,
                renderer: function (val, record) {
                    if(this.sofiaRules){
                        return (record.w * 3) + record.d;
                    }
                    return record.w + (record.d / 2)
                }.bind(this)
            }
        };
    },
    
    __construct:function(config){
        this.parent(config);
        this.__params(config, ['sofiaRules','pgnId']);
    },

    __rendered: function () {
        this.parent();

        this.getDataSource().setSortFn('score', {
            'desc': function (a, b) {
                var s1 = a.w + (a.d / 2);
                var s2 = b.w + (b.d / 2);
                return s1 < s2 ? 1 : -1;
            },
            'asc': function (a, b) {
                var s1 = a.w + (a.d / 2);
                var s2 = b.w + (b.d / 2);
                return s1 < s2 ? -1 : 1;
            }
        });

        this.getDataSource().on('load', this.autoSort.bind(this));

        this.on('show', this.updateStandings.bind(this));

        if(this.pgnId){
            this.getDataSource().setPostParam('pgn', this.pgnId);
            this.getDataSource().load();
        }
    },

    setController: function (controller) {
        this.parent(controller);
        controller.on('pgn', this.setPgn.bind(this));
    },


    setPgn:function(pgn){
        if(pgn != this.currentPgn){
            this.currentPgn = pgn;
        }
        this.updateStandings();
    },

    autoSort:function(){
        this.getDataSource().by('score').descending().sort();
    },

    updateStandings: function () {
        if(!this.currentPgn)return;
        if(this.controller && this.controller.pgn && this.controller.pgn.id != this.currentPgn)return;
        this.getDataSource().setPostParam('pgn', this.currentPgn);
        this.getDataSource().load();
    }

});/* ../dhtml-chess/src/wp-public/wp-template.js */
chess.WPTemplate = new Class({
    Extends: Events,
    renderTo:undefined,
    module:undefined,

    initialize:function(config){
        this.renderTo = jQuery(config.renderTo);
        this.module = String.uniqueID();

        chess.THEME_OVERRIDES = undefined;
        
        if (config.docRoot) {
            ludo.config.setDocumentRoot(config.docRoot);
        }

        if(config.theme){
            jQuery('<link/>', {
                rel: 'stylesheet',
                type: 'text/css',
                href: ludo.config.getDocumentRoot() + '/themes/' + theme + '.css'
            });

            jQuery.ajax({
                url: ludo.config.getDocumentRoot() + '/themes/' + theme + '.js',
                dataType: "script"
            });
        }
    }


});/* ../dhtml-chess/src/wp-public/game-grid.js */
chess.WPGameGrid = new Class({
    Extends: chess.view.gamelist.Grid,
    headerMenu: false,
    dataSource: {
        'type': 'ludo.dataSource.JSONArray',
        autoload: false,
        postData: {
            action: 'list_of_games'
        }
    },
    emptyText: chess.getPhrase('No games'),
    loadMessage: chess.getPhrase('Loading games...'),
    cols: ['white', 'black', 'round', 'result', 'last_moves'],

    __construct: function (config) {
        this.cols = config.cols || this.cols;
        
        this.parent(config);
    },

    loadGames: function () {
        if (this.getDataSource().postData.pgn) {
            this.load();
        }
    },

    selectGame: function (record) {
        this.fireEvent('selectGame', [record, this.getDataSource().postData.pgn]);
    }
});/* ../dhtml-chess/src/wp-public/game/game-template.js */
window.chess.isWordPress = true;
chess.WPGameTemplate = new Class({
    Extends: chess.WPTemplate,
    initialize:function(config){
        this.parent(config);
        this.model = config.model || undefined;
        this.gameId = config.gameId;
        if(!this.model && !this.gameId)this.gameId = 2;
    },

    loadGame:function(){


        if(this.gameId){
            jQuery.ajax({
                url: ludo.config.getUrl(),
                method: 'post',
                cache: false,
                dataType: 'json',
                data: {
                    action:'game_by_id',
                    id:this.gameId
                },
                complete: function (response, status) {
                    this.controller.currentModel.afterLoad();
                    if (status == 'success') {
                        var json = response.responseJSON;
                        if (json.success) {
                            var game = json.response;
                            this.controller.currentModel.populate(game);
                        }

                    } else {
                        this.fireEvent('wperrror', chess.getPhrase('Could not load game. Try again later'));
                    }
                }.bind(this),
                fail: function (text, error) {
                    this.fireEvent(error);
                }.bind(this)

            });
        }else if(this.model){
            this.controller.currentModel.populate(this.model);

        }




    }
});/* ../dhtml-chess/src/wp-public/game/game1.js */
window.chess.isWordPress = true;
chess.WPGame1 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize:undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', Math.ceil(w - 150 + 45 + 35));
        this.renderTo.css('position', 'relative');
        this.boardSize = w - 150;
        this.render();
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center',
                        'overflow-y': 'auto',
                        'font-size': '1.2em',
                        'font-weight': 'bold'
                    }
                },

                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.boardSize
                    },

                    children: [
                        Object.merge({
                            boardLayout: undefined,
                            id: 'tactics_board',
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos: 'outside', // show labels inside board, default is 'outside'
                            layout: {
                                weight: 1,
                                height: 'wrap'
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow)
                            ]
                        }, this.board),
                        {
                            id: this.module + '-panel',
                            name: "notation-panel",
                            type: 'chess.view.notation.Table',
                            layout: {
                                width: 150
                            },
                            elCss: {
                                'margin-left': '2px'
                            },
                            module: this.module
                        }
                    ]
                },
                {
                    css:{
                        'margin-top' : 5
                    },
                    type: 'chess.view.buttonbar.Bar',
                    layout: {
                        height: 45,
                        width: this.boardSize
                    },
                    module: this.module
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module]
        });

        this.loadGame();

    }

});/* ../dhtml-chess/src/wp-public/game/game2.js */
chess.WPGame2 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', w + 275);
        this.boardSize = w;
        this.render();
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center',
                        'overflow-y': 'auto',
                        'font-size': '1.2em',
                        'font-weight': 'bold'
                    }
                },

                Object.merge({
                    boardLayout: undefined,
                    id: 'tactics_board',
                    type: 'chess.view.board.Board',
                    module: this.module,
                    overflow: 'hidden',
                    pieceLayout: 'svg3',
                    boardCss: {
                        border: 0
                    },
                    labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                    labelPos: 'outside', // show labels inside board, default is 'outside'
                    layout: {
                        weight: 1,
                        height: 'wrap'
                    },
                    plugins: [
                        Object.merge({
                            type: 'chess.view.highlight.Arrow'
                        }, this.arrow)
                    ]
                }, this.board),
                {
                    type: 'chess.view.buttonbar.Bar',
                    layout: {
                        height: 40,
                        width: this.boardSize
                    },
                    module: this.module
                },
                {
                    id: this.module + '-panel',
                    name: "notation-panel",
                    type: 'chess.view.notation.Panel',
                    layout: {
                        height: 200
                    },
                    elCss: {
                        'margin-left': '2px'
                    },
                    module: this.module

                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module]
        });

        this.loadGame();

    }

});/* ../dhtml-chess/src/wp-public/game/game3.js */
window.chess.isWordPress = true;
chess.WPGame3 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize:undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', w - 150 + 42 + 35);


        this.boardSize = w - 150;
        this.render();
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center',
                        'overflow-y': 'auto',
                        'font-size': '1.2em',
                        'font-weight': 'bold'
                    }
                },

                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.boardSize
                    },

                    children: [
                        Object.merge({
                            boardLayout: undefined,
                            id: 'tactics_board',
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos: 'outside', // show labels inside board, default is 'outside'
                            layout: {
                                weight: 1,
                                height: 'wrap'
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow)
                            ]
                        }, this.board),
                        {
                            id: this.module + '-panel',
                            name: "notation-panel",
                            type: 'chess.view.notation.Table',
                            layout: {
                                width: 150
                            },
                            elCss: {
                                'margin-left': '2px'
                            },
                            module: this.module
                        }
                    ]
                },
                {
                    layout:{
                        type:'linear',orientation:'horizontal',
                        height:40,
                        width:this.boardSize
                    },
                    css:{
                        'margin-top' : 5
                    },
                    children:[
                        {
                            weight:1
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons:['start','previous'],
                            width:85,
                            buttonSize:function(availSize){
                                return availSize;
                            }
                        },
                        {
                            type:'chess.view.notation.LastMove',
                            width:80,
                            module:this.module
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons:['next','end'],
                            width:85,
                            buttonSize:function(availSize){
                                return availSize;
                            }
                        },
                        {
                            weight:1
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons:['flip'],
                            width:42,
                            buttonSize:function(availSize){
                                return availSize * 0.9;
                            }
                        }
                    ]
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module],

            examine:false,
            stockfish:ludo.config.getDocumentRoot() + 'stockfish-js/stockfish.js'
        });

        this.loadGame();

    }

});/* ../dhtml-chess/src/wp-public/game/game4.js */
window.chess.isWordPress = true;
chess.WPGame4 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize:undefined,

    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', w + 40 + 35);
        this.boardSize = w;
        jQuery(document).ready(this.render.bind(this));
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        height: 35,
                        width: this.boardSize
                    },
                    module: this.module,
                    type: 'chess.view.metadata.Game',
                    tpl: '{white} - {black}',
                    cls: 'metadata',
                    css: {
                        'text-align': 'center',
                        'overflow-y': 'auto',
                        'font-size': '1.2em',
                        'font-weight': 'bold'
                    }
                },

                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.boardSize
                    },

                    children: [
                        Object.merge({
                            boardLayout: undefined,
                            id: 'tactics_board',
                            type: 'chess.view.board.Board',
                            module: this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos: 'outside', // show labels inside board, default is 'outside'
                            layout: {
                                weight: 1,
                                height: 'wrap'
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow)
                            ]
                        }, this.board)
                    ]
                },
                {
                    layout:{
                        type:'linear',orientation:'horizontal',
                        height:40,
                        width:this.boardSize
                    },
                    css:{
                        'margin-top' : 5
                    },
                    children:[
                        {
                            weight:1
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons:['start','previous'],
                            width:85,
                            buttonSize:function(availSize){
                                return availSize;
                            }
                        },
                        {
                            type:'chess.view.notation.LastMove',
                            width:80,
                            module:this.module
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons:['next','end'],
                            width:85,
                            buttonSize:function(availSize){
                                return availSize;
                            }
                        },
                        {
                            weight:1
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            module: this.module,
                            buttons:['flip'],
                            width:42,
                            buttonSize:function(availSize){
                                return availSize;
                            }
                        }
                    ]
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module]
        });
        this.loadGame();
    }

});/* ../dhtml-chess/src/wp-public/game/game5.js */
window.chess.isWordPress = true;
chess.WPGame5 = new Class({
    Extends: chess.WPGameTemplate,
    boardSize: undefined,
    buttonSize: 45,

    boardWeight: 1,
    notationWeight: 0.6,

    initialize: function (config) {
        this.parent(config);


        var w = this.renderTo.width();

        if (ludo.isMobile) {
            this.notationWeight = 0;
        }

        this.boardSize = (w / (this.boardWeight + this.notationWeight));

        this.renderTo.css('height', this.boardSize + this.buttonSize);
        this.renderTo.css('position', 'relative');

        this.configure();
        this.render();
    },

    configure: function () {


        this.board = Object.merge({
            boardLayout: undefined,
            vAlign: top,
            id: 'tactics_board',
            type: 'chess.view.board.Board',
            module: this.module,
            overflow: 'hidden',
            pieceLayout: 'svg_bw',
            background: {
                borderRadius: 0
            },
            boardCss: {
                border: 0
            },
            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
            labelPos: 'outside', // show labels inside board, default is 'outside'
            layout: {
                weight: this.boardWeight,
                height: 'wrap'
            },
            plugins: [
                Object.merge({
                    type: 'chess.view.highlight.Arrow'
                }, this.arrow)
            ]
        }, this.board);

        chess.THEME_OVERRIDES = {

            'chess.view.board.Board': {
                background: {
                    borderRadius: '1%'
                }
            },
            'chess.view.buttonbar.Bar': {
                borderRadius: '10%',
                styles: {
                    button: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                    },
                    image: {
                        fill: '#777'
                    },
                    buttonOver: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                    },
                    imageOver: {
                        fill: '#555'
                    },
                    buttonDown: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                    },
                    imageDown: {
                        fill: '#444'
                    },
                    buttonDisabled: {
                        'fill-opacity': 0,
                        'stroke-opacity': 0
                        // , 'fill-opacity': 0.3
                    },
                    imageDisabled: {
                        fill: '#555',
                        'fill-opacity': 0.3
                    }
                }
            }

        };
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),

            layout: {
                type: 'linear', orientation: 'vertical',
                height: 'matchParent',
                width: 'matchParent'
            },

            children: [
                {
                    layout: {
                        height: this.boardSize,
                        type: 'linear',
                        orientation: 'horizontal'
                    },

                    children: ludo.isMobile ? [this.board] : [

                        this.board,
                        {
                            id: this.module + '-panel',
                            name: "notation-panel",
                            type: 'chess.view.notation.Panel',
                            layout: {
                                weight: this.notationWeight,
                                height: 'matchParent'
                            },
                            elCss: {
                                'margin-left': '2px'
                            },
                            module: this.module
                        }
                    ]
                },

                {
                    layout: {
                        type: 'linear', orientation: 'horizontal',
                        height: this.buttonSize
                    },
                    elCss: {
                        'margin-top': 10
                    },
                    children: ludo.isMobile ? [
                        {weight: 1},
                        {
                            anchor: [0.5, 0.5],
                            type: 'chess.view.buttonbar.Bar',
                            buttons: ['flip', 'start', 'previous'],
                            module: this.module,
                            layout: {
                                width: (this.buttonSize) * 3
                            },
                            buttonSize: function (ofSize) {
                                return ofSize * 0.9;
                            }
                        },
                        {
                            type: 'chess.view.notation.LastMove',
                            module: this.module,
                            layout: {

                                width: this.buttonSize * 2

                            },
                            css: {
                                border: 'none'
                            }
                        },
                        {
                            anchor: [0.5, 0.5],
                            type: 'chess.view.buttonbar.Bar',
                            buttons: ['next', 'end'],
                            module: this.module,
                            layout: {
                                width: (this.buttonSize) * 2
                            },
                            buttonSize: function (ofSize) {
                                return ofSize * 0.9;
                            }
                        },
                        {weight: 1}

                    ]

                        :
                        [
                            {
                                weight: 1
                            },
                            {
                                anchor: [1, 0.5],
                                type: 'chess.view.buttonbar.Bar',
                                buttons: ['flip', 'start', 'previous', 'next', 'end'],
                                module: this.module,
                                layout: {
                                    width: (this.buttonSize - 10) * 5
                                },
                                buttonSize: function (ofSize) {
                                    return ofSize * 0.9;
                                }
                            }

                        ]
                }

            ]


        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module]
        });

        this.loadGame();

    }

});/* ../dhtml-chess/src/wp-public/pgn/viewer1.js */
/**
 * Usage:
 *
 * new chess.FileTactics({
            renderTo:'chessContainer',
            pgn:'sample'
    })
 *
 * where "chessContainer" is id of an html element and "sample" is the name
 * of a pgn file inside the pgn folder(sample.pgn)
 * @type {Class}
 */

window.chess.isWordPress = true;

chess.WPViewer1 = new Class({
    Extends: chess.WPTemplate,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels: undefined,

    module: undefined,

    boardSize: undefined,

    initialize: function (config) {
        this.parent(config);
        this.renderTo = config.renderTo;
        var r = jQuery(this.renderTo);
        var w = r.width();
        this.boardSize = w - 150;

        r.css('height', Math.round(this.boardSize + 375));
        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};

        this.showLabels = !ludo.isMobile;
        this.render();
    },

    render: function () {

        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },

                    children: [
                        {
                            layout:{
                                height:35,
                                width:this.boardSize
                            },
                            module: this.module,
                            type: 'chess.view.metadata.Game',
                            tpl: '{white} - {black}',
                            cls: 'metadata',
                            css: {
                                'text-align': 'center',
                                'overflow-y': 'auto',
                                'font-size': '1.2em',
                                'font-weight': 'bold'
                            }
                        },

                        {
                            layout: {
                                type: 'linear', orientation: 'horizontal',
                                height: this.boardSize
                            },

                            children: [
                                Object.merge({
                                    boardLayout: undefined,
                                    id: 'tactics_board',
                                    type: 'chess.view.board.Board',
                                    module: this.module,
                                    overflow: 'hidden',
                                    pieceLayout: 'svg3',
                                    boardCss: {
                                        border: 0
                                    },
                                    labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                                    labelPos: 'outside', // show labels inside board, default is 'outside'
                                    layout: {
                                        weight: 1,
                                        height: 'wrap'
                                    },
                                    plugins: [
                                        Object.merge({
                                            type: 'chess.view.highlight.Arrow'
                                        }, this.arrow)
                                    ]
                                }, this.board),
                                {
                                    id: this.module + '-panel',
                                    name: "notation-panel",
                                    type: 'chess.view.notation.Table',
                                    layout: {
                                        width: 150
                                    },
                                    elCss:{
                                        'margin-left' : '2px'
                                    },
                                    module: this.module
                                }
                            ]
                        },
                        {
                            type: 'chess.view.buttonbar.Bar',
                            layout: {
                                height: 40,
                                width:this.boardSize
                            },
                            module: this.module
                        },
                        {
                            title: this.pgn.name,
                            module: this.module,
                            layout: {
                                height: 300
                            },
                            type: 'chess.WPGameGrid',
                            css: {
                                'overflow-y': 'auto'
                            },
                            cols: ['white', 'black', 'result'],
                            dataSource: {
                                id: 'gameList',
                                "type": 'chess.wordpress.GameList',
                                module: this.module,
                                autoload: true,
                                postData: {
                                    pgn: this.pgn.id
                                },
                                "listeners": {
                                    "select": function () {
                                        ludo.$(this.module + '-panel').show();
                                    }.bind(this),
                                    "load": function (data) {
                                        if (data.length) {
                                            ludo.get('gameList').selectRecord(data[0]);
                                        }
                                    }
                                },
                                shim: {
                                    txt: ''
                                }
                            }
                        }

                    ]
                }
            ]
        });

        this.controller = new chess.controller.Controller({
            applyTo: [this.module],
            pgn: this.pgn.id,
            listeners: {}
        });
    }
});/* ../dhtml-chess/src/wp-public/pgn/viewer2.js */
/**
 * Usage:
 *
 * new chess.FileTactics({
            renderTo:'chessContainer',
            pgn:'sample'
    })
 *
 * where "chessContainer" is id of an html element and "sample" is the name
 * of a pgn file inside the pgn folder(sample.pgn)
 * @type {Class}
 */

window.chess.isWordPress = true;

chess.WPViewer2 = new Class({
    Extends: chess.WPTemplate,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels: undefined,

    module: undefined,

    boardSize: undefined,

    initialize: function (config) {
        this.parent(config);
        this.renderTo = config.renderTo;
        var r = jQuery(this.renderTo);
        var w = r.width();
        this.boardSize = w - (ludo.isMobile ? 0 : 150);

        r.css('height', Math.round(this.boardSize + 375));
        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};

        this.showLabels = !ludo.isMobile;

        this.gameListDsId = 'gamelist' + String.uniqueID();
        this.standingsId = 'standingsId' + String.uniqueID();
        this.render();
    },

    render: function () {

        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },

                    children: ludo.isMobile ? this.mobileChildren() : this.desktopChildren()
                }
            ]
        });





        this.controller = new chess.controller.Controller({
            applyTo: [this.module],
            pgn: this.pgn.id,
            listeners: {}
        });
    },

    desktopChildren:function(){
        return [
            {
                layout: {
                    height: 35,
                    width: this.boardSize
                },
                module: this.module,
                type: 'chess.view.metadata.Game',
                tpl: '{white} - {black}',
                cls: 'metadata',
                css: {
                    'text-align': 'center',
                    'overflow-y': 'auto',
                    'font-size': '1.2em',
                    'font-weight': 'bold'
                }
            },

            {
                layout: {
                    type: 'linear', orientation: 'horizontal',
                    height: this.boardSize
                },

                children: [
                    Object.merge({
                        boardLayout: undefined,
                        id: 'tactics_board',
                        type: 'chess.view.board.Board',
                        module: this.module,
                        overflow: 'hidden',
                        pieceLayout: 'svg3',
                        boardCss: {
                            border: 0
                        },
                        labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                        labelPos: 'outside', // show labels inside board, default is 'outside'
                        layout: {
                            weight: 1,
                            height: 'wrap'
                        },
                        plugins: [
                            Object.merge({
                                type: 'chess.view.highlight.Arrow'
                            }, this.arrow)
                        ]
                    }, this.board),
                    {
                        id: this.module + '-panel',
                        name: "notation-panel",
                        type: 'chess.view.notation.Table',
                        layout: {
                            width: 150
                        },
                        elCss: {
                            'margin-left': '2px'
                        },
                        module: this.module
                    }
                ]
            },
            {
                type: 'chess.view.buttonbar.Bar',
                layout: {
                    height: 40,
                    width: this.boardSize
                },
                module: this.module,
                buttonSize: function (ofSize) {
                    return ofSize * 0.9;
                }
            },
            {
                height: 300,
                layout: {
                    type: 'tabs'
                },
                cls: 'ludo-light-gray',
                css: {
                    border: '1px solid #aeb0b0'
                },
                children: [

                    {
                        layout: {
                            type: 'linear', orientation: 'vertical'
                        },
                        title: chess.getPhrase('Games'),
                        children: [

                            {
                                module: this.module,
                                layout: {
                                    weight: 1
                                },
                                type: 'chess.WPGameGrid',
                                css: {
                                    'overflow-y': 'auto'
                                },
                                cols: ['round', 'white', 'black', 'result'],
                                dataSource: {
                                    id: this.gameListDsId,
                                    "type": 'chess.wordpress.GameList',
                                    module: this.module,
                                    autoload: true,
                                    postData: {
                                        pgn: this.pgn.id
                                    },
                                    "listeners": {
                                        "select": function () {
                                            ludo.$(this.module + '-panel').show();
                                        }.bind(this),
                                        "load": function (data) {
                                            if (data.length) {
                                                ludo.$(this.gameListDsId).selectRecord(data[0]);
                                            }
                                        }.bind(this)
                                    },
                                    shim: {
                                        txt: ''
                                    }
                                }
                            },
                            {
                                type: 'form.Text',
                                placeholder: chess.getPhrase('Search'),
                                css:{
                                    'border-top' : '1px solid #aeb0b0'
                                },
                                layout: {
                                    height: 30
                                },
                                listeners: {
                                    key: function (value) {
                                        this.search(value);
                                    }.bind(this)
                                }
                            }
                        ]
                    },

                    {

                        id: this.standingsId,
                        type: 'chess.wordpress.PgnStandings',
                        module: this.module,
                        pgnId: this.pgn.id,
                        layout: {
                            weight: 1
                        },
                        title: chess.getPhrase('Standings')
                    }


                ]

            }


        ];
    },

    mobileChildren:function(){
        return [
            {
                layout: {
                    height: 35,
                    width: this.boardSize
                },
                module: this.module,
                type: 'chess.view.metadata.Game',
                tpl: '{white} - {black}',
                cls: 'metadata',
                css: {
                    'text-align': 'center',
                    'overflow-y': 'auto',
                    'font-size': '1.2em',
                    'font-weight': 'bold'
                }
            },

            Object.merge({
                boardLayout: undefined,
                id: 'tactics_board',
                type: 'chess.view.board.Board',
                module: this.module,
                overflow: 'hidden',
                pieceLayout: 'svg3',
                boardCss: {
                    border: 0
                },
                labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                labelPos: 'outside', // show labels inside board, default is 'outside'
                layout: {
                    weight: 1,
                    height: 'wrap'
                },
                plugins: [
                    Object.merge({
                        type: 'chess.view.highlight.Arrow'
                    }, this.arrow)
                ]
            }, this.board),
            {
                layout:{
                    height:40,type:'linear',orientation:'horizontal'
                },
                children:[
                    { weight:1 },
                    {
                        type: 'chess.view.buttonbar.Bar',
                        layout: {
                            height: 40,
                            width: 90
                        },
                        module: this.module,
                        buttons:['start','previous'],
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {
                        type:'chess.view.notation.LastMove',
                        module: this.module,
                        layout:{
                            width:70
                        },
                        css:{
                            'padding-top' : 4, 'padding-bottom' : 4, border:'none'
                        }
                    },
                    {
                        type: 'chess.view.buttonbar.Bar',
                        layout: {
                            height: 40,
                            width: 90
                        },
                        module: this.module,
                        buttons:['next','end'],
                        buttonSize: function (ofSize) {
                            return ofSize * 0.9;
                        }
                    },
                    {
                        weight:1
                    }

                ]
            },
            {
                height: 300,
                layout: {
                    type: 'tabs'
                },
                cls: 'ludo-light-gray',
                css: {
                    border: '1px solid #aeb0b0'
                },
                children: [

                    {
                        layout: {
                            type: 'linear', orientation: 'vertical'
                        },
                        title: chess.getPhrase('Games'),
                        children: [

                            {
                                module: this.module,
                                layout: {
                                    weight: 1
                                },
                                type: 'chess.WPGameGrid',
                                css: {
                                    'overflow-y': 'auto'
                                },
                                keys:['white','black', 'result'],
                                dataSource: {
                                    id: this.gameListDsId,
                                    "type": 'chess.wordpress.GameList',
                                    module: this.module,
                                    autoload: true,
                                    postData: {
                                        pgn: this.pgn.id
                                    },
                                    "listeners": {
                                        "load": function (data) {
                                            if (data.length) {
                                                ludo.$(this.gameListDsId).selectRecord(data[0]);
                                            }
                                        }.bind(this)
                                    },
                                    shim: {
                                        txt: ''
                                    }
                                }
                            },
                            {
                                type: 'form.Text',
                                placeholder: chess.getPhrase('Search'),
                                css:{
                                    'border-top' : '1px solid #aeb0b0'
                                },
                                layout: {
                                    height: 30
                                },
                                listeners: {
                                    key: function (value) {
                                        this.search(value);
                                    }.bind(this)
                                }
                            }
                        ]
                    },

                    {

                        id: this.standingsId,
                        type: 'chess.wordpress.PgnStandings',
                        module: this.module,
                        pgnId: this.pgn.id,
                        keys:['player', 'score'],
                        layout: {
                            weight: 1
                        },
                        title: chess.getPhrase('Standings')
                    }


                ]

            }


        ];
    },

    search: function (val) {

        ludo.$(this.gameListDsId).search(val);
    }
});/* ../dhtml-chess/src/wp-public/fen/board.js */
chess.WPFen = new Class({
    Extends: chess.WPTemplate,
    fen: undefined,
    initialize: function (config) {
        this.parent(config);
        var w = this.renderTo.width();
        this.renderTo.css('height', w);
        this.fen = config.fen;
        this.render();
    },

    render: function () {
        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill'
            },
            children: [
                {
                    type: 'chess.view.board.Board',
                    fen: this.fen,
                    layout: {width: 'matchParent', 'height': 'matchParent'}
                }
            ]
        });
    }

});/* ../dhtml-chess/src/wp-public/tactics/tactics1.js */
/**
 * Usage:
 *
 * new chess.FileTactics({
            renderTo:'chessContainer',
            pgn:'sample'
    })
 *
 * where "chessContainer" is id of an html element and "sample" is the name
 * of a pgn file inside the pgn folder(sample.pgn)
 * @type {Class}
 */

window.chess.isWordPress = true;

chess.WPTactics1 = new Class({
    Extends: chess.WPTemplate,

    renderTo: undefined,
    pgn: undefined,

    controller: undefined,

    showLabels:undefined,

    module:undefined,

    boardSize:undefined,

    initialize: function (config) {

        this.parent(config);

        this.renderTo = config.renderTo;
        var r = jQuery(this.renderTo);
        var w = r.width();
        r.css('height', Math.round(w + 130));
        this.boardSize = w;

        this.pgn = config.pgn;
        this.board = config.board || {};
        this.arrow = config.arrow || {};
        this.arrowSolution = config.arrowSolution || {};
        this.hint = config.hint || {};
        this.module = String.uniqueID();

        this.showLabels = !ludo.isMobile;
        if (this.renderTo.substr && this.renderTo.substr(0, 1) != "#")this.renderTo = "#" + this.renderTo;
        jQuery(document).ready(this.render.bind(this));
    },

    render: function () {

        new chess.view.Chess({
            renderTo: jQuery(this.renderTo),
            layout: {
                type: 'fill',
                height: 'matchParent',
                width: 'matchParent'
            },
            children: [
                {
                    layout: {
                        type: 'linear', orientation: 'vertical'
                    },


                    children: [
                        {
                            height: 35,
                            module:this.module,
                            type: 'chess.view.metadata.Game',
                            tpl: '#{index} - {white}',
                            cls:'metadata',
                            css: {
                                'text-align': 'center',
                                'overflow-y': 'auto',
                                'font-size': '1.2em',
                                'font-weight': 'bold'
                            }
                        },

                        {
                            layout: {
                                type: 'linear',
                                orientation: 'horizontal'
                            },
                            css: {
                                'margin-top': 2
                            },

                            height: 30,
                            children: [
                                {
                                    weight: 1
                                },
                                {
                                    module:this.module,
                                    layout: {width: 80},
                                    type: 'chess.view.button.TacticHint',
                                    value: chess.getPhrase('Hint')
                                },
                                {
                                    module:this.module,
                                    layout: {width: 80},
                                    type: 'chess.view.button.TacticSolution',
                                    value: chess.getPhrase('Solution')
                                }, {
                                    module:this.module,
                                    layout: {width: 80},
                                    type: 'form.Button',
                                    value: chess.getPhrase('Next Game'),
                                    listeners: {
                                        click: function () {
                                            this.controller.loadNextGameFromFile();
                                        }.bind(this)
                                    }
                                },
                                {
                                    weight: 1
                                }
                            ]
                        },
                        Object.merge({
                            boardLayout:undefined,
                            id:'tactics_board',
                            type: 'chess.view.board.Board',
                            module:this.module,
                            overflow: 'hidden',
                            pieceLayout: 'svg3',
                            boardCss: {
                                border: 0
                            },
                            labels: !ludo.isMobile, // show labels for ranks, A-H, 1-8
                            labelPos:'outside', // show labels inside board, default is 'outside'
                            layout:{
                                height:this.boardSize,
                            },
                            plugins: [
                                Object.merge({
                                    type: 'chess.view.highlight.Arrow'
                                }, this.arrow),
                                Object.merge({
                                    type: 'chess.view.highlight.ArrowTactic'
                                }, this.arrowSolution),
                                Object.merge({
                                    type: 'chess.view.highlight.SquareTacticHint'
                                },this.hint)
                            ]
                        }, this.board),
                        {
                            height: 50,
                            module:this.module,
                            comments: false,
                            figurines:'svg_egg', // Figurines always starts with svg - it is the prefix of images inside the dhtmlchess/images folder
                            type: 'chess.view.notation.TacticPanel'
                        }
                    ]
                }
            ]
        });

        var storageKey = 'wp_' + this.pgn.id + '_tactics';

        this.controller = new chess.controller.TacticControllerGui({
            applyTo:[this.module],
            pgn: this.pgn.id,
            alwaysPlayStartingColor: true,
            autoMoveDelay: 400,
            gameEndHandler: function (controller) {
                controller.loadNextGameFromFile();
            },
            listeners: {
                'startOfGame': function () {
                    ludo.getLocalStorage().save(storageKey, this.controller.getCurrentModel().getGameIndex());
                }.bind(this)
            }
        });

        var index = ludo.getLocalStorage().get(storageKey);
        index = Math.max(0,index);
        if (index != undefined) {
            this.controller.getCurrentModel().setGameIndex(index);
        } else {
            index = 0;
        }

        this.controller.loadGameFromFile(index);
    }

});