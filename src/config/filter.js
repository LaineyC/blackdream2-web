import Vue from 'vue'

Vue.filter('enumFormat', function(value, enumObject) {
    let enumItem = enumObject.of(value);
    return enumItem == null ? "" : enumItem.label;
});


export default Vue.prototype.Filter = {

};