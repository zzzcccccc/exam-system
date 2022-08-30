// 封装操作localstorage本地存储的方法  模块化

var storage = {
  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get (key) {
    return JSON.parse(localStorage.getItem(key))
  },
  getForIndex (index) {
    return localStorage.key(index)
  },
  getKeys () {
    const items = this.getAll()
    const keys = []
    for (let index = 0; index < items.length; index++) {
      keys.push(items[index].key)
    }
    return keys
  },
  getLength () {
    return localStorage.length
  },
  getSupport () {
    return (typeof (Storage) !== 'undefined')
  },
  remove (key) {
    localStorage.removeItem(key)
  },
  removeAll () {
    localStorage.clear()
  },
  getAll () {
    const len = localStorage.length // 获取长度
    // eslint-disable-next-line no-array-constructor
    const arr = new Array() // 定义数据集
    for (var i = 0; i < len; i++) {
      // 获取key 索引从0开始
      var getKey = localStorage.key(i)
      // 获取key对应的值
      var getVal = localStorage.getItem(getKey)
      // 放进数组
      arr[i] = {
        key: getKey,
        val: getVal
      }
    }
    return arr
  }
}

export default storage
