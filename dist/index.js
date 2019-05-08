(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["api-req-redux"] = factory();
	else
		root["api-req-redux"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: apiRequestRedux */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"apiRequestRedux\", function() { return apiRequestRedux; });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\n\nconst defaultErrorCodes = [400, 403, 404, 405, 408, 500, 501, 502, 503, 504];\n\nconst defaultHeaders = () => [['Content-Type', 'application/json']];\n\nconst defaultRefreshExceptions = ['logout', 'auth'];\n\nconst apiRequestRedux = config => {\n  let refresh = null;\n  const {\n    store,\n    refreshFnc,\n    refreshExceptions = defaultRefreshExceptions,\n    headers = defaultHeaders,\n    errorCodes = defaultErrorCodes,\n    defaultCredentials = 'same-origin',\n    onErrorFnc,\n    reset\n  } = config;\n\n  const apiRequest = async requestConfig => {\n    const {\n      url,\n      method = 'GET',\n      body,\n      additionalHeaders = () => null,\n      onStart,\n      onError,\n      onSuccess,\n      selector,\n      credentials = defaultCredentials,\n      useDefaultErrorHandler = true,\n      removeHeaders,\n      bodyParser\n    } = requestConfig;\n    const { getState, dispatch } = store();\n    try {\n      onStart && (await dispatch(onStart()));\n\n      const payload = body || selector\n        ? bodyParser ? bodyParser(body || selector(getState()) ) : JSON.stringify(body || (selector(getState())) || {})\n        : null;\n      const finalHeaders = Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getHeaders\"])(headers(getState()), additionalHeaders(getState()));\n      removeHeaders && removeHeaders.forEach(item => finalHeaders.delete(item));\n\n      const result = await fetch(url, {\n        method,\n        credentials,\n        headers: finalHeaders,\n        body: payload\n      });\n\n      if (!result.ok) {\n        throw result;\n      }\n\n      const data = await Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"parseJSON\"])(result);\n\n      onSuccess && (await dispatch(onSuccess(data)));\n      return Promise.resolve(data);\n    } catch (err) {\n      const { url, status } = err;\n\n      if (\n        status === 401 &&\n        !refreshExceptions.some(item => url.includes(item)) &&\n        refreshFnc\n      ) {\n        if (refresh === null) {\n          try {\n            refresh = refreshFnc(getState());\n            await refresh;\n            refresh = null;\n            await apiRequest(requestConfig);\n          } catch (e) {\n            refresh = null;\n            dispatch(reset());\n          }\n          return;\n        }\n\n        await refresh;\n        await apiRequest(requestConfig);\n        return;\n      } \n      errorCodes.includes(status) && useDefaultErrorHandler && onErrorFnc(store());\n\n      onError && (await dispatch(onError(err)));\n      Promise.reject(err);\n    }\n  };\n  return apiRequest;\n};\n\n\n//# sourceURL=webpack://api-req-redux/./src/index.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: checkJSON, parseJSON, getHeaders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkJSON\", function() { return checkJSON; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parseJSON\", function() { return parseJSON; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getHeaders\", function() { return getHeaders; });\nconst checkJSON = data => {\n  try {\n    JSON.parse(data);\n  } catch {\n    return false;\n  }\n\n  return true;\n};\n\nconst parseJSON = response => {\n  return response\n    .text()\n    .then(text => (checkJSON(text) ? JSON.parse(text) : text ? text : {}));\n};\n\nconst getHeaders = (headers, additionalHeaders) => {\n  const newHeaders = new Headers(headers);\n  if (additionalHeaders) {\n    additionalHeaders.forEach(([name, value]) => {\n      newHeaders.set(name, value);\n    });\n  }\n  return newHeaders;\n};\n\n\n\n//////////////////////////\n// refreshToken example\n/*\n\nimport { createAction } from 'redux-actions';\nimport { apiRequest } from 'core/apiRequest';\n\nexport const reset = createAction('RESET', state => state);\nexport const setCachedData = createAction('SET_CACHED_DATA', state => state);\n\nexport const refreshToken = refreshToken =>\n    new Promise(resolve =>\n        apiRequest({\n          url: '/api/refresh',\n          method: 'POST',\n          body: {\n            refreshToken\n          },\n          redux: true,\n          onSuccess: ({ authToken }) => {\n            resolve();\n            return setCachedData({ authToken });\n          }\n        })\n    );\n\n */\n\n\n//# sourceURL=webpack://api-req-redux/./src/utils.js?");

/***/ })

/******/ });
});