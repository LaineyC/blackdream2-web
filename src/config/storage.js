import Vue from 'vue'

let tupleClipboard = {};
export default Vue.prototype.Storage = {

    getTupleClipboard(dataModelId){
        let clipboard = tupleClipboard[dataModelId];
        if(!clipboard){
            clipboard = tupleClipboard[dataModelId] = [];
        }
        return clipboard;
    }

};