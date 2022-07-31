import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import {Accounts} from 'meteor/accounts-base'

import './messages.html';
import { Messages } from '../imports/api/messages';

Template.message.onCreated(function helloOnCreated() {
  this.otherUserId = new ReactiveVar();
  Tracker.autorun(() => {
    Meteor.subscribe('get.user');
    Meteor.subscribe('get.messages');
    setTimeout(() => {
      $('.chat-history').scrollTop(1000000);
    }, 1000);
    $('#chat-history').scrollTop($('#chat-history').prop('scrollHeight'));
  });
});

Template.message.helpers({
  equalCheack: function(id){
		return Meteor.userId() == id
	},
  getUser(){
    return Meteor.users.find({_id : {$ne : Meteor.userId()}}).fetch()
  },
  otherUserId(){
    return Template.instance().otherUserId.get()
  },
  getusername(userId) { 
    if (userId) { 
      const user = Meteor.users.findOne({_id : userId}); 
       return user?.username || null; 
    } 
  }, 
  messages(){
    return Messages.find({$or:[{senderId: Meteor.userId(),receiverId:Template.instance().otherUserId.get()},{receiverId: Meteor.userId(),senderId:Template.instance().otherUserId.get()}]}).fetch()
  },
  formatDate(date) {  
    return date.toLocaleString();
  } 
});

Template.message.events({ 
  'click #emoji-button'(){
    var el = document.getElementById("msg");
    el.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        console.log('1111');
        event.preventDefault();
      }
    });
    const button = document.querySelector('#emoji-button');

    const picker = new EmojiButton();
    picker.on('emoji', emoji => {
      var a = $('#msg').val()
      a += emoji
      $('#msg').val(a)
        // document.querySelector('#msg').value += emoji;
      });
      picker.togglePicker(button);
  },
  'click .get-message'(evt,instance){
		var id = $(evt.currentTarget).attr('data-index');
    instance.otherUserId.set(id)
    console.log('id',id);
	},
  'submit #send-message' (event,instance) {
		event.preventDefault();
    console.log('222');
		var message = event.target.msg.value;
    var otherUser = instance.otherUserId.get();
		Meteor.call('addMessage',otherUser, message, (error) => {
			$('#msg').val('');
			setTimeout(() => {
				$('.chat-history').scrollTop(1000000);
			}, 1000);
			$('#chat-history').scrollTop($('#chat-history').prop('scrollHeight'));
		});
	},
})
