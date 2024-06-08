document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn gửi biểu mẫu mặc định
const server = serverrr;
    const path = '/upd_user';


    // Lấy giá trị của các trường nhập từ biểu mẫu
     var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const accountName = document.getElementById('account-name').value.trim();
const password = document.getElementById('password').value.trim();
const email = document.getElementById('email').value.trim();
const fullName = document.getElementById('full-name').value.trim();
const dateOfBirth = document.getElementById('date-of-birth').value.trim();
const gender = document.getElementById('gender').value.trim();
const image = document.getElementById('update_file_image').files[0];

    // Kiểm tra nếu tất cả các trường đều rỗng
    if (accountName == '' && password == '' && email == '' && fullName == '' && dateOfBirth == '' && gender == '' && image == undefined) {
        alert('Vui lòng điền thông tin vào ít nhất một trường.');
        return; // Ngăn chặn việc tiếp tục submit biểu mẫu
    }else{
        const formData = new FormData();
formData.append('account_name', accountName);
formData.append('password', password);
formData.append('email', email);
formData.append('full_name', fullName);
formData.append('date_of_birth', dateOfBirth);
formData.append('gender', gender);
formData.append('image', image);
formData.append('id', idUserCookie);
console.log(accountName)
$.ajax({
    url: server + path,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
        console.log(response);
        if (response.sucsses) {
            alert('thêm thành công')
        }else{
            alert('đã thêm')
        }
    },
    error: function(xhr, status, error) {
        console.error('Error while updating data.');
    }
});
    }

    // Tiếp tục xử lý thông tin nhập
    const profileData = {
        accountName,
        password,
        email,
        fullName,
        dateOfBirth,
        gender,
        image
    };



});
document.getElementById("back_home").addEventListener('click',function(event){
event.preventDefault()
    window.location.href = "/setting";
})