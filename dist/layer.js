/*! @maps4html/web-map-custom-element 03-02-2023 */

import"./leaflet.js";import"./mapml.js";class MapLayer extends HTMLElement{static get observedAttributes(){return["src","label","checked","hidden","opacity"]}get src(){return this.hasAttribute("src")?this.getAttribute("src"):""}set src(t){var e,a;t&&(this.setAttribute("src",t),this._layer&&(e=this.opacity,this.disconnectedCallback(),a=this.baseURI||document.baseURI,this._layer=M.mapMLLayer(t?new URL(t,a).href:null,this),this._layer.on("extentload",this._onLayerExtentLoad,this),this._setUpEvents(),this.parentNode&&this.connectedCallback(),this.opacity=e))}get label(){return this.hasAttribute("label")?this.getAttribute("label"):""}set label(t){t&&this.setAttribute("label",t)}get checked(){return this.hasAttribute("checked")}set checked(t){t?this.setAttribute("checked",""):this.removeAttribute("checked")}get hidden(){return this.hasAttribute("hidden")}set hidden(t){t?this.setAttribute("hidden",""):this.removeAttribute("hidden")}get opacity(){return this._layer._container.style.opacity||this._layer.options.opacity}set opacity(t){1<+t||+t<0||this._layer.changeOpacity(t)}constructor(){super()}disconnectedCallback(){this.hasAttribute("data-moving")||(this._removeEvents(),this._layer._map&&this._layer._map.removeLayer(this._layer),this._layerControl&&!this.hidden&&this._layerControl.removeLayer(this._layer))}connectedCallback(){this.hasAttribute("data-moving")||(this.parentNode.addEventListener("createmap",()=>{this._ready(),this.parentNode._map&&this._attachedToMap(),this._layerControl&&!this.hidden&&this._layerControl.addOrUpdateOverlay(this._layer,this.label)},{once:!0}),this.parentNode._map&&this.parentNode.dispatchEvent(new CustomEvent("createmap")))}adoptedCallback(){}attributeChangedCallback(t,e,a){switch(t){case"label":e!==a&&this.dispatchEvent(new CustomEvent("labelchanged",{detail:{target:this}}));break;case"checked":this._layer&&("string"==typeof a?this.parentElement._map.addLayer(this._layer):this.parentElement._map.removeLayer(this._layer),this.dispatchEvent(new Event("change",{bubbles:!0})));break;case"hidden":this.parentElement&&this.parentElement._map&&this.parentElement.controls&&("string"==typeof a?this._layer&&this.parentElement._layerControl.removeLayer(this._layer):(this._layerControl=this.parentElement._layerControl,this._layerControl.addOrUpdateOverlay(this._layer,this.label),this._validateDisabled()));break;case"opacity":e!==a&&this._layer&&(this.opacity=a)}}_onLayerExtentLoad(t){this._layer._legendUrl&&(this.legendLinks=[{type:"application/octet-stream",href:this._layer._legendUrl,rel:"legend",lang:null,hreflang:null,sizes:null}]),this._layer._title&&(this.label=this._layer._title),this._layer._map&&this._layer.fire("attached",this._layer),this._layerControl&&this._layerControl.addOrUpdateOverlay(this._layer,this.label),this._layer.error?this.dispatchEvent(new CustomEvent("error",{detail:{target:this}})):this.dispatchEvent(new CustomEvent("loadedmetadata",{detail:{target:this}}))}_validateDisabled(){setTimeout(()=>{let s=this._layer,t=s._map;if(t){let a=0,i=0,e=["_staticTileLayer","_imageLayer","_mapmlvectors","_templatedLayer"];if(s.validProjection)for(let t=0;t<e.length;t++){var r=e[t];if(this.checked&&s[r])if("_templatedLayer"===r)for(let e=0;e<s._extent._mapExtents.length;e++)for(let t=0;t<s._extent._mapExtents[e].templatedLayer._templates.length;t++)"query"!==s._extent._mapExtents[e].templatedLayer._templates[t].rel&&(i++,s._extent._mapExtents[e].removeAttribute("disabled"),s._extent._mapExtents[e].disabled=!1,s._extent._mapExtents[e].templatedLayer._templates[t].layer.isVisible||(a++,s._extent._mapExtents[e].setAttribute("disabled",""),s._extent._mapExtents[e].disabled=!0));else i++,s[r].isVisible||a++}else a=1,i=1;a===i&&0!==a?(this.setAttribute("disabled",""),this.disabled=!0):(this.removeAttribute("disabled"),this.disabled=!1),t.fire("validate")}},0)}_onLayerChange(){this._layer._map&&(this.checked=this._layer._map.hasLayer(this._layer))}_ready(){var t=this.baseURI||document.baseURI,e=this.hasAttribute("opacity")?this.getAttribute("opacity"):"1.0";this._layer=M.mapMLLayer(this.src?new URL(this.src,t).href:null,this,{mapprojection:this.parentElement._map.options.projection,opacity:e}),this._layer.on("extentload",this._onLayerExtentLoad,this),this._setUpEvents()}_attachedToMap(){for(var t=0,e=1,a=this.parentNode.children;t<a.length;t++)"LAYER-"===this.parentNode.children[t].nodeName&&(this.parentNode.children[t]===this?e=t+1:this.parentNode.children[t]._layer&&this.parentNode.children[t]._layer.setZIndex(t+1));var i=this.parentNode.projection||"OSMTILE";L.setOptions(this._layer,{zIndex:e,mapprojection:i,opacity:window.getComputedStyle(this).opacity}),this._layer._map=this.parentNode._map,this._layer.fire("attached"),this.checked&&this._layer.addTo(this._layer._map),this._layer.on("add remove",this._onLayerChange,this),this._layer.on("add remove extentload",this._validateDisabled,this),this.parentNode._layerControl&&!this.hidden&&(this._layerControl=this.parentNode._layerControl,this._layerControl.addOrUpdateOverlay(this._layer,this.label)),this._layer._map.on("moveend",this._validateDisabled,this),this._layer._map.on("checkdisabled",this._validateDisabled,this)}_removeEvents(){this._layer&&(this._layer.off("loadstart",!1,this),this._layer.off("changestyle",!1,this),this._layer.off("add remove",this._onLayerChange,this))}_setUpEvents(){this._layer.on("loadstart",function(){this.dispatchEvent(new CustomEvent("loadstart",{detail:{target:this}}))},this),this._layer.on("changestyle",function(t){this.src=t.src,this.dispatchEvent(new CustomEvent("changestyle",{detail:{target:this}}))},this),this._layer.on("changeprojection",function(t){this.src=t.href,this.dispatchEvent(new CustomEvent("changeprojection",{detail:{target:this}}))},this)}focus(){if(this.extent){let t=this._layer._map,e=this.extent.topLeft.pcrs,a=this.extent.bottomRight.pcrs,i=L.bounds(L.point(e.horizontal,e.vertical),L.point(a.horizontal,a.vertical)),s=t.options.crs.unproject(i.getCenter(!0)),r=t.getZoom();var o=this.extent.zoom.maxZoom,d=this.extent.zoom.minZoom;let n=t.options.crs.scale(r),h=t.options.crs.transformation.transform(i.getCenter(!0),n);var p=t.getSize().divideBy(2),c=h.subtract(p).round(),_=h.add(p).round(),y=M.pixelToPCRSPoint(c,r,t.options.projection),m=M.pixelToPCRSPoint(_,r,t.options.projection);let l=L.bounds(y,m);for(var b=l.contains(i)?1:-1;-1==b&&!l.contains(i)&&r-1>=d||1==b&&l.contains(i)&&r+1<=o;)r+=b,n=t.options.crs.scale(r),h=t.options.crs.transformation.transform(i.getCenter(!0),n),c=h.subtract(p).round(),_=h.add(p).round(),y=M.pixelToPCRSPoint(c,r,t.options.projection),m=M.pixelToPCRSPoint(_,r,t.options.projection),l=L.bounds(y,m);1==b&&0<=r-1&&r--,t.setView(s,r,{animate:!1})}}mapml2geojson(t={}){return M.mapml2geojson(this,t)}}export{MapLayer};
//# sourceMappingURL=layer.js.map