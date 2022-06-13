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

Template.login.helpers({ 
  register(){
    return Template.instance().register.get()
  },
});

Template.login.onCreated(function helloOnCreated() {
  this.register = new ReactiveVar(false);
});

Template.login.events({ 
  'click #register'(){
    Template.instance().register.set(true)
  },
  'click #login'(){
    Template.instance().register.set(false)
  },
  'submit .login-form'(e) {
    e.preventDefault();

    const target = e.target;

    const email = target.email.value;
    const password = target.password.value;

    Meteor.loginWithPassword(email, password, (err,res)=>{
      console.log('err',err);
      console.log('res',res);
    });
  },
  'submit .register-form'(e) {
    e.preventDefault();

    const target = e.target;

    var data ={
      username : target.username.value,
      email : target.email.value,
      password :target.password.value
    }
    console.log(data);
    Accounts.createUser(data, (err,res)=>{
      console.log('err',err);
      console.log('res',res);
    });
  },
})
