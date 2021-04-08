const mutations = {
  updateEligiblePolicies (state, payload) {
    state.eligiblePolicies = payload
  },
  clearEligiblePolicies (state) {
    state.eligiblePolicies = []
  },
  updateNonEligiblePolicies (state, payload) {
    state.nonEligiblePolicies = payload
  },
  clearNonEligiblePolicies (state) {
    state.nonEligiblePolicies = []
  },
  updateSelectedPolicy (state, payload) {
    state.selectedPolicy = payload
  },
  clearSelectedPolicy (state) {
    state.selectedPolicy = {}
  },
  updateSelectedMethodData (state, payload) {
    state.selectedMethodData = payload
  },
  clearSelectedMethodData (state) {
    state.selectedMethodData = {}
  },
  updateMorePolicies (state, payload) {
    state.isMorePolicies = payload
  },
  clearUpdateMorePolicies (state) {
    state.isMorePolicies = {}
  },
  updateSelectedMorePolicy (state, payload) {
    state.morePoliciesSelected = payload
  },
  clearSelectedMorePolicy (state) {
    state.morePoliciesSelected = {}
  },
  updateCPFWithdrawal (state, payload) {
    state.isCPFWithdrawalIsMore = payload
  },
  clearCPFWithdrawal (state) {
    state.isCPFWithdrawalIsMore = ''
  },
  updatePayExcess (state, payload) {
    state.isPayExcess = payload
  },
  clearPayExcess (state) {
    state.isPayExcess = ''
  },
  updateSelectedCreditCard (state, payload) {
    state.selectedCreditCard = payload
  },
  clearSelectedCreditCard (state) {
    state.selectedCreditCard = {}
  },
  updateTempSelection (state, payload) {
    state.tempSelectionMethod = payload
  },
  clearTempSelection (state) {
    state.tempSelectionMethod = {}
  },
  updateTempOption (state, payload) {
    state.tempSelectionOption = payload
  },
  clearTempOption (state) {
    state.tempSelectionOption = {}
  },
  updateSubmitMorePolicies (state, payload) {
    state.submitMorePolicies = payload
  },
  clearSubmitMorePolicies (state) {
    state.submitMorePolicies = []
  },
  updateAgentInfo (state, payload) {
    state.agentInfo = payload
  },
  clearAgentInfo (state) {
    state.agentInfo = {}
  },
  updateCpMethodSubmitStatus (state, payload) {
    state.cpMethodSubmitStatus = payload
  },
  clearCpMethodSubmitStatus (state) {
    state.cpMethodSubmitStatus = {}
  },
  updateMoreEligible (state, payload) {
    state.moreEligible = payload
  },
  clearMoreEligible (state) {
    state.moreEligible = {}
  },
  updateNonEligibleSelectMore (state, payload) {
    state.nonEligiblePolicies.push(payload)
  }
}

export default mutations
