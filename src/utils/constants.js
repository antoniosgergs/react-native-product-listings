import Config from "react-native-config";

const ENV =  Config.ENV;
const API_URL =  Config.API_URL;

const APP_PREFIX = 'antonios_product_listing://';
const APP_PREFIXES = [APP_PREFIX];

export {APP_PREFIX, APP_PREFIXES, API_URL, ENV};
