/* © 2014-2017 Sunflower IT <www.sunflowerweb.nl>*/

 odoo.define('mail_edit.mail_edit', function (require) {
"use strict";

    /*var chatter = require('mail.Chatter');
    chatter.include({
        start: function () {
            var result = this._super.apply(this, arguments);
            this.thread.on('message_forward', this, this.thread.on_message_forward);
            return result;
        }
    });*/

    var Message = require('mail.model.Message');
    var Dialog = require('web.Dialog');
    var ThreadField = require('mail.ThreadField');
    var ThreadWidget = require('mail.widget.Thread');
    var session = require('web.session');

    ThreadField.include({

        start: function () {
            var result = this._super.apply(this, arguments);
            var self = this;
            this._threadWidget.on('message_removed', this, function(message_id) {
                // TODO: why does the message re-render after deletion
                self._threadWidget.removeMessageAndRender(message_id, self._documentThread, {});
            });
            this._threadWidget.on('message_edited', this, function(message_id) {
                /*self._documentThread._messages = _.reject(
                    self._documentThread._messages,
                    function(m) { return m.getID() === message_id; }
                );*/
                //self._documentThread._messages = [];
                //self._fetchAndRenderThread();
                /*var message = _.find(self._documentThread._messages, function (msg) {
                    return msg.getID() === message_id;
                });
                var mailBus = self.call('mail_service', 'getMailBus');
                mailBus.trigger('update_message', message);
                return;*/

                //var message = _.find(self._messages, function (msg) {
                //    return msg.getID() === data.message_id;
                //});
                var message = self.call('mail_service', 'getMessage', message_id);
                self._rpc({
                    model: 'mail.message',
                    method: 'message_format',
                    args: [message_id],
                    context: session.user_context,
                })
                .then(function (messagesData) {
                    _.each(messagesData, function (messageData) {
                        // TODO: call processBody for emojis
                        // or recreate the message altogether
                        message._body = messageData.body;
                    });
                    self._fetchAndRenderThread();
                });

            });
            return result;
        }

    });

     ThreadWidget.include({

        events: _.defaults({
            "click .o_mail_edit": "_onClickMessageEdit",
            "click .o_mail_delete": "_onClickMessageDelete",
        }, ThreadWidget.prototype.events),

        _onClickMessageEdit: function(event) {
            var self = this;
            var do_action = self.do_action,
                msg_id = $(event.currentTarget).data('message-id');

            self._rpc({
                route: "/web/action/load",
                params: {
                    action_id: "mail_edit.mail_edit_action",
                },
            })
            .done(function (action) {
                // TODO: why doesnt this return directly, like in the mail.activity wizard
                console.log('done');
                action.res_id = msg_id;
                self.do_action(action, {
                    on_close: function () {
                        console.log('close');
                        self.trigger("message_edited", msg_id);
                        //location.reload();
                        //self.trigger_up('refresh_on_fly');
                        //this.reload.bind(this)

                        /*var mailBus = this.call('mail_service', 'getMailBus');
                        mailBus.trigger('update_message', this);*/

                        //self.removeMessageAndRender(msg_id, self, {});
                        // self.trigger_up('reload', { fieldNames: ['message_ids'], keepChanges: false});
                        //self.trigger.bind(self, 'need_refresh')
                    },
                });
            });
        },

        _onClickMessageDelete: function(event, options) {
            var self = this;
            event.stopPropagation();
            event.preventDefault();
            var msg_id = $(event.currentTarget).data('message-id');
            Dialog.confirm(
                self,
                _t("Do you really want to delete this message?"), {
                    // TODO: why do we need to do this ourselves isnt there a function for it
                    confirm_callback: function () {
                        return self._rpc({
                            model: 'mail.message',
                            method: 'unlink',
                            args: [[msg_id]],
                        })
                        .then(function() {
                            self.trigger("message_removed", msg_id);
                        });
                    },
                }
            );

        }

    });

    Message.include({
        init: function (parent, data) {
            this._super.apply(this, arguments);
            this.is_superuser = data.is_superuser || false;
            this.is_author = data.is_author || false;
        },
    });

});
