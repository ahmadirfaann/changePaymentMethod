<template>
	<!-- <section v-if="isLoading">
			<leo-skeleton-navigation-card class="leo-mb-md leo-max-w-full" />
			<leo-skeleton-navigation-card class="leo-mb-md leo-max-w-full" />
			<leo-skeleton-navigation-card class="leo-mb-md leo-max-w-full" />
	</section> -->
	<!-- <system-skeleton v-if="isLoading" class="leo-px-md" /> -->
	<section>
		<span class="leo-inline-block leo-text-lg leo-font-semibold leo-text-primary leo-p-xs">
			{{ $t('fo.cpm.selectpolicy.title') }}
		</span>
		<div class="leo-mb-md leo-mt-xs">
			<!-- for eligiblePolicy -->
			<leo-card class="leo-mb-md" v-for="eligiblePolicy in eligiblePolicies" v-bind:key="eligiblePolicy.policyNo">
				<section class="leo-my-2xs" v-on:click="navigateToDetails(eligiblePolicy)">
					<div class="leo-flex leo-items-start leo-pb-xs">
						<div class="leo-w-full leo-mx-xs">
							<div class="leo-text-accent leo-text-xs">
								<span class="leo-text-xs leo-text-accent">{{ eligiblePolicy.policyNo }}</span>
								<leo-divider vertical class="leo-h-xs leo-mx-xs" color="secondary" />
								<span class="leo-text-xs leo-text-accent">{{ eligiblePolicy.policyStartDate | dateFormat }}</span>
							</div>
							<div class="leo-text-lg leo-font-semibold code-flag leo-mt-2xs">
								{{ eligiblePolicy.policyMainPlanName ? eligiblePolicy.policyMainPlanName : eligiblePolicy.policyMainPlanCd }}
							</div>
							<div class="leo-text-sm leo-mt-2xs">
								<leo-icon class="leo-mr-xs" type="life-assured" width="14" height="14" color="primary" />
								<span>{{ eligiblePolicy.lifeAssureds ? joinLifeAssureds(eligiblePolicy.lifeAssureds) : '' }}</span>
							</div>
						</div>
						<leo-icon type="arrow-right" height="24" width="24" />
					</div>
					<leo-divider class="custom_divider_cpm" />
					<div class="leo-w-full leo-mx-xs">
						<div class="leo-flex leo-mt-md">
							<div class="leo-w-full leo-text-left leo-text-sm">{{ $t('fo.cpm.selectpolicy.method') }}</div>
							<div class="leo-w-full leo-text-left leo-text-sm">{{ $t('fo.cpm.selectpolicy.premium') }}</div>
						</div>
						<div class="leo-flex">
							<div class="leo-w-full leo-text-left leo-font-semibold code-flag leo-text-lg">
								{{ eligiblePolicy.currentPaymentMethods ? joinAccount(eligiblePolicy.currentPaymentMethods) : '' }}
							</div>
							<div class="leo-w-full leo-text-left leo-font-semibold code-flag leo-text-lg">
								{{ eligiblePolicy.policyNextDueAmount || '0.00' | thousandSeparators }}
								<div class="leo-text-xs leo-inline-block leo-font-normal">
									SGD {{ eligiblePolicy.paymentFrequencyDesc ? eligiblePolicy.paymentFrequencyDesc.toLowerCase() : '' }}
								</div>
							</div>
						</div>
					</div>
				</section>
			</leo-card>
			<!-- for nonEligiblePolicy -->
			<div class="leo-mt-lg" v-if="nonEligiblePolicies.length > 0">
				<div>
					<span class="leo-inline-block leo-text-lg leo-font-semibold leo-text-primary leo-p-xs">
						{{ $t('fo.cpm.selectpolicy.unavailable') }}
					</span>
				</div>
				<div>
					<span class="leo-inline-block leo-text-xs leo-text-accent leo-p-xs">
						{{ $t('fo.cpm.selectpolicy.contact1') }}
						<span class="leo-text-xs leo-text-primary leo-underline" @click="isDialogOpen = true">{{ $t('fo.cpm.selectpolicy.contact2') }}</span>
						{{ $t('fo.cpm.selectpolicy.contact3') }}
					</span>
				</div>
			</div>
			<leo-card class="leo-mb-md" v-for="nonEligiblePolicy in nonEligiblePolicies" v-bind:key="nonEligiblePolicy.policyNo">
				<section class="leo-my-2xs">
					<div class="leo-flex leo-items-start leo-pb-xs">
						<div class="leo-w-full leo-mx-xs">
							<div class="leo-text-accent leo-text-xs">
								<span class="leo-text-xs leo-text-grey-350">{{ nonEligiblePolicy.policyNo }}</span>
								<leo-divider vertical class="leo-h-xs leo-mx-xs" />
								<span class="leo-text-xs leo-text-grey-350">{{ nonEligiblePolicy.policyStartDate | dateFormat }}</span>
							</div>
							<div class="leo-text-lg leo-font-semibold code-flag leo-mt-2xs leo-text-grey-350">
								{{ nonEligiblePolicy.policyMainPlanName ? nonEligiblePolicy.policyMainPlanName : nonEligiblePolicy.policyMainPlanCd }}
							</div>
							<div class="leo-text-sm leo-mt-2xs">
								<leo-icon class="leo-mr-xs" type="life-assured" width="14" height="14" color="grey-350" />
								<span class="leo-text-grey-350 leo-text-xs">{{ nonEligiblePolicy.lifeAssureds ? joinLifeAssureds(nonEligiblePolicy.lifeAssureds) : '' }}</span>
							</div>
						</div>
						<leo-icon type="arrow-right" height="24" width="24" color="grey-350" />
					</div>
					<leo-divider class="custom_divider_cpm" />
					<div class="leo-w-full leo-mx-xs">
						<div class="leo-flex leo-mt-md">
							<div class="leo-w-full leo-text-left leo-text-sm leo-text-grey-350">{{ $t('fo.cpm.selectpolicy.method') }}</div>
							<div class="leo-w-full leo-text-left leo-text-sm leo-text-grey-350">{{ $t('fo.cpm.selectpolicy.premium') }}</div>
						</div>
						<div class="leo-flex">
							<div class="leo-w-full leo-text-left leo-font-semibold code-flag leo-text-lg leo-text-grey-350">
								{{ nonEligiblePolicy.currentPaymentMethods ? joinAccount(nonEligiblePolicy.currentPaymentMethods) : '' }}
							</div>
							<div class="leo-w-full leo-text-left leo-font-semibold code-flag leo-text-lg leo-text-grey-350">
								{{ nonEligiblePolicy.policyNextDueAmount || '0.00' | thousandSeparators }}
								<span class="leo-text-xs leo-inline-block leo-font-normal leo-text-grey-350"> SGD {{ nonEligiblePolicy.paymentFrequencyDesc }} </span>
							</div>
						</div>
					</div>
				</section>
			</leo-card>
		</div>
		<leo-dialog :show="isDialogOpen" containerClass="leo-p-3xl" persistence @dismissed="isDialogOpen = false">
			<div @click="isDialogOpen = false" class="leo-text-right leo--mt-lg leo--mr-md">
				<leo-icon class="leo-cursor-pointer" type="close" />
			</div>
			<div class="leo-text-lg leo-font-semibold leo-mb-md">Customer service</div>
			<div>
				<span @click="pressToCall" class="leo-font-semibold">
					<leo-icon class="leo-cursor-pointer leo-mr-xs" color="primary" type="call" height="16" width="16" />Call
				</span>
				<leo-divider class="leo-h-sm leo-mx-md" vertical />
				<span @click="pressToEmail" class="leo-font-semibold">
					<leo-icon class="leo-cursor-pointer leo-mr-xs" color="primary" type="mail" height="16" width="16" />Email
				</span>
			</div>
		</leo-dialog>
	</section>
</template>

<script>
import UtilService from 'hks-common/services/UtilService';
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex';
import SystemSkeleton from 'utilities/components/Skeletons/SystemSkeleton';

export default {
	name: 'CPMSelectPolicy',
	components: {
		SystemSkeleton
	},
	data() {
		return {
			isDialogOpen: false,
			isCPFWithdrawalIsMore: false,
			isLoading: false
		};
	},
	async mounted() {
		if (window.isMobileDevice) {
			FirebasePlugin.startTrace('Change Payment Method_Policy Selection');
			FirebasePlugin.stopTrace('Change Payment Method_Policy Selection');
		}

		// this.isLoading = true;

		// await this.getChangePaymentMethodPoliciesFromServer();

		// this.isLoading = false;
	},
	methods: {
		...mapMutations('cpmStore', ['updateSelectedPolicy', 'updateSelectedMethodData', 'updateCPFWithdrawal']),
		...mapActions('cpmStore', ['getChangePaymentMethodPoliciesFromServer']),
		navigateToDetails(policy) {
			const self = this;
			self.updateSelectedPolicy(policy);
			self.updateSelectedMethodData({}); // reset selected method data
			if (policy.isElderShield === 'Y') {
				if (policy.CPFWithdrawalLimit < policy.policyNextDueAmount) {
					self.$router.push({ path: '/payment/change-payment-method/cpm-payment-options' });
				} else {
					self.isCPFWithdrawalIsMore = true;
					self.updateCPFWithdrawal(self.isCPFWithdrawalIsMore);
					self.$router.push({ path: '/payment/change-payment-method/cpm-payment-method' });
				}
			} else {
				self.$router.push({ path: '/payment/change-payment-method/cpm-payment-method' });
			}
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
			const fullName = this.$globalService.globalEventDistributor.userFullName;
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
	},
	computed: {
		...mapState('cpmStore', ['eligiblePolicies', 'nonEligiblePolicies', 'agentInfo'])
	}
};
</script>

<style lang="scss" scoped>
.custom_divider_cpm {
	&.leo-divider.leo-divider--color-grey-300:before {
		background: #e0e0e0;
		width: 96% !important;
		margin-left: 7px;
	}
}

.leo-divider.leo-divider--color-secondary:after {
	background: #737373 !important;
}
</style>