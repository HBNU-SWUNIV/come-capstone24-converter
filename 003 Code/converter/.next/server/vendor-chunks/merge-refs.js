"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/merge-refs";
exports.ids = ["vendor-chunks/merge-refs"];
exports.modules = {

/***/ "(ssr)/./node_modules/merge-refs/dist/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/merge-refs/dist/esm/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ mergeRefs)\n/* harmony export */ });\n/**\n * A function that merges React refs into one.\n * Supports both functions and ref objects created using createRef() and useRef().\n *\n * Usage:\n * ```tsx\n * <div ref={mergeRefs(ref1, ref2, ref3)} />\n * ```\n *\n * @param {(React.Ref<T> | undefined)[]} inputRefs Array of refs\n * @returns {React.Ref<T> | React.RefCallback<T>} Merged refs\n */\nfunction mergeRefs() {\n    var inputRefs = [];\n    for (var _i = 0; _i < arguments.length; _i++) {\n        inputRefs[_i] = arguments[_i];\n    }\n    var filteredInputRefs = inputRefs.filter(Boolean);\n    if (filteredInputRefs.length <= 1) {\n        var firstRef = filteredInputRefs[0];\n        return firstRef || null;\n    }\n    return function mergedRefs(ref) {\n        filteredInputRefs.forEach(function (inputRef) {\n            if (typeof inputRef === 'function') {\n                inputRef(ref);\n            }\n            else if (inputRef) {\n                inputRef.current = ref;\n            }\n        });\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWVyZ2UtcmVmcy9kaXN0L2VzbS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSw2QkFBNkI7QUFDMUM7QUFDQTtBQUNBLFdBQVcsOEJBQThCO0FBQ3pDLGFBQWEscUNBQXFDO0FBQ2xEO0FBQ2U7QUFDZjtBQUNBLHFCQUFxQix1QkFBdUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9scm4vLi9ub2RlX21vZHVsZXMvbWVyZ2UtcmVmcy9kaXN0L2VzbS9pbmRleC5qcz9mMGRlIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IG1lcmdlcyBSZWFjdCByZWZzIGludG8gb25lLlxuICogU3VwcG9ydHMgYm90aCBmdW5jdGlvbnMgYW5kIHJlZiBvYmplY3RzIGNyZWF0ZWQgdXNpbmcgY3JlYXRlUmVmKCkgYW5kIHVzZVJlZigpLlxuICpcbiAqIFVzYWdlOlxuICogYGBgdHN4XG4gKiA8ZGl2IHJlZj17bWVyZ2VSZWZzKHJlZjEsIHJlZjIsIHJlZjMpfSAvPlxuICogYGBgXG4gKlxuICogQHBhcmFtIHsoUmVhY3QuUmVmPFQ+IHwgdW5kZWZpbmVkKVtdfSBpbnB1dFJlZnMgQXJyYXkgb2YgcmVmc1xuICogQHJldHVybnMge1JlYWN0LlJlZjxUPiB8IFJlYWN0LlJlZkNhbGxiYWNrPFQ+fSBNZXJnZWQgcmVmc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZVJlZnMoKSB7XG4gICAgdmFyIGlucHV0UmVmcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGlucHV0UmVmc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICB2YXIgZmlsdGVyZWRJbnB1dFJlZnMgPSBpbnB1dFJlZnMuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmIChmaWx0ZXJlZElucHV0UmVmcy5sZW5ndGggPD0gMSkge1xuICAgICAgICB2YXIgZmlyc3RSZWYgPSBmaWx0ZXJlZElucHV0UmVmc1swXTtcbiAgICAgICAgcmV0dXJuIGZpcnN0UmVmIHx8IG51bGw7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBtZXJnZWRSZWZzKHJlZikge1xuICAgICAgICBmaWx0ZXJlZElucHV0UmVmcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dFJlZikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dFJlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlucHV0UmVmKHJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbnB1dFJlZikge1xuICAgICAgICAgICAgICAgIGlucHV0UmVmLmN1cnJlbnQgPSByZWY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/merge-refs/dist/esm/index.js\n");

/***/ })

};
;