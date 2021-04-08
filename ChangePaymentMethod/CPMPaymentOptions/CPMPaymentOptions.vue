<template src="./CPMPaymentOptions.html"></template>
<style lang="scss" scoped src="./CPMPaymentOptions.scss"></style>

<script>
import LeoRadioCustom from "utilities/components/LeoCustom/LeoRadioCustom2";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "CPMPaymentOptions",
  components: {
    "leo-radio-custom": LeoRadioCustom,
  },
  data() {
    return {
      isCPF: false,
      isNoDetail: false,
      choosePayment: false,
      remainingPremium: '',
      chooseOptions: true,
      selectedPaymentMethod: undefined,
      payPremium: null,
      selectedOptions: '',
      paymentAmount: '',
      isChoosePayment: false,
      isValidToProceed: false,
      chooseOtherPayment: false,
      ccNo: '',
      isVisa: false,
      isMaster: false
    };
  },
  computed: {
      ...mapState('cpmStore', ['selectedPolicy', 'eligiblePolicies', 'tempSelectionOption']),
  },
  watch: {
    selectedPaymentMethod() {},
  },
  created() {
    // premium amount for this policy
    this.remainingPremium = this.selectedPolicy.policyNextDueAmount - this.selectedPolicy.CPFWithdrawalLimit;
    this.isCPF = this.selectedPolicy.currentPaymentMethods.find(el =>{
      if (_.includes(el.paymentMethodDesc, 'CPF')) {
        return true;
      }else return false
    });
    // this.isNoDetail = this.selectedPolicy.currentPaymentMethods.find(el => _.isUndefined(el.accountNo)) ? true: false
    this.isNoDetail = this.selectedPolicy.currentPaymentMethods.filter(el => el.accountNo === '').length > 1 ? true: false

    this.selectedPolicy.currentPaymentMethods.forEach(cc => {
      if ((_.includes(cc.paymentMethodDesc, 'Credit') || _.includes(cc.paymentMethodDesc, 'CREDIT')) && cc.accountNo) {
        let j = cc.accountNo.match(/.{1,4}/g)
        this.ccNo = j.join(' ')
      }
    });
  },
  mounted() {

    if (this.tempSelectionOption && !_.isEmpty(this.tempSelectionOption)) {
      this.payPremium = this.tempSelectionOption.option
      this.isChoosePayment = this.payPremium ? true : false;
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
    ...mapMutations('cpmStore', ['updateSelectedMethodData', 'updatePayExcess', 'updateTempOption']),
    onClickNextOption() {
        if (this.payPremium === 'pay excess') {
          this.choosePayment = true;
          this.chooseOptions = false;
          //self.$router.push({ path: '/payment/change-payment-method/cpm-payment-method' })
          this.updatePayExcess(this.choosePayment)
          this.$router.push({ name: 'cpm-payment-method', params: { choosePayment:true,chooseOptions:false} });

        }else {
          this.chooseOtherPayment = true;
          this.chooseOptions = false;
          //self.$router.push({ path: '/payment/change-payment-method/cpm-payment-method' })
          this.$router.push({ name: 'cpm-payment-method', params: { chooseOtherPayment:true,chooseOptions:false} });

        }
    },
    goToGiro() {
      console.log(`button clicked >>>>>>>> GO TO GIRO `);
    },
    // onValueChange(value) {
    //   console.log(`radio button : ${JSON.stringify(value)}`);
    //   this.selectedPaymentMethod = value;
    //   this.isValidToProceed = this.selectedPaymentMethod ? true : false
    // },
    onChange(value) {
        console.warn(`radio button options : ${JSON.stringify(value)}`);
        let tempSelectedOption = {
          option: value
        }
        this.updateTempOption(tempSelectedOption)
        this.payPremium = value;
        this.isChoosePayment = this.payPremium ? true : false
    },
    items() {
        let items = [
            {
                label: 'Pay premium in excess of CPF withdrawal limit',
                value: 'pay excess'
            },
            {
                label: 'Pay full premium with other payment method',
                value: 'pay full'
            }
        ]
        _.forEach(this.selectedPolicy.currentPaymentMethods, el => {
            if (_.includes(el.paymentMethodDesc, 'CPF')) {
                items = [{
                    label: 'Pay premium in excess of CPF withdrawal limit',
                    value: 'pay excess'
                },
                {
                    label: 'Pay full premium and stop any deduction from CPF account',
                    value: 'pay full'
                }];
            }
        });
        console.warn('itemsss2', items);
        return items;
    },
    joinAccount(payment) {
        let paymentDesc = _.map(payment, 'paymentMethodDesc');

        return _.join(paymentDesc, ',');
    }
  },
};
</script>
