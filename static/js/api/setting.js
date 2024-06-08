
function get_user(server,path){
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(idUserCookie)
$.ajax({
    url: server+path,
    type: 'GET',             
    data: {
        id_user: idUserCookie 
    },
    success: function(response) {
        // Hành động sau khi nhận được phản hồi thành công từ Flask
        console.log(response); // In ra phản hồi từ Flask (nếu có)
        display_user(response)
    },
    error: function(xhr, status, error) {
        // Xử lý lỗi (nếu có)
        console.error(error); // In ra lỗi (nếu có)
    }
});
}
function display_user(user){

let id_user = user[0];
let img_avarta=user[1];
let name = user[2];

// Gán dữ liệu Base64 vào thuộc tính src của phần tử img
$('#image_user1').attr('src', 'data:image/jpeg;base64,' + img_avarta);

// Gán dữ liệu Base64 vào thuộc tính src của phần tử img
$('#image_user2').attr('src', 'data:image/jpeg;base64,' + img_avarta);
$('#name_user').append(name);

/*const ulElement = document.getElementById("my_post");
const liElements = ulElement.querySelectorAll("li");
console.log(liElements)

  // Loop through each li element and assign a unique ID
  for (let i = 0; i < liElements.length; i++) {
     // Generate unique ID with a prefix
    console.log(" id ",id_user)
    liElements[i].setAttribute("id", id_user);
  }*/

  // Target the element with the class "my-single-class"
  const element = $(".my_post");

  // Check if the element exists
  if (element.length > 0) {
    // Generate a unique ID
     // You can customize the prefix if needed
    // Add the generated ID to the element using attr()
    element.attr("id", id_user);
  } else {
    console.warn("Element with class 'my-single-class' not found.");
  }

}
$(document).ready(function() {
    // Thực hiện các hành động của bạn ở đây khi trang được tải
    const server = serverrr;
    const path = '/getsetting';
    get_user(server,path)
});

document.addEventListener("DOMContentLoaded", function() {
    const updateButton = document.getElementById("update");
    updateButton.addEventListener("click", function() {
        window.location.href = '/update_user';
    });
});