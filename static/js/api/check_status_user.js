

function delete_cookie(server, path) {

    $.ajax({
        url: server + path,
        type: 'POST',
        success: function(response) {
            console.log(response);
            window.location.href = '/'; // Chuyển hướng đến URL khác
            /*for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);

    }*/
        },
        error: function(xhr, status, error) {
            console.error('Request failed. error:', error);
/*            console.error('Request failed. Status:', status);
        console.error('Request failed. xhr:', xhr);*/
        }
    });
}

function get_status_user(server,path){
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(idUserCookie)
    $.ajax({
        url: server + path,
        type: 'GET',
        data: {
            id_user: idUserCookie
        },
        success: function (response) {
            // Hành động sau khi nhận được phản hồi thành công từ Flask
            console.log(response[0]); // In ra phản hồi từ Flask (nếu có)
            if(response[0]=='die'){
                alert('tài khoản của bạn đã Admin bị xóa')
                delete_cookie(server, "/logout")
            }
            if(response[0]=='block'){
                alert('tài khoản của bạn đã Admin bị chặn')
                delete_cookie(server, "/logout")
            }

        },
        error: function (xhr, status, error) {
            // Xử lý lỗi (nếu có)
            console.error(error); // In ra lỗi (nếu có)
        }
    });
}

$(document).ready(function() {
const server = serverrr;
    const path = '/get_status_user';
console.log("kiem tra")
 get_status_user(server,path)
        });