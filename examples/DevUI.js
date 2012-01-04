
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
					moduleInterface.id,
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

		exports.main = function()
		{
		    Q.when(Q.all([
				"01-HelloWorld",
				"02-ReturnExports",
				"03-SpecifyMain",
				"04-PackageLocalDependencies",
				"05-CrossPackageDependencies",
				"07-JsonModule",
				"08-TextModule",
				"09-ResourceURI",
				"10-NamedBundle",
				"11-LoadBundle",
				"12-Sandbox",
				"13-CrossDomain",
				"Avoid-NestedBundles",
				"Avoid-SplitBundles"
			].map(function(name) {
				var result = Q.defer();

				require.sandbox("../../examples/" + name + ".js", function(sandbox)
				{
					try {
						Q.when(sandbox.main(), result.resolve, result.reject);
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

				$.get("loader.min.js.gz-size", function(data) {
					$("#loader-min-size").html(data);
				}, "text");
			});
		}
	});


	// @credit https://github.com/kriskowal/q
	require.memoize("/lib/q.js", function(require, exports, module)
	{
		(function(k,c){typeof define==="function"?define(function(c,e,q){k(c,e,q)}):typeof exports==="object"?k(require,exports,module):Q=k(c,{},{})})(function(k,c,G,e){function q(a){return a}function n(){var a=[],b,d=r(f.prototype);d.promiseSend=function(){var d=j.call(arguments);a?a.push(d):l(function(){b.promiseSend.apply(b,d)})};d.valueOf=function(){return a?d:b.valueOf()};var c=function(d){if(a)return b=h(d),t.call(a,function(a,d){l(function(){b.promiseSend.apply(b,d)})},e),a=e,b};return{promise:u(d),
		resolve:c,reject:function(a){return c(i(a))}}}function f(a,b,d){b===e&&(b=function(a){return i("Promise does not support operation: "+a)});var c=r(f.prototype);c.promiseSend=function(d,c){var x=j.call(arguments,2),e;try{e=a[d]?a[d].apply(a,x):b.apply(a,[d].concat(x))}catch(f){e=i(f)}return(c||q)(e)};if(d)c.valueOf=d;return u(c)}function s(a){return a&&typeof a.promiseSend==="function"}function y(a){a=o(a);return a===e||a===z?!1:!!a.promiseRejected}function i(a){return f({when:function(b){return b?
		b(a):i(a)}},function(){return i(a)},function(){var b=r(i.prototype);b.promiseRejected=!0;b.reason=a;return b})}function h(a){return s(a)?a:a&&typeof a.then==="function"?f({},function(b){return b!=="when"?g(a,function(a){return h(a).promiseSend.apply(e,arguments)}):(b=n(),a.then(b.resolve,b.reject),b.promise)}):f({when:function(){return a},get:function(b){return a[b]},put:function(b,d){return a[b]=d},del:function(b){return delete a[b]},post:function(b,d){return a[b].apply(a,d)},apply:function(b,d){return a.apply(b,
		d)},viewInfo:function(){for(var b=a,d={};b;)Object.getOwnPropertyNames(b).forEach(function(a){d[a]||(d[a]=typeof b[a])}),b=Object.getPrototypeOf(b);return{type:typeof a,properties:d}},keys:function(){return H(a)}},e,function(){return a})}function A(a,b){a=h(a);return b?f({viewInfo:function(){return b}},function(b){var c=j.call(arguments);return p.apply(e,[a].concat(c))},function(){return o(a)}):p(a,"viewInfo")}function g(a,b,d){function c(a){try{return b?b(a):a}catch(d){return i(d)}}function e(a){try{return d?
		d(a):i(a)}catch(b){return i(b)}}var f=n(),g=!1;l(function(){h(a).promiseSend("when",function(a){g||(g=!0,f.resolve(h(a).promiseSend("when",c,e)))},function(a){g||(g=!0,f.resolve(e(a)))})});return f.promise}function m(a){return function(b){var d=j.call(arguments,1);return p.apply(e,[b,a].concat(d))}}function p(a,b){var d=n(),c=j.call(arguments,2),a=h(a);l(function(){a.promiseSend.apply(a,[b,d.resolve].concat(c))});return d.promise}function v(a){return g(a,function(a){var d=a.length,c=[];if(d===0)return h(c);
		var f=n();t.call(a,function(a,b,e){g(b,function(a){c[e]=a;--d===0&&f.resolve(c)},f.reject)},e);return f.promise})}var l;try{l=k("event-queue").enqueue}catch(I){if(typeof MessageChannel!=="undefined"){var B=new MessageChannel,w={},C=w;B.port1.onmessage=function(){var a=w.next,b=a.task;w=a;b()};l=function(a){C=C.next={task:a};B.port2.postMessage()}}else l=function(a){setTimeout(a,0)}}var k=function(a,b,d){a[b]||(a[b]=d);return a[b]},u=k(Object,"freeze",q),r=k(Object,"create",function(a){var b=function(){};
		b.prototype=a;return new b}),H=k(Object,"keys",function(a){var b=[],d;for(d in a)b.push(d);return b}),t=Array.prototype.reduce||function(a,b){var d=0,c=this.length;if(arguments.length==1){do{if(d in this){b=this[d++];break}if(++d>=c)throw new TypeError;}while(1)}for(;d<c;d++)d in this&&(b=a(b,this[d],d));return b},j=Array.prototype.slice,z=null,o=function(a){return a===e||a===z?a:a.valueOf()};c.enqueue=c.nextTick=l;c.defer=n;c.makePromise=f;f.prototype.then=function(a,b){return g(this,a,b)};t.call("when,send,get,put,del,post,invoke,keys,apply,call,all,wait,join,fail,fin,spy,view,viewInfo,end".split(","),
		function(a,b){f.prototype[b]=function(){return c[b].apply(c,[this].concat(j.call(arguments)))}},e);f.prototype.toSource=function(){return this.toString()};f.prototype.toString=function(){return"[object Promise]"};u(f.prototype);c.isPromise=s;c.isResolved=function(a){return!s(o(a))};c.isFulfilled=function(a){return!s(o(a))&&!y(a)};c.isRejected=y;c.reject=i;i.prototype=r(f.prototype,{constructor:{value:i}});c.ref=h;c.master=c.def=function(a){return f({isDef:function(){}},function(b){var d=j.call(arguments);
		return p.apply(e,[a].concat(d))},function(){return o(a)})};c.viewInfo=A;c.view=function(a){return A(a).when(function(b){var d;d=b.type==="function"?function(){return D(a,e,arguments)}:{};var c=b.properties||{};Object.keys(c).forEach(function(b){c[b]==="function"&&(d[b]=function(){return E(a,b,arguments)})});return h(d)})};c.when=g;c.async=function(a){return function(){var b=function(a,b){var f;try{f=d[a](b)}catch(h){return Object.prototype.toString.call(h)==="[object StopIteration]"?h.value:i(h)}return g(f,
		c,e)},d=a.apply(this,arguments),c=b.bind(b,"send"),e=b.bind(b,"throw");return c()}};c.Method=m;c.send=p;c.get=m("get");c.put=m("put");c.del=m("del");var E=c.post=m("post");c.invoke=function(a,b){var d=j.call(arguments,2);return E(a,b,d)};var D=c.apply=m("apply");c.call=function(a,b){var d=j.call(arguments,2);return D(a,b,d)};c.keys=m("keys");c.all=v;c.wait=function(a){return v(arguments).get(0)};c.join=function(){var a=j.call(arguments),b=a.pop();return v(a).then(function(a){return b.apply(e,a)})};
		c.fail=function(a,b){return g(a,e,b)};c.spy=c.fin=function(a,b){return g(a,function(a){return g(b(),function(){return a})},function(a){return g(b(),function(){return i(a)})})};c.end=function(a){g(a,e,function(a){l(function(){throw a;})})};for(var F in c)h[F]=c[F];return G.exports=h});		
	});

});
