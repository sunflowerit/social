# -*- coding: utf-8 -*-
# Copyright 2018 Therp BV <http://therp.nl>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
from openerp import api, models, SUPERUSER_ID, _
from openerp.exceptions import except_orm


class MailMessage(models.Model):
    _inherit = 'mail.message'

    @api.multi
    def check_access_rule(self, operation):
        if operation in ['write', 'unlink']:
            try:
                super(MailMessage, self).check_access_rule(operation)
            except except_orm:
                raise
            else:
                for rec in self:
                    if rec.create_uid.id != self.env.uid and \
                            self.env.uid != SUPERUSER_ID:
                        raise except_orm(
                            _('Permission Denied'),
                            _('Only the owner of this message can edit it.'))
