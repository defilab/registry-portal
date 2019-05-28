export default function handleError(error) {

  return error.response.json().then((data) => {
    switch (data.error) {
      case "DuplicateEntry":
        return '名称或标识已存在';

      case "RegistryException":
        return '注册异常';

      case 'InvalidScope':
        return '范围无效';

      case 'AuthorizeError':
        return '权限错误';

      case 'NotAuthorized':
        return '没有权限';

      case 'MissingSignParameters':
        return '缺少登陆参数';

      case 'NotFoundCert':
        return '没找到证书';

      case 'TimestampExpired':
        return '时间戳已过期';

      case 'BasicAuthFailed':
        return '身份验证失败';

      case 'InvalidSignature':
        return '签名无效';

      case 'InvalidAuthorizationMethod':
        return '无效的授权方法';

      case 'InvalidAuthorizationHeader':
        return '无效的授权标头';

      case 'MissingAuthorizationHeader':
        return '缺少授权标头';

      case 'UnsupportedHttpMethod':
        return '不支持的Http方法';

      case 'BadRequest':
        return '错误请求';

      case 'ShouldNotUpdateReadOnlyColumn':
        return '不应该更新只读列';

      case 'AlreadyHaveActiveCert':
        return '证书已存在';

      case 'InvalidEmailAddress':
        return '无效的邮件地址';

      case 'PasswordNotMatch':
        return '密码不匹配';

      case 'AccountLocked':
        return '帐户被锁定';

      case 'UserAlreadyHaveOrganization':
        return '用户已经有企业';

      case 'AlreadyHaveRequestInProcess':
        return '已经有请求正在处理中';

      case 'NowAllowUpdateReviewingRequest':
        return '现在允许更新审核请求';

      case 'NotFound':
        return '未找到';

      case 'RequestHasBeenAccepted':
        return '请求已被接受';

      case 'AlreadyExists':
        return '已经存在';

      case 'DuplicateEntry':
        return '双重输入';

      case 'LegerAccountAlreadyExists':
        return 'Ledger帐户已存在';

      case 'ExecuteCommandError':
        return '执行命令错误';

      case "invalid_grant":
        return '用户名或密码不存在';

      case 'not found':
        return '未找到';

      default:
        throw new Error('不存在')
    }
  }).catch(() => {
    throw new Error('解析错误')
  })
}
