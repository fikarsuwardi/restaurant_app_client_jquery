const baseUrl = "http://localhost:3000";
// const baseUrl = "https://restaurant-server-fikar.herokuapp.com/"

// DISPLAY REGISTER FORM
function registerForm() {
  console.log("Halaman Register Form");
  $("#navListFood").hide();
  $("#navListCategory").hide();
  $("#navAddFood").hide();
  $("#navRegister").hide();
  $("#navLogout").hide();
  $("#navLogin").hide().show();
  $("#teksListFood").hide();
  $("#tableListFood").hide();
  $("#teksListCategory").hide();
  $("#tableListCategory").hide();
  $("#teksRegister").hide().show();
  $("#registerForm").hide().show();
  $("#oauth").hide();
  $("#teksLogin").hide();
  $("#loginForm").hide();
  $("#teksAddFood").hide();
  $("#addFood").hide();
  $("#teksEditFood").hide();
  $("#editFood").hide();
}

// FUNCTION REGISTER
function submitRegister() {
  $("#registerForm").on("submit", function (event) {
    event.preventDefault();
    const username = $("input#username").val();
    const email = $("input#email").val();
    const password = $("input#password").val();
    const phoneNumber = $("input#phoneNumber").val();
    const address = $("input#address").val();

    $.ajax({
      url: baseUrl + "/user/register",
      method: "POST",
      data: {
        username: username,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        address: address,
        role: "admin",
      },
    })
      .done((response) => {
        $("#username").val("");
        $("#email").val("");
        $("#password").val("");
        $("#phoneNumber").val("");
        $("#address").val("");
        swal("Register Succes, please login with your email");
        loginForm();
      })
      .fail((err) => {
        swal(err.responseJSON.error.message[0]);
        // console.log(err.responseJSON.error.message, "ini error dari register");
      });
  });
}

// DISPLAY LOGIN FORM
function loginForm() {
  console.log("Halaman Login Form");
  $("#navListFood").hide();
  $("#navListCategory").hide();
  $("#navAddFood").hide();
  $("#navRegister").hide().show();
  $("#navLogout").hide();
  $("#navLogin").hide();
  $("#teksListFood").hide();
  $("#tableTitleListFood").hide();
  $("#tableListFood").hide();
  $("#teksListCategory").hide();
  $("#tableListCategory").hide();
  $("#teksRegister").hide();
  $("#registerForm").hide();
  $("#oauth").hide().show();
  $("#teksLogin").hide().show();
  $("#loginForm").hide().show();
  $("#teksAddFood").hide();
  $("#addFood").hide();
  $("#teksEditFood").hide();
  $("#editFood").hide();
}

// FUNCTION LOGIN FORM
function submitLogin() {
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    const email = $("input#email-login").val();
    const password = $("input#password-login").val();
    $.ajax({
      url: `${baseUrl}/user/login`,
      method: "POST",
      data: {
        email,
        password,
      },
    })
      .done((response) => {
        console.log(response, "ini responses dari submitLogin");
        $("#email-login").val("");
        $("#password-login").val("");
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("id", response.payload.id);
        localStorage.setItem("email", response.payload.email);
        localStorage.setItem("role", response.payload.role);
        home();
      })
      .fail((err) => {
        swal(err.responseJSON.error.message);
      });
  });
}

// DISPLAY HOME
function home() {
  console.log("Halaman Home");
  $("#navListFood").hide().show();
  $("#navListCategory").hide().show();
  $("#navAddFood").hide().show();
  $("#navRegister").hide();
  $("#navLogout").hide().show();
  $("#navLogin").hide();
  $("#teksListFood").show();
  $("#tableListFood").show();
  $("#teksListCategory").hide();
  $("#tableListCategory").hide();
  $("#teksRegister").hide();
  $("#registerForm").hide();
  $("#oauth").hide();
  $("#teksLogin").hide();
  $("#loginForm").hide();
  $("#teksAddFood").hide();
  $("#addFood").hide();
  $("#teksEditFood").hide();
  $("#editFood").hide();
  listFood();
}

// FUNGSI LISTFOOD (HOME)
function listFood() {
  // console.log(localStorage, "localstorage");
  console.log("ini function listfood");
  $("#tableDataFood").empty();
  $.ajax({
    url: baseUrl + "/food",
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .then((response) => {
      const id = +localStorage.id;
      const role = localStorage.role;
      console.log(response, "ini response dari listFood");
      response.data.forEach((element) => {
        let btn = `<a>Unauthorized</a>`;
        if (role === "admin" || id === element.authorId) {
          btn = `<button><a href="#" id="edit-${element.id}">Edit</a></button> <button><a href="#" id="delete-${element.id}">Delete</a></button>`;
        }
        let stringTRow = `
            <tr>
                <td>${element.name}</td> //foodname
                <td>${element.description}</td> //description
                <td>${element.price}</td> //price
                <td>
                    <img src="${element.imgUrl}" style="width: 100%;display: block;
                    margin-left: auto;
                    margin-right: auto;">
                </td> 
                <td>${element.User.username}</td> //authorId
                <td>${element.Category.name}</td> //category
                <td style="text-align: center;">
                    ${btn}
                </td>
            </tr>
        `;
        $("#tableDataFood").append(stringTRow);
        // DELETE BUTTON
        $(`#delete-${element.id}`).on("click", function (event) {
          event.preventDefault();
          $.ajax({
            url: `${baseUrl}/food/${element.id}`,
            method: "DELETE",
            headers: {
              access_token: localStorage.getItem("access_token"),
            },
          })
            .done((response) => {
              swal("Success Delete Food");
              home();
            })
            .fail((err) => console.log(err, "ini error delete"));
        });
        // EDIT BUTTON
        $(`#edit-${element.id}`).on("click", function (event) {
          event.preventDefault();
          $("#teksListFood").hide();
          $("#tableListFood").hide();
          $("#teksEditFood").show();
          $("#editFood").show();
          $.ajax({
            url: baseUrl + "/category",
            method: "GET",
            headers: {
              access_token: localStorage.getItem("access_token"),
            },
          }).done((response) => {
            console.log(response, "ini response edit");
            const category = response.category;
            category.forEach((el) => {
              $("#categoryId-edit").append(
                `<option value = "${el.id}" >${el.name}</option>`
              );
            });
            $("#editFood").on("submit", function (event) {
              event.preventDefault();
              const name = $("input#name-edit").val();
              const description = $("input#description-edit").val();
              const price = $("input#price-edit").val();
              const imgUrl = $("input#imgUrl-edit").val();
              const categoryId = $("select#categoryId-edit").val();
              $.ajax({
                url: `${baseUrl}/food/${element.id}`,
                method: "PUT",
                headers: {
                  access_token: localStorage.getItem("access_token"),
                },
                data: {
                  name: name,
                  description: description,
                  price: +price,
                  imgUrl: imgUrl,
                  categoryId: +categoryId,
                },
              })
                .then((response) => {
                  $("#name-edit").val("");
                  $("#description-edit").val("");
                  $("#price-edit").val("");
                  $("#imgUrl-edit").val("");
                  $("select#categoryId-edit").val("");
                  swal("Success Edit Food");
                  home();
                })
                .fail((err) => {
                  swal(err.responseJSON.error.message[0]);
                  // console.log(err.responseJSON.error.message);
                });
            });
          });
        });
      });
    })
    .fail((err) => {
      console.log(err);
    });
}

// DISPLAY LIST CATEGORY
function category() {
  console.log("Halaman List Category");
  $("#navListFood").hide().show();
  $("#navListCategory").hide().show();
  $("#navAddFood").hide().show();
  $("#navRegister").hide();
  $("#navLogout").hide().show();
  $("#navLogin").hide();
  $("#teksListFood").hide();
  $("#tableListFood").hide();
  $("#teksListCategory").show();
  $("#tableListCategory").show();
  $("#teksRegister").hide();
  $("#registerForm").hide();
  $("#oauth").hide();
  $("#teksLogin").hide();
  $("#loginForm").hide();
  $("#teksAddFood").hide();
  $("#addFood").hide();
  $("#teksEditFood").hide();
  $("#editFood").hide();
  listCategory();
}

// FUNGSI LISTFOOD (HOME)
function listCategory() {
  $("#tableDataCategory").empty();
  $.ajax({
    url: baseUrl + "/category",
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      console.log(response, "ini response dari listCategory");
      response.category.forEach((element) => {
        let stringTRow = `
            <tr>
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.createdAt}</td>
                <td>${element.updatedAt}</td>
            </tr>
        `;
        $("#tableDataCategory").append(stringTRow);
      });
    })
    .fail((err) => {
      console.log(err);
    });
}

// DISPLAY ADD FOOD
function addFoodForm() {
  $("#navListFood").hide().show();
  $("#navListCategory").hide().show();
  $("#navAddFood").hide().show();
  $("#navRegister").hide();
  $("#navLogout").hide().show();
  $("#teksListFood").hide();
  $("#tableListFood").hide();
  $("#teksListCategory").hide();
  $("#tableListCategory").hide();
  $("#teksRegister").hide();
  $("#registerForm").hide();
  $("#oauth").hide();
  $("#teksLogin").hide();
  $("#loginForm").hide();
  $("#teksAddFood").hide().show();
  $("#addFood").hide().show();
  $("#teksEditFood").hide();
  $("#editFood").hide();
}

function submitAddFood() {
  $.ajax({
    url: baseUrl + "/category",
    method: "GET",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  }).done((response) => {
    console.log(response, "ini response dari category submitAddFood");
    const category = response.category;
    category.forEach((el) => {
      $("#categoryId").append(
        `<option value = "${el.id}" >${el.name}</option>`
      );
    });
  });
  
  $("#addFood").on("submit", function (event) {
    event.preventDefault();
    const name = $("input#name").val();
    const description = $("input#description").val();
    const price = $("input#price").val();
    const imgUrl = $("input#imgUrl").val();
    const categoryId = $("select#categoryId").val();

    $.ajax({
      url: baseUrl + "/food",
      method: "POST",
      headers: {
        access_token: localStorage.getItem("access_token"),
      },
      data: {
        name,
        description,
        price,
        imgUrl,
        // authorId:
        categoryId: categoryId,
      },
    })
      .then((response) => {
        $("#name").val("");
        $("#description").val("");
        $("#price").val("");
        $("#imgUrl").val("");
        $("select#categoryId").val("");
        swal("Success Add New Food");
        home();
      })
      .fail((err) => {
        swal(err.responseJSON.error.message[0]);
        // console.log(err.responseJSON.error.message);
      });
  });
}

// FUNCTION LOGOUT
function logout() {
  $("#navLogout").on("click", function (event) {
    event.preventDefault();
    let email = localStorage.getItem("email")
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(email, done => {
            console.log('consent revoked');
            localStorage.removeItem("access_token");
            localStorage.removeItem("id");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            console.log(done, "succes logout");
        });
        swal("Succes Logout")
    loginForm();
  });
}

// DOCUMENT READY
$(document).ready(function () {
  if (localStorage.getItem("access_token")) {
    home(); // READ
    submitAddFood(); // CREATE, UPDATE, DELETE
  } else {
    loginForm();
  }

  submitLogin(); // LOGIN
  submitRegister(); // REGISTER
  logout(); // LOGOUT
  

  // KLIK NAVBAR REGISTER
  $("#navRegister").on("click", function (event) {
    event.preventDefault();
    registerForm();
  });

  // KLIK NAVBAR LOGIN
  $("#navLogin").on("click", function (event) {
    event.preventDefault();
    loginForm();
  });

  // KLIK NAV LIST FOOD
  $("#navListFood").on("click", function (event) {
    event.preventDefault();
    home();
  });

  // KLIK NAV LIST CATEGORY
  $("#navListCategory").on("click", function (event) {
    event.preventDefault();
    category();
  });

  // KLIK NAV ADD FOOD
  $("#navAddFood").on("click", function (event) {
    event.preventDefault();
    addFoodForm();
  });

  // GOOGLE LOGIN
      function handleCredentialResponse(response) {
        console.log(
          "Encoded JWT ID token: " + response.credential,
          "liat dong"
        );
        $.ajax({
          method: "POST",
          url: baseUrl + "/user/login-google",
          headers: {
            credential: response.credential,
          },
        })
          .done((response) => {
            console.log(response, "ini response");
            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("id", response.dataUser.id);
            localStorage.setItem("email", response.dataUser.email);
            localStorage.setItem("role", response.dataUser.role);
            home();
          })
          .fail((err) => {
            console.log(err);
          });
      }

      window.onload = function () {
        google.accounts.id.initialize({
          client_id:
            "97034013937-4ojhlo9i1gv9q66li46jkfqajvf1tbt6.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large" } // customization attributes
        );
        google.accounts.id.prompt(); // also display the One Tap dialog
      };
    
}); // batas document ready

console.log("Sedang terconnect.....");
