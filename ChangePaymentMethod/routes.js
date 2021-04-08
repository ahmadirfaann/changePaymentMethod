import ChangePaymentMethod from './ChangePaymentMethod'
import CPMBeforeStart from './CPMBeforeStart/CPMBeforeStart'
import CPMNoPolicy from './CPMNoPolicy/CPMNoPolicy'
import CPMAcknowledgement from './CPMAcknowledgement/CPMAcknowledgement'
import CPMSelectPolicy from './CPMSelectPolicy/CPMSelectPolicy'
import CPMSelectMorePolicies from './CPMSelectMorePolicies/CPMSelectMorePolicies'
import CPMConfirmationPage from './CPMConfirmationPage/CPMConfirmationPage'
import CPMPaymentMethod from './CPMPaymentMethod/CPMPaymentMethod'
import CPMCcDetail from './CPMCcDetail/CPMCcDetail'
import CPMSettingGiro from './CPMSettingGiro/CPMSettingGiro'
import CPMPaymentOptions from './CPMPaymentOptions/CPMPaymentOptions'

const routes = [
  {
    path: '/payment/change-payment-method',
    component: ChangePaymentMethod,
    children: [
      {
        path: '',
        redirect: 'cpm-before-start'
      },
      {
        meta: { screenName: '' },
        name: 'cpm-before-start',
        path: 'cpm-before-start',
        component: CPMBeforeStart
      },
      {
        meta: { screenName: '' },
        name: 'cpm-no-policy',
        path: 'cpm-no-policy',
        component: CPMNoPolicy
      },
      {
        meta: { screenName: '' },
        name: 'cpm-acknowledgement',
        path: 'cpm-acknowledgement',
        component: CPMAcknowledgement
      },
      {
        meta: { screenName: '' },
        name: 'cpm-select-policy',
        path: 'cpm-select-policy',
        component: CPMSelectPolicy
      },
      {
        meta: { screenName: '' },
        name: 'cpm-select-more-policies',
        path: 'cpm-select-more-policies',
        component: CPMSelectMorePolicies
      },
      {
        name: 'cpm-confirmation',
        path: 'cpm-confirmation',
        component: CPMConfirmationPage
      },
      {
        name: 'cpm-payment-method',
        path: 'cpm-payment-method',
        component: CPMPaymentMethod
      },
      {
        meta: { screenName: '' },
        name: 'cpm-cc-detail',
        path: 'cpm-cc-detail',
        component: CPMCcDetail
      },
			{
				meta: { screenName: '' },
				name: 'cpm-setting-giro',
				path: 'cpm-setting-giro',
				component: CPMSettingGiro
			},
      {
        meta: { screenName: '' },
				name: 'cpm-payment-options',
				path: 'cpm-payment-options',
				component: CPMPaymentOptions
      }
    ]
  }
]

export default routes;
