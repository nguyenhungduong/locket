
function get_noti(server,path){
var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    $.ajax({
        url: server + path,
        type: 'GET',
        data: {
            id_user: idUserCookie
        },
        success: function (response) {
            // Hành động sau khi nhận được phản hồi thành công từ Flask
            console.log(response); // In ra phản hồi từ Flask (nếu có)
            
            if(response.length==0){
                alert('không có thông báo')
            }else{
                display_noti(response)
            }
        },
        error: function (xhr, status, error) {
            // Xử lý lỗi (nếu có)
            console.error(error); // In ra lỗi (nếu có)
        }
    });
}
function see_noti(server, path){
const sender_id = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
    const formData = new FormData();
    formData.append('id_user', sender_id);
    formData.append('form', '');
    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
            console.log(response);
            if(response.sucsses){
                console.log("xem thông báo hết")
            }else{
                console.log("chưa thông báo hết")
            }
            ; // Chuyển hướng đến URL khác
            
        },
        error: function(xhr, status, error) {
            console.error('Request failed. error:', error);
/*            console.error('Request failed. Status:', status);
        console.error('Request failed. xhr:', xhr);*/
            alert("lỗi xem thông báo");
        }
    });
}
function click_noti(){

    $('.message').on('click', function() {
        console.log("đã ấn")
                window.location.href = "/mess"
            });
    $('.makeFriend').on('click', function() {
                window.location.href = "/search"
                console.log("đã ấn")
            });
}
function display_noti(response){
    var resultDiv = document.getElementById("notifications-container");
    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }
    $.each(response, function (index, tuple) {
        let form = tuple[0];
        let text = tuple[1];
        let status = tuple[2];
        let full_name = tuple[3];
        let img_user_send = tuple[4];
        let html = `<div class="${form} ${status}">
        <img src="data:image/jpeg;base64,${img_user_send}" alt="Sender Image">
        <div class="notification-content">
            <div class="sender">${full_name}</div>
            <div class="message">${text}</div>
        </div>
    </div>`
    $('#notifications-container').append(html);
    });
    const server = serverrr;
    const path = '/see_noti';
    see_noti(server, path);
    click_noti()
}
$(document).ready(function() {
            const server = serverrr;
            console.log(server)
    const path = '/get_noti';
    get_noti(server, path);
        });

