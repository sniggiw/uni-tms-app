import {
  getDictTypes
} from "@/api/common";

// 批量获取数据字典中的值 参数  , 分割
const getDictTypesData = (params, callback) => {
  getDictTypes(params).then((res) => {
    if (res.code === 200) {
      if (callback) callback(res.data)
    }
  })
}

function getStore(name) {
  if (!name) return
  if (window.localStorage.getItem(name)) {
    return JSON.parse(window.localStorage.getItem(name))
  } else {
    return ''
  }
}

function removeStore(name) {
  if (!name) return
  window.localStorage.removeItem(name)
}

export {
  getDictTypesData,
  getStore,
  removeStore
};