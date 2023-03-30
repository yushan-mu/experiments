/*! @maps4html/web-map-custom-element 30-03-2023 */

import"./leaflet.js";import"./mapml.js";import DOMTokenList from"./DOMTokenList.js";import{MapLayer}from"./layer.js";import{MapArea}from"./map-area.js";import{MapCaption}from"./map-caption.js";class WebMap extends HTMLMapElement{static get observedAttributes(){return["lat","lon","zoom","projection","width","height","controls","static","controlslist"]}get controls(){return this.hasAttribute("controls")}set controls(t){Boolean(t)?this.setAttribute("controls",""):this.removeAttribute("controls")}get controlsList(){return this._controlsList}set controlsList(t){this._controlsList.value=t,this.setAttribute("controlslist",t)}get width(){return window.getComputedStyle(this).width.replace("px","")}set width(t){this.setAttribute("width",t)}get height(){return window.getComputedStyle(this).height.replace("px","")}set height(t){this.setAttribute("height",t)}get lat(){return this.hasAttribute("lat")?this.getAttribute("lat"):"0"}set lat(t){t&&this.setAttribute("lat",t)}get lon(){return this.hasAttribute("lon")?this.getAttribute("lon"):"0"}set lon(t){t&&this.setAttribute("lon",t)}get projection(){return this.hasAttribute("projection")?this.getAttribute("projection"):"OSMTILE"}set projection(t){if(!t||!M[t])throw new Error("Undefined Projection");if(this.setAttribute("projection",t),this._map&&this._map.options.projection!==t){this._map.options.crs=M[t],this._map.options.projection=t;for(var e of this.querySelectorAll("layer-")){e.removeAttribute("disabled");e=this.removeChild(e);this.appendChild(e)}if(this._debug)for(let t=0;t<2;t++)this.toggleDebug()}else this.dispatchEvent(new CustomEvent("createmap"))}get zoom(){return this.hasAttribute("zoom")?this.getAttribute("zoom"):0}set zoom(t){t=parseInt(t,10);!isNaN(t)&&0<=t&&t<=25&&this.setAttribute("zoom",t)}get layers(){return this.getElementsByTagName("layer-")}get areas(){return this.getElementsByTagName("area")}get extent(){let t=this._map,e=M.pixelToPCRSBounds(t.getPixelBounds(),t.getZoom(),t.options.projection),o=M._convertAndFormatPCRS(e,t);return t.getMaxZoom()!==1/0&&(o.zoom={minZoom:t.getMinZoom(),maxZoom:t.getMaxZoom()}),o}get static(){return this.hasAttribute("static")}set static(t){Boolean(t)?this.setAttribute("static",""):this.removeAttribute("static")}constructor(){super(),this._source=this.outerHTML,this._history=[],this._historyIndex=-1,this._traversalCall=!1}connectedCallback(){this._createShadowRoot(),this._controlsList=new DOMTokenList(this.getAttribute("controlslist"),this,"controlslist",["noreload","nofullscreen","nozoom","nolayer"]);var t=window.getComputedStyle(this),e=t.width,t=t.height,e=this.hasAttribute("width")?this.getAttribute("width"):parseInt(e.replace("px","")),t=this.hasAttribute("height")?this.getAttribute("height"):parseInt(t.replace("px",""));this._changeWidth(e),this._changeHeight(t),this.addEventListener("createmap",this._createMap),["CBMTILE","APSTILE","OSMTILE","WGS84"].includes(this.projection)&&this.dispatchEvent(new CustomEvent("createmap")),this._toggleControls(),this._toggleStatic();let o=this.querySelector("map-caption");null!==o&&setTimeout(()=>{this.getAttribute("aria-label")===o.innerHTML&&(this.mapCaptionObserver=new MutationObserver(t=>{this.querySelector("map-caption")!==o&&this.removeAttribute("aria-label")}),this.mapCaptionObserver.observe(this,{childList:!0}))},0)}_createShadowRoot(){let t=document.createElement("template");t.innerHTML=`<link rel="stylesheet" href="${new URL("mapml.css",import.meta.url).href}">`;const e=document.createElement("div");e.classList.add("mapml-web-map");let o=e.attachShadow({mode:"open"});this._container=document.createElement("div");this._container.insertAdjacentHTML("beforeend","<output role='status' aria-live='polite' aria-atomic='true' class='mapml-screen-reader-output'></output>");let i=document.createElement("style");i.innerHTML='[is="web-map"] {all: initial;contain: layout size;display: inline-block;height: 150px;width: 300px;border-width: 2px;border-style: inset;box-sizing: inherit;}[is="web-map"][frameborder="0"] {border-width: 0;}[is="web-map"][hidden] {display: none!important;}[is="web-map"] .mapml-web-map {display: contents;}';let n=document.createElement("style");n.innerHTML=":host .leaflet-control-container {visibility: hidden!important;}";let s=document.createElement("style");s.innerHTML='[is="web-map"] > :not(area):not(.mapml-web-map) {display: none!important;}',this.appendChild(s),o.appendChild(n),o.appendChild(t.content.cloneNode(!0)),o.appendChild(this._container),this.appendChild(e),document.head.insertAdjacentElement("afterbegin",i)}_createMap(){var t;this._map||(this._map=L.map(this._container,{center:new L.LatLng(this.lat,this.lon),projection:this.projection,query:!0,contextMenu:!0,announceMovement:M.options.announceMovement,featureIndex:!0,mapEl:this,crs:M[this.projection],zoom:this.zoom,zoomControl:!1,fadeAnimation:!0}),this._addToHistory(),M.attributionControl(this),this._createControls(),this._crosshair=M.crosshair().addTo(this._map),M.options.featureIndexOverlayOption&&(this._featureIndexOverlay=M.featureIndexOverlay().addTo(this._map)),!this.hasAttribute("name")||(t=this.getAttribute("name"))&&(this.poster=document.querySelector('img[usemap="#'+t+'"]'),this.poster&&L.Browser.gecko&&this.poster.removeAttribute("usemap")),this.poster&&this.poster.setAttribute("hidden",""),this.setAttribute("role","application"),this._container.setAttribute("role","region"),this._container.setAttribute("aria-label","Interactive map"),this._setUpEvents())}disconnectedCallback(){delete this._map}adoptedCallback(){}attributeChangedCallback(t,e,o){switch(t){case"controlslist":this._controlsList&&(!1===this._controlsList.valueSet&&(this._controlsList.value=o),this._toggleControls());break;case"controls":null!==e&&null===o?this._hideControls():null===e&&null!==o&&this._showControls();break;case"height":e!==o&&this._changeHeight(o);break;case"width":e!==o&&this._changeWidth(o);break;case"static":this._toggleStatic()}}_createControls(){let t=this._map.getSize().y,e=0;this._layerControl=M.layerControl(null,{collapsed:!0,mapEl:this}).addTo(this._map),!this._zoomControl&&e+93<=t&&(e+=93,this._zoomControl=L.control.zoom().addTo(this._map)),!this._reloadButton&&e+49<=t&&(e+=49,this._reloadButton=M.reloadButton().addTo(this._map)),!this._fullScreenControl&&e+49<=t&&(e+=49,this._fullScreenControl=M.fullscreenButton().addTo(this._map))}_toggleControls(){!1===this.controls?(this._hideControls(),this._map.contextMenu.toggleContextMenuItem("Controls","disabled")):(this._showControls(),this._map.contextMenu.toggleContextMenuItem("Controls","enabled"))}_hideControls(){this._setControlsVisibility("fullscreen",!0),this._setControlsVisibility("layercontrol",!0),this._setControlsVisibility("reload",!0),this._setControlsVisibility("zoom",!0)}_showControls(){this._setControlsVisibility("fullscreen",!1),this._setControlsVisibility("layercontrol",!1),this._setControlsVisibility("reload",!1),this._setControlsVisibility("zoom",!1),this._controlsList&&this._controlsList.forEach(t=>{switch(t.toLowerCase()){case"nofullscreen":this._setControlsVisibility("fullscreen",!0);break;case"nolayer":this._setControlsVisibility("layercontrol",!0);break;case"noreload":this._setControlsVisibility("reload",!0);break;case"nozoom":this._setControlsVisibility("zoom",!0)}}),this._layerControl&&0===this._layerControl._layers.length&&this._layerControl._container.setAttribute("hidden","")}_setControlsVisibility(t,e){let o;switch(t){case"zoom":this._zoomControl&&(o=this._zoomControl._container);break;case"reload":this._reloadButton&&(o=this._reloadButton._container);break;case"fullscreen":this._fullScreenControl&&(o=this._fullScreenControl._container);break;case"layercontrol":this._layerControl&&(o=this._layerControl._container)}o&&(e?([...o.children].forEach(t=>{t.setAttribute("hidden","")}),o.setAttribute("hidden","")):([...o.children].forEach(t=>{t.removeAttribute("hidden")}),o.removeAttribute("hidden")))}_toggleStatic(){var t=this.hasAttribute("static");this._map&&(t?(this._map.dragging.disable(),this._map.touchZoom.disable(),this._map.doubleClickZoom.disable(),this._map.scrollWheelZoom.disable(),this._map.boxZoom.disable(),this._map.keyboard.disable(),this._zoomControl.disable()):(this._map.dragging.enable(),this._map.touchZoom.enable(),this._map.doubleClickZoom.enable(),this._map.scrollWheelZoom.enable(),this._map.boxZoom.enable(),this._map.keyboard.enable(),this._zoomControl.enable()))}_dropHandler(t){t.preventDefault();t=t.dataTransfer.getData("text");M._pasteLayer(this,t)}_dragoverHandler(t){t.preventDefault(),t.dataTransfer.dropEffect="copy"}_removeEvents(){this._map&&(this._map.off(),this.removeEventListener("drop",this._dropHandler,!1),this.removeEventListener("dragover",this._dragoverHandler,!1))}_setUpEvents(){this.addEventListener("drop",this._dropHandler,!1),this.addEventListener("dragover",this._dragoverHandler,!1),this.addEventListener("change",function(t){"LAYER-"===t.target.tagName&&this.dispatchEvent(new CustomEvent("layerchange",{details:{target:this,originalEvent:t}}))},!1),this.parentElement.addEventListener("keyup",function(t){9===t.keyCode&&"MAPML-VIEWER"===document.activeElement.nodeName&&document.activeElement.dispatchEvent(new CustomEvent("mapfocused",{detail:{target:this}}))}),this.addEventListener("keydown",function(t){86===t.keyCode&&t.ctrlKey?navigator.clipboard.readText().then(t=>{M._pasteLayer(this,t)}):32===t.keyCode&&"INPUT"!==document.activeElement.shadowRoot.activeElement.nodeName&&(t.preventDefault(),this._map.fire("keypress",{originalEvent:t}))}),this.parentElement.addEventListener("mousedown",function(t){"MAPML-VIEWER"===document.activeElement.nodeName&&document.activeElement.dispatchEvent(new CustomEvent("mapfocused",{detail:{target:this}}))}),this._map.on("load",function(){this.dispatchEvent(new CustomEvent("load",{detail:{target:this}}))},this),this._map.on("preclick",function(t){this.dispatchEvent(new CustomEvent("preclick",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("click",function(t){this.dispatchEvent(new CustomEvent("click",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("dblclick",function(t){this.dispatchEvent(new CustomEvent("dblclick",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mousemove",function(t){this.dispatchEvent(new CustomEvent("mousemove",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mouseover",function(t){this.dispatchEvent(new CustomEvent("mouseover",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mouseout",function(t){this.dispatchEvent(new CustomEvent("mouseout",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mousedown",function(t){this.dispatchEvent(new CustomEvent("mousedown",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("mouseup",function(t){this.dispatchEvent(new CustomEvent("mouseup",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("contextmenu",function(t){this.dispatchEvent(new CustomEvent("contextmenu",{detail:{lat:t.latlng.lat,lon:t.latlng.lng,x:t.containerPoint.x,y:t.containerPoint.y}}))},this),this._map.on("movestart",function(){this._updateMapCenter(),this.dispatchEvent(new CustomEvent("movestart",{detail:{target:this}}))},this),this._map.on("move",function(){this._updateMapCenter(),this.dispatchEvent(new CustomEvent("move",{detail:{target:this}}))},this),this._map.on("moveend",function(){this._updateMapCenter(),this._addToHistory(),this.dispatchEvent(new CustomEvent("moveend",{detail:{target:this}}))},this),this._map.on("zoomstart",function(){this._updateMapCenter(),this.dispatchEvent(new CustomEvent("zoomstart",{detail:{target:this}}))},this),this._map.on("zoom",function(){this._updateMapCenter(),this.dispatchEvent(new CustomEvent("zoom",{detail:{target:this}}))},this),this._map.on("zoomend",function(){this._updateMapCenter(),this.dispatchEvent(new CustomEvent("zoomend",{detail:{target:this}}))},this),this.addEventListener("fullscreenchange",function(t){null===document.fullscreenElement?this._map.contextMenu.setViewFullScreenInnerHTML("view"):this._map.contextMenu.setViewFullScreenInnerHTML("exit")}),this.addEventListener("keydown",function(t){"mapml-web-map"===document.activeElement.className&&(t.ctrlKey&&82===t.keyCode?(t.preventDefault(),this.reload()):t.altKey&&39===t.keyCode?(t.preventDefault(),this.forward()):t.altKey&&37===t.keyCode&&(t.preventDefault(),this.back()))})}toggleDebug(){this._debug?(this._debug.remove(),this._debug=void 0):this._debug=M.debugOverlay().addTo(this._map)}_changeWidth(t){this._container&&(this._container.style.width=t+"px",document.querySelector('[is="web-map"]').style.width=t+"px"),this._map&&this._map.invalidateSize(!1)}_changeHeight(t){this._container&&(this._container.style.height=t+"px",document.querySelector('[is="web-map"]').style.height=t+"px"),this._map&&this._map.invalidateSize(!1)}zoomTo(t,e,o){o=Number.isInteger(+o)?+o:this.zoom;e=new L.LatLng(+t,+e);this._map.setView(e,o),this.zoom=o,this.lat=e.lat,this.lon=e.lng}_updateMapCenter(){this.lat=this._map.getCenter().lat,this.lon=this._map.getCenter().lng,this.zoom=this._map.getZoom()}_addToHistory(){var t;0<this._traversalCall?this._traversalCall--:(t=this._map.getPixelBounds().getCenter(),t={zoom:this._map.getZoom(),x:t.x,y:t.y},this._historyIndex++,this._history.splice(this._historyIndex,0,t),this._historyIndex+1!==this._history.length&&(this._history.length=this._historyIndex+1),0===this._historyIndex?(this._map.contextMenu.toggleContextMenuItem("Back","disabled"),this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","disabled"),this._reloadButton?.disable()):(this._map.contextMenu.toggleContextMenuItem("Back","enabled"),this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","enabled"),this._reloadButton?.enable()))}back(){var t,e=this._history,o=e[this._historyIndex];0<this._historyIndex&&(this._map.contextMenu.toggleContextMenuItem("Forward","enabled"),this._historyIndex--,t=e[this._historyIndex],0===this._historyIndex&&(this._map.contextMenu.toggleContextMenuItem("Back","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","disabled"),this._reloadButton?.disable()),t.zoom!==o.zoom?(this._traversalCall=2,e=this._map.options.crs.scale(o.zoom)/this._map.options.crs.scale(t.zoom),this._map.panBy([t.x*e-o.x,t.y*e-o.y],{animate:!1}),this._map.setZoom(t.zoom)):(this._traversalCall=1,this._map.panBy([t.x-o.x,t.y-o.y])))}forward(){var t,e=this._history,o=e[this._historyIndex];this._historyIndex<e.length-1&&(this._map.contextMenu.toggleContextMenuItem("Back","enabled"),this._map.contextMenu.toggleContextMenuItem("Reload","enabled"),this._reloadButton?.enable(),this._historyIndex++,t=e[this._historyIndex],this._historyIndex+1===this._history.length&&this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),t.zoom!==o.zoom?(this._traversalCall=2,e=this._map.options.crs.scale(o.zoom)/this._map.options.crs.scale(t.zoom),this._map.panBy([t.x*e-o.x,t.y*e-o.y],{animate:!1}),this._map.setZoom(t.zoom)):(this._traversalCall=1,this._map.panBy([t.x-o.x,t.y-o.y])))}reload(){var t=this._history.shift(),e=this._map.getPixelBounds().getCenter(),o={zoom:this._map.getZoom(),x:e.x,y:e.y};this._map.contextMenu.toggleContextMenuItem("Back","disabled"),this._map.contextMenu.toggleContextMenuItem("Forward","disabled"),this._map.contextMenu.toggleContextMenuItem("Reload","disabled"),this._reloadButton?.disable(),this._history=[t],this._historyIndex=0,t.zoom!==o.zoom?(this._traversalCall=2,e=this._map.options.crs.scale(o.zoom)/this._map.options.crs.scale(t.zoom),this._map.panBy([t.x*e-o.x,t.y*e-o.y],{animate:!1}),this._map.setZoom(t.zoom)):(this._traversalCall=1,this._map.panBy([t.x-o.x,t.y-o.y]))}_toggleFullScreen(){this._map.toggleFullscreen()}viewSource(){var t=new Blob([this._source],{type:"text/plain"}),t=URL.createObjectURL(t);window.open(t),URL.revokeObjectURL(t)}defineCustomProjection(t){let e=JSON.parse(t);if(!(void 0!==e&&e.proj4string&&e.projection&&e.resolutions&&e.origin&&e.bounds))throw new Error("Incomplete TCRS Definition");if(0<=e.projection.indexOf(":"))throw new Error('":" is not permitted in projection name');if(M[e.projection.toUpperCase()])return e.projection.toUpperCase();t=[256,512,1024,2048,4096].includes(e.tilesize)?e.tilesize:256;return M[e.projection]=new L.Proj.CRS(e.projection,e.proj4string,{origin:e.origin,resolutions:e.resolutions,bounds:L.bounds(e.bounds),crs:{tcrs:{horizontal:{name:"x",min:0,max:t=>Math.round(M[e.projection].options.bounds.getSize().x/M[e.projection].options.resolutions[t])},vertical:{name:"y",min:0,max:t=>Math.round(M[e.projection].options.bounds.getSize().y/M[e.projection].options.resolutions[t])},bounds:t=>L.bounds([M[e.projection].options.crs.tcrs.horizontal.min,M[e.projection].options.crs.tcrs.vertical.min],[M[e.projection].options.crs.tcrs.horizontal.max(t),M[e.projection].options.crs.tcrs.vertical.max(t)])},pcrs:{horizontal:{name:"easting",get min(){return M[e.projection].options.bounds.min.x},get max(){return M[e.projection].options.bounds.max.x}},vertical:{name:"northing",get min(){return M[e.projection].options.bounds.min.y},get max(){return M[e.projection].options.bounds.max.y}},get bounds(){return M[e.projection].options.bounds}},gcrs:{horizontal:{name:"longitude",get min(){return M[e.projection].unproject(M.OSMTILE.options.bounds.min).lng},get max(){return M[e.projection].unproject(M.OSMTILE.options.bounds.max).lng}},vertical:{name:"latitude",get min(){return M[e.projection].unproject(M.OSMTILE.options.bounds.min).lat},get max(){return M[e.projection].unproject(M.OSMTILE.options.bounds.max).lat}},get bounds(){return L.latLngBounds([M[e.projection].options.crs.gcrs.vertical.min,M[e.projection].options.crs.gcrs.horizontal.min],[M[e.projection].options.crs.gcrs.vertical.max,M[e.projection].options.crs.gcrs.horizontal.max])}},map:{horizontal:{name:"i",min:0,max:t=>t.getSize().x},vertical:{name:"j",min:0,max:t=>t.getSize().y},bounds:t=>L.bounds(L.point([0,0]),t.getSize())},tile:{horizontal:{name:"i",min:0,max:t},vertical:{name:"j",min:0,max:t},get bounds(){return L.bounds([M[e.projection].options.crs.tile.horizontal.min,M[e.projection].options.crs.tile.vertical.min],[M[e.projection].options.crs.tile.horizontal.max,M[e.projection].options.crs.tile.vertical.max])}},tilematrix:{horizontal:{name:"column",min:0,max:t=>Math.round(M[e.projection].options.crs.tcrs.horizontal.max(t)/M[e.projection].options.crs.tile.bounds.getSize().x)},vertical:{name:"row",min:0,max:t=>Math.round(M[e.projection].options.crs.tcrs.vertical.max(t)/M[e.projection].options.crs.tile.bounds.getSize().y)},bounds:t=>L.bounds([M[e.projection].options.crs.tilematrix.horizontal.min,M[e.projection].options.crs.tilematrix.vertical.min],[M[e.projection].options.crs.tilematrix.horizontal.max(t),M[e.projection].options.crs.tilematrix.vertical.max(t)])}}}),M[e.projection.toUpperCase()]=M[e.projection],e.projection}geojson2mapml(t,e={}){void 0===e.projection&&(e.projection=this.projection);e=M.geojson2mapml(t,e);return this.appendChild(e),e}_ready(){var t;!this.hasAttribute("name")||(t=this.getAttribute("name"))&&(this.poster=document.querySelector('img[usemap="#'+t+'"]'),this.poster&&(L.Browser.gecko&&this.poster.removeAttribute("usemap"),this._container.appendChild(this.poster)))}}window.customElements.define("web-map",WebMap,{extends:"map"}),window.customElements.define("layer-",MapLayer),window.customElements.define("map-area",MapArea,{extends:"area"}),window.customElements.define("map-caption",MapCaption);export{WebMap};
//# sourceMappingURL=web-map.js.map