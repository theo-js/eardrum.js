!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("eardrum",[],t):"object"==typeof exports?exports.eardrum=t():e.eardrum=t()}(this,(function(){return(()=>{"use strict";var e={772:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});var n=r(687),o=r(657),i=r(676),a=r(488);t.default=function(e){var t,r=(0,o.default)(e),u=r.object,s=r.property,c=r.value,d=r.handler,f=(0,a.createPrivatePropName)(s);n.lastConfiguredObject.current=u,(0,a.isFunction)(d)&&(0,i.installListener)(r),Object.defineProperties(u,((t={})[f]={value:void 0===c?u[s]:c,writable:!0,configurable:!0,enumerable:!1},t[s]={get:function(){return this[f]},set:function(e){(0,i.ejectListener)(r),this[f]=e,(0,a.isFunction)(e)&&(0,i.installListener)(r)},configurable:!0,enumerable:!0},t))}},676:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.ejectListener=t.installListener=void 0;var o=r(687),i=r(488);function a(e,t){t.object;var r,a,u,s=t.handler,c=t.listener,d=t.additionalRefProps,f=c,l=f.target,p=s;if((0,i.isNodeEnv)())(0,i.isEardrumSupportedObject)(l)||(l=process),a="addListener",u="removeListener",r=function(e){p(e,t)};else{if("undefined"==typeof window)throw new Error("This environment does not support eardrum.js");l=window,a="addEventListener",u="removeEventListener",r=function(e){p(e,t)}}!function(e){var t=e.attach,r=e.attachMethodName,a=e.detachMethodName,u=e.object,s=e.listener,c=e.handler,d=e.listenerRemovalCondition,f=e.additionalRefProps,l=s.target,p=(s.bubble,l),b=s.type;if(!p[r]||!p[a])throw new Error("EventTarget is invalid");if(t){p[r](b,c);var v={handler:c,eventType:b,object:u};(0,i.isEardrumSupportedObject)(f)&&(v=n(n({},f),v)),o.handlerReferences.push(v)}else o.handlerReferences.filter((function(e,t,r){var n;return(n="function"!=typeof d||d(e,t,r))&&o.handlerReferences.splice(t,1),n})).forEach((function(e){p[a](b,e.handler)}))}(n(n({},t),{handler:r,listener:n(n({},f),{target:l}),additionalRefProps:d,attachMethodName:a,detachMethodName:u,attach:e}))}t.installListener=function(e){a(!0,e)},t.ejectListener=function(e){a(!1,e)}},657:function(e,t,r){var n=this&&this.__assign||function(){return n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var o=r(488);t.default=function(e){var t=e.object,r=e.property,i=e.handler,a=e.additionalRefProps,u=void 0===a?{}:a,s=e.listener,c=void 0===s?{type:"",target:void 0,bubble:!1}:s;if(!(0,o.isEardrumSupportedObject)(t))throw new Error("Eardrum does not support this object");return(0,o.throwIfPropIsNotConfigurable)({object:t,key:r},"Eardrum cannot configure property "+r.toString()+" of provided object because it is not configurable"),void 0===i&&(0,o.isFunction)(t[r])&&(i=t[r],e.handler=i),n(n({},e),{object:t,property:r,handler:i,additionalRefProps:u,listener:c})}},687:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.lastConfiguredObject=t.handlerReferences=void 0;t.handlerReferences=[];t.lastConfiguredObject={current:null}},488:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.throwIfPropIsNotConfigurable=t.isEardrumSupportedObject=t.isFunction=t.isNodeEnv=t.createPrivatePropName=void 0;t.createPrivatePropName=function(e){if("number"==typeof e)throw new Error("Eardrum does not support property keys of type number");return"symbol"==typeof e?Symbol():"_"+e};t.isNodeEnv=function(){return"undefined"==typeof window};t.isFunction=function(e){return"[object Function]"===toString.call(e)};t.isEardrumSupportedObject=function(e){return"[object Object]"===toString.call(e)};t.throwIfPropIsNotConfigurable=function(e,t){var r=e.object,n=e.key;"string"!=typeof t&&(t="Error: property '"+n.toString()+"' is not configurable");var o=Object.getOwnPropertyDescriptor(r,n);if(void 0!==o&&!o.configurable)throw new Error(t);return o}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}var n={};return(()=>{var e=n;var t={configure:r(772).default};e.default=t})(),n=n.default})()}));
//# sourceMappingURL=eardrum.js.map