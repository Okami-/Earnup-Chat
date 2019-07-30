import React from 'react';

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users : props.users
        }
    }

    render() {
        return (
            <div className="user col-xs-12 col-sm-12 col-md-4 col-lg-2">
                <i className="fa fa-user"/>
            </div>
        )
    }
}

export default UsersList;