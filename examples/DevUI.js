
require.bundle("", function(require)
{
	require.memoize("/main.js", function(require, exports, module)
	{
		var Q = require("./lib/q");

		function JQUERY(callback)
		{
			// NOTE: We cache the instace so that `instance.noConflict();` only gets called once.
			var instance = null;
			if (instance) {
				callback(instance);
				return;
			}
			require.async("./lib", function(LIB)
			{
				instance = LIB.JQUERY;
				instance.noConflict();
				callback(instance);
			});
		}

		// TODO: Use `require("../tests/examples").main()` here with a different logger.

		function logToOutput(moduleObj, arguments)
		{
			var args = [],
				i;
			for (i in arguments) {
				args.push(arguments[i]);
			}
			JQUERY(function($) {
				$("#output").append([
					"<div><div class=\"from\">",
					moduleObj.require.sandbox.id + " : " + moduleObj.id,
					"</div><div class=\"message\">",
					args.join(", "),
					"</div></div>"
				].join(""));
			});
		}
		
		function logError()
		{
			console.error.apply(null, ["[DevUI]"].concat(arguments));
		}

		exports.main = function(options)
		{
		    options = options || {};
		    if (typeof options.debug === "undefined")
		    {
		        options.debug = true;
		    }

		    Q.when(Q.all([
          		"01-HelloWorld",
        		"02-ReturnExports",
        		"03-SpecifyMain",
        		"04-PackageLocalDependencies",
        		"05-CrossPackageDependencies",
        		"06-JsonModule",
        		"07-TextModule",
        		"08-ResourceURI",
        		"09-LoadBundle",
        		"10-Sandbox",
        		"11-CrossDomain",
        		"12-Environment",
        		"13-AssignExports",
        		"NamedBundle",
        		"Avoid-NestedBundles",
        		"Avoid-SplitBundles"
			].map(function(name)
			{
				var result = Q.defer();

				require.sandbox("../" + name + ".js", function(sandbox)
				{
					try {
						Q.when(sandbox.main(options), result.resolve, result.reject);
					} catch(e) {
						result.reject(e);
					}
				}, {
					onInitModule: function(moduleInterface, moduleObj)
					{
						moduleObj.require.API = {
							Q: Q,
							JQUERY: JQUERY
						};
						moduleInterface.log = function()
						{
							logToOutput(moduleObj, arguments);
						};
						moduleInterface.logForModule = function(moduleObj, arguments)
						{
							logToOutput(moduleObj, arguments);
						};
					}
				});

				return result.promise;
		    })), function()
			{
				JQUERY(function($) {
					$("#output").addClass("success");
					require.async("./lib", function(LIB)
					{
						$("#report").html(LIB.JSDUMP.parse(sourcemint.getReport()));
					});
				});
			}, function(e)
			{
				logError(e);
				JQUERY(function($) {
					$("#output").addClass("fail");
					$("#error-alert").show();
				});
			});


			JQUERY(function($) {
				$.get("../../loader.min.js", function(data) {
					$("#loader-min").html(data);
				}, "text");
				$.get("loader.min.js-size", function(data) {
					$("#loader-min-size").html(data);
				}, "text");
                $.get("loader.min.js.gz-size", function(data) {
                    $("#loader-min-gz-size").html(data);
                }, "text");
                $.get("loader.crush.js-size", function(data) {
                    $("#loader-crush-size").html(data);
                }, "text");
                $.get("loader.crush.js.gz-size", function(data) {
                    $("#loader-crush-gz-size").html(data);
                }, "text");
			});
		}
	});


	// @credit https://github.com/kriskowal/q
	require.memoize("/lib/q.js", function(require, exports, module)
	{
	    (function(n){"function"===typeof define?define(n):"object"===typeof exports?n(require,exports):n(void 0,Q={})})(function(n,d){function y(a){return a}function h(){var a=[],b,c=o(h.prototype),f=o(e.prototype);f.promiseSend=function(){var c=i.call(arguments);a?a.push(c):k(function(){b.promiseSend.apply(b,c)})};f.valueOf=function(){return a?f:b.valueOf()};var d=function(c){if(a)return b=l(c),s.call(a,function(a,c){k(function(){b.promiseSend.apply(b,c)})},void 0),a=void 0,b};c.promise=u(f);c.resolve=d;
	    c.reject=function(a){return d(j(a))};return c}function e(a,b,c){void 0===b&&(b=function(a){return j("Promise does not support operation: "+a)});var f=o(e.prototype);f.promiseSend=function(c,f){var d=i.call(arguments,2),t;try{t=a[c]?a[c].apply(a,d):b.apply(a,[c].concat(d))}catch(e){t=j(e)}return(f||y)(t)};if(c)f.valueOf=c;return u(f)}function r(a){return a&&"function"===typeof a.promiseSend}function z(a){a=p(a);return void 0===a||null===a?!1:!!a.promiseRejected}function j(a){return e({when:function(b){return b?
	    b(a):j(a)}},function(){return j(a)},function(){var b=o(j.prototype);b.promiseRejected=!0;b.reason=a;return b})}function l(a){if(r(a))return a;if(a&&"function"===typeof a.then){var b=h();a.then(b.resolve,b.reject);return b.promise}return e({when:function(){return a},get:function(b){return a[b]},put:function(b,f){return a[b]=f},del:function(b){return delete a[b]},post:function(b,f){return a[b].apply(a,f)},apply:function(b,f){return a.apply(b,f)},viewInfo:function(){for(var b=a,f={};b;)Object.getOwnPropertyNames(b).forEach(function(a){f[a]||
	    (f[a]=typeof b[a])}),b=Object.getPrototypeOf(b);return{type:typeof a,properties:f}},keys:function(){return F(a)}},void 0,function(){return a})}function A(a,b){a=l(a);return b?e({viewInfo:function(){return b}},function(b){var f=i.call(arguments);return q.apply(void 0,[a].concat(f))},function(){return p(a)}):q(a,"viewInfo")}function g(a,b,c){function f(a){try{return b?b(a):a}catch(c){return j(c)}}function d(a){try{return c?c(a):j(a)}catch(b){return j(b)}}var e=h(),g=!1;k(function(){l(a).promiseSend("when",
	    function(a){g||(g=!0,e.resolve(l(a).promiseSend("when",f,d)))},function(a){g||(g=!0,e.resolve(d(a)))})});return e.promise}function m(a){return function(b){var c=i.call(arguments,1);return q.apply(void 0,[b,a].concat(c))}}function q(a,b){var c=h(),d=i.call(arguments,2),a=l(a);k(function(){a.promiseSend.apply(a,[b,c.resolve].concat(d))});return c.promise}function B(a){if(1<arguments.length)var b=Array.prototype.slice.call(arguments,1),a=a.bind.apply(a,b);return function(){var b=h(),d=i.call(arguments);
	    d.push(b.node());v(a,this,d).fail(b.reject);return b.promise}}var k;try{k=n("event-queue").enqueue}catch(G){if("undefined"!==typeof MessageChannel){var C=new MessageChannel,w={},D=w;C.port1.onmessage=function(){var a=w.next,b=a.task;w=a;b()};k=function(a){D=D.next={task:a};C.port2.postMessage(0)}}else k=function(a){setTimeout(a,0)}}var x=function(a,b,c){a[b]||(a[b]=c);return a[b]},u=x(Object,"freeze",y),o=x(Object,"create",function(a){var b=function(){};b.prototype=a;return new b}),F=x(Object,"keys",
	    function(a){var b=[],c;for(c in a)b.push(c);return b}),s=Array.prototype.reduce||function(a,b){var c=0,d=this.length;if(1==arguments.length){do{if(c in this){b=this[c++];break}if(++c>=d)throw new TypeError;}while(1)}for(;c<d;c++)c in this&&(b=a(b,this[c],c));return b},i=Array.prototype.slice,p=function(a){return void 0===a||null===a?a:a.valueOf()};d.nextTick=k;d.defer=h;h.prototype.node=function(){var a=this;return function(b,c){b?a.reject(b):2<arguments.length?a.resolve(Array.prototype.slice.call(arguments,
	    1)):a.resolve(c)}};d.makePromise=e;e.prototype.then=function(a,b){return g(this,a,b)};s.call("when,spread,send,get,put,del,post,invoke,keys,apply,call,all,wait,join,fail,fin,view,viewInfo,timeout,delay,end".split(","),function(a,b){e.prototype[b]=function(){return d[b].apply(d,[this].concat(i.call(arguments)))}},void 0);e.prototype.toSource=function(){return this.toString()};e.prototype.toString=function(){return"[object Promise]"};u(e.prototype);d.isPromise=r;d.isResolved=function(a){return!r(p(a))};
	    d.isFulfilled=function(a){return!r(p(a))&&!z(a)};d.isRejected=z;d.reject=j;j.prototype=o(e.prototype,{constructor:{value:j}});d.ref=l;d.master=function(a){return e({isDef:function(){}},function(b){var c=i.call(arguments);return q.apply(void 0,[a].concat(c))},function(){return p(a)})};d.viewInfo=A;d.view=function(a){return A(a).when(function(b){var c;c="function"===b.type?function(){return v(a,void 0,arguments)}:{};var d=b.properties||{};Object.keys(d).forEach(function(b){"function"===d[b]&&(c[b]=
	    function(){return E(a,b,arguments)})});return l(c)})};d.when=g;d.spread=function(a,b,c){return g(a,function(a){return b.apply(void 0,a)},c)};d.async=function(a){return function(){var b=function(a,b){var i;try{i=c[a](b)}catch(h){return"[object StopIteration]"===Object.prototype.toString.call(h)?h.value:j(h)}return g(i,d,e)},c=a.apply(this,arguments),d=b.bind(b,"send"),e=b.bind(b,"throw");return d()}};d.Method=m;d.send=q;d.get=m("get");d.put=m("put");d.del=m("del");var E=d.post=m("post");d.invoke=function(a,
	    b){var c=i.call(arguments,2);return E(a,b,c)};var v=d.apply=m("apply");d.call=function(a,b){var c=i.call(arguments,2);return v(a,b,c)};d.keys=m("keys");d.all=function(a){return g(a,function(a){var c=a.length;if(0===c)return l(a);var d=h();s.call(a,function(e,h,i){g(h,function(e){a[i]=e;0===--c&&d.resolve(a)}).fail(d.reject)},void 0);return d.promise})};d.fail=function(a,b){return g(a,void 0,b)};d.fin=function(a,b){return g(a,function(a){return g(b(),function(){return a})},function(a){return g(b(),
	    function(){return j(a)})})};d.end=function(a){g(a,void 0,function(a){k(function(){throw a;})})};d.timeout=function(a,b){var c=h();g(a,c.resolve,c.reject);setTimeout(function(){c.reject("Timed out")},b);return c.promise};d.delay=function(a,b){void 0===b&&(b=a,a=void 0);var c=h();setTimeout(function(){c.resolve(a)},b);return c.promise};d.node=B;d.ncall=function(a,b){var c=i.call(arguments,2);return B(a).apply(b,c)}});
	});

});
