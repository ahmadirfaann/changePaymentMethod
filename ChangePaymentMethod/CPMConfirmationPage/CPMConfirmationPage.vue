<template src="./CPMConfirmationPage.html"></template>
<style lang="scss" scoped src="./CPMConfirmationPage.scss"></style>

<script>
import UtilService from 'hks-common/services/UtilService';
import { thousandSeparators } from 'hks-common/services/filter';
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import CONFIG from 'hks-common/config/config.json'


export default {
	name: 'CPMConfirmationPage',
	data() {
		return {
			flagCheckBox: [],
			checkbox: false,
			isEldershield: false,
			cpfAccName: '',
			custEmail: '',
			trxnSummId: ['GE-SGWD1278376829'],
			combinePolicy: [],
			idNumber: '',
			currentPaymentMtd: [],
			custName: ''
		};
	},
	/** ******************** CREATED ************************** */
	  created() {
	    const self = this;
	    self.flagCheckBox = self.checkbox ? ['value-cb-1'] : []
		for (let i = 0; i < this.morePoliciesSelected.length; i++) {
			if (this.selectedPolicy.policyMainPlanName == this.morePoliciesSelected[i].policyMainPlanName) {
				this.morePoliciesSelected.splice(i, 1)
			}
		}

		self.isEldershield = self.selectedPolicy.isElderShield === 'Y';
		console.warn('selectedMethodData', self.selectedMethodData);

		for (let i = 0; i < this.selectedPolicy.currentPaymentMethods.length; i++){
			if (this.selectedPolicy.currentPaymentMethods[i].paymentMethodCd == 'CPF') {
				self.cpfAccName = this.selectedPolicy.currentPaymentMethods[i].accountName;
			}
		}

		// this.custEmail = this.policyHolderData.email ? this.policyHolderData.email : this.$globalService.globalEventDistributor.emailFromToken;
		if (
			self.$globalService.globalEventDistributor.personalDetails &&
			self.$globalService.globalEventDistributor.personalDetails.email &&
			self.$globalService.globalEventDistributor.personalDetails.fullName
		) {
			self.custEmail = self.$globalService.globalEventDistributor.personalDetails.email ? self.$globalService.globalEventDistributor.personalDetails.email : this.$globalService.globalEventDistributor.emailFromToken;
			self.custName = self.$globalService.globalEventDistributor.personalDetails.fullName ? self.$globalService.globalEventDistributor.personalDetails.fullName : '';
		} 
		console.warn('self.custEmail', self.custEmail);
		console.warn('custName', self.custName);

		let mainStr = this.selectedPolicy.idNumber,
          vis = mainStr.slice(-4),
          countNum = '';

      	for(var i = (mainStr.length)-4; i>0; i--){
          	countNum += '*';
      	}

      	this.idNumber = countNum+vis
      	console.warn('idNumber', this.idNumber);

		  console.warn('this.isMorePolicies', this.isMorePolicies);

		if (this.isMorePolicies === false) {
			this.updateSelectedMorePolicy([]);
			this.updateSubmitMorePolicies([])
		}

	  },
	mounted() {
		this.selectedPolicy.currentPaymentMethods.forEach(el => {
			let tempExistingPaymentMtd = {
				creditCardNo:  _.includes(el.paymentMethodDesc, 'CREDIT') ? el.accountNo : '' ,
				creditCardType: el.accountType ? el.accountType : '' ,
				expiredDate: '',
				nameCardHolder: _.includes(el.paymentMethodDesc, 'CREDIT') ? el.accountName : '',
				pymtMtdCode: el.paymentMethodCd,
				pymtMtdDscp: el.paymentMethodDesc
			};
			this.currentPaymentMtd.push(tempExistingPaymentMtd)
		});

		if (this.morePoliciesSelected && this.morePoliciesSelected.length > 0) {
			let temp = {
				policyNo: this.selectedPolicy.policyNo,
				policyMainPlanName: this.selectedPolicy.policyMainPlanName,
				policyMainPlanCd: this.selectedPolicy.policyMainPlanCd,
				existingPaymentMethod: this.currentPaymentMtd,
				sourceSystemDesc: this.selectedPolicy.sourceSystemDesc
			}
			this.combinePolicy = _.concat(temp, this.morePoliciesSelected)
			console.warn('this.combinePolicy', this.combinePolicy);
			this.updateSubmitMorePolicies(this.combinePolicy)
		};
	},
	methods: {
				...mapActions('cpmStore', [ 'requestOtp', 'getSessionToken', 'submission']),
				...mapMutations('cpmStore', [ 'updateMorePolicies', 'updateMorePolicies', 'updateSubmitMorePolicies', 'updateSelectedMorePolicy']),

		onClickChecked() {
			const self = this;
			self.checkbox = !self.checkbox;
		},
		onClickNext() {
			  	//add method for submission and ...
			   	const self = this;
				self.$globalService.globalComponent.showLoader()
				self.submission()
				.then(res => {
					if (self.cpMethodSubmitStatus.length == 1) {
						self.$router.push({ name: 'cpm-acknowledgement', params: {status: 'success',  trxnSummId: self.cpMethodSubmitStatus[0].trxnSummId, policyAPLLoanRepayment: self.cpMethodSubmitStatus[0].policyAPLLoanRepayment, policyOutstandingLoanRepayment: self.cpMethodSubmitStatus[0].policyOutstandingLoanRepayment, policyOutstandingPremium: self.cpMethodSubmitStatus[0].policyOutstandingPremium} });
					}
					else {
						self.$router.push({ name: 'cpm-acknowledgement', params: {status: 'success',  trxnSummIdList: self.cpMethodSubmitStatus} });
					}
				})
				.catch((err) => {
					self.$router.push({ name: 'cpm-acknowledgement', params: {status: 'failed'} });
				})
				.then(() => {
					self.$globalService.globalComponent.hideLoader();
				});

		  },
		  onClickEdit(){
			  if (this.selectedMethodData.paymentMethod === 'Credit Card' || this.selectedMethodData.paymentMethod === 'OCBC Credit Card' || this.selectedMethodData.paymentMethod === 'OCBC GE Cashflo Card') {
				  this.$router.push({
          			path: "/payment/change-payment-method/cpm-cc-detail",
        			});
			  }else {
				  this.$router.push({
			  		path: "/payment/change-payment-method/cpm-payment-method",
					});
			  }
		  },
		  onClickEditPolicy() {
			  this.$router.push({
          		path: "/payment/change-payment-method/cpm-select-more-policies"});
		  },

		  goToTermConditions() {
			  UtilService.openExternalWebsite(CONFIG.API_PATHS.TERM_CONDITIONS.PATH);
		  }
	},
	computed: {
    ...mapState('cpmStore', ['selectedPolicy', 'selectedMethodData', 'morePoliciesSelected', 'isCPFWithdrawalIsMore','cpMethodSubmitStatus', 'isMorePolicies']),
  }
};
</script>
