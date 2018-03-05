declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}


declare module 'iview' {
    
    import { CreateElement } from 'vue';

    class Row {}
    class Col{}
    class Button {}
    class Form {}
    class Input {}
    class FormItem {}
    class Alert {}
    interface NoticeConfig {
        title?: string
        desc?: string
        render?(h: CreateElement)
        duration?: number
        name?: string
        onClose?: Function
    }   
    class Notice{
        static open?(config: NoticeConfig)
        static info?(config: NoticeConfig)
        static success?(config: NoticeConfig)
        static warning?(config: NoticeConfig)
        static error?(config: NoticeConfig)
    }
}