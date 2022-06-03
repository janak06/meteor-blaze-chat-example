import { Meteor } from 'meteor/meteor';
import {Messages} from '../imports/api/messages'

Meteor.startup(() => {
  // code to run on server at startup
  Messages.remove()
});
