import React from 'react';
import UsersList from './UsersList'
import socketIOClient from 'socket.io-client';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.state = {
            username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
            uid : localStorage.getItem('uid') ? localStorage.getItem('uid') : this.createUID(),
            chat_ready : false,
            users : [],
            messages : [],
            message : ''
        }
    }

    componentDidMount() {
        if(this.state.username.length) {
            this.initChat();
        }
        console.log(this.state);
    }

    // creates a random unique identifier and than saves it into local storage
    createUID() {
        var text  = '';
        text += Math.random().toString(36).substr(2, 9);
        console.log(text);
        localStorage.setItem('uid', text);
        return text;
    }

    setUsername(username, e) {
        this.setState({
            username : username
        }, () => {
            this.initChat();
        })
    }

    sendMessage(message, e) {
        this.setState({
            messages : this.state.messages.concat([{
                username : localStorage.getItem('username'),
                uid : localStorage.getItem('uid'),
                message : message
            }])
        })
    }

    scrollToBottom() {
        let messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    }

    initChat() {
        localStorage.setItem('username', this.state.username);
        this.setState({
            chat_ready : true
        });
        this.socket = socketIOClient('ws://localhost:8989', {
            query : 'username='+this.state.username+'&uid='+this.state.uid
        });

        this.socket.on('updateUsersList', function(users) {
            this.setState({
                users : users
            });
        }.bind(this));

        this.socket.on('message', function (message) {
            this.setState({
                messages: this.state.messages.concat([messages])
            });
            this.scrollToBottom();
        })
    }
    render() {
        return (
            <div className="chat-app">
               <UsersList users={this.state.users}></UsersList>
            </div>
        )
    }
}

export default Chat;