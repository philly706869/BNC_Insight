import req from "./require.js";
const appRootPath = req("app-root-path");

export const path = appRootPath.path;
export const require = appRootPath.require;
export const resolve = appRootPath.resolve;
export const setPath = appRootPath.setPath;
export const toString = appRootPath.toString;

export default appRootPath;
