/*!
 * @name         index.js
 * @description  hookJs JS AOP切面编程辅助库
 * @version      0.0.1
 * @author       Blaze
 * @date         2020/10/22 17:40
 * @github       https://github.com/xxxily
 */

const win = typeof window === 'undefined' ? global : window
const toStr = Function.prototype.call.bind(Object.prototype.toString)
/* In special scenarios, if Boolean is also hooked, it can easily lead to call overflow, 
so native Boolean needs to be used */
const toBoolean = Boolean.originMethod ? Boolean.originMethod : Boolean
const util = {
  toStr,
  isObj: obj => toStr(obj) === '[object Object]',
  /* Determine whether it is a reference type, used in wider scenarios */
  isRef: obj => typeof obj === 'object',
  isReg: obj => toStr(obj) === '[object RegExp]',
  isFn: obj => obj instanceof Function,
  isAsyncFn: fn => toStr(fn) === '[object AsyncFunction]',
  isPromise: obj => toStr(obj) === '[object Promise]',
  firstUpperCase: str => str.replace(/^\S/, s => s.toUpperCase()),
  toArr: arg => Array.from(Array.isArray(arg) ? arg : [arg]),

  debug: {
    log () {
      let log = win.console.log
      /* If the log is also hooked, use the log function before it is hooked */
      if (log.originMethod) { log = log.originMethod }
      if (win._debugMode_) {
        log.apply(win.console, arguments)
      }
    }
  },
  /* Get key names including self, inheritance, enumerable, and non-enumerable */
  getAllKeys (obj) {
    const tmpArr = []
    for (const key in obj) { tmpArr.push(key) }
    const allKeys = Array.from(new Set(tmpArr.concat(Reflect.ownKeys(obj))))
    return allKeys
  }
}

export class HookJs {
  constructor (useProxy) {
    this.useProxy = useProxy || false
    this.hookPropertiesKeyName = '_hookProperties' + Date.now()
  }

  hookJsPro () {
    return new HookJs(true)
  }

  _addHook (hookMethod, fn, type, classHook) {
    const hookKeyName = type + 'Hooks'
    const hookMethodProperties = hookMethod[this.hookPropertiesKeyName]
    if (!hookMethodProperties[hookKeyName]) {
      hookMethodProperties[hookKeyName] = []
    }

    /* Register (store) the hook function to be called while preventing repeated registration */
    let hasSameHook = false
    for (let i = 0; i < hookMethodProperties[hookKeyName].length; i++) {
      if (fn === hookMethodProperties[hookKeyName][i]) {
        hasSameHook = true
        break
      }
    }

    if (!hasSameHook) {
      fn.classHook = classHook || false
      hookMethodProperties[hookKeyName].push(fn)
    }
  }

  _runHooks (parentObj, methodName, originMethod, hookMethod, target, ctx, args, classHook, hookPropertiesKeyName) {
    const hookMethodProperties = hookMethod[hookPropertiesKeyName]
    const beforeHooks = hookMethodProperties.beforeHooks || []
    const afterHooks = hookMethodProperties.afterHooks || []
    const errorHooks = hookMethodProperties.errorHooks || []
    const hangUpHooks = hookMethodProperties.hangUpHooks || []
    const replaceHooks = hookMethodProperties.replaceHooks || []
    const execInfo = {
      result: null,
      error: null,
      args: args,
      type: ''
    }

    function runHooks (hooks, type) {
      let hookResult = null
      execInfo.type = type || ''
      if (Array.isArray(hooks)) {
        hooks.forEach(fn => {
          if (util.isFn(fn) && classHook === fn.classHook) {
            hookResult = fn(args, parentObj, methodName, originMethod, execInfo, ctx)
          }
        })
      }
      return hookResult
    }

    const runTarget = (function () {
      if (classHook) {
        return function () {
          // eslint-disable-next-line new-cap
          return new target(...args)
        }
      } else {
        return function () {
          return target.apply(ctx, args)
        }
      }
    })()

    const beforeHooksResult = runHooks(beforeHooks, 'before')
    /* Support instructions to terminate subsequent calls */
    if (beforeHooksResult && beforeHooksResult === 'STOP-INVOKE') {
      return beforeHooksResult
    }

    if (hangUpHooks.length || replaceHooks.length) {
      /**
        * When hangUpHooks or replaceHooks exist, the original function will not be triggered.
        * Essentially, hangUpHooks and replaceHooks are the same, except that the external definitions, 
        * descriptions and classifications are inconsistent.
        */
      runHooks(hangUpHooks, 'hangUp')
      runHooks(replaceHooks, 'replace')
    } else {
      if (errorHooks.length) {
        try {
          execInfo.result = runTarget()
        } catch (err) {
          execInfo.error = err
          const errorHooksResult = runHooks(errorHooks, 'error')
          /* Support instructions that do not throw exceptions after executing errors */
          if (errorHooksResult && errorHooksResult === 'SKIP-ERROR') {
            // console.error(`${methodName} error:`, err)
          } else {
            throw err
          }
        }
      } else {
        execInfo.result = runTarget()
      }
    }

    /**
    * Execute afterHooks. If Promise is returned, further subdivision processing should be carried out in theory.
    * However, after adding the subdivision processing logic, I found that the performance dropped significantly and various exceptions were prone to occur, so I decided not to handle the Promise situation in the hook.
    * The following is the original Promise processing logic. After adding it, the following websites will become stuck or inaccessible:
    * wenku.baidu.com
    * https://pubs.rsc.org/en/content/articlelanding/2021/sc/d1sc01881g#!divAbstract
    * https://www.elsevier.com/connect/coronavirus-information-center
    */
    // if (execInfo.result && execInfo.result.then && util.isPromise(execInfo.result)) {
    //   execInfo.result.then(function (data) {
    //     execInfo.result = data
    //     runHooks(afterHooks, 'after')
    //     return Promise.resolve.apply(ctx, arguments)
    //   }).catch(function (err) {
    //     execInfo.error = err
    //     runHooks(errorHooks, 'error')
    //     return Promise.reject.apply(ctx, arguments)
    //   })
    // }

    runHooks(afterHooks, 'after')

    return execInfo.result
  }

  _proxyMethodcGenerator (parentObj, methodName, originMethod, classHook, context, proxyHandler) {
    const t = this
    const useProxy = t.useProxy
    let hookMethod = null

    /* If cache exists, use cached hookMethod */
    if (t.isHook(originMethod)) {
      hookMethod = originMethod
    } else if (originMethod[t.hookPropertiesKeyName] && t.isHook(originMethod[t.hookPropertiesKeyName].hookMethod)) {
      hookMethod = originMethod[t.hookPropertiesKeyName].hookMethod
    }

    if (hookMethod) {
      if (!hookMethod[t.hookPropertiesKeyName].isHook) {
        /* Remark the hooked status */
        hookMethod[t.hookPropertiesKeyName].isHook = true
        util.debug.log(`[hook method] ${util.toStr(parentObj)} ${methodName}`)
      }
      return hookMethod
    }

    /* Using Proxy mode for hooking can get more features, but the performance will be slightly worse */
    if (useProxy && Proxy) {
      /* Note: When using Proxy proxy, hookMethod and originMethod will share the same object */
      const handler = { ...proxyHandler }

      /* The following writing method confirms that proxyHandler cannot override the construct and apply operations */
      if (classHook) {
        handler.construct = function (target, args, newTarget) {
          context = context || this
          return t._runHooks(parentObj, methodName, originMethod, hookMethod, target, context, args, true, t.hookPropertiesKeyName)
        }
      } else {
        handler.apply = function (target, ctx, args) {
          ctx = context || ctx
          return t._runHooks(parentObj, methodName, originMethod, hookMethod, target, ctx, args, false, t.hookPropertiesKeyName)
        }
      }

      hookMethod = new Proxy(originMethod, handler)
    } else {
      hookMethod = function () {
        /**
        * Note that context = context || this cannot be passed here
        * Then pass the context as ctx
        * This will cause ctx reference errors
        */
        const ctx = context || this
        return t._runHooks(parentObj, methodName, originMethod, hookMethod, originMethod, ctx, arguments, classHook, t.hookPropertiesKeyName)
      }

      /* Ensure that child objects and prototype chains are consistent with originMethod */
      const keys = Reflect.ownKeys(originMethod)
      keys.forEach(keyName => {
        try {
          Object.defineProperty(hookMethod, keyName, {
            get: function () {
              return originMethod[keyName]
            },
            set: function (val) {
              originMethod[keyName] = val
            }
          })
        } catch (err) {
          
          // An exception occurs when setting defineProperty, 
          // which may cause some functions of hookMethod to be missing, or it may not be affected.
          util.debug.log(`[proxyMethodcGenerator] hookMethod defineProperty abnormal.  hookMethod:${methodName}, definePropertyName:${keyName}`, err)
        }
      })
      hookMethod.prototype = originMethod.prototype
    }

    const hookMethodProperties = hookMethod[t.hookPropertiesKeyName] = {}

    hookMethodProperties.originMethod = originMethod
    hookMethodProperties.hookMethod = hookMethod
    hookMethodProperties.isHook = true
    hookMethodProperties.classHook = classHook

    util.debug.log(`[hook method] ${util.toStr(parentObj)} ${methodName}`)

    return hookMethod
  }

  _getObjKeysByRule (obj, rule) {
    let excludeRule = null
    let result = rule

    if (util.isObj(rule) && rule.include) {
      excludeRule = rule.exclude
      rule = rule.include
      result = rule
    }

    /**
    * For the difference between for in, Object.keys and Reflect.ownKeys, see:
    * https://es6.ruanyifeng.com/#docs/object#%E5%B1%9E%E6%80%A7%E7%9A%84%E9%81%8D%E5%8E%86
    */
    if (rule === '*') {
      result = Object.keys(obj)
    } else if (rule === '**') {
      result = Reflect.ownKeys(obj)
    } else if (rule === '***') {
      result = util.getAllKeys(obj)
    } else if (util.isReg(rule)) {
      result = util.getAllKeys(obj).filter(keyName => rule.test(keyName))
    }

    /* If there is an exclusion rule, it needs to be excluded */
    if (excludeRule) {
      result = Array.isArray(result) ? result : [result]
      if (util.isReg(excludeRule)) {
        result = result.filter(keyName => !excludeRule.test(keyName))
      } else if (Array.isArray(excludeRule)) {
        result = result.filter(keyName => !excludeRule.includes(keyName))
      } else {
        result = result.filter(keyName => excludeRule !== keyName)
      }
    }

    return util.toArr(result)
  }

  /**
    * Determine whether a function has been hooked
    * @param fn {Function} - required The function to be judged
    * @returns {boolean}
    */
  isHook (fn) {
    if (!fn || !fn[this.hookPropertiesKeyName]) {
      return false
    }
    const hookMethodProperties = fn[this.hookPropertiesKeyName]
    return util.isFn(hookMethodProperties.originMethod) && fn !== hookMethodProperties.originMethod
  }

  /**
    * Determine whether a value under the object meets the conditions for hooking
    * Note: Having hook conditions and being able to directly modify the value are two different things.
    * When hooking, also check whether descriptor.writable is false.
    * If it is false, it must be changed to true to make the hook successful.
    * @param parentObj
    * @param keyName
    * @returns {boolean}
    */
  isAllowHook (parentObj, keyName) {
    /* Some objects will set getters so that an error will be thrown when reading the value, 
        so try catch is needed to determine whether the attribute can be read normally */
    try { if (!parentObj[keyName]) return false } catch (e) { return false }
    const descriptor = Object.getOwnPropertyDescriptor(parentObj, keyName)
    return !(descriptor && descriptor.configurable === false)
  }

  /**
    * hook core function
    * @param parentObj {Object} - required The parent object that the hook function depends on
    * @param hookMethods {Object|Array|RegExp|string} - required The function name of the hooked function or the matching rule of the function name
    * @param fn {Function} -required callback method after hook
    * @param type {String} - optional default before, specifies the time to run the hook function callback, optional strings: before, after, replace, error, hangUp
    * @param classHook {Boolean} - optional, default false, specifies whether it is a hook for new (class) operation
    * @param context {Object} - optional specifies the context object when running the hooked function
    * @param proxyHandler {Object} - optional Only valid when using Proxy for hooking. By default, Proxy's apply handler is used for hooking. If you have special needs, you can also configure your own handler to achieve more complex functions.
    * Note: Not using Proxy for hooking can achieve higher performance, but it also means less versatility. Hooking non-instance functions in objects such as HTMLElement.prototype and EventTarget.prototype will often fail and lead to being hooked. Function execution error
    * @returns {boolean}
    */
  hook (parentObj, hookMethods, fn, type, classHook, context, proxyHandler) {
    /* 支持对象形式的传参 */
    const opts = arguments[0]
    if (util.isObj(opts) && opts.parentObj && opts.hookMethods) {
      parentObj = opts.parentObj
      hookMethods = opts.hookMethods
      fn = opts.fn
      type = opts.type
      classHook = opts.classHook
      context = opts.context
      proxyHandler = opts.proxyHandler
    }

    classHook = toBoolean(classHook)
    type = type || 'before'

    if ((!util.isRef(parentObj) && !util.isFn(parentObj)) || !util.isFn(fn) || !hookMethods) {
      return false
    }

    const t = this

    hookMethods = t._getObjKeysByRule(parentObj, hookMethods)
    hookMethods.forEach(methodName => {
      if (!t.isAllowHook(parentObj, methodName)) {
        util.debug.log(`${util.toStr(parentObj)} [${methodName}] does not support modification`)
        return false
      }

      const descriptor = Object.getOwnPropertyDescriptor(parentObj, methodName)
      if (descriptor && descriptor.writable === false) {
        Object.defineProperty(parentObj, methodName, { writable: true })
      }

      const originMethod = parentObj[methodName]
      let hookMethod = null

      /* Non-functions cannot be hooked */
      if (!util.isFn(originMethod)) {
        return false
      }

      hookMethod = t._proxyMethodcGenerator(parentObj, methodName, originMethod, classHook, context, proxyHandler)

      const hookMethodProperties = hookMethod[t.hookPropertiesKeyName]
      if (hookMethodProperties.classHook !== classHook) {
        util.debug.log(`${util.toStr(parentObj)} [${methodName}] Cannot support functions hook and classes hook at the same time `)
        return false
      }

      /* Use hookMethod to take over the method that needs to be hooked */
      if (parentObj[methodName] !== hookMethod) {
        parentObj[methodName] = hookMethod
      }

      t._addHook(hookMethod, fn, type, classHook)
    })
  }

  /* A hook specifically for the new operation is essentially an alias for the hook function. 
    You can pass less classHook parameter and have clear semantics */
  hookClass (parentObj, hookMethods, fn, type, context, proxyHandler) {
    return this.hook(parentObj, hookMethods, fn, type, true, context, proxyHandler)
  }

  /**
   * Cancel the hook of a certain function
   * @param parentObj {Object} - required to cancel the parent object that the hook function depends on
   * @param hookMethods {Object|Array|RegExp|string} - required to cancel the function name of the hooked function or the matching rule of the function name
   * @param type {String} - optional default before, specifies the hook type to be canceled, optional string: before, after, replace, error, hangUp, if this option is not specified, all callbacks under all types will be canceled
   * @param fn {Function} - required to cancel the specified hook callback function. If this option is not specified, all callbacks under the corresponding type will be canceled.
   * @returns {boolean}
   */
  unHook (parentObj, hookMethods, type, fn) {
    if (!util.isRef(parentObj) || !hookMethods) {
      return false
    }

    const t = this
    hookMethods = t._getObjKeysByRule(parentObj, hookMethods)
    hookMethods.forEach(methodName => {
      if (!t.isAllowHook(parentObj, methodName)) {
        return false
      }

      const hookMethod = parentObj[methodName]

      if (!t.isHook(hookMethod)) {
        return false
      }

      const hookMethodProperties = hookMethod[t.hookPropertiesKeyName]
      const originMethod = hookMethodProperties.originMethod

      if (type) {
        const hookKeyName = type + 'Hooks'
        const hooks = hookMethodProperties[hookKeyName] || []

        if (fn) {
          /* Delete the specified hook function under the specified type */
          for (let i = 0; i < hooks.length; i++) {
            if (fn === hooks[i]) {
              hookMethodProperties[hookKeyName].splice(i, 1)
              util.debug.log(`[unHook ${hookKeyName} func] ${util.toStr(parentObj)} ${methodName}`, fn)
              break
            }
          }
        } else {
          /* Delete all hook functions under the specified type */
          if (Array.isArray(hookMethodProperties[hookKeyName])) {
            hookMethodProperties[hookKeyName] = []
            util.debug.log(`[unHook all ${hookKeyName}] ${util.toStr(parentObj)} ${methodName}`)
          }
        }
      } else {
        /* Completely restore the hooked function */
        if (util.isFn(originMethod)) {
          parentObj[methodName] = originMethod
          delete parentObj[methodName][t.hookPropertiesKeyName]

          // Object.keys(hookMethod).forEach(keyName => {
          //   if (/Hooks$/.test(keyName) && Array.isArray(hookMethod[keyName])) {
          //     hookMethod[keyName] = []
          //   }
          // })
          //
          // hookMethod.isHook = false
          // parentObj[methodName] = originMethod
          // delete parentObj[methodName].originMethod
          // delete parentObj[methodName].hookMethod
          // delete parentObj[methodName].isHook
          // delete parentObj[methodName].isClassHook

          util.debug.log(`[unHook method] ${util.toStr(parentObj)} ${methodName}`)
        }
      }
    })
  }

  _hook (args, type) {
    const t = this
    return function (obj, hookMethods, fn, classHook, context, proxyHandler) {
      const opts = args[0]
      if (util.isObj(opts) && opts.parentObj && opts.hookMethods) {
        opts.type = type
      } else {
        // args[3] = type
      }
      return t.hook.apply(t, args)
    }
  }

  /* Hook before running the source function */
  before (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'before', classHook, context, proxyHandler)
  }

  /*Hook after the source function is run */
  after (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'after', classHook, context, proxyHandler)
  }

  /* Replace the function to be hooked, no longer run the source function, 
    and replace it with running other logic */
  replace (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'replace', classHook, context, proxyHandler)
  }

  /* Hook when the source function runs incorrectly */
  error (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'error', classHook, context, proxyHandler)
  }

  /* The underlying implementation logic is the same as replace. 
    It replaces the function to be hooked and no longer runs the source function. 
    This is just to clarify the semantics. 
    The source function is suspended and no longer executed. 
    In principle, other logic is no longer executed. 
    If To perform other logic please use replace hook */
  hangUp (obj, hookMethods, fn, classHook, context, proxyHandler) {
    return this.hook(obj, hookMethods, fn, 'hangUp', classHook, context, proxyHandler)
  }
}

export default new HookJs()