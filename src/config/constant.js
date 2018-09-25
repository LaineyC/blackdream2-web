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
        this.FREEMARKER = new EnumItem(2, "FreeMarker");
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
}