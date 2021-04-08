<template src="./CPMSelectMorePolicies.html"></template>
<style lang="scss" scoped src="./CPMSelectMorePolicies.scss"></style>

<script>
import UtilService from 'hks-common/services/UtilService';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import MorePolicySelectionCard from '@components/MorePolicySelectionCard/MorePolicySelectionCard';
import LeoToggleButton from '@components/LeoToggleButton/LeoToggleButton';


export default {
	name: 'CPMSelectMorePolicies',
	components: {
		MorePolicySelectionCard,
		'leo-toggle-button': LeoToggleButton,
	},
	data() {
		return {
			isDialogOpen: false,
			agentContactNumber: '',
			responses: {
				MorePolicies: false
			},
			numberSelected: 0,
			checkboxStatus: false,
			isPolicySelected: [],
			method: 'creditCard',
			eligiblePolicy: undefined,
			selectPolicy: undefined,
			checkPolicy: '',
			filterEligiblePolicy: [],
			tempNonEligiblePolicies: [],
			newNonEligiblePolicies: []
		};
	},
	created() {
		this.selectPolicy = _.cloneDeep(this.selectedPolicy)
	},
	async mounted() {

		this.filterEligiblePolicy = _.cloneDeep(_.filter(this.eligiblePolicies.filter(el =>  el.isElderShield === 'N'), el => el.policyMainPlanName !== this.selectPolicy.policyMainPlanName));
		console.warn('this.eligible', this.filterEligiblePolicy);
		let temp = {}
		if (this.selectedMethodData.paymentMethod === 'Cash or cheque') {
			 this.filterEligiblePolicy.forEach(el => {
				console.warn('el', el);
				el.currentPaymentMethods.forEach(cp => {
					console.warn('cp', cp);
					if (_.includes(cp.paymentMethodDesc, 'Cash') || _.includes(cp.paymentMethodDesc, 'CASH')) {
						console.warn('el1', el);
						// this.nonEligiblePolicies.push(el)
						// this.updateNonEligiblePolicyByAction(el)
						this.tempNonEligiblePolicies.push(el)
					}
				})
			})
		}else if (this.selectedMethodData.paymentMethod === 'Credit Card') {
			 this.filterEligiblePolicy.forEach(el => {
				el.newPaymentMethodOpt.forEach(pm => {
					if (pm.isObcCreditCard === 'Y' || (el.allowedRenewalCC === 'Y' && el.expectedCCType === 3) || pm.isGECashFlo === 'Y' || (el.allowedRenewalCC === 'Y' && el.expectedCCType === 2)) {
						// this.updateNonEligiblePolicyByAction(el)
						this.tempNonEligiblePolicies.push(el)
					}
				})
			})
		}else if (this.selectedMethodData.paymentMethod === 'OCBC Credit Card') {
			 this.filterEligiblePolicy.forEach(el => {
				el.newPaymentMethodOpt.forEach(pm => {
					if (pm.isVisaMasterCard === 'Y' || (el.allowedRenewalCC === 'Y' && el.expectedCCType === 1) || pm.isGECashFlo === 'Y' || (el.allowedRenewalCC === 'Y' && el.expectedCCType === 2)) {
						// this.updateNonEligiblePolicyByAction(el)
						this.tempNonEligiblePolicies.push(el)
					}
				})
			})
		}else if (this.selectedMethodData.paymentMethod === 'OCBC GE Cashflo Card') {
			 this.filterEligiblePolicy.forEach(el => {
				el.newPaymentMethodOpt.forEach(pm => {
					if (pm.isVisaMasterCard === 'Y' || (el.allowedRenewalCC === 'Y' && el.expectedCCType === 1) || pm.isObcCreditCard === 'Y' || (el.allowedRenewalCC === 'Y' && el.expectedCCType === 3)) {
						// this.updateNonEligiblePolicyByAction(el)
						this.tempNonEligiblePolicies.push(el)
					}
				})
			})
		}
		this.newNonEligiblePolicies = [...this.nonEligiblePolicies, ...this.tempNonEligiblePolicies];
		this.eligiblePolicy = this.filterEligiblePolicy.filter(item => !this.newNonEligiblePolicies.includes(item));
		console.warn('this.eligiblePolicy', this.eligiblePolicy);
		console.warn('this.nonEligiblePolicies', this.newNonEligiblePolicies);
		
		console.warn('this.isMorePolicies', this.isMorePolicies);
			// this.handleMorePolicies(this.isMorePolicies)
		this.responses.MorePolicies = this.isMorePolicies === true ? true : null

		console.warn('this.morePoliciesSelected', this.morePoliciesSelected);
		
		if (this.morePoliciesSelected && !_.isEmpty(this.morePoliciesSelected)) {
			this.checkPolicy = this.morePoliciesSelected.map(el => {
				 return el.policyNo
			})
			console.warn('this.checkPolicy', this.checkPolicy);
		this.numberSelected = this.morePoliciesSelected?.filter((item) => item.checkboxStatus === true).length;
		this.isPolicySelected.push(this.morePoliciesSelected)

		}

	},
	computed: {
		...mapState('cpmStore', ['isMorePolicies', 'agentInfo', 'eligiblePolicies', 'nonEligiblePolicies', 'morePoliciesSelected', 'selectedMethodData', 'selectedPolicy', 'tempSelectMore']),
		...mapGetters('cpmStore', 'getSelectedPolicy' ),
		canProceed() {
			// TO REPLACE WITH ACTUAL BUSINESS LOGIC
			return !(this.responses.MorePolicies);
		},
		numberPoliciesSelected() {
			return this.numberSelected;
		}
	},
	methods: {
		capitalFirstLetter(value) {
      		return UtilService.setFirstCapitalLetter(value);
    	},
		...mapActions('cpmStore', ['getAgentInfoFromServer', 'updateNonEligiblePolicyByAction']),
		...mapMutations('cpmStore', ['updateMorePolicies', 'updateSelectedMorePolicy', 'clearSelectedMorePolicy', 'updateTempSelectMorePolicies']),
		handleMorePolicies(answer) {
			this.responses.MorePolicies = answer;
			this.updateMorePolicies(answer);
		},
		next() {
			const self = this;
			self.updateSelectedMorePolicy(self.isPolicySelected);
			self.$router.push({ path: '/payment/change-payment-method/cpm-confirmation' });
  		  },
		nextNo() {
			const self = this;
			self.handleMorePolicies(false);
			self.clearSelectedMorePolicy();
			self.$router.push({ path: '/payment/change-payment-method/cpm-confirmation' });
		},
		changeCheckbox(value) {
			if (this.isPolicySelected.length > 0) {
				if (!_.some(this.isPolicySelected, { policyNo: value.policyNo }) && value.checkboxStatus) {
					this.isPolicySelected.push(value); // if not found and status is true, set
				} else if (_.some(this.isPolicySelected, { policyNo: value.policyNo }) && !value.checkboxStatus) {
					_.remove(this.isPolicySelected, { policyNo: value.policyNo }); //remove if found and checkbox is false
				}
			} else {
				if (value.checkboxStatus) {
					this.isPolicySelected.push(value); // if empty selected, set
				}
			}
			this.numberSelected = this.isPolicySelected.filter((item) => item.checkboxStatus === true).length;

			var i = this.isPolicySelected.length;
			while (i--) {
				if (!this.isPolicySelected[i].checkboxStatus) {
					this.isPolicySelected.splice(i, 1);
				}
			}
			this.numberSelected = this.isPolicySelected.filter((item) => item.checkboxStatus === true).length;
		},
		pressToCall() {
			window.plugins.CallNumber.callNumber(
				function (msg) {
					console.log('ok: ' + msg);
				}, // Success function
				function (msg) {
					console.log('error: ' + msg);
				}, // Error function
				this.agentContactNumber, // Contact Number
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
		},
		joinAccount(payment) {
			let paymentDesc = _.map(payment, 'paymentMethodDesc');

			return _.join(paymentDesc, ', ');
		},
		joinLifeAssureds(str) {
			let lifeAssuredsName = str.map((el) => el.trim().split(/\s*,\s*/));

			return _.join(lifeAssuredsName, ', ');
		}
	}
};
</script>
