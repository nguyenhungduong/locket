//hiển thị tin nhắn đã gửi
function create_send(user) {
    var inbox = document.getElementById('inbox');
    let message = user["message"];
    let sender_id = user["sender_id"];
    let receiver_id = user["receiver_id"];
    let html = `
        <div class="down">
        <div class="mycontent" >${message}</div>
      </div>
    `;

    $('.inbox').append(html);
    inbox.scrollTop = inbox.scrollHeight;

}


//hiển thị tin nhắn nhận
function create_receive(user) {
    var inbox = document.getElementById('inbox');
    let message = user["message"];
    let sender_id = user["sender_id"];
    let receiver_id = user["receiver_id"];
    let html = `
        <div class="down">
        <img src="#" class="avatarinbox"> 
        <div class="yourcontent" >${message}</div>
      </div>
    `;

    $('.inbox').append(html);
    // Lấy thẻ ảnh gốc bằng ID
    setTimeout(function () {
        const originalImg = document.getElementById('image_user1');

        // Lấy thẻ ảnh đích bằng class
        const targetImg = document.querySelectorAll('.avatarinbox');

        console.log(originalImg)
        console.log(targetImg.length - 1)

        console.log(targetImg[targetImg.length - 1])
        // Sao chép thuộc tính src của ảnh gốc sang ảnh đích
        targetImg[targetImg.length - 1].src = originalImg.src;
    }, 0);


    inbox.scrollTop = inbox.scrollHeight;

}

const sender_id = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");

const socket = io(serverrr, {
    query: {
        id: sender_id
    }
});
function get_count_noti(sender_idd) {
    const path = '/get_count_noti';
    const server = serverrr;
    $.ajax({
        url: server + path,
        type: 'GET',
        data: {
            'id_user': sender_idd
        },
        success: function (response) {
            // Hành động sau khi nhận được phản hồi thành công từ Flask
            console.log(response); // In ra phản hồi từ Flask (nếu có)
            $('#noti').find('i').text(response.result);
        },
        error: function (xhr, status, error) {
            // Xử lý lỗi (nếu có)
            console.error(error); // In ra lỗi (nếu có)
            reject(error);
        }
    });

}

// Lắng nghe sự kiện 'notification' từ server
socket.on('notification', function (data) {
    var id_receiver = data["count"];
    console.log(id_receiver);
    var id = data["id"];
    if(id==sender_id){
        $('#noti').find('i').text(id_receiver);
     }else{
         get_count_noti(sender_id)
     }
         

});

// Gửi sự kiện 'notification' lên server khi kết nối được thiết lập
socket.on('connect', function () {
    console.log("connected");
    socket.emit('notification', { id_user: sender_id });
});


socket.on('message', function (msg) {
    if (msg) {
        const element = document.querySelector('.avatar2-container');
        var receiver_id = element.id; // Replace with actual receiver ID
        var sender_id = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var id_receiver = msg["receiver_id"];
        var id_sender = msg["sender_id"];
        console.log(sender_id, id_receiver)
        if (sender_id == id_receiver && receiver_id == id_sender) {
            create_receive(msg)

        }

    } else {
        console.error('Có lỗi khi gửi tin nhắn:', msg.error);
    }
});

// Replace with actual receiver ID
$('#sendd').on('click', function () {
    var message = document.getElementById('message');
    var message_input = message.value.trim()
    console.log("đã gửi")
    if (message_input.length > 0) {
        const element = document.querySelector('.avatar2-container');
        const recipientId = element.id;
        const messageObject = { sender_id: sender_id, receiver_id: recipientId, message: message_input, form: "message" }
        socket.emit('message', messageObject);
        message.value = '';
        create_send(messageObject)
    }
});



socket.on('status', function (data) {
    isConnected = data.msg;
    console.log(isConnected)

    let haha = data.clients
    console.log(haha)
});

function see_noti(server, path) {
    const formData = new FormData();
    formData.append('id_user', sender_id);
    formData.append('form', 'message');
    $.ajax({
        url: server + path,
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            if (response.sucsses) {
                console.log("xem thông báo")
            } else {
                console.log("chưa thông báo")
            }
            ; // Chuyển hướng đến URL khác

        },
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("Đăng nhập tài khoản mật khẩu không đúng");
        }
    });
}

$(document).ready(function () {
    const server = serverrr;
    console.log(server)
    const path = '/see_noti';
    see_noti(server, path);
});


