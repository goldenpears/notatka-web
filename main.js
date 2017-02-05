var Notatka = Backbone.Model.extend({
  defaults: {
    title: "new note"
  }
});

var NotatkaCollection = Backbone.Firebase.Collection.extend({
  model: Notatka,
  url: "https://notatka-49184.firebaseio.com"
});

// Individual note item
var noteView = Backbone.View.extend({
  tagName:  "li",
  template: _.template("<%= title %>"),
  initialize: function() {
    this.listenTo(this.model, "change", this.render);
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

// The view for the entire application
var AppView = Backbone.View.extend({
  el: $('#notatka'),
  initialize: function() {
    this.list = this.$("#note-items"); // the list to append to
    this.listenTo(this.collection, 'add', this.addOne);
  },
  addOne: function(note) {
    var view = new noteView({model: note});
    this.list.append(view.render().el);
  }
});

//submit by pressing enter
 $('input').keyup(function(e){
   if(e.keyCode == 13){
      $(this).trigger('enter');
   }
 });

// The main view for the application
var AppView = Backbone.View.extend({
  el: $('#notatka'),
  events: {
    "click #add-note" : "createNewNote",
    "enter #add-note": "createNewNote",
  },
  initialize: function() {
    this.list = this.$("#note-items");
    // Input for new notes
    this.input = this.$("#add-note");
    this.listenTo(this.collection, 'add', this.addOne);
  },
  addOne: function(note) {
    var view = new noteView({model: note});
    this.list.append(view.render().el);
  },
  createNewNote: function(e) {
    // Ensure input is not empty
    if (!this.input.val()) { return; }
    this.collection.create({title: this.input.val()});
    this.input.val('');
  }
});

function initFirebase() {
  var collection = new NotatkaCollection();
  var app = new AppView({ collection: collection });
}

$(function() { initFirebase() });
