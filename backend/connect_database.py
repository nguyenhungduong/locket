import mysql.connector
from PIL import Image
from io import BytesIO
        
# # Thực hiện kết nối đến cơ sở dữ liệu MySQL
# conn = mysql.connector.connect(
#     host="localhost",          # Địa chỉ máy chủ MySQL
#     user="root",           # Tên người dùng MySQL
#     password="1234",       # Mật khẩu của người dùng MySQL
#     database="websocket"   # Tên cơ sở dữ liệu MySQL
# )


# Sau khi làm việc với cơ sở dữ liệu, đừng quên đóng kết nối
import mysql.connector
#kết nối database
def connect():
    global conn
    try:
        conn = mysql.connector.connect(
            host='localhost',    # Change hostname if necessary
            user='root',  # Change username
            password='1234',  # Change password
            database='locket'
        )
        print("kết nối với MySQL thành công")
    except mysql.connector.Error as err:
        print("kết nối với MySQL không thành công", err)
    return conn
#hủy kết nối
def disconnect():
    if conn:
        conn.close()
        print("đã dừng kết nối với MySQL")

#đăng ký và thêm dữ liệu và status
def signUp(username,password,email,full_name,date_of_birth,gender,file):
    connect()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO user_information (username, password, email, full_name, date_of_birth, gender,image) VALUES (%s, %s, %s, %s, %s, %s,%s)', 
                        (username, password, email, full_name, date_of_birth, gender,file))
    # Lấy id_user vừa thêm
    user_id = cursor.lastrowid

    # Thêm dữ liệu vào bảng status
    add_status = ("INSERT INTO status_user (id_user) VALUES (%s)")
    status_data = (user_id,)
    cursor.execute(add_status, status_data)

    conn.commit()
#đăng nhập
def signIn(username,password):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT id_user FROM user_information WHERE username = %s AND password = %s', (username, password))
    user = cursor.fetchone()
    return user
#tạo bài viết
def create_post(content,file,date,id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO post (image,content,time_post,id_user) VALUES (%s, %s, %s, %s)', 
                        (file, content, date,id_user))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được thêm thành công
    else:
        return False
# tạo số lượng tim cho bài viết và lấy bài viết 
def select_post_user(id_user):
    connect()
    cursor = conn.cursor()

    cursor.execute('''UPDATE post
SET post.like = (
    SELECT COUNT(cl.id_user)
    FROM count_like cl
    WHERE cl.id_post = post.id_post
);''')
    # Lưu thay đổi
    conn.commit()
    cursor.execute('''SELECT 
    DISTINCT user_information.id_user, 
    user_information.full_name, 
    user_information.image AS user_image, 
    post.content, 
    post.image AS post_image, 
    post.time_post, 
    post.like, 
    post.id_post
FROM 
    post
JOIN 
    user_information ON post.id_user = user_information.id_user
LEFT JOIN 
    friendships ON (user_information.id_user = friendships.user_id OR user_information.id_user = friendships.friend_id)
    and friendships.status='accepted'
WHERE 
    user_information.id_user = %s OR 
    friendships.user_id = %s OR 
    friendships.friend_id = %s 
                   
                
ORDER BY 
    post.time_post DESC;''', ( id_user,id_user,id_user,))
    posts = cursor.fetchall()
    # In kết quả
    # for row in posts:
    #     print(row)
    return posts
#tìm kiếm bạn bè
def search_name(text_name,id_client):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT id_user,image,full_name FROM user_information WHERE full_name LIKE %s AND id_user != %s', ('%' + text_name + '%', id_client,))
    posts = cursor.fetchall()
    # In kết quả
    # for row in posts:
    #     print(row)
    return posts
#thêm kết bạn
def insert_friend(id_fiend,id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO friendships (user_id,friend_id) VALUES ( %s, %s)', 
                        (id_user, id_fiend))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được thêm thành công
    else:
        return False
#kiểm tra đã là bạn bè chưua
def check_friend(id_fiend,id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM friendships WHERE user_id = %s AND friend_id = %s', (id_user, id_fiend))
    friend = cursor.fetchone()
    return friend
#lấy những bạn bè chưa kết bạn
def confirm_friendship(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('''SELECT id,user_id,user_information.full_name,image FROM friendships 
        JOIN user_information ON friendships.user_id = user_information.id_user 
        and friendships.status='pending' and friendships.friend_id= %s''', ( id_user,))
    posts = cursor.fetchall()
    # In kết quả
    # for row in posts:
    #     print(row)
    return posts
#đồng ý kết bạn
def agree_friend(id_friend,id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute("UPDATE friendships SET status = 'accepted' WHERE user_id = %s and friend_id=%s;", 
                        (id_user, id_friend))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được thêm thành công
    else:
        return False
#lấy thông tin user
def setting_profile(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT id_user,image,full_name FROM user_information WHERE id_user= %s', ( id_user,))
    user = cursor.fetchone()
    return user
#lấy những ng đã đồng ý kết b
def get_friend(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('''SELECT full_name,user_id
    FROM friendships 
    JOIN user_information ON friendships.user_id = user_information.id_user 
    WHERE friendships.status = 'accepted' AND friendships.friend_id = %s 
    
    UNION ALL
    
    SELECT full_name,friend_id
    FROM friendships 
    JOIN user_information ON friendships.friend_id = user_information.id_user 
    WHERE friendships.status = 'accepted' AND  friendships.user_id = %s''', ( id_user,id_user))
    users = cursor.fetchall()
    return users
#lưu tin nhắn
def save_mess(sender_id,receiver_id,message):
    connect()
    cursor = conn.cursor()
    cursor.execute('''INSERT INTO mess (sender_id,receiver_id,message) VALUES ( %s, %s, %s)''', ( sender_id,receiver_id,message))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được thêm thành công
    else:
        return False
#lấy tin nhắn
def get_mess(sender_id,receiver_id):
    connect()
    cursor = conn.cursor()
    cursor.execute('''SELECT sender_id, receiver_id, message, times
FROM locket.mess
WHERE (sender_id = %s AND receiver_id = %s)
   OR (sender_id = %s AND receiver_id = %s) ORDER BY times ASC;''', ( sender_id,receiver_id,receiver_id,sender_id))
    user = cursor.fetchall()
    return user
#sửa bài viết
def update_post(id_post ,content ,img):
    connect()
    cursor = conn.cursor()
    cursor.execute("UPDATE post SET content = %s,image=%s WHERE id_post =%s ;", 
                        (content,img, id_post))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được sửa thành công
    else:
        return False
#xóa bài viết
def delete_post(id_post):
    connect()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM post WHERE id_post = %s", (id_post,))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được sửa thành công
    else:
        return False
#sửa thông tin user
def up_user(id_user,full_name,gender,date_of_birth,image,email,password,account_name):
    connect()
    cursor = conn.cursor()
    sql = "UPDATE user_information SET"
    sql_params = []

    if len(password) != 0:
        sql += " password=%s,"
        sql_params.append(password)
    if len(email) != 0:
        sql += " email=%s,"
        sql_params.append(email)
    if len(full_name) != 0:
        sql += " full_name=%s,"
        sql_params.append(full_name)
    if len(date_of_birth) != 0:
        sql += " date_of_birth=%s,"
        sql_params.append(date_of_birth)
    if len(gender) != 0:
        sql += " gender=%s,"
        sql_params.append(gender)
    if image is not None:
        sql += " image=%s,"
        sql_params.append(image.read())
    if len(account_name) != 0:
        sql += " username=%s,"
        sql_params.append(account_name)

    # Loại bỏ dấu phẩy cuối cùng nếu có
    if sql.endswith(','):
        sql = sql[:-1]

    sql += " WHERE id_user=%s"
    sql_params.append(id_user)
    print(sql)
    cursor.execute(sql, tuple(sql_params))

    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được sửa thành công
    else:
        return False
#lấy bài viết của bạn bè hay của mình
def select_post_fr(id_fr):
    connect()
    cursor = conn.cursor()
    cursor.execute('''SELECT 
    user_information.id_user, 
    user_information.full_name, 
    user_information.image AS user_image, 
    post.content, 
    post.image AS post_image, 
    post.time_post, 
    post.like, 
    post.id_post
FROM 
    post
JOIN 
    user_information ON post.id_user = user_information.id_user
WHERE 
    user_information.id_user = %s
ORDER BY 
    post.time_post DESC;''', ( id_fr,))
    posts = cursor.fetchall()
    # In kết quả
    # for row in posts:
    #     print(row)
    return posts
#kiểm tra đã có username chưa
def check_username(username):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT username FROM locket.user_information where username=%s;', ( username,))
    posts = cursor.fetchone()
    print(posts)
    return posts
#like bài viết
def like_post(id_post,id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute(" INSERT INTO count_like (id_post,id_user) VALUES ( %s, %s);", 
                        (id_post, id_user))
    conn.commit()
    if cursor.rowcount > 0:
        return True 
    else:
        return False
#hủy like
def unlike_post(id_post,id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute(" DELETE FROM count_like WHERE id_post = %s AND id_user = %s ;", 
                        (id_post, id_user))
    conn.commit()
    if cursor.rowcount > 0:
        return True 
    else:
        return False
#lấy id bài viết mà người dùng đã like
def get_user_like(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT id_post FROM count_like where id_user=%s;', ( id_user,))
    posts = cursor.fetchall()
    return posts
#lưu thông báo tin nhắn
def save_notification(sender_id,receiver_id,message,form):
    connect()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO `notification` (`notification_form`, `notification_text`, `id_user`, `id_user_send`) VALUES (%s, %s, %s, %s);", 
                        (form, message,receiver_id,sender_id))
    conn.commit()
    if cursor.rowcount > 0:
        return True 
    else:
        return False
#lưu thông báo kết bạn
def notification_friend(id_user,id_user_send,noti_form,noti_text):
    connect()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO `notification` (`notification_form`, `notification_text`, `id_user`, `id_user_send`) VALUES (%s, %s, %s, %s);", 
                        (noti_form, noti_text,id_user,id_user_send))
    conn.commit()
    if cursor.rowcount > 0:
        return True 
    else:
        return False
#lấy thông báo
def get_notification(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('''SELECT
    notification.notification_form,
    notification.notification_text,
    notification.status,
    sender.full_name AS sender_fullname,
    sender.image AS sender_image
FROM
    notification
JOIN
    user_information AS sender ON notification.id_user_send = sender.id_user
WHERE
    notification.id_user = %s
ORDER BY
    notification.date_ DESC;''', ( id_user,))
    notifi = cursor.fetchall()
    # In kết quả
    # for row in posts:
    #     print(row)
    return notifi
#lấy số lượng thông báo chưa xem
def get_count_noti(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('''SELECT COUNT(*) AS unseen_count
FROM notification
JOIN user_information AS sender ON notification.id_user_send = sender.id_user
WHERE notification.id_user = %s AND notification.status = 'unseen';''', ( id_user,))
    notifi = cursor.fetchone()
    # In kết quả
    # for row in posts:
    #     print(row)
    return notifi
#xem thông báo
def see_notifi(id_user,form):
    connect()
    cursor = conn.cursor()
    if not form:
        cursor.execute("UPDATE notification SET status = 'seen' WHERE id_user = %s ;", 
                        (id_user,))
    else:
        
        cursor.execute("UPDATE notification SET status = 'seen' WHERE id_user = %s and notification_form=%s;", 
                        (id_user, form))
    conn.commit()
    if cursor.rowcount > 0:
        return True  # Trả về True nếu có ít nhất một hàng được thêm thành công
    else:
        return False
#check status của người dùng
def check_status_user(id_user):
    connect()
    cursor = conn.cursor()
    cursor.execute('SELECT status FROM status_user where id_user=%s;', ( id_user,))
    posts = cursor.fetchone()
    return posts