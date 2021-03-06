import Vue from 'vue'

class Enum{
    of(value){
        for (let k in this) {
            if(this[k].value === value){
                return this[k];
            }
        }
        return null;
    }
}

class EnumItem{
    constructor(value, label){
        this.value = value;
        this.label = label;
    }
}

class UserTypeEnum extends Enum{
    constructor(){
        super();
        this.GENERAL = new EnumItem(1, "一般用户");
        this.DEVELOPER = new EnumItem(2, "开发用户");
    }
}

class TemplateEngineTypeEnum extends Enum{
    constructor(){
        super();
        this.VELOCITY = new EnumItem(1, "Velocity");
        this.VELOCITY.suffix = "vm";
        this.FREEMARKER = new EnumItem(2, "FreeMarker");
        this.FREEMARKER.suffix = "ftl";
    }
}

class GeneratorStatusEnum extends Enum{
    constructor(){
        super();
        this.DEVELOP = new EnumItem(1, "开发");
        this.RELEASE = new EnumItem(2, "发布");
    }
}

class CreationStrategyLanguageEnum extends Enum{
    constructor(){
        super();
        this.JAVASCRIPT = new EnumItem(1, "Javascript");
    }
}

class GeneratorGuideDocTypeEnum extends Enum{
    constructor(){
        super();
        this.MARKDOWN = new EnumItem(1, "Markdown");
    }
}

class DataModelAttributeDisplayTypeEnum extends Enum{
    constructor(){
        super();
        this.DISPLAY_DEFAULT = new EnumItem(1, "默认显示");
        this.HIDDEN_DEFAULT = new EnumItem(2, "默认隐藏");
        this.DISPLAY_ONLY = new EnumItem(3, "强制显示");
    }
}

class DataModelAttributeDataTypeEnum extends Enum{
    constructor(){
        super();
        this.NONE = new EnumItem(1, "NONE");
        this.BOOLEAN = new EnumItem(2, "BOOLEAN");
        this.INTEGER = new EnumItem(3, "INTEGER");
        this.DECIMAL = new EnumItem(4, "DECIMAL");
        this.STRING = new EnumItem(5, "STRING");
        this.DATE = new EnumItem(6, "DATE");
        this.TIME = new EnumItem(7, "TIME");
        this.DATETIME = new EnumItem(8, "DATETIME");
        this.MODEL_REF = new EnumItem(15, "MODEL_REF");
    }
}

export default Vue.prototype.Constant = {
    get UserTypeEnum(){
        return new UserTypeEnum();
    },
    get TemplateEngineTypeEnum(){
        return new TemplateEngineTypeEnum();
    },
    get GeneratorStatusEnum(){
        return new GeneratorStatusEnum();
    },
    get CreationStrategyLanguageEnum(){
        return new CreationStrategyLanguageEnum();
    },
    get GeneratorGuideDocTypeEnum(){
        return new GeneratorGuideDocTypeEnum();
    },
    get DataModelAttributeDisplayTypeEnum(){
        return new DataModelAttributeDisplayTypeEnum();
    },
    get DataModelAttributeDataTypeEnum(){
        return new DataModelAttributeDataTypeEnum();
    },
}