/* © 2014-2017 Sunflower IT <www.sunflowerweb.nl>*/
odoo.define("mail_edit/static/src/js/mail_edit.js",
    function (require) {
        "use strict";
        const components = {
            Message: require("mail/static/src/components/message/message.js"),
        };
        const Dialog = require('web.Dialog');
        const {patch} = require("web.utils");
        const session = require('web.session');

        patch(components.Message, "mail_edit.main", {

            async _onClickEdit(ev) {
            const self = this;

            ev.stopPropagation();
            const action = await this.rpc({
                route: "/web/action/load",
                params: {action_id: "mail_edit.mail_edit_action"},
            });
            session.user_has_group('mail_edit.group_mail_edit_editor').then(function(has_group) {
                if(has_group) {
                    action.res_id = self.message.id;
                    self.env.bus.trigger("do-action", {action: action});

                } else {
                Dialog.alert(self, "Sorry, you are not allowed to do that. Please contact the Administrator", "options");
                }
            });

            },
            async _onClickDelete(ev) {

                ev.stopPropagation();
                var self = this;
                ev.preventDefault();
                var msg_id = this.message.id;

               session.user_has_group('mail_edit.group_mail_edit_editor','mail_edit.group_mail_edit_superuser').then(function(has_group) {
                        if(has_group) {
                        self.rpc({
                            model: 'mail.message',
                            method: 'unlink',
                            args: [[msg_id]],

                        });
                        } else {
                        Dialog.alert(self, "Sorry, you are not allowed to do that.Please contact the Administrator", "options");
                        }
                    });
            },

        });
    }
);


