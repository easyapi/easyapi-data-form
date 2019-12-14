import Vue from 'vue'
import JsonForm from './JsonForm.vue'
import PackageFile from '../package.json'
import 'element-ui/lib/theme-chalk/index.css';
import {
  Checkbox,
  Select,
  Option,
  Input,
  Icon,
  Button,
  Table,
  TableColumn

} from "element-ui"

const VERSION = PackageFile.version

Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)

const install = (Vue) => {
  if (install.installed) return

  Vue.component('el-json-form', JsonForm)
}

export default install

export const components = {
  JsonForm,
  VERSION
}