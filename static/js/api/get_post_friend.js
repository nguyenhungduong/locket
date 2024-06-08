function get_post_friend(server, path,id_friend) {
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log("đã click")
    $.ajax({
        url: server + path,
        type: 'GET',
        data: {
            id_user: idUserCookie,
            id_fr:id_friend
        },
        success: function (response) {
            // Hành động sau khi nhận được phản hồi thành công từ Flask
            console.log(response); // In ra phản hồi từ Flask (nếu có)
            display_post(response)
        },
        error: function (xhr, status, error) {
            // Xử lý lỗi (nếu có)
            console.error(error); // In ra lỗi (nếu có)
        }
    });
}

const myList = document.getElementById('userss');
myList.addEventListener('click', function(event) {
  const clickedItem = event.target; // Lấy phần tử được click
  if (clickedItem.tagName === 'LI') { // Kiểm tra xem phần tử có phải là thẻ `li` hay không
    // Thực hiện các hành động của bạn ở đây khi trang được tải
    console.log("Bạn đã nhấp vào:", clickedItem.id); // Xuất nội dung văn bản của thẻ `li`
    const server = serverrr;
    const path = '/get_post_data';
    get_post_friend(server, path,clickedItem.id)
    ; // Xuất nội dung văn bản của thẻ `li`

  }
});
// Chọn phần tử bằng id 'my_post'
const myPost = document.querySelector('.my_post');

// Thêm sự kiện click cho phần tử
myPost.addEventListener('click', function(event) {
  console.log("Đã click",this.id);

  // Định nghĩa server (cần thay đổi 'serverrr' thành giá trị đúng)
  const server = serverrr;
  const path = '/get_post_data';
  
  // Gọi hàm get_post_friend với các tham số
  get_post_friend(server, path, this.id);
});
