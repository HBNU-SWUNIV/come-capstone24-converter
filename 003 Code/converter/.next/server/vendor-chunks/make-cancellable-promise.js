"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/make-cancellable-promise";
exports.ids = ["vendor-chunks/make-cancellable-promise"];
exports.modules = {

/***/ "(ssr)/./node_modules/make-cancellable-promise/dist/esm/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/make-cancellable-promise/dist/esm/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ makeCancellablePromise)\n/* harmony export */ });\nfunction makeCancellablePromise(promise) {\n    var isCancelled = false;\n    var wrappedPromise = new Promise(function (resolve, reject) {\n        promise\n            .then(function (value) { return !isCancelled && resolve(value); })\n            .catch(function (error) { return !isCancelled && reject(error); });\n    });\n    return {\n        promise: wrappedPromise,\n        cancel: function () {\n            isCancelled = true;\n        },\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWFrZS1jYW5jZWxsYWJsZS1wcm9taXNlL2Rpc3QvZXNtL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx3Q0FBd0M7QUFDN0Usc0NBQXNDLHVDQUF1QztBQUM3RSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2xybi8uL25vZGVfbW9kdWxlcy9tYWtlLWNhbmNlbGxhYmxlLXByb21pc2UvZGlzdC9lc20vaW5kZXguanM/MmYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYWtlQ2FuY2VsbGFibGVQcm9taXNlKHByb21pc2UpIHtcbiAgICB2YXIgaXNDYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB2YXIgd3JhcHBlZFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHByb21pc2VcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gIWlzQ2FuY2VsbGVkICYmIHJlc29sdmUodmFsdWUpOyB9KVxuICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikgeyByZXR1cm4gIWlzQ2FuY2VsbGVkICYmIHJlamVjdChlcnJvcik7IH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2U6IHdyYXBwZWRQcm9taXNlLFxuICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlzQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/make-cancellable-promise/dist/esm/index.js\n");

/***/ })

};
;