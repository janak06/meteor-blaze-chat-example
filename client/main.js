import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Messages } from '../imports/api/messages';
import {Accounts} from 'meteor/accounts-base'

import './main.html';
import './messages';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
})

Template.chat.onCreated(function helloOnCreated() {

  this.state = new ReactiveDict();
  const handler = Meteor.subscribe('get.messages');
  Tracker.autorun(() => {
    Meteor.subscribe('get.AllUser')
    this.state.set("isLoading", !handler.ready());
  });
});

Template.chat.helpers({ 
  isLoading() {
    const instance = Template.instance();
    return instance.state.get("isLoading ");
  },
  messages () { 
    return Messages.find().fetch(); 
  }, 
  getusername() { 
    return Meteor.user().username 
  }, 
  userList(){
    var list = Meteor.users.find({_id : {$ne : Meteor.userId()}}).fetch()
    return list.length > 0 ? true : false
  },
  formatDate(date) {  
    return date.toLocaleString();
  } 
});

Template.chat.events({ 
  'click .logout-button'(){
    Meteor.logout()
  },
  'submit #chat-form'(event, instance) { 
    event.preventDefault(); 
    const text = event.target.text.value; 
    Meteor.call('messages.insert', text, (err) => { 
      if (err) { alert(err.message);
      } else { 
        event.target.reset() 
      }
    })
  }
})

Template.login.events({ 
  'submit .login-form'(e) {
    e.preventDefault();

    const target = e.target;

    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password, (err,res)=>{
      console.log('err',err);
      console.log('res',res);
    });
  },
 
})
