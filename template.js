module.exports = { 
  createHtml: () => {
    // You asked for it.
    let regex = `([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])`;
    let body = createForm();
    let title = 'New User Registration';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <link rel="stylesheet" href="/assets/index.css" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue_grey-indigo.min.css" /> 
          <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js"></script>
          <script>
          $(function() {
            $.validator.addMethod(
              "email",
              function(value, element, regexp) {
                  let re = new RegExp(regexp);
                  return this.optional(element) || re.test(value);
              },
              "Please enter a valid email address per RFC 5322."
            );
            let validForm = () => {
              let validFields = $('#username').val() && $('#email').val() && 
                $('#password').val() && $('#confirmPassword').val();
              if (validator.valid() && validFields) {
                $('#submitBtn').prop('disabled', false);
              } else {
                $('#submitBtn').prop('disabled', true);
              }
            };
            let validator = $("form[name='registration']").validate({
              // Specify validation rules
              rules: {
                username: "required",
                email: {
                  required: true,
                  email: \`${regex}\`
                },
                password: {
                  required: true,
                },
                confirmPassword: {
                  required: true,
                  equalTo: "#password",
                }
              },
              // Specify validation error messages
              messages: {
                username: "Please enter a username",
                password: {
                  required: "Please provide a password",
                },
                confirmPassword: {
                  required: "Please provide a password",
                },
                email: "Please enter a valid email address"
              },
              // Make sure the form is submitted to the destination defined
              // in the "action" attribute of the form when valid
              submitHandler: function(form) {
                form.submit();
              }
            });
            $('#password, #confirmPassword, #email, #username').on('blur', () => {
              // Add a settimeout 0 to allow the form to know it's state before validation.
              setTimeout(() => {
                validForm();
              }, 0);
            });
            $('#password').on('blur', () => {
              $('#password').valid();
            });
            $('#confirmPassword').on('blur', () => {
              $('#confirmPassword').valid();
            });
            $('#email').on('blur', () => {
              $('#email').valid();
            });
            $('#username').on('blur', () => {
              $('#username').valid();
            });
          });
          </script>
        </head>
        <body>
        <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
              <!-- Title -->
              <span class="mdl-layout-title">Create New Account</span>
              <!-- Add spacer, to align navigation to the right -->
              <div class="mdl-layout-spacer"></div>
              <!-- Navigation. Hide it in small screens. -->
              <nav class="mdl-navigation mdl-layout--large-screen-only">
                <a class="mdl-navigation__link" href="">Home</a>
              </nav>
            </div>
          </header>
          <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">Create New Account</span>
            <nav class="mdl-navigation">
              <a class="mdl-navigation__link" href="">Home</a>
            </nav>
          </div>
          <main class="mdl-layout__content">
            <div class="page-content">
              <div id="root" class="main-div">${body}</div>
            </div>
          </main>
        </div>
        </body>
      </html>`;
  }
}


function createTextField({name, id, password = false, maxLength = null}) {
  let type = password ? `type="password"` : `type="text"`;
  let length = maxLength ? `maxlength="${maxLength}"` : '';
  return `<div class="text-field mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input class="text-input input-padding mdl-textfield__input" ${type} ${length} id="${id}" name="${id}">
    <label class="input-padding mdl-textfield__label" for="${id}">${name}</label>
  </div>`;
}

function createForm() {
  return `<div class="card-wide mdl-card mdl-shadow--2dp">
  <div class="mdl-card__title">
    <h2 class="mdl-card__title-text">Welcome</h2>
  </div>
  <div class="mdl-card__supporting-text">
    <form action="#" class="form" name='registration'>
      <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--12-col">${createTextField({name: "Username", id: "username", maxLength: 15})}</div>
      </div>
      <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--12-col">${createTextField({name: "Email", id: "email"})}</div>
      </div>
      <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--12-col">${createTextField({name: "Password", id: "password", password: true})}</div>
      </div>
      <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--12-col">${createTextField({name: "Confirm Password", id: "confirmPassword", password: true})}</div>
      </div>
    </form>
  </div>
  <div class="mdl-card__actions mdl-card--border">
  <button class="mdl-button mdl-js-button mdl-js-ripple-effect" id='submitBtn' disabled>
    Submit
  </button>
  </div>
</div>`;
}