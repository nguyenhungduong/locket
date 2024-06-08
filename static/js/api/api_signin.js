const button_login = document.getElementById('login-form');

function signInPost(server, path) {
    const username_login = document.getElementById('login-username').value.trim();
    const password_login = document.getElementById('login-password').value.trim();
    console.log("nguoi dung"+username_login)
    const formData = new FormData();
    formData.append('username', username_login);
    formData.append('password', password_login);
    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
            console.log(response);
            window.location.href = '/post'; // Chuyển hướng đến URL khác
            /*for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);

    }*/
        },
        error: function(xhr, status, error) {
            console.error('Request failed. error:', error);
/*            console.error('Request failed. Status:', status);
        console.error('Request failed. xhr:', xhr);*/
            alert("Đăng nhập tài khoản mật khẩu không đúng");
        }
    });
}

function click_up(event) {
    const server = serverrr;
    const path = '/signin';
   
    event.preventDefault(); // Ngăn chặn hành động mặc định của nút submit nếu event tồn tại


    // Kiểm tra xem cả hai trường có giá trị không
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
    console.log(username,password)
    if (!username || !password) {
        // Nếu có trường nào đó không hợp lệ, hiển thị cảnh báo bằng alert()
        alert("Vui lòng nhập thông tin tài khoản và mật khẩu không có khoảng trắng .");
    } else {

    }

    //Kiểm tra xem cả hai trường có giá trị không
    if (!username || !password) {
        // Nếu có trường nào đó không có giá trị, hiển thị cảnh báo
        /*alert("Vui lòng nhập đủ thông tin tài khoản và mật khẩu.");*/
    } else {
    signInPost(server, path);
}
    
}

button_login.addEventListener('submit', click_up);

