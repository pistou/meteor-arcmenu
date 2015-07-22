if (Meteor.isClient) {
    Template.demo.onRendered(function() {
        $(".arcmenu").arcmenu();
    });
}
