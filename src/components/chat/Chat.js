import React from 'react';
import UsersList from './UsersList';
import EnterChat from './EnterChat';
import Messages from './Messages';
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
    }

    // creates a random unique identifier and than saves it into local storage
    createUID() {
        var text  = '';
        text += Math.random().toString(36).substr(2, 9);
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
        });
        this.socket.emit('message', {
            username : localStorage.getItem('username'),
            uid : localStorage.getItem('uid'),
            message : message
        });
        this.scrollToBottom();
    }

    scrollToBottom() {
        let messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
        console.log(messages.scrollTop);
    }

    initChat() {
        // set local storage username
        localStorage.setItem('username', this.state.username);

        // chat is ready to go set chat_ready boolean to true
        this.setState({
            chat_ready : true
        });

        // set socket method to client side socket.io with websocket address
        // set query value pair to username and uid
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
                messages : this.state.messages.concat([message])
            });
            this.scrollToBottom();
        }.bind(this));
    }

    render() {
        return (
            <div className="chat-app">
                {this.state.chat_ready ? (
                    <React.Fragment>
                        <UsersList users={this.state.users}/>
                        <Messages
                            sendMessage={this.sendMessage.bind(this)}
                            messages={this.state.messages}
                        />
                    </React.Fragment>
                ) : (
                    <EnterChat
                        setUsername={this.setUsername.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default Chat;