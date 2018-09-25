<template>
    <div id="generator-data-manage">
        <div class="menu-list">
            <Menu mode="horizontal" theme="light" active-name="1">
                <MenuItem name="1">
                    <Icon type="ios-navigate"></Icon>
                    保存
                </MenuItem>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-stats" />
                        工具
                    </template>
                    <MenuGroup title="使用">
                        <MenuItem name="2-1">新增和启动</MenuItem>
                        <MenuItem name="2-2">活跃分析</MenuItem>
                        <MenuItem name="2-3">时段分析</MenuItem>
                    </MenuGroup>
                    <MenuGroup title="留存">
                        <MenuItem name="2-4">用户留存</MenuItem>
                        <MenuItem name="2-5">流失用户</MenuItem>
                    </MenuGroup>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-stats" />
                        新建
                    </template>
                    <MenuGroup title="使用">
                        <MenuItem name="3-1">新增和启动</MenuItem>
                        <MenuItem name="3-2">活跃分析</MenuItem>
                        <MenuItem name="3-3">时段分析</MenuItem>
                    </MenuGroup>
                    <MenuGroup title="留存">
                        <MenuItem name="3-4">用户留存</MenuItem>
                        <MenuItem name="3-5">流失用户</MenuItem>
                    </MenuGroup>
                </Submenu>
            </Menu>
        </div>
        <div class="split-box">
            <Split v-model="split">
                <div slot="left" class="left-split-pane">
                    <div class="left-split-inner-pane">
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                        <Tree :data="data4" show-checkbox multiple></Tree>
                    </div>
                </div>
                <div slot="right" class="right-split-pane">
                    <Tabs type="card" closable @on-tab-remove="handleTabRemove" :animated="false">
                        <TabPane label="标签一" v-if="tab0">标签一的内容</TabPane>
                        <TabPane label="标签二" v-if="tab1">标签二的内容</TabPane>
                        <TabPane label="标签三" v-if="tab2">标签三的内容</TabPane>
                    </Tabs>
                </div>
            </Split>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GeneratorDataManage",
        data () {
            return {
                tab0: true,
                tab1: true,
                tab2: true,
                split: 0.15,
                data4: [
                    {
                        title: 'parent 1',
                        expand: true,
                        selected: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1',
                                        disabled: true
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1',
                                        checked: true
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>

<style scoped lang="less">
    #generator-data-manage{
        position: absolute;
        top: 64px;
        bottom: 0;
        left: 0;
        width: 100%;
        .menu-list{
            position: absolute;
            top: 0;
            width: 100%;
        }
        .split-box{
            position: absolute;
            top: 60px;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        .left-split-pane{
            padding: 0;
            height: 100%;
            overflow: hidden;
            .left-split-inner-pane{
                height: 100%;
                margin-right: -17px;
                overflow-y: auto;
            }
        }
        .right-split-pane{
            padding: 10px;
            height: 100%;
            overflow-y: auto;
        }
    }
</style>