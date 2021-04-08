<template src="./CPMCcDetail.html"></template>
<style lang="scss" src="./CPMCcDetail.scss"></style>

<script>

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
export default {
    name: 'CPMCcDetail',

    data() {
        return {
            validated1: false,
            validated2: false,
            validated3: false,
            // emailValue: '',
            // emailValidRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            currentMethod: {
                name: 'GIRO',
                no: '1234567812341234'
            },
            currentPaymentMethods:undefined,
            cardHolderName: '',
            cardNumber: '',
            cardNumberRules:[],
            expiryDateRules:[],
            expiryDate: '',
            payRemaining: '',
            payFull: '',
            amount: '',
            nameValue:'',
            nricValue:'',
            isAllowProceed: false,
            CCdigit: 0,
            ocbcCreditNumber: [],
            geCashFloNumber: [],
            creditCardRegex: new RegExp("0-9]{12}(?:[0-9]{3})?$"),
            cardHolderNameRegex: "",
            cardErrorType: '',
            msgCardNumber:'',
            statusCardNumber:false,
			msgExpiryDate:'',
            statusExpiryDate:false,
			ccType: '',
            eligiblePolicy: undefined,
            ccNo: '',
            isVisa: false,
            isMaster: false,
            tempCardNumber: '',
            customErrorIconFlag: false,
            customErrorIconFlagExpDate: false,
        };
    },
	watch: {
		cardNumber: function (newData, oldData){
			this.statusCardNumber = false
			this.msgCardNumber=''
		},
		expiryDate: function (newData, oldData){
			this.statusExpiryDate = false
			this.msgExpiryDate=''
			this.debouncedExpiryDate()
		}
	},
	created() {
        this.remainingPremium = this.selectedPolicy.policyNextDueAmount - this.selectedPolicy.CPFWithdrawalLimit;
        this.isCPF = this.selectedPolicy.currentPaymentMethods.find(el => el.paymentMethodCd === 'CPF') ? true : false
    // this.isNoDetail = this.selectedPolicy.currentPaymentMethods.find(el => _.isUndefined(el.accountNo)) ? true: false
        this.isNoDetail = this.selectedPolicy.currentPaymentMethods.filter(el => el.accountNo === '').length > 1 ? true: false

		// this.debouncedCardNumber = _.debounce(this.validateCardNumberInput, 500)
		this.debouncedExpiryDate = _.debounce(this.validateExpiryDateInput, 500)

		this.eligiblePolicy = _.cloneDeep(_.filter(this.eligiblePolicies.filter(el =>  el.isElderShield === 'N'), el => el.policyMainPlanName !== this.selectedPolicy.policyMainPlanName));

        this.selectedPolicy.currentPaymentMethods.forEach(cc => {
            if ((_.includes(cc.paymentMethodDesc, 'Credit') || _.includes(cc.paymentMethodDesc, 'CREDIT')) && cc.accountNo) {
                let j = cc.accountNo.match(/.{1,4}/g)
                this.ccNo = j.join(' ')
            }
        });
    },
    computed: {
        ...mapState('cpmStore', ['selectedPolicy', 'eligiblePolicies','selectedMethodData','selectedCreditCard', 'isPayExcess']),
        allowProceed() {

            if (this.cardNumber && this.cardHolderName && this.expiryDate) {
				if(this.statusCardNumber == true || this.statusExpiryDate == true){
					return false
				}
				else{
					return true
				}
            } else {
                return false
            }
        },
    },
    mounted() {
        if (this.selectedMethodData && !_.isEmpty(this.selectedMethodData)) {
            this.cardHolderName = this.selectedMethodData?.cardHolderName
            this.cardNumber = this.selectedMethodData?.cardNumber
            this.expiryDate = this.selectedMethodData?.expiryDate
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
        ...mapMutations('cpmStore', ['updateSelectedMethodData']),
		validateExpiryDateInput(){

			if (this.cardNumber.indexOf('?') === -1) {
				if(this.expiryDate && this.expiryDate.length > 0){
					const current_date = new Date();
					const cleanExpiryDate=this.expiryDate?.replace(" / ","")
					const cleanedExpDate=`20${cleanExpiryDate.substring(2,4)}-${cleanExpiryDate.substring(0,2)}-01`
					cleanedExpDate&&console.log(`clean date is ${cleanExpiryDate}`)
					console.log(`parseInt ${cleanExpiryDate.substring(0,2)}`)
						if(parseInt(cleanExpiryDate.substring(0,2))>12||parseInt(cleanExpiryDate.substring(0,2))<1) {
							this.msgExpiryDate =`Please check that the expiry date is correct.`
							this.statusExpiryDate= true
                            this.customErrorIconFlagExpDate=true
							return
						}
						else{
							const current_date = new Date();
							const cleanExpiryDate=this.expiryDate?.replace(" / ","")
							const cleanedExpDate=`20${cleanExpiryDate.substring(2,4)}-${cleanExpiryDate.substring(0,2)}-01`
							const convertDate=new Date(cleanedExpDate)
							convertDate&&console.log(`clean date is ${convertDate}`)

							if(current_date>convertDate) {
								this.msgExpiryDate = `Please enter a valid expiry date that has not yet passed.`
								this.statusExpiryDate= true
                                this.customErrorIconFlagExpDate=true
								return
							}
							else {
								this.statusExpiryDate= false
                                this.customErrorIconFlagExpDate=false
								return
							}
						}
				}
				else{
					this.msgExpiryDate = 'This field is required'
					this.statusExpiryDate= true
                    this.customErrorIconFlagExpDate=false
					return
				}
			}
		},
        onClickNext() {
            const self = this;
            for(let i=1;i<4;i++){
                this.toValidateCC(i);
            };
            if(self.validated1 && self.validated2 && self.validated3){
                if (self.selectedPolicy.isElderShield === 'N' && !_.isEmpty(this.eligiblePolicy)) {
                    let selectedPaymentMethod = {
                        paymentMethod: self.selectedCreditCard.paymentMethod,
                        cardHolderName: self.cardHolderName,
                        cardNumber: self.cardNumber,
						cardType: self.ccType,
                        expiryDate: self.expiryDate,
                    }
                self.updateSelectedMethodData(selectedPaymentMethod)
                self.$router.push({ path: '/payment/change-payment-method/cpm-select-more-policies' });
            }else {
                let selectedPaymentMethod = {
                    paymentMethod: self.selectedCreditCard.paymentMethod,
                    cardHolderName: self.cardHolderName,
                    cardNumber: self.cardNumber,
					cardType: self.ccType,
                    expiryDate: self.expiryDate,
                    amount: self.selectedCreditCard.amount,
                    payRemaining: self.isPayExcess,
                    payFull: self.selectedCreditCard.payFull
                }
                self.updateSelectedMethodData(selectedPaymentMethod)
                self.$router.push({ path: '/payment/change-payment-method/cpm-confirmation' });
            }
}

        },
        submit() {
            this.$refs.form.validate();
            if (this.validated) alert('Form submitted!');
        },
        changeIcon(payload){
            if (_.isUndefined(payload) || _.isEmpty(payload)) {
                return ''
            }
            if (_.startsWith(payload, "4")&& (this.selectedCreditCard.paymentMethod === 'OCBC Credit Card' || this.selectedCreditCard.paymentMethod === 'Credit Card' || this.selectedCreditCard.paymentMethod === 'OCBC GE Cashflo Card')){
				this.ccType = 'VISA'
                return 'clr-visa'
            } else if ((_.startsWith(payload, "2") || _.startsWith(payload, "5")) && (this.selectedCreditCard.paymentMethod === 'OCBC Credit Card'|| this.selectedCreditCard.paymentMethod === 'Credit Card'|| this.selectedCreditCard.paymentMethod === 'OCBC GE Cashflo Card')){
				this.ccType = 'MASTER'
                return 'clr-master'
            }
        },
        testing(){

            console.log(`this.cardHolderName is ${this.cardHolderName}`)

            const regex = new RegExp(/^[-@/.'’‘a-zA-Z]+([\ A-Za-z-@/.'’‘]+)*$/)
            const lastChar=this.cardHolderName.charAt(this.cardHolderName.length-1)
            console.log(`last char ${lastChar}`)
            if (!regex.test(this.cardHolderName) ) {
                console.log(`failed validation`)
                const newName= this.cardHolderName.slice(0, -1)
                console.log(`new name ${newName}`)
                this.cardHolderName= newName
            } else {
                //this.formData.accountName = value
                            console.log(`passed validation`)

            }

        },
        joinAccount(payment) {
        let paymentDesc = _.map(payment, 'paymentMethodDesc');

        return _.join(paymentDesc, ', ');
        },
        handleBlur(e) {
		if (window.isMobileDevice && device.platform === 'iOS') {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
		}
        },
        handleFocus(e) {
            // do nothing just declared
        },
        validateCardNumber(){

            this.ocbcCreditNumber = this.selectedPolicy.creditCardPrefixs.filter(el => {
                return el.ocbcCardType === 'OCBC credit card'
            }).map(p => p.prefix);

            this.geCashFloNumber = this.selectedPolicy.creditCardPrefixs.filter(el => {
                return el.ocbcCardType === 'OCBC GE Cashflo card'
            }).map(p => p.prefix);

            console.warn('ocbcCardType', this.ocbcCreditNumber);
            console.warn('his.geCashFloNumber ', this.geCashFloNumber);
            // let CCd = this.selectedCreditCard.paymentMethod === 'OCBC Credit Card' ? 7 : 9
				this.cardErrorType = this.selectedCreditCard.paymentMethod === 'OCBC Credit Card' ? 'OCBC Visa or Mastercard' : this.selectedCreditCard.paymentMethod === 'OCBC GE Cashflo Card' ?'OCBC GE Cashflo card' : 'Visa or Mastercard card'

				if(this.cardNumber && (this.cardNumber.length > 0)){
					if(this.cardNumber && (this.cardNumber.length == 19)){

                        this.tempCardNumber = this.cardNumber.split(' ').join('');
                        // console.warn('this.cardNumber', cardNumber);

						const cardChoice = this.selectedCreditCard.paymentMethod === 'OCBC Credit Card' ? this.ocbcCreditNumber.find(x=>x==this.tempCardNumber.substring(0,6))
						: this.selectedCreditCard.paymentMethod === 'OCBC GE Cashflo Card' ? this.geCashFloNumber.find(x=>x==this.tempCardNumber.substring(0,6))
						: this.cardNumber.startsWith("2") || this.cardNumber.startsWith("4") || this.cardNumber.startsWith("5") ? true : false

						if(cardChoice){
							return true

						}
						else{
                            this.customErrorIconFlag = true
							return 'Please check that the '+this.cardErrorType+' number is correct'


						}
					}
					else{
                        this.customErrorIconFlag = true
						return 'Please check that the '+this.cardErrorType+' number is correct'

					}
				} else{
                    this.customErrorIconFlag = false
                    return 'This field is required'
                }
            
        },
        toValidateCC(number){    
        let self = this;
        let form = _.get(self.$refs, `${'form' + number}`);
            form.validate();
        },
    }
};
</script>
