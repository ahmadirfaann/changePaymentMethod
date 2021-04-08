<template src="./CPBeforeStart.html"></template>
<style lang="scss" scoped src="./CPBeforeStart.scss"></style>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import SystemSkeleton from 'utilities/components/Skeletons/SystemSkeleton';

export default {
  name: 'CPBeforeStart',
  components: {
    SystemSkeleton
  },
  data () {
    return {
      isLoading: false
    }
  },
  async mounted () {
    const self = this;
    // self.$globalService.globalComponent.showLoader();
    await self.clearAllState();
    this.isLoading = true;

		if (_.isEmpty(self.customerStatusInfo)) {
			await self.getCustomerStatusInfoFromServer();
		}

		try {

			await self.getAgentInfoFromServer();
      await self.getChangePaymentFreqPolicies();
      
			if (self.eligiblePolicies.length === 0) {
				self.$router.push({ name: 'cp-no-policy' });
			} else {
				self.$router.push({ name: 'cp-select-policy' });
			}
		} catch (error) {
			self.$router.push({ path: '/gc/tabs/payment-services' });
		} finally {
			// self.$globalService.globalComponent.hideLoader();
      this.isLoading = false;
		}
  },
  computed: {
    ...mapState('cpFrequency', ['customerStatusInfo', 'eligiblePolicies']),
  },
  methods: {
    ...mapActions('cpFrequency', ['getCustomerStatusInfoFromServer', 'getAgentInfoFromServer', 'getChangePaymentFreqPolicies', 'clearAllState']),
  }
}
</script>
