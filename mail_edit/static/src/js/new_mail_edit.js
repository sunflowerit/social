const { useState } = owl.hooks;
const { xml } = owl.tags;
const { Component } = owl;

class MyComponent extends Component {


    setup() {
        this.state = useState({ value: 1 });
    }
    _onClickEdit(ev){

    }

    _onClickDelete(ev){

    }

}
MyComponent.template = 'mail_edit.MyComponent';
