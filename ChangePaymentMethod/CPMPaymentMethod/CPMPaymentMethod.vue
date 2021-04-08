<template src="./CPMPaymentMethod.html"></template>
<style lang="scss" scoped src="./CPMPaymentMethod.scss"></style>

<script>
import LeoRadioCustom from "utilities/components/LeoCustom/LeoRadioCustom2";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "CPMPaymentMethod",
  components: {
    "leo-radio-custom": LeoRadioCustom,
  },
  data() {
    return {
      //   isDialogOpen: false,
      // ccOptions: [
      //   { type: "ocbcCc", desc: "OCBC Credit Card" },
      //   { type: "ocbcGeCc", desc: "OCBC GE Cashflo Card" },
      //   { type: "none", desc: "Visa or Mastercard" },
      // ],
      selectedPaymentMethod: undefined,
      paymentAmount: '',
      currentMethod: {
        name: "GIRO",
        no: "1234567812341234",
      },
      currentPaymentMethods: undefined,
      choosePayment:false,
      chooseOtherPayment:false,
      detailsCPF: '',
      isValidToProceed: false,
      isGiro: false,
      payExcess: false,
      eligiblePolicy: undefined,
      ccNo: '',
      isVisa: false,
      isMaster: false
    };
  },
  computed: {
      ...mapState('cpmStore', ['selectedPolicy', 'eligiblePolicies', 'selectedMethodData', 'isPayExcess', 'isCPFWithdrawalIsMore', 'tempSelectionMethod']),
    ccType() {
      return "none";
    },
    paymentMethodItems() {
      let selectedPayment = this.newPaymentItem();
      let mainStr = this.selectedPolicy.idNumber,
          vis = mainStr.slice(-4),
          countNum = '';

      for(var i = (mainStr.length)-4; i>0; i--){
          countNum += '*';
      }

      let idNumber = countNum+vis
      console.warn('idNumber', idNumber);
      let item = [];
      _.forEach(selectedPayment, el => {
        const desc = {
          label: el.label,
          value: el.value,
          secondary: el.value === 'creditCard' || el.value === 'ocbcCreditCard' || el.value === 'geCashflo' ? 'Ensure that you are using your own credit card for the recurring payment.' : el.value === 'cashOrCheque' ? 'You can make your payment through the AXS machine, internet banking or at our Great Eastern Centre counter.' :  el.value === 'cpf' ? 'CPF account no. ' +  idNumber : '',
          badge: el.value === 'creditCard' || el.value === 'ocbcCreditCard' || el.value === 'geCashflo' ? "Fastest" : '',
          secondaryDisplay: el.value === 'cpf' ? true : false
        };
        item.push(desc);
      });
      console.log(`this.selectedPaymentMethod : ${this.selectedPaymentMethod}`);
      console.log(`this.selectedPolicy : ${JSON.stringify(this.selectedPolicy)}`);

      if (this.selectedPaymentMethod) {
        _.forEach(item, el => {
          if (el.value === this.selectedPaymentMethod) {
            el.secondaryDisplay = true;
          }
        });
        return item;
      } else {
        return item;
      }
    },
    disabled() {
      if (this.selectedPaymentMethod) {
        return false;
      }
      return true;
    },
  },
  watch: {
    selectedPaymentMethod() {},
  },
  created() {
    // premium amount for this policy
    this.paymentAmount = this.selectedPolicy.policyNextDueAmount;
    this.remainingPremium = this.selectedPolicy.policyNextDueAmount - this.selectedPolicy.CPFWithdrawalLimit;
    this.isCPF = this.selectedPolicy.currentPaymentMethods.find(el =>{
      if (_.includes(el.paymentMethodDesc, 'CPF')) {
        return true;
      }else return false
    });
    this.isNoDetail = this.selectedPolicy.currentPaymentMethods.filter(el => el.accountNo === '').length > 1 ? true: false

    this.detailsCPF = this.selectedPolicy.currentPaymentMethods.filter(el => _.includes(el.paymentMethodDesc, 'CPF'));
    console.warn('this.detailsCPF', this.detailsCPF);
		this.eligiblePolicy = _.cloneDeep(_.filter(this.eligiblePolicies.filter(el =>  el.isElderShield === 'N'), el => el.policyMainPlanName !== this.selectedPolicy.policyMainPlanName));
    this.updateMoreEligible(this.eligiblePolicy)

    this.selectedPolicy.currentPaymentMethods.forEach(cc => {
      if ((_.includes(cc.paymentMethodDesc, 'Credit') || _.includes(cc.paymentMethodDesc, 'CREDIT')) && cc.accountNo) {
        let j = cc.accountNo.match(/.{1,4}/g)
        this.ccNo = j.join(' ')
      }
    });
    console.warn('ccNO', this.ccNo);
  },
  mounted() {
   
    let fromPaymentOptions = this.$route.params ? this.$route.params : undefined;
    console.log(`from payment options : ${JSON.stringify(fromPaymentOptions)}`)
    this.choosePayment = fromPaymentOptions?.choosePayment
    this.chooseOtherPayment = fromPaymentOptions?.chooseOtherPayment

    if (this.tempSelectionMethod && !_.isEmpty(this.tempSelectionMethod)) {
      this.selectedPaymentMethod = this.tempSelectionMethod.paymentMethod
      this.isValidToProceed = this.selectedPaymentMethod ? true : false;
    }

    this.selectedPolicy.currentPaymentMethods.forEach(el => {
        if ((_.includes(el.paymentMethodDesc, 'CREDIT') || _.includes(el.paymentMethodDesc, 'Credit')) && el.accountType && el.accountType == 'VISA') {
            this.isVisa = true;
            this.isMaster = false
        }else if ((_.includes(el.paymentMethodDesc, 'CREDIT') || _.includes(el.paymentMethodDesc, 'Credit')) && el.accountType && el.accountType == 'MASTER') {
            this.isMaster = true;
            this.isVisa = false
        }else {
            this.isVisa = false
            this.isMaster = false
        }
    });
  },
  methods: {
    ...mapMutations('cpmStore', ['updateSelectedMethodData', 'updatePayExcess', 'updateSelectedCreditCard', 'updateTempSelection', 'updateMoreEligible']),
    onClickNext() {
      const self = this;
      if (_.isEmpty(self.selectedMethodData) && self.selectedPaymentMethod === "creditCard" || self.selectedPaymentMethod === "ocbcCreditCard" || self.selectedPaymentMethod === "geCashflo") {
        let selectedCreditCard = {
          paymentMethod: this.selectedPaymentMethod === 'creditCard' ? 'Credit Card' : this.selectedPaymentMethod === 'ocbcCreditCard' ? 'OCBC Credit Card' : this.selectedPaymentMethod === 'geCashflo' ? 'OCBC GE Cashflo Card' : '',
          amount: this.choosePayment ? this.remainingPremium : this.chooseOtherPayment ? this.selectedPolicy.policyNextDueAmount : this.selectedPolicy.policyNextDueAmount,
          payRemaining: this.choosePayment,
          payFull: this.chooseOtherPayment
        }
        self.updateSelectedCreditCard(selectedCreditCard)
        this.$router.push({ name: 'cpm-cc-detail'});
      } 
      else if (!_.isEmpty(this.selectedMethodData) && self.selectedPaymentMethod === "creditCard" || self.selectedPaymentMethod === "ocbcCreditCard" || self.selectedPaymentMethod === "geCashflo") {

        let selectedCreditCard = {
          paymentMethod: this.selectedPaymentMethod === 'creditCard' ? 'Credit Card' : this.selectedPaymentMethod === 'ocbcCreditCard' ? 'OCBC Credit Card' : this.selectedPaymentMethod === 'geCashflo' ? 'OCBC GE Cashflo Card' : '',
          amount: this.choosePayment ? this.remainingPremium : this.chooseOtherPayment ? this.selectedPolicy.policyNextDueAmount : this.selectedPolicy.policyNextDueAmount,
          payRemaining: this.selectedMethodData.payRemaining,
          payFull: this.selectedMethodData.payFull
        }
        self.updateSelectedCreditCard(selectedCreditCard)
        this.$router.push({ name: 'cpm-cc-detail'});
      } 
      // else if (self.selectedPaymentMethod === "giro"){
      //   const self = this;
      //   self.$router.push({
      //     path: "/payment/change-payment-method/cpm-setting-giro",
      //   });
      // }
      else { 
        if (_.isEmpty(this.selectedMethodData)){
        let selectedPaymentMethod = {
          paymentMethod: this.selectedPaymentMethod === 'cashOrCheque' ? 'Cash or cheque' : this.selectedPaymentMethod === 'giro' ? 'GIRO' : 'Personal CPF',
          amount: this.choosePayment ? this.remainingPremium : this.chooseOtherPayment ? this.selectedPolicy.policyNextDueAmount : this.selectedPolicy.policyNextDueAmount,
          payRemaining: this.choosePayment,
          payFull: this.chooseOtherPayment,
          accountNo: this.selectedPaymentMethod === 'cpf' ? this.detailsCPF.accountNo ? this.detailsCPF.accountNo : '' : ''
        }
        self.updateSelectedMethodData(selectedPaymentMethod)
        self.selectedPolicy.isElderShield === 'Y' || _.isEmpty(this.eligiblePolicy) ? self.$router.push({ path: "/payment/change-payment-method/cpm-confirmation" }) : self.$router.push({ path: "/payment/change-payment-method/cpm-select-more-policies" });
        }
        else if (!_.isEmpty(this.selectedMethodData)){
        let selectedPaymentMethod = {
          paymentMethod: this.selectedPaymentMethod === 'cashOrCheque' ? 'Cash or cheque' : this.selectedPaymentMethod === 'giro' ? 'GIRO' : 'Personal CPF',
          amount: this.selectedMethodData.amount,
          payRemaining: this.selectedMethodData.payRemaining,
          payFull: this.selectedMethodData.payFull,
          accountNo: this.selectedPaymentMethod === 'cpf' ? this.detailsCPF.accountNo ? this.detailsCPF.accountNo : '' : ''
        }
        self.updateSelectedMethodData(selectedPaymentMethod)
        self.selectedPolicy.isElderShield === 'Y' || _.isEmpty(this.eligiblePolicy) ? self.$router.push({ path: "/payment/change-payment-method/cpm-confirmation" }) : self.$router.push({ path: "/payment/change-payment-method/cpm-select-more-policies" });
        }
        else {
        self.selectedPolicy.isElderShield === 'Y' || _.isEmpty(this.eligiblePolicy) ? self.$router.push({ path: "/payment/change-payment-method/cpm-confirmation" }) : self.$router.push({ path: "/payment/change-payment-method/cpm-select-more-policies" });
        }
      }
    },
    goToGiro() {
      const self = this;
      console.log(`button clicked >>>>>>>> GO TO GIRO `);
        self.$router.push({
          path: "/payment/change-payment-method/cpm-setting-giro",
        });
    },
    onValueChange(value) {
      console.log(`radio button : ${JSON.stringify(value)}`);
      let tempSelectedMethod = {
        paymentMethod: value
      }
      this.updateTempSelection(tempSelectedMethod)
      this.selectedPaymentMethod = value;
      this.isValidToProceed = this.selectedPaymentMethod ? true : false
    },
    newPaymentItem() {
        let items = [];
        //mock only change later
        this.selectedPolicy.newPaymentMethodOpt.find(el => {
            if (el.isPersonalCPF === 'Y') {
              if (this.selectedPolicy.CPFWithdrawalLimit < this.selectedPolicy.policyNextDueAmount) {
                // items.push({})
              }else {
                items.push({
                    value: 'cpf',
                    label: 'Personal CPF'
                });
              }
            }
            if (el.isGECashFlo === 'Y') {
                items.push({
                    value: 'geCashflo',
                    label: 'OCBC GE Cashflo card'
                });
            }
            if (el.isObcCreditCard === 'Y') {
                items.push({
                    value: 'ocbcCreditCard',
                    label: 'OCBC credit card'
                });
            }
            if (el.isVisaMasterCard === 'Y') {
                items.push({
                    value: 'creditCard',
                    label: 'VISA or Mastercard'
                });
            }
            if (el.isCashCheque === 'Y') {
                items.push({
                    value: 'cashOrCheque',
                    label: 'Cash or cheque'
                });
            }
            if (el.isGiroAllow === 'Y') {
                this.isGiro = true;
            }
        })

        if (this.selectedPolicy.allowedRenewalCC === 'Y' && this.selectedPolicy.expectedCCType === 1) {
          items.push({
            value: 'creditCard',
            label: 'VISA or Mastercard'
          })
        }
        if (this.selectedPolicy.allowedRenewalCC === 'Y' && this.selectedPolicy.expectedCCType === 2) {
          items.push({
            value: 'geCashflo',
            label: 'OCBC GE Cashflo card'
          })
        }
        if (this.selectedPolicy.allowedRenewalCC === 'Y' && this.selectedPolicy.expectedCCType === 3) {
          items.push({
            value: 'ocbcCreditCard',
            label: 'OCBC credit card'
          })
        }

        this.selectedPolicy.currentPaymentMethods.find(el => {
          if (_.includes(el.paymentMethodDesc, 'Cash') || _.includes(el.paymentMethodDesc, 'CASH')) {
            let index = items.findIndex(el => el.value === 'cashOrCheque');
            if (index >= 0) {
              items.splice(index, 1);
            }
          }
        })
        console.warn('itemss1',items);
        return _.uniq(items);
    },
    joinAccount(payment) {
        let paymentDesc = _.map(payment, 'paymentMethodDesc');

        return _.join(paymentDesc, ', ');
    }
  },
};
</script>
