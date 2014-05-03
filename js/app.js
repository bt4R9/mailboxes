$(function() {

    Backbone.sync = function(method, model, success, error) {
        success();
    };

    var MessageModel = Backbone.Model.extend({
        defaults: {
            subject: '...fake subject...',
            firstline: '...fake firstlime...',
            date: (new Date()).toDateString()
        }
    });

    var MessagesCollection = Backbone.Collection.extend({
        model: MessageModel
    });

    var MessageView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#message-view').html()),
        events: {
            'click span.delete': 'remove',
            'click .js-edit-subject': 'editSubject',
            'click .js-edit-firstline': 'editFirstline',
            'click .js-remove': 'delete'
        },
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'remove', this.unrender);
        },
        render: function(mid) {
            $(this.el)
                .addClass('list-group-item')
                .addClass('mid-' + mid)
                .html(this.template(this.model.attributes));
            return this;
        },
        unrender: function() {
            $(this.el).remove();
        },
        remove: function() {
            this.model.destroy();
        },
        check: function() {
            $(this.el).find('input')[0].checked = true;
        },
        uncheck: function() {
            $(this.el).find('input')[0].checked = false;
        },
        editSubject: function() {
            this.model.set({
               'subject': prompt('New subject'),
            });
        },
        editFirstline: function() {
            this.model.set({
                'firstline': prompt('New firstline'),
            });
        },
        delete: function() {
            this.unrender();
            this.remove();
        }
    });

    var MessagesView = Backbone.View.extend({
        el: $('body'),
        initialize: function() {
            _.bindAll(this, 'render');

            this.messages = new MessagesCollection();
            this.listenTo(this.messages, 'add', this.appendItem);

            this.counter = 0;
            this.render();
            this.views = [];
            for (var i = 0; i < 10; i++) {
                this.addItem();
            }
        },
        render: function() {
            $(this.el).append('<ul class="list-group">');
        },
        addItem: function() {
            var message = new MessageModel();
            this.messages.add(message);
        },
        appendItem: function(messageModel) {
            this.counter++;
            messageModel.set('num', this.counter);

            var messageView = new MessageView({
                model: messageModel
            });

            this.views.push(messageView);
            $('ul.list-group', this.el).append(messageView.render(this.counter).el);
        }
    });

    var messagesView = window.messagesView = new MessagesView;

    $('.js-check-all').on('click', function() {
        messagesView.views.forEach(function(view) {
            view.check();
        })
    });

    $('.js-uncheck-all').on('click', function() {
        messagesView.views.forEach(function(view) {
            view.uncheck();
        })
    });

    $('.js-remove-selected').on('click', function() {
        messagesView.views.forEach(function(view) {
            if (view.$el.find('input').is(':checked')) {
                view.remove();
                view.unrender();
            }
        })
    });

    $('.js-add-message').on('click', function() {
        messagesView.addItem();
    })

});
