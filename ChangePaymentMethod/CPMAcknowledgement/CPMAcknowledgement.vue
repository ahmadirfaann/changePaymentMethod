<template src="./CPMAcknowledgement.html"></template>
<style lang="scss" scoped src="./CPMAcknowledgement.scss"></style>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'CPMAcknowledgement',
  data () {
    return {
      status: '',
      trxnSummId: '',
      trxnSummIdList: [],
      isDialogOpen: false,
      isMulTrxn: false,
      hasOutstandingPremium: false,
    }
  },

  computed: {
    ...mapState('cpmStore', ['eligiblePolicies', 'agentInfo'])
  },
  
  created () {
    const self = this;
    self.status = self.$route.params.status;
    if (!_.isEmpty(self.$route.params.trxnSummId)) {
      self.trxnSummId = _.cloneDeep(self.$route.params.trxnSummId);
    }
    if (!_.isEmpty(self.$route.params.policyAPLLoanRepayment || self.$route.params.policyOutstandingLoanRepayment || self.$route.params.policyOutstandingPremium )) {
      if (self.$route.params.policyAPLLoanRepayment !== '0' || self.$route.params.policyOutstandingLoanRepayment !== '0' || self.$route.params.policyOutstandingPremium !== '0') {
        self.hasOutstandingPremium = true;
      }
    }
    if (!_.isEmpty(self.$route.params.trxnSummIdList)) {
      self.trxnSummIdList = _.cloneDeep(self.$route.params.trxnSummIdList);
      self.isMulTrxn = true

      _.forEach(self.trxnSummIdList, el => {
        if (el.policyAPLLoanRepayment !== '0' || el.policyOutstandingLoanRepayment !== '0' || el.policyOutstandingPremium !== '0'){
          self.hasOutstandingPremium = true;
        }
      })
    }
  },

  mounted () {},

  methods: {
    goToMakePayment() {
      this.$router.push({ path: '/payment/make-payment'});
    },

    goToPaymentMethod() {
      this.$router.push({path:  '/payment/change-payment-method'})
    },
    pressToCall() {
			window.plugins.CallNumber.callNumber(
				function (msg) {
					console.log('ok: ' + msg);
				}, // Success function
				function (msg) {
					console.log('error: ' + msg);
				}, // Error function
				this.agentInfo.contactNumber ? this.agentInfo.contactNumber : '18002482888', // Contact Number
				true // by pass app selection
			);
		},
    pressToEmail() {
      let fullName = self.$globalService.globalEventDistributor.personalDetails.fullName ? self.$globalService.globalEventDistributor.personalDetails.fullName : '';
			let emailMsg =
				"Hi, I'm " +
			  fullName +
				'. I need some help to change payment method for my Great Eastern policy. <br> <br>Hope you can assist, thanks! <br> <br>Your sincerely, <br>' +
				fullName;
			cordova.plugins.email.open({
				to: ['wecare-sg@greateasternlife.com'],
				cc: [],
				bcc: [],
				subject: 'Help needed to change payment method',
				body: emailMsg
			});
		}
  }
}
</script>