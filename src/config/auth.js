import Vue from 'vue'

let bodyField = Symbol("bodyField");
let isCertifiedField = Symbol("isCertifiedField");
export default Vue.prototype.Auth = {

    [isCertifiedField]: false,
    get isCertified(){
        return this[isCertifiedField];
    },
    [bodyField]:{
        userId: null,

        type: null,

        nickname:null,

        iconFileId: null,

        email: null,

        username: null
    },
    get body(){
       return this[bodyField];
    },
    set body(body){
        this[bodyField] = body;
        if(body == null || body === undefined){
            this[isCertifiedField] = false;
        }
        else{
            this[isCertifiedField] = true;
        }
    },
};