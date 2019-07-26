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
    },
    validator: {
        transform: function(value) {
            return (value==='') ? null : value
        }
    },
    cookie:{
        set: function (name, value, days) {
            let date = new Date();
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days);
            window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
        },
        get: function (name) {
            let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        },
        delete: function (name) {
            this.set(name, '', -1);
        }
    }
};