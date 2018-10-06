import Vue from 'vue'

export default Vue.prototype.Method = {

    generateId() {
        return Math.floor(Math.random() * 1000000000000000);
    },

    newIncrementer(){
         return {
             increment: 1,
             next(){
                 return this.increment++;
             }
         }
    }
};