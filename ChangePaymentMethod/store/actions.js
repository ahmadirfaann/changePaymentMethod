import { awaitWrapper } from '@src/util/promiseUtil'
import { CONFIG , GreatIdService, httpService} from 'hks-common'
import APIProxyService from 'hks-common/services/APIProxyService'
import sessionStorageService from 'hks-common/services/sessionStorageService'


import get_customer_info from "@src/json/changepaymentmethod/CUSTOMER_INFO.db.json";
import get_policy_eligible from "@src/json/changepaymentmethod/GET_POLICY_ELIGIBLE.db.json";

const actions = {
  clearAllState({ commit }) {
    commit('clearEligiblePolicies');
    commit('clearNonEligiblePolicies');
    commit('clearSelectedPolicy');
    commit('clearSelectedMethodData');
    commit('clearUpdateMorePolicies');
    commit('clearSelectedMorePolicy');
    commit('clearCPFWithdrawal');
    commit('clearPayExcess');
    commit('clearSelectedCreditCard');
    commit('clearTempSelection');
    commit('clearTempOption');
    commit('clearSubmitMorePolicies');
    commit('clearAgentInfo');
    commit('clearCpMethodSubmitStatus');
    commit('clearMoreEligible');
    // commit('clearCustomerStatusInfo');
  },
  // getCustomerStatusInfoFromServer({ commit, rootState }) {
  //   if (rootState.isMockPayment) {
  //     return new Promise(async (resolve, reject) => {
  //       const customerStatusInfo = _.get(get_customer_info, 'data', [])
  //       commit('updateCustomerStatusInfo', customerStatusInfo)
  //       resolve()
  //     })
  //   }

  //   return new Promise(async (resolve, reject) => {
  //     const {
  //       data: response,
  //       error
  //     } = await awaitWrapper(
  //       APIProxyService.msProxy({
  //         url: CONFIG.API_PATHS.GET_CUSTOMER_DETAIL.PATH,
  //         headers: {
  //           cifNumber: rootState.userCredentials.cifNumber,
  //           ProviderOrgCode: CONFIG.API_PATHS.GET_CUSTOMER_DETAIL.PROVIDERORGCD,
  //           sessionToken: rootState.sessionToken,
  //         },
  //       })
  //     )
  //     if (!error && response.data.status === 'success') {
  //       const customerStatusInfo = _.get(response, 'data.data', {})
  //       commit('updateCustomerStatusInfo', customerStatusInfo)
  //       resolve()
  //     } else {
  //       reject(error ? error : response)
  //     }
  //   })
  // },
  getChangePaymentMethodPoliciesFromServer({ commit, rootState }) {
    if (rootState.isMockPayment) {
      // todo: to change after get latest API specifications
      return new Promise(async (resolve, reject) => {
        const data = _.get(get_policy_eligible, 'data', [])
        const eligiblePolicies = data.filter(policy => policy.isEligible === 'Y')
        const nonEligiblePolicies = data.filter(policy => policy.isEligible === 'N')
        commit('updateEligiblePolicies', _.orderBy(eligiblePolicies, ['policyMainPlanName', 'policyNo'], ['asc', 'asc']))
        commit('updateNonEligiblePolicies', _.orderBy(nonEligiblePolicies, ['policyMainPlanName', 'policyNo'], ['asc', 'asc']))
        resolve()
      })
    }

    return new Promise(async (resolve, reject) => {
      const { data: response, error } = await awaitWrapper(
        APIProxyService.msProxy({
          url: CONFIG.API_PATHS.GET_POLICY_ELIGIBLE.PATH,
          headers: {
            cifNumber: rootState.userCredentials.cifNumber,
            ProviderOrgCode: CONFIG.API_PATHS.GET_POLICY_ELIGIBLE.PROVIDERORGCD,
            sessionToken: rootState.sessionToken,
            authorization: rootState.userCredentials.cifNumber
          },
          params: {
            type: 'CHGPAYMENTMTD'
          },
        })
      )
      if (!error && response.data.status === 'success') {
        const data = _.get(response, 'data.data', [])
        const eligiblePolicies = data.filter(policy => policy.isEligible === 'Y')
        const nonEligiblePolicies = data.filter(policy => policy.isEligible === 'N')
        commit('updateEligiblePolicies', _.orderBy(eligiblePolicies, ['policyMainPlanName', 'policyNo'], ['asc', 'asc']))
        commit('updateNonEligiblePolicies', _.orderBy(nonEligiblePolicies, ['policyMainPlanName', 'policyNo'], ['asc', 'asc']))
        resolve()
      } else {
        reject(error ? error : response)
      }
    })
  },
  updateNonEligiblePolicyByAction({ commit, rootState }, payload) {
    console.warn('payload', payload);
    commit('updateNonEligibleSelectMore', payload);
  },
  requestOtp({}, payload) {
    return new Promise(async (resolve, reject) => {
        if (!CONFIG.API.GREAT_ID.SIMULATOR && payload) {
            GreatIdService.requestOTP().then(() => {
                resolve()
            }).catch((error) => {
                reject(error ? error : response)
            })
        } else {
            resolve()
        }
    })
  },
  getSessionToken({ commit, rootState }) {
    const isVsit = CONFIG.ENV === 'VSIT';
    return new Promise(async (resolve, reject) => {
        const { data: response, error } = await awaitWrapper(
            APIProxyService.msProxy({
                url: CONFIG.API_PATHS.GET_SESSION_TOKEN.PATH,
                method: "PUT",
                headers: {
                    cifNumber: rootState.userCredentials.cifNumber,
                    ProviderOrgCode: CONFIG.API_PATHS.GET_SESSION_TOKEN.PROVIDERORGCD,
                    sessionToken: rootState.sessionToken,
                },
                data: {
                    "jwtToken": isVsit ? rootState.userCredentials.cifNumber : 'Bearer ' + sessionStorageService.get("idToken")
                },
            })
        )

        if (!error && response.data.status === 'success') {
            sessionStorageService.set("isOtpToken", "Y");
            resolve(response.data.data)
        } else {
            reject(error ? error : response)
        }
    })
  },
  getAgentInfoFromServer ({ commit, rootState }) {
    if (rootState.isMockPayment) {   
        // for developer mock testing only
        return new Promise(async (resolve, reject) => {
            const agentInfo = _.get(get_agent_info, 'data', [])
            commit('updateAgentInfo', agentInfo)
            resolve()
        })
    }

    return new Promise(async (resolve, reject) => {
        const { data: response, error } = await awaitWrapper(
            APIProxyService.msProxy({
                url: CONFIG.API_PATHS.GET_AGENT.PATH,
                headers: {
                    cifNumber: rootState.userCredentials.cifNumber,
                    ProviderOrgCode: CONFIG.API_PATHS.GET_AGENT.PROVIDERORGCD,
                    sessionToken: rootState.sessionToken,
                },
                params: {
                    type: 'last_servicing'
                },
            })
        )
        if (!error && response.data.status === 'success') {
            const agentInfo = _.get(response, 'data.data', {})
            commit('updateAgentInfo', agentInfo)
            resolve()
        } else {
            reject(error ? error : response)
        }
    })
  },
  submission({ commit, state, rootState }) {
    if (rootState.isMockPayment) {
        return new Promise(async (resolve, reject) => {
            const cpFrequencySubmitStatus = _.get(get_submission_success_status, 'data', {})
            commit('updateCpFrequencySubmitStatus', cpFrequencySubmitStatus)
            resolve()
        })
    }
    let model = [], tempCurrentMtd = []
    if (state.submitMorePolicies && state.submitMorePolicies.length > 1) {
      state.submitMorePolicies.forEach(el => {
        let tempCurPaymentMtd = []
        el.existingPaymentMethod.forEach(ep => {
          let tempMtd = {
            creditCardNo: ep.creditCardNo ? ep.creditCardNo : '',
            creditCardType: ep.creditCardType ? ep.creditCardType : '',
            expiredDate: ep.expiredDate ? ep.expiredDate : '',
            nameCardHolder: ep.nameCardHolder ? ep.nameCardHolder : '',
            pymtMtdCode: ep.pymtMtdCode,
            pymtMtdDscp: ep.pymtMtdDscp
          }
          tempCurPaymentMtd.push(tempMtd);
        })
          let temp = {
            source: el.sourceSystemDesc ? el.sourceSystemDesc : '',
            policyNo: el.policyNo,
            planCd: el.policyMainPlanCd,     
            existingPaymentMethod: tempCurPaymentMtd,
            newPaymentMethod: [{
              creditCardNo: state.selectedMethodData.cardNumber ? state.selectedMethodData.cardNumber.split(' ').join('') : '',
              creditCardType: state.selectedMethodData.cardType ? state.selectedMethodData.cardType : '',
              expiredDate: state.selectedMethodData.expiryDate ? state.selectedMethodData.expiryDate.split(' ').join('') : '',
              nameCardHolder: state.selectedMethodData.cardHolderName ? state.selectedMethodData.cardHolderName : '', 
              pymtMtdCode: state.selectedMethodData.paymentMethod === 'Cash or cheque' ? '1' : state.selectedMethodData.paymentMethod === 'Personal CPF' ? '11' : 
              (state.selectedMethodData.paymentMethod === 'OCBC Credit Card' || state.selectedMethodData.paymentMethod === 'Credit Card' || state.selectedMethodData.paymentMethod === 'OCBC GE Cashflo Card') ? '30' : '3',
              pymtMtdDscp: state.selectedMethodData.paymentMethod ? state.selectedMethodData.paymentMethod : ''
            }],
            identificationId: state.selectedPolicy.idNumber,
            // identificationName: state.customerStatusInfo.fullName,
          }
          model.push(temp);
      })
    }else {
      state.selectedPolicy.currentPaymentMethods.forEach(el => {
        let tempMtd = {
          creditCardNo: _.includes(el.paymentMethodDesc, 'CREDIT') ? el.accountNo : '',
          creditCardType: el.accountType ? el.accountType : '',
          expiredDate: '',
          nameCardHolder: _.includes(el.paymentMethodDesc, 'CREDIT') ? el.accountName : '',
          pymtMtdCode: el.paymentMethodCd,
          pymtMtdDscp: el.paymentMethodDesc
        }
        tempCurrentMtd.push(tempMtd)
      })
      let temp = {
        source: state.selectedPolicy.sourceSystemDesc,
        policyNo: state.selectedPolicy.policyNo,
        planCd: state.selectedPolicy.policyMainPlanCd,     
        existingPaymentMethod: tempCurrentMtd,
        newPaymentMethod: [{
          creditCardNo: state.selectedMethodData.cardNumber ? state.selectedMethodData.cardNumber.split(' ').join('') : '',
          creditCardType: state.selectedMethodData.cardType ? state.selectedMethodData.cardType : '',
          expiredDate: state.selectedMethodData.expiryDate ? state.selectedMethodData.expiryDate.split(' ').join('') : '',
          nameCardHolder: state.selectedMethodData.cardHolderName ? state.selectedMethodData.cardHolderName : '', 
          pymtMtdCode: state.selectedMethodData.paymentMethod === 'Cash or cheque' ? '1' : state.selectedMethodData.paymentMethod === 'Personal CPF' ? '11' : 
          (state.selectedMethodData.paymentMethod === 'OCBC Credit Card' || state.selectedMethodData.paymentMethod === 'Credit Card' || state.selectedMethodData.paymentMethod === 'OCBC GE Cashflo Card') ? '30' : '3',
          pymtMtdDscp: state.selectedMethodData.paymentMethod ? state.selectedMethodData.paymentMethod : ''
        }],
        identificationId: state.selectedPolicy.idNumber,
        // identificationName: state.customerStatusInfo.fullName,
      }
      model.push(temp)
    }

    return new Promise(async (resolve, reject) => {
        const {
            data: response,
            error
        } = await awaitWrapper(
            APIProxyService.msProxy({
                url: CONFIG.API_PATHS.SUBMIT_PAYMENT_METHOD.PATH,
                method: 'PUT',
                headers: {
                    cifNumber: rootState.userCredentials.cifNumber,
                    ProviderOrgCode: CONFIG.API_PATHS.SUBMIT_PAYMENT_METHOD.PROVIDERORGCD,
                    sessionToken: rootState.sessionToken,
                },
                data: model,
            })
        )
        console.log("[cpMethod] submission model >>>>>>>>> " + JSON.stringify(model));
        if (!error && response.data.status === 'success') {
            const cpMethodSubmitStatus = _.get(response, 'data.data', {})
            commit('updateCpMethodSubmitStatus', cpMethodSubmitStatus)
            resolve()

        } else {
            reject(error ? error : response)
        }
    })
},
}

export default actions
