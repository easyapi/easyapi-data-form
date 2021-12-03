import Vue from "vue";
import JsonForm from "./JsonForm.vue";
import PackageFile from "../package.json";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/styles/common.less";
import Element from "element-ui";

Vue.use(Element);
const VERSION = PackageFile.version;

const install = (Vue) => {
  if (install.installed) {
    return;
  }
  Vue.component("easyapi-json-form", JsonForm);
};

export default install;

export const components = {
  JsonForm,
  VERSION,
};
