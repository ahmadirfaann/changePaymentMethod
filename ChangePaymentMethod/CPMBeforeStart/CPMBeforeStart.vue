<template src="./CPMBeforeStart.html"></template>
<style lang="scss" scoped src="./CPMBeforeStart.scss"></style>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import SystemSkeleton from 'utilities/components/Skeletons/SystemSkeleton';

export default {
  name: 'CPMBeforeStart',
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
    this.isLoading = true;
    await self.clearAllState();
    
    try {
			await self.getAgentInfoFromServer();
      await self.getChangePaymentMethodPoliciesFromServer();
      
      if (self.eligiblePolicies && self.eligiblePolicies.length === 0) {
        //self.$router.push({ name: 'cpm-no-policy' });
        self.$router.push({ name: 'cpm-no-policy' });  //change back before merge
      } else {
        //self.$router.push({ name: 'cpm-select-policy' });
        self.$router.push({ name: 'cpm-select-policy' });  //change back before merge
      }
    } catch (error) {
      console.error(error)
			self.$router.push({ path: '/gc/tabs/payment-services' });
    } finally {
			// self.$globalService.globalComponent.hideLoader();
      this.isLoading = false;
    }
  },
  computed: {
    ...mapState('cpmStore', ['eligiblePolicies']),
  },
  methods: {
    ...mapActions('cpmStore', ['clearAllState', 'getChangePaymentMethodPoliciesFromServer', 'getAgentInfoFromServer']),
  }
}
</script>
