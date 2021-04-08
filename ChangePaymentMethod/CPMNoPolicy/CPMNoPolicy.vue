<template src="./CPMNoPolicy.html"></template>
<style lang="scss" scoped src="./CPMNoPolicy.scss"></style>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import SystemSkeleton from 'utilities/components/Skeletons/SystemSkeleton';

export default {
  name: 'CPMNoPolicy',
  components: {
	  SystemSkeleton
  },
  data () {
    return {
      isDialogOpen: false,
	  isLoading: false
    }
  },
  computed : {
        ...mapState('cpmStore', ['eligiblePolicies', 'nonEligiblePolicies', 'agentInfo']),
  },
  created () {},
  async mounted () {
	  	// this.isLoading = true;

    	// await this.getChangePaymentMethodPoliciesFromServer()

    	// this.isLoading = false;
  },
  methods: {
    ...mapActions('cpmStore', ['getChangePaymentMethodPoliciesFromServer']),


    startChangePaymentFrequency() {
      this.$router.push({ path: '/payment/change-payment-frequency' });
		},
		startMakePayment() {
      this.$router.push({ path: '/payment/make-payment' });
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
