import { Form } from 'antd';
import router from 'umi/router'
import { getAuthority } from '../../utils/authority'

const View = Form.create()(() => {
  if (getAuthority().indexOf('admin') > -1) {
    router.push('./organizations')
  }
  else {
    router.push('./account')
  }
  return ''
})
export default View