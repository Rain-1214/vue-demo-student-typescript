declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}


declare module 'iview' {
    
    import { CreateElement } from 'vue';

    class Page {}
    class Checkbox {}
    class Modal {}
    class Table {}
    class Select {}
    class Option {}
    class Icon {}
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

    interface MessageConfig {
        content?: string
        render?(h: CreateElement)
        duration?: number
        onClose?: Function
        closable?: boolean
    }

    class Message {
        static loading(config: MessageConfig)
        static info(config: MessageConfig)
        static success(config: MessageConfig)
        static warning(config: MessageConfig)
        static error(config: MessageConfig)
    }
    
}