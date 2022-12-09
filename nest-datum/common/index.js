"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = exports.findEnvPropertiesByTwoOccurrences = exports.AccessToken = void 0;
const access_token_decorator_1 = require("./dist/decorators/access-token.decorator");
Object.defineProperty(exports, "AccessToken", { enumerable: true, get: function () { return access_token_decorator_1.AccessToken; } });
const findEnvPropertiesByTwoOccurrences_1 = require("./dist/utils/findEnvPropertiesByTwoOccurrences");
exports.findEnvPropertiesByTwoOccurrences = findEnvPropertiesByTwoOccurrences_1.default;
const isObject_1 = require("./dist/utils/isObject");
exports.isObject = isObject_1.default;
//# sourceMappingURL=index.js.map