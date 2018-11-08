// Required for correct work of the validation
$.getScript("/js/Form.js");

$(document).ready(function () {
    /*Initial settings*/

    // Styles for align center of the Form
    var body = $('body');
    body.css({
        "paddingTop": "40px",
        "paddingBottom": "40px"
    });
    body.addClass('d-flex align-items-center');

    // Create new object for work with form of Auth
    formAuth = new Form($('#auth'), ['email', 'password']);

    // Set rules for checked
    formAuth.setRules({
        email: {
            required: true,
            email: true
        },
        password: {
            required: true
        }
    });

    var property = 'border.text',
        correctType = 'success',
        inCorrectType = 'danger';

    // Create blocks for display errors
    formAuth.createHelper(['email', 'password'], {"class": "invalid-feedback"});
    formAuth.createHelper('form', {'class': 'alert alert-danger d-none'});
    // Add this is blocks in DOM
    formAuth.addHelper(['email', 'password'], ['inputs.email', 'inputs.password'], 'after');
    formAuth.addHelper('form', $('.container'), 'prepend');
    /*End Initial settings*/

    /*Start click submit*/
    // When you click start processing data from the form
    $('#auth').on('submit', function(e){
        // Stop submit
        e.preventDefault();

        // Hide errors
        formAuth.replaceClass(['helperBlocks.email', 'helperBlocks.password', 'helperBlocks.form'], 'd-block', 'd-none');

        // remove highlighting
        formAuth.clearHighlight(['inputs.email', 'inputs.password'], property);

        // Get and remember data from the form
        var fields = {
            "email": formAuth.input('email').val(),
            "password": formAuth.input('password').val(),
        };

        // Run the validation
        if (!formAuth.validator(fields)) {
            settings = {'property': property};
            // Email incorrect
            if ("email" in formAuth.errors) {
                // Show error message
                formAuth.getHelper('email').html(formAuth.errors.email);
                formAuth.replaceClass('helperBlocks.email', 'd-none', 'd-block');
                // Style for incorrect input
                settings.type = inCorrectType;
            } else settings.type = correctType;

            formAuth.highlight('inputs.email', settings);

            // Password incorrect
            if ("password" in formAuth.errors) {
                // Show error message
                formAuth.getHelper('password').html(formAuth.errors.password);
                formAuth.replaceClass('helperBlocks.password', 'd-none', 'd-block');
                // Style for incorrect input
                settings.type = inCorrectType;
            } else settings.type = correctType;

            formAuth.highlight('inputs.password', settings);
        // JS validator don't find error
        } else {
            /*Start Ajax*/
            $.ajax({
                type: 'POST',
                url: 'ajax/login',
                data: $(this).serialize(),
                success: function(response){
                    // Check response from server (auth - flag success)
                    if (response.auth) {
                        // Redirect on the link received from the server
                        window.location.replace(response.msg);
                    } else {
                        // Show error message about failure Auth
                        formAuth.getHelper('form').html(response.msg);
                        formAuth.replaceClass('helperBlocks.form', 'd-none', 'd-block');
                        // Clear password input
                        formAuth.input('password').val("");
                        formAuth.clearHighlight('inputs.password', property);
                    }
                },
                error: function (response) {
                    var msg = response.responseJSON;
                    settings = {'property': property};
                    // Email incorrect
                    if ("email" in msg.errors) {
                        // Show error message
                        formAuth.getHelper('email').html(msg.errors.email);
                        formAuth.replaceClass('helperBlocks.email', 'd-none', 'd-block');
                        // Style for incorrect input
                        settings.type = inCorrectType;
                    } else settings.type = correctType;

                    formAuth.highlight('inputs.email', settings);

                    // Email incorrect
                    if ("password" in msg.errors) {
                        // Show error message
                        formAuth.getHelper('password').html(msg.errors.password);
                        formAuth.replaceClass('helperBlocks.password', 'd-none', 'd-block');
                        // Style for incorrect input
                        settings.type = inCorrectType;
                    } else settings.type = correctType;

                    formAuth.highlight('inputs.password', settings);
                }
            }); /*End Ajax*/
        } /*End else*/
    }); /*End click submit*/
}); /*End ready*/


// Helpers for debug
function log(param) {
    console.log(param);
}