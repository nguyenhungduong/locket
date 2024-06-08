from flask import Flask, jsonify,render_template,request,redirect,url_for,session, make_response # pip install flask
import sys
from datetime import datetime, timedelta
import os
import base64
from PIL import Image # pip install pillow
import logging
import io
from flask_socketio import SocketIO,send, emit, disconnect # pip install flask-socketio
sys.path.append('C:\\Users\\Administrator\\Desktop\\locket_web\\database')
from database.connect_database import check_status_user,see_notifi,get_count_noti,get_notification,notification_friend,save_notification,get_user_like,unlike_post,like_post,check_username,select_post_fr,up_user,delete_post,update_post, get_friend,setting_profile,agree_friend,confirm_friendship,signIn,connect,create_post,signIn,signUp,search_name,insert_friend,check_friend,select_post_user,save_mess,get_mess
#chuyển ảnh thành byte
def image_to_blob(file_path):
    # Đọc ảnh từ thư mục
    with open(file_path, 'rb') as file:
        img = Image.open(file)
        # Chuyển đổi ảnh thành dạng nhị phân
        img_byte_array = io.BytesIO()
        img.save(img_byte_array, format='JPEG')  # Thay đổi 'JPEG' thành định dạng ảnh của bạn nếu cần
        img_byte_array = img_byte_array.getvalue()
        return img_byte_array
#chuyển date
def date(date):
    # Lấy thời gian hiện tại
    current_time = datetime.now()

    # Tính khoảng cách thời gian giữa date_from_mysql và thời gian hiện tại
    time_difference = current_time - date

    # Kiểm tra nếu thời gian cách đó chưa đến 1 ngày
    if time_difference < timedelta(days=1):
        # Tính số phút cách đó
        minutes_difference = int(time_difference.total_seconds() / 60)
        if minutes_difference < 60:
            time_ago = f"{minutes_difference} phút trước"
        else:
            hours_difference = minutes_difference // 60
            time_ago = f"{hours_difference} giờ trước"
    else:
        # Kiểm tra nếu thời gian cách đó chưa đến 1 tuần
        if time_difference < timedelta(weeks=1):
            days_difference = time_difference.days
            time_ago = f"{days_difference} ngày trước"
        else:
            # Nếu lớn hơn 1 tuần, hiển thị ngày tháng
            time_ago = date.strftime("%d/%m")
                # Kiểm tra nếu thời gian cách đó chưa đến 1 năm
            if time_difference < timedelta(days=365):
                time_ago = date.strftime("%d/%m")
            else:
                # Nếu lớn hơn 1 năm, hiển thị ngày tháng năm
                time_ago = date.strftime("%d/%m/%Y")
    return time_ago
app = Flask(__name__,static_url_path='/static')
app.config['SECRET_KEY'] = 'locket'
socketio = SocketIO(app, async_mode='eventlet') # pip install eventlet

#đếm thông báo
def notify_users(id_user):
    sums = get_count_noti(id_user)
    socketio.emit('notification', {'count': sums,'id':id_user})

    
#hiển thị trang đăng ksy đăng nhập
@app.route('/')
def home():
    return render_template('signin.html')

#hiển thị trang thông báo
@app.route('/notification')
def page_notification():
    return render_template('notification.html')

#đăng ksy
@app.route('/signup', methods=['POST'])
def signup():
    if request.method=='POST':
        # for key, value in request.form.items():
        #     print(f'{key}: {value}')
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        full_name = request.form['full_name']
        date_of_birth = request.form['date_of_birth']
        gender = request.form['gender']
        file = image_to_blob('C:\\Users\\Administrator\\Desktop\\locket_web\\static\\img\\avatar_default.jpg')
        signUp(username,password,email,full_name,date_of_birth,gender,file)
    return jsonify({'message': 'đăng ký thành công!'})
#đăng nhập và tạo cookie
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    error = None
    if request.method=='POST':
        username = request.form['username']
        password = request.form['password']
        sign=signIn(username,password)
        id_user=str(sign[0])
        if sign:
            session['id_user'] = id_user
            resp = make_response('đã được thiết lập')
            resp.set_cookie('iduser_cookie', id_user, max_age=60*60*24*3)
            print(session)
            print(request.cookies)
            return resp
        else:
            error = 'Invalid username or password. Please try again.'
    return render_template('signin.html', error=error)
#hiển thị trang chủ
@app.route('/post',methods=['GET'])
def post():
    # if request.method=='GET':
        
    return render_template('home.html')

#tạo bài viết
@app.route('/create_posts', methods=['POST'])
def cr_posts():
    file = request.files['image'].read()
    content = request.form['content']
    date = request.form['date']
    id_user=request.form['id']
    if create_post(content,file,date,id_user):
        return jsonify({'sucsses': 'true'})
    else:
        return jsonify({'error': 'failed'})


#tìm kiếm bạn bè
@app.route('/search',methods=['GET', 'POST'])
def search():
    if request.method=='POST':
        text_search = request.form['search']
        id_client = request.form['id_client']
        data_name=search_name(text_search,int(id_client))
        data_with_base64 = []
        for row in data_name:
            id_user,image_bytes, username = row
            # Chuyển đổi bytes thành Base64 string
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            # Thêm vào mảng mới
            data_with_base64.append((id_user, image_base64, username))

        # Trả về dữ liệu đã được chuyển đổi sang Base64 cho client
        return jsonify(data_with_base64)

    return render_template('search_friend.html')

#check status của người dùng
@app.route('/get_status_user',methods=['GET'])
def get_status_user():
    id_user = request.args.get('id_user')
    status_user=check_status_user(id_user)
    if status_user:
        return jsonify(status_user)
    else:
        return jsonify({'failed': 0})
#lấy những bạn bè chưa kết bạn
@app.route('/c_friendship',methods=['GET'])
def confirm_friend():
    if request.method=='GET':
        id_user = request.args.get('id_user')
        # print(id_user)
        # print(type(id_user))
        data_name=confirm_friendship(int(id_user))
        data = []
        for row in data_name:

            id_friendship,id_friend, full_name,image_bytes = row
            # Chuyển đổi bytes thành Base64 string
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            # Thêm vào mảng mới
            data.append((id_friendship, id_friend, full_name,image_base64))
        # Trả về dữ liệu đã được chuyển đổi sang Base64 cho client
        return jsonify(data)
# kiểm tra đã kêt bạn chưa và thêm kết bạn
@app.route('/makeFriend',methods=['POST'])
def make_friend():
    id_friend = request.form['id_friend']
    id_user = request.form['id_client']
    if check_friend(id_friend,id_user) is None:
        if check_friend(id_user,id_friend) is None:
            if insert_friend(id_friend,id_user):
                return jsonify({'sucsses': 1})
            else:
                return jsonify({'sucsses': 0})
        else:
           return jsonify({'sucsses': 2})
           print("1",id_user,id_friend)
    else:
        print("0",id_friend,id_user)
        return jsonify({'sucsses': 2})
#đăng xuất
@app.route('/logout',methods=['POST'])
def logout():
    if request.method=='POST':
        # Xóa cookie
        response = make_response()  # Chuyển hướng đến trang đăng nhập
        response.set_cookie('iduser_cookie')     # Xóa cookie có tên 'session'
        # Xóa session
        session.clear()  # Xóa tất cả các biến trong session

    return response
#hiển thị trang cài đặt
@app.route('/setting',methods=['GET'])
def setting():
    return render_template('setting.html')
#lấy thông tin user và hiển thị trang cài đặt
@app.route('/getsetting',methods=['GET'])
def getsetting():
    if request.method=='GET':
        id_user = request.args.get('id_user')
        # print(id_user)
        data_name=setting_profile(int(id_user))
        # print(data_name)
        id_user, image_bytes,full_name = data_name
        # Chuyển đổi bytes thành Base64 string
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        # Thêm vào mảng mới
        data=[id_user, image_base64,full_name]
        # Trả về dữ liệu đã được chuyển đổi sang Base64 cho client
        return jsonify(data)
#lấy bài viết của bạn bè và mình hoặc của mình hoặc của bạn bè
@app.route('/get_post_data',methods=['GET'])
def get_post():
    if request.method=='GET':
        id_user = request.args.get('id_user')
        # print(type(id_user))
        id_fr = request.args.get('id_fr')
        if id_fr is not None:
            data_name=select_post_fr(int(id_fr))
            print('haha')
        else:
            data_name=select_post_user(int(id_user))
            print('huhu')
        data = []
        for row in data_name:
            # print(row)
            id_user,full_name, image_user,content,image_post,time,like,id_post = row
            # Chuyển đổi bytes thành Base64 string
            image_post_base64 = base64.b64encode(image_post).decode('utf-8')
            image_avarta_base64 = base64.b64encode(image_user).decode('utf-8')
            # Thêm vào mảng mới
            time_post=date(time)
            data.append((id_user,full_name, image_avarta_base64,content,image_post_base64,time_post,like,id_post))
        # Trả về dữ liệu đã được chuyển đổi sang Base64 cho client
        return jsonify(data)
#đồng ý kết bạn
@app.route('/agree_friend',methods=['POST'])
def agreefriend():
    id_friend = request.form['id_friend']
    id_user = request.form['id_client']   
    if agree_friend(id_friend,id_user):
        return jsonify({'sucsses': 1})
    else:
        if agree_friend(id_user,id_friend):
            return jsonify({'sucsses': 1})
        else:
            return jsonify({'sucsses': 0})
#lấy trang nhắn tin 
@app.route('/mess')
def mess():
    return render_template('messenger.html')
#lấy bạn bè đã chấp nhận
@app.route('/get_friend',methods=['GET'])
def get_friends():
    if request.method=='GET':
        id_user = request.args.get('id_user')
        data_name=get_friend(int(id_user))
        return jsonify(data_name)
#lấy thông báo
@app.route('/get_noti',methods=['GET'])
def get_notii():
    if request.method=='GET':
        id_user = request.args.get('id_user')
        data_names=get_notification(id_user)
        data = []
        for row in data_names:
            # print(row)
            notification_form,notification_text, status,sender_fullname,sender_image = row
            # Chuyển đổi bytes thành Base64 string
            image_user_base64 = base64.b64encode(sender_image).decode('utf-8')
            # Thêm vào mảng mới
            data.append((notification_form,notification_text,status,sender_fullname,image_user_base64))
        # Trả về dữ liệu đã được chuyển đổi sang Base64 cho client
        return jsonify(data)
#lấy id bài viết mà người dùng đã like
@app.route('/get_user_like',methods=['GET'])
def get_user_l():
    id_user = request.args.get('id_user')
    data = get_user_like(id_user)
    return jsonify(data)

#lấy tin nhắn
@app.route('/getmess',methods=['GET'])
def get_message():
    if request.method=='GET':
        sender_id = request.args.get('sender_id')
        receiver_id = request.args.get('receiver_id')
        print(sender_id,receiver_id)
        data_name=get_mess(int(sender_id),int(receiver_id))
        if len(data_name)==0:
            data_name=get_mess(int(receiver_id),int(sender_id))
        
        return jsonify(data_name)


#sửa bài viết
@app.route('/update_posts',methods=['POST'])
def updt_post():
    file = request.files['image'].read()
    content = request.form['content']
    id_post=request.form['id']
    if update_post(id_post ,content ,file):
        return jsonify({'sucsses': 'true'})
    else:
        return jsonify({'error': 'failed'})

#like bài viết
@app.route('/like_post',methods=['POST'])
def like_p():
    id_post = request.form['id_post']
    id_user=request.form['id_userr']
    print(id_user,id_post)
    if like_post(id_post ,id_user):
        return jsonify({'sucsses': 1})
    else:
        return jsonify({'error': 0})
#unlike bài viết
@app.route('/unlike_post',methods=['POST'])
def unlike_p():
    id_post = request.form['id_post']
    id_user=request.form['id_userr']
    print(id_user,id_post)
    if unlike_post(id_post ,id_user):
        return jsonify({'sucsses': 1})
    else:
        return jsonify({'error': 0})
#xóa bài viết
@app.route('/delete_post',methods=['POST'])
def delet_post():
    id_post=request.form['id']
    if delete_post(id_post):
        return jsonify({'sucsses': 'true'})
    else:
        return jsonify({'error': 'failed'})

#kiểm tra username
@app.route('/check_username',methods=['GET'])
def check_u():
    username = request.args.get('username')
    if check_username(username) is None:
        return jsonify({'sucsses': 1})
    else:
        return jsonify({'sucsses': 0})

#lấy trang sửa user
@app.route('/update_user',methods=['GET'])
def update_user():
    return render_template('update_profile.html')

#lấy thông báo người dùng
@app.route('/get_count_noti',methods=['GET'])
def get_count_no():
    id_user = request.args.get('id_user')
    count=get_count_noti(id_user)
    
    return jsonify({'result': count})

#xemm thông báo
@app.route('/see_noti', methods=['POST'])
def see_noti():
    form = request.form['form']
    id_user = request.form['id_user']
    noti=see_notifi(id_user,form)
    notify_users(id_user)
    if noti:
        return jsonify({'sucsses': 1})
    else:
        return jsonify({'sucsses': 0})
    
    
#lưu thông báo kết bạn 
@app.route('/notification_friend',methods=['POST'])
def noti_friend():
    id_user=request.form['id_user']
    id_user_send=request.form['id_user_send']
    noti_form=request.form['noti_form']
    noti_text=request.form['noti_text']
    noti=notification_friend(id_user,id_user_send,noti_form,noti_text)
    notify_users(id_user)
    if noti:
        return jsonify({'sucsses': 'true'})
    else:
        return jsonify({'sucsses': 'failed'})
    
 
#sửa thông tin user
@app.route('/upd_user',methods=['POST'])
def sua_user():
    account_name = request.form.get('account_name', None)
    password = request.form.get('password', None)
    email = request.form.get('email', None)
    full_name = request.form.get('full_name', None)
    date_of_birth = request.form.get('date_of_birth', None)
    gender = request.form.get('gender', None)
    id_user = request.form.get('id', None)
    image = request.files.get('image', None)

    if up_user(id_user,full_name,gender,date_of_birth,image,email,password,account_name):
        return jsonify({'sucsses': 1})
    else:
        return jsonify({'sucsses': 0})

clients  = {}
#kết nối với socket
@socketio.on('connect')
def handle_connect(data):
    user_id = request.args.get('id')
    if user_id:
        clients[request.sid] = user_id
    print('Client connected:', user_id)
    print(clients.items())
    emit('status', {'msg': f'User {user_id} connected', 'clients': list(clients.values())}, broadcast=True)
# hủy kết nối với socket
@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in clients:
        user_id = clients[request.sid]
        del clients[request.sid]
        emit('status', {'msg': f'User {user_id} disconnected', 'clients': list(clients.values())}, broadcast=True)
#xem gửi và nhận tin nhắn lưu vào sql và đối phương không onl thì gửi thồn báo tin nhắn
@socketio.on('message')
def handle_message(data):
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    message = data.get('message')
    form = data.get('form')
    status=0
    for sid, uid in clients.items():
        if uid == receiver_id:
            status = 1
            break  # ID của client nhận tin nhắn
    if status==0:
        save_notification(sender_id,receiver_id,message,form)
        notify_users(receiver_id)
        print('đã lưu thông báo')
    print("status ",status)
    print(f'Received message from {sender_id} to {receiver_id}: {message}')
    # Lưu tin nhắn vào cơ sở dữ liệu
    save_mess(sender_id,receiver_id,message)
    emit('message', {'sender_id': sender_id, 'receiver_id': receiver_id, 'message': message}, broadcast=True)



#đếm thông báo
@socketio.on('notification')
def handle_message(data):
    id_user = data.get('id_user')
    sums=get_count_noti(id_user)
    emit('notification', {'count': sums,'id':id_user}, broadcast=True)

if __name__ == '__main__':
    # app.run(debug=True)
    socketio.run(app, port="6679", debug=True, host="14.225.210.13")







