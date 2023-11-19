# Copyright Therp BV (https://therp.nl)
# License LGPL-3.0 or later (http://www.gnu.org/licenses/Lgpl).

{
    "name": "Message Edit",
    "summary": "Edit, Delete or Move messages to any model",
    "version": "14.0.1.0.0",
    "category": "Social Network",
    "website": "https://github.com/OCA/social",
    "author": "Therp BV, Odoo Community Association (OCA)",
    "license": "LGPL-3",
    "application": False,
    "installable": True,
    "depends": [
        "mail",
        "web",
    ],
    "data": [
        "security/mail_edit_security.xml",
        "views/assets.xml",
        "views/compose_message.xml",
    ],
    "data": ["demo/mail_edit_demo.xml"],
    "qweb": [
        "static/src/components/message/mail_edit.xml",
    ],
}
