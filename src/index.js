import Vue from "vue";
import JsonForm from "./JsonForm.vue";
import PackageFile from "../package.json";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/styles/common.less";
import Element from "element-ui";
import EnvInput from "easyapi-env-input";

import x2js from "x2js";
Vue.prototype.$x2js = new x2js();

Vue.use(Element);
Vue.use(EnvInput);

const VERSION = PackageFile.version;

const install = (Vue) => {
  if (install.installed) {
    return;
  }
  Vue.component("easyapi-data-form", JsonForm);
};

export default install;

export const components = {
  JsonForm,
  VERSION,
};
