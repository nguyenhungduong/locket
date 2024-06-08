
function post_unlike(id_post,heartIcon,count_like){
     var id_user_like = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(id_post)
    console.log(id_user_like)
    const formData = new FormData();
    formData.append('id_post', id_post);
    formData.append('id_userr', id_user_like);

    const server = serverrr
    $.ajax({
        url: server + "/unlike_post",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            // get_like()
            console.log("unlike")
            var number_of_likes = parseInt(count_like.textContent);
    
            // Tăng số lượng like lên 1 và gán lại vào phần tử
            count_like.textContent = number_of_likes - 1;
            heartIcon.classList.remove('liked');

            heartIcon.classList.replace('fas', 'far'); // Chuyển đổi từ đầy (fas) sang rỗng (far)

        },
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("lỗi unlike  bài viết");
        }
    });
}

function black_like(list_id_post){
    console.log()
    $.each(list_id_post, function(i, value) {
    const postId = value[0] ;
    let id = document.getElementById(postId)
    
    console.log(postId)
        console.log(id)
    if (id !== null) {
        const heartIcon= id.querySelector('.actions .like-btn i.far.fa-heart');
        heartIcon.classList.add('liked');
    heartIcon.classList.replace('far', 'fas');
    }
    
  });

}
function select_like(){
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const server=serverrr
    const path="/get_user_like"
    $.ajax({
        url: server + path,
        type: 'GET',
        data: {
            id_user: idUserCookie
        },
        success: function (response) {
            // Hành động sau khi nhận được phản hồi thành công từ Flask
            console.log(response); // In ra phản hồi từ Flask (nếu có)

           black_like(response);
        },
        error: function (xhr, status, error) {
            // Xử lý lỗi (nếu có)
            console.error(error); // In ra lỗi (nếu có)
        }
    });
}
function post_like(id_post,heartIcon,count_like){
     var id_user_like = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(id_post)
    console.log(id_user_like)
    const formData = new FormData();
    formData.append('id_post', id_post);
    formData.append('id_userr', id_user_like);

    const server = serverrr
    $.ajax({
        url: server + "/like_post",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            // get_like()
            console.log("like")
            var number_of_likes = parseInt(count_like.textContent);
    
    // Tăng số lượng like lên 1 và gán lại vào phần tử
    count_like.textContent = number_of_likes + 1;
            heartIcon.classList.add('liked');

            heartIcon.classList.replace('far', 'fas'); // Chuyển đổi từ rỗng (far) sang đầy (fas)

        },
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("lỗi like  bài viết");
        }
    });
}

function get_post(server, path) {
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
            console.log(typeof response);
            display_post(response)
        },
        error: function (xhr, status, error) {
            // Xử lý lỗi (nếu có)
            console.error(error); // In ra lỗi (nếu có)
        }
    });
}

function delete_post(id_post) {

    console.log(id_post)
    const formData = new FormData();
    formData.append('id', id_post);
    const server = serverrr
    $.ajax({
        url: server + "/delete_post",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            load_post()
            editForm.style.display = 'none';
        },
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("lỗi xóa  bài viết");
        }
    });
}
function Update_post(editForm, id_post) {
    const content = document.getElementById('update_content_post').value;
    const file = $('#update_file_image')[0].files[0];
    // Kiểm tra nội dung và tệp hình ảnh
    if (content.trim() === "") {
        alert('Nội dung không được để trống');
        return;
    }

    if (!file) {
        alert('Vui lòng chọn một tệp hình ảnh');
        return;
    }
    console.log(content)
    console.log(file)
    console.log(id_post)
    const formData = new FormData();
    formData.append('content', content);
    formData.append('image', file);
    formData.append('id', id_post);
    const server = serverrr
    $.ajax({
        url: server + "/update_posts",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            console.log(response);
            load_post()
            /*for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
    }*/editForm.style.display = 'none';
        },
        error: function (xhr, status, error) {
            console.error('Request failed. error:', error);
            /*            console.error('Request failed. Status:', status);
                    console.error('Request failed. xhr:', xhr);*/
            alert("lỗi sửa tạo bài viết");
        }
    });

}

//hiển thị 
function showEditForm(id_post,editForm,editButton) {

document.addEventListener('click', function (event) {
        var isClickInsideForm = editForm.contains(event.target) || editButton.contains(event.target);
        // Nếu không phải, div hay butto sẽ tự động ẩn đi
        console.log(isClickInsideForm,editForm.contains(event.target),editButton.contains(event.target))
        if (isClickInsideForm === false) {
            console.log("thay doi")
            editForm.style.display = 'none';
        }else{
            editForm.style.display = 'block';
        }
        })
    console.log(editForm.style.display)

    console.log(editForm.style.display = 'block')

    

    var createPostButton = editForm.querySelector('#update_post');
    createPostButton.addEventListener('click', function (event) {
        event.preventDefault();
        Update_post(editForm, id_post);
    });


}
function addMenuEventListeners(postMenu, post) {

    var editButton = postMenu.querySelector('.edit');
    var deleteButton = postMenu.querySelector('.delete');
    console.log("đã vô 3 chấm")
    //ấn vào nút edit 
    var editForm = document.getElementById('sua');

    editButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log("haha")
        id_post = post.id
        showEditForm(id_post,editForm,editButton);
        postMenu.style.display = 'none';
        // alert('Sửa bài viết: ' + id_post+this.getAttribute("name"));
    });

    

    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();
        id_post = post.id
        const confirmMessage = "Bạn có đồng ý xóa bài viết?";
        const confirmation = confirm(confirmMessage);
        if (confirmation) {
            delete_post(id_post)
        }
        console.log('Xóa bài viết: ' + confirmation);
        // Thêm logic xóa ở đây
    });
}


function like_post(){
    document.querySelectorAll('.like-btn').forEach(function(button) {
    button.addEventListener('click', function(event) {
        // Tìm phần tử cha gần nhất có class là post

        var post = event.target.closest('.post');
        if (!post) return; // Nếu không tìm thấy phần tử cha thì dừng lại

        // Tìm phần tử post-menu trong phần tử cha post
        var id_post = post.id;
        var heartIcon = this.querySelector('i.fa-heart');
        var count_like = this.querySelector('.like-count');
        var number_of_likes=count_like.textContent


        // Check if the post is already liked
        var isLiked = heartIcon.classList.contains('liked');

        console.log(!isLiked)

        if (isLiked) {
            // Nếu đã thích, giảm số lượng thích và thay đổi biểu tượng trái tim
            post_unlike(id_post,heartIcon,count_like)

        } else {
            // Nếu chưa thích, tăng số lượng thích và thay đổi biểu tượng trái tim
            post_like(id_post,heartIcon,count_like)
        }

        
    });
});
}

function click_threedot(){

    //ấn vào nút ba chấm để hiện menu sửa xóa
    bachamElements = document.querySelectorAll('.bacham')
    bachamElements.forEach(function (button) {
        button.addEventListener('click', function (event) {
            // Tìm phần tử cha gần nhất có class là post
            var post = event.target.closest('.post');
            // Tìm phần tử post-menu trong phần tử cha post
            var postMenu = post.querySelector('.post-menu');
            // Kiểm tra trạng thái hiện tại của post-menu
            console.log("đã vô 3 chấm")
            if (postMenu.style.display === 'block') {
                postMenu.style.display = 'none'; // Nếu đang hiển thị, ẩn đi
            } else {
                // Ẩn tất cả các menu trước khi hiển thị menu được chọn
                // Lấy vị trí của nút bacham
                var rect = button.getBoundingClientRect();
                // Tính toán vị trí của menu để hiển thị dưới chéo của nút bacham
                postMenu.style.display = 'block';
                postMenu.style.top = rect.bottom + window.scrollY + 'px';
                postMenu.style.left = rect.left + window.scrollX + 'px';
                //
                addMenuEventListeners(postMenu, post)
            }
        });
    });
}
function display_post(list_friend) {
    var idUserCookie = document.cookie.replace(/(?:(?:^|.*;\s*)iduser_cookie\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var resultDiv = document.getElementById("post-container");
    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }

    $.each(list_friend, function (index, tuple) {
        let id_user = tuple[0];
        let name = tuple[1];
        let img_avarta = tuple[2];
        let content = tuple[3];
        let img_post = tuple[4];
        let time = tuple[5];
        let heart = tuple[6];
        let id_post = tuple[7];
        let html = ``
        if (id_user == idUserCookie) {
            // Tạo HTML sử dụng template strings và nhúng biến JavaScript
            html += `
        <div class="post" id="${id_post}">
            <div class="header">
                <img src="data:image/jpeg;base64,${img_avarta}" alt="Profile Picture">
                <div class="user-details">
                    <div class="username">${name}</div>
                    <div class="time">${time}</div>
                </div>
                <div class="ellipsis" ><button class="bacham">...
                </button></div>
            </div>
            <div class="image">
                <img src="data:image/jpeg;base64,${img_post}" alt="Post Image">
            </div>
            <div class="caption">${content}</div>
            <div class="actions">
                <button class="like-btn">
                    <i class="far fa-heart"></i>
                    <span class="like-count">${heart}</span>
                </button>
            </div>
            <div class="post-menu" >  <ul>
            <li><a href="#" class="edit" name="edit">Edit</a></li>
            <li><a href="#" class="delete" name="delete">Delete</a></li>
          </ul>
          </div>
        </div>
    `;
        } else {
            html += `<div class="post" id="${id_post}">
            <div class="header">
                <img src="data:image/jpeg;base64,${img_avarta}" alt="Profile Picture">
                <div class="user-details">
                    <div class="username">${name}</div>
                    <div class="time">${time}</div>
                </div>
                
            </div>
            <div class="image">
                <img src="data:image/jpeg;base64,${img_post}" alt="Post Image">
            </div>
            <div class="caption">${content}</div>
            <div class="actions">
                <button class="like-btn">
                    <i class="far fa-heart"></i>
                    <span class="like-count">${heart}</span>
                </button>
            </div>
          </div>
        </div>`
        }
        // Thêm HTML vào phần tử có id "friendList" bằng phương thức .html() của jQuery
        $('#post-container').append(html);

    });
    select_like()
    click_threedot()
    like_post()
}
function load_post() {
    // Thực hiện các hành động của bạn ở đây khi trang được tải
    const server = serverrr;
    const path = '/get_post_data';
    get_post(server, path)
}
$(document).ready(load_post());
