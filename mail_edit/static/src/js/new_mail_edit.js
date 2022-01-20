/* © 2014-2017 Sunflower IT <www.sunflowerweb.nl>*/
odoo.define("mail_edit/static/src/js/new_mail_edit.js",
    function (require) {
        "use strict";

        const components = {
            Message: require("mail/static/src/components/message/message.js"),
        };
        const {patch} = require("web.utils");


        patch(components.Message, "mail_edit.main", {
            async _onClickEdit(ev) {
                ev.stopPropagation();
                const action = await this.rpc({
                    route: "/web/action/load",
                    params: {action_id: "mail_edit.mail_edit_action"},
                });
                action.res_id = this.message.id;
                this.env.bus.trigger("do-action", {action: action}); 
            },
            async _onClickDelete(ev) {
                ev.stopPropagation();
                var self = this;
                ev.preventDefault();
                var msg_id = this.message.id;

                await this.rpc({
                    model: 'mail.message',
                    method: 'unlink',
                    args: [[msg_id]],
                });

            },

        });
    }
);
