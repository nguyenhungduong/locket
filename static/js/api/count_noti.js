
const sockett = io(serverrr);

const sender_idd = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");

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
sockett.on('notification', function (data) {
    var id_receiver = data["count"];
    var id = data["id"];

    if (id == sender_idd) {
        $('#noti').find('i').text(id_receiver);
    } else {
        get_count_noti(sender_idd)
    }
});

// Gửi sự kiện 'notification' lên server khi kết nối được thiết lập
sockett.on('connect', function () {
    console.log("connected");
    sockett.emit('notification', { id_user: sender_idd });
});