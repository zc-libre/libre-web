import Vue from 'vue'
import { getDictMap } from '@/api/system/dictInfo'

export default class Dict {
  constructor(dict) {
    this.dict = dict
  }

  async init(names, completeCallback) {
    if (names === undefined || name === null) {
      throw new Error('need Dict names')
    }
    const ps = []
    getDictMap(names).then((dictMap) => {
      for (const key in dictMap) {
        const values = dictMap[key]
        Vue.set(this.dict.dict, key, {})
        Vue.set(this.dict.label, key, {})
        Vue.set(this.dict, key, [])
        this.dict[key].splice(0, 0, ...values)
        values.forEach((value) => {
          Vue.set(this.dict.dict[key], value.value, value)
          Vue.set(this.dict.label[key], value.value, value.label)
        })
        ps.push(values)
      }
    })
    await Promise.all(ps)
    completeCallback()
  }
}
