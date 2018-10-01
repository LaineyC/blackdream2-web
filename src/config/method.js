import Vue from 'vue'

export default Vue.prototype.Method = {

     generateId () {
        return Math.floor(Math.random() * 10000);
    }
};