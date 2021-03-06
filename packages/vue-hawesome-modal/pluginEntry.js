import NotifyConfigBuilder from "./lib/notify/notifyConfigBuilder";
import DialogConfigBuilder from "./lib/dialog/dialogConfigBuilder";
import HawesomeLoader from './src/components/Loader/HawesomeLoader'
import HawesomeDialog from './src/components/Dialog/HawesomeDialog'
import HawesomeNotify from './src/components/Notify/HawesomeNotify'

import waitingCountModule from "./src/modules/waitingCountModule";
import loaderModule from "./src/modules/loaderModule";
import themeModule from "./src/modules/themeModule";
import dialogModule from "./src/modules/dialogModule";
import notifyModule from "./src/modules/notifyModule";

const isWellDefinedFunction = (func) => {
    return func && typeof func === "function";
};

export default {
    install(Vue, options) {
        if (!options || !options.store) {
            throw new Error('Please initialise plugin with a Vuex store.')
        }

        var $storeFromApp = options.store;

        $storeFromApp.registerModule('hWaitingCount', waitingCountModule, { preserveState: false })
        $storeFromApp.registerModule("hTheme", themeModule, { preserveState: false })
        $storeFromApp.registerModule("hLoader", loaderModule, { preserveState: false })
        $storeFromApp.registerModule("hDialog", dialogModule, { preserveState: false })
        $storeFromApp.registerModule("hNotify", notifyModule, { preserveState: false })

        if (options.themeColor)
            $storeFromApp.commit('hTheme/setColor', options.themeColor)
        if (options.loaderSetting)
            $storeFromApp.commit('hLoader/setGlobalSetting', options.loaderSetting)
        if (options.dialogSetting)
            $storeFromApp.commit('hDialog/setGlobalSetting', options.dialogSetting)
        if (options.notifySetting)
            $storeFromApp.commit('hNotify/setGlobalSetting', options.notifySetting)

        Vue.component('h-loader', HawesomeLoader);
        Vue.component('h-dialog', HawesomeDialog);
        Vue.component('h-notify', HawesomeNotify);

        Vue.mixin({
            computed: {
                hGlobalThemeColor() {
                    return $storeFromApp.getters['hTheme/globalThemeColor']
                }
            }
        })

        Object.defineProperty(Vue.prototype, "$h", {
            get() {
                return {
                    theme: {
                        setColor(color) {
                            $storeFromApp.commit('hTheme/setColor', color)
                        }
                    },

                    loader: {
                        on(loaderText) {
                            $storeFromApp.dispatch("hLoader/on", loaderText);
                        },
                        off() {
                            $storeFromApp.dispatch("hLoader/off");
                        },
                        wait(handler, duration, loaderText) {
                            this.on(loaderText)
                            handler()
                            return new Promise((rsv) => {
                                setTimeout(() => {
                                    this.off()
                                    rsv()
                                }, duration);
                            })
                        },
                        close() {
                            $storeFromApp.dispatch("hLoader/close");
                        }
                    },

                    dialog: {
                        talk(val, func) {
                            var builder = new DialogConfigBuilder(val);
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._talk(builder);
                        },
                        _talk(val) {
                            if (val && typeof val === "string") {
                                return $storeFromApp.dispatch("hDialog/talk", new DialogConfigBuilder(val));
                            }
                            else if (val instanceof DialogConfigBuilder) {
                                return $storeFromApp.dispatch("hDialog/talk", val);
                            }
                            else {
                                throw new Error("val should be a string or instance of DialogConfigBuilder.");
                            }
                        },
                        hangUp() {
                            $storeFromApp.dispatch('hDialog/hangUp');
                        }
                    },

                    notify: {
                        info(val, func) {
                            var builder = new NotifyConfigBuilder(val);
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._push(builder.setType("info"));
                        },
                        success(val, func) {
                            var builder = new NotifyConfigBuilder(val);
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._push(builder.setType("success"));
                        },
                        warning(val, func) {
                            var builder = new NotifyConfigBuilder(val);
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._push(builder.setType("warning"));
                        },
                        error(val, func) {
                            var builder = new NotifyConfigBuilder(val);
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._push(builder.setType("error"));
                        },
                        promise(val, func) {
                            var builder = new NotifyConfigBuilder(val).set("type", $storeFromApp.state.hTheme.color).set("icon", "");
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._push(builder.setTimeout(0));
                        },
                        push(val, func) {
                            var builder = new NotifyConfigBuilder(val).set("type", $storeFromApp.state.hTheme.color).set("icon", "");
                            if (isWellDefinedFunction(func)) { func.call(this, builder); }
                            return this._push(builder);
                        },
                        _push(val) {
                            if (val && typeof val === "string") {
                                return $storeFromApp.dispatch("hNotify/push", new NotifyConfigBuilder(val));
                            }
                            else if (val instanceof NotifyConfigBuilder) {
                                return $storeFromApp.dispatch("hNotify/push", val);
                            }
                            else {
                                throw new Error("val should be a string or instance of NotifyConfigBuilder.");
                            }
                        },
                        resolveAllNotify() {
                            $storeFromApp.commit('hNotify/resolveAllNotify')
                        },
                        clearAllNotify() {
                            $storeFromApp.commit('hNotify/clearAllNotify')
                        },
                    }
                }
            }
        })

    }
}