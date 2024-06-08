const button_register = document.getElementById('register-form');

function applyCSS(cssData) {
    var container = document.getElementById("container");
    container.classList.remove("right-panel-active"); // Xóa lớp right-panel-active
}

function check_user(server,path,usern){
    $.ajax({
    url: server + path,
    type: 'GET',
    data:{
        username:usern
    },
    success: function (response) {
        // Hành động sau khi nhận được phản hồi thành công từ Flask
        console.log(response.sucsses)
        if(response.sucsses === 0){
            alert('đã có username');
        }else{
       const paths = '/signup';
            signUpPost(server, paths)
        }
    },
    error: function (xhr, status, error) {
        // Xử lý lỗi (nếu có)
        console.error(error); // In ra lỗi (nếu có)
    }
});}


function signUpPost(server, path) {
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const fullNames = document.getElementById("register-full_name").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const dob = document.getElementById("register-date_of_birth").value.trim();
/*    console.log("nguoi dung"+username)
    console.log("email"+email)*/
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('full_name', fullNames);
    formData.append('date_of_birth', dob);
    formData.append('gender', gender);
    formData.forEach(function(value, key){
    console.log(key);
});
    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
            applyCSS(response);
            console.log(response);
            document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("register-full_name").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("register-date_of_birth").value = "";
            for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);

}
    alert("Đăng ký thành công");

        },
        error: function(xhr, status, error) {
            console.error('Request failed. error:', error);
console.error('Request failed. Status:', status);
        console.error('Request failed. xhr:', xhr);
        
        }
    });
}
function calculateAge(birthdayString) { // Hàm tính tuổi
    const birthday = new Date(birthdayString);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // Ngày hiện tại - Ngày sinh = Tuổi
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
 function click_upp(event) {
    if (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của nút submit nếu event tồn tại
    }else{
        console.log("loi event")
    }
    const server = serverrr;
    const path = '/check_username';
    // Lấy các giá trị từ các trường nhập liệu
    const username = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const fullName = document.getElementById("register-full_name").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const dob = document.getElementById("register-date_of_birth").value.trim();


    //Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ hoa và chữ thường
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    //tài khoản không được chứa khoảng trắng
    const usernamePattern = /^\S+$/;

if (!usernamePattern.test(username)) {
        alert('Tên tài khoản không được cách');
         // Ngăn chặn việc gửi biểu mẫu
        return;
    }

    if (!passwordPattern.test(password)) {
        alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ hoa và chữ thường');
         // Ngăn chặn việc gửi biểu mẫu
        return;
    }
    
    const age = calculateAge(dob);
    console.log(age)
    // Kiểm tra xem tuổi có đủ 12 không
    if (age < 12) {
        alert('Bạn phải đủ 12 tuổi để đăng ký');
        // Ngăn chặn việc gửi biểu mẫu
        return;
    }

    // Kiểm tra xem có trường nào chưa được điền không
    if (!username || !password || !email || !fullName || gender === "none" || !dob) {
        // Hiển thị thông báo
        alert("thông tin của bạn có khoảng trắng và chưa nhập ký tự.");
        // Ngăn chặn việc submit form
        return false;
    
}
else{
    check_user(server, path,username);
}
    
}


button_register.addEventListener('submit', click_upp);


