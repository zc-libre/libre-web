import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@/settings'
const {
  title,
  tagsView,
  fixedHeader,
  sidebarLogo,
  uniqueOpened,
  showFooter,
  footerTxt,
  caseNumber,
} = defaultSettings

const state = {
  title: title,
  theme: variables.theme,
  showSettings: false,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  uniqueOpened: uniqueOpened,
  showFooter: showFooter,
  footerTxt: footerTxt,
  caseNumber: caseNumber,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
