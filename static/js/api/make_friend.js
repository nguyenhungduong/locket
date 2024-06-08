function notification_friend(server,id){
    const path='/notification_friend'
    const formData = new FormData();
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(idUserCookie)
    console.log(id);
    formData.append('id_user', id);
    formData.append('id_user_send', idUserCookie);
    formData.append('noti_form', "makeFriend");
    formData.append('noti_text', "Gửi kết bạn");

    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response.sucsses)},
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("gửi thông báo kết bạn thất bại");
        }
    });

}
function cr_friend(server, path,id) {
    const formData = new FormData();
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(idUserCookie)
    console.log(id);
    formData.append('id_friend', id);
    formData.append('id_client', idUserCookie);
    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response['sucsses'])
            if (response['sucsses']==1) {
    // Thực hiện khi condition1 là true
    notification_friend(server,id)
                alert("gui ket ban thanh cong");
                
} else if (response['sucsses']==0) {
    // Thực hiện khi condition1 là false và condition2 là true
    alert("gui ket ban that bai");
} else {
    // Thực hiện khi cả condition1 và condition2 đều là false
    alert("da gui ket ban");
}
        },
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("tìm bạn không thành công");
        }
    });
}

function setupFriendButtonClickEvent() {
    // Lấy tất cả các button có class "add-friend-btn"
    var addFriendButtons = document.querySelectorAll('.add-friend-btn');

    // Gắn sự kiện click cho mỗi button
    addFriendButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
        var buttonId = button.id;
        if (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của nút submit nếu event tồn tại
    } else {
        console.log("loi event")
    }
    const server = serverrr;
    const path = '/makeFriend';
    cr_friend(server, path,buttonId);
        });
    });
}
function see_noti(server, path){
const sender_id = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
    const formData = new FormData();
    formData.append('id_user', sender_id);
    formData.append('form', 'makeFriend');
    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
            console.log(response);
            if(response.sucsses){
                console.log("xem thông báo")
            }else{
                console.log("chưa thông báo")
            }
            ; // Chuyển hướng đến URL khác
            
        },
        error: function(xhr, status, error) {
            console.error('Request failed. error:', error);
/*            console.error('Request failed. Status:', status);
        console.error('Request failed. xhr:', xhr);*/
            alert("Đăng nhập tài khoản mật khẩu không đúng");
        }
    });
}
$(document).ready(function() {
            const server = serverrr;
            console.log(server)
    const path = '/see_noti';
    see_noti(server, path);
        });
