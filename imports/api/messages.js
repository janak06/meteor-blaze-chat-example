import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Messages =  new Mongo.Collection('messages')

Meteor.methods({
    'messages.insert'(text) { 
        check(text, String);
        if(!Meteor.userId()){
            throw new Meteor.Error("not-authorized")
        }
        Messages.insert({ 
            text,
            userId : Meteor.userId(),
            createdAt: new Date()
        })
    },
    'addMessage': function(oId,value){
        Messages.insert({ 
            msg : value,
            senderId : Meteor.userId(),
            receiverId: oId,
            createdAt: new Date()
        })
      },
})

if ( Meteor.isServer ) {
    Meteor.publish('get.messages', function publishTasks() {
        return Messages.find({});
      });

      Meteor.publish('get.user', function publishTasks() {
        return Meteor.users.find({_id : {$ne : this.userId}});
      });
      Meteor.publish('get.AllUser', function publishTasks() {
        return Meteor.users.find();
      });
  }
