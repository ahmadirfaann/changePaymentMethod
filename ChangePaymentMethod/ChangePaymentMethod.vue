<template>
	<div id="change-payment-method">
		<inner-template
			:appBarTitle="toolbarTitle ? toolbarTitle : ''"
			:secondaryTitle="toolbarSubheading ? toolbarSubheading : ''"
			@click:left-btn="onClickBack"
			:leftIconType="leftIcon"
			@click:right-btn="onClickDiscard"
			:rightIconType="rightIcon"
			:enableRightBtn="right"
		>
			<router-view />
			<v-dialog v-model="backDialog" :width="295">
				<v-card class="text-xs-center">
					<div class="pa-4">
						<h2 class="subheading primary--text font-weight-semibold text-xs-center mb-2">{{ backDialogMsg.header }}</h2>
						<p class="mb-0 font-weight-semibold">{{ backDialogMsg.bodyText1 }}</p>
						<p class="mb-0">{{ backDialogMsg.bodyText2 }}</p>
					</div>

					<v-layout row>
						<v-btn
							block
							class="ma-0 radius-tl-0 radius-tr-0 radius-br-0"
							@click="
								back(backDialogMsg.toRoute);
								backDialog = false;
							"
							>{{ $t('fo.yes') }}</v-btn
						>
						<v-btn
							block
							class="ma-0 radius-tl-0 radius-tr-0 radius-bl-0"
							@click="
								backDialogMsg = {};
								backDialog = false;
							"
							>{{ $t('fo.no') }}</v-btn
						>
					</v-layout>
				</v-card>
			</v-dialog>

			<leo-dialog :show="isDiscard" containerClass="leo-p-3xl" persistence>
				<leo-button fab class="leo-bg-white leo-absolute leo-top-0 leo-right-0 leo-mt-sm leo-mr-sm leo-button leo-button--type-fab" @click="closeDialog">
					<leo-icon type="close" size="lg" />
				</leo-button>
				<div class="leo-text-primary leo-font-semibold leo-text-lg leo-text-center leo-mb-md">Cancel transaction</div>
				<leo-illustration class="leo-flex leo-justify-center leo-mb-md" type="sign-out" width="230px" height="154px" />
				<div class="leo-text-center leo-text-accent leo-mb-3xl">Are you sure to cancel the transaction and discard all data entered previously?</div>
				<div class="leo-text-center leo-mb-md">
					<leo-button primary cta large @click="onClickConfirmDiscard"> Yes, cancel and discard </leo-button>
				</div>
				<div class="leo-text-center">
					<leo-button cta large class="leo-text-primary leo-bg-white" @click="closeDialog"> No, stay here </leo-button>
				</div>
			</leo-dialog>
		</inner-template>
	</div>
</template>

<style lang="scss" scoped>
.notch-placeholer {
	height: env(safe-area-inset-top);
	width: 100vw;
	top: 0px;
	left: 0px;
	position: fixed;
	background: #f5f5f5;
	z-index: 2;
}

.toolbar-margin-top {
	margin-top: env(safe-area-inset-top) !important;
}
</style>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import InnerTemplate from 'utilities/templates/InnerTemplate';

export default {
	name: 'ChangePaymentMethod',
	components: {
		InnerTemplate
	},
	data() {
		return {
			showShadow: false,
			backDialog: false,
			backDialogMsg: {},
			isReady: false,
			isDiscard: false
		};
	},
	mounted() {
		// change the color of the status bar to black
		this.$globalService.globalEventDistributor.setDarkStatusBarColor();
		window.addEventListener('scroll', this.handleScroll);
	},
	created() {
		setTimeout(() => {
			this.$root.$on('onAndroidBackButton', this.onClickBack);
		});
	},
	beforeDestroy() {
		this.$root.$off('onAndroidBackButton');
	},
	computed: {
		...mapState(['isShowToolbar']),
		...mapState('cpmStore', ['selectedPolicy', 'selectedMethodData', 'isMorePolicies', 'isPayExcess', 'moreEligible']),

		toolbarTitle() {
			switch (this.$route.name) {
				case 'cpm-select-policy':
				  return 'Select policy'
				case 'cpm-confirmation':
				  return this.isMorePolicies === true ? 'Confirm changes' : 'Confirm change'
				case 'cpm-select-more-policies':
				  return 'Select more policies'
				case 'cpm-payment-method':
				  return 'Select payment method'
				case 'cpm-cc-detail':
				  return 'Enter credit card details'
				case 'cpm-setting-giro':
					return 'Setting up GIRO arrangement';
				case 'cpm-payment-options':
					return 'Select payment option'
				default:
					return false;
			}
		},
		toolbarSubheading() {
			switch (this.$route.name) {
				case 'cpm-confirmation':
				  	return this.isMorePolicies === true ? '' : this.selectedPolicy.policyMainPlanName
				case 'cpm-select-policy':
					return ''
				case 'cpm-setting-giro':
					return ''
				case 'cpm-select-more-policies':
					return ''
				case 'cpm-before-start':
					return ''
				case 'cpm-acknowledgement':
					return ''
				default:
				  return this.selectedPolicy.policyMainPlanName ? this.selectedPolicy.policyMainPlanName : ''
			}
			// switch (this.$route.name) {
			// 	case 'cpm-confirmation':
			// 		return this.selectedPolicy.policyMainPlanName;
			// 	case 'cpm-payment-method':
			// 	  return this.selectedPolicy.policyMainPlanName;
			// 	case 'cpm-cc-detail':
			// 	  return this.selectedPolicy.policyMainPlanName;
			// 	default:
			// 		return this.selectedPolicy.policyMainPlanName;
			// }
		},
		isToolbarShadowShown() {
			switch (this.$route.name) {
				// case 'cp-acknowledgement':
				//   return false
				
				default:
					return true;
			}
		},
		leftIcon() {
			switch (this.$route.name) {
				case 'cpm-no-policy':
					return 'close'
				case 'cpm-acknowledgement':
					return 'close'
				case 'cpm-before-start':
					return ''
				default:
					return 'arrow-left';
			}
		},
		rightIcon() {
			switch (this.$route.name) {
				case 'cpm-select-more-policies':
				  return 'close'
				case 'cpm-confirmation':
				  return 'close'
				case 'cpm-payment-method':
				  return 'close'
				case 'cpm-cc-detail':
				  return 'close'
				case 'cpm-setting-giro':
					return 'close';
				case 'cpm-payment-options':
					return 'close'
				default:
					return null;
			}
		},
		right() {
			switch (this.$route.name) {
				case 'cpm-select-more-policies':
				case 'cpm-confirmation':
				case 'cpm-payment-method':
				case 'cpm-cc-detail':
				case 'cpm-setting-giro':
				case 'cpm-payment-options':
					return true
				default:
					return false
			}
		}
	},
	methods: {
		...mapMutations('cpmStore', ['updateSelectedPolicy', 'updateSelectedMethodData', 'updateCPFWithdrawal', 'updateSelectedMorePolicy', 'updatePayExcess', 'updateSelectedCreditCard', 'updateTempSelection', 'updateTempOption', 'updateMorePolicies', 'updateSubmitMorePolicies', 'updateMoreEligible']),
		...mapActions('cpmStpre', ['clearAllState']),
		onClickBack() {
			this.back();
		},
		onClickDiscard() {
			if (window.isMobileDevice) {
				// FirebasePlugin.setScreenName('Change Payment Frequency_Cancel Transaction');
			}
			const self = this;
			self.isDiscard = true;
		},
		closeDialog() {
			if (window.isMobileDevice) {
				// FirebasePlugin.setScreenName('Change Payment Frequency_Cancel Transaction_No stay here');
			}
			const self = this;
			self.isDiscard = false;
		},
		onClickConfirmDiscard() {
			if (window.isMobileDevice) {
				// FirebasePlugin.setScreenName('Change Payment Frequency_Cancel Transaction_Yes cancel and discard');
			}
			this.clearAllState();
			const self = this;
			self.$router.push({ path: '/gc/tabs/payment-services' });
		},
		back(toRoute) {
			const routeName = toRoute || this.getRouteName();

			if (routeName) {
				this.$router.push({
					name: routeName
				});
			} else {
				this.clearAllState();
				this.$router.push({ path: '/gc/tabs/payment-services' });
			}
		},
		getRouteName() {
			switch (this.$route.name) {
				case 'cpm-select-more-policies':
					this.updateSelectedMorePolicy([])
					this.updateMorePolicies({})
					this.updateSubmitMorePolicies([])
				  return this.selectedPolicy.isElderShield === 'N' ? this.selectedMethodData.paymentMethod === 'Credit Card' || this.selectedMethodData.paymentMethod === 'OCBC Credit Card' || this.selectedMethodData.paymentMethod === 'OCBC GE Cashflo Card' ? 'cpm-cc-detail' : 'cpm-payment-method' : ''
				case 'cpm-confirmation':
				  return this.selectedPolicy.isElderShield === 'Y' || _.isEmpty(this.moreEligible) ? this.selectedMethodData.paymentMethod === 'Credit Card' || this.selectedMethodData.paymentMethod === 'OCBC Credit Card' || this.selectedMethodData.paymentMethod === 'OCBC GE Cashflo Card'? 'cpm-cc-detail': 'cpm-payment-method' : 'cpm-select-more-policies'
				case 'cpm-payment-method':
					
				  if (this.selectedPolicy.isElderShield === 'Y' && this.selectedPolicy.CPFWithdrawalLimit < this.selectedPolicy.policyNextDueAmount) {
					  this.updateTempSelection({})
					  this.updatePayExcess('')
					  this.updateSelectedMethodData({})
					return 'cpm-payment-options'
				  }else {
					this.updatePayExcess('')
					this.updateSelectedMethodData({})
					this.updateSelectedCreditCard({})
					this.updateTempSelection({})
					this.updateTempOption({})
					this.updateSelectedMorePolicy([])
					this.updateMorePolicies({})
					this.updateSubmitMorePolicies([])
					  return 'cpm-select-policy'
				  }
				case 'cpm-cc-detail':
				  return 'cpm-payment-method'
				case 'cpm-setting-giro':
					return 'cpm-payment-method';
				case 'cpm-payment-options':
					this.updateSelectedMethodData({})
					this.updateSelectedCreditCard({})
					this.updateTempSelection({})
					this.updateTempOption({})
				  return 'cpm-select-policy'
				case 'cpm-before-start':
					return false;
				default:
					return false;
			}
		},
		handleScroll() {
			let scroll = window.scrollY;
			if (scroll > 0) {
				this.showShadow = true;
			} else {
				this.showShadow = false;
			}
		}
	}
};
</script>
