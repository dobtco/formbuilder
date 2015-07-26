!function(a){function b(){var a,c;for(c=arguments[0]||{},this.config={},this.config.elements=c.elements?c.elements:[],this.config.attributes=c.attributes?c.attributes:{},this.config.attributes[b.ALL]=this.config.attributes[b.ALL]?this.config.attributes[b.ALL]:[],this.config.allow_comments=c.allow_comments?c.allow_comments:!1,this.allowed_elements={},this.config.protocols=c.protocols?c.protocols:{},this.config.add_attributes=c.add_attributes?c.add_attributes:{},this.dom=c.dom?c.dom:document,a=0;a<this.config.elements.length;a++)this.allowed_elements[this.config.elements[a]]=!0;if(this.config.remove_element_contents={},this.config.remove_all_contents=!1,c.remove_contents)if(c.remove_contents instanceof Array)for(a=0;a<c.remove_contents.length;a++)this.config.remove_element_contents[c.remove_contents[a]]=!0;else this.config.remove_all_contents=!0;this.transformers=c.transformers?c.transformers:[]}!function(b){"function"==typeof define&&define.amd?define(["jquery"],b):b("undefined"!=typeof jQuery?jQuery:a.Zepto)}(function(b){"use strict";function c(a){var c=a.data;a.isDefaultPrevented()||(a.preventDefault(),b(a.target).ajaxSubmit(c))}function d(a){var c=a.target,d=b(c);if(!d.is("[type=submit],[type=image]")){var e=d.closest("[type=submit]");if(0===e.length)return;c=e[0]}var f=this;if(f.clk=c,"image"==c.type)if(void 0!==a.offsetX)f.clk_x=a.offsetX,f.clk_y=a.offsetY;else if("function"==typeof b.fn.offset){var g=d.offset();f.clk_x=a.pageX-g.left,f.clk_y=a.pageY-g.top}else f.clk_x=a.pageX-c.offsetLeft,f.clk_y=a.pageY-c.offsetTop;setTimeout(function(){f.clk=f.clk_x=f.clk_y=null},100)}function e(){if(b.fn.ajaxSubmit.debug){var c="[jquery.form] "+Array.prototype.join.call(arguments,"");a.console&&a.console.log?a.console.log(c):a.opera&&a.opera.postError&&a.opera.postError(c)}}var f={};f.fileapi=void 0!==b("<input type='file'/>").get(0).files,f.formdata=void 0!==a.FormData;var g=!!b.fn.prop;b.fn.attr2=function(){if(!g)return this.attr.apply(this,arguments);var a=this.prop.apply(this,arguments);return a&&a.jquery||"string"==typeof a?a:this.attr.apply(this,arguments)},b.fn.ajaxSubmit=function(c){function d(a){var d,e,f=b.param(a,c.traditional).split("&"),g=f.length,h=[];for(d=0;g>d;d++)f[d]=f[d].replace(/\+/g," "),e=f[d].split("="),h.push([decodeURIComponent(e[0]),decodeURIComponent(e[1])]);return h}function h(a){for(var e=new FormData,f=0;f<a.length;f++)e.append(a[f].name,a[f].value);if(c.extraData){var g=d(c.extraData);for(f=0;f<g.length;f++)g[f]&&e.append(g[f][0],g[f][1])}c.data=null;var h=b.extend(!0,{},b.ajaxSettings,c,{contentType:!1,processData:!1,cache:!1,type:j||"POST"});c.uploadProgress&&(h.xhr=function(){var a=b.ajaxSettings.xhr();return a.upload&&a.upload.addEventListener("progress",function(a){var b=0,d=a.loaded||a.position,e=a.total;a.lengthComputable&&(b=Math.ceil(d/e*100)),c.uploadProgress(a,d,e,b)},!1),a}),h.data=null;var i=h.beforeSend;return h.beforeSend=function(a,b){b.data=c.formData?c.formData:e,i&&i.call(this,a,b)},b.ajax(h)}function i(d){function f(a){var b=null;try{a.contentWindow&&(b=a.contentWindow.document)}catch(c){e("cannot get iframe.contentWindow document: "+c)}if(b)return b;try{b=a.contentDocument?a.contentDocument:a.document}catch(c){e("cannot get iframe.contentDocument: "+c),b=a.document}return b}function h(){function a(){try{var b=f(s).readyState;e("state = "+b),b&&"uninitialized"==b.toLowerCase()&&setTimeout(a,50)}catch(c){e("Server abort: ",c," (",c.name,")"),i(B),x&&clearTimeout(x),x=void 0}}var c=m.attr2("target"),d=m.attr2("action");y.setAttribute("target",p),(!j||/post/i.test(j))&&y.setAttribute("method","POST"),d!=n.url&&y.setAttribute("action",n.url),n.skipEncodingOverride||j&&!/post/i.test(j)||m.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),n.timeout&&(x=setTimeout(function(){w=!0,i(A)},n.timeout));var g=[];try{if(n.extraData)for(var h in n.extraData)n.extraData.hasOwnProperty(h)&&g.push(b.isPlainObject(n.extraData[h])&&n.extraData[h].hasOwnProperty("name")&&n.extraData[h].hasOwnProperty("value")?b('<input type="hidden" name="'+n.extraData[h].name+'">').val(n.extraData[h].value).appendTo(y)[0]:b('<input type="hidden" name="'+h+'">').val(n.extraData[h]).appendTo(y)[0]);n.iframeTarget||r.appendTo("body"),s.attachEvent?s.attachEvent("onload",i):s.addEventListener("load",i,!1),setTimeout(a,15);try{y.submit()}catch(k){var l=document.createElement("form").submit;l.apply(y)}}finally{y.setAttribute("action",d),c?y.setAttribute("target",c):m.removeAttr("target"),b(g).remove()}}function i(c){if(!t.aborted&&!G){if(F=f(s),F||(e("cannot access response document"),c=B),c===A&&t)return t.abort("timeout"),void z.reject(t,"timeout");if(c==B&&t)return t.abort("server abort"),void z.reject(t,"error","server abort");if(F&&F.location.href!=n.iframeSrc||w){s.detachEvent?s.detachEvent("onload",i):s.removeEventListener("load",i,!1);var d,g="success";try{if(w)throw"timeout";var h="xml"==n.dataType||F.XMLDocument||b.isXMLDoc(F);if(e("isXml="+h),!h&&a.opera&&(null===F.body||!F.body.innerHTML)&&--H)return e("requeing onLoad callback, DOM not available"),void setTimeout(i,250);var j=F.body?F.body:F.documentElement;t.responseText=j?j.innerHTML:null,t.responseXML=F.XMLDocument?F.XMLDocument:F,h&&(n.dataType="xml"),t.getResponseHeader=function(a){var b={"content-type":n.dataType};return b[a.toLowerCase()]},j&&(t.status=Number(j.getAttribute("status"))||t.status,t.statusText=j.getAttribute("statusText")||t.statusText);var k=(n.dataType||"").toLowerCase(),l=/(json|script|text)/.test(k);if(l||n.textarea){var m=F.getElementsByTagName("textarea")[0];if(m)t.responseText=m.value,t.status=Number(m.getAttribute("status"))||t.status,t.statusText=m.getAttribute("statusText")||t.statusText;else if(l){var p=F.getElementsByTagName("pre")[0],q=F.getElementsByTagName("body")[0];p?t.responseText=p.textContent?p.textContent:p.innerText:q&&(t.responseText=q.textContent?q.textContent:q.innerText)}}else"xml"==k&&!t.responseXML&&t.responseText&&(t.responseXML=I(t.responseText));try{E=K(t,k,n)}catch(u){g="parsererror",t.error=d=u||g}}catch(u){e("error caught: ",u),g="error",t.error=d=u||g}t.aborted&&(e("upload aborted"),g=null),t.status&&(g=t.status>=200&&t.status<300||304===t.status?"success":"error"),"success"===g?(n.success&&n.success.call(n.context,E,"success",t),z.resolve(t.responseText,"success",t),o&&b.event.trigger("ajaxSuccess",[t,n])):g&&(void 0===d&&(d=t.statusText),n.error&&n.error.call(n.context,t,g,d),z.reject(t,"error",d),o&&b.event.trigger("ajaxError",[t,n,d])),o&&b.event.trigger("ajaxComplete",[t,n]),o&&!--b.active&&b.event.trigger("ajaxStop"),n.complete&&n.complete.call(n.context,t,g),G=!0,n.timeout&&clearTimeout(x),setTimeout(function(){n.iframeTarget?r.attr("src",n.iframeSrc):r.remove(),t.responseXML=null},100)}}}var k,l,n,o,p,r,s,t,u,v,w,x,y=m[0],z=b.Deferred();if(z.abort=function(a){t.abort(a)},d)for(l=0;l<q.length;l++)k=b(q[l]),g?k.prop("disabled",!1):k.removeAttr("disabled");if(n=b.extend(!0,{},b.ajaxSettings,c),n.context=n.context||n,p="jqFormIO"+(new Date).getTime(),n.iframeTarget?(r=b(n.iframeTarget),v=r.attr2("name"),v?p=v:r.attr2("name",p)):(r=b('<iframe name="'+p+'" src="'+n.iframeSrc+'" />'),r.css({position:"absolute",top:"-1000px",left:"-1000px"})),s=r[0],t={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(a){var c="timeout"===a?"timeout":"aborted";e("aborting upload... "+c),this.aborted=1;try{s.contentWindow.document.execCommand&&s.contentWindow.document.execCommand("Stop")}catch(d){}r.attr("src",n.iframeSrc),t.error=c,n.error&&n.error.call(n.context,t,c,a),o&&b.event.trigger("ajaxError",[t,n,c]),n.complete&&n.complete.call(n.context,t,c)}},o=n.global,o&&0===b.active++&&b.event.trigger("ajaxStart"),o&&b.event.trigger("ajaxSend",[t,n]),n.beforeSend&&n.beforeSend.call(n.context,t,n)===!1)return n.global&&b.active--,z.reject(),z;if(t.aborted)return z.reject(),z;u=y.clk,u&&(v=u.name,v&&!u.disabled&&(n.extraData=n.extraData||{},n.extraData[v]=u.value,"image"==u.type&&(n.extraData[v+".x"]=y.clk_x,n.extraData[v+".y"]=y.clk_y)));var A=1,B=2,C=b("meta[name=csrf-token]").attr("content"),D=b("meta[name=csrf-param]").attr("content");D&&C&&(n.extraData=n.extraData||{},n.extraData[D]=C),n.forceSync?h():setTimeout(h,10);var E,F,G,H=50,I=b.parseXML||function(b,c){return a.ActiveXObject?(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b)):c=(new DOMParser).parseFromString(b,"text/xml"),c&&c.documentElement&&"parsererror"!=c.documentElement.nodeName?c:null},J=b.parseJSON||function(b){return a.eval("("+b+")")},K=function(a,c,d){var e=a.getResponseHeader("content-type")||"",f="xml"===c||!c&&e.indexOf("xml")>=0,g=f?a.responseXML:a.responseText;return f&&"parsererror"===g.documentElement.nodeName&&b.error&&b.error("parsererror"),d&&d.dataFilter&&(g=d.dataFilter(g,c)),"string"==typeof g&&("json"===c||!c&&e.indexOf("json")>=0?g=J(g):("script"===c||!c&&e.indexOf("javascript")>=0)&&b.globalEval(g)),g};return z}if(!this.length)return e("ajaxSubmit: skipping submit process - no element selected"),this;var j,k,l,m=this;"function"==typeof c?c={success:c}:void 0===c&&(c={}),j=c.type||this.attr2("method"),k=c.url||this.attr2("action"),l="string"==typeof k?b.trim(k):"",l=l||a.location.href||"",l&&(l=(l.match(/^([^#]+)/)||[])[1]),c=b.extend(!0,{url:l,success:b.ajaxSettings.success,type:j||b.ajaxSettings.type,iframeSrc:/^https/i.test(a.location.href||"")?"javascript:false":"about:blank"},c);var n={};if(this.trigger("form-pre-serialize",[this,c,n]),n.veto)return e("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(c.beforeSerialize&&c.beforeSerialize(this,c)===!1)return e("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var o=c.traditional;void 0===o&&(o=b.ajaxSettings.traditional);var p,q=[],r=this.formToArray(c.semantic,q);if(c.data&&(c.extraData=c.data,p=b.param(c.data,o)),c.beforeSubmit&&c.beforeSubmit(r,this,c)===!1)return e("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[r,this,c,n]),n.veto)return e("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var s=b.param(r,o);p&&(s=s?s+"&"+p:p),"GET"==c.type.toUpperCase()?(c.url+=(c.url.indexOf("?")>=0?"&":"?")+s,c.data=null):c.data=s;var t=[];if(c.resetForm&&t.push(function(){m.resetForm()}),c.clearForm&&t.push(function(){m.clearForm(c.includeHidden)}),!c.dataType&&c.target){var u=c.success||function(){};t.push(function(a){var d=c.replaceTarget?"replaceWith":"html";b(c.target)[d](a).each(u,arguments)})}else c.success&&t.push(c.success);if(c.success=function(a,b,d){for(var e=c.context||this,f=0,g=t.length;g>f;f++)t[f].apply(e,[a,b,d||m,m])},c.error){var v=c.error;c.error=function(a,b,d){var e=c.context||this;v.apply(e,[a,b,d,m])}}if(c.complete){var w=c.complete;c.complete=function(a,b){var d=c.context||this;w.apply(d,[a,b,m])}}var x=b("input[type=file]:enabled",this).filter(function(){return""!==b(this).val()}),y=x.length>0,z="multipart/form-data",A=m.attr("enctype")==z||m.attr("encoding")==z,B=f.fileapi&&f.formdata;e("fileAPI :"+B);var C,D=(y||A)&&!B;c.iframe!==!1&&(c.iframe||D)?c.closeKeepAlive?b.get(c.closeKeepAlive,function(){C=i(r)}):C=i(r):C=(y||A)&&B?h(r):b.ajax(c),m.removeData("jqxhr").data("jqxhr",C);for(var E=0;E<q.length;E++)q[E]=null;return this.trigger("form-submit-notify",[this,c]),this},b.fn.ajaxForm=function(a){if(a=a||{},a.delegation=a.delegation&&b.isFunction(b.fn.on),!a.delegation&&0===this.length){var f={s:this.selector,c:this.context};return!b.isReady&&f.s?(e("DOM not ready, queuing ajaxForm"),b(function(){b(f.s,f.c).ajaxForm(a)}),this):(e("terminating; zero elements found by selector"+(b.isReady?"":" (DOM not ready)")),this)}return a.delegation?(b(document).off("submit.form-plugin",this.selector,c).off("click.form-plugin",this.selector,d).on("submit.form-plugin",this.selector,a,c).on("click.form-plugin",this.selector,a,d),this):this.ajaxFormUnbind().bind("submit.form-plugin",a,c).bind("click.form-plugin",a,d)},b.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")},b.fn.formToArray=function(a,c){var d=[];if(0===this.length)return d;var e=this[0],g=a?e.getElementsByTagName("*"):e.elements;if(!g)return d;var h,i,j,k,l,m,n;for(h=0,m=g.length;m>h;h++)if(l=g[h],j=l.name,j&&!l.disabled)if(a&&e.clk&&"image"==l.type)e.clk==l&&(d.push({name:j,value:b(l).val(),type:l.type}),d.push({name:j+".x",value:e.clk_x},{name:j+".y",value:e.clk_y}));else if(k=b.fieldValue(l,!0),k&&k.constructor==Array)for(c&&c.push(l),i=0,n=k.length;n>i;i++)d.push({name:j,value:k[i]});else if(f.fileapi&&"file"==l.type){c&&c.push(l);var o=l.files;if(o.length)for(i=0;i<o.length;i++)d.push({name:j,value:o[i],type:l.type});else d.push({name:j,value:"",type:l.type})}else null!==k&&"undefined"!=typeof k&&(c&&c.push(l),d.push({name:j,value:k,type:l.type,required:l.required}));if(!a&&e.clk){var p=b(e.clk),q=p[0];j=q.name,j&&!q.disabled&&"image"==q.type&&(d.push({name:j,value:p.val()}),d.push({name:j+".x",value:e.clk_x},{name:j+".y",value:e.clk_y}))}return d},b.fn.formSerialize=function(a){return b.param(this.formToArray(a))},b.fn.fieldSerialize=function(a){var c=[];return this.each(function(){var d=this.name;if(d){var e=b.fieldValue(this,a);if(e&&e.constructor==Array)for(var f=0,g=e.length;g>f;f++)c.push({name:d,value:e[f]});else null!==e&&"undefined"!=typeof e&&c.push({name:this.name,value:e})}}),b.param(c)},b.fn.fieldValue=function(a){for(var c=[],d=0,e=this.length;e>d;d++){var f=this[d],g=b.fieldValue(f,a);null===g||"undefined"==typeof g||g.constructor==Array&&!g.length||(g.constructor==Array?b.merge(c,g):c.push(g))}return c},b.fieldValue=function(a,c){var d=a.name,e=a.type,f=a.tagName.toLowerCase();if(void 0===c&&(c=!0),c&&(!d||a.disabled||"reset"==e||"button"==e||("checkbox"==e||"radio"==e)&&!a.checked||("submit"==e||"image"==e)&&a.form&&a.form.clk!=a||"select"==f&&-1==a.selectedIndex))return null;if("select"==f){var g=a.selectedIndex;if(0>g)return null;for(var h=[],i=a.options,j="select-one"==e,k=j?g+1:i.length,l=j?g:0;k>l;l++){var m=i[l];if(m.selected){var n=m.value;if(n||(n=m.attributes&&m.attributes.value&&!m.attributes.value.specified?m.text:m.value),j)return n;h.push(n)}}return h}return b(a).val()},b.fn.clearForm=function(a){return this.each(function(){b("input,select,textarea",this).clearFields(a)})},b.fn.clearFields=b.fn.clearInputs=function(a){var c=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var d=this.type,e=this.tagName.toLowerCase();c.test(d)||"textarea"==e?this.value="":"checkbox"==d||"radio"==d?this.checked=!1:"select"==e?this.selectedIndex=-1:"file"==d?/MSIE/.test(navigator.userAgent)?b(this).replaceWith(b(this).clone(!0)):b(this).val(""):a&&(a===!0&&/hidden/.test(d)||"string"==typeof a&&b(this).is(a))&&(this.value="")})},b.fn.resetForm=function(){return this.each(function(){("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset()})},b.fn.enable=function(a){return void 0===a&&(a=!0),this.each(function(){this.disabled=!a})},b.fn.selected=function(a){return void 0===a&&(a=!0),this.each(function(){var c=this.type;if("checkbox"==c||"radio"==c)this.checked=a;else if("option"==this.tagName.toLowerCase()){var d=b(this).parent("select");a&&d[0]&&"select-one"==d[0].type&&d.find("option").selected(!1),this.selected=a}})},b.fn.ajaxSubmit.debug=!1}),function(a){function b(){try{return g in a&&a[g]}catch(b){return!1}}function c(a){return a.replace(/^d/,"___$&").replace(m,"___")}var d,e={},f=a.document,g="localStorage",h="script";if(e.disabled=!1,e.version="1.3.17",e.set=function(){},e.get=function(){},e.has=function(a){return void 0!==e.get(a)},e.remove=function(){},e.clear=function(){},e.transact=function(a,b,c){null==c&&(c=b,b=null),null==b&&(b={});var d=e.get(a,b);c(d),e.set(a,d)},e.getAll=function(){},e.forEach=function(){},e.serialize=function(a){return JSON.stringify(a)},e.deserialize=function(a){if("string"!=typeof a)return void 0;try{return JSON.parse(a)}catch(b){return a||void 0}},b())d=a[g],e.set=function(a,b){return void 0===b?e.remove(a):(d.setItem(a,e.serialize(b)),b)},e.get=function(a,b){var c=e.deserialize(d.getItem(a));return void 0===c?b:c},e.remove=function(a){d.removeItem(a)},e.clear=function(){d.clear()},e.getAll=function(){var a={};return e.forEach(function(b,c){a[b]=c}),a},e.forEach=function(a){for(var b=0;b<d.length;b++){var c=d.key(b);a(c,e.get(c))}};else if(f.documentElement.addBehavior){var i,j;try{j=new ActiveXObject("htmlfile"),j.open(),j.write("<"+h+">document.w=window</"+h+'><iframe src="/favicon.ico"></iframe>'),j.close(),i=j.w.frames[0].document,d=i.createElement("div")}catch(k){d=f.createElement("div"),i=f.body}var l=function(a){return function(){var b=Array.prototype.slice.call(arguments,0);b.unshift(d),i.appendChild(d),d.addBehavior("#default#userData"),d.load(g);var c=a.apply(e,b);return i.removeChild(d),c}},m=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");e.set=l(function(a,b,d){return b=c(b),void 0===d?e.remove(b):(a.setAttribute(b,e.serialize(d)),a.save(g),d)}),e.get=l(function(a,b,d){b=c(b);var f=e.deserialize(a.getAttribute(b));return void 0===f?d:f}),e.remove=l(function(a,b){b=c(b),a.removeAttribute(b),a.save(g)}),e.clear=l(function(a){var b=a.XMLDocument.documentElement.attributes;a.load(g);for(var c,d=0;c=b[d];d++)a.removeAttribute(c.name);a.save(g)}),e.getAll=function(){var a={};return e.forEach(function(b,c){a[b]=c}),a},e.forEach=l(function(a,b){for(var c,d=a.XMLDocument.documentElement.attributes,f=0;c=d[f];++f)b(c.name,e.deserialize(a.getAttribute(c.name)))})}try{var n="__storejs__";e.set(n,n),e.get(n)!=n&&(e.disabled=!0),e.remove(n)}catch(k){e.disabled=!0}e.enabled=!e.disabled,"undefined"!=typeof module&&module.exports&&this.module!==module?module.exports=e:"function"==typeof define&&define.amd?define(e):a.store=e}(Function("return this")()),function(){var a=this,b=a._,c={},d=Array.prototype,e=Object.prototype,f=Function.prototype,g=d.push,h=d.slice,i=d.concat,j=e.toString,k=e.hasOwnProperty,l=d.forEach,m=d.map,n=d.reduce,o=d.reduceRight,p=d.filter,q=d.every,r=d.some,s=d.indexOf,t=d.lastIndexOf,u=Array.isArray,v=Object.keys,w=f.bind,x=function(a){return a instanceof x?a:this instanceof x?void(this._wrapped=a):new x(a)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=x),exports._=x):a._=x,x.VERSION="1.6.0";var y=x.each=x.forEach=function(a,b,d){if(null==a)return a;if(l&&a.forEach===l)a.forEach(b,d);else if(a.length===+a.length){for(var e=0,f=a.length;f>e;e++)if(b.call(d,a[e],e,a)===c)return}else for(var g=x.keys(a),e=0,f=g.length;f>e;e++)if(b.call(d,a[g[e]],g[e],a)===c)return;return a};x.map=x.collect=function(a,b,c){var d=[];return null==a?d:m&&a.map===m?a.map(b,c):(y(a,function(a,e,f){d.push(b.call(c,a,e,f))}),d)};var z="Reduce of empty array with no initial value";x.reduce=x.foldl=x.inject=function(a,b,c,d){var e=arguments.length>2;if(null==a&&(a=[]),n&&a.reduce===n)return d&&(b=x.bind(b,d)),e?a.reduce(b,c):a.reduce(b);if(y(a,function(a,f,g){e?c=b.call(d,c,a,f,g):(c=a,e=!0)}),!e)throw new TypeError(z);return c},x.reduceRight=x.foldr=function(a,b,c,d){var e=arguments.length>2;if(null==a&&(a=[]),o&&a.reduceRight===o)return d&&(b=x.bind(b,d)),e?a.reduceRight(b,c):a.reduceRight(b);var f=a.length;if(f!==+f){var g=x.keys(a);f=g.length}if(y(a,function(h,i,j){i=g?g[--f]:--f,e?c=b.call(d,c,a[i],i,j):(c=a[i],e=!0)}),!e)throw new TypeError(z);return c},x.find=x.detect=function(a,b,c){var d;return A(a,function(a,e,f){return b.call(c,a,e,f)?(d=a,!0):void 0}),d},x.filter=x.select=function(a,b,c){var d=[];return null==a?d:p&&a.filter===p?a.filter(b,c):(y(a,function(a,e,f){b.call(c,a,e,f)&&d.push(a)}),d)},x.reject=function(a,b,c){return x.filter(a,function(a,d,e){return!b.call(c,a,d,e)},c)},x.every=x.all=function(a,b,d){b||(b=x.identity);var e=!0;return null==a?e:q&&a.every===q?a.every(b,d):(y(a,function(a,f,g){return(e=e&&b.call(d,a,f,g))?void 0:c}),!!e)};var A=x.some=x.any=function(a,b,d){b||(b=x.identity);var e=!1;return null==a?e:r&&a.some===r?a.some(b,d):(y(a,function(a,f,g){return e||(e=b.call(d,a,f,g))?c:void 0}),!!e)};x.contains=x.include=function(a,b){return null==a?!1:s&&a.indexOf===s?-1!=a.indexOf(b):A(a,function(a){return a===b})},x.invoke=function(a,b){var c=h.call(arguments,2),d=x.isFunction(b);return x.map(a,function(a){return(d?b:a[b]).apply(a,c)})},x.pluck=function(a,b){return x.map(a,x.property(b))},x.where=function(a,b){return x.filter(a,x.matches(b))},x.findWhere=function(a,b){return x.find(a,x.matches(b))},x.max=function(a,b,c){if(!b&&x.isArray(a)&&a[0]===+a[0]&&a.length<65535)return Math.max.apply(Math,a);var d=-1/0,e=-1/0;return y(a,function(a,f,g){var h=b?b.call(c,a,f,g):a;h>e&&(d=a,e=h)}),d},x.min=function(a,b,c){if(!b&&x.isArray(a)&&a[0]===+a[0]&&a.length<65535)return Math.min.apply(Math,a);var d=1/0,e=1/0;return y(a,function(a,f,g){var h=b?b.call(c,a,f,g):a;e>h&&(d=a,e=h)}),d},x.shuffle=function(a){var b,c=0,d=[];return y(a,function(a){b=x.random(c++),d[c-1]=d[b],d[b]=a}),d},x.sample=function(a,b,c){return null==b||c?(a.length!==+a.length&&(a=x.values(a)),a[x.random(a.length-1)]):x.shuffle(a).slice(0,Math.max(0,b))};var B=function(a){return null==a?x.identity:x.isFunction(a)?a:x.property(a)};x.sortBy=function(a,b,c){return b=B(b),x.pluck(x.map(a,function(a,d,e){return{value:a,index:d,criteria:b.call(c,a,d,e)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;if(c!==d){if(c>d||void 0===c)return 1;if(d>c||void 0===d)return-1}return a.index-b.index}),"value")};var C=function(a){return function(b,c,d){var e={};return c=B(c),y(b,function(f,g){var h=c.call(d,f,g,b);a(e,h,f)}),e}};x.groupBy=C(function(a,b,c){x.has(a,b)?a[b].push(c):a[b]=[c]}),x.indexBy=C(function(a,b,c){a[b]=c}),x.countBy=C(function(a,b){x.has(a,b)?a[b]++:a[b]=1}),x.sortedIndex=function(a,b,c,d){c=B(c);for(var e=c.call(d,b),f=0,g=a.length;g>f;){var h=f+g>>>1;c.call(d,a[h])<e?f=h+1:g=h}return f},x.toArray=function(a){return a?x.isArray(a)?h.call(a):a.length===+a.length?x.map(a,x.identity):x.values(a):[]},x.size=function(a){return null==a?0:a.length===+a.length?a.length:x.keys(a).length},x.first=x.head=x.take=function(a,b,c){return null==a?void 0:null==b||c?a[0]:0>b?[]:h.call(a,0,b)},x.initial=function(a,b,c){return h.call(a,0,a.length-(null==b||c?1:b))},x.last=function(a,b,c){return null==a?void 0:null==b||c?a[a.length-1]:h.call(a,Math.max(a.length-b,0))},x.rest=x.tail=x.drop=function(a,b,c){return h.call(a,null==b||c?1:b)},x.compact=function(a){return x.filter(a,x.identity)};var D=function(a,b,c){return b&&x.every(a,x.isArray)?i.apply(c,a):(y(a,function(a){x.isArray(a)||x.isArguments(a)?b?g.apply(c,a):D(a,b,c):c.push(a)}),c)};x.flatten=function(a,b){return D(a,b,[])},x.without=function(a){return x.difference(a,h.call(arguments,1))},x.partition=function(a,b){var c=[],d=[];return y(a,function(a){(b(a)?c:d).push(a)}),[c,d]},x.uniq=x.unique=function(a,b,c,d){x.isFunction(b)&&(d=c,c=b,b=!1);var e=c?x.map(a,c,d):a,f=[],g=[];return y(e,function(c,d){(b?d&&g[g.length-1]===c:x.contains(g,c))||(g.push(c),f.push(a[d]))}),f},x.union=function(){return x.uniq(x.flatten(arguments,!0))},x.intersection=function(a){var b=h.call(arguments,1);return x.filter(x.uniq(a),function(a){return x.every(b,function(b){return x.contains(b,a)})})},x.difference=function(a){var b=i.apply(d,h.call(arguments,1));return x.filter(a,function(a){return!x.contains(b,a)})},x.zip=function(){for(var a=x.max(x.pluck(arguments,"length").concat(0)),b=new Array(a),c=0;a>c;c++)b[c]=x.pluck(arguments,""+c);return b},x.object=function(a,b){if(null==a)return{};for(var c={},d=0,e=a.length;e>d;d++)b?c[a[d]]=b[d]:c[a[d][0]]=a[d][1];return c},x.indexOf=function(a,b,c){if(null==a)return-1;var d=0,e=a.length;if(c){if("number"!=typeof c)return d=x.sortedIndex(a,b),a[d]===b?d:-1;d=0>c?Math.max(0,e+c):c}if(s&&a.indexOf===s)return a.indexOf(b,c);for(;e>d;d++)if(a[d]===b)return d;return-1},x.lastIndexOf=function(a,b,c){if(null==a)return-1;var d=null!=c;if(t&&a.lastIndexOf===t)return d?a.lastIndexOf(b,c):a.lastIndexOf(b);for(var e=d?c:a.length;e--;)if(a[e]===b)return e;return-1},x.range=function(a,b,c){arguments.length<=1&&(b=a||0,a=0),c=arguments[2]||1;for(var d=Math.max(Math.ceil((b-a)/c),0),e=0,f=new Array(d);d>e;)f[e++]=a,a+=c;return f};var E=function(){};x.bind=function(a,b){var c,d;if(w&&a.bind===w)return w.apply(a,h.call(arguments,1));if(!x.isFunction(a))throw new TypeError;return c=h.call(arguments,2),d=function(){if(!(this instanceof d))return a.apply(b,c.concat(h.call(arguments)));E.prototype=a.prototype;var e=new E;E.prototype=null;var f=a.apply(e,c.concat(h.call(arguments)));return Object(f)===f?f:e}},x.partial=function(a){var b=h.call(arguments,1);return function(){for(var c=0,d=b.slice(),e=0,f=d.length;f>e;e++)d[e]===x&&(d[e]=arguments[c++]);for(;c<arguments.length;)d.push(arguments[c++]);return a.apply(this,d)}},x.bindAll=function(a){var b=h.call(arguments,1);if(0===b.length)throw new Error("bindAll must be passed function names");return y(b,function(b){a[b]=x.bind(a[b],a)}),a},x.memoize=function(a,b){var c={};return b||(b=x.identity),function(){var d=b.apply(this,arguments);return x.has(c,d)?c[d]:c[d]=a.apply(this,arguments)}},x.delay=function(a,b){var c=h.call(arguments,2);return setTimeout(function(){return a.apply(null,c)},b)},x.defer=function(a){return x.delay.apply(x,[a,1].concat(h.call(arguments,1)))},x.throttle=function(a,b,c){var d,e,f,g=null,h=0;c||(c={});var i=function(){h=c.leading===!1?0:x.now(),g=null,f=a.apply(d,e),d=e=null};return function(){var j=x.now();h||c.leading!==!1||(h=j);var k=b-(j-h);return d=this,e=arguments,0>=k?(clearTimeout(g),g=null,h=j,f=a.apply(d,e),d=e=null):g||c.trailing===!1||(g=setTimeout(i,k)),f}},x.debounce=function(a,b,c){var d,e,f,g,h,i=function(){var j=x.now()-g;b>j?d=setTimeout(i,b-j):(d=null,c||(h=a.apply(f,e),f=e=null))};return function(){f=this,e=arguments,g=x.now();var j=c&&!d;return d||(d=setTimeout(i,b)),j&&(h=a.apply(f,e),f=e=null),h}},x.once=function(a){var b,c=!1;return function(){return c?b:(c=!0,b=a.apply(this,arguments),a=null,b)}},x.wrap=function(a,b){return x.partial(b,a)},x.compose=function(){var a=arguments;return function(){for(var b=arguments,c=a.length-1;c>=0;c--)b=[a[c].apply(this,b)];return b[0]}},x.after=function(a,b){return function(){return--a<1?b.apply(this,arguments):void 0}},x.keys=function(a){if(!x.isObject(a))return[];if(v)return v(a);var b=[];for(var c in a)x.has(a,c)&&b.push(c);return b},x.values=function(a){for(var b=x.keys(a),c=b.length,d=new Array(c),e=0;c>e;e++)d[e]=a[b[e]];return d},x.pairs=function(a){for(var b=x.keys(a),c=b.length,d=new Array(c),e=0;c>e;e++)d[e]=[b[e],a[b[e]]];return d},x.invert=function(a){for(var b={},c=x.keys(a),d=0,e=c.length;e>d;d++)b[a[c[d]]]=c[d];return b},x.functions=x.methods=function(a){var b=[];for(var c in a)x.isFunction(a[c])&&b.push(c);return b.sort()},x.extend=function(a){return y(h.call(arguments,1),function(b){if(b)for(var c in b)a[c]=b[c]}),a},x.pick=function(a){var b={},c=i.apply(d,h.call(arguments,1));return y(c,function(c){c in a&&(b[c]=a[c])}),b},x.omit=function(a){var b={},c=i.apply(d,h.call(arguments,1));for(var e in a)x.contains(c,e)||(b[e]=a[e]);return b},x.defaults=function(a){return y(h.call(arguments,1),function(b){if(b)for(var c in b)void 0===a[c]&&(a[c]=b[c])}),a},x.clone=function(a){return x.isObject(a)?x.isArray(a)?a.slice():x.extend({},a):a},x.tap=function(a,b){return b(a),a};var F=function(a,b,c,d){if(a===b)return 0!==a||1/a==1/b;if(null==a||null==b)return a===b;a instanceof x&&(a=a._wrapped),b instanceof x&&(b=b._wrapped);var e=j.call(a);if(e!=j.call(b))return!1;switch(e){case"[object String]":return a==String(b);case"[object Number]":return a!=+a?b!=+b:0==a?1/a==1/b:a==+b;case"[object Date]":case"[object Boolean]":return+a==+b;case"[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if("object"!=typeof a||"object"!=typeof b)return!1;for(var f=c.length;f--;)if(c[f]==a)return d[f]==b;var g=a.constructor,h=b.constructor;if(g!==h&&!(x.isFunction(g)&&g instanceof g&&x.isFunction(h)&&h instanceof h)&&"constructor"in a&&"constructor"in b)return!1;c.push(a),d.push(b);var i=0,k=!0;if("[object Array]"==e){if(i=a.length,k=i==b.length)for(;i--&&(k=F(a[i],b[i],c,d)););}else{for(var l in a)if(x.has(a,l)&&(i++,!(k=x.has(b,l)&&F(a[l],b[l],c,d))))break;if(k){for(l in b)if(x.has(b,l)&&!i--)break;k=!i}}return c.pop(),d.pop(),k};x.isEqual=function(a,b){return F(a,b,[],[])},x.isEmpty=function(a){if(null==a)return!0;if(x.isArray(a)||x.isString(a))return 0===a.length;for(var b in a)if(x.has(a,b))return!1;return!0},x.isElement=function(a){return!(!a||1!==a.nodeType)},x.isArray=u||function(a){return"[object Array]"==j.call(a)},x.isObject=function(a){return a===Object(a)},y(["Arguments","Function","String","Number","Date","RegExp"],function(a){x["is"+a]=function(b){return j.call(b)=="[object "+a+"]"}}),x.isArguments(arguments)||(x.isArguments=function(a){return!(!a||!x.has(a,"callee"))}),"function"!=typeof/./&&(x.isFunction=function(a){return"function"==typeof a}),x.isFinite=function(a){return isFinite(a)&&!isNaN(parseFloat(a))},x.isNaN=function(a){return x.isNumber(a)&&a!=+a},x.isBoolean=function(a){return a===!0||a===!1||"[object Boolean]"==j.call(a)},x.isNull=function(a){return null===a},x.isUndefined=function(a){return void 0===a},x.has=function(a,b){return k.call(a,b)},x.noConflict=function(){return a._=b,this},x.identity=function(a){return a},x.constant=function(a){return function(){return a}},x.property=function(a){return function(b){return b[a]}},x.matches=function(a){return function(b){if(b===a)return!0;for(var c in a)if(a[c]!==b[c])return!1;return!0}},x.times=function(a,b,c){for(var d=Array(Math.max(0,a)),e=0;a>e;e++)d[e]=b.call(c,e);return d},x.random=function(a,b){return null==b&&(b=a,a=0),a+Math.floor(Math.random()*(b-a+1))},x.now=Date.now||function(){return(new Date).getTime()};var G={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};G.unescape=x.invert(G.escape);var H={escape:new RegExp("["+x.keys(G.escape).join("")+"]","g"),unescape:new RegExp("("+x.keys(G.unescape).join("|")+")","g")};x.each(["escape","unescape"],function(a){x[a]=function(b){return null==b?"":(""+b).replace(H[a],function(b){return G[a][b]})}}),x.result=function(a,b){if(null==a)return void 0;var c=a[b];return x.isFunction(c)?c.call(a):c},x.mixin=function(a){y(x.functions(a),function(b){var c=x[b]=a[b];x.prototype[b]=function(){var a=[this._wrapped];return g.apply(a,arguments),M.call(this,c.apply(x,a))}})};var I=0;x.uniqueId=function(a){var b=++I+"";return a?a+b:b},x.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var J=/(.)^/,K={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},L=/\\|'|\r|\n|\t|\u2028|\u2029/g;x.template=function(a,b,c){var d;c=x.defaults({},c,x.templateSettings);var e=new RegExp([(c.escape||J).source,(c.interpolate||J).source,(c.evaluate||J).source].join("|")+"|$","g"),f=0,g="__p+='";a.replace(e,function(b,c,d,e,h){return g+=a.slice(f,h).replace(L,function(a){return"\\"+K[a]}),c&&(g+="'+\n((__t=("+c+"))==null?'':_.escape(__t))+\n'"),d&&(g+="'+\n((__t=("+d+"))==null?'':__t)+\n'"),e&&(g+="';\n"+e+"\n__p+='"),f=h+b.length,b}),g+="';\n",c.variable||(g="with(obj||{}){\n"+g+"}\n"),g="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+g+"return __p;\n";try{d=new Function(c.variable||"obj","_",g)}catch(h){throw h.source=g,h}if(b)return d(b,x);var i=function(a){return d.call(this,a,x)};return i.source="function("+(c.variable||"obj")+"){\n"+g+"}",i},x.chain=function(a){return x(a).chain()};var M=function(a){return this._chain?x(a).chain():a};x.mixin(x),y(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=d[a];x.prototype[a]=function(){var c=this._wrapped;return b.apply(c,arguments),"shift"!=a&&"splice"!=a||0!==c.length||delete c[0],M.call(this,c)
}}),y(["concat","join","slice"],function(a){var b=d[a];x.prototype[a]=function(){return M.call(this,b.apply(this._wrapped,arguments))}}),x.extend(x.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof define&&define.amd&&define("underscore",[],function(){return x})}.call(this),function(a,b){if("function"==typeof define&&define.amd)define(["underscore","jquery","exports"],function(c,d,e){a.Backbone=b(a,e,c,d)});else if("undefined"!=typeof exports){var c=require("underscore");b(a,exports,c)}else a.Backbone=b(a,{},a._,a.jQuery||a.Zepto||a.ender||a.$)}(this,function(b,c,d,e){{var f=b.Backbone,g=[],h=(g.push,g.slice);g.splice}c.VERSION="1.1.2",c.$=e,c.noConflict=function(){return b.Backbone=f,this},c.emulateHTTP=!1,c.emulateJSON=!1;var i=c.Events={on:function(a,b,c){if(!k(this,"on",a,[b,c])||!b)return this;this._events||(this._events={});var d=this._events[a]||(this._events[a]=[]);return d.push({callback:b,context:c,ctx:c||this}),this},once:function(a,b,c){if(!k(this,"once",a,[b,c])||!b)return this;var e=this,f=d.once(function(){e.off(a,f),b.apply(this,arguments)});return f._callback=b,this.on(a,f,c)},off:function(a,b,c){var e,f,g,h,i,j,l,m;if(!this._events||!k(this,"off",a,[b,c]))return this;if(!a&&!b&&!c)return this._events=void 0,this;for(h=a?[a]:d.keys(this._events),i=0,j=h.length;j>i;i++)if(a=h[i],g=this._events[a]){if(this._events[a]=e=[],b||c)for(l=0,m=g.length;m>l;l++)f=g[l],(b&&b!==f.callback&&b!==f.callback._callback||c&&c!==f.context)&&e.push(f);e.length||delete this._events[a]}return this},trigger:function(a){if(!this._events)return this;var b=h.call(arguments,1);if(!k(this,"trigger",a,b))return this;var c=this._events[a],d=this._events.all;return c&&l(c,b),d&&l(d,arguments),this},stopListening:function(a,b,c){var e=this._listeningTo;if(!e)return this;var f=!b&&!c;c||"object"!=typeof b||(c=this),a&&((e={})[a._listenId]=a);for(var g in e)a=e[g],a.off(b,c,this),(f||d.isEmpty(a._events))&&delete this._listeningTo[g];return this}},j=/\s+/,k=function(a,b,c,d){if(!c)return!0;if("object"==typeof c){for(var e in c)a[b].apply(a,[e,c[e]].concat(d));return!1}if(j.test(c)){for(var f=c.split(j),g=0,h=f.length;h>g;g++)a[b].apply(a,[f[g]].concat(d));return!1}return!0},l=function(a,b){var c,d=-1,e=a.length,f=b[0],g=b[1],h=b[2];switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);return;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f);return;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g);return;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,f,g,h);return;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b);return}},m={listenTo:"on",listenToOnce:"once"};d.each(m,function(a,b){i[b]=function(b,c,e){var f=this._listeningTo||(this._listeningTo={}),g=b._listenId||(b._listenId=d.uniqueId("l"));return f[g]=b,e||"object"!=typeof c||(e=this),b[a](c,e,this),this}}),i.bind=i.on,i.unbind=i.off,d.extend(c,i);var n=c.Model=function(a,b){var c=a||{};b||(b={}),this.cid=d.uniqueId("c"),this.attributes={},b.collection&&(this.collection=b.collection),b.parse&&(c=this.parse(c,b)||{}),c=d.defaults({},c,d.result(this,"defaults")),this.set(c,b),this.changed={},this.initialize.apply(this,arguments)};d.extend(n.prototype,i,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(){return d.clone(this.attributes)},sync:function(){return c.sync.apply(this,arguments)},get:function(a){return this.attributes[a]},escape:function(a){return d.escape(this.get(a))},has:function(a){return null!=this.get(a)},set:function(a,b,c){var e,f,g,h,i,j,k,l;if(null==a)return this;if("object"==typeof a?(f=a,c=b):(f={})[a]=b,c||(c={}),!this._validate(f,c))return!1;g=c.unset,i=c.silent,h=[],j=this._changing,this._changing=!0,j||(this._previousAttributes=d.clone(this.attributes),this.changed={}),l=this.attributes,k=this._previousAttributes,this.idAttribute in f&&(this.id=f[this.idAttribute]);for(e in f)b=f[e],d.isEqual(l[e],b)||h.push(e),d.isEqual(k[e],b)?delete this.changed[e]:this.changed[e]=b,g?delete l[e]:l[e]=b;if(!i){h.length&&(this._pending=c);for(var m=0,n=h.length;n>m;m++)this.trigger("change:"+h[m],this,l[h[m]],c)}if(j)return this;if(!i)for(;this._pending;)c=this._pending,this._pending=!1,this.trigger("change",this,c);return this._pending=!1,this._changing=!1,this},unset:function(a,b){return this.set(a,void 0,d.extend({},b,{unset:!0}))},clear:function(a){var b={};for(var c in this.attributes)b[c]=void 0;return this.set(b,d.extend({},a,{unset:!0}))},hasChanged:function(a){return null==a?!d.isEmpty(this.changed):d.has(this.changed,a)},changedAttributes:function(a){if(!a)return this.hasChanged()?d.clone(this.changed):!1;var b,c=!1,e=this._changing?this._previousAttributes:this.attributes;for(var f in a)d.isEqual(e[f],b=a[f])||((c||(c={}))[f]=b);return c},previous:function(a){return null!=a&&this._previousAttributes?this._previousAttributes[a]:null},previousAttributes:function(){return d.clone(this._previousAttributes)},fetch:function(a){a=a?d.clone(a):{},void 0===a.parse&&(a.parse=!0);var b=this,c=a.success;return a.success=function(d){return b.set(b.parse(d,a),a)?(c&&c(b,d,a),void b.trigger("sync",b,d,a)):!1},M(this,a),this.sync("read",this,a)},save:function(a,b,c){var e,f,g,h=this.attributes;if(null==a||"object"==typeof a?(e=a,c=b):(e={})[a]=b,c=d.extend({validate:!0},c),e&&!c.wait){if(!this.set(e,c))return!1}else if(!this._validate(e,c))return!1;e&&c.wait&&(this.attributes=d.extend({},h,e)),void 0===c.parse&&(c.parse=!0);var i=this,j=c.success;return c.success=function(a){i.attributes=h;var b=i.parse(a,c);return c.wait&&(b=d.extend(e||{},b)),d.isObject(b)&&!i.set(b,c)?!1:(j&&j(i,a,c),void i.trigger("sync",i,a,c))},M(this,c),f=this.isNew()?"create":c.patch?"patch":"update","patch"===f&&(c.attrs=e),g=this.sync(f,this,c),e&&c.wait&&(this.attributes=h),g},destroy:function(a){a=a?d.clone(a):{};var b=this,c=a.success,e=function(){b.trigger("destroy",b,b.collection,a)};if(a.success=function(d){(a.wait||b.isNew())&&e(),c&&c(b,d,a),b.isNew()||b.trigger("sync",b,d,a)},this.isNew())return a.success(),!1;M(this,a);var f=this.sync("delete",this,a);return a.wait||e(),f},url:function(){var a=d.result(this,"urlRoot")||d.result(this.collection,"url")||L();return this.isNew()?a:a.replace(/([^\/])$/,"$1/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(a){return this._validate({},d.extend(a||{},{validate:!0}))},_validate:function(a,b){if(!b.validate||!this.validate)return!0;a=d.extend({},this.attributes,a);var c=this.validationError=this.validate(a,b)||null;return c?(this.trigger("invalid",this,c,d.extend(b,{validationError:c})),!1):!0}});var o=["keys","values","pairs","invert","pick","omit"];d.each(o,function(a){n.prototype[a]=function(){var b=h.call(arguments);return b.unshift(this.attributes),d[a].apply(d,b)}});var p=c.Collection=function(a,b){b||(b={}),b.model&&(this.model=b.model),void 0!==b.comparator&&(this.comparator=b.comparator),this._reset(),this.initialize.apply(this,arguments),a&&this.reset(a,d.extend({silent:!0},b))},q={add:!0,remove:!0,merge:!0},r={add:!0,remove:!1};d.extend(p.prototype,i,{model:n,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},sync:function(){return c.sync.apply(this,arguments)},add:function(a,b){return this.set(a,d.extend({merge:!1},b,r))},remove:function(a,b){var c=!d.isArray(a);a=c?[a]:d.clone(a),b||(b={});var e,f,g,h;for(e=0,f=a.length;f>e;e++)h=a[e]=this.get(a[e]),h&&(delete this._byId[h.id],delete this._byId[h.cid],g=this.indexOf(h),this.models.splice(g,1),this.length--,b.silent||(b.index=g,h.trigger("remove",h,this,b)),this._removeReference(h,b));return c?a[0]:a},set:function(a,b){b=d.defaults({},b,q),b.parse&&(a=this.parse(a,b));var c=!d.isArray(a);a=c?a?[a]:[]:d.clone(a);var e,f,g,h,i,j,k,l=b.at,m=this.model,o=this.comparator&&null==l&&b.sort!==!1,p=d.isString(this.comparator)?this.comparator:null,r=[],s=[],t={},u=b.add,v=b.merge,w=b.remove,x=!o&&u&&w?[]:!1;for(e=0,f=a.length;f>e;e++){if(i=a[e]||{},g=i instanceof n?h=i:i[m.prototype.idAttribute||"id"],j=this.get(g))w&&(t[j.cid]=!0),v&&(i=i===h?h.attributes:i,b.parse&&(i=j.parse(i,b)),j.set(i,b),o&&!k&&j.hasChanged(p)&&(k=!0)),a[e]=j;else if(u){if(h=a[e]=this._prepareModel(i,b),!h)continue;r.push(h),this._addReference(h,b)}h=j||h,!x||!h.isNew()&&t[h.id]||x.push(h),t[h.id]=!0}if(w){for(e=0,f=this.length;f>e;++e)t[(h=this.models[e]).cid]||s.push(h);s.length&&this.remove(s,b)}if(r.length||x&&x.length)if(o&&(k=!0),this.length+=r.length,null!=l)for(e=0,f=r.length;f>e;e++)this.models.splice(l+e,0,r[e]);else{x&&(this.models.length=0);var y=x||r;for(e=0,f=y.length;f>e;e++)this.models.push(y[e])}if(k&&this.sort({silent:!0}),!b.silent){for(e=0,f=r.length;f>e;e++)(h=r[e]).trigger("add",h,this,b);(k||x&&x.length)&&this.trigger("sort",this,b)}return c?a[0]:a},reset:function(a,b){b||(b={});for(var c=0,e=this.models.length;e>c;c++)this._removeReference(this.models[c],b);return b.previousModels=this.models,this._reset(),a=this.add(a,d.extend({silent:!0},b)),b.silent||this.trigger("reset",this,b),a},push:function(a,b){return this.add(a,d.extend({at:this.length},b))},pop:function(a){var b=this.at(this.length-1);return this.remove(b,a),b},unshift:function(a,b){return this.add(a,d.extend({at:0},b))},shift:function(a){var b=this.at(0);return this.remove(b,a),b},slice:function(){return h.apply(this.models,arguments)},get:function(a){return null==a?void 0:this._byId[a]||this._byId[a.id]||this._byId[a.cid]},at:function(a){return this.models[a]},where:function(a,b){return d.isEmpty(a)?b?void 0:[]:this[b?"find":"filter"](function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},findWhere:function(a){return this.where(a,!0)},sort:function(a){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");return a||(a={}),d.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(d.bind(this.comparator,this)),a.silent||this.trigger("sort",this,a),this},pluck:function(a){return d.invoke(this.models,"get",a)},fetch:function(a){a=a?d.clone(a):{},void 0===a.parse&&(a.parse=!0);var b=a.success,c=this;return a.success=function(d){var e=a.reset?"reset":"set";c[e](d,a),b&&b(c,d,a),c.trigger("sync",c,d,a)},M(this,a),this.sync("read",this,a)},create:function(a,b){if(b=b?d.clone(b):{},!(a=this._prepareModel(a,b)))return!1;b.wait||this.add(a,b);var c=this,e=b.success;return b.success=function(a,d){b.wait&&c.add(a,b),e&&e(a,d,b)},a.save(null,b),a},parse:function(a){return a},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(a,b){if(a instanceof n)return a;b=b?d.clone(b):{},b.collection=this;var c=new this.model(a,b);return c.validationError?(this.trigger("invalid",this,c.validationError,b),!1):c},_addReference:function(a){this._byId[a.cid]=a,null!=a.id&&(this._byId[a.id]=a),a.collection||(a.collection=this),a.on("all",this._onModelEvent,this)},_removeReference:function(a){this===a.collection&&delete a.collection,a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"!==a&&"remove"!==a||c===this)&&("destroy"===a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],null!=b.id&&(this._byId[b.id]=b)),this.trigger.apply(this,arguments))}});var s=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain","sample"];d.each(s,function(a){p.prototype[a]=function(){var b=h.call(arguments);return b.unshift(this.models),d[a].apply(d,b)}});var t=["groupBy","countBy","sortBy","indexBy"];d.each(t,function(a){p.prototype[a]=function(b,c){var e=d.isFunction(b)?b:function(a){return a.get(b)};return d[a](this.models,e,c)}});var u=c.View=function(a){this.cid=d.uniqueId("view"),a||(a={}),d.extend(this,d.pick(a,w)),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},v=/^(\S+)\s*(.*)$/,w=["model","collection","el","id","attributes","className","tagName","events"];d.extend(u.prototype,i,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(a,b){return this.$el&&this.undelegateEvents(),this.$el=a instanceof c.$?a:c.$(a),this.el=this.$el[0],b!==!1&&this.delegateEvents(),this},delegateEvents:function(a){if(!a&&!(a=d.result(this,"events")))return this;this.undelegateEvents();for(var b in a){var c=a[b];if(d.isFunction(c)||(c=this[a[b]]),c){var e=b.match(v),f=e[1],g=e[2];c=d.bind(c,this),f+=".delegateEvents"+this.cid,""===g?this.$el.on(f,c):this.$el.on(f,g,c)}}return this},undelegateEvents:function(){return this.$el.off(".delegateEvents"+this.cid),this},_ensureElement:function(){if(this.el)this.setElement(d.result(this,"el"),!1);else{var a=d.extend({},d.result(this,"attributes"));this.id&&(a.id=d.result(this,"id")),this.className&&(a["class"]=d.result(this,"className"));var b=c.$("<"+d.result(this,"tagName")+">").attr(a);this.setElement(b,!1)}}}),c.sync=function(a,b,e){var f=y[a];d.defaults(e||(e={}),{emulateHTTP:c.emulateHTTP,emulateJSON:c.emulateJSON});var g={type:f,dataType:"json"};if(e.url||(g.url=d.result(b,"url")||L()),null!=e.data||!b||"create"!==a&&"update"!==a&&"patch"!==a||(g.contentType="application/json",g.data=JSON.stringify(e.attrs||b.toJSON(e))),e.emulateJSON&&(g.contentType="application/x-www-form-urlencoded",g.data=g.data?{model:g.data}:{}),e.emulateHTTP&&("PUT"===f||"DELETE"===f||"PATCH"===f)){g.type="POST",e.emulateJSON&&(g.data._method=f);var h=e.beforeSend;e.beforeSend=function(a){return a.setRequestHeader("X-HTTP-Method-Override",f),h?h.apply(this,arguments):void 0}}"GET"===g.type||e.emulateJSON||(g.processData=!1),"PATCH"===g.type&&x&&(g.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")});var i=e.xhr=c.ajax(d.extend(g,e));return b.trigger("request",b,i,e),i};var x=!("undefined"==typeof a||!a.ActiveXObject||a.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent),y={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};c.ajax=function(){return c.$.ajax.apply(c.$,arguments)};var z=c.Router=function(a){a||(a={}),a.routes&&(this.routes=a.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},A=/\((.*?)\)/g,B=/(\(\?)?:\w+/g,C=/\*\w+/g,D=/[\-{}\[\]+?.,\\\^$|#\s]/g;d.extend(z.prototype,i,{initialize:function(){},route:function(a,b,e){d.isRegExp(a)||(a=this._routeToRegExp(a)),d.isFunction(b)&&(e=b,b=""),e||(e=this[b]);var f=this;return c.history.route(a,function(d){var g=f._extractParameters(a,d);f.execute(e,g),f.trigger.apply(f,["route:"+b].concat(g)),f.trigger("route",b,g),c.history.trigger("route",f,b,g)}),this},execute:function(a,b){a&&a.apply(this,b)},navigate:function(a,b){return c.history.navigate(a,b),this},_bindRoutes:function(){if(this.routes){this.routes=d.result(this,"routes");for(var a,b=d.keys(this.routes);null!=(a=b.pop());)this.route(a,this.routes[a])}},_routeToRegExp:function(a){return a=a.replace(D,"\\$&").replace(A,"(?:$1)?").replace(B,function(a,b){return b?a:"([^/?]+)"}).replace(C,"([^?]*?)"),new RegExp("^"+a+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(a,b){var c=a.exec(b).slice(1);return d.map(c,function(a,b){return b===c.length-1?a||null:a?decodeURIComponent(a):null})}});var E=c.History=function(){this.handlers=[],d.bindAll(this,"checkUrl"),"undefined"!=typeof a&&(this.location=a.location,this.history=a.history)},F=/^[#\/]|\s+$/g,G=/^\/+|\/+$/g,H=/msie [\w.]+/,I=/\/$/,J=/#.*$/;E.started=!1,d.extend(E.prototype,i,{interval:50,atRoot:function(){return this.location.pathname.replace(/[^\/]$/,"$&/")===this.root},getHash:function(a){var b=(a||this).location.href.match(/#(.*)$/);return b?b[1]:""},getFragment:function(a,b){if(null==a)if(this._hasPushState||!this._wantsHashChange||b){a=decodeURI(this.location.pathname+this.location.search);var c=this.root.replace(I,"");a.indexOf(c)||(a=a.slice(c.length))}else a=this.getHash();return a.replace(F,"")},start:function(b){if(E.started)throw new Error("Backbone.history has already been started");E.started=!0,this.options=d.extend({root:"/"},this.options,b),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment(),f=document.documentMode,g=H.exec(navigator.userAgent.toLowerCase())&&(!f||7>=f);if(this.root=("/"+this.root+"/").replace(G,"/"),g&&this._wantsHashChange){var h=c.$('<iframe src="javascript:0" tabindex="-1">');this.iframe=h.hide().appendTo("body")[0].contentWindow,this.navigate(e)}this._hasPushState?c.$(a).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in a&&!g?c.$(a).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=e;var i=this.location;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot())return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+"#"+this.fragment),!0;this._hasPushState&&this.atRoot()&&i.hash&&(this.fragment=this.getHash().replace(F,""),this.history.replaceState({},document.title,this.root+this.fragment))}return this.options.silent?void 0:this.loadUrl()},stop:function(){c.$(a).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),this._checkUrlInterval&&clearInterval(this._checkUrlInterval),E.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();return a===this.fragment&&this.iframe&&(a=this.getFragment(this.getHash(this.iframe))),a===this.fragment?!1:(this.iframe&&this.navigate(a),void this.loadUrl())},loadUrl:function(a){return a=this.fragment=this.getFragment(a),d.any(this.handlers,function(b){return b.route.test(a)?(b.callback(a),!0):void 0})},navigate:function(a,b){if(!E.started)return!1;b&&b!==!0||(b={trigger:!!b});var c=this.root+(a=this.getFragment(a||""));if(a=a.replace(J,""),this.fragment!==a){if(this.fragment=a,""===a&&"/"!==c&&(c=c.slice(0,-1)),this._hasPushState)this.history[b.replace?"replaceState":"pushState"]({},document.title,c);else{if(!this._wantsHashChange)return this.location.assign(c);this._updateHash(this.location,a,b.replace),this.iframe&&a!==this.getFragment(this.getHash(this.iframe))&&(b.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,a,b.replace))}return b.trigger?this.loadUrl(a):void 0}},_updateHash:function(a,b,c){if(c){var d=a.href.replace(/(javascript:|#).*$/,"");a.replace(d+"#"+b)}else a.hash="#"+b}}),c.history=new E;var K=function(a,b){var c,e=this;c=a&&d.has(a,"constructor")?a.constructor:function(){return e.apply(this,arguments)},d.extend(c,e,b);var f=function(){this.constructor=c};return f.prototype=e.prototype,c.prototype=new f,a&&d.extend(c.prototype,a),c.__super__=e.prototype,c};n.extend=p.extend=z.extend=u.extend=E.extend=K;var L=function(){throw new Error('A "url" property or function must be specified')},M=function(a,b){var c=b.error;b.error=function(d){c&&c(a,d,b),a.trigger("error",a,d,b)}};return c}),!function(a,b){"use strict";function c(a,b){var c,d,e=a.toLowerCase();for(b=[].concat(b),c=0;b.length>c;c+=1)if(d=b[c]){if(d.test&&d.test(a))return!0;if(d.toLowerCase()===e)return!0}}var d=b.prototype.trim,e=b.prototype.trimRight,f=b.prototype.trimLeft,g=function(a){return 1*a||0},h=function(a,b){if(1>b)return"";for(var c="";b>0;)1&b&&(c+=a),b>>=1,a+=a;return c},i=[].slice,j=function(a){return null==a?"\\s":a.source?a.source:"["+o.escapeRegExp(a)+"]"},k={lt:"<",gt:">",quot:'"',amp:"&",apos:"'"},l={};for(var m in k)l[k[m]]=m;l["'"]="#39";var n=function(){function a(a){return Object.prototype.toString.call(a).slice(8,-1).toLowerCase()}var c=h,d=function(){return d.cache.hasOwnProperty(arguments[0])||(d.cache[arguments[0]]=d.parse(arguments[0])),d.format.call(null,d.cache[arguments[0]],arguments)};return d.format=function(d,e){var f,g,h,i,j,k,l,m=1,o=d.length,p="",q=[];for(g=0;o>g;g++)if(p=a(d[g]),"string"===p)q.push(d[g]);else if("array"===p){if(i=d[g],i[2])for(f=e[m],h=0;i[2].length>h;h++){if(!f.hasOwnProperty(i[2][h]))throw new Error(n('[_.sprintf] property "%s" does not exist',i[2][h]));f=f[i[2][h]]}else f=i[1]?e[i[1]]:e[m++];if(/[^s]/.test(i[8])&&"number"!=a(f))throw new Error(n("[_.sprintf] expecting number but found %s",a(f)));switch(i[8]){case"b":f=f.toString(2);break;case"c":f=b.fromCharCode(f);break;case"d":f=parseInt(f,10);break;case"e":f=i[7]?f.toExponential(i[7]):f.toExponential();break;case"f":f=i[7]?parseFloat(f).toFixed(i[7]):parseFloat(f);break;case"o":f=f.toString(8);break;case"s":f=(f=b(f))&&i[7]?f.substring(0,i[7]):f;break;case"u":f=Math.abs(f);break;case"x":f=f.toString(16);break;case"X":f=f.toString(16).toUpperCase()}f=/[def]/.test(i[8])&&i[3]&&f>=0?"+"+f:f,k=i[4]?"0"==i[4]?"0":i[4].charAt(1):" ",l=i[6]-b(f).length,j=i[6]?c(k,l):"",q.push(i[5]?f+j:j+f)}return q.join("")},d.cache={},d.parse=function(a){for(var b=a,c=[],d=[],e=0;b;){if(null!==(c=/^[^\x25]+/.exec(b)))d.push(c[0]);else if(null!==(c=/^\x25{2}/.exec(b)))d.push("%");else{if(null===(c=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(b)))throw new Error("[_.sprintf] huh?");if(c[2]){e|=1;var f=[],g=c[2],h=[];if(null===(h=/^([a-z_][a-z_\d]*)/i.exec(g)))throw new Error("[_.sprintf] huh?");for(f.push(h[1]);""!==(g=g.substring(h[0].length));)if(null!==(h=/^\.([a-z_][a-z_\d]*)/i.exec(g)))f.push(h[1]);else{if(null===(h=/^\[(\d+)\]/.exec(g)))throw new Error("[_.sprintf] huh?");f.push(h[1])}c[2]=f}else e|=2;if(3===e)throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");d.push(c)}b=b.substring(c[0].length)}return d},d}(),o={VERSION:"2.3.0",isBlank:function(a){return null==a&&(a=""),/^\s*$/.test(a)},stripTags:function(a){return null==a?"":b(a).replace(/<\/?[^>]+>/g,"")},capitalize:function(a){return a=null==a?"":b(a),a.charAt(0).toUpperCase()+a.slice(1)},chop:function(a,c){return null==a?[]:(a=b(a),c=~~c,c>0?a.match(new RegExp(".{1,"+c+"}","g")):[a])},clean:function(a){return o.strip(a).replace(/\s+/g," ")},count:function(a,c){if(null==a||null==c)return 0;a=b(a),c=b(c);for(var d=0,e=0,f=c.length;e=a.indexOf(c,e),-1!==e;)d++,e+=f;return d},chars:function(a){return null==a?[]:b(a).split("")},swapCase:function(a){return null==a?"":b(a).replace(/\S/g,function(a){return a===a.toUpperCase()?a.toLowerCase():a.toUpperCase()})},escapeHTML:function(a){return null==a?"":b(a).replace(/[&<>"']/g,function(a){return"&"+l[a]+";"})},unescapeHTML:function(a){return null==a?"":b(a).replace(/\&([^;]+);/g,function(a,c){var d;return c in k?k[c]:(d=c.match(/^#x([\da-fA-F]+)$/))?b.fromCharCode(parseInt(d[1],16)):(d=c.match(/^#(\d+)$/))?b.fromCharCode(~~d[1]):a})},escapeRegExp:function(a){return null==a?"":b(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},splice:function(a,b,c,d){var e=o.chars(a);return e.splice(~~b,~~c,d),e.join("")},insert:function(a,b,c){return o.splice(a,b,0,c)},include:function(a,c){return""===c?!0:null==a?!1:-1!==b(a).indexOf(c)},join:function(){var a=i.call(arguments),b=a.shift();return null==b&&(b=""),a.join(b)},lines:function(a){return null==a?[]:b(a).split("\n")},reverse:function(a){return o.chars(a).reverse().join("")},startsWith:function(a,c){return""===c?!0:null==a||null==c?!1:(a=b(a),c=b(c),a.length>=c.length&&a.slice(0,c.length)===c)},endsWith:function(a,c){return""===c?!0:null==a||null==c?!1:(a=b(a),c=b(c),a.length>=c.length&&a.slice(a.length-c.length)===c)},succ:function(a){return null==a?"":(a=b(a),a.slice(0,-1)+b.fromCharCode(a.charCodeAt(a.length-1)+1))},titleize:function(a){return null==a?"":(a=b(a).toLowerCase(),a.replace(/(?:^|\s|-)\S/g,function(a){return a.toUpperCase()}))},camelize:function(a){return o.trim(a).replace(/[-_\s]+(.)?/g,function(a,b){return b?b.toUpperCase():""})},underscored:function(a){return o.trim(a).replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase()},dasherize:function(a){return o.trim(a).replace(/([A-Z])/g,"-$1").replace(/[-_\s]+/g,"-").toLowerCase()},classify:function(a){return o.titleize(b(a).replace(/[\W_]/g," ")).replace(/\s/g,"")},humanize:function(a){return o.capitalize(o.underscored(a).replace(/_id$/,"").replace(/_/g," "))},trim:function(a,c){return null==a?"":!c&&d?d.call(a):(c=j(c),b(a).replace(new RegExp("^"+c+"+|"+c+"+$","g"),""))},ltrim:function(a,c){return null==a?"":!c&&f?f.call(a):(c=j(c),b(a).replace(new RegExp("^"+c+"+"),""))},rtrim:function(a,c){return null==a?"":!c&&e?e.call(a):(c=j(c),b(a).replace(new RegExp(c+"+$"),""))},truncate:function(a,c,d){return null==a?"":(a=b(a),d=d||"...",c=~~c,a.length>c?a.slice(0,c)+d:a)},prune:function(a,c,d){if(null==a)return"";if(a=b(a),c=~~c,d=null!=d?b(d):"...",c>=a.length)return a;var e=function(a){return a.toUpperCase()!==a.toLowerCase()?"A":" "},f=a.slice(0,c+1).replace(/.(?=\W*\w*$)/g,e);return f=f.slice(f.length-2).match(/\w\w/)?f.replace(/\s*\S+$/,""):o.rtrim(f.slice(0,f.length-1)),(f+d).length>a.length?a:a.slice(0,f.length)+d},words:function(a,b){return o.isBlank(a)?[]:o.trim(a,b).split(b||/\s+/)},pad:function(a,c,d,e){a=null==a?"":b(a),c=~~c;var f=0;switch(d?d.length>1&&(d=d.charAt(0)):d=" ",e){case"right":return f=c-a.length,a+h(d,f);case"both":return f=c-a.length,h(d,Math.ceil(f/2))+a+h(d,Math.floor(f/2));default:return f=c-a.length,h(d,f)+a}},lpad:function(a,b,c){return o.pad(a,b,c)},rpad:function(a,b,c){return o.pad(a,b,c,"right")},lrpad:function(a,b,c){return o.pad(a,b,c,"both")},sprintf:n,vsprintf:function(a,b){return b.unshift(a),n.apply(null,b)},toNumber:function(a,b){return a?(a=o.trim(a),a.match(/^-?\d+(?:\.\d+)?$/)?g(g(a).toFixed(~~b)):0/0):0},numberFormat:function(a,b,c,d){if(isNaN(a)||null==a)return"";a=a.toFixed(~~b),d="string"==typeof d?d:",";var e=a.split("."),f=e[0],g=e[1]?(c||".")+e[1]:"";return f.replace(/(\d)(?=(?:\d{3})+$)/g,"$1"+d)+g},strRight:function(a,c){if(null==a)return"";a=b(a),c=null!=c?b(c):c;var d=c?a.indexOf(c):-1;return~d?a.slice(d+c.length,a.length):a},strRightBack:function(a,c){if(null==a)return"";a=b(a),c=null!=c?b(c):c;var d=c?a.lastIndexOf(c):-1;return~d?a.slice(d+c.length,a.length):a},strLeft:function(a,c){if(null==a)return"";a=b(a),c=null!=c?b(c):c;var d=c?a.indexOf(c):-1;return~d?a.slice(0,d):a},strLeftBack:function(a,b){if(null==a)return"";a+="",b=null!=b?""+b:b;var c=a.lastIndexOf(b);return~c?a.slice(0,c):a},toSentence:function(a,b,c,d){b=b||", ",c=c||" and ";var e=a.slice(),f=e.pop();return a.length>2&&d&&(c=o.rtrim(b)+c),e.length?e.join(b)+c+f:f},toSentenceSerial:function(){var a=i.call(arguments);return a[3]=!0,o.toSentence.apply(o,a)},slugify:function(a){if(null==a)return"";var c="ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",d="aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",e=new RegExp(j(c),"g");return a=b(a).toLowerCase().replace(e,function(a){var b=c.indexOf(a);return d.charAt(b)||"-"}),o.dasherize(a.replace(/[^\w\s-]/g,""))},surround:function(a,b){return[b,a,b].join("")},quote:function(a,b){return o.surround(a,b||'"')},unquote:function(a,b){return b=b||'"',a[0]===b&&a[a.length-1]===b?a.slice(1,a.length-1):a},exports:function(){var a={};for(var b in this)this.hasOwnProperty(b)&&!b.match(/^(?:include|contains|reverse)$/)&&(a[b]=this[b]);return a},repeat:function(a,c,d){if(null==a)return"";if(c=~~c,null==d)return h(b(a),c);for(var e=[];c>0;e[--c]=a);return e.join(d)},naturalCmp:function(a,c){if(a==c)return 0;if(!a)return-1;if(!c)return 1;for(var d=/(\.\d+)|(\d+)|(\D+)/g,e=b(a).toLowerCase().match(d),f=b(c).toLowerCase().match(d),g=Math.min(e.length,f.length),h=0;g>h;h++){var i=e[h],j=f[h];if(i!==j){var k=parseInt(i,10);if(!isNaN(k)){var l=parseInt(j,10);if(!isNaN(l)&&k-l)return k-l}return j>i?-1:1}}return e.length===f.length?e.length-f.length:c>a?-1:1},levenshtein:function(a,c){if(null==a&&null==c)return 0;if(null==a)return b(c).length;if(null==c)return b(a).length;a=b(a),c=b(c);for(var d,e,f=[],g=0;c.length>=g;g++)for(var h=0;a.length>=h;h++)e=g&&h?a.charAt(h-1)===c.charAt(g-1)?d:Math.min(f[h],f[h-1],d)+1:g+h,d=f[h],f[h]=e;return f.pop()},toBoolean:function(a,b,d){return"number"==typeof a&&(a=""+a),"string"!=typeof a?!!a:(a=o.trim(a),c(a,b||["true","1"])?!0:c(a,d||["false","0"])?!1:void 0)}};o.strip=o.trim,o.lstrip=o.ltrim,o.rstrip=o.rtrim,o.center=o.lrpad,o.rjust=o.lpad,o.ljust=o.rpad,o.contains=o.include,o.q=o.quote,o.toBool=o.toBoolean,"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(module.exports=o),exports._s=o),"function"==typeof define&&define.amd&&define("underscore.string",[],function(){return o}),a._=a._||{},a._.string=a._.str=o}(this,String),function(){var b;b=function(){function b(){}return b.footerText="Are you sure you want to leave this page?",b.defaults={"if":function(){return!0},message:"You have unsaved changes."},b.enable=function(b){return b=e.extend({},this.defaults,b),e(a).bind("beforeunload",function(){return b["if"]()?b.message:void 0}),e(document).on("page:before-change.beforeunload",function(a){return function(c){return b["if"]()?b.cb?(b.cb(c.originalEvent.data.url),!1):confirm(""+b.message+"\n\n"+a.footerText)?a.disable():!1:a.disable()}}(this))},b.disable=function(){return e(a).unbind("beforeunload"),e(document).off("page:before-change.beforeunload")},b}(),a.BeforeUnload=b}.call(this),b.REGEX_PROTOCOL=/^([A-Za-z0-9\+\-\.\&\;\*\s]*?)(?:\:|&*0*58|&*x0*3a)/i,b.RELATIVE="__RELATIVE__",b.ALL="__ALL__",b.prototype.clean_node=function(a){function c(a,b){var c;for(c=0;c<b.length;c++)if(b[c]==a)return c;return-1}function d(){var a,b,c=[],d={};for(a=0;a<arguments.length;a++)if(arguments[a]&&arguments[a].length)for(b=0;b<arguments[a].length;b++)d[arguments[a][b]]||(d[arguments[a][b]]=!0,c.push(arguments[a][b]));return c}function e(a){var b;switch(a.nodeType){case 1:f.call(this,a);break;case 3:b=a.cloneNode(!1),this.current_element.appendChild(b);break;case 5:b=a.cloneNode(!1),this.current_element.appendChild(b);break;case 8:this.config.allow_comments&&(b=a.cloneNode(!1),this.current_element.appendChild(b));break;default:console&&console.log&&console.log("unknown node type",a.nodeType)}}function f(a){var f,h,i,j,k,l,m,n,o,p,q=g.call(this,a);if(a=q.node,i=a.nodeName.toLowerCase(),h=this.current_element,this.allowed_elements[i]||q.whitelist){this.current_element=this.dom.createElement(a.nodeName),h.appendChild(this.current_element);var r=this.config.attributes;for(j=d(r[i],r[b.ALL],q.attr_whitelist),f=0;f<j.length;f++)l=j[f],k=a.attributes[l],k&&(p=!0,this.config.protocols[i]&&this.config.protocols[i][l]&&(n=this.config.protocols[i][l],o=k.nodeValue.toLowerCase().match(b.REGEX_PROTOCOL),p=o?-1!=c(o[1],n):-1!=c(b.RELATIVE,n)),p&&(m=document.createAttribute(l),m.value=k.nodeValue,this.current_element.setAttributeNode(m)));if(this.config.add_attributes[i])for(l in this.config.add_attributes[i])m=document.createAttribute(l),m.value=this.config.add_attributes[i][l],this.current_element.setAttributeNode(m)}else if(-1!=c(a,this.whitelist_nodes)){for(this.current_element=a.cloneNode(!0);this.current_element.childNodes.length>0;)this.current_element.removeChild(this.current_element.firstChild);h.appendChild(this.current_element)}if(!this.config.remove_all_contents&&!this.config.remove_element_contents[i])for(f=0;f<a.childNodes.length;f++)e.call(this,a.childNodes[f]);this.current_element.normalize&&this.current_element.normalize(),this.current_element=h}function g(a){var b,e,f,g={attr_whitelist:[],node:a,whitelist:!1};for(b=0;b<this.transformers.length;b++)if(f=this.transformers[b]({allowed_elements:this.allowed_elements,config:this.config,node:a,node_name:a.nodeName.toLowerCase(),whitelist_nodes:this.whitelist_nodes,dom:this.dom}),null!=f){if("object"!=typeof f)throw new Error("transformer output must be an object or null");
if(f.whitelist_nodes&&f.whitelist_nodes instanceof Array)for(e=0;e<f.whitelist_nodes.length;e++)-1==c(f.whitelist_nodes[e],this.whitelist_nodes)&&this.whitelist_nodes.push(f.whitelist_nodes[e]);g.whitelist=f.whitelist?!0:!1,f.attr_whitelist&&(g.attr_whitelist=d(g.attr_whitelist,f.attr_whitelist)),g.node=f.node?f.node:g.node}return g}var h=this.dom.createDocumentFragment();for(this.current_element=h,this.whitelist_nodes=[],i=0;i<a.childNodes.length;i++)e.call(this,a.childNodes[i]);return h.normalize&&h.normalize(),h},"function"==typeof define&&define("sanitize",[],function(){return b}),b.Config||(b.Config={}),b.Config.RELAXED={elements:["a","b","blockquote","br","caption","cite","code","col","colgroup","dd","dl","dt","em","h1","h2","h3","h4","h5","h6","i","img","li","ol","p","pre","q","small","strike","strong","sub","sup","table","tbody","td","tfoot","th","thead","tr","u","ul"],attributes:{a:["href","title"],blockquote:["cite"],col:["span","width"],colgroup:["span","width"],img:["align","alt","height","src","title","width"],ol:["start","type"],q:["cite"],table:["summary","width"],td:["abbr","axis","colspan","rowspan","width"],th:["abbr","axis","colspan","rowspan","scope","width"],ul:["type"]},protocols:{a:{href:["ftp","http","https","mailto",b.RELATIVE]},blockquote:{cite:["http","https",b.RELATIVE]},img:{src:["http","https",b.RELATIVE]},q:{cite:["http","https",b.RELATIVE]}}},function(){var a,b,c,d,e,f,g=[].slice;c=function(a){var b,d;return!_.isObject(a)||_.isFunction(a)?a:a instanceof Backbone.Collection||a instanceof Backbone.Model?a:_.isDate(a)?new Date(a.getTime()):_.isRegExp(a)?new RegExp(a.source,a.toString().replace(/.*\//,"")):(d=_.isArray(a||_.isArguments(a)),b=function(a,b,e){return d?a.push(c(b)):a[e]=c(b),a},_.reduce(a,b,d?[]:{}))},f=function(a){return null==a?!1:!(a.prototype!=={}.prototype&&a.prototype!==Object.prototype||!_.isObject(a)||_.isArray(a)||_.isFunction(a)||_.isDate(a)||_.isRegExp(a)||_.isArguments(a))},b=function(a){return _.filter(_.keys(a),function(b){return f(a[b])})},a=function(a){return _.filter(_.keys(a),function(b){return _.isArray(a[b])})},e=function(c,d,f){var g,h,i,j,k,l,m,n,o,p;if(null==f&&(f=20),0>=f)return console.warn("_.deepExtend(): Maximum depth of recursion hit."),_.extend(c,d);for(l=_.intersection(b(c),b(d)),h=function(a){return d[a]=e(c[a],d[a],f-1)},m=0,o=l.length;o>m;m++)k=l[m],h(k);for(j=_.intersection(a(c),a(d)),g=function(a){return d[a]=_.union(c[a],d[a])},n=0,p=j.length;p>n;n++)i=j[n],g(i);return _.extend(c,d)},d=function(){var a,b,d,f;if(d=2<=arguments.length?g.call(arguments,0,f=arguments.length-1):(f=0,[]),b=arguments[f++],_.isNumber(b)||(d.push(b),b=20),d.length<=1)return d[0];if(0>=b)return _.extend.apply(this,d);for(a=d.shift();d.length>0;)a=e(a,c(d.shift()),b);return a},_.mixin({deepClone:c,isBasicObject:f,basicObjects:b,arrays:a,deepExtend:d})}.call(this),function(a){"function"==typeof define&&define.amd?define(["underscore","backbone"],a):a(_,Backbone)}(function(a,b){function c(b){var d={},e=g.keyPathSeparator;for(var f in b){var h=b[f];if(h&&h.constructor===Object&&!a.isEmpty(h)){var i=c(h);for(var j in i){var k=i[j];d[f+e+j]=k}}else d[f]=h}return d}function d(b,c,d){for(var e=g.keyPathSeparator,f=c.split(e),h=b,i=0,j=f.length;j>i;i++){if(d&&!a.has(h,f[i]))return!1;if(h=h[f[i]],null==h&&j-1>i&&(h={}),"undefined"==typeof h)return d?!0:h}return d?!0:h}function e(b,c,d,e){e=e||{};for(var f=g.keyPathSeparator,h=c.split(f),i=b,j=0,k=h.length;k>j&&void 0!==i;j++){var l=h[j];j===k-1?e.unset?delete i[l]:i[l]=d:("undefined"!=typeof i[l]&&a.isObject(i[l])||(i[l]={}),i=i[l])}}function f(a,b){e(a,b,null,{unset:!0})}var g=b.Model.extend({constructor:function(b,c){var d,e=b||{};this.cid=a.uniqueId("c"),this.attributes={},c&&c.collection&&(this.collection=c.collection),c&&c.parse&&(e=this.parse(e,c)||{}),(d=a.result(this,"defaults"))&&(e=a.deepExtend({},d,e)),this.set(e,c),this.changed={},this.initialize.apply(this,arguments)},toJSON:function(){return a.deepClone(this.attributes)},get:function(a){return d(this.attributes,a)},set:function(b,h,i){var j,k,l,m,n,o,p,q;if(null==b)return this;if("object"==typeof b?(k=b,i=h||{}):(k={})[b]=h,i||(i={}),!this._validate(k,i))return!1;l=i.unset,n=i.silent,m=[],o=this._changing,this._changing=!0,o||(this._previousAttributes=a.deepClone(this.attributes),this.changed={}),q=this.attributes,p=this._previousAttributes,this.idAttribute in k&&(this.id=k[this.idAttribute]),k=c(k);for(j in k)h=k[j],a.isEqual(d(q,j),h)||m.push(j),a.isEqual(d(p,j),h)?f(this.changed,j):e(this.changed,j,h),l?f(q,j):e(q,j,h);if(!n){m.length&&(this._pending=!0);for(var r=g.keyPathSeparator,s=0,t=m.length;t>s;s++){var b=m[s];this.trigger("change:"+b,this,d(q,b),i);for(var u=b.split(r),v=u.length-1;v>0;v--){var w=a.first(u,v).join(r),x=w+r+"*";this.trigger("change:"+x,this,d(q,w),i)}}}if(o)return this;if(!n)for(;this._pending;)this._pending=!1,this.trigger("change",this,i);return this._pending=!1,this._changing=!1,this},clear:function(b){var d={},e=c(this.attributes);for(var f in e)d[f]=void 0;return this.set(d,a.extend({},b,{unset:!0}))},hasChanged:function(b){return null==b?!a.isEmpty(this.changed):void 0!==d(this.changed,b)},changedAttributes:function(b){if(!b)return this.hasChanged()?c(this.changed):!1;var d=this._changing?this._previousAttributes:this.attributes;b=c(b),d=c(d);var e,f=!1;for(var g in b)a.isEqual(d[g],e=b[g])||((f||(f={}))[g]=e);return f},previous:function(a){return null!=a&&this._previousAttributes?d(this._previousAttributes,a):null},previousAttributes:function(){return a.deepClone(this._previousAttributes)}});return g.keyPathSeparator=".",b.DeepModel=g,"undefined"!=typeof module&&(module.exports=g),b}),function(){var b,c=function(a,b){return function(){return a.apply(b,arguments)}},d=[].slice,e=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};b={},String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),b.Binding=function(){function a(a,b,d,e,f,g){var h,i,j,k;if(this.view=a,this.el=b,this.type=d,this.key=e,this.keypath=f,this.options=null!=g?g:{},this.update=c(this.update,this),this.unbind=c(this.unbind,this),this.bind=c(this.bind,this),this.publish=c(this.publish,this),this.sync=c(this.sync,this),this.set=c(this.set,this),this.formattedValue=c(this.formattedValue,this),!(this.binder=this.view.binders[this.type])){k=this.view.binders;for(h in k)j=k[h],"*"!==h&&-1!==h.indexOf("*")&&(i=new RegExp("^"+h.replace("*",".+")+"$"),i.test(this.type)&&(this.binder=j,this.args=new RegExp("^"+h.replace("*","(.+)")+"$").exec(this.type),this.args.shift()))}this.binder||(this.binder=this.view.binders["*"]),this.binder instanceof Function&&(this.binder={routine:this.binder}),this.formatters=this.options.formatters||[],this.model=this.view.models[this.key]}return a.prototype.formattedValue=function(a){var b,c,e,f,g,h;for(h=this.formatters,f=0,g=h.length;g>f;f++)c=h[f],b=c.split(/\s+/),e=b.shift(),c=this.model[e]instanceof Function?this.model[e]:this.view.formatters[e],(null!=c?c.read:void 0)instanceof Function?a=c.read.apply(c,[a].concat(d.call(b))):c instanceof Function&&(a=c.apply(null,[a].concat(d.call(b))));return a},a.prototype.set=function(a){var b;return a=this.formattedValue(a instanceof Function&&!this.binder["function"]?a.call(this.model):a),null!=(b=this.binder.routine)?b.call(this,this.el,a):void 0},a.prototype.sync=function(){return this.set(this.options.bypass?this.model[this.keypath]:this.view.config.adapter.read(this.model,this.keypath))},a.prototype.publish=function(){var a,c,e,f,g,h,i,j,k;for(f=b.Util.getInputValue(this.el),i=this.formatters.slice(0).reverse(),g=0,h=i.length;h>g;g++)c=i[g],a=c.split(/\s+/),e=a.shift(),(null!=(j=this.view.formatters[e])?j.publish:void 0)&&(f=(k=this.view.formatters[e]).publish.apply(k,[f].concat(d.call(a))));return this.view.config.adapter.publish(this.model,this.keypath,f)},a.prototype.bind=function(){var a,b,c,d,e,f,g,h,i;if(null!=(f=this.binder.bind)&&f.call(this,this.el),this.options.bypass?this.sync():(this.view.config.adapter.subscribe(this.model,this.keypath,this.sync),this.view.config.preloadData&&this.sync()),null!=(g=this.options.dependencies)?g.length:void 0){for(h=this.options.dependencies,i=[],d=0,e=h.length;e>d;d++)a=h[d],/^\./.test(a)?(c=this.model,b=a.substr(1)):(a=a.split("."),c=this.view.models[a.shift()],b=a.join(".")),i.push(this.view.config.adapter.subscribe(c,b,this.sync));return i}},a.prototype.unbind=function(){var a,b,c,d,e,f,g,h,i;if(null!=(f=this.binder.unbind)&&f.call(this,this.el),this.options.bypass||this.view.config.adapter.unsubscribe(this.model,this.keypath,this.sync),null!=(g=this.options.dependencies)?g.length:void 0){for(h=this.options.dependencies,i=[],d=0,e=h.length;e>d;d++)a=h[d],/^\./.test(a)?(c=this.model,b=a.substr(1)):(a=a.split("."),c=this.view.models[a.shift()],b=a.join(".")),i.push(this.view.config.adapter.unsubscribe(c,b,this.sync));return i}},a.prototype.update=function(){return this.unbind(),this.model=this.view.models[this.key],this.bind()},a}(),b.View=function(){function a(a,d,e){var f,g,h,i,j,k,l,m,n;for(this.els=a,this.models=d,this.options=null!=e?e:{},this.update=c(this.update,this),this.publish=c(this.publish,this),this.sync=c(this.sync,this),this.unbind=c(this.unbind,this),this.bind=c(this.bind,this),this.select=c(this.select,this),this.build=c(this.build,this),this.bindingRegExp=c(this.bindingRegExp,this),this.els.jquery||this.els instanceof Array||(this.els=[this.els]),l=["config","binders","formatters"],j=0,k=l.length;k>j;j++){if(g=l[j],this[g]={},this.options[g]){m=this.options[g];for(f in m)h=m[f],this[g][f]=h}n=b[g];for(f in n)h=n[f],null==(i=this[g])[f]&&(i[f]=h)}this.build()}return a.prototype.bindingRegExp=function(){var a;return a=this.config.prefix,a?new RegExp("^data-"+a+"-"):/^data-/},a.prototype.build=function(){var a,c,d,f,g,h,i,j,k,l,m,n=this;for(this.bindings=[],g=[],a=this.bindingRegExp(),f=function(c){var d,f,h,i,j,k,l,m,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;if(e.call(g,c)<0){for(E=c.attributes,y=0,B=E.length;B>y;y++)if(d=E[y],a.test(d.name)){if(w=d.name.replace(a,""),!(h=n.binders[w])){F=n.binders;for(l in F)x=F[l],"*"!==l&&-1!==l.indexOf("*")&&(u=new RegExp("^"+l.replace("*",".+")+"$"),u.test(w)&&(h=x))}if(h||(h=n.binders["*"]),h.block){for(G=c.getElementsByTagName("*"),z=0,C=G.length;C>z;z++)p=G[z],g.push(p);f=[d]}}for(H=f||c.attributes,A=0,D=H.length;D>A;A++)d=H[A],a.test(d.name)&&(q={},w=d.name.replace(a,""),t=function(){var a,b,c,e;for(c=d.value.split("|"),e=[],a=0,b=c.length;b>a;a++)s=c[a],e.push(s.trim());return e}(),i=function(){var a,b,c,d;for(c=t.shift().split("<"),d=[],a=0,b=c.length;b>a;a++)j=c[a],d.push(j.trim());return d}(),r=i.shift(),v=r.split(/\.|:/),q.formatters=t,q.bypass=-1!==r.indexOf(":"),v[0]?m=v.shift():(m=null,v.shift()),o=v.join("."),null!=n.models[m]&&((k=i.shift())&&(q.dependencies=k.split(/\s+/)),n.bindings.push(new b.Binding(n,c,w,m,o,q))));f&&(f=null)}},l=this.els,h=0,j=l.length;j>h;h++)for(c=l[h],f(c),m=c.getElementsByTagName("*"),i=0,k=m.length;k>i;i++)d=m[i],null!=d.attributes&&f(d)},a.prototype.select=function(a){var b,c,d,e,f;for(e=this.bindings,f=[],c=0,d=e.length;d>c;c++)b=e[c],a(b)&&f.push(b);return f},a.prototype.bind=function(){var a,b,c,d,e;for(d=this.bindings,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.bind());return e},a.prototype.unbind=function(){var a,b,c,d,e;for(d=this.bindings,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.unbind());return e},a.prototype.sync=function(){var a,b,c,d,e;for(d=this.bindings,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.sync());return e},a.prototype.publish=function(){var a,b,c,d,e;for(d=this.select(function(a){return a.binder.publishes}),e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.publish());return e},a.prototype.update=function(a){var b,c,d,e;null==a&&(a={}),e=[];for(c in a)d=a[c],this.models[c]=d,e.push(function(){var a,d,e,f;for(e=this.select(function(a){return a.key===c}),f=[],a=0,d=e.length;d>a;a++)b=e[a],f.push(b.update());return f}.call(this));return e},a}(),b.Util={bindEvent:function(b,c,d,e){var f;return f=function(a){return d.call(this,a,e)},null!=a.jQuery?(b=jQuery(b),null!=b.on?b.on(c,f):b.bind(c,f)):null!=a.addEventListener?b.addEventListener(c,f,!1):(c="on"+c,b.attachEvent(c,f)),f},unbindEvent:function(b,c,d){return null!=a.jQuery?(b=jQuery(b),null!=b.off?b.off(c,d):b.unbind(c,d)):a.removeEventListener?b.removeEventListener(c,d,!1):(c="on"+c,b.detachEvent(c,d))},getInputValue:function(b){var c,d,e,f;if(null!=a.jQuery)switch(b=jQuery(b),b[0].type){case"checkbox":return b.is(":checked");default:return b.val()}else switch(b.type){case"checkbox":return b.checked;case"select-multiple":for(f=[],d=0,e=b.length;e>d;d++)c=b[d],c.selected&&f.push(c.value);return f;default:return b.value}}},b.binders={enabled:function(a,b){return a.disabled=!b},disabled:function(a,b){return a.disabled=!!b},checked:{publishes:!0,bind:function(a){return this.currentListener=b.Util.bindEvent(a,"change",this.publish)},unbind:function(a){return b.Util.unbindEvent(a,"change",this.currentListener)},routine:function(a,b){var c;return a.checked="radio"===a.type?(null!=(c=a.value)?c.toString():void 0)===(null!=b?b.toString():void 0):!!b}},unchecked:{publishes:!0,bind:function(a){return this.currentListener=b.Util.bindEvent(a,"change",this.publish)},unbind:function(a){return b.Util.unbindEvent(a,"change",this.currentListener)},routine:function(a,b){var c;return a.checked="radio"===a.type?(null!=(c=a.value)?c.toString():void 0)!==(null!=b?b.toString():void 0):!b}},show:function(a,b){return a.style.display=b?"":"none"},hide:function(a,b){return a.style.display=b?"none":""},html:function(a,b){return a.innerHTML=null!=b?b:""},value:{publishes:!0,bind:function(a){return this.currentListener=b.Util.bindEvent(a,"change",this.publish)},unbind:function(a){return b.Util.unbindEvent(a,"change",this.currentListener)},routine:function(b,c){var d,f,g,h,i,j,k;if(null!=a.jQuery){if(b=jQuery(b),(null!=c?c.toString():void 0)!==(null!=(h=b.val())?h.toString():void 0))return b.val(null!=c?c:"")}else if("select-multiple"===b.type){if(null!=c){for(k=[],f=0,g=b.length;g>f;f++)d=b[f],k.push(d.selected=(i=d.value,e.call(c,i)>=0));return k}}else if((null!=c?c.toString():void 0)!==(null!=(j=b.value)?j.toString():void 0))return b.value=null!=c?c:""}},text:function(a,b){return null!=a.innerText?a.innerText=null!=b?b:"":a.textContent=null!=b?b:""},"on-*":{"function":!0,routine:function(a,c){return this.currentListener&&b.Util.unbindEvent(a,this.args[0],this.currentListener),this.currentListener=b.Util.bindEvent(a,this.args[0],c,this.view)}},"each-*":{block:!0,bind:function(a){return a.removeAttribute(["data",this.view.config.prefix,this.type].join("-").replace("--","-"))},unbind:function(){var a,b,c,d,e;if(null!=this.iterated){for(d=this.iterated,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.unbind());return e}},routine:function(a,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;if(null!=this.iterated)for(u=this.iterated,o=0,r=u.length;r>o;o++)for(n=u[o],n.unbind(),v=n.els,p=0,s=v.length;s>p;p++)e=v[p],e.parentNode.removeChild(e);else this.marker=document.createComment(" rivets: "+this.type+" "),a.parentNode.insertBefore(this.marker,a),a.parentNode.removeChild(a);if(this.iterated=[],c){for(z=[],q=0,t=c.length;t>q;q++){f=c[q],d={},w=this.view.models;for(j in w)i=w[j],d[j]=i;if(d[this.args[0]]=f,g=a.cloneNode(!0),l=this.iterated.length?this.iterated[this.iterated.length-1].els[0]:this.marker,this.marker.parentNode.insertBefore(g,null!=(x=l.nextSibling)?x:null),k={binders:this.view.options.binders,formatters:this.view.options.binders,config:{}},this.view.options.config){y=this.view.options.config;for(h in y)m=y[h],k.config[h]=m}k.config.preloadData=!0,n=new b.View(g,d,k),n.bind(),z.push(this.iterated.push(n))}return z}}},"class-*":function(a,b){var c;return c=" "+a.className+" ",!b==(-1!==c.indexOf(" "+this.args[0]+" "))?a.className=b?""+a.className+" "+this.args[0]:c.replace(" "+this.args[0]+" "," ").trim():void 0},"*":function(a,b){return b?a.setAttribute(this.type,b):a.removeAttribute(this.type)}},b.config={preloadData:!0},b.formatters={},b.factory=function(a){return a.binders=b.binders,a.formatters=b.formatters,a.config=b.config,a.configure=function(a){var c,d;null==a&&(a={});for(c in a)d=a[c],b.config[c]=d},a.bind=function(a,c,d){var e;return null==c&&(c={}),null==d&&(d={}),e=new b.View(a,c,d),e.bind(),e}},"object"==typeof exports?b.factory(exports):"function"==typeof define&&define.amd?define(["exports"],function(a){return b.factory(this.rivets=a),a}):b.factory(this.rivets={})}.call(this);var c,d={AF:"Afghanistan",AX:"Åland Islands",AL:"Albania",DZ:"Algeria",AS:"American Samoa",AD:"Andorra",AO:"Angola",AI:"Anguilla",AQ:"Antarctica",AG:"Antigua and Barbuda",AR:"Argentina",AM:"Armenia",AW:"Aruba",AU:"Australia",AT:"Austria",AZ:"Azerbaijan",BS:"Bahamas",BH:"Bahrain",BD:"Bangladesh",BB:"Barbados",BY:"Belarus",BE:"Belgium",BZ:"Belize",BJ:"Benin",BM:"Bermuda",BT:"Bhutan",BO:"Bolivia, Plurinational State of",BQ:"Bonaire, Sint Eustatius and Saba",BA:"Bosnia and Herzegovina",BW:"Botswana",BV:"Bouvet Island",BR:"Brazil",IO:"British Indian Ocean Territory",BN:"Brunei Darussalam",BG:"Bulgaria",BF:"Burkina Faso",BI:"Burundi",KH:"Cambodia",CM:"Cameroon",CA:"Canada",CV:"Cape Verde",KY:"Cayman Islands",CF:"Central African Republic",TD:"Chad",CL:"Chile",CN:"China",CX:"Christmas Island",CC:"Cocos (Keeling) Islands",CO:"Colombia",KM:"Comoros",CG:"Congo",CD:"Congo, the Democratic Republic of the",CK:"Cook Islands",CR:"Costa Rica",CI:"Côte d'Ivoire",HR:"Croatia",CU:"Cuba",CW:"Curaçao",CY:"Cyprus",CZ:"Czech Republic",DK:"Denmark",DJ:"Djibouti",DM:"Dominica",DO:"Dominican Republic",EC:"Ecuador",EG:"Egypt",SV:"El Salvador",GQ:"Equatorial Guinea",ER:"Eritrea",EE:"Estonia",ET:"Ethiopia",FK:"Falkland Islands (Malvinas)",FO:"Faroe Islands",FJ:"Fiji",FI:"Finland",FR:"France",GF:"French Guiana",PF:"French Polynesia",TF:"French Southern Territories",GA:"Gabon",GM:"Gambia",GE:"Georgia",DE:"Germany",GH:"Ghana",GI:"Gibraltar",GR:"Greece",GL:"Greenland",GD:"Grenada",GP:"Guadeloupe",GU:"Guam",GT:"Guatemala",GG:"Guernsey",GN:"Guinea",GW:"Guinea-Bissau",GY:"Guyana",HT:"Haiti",HM:"Heard Island and McDonald Mcdonald Islands",VA:"Holy See (Vatican City State)",HN:"Honduras",HK:"Hong Kong",HU:"Hungary",IS:"Iceland",IN:"India",ID:"Indonesia",IR:"Iran, Islamic Republic of",IQ:"Iraq",IE:"Ireland",IM:"Isle of Man",IL:"Israel",IT:"Italy",JM:"Jamaica",JP:"Japan",JE:"Jersey",JO:"Jordan",KZ:"Kazakhstan",KE:"Kenya",KI:"Kiribati",KP:"Korea, Democratic People's Republic of",KR:"Korea, Republic of",KW:"Kuwait",KG:"Kyrgyzstan",LA:"Lao People's Democratic Republic",LV:"Latvia",LB:"Lebanon",LS:"Lesotho",LR:"Liberia",LY:"Libya",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MO:"Macao",MK:"Macedonia, the Former Yugoslav Republic of",MG:"Madagascar",MW:"Malawi",MY:"Malaysia",MV:"Maldives",ML:"Mali",MT:"Malta",MH:"Marshall Islands",MQ:"Martinique",MR:"Mauritania",MU:"Mauritius",YT:"Mayotte",MX:"Mexico",FM:"Micronesia, Federated States of",MD:"Moldova, Republic of",MC:"Monaco",MN:"Mongolia",ME:"Montenegro",MS:"Montserrat",MA:"Morocco",MZ:"Mozambique",MM:"Myanmar",NA:"Namibia",NR:"Nauru",NP:"Nepal",NL:"Netherlands",NC:"New Caledonia",NZ:"New Zealand",NI:"Nicaragua",NE:"Niger",NG:"Nigeria",NU:"Niue",NF:"Norfolk Island",MP:"Northern Mariana Islands",NO:"Norway",OM:"Oman",PK:"Pakistan",PW:"Palau",PS:"Palestine, State of",PA:"Panama",PG:"Papua New Guinea",PY:"Paraguay",PE:"Peru",PH:"Philippines",PN:"Pitcairn",PL:"Poland",PT:"Portugal",PR:"Puerto Rico",QA:"Qatar",RE:"Réunion",RO:"Romania",RU:"Russian Federation",RW:"Rwanda",BL:"Saint Barthélemy",SH:"Saint Helena, Ascension and Tristan da Cunha",KN:"Saint Kitts and Nevis",LC:"Saint Lucia",MF:"Saint Martin (French part)",PM:"Saint Pierre and Miquelon",VC:"Saint Vincent and the Grenadines",WS:"Samoa",SM:"San Marino",ST:"Sao Tome and Principe",SA:"Saudi Arabia",SN:"Senegal",RS:"Serbia",SC:"Seychelles",SL:"Sierra Leone",SG:"Singapore",SX:"Sint Maarten (Dutch part)",SK:"Slovakia",SI:"Slovenia",SB:"Solomon Islands",SO:"Somalia",ZA:"South Africa",GS:"South Georgia and the South Sandwich Islands",SS:"South Sudan",ES:"Spain",LK:"Sri Lanka",SD:"Sudan",SR:"Suriname",SJ:"Svalbard and Jan Mayen",SZ:"Swaziland",SE:"Sweden",CH:"Switzerland",SY:"Syrian Arab Republic",TW:"Taiwan, Province of China",TJ:"Tajikistan",TZ:"Tanzania, United Republic of",TH:"Thailand",TL:"Timor-Leste",TG:"Togo",TK:"Tokelau",TO:"Tonga",TT:"Trinidad and Tobago",TN:"Tunisia",TR:"Turkey",TM:"Turkmenistan",TC:"Turks and Caicos Islands",TV:"Tuvalu",UG:"Uganda",UA:"Ukraine",AE:"United Arab Emirates",GB:"United Kingdom",US:"United States",UM:"United States Minor Outlying Islands",UY:"Uruguay",UZ:"Uzbekistan",VU:"Vanuatu",VE:"Venezuela, Bolivarian Republic of",VN:"Viet Nam",VG:"Virgin Islands, British",VI:"Virgin Islands, U.S.",WF:"Wallis and Futuna",EH:"Western Sahara",YE:"Yemen",ZM:"Zambia",ZW:"Zimbabwe"};c={},a.requireOnce=function(a,b){return"undefined"==typeof c[a]?(c[a]=[],null!=b&&c[a].push(b),e.getScript(a,function(){var d,e,f;for(f=c[a],d=0,e=f.length;e>d;d++)(b=f[d])();return c[a]=!0})):c[a]===!0?"function"==typeof b?b():void 0:null!=b?c[a].push(b):void 0};var e,f;e=jQuery,f=_.str,rivets.inputEvent=document.addEventListener?"input":"keyup",rivets.binders.input={publishes:!0,routine:rivets.binders.value.routine,bind:function(a){return e(a).bind(""+rivets.inputEvent+".rivets",this.publish)},unbind:function(a){return e(a).unbind(""+rivets.inputEvent+".rivets")}},rivets.configure({prefix:"rv",adapter:{subscribe:function(a,b,c){return c.wrapped=function(a,b){return c(b)},a.on("change:"+b,c.wrapped)},unsubscribe:function(a,b,c){return a.off("change:"+b,c.wrapped)},read:function(a,b){return"cid"===b?a.cid:a.get(b)},publish:function(a,b,c){return a.cid?a.set(b,c):a[b]=c}}}),function(){var c,d,g,h,i;a.FormRenderer=c=Backbone.View.extend({defaults:{enablePages:!0,screendoorBase:"https://screendoor.dobt.co",target:"[data-formrenderer]",validateImmediately:!1,response:{},preview:!1,skipValidation:void 0,saveParams:{},showLabels:!1,scrollToPadding:0,plugins:["Autosave","WarnBeforeUnload","BottomBar","ErrorBar","LocalStorage"]},constructor:function(a){var b,d,f,g;for(this.options=e.extend({},this.defaults,a),this.requests=0,this.state=new Backbone.Model({hasChanges:!1}),this.setElement(e(this.options.target)),this.$el.addClass("fr_form"),this.$el.data("formrenderer-instance",this),this.subviews={pages:{}},this.serverHeaders={"X-FR-Version":c.VERSION,"X-FR-URL":document.URL},this.plugins=_.map(this.options.plugins,function(a){return function(b){return new c.Plugins[b](a)}}(this)),g=this.plugins,d=0,f=g.length;f>d;d++)b=g[d],"function"==typeof b.beforeFormLoad&&b.beforeFormLoad();return this.$el.html(JST.main(this)),this.trigger("viewRendered",this),this.loadFromServer(function(a){return function(){var c,d,e,f;for(a.$el.find(".fr_loading").remove(),a.initResponseFields(),a.initPages(),a.options.enablePages?a.initPagination():a.initNoPagination(),f=a.plugins,d=0,e=f.length;e>d;d++)b=f[d],"function"==typeof b.afterFormLoad&&b.afterFormLoad();return a.options.validateImmediately&&a.validate(),a.initConditions(),a.trigger("ready"),"function"==typeof(c=a.options).onReady?c.onReady():void 0}}(this)),this.$el.on("submit",function(a){return a.preventDefault()}),this},corsSupported:function(){return"withCredentials"in new XMLHttpRequest},projectUrl:function(){return""+this.options.screendoorBase+"/projects/"+this.options.project_id},loadFromServer:function(a){return null!=this.options.response_fields&&null!=this.options.response.responses?a():e.ajax({url:""+this.options.screendoorBase+"/api/form_renderer/load",type:"get",dataType:"json",data:{project_id:this.options.project_id,response_id:this.options.response.id,v:0},headers:this.serverHeaders,success:function(b){return function(c){var d,e,f;return b.options.response.id=c.response_id,(d=b.options).response_fields||(d.response_fields=c.project.response_fields),(e=b.options.response).responses||(e.responses=(null!=(f=c.response)?f.responses:void 0)||{}),a()}}(this),error:function(a){return function(b){var c;return a.corsSupported()?(a.$el.find(".fr_loading").text('Error loading form: "'+((null!=(c=b.responseJSON)?c.error:void 0)||"Unknown")+'"'),a.trigger("errorSaving",b)):a.$el.find(".fr_loading").html("Sorry, your browser does not support this embedded form. Please visit\n<a href='"+a.projectUrl()+"?fr_not_supported=t'>"+a.projectUrl()+"</a> to fill out\nthis form.")}}(this)})},initResponseFields:function(){var a,b,d,g,h;for(this.response_fields=new Backbone.Collection,h=this.options.response_fields,d=0,g=h.length;g>d;d++)b=h[d],a=new(c.Models["ResponseField"+f.classify(b.field_type)])(b,{form_renderer:this}),a.input_field&&a.setExistingValue(this.options.response.responses[a.get("id")]),this.response_fields.add(a);return this.listenTo(this.response_fields,"change:value change:value.*",e.proxy(this._onChange,this))},initPages:function(){var a,b,d,e,f,g;a=function(a){return function(){return a.subviews.pages[b]=new c.Views.Page({form_renderer:a})}}(this),this.numPages=this.response_fields.filter(function(a){return"page_break"===a.get("field_type")}).length+1,this.state.set("activePage",1),b=1,a(),this.response_fields.each(function(c){return function(d){return"page_break"===d.get("field_type")?(b++,a()):c.subviews.pages[b].models.push(d)}}(this)),f=this.subviews.pages,g=[];for(e in f)d=f[e],g.push(this.$el.append(d.render().el));return g},initPagination:function(){return this.subviews.pagination=new c.Views.Pagination({form_renderer:this}),this.$el.prepend(this.subviews.pagination.render().el),this.subviews.pages[this.state.get("activePage")].show()},initNoPagination:function(){var a,b,c,d;c=this.subviews.pages,d=[];for(b in c)a=c[b],d.push(a.show());return d},initConditions:function(){return this.listenTo(this.response_fields,"change:value change:value.*",function(a){return function(b){return a.runConditions(b)}}(this)),this.allConditions=_.flatten(this.response_fields.map(function(a){return _.map(a.getConditions(),function(b){return _.extend({},b,{parent:a})})}))},activatePage:function(b){return this.subviews.pages[this.state.get("activePage")].hide(),this.subviews.pages[b].show(),a.scrollTo(0,this.options.scrollToPadding),this.state.set("activePage",b)},validate:function(){var a,b,c;c=this.subviews.pages;for(b in c)a=c[b],a.validate();return this.trigger("afterValidate afterValidate:all"),this.areAllPagesValid()},isPageVisible:function(a){return this.subviews.pages[a]&&!!_.find(this.subviews.pages[a].models,function(a){return a.isVisible})},isPageValid:function(a){return!_.find(this.subviews.pages[a].models,function(a){return a.input_field&&a.errors.length>0})},focusFirstError:function(){var b,c;return b=this.invalidPages()[0],this.activatePage(b),c=this.subviews.pages[b].firstViewWithError(),a.scrollTo(0,c.$el.offset().top-this.options.scrollToPadding),c.focus()},invalidPages:function(){var a;return _.filter(function(){a=[];for(var b=1,c=this.numPages;c>=1?c>=b:b>=c;c>=1?b++:b--)a.push(b);return a}.apply(this),function(a){return function(b){return a.isPageValid(b)===!1}}(this))},areAllPagesValid:function(){return 0===this.invalidPages().length},visiblePages:function(){return _.tap([],function(a){return function(b){var c,d,e,f;e=a.subviews.pages,f=[];for(c in e)d=e[c],f.push(a.isPageVisible(c)?b.push(parseInt(c,10)):void 0);return f}}(this))},isFirstPage:function(){var a;return a=this.visiblePages()[0],!a||this.state.get("activePage")===a},isLastPage:function(){var a;return a=_.last(this.visiblePages()),!a||this.state.get("activePage")===a},previousPage:function(){return this.visiblePages()[_.indexOf(this.visiblePages(),this.state.get("activePage"))-1]},nextPage:function(){return this.visiblePages()[_.indexOf(this.visiblePages(),this.state.get("activePage"))+1]},handlePreviousPage:function(){return this.activatePage(this.previousPage())},handleNextPage:function(){return this.isLastPage()||!this.options.enablePages?this.submit():this.activatePage(this.nextPage())},getValue:function(){return _.tap({},function(a){return function(b){return a.response_fields.each(function(a){var c;if(a.input_field&&a.isVisible)return c=a.getValue(),"object"==typeof c&&c.merge?(delete c.merge,_.extend(b,c)):b[a.get("id")]=c})}}(this))},saveParams:function(){return _.extend({v:0,response_id:this.options.response.id,project_id:this.options.project_id,skip_validation:this.options.skipValidation},this.options.saveParams)},_onChange:function(){return this.state.set("hasChanges",!0),this.isSaving?this.changedWhileSaving=!0:void 0},save:function(a){return null==a&&(a={}),this.isSaving?void 0:(this.requests+=1,this.isSaving=!0,this.changedWhileSaving=!1,e.ajax({url:""+this.options.screendoorBase+"/api/form_renderer/save",type:"post",dataType:"json",data:_.extend(this.saveParams(),{raw_responses:this.getValue(),submit:a.submit?!0:void 0}),headers:this.serverHeaders,complete:function(a){return function(){return a.requests-=1,a.isSaving=!1,a.trigger("afterSave")}}(this),success:function(b){return function(c){var d;return b.state.set({hasChanges:b.changedWhileSaving,hasServerErrors:!1}),b.options.response.id=c.response_id,null!=(d=a.cb)?d.apply(b,arguments):void 0}}(this),error:function(a){return function(){return a.state.set({hasServerErrors:!0,submitting:!1})}}(this)}))},waitForRequests:function(a){return this.requests>0?setTimeout(function(b){return function(){return b.waitForRequests(a)}}(this),100):a()},submit:function(a){return null==a&&(a={}),a.skipValidation||this.options.skipValidation||this.validate()?(this.state.set("submitting",!0),this.waitForRequests(function(a){return function(){return a.options.preview?a._preview():a.save({submit:!0,cb:function(){return a.trigger("afterSubmit"),a._afterSubmit()}})}}(this))):void 0},_afterSubmit:function(){var b,c;return c=this.options.afterSubmit,"function"==typeof c?c.call(this):"string"==typeof c?a.location=c.replace(":id",this.options.response.id):"object"==typeof c&&"page"===c.method?(b=e("<div class='fr_after_submit_page'>"+c.html+"</div>"),this.$el.replaceWith(b)):console.log("[FormRenderer] Not sure what to do...")},_preview:function(){var b;return b=function(b){return function(){return a.location=b.options.preview.replace(":id",b.options.response.id)}}(this),!this.state.get("hasChanges")&&this.options.response.id?b():this.save({cb:b})},reflectConditions:function(){var a,b,c,d;c=this.subviews.pages;for(b in c)a=c[b],a.reflectConditions();return null!=(d=this.subviews.pagination)?d.render():void 0},runConditions:function(a){var b;return b=!1,_.each(this.conditionsForResponseField(a),function(a){return a.parent.calculateVisibility()?b=!0:void 0}),b?this.reflectConditions():void 0},conditionsForResponseField:function(a){return _.filter(this.allConditions,function(b){return""+b.response_field_id==""+a.id})},isConditionalVisible:function(a){return new c.ConditionChecker(this,a).isVisible()}}),c.INPUT_FIELD_TYPES=["identification","address","checkboxes","date","dropdown","email","file","number","paragraph","phone","price","radio","table","text","time","website","map_marker"],c.NON_INPUT_FIELD_TYPES=["block_of_text","page_break","section_break"],c.FIELD_TYPES=_.union(c.INPUT_FIELD_TYPES,c.NON_INPUT_FIELD_TYPES),c.BUTTON_CLASS="",c.DEFAULT_LAT_LNG=[40.7700118,-73.9800453],c.MAPBOX_URL="https://api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox.js",c.FILE_TYPES={images:["bmp","gif","jpg","jpeg","png","psd","tif","tiff"],videos:["m4v","mp4","mov","mpg"],audio:["m4a","mp3","wav"],docs:["doc","docx","pdf","rtf","txt"]},c.ADD_ROW_LINK="+ Add another row",c.REMOVE_ROW_LINK="-",c.Views={},c.Models={},c.Validators={},c.Plugins={},c.addPlugin=function(a){return this.prototype.defaults.plugins.push(a)},c.removePlugin=function(a){return this.prototype.defaults.plugins=_.without(this.prototype.defaults.plugins,a)},c.loadLeaflet=function(a){return null!=("undefined"!=typeof L&&null!==L?L.GeoJSON:void 0)?a():requireOnce(c.MAPBOX_URL,a)
},c.initMap=function(a){return L.mapbox.accessToken="pk.eyJ1IjoiYWRhbWphY29iYmVja2VyIiwiYSI6Im1SVEQtSm8ifQ.ZgEOSXsv9eLfGQ-9yAmtIg",L.mapbox.map(a,"adamjacobbecker.ja7plkah")},c.getLength=function(a,b){return"words"===a?(f.trim(b).replace(/['";:,.?¿\-!¡]+/g,"").match(/\S+/g)||"").length:f.trim(b).replace(/\s/g,"").length},d=function(a){var b;return b=/(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi,a.replace(b,"$1<a href='$2' target='_blank'>$2</a>")},h=_.extend({},b.Config.RELAXED),h.attributes.a.push("target"),g=function(a,c){var d,e,f,g,h;try{return f=document.createElement("div"),f.innerHTML=a,h=new b(c||b.Config.RELAXED),d=h.clean_node(f),g=document.createElement("div"),g.appendChild(d.cloneNode(!0)),g.innerHTML}catch(i){return e=i,_.escape(a)}},i=function(a){return null==a&&(a=""),(""+a).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,"$1<br />$2")},c.formatHTML=function(a){return g(d(i(a)),h)},c.toBoolean=function(a){return _.contains(["True","Yes","true","1",1,"yes",!0],a)}}.call(this),function(){FormRenderer.VERSION="0.6.7"}.call(this),function(){var a;a=["US","GB","CA"],FormRenderer.ORDERED_COUNTRIES=_.uniq(_.union(a,[void 0],_.keys(d))),FormRenderer.PROVINCES_CA=["Alberta","British Columbia","Labrador","Manitoba","New Brunswick","Newfoundland","Nova Scotia","Nunavut","Northwest Territories","Ontario","Prince Edward Island","Quebec","Saskatchewen","Yukon"],FormRenderer.PROVINCES_US=["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District Of Columbia","Federated States Of Micronesia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Marshall Islands","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Palau","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]}.call(this),function(){FormRenderer.errors={blank:"This field can't be blank.",identification:"Please enter your name and email address.",date:"Please enter a valid date.",email:"Please enter a valid email address.",integer:"Please enter a whole number.",number:"Please enter a valid number.",price:"Please enter a valid price.",time:"Please enter a valid time.",large:"Your answer is too large.","long":"Your answer is too long.","short":"Your answer is too short.",small:"Your answer is too small.",phone:"Please enter a valid phone number.",us_phone:"Please enter a valid 10-digit phone number."}}.call(this),function(){FormRenderer.ConditionChecker=function(){function a(a,b){var c;this.form_renderer=a,this.condition=b,this.value=(null!=(c=this.responseField())?c.toText():void 0)||""}return a.prototype.method_eq=function(){return this.value.toLowerCase()===this.condition.value.toLowerCase()},a.prototype.method_contains=function(){return!!this.value.toLowerCase().match(this.condition.value.toLowerCase())},a.prototype.method_gt=function(){return parseFloat(this.value)>parseFloat(this.condition.value)},a.prototype.method_lt=function(){return parseFloat(this.value)<parseFloat(this.condition.value)},a.prototype.method_shorter=function(){return this.length()<parseInt(this.condition.value,10)},a.prototype.method_longer=function(){return this.length()>parseInt(this.condition.value,10)},a.prototype.length=function(){return FormRenderer.getLength(this.responseField().getLengthValidationUnits(),this.value)},a.prototype.isValid=function(){return this.responseField()&&_.all(["value","action","response_field_id","method"],function(a){return function(b){return a.condition[b]}}(this))},a.prototype.isVisible=function(){return this.isValid()?this.actionBool()===this["method_"+this.condition.method]():!0},a.prototype.actionBool=function(){return"show"===this.condition.action},a.prototype.responseField=function(){return this.form_renderer.response_fields.get(this.condition.response_field_id)},a}()}.call(this),function(){FormRenderer.Validators.DateValidator={validate:function(a){var b,c,d,e,f,g;return g=parseInt(a.get("value.year"),10)||0,b=parseInt(a.get("value.day"),10)||0,f=parseInt(a.get("value.month"),10)||0,d=1===new Date(g,1,29).getMonth()?29:28,c=[31,d,31,30,31,30,31,31,30,31,30,31],e=c[f-1],g>0&&f>0&&12>=f&&b>0&&e>=b?void 0:"date"}}}.call(this),function(){FormRenderer.Validators.EmailValidator={validate:function(a){return a.get("value").match("@")?void 0:"email"}}}.call(this),function(){FormRenderer.Validators.IdentificationValidator={validate:function(a){return a.get("value.email")&&a.get("value.name")?a.get("value.email").match("@")?void 0:"email":"identification"}}}.call(this),function(){FormRenderer.Validators.IntegerValidator={validate:function(a){return a.get("field_options.integer_only")?a.get("value").match(/^-?\d+$/)?void 0:"integer":void 0}}}.call(this),function(){FormRenderer.Validators.MinMaxLengthValidator={validate:function(a){var b,c,d;if(a.get("field_options.minlength")||a.get("field_options.maxlength"))return d=parseInt(a.get("field_options.minlength"),10)||void 0,c=parseInt(a.get("field_options.maxlength"),10)||void 0,b=FormRenderer.getLength(a.getLengthValidationUnits(),a.get("value")),d&&d>b?"short":c&&b>c?"long":void 0}}}.call(this),function(){FormRenderer.Validators.MinMaxValidator={validate:function(a){var b,c,d;if(a.get("field_options.min")||a.get("field_options.max"))return c=a.get("field_options.min")&&parseFloat(a.get("field_options.min")),b=a.get("field_options.max")&&parseFloat(a.get("field_options.max")),d=parseFloat("price"===a.field_type?""+(a.get("value.dollars")||0)+"."+(a.get("value.cents")||0):a.get("value").replace(/,/g,"")),c&&c>d?"small":b&&d>b?"large":void 0}}}.call(this),function(){FormRenderer.Validators.NumberValidator={validate:function(a){var b,c;return c=a.get("value"),b=a.get("field_options.units"),c=c.replace(/,/g,"").replace(/-/g,"").replace(/^\+/,"").trim(),b&&(c=c.replace(new RegExp(b+"$","i"),"").trim()),c.match(/^-?\d*(\.\d+)?$/)?void 0:"number"}}}.call(this),function(){FormRenderer.Validators.PhoneValidator={validate:function(a){var b,c,d,e;return c="us"===a.get("field_options.phone_format"),d=c?10:7,b=(null!=(e=a.get("value").match(/\d/g))?e.join(""):void 0)||"",b.length>=d?void 0:c?"us_phone":"phone"}}}.call(this),function(){FormRenderer.Validators.PriceValidator={validate:function(a){var b;return b=[],a.get("value.dollars")&&b.push(a.get("value.dollars").replace(/,/g,"").replace(/^\$/,"")),a.get("value.cents")&&b.push(a.get("value.cents")),_.every(b,function(a){return a.match(/^-?\d+$/)})?void 0:"price"}}}.call(this),function(){FormRenderer.Validators.TimeValidator={validate:function(a){var b,c,d;return b=parseInt(a.get("value.hours"),10)||0,c=parseInt(a.get("value.minutes"),10)||0,d=parseInt(a.get("value.seconds"),10)||0,b>=1&&12>=b&&c>=0&&60>=c&&d>=0&&60>=d?void 0:"time"}}}.call(this),function(){var a,b,c,d,e=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};for(FormRenderer.Models.ResponseField=Backbone.DeepModel.extend({input_field:!0,field_type:void 0,validators:[],sync:function(){},initialize:function(a,b){return null==b&&(b={}),this.form_renderer=b.form_renderer,this.errors=[],this.calculateVisibility(),this.hasLengthValidations()?this.listenTo(this,"change:value",this.calculateLength):void 0},validate:function(a){var b,c,d,e,f,g,h;if(null==a&&(a={}),d=this.get("error"),this.errors=[],this.isVisible){if(this.hasValue())for(h=this.validators,f=0,g=h.length;g>f;f++)e=h[f],c=e.validate(this),c&&this.errors.push(FormRenderer.errors[c]);else this.isRequired()&&this.errors.push(FormRenderer.errors.blank);return b=this.getError(),a.clearOnly&&d!==b?this.set("error",null):this.set("error",this.getError()),this.form_renderer.trigger("afterValidate afterValidate:one",this)}},isRequired:function(){return this.get("required")},getError:function(){return this.errors.length>0?this.errors.join(". "):void 0},hasLengthValidations:function(){var a;return a=FormRenderer.Validators.MinMaxLengthValidator,e.call(this.validators,a)>=0&&(this.get("field_options.minlength")||this.get("field_options.maxlength"))},calculateLength:function(){return this.set("currentLength",FormRenderer.getLength(this.getLengthValidationUnits(),this.get("value")))},hasMinMaxValidations:function(){var a;return a=FormRenderer.Validators.MinMaxValidator,e.call(this.validators,a)>=0&&(this.get("field_options.min")||this.get("field_options.max"))},getLengthValidationUnits:function(){return this.get("field_options.min_max_length_units")||"characters"},setExistingValue:function(a){return a&&this.set("value",a),this.hasLengthValidations()?this.calculateLength():void 0},getValue:function(){return this.get("value")},toText:function(){return this.getValue()},hasValue:function(){return!!this.get("value")},hasAnyValueInHash:function(){return _.some(this.get("value"),function(a){return!!a})},hasValueHashKey:function(a){return _.some(a,function(a){return function(b){return!!a.get("value."+b)}}(this))},getOptions:function(){return this.get("field_options.options")||[]},getColumns:function(){return this.get("field_options.columns")||[]},getConditions:function(){return this.get("field_options.conditions")||[]},isConditional:function(){return this.getConditions().length>0},calculateVisibility:function(){var a;return a=!!this.isVisible,this.isVisible=this.form_renderer&&this.isConditional()?_.all(this.getConditions(),function(a){return function(b){return a.form_renderer.isConditionalVisible(b)}}(this)):!0,a!==this.isVisible},getSize:function(){return this.get("field_options.size")||"small"},sizeToHeaderTag:function(){return{large:"h2",medium:"h3",small:"h4"}[this.getSize()]}}),FormRenderer.Models.NonInputResponseField=FormRenderer.Models.ResponseField.extend({input_field:!1,field_type:void 0,validate:function(){},sync:function(){}}),FormRenderer.Models.ResponseFieldIdentification=FormRenderer.Models.ResponseField.extend({field_type:"identification",validators:[FormRenderer.Validators.IdentificationValidator],isRequired:function(){return!0},hasValue:function(){return this.hasValueHashKey(["email","name"])}}),FormRenderer.Models.ResponseFieldMapMarker=FormRenderer.Models.ResponseField.extend({field_type:"map_marker",hasValue:function(){return _.every(["lat","lng"],function(a){return function(b){return!!a.get("value."+b)}}(this))},latLng:function(){return this.hasValue()?[this.get("value.lat"),this.get("value.lng")]:void 0},defaultLatLng:function(){var a,b;return(a=this.get("field_options.default_lat"))&&(b=this.get("field_options.default_lng"))?[a,b]:void 0}}),FormRenderer.Models.ResponseFieldAddress=FormRenderer.Models.ResponseField.extend({field_type:"address",setExistingValue:function(a){var b;return FormRenderer.Models.ResponseField.prototype.setExistingValue.apply(this,arguments),"city_state"===(b=this.get("field_options.address_format"))||"city_state_zip"===b||(null!=a?a.country:void 0)?void 0:this.set("value.country","US")},hasValue:function(){return"country"===this.get("field_options.address_format")?!!this.get("value.country"):this.hasValueHashKey(["street","city","state","zipcode"])},toText:function(){return _.values(_.pick(this.getValue(),"street","city","state","zipcode","country")).join(" ")}}),FormRenderer.Models.ResponseFieldCheckboxes=FormRenderer.Models.ResponseField.extend({field_type:"checkboxes",initialize:function(){return FormRenderer.Models.ResponseField.prototype.initialize.apply(this,arguments),this.on("change:value.other_checkbox",function(a,b){return this.set("showOther",b)})},setExistingValue:function(a){return this.set("value",_.tap({},function(b){return function(c){var d,e,f,g,h,i,j,k,l;if(_.isEmpty(a)){for(k=b.getOptions(),l=[],d=g=0,i=k.length;i>g;d=++g)e=k[d],l.push(c[""+d]=FormRenderer.toBoolean(e.checked));return l}for(j=b.getOptions(),d=f=0,h=j.length;h>f;d=++f)e=j[d],c[""+d]=a[e.label];return null!=a.Other?(c.other_checkbox=!0,c.other=a.Other):void 0}}(this)))},getValue:function(){var a,b,c,d;b={},d=this.get("value");for(a in d)c=d[a],b[a]=c===!0?"on":c;return b},toText:function(){var a;return a=_.tap([],function(a){return function(b){var c,d,e,f;f=a.get("value");for(d in f)e=f[d],c=parseInt(d),e!==!0||_.isNaN(c)||b.push(a.getOptions()[c].label);return a.get("value.other_checkbox")===!0?b.push(a.get("value.other")):void 0}}(this)),a.join(" ")},hasValue:function(){return this.hasAnyValueInHash()}}),FormRenderer.Models.ResponseFieldRadio=FormRenderer.Models.ResponseField.extend({field_type:"radio",initialize:function(){return FormRenderer.Models.ResponseField.prototype.initialize.apply(this,arguments),this.on("change:value.selected",function(a,b){return this.set("showOther","Other"===b)})},setExistingValue:function(a){var b;return(null!=a?a.selected:void 0)?this.set("value",a):(b=_.find(this.getOptions(),function(a){return FormRenderer.toBoolean(a.checked)}))?this.set("value.selected",b.label):this.set("value",{})},getValue:function(){return _.tap({merge:!0},function(a){return function(b){return b[""+a.get("id")]=a.get("value.selected"),b[""+a.get("id")+"_other"]=a.get("value.other")}}(this))},toText:function(){return(this.getValue()||{})[""+this.id]},hasValue:function(){return!!this.get("value.selected")}}),FormRenderer.Models.ResponseFieldDropdown=FormRenderer.Models.ResponseField.extend({field_type:"dropdown",setExistingValue:function(a){var b;return null!=a?FormRenderer.Models.ResponseField.prototype.setExistingValue.apply(this,arguments):(b=_.find(this.getOptions(),function(a){return FormRenderer.toBoolean(a.checked)}),b||this.get("field_options.include_blank_option")||(b=_.first(this.getOptions())),b?this.set("value",b.label):this.unset("value"))}}),FormRenderer.Models.ResponseFieldTable=FormRenderer.Models.ResponseField.extend({field_type:"table",initialize:function(){return FormRenderer.Models.ResponseField.prototype.initialize.apply(this,arguments),this.get("field_options.column_totals")?this.listenTo(this,"change:value.*",this.calculateColumnTotals):void 0},canAddRows:function(){return this.numRows<this.maxRows()},minRows:function(){return parseInt(this.get("field_options.minrows"),10)||0},maxRows:function(){return this.get("field_options.maxrows")?parseInt(this.get("field_options.maxrows"),10)||1/0:1/0},setExistingValue:function(a){var b,c;return b=(null!=(c=_.find(a,function(){return!0}))?c.length:void 0)||0,this.numRows=Math.max(this.minRows(),b,1),this.set("value",_.tap({},function(b){return function(c){var d,e,f,g,h,i;for(i=[],e=g=0,h=b.numRows-1;h>=0?h>=g:g>=h;e=h>=0?++g:--g)i.push(function(){var b,g,h,i,j,k;for(i=this.getColumns(),k=[],f=b=0,g=i.length;g>b;f=++b)d=i[f],c[h=""+f]||(c[h]={}),k.push(c[""+f][""+e]=this.getPresetValue(d.label,e)||(null!=a&&null!=(j=a[d.label])?j[e]:void 0));return k}.call(b));return i}}(this)))},hasValue:function(){return _.some(this.get("value"),function(a){return _.some(a,function(a){return!!a})})},getPresetValue:function(a,b){var c;return null!=(c=this.get("field_options.preset_values."+a))?c[b]:void 0},getValue:function(){var a,b,c,d,e,f,g,h,i;for(d={},b=e=0,h=this.numRows-1;h>=0?h>=e:e>=h;b=h>=0?++e:--e)for(i=this.getColumns(),c=f=0,g=i.length;g>f;c=++f)a=i[c],d[c]||(d[c]=[]),d[c].push(this.get("value."+c+"."+b)||"");return d},toText:function(){return _.flatten(_.values(this.getValue())).join(" ")},calculateColumnTotals:function(){var a,b,c,d,e,f,g,h,i,j,k;for(i=this.getColumns(),k=[],e=f=0,h=i.length;h>f;e=++f){for(a=i[e],c=[],d=g=0,j=this.numRows-1;j>=0?j>=g:g>=j;d=j>=0?++g:--g)c.push(parseFloat((this.get("value."+e+"."+d)||"").replace(/\$?,?/g,"")));b=_.reduce(c,function(a,b){return _.isNaN(b)?a:a+b},0),k.push(this.set("columnTotals."+e,b>0?parseFloat(b.toFixed(10)):""))}return k}}),FormRenderer.Models.ResponseFieldFile=FormRenderer.Models.ResponseField.extend({field_type:"file",getValue:function(){return this.get("value.id")||""},hasValue:function(){return this.hasValueHashKey(["id"])},getAcceptedExtensions:function(){var a;return(a=FormRenderer.FILE_TYPES[this.get("field_options.file_types")])?_.map(a,function(a){return"."+a}):void 0}}),FormRenderer.Models.ResponseFieldDate=FormRenderer.Models.ResponseField.extend({field_type:"date",validators:[FormRenderer.Validators.DateValidator],hasValue:function(){return this.hasValueHashKey(["month","day","year"])},toText:function(){return _.values(_.pick(this.getValue(),"month","day","year")).join("/")}}),FormRenderer.Models.ResponseFieldEmail=FormRenderer.Models.ResponseField.extend({validators:[FormRenderer.Validators.EmailValidator],field_type:"email"}),FormRenderer.Models.ResponseFieldNumber=FormRenderer.Models.ResponseField.extend({validators:[FormRenderer.Validators.NumberValidator,FormRenderer.Validators.MinMaxValidator,FormRenderer.Validators.IntegerValidator],field_type:"number"}),FormRenderer.Models.ResponseFieldParagraph=FormRenderer.Models.ResponseField.extend({field_type:"paragraph",validators:[FormRenderer.Validators.MinMaxLengthValidator]}),FormRenderer.Models.ResponseFieldPrice=FormRenderer.Models.ResponseField.extend({validators:[FormRenderer.Validators.PriceValidator,FormRenderer.Validators.MinMaxValidator],field_type:"price",hasValue:function(){return this.hasValueHashKey(["dollars","cents"])},toText:function(){var a;return a=this.getValue()||{},""+(a.dollars||"0")+"."+(a.cents||"00")}}),FormRenderer.Models.ResponseFieldText=FormRenderer.Models.ResponseField.extend({field_type:"text",validators:[FormRenderer.Validators.MinMaxLengthValidator]}),FormRenderer.Models.ResponseFieldTime=FormRenderer.Models.ResponseField.extend({validators:[FormRenderer.Validators.TimeValidator],field_type:"time",hasValue:function(){return this.hasValueHashKey(["hours","minutes","seconds"])},setExistingValue:function(a){return FormRenderer.Models.ResponseField.prototype.setExistingValue.apply(this,arguments),(null!=a?a.am_pm:void 0)?void 0:this.set("value.am_pm","AM")},toText:function(){var a;return a=this.getValue()||{},""+(a.hours||"00")+":"+(a.minutes||"00")+":"+(a.seconds||"00")+" "+a.am_pm}}),FormRenderer.Models.ResponseFieldWebsite=FormRenderer.Models.ResponseField.extend({field_type:"website"}),FormRenderer.Models.ResponseFieldPhone=FormRenderer.Models.ResponseField.extend({field_type:"phone",validators:[FormRenderer.Validators.PhoneValidator]}),d=FormRenderer.NON_INPUT_FIELD_TYPES,b=0,c=d.length;c>b;b++)a=d[b],FormRenderer.Models["ResponseField"+f.classify(a)]=FormRenderer.Models.NonInputResponseField.extend({field_type:a})}.call(this),function(){FormRenderer.Plugins.Base=function(){function a(a){this.fr=a}return a}()}.call(this),function(){var a={}.hasOwnProperty,b=function(b,c){function d(){this.constructor=b}for(var e in c)a.call(c,e)&&(b[e]=c[e]);return d.prototype=c.prototype,b.prototype=new d,b.__super__=c.prototype,b};FormRenderer.Plugins.Autosave=function(a){function c(){return c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.afterFormLoad=function(){return setInterval(function(a){return function(){return a.fr.state.get("hasChanges")?a.fr.save():void 0}}(this),5e3)},c}(FormRenderer.Plugins.Base)}.call(this),function(){var a={}.hasOwnProperty,b=function(b,c){function d(){this.constructor=b}for(var e in c)a.call(c,e)&&(b[e]=c[e]);return d.prototype=c.prototype,b.prototype=new d,b.__super__=c.prototype,b};FormRenderer.Plugins.BottomBar=function(a){function c(){return c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.afterFormLoad=function(){return this.fr.subviews.bottomBar=new FormRenderer.Plugins.BottomBar.View({form_renderer:this.fr}),this.fr.$el.append(this.fr.subviews.bottomBar.render().el)},c}(FormRenderer.Plugins.Base),FormRenderer.Plugins.BottomBar.View=Backbone.View.extend({events:{"click [data-fr-previous-page]":function(a){return a.preventDefault(),this.form_renderer.handlePreviousPage()},"click [data-fr-next-page]":function(a){return a.preventDefault(),this.form_renderer.handleNextPage()}},initialize:function(a){return this.form_renderer=a.form_renderer,this.listenTo(this.form_renderer.state,"change:activePage change:hasChanges change:submitting change:hasServerErrors",this.render)},render:function(){return this.$el.html(JST["plugins/bottom_bar"](this)),this.form_renderer.trigger("viewRendered",this),this}})}.call(this),function(){var b={}.hasOwnProperty,c=function(a,c){function d(){this.constructor=a}for(var e in c)b.call(c,e)&&(a[e]=c[e]);return d.prototype=c.prototype,a.prototype=new d,a.__super__=c.prototype,a};FormRenderer.Plugins.ErrorBar=function(a){function b(){return b.__super__.constructor.apply(this,arguments)}return c(b,a),b.prototype.afterFormLoad=function(){return this.fr.subviews.errorBar=new FormRenderer.Plugins.ErrorBar.View({form_renderer:this.fr}),this.fr.$el.prepend(this.fr.subviews.errorBar.render().el)},b}(FormRenderer.Plugins.Base),FormRenderer.Plugins.ErrorBar.View=Backbone.View.extend({events:{"click a":function(a){return a.preventDefault(),this.form_renderer.focusFirstError()}},initialize:function(a){return this.form_renderer=a.form_renderer,this.listenTo(this.form_renderer,"afterValidate:all",this.render),this.listenTo(this.form_renderer,"afterValidate:one",function(){return this.form_renderer.areAllPagesValid()?this.render():void 0})},render:function(){return this.$el.html(JST["plugins/error_bar"](this)),this.form_renderer.trigger("viewRendered",this),this.form_renderer.areAllPagesValid()||a.scrollTo(0,this.$el.offset().top-this.form_renderer.options.scrollToPadding),this}})}.call(this),function(){var a={}.hasOwnProperty,b=function(b,c){function d(){this.constructor=b}for(var e in c)a.call(c,e)&&(b[e]=c[e]);return d.prototype=c.prototype,b.prototype=new d,b.__super__=c.prototype,b};FormRenderer.Plugins.LocalStorage=function(a){function c(){return c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.beforeFormLoad=function(){var a,b;if(store.enabled)return a="project-"+this.fr.options.project_id+"-response-id",(b=this.fr.options.response).id||(b.id=store.get(a)),this.fr.on("afterSave",function(){return this.state.get("submitting")?void 0:store.set(a,this.options.response.id)}),this.fr.on("afterSubmit",function(){return store.remove(a)}),this.fr.on("errorSaving",function(){return store.remove(a)})},c}(FormRenderer.Plugins.Base)}.call(this),function(){var b={}.hasOwnProperty,c=function(a,c){function d(){this.constructor=a}for(var e in c)b.call(c,e)&&(a[e]=c[e]);return d.prototype=c.prototype,a.prototype=new d,a.__super__=c.prototype,a};FormRenderer.Plugins.PageState=function(b){function d(){return d.__super__.constructor.apply(this,arguments)}return c(d,b),d.prototype.afterFormLoad=function(){var b,c,d;return(b=null!=(d=a.location.hash.match(/page([0-9]+)/))?d[1]:void 0)&&(c=parseInt(b,10),this.fr.isPageVisible(c)&&this.fr.activatePage(c)),this.fr.state.on("change:activePage",function(b,c){return a.location.hash="page"+c})},d}(FormRenderer.Plugins.Base)}.call(this),function(){var a={}.hasOwnProperty,b=function(b,c){function d(){this.constructor=b}for(var e in c)a.call(c,e)&&(b[e]=c[e]);return d.prototype=c.prototype,b.prototype=new d,b.__super__=c.prototype,b};FormRenderer.Plugins.WarnBeforeUnload=function(a){function c(){return c.__super__.constructor.apply(this,arguments)}return b(c,a),c.prototype.afterFormLoad=function(){return BeforeUnload.enable({"if":function(a){return function(){return a.fr.state.get("hasChanges")}}(this)})},c}(FormRenderer.Plugins.Base)}.call(this),function(){FormRenderer.Views.Page=Backbone.View.extend({className:"fr_page",initialize:function(a){return this.form_renderer=a.form_renderer,this.models=[],this.views=[]},render:function(){var a,b,c,d,e;for(this.hide(),e=this.models,c=0,d=e.length;d>c;c++)a=e[c],b=new(FormRenderer.Views["ResponseField"+f.classify(a.field_type)])({model:a,form_renderer:this.form_renderer}),this.$el.append(b.render().el),b.reflectConditions(),this.views.push(b);return this},hide:function(){var a,b,c,d,e;for(this.$el.hide(),d=this.views,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.trigger("hidden"));return e},show:function(){var a,b,c,d,e;for(this.$el.show(),d=this.views,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.trigger("shown"));return e},reflectConditions:function(){var a,b,c,d,e;for(d=this.views,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.reflectConditions());return e},validate:function(){var a,b,c,d,e;for(d=_.filter(this.models,function(a){return a.input_field}),e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(a.validate());return e},firstViewWithError:function(){return _.find(this.views,function(a){return a.model.errors.length>0})}})}.call(this),function(){FormRenderer.Views.Pagination=Backbone.View.extend({events:{"click [data-activate-page]":function(a){return a.preventDefault(),this.form_renderer.activatePage(e(a.currentTarget).data("activate-page"))}},initialize:function(a){return this.form_renderer=a.form_renderer,this.listenTo(this.form_renderer.state,"change:activePage",this.render),this.listenTo(this.form_renderer,"afterValidate",this.render)},render:function(){return this.$el.html(JST["partials/pagination"](this)),this.form_renderer.trigger("viewRendered",this),this}})}.call(this),function(){var a,b,c,d,g,h,i;for(FormRenderer.Views.ResponseField=Backbone.View.extend({field_type:void 0,className:"fr_response_field",events:{"blur input, textarea, select":"_onBlur"},initialize:function(a){return this.form_renderer=a.form_renderer,this.showLabels=this.form_renderer?this.form_renderer.options.showLabels:a.showLabels,this.model=a.model,this.listenTo(this.model,"afterValidate",this.render),this.listenTo(this.model,"change",this._onInput),this.listenTo(this.model,"change:currentLength",this.auditLength),this.$el.addClass("fr_response_field_"+this.field_type)},getDomId:function(){return this.model.cid},reflectConditions:function(){return this.model.isVisible?this.$el.show():this.$el.hide()},_onBlur:function(){return this.model.hasValue()?setTimeout(function(a){return function(){var b;return b=document.activeElement,e.contains(a.el,b)?void 0:a._isPageButton(b)?e(document).one("mouseup",function(){return a.model.validate()}):a.model.validate()}}(this),1):void 0},_isPageButton:function(a){return a&&(a.hasAttribute("data-fr-next-page")||a.hasAttribute("data-fr-previous-page"))},_onInput:function(){return this.model.errors.length>0?this.model.validate({clearOnly:!0}):void 0},focus:function(){return this.$el.find(":input:eq(0)").focus()},auditLength:function(){var a,b;if(this.model.hasLengthValidations()&&(a=this.$el.find(".fr_length_counter"))[0])return b=FormRenderer.Validators.MinMaxLengthValidator.validate(this.model),"short"===b?a.addClass("is_short").removeClass("is_long"):"long"===b?a.addClass("is_long").removeClass("is_short"):a.removeClass("is_short is_long")},render:function(){var a;return this.$el[this.model.getError()?"addClass":"removeClass"]("error"),this.$el.html(JST["partials/response_field"](this)),rivets.bind(this.$el,{model:this.model}),this.auditLength(),null!=(a=this.form_renderer)&&a.trigger("viewRendered",this),this}}),FormRenderer.Views.NonInputResponseField=FormRenderer.Views.ResponseField.extend({render:function(){var a;return this.$el.html(JST["partials/non_input_response_field"](this)),null!=(a=this.form_renderer)&&a.trigger("viewRendered",this),this}}),FormRenderer.Views.ResponseFieldPrice=FormRenderer.Views.ResponseField.extend({field_type:"price",events:_.extend({},FormRenderer.Views.ResponseField.prototype.events,{'blur [data-rv-input="model.value.cents"]':"formatCents"}),formatCents:function(a){var b;return b=e(a.target).val(),b&&b.match(/^\d$/)?this.model.set("value.cents","0"+b):void 0}}),FormRenderer.Views.ResponseFieldTable=FormRenderer.Views.ResponseField.extend({field_type:"table",events:_.extend({},FormRenderer.Views.ResponseField.prototype.events,{"click .js-add-row":"addRow","click .js-remove-row":"removeRow"}),initialize:function(){return FormRenderer.Views.ResponseField.prototype.initialize.apply(this,arguments),this.on("shown",function(){return this.initExpanding()})},render:function(){return FormRenderer.Views.ResponseField.prototype.render.apply(this,arguments),this.initExpanding(),this},initExpanding:function(){},canRemoveRow:function(a){var b;return b=Math.max(1,this.model.minRows()),a>b-1},addRow:function(a){return a.preventDefault(),this.model.numRows++,this.render()},removeRow:function(a){var b,c,d,f,g;a.preventDefault(),c=e(a.currentTarget).closest("[data-row-index]").data("row-index"),d=this.model.get("value"),f={};for(b in d)g=d[b],f[b]=_.tap({},function(a){var b,d,e;e=[];for(b in g)d=g[b],b=parseInt(b,10),e.push(c>b?a[b]=d:b>c?a[b-1]=d:void 0);return e});return this.model.numRows--,this.model.attributes.value=f,this.model.trigger("change change:value",this.model),this.render()}}),FormRenderer.Views.ResponseFieldFile=FormRenderer.Views.ResponseField.extend({field_type:"file",events:_.extend({},FormRenderer.Views.ResponseField.prototype.events,{"click [data-fr-remove-file]":"doRemove"}),render:function(){return FormRenderer.Views.ResponseField.prototype.render.apply(this,arguments),this.$input=this.$el.find("input"),this.$status=this.$el.find(".js-upload-status"),this.bindChangeEvent(),this},bindChangeEvent:function(){return this.$input.on("change",e.proxy(this.fileChanged,this))},fileChanged:function(a){var b,c;return b=null!=(null!=(c=a.target.files)?c[0]:void 0)?a.target.files[0].name:a.target.value?a.target.value.replace(/^.+\\/,""):"Error reading filename",this.model.set("value.filename",b,{silent:!0}),this.$el.find(".js-filename").text(b),this.$status.text("Uploading..."),this.doUpload()},doUpload:function(){var a,b;return b=e("<form method='post' style='display: inline;' />"),a=this.$input,this.$input=a.clone().hide().val("").insertBefore(a),this.bindChangeEvent(),a.appendTo(b),b.insertBefore(this.$input),this.form_renderer.requests+=1,b.ajaxSubmit({url:""+this.form_renderer.options.screendoorBase+"/api/form_renderer/file",data:{response_field_id:this.model.get("id"),replace_file_id:this.model.get("value.id"),v:0},headers:this.form_renderer.serverHeaders,dataType:"json",uploadProgress:function(a){return function(b,c,d,e){return a.$status.text(100===e?"Finishing up...":"Uploading... ("+e+"%)")}}(this),complete:function(a){return function(){return a.form_renderer.requests-=1,b.remove()}}(this),success:function(a){return function(b){return a.model.set("value.id",b.file_id),a.render()}}(this),error:function(a){return function(b){var c,d;return c=null!=(d=b.responseJSON)?d.errors:void 0,a.$status.text(c?"Error: "+c:"Error"),a.$status.addClass("fr_error"),setTimeout(function(){return a.render()},2e3)}}(this)})},doRemove:function(){return this.model.set("value",{}),this.render()}}),FormRenderer.Views.ResponseFieldMapMarker=FormRenderer.Views.ResponseField.extend({field_type:"map_marker",events:_.extend({},FormRenderer.Views.ResponseField.prototype.events,{"click .fr_map_cover":"enable","click [data-fr-clear-map]":"disable"}),initialize:function(){return FormRenderer.Views.ResponseField.prototype.initialize.apply(this,arguments),this.on("shown",function(){var a;return this.refreshing=!0,null!=(a=this.map)&&a._onResize(),setTimeout(function(a){return function(){return a.refreshing=!1}}(this),0)})},render:function(){return FormRenderer.Views.ResponseField.prototype.render.apply(this,arguments),this.$cover=this.$el.find(".fr_map_cover"),FormRenderer.loadLeaflet(function(a){return function(){return a.initMap(),a.model.latLng()?a.enable():void 0}}(this)),this},initMap:function(){return this.map=FormRenderer.initMap(this.$el.find(".fr_map_map")[0]),this.$el.find(".fr_map_map").data("map",this.map),this.map.setView(this.model.latLng()||this.model.defaultLatLng()||FormRenderer.DEFAULT_LAT_LNG,13),this.marker=L.marker([0,0]),this.map.on("move",e.proxy(this._onMove,this))
},_onMove:function(){var a;if(!this.refreshing)return a=this.map.getCenter(),this.marker.setLatLng(a),this.model.set({value:{lat:a.lat.toFixed(7),lng:a.lng.toFixed(7)}})},enable:function(){return this.map.addLayer(this.marker),this.$cover.hide(),this._onMove()},disable:function(a){return a.preventDefault(),this.map.removeLayer(this.marker),this.$el.find(".fr_map_cover").show(),this.model.set({value:{lat:"",lng:""}})}}),FormRenderer.Views.ResponseFieldAddress=FormRenderer.Views.ResponseField.extend({field_type:"address",initialize:function(){return FormRenderer.Views.ResponseField.prototype.initialize.apply(this,arguments),this.listenTo(this.model,"change:value.country",this.render)}}),FormRenderer.Views.ResponseFieldPhone=FormRenderer.Views.ResponseField.extend({field_type:"phone",phonePlaceholder:function(){return"us"===this.model.get("field_options.phone_format")?"(xxx) xxx-xxxx":void 0}}),h=_.without(FormRenderer.INPUT_FIELD_TYPES,"address","table","file","map_marker","price","phone"),b=0,d=h.length;d>b;b++)a=h[b],FormRenderer.Views["ResponseField"+f.classify(a)]=FormRenderer.Views.ResponseField.extend({field_type:a});for(i=FormRenderer.NON_INPUT_FIELD_TYPES,c=0,g=i.length;g>c;c++)a=i[c],FormRenderer.Views["ResponseField"+f.classify(a)]=FormRenderer.Views.NonInputResponseField.extend({field_type:a})}.call(this),a.JST||(a.JST={}),a.JST["fields/address"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,e=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a,c,f,g,h,i,j,k,l;if(a=this.model.get("field_options.address_format"),e(b("\n\n")),"city_state"!==a&&"city_state_zip"!==a&&"country"!==a&&(e(b('\n  <div class=\'fr_grid\'>\n    <div class=\'fr_full has_sub_label\'>\n      <label class="fr_sub_label">Address</label>\n      <input type="text"\n             id="')),e(this.getDomId()),e(b("\"\n             data-rv-input='model.value.street' />\n    </div>\n  </div>\n"))),e(b("\n\n")),"country"!==a){if(e(b("\n  <div class='fr_grid'>\n    <div class='fr_half has_sub_label'>\n      <label class=\"fr_sub_label\">City</label>\n      <input type=\"text\"\n             data-rv-input='model.value.city' />\n    </div>\n\n    <div class='fr_half has_sub_label'>\n      <label class=\"fr_sub_label\">\n        ")),e("US"===this.model.get("value.country")?b("\n          State\n        "):"CA"===this.model.get("value.country")?b("\n          Province\n        "):b("\n          State / Province / Region\n        ")),e(b("\n      </label>\n\n      ")),"US"===(j=this.model.get("value.country"))||"CA"===j){for(e(b("\n        <select data-rv-value='model.value.state' data-width='100%'>\n          <option></option>\n          ")),k=FormRenderer["PROVINCES_"+this.model.get("value.country")],f=0,h=k.length;h>f;f++)c=k[f],e(b("\n            <option value='")),e(c),e(b("'>")),e(c),e(b("</option>\n          "));e(b("\n        </select>\n      "))}else e(b("\n        <input type=\"text\" data-rv-input='model.value.state' />\n      "));e(b("\n    </div>\n  </div>\n"))}if(e(b("\n\n<div class='fr_grid'>\n  ")),"city_state"!==a&&"country"!==a&&(e(b("\n    <div class='fr_half has_sub_label'>\n      <label class=\"fr_sub_label\">\n        ")),e("US"===this.model.get("value.country")?b("ZIP"):b("Postal")),e(b(" Code\n      </label>\n      <input type=\"text\"\n             data-rv-input='model.value.zipcode' />\n    </div>\n  "))),e(b("\n\n  ")),"city_state"!==a&&"city_state_zip"!==a){for(e(b("\n    <div class='fr_half has_sub_label'>\n      <label class=\"fr_sub_label\">Country</label>\n      <select data-rv-value='model.value.country' data-width='100%'>\n        ")),l=FormRenderer.ORDERED_COUNTRIES,g=0,i=l.length;i>g;g++)c=l[g],e(b("\n          <option value='")),e(c),e(b("'>")),e(d[c]||"---"),e(b("</option>\n        "));e(b("\n      </select>\n    </div>\n  "))}e(b("\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/block_of_text"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_text size_")),d(this.model.getSize()),d(b("'>\n  ")),d(b(FormRenderer.formatHTML(this.model.get("field_options.description")))),d(b("\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/checkboxes"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a,c,e,f,g;for(g=this.model.getOptions(),a=e=0,f=g.length;f>e;a=++e)c=g[a],d(b("\n  <label class='fr_option control'>\n    <input type='checkbox' data-rv-checked='model.value.")),d(a),d(b("' />\n    ")),d(c.label),d(b("\n  </label>\n"));d(b("\n\n")),this.model.get("field_options.include_other_option")&&d(b("\n  <div class='fr_option fr_other_option'>\n    <label class='control'>\n      <input type='checkbox' data-rv-checked='model.value.other_checkbox' />\n      Other\n    </label>\n\n    <input type='text' data-rv-show='model.showOther' data-rv-input='model.value.other' placeholder='Write your answer here' />\n  </div>\n")),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/date"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<div class=\'fr_grid\'>\n  <div class=\'has_sub_label\'>\n    <label class="fr_sub_label">MM</label>\n    <input type="text"\n           id="')),d(this.getDomId()),d(b("\"\n           data-rv-input='model.value.month'\n           maxlength='2'\n           size='2' />\n  </div>\n\n  <div class='fr_spacer'>/</div>\n\n  <div class='has_sub_label'>\n    <label class=\"fr_sub_label\">DD</label>\n    <input type=\"text\"\n           data-rv-input='model.value.day'\n           maxlength='2'\n           size='2' />\n  </div>\n\n  <div class='fr_spacer'>/</div>\n\n  <div class='has_sub_label'>\n    <label class=\"fr_sub_label\">YYYY</label>\n    <input type=\"text\"\n           data-rv-input='model.value.year'\n           maxlength='4'\n           size='4' />\n  </div>\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/dropdown"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a,c,e,f;for(d(b('<select id="')),d(this.getDomId()),d(b("\" data-rv-value='model.value'>\n  ")),this.model.get("field_options.include_blank_option")&&d(b("\n    <option></option>\n  ")),d(b("\n\n  ")),f=this.model.getOptions(),c=0,e=f.length;e>c;c++)a=f[c],d(b('\n    <option value="')),d(a.label),d(b('">')),d(a.label),d(b("</option>\n  "));d(b("\n</select>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/email"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<input type="text" inputmode="email"\n       id="')),d(this.getDomId()),d(b("\"\n       data-rv-input='model.value' />\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/file"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a;this.model.hasValue()?(d(b("\n  <span class='js-filename'>")),d(this.model.get("value.filename")),d(b("</span>\n  <button data-fr-remove-file class='")),d(FormRenderer.BUTTON_CLASS),d(b("'>Remove</button>\n"))):(d(b("\n  <input type='file'\n         id='")),d(this.getDomId()),d(b("'\n         name='file'\n         ")),(a=this.model.getAcceptedExtensions())&&(d(b("\n          accept='")),d(a.join(",")),d(b("'\n         "))),d(b("\n         />\n  <span class='js-upload-status'></span>\n\n  ")),(a=this.model.getAcceptedExtensions())&&(d(b("\n    <div class='fr_description'>\n      We'll accept ")),d(f.toSentence(a)),d(b("\n    </div>\n  "))),d(b("\n"))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/identification"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_grid'>\n  <div class='fr_half'>\n    <label for='")),d(this.getDomId()),d(b("-name'>Name <abbr class='fr_required' title='required'>*</abbr></label>\n    <input type='text'\n           id='")),d(this.getDomId()),d(b("-name'\n           data-rv-input='model.value.name' />\n  </div>\n\n  <div class='fr_half'>\n    <label for='")),d(this.getDomId()),d(b("-email'>Email <abbr class='fr_required' title='required'>*</abbr></label>\n    <input type=\"text\"\n           id='")),d(this.getDomId()),d(b("-email'\n           data-rv-input='model.value.email' />\n  </div>\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/map_marker"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_map_wrapper'>\n  <div class='fr_map_map' />\n\n  <div class='fr_map_cover'>\n    Click to set location\n  </div>\n\n  <div class='fr_map_toolbar'>\n    <div class='fr_map_coord'>\n      <strong>Coordinates:</strong>\n      <span data-rv-show='model.value.lat'>\n        <span data-rv-text='model.value.lat' />,\n        <span data-rv-text='model.value.lng' />\n      </span>\n      <span data-rv-hide='model.value.lat' class='fr_map_no_location'>N/A</span>\n    </div>\n    <a class='fr_map_clear' data-fr-clear-map data-rv-show='model.value.lat' href='#'>Clear</a>\n  </div>\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/number"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<input type="text"\n       id="')),d(this.getDomId()),d(b("\"\n       data-rv-input='model.value' />\n\n")),this.model.get("field_options.units")&&(d(b("\n  <span class='fr_units'>\n    ")),d(this.model.get("field_options.units")),d(b("\n  </span>\n"))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/page_break"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_page_break_inner'>\n  Page break\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/paragraph"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<textarea\n   id="')),d(this.getDomId()),d(b('"\n   class="size_')),d(this.model.getSize()),d(b("\"\n   data-rv-input='model.value' />\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/phone"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<input type="text"\n       inputmode="tel"\n       id="')),d(this.getDomId()),d(b("\"\n       data-rv-input='model.value'\n       placeholder=\"")),d(this.phonePlaceholder()),d(b('" />\n'))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/price"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_grid'>\n  <div class='fr_spacer'>$</div>\n\n  <div class='has_sub_label'>\n    <label class=\"fr_sub_label\">Dollars</label>\n    <input type=\"text\"\n           id=\"")),d(this.getDomId()),d(b("\"\n           data-rv-input='model.value.dollars'\n           size='6' />\n  </div>\n\n  ")),this.model.get("field_options.disable_cents")||d(b("\n    <div class='fr_spacer'>.</div>\n    <div class='has_sub_label'>\n      <label class=\"fr_sub_label\">Cents</label>\n      <input type=\"text\"\n             data-rv-input='model.value.cents'\n             maxlength='2'\n             size='2' />\n    </div>\n  ")),d(b("\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/radio"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a,c,e,f,g;for(g=this.model.getOptions(),a=e=0,f=g.length;f>e;a=++e)c=g[a],d(b("\n  <label class='fr_option control'>\n    <input type='radio'\n           data-rv-checked='model.value.selected'\n           id=\"")),d(this.getDomId()),d(b('"\n           name="')),d(this.getDomId()),d(b('"\n           value="')),d(c.label),d(b('" />\n    ')),d(c.label),d(b("\n  </label>\n"));d(b("\n\n")),this.model.get("field_options.include_other_option")&&(d(b("\n  <div class='fr_option fr_other_option'>\n    <label class='control'>\n      <input type='radio'\n             data-rv-checked='model.value.selected'\n             id=\"")),d(this.getDomId()),d(b('"\n             name="')),d(this.getDomId()),d(b("\"\n             value=\"Other\" />\n      Other\n    </label>\n\n    <input type='text' data-rv-show='model.showOther' data-rv-input='model.value.other' placeholder='Write your answer here' />\n  </div>\n"))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/section_break"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a;a=FormRenderer.formatHTML(this.model.get("field_options.description")),d(b("\n<")),d(this.model.sizeToHeaderTag()),d(b(">")),d(this.model.get("label")),d(b("</")),d(this.model.sizeToHeaderTag()),d(b(">\n")),a&&(d(b("\n  <div class='fr_text size_")),d(this.model.getSize()),d(b("'>\n    ")),d(b(a)),d(b("\n  </div>\n"))),d(b("\n\n<hr />\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/table"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a,c,e,f,g,h,i,j,k,l,m,n,o,p;for(d(b("<table class='fr_table'>\n  <thead>\n    <tr>\n      ")),m=this.model.getColumns(),f=0,j=m.length;j>f;f++)a=m[f],d(b("\n        <th>")),d(a.label),d(b("</th>\n      "));for(d(b("\n\n      <th class='fr_table_col_remove'></th>\n    </tr>\n  </thead>\n\n  <tbody>\n    ")),c=g=0,n=this.model.numRows-1;n>=0?n>=g:g>=n;c=n>=0?++g:--g){for(d(b('\n      <tr data-row-index="')),d(c),d(b('">\n        ')),o=this.model.getColumns(),e=h=0,k=o.length;k>h;e=++h)a=o[e],d(b("\n          ")),this.model.getPresetValue(a.label,c)?(d(b("\n            <td class='fr_table_preset'>\n              <span data-rv-text='model.value.")),d(e),d(b(".")),d(c),d(b("'></span>\n          "))):(d(b("\n            <td>\n              <textarea data-col='")),d(e),d(b("'\n                        data-row='")),d(c),d(b("'\n                        data-rv-input='model.value.")),d(e),d(b(".")),d(c),d(b("'\n                        rows='1' />\n          "))),d(b("\n          </td>\n        "));d(b("\n\n        <td class='fr_table_col_remove'>\n          ")),this.canRemoveRow(c)&&(d(b("\n            <a class='js-remove-row' href='#'>\n              ")),d(b(FormRenderer.REMOVE_ROW_LINK)),d(b("\n            </a>\n          "))),d(b("\n        </td>\n      </tr>\n    "))}if(d(b("\n  </tbody>\n\n  ")),this.model.get("field_options.column_totals")){for(d(b("\n    <tfoot>\n      <tr>\n        ")),p=this.model.getColumns(),e=i=0,l=p.length;l>i;e=++i)a=p[e],d(b("\n          <td data-rv-text='model.columnTotals.")),d(e),d(b("'></td>\n        "));d(b('\n        <td class="fr_table_col_remove"></td>\n      </tr>\n    </tfoot>\n  '))}d(b("\n</table>\n\n<div class='fr_table_add_row_wrapper'>\n  ")),this.model.canAddRows()&&(d(b("\n    <a class='js-add-row' href='#'>\n      ")),d(b(FormRenderer.ADD_ROW_LINK)),d(b("\n    </a>\n  "))),d(b("\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/text"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<input type="text"\n       id="')),d(this.getDomId()),d(b('"\n       class="size_')),d(this.model.getSize()),d(b("\"\n       data-rv-input='model.value' />\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/time"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<div class=\'fr_grid\'>\n  <div class=\'has_sub_label\'>\n    <label class="fr_sub_label">HH</label>\n    <input type="text"\n           id="')),d(this.getDomId()),d(b("\"\n           data-rv-input='model.value.hours'\n           maxlength='2'\n           size='2' />\n  </div>\n\n  <div class='fr_spacer'>:</div>\n\n  <div class='has_sub_label'>\n    <label class=\"fr_sub_label\">MM</label>\n    <input type=\"text\"\n           data-rv-input='model.value.minutes'\n           maxlength='2'\n           size='2' />\n  </div>\n\n  ")),this.model.get("field_options.disable_seconds")||d(b("\n    <div class='fr_spacer'>:</div>\n\n    <div class='has_sub_label'>\n      <label class=\"fr_sub_label\">SS</label>\n      <input type=\"text\"\n             data-rv-input='model.value.seconds'\n             maxlength='2'\n             size='2' />\n    </div>\n  ")),d(b("\n\n  <div class='has_sub_label'>\n    <select data-rv-value='model.value.am_pm' data-width='auto'>\n      <option value='AM'>AM</option>\n      <option value='PM'>PM</option>\n    </select>\n  </div>\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["fields/website"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<input type="text" inputmode="url"\n       id="')),d(this.getDomId()),d(b("\"\n       data-rv-input='model.value'\n       placeholder='http://' />\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST.main=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_loading'>\n  Loading form...\n</div>"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/description"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){this.model.get("field_options.description")&&(d(b("\n  <div class='fr_description'>\n    ")),d(b(FormRenderer.formatHTML(this.model.get("field_options.description")))),d(b("\n  </div>\n"))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/error"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<div class='fr_error' data-rv-show='model.error' data-rv-text='model.error'></div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/label"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b('<label for="')),d(this.getDomId()),d(b('">\n  ')),d(this.model.get("label")),d(b("\n  ")),this.model.get("required")&&d(b("<abbr class='fr_required' title='required'>*</abbr>")),d(b("\n\n  ")),this.showLabels&&(d(b("\n    ")),this.model.get("blind")&&d(b("\n      <span class='label'>Blind</span>\n    ")),d(b("\n    ")),this.model.get("admin_only")&&d(b("\n      <span class='label'>Hidden</span>\n    ")),d(b("\n    ")),this.model.isConditional()&&d(b("\n      <span class='label'>Hidden until rules are met</span>\n    ")),d(b("\n  "))),d(b("\n</label>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/length_counter"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b("<span class='fr_length_counter' data-rv-text='model.currentLength'></span>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/length_validations"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){this.model.hasLengthValidations()&&(d(b("\n  <div class='fr_min_max'>\n    <span class='fr_min_max_guide'>\n      ")),this.model.get("field_options.minlength")&&this.model.get("field_options.maxlength")?(d(b("\n        Enter between ")),d(this.model.get("field_options.minlength")),d(b(" and ")),d(this.model.get("field_options.maxlength")),d(b(" ")),d(this.model.getLengthValidationUnits()),d(b(".\n      "))):this.model.get("field_options.minlength")?(d(b("\n        Enter at least ")),d(this.model.get("field_options.minlength")),d(b(" ")),d(this.model.getLengthValidationUnits()),d(b(".\n      "))):this.model.get("field_options.maxlength")&&(d(b("\n        Enter up to ")),d(this.model.get("field_options.maxlength")),d(b(" ")),d(this.model.getLengthValidationUnits()),d(b(".\n      "))),d(b("\n    </span>\n\n    ")),d(b(JST["partials/length_counter"](this))),d(b("\n  </div>\n"))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/min_max_validations"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){this.model.hasMinMaxValidations()&&(d(b("\n  <div class='fr_min_max'>\n    ")),this.model.get("field_options.min")&&this.model.get("field_options.max")?(d(b("\n      Between ")),d(this.model.get("field_options.min")),d(b(" and ")),d(this.model.get("field_options.max")),d(b(".\n    "))):this.model.get("field_options.min")?(d(b("\n      Enter a number that is at least ")),d(this.model.get("field_options.min")),d(b(".\n    "))):this.model.get("field_options.max")&&(d(b("\n      Enter a number up to ")),d(this.model.get("field_options.max")),d(b(".\n    "))),d(b("\n  </div>\n"))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/non_input_response_field"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b(JST["fields/"+this.field_type](this))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/pagination"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a,c,e,f,g;if(this.form_renderer.visiblePages().length>1){for(d(b("\n  <ul class='fr_pagination'>\n    ")),g=this.form_renderer.visiblePages(),c=e=0,f=g.length;f>e;c=++e)a=g[c],d(b("\n      <li class='")),this.form_renderer.isPageValid(a)||d(b("has_errors")),d(b("'>\n        ")),a===this.form_renderer.state.get("activePage")?(d(b("\n          <span>")),d(c+1),d(b("</span>\n        </li>\n        "))):(d(b('\n          <a data-activate-page="')),d(a),d(b("\" href='#'>\n            ")),d(c+1),d(b("\n          </a>\n        "))),d(b("\n      </li>\n    "));d(b("\n  </ul>\n"))}d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["partials/response_field"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){d(b(JST["partials/label"](this))),d(b("\n<div class='fr_field_wrapper'>\n  ")),d(b(JST["fields/"+this.field_type](this))),d(b("\n</div>\n\n")),d(b(JST["partials/length_validations"](this))),d(b("\n")),d(b(JST["partials/min_max_validations"](this))),d(b("\n")),d(b(JST["partials/error"](this))),d(b("\n")),d(b(JST["partials/description"](this))),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d
}())},a.JST||(a.JST={}),a.JST["plugins/bottom_bar"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){var a=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};d(b("<div class='fr_bottom'>\n  ")),a.call(this.form_renderer.options.plugins,"Autosave")>=0&&(d(b("\n    <div class='fr_bottom_l'>\n      ")),d(this.form_renderer.state.get("hasServerErrors")?b("\n        Error saving\n      "):this.form_renderer.state.get("hasChanges")?b("\n        Saving...\n      "):b("\n        Saved\n      ")),d(b("\n    </div>\n  "))),d(b("\n\n  <div class='fr_bottom_r'>\n    ")),this.form_renderer.isFirstPage()||(d(b("\n      <button data-fr-previous-page class='")),d(FormRenderer.BUTTON_CLASS),d(b("'>\n        Back to page ")),d(this.form_renderer.previousPage()),d(b("\n      </button>\n    "))),d(b("\n\n    ")),this.form_renderer.state.get("submitting")?(d(b("\n      <button disabled class='")),d(FormRenderer.BUTTON_CLASS),d(b("'>\n        Submitting...\n      </button>\n    "))):(d(b("\n      <button data-fr-next-page class='")),d(FormRenderer.BUTTON_CLASS),d(b("'>\n        ")),d(this.form_renderer.isLastPage()||!this.form_renderer.options.enablePages?b("Submit"):b("Next page")),d(b("\n      </button>\n    "))),d(b("\n  </div>\n</div>\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())},a.JST||(a.JST={}),a.JST["plugins/error_bar"]=function(a){var b=function(a){"undefined"==typeof a&&null==a&&(a="");var b=new String(a);return b.ecoSafe=!0,b};return function(){var a=[],c=this,d=function(b){"undefined"!=typeof b&&null!=b&&a.push(b.ecoSafe?b:c.escape(b))};return function(){this.form_renderer.areAllPagesValid()||d(b("\n  <div class='fr_error_alert_bar'>\n    Your response has validation errors.\n    <a href='#'>Fix errors</a>\n  </div>\n")),d(b("\n"))}.call(this),a.join("")}.call(function(){var c,d={escape:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},safe:b};for(c in a)d[c]=a[c];return d}())}}(window);
(function() {
  var Formbuilder, buildModel, classify, optionsForResponseField, sizeMed, validators,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  classify = function(field_type) {
    return "ResponseField" + (_.str.classify(field_type));
  };

  buildModel = function(attrs) {
    return new FormRenderer.Models[classify(attrs.field_type)](attrs);
  };

  optionsForResponseField = function(model) {
    var ref;
    if ((ref = model.field_type) === 'dropdown' || ref === 'checkboxes' || ref === 'radio') {
      return _.map(model.getOptions(), function(opt) {
        return opt.label;
      });
    }
  };

  window.Formbuilder = Formbuilder = Backbone.View.extend({
    events: {
      'click .js-add-field': function() {
        return this.setLeft('add');
      },
      'mouseover .fb_left': 'lockLeftWrapper',
      'mouseout .fb_left': 'unlockLeftWrapper',
      'click .fb_add_field_wrapper a': '_addFieldViaClick',
      'click [data-change-id-level]': function() {
        return Turbolinks.visit(window.location.pathname.replace('/response_form', '/responses'));
      }
    },
    defaults: {
      selector: '[data-formbuilder]'
    },
    initialize: function(options) {
      var j, len, model, ref, rf;
      this.options = $.extend({}, this.defaults, options);
      this.state = new Backbone.Model;
      new Formbuilder.StatusIndicatorController({
        fb: this
      });
      this.setElement($(this.options.selector));
      this.$el.data('formbuilder-instance', this);
      this.fieldsForDeletion = [];
      this.collection = new Formbuilder.Collection(null, {
        parentView: this
      });
      this.collection.bind('add', this._onCollectionAdd, this);
      this.listenTo(this.collection, 'destroy', function(model) {
        if (model.get('id')) {
          this.fieldsForDeletion.push(model.get('id'));
        }
        this.ensureEditPaneScrolled();
        return this._onChange();
      });
      this.render();
      ref = this.options.bootstrapData;
      for (j = 0, len = ref.length; j < len; j++) {
        rf = ref[j];
        model = buildModel(rf);
        this.collection.add(model, {
          sort: false
        });
      }
      this.collection.bind('change add', this._onChange, this);
      this.autosaver = new Autosaver({
        fn: (function(_this) {
          return function(done) {
            var initFieldsForDeletion;
            if (!_this.isValid()) {
              return done();
            }
            _this.collection.sort();
            initFieldsForDeletion = _.clone(_this.fieldsForDeletion);
            return $.ajax({
              url: _this.options.endpoint,
              type: 'put',
              data: JSON.stringify({
                fields: _this.collection.toJSON(),
                fields_marked_for_deletion: initFieldsForDeletion,
                last_updated: _this.options.last_updated
              }),
              contentType: 'application/json',
              complete: function() {
                return done();
              },
              error: function(xhr) {
                var conflict, ref1;
                _this.state.set({
                  hasServerErrors: true
                });
                _this.trigger('refreshStatus');
                conflict = xhr.status === 409;
                DvlFlash('error', ((ref1 = xhr.responseJSON) != null ? ref1.error : void 0) || t('flash.error.generic'), conflict ? 100000000 : void 0);
                if (conflict) {
                  _this.saveDisabled = true;
                  _this.autosaver.clear();
                  return BeforeUnload.disable();
                }
              },
              success: function(data) {
                var datum, l, len1, ref1, ref2, results;
                _this.options.last_updated = data.last_updated;
                _this.state.set({
                  hasServerErrors: false
                });
                _this.trigger('refreshStatus');
                _this.fieldsForDeletion = _.difference(_this.fieldsForDeletion, initFieldsForDeletion);
                ref1 = data.response_fields;
                results = [];
                for (l = 0, len1 = ref1.length; l < len1; l++) {
                  datum = ref1[l];
                  results.push((ref2 = _this.collection.get(datum.cid)) != null ? ref2.set({
                    id: datum.id
                  }, {
                    silent: true
                  }) : void 0);
                }
                return results;
              }
            });
          };
        })(this)
      });
      this.initSortable();
      this.initDraggable();
      this.initBeforeUnload();
      return this.initLeftScroll();
    },
    render: function() {
      var idView;
      this.$el.html(JST['form_builder/templates/page']({
        view: this
      }));
      if (this.options.identificationFields) {
        idView = new FormRenderer.Views.ResponseFieldIdentification({
          model: new FormRenderer.Models.ResponseFieldIdentification
        });
        this.$el.find('.fb_identification_cover').after(idView.render().$el);
        Formbuilder.disableTabbing(idView.$el);
      }
      this.$fbLeft = this.$el.find('.fb_left');
      this.$leftAdd = this.$el.find('.fb_add_field_wrapper');
      this.$leftEdit = this.$el.find('.fb_edit_field_wrapper');
      this.$responseFields = this.$el.find('.fb_response_fields');
      this.$el.initialize();
      return this;
    },
    initLeftScroll: function() {
      var scrollHandler;
      scrollHandler = _.debounce((function(_this) {
        return function() {
          var desiredMargin, difference, maxMargin, newMargin, oldMargin, transitionLength;
          if (_this.scrollingPage) {
            return;
          }
          oldMargin = parseFloat(_this.$fbLeft.css('margin-top'));
          desiredMargin = $(window).scrollTop() - _this.$el.offset().top + 60;
          maxMargin = _this.$responseFields.height();
          newMargin = Math.max(0, Math.min(maxMargin, desiredMargin));
          difference = Math.abs(oldMargin - newMargin);
          transitionLength = Math.min(difference * 1.5, 250);
          return _this.$fbLeft.animate({
            'margin-top': newMargin
          }, transitionLength);
        };
      })(this), 100);
      return $(window).on('scroll', (function(_this) {
        return function() {
          if (!_this.leftWrapperLocked) {
            return scrollHandler();
          }
        };
      })(this));
    },
    initBeforeUnload: function() {
      return BeforeUnload.enable({
        "if": (function(_this) {
          return function() {
            return _this.autosaver.isPending() || !_this.isValid();
          };
        })(this),
        cb: (function(_this) {
          return function(url) {
            if (!_this.isValid()) {
              return false;
            }
            return _this.autosaver.ensure(function() {
              return Turbolinks.visit(url);
            });
          };
        })(this)
      });
    },
    initSortable: function() {
      return new Sortable(this.$responseFields[0], {
        group: {
          name: 'responseFields',
          pull: false,
          put: true
        },
        onUpdate: (function(_this) {
          return function(_e) {
            _this._onChange();
            return _this.ensureEditPaneScrolled();
          };
        })(this),
        onAdd: (function(_this) {
          return function(e) {
            _this.addField($(e.item).data('field-type'), {
              $replaceEl: $(e.item)
            });
            return _this._onChange();
          };
        })(this)
      });
    },
    initDraggable: function() {
      var opts;
      opts = {
        group: {
          name: 'responseFields',
          pull: 'clone',
          put: false
        },
        sort: false
      };
      return $('.fb_add_field_section').each(function() {
        return new Sortable(this, opts);
      });
    },
    setLeft: function(addOrEdit) {
      if (addOrEdit === 'edit') {
        this.$leftEdit.show();
        return this.$leftAdd.hide();
      } else {
        this.removeEditPane();
        this.$leftAdd.show();
        return this.$leftEdit.hide();
      }
    },
    lockLeftWrapper: function() {
      return this.leftWrapperLocked = true;
    },
    unlockLeftWrapper: function() {
      return this.leftWrapperLocked = false;
    },
    ensureEditPaneScrolled: function() {
      if (this.editView) {
        return this.scrollToField($(".fb_field_wrapper.editing"));
      }
    },
    scrollToField: function($responseFieldEl) {
      var scrollPos;
      if ($responseFieldEl[0]) {
        this.scrollingPage = true;
        scrollPos = this.$el.offset().top + $responseFieldEl.offset().top - this.$responseFields.offset().top;
        return $.scrollWindowTo(scrollPos, 200, (function(_this) {
          return function() {
            return _this.scrollingPage = false;
          };
        })(this));
      }
    },
    allFields: function() {
      return this.$el.find('.fb_field_wrapper');
    },
    modelEl: function(model) {
      return this.allFields().filter(function(_, el) {
        return $(el).data('cid') === model.cid;
      });
    },
    modelDOMIndex: function(model) {
      return this.allFields().index(this.modelEl(model));
    },
    _onCollectionAdd: function(rf, _, options) {
      var $replacePosition, view;
      rf.set('showOther', true);
      view = new Formbuilder.Views.ViewField({
        model: rf,
        parentView: this
      });
      if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position != null) && ($replacePosition = this.$responseFields.find(".fb_field_wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    },
    _addFieldViaClick: function(e) {
      var $editing, position;
      position = ($editing = this.$el.find(".fb_field_wrapper.editing"))[0] ? this.$el.find('.fb_field_wrapper').index($editing) + 1 : void 0;
      return this.addField($(e.currentTarget).data('field-type'), {
        position: position
      });
    },
    addField: function(attrs, options) {
      var model;
      if (typeof attrs === 'string') {
        attrs = Formbuilder.DEFAULT_FIELD_ATTRS(attrs);
      }
      model = buildModel(attrs);
      model.typeUnlocked = true;
      this.collection.add(model, _.extend(options || {}, {
        sort: false
      }));
      this.collection.sort();
      this.collection.validateField(model);
      return this.showEditPane(model);
    },
    removeEditPane: function() {
      var ref;
      if ((ref = this.editView) != null) {
        ref.remove();
      }
      return this.editView = void 0;
    },
    showEditPane: function(model) {
      var $responseFieldEl;
      this.unlockLeftWrapper();
      $responseFieldEl = this.modelEl(model);
      $responseFieldEl.addClass('editing').siblings('.fb_field_wrapper').removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid) {
          this.setLeft('edit');
          this.scrollToField($responseFieldEl);
          return;
        } else {
          this.editView.remove();
        }
      }
      this.editView = new Formbuilder.Views.EditField({
        model: model,
        parentView: this
      });
      this.$el.find(".fb_edit_field_inner").html(this.editView.render().$el);
      this.setLeft('edit');
      this.$el.find('[data-rv-input="model.label"]').focus();
      this.scrollToField($responseFieldEl);
      return this;
    },
    isValid: function() {
      return this.collection.all(function(m) {
        return m.isValid;
      });
    },
    calculateValidation: function() {
      this.state.set('hasValidationErrors', !this.isValid());
      return this.trigger('refreshStatus');
    },
    _onChange: function() {
      this.autosaver.saveLater();
      return this.trigger('refreshStatus');
    }
  });

  Formbuilder.Views = {};

  Formbuilder.DEFAULT_FIELD_ATTRS = function(field_type) {
    var base;
    return _.extend({
      label: 'Untitled',
      field_type: field_type,
      required: true,
      field_options: {}
    }, (typeof (base = Formbuilder.FIELD_TYPES[field_type]).defaultAttributes === "function" ? base.defaultAttributes() : void 0) || {});
  };

  Formbuilder.DEFAULT_OPTIONS = function() {
    return [
      {
        label: 'Option 1',
        checked: false
      }, {
        label: 'Option 2',
        checked: false
      }
    ];
  };

  Formbuilder.options = {
    BUTTON_CLASS: 'button small'
  };

  Formbuilder.mappings = {
    SIZE: 'field_options.size',
    UNITS: 'field_options.units',
    LABEL: 'label',
    FIELD_TYPE: 'field_type',
    REQUIRED: 'required',
    ADMIN_ONLY: 'admin_only',
    BLIND: 'blind',
    OPTIONS: 'field_options.options',
    COLUMNS: 'field_options.columns',
    COLUMN_TOTALS: 'field_options.column_totals',
    PRESET_VALUES: 'field_options.preset_values',
    DESCRIPTION: 'field_options.description',
    INCLUDE_OTHER: 'field_options.include_other_option',
    INCLUDE_BLANK: 'field_options.include_blank_option',
    INTEGER_ONLY: 'field_options.integer_only',
    MIN: 'field_options.min',
    MAX: 'field_options.max',
    MINLENGTH: 'field_options.minlength',
    MAXLENGTH: 'field_options.maxlength',
    MINROWS: 'field_options.minrows',
    MAXROWS: 'field_options.maxrows',
    LENGTH_UNITS: 'field_options.min_max_length_units',
    DISABLE_CENTS: 'field_options.disable_cents',
    DISABLE_SECONDS: 'field_options.disable_seconds',
    DEFAULT_LAT: 'field_options.default_lat',
    DEFAULT_LNG: 'field_options.default_lng',
    ADDRESS_FORMAT: 'field_options.address_format',
    FILE_TYPES: 'field_options.file_types',
    CONDITIONS: 'field_options.conditions',
    PHONE_FORMAT: 'field_options.phone_format'
  };

  sizeMed = function() {
    return {
      field_options: {
        size: 'medium'
      }
    };
  };

  Formbuilder.FIELD_CATEGORIES = {
    'Inputs': {
      text: {
        name: 'Text',
        icon: 'font',
        defaultAttributes: sizeMed
      },
      paragraph: {
        name: 'Paragraph',
        buttonHtml: "<span class=\"symbol\">&#182;</span> Paragraph",
        defaultAttributes: sizeMed
      },
      checkboxes: {
        name: 'Checkboxes',
        icon: 'check',
        defaultAttributes: function() {
          return {
            field_options: {
              options: Formbuilder.DEFAULT_OPTIONS()
            }
          };
        }
      },
      radio: {
        name: 'Multiple Choice',
        icon: 'circle-o',
        defaultAttributes: function() {
          return {
            field_options: {
              options: Formbuilder.DEFAULT_OPTIONS()
            }
          };
        }
      },
      date: {
        name: 'Date',
        icon: 'calendar'
      },
      dropdown: {
        name: 'Dropdown',
        icon: 'caret-down',
        defaultAttributes: function() {
          return {
            field_options: {
              options: Formbuilder.DEFAULT_OPTIONS(),
              include_blank_option: false
            }
          };
        }
      },
      time: {
        name: 'Time',
        icon: 'clock-o',
        defaultAttributes: function() {
          return {
            field_options: {
              disable_seconds: true
            }
          };
        }
      },
      number: {
        name: 'Numeric',
        buttonHtml: "<span class=\"symbol\">123</span> Numeric"
      },
      phone: {
        name: 'Phone',
        icon: 'phone',
        defaultAttributes: function() {
          return {
            field_options: {
              phone_format: 'us'
            }
          };
        }
      },
      website: {
        name: 'Website',
        icon: 'link'
      },
      email: {
        name: 'Email',
        icon: 'envelope'
      },
      price: {
        name: 'Price',
        icon: 'usd'
      },
      address: {
        name: 'Address',
        icon: 'home'
      },
      file: {
        name: 'File',
        icon: 'cloud-upload'
      },
      table: {
        name: 'Table',
        icon: 'table',
        defaultAttributes: function() {
          return {
            field_options: {
              columns: [
                {
                  label: 'Column 1'
                }, {
                  label: 'Column 2'
                }
              ]
            }
          };
        }
      }
    },
    'Geographic': {
      map_marker: {
        name: 'Map Marker',
        icon: 'map-marker'
      }
    },
    'Non-input': {
      section_break: {
        name: 'Section Break',
        icon: 'minus',
        defaultAttributes: sizeMed
      },
      page_break: {
        name: 'Page Break',
        icon: 'file'
      },
      block_of_text: {
        name: 'Block of Text',
        icon: 'font',
        defaultAttributes: sizeMed
      }
    }
  };

  Formbuilder.FIELD_TYPES = _.extend.apply(this, _.union({}, _.values(Formbuilder.FIELD_CATEGORIES)));

  validators = {
    duplicateColumns: function(model) {
      var colNames;
      if (model.field_type !== 'table') {
        return false;
      }
      colNames = _.map(model.getColumns(), function(col) {
        return col.label;
      });
      return _.uniq(colNames).length !== colNames.length;
    },
    minMaxMismatch: function(model) {
      var max, min;
      if (model.field_type !== 'number') {
        return false;
      }
      min = parseFloat(model.get('field_options.min'));
      max = parseFloat(model.get('field_options.max'));
      if (min && max && min > max) {
        return true;
      }
    },
    minMaxLengthMismatch: function(model) {
      var max, min;
      if (!(model.field_type === 'paragraph' || model.field_type === 'text')) {
        return false;
      }
      min = parseInt(model.get('field_options.minlength'), 10);
      max = parseInt(model.get('field_options.maxlength'), 10);
      if (min && max && min > max) {
        return true;
      }
    },
    minMaxRowsMismatch: function(model) {
      var max, min;
      if (model.field_type !== 'table') {
        return false;
      }
      min = parseInt(model.get('field_options.minrows'), 10);
      max = parseInt(model.get('field_options.maxrows'), 10);
      if (min && max && min > max) {
        return true;
      }
    },
    blankOption: function(model) {
      var ref;
      if ((ref = model.field_type) !== 'radio' && ref !== 'checkboxes' && ref !== 'dropdown') {
        return false;
      }
      return _.any(model.getOptions(), function(opt) {
        return !opt.label;
      });
    },
    blankColumn: function(model) {
      if (model.field_type !== 'table') {
        return false;
      }
      return _.any(model.getColumns(), function(col) {
        return !col.label;
      });
    }
  };

  Formbuilder.Collection = Backbone.Collection.extend({
    initialize: function(_, options) {
      this.parentView = options.parentView;
      this.on('add', this.copyCidToModel);
      this.on('remove', this.removeConditionals);
      this.on('remove change:isValid', (function(_this) {
        return function() {
          return _this.parentView.calculateValidation();
        };
      })(this));
      this.on('change', (function(_this) {
        return function(model) {
          return _this.validateField(model, void 0, model.isValid);
        };
      })(this));
      return this.on('change:field_options.columns change:field_options.columns.*', (function(_this) {
        return function(model) {
          return _this.validateField(model, 'duplicateColumns');
        };
      })(this));
    },
    validateField: function(model, useValidator, silent) {
      var errs, k, validator;
      errs = $.extend({}, model.get('errors'));
      if (useValidator) {
        errs[useValidator] = validators[useValidator](model);
      } else {
        for (k in validators) {
          validator = validators[k];
          errs[k] = validator(model);
        }
      }
      model.validationErrors = errs;
      if (!silent) {
        model.set('errors', errs);
      }
      model.isValid = !_.any(_.values(errs), (function(v) {
        return v;
      }));
      if (!silent) {
        return model.set('isValid', model.isValid);
      }
    },
    comparator: function(model) {
      return this.parentView.modelDOMIndex(model);
    },
    copyCidToModel: function(model) {
      return model.attributes.cid = model.cid;
    },
    input_fields: function() {
      return this.models.filter(function(m) {
        return m.input_field;
      });
    },
    removeConditionals: function(removing) {
      return this.models.forEach((function(_this) {
        return function(m) {
          var newConditions, oldConditions, ref;
          if ((oldConditions = m.get(Formbuilder.mappings.CONDITIONS))) {
            newConditions = _.reject(oldConditions, function(condition) {
              return ("" + condition.response_field_id) === ("" + removing.id);
            });
            if (!_.isEqual(oldConditions, newConditions)) {
              m.set(Formbuilder.mappings.CONDITIONS, newConditions);
              return (ref = _this.parentView.editView) != null ? ref.render() : void 0;
            }
          }
        };
      })(this));
    }
  });

  Formbuilder.Views.ViewField = Backbone.View.extend({
    className: "fb_field_wrapper",
    events: {
      'click .cover': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click [data-hard-remove]': 'hardRemove',
      'click [data-soft-remove]': 'softRemove',
      'click [data-toggle="dropdown"]': 'setEditing'
    },
    initialize: function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, 'change', this.render);
      return this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      var base;
      if (typeof (base = this.model).setExistingValue === "function") {
        base.setExistingValue(null);
      }
      this.$el.data('cid', this.model.cid).html(JST["form_builder/templates/view/base"]({
        hasResponses: this.parentView.options.hasResponses,
        model: this.model
      }));
      this.rendererView || (this.rendererView = new FormRenderer.Views[classify(this.model.field_type)]({
        model: this.model,
        showLabels: true
      }));
      this.toggleErrorClass();
      this.$el.append(this.rendererView.render().el);
      Formbuilder.disableTabbing(this.$el);
      this.$el.initialize();
      this.rendererView.trigger('shown');
      return this;
    },
    toggleErrorClass: function() {
      if (this.model.get('isValid') === false) {
        return this.$el.addClass('has_errors');
      } else {
        return this.$el.removeClass('has_errors');
      }
    },
    focusEditView: function() {
      return this.parentView.showEditPane(this.model);
    },
    clearConfirmMsg: function() {
      if (this.model.input_field) {
        return "Are you sure you want to delete this field? " + "You'll also lose access to any submitted answers to this field.";
      }
    },
    setEditing: function() {
      if (!this.$el.hasClass('editing')) {
        return this.parentView.showEditPane(this.model);
      }
    },
    hardRemove: function() {
      if (this.parentView.options.hasResponses) {
        return $.rails.showConfirmDialog(this.clearConfirmMsg(), $.proxy(this.clear, this));
      } else {
        return this.clear();
      }
    },
    softRemove: function() {
      this.model.set(Formbuilder.mappings.ADMIN_ONLY, true);
      this.model.set(Formbuilder.mappings.REQUIRED, false);
      this.$el.appendTo(this.$el.closest('.fb_response_fields'));
      this.parentView._onChange();
      return this.parentView.ensureEditPaneScrolled();
    },
    clear: function() {
      return this.model.destroy();
    },
    duplicate: function() {
      var attrs, newModel;
      attrs = _.deepClone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return newModel = this.parentView.addField(attrs, {
        position: this.parentView.modelDOMIndex(this.model) + 1
      });
    }
  });

  Formbuilder.Views.EditField = Backbone.View.extend({
    className: "fb_edit_inner",
    events: {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'change .js-change-field-type': 'changeFieldType',
      'click [data-show-modal]': 'showModal',
      'blur [data-rv-input="model.field_options.minlength"]': 'auditMinLength',
      'blur [data-rv-input="model.field_options.maxlength"]': 'auditMaxLength',
      'blur [data-rv-input="model.field_options.min"]': 'auditMin',
      'blur [data-rv-input="model.field_options.max"]': 'auditMax',
      'blur [data-rv-input="model.field_options.minrows"]': 'auditMinRows',
      'blur [data-rv-input="model.field_options.maxrows"]': 'auditMaxRows',
      'blur [data-rv-input^="model.field_options.options."]': 'validateField',
      'blur [data-rv-input^="model.field_options.columns."]': 'validateField',
      'change [data-rv-value="model.field_options.min_max_length_units"]': 'setSizeToRecommendedSize',
      'click .js-add-condition': 'addCondition',
      'click .js-remove-condition': 'removeCondition',
      'click .js-set-checked': 'setChecked'
    },
    initialize: function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, 'destroy', function() {
        this.parentView.removeEditPane();
        return this.parentView.setLeft('add');
      });
      return this.listenTo(this.model, 'change:field_options.conditions.*', (function(_this) {
        return function(m) {
          var i, j, newVal, ref, ref1, results;
          results = [];
          for (i = j = 0, ref = _this.model.getConditions().length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            newVal = (ref1 = _this.conditionValueOptions(i)) != null ? ref1[0] : void 0;
            if (m.hasChanged("field_options.conditions." + i + ".response_field_id")) {
              results.push(_this.setCondition(i, {
                method: _this.conditionMethodsAtIndex(i)[0].key,
                value: newVal
              }));
            } else if (m.hasChanged("field_options.conditions." + i + ".method")) {
              results.push(_this.setCondition(i, {
                value: newVal
              }));
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
      })(this));
    },
    render: function() {
      var templateName;
      templateName = this.model.input_field ? 'base' : 'base_non_input';
      this.$el.html(JST["form_builder/templates/edit/" + templateName](this));
      rivets.bind(this.$el, {
        model: this.model
      });
      this.$el.initialize();
      if (this.model.hasColumnsOrOptions()) {
        new Sortable(this.$el.find('.fb_options')[0], {
          handle: '.fa-reorder',
          onUpdate: $.proxy(this._optionsSorted, this)
        });
      }
      return this;
    },
    _optionsSorted: function() {
      var newOrder;
      newOrder = this.$el.find('.fb_options [data-index]').map(function() {
        return $(this).data('index');
      }).get();
      this.model.orderOptions(newOrder);
      return this.render();
    },
    addOption: function(e) {
      this.model.addOptionOrColumn();
      return this.render();
    },
    removeOption: function(e) {
      var i;
      i = this.$el.find(".js-remove-option").index($(e.currentTarget));
      this.model.removeOptionOrColumn(i);
      return this.render();
    },
    showModal: function(e) {
      var $el, modal;
      modal = new Formbuilder.Views[($(e.currentTarget).data('show-modal')) + "Modal"]({
        model: this.model,
        parentView: this
      });
      $el = modal.render().$el;
      $el.appendTo('body').modal('show');
      return typeof modal.shown === "function" ? modal.shown() : void 0;
    },
    changeFieldType: function(e) {
      var newAttrs, newIdx;
      newAttrs = Formbuilder.DEFAULT_FIELD_ATTRS($(e.currentTarget).val());
      _.extend(newAttrs, _.omit(this.model.attributes, 'field_type', 'field_options'));
      newAttrs.field_options = _.extend({}, newAttrs.field_options, this.model.attributes.field_options);
      delete newAttrs.value;
      newIdx = this.parentView.modelDOMIndex(this.model);
      this.model.set('id', null);
      this.model.destroy();
      return this.parentView.addField(newAttrs, {
        position: newIdx
      });
    },
    isChecked: function(i) {
      return this.model.getOptions()[i].checked;
    },
    setChecked: function(e) {
      var idx, newOpts, newVal;
      idx = $(e.currentTarget).closest('[data-index]').data('index');
      newVal = this.isChecked(idx) ? false : true;
      newOpts = $.extend(true, [], this.model.getOptions());
      if (this.model.field_type === 'checkboxes') {
        newOpts[idx].checked = newVal;
      } else {
        _.each(newOpts, function(o, i) {
          return o.checked = i === idx ? newVal : false;
        });
      }
      this.model.set(this.model.columnOrOptionKeypath(), newOpts.slice(0));
      return this.render();
    },
    validateField: function() {
      return this.parentView.collection.validateField(this.model);
    },
    auditMinLength: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MINLENGTH);
      this.setSizeToRecommendedSize();
      return this.validateField();
    },
    auditMaxLength: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MAXLENGTH);
      return this.validateField();
    },
    auditMin: function() {
      this.normalizeFloat(Formbuilder.mappings.MIN);
      return this.validateField();
    },
    auditMax: function() {
      this.normalizeFloat(Formbuilder.mappings.MAX);
      return this.validateField();
    },
    auditMinRows: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MINROWS);
      return this.validateField();
    },
    auditMaxRows: function() {
      this.normalizePositiveInteger(Formbuilder.mappings.MAXROWS);
      return this.validateField();
    },
    normalizePositiveInteger: function(map) {
      var parsed, val;
      val = this.model.get(map);
      parsed = parseInt(val, 10);
      if (_.isNaN(parsed) || parsed < 1) {
        return this.model.unset(map);
      } else {
        return this.model.set(map, "" + parsed);
      }
    },
    normalizeFloat: function(map) {
      var parsed, val;
      val = this.model.get(map);
      parsed = parseFloat(val);
      if (_.isNaN(parsed)) {
        return this.model.unset(map);
      } else {
        return this.model.set(map, "" + parsed);
      }
    },
    setSizeToRecommendedSize: function() {
      var rec;
      if ((rec = this.recommendedParagraphSize())) {
        this.model.set(Formbuilder.mappings.SIZE, rec);
        return this.render();
      }
    },
    recommendedParagraphSize: function() {
      var parsed, words;
      parsed = parseInt(this.model.get(Formbuilder.mappings.MINLENGTH));
      words = this.model.get(Formbuilder.mappings.LENGTH_UNITS) === 'words';
      if ((words && parsed > 60) || (!words && parsed > 1000)) {
        return 'large';
      } else if ((words && parsed > 30) || (!words && parsed > 350)) {
        return 'medium';
      }
    },
    blankCondition: function() {
      var ref, rf;
      rf = this.conditionFieldOptions()[0];
      return {
        action: 'show',
        response_field_id: rf.id,
        method: _.first(this.conditionMethodsForType(rf.field_type)).key,
        value: (ref = optionsForResponseField(rf)) != null ? ref[0] : void 0
      };
    },
    addCondition: function() {
      var conditions;
      conditions = this.model.getConditions().slice(0);
      conditions.push(this.blankCondition());
      this.model.set(Formbuilder.mappings.CONDITIONS, conditions);
      return this.render();
    },
    removeCondition: function(e) {
      var conditions, i;
      i = $(e.currentTarget).data('index');
      conditions = this.model.getConditions().slice(0);
      conditions.splice(i, 1);
      this.model.set(Formbuilder.mappings.CONDITIONS, conditions);
      return this.render();
    },
    conditionField: function(i) {
      var id;
      if ((id = this.model.getConditionAt(i).response_field_id)) {
        return this.parentView.collection.find(function(m) {
          return ("" + m.id) === ("" + id);
        });
      }
    },
    conditionMethod: function(i) {
      return this.model.getConditionAt(i).method;
    },
    conditionFieldOptions: function() {
      var thisIdx;
      thisIdx = this.parentView.collection.indexOf(this.model);
      return this.parentView.collection.filter((function(_this) {
        return function(field, index) {
          return field.input_field && _this.conditionMethodsForType(field.field_type).length && index < thisIdx;
        };
      })(this));
    },
    conditionMethodsForType: function(field_type) {
      return _.filter(Formbuilder.CONDITION_METHODS, function(method) {
        return indexOf.call(method.field_types, field_type) >= 0;
      });
    },
    conditionMethodsAtIndex: function(i) {
      var field_type, ref;
      if ((field_type = (ref = this.conditionField(i)) != null ? ref.field_type : void 0)) {
        return this.conditionMethodsForType(field_type);
      } else {
        return [];
      }
    },
    conditionValueOptions: function(i) {
      return optionsForResponseField(this.conditionField(i));
    },
    canAddConditions: function() {
      return this.conditionFieldOptions().length > 0;
    },
    setCondition: function(i, attrs) {
      var conditions;
      conditions = this.model.getConditions().slice(0);
      _.extend(conditions[i], attrs);
      this.model.set(Formbuilder.mappings.CONDITIONS, conditions, {
        silent: true
      });
      return this.render();
    }
  });

  FormRenderer.Models.ResponseField.prototype.getConditionAt = function(i) {
    return this.getConditions()[i] || {};
  };

  FormRenderer.Models.ResponseField.prototype.columnOrOptionKeypath = function() {
    switch (this.field_type) {
      case 'table':
        return 'field_options.columns';
      case 'checkboxes':
      case 'radio':
      case 'dropdown':
        return 'field_options.options';
    }
  };

  FormRenderer.Models.ResponseField.prototype.hasColumnsOrOptions = function() {
    return !!this.columnOrOptionKeypath();
  };

  FormRenderer.Models.ResponseField.prototype.addOptionOrColumn = function(i) {
    var newOpt, newOpts, opts;
    opts = this.field_type === 'table' ? this.getColumns() : this.getOptions();
    newOpts = opts.slice(0);
    newOpt = {
      label: (this.field_type === 'table' ? 'Column' : 'Option') + " " + (opts.length + 1)
    };
    if (this.field_type !== 'table') {
      newOpt.checked = false;
    }
    newOpts.push(newOpt);
    return this.set(this.columnOrOptionKeypath(), newOpts);
  };

  FormRenderer.Models.ResponseField.prototype.removeOptionOrColumn = function(i) {
    var newOpts, opts;
    opts = this.get(this.columnOrOptionKeypath());
    newOpts = opts.slice(0);
    newOpts.splice(i, 1);
    return this.set(this.columnOrOptionKeypath(), newOpts);
  };

  FormRenderer.Models.ResponseField.prototype.orderOptions = function(newOrder) {
    var newOpts, opts;
    opts = this.get(this.columnOrOptionKeypath());
    newOpts = _.sortBy(opts.slice(0), function(_opt, i) {
      return _.indexOf(newOrder, i);
    });
    return this.set(this.columnOrOptionKeypath(), newOpts);
  };

  Formbuilder.CONDITION_METHODS = [
    {
      key: 'eq',
      label: 'is',
      field_types: ['date', 'dropdown', 'email', 'number', 'paragraph', 'price', 'radio', 'text', 'time', 'website']
    }, {
      key: 'contains',
      label: 'contains',
      field_types: ['checkboxes', 'text', 'paragraph', 'website', 'email', 'address', 'table']
    }, {
      key: 'lt',
      label: 'is less than',
      field_types: ['number', 'price']
    }, {
      key: 'gt',
      label: 'is greater than',
      field_types: ['number', 'price']
    }, {
      key: 'shorter',
      label: 'is shorter than',
      field_types: ['text', 'paragraph']
    }, {
      key: 'longer',
      label: 'is longer than',
      field_types: ['text', 'paragraph']
    }
  ];

  Formbuilder.Views.BaseModal = Backbone.View.extend({
    className: 'modal',
    events: {
      'click button': function() {
        this.save();
        return this.hideAndRemove();
      },
      'hidden.bs.modal': 'remove'
    },
    initialize: function(options) {
      return this.parentView = options.parentView, options;
    },
    hideAndRemove: function() {
      this.$el.modal('hide');
      return this.remove();
    }
  });

  Formbuilder.Views.PresetValuesModal = Formbuilder.Views.BaseModal.extend({
    render: function() {
      this.$el.html(JST["form_builder/templates/edit/preset_values_modal"]({
        rf: this.model
      }));
      this.$el.initialize();
      return this;
    },
    save: function() {
      return this.model.set(Formbuilder.mappings.PRESET_VALUES, this.getValues());
    },
    getValues: function() {
      return _.tap({}, (function(_this) {
        return function(h) {
          var column, k, ref, results;
          ref = _this.model.getColumns();
          results = [];
          for (k in ref) {
            column = ref[k];
            results.push(h[column.label] = _this.$el.find("[data-col=" + k + "]").map(function() {
              return $(this).val();
            }).get());
          }
          return results;
        };
      })(this));
    }
  });

  Formbuilder.Views.DefaultLocationModal = Formbuilder.Views.BaseModal.extend({
    render: function() {
      this.$el.html(JST["form_builder/templates/edit/default_location_modal"]({
        rf: this.model
      }));
      this.initMap();
      this.$el.initialize();
      return this;
    },
    initMap: function() {
      this.$mapEl = this.$el.find('.fb_default_location_modal_map');
      return this.map = L.mapbox.map(this.$mapEl[0], App.MAPBOX_TILE_ID, {
        center: this.model.defaultLatLng() || App.DEFAULT_LAT_LNG,
        zoom: 13
      });
    },
    save: function() {
      this.model.set(Formbuilder.mappings.DEFAULT_LAT, this.map.getCenter().lat.toFixed(7));
      return this.model.set(Formbuilder.mappings.DEFAULT_LNG, this.map.getCenter().lng.toFixed(7));
    },
    shown: function() {
      return this.map._onResize();
    }
  });

  Formbuilder.Views.BulkAddOptionsModal = Formbuilder.Views.BaseModal.extend({
    render: function() {
      this.$el.html(JST["form_builder/templates/edit/bulk_add_options_modal"]({
        rf: this.model
      }));
      this.$el.initialize();
      return this;
    },
    save: function() {
      return this.addOptions();
    },
    addOptions: function() {
      var j, len, opt, options, ref, val;
      val = this.$el.find('textarea').val();
      if (!val) {
        return;
      }
      options = _.reject(this.model.getOptions(), function(o) {
        return !o.label;
      });
      ref = val.split("\n");
      for (j = 0, len = ref.length; j < len; j++) {
        opt = ref[j];
        options.push({
          label: opt,
          checked: false
        });
      }
      this.model.set(Formbuilder.mappings.OPTIONS, options);
      return this.parentView.render();
    }
  });

  Formbuilder.StatusIndicatorController = (function() {
    function StatusIndicatorController(options) {
      _.extend(this, Backbone.Events);
      this.fb = options.fb;
      this.$el = $('.save_status');
      this.$btn = $('.bottom_status_bar_buttons .continue_button');
      this.listenTo(this.fb, 'refreshStatus', this.updateClass);
    }

    StatusIndicatorController.prototype.updateClass = function() {
      this.$el.removeClass('is_error is_saving is_invalid');
      this.$btn.removeClass('disabled');
      if (this.fb.state.get('hasServerErrors')) {
        return this.$el.addClass('is_error');
      } else if (this.fb.state.get('hasValidationErrors')) {
        this.$btn.addClass('disabled');
        return this.$el.addClass('is_invalid');
      } else if (this.fb.autosaver.isPending()) {
        return this.$el.addClass('is_saving');
      }
    };

    return StatusIndicatorController;

  })();

  Formbuilder.disableTabbing = function($el) {
    return $el.find('a, button, :input').attr('tabindex', '-1');
  };

}).call(this);

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/base.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var name;
    
      _print(_safe(JST['form_builder/templates/edit/common'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/checkboxes'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(typeof JST[name = "form_builder/templates/edit/fields/" + (this.model.get(Formbuilder.mappings.FIELD_TYPE))] === "function" ? JST[name](this) : void 0));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/conditional'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/base_non_input.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var name;
    
      _print(_safe(typeof JST[name = "form_builder/templates/edit/fields/" + (this.model.get(Formbuilder.mappings.FIELD_TYPE))] === "function" ? JST[name](this) : void 0));
    
      _print(_safe('\n\n'));
    
      if (this.model.field_type !== 'page_break') {
        _print(_safe('\n  '));
        _print(_safe(JST['form_builder/templates/edit/conditional'](this)));
        _print(_safe('\n'));
      }
    
      _print(_safe('\n\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/columns.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var i, j, len, option, ref;
    
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section\'>\n  <label>Columns</label>\n\n  <div class=\'fb_options\'>\n    '));
    
      ref = this.model.getColumns();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        option = ref[i];
        _print(_safe('\n      <fieldset class=\'option drag_list_item\' data-index="'));
        _print(i);
        _print(_safe('">\n        <span class=\'drag_list_item_box\'>\n          <i class=\'fa fa-reorder drag_list_reorder\'></i>\n          <span class=\'drag_list_item_input\'>\n            <input type="text" data-rv-input="model.field_options.columns.'));
        _print(i);
        _print(_safe('.label" />\n          </span>\n        </span>\n        '));
        if (!(this.model.getColumns().length < 2)) {
          _print(_safe('\n          <a class="js-remove-option drag_list_remove" title="Remove Column"><i class=\'fa fa-minus-circle\'></i></a>\n        '));
        }
        _print(_safe('\n      </fieldset>\n    '));
      }
    
      _print(_safe('\n  </div>\n\n  <div class=\'form_error\' data-rv-show=\'model.errors.duplicateColumns\'>You can\'t have columns with duplicate names.</div>\n  <div class=\'form_error\' data-rv-show=\'model.errors.blankColumn\'>Please enter a label for each column.</div>\n\n  <div class=\'fb_bottom_add\'>\n    <a class="js-add-option '));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('">Add column</a>\n  </div>\n\n  <label class=\'control\'>\n    <input type="checkbox" data-rv-checked="model.'));
    
      _print(Formbuilder.mappings.COLUMN_TOTALS);
    
      _print(_safe('" />\n    Display column totals for numeric fields\n  </label>\n</div>\n\n<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz fb_edit_section_num_rows fb_edit_section_between\'>\n  <label># of rows</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <span>Between</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MINROWS);
    
      _print(_safe('" />\n    <span>and</span>\n    <input type="text" data-rv-input="model.'));
    
      _print(Formbuilder.mappings.MAXROWS);
    
      _print(_safe('" />\n  </div>\n</div>\n\n<div class=\'form_error\' data-rv-show=\'model.errors.minMaxRowsMismatch\'>Please enter a maximum larger than the minimum.</div>\n\n<p class=\'fb_edit_help\'>\n  Respondents will be able to add/remove rows within these contraints.\n  You can leave these blank for no limits.\n</p>\n</div>\n\n<hr />\n\n<a class=\''));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('\' data-show-modal=\'PresetValues\'>Define preset values</a>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/common.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/label'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/field_type'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/description'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/conditional.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var condition, i, j, k, l, len, len1, len2, len3, m, method, model, optionLabel, ref, ref1, ref2, ref3, ref4, ref5;
    
      _print(_safe('<hr />\n\n'));
    
      if (this.canAddConditions() || this.model.isConditional()) {
        _print(_safe('\n  <div class=\'fb_edit_section fb_edit_section_conditions\'>\n    <label>Rules</label>\n\n    '));
        ref = this.model.getConditions();
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          condition = ref[i];
          _print(_safe('\n      <div class=\'fb_edit_section_horiz\'>\n        <label>\n          '));
          if (i === 0) {
            _print(_safe('\n            Only show this field if...\n          '));
          } else {
            _print(_safe('\n            And...\n          '));
          }
          _print(_safe('\n        </label>\n\n        <div class=\'fb_edit_section_horiz_content\'>\n          <div class=\'fb_conditional_opt\'>\n            <select data-width="100%" data-rv-value=\'model.'));
          _print(Formbuilder.mappings.CONDITIONS);
          _print(_safe('.'));
          _print(i);
          _print(_safe('.response_field_id\'>\n              '));
          ref1 = this.conditionFieldOptions();
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            model = ref1[k];
            _print(_safe('\n                <option value="'));
            _print(model.id);
            _print(_safe('">'));
            _print(model.get(Formbuilder.mappings.LABEL));
            _print(_safe('</option>\n              '));
          }
          _print(_safe('\n            </select>\n          </div>\n\n          <div class=\'fb_conditional_opt\'>\n            '));
          if (this.conditionField(i)) {
            _print(_safe('\n              <select data-width="100%" data-rv-value=\'model.'));
            _print(Formbuilder.mappings.CONDITIONS);
            _print(_safe('.'));
            _print(i);
            _print(_safe('.method\'>\n                '));
            ref2 = this.conditionMethodsAtIndex(i);
            for (l = 0, len2 = ref2.length; l < len2; l++) {
              method = ref2[l];
              _print(_safe('\n                  <option value="'));
              _print(method.key);
              _print(_safe('">'));
              _print(method.label);
              _print(_safe('</option>\n                '));
            }
            _print(_safe('\n              </select>\n            '));
          }
          _print(_safe('\n          </div>\n\n          <div class=\'fb_conditional_opt\'>\n            '));
          if (this.conditionMethod(i)) {
            _print(_safe('\n              '));
            if ((ref3 = this.conditionField(i).field_type) === 'dropdown' || ref3 === 'checkboxes' || ref3 === 'radio') {
              _print(_safe('\n                <select data-width=\'100%\' data-rv-value="model.'));
              _print(Formbuilder.mappings.CONDITIONS);
              _print(_safe('.'));
              _print(i);
              _print(_safe('.value">\n                  '));
              ref4 = this.conditionValueOptions(i);
              for (m = 0, len3 = ref4.length; m < len3; m++) {
                optionLabel = ref4[m];
                _print(_safe('\n                    <option value=\''));
                _print(optionLabel);
                _print(_safe('\'>'));
                _print(optionLabel);
                _print(_safe('</option>\n                  '));
              }
              _print(_safe('\n                </select>\n              '));
            } else if ((ref5 = this.conditionMethod(i)) === 'shorter' || ref5 === 'longer') {
              _print(_safe('\n                <div class=\'input_group\'>\n                  <input type=\'text\' data-rv-input="model.'));
              _print(Formbuilder.mappings.CONDITIONS);
              _print(_safe('.'));
              _print(i);
              _print(_safe('.value">\n                  <span class=\'input_group_text\'>'));
              _print(this.conditionField(i).getLengthValidationUnits());
              _print(_safe('</span>\n                </div>\n              '));
            } else {
              _print(_safe('\n                <input type=\'text\' data-rv-input="model.'));
              _print(Formbuilder.mappings.CONDITIONS);
              _print(_safe('.'));
              _print(i);
              _print(_safe('.value">\n              '));
            }
            _print(_safe('\n            '));
          }
          _print(_safe('\n          </div>\n        </div>\n      </div>\n\n      <div class=\'fb_condition_remove\'>\n        <a class=\'js-remove-condition\' data-index="'));
          _print(i);
          _print(_safe('">Remove this rule</a>\n      </div>\n\n      <hr />\n    '));
        }
        _print(_safe('\n\n    '));
        if (this.canAddConditions()) {
          _print(_safe('\n      <a class=\''));
          _print(Formbuilder.options.BUTTON_CLASS);
          _print(_safe(' info js-add-condition\'>Add a rule</a>\n    '));
        }
        _print(_safe('\n  </div>\n'));
      } else {
        _print(_safe('\n  <div class=\'fb_edit_section\'>\n    <label>Want to add a rule?</label>\n    <p class=\'fb_edit_help\'>Select another field to show and hide it based on the answer to this one.</p>\n  </div>\n'));
      }
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/description.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section\'>\n  <label>Add a description</label>\n  <textarea data-rv-input=\'model.'));
    
      _print(Formbuilder.mappings.DESCRIPTION);
    
      _print(_safe('\'></textarea>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/field_type.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var field, k, ref;
    
      _print(_safe('<div class=\'fb_edit_section\'>\n  '));
    
      if (this.model.typeUnlocked) {
        _print(_safe('\n    <label>Type</label>\n    <select data-width=\'100%\' class=\'js-change-field-type\'>\n      '));
        ref = Formbuilder.FIELD_TYPES;
        for (k in ref) {
          field = ref[k];
          _print(_safe('\n        <option value=\''));
          _print(k);
          _print(_safe('\' '));
          if (this.model.field_type === k) {
            _print(_safe('selected'));
          }
          _print(_safe('>\n          '));
          _print(field.name);
          _print(_safe('\n        </option>\n      '));
        }
        _print(_safe('\n    </select>\n  '));
      } else {
        _print(_safe('\n    <div class=\'label\'>\n      '));
        _print(Formbuilder.FIELD_TYPES[this.model.field_type].name);
        _print(_safe('\n    </div>\n  '));
      }
    
      _print(_safe('\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/address.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Format</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-width=\'auto\' data-rv-value="model.'));
    
      _print(Formbuilder.mappings.ADDRESS_FORMAT);
    
      _print(_safe('">\n      <option value=\'\'>All fields</option>\n      <option value=\'city_state\'>City and State only</option>\n      <option value=\'city_state_zip\'>City, State and ZIP Code only</option>\n      <option value=\'country\'>Country only</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/block_of_text.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section fb_edit_section_label\'>\n  <label>Text</label>\n  <textarea data-rv-input=\'model.'));
    
      _print(Formbuilder.mappings.DESCRIPTION);
    
      _print(_safe('\'></textarea>\n</div>\n\n'));
    
      _print(_safe(JST['form_builder/templates/edit/field_type'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/size'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/checkboxes.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/options'](_.extend(this, {
        includeOther: true
      }))));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/dropdown.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/options'](_.extend(this, {
        includeBlank: true
      }))));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/file.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Allow users to upload...</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-rv-value="model.'));
    
      _print(Formbuilder.mappings.FILE_TYPES);
    
      _print(_safe('" data-width="70%">\n      <option value=\'\'>Any type of file</option>\n      <option value=\'images\'>Images only</option>\n      <option value=\'audio\'>Audio files only</option>\n      <option value=\'videos\'>Videos only</option>\n      <option value=\'docs\'>Documents only</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/map_marker.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/default_location']()));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/number.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/min_max']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/units']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/integer_only']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/page_break.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      if (this.model.typeUnlocked) {
        _print(_safe('\n  '));
        _print(_safe(JST['form_builder/templates/edit/field_type'](this)));
        _print(_safe('\n'));
      } else {
        _print(_safe('\n  <p class=\'fb_edit_help\'>No options available</p>\n'));
      }
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/paragraph.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/size']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/min_max_length']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/phone.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<hr />\n\n<div class=\'fb_edit_section fb_edit_section_horiz\'>\n  <label>Format</label>\n  <div class=\'fb_edit_section_horiz_content\'>\n    <select data-width="100%" data-rv-value="model.'));
    
      _print(Formbuilder.mappings.PHONE_FORMAT);
    
      _print(_safe('">\n      <option value="us">US (10-digit)</option>\n      <option value="intl">International</option>\n    </select>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/price.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/disable_cents']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/radio.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/options'](_.extend(this, {
        includeOther: true
      }))));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/section_break.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/common'](this)));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/size'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/table.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/columns'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/text.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/size']()));
    
      _print(_safe('\n'));
    
      _print(_safe(JST['form_builder/templates/edit/min_max_length']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/fields/time.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe(JST['form_builder/templates/edit/disable_seconds']()));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/label.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'fb_edit_section fb_edit_section_label\'>\n  <label>Label</label>\n  <input type=\'text\' data-rv-input=\'model.'));
    
      _print(Formbuilder.mappings.LABEL);
    
      _print(_safe('\' />\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["edit/options.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var fieldType, i, j, len, option, ref;
    
      fieldType = this.model.field_type === 'checkboxes' ? 'checkbox' : 'radio';
    
      _print(_safe('\n\n<hr />\n\n<div class=\'fb_edit_section\'>\n  <label>Options</div>\n\n  '));
    
      if (this.includeBlank != null) {
        _print(_safe('\n    <div class=\'fb_option_blank\'>\n      <label class=\'control\'>\n        <input type=\'checkbox\' data-rv-checked=\'model.'));
        _print(Formbuilder.mappings.INCLUDE_BLANK);
        _print(_safe('\' />\n        Include blank\n      </label>\n    </div>\n  '));
      }
    
      _print(_safe('\n\n  <div class=\'fb_options\'>\n    '));
    
      ref = this.model.getOptions();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        option = ref[i];
        _print(_safe('\n      <fieldset class=\'option drag_list_item drag_list_item_checkbox\' data-index="'));
        _print(i);
        _print(_safe('">\n        <span class=\'drag_list_item_box\'>\n          <i class=\'fa fa-reorder drag_list_reorder\'></i>\n          <label class="control">\n            <input type="'));
        _print(fieldType);
        _print(_safe('" class=\'js-set-checked\' '));
        _print(this.isChecked(i) ? 'checked' : void 0);
        _print(_safe(' />\n          </label>\n          <span class=\'drag_list_item_input\'>\n            <input type="text" data-rv-input="model.field_options.options.'));
        _print(i);
        _print(_safe('.label" />\n          </span>\n        </span>\n        '));
        if (!(this.model.getOptions().length < 2)) {
          _print(_safe('\n          <a class="js-remove-option drag_list_remove" title="Remove Option"><i class=\'fa fa-minus-circle\'></i></a>\n        '));
        }
        _print(_safe('\n      </fieldset>\n    '));
      }
    
      _print(_safe('\n  </div>\n\n  <div class=\'form_error\' data-rv-show=\'model.errors.blankOption\'>Please enter text for each option.</div>\n\n  <div class=\'fb_bottom_add\'>\n    <a class="js-add-option button_uppercase align_left"><i class="fa fa-plus-circle"></i> Add an option</a>\n\n    <div class=\'font_smaller align_right\'>\n      <a data-show-modal=\'BulkAddOptions\'>Add in bulk</a>\n    </div>\n  </div>\n\n  '));
    
      if (this.includeOther != null) {
        _print(_safe('\n    <div class="fb_option_other">\n      <label class=\'control\'>\n        <input type=\'checkbox\' data-rv-checked=\'model.'));
        _print(Formbuilder.mappings.INCLUDE_OTHER);
        _print(_safe('\' />\n        Include "other"\n      </label>\n    </div>\n  '));
      }
    
      _print(_safe('\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["partials/left_side.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      var field, fields, key, ref, sectionName;
    
      _print(_safe('<div class=\'fb_left\'>\n  <div class=\'fb_add_field_wrapper\'>\n    <div class=\'fb_left_header\'>\n      <h4>Add a new field</h4>\n    </div>\n\n    '));
    
      ref = Formbuilder.FIELD_CATEGORIES;
      for (sectionName in ref) {
        fields = ref[sectionName];
        _print(_safe('\n      <h5>'));
        _print(sectionName);
        _print(_safe('</h5>\n      <div class=\'fb_add_field_section\'>\n        '));
        for (key in fields) {
          field = fields[key];
          _print(_safe('\n          <a data-field-type="'));
          _print(key);
          _print(_safe('" class="'));
          _print(Formbuilder.options.BUTTON_CLASS);
          _print(_safe('">\n            '));
          if (field.buttonHtml) {
            _print(_safe('\n              '));
            _print(_safe(field.buttonHtml));
            _print(_safe('\n            '));
          } else {
            _print(_safe('\n              <span class="symbol"><span class="fa fa-'));
            _print(field.icon);
            _print(_safe('"></span></span>\n              '));
            _print(field.name);
            _print(_safe('\n            '));
          }
          _print(_safe('\n          </a>\n        '));
        }
        _print(_safe('\n      </div>\n    '));
      }
    
      _print(_safe('\n  </div>\n\n  <div class=\'fb_edit_field_wrapper\' style=\'display:none;\'>\n    <div class=\'fb_left_header\'>\n      <h4>Edit field</h4>\n      <a class=\'js-add-field button small info\'>Add a new field</a>\n    </div>\n\n    <div class=\'fb_edit_field_inner\'></div>\n  </div>\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["view/base.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'cover\'></div>\n'));
    
      _print(_safe(JST['form_builder/templates/view/duplicate_remove'](this)));
    
      _print(_safe('\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};

if (!window.JST) {
  window.JST = {};
}
window.JST["view/duplicate_remove.jst"] = function(__obj) {
  var _safe = function(value) {
    if (typeof value === 'undefined' && value == null)
      value = '';
    var result = new String(value);
    result.ecoSafe = true;
    return result;
  };
  return (function() {
    var __out = [], __self = this, _print = function(value) {
      if (typeof value !== 'undefined' && value != null)
        __out.push(value.ecoSafe ? value : __self.escape(value));
    }, _capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return _safe(result);
    };
    (function() {
      _print(_safe('<div class=\'actions_wrapper\'>\n  <button class="js-duplicate fb_button_success '));
    
      _print(Formbuilder.options.BUTTON_CLASS);
    
      _print(_safe('" title="Duplicate Field"><i class=\'fa fa-plus-circle\'></i></button>\n\n  '));
    
      if (this.hasResponses && this.model.input_field) {
        _print(_safe('\n    <span class=\'dropdown\'>\n      <a class="js-clear fb_button_warn '));
        _print(Formbuilder.options.BUTTON_CLASS);
        _print(_safe('" data-toggle="dropdown" title="Remove field...">\n        <i class=\'fa fa-minus-circle\'></i>\n      </a>\n      <div class=\'dropdown_menu dropdown_right\'>\n        <ul class=\'dropdown_body\'>\n          '));
        if (!this.model.get('admin_only')) {
          _print(_safe('\n            <li><a data-soft-remove>Hide this field</a></li>\n          '));
        }
        _print(_safe('\n          <li><a data-hard-remove>Delete this field and its answers</a></li>\n        </ul>\n      </div>\n    </span>\n  '));
      } else {
        _print(_safe('\n    <a class="js-clear fb_button_warn '));
        _print(Formbuilder.options.BUTTON_CLASS);
        _print(_safe('" data-hard-remove title="Remove field...">\n      <i class=\'fa fa-minus-circle\'></i>\n    </a>\n  '));
      }
    
      _print(_safe('\n</div>\n'));
    
    }).call(this);
    
    return __out.join('');
  }).call((function() {
    var obj = {
      escape: function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      safe: _safe
    }, key;
    for (key in __obj) obj[key] = __obj[key];
    return obj;
  })());
};
