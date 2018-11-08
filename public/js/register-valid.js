// Required for correct work of the validation
$.getScript("/js/Form.js");

$(document).ready(function () {
    /*Initial settings*/

    function autoList(prefix = '') {
        var listInputs = [
            'first_name', 'last_name',
            'gender', 'date_birth',
            'about_user', 'email',
            'country_code', 'password',
            'password_confirmation',
            'accept'
        ],
            arr = [];

        for (var i = 0; i < listInputs.length; i++) arr.push(prefix + listInputs[i]);

        return arr;
    }

    // Create new object for work with form of Auth
    var property = 'border',
        correctType = 'success',
        inCorrectType = 'danger';
    
    register = new Form($('#register'), autoList());
    register.inputs.gender = register.inputs.gender.eq(register.inputs.gender.length - 1);

    // Set rules for checked
    register.setRules({
        first_name: {
            required: true,
            alpha: true,
            length: { min: 2, max: 20 }
        },
        last_name: {
            required: true,
            alpha: true,
            length: {min: 2, max: 20}
        },
        gender: {
            required: true
        },
        date_birth: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        country_code: {
            required: true
        },
        password: {
            required: true,
            length: { min: 6}
        },
        password_confirmation: {
            confirmed: 'password'
        },
        about_user: {
            length: { max: 500 }
        },
        accept: {
            required: true
        }
    });

    // Create blocks for display errors
    register.createHelper(autoList(), {"class": "invalid-feedback"});
    register.createHelper('form', {'class': 'alert alert-danger d-none'});
    // Add this is blocks in DOM
    register.addHelper(autoList(), autoList('inputs.'), 'after');
    register.addHelper('gender', register.inputs.gender.parent().parent(), 'append');
    register.addHelper('accept', register.inputs.accept.parent(), 'append');
    register.addHelper('form', $('.container'), 'prepend');
    /*End Initial settings*/

    /*Start click submit*/
    // When you click start processing data from the form
    $('#register').on('submit', function(e){
        // Stop submit
        e.preventDefault();

        // Hide errors
        register.replaceClass(autoList('helperBlocks.'), 'd-block', 'd-none');

        // remove highlighting
        // register.clearHighlight(autoList('inputs.'), property);
        register.replaceClass(autoList('inputs.'), 'border-danger', 'border-success');

        var fields = {};
        // Get and remember data from the form
        for (var input in register.inputs) {
            if ( input === 'gender' ) {
                fields[input] = register.getInputByName(input);
                continue;
            }
            if ( input === 'accept' ) {
                fields[input] = register.input(input);
                continue;
            }

            fields[input] = register.input(input).val();

            if ( input === 'password' || input === 'password_confirmation' ) continue;

            fields[input] = register.removeExtraSpaces(fields[input]);
            register.input(input).val(fields[input]);
        }

        // Run the validation
        if (!register.validator(fields)) {
            var field;
            for ( field in register.errors) {
                // Show error message
                register.getHelper(field).html(register.errors[field]);
                register.replaceClass('helperBlocks.'+ field, 'd-none', 'd-block');
                // Style for incorrect input
                register.highlight('inputs.'+ field, {'property': property, 'type': inCorrectType});
            }
            // JS validator don't find error
        } else {
            /*Start Ajax*/
            $.ajax({
                type: 'POST',
                url: 'ajax/register',
                data: $(this).serialize(),
                success: function(response){
                    // Check response from server (auth - flag success)
                    if (response.auth) {
                        // Redirect on the link received from the server
                        window.location.replace(response.msg);
                    } else {
                        // Show error message about failure Auth
                        register.getHelper('form').html(response.msg);
                        register.replaceClass('helperBlocks.form', 'd-none', 'd-block');
                        // Clear password input
                        register.input('password').val("");
                        register.input('password_confirmation').val("");
                        register.clearHighlight(['inputs.password', 'inputs.password_confirmation'], property);
                    }
                },
                error: function (response) {
                    var msg = response.responseJSON,
                        err;
                    for (err in msg.errors) {
                        // log(err +" => "+ (typeof err) +" => "+ msg.errors[err]);

                        register.getHelper(err).html(msg.errors[err]);
                        register.replaceClass('helperBlocks.'+ err, 'd-none', 'd-block');
                        // Style for incorrect input
                        register.highlight('inputs.'+ err, {'property': property, 'type': inCorrectType});
                    }
                }
            }); /*End Ajax*/
        } /*End else*/
    }); /*End click submit*/
}); /*End ready*/


// Helpers for debug
function log(param) {
    console.log(param);
}