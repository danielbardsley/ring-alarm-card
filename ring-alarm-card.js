function t(t,e,r,i){var a,o=arguments.length,n=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,r,i);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(o<3?a(n):o>3?a(e,r,n):a(e,r))||n);return o>3&&n&&Object.defineProperty(e,r,n),n}function e(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}"function"==typeof SuppressedError&&SuppressedError;const r=globalThis,i=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),o=new WeakMap;let n=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const r=void 0!==e&&1===e.length;r&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&o.set(e,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const r=1===t.length?t[0]:e.reduce((e,r,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1],t[0]);return new n(r,t,a)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,a))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:m,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,f=g.trustedTypes,y=f?f.emptyScript:"",v=g.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},$=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){const{get:i,set:a}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);a?.call(this,e),this.requestUpdate(t,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...m(t),...u(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(i)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),a=r.litNonce;void 0!==a&&e.setAttribute("nonce",a),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(void 0!==i&&!0===r.reflect){const a=(void 0!==r.converter?.toAttribute?r.converter:b).toAttribute(e,r.type);this._$Em=t,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,e){const r=this.constructor,i=r._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=r.getPropertyOptions(i),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const o=a.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){const i=this.constructor,a=this[t];if(r??=i.getPropertyOptions(t),!((r.hasChanged??$)(a,e)||r.useDefault&&r.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:a},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==a||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t){const{wrapped:t}=r,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,r,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[_("elementProperties")]=new Map,A[_("finalized")]=new Map,v?.({ReactiveElement:A}),(g.reactiveElementVersions??=[]).push("2.1.1");const E=globalThis,x=E.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,R=`<${P}>`,U=document,T=()=>U.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,D="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,j=/>/g,N=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,B=/"/g,I=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),F=new WeakMap,Y=U.createTreeWalker(U,129);function X(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const r=t.length-1,i=[];let a,o=2===e?"<svg>":3===e?"<math>":"",n=M;for(let e=0;e<r;e++){const r=t[e];let s,l,c=-1,d=0;for(;d<r.length&&(n.lastIndex=d,l=n.exec(r),null!==l);)d=n.lastIndex,n===M?"!--"===l[1]?n=z:void 0!==l[1]?n=j:void 0!==l[2]?(I.test(l[2])&&(a=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=a??M,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,s=l[1],n=void 0===l[3]?N:'"'===l[3]?B:L):n===B||n===L?n=N:n===z||n===j?n=M:(n=N,a=void 0);const h=n===N&&t[e+1].startsWith("/>")?" ":"";o+=n===M?r+R:c>=0?(i.push(s),r.slice(0,c)+C+r.slice(c)+k+h):r+k+(-2===c?e:h)}return[X(t,o+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let a=0,o=0;const n=t.length-1,s=this.parts,[l,c]=Z(t,e);if(this.el=J.createElement(l,r),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Y.nextNode())&&s.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[o++],r=i.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);s.push({type:1,index:a,name:n[2],strings:r,ctor:"."===n[1]?et:"?"===n[1]?rt:"@"===n[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(k)&&(s.push({type:6,index:a}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let r=0;r<e;r++)i.append(t[r],T()),Y.nextNode(),s.push({type:2,index:++a});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===P)s.push({type:2,index:a});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)s.push({type:7,index:a}),t+=k.length-1}a++}}static createElement(t,e){const r=U.createElement("template");return r.innerHTML=t,r}}function K(t,e,r=t,i){if(e===q)return e;let a=void 0!==i?r._$Co?.[i]:r._$Cl;const o=H(e)?void 0:e._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(t),a._$AT(t,r,i)),void 0!==i?(r._$Co??=[])[i]=a:r._$Cl=a),void 0!==a&&(e=K(t,a._$AS(t,e.values),a,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);Y.currentNode=i;let a=Y.nextNode(),o=0,n=0,s=r[0];for(;void 0!==s;){if(o===s.index){let e;2===s.type?e=new Q(a,a.nextSibling,this,t):1===s.type?e=new s.ctor(a,s.name,s.strings,this,t):6===s.type&&(e=new at(a,this,t)),this._$AV.push(e),s=r[++n]}o!==s?.index&&(a=Y.nextNode(),o++)}return Y.currentNode=U,i}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),H(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,i="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=J.createElement(X(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const a of t)i===e.length?e.push(r=new Q(this.O(T()),this.O(T()),this,this.options)):r=e[i],r._$AI(a),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=a,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=V}_$AI(t,e=this,r,i){const a=this.strings;let o=!1;if(void 0===a)t=K(this,t,e,0),o=!H(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const i=t;let n,s;for(t=a[0],n=0;n<a.length-1;n++)s=K(this,i[r+n],e,n),s===q&&(s=this._$AH[n]),o||=!H(s)||s!==this._$AH[n],s===V?t=V:t!==V&&(t+=(s??"")+a[n+1]),this._$AH[n]=s}o&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends tt{constructor(t,e,r,i,a){super(t,e,r,i,a),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??V)===q)return;const r=this._$AH,i=t===V&&r!==V||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,a=t!==V&&(r===V||i);i&&this.element.removeEventListener(this.name,this,r),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const ot=E.litHtmlPolyfillSupport;ot?.(J,Q),(E.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;class st extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const i=r?.renderBefore??e;let a=i._$litPart$;if(void 0===a){const t=r?.renderBefore??null;i._$litPart$=a=new Q(e.insertBefore(T(),t),t,void 0,r??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}st._$litElement$=!0,st.finalized=!0,nt.litElementHydrateSupport?.({LitElement:st});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:st}),(nt.litElementVersions??=[]).push("4.2.1");const ct={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:$},dt=(t=ct,e,r)=>{const{kind:i,metadata:a}=r;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(r.name,t),"accessor"===i){const{name:i}=r;return{set(r){const a=e.get.call(this);e.set.call(this,r),this.requestUpdate(i,a,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=r;return function(r){const a=this[i];e.call(this,r),this.requestUpdate(i,a,t)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,r)=>"object"==typeof r?dt(t,e,r):((t,e,r)=>{const i=e.hasOwnProperty(r);return e.constructor.createProperty(r,t),i?Object.getOwnPropertyDescriptor(e,r):void 0})(t,e,r)}function mt(t){return ht({...t,state:!0,attribute:!1})}class ut{static validateConfig(t){if(!t||"object"!=typeof t)throw new Error("Ring Alarm Card configuration is required and must be an object. Please provide a valid configuration.");if("custom:ring-alarm-card"!==t.type)throw new Error(`Ring Alarm Card: Invalid card type "${t.type}". Expected "custom:ring-alarm-card". Please check your card configuration.`);if(!t.entity)throw new Error('Ring Alarm Card: Entity field is required. Please specify an alarm_control_panel entity. Example: "entity: alarm_control_panel.ring_alarm"');if("string"!=typeof t.entity)throw new Error(`Ring Alarm Card: Entity field must be a string, but received ${typeof t.entity}. Example: "entity: alarm_control_panel.ring_alarm"`);if(!/^alarm_control_panel\./.test(t.entity))throw new Error(`Ring Alarm Card: Entity "${t.entity}" must be an alarm_control_panel entity. Expected format: "alarm_control_panel.your_alarm_name". Please check your Ring integration entities.`);const e=t.entity.split(".");if(2!==e.length||!e[1]||""===e[1].trim())throw new Error(`Ring Alarm Card: Entity "${t.entity}" is missing the entity name. Expected format: "alarm_control_panel.your_alarm_name". Please check your Ring integration entities.`);const r=e[1];if(!/^[a-zA-Z0-9_]+$/.test(r))throw new Error(`Ring Alarm Card: Entity name "${r}" contains invalid characters. Entity names can only contain letters, numbers, and underscores. Example: "alarm_control_panel.ring_alarm"`);if(/^\d/.test(r))throw new Error(`Ring Alarm Card: Entity name "${r}" cannot start with a number. Entity names must start with a letter or underscore. Example: "alarm_control_panel.ring_alarm"`);if(r.length<2)throw new Error(`Ring Alarm Card: Entity name "${r}" is too short. Entity names must be at least 2 characters long. Example: "alarm_control_panel.ring_alarm"`);if(void 0!==t.show_state_text&&"boolean"!=typeof t.show_state_text)throw new Error(`Ring Alarm Card: show_state_text must be true or false, but received ${typeof t.show_state_text}. Example: "show_state_text: true"`);if(void 0!==t.compact_mode&&"boolean"!=typeof t.compact_mode)throw new Error(`Ring Alarm Card: compact_mode must be true or false, but received ${typeof t.compact_mode}. Example: "compact_mode: false"`);if(void 0!==t.title&&null!==t.title&&"string"!=typeof t.title)throw new Error(`Ring Alarm Card: title must be a string, but received ${typeof t.title}. Example: "title: My Ring Alarm"`)}static validateEntityExists(t,e){if(!t||!t.states)throw new Error("Home Assistant connection is not available. Please wait for Home Assistant to load completely.");const r=t.states[e];if(!r)throw new Error(`Entity "${e}" not found in Home Assistant. Please check:\n• The entity exists in your Home Assistant\n• The Ring integration is properly configured\n• The entity ID is spelled correctly\n• The entity is available (not disabled)`);const i=e.split(".")[0];if("alarm_control_panel"!==i)throw new Error(`Entity "${e}" has domain "${i}" but must be an "alarm_control_panel" entity. Please check your Ring integration and ensure you're using the correct alarm entity.`);if("unavailable"===r.state)throw new Error(`Entity "${e}" is currently unavailable. This may be temporary. Please check:\n• Your Ring device is online\n• The Ring integration is working properly\n• Your internet connection is stable`)}static getDefaultConfig(){return{title:"Ring Alarm",show_state_text:!0,compact_mode:!1}}static mergeConfig(t){const e=this.getDefaultConfig(),r={...e,...t};return void 0===r.title&&(r.title=e.title),void 0===r.show_state_text&&(r.show_state_text=e.show_state_text),void 0===r.compact_mode&&(r.compact_mode=e.compact_mode),r}}class pt{static mapEntityState(t){switch(t.state.toLowerCase()){case"disarmed":return{state:"disarmed",icon:"mdi:shield-off",color:"--success-color",label:"Disarmed",isAnimated:!1};case"armed_home":return{state:"armed_home",icon:"mdi:home-lock",color:"--warning-color",label:"Armed Home",isAnimated:!1};case"armed_away":return{state:"armed_away",icon:"mdi:shield-lock",color:"--error-color",label:"Armed Away",isAnimated:!1};case"armed_night":return{state:"armed_night",icon:"mdi:weather-night",color:"--info-color",label:"Armed Night",isAnimated:!1};case"armed_vacation":return{state:"armed_vacation",icon:"mdi:airplane",color:"--warning-color",label:"Armed Vacation",isAnimated:!1};case"armed_custom_bypass":return{state:"armed_custom_bypass",icon:"mdi:shield-check",color:"--warning-color",label:"Armed Custom",isAnimated:!1};case"arming":return{state:"arming",icon:"mdi:shield-sync",color:"--info-color",label:"Arming",isAnimated:!0};case"disarming":return{state:"disarming",icon:"mdi:shield-sync",color:"--info-color",label:"Disarming",isAnimated:!0};case"pending":return{state:"pending",icon:"mdi:clock-outline",color:"--warning-color",label:"Pending",isAnimated:!0};case"triggered":return{state:"triggered",icon:"mdi:shield-alert",color:"--error-color",label:"Triggered",isAnimated:!0};default:return{state:"unknown",icon:"mdi:help-circle",color:"--disabled-text-color",label:"Unknown",isAnimated:!1}}}static getStateIcon(t){switch(t){case"disarmed":return"mdi:shield-off";case"armed_home":return"mdi:home-lock";case"armed_away":return"mdi:shield-lock";case"armed_night":return"mdi:weather-night";case"armed_vacation":return"mdi:airplane";case"armed_custom_bypass":return"mdi:shield-check";case"arming":case"disarming":return"mdi:shield-sync";case"pending":return"mdi:clock-outline";case"triggered":return"mdi:shield-alert";default:return"mdi:help-circle"}}static getStateColor(t){switch(t){case"disarmed":return"--success-color";case"armed_home":case"armed_vacation":case"armed_custom_bypass":case"pending":return"--warning-color";case"armed_away":case"triggered":return"--error-color";case"armed_night":case"arming":case"disarming":return"--info-color";default:return"--disabled-text-color"}}static getStateLabel(t){switch(t){case"disarmed":return"Disarmed";case"armed_home":return"Armed Home";case"armed_away":return"Armed Away";case"armed_night":return"Armed Night";case"armed_vacation":return"Armed Vacation";case"armed_custom_bypass":return"Armed Custom";case"arming":return"Arming";case"disarming":return"Disarming";case"pending":return"Pending";case"triggered":return"Triggered";default:return"Unknown"}}static isValidAlarmEntity(t){if(!t||!t.entity_id)return!1;return"alarm_control_panel"===t.entity_id.split(".")[0]}}class gt{static getControlActions(){return[{type:"disarm",service:"alarm_disarm",label:"Disarmed",icon:"mdi:shield-off",activeColor:"--success-color"},{type:"arm_home",service:"alarm_arm_home",label:"Home",icon:"mdi:home-lock",activeColor:"--warning-color"},{type:"arm_away",service:"alarm_arm_away",label:"Away",icon:"mdi:shield-lock",activeColor:"--error-color"}]}static getActiveAction(t){switch(t){case"disarmed":return"disarm";case"armed_home":return"arm_home";case"armed_away":return"arm_away";default:return null}}static areControlsDisabled(t){if(void 0===t)return!0;return["arming","disarming","pending","triggered"].includes(t)}static getServiceForAction(t){return{disarm:"alarm_disarm",arm_home:"alarm_arm_home",arm_away:"alarm_arm_away"}[t]}static getActionDisplayProperties(t){const e=gt.getControlActions().find(e=>e.type===t);return e?{label:e.label,icon:e.icon,activeColor:e.activeColor}:{label:"Unknown",icon:"mdi:help-circle",activeColor:"--disabled-text-color"}}}class ft{static renderAlarmStatus(t,e){const r=`alarm-${t.state}`,i=e.compact_mode?"compact":"",a=!1!==e.show_state_text;return W`
      <div
        class="alarm-status ${r} ${i}"
        role="status"
        aria-label="Alarm system status: ${t.label}"
        aria-live="polite"
      >
        <ha-icon
          icon="${t.icon}"
          class="alarm-icon"
          aria-hidden="true"
          style="color: var(${t.color})"
        ></ha-icon>
        ${a?W`
              <span
                class="alarm-text"
                aria-label="Current state: ${t.label}"
              >
                ${t.label}
              </span>
            `:""}
      </div>
    `}static renderErrorState(t){return W`
      <div class="alarm-error" role="alert" aria-label="Error: ${t}">
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:alert-circle"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          ${t}
        </div>
      </div>
    `}static renderLoadingState(){return W`
      <div
        class="alarm-loading"
        role="status"
        aria-label="Loading alarm status"
        aria-live="polite"
      >
        <ha-icon
          icon="mdi:loading"
          class="alarm-loading-icon"
          aria-hidden="true"
        ></ha-icon>
        <span>Loading...</span>
      </div>
    `}static renderEntityNotFound(t){const e=W`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div>Please check:</div>
        <ul style="margin: 4px 0; padding-left: 16px;">
          <li>The entity exists in Home Assistant</li>
          <li>The Ring integration is properly configured</li>
          <li>The entity ID is spelled correctly</li>
        </ul>
        <div style="margin-top: 4px;">
          <strong>Example:</strong> <code>alarm_control_panel.ring_alarm</code>
        </div>
      </div>
    `;return W`
      <div
        class="alarm-error"
        role="alert"
        aria-label="Entity not found error: ${t}"
      >
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:alert-circle-outline"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">${`Entity not found: ${t}`}</div>
            ${e}
          </div>
        </div>
      </div>
    `}static renderEntityUnavailable(t){const e=W`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div>This may be temporary. Please check:</div>
        <ul style="margin: 4px 0; padding-left: 16px;">
          <li>Your Ring device is online</li>
          <li>The Ring integration is working</li>
          <li>Your internet connection is stable</li>
        </ul>
        <div style="margin-top: 4px;">
          The card will automatically recover when the entity becomes available.
        </div>
      </div>
    `;return W`
      <div
        class="alarm-error"
        role="alert"
        aria-label="Entity unavailable: ${t}"
      >
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:wifi-off"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">${`Entity unavailable: ${t}`}</div>
            ${e}
          </div>
        </div>
      </div>
    `}static renderWrongEntityDomain(t,e){const r=W`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div>Found domain: <code>${e}</code></div>
        <div>Expected domain: <code>alarm_control_panel</code></div>
        <div style="margin-top: 4px;">
          Please use an alarm_control_panel entity from your Ring integration.
        </div>
        <div style="margin-top: 4px;">
          <strong>Example:</strong> <code>alarm_control_panel.ring_alarm</code>
        </div>
      </div>
    `;return W`
      <div
        class="alarm-error"
        role="alert"
        aria-label="Wrong entity domain: ${t}"
      >
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:alert-octagon"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">${`Wrong entity type: ${t}`}</div>
            ${r}
          </div>
        </div>
      </div>
    `}static renderConfigurationError(t){const e=W`
      <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.8;">
        <div><strong>Example configuration:</strong></div>
        <pre
          style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; margin: 4px 0; font-size: 0.8em;"
        >
type: custom:ring-alarm-card
entity: alarm_control_panel.ring_alarm
title: "My Ring Alarm"
show_state_text: true
compact_mode: false</pre
        >
      </div>
    `;return W`
      <div class="alarm-error" role="alert" aria-label="Configuration error">
        <div class="alarm-error-message">
          <ha-icon
            icon="mdi:cog-off"
            class="alarm-error-icon"
            aria-hidden="true"
          ></ha-icon>
          <div>
            <div style="font-weight: 500;">Configuration Error</div>
            <div style="margin-top: 4px;">${t}</div>
            ${e}
          </div>
        </div>
      </div>
    `}static renderControlButtons(t,e,r){const i=gt.getControlActions(),a=t?gt.getActiveAction(t.state):null,o=gt.areControlsDisabled(t?.state);return W`
      <div class="control-buttons" role="group" aria-label="Alarm control buttons">
        ${i.map(t=>{const i=e.get(t.type)||{isLoading:!1,isDisabled:!1,hasError:!1},n={isActive:a===t.type,isLoading:i.isLoading,isDisabled:o||i.isDisabled,hasError:i.hasError};return ft.renderControlButton(t,n,()=>r(t.type))})}
      </div>
    `}static renderControlButton(t,e,r){const i=["control-button"];e.isActive?i.push("active",t.type):i.push("inactive"),e.isLoading&&i.push("loading"),e.isDisabled&&i.push("disabled"),e.hasError&&i.push("error");const a={disarm:"Set alarm to disarmed",arm_home:"Arm alarm in home mode",arm_away:"Arm alarm in away mode"}[t.type],o=e.isLoading?"mdi:loading":t.icon;return W`
      <button
        class="${i.join(" ")}"
        aria-label="${a}"
        aria-pressed="${e.isActive?"true":"false"}"
        aria-disabled="${e.isDisabled?"true":"false"}"
        ?disabled="${e.isDisabled}"
        @click="${()=>{e.isDisabled||e.isLoading||r()}}"
      >
        <ha-icon
          class="control-button-icon"
          icon="${o}"
          aria-hidden="true"
        ></ha-icon>
        <span class="control-button-label">${t.label}</span>
      </button>
    `}}const yt=[s`
    :host {
      display: block;
    }

    .card {
      background: var(
        --ha-card-background,
        var(--card-background-color, white)
      );
      border-radius: var(--ha-card-border-radius, 12px);
      border: var(--ha-card-border-width, 1px) solid
        var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: 16px;
      box-sizing: border-box;
    }

    .title {
      font-size: 1.2em;
      font-weight: 500;
      margin-bottom: 12px;
      color: var(--primary-text-color);
    }

    .content {
      color: var(--secondary-text-color);
      line-height: 1.4;
    }

    .hello-world {
      text-align: center;
      padding: 20px;
      font-size: 1.1em;
      color: var(--primary-text-color);
    }

    .hass-status {
      text-align: center;
      margin-top: 8px;
      opacity: 0.7;
    }

    .hass-status small {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
  `,s`
  :host {
    /* Alarm state colors using HA theme variables */
    --alarm-disarmed-color: var(--success-color, #4caf50);
    --alarm-armed-home-color: var(--warning-color, #ff9800);
    --alarm-armed-away-color: var(--error-color, #f44336);
    --alarm-armed-night-color: var(--info-color, #2196f3);
    --alarm-armed-vacation-color: var(--warning-color, #ff9800);
    --alarm-armed-custom-color: var(--warning-color, #ff9800);
    --alarm-arming-color: var(--info-color, #2196f3);
    --alarm-disarming-color: var(--info-color, #2196f3);
    --alarm-pending-color: var(--warning-color, #ff9800);
    --alarm-triggered-color: var(--error-color, #f44336);
    --alarm-unknown-color: var(--disabled-text-color, #9e9e9e);

    /* Error state colors */
    --alarm-error-color: var(--error-color, #f44336);
    --alarm-warning-color: var(--warning-color, #ff9800);
    --alarm-error-background: var(--error-color, #f44336);
    --alarm-error-text: var(--text-primary-color, #ffffff);

    /* Additional theme integration for better accessibility */
    --alarm-background: var(
      --ha-card-background,
      var(--card-background-color, #ffffff)
    );
    --alarm-text-primary: var(--primary-text-color, #212121);
    --alarm-text-secondary: var(--secondary-text-color, #727272);
    --alarm-border-color: var(
      --ha-card-border-color,
      var(--divider-color, #e0e0e0)
    );
  }

  /* Alarm status display layout */
  .alarm-status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    gap: 12px;
    min-height: 60px;
  }

  .alarm-icon {
    --mdc-icon-size: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
    flex-shrink: 0;
    line-height: 1;
  }

  .alarm-text {
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--alarm-text-primary);
    line-height: 1;
    display: flex;
    align-items: center;
  }

  /* State-specific colors */
  .alarm-disarmed .alarm-icon {
    color: var(--alarm-disarmed-color);
  }

  .alarm-armed-home .alarm-icon {
    color: var(--alarm-armed-home-color);
  }

  .alarm-armed-away .alarm-icon {
    color: var(--alarm-armed-away-color);
  }

  .alarm-armed-night .alarm-icon {
    color: var(--alarm-armed-night-color);
  }

  .alarm-armed-vacation .alarm-icon {
    color: var(--alarm-armed-vacation-color);
  }

  .alarm-armed-custom-bypass .alarm-icon {
    color: var(--alarm-armed-custom-color);
  }

  .alarm-arming .alarm-icon {
    color: var(--alarm-arming-color);
  }

  .alarm-disarming .alarm-icon {
    color: var(--alarm-disarming-color);
  }

  .alarm-pending .alarm-icon {
    color: var(--alarm-pending-color);
  }

  .alarm-triggered .alarm-icon {
    color: var(--alarm-triggered-color);
  }

  .alarm-unknown .alarm-icon {
    color: var(--alarm-unknown-color);
  }

  /* Animation keyframes for pending state */
  @keyframes pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Animation keyframes for triggered state */
  @keyframes flash {
    0%,
    50% {
      opacity: 1;
    }
    25%,
    75% {
      opacity: 0.3;
    }
  }

  /* Apply animations to specific states */
  .alarm-pending .alarm-icon,
  .alarm-arming .alarm-icon,
  .alarm-disarming .alarm-icon {
    animation: pulse 2s infinite;
  }

  .alarm-triggered .alarm-icon {
    animation: flash 1s infinite;
  }

  /* Compact mode styles */
  .compact .alarm-status {
    padding: 12px;
    gap: 8px;
    min-height: 40px;
  }

  .compact .alarm-icon {
    --mdc-icon-size: 1.8rem;
  }

  .compact .alarm-text {
    font-size: 1rem;
  }

  /* Error state styles */
  .alarm-error {
    background-color: rgba(var(--rgb-error-color, 244, 67, 54), 0.1);
    border: 1px solid var(--alarm-error-color);
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 16px;
    margin: 8px 0;
    color: var(--alarm-text-primary);
  }

  .alarm-error-icon {
    color: var(--alarm-error-color);
    font-size: 1.5rem;
    margin-right: 8px;
  }

  .alarm-error-message {
    color: var(--alarm-error-color);
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .alarm-warning {
    background-color: rgba(var(--rgb-warning-color, 255, 152, 0), 0.1);
    border: 1px solid var(--alarm-warning-color);
    border-radius: var(--ha-card-border-radius, 12px);
    padding: 16px;
    margin: 8px 0;
    color: var(--alarm-text-primary);
  }

  .alarm-warning-icon {
    color: var(--alarm-warning-color);
    font-size: 1.5rem;
    margin-right: 8px;
  }

  .alarm-warning-message {
    color: var(--alarm-warning-color);
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  /* Loading state styles */
  .alarm-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    color: var(--alarm-text-secondary);
  }

  .alarm-loading-icon {
    font-size: 1.5rem;
    margin-right: 8px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Accessibility improvements */
  .alarm-status[role='status'] {
    /* Ensure proper focus handling for screen readers */
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .alarm-icon {
      filter: contrast(1.2);
    }

    .alarm-error,
    .alarm-warning {
      border-width: 2px;
    }

    /* Ensure better contrast in high contrast mode */
    .alarm-text {
      font-weight: 600;
    }
  }

  /* Dark theme specific adjustments */
  @media (prefers-color-scheme: dark) {
    :host {
      /* Adjust opacity for better dark theme visibility */
      --alarm-error-background-opacity: 0.15;
      --alarm-warning-background-opacity: 0.15;
    }

    .alarm-error {
      background-color: rgba(
        var(--rgb-error-color, 244, 67, 54),
        var(--alarm-error-background-opacity, 0.15)
      );
    }

    .alarm-warning {
      background-color: rgba(
        var(--rgb-warning-color, 255, 152, 0),
        var(--alarm-warning-background-opacity, 0.15)
      );
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .alarm-pending .alarm-icon,
    .alarm-arming .alarm-icon,
    .alarm-disarming .alarm-icon,
    .alarm-triggered .alarm-icon,
    .alarm-loading-icon {
      animation: none;
    }

    .alarm-icon {
      transition: none;
    }
  }
`,s`
  /* Control buttons container */
  .control-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    padding-top: 0;
  }

  /* Base button styles using HA CSS custom properties */
  .control-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 16px;
    min-width: 72px;
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1px solid var(--divider-color, #e0e0e0);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      transform 0.1s ease,
      opacity 0.2s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    position: relative;
    overflow: hidden;
  }

  .control-button:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  .control-button:hover:not(:disabled):not(.disabled) {
    background: var(--secondary-background-color, #f5f5f5);
  }

  .control-button:active:not(:disabled):not(.disabled) {
    transform: scale(0.98);
  }

  /* Button icon */
  .control-button-icon {
    --mdc-icon-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* Button label */
  .control-button-label {
    line-height: 1;
    white-space: nowrap;
  }

  /* Inactive state (default) */
  .control-button.inactive {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-color: var(--divider-color, #e0e0e0);
    color: var(--primary-text-color, #212121);
  }

  .control-button.inactive .control-button-icon {
    color: var(--secondary-text-color, #727272);
  }

  /* Active state - Disarmed (success/green) */
  .control-button.active.disarm {
    background: var(--success-color, #4caf50);
    border-color: var(--success-color, #4caf50);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.disarm .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Active state - Home (warning/orange) */
  .control-button.active.arm_home {
    background: var(--warning-color, #ff9800);
    border-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.arm_home .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Active state - Away (error/red) */
  .control-button.active.arm_away {
    background: var(--error-color, #f44336);
    border-color: var(--error-color, #f44336);
    color: var(--text-primary-color, #fff);
  }

  .control-button.active.arm_away .control-button-icon {
    color: var(--text-primary-color, #fff);
  }

  /* Disabled state */
  .control-button:disabled,
  .control-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Loading state */
  .control-button.loading {
    cursor: wait;
    pointer-events: none;
  }

  .control-button.loading .control-button-icon {
    animation: button-spin 1s linear infinite;
  }

  @keyframes button-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Error state */
  .control-button.error {
    border-color: var(--error-color, #f44336);
    background: rgba(244, 67, 54, 0.1);
    animation: button-shake 0.5s ease;
  }

  .control-button.error .control-button-icon {
    color: var(--error-color, #f44336);
  }

  @keyframes button-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-4px);
    }
    40%,
    80% {
      transform: translateX(4px);
    }
  }

  /* Compact mode variant styles */
  .compact .control-buttons {
    padding: 12px;
    padding-top: 0;
    gap: 6px;
  }

  .compact .control-button {
    padding: 8px 12px;
    min-width: 60px;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .compact .control-button-icon {
    --mdc-icon-size: 20px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .control-button {
      border-width: 2px;
    }

    .control-button.active {
      font-weight: 600;
    }

    .control-button:focus-visible {
      outline-width: 3px;
    }
  }

  /* Dark theme adjustments */
  @media (prefers-color-scheme: dark) {
    .control-button.inactive {
      background: var(
        --ha-card-background,
        var(--card-background-color, #1c1c1c)
      );
      border-color: var(--divider-color, #3c3c3c);
    }

    .control-button:hover:not(:disabled):not(.disabled) {
      background: var(--secondary-background-color, #2c2c2c);
    }

    .control-button.error {
      background: rgba(244, 67, 54, 0.15);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .control-button {
      transition: none;
    }

    .control-button.loading .control-button-icon {
      animation: none;
    }

    .control-button.error {
      animation: none;
    }
  }
`];function vt(t,e){if(t?.states)return t.states[e]}let _t=class extends st{constructor(){super(...arguments),this.buttonStates=new Map}static{this.styles=yt}_initializeButtonStates(){const t=gt.getControlActions(),e=new Map;for(const r of t)e.set(r.type,{isActive:!1,isLoading:!1,isDisabled:!1,hasError:!1});this.buttonStates=e}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._initializeButtonStates()}_updateButtonState(t,e){const r=this.buttonStates.get(t)||{isActive:!1,isLoading:!1,isDisabled:!1,hasError:!1},i=new Map(this.buttonStates);i.set(t,{...r,...e}),this.buttonStates=i}_clearButtonError(t){setTimeout(()=>{this._updateButtonState(t,{hasError:!1})},3e3)}async _handleControlButtonClick(t){if(this.hass&&this.config?.entity){this._updateButtonState(t,{isLoading:!0,hasError:!1});try{const e=gt.getServiceForAction(t);await this.hass.callService("alarm_control_panel",e,{entity_id:this.config.entity}),this._updateButtonState(t,{isLoading:!1})}catch(e){this._updateButtonState(t,{isLoading:!1,hasError:!0}),this._clearButtonError(t)}}}setConfig(t){ut.validateConfig(t),this.config=ut.mergeConfig(t),this.entityError=void 0,this.alarmState=void 0,this.hass&&this._validateAndInitializeEntity()}getCardSize(){return 2}updated(t){super.updated(t),t.has("hass")&&this._handleHassUpdate(t.get("hass"))}_handleHassUpdate(t){this.hass&&(t||!this.config?t&&t!==this.hass&&(this.config?.entity&&function(t,e,r){const i=vt(t,r),a=vt(e,r);return!((i||!a)&&(!i||a)&&(!i&&!a||i.state===a.state&&i.last_updated===a.last_updated))}(t,this.hass,this.config.entity)&&this._handleEntityStateChange(),t.selectedTheme!==this.hass.selectedTheme&&this._handleThemeChange()):this._validateAndInitializeEntity())}_handleThemeChange(){this.requestUpdate()}_handleEntityStateChange(){if(!this.config?.entity||!this.hass)return;const t=this.hass.states[this.config.entity];if(!t)return this.entityError=`entity_not_found:${this.config.entity}`,void(this.alarmState=void 0);if("unavailable"===t.state)return this.entityError=`entity_unavailable:${this.config.entity}`,void(this.alarmState=void 0);if(pt.isValidAlarmEntity(t))this.alarmState=pt.mapEntityState(t),this.entityError=void 0;else{const t=this.config.entity.split(".")[0];this.entityError=`wrong_domain:${this.config.entity}:${t}`,this.alarmState=void 0}}_validateAndInitializeEntity(){if(this.config?.entity&&this.hass)try{ut.validateEntityExists(this.hass,this.config.entity);const t=this.hass.states[this.config.entity];if(t&&pt.isValidAlarmEntity(t))this.alarmState=pt.mapEntityState(t),this.entityError=void 0;else{const t=this.config.entity.split(".")[0];this.entityError=`wrong_domain:${this.config.entity}:${t}`,this.alarmState=void 0}}catch(t){const e=t instanceof Error?t.message:"Unknown entity validation error";if(e.includes("not found"))this.entityError=`entity_not_found:${this.config.entity}`;else if(e.includes("unavailable"))this.entityError=`entity_unavailable:${this.config.entity}`;else if(e.includes("domain")){const t=this.config.entity.split(".")[0];this.entityError=`wrong_domain:${this.config.entity}:${t}`}else this.entityError=e;this.alarmState=void 0}}render(){if(!this.config)return W`
        <div class="card">
          <div class="content">
            <p>Card configuration required</p>
          </div>
        </div>
      `;const t=(e=this.hass)?e.states?"connected":"connecting":"not connected";var e;return W`
      <div class="card">
        ${this.config.title?W`<div class="title">${this.config.title}</div>`:""}
        <div class="content">${this._renderMainContent(t)}</div>
      </div>
    `}_renderMainContent(t){return"connected"!==t?W`
        <div class="hass-status">
          <small>Home Assistant: ${t}</small>
        </div>
      `:this.entityError?this._renderSpecificError(this.entityError):!this.alarmState&&this.config.entity?ft.renderLoadingState():this.alarmState?W`
        ${ft.renderAlarmStatus(this.alarmState,this.config)}
        ${this._renderControlButtons()}
      `:W`
      <div class="content">
        <p>No alarm data available</p>
      </div>
    `}_renderControlButtons(){return this.hass&&this.config?.entity?ft.renderControlButtons(this.alarmState,this.buttonStates,t=>this._handleControlButtonClick(t)):W``}_renderSpecificError(t){if(t.startsWith("entity_not_found:")){const e=t.split(":")[1]??"unknown";return ft.renderEntityNotFound(e)}if(t.startsWith("entity_unavailable:")){const e=t.split(":")[1]??"unknown";return ft.renderEntityUnavailable(e)}if(t.startsWith("wrong_domain:")){const e=t.split(":"),r=e[1]??"unknown",i=e[2]??"unknown";return ft.renderWrongEntityDomain(r,i)}if(t.startsWith("config_error:")){const e=t.substring(13);return ft.renderConfigurationError(e)}return ft.renderErrorState(t)}};t([ht({attribute:!1}),e("design:type",Object)],_t.prototype,"hass",void 0),t([mt(),e("design:type",Object)],_t.prototype,"config",void 0),t([mt(),e("design:type",Object)],_t.prototype,"alarmState",void 0),t([mt(),e("design:type",Object)],_t.prototype,"entityError",void 0),t([mt(),e("design:type",Map)],_t.prototype,"buttonStates",void 0),_t=t([(t=>(e,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("ring-alarm-card")],_t),window.customCards=window.customCards||[],window.customCards.push({type:"ring-alarm-card",name:"Ring Alarm Card",description:"A custom card for Ring alarm systems",preview:!0,documentationURL:"https://github.com/your-repo/ring-alarm-card#readme",version:"0.1.0"});export{ut as ConfigurationManager,_t as RingAlarmCard};
